// Hume дизайнаас санаа авсан дахин ашиглагдах UI бүрэлдэхүүнүүд.
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated, Easing, ImageSourcePropType, Pressable, StyleSheet, Text, View, ViewStyle, StyleProp, LayoutChangeEvent,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme, Mood } from '../theme';
import { useTilt } from '../hooks/useSensors';
import { sfx } from '../sound';

// ---------- Haptic туслах функцууд ----------
export const tap = () => { sfx('click'); Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {}); };
export const buzz = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {}); // зөвхөн чичиргээ
export const thud = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy).catch(() => {});
export const success = () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});

// ---------- Арын дэвсгэр: жинхэнэ зураг + хазайлтаар хөдөлдөг parallax + зураг солигдоход crossfade ----------
export function Background({ children, image, dim = 0.6 }: { children: React.ReactNode; image?: ImageSourcePropType; dim?: number }) {
  const { theme } = useTheme();
  const tilt = useTilt();
  // Өмнөх зураг дээр шинэ зураг аажмаар тодорч ирнэ (crossfade)
  const [layers, setLayers] = useState<{ key: number; src: ImageSourcePropType }[]>(image ? [{ key: 0, src: image }] : []);
  const fade = useRef(new Animated.Value(1)).current;
  const keyRef = useRef(0);
  useEffect(() => {
    if (!image || layers[layers.length - 1]?.src === image) return;
    keyRef.current += 1;
    setLayers((l) => [...l.slice(-1), { key: keyRef.current, src: image }]);
    fade.setValue(0);
    Animated.timing(fade, { toValue: 1, duration: 650, easing: Easing.out(Easing.quad), useNativeDriver: true }).start(() =>
      setLayers((l) => l.slice(-1)),
    );
  }, [image]); // eslint-disable-line react-hooks/exhaustive-deps

  // Утсыг хазайлгахад зураг бага зэрэг хөдөлж гүний мэдрэмж (parallax) өгнө
  const parallax = {
    transform: [
      { scale: 1.15 },
      { translateX: tilt.x.interpolate({ inputRange: [-1, 1], outputRange: [-22, 22] }) },
      { translateY: tilt.y.interpolate({ inputRange: [-1, 1], outputRange: [22, -22] }) },
    ],
  };
  // Зургийн дээрх бараан/цайвар бүрхүүл — текст уншигдахуйц байлгана
  const veil = theme.dark
    ? [`rgba(12,12,14,${dim - 0.3})`, `rgba(14,14,16,${dim})`, theme.bgBottom]
    : [`rgba(246,246,247,${dim - 0.15})`, `rgba(236,236,239,${dim + 0.12})`, theme.bgBottom];

  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: theme.bgBottom }]}>
      {layers.map((l, i) => (
        <Animated.Image
          key={l.key}
          source={l.src}
          resizeMode="cover"
          style={[StyleSheet.absoluteFill, parallax, { opacity: i === layers.length - 1 && layers.length > 1 ? fade : 1 }]}
        />
      ))}
      {!image && <LinearGradient colors={[theme.bgTop, theme.bgBottom]} style={StyleSheet.absoluteFill} />}
      <LinearGradient colors={veil as [string, string, string]} locations={[0, 0.6, 1]} style={StyleSheet.absoluteFill} />
      {children}
    </View>
  );
}

// ---------- Reveal: дэлгэц нээгдэхэд блокууд дараалан доороос гарч ирнэ (stagger) ----------
export function Reveal({ children, i = 0 }: { children: React.ReactNode; i?: number }) {
  const v = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(v, { toValue: 1, duration: 480, delay: 60 + i * 70, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
  }, [v, i]);
  return (
    <Animated.View
      style={{
        opacity: v,
        transform: [
          { translateY: v.interpolate({ inputRange: [0, 1], outputRange: [28, 0] }) },
          { scale: v.interpolate({ inputRange: [0, 1], outputRange: [0.97, 1] }) },
        ],
      }}
    >
      {children}
    </Animated.View>
  );
}

// Stagger: дотор нь байгаа блок бүрийг Reveal-ээр ороож дараалан гаргана
export function Stagger({ children }: { children: React.ReactNode }) {
  return <View>{React.Children.toArray(children).map((c, i) => <Reveal key={i} i={i}>{c}</Reveal>)}</View>;
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
  children: React.ReactNode; size?: number; weight?: '400' | '500' | '600' | '700' | '800' | '900';
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

// ---------- Энгийн товч (дарахад агшиж, чичирнэ) ----------
export function Button({ label, icon, onPress, kind = 'primary', style }: {
  label: string; icon?: any; onPress: () => void; kind?: 'primary' | 'ghost'; style?: StyleProp<ViewStyle>;
}) {
  const { theme } = useTheme();
  const scale = useRef(new Animated.Value(1)).current;
  const primary = kind === 'primary';
  return (
    <Pressable
      onPress={() => { tap(); onPress(); }}
      onPressIn={() => Animated.spring(scale, { toValue: 0.95, useNativeDriver: true }).start()}
      onPressOut={() => Animated.spring(scale, { toValue: 1, friction: 4, useNativeDriver: true }).start()}
      style={style}
    >
      <Animated.View
        style={{
          height: 54, borderRadius: 27, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 22,
          backgroundColor: primary ? theme.accent : theme.glassStrong, borderWidth: primary ? 0 : 1, borderColor: theme.border,
          transform: [{ scale }],
        }}
      >
        {icon && <Ionicons name={icon} size={18} color={primary ? '#fff' : theme.text} style={{ marginRight: 8 }} />}
        <T size={15} weight="700" color={primary ? '#fff' : theme.text}>{label}</T>
      </Animated.View>
    </Pressable>
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
  glass: { borderRadius: 26, borderWidth: 1, padding: 18, overflow: 'hidden' },
  pill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, borderWidth: 1, alignSelf: 'flex-start' },
  dot: { width: 7, height: 7, borderRadius: 4, marginRight: 6 },
  toggle: { width: 70, height: 40, borderRadius: 20, borderWidth: 1, justifyContent: 'center' },
  knob: { position: 'absolute', width: 32, height: 32, borderRadius: 16, top: 3 },
  segment: { flexDirection: 'row', borderRadius: 24, borderWidth: 1, padding: 4, height: 52 },
  segThumb: { position: 'absolute', top: 4, left: 4, bottom: 4, borderRadius: 20, borderWidth: 1 },
  segItem: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
});
