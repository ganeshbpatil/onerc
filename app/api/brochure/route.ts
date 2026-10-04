import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";
import { NextResponse, type NextRequest } from "next/server";
import { verifyBrochureLink } from "@/lib/brochure";

export const runtime = "nodejs";

const FILE = process.env.BROCHURE_FILE ?? path.join(process.cwd(), "private", "One-Racecourse-Brochure.pdf");

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  if (!verifyBrochureLink(searchParams.get("exp"), searchParams.get("sig"))) {
    return NextResponse.redirect(new URL("/visit?brochure=expired", req.url));
  }
  const info = await stat(/*turbopackIgnore: true*/ FILE).catch(() => null);
  if (!info) return new NextResponse("Brochure not available yet. Please call +91 88558 62268.", { status: 503 });
  const stream = Readable.toWeb(createReadStream(/*turbopackIgnore: true*/ FILE)) as ReadableStream;
  return new NextResponse(stream, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Length": String(info.size),
      "Content-Disposition": 'inline; filename="One-Racecourse-by-SKYi-Brochure.pdf"',
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex",
    },
  });
}
