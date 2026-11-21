"""Апп-ын icon, splash зураг — пиксел морьтон, нар жаргах тал нутаг."""
import sys
from PIL import Image
from pixel import Layer, render, dots, hexc, new
import horse

OUT = hexc('#3D2A33')


def sky(w, h):
    c = new(w, h)
    px = c.load()
    bands = ['#3A2347', '#5A2D55', '#8C3A55', '#C2512F', '#E8783A', '#F2A04A', '#F7C766']
    for y in range(h):
        col = hexc(bands[min(len(bands) - 1, y * len(bands) // int(h * 0.78))])
        for x in range(w):
            px[x, y] = col
    sun = Layer(w, h).ellipse(w * 0.58, h * 0.30, w * 0.86, h * 0.58)
    render(c, sun, hexc('#FFE3A0'), hexc('#FFF2CC'), hexc('#F7C766'))
    # Алсын уулс
    m = Layer(w, h).poly([(0, h * 0.70), (w * 0.18, h * 0.58), (w * 0.34, h * 0.68), (w * 0.55, h * 0.55), (w * 0.78, h * 0.67), (w, h * 0.6), (w, h), (0, h)])
    render(c, m, hexc('#6B3A5E'), hexc('#82497A'), None, None)
    g = Layer(w, h).rect(0, h * 0.78, w, h)
    render(c, g, hexc('#8CC266'), hexc('#AED787'), hexc('#6CA34E'), OUT)
    return c


def icon():
    c = sky(64, 64)
    r = horse.frame(0)  # 60x60
    c.alpha_composite(r, (2, 4))
    return c


if __name__ == '__main__':
    o = sys.argv[1]
    ic = icon()
    ic.resize((1024, 1024), Image.NEAREST).save(f'{o}/icon.png')
    ic.resize((48, 48), Image.NEAREST).save(f'{o}/favicon.png')
    # Android adaptive icon: урд талд морьтон (ил тод), ард нь тэнгэр
    fg = new(96, 96)
    fg.alpha_composite(horse.frame(0), (18, 16))
    fg.resize((1056, 1056), Image.NEAREST).save(f'{o}/android-icon-foreground.png')
    sky(64, 64).resize((1024, 1024), Image.NEAREST).save(f'{o}/android-icon-background.png')
    mono = fg.convert('LA')
    mono.resize((1056, 1056), Image.NEAREST).save(f'{o}/android-icon-monochrome.png')
    # Splash: зогсож буй морьтон
    sp = new(64, 64)
    sp.alpha_composite(horse.frame(0, idle=True), (2, 2))
    sp.resize((640, 640), Image.NEAREST).save(f'{o}/splash-icon.png')
    print('ok')
