// WCAG 2.1 A/AA audit with axe-core. Usage: BASE=http://localhost:3000 node tests/visual/a11y.mjs
import { chromium } from "playwright";
import { AxeBuilder } from "@axe-core/playwright";

const BASE = process.env.BASE ?? "http://localhost:3000";
const pages = ["/", "/residences/one-plus", "/design", "/club-one", "/location", "/gallery", "/developer", "/visit", "/rera", "/thank-you"];
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM ?? undefined });
let total = 0;
for (const w of [390, 1440]) {
  for (const path of pages) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, reducedMotion: "reduce" });
    const page = await ctx.newPage();
    await page.goto(BASE + path, { waitUntil: "networkidle" });
    const { violations } = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
    for (const v of violations) {
      total++;
      console.log(`[${w}] ${path} ${v.impact} ${v.id}: ${v.help} — ${v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(", ")}`);
    }
    await ctx.close();
  }
}
await browser.close();
console.log(`violations: ${total}`);
process.exit(total ? 1 : 0);
