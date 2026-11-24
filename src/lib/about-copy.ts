import type { Locale } from './locales';

type Item = { title: string; text: string };
export type AboutCopy = {
  hero: [string, string]; description: string; heroAlt: string;
  servicesLink: string; technologyLink: string;
  storyLabel: string; storyTitle: string; storySubtitle: string;
  storyMuted: string;
  breadcrumbHome: string;
  processLabel: string; processTitle: string; process: [string, string, string, string];
  missionLabel: string; missionTitle: string; missionText: string; values: Item[];
  benefits: [Item, Item, Item];
  comparison: { label: string; before: string; after: string; beforeAlt: string; afterAlt: string; illustration: string };
  surfacesTitle: string; surfacesIntro: string; surfaces: Item[];
  disclosure: string;
  contactTitle: [string, string];
};

const aboutCopy: Record<Locale, AboutCopy> = {
  az: {
    contactTitle: ['Layihəniz haqqında', 'danışaq.'],
    breadcrumbHome: 'Ana səhifə',
    storyMuted: 'Hər materiala',
    processLabel: 'Necə işləyirik', processTitle: 'Dörd addımda təmiz səth.',
    process: ['Şəkil göndərin', 'Kiçik sahədə sınaq', 'Lazerlə təmizləmə', 'Son yoxlama'],
    hero: ['Lazer təmizləmə.', 'Səthə yeni baxış.'],
    description: 'Bakıda metal, daş və ağac üçün lazer təmizləmə xidməti.',
    heroAlt: 'Metal detalın lazerlə təmizlənməsini göstərən illüstrativ səhnə',
    servicesLink: 'Xidmətlərə baxın', technologyLink: 'Texnologiyanı tanıyın',
    storyLabel: 'Biz kimik', storyTitle: 'Hər materiala uyğun yanaşma.',
    storySubtitle: 'Əvvəl kiçik sahədə sınaq aparırıq, sonra uyğun parametrləri seçirik.',
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
      label: 'Daş səthin əvvəl və sonra müqayisəsi', before: 'Əvvəl', after: 'Sonra',
      beforeAlt: 'Lazerlə təmizləmədən əvvəl daş səthin illüstrasiyası',
      afterAlt: 'Lazerlə təmizləmədən sonra daş səthin illüstrasiyası', illustration: 'İllüstrativ müqayisə',
    },
    surfacesTitle: 'İşlədiyimiz səthlər',
    surfacesIntro: 'Sənaye detallarından bərpa işlərinə qədər.',
    surfaces: [
      { title: 'Metal', text: 'Pas, oksid və sənaye örtüklərinin təmizlənməsi.' },
      { title: 'Daş', text: 'Çirk və səth qatlarının sınaq əsasında təmizlənməsi.' },
      { title: 'Ağac', text: 'Materiala uyğun boya və lak təmizləmə.' },
    ],
    disclosure: 'Bu səhifədəki vizuallar AI ilə hazırlanmış illüstrasiyalardır, real layihə və ya komanda fotoları deyil.',
  },
  en: {
    contactTitle: ["Let's talk about", 'your project.'],
    breadcrumbHome: 'Home',
    storyMuted: 'An approach',
    processLabel: 'How we work', processTitle: 'A clean surface in four steps.',
    process: ['Send a photo', 'Test a small area', 'Laser cleaning', 'Final check'],
    hero: ['Laser cleaning.', 'A fresh view of surfaces.'],
    description: 'Laser cleaning for metal, stone and wood in Baku.',
    heroAlt: 'Illustrative scene of laser cleaning a metal component',
    servicesLink: 'View our services', technologyLink: 'See the technology',
    storyLabel: 'Who we are', storyTitle: 'An approach for each material.',
    storySubtitle: 'We test a small area first, then choose the right settings.',
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
      label: 'Compare stone before and after cleaning', before: 'Before', after: 'After',
      beforeAlt: 'Illustration of a stone surface before laser cleaning',
      afterAlt: 'Illustration of a stone surface after laser cleaning', illustration: 'Illustrative comparison',
    },
    surfacesTitle: 'Surfaces we work with',
    surfacesIntro: 'From industrial components to restoration work.',
    surfaces: [
      { title: 'Metal', text: 'Removal of rust, oxides and industrial coatings.' },
      { title: 'Stone', text: 'Test-led removal of dirt and surface deposits.' },
      { title: 'Wood', text: 'Paint and varnish removal suited to the material.' },
    ],
    disclosure: 'Images on this page are AI-generated illustrations, not photographs of our projects or team.',
  },
  ru: {
    contactTitle: ['Обсудим', 'ваш проект.'],
    breadcrumbHome: 'Главная',
    storyMuted: 'Подход',
    processLabel: 'Как мы работаем', processTitle: 'Чистая поверхность за четыре шага.',
    process: ['Пришлите фото', 'Проба на небольшом участке', 'Лазерная очистка', 'Проверка результата'],
    hero: ['Лазерная очистка.', 'Новый взгляд на поверхности.'],
    description: 'Лазерная очистка металла, камня и дерева в Баку.',
    heroAlt: 'Иллюстрация лазерной очистки металлической детали',
    servicesLink: 'Посмотреть услуги', technologyLink: 'Узнать о технологии',
    storyLabel: 'Кто мы', storyTitle: 'Подход к каждому материалу.',
    storySubtitle: 'Сначала делаем пробу на небольшом участке, затем подбираем настройки.',
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
      label: 'Каменная поверхность до и после очистки', before: 'До', after: 'После',
      beforeAlt: 'Иллюстрация каменной поверхности до лазерной очистки',
      afterAlt: 'Иллюстрация каменной поверхности после лазерной очистки', illustration: 'Сравнение для иллюстрации',
    },
    surfacesTitle: 'С чем мы работаем',
    surfacesIntro: 'От промышленных деталей до реставрационных работ.',
    surfaces: [
      { title: 'Металл', text: 'Удаление ржавчины, оксидов и промышленных покрытий.' },
      { title: 'Камень', text: 'Удаление загрязнений и поверхностных слоёв с предварительной пробой.' },
      { title: 'Дерево', text: 'Удаление краски и лака с учётом особенностей материала.' },
    ],
    disclosure: 'Изображения созданы с помощью ИИ. Это иллюстрации, а не фотографии наших проектов или команды.',
  },
  tr: {
    contactTitle: ['Projenizi', 'konuşalım.'],
    breadcrumbHome: 'Ana sayfa',
    storyMuted: 'Her malzemeye',
    processLabel: 'Nasıl çalışıyoruz', processTitle: 'Dört adımda temiz yüzey.',
    process: ['Fotoğraf gönderin', 'Küçük alanda deneme', 'Lazerle temizleme', 'Son kontrol'],
    hero: ['Lazer temizleme.', 'Yüzeylere yeni bir bakış.'],
    description: 'Bakü’de metal, taş ve ahşap için lazer temizleme hizmeti.',
    heroAlt: 'Metal bir parçanın lazerle temizlenmesini gösteren temsili görsel',
    servicesLink: 'Hizmetleri inceleyin', technologyLink: 'Teknolojiyi tanıyın',
    storyLabel: 'Biz kimiz', storyTitle: 'Her malzemeye uygun yaklaşım.',
    storySubtitle: 'Önce küçük bir alanda dener, ardından uygun ayarları seçeriz.',
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
      label: 'Taş yüzeyin temizlik öncesi ve sonrası', before: 'Önce', after: 'Sonra',
      beforeAlt: 'Lazerle temizleme öncesi taş yüzey illüstrasyonu',
      afterAlt: 'Lazerle temizleme sonrası taş yüzey illüstrasyonu', illustration: 'Temsili karşılaştırma',
    },
    surfacesTitle: 'Çalıştığımız yüzeyler',
    surfacesIntro: 'Endüstriyel parçalardan restorasyon çalışmalarına.',
    surfaces: [
      { title: 'Metal', text: 'Pas, oksit ve endüstriyel kaplamaların temizlenmesi.' },
      { title: 'Taş', text: 'Ön denemeyle kir ve yüzey katmanlarının temizlenmesi.' },
      { title: 'Ahşap', text: 'Malzemeye uygun boya ve vernik temizleme.' },
    ],
    disclosure: 'Bu sayfadaki görseller yapay zekâyla oluşturulmuş temsili görsellerdir; proje veya ekip fotoğraflarımız değildir.',
  },
};

export function getAboutCopy(locale: Locale): AboutCopy {
  return aboutCopy[locale];
}
