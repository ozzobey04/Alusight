/*
 * OZZO ALÜMİNYUM — Genel Bilgi Tabanı
 * Kaynaklar:
 *   1. Fuat Kulaberoğlu — "Cephelerde En Sık Yapılan Uygulama Hataları"
 *      Fatih Sultan Mehmet Vakıf Üniversitesi, Alüminyum Test Eğitim ve Araştırma Merkezi
 *      Alüminyum Yapı Sistemleri Test ve Eğitim Laboratuvarı Projesi, Aralık 2022
 *      WALL Cephe Danışmanlık, İstanbul Kalkınma Ajansı Destekli Proje (TR10/18/YMP/0038)
 */

export const knowledgeBase = [
  {
    source: "Fuat Kulaberoğlu Makale",
    category: "cephe_analizi",
    title: "Cephelerde En Sık Yapılan Uygulama Hataları",
    yazar: "Fuat Kulaberoğlu — WALL Cephe Danışmanlık",
    kurum: "Fatih Sultan Mehmet Vakıf Üniversitesi, Alüminyum Test Eğitim ve Araştırma Merkezi",
    tarih: "Aralık 2022",
    content: "Fuat Kulaberoğlu tarafından hazırlanan bu makale, giydirme cephe montajlarında en sık yapılan uygulama hatalarını kapsamlı biçimde ele almaktadır. Günümüzde cephe kaplaması olarak cam, alüminyum kompozit, GRC, doğal taş gibi çok sayıda malzeme kullanılmakta olup bu hatalar alüminyum giydirme cephe montajları üzerinden anlatılmıştır.",
    bolumler: [
      {
        baslik: "Cephe Ankrajlarında Yapılan Montaj Hataları",
        detay: "Giydirme cephe ankrajlarının kullanılacak profillerin hareketine izin verecek şekilde tasarlanarak uygulanması gerekmektedir. Alüminyum düşey profil üst kısımdan sabit delikli bir ankrajla betonarmeye bağlanmalıdır; bu ankraja malzeme (ölü) yükü ve rüzgar yükü birlikte etki eder. Orta ve alt kısımda dikey yönlü slot delikli ankrajlar kullanılmalı; bu ankraja yalnızca rüzgar yükü etki etmelidir.",
        hatalar: [
          "Üst ankrajda sabit delik yerine düşey slot delik kullanılması — cam montajı yapıldığında cephe profilinin aşağıya kaymasına yol açar.",
          "Düşey slot açılmasına rağmen bağlantı civatasının yanından başka bir vida atılarak cephe profilinin sabitlenmesi — profil hareketi engellenir.",
          "Bağlantı civatasının slot deliğin üstüne bağlanması — cephe profilinin yukarı hareketi engellenir."
        ],
        dogruUygulama: "Üst ankrajda sabit delik, altındaki rüzgar ankrajında düşey slot delik kullanılmalıdır."
      },
      {
        baslik: "Farklı Nedenlerle Hatalı Yapılan Ankraj Montajları",
        detay: "Ankrajlarda kullanılan dübellerin teknik spesifikasyonlarında betonarme döşemenin kenarından ne kadar içeride kullanılması gerektiği belirtilmiştir (genel kanı: dübel çapı x 10). Uygulamalarda bu ölçülere uyulmadığı gözlemlenmiştir.",
        hatalar: [
          "Bağlantı civatasının alüminyum düşey profil üzerinde kenara çok yakın noktaya bağlanması — bağlantı noktası statik hesap sonucu belirlenmeli.",
          "Bağlantı civatası yanlış delikten bağlanması — üst kısımda sabit delikli ankraja asılan cephe profili, alt tarafta slot delikli ankraj ile bağlanmalıdır.",
          "Dübellerin betonarme döşeme kenarına gereğinden yakın konumlandırılması."
        ]
      },
      {
        baslik: "Yatay-Düşey Profil Birleşimlerinde Yapılan Uygulama Hataları",
        detay: "Yatay-düşey profil birleşimlerinde 5mm contalı birleşim, 2mm contalı birleşim ve contasız birleşim olmak üzere üç tip birleşim bulunmaktadır. Her birleşim tipinde farklı uygulama hataları gözlemlenmektedir.",
        hatalar: [
          "5mm contalı birleşimlerde conta eksikliği veya hatalı conta yerleşimi.",
          "Yatay-düşey profil birleşimlerinde yastık fitil kullanımında yapılan hatalar.",
          "Contasız birleşimlerde gerekli sızdırmazlık önlemlerinin alınmaması."
        ],
        dogruUygulama: "Birleşim tipine uygun conta ve fitil kullanılmalı; yastık fitil doğru konumda uygulanmalıdır."
      },
      {
        baslik: "Spandrel Bölgelerde Yapılan İmalat Hataları",
        detay: "Spandrel bölgeler, bina cephesinde kat döşemeleri arasındaki opak bantları oluşturmaktadır. Bu bölgelerdeki galvaniz tava, silikon ve taşyünü uygulamalarında ciddi hatalar gözlemlenmektedir.",
        hatalar: [
          "Ankraj bölgelerinde galvaniz kertmelerin hatalı yapılması.",
          "Spandrel bölge galvaniz tavaların etrafındaki silikon uygulamalarının yetersiz veya hatalı yapılması.",
          "Spandrel bölge taşyünü uygulamalarında doğru uygulama yerine hatalı montaj yapılması."
        ],
        dogruUygulama: "Galvaniz tavalar ankraj bölgelerinde doğru kertilmeli, silikon uygulamaları eksiksiz yapılmalı, taşyünü doğru pozisyon ve sıkıştırmayla uygulanmalıdır."
      },
      {
        baslik: "Duman Kesici ve Şap Altı Sac İmalatlarında Yapılan Hatalar",
        detay: "Şap altı ve duman kesici galvaniz saclarda yapılan imalat hataları yangın güvenliği ve su yalıtımı açısından kritik önem taşımaktadır.",
        hatalar: [
          "Galvaniz saclarda boyut ve şekil hataları.",
          "Duman kesici saclarda sızdırmazlık boşluklarının bırakılması.",
          "Şap altı sacların yetersiz bindirme ile uygulanması."
        ],
        dogruUygulama: "Doğru boyutlarda imalat yapılmalı, duman kesici ve şap altı saclar sızdırmaz biçimde uygulanmalıdır."
      },
      {
        baslik: "Cephe Kenar Yalıtımlarında Yapılan Uygulama Hataları",
        detay: "Cephe kenar yalıtımı membran uygulamaları su sızdırmazlığı için kritiktir. Bu bölgelerdeki hatalar uzun vadeli cephe hasarlarının başlıca nedenlerinden biridir.",
        hatalar: [
          "Membran uygulamalarında yeterli örtüşme (bindirme) bırakılmaması.",
          "Kenar detaylarında membranın eksik veya yanlış uygulanması.",
          "Köşe ve geçiş bölgelerinde membran sürekliliğinin sağlanamaması."
        ],
        dogruUygulama: "Membran uygulamaları üretici talimatlarına uygun yapılmalı, köşe ve geçiş bölgelerinde özel detaylar dikkate alınmalıdır."
      },
      {
        baslik: "Cephe Dilatasyon Uygulamalarında Yapılan Hatalar",
        detay: "Dilatasyon derzi bölgeleri termal genleşme ve yapısal hareket nedeniyle özel önem gerektiren noktalardır.",
        hatalar: [
          "Dilatasyon bölgelerinde profil boşluklarının yalıtılmaması.",
          "Dilatasyon derzlerinin yetersiz genişlikte bırakılması.",
          "Dilatasyon bölgelerinde sızdırmazlık malzemesinin kullanılmaması veya hatalı uygulanması."
        ],
        dogruUygulama: "Dilatasyon bölgelerinde profil boşlukları mutlaka yalıtılmalı, uygun genişlik ve sızdırmazlık malzemesi kullanılmalıdır."
      },
      {
        baslik: "İç Cam Fitillerinde Yapılan Uygulama Hataları",
        detay: "İç cam fitilleri cam ile profil arasındaki sızdırmazlığı sağlayan kritik elemanlardır. Köşe birleşimleri ve fitil ekleme noktaları özellikle hassas bölgelerdir.",
        hatalar: [
          "İç cam fitillerinde köşe birleşimlerinin vulkaniz parçalar yerine düz kesilmiş fitillerle yapılması — köşe sızdırmazlığı sağlanamaz.",
          "Fitil birleşim noktalarında yalıtım uygulanmaması — su ve hava sızıntısı meydana gelir.",
          "Yanlış fitil profili seçimi."
        ],
        dogruUygulama: "İç cam fitillerinde köşe birleşimleri mutlaka vulkaniz (fabrikasyon köşe) parçalarla yapılmalı; fitil birleşim noktaları sızdırmazlık malzemesiyle yalıtılmalıdır."
      }
    ],
    genelOzet: "Bu makale, alüminyum giydirme cephe sistemlerinde saha uygulamalarında karşılaşılan en yaygın hataları sekiz ana başlık altında incelemektedir: (1) Ankraj montaj hataları — sabit/slot delik yanlış kullanımı, (2) Farklı ankraj montaj hataları — düşel mesafe ve vida yeri hataları, (3) Yatay-düşey profil birleşim hataları — conta ve fitil sorunları, (4) Spandrel bölge imalat hataları — galvaniz tava, silikon ve taşyünü sorunları, (5) Duman kesici ve şap altı sac hataları, (6) Kenar yalıtımı membran hataları, (7) Dilatasyon uygulama hataları, (8) İç cam fitili hataları — vulkaniz köşe parça eksikliği. Makale, her hata tipini fotoğraf destekli, doğru ve yanlış uygulama karşılaştırmasıyla anlatmaktadır.",
    anahtarKelimeler: [
      "giydirme cephe", "alüminyum cephe", "ankraj montaj hataları", "slot delik", "sabit delik",
      "rüzgar ankrajı", "düşey profil", "yatay profil", "conta", "fitil", "vulkaniz köşe",
      "spandrel bölge", "galvaniz tava", "taşyünü", "duman kesici", "şap altı sac",
      "kenar yalıtımı", "membran", "dilatasyon derzi", "iç cam fitili", "cephe uygulama hataları",
      "WALL Cephe Danışmanlık", "FSM Vakıf Üniversitesi", "aluteam"
    ]
  }
];
