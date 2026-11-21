# 🏠 Ochiko OS — Д.Очиржанцаны портфолио апп

> SWM231 · Mobile Programming · Бүтээлч ажил
> **Д.Очиржанцан** · Оюутны код: **B23FA1235**
> Санхүү Эдийн Засгийн Их Сургууль · Мэдээллийн систем · 4-р курс
> Мөрөөдөл: өөрийн тоглоомоо бүтээх 🎮

Миний портфолиог **ухаалаг гэрийн удирдлагын апп** хэлбэрээр хийсэн. Апп-ын хэсэг бүр нэг "өрөө", ур чадвар бүр нэг "төхөөрөмж", бүтээл бүр нэг "CCTV камер" болж харагдана. Би тоглоом хийхийг мөрөөддөг ч өмнө нь хийж байгаагүй. Тиймээс энэ апп дотроо **анхны 3 жижиг тоглоомоо** бүтээж, бүтээлүүдийн хэсэгт байрлуулсан — тус бүр нь утасны өөр өөр боломжийг (хазайлт, хуруугаар чирэх, swipe) ашигладаг. Мөрөөдлийн тоглоом маань "🔒 Locked" түвшин болж хүлээж байна.

## 🎮 3 тоглоом (Бүтээлүүд)

| Тоглоом | Удирдлага | Юу хэрэгжүүлсэн |
|---|---|---|
| **Orb Rush** (`src/games/OrbRush.tsx`) | Утсаа хазайлгах | Accelerometer → хүч → хурд → байрлал, үрэлт, хананаас ойх, мөргөлдөөн |
| **Space Dodger** (`src/games/SpaceDodger.tsx`) | Хазайлгах / чирэх | Санамсаргүй солир, хүндрэл нэмэгдэх, 3 амь, invincibility, parallax од |
| **Snake** (`src/games/Snake.tsx`) | Swipe | Grid логик, урт нэмэгдэх, хурдсах, эсрэг эргэлтийг хориглох |

Бүгд `requestAnimationFrame` / `setTimeout` дээр суурилсан **game loop**-той, `GameFrame.tsx` нийтлэг хүрээг (HUD, эхлэх/дуусах цонх) хуваалцдаг.

## ✨ Бүтээлч санаа

| Санаа | Хаана | Хэрхэн хэрэгжүүлсэн |
|---|---|---|
| **Boot / splash дэлгэц** | `Boot.tsx` | "Ochiko OS" терминал маягаар ачаалж, `>>>` товчийг гулсуулж нэвтэрнэ |
| **Жинхэнэ зурган дэвсгэр** | `ui.tsx → Background` | Хэсэг бүр өөрийн сэдэвтэй зурагтай, таб солигдоход зураг crossfade хийнэ |
| **Хазайлтын parallax** | `ui.tsx → Background` | `Accelerometer`-ийн утгаар арын зургийг хөдөлгөж гүний мэдрэмж өгнө |
| **Шилжилт** | `App.tsx`, `Reveal/Stagger` | Таб солих үед чиглэлтэй slide, блокууд дараалан доороос гарч ирнэ |
| **Warm / Neutral / Cold** | `MoodSwitch` | Гэрийн температур сонгогч шиг — апп-ын accent өнгийг бүхэлд нь солино |
| **Night mode** | `Toggle` + `theme.tsx` | Dark / light горим, Context API-аар бүх дэлгэцэнд дамжина |
| **Ур чадвар = төхөөрөмж** | `About.tsx` | Карт дарахад асаж/унтарч, түвшний шугам анимэйшнтайгаар дүүрнэ |
| **Level map замнал** | `About.tsx` | Сурсан замналаа тоглоомын Lv1→Lv5 түвшин шиг харуулсан |
| **CCTV камер карт** | `Projects.tsx` | Swipe carousel, голын карт томорно, "Live" анивчдаг шошго |
| **Bottom sheet** | `ProjectSheet` | Бүтээл дээр дарахад доороос дэлгэрэнгүй цонх гарна |
| **Swipe-to-action товч** | `SwipeButton` | `PanResponder`-ээр хуруугаар гулсуулж имэйл/холбоос нээнэ |
| **Haptic чичиргээ** | `expo-haptics` | Бүх товч, таб, оноо авахад чичирнэ |
| **🥚 Easter egg** | `useShake` | **Утсаа сэгсрэх** эсвэл **аватарыг 5 дарахад** нээгдэнэ. Утсаа хазайлгаж бөмбөгөө удирдаад орб цуглуулж, 🐞 bug-аас зайлсхийнэ |

## 📋 Заавал байх 5 зүйл

1. **Танилцуулга** — Нүүр дэлгэцэнд нэр, чиглэл (Game Developer), нэг өгүүлбэр
2. **Миний тухай ба ур чадвар** — Намтар, HTML / CSS / JavaScript / C# / React Native
3. **Бүтээлүүд** — 3 тоглоом (Orb Rush, Space Dodger, Snake — апп дотроос шууд тоглоно), Ochiko OS, мөрөөдлийн тоглоом (locked). Карт бүр бодит дэлгэцийн зурагтай
4. **Холбоо барих** — Имэйл, утас, GitHub, Facebook, Instagram (`Linking.openURL`)
5. **Responsive** — `useWindowDimensions`, хувь хэмжээ, `maxWidth: 520`; Expo линк / APK-аар нээгдэнэ

## 🛠 Ашигласан сангууд

- `expo`, `react-native`, TypeScript
- `expo-sensors` — Accelerometer (хазайлт, сэгсрэлт, тоглоом)
- `expo-haptics` — чичиргээ
- `expo-linear-gradient` — арын градиент
- `react-native-safe-area-context` — notch / home indicator-ийн зай
- `@expo/vector-icons` — Ionicons дүрс
- React Native-ийн өөрийн `Animated`, `PanResponder`, `Modal`, `FlatList`

Navigation сан ашиглаагүй — табуудыг `useState` + fade анимэйшнаар өөрөө хийсэн.

## 📁 Бүтэц

```
App.tsx                 # Үндсэн бүтэц, таб, сэгсрэлт
src/
  data/profile.ts       # ⭐ БҮХ МЭДЭЭЛЭЛ ЭНД (нэр, skill, бүтээл, холбоос)
  theme.tsx             # Өнгө, dark/light, Warm/Neutral/Cold
  hooks/useSensors.ts   # useTilt, useShake
  components/ui.tsx     # Glass карт, Toggle, Pill, SwipeButton...
  screens/              # Boot, Home, About, Projects, Contact
  games/                # GameFrame, OrbRush, SpaceDodger, Snake
assets/projects/        # Бүтээлийн зургууд (тоглоомын дэлгэцийн зураг)
assets/photos/          # Арын дэвсгэрийн зургууд (npm run photos)
```

## ▶️ Ажиллуулах

```bash
npm install
npm run photos          # Unsplash-аас арын дэвсгэрийн зургуудыг татна (нэг удаа)
npx expo start          # Утсан дээрх Expo Go-гоор QR уншуулна
npx expo start --tunnel # Өөр сүлжээнд байгаа хүнд үзүүлэх бол
```

### APK гаргах (EAS Build)

```bash
npm install -g eas-cli
eas login               # expo.dev дээр бүртгэлээрээ нэвтэрнэ
eas build -p android --profile preview
```
Build дуусахад гарах холбоосоор APK-аа татаж авна.

## 🎨 Дизайны эх сурвалж

Харагдах байдлыг (бараан шилэн карт, улбар шар accent, toggle, `>>>` товч) Dribbble дээрх
[Hume – Mobile App Design for Smart Home](https://dribbble.com/shots/26559633-Hume-Mobile-App-Design-for-Smart-Home)
(Phenomenon Studio) дизайнаас санаа авсан. Бүх код, тоглоомууд болон бүтээлийн зургийг (тоглоомын бодит дэлгэцийн зураг) өөрөө хийсэн.

### Зургийн эх сурвалж (Unsplash License — үнэгүй)
Арын дэвсгэрийн зургууд [Unsplash](https://unsplash.com)-аас: неон тоглоомын өрөө (`photo-1616588589676`),
код бичиж буй ширээ (`photo-1759661990336`), аркад машинууд (`photo-1511512578047`), Orion мананцар (`photo-1516331138075`),
ретро аркад (`photo-1572289758057`), шөнийн неон гудамж (`photo-1608690158878`). `scripts/download-photos.js` файлд холбоос нь бий.
AI хэрэгслийн тусламж авсан (хичээлийн журмын дагуу зөвшөөрөгдсөн).
