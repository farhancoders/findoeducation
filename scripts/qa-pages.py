import re, json, urllib.request, urllib.error, sys
B = "http://localhost:3000"
LOCALES = ["en","id","ru","fr","it","es","zh","ja","ko"]
HTML_LANG = {"en":"en-AU","zh":"zh-Hans"}
PATHS = ["", "/our-services", "/who-are-we", "/contact-us", "/privacy-and-cookies-policy"]
bad = []

def get(url):
    try:
        r = urllib.request.urlopen(url, timeout=60)
        return r.status, r.read().decode("utf8")
    except urllib.error.HTTPError as e:
        return e.code, ""

n = 0
for l in LOCALES:
    for p in PATHS:
        url = f"{B}/{l}{p}"
        st, h = get(url); n += 1
        probs = []
        if st != 200: probs.append(f"HTTP {st}")
        m = re.search(r'<html[^>]*lang="([^"]+)"', h)
        if not m or m.group(1) != HTML_LANG.get(l, l): probs.append(f"html lang={m.group(1) if m else None}")
        if h.count("<h1") != 1: probs.append(f"h1 count={h.count('<h1')}")
        t = re.search(r"<title>(.*?)</title>", h)
        if not t or not t.group(1).strip(): probs.append("no title")
        for needle in ["undefined", "[object Object]", "NaN", "{{", "*Australian*"]:
            # ignore inside script payloads
            body = re.sub(r"<script.*?</script>", "", h, flags=re.S)
            if needle in body: probs.append(f"contains {needle!r}")
        body = re.sub(r"<script.*?</script>|<style.*?</style>", "", h, flags=re.S)
        text = re.sub(r"<[^>]+>", " ", body)
        if re.search(r"(?<!\w)\*[^*\s][^*]*\*(?!\w)", text): probs.append("stray *emphasis* markers visible")
        for name in ["canonical", "hreflang"]:
            if name == "canonical" and 'rel="canonical"' not in h: probs.append("no canonical")
        if h.count('hreflang="') < 9: probs.append(f"hreflang x{h.count('hreflang=')}")
        if 'application/ld+json' not in h: probs.append("no JSON-LD")
        # every internal link must be locale-prefixed
        for href in set(re.findall(r'href="(/[^"#?]*)', h)):
            if href.startswith(("/_next","/icon","/apple","/og","/images","/sitemap","/robots","/manifest","/favicon")): continue
            if not re.match(rf"^/{l}(/|$)", href) and not re.match(r"^/(en|id|ru|fr|it|es|zh|ja|ko)(/|$)", href):
                probs.append(f"unprefixed link {href}")
        if probs: bad.append((url, probs))
print(f"checked {n} pages; problems on {len(bad)}")
for u, p in bad: print(" -", u, p)

# misc routes
for path in ["/", "/our-services", "/sitemap.xml", "/robots.txt", "/manifest.webmanifest", "/og.png", "/icon.png", "/xx", "/en/nope"]:
    try:
        r = urllib.request.urlopen(urllib.request.Request(B+path), timeout=30)
        print(path, r.status, r.geturl())
    except urllib.error.HTTPError as e:
        print(path, e.code)
st, sm = get(B+"/sitemap.xml"); print("sitemap urls:", sm.count("<loc>"))
