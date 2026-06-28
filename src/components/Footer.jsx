import Logo from './Logo'

const footerLinks = {
  Hizmetler: [
    'Alüminyum Doğrama',
    'Giydirme Cephe',
    'Cam Balkon & Korkuluk',
    'Ofis Bölme Sistemleri',
    'Pergola & Tente',
    'Endüstriyel Çözümler',
  ],
  Kurumsal: [
    'Hakkımızda',
    'Kalite Politikamız',
    'Sertifikalar',
    'Kariyer',
    'Basın & Medya',
  ],
  Destek: [
    'Teklif Al',
    'Teknik Destek',
    'Garanti Koşulları',
    'Bakım & Servis',
    'SSS',
  ],
}

const scrollTo = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

export default function Footer() {
  return (
    <footer className="bg-ozzo-950 relative overflow-hidden">

      {/* Top gold line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500/50 to-transparent" />

      {/* CTA band */}
      <div className="border-b border-ozzo-700/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-2xl md:text-3xl font-800 text-white mb-2">
              Projenizi Hayata Geçirelim
            </h3>
            <p className="text-white/40 font-300">
              Ücretsiz keşif ve danışmanlık için bugün bize ulaşın.
            </p>
          </div>
          <div className="flex gap-4 flex-shrink-0">
            <button onClick={() => scrollTo('teklif')} className="btn-primary">
              Teklif Al
            </button>
            <a href="tel:+905358610404" className="btn-outline">
              Ara
            </a>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

          {/* Brand column */}
          <div className="lg:col-span-2">
            <Logo className="w-48 h-auto mb-6" />
            <p className="text-white/40 text-sm leading-relaxed font-300 max-w-xs mb-8">
              8 yıllık deneyimimizle alüminyum sektöründe kalite,
              güven ve inovasyonu bir arada sunuyoruz.
            </p>
            {/* Social links — WhatsApp only */}
            <div className="flex gap-3">
              {[
                { label: 'WhatsApp', href: 'https://wa.me/905358610404', path: 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z' },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-9 h-9 border border-ozzo-500/50 hover:border-gold-500/50 flex items-center justify-center text-white/40 hover:text-gold-500 transition-all duration-200"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="font-display text-sm font-700 text-white tracking-wider uppercase mb-5">
                {heading}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-white/35 text-sm hover:text-gold-400 transition-colors duration-200 font-300 hover:pl-1 inline-block transition-all"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-ozzo-700/40">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-white/25 text-xs font-300">
          <span>© 2025 OZZO Aluminyum. Tüm hakları saklıdır.</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white/60 transition-colors">Gizlilik Politikası</a>
            <a href="#" className="hover:text-white/60 transition-colors">Kullanım Koşulları</a>
            <a href="#" className="hover:text-white/60 transition-colors">KVKK</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
