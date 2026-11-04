/** Native details remain usable if scripts fail; WAAPI only smooths user actions. */
export function initializeServices() {
  const cards = [...document.querySelectorAll(".service-card")];
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const controller = new AbortController();
  const animations = new Map();
  const intended = new Map(cards.map((card) => [card, card.open]));

  function finish(card, open) {
    card.open = open;
    card.style.removeProperty("overflow");
    card.style.removeProperty("height");
    animations.delete(card);
  }
  function toggle(card, open) {
    const start = card.getBoundingClientRect().height;
    animations.get(card)?.cancel();
    intended.set(card, open);
    card.open = true;
    if (reduced.matches || !card.animate) {
      finish(card, open);
      return;
    }
    const end = open
      ? card.scrollHeight
      : card.querySelector("summary").getBoundingClientRect().height;
    card.style.overflow = "hidden";
    const animation = card.animate([{ height: `${start}px` }, { height: `${end}px` }], {
      duration: 280,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    });
    animations.set(card, animation);
    animation.onfinish = () => finish(card, open);
  }
  cards.forEach((card) => {
    // Native grouping is replaced only while animated grouping is active.
    card.removeAttribute("name");
    card.querySelector("summary").addEventListener(
      "click",
      (event) => {
        event.preventDefault();
        const open = !intended.get(card);
        if (open)
          cards
            .filter((other) => other !== card && intended.get(other))
            .forEach((other) => toggle(other, false));
        toggle(card, open);
      },
      { signal: controller.signal },
    );
  });
  function settle() {
    animations.forEach((animation, card) => {
      animation.cancel();
      finish(card, intended.get(card));
    });
  }
  reduced.addEventListener("change", settle, { signal: controller.signal });
  window.addEventListener("resize", settle, { signal: controller.signal });
  return () => {
    controller.abort();
    settle();
    cards.forEach((card) => card.setAttribute("name", "care-services"));
  };
}
