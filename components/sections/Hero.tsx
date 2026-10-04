import { getImageProps } from "next/image";
import { project } from "@/content/project";
import { resolveImage } from "@/lib/assets";
import type { ImageAsset } from "@/content/types";
import { ImageFrame } from "../ImageFrame";
import { TrackedLink } from "../TrackedLink";

const heroImage: ImageAsset = {
  file: "hero-desktop.webp",
  alt: "One Racecourse tower catching the last light over Uday Baug",
  ref: "FULL-BLEED RENDER · TOWER AT DUSK · 1plus-by-skyi-laptop-1.webp",
  kind: "cgi",
};

const heroMobile: ImageAsset = { file: "hero-mobile.webp", alt: heroImage.alt, ref: "1-plus-by-skyi-mobile-1.webp", kind: "cgi" };

/** Art direction: portrait render on phones, landscape on desktop — only one is downloaded. */
function HeroMedia() {
  const desk = resolveImage(heroImage);
  const mob = resolveImage(heroMobile);
  if (!desk || !mob) {
    return <ImageFrame image={desk ? heroImage : heroMobile} priority tone="dark" className="anim-hero absolute inset-0 -z-10 [&>figcaption]:bottom-auto [&>figcaption]:top-5 [&>figcaption]:text-right" />;
  }
  const common = { alt: heroImage.alt, fill: true, priority: true, quality: 75, sizes: "100vw" } as const;
  const { props: { srcSet: mobileSrcSet } } = getImageProps({ ...common, src: mob.src });
  const { props: deskProps } = getImageProps({ ...common, src: desk.src });
  return (
    <figure className="anim-hero absolute inset-0 -z-10 overflow-hidden bg-inverse">
      <picture>
        <source media="(max-width: 767px)" srcSet={mobileSrcSet} />
        {/* eslint-disable-next-line jsx-a11y/alt-text -- alt is in deskProps */}
        <img {...deskProps} className="object-cover" />
      </picture>
      <figcaption className="absolute right-4 top-5 font-mono text-[11px] tracking-[0.06em] text-on-inverse-2">Computer-generated image</figcaption>
    </figure>
  );
}

export function Hero() {
  return (
    <section data-hero aria-labelledby="hero-title" className="relative isolate flex min-h-[min(100svh,900px)] flex-col justify-end overflow-hidden bg-inverse text-on-inverse">
      <HeroMedia />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgb(18_20_18/0.85),rgb(18_20_18/0.1)_60%)]" aria-hidden="true" />
      <div className="container-arch pb-14 pt-32">
        <p className="eyebrow anim-rise mb-7 text-on-inverse-2">Uday Baug · Pune Cantonment · Opposite Sopan Baug</p>
        <h1 id="hero-title" className="t-display anim-rise max-w-[12ch] [animation-delay:120ms]">
          {project.tagline} <em className="not-italic text-highlight-light">{project.taglineEmphasis}</em>
        </h1>
        <div className="mt-11 flex flex-wrap items-end justify-between gap-8">
          <p className="lead max-w-[440px] text-[#d4d2cb]">One Plus Homes at the Racecourse — designed around one discipline: nothing without purpose.</p>
          <div className="flex flex-wrap gap-3">
            <TrackedLink href="#home" event="hero_cta_click" params={{ cta: "explore_home" }} className="btn btn-light">Explore the home</TrackedLink>
            <TrackedLink href="#visit" event="hero_cta_click" params={{ cta: "hero_visit" }} className="btn btn-outline-light">Schedule a private visit</TrackedLink>
          </div>
        </div>
      </div>
      <div className="border-t border-[rgb(233_231_225/0.18)]">
        <dl className="container-arch grid grid-cols-2 gap-x-8 gap-y-5 py-5 md:grid-cols-4">
          {project.heroFacts.map((f) => (
            <div key={f.label}>
              <dt className="eyebrow text-[11px] text-on-inverse-2">{f.label}</dt>
              <dd className={"mt-1 text-[15px] md:text-base " + ("mono" in f && f.mono ? "font-mono" : "")}>{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
