"use client";
import { useRouter } from "next/navigation";
import { useId, useRef, useState, type FormEvent } from "react";
import { project } from "@/content/project";
import { readAttribution } from "@/lib/analytics/attribution";
import { newEventId, track } from "@/lib/analytics/track";
import { PREFERRED_TIMES, type LeadIntent } from "@/lib/leads/schema";
import { cn, telHref } from "@/lib/utils";

type Status = { state: "idle" } | { state: "submitting" } | { state: "success"; brochureUrl?: string } | { state: "error"; message: string };

const submitLabel: Record<LeadIntent, string> = {
  visit: "Schedule a private visit",
  brochure: "Get the brochure",
  price: "Request price & floor plan",
  enquiry: "Send enquiry",
};

export function LeadForm({ intent, tone = "dark", compact = false, source }: { intent: LeadIntent; tone?: "dark" | "light"; compact?: boolean; source: string }) {
  const router = useRouter();
  const uid = useId();
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const started = useRef<number | null>(null);

  const dark = tone === "dark";
  const field = cn(
    "min-h-11 w-full border-0 border-b bg-transparent py-2.5 text-[17px] outline-none transition-colors",
    dark ? "border-accent-300 text-paper placeholder:text-accent-300 focus:border-paper" : "border-[var(--concrete)] text-primary focus:border-primary",
  );
  const labelCls = cn("flex flex-col gap-1.5 text-[13px]", dark ? "text-accent-100" : "text-secondary");
  const errCls = cn("text-[13px]", dark ? "text-[#f3c4bb]" : "text-error");

  function onFirstFocus() {
    if (started.current) return;
    started.current = Date.now();
    track("form_start", { form_intent: intent, form_source: source });
    if (intent === "visit") track("schedule_visit_start", { form_source: source });
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const eventId = newEventId();
    const payload = {
      name: String(fd.get("name") ?? ""),
      mobile: String(fd.get("mobile") ?? ""),
      email: String(fd.get("email") ?? ""),
      preferredTime: (fd.get("preferredTime") as string) || undefined,
      intent,
      consent: fd.get("consent") === "on",
      website: String(fd.get("website") ?? ""),
      startedAt: started.current ?? Date.now(),
      eventId,
      ...readAttribution(),
    };
    setStatus({ state: "submitting" });
    setErrors({});
    track("form_submit", { form_intent: intent, form_source: source });
    if (intent === "visit") track("schedule_visit_submit", { form_source: source });
    try {
      const res = await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const json = (await res.json()) as { ok: boolean; error?: string; fieldErrors?: Record<string, string>; brochureUrl?: string };
      if (!res.ok || !json.ok) {
        setErrors(json.fieldErrors ?? {});
        setStatus({ state: "error", message: json.error ?? "Something went wrong." });
        track("form_error", { form_intent: intent, form_source: source, error_type: String(res.status) });
        return;
      }
      // event_id lets GTM dedupe the browser Lead with the server-side CAPI Lead
      track("form_success", { form_intent: intent, form_source: source, event_id: eventId });
      if (intent === "visit") {
        router.push("/thank-you");
        return;
      }
      setStatus({ state: "success", brochureUrl: json.brochureUrl });
    } catch {
      setStatus({ state: "error", message: "Network error. Please try again or call us." });
      track("form_error", { form_intent: intent, form_source: source, error_type: "network" });
    }
  }

  if (status.state === "success") {
    return (
      <div role="status" className="flex flex-col gap-5">
        <p className="t-h3">Thank you. We&apos;ll be in touch shortly.</p>
        {status.brochureUrl ? (
          <a
            href={status.brochureUrl}
            target="_blank"
            rel="noopener"
            className={cn("btn self-start", dark ? "btn-light" : "btn-primary")}
            onClick={() => track("brochure_download", { form_source: source })}
          >
            Download the brochure (PDF)
          </a>
        ) : (
          <p className={dark ? "text-accent-100" : "text-secondary"}>Our team will share the details on WhatsApp or email.</p>
        )}
      </div>
    );
  }

  const err = (k: string) => (errors[k] ? `${uid}-${k}-err` : undefined);

  return (
    <form noValidate onSubmit={onSubmit} onFocus={onFirstFocus} aria-label={submitLabel[intent]} className={cn("grid gap-x-5 gap-y-6", compact ? "grid-cols-1" : "grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))]")}>
      <label className={labelCls}>
        Full name
        <input name="name" type="text" autoComplete="name" required aria-invalid={!!errors.name} aria-describedby={err("name")} className={field} />
        {errors.name && <span id={err("name")} className={errCls}>{errors.name}</span>}
      </label>
      <label className={labelCls}>
        Mobile
        <input name="mobile" type="tel" inputMode="tel" autoComplete="tel" required placeholder="+91" aria-invalid={!!errors.mobile} aria-describedby={err("mobile")} className={field} />
        {errors.mobile && <span id={err("mobile")} className={errCls}>{errors.mobile}</span>}
      </label>
      <label className={labelCls}>
        Email (optional)
        <input name="email" type="email" autoComplete="email" aria-invalid={!!errors.email} aria-describedby={err("email")} className={field} />
        {errors.email && <span id={err("email")} className={errCls}>{errors.email}</span>}
      </label>
      {intent === "visit" || !compact ? (
        <label className={labelCls}>
          Preferred time
          <select name="preferredTime" defaultValue={PREFERRED_TIMES[0]} className={cn(field, dark && "[&>option]:text-primary")}>
            {PREFERRED_TIMES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
      ) : null}
      {/* honeypot — hidden from humans and assistive tech */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Website
          <input name="website" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <label className={cn("col-span-full flex items-start gap-3 text-[13px]", dark ? "text-accent-100" : "text-secondary")}>
        <input name="consent" type="checkbox" required aria-invalid={!!errors.consent} aria-describedby={err("consent")} className="mt-0.5 size-[18px] shrink-0 accent-[var(--banyan)]" />
        <span>
          I agree to be contacted by SKYi about One Racecourse by phone, SMS, WhatsApp or email. This overrides DND registration. See our{" "}
          <a href="/privacy" className="link-u">privacy policy</a>.
          {errors.consent && <span id={err("consent")} className={cn("mt-1 block", errCls)}>{errors.consent}</span>}
        </span>
      </label>
      <div className="col-span-full flex flex-wrap items-center gap-4">
        <button type="submit" disabled={status.state === "submitting"} className={cn("btn", dark ? "btn-light" : "btn-primary", "disabled:opacity-60")}>
          {status.state === "submitting" ? "Sending…" : submitLabel[intent]}
        </button>
        {status.state === "error" && (
          <p role="alert" className={errCls}>
            {status.message}{" "}
            <a href={telHref(project.contact.phone)} className="link-u">Call {project.contact.phoneDisplay}</a>
          </p>
        )}
      </div>
    </form>
  );
}
