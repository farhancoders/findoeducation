"use server";

import { enquirySchema } from "@/lib/validation";
import en from "@/dictionaries/en.json";
import { SITE } from "@/lib/site";

export type EnquiryState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<string, string>>;
  values?: Record<string, string>;
};

/**
 * Validates an enquiry and delivers it by email through Resend when
 * RESEND_API_KEY is configured. Without a key (local dev) it logs the enquiry.
 */
export async function submitEnquiry(_prev: EnquiryState, formData: FormData): Promise<EnquiryState> {
  const raw = Object.fromEntries(
    [...formData.entries()].filter(([, v]) => typeof v === "string"),
  ) as Record<string, string>;

  // Bots fill the hidden honeypot; pretend success so they move on.
  if (raw.website) return { status: "success" };

  const parsed = enquirySchema.safeParse(raw);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      errors[key] ??= issue.message;
    }
    return { status: "error", message: "validation", errors, values: raw };
  }

  const { name, email, phone, message } = parsed.data;
  const interest = en.form.interests[parsed.data.interest];
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.info("[enquiry]", { name, email, phone, interest, message });
    return { status: "success" };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.ENQUIRY_FROM ?? "Faith Education <onboarding@resend.dev>",
        to: [process.env.ENQUIRY_TO ?? SITE.email],
        reply_to: email,
        subject: `New enquiry: ${interest} (${name})`,
        text: [
          `Name: ${name}`,
          `Email: ${email}`,
          `Phone: ${phone || "-"}`,
          `Interested in: ${interest}`,
          "",
          message,
        ].join("\n"),
      }),
    });
    if (!res.ok) throw new Error(`Resend responded ${res.status}`);
    return { status: "success" };
  } catch (err) {
    console.error("[enquiry] delivery failed", err);
    return {
      status: "error",
      message: "send_failed",
      values: raw,
    };
  }
}
