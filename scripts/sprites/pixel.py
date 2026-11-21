"""Жижиг пиксел арт сан: хэлбэр зурах, хүрээ (outline), сүүдэр/гэрэл нэмэх.

Бүх дүрсийг жижиг (art) хэмжээгээр пиксел бүрээр зураад, эцэст нь
SCALE дахин томруулж (nearest neighbor) хадгална — ингэснээр утсан дээр
бүдгэрэлгүй, тод пиксел харагдана.
"""
from PIL import Image, ImageDraw
import math

SCALE = 10
T = (0, 0, 0, 0)


def hexc(h, a=255):
    h = h.lstrip('#')
    return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16), a)


class Layer:
    """Нэг өнгөт хэсэг (жишээ нь морины бие). Хэлбэрээ зураад shade() ба outline() хийнэ."""

    def __init__(self, w, h):
        self.w, self.h = w, h
        self.m = Image.new('L', (w, h), 0)  # маск
        self.d = ImageDraw.Draw(self.m)

    def ellipse(self, x0, y0, x1, y1):
        self.d.ellipse([x0, y0, x1, y1], fill=255)
        return self

    def rect(self, x0, y0, x1, y1):
        self.d.rectangle([x0, y0, x1, y1], fill=255)
        return self

    def poly(self, pts):
        self.d.polygon(pts, fill=255)
        return self

    def line(self, pts, width=1):
        self.d.line(pts, fill=255, width=width)
        return self

    def limb(self, x, y, segs, widths):
        """Мөч (хөл, гар): (урт, өнцөг) сегментүүд. Өнцөг = босоо тэнхлэгээс градусаар (+ = урагш)."""
        pts = [(x, y)]
        for (ln, ang), wd in zip(segs, widths):
            a = math.radians(ang)
            nx, ny = x + ln * math.sin(a), y + ln * math.cos(a)
            self.d.line([(round(x), round(y)), (round(nx), round(ny))], fill=255, width=wd)
            x, y = nx, ny
            pts.append((x, y))
        return pts

    def on(self, x, y):
        return 0 <= x < self.w and 0 <= y < self.h and self.m.getpixel((x, y)) > 0


def render(canvas, layer, base, light=None, dark=None, outline=None, light_top=1, dark_bottom=2, light_left=0):
    """Давхаргыг canvas дээр буулгана: үндсэн өнгө + дээд талд гэрэл + доод талд сүүдэр + хүрээ."""
    W, H = layer.w, layer.h
    px = canvas.load()
    for y in range(H):
        for x in range(W):
            if not layer.on(x, y):
                continue
            c = base
            if dark and any(not layer.on(x, y + k) for k in range(1, dark_bottom + 1)):
                c = dark
            if light and any(not layer.on(x, y - k) for k in range(1, light_top + 1)):
                c = light
            if light and light_left and any(not layer.on(x - k, y) for k in range(1, light_left + 1)):
                c = light
            px[x, y] = c
    if outline:
        for y in range(H):
            for x in range(W):
                if layer.on(x, y):
                    continue
                if any(layer.on(x + dx, y + dy) for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))):
                    px[x, y] = outline


def dots(canvas, pts, color):
    px = canvas.load()
    for x, y in pts:
        if 0 <= x < canvas.width and 0 <= y < canvas.height:
            px[x, y] = color


def save(canvas, path, scale=SCALE):
    canvas.resize((canvas.width * scale, canvas.height * scale), Image.NEAREST).save(path)


def new(w, h):
    return Image.new('RGBA', (w, h), T)
