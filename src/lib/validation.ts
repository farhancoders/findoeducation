import { z } from "zod";

/** Stable keys; the visible labels are translated in the dictionaries (form.interests). */
export const INTERESTS = ["study", "migration", "pr", "other"] as const;

/**
 * Error messages are field names on purpose: the client looks up the translated
 * text in `dict.form.errors[field]`, so validation stays language-neutral.
 */
export const enquirySchema = z.object({
  name: z.string().trim().min(2, "name").max(100, "name"),
  email: z.email("email").max(200, "email"),
  phone: z
    .string()
    .trim()
    .max(30, "phone")
    .regex(/^[+()\d\s-]*$/, "phone")
    .optional()
    .or(z.literal("")),
  interest: z.enum(INTERESTS, { error: "interest" }),
  message: z.string().trim().min(10, "message").max(2000, "message"),
  consent: z.literal("on", { error: "consent" }),
  // Honeypot: real users never see or fill this field.
  website: z.string().max(0).optional(),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;
