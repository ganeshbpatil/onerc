// Visual + responsive QA: full-page screenshots, horizontal-overflow and basic a11y checks.
// Usage: BASE=http://localhost:3100 OUT=./shots node tests/visual/qa.mjs
import { chromium } from "playwright";
import fs from "node:fs";

const BASE = process.env.BASE ?? "http://localhost:3000";
const OUT = process.env.OUT ?? "shots";
const widths = (process.env.WIDTHS ?? "375,390,414,768,1024,1280,1440,1920,2560").split(",").map(Number);
const pages = (process.env.PAGES ?? "/,/residences/one-plus,/location,/gallery,/visit").split(",");
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM ?? undefined });
const report = [];
for (const path of pages) {
  for (const w of widths) {
    const page = await browser.newPage({ viewport: { width: w, height: 900 }, reducedMotion: "reduce" });
    await page.goto(BASE + path, { waitUntil: "networkidle" });
    await page.evaluate(() => document.querySelectorAll(".reveal").forEach((el) => el.setAttribute("data-visible", "true")));
    const metrics = await page.evaluate(() => {
      const doc = document.documentElement;
      const overflowers = [...document.querySelectorAll("body *")]
        .filter((el) => { const r = el.getBoundingClientRect(); return r.right > doc.clientWidth + 1 && getComputedStyle(el).position !== "fixed" && !el.closest("[class*='overflow-x-auto']"); })
        .slice(0, 5).map((el) => `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 60)}`);
      const h = [...document.querySelectorAll("h1,h2,h3,h4")].map((e) => Number(e.tagName[1]));
      const skips = h.filter((lvl, i) => i > 0 && lvl - h[i - 1] > 1).length;
      const imgsNoAlt = document.querySelectorAll("img:not([alt])").length;
      const smallTargets = [...document.querySelectorAll("a,button,input,select")].filter((el) => {
        const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0 && r.height < 24 && getComputedStyle(el).position !== "absolute";
      }).length;
      return { scrollW: doc.scrollWidth, clientW: doc.clientWidth, overflowers, h1: h.filter((x) => x === 1).length, headingSkips: skips, imgsNoAlt, smallTargets };
    });
    const name = `${path === "/" ? "home" : path.slice(1).replace(/\//g, "_")}-${w}`;
    if (!process.env.NOSHOT) await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true });
    report.push({ page: path, width: w, ...metrics, horizontalScroll: metrics.scrollW > metrics.clientW });
    await page.close();
  }
}
await browser.close();
console.table(report.map(({ overflowers, ...r }) => ({ ...r, overflowers: overflowers.join(" | ").slice(0, 80) })));
