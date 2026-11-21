// Тэнгэр, уулс, газрын өнгө. Warm = үдэш, Neutral = өдөр, Cold = өвөл, Night = шөнө.
import type { Mood } from '../theme';

export type Palette = {
  sky: [string, string, string, string];
  sun: string;
  far: string;
  mid: string;
  hills: string;
  ground: [string, string];
  road: string;
  grass: string;
  cloud: string;
  night: boolean;
};

const P: Record<Mood | 'night', Palette> = {
  warm: {
    sky: ['#2A1B3D', '#6E3B63', '#E8653A', '#FFB46A'],
    sun: '#FFD7A0', far: '#7A4566', mid: '#563052', hills: '#3A2140',
    ground: ['#2B1A2F', '#1A101D'], road: '#4A2E45', grass: '#5E3A55', cloud: 'rgba(255,200,170,0.35)', night: false,
  },
  neutral: {
    sky: ['#3F8FD6', '#7DBDEB', '#BFE2F5', '#F3E9C8'],
    sun: '#FFF6CF', far: '#93AFC4', mid: '#7A9E6E', hills: '#5D8A4E',
    ground: ['#4C7A3E', '#36592C'], road: '#B79466', grass: '#6E9E55', cloud: 'rgba(255,255,255,0.8)', night: false,
  },
  cold: {
    sky: ['#4E6F91', '#8FAECB', '#C9DBEA', '#EEF4F8'],
    sun: '#FFFFFF', far: '#B9CCDD', mid: '#93AEC6', hills: '#DCE7F0',
    ground: ['#EEF3F7', '#D3DEE8'], road: '#BAC8D6', grass: '#C9D6E2', cloud: 'rgba(255,255,255,0.7)', night: false,
  },
  night: {
    sky: ['#070B1E', '#111A3A', '#1E2753', '#2E3566'],
    sun: '#F4F1E1', far: '#2A3363', mid: '#1E254C', hills: '#151B38',
    ground: ['#12172F', '#0A0E20'], road: '#252D52', grass: '#1E2648', cloud: 'rgba(160,170,220,0.18)', night: true,
  },
};

export const getPalette = (mood: Mood, night: boolean) => (night ? P.night : P[mood]);
