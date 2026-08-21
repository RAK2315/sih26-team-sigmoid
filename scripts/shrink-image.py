# crops an optional fraction box out of a scanned album page, then shrinks to 1200 wide
import sys, os
from PIL import Image

src, dst = sys.argv[1], sys.argv[2]
crop = sys.argv[3] if len(sys.argv) > 3 else ""

im = Image.open(src).convert("RGB")
if crop:
    l, t, r, b = [float(v) for v in crop.split(",")]
    w, h = im.size
    im = im.crop((int(l * w), int(t * h), int(r * w), int(b * h)))

if im.width > 1200:
    im = im.resize((1200, round(im.height * 1200 / im.width)), Image.LANCZOS)

im.save(dst, "JPEG", quality=82, optimize=True, progressive=True)
os.remove(src)
print(f"{dst} {im.width}x{im.height}")
