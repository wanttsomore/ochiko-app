// Морьтон дүр — пиксел арт фреймүүдийг ээлжлэн харуулж давхих анимэйшн үүсгэнэ.
// Бүх фреймийг давхарлаж байрлуулаад зөвхөн идэвхтэйг нь харуулна (зураг солигдохдоо анивчихгүй).
import React, { useEffect, useState } from 'react';
import { Image, View } from 'react-native';
import { PX, S } from './sprites';
import { sfx } from '../sound';

const FRAMES = [S.rider_0, S.rider_1, S.rider_2, S.rider_3, S.rider_4, S.rider_5];


export default function Rider({ walking, facing, scale = 1 }: { walking: boolean; facing: 1 | -1; scale?: number }) {
  const [f, setF] = useState(0);
  const W = S.rider_0.w * PX * scale, H = S.rider_0.h * PX * scale;

  // Давхиж байхад 85мс тутам дараагийн фрейм
  useEffect(() => {
    if (!walking) return;
    const t = setInterval(() => setF((v) => {
      const n = (v + 1) % FRAMES.length;
      if (n === 2 || n === 5) sfx('hoof'); // хөл газар хүрэх фреймүүд дээр туурайн чимээ
      return n;
    }), 85);
    return () => clearInterval(t);
  }, [walking]);

  return (
    <View style={{ width: W, height: H, transform: [{ scaleX: facing }] }}>
      <Image source={S.rider_idle.src} style={{ position: 'absolute', width: W, height: H, opacity: walking ? 0 : 1 }} />
      {FRAMES.map((fr, i) => (
        <Image key={i} source={fr.src} style={{ position: 'absolute', width: W, height: H, opacity: walking && i === f ? 1 : 0 }} />
      ))}
    </View>
  );
}
