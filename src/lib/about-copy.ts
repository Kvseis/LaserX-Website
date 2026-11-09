import type { Locale } from './locales';

type Item = { title: string; text: string };
export type AboutCopy = {
  hero: [string, string]; description: string; heroAlt: string;
  servicesLink: string; technologyLink: string;
  storyLabel: string; storyTitle: string; story: string[]; storyAlt: string;
  missionLabel: string; missionTitle: string; missionText: string; values: Item[];
  reasonsTitle: string; reasons: Item[];
  surfacesTitle: string; surfacesIntro: string; surfaces: Item[];
  disclosure: string;
};

const aboutCopy: Record<Locale, AboutCopy> = {
  az: {
    hero: ['Lazer təmizləmə.', 'Səthə yeni baxış.'],
    description: 'LaserX Bakıda metal, daş və ağac səthlər üçün dəqiq, nəzarətli lazer təmizləmə xidməti göstərir.',
    heroAlt: 'Metal detalın lazerlə təmizlənməsini göstərən illüstrativ səhnə',
    servicesLink: 'Xidmətlərə baxın', technologyLink: 'Texnologiyanı tanıyın',
    storyLabel: 'Biz kimik', storyTitle: 'Materialı tanıyırıq. Uyğun üsulu seçirik.',
    story: ['Pas, boya, oksid və çirk qatlarını təmizləyərək səthləri yenidən istifadəyə hazırlayırıq.', 'Hər materialın öz xüsusiyyəti var. Buna görə işi səthin qiymətləndirilməsi və kiçik sınaq sahəsi ilə başlayırıq. Lazer parametrlərini alınan nəticəyə uyğun seçirik.'],
    storyAlt: 'Oyma daş səthin diqqətlə yoxlanmasını göstərən illüstrativ səhnə',
    missionLabel: 'Məqsədimiz', missionTitle: 'Dəqiq təmizlik. Materiala diqqət.',
    missionText: 'Müasir texnologiyanı səthə uyğun yanaşma ilə birləşdiririk.',
    values: [
      { title: 'Texnologiya', text: 'Lazer enerjisini arzuolunmaz qata yönəldirik.' },
      { title: 'Nəticə', text: 'Təmizlənmiş səthi işin sonunda yoxlayırıq.' },
      { title: 'Əlaqə', text: 'Layihəni sizinlə müzakirə edir, işin gedişini aydın izah edirik.' },
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
    surfacesTitle: 'Fərqli səthlər. Eyni diqqət.',
    surfacesIntro: 'Sənaye detallarından bərpa işlərinə qədər.',
    surfaces: [
      { title: 'Metal', text: 'Pas, oksid və sənaye örtüklərinin təmizlənməsi.' },
      { title: 'Daş', text: 'Çirk və səth qatlarının sınaq əsasında təmizlənməsi.' },
      { title: 'Ağac', text: 'Materiala uyğun boya və lak təmizləmə.' },
    ],
    disclosure: 'Bu səhifədəki vizuallar AI ilə hazırlanmış illüstrasiyalardır, real layihə və ya komanda fotoları deyil.',
  },
  en: {
    hero: ['Laser cleaning.', 'A fresh view of surfaces.'],
    description: 'LaserX provides precise, controlled laser cleaning for metal, stone and wood in Baku.',
    heroAlt: 'Illustrative scene of laser cleaning a metal component',
    servicesLink: 'View our services', technologyLink: 'See the technology',
    storyLabel: 'Who we are', storyTitle: 'Understand the material. Choose the right method.',
    story: ['We remove rust, paint, oxides and deposits to prepare surfaces for use again.', 'Every material is different. We start with a surface assessment and a small test patch, then choose laser settings based on the result.'],
    storyAlt: 'Illustrative scene of a carved stone surface being inspected',
    missionLabel: 'Our purpose', missionTitle: 'Precise cleaning. Care for the material.',
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
    surfacesTitle: 'Different surfaces. The same care.',
    surfacesIntro: 'From industrial components to restoration work.',
    surfaces: [
      { title: 'Metal', text: 'Removal of rust, oxides and industrial coatings.' },
      { title: 'Stone', text: 'Test-led removal of dirt and surface deposits.' },
      { title: 'Wood', text: 'Paint and varnish removal suited to the material.' },
    ],
    disclosure: 'Images on this page are AI-generated illustrations, not photographs of our projects or team.',
  },
  ru: {
    hero: ['Лазерная очистка.', 'Новый взгляд на поверхности.'],
    description: 'LaserX выполняет точную, контролируемую лазерную очистку металла, камня и дерева в Баку.',
    heroAlt: 'Иллюстрация лазерной очистки металлической детали',
    servicesLink: 'Посмотреть услуги', technologyLink: 'Узнать о технологии',
    storyLabel: 'Кто мы', storyTitle: 'Изучаем материал. Выбираем подходящий метод.',
    story: ['Удаляем ржавчину, краску, оксиды и загрязнения, подготавливая поверхности к дальнейшему использованию.', 'Каждый материал имеет свои особенности. Мы начинаем с оценки поверхности и пробы на небольшом участке, затем подбираем настройки по результату.'],
    storyAlt: 'Иллюстрация осмотра резной каменной поверхности',
    missionLabel: 'Наша цель', missionTitle: 'Точная очистка. Внимание к материалу.',
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
    surfacesTitle: 'Разные поверхности. Одинаковое внимание.',
    surfacesIntro: 'От промышленных деталей до реставрационных работ.',
    surfaces: [
      { title: 'Металл', text: 'Удаление ржавчины, оксидов и промышленных покрытий.' },
      { title: 'Камень', text: 'Удаление загрязнений и поверхностных слоёв с предварительной пробой.' },
      { title: 'Дерево', text: 'Удаление краски и лака с учётом особенностей материала.' },
    ],
    disclosure: 'Изображения созданы с помощью ИИ. Это иллюстрации, а не фотографии наших проектов или команды.',
  },
  tr: {
    hero: ['Lazer temizleme.', 'Yüzeylere yeni bir bakış.'],
    description: 'LaserX, Bakü’de metal, taş ve ahşap yüzeyler için hassas ve kontrollü lazer temizleme hizmeti sunar.',
    heroAlt: 'Metal bir parçanın lazerle temizlenmesini gösteren temsili görsel',
    servicesLink: 'Hizmetleri inceleyin', technologyLink: 'Teknolojiyi tanıyın',
    storyLabel: 'Biz kimiz', storyTitle: 'Malzemeyi tanırız. Uygun yöntemi seçeriz.',
    story: ['Pas, boya, oksit ve kir tabakalarını temizleyerek yüzeyleri yeniden kullanıma hazırlarız.', 'Her malzemenin özellikleri farklıdır. Yüzeyi değerlendirip küçük bir alanda deneme yapar, lazer ayarlarını sonuca göre seçeriz.'],
    storyAlt: 'Oyma taş yüzeyin incelenmesini gösteren temsili görsel',
    missionLabel: 'Amacımız', missionTitle: 'Hassas temizlik. Malzemeye özen.',
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
    surfacesTitle: 'Farklı yüzeyler. Aynı özen.',
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
