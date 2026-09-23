export default function KullanimKosullariPage() {
  return (
    <div className="min-h-screen bg-alusight-900 text-white py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-display font-800 mb-6">Kullanım Koşulları</h1>
        <div className="gold-line mb-8" />

        <p className="text-white/60 leading-relaxed mb-6">
          Bu web sitesini kullanarak aşağıdaki koşulları kabul etmiş sayılırsınız. Lütfen dikkatlice okuyunuz.
        </p>

        <h2 className="text-xl font-display font-700 text-gold-400 mt-8 mb-4">Hizmet Kapsamı</h2>
        <p className="text-white/60 leading-relaxed mb-6">
          Site; bilgilendirme, hesaplama araçları, teklif talebi ve AI destekli ön analiz amacıyla sunulmaktadır.
          Sitedeki hesaplama ve analiz sonuçları yalnızca bilgilendirme amaçlıdır; bağlayıcı teknik rapor veya
          resmi teklif yerine geçmez.
        </p>

        <h2 className="text-xl font-display font-700 text-gold-400 mt-8 mb-4">Sorumluluk Reddi</h2>
        <ul className="list-disc list-inside text-white/60 leading-relaxed space-y-2 mb-6">
          <li>AI analizleri ön değerlendirmedir; kesin kararlar için uzman incelemesi şarttır.</li>
          <li>Fiyat hesaplayıcıları tahmini değerler sunar; kesin fiyat için yazılı teklif gerekir.</li>
          <li>Sitedeki teknik bilgiler öneri niteliğindedir; proje şartnamesi ve statik hesaplar müşteri sorumluluğundadır.</li>
        </ul>

        <h2 className="text-xl font-display font-700 text-gold-400 mt-8 mb-4">Fikri Mülkiyet</h2>
        <p className="text-white/60 leading-relaxed mb-6">
          Sitedeki metin, görsel, logo, hesaplama araçları ve yazılım kodları AluSight’a aittir. İzinsiz
          kopyalama, dağıtım veya ticari kullanım yasaktır.
        </p>

        <h2 className="text-xl font-display font-700 text-gold-400 mt-8 mb-4">Değişiklikler</h2>
        <p className="text-white/60 leading-relaxed">
          Kullanım koşulları önceden haber verilmeksizin güncellenebilir. Güncel versiyon her zaman bu sayfada
          yayımlanır.
        </p>
      </div>
    </div>
  )
}
