import type { Locale } from './locales';

type Item = { title: string; text: string };
export type AboutCopy = {
  hero: [string, string]; description: string; heroAlt: string;
  servicesLink: string; technologyLink: string;
  storyLabel: string; storyTitle: string; story: string[]; storyAlt: string;
  storyMuted: string;
  breadcrumbHome: string;
  processLabel: string; processTitle: string; processText: string; process: Item[];
  missionLabel: string; missionTitle: string; missionText: string; values: Item[];
  reasonsTitle: string; reasons: Item[];
  surfacesTitle: string; surfacesIntro: string; surfaces: Item[];
  disclosure: string;
};

const aboutCopy: Record<Locale, AboutCopy> = {
  az: {
    breadcrumbHome: 'Ana səhifə',
    storyMuted: 'Hər materiala',
    processLabel: 'Necə işləyirik', processTitle: 'Dörd addımda təmiz səth.',
    processText: 'İlk əlaqədən son yoxlamaya qədər aydın iş prosesi.',
    process: [
      { title: 'Şəkil göndərin və ya təsvir edin', text: 'Səthin şəklini və ya qısa təsvirini bizimlə paylaşın.' },
      { title: 'Kiçik sahədə sınaq', text: 'Materiala uyğun rejimi kiçik bir sahədə yoxlayırıq.' },
      { title: 'Lazerlə təmizləmə', text: 'Seçilmiş parametrlərlə arzuolunmaz qatı təmizləyirik.' },
      { title: 'Nəticənin yoxlanması', text: 'İşi təhvil verməzdən əvvəl təmizlənmiş səthi yoxlayırıq.' },
    ],
    hero: ['Lazer təmizləmə.', 'Səthə yeni baxış.'],
    description: 'Bakıda metal, daş və ağac üçün lazer təmizləmə xidməti.',
    heroAlt: 'Metal detalın lazerlə təmizlənməsini göstərən illüstrativ səhnə',
    servicesLink: 'Xidmətlərə baxın', technologyLink: 'Texnologiyanı tanıyın',
    storyLabel: 'Biz kimik', storyTitle: 'Hər materiala uyğun yanaşma.',
    story: ['LaserX səthləri yenidən istifadəyə hazırlayır. Əvvəl kiçik sahədə sınaq aparır, sonra uyğun iş rejimini seçirik.'],
    storyAlt: 'Oyma daş səthin diqqətlə yoxlanmasını göstərən illüstrativ səhnə',
    missionLabel: 'Məqsədimiz', missionTitle: 'İş prinsiplərimiz',
    missionText: 'Müasir texnologiyanı səthə uyğun yanaşma ilə birləşdiririk.',
    values: [
      { title: 'Texnologiya', text: 'Lazer enerjisini arzuolunmaz qata yönəldirik.' },
      { title: 'Nəticə', text: 'Təmizlənmiş səthi işin sonunda yoxlayırıq.' },
      { title: 'Əlaqə', text: 'İşin həcmini və gedişini sizinlə razılaşdırırıq.' },
    ],
    reasonsTitle: 'Niyə LaserX?',
    reasons: [
      { title: 'Dəqiq işləmə', text: 'Seçilmiş sahə və qat üzərində nəzarətli təmizləmə.' },
      { title: 'Kimyəvi soyucu olmadan', text: 'Lazer mərhələsində boya və pas üçün kimyəvi soyucu tələb olunmur.' },
      { title: 'Səthə uyğun parametrlər', text: 'İş rejimi materiala və çirklənmə dərəcəsinə görə seçilir.' },
      { title: 'Əvvəlcə sınaq', text: 'Kiçik sahədə nəticəni yoxlayıb əsas işə keçirik.' },
      { title: 'Daha az əlavə tullantı', text: 'Abraziv qum istifadə edilmir; ayrılan qalıqlar nəzarətlə toplanır.' },
      { title: 'Aydın iş planı', text: 'Səth, işin həcmi və gözlənilən nəticə əvvəlcədən müzakirə olunur.' },
    ],
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
    breadcrumbHome: 'Home',
    storyMuted: 'An approach',
    processLabel: 'How we work', processTitle: 'A clean surface in four steps.',
    processText: 'A clear process from first contact to final inspection.',
    process: [
      { title: 'Send a photo or description', text: 'Share a photo or a short description of the surface.' },
      { title: 'Test a small area', text: 'We test suitable settings on a small part of the material.' },
      { title: 'Laser cleaning', text: 'We remove the unwanted layer using the selected settings.' },
      { title: 'Check the result', text: 'We inspect the cleaned surface before handing it over.' },
    ],
    hero: ['Laser cleaning.', 'A fresh view of surfaces.'],
    description: 'Laser cleaning for metal, stone and wood in Baku.',
    heroAlt: 'Illustrative scene of laser cleaning a metal component',
    servicesLink: 'View our services', technologyLink: 'See the technology',
    storyLabel: 'Who we are', storyTitle: 'An approach for each material.',
    story: ['LaserX prepares surfaces for reuse. We test a small area first, then select the right settings.'],
    storyAlt: 'Illustrative scene of a carved stone surface being inspected',
    missionLabel: 'Our purpose', missionTitle: 'How we work',
    missionText: 'We combine modern technology with an approach suited to each surface.',
    values: [
      { title: 'Technology', text: 'We direct laser energy at the unwanted layer.' },
      { title: 'Results', text: 'We inspect the cleaned surface before handing it over.' },
      { title: 'Communication', text: 'We discuss your project and explain the work clearly.' },
    ],
    reasonsTitle: 'Why LaserX?',
    reasons: [
      { title: 'Precise treatment', text: 'Controlled cleaning of the selected area and layer.' },
      { title: 'No chemical strippers', text: 'The laser stage requires no chemical paint or rust strippers.' },
      { title: 'Settings for each surface', text: 'The material and deposits determine the operating settings.' },
      { title: 'Testing first', text: 'We check a small area before starting the main work.' },
      { title: 'Less secondary waste', text: 'No abrasive grit is used; removed residue is collected under control.' },
      { title: 'A clear work plan', text: 'We discuss the surface, scope and expected result in advance.' },
    ],
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
    breadcrumbHome: 'Главная',
    storyMuted: 'Подход',
    processLabel: 'Как мы работаем', processTitle: 'Чистая поверхность за четыре шага.',
    processText: 'Понятный процесс от первого обращения до проверки результата.',
    process: [
      { title: 'Пришлите фото или описание', text: 'Поделитесь фотографией или кратким описанием поверхности.' },
      { title: 'Проба на небольшом участке', text: 'Проверяем подходящие настройки на небольшом участке материала.' },
      { title: 'Лазерная очистка', text: 'Удаляем нежелательный слой с выбранными настройками.' },
      { title: 'Проверка результата', text: 'Проверяем очищенную поверхность перед сдачей работы.' },
    ],
    hero: ['Лазерная очистка.', 'Новый взгляд на поверхности.'],
    description: 'Лазерная очистка металла, камня и дерева в Баку.',
    heroAlt: 'Иллюстрация лазерной очистки металлической детали',
    servicesLink: 'Посмотреть услуги', technologyLink: 'Узнать о технологии',
    storyLabel: 'Кто мы', storyTitle: 'Подход к каждому материалу.',
    story: ['LaserX готовит поверхности к повторному использованию. Сначала проводим пробу на небольшом участке, затем подбираем режим работы.'],
    storyAlt: 'Иллюстрация осмотра резной каменной поверхности',
    missionLabel: 'Наша цель', missionTitle: 'Наши принципы',
    missionText: 'Современная технология и подход с учётом особенностей поверхности.',
    values: [
      { title: 'Технология', text: 'Направляем энергию лазера на нежелательный слой.' },
      { title: 'Результат', text: 'Проверяем очищенную поверхность перед сдачей работы.' },
      { title: 'Общение', text: 'Обсуждаем ваш проект и понятно объясняем ход работы.' },
    ],
    reasonsTitle: 'Почему LaserX?',
    reasons: [
      { title: 'Точная обработка', text: 'Контролируемая очистка выбранного участка и слоя.' },
      { title: 'Без химических смывок', text: 'На этапе лазерной очистки не нужны химические средства для снятия краски и ржавчины.' },
      { title: 'Настройки под материал', text: 'Режим работы зависит от материала и степени загрязнения.' },
      { title: 'Сначала проба', text: 'Проверяем результат на небольшом участке до начала основной работы.' },
      { title: 'Меньше вторичных отходов', text: 'Не используем абразивный песок; отделённые остатки собираем под контролем.' },
      { title: 'Понятный план', text: 'Заранее обсуждаем поверхность, объём работ и ожидаемый результат.' },
    ],
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
    breadcrumbHome: 'Ana sayfa',
    storyMuted: 'Her malzemeye',
    processLabel: 'Nasıl çalışıyoruz', processTitle: 'Dört adımda temiz yüzey.',
    processText: 'İlk iletişimden son kontrole kadar açık bir iş süreci.',
    process: [
      { title: 'Fotoğraf veya açıklama gönderin', text: 'Yüzeyin fotoğrafını veya kısa bir açıklamasını bizimle paylaşın.' },
      { title: 'Küçük bir alanda deneme', text: 'Malzemeye uygun ayarları küçük bir alanda kontrol ederiz.' },
      { title: 'Lazerle temizleme', text: 'Seçilen ayarlarla istenmeyen katmanı temizleriz.' },
      { title: 'Sonucun kontrolü', text: 'İşi teslim etmeden önce temizlenen yüzeyi kontrol ederiz.' },
    ],
    hero: ['Lazer temizleme.', 'Yüzeylere yeni bir bakış.'],
    description: 'Bakü’de metal, taş ve ahşap için lazer temizleme hizmeti.',
    heroAlt: 'Metal bir parçanın lazerle temizlenmesini gösteren temsili görsel',
    servicesLink: 'Hizmetleri inceleyin', technologyLink: 'Teknolojiyi tanıyın',
    storyLabel: 'Biz kimiz', storyTitle: 'Her malzemeye uygun yaklaşım.',
    story: ['LaserX yüzeyleri yeniden kullanıma hazırlar. Önce küçük bir alanda deneme yapar, ardından uygun çalışma ayarlarını seçeriz.'],
    storyAlt: 'Oyma taş yüzeyin incelenmesini gösteren temsili görsel',
    missionLabel: 'Amacımız', missionTitle: 'Çalışma ilkelerimiz',
    missionText: 'Modern teknolojiyi yüzeye uygun bir yaklaşımla birleştiriyoruz.',
    values: [
      { title: 'Teknoloji', text: 'Lazer enerjisini istenmeyen katmana yönlendiririz.' },
      { title: 'Sonuç', text: 'İşi teslim etmeden önce temizlenen yüzeyi kontrol ederiz.' },
      { title: 'İletişim', text: 'Projenizi konuşur, çalışma sürecini açıkça anlatırız.' },
    ],
    reasonsTitle: 'Neden LaserX?',
    reasons: [
      { title: 'Hassas uygulama', text: 'Seçilen alan ve katmanda kontrollü temizleme.' },
      { title: 'Kimyasal sökücü olmadan', text: 'Lazer aşamasında kimyasal boya ve pas sökücü gerekmez.' },
      { title: 'Yüzeye uygun ayarlar', text: 'Çalışma ayarları malzemeye ve kirlenme düzeyine göre seçilir.' },
      { title: 'Önce deneme', text: 'Asıl çalışmaya başlamadan küçük bir alanda sonucu kontrol ederiz.' },
      { title: 'Daha az ikincil atık', text: 'Aşındırıcı kum kullanılmaz; çıkan kalıntılar kontrollü toplanır.' },
      { title: 'Açık bir çalışma planı', text: 'Yüzey, işin kapsamı ve beklenen sonuç önceden görüşülür.' },
    ],
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
