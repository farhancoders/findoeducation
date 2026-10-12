"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useI18n } from "@/components/i18n-provider";
import { Chat, Close, Send, WhatsApp } from "@/components/ui/icons";
import { SITE } from "@/lib/site";

type Msg = { role: "user" | "assistant"; content: string };

/** Floating AI concierge (bottom-right). Replies follow the website's selected language. */
export function ChatWidget() {
  const { lang, t } = useI18n();
  const c = t.chat;
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState<{ lang: string; messages: Msg[] }>({ lang, messages: [] });
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const abort = useRef<AbortController | null>(null);

  // A new site language starts a fresh conversation (the welcome message is re-rendered in that language).
  const messages = useMemo(() => (history.lang === lang ? history.messages : []), [history, lang]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [messages, open, busy]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || busy) return;

    const next: Msg[] = [...messages, { role: "user", content }];
    setHistory({ lang, messages: [...next, { role: "assistant", content: "" }] });
    setInput("");
    setBusy(true);
    setFailed(false);

    abort.current?.abort();
    const ctrl = (abort.current = new AbortController());

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lang, messages: next }),
        signal: ctrl.signal,
      });
      if (!res.ok || !res.body) throw new Error(String(res.status));

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let answer = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        answer += decoder.decode(value, { stream: true });
        setHistory({ lang, messages: [...next, { role: "assistant", content: answer }] });
      }
      if (!answer.trim()) throw new Error("empty");
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      setFailed(true);
      setHistory({ lang, messages: next });
    } finally {
      setBusy(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void send(input);
  }

  return (
    <div className="fixed bottom-5 right-5 z-40 sm:bottom-6 sm:right-6">
      {open && (
        <section
          role="dialog"
          aria-label={c.title}
          className="fixed inset-x-3 bottom-24 top-20 flex flex-col overflow-hidden rounded-3xl bg-white shadow-[0_40px_90px_-20px_rgba(58,16,9,0.6)] sm:absolute sm:inset-auto sm:bottom-[calc(100%+1rem)] sm:right-0 sm:h-[34rem] sm:max-h-[calc(100dvh-8rem)] sm:w-[23rem]"
        >
          <header className="flex items-start justify-between bg-brand-950 px-6 py-5 text-white">
            <div>
              <p className="display text-3xl">{c.title}</p>
              <p className="mt-1 flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-accent-400">
                <span className="size-1.5 rounded-full bg-emerald-400" /> {c.status}
              </p>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label={c.close} className="-mr-2 p-2 text-white/80 hover:text-white">
              <Close width={22} height={22} />
            </button>
          </header>

          <div ref={scroller} className="flex-1 space-y-3 overflow-y-auto bg-ivory px-5 py-5" aria-live="polite">
            <Bubble role="assistant">{c.welcome}</Bubble>

            {messages.length === 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {c.suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => void send(s)}
                    className="rounded-full border border-accent-500/50 bg-white px-3.5 py-2 text-left text-[0.8rem] text-brand-800 transition hover:bg-accent-300/30"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {messages.map((m, i) =>
              m.content ? (
                <Bubble key={i} role={m.role}>
                  {m.content.replace(/\*\*(.+?)\*\*/g, "$1")}
                </Bubble>
              ) : (
                <Bubble key={i} role="assistant">
                  <span className="sr-only">{c.typing}</span>
                  <span aria-hidden className="inline-flex gap-1 py-1">
                    {[0, 1, 2].map((d) => (
                      <span key={d} className="size-1.5 animate-bounce rounded-full bg-mist" style={{ animationDelay: `${d * 120}ms` }} />
                    ))}
                  </span>
                </Bubble>
              ),
            )}

            {failed && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-[0.82rem] text-red-700">{c.error}</p>}
          </div>

          <form onSubmit={onSubmit} className="border-t border-brand-900/10 bg-white p-3">
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                maxLength={1000}
                placeholder={c.placeholder}
                aria-label={c.placeholder}
                className="min-w-0 flex-1 rounded-full border border-brand-900/15 bg-ivory px-4 py-3 text-sm placeholder:text-mist/70 focus:border-accent-500 focus:outline-none focus:ring-4 focus:ring-accent-500/15"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                aria-label={c.send}
                className="grid size-11 shrink-0 place-items-center rounded-full bg-brand-900 text-accent-300 transition hover:bg-brand-700 disabled:opacity-40"
              >
                <Send width={18} height={18} />
              </button>
            </div>
            <p className="mt-2 px-1 text-center text-[0.68rem] text-mist">{c.disclaimer}</p>
          </form>
        </section>
      )}

      <div className="flex items-center gap-3">
        <a
          href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(c.whatsappMessage)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={c.whatsapp}
          title={c.whatsapp}
          className="grid size-14 place-items-center rounded-full bg-brand-700 text-accent-300 shadow-[0_15px_40px_-10px_rgba(58,16,9,0.7)] ring-1 ring-accent-500/40 transition hover:-translate-y-0.5 hover:bg-brand-800"
        >
          <WhatsApp width={28} height={28} />
        </a>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? c.close : c.open}
          className="relative grid size-14 place-items-center rounded-full bg-accent-500 text-brand-900 shadow-[0_15px_40px_-10px_rgba(211,171,109,0.8)] transition hover:-translate-y-0.5 hover:bg-accent-400"
        >
          {open ? <Close width={24} height={24} /> : <Chat width={24} height={24} />}
        </button>
      </div>
    </div>
  );
}

function Bubble({ role, children }: { role: Msg["role"]; children: React.ReactNode }) {
  const mine = role === "user";
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-[0.9rem] leading-relaxed ${
          mine ? "rounded-br-md bg-brand-900 text-white" : "rounded-bl-md bg-white text-ink shadow-sm"
        }`}
      >
        {children}
      </div>
    </div>
  );
}
