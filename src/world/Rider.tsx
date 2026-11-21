// Морьтон дүр — морь, хүнийг SVG-ээр зурж, хөлийг нь RN Animated-аар хөдөлгөнө.
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import Svg, { Circle, Ellipse, Line, Path, Polygon, Rect } from 'react-native-svg';

const W = 120, H = 106;
const HORSE = '#8B5A2B', DARK = '#2B1A10';

export default function Rider({ walking, facing, deel, scale = 1 }: { walking: boolean; facing: 1 | -1; deel: string; scale?: number }) {
  const t = useRef(new Animated.Value(0)).current;

  // Явж байх үед хөл, бие давтагдан хөдөлнө (loop)
  useEffect(() => {
    if (!walking) {
      t.stopAnimation();
      Animated.timing(t, { toValue: 0, duration: 150, useNativeDriver: true }).start();
      return;
    }
    const loop = Animated.loop(Animated.timing(t, { toValue: 1, duration: 420, easing: Easing.linear, useNativeDriver: true }));
    loop.start();
    return () => loop.stop();
  }, [walking, t]);

  // 0→1 мөчлөгийг хөлийн эргэлт болгон хувиргана (урд, хойд хөл эсрэг фазтай)
  const swing = (phase: number) =>
    t.interpolate({
      inputRange: [0, 0.25, 0.5, 0.75, 1],
      outputRange: [0, 1, 0, -1, 0].map((v, i, a) => `${a[(i + phase) % 4] * 30}deg`),
    });
  const bob = t.interpolate({ inputRange: [0, 0.25, 0.5, 0.75, 1], outputRange: [0, -4, 0, -4, 0] });

  const legs = [
    { x: 38, phase: 0 }, { x: 46, phase: 2 }, // хойд хөл
    { x: 74, phase: 1 }, { x: 82, phase: 3 }, // урд хөл
  ];

  return (
    <View style={{ width: W * scale, height: H * scale, transform: [{ scaleX: facing }] }}>
      <View style={{ width: W, height: H, transform: [{ scale }], transformOrigin: 'top left' }}>
        <Svg width={W} height={H} style={StyleSheet.absoluteFill}>
          <Ellipse cx={60} cy={101} rx={34} ry={4} fill="rgba(0,0,0,0.28)" />
        </Svg>
        {legs.map((l, i) => (
          <Animated.View key={i} style={[styles.leg, { left: l.x, transform: [{ rotate: swing(l.phase) }] }]}>
            <View style={styles.hoof} />
          </Animated.View>
        ))}
        <Animated.View style={[StyleSheet.absoluteFill, { transform: [{ translateY: bob }] }]}>
          <Svg width={W} height={H} viewBox="0 -8 120 106">
            {/* Морь */}
            <Path d="M30 48 Q12 52 10 78 Q20 66 31 58 Z" fill={DARK} />
            <Ellipse cx={58} cy={54} rx={31} ry={14} fill={HORSE} />
            <Polygon points="78,48 88,22 99,24 92,58" fill={HORSE} />
            <Path d="M88 19 L105 23 Q114 28 111 35 L101 37 L92 31 Z" fill={HORSE} />
            <Polygon points="92,21 94,12 98,22" fill={HORSE} />
            <Path d="M86 21 Q79 36 77 48 L83 48 Q86 34 92 21 Z" fill={DARK} />
            <Circle cx={101} cy={27} r={1.4} fill={DARK} />
            {/* Эмээл */}
            <Rect x={47} y={38} width={22} height={7} rx={3} fill="#C8502A" />
            {/* Хүн: гутал, дээл, бүс, гар, толгой, малгай */}
            <Path d="M57 42 L60 56 L67 58 L67 54 L63 52 L61 41 Z" fill="#3A2416" />
            <Path d="M49 42 L67 42 L64 18 L53 18 Z" fill={deel} />
            <Rect x={50} y={31} width={16} height={4} fill="#F3B23C" />
            <Path d="M61 22 L77 33" stroke={deel} strokeWidth={5} strokeLinecap="round" />
            <Line x1={77} y1={33} x2={101} y2={31} stroke={DARK} strokeWidth={1} />
            <Circle cx={58.5} cy={12} r={5.5} fill="#E8B98A" />
            <Path d="M51 9.5 L66 9.5 L58.5 -3 Z" fill="#B3262B" />
            <Rect x={50} y={8} width={17} height={3.5} rx={1.5} fill="#2A1C14" />
            <Circle cx={58.5} cy={-3.5} r={1.8} fill="#F3B23C" />
          </Svg>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  leg: { position: 'absolute', top: 62, width: 5, height: 34, borderRadius: 2, backgroundColor: '#6E4520', transformOrigin: 'top' },
  hoof: { position: 'absolute', bottom: 0, width: 5, height: 5, backgroundColor: DARK, borderRadius: 1 },
});
