// Утасны хурдатгал мэдрэгч (Accelerometer) ашигласан 2 hook.
import { useEffect, useRef } from 'react';
import { Animated, Platform } from 'react-native';
import { Accelerometer } from 'expo-sensors';

/**
 * useTilt — утсыг хазайлгахад -1..1 хооронд утга буцаана.
 * Арын гэрлийн бөмбөлгүүдийг (parallax) хөдөлгөхөд ашиглана.
 */
export function useTilt() {
  const tilt = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;

  useEffect(() => {
    if (Platform.OS === 'web') return; // компьютерт мэдрэгч байхгүй
    Accelerometer.setUpdateInterval(60);
    const sub = Accelerometer.addListener(({ x, y }) => {
      Animated.spring(tilt, {
        toValue: { x: clamp(x), y: clamp(y) },
        useNativeDriver: true,
        speed: 6,
        bounciness: 0,
      }).start();
    });
    return () => sub.remove();
  }, [tilt]);

  return tilt;
}

/**
 * useShake — утсыг хүчтэй сэгсрэхэд onShake-г дуудна.
 * Хурдатгалын нийт хэмжээ (x²+y²+z²) 1g-ээс их зөрвөл "сэгсэрлээ" гэж үзнэ.
 */
export function useShake(onShake: () => void, enabled = true) {
  const last = useRef(0);
  const cb = useRef(onShake);
  cb.current = onShake;

  useEffect(() => {
    if (!enabled || Platform.OS === 'web') return;
    Accelerometer.setUpdateInterval(60);
    const sub = Accelerometer.addListener(({ x, y, z }) => {
      const force = Math.sqrt(x * x + y * y + z * z);
      const now = Date.now();
      if (force > 2.3 && now - last.current > 1500) {
        last.current = now;
        cb.current();
      }
    });
    return () => sub.remove();
  }, [enabled]);
}

const clamp = (v: number) => Math.max(-1, Math.min(1, v));
