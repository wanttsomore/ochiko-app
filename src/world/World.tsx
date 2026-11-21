// =============================================================
//  ТОГЛООМЫН ЕРТӨНЦ — Монголын тал нутгаар морьтой аялах портфолио
//  Морьтоныг удирдаж түвшин бүрт (гэр, овоо, сүлд) очиж, нээх тусам
//  миний тухай, ур чадвар, 3 тоглоом, холбоо барих мэдээлэл гарч ирнэ.
// =============================================================
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Platform, Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Accelerometer } from 'expo-sensors';
import Svg, { Circle } from 'react-native-svg';
import { Glass, IconCircle, MoodSwitch, T, Toggle, success, tap, thud } from '../components/ui';
import { useTheme } from '../theme';
import { useShake } from '../hooks/useSensors';
import { profile } from '../data/profile';
import GameHost, { GameId } from '../games';
import { LEVELS, Level, NEAR, WORLD_W } from './levels';
import { getPalette } from './palette';
import { Fence, Ger, GroundDecor, Ovoo, Ridge, Signpost, SkyDecor, Sulde } from './Scenery';
import Rider from './Rider';
import StationSheet from './Panels';

const SPEED = 270; // морины хурд (px/сек)
const TRAVEL = 620; // мини газрын зураг дээр дарж "хурдан аялах" хурд
const START_X = 90;

export default function World() {
  const { theme } = useTheme();
  const { width: W, height: H } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [night, setNight] = useState(false);
  const pal = getPalette(theme.mood, night);

  // ---------- Байршил (дэлгэцийн өндрөөс хамаарна → бүх утсанд таарна) ----------
  const groundTop = H * 0.66;
  const roadY = groundTop + Math.min(64, (H - groundTop) * 0.28);

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

  // ---------- Parallax давхаргууд ----------
  const layer = (f: number) => ({ transform: [{ translateX: Animated.multiply(cam, -f) }] });
  const layers = useMemo(() => ({ sky: layer(0.04), far: layer(0.15), mid: layer(0.32), hills: layer(0.6), ground: layer(1) }), [cam]); // eslint-disable-line react-hooks/exhaustive-deps
  const wOf = (f: number) => Math.ceil(W + (WORLD_W - W) * f + 200);
  const introOpacity = riderX.interpolate({ inputRange: [START_X, 520], outputRange: [1, 0], extrapolate: 'clamp' });
  const mapW = Math.min(W, 520) - 40;
  const canEnter = near >= 0 && (nextIdx === -1 || near <= nextIdx);

  return (
    <View style={{ flex: 1, backgroundColor: pal.sky[0] }}>
      {/* Тэнгэр */}
      <LinearGradient colors={pal.sky} locations={[0, 0.35, 0.75, 1]} style={[StyleSheet.absoluteFill, { bottom: H - groundTop - 10 }]} />
      <Svg width={W} height={groundTop} style={StyleSheet.absoluteFill} pointerEvents="none">
        <Circle cx={W * 0.78} cy={groundTop * 0.52} r={pal.night ? 26 : 46} fill={pal.sun} opacity={pal.night ? 0.95 : 0.9} />
        {pal.night && <Circle cx={W * 0.78 + 10} cy={groundTop * 0.52 - 6} r={22} fill={pal.sky[1]} />}
      </Svg>
      <Animated.View pointerEvents="none" style={[styles.abs, layers.sky]}>
        <SkyDecor width={wOf(0.04)} height={groundTop} cloud={pal.cloud} night={pal.night} seed={7} />
      </Animated.View>

      {/* Уулс — хол байх тусам удаан хөдөлнө (parallax) */}
      <Animated.View pointerEvents="none" style={[styles.abs, { top: groundTop - H * 0.3 + 6 }, layers.far]}>
        <Ridge width={wOf(0.15)} height={H * 0.3} color={pal.far} seed={3} peaks={0.75} step={160} />
      </Animated.View>
      <Animated.View pointerEvents="none" style={[styles.abs, { top: groundTop - H * 0.19 + 8 }, layers.mid]}>
        <Ridge width={wOf(0.32)} height={H * 0.19} color={pal.mid} seed={11} peaks={0.6} step={130} />
      </Animated.View>
      <Animated.View pointerEvents="none" style={[styles.abs, { top: groundTop - H * 0.09 + 10 }, layers.hills]}>
        <Ridge width={wOf(0.6)} height={H * 0.09} color={pal.hills} seed={21} peaks={0.5} step={110} />
      </Animated.View>

      {/* Газар + түвшнүүд + морьтон */}
      <Animated.View style={[styles.abs, { top: 0, width: WORLD_W, height: H }, layers.ground]}>
        <LinearGradient colors={pal.ground} style={{ position: 'absolute', top: groundTop, left: 0, width: WORLD_W, height: H - groundTop }} />
        <View style={{ position: 'absolute', top: roadY - 4, left: 0, width: WORLD_W, height: 14, backgroundColor: pal.road, borderRadius: 7, opacity: 0.85 }} />
        <View style={{ position: 'absolute', top: roadY + 22, left: 0 }} pointerEvents="none">
          <GroundDecor width={WORLD_W} color={pal.grass} seed={5} />
        </View>

        {LEVELS.map((l, i) => {
          const locked = nextIdx !== -1 && i > nextIdx;
          const done = cleared.includes(l.id);
          return (
            <Station key={l.id} level={l} index={i} roadY={roadY} locked={locked} done={done} active={near === i}
              onPress={() => { tap(); target.current = l.x; }} />
          );
        })}

        {nextIdx !== -1 && nextIdx < LEVELS.length - 1 && (
          <View pointerEvents="none" style={{ position: 'absolute', left: gateX - 35, top: roadY - 84 }}>
            <Fence />
            <View style={[styles.lock, { backgroundColor: theme.accent }]}><Ionicons name="lock-closed" size={14} color="#fff" /></View>
          </View>
        )}

        <Animated.View pointerEvents="none" style={{ position: 'absolute', top: roadY - 92, left: -60, transform: [{ translateX: riderX }] }}>
          <Rider walking={walking} facing={facing} deel={theme.mood === 'cold' ? '#3F6FB5' : '#2F5E9E'} />
        </Animated.View>
      </Animated.View>

      {/* ---------- HUD ---------- */}
      <View style={[styles.hudWrap, { paddingTop: insets.top + 8 }]} pointerEvents="box-none">
        <Glass strong style={styles.hud}>
          <View style={[styles.avatar, { backgroundColor: theme.accent }]}><T size={14} weight="800" color="#fff">ОЧ</T></View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <T size={15} weight="700" numberOfLines={1}>{profile.name}</T>
            <View style={[styles.xp, { backgroundColor: theme.track }]}>
              <View style={{ width: `${(cleared.length / LEVELS.length) * 100}%`, height: '100%', backgroundColor: theme.accent, borderRadius: 3 }} />
            </View>
          </View>
          <Pressable onPress={onBadge} hitSlop={6} style={[styles.badge, { borderColor: theme.accent }]}>
            <T size={9} weight="700" muted>LV</T>
            <T size={15} weight="800" style={{ marginTop: -2 }}>{levelNum}</T>
          </Pressable>
          <View style={{ width: 8 }} />
          <IconCircle name={night ? 'sunny' : 'moon'} size={36} onPress={() => setNight(!night)} />
          <View style={{ width: 6 }} />
          <IconCircle name="options" size={36} onPress={() => setSettings(true)} />
        </Glass>

        {/* Мини газрын зураг — дарж хурдан аялна */}
        <View style={[styles.map, { width: mapW }]}>
          <View style={[styles.mapLine, { backgroundColor: 'rgba(255,255,255,0.35)' }]} />
          {LEVELS.map((l, i) => {
            const reach = nextIdx === -1 || i <= nextIdx;
            const done = cleared.includes(l.id);
            return (
              <Pressable key={l.id} hitSlop={10} disabled={!reach}
                onPress={() => { tap(); target.current = l.x; }}
                style={[styles.mapDot, { left: (l.x / WORLD_W) * mapW - 7, backgroundColor: done ? theme.accent : reach ? '#fff' : 'rgba(255,255,255,0.3)' }]} />
            );
          })}
          <Animated.View pointerEvents="none" style={[styles.mapRider, { borderColor: theme.accent,
            transform: [{ translateX: Animated.multiply(riderX, mapW / WORLD_W) }] }]} />
        </View>

        {/* Эхний дэлгэцийн танилцуулга: нэр, чиглэл, нэг өгүүлбэр */}
        <Animated.View pointerEvents="none" style={{ opacity: introOpacity, marginTop: 14, width: '100%', maxWidth: 520 }}>
          <T size={12} weight="700" color="#fff" style={styles.shadowText}>{profile.role.toUpperCase()}</T>
          <T size={34} weight="800" color="#fff" style={[styles.shadowText, { letterSpacing: -0.5 }]}>{profile.name}</T>
          <T size={15} color="rgba(255,255,255,0.92)" style={[styles.shadowText, { marginTop: 4, lineHeight: 21, maxWidth: 330 }]}>{profile.tagline}</T>
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
            <Glass strong style={styles.prompt}>
              <T size={11} weight="700" color={theme.accent}>LV {near + 1} · {LEVELS[near].sub}</T>
              <T size={14} weight="700" numberOfLines={1}>{canEnter ? LEVELS[near].title : 'Түгжээтэй'}</T>
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

// ---------- Түвшний барилга + самбар ----------
function Station({ level, index, roadY, locked, done, active, onPress }: {
  level: Level; index: number; roadY: number; locked: boolean; done: boolean; active: boolean; onPress: () => void;
}) {
  const { theme } = useTheme();
  const bounce = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!active) return;
    bounce.setValue(0);
    Animated.spring(bounce, { toValue: 1, friction: 4, useNativeDriver: true }).start();
  }, [active, bounce]);

  const art =
    level.kind === 'start' ? <Signpost /> :
    level.kind === 'contact' ? <Ovoo /> :
    level.kind === 'dream' ? <Sulde glow={locked ? undefined : theme.accent} /> :
    <Ger size={200} lit={level.kind === 'game' && !locked ? theme.accent : undefined} />;
  const artH = level.kind === 'start' ? 110 : level.kind === 'contact' ? 130 : level.kind === 'dream' ? 190 : 160;
  const artW = level.kind === 'start' ? 110 : level.kind === 'contact' ? 130 : level.kind === 'dream' ? 114 : 200;

  return (
    <Pressable onPress={onPress} style={{ position: 'absolute', left: level.x - artW / 2, top: roadY - artH + 8, width: artW, height: artH, alignItems: 'center' }}>
      <View style={{ opacity: locked ? 0.55 : 1 }}>{art}</View>
      <View pointerEvents="none" style={{ position: 'absolute', left: -120, right: -120, bottom: artH + 8, alignItems: 'center' }}>
      <Animated.View
        style={[styles.sign, { backgroundColor: done ? theme.accent : 'rgba(18,18,20,0.78)',
          borderColor: active ? theme.accent : 'rgba(255,255,255,0.15)',
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
        <View style={[styles.action, { backgroundColor: enabled ? theme.accent : 'rgba(20,20,22,0.55)' }]}>
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
        <T size={12} weight="700" muted style={{ marginBottom: 8 }}>УЛИРАЛ / ӨНГӨ</T>
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
  shadowText: { textShadowColor: 'rgba(0,0,0,0.45)', textShadowRadius: 8, textShadowOffset: { width: 0, height: 1 } },
  sign: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 14, borderWidth: 1.5 },
  lock: { position: 'absolute', top: -14, left: 21, width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  controls: { position: 'absolute', left: 18, right: 18, flexDirection: 'row', alignItems: 'flex-end' },
  hold: { width: 66, height: 66, borderRadius: 33, backgroundColor: 'rgba(20,20,22,0.55)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' },
  prompt: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 16, marginBottom: 8, maxWidth: 200 },
  ring: { position: 'absolute', width: 84, height: 84, borderRadius: 42, borderWidth: 3 },
  action: { width: 74, height: 74, borderRadius: 37, alignItems: 'center', justifyContent: 'center' },
  toastWrap: { position: 'absolute', top: '36%', left: 0, right: 0, alignItems: 'center' },
  toast: { backgroundColor: 'rgba(16,16,18,0.88)', borderWidth: 2, borderRadius: 24, paddingVertical: 16, paddingHorizontal: 26, alignItems: 'center' },
  settingsWrap: { ...StyleSheet.absoluteFill, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end' },
  settings: { borderTopLeftRadius: 30, borderTopRightRadius: 30, borderWidth: 1, padding: 20, paddingBottom: 40, width: '100%', maxWidth: 560, alignSelf: 'center' },
});
