const FAQS = [
  {
    q: 'Hangi hizmetleri sunuyorsunuz?',
    a: 'Alüminyum doğrama, giydirme cephe / curtain wall, cam balkon ve korkuluk sistemleri, ofis bölme, pergola, tente ve endüstriyel özel profil çözümleri üretiyor ve uyguluyoruz.',
  },
  {
    q: 'Teklif almak için ne yapmam gerekir?',
    a: 'Web sitemizdeki teklif formunu doldurabilir veya +90 535 861 0404 numaralı hattı arayabilirsiniz. Proje detaylarınızı paylaştıktan sonra ücretsiz keşif ve fiyatlandırma sağlıyoruz.',
  },
  {
    q: 'Kullandığınız malzemeler garantili mi?',
    a: 'Evet. Profil, cam, donanım ve aksesuarlarımız seçkin Avrupa ve yerli tedarikçilerden temin edilmekte; uygulamalarımızda standartlara uygunluk ve işçilik garantisi sunulmaktadır.',
  },
  {
    q: 'Sadece İstanbul’a mı hizmet veriyorsunuz?',
    a: 'Merkezimiz İstanbul’da olmakla birlikte Türkiye genelinde projeler üstlenebiliyoruz. Projenizin konumuna göre lojistik planlaması yapıyoruz.',
  },
  {
    q: 'AluSight Öneri \u0026 Analiz aracı ne işe yarar?',
    a: 'Yüklediğiniz fotoğraf veya videoları yapay zeka ile analiz ederek alüminyum sistemdeki olası sorunları, yalıtım durumunu ve önerilen çözümleri hızlı bir rapor halinde sunar.',
  },
  {
    q: 'AI analiz raporu yerine uzman incelemesi alabilir miyim?',
    a: 'Kesinlikle. AI raporu ön değerlendirme amaçlıdır. Talebiniz üzerine saha ekibimiz yerinde detaylı teknik inceleme yaparak resmi rapor ve teklif hazırlar.',
  },
]

export default function SssPage() {
  return (
    <div className="min-h-screen bg-alusight-900 text-white py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-display font-800 mb-2">Sıkça Sorulan Sorular</h1>
        <p className="text-white/40 mb-8">Merak edilenleri yanıtladık.</p>
        <div className="gold-line mb-10" />

        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-5">
              <h3 className="font-display font-700 text-gold-400 mb-2">{faq.q}</h3>
              <p className="text-white/60 text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
