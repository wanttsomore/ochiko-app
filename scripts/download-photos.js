// Unsplash-аас арын дэвсгэрийн жинхэнэ зургуудыг татаж assets/photos/ руу хадгална.
// Ажиллуулах: npm run photos   (Node 18+ хэрэгтэй)
// Зургууд Unsplash License-тэй — үнэгүй ашиглаж болно. Эх сурвалжийг README-д дурдсан.
const fs = require('fs');
const path = require('path');

const PHOTOS = {
  home: '1616588589676-62b3bd4ff6d2', // неон гэрэлтэй тоглоомын өрөө
  about: '1759661990336-51bd4b951fea', // код бичиж буй ширээ
  arcade: '1511512578047-dfb367046420', // аркад машинууд
  space: '1516331138075-f3adc1e149cd', // мананцар (nebula)
  retro: '1572289758057-3e0f4327833b', // ретро аркад
  city: '1608690158878-1a96b29b455b', // шөнийн неон гудамж
  steppe: '1547448161-c56e75b54317', // нар жаргах үеийн гэр хороолол, уулс
  ger: '1695554477492-303aacd40561', // хээтэй гэрийн хаалга
  dream: '1547448271-fde9cf7d6afc', // үдшийн тал нутаг дахь гэрүүд
};

(async () => {
  const dir = path.join(__dirname, '..', 'assets', 'photos');
  fs.mkdirSync(dir, { recursive: true });
  for (const [name, id] of Object.entries(PHOTOS)) {
    const url = `https://images.unsplash.com/photo-${id}?w=1080&q=72&fm=jpg&fit=crop`;
    process.stdout.write(`↓ ${name}.jpg ... `);
    const res = await fetch(url);
    if (!res.ok) { console.log('алдаа', res.status); continue; }
    fs.writeFileSync(path.join(dir, `${name}.jpg`), Buffer.from(await res.arrayBuffer()));
    console.log('ok');
  }
  console.log('✓ Бүх зураг татагдлаа');
})();
