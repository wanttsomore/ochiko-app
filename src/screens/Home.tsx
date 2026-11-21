// Нүүр (танилцуулга) дэлгэц — ухаалаг гэрийн dashboard хэлбэртэй.
import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Glass, IconCircle, MoodSwitch, Pill, T, Toggle, tap, thud, Stagger } from '../components/ui';
import { useTheme } from '../theme';
import { profile, projects, skills } from '../data/profile';

type Props = { go: (tab: number) => void; openGame: () => void };

export default function Home({ go, openGame }: Props) {
  const { theme, setDark } = useTheme();

  // Easter egg: аватарыг 5 удаа дарвал нууц тоглоом нээгдэнэ
  const taps = useRef(0);
  const wobble = useRef(new Animated.Value(0)).current;
  const onAvatar = () => {
    taps.current += 1;
    tap();
    Animated.sequence([
      Animated.timing(wobble, { toValue: 1, duration: 60, useNativeDriver: true }),
      Animated.timing(wobble, { toValue: -1, duration: 60, useNativeDriver: true }),
      Animated.timing(wobble, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
    if (taps.current >= 5) { taps.current = 0; thud(); openGame(); }
  };

  return (
    <Stagger>
      {/* Толгой хэсэг */}
      <View style={styles.header}>
        <Pressable onPress={onAvatar} hitSlop={6}>
          <Animated.View
            style={[styles.avatar, { backgroundColor: theme.accent,
              transform: [{ rotate: wobble.interpolate({ inputRange: [-1, 1], outputRange: ['-12deg', '12deg'] }) }] }]}
          >
            <T size={17} weight="800" color="#fff">ОЧ</T>
          </Animated.View>
        </Pressable>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <T size={13} muted>Welcome back 👋</T>
          <T size={17} weight="700">{profile.nickname}'s Home</T>
        </View>
        <IconCircle name={theme.dark ? 'moon' : 'sunny'} onPress={() => setDark(!theme.dark)} />
      </View>

      {/* Танилцуулга карт: нэр, чиглэл, нэг өгүүлбэр */}
      <Glass strong style={{ marginBottom: 14 }}>
        <View style={styles.rowBetween}>
          <Pill label="4-р курс · Online" dot />
          <T size={12} muted>ID {profile.studentId}</T>
        </View>
        <T size={34} weight="800" style={{ marginTop: 16 }}>{profile.name}</T>
        <T size={16} weight="600" color={theme.accent} style={{ marginTop: 2 }}>🎮 {profile.role}</T>
        <T size={15} muted style={{ marginTop: 10, lineHeight: 22 }}>{profile.tagline}</T>

        <View style={[styles.stats, { borderTopColor: theme.border }]}>
          <Stat value={`${skills.length}`} label="Skills" />
          <Stat value={`${projects.length}`} label="Projects" />
          <Stat value="3" label="Games 🎮" />
        </View>
      </Glass>

      {/* Warm / Neutral / Cold — апп-ын өнгө солих */}
      <MoodSwitch />

      {/* Night mode */}
      <Glass style={[styles.rowBetween, { marginTop: 14 }]}>
        <View style={{ flexDirection: 'row', flex: 1 }}>
          <View style={{ marginRight: 22 }}>
            <T size={16} weight="600">Night mode</T>
            <T size={13} muted>Dark theme</T>
          </View>
          <View>
            <T size={16} weight="600">{theme.dark ? 'Асаалттай' : 'Унтраалттай'}</T>
            <T size={13} muted>Нүдэнд ээлтэй</T>
          </View>
        </View>
        <Toggle value={theme.dark} onChange={setDark} />
      </Glass>

      {/* Хурдан шилжих 2 карт */}
      <View style={styles.grid}>
        <DeviceCard icon="hardware-chip-outline" title="Ур чадвар" sub={`${skills.length} технологи`} onPress={() => go(1)} />
        <DeviceCard icon="videocam-outline" title="Бүтээлүүд" sub={`${projects.length} төсөл`} onPress={() => go(2)} />
      </View>

      <Glass onPress={() => go(3)} style={[styles.rowBetween, { marginTop: 14 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={[styles.cta, { backgroundColor: theme.accent }]}>
            <Ionicons name="paper-plane" size={18} color="#fff" />
          </View>
          <View style={{ marginLeft: 12 }}>
            <T size={11} muted>Хамтран ажиллах уу?</T>
            <T size={15} weight="600">Надтай холбогдох</T>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color={theme.muted} />
      </Glass>

      <T size={12} muted style={{ textAlign: 'center', marginTop: 22 }}>
        🤫 Нууц: утсаа сэгсэрээд үзээрэй…
      </T>
    </Stagger>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View style={{ alignItems: 'center', flex: 1 }}>
      <T size={26} weight="700">{value}</T>
      <T size={12} muted>{label}</T>
    </View>
  );
}

function DeviceCard({ icon, title, sub, onPress }: { icon: any; title: string; sub: string; onPress: () => void }) {
  const { theme } = useTheme();
  return (
    <View style={{ flex: 1 }}>
      <Glass onPress={onPress} style={{ minHeight: 150, justifyContent: 'space-between' }}>
        <View style={styles.rowBetween}>
          <Ionicons name={icon} size={26} color={theme.text} />
          <IconCircle name="expand-outline" size={34} />
        </View>
        <View>
          <T size={18} weight="700">{title}</T>
          <T size={13} muted>{sub}</T>
        </View>
      </Glass>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  avatar: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  stats: { flexDirection: 'row', marginTop: 18, paddingTop: 14, borderTopWidth: 1 },
  grid: { flexDirection: 'row', gap: 12, marginTop: 14 },
  cta: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
});
