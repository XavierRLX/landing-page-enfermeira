import { initializeContacts } from "./contact.js";
import { initializeHeroVideo } from "./hero-video.js";
import { initializeNavigation } from "./navigation.js";
import { initializeServices } from "./services.js";

let stop = () => {};
function start() {
  initializeContacts();
  const cleanups = [initializeNavigation(), initializeServices(), initializeHeroVideo()];
  let active = true;
  // Animation failure cannot take navigation, contact or services down with it.
  import("./motion.js")
    .then(({ initializeMotion }) => {
      if (active) cleanups.push(initializeMotion());
    })
    .catch(() => {
      /* Progressive enhancement: the static layout is complete. */
    });
  stop = () => {
    active = false;
    cleanups.reverse().forEach((cleanup) => cleanup());
  };
}
start();
window.addEventListener("pagehide", () => stop());
window.addEventListener("pageshow", (event) => {
  if (event.persisted) start();
});
