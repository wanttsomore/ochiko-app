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
  role: 'Game Developer болох замд',
  // Нүүр дэлгэцийн нэг өгүүлбэр
  tagline: 'Монголын түүхийг дэлхийд тоглоомоор таниулахыг мөрөөддөг.',
  school: 'Санхүү Эдийн Засгийн Их Сургууль · 4-р курс',
  major: 'Мэдээллийн систем',
  // Товч танилцуулга — богино, тодорхой
  story: [
    'Counter-Strike 6 настайдаа тоглож, анх тоглоомд дуртай болсон',
    'Ghost of Yōtei, Red Dead Redemption 2 шиг өргөн ертөнцтэй, Монголын түүхэн дээр суурилсан тоглоом бүтээх.',
    'Тэр мөрөөдөлдөө хүрэхийн тулд программчлалыг алхам алхмаар сурч байна.',
  ],
  // Тоглосон тоглоомууд
  played: ['Counter-Strike', 'GTA', 'Ghost of Tsushima', 'left 4 dead', 'DOTA 2', 'warcraft', 'RA'],
  // Сурсан замнал — тоглоомын түвшин шиг
  journey: [
    { title: 'HTML, CSS', text: 'Вэб хуудас хийх гэж эхэлсэн. Хуудасны бүтэц, өнгө, байрлал, responsive загвар хийж сурсан.', icon: 'logo-html5', state: 'done' },
    { title: 'JavaScript', text: 'Хуудсандаа логик, товч, хөдөлгөөн нэмж, программчлалын үндсэн ойлголтуудыг эзэмшсэн.', icon: 'logo-javascript', state: 'done' },
    { title: 'C#', text: 'Тоглоомын хөдөлгүүр Unity-д хэрэглэгддэг хэл учраас OOP, C#-ийг сурч эхэлсэн.', icon: 'code-slash', state: 'done' },
    { title: 'React Native', text: 'Одоо мобайл апп хийж сурч байгаа', icon: 'logo-react', state: 'now' },
    { title: 'Тоглоом хөгжүүлэлт', text: 'Ирээдүйд Unity, C# ашиглан Монголын түүхэн тоглоомоо бүтээнэ.', icon: 'flag', state: 'next' },
  ] as { title: string; text: string; icon: string; state: 'done' | 'now' | 'next' }[],
  interests: ['Тоглоом хөгжүүлэлт', 'Монголын түүх', 'Game design'],
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
  { name: 'C#', icon: 'code-slash', level: 50, note: 'OOP - тоглоомын хэл, сурч байна' },
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
  game?: 'orb' | 'space' | 'snake'; // байвал холбоос биш, апп доторх тоглоомыг нээнэ
};

// Хамгийн багадаа 3 бүтээл → апп дотор шууд тоглогддог 3 жижиг тоглоом.
export const projects: Project[] = [
  {
    id: 'orb',
    title: 'Orb Rush',
    tag: 'Game 01 · Tilt',
    stack: ['React Native', 'Accelerometer', 'Physics'],
    short: 'Утсаа хазайлгаж тоглодог миний анхны тоглоом',
    description:
      'Утсаа хазайлгаж цагаан бөмбөгөө өнхрүүлээд улбар шар орб цуглуулж, улаан хорхойноос зайлсхийнэ. ' +
      'Accelerometer-ийн утгаар хүч → хурд → байрлалыг тооцож, үрэлт, хананаас ойх физикийг өөрөө бичсэн. ' +
      'Хорхой оноо ахих тусам хурдасдаг. 20 секундын дотор хамгийн их оноо цуглуул!',
    image: require('../../assets/projects/orb.jpg'),
    link: 'https://github.com/wanttsomore',
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
    link: 'https://github.com/wanttsomore',
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
    link: 'https://github.com/wanttsomore',
    status: 'Live',
    game: 'snake',
  },
];

export type Contact = {
  id: string;
  label: string;
  value: string;
  icon: string;
  url: string;
};

// TODO: имэйл хаягаа шалгаж, зөв эсэхийг баталгаажуулаарай.
export const contacts: Contact[] = [
  { id: 'phone', label: 'Утас', value: '8096 1929', icon: 'call', url: 'tel:+97680961929' },
  { id: 'ig', label: 'Instagram', value: '@oji_lnn', icon: 'logo-instagram', url: 'https://www.instagram.com/oji_lnn' },
  { id: 'fb', label: 'Facebook', value: 'ochir.jantsan.39', icon: 'logo-facebook', url: 'https://www.facebook.com/ochir.jantsan.39/' },
  { id: 'mail', label: 'Имэйл', value: 'b23fa1235@ufe.edu.mn', icon: 'mail', url: 'mailto:b23fa1235@ufe.edu.mn' },
  { id: 'github', label: 'GitHub', value: 'wanttsomore', icon: 'logo-github', url: 'https://github.com/wanttsomore' },
];
