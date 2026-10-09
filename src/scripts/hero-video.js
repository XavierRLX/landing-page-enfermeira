const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const PLAYBACK_RATE = 2;

/**
 * Plays the full nurse portrait once after the visitor's first scroll.
 * Unlike scroll scrubbing, the playback position never follows window.scrollY.
 */
export function initializeHeroVideo() {
  const video = document.querySelector("#hero-video");
  const control = document.querySelector(".motion-toggle");

  if (!video || !control) return;

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

    if (restart) video.currentTime = 0;

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
    } else if (resumeWhenVisible) {
      resumeWhenVisible = false;
      play();
    }
  });

  reducedMotion.addEventListener("change", (event) => {
    if (event.matches) video.pause();
  });

  ["play", "pause", "ended", "loadedmetadata"].forEach((eventName) => {
    video.addEventListener(eventName, updateControl);
  });

  video.addEventListener("error", () => {
    control.hidden = true;
  });

  updateControl();
}
