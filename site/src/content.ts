export type Locale = 'hu' | 'en' | 'ar'

type Card = {
  title: string
  text: string
}

type StoryPoint = {
  label: string
  value: string
}

type ContactCard = {
  label: string
  value: string
}

export type LocaleContent = {
  browserTitle: string
  languageCode: string
  languageSwitcherLabel: string
  dir: 'ltr' | 'rtl'
  eyebrow: string
  headline: string
  intro: string
  heroAside: string
  heroImageAlt: string
  heroBadges: string[]
  ctaGallery: string
  ctaVideo: string
  ctaFacebook: string
  ctaTiktok: string
  ctaWhatsapp: string
  ctaMaps: string
  ctaInstall: string
  ctaOriginalVideo: string
  featureEyebrow: string
  featureTitle: string
  featureIntro: string
  features: Card[]
  storyPoints: StoryPoint[]
  storyNote: string
  showcaseEyebrow: string
  showcaseTitle: string
  showcaseIntro: string
  showcaseHighlights: string[]
  menuEyebrow: string
  menuTitle: string
  menuIntro: string
  menuVerificationTitle: string
  menuDisclaimer: string
  menuMissingSections: string[]
  galleryEyebrow: string
  galleryTitle: string
  galleryIntro: string
  gallerySourceNote: string
  menuPolicyCards: ContactCard[]
  menuPolicyNote: string
  galleryLoading: string
  galleryFallback: string
  galleryImageAlt: string
  galleryFrameLabel: string
  footerEyebrow: string
  footerTitle: string
  footerText: string
  footerNote: string
  contactCards: ContactCard[]
  qrTitle: string
  qrText: string
  qrAlt: string
}

export const localeOrder: Locale[] = ['hu', 'en', 'ar']

export const content: Record<Locale, LocaleContent> = {
  hu: {
    browserTitle: 'Sahara Restaurant | Magyarország',
    languageCode: 'HU',
    languageSwitcherLabel: 'Nyelvváltó',
    dir: 'ltr',
    eyebrow: 'Sahara Restaurant | Magyarország',
    headline: 'Autentikus hangulat, képes menü és háromnyelvű elérés egyetlen oldalon.',
    intro:
      'A Sahara Restaurant bemutatkozó oldala a tulajdonos által jóváhagyott HD videóra épül. A magyar nyelv az alapértelmezett, az angol és az arab egyetlen érintéssel elérhető.',
    heroAside: 'A galéria automatikusan a jóváhagyott videóból készül.',
    heroImageAlt: 'Sahara Restaurant hangulatkép a jóváhagyott videóból',
    heroBadges: ['Tulajdonosi HD videó', 'HU alapértelmezett | EN | AR'],
    ctaGallery: 'Menü és képek',
    ctaVideo: 'Videó megtekintése',
    ctaFacebook: 'Tulajdonos Facebook',
    ctaTiktok: 'Tulajdonos TikTok',
    ctaWhatsapp: 'WhatsApp kapcsolat',
    ctaMaps: 'Megnyitás térképen',
    ctaInstall: 'Alkalmazás telepítése',
    ctaOriginalVideo: 'Eredeti Facebook-video',
    featureEyebrow: 'Vendégélmény',
    featureTitle: 'A webhely jó forrásanyagra épít, így telefonon is gyorsan áttekinthető.',
    featureIntro:
      'A nyitó vizuál, a videós bemutató és a menügaléria ugyanabból a jóváhagyott médiaanyagból dolgozik, így a vendég minden eszközön ugyanazt a hangulatot kapja.',
    features: [
      {
        title: 'Képes menü',
        text: 'A menüt és az ételek hangulatát a videóból kivett képek mutatják meg, így a látogató azonnal végiglapozhatja a kínálat vizuális oldalát.',
      },
      {
        title: 'Három nyelv',
        text: 'A magyar a kezdő nyelv, de az angol és az arab változat is ugyanabban a felületen elérhető a különböző vendégeknek.',
      },
      {
        title: 'App-kész felület',
        text: 'A webhely telepíthető PWA-ként, így GitHub és Render után később mobilos csomagolásra is előkészített.',
      },
    ],
    storyPoints: [
      { label: 'Helyszín', value: '47.4881859, 19.0975971' },
      { label: 'Hivatalos profil', value: 'facebook.com/gorgoo.noshy' },
      { label: 'Nyitvatartás', value: 'Minden nap 8:00-15:00' },
    ],
    storyNote:
      'A helyszín pontos koordinátával van bekötve a térképhez, a nyitvatartás minden nap 8:00 és 15:00 között van, és a jelenlegi információ szerint nincs kiszállítás.',
    showcaseEyebrow: 'Médiabemutató',
    showcaseTitle: 'A videó a nyitóélmény, a menükép-galéria és a közösségi forrás közös alapja.',
    showcaseIntro:
      'A beágyazott anyag a tulajdonos által küldött HD fájl, ezért a látogatót ugyanaz a képi világ fogadja a webhelyen, mint a jóváhagyott Facebook-posztban.',
    showcaseHighlights: ['HD állóvideó', 'Jóváhagyott eredeti média', 'GitHubra és Renderre kész'],
    menuEyebrow: 'Kinyert menü',
    menuTitle: 'A videóból FFmpeg-pel kinyert, olvasható menütételek és áraik.',
    menuIntro:
      'Az alábbi lista a jóváhagyott videóból, képkocka-pontos FFmpeg kivágással mentett forrásképekből biztonsággal kiolvasható termékeket és HUF árakat mutatja.',
    menuVerificationTitle: 'Tulajdonosi ellenőrzés szükséges',
    menuDisclaimer:
      'Csak azokat a sorokat tettem közzé, amelyek az FFmpeg-pel kinyert képkockákon is kellően olvashatók maradtak. Az elmosódott vagy takart részeket szándékosan kihagytam, ezeket a tulajdonosnak még meg kell erősítenie.',
    menuMissingSections: [
      'English breakfast',
      'Levesek',
      'Saláták',
      'Gyros',
      'Kávék',
      'Teák',
      'Sültek',
      'Köretek',
    ],
    galleryEyebrow: 'Menügaléria',
    galleryTitle: 'Képek a videóból: menü, hangulat és vizuális részletek.',
    galleryIntro:
      'Az alábbi kártyák a jóváhagyott videóból készített, másodpercenként mentett képkockákból állnak, így a látogató ugyanazt a jelenetet nézheti vissza képekre bontva.',
    gallerySourceNote:
      'A galéria FFmpeg-pel kinyert képkockákat használ a videó 0-19. másodpercéről.',
    menuPolicyCards: [
      { label: 'Pénznem', value: 'Minden menütétel ára HUF-ban értendő' },
      { label: 'Ármegadás', value: 'A konkrét árakat a tulajdonos véglegesíti minden termékhez' },
      {
        label: 'Fizetés és átvétel',
        value:
          'Kérés és átvétel csak az étteremben. Fizetés helyben készpénzzel, vagy előre Revolut utalással a tulajdonosnak.',
      },
    ],
    menuPolicyNote:
      'Ez a weboldal a menü vizuális bemutatását adja. A végleges árakat a tulajdonos adja meg HUF-ban minden termékre. Kérés és átvétel csak az étteremben történik, fizetés helyben készpénzzel, vagy igény esetén Revolut utalással a tulajdonosnak. Termékekkel kapcsolatos egyeztetés WhatsAppon: +36 30 900 0866.',
    galleryLoading: 'A menügaléria most készül a jóváhagyott videóból.',
    galleryFallback:
      'Ha a galéria később töltene be, a teljes jóváhagyott videót a fenti szakaszban azonnal meg lehet nézni.',
    galleryImageAlt: 'Kocka a Sahara Restaurant jóváhagyott videójából',
    galleryFrameLabel: 'Kép',
    footerEyebrow: 'Következő lépés',
    footerTitle: 'Készen áll a publikációhoz, és egyszerűen továbbvihető alkalmazás irányba is.',
    footerText:
      'Ez a változat már alkalmas GitHub-feltöltésre és Render deployra, valamint mobilos kezdőképernyős telepítésre is. A kapcsolatblokk most már tartalmazza a pontos térképes helyet, a napi nyitvatartást és a kiszállítás státuszát is.',
    footerNote:
      'Kapcsolat WhatsAppon: +36 30 900 0866. Revolut HUF utaláshoz használd az alábbi kedvezményezett és banki adatokat.',
    contactCards: [
      { label: 'Térképes hely', value: '47.4881859, 19.0975971' },
      { label: 'Nyitvatartás', value: 'Minden nap 8:00-15:00' },
      { label: 'Szállítás', value: 'Csak éttermen belül, készpénz vagy Revolut a tulajdonosnak' },
      { label: 'WhatsApp kapcsolat', value: '+36 30 900 0866' },
      { label: 'Elfogadott valuták', value: 'HUF (magyar forint) és EUR (euro) - készpénz vagy Revolut' },
      {
        label: 'Revolut QR kód',
        value: 'Revolut átutaláshoz beolvashatod a QR-kódot az alkalmazásban',
      },
      {
        label: 'Revolut HUF utalás',
        value: 'Kedvezményezett: Girgis Slwans | IBAN: LT62 3250 0793 2162 1883 | BIC/SWIFT: REVOLT21',
      },
      {
        label: 'Revolut bank és levelező bank',
        value:
          'Revolut Bank UAB, Konstitucijos ave. 21B, 08130 Vilnius, Lithuania | Correspondent BIC: BARCGB22',
      },
    ],
    qrTitle: 'QR-kód megnyitása térképen',
    qrText: 'Szkenneld és nyisd meg közvetlenül a Google Maps helyszínt.',
    qrAlt: 'QR-kód a Sahara Restaurant Google Maps helyéhez',
  },
  en: {
    browserTitle: 'Sahara Restaurant | Hungary',
    languageCode: 'EN',
    languageSwitcherLabel: 'Language switcher',
    dir: 'ltr',
    eyebrow: 'Sahara Restaurant | Hungary',
    headline: 'Authentic atmosphere, visual menu browsing, and a polished multilingual presence.',
    intro:
      'This Sahara Restaurant landing page is built around the owner-approved HD video. Hungarian is the default language, with English and Arabic available in one tap.',
    heroAside: 'The gallery is generated directly from the approved video source.',
    heroImageAlt: 'Sahara Restaurant visual captured from the approved video',
    heroBadges: ['Owner-approved HD video', 'Default HU with EN and AR'],
    ctaGallery: 'Browse menu visuals',
    ctaVideo: 'Watch the video',
    ctaFacebook: 'Owner Facebook',
    ctaTiktok: 'Owner TikTok',
    ctaWhatsapp: 'WhatsApp contact',
    ctaMaps: 'Open map search',
    ctaInstall: 'Install the app',
    ctaOriginalVideo: 'Original Facebook video',
    featureEyebrow: 'Guest experience',
    featureTitle: 'The site is built from approved media, so it stays fast to browse and visually consistent on mobile.',
    featureIntro:
      'The hero visual, the embedded video section, and the menu gallery all come from the same source material, so guests get the same presentation across devices.',
    features: [
      {
        title: 'Visual menu flow',
        text: 'Guests can scan menu pages and food imagery as cards extracted from the approved video, which works well for quick mobile browsing.',
      },
      {
        title: 'Three-language support',
        text: 'Hungarian comes first, with English and Arabic available instantly for mixed local and international audiences.',
      },
      {
        title: 'App-ready setup',
        text: 'The project is structured as an installable PWA, making later GitHub, Render, and mobile packaging workflows more practical.',
      },
    ],
    storyPoints: [
      { label: 'Map point', value: '47.4881859, 19.0975971' },
      { label: 'Official profile', value: 'facebook.com/gorgoo.noshy' },
      { label: 'Opening hours', value: 'Daily 8:00 AM - 3:00 PM' },
    ],
    storyNote:
      'The location is now wired to the exact Google Maps coordinates, opening hours are set to daily from 8:00 AM to 3:00 PM, and the current operating note is that delivery is not available.',
    showcaseEyebrow: 'Media showcase',
    showcaseTitle: 'One approved video now powers the main story, the gallery, and the social reference point.',
    showcaseIntro:
      'The embedded media is the owner-supplied HD file, so the website reflects the same visual identity already approved on Facebook.',
    showcaseHighlights: ['HD vertical video', 'Approved original media', 'Ready for GitHub and Render'],
    menuEyebrow: 'Extracted menu',
    menuTitle: 'Menu items and prices recovered from frame-accurate FFmpeg captures.',
    menuIntro:
      'The list below contains the products and HUF prices that remained legible after extracting source frames directly from the approved video with FFmpeg.',
    menuVerificationTitle: 'Owner verification still needed',
    menuDisclaimer:
      'Only lines that stayed readable in the FFmpeg-extracted frames were published. Blurred or partially covered lines were intentionally left out and should still be confirmed by the owner before publication.',
    menuMissingSections: [
      'English breakfast',
      'Soups',
      'Salads',
      'Gyros',
      'Coffee',
      'Tea',
      'Fried dishes',
      'Side dishes',
    ],
    galleryEyebrow: 'Menu gallery',
    galleryTitle: 'Frames from the video: menu pages, mood, and restaurant visuals.',
    galleryIntro:
      'The cards below use screenshots saved every second from the approved video, so visitors can browse the source footage as a still-image sequence on the site.',
    gallerySourceNote:
      'The gallery now uses FFmpeg-extracted frames captured once per second from seconds 0 through 19 of the approved video.',
    menuPolicyCards: [
      { label: 'Currency', value: 'Every menu item price must be shown in HUF' },
      { label: 'Price source', value: 'The owner specifies the final price for each product' },
      {
        label: 'Payment and delivery policy',
        value:
          'Orders are accepted only inside the restaurant. Payment is cash at the restaurant, or optionally by Revolut transfer to the owner.',
      },
    ],
    menuPolicyNote:
      'This website presents the menu visually. Final prices should be specified by the owner in HUF for each product. Orders are accepted only inside the restaurant, with payment by cash at the restaurant, or optionally by Revolut transfer to the owner. For product updates or questions, contact WhatsApp: +36 30 900 0866.',
    galleryLoading: 'The visual menu gallery is being prepared from the approved video.',
    galleryFallback:
      'If the gallery needs a moment to load, the full approved video remains available in the section above.',
    galleryImageAlt: 'Frame captured from the Sahara Restaurant approved video',
    galleryFrameLabel: 'Frame',
    footerEyebrow: 'Next stage',
    footerTitle: 'This version is ready to publish and already structured for future app packaging.',
    footerText:
      'You can deploy this build to GitHub and Render now, while keeping a clean path toward home-screen installability and later Play Store wrapping. The contact area now includes the exact map point, daily opening hours, and delivery status.',
    footerNote:
      'WhatsApp contact: +36 30 900 0866. For HUF transfers by Revolut, use the beneficiary and bank details listed below.',
    contactCards: [
      { label: 'Map location', value: '47.4881859, 19.0975971' },
      { label: 'Opening hours', value: 'Daily 8:00 AM - 3:00 PM' },
      { label: 'Delivery', value: 'Inside restaurant only, cash or Revolut to the owner' },
      { label: 'WhatsApp', value: '+36 30 900 0866' },
      { label: 'Accepted currencies', value: 'HUF (Hungarian Forint) and EUR (Euro) - cash or Revolut' },
      {
        label: 'Revolut QR code',
        value: 'Scan the QR code in Revolut app to send money instantly',
      },
      {
        label: 'Revolut HUF transfer',
        value: 'Beneficiary: Girgis Slwans | IBAN: LT62 3250 0793 2162 1883 | BIC/SWIFT: REVOLT21',
      },
      {
        label: 'Bank and correspondent BIC',
        value:
          'Revolut Bank UAB, Konstitucijos ave. 21B, 08130, Vilnius, Lithuania | Correspondent BIC: BARCGB22',
      },
    ],
    qrTitle: 'Scan the location QR code',
    qrText: 'Open the exact Google Maps location directly from your phone.',
    qrAlt: 'QR code for the Sahara Restaurant Google Maps location',
  },
  ar: {
    browserTitle: 'Sahara Restaurant | Hungary',
    languageCode: 'AR',
    languageSwitcherLabel: 'تبديل اللغة',
    dir: 'rtl',
    eyebrow: 'مطعم Sahara | المجر',
    headline: 'اجواء اصيلة وقائمة مرئية وحضور احترافي بثلاث لغات.',
    intro:
      'تم بناء صفحة مطعم Sahara اعتمادا على الفيديو عالي الجودة الذي وافق عليه صاحب المطعم. اللغة الافتراضية هي المجرية مع توفر الانجليزية والعربية فورا.',
    heroAside: 'يتم توليد المعرض مباشرة من الفيديو المعتمد.',
    heroImageAlt: 'صورة من الفيديو المعتمد لمطعم Sahara',
    heroBadges: ['فيديو HD معتمد من المالك', 'المجرية افتراضيا مع الانجليزية والعربية'],
    ctaGallery: 'تصفح صور القائمة',
    ctaVideo: 'مشاهدة الفيديو',
    ctaFacebook: 'فيسبوك المالك',
    ctaTiktok: 'تيك توك المالك',
    ctaWhatsapp: 'واتساب المالك',
    ctaMaps: 'فتح البحث في الخريطة',
    ctaInstall: 'تثبيت التطبيق',
    ctaOriginalVideo: 'الفيديو الاصلي على فيسبوك',
    featureEyebrow: 'تجربة الضيف',
    featureTitle: 'الموقع مبني من وسائط معتمدة ليبقى سريعا وواضحا على الهاتف ايضا.',
    featureIntro:
      'الصورة الرئيسية وقسم الفيديو ومعرض القائمة كلها تعتمد على نفس المادة الاصلية، لذلك يحصل الزائر على نفس الهوية البصرية على كل جهاز.',
    features: [
      {
        title: 'قائمة مرئية',
        text: 'يمكن للزائر استعراض صفحات القائمة وصور الاطباق عبر بطاقات مولدة من الفيديو المعتمد، وهذا مناسب جدا للتصفح السريع على الهاتف.',
      },
      {
        title: 'دعم ثلاث لغات',
        text: 'الواجهة تبدأ بالمجرية، مع امكانية التبديل الفوري الى الانجليزية او العربية لخدمة جمهور متنوع داخل المجر.',
      },
      {
        title: 'جاهز كتطبيق ويب',
        text: 'المشروع مهيأ كتطبيق ويب قابل للتثبيت، مما يسهل النشر على GitHub وRender لاحقا وتجهيزه للتغليف كتطبيق.',
      },
    ],
    storyPoints: [
      { label: 'الموقع على الخريطة', value: '47.4881859, 19.0975971' },
      { label: 'الملف الرسمي', value: 'facebook.com/gorgoo.noshy' },
      { label: 'ساعات العمل', value: 'يوميا 8:00 ص - 3:00 م' },
    ],
    storyNote:
      'تم ربط الموقع الان باحداثيات Google Maps الدقيقة، وساعات العمل يوميا من 8:00 صباحا حتى 3:00 مساء، ولا توجد خدمة توصيل حاليا.',
    showcaseEyebrow: 'عرض الوسائط',
    showcaseTitle: 'فيديو واحد معتمد يشغل القصة الرئيسية والمعرض ومرجع المحتوى الاجتماعي.',
    showcaseIntro:
      'الوسائط المضمنة هي نفس الملف عالي الجودة الذي تم تزويده من صاحب المطعم، لذلك يعكس الموقع نفس الهوية المرئية المعتمدة على فيسبوك.',
    showcaseHighlights: ['فيديو عمودي HD', 'وسائط اصلية معتمدة', 'جاهز للنشر على GitHub وRender'],
    menuEyebrow: 'القائمة المستخرجة',
    menuTitle: 'العناصر والاسعار المقروءة التي تم استخراجها من لقطات الشاشة الاوضح.',
    menuIntro:
      'القائمة التالية تعرض المنتجات واسعار HUF التي ظلت واضحة بعد استخراج لقطات المصدر مباشرة من الفيديو المعتمد باستخدام FFmpeg.',
    menuVerificationTitle: 'ما زال يلزم تاكيد المالك',
    menuDisclaimer:
      'تم نشر السطور التي بقيت مقروءة فقط في اللقطات المستخرجة عبر FFmpeg. اما السطور الضبابية او المغطاة جزئيا فتم تركها عمدا ويجب ان يؤكدها المالك قبل النشر.',
    menuMissingSections: [
      'فطور انجليزي',
      'شوربات',
      'سلطات',
      'جيروس',
      'قهوة',
      'شاي',
      'المقليات',
      'الاطباق الجانبية',
    ],
    galleryEyebrow: 'معرض القائمة',
    galleryTitle: 'لقطات من الفيديو: صفحات القائمة والاجواء والتفاصيل البصرية.',
    galleryIntro:
      'البطاقات التالية تستخدم لقطات شاشة محفوظة كل ثانية من الفيديو المعتمد، حتى يتمكن الزائر من تصفح المحتوى كصور ثابتة داخل الموقع.',
    gallerySourceNote:
      'المعرض يستخدم لقطات مستخرجة عبر FFmpeg مرة كل ثانية من الثواني 0 الى 19 من الفيديو المعتمد.',
    menuPolicyCards: [
      { label: 'العملة', value: 'يجب ان تكون اسعار كل المنتجات في القائمة بالـ HUF' },
      { label: 'مصدر السعر', value: 'المالك هو من يحدد السعر النهائي لكل منتج' },
      {
        label: 'سياسة الدفع والطلب',
        value:
          'الطلب يكون فقط من داخل المطعم. الدفع نقدا داخل المطعم، او اختياريا بتحويل Revolut الى صاحب المطعم.',
      },
    ],
    menuPolicyNote:
      'هذا الموقع يعرض القائمة بشكل مرئي. يجب ان يحدد المالك السعر النهائي لكل منتج بعملة HUF. الطلب يكون فقط من داخل المطعم، والدفع نقدا داخل المطعم او اختياريا بتحويل Revolut الى صاحب المطعم. للاستفسار او تعديل الطلبات تواصل عبر واتساب: +36 30 900 0866.',
    galleryLoading: 'يتم الان تجهيز معرض القائمة من الفيديو المعتمد.',
    galleryFallback:
      'اذا احتاج المعرض الى وقت اطول للتحميل، يبقى الفيديو الكامل المعتمد متاحا في القسم السابق.',
    galleryImageAlt: 'لقطة من فيديو Sahara Restaurant المعتمد',
    galleryFrameLabel: 'لقطة',
    footerEyebrow: 'المرحلة التالية',
    footerTitle: 'هذه النسخة جاهزة للنشر ومهيأة ايضا للانتقال لاحقا نحو تطبيق فعلي.',
    footerText:
      'يمكن رفع هذا البناء الى GitHub وRender الان، مع الحفاظ على مسار واضح للتثبيت على الهاتف وتغليفه لاحقا لتجربة تطبيق. قسم التواصل يعرض الان الموقع الدقيق وساعات العمل وحالة التوصيل.',
    footerNote:
      'تواصل واتساب: +36 30 900 0866. وللتحويل بعملة HUF عبر Revolut استخدم بيانات المستفيد والبنك المعروضة ادناه.',
    contactCards: [
      { label: 'الموقع', value: '47.4881859, 19.0975971' },
      { label: 'ساعات العمل', value: 'يوميا 8:00 ص - 3:00 م' },
      { label: 'التوصيل', value: 'فقط داخل المطعم، نقدا او Revolut لصاحب المطعم' },
      { label: 'واتساب', value: '+36 30 900 0866' },
      { label: 'العملات المقبولة', value: 'HUF (الفورنت المجري) و EUR (اليورو) - نقد أو Revolut' },
      {
        label: 'رمز Revolut QR',
        value: 'امسح رمز QR في تطبيق Revolut لإرسال الأموال بسهولة',
      },
      {
        label: 'تحويل Revolut بعملة HUF',
        value: 'Beneficiary: Girgis Slwans | IBAN: LT62 3250 0793 2162 1883 | BIC/SWIFT: REVOLT21',
      },
      {
        label: 'البنك و BIC للمراسل',
        value:
          'Revolut Bank UAB, Konstitucijos ave. 21B, 08130, Vilnius, Lithuania | Correspondent BIC: BARCGB22',
      },
    ],
    qrTitle: 'امسح رمز الموقع',
    qrText: 'افتح موقع المطعم مباشرة على Google Maps من هاتفك.',
    qrAlt: 'رمز QR لموقع Sahara Restaurant على Google Maps',
  },
}