"""Апп-ын дуунуудыг кодоор үүсгэнэ (бэлэн дуу ашиглаагүй).
Ажиллуулах: python3 scripts/sounds/make_sounds.py assets/sounds
Синус, дөрвөлжин долгион, шуугиан (noise)-ийг хольж 8-bit тоглоомын маягийн дуу гаргана.
"""
import math, random, struct, sys, wave

RATE = 22050


def env(t, dur, a=0.005, r=0.08):
    """Дууны чангын муруй: хурдан эхэлж, зөөлөн унтарна."""
    if t < a:
        return t / a
    if t > dur - r:
        return max(0.0, (dur - t) / r)
    return 1.0


def tone(freq, dur, wave_type='square', vol=0.35, slide=0.0):
    out = []
    phase = 0.0
    for i in range(int(RATE * dur)):
        t = i / RATE
        f = freq + slide * t / dur
        phase += 2 * math.pi * f / RATE
        if wave_type == 'square':
            s = 1.0 if math.sin(phase) >= 0 else -1.0
        elif wave_type == 'tri':
            s = 2 / math.pi * math.asin(math.sin(phase))
        else:
            s = math.sin(phase)
        out.append(s * vol * env(t, dur))
    return out


def noise(dur, vol=0.4, lowpass=0.3):
    out, prev = [], 0.0
    for i in range(int(RATE * dur)):
        t = i / RATE
        prev = prev + lowpass * (random.uniform(-1, 1) - prev)
        out.append(prev * vol * env(t, dur, 0.002, dur * 0.8))
    return out


def silence(dur):
    return [0.0] * int(RATE * dur)


def mix(*tracks):
    n = max(len(t) for t in tracks)
    return [sum(t[i] for t in tracks if i < len(t)) for i in range(n)]


def write(path, samples):
    with wave.open(path, 'w') as w:
        w.setnchannels(1); w.setsampwidth(2); w.setframerate(RATE)
        w.writeframes(b''.join(struct.pack('<h', int(max(-1, min(1, s)) * 32000)) for s in samples))


if __name__ == '__main__':
    random.seed(7)
    o = sys.argv[1]
    # Морины туурай: богино "тог" — бага давтамжтай шуугиан + бага тон
    write(f'{o}/hoof.wav', mix(noise(0.07, 0.5, 0.18), tone(140, 0.06, 'sine', 0.35, -60)))
    # Товч дарах: маш богино "тик"
    write(f'{o}/click.wav', tone(1200, 0.03, 'square', 0.12))
    # Түвшинд ойртох: зөөлөн "блип"
    write(f'{o}/blip.wav', tone(660, 0.07, 'tri', 0.3) + tone(990, 0.08, 'tri', 0.3))
    # Самбар нээх: дээшээ гулсах тон
    write(f'{o}/open.wav', tone(440, 0.16, 'tri', 0.3, 440))
    # LEVEL UP: монгол пентатоник (до-ре-ми-соль-ля) арпеджио
    notes = [523, 587, 659, 784, 880, 1047]
    write(f'{o}/levelup.wav', sum([tone(f, 0.085, 'square', 0.22) for f in notes], []) + tone(1047, 0.25, 'tri', 0.3))
    # Хаалт мөргөх: доошоо унах бүдүүн дуу
    write(f'{o}/bump.wav', mix(tone(160, 0.14, 'square', 0.25, -80), noise(0.08, 0.3, 0.2)))
    # Оноо авах (орб, хоол)
    write(f'{o}/coin.wav', tone(988, 0.05, 'square', 0.22) + tone(1319, 0.12, 'square', 0.22))
    # Мөргөх (хорхой, солир)
    write(f'{o}/hit.wav', mix(noise(0.18, 0.55, 0.5), tone(110, 0.18, 'square', 0.25, -60)))
    # 3-2-1 тоолох, ЯВ
    write(f'{o}/beep.wav', tone(660, 0.1, 'square', 0.25))
    write(f'{o}/go.wav', tone(1320, 0.25, 'square', 0.25))
    # Тоглоом дуусах
    write(f'{o}/over.wav', sum([tone(f, 0.14, 'tri', 0.3) for f in (523, 440, 349, 262)], []))
    print('ok')
