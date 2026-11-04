import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const widths = [320, 360, 375, 390, 414, 430, 768, 1024, 1440];

for (const width of widths) {
  test(`layout, contato e serviços em ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/");
    await page.evaluate(() => document.fonts.ready);
    await expect
      .poll(() => page.evaluate(() => Boolean(window.gsap && window.ScrollTrigger)))
      .toBe(true);
    await expect(page.locator(".hero-portrait")).toBeVisible();
    expect(await page.locator(".hero-portrait").evaluate((image) => image.naturalWidth)).toBe(720);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    for (const card of await page.locator(".service-card").all()) {
      const summary = card.locator("summary");
      if (!(await card.getAttribute("open")) && (await card.getAttribute("open")) !== "")
        await summary.click();
      await expect(card).toHaveAttribute("open", "");
      await expect(card.locator("[data-service]")).toBeVisible();
      const href = await card.locator("[data-service]").getAttribute("href");
      const url = new URL(href);
      expect(url.hostname).toBe("wa.me");
      expect(url.pathname).toBe("/5521964679031");
      expect(url.searchParams.get("text")).toContain(
        await card.locator("[data-service]").getAttribute("data-service"),
      );
      await summary.click();
      await expect(card).not.toHaveAttribute("open", "");
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(
      true,
    );
    expect(errors).toEqual([]);
  });
}

test("menu por teclado, Escape, âncora e mudança de largura", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const toggle = page.locator(".menu-toggle");
  await toggle.focus();
  await page.keyboard.press("Enter");
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await page.keyboard.press("Tab");
  await expect(page.locator("#mobile-menu a").first()).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(toggle).toBeFocused();
  await expect(page.locator("#mobile-menu")).toBeHidden();
  await toggle.click();
  await page.locator('#mobile-menu a[href="#servicos"]').click();
  await expect(page.locator("#servicos")).toBeFocused();
  await expect(page.locator("#mobile-menu")).toBeHidden();
  await toggle.click();
  await page.setViewportSize({ width: 1440, height: 1000 });
  await expect(page.locator("#mobile-menu")).toBeHidden();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
});

test("vídeo só carrega por clique e nunca substitui a foto", async ({ page }) => {
  const mediaRequests = [];
  page.on("request", (request) => {
    if (request.url().includes(".mp4")) mediaRequests.push(request.url());
  });
  await page.goto("/");
  await page.locator("#sobre").scrollIntoViewIfNeeded();
  expect(mediaRequests).toEqual([]);
  expect(await page.locator("#portrait-video").evaluate((video) => video.paused)).toBe(true);
  await page.locator(".video-open").click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expect
    .poll(() => page.locator("#portrait-video").evaluate((video) => video.currentTime))
    .toBeGreaterThan(0);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
  expect(await page.locator("#portrait-video").evaluate((video) => video.paused)).toBe(true);
  await expect(page.locator(".video-open")).toBeFocused();
  await expect(page.locator(".hero-portrait")).toHaveAttribute(
    "src",
    "assets/enfermeira-portrait.webp",
  );
  await page.locator(".video-open").click();
  await page.getByRole("button", { name: "Fechar vídeo" }).click();
  await expect(page.getByRole("dialog")).toBeHidden();
});

test("serviços permitem teclado e cliques rápidos sem perder estado", async ({ page }) => {
  await page.goto("/");
  const cards = page.locator(".service-card");
  const summary = cards.nth(1).locator("summary");
  await summary.focus();
  await page.keyboard.press("Enter");
  await expect(cards.nth(1)).toHaveAttribute("open", "");
  await expect(cards.first()).not.toHaveAttribute("open", "");
  await page.keyboard.press("Space");
  await expect(cards.nth(1)).not.toHaveAttribute("open", "");
  await summary.evaluate((element) => {
    element.click();
    element.click();
    element.click();
  });
  await expect(cards.nth(1)).toHaveAttribute("open", "");
  await page.waitForTimeout(350);
  expect(await cards.nth(1).evaluate((card) => card.style.height)).toBe("");
  await expect(cards.nth(1).locator("a")).toBeVisible();
});

for (const width of [390, 1440]) {
  test(`acessibilidade WCAG AA em ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto("/");
    await page.waitForTimeout(1500);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
    await page.locator(".video-open").click();
    const modal = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(modal.violations).toEqual([]);
  });
}

test("movimento reduzido inicial e ativado em tempo real", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect.poll(() => page.evaluate(() => Boolean(window.ScrollTrigger))).toBe(true);
  expect(await page.evaluate(() => window.ScrollTrigger.getAll().length)).toBe(0);
  await expect(page.locator("h1")).toBeVisible();
  await page.locator(".service-card").nth(1).locator("summary").click();
  expect(
    await page
      .locator(".service-card")
      .nth(1)
      .evaluate((card) => card.getAnimations().length),
  ).toBe(0);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect
    .poll(() => page.evaluate(() => window.ScrollTrigger.getAll().length))
    .toBeGreaterThan(0);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect.poll(() => page.evaluate(() => window.ScrollTrigger.getAll().length)).toBe(0);
});

test("sem JavaScript, navegação, acordeões e contatos continuam úteis", async ({ browser }) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4175/");
  await expect(page.locator('.desktop-nav a[href="#servicos"]')).toBeVisible();
  await page.locator(".service-card").nth(1).locator("summary").click();
  await expect(page.locator(".service-card").nth(1).locator("a")).toBeVisible();
  for (const anchor of await page.locator("[data-whatsapp], [data-service]").all())
    expect(await anchor.getAttribute("href")).toContain("https://wa.me/5521964679031");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await context.close();
});

test("falha no GSAP preserva leitura e interações", async ({ page }) => {
  await page.route("**/vendor/**", (route) => route.abort());
  await page.goto("/");
  await expect(page.locator("h1")).toBeVisible();
  await page.locator(".service-card").nth(2).locator("summary").click();
  await expect(page.locator(".service-card").nth(2).locator("a")).toBeVisible();
  await expect(page.locator(".hero-actions a")).toHaveAttribute(
    "href",
    /https:\/\/wa\.me\/5521964679031/,
  );
});

test("erros de mídia têm alternativa acessível", async ({ page }) => {
  await page.route("**/*.mp4", (route) => route.fulfill({ status: 404, body: "" }));
  await page.goto("/");
  await page.locator(".video-open").click();
  // A failed source never changes the static hero or traps the visitor.
  await expect(page.getByRole("button", { name: "Fechar vídeo" })).toBeVisible();
  await page.getByRole("button", { name: "Fechar vídeo" }).click();
  await expect(page.locator(".hero-portrait")).toHaveAttribute(
    "src",
    "assets/enfermeira-portrait.webp",
  );
});

test("menu e serviços funcionam por toque", async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:4175/");
  await page.locator(".menu-toggle").tap();
  await expect(page.locator("#mobile-menu")).toBeVisible();
  await page.locator('#mobile-menu a[href="#servicos"]').tap();
  await expect(page.locator("#mobile-menu")).toBeHidden();
  const card = page.locator(".service-card").nth(3);
  await card.locator("summary").tap();
  await expect(card.locator("a")).toBeVisible();
  await context.close();
});
