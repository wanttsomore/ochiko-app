// Бүх тоглоомд хамаарах нийтлэг хүрээ: Modal, толгой, оноо (HUD), эхлэх/дуусах цонх.
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Modal, Pressable, StyleSheet, View, LayoutChangeEvent, ImageSourcePropType } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Background, Glass, IconCircle, T, tap, thud } from '../components/ui';
import { useTheme } from '../theme';

export type Phase = 'ready' | 'play' | 'over';

export function GameFrame({
  visible, onClose, title, kicker, bg, children,
}: {
  visible: boolean; onClose: () => void; title: string; kicker: string; bg?: ImageSourcePropType; children: React.ReactNode;
}) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <Background image={bg} dim={0.75}>
        <View style={[styles.wrap, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 16 }]}>
          <View style={styles.header}>
            <View>
              <T size={12} weight="700" color={theme.accent} style={{ letterSpacing: 1.5 }}>{kicker}</T>
              <T size={24} weight="800">{title}</T>
            </View>
            <IconCircle name="close" onPress={onClose} />
          </View>
          {children}
        </View>
      </Background>
    </Modal>
  );
}

// Дээд хэсгийн 3 үзүүлэлт (оноо, хугацаа/амь, рекорд)
export function HUD({ items }: { items: { label: string; value: string | number }[] }) {
  return (
    <View style={styles.hud}>
      {items.map((it) => (
        <Glass key={it.label} style={styles.hudItem}>
          <T size={12} muted>{it.label}</T>
          <T size={22} weight="800">{it.value}</T>
        </Glass>
      ))}
    </View>
  );
}

// Тоглоомын талбай — хэмжээг нь хэмжиж ref-д хадгална
export function useArena() {
  const size = useRef({ w: 0, h: 0 });
  const [ready, setReady] = useState(false);
  const onLayout = (e: LayoutChangeEvent) => {
    size.current = { w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height };
    setReady(true);
  };
  return { size, onLayout, ready };
}

export function Arena({ children, onLayout, handlers, dark }: {
  children: React.ReactNode; onLayout: (e: LayoutChangeEvent) => void; handlers?: object; dark?: boolean;
}) {
  const { theme } = useTheme();
  return (
    <View
      {...handlers}
      onLayout={onLayout}
      style={[styles.arena, { borderColor: theme.border, backgroundColor: dark || theme.dark ? 'rgba(0,0,0,0.55)' : 'rgba(255,255,255,0.45)' }]}
    >
      {children}
    </View>
  );
}

// Эхлэх / Дууссан цонх. "Эхлэх" дарахад 3-2-1 гэж тоолоод тоглоом эхэлнэ.
export function Overlay({ phase, icon, intro, score, best, onStart }: {
  phase: Phase; icon: any; intro: string; score: number; best: number; onStart: () => void;
}) {
  const { theme } = useTheme();
  const [count, setCount] = useState(0); // 0 = тоолохгүй байна
  const pop = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (count === 0) return;
    pop.setValue(0);
    Animated.spring(pop, { toValue: 1, friction: 5, useNativeDriver: true }).start();
    tap();
    const t = setTimeout(() => {
      if (count === 1) { setCount(0); thud(); onStart(); } else setCount(count - 1);
    }, 650);
    return () => clearTimeout(t);
  }, [count]); // eslint-disable-line react-hooks/exhaustive-deps

  if (phase === 'play') return null;
  if (count > 0) {
    return (
      <View style={styles.overlay}>
        <Animated.Text style={{ fontSize: 110, fontWeight: '900', color: theme.accent,
          opacity: pop, transform: [{ scale: pop.interpolate({ inputRange: [0, 1], outputRange: [2.2, 1] }) }] }}>
          {count}
        </Animated.Text>
      </View>
    );
  }
  const over = phase === 'over';
  return (
    <View style={styles.overlay}>
      <Ionicons name={over ? 'trophy' : icon} size={54} color={theme.accent} />
      <T size={22} weight="800" style={{ marginTop: 10, textAlign: 'center' }}>
        {over ? `Оноо: ${score}` : 'Бэлэн үү?'}
      </T>
      <T size={14} muted style={{ textAlign: 'center', marginTop: 6, lineHeight: 20, maxWidth: 270 }}>
        {over ? (score >= best && score > 0 ? 'Шинэ рекорд!' : 'Дахиад оролдоод үз!') : intro}
      </T>
      <Pressable onPress={() => setCount(3)} style={[styles.play, { backgroundColor: theme.accent }]}>
        <Ionicons name={over ? 'refresh' : 'play'} size={18} color="#fff" />
        <T size={16} weight="700" color="#fff" style={{ marginLeft: 8 }}>{over ? 'Дахин тоглох' : 'Эхлэх'}</T>
      </Pressable>
    </View>
  );
}

export const dist = (a: { x: number; y: number }, b: { x: number; y: number }) => Math.hypot(a.x - b.x, a.y - b.y);

const styles = StyleSheet.create({
  wrap: { flex: 1, paddingHorizontal: 20, width: '100%', maxWidth: 560, alignSelf: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  hud: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  hudItem: { flex: 1, paddingVertical: 10, alignItems: 'center' },
  arena: { flex: 1, borderRadius: 30, borderWidth: 1, overflow: 'hidden' },
  overlay: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: 'rgba(0,0,0,0.35)' },
  play: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 26, height: 52, borderRadius: 26, marginTop: 20 },
});
