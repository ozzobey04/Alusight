/* src/data/catalogKnowledge.js
 * Mimari Alüminyum Sistem Üreticileri — AI Analizi için Teknik Bilgi Tabanı
 * Kullanıcıya görünmez; visionAnalysis.js PROMPT'una enjekte edilir.
 */

export const CATALOG_KNOWLEDGE = `
=== ALÜMİNYUM SİSTEM ÜRETİCİLERİ — TEKNİK VERİ TABANI ===

## REYNAERS ALUMINIUM (Belçika kökenli, Türkiye'de yaygın)

### Giydirme Cepheler
- ConceptWall 50: Uf=0.56–0.8 W/m²K, mullion derinlik 41.5–300mm, maks. cam 60mm, AE1200/RE1200/A5-2000Pa, Pasif Ev sertifikalı HI varyant, maks. 700kg cam, açılır kanat+yapısal cam seçenekleri
- ElementFacade 7 (Unitize): Uf=1.3 W/m²K, mullion 169.5–243.5mm, maks. cam 63mm, AE1200/RE1200/2400Pa, prefabrik hızlı montaj, maks. 300kg cam

### Pencereler
- ConceptSystem 77 (Pencere): Uf=1.8→1.1 W/m²K (Std/HI/HI+), kasa 68mm, kanat 77mm, maks. cam 61mm, Sınıf4/E900/C5, maks. kanat 2800mm×170kg
- MasterLine 8: Uf=1.9→1.0 W/m²K (Std/HI/HI+), kasa 77mm, maks. cam 72mm, Sınıf4/E900/C5, maks. kanat 2800mm×200kg, Uw=0.88 W/m²K pasif ev
- SlimLine 38 (ince profil): Uf=1.9 W/m²K, çerçeve 99mm (Classic)/76mm (Cubic/Ferro), maks. cam 65mm, Sınıf4/9A/C4, Uw=0.96 W/m²K, çelik görünümlü

### Kapılar
- ConceptSystem 77 (Kapı): Uf=1.8 W/m²K / Ud=1.4 W/m²K, kasa 68mm, maks. cam 61mm, Sınıf4/7A/C2, maks. kanat 3000mm×250kg, RC2 kurşun geçirmez+yangın varyant

### Sürme/Katlama Sistemler
- ConceptFolding 77: Uf=2.25 W/m²K, 77mm, maks. cam 63mm, Sınıf4/9A/C3, 2–8 kanat, maks. 3000×1200mm/120kg
- ConceptPatio 130 (Kaldır-Kaydır): Uf=1.9 W/m²K, çerçeve 130mm, maks. cam 45mm, Sınıf4/8A/C3, maks. 300kg, monorail+duorail+3ray
- HiFinity (Premium Sürme): Uf=1.4 W/m²K, çerçeve 148mm (2-rail), kanat 44mm, maks. cam 54mm, Sınıf4/E750/C5, maks. 4000mm×750kg, Uw=0.8 W/m²K, cam köşe+sıfır eşik+motor
- MasterPatio (Yüksek Perf.): Uf=1.4 W/m²K, çerçeve 180mm (2-rail), kanat 77mm, maks. cam 62mm, Sınıf4/E1200/C5, maks. 3600mm×600kg, Uw=0.82 W/m²K, RC2
- SlimPatio 68 (İnce Sürme): Uf=2.5 W/m²K, çerçeve 64mm (monorail), kanat 38mm, maks. cam 38mm, Sınıf4/7A/C3, maks. 3000×2300mm/250kg

Doğru silikon: Nötr kürlü, alüminyum yapışkanı içerikli; primer A300 önerilir
Conta sistemi: EPDM triple conta, iç yüzey basınç dengeleme
Weep hole mesafesi: 200mm'de bir, min 6×40mm açıklık

## SCHÜCO (Almanya kökenli, premium segment)
Sistemler: AWS 75, AWS 90, ASS 70, FW 60+, USC 65
- AWS 75: Uf=1.7 W/m²K, 75mm sistem derinliği, pasif ev uyumlu versiyonu (BS)
- AWS 90.SI+: Uf=0.88 W/m²K, Passivhaus sertifikalı, 4 conta hattı
- ASS 70: Sürme, adiabatik ısı kesici köpük, Uf=2.4 W/m²K
- FW 60+: Giydirme cephe, Uf=1.5 W/m²K, yüksek hava sızdırmazlık
Termal bariyer: Poliamid 6.6 + cam fiber takviyeli, min 24mm genişlik
Kaynak yerine önerilen ek yöntemi: özel köşe konektörler + silikon

## ASAS ALÜMİNYUM / RESCARA (Türkiye)

### Pencere/Kapı Sistemleri (Isılı)
- RWT55: Uf=3.45–3.50 W/m²K, kasa 55mm, ısı bariyeri 14.8mm, maks. cam 36mm, Sınıf4/9A/C4, içe+dışa açılır/VS/vasistas/katlanır/pivot/PVC kanat
- RWT55+ (Vida Kanallı): Uf=3.54–3.62 W/m²K, kasa 55mm, 14.8mm bariyer, maks. cam 36mm, çift eksen/katlanır/pivot
- RWT55F (Katlanır): kasa 55mm, 14.8mm bariyer, RWT55 tabanlı katlanır kapı/pencere
- RWT56 (Modern Kesit): Uf=3.37–3.39 W/m²K, kasa 55.8–64.8mm, 14.8mm bariyer, maks. cam 29–39mm, oval veya düz kanallar, aynı yüz eşik
- RWT64: Uf=2.65–2.95 W/m²K, kasa 64.2mm/kanat 74.2mm, 24mm bariyer, maks. cam 44mm, tüm EN sınıfları, gizli kanat seçeneği
- RWT64F (Katlanır): kasa 64.2mm, 24mm bariyer, RWT64 tabanlı katlanır
- RWTP64 (Yüksek Statik): kasa 64.2mm, 24mm+Styrofoam bariyer, maks. cam 44mm, yüksek rüzgar direnci için güçlü orta kayıt
- RWT67 (Gizli Kanat): Uf=2.77–3.02 W/m²K, kasa 67.1mm, 24mm bariyer, maks. cam 24mm, Rw=35.5dB, EN 12207 Sınıf1–4/EN 12208 E1500/EN 12210 E
- RWT75 (Yüksek Yalıtım): Uf=1.35–1.82 W/m²K, kasa 75mm, 34mm+dolgu bariyer, maks. cam 48–58mm, Rw=42dB, Uw=0.74 W/m²K (Ug=0.5), ahşap görünüm kaplama
- RWT75F (Flag Bariyer): Uf=1.64–1.83 W/m²K, 34/40/48mm flag bariyer, maks. cam 48–58mm, Uw=0.74–1.16 W/m²K, EN 12207 Sınıf4/9A/E
- RWT95 (Pasif Ev): Uf=1.08–1.25 W/m²K, kasa 95mm, 54mm bariyer, maks. cam 85mm, Uw≤0.8 W/m²K, PHI Pasif Ev sertifikalı
- ASWM24 (Dışa Açılır+Sinek Teli): kasa 82mm, 24mm bariyer, maks. cam 24–42mm, entegre sinek teli modülü
- ASW34: kasa 82–105mm, 34mm bariyer, maks. cam 42mm
- REFD77 (Isılı Katlanır): ~77mm, ısılı, PAS 24 güvenlik sertifikalı, maks. 7 kanat/120kg/3.5m yükseklik, standart+gömme+alçak eşik

### Pencere/Kapı Sistemleri (Isısız)
- RW46 (Yuvarlak Köşe): kasa 46mm, ısısız, maks. cam 22mm, içe+dışa/vasistas/VS, adaptör profili
- RW55 (Düz Köşe): kasa 55mm, ısısız
- RW55+: kasa 55mm, ısısız, gelişmiş versiyon
- RW56: ~56mm, ısısız
- RW60: ~60mm, ısısız

### Sürme Sistemleri
- RST83 (Standart Sürme): Uf=4.09–5.89 W/m²K, çerçeve 83.4–120.6mm/kanat 34.2–72.8mm, ısısız, cam 8–24mm, max 960Pa rüzgar, 3-ray seçeneği, ahşap görünüm
- RST102 Plus (Kaldır-Kaydır): Uf=3.48–4.00 W/m²K, çerçeve 109.5–216.3mm/kanat 40.7–80.7mm, 20–24mm bariyer, maks. cam 28mm, max 1320Pa, mono+çift+3-ray
- RST116 (Büyük Format): Uf=4.001 W/m²K, çerçeve 116.4–180.8mm, 14.8mm bariyer, maks. cam 33mm, 30dB ses yalıtımı, ahşap görünüm
- RESF32 Skyfeel (Minimal Gizli Ray): ısılı, çerçeve 104–155mm, maks. cam 32mm, maks. 600kg kanat, zemine gömülü ray, modern mimari

### Cephe Sistemleri
- R50 (Çubuk Cephe): Uf=2.76–4.54 W/m²K, görünür yüz 50mm/mullion 80–290mm, 14.8mm bariyer, maks. cam 42–52mm, EN12152 A4/EN12154 R7, kapçıklı+yapısal silikon+yarı-yapısal+gizli açılır kanat, çelik takviyeli
- REWG50 (Kış Bahçesi): Uf=1.84–7.78 W/m²K, 24–34mm bariyer, maks. cam 40mm, maks. 45° çatı eğimi, RWT+RST+R50 ile uyumlu

### Ofis/İç Mekan Sistemleri
- RD55 (Ofis Kapısı): duvar kalınlığı 85–230mm, ısısız, ahşap+cam kapı kanat seçeneği
- RO26 (Tek Cam Bölme): 26mm çerçeve, cam 8.76–10.76mm, ofis bölme

### Renk/Kaplama Seçenekleri (tüm sistemler)
- Elektrostatik toz boya: tüm RAL renkleri (RAL 9016 beyaz, RAL 7016 antrasit, özel RAL)
- Eloksal: doğal gümüş, şampanya, bronz, siyah (standart anodik sınıflar)
- Ahşap görünüm kaplama: RST83, RST116, RWT75, RWT75F (onaylı)
- PVDF/özel kaplama: cephe sistemleri için talep üzerine
- QUALICOAT sertifikalı boya uygulaması

## CORTIZO (İspanya, Türkiye'de artan kullanım)
Sistemler: COR 60, COR 70, 4400 Corredera
- COR 70: Uf=1.45 W/m²K, 70mm, Avrupa fincan testi EN 12208 Sınıf E900
- Özellik: alüminyum levha-profil bağlantısı için özel köpük bant EPDM 3mm
- Giydirme cephe: sistem 8000, EN 13830 belgeli

## ALUTECH (Polonya kökenli)
Sistemler: W72, W62, ALT 110, ALT 65
- W72: Uf=1.3 W/m²K, üçlü cam adaptasyonu, gıa 20mm
- Sürme ALT 65: alt ray drenaj kritik, weep hole 4 adet/kanat minimum

## KURTOĞLU ALÜMİNYUM (Türkiye)
Sistemler: KAS 46, KAS 60, KAS 70 TB, Sürme 70
- KAS 70 TB: Uf=1.9 W/m²K, thermal break poliamid 24mm, Türk iklim koşullarına özel
- Boya: QUALICOAT Sınıf 1+, deniz kıyısı için Sınıf 3 önerilir
- Silikon önerisi: Dow Corning 795 veya Sika 715 NT

## ASİSTAL ALÜMİNYUM (Türkiye)
Sistemler: AS-50, AS-60 TB, AS-75 TB, Giydirme Cephe
- AS-75 TB: Uf=1.55 W/m²K, 75mm, A sınıfı enerji
- Yalıtım bandı: isoflex 15mm veya Compacfoam 25mm önerilir
- Drenaj: alt çerçevede iki weep hole zorunlu

## ZAHİT ALÜMİNYUM (Türkiye, Güneydoğu Anadolu)
Sistemler: ZAH-50, ZAH-65 TB, ZAH-80 TB
- ZAH-65 TB: Türkiye iklim koşulları için optimize, kum+toz fırtına testi

## SARAY ALÜMİNYUM (Türkiye)
Sistemler: 50 Serisi, 60 Serisi TB, 70 Serisi TB
- 70 Serisi TB: Uf=1.75 W/m²K, 70mm, konut+ticari

## KLEİDCO (Türkiye)
Sistemler: K-52, K-62, K-72 TB
- K-72 TB: Uf=1.65 W/m²K, yalıtımlı sürme dahil

## ÇUHADAROĞLU ALÜMİNYUM / İNTERAL (Türkiye, 100+ yıllık)
Marka: "interal" ürün serisi — Çuhdaroğlu'nun tasarım ve üretim markası

### SÜRME SİSTEMLERİ (interal Sliding Systems)
**S 36 T — Yalıtımlı Sürme**
- Sistem derinliği: 60 / 71 mm (kasa)
- Cam kalınlığı: 24 / 26 / 28 mm (çift cam)
- Kanat taşıma kapasitesi: 40 / 80 / 100 / 120 kg
- Hava geçirgenliği: Sınıf 4 (600 Pa) — EN 1026 / EN 12207
- Su geçirimsizliği: Sınıf 8A (450 Pa) — EN 1027 / EN 12208
- Isı geçirim katsayısı: S 36 T yalıtım bariyeri mevcut (Uf değeri kuruluma göre değişir)
- S 36 KS ile uyumlu; aksesuar değişimiyle kaldır-sür sisteme dönüştürülebilir
- Açılım tipleri: çoklu açılım seçeneği, farklı cam boyutlarına uyumlu

**S 36 KS — Kaldır-Sür (Lift & Slide) Yalıtımlı**
- Isı yalıtım bariyeri: 14.8 mm veya 24 mm polyamid
- Kanat taşıma kapasitesi: 60-120 kg
- Isı geçirim katsayısı: Uw ≥ 1.83 W/m²K (Ug ≥ 1.4 W/m²K) — ISO 10077-2
- Su geçirimsizliği: Sınıf 9A (600 Pa) — EN 1027 / EN 12208
- Hava geçirgenliği: Sınıf 4 (600 Pa) — EN 1026
- Özel kayıt bağlantısı, özel tij mekanizmalı araba takımı
- S 36 T ile tamamen uyumlu (aynı kanat profilleri)
- Yeni nesil Bodrum kaldır-sür kol tasarımı

**SL 45 HS — Yüksek Performanslı Kaldır-Sür**
- Su sızdırmazlık: 136 km/h rüzgar hızında dahi su girişi engelleniyor
- Kanat taşıma kapasitesi: 200 kg/kanat
- Maksimum kanat boyutu: genişlik 2 m, yükseklik 2.7 m
- Paslanmaz ray seçeneği (konvansiyonel sistemden daha sessiz çalışma)
- Yüksek ısı yalıtım değerleri
- EN 1027 / EN 12208 belgeli

### KAPI VE PENCERE SİSTEMLERİ (interal Door & Window Systems)
**DS 50 KT — Katlanır Sistem (Bi-fold)**
- Su geçirimsizliği: 600 Pa (Sınıf 9A) — EN 1027 / EN 12208
- Hava geçirgenliği: Sınıf 4 (±600 Pa) — EN 1026 / EN 12207
- Isı geçirim katsayısı: Uf min 3.33 W/m²K / Uf maks 3.54 W/m²K — EN 10077-2
- Rüzgar direnci: Sınıf C1 (400 Pa) — EN 12210
- Kanat ağırlık kapasitesi: teknik veriye göre değişir
- Geniş açılım seçenekleri, kolay ve sessiz çalışma mekanizması
- Alçak eşik detayları mevcut

**DS 50 Havalandırma Kanadı**
- Kanat genişliği seçenekleri: 155 mm ve 180 mm
- Avrupa güvenlik sınırları içinde kalan açıklıklarda uygun
- Gizli menteşe uygulaması — minimum görünür genişlik
- Hava geçirgenliği: Sınıf 4 — EN 12152
- Isı geçirim katsayısı: Uf = 3.4 W/m²K — EN 10077-2
- MN 50 giydirme cephe ve DS sistemi ile entegre çalışır
- Manuel veya motorlu açılım seçeneği

**DS 70 — Yeni Nesil Kapı ve Pencere Sistemi**
- Isı yalıtım bariyeri: 34 mm cam elyaf takviyeli polyamid (glass fiber reinforced)
- Su sızdırmazlık performansı: 1200 Pa (çok yüksek)
- Profil derinliği: 70 mm
- Adaptör profili kullanılmayan çift kanat açılır uygulama
- Açılım tipleri: gizli kanat, balkon kapısı, alçak eşik balkon kapısı
- Yeni nesil Bodrum kol ailesi
- Özel pervaz ailesi ile pervazlı ve standart kasa seçenekleri
- Fiyat-performans oranı yüksek yeni nesil sistem

### GİYDİRME CEPHE SİSTEMLERİ (interal Curtain Wall / Façade)
**MN 50 — Giydirme Cephe Çubuk Sistem (Stick System)**
- Patentli mikro kondens (EPO patentli): su girişine hiçbir koşulda izin vermiyor
- Isı geçirim katsayısı: Uw = 1.53 W/m²K / Ug = 1.1 W/m²K — EN 10077-2
- Cam kalınlığı: 50 mm'ye kadar camlama imkanı
- Rüzgar direnci: 2400 Pa — EN 13116
- Hava geçirgenliği ve su geçirimsizliği: EN 12152 / EN 12154 belgeli
- Farklı derinliklerde griyaj çubuk uygulama
- Farklı geometride kapak seçenekleri ile görsel zenginlik

**MN 50 SC — Yapısal Silikon Cephe (Structural Silicone)**
- Isı geçirim katsayısı: Uw = 1.46 W/m²K / Ug = 1.1 W/m²K — ISO 10077-2
- Su geçirimsizliği: 1200 Pa — EN 13116
- Çift komponentli yapısal silikon bağlantı
- Standart kaset silikon sistemlere göre %30-40 daha az alüminyum tüketimi
- Özel kanala sahip ısı cam ara çıta plastiği
- Dışa açılır gizli kanat (havalandırma için)
- Hızlı ve verimli cam modül montajı
- Bağlantı elemanları cam içindeki yuvaya dışarıdan kenetleniyor

**MN 50 ICV — İçe Açılır Gizli Kanat Silikonlu Cephe**
- Isı geçirim katsayısı: Uf = 2.76 W/m²K — ISO 10077-2
- Uw = 1.61 W/m²K (sistem)
- Hava geçirgenliği: Sınıf 4 — EN 12152
- EPO patentli mikro kondens kanalı
- Neredeyse hiç fark edilmeyen içe açılır gizli kanat
- MN 50 ICV kapaklı sisteme herhangi bir bileşen değişimi olmadan dönüşüm

**MN 50 ASC — Özel Montaj Cephe Sistemi**
- Isı geçirim katsayısı: Uw = 1.57 W/m²K
- 50 mm'ye kadar camlama imkanı
- Gövde genişliği: 17 mm (ince profil görünümü)
- Patentli ısı cam üretim tekniği: yüksek ısı yalıtımı + sıfır kondenzasyon riski
- MN 50 sistemin tüm üstünlükleri (mikro kondens, performans)
- Özel montaj seçenekleri

### ÇUHADAROĞLU / İNTERAL — GENEL TEKNİK NOTLAR
- Markanın tüm sürme sistemleri EN 1026/1027/12207/12208 belgeli
- Cephe sistemleri EN 13830 ve EN 13116 belgeli
- Tüm ısı bariyerleri: cam elyaf takviyeli polyamid (PA66-GF25)
- EPDM conta: triple conta hattı, uzun ömürlü
- Paslanmaz ray seçeneği sürme sistemlerde mevcut
- Silikon: çift komponentli yapısal silikon (yapısal cephe uygulamalarında)
- Drenaj: patentli mikro kondens kanalı (MN serisi), sıfır su girişi garantisi
- Kaplama: QUALICOAT veya QUALANOD belgeli anodizasyon/toz boya
- Türkiye'de 100+ yıllık deneyim, yerel iklim koşullarına optimizasyon

### İNTERWALL (Çuhdaroğlu Panel / Sandviç Panel Sistemleri)
- Alüminyum giydirme cephe ve panel sistemleri
- Sandviç panel, alüminyum kompozit panel uygulamaları
- Cephe doğrama entegrasyonu: MN serisi ile uyumlu
- Isı ve ses yalıtımlı panel çözümleri
- Endüstriyel ve ticari yapılar için

=== KRİTİK MONTAJ STANDARTLARI ===
• Kenar boşluğu: Çerçeve-duvar arası min 10mm, max 20mm (TS EN ISO 10077)
• Silikon derinlik:yüzey bağlantısında min 6mm, fugarda min 8mm (ASTM C1193)
• EPDM conta değiştirme periyodu: 10-15 yıl veya basınç kaybında
• Ankraj aralığı: köşeden 150-200mm, ara destekler max 700mm (EN 1090)
• Cam setting block: min 2 adet/kanat, Shore A 80-90, min 100mm uzunluk (EN 12488)
• Weep hole: her 600mm'de bir, min 5×30mm açıklık (EN 1027)
• Termal bariyer süreklilik: köşe bağlantılarında da poliamid kesintisiz olmalı
• Dış silikon tipi: nötr kürlü, EPDM ile uyumlu, alüminyuma adhezyonlu (ISO 11600 F/25LM)
• İç mastik: akrilik esaslı veya PU köpük, sıva öncesi uygulanmalı
• Isı yalıtım bandı: çerçeve-duvar temas yüzeyine 10-15mm Compacfoam veya Isoflex

=== YOĞUŞMA VE SICAKLIK KRİTERLERİ ===
• fRsi ≥ 0.70 → yoğuşma riski yok (EN ISO 13788)
• fRsi 0.60-0.70 → risk bölgesi, düşük iç nem gerekli
• fRsi < 0.60 → yoğuşma kaçınılmaz, sistem değişimi gerekli
• Çiğ noktası: İç hava 20°C, %50 bağıl nem → 9.3°C (min yüzey sıcaklığı > 9.3°C olmalı)
• Türkiye iklim bölgeleri: 1.bölge (Ege/Akdeniz) Uw≤2.0, 4.bölge (Doğu Anadolu) Uw≤0.8

=== SES YALITIMI ===
• Alüminyum tek cam 4mm: Rw=28dB
• Alüminyum + çift cam 4/12/4: Rw=32dB
• Alüminyum + lamine çift cam 44.2/16/44.2: Rw=42dB
• İstanbul-Ankara şehir merkezi için Rw≥38dB önerilir (TS EN ISO 10140)

=== SU YALITIMI ===
• Tüm alüminyum-duvar derzleri: EPDM bant + kauçuk esaslı flashing minimum
• Sill (alt eşik) drenaj: 2° eğim, weep hole, baffle (yağmur perdesi) sistemi
• Hava kesici bariyer: iç tarafta, buhar kontrolü için sürekli membran
• Kompressör bantları: açık genleşmeli, kendinden yapışkanlı, su geçirmez

## ÇUHADAROĞLU (interal) ALÜMİNYUM (Türkiye kökenli, geniş sistem yelpazesi)

### Pencere/Kapı Sistemleri
- ST 50: Isı kesicisiz, hava Sınıf4/E750/C1, ekonomik konut sistemi
- ST 60: Uf≥3.1 W/m²K, kasa 60mm, maks. cam 44mm, hava Sınıf4/E750/C1-B2, ısı kayıplarını %40 azaltır
- ST 60 CV (Gizli Kanat): Uf≥3.5 W/m²K, Uw≥2.1 W/m²K, 72mm, maks. cam 24mm, Sınıf4/E900/A3
- ST 70: Uf≤2.1 W/m²K, kasa 70mm/kanat 76mm, maks. cam 47mm, Sınıf4/9A/C1-B1, ±2400Pa ASTM uyumlu, amiral gemisi sistem
- ST 70 CV (Gizli Kanat): Uf≤2.0 W/m²K, 72mm kasa, maks. cam 34mm, Sınıf4/9A/C1, ST 70 aksesuarlarıyla uyumlu
- ST 80 (Yüksek Yalıtım): Uf≤1.7 W/m²K, 80mm kasa, maks. cam 56mm, Sınıf4/9A/C1-B1, ısı kayıplarını %68 azaltır, pasif ev uyumlu
- DS 50 KT (Katlanır Kapı): Uf=3.33–3.54 W/m²K, 50mm, ısı kesicisiz, Sınıf4/9A/C1, maks. yükseklik 2.7m, balkon/teras
- DS 50 VF (Havalandırma Kanadı): Uf=3.4 W/m²K, 63mm kasa/60mm kanat, Sınıf4/9A/C5, cephe içine gizli kanat
- DS 70 (Yüksek Perf. Kapı): Uf≤2.46 W/m²K, 70mm kasa/80mm kanat, 34mm poliamid bariyer, Sınıf4/E1200/C3, sahil/açık uygulamalara uygun
- DS 75 KT (Isıtıcılı Katlanır): maks. cam 56mm, kasa 90mm/kanat 75mm, Sınıf4/600Pa, maks. 3.5m yükseklik, otel/lüks konut

### Sürme Sistemleri
- S 36 T/H (Temel Sürme): Uw=1.83 W/m²K, 60-71mm, maks. cam 28mm, Sınıf4/8A/C2, 40-120kg kanat, ekonomik
- SL 45 (Kaldır-Kaydır): Uw=2.31 W/m²K, çerçeve 106mm/kanat 45mm, maks. cam 32mm, Sınıf4/E900/B2, maks. 2.0×2.7m/200kg
- SL 45 HS (Yüksek Performans): Uw=2.09 W/m²K, çerçeve 106mm/kanat 45mm, Sınıf4/E900/A5, 136km/s rüzgara dayanıklı su sızdırmazlığı, 200kg
- S 50 (Büyük Format): Uw≤2.58 W/m²K, çerçeve 120mm/kanat 50mm, maks. cam 34mm, Sınıf4/E1200/B2, maks. 3.0×3.3m/400kg
- S 50 CV1 (Dışa Gizli Kanat): Uw≤2.58 W/m²K, 120mm/50mm, Sınıf4/E1200/B2, dışarıdan görünmez kanat, 200-400kg
- S 50 CV2 (Tam Gizli Kanat): Uw≤2.58 W/m²K, Sınıf4/E1200/B2, her iki yönden görünmez kanat, maks. 3.0×3.3m
- S 90 (Paralel Sürme): Uf=4.59 W/m²K, Sınıf4/9A/Sehim<L/200, paralel kaydırma mekanizması

### Giydirme Cephe Sistemleri
- MN 50 (Çubuk Cephe): Uw=1.53 W/m²K, 50mm görünür genişlik, maks. cam 50mm, 4A/RE1950/2400Pa-3C, patentli mikro yoğuşma kanalı, 18 farklı cam çıtası
- MN 50 SC (Yapısal Silikon): Uw=1.46 W/m²K, 50mm, Sınıf4/R7/1200Pa, %30-40 daha az alüminyum
- MN 50 ICV-S (Gizli Havalandırma Kanadı): Uf=2.76 W/m²K/Uw=1.61, 87mm, Sınıf4/RE750/2000Pa, cepheye entegre görünmez kanat
- MN 50 ASC (Yarı-Yapısal): Uw=1.57 W/m²K, 88mm, Sınıf4/R7/1200Pa, en ince kapak 17mm
- MN 50 HI (Yüksek Yalıtım): Uw=1.4 W/m²K, 50mm, 4A/RE1950/1600Pa, soğuk iklim/pasif cephe
- MN 50 L (Çelik Ön Yüz): Uw=1.6 W/m²K, 50mm, 4A/RE1950/1600Pa, yapısal güçlendirmeli
- MN 60: Uw=1.6-1.8 W/m²K, 60mm, Sınıf4/RE900/1200Pa, geniş açıklıklar için büyük kesit
- MN 60 SC (Yapısal Silikon): Uw=1.42 W/m²K, 60mm, 4A/R7/1200Pa
- MN 86: Uw=2.2 W/m²K, 86mm, 3A/E750/3C, geniş strüktürel açıklıklar
- KE 50 (Kapçıklı Cephe): Uw=1.64 W/m²K, toplam 142mm, 4A/R7/C4-1200Pa, düz/açılı/badem kapçık seçenekleri
- YE 50 (Yarı-Kapçıklı): Uw=1.62 W/m²K, yatay kapçık+dikey silikon, 4A/R7/C4-1200Pa
- CE 50 (Yapısal Silikon, Isısız): Uf=4.41/Uw=1.93 W/m²K, 84mm, ısı kesicisiz, 4A/RE900/C4-1200Pa
- IZO KE 50 (Isılı Kapçıklı): Uw=1.36 W/m²K, 50mm, 4A/R7/1200Pa, en iyi termal kapçıklı cephe
- UCW 72 CC (Ünite Cephe-Kapçıklı): 72mm, ünite sistem fabrika üretim, hızlı montaj
- UCW 72 DB (Ünite Cephe-Yapısal Silikon): 72mm, direkt yapıştırma, en hızlı ünite montaj
- SKY 50/60/70 (Çatı Aydınlığı): 50/60/70mm profil, eğimli çatı cam sistemleri, yoğuşma drenaj kanalı, çelik taşıyıcıya oturur

### Interwall — Ofis Bölme Sistemleri
- VITRUM (Tek Cam): sadece üst+alt profil, cam-cama bağlantı, maksimum şeffaflık, 5+5mm lamine cam
- VITRUM DUO (Çift Cam): çift cam ses yalıtımı, cam-cama bağlantı, kapı kasasına kapı kapatıcı entegrasyonu
- ALVEO: çift cam kasalı bölme, ahşap veya cam kapı seçeneği, modüler kasalar

Termal bariyer: Cam fiber takviyeli poliamid (ST/DS serisi), 14.8mm (S 50), 34mm (DS 70)
Boya standartı: QUALICOAT; deniz kıyısı için Sınıf 3 önerilir
ASTM uyumlu export varyantları mevcuttur

## AKPA ALÜMİNYUM (Türkiye, Sakarya — 1986'dan beri, EN AW-6063 T6 alaşım, 70.000 ton/yıl kapasite)

### Sürme Sistemler (Isısız)
- ALDOKS Serisi: klasik sürme sistem, standart konut ve ticari uygulamalar
- TS29 TUBA Sürme (67mm): 67mm profil derinliği, ekonomik sürme, balkon/veranda
- TS45 TUBA Sürme (100mm): 100mm derinlik, daha geniş cam açıklığı
- S28 Sürme: 28mm kanat derinliği, hafif yük, iç bölme ve balkon
- S32 HL Sürme (High Level): yüksek performanslı, gelişmiş ray sistemi
- CS34 Sürme: kompakt sürme
- S35 Novoline Sürme: 35mm modern tasarım, çok kanatlı seçenek
- S35 Thermo Novoline Sürme: ısılı versiyon, termal bariyer eklenmiş

### Sürme Sistemler (Isılı — Thermo)
- CS35 Thermo Sürme: ısılı kompakt sürme
- S38 Thermo Sürme: 38mm ısılı sürme, enerji verimli
- HS38 Thermo Sürme: yüksek performanslı ısılı sürme
- HS55 Thermo Sürme: 55mm kasa derinliği, ısılı, büyük format, yüksek yük taşıma
- SK50 Eco Serisi: 50mm ekonomik yüksek yalıtım

### Pencere/Kapı Sistemleri (Isılı — Thermo/Doğrama)
- WD64 Thermo: 64mm kasa, ısılı pencere/kapı
- HVT67 Thermo: 67mm, ısılı, yüksek havalandırma
- HVT77 Thermo: 77mm, yüksek yalıtım
- WD70 Thermo: 70mm kasa, ısılı pencere/kapı
- SAPPHIRE 75 (SP75) Thermo: 75mm, premium ısılı sistem, pasif ev uyumlu
- PD75 Thermo: 75mm pivot/döner kapı, ısılı

### Cephe Sistemleri
- FS35 Harmony Cephe: 35mm görünür yüz, hafif-orta ağırlık cephe
- FS50 Cephe: 50mm çubuk cephe, standart ticari giydirme
- FS50 Eco Cephe: ekonomik versiyon, 60/80/100/120/150mm mullion seçenekleri
- FS65 Çelik Takviyeli Cephe: 65mm, yüksek statik yük için çelik profil takviyeli
- FS70 Cephe: 70mm, geniş açıklıklar
- SK65 Işıklık (Skylight): 65mm, eğimli çatı cam sistemi, yoğuşma drenajlı

### Cam Balkon Sistemleri
- SCB100 Sürme Cam Balkon: 101mm üst ray, çerçevesiz cam görünüm, teraslar
- ICB40 Isıcamlı Cam Balkon: 40mm ısılı balkon glazing sistemi

### Kış Bahçesi / Özel Sistemler
- WG70 Thermo Kış Bahçesi: 70mm, ısılı, tüm Thermo pencere/kapı sistemleriyle uyumlu
- CL35 Artline: 35mm dekoratif lambri/cephe kaplama sistemi

### Renk/Kaplama Seçenekleri
- Toz boya: tüm RAL renkleri (QUALICOAT sertifikalı)
- Eloksal: doğal, şampanya, bronz, siyah
- Ahşap desen transfer baskı: meşe, ceviz, venge, beyaz meşe
- Özel PVDF kaplama: cephe sistemleri için

### Teknik Özellikler (Genel)
- Alaşım: EN AW-6063 T6 (AlMgSi0.5)
- Özgül ağırlık: 2.71 gr/cm³
- Profil et kalınlığı: 1.1–2.5mm (sisteme göre)
- Maks. profil boyutu: 380×380mm (içi boş), 350×100mm (dolu)
- Termal bariyer malzemesi: cam fiber takviyeli poliamid 6.6
- Üretim kapasitesi: 70.000 ton/yıl, 8 ekstrüzyon hattı, 6–10 inç billet

## KURTOĞLU ALÜMİNYUM (Türkiye)

### Pencere/Kapı Sistemleri
- 54T: Uf=2.86 W/m²K, kasa 54mm, 18mm PA bariyer, maks. cam 24mm, EPDM conta
- 59T: Uf=3.39 W/m²K, kasa 59mm/kanat 65mm, 18mm PA bariyer, maks. cam 26mm
- 60T: Uf=2.67 W/m²K, kasa 60mm/kanat 65mm, 24mm PA bariyer, maks. cam 30mm
- 64T: Uf=2.7 W/m²K, kasa 64mm/kanat 72mm, 24mm PA bariyer, maks. cam 34mm
- 70T: Uf=2.48 W/m²K, kasa 70mm/kanat 79.5mm, 28mm PA bariyer, maks. cam 54mm, Sınıf4/E1200/C4-B4
- 70TH: Uf=2.25 W/m²K, kasa 70mm, 28mm PA bariyer, maks. cam 54mm, Sınıf4/E1200/C4-B4
- 84T: Uf=1.90 W/m²K, kasa 84mm/kanat 93.5mm, 42mm PA bariyer, maks. cam 68mm, Sınıf4/E1200/C4-B4, yüksek yalıtım
- 77BF: Uf=2.947 W/m²K, kasa 77mm, 24–32mm PA bariyer, maks. cam 50mm, ticari kapı
- 40C/47C: ısısız, maks. cam 22mm, ekonomik konut

### Cephe Sistemleri
- 50F: Uf=1.89–7.10 W/m²K, görünür yüz 50mm, mullion 50–200mm, maks. cam 50mm, çelik takviye seçeneği
- Kapaklı Cephe: Uf=6.8 W/m²K, maks. 100m bina yüksekliği

## SİSTEMAL ALÜMİNYUM (Türkiye)

### Pencere/Kapı Sistemleri
- W45 Isısız: 45mm, termal bariyer yok
- W45 Isılı: 45mm, 14.8mm PA bariyer
- W55 Isısız: 55mm, 1.6–2.0mm et kalınlığı
- W55 Isılı: 55mm, 14.8mm PA bariyer
- W65 Isılı: 65mm, 24mm PA bariyer
- W75 Isılı: 75mm, 34mm PA bariyer, yüksek yalıtım
- WH85 Ultra: Uf=1.4 W/m²K (kanat camsız), su 1800Pa, premium kapı
- BF85 Katlanır: maks. yükseklik 3.2m, 1+0–7+7 kanat seçeneği
- C60: kasa 60mm, ısısız, vitrin/dükkan cephesi

### Sürme Sistemleri
- S65 Isılı Lift&Slide: maks. 400kg kanat, maks. 3.3m yükseklik
- S80 Teona: maks. 250kg, maks. 2500mm yükseklik

### Cephe Sistemleri
- F50 Classic: Uf=2.33–5.14 W/m²K, görünür 50mm, kolon 35–195mm, maks. cam 40mm, kapaklı+silikon+yapısal çözümler
- F50 Energy HI: Uf=1.7–2.9 W/m²K, maks. cam 44mm, yüksek enerji verimli

### Ofis Bölme
- OB4-45: 45mm, cam 10–12mm, modül maks. 1000×3000mm
- OB3-83: 83mm veya 105mm, cam/MDF/yonga levha

## CORTIZO (İspanya — Türkiye'de distribütörler aracılığıyla)

### Pencere Sistemleri
- A 84 Passivhaus HI: Uf=0.76 W/m²K, 84mm, maks. cam 56mm, 45mm PA+köpük bariyer, Sınıf4/E1500/C5, Rw=46dB, **PHI Pasif Ev sertifikalı**
- A 84 Passivhaus 1.0: Uf=1.01 W/m²K, 84mm, maks. cam 54mm, Sınıf4/E1500/C5, **PHI sertifikalı ılık-ılıman**
- A 84 Hidden Sash Passivhaus: Uf=1.05 W/m²K, 84mm, maks. cam 46.5mm, görünür kesit 90mm, Sınıf4/E2250/C5, **PHI sertifikalı**
- A 84 Hinged: Uf=1.16 W/m²K, 84mm, Rw=46dB
- A 78 Hinged PH: Uf≈1.00 W/m²K, 78mm, maks. cam 48mm, Sınıf4/E1800/C5, **PHI sertifikalı**
- COR 80 Industrial: Uf=1.1 W/m²K, 80mm, maks. cam 73mm, 45mm tübüler PA, Sınıf4/E1950/C5, RC2
- COR 80 Industrial Passivhaus: Uf=0.94 W/m²K, **PHI sertifikalı**
- COR 70 Industrial: Uf=1.3 W/m²K, 70mm, maks. cam 63mm, 32–35mm PA, Sınıf4/E1800/C5, RC2
- COR 60: Uf=2.8 W/m²K, 60mm, maks. cam 46mm, 24mm PA, Sınıf4/E1350/C5, Rw=48dB
- Alu-Steel: Uf=1.5 W/m²K, 75–100mm, 32–39mm PA, çelik görünümlü

### Sürme Sistemleri
- COR Vision Plus: derinlik 180mm, Uf≈3.2 W/m²K, maks. cam 54mm, 45+38mm PA, Sınıf4/E900/C5, maks. 700kg motorlu
- COR Vision Evolution: derinlik 160mm, Uf=3.2 W/m²K, maks. cam 44mm, maks. 500kg, Rw=43dB
- 4600 Lift&Slide HI: Uf=1.8 W/m²K, 160mm, maks. cam 55mm, 35+24mm PA, Sınıf4/9A/C5, maks. 400kg
- 4900 HI Sliding: Uf=2.7 W/m²K, 60–89mm, maks. cam 36mm, 34mm PA

### Cephe Sistemleri
- TP 62: 62mm görünür, maks. cam 64mm, Ucw≥0.6 W/m²K, RE1500, CWCT sertifikalı
- TP 52: 52mm görünür, maks. cam 64mm, 6–30mm break, RE1500, 2400Pa

## SCHÜCO (Almanya — Premium Segment)

### Pencere Sistemleri
- AWS 50: Uf=2.5 W/m²K, 50mm, maks. cam 40mm, Sınıf4/9A/C5, RC1
- AWS 65: Uf=1.9 W/m²K, 65mm, maks. cam ≈50mm, Sınıf4/9A/C5, Rw=45dB, RC3
- AWS 75.SI+: Uf=0.9–1.6 W/m²K, 75mm, Uw=0.88 (triple Ug=0.6), 75mm PA+köpük, RC3, Cradle-to-Cradle Silver, **Passivhaus uyumlu**
- AWS 90.SI+: Uf=0.80 W/m²K, 90mm, Uw=0.79–0.88, maks. cam 48mm triple, PU+PE köpük bariyer, Rw=47dB, **PHI phC sertifikalı**
- AWS 114: Uf=1.3–1.8 W/m²K, 114mm, Rw=43dB, su E1200, RC1

### Kapı Sistemleri
- ADS 75.SI: Uf=1.6 W/m²K, 75mm, 75mm PA, Sınıf2/5A/C3, Rw=43dB, RC2
- ADS 90.SI: Uf=1.4 W/m²K, 90mm, köpük dolgulu çubuklar, Sınıf4/750Pa/C4, RC3, yüksek yalıtım
- AD UP 90.SI: Uf=1.1 W/m²K, 90mm, maks. cam 68mm, modüler köpük, Sınıf4/8A/C3, **Passivhaus seviyesi**

### Sürme Sistemleri
- ASE 80.HI: Uf=1.4–1.7 W/m²K, 80mm, maks. cam 36–60mm, HI profil sistemi, Sınıf4/E900, maks. 500kg, Uw=0.76 triple, **Passivhaus seviyesi**
- ASS 80 FD.HI: Uf=1.7 W/m²K, 80mm katlanır-sürme, Uw<1.3
- ASS 39 SC: Uw≥1.3 W/m²K, sürme, Sınıf3/7A/C3

### Cephe Sistemleri
- FW 50+: Uf=1.5 W/m²K, 50–255mm kurulum, maks. cam 62mm, Rw=48dB, RC3, ateşe dayanımlı EI30, AAMA+CWCT, **Passivhaus phA (SI)**
- FWS 50.SI: Uf=0.88 W/m²K, Ucw=0.80, cam 46mm triple, PE+PET köpük, **PHI phA sertifikalı 2015**
- FWS 60: Uf=1.3 W/m²K, 60mm, maks. cam 62mm, Rw=46dB
- FWS 60 CV: Uf=1.5 W/m²K, Ucw=0.84–0.88, yatay şerit pencere cephesi
- FWS 60.HI: Uf=0.7–0.9 W/m²K, 60–250mm, HI+SI varyant, **Passivhaus uyumlu**

## ALUMIL (Yunanistan — Türkiye'de ALUMIL EGE / İstanbul)

### Pencere Sistemleri
- SUPREME S91: Uf=0.67 W/m²K, 91mm, maks. cam 48mm triple, PA 54mm+KOOLTHERM Q3 (λ=0.021), Sınıf4/E1650/C5, Rw=41dB, RC2, **PHI phC sertifikalı**
- SUPREME S77: Uf=0.85 W/m²K, 77mm, maks. cam 72mm, PA 40mm+Energy Bar+PE köpük, Sınıf4/E1350/C5, Rw=42dB, RC3, **PHI uyumlu**
- SMARTIA S67: Uf=1.1–2.6 W/m²K, 67/75mm, maks. cam 58mm, PA 30mm+PE köpük, Sınıf4/E900-E1200/C5, Rw=45dB, RC3
- SMARTIA M11000: Uf=2.3–2.9 W/m²K, 62.5/70mm, maks. cam 59mm, PA 24+20mm, Sınıf4/E900, Rw=47dB, RC3
- SMARTIA M9660: Uf=1.8–2.5 W/m²K, 56/63.5mm, maks. cam 47mm, PA 24mm, Sınıf4/E1650, Rw=45dB, RC2
- COMFORT M20000: Uf=2.7 W/m²K, 62.5mm, maks. cam 48mm, PA 20+24mm, Sınıf4/E750/C5

### Kapı Sistemleri
- SUPREME SD115: Uf=0.75 W/m²K, 115mm, PA 34mm+Kooltherm, RC3, pivot+menteşeli
- SUPREME SD95: Uf=1.2–2.1 W/m²K, 95mm, maks. cam 54mm, PA 34mm+Energy Bar, RC3
- SUPREME SD77: Uf=0.9–1.9 W/m²K, 77mm, maks. cam 59mm/panel 115mm, PA 40mm+Energy Bar, RC2
- SMARTIA MD67: Uf=1.97–3.15 W/m²K, 67mm, maks. cam 49mm, PA 20+24mm, RC2

### Sürme Sistemleri
- SUPREME S700: Uw=1.1 W/m²K, kanat 70mm, maks. cam 50mm, PA+Energy Bar, Sınıf4/E900/C4, Rw=41dB, RC2
- SMARTIA S560: Uw=2.3 W/m²K, kanat 56mm, maks. cam 45mm, maks. 300kg, Sınıf4/E1200/C5, Rw=42dB, RC2
- SUPREME S650 PHOS: Uf=1.1 W/m²K, kanat 62mm, maks. cam 46mm, maks. 1000kg, Sınıf4/9A/C5, Rw=46dB, RC2+PAS24
- SUPREME S500 PHOS: Uw=1.2 W/m²K, kanat 50mm, maks. cam 40mm, maks. 1000kg, manyetik ray, zemin sıfır eşik (Eclipse)

### Katlanır Sistemler
- SUPREME SF85: Uf=1.1 W/m²K, kanat 85mm, maks. cam 53mm (yapısal 75mm), PA 40mm×2+Energy Bar, Sınıf4/9A/C3, RC2+PAS24, maks. 200kg/kanat, maks. 4m yükseklik

### Cephe Sistemleri
- SMARTIA M7: Uf=1.0–2.3 W/m²K, 50mm görünür, mullion 28–250mm, su RE1200, RC4, EPD sertifikalı
- SMARTIA M50: Uf=1.0 W/m²K, 50mm görünür, su RE1200, rüzgar ±3kN/m², EPD sertifikalı
- SMARTIA M6: 55mm görünür, su R7/RE1200, rüzgar ±3kN/m², atrium+cephe kombinasyonu
- SMARTIA M35: 35mm görünür, maks. cam 54mm, vitrin/şeffaf mimari
- SMARTIA M10800: Uf=1.5–3.3 W/m²K, 55mm görünür, atrium/ışıklık/kış bahçesi

Renk/kaplama (tüm Alumil sistemleri): tüm RAL toz boya (QUALICOAT), eloksal (gümüş/şampanya/bronz/polisaj), ahşap sublimation, çelik görünüm (SF85)

## BEYMETAL ALÜMİNYUM (Türkiye)

### Pencere/Kapı Sistemleri
- Beymetal BW 55: 55mm ısılı pencere, PA bariyer, EPDM conta, konut+ticari
- Beymetal BW 60: 60mm ısılı pencere/kapı
- Beymetal BW 70: 70mm yüksek performanslı ısılı pencere

### Cephe Sistemleri
- Beymetal BF 50: 50mm stick cephe sistemi, ticari uygulamalar

## ASİSTAL ALÜMİNYUM (Türkiye — ASAS Grubu)

### Mimari Sistemler
- Asistal pencere/kapı sistemleri: ısılı ve ısısız varyantlar
- Giydirme cephe sistemleri: 50mm ve üzeri
- Sürme sistemler: kaldır-kaydır dahil
Not: Asistal detaylı teknik veriler için katalog PDF'ine başvurunuz.

=== GENEL TEKNİK NOTLAR ===
• PHI Passivhaus sertifikalı sistemler: Cortizo A84 PH, COR80 PH, A78 PH | Schüco AWS90.SI+, FWS50.SI | Alumil S91
• Türkiye iklim bölgelerine göre önerilen min. Uw değerleri: 1.bölge (Antalya) ≤1.8, 2.bölge (İstanbul) ≤1.4, 3.bölge (Ankara) ≤1.2, 4.bölge (Erzurum) ≤0.9 W/m²K
• RC2 kırılmaya dirençli sistemler: çoğu premium seri
• QUALICOAT sertifikalı toz boya ve QUALANOD eloksal tüm markalar

## ZAHİT ALÜMİNYUM (Türkiye)

### Pencere/Kapı Sistemleri
- W55+: 55mm, PA bariyer, maks. cam ~30mm, konut+ticari
- W65+: Uf=2.3 W/m²K, kasa 65mm/kanat 73mm, 26mm PA bariyer, maks. cam 48mm
- W75+: Uf=1.8 W/m²K, kasa 75mm/kanat 83mm, 36mm PA bariyer, maks. cam 58mm, yüksek yalıtım
- AT5500: kasa 55mm/kanat 65mm, 15mm PVC bariyer, maks. cam 30mm, EPDM conta
- AW5500 (ısısız): kasa 55mm/kanat 65mm, ısı bariyersiz, EPDM conta

### Sürme Sistemler
- LS55 (Kaldır-Sür): kanat 55mm/çerçeve 45mm, 14.8mm bariyer, cam 4–38mm, maks. 400kg
- ST7700 (Isıtmalı): çerçeve 77mm/kanat 50mm, 15mm PVC bariyer
- S32/S32+: klasik sürme, minimal ısılı
- LS4500 (Isılı Kaldır-Sür): PA bariyer, maks. 180kg
- FW77+ (Isılı Katlanır): PA bariyer, maks. kanat 120×350cm

### Cephe Sistemleri
- F50: görünür 50mm, 12–16mm bariyer, cam 6–40mm, dikey+ışıklık
- F60 (Yapısal Silikon): görünür 60mm, 12mm bariyer, cam 20–38mm

## ENDER ALÜMİNYUM (Türkiye)

### Pencere/Kapı Sistemleri (Isılı)
- E-55: Uf=3.0–3.6 W/m²K, kasa 55/70mm/kanat 63.5mm, 14.8mm PA, maks. cam 30mm, su 600Pa
- E-64: Uf=2.0–2.4 W/m²K, kasa 64/80mm/kanat 72.5mm, 24mm PA, maks. cam 40mm, su 600Pa
- E-74: Uf=1.5–2.0 W/m²K, kasa 74/90mm/kanat 82.5mm, 34mm PA, maks. cam 50mm, su 600Pa, prestij
- EDR-55 (Isısız): kasa 55mm/kanat 63.5mm, maks. cam 30mm
- E-50: ısılı, konut+ticari

### Sürme Sistemler
- ES-32: Uf=3.0–3.6 W/m²K, çerçeve 80–145mm/kanat 32mm, 20mm PA, su 600Pa
- ES-38: Uf=3.0–3.6 W/m²K, çerçeve 95–107mm/kanat 38mm, 24mm PA
- E-84: Uf=3.0–3.6 W/m²K, çerçeve 84–141.8mm/kanat 34.5mm, 14.8mm PA, maks. cam 24mm
- E-115 (Kaldır-Sür): Uf=2.2–2.6 W/m²K, çerçeve 135mm, 14.8mm PA, maks. cam 32mm
- E-46 (Kaldır-Sür): Uf=2.2–2.6 W/m²K, çerçeve 113–150mm/kanat 46mm, 24mm PA, maks. 400kg, paslanmaz çelik ray
- EK-50 (Cam Balkon): ısısız, maks. 3m, ~30m² görüş alanı

### Cephe Sistemleri
- EN-50: Uf=1.6–2.8 W/m²K, görünür 50mm, çelik takviyeli, cam-cam+kasetli+yarı kapalı+yapısal silikon
- ECR-50: Uf=1.6–2.8 W/m²K, enerji yönetmelikleri uyumlu
- EF-50: Uf=1.6–2.8 W/m²K, yüksek statik değer, büyük projeler
- EN SOLAR: aktif güneş kırıcı+anti-glare panel

### Ofis Bölme
- ED-50: duvar 85–230mm, cam 6–8mm
- EO-73: kaset+çerçeve+jaloezi seçenekleri

## RİGEL ALÜMİNYUM (Türkiye — Karabağlar/İzmir)

### Sürme Sistemler
- RG-100 (Isılı): kanat 75×31.9mm, kasa 44mm, PA bariyer, maks. cam 22mm, 120kg, paslanmaz ray
- RG-200 (Isısız): kanat 75×31.9mm, kasa 44mm, ısısız, maks. cam 22mm, 120kg
- RG-300 (Isılı): kanat 94.5×38mm, kasa 42.9mm, 24mm PA, maks. cam 28mm, 120kg
- RG-400 (Isısız): kanat 94.5×38mm, kasa 42.9mm, ısısız, maks. cam 28mm, 120kg
- RG-500 (Isılı): kanat 94.5×38mm, kasa 42.9mm, 24mm PA, maks. cam 28mm, 120kg

### Pencere/Kapı Sistemleri
- RG-600 (Isılı): kanat 71.7mm, kasa 64.2mm, 24mm PA, maks. cam 48mm, 120–200kg, tüm açılım
- RG-700 (Isısız): kanat 71.7mm, kasa 64.2mm/55mm, ısısız, maks. cam 48mm, 120–200kg

### Diğer
- Katlanır Cam Balkon: kasa 61×54mm, cam 8/10mm veya 28mm ısı camı, manyetik bağlantı
- Alüminyum Kompozit Panel: 4mm×1250×3200mm, yangın A2/B1/B2

## AKMANLAR ALÜMİNYUM — ALUWAY Markası (Türkiye — Gaziemir/İzmir)

### Sürme Sistemler
- SL>8432: çerçeve 83.8–113.6mm/kanat 32mm, 14.8mm PA, maks. cam 20mm, EN AW-6063
- SL>1040: çerçeve 99.8–152.8mm/kanat 40mm, 14.8/16/20mm PA, maks. cam 28mm
- SL>3 (Kaldır-Sür): çerçeve 140.4mm, yalıtımlı versiyon, monorail, lüks villar

### Pencere/Kapı Sistemleri
- W55: Uf=2.74–3.70 W/m²K, kasa 55/62.5mm, 14.8mm PA, maks. cam 35mm
- W55 YS (Isısız): kasa 55mm, ısısız
- W65: Uf=2.20–2.97 W/m²K, kasa 64.2mm/kanat 71.7mm, 24mm PA, maks. cam 48mm

### Katlanır Sistemler
- FL 950 PLUS (Isılı): yalıtımlı, cam 24–44mm, derinlik 77–79mm
- FL 950 (Isısız): standart katlanır

## IQ ALÜMİNYUM — by Deceuninck (Türkiye — Menemen/İzmir)

### Sürme Sistemler
- Renovatio (Kaldır-Sür): kanat 81×45mm, çerçeve 40mm, 14.8mm PA, cam 20–36mm, 250kg
- Ingentis (Kaldır-Sür): kanat 98×64.2mm, çerçeve 43mm, 24mm PA, cam 18–44mm, 400kg
- New Ingentis: kanat 99mm, çerçeve 41mm, 14.8mm PA, cam 20–48mm, 400kg
- Moventis: kanat 78×45mm, çerçeve 50.5mm, 14.8mm PA, cam 20–28mm, 200kg
- Serenad: kanat 85/98mm, çerçeve 45mm, 18.6mm PA
- Serenad-S: çerçeve 45mm, 18.6mm PA, cam 24–28mm, 160kg
- Solidum (Isısız): kanat 78×45mm, çerçeve 50.5mm, ısısız, cam 20–28mm, 160kg
- Arma: kanat 75×40mm, çerçeve 45mm, 20mm PA, cam 6–20mm, 120kg
- Bellus (Isısız): kanat 75×32mm, çerçeve 45mm, ısısız, cam 6–20mm, 120kg
- Limatus (Isısız): kanat 39.6mm, çerçeve 48mm, ısısız, cam 6–20mm, 100kg
- Slimline/Magnus (Gizli-Gömülü): kanat 40×64.6mm, çerçeve gömülü 75mm, 14.8mm PA, cam maks.30mm, 350kg

### Pencere/Kapı Sistemleri
- Gracilis: 45mm, 1.6mm et, 14.8mm PA, cam 4–30mm
- Fixum (Isısız): 45mm, 1.4mm et, ısısız, sabit sistem
- Actus: 55mm, 2.0mm et, 14.8mm PA, cam 4–40mm, gizli kanat+pivot
- Formo: 55mm, 1.6mm et, 14.8mm PA, cam 4–40mm (test sertifikalı)
- Rarus: 55mm, 2.0mm et, 14.8mm PA, cam 4–40mm
- Solis (Isısız): 55mm, 1.6mm et, ısısız, cam 4–40mm
- Primum: 65mm, 1.6mm et, 24mm PA, cam 18–44mm, pivot uyumlu
- Castrum: 65mm, 2.0mm et, cam 18–44mm
- Innovatio: 75mm, 1.6mm et, 34mm PA, cam 20–44mm
- Perfectus: 75mm, 2.0mm et, 34mm PA, cam 20–44mm, gizli kanat+pivot
- Regnum: 75mm, 2.0mm et, 34mm PA, cam 20–40mm

### Katlanır Sistemler
- Vival Plus (Isılı): kanat 86/58mm, 14.8mm PA, cam 4–42mm, 100kg
- Vival Kapı (Isısız): kanat 41mm, ısısız, cam 4–24mm, 70kg

### Cephe Sistemleri
- Energy Klasik Silikon Cephe: görünür 50mm, taşıyıcı 35–195mm, cam 24–38mm
- Energy Kapaklı Cephe: görünür 50mm, taşıyıcı 35–215mm, cam 24–38mm
- Energy Entegre Cephe: görünür 50mm, taşıyıcı 35–215mm (test sertifikalı)
- Interface: iç cam montajlı cephe

### Mimari/Diğer
- Login (Pivot Giriş Kapısı): 65mm, 2.0mm et, cam 8–12mm, asimetrik pivot
- Vival Shutter (Kepenk): vintage estetik, katlanır/katlı/sürme seçenek
- Airboost 101/151/201/Multi/UVC: akıllı havalandırma serileri (Deceuninck)

Renk/kaplama (tüm IQ sistemleri): IQ Colors Class1 (10yıl) + Class2 (25yıl) toz boya, ahşap efekt, anodize metalik — AAMA/QUALICOAT/GSB uyumlu

## ALMİN PROFİL — ROUTE SİSTEMLERİ (Türkiye — Ankara, 14.000 ton/yıl, ISO 9001/14001/45001, QUALANOD)

### Pencere/Kapı Sistemleri
- AR-55 (Isısız): kasa 55mm/kanat 65mm, ısısız, maks. cam 36mm, Sınıf4/9A/C4(1600Pa), vitrin+ofis+iç mekan
- ART-55 (Isılı): kasa 55mm/kanat 65mm, 14.8mm PA, maks. cam 36mm, dış cephe konut+ticari
- ART-64 (Isılı): kasa 64mm/kanat 74mm, 24mm PA, maks. cam 46mm, orta-üst segment
- ART-75 (Yüksek Yalıtım): kasa 75mm/kanat 85mm, 35mm PA, maks. cam 46mm, yüksek enerji verimli+pasif ev uyumlu

### Cephe Sistemleri
- FR-50 (Çubuk Cephe): Uf=1.32–1.98 W/m²K, görünür 50mm, mullion 50–220mm, 10–40mm bariyer, maks. cam 50mm, ticari cephe+yapısal cam
- FR-60 (Çubuk Cephe): Uf=1.32–1.98 W/m²K, görünür 60mm, mullion 50–220mm, 10–40mm bariyer, maks. cam 50mm, büyük açıklıklar

### Sürme Sistemler
- AST-145HS (Kaldır-Sür): derinlik 145mm, ısılı, villa+teras büyük format kapılar

## ALBERT GENAU (Türkiye — Ankara, iF + Red Dot + Good Design ödüllü, PfB Almanya + Giordano İtalya sertifikalı)

### Pencere Sistemleri
- ALTIMBA (Alu-Ahşap Kompozit): Uw=0.90(S99)/1.31(S89)/1.43(S81) W/m²K, çok katlı PA+EPDM, triple cam uyumlu, F30/F60/F90 yangın opsiyonel, 6 tasarım varyantı (Original/Classic/Rustic/Arc/Elegance/Block)
- ALTHERMA (Tüm-Alüminyum Isılı): Uw=0.73(S81)/0.81(S99)/0.91(S89) W/m²K, çok katlı PA+EPDM, F30/F60/F90 opsiyonel, 6 varyant, pasif ev seviyesi

### Katlanır-Sürme Balkon Sistemleri
- TIARA (Çerçevesiz Sürme-Katlanır Balkon): cam 8/10mm, maks. kanat 800×2700mm, 85°–275° kavisli balkon uyumlu, PfB+Giordano sertifikalı, paslanmaz rulmanlar (1440h tuz spreyi), çocuk kilidi
- TIARA TWINMAX (Isılı Balkon): 28mm IGU (4+20+4), maks. 800×3000mm, manyetik+EPDM+fırça üçlü sızdırmazlık, entegre jalüzi opsiyonel, sıfır eşik seçeneği
- SLIDERNEXT (Çok Raylı Sürme Cam Duvar): cam 8/10mm, maks. 1300×2500mm(8mm)/3100mm(10mm), 2/3/5 ray, ±10mm tolerans, 5 kilit seçeneği, 7 yıl garanti
- SLIDEMASTER (Çift Camlı Lüks Sürme): cam 8/10/20mm, maks. 1500×2800mm, paslanmaz çelik mekanizma

### Giyotin (Dikey Sürme) Sistemler
- VERTIFLEX Mono: tek cam, manuel, balkon+teras
- VERTIFLEX Twin: çift cam IGU, manuel, yalıtımlı
- VERTIFLEX All-Clean: çift cam, temizlenebilir cephe, sürdürülebilir malzeme
- VERTIFLEX All-Glass: çerçevesiz otomatik, tam panoramik
- VERTIFLEX Up: otomatik üstte yığılır, serbest geçiş — **iF + Red Dot + Good Design + Altın Şakül ödüllü**

### Rüzgar Kırıcı Sistemler
- AIRFLEX (Dikey Rüzgar Ekranı): sabit 8mm+hareketli 6mm temperli cam, yükseklik 1130–1850mm, 90° köşe seçeneği, tek tuşla açılır-kapanır

### Balkon Korkuluk Sistemleri
- BALUMAX (Entegre Korkuluk-Balustrat): tek/IGU/lamine cam, 28mm IGU varyantı, çift EPDM, L/U/kavisli balkon uyumlu
- LINERA (Tam Cam Balustrat, patentli): maks. 1300mm yükseklik, 8+8 veya 10+10 lamine cam, tavan/cephe/zemin montaj, LED opsiyonel, 3.4kN yük+50kg darbe sertifikalı

### Pergola & Veranda
- BİYOKLİMATİK PERGOLA: motorlu döner kanatlar, RGB+LED, Qualicoat soft-touch boya, çoklu modül
- PREMIUM VERANDA: VertiFlex+Sliding entegreli, yıl boyu kapalı teras

## BURÇ ALÜMİNYUM (Türkiye — Konya, GNC/Fausto profil bazlı)

### Pencere/Kapı (GNC Fausto Dizayn)
- BRC 55 (Isısız): kasa 55–63.5mm/kanat 62.5mm, ısısız, maks. cam 32mm, Sınıf3/4A/C3
- BRC 55T (Isılı): kasa 55–70mm/kanat 62.5mm, 14.8mm PA, maks. cam 32mm, Sınıf3/4A/C3
- BRC 64T (Isılı Geniş): kasa 64.2–79.2mm/kanat 71.7mm, 24mm PA, maks. cam 42mm, Sınıf3/4A/C3
- BRC 75T (Yüksek Yalıtım): kasa 74.2–89.2mm/kanat 81.7mm, 34mm PA, maks. cam 52mm, Sınıf3/4A/C3

### Sürme
- BRC Sürme/TUBA: çerçeve 67mm/kanat 29mm, ısısız, maks. cam ~20mm
- Strong Slide 32ST (Isılı): çerçeve 80–152.5mm/kanat 32mm, 14.8mm PA, maks. cam 24mm, enerji verimli
- Fausto LS-55 (Kaldır-Sür): çerçeve 128–163.2mm/kanat 55mm, 16–20mm PA, maks. cam 32mm, 400kg+

### Cephe
- 50F Kapalı/Silikon/Yarı-Kapalı: görünür 50mm, mullion 50–180mm, maks. cam 44mm, CE sertifikalı

## AYDINAL ALÜMİNYUM (Türkiye — Konya, 1997, korkuluk+balkon aksesuarları uzmanı)
Not: Aydınal pencere/kapı termal sistem üreticisi değildir. Temel ürünler:
- Küpeşte+korkuluk profil grubu (sistem derinliği/Uf yayınlanmamış)
- Isı Camlı Cam Balkon Serisi: IGU sürme balkon, SRM 117 sürme sistemi
- AYD SS135 Sürme Profil Serisi: 4/3 kanatlı üst kasalı, aksesuarlar

## ASLANLAR METAL ALÜMİNYUM (Türkiye)
- Pencere/kapı, sürme ve cephe sistemleri üretmektedir. Detaylı teknik veri için katalog talep ediniz.

## MEKALİNE ALÜMİNYUM — MİMARİ SİSTEMLER (Türkiye)
- Pencere/kapı, sürme ve giydirme cephe sistemleri. Detaylı teknik veri için katalog talep ediniz.

## LİNEA ROSSA ALÜMİNYUM (Türkiye — Kemalpaşa/İzmir, ISO 9001, QUALANOD, QUALICOAT SEASIDE)

### Sürme Sistemler (İzolasyonsuz)
- LR-2100: kanat 32mm, çerçeve 75mm, maks. cam 20–22mm, 120kg, 3-ray/mono-ray, %50 azaltılmış orta profil
- LR-2200: kanat 38mm, çerçeve 92.5mm, 1.3–1.8mm et kalınlığı, maks. cam 20–26mm, 120kg, 3-ray/mono-ray

### Sürme Sistemler (İzolasyonlu)
- LR-3100: Uf=3.8 W/m²K, kanat 32mm, çerçeve 75mm, 21mm PA bariyer, maks. cam 30–32mm, 120kg, %50 azaltılmış orta profil
- LR-3200: kanat 38mm, çerçeve 92.5–94mm, 20mm PA bariyer, maks. cam 20–26mm, 118–120kg
- LR-3300 Dream Slide: kanat 74mm, çerçeve 77mm, 20mm PA bariyer, maks. cam 24–30mm, 250kg, Drive&Slide mekanizması
- LR-3500 Lift&Slide: kanat 54–57mm, çerçeve 92.5–94mm, 24mm PA bariyer, maks. cam 21–44mm, 200–400kg HBSB mekanizmalı

### Pencere/Kapı Sistemler (İzolasyonsuz)
- LR-4100: kasa 45mm, kanat 52mm, tek+çift cam, maks. 80kg, 3 kademeli conta

### Pencere/Kapı Sistemler (İzolasyonlu)
- LR-5100: Uf=2.3 W/m²K, kasa 65mm, kanat 72mm, 24mm radyal PA bariyer, maks. cam 16–42mm, 120–200kg, içe/dışa/gizli kanat, triple cam uyumlu

### Cephe Sistemleri
- LR-9200 Stick Cephe: 50mm profil derinliği, hava+su+ses+ısı yalıtımı
- LR-9300 Stick Cephe: 60mm profil derinliği
- LR-9500 Curtain Wall: minimal görünüm, soğuk bükme (cold bending) uyumlu, maksimum şeffaflık

### Grande Serisi (Premium)
- GLR-33 Sliding: kanat 73mm, çerçeve 113mm, 21mm PA bariyer, maks. cam 24–60mm, 250–400kg
- GLR-36 Sliding: kanat 52mm, çerçeve 124mm, maks. cam 30–33mm, 200kg
- GLR-37 Minimal Sliding: eşik 129mm (2-ray)/202mm (3-ray), maks. cam 35mm, maksimum şeffaflık
- GLR-50 Giriş Kapısı: eşik 87mm, cam+alüminyum panel, yüksek güvenlik
- GLR-51 Pivot Kapı: eşik 119mm, pivot mekanizma, ısı+ses yalıtımı
- GLR-65 Storefront: mullion 76mm/127mm derinlik, ticari cephe

### Diğer Sistemler
- LR-8700: Biyoklimatik pergola
- LR-1000: Ofis bölme sistemi
- LR-1400/4900: Korkuluk sistemleri
- LR-6000: Bi-fold katlanır panjur
- LR-1600/1800: Duvar/tavan kaplama, aydınlatma sistemi

### Renk/Yüzey (tüm sistemler)
- Anodize: gümüş, bronz (QUALANOD sertifikalı)
- Toz boya: tüm RAL (QUALICOAT SEASIDE sertifikalı — kıyı projeler dahil)
- Özel renkler: Notte Black RAL 9005, Griante Antracite RAL 7016, Atlas White RAL 9016
- Ahşap desen folyo

## ALUPROF (Polonya — Avrupa'nın büyük sistem üreticilerinden)

### Pencere/Kapı Sistemleri
- MB-45: Uf=1.9–2.8 W/m²K, 45mm, 16mm PA bariyer, maks. cam 38mm, Sınıf4/9A/C5, ekonomik ticari
- MB-60: Uf=1.6–2.3 W/m²K, 60mm, 24mm PA, maks. cam 46mm, Sınıf4/9A/C5, RC2
- MB-70HI: Uf=0.7–1.1 W/m²K, 70mm, 40mm PA+köpük, maks. cam 62mm, Sınıf4/E1200/C5, Rw=47dB, RC3, **PHI Passivhaus**
- MB-86SI: Uf=0.54–0.84 W/m²K, 86mm, 52mm PA+aerogel+köpük, maks. cam 86mm, Sınıf4/E1500/C5, Rw=48dB, **PHI phC ultra**
- MB-104 Passive: Uf=0.49 W/m²K, 104mm, 64mm bariyer, Uw=0.64 triple, **en yüksek PHI serisi**

### Sürme/Cephe
- MB-77HS (Lift&Slide): Uf=1.5 W/m²K, 77mm, 34mm PA, maks. cam 55mm, maks. 400kg, Sınıf4/E1200/C5, Uw=0.79 triple
- MB-SR60N (Cephe): Uf=1.2–1.6 W/m²K, 60mm görünür, maks. cam 62mm, CWCT+AAMA, Rw=47dB
- MB-TT50 (Cephe HI): Ucw=0.72 W/m²K, **PHI phA**; MB-78EI: yangın EI30–EI120
- MB-SD95 (Katlanır-Sürme): 95mm, maks. 6 kanat

## SKYPROF (Türkiye — S65 Serisi)
- S65 Curtain Wall: 65mm görünür, çelik takviyeli, yüksek statik, büyük ticari yapılar

## KLEİDCO ALÜMİNYUM (İzmir — EPD/LEED/BREEAM/DGNB/ÇEDBİK, QUALICOAT+QUALANOD)

### Pencere/Kapı Sistemleri
- SELECTIVE 76 (Hibrit Al+PVC): Uf=0.92/Uw=0.80 W/m²K, 76mm 3 bölümlü kasa, köpük dolgulu PA bariyer, Sınıf4/—/C4-B4, Rw=50dB, RC2, **Pasif Ev standartı** — varyant: SLP/SLA/SLB
- ICON 84 HI: Uf=0.989 W/m²K, kasa 84mm/kanat 93mm, 48mm+44mm PA bariyer, maks. cam 60mm, A4/E900/C4(±2400Pa), RC1/2
- ICON 70: Uf=1.96 W/m²K, kasa 70mm/kanat 79mm, 34mm+30mm PA, maks. cam 60mm, A4/E900/C5(±3000Pa), RC1/2
- ICON 70 BV (Sızıntısız): Uf=2.40 W/m²K, kasa 70mm/kanat 79mm, 34mm+20mm PA, maks. cam 40mm, A4/E900/C1400, RC1/2
- ICON 70 D (Kapı): Uf=2.76 W/m²K, kasa 70mm/kanat 70mm, PA bariyer, RC1/2
- ICON 65 HV (Gizli Kanat): 65mm, 24mm PA, maks. cam 22–34mm, A4/E900/B2(800Pa)
- ICON 75 D (Kapı, Yüksek Yal.): kasa 84mm/kanat 84mm, 30mm PA+3 bölüm, maks. cam 26–43mm, RC1/2
- PRIME 90+: Uf=1.97 W/m²K, kasa 90mm/kanat 62mm, 34mm+34mm PA, maks. cam 52mm, A4/E900/C3(±1200Pa), RC1/2, gizli kanat 30mm görünür
- PRIME 90: Uf=1.97 W/m²K, kasa 56mm/kanat 65mm (sistem 90mm), 20mm+16mm PA, maks. cam 46mm, A4/E9A/C3, RC1/2, 55mm görünür
- BASIC 60: Uf=2.57 W/m²K, kasa 60mm/kanat 69mm, 24mm+20mm PA, maks. cam 50mm, A4/E1200/C5(±3000Pa), RC1/2
- BASIC 56: Uf=2.76 W/m²K, kasa 56mm/kanat 65mm, 20mm+16mm PA, maks. cam 46mm, A4/E1200/C3(±1800Pa), RC1/2
- PANORAMA (Katlanır Kapı): kasa/kanat 77mm/dikme 157mm, 20–32mm PA, maks. cam 16–52mm, maks. 3000mm/150kg

### Sürme Sistemleri
- SMART SLIDE+: Uf=3.21 W/m²K, sistem 155mm/kanat 82mm, 25–34mm PA, maks. cam 46mm, A4/E1200/C4(±2250Pa), maks. 400kg/3600mm, RC1/2
- SMART SLIDE: Uf=2.60 W/m²K, sistem 155mm/kanat 72mm, 32–34mm PA, maks. cam 52mm, A4/E1500/C5(±3000Pa), maks. 200kg/2800mm, RC1/2
- UNIQUE SLIDE: Uf=3.52 W/m²K, sistem 140–286mm/kanat 56mm, PA bariyer, A4/E900/C5(±3000Pa), RC1/2
- UNIQUE SLIDE MAX: Uf=2.94 W/m²K, sistem ~140mm, 15mm+18mm PA, A4/E900/B5(±3000Pa), RC1/2
- NOVA SLIDE 45: Uf=3.75 W/m²K, sistem 108–149mm/kanat 38mm, 24mm+18mm PA, maks. cam 28mm, A4/E900/B2, maks. 150kg/2700mm, RC1/2 — 45° açılır
- NOVA SLIDE 90: Uf=4.74 W/m²K, sistem 108–149mm/kanat 38mm, 24mm+18mm PA, maks. cam 28mm, A4/E900/B2, RC1/2 — 90° açılır
- F 35 (Katlanır-Sürme): Uw=1.70 W/m²K, dikme 135mm, kanat 56mm, 15mm Anti Bi-Metal bariyer, maks. cam 36mm, Rw=41dB, ASTM E283/E331/E330, 35mm görünür

### Cephe Sistemleri
- FS 50: Uf=1.20 W/m²K, A4/RE900/±0.96kN/m², EN 14019 E5
- FS 60: Uf=1.46 W/m²K, 60mm görünür, maks. cam 6–42mm, A4/RE900/±2100Pa, maks. kanat 2500mm/180kg, E5
- FS 60 Add-On: Uf=2.46 W/m²K, dikme 67mm/yatay 65mm, maks. cam 6–42mm, A4/R7/1.20kN/m²
- USG 80 (Ünite Cephe): Uf=2.87 W/m²K, dikme 160mm, görünür 83mm, maks. cam 30mm, A4/RE900/±3000Pa(güvenlik ±4500Pa), Jx=315cm⁴
- UF 90 (Ünite, ASTM): ASTM E283/E331/E330 90 psf, yüksek bina
- SKY 52 (Işıklık): Uf=0.90 W/m²K, maks. cam 34mm, A4/R7/±1200Pa
- SKY 90 (Işıklık): Uf=1.22 W/m²K, maks. cam 36mm, A4/R7/±1200Pa

Not: Tüm sistemler EPD sertifikalı. Cephe sistemleri EN 12152/12154/13830 test standartları.

## COSABELLA — ALKOR ALÜMİNYUM (İzmir)

### Sürme (Isısız)
- SD-22: çerçeve 43.5mm, maks. cam 22mm, 140kg, Sınıf3/7A/C1-B2
- SD-23: çerçeve 43.5–102mm, maks. cam 28mm, 140kg, Sınıf3/6A/C1-B2

### Sürme (Isılı)
- SD-32: PA bariyer, maks. cam 22mm, 140kg
- SD-33: 16/24mm PA, maks. cam 28mm, 140kg, Sınıf3/6A/C1-B2
- SD-35 (Kaldır-Sür): çerçeve 44mm/kanat 94mm, 16/28mm PA, maks. cam 40mm, Sınıf4/9A/C4-B4, maks. 400kg
- SD-36: çerçeve 145mm/kanat 56mm, 24mm PA, maks. cam 34mm, Sınıf4/7A/C5
- SD-13500: görünür 112mm, 20–22mm PA+PVC, maks. cam 22mm, 140kg
- SD-14500: görünür 121mm, 22–24mm PA+PVC, maks. cam 20–30mm, 200–400kg

### Pencere/Kapı
- WD-42 (Isısız): çerçeve 60/70mm, maks. cam 46mm, Sınıf4/7A/C5-B5
- WD-52 (Isılı): çerçeve 65mm, 20mm PA, maks. cam 46mm, Sınıf4/7A/C5-B5
- DS-63 Giriş Kapısı, DS-64 Pivot, FS-72 Cephe, SS-92 Katlanır, RS-82 Çerçevesiz Korkuluk

## OKYANUS ALÜMİNYUM — AQUAL SYSTEM (İstanbul, 16.500 ton/yıl, TSE/TÜRKAK)
- ALC-55-T (Isılı Pencere/Kapı, PA bariyer), ALC-65, ALC-75 (Yüksek Yalıtım)
- AL-55 (Isısız), 3200-PRO SLIDE (Isısız Sürme), 3200-T-PRO SLIDE (Isılı Sürme), LS-55 (Kaldır-Sür)
- FC50 (Giydirme Cephe ~50mm), FC50-160 (Kış Bahçesi)

## ASRAL ALÜMİNYUM (Tuzla/İstanbul, 2022) — info@asral.com.tr
- Isılı pencere/kapı, cephe, kış bahçesi, ofis bölme, otomatik kapı. Katalog için iletişime geçiniz.

## TAN ALÜMİNYUM (Gebze/Kocaeli) — tan@tanaluminyum.com
- Profil ekstrüzyon + mimari sistemler. Katalog için iletişime geçiniz.

## ERSAŞ ALÜMİNYUM — ERSAŞ SYSTEMS (Türkiye)

### Pencere/Kapı
- TITAN 95: Uf=1.89 W/m²K, 95mm, 54mm PA+XPS, maks. cam 80mm, Sınıf4/E1500/C5, Rw=44dB, **Passivhaus uyumlu**
- FORTIS 75: Uf=2.16–2.34 W/m²K, 75mm, 34mm bariyer, maks. cam 58mm, Sınıf4/E1500/C5, Rw=42dB
- FORTIS 65: Uf=2.30–2.95 W/m²K, 65mm, 24mm bariyer, maks. cam 48mm, Sınıf4/E1050/C5, Rw=36dB
- FORTIS 55: Uf=3.11–3.44 W/m²K, 55.8mm, 14.8mm bariyer, maks. cam 40mm, Sınıf4/E900/C5
- NEXUS 85 (Pivot): Uf=2.92 W/m²K, 85mm, 34mm+XPS, maks. 3000mm/160kg, hemyüz tasarım
- PASCAL 45/60/77: ekonomik seri, PA bariyer, PVC aksesuar uyumlu

### Sürme
- OPUS SLIDE (Lift&Slide): Uf=2.68–4.22 W/m²K, çerçeve 165mm/kanat 75mm, 58mm toplam bariyer, maks. cam 58mm, maks. 400kg
- MAGNUS 77 (Katlanır): Uf=2.64 W/m²K, kasa 86mm/kanat 77mm, 20–32mm bariyer, maks. cam 59mm, Sınıf4/9A/B2, Rw=42dB, maks. 5m
- INVICTUS (Çok Raylı): Uf=3.78–4.20 W/m²K, çerçeve 123–219mm/kanat 55.8mm, 14.8–24mm bariyer, maks. cam 40mm, Sınıf4/E900/C5, maks. 400kg
- NOVUS SLIDE (Isılı): Uf=3.56–4.46 W/m²K, çerçeve 95mm/kanat 38mm, 14.8–24mm bariyer, maks. cam 28mm, Sınıf4/9A/C3
- NOVUS COLD SLIDE (Isısız): 95mm, ısısız, maks. cam 28mm, 150kg

### Cephe
- PERFECTUM 50 (Stick): Uf=3.78 W/m²K, 50mm görünür, dikme 40–200mm, 8–20mm bariyer, maks. cam 40mm, Sınıf4/E900/C5
- TEMPUS 78 (Modüler Panel): Uf=1.88–4.80 W/m²K, 78mm, dikme 100–150mm, 14.8mm bariyer, maks. cam 30mm
- VITRUS (Kasetli, Isısız): Uf=7.59 W/m²K, 50mm, kanat 50–120mm, maks. cam 24mm, bariyer yok

## AKSESUAR KATALOĞU: dosya-898021.pdf
Kaynak: KARPEN / KARA ALÜMİNYUM (www.karaluminyum.com.tr) – 2021 Alüminyum Profil Kataloğu
- Firma 1995'ten beri PVC, 2011'den beri alüminyum profil üretimi; 30.000 m² kapalı alan, 10 bölgesel depo, 1000+ distribütör, aylık 1500 ton PVC + 850 ton alüminyum kapasite
- ALDOKS Kapı/Pencere Profilleri (Sayfa 10–23): KAR-1010 Çeyrek Seri Kanat 545 gr/m, KAR-1020 Çeyrek Seri Orta Kayıt 545 gr/m, KAR-1030 Çeyrek Seri Kasa 451 gr/m, KAR-1040 Yarım Seri Kasa 549 gr/m, KAR-1050 Yarım Seri Kanat 643 gr/m, KAR-1060/1061 Yarım Seri Orta Kayıt 643/675 gr/m; KAR-1141 Köşe Dönüş, KAR-1150, KAR-1160 Çavuş Köşe 607/629 gr/m
- C-60 Profilleri (Sayfa 26–35): Çeyrek/yarım seri C-60 uyumlu kanat, kasa, orta kayıt profilleri
- Yalıtımsız Sürme Profilleri (Sayfa 38–57)
- Yalıtımlı Sürme Profilleri (Sayfa 60–65)
- Tente Serisi (Sayfa 68–81)
- Cephe Profilleri (Sayfa 84–127)
- Cam Balkon Profilleri (Sayfa 130–161)
- Sineklik Profilleri (Sayfa 164–167)
- Duş Kabin Profilleri (Sayfa 170–181)
- Küpeşte Profilleri (Sayfa 184–219)
- Stor Perde Profilleri (Sayfa 222–225)
- Kepenk Profilleri (Sayfa 228–231)
- Tuba Sürme Profilleri (Sayfa 234–243)
- Isı Yalıtım Profilleri (Sayfa 246–271)
- Sistem 55 Profilleri (Sayfa 274–291)
- Standart Profiller (Sayfa 294–307)
- Mobilya/Mutfak Profilleri (Sayfa 310–313)
- Afrika Serisi Profilleri (Sayfa 316–317)
- Aksesuar: KDA-073 Dar U aksesuar – çeyrek/yarım seri kesim ölçüsü 43 mm

## AKSESUAR KATALOĞU: ado-aluminyum-profilleri.pdf
Kaynak: ADO Alüminyum Profil Sistemleri – Alüminyum Profil Kataloğu (136 sayfalık teknik katalog)
- NOT: Profil ağırlıkları teorik olup; teslim tartımı geçerlidir
- AD 01 KÖŞEBENTLER (L profiller) – 32 model:
  - AD01-001: 10x10x1,2 mm → 0,061 Kg/m
  - AD01-002: 15x15x1,2 mm → 0,094 Kg/m
  - AD01-003: 20x20x1 mm → 0,106 Kg/m
  - AD01-004: 25x25x1,2 mm → 0,159 Kg/m
  - AD01-005: 30x30x1,2 mm → 0,191 Kg/m
  - AD01-006: 20x40x1,2 mm → 0,191 Kg/m
  - AD01-007: 40x40x1,2 mm → 0,256 Kg/m
  - AD01-008: 40x40x4 mm → 0,824 Kg/m
  - AD01-009: 50x50x1,5 mm → 0,400 Kg/m
  - AD01-010: 20x60x1,2 mm → 0,256 Kg/m
  - AD01-011: 60x40x1,3 mm → 0,348 Kg/m
  - AD01-012: 80x20x1,2 mm → 0,321 Kg/m
  - AD01-013: 80x40x1,5 mm → 0,482 Kg/m
  - AD01-014: 20x100x1,5 mm → 0,482 Kg/m
  - AD01-015: 20x120x1,5 mm → 0,563 Kg/m
  - AD01-016: 20x150x1,5 mm → 0,685 Kg/m
  - AD01-017: 20x20x2 mm → 0,206 Kg/m
  - AD01-018: 25x25x2 mm → 0,260 Kg/m
  - AD01-019: 20x50x1,2 mm → 0,225 Kg/m
  - AD01-020: 14x22x2,3 mm → 0,211 Kg/m
  - AD01-021: 80x40x2 mm → 0,640 Kg/m
  - AD01-022: 25x25x1 mm → 0,133 Kg/m
  - AD01-023: 30x30x1 mm → 0,160 Kg/m
  - AD01-024: 30x30x2 mm → 0,314 Kg/m
  - AD01-025: 50x50x5 mm → 1,287 Kg/m
  - AD01-026: 20x25x1 mm → 0,119 Kg/m
  - AD01-027: 40x40x2,8 mm → 0,585 Kg/m
  - AD01-028: 50x93x4 mm → 1,507 Kg/m
  - AD01-029: 35x35x1,5 mm → 0,279 Kg/m
  - AD01-030: 30x15x2 mm → 0,233 Kg/m
  - AD01-031: 10x15x1 mm → 0,065 Kg/m
  - AD01-032: 35x65x2,5 mm → 0,661 Kg/m
- AD 02 T PROFİLLER – 5 model:
  - AD02-001: 25x25x1,2 mm → 0,159 Kg/m
  - AD02-002: 30x40x1,2 mm → 0,224 Kg/m
  - AD02-003: 40x20x1,1 mm → 0,176 Kg/m
  - AD02-004: 30x30x1,2 mm → 0,191 Kg/m
  - AD02-005: 35x38x3 mm → 0,569 Kg/m
- AD 03 KUTU PROFİLLERİ (kare/dikdörtgen tüp) – 11 model:
  - AD03-001: 17x25x1 mm → 0,217 Kg/m
  - AD03-002: 20x40x0,9 mm → 0,284 Kg/m
  - AD03-003: 40x40x0,85 mm → 0,358 Kg/m
  - AD03-004: 40x50x1 mm → 0,477 Kg/m
  - AD03-005: 32x70x1,3 mm → 0,701 Kg/m
  - AD03-006: 40x80x1,5 mm → 0,951 Kg/m
  - AD03-007: 50x95x1,6 mm → 1,230 Kg/m
  - AD03-008: 28x70x1 mm → 0,520 Kg/m
  - AD03-009: 55x40x0,8 mm → 0,386 Kg/m
  - AD03-010: 48x30,5x1 mm → 0,345 Kg/m
  - AD03-011: 120x120x2 mm → 2,558 Kg/m
- Katalog toplamda 136 sayfa; AD01–AD03 sonrasında ek profil serileri (AD04+) mevcut

## AKSESUAR KATALOĞU: AKPA-AKSESUAR-1.pdf
Kaynak: AKPA Alüminyum (www.akpaas.com.tr) – AKPA Ürün Kataloğu 2018
- Firma: 1987 İstanbul kurulumu; CE, ISO 9001:2008, Qualicaat, Qualanod, Rosenheim belgeleri; 80.000 m² alan, 42.000 ton/yıl kapasite, 6 ekstrüzyon pres, 30.000 ton/yıl eloksal, 15.000 ton/yıl dikey toz boya, 1500 ton/yıl ahşap transfer boya, 4.500.000 m²/yıl kompozit panel
- ALÜMİNYUM KAPI/PENCERE MENTEŞELERİ:
  - C 60 Yaprak Menteşe Eloksallı (01 010801), C 60 Takozlu Menteşe Eloksallı (01 010701), C 60 Baba Menteşe Eloksallı (01 010501)
  - Yayli Menteşe No:33 Saten (01 012206), Yayli Menteşe No:33 Kadyumlu (01 012101)
  - ALM Düz Aldoks Menteşe Eloksallı (01 010201), Aldoks Geçme Menteşe Eloksallı (01 010301)
  - Aldoks Bursa Menteşe Eloksallı (01 010905), Binme Menteşe (01 010401)
  - İzo Pencere Menteşe Eloksallı (01 010901), İzo Kapi Menteşe Eloksallı (01 011101), İzo Üçgen Pivot Menteşe Eloksallı (01 011001)
  - Y.S 2'li Menteşe Eloksallı (01 011301), Y.S 3'lü Menteşe Eloksallı (01 011601)
  - Ayarlı Sistem Kapi Menteşesi (01 011120), Lama Bant Kol 90–100 cm Eloksallı (01 031901)
  - Kale Panik Bar Barelsiz (01 160103), Kale Panik Bar Kolu Kilitlenebilir (01 160106)
- ALÜMİNYUM KAPI/PENCERE KOLLARI:
  - AK 2025 Kapi Kolu Eloksal (01 031101), Akbank Kol Aparatı (01 031104)
  - H Köşeli Kol Eloksallı 50cm (01 031350), H Kol Eloksallı 50cm (01 031309)
  - Yay Kol 25mm 30cm Eloksallı (01 031201), U Kol 25mm 30cm Eloksallı (01 051101)
  - Kıvrık Kol Eloksallı (01 030401), Yarim Ay Kapi Kolu Eloksallı (01 030901)
  - Aynalı Kıvrık D Kol Eloksallı (01 031820), Yeni İspanyolet Kol B.Boyalı (01 020302)
  - Gizli Cephe Kanat Kolu Naturel (01 020550), Forza Eksenel Pencere Kolu Naturel (01 020803)
  - Rotoline Secustik Rozetsiz Pencere Kolu (01 200291), Sosis Kol Eloksallı (01 040701)
  - Dış Cephe Kolu Eloksallı (01 100400), Euro Eksenel Kol Tek Dilli Gri (01 021203)
  - Euro Giesse Cephe Kolu (01 100409), Yaylı Rozetli Sosis Kol Eloksallı (01 040104)
  - Rozetli Sosis Kol Eloksallı (01 040101), 10cm Kare Kol (01 031701)
  - R29W Rotoline Eksenel Kol (01 020601), Rotoline İzo Sürme Parizyen Kol (01 071012)
  - Forza Çift Dilli Eksenel Geniş Pencere Kolu Naturel (01 020810), Geniş Aynalı D Çekme Kol Eloksallı (01 040120)
  - Kör Somunlu Saplama (01 031801), Eksenel İspanyolet Kol Eloksallı (01 020501)
  - Rotoline Alu. AK-340 Naturel (01 020604), Kilitli Kol Forza Naturel Boyalı (01 040904)
  - Yaylı Kilitli Kol (01 032001), Metal C Kol Eloksallı (01 050301), Yaylı Tetik Kol Eloksallı (01 050401)
  - Tuba Çekme Kol Eloksallı (01 050401), Havuz Kol Naturel (01 050705), Brio Havuz Kol (05 011502/05 011510)
  - PLS Kit-AL Sürme Kol Aksesuar (01 120600)
- ALÜMİNYUM PENCERE VASİSTAS ÇARPMA VE MAKASLARI:
  - 13cm Vasistas Makası Eloksallı (01 080101), 22cm Vasistas Makası Eloksallı (01 080201)
  - 13cm İzo Vasistas Makası Eloksallı (01 080301), 22cm İzo Vasistas Makası Eloksallı (01 080401)
  - Vasistas Makası Çelik (01 081400), 13cm İzo Sac Vasistas Makası (01 080500)
  - Ayarlı Kademeli Makas 700–1200 (01 081000), Cephe Makası GSHD 10'' HD (01 100301)
  - Vasistas Çarpma Alm. Eloksallı (01 081501), Ayarlı Vasistas Çarpma Renkli Eloksallı (01 081704)
  - Kilit Karşılığı Eloksallı (01 060101), İzo Kilit Karşılığı Eloksallı (01 060301)
  - Oval Seri Kilit Karşılığı (01 060210), C 60 Kilit Karşılığı (01 060201)
- ALÜMİNYUM KAPI/PENCERE SÜRGÜLERİ:
  - Savyo Sürgü Eloksallı (01 070501) – 20/25mm
  - Ufak Zamak Sürgü Gri Boyalı (01 070103) – 20/25/30/35mm
  - Gömme Sürgü Eloksallı (01 070301) – 20/25mm
  - C 60 Çift Pimli Sürgü Eloksallı (01 070601) – 20/25/30/35mm
  - Uzun Zamak Sürgü Renkli (01 070203) – 20/25/30/35mm
  - Euro Zamak Sürgü Kısa Naturel B. (01 070153)
  - Fişek Sürgü Eloksallı (01 070401), Y.S Fişek Sürgü (01 071100), Kale 222 Elektrikli Kapi Karşılığı (03203-00)
- ALÜMİNYUM KAPI KİLİTLERİ:
  - Kale Süper 155/20U S.Makaralı Kilit (05 010200), Kale Süper 155/20U S.Makaralı Gövde (05 010402)
  - Kale Süper 153/20U Silindirli Dilli Kilit (05 010109), Kale Süper 153/20U Silindirli Dilli Gövde (05 010202)
  - Kale Süper 154 S.Makaralı 35mm Kilit (05 010100), Kale Süper 152/R Silindirli 35mm (05 010100)
  - Kale Fiom Emn.Kilit 157/F 3 (05 010701), Kale Silindirli Sürme Kilidi 201/F 20mm (05 010112/05 010114)
  - Kale PVC ALM Sürme Kilit 301/GRİ (05 010901), 302/GRİ (05 010905)
  - Kale 269/PWC-20 PVC Banyo Silindirli (05 010308), Kale 155/P 20 PVC Makaralı (05 010410)
  - Kale 153/P 20 PVC Silindirli (05 010303), Kale 164/CEC Tüpten Şifreli Silindir 68mm (05 011122)
  - Kale 197F Fotosel Kapi Emniyet Kilidi (05 010850), Tecmat Barel (05 021207)
  - Kale 269/WC 20 ALM Banyo WC Çarpma Kilit (05 010406), Kale 155/B Makaralı Alüminyum Kilit (05 010205)
  - Toros 35x85 ALM Kilidi (05 010415), Kale KD040/35-320 Topuzlu Kilit (01 160108)
  - Kale KD-070 Cam Kilitleri: 20-123 (11 030414), 20-125 (11 030419), 30-100 (11 030418), 20-124 Paraduş Menteşe (11 030420)
  - Kale Prazis 165 Kepenk Kilidi (05 011200), Kale 357/MS Kapi Otomatik Kilit Makaralı (05 010609)
  - Kale Süp.Cer. Barel 164/68 GMC (05 011113), 164/62 GNC (05 011101), 164/BNE Bilyalı Barel 68mm (05 011118)
  - Kale Elektrikli Kapi Karşılığı Y.S (05 011400), Kale Fiam Emn.Kilit 3 (05 010701)
- MONTAJ VİDALARI: Buldex Vida, İspanyolet Vida, Pop Perçin, Beton Montaj Dübelsiz Vida, Seyrek Diş Vida YHB, YSBMU, YHBMU, YSB, YHB; Çelik Dübelller; Civata Grubu

## AKSESUAR KATALOĞU: akpa-kupeste-katalogu.pdf
Kaynak: AKPA Alüminyum (www.akpaas.com.tr) – Alüminyum Küpeşte Profil ve Aksesuar Kataloğu 2019
- Firma bilgisi: 1987 İstanbul, CE/ISO 9001:2008/Qualicaat/Qualanod/Rosenheim belgeleri, 80.000 m² alan, 42.000 ton/yıl kapasite
- Q 40 SERİSİ – Alüminyum Kare ve Dikdörtgen Küpeşte Aksesuarları:
  - Dikme ve Profil Flanşları, Mafsal Bağlantıları, Dirsek ve Dönüş Bağlantıları
  - Kare Profil Bağlantı Bilezikleri, Tapa ve Dekorlu Tapalar, Emniyet Hattı Bağlantıları
  - Kare Profil Duvar Bağlantıları, Cam Tutamakları ve Spider Bağlantılar
  - Kare ve Lama Dikmeler
- Q 40 Aksesuar Ürünleri (ürün kodları ve açıklamaları):
  - SQ 10-01 / 07 061001: 40x40 Kare Dikme Flanşı (40x40 Square Strut Flange)
  - SQ 10-01-1 / 07 610011: 40x40 Kare Dikme 4 Delikli Duvar Flanşı
  - SQ 10-01-2 / 07 610012: 40x40 Kare Dikme 4 Delikli Duvar Flanşı (Uzun)
  - SQ 10-01-3 / 07 610013: 40x40 Kare Dikme U Flanş
  - SQ 10-01-4 / 07 610014: 50x25 Kare Dikme Flanşı
  - SQ 10-02 / 07 061002: 25x60 Kare 4 Delikli Boru Flanşı (50x25 ölçü)
  - SQ 10-03 / 07 061003: 25x60 2 Delikli Duvar Flanşı
  - SQ 10-04 / 07 061004: 25x60 2 Delikli Duvar Flanşı (alternatif)
  - SQ 10-05 / 07 061005: 25x60 Cam Kanallı 2 Delikli Duvar Flanşı (4096 profili için)
  - SQ 10-05-1 / 07 610051: 25x60 2 Delikli Cam Kanallı Duvar Flanşı (4893 profili için)
  - SQ 10-06 / 07 061006: 30x80 2 Delikli Duvar Flanşı
  - SQ 10-06-1 / 07 610061: 30x80 Cam Kanallı 2 Delikli Duvar Flanşı (4761 profili için)
  - SQ 10-07 / 07 061007: 30x80 2 Delikli Duvar Flanşı (alternatif)
  - SQ 10-07-1 / 07 610071: 30x80 Cam Kanallı 2 Delikli Duvar Flanşı (5990 profili için)
  - SQ 10-08 / 07 061008: 25x60 Duvar Bağlantı Tutamağı
  - SQ 10-09 / 07 061009: 70x70 Kare Baba Flanşı
  - SQ 10-10 / 07 061010: 32x25 Kare Profil Bağlantı Flanşı (5990 profili için)
  - SQ 10-11 / 07 061011: 25x60 Kare Boru Bağlantı Flanşı (4117 profili için)
  - SQ 10-12 / 07 061012: 14x14 Kare Profil Flanşı
  - SQ 10-13 / 07 061013: 25x60 Hareketli Duvar Flanşı (4162-4107-4096 profilleri için)
  - SQ 10-13-1 / 07 610131: 30x80 135° Hareketli Duvar Bağlantı Takımı
  - SQ 10-14 / 07 061014: 32x25 Hareketli Duvar Flanşı (5990 profili için)
  - SQ 10-15 / 07 061015: 32x25 Kare Profil Bağlantı Takozu (5990 profili için)
  - SQ 10-16 / 07 061016: 25x60 Kare Profil Bağlantı Takozu

## AKSESUAR KATALOĞU: alumat-katalog-small.pdf
Kaynak: ALUMAT – Alüminyum Aksesuar Kataloğu (Adobe Illustrator 29.8 ile oluşturulmuş, 2025; 58 sayfa)
- NOT: Bu PDF tamamen görsel/vektör tabanlı olup metin katmanı içermemektedir. OCR ile okunması gerekir.
- Katalog başlığı: "alumat-katalog-small" (metadata'dan)
- İçerik: 58 sayfalık alüminyum aksesuar kataloğu; her sayfada ürün görselleri ve muhtemelen aksesuar ürün kodları bulunmaktadır
- Daha fazla bilgi için doğrudan PDF görüntülenmesi veya ALUMAT firmasıyla iletişime geçilmesi önerilir

## AKSESUAR KATALOĞU: TITANAF / SIEGENIA - Pencere ve Kapı Kol Donanımı
Kaynak: titanaf_bgk_en.pdf – SIEGENIA TITAN AF Bileşenler Kataloğu (H12 / H4 / PVC / ALU16), 722 sayfa, 06.2019

### Genel Bilgi
- Üretici: SIEGENIA (Almanya)
- Ürün ailesi: TITAN AF – pencere, kapı ve konfor sistemleri için menteşe/kol donanımı
- Uyumlu profil malzemeleri: PVC, alüminyum (16 mm BAN), ahşap (12 mm ve 4 mm hava boşluklu)
- Standart referans: Gütegemeinschaft Schlösser und Beschläge e.V. yönergeleri
- Teknik dökümanlar: http://downloads.siegenia.com/

### Ürün Kategorileri
1. Menteşe Tarafı Parçaları: TITAN PVC/ALU16, TITAN (H) ahşap, Si-line (H) ahşap, axxent 24+, axxent SE
2. Köşe Tahrik ve Kilitleme Parçaları: Köşe tahrik mekanizmaları, kilitleme cıvataları
3. Dişli Kutular: Gear 15, Gear 7, İkincil kanat dişlisi 16, İkincil kanat dişlisi 8, Gear OS/PZ, Kapı dişlisi, DF dişli kutusu
4. Uzatma Parçaları ve Kol Parçaları
5. Aksesuarlar: GLOBE kol serisi, Si-line kol serisi, Çerçeve parçaları

### Profil Kesitleri
- Ahşap 12 mm: H45.TITPH20S001EN
- Ahşap 12 mm axxent 24+: H45.TITPH20S003EN
- Ahşap 4 mm: H45.TITPH40S001EN
- PVC: H45.TITPKF0S001EN
- Alüminyum 16 mm BAN: H45.TITPALU0S001EN

### Teknik Kısaltmalar
- BAN: Donanım oluğu (hardware groove)
- FBS: Yanlış kullanım önleme cihazı (anti-mishandling device)
- GS: Temel güvenlik / ES: Artırılmış güvenlik
- TAF: TITAN AF / TBT: Eğimden önce dönüş (Tilt-Before-Turn)
- HD: Ağır yük menteşe tarafı / MV: Merkez kilidi / RSA: Cıvata açıklığı
- H4: Ahşap 4 mm hava boşluğu / H12: Ahşap 12 mm hava boşluğu
- DFB: Sadece dönüş menteşesi / KD: Eğmeden önce dönüş (=TBT)
- PVC: Plastik profil / ALU: Alüminyum profil

### Açılma Tipleri
- Dikdörtgen döner-eğimli, döner, eğimli kanat
- 2 kanatlı döner-eğimli/döner kombinasyon
- Kemerli baş, yuvarlak baş, açılı ve üçgen döner-eğimli kanat

### Notlar
- Tüm boyutlar mm cinsinden nominal değer; tüm ağırlıklar maksimum kanat ağırlığına göredir
- Profil veri sayfaları, montaj talimatları, bakım ve kullanım talimatları katalogda mevcuttur

---

## AKSESUAR KATALOĞU: GİESSE
Kaynak: giesse.pdf – 178 sayfa

### Önemli Not
- Bu PDF tamamen görsel/taranmış (image-based) olup metin katmanı içermemektedir; OCR olmadan metin çıkarımı yapılamamıştır.
- Giesse: İtalyan menşeli kapı ve pencere aksesuarı üreticisi
- Ürün yelpazesi genel olarak: pencere/kapı menteşeleri, sürgü sistemleri, kilitleme mekanizmaları, alüminyum ve PVC profil donanımları
- Daha fazla bilgi için: www.giesse.com veya doğrudan PDF görüntülenmesi önerilir

---

## AKSESUAR KATALOĞU: HOPPE – Türkiye Ürün Kataloğu
Kaynak: HOPPE-Turkiye-Urun-Katalogu.pdf – 261 sayfa

### Genel Bilgi
- Üretici: HOPPE (Almanya/Avusturya)
- Kapsam: İç kapı kolları, HCS kompakt sistem, sürme kapı setleri, giriş kapıları için çekme kollar
- Ürün kategorileri: duravert (üstün), duraplus (premium), duranorm (ekonomik)
- Norm: DIN EN 1906, DIN 18273, DIN EN 179
- Resista yüzey: Renk kodunda "R" harfi olan tüm yüzeylerde koruyucu kaplama
- Teslim: Temel çeşitler 15 iş günü; Servis çeşitleri 5 iş günü

### 1. İÇ KAPI KOLLARI

#### duravert Serisi
- Athinai (Pirinç) – M156/19K/19KS | DIN EN 1906: 37-0140A | Renkler: F49/F69, F77-R/F52-R | Kapı: 35-72 mm | No: 2820820, 3054611
- Bergen (Pirinç) – M1602/18K/18KS | Renkler: F49/F9, F77-R/F52-R | Kapı: 35-51 mm | No: 3137782, 3137846
- Bruxelles (Pirinç) – M129/19K/19KS | Renkler: F41-R, F49-R/F98-R, F77-R, F77-R/F52-R | Kapı: 32-79 mm | No: 2821857, 2821822
- Monte Carlo (Pirinç) – M1550/25K/25KS | Renkler: F46-R, F65-R, F74-R, F75-R | Kapı: 35-74 mm | No: 2827407, 2826244
- Monte Carlo yarım takım (Pirinç) – M855/25HK/25K/25KVS/1550 | Dış taraf sabit kulp, iç taraf serbest kol | No: 2727511, 2727529

#### duraplus Serisi
- Amsterdam (Alüminyum) – 1400/42K/42KS | DIN EN 1906: 37-0140A
- Cannes (Pirinç) – M1545/23K/23KS | Renkler: F41-R, F49-R, F71, F72 | Kapı: 35-76 mm | No: 2822227, 2822180
- Dallas (Pirinç) – M1643/848N | HOPPE Hızlı BaglantiPlus, ince rozet 2 mm, vida gerektirmez | F42-R/F69 | Kapı: 35-45 mm | No: 3757375
  - Paslanmaz Çelik rozet: E848NS | F69 | No: 3758052
- Detroit (Alüminyum) – 1644F/52/52KVS | HOPPE Sertos baglanti | DIN EN 1906: 47-B130U | F1, F9 | No: 3583053, 3583176
  - Yangın kapısı: FS-1644F/52/52S | DIN 18273 + DIN EN 179 uyumlu | Antipanik seçeneği mevcut | No: 3577770, 3578051
  - Yarım takım (dış kapı iç tarafı): 1644/52 | Rozet montaj aparatlı | Alüminyum/ahşap/plastik kapılar için
- Houston (Pirinç) – M1623 | Los Angeles (Pirinç) – M1642 | Luxembourg – 199 | New York – 1810
- Paris (Alüminyum) – 137/42K/42KS | F1 | Kapı: 30-45 mm | No: 2246186, 523016
  - Paris (Alüminyum) – 138L/42K/42KS | F1 | Kapı: 35-45 mm | No: 3278999
  - Paris (Paslanmaz Çelik) – E138Z/353FL, E138Z/355FL | F69
- Stockholm (Alüminyum) – E1140 | Vancouver – 139
- Verona (Alüminyum/Paslanmaz Çelik/Pirinç) – 1510, M1515
- Vitória (Alüminyum) – 1515/42K/42KS | F1, F9 | Kapı: 37-77 mm | No: 2839969, 2840249
  - Vitória (Pirinç) – M1515/23K/23KS | F41-R, F49-R, F71, F72, F73, F77-R | Kapı: 32-79 mm
  - Vitória ince rozet/kendinden kilitli – M1515/29NR | F42-R/F69 | Vida gerektirmez | No: 3854298
  - Vitória ince rozet – M1515/29N | F69 | No: talep üzerine

#### duranorm Serisi (Ekonomik)
- Alta – E1433 | Baden – E1388 | Birmingham – 1117
- Dubayy – 1107 | Dublin – 1124 | Essen – E1555
- Maribor – 1766 | Utrecht – E1444

### 2. HCS – HOPPE COMPACT SYSTEM

- Kapı tipi: Binisiz ahşap kapılar (aksi belirtilmedikçe)
- Sistem gövdesi: Alüminyum döküm | Dil: Cam elyafıyla güçlendirilmiş plastik

#### duravert
- Athinai (Pirinç) – HCS M156S | F49/F69, F77-R/F52-R | Kilitsiz/SK-OL/Anahtar-Mandal/Anahtar-Anahtar varyantları | No: 2571042, 2570912
- Capri (Pirinç) – HCS M1950S | F49/F69 | No: 2492416
- Perth (Alüminyum) – HCS A1880 | F1-2/F9-2 | Engelli uyumlu RGSK/OL-15SEN varyantı | No: 2537119, 2537282
  - Cam kapı versiyonu: HCS GD A1880 | Cam kalınlığı 8-10 mm | No: 2537338

#### duraplus
- Atlanta (Alüminyum) – HCS A1530

### 3. SÜRME KAPI SETLERİ

#### duravert
- M462 (Pirinç) Set seçenekleri: Set 2 mandal/tapa (33-48 mm), Set 4 oda tipi, Set 5 kör, Set 7 asma mandal
  - Renkler: F41-R, F49-R, F49-R/F41-R (parlatılmış), F52-R/F77-R
  - No: Set 2 F41-R: 3207091; Set 4 F41-R: 3207171; Set 5 F41-R: 3207218; Set 7 F41-R: 3207138
- M463 (Pirinç) – Daha parlak yüzeyli varyant, Set 4/5/7 mevcuttur
  - No: Set 4 F41-R: 3207787; Set 5 F41-R: 3207832

### 4. GİRİŞ KAPILARI ÇEKME KOLLAR

#### duravert
- Monte Carlo (Pirinç) – M550LG | Yarımay form | 250 mm | F46-R, F65-R, F74-R, F75-R | No: 2301886, 2301894

#### duraplus
- Dallas/Vitória (Pirinç) – M543 | Düz form | 250 mm | F41-R, F49-R, F71, F77-R | No: 3391191, 3391174
- Vitória (Pirinç) – M515LG/23 | Yarımay formlu rozetli | 210 mm | F41-R, F49-R, F71, F72, F73, F77-R | No: 2844830
- Alüminyum düz – 5004: Ø25 mm, 330/210 mm | F1-2, F9-2 | No: 2345942
- Alüminyum düz dekoratif – 5004DR: uçlarda 2 oluk | No: 2346179
- Alüminyum üçgen – 5200: Ø25 mm, 300/350 mm | 5210: Ø30 mm, 300/350 mm | F1, F1-2
- Alüminyum yarımdaire – 5310: Ø30 mm, 300/350 mm | F1, F1-2
- Paslanmaz Çelik düz – E5011: Ø30/27 mm, 400–1800 mm | F69, F8901/F69 | Özel uzunluk mevcut | No: 6520605, 2010595, 2010624
- Paslanmaz Çelik 45 derece – E5012: Ø30/27 mm, 400–1800 mm | F69, F8901/F69 | No: 8124414, 2011053

### Renk Kodu Referansı
- F1/F1-2: Gümüş/Eloksal (Alüminyum) | F9/F9-2: Bronz/Koyu
- F41-R: Altın (Resista) | F46-R: Altın satine (Resista)
- F49/F49-R: Antik pirinç/mat altın | F52-R: Nikel satine (Resista)
- F65-R: Eski altın (Resista) | F69: Paslanmaz çelik görünüm
- F71: Eloksal bronz | F72/F73: Koyu bronz tonu
- F74-R/F75-R: Altın/pirinç yüzey (Resista) | F77-R: Nikel parlak (Resista) | F98-R: Özel renk (Resista)

### Secustik Pencere Kolları
- HOPPE pencere kolu serisi kapı kollarıyla uyumlu seri adı taşır
- Örnekler: M056/US937, M0545/US956, M0515/US956, M0550/US920, M029/US918, E038/US956, 038/US956, 0515/US956, 1515/273P
`

export default CATALOG_KNOWLEDGE
