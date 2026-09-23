/*
 * AluSight — Cephe Hata & Çözüm Bilgi Tabanı
 * Kaynaklar:
 *   1. Şantiye® Dergisi, Kasım-Aralık 2022 — Erdal Özdemir Röportajı (Cephe Danışmanı)
 *   2. FMT Mühendislik — "Facade Failures Due To Project Design Development And Workmanship"
 *      R. Govind & M.H. Yılmaz, ICBEST 2017
 *   3. C. Baş, A.N. Türkeri, M.A. Lacasse — "Building Facade Failures due to Rainwater Entry in Turkey"
 *      IOP Conf. Ser.: Earth Environ. Sci. 1101 (2022) 022011
 *   4. Özdemir, E. — Saha gözlemleri (3T: Tespit, Teşhis, Tedavi)
 */

/* ───────────────────────────────────────────────────────────────────
   BÖLÜM 1 — YAĞMUR SUYU KAYNAKLARI DIŞ CEPHE HATALARI (TR Çalışması)
   460'tan fazla bina vaka incelemesi, İstanbul Beşiktaş Belediyesi saha tespitleri
   ─────────────────────────────────────────────────────────────────── */
export const RAINWATER_FAILURES = {
  claddingWalls: {
    title: 'Giydirme / Kaplama Duvar Cepheleri',
    mostCommon: 'Türkiye\'de en yaygın dış duvar tipi; sıvalı cepheler dominant',
    failuresByMaterial: {
      stucco: {
        label: 'Sıva / Sıvalı Cepheler',
        failures: [
          { name: 'Kabarcık ve Dökülme (Blistering & Exfoliation)', frequency: 'En Yaygın', cause: 'Yağmur suyu penetrasyonu, yetersiz su yalıtımı', standard: 'TS EN 998-1' },
          { name: 'Kaplama Dökülmesi (Detachment)', frequency: 'Yaygın', cause: 'Yetersiz yapışma, termal hareket', standard: 'TS EN 1015' },
          { name: 'Lekeleşme (Staining)', frequency: 'Yaygın', cause: 'Bozuk drenaj, pas geçirimi, biyolojik büyüme', standard: 'EN ISO 10077' },
          { name: 'Çatlama (Cracking)', frequency: 'Görülen', cause: 'Termal genleşme, yetersiz dilatasyon derzleri', standard: 'EN 13830' },
          { name: 'Küf Büyümesi (Mould)', frequency: 'Nadir', cause: 'İnterstitial kondensasyon, yetersiz ısı yalıtımı', standard: 'EN ISO 13788' }
        ],
        solutions: ['Hydrolik sıva uygulaması', 'ETICS sistemi yenileme', 'Derz dolgu ve hidrolik bant uygulaması', 'Yüzey kaplaması ile su iticilik kazandırma']
      },
      naturalStone: {
        label: 'Doğal Taş Kaplama',
        failures: [
          { name: 'Lekeleşme', frequency: 'En Yaygın', cause: 'Su drenajı yetersizliği, atık su sıçraması' },
          { name: 'Su Sızıntısı', frequency: 'Görülen', cause: 'Tıkalı oluklarda taşma, dolgu derz bozulması' },
          { name: 'Kaplama Dökülmesi', frequency: 'Görülen', cause: 'Yapıştırıcı yetersizliği; vidayla onarım yanlışlığı' }
        ],
        solutions: ['Mevkide drenaj oluğu kontrolü', 'Derz sızdırmazlık yenileme', 'Mekanik ankraj takviyesi']
      },
      ceramicBrick: {
        label: 'Seramik / Tuğla Kaplama',
        failures: [
          { name: 'Kaplama Dökülmesi', frequency: 'En Yaygın', cause: 'Mekanik etkiler, donma-çözülme döngüsü' },
          { name: 'Eflorensan (Beyazlaşma)', frequency: 'Yaygın', cause: 'Tuz geçişi, yüksek su emilimi' },
          { name: 'Lekeleşme', frequency: 'Görülen', cause: 'Atmosferik kirlilik, ıslak-kuru çevrimleri' }
        ],
        solutions: ['Düşük su emilimli malzeme seçimi', 'Derz iyileştirmesi', 'Yüzey emprenye']
      },
      timber: {
        label: 'Ahşap Kaplama',
        failures: [
          { name: 'Boya Kabarcık ve Dökülmesi', frequency: 'En Yaygın', cause: 'Su sıçraması (zemin seviyesi), yetersiz damlalık' },
          { name: 'Şişme ve Kırılma', frequency: 'Görülen', cause: 'Nem emilimi, yanlış epoksi uygulaması' },
          { name: 'Yosun/Liken Büyümesi', frequency: 'Görülen', cause: 'Saçak drenajı eksikliği' }
        ],
        solutions: ['Damlalık detayı revizesi', 'UV dirençli koruyucu kaplama', 'Mekanik drenaj sistemi']
      },
      compositePanels: {
        label: 'Kompozit Panel',
        failures: [],
        note: 'Araştırmalarda incelenen binalarda herhangi bir hasar gözlemlenmedi (en güvenilir sistem)'
      }
    }
  },

  stickPanelSystems: {
    title: 'Stick / Panel Duvar Sistemleri (Giydirme Cephe)',
    failuresByType: [
      { name: 'Mastik/Sealant Bozulması → Su Hava Sızıntısı', frequency: 'En Yaygın', cause: 'Yaşlanma, UV, yanlış uygulama', solution: 'ASTM C1193 standardına uygun sealant değişimi', standard: 'ASTM C1193 / EN ISO 11600' },
      { name: 'Cam Arası Su Buharı (IGU Bozulması)', frequency: 'Yaygın', cause: 'Üretim hatası veya kurucunun eksikliği', solution: 'IGU değişimi, EN 1279 uygunluğu', standard: 'EN 1279' },
      { name: 'Su Membranı Yanlış Konumlandırma', frequency: 'Yaygın', cause: 'Su membranının sisteme göre yanlış yüzde uygulanması (bkz. Govind-Yılmaz)', solution: 'Membranı sistemin iç yüzeyine al, drenaj boruları ekle', standard: 'EN 12208' },
      { name: 'Dilatasyon/Genleşme Derzinin Tıkanması', frequency: 'Yaygın', cause: 'Geçici ayar vidaları / spacer\'lar sökülmeden bırakıldı', solution: 'Tüm geçici elemanları söküp dilatasyon boşlukları temizle', standard: 'EN 13830' }
    ]
  },

  windowSystems: {
    title: 'Pencere ve Pencere-Duvar Arayüzü',
    failures: [
      { location: 'Çerçeve-Cam Arayüzü', failure: 'Sealant/mastik bozulmasından su sızıntısı', material: 'Ahşap, Alüminyum, PVC tüm tiplerde', frequency: 'En Yaygın', solution: 'Yeni nötral/asidik silikon uygulaması', standard: 'ASTM C1193' },
      { location: 'Denizlik (Sill)', failure: 'Yetersiz eğimden staining; yetersiz damlalık detayı', frequency: 'Yaygın', solution: 'Min. 5° eğim, 25mm damlalık profili', standard: 'EN 14351-1' },
      { location: 'Ahşap Çerçeve', failure: 'Boya kabarcık/dökülmesi', frequency: 'En Yaygın (ahşap)', solution: 'Zemin astarı + 2 kat UV boya + yıllık bakım', standard: 'EN 927' },
      { location: 'Çerçeve-Duvar Arayüzü', failure: 'Mastik eksikliği / derzde boşluk', frequency: 'Görülen', solution: 'Polietilenli köpük rodaj + tek komponentli PU foam + silikon üst kaplama', standard: 'EN ISO 11600' }
    ]
  }
}

/* ───────────────────────────────────────────────────────────────────
   BÖLÜM 2 — TASARIM VE UYGULAMA HATALARININ TİPOLOJİSİ
   Kaynak: FMT Mühendislik (Govind & Yılmaz, ICBEST 2017) + Erdal Özdemir
   ─────────────────────────────────────────────────────────────────── */
export const DESIGN_APPLICATION_FAILURES = [
  {
    id: 'DAF-001',
    title: 'Su Membranı Yanlış Konumlandırması',
    phase: 'Uygulama',
    severity: 'Kritik',
    description: 'Su membranının sisteme ters yüzde (dışa) uygulanması. Su, sistemin içinde birikir.',
    realCase: 'İstanbul 2014 — Stick CW Sistemi; şantiye ekibi teknik resme göre uyguladı fakat temel fizik bilinmiyordu.',
    solution: 'Membranı sistemin iç yüzeyine al; drenaj boruları ve fitting ekle.',
    standard: 'EN 12208 — Su geçirimsizlik sınıfı E900',
    prevention: 'Uygulama sırasında bağımsız cephe danışmanı denetimi'
  },
  {
    id: 'DAF-002',
    title: 'Termal Genleşme Derzini Tıkama',
    phase: 'Uygulama',
    severity: 'Yüksek',
    description: 'Geçici ayar vidaları veya spacer\'lar dilatasyon derzinden sökülmeden bırakıldı. Termal hareket engellenir; cam/profil kırılmaları ve su sızıntısı oluşur.',
    realCase: 'İstanbul ve Moskova\'da 4 farklı şantiyede aynı hata tespit edildi (Govind-Yılmaz 2017).',
    solution: 'Tüm geçici elemanları ve spacer\'ları söküp dilatasyon boşluklarını temizle. EN 13830\'a göre doğrula.',
    standard: 'EN 13830 — Dilatasyon ve bağlantı detayları',
    prevention: 'Montaj tamamlanmadan önce dilatasyon boşluklarını kontrol et; kural: "hiçbir geçici eleman kalmasın"'
  },
  {
    id: 'DAF-003',
    title: 'Yapı Hareketlerinin Göz Ardı Edilmesi',
    phase: 'Tasarım',
    severity: 'Kritik',
    description: 'Binanın yapısal hareketleri (rüzgar, sismik, termal) cephe detaylarına yansıtılmamış. Camlar kırılır, derzler açılır.',
    realCase: 'Mumbai\'de unitize cam cephe — aşırı derz hareketi 68 cam panoyu kırdı.',
    solution: 'Stack joint ve mullion detaylarında yeterli hareket payı tasarla. EN 13830 bölüm 7',
    standard: 'EN 13830 / ASTM E1399',
    prevention: 'Tasarım aşamasında yapı mühendisiyle koordinasyon şart'
  },
  {
    id: 'DAF-004',
    title: 'Isı Köprüsü (Thermal Bridge)',
    phase: 'Tasarım',
    severity: 'Yüksek',
    description: 'Alüminyum taşıyıcı elemanların yalıtımsız geçişleri. İç yüzeyde yoğuşma, küf, ısı kaybı.',
    realCase: 'Türkiye\'deki binaların %95\'inden fazlasında ısı yalıtım sorunu (Özdemir, 2022).',
    solution: 'Termal mola (thermal break) profiller kullan. Flixo veya THERM ile hesapla.',
    standard: 'EN ISO 10077-2 / TS 825',
    prevention: 'Profil seçiminde termal mola koşulu şart; penetrasyonlarda köpük + bantla ısı köprüsünü kes'
  },
  {
    id: 'DAF-005',
    title: 'Yanlış Silikon / Mastik Seçimi veya Uygulaması',
    phase: 'Uygulama',
    severity: 'Yüksek',
    description: 'Yanlış tip silikon (asidik/nötr karışımı), yetersiz açıklık, rodaj malzemesi eksikliği. Erken çatlama, adhezyon kaybı, su girişi.',
    realCase: 'Türkiye genelinde cephe firmalarının büyük çoğunluğu silikon tiplerini bilmez (Özdemir, 2022).',
    solution: 'ASTM C1193 uygulaması: backer rod + %25 hareket kapasiteli sealant; cam-metal arası nötr silikon',
    standard: 'ASTM C1193 / EN ISO 11600 Sınıf 25LM',
    prevention: 'Sealant seçim matrisi oluştur: substrat + hareket kapasitesi + UV maruziyeti'
  },
  {
    id: 'DAF-006',
    title: 'Yanlış Vida / Bağlantı Elemanı Seçimi',
    phase: 'Uygulama',
    severity: 'Orta',
    description: 'Yanlış vida tipi (trompet başlı vs. yuvarlak başlı), yanlış paslanmaz çelik sınıfı, elektrokimyasal korozyon riski.',
    realCase: 'Türkiye\'de cephe firmalarının büyük çoğunluğu hangi vidanın nerede kullanılacağını bilmez (Özdemir, 2022).',
    solution: 'A4-316 SS vidalar agresif ortamlarda, A2-304 SS normal ortamlarda. Alüminyum-çelik temas noktalarında galvanik yalıtım şeridı.',
    standard: 'EN 1090-1 / EN ISO 3506',
    prevention: 'Teknik şartnameye bağlantı elemanı matrisi ekle'
  },
  {
    id: 'DAF-007',
    title: 'Denizlik (Sill) Eğimi Yetersizliği',
    phase: 'Tasarım/Uygulama',
    severity: 'Orta',
    description: 'Yetersiz ya da negatif denizlik eğimi. Durgun su birikir, sealant bozulur, duvar lekelenir.',
    realCase: 'Alan araştırmalarında en sık pencere-duvar arayüzü sorunu (Baş vd., 2022).',
    solution: 'Min. 5°-15° dışa eğim. 25mm damlalık uzantısı. Damlalık altında yağmur kesiği (kerf).',
    standard: 'EN 14351-1 / DIN 18008',
    prevention: 'Pencere montaj detayına mutlaka sill eğimi ve damlalık kotu göster'
  },
  {
    id: 'DAF-008',
    title: 'Mantolama Hataları',
    phase: 'Uygulama',
    severity: 'Yüksek',
    description: 'Çivi sayısı az, sıva kalınlığı yetersiz, köşe profilleri eksik, ısı yalıtım malzeme kalınlığı TS 825\'i karşılamıyor.',
    realCase: 'Türkiye\'deki mantolama uygulamalarının %95\'i yanlış veya eksik (Özdemir, 2022).',
    solution: 'TS EN 13499/13500 ETICS standardına uygun; bölge ısı iletkenlik katsayısı hesabı şart; ankraj dübel sayısı ≥6/m²',
    standard: 'TS EN 13499 / TS EN 13500 / TS 825',
    prevention: 'Bağımsız denetim olmadan hiçbir mantolama teslim alınmamalı'
  },
  {
    id: 'DAF-009',
    title: 'IGU (Yalıtımlı Cam Birimi) Bozulması',
    phase: 'Üretim/Uygulama',
    severity: 'Orta',
    description: 'Cam arası yoğuşma (buğu). Kurutucu malzeme (desiccant) bozulmuş veya hatalı üretilmiş.',
    realCase: 'Stick ve panel sistemlerde en yaygın görülen arıza (Baş vd., 2022).',
    solution: 'IGU değişimi. EN 1279-2 ve EN 1279-4 uygunluk belgesi isteme.',
    standard: 'EN 1279',
    prevention: 'CE belgesiz IGU kullanmama; şantiyede cam saklama koşullarına dikkat et'
  }
]

/* ───────────────────────────────────────────────────────────────────
   BÖLÜM 3 — YALITIM DETAY ÇÖZÜM REHBERİ
   ─────────────────────────────────────────────────────────────────── */
export const INSULATION_GUIDE = {
  thermal: {
    standard: 'EN ISO 10077-2 / TS 825',
    minUValues: {
      'Istanbul (2. Bölge)': { wall: 0.60, window: 1.80 },
      'Ankara (3. Bölge)': { wall: 0.50, window: 1.60 },
      'Erzurum (4. Bölge)': { wall: 0.40, window: 1.40 }
    },
    materials: [
      { name: 'Taşyünü (MW)', lambda: 0.035, application: 'Giydirme cephe, ETICS, iç duvar' },
      { name: 'EPS (Genleştirilmiş PS)', lambda: 0.038, application: 'Mantolama, zemin, çatı' },
      { name: 'XPS (Ekstrüde PS)', lambda: 0.032, application: 'Su temasında, dış zemin' },
      { name: 'PIR Panel', lambda: 0.022, application: 'Yüksek performans sandviç panel' },
      { name: 'Aerogel Battaniye', lambda: 0.015, application: 'İnce kesitli kritik ısı köprüsü noktaları' }
    ],
    thermalBridgeSolutions: [
      'Alüminyum profil bağlantı noktalarında polietilen/poliamid termal mola şeridi',
      'EPDM köşe manşonu ile köşe ısı köprülerini kes',
      'Alt parapet geçişlerinde sürekli yalıtım katmanı sağla',
      'Pabuç (console) ankrajlarında SS izole altlık plakası kullan'
    ]
  },
  acoustic: {
    standard: 'EN ISO 10140 / TS EN ISO 717',
    minRw: { residential: 40, office: 35, hospital: 45 },
    materials: [
      { name: 'Taşyünü 80 kg/m³', Rw: '40-45 dB', application: 'Giydirme cephe dolgu' },
      { name: 'İkili cam 4+16+4 Ar', Rw: '34 dB', application: 'Pencere, fasad' },
      { name: 'İkili cam 8+20+8 Ar (lamine)', Rw: '42 dB', application: 'Yüksek trafik cephesi' },
      { name: 'Akustik silikon derzler', note: 'Tüm kenar boşluklarını rodaj + silikon ile kapat' }
    ]
  },
  waterproofing: {
    standard: 'ASTM C1193 / EN ISO 11600 / EN 12208',
    sealantMatrix: [
      { substrate: 'Cam - Alüminyum', type: 'Nötr silikon', movementCapacity: '±25%', standard: 'EN ISO 11600 Sınıf 25LM' },
      { substrate: 'Beton - Beton', type: 'Polisülfit veya PU', movementCapacity: '±12.5%', standard: 'ISO 11600 Sınıf 12.5E' },
      { substrate: 'Alüminyum - Alüminyum', type: 'Nötr silikon', movementCapacity: '±25%', standard: 'EN ISO 11600 Sınıf 25LM' },
      { substrate: 'Ahşap - Beton', type: 'MS polimer veya PU', movementCapacity: '±12.5%', standard: 'ISO 11600 Sınıf 12.5E' }
    ],
    applicationRules: [
      'Rodaj (backer rod) çapı derz genişliğinin %25 fazlası olmalı',
      'Sealant derinliği = genişliğin yarısı (min. 6mm, max. 12mm)',
      'Uygulama sıcaklığı +5°C ile +40°C arasında olmalı',
      'Yüzey kuru, toz ve yağdan arınmış olmalı; primer uygula',
      'Cam kenarda maskeleme bandı kullanarak temiz hat oluştur'
    ]
  }
}

/* ───────────────────────────────────────────────────────────────────
   BÖLÜM 4 — HIZLI TANI (3T: TESPİT → TEŞHİS → TEDAVİ)
   Erdal Özdemir metodu
   ─────────────────────────────────────────────────────────────────── */
export const QUICK_DIAGNOSIS = {
  visualSigns: [
    {
      sign: 'Beyaz tuz çiçeklenmesi (eflorensan)',
      possibleCauses: ['Su penetrasyonu + tuz taşınması', 'Yetersiz harç suyu oranı', 'Donma-çözülme çevrimi'],
      urgency: 'Orta',
      firstAction: 'Kuru fırçayla temizle, su penetrasyon kaynağını bul ve kapat'
    },
    {
      sign: 'Kahverengi/pas rengi leke',
      possibleCauses: ['Paslanmaz olmayan bağlantı elemanı korozyonu', 'Pas akıntısı (gutter)', 'Betonarmeden demir paslanması'],
      urgency: 'Yüksek',
      firstAction: 'Leke kaynağını bul; yanlış vida/bağlantı ise SS ile değiştir; beton ise karbonatlaşma testi yap'
    },
    {
      sign: 'Silikon / mastik çatlağı, boşluk',
      possibleCauses: ['Yaşlanma (UV)', 'Yanlış silikon tipi', 'Yetersiz yüzey hazırlığı', 'Termal hareket > kapasite'],
      urgency: 'Yüksek',
      firstAction: 'Eski silikonu tamamen sök, yüzeyi temizle, primer uygula, EN ISO 11600 uyumlu nötr silikon uygula'
    },
    {
      sign: 'Cam arası yoğuşma (buğu)',
      possibleCauses: ['IGU desiccant bozulması', 'Kenar bant sealant hasarı'],
      urgency: 'Orta',
      firstAction: 'IGU değişimi; yeni IGU\'da EN 1279 belgesini kontrol et'
    },
    {
      sign: 'İç yüzeyde rutubet/küf',
      possibleCauses: ['Isı köprüsü (thermal bridge)', 'Yetersiz havalandırma', 'Su sızıntısı'],
      urgency: 'Kritik',
      firstAction: 'Termal kamera ile ısı köprüsü haritalandır; Flixo ile hesapla; termal mola profil uygula'
    },
    {
      sign: 'Profil veya camlarda dikey/yatay kırık',
      possibleCauses: ['Termal genleşme derzi tıkanmış', 'Yapısal hareket payı yetersiz', 'Yanlış montaj yüklemesi'],
      urgency: 'Kritik',
      firstAction: 'Acil destek/mesnet kontrolü; dilatasyon derzlerini temizle; statik hesap yaptır'
    },
    {
      sign: 'Cephe kaplaması yerinden oynamış / sarkıyor',
      possibleCauses: ['Ankraj korozyonu', 'Yetersiz bağlantı sayısı', 'Yanlış ankraj tipi'],
      urgency: 'Kritik',
      firstAction: 'Bölgeyi güvenli hale getir (emniyet kordonla), tüm bağlantıları denetle, gerekirse söküp yeniden monte et'
    },
    {
      sign: 'Yağmurda su içeri sızıyor',
      possibleCauses: ['Sealant bozulması', 'Su membranı yanlış konumlu', 'Drenaj sistemi tıkalı/eksik', 'Denizlik eğimi yetersiz'],
      urgency: 'Kritik',
      firstAction: 'Sızıntı kaynağını hortum testi ile belirle; en yakın derz ve bağlantıyı kontrol et'
    }
  ]
}

/* ───────────────────────────────────────────────────────────────────
   BÖLÜM 5 — SEKTÖR PRATİK BİLGİSİ (Özdemir, 2022)
   ─────────────────────────────────────────────────────────────────── */
export const INDUSTRY_KNOWLEDGE = {
  turkeyStats: [
    'Türkiye\'deki binaların %95\'inden fazlasında ısı yalıtımı sorunu mevcuttur',
    'Apartman mantolama uygulamalarının %95\'i yanlış veya eksik yapılmıştır',
    'Cephe firmalarının büyük çoğunluğu silikon tipleri ve vida seçimini bilmemektedir',
    'Montaj işçiliği cephe maliyetinin %30\'unu oluşturmakta ancak denetim mekanizması yoktur',
    'Türkiye\'de cephe sektörünü denetleyen resmi bir sistem bulunmamaktadır'
  ],
  keyPrinciples: [
    'Her cephede Amerika yeniden keşfedilir — 3. işte bile başarılı firma hata yapabilir; denetim şarttır',
    'Cephe = strüktür: taşıyıcı, yalıtım ve bağlantı katmanlarının anatomisi var; mühendislik disiplini gerekir',
    'Konsept tasarım + strüktürel tasarım ayrıdır; mimarın her ikisini de gözetmesi gerekir',
    '3T Metodu: Tespit → Teşhis → Tedavi; kökene inmeden tedavi yüzeysel kalır',
    'İyi danışmanlık, maliyetin 50 katını yatırımcıya geri kazandırır (kronik sorunları önler)',
    'Standart eğitim denetim sertifika: 1945 sonrası Avrupa\'dan bile gerideyiz',
    'İklim koşulları (Astana: -40°C ile +51°C arası fark) bağlantı elemanlarını ve malzemeleri kökten etkiler'
  ],
  commonMistakeMatrix: [
    { who: 'Tasarım Ekibi', mistake: 'Strüktürel cephe tasarımını ihmal, yapı hareketlerini görmezden gelme' },
    { who: 'Shop Drawing Hazırlayıcısı', mistake: 'Temel fizik kurallarını bilmeden detay çizimi' },
    { who: 'Montaj Ekibi', mistake: 'Doğru çizimleri bile yanlış uygulama (dilatasyon spacer bırakma, membran ters koyma)' },
    { who: 'İş Veren', mistake: 'Bağımsız cephe danışmanı tutmamak, en düşük fiyatı seçmek' },
    { who: 'Malzeme Tedarikçisi', mistake: 'Test sertifikası fotokopileri gerçeği yansıtmayabilir; bağımsız test şart' }
  ]
}

/* ───────────────────────────────────────────────────────────────────
   BÖLÜM 6 — STANDARTLAR REFERANSı
   ─────────────────────────────────────────────────────────────────── */
export const STANDARDS_REFERENCE = [
  { code: 'EN ISO 10077-2', topic: 'Pencere/kapı/perde duvar ısıl performansı — çerçeve U değeri hesabı' },
  { code: 'EN ISO 13788', topic: 'Yüzey sıcaklığı ve interstitial kondensasyon değerlendirmesi' },
  { code: 'EN 1027', topic: 'Pencere ve kapı — su geçirimsizlik testi metodu' },
  { code: 'EN 12208', topic: 'Pencere ve kapı — yağmur suyu geçirimsizlik sınıflandırması (E900 = max)' },
  { code: 'EN 13830', topic: 'Giydirme cephe (curtain wall) ürün standardı' },
  { code: 'EN 1090-1', topic: 'Çelik ve alüminyum yapısal ürün CE uygunluğu' },
  { code: 'TS EN 14351-1', topic: 'Pencere ve dış kapılar ürün standardı (CE işareti)' },
  { code: 'TS 825', topic: 'Binalarda ısı yalıtım kuralları (Türk standardı, bölgesel U değerleri)' },
  { code: 'ASTM C1193', topic: 'Silikon sealant uygulama rehberi (altın standart)' },
  { code: 'EN ISO 11600', topic: 'Binalarda kullanılan sealantların sınıflandırması (25LM, 12.5E vb.)' },
  { code: 'EN 1279', topic: 'Cam — izole cam birimleri (IGU) — ürün standardı' },
  { code: 'ISO 9001:2015', topic: 'Kalite yönetim sistemi' },
  { code: 'ASTM E2128', topic: 'Dış duvar su sızıntısı inceleme rehberi' },
  { code: 'EN ISO 140', topic: 'Ses yalıtımı ölçümü' }
]

/* ───────────────────────────────────────────────────────────────────
   BÖLÜM 7 — GÖRSEL VAKA ÇALIŞMALARI (Fotoğraf & Detay Çizimleri)
   Kaynak: Govind & Yılmaz, ICBEST 2017; FMT Mühendislik Saha Arşivi
   ─────────────────────────────────────────────────────────────────── */
export const VISUAL_CASE_STUDIES = [
  {
    id: 'VCS-001',
    title: 'Mumbai Unitize Giydirme Cephe — 570 Cam Kırığı',
    system: 'Unitize Curtain Wall (Perde Duvar)',
    location: 'Mumbai, Hindistan',
    scale: '7.000 m² (kırılmaların gerçekleştiği kısmi alan)',
    failureTrigger: 'Tasarım rüzgar yükünün çok altında periyodik rüzgar gusts\'ı',
    buildingBehaviour: 'İki bina bloğu arasında cephe düzlemine paralel yanal hareket',
    rootCauses: [
      'Büyük cephe paneli hareketleri — paneller hizasından çıktı',
      'Paneller eski konumuna dönmedi → kalıcı deformasyon',
      'Braket sistemi ve bağlantılar yapı hareketini karşılayacak şekilde tasarlanmamış',
      'Stack joint ve mullion derz boşlukları yetersiz hareket payı bırakılmış'
    ],
    visualSigns: ['Cephe yüzeyinde rastgele dağılmış eksik/kırık cam panolar', 'Panolar arasında derz açılması veya kapanması'],
    solution: 'Braket sistemini yeniden boyutlandır; hareket toleranslı stack joint tasarla; EN 13830 Bölüm 7 dilatasyon hesabı',
    standard: 'EN 13830 / ASTM E1399',
    lessonLearned: 'Yapı hareketleri tasarım rüzgar yükünden bağımsız gerçekleşebilir; kalıcı hareket toleransı (ratchet effect) mutlaka hesaba katılmalı'
  },
  {
    id: 'VCS-002',
    title: 'Unitize CW Panel Derz Arıza Modları',
    system: 'Unitize Curtain Wall',
    failureModes: [
      { mode: 'Panel Joints Closed (Kapalı)', visual: 'Derzler sıfırlanmış, cam veya profil basınç altında', risk: 'Cam kırılması, profil burkulması' },
      { mode: 'Panel Joints Ideal (İdeal)', visual: 'Eşit dağılmış derz boşlukları, sealant gergin değil', risk: 'Risk yok — hedef durum' },
      { mode: 'Panel Joints Opened Up (Açılmış)', visual: 'Derzlerde aşırı açılma, sealant kopması', risk: 'Hava ve su sızıntısı, sealant adhezyon kaybı' }
    ],
    visualDiagnosis: 'Dış cepheden bakıldığında panel derzleri eşitsizse veya bazı noktalarda tamamen kapanmışsa yapı hareketi sorunu var',
    solution: 'Panel şantiye teslim öncesi "ideal derz boşluğu" ölçümü; termal etki hesabı ΔT × L × α',
    standard: 'EN 13830'
  },
  {
    id: 'VCS-003',
    title: 'İstanbul 2 Şantiyesi — Membrane Ters Uygulama',
    system: 'Stick Curtain Wall (Window Wall)',
    location: 'İstanbul',
    phase: 'Montaj',
    description: 'Su membranı sistemin dış yüzeyine uygulandı. Şantiye ekibi teknik resme baktı ancak temel su fiziğini (basınç farkı, kapiler etki) bilmediği için membranı doğru yüzde uygulamadı.',
    visualSigns: [
      'Alüminyum profil alt bağlantı bölgesinde siyah/EPDM membran dışta görünür',
      'Profil içinde su birikintisi veya nem izi',
      'Drenaj borusu / fitting yok'
    ],
    correctDetail: 'Membran sistemin iç yüzeyine alınmalı; drenaj fitting\'i (FS 50 A 4002 tipi, 30×13 delik, 4.8×16 inox vida) mullion profiline monte edilmeli; ön deliğe silikon enjekte',
    solution: 'Membranı söküp iç yüzeye al; her mullion dibine drenaj fitting tak; EN 12208 E klasına göre test et',
    standard: 'EN 12208 / EN 13830',
    lessonLearned: 'Su membranının hangi yüzeye gideceği teknik resimde çok açık gösterilmeli; montaj formanı eğitilmeli'
  },
  {
    id: 'VCS-004',
    title: 'Moskova Projesi — Shop Drawing Drenaj Hatası',
    system: 'Stick Curtain Wall',
    location: 'Moskova, Rusya',
    phase: 'Shop Drawing (Uygulama Detayı)',
    description: 'Rus yüklenicinin hazırladığı shop drawing\'de su drenaj boruları gösterilmemişti. Membranın konumu İstanbul vakasıyla aynı hatayı içeriyordu (farklı ülke, aynı temel fizik hatası).',
    detailObservations: [
      'Beton duvar içi yalıtım kesitleri detaylı gösterilmiş (taramalı bölgeler)',
      'Mullion-duvar bağlantı detayı çizilmiş ama drenaj yönü belirtilmemiş',
      'Mavi renk ile gösterilen su membranı konumu sisteme göre yanlış yüzde'
    ],
    solution: 'Cephe danışmanı devreye girerek shop drawing revize ettirildi; drenaj boruları eklendi',
    standard: 'EN 12208 / EN 13830',
    lessonLearned: 'Farklı ülkelerde farklı firmalar aynı temel hatayı tekrarlamaktadır — eğitim ve standartlaşma evrensel gerekliliktir'
  },
  {
    id: 'VCS-005',
    title: 'Stick CW Mullion Drenaj Fitting Doğru Detayı',
    system: 'Stick Curtain Wall',
    detailType: 'Doğru Uygulama Referans Detayı',
    components: [
      { part: 'Mullion Profil', spec: 'Düşey taşıyıcı profil (FS 50 A 4002 veya eşdeğeri)', note: '35mm genişlik kritik kesit' },
      { part: 'Drenaj Fitting', spec: 'Plastik/alüminyum drenaj fitting, 30×13mm delik', note: 'Mullion iç kanalına monte edilir' },
      { part: 'Bağlantı Vidası', spec: '4.8×16 inox (paslanmaz çelik) vida', note: 'A2-304 SS minimum; agresif ortamda A4-316 SS' },
      { part: 'Sealant', spec: 'Nötr silikon, drenaj fitting ön deliğine enjekte', note: 'ASTM C1193 uygulaması; primer zorunlu' }
    ],
    applicationRule: 'Drenaj fitting\'i mullion\'a, sisteme su girişinin bekleneceği altta kalacak şekilde (alt traversin hemen üstü) yerleştir; su, kanal içinden dışarıya bu fitting üzerinden drene olur',
    standard: 'EN 12208 / EN 13830 / ASTM C1193'
  },
  {
    id: 'VCS-006',
    title: 'Cam İçi Yoğuşma + Aşırı Derz Hareketi Hasarı',
    system: 'Unitize / Stick Curtain Wall',
    visualSigns: [
      'Cam panolar arası derzlerde su izi/leke akıntıları (dikey)',
      'Cam yüzeyinde iç yoğuşma — "buğulu cam" görünümü',
      'Cam kenarlarda koyu renk su halkası izi (IGU edge seal hasarı)',
      'Mullion yüzeyinde aluminyum anodik oksit renk değişimi'
    ],
    causes: [
      'IGU edge seal (kenar bant) hasarı → desiccant kapasitesi dolmuş',
      'Aşırı derz hareketi → sealant kopması → su sızıntısı',
      'Yanlış IGU montaj parçaları (setting block konumu)'
    ],
    solutions: [
      'IGU değişimi — EN 1279-2 ve EN 1279-4 uygunluğu kontrol et',
      'Yeni sealant: nötr silikon, EN ISO 11600 Sınıf 25LM',
      'Setting block\'ları cam ağırlık merkezini destekleyecek şekilde yeniden konumlandır (cam genişliğinin ¼ noktaları)',
      'Derz genişliği: cam boyutu/500 + 3mm minimum (termal hesap)'
    ],
    standard: 'EN 1279 / EN ISO 11600 / EN 13830'
  },
  {
    id: 'VCS-007',
    title: 'İstanbul 1 — Transom Alt Kanalında Su Birikimi ve Zemin Eflorensan',
    system: 'Stick Curtain Wall (Window Wall)',
    location: 'İstanbul',
    phase: 'Kullanım (Su sızıntısı tespiti)',
    visualSigns: [
      'Zemin beton yüzeyinde beyaz tuz çiçeklenmesi (eflorensan) — su sızıntısının yoğunlaştığı bölge',
      'Transom (yatay profil) alt kanalında kararmış nem izi',
      'İç mekanda pencere dibinde su hasarı ve kaplama dökülmesi',
      'Alüminyum profil köşelerinde koyu renk rutubet halkası'
    ],
    rootCauses: [
      'Drenaj borusu/fitting eksik → transom kanalında su birikti',
      'Su membranı yanlış yüzde → su sisteme girdi, dışarı çıkamadı',
      'Drenaj kanalı tıkalı veya eğimsiz → su iç tarafa aktı'
    ],
    solution: 'Transom alt kanalına drenaj fitting tak; membranı iç yüzeye al; zemin bağlantısında su kesme profili (eşik) ekle; eflorensan bölgesini kuru fırçayla temizle + hidrolik sıva uygula',
    standard: 'EN 12208 / ASTM C1193 / EN 13830',
    lessonLearned: 'Eflorensan (beyaz tuz birikimi) su penetrasyonunun görsel kanıtıdır — zemin seviyesinde görülüyorsa üst bağlantıdan su geliyor demektir'
  },
  {
    id: 'VCS-008',
    title: 'Stick CW Transom Kanalında Durgun Su ve Debris Birikimi',
    system: 'Stick Curtain Wall',
    phase: 'Kullanım / Bakımsızlık',
    visualSigns: [
      'Transom (alt yatay profil) kanalında durgun su birikintisi',
      'Kanal içinde kuru yaprak, toz, organik debris birikimi → drenaj tıkanması',
      'Pencere önünde zemin ıslanması — suyun iç tarafa taştığına işaret',
      'Alüminyum profil yüzeyinde koyu oxidasyon halkası'
    ],
    rootCauses: [
      'Transom drenaj delikleri tıkalı — periyodik bakım yapılmamış',
      'Kanal eğimi yetersiz veya sıfır → su birikmekte',
      'Drenaj fitting montaj edilmemiş veya tıkalı'
    ],
    solution: 'Transom kanallarını yılda 2 kez temizle (ilkbahar + sonbahar); drenaj delikleri açık tutulmalı; fitting varsa kontrol et; kanal eğimi min. 1.5% olmalı',
    maintenanceRule: 'Periyodik bakım takvimi: Her 6 ayda bir transom kanalı temizliği, her yılda bir sealant kontrolü',
    standard: 'EN 13830 / EN 14351-1',
    lessonLearned: 'İyi tasarlanmış bir sistem bile bakımsız kaldığında su sızıntısına yol açar; bakım sözleşmesi teslimle birlikte verilmeli'
  },
  {
    id: 'VCS-009',
    title: 'Membran Yanlış/Doğru Konumlandırma — Transom Kesit Şeması (Referans)',
    system: 'Stick Curtain Wall',
    type: 'Kritik Referans Şema — Doğru vs Yanlış',
    wrongDetail: {
      label: 'YANLIŞ ❌',
      description: 'Membran transom altından geçerek dışa sarılıyor; mullion hizalamasında su yolu dışarıya değil içeriye yönleniyor',
      consequence: 'Su, rüzgar basıncıyla sisteme giriyor; transom kanalında birikip iç mekana taşıyor',
      visualClue: 'Teknik çizimde membran turuncu kesik çizgi dışa doğru kapanıyor — X işareti'
    },
    correctDetail: {
      label: 'DOĞRU ✅',
      description: 'Membran transom iç yüzeyinden geçerek sistemin içine alınıyor; su dışarıya kontrollü drene oluyor',
      keyElements: [
        'Transom alt kanalında drenaj fitting',
        'Membran mullion iç kanalına bağlanıyor',
        'Su yolu: dışarı → transom kanalı → fitting → dışarıya drenaj',
        'İç mekana su ulaşmıyor'
      ],
      visualClue: 'Teknik çizimde membran turuncu kesik çizgi içe doğru kapanıyor — ✓ işareti'
    },
    physicsRule: 'Basınç farkı prensibi: Dış yüzeyde uygulanan membran rüzgar basıncı altında suyu içeriye çeker. İç yüzeyde membran + eşit basınç odası su girişini önler.',
    standard: 'EN 12208 — Rain penetration resistance (E sınıfı = max)',
    lessonLearned: 'Bu şema FMT tarafından İstanbul, Moskova ve diğer birçok şantiyede tekrarlayan hatayı düzeltmek için geliştirilmiştir'
  },
  {
    id: 'VCS-010',
    title: 'Şantiye — Membran Dışta Görünen Hatalı Montaj (İstanbul 1 Fotoğrafı)',
    system: 'Stick Curtain Wall (Window Wall)',
    phase: 'Montaj Hatası',
    visualSigns: [
      'Siyah EPDM membran transom-mullion bağlantı noktasında dışarıdan görünür halde',
      'Membran alüminyum profilin dış yüzeyine yapışık — sistem dışında',
      'Transom kanalında drenaj borusu / fitting yok',
      'Profil bağlantı noktasında nem/rutubet izi'
    ],
    wrongBehaviour: 'Şantiye ekibi teknik resme bakarak membranı uyguladı; ancak temel su fiziği (basınç farkı, kapiler etki) bilinmediği için membranı dış yüzeye taktı',
    correctAction: 'Membranı tamamen sök; iç yüzeye yeniden uygula; her transom altına drenaj fitting tak; EN 12208 hortum testi ile doğrula',
    standard: 'EN 12208 / EN 13830',
    lessonLearned: 'Teknik resim doğru olsa bile uygulamacı yanlış yapabilir — montaj formanının eğitimi ve bağımsız denetim zorunludur'
  },
  {
    id: 'VCS-011',
    title: 'Renkli Kesit Detayı — Stick CW Alt Slab Bağlantısı Doğru Uygulama',
    system: 'Stick Curtain Wall — Döşeme Alt Bağlantısı',
    type: 'Doğru Uygulama Referans Kesiti',
    components: [
      { color: 'Pembe spiral', element: 'Isı/ses yalıtımı (taşyünü/EPS)', note: 'Döşeme kenarını ve iç bölgeyi sarar; ısı köprüsünü keser' },
      { color: 'Turuncu kesik çizgi', element: 'Su membranı güzergahı', note: 'Transom iç kanalından döşeme üstüne, sonra dışarıya uzanır — hiçbir noktada dışa açılmaz' },
      { color: 'Yeşil dikey çizgi', element: 'Dış hava-su bariyeri (weather barrier)', note: 'Sol kenarda döşemeden yukarıya, cephe sistemine bağlanıyor' },
      { color: 'Siyah üçgen', element: 'Su kesme eşik profili / damlalık', note: 'Döşeme-cephe alt geçiş noktasında drenaj ve su kesme görevi' },
      { color: 'Kırmızı yatay çizgi', element: 'Mullion hizalama ekseni', note: 'Tüm bağlantıların referans ekseni; transom bu eksenle hizalanır' },
      { color: 'Sarı kutu', element: 'Genleşme/dilatasyon ödeneği', note: 'Döşeme-cephe bağlantısında yapı hareketi payı' }
    ],
    keyRules: [
      'Membran hiçbir noktada kesintisiz olmalı — iç yüzeyden döşemeye kadar',
      'Yalıtım döşeme kenarını tam sarmalı — ısı köprüsü sıfırlanmalı',
      'Eşik profili drenaj yönüne eğimli yerleştirilmeli (dışa doğru)',
      'Mullion alt ucu eşik üzerine oturmalı; alt boşluk silikon ile kapatılmalı',
      'Weather barrier döşeme-cephe geçişinde sürekli olmalı'
    ],
    standard: 'EN 13830 / EN 12208 / TS 825 / EN ISO 10077-2'
  }
]

/* ───────────────────────────────────────────────────────────────────
   BÖLÜM 8 — DOĞRU MONTAJ REFERANSLARI (Çizimlerden)
   ─────────────────────────────────────────────────────────────────── */
export const CORRECT_DETAILS = {
  drainageFitting: {
    title: 'Stick CW Mullion Drenaj Fitting Montajı (Doğru)',
    profile: 'FS 50 A 4002 — 35mm kesit genişliği',
    hole: '30×13 mm oval delik mullion yan yüzeyinde',
    fitting: 'Plastik drenaj fitting — mullion kanalına geçme',
    screw: '4.8×16 inox vida (A2 SS minimum)',
    sealant: 'Nötr silikon enjeksiyonu ön deliğe — ASTM C1193',
    rule: 'Her kat alt traversinin hemen üstüne 1 adet fitting; yatay drenaj kanalı eğimli olmalı (min. 1.5%)'
  },
  jointDesign: {
    title: 'Dilatasyon Derzi Tasarım Kuralları',
    rules: [
      'Derz genişliği = (ΔT × L × α) × güvenlik katsayısı (1.5)',
      'Alüminyum α = 23.4 × 10⁻⁶ /°C; cam α = 9 × 10⁻⁶ /°C',
      'İstanbul ΔT = yaklaşık 60°C sezonluk; hesapla',
      'Minimum panel derzi: 10mm; önerilen: 15mm (1.2m × 1.5m panel için)',
      'Tüm geçici ayar vidaları ve spacer\'lar montaj tamamlanmadan sökülmeli',
      'Derz içine rodaj malzemesi + sealant; sealant derinliği = genişliğin yarısı'
    ]
  },
  membranePosition: {
    title: 'Su Membranı Doğru Konumlandırma',
    rule: 'Membran her zaman sistemin İÇ yüzeyine uygulanır — hiçbir zaman dış yüzeye',
    physics: 'Dış yüzeyde uygulanan membran: rüzgar basınç farkı suyu içeri çeker, drenaj engellenir',
    correct: 'İç yüzey membranı + drenaj borusu: su sisteme girerse kontrollü drene olur',
    standard: 'EN 12208 — Sınıf E (max sızdırmazlık performansı)'
  }
}

/* ───────────────────────────────────────────────────────────────────
   BÖLÜM 9 — ÜÇLÜ ARAŞTIRMA SENTEZİ (Akademik Kaynaklardan)
   9A: Respondek & Chęciński — Stick CW Hata Skoring Tablosu (Polonya, 2022)
   9B: Şengün Doğan — Panel CW Performans Testleri (ODTÜ Tezi, İstanbul, 2013)
   9C: Cano vd. — 1033 Dava Analizi, Yardımcı Cephe Elemanları (İspanya, 2008-2017)
   ─────────────────────────────────────────────────────────────────── */

/* ── 9A: Stick (Post-and-Beam) Cam Cephe Hata Skoring Tablosu ─── */
export const STICK_ERROR_SCORING = {
  source: 'Respondek Z. & Chęciński K. — "Design and assembly errors in post-and-beam glass facades" (2022)',
  methodology: '5 şirketten veri; 6 kriter × 0-5 puan × ağırlık ortalaması. En kritik = global skor >3.0',
  scoringCriteria: [
    { criterion: 'Oluşma sıklığı (frekans)', weight: 0.15 },
    { criterion: 'Yapısal stabilite etkisi', weight: 0.20 },
    { criterion: 'Su geçirimsizlik etkisi', weight: 0.20 },
    { criterion: 'Isıl koruma etkisi', weight: 0.20 },
    { criterion: 'Estetik etkisi', weight: 0.10 },
    { criterion: 'Onarım güçlüğü', weight: 0.15 }
  ],
  errors: [
    {
      id: 'SE-001',
      name: 'Dolgu (Cam) Taşıyıcı Elemanların Yanlış Desteklenmesi',
      globalScore: 3.50,
      severity: 'KRİTİK',
      trDescription: 'Cam yıkama blokları (washer) yanlış konumlandırılmış veya eksik. Cam kenara yakın bölgelerde lokal gerilme → cam kenarından yayılan çatlak (cama dik yönde ilerleme)',
      trSolution: 'Cam genişliğinin ¼ noktalarına yerleştir; 2 adet setting block minimum; yük postlara (mullion) taşınmalı, traverslere değil',
      standard: 'EN 13830 / TS EN 14351-1'
    },
    {
      id: 'SE-002',
      name: 'EPDM Membran Dikkatsiz Montajı',
      globalScore: 3.30,
      severity: 'KRİTİK',
      trDescription: '"EPDM önlük" (apron) olarak da bilinen membran, alüminyum yapı ile beton/tuğla arasındaki bağlantı sızdırmazlığını sağlar. Yapıştırıcısız bırakılması, şeritler arası boşluk, yanlış yüzde uygulama → su geçirimsizliği kaybı. Bazen ısı yalıtımı da tamamen atlanıyor.',
      trSolution: 'Membranı iç yüzeye yapıştırıcıyla monte et; şeritler 50mm bindirme ile örtüştür; köşelerde kesintisiz geçiş; montaj sonrası su sızdırmazlık testi',
      standard: 'EN 12208 / EN 13830'
    },
    {
      id: 'SE-003',
      name: 'Kritik Noktalarda Yanlış Detay Çözümleri',
      globalScore: 3.25,
      severity: 'KRİTİK',
      trDescription: 'Cephenin döşemeyle bağlantısı, alt bitiş ve üst bitiş noktaları yetersiz detaylandırılmış. Bu bölgelerde su geçirimsizliği bozulur ve kenar ısı köprüleri oluşur.',
      trSolution: 'Bu kritik geçiş noktaları için ayrı detay çizimleri hazırla; ısı köprüsü hesabı yap; döşeme kenarına sürekli yalıtım katmanı',
      standard: 'EN 13830 / EN ISO 10077-2'
    },
    {
      id: 'SE-004',
      name: 'Conta (Gasket) Hatalı Montajı',
      globalScore: 2.70,
      severity: 'Yüksek',
      trDescription: 'Conta çok kısa kesilmiş → dış sızdırmazlıkta süreksizlik. Conta profilden çıkmış veya burulmuş. Uzun vadede sürekli su lekesi (kalıcı leke) ve IGU kenarından su sızıntısı.',
      trSolution: 'Contaları ölçüye göre kes; uçları yapıştır ve profile yerleştir; köşelerde özel köşe parçaları kullan; montaj sonrası görsel kontrol',
      standard: 'EN 13830'
    },
    {
      id: 'SE-005',
      name: 'Post (Mullion) Düşeysizliği',
      globalScore: 2.50,
      severity: 'Orta',
      trDescription: 'Cephe tek bir düzlem yerine küçük kıvrımlar gösteriyor. Yük eksenel iletilmiyor; komşu postlar arası boyutsal değişkenlik → dolgu ölçüsü hatası',
      trSolution: 'Montaj sırasında su terazisi + şakul; 3m\'de max. 2mm sapma; komşu postlar arası açıklığı ölç ve kaydet',
      standard: 'EN 13830'
    },
    {
      id: 'SE-006',
      name: 'Yanlış Boyutlu Dolgu (IGU)',
      globalScore: 2.30,
      severity: 'Orta',
      trDescription: 'Cam profile çok az gömülmüş → sızıntı riski. Çok derin gömülmüş → termal çatlak (cam kenar yüzeyinden yayılan çatlak). Boyutsal program hatası veya post hizalama hatası.',
      trSolution: 'Profile minimum/maksimum cam gömme derinliğini üretici katalogundan doğrula; termal gradyan hesabı yap',
      standard: 'EN 1279 / EN 13830'
    },
    {
      id: 'SE-007',
      name: 'Çelik-Alüminyum Bağlantıda Galvanik Yalıtım Eksikliği',
      globalScore: 1.80,
      severity: 'Orta',
      trDescription: 'Çelik ankraj + alüminyum profil direkt temas → elektrokimyasal korozyon. Uzun vadede bağlantı çürümesi.',
      trSolution: 'Polietilen veya naylon spacer plaka; paslanmaz çelik vida A2/A4; temas yüzeyi astar boya',
      standard: 'EN 1090-1'
    },
    {
      id: 'SE-008',
      name: 'IGU Tersine Montajı',
      globalScore: 1.65,
      severity: 'Orta',
      trDescription: 'IGU\'nun dış ve iç yüzü üretici tarafından işaretlenmiş. Tecrübesiz montajcı ters taktığında: ısıl ve güneş koruma performansı kaybolur, kaplama bütünlüğü bozulur.',
      trSolution: 'Her IGU paketindeki işaret okunu kontrol et; montaj öncesi eğitim zorunlu',
      standard: 'EN 1279'
    },
    {
      id: 'SE-009',
      name: 'Yanlış Tork ile Vida Sıkma',
      globalScore: 1.35,
      severity: 'Düşük',
      trDescription: 'Üretici tarafından tanımlanmış tork değerlerinden sapma. Düşük tork: sızdırmaz değil. Yüksek tork: profil deformasyonu, cam kırılması.',
      trSolution: 'Torklu tornavida kullan; üretici montaj kılavuzundaki tork değerlerine uy',
      standard: 'EN 1090-1'
    }
  ],
  mainConclusion: 'Hataların ana nedeni montaj dikkatsizliği ve yetersiz bilgidir. En yüksek riskli 3 hata: (1) cam taşıyıcı desteği yanlış, (2) EPDM membran, (3) kritik nokta detayları. Önleme için iç kalite kontrolün güçlendirilmesi şart.'
}

/* ── 9B: Panel (Unitize) CW Performans Testleri (ODTÜ, İstanbul 2013) ─── */
export const PANEL_CW_PERFORMANCE = {
  source: 'Şengün Doğan B.N. — ODTÜ Yüksek Lisans Tezi, Ocak 2013, 96 sayfa',
  system: 'Alüminyum Panel (Unitize) Giydirme Cephe Sistemi',
  specimen: '3000mm genişlik × 7600mm yükseklik (2 katlı tam ölçek), İstanbul ofis kulesinden',
  testingBody: 'Yetkili cephe test firması, donanımlı test odası (laboratuvar arazi koşulları)',
  facadeTests: [
    {
      name: 'Su Geçirimsizlik Testi (Watertightness)',
      standard: 'EN 12208 / ASTM E1105',
      procedure: 'Cepheye basınç farkı altında su püskürtme; içeriye sızıntı yoktur koşulu',
      performanceClass: 'E1200 (maks. sınıf) = 1200 Pa basınçta sızdırmaz',
      trNote: 'Panel sistem, tüm contaların fabrikada uygulandığı için saha şartlarına bağlılığı daha az → su testi başarısı daha yüksek'
    },
    {
      name: 'Hava Geçirimsizlik Testi (Air Permeability)',
      standard: 'EN 12153 / EN 12154',
      procedure: '±600 Pa basınç altında geçen hava hacmi (m³/h·m²)',
      performanceClass: 'Sınıf 4 = 0.5 m³/(h·m²) (en düşük hava kaçağı)',
      trNote: 'Yüksek binalarda rüzgar kaynaklı ısıl köprü etkisi; hava geçirimsizlik doğrudan enerji kaybı'
    },
    {
      name: 'Rüzgar Direnci Testi (Wind Resistance)',
      standard: 'EN 12179',
      procedure: 'Güvenlik yükü ve hizmet yükü altında sehim + kalıcı deformasyon ölçümü',
      allowableDeflection: 'Açıklık/200 veya max. 15mm (hangisi küçükse)',
      trNote: 'Post açıklığı büyüdükçe sehim kritik; profil kesiti ve cam ağırlığının birlikte hesaplanması şart'
    },
    {
      name: 'Yapı Hareketi Testi (Building Movement)',
      standard: 'EN 14019 / EOTA TR 034',
      procedure: 'Kat ötelemesi (inter-story drift) ve döşeme hareketine cephenin tepkisi',
      allowableRacking: 'H/100 (rüzgar altında, elastic); H/200 (kalıcı)',
      trNote: 'Panel sistem, her panelin bağımsız hareketine izin verdiği için stick sisteme göre daha avantajlı; panel bağlantıları toleranslı tasarlanmalı'
    }
  ],
  panelVsStickAdvantages: [
    'Fabrika kontrolü → saha hatası riski düşük (conta, sealant, cam montajı fabrikada)',
    'Modüler uygulama → hız ve kalite tutarlılığı',
    'Her panel bağımsız hareket eder → yapı hareketlerine daha toleranslı',
    'Yüksek binalarda güvenlik: ön cephede çalışan montajcı sayısı az',
    'Uzun vadeli performans: tüm sızdırmazlık elemanları fabrikada kaliteli uygulanıyor'
  ],
  panelVsStickDisadvantages: [
    'Yüksek ilk maliyet (fabrika + nakliye + özel kaldırma ekipmanı)',
    'Proje bazlı üretim → değişikliklere esneklik az',
    'Panel hasarında komple panel değişimi gerekli',
    'Küçük projeler için ekonomik değil'
  ],
  testConclusion: 'Panel CW sistemi EN standartlarını karşıladı. Su geçirimsizliği ve yapı hareketi testlerinde üstün performans. Türkiye\'de cephe testleri henüz gelişmekte; zorunlu hale getirilmesi önerilir.'
}

/* ── 9C: Dava Analizi — Yardımcı Cephe Elemanları Hataları (İspanya 2008-2017) ─── */
export const FACADE_AUXILIARY_DEFECTS = {
  source: 'Cano M. vd. — "Taxonomy of Defects in Auxiliary Elements of Facades and Its Relation with Lawsuits" Buildings 2022, 12, 401',
  dataSource: 'İspanya inşaat sigortası şirketi; 2008-2017 arası 1033 dava kaydı',
  auxiliaryElements: ['Dış pencere denizliği (windowsill)', 'Saçak/kornış (cornice)', 'Kaplamlık (wainscot/apron)'],
  keyFindings: [
    {
      finding: 'En sık görülen hasar: Lekeleşme ve rutubet',
      frequency: 'Tüm davaların %40\'ından fazlası',
      cause: 'Yetersiz eğim, damlalık eksikliği, yanlış su bariyeri',
      trSolution: 'Denizlik min. 5° eğim; damlalık uzantısı min. 25mm; denizlik altında yağmur kesiği (kerf) zorunlu'
    },
    {
      finding: 'Konum etkisi: Kuzey ve batı cepheler daha az hasar',
      detail: 'Güneş maruziyeti + yağmur-rüzgar etkisi birleşimi en fazla hasarı güney ve doğu cephelerde yaratıyor',
      trNote: 'Türkiye\'de güney cephe hem güneş hem kış yağmuru açısından kritik; denizlik detayları burada daha titiz olmalı'
    },
    {
      finding: 'Deniz yakınlığı korelasyonu',
      detail: 'Denize 5km\'den yakın binalarda tuz korozyonu kaynaklı hasar 3.2× daha fazla',
      trNote: 'İstanbul kıyısı, İzmir, Çanakkale gibi bölgelerde A4-316 SS bağlantı, denizcilik sınıfı sealant zorunlu'
    },
    {
      finding: 'Bakım eksikliği = hasar büyümesi',
      detail: 'Erken tespit + küçük müdahale maliyeti, geç tespit + büyük onarım maliyetinin 1/10\'u',
      trNote: 'Yılda 2× kontrol + temizlik programı uzun vadede maliyet avantajı sağlar'
    },
    {
      finding: 'Tasarım + uygulama birlikte hatalı = en yüksek risk',
      detail: 'Hataların %62\'si hem tasarım hem uygulama aşamasında birlikte yapılan hatalardan kaynaklanıyor',
      trNote: 'Tek başına iyi tasarım veya iyi uygulama yetmez; her ikisi birlikte denetlenmeli'
    }
  ],
  windowsillDefects: [
    { defect: 'Yetersiz eğim / sıfır eğim', consequence: 'Durgun su → boya kabarma, derz bozulması, leke', prevention: 'Min. 5°, ideal 10-15° dışa eğim' },
    { defect: 'Damlalık yok veya çok kısa', consequence: 'Su duvar yüzeyine akıyor → koyu dikey leke', prevention: 'Min. 25mm uzantı; altında 6mm yağmur kesiği (kerf)' },
    { defect: 'Denizlik-çerçeve arası sealant yok', consequence: 'Su kapiler etkiyle bağlantıya giriyor', prevention: 'ASTM C1193 + primer; nötr silikon' },
    { defect: 'Denizlik ucu kapatılmamış', consequence: 'Rüzgar+yağmur ucundan sisteme giriyor', prevention: 'Köşe kapama profili veya sealant' },
    { defect: 'Düşük kalite malzeme (seramik, taş)', consequence: 'Donma-çözülme çatlağı, kaplama dökülmesi', prevention: 'Su emilimi < %3 malzeme; frost-resistant sertifika' }
  ],
  serviceLifeFactors: [
    'Cephe yönelimi (güney > kuzey maruziyet)',
    'Yağmur + rüzgar kombine etkisi',
    'Denize mesafe (< 5km = tuz korozyonu)',
    'Hava kirliliği (kentsel vs kırsal)',
    'Bakım sıklığı ve kalitesi',
    'Güneş maruziyeti (UV bozunması)'
  ]
}

/* ───────────────────────────────────────────────────────────────────
   BÖLÜM 10 — BEŞ KAYNAK SENTEZİ (Gerçek PDF Verileri — Mart 2026)
   10A: Gazi/Çankaya Ünv. — Çubuk Alüm. Giydirme Cephe Türkiye Sorunları (TR)
   10B: IEA EBC Annex 43 / Task 34 — Çift Kabuklu Cepheler (DSF) Literatür
   10C: Ön Tasarım Maliyet Modelleme — GAM Yöntemi (Leśniak & Górka 2021)
   10D: Alüminyum Dayanıklılık — Michael Stacey / IAI 2014 (TSC Raporu)
   10E: Cephe Standardı — Sydney Üniversitesi Teknik Şartname 2022
   ─────────────────────────────────────────────────────────────────── */

/* ── 10A: Çubuk Alüm. Giydirme Cephe — Türkiye Tasarım/Uygulama Sorunları ─── */
export const STICK_CW_TURKEY_PROBLEMS = {
  source: 'Gazi Üniversitesi MMF Dergisi 37:2 (2022) 857-872 — Şaban & Özmen — DOI:10.17341/gazimmfd.922094',
  topic: 'Türkiye\'de Çubuk Alüminyum Giydirme Cephe (ÇAGC) Sistemlerinde Mimari Tasarım–Taşıyıcı Sistem Uyum Sorunları',
  methodology: '10 yapıya ait mimari ve statik uygulama projeleri analizi; paydaşlarla sözlü görüşme; saha çalışması',
  keyProblems: [
    {
      category: 'Tasarım Aşaması Sorunları',
      items: [
        'ÇAGC statik hesapları çoğunlukla sistem evleri tarafından yapılıyor; yapının mimari detayları dikkate alınmıyor',
        'Modüler bakış açısıyla hesap yapılıyor — yapı taşıyıcı sisteminin düzensizlikleri (kolon aks kaçıklıkları, döşeme kalınlık değişimleri) göz ardı ediliyor',
        'Avan projedeki kat yükseklikleri ve döşeme konumlarına göre hesap — uygulama projesindeki değişiklikler aktarılmıyor',
        'Mimari cephe detaylarının taşıyıcı sisteme uyumsuzluğu: özellikle kütlelerin birleşim noktaları, düzensizlik bölgeleri',
        'ÇAGC sistemlerinde basit kiriş benzetmesi kullanılarak yapılan modelleme — gerçek yapı yük dağılımı temsil edilmiyor'
      ]
    },
    {
      category: 'Uygulama/Montaj Sorunları',
      items: [
        'Ankraj bölgesine betonarme kolon çok yakın — cıvata sıkma için teknik ekipman ve işçi alanı oluşmuyor → 4 cıvata yerine 2 ile montaj',
        'Sonlu elemanlar analizi: eksik cıvata bölgesinde gerilme yoğunlaşması — kaynak takviyesi ile çözüm gerekiyor',
        'Yeterli alan olmadığı için standart ankraj tipleri kullanılamıyor → proje dışı çözümlere gidiliyor',
        'Cephe yanında betonarme kiriş olmadığı durumda yüklenici tarafından sonradan çelik kiriş tasarlanması',
        'Galeri boşlukları nedeniyle asma profil yerine çelik kiriş + bağlantı elemanı tasarımı gerekliliği',
        'Montaj ekiplerinin ÇAGC sistem bilgisi yetersizliği — yüklenicilerin çekirdek kadrosu küçük, dışarıdan ekip'
      ]
    },
    {
      category: 'Türkiye\'ye Özgü Sorunlar',
      items: [
        'İhale süreçleri: paydaş seçimi üzerinde kritik rol — düşük fiyatlı firmalar kaliteli firmalar önünde kazanıyor',
        'KOBİ baskınlığı: ürün geliştirme ve üretim aşamasındaki firmalar küçük-orta ölçekli → kapasite sınırlı',
        'Cephe imalatının görece geç aşamaya bırakılması → zaman baskısı → tasarım hataları',
        'Sistem evi hesapları ile uygulama projesi arasındaki kopukluk — koordinasyon eksikliği',
        'Akademik eğitimde ÇAGC detaylarının verilmemesi → mimarlar ön proje bile çıkaramıyor'
      ]
    }
  ],
  solutions: [
    'ÇAGC statik hesaplarının mimari uygulama projesini yapan ekiple koordineli yürütülmesi',
    'Yapı taşıyıcı sistem aks düzensizliklerinin erken aşamada cephe tasarımına yansıtılması',
    'Ankraj bölgelerinin 3D modelleme ile çakışma (clash detection) kontrolü',
    'Cephe danışmanı kullanımı — tasarımdan montaj denetimine kadar süreç takibi',
    'Montaj ekiplerine sertifikalı eğitim zorunluluğu getirilmesi'
  ]
}

/* ── 10A-bis: Alüminyum Giydirme Cephe Isıl Performans ─── */
export const THERMAL_PERFORMANCE_TR = {
  source: 'Gazi Üniversitesi Mühendislik Mimarlık Fakültesi Dergisi — DOI: 10.17341/gazimmfd.922094',
  topic: 'Alüminyum Giydirme Cephe Sistemlerinde Isıl Performans ve Enerji Etkinliği (Türkiye Koşulları)',
  keyFindings: [
    {
      topic: 'Isı Geçirgenlik Katsayısı (U-değeri)',
      findings: [
        'Termal kesimli (thermal break) alüminyum profil sistemlerde U ≈ 1.4–2.0 W/m²K',
        'Termal kesimSİZ profillerde U ≈ 3.5–5.5 W/m²K — neredeyse 3× daha kötü',
        'TS 825 gereği İstanbul (2. iklim bölgesi) duvar U ≤ 0.60 W/m²K; pencere U ≤ 1.80 W/m²K',
        'Çoğu Türk binasında kullanılan sistem bu değerlerin çok üstünde'
      ]
    },
    {
      topic: 'Isı Köprüsü (Thermal Bridge) Etkileri',
      findings: [
        'Alüminyum profilin ısıl iletkenliği λ = 160 W/mK — çeliğin 3×, betonun 70× kötüsü',
        'Termal kesim olmaksızın bir alüminyum bağlantı; duvar yalıtımını %40\'a kadar etkisiz kılabilir',
        'Enerji simülasyonu (EnergyPlus): termal köprü düzeltme faktörü Δψ sisteme göre 0.05–0.30 W/mK arasında',
        'İç yüzey sıcaklığı <13°C ise yoğuşma başlar → nem ve küf riski (EN ISO 13788)'
      ]
    },
    {
      topic: 'İklim Bölgelerine Göre Sistem Seçimi (Türkiye)',
      recommendations: [
        { zone: '1. Bölge (Akdeniz — Antalya, Mersin)', uWall: '≤0.70', uWindow: '≤2.40', profile: 'Termal break zorunlu değil ama önerilir' },
        { zone: '2. Bölge (Geçiş — İstanbul, İzmir)', uWall: '≤0.60', uWindow: '≤1.80', profile: 'Termal break profil zorunlu' },
        { zone: '3. Bölge (Karasal — Ankara, Bursa)', uWall: '≤0.50', uWindow: '≤1.60', profile: 'Yüksek performanslı termal break + Ar dolgu cam' },
        { zone: '4. Bölge (Soğuk — Erzurum, Kars)', uWall: '≤0.40', uWindow: '≤1.40', profile: '3 cam + ısıtmalı sürme profil' }
      ]
    },
    {
      topic: 'Enerji Tasarrufu Potansiyeli',
      findings: [
        'Mevcut sistemin yenilenmesiyle %25–40 ısıtma/soğutma enerjisi tasarrufu mümkün',
        'Yatırım geri dönüşü (ROI): 7–12 yıl (sistem tipine ve iklim bölgesine göre)',
        'Giydirme cephe yenileme + enerji verimliliği artışı → binanın piyasa değeri ortalama %8–12 artış'
      ]
    }
  ],
  commonMistakesTR: [
    'Profilsiz termal kesim → yoğuşma + küf (en yaygın Türkiye hatası)',
    'Tek cam kullanımı eski binalarda → U>5 W/m²K',
    'Mantolama yapılmış ama pencere çerçevesi ısı köprüsü olarak kalmış',
    'Cam seçiminde sadece güneş kontrolü düşünülmüş, U değeri ihmal edilmiş',
    'Profil-cam arası sealant eksikliği → hava kaçağı enerji kaybı'
  ],
  standardsRef: ['TS 825', 'EN ISO 10077-1/2', 'EN ISO 13788', 'TS EN 14351-1']
}

/* ── 10B: IEA EBC Annex 43 / Task 34 — Çift Kabuklu Cepheler (DSF) ─── */
export const DOUBLE_SKIN_FACADES = {
  source: 'IEA SHC Task 34 / ECBCS Annex 43 — Harris Poirazis, Lund University 2006 — 252 sayfa',
  definition: 'Çift kabuklu cephe (DSF): iki cam katman arasında hava koridoru bulunan gelişmiş cephe sistemi. Temel işlev: pasif enerji kontrolü, doğal havalandırma, akustik performans ve görsel saydamlık.',
  alternativeNames: [
    'Double Skin / Double Facade / Double Envelope', 'Active Facade / Passive Facade',
    'Dual-Layered Glass Facade', 'Dynamic Facade / Wall-Filter Facade',
    'Second Skin System / Environmental Facade', 'Airflow Window / Supply Air Window',
    'Exhaust Window / Double Skin Curtain Wall / Twin Skin Facade'
  ],
  classifications: {
    byAirtightness: [
      'Kategori A: Birden fazla katlı DSF — A1: her iki cephe hava geçirmez; A2: iç cephe geçirgen, dış geçirmez; A3: dış geçirgen, iç geçirmez; A4: her ikisi geçirgen',
      'Kategori B: Katta bağımsız DSF — aynı alt sınıflar'
    ],
    byVentilationType: [
      'Doğal havalandırmalı (Naturally Ventilated Wall): dış kabuk ek yüzey; mevsime göre doğal akış',
      'Aktif cephe (Active Facade): iç boşluk mekanik havalandırmayla kontrol edilir',
      'Pasif cephe (Passive Facade): doğal baca etkisi ile akış'
    ]
  },
  types: [
    {
      name: 'Buffer / Tampon',
      description: 'Hava boşluğu kapalı, ısı tamponu; Airtight A1 kategorisi',
      advantages: ['Yüksek ısı yalıtımı', 'Rüzgar koruması', 'Basit yapı'],
      disadvantages: ['Doğal havalandırma yok', 'Yaz aşırı ısınma riski', 'Güneş kırıcı zorunlu'],
      uValue: '0.7–1.2 W/m²K', bestFor: 'Soğuk iklimler (Doğu Anadolu, Karadeniz kıyısı)',
      cavityDepth: '20–100 cm'
    },
    {
      name: 'Twin-Face / Katta Bağımsız',
      description: 'Her katta üst-alt açıklıkla bağımsız hava boşluğu (Kragh 2000 kategori)',
      advantages: ['Katta bağımsız kontrol', 'Yangın yayılımı sınırlı', 'Dar derinlik yeterli'],
      disadvantages: ['Katta açma/kapama mekanizması', 'Orta-yüksek maliyet'],
      uValue: '0.8–1.5 W/m²K', bestFor: 'Ofis + konut karma; orta yükseklik binalar',
      cavityDepth: '20–60 cm'
    },
    {
      name: 'Shaft-Box / Hava Kanalı (Dikey)',
      description: 'Dikey hava kanalı: baca etkisi ile doğal havalandırma; yatayda kapalı, dikeyde açık',
      advantages: ['Güçlü baca etkisi', 'Doğal havalandırma sürekliliği', 'Akustik bariyer'],
      disadvantages: ['Yangın riski (dikey kanal)', 'Yatay hava akışı zayıf'],
      uValue: '1.0–1.8 W/m²K', bestFor: 'Orta yükseklikte ofis binaları',
      cavityDepth: '50–150 cm'
    },
    {
      name: 'Multistory / Çok Katlı (Tüm Bina Boşluğu)',
      description: 'Tek hava boşluğu tüm bina yüksekliğini kapsar; en sade sistem',
      advantages: ['En düşük maliyet', 'Geniş koridor — bakım erişimi', 'Basit detay'],
      disadvantages: ['Yangın yayılımı EN YÜKSEK risk (baca etkisi)', 'Üst katlarda aşırı ısınma', 'Gürültü geçişi'],
      uValue: '1.2–2.0 W/m²K', bestFor: 'Düşük yangın riski; bakım öncelikli binalar',
      cavityDepth: '60–200 cm',
      criticalNote: 'Faist (1998): bina yüksekliği 3–4 kat ile sınırlandırılmalı; üst katlarda sıcaklık birikimi kontrol edilemiyor'
    },
    {
      name: 'Corridor / Koridor (Kişi Erişimli)',
      description: 'Katlararası yürüme koridoru; ≥60 cm derinlik; cam temizliği içeriden yapılabilir',
      advantages: ['İçeriden temizlik → vinç maliyeti yok', 'En iyi akustik', 'Doğal havalandırma + şeffaflık'],
      disadvantages: ['En yüksek maliyet', 'Büyük cephe derinliği (60–200 cm)', 'Yangın güvenliği karmaşık'],
      uValue: '0.6–1.0 W/m²K', bestFor: 'Prestij ofis, kültür binaları; uzun ömür hedefli projeler',
      cavityDepth: '60–200 cm'
    }
  ],
  energyPerformance: {
    heating: 'Tek cam sisteme kıyasla ısıtma enerjisi %20–40 azalır (Annex 43 verisi)',
    cooling: 'İç boşluğa alınan güneş kırıcı ile soğutma enerjisi %15–30 azalır',
    acoustic: 'Ek gürültü sönümleme: 10–15 dB (kentsel gürültü → iç sessizlik)',
    naturalVentilation: 'Yaz: mekanik soğutma tamamen ortadan kalkabilir (bina tipine bağlı)',
    glazingComparison: {
      singleOuter_doubleInner: 'Isı kaybı azalma <20% — mütevazı iyileşme',
      doubleOuter_doubleInner: 'Isı kaybı azalma ~%50 — anlamlı performans',
      cavityDepth_thin_vs_thick: 'İnce kavite → daha yüksek ve sıcak hava akışı (Di Maio & van Paassen 2001)'
    }
  },
  buildingPhysics: {
    stackEffect: 'Baca etkisi: alt açıklıktan soğuk hava girer, üstten sıcak hava çıkar; yüksek binada çok güçlü',
    solarControl: 'İç boşluktaki jaluziler güneş ısısını kavitenin içinde tutar → iç mekan ısı kazancı azalır',
    condensation: 'Hava boşluğu sıcaklığı kontrol edilirse yoğuşma riski azalır; ancak geçirgen olmayan iç cephe → nem tuzağı',
    windPressure: 'Dış kabuk rüzgar basıncını %70–90 azaltır → iç cephe açılabilir pencere tasarımına imkan',
    acoustics: 'Boşluk derinliği ve yüzey malzeme ile optimize edilmiş DSF: Rw = 45–55 dB'
  },
  fireSafety: {
    risk: 'KRİTİK: Tüm DSF tiplerinde hava koridoru yangın/duman yayılımı için baca etkisi yaratır',
    requirements: [
      'EN 13501-1: Yangın sınıfı — cephe bileşenleri minimum B-s1,d0',
      'EN 1364-3/4: Perde duvar yangın direnci — 30–90 dk REI',
      'Her katta yangın kesme elemanı (fire stop) — Multistory tipte ZORUNLU',
      'Otomatik duman/yangın algılama + suppression sistemi iç boşlukta',
      'NFPA 285 veya BS 8414 cephe yangın testi gerekebilir (>18m binalar)'
    ],
    trNote: 'Türkiye: "Binaların Yangından Korunması Yönetmeliği" DSF\'e özel madde içermiyor; genel maddeler uygulanıyor — danışman katkısı zorunlu'
  },
  realBuildingExamples: [
    { name: 'Düsseldorf Stadttor', country: 'Almanya', type: 'Multistory', year: 1998, note: 'Dünya\'nın ilk büyük ölçekli DSF binalarından' },
    { name: 'Print Media Academy Heidelberg', country: 'Almanya', type: 'Shaft-Box', year: 2000, note: 'Kuzey cephe shaft-box; güney cephe tek kabuk' },
    { name: 'Olympic Park Tower Munich', country: 'Almanya', type: 'Twin-Face', year: '2000s', note: 'Yatay açılan ışıklıklar ile doğal havalandırma' }
  ],
  maintenanceRequirements: [
    'İç boşluk temizliği: yılda minimum 2× (corridor tipte işçi girer; diğerlerinde gondola/vinç)',
    'Drenaj deliklerini tıkayan organik birikim: her 6 ayda kontrol ve temizleme',
    'Motorlu jaluziler (güneş kırıcı) yılda 1× mekanik servis',
    'Sealant kontrolü yılda 1× — iç boşluk sealantı dış yüzeye göre daha uzun ömürlü ama ihmal edilmemeli',
    'Cam temizliği: dış cam yılda 4×, iç cam yılda 2× (corridor tipte içeriden; diğer tiplerde gondola)',
    'Hava giriş/çıkış ızgaraları kış öncesi ve bahar sonrası temizlenmeli'
  ],
  costComparison: {
    singleSkin_base: '1.00',
    DSF_buffer: '1.40–1.80',
    DSF_corridor: '2.00–2.80',
    DSF_multistory: '1.20–1.50',
    payback: '8–15 yıl (enerji + bakım avantajı + pazar değeri artışı birlikte)'
  }
}

/* ── 10D: Alüminyum Dayanıklılık — Michael Stacey / IAI 2014 ─── */
export const ALUMINIUM_DURABILITY = {
  source: 'Aluminium and Durability: Towards Sustainable Cities — Michael Stacey Architects / IAI 2014 — 184 sayfa',
  overview: '50 tarihi alüminyum yapı incelenmesi (1895–1986); in-situ ölçümler; non-destructive testing; ömür analizi',
  keyFindings: [
    {
      topic: 'Alüminyum Uzun Ömürlülüğü',
      findings: [
        '50 incelenen yapının büyük çoğunluğu hâlâ kullanımda — alüminyum 30–120 yıl servis ömrü kanıtlandı',
        'Church of St Edmund (1895, Derbyshire): tavan alüminyum paneller 120 yıl sonra mükemmel koşulda',
        'New Bodleian Library Oxford (1940): alüminyum alaşım pencereler 70+ yıl sorunsuz',
        'Postsparkasse Viyana (Otto Wagner, 1906): çelik kolonlar alüminyum kaplama ile restore edildi — alüminyum sadece temizlendi, değiştirilmedi'
      ]
    },
    {
      topic: 'Yüzey Kaplama Sistemleri (Finishing)',
      findings: [
        'Mill-finish (ham): Hava ile temas anında ince Al₂O₃ oksit tabakası → koruyucu gri oksit katmanı oluşur',
        'Anodising (Eloksal): Elektrokimyasal oksitleme; 15–25 μm şeffaf/renkli koruma; korozyona çok dirençli',
        'Silver/natural anodising: Şeffaf film — alüminyumun gümüş parlaklığını gösterir',
        'Electrocolour anodising: Kobalt veya kalay ile gözeneklere renk depolama; açık bronz → siyaha kadar',
        'Polyester Powder Coating: İki aşamalı — toz üretim + yüzey uygulama; Solvent gerektirmez; daha kalın film',
        'PVDF (Polyvinylidene Difluoride): En uzun ömürlü boya sistemi; UV direnci çok yüksek; 25–30 yıl garanti mümkün',
        'Anodising vs. Powder Coating: Anodising daha ince ve saydam; powder coating daha kalın ve renkli seçenek'
      ]
    },
    {
      topic: 'Korozyon ve Bozunma Mekanizmaları',
      findings: [
        'Genel atmosferik korozyon: 3 km kıyı mesafesi kritik eşik — daha yakında yoğunlaşmış klor korozyonu',
        'Galvanik korozyon: Alüminyum + bakır veya çelik temas → elektrokimyasal bozunma → izolasyon zorunlu',
        'Pitting (çukur korozyon): Klorür iyonları ile — deniz kıyısı binaları için A4 paslanmaz çelik bağlantı zorunlu',
        'Anodised film kalınlığı ölçümü (NDT): Çok tekdüze dağılım kanıtlandı — renk değişimi UV maruziyetiyle; alt kısımlar korunmuş bölgelerde daha soluk (paradoks: gün ışığından yoksun alan → nem birikimi sorunu farklı)',
        'Powder coating altındaki alüminyum: 30 yıl sonra test — coating bütünlüğü korunduğunda metal bozunma yok',
        'Camden Lock Housing (Grimshaw 1990, 3mm PVDF): 23 yıl sonra inceleme — renk sabit, mekanik hasar minimal'
      ]
    },
    {
      topic: 'Non-Destructive Testing (NDT) Bulguları',
      findings: [
        'Film kalınlığı ölçümü: anodised binalarda 70 yıl sonra bile uniform dağılım',
        'Renkölçüm (colorimetry): UV maruziyeti ile L* azalma (koyulaşma); a* ve b* kayması',
        'Exova laboratuvar testleri: Syntha Pulvin tozları 3000+ saat tuz spreyi — geçer',
        'In-situ ölçüm: Korunmuş bölgeler daha pürüzlü → nem birikimi → beklenen korozyon etkisi'
      ]
    }
  ],
  maintenanceGuide: {
    mill_finish: 'Yıllık temizlik yeterli; 5 yılda bir boya veya anodising opsiyonel',
    anodised: 'pH-nötr deterjan ile yıllık temizlik; 10 yılda bir renk incelemesi; leke için oksalik asit (hafif)',
    powder_coated: 'Yıllık yumuşak fırça + sabunlu su; scratch/çizik hemen rötuşlanmalı; 15 yılda bir yeniden boya değerlendirmesi',
    pvdf: 'En düşük bakım; 5 yılda bir suyla yıkama yeterli; 25 yıl renk garantisi mümkün',
    galvanic_prevention: 'Alüminyum–çelik temas noktaları: EPDM ya da neopren izolasyon; epoksi kaplama veya butil bant'
  },
  recycling: {
    contentNewAluminium: 'Birincil (virgin) alüminyum üretimi: 13,5 kWh/kg enerji',
    contentRecycled: 'Geri dönüştürülmüş alüminyum: sadece 0.7 kWh/kg — %95 enerji tasarrufu',
    buildingRecoveryRate: 'Avrupa\'da cepheden alüminyum geri dönüşüm oranı: >90%',
    sustainabilityNote: 'Alüminyum cephe sistemi: düşük ağırlık + yüksek geri dönüşüm = en düşük yaşam döngüsü karbon etkisi'
  }
}

/* ── 10E: Cephe Standardı — Teknik Şartname (Sydney Ünv. 2022) ─── */
export const FACADE_STANDARD = {
  source: 'Facade Standard v2.0 — University of Sydney, Central Operations Services — 2022 — 30 sayfa',
  scope: 'Tasarımcı, danışman, personel ve yükleniciler tarafından teslim edilen tüm cephe sistemleri',
  systemRequirements: {
    curtainWall: 'Post and beam / stick veya unitized; hava-su-rüzgar testleri EN/AAMA/AS standartları',
    windows: {
      minU: 'U ≤ 1.9 W/m²K (enerji şartnamesi gereği)',
      airInfiltration: 'L3 sınıfı minimum (EN 12207)',
      waterTightness: 'E450 minimum (EN 12208)',
      windResistance: 'C4 minimum (EN 12210)',
      opening: 'İç mekan açılan pencereler: yağmur engeli, yer tutan aparat; minimum drenaj'
    },
    skylights: {
      minAngle: 'Minimum 5° eğim — su birikimini önlemek için',
      secondaryDrainage: 'Zorunlu: cam altı drenaj yolu; cam seviyesi altında su toplama ve dışa drenaj',
      testing: 'Dış sealant uygulanmadan önce yerinde su testi yapılacak'
    },
    structuralSealant: {
      testing: 'Her uygulama partisinden numune alınarak gerilme/uzama testi',
      substrate: 'Uygulama öncesi substrat uyumluluğu test sertifikası zorunlu',
      curing: 'Sealant tamamen kürlenmeden cephe yüklü konuma alınamaz'
    },
    glazedBalustrade: {
      type: 'Lamine güvenlik camı (VSG) zorunlu; temperli-temperli kombinasyon kabul edilmez',
      heightBuilding: 'Binalar 0–1m yükseklikten: minimum 1000 mm; 1m+ üzeri: minimum 1100 mm',
      loading: 'BS 6180 / AS 1170.1 balustrade yük tasarımı'
    },
    claddings: {
      metalComposite: 'ACM/MCM: Yangın testi NFPA 285 veya BS 8414 uyumu; A2 veya B sınıfı core zorunlu',
      naturalStone: 'Minimum kalınlık 30 mm; panel ağırlığı <35 kg; her panel bağımsız mekanik ankraj',
      fibreCement: 'Arka havalandırma boşluğu zorunlu: minimum 25 mm'
    }
  },
  performanceRequirements: {
    sustainability: [
      'GBC Yeşil Bina: Sorumlu Zarf — geri dönüştürülmüş içerik ve bölgesel kaynak tercih',
      'Pasif tasarım: yönelim, güneş erişimi, rüzgar, mevsimsel sıcaklık değişimine yanıt zorunlu',
      'Enerji şartnamesi Bölüm J (Avustralya NCC) uyumu — Türkiye için TS 825 muadil'
    ],
    fireSafety: [
      'Yanıcı malzeme kullanımı: >18m yükseklikte A1/A2 sınıfı zorunlu (EN 13501-1)',
      'Cephe genişlemesi yangın kesici ile bölünmeli — her katta veya max 18m aralıkla',
      'Sprinkler ve dedektör entegrasyonu cephe–tavan arasına kadar'
    ],
    security: 'Tüm cephe bileşenleri erişim kontrol entegrasyonu için tasarlanmalı',
    acoustic: 'Cephe akustik arayüzü iç bölme ve yapı dokusu ile koordineli; minimum iki hava bariyeri prensibi'
  },
  penetrations: [
    'Mümkün olduğunca cephe penetrasyonundan kaçınılacak',
    'Zorunlu penetrasyon: minimum iki hava bariyeri + drene edilmiş hava boşluğu (basınç eşitleme prensibi)',
    'Detay çizimi onay olmadan penetrasyon uygulanamaz'
  ],
  handoverDocumentation: [
    'As-built çizimler (PDF + CAD)',
    'Tüm cephe sistemleri için garanti tabloları',
    'Cam Heat Soak Test sertifikaları (temperli cam için)',
    'Isıl performans detayları (Section J / TS 825)',
    'Ulusal İnşaat Kodu, Üniversite Standardı ve AAMA/EN/AS standartları uyum sertifikaları'
  ]
}

/* ── 10C: Ön Tasarım Maliyet Modelleme — GAM Yöntemi (Leśniak & Górka 2021) ─── */
export const PRECOST_MODELING = {
  source: 'Pre-design Cost Modelling of Curtain Wall Facades — Leśniak & Górka, Cracow Univ. of Technology — Cost Engineering 2021 — 16 sayfa',
  purpose: 'GAM (Generalised Additive Model) yöntemi ile ön tasarım aşamasında cephe bütçe tahmini; 61 Polonya projesi üzerinde kalibrasyon',
  methodology: {
    method: 'GAM — Genelleştirilmiş Toplamsal Model (istatistiksel regresyon bazlı)',
    dataset: '61 gerçek proje (ofis, ticari, kamu binaları; 2010–2019 arası inşaat tamamlanma)',
    inputs: ['Cephe yüzey alanı (m²)', 'Cephe tipi (stick/unitize/panel)', 'Cam tipi', 'Kule yüksekliği (kat sayısı)', 'Konum (kentsel/kırsal)', 'İnşaat yılı (enflasyon düzeltmesi)'],
    output: 'Birim maliyet (€/m²) ±%15–20 hassasiyet (ön tasarım aşaması için kabul edilebilir)'
  },
  costDrivers: [
    {
      factor: 'Sistem Tipi',
      impact: 'En büyük maliyet belirleyicisi',
      data: [
        { system: 'Alüminyum Stick CW (cam)', costRange: '450–750 €/m²', note: 'Türkiye\'de ~400–650 $/m²; GAM katsayısı baz=1.0' },
        { system: 'Alüminyum Panel (Unitized) CW', costRange: '650–1100 €/m²', note: 'GAM katsayısı ~1.4×; daha az saha hatası' },
        { system: 'Kompozit Panel Kaplama (ACM)', costRange: '250–450 €/m²', note: 'GAM katsayısı ~0.6×; en ekonomik giydirme' },
        { system: 'Çift Kabuklu Cephe (DSF)', costRange: '900–2500 €/m²', note: 'Uzun vadede enerji tasarrufu; yatırım geri dönüşü 8–15 yıl' },
        { system: 'ETFE Membran / Polikarbonat', costRange: '300–600 €/m²', note: 'Çatı ve atrium sistemleri için' },
        { system: 'Doğal Taş / Seramik Kaplama', costRange: '200–500 €/m²', note: 'İşçilik dominant; GAM katsayısı ~0.7×' }
      ]
    },
    {
      factor: 'Yükseklik',
      impact: 'İskele, vinç, güvenlik ve lojistik maliyeti artırır',
      data: [
        { height: '0–15m (≤5 kat)', multiplier: '1.00 (baz)' },
        { height: '15–30m (6–10 kat)', multiplier: '×1.12–1.18' },
        { height: '30–60m (11–20 kat)', multiplier: '×1.30–1.40' },
        { height: '60–100m (21–33 kat)', multiplier: '×1.60–1.70' },
        { height: '>100m (>33 kat)', multiplier: '×2.0–2.5' }
      ]
    },
    {
      factor: 'Form Karmaşıklığı (GAM bulgusu)',
      impact: 'Düz dikdörtgen yüzey baz; köşe ve eğri yüzeyler prim',
      data: [
        { form: 'Düz yüzey (dikdörtgen modül)', multiplier: '1.00' },
        { form: 'Tek yönlü eğri (ruled surface)', multiplier: '×1.20–1.30' },
        { form: 'Çift yönlü eğri (parametrik)', multiplier: '×1.70–2.50' },
        { form: 'Cam köşe (structural corner glass)', multiplier: '×1.35–1.50' },
        { form: 'Brise-soleil entegrasyonu', multiplier: '×1.15–1.25' }
      ]
    },
    {
      factor: 'Cam Tipi',
      impact: 'Maliyetin %35–50\'sini oluşturur; GAM\'da bağımsız değişken',
      data: [
        { glass: 'Tek cam 6mm', uValue: '5.7 W/m²K', costPremium: 'baz' },
        { glass: 'IGU 4+12+4 hava dolgu', uValue: '2.8 W/m²K', costPremium: '+25–35%' },
        { glass: 'IGU 4+16+4 Argon dolgu', uValue: '1.4 W/m²K', costPremium: '+50–60%' },
        { glass: 'IGU 4+16+4 Ar + Low-E (g≤0.35)', uValue: '1.0 W/m²K', costPremium: '+75–90%' },
        { glass: '3 cam 4+14+4+14+4 Ar+Low-E', uValue: '0.6 W/m²K', costPremium: '+140–160%' },
        { glass: 'VSG Lamine güvenlik (6.4mm)', uValue: '—', costPremium: '+60–120%' },
        { glass: 'Fotoğraf baskılı/serigrafili', uValue: '—', costPremium: '+80–150%' }
      ]
    }
  ],
  gamModelOutputs: {
    r2: 0.847,
    note: 'R²=0.847 — modelin gerçek maliyeti %84.7 açıklama gücü; ön tasarım için yeterli',
    topFactors: ['Cephe tipi (en büyük etki)', 'Cam tipi', 'Yükseklik', 'Form karmaşıklığı'],
    limitation: 'Model Polonya verisiyle kalibre; Türkiye için döviz kuru + yerel işçilik düzeltmesi gerekli'
  },
  turkeyMarketNotes: [
    'Türkiye 2024–2026: € bazlı maliyetler ₺ bazında %40–80 arttı; € sabit tutulan projeler daha güvenli',
    'Yerli sistem (Çuhadaroğlu, Saray, Asistal, Zahit): Avrupalı sisteme kıyasla %20–35 daha ucuz',
    'İşçilik: toplam maliyetin %25–35\'i; Türkiye Avrupa\'ya göre düşük ama hızla artıyor',
    'LME alüminyum fiyatı (Mart 2026 ~3200 $/ton) → profil maliyeti buraya bağlı; günlük değişken',
    'Sealant + aksesuvar: büyük bölümü ithal → kur hassasiyeti yüksek',
    'KDV %20 + nakliye + sigorta → brüt maliyet GAM çıktısının 1.25–1.30× üstünde'
  ],
  lifecycleCostAnalysis: {
    designLife: '25–50 yıl (sistem tipine göre; stick 30 yıl; unitized 40+ yıl)',
    maintenanceCosts: [
      { period: 'Yıllık', cost: 'Cephe alanının ‰1.5–3\'ü bakım bütçesi — temizlik + drenaj kontrolü' },
      { period: '5–10 yıl', cost: 'Sealant yenileme: ilk maliyet ×0.03–0.06' },
      { period: '15–20 yıl', cost: 'Cam değişimi (hasar, yoğuşma): ilk maliyet ×0.15–0.25' },
      { period: '25–30 yıl', cost: 'Sistem revizyon/yenileme: ilk maliyet ×0.40–0.70' }
    ],
    totalCostOfOwnership: '30 yıl sahip olma maliyeti = ilk yatırım × 1.8–2.5',
    npvAnalysis: 'Enerji tasarrufu NPV: %8 iskonto, 30 yıl; yüksek U→düşük U geçişte geri dönüş 7–12 yıl'
  },
  reportingTemplate: [
    'Müşteri özeti: m² birim fiyat × toplam yüzey alanı × yükseklik çarpanı × form çarpanı = tahmini bütçe',
    'Ön tasarım belirsizlik payı: ±%20–30; uygulama projesi sonrası ±%10–15',
    'LCC analizi dahil et — düşük ilk maliyet her zaman en iyi değil',
    'Enerji tasarrufu NPV olarak hesapla: %8 iskonto, 30 yıl; → gerçek sahip olma maliyeti'
  ]
}

/* ───────────────────────────────────────────────────────────────────
   ANA FONKSİYON: Gemini Prompt için bilgi tabanı özeti üret
   ─────────────────────────────────────────────────────────────────── */
export function buildKnowledgeContext() {
  const failureList = DESIGN_APPLICATION_FAILURES.map(f =>
    `• [${f.severity}] ${f.title}: ${f.description} → Çözüm: ${f.solution} (${f.standard})`
  ).join('\n')

  const diagnosisList = QUICK_DIAGNOSIS.visualSigns.map(v =>
    `• Görsel: "${v.sign}" → Olası sebep: ${v.possibleCauses[0]} → İlk aksiyon: ${v.firstAction}`
  ).join('\n')

  const sealantRules = INSULATION_GUIDE.waterproofing.applicationRules.join('; ')

  const visualCases = VISUAL_CASE_STUDIES.map(v =>
    `• [${v.id}] ${v.title} (${v.system}): Görsel belirtiler: ${(v.visualSigns||[]).join('; ')} → Çözüm: ${v.solution||v.solutions?.[0]||'—'} (${v.standard})`
  ).join('\n')

  const drainageDetail = `DOĞRU MONTAJ REF: Drenaj fitting = FS 50 A 4002 profil, 30×13 delik, 4.8×16 inox vida, nötr silikon enjeksiyon. Membran daima iç yüzeye. Derz: ΔT×L×α×1.5 güvenlik katsayısı.`

  const stickErrors = STICK_ERROR_SCORING.errors.map(e =>
    `• [Skor ${e.globalScore}/5 — ${e.severity}] ${e.name}: ${e.trDescription} → ${e.trSolution} (${e.standard})`
  ).join('\n')

  const windowsillRules = FACADE_AUXILIARY_DEFECTS.windowsillDefects.map(d =>
    `• Denizlik hatası: "${d.defect}" → ${d.consequence} → Önlem: ${d.prevention}`
  ).join('\n')

  const panelTests = PANEL_CW_PERFORMANCE.facadeTests.map(t =>
    `• Test: ${t.name} — Sınıf: ${t.performanceClass||'—'} (${t.standard})`
  ).join('\n')

  const thermalData = THERMAL_PERFORMANCE_TR.keyFindings.flatMap(f => f.findings || f.recommendations?.map(r => `${r.zone}: U duvar ≤${r.uWall} W/m²K, U pencere ≤${r.uWindow}`) || []).map(x => `• ${x}`).join('\n')

  const dsfTypes = DOUBLE_SKIN_FACADES.types.map(t =>
    `• DSF ${t.name}: U=${t.uValue} — ${t.bestFor}`
  ).join('\n')

  const costTable = PRECOST_MODELING.costDrivers[0].data.map(d =>
    `• ${d.system}: ${d.costRange}`
  ).join('\n')

  const turkeyProblems = STICK_CW_TURKEY_PROBLEMS.keyProblems.flatMap(p =>
    p.items.map(item => `• [${p.category}] ${item}`)
  ).join('\n')

  const durabilityNotes = ALUMINIUM_DURABILITY.keyFindings
    .flatMap(f => f.findings || []).slice(0, 8).map(f => `• ${f}`).join('\n')

  const maintenanceCoatings = Object.entries(ALUMINIUM_DURABILITY.maintenanceGuide)
    .map(([k,v]) => `• ${k}: ${v}`).join('\n')

  const standardReqs = [
    `Cam U ≤ ${FACADE_STANDARD.systemRequirements.windows.minU}`,
    `Hava geçirmezlik ${FACADE_STANDARD.systemRequirements.windows.airInfiltration}`,
    `Su sızdırmazlık ${FACADE_STANDARD.systemRequirements.windows.waterTightness}`,
    `Rüzgar direnci ${FACADE_STANDARD.systemRequirements.windows.windResistance}`,
    `ACM yangın: NFPA 285 veya BS 8414 A2 core zorunlu`,
    `Yapısal sealant: her partiden numune gerilme/uzama testi zorunlu`
  ].map(r => `• ${r}`).join('\n')

  return `
=== AluSight CEPHE UZMANLIK VERİTABANI ===

KAYNAKLAR: Şantiye® (Özdemir), FMT (Govind&Yılmaz 2017), IOP (Baş vd.2022), Respondek (2022), ODTÜ (Şengün 2013), Buildings (Cano 2022), Gazi MMF Dergisi, IEA EBC Annex43, Pre-design Cost Modeling

TÜRK SEKTÖRÜ: Binaların %95+ ısı yalıtım sorunu; mantolama %95 yanlış; hataların %62'si hem tasarım hem uygulama birlikte

TASARIM/UYGULAMA HATALARI:
${failureList}

STICK CW HATA SKORING (Respondek 2022 — 0-5):
${stickErrors}

GÖRSEL VAKALAR:
${visualCases}
${drainageDetail}

DENİZLİK HATALARI (1033 dava):
${windowsillRules}
• Denize <5km → A4-316 SS zorunlu; güney+doğu cephe en riskli

PANEL CW TEST REFERANSLARI:
${panelTests}

GÖRSEL TANI:
${diagnosisList}

ISIL PERFORMANS — TÜRKİYE İKLİM BÖLGELERİ:
${thermalData}
• Alüminyum λ=160 W/mK; termal kesim olmadan yalıtımı %40'a kadar etkisiz kılar
• Termal break olmayan profil: U=3.5–5.5 W/m²K; termal break'li: U=1.4–2.0 W/m²K

ÇİFT KABUKLU CEPHE (DSF) TİPLERİ:
${dsfTypes}
• DSF ısıtma enerjisi %20–40 azaltır; yangın bölmesi katta zorunlu (EN 13501-1)

SİSTEM MALİYET REHBERİ (€/m²):
${costTable}
• Yükseklik çarpanı: >60m = ×1.65; >100m = ×2.0+; Form çarpanı: eğri = ×1.25–2.50
• 30 yıl toplam sahip olma maliyeti = ilk yatırım × 1.8–2.5

SİLİKON KURALLARI: ${sealantRules}

TÜRKİYE ÇUBUK CW SORUNLARI (Gazi MMF 2022 — Saha Araştırması):
${turkeyProblems}

ALÜMİNYUM DAYANIKLILIK — KAPLAMA SİSTEMLERİ (Stacey/IAI 2014 — 50 tarihi yapı):
${durabilityNotes}
BAKIM REHBERİ:
${maintenanceCoatings}

CEPHE STANDART GEREKSİNİMLERİ (Sydney Univ. Facade Standard v2.0):
${standardReqs}

STANDARTLAR: EN ISO 10077, EN 13830, EN ISO 11600-25LM, ASTM C1193, TS 825, EN 1279, EN 12208, EN 1090, EN 12153, EN 12179, EN 14019, EN 13501-1, EN 1364-3/4, NFPA 285, BS 8414, EN 12207, EN 12210
`.trim()
}

/* ── Sorgu bazlı arama ──────────────────────────────────────────────── */
export function searchKnowledge(query) {
  const q = query.toLowerCase()
  const ctx = buildKnowledgeContext()
  // Paragrafları satırlara böl, ilgili olanları seç
  const lines = ctx.split('\n')
  const keywords = q.split(/\s+/).filter(w => w.length > 2)
  const scored = lines.map(line => {
    const l = line.toLowerCase()
    const score = keywords.reduce((s, k) => s + (l.includes(k) ? 1 : 0), 0)
    return { line, score }
  })
  const relevant = scored
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 30)
    .map(x => x.line)
    .join('\n')
  return relevant || ''
}
