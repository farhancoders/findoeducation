"use client";

import { useActionState } from "react";
import Link from "next/link";
import { useI18n } from "@/components/i18n-provider";
import { localePath } from "@/lib/i18n";
import { submitEnquiry, type EnquiryState } from "@/actions/enquiry";
import { INTERESTS } from "@/lib/validation";
import { Check } from "@/components/ui/icons";

const initial: EnquiryState = { status: "idle" };

const field =
  "w-full rounded-xl border border-brand-900/15 bg-white px-4 py-3.5 text-[0.95rem] text-ink placeholder:text-mist/60 transition focus:border-accent-500 focus:outline-none focus:ring-4 focus:ring-accent-500/15 aria-[invalid=true]:border-red-500";

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-brand-900">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export function EnquiryForm() {
  const { lang, t } = useI18n();
  const f = t.form;
  const [state, action, pending] = useActionState(submitEnquiry, initial);
  const err: Record<string, string | undefined> = Object.fromEntries(
    Object.keys(state.errors ?? {}).map((k) => [k, f.errors[k as keyof typeof f.errors]]),
  );
  const val = state.values ?? {};

  if (state.status === "success") {
    return (
      <div role="status" className="rounded-3xl bg-brand-900 p-10 text-center text-white">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-accent-500 text-brand-900">
          <Check width={28} height={28} />
        </span>
        <h3 className="display mt-6 text-4xl">{f.successTitle}</h3>
        <p className="mx-auto mt-3 max-w-sm text-white/70">
          {f.successBody}
        </p>
      </div>
    );
  }

  const aria = (id: string) => ({
    "aria-invalid": err[id] ? true : undefined,
    "aria-describedby": err[id] ? `${id}-error` : undefined,
  });

  return (
    <form action={action} noValidate className="space-y-5" aria-labelledby="enquiry-heading">
      {state.status === "error" && state.message && (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.message === "send_failed" ? f.sendFailed : f.checkFields}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="name" label={f.name} error={err.name}>
          <input id="name" name="name" autoComplete="name" required defaultValue={val.name} className={field} placeholder={f.namePh} {...aria("name")} />
        </Field>
        <Field id="email" label={f.email} error={err.email}>
          <input id="email" name="email" type="email" autoComplete="email" required defaultValue={val.email} className={field} placeholder={f.emailPh} {...aria("email")} />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="phone" label={f.phone} error={err.phone}>
          <input id="phone" name="phone" type="tel" autoComplete="tel" defaultValue={val.phone} className={field} placeholder="+62 ..." {...aria("phone")} />
        </Field>
        <Field id="interest" label={f.interest} error={err.interest}>
          <select key={val.interest ?? "none"} id="interest" name="interest" required defaultValue={val.interest ?? ""} className={field} {...aria("interest")}>
            <option value="" disabled>
              {f.interestPh}
            </option>
            {INTERESTS.map((i) => (
              <option key={i} value={i}>
                {f.interests[i]}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field id="message" label={f.message} error={err.message}>
        <textarea id="message" name="message" rows={5} required defaultValue={val.message} className={`${field} resize-y`} placeholder={f.messagePh} {...aria("message")} />
      </Field>

      {/* Honeypot, hidden from people and assistive tech */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label className="flex cursor-pointer items-start gap-3 text-sm text-mist">
          <input type="checkbox" name="consent" defaultChecked={val.consent === "on"} className="mt-1 size-4 accent-accent-600" {...aria("consent")} />
          <span>
            {f.consentA}{" "}
            <Link href={localePath(lang, "/privacy-and-cookies-policy")} className="font-semibold text-brand-900 underline decoration-accent-500 underline-offset-4">
              {f.consentLink}
            </Link>
            .
          </span>
        </label>
        {err.consent && <p id="consent-error" className="mt-1.5 text-sm text-red-600">{err.consent}</p>}
      </div>

      <button type="submit" disabled={pending} className="btn btn-brand w-full disabled:opacity-60 sm:w-auto">
        {pending ? f.sending : f.submit}
      </button>
    </form>
  );
}
