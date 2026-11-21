"""Тал нутгийн объектууд: гэр, мод, бут, мөөг, хонь, овоо, сүлд, зам гэх мэт."""
import random
from PIL import ImageDraw
from pixel import Layer, render, dots, hexc, new, save

OUT = hexc('#3D2A33')  # лавлах зураг шиг бараан ягаавтар хүрээ
FELT = hexc('#F2EBDD'); FELT_L = hexc('#FFFBF2'); FELT_D = hexc('#D9CCB5')
ROOF = hexc('#E7DDC9'); ROOF_D = hexc('#CBBDA3'); ROPE = hexc('#8A6A4A')
RED = hexc('#C2412F'); GOLD = hexc('#F2C14E'); BLUE = hexc('#3E7CC4')
DOOR = hexc('#E07A2E'); DOOR_L = hexc('#F29A4F'); DOOR_D = hexc('#B35A1C')
WOOD = hexc('#C9824A'); WOOD_L = hexc('#E39E62'); WOOD_D = hexc('#9A5E32')
G1 = hexc('#8CC266'); G1_L = hexc('#AED787'); G1_D = hexc('#6CA34E'); G1_M = hexc('#5C8F42')
G2 = hexc('#5FA053'); G2_L = hexc('#7DBA69'); G2_D = hexc('#468240'); G2_M = hexc('#3A6E36')
STONE = hexc('#A9A39B'); STONE_L = hexc('#C9C3BA'); STONE_D = hexc('#857F78')
SAND = hexc('#ECDAB8'); SAND_D = hexc('#D6BE96'); PEBBLE = hexc('#C2A57E')


def ger(lit=False):
    W, H = 66, 52
    c = new(W, H)
    # Газрын сүүдэр
    sh = Layer(W, H).ellipse(4, 44, 62, 51)
    render(c, sh, hexc('#000000', 45))
    # Хана (туурга)
    wall = Layer(W, H).rect(7, 25, 58, 46)
    render(c, wall, FELT, None, FELT_D, OUT, dark_bottom=2)
    px = c.load()
    for y in range(26, 46):  # цилиндр мэт: хажуу тал бараан, дунд нь цайвар
        for x in (8, 9, 56, 57):
            px[x, y] = FELT_D
        for x in range(22, 30):
            if y < 44:
                px[x, y] = FELT_L
    # Хээтэй тууз
    for x in range(7, 59):
        px[x, 28] = RED; px[x, 29] = RED
        if x % 4 == 0:
            px[x, 28] = GOLD
        if x % 4 == 2:
            px[x, 29] = GOLD
    # Бүслүүр (олс)
    for x in range(7, 59):
        px[x, 34] = ROPE
        px[x, 41] = ROPE
    # Дээвэр — монгол гэр шиг бөмбөгөр (эллипсийн дээд хагас)
    roof = Layer(W, H).ellipse(2, 11, 64, 41)
    roof.d.rectangle([0, 27, W, H], fill=0)
    render(c, roof, ROOF, FELT_L, ROOF_D, OUT, light_top=1, dark_bottom=1)
    d = ImageDraw.Draw(c)
    for x0 in (8, 16, 25, 41, 50, 58):  # уни (тооноос доош радиаль шугам)
        d.line([(33 + (x0 - 33) // 4, 13), (x0, 25)], fill=ROOF_D)
    d.arc([6, 15, 60, 37], 200, 340, fill=ROPE)
    # Тооно
    tn = Layer(W, H).rect(28, 9, 38, 12)
    render(c, tn, WOOD, WOOD_L, WOOD_D, OUT)
    dots(c, [(x, 10) for x in range(30, 37, 2)], WOOD_D)
    # Хаалга
    door = Layer(W, H).rect(28, 31, 38, 46)
    render(c, door, DOOR, DOOR_L, DOOR_D, OUT, light_left=1)
    d.rectangle([30, 33, 32, 44], outline=DOOR_D)
    d.rectangle([34, 33, 36, 44], outline=DOOR_D)
    dots(c, [(31, 36), (35, 36), (31, 41), (35, 41)], GOLD)
    if lit:
        d.rectangle([30, 33, 36, 38], fill=hexc('#FFD86B'))
        dots(c, [(33, 33), (33, 34), (33, 35), (33, 36), (33, 37), (33, 38)], DOOR_D)
    # Хаалганы өмнөх чулуун шат
    for i, (x0, y0) in enumerate([(30, 47), (29, 49)]):
        st = Layer(W, H).rect(x0, y0, x0 + 8 - i * 0, y0 + 1)
        render(c, st, STONE, STONE_L, None, OUT)
    return c


def tree(variant=0, seed=1):
    random.seed(seed)
    W, H = 44, 58
    base, light, dark, mark = (G1, G1_L, G1_D, G1_M) if variant == 0 else (G2, G2_L, G2_D, G2_M)
    c = new(W, H)
    sh = Layer(W, H).ellipse(10, 51, 34, 57)
    render(c, sh, hexc('#000000', 40))
    tr = Layer(W, H).poly([(19, 36), (25, 36), (25, 48), (29, 54), (24, 52), (22, 55), (20, 52), (15, 54), (19, 48)])
    render(c, tr, WOOD, WOOD_L, WOOD_D, OUT, light_left=1)
    # Титэм — лавлах зураг шиг дугуйвтар дөрвөлжин, "булбарай" ирмэгтэй
    cr = Layer(W, H)
    cr.rect(5, 6, 39, 38)
    for (x, y) in [(5, 6), (39, 6), (5, 38), (39, 38)]:
        cr.ellipse(x - 4, y - 4, x + 4, y + 4)
    for x in range(4, 41, 6):
        cr.ellipse(x - 3, 2, x + 3, 8)
        cr.ellipse(x - 3, 36, x + 3, 42)
    for y in range(6, 40, 6):
        cr.ellipse(1, y - 3, 7, y + 3)
        cr.ellipse(37, y - 3, 43, y + 3)
    render(c, cr, base, light, dark, OUT, light_top=2, dark_bottom=3)
    # "3" хэлбэрийн зураас (навчны бүтэц)
    for _ in range(7):
        x, y = random.randint(9, 32), random.randint(10, 32)
        dots(c, [(x, y), (x + 1, y), (x + 2, y + 1), (x + 1, y + 2), (x + 2, y + 3), (x + 1, y + 4), (x, y + 4)], mark)
    return c


def bush(variant=0):
    W, H = 26, 18
    base, light, dark, mark = (G1, G1_L, G1_D, G1_M) if variant == 0 else (G2, G2_L, G2_D, G2_M)
    c = new(W, H)
    b = Layer(W, H)
    b.ellipse(1, 4, 14, 16).ellipse(9, 1, 24, 16).ellipse(5, 6, 20, 17)
    render(c, b, base, light, dark, OUT, light_top=1, dark_bottom=2)
    dots(c, [(6, 9), (7, 10), (12, 6), (13, 7), (17, 8), (18, 9), (10, 12), (11, 11), (19, 12)], mark)
    return c


def mushroom(color):
    W, H = 9, 9
    c = new(W, H)
    st = Layer(W, H).rect(3, 4, 5, 8)
    render(c, st, hexc('#F4ECDD'), None, hexc('#D8CCB8'), OUT)
    cap = Layer(W, H).ellipse(0, 0, 8, 6).rect(0, 3, 8, 4)
    cap2 = Layer(W, H).ellipse(1, 1, 7, 5)
    render(c, cap2, hexc(color), None, None, OUT)
    dots(c, [(3, 2), (5, 3)], hexc('#FFFFFF'))
    return c


def tuft():
    c = new(9, 6)
    dots(c, [(1, 5), (1, 4), (2, 3), (4, 5), (4, 4), (4, 3), (4, 2), (7, 5), (7, 4), (6, 3)], G1_M)
    return c


def flower(color):
    c = new(5, 6)
    dots(c, [(2, 3), (2, 4), (2, 5)], G1_M)
    dots(c, [(2, 0), (1, 1), (3, 1), (2, 2)], hexc(color))
    dots(c, [(2, 1)], GOLD)
    return c


def rock():
    W, H = 14, 9
    c = new(W, H)
    r = Layer(W, H).ellipse(1, 1, 12, 8)
    render(c, r, STONE, STONE_L, STONE_D, OUT)
    return c


def fence():
    W, H = 40, 14
    c = new(W, H)
    for i in range(6):
        x = 1 + i * 6 + (1 if i % 2 else 0)
        p = Layer(W, H).rect(x, 3, x + 4, 13).ellipse(x, 1, x + 4, 5)
        render(c, p, WOOD, WOOD_L, WOOD_D, OUT, light_left=1)
    return c


def ovoo():
    W, H = 46, 50
    c = new(W, H)
    sh = Layer(W, H).ellipse(3, 42, 43, 49)
    render(c, sh, hexc('#000000', 45))
    stones = [(4, 36, 18, 46), (16, 38, 30, 47), (28, 36, 42, 46), (9, 29, 22, 39), (22, 29, 36, 39), (13, 22, 27, 31), (19, 16, 29, 24)]
    for i, s in enumerate(stones):
        st = Layer(W, H).ellipse(*s)
        render(c, st, STONE if i % 2 else STONE_L, STONE_L, STONE_D, OUT)
    pole = Layer(W, H).rect(23, 2, 24, 18)
    render(c, pole, WOOD_D, None, None, OUT)
    d = ImageDraw.Draw(c)
    for (pts, col) in [([(24, 4), (30, 7), (35, 13)], BLUE), ([(24, 7), (29, 11), (32, 18)], hexc('#5FA3E6')), ([(23, 5), (17, 9), (13, 15)], BLUE)]:
        d.line(pts, fill=col, width=2)
    return c


def sulde():
    W, H = 30, 72
    c = new(W, H)
    sh = Layer(W, H).ellipse(4, 64, 26, 71)
    render(c, sh, hexc('#000000', 45))
    base = Layer(W, H).rect(7, 60, 22, 66)
    render(c, base, STONE, STONE_L, STONE_D, OUT)
    pole = Layer(W, H).rect(14, 10, 15, 60)
    render(c, pole, hexc('#4A3426'), None, None, OUT)
    tip = Layer(W, H).poly([(14, 0), (17, 7), (12, 7)]).rect(12, 7, 17, 8)
    render(c, tip, GOLD, hexc('#FFE08A'), hexc('#C79A2E'), OUT)
    hair = Layer(W, H).poly([(11, 9), (18, 9), (22, 18), (24, 30), (19, 26), (15, 31), (10, 26), (5, 30), (7, 18)])
    render(c, hair, hexc('#1E1E22'), hexc('#3A3A42'), None, OUT)
    ring = Layer(W, H).rect(11, 34, 18, 36)
    render(c, ring, hexc('#7A5233'), None, None, OUT)
    return c


def signpost():
    W, H = 34, 34
    c = new(W, H)
    post = Layer(W, H).rect(15, 6, 18, 32)
    render(c, post, WOOD, WOOD_L, WOOD_D, OUT, light_left=1)
    a = Layer(W, H).poly([(4, 6), (25, 6), (30, 10), (25, 14), (4, 14)])
    render(c, a, WOOD_L, hexc('#F2B97E'), WOOD, OUT)
    b = Layer(W, H).poly([(9, 17), (29, 17), (29, 24), (9, 24), (4, 20)])
    render(c, b, WOOD_L, hexc('#F2B97E'), WOOD, OUT)
    return c


def gate():
    W, H = 30, 26
    c = new(W, H)
    for x in (2, 24):
        p = Layer(W, H).rect(x, 2, x + 3, 25)
        render(c, p, WOOD, WOOD_L, WOOD_D, OUT)
    for y in (7, 15):
        r = Layer(W, H).rect(0, y, 29, y + 3)
        render(c, r, WOOD_L, hexc('#F2B97E'), WOOD, OUT)
    return c


def sheep(frame=0):
    W, H = 20, 15
    c = new(W, H)
    b = frame
    for x in (5, 13):
        lg = Layer(W, H).rect(x, 10, x + 1, 14 - (b if x == 5 else 0))
        render(c, lg, hexc('#2A2326'), None, None, None)
    wool = Layer(W, H).ellipse(2, 3, 17, 12).ellipse(4, 1, 12, 7)
    render(c, wool, hexc('#F7F3EA'), hexc('#FFFFFF'), hexc('#DCD3C2'), OUT)
    hd = Layer(W, H).ellipse(14, 4 + b, 19, 9 + b)
    render(c, hd, hexc('#2A2326'), None, None, OUT)
    dots(c, [(17, 6 + b)], hexc('#FFFFFF'))
    return c


def road_tile():
    """Хэвтээ чиглэлд давтагдах шороон зам (дээд, доод ирмэг долгионтой)."""
    W, H = 48, 26
    c = new(W, H)
    px = c.load()
    random.seed(3)
    for x in range(W):
        top = 3 + (1 if (x // 4) % 2 else 0)
        bot = H - 4 - (1 if ((x + 2) // 4) % 2 else 0)
        for y in range(top, bot + 1):
            px[x, y] = SAND
        px[x, top - 1] = OUT
        px[x, bot + 1] = OUT
        px[x, top] = hexc('#F6E8CC')
        px[x, bot] = SAND_D
    for _ in range(26):
        x, y = random.randint(1, W - 2), random.randint(7, H - 8)
        px[x, y] = PEBBLE
    return c


def grass_tile():
    """Дэвсгэр өвс: жигд өнгө + жижиг толбо (давтагдана)."""
    W, H = 32, 32
    c = new(W, H)
    px = c.load()
    for y in range(H):
        for x in range(W):
            px[x, y] = hexc('#C6E39A')
    random.seed(9)
    for _ in range(10):
        x, y = random.randint(0, W - 1), random.randint(0, H - 1)
        px[x, y] = hexc('#B3D687')
    return c


if __name__ == '__main__':
    import sys
    o = sys.argv[1]
    save(ger(), f'{o}/ger.png'); save(ger(True), f'{o}/ger_lit.png')
    save(tree(0, 1), f'{o}/tree_a.png'); save(tree(1, 2), f'{o}/tree_b.png')
    save(bush(0), f'{o}/bush_a.png'); save(bush(1), f'{o}/bush_b.png')
    save(mushroom('#E5533D'), f'{o}/mush_red.png'); save(mushroom('#4C86D9'), f'{o}/mush_blue.png')
    save(tuft(), f'{o}/tuft.png'); save(rock(), f'{o}/rock.png'); save(fence(), f'{o}/fence.png')
    save(flower('#F28AB2'), f'{o}/flower_pink.png'); save(flower('#FFFFFF'), f'{o}/flower_white.png')
    save(ovoo(), f'{o}/ovoo.png'); save(sulde(), f'{o}/sulde.png'); save(signpost(), f'{o}/sign.png'); save(gate(), f'{o}/gate.png')
    save(sheep(0), f'{o}/sheep_0.png'); save(sheep(1), f'{o}/sheep_1.png')
    save(road_tile(), f'{o}/road.png'); save(grass_tile(), f'{o}/grass.png')
