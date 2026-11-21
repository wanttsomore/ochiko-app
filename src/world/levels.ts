// Тоглоомын ертөнцийн түвшнүүд. Морьтон баруун тийш аялах тусам дараалан нээгдэнэ.
// x — тал нутаг дээрх байрлал (пиксел).
import type { GameId } from '../games';

export type LevelKind = 'start' | 'about' | 'skills' | 'game' | 'contact' | 'dream';

export type Level = {
  id: string;
  kind: LevelKind;
  title: string; // самбар дээрх нэр
  sub: string; // жижиг тайлбар
  x: number;
  game?: GameId;
};

const START = 330;
const GAP = 520; // хоёр түвшний хоорондох зай

const defs: Omit<Level, 'x'>[] = [
  { id: 'start', kind: 'start', title: 'Эхлэл', sub: 'Танилцуулга' },
  { id: 'about', kind: 'about', title: 'Миний түүх', sub: 'Миний тухай' },
  { id: 'skills', kind: 'skills', title: 'Ур чадвар', sub: 'Технологиуд' },
  { id: 'orb', kind: 'game', title: 'Orb Rush', sub: 'Тоглоом 01', game: 'orb' },
  { id: 'space', kind: 'game', title: 'Space Dodger', sub: 'Тоглоом 02', game: 'space' },
  { id: 'snake', kind: 'game', title: 'Snake', sub: 'Тоглоом 03', game: 'snake' },
  { id: 'contact', kind: 'contact', title: 'Холбоо барих', sub: 'Элч' },
  { id: 'dream', kind: 'dream', title: 'Мөрөөдөл', sub: 'Монголын түүхэн тоглоом' },
];

export const LEVELS: Level[] = defs.map((d, i) => ({ ...d, x: START + i * GAP }));
export const WORLD_W = LEVELS[LEVELS.length - 1].x + 520;
export const NEAR = 90; // морьтон түвшинд хэр ойртвол "Орох" идэвхжих вэ
