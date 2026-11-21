// Бүтээлүүд — "CCTV камер" шиг карт. Зүүн/баруун тийш swipe хийж үзнэ,
// дарахад доороос дэлгэрэнгүй цонх гарч ирнэ.
import React, { useRef, useState } from 'react';
import {
  Animated, Image, Linking, Modal, NativeScrollEvent, NativeSyntheticEvent, Pressable, ScrollView, StyleSheet, View, useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Glass, IconCircle, Pill, SectionTitle, SwipeButton, T, tap } from '../components/ui';
import { useTheme } from '../theme';
import { projects, Project } from '../data/profile';

export default function Projects({ openGame }: { openGame: () => void }) {
  const { theme } = useTheme();
  const { width } = useWindowDimensions();
  const cardW = Math.min(width, 520) - 40; // дэлгэцийн өргөнөөс хамаарч карт томорно/жижгэрнэ
  const gap = 12;
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState<Project | null>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const onEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / (cardW + gap));
    if (i !== index) { setIndex(i); tap(); }
  };

  return (
    <View>
      <SectionTitle kicker="Home CCTV" title="Бүтээлүүд" />
      <View style={styles.rowBetween}>
        <T size={13} muted>← Хуруугаараа гүйлгэ →</T>
        <T size={13} weight="700">{String(index + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}</T>
      </View>

      <Animated.FlatList
        data={projects}
        keyExtractor={(p) => p.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={cardW + gap}
        decelerationRate="fast"
        style={{ marginHorizontal: -20, marginTop: 12 }}
        contentContainerStyle={{ paddingHorizontal: 20, gap }}
        onMomentumScrollEnd={onEnd}
        onScrollEndDrag={onEnd}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: true })}
        scrollEventThrottle={16}
        renderItem={({ item, index: i }) => {
          // Голд байгаа карт том, хажуугийнх нь жижиг харагдана
          const input = [(i - 1) * (cardW + gap), i * (cardW + gap), (i + 1) * (cardW + gap)];
          const scale = scrollX.interpolate({ inputRange: input, outputRange: [0.92, 1, 0.92], extrapolate: 'clamp' });
          return (
            <Animated.View style={{ width: cardW, transform: [{ scale }] }}>
              <CamCard p={item} cam={i + 1} h={cardW * 0.9} onPress={() => setOpen(item)} />
            </Animated.View>
          );
        }}
      />

      <View style={styles.dots}>
        {projects.map((p, i) => (
          <View key={p.id} style={[styles.dot, { backgroundColor: i === index ? theme.accent : theme.track, width: i === index ? 22 : 8 }]} />
        ))}
      </View>

      {/* Бүх бүтээлийн жагсаалт */}
      <View style={{ gap: 10, marginTop: 10 }}>
        {projects.map((p) => (
          <Glass key={p.id} onPress={() => setOpen(p)} style={styles.listItem}>
            <Image source={p.image} style={styles.thumb} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <T size={15} weight="700">{p.title}</T>
              <T size={12} muted numberOfLines={1}>{p.short}</T>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.muted} />
          </Glass>
        ))}
      </View>

      <ProjectSheet p={open} onClose={() => setOpen(null)} onPlay={() => { setOpen(null); setTimeout(openGame, 350); }} />
    </View>
  );
}

function CamCard({ p, cam, h, onPress }: { p: Project; cam: number; h: number; onPress: () => void }) {
  return (
    <Pressable onPress={() => { tap(); onPress(); }} style={[styles.cam, { height: h }]}>
      <Image source={p.image} style={StyleSheet.absoluteFill} resizeMode="cover" />
      <View style={styles.camTop}>
        <T size={12} weight="700" color="#fff">Cam{cam} · {p.tag}</T>
        <Pill label={p.status === 'Locked' ? 'Locked' : p.status} icon={p.status === 'Locked' ? 'lock-closed' : undefined} dot={p.status === 'Live'} />
      </View>
      <View style={styles.camBottom}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <T size={22} weight="700" color="#fff">{p.title}</T>
          </View>
          <T size={12} color="rgba(255,255,255,0.7)">{p.stack.join(' · ')}</T>
        </View>
        <View style={styles.camArrow}><Ionicons name="chevron-forward" size={18} color="#fff" /></View>
      </View>
    </Pressable>
  );
}

function ProjectSheet({ p, onClose, onPlay }: { p: Project | null; onClose: () => void; onPlay: () => void }) {
  const { theme } = useTheme();
  const { width } = useWindowDimensions();
  const imgH = (Math.min(width, 560) - 40) / 1.5; // 3:2 харьцаа
  return (
    <Modal visible={!!p} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} />
      {p && (
        <View style={[styles.sheet, { backgroundColor: theme.dark ? '#1E1E20' : '#F6F6F7', borderColor: theme.border }]}>
          <View style={[styles.grabber, { backgroundColor: theme.accent }]} />
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.rowBetween}>
              <Pill label={p.status} dot={p.status === 'Live'} />
              <IconCircle name="close" size={36} onPress={onClose} />
            </View>
            <Image source={p.image} style={[styles.sheetImg, { height: imgH }]} resizeMode="cover" />
            <T size={26} weight="800">{p.title}</T>
            <T size={14} weight="600" color={theme.accent} style={{ marginBottom: 10 }}>{p.short}</T>
            <T size={15} muted style={{ lineHeight: 22 }}>{p.description}</T>
            <T size={13} weight="700" style={{ marginTop: 18, marginBottom: 8 }}>Ашигласан технологи:</T>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 22 }}>
              {p.stack.map((s) => <Pill key={s} label={s} icon="code-slash" />)}
            </View>
            {p.action === 'game' ? (
              <SwipeButton label="Гулсуулж тоглох" icon="game-controller" onComplete={onPlay} />
            ) : p.status === 'Locked' ? (
              <SwipeButton label="Зөвлөгөө өгөх" icon="mail" onComplete={() => Linking.openURL(p.link)} />
            ) : (
              <SwipeButton label="Төслийг нээх" icon="open-outline" onComplete={() => Linking.openURL(p.link)} />
            )}
            <View style={{ height: 20 }} />
          </ScrollView>
        </View>
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  rowBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cam: { borderRadius: 28, overflow: 'hidden', backgroundColor: '#222', justifyContent: 'space-between' },
  camTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16 },
  camBottom: {
    flexDirection: 'row', alignItems: 'center', margin: 12, padding: 14, borderRadius: 22,
    backgroundColor: 'rgba(30,30,32,0.62)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
  },
  camArrow: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginVertical: 16 },
  dot: { height: 8, borderRadius: 4 },
  listItem: { flexDirection: 'row', alignItems: 'center', padding: 10 },
  thumb: { width: 56, height: 56, borderRadius: 16 },
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  sheet: { maxHeight: '85%', borderTopLeftRadius: 32, borderTopRightRadius: 32, borderWidth: 1, padding: 20, paddingTop: 10, width: '100%', maxWidth: 560, alignSelf: 'center' },
  grabber: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 12 },
  sheetImg: { width: '100%', borderRadius: 22, marginVertical: 14 },
});
