// Hume дизайнаас санаа авсан дахин ашиглагдах UI бүрэлдэхүүнүүд.
import React, { useEffect, useRef } from 'react';
import {
  Animated, PanResponder, Pressable, StyleSheet, Text, View, ViewStyle, StyleProp, LayoutChangeEvent,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme, Mood } from '../theme';
import { useTilt } from '../hooks/useSensors';

// ---------- Haptic туслах функцууд ----------
export const tap = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
export const thud = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
export const success = () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});

// ---------- Арын дэвсгэр: градиент + хазайлтаар хөдөлдөг гэрэл ----------
export function Background({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const tilt = useTilt();
  // Утсыг хазайлгахад 2 гэрэл эсрэг чиглэлд хөдөлж гүн мэдрэмж (parallax) өгнө
  const move = (k: number) => ({
    transform: [
      { translateX: tilt.x.interpolate({ inputRange: [-1, 1], outputRange: [-40 * k, 40 * k] }) },
      { translateY: tilt.y.interpolate({ inputRange: [-1, 1], outputRange: [40 * k, -40 * k] }) },
    ],
  });
  return (
    <LinearGradient colors={[theme.bgTop, theme.bgBottom]} style={StyleSheet.absoluteFill}>
      <Animated.View style={[styles.glowBox, { top: -200, right: -200 }, move(1)]} pointerEvents="none">
        <SoftGlow color={theme.accent} strength={theme.dark ? 0.07 : 0.06} />
      </Animated.View>
      <Animated.View style={[styles.glowBox, { bottom: -220, left: -220 }, move(-0.6)]} pointerEvents="none">
        <SoftGlow color={theme.dark ? '#8A8A99' : '#FFFFFF'} strength={theme.dark ? 0.04 : 0.12} />
      </Animated.View>
      {children}
    </LinearGradient>
  );
}

// Олон тунгалаг тойргийг давхарлаж "blur" гэрэл үүсгэнэ (бүх платформ дээр ажиллана)
function SoftGlow({ color, strength }: { color: string; strength: number }) {
  return (
    <>
      {Array.from({ length: 16 }, (_, i) => 1 - i * 0.055).map((k) => (
        <View
          key={k}
          style={{
            position: 'absolute', width: 480 * k, height: 480 * k, borderRadius: 240 * k,
            left: 240 - 240 * k, top: 240 - 240 * k, backgroundColor: color, opacity: strength * 0.4,
          }}
        />
      ))}
    </>
  );
}

// ---------- Шилэн карт ----------
export function Glass({
  children, style, strong, onPress,
}: { children: React.ReactNode; style?: StyleProp<ViewStyle>; strong?: boolean; onPress?: () => void }) {
  const { theme } = useTheme();
  const scale = useRef(new Animated.Value(1)).current;
  const body = (
    <Animated.View
      style={[
        styles.glass,
        { backgroundColor: strong ? theme.glassStrong : theme.glass, borderColor: theme.border, transform: [{ scale }] },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
  if (!onPress) return body;
  // Дарахад бага зэрэг агшиж, чичирнэ — "микро-интеракц"
  return (
    <Pressable
      onPress={() => { tap(); onPress(); }}
      onPressIn={() => Animated.spring(scale, { toValue: 0.96, useNativeDriver: true }).start()}
      onPressOut={() => Animated.spring(scale, { toValue: 1, friction: 4, useNativeDriver: true }).start()}
    >
      {body}
    </Pressable>
  );
}

// ---------- Текст ----------
export function T({
  children, size = 15, weight = '400', muted, color, style, numberOfLines,
}: {
  children: React.ReactNode; size?: number; weight?: '400' | '500' | '600' | '700' | '800';
  muted?: boolean; color?: string; style?: any; numberOfLines?: number;
}) {
  const { theme } = useTheme();
  return (
    <Text
      numberOfLines={numberOfLines}
      style={[{ fontSize: size, fontWeight: weight, color: color ?? (muted ? theme.muted : theme.text), letterSpacing: size > 22 ? -0.5 : 0 }, style]}
    >
      {children}
    </Text>
  );
}

// ---------- Дугуй дүрс товч (expand ↗ гэх мэт) ----------
export function IconCircle({ name, size = 40, onPress, filled }: { name: any; size?: number; onPress?: () => void; filled?: boolean }) {
  const { theme } = useTheme();
  return (
    <Pressable
      hitSlop={8}
      onPress={onPress ? () => { tap(); onPress(); } : undefined}
      style={{
        width: size, height: size, borderRadius: size / 2, alignItems: 'center', justifyContent: 'center',
        backgroundColor: filled ? theme.accent : theme.glassStrong, borderWidth: 1, borderColor: theme.border,
      }}
    >
      <Ionicons name={name} size={size * 0.45} color={filled ? '#fff' : theme.text} />
    </Pressable>
  );
}

// ---------- "Live" шошго ----------
export function Pill({ label, dot, icon }: { label: string; dot?: boolean; icon?: any }) {
  const { theme } = useTheme();
  const blink = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (!dot) return;
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(blink, { toValue: 0.2, duration: 700, useNativeDriver: true }),
      Animated.timing(blink, { toValue: 1, duration: 700, useNativeDriver: true }),
    ]));
    loop.start();
    return () => loop.stop();
  }, [dot, blink]);
  return (
    <View style={[styles.pill, { backgroundColor: theme.dark ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.8)', borderColor: theme.border }]}>
      {dot && <Animated.View style={[styles.dot, { backgroundColor: theme.accent, opacity: blink }]} />}
      {icon && <Ionicons name={icon} size={12} color={theme.text} style={{ marginRight: 4 }} />}
      <T size={12} weight="600">{label}</T>
    </View>
  );
}

// ---------- Toggle (улбар шар бөмбөлөг) ----------
export function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  const { theme } = useTheme();
  const x = useRef(new Animated.Value(value ? 1 : 0)).current;
  useEffect(() => {
    Animated.spring(x, { toValue: value ? 1 : 0, useNativeDriver: false, friction: 6 }).start();
  }, [value, x]);
  return (
    <Pressable
      hitSlop={10}
      onPress={() => { tap(); onChange(!value); }}
      style={[styles.toggle, { backgroundColor: theme.track, borderColor: theme.border }]}
    >
      <Animated.View
        style={[
          styles.knob,
          {
            left: x.interpolate({ inputRange: [0, 1], outputRange: [4, 34] }),
            backgroundColor: x.interpolate({ inputRange: [0, 1], outputRange: [theme.dark ? '#3A3A3D' : '#FFFFFF', theme.accent] }),
          },
        ]}
      />
    </Pressable>
  );
}

// ---------- Warm / Neutral / Cold сонгогч ----------
const MOODS: { key: Mood; label: string; icon: any }[] = [
  { key: 'warm', label: 'Warm', icon: 'flame-outline' },
  { key: 'neutral', label: 'Neutral', icon: 'sunny-outline' },
  { key: 'cold', label: 'Cold', icon: 'snow-outline' },
];

export function MoodSwitch() {
  const { theme, setMood } = useTheme();
  const [w, setW] = React.useState(0);
  const idx = MOODS.findIndex((m) => m.key === theme.mood);
  const x = useRef(new Animated.Value(idx)).current;
  useEffect(() => {
    Animated.spring(x, { toValue: idx, useNativeDriver: true, friction: 7 }).start();
  }, [idx, x]);
  const seg = (w - 8) / 3;
  return (
    <View
      onLayout={(e: LayoutChangeEvent) => setW(e.nativeEvent.layout.width)}
      style={[styles.segment, { backgroundColor: theme.glass, borderColor: theme.border }]}
    >
      {w > 0 && (
        <Animated.View
          style={[styles.segThumb, { width: seg, backgroundColor: theme.glassStrong, borderColor: theme.border, transform: [{ translateX: Animated.multiply(x, seg) }] }]}
        />
      )}
      {MOODS.map((m) => (
        <Pressable key={m.key} style={styles.segItem} onPress={() => { tap(); setMood(m.key); }}>
          <Ionicons name={m.icon} size={16} color={theme.mood === m.key ? theme.accent : theme.text} />
          <T size={13} weight="600" style={{ marginLeft: 6 }}>{m.label}</T>
        </Pressable>
      ))}
    </View>
  );
}

// ---------- ">>>" гулсуулж идэвхжүүлэх товч ----------
export function SwipeButton({ label, icon = 'settings', onComplete }: { label: string; icon?: any; onComplete: () => void }) {
  const { theme } = useTheme();
  const [w, setW] = React.useState(0);
  const x = useRef(new Animated.Value(0)).current;
  const max = Math.max(0, w - 56);
  const maxRef = useRef(max);
  maxRef.current = max;
  const doneRef = useRef(onComplete);
  doneRef.current = onComplete;

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => tap(),
      onPanResponderMove: (_, g) => x.setValue(Math.max(0, Math.min(maxRef.current, g.dx))),
      onPanResponderRelease: (_, g) => {
        // Хуруугаа 75%-иас цааш гулсуулбал үйлдэл ажиллана
        if (g.dx > maxRef.current * 0.75) {
          success();
          Animated.timing(x, { toValue: maxRef.current, duration: 120, useNativeDriver: true }).start(() => {
            doneRef.current();
            Animated.spring(x, { toValue: 0, useNativeDriver: true }).start();
          });
        } else {
          Animated.spring(x, { toValue: 0, useNativeDriver: true }).start();
        }
      },
    }),
  ).current;

  return (
    <View onLayout={(e) => setW(e.nativeEvent.layout.width)} style={[styles.swipe, { backgroundColor: theme.accent }]}>
      <T size={15} weight="700" color="#fff" style={{ textAlign: 'center', flex: 1, marginLeft: 44 }}>{label}</T>
      <T size={18} weight="700" color="rgba(255,255,255,0.7)" style={{ marginRight: 18 }}>›››</T>
      <Animated.View {...pan.panHandlers} style={[styles.swipeKnob, { transform: [{ translateX: x }] }]}>
        <Ionicons name={icon} size={20} color={theme.accent} />
      </Animated.View>
    </View>
  );
}

// ---------- Хэсгийн гарчиг ----------
export function SectionTitle({ kicker, title }: { kicker: string; title: string }) {
  const { theme } = useTheme();
  return (
    <View style={{ marginBottom: 14 }}>
      <T size={12} weight="700" color={theme.accent} style={{ letterSpacing: 1.5 }}>{kicker.toUpperCase()}</T>
      <T size={28} weight="700">{title}</T>
    </View>
  );
}

const styles = StyleSheet.create({
  glowBox: { position: 'absolute', width: 480, height: 480 },
  glass: { borderRadius: 26, borderWidth: 1, padding: 18, overflow: 'hidden' },
  pill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, borderWidth: 1, alignSelf: 'flex-start' },
  dot: { width: 7, height: 7, borderRadius: 4, marginRight: 6 },
  toggle: { width: 70, height: 40, borderRadius: 20, borderWidth: 1, justifyContent: 'center' },
  knob: { position: 'absolute', width: 32, height: 32, borderRadius: 16, top: 3 },
  segment: { flexDirection: 'row', borderRadius: 24, borderWidth: 1, padding: 4, height: 52 },
  segThumb: { position: 'absolute', top: 4, left: 4, bottom: 4, borderRadius: 20, borderWidth: 1 },
  segItem: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  swipe: { height: 60, borderRadius: 30, flexDirection: 'row', alignItems: 'center', overflow: 'hidden' },
  swipeKnob: { position: 'absolute', left: 4, width: 52, height: 52, borderRadius: 26, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
});
