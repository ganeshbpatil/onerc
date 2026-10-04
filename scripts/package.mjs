// Deploy packages (source + lockfile, never node_modules/.next/.env):
//   npm run package            → one-racecourse-deploy-<v>.tar.gz  (VPS: deploy/install.sh)
//   npm run package:hostinger  → one-racecourse-hostinger-<v>.zip  (Hostinger hPanel "Upload archive")
// The Hostinger zip has package.json at its root and also includes public/images/ and private/
// when present (run `npm run assets` first), so the site has its images even if the build
// server cannot download them.
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, rmSync } from "node:fs";
import path from "node:path";

const { version } = JSON.parse(readFileSync("package.json", "utf8"));
const zip = process.argv.includes("--zip");

const tracked = execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard"], { encoding: "utf8" })
  .split("\n")
  .filter((f) => f && !f.startsWith("tests/visual/") && !/\.(tar\.gz|zip)$/.test(f) && existsSync(f));

const assets = (dir) => (existsSync(dir) ? readdirSync(dir).filter((f) => !f.startsWith(".")).map((f) => path.posix.join(dir, f)) : []);

if (zip) {
  const name = `one-racecourse-hostinger-${version}.zip`;
  rmSync(name, { force: true });
  const files = [...tracked, ...assets("public/images"), ...assets("private")];
  execFileSync("zip", ["-q", "-X", name, ...files]);
  const imgs = assets("public/images").length;
  console.log(`[package] ${name} (${files.length} files · ${imgs} images · brochure: ${existsSync("private/One-Racecourse-Brochure.pdf")})`);
  if (!imgs) console.log("[package] no images bundled — run `npm run assets` first, or let the Hostinger build download them");
} else {
  const name = `one-racecourse-deploy-${version}.tar.gz`;
  execFileSync("tar", ["-czf", name, "--transform", "s,^,one-racecourse/,", ...tracked]);
  console.log(`[package] ${name} (${tracked.length} files)`);
}
