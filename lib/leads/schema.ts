import { z } from "zod";

export const LEAD_INTENTS = ["visit", "brochure", "price", "enquiry"] as const;
export type LeadIntent = (typeof LEAD_INTENTS)[number];

export const PREFERRED_TIMES = ["This weekend", "Weekday morning", "Weekday evening", "Call me first"] as const;

const clean = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    // strip control chars + angle brackets; CRM fields are plain text
    .transform((s) => s.replace(/[\u0000-\u001f\u007f<>]/g, ""));

const optionalClean = (max: number) => clean(max).optional().or(z.literal("").transform(() => undefined));

/** Indian mobile: optional +91/0 prefix, 10 digits starting 6–9. Normalised to +91XXXXXXXXXX. */
export const indianMobile = z
  .string()
  .trim()
  .transform((s) => s.replace(/[\s\-()]/g, ""))
  .refine((s) => /^(?:\+?91|0)?[6-9]\d{9}$/.test(s), { message: "Enter a valid 10-digit mobile number" })
  .transform((s) => `+91${s.slice(-10)}`);

export const leadSchema = z.object({
  name: clean(80).pipe(z.string().min(2, "Please enter your name")),
  mobile: indianMobile,
  email: z
    .string()
    .trim()
    .max(120)
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : undefined))
    .pipe(z.email("Enter a valid email").optional()),
  preferredTime: z.enum(PREFERRED_TIMES).optional(),
  configuration: optionalClean(40),
  intent: z.enum(LEAD_INTENTS).default("enquiry"),
  consent: z.literal(true, { message: "Consent is required to contact you" }),
  // attribution
  utmSource: optionalClean(100),
  utmMedium: optionalClean(100),
  utmCampaign: optionalClean(150),
  utmContent: optionalClean(150),
  utmTerm: optionalClean(150),
  gclid: optionalClean(200),
  fbclid: optionalClean(300),
  landingPath: optionalClean(300),
  referrer: optionalClean(300),
  eventId: optionalClean(64),
  // abuse signals (never forwarded)
  website: z.string().max(0, "spam").optional().or(z.literal("")), // honeypot
  startedAt: z.number().int().optional(),
});

export type LeadInput = z.input<typeof leadSchema>;
export type Lead = z.output<typeof leadSchema>;

/** The normalised record handed to adapters (no abuse fields). */
export type LeadRecord = Omit<Lead, "website" | "startedAt"> & {
  firstName: string;
  lastName: string;
  projectId: string;
  submittedAt: string;
  ip?: string;
  userAgent?: string;
};

export function toLeadRecord(lead: Lead, meta: { projectId: string; ip?: string; userAgent?: string }): LeadRecord {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { website, startedAt, ...rest } = lead;
  const parts = lead.name.split(/\s+/);
  const firstName = parts.length > 1 ? parts.slice(0, -1).join(" ") : parts[0] ?? lead.name;
  const lastName = parts.length > 1 ? parts[parts.length - 1]! : "-"; // Zoho CRM requires Last_Name
  return { ...rest, firstName, lastName, projectId: meta.projectId, submittedAt: new Date().toISOString(), ip: meta.ip, userAgent: meta.userAgent };
}
