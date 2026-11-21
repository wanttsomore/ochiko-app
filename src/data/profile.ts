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
  tagline: 'Өөрийн тоглоомоо бүтээхийг мөрөөддөг — анхны алхмаа яг энэ апп дотор хийлээ.',
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
  action?: 'game'; // 'game' бол холбоос биш, апп доторх тоглоомыг нээнэ
};

// Хамгийн багадаа 3 бүтээл. Хичээлийн төсөл байж болно.
// TODO: 3-р бүтээлийг өөрийн хийсэн хичээлийн төсөл, зураг (assets/projects/p3.jpg), холбоосоор солиорой.
export const projects: Project[] = [
  {
    id: 'p1',
    title: 'Orb Rush',
    tag: 'Анхны тоглоом',
    stack: ['React Native', 'Accelerometer', 'Game loop'],
    short: 'Миний бүтээсэн хамгийн анхны тоглоом 🎮',
    description:
      'Тоглоом хийхийг мөрөөддөг надад энэ бол анхны жинхэнэ алхам. Утсаа хазайлгаж бөмбөгөө ' +
      'удирдаад орб цуглуулж, bug-аас зайлсхийнэ. Game loop (requestAnimationFrame), мөргөлдөөн ' +
      'шалгах, физик (хурд, үрэлт, хананаас ойх), оноо, рекордыг өөрөө бичсэн. Апп дотор нууцаар байрладаг!',
    image: require('../../assets/projects/p1.jpg'),
    link: 'https://github.com/', // TODO
    status: 'Live',
    action: 'game',
  },
  {
    id: 'p2',
    title: 'Ochiko OS',
    tag: 'Mobile',
    stack: ['React Native', 'Expo', 'Sensors', 'Haptics'],
    short: 'Яг одоо үзэж буй энэ портфолио апп',
    description:
      'Ухаалаг гэрийн удирдлагын самбар хэлбэртэй портфолио апп. Хазайлтын мэдрэгчээр parallax, ' +
      'сэгсрэх үйлдлээр нууц өрөө, haptic чичиргээ, swipe gesture, dark/light горим ашигласан.',
    image: require('../../assets/projects/p4.jpg'),
    link: 'https://github.com/', // TODO: энэ репогийн холбоос
    status: 'Live',
  },
  {
    id: 'p3',
    title: 'Хичээлийн вэб төсөл',
    tag: 'Web',
    stack: ['HTML', 'CSS', 'JavaScript'],
    short: 'TODO: өөрийн хичээлийн төслөөр солих',
    description:
      'TODO: Энд хичээл дээр хийсэн HTML/CSS/JavaScript төслөө товч тайлбарлана — юу хийдэг, ' +
      'ямар асуудал шийддэг, та ямар хэсгийг нь хийсэн бэ.',
    image: require('../../assets/projects/p3.jpg'),
    link: 'https://github.com/', // TODO
    status: 'Done',
  },
  {
    id: 'p4',
    title: 'Мөрөөдлийн тоглоом',
    tag: 'Coming soon',
    stack: ['C#', 'Unity', 'Game design'],
    short: 'Хараахан түгжээтэй түвшин 🔒',
    description:
      'Энэ бол миний хамгийн том мөрөөдөл — өөрийн гэсэн тоглоом. C# сурч, Unity хөдөлгүүртэй ' +
      'танилцаж байгаа бөгөөд энэ түвшин удахгүй нээгдэнэ. Хамтран ажиллах, зөвлөгөө өгөх хүсэлтэй ' +
      'бол надтай холбогдоорой!',
    image: require('../../assets/projects/p2.jpg'),
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
