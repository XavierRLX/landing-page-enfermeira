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

function createHarness({
  reducedMotion = false,
  imageFails = false,
  playFails = false,
  deferPlaying = false,
} = {}) {
  const frame = { dataset: { mediaState: "initial" } };
  const finalStill = {
    decode: () => (imageFails ? Promise.reject(new Error("image")) : Promise.resolve()),
  };
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
      if (playFails) return Promise.reject(new Error("autoplay"));
      this.paused = false;
      this.ended = false;
      this.playCount += 1;
      this.dispatch("play");
      if (!deferPlaying) this.dispatch("playing");
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
      if (selector === ".video-frame") return frame;
      if (selector === ".hero-still-final") return finalStill;
      if (selector === "#hero-video") return video;
      if (selector === ".motion-toggle") return button;
      return null;
    },
  };

  initializeHeroVideo();

  return {
    button,
    frame,
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
    assert.equal(ui.frame.dataset.mediaState, "initial");
    ui.scroll();
    assert.equal(ui.video.playCount, 1);
    assert.equal(ui.video.playbackRate, 2);
    assert.equal(ui.frame.dataset.mediaState, "video");

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
    assert.equal(ui.frame.dataset.mediaState, "final");

    ui.click();
    assert.equal(ui.video.currentTime, 0);
    assert.equal(ui.video.playCount, 2);
    assert.equal(ui.frame.dataset.mediaState, "video");
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

const settle = () => new Promise((resolve) => setImmediate(resolve));

test("autoplay bloqueado preserva o still inicial e o controle manual", async () => {
  const ui = createHarness({ playFails: true });
  try {
    ui.scroll();
    await settle();
    assert.equal(ui.frame.dataset.mediaState, "initial");
    assert.equal(ui.button.attributes["aria-label"], "Reproduzir vídeo");
    assert.equal(ui.video.paused, true);
  } finally {
    ui.cleanup();
  }
});

test("still final indisponível e erro de vídeo preservam um retrato", async () => {
  const ui = createHarness({ imageFails: true });
  try {
    ui.scroll();
    await settle();
    ui.video.ended = true;
    ui.video.paused = true;
    ui.video.dispatch("ended");
    assert.equal(ui.frame.dataset.mediaState, "initial");
    ui.video.dispatch("error");
    assert.equal(ui.button.hidden, true);
  } finally {
    ui.cleanup();
  }
});

test("ativar movimento reduzido em outra aba impede retomada automática", async () => {
  const ui = createHarness();
  try {
    ui.scroll();
    await settle();
    ui.changeVisibility(true);
    ui.reduced.matches = true;
    ui.reduced.dispatch("change", { matches: true });
    ui.changeVisibility(false);
    assert.equal(ui.video.paused, true);
    assert.equal(ui.video.playCount, 1);
  } finally {
    ui.cleanup();
  }
});

test("pausa manual conserva o quadro intermediário e retoma sem reiniciar", async () => {
  const ui = createHarness();
  try {
    ui.scroll();
    await settle();
    ui.video.currentTime = 2;
    ui.click();
    assert.equal(ui.video.paused, true);
    assert.equal(ui.frame.dataset.mediaState, "video");
    ui.click();
    assert.equal(ui.video.currentTime, 2);
    assert.equal(ui.video.playCount, 2);
  } finally {
    ui.cleanup();
  }
});

test("imagem inicial só desaparece quando há reprodução, inclusive no replay", async () => {
  const ui = createHarness({ deferPlaying: true });
  try {
    ui.scroll();
    assert.equal(ui.frame.dataset.mediaState, "initial");
    ui.video.dispatch("playing");
    assert.equal(ui.frame.dataset.mediaState, "video");
    await settle();
    ui.video.ended = true;
    ui.video.paused = true;
    ui.video.dispatch("ended");
    assert.equal(ui.frame.dataset.mediaState, "final");
    ui.click();
    assert.equal(ui.frame.dataset.mediaState, "initial");
    ui.video.dispatch("playing");
    assert.equal(ui.frame.dataset.mediaState, "video");
  } finally {
    ui.cleanup();
  }
});
