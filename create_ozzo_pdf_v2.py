"""
OZZO Alüminyum — LinkedIn PDF
Gerçek görseller + Türkçe karakter destekli
"""
import os, shutil, fitz
from pathlib import Path
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer, Table,
                                 TableStyle, PageBreak, Image as RLImage, KeepTogether)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.graphics.shapes import Drawing, Rect, Circle, Line, String, Polygon
from reportlab.graphics import renderPDF
from reportlab.platypus.flowables import Flowable

# ── Fontlar (Türkçe desteği) ──────────────────────────────────────────────────
for name, paths in [
    ("Body", [r"C:\Windows\Fonts\calibri.ttf",  r"C:\Windows\Fonts\arial.ttf"]),
    ("Bold", [r"C:\Windows\Fonts\calibrib.ttf", r"C:\Windows\Fonts\arialbd.ttf"]),
    ("Italic",[r"C:\Windows\Fonts\calibrii.ttf",r"C:\Windows\Fonts\ariali.ttf"]),
]:
    for p in paths:
        if os.path.exists(p):
            pdfmetrics.registerFont(TTFont(name, p))
            break

# ── Renkler ───────────────────────────────────────────────────────────────────
DARK   = colors.HexColor("#0a0f1e")
NAVY   = colors.HexColor("#0d1630")
GOLD   = colors.HexColor("#c8a84b")
GOLDB  = colors.HexColor("#e8d080")
WHITE  = colors.white
GRAY   = colors.HexColor("#8090a0")
LGRAY  = colors.HexColor("#f4f6f9")
RED    = colors.HexColor("#e53535")
ORANGE = colors.HexColor("#f59e0b")
GREEN  = colors.HexColor("#10b981")
BLUE   = colors.HexColor("#3b82f6")

# ── Stil fabrikası ─────────────────────────────────────────────────────────────
_sc = 0
def S(font="Body", size=11, color=colors.black, leading=None,
      before=0, after=4, align=0, indent=0):
    global _sc; _sc += 1
    return ParagraphStyle(f"s{_sc}", fontName=font, fontSize=size,
                          textColor=color, leading=leading or size*1.42,
                          spaceBefore=before, spaceAfter=after,
                          alignment=align, leftIndent=indent)

# ── GoldLine ──────────────────────────────────────────────────────────────────
class GoldLine(Flowable):
    def wrap(self, w, *a): self._w = w; return w, 3
    def draw(self):
        self.canv.setStrokeColor(GOLD); self.canv.setLineWidth(1.8)
        self.canv.line(0, 1.5, self._w, 1.5)

# ── Görsel çıkarma ────────────────────────────────────────────────────────────
TMP = Path(r"C:\Users\ozan.aslan\.verdent\verdent-projects\Ozzoai-c348a679\OzzoAluminyumWebsite\_pdf_imgs")
TMP.mkdir(exist_ok=True)

def extract_images(pdf_path, max_count=3, min_w=200, min_h=150):
    """PDF'den kaliteli görseller çıkarır."""
    results = []
    try:
        doc = fitz.open(pdf_path)
        for page in doc:
            for img in page.get_images(full=True):
                xref = img[0]
                base = doc.extract_image(xref)
                if base["width"] < min_w or base["height"] < min_h:
                    continue
                ext  = base["ext"]
                name = TMP / f"{Path(pdf_path).stem}_{xref}.{ext}"
                with open(name, "wb") as f:
                    f.write(base["image"])
                results.append(str(name))
                if len(results) >= max_count:
                    return results
    except Exception as e:
        print(f"  ⚠ {pdf_path}: {e}")
    return results

def best_img(pdf_path, index=0, min_w=300):
    imgs = extract_images(pdf_path, max_count=index+3, min_w=min_w)
    if len(imgs) > index:
        return imgs[index]
    if imgs:
        return imgs[-1]
    return None

def rl_img(path, max_w=16*cm, max_h=9*cm):
    """ReportLab Image, oranı koruyarak."""
    if not path or not os.path.exists(path):
        return None
    try:
        img = RLImage(path)
        r   = img.imageWidth / img.imageHeight
        w   = min(max_w, max_h * r)
        h   = w / r
        if h > max_h:
            h = max_h; w = h * r
        img.drawWidth  = w
        img.drawHeight = h
        return img
    except:
        return None

# ── PDF kaynak dosyaları ──────────────────────────────────────────────────────
AKS_DIR = r"C:\Users\ozan.aslan\Desktop\AKS"
SIS_DIR = r"C:\Users\ozan.aslan\Desktop\Sistemler\Saray"

PDF_SOURCES = {
    # Aksesuarlar
    "hoppe":    os.path.join(AKS_DIR, "HOPPE-Turkiye-Urun-Katalogu.pdf"),
    "giesse":   os.path.join(AKS_DIR, "giesse.pdf"),
    "titanaf":  os.path.join(AKS_DIR, "titanaf_bgk_en.pdf"),
    "akpa_aks": os.path.join(AKS_DIR, "AKPA-AKSESUAR-1.pdf"),
    "kupeste":  os.path.join(AKS_DIR, "akpa-kupeste-katalogu.pdf"),
    # Cephe / Sistem
    "si57":     os.path.join(SIS_DIR, "SI 57.pdf"),
    "si58":     os.path.join(SIS_DIR, "SI 58.pdf"),
    "sg65":     os.path.join(SIS_DIR, "SG 65.pdf"),
    "ewt55":    os.path.join(SIS_DIR, "EWT 55.pdf"),
    "ewt60":    os.path.join(SIS_DIR, "EWT 60.pdf"),
    "ewt70":    os.path.join(SIS_DIR, "EWT 70.pdf"),
    "panorama": os.path.join(SIS_DIR, "PANORAMA.pdf"),
    "hss110":   os.path.join(SIS_DIR, "HSS 110.pdf"),
    "vertical": os.path.join(SIS_DIR, "VERTICAL _ Cladding Systems.pdf"),
    "cotta":    os.path.join(SIS_DIR, "Cotta.pdf"),
}

print("Görseller çıkarılıyor...")
IMGS = {}
for key, path in PDF_SOURCES.items():
    if os.path.exists(path):
        imgs = extract_images(path, max_count=4, min_w=250, min_h=180)
        IMGS[key] = imgs
        print(f"  ✓ {key}: {len(imgs)} görsel")
    else:
        IMGS[key] = []
        print(f"  ✗ {key}: dosya yok")

# ── Yardımcı: ilk geçerli görsel ─────────────────────────────────────────────
def pick(keys, idx=0, mw=16*cm, mh=8.5*cm):
    for k in keys:
        imgs = IMGS.get(k, [])
        if len(imgs) > idx:
            img = rl_img(imgs[idx], mw, mh)
            if img:
                return img
        if imgs:
            img = rl_img(imgs[-1], mw, mh)
            if img:
                return img
    return None

# ── PDF çıktı yolu ────────────────────────────────────────────────────────────
OUTPUT = os.path.join(os.path.expanduser("~"), "Desktop",
                      "OZZO_Aluminyum_LinkedIn.pdf")

doc = SimpleDocTemplate(
    OUTPUT, pagesize=A4,
    topMargin=0, bottomMargin=1.6*cm,
    leftMargin=1.8*cm, rightMargin=1.8*cm
)
W = A4[0] - 3.6*cm   # kullanılabilir genişlik
story = []

# ═══════════════════════════════════════════════════════════════════════════════
# KAPAK
# ═══════════════════════════════════════════════════════════════════════════════
# Koyu arkaplan bloğu
cov = Drawing(W, 21*cm)
bg = Rect(0, 0, W, 21*cm, fillColor=DARK, strokeColor=None)
bg.rx = 0; bg.ry = 0
cov.add(bg)
bot = Rect(0, 0, W, 5, fillColor=GOLD, strokeColor=None); cov.add(bot)
top = Rect(0, 21*cm-5, W, 5, fillColor=GOLD, strokeColor=None); cov.add(top)
# Dekoratif daireler
for cx,cy,r,c in [(W-50,21*cm-70,65,colors.HexColor("#1a2444")),
                   (55,75,42,colors.HexColor("#1a2444")),
                   (W-120,60,20,colors.HexColor("#142050")),
                   (90,21*cm-55,18,colors.HexColor("#142050"))]:
    circ = Circle(cx,cy,r,fillColor=c,strokeColor=None); cov.add(circ)
story.append(cov)
story.append(Spacer(1, -21*cm + 2.2*cm))

story.append(Paragraph("Alüminyum Doğrama", S("Bold",30,WHITE,40,align=1)))
story.append(Paragraph("& Cephe Sistemleri",  S("Bold",30,WHITE,40,align=1)))
story.append(Spacer(1, 0.45*cm))
story.append(GoldLine())
story.append(Spacer(1, 0.45*cm))
story.append(Paragraph("Hatalar  ·  Aksesuarlar  ·  Cephe  ·  Teknoloji",
                         S("Body",13,GOLDB,18,align=1)))
story.append(Spacer(1, 0.45*cm))
story.append(Paragraph(
    "Sektörde kalitenin, imalatın ve dijital dönüşümün kapsamlı rehberi",
    S("Body",11,colors.HexColor("#94a3b8"),16,align=1)))
story.append(Spacer(1, 1.4*cm))
story.append(Paragraph("OZZO Alüminyum",  S("Bold",15,GOLD,21,align=1)))
story.append(Paragraph("Mimarlık  ·  Teknik Danışmanlık  ·  Yazılım Çözümleri",
                         S("Body",9,GRAY,14,align=1)))
story.append(Paragraph("www.ozzoaluminyum.com  |  2025",
                         S("Body",9,GRAY,14,align=1)))
story.append(PageBreak())

# ═══════════════════════════════════════════════════════════════════════════════
# GİRİŞ
# ═══════════════════════════════════════════════════════════════════════════════
story.append(Spacer(1, 0.8*cm))
story.append(Paragraph("Giriş", S("Bold",18,DARK,24,before=10,after=6)))
story.append(GoldLine())
story.append(Spacer(1, 0.35*cm))
for t in [
    "Alüminyum doğrama ve giydirme cephe sistemleri; modern mimarinin vazgeçilmez unsurlarından "
    "biri haline gelmiştir. Hafifliği, dayanıklılığı ve estetik esnekliğiyle alüminyum; konutlardan "
    "ticari yapılara, ofis kulelerinden fabrika binalarına kadar her ölçekte tercih edilmektedir.",

    "Ancak bu sistemlerin uzun yıllar sorunsuz hizmet vermesi; yalnızca malzeme kalitesiyle değil — "
    "doğru imalat, doğru aksesuar seçimi ve titiz uygulama ile mümkündür. Bu rehber; sahada en sık "
    "karşılaşılan hataları, aksesuar montaj kritiklerini, giydirme cephe teknik zorunluluklarını ve "
    "dijital dönüşümün kalite süreçlerini nasıl iyileştirdiğini kapsamlı biçimde ele almaktadır.",
]:
    story.append(Paragraph(t, S("Body",10.5,colors.HexColor("#1a1a2e"),16,after=6)))

story.append(Spacer(1, 0.4*cm))
itbl = Table([
    [Paragraph("Bu Rehberde", S("Bold",10,WHITE,14)),
     Paragraph("Hedef Kitle",  S("Bold",10,WHITE,14))],
    [Paragraph("• En sık 8 imalat hatası\n• Aksesuar seçim kriterleri\n"
               "• Cephe U değerleri\n• Dijital kalite kontrol",
               S("Body",9.5,colors.HexColor("#374151"),14)),
     Paragraph("• Alüminyum imalatçılar\n• Mimarlar ve mühendisler\n"
               "• Proje yöneticileri\n• Kapı-pencere sektörü",
               S("Body",9.5,colors.HexColor("#374151"),14))],
], colWidths=[W/2, W/2])
itbl.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,0),NAVY),
    ("LINEABOVE",(0,0),(-1,0),2,GOLD),
    ("BACKGROUND",(0,1),(-1,1),LGRAY),
    ("TOPPADDING",(0,0),(-1,-1),9), ("BOTTOMPADDING",(0,0),(-1,-1),9),
    ("LEFTPADDING",(0,0),(-1,-1),12),
    ("BOX",(0,0),(-1,-1),0.5,GRAY),
]))
story.append(itbl)
story.append(PageBreak())

# ═══════════════════════════════════════════════════════════════════════════════
# BÖLÜM 1 — HATALAR
# ═══════════════════════════════════════════════════════════════════════════════
story.append(Spacer(1, 0.5*cm))
story.append(Paragraph("Bölüm 1 — En Sık Yapılan Hatalar", S("Bold",18,DARK,24,before=10,after=6)))
story.append(GoldLine())
story.append(Spacer(1, 0.35*cm))
story.append(Paragraph(
    "Alüminyum doğrama imalatında kalitenin temeli, üretim sürecinin her aşamasında standartlara "
    "uyulmasıyla sağlanır. Aşağıda sahada en sık karşılaşılan 8 kritik hata ve olası sonuçları "
    "detaylandırılmıştır.",
    S("Body",10.5,colors.HexColor("#1a1a2e"),16,after=8)))

# Gerçek görseller — sistem profillerinden
img1 = pick(["ewt55","si57","sg65"], 0, W, 9*cm)
img2 = pick(["ewt60","si58","ewt70"], 1, W, 9*cm)
if img1:
    story.append(img1)
    story.append(Paragraph("Alüminyum doğrama profil kesiti ve birleşim detayı",
                             S("Body",8.5,GRAY,12,align=1,after=8)))
if img2:
    story.append(img2)
    story.append(Paragraph("Profil köşe birleşimi ve conta yerleşimi detayı",
                             S("Body",8.5,GRAY,12,align=1,after=8)))

errors = [
    ("1","Profil Kesim ve Birleşim Hataları",RED,
     "Köşe birleşimlerinde tam 45° açı zorunludur. Açı sapmaları zamanla cam kırılmalarına "
     "ve su sızıntısına yol açar. İzin verilen tolerans: ±0,2 mm."),
    ("2","Conta ve Fitil Eksiklikleri",RED,
     "EPDM contalar ile fırça fitillerin eksiksiz yerleştirilmesi gerekir. Köşe birleşimlerinde "
     "vulkanize köşe parça kullanılmalıdır. Hedef: EN 12208 Sınıf 7A."),
    ("3","Cam Takma Hataları",ORANGE,
     "Yanlış konumlanan cam takozları, cam ağırlığını contaya aktarır; contanın erken bozulmasına "
     "neden olur. Takozlar alt profil sınır aralığında doğru konumlandırılmalıdır."),
    ("4","Drenaj Sistemi İhmali",RED,
     "Alt profillerdeki drenaj delikleri yapı köpüğüyle kapatılmamalıdır. Tıkanık drenaj; "
     "korozyon, kötü koku ve profil deformasyonuna neden olur. Her alt profilde en az 2 açık "
     "drenaj deliği bulunmalıdır."),
    ("5","Ankraj ve Montaj Hataları",RED,
     "Isıl genleşmeye izin vermek için slot (ovalik) delik kullanılmalıdır. Sabit delik "
     "ankrajlar mevsimsel sıcaklık farklarında profil çatlamasına yol açar. "
     "Minimum: her 600 mm'de bir ankraj noktası."),
    ("6","Termal Köprü Bozulması",ORANGE,
     "PA66 cam elyaf takviyeli ısıl köprü kesici bantlar profil imalatında hasar görmemelidir. "
     "Bant hasarı; profil yüzeyinde yoğuşma ve enerji kaybı yaratır. Hedef Uf: ≤1,8 W/m²K."),
    ("7","Yüzey Kaplama Hasarı",ORANGE,
     "Anodiz veya toz boya kaplamada darbeler ve çizikler kaplama bütünlüğünü bozar. "
     "Hasarlı yüzeyler korozyona açık hale gelir. Montaj sonrasına kadar koruma bantları "
     "sökülmemelidir."),
    ("8","Isıcam Birimi Hataları",ORANGE,
     "Spacer (ara profil) aralığının düzensizliği uzun vadede cam kararmasına neden olur. "
     "Tolerans: ±0,5 mm. Silika jel dolumu eksiksiz olmalı, EN 1279 standardına göre "
     "test edilmiş birimler kullanılmalıdır."),
]
for num,title,col,desc in errors:
    row = Table([[
        Paragraph(num,  S("Bold",13,WHITE,17,align=1)),
        Paragraph(title,S("Bold",10.5,DARK,15)),
        Paragraph(desc, S("Body",9.5,colors.HexColor("#374151"),14)),
    ]], colWidths=[0.8*cm, 4.4*cm, W-5.2*cm])
    row.setStyle(TableStyle([
        ("BACKGROUND",(0,0),(0,-1),col),
        ("BACKGROUND",(1,0),(-1,-1),LGRAY),
        ("LEFTPADDING",(0,0),(-1,-1),7),("RIGHTPADDING",(0,0),(-1,-1),8),
        ("TOPPADDING",(0,0),(-1,-1),8),("BOTTOMPADDING",(0,0),(-1,-1),8),
        ("VALIGN",(0,0),(-1,-1),"MIDDLE"),
        ("LINEBELOW",(0,0),(-1,-1),0.5,colors.HexColor("#e2e8f0")),
        ("LINELEFT",(1,0),(1,-1),2,col),
    ]))
    story.append(row)
    story.append(Spacer(1,2))
story.append(PageBreak())

# ═══════════════════════════════════════════════════════════════════════════════
# BÖLÜM 2 — AKSESUARLAR
# ═══════════════════════════════════════════════════════════════════════════════
story.append(Spacer(1, 0.5*cm))
story.append(Paragraph("Bölüm 2 — Aksesuarlar: Küçük Parça, Büyük Sorumluluk",
                         S("Bold",18,DARK,24,before=10,after=6)))
story.append(GoldLine())
story.append(Spacer(1, 0.35*cm))
story.append(Paragraph(
    "Menteşe, kol mekanizması, kilit ve pencere/kapı kolları; doğramenin günlük kullanım "
    "deneyimini doğrudan belirler. Aksesuar kalitesi ve doğru montaj göz ardı edildiğinde "
    "ortaya çıkan sorunlar, garanti kapsamındaki şikâyetlerin büyük bölümünü oluşturur.",
    S("Body",10.5,colors.HexColor("#1a1a2e"),16,after=10)))

# Gerçek aksesuar görselleri — 2 sütun layout
aks1 = pick(["hoppe"],   0, W/2-0.5*cm, 8*cm)
aks2 = pick(["giesse"],  0, W/2-0.5*cm, 8*cm)
aks3 = pick(["hoppe"],   1, W/2-0.5*cm, 8*cm)
aks4 = pick(["titanaf"], 0, W/2-0.5*cm, 8*cm)

def img_cell(img, caption):
    items = []
    if img:
        items.append(img)
    items.append(Paragraph(caption, S("Body",8,GRAY,11,align=1)))
    return items

img_rows = []
row1, row2 = [], []
if aks1: row1.append(img_cell(aks1, "HOPPE — Menteşe ve kol sistemleri"))
if aks2: row1.append(img_cell(aks2, "GIESSE — Yüksek güvenlikli aksesuar serisi"))
if aks3: row2.append(img_cell(aks3, "HOPPE — Kilit ve kapı kolu çeşitleri"))
if aks4: row2.append(img_cell(aks4, "TITANAF — Paslanmaz çelik aksesuar"))

for row in [row1, row2]:
    if len(row) == 2:
        tbl = Table([row], colWidths=[W/2-0.3*cm, W/2-0.3*cm],
                    spaceBefore=4, spaceAfter=4)
        tbl.setStyle(TableStyle([
            ("VALIGN",(0,0),(-1,-1),"TOP"),
            ("LEFTPADDING",(0,0),(-1,-1),3),("RIGHTPADDING",(0,0),(-1,-1),3),
        ]))
        story.append(tbl)
    elif len(row) == 1:
        for cell in row:
            for item in cell:
                story.append(item)

story.append(Spacer(1,0.4*cm))
acc_data = [
    [Paragraph("Aksesuar",       S("Bold",10,WHITE,14)),
     Paragraph("Kritik Standart",S("Bold",10,WHITE,14)),
     Paragraph("En Sık Hata",    S("Bold",10,WHITE,14)),
     Paragraph("Olası Sonuç",    S("Bold",10,WHITE,14))],
    ["Menteşe",      "HOPPE/GIESSE ±0,5mm", "Hizalama bozukluğu", "Kanat eğrilir, sıkışır"],
    ["Kol Mek.",     "SIEGENIA 3-4 Nm",     "Yanlış tork",        "Mekanizma arızası"],
    ["Gömme Kilit",  "Şablon zorunlu",      "1mm+ sapma",         "Kilitleme sağlanamaz"],
    ["Kapak/Kol",    "Yük kapasitesi",      "Yanlış vida",        "Kol salınımı"],
]
at = Table(acc_data, colWidths=[3*cm, 4.2*cm, 4*cm, W-11.2*cm])
at.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,0),NAVY),("LINEABOVE",(0,0),(-1,0),2,GOLD),
    ("FONTNAME",(0,1),(-1,-1),"Body"),("FONTSIZE",(0,1),(-1,-1),9.5),
    ("TOPPADDING",(0,0),(-1,-1),8),("BOTTOMPADDING",(0,0),(-1,-1),8),
    ("LEFTPADDING",(0,0),(-1,-1),10),
    ("ROWBACKGROUNDS",(0,1),(-1,-1),[WHITE,LGRAY]),
    ("BOX",(0,0),(-1,-1),0.5,GRAY),("GRID",(0,0),(-1,-1),0.3,colors.HexColor("#e2e8f0")),
]))
story.append(at)
story.append(Spacer(1,0.4*cm))

tip = Table([[
    Paragraph("💡  Uzman İpucu", S("Bold",10,GOLD,14)),
    Paragraph("Doğru aksesuar seçimi ve eksiksiz montaj, bir doğramenin ömrünü 10 yıldan "
              "25 yıla taşıyabilir. Aksesuar montajında şablon kullanımını kural haline getirin. "
              "Üretici kalibrasyon belgesi olan markalar tercih edilmelidir.",
              S("Body",9.5,DARK,14)),
]], colWidths=[3.5*cm, W-3.5*cm])
tip.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,-1),colors.HexColor("#fefce8")),
    ("LINEABOVE",(0,0),(-1,0),2,GOLD),("LINELEFT",(0,0),(0,-1),4,GOLD),
    ("TOPPADDING",(0,0),(-1,-1),10),("BOTTOMPADDING",(0,0),(-1,-1),10),
    ("LEFTPADDING",(0,0),(-1,-1),10),
    ("BOX",(0,0),(-1,-1),0.5,colors.HexColor("#fde68a")),
]))
story.append(tip)
story.append(PageBreak())

# ═══════════════════════════════════════════════════════════════════════════════
# BÖLÜM 3 — GİYDİRME CEPHE
# ═══════════════════════════════════════════════════════════════════════════════
story.append(Spacer(1, 0.5*cm))
story.append(Paragraph("Bölüm 3 — Giydirme Cephe Sistemleri",
                         S("Bold",18,DARK,24,before=10,after=6)))
story.append(GoldLine())
story.append(Spacer(1, 0.35*cm))
story.append(Paragraph(
    "Giydirme cepheler, büyük yapı projelerinde hem estetik hem enerji performansı açısından "
    "belirleyici rol üstlenir. Doğru sistem seçimi, doğru detay ve doğru montaj; binanın "
    "40–50 yıllık yaşam dönemini doğrudan etkiler.",
    S("Body",10.5,colors.HexColor("#1a1a2e"),16,after=10)))

# Gerçek cephe sistem görselleri
cep1 = pick(["hss110","vertical","panorama"], 0, W, 9*cm)
cep2 = pick(["si57","si58","sg65"],           0, W, 9*cm)
cep3 = pick(["cotta","ewt70","ewt55"],        1, W, 8*cm)

for img, cap in [(cep1,"HSS 110 / Vertical Cladding — Giydirme cephe sistem kesiti"),
                  (cep2,"SI 57 / SI 58 — Isı yalıtımlı cephe profil detayı"),
                  (cep3,"EWT Serisi — Sürme sistem profil kesiti")]:
    if img:
        story.append(img)
        story.append(Paragraph(cap, S("Body",8.5,GRAY,12,align=1,after=8)))

cephe_topics = [
    ("Rüzgar Yükü — TS EN 1991-1-4",
     "Türkiye'de temel rüzgar hızı bölgeye göre 25–32 m/s arasında değişir. "
     "qp(z) = ce(z) × qb formülü ile tepe basınç hesaplanır. Profil ve cam bağlantı "
     "sistemi minimum 2000 Pa pozitif ve negatif basınca dayanmalıdır (EN 12210 Sınıf C5)."),
    ("Isıl Performans",
     "TS 825 Bölge 1'de cephe sistemlerinde Uw ≤ 1,8 W/m²K hedeflenmektedir. "
     "PA66 cam elyaf takviyeli ısıl köprü kesici bantlar kritiktir. "
     "Low-E kaplamalı triple cam ile Uw = 0,8 W/m²K'e kadar inilebilir."),
    ("Spandrel Bölge Detayı",
     "Galvaniz tava + 50 mm taşyünü + alüminyum spandrel panel katmanlanması zorunludur. "
     "Bu detayın atlanması yangın yönetmeliği ihlali ve ciddi ısı kaybı anlamına gelir."),
    ("Stick – Unitize Sistem Seçimi",
     "Stick sistemler saha montajına dayalı; düşük yüksekliklerde tercih edilir. "
     "Unitize sistemler fabrikada üretilip sahaya hazır monte edilir — kalite kontrol çok "
     "daha etkin. 20 katın üzerindeki yapılarda unitize sistem şart olmaktadır."),
    ("Hava ve Su Sızdırmazlığı",
     "EN 12207 hava geçirgenlik Sınıf 4 (600 Pa'da max. 1,5 m³/h·m²) ve "
     "EN 12208 su sızdırmazlık Sınıf 9A hedeflenmelidir."),
]
for title, desc in cephe_topics:
    story.append(Paragraph(title, S("Bold",11.5,DARK,16,before=10,after=4)))
    story.append(Paragraph(desc,  S("Body",10,colors.HexColor("#374151"),15,after=4)))

story.append(Spacer(1,0.4*cm))
cert_data = [
    [Paragraph("Standart",    S("Bold",10,WHITE,14)),
     Paragraph("Kapsam",      S("Bold",10,WHITE,14)),
     Paragraph("Hedef Değer", S("Bold",10,WHITE,14))],
    ["EN 12207", "Hava geçirgenlik",     "Sınıf 4 (600 Pa)"],
    ["EN 12208", "Su sızdırmazlık",      "Sınıf 9A"],
    ["EN 12210", "Rüzgar yükü direnci",  "Sınıf C5 (2000 Pa)"],
    ["TS 825",   "Isınma standardı",     "Bölge 1: Uw ≤ 2,4 W/m²K"],
    ["EN 1279",  "Isıcam birimi",        "6 seviye basınç testi"],
]
ct = Table(cert_data, colWidths=[3.5*cm, 8*cm, W-11.5*cm])
ct.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,0),NAVY),("LINEABOVE",(0,0),(-1,0),2,GOLD),
    ("FONTNAME",(0,1),(-1,-1),"Body"),("FONTSIZE",(0,1),(-1,-1),9.5),
    ("TOPPADDING",(0,0),(-1,-1),8),("BOTTOMPADDING",(0,0),(-1,-1),8),
    ("LEFTPADDING",(0,0),(-1,-1),10),
    ("ROWBACKGROUNDS",(0,1),(-1,-1),[WHITE,LGRAY]),
    ("BOX",(0,0),(-1,-1),0.5,GRAY),("GRID",(0,0),(-1,-1),0.3,colors.HexColor("#e2e8f0")),
]))
story.append(ct)
story.append(PageBreak())

# ═══════════════════════════════════════════════════════════════════════════════
# BÖLÜM 4 — YAZILIM YATIRIMI
# ═══════════════════════════════════════════════════════════════════════════════
story.append(Spacer(1, 0.5*cm))
story.append(Paragraph("Bölüm 4 — Yazılım Yatırımı: Artık Bir Lüks Değil",
                         S("Bold",18,DARK,24,before=10,after=6)))
story.append(GoldLine())
story.append(Spacer(1, 0.35*cm))
story.append(Paragraph(
    "Alüminyum sektörü uzun yıllar boyunca kâğıt iş emirleri, sözlü koordinasyon ve "
    "tecrübeye dayalı kalite kontrolüyle yürütülmüştür. Ancak işin ölçeği büyüdükçe "
    "insan gözünün ve hafızasının sınırları, hata riskini kaçınılmaz biçimde artırmaktadır.",
    S("Body",10.5,colors.HexColor("#1a1a2e"),16,after=8)))

benefits = [
    ("Proje Bazlı Takip",
     "Her projenin doğramaları ayrı klasörde; kanat, usta, tarih — tümü kayıt altında."),
    ("Fotoğraf Tabanlı Kalite Kontrol",
     "Atölyede çekilen fotoğraf saniyeler içinde analiz edilir; hata varsa usta anında uyarılır."),
    ("Anlık Bildirim Sistemi",
     "Atölye ustasından proje sorumlusuna WhatsApp veya uygulama içinden gerçek zamanlı "
     "hata bildirimi gönderilir."),
    ("Otomatik PDF Rapor",
     "Müşteri için profesyonel kalite raporu tek tuşla oluşturulur; logo, tarih, imza hazır."),
    ("İstatistik ve Arşiv",
     "Hangi hata kaç kez tekrarlandı? Veriye dayalı süreç iyileştirmesi mümkün olur."),
]
for title, desc in benefits:
    row = Table([[
        Paragraph(title, S("Bold",10.5,DARK,15)),
        Paragraph(desc,  S("Body",9.5,colors.HexColor("#374151"),14)),
    ]], colWidths=[4.5*cm, W-4.5*cm])
    row.setStyle(TableStyle([
        ("BACKGROUND",(0,0),(-1,-1),LGRAY),
        ("VALIGN",(0,0),(-1,-1),"MIDDLE"),
        ("TOPPADDING",(0,0),(-1,-1),9),("BOTTOMPADDING",(0,0),(-1,-1),9),
        ("LEFTPADDING",(0,0),(-1,-1),12),
        ("LINEBELOW",(0,0),(-1,-1),0.5,colors.HexColor("#e2e8f0")),
        ("LINELEFT",(0,0),(0,-1),4,GOLD),
    ]))
    story.append(row)
    story.append(Spacer(1,2))

story.append(Spacer(1,0.5*cm))
story.append(Paragraph("Somut Kazanımlar — Rakamlarla",
                         S("Bold",12,DARK,17,before=8,after=6)))
roi_data = [
    [Paragraph("Karşılaştırma",      S("Bold",10,WHITE,14)),
     Paragraph("Geleneksel Yöntem",  S("Bold",10,WHITE,14)),
     Paragraph("Yazılım Destekli",   S("Bold",10,WHITE,14))],
    ["Hata tespiti",    "Montaj sonrası",         "Üretim sırasında"],
    ["Yeniden imalat",  "5.000–15.000 ₺/kanat",  "Önlenir"],
    ["Şikâyet süreci",  "3–7 gün",                "24 saat içinde"],
    ["Kalite raporu",   "1–2 saat manuel",         "Otomatik, 30 saniye"],
    ["Proje arşivi",    "Kâğıt klasör",            "Dijital, aranabilir"],
]
rt = Table(roi_data, colWidths=[5*cm, 5.5*cm, W-10.5*cm])
rt.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,0),NAVY),("LINEABOVE",(0,0),(-1,0),2,GOLD),
    ("FONTNAME",(0,1),(-1,-1),"Body"),("FONTSIZE",(0,1),(-1,-1),9.5),
    ("TOPPADDING",(0,0),(-1,-1),8),("BOTTOMPADDING",(0,0),(-1,-1),8),
    ("LEFTPADDING",(0,0),(-1,-1),10),
    ("ROWBACKGROUNDS",(0,1),(-1,-1),[WHITE,LGRAY]),
    ("BOX",(0,0),(-1,-1),0.5,GRAY),("GRID",(0,0),(-1,-1),0.3,colors.HexColor("#e2e8f0")),
    ("TEXTCOLOR",(2,1),(2,-1),GREEN),("FONTNAME",(2,1),(2,-1),"Bold"),
]))
story.append(rt)
story.append(PageBreak())

# ═══════════════════════════════════════════════════════════════════════════════
# KAPANIŞ
# ═══════════════════════════════════════════════════════════════════════════════
bg2 = Drawing(W, 20*cm)
b = Rect(0,0,W,20*cm,fillColor=DARK,strokeColor=None); bg2.add(b)
bg2.add(Rect(0,0,W,5,fillColor=GOLD,strokeColor=None))
bg2.add(Rect(0,20*cm-5,W,5,fillColor=GOLD,strokeColor=None))
for cx,cy,r,c in [(W-55,20*cm-75,70,colors.HexColor("#1a2444")),
                   (55,75,45,colors.HexColor("#1a2444"))]:
    cir = Circle(cx,cy,r,fillColor=c,strokeColor=None); bg2.add(cir)
story.append(bg2)
story.append(Spacer(1,-20*cm+1.8*cm))

story.append(Paragraph("Sonuç", S("Bold",24,WHITE,30,align=1)))
story.append(Spacer(1,0.4*cm))
story.append(GoldLine())
story.append(Spacer(1,0.6*cm))
story.append(Paragraph(
    "Dijital dönüşüm, büyük firmaların lüksü olmaktan çıkmış;\n"
    "rekabetçi kalmak isteyen her ölçekteki alüminyum işletmesinin\n"
    "stratejik zorunluluğu haline gelmiştir.",
    S("Body",12,colors.HexColor("#cbd5e1"),19,align=1)))
story.append(Spacer(1,0.5*cm))
story.append(Paragraph(
    "Teknolojiyi üretime entegre eden firmalar yalnızca hata oranını düşürmez —\n"
    "aynı zamanda kurumsal bir kimlik, izlenebilir bir süreç\n"
    "ve müşteri nezdinde güven inşa eder.\n"
    "Bu yatırım bir maliyet kalemi değil — büyümenin ve kalıcılığın temelidir.",
    S("Body",11,colors.HexColor("#94a3b8"),17,align=1)))
story.append(Spacer(1,0.9*cm))

stats_tbl = Table([[
    Paragraph("%40",  S("Bold",32,GOLD,38,align=1)),
    Paragraph("%70",  S("Bold",32,GOLD,38,align=1)),
    Paragraph("10x",  S("Bold",32,GOLD,38,align=1)),
],[
    Paragraph("Hata Azalması",    S("Body",9,GRAY,13,align=1)),
    Paragraph("Daha Hızlı Tespit",S("Body",9,GRAY,13,align=1)),
    Paragraph("Daha Hızlı Rapor", S("Body",9,GRAY,13,align=1)),
]], colWidths=[W/3]*3)
stats_tbl.setStyle(TableStyle([
    ("ALIGN",(0,0),(-1,-1),"CENTER"),
    ("TOPPADDING",(0,0),(-1,-1),4),("BOTTOMPADDING",(0,0),(-1,-1),4),
]))
story.append(stats_tbl)
story.append(Spacer(1,1*cm))
story.append(Paragraph("OZZO Alüminyum",
                         S("Bold",18,GOLD,24,align=1)))
story.append(Paragraph("Mimarlık  ·  Teknik Danışmanlık  ·  Yazılım Çözümleri",
                         S("Body",10,colors.HexColor("#94a3b8"),15,align=1)))
story.append(Spacer(1,0.3*cm))
story.append(Paragraph("www.ozzoaluminyum.com",
                         S("Body",11,GOLDB,16,align=1)))

# ── Build ──────────────────────────────────────────────────────────────────────
doc.build(story)
# Temp klasörü temizle
shutil.rmtree(TMP, ignore_errors=True)
print(f"\n✅ PDF oluşturuldu: {OUTPUT}")
