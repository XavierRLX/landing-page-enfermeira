export function initializeNavigation() {
  const button = document.querySelector(".menu-toggle");
  const menu = document.querySelector("#mobile-menu");
  const header = document.querySelector(".header");
  if (!button || !menu) return () => {};
  const controller = new AbortController();
  const options = { signal: controller.signal };
  const desktop = window.matchMedia("(min-width: 901px)");
  button.hidden = false;

  function closeMenu({ restoreFocus = false } = {}) {
    menu.hidden = true;
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-label", "Abrir menu");
    if (restoreFocus) button.focus();
  }
  button.addEventListener(
    "click",
    () => {
      const isOpen = button.getAttribute("aria-expanded") === "true";
      menu.hidden = isOpen;
      button.setAttribute("aria-expanded", String(!isOpen));
      button.setAttribute("aria-label", isOpen ? "Abrir menu" : "Fechar menu");
    },
    options,
  );
  menu.addEventListener(
    "click",
    (event) => {
      const link = event.target.closest("a");
      if (!link) return;
      closeMenu();
      const destination = document.querySelector(link.hash);
      if (destination) {
        destination.setAttribute("tabindex", "-1");
        destination.focus({ preventScroll: true });
      }
    },
    options,
  );
  document.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "Escape" && !menu.hidden) closeMenu({ restoreFocus: true });
    },
    options,
  );
  document.addEventListener(
    "click",
    (event) => {
      if (!menu.hidden && !header.contains(event.target)) closeMenu();
    },
    options,
  );
  header.addEventListener(
    "focusout",
    (event) => {
      if (event.relatedTarget && !header.contains(event.relatedTarget)) closeMenu();
    },
    options,
  );
  desktop.addEventListener(
    "change",
    () => {
      if (desktop.matches) closeMenu();
    },
    options,
  );
  const observer = new IntersectionObserver(([entry]) => {
    header.classList.toggle("is-scrolled", !entry.isIntersecting);
  });
  observer.observe(document.querySelector(".header-sentinel"));
  return () => {
    controller.abort();
    observer.disconnect();
    closeMenu();
  };
}
