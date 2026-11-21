// 3 тоглоомыг нэг дор нээх "Arcade" хост.
import React from 'react';
import { GameFrame } from './GameFrame';
import OrbRush from './OrbRush';
import SpaceDodger from './SpaceDodger';
import Snake from './Snake';
import { photos } from '../data/photos';

export type GameId = 'orb' | 'space' | 'snake';

const GAMES: Record<GameId, { title: string; kicker: string; bg: any; Comp: React.ComponentType }> = {
  orb: { title: 'Orb Rush', kicker: '🎮 GAME 01 · TILT', bg: photos.arcade, Comp: OrbRush },
  space: { title: 'Space Dodger', kicker: '🚀 GAME 02 · SPACE', bg: photos.space, Comp: SpaceDodger },
  snake: { title: 'Snake', kicker: '🐍 GAME 03 · SWIPE', bg: photos.retro, Comp: Snake },
};

export default function GameHost({ game, onClose }: { game: GameId | null; onClose: () => void }) {
  const g = game ? GAMES[game] : null;
  return (
    <GameFrame visible={!!g} onClose={onClose} title={g?.title ?? ''} kicker={g?.kicker ?? ''} bg={g?.bg}>
      {g && <g.Comp key={game} />}
    </GameFrame>
  );
}
