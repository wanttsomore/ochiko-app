// Миний тухай + ур чадвар. Ур чадвар бүр ухаалаг гэрийн "төхөөрөмж" шиг —
// дарахад гэрэл асч, түвшний шугам дахин дүүрнэ.
import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Glass, Pill, SectionTitle, T } from '../components/ui';
import { useTheme } from '../theme';
import { profile, skills, Skill } from '../data/profile';

// Тоглоом шиг "түвшин"-ээр илэрхийлсэн замнал
const JOURNEY = [
  { lv: 1, title: 'Анхны HTML хуудас', text: '"Hello World" — бүх зүйл эндээс эхэлсэн.' },
  { lv: 2, title: 'CSS-ээр амилуулсан', text: 'Өнгө, байрлал, анимэйшнд дурласан.' },
  { lv: 3, title: 'JavaScript тоглоом', text: 'Анхны game loop-оо бичсэн.' },
  { lv: 4, title: 'C# ба Unity', text: 'Жинхэнэ тоглоомын хөдөлгүүртэй танилцсан.' },
  { lv: 5, title: 'React Native апп', text: 'Яг одоо — энэ апп!' },
];

export default function About() {
  const { theme } = useTheme();
  return (
    <View>
      <SectionTitle kicker="Living room" title="Миний тухай" />

      <Glass strong>
        <T size={15} style={{ lineHeight: 23 }}>{profile.bio}</T>
        <View style={[styles.infoRow, { borderTopColor: theme.border }]}>
          <Info icon="school-outline" label={profile.school} />
          <Info icon="id-card-outline" label={`Оюутны код: ${profile.studentId}`} />
        </View>
        <View style={styles.chips}>
          {profile.interests.map((i) => <Pill key={i} label={i} icon="heart" />)}
        </View>
      </Glass>

      <T size={18} weight="700" style={{ marginTop: 26, marginBottom: 12 }}>Ур чадвар · Devices</T>
      <View style={{ gap: 12 }}>
        {skills.map((s, i) => <SkillDevice key={s.name} skill={s} delay={i * 120} />)}
      </View>

      <T size={18} weight="700" style={{ marginTop: 26, marginBottom: 12 }}>Замнал · Level map</T>
      <Glass>
        {JOURNEY.map((j, i) => {
          const current = i === JOURNEY.length - 1;
          return (
            <View key={j.lv} style={styles.level}>
              <View style={{ alignItems: 'center', width: 44 }}>
                <View style={[styles.lvBadge, { backgroundColor: current ? theme.accent : theme.glassStrong, borderColor: theme.border }]}>
                  <T size={12} weight="800" color={current ? '#fff' : undefined}>Lv{j.lv}</T>
                </View>
                {i < JOURNEY.length - 1 && <View style={[styles.line, { backgroundColor: theme.border }]} />}
              </View>
              <View style={{ flex: 1, paddingBottom: 18, marginLeft: 8 }}>
                <T size={15} weight="600">{j.title}</T>
                <T size={13} muted>{j.text}</T>
              </View>
            </View>
          );
        })}
      </Glass>
    </View>
  );
}

function Info({ icon, label }: { icon: any; label: string }) {
  const { theme } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
      <Ionicons name={icon} size={16} color={theme.accent} />
      <T size={13} muted style={{ marginLeft: 8, flex: 1 }}>{label}</T>
    </View>
  );
}

function SkillDevice({ skill, delay }: { skill: Skill; delay: number }) {
  const { theme } = useTheme();
  const [on, setOn] = useState(true);
  const fill = useRef(new Animated.Value(0)).current;

  const run = (toOn: boolean) =>
    Animated.timing(fill, { toValue: toOn ? skill.level : 0, duration: 900, delay: toOn ? delay : 0, useNativeDriver: false }).start();

  useEffect(() => { run(true); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = () => { const next = !on; setOn(next); run(next); };

  return (
    <Glass onPress={toggle} style={{ paddingVertical: 16 }}>
      <View style={styles.skillTop}>
        <View style={[styles.skillIcon, { backgroundColor: on ? theme.accent : theme.glassStrong }]}>
          <Ionicons name={skill.icon as any} size={22} color={on ? '#fff' : theme.text} />
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <T size={16} weight="700">{skill.name}</T>
          <T size={12} muted>{skill.note}</T>
        </View>
        <View style={[styles.percent, { backgroundColor: theme.glassStrong, borderColor: theme.border }]}>
          <T size={13} weight="700">{on ? `${skill.level}%` : 'OFF'}</T>
        </View>
      </View>
      <View style={[styles.track, { backgroundColor: theme.track }]}>
        <Animated.View
          style={[styles.trackFill, { backgroundColor: theme.accent,
            width: fill.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }) }]}
        >
          <View style={styles.thumb} />
        </Animated.View>
      </View>
    </Glass>
  );
}

const styles = StyleSheet.create({
  infoRow: { marginTop: 14, paddingTop: 6, borderTopWidth: 1 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 },
  skillTop: { flexDirection: 'row', alignItems: 'center' },
  skillIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  percent: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 14, borderWidth: 1, minWidth: 58, alignItems: 'center' },
  track: { height: 6, borderRadius: 3, marginTop: 16 },
  trackFill: { height: 6, borderRadius: 3, justifyContent: 'center' },
  thumb: { position: 'absolute', right: -9, width: 18, height: 18, borderRadius: 9, backgroundColor: '#fff', borderWidth: 3, borderColor: 'rgba(0,0,0,0.15)' },
  level: { flexDirection: 'row' },
  lvBadge: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  line: { width: 2, flex: 1, marginVertical: 4 },
});
