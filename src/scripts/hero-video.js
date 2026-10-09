const MOBILE_BREAKPOINT = "(max-width: 800px)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const DESKTOP_SCROLL_DISTANCE = 540;
const DESKTOP_VIDEO_END_OFFSET = 0.04;
const DESKTOP_SEEK_TOLERANCE = 0.035;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export function initializeHeroVideo() {
  const video = document.querySelector("#hero-video");
  const hero = document.querySelector(".hero");
  const heroInner = document.querySelector(".hero-inner");
  const videoTrack = document.querySelector(".video-scroll-track");
  const motionButton = document.querySelector(".motion-toggle");

  if (!video || !hero || !heroInner || !videoTrack || !motionButton) return;

  const mobile = window.matchMedia(MOBILE_BREAKPOINT);
  const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY);

  let motionPaused = reducedMotion.matches;
  let frameScheduled = false;
  let targetTime = 0;
  let scrollStart = 0;
  let hasScrolled = window.scrollY > 8;
  let playPending = false;
  let playBlocked = false;

  function updateMotionButton() {
    const shouldReplay = mobile.matches && video.ended;
    const isInactive = motionPaused || playBlocked || shouldReplay;

    motionButton.setAttribute("aria-pressed", String(motionPaused));
    motionButton.setAttribute(
      "aria-label",
      shouldReplay ? "Repetir vídeo" : isInactive ? "Reproduzir animação" : "Pausar animação",
    );

    motionButton.querySelector("span").textContent = shouldReplay ? "↻" : isInactive ? "▷" : "Ⅱ";
  }

  function seekDesktopVideo() {
    if (mobile.matches || motionPaused || !Number.isFinite(video.duration) || video.seeking) return;

    // Ignore tiny differences to avoid unnecessary decoder seeks.
    if (Math.abs(video.currentTime - targetTime) > DESKTOP_SEEK_TOLERANCE) {
      video.currentTime = targetTime;
    }
  }

  function playMobileVideo() {
    if (playPending || playBlocked || !video.paused || video.ended || video.readyState < 2) return;

    // Mobile intentionally uses lightweight playback instead of scrubbing.
    video.playbackRate = 2;
    playPending = true;
    video
      .play()
      .catch(() => {
        playBlocked = true;
        updateMotionButton();
      })
      .finally(() => {
        playPending = false;
      });
  }

  function update() {
    frameScheduled = false;

    if (motionPaused || document.hidden) {
      video.pause();
      return;
    }

    if (mobile.matches) {
      const bounds = video.getBoundingClientRect();
      const visibleHeight = Math.min(bounds.bottom, window.innerHeight) - Math.max(bounds.top, 72);

      if (hasScrolled && visibleHeight > Math.min(100, bounds.height * 0.25)) {
        playMobileVideo();
      } else {
        video.pause();
      }
      return;
    }

    if (!Number.isFinite(video.duration)) return;

    const progress = clamp((window.scrollY - scrollStart) / DESKTOP_SCROLL_DISTANCE, 0, 1);
    targetTime = progress * Math.max(0, video.duration - DESKTOP_VIDEO_END_OFFSET);
    seekDesktopVideo();
  }

  function measureScroll() {
    hero.style.minHeight = "";
    videoTrack.style.height = "";

    if (!mobile.matches && !reducedMotion.matches) {
      const styles = getComputedStyle(hero);
      const stickyTop = parseFloat(getComputedStyle(heroInner).top) || 35;
      const paddingTop = parseFloat(styles.paddingTop);
      const paddingBottom = parseFloat(styles.paddingBottom);

      hero.style.minHeight =
        String(
          paddingTop + heroInner.offsetHeight + DESKTOP_SCROLL_DISTANCE + 100 + paddingBottom,
        ) + "px";

      scrollStart = hero.getBoundingClientRect().top + window.scrollY + paddingTop - stickyTop;
    }

    update();
  }

  video.addEventListener("seeked", () => {
    if (mobile.matches) update();
    else seekDesktopVideo();
  });
  video.addEventListener("loadedmetadata", measureScroll);
  video.addEventListener("loadeddata", update);
  video.addEventListener("canplay", update);
  video.addEventListener("ended", updateMotionButton);
  video.addEventListener("error", () => {
    motionButton.hidden = true;
  });

  window.addEventListener(
    "scroll",
    () => {
      hasScrolled ||= window.scrollY > 8;
      if (frameScheduled) return;
      frameScheduled = true;
      requestAnimationFrame(update);
    },
    { passive: true },
  );

  window.addEventListener("resize", measureScroll);
  window.addEventListener("load", measureScroll);
  document.addEventListener("visibilitychange", update);

  motionButton.addEventListener("click", () => {
    if (video.ended || playBlocked) {
      motionPaused = false;
      playBlocked = false;
      video.currentTime = 0;
    } else {
      motionPaused = !motionPaused;
    }

    hasScrolled = true;
    updateMotionButton();
    update();
  });

  reducedMotion.addEventListener("change", (event) => {
    motionPaused = event.matches;
    updateMotionButton();
    measureScroll();
  });

  mobile.addEventListener("change", () => {
    video.pause();
    video.src = mobile.matches ? "assets/enfermeira-mobile.mp4" : "assets/enfermeira-scroll.mp4";
    video.load();

    playBlocked = false;
    updateMotionButton();
    measureScroll();
  });

  updateMotionButton();
  measureScroll();
  document.fonts.ready.then(measureScroll);
}
