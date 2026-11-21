// Тоглоом 2 — Space Dodger
// Сансрын хөлгөө утсаа хазайлгаж (эсвэл хуруугаараа чирж) зүүн/баруун тийш хөдөлгөөд унаж буй солируудаас зугт.
// Солир бүрийг давахад +1 оноо, 3 амьтай. Хугацаа өнгөрөх тусам солир хурдасна.
import React, { useEffect, useRef, useState } from 'react';
import { PanResponder, Platform, StyleSheet, View } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { Ionicons } from '@expo/vector-icons';
import { success, thud, tap } from '../components/ui';
import { useTheme } from '../theme';
import { Arena, HUD, Overlay, Phase, dist, useArena } from './GameFrame';

const SHIP = 22;
const LIVES = 3;
type Rock = { id: number; x: number; y: number; r: number; v: number };
type Star = { x: number; y: number; s: number };

export default function SpaceDodger({ onFinish }: { onFinish?: (score: number) => void }) {
  const { theme } = useTheme();
  const { size, onLayout } = useArena();
  const [phase, setPhase] = useState<Phase>('ready');
  const [, setFrame] = useState(0);
  const [best, setBest] = useState(0);

  const shipX = useRef(150);
  const shipV = useRef(0);
  const rocks = useRef<Rock[]>([]);
  const stars = useRef<Star[]>([]);
  const tiltX = useRef(0);
  const touchX = useRef<number | null>(null);
  const score = useRef(0);
  const lives = useRef(LIVES);
  const elapsed = useRef(0);
  const spawnIn = useRef(0);
  const hurtUntil = useRef(0);
  const nextId = useRef(0);

  const start = () => {
    const { w, h } = size.current;
    shipX.current = w / 2;
    shipV.current = 0;
    rocks.current = [];
    stars.current = Array.from({ length: 45 }, () => ({ x: Math.random() * w, y: Math.random() * h, s: 0.5 + Math.random() * 2 }));
    score.current = 0;
    lives.current = LIVES;
    elapsed.current = 0;
    spawnIn.current = 0.5;
    setPhase('play');
  };

  useEffect(() => {
    if (phase !== 'play' || Platform.OS === 'web') return;
    const s = Platform.OS === 'android' ? -1 : 1;
    Accelerometer.setUpdateInterval(16);
    const sub = Accelerometer.addListener(({ x }) => { tiltX.current = x * s; });
    return () => sub.remove();
  }, [phase]);

  useEffect(() => {
    if (phase !== 'play') return;
    let raf = 0, last = Date.now();
    const loop = () => {
      const now = Date.now();
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const { w, h } = size.current;
      const shipY = h - 60;
      elapsed.current += dt;
      const speed = 1 + elapsed.current / 15; // хүндрэл: 15 секунд тутам 1 дахин хурдасна

      // 1) Хөлөг: хазайлт эсвэл хурууны байрлал руу
      if (touchX.current !== null) shipV.current = (touchX.current - shipX.current) * 0.25;
      else shipV.current = shipV.current * 0.85 + tiltX.current * 3.2;
      shipX.current = Math.max(SHIP, Math.min(w - SHIP, shipX.current + shipV.current));

      // 2) Од (арын давхарга) доош гүйнэ — хөдөлгөөний мэдрэмж
      for (const st of stars.current) { st.y += st.s * 60 * dt * speed; if (st.y > h) { st.y = 0; st.x = Math.random() * w; } }

      // 3) Шинэ солир үүсгэх
      spawnIn.current -= dt;
      if (spawnIn.current <= 0) {
        const r = 12 + Math.random() * 20;
        rocks.current.push({ id: nextId.current++, x: r + Math.random() * (w - r * 2), y: -r, r, v: (120 + Math.random() * 120) * speed });
        spawnIn.current = Math.max(0.22, 0.75 - elapsed.current * 0.012);
      }

      // 4) Солир хөдөлгөх, давсан бол оноо, мөргөсөн бол амь хасах
      const keep: Rock[] = [];
      for (const r of rocks.current) {
        r.y += r.v * dt;
        if (r.y - r.r > h) { score.current++; if (score.current % 10 === 0) success(); continue; }
        if (now > hurtUntil.current && dist(r, { x: shipX.current, y: shipY }) < r.r + SHIP * 0.7) {
          lives.current--; hurtUntil.current = now + 1200; thud();
          if (lives.current <= 0) { setBest((b) => Math.max(b, score.current)); setPhase('over'); onFinish?.(score.current); return; }
          continue; // мөргөсөн солир алга болно
        }
        keep.push(r);
      }
      rocks.current = keep;

      setFrame((f) => f + 1);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  const pan = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (e) => { touchX.current = e.nativeEvent.locationX; tap(); },
    onPanResponderMove: (e) => { touchX.current = e.nativeEvent.locationX; },
    onPanResponderRelease: () => { touchX.current = null; },
    onPanResponderTerminate: () => { touchX.current = null; },
  })).current;

  const hurt = Date.now() < hurtUntil.current;
  const shipY = size.current.h - 60;
  return (
    <>
      <HUD items={[{ label: 'Оноо', value: score.current }, { label: 'Амь', value: `${Math.max(0, lives.current)} / ${LIVES}` }, { label: 'Рекорд', value: best }]} />
      <Arena onLayout={onLayout} handlers={pan.panHandlers} dark>
        {stars.current.map((s, i) => (
          <View key={i} pointerEvents="none" style={{ position: 'absolute', left: s.x, top: s.y, width: s.s, height: s.s, borderRadius: 2, backgroundColor: '#fff', opacity: 0.3 + s.s / 4 }} />
        ))}
        {phase === 'play' && (
          <>
            {rocks.current.map((r) => (
              <View key={r.id} pointerEvents="none" style={[styles.rock, { left: r.x - r.r, top: r.y - r.r, width: r.r * 2, height: r.r * 2, borderRadius: r.r }]}>
                <View style={[styles.crater, { width: r.r * 0.6, height: r.r * 0.6, borderRadius: r.r }]} />
              </View>
            ))}
            <View pointerEvents="none" style={[styles.ship, { left: shipX.current - SHIP, top: shipY - SHIP, opacity: hurt && Math.floor(Date.now() / 100) % 2 ? 0.3 : 1 }]}>
              <View style={[styles.flame, { backgroundColor: theme.accent }]} />
              <Ionicons name="rocket" size={SHIP * 2} color="#fff" style={{ transform: [{ rotate: '-45deg' }] }} />
            </View>
          </>
        )}
        <Overlay phase={phase} icon="rocket" score={score.current} best={best} onStart={start}
          intro="Утсаа зүүн/баруун тийш хазайлгаж (эсвэл хуруугаараа чирж) хөлгөө удирд. Солир бүрийг давахад +1 оноо. 3 амьтай!" />
      </Arena>
    </>
  );
}

const styles = StyleSheet.create({
  rock: { position: 'absolute', backgroundColor: '#6E6A67', borderWidth: 3, borderColor: '#8E8985', alignItems: 'center', justifyContent: 'center' },
  crater: { backgroundColor: '#5A5653', marginLeft: '20%', marginTop: '-10%' },
  ship: { position: 'absolute', width: SHIP * 2, height: SHIP * 2, alignItems: 'center', justifyContent: 'center' },
  flame: { position: 'absolute', bottom: -10, width: 10, height: 18, borderRadius: 5, opacity: 0.9 },
});
