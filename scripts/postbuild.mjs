// Next's standalone bundle excludes static assets and our gated files; copy them in.
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const out = path.join(root, ".next/standalone");
const copy = async (from, to) => {
  try {
    await fs.cp(path.join(root, from), path.join(out, to), { recursive: true, force: true });
  } catch (e) {
    if (e.code !== "ENOENT") throw e;
  }
};
await copy("public", "public");
await copy(".next/static", ".next/static");
await copy("private", "private");
console.log("[postbuild] standalone bundle ready: .next/standalone/server.js");
