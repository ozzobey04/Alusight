import { useState, useMemo } from 'react'

const ARTICLES = [
  {
    id: 1, category: 'Cephe Hataları', tag: 'hata',
    title: 'Yağmur Suyu Sızıntısı — En Yaygın Cephe Hatası',
    summary: 'Türkiye\'de 460+ bina incelemesine göre yağmur suyu kaynaklı cephe hasarları ve önleme yöntemleri.',
    content: `Türkiye'de yapılan saha araştırmalarında (İstanbul Beşiktaş, 460+ bina) cephe hatalarının başında yağmur suyu penetrasyonu gelmektedir.

**En Yaygın Nedenler:**
• Yetersiz su yalıtımı ve hatalı membran uygulaması
• Tıkalı veya eksik drenaj olukları
• Derz dolgu malzemesinin zamanla bozulması
• Yanlış mastik seçimi veya uygulama hatası

**Önleme Yöntemleri:**
• Cephe alt bitişlerinde mutlaka drenaj fittingi kullanın
• Su bariyerini sistemin dış yüzüne değil, iç tarafına uygulayın
• Dilatasyon derzlerini standartlara (TS EN 13830) uygun bırakın
• Her 5 yılda bir silikonları kontrol edin ve yenileyin

**Standartlar:** TS EN 998-1, TS EN 1015, EN ISO 10077`,
    source: 'Baş ve ark. (2022) — IOP Conf. Ser., İstanbul Beşiktaş Saha Araştırması',
    readTime: '3 dk', icon: '💧'
  },
  {
    id: 2, category: 'Isı Yalıtımı', tag: 'yalitim',
    title: 'Termal Köprü — Görünmez Enerji Kaybı',
    summary: 'Alüminyum profillerde termal köprü oluşumu, ısı kaybı hesabı ve termal kesme yöntemleri.',
    content: `Alüminyum yüksek ısı iletkenliğine sahiptir (λ = 160 W/mK). Termal kesme (polyamide/PU köpük) olmadan profil doğrudan ısı köprüsü oluşturur.

**Termal Köprü Tipleri:**
• **Geometrik:** Köşe birleşimleri, döşeme-cephe bağlantı noktaları
• **Malzeme:** İç ve dış profil arasında kesintisiz metal temas
• **Montaj:** Hatalı ankraj, ısıyı kesen tampon eksikliği

**Etkileri:**
• Yüzey sıcaklığı düşer → yoğuşma → küf
• U-değeri artar → enerji faturası yükselir
• TS 825'e göre hesaplanan yoğuşma riski artışı

**Çözümler:**
• Polyamide PA66-GF25 termal kesme: λ ≤ 0.3 W/mK
• Köşe bağlantılarında PVC veya plastik izolatör kullanımı
• Psi (ψ) lineer ısı iletim katsayısı hesabı (EN ISO 10211)

**Hedef:** Uf ≤ 1.4 W/m²K (iklim bölgesine göre değişir)`,
    source: 'EN ISO 10211, TS 825, Flixo hesap yöntemi',
    readTime: '4 dk', icon: '🌡️'
  },
  {
    id: 3, category: 'Montaj Hataları', tag: 'montaj',
    title: 'Genleşme Derzinin Unutulması — Kritik Montaj Hatası',
    summary: 'Termal genleşmenin göz ardı edilmesi sonucu oluşan hasar tipleri ve doğru derz hesabı.',
    content: `Alüminyumun termal genleşme katsayısı α = 23 × 10⁻⁶ /°C'dir. 6 metrelik bir profilde yaz-kış arasındaki 60°C sıcaklık farkı yaklaşık 8.3 mm genleşme/büzülme yaratır.

**Sık Yapılan Hatalar:**
• Dilatasyon vidasının sabit bırakılması (hareket engellenir)
• Ekspansiyon boşluğu olmadan profillerin birleştirilmesi
• Geçici montaj takozlarının söküp alınmaması

**Gerçek Vakalar (FMT, 2017):**
• İstanbul projesi: Su yalıtım membranı yanlış yüzeye uygulandı
• Moskova projesi: Aynı hata farklı yüklenici tarafından tekrarlandı
• İstanbul-2: Çizim doğruydu, usta yanlış uyguladı

**Doğru Uygulama:**
• Her 3-4 metrede bir dilatasyon derzi (standart: 6mm/3m)
• Kaydırmalı vida deliği: minimum 2× genleşme miktarı
• İki yönlü hareket için oval delik kullanımı

**Standart:** EN 13830 — Curtain Wall Product Standard`,
    source: 'Govind & Yılmaz, ICBEST 2017 — FMT Mühendislik Vaka Çalışmaları',
    readTime: '4 dk', icon: '⚠️'
  },
  {
    id: 4, category: 'Cephe Tasarımı', tag: 'tasarim',
    title: 'Cephe Tasarımında Konsept ve Strüktürel Denge',
    summary: 'Mimari konsept ve mühendislik gerçekliği arasındaki denge — Erdal Özdemir\'in 10 sorusu.',
    content: `Cephe tasarımı iki ayrı disiplin gerektirir:

**1. Konsept / Mimari Tasarım:**
• Proporsiyon bilgisi ve temel sanat eğitimi
• El ile çizim alışkanlığı (dijital araçlardan önce)
• Her tasarımın bir hikayesi olmalı
• 3B modelleme ve maket ile doğrulama

**2. Strüktürel Tasarım:**
• Cephe mühendisinin devrede olması şart
• Sistem kesitleri, detaylar, bağlantılar
• Teknik şartname: işçilik, malzeme, montaj standartları
• TSE ve Euronorm referansları

**Altın Kural:**
"Yapılamayacak, piyasada olmayan bir tasarım işe yaramaz. Mimarın optimizasyonları yapmış olması şarttır."

**Cephe Danışmanının Rolü:**
• İhale dosyası hazırlamak
• Firma yeterliliği değerlendirmek
• Üretim + nakliye + montaj denetimi
• 3T metodolojisi: Tespit → Teşhis → Tedavi`,
    source: 'Erdal Özdemir (Cephe Mühendisi) — Şantiye® Dergisi, Kasım-Aralık 2022',
    readTime: '5 dk', icon: '🏗️'
  },
  {
    id: 5, category: 'Standartlar', tag: 'standart',
    title: 'Türkiye\'de Cephe Standartları ve Uygulanabilirlik',
    summary: 'TS EN 13830, EN ISO 10077, EN 1991-1-4 başlıca cephe standartları ve pratik uygulamaları.',
    content: `**Temel Cephe Standartları:**

| Standart | Konu |
|----------|------|
| EN 13830 | Curtain Wall — Ürün Standardı |
| EN ISO 10077-1 | Pencere/Kapı Isıl İletkenlik Hesabı |
| EN ISO 10211 | Termal Köprü Hesabı |
| EN 1991-1-4 | Rüzgar Yükleri |
| TS 825 | Binalarda Isı Yalıtım Kuralları |
| EN 12207/8/9 | Hava/Su/Rüzgar Geçirmezlik Sınıfı |

**Türkiye'deki Durum:**
• Standartlara uygunluğu denetleyen kurum yok
• Test sonuçları fotokopi olarak sunuluyor, gerçekliği sorgulanmıyor
• Mastik uygulaması için bile temel teknik şartname yok

**Pratik Yaklaşım:**
• Teknik şartnameleri hazırlarken EN normlarını referans alın
• Firma seçiminde fabrika ziyareti yapın
• İşçilik kalitesi için montaj sırasında yerinde denetim şart

**Önemli:** 2. Dünya Savaşı sonrası Avrupa'nın mastik teknik şartnameleri bugünkü Türkiye'den daha ileri düzeydeydi.`,
    source: 'EN 13830, TS 825, FMT Mühendislik — Teknik Belgeler',
    readTime: '3 dk', icon: '📋'
  },
  {
    id: 6, category: 'Alüminyum Dayanıklılık', tag: 'malzeme',
    title: 'Alüminyum Profil Dayanıklılığı ve Yüzey Koruma',
    summary: 'Toz boya, anodizasyon ve PVDF kaplama karşılaştırması — korozyon direnci ve ömür analizi.',
    content: `Alüminyum doğal olarak oksit tabakası oluşturur (Al₂O₃) ve iyi korozyon direncine sahiptir. Ancak mimari uygulamalarda yüzey koruma zorunludur.

**Kaplama Yöntemleri Karşılaştırması:**

| Yöntem | Kalınlık | Ömür | Renk Seçeneği |
|--------|----------|------|---------------|
| Toz Boya (Qualicoat) | 60-80 μm | 10-15 yıl | Sınırsız RAL |
| Anodizasyon (Class 20) | 20 μm | 20-25 yıl | Sınırlı |
| PVDF / Kynar | 25-35 μm | 25-30 yıl | Çok geniş |

**Korozyon Riski Faktörleri:**
• Deniz kıyısı: Cl⁻ iyonları agresif etki (C4/C5 sınıfı ortam)
• Endüstriyel bölge: SO₂ ve asit yağmuru
• Galvanik korozyon: Alüminyum + çelik temas noktaları

**Test Standartları:**
• EN ISO 9227 — Tuz sisi testi (2000+ saat C5 için)
• EN 12206-1 — Toz boya spesifikasyonu
• Qualicoat lisansı: 3 yılda bir denetim

**Bakım Önerileri:**
• Yılda 2 kez yumuşak deterjanla yıkama
• Agresif temizleyici kullanmayın
• 10 yılda bir silikonları yenileyin`,
    source: 'Stacey/IAI 2014, EN ISO 9227, Qualicoat Spesifikasyonları',
    readTime: '4 dk', icon: '🔩'
  },
  {
    id: 7, category: 'Enerji Verimliliği', tag: 'enerji',
    title: 'Çift Cidarlı Cepheler (Double Skin Facade)',
    summary: 'DSF tipleri, enerji tasarrufu potansiyeli, akustik avantajlar ve Türkiye uygulamaları.',
    content: `Çift Cidarlı Cephe (DSF), iki cam katman arasında hava boşluğu bırakılan gelişmiş bir cephe sistemidir.

**DSF Tipleri (IEA EBC Annex 43):**
• **Tampon Bölge (Buffer Zone):** Sürekli hava boşluğu, pasif enerji
• **Koridorlu (Corridor):** Her katta ayrı bölmeli, yangın önlemi kolay
• **Şaft-Kutu:** Dikey hava akışı, çoklu kat
• **Çok Katlı (Multistory):** Bütün bina tek boşluk, büyük ölçekli

**Avantajlar:**
• U-değeri 0.5–0.8 W/m²K'ye kadar düşer (tek cepheye göre %50 iyileşme)
• Akustik azaltım: +10-15 dB(A)
• Yaz güneş koruması: Dış cephe önündeki jaluziler korunmuş
• Doğal havalandırma potansiyeli

**Dikkat Edilmesi Gerekenler:**
• Yangın durumunda hava bacası etkisi (kompartıman bölmesi şart)
• Temizlik erişimi planlanmalı
• Nem ve yoğuşma kontrolü

**Maliyet:** Tek cepheye göre %40-80 daha pahalı; uzun vadede enerji tasarrufu ile geri kazanılır.`,
    source: 'IEA EBC Annex 43 — Double Skin Facades Literature Review',
    readTime: '5 dk', icon: '🏢'
  },
  {
    id: 8, category: 'Maliyet Yönetimi', tag: 'maliyet',
    title: 'Cephe Ön Tasarım Maliyet Tahmini',
    summary: 'GAM (Genelleştirilmiş Doğrusal Model) yöntemi ile erken aşamada cephe maliyeti tahmini.',
    content: `Cephe maliyeti genellikle yapı toplam maliyetinin %15-25'ini oluşturur. Erken aşamada doğru tahmin kritik önemdedir.

**Maliyet Bileşenleri (Tipik Perde Duvar):**
• Cam: %40-45
• Montaj işçiliği: %28-32
• Alüminyum profil: %15-18
• Aksesuar/mastik: %5-8
• Nakliye/lojistik: %3-5

**Erken Aşama Tahmin Faktörleri:**
• Bina yüksekliği (montaj güçlüğü artar)
• Cam/opak oran
• Cephe karmaşıklığı (düz=1.0, köşeli=1.2, parametrik=1.5-2.0)
• Sistem tipi (stik=1.0, üniterize=1.3, özel=1.5+)

**m² Birim Fiyat Aralıkları (2024, Türkiye):**
• Standart alüminyum+cam: 150-250 $/m²
• Üniterize sistem: 300-500 $/m²
• Özel/parametrik: 600-1500 $/m²

**Danışmanlık Değeri:**
"Danışmanlık maliyetinin 50 katını yatırımcı o projede kazanıyor — kronik sorunlar yaşanmıyor." (E. Özdemir)`,
    source: 'Leśniak & Górka (2021), GAM Maliyet Modeli; Erdal Özdemir Röportajı',
    readTime: '4 dk', icon: '💰'
  },
  {
    id: 9, category: 'Cam Sistemleri', tag: 'cam',
    title: 'Mimari Cam Seçim Kriterleri',
    summary: 'U-değeri, g-değeri (solar faktör), görünür ışık geçirgenliği ve cam tabakası seçimi.',
    content: `Cam, modern cephelerin en kritik bileşenidir. Yanlış cam seçimi enerji, konfor ve estetik sorunlarına yol açar.

**Temel Cam Parametreleri:**
• **Ug** — Camın ısıl iletkenliği (W/m²K); düşük = daha iyi yalıtım
• **g-değeri** — Toplam güneş enerjisi geçişi (0-1); düşük = daha az güneş ısıtması
• **Lt** — Görünür ışık geçirgenliği (%); yüksek = daha aydınlık
• **Rw** — Ses azaltım değeri (dB)

**Cam Tipleri:**
| Tip | Ug | g | Kullanım |
|-----|-----|---|---------|
| Çift cam (4/16/4) | 1.1 | 0.62 | Standart |
| Low-E çift (4/16/4) | 0.6 | 0.40 | Yüksek verimli |
| Üçlü cam (4/12/4/12/4) | 0.5 | 0.35 | Pasif ev |
| Güneş kontrol | 1.1 | 0.25 | Güney cephe |

**Bölgeye Göre Öneri:**
• Kuzey cephe: Yüksek g (güneş ısıtması faydalı)
• Güney/Batı: Düşük g (aşırı ısınma engeli)
• Akustik bölge: Lamine + asimetrik kalınlık

**Standartlar:** EN 673 (Ug hesabı), EN 410 (optik özellikler)`,
    source: 'EN 673, EN 410, EN ISO 10077 — Cam Özellikleri Standartları',
    readTime: '4 dk', icon: '🪟'
  },
  {
    id: 10, category: 'Sektör & Piyasa', tag: 'sektor',
    title: 'Türkiye Alüminyum Cephe Sektörü Analizi',
    summary: 'Sektörün büyüme trendi, kalite sorunları, kariyer fırsatları ve gelecek projeksiyonu.',
    content: `Türkiye alüminyum cephe sektörü büyüklük olarak güçlü, kalite olarak zayıf bir profil çiziyor.

**Sektör Gerçekleri:**
• Türkiye üretilen cephelerin %95'inde ısı yalıtım sorunu var (E. Özdemir)
• Montaj sektörü tamamen denetimsiz ve sertifikasız
• Dünya standartlarıyla rekabet eden firmalar yurt dışına yöneliyor
• Kalite sistemi olan firma sayısı yok denecek kadar az

**Kariyer & Eğitim Açığı:**
• Hiçbir Türkiye üniversitesinde cephe mühendisliği bölümü yok
• Mimarlık mezunları cephe çizemeyor
• Montajcılar kendi kendine "ustalaşıyor"

**Fırsatlar:**
• Enerji kimlik belgesi zorunluluğu → yalıtımlı sistem talebi artıyor
• Yurt dışı projeler (Körfez, Kuzey Afrika, Avrupa)
• Cephe danışmanlığı: henüz gelişmekte olan alan
• Parametrik cepheler: dünyada trend

**Gelecek Trendler:**
• Parametrik / amorf cepheler yaygınlaşacak
• Akıllı cam (electrochromic) pazar payı artacak
• Karbon nötr bina zorunluluğu EPD belgesi önemini artıracak
• BIM entegrasyonu zorunlu hale gelecek`,
    source: 'Erdal Özdemir — Şantiye® 2022; Gazi MMF Türkiye ÇAGC Araştırması',
    readTime: '4 dk', icon: '📈'
  }
]

const CATEGORIES = ['Tümü', 'Cephe Hataları', 'Isı Yalıtımı', 'Montaj Hataları', 'Cephe Tasarımı', 'Standartlar', 'Alüminyum Dayanıklılık', 'Enerji Verimliliği', 'Maliyet Yönetimi', 'Cam Sistemleri', 'Sektör & Piyasa']

export default function BilgiPage() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('Tümü')
  const [openArticle, setOpenArticle] = useState(null)

  const filtered = useMemo(() => {
    return ARTICLES.filter(a => {
      const matchCat = activeCategory === 'Tümü' || a.category === activeCategory
      const q = search.toLowerCase()
      const matchSearch = !q || a.title.toLowerCase().includes(q) || a.summary.toLowerCase().includes(q) || a.category.toLowerCase().includes(q)
      return matchCat && matchSearch
    })
  }, [search, activeCategory])

  const renderContent = (text) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={i} className="font-bold text-blue-300 mt-3 mb-1">{line.replace(/\*\*/g, '')}</p>
      }
      if (line.startsWith('• ')) {
        const parts = line.slice(2).split(/\*\*(.*?)\*\*/g)
        return (
          <div key={i} className="flex gap-2 mb-1">
            <span className="text-blue-400 mt-0.5 flex-shrink-0">•</span>
            <span className="text-gray-300 text-sm">
              {parts.map((p, j) => j % 2 === 1 ? <strong key={j} className="text-white">{p}</strong> : p)}
            </span>
          </div>
        )
      }
      if (line.startsWith('| ') && line.includes(' | ')) {
        const cells = line.split(' | ').map(c => c.replace(/^\|/, '').replace(/\|$/, '').trim())
        const isHeader = cells.every(c => c)
        return (
          <div key={i} className={`flex gap-2 text-xs ${isHeader && i > 0 ? 'border-t border-blue-800/30' : ''}`}>
            {cells.map((c, j) => (
              <span key={j} className={`flex-1 py-1 ${j === 0 ? 'text-gray-300' : 'text-gray-400'}`}>{c}</span>
            ))}
          </div>
        )
      }
      if (line.trim() === '') return <div key={i} className="h-2" />
      const parts = line.split(/\*\*(.*?)\*\*/g)
      return (
        <p key={i} className="text-gray-300 text-sm mb-1">
          {parts.map((p, j) => j % 2 === 1 ? <strong key={j} className="text-white">{p}</strong> : p)}
        </p>
      )
    })
  }

  return (
    <div className="min-h-screen bg-[#070d1f] text-white">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#0d1630] to-[#070d1f] pt-10 pb-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-extrabold mb-2">Teknik Bilgi Bankası</h1>
          <p className="text-gray-400 text-sm mb-6">Cephe sistemleri, alüminyum doğrama ve enerji verimliliği konularında uzman rehberi</p>

          {/* Search */}
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Makale ara... (termal köprü, montaj hatası, cam...)"
              className="w-full bg-[#0d1630] border border-blue-800/40 rounded-xl pl-11 pr-4 py-3 text-sm outline-none focus:border-blue-500 placeholder-gray-600"
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-16">
        {/* Categories */}
        <div className="flex gap-2 flex-wrap mb-6 -mx-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                activeCategory === cat
                  ? 'bg-blue-600 border-blue-500 text-white'
                  : 'bg-[#0d1630] border-blue-800/30 text-gray-400 hover:border-blue-500/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Count */}
        <p className="text-xs text-gray-600 mb-4">{filtered.length} makale bulundu</p>

        {/* Articles Grid */}
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map(article => (
            <button
              key={article.id}
              onClick={() => setOpenArticle(article)}
              className="text-left bg-[#0d1630] border border-blue-800/20 rounded-xl p-5 hover:border-blue-500/50 transition-all hover:-translate-y-0.5 group"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">{article.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-blue-400/70 bg-blue-900/20 px-2 py-0.5 rounded-full">{article.category}</span>
                    <span className="text-xs text-gray-600">{article.readTime}</span>
                  </div>
                  <h3 className="font-bold text-sm mb-1 group-hover:text-blue-300 transition-colors">{article.title}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2">{article.summary}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center text-gray-600 py-16">
            <p className="text-4xl mb-3">🔍</p>
            <p>Arama sonucu bulunamadı</p>
          </div>
        )}
      </div>

      {/* Article Modal */}
      {openArticle && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
          <div className="bg-[#0d1630] w-full md:max-w-2xl max-h-[92vh] md:rounded-2xl overflow-hidden flex flex-col border border-blue-800/30">
            <div className="p-5 border-b border-blue-800/20 flex items-start gap-3">
              <span className="text-3xl">{openArticle.icon}</span>
              <div className="flex-1">
                <span className="text-xs text-blue-400/70">{openArticle.category}</span>
                <h2 className="font-extrabold text-base mt-0.5">{openArticle.title}</h2>
              </div>
              <button onClick={() => setOpenArticle(null)} className="text-gray-500 hover:text-white p-1">✕</button>
            </div>
            <div className="p-5 overflow-y-auto flex-1">
              {renderContent(openArticle.content)}
              <div className="mt-6 pt-4 border-t border-blue-800/20">
                <p className="text-xs text-gray-600">📚 Kaynak: {openArticle.source}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
