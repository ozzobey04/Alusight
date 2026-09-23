import { useState, useMemo, useEffect } from 'react'
import { exportFlixoDXF } from '../utils/dxfExport'
import { printFlixoPDF, buildBlobUrl, buildFullHtmlDoc } from '../utils/printPDF'
import RaporIndir from '../components/RaporIndir'

/* ── Data ── */
const PROFILES = [
  { id:'std',  name:'Standart Alüminyum',    short:'STD',  desc:'Isı köprüsü kesici yok',         Uf:7.0,  psi_frame:0.14, psi_sill:0.20, psi_corner:0.10, color:'#ef4444', layers:[{label:'Al (tek parça)',d:60,lam:160,color:'#7ba7bc'}] },
  { id:'tb24', name:'Yalıtımlı 24 mm PA66', short:'TB-24',desc:'24 mm PA66 GF25 termal kesici',    Uf:1.8,  psi_frame:0.08, psi_sill:0.14, psi_corner:0.06, color:'#f59e0b', layers:[{label:'Al Dış',d:18,lam:160,color:'#7ba7bc'},{label:'PA66',d:24,lam:0.30,color:'#c9a84c'},{label:'Al İç',d:28,lam:160,color:'#7ba7bc'}] },
  { id:'tb34', name:'Yalıtımlı 34 mm PA66', short:'TB-34',desc:'34 mm genişletilmiş PA66 GF25',   Uf:1.4,  psi_frame:0.06, psi_sill:0.10, psi_corner:0.04, color:'#22c55e', layers:[{label:'Al Dış',d:16,lam:160,color:'#7ba7bc'},{label:'PA66',d:34,lam:0.30,color:'#c9a84c'},{label:'Al İç',d:24,lam:160,color:'#7ba7bc'}] },
  { id:'phi',  name:'Premium HI (Pasif Ev)', short:'PHI', desc:'52 mm PU+PA66 — PHI sertifikası', Uf:0.82, psi_frame:0.03, psi_sill:0.06, psi_corner:0.02, color:'#06b6d4', layers:[{label:'Al Dış',d:12,lam:160,color:'#7ba7bc'},{label:'PA66+PU',d:52,lam:0.25,color:'#b8860b'},{label:'Al İç',d:20,lam:160,color:'#7ba7bc'}] },
]
const GLAZINGS = [
  { id:'sg',   name:'Tekli Cam 4 mm',             Ug:5.7,  g:0.87, SHGC:0.76, VT:0.90, thick:4 },
  { id:'dg_a', name:'4+16+4 İki Katlı (Hava)',    Ug:2.8,  g:0.76, SHGC:0.63, VT:0.82, thick:24 },
  { id:'dg_ar',name:'4+16Ar+4 Low-e (Argon)',     Ug:1.1,  g:0.62, SHGC:0.50, VT:0.78, thick:24 },
  { id:'tg',   name:'4+12Ar+4+12Ar+4 Üçlü Low-e',Ug:0.65, g:0.50, SHGC:0.40, VT:0.70, thick:40 },
  { id:'vip',  name:'VIG Vakumlu Isı Camı',        Ug:0.40, g:0.52, SHGC:0.42, VT:0.72, thick:8  },
]
const CLIMATES = [
  { id:'ist', name:'İstanbul (Bölge 1)', Tout:-3,  RHout:80, zone:1 },
  { id:'brs', name:'Bursa (Bölge 2)',    Tout:-7,  RHout:78, zone:2 },
  { id:'ank', name:'Ankara (Bölge 3)',   Tout:-12, RHout:75, zone:3 },
  { id:'eze', name:'Erzurum (Bölge 4)',  Tout:-22, RHout:78, zone:4 },
  { id:'izm', name:'İzmir (Bölge 1)',    Tout:0,   RHout:70, zone:1 },
  { id:'ant', name:'Antalya (Bölge 1)',  Tout:2,   RHout:68, zone:1 },
  { id:'cus', name:'Özel Değer',         Tout:-5,  RHout:75, zone:2 },
]
const JUNCTIONS = [
  { id:'head',   name:'Üst Kasa (Lento)',     dflt:1.0 },
  { id:'sill',   name:'Alt Kasa (Denizlik)',  dflt:1.4 },
  { id:'jamb',   name:'Yan Kasa (×2)',        dflt:1.0 },
  { id:'corner', name:'Köşe Bağlantısı (×4)',dflt:0.7 },
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
const TS825 = [{zone:1,max:2.4},{zone:2,max:2.0},{zone:3,max:1.8},{zone:4,max:1.6}]

/* ── Calc ── */
function dewPoint(T,RH){ const a=17.625,b=243.04,al=Math.log(RH/100)+(a*T)/(b+T); return (b*al)/(a-al) }

function calc({profile,glazing,W,H,Tin,Tout,RHin,RHout,jMult}){
  const Ag=W*H*0.75, Af=W*H*0.25
  const ph=profile.psi_frame*(jMult.head??1), ps=profile.psi_sill*(jMult.sill??1.4)
  const pj=profile.psi_frame*(jMult.jamb??1), pc=profile.psi_corner*(jMult.corner??0.7)*4
  const psiTotal=W*ph + W*ps + 2*H*pj + pc
  const Uw=(Ag*glazing.Ug + Af*profile.Uf + psiTotal)/(Ag+Af)
  const Rsi=0.13,Rse=0.04,Rl=profile.layers.reduce((s,l)=>s+l.d/1000/l.lam,0)
  const Rt=Rsi+Rl+Rse
  const Tsi=Tin-(Tin-Tout)*(Rsi/Rt)
  const fRsi=(Tsi-Tout)/(Math.abs(Tin-Tout)||1)
  const Tdew=dewPoint(Tin,RHin)
  const ec=EC.find(e=>Uw<=e.max)||EC.at(-1)
  let rAcc=Rse; const layerTemps=profile.layers.map(l=>{rAcc+=l.d/1000/l.lam; return {label:l.label,T:(Tout+(Tin-Tout)*(rAcc/Rt)).toFixed(1)}})
  return {Uw,Ag,Af,lg_head:W,lg_sill:W,lg_jambs:2*H,psi_head:ph,psi_sill:ps,psi_jamb:pj,psi_corner:pc,psiTotal,Tsi,fRsi,Tdew_in:Tdew,condensRisk:Tsi<Tdew,ec,heatLoss:Uw*(Ag+Af)*(Tin-Tout),layerTemps,Rtotal:Rt,Rsi,Rse}
}

function insights({profile,glazing,r,Tin,Tout,RHin,climate}){
  const items=[], tsL=TS825.find(l=>l.zone===climate.zone)
  if(tsL) items.push({t:tsL&&r.Uw<=tsL.max?'success':'error', icon:r.Uw<=tsL.max?'✅':'🔴', text:`TS 825 Bölge ${climate.zone} limiti ${tsL.max} W/m²K — Uw = ${r.Uw.toFixed(3)}: ${r.Uw<=tsL.max?'UYUMLU':'AŞILDI'}.`})
  items.push({t:r.fRsi>=0.80?'success':r.fRsi<0.70?'error':'warning', icon:r.fRsi>=0.80?'🏆':r.fRsi<0.70?'⚠️':'🟡', text:`fRsi = ${r.fRsi.toFixed(3)} — ${r.fRsi>=0.80?'Mükemmel yüzey sıcaklık faktörü.':r.fRsi<0.70?'Kritik! Küf riski var.':'Orta seviye. Yüksek nemde yoğuşma olası.'}`})
  items.push({t:r.condensRisk?'error':'success', icon:r.condensRisk?'💧':'🌿', text:`${r.condensRisk?'Yoğuşma RİSKİ':'Yoğuşma yok'}: Tsi=${r.Tsi.toFixed(1)}°C, Tdew=${r.Tdew_in.toFixed(1)}°C (${RHin}% RH @ ${Tin}°C).`})
  const ann=r.heatLoss*24*200/1000
  items.push({t:'data',icon:'📊',text:`Yıllık tahmini ısı kaybı: ${ann.toFixed(0)} kWh (200 gün × ΔT=${Tin-Tout}°C).`})
  if(profile.id==='std') items.push({t:'suggestion',icon:'💡',text:`TB-24'e geçiş: Uf 7.0 → 1.8 W/m²K, yıllık ~${(ann*0.40).toFixed(0)} kWh/pencere tasarruf.`})
  if(glazing.id==='sg'||glazing.id==='dg_a') items.push({t:'suggestion',icon:'🔬',text:`Low-e Argon cam (Ug 1.1): ${((glazing.Ug-1.1)*r.Ag*(Tin-Tout)*24*200/1000).toFixed(0)} kWh/yıl tasarruf tahmini.`})
  return items
}

/* ── Step Bar ── */
const STEPS=['Profil','Cam','Bağlantı','Boyut & İklim','Sonuç']
function StepBar({step}){
  return(
    <div className="flex items-center justify-center flex-wrap gap-y-3 mb-10">
      {STEPS.map((s,i)=>(
        <div key={i} className="flex items-center">
          <div className={`flex flex-col items-center ${i<=step?'':'opacity-40'}`}>
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-300 ${i<step?'bg-gold-500 border-gold-500 text-black':i===step?'border-gold-400 text-gold-400 shadow-[0_0_14px_rgba(201,168,76,0.5)]':'border-white/20 text-white/30'}`}>
              {i<step?'✓':i+1}
            </div>
            <span className={`text-[9px] mt-1 text-center max-w-[60px] ${i===step?'text-gold-400':'text-white/35'}`}>{s}</span>
          </div>
          {i<STEPS.length-1&&<div className={`w-8 h-px mx-1 mb-5 ${i<step?'bg-gold-500':'bg-white/12'}`}/>}
        </div>
      ))}
    </div>
  )
}

/* ── Reusable slider+input ── */
function SliderInput({label,val,set,min,max,step=0.01,unit='m',color='#c9a84c'}){
  return(
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="text-white font-500 text-sm">{label}</label>
        <div className="flex items-center gap-2">
          <input type="number" min={min} max={max} step={step} value={val}
            onChange={e=>{const v=parseFloat(e.target.value);if(!isNaN(v))set(Math.max(min,Math.min(max,v)))}}
            className="w-20 bg-black/40 border border-white/25 rounded px-2 py-1 text-sm font-mono text-white text-right focus:outline-none focus:border-yellow-400/60 focus:bg-black/60"/>
          <span className="text-white/50 text-sm font-mono w-6">{unit}</span>
        </div>
      </div>
      <input type="range" min={min} max={max} step={step} value={val}
        onChange={e=>set(parseFloat(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer"
        style={{background:`linear-gradient(to right,${color} ${((val-min)/(max-min))*100}%,rgba(255,255,255,0.15) 0)`}}/>
      <div className="flex justify-between text-[10px] text-white/30 mt-1"><span>{min}{unit}</span><span>{max}{unit}</span></div>
    </div>
  )
}

/* ── Card wrapper ── */
function Card({children,className=''}){
  return <div className={`bg-black/50 backdrop-blur-sm border border-white/15 rounded-xl p-5 ${className}`}>{children}</div>
}

/* ── Cross Section ── */
function CrossSection({profile,W,H,handleDXF,glazing,r,Tin,Tout}){
  try{
    const fw=profile.layers.reduce((s,l)=>s+l.d,0)
    const wMM=W*1000,hMM=H*1000
    const SVG_W=320
    const rawH=SVG_W*hMM/wMM
    const SVG_H=Math.min(rawH,240)
    const sc=SVG_W/wMM
    const fwPx=fw*sc
    const gwPx=(wMM-2*fw)*sc
    const ghPx=(hMM-2*fw)*sc*(SVG_H/rawH)
    const S=4, dx0=SVG_W+36
    return(
      <div className="space-y-5">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-white font-semibold text-sm">Pencere Kesiti — {profile.name}</div>
              <div className="text-white/45 text-[11px] mt-0.5 font-mono">{wMM}x{hMM} mm · Cerceve: {fw} mm · {profile.layers.length} katman</div>
            </div>
            <button onClick={handleDXF}
              className="flex items-center gap-2 px-4 py-2 border border-blue-400/60 bg-blue-500/10 text-blue-300 text-xs font-mono font-bold rounded-lg hover:bg-blue-500/20 transition-colors">
              AutoCAD DXF
            </button>
          </div>
          <svg viewBox={`-44 -18 ${dx0+fw*S+30} ${Math.max(SVG_H,fw*S)+62}`} className="w-full" style={{maxHeight:400}}>
            <defs>
              <pattern id="alHatch" width="7" height="7" patternUnits="userSpaceOnUse">
                <line x1="0" y1="7" x2="7" y2="0" stroke="#7ba7bc" strokeWidth="0.9" opacity="0.45"/>
              </pattern>
              <pattern id="paHatch" width="5" height="5" patternUnits="userSpaceOnUse">
                <line x1="0" y1="2.5" x2="5" y2="2.5" stroke="#c9a84c" strokeWidth="0.8" opacity="0.55"/>
              </pattern>
              <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e3f6e" stopOpacity="0.7"/>
                <stop offset="100%" stopColor="#0f2040" stopOpacity="0.4"/>
              </linearGradient>
            </defs>
            <rect x={0} y={0} width={SVG_W} height={SVG_H} fill="none" stroke="#ffffff18" strokeWidth="1"/>
            <rect x={fwPx} y={fwPx} width={gwPx} height={ghPx} fill="url(#glassGrad)" stroke="#60a5fa" strokeWidth="0.8"/>
            <line x1={fwPx} y1={fwPx} x2={fwPx+gwPx} y2={fwPx+ghPx} stroke="#60a5fa" strokeWidth="0.5" opacity="0.35"/>
            <line x1={fwPx+gwPx} y1={fwPx} x2={fwPx} y2={fwPx+ghPx} stroke="#60a5fa" strokeWidth="0.5" opacity="0.35"/>
            <text x={SVG_W/2} y={SVG_H/2-5} textAnchor="middle" fontSize="7" fill="#60a5fa55" fontFamily="monospace">Ug = {glazing?.Ug} W/m2K</text>
            <text x={SVG_W/2} y={SVG_H/2+6} textAnchor="middle" fontSize="6" fill="#60a5fa40" fontFamily="monospace">{glazing?.name}</text>
            {(()=>{let lx=0;return profile.layers.map((l,i)=>{
              const isAl=l.lam>1,lw=l.d*sc
              const bg=isAl?'#0f2030':'#1c1508'
              const st=isAl?'#7ba7bc':'#c9a84c'
              const fill=isAl?'url(#alHatch)':'url(#paHatch)'
              const rx=lx;lx+=lw
              return(<g key={i}>
                <rect x={rx} y={0} width={lw} height={fwPx} fill={bg} stroke={st} strokeWidth="0.6"/>
                <rect x={rx} y={0} width={lw} height={fwPx} fill={fill}/>
                <rect x={rx} y={SVG_H-fwPx} width={lw} height={fwPx} fill={bg} stroke={st} strokeWidth="0.6"/>
                <rect x={rx} y={SVG_H-fwPx} width={lw} height={fwPx} fill={fill}/>
                <rect x={0} y={fwPx+rx} width={fwPx} height={lw} fill={bg} stroke={st} strokeWidth="0.6"/>
                <rect x={0} y={fwPx+rx} width={fwPx} height={lw} fill={fill}/>
                <rect x={SVG_W-fwPx} y={fwPx+rx} width={fwPx} height={lw} fill={bg} stroke={st} strokeWidth="0.6"/>
                <rect x={SVG_W-fwPx} y={fwPx+rx} width={fwPx} height={lw} fill={fill}/>
              </g>)
            })})()}
            {r&&<text x={SVG_W/2} y={SVG_H/2-18} textAnchor="middle" fontSize="9" fill={r.ec.color} fontFamily="monospace" fontWeight="bold">Uw = {r.Uw.toFixed(3)}</text>}
            <line x1={0} y1={SVG_H+10} x2={SVG_W} y2={SVG_H+10} stroke="#22c55e" strokeWidth="0.8"/>
            <line x1={0} y1={SVG_H+7} x2={0} y2={SVG_H+13} stroke="#22c55e" strokeWidth="0.8"/>
            <line x1={SVG_W} y1={SVG_H+7} x2={SVG_W} y2={SVG_H+13} stroke="#22c55e" strokeWidth="0.8"/>
            <text x={SVG_W/2} y={SVG_H+22} textAnchor="middle" fontSize="8" fill="#22c55e" fontFamily="monospace">{wMM} mm</text>
            <line x1={-9} y1={0} x2={-9} y2={SVG_H} stroke="#22c55e" strokeWidth="0.8"/>
            <line x1={-12} y1={0} x2={-6} y2={0} stroke="#22c55e" strokeWidth="0.8"/>
            <line x1={-12} y1={SVG_H} x2={-6} y2={SVG_H} stroke="#22c55e" strokeWidth="0.8"/>
            <text x={-30} y={SVG_H/2} textAnchor="middle" fontSize="8" fill="#22c55e" fontFamily="monospace" transform={`rotate(-90,-30,${SVG_H/2})`}>{hMM} mm</text>
            <line x1={0} y1={SVG_H+32} x2={fwPx} y2={SVG_H+32} stroke="#f59e0b" strokeWidth="0.7"/>
            <line x1={0} y1={SVG_H+29} x2={0} y2={SVG_H+35} stroke="#f59e0b" strokeWidth="0.7"/>
            <line x1={fwPx} y1={SVG_H+29} x2={fwPx} y2={SVG_H+35} stroke="#f59e0b" strokeWidth="0.7"/>
            <text x={fwPx/2} y={SVG_H+43} textAnchor="middle" fontSize="7" fill="#f59e0b" fontFamily="monospace">Cerceve {fw} mm</text>
            <text x={fwPx/2} y={SVG_H-fwPx-4} textAnchor="middle" fontSize="6.5" fill="#60a5fa" fontFamily="monospace">{Tout}C</text>
            <text x={SVG_W-fwPx/2} y={SVG_H-fwPx-4} textAnchor="middle" fontSize="6.5" fill="#f87171" fontFamily="monospace">{Tin}C</text>
            {r&&<text x={SVG_W/2} y={fwPx-4} textAnchor="middle" fontSize="6.5" fill="#a3e635" fontFamily="monospace">Tsi = {r.Tsi.toFixed(1)}C</text>}
            <line x1={SVG_W+18} y1={-14} x2={SVG_W+18} y2={Math.max(SVG_H,fw*S)+8} stroke="#ffffff12" strokeWidth="0.8" strokeDasharray="4,3"/>
            <text x={dx0+fw*S/2} y={-10} textAnchor="middle" fontSize="7.5" fill="#c9a84c" fontFamily="monospace">PROFIL KESITI 4:1</text>
            <rect x={dx0-4} y={-4} width={fw*S+8} height={fw*S+8} fill="none" stroke="#ffffff20" strokeWidth="0.7"/>
            {(()=>{let lx2=dx0;return profile.layers.map((l,i)=>{
              const isAl=l.lam>1,lw2=l.d*S
              const bg=isAl?'#0f2030':'#1c1508'
              const st=isAl?'#7ba7bc':'#c9a84c'
              const fill=isAl?'url(#alHatch)':'url(#paHatch)'
              const rx2=lx2;lx2+=lw2
              return(<g key={i}>
                <rect x={rx2} y={0} width={lw2} height={fw*S} fill={bg} stroke={st} strokeWidth="0.8"/>
                <rect x={rx2} y={0} width={lw2} height={fw*S} fill={fill}/>
                {lw2>14&&<>
                  <text x={rx2+lw2/2} y={fw*S/2-6} textAnchor="middle" fontSize="6.5" fill={st} fontFamily="monospace">{l.label}</text>
                  <text x={rx2+lw2/2} y={fw*S/2+3} textAnchor="middle" fontSize="6" fill={st} fontFamily="monospace">{l.d}mm</text>
                  <text x={rx2+lw2/2} y={fw*S/2+12} textAnchor="middle" fontSize="5.5" fill={st} fontFamily="monospace">lam={l.lam}</text>
                </>}
                <line x1={rx2} y1={fw*S+12} x2={rx2+lw2} y2={fw*S+12} stroke={st} strokeWidth="0.7" opacity="0.8"/>
                <line x1={rx2} y1={fw*S+9} x2={rx2} y2={fw*S+15} stroke={st} strokeWidth="0.7" opacity="0.8"/>
                <line x1={rx2+lw2} y1={fw*S+9} x2={rx2+lw2} y2={fw*S+15} stroke={st} strokeWidth="0.7" opacity="0.8"/>
                <text x={rx2+lw2/2} y={fw*S+24} textAnchor="middle" fontSize="6.5" fill={st} fontFamily="monospace">{l.d}mm</text>
              </g>)
            })})()}
            <line x1={dx0} y1={fw*S+36} x2={dx0+fw*S} y2={fw*S+36} stroke="#22c55e" strokeWidth="0.8"/>
            <line x1={dx0} y1={fw*S+33} x2={dx0} y2={fw*S+39} stroke="#22c55e" strokeWidth="0.8"/>
            <line x1={dx0+fw*S} y1={fw*S+33} x2={dx0+fw*S} y2={fw*S+39} stroke="#22c55e" strokeWidth="0.8"/>
            <text x={dx0+fw*S/2} y={fw*S+48} textAnchor="middle" fontSize="7.5" fill="#22c55e" fontFamily="monospace">Toplam: {fw} mm</text>
            <text x={dx0+fw*S/2} y={fw*S+58} textAnchor="middle" fontSize="7" fill={profile.color} fontFamily="monospace">Uf = {profile.Uf} W/m2K</text>
          </svg>
        </Card>
      </div>
    )
  }catch(e){
    return <div className="text-center py-10 text-white/40">Kesit görselleştirilemedi.</div>
  }
}


function Metric({label,val,unit='',color='#fff'}){
  return(
    <div className="bg-black/40 border border-white/12 rounded-lg p-3">
      <div className="text-white/50 text-[10px] font-mono mb-1">{label}</div>
      <div className="font-mono font-bold text-base leading-tight" style={{color}}>{val} <span className="text-xs font-normal opacity-60">{unit}</span></div>
    </div>
  )
}

export default function FlixoPage(){
  const [step,setStep]=useState(0)
  const [profileId,setProfileId]=useState(null)
  const [glazingId,setGlazingId]=useState(null)
  const [jMult,setJMult]=useState({head:1.0,sill:1.4,jamb:1.0,corner:0.7})
  const [W,setW]=useState(1.20)
  const [H,setH]=useState(1.50)
  const [climateId,setClimateId]=useState('ist')
  const [Tin,setTin]=useState(22)
  const [RHin,setRHin]=useState(55)

  useEffect(() => {}, [])
  const [customTout,setCustomTout]=useState(-5)
  const [tab,setTab]=useState('results')
  const [pdfPreviewUrl,setPdfPreviewUrl]=useState(null)
  const [pdfLoading,setPdfLoading]=useState(false)
  const [bulkWindows,setBulkWindows]=useState([{id:1,label:'Pencere 1',W:1.20,H:1.50,count:1}])
  const [showBulk,setShowBulk]=useState(false)
  const [aiSuggestion,setAiSuggestion]=useState('')
  const [aiLoading,setAiLoading]=useState(false)

  const profile=PROFILES.find(p=>p.id===profileId)
  const glazing=GLAZINGS.find(g=>g.id===glazingId)
  const climate=CLIMATES.find(c=>c.id===climateId)
  const Tout=climateId==='cus'?customTout:(climate?.Tout??-5)
  const RHout=climate?.RHout??75

  const r=useMemo(()=>{
    if(!profile||!glazing)return null
    return calc({profile,glazing,W,H,Tin,Tout,RHin,RHout,jMult})
  },[profile,glazing,W,H,Tin,Tout,RHin,RHout,jMult])

  const ins=useMemo(()=>{
    if(!r||!profile||!glazing||!climate)return[]
    return insights({profile,glazing,r,Tin,Tout,RHin,climate})
  },[r,profile,glazing,Tin,Tout,RHin,climate])

  const canNext=()=>{
    if(step===0)return!!profileId
    if(step===1)return!!glazingId
    return true
  }

  const handlePDF = () => {
    if (!r || !profile || !glazing) return
    printFlixoPDF({ profile, glazing, r, Tin, Tout, RHin, climate, W, H, insights: ins })
  }

  const handlePreview = () => {
    if (!r || !profile || !glazing) return
    printFlixoPDF({ profile, glazing, r, Tin, Tout, RHin, climate, W, H, insights: ins })
  }

  function buildFlixoHtml(raporProfil) {
    if (!r || !profile || !glazing) {
      return `<!DOCTYPE html><html lang="tr"><head><meta charset="UTF-8"></head><body><p style="padding:40px;font-family:Arial">Hesaplama verisi yok. Lütfen önce hesaplama yapın.</p></body></html>`
    }
    const fragment = printFlixoPDF({ profile, glazing, r, Tin, Tout, RHin, climate, W, H, insights: ins, returnHtml: true }) || ''

    /* Antet modunda AluSight dark header'ı gizle, footer'ı minimal yap */
    const antetCss = raporProfil?.antet
      ? `.header { display:none !important; } .footer { display:none !important; } .body { padding-top: 8px !important; }`
      : ''

    return buildFullHtmlDoc(fragment, antetCss)
  }

  const handleDXF=()=>{
    if(!profile||!glazing)return
    exportFlixoDXF({profile,glazing,W,H})
  }

  return(
    <>
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-5xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-full border border-gold-500/50 flex items-center justify-center text-xl bg-gold-500/15 text-2xl">🌡</div>
            <div className="text-left">
              <p className="text-gold-400 text-xs font-display tracking-[0.3em] uppercase">Hesaplamalar — Flixo</p>
              <h1 className="text-3xl font-display font-700 text-white leading-tight">Termal Köprü Analizi</h1>
            </div>
          </div>
          <p className="text-white/60 text-sm max-w-2xl mx-auto">EN ISO 10211 · EN ISO 10077-1 · EN ISO 13788 — ψ psi değerleri · fRsi faktörü · yoğuşma analizi</p>
          <div className="flex items-center justify-center flex-wrap gap-2 mt-3">
            {['EN ISO 10211','EN ISO 10077-1','EN ISO 13788','TS 825','PHI Cert'].map(s=>(
              <span key={s} className="text-[10px] px-2.5 py-0.5 rounded-sm border border-white/20 text-white/50 font-mono bg-white/5">{s}</span>
            ))}
          </div>
        </div>

        <StepBar step={step}/>

        {/* ── STEP 0: Profil ── */}
        {step===0&&(
          <div>
            <p className="text-center text-white/70 text-sm mb-8 font-medium">Alüminyum profil sistemini seçin</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {PROFILES.map(p=>(
                <button key={p.id} onClick={()=>setProfileId(p.id)}
                  className={`p-5 text-left border-2 rounded-xl transition-all duration-300 ${profileId===p.id?'border-gold-400 bg-gold-500/15 shadow-[0_0_24px_rgba(201,168,76,0.2)]':'border-white/15 bg-black/40 hover:border-white/35 hover:bg-black/60'}`}>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded" style={{background:p.color+'22',color:p.color,border:`1px solid ${p.color}55`}}>{p.short}</span>
                    {profileId===p.id&&<span className="w-5 h-5 rounded-full bg-gold-500 flex items-center justify-center text-black text-xs">✓</span>}
                  </div>
                  <div className="text-white font-600 text-sm mb-1">{p.name}</div>
                  <div className="text-white/55 text-xs leading-relaxed mb-4">{p.desc}</div>
                  <div className="space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between bg-white/5 rounded px-2 py-1"><span className="text-white/50">Uf</span><span style={{color:p.color}} className="font-bold">{p.Uf} W/m²K</span></div>
                    <div className="flex justify-between bg-white/5 rounded px-2 py-1"><span className="text-white/50">ψ çerçeve</span><span className="text-white/80">{p.psi_frame}</span></div>
                    <div className="flex justify-between bg-white/5 rounded px-2 py-1"><span className="text-white/50">ψ denizlik</span><span className="text-white/80">{p.psi_sill}</span></div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 1: Cam ── */}
        {step===1&&(
          <div>
            <p className="text-center text-white/70 text-sm mb-8 font-medium">Cam konfigürasyonunu seçin</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {GLAZINGS.map(g=>(
                <button key={g.id} onClick={()=>setGlazingId(g.id)}
                  className={`p-5 text-left border-2 rounded-xl transition-all duration-300 ${glazingId===g.id?'border-gold-400 bg-gold-500/15':'border-white/15 bg-black/40 hover:border-white/35 hover:bg-black/60'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-white font-600 text-sm leading-tight">{g.name}</span>
                    {glazingId===g.id&&<span className="w-5 h-5 flex-shrink-0 rounded-full bg-gold-500 flex items-center justify-center text-black text-xs ml-2">✓</span>}
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 text-xs font-mono mt-3">
                    {[['Ug',g.Ug+' W/m²K','#60a5fa'],['g',g.g,'#f59e0b'],['SHGC',g.SHGC,'#a78bfa'],['VT',g.VT,'#22c55e']].map(([l,v,c])=>(
                      <div key={l} className="bg-white/8 rounded p-1.5">
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

        {/* ── STEP 2: Bağlantı ── */}
        {step===2&&(
          <div className="max-w-2xl mx-auto">
            <p className="text-center text-white/70 text-sm mb-2 font-medium">ψ bağlantı noktası çarpanlarını ayarlayın</p>
            <p className="text-center text-white/45 text-xs mb-8">EN ISO 10211 — Varsayılan değerler standarttır, gerekirse değiştirin</p>
            <div className="space-y-4">
              {JUNCTIONS.map(jt=>{
                const val=jMult[jt.id]??jt.dflt
                const basePsi=jt.id==='sill'?profile?.psi_sill:jt.id==='corner'?profile?.psi_corner:profile?.psi_frame
                return(
                  <Card key={jt.id}>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="text-white font-600 text-sm">{jt.name}</div>
                        <div className="text-white/50 text-xs font-mono mt-0.5">ψ efektif = {((basePsi??0)*val).toFixed(4)} W/mK</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="number" min={0.3} max={3.0} step={0.1} value={val}
                          onChange={e=>{const v=parseFloat(e.target.value);if(!isNaN(v))setJMult(prev=>({...prev,[jt.id]:Math.max(0.3,Math.min(3,v))}))}}
                          className="w-16 bg-black/40 border border-white/25 rounded px-2 py-1 text-sm font-mono text-gold-400 text-center focus:outline-none focus:border-gold-400/60"/>
                        <span className="text-white/50 text-xs">×</span>
                      </div>
                    </div>
                    <input type="range" min={0.3} max={3.0} step={0.1} value={val}
                      onChange={e=>setJMult(prev=>({...prev,[jt.id]:parseFloat(e.target.value)}))}
                      className="w-full h-2 rounded-full appearance-none cursor-pointer"
                      style={{background:`linear-gradient(to right,#c9a84c ${((val-0.3)/2.7)*100}%,rgba(255,255,255,0.12) 0)`}}/>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* ── STEP 3: Boyut & İklim ── */}
        {step===3&&(
          <div className="max-w-2xl mx-auto space-y-6">
            <p className="text-center text-white/70 text-sm font-medium">Boyutlar ve iklim koşullarını girin</p>
            <Card>
              <div className="text-white/60 text-xs font-display tracking-wider mb-5 uppercase">Pencere Boyutları</div>
              <div className="space-y-6">
                <SliderInput label="Genişlik" val={W} set={setW} min={0.3} max={4.0} step={0.01} unit="m"/>
                <SliderInput label="Yükseklik" val={H} set={setH} min={0.3} max={4.0} step={0.01} unit="m"/>
              </div>
              <div className="mt-4 bg-white/5 rounded-lg p-3 flex items-center justify-between">
                <span className="text-white/50 text-xs">Toplam alan</span>
                <span className="text-gold-400 font-mono font-bold">{(W*H).toFixed(4)} m²</span>
              </div>
            </Card>

            <Card>
              <div className="text-white/60 text-xs font-display tracking-wider mb-4 uppercase">Şehir / TS 825 İklim Bölgesi</div>
              <div className="flex flex-wrap gap-2 mb-4">
                {CLIMATES.map(c=>(
                  <button key={c.id} onClick={()=>setClimateId(c.id)}
                    className={`px-3 py-1.5 text-xs border rounded-lg transition-all font-medium ${climateId===c.id?'border-gold-400 bg-gold-500/20 text-gold-300':'border-white/20 text-white/60 hover:border-white/40 hover:text-white hover:bg-white/5'}`}>
                    {c.name}{c.id!=='cus'&&<span className="ml-1.5 opacity-60">{c.Tout}°C</span>}
                  </button>
                ))}
              </div>
              {climateId==='cus'&&(
                <div className="mb-4">
                  <SliderInput label="Özel dış sıcaklık (Tout)" val={customTout} set={setCustomTout} min={-35} max={15} step={1} unit="°C" color="#60a5fa"/>
                </div>
              )}
            </Card>

            <Card>
              <div className="text-white/60 text-xs font-display tracking-wider mb-5 uppercase">İç Ortam Koşulları</div>
              <div className="space-y-5">
                <SliderInput label="İç sıcaklık (Tin)" val={Tin} set={setTin} min={15} max={30} step={1} unit="°C" color="#f87171"/>
                <SliderInput label="İç bağıl nem (RHin)" val={RHin} set={setRHin} min={30} max={85} step={5} unit="%" color="#60a5fa"/>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 text-xs font-mono">
                {[['Tout',`${Tout}°C`,'#60a5fa'],['Tin',`${Tin}°C`,'#f87171'],['ΔT',`${Tin-Tout}°C`,'#c9a84c']].map(([l,v,c])=>(
                  <div key={l} className="bg-white/5 rounded p-2 text-center">
                    <div className="text-white/40 mb-0.5">{l}</div>
                    <div className="font-bold" style={{color:c}}>{v}</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* ── STEP 4: Sonuç ── */}
        {step===4&&!r&&(
          <div className="max-w-md mx-auto text-center py-20">
            <div className="text-5xl mb-4">⚠️</div>
            <div className="text-white/70 text-lg font-display mb-2">Hesaplama tamamlanamadı</div>
            <div className="text-white/40 text-sm mb-8">Profil ve cam seçimlerini tamamlayıp tekrar deneyin.</div>
            <button onClick={()=>setStep(0)}
              className="px-6 py-2.5 bg-gold-500 text-black text-sm font-display font-bold rounded-lg hover:bg-gold-400 transition-colors">
              Başa Dön
            </button>
          </div>
        )}

        {step===4&&r&&(
          <div>
            <div className="flex justify-center flex-wrap gap-2 mb-8">
              {['results','psi','cross','ai','report'].map(t=>(
                <button key={t} onClick={()=>setTab(t)}
                  className={`px-4 py-2 text-xs font-display tracking-wide border rounded-lg transition-all font-medium ${tab===t?'border-gold-400 bg-gold-500/20 text-gold-300':'border-white/20 text-white/55 hover:text-white hover:bg-white/5'}`}>
                  {{results:'Sonuçlar',psi:'ψ Değerleri',cross:'Kesit',ai:'AluSight Analiz',report:'Rapor'}[t]}
                </button>
              ))}
            </div>

            {tab==='results'&&(
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <Card className="flex flex-col items-center justify-center">
                  <div className="text-white/50 text-xs font-display tracking-widest mb-3">ENERJİ SINIFI</div>
                  <div className="w-28 h-28 rounded-full border-4 flex items-center justify-center mb-3"
                    style={{borderColor:r.ec.color,boxShadow:`0 0 32px ${r.ec.color}55`}}>
                    <span className="text-4xl font-black" style={{color:r.ec.color}}>{r.ec.cls}</span>
                  </div>
                  <div className="text-3xl font-mono font-black text-white">{r.Uw.toFixed(4)}</div>
                  <div className="text-white/50 text-xs mt-1">W/m²K — EN ISO 10077-1</div>
                </Card>
                <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <Metric label="Uw" val={r.Uw.toFixed(4)} unit="W/m²K" color={r.ec.color}/>
                  <Metric label="Ug (cam)" val={glazing?.Ug.toFixed(2)} unit="W/m²K" color="#60a5fa"/>
                  <Metric label="Uf (çerçeve)" val={profile?.Uf.toFixed(2)} unit="W/m²K" color="#a78bfa"/>
                  <Metric label="fRsi" val={r.fRsi.toFixed(4)} color={r.fRsi>=0.7?'#22c55e':'#ef4444'}/>
                  <Metric label="Tsi (iç yüzey)" val={r.Tsi.toFixed(2)+'°C'} color={r.condensRisk?'#ef4444':'#22c55e'}/>
                  <Metric label="Tdew (çiğ)" val={r.Tdew_in.toFixed(2)+'°C'} color="#60a5fa"/>
                  <Metric label="Rtotal" val={r.Rtotal.toFixed(4)} unit="m²K/W" color="#c9a84c"/>
                  <Metric label="Isı kaybı" val={r.heatLoss.toFixed(0)} unit="W" color="#f87171"/>
                  <Metric label="Yoğuşma" val={r.condensRisk?'RİSK':'YOK'} color={r.condensRisk?'#ef4444':'#22c55e'}/>
                </div>
                <div className="lg:col-span-3">
                  <Card>
                    <div className="text-white/50 text-xs font-display mb-3">TS 825 Bölge Limitleri</div>
                    <div className="flex gap-2">
                      {TS825.map(lim=>{
                        const pass=r.Uw<=lim.max
                        return(
                          <div key={lim.zone} className={`flex-1 p-2 rounded-lg text-center text-xs font-mono border ${pass?'border-green-500/40 bg-green-500/12':'border-red-500/30 bg-red-500/10'}`}>
                            <div className="text-white/50 text-[9px]">Bölge {lim.zone}</div>
                            <div className="text-white/70 font-bold">≤{lim.max}</div>
                            <div className={pass?'text-green-400':'text-red-400'}>{pass?'✓':'✗'}</div>
                          </div>
                        )
                      })}
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {tab==='psi'&&(
              <div className="max-w-2xl mx-auto space-y-4">
                <Card>
                  <div className="text-white font-600 mb-4">ψ Doğrusal Isı Köprüsü Değerleri</div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-mono">
                      <thead><tr className="border-b border-white/15">
                        {['Bağlantı','ψ (W/mK)','Uzunluk (m)','Katkı'].map(h=><th key={h} className="text-left text-white/50 py-2 pr-4">{h}</th>)}
                      </tr></thead>
                      <tbody className="space-y-1">
                        {[
                          ['Üst kasa',r.psi_head.toFixed(4),r.lg_head.toFixed(3),(r.psi_head*r.lg_head).toFixed(4)],
                          ['Alt kasa (denizlik)',r.psi_sill.toFixed(4),r.lg_sill.toFixed(3),(r.psi_sill*r.lg_sill).toFixed(4)],
                          ['Yan kasalar (×2)',r.psi_jamb.toFixed(4),r.lg_jambs.toFixed(3),(r.psi_jamb*r.lg_jambs).toFixed(4)],
                          ['Köşe (×4)',(r.psi_corner/4).toFixed(4),'4',r.psi_corner.toFixed(4)],
                        ].map((row,i)=>(
                          <tr key={i} className="border-b border-white/8">
                            {row.map((v,j)=><td key={j} className={`py-2 pr-4 ${j===3?'text-gold-400 font-bold':j===0?'text-white/80':'text-white/65'}`}>{v}</td>)}
                          </tr>
                        ))}
                        <tr className="bg-white/5">
                          <td className="py-2 pr-4 text-white font-bold" colSpan={3}>Σ Toplam ψ katkısı</td>
                          <td className="py-2 text-gold-400 font-bold">{r.psiTotal.toFixed(4)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Card>
                <Card>
                  <div className="text-white font-600 mb-4">Katman Arayüz Sıcaklıkları</div>
                  <div className="space-y-2 font-mono text-xs">
                    <div className="flex justify-between py-1.5 border-b border-white/8"><span className="text-white/55">Dış hava</span><span className="text-cyan-400 font-bold">{Tout}°C</span></div>
                    {r.layerTemps.map((lt,i)=>(
                      <div key={i} className="flex justify-between py-1.5 border-b border-white/8"><span className="text-white/65">{lt.label}</span><span className="text-amber-400 font-bold">{lt.T}°C</span></div>
                    ))}
                    <div className="flex justify-between py-1.5 border-b border-white/8"><span className="text-white/55">İç yüzey (Tsi)</span><span className={`font-bold ${r.condensRisk?'text-red-400':'text-green-400'}`}>{r.Tsi.toFixed(2)}°C</span></div>
                    <div className="flex justify-between py-1.5"><span className="text-white/55">İç hava</span><span className="text-red-300 font-bold">{Tin}°C</span></div>
                  </div>
                </Card>
                <Card>
                  <div className="text-white font-600 mb-4">Termal Direnç Dağılımı</div>
                  <div className="space-y-1.5 font-mono text-xs">
                    <div className="flex justify-between text-white/55 border-b border-white/8 pb-1.5"><span>Rse (dış yüzey)</span><span className="text-white/70">0.0400 m²K/W</span></div>
                    {profile.layers.map((l,i)=>(
                      <div key={i} className="flex justify-between border-b border-white/8 pb-1.5">
                        <span className="text-white/65">{l.label} ({l.d}mm, λ={l.lam})</span>
                        <span className="text-white/80">{(l.d/1000/l.lam).toFixed(5)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between text-white/55 border-b border-white/8 pb-1.5"><span>Rsi (iç yüzey)</span><span className="text-white/70">0.1300 m²K/W</span></div>
                    <div className="flex justify-between font-bold pt-1"><span className="text-white/80">Rtotal</span><span className="text-gold-400">{r.Rtotal.toFixed(5)} m²K/W</span></div>
                  </div>
                </Card>
              </div>
            )}

            {tab==='cross'&&<CrossSection profile={profile} W={W} H={H} handleDXF={handleDXF} glazing={glazing} r={r} Tin={Tin} Tout={Tout}/>}

            {tab==='ai'&&(
              <div className="max-w-3xl mx-auto space-y-6">
                {/* Analiz kartlari */}
                <div className="space-y-3">
                  <p className="text-center text-white/55 text-xs mb-4">AluSight analiz — {profile.name} + {glazing.name}</p>
                  {ins.map((i,idx)=>(
                    <div key={idx} className={`flex gap-4 p-4 rounded-xl border ${
                      i.t==='error'?'bg-red-500/10 border-red-500/30':
                      i.t==='warning'?'bg-amber-500/10 border-amber-500/30':
                      i.t==='success'?'bg-green-500/10 border-green-500/30':
                      i.t==='suggestion'?'bg-yellow-500/10 border-yellow-500/30':
                      'bg-blue-500/10 border-blue-500/30'}`}>
                      <span className="text-2xl flex-shrink-0">{i.icon}</span>
                      <p className="text-white/85 text-sm leading-relaxed">{i.text}</p>
                    </div>
                  ))}
                </div>

                {/* Profil karsilastirma */}
                <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                  <h3 className="text-gold-400 font-bold text-sm mb-4">Tüm Profiller Karşılaştrması</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead><tr className="border-b border-white/10">
                        <th className="text-left py-2 text-white/40 font-normal">Profil</th>
                        <th className="text-center py-2 text-white/40 font-normal">Uw (W/m²K)</th>
                        <th className="text-center py-2 text-white/40 font-normal">Sınıf</th>
                        <th className="text-center py-2 text-white/40 font-normal">Yıllık Kayıp</th>
                        <th className="text-center py-2 text-white/40 font-normal">Seçiliye göre fark</th>
                      </tr></thead>
                      <tbody>
                        {PROFILES.map(p=>{
                          const cr=calc({profile:p,glazing,W,H,Tin,Tout,RHin,RHout,jMult})
                          const isSelected=p.id===profile.id
                          const annualLoss=(cr.heatLoss*24*200/1000).toFixed(0)
                          const diff=r?((cr.heatLoss-r.heatLoss)*24*200/1000).toFixed(0):'0'
                          const ec2=EC.find(e=>cr.Uw<=e.max)||EC.at(-1)
                          return(
                            <tr key={p.id} className={`border-b border-white/5 ${isSelected?'bg-gold-500/10':''}`}>
                              <td className="py-2.5 pr-3">
                                <div className={`font-semibold ${isSelected?'text-gold-400':'text-white/70'}`}>{p.short}</div>
                                <div className="text-white/35 text-[10px]">{p.desc}</div>
                              </td>
                              <td className="text-center py-2.5 font-mono" style={{color:p.color}}>{cr.Uw.toFixed(3)}</td>
                              <td className="text-center py-2.5"><span className="px-1.5 py-0.5 rounded text-[10px] font-bold" style={{color:ec2.color,background:ec2.color+'22'}}>{ec2.cls}</span></td>
                              <td className="text-center py-2.5 font-mono text-white/70">{annualLoss} kWh</td>
                              <td className="text-center py-2.5 font-mono">{isSelected
                                ?<span className="text-gold-400 text-[10px]">Seçili</span>
                                :<span className={Number(diff)>0?'text-red-400':'text-green-400'}>{Number(diff)>0?'+':''}{diff} kWh</span>}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Toplu pencere hesabi */}
                <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gold-400 font-bold text-sm">Toplu Pencere Hesabı</h3>
                    <button onClick={()=>setShowBulk(b=>!b)} className="text-xs text-white/50 hover:text-white border border-white/20 px-3 py-1 rounded-lg transition-colors">{showBulk?'Kapat':'Düzenle'}</button>
                  </div>
                  {showBulk&&(
                    <div className="space-y-2 mb-4">
                      {bulkWindows.map((bw,bi)=>(
                        <div key={bw.id} className="flex gap-2 items-center flex-wrap">
                          <input value={bw.label} onChange={e=>{const u=[...bulkWindows];u[bi]={...u[bi],label:e.target.value};setBulkWindows(u)}} className="bg-black/30 border border-white/10 rounded px-2 py-1 text-xs text-white w-28" placeholder="Etiket"/>
                          <input type="number" value={bw.W} step="0.1" min="0.3" max="4" onChange={e=>{const u=[...bulkWindows];u[bi]={...u[bi],W:parseFloat(e.target.value)||1.2};setBulkWindows(u)}} className="bg-black/30 border border-white/10 rounded px-2 py-1 text-xs text-white w-16" placeholder="G(m)"/>
                          <input type="number" value={bw.H} step="0.1" min="0.3" max="4" onChange={e=>{const u=[...bulkWindows];u[bi]={...u[bi],H:parseFloat(e.target.value)||1.5};setBulkWindows(u)}} className="bg-black/30 border border-white/10 rounded px-2 py-1 text-xs text-white w-16" placeholder="Y(m)"/>
                          <input type="number" value={bw.count} min="1" max="100" onChange={e=>{const u=[...bulkWindows];u[bi]={...u[bi],count:parseInt(e.target.value)||1};setBulkWindows(u)}} className="bg-black/30 border border-white/10 rounded px-2 py-1 text-xs text-white w-14" placeholder="Adet"/>
                          <button onClick={()=>setBulkWindows(b=>b.filter((_,i2)=>i2!==bi))} className="text-red-400/60 hover:text-red-400 px-1">×</button>
                        </div>
                      ))}
                      <button onClick={()=>setBulkWindows(b=>[...b,{id:Date.now(),label:'Pencere '+(b.length+1),W:1.20,H:1.50,count:1}])} className="text-xs text-gold-400/70 hover:text-gold-400 border border-gold-500/20 px-3 py-1 rounded-lg transition-colors">+ Pencere Ekle</button>
                    </div>
                  )}
                  {profile&&glazing&&(()=>{
                    const rows=bulkWindows.map(bw=>{const br=calc({profile,glazing,W:bw.W,H:bw.H,Tin,Tout,RHin,RHout,jMult});const al=br.heatLoss*24*200/1000;return{...bw,Uw:br.Uw,annualTotal:al*bw.count}})
                    const totalAnnual=rows.reduce((s,row)=>s+row.annualTotal,0)
                    const totalCount=rows.reduce((s,row)=>s+row.count,0)
                    return(
                      <div>
                        <table className="w-full text-xs mb-3">
                          <thead><tr className="border-b border-white/10">
                            <th className="text-left py-1.5 text-white/40 font-normal">Pencere</th>
                            <th className="text-center text-white/40 font-normal">Boyut</th>
                            <th className="text-center text-white/40 font-normal">Adet</th>
                            <th className="text-center text-white/40 font-normal">Uw</th>
                            <th className="text-center text-white/40 font-normal">Yıllık</th>
                          </tr></thead>
                          <tbody>{rows.map(row=>(
                            <tr key={row.id} className="border-b border-white/5">
                              <td className="py-1.5 text-white/70">{row.label}</td>
                              <td className="text-center text-white/50">{row.W.toFixed(2)}×{row.H.toFixed(2)}m</td>
                              <td className="text-center text-white/70">{row.count}</td>
                              <td className="text-center font-mono text-gold-400">{row.Uw.toFixed(3)}</td>
                              <td className="text-center font-mono text-white/70">{row.annualTotal.toFixed(0)} kWh</td>
                            </tr>
                          ))}</tbody>
                        </table>
                        <div className="flex justify-between items-center bg-gold-500/10 border border-gold-500/20 rounded-lg px-4 py-3">
                          <div className="text-xs text-white/60">{totalCount} pencere — Toplam Yıllık Isı Kaybı</div>
                          <div className="text-gold-400 font-black text-lg font-mono">{totalAnnual.toFixed(0)} kWh/yıl</div>
                        </div>
                      </div>
                    )
                  })()}
                </div>

                {/* AluSight Profil Değerlendirmesi — kural tabanlı, API bağımsız */}
                <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                  <h3 className="text-gold-400 font-bold text-sm mb-3">AluSight Profil Değerlendirmesi</h3>
                  {!aiSuggestion&&!aiLoading&&(
                    <button onClick={()=>{
                      setAiLoading(true)
                      setTimeout(()=>{
                        const uw=r?.Uw||0
                        const cond=r?.condensRisk
                        const frsi=r?.fRsi||0
                        const zone=climate?.zone||3
                        const limit={1:2.0,2:1.8,3:1.6,4:1.4}[zone]||1.6
                        const pass=uw<=limit

                        // Performans skoru
                        const perf = uw<=0.8?'A+++ (Pasif Ev)':uw<=1.0?'A++ (Mükemmel)':uw<=1.3?'A+ (Çok İyi)':uw<=1.6?'A (İyi)':uw<=2.0?'B (Orta)':'C (Yetersiz)'

                        // Profil önerisi
                        let profilOneri=''
                        if(uw>1.8) profilOneri=`Mevcut ${profile.name} profili bu iklim bölgesi için yetersiz. En az TB-34 veya termal köprü kesme genişliği ≥34 mm olan bir profil kullanılmalı.`
                        else if(uw>1.4&&zone>=3) profilOneri=`${profile.name} profilini ${zone===4?'PHI veya TB-34':'TB-34'} ile değiştirerek Uw değerini ${(uw-0.4).toFixed(2)} W/m²K'a indirmeniz mümkün.`
                        else if(uw<=1.0) profilOneri=`${profile.name} mükemmel bir seçim. Bu iklim bölgesinde pasif ev standardına yakın performans elde ediyorsunuz.`
                        else profilOneri=`${profile.name} bu bölge için uygun bir profil. Uw=${uw.toFixed(2)} W/m²K ile TS 825 Bölge ${zone} limitini (${limit} W/m²K) ${pass?'karşılıyor':'aşıyor'}.`

                        // Cam önerisi
                        let camOneri=''
                        if(glazing.name.includes('Tek')) camOneri='Tek cam kullanımı ciddi ısı kaybına yol açıyor. En az 4/16Ar/4 Low-E çift cam ile geçiş yapılması önerilir.'
                        else if(!glazing.name.includes('Low-E')&&zone>=3) camOneri='Mevcut cam Low-E kaplama içermiyor. Low-E çift cam ile g değerini düşürüp Ug\'yi ≤1.0\'a indirebilirsiniz.'
                        else if(glazing.name.includes('Üçlü')) camOneri='Üçlü cam tercihiniz çok isabetli. Yüksek ısı yalıtımı ve ses azaltımını aynı anda sağlıyor.'
                        else camOneri=`${glazing.name} bu proje için dengeli bir seçim.`

                        // Yoğuşma uyarısı
                        let yogusma=''
                        if(cond) yogusma=' ⚠️ Yoğuşma riski tespit edildi — profil iç yüzey sıcaklığı düşük (fRsi='+frsi.toFixed(3)+'). Termal köprü genişliği artırılmalı veya iç ortam nem kontrolü yapılmalı.'
                        else yogusma=' Yoğuşma riski yok (fRsi='+frsi.toFixed(3)+').'

                        // Toplam değerlendirme
                        const result=`Performans Sınıfı: ${perf}\n\n${profilOneri}\n\n${camOneri}${yogusma}\n\nÖnerilen kombinasyon: ${uw>1.4?'TB-34 + 4/16Ar/4 Low-E ile':'Mevcut seçiminiz ile'} Bölge ${zone} standardı ${uw>limit?'sağlanamıyor — revizyon gerekli':'karşılanıyor ✓'}.`
                        setAiSuggestion(result)
                        setAiLoading(false)
                      },600)
                    }}
                    className="w-full bg-gold-500/10 hover:bg-gold-500/20 border border-gold-500/30 text-gold-400 text-sm font-semibold py-3 rounded-lg transition-all">
                      AluSight Değerlendirmesi Al
                    </button>
                  )}
                  {aiLoading&&(
                    <div className="text-center py-4">
                      <div className="w-6 h-6 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"/>
                      <p className="text-xs text-gold-400">AluSight analiz ediyor...</p>
                    </div>
                  )}
                  {aiSuggestion&&!aiLoading&&(
                    <div className="space-y-2">
                      <div className="bg-gold-500/5 border border-gold-500/20 rounded-lg p-4 text-sm text-white/80 leading-relaxed">{aiSuggestion}</div>
                      <button onClick={()=>setAiSuggestion('')} className="text-xs text-white/30 hover:text-white/60">Yenile</button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {tab==='report'&&(
              <div className="max-w-2xl mx-auto">
                <Card className="space-y-5">
                  <div className="border-b border-white/15 pb-4">
                    <div className="text-gold-400 font-bold text-base">AluSight — Termal Köprü Raporu</div>
                    <div className="text-white/45 text-xs mt-1">Flixo Modülü · {new Date().toLocaleDateString('tr-TR',{year:'numeric',month:'long',day:'numeric'})}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                    {[['Profil',profile.name],['Cam',glazing.name],['Boyut',`${W.toFixed(2)}×${H.toFixed(2)}m`],['Bölge',climate?.name]].map(([l,v])=>(
                      <div key={l}><div className="text-white/35 uppercase tracking-wider text-[9px] mb-0.5">{l}</div><div className="text-white/85">{v}</div></div>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[['Uw',r.Uw.toFixed(4)+' W/m²K',r.ec.color],['Sınıf',r.ec.cls,r.ec.color],['fRsi',r.fRsi.toFixed(4),r.fRsi>=0.7?'#22c55e':'#ef4444'],['Tsi',r.Tsi.toFixed(2)+'°C',r.condensRisk?'#ef4444':'#22c55e'],['Tdew',r.Tdew_in.toFixed(2)+'°C','#60a5fa'],['Yoğuşma',r.condensRisk?'RİSK':'YOK',r.condensRisk?'#ef4444':'#22c55e']].map(([l,v,c])=>(
                      <div key={l} className="bg-white/5 rounded-lg p-2.5 text-center font-mono">
                        <div className="text-white/35 text-[9px] mb-1">{l}</div>
                        <div className="font-bold text-sm" style={{color:c}}>{v}</div>
                      </div>
                    ))}
                  </div>
                </Card>
                <div className="flex gap-3 mt-5 justify-center flex-wrap">
                  <button onClick={handlePreview} disabled={pdfLoading}
                    className="px-6 py-2.5 border border-gold-400/60 bg-gold-500/10 text-gold-300 text-sm font-display font-bold hover:bg-gold-500/20 transition-colors rounded-lg disabled:opacity-50">
                    {pdfLoading?'Hazırlanıyor...':'PDF Önizle'}
                  </button>
                  <RaporIndir buildHtml={buildFlixoHtml}
                    className="px-6 py-2.5 bg-gold-500 text-black text-sm font-display font-bold hover:bg-gold-400 transition-colors rounded-lg shadow-[0_4px_16px_rgba(201,168,76,0.4)]">
                    PDF İndir
                  </RaporIndir>
                  <button onClick={handleDXF}
                    className="px-6 py-2.5 border border-blue-400/60 bg-blue-500/10 text-blue-300 text-sm font-display font-bold hover:bg-blue-500/20 transition-colors rounded-lg">
                    AutoCAD DXF
                  </button>
                  <button onClick={()=>{setStep(0);setProfileId(null);setGlazingId(null)}}
                    className="px-6 py-2.5 border border-white/25 text-white/65 text-sm font-display hover:bg-white/5 transition-colors rounded-lg">
                    Yeni Hesap
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Nav */}
        {step<4&&(
          <div className="flex justify-between mt-12">
            <button onClick={()=>setStep(s=>Math.max(0,s-1))}
              className={`px-6 py-2.5 border border-white/25 text-white/65 text-sm font-display rounded-lg transition-colors ${step===0?'opacity-0 pointer-events-none':'hover:bg-white/5'}`}>
              ← Geri
            </button>
            <button onClick={()=>setStep(s=>s+1)} disabled={!canNext()}
              className={`px-8 py-2.5 text-sm font-display tracking-wide rounded-lg transition-all font-medium ${canNext()?'bg-gold-500 text-black hover:bg-gold-400 shadow-[0_4px_20px_rgba(201,168,76,0.35)]':'border border-white/15 text-white/25 cursor-not-allowed'}`}>
              {step===3?'Hesapla →':'İleri →'}
            </button>
          </div>
        )}

        {/* Step 4 geriye dönüş butonu */}
        {step===4&&(
          <div className="flex justify-center mt-10">
            <button onClick={()=>setStep(3)}
              className="px-6 py-2.5 border border-white/20 text-white/50 text-sm font-display rounded-lg hover:bg-white/5 hover:text-white/80 transition-colors">
              ← Seçimleri Değiştir
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
            <span className="text-white font-display font-bold text-sm tracking-wide">Termal Köprü Analiz Raporu — Önizleme</span>
            <div className="flex gap-2">
              <RaporIndir buildHtml={buildFlixoHtml}
                className="px-4 py-1.5 bg-[#b48c3c] text-black text-xs font-bold rounded-lg hover:bg-yellow-400 transition-colors">
                PDF İndir
              </RaporIndir>
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
