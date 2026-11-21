// =============================================================
//  ТАНЫ БҮХ МЭДЭЭЛЭЛ ЭНД БАЙНА.
//  Нэр, ур чадвар, бүтээл, холбоосоо зөвхөн энэ файлаас засна.
//  ⚠️  "TODO" гэсэн мөрүүдийг өөрийн жинхэнэ мэдээллээр солиорой.
// =============================================================

import { ImageSourcePropType } from 'react-native';

export const profile = {
  name: 'Д.Очиржанцан',
  nickname: 'Ochiko',
  studentId: 'B23FA1235',
  role: 'Aspiring Game Developer',
  // Нүүр дэлгэцийн нэг өгүүлбэр
  tagline: 'Өөрийн тоглоомоо бүтээхийг мөрөөддөг — анхны 3 тоглоомоо яг энэ апп дотор хийлээ.',
  school: 'Санхүү Эдийн Засгийн Их Сургууль · 4-р курс',
  major: 'Мэдээллийн систем',
  bio:
    'Сайн байна уу! Би Очиржанцан, СЭЗИС-ийн Мэдээллийн систем мэргэжлийн 4-р курсийн оюутан. ' +
    'Тоглоом тоглохдоо "энэ яаж хийгддэг юм бол?" гэж үргэлж боддог байсан. Тэгээд нэг өдөр ' +
    'өөрийн тоглоомоо бүтээнэ гэж мөрөөддөг болсон. Одоогоор HTML, CSS, JavaScript, C#, React Native сурч, ' +
    'тэр мөрөөдөл рүүгээ алхам алхмаар ойртож байна.',
  interests: ['Тоглоом хөгжүүлэлт', 'Game design', 'Тоглоом тоглох', 'UI/UX'],
};

export type Skill = {
  name: string;
  icon: string; // Ionicons нэр
  level: number; // 0–100
  note: string;
};

export const skills: Skill[] = [
  { name: 'HTML', icon: 'logo-html5', level: 80, note: 'Бүтэцтэй, семантик хуудас' },
  { name: 'CSS', icon: 'logo-css3', level: 70, note: 'Flexbox, Grid, анимэйшн' },
  { name: 'JavaScript', icon: 'logo-javascript', level: 65, note: 'DOM, Canvas, ES6+' },
  { name: 'C#', icon: 'code-slash', level: 50, note: 'OOP — тоглоомын хэл, сурч байна' },
  { name: 'React Native', icon: 'logo-react', level: 50, note: 'Expo, Animated, Sensors' },
];

export type Project = {
  id: string;
  title: string;
  tag: string;
  stack: string[];
  short: string;
  description: string;
  image: ImageSourcePropType;
  link: string;
  status: 'Live' | 'Building' | 'Done' | 'Locked';
  game?: 'orb' | 'space' | 'snake'; // байвал холбоос биш, апп доторх тоглоомыг нээнэ
};

// Хамгийн багадаа 3 бүтээл → апп дотор шууд тоглогддог 3 жижиг тоглоом + энэ апп + мөрөөдлийн тоглоом.
export const projects: Project[] = [
  {
    id: 'orb',
    title: 'Orb Rush',
    tag: 'Game 01 · Tilt',
    stack: ['React Native', 'Accelerometer', 'Physics'],
    short: 'Утсаа хазайлгаж тоглодог миний анхны тоглоом',
    description:
      'Утсаа хазайлгаж цагаан бөмбөгөө өнхрүүлээд улбар шар орб цуглуулна, 🐞 bug-аас зайлсхийнэ. ' +
      'Accelerometer-ийн утгаар хүч → хурд → байрлалыг тооцож, үрэлт, хананаас ойх физикийг өөрөө бичсэн. ' +
      'Bug оноо ахих тусам хурдасдаг. 20 секундын дотор хамгийн их оноо цуглуул!',
    image: require('../../assets/projects/orb.jpg'),
    link: 'https://github.com/', // TODO
    status: 'Live',
    game: 'orb',
  },
  {
    id: 'space',
    title: 'Space Dodger',
    tag: 'Game 02 · Arcade',
    stack: ['React Native', 'Game loop', 'Collision'],
    short: 'Солируудын дундуур нисэх сансрын тоглоом',
    description:
      'Сансрын хөлгөө утсаа хазайлгаж эсвэл хуруугаараа чирж удирдана. Дээрээс санамсаргүй хэмжээ, ' +
      'хурдтай солир унаж, хугацаа өнгөрөх тусам хүндэрнэ. Тойрог-тойргийн мөргөлдөөн шалгалт, ' +
      'parallax од, 3 амь, мөргөсний дараах түр хамгаалалт (invincibility) хэрэгжүүлсэн.',
    image: require('../../assets/projects/space.jpg'),
    link: 'https://github.com/', // TODO
    status: 'Live',
    game: 'space',
  },
  {
    id: 'snake',
    title: 'Snake',
    tag: 'Game 03 · Swipe',
    stack: ['React Native', 'PanResponder', 'Grid logic'],
    short: 'Swipe-аар удирддаг сонгодог могой',
    description:
      'Хуруугаа дэлгэц дээр гүйлгэж (swipe) могойгоо эргүүлдэг сонгодог Snake. Тор (grid) дээр ' +
      'суурилсан хөдөлгөөн, хоол идэх бүрт урт нэмэгдэж хурдсах, хана болон өөрийгөө мөргөх шалгалт, ' +
      'эсрэг чиглэл рүү шууд эргэхийг хориглох логиктой.',
    image: require('../../assets/projects/snake.jpg'),
    link: 'https://github.com/', // TODO
    status: 'Live',
    game: 'snake',
  },
  {
    id: 'app',
    title: 'Ochiko OS',
    tag: 'Mobile app',
    stack: ['React Native', 'Expo', 'Sensors', 'Haptics'],
    short: 'Яг одоо үзэж буй энэ портфолио апп',
    description:
      'Ухаалаг гэрийн удирдлагын самбар хэлбэртэй портфолио апп. Хазайлтын parallax, сэгсрэх үйлдлээр ' +
      'нууц тоглоом, haptic чичиргээ, swipe gesture, dark/light горим, зураг солигдох crossfade ашигласан.',
    image: require('../../assets/projects/app.jpg'),
    link: 'https://github.com/', // TODO: энэ репогийн холбоос
    status: 'Live',
  },
  {
    id: 'dream',
    title: 'Мөрөөдлийн тоглоом',
    tag: 'Coming soon',
    stack: ['C#', 'Unity', 'Game design'],
    short: 'Хараахан түгжээтэй түвшин 🔒',
    description:
      'Энэ бол миний хамгийн том мөрөөдөл — өөрийн гэсэн бүрэн хэмжээний тоглоом. C# сурч, Unity ' +
      'хөдөлгүүртэй танилцаж байгаа бөгөөд энэ түвшин удахгүй нээгдэнэ. Хамтран ажиллах, зөвлөгөө ' +
      'өгөх хүсэлтэй бол надтай холбогдоорой!',
    image: require('../../assets/projects/dream.jpg'),
    link: 'mailto:b23fa1235@ufe.edu.mn',
    status: 'Locked',
  },
];

export type Contact = {
  id: string;
  label: string;
  value: string;
  icon: string;
  url: string;
};

// TODO: Өөрийн имэйл, утас, GitHub, сошиал хаягаар солино уу.
export const contacts: Contact[] = [
  { id: 'mail', label: 'Имэйл', value: 'b23fa1235@ufe.edu.mn', icon: 'mail', url: 'mailto:b23fa1235@ufe.edu.mn' },
  { id: 'phone', label: 'Утас', value: '+976 9900 0000', icon: 'call', url: 'tel:+97699000000' },
  { id: 'github', label: 'GitHub', value: 'github.com/ochiko', icon: 'logo-github', url: 'https://github.com/' },
  { id: 'fb', label: 'Facebook', value: 'fb.com/ochiko', icon: 'logo-facebook', url: 'https://facebook.com/' },
  { id: 'ig', label: 'Instagram', value: '@ochiko.dev', icon: 'logo-instagram', url: 'https://instagram.com/' },
];
