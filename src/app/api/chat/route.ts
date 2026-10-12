import { buildSystemPrompt } from "@/lib/chat-knowledge";
import { hasLocale, type Locale } from "@/lib/i18n";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODELS = [process.env.GROQ_MODEL ?? "openai/gpt-oss-120b", "openai/gpt-oss-20b"];
const MAX_MESSAGES = 12;
const MAX_CHARS = 1000;

/* Simple in-memory limiter: 20 requests / 10 minutes per IP (per server instance). */
const hits = new Map<string, number[]>();
function rateLimited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > 20;
}

const KEYS = (process.env.GROQ_API_KEYS ?? "").split(",").map((k) => k.trim()).filter(Boolean);
let cursor = 0;

type Msg = { role: "user" | "assistant"; content: string };

function parseBody(body: unknown): { lang: Locale; messages: Msg[] } | null {
  if (!body || typeof body !== "object") return null;
  const { lang, messages } = body as { lang?: unknown; messages?: unknown };
  if (typeof lang !== "string" || !hasLocale(lang) || !Array.isArray(messages) || !messages.length) return null;
  const clean: Msg[] = [];
  for (const m of messages.slice(-MAX_MESSAGES)) {
    if (!m || (m.role !== "user" && m.role !== "assistant") || typeof m.content !== "string") return null;
    const content = m.content.trim().slice(0, MAX_CHARS);
    if (content) clean.push({ role: m.role, content });
  }
  if (!clean.length || clean[clean.length - 1].role !== "user") return null;
  return { lang, messages: clean };
}

/** Try each API key (round-robin) and each model until one responds. */
async function callGroq(payload: object) {
  const attempts = Math.min(KEYS.length, 5) * MODELS.length;
  for (let i = 0; i < attempts; i++) {
    const key = KEYS[cursor++ % KEYS.length];
    const model = MODELS[Math.floor(i / Math.min(KEYS.length, 5)) % MODELS.length];
    try {
      const res = await fetch(GROQ_URL, {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, model }),
        signal: AbortSignal.timeout(25_000),
      });
      if (res.ok && res.body) return res;
      if (res.status !== 429 && res.status < 500 && res.status !== 404) break; // client error: retrying won't help
    } catch {
      /* network/timeout: try the next key */
    }
  }
  return null;
}

export async function POST(request: Request) {
  if (!KEYS.length) return Response.json({ error: "not_configured" }, { status: 503 });

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (rateLimited(ip)) return Response.json({ error: "rate_limited" }, { status: 429 });

  let parsed;
  try {
    parsed = parseBody(await request.json());
  } catch {
    parsed = null;
  }
  if (!parsed) return Response.json({ error: "bad_request" }, { status: 400 });

  const upstream = await callGroq({
    stream: true,
    temperature: 0.4,
    max_completion_tokens: 900,
    reasoning_effort: "low",
    messages: [{ role: "system", content: buildSystemPrompt(parsed.lang) }, ...parsed.messages],
  });
  if (!upstream) return Response.json({ error: "upstream" }, { status: 502 });

  // Convert Groq's SSE stream into a plain text stream of the assistant's answer.
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";
  const stream = new TransformStream<Uint8Array, Uint8Array>({
    transform(chunk, controller) {
      buffer += decoder.decode(chunk, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.startsWith("data:")) continue;
        const data = line.slice(5).trim();
        if (!data || data === "[DONE]") continue;
        try {
          const text = JSON.parse(data).choices?.[0]?.delta?.content;
          if (text) controller.enqueue(encoder.encode(text));
        } catch {
          /* ignore partial JSON */
        }
      }
    },
  });

  return new Response(upstream.body!.pipeThrough(stream), {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store", "X-Accel-Buffering": "no" },
  });
}
