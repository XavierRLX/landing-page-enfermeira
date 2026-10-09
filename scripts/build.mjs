import { cp, mkdir, rm } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.join(root, "src");
const output = path.join(root, "dist");

// Output is disposable. Source and public assets remain the single source of truth.
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

await Promise.all([
  cp(path.join(source, "index.html"), path.join(output, "index.html")),
  cp(path.join(source, "fonts.css"), path.join(output, "fonts.css")),
  cp(path.join(source, "styles", "main.css"), path.join(output, "style.css")),
  cp(path.join(source, "scripts"), path.join(output, "scripts"), {
    recursive: true,
  }),
  cp(path.join(root, "public"), output, { recursive: true }),
]);

console.log("Static site ready in dist/");
