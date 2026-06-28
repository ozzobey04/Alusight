# OZZO Alüminyum — Yapay Zeka Sistemi Fikri Mülkiyet Koruma Rehberi

> Bu rehber, geliştirilen AI destekli alüminyum analiz sisteminin (Öneri eklentisi dahil) hukuki, teknik ve ticari korumasını kapsar.

---

## 1. Neden Koruma Gerekli?

Bu sistemde özgün şu bileşenler var:
- **Alüminyum sistem analizi AI prompt'u** — yıllar içinde öğrenilmiş teknik bilgiyi içeren özel soru yapısı
- **Hata kütüphanesi entegrasyonu** — Aluminyum_Dograma_Giydirme_Cephe_Master_HataKutuphanesi_Checklist_Risk_Standartlar.docx verilerinden üretilen bilgi tabanı
- **Çoklu medya analiz akışı** — fotoğraf + video kare çıkarma + sıkıştırma + Gemini entegrasyonu
- **PDF rapor formatı** — OZZO markalı, standart referanslı profesyonel rapor şablonu
- **Katalog bilgi tabanı** — 11 marka teknik verisi

---

## 2. Teknik Koruma Adımları

### 2.1 Kod Obfuscation (Derleme Koruması)

Proje build edildiğinde JavaScript otomatik olarak minify edilir. Ek koruma için `vite.config.js` güncelleme:

```js
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,   // console.log temizlenir
        drop_debugger: true,
      },
      mangle: {
        toplevel: true,        // üst düzey değişken adları şifrelenir
      },
      format: {
        comments: false,       // yorumlar kaldırılır
      },
    },
    rollupOptions: {
      output: {
        manualChunks: undefined,   // tek bundle — analiz zorlaşır
      },
    },
  },
})
```

### 2.2 API Key Güvenliği (ÖNEMLİ!)

Mevcut sistemde Gemini API anahtarı tarayıcıda tutulmaktadır. Güvenli hale getirmek için:

**Seçenek A — Basit: Netlify / Vercel Serverless Function**
```js
// api/gemini-proxy.js (Vercel)
export default async function handler(req, res) {
  if (req.headers.origin !== 'https://ozzoaluminyum.com') {
    return res.status(403).json({ error: 'Forbidden' })
  }
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(req.body) }
  )
  const data = await response.json()
  res.json(data)
}
```

**Seçenek B — Kapsamlı: Rate Limiting**
```js
// Kısıtlama: IP başına günde 10 analiz
const rateLimit = new Map()

function checkRateLimit(ip) {
  const key = `${ip}_${new Date().toDateString()}`
  const count = rateLimit.get(key) || 0
  if (count >= 10) throw new Error('Günlük limit aşıldı')
  rateLimit.set(key, count + 1)
}
```

**Google Console'dan Domain Kısıtlama:**
1. console.cloud.google.com → Credentials → API Key
2. "Application restrictions" → HTTP referrers
3. `ozzoaluminyum.com/*` ekle — başka sitelerden çalışmaz

---

## 3. Telif Hakkı ve Lisans

### 3.1 Kaynak Koda Copyright Ekle

Her önemli dosyanın başına:
```js
/**
 * © 2025 OZZO Alüminyum. Tüm hakları saklıdır.
 * Bu yazılım ve içeriği OZZO Alüminyum'un ticari sırrıdır.
 * İzinsiz kopyalanması, dağıtılması veya türev eser oluşturulması yasaktır.
 * Telif Hakkı Kanunu (5846 sayılı FSEK) kapsamında korunmaktadır.
 */
```

### 3.2 LICENSE Dosyası

Açık kaynak olmaması için `PROPRIETARY` lisans:
```
OZZO ALUMINYUM PROPRIETARY LICENSE

Copyright (c) 2025 OZZO Alüminyum

Bu yazılımın tüm hakları OZZO Alüminyum'a aittir.
Herhangi bir kişiye bu yazılımı kopyalama, değiştirme,
birleştirme, yayınlama, dağıtma, alt lisanslama ve/veya
satma hakları verilmemektedir.

İzinsiz kullanım 5846 sayılı Fikir ve Sanat Eserleri Kanunu
ve 6769 sayılı Sınai Mülkiyet Kanunu kapsamında hukuki
işleme tabi olacaktır.
```

---

## 4. Yasal Tescil Yolları

### 4.1 Yazılım Telif Hakkı Tescili (Ücretsiz / Otomatik)

Türkiye'de telif hakkı eser oluşturulduğu anda kazanılır (FSEK md.1/B).
**Kanıt için:**
- Kaynak kodu bir USB'ye kaydedin, noterden tarih şerhi aldırın (~200-500₺)
- Ya da GitHub private repo'ya commit atın — commit tarihi delil sayılır

### 4.2 Marka Tescili (Önerilen)

- Türk Patent ve Marka Kurumu: turkpatent.gov.tr
- "OZZO" + "AI Analiz Sistemi" kombinasyonu marka başvurusu
- Sınıf 42 (Yazılım hizmetleri, teknik analiz)
- Yaklaşık maliyet: 3.000-5.000₺

### 4.3 Patent (İleri Aşama)

Eğer sistemi rakiplerden **tam olarak** korumak istiyorsanız:
- Faydalı model başvurusu (daha hızlı ve ucuz: ~10.000₺)
- "Yapay zeka destekli alüminyum sistem analiz yöntemi" olarak
- Avukat gerektirir — tavsiye: IPR Dealership veya Ankara Patent Büroları

---

## 5. Ticari Sır Koruması

Bu sistem bir **ticari sır** niteliği taşır. Koruma için:

1. **Çalışanlarla gizlilik sözleşmesi (NDA)** imzalayın
2. Sisteme erişimi olan kişileri kayıt altında tutun
3. "Bu sistem OZZO'nun ticari sırrıdır" uyarısı ekleyin (kod başına eklendi)

---

## 6. Deployment Güvenliği

### 6.1 Cloudflare (Ücretsiz Plan)
- DDoS koruması
- Bot engelleme
- Ülke bazlı erişim kısıtlama (Türkiye dışı blok)
- SSL sertifikası

### 6.2 CORS Yapılandırması
```js
// Backend varsa
app.use(cors({
  origin: ['https://ozzoaluminyum.com', 'https://www.ozzoaluminyum.com'],
  methods: ['POST'],
  allowedHeaders: ['Content-Type'],
}))
```

### 6.3 Robots.txt (Botları engelle)
```
User-agent: *
Disallow: /hesaplamalar/
Disallow: /oneri/
Disallow: /api/

User-agent: Googlebot
Disallow: /api/
```

---

## 7. Pratik Tavsiye Sıralaması

| Öncelik | Eylem | Maliyet | Süre |
|---------|-------|---------|------|
| ⭐⭐⭐ | Google Console'dan domain kısıtlama | Ücretsiz | 5 dk |
| ⭐⭐⭐ | Noterde kaynak kodu tarih şerhi | ~300₺ | 1 gün |
| ⭐⭐ | OZZO marka tescili (turkpatent.gov.tr) | ~3.500₺ | 3-6 ay |
| ⭐⭐ | Serverless API proxy kurma | Ücretsiz (Vercel) | 2 saat |
| ⭐ | Patent / Faydalı Model başvurusu | ~10.000₺+ | 1-2 yıl |

---

## 8. Özet

Bu sistem şu an için teknik açıdan kopyalanabilir durumdadır çünkü Gemini API anahtarı tarayıcıda tutulmaktadır. **En kritik adım**: Google Cloud Console'da domain kısıtlaması yapmak (5 dakika, ücretsiz). Ardından noterde tarih şerhi almak yeterlidir.

Rakip firmalar prompt'u göremez (build sırasında obfuscate edilir) ama API key'inizi ele geçirirlerse sistemin Gemini maliyetlerini size bindirirler. Domain kısıtlamasıyla bu risk tamamen ortadan kalkar.

---

*OZZO Alüminyum — AI Destekli Teknik Analiz Sistemi © 2025*
