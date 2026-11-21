// =============================================================
//  ТОГЛООМЫН ЕРТӨНЦ — Монголын тал нутгаар морьтой аялах портфолио
//  Морьтоныг удирдаж түвшин бүрт (гэр, овоо, сүлд) очиж, нээх тусам
//  миний тухай, ур чадвар, 3 тоглоом, холбоо барих мэдээлэл гарч ирнэ.
// =============================================================
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Platform, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Accelerometer } from 'expo-sensors';
import { Glass, IconCircle, MoodSwitch, T, Toggle, success, tap, thud } from '../components/ui';
import { useTheme } from '../theme';
import { useShake } from '../hooks/useSensors';
import { profile } from '../data/profile';
import GameHost, { GameId } from '../games';
import { LEVELS, Level, NEAR, WORLD_W } from './levels';
import { PX, S, SpriteKey } from './sprites';
import Rider from './Rider';
import { Image } from 'react-native';
import StationSheet from './Panels';

const SPEED = 270; // морины хурд (px/сек)
const TRAVEL = 620; // мини газрын зураг дээр дарж "хурдан аялах" хурд
const START_X = 90;
const GRASS = '#C6E39A';
const PANEL = 'rgba(40,28,34,0.9)'; // HUD, товчны бараан өнгө (цайвар өвсөн дээр тод харагдана)
const RIDER_SCALE = 0.8;

export default function World() {
  const { theme } = useTheme();
  const { width: W, height: H } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [night, setNight] = useState(false);

  // ---------- Байршил (дэлгэцийн өндрөөс хамаарна → бүх утсанд таарна) ----------
  const roadTop = Math.round(H * 0.5);
  const roadH = S.road.h * PX;
  const decor = useMemo(() => makeDecor(roadTop, roadH, H), [roadTop, roadH, H]);

  // ---------- Явц: аль түвшнүүдийг дуусгасан бэ ----------
  const [cleared, setCleared] = useState<string[]>([]);
  const nextIdx = LEVELS.findIndex((l) => !cleared.includes(l.id)); // дараагийн дуусгах түвшин (-1 = бүгд)
  const gateX = nextIdx === -1 ? WORLD_W : LEVELS[nextIdx].x + 80; // хаалтын байрлал
  const levelNum = Math.min(LEVELS.length, cleared.length + 1);

  // ---------- Хөдөлгөөний төлөв (ref = дахин зурахгүйгээр хадгална) ----------
  const x = useRef(START_X);
  const held = useRef<-1 | 0 | 1>(0);
  const target = useRef<number | null>(null);
  const tilt = useRef(0);
  const gate = useRef(gateX);
  gate.current = gateX;
  const bumped = useRef(false);
  const cam = useRef(new Animated.Value(0)).current;
  const riderX = useRef(new Animated.Value(START_X)).current;
  const [walking, setWalking] = useState(false);
  const [facing, setFacing] = useState<1 | -1>(1);
  const [near, setNear] = useState(-1);
  const [tiltOn, setTiltOn] = useState(true);

  const [open, setOpen] = useState<number>(-1); // нээлттэй самбар
  const [game, setGame] = useState<GameId | null>(null);
  const [toast, setToast] = useState<{ title: string; sub: string } | null>(null);
  const [settings, setSettings] = useState(false);
  const pending = useRef<{ title: string; sub: string } | null>(null);
  const modalOpen = open >= 0 || !!game || settings;

  // ---------- Хазайлт мэдрэгч ----------
  useEffect(() => {
    if (Platform.OS === 'web' || !tiltOn) { tilt.current = 0; return; }
    const s = Platform.OS === 'android' ? -1 : 1;
    Accelerometer.setUpdateInterval(50);
    const sub = Accelerometer.addListener(({ x: ax }) => { tilt.current = ax * s; });
    return () => sub.remove();
  }, [tiltOn]);

  // Утсаа сэгсрэхэд өдөр ↔ шөнө
  useShake(() => {
    setNight((n) => {
      showToast(n ? 'Өглөө боллоо' : 'Шөнө боллоо', 'Утсаа дахин сэгсрээд үз');
      return !n;
    });
  }, !modalOpen);

  // ---------- Game loop: секундэд ~60 удаа морьтоны байрлалыг шинэчилнэ ----------
  const modalRef = useRef(modalOpen);
  modalRef.current = modalOpen;
  useEffect(() => {
    let raf = 0, last = Date.now();
    let wasWalking = false, lastFacing: 1 | -1 = 1, lastNear = -1;
    const loop = () => {
      const now = Date.now();
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      // 1) Чиглэл: товч → хурдан аялал → хазайлт
      let dir = 0, speed = SPEED;
      if (!modalRef.current) {
        if (held.current) { dir = held.current; target.current = null; }
        else if (target.current !== null) {
          const diff = target.current - x.current;
          if (Math.abs(diff) < 8) target.current = null; else { dir = Math.sign(diff); speed = TRAVEL; }
        } else if (Math.abs(tilt.current) > 0.3) dir = Math.sign(tilt.current);
      }

      // 2) Байрлал + хязгаар (түгжээтэй хаалтаас цааш явахгүй)
      const max = gate.current - 55;
      let nx = x.current + dir * speed * dt;
      if (nx > max) {
        nx = max;
        if (dir > 0 && !bumped.current) { bumped.current = true; thud(); }
      } else if (dir < 0) bumped.current = false;
      nx = Math.max(40, nx);
      const moved = Math.abs(nx - x.current) > 0.01;
      x.current = nx;

      // 3) Камер морьтоныг дагана
      const c = Math.max(0, Math.min(WORLD_W - W, nx - W * 0.38));
      cam.setValue(c);
      riderX.setValue(nx);

      // 4) Зөвхөн өөрчлөгдсөн үед React state шинэчилнэ (гүйцэтгэл)
      const isWalking = dir !== 0 && moved;
      if (isWalking !== wasWalking) { wasWalking = isWalking; setWalking(isWalking); }
      if (dir !== 0 && dir !== lastFacing) { lastFacing = dir as 1 | -1; setFacing(lastFacing); }
      const n = LEVELS.findIndex((l) => Math.abs(l.x - nx) < NEAR);
      if (n !== lastNear) { lastNear = n; setNear(n); if (n >= 0) tap(); }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [W, cam, riderX]);

  // ---------- Түвшин дуусгах, LEVEL UP ----------
  function showToast(title: string, sub: string) {
    setToast({ title, sub });
    setTimeout(() => setToast(null), 2200);
  }
  function clearLevel(id: string) {
    setCleared((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      const nl = LEVELS[next.length];
      const t = nl
        ? { title: `LEVEL UP · LV ${next.length + 1}`, sub: `Шинэ газар нээгдлээ: ${nl.title}` }
        : { title: 'БҮХ ТҮВШИН ДУУСЛАА', sub: 'Аялалд нэгдсэнд баярлалаа' };
      success();
      if (game) pending.current = t; else setTimeout(() => showToast(t.title, t.sub), 350);
      return next;
    });
  }
  const closeSheet = () => {
    const l = LEVELS[open];
    setOpen(-1);
    if (l && l.kind !== 'game') clearLevel(l.id);
  };
  const enter = () => {
    if (near < 0 || (nextIdx !== -1 && near > nextIdx)) return;
    held.current = 0;
    setOpen(near);
  };
  const restart = () => {
    setOpen(-1);
    setCleared([]);
    x.current = START_X;
    target.current = null;
  };

  // Нууц код: LV тэмдгийг 5 удаа дарвал бүх түвшин нээгдэнэ (танилцуулгад хурдан харуулахад)
  const cheat = useRef(0);
  const onBadge = () => {
    cheat.current += 1;
    tap();
    if (cheat.current >= 5) {
      cheat.current = 0;
      setCleared(LEVELS.slice(0, -1).map((l) => l.id));
      showToast('CHEAT CODE', 'Бүх түвшин нээгдлээ');
    }
  };

  const cam1 = useMemo(() => ({ transform: [{ translateX: Animated.multiply(cam, -1) }] }), [cam]);
  const introOpacity = riderX.interpolate({ inputRange: [START_X, 520], outputRange: [1, 0], extrapolate: 'clamp' });
  const mapW = Math.min(W, 520) - 40;
  const canEnter = near >= 0 && (nextIdx === -1 || near <= nextIdx);

  return (
    <View style={{ flex: 1, backgroundColor: GRASS }}>
      {/* Тал нутаг: нэг давхарга, камер морьтоныг дагаж хөдөлнө */}
      <Animated.View style={[styles.abs, { top: 0, width: WORLD_W, height: H }, cam1]}>
        {/* Арын мод, хашаа, цэцэг (замын дээд тал) */}
        {decor.back.map((d, i) => <Sprite key={`b${i}`} k={d.k} x={d.x} bottom={d.y} />)}

        {LEVELS.map((l, i) => (
          <Station key={l.id} level={l} index={i} bottom={roadTop + 8} locked={nextIdx !== -1 && i > nextIdx}
            done={cleared.includes(l.id)} active={near === i} onPress={() => { tap(); target.current = l.x; }} />
        ))}

        {/* Шороон зам */}
        {Array.from({ length: Math.ceil(WORLD_W / (S.road.w * PX)) + 1 }, (_, i) => (
          <Image key={`r${i}`} source={S.road.src} style={{ position: 'absolute', left: i * S.road.w * PX, top: roadTop, width: S.road.w * PX, height: roadH }} />
        ))}

        {/* Түгжээтэй хаалт — замыг хаана */}
        {nextIdx !== -1 && nextIdx < LEVELS.length - 1 && (
          <View pointerEvents="none" style={{ position: 'absolute', left: gateX - (S.gate.w * PX) / 2, top: roadTop + roadH * 0.62 - S.gate.h * PX }}>
            <Image source={S.gate.src} style={{ width: S.gate.w * PX, height: S.gate.h * PX }} />
            <View style={[styles.lock, { backgroundColor: theme.accent }]}><Ionicons name="lock-closed" size={14} color="#fff" /></View>
          </View>
        )}

        {/* Морьтон */}
        <Animated.View pointerEvents="none" style={{ position: 'absolute', top: roadTop + roadH * 0.62 - 56 * PX * RIDER_SCALE, left: -(S.rider_0.w * PX * RIDER_SCALE) / 2, transform: [{ translateX: riderX }] }}>
          <Rider walking={walking} facing={facing} scale={RIDER_SCALE} />
        </Animated.View>

        {/* Замын доод тал: бут, мөөг, хонь, мод */}
        {decor.front.map((d, i) =>
          d.k === 'sheep_0' ? <Sheep key={`f${i}`} x={d.x} bottom={d.y} seed={i} /> : <Sprite key={`f${i}`} k={d.k} x={d.x} bottom={d.y} />,
        )}

        {/* Шөнө: бүх зүйлийг бараан цэнхэр өнгөөр бүрхэж, гэрийн хаалгыг гэрэлтүүлнэ */}
        {night && <View pointerEvents="none" style={{ position: 'absolute', left: 0, top: 0, width: WORLD_W, height: H, backgroundColor: 'rgba(16,22,60,0.55)' }} />}
        {night && LEVELS.filter((l) => l.kind === 'about' || l.kind === 'skills' || l.kind === 'game').map((l) => (
          <View key={`g${l.id}`} pointerEvents="none" style={[styles.glow, { left: l.x - 25, top: roadTop + 8 - 14 * PX - 25 }]} />
        ))}
      </Animated.View>

      {/* ---------- HUD ---------- */}
      <View style={[styles.hudWrap, { paddingTop: insets.top + 8 }]} pointerEvents="box-none">
        <Glass strong style={[styles.hud, { backgroundColor: PANEL, borderColor: 'rgba(255,255,255,0.12)' }]}>
          <View style={[styles.avatar, { backgroundColor: theme.accent }]}><T size={14} weight="800" color="#fff">ОЧ</T></View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <T size={15} weight="700" color="#fff" numberOfLines={1}>{profile.name}</T>
            <View style={[styles.xp, { backgroundColor: 'rgba(255,255,255,0.15)' }]}>
              <View style={{ width: `${(cleared.length / LEVELS.length) * 100}%`, height: '100%', backgroundColor: theme.accent, borderRadius: 3 }} />
            </View>
          </View>
          <Pressable onPress={onBadge} hitSlop={6} style={[styles.badge, { borderColor: theme.accent }]}>
            <T size={9} weight="700" color="rgba(255,255,255,0.6)">LV</T>
            <T size={15} weight="800" color="#fff" style={{ marginTop: -2 }}>{levelNum}</T>
          </Pressable>
          <View style={{ width: 8 }} />
          <IconCircle name={night ? 'sunny' : 'moon'} size={36} onPress={() => setNight(!night)} />
          <View style={{ width: 6 }} />
          <IconCircle name="options" size={36} onPress={() => setSettings(true)} />
        </Glass>

        {/* Мини газрын зураг — дарж хурдан аялна */}
        <View style={[styles.map, { width: mapW }]}>
          <View style={[styles.mapLine, { backgroundColor: 'rgba(40,28,34,0.45)' }]} />
          {LEVELS.map((l, i) => {
            const reach = nextIdx === -1 || i <= nextIdx;
            const done = cleared.includes(l.id);
            return (
              <Pressable key={l.id} hitSlop={10} disabled={!reach}
                onPress={() => { tap(); target.current = l.x; }}
                style={[styles.mapDot, { left: (l.x / WORLD_W) * mapW - 7, backgroundColor: done ? theme.accent : reach ? '#fff' : 'rgba(40,28,34,0.35)' }]} />
            );
          })}
          <Animated.View pointerEvents="none" style={[styles.mapRider, { borderColor: theme.accent,
            transform: [{ translateX: Animated.multiply(riderX, mapW / WORLD_W) }] }]} />
        </View>

        {/* Эхний дэлгэцийн танилцуулга: нэр, чиглэл, нэг өгүүлбэр */}
        <Animated.View pointerEvents="none" style={{ opacity: introOpacity, marginTop: 12, width: '100%', maxWidth: 520 }}>
          <View style={styles.intro}>
            <T size={11} weight="700" color={theme.accent} style={{ letterSpacing: 1.2 }}>{profile.role.toUpperCase()}</T>
            <T size={28} weight="800" color="#fff" style={{ letterSpacing: -0.5 }}>{profile.name}</T>
            <T size={14} color="rgba(255,255,255,0.88)" style={{ marginTop: 2, lineHeight: 20 }}>{profile.tagline}</T>
          </View>
        </Animated.View>
      </View>

      {/* ---------- Удирдлага ---------- */}
      <View style={[styles.controls, { bottom: insets.bottom + 18 }]} pointerEvents="box-none">
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <HoldButton icon="chevron-back" onDown={() => (held.current = -1)} onUp={() => (held.current = 0)} />
          <HoldButton icon="chevron-forward" onDown={() => (held.current = 1)} onUp={() => (held.current = 0)} />
        </View>
        <View style={{ alignItems: 'flex-end', flex: 1 }}>
          {near >= 0 && (
            <Glass strong style={[styles.prompt, { backgroundColor: PANEL, borderColor: 'rgba(255,255,255,0.12)' }]}>
              <T size={11} weight="700" color={theme.accent}>LV {near + 1} · {LEVELS[near].sub}</T>
              <T size={14} weight="700" color="#fff" numberOfLines={1}>{canEnter ? LEVELS[near].title : 'Түгжээтэй'}</T>
            </Glass>
          )}
          <ActionButton enabled={canEnter} onPress={enter} />
        </View>
      </View>

      {/* LEVEL UP мэдэгдэл */}
      {toast && <Toast title={toast.title} sub={toast.sub} />}

      <StationSheet level={open >= 0 ? LEVELS[open] : null} index={open} onClose={closeSheet} onRestart={restart}
        onPlay={(l: Level) => { setOpen(-1); setTimeout(() => setGame(l.game ?? null), 300); }} />
      <GameHost game={game}
        onClose={() => { setGame(null); if (pending.current) { const t = pending.current; pending.current = null; setTimeout(() => showToast(t.title, t.sub), 400); } }}
        onFinish={(g) => { const l = LEVELS.find((v) => v.game === g); if (l) clearLevel(l.id); }} />
      <Settings visible={settings} onClose={() => setSettings(false)} tiltOn={tiltOn} setTiltOn={setTiltOn} />
    </View>
  );
}

// ---------- Пиксел зураг ----------
function Sprite({ k, x, bottom, flip }: { k: SpriteKey; x: number; bottom: number; flip?: boolean }) {
  const sp = S[k];
  return (
    <Image pointerEvents="none" source={sp.src}
      style={{ position: 'absolute', left: x - (sp.w * PX) / 2, top: bottom - sp.h * PX, width: sp.w * PX, height: sp.h * PX, transform: flip ? [{ scaleX: -1 }] : undefined }} />
  );
}

// Өвс зулгааж буй хонь (2 фрейм)
function Sheep({ x, bottom, seed }: { x: number; bottom: number; seed: number }) {
  const [f, setF] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setF((v) => 1 - v), 520 + (seed % 4) * 130);
    return () => clearInterval(t);
  }, [seed]);
  return <Sprite k={f ? 'sheep_1' : 'sheep_0'} x={x} bottom={bottom} flip={seed % 2 === 0} />;
}

// ---------- Түвшний барилга + самбар ----------
const ART: Record<string, SpriteKey> = { start: 'sign', about: 'ger', skills: 'ger', game: 'ger_lit', contact: 'ovoo', dream: 'sulde' };

function Station({ level, index, bottom, locked, done, active, onPress }: {
  level: Level; index: number; bottom: number; locked: boolean; done: boolean; active: boolean; onPress: () => void;
}) {
  const { theme } = useTheme();
  const bounce = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!active) return;
    bounce.setValue(0);
    Animated.spring(bounce, { toValue: 1, friction: 4, useNativeDriver: true }).start();
  }, [active, bounce]);
  const sp = S[ART[level.kind]];
  const w = sp.w * PX, h = sp.h * PX;
  return (
    <Pressable onPress={onPress} style={{ position: 'absolute', left: level.x - w / 2, top: bottom - h, width: w, height: h }}>
      <Image source={sp.src} style={{ width: w, height: h, opacity: locked ? 0.6 : 1 }} />
      <View pointerEvents="none" style={{ position: 'absolute', left: -120, right: -120, bottom: h + 6, alignItems: 'center' }}>
        <Animated.View
          style={[styles.sign, {
            backgroundColor: done ? theme.accent : 'rgba(40,28,34,0.88)',
            borderColor: active ? theme.accent : 'rgba(255,255,255,0.2)',
            transform: [{ translateY: bounce.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, -8, 0] }) }],
          }]}
        >
          <Ionicons name={done ? 'checkmark' : locked ? 'lock-closed' : 'flag'} size={12} color="#fff" />
          <T size={12} weight="700" color="#fff" style={{ marginLeft: 6 }}>LV {index + 1} · {level.title}</T>
        </Animated.View>
      </View>
    </Pressable>
  );
}

// ---------- Чимэглэлийг санамсаргүй (гэхдээ тогтмол seed-ээр) байрлуулах ----------
function rng(seed: number) {
  let v = seed;
  return () => { v = (v * 9301 + 49297) % 233280; return v / 233280; };
}
function makeDecor(roadTop: number, roadH: number, H: number) {
  const r = rng(42);
  const back: { k: SpriteKey; x: number; y: number }[] = [];
  const front: { k: SpriteKey; x: number; y: number }[] = [];
  const nearStation = (x: number, d: number) => LEVELS.some((l) => Math.abs(l.x - x) < d);
  // Арын модны эгнээ
  for (let x = -20; x < WORLD_W + 60; x += 70 + r() * 60) back.push({ k: r() > 0.5 ? 'tree_a' : 'tree_b', x, y: roadTop - 130 - r() * 40 });
  back.sort((a, b) => a.y - b.y);
  // Замын дагуух хашаа, бут, цэцэг
  for (let x = 60; x < WORLD_W; x += 90 + r() * 120) {
    if (nearStation(x, 150)) continue;
    const t = r();
    back.push({ k: t < 0.4 ? 'fence' : t < 0.65 ? 'bush_a' : t < 0.8 ? 'rock' : t < 0.9 ? 'flower_pink' : 'tuft', x, y: roadTop + 4 });
  }
  // Доод тал
  const bottom = roadTop + roadH;
  for (let x = 30; x < WORLD_W; x += 40 + r() * 70) {
    const y = bottom + 24 + r() * Math.max(40, H - bottom - 60);
    const t = r();
    const k: SpriteKey = t < 0.18 ? 'bush_a' : t < 0.3 ? 'bush_b' : t < 0.42 ? 'tuft' : t < 0.5 ? 'mush_red' : t < 0.56 ? 'mush_blue'
      : t < 0.66 ? 'flower_white' : t < 0.74 ? 'flower_pink' : t < 0.8 ? 'rock' : t < 0.9 ? 'sheep_0' : r() > 0.5 ? 'tree_a' : 'tree_b';
    front.push({ k, x, y: k.startsWith('tree') ? Math.max(y, bottom + 200) : y });
  }
  front.sort((a, b) => a.y - b.y);
  return { back, front };
}

// Дарж байх хооронд ажилладаг товч
function HoldButton({ icon, onDown, onUp }: { icon: any; onDown: () => void; onUp: () => void }) {
  const s = useRef(new Animated.Value(1)).current;
  return (
    <Pressable
      onPressIn={() => { tap(); onDown(); Animated.spring(s, { toValue: 0.9, useNativeDriver: true }).start(); }}
      onPressOut={() => { onUp(); Animated.spring(s, { toValue: 1, friction: 4, useNativeDriver: true }).start(); }}
    >
      <Animated.View style={[styles.hold, { transform: [{ scale: s }] }]}>
        <Ionicons name={icon} size={30} color="#fff" />
      </Animated.View>
    </Pressable>
  );
}

// "Орох" товч — түвшний дэргэд очиход гэрэлтэж лугшина
function ActionButton({ enabled, onPress }: { enabled: boolean; onPress: () => void }) {
  const { theme } = useTheme();
  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!enabled) { pulse.setValue(0); return; }
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 0, duration: 700, useNativeDriver: true }),
    ]));
    loop.start();
    return () => loop.stop();
  }, [enabled, pulse]);
  return (
    <Pressable onPress={() => { if (enabled) { tap(); onPress(); } }} hitSlop={8}>
      <View style={{ width: 84, height: 84, alignItems: 'center', justifyContent: 'center' }}>
        <Animated.View style={[styles.ring, { borderColor: theme.accent, opacity: pulse, transform: [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.25] }) }] }]} />
        <View style={[styles.action, { backgroundColor: enabled ? theme.accent : 'rgba(40,28,34,0.78)' }]}>
          <Ionicons name="enter-outline" size={24} color="#fff" />
          <T size={12} weight="800" color="#fff">Орох</T>
        </View>
      </View>
    </Pressable>
  );
}

function Toast({ title, sub }: { title: string; sub: string }) {
  const { theme } = useTheme();
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => { Animated.spring(v, { toValue: 1, friction: 6, useNativeDriver: true }).start(); }, [v]);
  return (
    <View pointerEvents="none" style={styles.toastWrap}>
      <Animated.View style={[styles.toast, { borderColor: theme.accent, opacity: v, transform: [{ scale: v.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] }) }] }]}>
        <T size={22} weight="900" color={theme.accent} style={{ letterSpacing: 1 }}>{title}</T>
        <T size={14} color="#fff" style={{ marginTop: 4 }}>{sub}</T>
      </Animated.View>
    </View>
  );
}

function Settings({ visible, onClose, tiltOn, setTiltOn }: { visible: boolean; onClose: () => void; tiltOn: boolean; setTiltOn: (v: boolean) => void }) {
  const { theme, setDark } = useTheme();
  if (!visible) return null;
  return (
    <View style={styles.settingsWrap}>
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      <View style={[styles.settings, { backgroundColor: theme.dark ? '#18181A' : '#F6F6F7', borderColor: theme.border }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <T size={20} weight="800">Тохиргоо</T>
          <IconCircle name="close" size={34} onPress={onClose} />
        </View>
        <T size={12} weight="700" muted style={{ marginBottom: 8 }}>ӨНГӨ</T>
        <MoodSwitch />
        <Row label="Хазайлтаар удирдах" sub="Утсаа зүүн, баруун тийш хазайлга" value={tiltOn} onChange={setTiltOn} />
        <Row label="Бараан самбар" sub="Цонхнуудын өнгө" value={theme.dark} onChange={setDark} />
      </View>
    </View>
  );
}

function Row({ label, sub, value, onChange }: { label: string; sub: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 16 }}>
      <View style={{ flex: 1 }}>
        <T size={15} weight="600">{label}</T>
        <T size={12} muted>{sub}</T>
      </View>
      <Toggle value={value} onChange={onChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  abs: { position: 'absolute', left: 0 },
  hudWrap: { position: 'absolute', top: 0, left: 0, right: 0, paddingHorizontal: 16, alignItems: 'center' },
  hud: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 12, width: '100%', maxWidth: 520, borderRadius: 24 },
  avatar: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  xp: { height: 6, borderRadius: 3, marginTop: 6, overflow: 'hidden' },
  badge: { width: 40, height: 40, borderRadius: 20, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  map: { height: 22, marginTop: 10, justifyContent: 'center' },
  mapLine: { height: 2, borderRadius: 1 },
  mapDot: { position: 'absolute', width: 14, height: 14, borderRadius: 7, borderWidth: 2, borderColor: 'rgba(0,0,0,0.35)' },
  mapRider: { position: 'absolute', left: -9, width: 18, height: 18, borderRadius: 9, borderWidth: 3, backgroundColor: '#fff' },
  intro: { backgroundColor: 'rgba(40,28,34,0.82)', borderRadius: 20, paddingVertical: 12, paddingHorizontal: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' },
  glow: { position: 'absolute', width: 50, height: 50, borderRadius: 25, backgroundColor: '#FFD86B', opacity: 0.3 },
  sign: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 14, borderWidth: 1.5 },
  lock: { position: 'absolute', top: -14, left: 21, width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  controls: { position: 'absolute', left: 18, right: 18, flexDirection: 'row', alignItems: 'flex-end' },
  hold: { width: 66, height: 66, borderRadius: 33, backgroundColor: 'rgba(40,28,34,0.78)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' },
  prompt: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 16, marginBottom: 8, maxWidth: 200 },
  ring: { position: 'absolute', width: 84, height: 84, borderRadius: 42, borderWidth: 3 },
  action: { width: 74, height: 74, borderRadius: 37, alignItems: 'center', justifyContent: 'center' },
  toastWrap: { position: 'absolute', top: '36%', left: 0, right: 0, alignItems: 'center' },
  toast: { backgroundColor: 'rgba(16,16,18,0.88)', borderWidth: 2, borderRadius: 24, paddingVertical: 16, paddingHorizontal: 26, alignItems: 'center' },
  settingsWrap: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  settings: { borderTopLeftRadius: 30, borderTopRightRadius: 30, borderWidth: 1, padding: 20, paddingBottom: 40, width: '100%', maxWidth: 560, alignSelf: 'center' },
});
