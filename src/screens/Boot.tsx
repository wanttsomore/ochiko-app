// Нээх дэлгэц: "Ochiko OS" ачааллаж буй мэт анимэйшн, дараа нь гулсуулж нэвтэрнэ.
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, ImageSourcePropType, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Background, SwipeButton, T, tap } from '../components/ui';
import { useTheme } from '../theme';
import { profile, skills, projects } from '../data/profile';

const LINES = [
  '> booting ochiko_os v1.0',
  `> loading ${skills.length} skills ........ ok`,
  `> mounting ${projects.length} projects ...... ok`,
  '> calibrating sensors ..... ok',
  '> level up ready ✓',
];

export default function Boot({ onDone, bg }: { onDone: () => void; bg?: ImageSourcePropType }) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [shown, setShown] = useState(0);
  const spin = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Тойрог эргэх
    Animated.loop(Animated.timing(spin, { toValue: 1, duration: 2400, easing: Easing.linear, useNativeDriver: true })).start();
    // Ачааллын мөр нэг нэгээр гарах
    const timers = LINES.map((_, i) => setTimeout(() => { setShown(i + 1); tap(); }, 350 + i * 380));
    Animated.timing(progress, { toValue: 1, duration: 350 + LINES.length * 380, useNativeDriver: false }).start(() =>
      Animated.timing(fadeIn, { toValue: 1, duration: 500, useNativeDriver: true }).start(),
    );
    return () => timers.forEach(clearTimeout);
  }, [spin, progress, fadeIn]);

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <Background image={bg} dim={0.8}>
      <View style={[styles.wrap, { paddingTop: insets.top + 40, paddingBottom: insets.bottom + 30 }]}>
        <View style={{ alignItems: 'center' }}>
          <Animated.View style={[styles.ring, { borderColor: theme.accent, transform: [{ rotate }] }]}>
            <View style={styles.sat} />
          </Animated.View>
          <View style={styles.logoCenter}>
            <T size={34} weight="800">ОЧ</T>
          </View>
          <T size={13} weight="700" color={theme.accent} style={{ marginTop: 28, letterSpacing: 3 }}>OCHIKO OS</T>
        </View>

        <View style={[styles.terminal, { backgroundColor: theme.glass, borderColor: theme.border }]}>
          {LINES.slice(0, shown).map((l, i) => (
            <T key={i} size={13} muted={i < shown - 1} style={{ fontFamily: 'monospace', marginBottom: 4 }}>{l}</T>
          ))}
          <View style={[styles.bar, { backgroundColor: theme.track }]}>
            <Animated.View
              style={{ height: '100%', borderRadius: 3, backgroundColor: theme.accent,
                width: progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }}
            />
          </View>
        </View>

        <Animated.View style={{ opacity: fadeIn, transform: [{ translateY: fadeIn.interpolate({ inputRange: [0, 1], outputRange: [20, 0] }) }] }}>
          <T size={14} muted style={{ textAlign: 'center' }}>Тавтай морил,</T>
          <T size={30} weight="700" style={{ textAlign: 'center', marginBottom: 22 }}>{profile.name}-ийн ертөнцөд</T>
          <SwipeButton label="Гулсуулж нэвтрэх" icon="power" onComplete={onDone} />
        </Animated.View>
      </View>
    </Background>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, justifyContent: 'space-between', paddingHorizontal: 24, width: '100%', maxWidth: 520, alignSelf: 'center' },
  ring: { width: 150, height: 150, borderRadius: 75, borderWidth: 9 },
  sat: { position: 'absolute', top: -2, right: 14, width: 26, height: 26, borderRadius: 13, backgroundColor: '#fff' },
  logoCenter: { position: 'absolute', top: 0, height: 150, justifyContent: 'center' },
  terminal: { borderRadius: 22, borderWidth: 1, padding: 18 },
  bar: { height: 6, borderRadius: 3, marginTop: 10, overflow: 'hidden' },
});
