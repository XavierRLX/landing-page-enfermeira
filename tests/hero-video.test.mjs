import assert from "node:assert/strict";
import { test } from "node:test";
import { initializeHeroVideo } from "../src/scripts/hero-video.js";

function harness() {
  const previous = globalThis.document;
  const doc = new EventTarget();
  const opener = new EventTarget();
  opener.focus = () => {
    opener.focused = true;
  };
  const closer = new EventTarget();
  const sources = [new EventTarget(), new EventTarget()];
  sources.forEach((source, index) => {
    source.dataset = { src: `portrait-${index}.mp4` };
  });
  const status = { textContent: "" };
  const video = new EventTarget();
  Object.assign(video, {
    paused: true,
    playCount: 0,
    loadCount: 0,
    play() {
      this.playCount++;
      this.paused = false;
      return Promise.resolve();
    },
    pause() {
      this.paused = true;
    },
    load() {
      this.loadCount++;
    },
    querySelectorAll: () => sources,
    querySelector: () => sources.at(-1),
  });
  const dialog = new EventTarget();
  Object.assign(dialog, {
    open: false,
    showModal() {
      this.open = true;
    },
    close() {
      this.open = false;
      this.dispatchEvent(new Event("close"));
    },
    querySelector: (selector) => (selector === ".video-close" ? closer : status),
  });
  doc.querySelector = (selector) =>
    ({ ".video-dialog": dialog, "#portrait-video": video, ".video-open": opener })[selector];
  globalThis.document = doc;
  const cleanup = initializeHeroVideo();
  return {
    doc,
    opener,
    closer,
    video,
    dialog,
    status,
    sources,
    cleanup,
    restore() {
      cleanup();
      globalThis.document = previous;
    },
  };
}

test("retrato não baixa vídeo até uma solicitação explícita", () => {
  const ui = harness();
  try {
    ui.doc.dispatchEvent(new Event("scroll"));
    assert.equal(ui.video.playCount, 0);
    assert.equal(ui.video.loadCount, 0);
    assert.equal(ui.sources[0].src, undefined);
    ui.opener.dispatchEvent(new Event("click"));
    assert.equal(ui.dialog.open, true);
    assert.equal(ui.video.playCount, 1);
    assert.equal(ui.sources[0].src, "portrait-0.mp4");
    ui.closer.dispatchEvent(new Event("click"));
    assert.equal(ui.video.paused, true);
    assert.equal(ui.opener.focused, true);
    ui.opener.dispatchEvent(new Event("click"));
    assert.equal(ui.video.loadCount, 1);
  } finally {
    ui.restore();
  }
});

test("Escape e aba oculta pausam sem retomada automática", () => {
  const ui = harness();
  try {
    ui.opener.dispatchEvent(new Event("click"));
    ui.dialog.dispatchEvent(new Event("cancel"));
    assert.equal(ui.video.paused, true);
    ui.opener.dispatchEvent(new Event("click"));
    ui.doc.hidden = true;
    ui.doc.dispatchEvent(new Event("visibilitychange"));
    assert.equal(ui.video.paused, true);
    ui.doc.hidden = false;
    ui.doc.dispatchEvent(new Event("visibilitychange"));
    assert.equal(ui.video.paused, true);
  } finally {
    ui.restore();
  }
});

test("falha da fonte é anunciada e cleanup remove handlers", () => {
  const ui = harness();
  try {
    ui.sources.at(-1).dispatchEvent(new Event("error"));
    assert.match(ui.status.textContent, /Não foi possível carregar/);
    ui.cleanup();
    ui.opener.dispatchEvent(new Event("click"));
    assert.equal(ui.video.playCount, 0);
    assert.equal(ui.dialog.open, false);
  } finally {
    ui.restore();
  }
});

test("reprodução pendente não continua após fechar o diálogo", () => {
  const ui = harness();
  try {
    ui.opener.dispatchEvent(new Event("click"));
    ui.closer.dispatchEvent(new Event("click"));
    ui.video.paused = false;
    ui.video.dispatchEvent(new Event("playing"));
    assert.equal(ui.video.paused, true);
  } finally {
    ui.restore();
  }
});
