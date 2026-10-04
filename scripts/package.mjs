// Creates one-racecourse-deploy.tar.gz: source + lockfile + deploy scripts (no node_modules/.next).
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const { version } = JSON.parse(readFileSync("package.json", "utf8"));
const name = `one-racecourse-deploy-${version}.tar.gz`;
const files = execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard"], { encoding: "utf8" })
  .split("\n")
  .filter((f) => f && !f.startsWith("tests/visual/") && f !== name);
execFileSync("tar", ["-czf", name, "--transform", "s,^,one-racecourse/,", ...files]);
console.log(`[package] ${name} (${files.length} files)`);
