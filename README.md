# 🏠 Ochiko OS — Д.Очиржанцаны портфолио апп

> SWM231 · Mobile Programming · Бүтээлч ажил
> **Д.Очиржанцан** · Оюутны код: **B23FA1235** · Чиглэл: Тоглоом хөгжүүлэлт 🎮

Миний портфолиог **ухаалаг гэрийн удирдлагын апп** хэлбэрээр хийсэн. Апп-ын хэсэг бүр нэг "өрөө", ур чадвар бүр нэг "төхөөрөмж", бүтээл бүр нэг "CCTV камер" болж харагдана. Тоглоом хөгжүүлэх сонирхолтой учраас утсаа сэгсрэхэд утсаа хазайлгаж тоглодог **нууц тоглоомын өрөө** нээгдэнэ.

## ✨ Бүтээлч санаа

| Санаа | Хаана | Хэрхэн хэрэгжүүлсэн |
|---|---|---|
| **Boot / splash дэлгэц** | `Boot.tsx` | "Ochiko OS" терминал маягаар ачаалж, `>>>` товчийг гулсуулж нэвтэрнэ |
| **Хазайлтын parallax** | `ui.tsx → Background` | `Accelerometer`-ийн утгаар арын гэрлүүдийг хөдөлгөж гүний мэдрэмж өгнө |
| **Warm / Neutral / Cold** | `MoodSwitch` | Гэрийн температур сонгогч шиг — апп-ын accent өнгийг бүхэлд нь солино |
| **Night mode** | `Toggle` + `theme.tsx` | Dark / light горим, Context API-аар бүх дэлгэцэнд дамжина |
| **Ур чадвар = төхөөрөмж** | `About.tsx` | Карт дарахад асаж/унтарч, түвшний шугам анимэйшнтайгаар дүүрнэ |
| **Level map замнал** | `About.tsx` | Сурсан замналаа тоглоомын Lv1→Lv5 түвшин шиг харуулсан |
| **CCTV камер карт** | `Projects.tsx` | Swipe carousel, голын карт томорно, "Live" анивчдаг шошго |
| **Bottom sheet** | `ProjectSheet` | Бүтээл дээр дарахад доороос дэлгэрэнгүй цонх гарна |
| **Swipe-to-action товч** | `SwipeButton` | `PanResponder`-ээр хуруугаар гулсуулж имэйл/холбоос нээнэ |
| **Haptic чичиргээ** | `expo-haptics` | Бүх товч, таб, оноо авахад чичирнэ |
| **🥚 Easter egg: Orb Rush** | `GameRoom.tsx` | **Утсаа сэгсрэх** эсвэл **аватарыг 5 дарахад** нээгдэнэ. Утсаа хазайлгаж бөмбөгөө удирдаад орб цуглуулж, 🐞 bug-аас зайлсхийнэ |

## 📋 Заавал байх 5 зүйл

1. **Танилцуулга** — Нүүр дэлгэцэнд нэр, чиглэл (Game Developer), нэг өгүүлбэр
2. **Миний тухай ба ур чадвар** — Намтар, HTML / CSS / JavaScript / C# / React Native
3. **Бүтээлүүд** — 4 бүтээл: зураг, тайлбар, холбоос
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
  screens/              # Boot, Home, About, Projects, Contact, GameRoom
assets/projects/        # Бүтээлийн зургууд
```

## ▶️ Ажиллуулах

```bash
npm install
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
(Phenomenon Studio) дизайнаас санаа авсан. Бүх код болон бүтээлийн зургийг өөрөө хийсэн.
AI хэрэгслийн тусламж авсан (хичээлийн журмын дагуу зөвшөөрөгдсөн).
