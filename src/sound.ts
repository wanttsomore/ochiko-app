// Дууны эффектүүд (scripts/sounds/make_sounds.py кодоор үүсгэсэн WAV файлууд).
// sfx('coin') гэж дуудахад тухайн дуу тоглогдоно. Тохиргооноос дууг унтрааж болно.
//
// Хоцрохгүй (зөрөхгүй) байлгах арга:
//  - Дуу бүрд 3 тоглуулагч (pool) бэлдэнэ → хурдан давтагдсан дуу бие биенээ хүлээхгүй.
//  - Тоглуулагч дуусмагц тэр даруй эхэнд нь буцаана (seekTo(0)) → дараагийн удаа play() шууд эхэлнэ.
import { createAudioPlayer, setAudioModeAsync, AudioPlayer } from 'expo-audio';

const FILES = {
  hoof: require('../assets/sounds/hoof.wav'),
  click: require('../assets/sounds/click.wav'),
  blip: require('../assets/sounds/blip.wav'),
  open: require('../assets/sounds/open.wav'),
  levelup: require('../assets/sounds/levelup.wav'),
  bump: require('../assets/sounds/bump.wav'),
  coin: require('../assets/sounds/coin.wav'),
  hit: require('../assets/sounds/hit.wav'),
  beep: require('../assets/sounds/beep.wav'),
  go: require('../assets/sounds/go.wav'),
  over: require('../assets/sounds/over.wav'),
};
export type Sfx = keyof typeof FILES;

const VOLUME: Partial<Record<Sfx, number>> = { hoof: 0.45, click: 0.3 };
const POOL = 3;

type Voice = { p: AudioPlayer; ready: boolean };
const voices: Partial<Record<Sfx, Voice[]>> = {};
const next: Partial<Record<Sfx, number>> = {};
let enabled = true;
let started = false;

// Апп эхлэхэд нэг удаа бүх дууг ачаална
export function initSound() {
  if (started) return;
  started = true;
  setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});
  (Object.keys(FILES) as Sfx[]).forEach((k) => {
    voices[k] = [];
    for (let i = 0; i < POOL; i++) {
      try {
        const p = createAudioPlayer(FILES[k]);
        p.volume = VOLUME[k] ?? 0.8;
        const v: Voice = { p, ready: true };
        // Дуусмагц эхэнд нь буцааж, дахин тоглоход бэлэн болгоно
        p.addListener('playbackStatusUpdate', (s) => {
          if (s.didJustFinish) {
            p.seekTo(0).then(() => { v.ready = true; }).catch(() => { v.ready = true; });
          }
        });
        voices[k]!.push(v);
      } catch {}
    }
  });
}

export function sfx(name: Sfx) {
  if (!enabled) return;
  const list = voices[name];
  if (!list || list.length === 0) return;
  // Бэлэн байгаа (эхэнд нь байгаа) тоглуулагчийг сонгоно
  let v = list.find((x) => x.ready);
  if (!v) {
    // Бүгд тоглож байвал хамгийн эртний нэгийг нь эхнээс нь дахин эхлүүлнэ
    const i = (next[name] ?? 0) % list.length;
    next[name] = i + 1;
    v = list[i];
    v.p.seekTo(0).catch(() => {});
  }
  v.ready = false;
  try { v.p.play(); } catch {}
}

export const setSoundEnabled = (v: boolean) => { enabled = v; };
export const isSoundEnabled = () => enabled;
