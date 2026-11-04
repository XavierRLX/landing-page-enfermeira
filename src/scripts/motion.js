export function initializeMotion() {
  const { gsap, ScrollTrigger } = window;
  if (!gsap || !ScrollTrigger) return () => {};
  gsap.registerPlugin(ScrollTrigger);
  const media = gsap.matchMedia();
  media.add("(prefers-reduced-motion: no-preference)", () => {
    // No CSS pre-hiding: content stays readable when JS or animation assets fail.
    if (window.scrollY < 30) {
      gsap
        .timeline({ defaults: { ease: "power2.out", duration: 0.7 } })
        .from(".header .brand", { y: -8, opacity: 0, duration: 0.4 })
        .from(".hero-eyebrow", { y: 10, opacity: 0 }, 0.05)
        .from(".title-line > span", { y: 22, opacity: 0, stagger: 0.09 }, 0.12)
        .from(".hero-description", { y: 12, opacity: 0 }, 0.23)
        .from(".hero-actions", { y: 10, opacity: 0 }, 0.32)
        .from(".hero-visual", { y: 16, scale: 0.98, duration: 0.9 }, 0.1)
        .from(".portrait-flower", { scale: 0.85, rotation: -18, duration: 1 }, 0.3);
    }
    gsap.utils.toArray(".services-intro, .about-heading, .section-heading").forEach((section) => {
      gsap.from(section, {
        y: 20,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: { trigger: section, start: "top 92%", once: true },
      });
    });
    gsap.utils.toArray(".credential-list > div").forEach((row) => {
      gsap.from(row, {
        x: 14,
        duration: 0.65,
        ease: "power2.out",
        scrollTrigger: { trigger: row, start: "top 93%", once: true },
      });
    });
    gsap.from(".value-number", {
      scale: 0.7,
      rotation: -12,
      stagger: 0.1,
      duration: 0.65,
      scrollTrigger: { trigger: ".differences-grid", start: "top 88%", once: true },
    });
    gsap.fromTo(
      ".journey-line path",
      { strokeDasharray: 1, strokeDashoffset: 1 },
      {
        strokeDashoffset: 0,
        duration: 1.2,
        ease: "power1.inOut",
        scrollTrigger: { trigger: ".journey", start: "top 82%", once: true },
      },
    );
    gsap.from(".contact-brand img", {
      rotation: -4,
      scale: 0.94,
      duration: 1,
      ease: "power2.out",
      scrollTrigger: { trigger: ".contact", start: "top 75%", once: true },
    });
  });
  return () => media.revert();
}
