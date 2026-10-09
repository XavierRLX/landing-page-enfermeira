import assert from "node:assert/strict";
import { test } from "node:test";
import { initializeHeroVideo } from "../src/scripts/hero-video.js";

function createEventTarget() {
  const listeners = new Map();
  return {
    addEventListener(name, callback) {
      const callbacks = listeners.get(name) ?? [];
      callbacks.push(callback);
      listeners.set(name, callbacks);
    },
    dispatch(name, event = {}) {
      for (const callback of listeners.get(name) ?? []) callback(event);
    },
  };
}

function createHarness({ reducedMotion = false } = {}) {
  const scroll = createEventTarget();
  const documentEvents = createEventTarget();
  const reduced = { ...createEventTarget(), matches: reducedMotion };
  const button = {
    ...createEventTarget(),
    attributes: {},
    icon: { textContent: "" },
    setAttribute(name, value) {
      this.attributes[name] = value;
    },
    querySelector() {
      return this.icon;
    },
  };

  const video = {
    ...createEventTarget(),
    paused: true,
    ended: false,
    currentTime: 0,
    duration: 6,
    playbackRate: 1,
    playCount: 0,
    play() {
      this.paused = false;
      this.ended = false;
      this.playCount += 1;
      this.dispatch("play");
      return Promise.resolve();
    },
    pause() {
      this.paused = true;
      this.dispatch("pause");
    },
  };

  const oldWindow = globalThis.window;
  const oldDocument = globalThis.document;

  globalThis.window = {
    ...scroll,
    matchMedia() {
      return reduced;
    },
  };
  globalThis.document = {
    ...documentEvents,
    hidden: false,
    querySelector(selector) {
      if (selector === "#hero-video") return video;
      if (selector === ".motion-toggle") return button;
      return null;
    },
  };

  initializeHeroVideo();

  return {
    button,
    video,
    reduced,
    scroll() {
      scroll.dispatch("scroll");
    },
    click() {
      button.dispatch("click");
    },
    changeVisibility(hidden) {
      globalThis.document.hidden = hidden;
      documentEvents.dispatch("visibilitychange");
    },
    cleanup() {
      globalThis.window = oldWindow;
      globalThis.document = oldDocument;
    },
  };
}

test("primeiro scroll dispara reprodução inteira sem controlar currentTime", async () => {
  const ui = createHarness();
  try {
    assert.equal(ui.video.playCount, 0);
    ui.scroll();
    assert.equal(ui.video.playCount, 1);
    assert.equal(ui.video.playbackRate, 2);

    ui.video.currentTime = 2.5;
    ui.scroll();
    ui.scroll();
    assert.equal(ui.video.currentTime, 2.5);
    assert.equal(ui.video.playCount, 1);

    // Allow the simulated play() promise to settle before testing replay.
    await new Promise((resolve) => setImmediate(resolve));
    ui.video.ended = true;
    ui.video.paused = true;
    ui.video.dispatch("ended");
    assert.equal(ui.button.attributes["aria-label"], "Repetir vídeo");

    ui.click();
    assert.equal(ui.video.currentTime, 0);
    assert.equal(ui.video.playCount, 2);
  } finally {
    ui.cleanup();
  }
});

test("reduced motion desativa autoplay, mantendo reprodução manual", () => {
  const ui = createHarness({ reducedMotion: true });
  try {
    ui.scroll();
    assert.equal(ui.video.playCount, 0);
    ui.click();
    assert.equal(ui.video.playCount, 1);
    assert.equal(ui.button.attributes["aria-label"], "Pausar vídeo");
    ui.click();
    assert.equal(ui.video.paused, true);
  } finally {
    ui.cleanup();
  }
});

test("vídeo pausa em aba oculta e retoma ao voltar", async () => {
  const ui = createHarness();
  try {
    ui.scroll();
    await Promise.resolve();
    await Promise.resolve();
    ui.changeVisibility(true);
    assert.equal(ui.video.paused, true);
    ui.changeVisibility(false);
    assert.equal(ui.video.playCount, 2);
  } finally {
    ui.cleanup();
  }
});
