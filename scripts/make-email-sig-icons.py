from pathlib import Path
from PIL import Image, ImageDraw

OUT = Path(__file__).resolve().parents[1] / "images"
ORANGE = (255, 89, 16, 255)
WHITE = (255, 255, 255, 255)
SIZE = 64


def circle_bg():
    im = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.ellipse((0, 0, SIZE - 1, SIZE - 1), fill=ORANGE)
    return im, d


def make_globe():
    im, d = circle_bg()
    cx = cy = 31.5
    r = 18
    d.ellipse((cx - r, cy - r, cx + r, cy + r), outline=WHITE, width=3)
    d.ellipse((cx - r * 0.45, cy - r, cx + r * 0.45, cy + r), outline=WHITE, width=2)
    d.line((cx - r, cy, cx + r, cy), fill=WHITE, width=2)
    d.arc((cx - r, cy - r * 0.4, cx + r, cy + r * 0.4), 0, 360, fill=WHITE, width=2)
    path = OUT / "email-icon-globe.png"
    im.save(path, "PNG")
    return path


def make_linkedin():
    im, d = circle_bg()
    # "in" mark
    d.rectangle((18, 26, 24, 46), fill=WHITE)
    d.ellipse((18, 16, 24, 22), fill=WHITE)
    d.rectangle((30, 26, 36, 46), fill=WHITE)
    d.rectangle((30, 26, 46, 32), fill=WHITE)
    d.rectangle((40, 32, 46, 46), fill=WHITE)
    path = OUT / "email-icon-linkedin.png"
    im.save(path, "PNG")
    return path


if __name__ == "__main__":
    print(make_globe())
    print(make_linkedin())
