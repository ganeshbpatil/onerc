#!/usr/bin/env node
/**
 * Downloads project assets from the reference sites, then writes
 * content/assets.generated.json describing what is actually present on disk.
 * - Idempotent: existing files are kept (use --force to re-download).
 * - Never fails the build: a failed download just leaves that slot as a placeholder.
 * - ASSETS_OFFLINE=1 skips downloads and only rescans (CI).
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { fonts, images, privateFiles } from "./assets.manifest.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dirs = { images: path.join(root, "public/images"), fonts: path.join(root, "public/fonts"), private: path.join(root, "private") };
const force = process.argv.includes("--force");
const offline = process.env.ASSETS_OFFLINE === "1";

const exists = (p) => fs.stat(p).then((s) => s.size > 0, () => false);

async function download(url, dest) {
  if (!force && (await exists(dest))) return "kept";
  if (offline) return "offline";
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(60_000), headers: { "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36 OneRacecourse-AssetSync/1.0", Accept: "*/*" } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.length < 100) throw new Error("empty response");
      await fs.writeFile(dest + ".part", buf);
      await fs.rename(dest + ".part", dest);
      return "downloaded";
    } catch (err) {
      if (attempt === 3) return `failed (${err.message})`;
      await new Promise((r) => setTimeout(r, attempt * 1500));
    }
  }
}

async function run(list, dir) {
  await fs.mkdir(dir, { recursive: true });
  const results = [];
  // small concurrency to be polite to the origin
  for (let i = 0; i < list.length; i += 4) {
    const batch = list.slice(i, i + 4);
    results.push(...(await Promise.all(batch.map(async ([file, url]) => [file, await download(url, path.join(dir, file))]))));
  }
  return results;
}

async function dimensions(file) {
  try {
    const { default: sharp } = await import("sharp");
    const m = await sharp(file).metadata();
    return { width: m.width, height: m.height };
  } catch {
    return {};
  }
}

const report = [...(await run(images, dirs.images)), ...(await run(fonts, dirs.fonts)), ...(await run(privateFiles, dirs.private))];

// Manifest = whatever is really on disk (also picks up files added manually from Google Drive)
const manifest = { images: {}, fonts: [], brochure: false };
for (const f of await fs.readdir(dirs.images).catch(() => [])) {
  if (!/\.(webp|png|jpe?g|avif|svg)$/i.test(f)) continue;
  manifest.images[f] = f.endsWith(".svg") ? {} : await dimensions(path.join(dirs.images, f));
}
manifest.fonts = (await fs.readdir(dirs.fonts).catch(() => [])).filter((f) => /\.(woff2?|ttf|otf)$/i.test(f));
manifest.brochure = await exists(path.join(dirs.private, "One-Racecourse-Brochure.pdf"));
await fs.writeFile(path.join(root, "content/assets.generated.json"), JSON.stringify(manifest, null, 2) + "\n");

const failed = report.filter(([, s]) => s.startsWith("failed"));
const summary = report.reduce((acc, [, s]) => ((acc[s.split(" ")[0]] = (acc[s.split(" ")[0]] ?? 0) + 1), acc), {});
console.log(`[assets] ${JSON.stringify(summary)} · images on disk: ${Object.keys(manifest.images).length} · fonts: ${manifest.fonts.length} · brochure: ${manifest.brochure}`);
for (const [f, s] of failed) console.warn(`[assets] ${f}: ${s}`);
