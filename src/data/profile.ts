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
  role: 'Game Developer · Student',
  // Нүүр дэлгэцийн нэг өгүүлбэр
  tagline: 'Код бичих бүрдээ шинэ ертөнц бүтээж, тоглогчдод мартагдашгүй мөч бэлэглэхийг зорьдог.',
  school: 'СЭЗИС · Мэдээллийн системийн менежмент',
  bio:
    'Сайн байна уу! Би Очиржанцан. Хүүхэд байхаасаа тоглоом тоглохдоо "энэ яаж хийгддэг юм бол?" ' +
    'гэж боддог байсан нь намайг программчлал руу хөтөлсөн. Одоо вэб, мобайл, C# дээр суралцаж, ' +
    'ирээдүйд өөрийн гэсэн тоглоомоо гаргахыг зорьж байна.',
  interests: ['Тоглоом хөгжүүлэлт', 'Game design', 'Unity', 'UI/UX'],
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
  { name: 'C#', icon: 'code-slash', level: 55, note: 'OOP, Unity скрипт' },
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
  status: 'Live' | 'Building' | 'Done';
};

// TODO: Өөрийн жинхэнэ бүтээлүүд, зураг (assets/projects/) болон холбоосоор солино уу.
export const projects: Project[] = [
  {
    id: 'p1',
    title: 'Space Dodger',
    tag: 'Game Room',
    stack: ['C#', 'Unity', '2D'],
    short: 'Солир тойрон нисдэг 2D тоглоом',
    description:
      'Сансрын хөлгөө удирдан солируудаас зугтаж оноо цуглуулдаг 2D тоглоом. ' +
      'C# дээр тоглогчийн хөдөлгөөн, мөргөлдөөн шалгах, оноо тоолох системийг бичсэн.',
    image: require('../../assets/projects/p1.jpg'),
    link: 'https://github.com/', // TODO
    status: 'Building',
  },
  {
    id: 'p2',
    title: 'Snake.js',
    tag: 'Arcade',
    stack: ['JavaScript', 'Canvas', 'HTML'],
    short: 'Хөтөч дээр тоглодог сонгодог могой',
    description:
      'HTML Canvas болон цэвэр JavaScript ашиглан хийсэн сонгодог Snake тоглоом. ' +
      'Game loop, гарын товчлуурын удирдлага, оноо хадгалах (localStorage) хэрэгжүүлсэн.',
    image: require('../../assets/projects/p2.jpg'),
    link: 'https://github.com/', // TODO
    status: 'Done',
  },
  {
    id: 'p3',
    title: 'Хувийн вэбсайт',
    tag: 'Web',
    stack: ['HTML', 'CSS', 'JavaScript'],
    short: 'Анхны responsive портфолио сайт',
    description:
      'HTML, CSS, JavaScript-ээр хийсэн анхны хувийн вэбсайт. ' +
      'Утас, компьютер дээр зөв харагдах responsive загвар, dark mode товч оруулсан.',
    image: require('../../assets/projects/p3.jpg'),
    link: 'https://github.com/', // TODO
    status: 'Done',
  },
  {
    id: 'p4',
    title: 'Ochiko OS',
    tag: 'Mobile',
    stack: ['React Native', 'Expo', 'Sensors'],
    short: 'Яг одоо үзэж буй энэ апп',
    description:
      'Ухаалаг гэрийн удирдлагын самбар хэлбэртэй портфолио апп. ' +
      'Хазайлтын мэдрэгч, сэгсрэх үйлдэл, haptic чичиргээ, swipe gesture ашигласан.',
    image: require('../../assets/projects/p4.jpg'),
    link: 'https://github.com/', // TODO: энэ репогийн холбоос
    status: 'Live',
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
