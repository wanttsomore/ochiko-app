// Тал нутгийн дүрслэл — бүгдийг react-native-svg ашиглан кодоор зурсан.
import React, { useMemo } from 'react';
import Svg, { Circle, Ellipse, G, Line, Path, Polygon, Rect } from 'react-native-svg';

// Давтагдах боломжтой "санамсаргүй" тоо (seed) — уулсын хэлбэр дахин ачаалахад өөрчлөгдөхгүй
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

// Уулсын нуруу: өргөн дагуу цэгүүд үүсгээд гөлгөр муруйгаар холбоно
export function Ridge({ width, height, color, seed, peaks = 0.5, step = 120 }: {
  width: number; height: number; color: string; seed: number; peaks?: number; step?: number;
}) {
  const d = useMemo(() => {
    const r = rng(seed);
    let p = `M0 ${height} L0 ${height * (1 - peaks * r())}`;
    for (let x = step; x <= width + step; x += step) {
      const y = height * (1 - (0.25 + peaks * 0.75 * r()));
      const cx = x - step / 2;
      p += ` Q${cx} ${y - height * 0.15 * r()} ${x} ${y}`;
    }
    return p + ` L${width + step} ${height} Z`;
  }, [width, height, seed, peaks, step]);
  return (
    <Svg width={width} height={height}>
      <Path d={d} fill={color} />
    </Svg>
  );
}

// Монгол гэр
export function Ger({ size = 150, lit, sign }: { size?: number; lit?: string; sign?: boolean }) {
  return (
    <Svg width={size} height={size * 0.8} viewBox="0 0 150 120">
      <Ellipse cx={75} cy={114} rx={70} ry={6} fill="rgba(0,0,0,0.25)" />
      <Rect x={16} y={58} width={118} height={54} rx={6} fill="#F3EEE4" />
      <Path d="M10 62 Q75 14 140 62 Z" fill="#E6DECF" />
      <Path d="M30 50 Q75 22 120 50" stroke="#CFC4B0" strokeWidth={2} fill="none" />
      <Circle cx={75} cy={30} r={7} fill="#D9CDB7" />
      {/* Хээтэй тууз */}
      <Rect x={16} y={64} width={118} height={7} fill="#C8502A" />
      {Array.from({ length: 9 }, (_, i) => (
        <Rect key={i} x={22 + i * 13} y={66} width={6} height={3} fill="#F3C969" />
      ))}
      {/* Улбар шар хаалга */}
      <Rect x={61} y={76} width={28} height={36} rx={2} fill={lit ?? '#D9822B'} />
      <Rect x={65} y={80} width={9} height={28} fill="none" stroke="#8A4A16" strokeWidth={1.5} />
      <Rect x={76} y={80} width={9} height={28} fill="none" stroke="#8A4A16" strokeWidth={1.5} />
      {sign && <Line x1={75} y1={8} x2={75} y2={26} stroke="#6B4A2E" strokeWidth={3} />}
    </Svg>
  );
}

// Овоо — чулуун овоолго, хөх хадагтай
export function Ovoo({ size = 130 }: { size?: number }) {
  const stones = [
    [65, 100, 52, 12], [40, 92, 18, 9], [88, 92, 20, 9], [65, 86, 38, 10],
    [52, 76, 16, 8], [78, 76, 17, 8], [65, 68, 26, 9], [65, 56, 16, 8],
  ];
  return (
    <Svg width={size} height={size} viewBox="0 0 130 130">
      <Ellipse cx={65} cy={112} rx={58} ry={6} fill="rgba(0,0,0,0.25)" />
      {stones.map(([cx, cy, rx, ry], i) => (
        <Ellipse key={i} cx={cx} cy={cy} rx={rx} ry={ry} fill={i % 2 ? '#8C8A86' : '#A3A09A'} />
      ))}
      <Line x1={65} y1={56} x2={65} y2={6} stroke="#6B4A2E" strokeWidth={4} />
      <Path d="M65 14 Q85 20 96 34" stroke="#3E8EDB" strokeWidth={5} fill="none" strokeLinecap="round" />
      <Path d="M65 24 Q82 30 92 46" stroke="#5FA8EE" strokeWidth={4} fill="none" strokeLinecap="round" />
      <Path d="M65 18 Q48 26 40 40" stroke="#3E8EDB" strokeWidth={4} fill="none" strokeLinecap="round" />
    </Svg>
  );
}

// Сүлд (туг) — хамгийн сүүлийн түвшин
export function Sulde({ size = 190, glow }: { size?: number; glow?: string }) {
  return (
    <Svg width={size * 0.6} height={size} viewBox="0 0 114 190">
      <Ellipse cx={57} cy={184} rx={44} ry={5} fill="rgba(0,0,0,0.3)" />
      {glow && <Circle cx={57} cy={40} r={34} fill={glow} opacity={0.25} />}
      <Rect x={54} y={30} width={6} height={152} fill="#3B2A1E" />
      <Polygon points="57,0 64,22 50,22" fill="#C9A24A" />
      <Rect x={47} y={22} width={20} height={5} rx={2} fill="#C9A24A" />
      {/* Хялгасан цацаг */}
      <Path d="M48 28 Q40 48 36 80 Q46 72 52 84 Q57 70 62 84 Q68 72 78 80 Q74 48 66 28 Z" fill="#1C1C1E" />
      <Rect x={44} y={96} width={26} height={8} rx={3} fill="#5A3E2B" />
      <Rect x={40} y={176} width={34} height={8} rx={3} fill="#5A3E2B" />
    </Svg>
  );
}

// Эхлэлийн самбар
export function Signpost({ size = 110 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 110 110">
      <Ellipse cx={55} cy={104} rx={30} ry={4} fill="rgba(0,0,0,0.25)" />
      <Rect x={51} y={30} width={8} height={74} fill="#6B4A2E" />
      <Polygon points="18,24 84,24 98,38 84,52 18,52" fill="#8A5E3B" />
      <Polygon points="22,58 80,58 80,80 22,80 10,69" fill="#7A5133" />
    </Svg>
  );
}

// Түгжээтэй хаалт — өмнөх түвшнээ дуусгах хүртэл цааш явахгүй
export function Fence({ height = 90 }: { height?: number }) {
  return (
    <Svg width={70} height={height} viewBox="0 0 70 90">
      <Rect x={6} y={10} width={9} height={80} rx={2} fill="#6B4A2E" />
      <Rect x={55} y={10} width={9} height={80} rx={2} fill="#6B4A2E" />
      <Rect x={0} y={24} width={70} height={8} rx={2} fill="#8A5E3B" />
      <Rect x={0} y={46} width={70} height={8} rx={2} fill="#8A5E3B" />
      <Rect x={0} y={68} width={70} height={8} rx={2} fill="#8A5E3B" />
    </Svg>
  );
}

// Газар дээрх өвс, чулуу (чимэглэл)
export function GroundDecor({ width, color, seed }: { width: number; color: string; seed: number }) {
  const items = useMemo(() => {
    const r = rng(seed);
    const out: { x: number; y: number; k: number; t: number }[] = [];
    for (let x = 20; x < width; x += 50 + r() * 90) out.push({ x, y: 4 + r() * 50, k: 0.6 + r() * 0.8, t: r() });
    return out;
  }, [width, seed]);
  return (
    <Svg width={width} height={70}>
      {items.map((it, i) =>
        it.t < 0.75 ? (
          <G key={i} transform={`translate(${it.x} ${it.y}) scale(${it.k})`}>
            <Path d="M0 12 Q2 2 4 0 M4 12 Q5 4 9 1 M7 12 Q10 6 14 4" stroke={color} strokeWidth={2} fill="none" strokeLinecap="round" />
          </G>
        ) : (
          <Ellipse key={i} cx={it.x} cy={it.y + 8} rx={7 * it.k} ry={4 * it.k} fill={color} opacity={0.8} />
        ),
      )}
    </Svg>
  );
}

// Үүл / од
export function SkyDecor({ width, height, cloud, night, seed }: { width: number; height: number; cloud: string; night: boolean; seed: number }) {
  const items = useMemo(() => {
    const r = rng(seed);
    return Array.from({ length: night ? 90 : 9 }, () => ({ x: r() * width, y: r() * height * (night ? 0.7 : 0.45), s: r() }));
  }, [width, height, night, seed]);
  return (
    <Svg width={width} height={height}>
      {night
        ? items.map((s, i) => <Circle key={i} cx={s.x} cy={s.y} r={0.6 + s.s * 1.4} fill="#FFFFFF" opacity={0.35 + s.s * 0.6} />)
        : items.map((c, i) => (
            <G key={i} opacity={0.9}>
              <Ellipse cx={c.x} cy={c.y + 40} rx={46 + c.s * 40} ry={12 + c.s * 6} fill={cloud} />
              <Ellipse cx={c.x + 20} cy={c.y + 32} rx={26 + c.s * 20} ry={12} fill={cloud} />
            </G>
          ))}
    </Svg>
  );
}
