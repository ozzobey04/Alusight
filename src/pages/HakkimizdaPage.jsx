export default function HakkimizdaPage() {
  return (
    <div className="min-h-screen bg-alusight-900 text-white py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-display font-800 mb-6">Hakkımızda</h1>
        <div className="gold-line mb-8" />

        <p className="text-white/60 leading-relaxed mb-6">
          AluSight, alüminyum doğrama, giydirme cephe, cam korkuluk, ofis bölme ve özel mimari çözümler alanlarında
          faaliyet gösteren bir yapı teknolojileri firmasıdır. 8 yılı aşkın sektör deneyimimizle; kaliteli malzeme, hassas
          işçilik ve mühendislik odaklı yaklaşımı bir araya getiriyoruz.
        </p>

        <h2 className="text-xl font-display font-700 text-gold-400 mt-10 mb-4">Misyonumuz</h2>
        <p className="text-white/60 leading-relaxed mb-6">
          Projelerinizde estetik, dayanıklılık ve enerji verimliliğini optimum seviyede buluşturan alüminyum sistemleri
          sunmak; müşterilerimize güvenilir, şeffaf ve sürdürülebilir çözümler sağlamak.
        </p>

        <h2 className="text-xl font-display font-700 text-gold-400 mt-10 mb-4">Vizyonumuz</h2>
        <p className="text-white/60 leading-relaxed mb-6">
          Türkiye’nin önde gelen alüminyum cephe ve doğrama çözüm ortaklarından biri olmak; dijital hesaplama araçları ve
          yapay zeka destekli analizlerle sektöre öncülük etmek.
        </p>

        <h2 className="text-xl font-display font-700 text-gold-400 mt-10 mb-4">Değerlerimiz</h2>
        <ul className="list-disc list-inside text-white/60 leading-relaxed space-y-2">
          <li>Kalite ve standartlara uygunluk</li>
          <li>Şeffaf fiyatlandırma ve sözleşme anlayışı</li>
          <li>Müşteri odaklı hizmet ve teknik destek</li>
          <li>Sürdürülebilir ve enerji verimli çözümler</li>
        </ul>

        <div className="mt-12 p-6 bg-white/5 border border-white/10 rounded-xl">
          <p className="text-sm text-white/40">
            Detaylı bilgi ve teknik danışmanlık için bize
            <a href="tel:+905358610404" className="text-gold-400 hover:underline">+90 535 861 0404</a> numaralı hattan
            ulaşabilirsiniz.
          </p>
        </div>
      </div>
    </div>
  )
}
