// Гарчгийн дэлгэц (title screen) — тоглоом шиг "дарж эхлэх".
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, ImageSourcePropType, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Background, T, tap, thud } from '../components/ui';
import { useTheme } from '../theme';
import { profile } from '../data/profile';
import { LEVELS } from '../world/levels';
import { sfx } from '../sound';

const LINES = [
  'тал нутгийг ачаалж байна',
  `${LEVELS.length} түвшин бэлдэж байна`,
  'морио эмээллэж байна',
  'бэлэн',
];

export default function Boot({ onDone, bg }: { onDone: () => void; bg?: ImageSourcePropType }) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [shown, setShown] = useState(0);
  const [ready, setReady] = useState(false);
  const spin = useRef(new Animated.Value(0)).current;
  const progress = useRef(new Animated.Value(0)).current;
  const blink = useRef(new Animated.Value(0)).current;
  const out = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(Animated.timing(spin, { toValue: 1, duration: 2600, easing: Easing.linear, useNativeDriver: true })).start();
    const timers = LINES.map((_, i) => setTimeout(() => setShown(i + 1), 300 + i * 380));
    Animated.timing(progress, { toValue: 1, duration: 300 + LINES.length * 380, useNativeDriver: false }).start(() => {
      setReady(true);
      Animated.loop(Animated.sequence([
        Animated.timing(blink, { toValue: 1, duration: 650, useNativeDriver: true }),
        Animated.timing(blink, { toValue: 0.25, duration: 650, useNativeDriver: true }),
      ])).start();
    });
    return () => timers.forEach(clearTimeout);
  }, [spin, progress, blink]);

  // Дэлгэцийн аль ч хэсэгт дарахад эхэлнэ
  const start = () => {
    if (!ready) return;
    thud();
    sfx('open');
    Animated.timing(out, { toValue: 0, duration: 350, useNativeDriver: true }).start(onDone);
  };

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <Pressable style={{ flex: 1 }} onPress={() => { tap(); start(); }}>
      <Animated.View style={{ flex: 1, opacity: out }}>
        <Background image={bg} dim={0.55}>
          <View style={[styles.wrap, { paddingTop: insets.top + 50, paddingBottom: insets.bottom + 40 }]}>
            <View style={{ alignItems: 'center' }}>
              <Animated.View style={[styles.ring, { borderColor: theme.accent, transform: [{ rotate }] }]}>
                <View style={styles.sat} />
              </Animated.View>
              <View style={styles.logoCenter}><T size={34} weight="800" color="#fff">ОЧ</T></View>
              <T size={13} weight="700" color={theme.accent} style={{ marginTop: 26, letterSpacing: 4 }}>OCHIKO</T>
              <T size={30} weight="800" color="#fff" style={[styles.shadow, { marginTop: 6 }]}>Тал нутгийн аялал</T>
              <T size={14} color="rgba(255,255,255,0.85)" style={[styles.shadow, { marginTop: 6 }]}>{profile.name} · портфолио тоглоом</T>
            </View>

            <View>
              <View style={styles.terminal}>
                {LINES.slice(0, shown).map((l, i) => (
                  <T key={i} size={13} color={i === shown - 1 ? '#fff' : 'rgba(255,255,255,0.55)'} style={{ fontFamily: 'monospace', marginBottom: 4 }}>
                    {'> '}{l}{i < shown - 1 ? ' … ok' : ''}
                  </T>
                ))}
                <View style={styles.bar}>
                  <Animated.View style={{ height: '100%', borderRadius: 3, backgroundColor: theme.accent,
                    width: progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }} />
                </View>
              </View>
              <Animated.View style={{ opacity: ready ? blink : 0, alignItems: 'center', marginTop: 28 }}>
                <T size={13} weight="800" color="#fff" style={{ letterSpacing: 4 }}>PRESS START</T>
                <T size={13} color="rgba(255,255,255,0.8)" style={{ marginTop: 4 }}>Эхлэхийн тулд дэлгэц дээр дарна уу</T>
              </Animated.View>
            </View>
          </View>
        </Background>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, justifyContent: 'space-between', paddingHorizontal: 24, width: '100%', maxWidth: 520, alignSelf: 'center' },
  ring: { width: 140, height: 140, borderRadius: 70, borderWidth: 8 },
  sat: { position: 'absolute', top: -2, right: 12, width: 24, height: 24, borderRadius: 12, backgroundColor: '#fff' },
  logoCenter: { position: 'absolute', top: 0, height: 140, justifyContent: 'center' },
  terminal: { borderRadius: 22, borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', backgroundColor: 'rgba(10,10,12,0.55)', padding: 18 },
  bar: { height: 6, borderRadius: 3, marginTop: 10, overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.15)' },
  shadow: { textShadowColor: 'rgba(0,0,0,0.5)', textShadowRadius: 10, textShadowOffset: { width: 0, height: 1 } },
});
