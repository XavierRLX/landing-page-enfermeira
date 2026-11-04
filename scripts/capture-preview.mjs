import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";

const url = process.env.PREVIEW_URL || "http://127.0.0.1:4175/";
const output = "artifacts/qa";
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || "chrome" });
const results = [];
try {
  for (const [name, width, height] of [
    ["desktop", 1440, 1000],
    ["mobile", 390, 844],
    ["mobile-small", 320, 740],
    ["tablet", 768, 1024],
  ]) {
    const page = await browser.newPage({ viewport: { width, height } });
    await page.goto(url, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    // Visit every section so lazy assets and one-shot reveals are actually complete.
    await page.addStyleTag({ content: "html { scroll-behavior: auto !important; }" });
    for (const section of await page.locator("main > section, footer").all()) {
      await section.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1300);
    }
    await page.evaluate(() => scrollTo(0, 0));
    await page.waitForTimeout(250);
    await page.screenshot({ path: `${output}/after-${name}-hero.png` });
    await page.screenshot({ path: `${output}/after-${name}.png`, fullPage: true });
    results.push({
      name,
      width,
      height,
      ...(await page.evaluate(() => ({
        documentHeight: document.documentElement.scrollHeight,
        overflow: document.documentElement.scrollWidth > innerWidth,
        imagesLoaded: [...document.images]
          .filter((image) => image.getClientRects().length > 0)
          .every((image) => image.complete && image.naturalWidth > 0),
        gsap: window.gsap?.version,
        videoRequests: performance
          .getEntriesByType("resource")
          .filter((resource) => resource.name.endsWith(".mp4")).length,
      }))),
    });
    await page.close();
  }
} finally {
  await browser.close();
}
await writeFile(`${output}/screenshots.json`, JSON.stringify(results, null, 2) + "\n");
console.log(JSON.stringify(results, null, 2));
