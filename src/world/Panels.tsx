// Түвшин бүрт нээгдэх самбарууд (доороос гарч ирэх цонх).
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, Linking, Modal, Pressable, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button, Glass, IconCircle, Pill, T } from '../components/ui';
import { useTheme } from '../theme';
import { contacts, profile, projects, skills, Skill } from '../data/profile';
import { photos } from '../data/photos';
import type { Level } from './levels';

type SheetProps = {
  level: Level | null;
  index: number;
  onClose: () => void;
  onPlay: (l: Level) => void;
  onRestart: () => void;
};

export default function StationSheet({ level, index, onClose, onPlay, onRestart }: SheetProps) {
  const { theme } = useTheme();
  const { height } = useWindowDimensions();
  return (
    <Modal visible={!!level} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      {level && (
        <View style={[styles.sheet, { maxHeight: height * 0.86, backgroundColor: theme.dark ? '#18181A' : '#F6F6F7', borderColor: theme.border }]}>
          <View style={[styles.grabber, { backgroundColor: theme.accent }]} />
          <View style={styles.head}>
            <View style={{ flex: 1 }}>
              <T size={12} weight="700" color={theme.accent} style={{ letterSpacing: 1.5 }}>
                LV {index + 1} · {level.sub.toUpperCase()}
              </T>
              <T size={26} weight="800">{level.title}</T>
            </View>
            <IconCircle name="close" onPress={onClose} />
          </View>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 28 }}>
            {level.kind === 'start' && <StartPanel />}
            {level.kind === 'about' && <AboutPanel />}
            {level.kind === 'skills' && <SkillsPanel />}
            {level.kind === 'game' && <GamePanel level={level} onPlay={() => onPlay(level)} />}
            {level.kind === 'contact' && <ContactPanel />}
            {level.kind === 'dream' && <DreamPanel onRestart={onRestart} />}
            {level.kind !== 'game' && level.kind !== 'dream' && (
              <Button label="Үргэлжлүүлэх" icon="arrow-forward" onPress={onClose} style={{ marginTop: 22 }} />
            )}
          </ScrollView>
        </View>
      )}
    </Modal>
  );
}

// ---------- Lv1: Танилцуулга ----------
function StartPanel() {
  const { theme } = useTheme();
  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={[styles.avatar, { backgroundColor: theme.accent }]}><T size={22} weight="800" color="#fff">ОЧ</T></View>
        <View style={{ marginLeft: 14, flex: 1 }}>
          <T size={22} weight="800">{profile.name}</T>
          <T size={14} weight="600" color={theme.accent}>{profile.role}</T>
        </View>
      </View>
      <T size={16} style={{ marginTop: 16, lineHeight: 24 }}>{profile.tagline}</T>
      <Glass style={{ marginTop: 16, gap: 10 }}>
        <Info icon="school-outline" text={profile.school} />
        <Info icon="briefcase-outline" text={`Мэргэжил: ${profile.major}`} />
        <Info icon="id-card-outline" text={`Оюутны код: ${profile.studentId}`} />
      </Glass>
      <T size={13} weight="700" style={{ marginTop: 20, marginBottom: 10 }}>ХЭРХЭН ТОГЛОХ ВЭ</T>
      <Glass style={{ gap: 12 }}>
        <Info icon="chevron-forward-circle-outline" text="Сум товчийг дарж байх хооронд морь давхина. Утсаа хазайлгаж ч удирдаж болно." />
        <Info icon="radio-button-on-outline" text="Гэр, овооны дэргэд очоод «Орох» товчийг дар." />
        <Info icon="lock-open-outline" text="Түвшин бүрийг дуусгах тусам замын хаалт нээгдэнэ." />
        <Info icon="phone-portrait-outline" text="Утсаа сэгсэрвэл өдөр шөнө солигдоно." />
        <Info icon="map-outline" text="Дээд талын жижиг газрын зураг дээр дарж хурдан аялж болно." />
      </Glass>
    </View>
  );
}

// ---------- Lv2: Миний тухай + замнал ----------
function AboutPanel() {
  const { theme } = useTheme();
  return (
    <View>
      <Image source={photos.ger} style={styles.photo} resizeMode="cover" />
      {profile.story.map((p, i) => (
        <T key={i} size={15} style={{ lineHeight: 23, marginBottom: 10 }} muted={i !== 1} weight={i === 1 ? '700' : '400'}>{p}</T>
      ))}

      <T size={13} weight="700" style={{ marginTop: 8, marginBottom: 10 }}>ТОГЛОСОН ТОГЛООМУУД</T>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {profile.played.map((g) => <Pill key={g} label={g} icon="game-controller" />)}
      </View>

      <T size={13} weight="700" style={{ marginTop: 22, marginBottom: 12 }}>ЗАМНАЛ</T>
      {profile.journey.map((j, i) => {
        const last = i === profile.journey.length - 1;
        const now = j.state === 'now';
        const next = j.state === 'next';
        return (
          <View key={j.title} style={{ flexDirection: 'row' }}>
            <View style={{ alignItems: 'center', width: 44 }}>
              <View style={[styles.node, {
                backgroundColor: now ? theme.accent : next ? 'transparent' : theme.glassStrong,
                borderColor: now || next ? theme.accent : theme.border, borderStyle: next ? 'dashed' : 'solid',
              }]}>
                <Ionicons name={j.icon as any} size={17} color={now ? '#fff' : next ? theme.accent : theme.text} />
              </View>
              {!last && <View style={[styles.vline, { backgroundColor: theme.border }]} />}
            </View>
            <View style={{ flex: 1, paddingBottom: last ? 0 : 18, marginLeft: 8 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <T size={15} weight="700">{j.title}</T>
                {(now || next) && (
                  <View style={[styles.tag, { backgroundColor: now ? theme.accent : theme.glassStrong }]}>
                    <T size={10} weight="800" color={now ? '#fff' : theme.accent}>{now ? 'ОДОО' : 'ИРЭЭДҮЙ'}</T>
                  </View>
                )}
              </View>
              <T size={13} muted style={{ lineHeight: 19, marginTop: 2 }}>{j.text}</T>
            </View>
          </View>
        );
      })}

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 18 }}>
        {profile.interests.map((i) => <Pill key={i} label={i} icon="sparkles" />)}
      </View>
    </View>
  );
}

// ---------- Lv3: Ур чадвар ----------
function SkillsPanel() {
  return (
    <View style={{ gap: 12 }}>
      <T size={14} muted style={{ lineHeight: 21 }}>Тоглоом бүтээхэд хэрэгтэй багаж бүрийг нэг нэгээр нь эзэмшиж байна.</T>
      {skills.map((s, i) => <SkillRow key={s.name} skill={s} delay={i * 120} />)}
    </View>
  );
}

function SkillRow({ skill, delay }: { skill: Skill; delay: number }) {
  const { theme } = useTheme();
  const fill = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fill, { toValue: skill.level, duration: 900, delay, useNativeDriver: false }).start();
  }, [fill, skill.level, delay]);
  return (
    <Glass style={{ paddingVertical: 14 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={[styles.skillIcon, { backgroundColor: theme.accent }]}>
          <Ionicons name={skill.icon as any} size={20} color="#fff" />
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <T size={16} weight="700">{skill.name}</T>
          <T size={12} muted>{skill.note}</T>
        </View>
        <T size={14} weight="800">{skill.level}%</T>
      </View>
      <View style={[styles.track, { backgroundColor: theme.track }]}>
        <Animated.View style={[styles.trackFill, { backgroundColor: theme.accent, width: fill.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }) }]} />
      </View>
    </Glass>
  );
}

// ---------- Lv4–6: Тоглоомууд ----------
function GamePanel({ level, onPlay }: { level: Level; onPlay: () => void }) {
  const { theme } = useTheme();
  const p = projects.find((x) => x.game === level.game);
  if (!p) return null;
  return (
    <View>
      <Image source={p.image} style={styles.photo} resizeMode="cover" />
      <T size={15} weight="600" color={theme.accent} style={{ marginBottom: 8 }}>{p.short}</T>
      <T size={15} muted style={{ lineHeight: 22 }}>{p.description}</T>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
        {p.stack.map((s) => <Pill key={s} label={s} icon="code-slash" />)}
      </View>
      <View style={[styles.hint, { borderColor: theme.border }]}>
        <Ionicons name="lock-open-outline" size={16} color={theme.accent} />
        <T size={13} muted style={{ marginLeft: 8, flex: 1 }}>Нэг удаа тоглож дуусгавал дараагийн түвшин нээгдэнэ.</T>
      </View>
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
        <Button label="Тоглох" icon="play" onPress={onPlay} style={{ flex: 1 }} />
        <Button label="Код" icon="logo-github" kind="ghost" onPress={() => Linking.openURL(p.link)} />
      </View>
    </View>
  );
}

// ---------- Lv7: Холбоо барих ----------
function ContactPanel() {
  const { theme } = useTheme();
  return (
    <View>
      <T size={14} muted style={{ lineHeight: 21, marginBottom: 14 }}>
        Тоглоомын санаа, хамтын төсөл, дадлагын санал байвал холбогдоорой. Товч дээр дарахад шууд нээгдэнэ.
      </T>
      <View style={styles.grid}>
        {contacts.map((c, i) => {
          const full = contacts.length % 2 === 1 && i === contacts.length - 1;
          return (
            <View key={c.id} style={{ width: full ? '100%' : '48.5%' }}>
              <Glass onPress={() => Linking.openURL(c.url).catch(() => {})} style={{ minHeight: 112, justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Ionicons name={c.icon as any} size={24} color={theme.accent} />
                  <Ionicons name="arrow-up-outline" size={18} color={theme.muted} style={{ transform: [{ rotate: '45deg' }] }} />
                </View>
                <View>
                  <T size={15} weight="700">{c.label}</T>
                  <T size={12} muted numberOfLines={1}>{c.value}</T>
                </View>
              </Glass>
            </View>
          );
        })}
      </View>
    </View>
  );
}

// ---------- Lv8: Мөрөөдөл ----------
function DreamPanel({ onRestart }: { onRestart: () => void }) {
  const { theme } = useTheme();
  const ig = contacts.find((c) => c.id === 'ig');
  const [shown] = useState(() => new Animated.Value(0));
  useEffect(() => { Animated.timing(shown, { toValue: 1, duration: 900, useNativeDriver: true }).start(); }, [shown]);
  return (
    <View>
      <Animated.Image source={photos.dream} style={[styles.photo, { height: 200, opacity: shown }]} resizeMode="cover" />
      <T size={13} weight="700" color={theme.accent} style={{ letterSpacing: 1.5 }}>БҮХ ТҮВШИН ДУУСЛАА</T>
      <T size={24} weight="800" style={{ marginTop: 4, lineHeight: 30 }}>Монголын түүхэн тоглоом</T>
      <T size={15} muted style={{ marginTop: 10, lineHeight: 23 }}>
        Ghost of Yōtei, Red Dead Redemption 2 шиг өргөн нээлттэй ертөнцтэй, Монголын түүх дээр суурилсан тоглоом бүтээх мөрөөдөлтэй.
      </T>
      <T size={15} muted style={{ marginTop: 8, lineHeight: 23 }}>
        Таны сая туулсан энэ жижиг тал нутаг бол тэр замын эхний алхам.
      </T>
      <Glass style={{ marginTop: 16, flexDirection: 'row', alignItems: 'center' }}>
        <Ionicons name="hourglass-outline" size={22} color={theme.accent} />
        <View style={{ marginLeft: 12, flex: 1 }}>
          <T size={15} weight="700">Төлөв: Суралцаж байна</T>
          <T size={12} muted>C#, Unity, game design-ийг алхам алхмаар</T>
        </View>
      </Glass>
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
        {ig && <Button label="Холбогдох" icon="logo-instagram" onPress={() => Linking.openURL(ig.url)} style={{ flex: 1 }} />}
        <Button label="Дахин" icon="refresh" kind="ghost" onPress={onRestart} />
      </View>
    </View>
  );
}

function Info({ icon, text }: { icon: any; text: string }) {
  const { theme } = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
      <Ionicons name={icon} size={18} color={theme.accent} style={{ marginTop: 1 }} />
      <T size={14} muted style={{ marginLeft: 10, flex: 1, lineHeight: 20 }}>{text}</T>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)' },
  sheet: { borderTopLeftRadius: 32, borderTopRightRadius: 32, borderWidth: 1, paddingHorizontal: 20, paddingTop: 10, width: '100%', maxWidth: 560, alignSelf: 'center' },
  grabber: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 12 },
  head: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  avatar: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
  photo: { width: '100%', height: 170, borderRadius: 22, marginBottom: 16 },
  vline: { width: 2, flex: 1, marginVertical: 4 },
  tag: { marginLeft: 8, paddingHorizontal: 7, paddingVertical: 2, borderRadius: 8 },
  node: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  skillIcon: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  track: { height: 6, borderRadius: 3, marginTop: 14, overflow: 'hidden' },
  trackFill: { height: 6, borderRadius: 3 },
  hint: { flexDirection: 'row', alignItems: 'center', marginTop: 16, padding: 12, borderRadius: 16, borderWidth: 1 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 10 },
});
