"""Derive transparent, recoloured logo variants from the original logo.png (one-off asset prep)."""
from PIL import Image, ImageDraw, ImageFont
import numpy as np

src = Image.open("public/images/logo.png").convert("RGB")
a = np.asarray(src).astype(float)
lum = a.mean(axis=2)
alpha = np.clip((255 - lum) / 175, 0, 1)
alpha = np.where(alpha < 0.06, 0, alpha) ** 0.8

def tint(rgb, name):
    out = np.zeros((*alpha.shape, 4), dtype=np.uint8)
    out[..., :3] = rgb
    out[..., 3] = (alpha * 255).astype(np.uint8)
    im = Image.fromarray(out, "RGBA")
    im = im.resize((im.width * 2, im.height * 2), Image.LANCZOS)
    im.save(f"public/images/{name}")
    return im

cream = tint((244, 228, 198), "logo-cream.png")
brand = tint((125, 43, 27), "logo-brand.png")

# tree mark only (top ~62% of the logo, above the wordmark rule)
w, h = cream.size
mark = cream.crop((int(w*.22), 0, int(w*.78), int(h*.66)))
mark.save("public/images/mark-cream.png")
brand.crop((int(brand.width*.22), 0, int(brand.width*.78), int(brand.height*.66))).save("public/images/mark-brand.png")

# favicon / app icon: gold tree on navy rounded square
S = 512
ic = Image.new("RGBA", (S, S), (0, 0, 0, 0))
d = ImageDraw.Draw(ic)
d.rounded_rectangle((0, 0, S, S), radius=112, fill=(139, 56, 34, 255))
m = mark.copy(); m.thumbnail((S*.74, S*.74), Image.LANCZOS)
ic.paste(m, ((S-m.width)//2, (S-m.height)//2), m)
ic.save("public/icon.png")
ic.resize((180, 180), Image.LANCZOS).save("public/apple-icon.png")

# Open Graph card 1200x630
W, H = 1200, 630
og = Image.new("RGB", (W, H), (58, 18, 11))
bn = Image.open("public/images/banner.jpg").convert("RGB").resize((int(H*3.0), H))
bn = Image.eval(bn, lambda v: int(v*0.5))
tint_layer = Image.new("RGB", bn.size, (120, 40, 24))
from PIL import ImageChops
bn = ImageChops.multiply(bn, tint_layer).point(lambda v: min(255, int(v*2.2)))
og.paste(bn.crop((bn.width-W//1, 0, bn.width, H)).resize((W, H)), (0, 0))
grad = Image.new("L", (W, H))
gd = ImageDraw.Draw(grad)
for x in range(W):
    gd.line([(x, 0), (x, H)], fill=int(255 * max(0, min(1, 1.15 - x / (W*0.85)))))
og = Image.composite(Image.new("RGB", (W, H), (58, 18, 11)), og, grad)
d = ImageDraw.Draw(og)
try:
    serif = ImageFont.truetype("C:/Windows/Fonts/georgia.ttf", 64)
    serifb = ImageFont.truetype("C:/Windows/Fonts/georgiab.ttf", 30)
    sans = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 28)
except Exception:
    serif = serifb = sans = ImageFont.load_default()
m2 = mark.copy(); m2.thumbnail((120, 120), Image.LANCZOS)
og.paste(m2, (80, 80), m2)
d.text((220, 96), "FAITH EDUCATION", font=serifb, fill=(228, 199, 150))
d.text((220, 140), "Sydney  ·  Jakarta", font=sans, fill=(236, 214, 190))
d.text((80, 270), "Your path to an", font=serif, fill=(255, 255, 255))
d.text((80, 345), "Australian education,", font=serif, fill=(255, 255, 255))
d.text((80, 420), "planned end to end.", font=serif, fill=(228, 199, 150))
d.line([(80, 540), (200, 540)], fill=(228, 199, 150), width=3)
d.text((80, 556), "Trusted Education & Migration Agent", font=sans, fill=(236, 214, 190))
og.save("public/og.png", optimize=True)

print("ok")
