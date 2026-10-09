const MOBILE_BREAKPOINT = "(max-width: 800px)";

export function initializeServices() {
  const mobile = window.matchMedia(MOBILE_BREAKPOINT);
  const cards = [...document.querySelectorAll(".service-card")];

  function updateLayout() {
    cards.forEach((card) => {
      card.open = !mobile.matches;
    });
  }

  cards.forEach((card) => {
    card.querySelector("summary")?.addEventListener("click", (event) => {
      // Desktop cards remain expanded; mobile uses a single-open accordion.
      event.preventDefault();
      if (!mobile.matches) return;

      const shouldOpen = !card.open;
      cards.forEach((other) => {
        other.open = other === card && shouldOpen;
      });
    });
  });

  mobile.addEventListener("change", updateLayout);
  updateLayout();
}
