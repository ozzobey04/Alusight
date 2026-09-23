export default function GizlilikPolitikasiPage() {
  return (
    <div className="min-h-screen bg-alusight-900 text-white py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-display font-800 mb-6">Gizlilik Politikası</h1>
        <div className="gold-line mb-8" />

        <p className="text-white/60 leading-relaxed mb-6">
          AluSight olarak kişisel verilerinizin güvenliği bizim için önemlidir. Bu politika, web sitemizi ve
          hizmetlerimizi kullanırken toplanan verilerin nasıl işlendiğini açıklar.
        </p>

        <h2 className="text-xl font-display font-700 text-gold-400 mt-8 mb-4">Toplanan Veriler</h2>
        <ul className="list-disc list-inside text-white/60 leading-relaxed space-y-2 mb-6">
          <li>İsim, telefon, e-posta ve şehir bilgileri (teklif formu aracılığıyla)</li>
          <li>Proje detayları ve saha gözlemleri</li>
          <li>Öneri \u0026 Analiz aracına yüklenen fotoğraf/video kayıtları</li>
          <li>Çerezler ve kullanım istatistikleri (anonim)</li>
        </ul>

        <h2 className="text-xl font-display font-700 text-gold-400 mt-8 mb-4">Verilerin Kullanım Amacı</h2>
        <ul className="list-disc list-inside text-white/60 leading-relaxed space-y-2 mb-6">
          <li>Teklif ve proje değerlendirmesi yapmak</li>
          <li>Sizinle iletişime geçmek</li>
          <li>Hizmet kalitemizi geliştirmek</li>
          <li>Yasal yükümlülükleri yerine getirmek</li>
        </ul>

        <h2 className="text-xl font-display font-700 text-gold-400 mt-8 mb-4">Üçüncü Taraflarla Paylaşım</h2>
        <p className="text-white/60 leading-relaxed mb-6">
          Kişisel verileriniz; yasal zorunluluklar dışında, önceden açık izniniz olmadan üçüncü taraflarla
          paylaşılmaz. Yapay zeka analizleri için görseller, yalnızca rapor oluşturma amacıyla ilgili servis
          sağlayıcılarına iletilir.
        </p>

        <h2 className="text-xl font-display font-700 text-gold-400 mt-8 mb-4">Haklarınız</h2>
        <p className="text-white/60 leading-relaxed">
          Kişisel verilerinize erişim, düzeltme, silme ve işlenmeye itiraz haklarınız vardır. Talepleriniz için
          <a href="mailto:info@alusight.com" className="text-gold-400 hover:underline">info@alusight.com</a>
          adresine yazabilirsiniz.
        </p>
      </div>
    </div>
  )
}
