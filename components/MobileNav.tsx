"use client";
import Link from "next/link";
import { useState } from "react";
import { CloseIcon, Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { nav, project } from "@/content/project";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger aria-label="Open menu" className="grid size-11 place-items-center lg:hidden">
        <svg width="22" height="14" viewBox="0 0 22 14" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M0 1h22M0 7h22M8 13h14" />
        </svg>
      </DialogTrigger>
      <DialogContent overlayClassName="bg-transparent" className="inset-0 flex flex-col bg-inverse px-4 pb-8 pt-3 text-on-inverse">
        <div className="flex h-[52px] items-center justify-between">
          <DialogTitle className="font-display text-2xl">{project.wordmark}</DialogTitle>
          <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="grid size-11 place-items-center">
            <CloseIcon />
          </button>
        </div>
        <nav aria-label="Mobile" className="mt-8">
          <ul className="flex flex-col">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} onClick={() => setOpen(false)} className="block py-1.5 font-display text-[40px] leading-tight">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/#visit" onClick={() => setOpen(false)} className="mt-6 block py-1.5 font-display text-[40px] italic leading-tight text-highlight-light">
                Schedule a visit
              </Link>
            </li>
          </ul>
        </nav>
        <p className="mt-auto font-mono text-xs text-on-inverse-2">MAHARERA {project.rera.number}</p>
      </DialogContent>
    </Dialog>
  );
}
