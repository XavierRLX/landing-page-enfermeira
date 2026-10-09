const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const PLAYBACK_RATE = 2;

/**
 * Plays the full nurse portrait once after the visitor's first scroll.
 * Unlike scroll scrubbing, the playback position never follows window.scrollY.
 */
export function initializeHeroVideo() {
  const video = document.querySelector("#hero-video");
  const control = document.querySelector(".motion-toggle");

  const frame = document.querySelector(".video-frame");
  const finalStill = document.querySelector(".hero-still-final");

  if (!video || !control || !frame || !finalStill) return;

  let finalReady = false;
  function showStill() {
    frame.dataset.mediaState = video.ended && finalReady ? "final" : "initial";
  }

  // Decode eagerly; never expose the compressed ending while an image is loading.
  finalStill
    .decode()
    .then(() => {
      finalReady = true;
      if (video.ended) showStill();
    })
    .catch(() => {
      // The initial portrait remains a usable fallback if the final asset fails.
    });

  const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY);
  let autoTriggered = false;
  let playPending = false;
  let resumeWhenVisible = false;

  function updateControl() {
    const label = video.ended
      ? "Repetir vídeo"
      : video.paused
        ? "Reproduzir vídeo"
        : "Pausar vídeo";

    control.setAttribute("aria-label", label);
    control.setAttribute("aria-pressed", String(!video.paused));
    control.querySelector("span").textContent = video.ended ? "↻" : video.paused ? "▷" : "Ⅱ";
  }

  function play({ restart = false } = {}) {
    if (document.hidden || playPending) return;
    if (!video.paused && !restart) return;

    if (restart) {
      frame.dataset.mediaState = "initial";
      video.currentTime = 0;
    }

    video.playbackRate = PLAYBACK_RATE;
    playPending = true;

    Promise.resolve(video.play())
      .catch(() => {
        // Autoplay may be blocked. The accessible control allows a manual retry.
        video.pause();
      })
      .finally(() => {
        playPending = false;
        updateControl();
      });
  }

  function onFirstScroll() {
    if (autoTriggered || reducedMotion.matches || document.hidden) return;

    autoTriggered = true;
    play();
  }

  // Only the first scroll triggers playback; subsequent scrolling never seeks.
  window.addEventListener("scroll", onFirstScroll, { passive: true });

  control.addEventListener("click", () => {
    autoTriggered = true;

    if (video.ended) {
      play({ restart: true });
    } else if (video.paused) {
      play();
    } else {
      video.pause();
    }

    updateControl();
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      resumeWhenVisible = !video.paused;
      video.pause();
    } else if (resumeWhenVisible && !reducedMotion.matches) {
      resumeWhenVisible = false;
      play();
    }
  });

  reducedMotion.addEventListener("change", (event) => {
    if (event.matches) {
      resumeWhenVisible = false;
      video.pause();
    }
  });

  ["play", "pause", "ended", "loadedmetadata"].forEach((eventName) => {
    video.addEventListener(eventName, updateControl);
  });

  // "playing" waits for actual media, unlike "play", which can precede buffering.
  video.addEventListener("playing", () => {
    if (document.hidden) {
      video.pause();
      return;
    }
    frame.dataset.mediaState = "video";
  });
  video.addEventListener("ended", showStill);

  video.addEventListener("error", () => {
    frame.dataset.mediaState = "initial";
    control.hidden = true;
  });

  updateControl();
}
