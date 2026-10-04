"use client";
import { useEffect, useRef, type ElementType, type ReactNode } from "react";

/** One-shot fade/rise when scrolled into view. CSS handles reduced-motion and no-JS. */
export function Reveal({ children, as: Tag = "div", className }: { children: ReactNode; as?: ElementType; className?: string }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          el.dataset.visible = "true";
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <Tag ref={ref} className={`reveal ${className ?? ""}`}>
      {children}
    </Tag>
  );
}
