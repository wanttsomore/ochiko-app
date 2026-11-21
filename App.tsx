// Ochiko — Д.Очиржанцаны портфолио тоглоом (React Native + Expo)
// Бүтэц: Boot (гарчгийн дэлгэц) → World (тал нутгийн аялал, 8 түвшин, 3 тоглоом).
import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/theme';
import Boot from './src/screens/Boot';
import World from './src/world/World';
import { photos } from './src/data/photos';

export default function App() {
  const [started, setStarted] = useState(false);
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <StatusBar style="light" />
        {started ? <World /> : <Boot onDone={() => setStarted(true)} bg={photos.steppe} />}
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
