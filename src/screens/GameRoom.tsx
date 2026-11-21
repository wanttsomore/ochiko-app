// 🎮 Нууц "Game Room" (easter egg) — утсаа сэгсрэх эсвэл аватарыг 5 дарахад нээгдэнэ.
// "Orb Rush": утсаа хазайлгаж бөмбөгөө өнхрүүлээд улбар шар орбуудыг цуглуул, 🐞 bug-аас зайлсхий!
// Мэдрэгчгүй төхөөрөмж дээр (компьютер) хуруугаараа чирж удирдана.
import React, { useEffect, useRef, useState } from 'react';
import { Modal, PanResponder, Platform, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Accelerometer } from 'expo-sensors';
import { Ionicons } from '@expo/vector-icons';
import { Background, Glass, IconCircle, T, success, tap, thud } from '../components/ui';
import { useTheme } from '../theme';

const BALL = 18;   // бөмбөгний радиус
const ORB = 13;    // орбын радиус
const BUG = 16;    // bug-ийн радиус
const TIME = 20;   // тоглоомын хугацаа (секунд)

type Vec = { x: number; y: number };
type Phase = 'ready' | 'play' | 'over';

export default function GameRoom({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const [phase, setPhase] = useState<Phase>('ready');
  const [, setFrame] = useState(0); // дэлгэцийг дахин зурахад ашиглана
  const [best, setBest] = useState(0);

  const size = useRef({ w: 0, h: 0 });
  const ball = useRef<Vec>({ x: 100, y: 100 });
  const vel = useRef<Vec>({ x: 0, y: 0 });
  const orb = useRef<Vec>({ x: 200, y: 200 });
  const bug = useRef<Vec>({ x: 50, y: 300 });
  const bugVel = useRef<Vec>({ x: 2.2, y: 1.6 });
  const accel = useRef<Vec>({ x: 0, y: 0 });
  const touch = useRef<Vec | null>(null);
  const score = useRef(0);
  const timeLeft = useRef(TIME);
  const hurtUntil = useRef(0);

  const randomPos = (r: number): Vec => ({
    x: r + Math.random() * Math.max(1, size.current.w - r * 2),
    y: r + Math.random() * Math.max(1, size.current.h - r * 2),
  });

  const start = () => {
    const { w, h } = size.current;
    ball.current = { x: w / 2, y: h / 2 };
    vel.current = { x: 0, y: 0 };
    orb.current = randomPos(ORB);
    bug.current = { x: 30, y: 30 };
    bugVel.current = { x: 2.2, y: 1.7 };
    score.current = 0;
    timeLeft.current = TIME;
    tap();
    setPhase('play');
  };

  // Хурдатгал мэдрэгч: тоглож байх үед л сонсоно
  useEffect(() => {
    if (phase !== 'play' || Platform.OS === 'web') return;
    // Android, iOS дээр тэмдэг нь эсрэг байдаг тул тохируулна
    const s = Platform.OS === 'android' ? -1 : 1;
    Accelerometer.setUpdateInterval(16);
    const sub = Accelerometer.addListener(({ x, y }) => { accel.current = { x: x * s, y: -y * s }; });
    return () => sub.remove();
  }, [phase]);

  // Game loop — секундэд ~60 удаа байрлалыг шинэчилнэ
  useEffect(() => {
    if (phase !== 'play') return;
    let raf = 0;
    let last = Date.now();
    const loop = () => {
      const now = Date.now();
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const { w, h } = size.current;

      // 1) Хүч: хуруу хүрч байвал тийшээ, үгүй бол хазайлтаар
      let fx = accel.current.x, fy = accel.current.y;
      if (touch.current) {
        fx = (touch.current.x - ball.current.x) / 60;
        fy = (touch.current.y - ball.current.y) / 60;
      }
      vel.current.x = (vel.current.x + fx * 1.1) * 0.95;
      vel.current.y = (vel.current.y + fy * 1.1) * 0.95;
      ball.current.x += vel.current.x;
      ball.current.y += vel.current.y;

      // 2) Хананаас ойх
      if (ball.current.x < BALL) { ball.current.x = BALL; vel.current.x *= -0.5; }
      if (ball.current.x > w - BALL) { ball.current.x = w - BALL; vel.current.x *= -0.5; }
      if (ball.current.y < BALL) { ball.current.y = BALL; vel.current.y *= -0.5; }
      if (ball.current.y > h - BALL) { ball.current.y = h - BALL; vel.current.y *= -0.5; }

      // 3) Bug хөдөлгөөн (оноо ахих тусам хурдасна)
      const speedUp = 1 + score.current * 0.04;
      bug.current.x += bugVel.current.x * speedUp;
      bug.current.y += bugVel.current.y * speedUp;
      if (bug.current.x < BUG || bug.current.x > w - BUG) bugVel.current.x *= -1;
      if (bug.current.y < BUG || bug.current.y > h - BUG) bugVel.current.y *= -1;

      // 4) Мөргөлдөөн шалгах (2 тойргийн төв хоорондын зай)
      if (dist(ball.current, orb.current) < BALL + ORB) {
        score.current += 1;
        orb.current = randomPos(ORB);
        success();
      }
      if (now > hurtUntil.current && dist(ball.current, bug.current) < BALL + BUG) {
        score.current = Math.max(0, score.current - 3);
        hurtUntil.current = now + 1000;
        thud();
      }

      // 5) Хугацаа
      timeLeft.current -= dt;
      if (timeLeft.current <= 0) {
        timeLeft.current = 0;
        setBest((b) => Math.max(b, score.current));
        thud();
        setPhase('over');
        return;
      }
      setFrame((f) => f + 1);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  // Хуруугаар удирдах (fallback)
  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => { touch.current = { x: e.nativeEvent.locationX, y: e.nativeEvent.locationY }; },
      onPanResponderMove: (e) => { touch.current = { x: e.nativeEvent.locationX, y: e.nativeEvent.locationY }; },
      onPanResponderRelease: () => { touch.current = null; },
      onPanResponderTerminate: () => { touch.current = null; },
    }),
  ).current;

  const close = () => { setPhase('ready'); onClose(); };
  const hurt = Date.now() < hurtUntil.current;

  return (
    <Modal visible={visible} animationType="fade" onRequestClose={close} statusBarTranslucent>
      <Background>
        <View style={[styles.wrap, { paddingTop: insets.top + 12, paddingBottom: insets.bottom + 16 }]}>
          <View style={styles.header}>
            <View>
              <T size={12} weight="700" color={theme.accent} style={{ letterSpacing: 1.5 }}>🎮 SECRET · GAME ROOM</T>
              <T size={24} weight="800">Orb Rush</T>
            </View>
            <IconCircle name="close" onPress={close} />
          </View>

          <View style={styles.hud}>
            <Glass style={styles.hudItem}><T size={12} muted>Оноо</T><T size={22} weight="800">{score.current}</T></Glass>
            <Glass style={styles.hudItem}><T size={12} muted>Хугацаа</T><T size={22} weight="800">{Math.ceil(timeLeft.current)}s</T></Glass>
            <Glass style={styles.hudItem}><T size={12} muted>Рекорд</T><T size={22} weight="800">{best}</T></Glass>
          </View>

          <View
            {...pan.panHandlers}
            onLayout={(e) => { size.current = { w: e.nativeEvent.layout.width, h: e.nativeEvent.layout.height }; }}
            style={[styles.arena, { borderColor: theme.border, backgroundColor: theme.dark ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.4)' }]}
          >
            {phase === 'play' && (
              <>
                <View pointerEvents="none" style={[styles.circle, pos(orb.current, ORB), { backgroundColor: theme.accent, shadowColor: theme.accent }]} />
                <View pointerEvents="none" style={[styles.bug, pos(bug.current, BUG)]}><T size={22}>🐞</T></View>
                <View pointerEvents="none" style={[styles.circle, pos(ball.current, BALL), { backgroundColor: hurt ? '#FF3B30' : theme.text }]} />
              </>
            )}

            {phase !== 'play' && (
              <View style={styles.overlay}>
                <Ionicons name={phase === 'over' ? 'trophy' : 'game-controller'} size={54} color={theme.accent} />
                <T size={22} weight="800" style={{ marginTop: 10, textAlign: 'center' }}>
                  {phase === 'over' ? `Оноо: ${score.current}` : 'Нууц өрөөг нээлээ!'}
                </T>
                <T size={14} muted style={{ textAlign: 'center', marginTop: 6, lineHeight: 20, maxWidth: 260 }}>
                  {phase === 'over'
                    ? score.current >= best && score.current > 0 ? '🔥 Шинэ рекорд!' : 'Дахиад оролдоод үз!'
                    : 'Утсаа хазайлгаж цагаан бөмбөгөө удирд (эсвэл хуруугаараа чир). Улбар шар орбуудыг цуглуулж, 🐞 bug-аас зайлсхий.'}
                </T>
                <Pressable onPress={start} style={[styles.play, { backgroundColor: theme.accent }]}>
                  <Ionicons name="play" size={18} color="#fff" />
                  <T size={16} weight="700" color="#fff" style={{ marginLeft: 8 }}>{phase === 'over' ? 'Дахин тоглох' : 'Эхлэх'}</T>
                </Pressable>
              </View>
            )}
          </View>
          <T size={12} muted style={{ textAlign: 'center', marginTop: 10 }}>
            Миний бүтээсэн анхны тоглоом ✦ React Native + Accelerometer
          </T>
        </View>
      </Background>
    </Modal>
  );
}

const dist = (a: Vec, b: Vec) => Math.hypot(a.x - b.x, a.y - b.y);
const pos = (p: Vec, r: number) => ({ left: p.x - r, top: p.y - r, width: r * 2, height: r * 2, borderRadius: r });

const styles = StyleSheet.create({
  wrap: { flex: 1, paddingHorizontal: 20, width: '100%', maxWidth: 560, alignSelf: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  hud: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  hudItem: { flex: 1, paddingVertical: 10, alignItems: 'center' },
  arena: { flex: 1, borderRadius: 30, borderWidth: 1, overflow: 'hidden' },
  circle: { position: 'absolute', shadowOpacity: 0.8, shadowRadius: 12, shadowOffset: { width: 0, height: 0 }, elevation: 6 },
  bug: { position: 'absolute', alignItems: 'center', justifyContent: 'center' },
  overlay: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  play: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 26, height: 52, borderRadius: 26, marginTop: 20 },
});
