export default function KvkkPage() {
  return (
    <div className="min-h-screen bg-alusight-900 text-white py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-display font-800 mb-6">KVKK Aydınlatma Metni</h1>
        <div className="gold-line mb-8" />

        <p className="text-white/60 leading-relaxed mb-6">
          6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında, AluSight olarak kişisel verilerinizin
          işlenmesine ilişkin sizi bilgilendiririz.
        </p>

        <h2 className="text-xl font-display font-700 text-gold-400 mt-8 mb-4">Veri Sorumlusu</h2>
        <p className="text-white/60 leading-relaxed mb-6">
          AluSight İletişim:
          <a href="mailto:info@alusight.com" className="text-gold-400 hover:underline">info@alusight.com</a>
          <br />
          Telefon:
          <a href="tel:+905358610404" className="text-gold-400 hover:underline">+90 535 861 0404</a>
        </p>

        <h2 className="text-xl font-display font-700 text-gold-400 mt-8 mb-4">İşlenen Kişisel Veriler</h2>
        <ul className="list-disc list-inside text-white/60 leading-relaxed space-y-2 mb-6">
          <li>Kimlik bilgileri (ad, soyad)</li>
          <li>İletişim bilgileri (telefon, e-posta, adres/şehir)</li>
          <li>Proje ve saha bilgileri</li>
          <li>Görsel kayıtlar (analiz amacıyla yüklenen fotoğraf/video)</li>
        </ul>

        <h2 className="text-xl font-display font-700 text-gold-400 mt-8 mb-4">Veri İşleme Amaçları</h2>
        <ul className="list-disc list-inside text-white/60 leading-relaxed space-y-2 mb-6">
          <li>Teklif ve sipariş süreçlerini yürütmek</li>
          <li>Müşteri iletişimi ve destek sağlamak</li>
          <li>Yasal yükümlülükleri yerine getirmek</li>
          <li>Hizmet kalitesini artırmak</li>
        </ul>

        <h2 className="text-xl font-display font-700 text-gold-400 mt-8 mb-4">Haklarınız</h2>
        <p className="text-white/60 leading-relaxed">
          KVKK madde 11 uyarınca; kişisel verilerinizin işlenip işlenmediğini öğrenme, düzeltme, silme veya
          anonimleştirme talep etme haklarına sahipsiniz. Taleplerinizi yukarıdaki iletişim kanalları üzerinden
          iletebilirsiniz.
        </p>
      </div>
    </div>
  )
}
