import { useState, useMemo, useEffect } from 'react'
import { exportPvcDXF } from '../utils/dxfExport'
import { printPvcPDF, buildBlobUrl } from '../utils/printPDF'

/* ── Data ── */
const PRODUCTS = [
  { id:'casement',name:'Kanatlı Pencere',    short:'KP',icon:'🪟',minW:0.40,maxW:2.40,minH:0.40,maxH:2.40,frameFrac:0.25, bars:(w,h)=>[w,w,h,h] },
  { id:'sliding', name:'Sürme Pencere',      short:'SP',icon:'↔️',minW:1.00,maxW:4.00,minH:0.40,maxH:2.20,frameFrac:0.30, bars:(w,h)=>[w,w,h,h,w/2,w/2] },
  { id:'door',    name:'Balkon/Giriş Kapısı',short:'BK',icon:'🚪',minW:0.70,maxW:2.40,minH:1.80,maxH:2.60,frameFrac:0.22, bars:(w,h)=>[w,w,h,h] },
  { id:'tilt',    name:'Devrilir-Döner (TSS)',short:'DD',icon:'🔄',minW:0.40,maxW:1.80,minH:0.60,maxH:1.80,frameFrac:0.27, bars:(w,h)=>[w,w,h,h] },
]
const PROFILES = [
  { id:'p5', name:'5 Kameralı PVC',       Uf:1.30, outerW:70, color:'#60a5fa', pricePerM:85  },
  { id:'p6', name:'6 Kameralı PVC',       Uf:1.10, outerW:76, color:'#a78bfa', pricePerM:110 },
  { id:'p7', name:'7 Kameralı PVC Pasif', Uf:0.85, outerW:82, color:'#06b6d4', pricePerM:145 },
  { id:'psl',name:'Sürme Sistemi PVC',    Uf:1.50, outerW:62, color:'#22c55e', pricePerM:75  },
]
const GLASSES = [
  { id:'dg16', name:'4+16+4 Hava',            Ug:2.8,  thick:24, pricePerM2:120 },
  { id:'dgle', name:'4+16Ar+4 Low-e',          Ug:1.1,  thick:24, pricePerM2:210 },
  { id:'tg',   name:'4+14Ar+4+14Ar+4 Üçlü',   Ug:0.65, thick:40, pricePerM2:380 },
  { id:'safe', name:'44.2 Güvenlik + Low-e',   Ug:1.0,  thick:42, pricePerM2:320 },
]
const HARDWARE = [
  { id:'std',  name:'Standart Donanım',  desc:'Kol, menteşe, kilit',                    price:450  },
  { id:'prem', name:'Premium Donanım',   desc:'Anti-çarpma, gizli menteşe, çok kilitli', price:850 },
  { id:'slide',name:'Sürme Donanım',     desc:'Sürme kolu, ray, plastik kızak',         price:320  },
  { id:'none', name:'Donanımsız',        desc:'Sadece profil + cam',                    price:0    },
]
const COLORS = [
  { id:'white',name:'Beyaz RAL 9016', hex:'#f5f5f0',surcharge:0  },
  { id:'cream',name:'Krem RAL 9001',  hex:'#ede8d0',surcharge:0  },
  { id:'grey', name:'Antrasit 7016',  hex:'#383e42',surcharge:15 },
  { id:'brown',name:'Kahve 8014',     hex:'#52361b',surcharge:15 },
  { id:'oak',  name:'Golden Oak',     hex:'#c8860a',surcharge:25 },
]
const EC = [
  { cls:'A+',max:0.80,color:'#06b6d4' },
  { cls:'A', max:1.00,color:'#22c55e' },
  { cls:'B', max:1.20,color:'#84cc16' },
  { cls:'C', max:1.60,color:'#eab308' },
  { cls:'D', max:2.00,color:'#f97316' },
  { cls:'E', max:3.00,color:'#ef4444' },
  { cls:'F', max:Infinity,color:'#9f1239' },
]
const LABOR = 180

/* ── Cutting opt: First Fit Decreasing ── */
const BAR_COLORS=['#60a5fa','#a78bfa','#34d399','#f59e0b','#f87171','#06b6d4','#e879f9','#fb923c']

function optimizeCuts(pieces, barLen, kerf=0.003){
  const sorted=[...pieces].sort((a,b)=>b-a)
  const bars=[]
  for(const p of sorted){
    let placed=false
    for(const bar of bars){
      const used=bar.cuts.reduce((s,c)=>s+c+kerf,0)
      if(used+p+kerf<=barLen){bar.cuts.push(p);bar.used=used+p+kerf;placed=true;break}
    }
    if(!placed)bars.push({cuts:[p],used:p+kerf,cap:barLen})
  }
  const totalUsed=bars.reduce((s,b)=>s+b.used,0)
  const totalCap=bars.length*barLen
  return{bars,totalUsed,totalCap,waste:totalCap-totalUsed,wastePerc:(totalCap-totalUsed)/totalCap*100}
}

function calcAll({product,profileSys,glass,hardware,color,W,H,qty,bLen}){
  const totalArea=W*H
  const glassArea=totalArea*(1-product.frameFrac)
  const frameArea=totalArea*product.frameFrac
  const perimeter=2*(W+H)
  const Uw=(glassArea*glass.Ug+frameArea*profileSys.Uf+perimeter*0.06)/totalArea
  const ec=EC.find(e=>Uw<=e.max)||EC.at(-1)
  const piecesPerWindow=product.bars(W,H).map(v=>parseFloat(v.toFixed(4)))
  const allPieces=[]
  for(let i=0;i<qty;i++)allPieces.push(...piecesPerWindow)
  const cutting=optimizeCuts(allPieces,bLen)
  const totalLinear=allPieces.reduce((s,p)=>s+p,0)
  const profileCost=cutting.bars.length*bLen*profileSys.pricePerM
  const glassCost=glassArea*qty*glass.pricePerM2
  const hardwareCost=hardware.price*qty
  const colorSurcharge=(color.surcharge/100)*profileCost
  const laborCost=glassArea*qty*LABOR
  const subtotal=profileCost+glassCost+hardwareCost+colorSurcharge+laborCost
  const vat=subtotal*0.20
  const total=subtotal+vat
  return{totalArea,glassArea,frameArea,perimeter,Uw,ec,piecesPerWindow,allPieces,cutting,bLen,totalLinear,profileCost,glassCost,hardwareCost,colorSurcharge,laborCost,subtotal,vat,total,barsNeeded:cutting.bars.length}
}

/* ── Step bar ── */
const STEPS=['Ürün','Profil','Cam','Aksesuar','Boyut & Adet','Sonuç']
function StepBar({step}){
  return(
    <div className="flex items-center justify-center flex-wrap gap-y-3 mb-10">
      {STEPS.map((s,i)=>(
        <div key={i} className="flex items-center">
          <div className={`flex flex-col items-center ${i<=step?'':'opacity-40'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all ${i<step?'bg-green-500 border-green-500 text-white':i===step?'border-green-400 text-green-400 shadow-[0_0_12px_rgba(34,197,94,0.4)]':'border-white/20 text-white/30'}`}>
              {i<step?'✓':i+1}
            </div>
            <span className={`text-[9px] mt-1 text-center max-w-[52px] ${i===step?'text-green-400':'text-white/35'}`}>{s}</span>
          </div>
          {i<STEPS.length-1&&<div className={`w-6 h-px mx-0.5 mb-5 ${i<step?'bg-green-500':'bg-white/12'}`}/>}
        </div>
      ))}
    </div>
  )
}

function Card({children,className=''}){
  return<div className={`bg-black/50 backdrop-blur-sm border border-white/15 rounded-xl p-5 ${className}`}>{children}</div>
}

function Metric({label,val,unit='',color='#fff'}){
  return(
    <div className="bg-black/40 border border-white/12 rounded-lg p-3">
      <div className="text-white/50 text-[10px] font-mono mb-1">{label}</div>
      <div className="font-mono font-bold text-sm leading-tight" style={{color}}>{val}<span className="text-xs font-normal opacity-60 ml-0.5">{unit}</span></div>
    </div>
  )
}

function SliderInput({label,val,set,min,max,step=0.01,unit='m',color='#c9a84c'}){
  return(
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="text-white font-500 text-sm">{label}</label>
        <div className="flex items-center gap-2">
          <input type="number" min={min} max={max} step={step} value={val}
            onChange={e=>{const v=parseFloat(e.target.value);if(!isNaN(v))set(Math.max(min,Math.min(max,v)))}}
            className="w-22 bg-black/40 border border-white/25 rounded px-2 py-1 text-sm font-mono text-white text-right focus:outline-none focus:border-green-400/60"/>
          <span className="text-white/50 text-sm font-mono">{unit}</span>
        </div>
      </div>
      <input type="range" min={min} max={max} step={step} value={val}
        onChange={e=>set(parseFloat(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer"
        style={{background:`linear-gradient(to right,${color} ${((val-min)/(max-min))*100}%,rgba(255,255,255,0.12) 0)`}}/>
      <div className="flex justify-between text-[10px] text-white/30 mt-1"><span>{min}{unit}</span><span>{max}{unit}</span></div>
    </div>
  )
}

export default function PvcPage(){
  const [step,setStep]=useState(0)
  const [productId,setProductId]=useState(null)
  const [profileId,setProfileId]=useState(null)
  const [glassId,setGlassId]=useState(null)
  const [hardwareId,setHardwareId]=useState('std')
  const [colorId,setColorId]=useState('white')
  const [W,setW]=useState(1.20)
  const [H,setH]=useState(1.40)
  const [qty,setQty]=useState(1)
  const [barLength,setBarLength]=useState(6.0)
  const [useCustomBar,setUseCustomBar]=useState(false)

  useEffect(() => {}, [])
  const [customBarLen,setCustomBarLen]=useState(6.5)
  const [tab,setTab]=useState('summary')
  const [clientName,setClientName]=useState('')
  const [clientPhone,setClientPhone]=useState('')
  const [vatChecked,setVatChecked]=useState(true)
  const [extraNotes,setExtraNotes]=useState('')
  const [pdfPreviewUrl,setPdfPreviewUrl]=useState(null)
  const [pdfLoading,setPdfLoading]=useState(false)

  const product=PRODUCTS.find(p=>p.id===productId)
  const profileSys=PROFILES.find(p=>p.id===profileId)
  const glass=GLASSES.find(g=>g.id===glassId)
  const hardware=HARDWARE.find(h=>h.id===hardwareId)
  const color=COLORS.find(c=>c.id===colorId)
  const Wc=product?Math.max(product.minW,Math.min(product.maxW,W)):W
  const Hc=product?Math.max(product.minH,Math.min(product.maxH,H)):H
  const bLen=useCustomBar?customBarLen:barLength

  const r=useMemo(()=>{
    if(!product||!profileSys||!glass||!hardware||!color)return null
    return calcAll({product,profileSys,glass,hardware,color,W:Wc,H:Hc,qty,bLen})
  },[product,profileSys,glass,hardware,color,Wc,Hc,qty,bLen])

  const canNext=()=>{
    if(step===0)return!!productId
    if(step===1)return!!profileId
    if(step===2)return!!glassId
    return true
  }

  const fmt=n=>n.toLocaleString('tr-TR',{minimumFractionDigits:2,maximumFractionDigits:2})

  const [marginPct, setMarginPct] = useState(20)

  const handlePDF = () => {
    if (!r) return
    const items = [{ productName: product?.name, profileName: profileSys?.name, glassName: glass?.name, W: Wc, H: Hc, qty, Uw: r.Uw, totalPrice: r.totalPrice }]
    printPvcPDF({ items, clientName, totals: { subtotal: r.totalPrice, grand: vatChecked ? r.totalPrice * 1.20 : r.totalPrice, kdv: vatChecked ? r.totalPrice * 0.20 : 0 } })
  }

  const handleCustomerQuotePDF = () => {
    if (!r || !product || !profileSys || !glass) return
    const quoteNo = `OZZ-TEK-${Date.now().toString().slice(-6)}`
    const date = new Date().toLocaleDateString('tr-TR')
    const withMargin = r.totalPrice * (1 + marginPct / 100)
    const kdvAmount = vatChecked ? withMargin * 0.20 : 0
    const grandTotal = withMargin + kdvAmount
    const fmt2 = n => n.toLocaleString('tr-TR', {minimumFractionDigits:2, maximumFractionDigits:2})
    const html = `<!DOCTYPE html><html lang='tr'><head><meta charset='UTF-8'><title>Teklif ${quoteNo}</title>
<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:Arial,sans-serif;padding:40px;color:#111}header{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #c9a84c;padding-bottom:20px;margin-bottom:28px}.logo{font-size:28px;font-weight:800;letter-spacing:0.1em}.logo-sub{font-size:10px;letter-spacing:0.2em;color:#888;margin-top:2px}h2{font-size:13px;margin-bottom:14px;color:#555;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;border-bottom:1px solid #eee;padding-bottom:6px;margin-top:24px}.meta{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:20px}.mi{background:#f8f8f8;padding:10px 14px;border-radius:4px}.ml{font-size:10px;color:#999;text-transform:uppercase}.mv{font-size:13px;font-weight:600;margin-top:2px}table{width:100%;border-collapse:collapse;margin-bottom:16px}th{background:#f8f8f8;padding:10px 12px;font-size:11px;text-align:left;font-weight:700;color:#555;text-transform:uppercase}td{padding:10px 12px;font-size:12px;border-bottom:1px solid #f0f0f0}.tr{background:#f8f8f8;font-weight:700}.gr{background:#fff8ec;border:2px solid #c9a84c}.gr td{font-size:15px;font-weight:800;color:#8a6f2e}.nb{background:#f8f8f8;border-left:4px solid #c9a84c;padding:12px 16px;font-size:12px;color:#555;line-height:1.7;margin:16px 0}.sa{display:grid;grid-template-columns:1fr 1fr;gap:30px;margin-top:40px}.sb{border-top:1px solid #ccc;padding-top:8px;text-align:center;font-size:10px;color:#999;text-transform:uppercase}.ft{margin-top:24px;border-top:1px solid #eee;padding-top:10px;font-size:10px;color:#aaa;text-align:center}</style></head>
<body>
<header><div><div class='logo'>AluSight</div><div class='logo-sub'>ALÜMINYUM</div></div><div style='text-align:center'><div style='font-size:16px;font-weight:700;margin-bottom:4px'>FİYAT TEKLİFİ</div><div style='font-size:11px;color:#888'>Resmi Teklif Belgesi</div></div><div style='text-align:right;font-size:11px;color:#555;line-height:1.9'><div><strong>Teklif No:</strong> ${quoteNo}</div><div><strong>Tarih:</strong> ${date}</div><div><strong>Geçerlilik:</strong> 30 gün</div></div></header>
<h2>Müşteri Bilgileri</h2><div class='meta'><div class='mi'><div class='ml'>Müşteri Adı</div><div class='mv'>${clientName || 'Belirtilmedi'}</div></div><div class='mi'><div class='ml'>Telefon</div><div class='mv'>${clientPhone || '—'}</div></div></div>
<h2>Teklif Kalemleri</h2>
<table><thead><tr><th>Ürün</th><th>Profil Sistemi</th><th>Cam</th><th>Boyut</th><th>Adet</th><th>Uw (W/m²K)</th><th style='text-align:right'>Tutar</th></tr></thead>
<tbody><tr><td>${product.name}</td><td>${profileSys.name}</td><td>${glass.name}</td><td>${Wc.toFixed(2)}×${Hc.toFixed(2)} m</td><td>${qty}</td><td>${r.Uw.toFixed(3)}</td><td style='text-align:right;font-weight:600'>${fmt2(withMargin)} ₺</td></tr></tbody></table>
<table><tbody>
<tr class='tr'><td colspan='6' style='text-align:right'>Ara Toplam</td><td style='text-align:right'>${fmt2(withMargin)} ₺</td></tr>
${vatChecked ? `<tr><td colspan='6' style='text-align:right'>KDV (%20)</td><td style='text-align:right'>${fmt2(kdvAmount)} ₺</td></tr>` : ''}
<tr class='gr'><td colspan='6' style='text-align:right'>GENEL TOPLAM</td><td style='text-align:right'>${fmt2(grandTotal)} ₺</td></tr>
</tbody></table>
${extraNotes ? `<h2>Notlar ve Koşullar</h2><div class='nb'>${extraNotes}</div>` : ''}
<div style='background:#f0f7ff;border:1px solid #bcd;border-radius:4px;padding:12px 16px;font-size:11px;color:#346;margin:16px 0'>
  <strong>Ödeme ve Teslimat:</strong> Sipariş onayı üzerine %50 peşin, teslimatta kalan %50. Üretim süresi 15-20 iş günü.
</div>
<div class='sa'><div class='sb'>Hazırlayan — AluSight</div><div class='sb'>Müşteri Onayı</div></div>
<div class='ft'>AluSight · Bu teklif ${date} tarihinde hazırlanmış olup 30 gün geçerlidir · ${quoteNo}</div>
</body></html>`
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = `alusight-Teklif-${quoteNo}.html`; a.click()
    URL.revokeObjectURL(url)
  }

  const handlePreview = () => {
    handlePDF()
  }

  const handleDXF=()=>{
    if(!r||!product||!profileSys||!glass)return
    exportPvcDXF({product,profileSys,glass,r,W:Wc,H:Hc,qty,clientName})
  }

  return(
    <>
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-full border border-green-500/50 flex items-center justify-center text-xl bg-green-500/15">📐</div>
            <div className="text-left">
              <p className="text-green-400 text-xs font-display tracking-[0.3em] uppercase">Hesaplamalar — Ercom</p>
              <h1 className="text-3xl font-display font-700 text-white leading-tight">PVC Pencere & Kapı Hesaplama</h1>
            </div>
          </div>
          <p className="text-white/60 text-sm max-w-2xl mx-auto">Boyut · Kesim optimizasyonu · Özel boy · Fire analizi · Fiyat teklifi</p>
        </div>

        <StepBar step={step}/>

        {/* STEP 0 */}
        {step===0&&(
          <div>
            <p className="text-center text-white/70 text-sm mb-8 font-medium">Ürün tipini seçin</p>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {PRODUCTS.map(p=>(
                <button key={p.id} onClick={()=>setProductId(p.id)}
                  className={`p-5 text-left border-2 rounded-xl transition-all ${productId===p.id?'border-green-400 bg-green-500/15':'border-white/15 bg-black/40 hover:border-white/35 hover:bg-black/60'}`}>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-3xl">{p.icon}</span>
                    {productId===p.id&&<span className="w-5 h-5 rounded-full bg-green-500 text-white text-xs flex items-center justify-center">✓</span>}
                  </div>
                  <div className="text-white font-600 text-sm mb-1">{p.name}</div>
                  <div className="text-white/50 text-xs font-mono">{p.minW}–{p.maxW}m × {p.minH}–{p.maxH}m</div>
                  <div className="text-white/35 text-xs mt-1">{p.bars(1,1).length} parça/adet</div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 1 */}
        {step===1&&(
          <div>
            <p className="text-center text-white/70 text-sm mb-8 font-medium">PVC profil sistemini seçin</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {PROFILES.map(ps=>(
                <button key={ps.id} onClick={()=>setProfileId(ps.id)}
                  className={`p-5 text-left border-2 rounded-xl transition-all ${profileId===ps.id?'border-green-400 bg-green-500/15':'border-white/15 bg-black/40 hover:border-white/35 hover:bg-black/60'}`}>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-bold px-2 py-0.5 rounded-lg" style={{background:ps.color+'22',color:ps.color,border:`1px solid ${ps.color}55`}}>{ps.name}</span>
                    {profileId===ps.id&&<span className="w-5 h-5 rounded-full bg-green-500 text-white text-xs flex items-center justify-center">✓</span>}
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                    {[['Uf',ps.Uf,ps.color],['En',ps.outerW+'mm','#fff'],['₺/m',ps.pricePerM,'#22c55e']].map(([l,v,c])=>(
                      <div key={l} className="bg-white/8 rounded p-1.5 text-center">
                        <div className="text-white/40 text-[9px]">{l}</div>
                        <div className="font-bold" style={{color:c}}>{v}</div>
                      </div>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step===2&&(
          <div>
            <p className="text-center text-white/70 text-sm mb-8 font-medium">Cam konfigürasyonunu seçin</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {GLASSES.map(g=>(
                <button key={g.id} onClick={()=>setGlassId(g.id)}
                  className={`p-5 text-left border-2 rounded-xl transition-all ${glassId===g.id?'border-green-400 bg-green-500/15':'border-white/15 bg-black/40 hover:border-white/35 hover:bg-black/60'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-white font-600 text-sm">{g.name}</span>
                    {glassId===g.id&&<span className="w-5 h-5 flex-shrink-0 rounded-full bg-green-500 text-white text-xs flex items-center justify-center ml-2">✓</span>}
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                    {[['Ug',g.Ug,'#60a5fa'],['Kalınlık',g.thick+'mm','#fff'],['₺/m²',g.pricePerM2,'#22c55e']].map(([l,v,c])=>(
                      <div key={l} className="bg-white/8 rounded p-1.5 text-center">
                        <div className="text-white/40 text-[9px]">{l}</div>
                        <div className="font-bold" style={{color:c}}>{v}</div>
                      </div>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step===3&&(
          <div className="max-w-2xl mx-auto space-y-6">
            <p className="text-center text-white/70 text-sm font-medium">Donanım ve renk seçin</p>
            <Card>
              <div className="text-white/55 text-xs font-display tracking-wider mb-4 uppercase">Donanım Paketi</div>
              <div className="grid grid-cols-2 gap-3">
                {HARDWARE.map(hw=>(
                  <button key={hw.id} onClick={()=>setHardwareId(hw.id)}
                    className={`p-4 text-left border-2 rounded-xl transition-all ${hardwareId===hw.id?'border-green-400 bg-green-500/15':'border-white/15 hover:border-white/30 hover:bg-white/5'}`}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-white font-600 text-sm">{hw.name}</span>
                      {hardwareId===hw.id&&<span className="w-4 h-4 rounded-full bg-green-500 text-white text-[10px] flex items-center justify-center">✓</span>}
                    </div>
                    <div className="text-white/50 text-xs mb-2">{hw.desc}</div>
                    <div className="text-green-400 font-mono text-sm font-bold">{hw.price>0?`₺${hw.price}/ad`:'Ücretsiz'}</div>
                  </button>
                ))}
              </div>
            </Card>
            <Card>
              <div className="text-white/55 text-xs font-display tracking-wider mb-4 uppercase">Profil Rengi</div>
              <div className="grid grid-cols-5 gap-3">
                {COLORS.map(c=>(
                  <button key={c.id} onClick={()=>setColorId(c.id)}
                    className={`p-3 border-2 rounded-xl transition-all text-center ${colorId===c.id?'border-green-400 bg-green-500/10':'border-white/15 hover:border-white/30'}`}>
                    <div className="w-8 h-8 rounded-full mx-auto mb-2 border-2 border-white/20" style={{background:c.hex}}/>
                    <div className="text-[9px] text-white/60 leading-tight">{c.name}</div>
                    {c.surcharge>0&&<div className="text-[9px] text-amber-400 mt-0.5">+{c.surcharge}%</div>}
                  </button>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* STEP 4 */}
        {step===4&&(
          <div className="max-w-xl mx-auto space-y-6">
            <p className="text-center text-white/70 text-sm font-medium">Ölçüler, adet ve çubuk uzunluğu</p>

            {product&&(
              <div className="bg-green-500/10 border border-green-500/25 rounded-xl p-3 text-xs text-green-300 font-mono text-center">
                {product.name} izin verilen: {product.minW}–{product.maxW}m × {product.minH}–{product.maxH}m
              </div>
            )}

            <Card>
              <div className="text-white/55 text-xs font-display tracking-wider mb-5 uppercase">Pencere Ölçüleri</div>
              <div className="space-y-6">
                <SliderInput label="Genişlik" val={W} set={setW} min={product?.minW??0.4} max={product?.maxW??4} step={0.01} unit="m" color="#c9a84c"/>
                <SliderInput label="Yükseklik" val={H} set={setH} min={product?.minH??0.4} max={product?.maxH??4} step={0.01} unit="m" color="#c9a84c"/>
              </div>
              <div className="mt-4 bg-white/5 rounded-lg p-3 flex justify-between items-center">
                <span className="text-white/55 text-xs">Tek alan</span>
                <span className="text-gold-400 font-mono font-bold">{(Wc*Hc).toFixed(4)} m²</span>
              </div>
            </Card>

            <Card>
              <div className="text-white/55 text-xs font-display tracking-wider mb-4 uppercase">Adet</div>
              <div className="flex items-center gap-3 mb-2">
                <button onClick={()=>setQty(q=>Math.max(1,q-1))}
                  className="w-9 h-9 rounded-lg border border-white/20 text-white font-bold hover:bg-white/8 flex items-center justify-center">−</button>
                <input type="number" min={1} max={500} value={qty}
                  onChange={e=>setQty(Math.max(1,parseInt(e.target.value)||1))}
                  className="flex-1 bg-black/40 border border-white/20 rounded-lg px-3 py-2 text-center text-white font-mono font-bold text-lg focus:outline-none focus:border-green-400/60"/>
                <button onClick={()=>setQty(q=>Math.min(500,q+1))}
                  className="w-9 h-9 rounded-lg border border-white/20 text-white font-bold hover:bg-white/8 flex items-center justify-center">+</button>
              </div>
              {r&&<div className="text-white/40 text-xs font-mono text-center mt-2">Toplam: {(Wc*Hc*qty).toFixed(3)} m²</div>}
            </Card>

            <Card>
              <div className="text-white/55 text-xs font-display tracking-wider mb-4 uppercase">Profil Çubuk Uzunluğu</div>
              <div className="flex flex-wrap gap-2 mb-4">
                {[5.5,5.8,6.0,6.2,6.5].map(bl=>(
                  <button key={bl} onClick={()=>{setBarLength(bl);setUseCustomBar(false)}}
                    className={`px-3 py-1.5 text-xs border rounded-lg font-mono font-medium transition-all ${!useCustomBar&&barLength===bl?'border-green-400 bg-green-500/20 text-green-300':'border-white/20 text-white/60 hover:border-white/40 hover:text-white hover:bg-white/5'}`}>
                    {bl} m
                  </button>
                ))}
                <button onClick={()=>setUseCustomBar(true)}
                  className={`px-3 py-1.5 text-xs border rounded-lg font-mono font-medium transition-all ${useCustomBar?'border-amber-400 bg-amber-500/20 text-amber-300':'border-white/20 text-white/60 hover:border-white/40'}`}>
                  Özel
                </button>
              </div>
              {useCustomBar&&(
                <div className="flex items-center gap-3">
                  <label className="text-white/55 text-xs">Uzunluk:</label>
                  <input type="number" min={1} max={12} step={0.1} value={customBarLen}
                    onChange={e=>setCustomBarLen(parseFloat(e.target.value)||6)}
                    className="w-24 bg-black/40 border border-amber-400/30 rounded-lg px-2 py-1.5 text-sm font-mono text-white focus:outline-none focus:border-amber-400/60"/>
                  <span className="text-white/40 text-xs">m / çubuk</span>
                </div>
              )}
              {r&&<div className="mt-3 text-xs font-mono"><span className="text-white/40">Aktif: </span><span className="text-green-400 font-bold">{bLen} m</span><span className="text-white/40 ml-3">→ </span><span className="text-white font-bold">{r.barsNeeded} çubuk gerekiyor</span></div>}
            </Card>
          </div>
        )}

        {/* STEP 5 */}
        {step===5&&r&&(
          <div>
            <div className="flex justify-center flex-wrap gap-2 mb-8">
              {['summary','cutting','detail','quote'].map(t=>(
                <button key={t} onClick={()=>setTab(t)}
                  className={`px-4 py-2 text-xs font-display tracking-wide border rounded-lg transition-all font-medium ${tab===t?'border-green-400 bg-green-500/20 text-green-300':'border-white/20 text-white/55 hover:text-white hover:bg-white/5'}`}>
                  {{summary:'Özet',cutting:'Kesim Opt.',detail:'Detay',quote:'Fiyat Teklifi'}[t]}
                </button>
              ))}
            </div>

            {/* SUMMARY */}
            {tab==='summary'&&(
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <Card className="flex flex-col items-center justify-center">
                  <div className="text-white/50 text-xs font-display tracking-widest mb-3">ENERJİ SINIFI</div>
                  <div className="w-24 h-24 rounded-full border-4 flex items-center justify-center mb-3"
                    style={{borderColor:r.ec.color,boxShadow:`0 0 24px ${r.ec.color}55`}}>
                    <span className="text-3xl font-black" style={{color:r.ec.color}}>{r.ec.cls}</span>
                  </div>
                  <div className="text-2xl font-mono font-black text-white">{r.Uw.toFixed(4)}</div>
                  <div className="text-white/45 text-xs">W/m²K</div>
                </Card>
                <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <Metric label="Uw" val={r.Uw.toFixed(4)} unit="W/m²K" color={r.ec.color}/>
                  <Metric label="Cam alanı" val={(r.glassArea*qty).toFixed(3)} unit="m²" color="#60a5fa"/>
                  <Metric label="Profil" val={r.totalLinear.toFixed(2)} unit="m" color="#a78bfa"/>
                  <Metric label="Çubuk sayısı" val={r.barsNeeded} unit="ad" color="#22c55e"/>
                  <Metric label="Fire" val={r.cutting.wastePerc.toFixed(1)} unit="%" color={r.cutting.wastePerc<10?'#22c55e':'#f59e0b'}/>
                  <Metric label="Toplam" val={'₺'+fmt(vatChecked?r.total:r.subtotal)} color="#c9a84c"/>
                </div>
              </div>
            )}

            {/* CUTTING */}
            {tab==='cutting'&&(
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[['Toplam parça',r.allPieces.length+' ad','#60a5fa'],['Çubuk',r.barsNeeded+' ad','#22c55e'],['Net kullanım',r.cutting.totalUsed.toFixed(3)+' m','#a78bfa'],['Fire (atık)',r.cutting.waste.toFixed(3)+' m ('+r.cutting.wastePerc.toFixed(1)+'%)',r.cutting.wastePerc<10?'#22c55e':'#f59e0b']].map(([l,v,c])=>(
                    <Metric key={l} label={l} val={v} color={c}/>
                  ))}
                </div>

                <Card>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-white font-600">Kesim Planı — FFD Algoritması</div>
                    <div className="text-xs font-mono text-white/45">{bLen}m çubuklar · {r.allPieces.length} parça</div>
                  </div>
                  <div className="overflow-x-auto">
                    <svg viewBox={`0 0 560 ${r.cutting.bars.length*34+20}`}
                      style={{minWidth:400,width:'100%'}}>
                      {r.cutting.bars.map((bar,bi)=>{
                        const y=bi*34+16
                        let xCur=8
                        const scale=544/bLen
                        return(
                          <g key={bi}>
                            <rect x={8} y={y} width={544} height={26} fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.6" rx="2"/>
                            <text x={6} y={y+16} textAnchor="end" fontSize="6.5" fill="rgba(255,255,255,0.4)" fontFamily="monospace">#{bi+1}</text>
                            {bar.cuts.map((cut,ci)=>{
                              const cw=cut*scale-1.5
                              const rx=xCur+0.75
                              xCur+=cut*scale+0.003*scale
                              return(
                                <g key={ci}>
                                  <rect x={rx} y={y+2} width={cw} height={22} fill={BAR_COLORS[ci%BAR_COLORS.length]+'cc'} rx="1.5"/>
                                  {cw>26&&<text x={rx+cw/2} y={y+16} textAnchor="middle" fontSize="6" fill="rgba(0,0,0,0.85)" fontFamily="monospace">{cut.toFixed(2)}m</text>}
                                </g>
                              )
                            })}
                            {(bLen-bar.used)>0.05&&<text x={552} y={y+16} textAnchor="end" fontSize="5.5" fill="rgba(239,68,68,0.7)" fontFamily="monospace">fire:{(bLen-bar.used).toFixed(3)}m</text>}
                          </g>
                        )
                      })}
                    </svg>
                  </div>
                </Card>

                <Card>
                  <div className="text-white font-600 mb-3">Parça Listesi (1 pencere)</div>
                  <div className="flex flex-wrap gap-2">
                    {r.piecesPerWindow.map((p,i)=>(
                      <div key={i} className="px-3 py-1.5 bg-white/8 rounded-lg font-mono text-sm text-white/80 border border-white/12">
                        {p.toFixed(3)} m
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 text-xs font-mono text-white/45">
                    1 pencere = {r.piecesPerWindow.reduce((s,p)=>s+p,0).toFixed(3)} m lineer · {qty} adet = {r.totalLinear.toFixed(3)} m
                  </div>
                </Card>

                <Card>
                  <div className="text-white font-600 mb-3">Çubuk Detayı</div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {r.cutting.bars.map((bar,bi)=>(
                      <div key={bi} className="flex items-start gap-3 bg-white/3 rounded-lg p-2.5 font-mono text-xs">
                        <span className="text-white/40 w-7 flex-shrink-0">#{bi+1}</span>
                        <div className="flex flex-wrap gap-1.5 flex-1">
                          {bar.cuts.map((c,ci)=>(
                            <span key={ci} className="px-2 py-0.5 rounded-md text-black text-[10px] font-bold"
                              style={{background:BAR_COLORS[ci%BAR_COLORS.length]+'dd'}}>{c.toFixed(3)}m</span>
                          ))}
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-white/55">{bar.used.toFixed(3)}m kullanıldı</div>
                          <div className={`${(bLen-bar.used)>0.05?'text-amber-400':'text-green-400'}`}>
                            fire:{(bLen-bar.used).toFixed(3)}m
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <div className="flex justify-center mt-4">
                  <button onClick={handleDXF}
                    className="flex items-center gap-2 px-5 py-2.5 border border-blue-400/60 bg-blue-500/10 text-blue-300 text-sm font-mono font-bold rounded-lg hover:bg-blue-500/20 transition-colors">
                    AutoCAD DXF — Kesim Planı
                  </button>
                </div>
              </div>
            )}

            {/* DETAIL */}
            {tab==='detail'&&(
              <div className="max-w-2xl mx-auto space-y-4">
                <Card>
                  <div className="text-white font-600 mb-3">Uw Formülü (EN ISO 10077-1)</div>
                  <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-green-300 leading-loose border border-green-500/15">
                    Uw = (Ag×Ug + Af×Uf + Σlg×ψ) / (Ag+Af)<br/>
                    = ({r.glassArea.toFixed(4)}×{glass?.Ug} + {r.frameArea.toFixed(4)}×{profileSys?.Uf} + {r.perimeter.toFixed(3)}×0.06) / {r.totalArea.toFixed(4)}<br/>
                    <span className="text-white font-bold">= {r.Uw.toFixed(5)} W/m²K</span>
                  </div>
                </Card>
                <Card>
                  <div className="text-white font-600 mb-3">Alan Dağılımı</div>
                  <div className="space-y-2 font-mono text-xs">
                    {[['Tek pencere',r.totalArea.toFixed(4)+' m²'],['  ↳ Cam alanı',r.glassArea.toFixed(4)+' m²'],['  ↳ Çerçeve',r.frameArea.toFixed(4)+' m²'],['Toplam ('+qty+' ad)',(r.totalArea*qty).toFixed(3)+' m²'],['Cam toplam',(r.glassArea*qty).toFixed(3)+' m²']].map(([l,v])=>(
                      <div key={l} className="flex justify-between border-b border-white/8 pb-1.5">
                        <span className="text-white/60">{l}</span><span className="text-white/90">{v}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                <div className="flex justify-center mt-4">
                  <button onClick={handleDXF}
                    className="flex items-center gap-2 px-5 py-2.5 border border-blue-400/60 bg-blue-500/10 text-blue-300 text-sm font-mono font-bold rounded-lg hover:bg-blue-500/20 transition-colors">
                    AutoCAD DXF — Çerçeve Detayı
                  </button>
                </div>
              </div>
            )}

            {/* QUOTE */}
            {tab==='quote'&&(
              <div className="max-w-2xl mx-auto space-y-4">
                {/* Müşteri Bilgileri */}
                <Card>
                  <div className="text-white/55 text-xs font-display tracking-wider mb-4 uppercase">Müşteri Bilgileri</div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-white/55 text-xs mb-1.5">Müşteri / Proje Adı</label>
                      <input type="text" placeholder="Müşteri veya proje adı..." value={clientName}
                        onChange={e=>setClientName(e.target.value)}
                        className="w-full bg-black/40 border border-white/20 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-green-400/50"/>
                    </div>
                    <div>
                      <label className="block text-white/55 text-xs mb-1.5">Telefon (opsiyonel)</label>
                      <input type="text" placeholder="05xx xxx xx xx" value={clientPhone}
                        onChange={e=>setClientPhone(e.target.value)}
                        className="w-full bg-black/40 border border-white/20 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-green-400/50"/>
                    </div>
                    <div>
                      <label className="block text-white/55 text-xs mb-1.5">Notlar / Özel İstekler</label>
                      <textarea rows={2} placeholder="Montaj detayları, özel istekler..." value={extraNotes}
                        onChange={e=>setExtraNotes(e.target.value)}
                        className="w-full bg-black/40 border border-white/20 rounded-lg px-3 py-2.5 text-sm text-white placeholder-white/25 focus:outline-none focus:border-green-400/50 resize-none"/>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input type="checkbox" checked={vatChecked} onChange={e=>setVatChecked(e.target.checked)} className="w-4 h-4 accent-green-400"/>
                      <span className="text-white/65 text-sm">KDV dahil (%20)</span>
                    </label>
                    <div>
                      <label className="block text-white/55 text-xs mb-1.5">Kar Marjı (%)</label>
                      <div className="flex items-center gap-3">
                        <input type="range" min={0} max={100} step={5} value={marginPct} onChange={e=>setMarginPct(Number(e.target.value))} className="flex-1 accent-gold-500"/>
                        <span className="text-gold-400 font-bold text-sm w-12 text-right">%{marginPct}</span>
                      </div>
                      <p className="text-white/30 text-xs mt-1">Müşteri teklifinde maliyet üzerine eklenen kar</p>
                    </div>
                  </div>
                </Card>

                {/* Teklif önizleme */}
                <Card>
                  <div className="border-b border-white/12 pb-4 mb-4">
                    <div className="text-green-400 font-bold text-base">AluSight — Fiyat Teklifi</div>
                    <div className="text-white/40 text-xs mt-0.5">{new Date().toLocaleDateString('tr-TR',{year:'numeric',month:'long',day:'numeric'})}</div>
                    {clientName&&<div className="text-white/65 text-xs mt-0.5">Müşteri: {clientName}</div>}
                  </div>
                  <div className="space-y-2 font-mono text-sm">
                    {[
                      [`Profil (${r.barsNeeded} çubuk × ${bLen}m × ₺${profileSys?.pricePerM}/m)`,r.profileCost],
                      [`Cam (${(r.glassArea*qty).toFixed(3)} m² × ₺${glass?.pricePerM2}/m²)`,r.glassCost],
                      [`İşçilik (${(r.glassArea*qty).toFixed(3)} m² × ₺${LABOR}/m²)`,r.laborCost],
                      [`Donanım (${qty} ad × ₺${hardware?.price})`,r.hardwareCost],
                      ...(r.colorSurcharge>0?[[`Renk farkı (+${color?.surcharge}%)`,r.colorSurcharge]]:[]),
                    ].map(([l,v])=>(
                      <div key={l} className="flex justify-between border-b border-white/8 pb-2">
                        <span className="text-white/65">{l}</span>
                        <span className="text-white font-bold">₺{fmt(v)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between pt-1"><span className="text-white/55">Ara toplam</span><span className="text-white font-bold">₺{fmt(r.subtotal)}</span></div>
                    {vatChecked&&<div className="flex justify-between"><span className="text-white/55">KDV (%20)</span><span className="text-white font-bold">₺{fmt(r.vat)}</span></div>}
                    <div className="flex justify-between text-lg border-t border-white/15 pt-3 mt-1">
                      <span className="text-white font-bold">TOPLAM</span>
                      <span className="text-green-400 font-black">₺{fmt(vatChecked?r.total:r.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-white/40 text-xs">
                      <span>Birim ({qty} adet)</span>
                      <span>₺{fmt((vatChecked?r.total:r.subtotal)/qty)} / pencere</span>
                    </div>
                  </div>
                </Card>

                <div className="flex gap-3 justify-center flex-wrap">
                  <button onClick={handlePreview} disabled={pdfLoading}
                    className="px-7 py-2.5 border border-green-400/60 bg-green-500/10 text-green-300 text-sm font-display font-bold hover:bg-green-500/20 transition-colors rounded-lg disabled:opacity-50">
                    {pdfLoading?'Hazırlanıyor...':'PDF Önizle'}
                  </button>
                  <button onClick={handlePDF}
                    className="px-7 py-2.5 bg-green-500 text-white text-sm font-display font-bold hover:bg-green-400 transition-colors rounded-lg shadow-[0_4px_16px_rgba(34,197,94,0.4)]">
                    PDF İndir
                  </button>
                  <button onClick={handleCustomerQuotePDF}
                    className="px-7 py-2.5 bg-gold-500 text-black text-sm font-display font-bold hover:bg-gold-400 transition-colors rounded-lg shadow-[0_4px_16px_rgba(201,168,76,0.4)] flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                    Müşteri Teklifi PDF
                  </button>
                  <button onClick={handleDXF}
                    className="px-7 py-2.5 border border-blue-400/60 bg-blue-500/10 text-blue-300 text-sm font-display font-bold hover:bg-blue-500/20 transition-colors rounded-lg">
                    AutoCAD DXF
                  </button>
                  <button onClick={()=>{setStep(0);setProductId(null);setProfileId(null);setGlassId(null)}}
                    className="px-6 py-2.5 border border-white/25 text-white/60 text-sm font-display hover:bg-white/5 transition-colors rounded-lg">
                    Yeni Hesap
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Nav */}
        {step<5&&(
          <div className="flex justify-between mt-12">
            <button onClick={()=>setStep(s=>Math.max(0,s-1))}
              className={`px-6 py-2.5 border border-white/25 text-white/65 text-sm font-display rounded-lg transition-colors ${step===0?'opacity-0 pointer-events-none':'hover:bg-white/5'}`}>
              ← Geri
            </button>
            <button onClick={()=>setStep(s=>s+1)} disabled={!canNext()}
              className={`px-8 py-2.5 text-sm font-display tracking-wide rounded-lg transition-all font-medium ${canNext()?'bg-green-500 text-white hover:bg-green-400 shadow-[0_4px_20px_rgba(34,197,94,0.3)]':'border border-white/15 text-white/25 cursor-not-allowed'}`}>
              {step===4?'Hesapla →':'İleri →'}
            </button>
          </div>
        )}
      </div>
    </div>

    {/* PDF Preview Modal */}
    {pdfPreviewUrl&&(
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={()=>setPdfPreviewUrl(null)}>
        <div className="relative w-full max-w-4xl h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden" onClick={e=>e.stopPropagation()}>
          <div className="flex items-center justify-between px-5 py-3 bg-[#141e32] border-b border-white/10">
            <span className="text-white font-display font-bold text-sm tracking-wide">PVC Fiyat Teklifi — Önizleme</span>
            <div className="flex gap-2">
              <button onClick={handlePDF}
                className="px-4 py-1.5 bg-green-500 text-white text-xs font-bold rounded-lg hover:bg-green-400 transition-colors">
                PDF İndir
              </button>
              <button onClick={()=>setPdfPreviewUrl(null)}
                className="w-7 h-7 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors text-sm">
                ✕
              </button>
            </div>
          </div>
          <iframe src={pdfPreviewUrl} className="w-full h-[calc(90vh-52px)] border-0" title="PDF Önizleme"/>
        </div>
      </div>
    )}
    </>
  )
}
