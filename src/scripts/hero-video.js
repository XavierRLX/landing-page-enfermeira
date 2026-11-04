/** The portrait stays static. Video is loaded only after an explicit request. */
export function initializeHeroVideo() {
  const dialog = document.querySelector(".video-dialog");
  const video = document.querySelector("#portrait-video");
  const opener = document.querySelector(".video-open");
  if (!dialog || !video || !opener || !dialog.showModal) return () => {};
  const controller = new AbortController();
  const options = { signal: controller.signal };
  const status = dialog.querySelector(".video-status");
  opener.hidden = false;
  let loaded = false;
  let failed = false;
  const mediaFailure = () => {
    failed = true;
    status.textContent =
      "Não foi possível carregar o vídeo. Feche esta janela para continuar navegando.";
  };
  video.querySelector("source:last-child").addEventListener("error", mediaFailure, options);
  function closeVideo() {
    video.pause();
    dialog.close();
  }
  dialog.addEventListener("cancel", () => video.pause(), options);
  video.addEventListener(
    "playing",
    () => {
      if (!dialog.open || document.hidden) video.pause();
    },
    options,
  );

  opener.addEventListener(
    "click",
    () => {
      dialog.showModal();
      if (!loaded) {
        video.querySelectorAll("source").forEach((source) => {
          source.src = source.dataset.src;
        });
        video.load();
        loaded = true;
      }
      // Playback is a direct consequence of this click, never of scrolling.
      Promise.resolve(video.play()).catch(() => {
        if (!failed)
          status.textContent = "Use o controle de reprodução para iniciar o vídeo sem áudio.";
      });
    },
    options,
  );
  dialog.querySelector(".video-close").addEventListener("click", closeVideo, options);
  dialog.addEventListener(
    "click",
    (event) => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
      )
        closeVideo();
    },
    options,
  );
  dialog.addEventListener(
    "close",
    () => {
      video.pause();
      opener.focus({ preventScroll: true });
    },
    options,
  );
  document.addEventListener(
    "visibilitychange",
    () => {
      if (document.hidden) video.pause();
    },
    options,
  );
  video.addEventListener(
    "error",
    () => {
      status.textContent =
        "Não foi possível carregar o vídeo. Feche esta janela para continuar navegando.";
    },
    options,
  );
  return () => {
    video.pause();
    if (dialog.open) dialog.close();
    controller.abort();
  };
}
