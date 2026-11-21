"""Морьтон (морь + монгол дээлтэй хүн) — 6 фреймтэй давхих анимэйшн + зогсож буй фрейм."""
from pixel import Layer, render, dots, hexc, new, save

W, H = 60, 60
OY = 12  # малгайд зай гаргах

# Өнгө (лавлах зураг шиг: хүрэн морь, бараан дэл)
COAT = hexc('#B5683A'); COAT_L = hexc('#D48B56'); COAT_D = hexc('#844526'); COAT_O = hexc('#3B1F17')
FAR = hexc('#8E4D2B'); FAR_D = hexc('#6A361D')
MANE = hexc('#2F3C3E'); MANE_L = hexc('#4C6164'); MANE_O = hexc('#1A2122')
HOOF = hexc('#5E5868'); HOOF_O = hexc('#2A2530')
DEEL = hexc('#2F5E9E'); DEEL_L = hexc('#4A7FC2'); DEEL_D = hexc('#1F4377'); DEEL_O = hexc('#14243F')
SASH = hexc('#E8A93A'); SKIN = hexc('#E2B48A'); SKIN_D = hexc('#C38E64')
HAT = hexc('#B3262B'); HAT_L = hexc('#D84444'); FUR = hexc('#5A3A24'); FUR_L = hexc('#7A5233'); GOLD = hexc('#F2C14E')
BOOT = hexc('#3A2A22'); BOOT_L = hexc('#5A4232'); SADDLE = hexc('#8E3B2A'); SADDLE_L = hexc('#B5523A'); CLOTH = hexc('#D9822B')
OUT = hexc('#2B1712')

# Давхих мөчлөг: (дээд хэсгийн өнцөг, доод хэсгийн өнцөг) — босоо тэнхлэгээс, + = урагш
FORE = [(32, 58), (16, 22), (0, 2), (-18, -14), (-26, -52), (6, -74)]
HIND = [(-28, -8), (-14, -26), (6, 0), (24, 12), (14, 44), (-12, 32)]
BOB = [0, -1, -1, 0, 1, 0]
TAIL = [0, 1, 2, 1, 0, -1]


def leg(seq, i):
    a, b = seq[i % 6]
    return [(7, a), (8, b)]


def frame(i, idle=False):
    c = new(W, H)
    b = 0 if idle else BOB[i]
    y0 = OY + b
    hip_far, hip_near = (16, 28 + y0), (19, 28 + y0)
    sh_far, sh_near = (37, 29 + y0), (40, 29 + y0)

    def legs(hip, seq, phase, near):
        L = Layer(W, H)
        segs = [(7, 3 if hip[0] < 30 else -2), (8, 0)] if idle else leg(seq, i + phase)
        end = L.limb(hip[0], hip[1], segs, [4, 2])[-1]
        render(c, L, COAT if near else FAR, COAT_L if near else None, COAT_D if near else FAR_D, COAT_O, light_top=1, dark_bottom=1)
        hv = Layer(W, H).rect(round(end[0]) - 1, round(end[1]) - 1, round(end[0]) + 1, round(end[1]))
        render(c, hv, HOOF, None, None, HOOF_O)

    # Хол талын хөл (бараан) — биеийн ард
    legs(hip_far, HIND, 4, False)
    legs(sh_far, FORE, 1, False)

    # Сүүл
    t = 0 if idle else TAIL[i]
    tl = Layer(W, H).poly([(13, 19 + y0), (9, 22 + y0), (6 - t, 30 + y0), (5 - t, 38 + y0), (8 - t, 35 + y0), (10, 28 + y0), (14, 23 + y0)])
    render(c, tl, MANE, MANE_L, None, MANE_O)

    # Бие: гуя, хэвлий, цээж
    body = Layer(W, H)
    body.ellipse(10, 15 + y0, 26, 31 + y0)
    body.ellipse(17, 18 + y0, 42, 31 + y0)
    body.ellipse(32, 16 + y0, 45, 31 + y0)
    body.poly([(37, 21 + y0), (42, 10 + y0), (47, 6 + y0), (50, 10 + y0), (46, 22 + y0), (43, 27 + y0)])  # хүзүү
    body.poly([(46, 5 + y0), (49, 3 + y0), (52, 5 + y0), (57, 11 + y0), (57, 14 + y0), (53, 15 + y0), (48, 11 + y0)])  # толгой
    body.poly([(48, 4 + y0), (49, 0 + y0), (51, 4 + y0)])  # чих
    render(c, body, COAT, COAT_L, COAT_D, COAT_O, light_top=1, dark_bottom=2)
    # Булчингийн гялбаа (лавлах зураг шиг цайвар толбо)
    dots(c, [(x, y + y0) for x in range(13, 19) for y in range(18, 21)] + [(x, y + y0) for x in range(33, 39) for y in range(19, 22)], COAT_L)
    dots(c, [(x, 29 + y0) for x in range(20, 36)], COAT_D)
    # Нүд, хамрын нүх
    dots(c, [(52, 8 + y0)], OUT)
    dots(c, [(56, 12 + y0)], COAT_D)

    # Дэл
    mane = Layer(W, H).poly([(38, 20 + y0), (41, 10 + y0), (46, 4 + y0), (49, 5 + y0), (45, 11 + y0), (42, 20 + y0)])
    render(c, mane, MANE, MANE_L, None, MANE_O)

    # Ойр талын хөл
    legs(hip_near, HIND, 1 if not idle else 0, True)
    legs(sh_near, FORE, 0, True)

    # Эмээл, тохом
    cl = Layer(W, H).rect(22, 15 + y0, 31, 19 + y0)
    render(c, cl, CLOTH, None, None, OUT)
    sd = Layer(W, H).poly([(22, 15 + y0), (31, 15 + y0), (32, 12 + y0), (30, 14 + y0), (24, 14 + y0), (21, 12 + y0)])
    render(c, sd, SADDLE, SADDLE_L, None, OUT)

    # ---------- Хүн ----------
    yr = y0 - 1
    # Хөл, гутал (монгол гутлын эргэсэн хоншоор)
    th = Layer(W, H).poly([(25, 13 + yr), (29, 13 + yr), (30, 21 + yr), (27, 21 + yr)])
    render(c, th, DEEL, DEEL_L, DEEL_D, DEEL_O)
    bt = Layer(W, H).poly([(27, 20 + yr), (30, 20 + yr), (31, 24 + yr), (34, 24 + yr), (34, 22 + yr), (35, 23 + yr), (34, 25 + yr), (27, 25 + yr)])
    render(c, bt, BOOT, BOOT_L, None, OUT)
    # Их бие (дээл)
    tr = Layer(W, H).poly([(22, 15 + yr), (31, 15 + yr), (30, 4 + yr), (24, 4 + yr)])
    render(c, tr, DEEL, DEEL_L, DEEL_D, DEEL_O, light_left=1)
    dots(c, [(x, 11 + yr) for x in range(23, 31)] + [(x, 12 + yr) for x in range(23, 31)], SASH)  # бүс
    dots(c, [(28, 5 + yr), (29, 6 + yr), (30, 7 + yr)], DEEL_L)  # энгэр
    # Гар, жолоо
    arm = Layer(W, H)
    arm.limb(28, 6 + yr, [(5, 35), (5, 75)], [3, 2])
    render(c, arm, DEEL, DEEL_L, DEEL_D, DEEL_O)
    dots(c, [(37, 13 + yr), (37, 14 + yr)], SKIN)
    from PIL import ImageDraw
    ImageDraw.Draw(c).line([(38, 13 + yr), (53, 11 + yr)], fill=OUT, width=1)
    # Толгой
    hd = Layer(W, H).ellipse(24, -2 + yr, 30, 4 + yr)
    render(c, hd, SKIN, None, SKIN_D, OUT, dark_bottom=1)
    dots(c, [(29, 1 + yr)], OUT)
    dots(c, [(24, 0 + yr), (24, 1 + yr), (25, 2 + yr), (24, 2 + yr)], hexc('#1E1714'))  # үс
    # Малгай: улаан орой, үслэг хүрээ, алтан жинс
    ht = Layer(W, H).poly([(24, -2 + yr), (31, -2 + yr), (28, -7 + yr), (26, -7 + yr)])
    render(c, ht, HAT, HAT_L, None, OUT)
    fr = Layer(W, H).rect(23, -2 + yr, 31, -1 + yr)
    render(c, fr, FUR, FUR_L, None, OUT)
    dots(c, [(27, -9 + yr), (27, -8 + yr)], GOLD)
    return c


if __name__ == '__main__':
    import sys
    out = sys.argv[1]
    for i in range(6):
        save(frame(i), f'{out}/rider_{i}.png')
    save(frame(0, idle=True), f'{out}/rider_idle.png')
