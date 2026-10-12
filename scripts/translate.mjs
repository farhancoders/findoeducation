/**
 * Generates src/dictionaries/<locale>.json from en.json using Groq.
 *   node scripts/translate.mjs            # all locales
 *   node scripts/translate.mjs id fr      # specific locales
 * Reads GROQ_API_KEYS / GROQ_MODEL from .env.local. Review the output before shipping.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const DICT = path.join(ROOT, "src/dictionaries");

const env = Object.fromEntries(
  fs
    .readFileSync(path.join(ROOT, ".env.local"), "utf8")
    .split("\n")
    .filter((l) => l.includes("=") && !l.startsWith("#"))
    .map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1).trim()]),
);
const KEYS = env.GROQ_API_KEYS.split(",").filter(Boolean);
const MODEL = "openai/gpt-oss-120b";

const LANGS = {
  id: "Indonesian (Bahasa Indonesia)",
  ru: "Russian",
  fr: "French",
  it: "Italian",
  es: "Spanish",
  zh: "Simplified Chinese",
  ja: "Japanese",
  ko: "Korean",
};

const en = JSON.parse(fs.readFileSync(path.join(DICT, "en.json"), "utf8"));
let keyIdx = 0;

function shape(a, b, p = "") {
  const errs = [];
  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) return [`${p}: array length`];
    a.forEach((v, i) => errs.push(...shape(v, b[i], `${p}[${i}]`)));
  } else if (a && typeof a === "object") {
    if (!b || typeof b !== "object") return [`${p}: not object`];
    for (const k of Object.keys(a)) {
      if (!(k in b)) errs.push(`${p}.${k}: missing`);
      else errs.push(...shape(a[k], b[k], `${p}.${k}`));
    }
  } else if (typeof a === "string") {
    if (typeof b !== "string" || !b.trim()) return [`${p}: not string`];
    if ((a.match(/\*/g) ?? []).length !== (b.match(/\*/g) ?? []).length) errs.push(`${p}: asterisks differ`);
  }
  return errs;
}

async function translateChunk(name, chunk, language) {
  const system = `You are a senior localisation specialist for a premium Australian education & migration consultancy website (brand: "Faith Education"). Translate every string VALUE of the user's JSON into ${language}.
Rules:
- Return ONLY valid JSON with exactly the same structure and keys. Never translate keys.
- Keep each pair of "*" emphasis markers around the equivalent phrase in the translation (same number of asterisks).
- Do not translate or alter: brand/proper names (Faith Education, Faith, Donar, Liny, Ares, Eddy, Ravi, Sydney/Jakarta may be localised only if that is the normal spelling), institution names, acronyms (IELTS, QEAC, PR, TAFE, UNSW, MBA, OZSEA), emails, phone numbers, "$20", and numbers such as "5+5", "10", "25+".
- Tone: refined, warm, professional, concise. SEO titles under 65 characters, descriptions under 160.
- The object under "offices" and the keys under "interests" keep their keys; translate only values.`;
  for (let attempt = 0; attempt < 6; attempt++) {
    const key = KEYS[keyIdx++ % KEYS.length];
    try {
      const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: MODEL,
          temperature: 0.3,
          reasoning_effort: "low",
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: system },
            { role: "user", content: JSON.stringify(chunk) },
          ],
        }),
      });
      if (r.status === 429 || r.status >= 500) {
        await new Promise((res) => setTimeout(res, 2500 * (attempt + 1)));
        continue;
      }
      const j = await r.json();
      if (!r.ok) throw new Error(JSON.stringify(j).slice(0, 200));
      const out = JSON.parse(j.choices[0].message.content);
      const errs = shape(chunk, out, name);
      if (errs.length) throw new Error(`shape: ${errs.slice(0, 3).join("; ")}`);
      return out;
    } catch (e) {
      console.warn(`  retry ${name} (${language}) #${attempt + 1}: ${e.message.slice(0, 120)}`);
    }
  }
  throw new Error(`failed ${name} ${language}`);
}

const targets = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(LANGS);

for (const code of targets) {
  const language = LANGS[code];
  if (!language) throw new Error(`unknown locale ${code}`);
  console.log(`→ ${code} (${language})`);
  const entries = Object.entries(en);
  const results = [];
  // 3 chunks in flight at a time
  for (let i = 0; i < entries.length; i += 3) {
    const batch = entries.slice(i, i + 3);
    results.push(...(await Promise.all(batch.map(([k, v]) => translateChunk(k, v, language).then((o) => [k, o])))));
  }
  const out = Object.fromEntries(results);
  fs.writeFileSync(path.join(DICT, `${code}.json`), JSON.stringify(out, null, 2) + "\n");
  console.log(`  wrote ${code}.json`);
}
