import { initializeContacts } from "./contact.js";
import { initializeHeroVideo } from "./hero-video.js";
import { initializeNavigation } from "./navigation.js";
import { initializeServices } from "./services.js";

// Modules execute after HTML parsing, without a framework or runtime dependencies.
initializeContacts();
initializeNavigation();
initializeServices();
initializeHeroVideo();
