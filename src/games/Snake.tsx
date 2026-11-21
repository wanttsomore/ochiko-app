// Тоглоом 3 — Snake
// Сум товч эсвэл дэлгэц дээр хуруугаа гүйлгэж (swipe) могойгоо эргүүлнэ.
// Хоол идэх бүрт урт нь нэмэгдэж, хурдасна. Хана эсвэл өөрийгөө мөргөвөл тоглоом дуусна.
import React, { useEffect, useRef, useState } from 'react';
import { PanResponder, StyleSheet, View } from 'react-native';
import { success, thud, tap } from '../components/ui';
import { useTheme } from '../theme';
import { Arena, Controls, HUD, Overlay, Phase, useArena } from './GameFrame';

const COLS = 14;
type Cell = { x: number; y: number };
type Dir = 'up' | 'down' | 'left' | 'right';
const STEP: Record<Dir, Cell> = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } };
const OPPOSITE: Record<Dir, Dir> = { up: 'down', down: 'up', left: 'right', right: 'left' };

export default function Snake({ onFinish }: { onFinish?: (score: number) => void }) {
  const { theme } = useTheme();
  const { size, onLayout } = useArena();
  const [phase, setPhase] = useState<Phase>('ready');
  const [, setFrame] = useState(0);
  const [best, setBest] = useState(0);

  const snake = useRef<Cell[]>([]);
  const food = useRef<Cell>({ x: 5, y: 5 });
  const dir = useRef<Dir>('right');
  const nextDir = useRef<Dir>('right');
  const score = useRef(0);

  // Талбайн хэмжээнээс нүдний хэмжээ, мөрийн тоог тооцно
  const cell = Math.floor((size.current.w || 300) / COLS);
  const rows = Math.max(10, Math.floor((size.current.h || 400) / cell));

  const placeFood = () => {
    let f: Cell;
    do { f = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * rows) }; }
    while (snake.current.some((s) => s.x === f.x && s.y === f.y));
    food.current = f;
  };

  const start = () => {
    const midY = Math.floor(rows / 2);
    snake.current = [{ x: 5, y: midY }, { x: 4, y: midY }, { x: 3, y: midY }];
    dir.current = nextDir.current = 'right';
    score.current = 0;
    placeFood();
    setPhase('play');
  };

  // Game loop — "tick" бүрт могой 1 нүд урагшилна
  useEffect(() => {
    if (phase !== 'play') return;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      dir.current = nextDir.current;
      const head = snake.current[0];
      const nh = { x: head.x + STEP[dir.current].x, y: head.y + STEP[dir.current].y };

      // Мөргөлдөөн: хана эсвэл өөрийн бие
      const hitWall = nh.x < 0 || nh.y < 0 || nh.x >= COLS || nh.y >= rows;
      const hitSelf = snake.current.some((s) => s.x === nh.x && s.y === nh.y);
      if (hitWall || hitSelf) {
        thud(); setBest((b) => Math.max(b, score.current)); setPhase('over'); onFinish?.(score.current); return;
      }

      snake.current.unshift(nh); // толгойг урд нэмнэ
      if (nh.x === food.current.x && nh.y === food.current.y) {
        score.current++; success(); placeFood(); // идсэн бол сүүлийг хасахгүй → урт нэмэгдэнэ
      } else {
        snake.current.pop();
      }
      setFrame((f) => f + 1);
      timer = setTimeout(tick, Math.max(70, 150 - score.current * 4)); // идэх тусам хурдасна
    };
    timer = setTimeout(tick, 150);
    return () => clearTimeout(timer);
  }, [phase]); // eslint-disable-line react-hooks/exhaustive-deps

  // Swipe таних: хуруу аль тэнхлэгт илүү их хөдөлснөөр чиглэлийг сонгоно
  const turn = (d: Dir) => { if (d !== OPPOSITE[dir.current] && d !== nextDir.current) { nextDir.current = d; tap(); } };
  const pan = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, g) => {
      if (Math.abs(g.dx) < 18 && Math.abs(g.dy) < 18) return;
      if (Math.abs(g.dx) > Math.abs(g.dy)) turn(g.dx > 0 ? 'right' : 'left');
      else turn(g.dy > 0 ? 'down' : 'up');
    },
  })).current;

  const ox = ((size.current.w || 0) - cell * COLS) / 2; // талбайг голлуулах
  const oy = ((size.current.h || 0) - cell * rows) / 2;
  return (
    <>
      <HUD items={[{ label: 'Оноо', value: score.current }, { label: 'Урт', value: snake.current.length || 3 }, { label: 'Рекорд', value: best }]} />
      <Arena onLayout={onLayout} handlers={pan.panHandlers}>
        {/* Тор */}
        <View pointerEvents="none" style={{ position: 'absolute', left: ox, top: oy, width: cell * COLS, height: cell * rows }}>
          {Array.from({ length: COLS + 1 }, (_, i) => <View key={`v${i}`} style={[styles.gridV, { left: i * cell, backgroundColor: theme.border }]} />)}
          {Array.from({ length: rows + 1 }, (_, i) => <View key={`h${i}`} style={[styles.gridH, { top: i * cell, backgroundColor: theme.border }]} />)}
        </View>
        {phase !== 'ready' && (
          <View pointerEvents="none" style={{ position: 'absolute', left: ox, top: oy }}>
            <View style={[styles.food, { left: food.current.x * cell + cell * 0.2, top: food.current.y * cell + cell * 0.2, width: cell * 0.6, height: cell * 0.6, borderRadius: cell }]} />
            {snake.current.map((s, i) => (
              <View
                key={i}
                style={{
                  position: 'absolute', left: s.x * cell + 2, top: s.y * cell + 2, width: cell - 4, height: cell - 4,
                  borderRadius: i === 0 ? cell / 2.5 : cell / 4,
                  backgroundColor: i === 0 ? theme.accent : theme.dark ? '#EDEDF0' : '#2A2A2E',
                  opacity: 1 - (i / snake.current.length) * 0.45,
                }}
              />
            ))}
          </View>
        )}
        <Overlay phase={phase} icon="git-commit" score={score.current} best={best} onStart={start}
          intro="Доорх сум товчоор (эсвэл дэлгэц дээр хуруугаа гүйлгэж) могойгоо эргүүл. Шар хоол идэх тусам урт, хурдан болно." />
      </Arena>
      <Controls mode="dpad" onDown={(d) => turn(d)} />
    </>
  );
}

const styles = StyleSheet.create({
  gridV: { position: 'absolute', top: 0, bottom: 0, width: StyleSheet.hairlineWidth },
  gridH: { position: 'absolute', left: 0, right: 0, height: StyleSheet.hairlineWidth },
  food: { position: 'absolute', backgroundColor: '#FFC83D', shadowColor: '#FFC83D', shadowOpacity: 0.9, shadowRadius: 8, elevation: 4 },
});
