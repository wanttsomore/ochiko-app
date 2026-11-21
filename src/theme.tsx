// Апп-ын өнгө, горимыг нэг дор удирдах Context.
// "Warm / Neutral / Cold" — ухаалаг гэрийн температур сонгогч шиг accent өнгийг сольдог.
// "Night mode" — dark / light горим.
import React, { createContext, useContext, useMemo, useState } from 'react';

export type Mood = 'warm' | 'neutral' | 'cold';

const ACCENTS: Record<Mood, string> = {
  warm: '#FF5A1F', // Hume дизайны улбар шар
  neutral: '#E9B44C',
  cold: '#4FA3FF',
};

export type Theme = {
  dark: boolean;
  mood: Mood;
  accent: string;
  bgTop: string;
  bgBottom: string;
  text: string;
  muted: string;
  glass: string;
  glassStrong: string;
  border: string;
  track: string;
};

function buildTheme(dark: boolean, mood: Mood): Theme {
  return dark
    ? {
        dark, mood, accent: ACCENTS[mood],
        bgTop: '#3A3A3C', bgBottom: '#111112',
        text: '#FFFFFF', muted: 'rgba(255,255,255,0.55)',
        glass: 'rgba(255,255,255,0.07)', glassStrong: 'rgba(255,255,255,0.13)',
        border: 'rgba(255,255,255,0.12)', track: 'rgba(255,255,255,0.12)',
      }
    : {
        dark, mood, accent: ACCENTS[mood],
        bgTop: '#F4F4F5', bgBottom: '#CFCFD4',
        text: '#141416', muted: 'rgba(20,20,22,0.55)',
        glass: 'rgba(255,255,255,0.55)', glassStrong: 'rgba(255,255,255,0.85)',
        border: 'rgba(0,0,0,0.07)', track: 'rgba(0,0,0,0.08)',
      };
}

type Ctx = {
  theme: Theme;
  setDark: (v: boolean) => void;
  setMood: (m: Mood) => void;
};

const ThemeContext = createContext<Ctx | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(true);
  const [mood, setMood] = useState<Mood>('warm');
  const value = useMemo(() => ({ theme: buildTheme(dark, mood), setDark, setMood }), [dark, mood]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
