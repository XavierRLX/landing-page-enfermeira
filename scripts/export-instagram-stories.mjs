// Exporta os quatro Stories da prévia HTML para PNG em resolução nativa.
import { mkdir } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { resolve, dirname } from 'node:path';
import { chromium } from 'playwright';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const input = resolve(root, 'docs/instagram/destaques/sobre-mim.html');
const outputDir = resolve(root, 'artifacts/instagram/sobre-mim');
const names = ['01-apresentacao', '02-trajetoria', '03-compromisso', '04-convite'];

await mkdir(outputDir, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome',
});
try {
  const page = await browser.newPage({
    viewport: { width: 1080, height: 1920 },
    deviceScaleFactor: 1,
  });
  for (let index = 1; index <= names.length; index += 1) {
    await page.goto(`${pathToFileURL(input).href}?slide=${index}`, { waitUntil: 'load' });
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all(Array.from(document.images).filter(img => !img.closest('[hidden]')).map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise((done, reject) => {
          img.addEventListener('load', done, { once: true });
          img.addEventListener('error', () => reject(new Error(`Falha ao carregar imagem: ${img.src}`)), { once: true });
        });
      }));
    });
    const out = resolve(outputDir, `${names[index - 1]}.png`);
    await page.screenshot({ path: out, animations: 'disabled' });
    console.log(out);
  }
  await page.close();
} finally {
  await browser.close();
}
