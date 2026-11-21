// Пиксел арт зургууд (scripts/sprites/*.py кодоор үүсгэсэн).
// w, h — art пикселийн хэмжээ. Дэлгэц дээр PX дахин томруулж харуулна.
export const PX = 3; // 1 art пиксел = 3 логик пиксел

export const S = {
  bush_a: { src: require('../../assets/sprites/bush_a.png'), w: 26, h: 18 },
  bush_b: { src: require('../../assets/sprites/bush_b.png'), w: 26, h: 18 },
  fence: { src: require('../../assets/sprites/fence.png'), w: 40, h: 14 },
  flower_pink: { src: require('../../assets/sprites/flower_pink.png'), w: 5, h: 6 },
  flower_white: { src: require('../../assets/sprites/flower_white.png'), w: 5, h: 6 },
  gate: { src: require('../../assets/sprites/gate.png'), w: 30, h: 26 },
  ger: { src: require('../../assets/sprites/ger.png'), w: 66, h: 52 },
  ger_lit: { src: require('../../assets/sprites/ger_lit.png'), w: 66, h: 52 },
  grass: { src: require('../../assets/sprites/grass.png'), w: 32, h: 32 },
  mush_blue: { src: require('../../assets/sprites/mush_blue.png'), w: 9, h: 9 },
  mush_red: { src: require('../../assets/sprites/mush_red.png'), w: 9, h: 9 },
  ovoo: { src: require('../../assets/sprites/ovoo.png'), w: 46, h: 50 },
  rider_0: { src: require('../../assets/sprites/rider_0.png'), w: 60, h: 60 },
  rider_1: { src: require('../../assets/sprites/rider_1.png'), w: 60, h: 60 },
  rider_2: { src: require('../../assets/sprites/rider_2.png'), w: 60, h: 60 },
  rider_3: { src: require('../../assets/sprites/rider_3.png'), w: 60, h: 60 },
  rider_4: { src: require('../../assets/sprites/rider_4.png'), w: 60, h: 60 },
  rider_5: { src: require('../../assets/sprites/rider_5.png'), w: 60, h: 60 },
  rider_idle: { src: require('../../assets/sprites/rider_idle.png'), w: 60, h: 60 },
  road: { src: require('../../assets/sprites/road.png'), w: 48, h: 26 },
  rock: { src: require('../../assets/sprites/rock.png'), w: 14, h: 9 },
  sheep_0: { src: require('../../assets/sprites/sheep_0.png'), w: 20, h: 15 },
  sheep_1: { src: require('../../assets/sprites/sheep_1.png'), w: 20, h: 15 },
  sign: { src: require('../../assets/sprites/sign.png'), w: 34, h: 34 },
  sulde: { src: require('../../assets/sprites/sulde.png'), w: 30, h: 72 },
  tree_a: { src: require('../../assets/sprites/tree_a.png'), w: 44, h: 58 },
  tree_b: { src: require('../../assets/sprites/tree_b.png'), w: 44, h: 58 },
  tuft: { src: require('../../assets/sprites/tuft.png'), w: 9, h: 6 },
};
export type SpriteKey = keyof typeof S;
