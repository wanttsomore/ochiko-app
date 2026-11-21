// Ochiko OS — Д.Очиржанцаны портфолио апп (React Native + Expo)
// Бүтэц: Boot (нээх дэлгэц) → 4 "өрөө" (Нүүр, Миний тухай, Бүтээлүүд, Холбоо) + 3 тоглоом.
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ThemeProvider, useTheme } from './src/theme';
import { Background, T, tap, thud } from './src/components/ui';
import { useShake } from './src/hooks/useSensors';
import Boot from './src/screens/Boot';
import Home from './src/screens/Home';
import About from './src/screens/About';
import Projects from './src/screens/Projects';
import Contact from './src/screens/Contact';
import GameHost, { GameId } from './src/games';
import { photos } from './src/data/photos';

// Таб бүр өөрийн арын зурагтай — солигдоход зураг crossfade хийнэ
const TABS = [
  { label: 'Нүүр', icon: 'home', bg: photos.home },
  { label: 'Тухай', icon: 'person', bg: photos.about },
  { label: 'Бүтээл', icon: 'game-controller', bg: photos.arcade },
  { label: 'Холбоо', icon: 'chatbubbles', bg: photos.city },
] as const;

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <Root />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

function Root() {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [booted, setBooted] = useState(false);
  const [tab, setTab] = useState(0);
  const [game, setGame] = useState<GameId | null>(null);
  const scrollRef = useRef<React.ComponentRef<typeof ScrollView>>(null);
  const fade = useRef(new Animated.Value(1)).current;
  const slide = useRef(new Animated.Value(0)).current;
  const busy = useRef(false);

  // Утсаа сэгсрэхэд нууц тоглоом (Orb Rush) нээгдэнэ
  useShake(() => { thud(); setGame('orb'); }, booted && !game);

  // Таб солих шилжилт: баруун таб руу бол зүүн тийш гулсаж гарна, шинэ нь баруунаас орж ирнэ
  const go = (i: number) => {
    if (i === tab || busy.current) return;
    busy.current = true;
    tap();
    const dir = i > tab ? 1 : -1;
    Animated.parallel([
      Animated.timing(fade, { toValue: 0, duration: 140, useNativeDriver: true }),
      Animated.timing(slide, { toValue: -dir * 40, duration: 140, easing: Easing.in(Easing.quad), useNativeDriver: true }),
    ]).start(() => {
      setTab(i);
      scrollRef.current?.scrollTo({ y: 0, animated: false });
      slide.setValue(dir * 60);
      Animated.parallel([
        Animated.timing(fade, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.spring(slide, { toValue: 0, friction: 9, tension: 70, useNativeDriver: true }),
      ]).start(() => { busy.current = false; });
    });
  };

  if (!booted) {
    return (
      <>
        <StatusBar style={theme.dark ? 'light' : 'dark'} />
        <Boot onDone={() => setBooted(true)} bg={photos.home} />
      </>
    );
  }

  const screens = [
    <Home key="h" go={go} openGame={() => setGame('orb')} />,
    <About key="a" />,
    <Projects key="p" openGame={(g) => setGame(g)} />,
    <Contact key="c" />,
  ];

  return (
    <Background image={TABS[tab].bg}>
      <StatusBar style={theme.dark ? 'light' : 'dark'} />
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 14, paddingBottom: insets.bottom + 120 }]}
      >
        <Animated.View
          style={{ opacity: fade, transform: [{ translateX: slide }] }}
        >
          {screens[tab]}
        </Animated.View>
      </ScrollView>

      <TabBar active={tab} onChange={go} bottom={insets.bottom} />
      <GameHost game={game} onClose={() => setGame(null)} />
    </Background>
  );
}

function TabBar({ active, onChange, bottom }: { active: number; onChange: (i: number) => void; bottom: number }) {
  const { theme } = useTheme();
  return (
    <View style={[styles.tabWrap, { bottom: bottom + 14 }]} pointerEvents="box-none">
      <View style={[styles.tabBar, { backgroundColor: theme.dark ? 'rgba(28,28,30,0.92)' : 'rgba(255,255,255,0.92)', borderColor: theme.border }]}>
        {TABS.map((t, i) => {
          const on = i === active;
          return (
            <Pressable key={t.label} onPress={() => onChange(i)} style={styles.tabItem} hitSlop={4}>
              <View style={[styles.tabIcon, on && { backgroundColor: theme.accent }]}>
                <Ionicons name={(on ? t.icon : `${t.icon}-outline`) as any} size={20} color={on ? '#fff' : theme.muted} />
              </View>
              <T size={10} weight="600" muted={!on} style={{ marginTop: 3 }}>{t.label}</T>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, width: '100%', maxWidth: 520, alignSelf: 'center' },
  tabWrap: { position: 'absolute', left: 0, right: 0, alignItems: 'center', paddingHorizontal: 20 },
  tabBar: {
    flexDirection: 'row', width: '100%', maxWidth: 480, borderRadius: 32, borderWidth: 1, paddingVertical: 8, paddingHorizontal: 6,
    shadowColor: '#000', shadowOpacity: 0.25, shadowRadius: 20, shadowOffset: { width: 0, height: 8 }, elevation: 10,
  },
  tabItem: { flex: 1, alignItems: 'center' },
  tabIcon: { width: 44, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
});
