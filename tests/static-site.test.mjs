import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "dist");

async function exists(relativePath) {
  const metadata = await stat(path.join(output, relativePath));
  return metadata.isFile() && metadata.size > 0;
}

test("a saída publica HTML, CSS, módulos e vídeos", async () => {
  const required = [
    "index.html",
    "style.css",
    "hero.css",
    "fonts.css",
    "scripts/main.js",
    "scripts/contact.js",
    "scripts/navigation.js",
    "scripts/services.js",
    "scripts/hero-video.js",
    "assets/enfermeira-scroll.mp4",
    "assets/enfermeira-mobile.mp4",
    "assets/enfermeira-poster.jpg",
    "assets/enfermeira-final.webp",
    "assets/enfermeira-initial-restored.webp",
    "assets/enfermeira-final-restored.webp",
  ];
  await Promise.all(required.map(async (file) => assert.ok(await exists(file), file)));
});

test("a página carrega os módulos e o vídeo sem dependências externas", async () => {
  const html = await readFile(path.join(output, "index.html"), "utf8");
  assert.match(html, /type="module"\s+src="scripts\/main\.js"/);
  assert.match(html, /id="hero-video"/);
  assert.match(html, /href="hero\.css"/);
  assert.doesNotMatch(html, /video-scroll-track|video-caption|professional-card|care-ribbon/);
  assert.match(html, /enfermeira-scroll\.mp4/);
  assert.match(html, /enfermeira-mobile\.mp4/);
  assert.match(html, /data-media-state="initial"/);
  assert.match(html, /class="hero-still hero-still-initial"/);
  assert.match(html, /class="hero-still hero-still-final"/);
  assert.match(html, /data-whatsapp/);
});

test("os módulos JavaScript resolvem suas importações locais", async () => {
  const js = await readFile(path.join(output, "scripts/main.js"), "utf8");
  for (const moduleName of ["contact", "navigation", "services", "hero-video"]) {
    assert.ok(js.includes("./" + moduleName + ".js"));
    assert.ok(await exists("scripts/" + moduleName + ".js"));
  }
});

test("os links do WhatsApp mantêm o contato configurado", async () => {
  const { initializeContacts } = await import("../src/scripts/contact.js");

  const general = {};
  const service = { dataset: { service: "curativos" } };
  const originalDocument = globalThis.document;

  globalThis.document = {
    querySelectorAll(selector) {
      return selector === "[data-whatsapp]" ? [general] : [service];
    },
  };

  try {
    initializeContacts();
    assert.match(general.href, /^https:\/\/wa\.me\/5521964679031\?text=/);
    assert.match(service.href, /curativos/);
    assert.equal(general.rel, "noopener noreferrer");
    assert.equal(service.target, "_blank");
  } finally {
    globalThis.document = originalDocument;
  }
});
