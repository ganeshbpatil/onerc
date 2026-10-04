import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  index,
  eyebrow,
  title,
  id,
  children,
  inverse = false,
  as: H = "h2",
}: {
  index?: string;
  eyebrow: string;
  title: ReactNode;
  id: string;
  children?: ReactNode;
  inverse?: boolean;
  as?: "h1" | "h2";
}) {
  return (
    <div className="flex flex-wrap gap-x-20 gap-y-6">
      <p className={cn("eyebrow flex-[1_1_200px]", inverse ? "text-on-inverse-2" : "text-secondary")}>
        {index ? `${index} — ` : ""}
        {eyebrow}
      </p>
      <div className="min-w-0 flex-[999_1_560px]">
        <H id={id} className="t-h2 max-w-[16ch]">
          {title}
        </H>
        {children ? <div className={cn("lead mt-9 max-w-[620px]", inverse ? "text-[#bdbeb7]" : "text-secondary")}>{children}</div> : null}
      </div>
    </div>
  );
}
