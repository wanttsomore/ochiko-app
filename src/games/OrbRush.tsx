// Тоглоом 1 — Orb Rush
// Утсаа хазайлгаж (Accelerometer) цагаан бөмбөгөө удирдаад улбар шар орб цуглуулна, улаан хорхойноос зайлсхийнэ.
// Мэдрэгчгүй төхөөрөмж дээр хуруугаараа чирж удирдана.
import React, { useEffect, useRef, useState } from 'react';
import { PanResponder, Platform, View, StyleSheet } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { success, thud } from '../components/ui';
import { useTheme } from '../theme';
import { Arena, HUD, Overlay, Phase, dist, useArena } from './GameFrame';

const BALL = 18, ORB = 13, BUG = 16, TIME = 20;
type Vec = { x: number; y: number };

export default function OrbRush({ onFinish }: { onFinish?: (score: number) => void }) {
  const { theme } = useTheme();
  const { size, onLayout } = useArena();
  const [phase, setPhase] = useState<Phase>('ready');
  const [, setFrame] = useState(0);
  const [best, setBest] = useState(0);

  const ball = useRef<Vec>({ x: 100, y: 100 });
  const vel = useRef<Vec>({ x: 0, y: 0 });
  const orb = useRef<Vec>({ x: 200, y: 200 });
  const bug = useRef<Vec>({ x: 40, y: 40 });
  const bugVel = useRef<Vec>({ x: 2.2, y: 1.7 });
  const accel = useRef<Vec>({ x: 0, y: 0 });
  const touch = useRef<Vec | null>(null);
  const score = useRef(0);
  const timeLeft = useRef(TIME);
  const hurtUntil = useRef(0);

  const rand = (r: number): Vec => ({
    x: r + Math.random() * Math.max(1, size.current.w - r * 2),
    y: r + Math.random() * Math.max(1, size.current.h - r * 2),
  });

  const start = () => {
    ball.current = { x: size.current.w / 2, y: size.current.h / 2 };
    vel.current = { x: 0, y: 0 };
    orb.current = rand(ORB);
    bug.current = { x: 40, y: 40 };
    score.current = 0;
    timeLeft.current = TIME;
    setPhase('play');
  };

  // Хурдатгал мэдрэгч (Android, iOS тэмдэг эсрэг)
  useEffect(() => {
    if (phase !== 'play' || Platform.OS === 'web') return;
    const s = Platform.OS === 'android' ? -1 : 1;
    Accelerometer.setUpdateInterval(16);
    const sub = Accelerometer.addListener(({ x, y }) => { accel.current = { x: x * s, y: -y * s }; });
    return () => sub.remove();
  }, [phase]);

  // Game loop
  useEffect(() => {
    if (phase !== 'play') return;
    let raf = 0, last = Date.now();
    const loop = () => {
      const now = Date.now();
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const { w, h } = size.current;

      // 1) Хүч → хурд → байрлал (үрэлт 0.95)
      let fx = accel.current.x, fy = accel.current.y;
      if (touch.current) { fx = (touch.current.x - ball.current.x) / 60; fy = (touch.current.y - ball.current.y) / 60; }
      vel.current.x = (vel.current.x + fx * 1.1) * 0.95;
      vel.current.y = (vel.current.y + fy * 1.1) * 0.95;
      ball.current.x += vel.current.x;
      ball.current.y += vel.current.y;

      // 2) Хананаас ойх
      if (ball.current.x < BALL) { ball.current.x = BALL; vel.current.x *= -0.5; }
      if (ball.current.x > w - BALL) { ball.current.x = w - BALL; vel.current.x *= -0.5; }
      if (ball.current.y < BALL) { ball.current.y = BALL; vel.current.y *= -0.5; }
      if (ball.current.y > h - BALL) { ball.current.y = h - BALL; vel.current.y *= -0.5; }

      // 3) Bug хөдөлгөөн — оноо ахих тусам хурдасна
      const k = 1 + score.current * 0.04;
      bug.current.x += bugVel.current.x * k;
      bug.current.y += bugVel.current.y * k;
      if (bug.current.x < BUG || bug.current.x > w - BUG) bugVel.current.x *= -1;
      if (bug.current.y < BUG || bug.current.y > h - BUG) bugVel.current.y *= -1;

      // 4) Мөргөлдөөн
      if (dist(ball.current, orb.current) < BALL + ORB) { score.current++; orb.current = rand(ORB); success(); }
      if (now > hurtUntil.current && dist(ball.current, bug.current) < BALL + BUG) {
        score.current = Math.max(0, score.current - 3); hurtUntil.current = now + 1000; thud();
      }

      // 5) Хугацаа
      timeLeft.current -= dt;
      if (timeLeft.current <= 0) {
        timeLeft.current = 0; setBest((b) => Math.max(b, score.current)); thud(); setPhase('over'); onFinish?.(score.current); return;
      }
      setFrame((f) => f + 1);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  const pan = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (e) => { touch.current = { x: e.nativeEvent.locationX, y: e.nativeEvent.locationY }; },
    onPanResponderMove: (e) => { touch.current = { x: e.nativeEvent.locationX, y: e.nativeEvent.locationY }; },
    onPanResponderRelease: () => { touch.current = null; },
    onPanResponderTerminate: () => { touch.current = null; },
  })).current;

  const hurt = Date.now() < hurtUntil.current;
  return (
    <>
      <HUD items={[{ label: 'Оноо', value: score.current }, { label: 'Хугацаа', value: `${Math.ceil(timeLeft.current)}s` }, { label: 'Рекорд', value: best }]} />
      <Arena onLayout={onLayout} handlers={pan.panHandlers}>
        {phase === 'play' && (
          <>
            <View pointerEvents="none" style={[styles.circle, pos(orb.current, ORB), { backgroundColor: theme.accent, shadowColor: theme.accent }]} />
            <View pointerEvents="none" style={[styles.bug, pos(bug.current, BUG)]}>
              <View style={styles.bugLine} />
              <View style={[styles.bugDot, { left: BUG * 0.45, top: BUG * 0.5 }]} />
              <View style={[styles.bugDot, { right: BUG * 0.45, top: BUG * 0.9 }]} />
              <View style={[styles.bugDot, { left: BUG * 0.55, top: BUG * 1.3 }]} />
            </View>
            <View pointerEvents="none" style={[styles.circle, pos(ball.current, BALL), { backgroundColor: hurt ? '#FF3B30' : '#fff', shadowColor: '#fff' }]} />
          </>
        )}
        <Overlay phase={phase} icon="radio-button-on" score={score.current} best={best} onStart={start}
          intro="Утсаа хазайлгаж цагаан бөмбөгөө удирд (эсвэл хуруугаараа чир). Улбар шар орб цуглуулж, улаан хорхойноос зайлсхий. 20 секунд!" />
      </Arena>
    </>
  );
}

const pos = (p: Vec, r: number) => ({ left: p.x - r, top: p.y - r, width: r * 2, height: r * 2, borderRadius: r });
const styles = StyleSheet.create({
  circle: { position: 'absolute', shadowOpacity: 0.8, shadowRadius: 12, shadowOffset: { width: 0, height: 0 }, elevation: 6 },
  bug: { position: 'absolute', backgroundColor: '#E5332A', borderWidth: 2, borderColor: '#1C1C1E', overflow: 'hidden' },
  bugLine: { position: 'absolute', left: '48%', top: 0, bottom: 0, width: 2, backgroundColor: '#1C1C1E' },
  bugDot: { position: 'absolute', width: 6, height: 6, borderRadius: 3, backgroundColor: '#1C1C1E' },
});
