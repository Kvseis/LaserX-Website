import type { Locale } from './locales';

type Item = { title: string; text: string };
export type AboutCopy = {
  heroTitle: string; heroIntro: string; heroCta: string; heroAlt: string;
  technologyLink: string;
  storyLabel: string; storyTitle: string; storyDescription: [string, string];
  storyMuted: string;
  breadcrumbHome: string;
  processLabel: string; processTitle: string; process: [string, string, string, string];
  missionLabel: string; missionTitle: string; missionText: string; values: Item[];
  benefits: [Item, Item, Item];
  comparison: { label: string; before: string; after: string; beforeAlt: string; afterAlt: string };
  contactTitle: [string, string];
};

const aboutCopy: Record<Locale, AboutCopy> = {
  az: {
    contactTitle: ['Layihəniz haqqında', 'danışaq.'],
    breadcrumbHome: 'Ana səhifə',
    storyMuted: 'Hər materiala',
    processLabel: 'Necə işləyirik', processTitle: 'Dörd addımda təmiz səth.',
    process: ['Şəkil göndərin', 'Kiçik sahədə sınaq', 'Lazerlə təmizləmə', 'Son yoxlama'],
    heroTitle: 'Səthə yeni baxış.',
    heroIntro: 'Bakıda metal və daş səthlərdən pası, köhnə boyanı və hisi lazerlə təmizləyirik. Hər səth üçün rejimi sınaqla seçirik.',
    heroCta: 'Layihənizi müzakirə edək',
    heroAlt: 'Metal yonqarları arasında paslı və cilalanmış iki flanşın illüstrasiyası',
    technologyLink: 'Texnologiyanı tanıyın',
    storyLabel: 'Biz kimik', storyTitle: 'Hər materiala uyğun yanaşma.',
    storyDescription: [
      'LaserX komandası illərdir peşəkar lazer təmizləmə ilə məşğuldur. Sənaye avadanlığında, istehsal detallarında və bərpa işlərində pası, köhnə boyanı, hisi və digər arzuolunmaz qatları təmizləyirik.',
      'Əvvəl materialı qiymətləndirir, kiçik sahədə sınaq aparırıq. Səthin reaksiyasına əsasən lazerin gücünü və iş rejimini seçirik ki, əsas material qorunsun.',
    ],
    missionLabel: 'Məqsədimiz', missionTitle: 'İş prinsiplərimiz',
    missionText: 'Müasir texnologiyanı səthə uyğun yanaşma ilə birləşdiririk.',
    values: [
      { title: 'Texnologiya', text: 'Lazer enerjisini arzuolunmaz qata yönəldirik.' },
      { title: 'Nəticə', text: 'Təmizlənmiş səthi işin sonunda yoxlayırıq.' },
      { title: 'Əlaqə', text: 'İşin həcmini və gedişini sizinlə razılaşdırırıq.' },
    ],
    benefits: [
      { title: 'Kimyəvi vasitəsiz', text: 'Boya və pas üçün kimyəvi soyucu istifadə etmirik.' },
      { title: 'Əvvəlcə sınaq', text: 'Əsas işdən əvvəl kiçik sahəni yoxlayırıq.' },
      { title: 'Dəqiq', text: 'Seçilmiş qatı nəzarətlə təmizləyirik.' },
    ],
    comparison: {
      label: 'Daş səthin təmizlənmədən əvvəl və sonrakı illüstrativ müqayisəsi', before: 'Əvvəl', after: 'Sonra',
      beforeAlt: 'Lazerlə təmizləmədən əvvəl daş səthin illüstrasiyası',
      afterAlt: 'Lazerlə təmizləmədən sonra daş səthin illüstrasiyası',
    },
  },
  en: {
    contactTitle: ["Let's talk about", 'your project.'],
    breadcrumbHome: 'Home',
    storyMuted: 'An approach',
    processLabel: 'How we work', processTitle: 'A clean surface in four steps.',
    process: ['Send a photo', 'Test a small area', 'Laser cleaning', 'Final check'],
    heroTitle: 'Beneath the surface.',
    heroIntro: 'We laser-clean metal and stone in Baku, adjusting the process to each material to lift away rust, paint and soot.',
    heroCta: 'Discuss your project',
    heroAlt: 'Illustration of a rusted flange and a polished flange set among metal shavings',
    technologyLink: 'See the technology',
    storyLabel: 'Who we are', storyTitle: 'An approach for each material.',
    storyDescription: [
      'The LaserX team has years of professional laser cleaning experience. We remove rust, old paint, soot and other unwanted layers from industrial equipment, manufactured parts and surfaces undergoing restoration.',
      'We assess the material and test a small area first. We use the results to set the laser power and operating mode with the aim of preserving the underlying surface.',
    ],
    missionLabel: 'Our purpose', missionTitle: 'How we work',
    missionText: 'We combine modern technology with an approach suited to each surface.',
    values: [
      { title: 'Technology', text: 'We direct laser energy at the unwanted layer.' },
      { title: 'Results', text: 'We inspect the cleaned surface before handing it over.' },
      { title: 'Communication', text: 'We discuss your project and explain the work clearly.' },
    ],
    benefits: [
      { title: 'No chemicals', text: 'No chemical paint or rust strippers.' },
      { title: 'Test first', text: 'We check a small area before the main work.' },
      { title: 'Precise', text: 'Controlled cleaning of the selected layer.' },
    ],
    comparison: {
      label: 'Illustrative comparison of stone before and after cleaning', before: 'Before', after: 'After',
      beforeAlt: 'Illustration of a stone surface before laser cleaning',
      afterAlt: 'Illustration of a stone surface after laser cleaning',
    },
  },
  ru: {
    contactTitle: ['Обсудим', 'ваш проект.'],
    breadcrumbHome: 'Главная',
    storyMuted: 'Подход',
    processLabel: 'Как мы работаем', processTitle: 'Чистая поверхность за четыре шага.',
    process: ['Пришлите фото', 'Проба на небольшом участке', 'Лазерная очистка', 'Проверка результата'],
    heroTitle: 'Новый взгляд на поверхность.',
    heroIntro: 'Очищаем металл и камень лазером в Баку. Подбираем режим под материал, чтобы удалить ржавчину, краску и сажу.',
    heroCta: 'Обсудить проект',
    heroAlt: 'Иллюстрация ржавого и полированного фланцев среди металлической стружки',
    technologyLink: 'Узнать о технологии',
    storyLabel: 'Кто мы', storyTitle: 'Подход к каждому материалу.',
    storyDescription: [
      'Команда LaserX уже много лет профессионально занимается лазерной очисткой. Мы удаляем ржавчину, старую краску, сажу и другие нежелательные слои с промышленного оборудования, деталей и поверхностей при реставрации.',
      'Сначала оцениваем материал и проводим пробу на небольшом участке. По её результатам подбираем мощность и режим лазера, чтобы сохранить поверхность под удаляемым слоем.',
    ],
    missionLabel: 'Наша цель', missionTitle: 'Наши принципы',
    missionText: 'Современная технология и подход с учётом особенностей поверхности.',
    values: [
      { title: 'Технология', text: 'Направляем энергию лазера на нежелательный слой.' },
      { title: 'Результат', text: 'Проверяем очищенную поверхность перед сдачей работы.' },
      { title: 'Общение', text: 'Обсуждаем ваш проект и понятно объясняем ход работы.' },
    ],
    benefits: [
      { title: 'Без химии', text: 'Без химических средств для снятия краски и ржавчины.' },
      { title: 'Сначала проба', text: 'Проверяем небольшой участок до начала основной работы.' },
      { title: 'Точно', text: 'Контролируемая очистка выбранного слоя.' },
    ],
    comparison: {
      label: 'Иллюстрация каменной поверхности до и после очистки', before: 'До', after: 'После',
      beforeAlt: 'Иллюстрация каменной поверхности до лазерной очистки',
      afterAlt: 'Иллюстрация каменной поверхности после лазерной очистки',
    },
  },
  tr: {
    contactTitle: ['Projenizi', 'konuşalım.'],
    breadcrumbHome: 'Ana sayfa',
    storyMuted: 'Her malzemeye',
    processLabel: 'Nasıl çalışıyoruz', processTitle: 'Dört adımda temiz yüzey.',
    process: ['Fotoğraf gönderin', 'Küçük alanda deneme', 'Lazerle temizleme', 'Son kontrol'],
    heroTitle: 'Yüzeye yeni bir bakış.',
    heroIntro: 'Bakü’de metal ve taş yüzeyleri lazerle temizliyoruz. Pası, boyayı ve isi gidermek için her malzemeye uygun ayarı seçiyoruz.',
    heroCta: 'Projenizi konuşalım',
    heroAlt: 'Metal talaşları arasında paslı ve parlatılmış iki flanşın temsili görseli',
    technologyLink: 'Teknolojiyi tanıyın',
    storyLabel: 'Biz kimiz', storyTitle: 'Her malzemeye uygun yaklaşım.',
    storyDescription: [
      'LaserX ekibi yıllardır profesyonel lazer temizliği yapıyor. Endüstriyel ekipmanlarda, üretim parçalarında ve restorasyon çalışmalarında pası, eski boyayı, isi ve diğer istenmeyen katmanları temizliyoruz.',
      'Önce malzemeyi değerlendirip küçük bir alanda deneme yapıyoruz. Alttaki yüzeyi korumak için lazer gücünü ve çalışma modunu denemenin sonucuna göre ayarlıyoruz.',
    ],
    missionLabel: 'Amacımız', missionTitle: 'Çalışma ilkelerimiz',
    missionText: 'Modern teknolojiyi yüzeye uygun bir yaklaşımla birleştiriyoruz.',
    values: [
      { title: 'Teknoloji', text: 'Lazer enerjisini istenmeyen katmana yönlendiririz.' },
      { title: 'Sonuç', text: 'İşi teslim etmeden önce temizlenen yüzeyi kontrol ederiz.' },
      { title: 'İletişim', text: 'Projenizi konuşur, çalışma sürecini açıkça anlatırız.' },
    ],
    benefits: [
      { title: 'Kimyasalsız', text: 'Kimyasal boya veya pas sökücü kullanmayız.' },
      { title: 'Önce deneme', text: 'Asıl işten önce küçük bir alanı kontrol ederiz.' },
      { title: 'Hassas', text: 'Seçilen katmanı kontrollü biçimde temizleriz.' },
    ],
    comparison: {
      label: 'Taş yüzeyin temizlik öncesi ve sonrasına ait temsili karşılaştırma', before: 'Önce', after: 'Sonra',
      beforeAlt: 'Lazerle temizleme öncesi taş yüzey illüstrasyonu',
      afterAlt: 'Lazerle temizleme sonrası taş yüzey illüstrasyonu',
    },
  },
};

export function getAboutCopy(locale: Locale): AboutCopy {
  return aboutCopy[locale];
}
