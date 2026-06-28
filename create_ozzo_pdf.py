import os, unicodedata
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm, mm
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer, Table,
                                 TableStyle, PageBreak, HRFlowable, KeepTogether)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.graphics.shapes import (Drawing, Rect, Circle, Line, String, Polygon)
from reportlab.graphics import renderPDF
from reportlab.platypus.flowables import Flowable

def RoundedRect(x, y, w, h, r=0, **kw):
    rect = Rect(x, y, w, h, **kw)
    rect.rx = r; rect.ry = r
    return rect

# ── Font kayit ──────────────────────────────────────────────────────────────
FONT_PATHS = [
    r"C:\Windows\Fonts\calibri.ttf",
    r"C:\Windows\Fonts\arial.ttf",
    r"C:\Windows\Fonts\segoeui.ttf",
]
BOLD_PATHS = [
    r"C:\Windows\Fonts\calibrib.ttf",
    r"C:\Windows\Fonts\arialbd.ttf",
    r"C:\Windows\Fonts\segoeuib.ttf",
]
def reg(name, paths):
    for p in paths:
        if os.path.exists(p):
            pdfmetrics.registerFont(TTFont(name, p))
            return True
    return False

reg("Body", FONT_PATHS)
reg("Bold", BOLD_PATHS)

# ── Renkler ──────────────────────────────────────────────────────────────────
DARK      = colors.HexColor("#0a0f1e")
NAVY      = colors.HexColor("#0d1630")
GOLD      = colors.HexColor("#c8a84b")
GOLD_LIGHT= colors.HexColor("#e8d080")
WHITE     = colors.white
GRAY      = colors.HexColor("#8090a0")
LIGHT_BG  = colors.HexColor("#f4f6f9")
RED       = colors.HexColor("#e53535")
ORANGE    = colors.HexColor("#f59e0b")
GREEN     = colors.HexColor("#10b981")
BLUE      = colors.HexColor("#3b82f6")

def N(t):
    return unicodedata.normalize("NFC", t)

# ── Stiller ──────────────────────────────────────────────────────────────────
def S(name, font="Body", size=11, color=colors.black, leading=None,
      spaceBefore=0, spaceAfter=0, alignment=0, leftIndent=0):
    return ParagraphStyle(name, fontName=font, fontSize=size,
                          textColor=color, leading=leading or size*1.4,
                          spaceBefore=spaceBefore, spaceAfter=spaceAfter,
                          alignment=alignment, leftIndent=leftIndent)

sTitle   = S("Title",   "Bold", 28, WHITE,     38, alignment=1)
sSub     = S("Sub",     "Body", 13, GOLD_LIGHT, 18, alignment=1)
sChap    = S("Chap",    "Bold", 18, DARK,       24, spaceBefore=18, spaceAfter=6)
sHead    = S("Head",    "Bold", 13, DARK,       18, spaceBefore=12, spaceAfter=4)
sBody    = S("Body",    "Body", 10.5, colors.HexColor("#1a1a2e"), 16, spaceAfter=4)
sBodyWh  = S("BodyWh",  "Body", 10.5, WHITE,    16, spaceAfter=3)
sBullet  = S("Bullet",  "Body", 10.5, colors.HexColor("#1a1a2e"), 15,
             spaceAfter=3, leftIndent=14)
sCaption = S("Caption", "Body", 9, GRAY, 12, spaceAfter=6, alignment=1)
sSmall   = S("Small",   "Body", 9, GRAY, 12)
sTagline = S("Tag",     "Bold", 11, GOLD, 15, alignment=1)

# ── Yardimci Flowable'lar ─────────────────────────────────────────────────────
class GoldLine(Flowable):
    def __init__(self, w=None): self.w = w
    def wrap(self, avail, *a): self._w = self.w or avail; return self._w, 3
    def draw(self):
        c = self.canv; c.setStrokeColor(GOLD); c.setLineWidth(1.5)
        c.line(0, 1.5, self._w, 1.5)

# ── Diyagram: Pencere Profil Kesit ──────────────────────────────────────────
def window_section_diagram():
    d = Drawing(460, 280)
    d.add(Rect(0, 0, 460, 280, 8, fillColor=colors.HexColor("#f8fafc"),
                       strokeColor=colors.HexColor("#e2e8f0"), strokeWidth=1))
    frame_color = colors.HexColor("#6b7280")
    # Dis cerceve
    d.add(Rect(50,30,360,210, fillColor=colors.HexColor("#d1d5db"),
               strokeColor=frame_color, strokeWidth=2))
    # Cam alani
    d.add(Rect(75,55,310,160, fillColor=colors.HexColor("#bfdbfe"),
               strokeColor=colors.HexColor("#93c5fd"), strokeWidth=1))
    # Kanat profili
    d.add(Rect(68,48,324,174, fillColor=None,
               strokeColor=colors.HexColor("#374151"), strokeWidth=2.5))
    # Conta - yesil cizgiler
    d.add(Line(75,220,385,220, strokeColor=GREEN, strokeWidth=3))
    d.add(Line(75,48,75,220,  strokeColor=GREEN, strokeWidth=3))
    d.add(Line(385,48,385,220,strokeColor=GREEN, strokeWidth=3))
    d.add(Line(75,48,385,48,  strokeColor=GREEN, strokeWidth=3))
    # Cam takozlar - altin
    d.add(Rect(120,49,28,10, fillColor=GOLD, strokeColor=None))
    d.add(Rect(312,49,28,10, fillColor=GOLD, strokeColor=None))
    # Drenaj deligi - mavi
    d.add(Circle(230, 32, 7, fillColor=BLUE, strokeColor=WHITE, strokeWidth=1))
    d.add(String(218, 14, N("Drenaj"), fontSize=8, fontName="Helvetica", fillColor=BLUE))
    # Ankraj noktalari
    d.add(Circle(50, 135, 9, fillColor=ORANGE, strokeColor=WHITE, strokeWidth=1))
    d.add(Circle(410, 135, 9, fillColor=ORANGE, strokeColor=WHITE, strokeWidth=1))
    # Etiketler
    d.add(String(195, 125, N("Isicam"), fontSize=10,
                  fontName="Helvetica-Bold", fillColor=colors.HexColor("#1e40af")))
    d.add(String(395, 215, N("Conta"), fontSize=8,
                  fontName="Helvetica", fillColor=GREEN))
    d.add(String(115, 33, N("Cam takoz"), fontSize=8,
                  fontName="Helvetica", fillColor=colors.HexColor("#92400e")))
    d.add(String(415, 130, N("Ankraj"), fontSize=8,
                  fontName="Helvetica", fillColor=ORANGE))
    # Baslik
    d.add(String(130, 262, N("Sekil 1 - Aluminyum Pencere Profil Kesit Semasi"),
                  fontSize=9.5, fontName="Helvetica-Bold",
                  fillColor=colors.HexColor("#374151")))
    return d

# ── Diyagram: Hata Haritasi ──────────────────────────────────────────────────
def error_map_diagram():
    d = Drawing(460, 290)
    d.add(Rect(0,0,460,290,8, fillColor=colors.HexColor("#f8fafc"),
                       strokeColor=colors.HexColor("#e2e8f0"), strokeWidth=1))
    # Pencere cercevesi
    d.add(Rect(60,45,340,210, fillColor=colors.HexColor("#e5e7eb"),
               strokeColor=colors.HexColor("#374151"), strokeWidth=2.5))
    d.add(Rect(82,67,296,166, fillColor=colors.HexColor("#dbeafe"),
               strokeColor=colors.HexColor("#93c5fd"), strokeWidth=1.5))
    # Orta dikey profil
    d.add(Line(230,45,230,255, strokeColor=colors.HexColor("#374151"), strokeWidth=2))

    errors = [
        (60,  150, RED,    "1"),
        (400, 150, RED,    "2"),
        (60,  45,  ORANGE, "3"),
        (400, 45,  ORANGE, "4"),
        (230, 47,  RED,    "5"),
        (82,  230, ORANGE, "6"),
        (356, 230, ORANGE, "7"),
        (230, 220, RED,    "8"),
    ]
    for x,y,col,num in errors:
        d.add(Circle(x,y,11, fillColor=col, strokeColor=WHITE, strokeWidth=1.5))
        d.add(String(x-4,y-4, num, fontSize=8,
                     fontName="Helvetica-Bold", fillColor=WHITE))

    # Legend
    legend = [(RED,"Kritik Hata"),(ORANGE,"Uyari"),(BLUE,"Kontrol Noktasi")]
    for i,(col,lbl) in enumerate(legend):
        lx = 70 + i*130
        d.add(Circle(lx,18,7, fillColor=col, strokeColor=None))
        d.add(String(lx+10,14, lbl, fontSize=8,
                     fontName="Helvetica", fillColor=colors.HexColor("#374151")))

    d.add(String(130, 272, N("Sekil 2 - Pencere Hata Noktalari Haritasi"),
                  fontSize=9.5, fontName="Helvetica-Bold",
                  fillColor=colors.HexColor("#374151")))
    return d

# ── Diyagram: Aksesuar ───────────────────────────────────────────────────────
def accessory_diagram():
    d = Drawing(460, 200)
    d.add(Rect(0,0,460,200,8, fillColor=colors.HexColor("#f8fafc"),
                       strokeColor=colors.HexColor("#e2e8f0"), strokeWidth=1))
    parts = [
        (25,  55, 85, 95, colors.HexColor("#cbd5e1"), "Kol"),
        (140, 55, 85, 95, colors.HexColor("#bfdbfe"), N("Mentese")),
        (255, 55, 85, 95, colors.HexColor("#bbf7d0"), "Kilit"),
        (365, 55, 70, 95, colors.HexColor("#fde68a"), "Kapak"),
    ]
    for x,y,w,h,col,lbl in parts:
        d.add(Rect(x,y,w,h,8, fillColor=col,
                           strokeColor=colors.HexColor("#94a3b8"), strokeWidth=1.2))
        d.add(String(x+w//2-16, y+h//2-5, lbl, fontSize=10,
                      fontName="Helvetica-Bold", fillColor=colors.HexColor("#1e293b")))
    # Oklar
    for x in [116,231,346]:
        d.add(Line(x+2,102,x+16,102, strokeColor=GRAY, strokeWidth=2))
        d.add(Polygon([x+16,106,x+16,98,x+23,102], fillColor=GRAY, strokeColor=None))
    # Uyari isaretleri
    d.add(Circle(65, 148, 9, fillColor=RED, strokeColor=WHITE, strokeWidth=1.2))
    d.add(String(62,145,"!",fontSize=9,fontName="Helvetica-Bold",fillColor=WHITE))
    d.add(String(20,160,N("Yanlis tork"),fontSize=8,fontName="Helvetica",fillColor=RED))

    d.add(Circle(180,55,9,fillColor=ORANGE,strokeColor=WHITE,strokeWidth=1.2))
    d.add(String(177,52,"!",fontSize=9,fontName="Helvetica-Bold",fillColor=WHITE))
    d.add(String(145,38,N("Hizalama"),fontSize=8,fontName="Helvetica",fillColor=ORANGE))

    d.add(String(130, 182, N("Sekil 3 - Aksesuar Montaj Kontrol Semasi"),
                  fontSize=9.5, fontName="Helvetica-Bold",
                  fillColor=colors.HexColor("#374151")))
    return d

# ── Diyagram: U-Deger Grafigi ────────────────────────────────────────────────
def u_value_chart():
    d = Drawing(460, 210)
    d.add(Rect(0,0,460,210,8, fillColor=colors.HexColor("#f8fafc"),
                       strokeColor=colors.HexColor("#e2e8f0"), strokeWidth=1))
    bars = [
        (N("Yalitimli Profil + Low-E Triple"), 0.8,  GREEN),
        (N("Isil Yalitimli Profil + Low-E"),   1.4,  GREEN),
        (N("Isil Yalitimli Profil + Isicam"),  1.8,  GREEN),
        (N("TS 825 Siniri (Bolge 1)"),          2.4,  ORANGE),
        (N("Std. Profil + Isicam"),             2.9,  ORANGE),
        (N("Std. Profil + Tekli Cam"),          5.7,  RED),
    ]
    max_val = 6.2
    bar_h   = 22
    gap     = 6
    x0      = 210
    chart_w = 200
    for i,(lbl,val,col) in enumerate(bars):
        y = 165 - i*(bar_h+gap)
        bw = (val/max_val)*chart_w
        d.add(Rect(x0,y,bw,bar_h, fillColor=col, strokeColor=None))
        d.add(String(x0-5,y+6, lbl, fontSize=7.5,
                      fontName="Helvetica", fillColor=colors.HexColor("#1e293b"),
                      textAnchor="end"))
        d.add(String(x0+bw+4,y+6, f"{val}", fontSize=8.5,
                      fontName="Helvetica-Bold", fillColor=col))
    ts_x = x0+(2.4/max_val)*chart_w
    d.add(Line(ts_x,12,ts_x,175,strokeColor=ORANGE,strokeWidth=1.5,strokeDashArray=[4,3]))
    d.add(String(ts_x+3,12,"TS 825 Siniri",fontSize=7,
                  fontName="Helvetica-Bold",fillColor=ORANGE))
    d.add(String(130,192, N("Sekil 4 - U Degeri Karsilastirmasi (W/m2K)"),
                  fontSize=9.5,fontName="Helvetica-Bold",fillColor=colors.HexColor("#374151")))
    return d

# ── Diyagram: Yazilim Akis ───────────────────────────────────────────────────
def software_flow():
    d = Drawing(460, 190)
    d.add(Rect(0,0,460,190,10, fillColor=DARK, strokeColor=None))
    d.add(Rect(0,0,460,4, fillColor=GOLD, strokeColor=None))
    d.add(Rect(0,186,460,4, fillColor=GOLD, strokeColor=None))

    steps = [
        (25,  75, GOLD,  N("Proje\nAc")),
        (135, 75, BLUE,  N("Profil\nTara")),
        (245, 75, RED,   N("Hata\nTespit")),
        (355, 75, GREEN, N("Bildirim\nGonder")),
    ]
    for x,y,col,lbl in steps:
        d.add(Circle(x+35,y+30,30, fillColor=col, strokeColor=WHITE, strokeWidth=2))
        lines = lbl.split("\n")
        for j,line in enumerate(lines):
            d.add(String(x+35-18,y+36-j*13, line, fontSize=9,
                          fontName="Helvetica-Bold", fillColor=WHITE))

    for x in [98,208,318]:
        d.add(Line(x+2,105,x+20,105, strokeColor=GOLD, strokeWidth=2))
        d.add(Polygon([x+20,109,x+20,101,x+27,105], fillColor=GOLD, strokeColor=None))

    subs = [N("Proje klasoru"), N("Kamera ile"), N("Yapay Zeka"), N("WhatsApp/Uygulama")]
    xs   = [25,135,245,355]
    for x,s in zip(xs,subs):
        d.add(String(x+35-25,62, s, fontSize=7.5,
                      fontName="Helvetica", fillColor=GRAY))

    d.add(String(105,168, N("Sekil 5 - OzzoSef Akilli Fabrikasyon Kontrol Akisi"),
                  fontSize=9.5, fontName="Helvetica-Bold", fillColor=GOLD))
    return d

# ════════════════════════════════════════════════════════════════════════════
# PDF OLUSTUR
# ════════════════════════════════════════════════════════════════════════════
OUTPUT = os.path.join(os.path.expanduser("~"), "Desktop", "OZZO_Aluminyum_LinkedIn.pdf")

doc = SimpleDocTemplate(
    OUTPUT, pagesize=A4,
    topMargin=0, bottomMargin=1.5*cm,
    leftMargin=1.8*cm, rightMargin=1.8*cm
)

story = []

# ─── KAPAK ───────────────────────────────────────────────────────────────────
cover = Drawing(A4[0]-3.6*cm, 22*cm)
cover.add(Rect(0,0,A4[0]-3.6*cm,22*cm,0, fillColor=DARK,strokeColor=None))
cover.add(Rect(0,0,A4[0]-3.6*cm,4,fillColor=GOLD,strokeColor=None))
cover.add(Rect(0,22*cm-4,A4[0]-3.6*cm,4,fillColor=GOLD,strokeColor=None))
cover.add(Circle(A4[0]-3.6*cm-50,22*cm-70,60,
                  fillColor=colors.HexColor("#1a2444"),strokeColor=None))
cover.add(Circle(50,70,40, fillColor=colors.HexColor("#1a2444"),strokeColor=None))
# Dekoratif kucuk daireler
for cx,cy,r in [(380,280,20),(50,320,15),(340,80,12)]:
    cover.add(Circle(cx,cy,r, fillColor=colors.HexColor("#1a3060"),strokeColor=None))
story.append(cover)
story.append(Spacer(1,-22*cm+2.2*cm))

story.append(Paragraph(N("Aluminyum Dograma"), sTitle))
story.append(Paragraph(N("& Cephe Sistemleri"), sTitle))
story.append(Spacer(1,0.5*cm))
story.append(GoldLine())
story.append(Spacer(1,0.5*cm))
story.append(Paragraph(N("Hatalar  ·  Aksesuarlar  ·  Cephe  ·  Teknoloji"),
                         S("Sub1","Body",13,GOLD_LIGHT,18,alignment=1)))
story.append(Spacer(1,0.5*cm))
story.append(Paragraph(
    N("Sektorde kalitenin, imalatin ve dijital donusumun kapsamli rehberi"),
    S("Sub2","Body",11,colors.HexColor("#94a3b8"),16,alignment=1)))
story.append(Spacer(1,1.5*cm))
story.append(Paragraph(N("OZZO Aluminyum"), S("Br","Bold",14,GOLD,20,alignment=1)))
story.append(Paragraph(N("Mimarlik  ·  Teknik Danismanlik  ·  Yazilim Cozumleri"),
                         S("Br2","Body",9,GRAY,14,alignment=1)))
story.append(Paragraph(N("www.ozzoaluminyum.com  |  2025"),
                         S("Br3","Body",9,GRAY,14,alignment=1)))
story.append(PageBreak())

# ─── GIRIS ───────────────────────────────────────────────────────────────────
story.append(Spacer(1,0.8*cm))
story.append(Paragraph(N("Giris"), sChap))
story.append(GoldLine())
story.append(Spacer(1,0.4*cm))
story.append(Paragraph(N(
    "Aluminyum dograma ve giydirme cephe sistemleri; modern mimarinin "
    "vazgecilmez unsurlarindan biri haline gelmistir. Hafiflik, dayaniklilik "
    "ve estetik esnekligi bir arada sunan aluminyum; konutlardan ticari "
    "yapilara, ofis kulelerinden fabrika binalarına kadar her olcekte tercih edilmektedir."
), sBody))
story.append(Paragraph(N(
    "Bu rehber; sektorde en sik karsılasilan hatalari, aksesuar montaj kritiklerini, "
    "giydirme cephe teknik zorunluluklarini ve dijital donusumun kalitenin "
    "gelecegini nasil sekillendirdigini kapsamli bicimde ele almaktadir."
), sBody))
story.append(Spacer(1,0.4*cm))

intro_tbl = Table([
    [Paragraph(N("Bu Rehberde"), S("IH","Bold",10,WHITE,14)),
     Paragraph(N("Hedef Kitle"),  S("IH","Bold",10,WHITE,14))],
    [Paragraph(N("En sik 8 imalat hatasi\nAksesuar secim kriterleri\nCephe U degerleri\nDijital kalite kontrol"), sSmall),
     Paragraph(N("Aluminyum imalatcilar\nMimarlar ve muhendisler\nProje yoneticileri\nKapi-pencere sektoru"),   sSmall)],
], colWidths=[8*cm,8*cm])
intro_tbl.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,0),NAVY),
    ("LINEABOVE",(0,0),(-1,0),2,GOLD),
    ("BACKGROUND",(0,1),(-1,1),LIGHT_BG),
    ("TOPPADDING",(0,0),(-1,-1),9),("BOTTOMPADDING",(0,0),(-1,-1),9),
    ("LEFTPADDING",(0,0),(-1,-1),12),
    ("BOX",(0,0),(-1,-1),0.5,GRAY),
]))
story.append(intro_tbl)
story.append(PageBreak())

# ─── BOLUM 1: HATALAR ────────────────────────────────────────────────────────
story.append(Spacer(1,0.5*cm))
story.append(Paragraph(N("Bolum 1 — En Sik Yapilan Hatalar"), sChap))
story.append(GoldLine())
story.append(Spacer(1,0.4*cm))
story.append(Paragraph(N(
    "Aluminyum dograma imalatinda kalitenin temeli, uretim surecinin her asamasinda "
    "standartlara uyulmasi ile saglanir. Asagida sahada en sik karsılasilan 8 kritik "
    "hata ve bunlarin olasi sonuclari detaylandirilmistir."
), sBody))
story.append(Spacer(1,0.3*cm))
story.append(renderPDF.GraphicsFlowable(window_section_diagram()))
story.append(Spacer(1,0.3*cm))

error_list = [
    ("1", "Profil Kesim ve Birlесim Hatalari", RED,
     N("Kose birlеsimlerinde tam 45 derece aci zorunludur. Aci sapmalari zamanla "
       "cam kiriklarına ve su sizintisina yol acar. Tolerans: +-0,2 mm.")),
    ("2", "Conta ve Fitil Eksiklikleri", RED,
     N("EPDM contalar ile firca fitillerin eksiksiz yerlestirilmesi gerekir. "
       "Kose birlеsimlerinde vulkanize kose parca kullanilmalidir. "
       "Hedef: EN 12208 Su gecirmezlik Sinif 7A.")),
    ("3", "Cam Takma Hatalari", ORANGE,
     N("Cam altına yanlış konumlanan takozlar cam agirligini contaya aktarir. "
       "Cam takozlari alt profil ile sinir araliginda dogru konumlandirilmalidir.")),
    ("4", "Drenaj Sistemi Ihmali", RED,
     N("Alt profillerdeki drenaj delikleri yapi kopuguyle kapanmamalidir. "
       "Tikanik drenaj korozyon, kotu koku ve profil deformasyonuna neden olur. "
       "Her alt profilde en az 2 acik drenaj deligi olmalidir.")),
    ("5", "Ankraj ve Montaj Hatalari", RED,
     N("Isinsal genlesmeye izin vermek icin slot (ovalik) delik kullanilmalidir. "
       "Sabit delik ankrajlar mevsimsel sicaklik farklariyla profil catlamalarına "
       "neden olur. Minimum: her 600 mm'de bir ankraj.")),
    ("6", "Termik Kopru Bozulmasi", ORANGE,
     N("PA66 isil kopru kesici bantlar profil imalatında hasarlanmamalidir. "
       "Bant hasari profil yüzeyinde yogusma ve enerji kaybı yaratir. "
       "Hedef Uf degeri: 1,8 W/m2K veya daha az.")),
    ("7", "Yüzey Kaplama Hasari", ORANGE,
     N("Anodiz veya toz boya kaplamada darbeler ve cizikler kaplama butunlugunu bozar. "
       "Hasarli aluminyum yuzeyler korozyona açik hale gelir. "
       "Montaj sonrasina kadar kaplama koruma bantlari sokulmelidir.")),
    ("8", "Isicam Birimi Hatalari", ORANGE,
     N("Spacer araliginin duzensizligi uzun vadede cam kararmasına neden olur. "
       "Tolerans: +-0,5 mm. Silika jel dolumu eksiksiz olmalidir. "
       "EN 1279 standardina gore test edilmis birimler kullanilmalidir.")),
]

for num,title,col,desc in error_list:
    row = Table([[
        Paragraph(num, S(f"N{num}","Bold",13,WHITE,17,alignment=1)),
        Paragraph(N(title), S(f"T{num}","Bold",10.5,DARK,15)),
        Paragraph(desc, S(f"D{num}","Body",9.5,colors.HexColor("#374151"),14)),
    ]], colWidths=[0.8*cm, 4.3*cm, 10.9*cm])
    row.setStyle(TableStyle([
        ("BACKGROUND",(0,0),(0,-1),col),
        ("BACKGROUND",(1,0),(-1,-1),LIGHT_BG),
        ("LEFTPADDING",(0,0),(-1,-1),7),("RIGHTPADDING",(0,0),(-1,-1),8),
        ("TOPPADDING",(0,0),(-1,-1),8),("BOTTOMPADDING",(0,0),(-1,-1),8),
        ("VALIGN",(0,0),(-1,-1),"MIDDLE"),
        ("LINEBELOW",(0,0),(-1,-1),0.5,colors.HexColor("#e2e8f0")),
        ("LINELEFT",(1,0),(1,-1),2,col),
    ]))
    story.append(row)
    story.append(Spacer(1,2))

story.append(Spacer(1,0.5*cm))
story.append(renderPDF.GraphicsFlowable(error_map_diagram()))
story.append(PageBreak())

# ─── BOLUM 2: AKSESUARLAR ────────────────────────────────────────────────────
story.append(Spacer(1,0.5*cm))
story.append(Paragraph(N("Bolum 2 — Aksesuarlar: Kucuk Parca, Buyuk Sorumluluk"), sChap))
story.append(GoldLine())
story.append(Spacer(1,0.4*cm))
story.append(Paragraph(N(
    "Mentese, kol mekanizmasi, kilit ve pencere/kapi kolları; dogiramenin gunluk kullanim "
    "deneyimini dogrudan belirler. Aksesuar kalitesi ve dogru montaj goz ardi edildiginde "
    "ortaya cikan sorunlar, garanti kapsamindaki sikayetlerin buyuk bolumunu olusturur."
), sBody))
story.append(Spacer(1,0.3*cm))
story.append(renderPDF.GraphicsFlowable(accessory_diagram()))
story.append(Spacer(1,0.4*cm))

acc_data = [
    [Paragraph(N("Aksesuar"), S("AH","Bold",10,WHITE,14)),
     Paragraph(N("Kritik Standart"), S("AH","Bold",10,WHITE,14)),
     Paragraph(N("En Sik Hata"), S("AH","Bold",10,WHITE,14)),
     Paragraph(N("Olasi Sonuc"), S("AH","Bold",10,WHITE,14))],
    [N("Mentese"), N("HOPPE/GIESSE +-0,5mm"), N("Hizalama bozuklugu"), N("Kanat egrilir, sikisir")],
    [N("Kol Mek."), N("SIEGENIA 3-4 Nm"), N("Yanlis tork"), N("Mekanizma arizasi")],
    [N("Gomme Kilit"), N("Sablon zorunlu"), N("1mm+ sapma"), N("Kilitleme saglanamaz")],
    [N("Kapak/Kol"), N("Yuk kapasitesi"), N("Yanlis vida"), N("Kol salinimi")],
]
acc_tbl = Table(acc_data, colWidths=[3*cm,4.5*cm,4*cm,4.5*cm])
acc_tbl.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,0),NAVY),("LINEABOVE",(0,0),(-1,0),2,GOLD),
    ("FONTNAME",(0,1),(-1,-1),"Body"),("FONTSIZE",(0,1),(-1,-1),9.5),
    ("TOPPADDING",(0,0),(-1,-1),8),("BOTTOMPADDING",(0,0),(-1,-1),8),
    ("LEFTPADDING",(0,0),(-1,-1),10),
    ("ROWBACKGROUNDS",(0,1),(-1,-1),[WHITE,LIGHT_BG]),
    ("BOX",(0,0),(-1,-1),0.5,GRAY),
    ("GRID",(0,0),(-1,-1),0.3,colors.HexColor("#e2e8f0")),
]))
story.append(acc_tbl)
story.append(Spacer(1,0.5*cm))

tip = Table([[
    Paragraph(N("Uzman Ipucu"), S("TH","Bold",10,GOLD,14)),
    Paragraph(N("Dogru aksesuar secimi ve eksiksiz montaj, bir dogiramenin omrunu 10 yildan 25 yila "
                "tasiyabilir. Aksesuar montajinda sablon kullanimini kural haline getirin. "
                "Uretici kalibrasyon belgesi olan markalar tercih edilmelidir."),
              S("TB","Body",9.5,DARK,14)),
]], colWidths=[3.5*cm,12.5*cm])
tip.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,-1),colors.HexColor("#fefce8")),
    ("LINEABOVE",(0,0),(-1,0),2,GOLD),("LINELEFT",(0,0),(0,-1),4,GOLD),
    ("TOPPADDING",(0,0),(-1,-1),10),("BOTTOMPADDING",(0,0),(-1,-1),10),
    ("LEFTPADDING",(0,0),(-1,-1),10),
    ("BOX",(0,0),(-1,-1),0.5,colors.HexColor("#fde68a")),
]))
story.append(tip)
story.append(PageBreak())

# ─── BOLUM 3: CEPHE ──────────────────────────────────────────────────────────
story.append(Spacer(1,0.5*cm))
story.append(Paragraph(N("Bolum 3 — Giydirme Cephe Sistemleri"), sChap))
story.append(GoldLine())
story.append(Spacer(1,0.4*cm))
story.append(Paragraph(N(
    "Giydirme cepheler, buyuk yapi projelerinde hem estetik hem enerji performansi "
    "acisindan belirleyici rol ustlenir. Dogru sistem secimi, dogru detay ve dogru "
    "montaj; binanin 40-50 yillik yasam donemini dogrudan etkiler."
), sBody))
story.append(Spacer(1,0.3*cm))
story.append(renderPDF.GraphicsFlowable(u_value_chart()))
story.append(Spacer(1,0.4*cm))

cephe_topics = [
    (N("Ruzgar Yuku — TS EN 1991-1-4"),
     N("Turkiyede temel ruzgar hizi bolgeye gore 25-32 m/s arasinda degisir. "
       "qp(z) = ce(z) x qb formulu ile tepe basinc hesaplanir. "
       "Profil ve cam baglanti sistemi min. 2000 Pa pozitif ve negatif basinca dayanmalidir (EN 12210 Sinif C5).")),
    (N("Isinma Performansi"),
     N("TS 825 Bolge 1'de cephe sistemlerinde Uw 1,8 W/m2K veya alti hedeflenmektedir. "
       "PA66 cam elyaf takviyeli isil kopru kesici bantlar kritiktir. "
       "Low-E kaplamali triple cam ile Uw = 0,8 W/m2K'e kadar inilebilir.")),
    (N("Spandrel Bolge Detayi"),
     N("Galvaniz tava + 50 mm taş yunu + aluminyum spandrel panel katmanlanmasi zorunludur. "
       "Bu detayin atlanmasi yangin yayilimi riski ve ciddi isi kaybi anlamına gelir.")),
    (N("Stick ve Unitize Sistem Secimi"),
     N("Stick sistemler saha montajina dayali; dusuk yüksekliklerde tercih edilir. "
       "Unitize sistemler fabrikada uretilip sahaya hazir monte edilir; kalite kontrol cok daha etkin. "
       "20 katin uzerindeki yapilarda unitize sistem sart olmaktadir.")),
    (N("Hava ve Su Sizdirmazligi"),
     N("EN 12207 hava gecirgenligi Sinif 4 (600 Pa max. 1,5 m3/h/m2) ve "
       "EN 12208 su sizdirmazligi Sinif 9A hedeflenmalidir.")),
]
for title,desc in cephe_topics:
    story.append(Paragraph(title, sHead))
    story.append(Paragraph(desc, sBody))

story.append(Spacer(1,0.4*cm))
cert_data = [
    [Paragraph("Standart",     S("CH","Bold",10,WHITE,14)),
     Paragraph("Kapsam",       S("CH","Bold",10,WHITE,14)),
     Paragraph("Hedef Deger",  S("CH","Bold",10,WHITE,14))],
    ["EN 12207", N("Hava gecirgenlik"),       N("Sinif 4 (600 Pa)")],
    ["EN 12208", N("Su sizdirmazlik"),        N("Sinif 9A")],
    ["EN 12210", N("Ruzgar yuku direnci"),    N("Sinif C5 (2000 Pa)")],
    ["TS 825",   N("Isınma standardi"),       N("Bolge 1: Uw 2,4 W/m2K")],
    ["EN 1279",  N("Isicam birimi"),          N("6 seviye basinc testi")],
]
cert_tbl = Table(cert_data, colWidths=[3.5*cm,8*cm,4.5*cm])
cert_tbl.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,0),NAVY),("LINEABOVE",(0,0),(-1,0),2,GOLD),
    ("FONTNAME",(0,1),(-1,-1),"Body"),("FONTSIZE",(0,1),(-1,-1),9.5),
    ("TOPPADDING",(0,0),(-1,-1),8),("BOTTOMPADDING",(0,0),(-1,-1),8),
    ("LEFTPADDING",(0,0),(-1,-1),10),
    ("ROWBACKGROUNDS",(0,1),(-1,-1),[WHITE,LIGHT_BG]),
    ("BOX",(0,0),(-1,-1),0.5,GRAY),
    ("GRID",(0,0),(-1,-1),0.3,colors.HexColor("#e2e8f0")),
]))
story.append(cert_tbl)
story.append(PageBreak())

# ─── BOLUM 4: YAZILIM YATIRIMI ────────────────────────────────────────────────
story.append(Spacer(1,0.5*cm))
story.append(Paragraph(N("Bolum 4 — Yazilim Yatirimi: Artik Bir Luxs Degil"), sChap))
story.append(GoldLine())
story.append(Spacer(1,0.4*cm))
story.append(Paragraph(N(
    "Aluminyum sektoru uzun yillar boyunca kagit is emirleri, sozlu koordinasyon "
    "ve tecrübeye dayali kalite kontrolüyle yurütülmüstür. Ancak isin olcegi "
    "buyüdükce insan gozunun ve hafizasinin sinirlari hata riskini artirmaktadir. "
    "Rakamlar bunu net ortaya koymaktadir:"
), sBody))
story.append(Spacer(1,0.3*cm))
story.append(renderPDF.GraphicsFlowable(software_flow()))
story.append(Spacer(1,0.4*cm))

benefits = [
    ("Proje Bazli Takip",
     N("Her projenin dogiramalari ayri klasorde; kanat, usta, tarih tum kayit altinda.")),
    ("Fotograf Tabanli Kalite Kontrol",
     N("Atölyede cekilen fotograf saniyeler icinde analiz edilir; hata varsa usta aninda uyarilir.")),
    ("Anlik Bildirim Sistemi",
     N("Atölye ustasindan proje sorumlusuna WhatsApp veya uygulama icinden gercek zamanli hata bildirimi.")),
    ("Otomatik PDF Rapor",
     N("Musteri icin profesyonel kalite raporu tek tuşla olusturulur; logo, tarih, imza hazir.")),
    ("Istatistik ve Arsiv",
     N("Hangi hata kac kez tekrarlandi? Veriye dayali surec iyilestirmesi mumkun olur.")),
]
for title,desc in benefits:
    row = Table([[
        Paragraph(N(title), S(f"BH{title[:3]}","Bold",10.5,DARK,15)),
        Paragraph(desc, S(f"BD{title[:3]}","Body",9.5,colors.HexColor("#374151"),14)),
    ]], colWidths=[4.5*cm,11.5*cm])
    row.setStyle(TableStyle([
        ("BACKGROUND",(0,0),(-1,-1),LIGHT_BG),
        ("VALIGN",(0,0),(-1,-1),"MIDDLE"),
        ("TOPPADDING",(0,0),(-1,-1),9),("BOTTOMPADDING",(0,0),(-1,-1),9),
        ("LEFTPADDING",(0,0),(-1,-1),12),
        ("LINEBELOW",(0,0),(-1,-1),0.5,colors.HexColor("#e2e8f0")),
        ("LINELEFT",(0,0),(0,-1),4,GOLD),
    ]))
    story.append(row)
    story.append(Spacer(1,2))

story.append(Spacer(1,0.5*cm))
story.append(Paragraph(N("Somut Kazanimlar — Rakamlarla"), sHead))
roi_data = [
    [Paragraph(N("Karsilastirma"), S("RH","Bold",10,WHITE,14)),
     Paragraph(N("Geleneksel Yontem"), S("RH","Bold",10,WHITE,14)),
     Paragraph(N("Yazilim Destekli"), S("RH","Bold",10,WHITE,14))],
    [N("Hata tespiti"), N("Montaj sonrasi"), N("Uretim sirasinda")],
    [N("Yeniden imalat"), N("5.000-15.000 TL/kanat"), N("Onlenir")],
    [N("Sikayet sureci"), N("3-7 gun"), N("24 saat icinde")],
    [N("Kalite raporu"), N("1-2 saat manuel"), N("Otomatik 30 saniye")],
    [N("Proje arsivi"), N("Kagit klasor"), N("Dijital, aranabilir")],
]
roi_tbl = Table(roi_data, colWidths=[5*cm,5.5*cm,5.5*cm])
roi_tbl.setStyle(TableStyle([
    ("BACKGROUND",(0,0),(-1,0),NAVY),("LINEABOVE",(0,0),(-1,0),2,GOLD),
    ("FONTNAME",(0,1),(-1,-1),"Body"),("FONTSIZE",(0,1),(-1,-1),9.5),
    ("TOPPADDING",(0,0),(-1,-1),8),("BOTTOMPADDING",(0,0),(-1,-1),8),
    ("LEFTPADDING",(0,0),(-1,-1),10),
    ("ROWBACKGROUNDS",(0,1),(-1,-1),[WHITE,LIGHT_BG]),
    ("BOX",(0,0),(-1,-1),0.5,GRAY),
    ("GRID",(0,0),(-1,-1),0.3,colors.HexColor("#e2e8f0")),
    ("TEXTCOLOR",(2,1),(2,-1),GREEN),
]))
story.append(roi_tbl)
story.append(PageBreak())

# ─── KAPANIŞ ─────────────────────────────────────────────────────────────────
bg = Drawing(A4[0]-3.6*cm, 20*cm)
bg.add(Rect(0,0,A4[0]-3.6*cm,20*cm,0,fillColor=DARK,strokeColor=None))
bg.add(Rect(0,0,A4[0]-3.6*cm,4,fillColor=GOLD,strokeColor=None))
bg.add(Rect(0,20*cm-4,A4[0]-3.6*cm,4,fillColor=GOLD,strokeColor=None))
story.append(bg)
story.append(Spacer(1,-20*cm+1.5*cm))

story.append(Paragraph(N("Sonuc"), S("CapH","Bold",22,WHITE,28,alignment=1)))
story.append(Spacer(1,0.4*cm))
story.append(GoldLine())
story.append(Spacer(1,0.6*cm))
story.append(Paragraph(N(
    "Dijital donusum, buyuk firmalarin luksu olmaktan cikmis;\n"
    "rekabetci kalmak isteyen her olcekteki aluminyum isletmesinin\n"
    "stratejik zorunlulugu haline gelmistir."
), S("CapB","Body",12,colors.HexColor("#cbd5e1"),19,alignment=1)))
story.append(Spacer(1,0.5*cm))
story.append(Paragraph(N(
    "Teknolojiyi uretime entegre eden firmalar yalnizca hata oranini dusurmuyor;\n"
    "kurumsal kimlik, izlenebilir surec ve musteri nezdinde guven insa ediyor.\n"
    "Bu yatirim bir maliyet kalemi degil — buyumenin ve kaliciligin temelidir."
), S("CapB2","Body",11,colors.HexColor("#94a3b8"),17,alignment=1)))
story.append(Spacer(1,0.8*cm))

stats_tbl = Table([[
    Paragraph(v, S(f"SV{i}","Bold",30,GOLD,36,alignment=1))
    for i,(v,_) in enumerate([("%40",0),("%70",0),("10x",0)])
],[
    Paragraph(N(l), S(f"SL{i}","Body",9,GRAY,13,alignment=1))
    for i,l in enumerate([N("Hata Azalmasi"), N("Daha Hizli Tespit"), N("Daha Hizli Rapor")])
]], colWidths=[5.3*cm]*3)
stats_tbl.setStyle(TableStyle([
    ("ALIGN",(0,0),(-1,-1),"CENTER"),
    ("TOPPADDING",(0,0),(-1,-1),4),("BOTTOMPADDING",(0,0),(-1,-1),4),
]))
story.append(stats_tbl)
story.append(Spacer(1,1*cm))

story.append(Paragraph(N("OZZO Aluminyum"),
                         S("Br","Bold",18,GOLD,24,alignment=1)))
story.append(Paragraph(N("Mimarlik  ·  Teknik Danismanlik  ·  Yazilim Cozumleri"),
                         S("BrS","Body",10,colors.HexColor("#94a3b8"),15,alignment=1)))
story.append(Spacer(1,0.3*cm))
story.append(Paragraph(N("www.ozzoaluminyum.com"),
                         S("URL","Body",11,GOLD_LIGHT,16,alignment=1)))

doc.build(story)
print(f"PDF olusturuldu: {OUTPUT}")

