import { useState, useRef, useCallback } from 'react'
import { analyzeImages, extractVideoFrames } from '../utils/visionAnalysis'
const isNative = typeof window !== 'undefined' && !!window?.Capacitor?.isNativePlatform?.()
async function takePhotoNative() {  const { Camera, CameraResultType, CameraSource } = await import('@capacitor/camera')
const photo = await Camera.getPhoto({    quality: 85,    allowEditing: false,    resultType: CameraResultType.DataUrl,    source: CameraSource.Camera,  })
return photo.dataUrl}
/* ── Kesit Çizim Sayfası ── */
function buildDrawingPage(result) {  const issues = result?.found_issues || []










  const has = (...cats) => cats.some(c => issues.some(i =>    (i.category||'').toUpperCase().includes(c) || (i.title||'').toUpperCase().includes(c)  ))
const isSil = has('SİLİKON','SİLİK','MASTİK')
const isCnt = has('CONTA')
const isIns = has('ISI')
const isWtr = has('SU YAL','DRENAJ','WATER')
const isMnj = has('MONTAJ','ANKRAJ')
const isGap = has('KENAR BOŞLUĞU','BOŞLUK')  // renk paleti — sorun varsa kırmızıya kayar
const ALU  = '#6b8ea8', ALU2 = '#8fb3cc'









  const TB   = isIns ? '#d9460f' : '#c8913a'









  const GKT  = isCnt ? '#cc2222' : '#1a1a1a'









  const SIL  = isSil ? '#e03030' : '#444'









  const DRN  = isWtr ? '#cc2222' : '#2a6abf'









  const ANK  = isMnj ? '#cc2222' : '#777'









  const GAP  = isGap ? '#e03030' : '#3a3a3a'









  const date = new Date().toLocaleDateString('tr-TR')
const drawNo = `OZZ-${new Date().getFullYear()}${String(new Date().getMonth()+1).padStart(2,'0')}${String(new Date().getDate()).padStart(2,'0')}-D1`  /* ── YATAY KESİT (A-A) — Plan görünüşü ── */  // koordinatlar (px), viewBox="0 0 720 190"
const Y0=38, YB=162, FH=YB-Y0  // çerçeve üst-alt
const zones = {    wL:[0,55], aL:[55,75], oL:[75,140], tL:[140,178], iL:[178,228],    gL:[228,241], p1:[241,253], air:[253,467], p2:[467,479], gR:[479,492],    iR:[492,542], tR:[542,580], oR:[580,645], aR:[645,665], wR:[665,720]  }
const cx = v => (v[0]+v[1])/2










  const wd = v => v[1]-v[0]  // sorun callout balon noktaları
const callouts = [    isSil && {x:cx(zones.gL), y:Y0-24, label:'Silikon Sorunu', col:'#e03030'},    isCnt && {x:cx(zones.gR), y:YB+28, label:'Conta Sorunu', col:'#cc2222'},    isIns && {x:cx(zones.tL), y:Y0-24, label:'Isı Köprüsü !', col:'#d9460f'},    isMnj && {x:cx(zones.aL), y:YB+28, label:'Ankraj Sorunu', col:'#cc2222'},    isWtr && {x:cx(zones.p1), y:YB+28, label:'Su/Drenaj !', col:'#2a6abf'},    isGap && {x:cx(zones.oL), y:Y0-24, label:'Boşluk Sorunu', col:'#e03030'},  ].filter(Boolean)
const hSVG = `<svg viewBox="0 0 720 190" width="100%" xmlns="http://www.w3.org/2000/svg" style="font-family:'Montserrat',sans-serif;overflow:visible">
<defs>
  <pattern id="hw" width="7" height="7" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
<line x1="0" y1="0" x2="0" y2="7" stroke="#aaa" stroke-width="0.7"/>
</pattern>
  <pattern id="hs" width="5" height="5" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
<line x1="0" y1="0" x2="0" y2="5" stroke="#888" stroke-width="1.2"/>
</pattern>
  <marker id="arr" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
<path d="M0,0 L6,3 L0,6 Z" fill="#555"/>
</marker>
</defs>
<!-- duvarlar -->
<rect x="${zones.wL[0]}" y="${Y0}" width="${wd(zones.wL)}" height="${FH}" fill="url(#hw)" stroke="#888" stroke-width="0.8"/>
<rect x="${zones.wR[0]}" y="${Y0}" width="${wd(zones.wR)}" height="${FH}" fill="url(#hw)" stroke="#888" stroke-width="0.8"/>
<!-- ankraj -->
<rect x="${zones.aL[0]}" y="${Y0+12}" width="${wd(zones.aL)}" height="${FH-24}" fill="url(#hs)" stroke="${ANK}" stroke-width="1.2"/>
<rect x="${zones.aR[0]}" y="${Y0+12}" width="${wd(zones.aR)}" height="${FH-24}" fill="url(#hs)" stroke="${ANK}" stroke-width="1.2"/>
<!-- dış çerçeve -->
<rect x="${zones.oL[0]}" y="${Y0}" width="${wd(zones.oL)}" height="${FH}" fill="${ALU}" stroke="#3a5a72" stroke-width="1.5"/>
<line x1="${zones.oL[0]+18}" y1="${Y0}" x2="${zones.oL[0]+18}" y2="${YB}" stroke="#4a7a96" stroke-width="0.5" stroke-dasharray="3,2"/>
<line x1="${zones.oL[0]+42}" y1="${Y0}" x2="${zones.oL[0]+42}" y2="${YB}" stroke="#4a7a96" stroke-width="0.5" stroke-dasharray="3,2"/>
<rect x="${zones.oR[0]}" y="${Y0}" width="${wd(zones.oR)}" height="${FH}" fill="${ALU}" stroke="#3a5a72" stroke-width="1.5"/>
<line x1="${zones.oR[0]+18}" y1="${Y0}" x2="${zones.oR[0]+18}" y2="${YB}" stroke="#4a7a96" stroke-width="0.5" stroke-dasharray="3,2"/>
<line x1="${zones.oR[0]+42}" y1="${Y0}" x2="${zones.oR[0]+42}" y2="${YB}" stroke="#4a7a96" stroke-width="0.5" stroke-dasharray="3,2"/>
<!-- ısı köprüsü kesici (TB) -->
<rect x="${zones.tL[0]}" y="${Y0}" width="${wd(zones.tL)}" height="${FH}" fill="${TB}" stroke="${isIns?'#a02000':'#9a6010'}" stroke-width="1.2"/>
<line x1="${zones.tL[0]+6}" y1="${Y0+8}" x2="${zones.tL[1]-6}" y2="${YB-8}" stroke="rgba(0,0,0,0.18)" stroke-width="0.7"/>
<line x1="${zones.tL[0]+6}" y1="${YB-8}" x2="${zones.tL[1]-6}" y2="${Y0+8}" stroke="rgba(0,0,0,0.18)" stroke-width="0.7"/>
<rect x="${zones.tR[0]}" y="${Y0}" width="${wd(zones.tR)}" height="${FH}" fill="${TB}" stroke="${isIns?'#a02000':'#9a6010'}" stroke-width="1.2"/>
<line x1="${zones.tR[0]+6}" y1="${Y0+8}" x2="${zones.tR[1]-6}" y2="${YB-8}" stroke="rgba(0,0,0,0.18)" stroke-width="0.7"/>
<line x1="${zones.tR[0]+6}" y1="${YB-8}" x2="${zones.tR[1]-6}" y2="${Y0+8}" stroke="rgba(0,0,0,0.18)" stroke-width="0.7"/>
<!-- iç kanat -->
<rect x="${zones.iL[0]}" y="${Y0}" width="${wd(zones.iL)}" height="${FH}" fill="${ALU2}" stroke="#4a7a96" stroke-width="1.5"/>
<line x1="${zones.iL[0]+18}" y1="${Y0}" x2="${zones.iL[0]+18}" y2="${YB}" stroke="#3a6888" stroke-width="0.5" stroke-dasharray="3,2"/>
<rect x="${zones.iR[0]}" y="${Y0}" width="${wd(zones.iR)}" height="${FH}" fill="${ALU2}" stroke="#4a7a96" stroke-width="1.5"/>
<line x1="${zones.iR[0]+18}" y1="${Y0}" x2="${zones.iR[0]+18}" y2="${YB}" stroke="#3a6888" stroke-width="0.5" stroke-dasharray="3,2"/>
<!-- EPDM conta -->
<rect x="${zones.gL[0]}" y="${Y0}" width="${wd(zones.gL)}" height="${FH}" fill="${GKT}" stroke="#000" stroke-width="0.8" rx="2"/>
<rect x="${zones.gR[0]}" y="${Y0}" width="${wd(zones.gR)}" height="${FH}" fill="${GKT}" stroke="#000" stroke-width="0.8" rx="2"/>
<!-- cam paketi -->
<rect x="${zones.p1[0]}" y="${Y0+5}" width="${wd(zones.p1)}" height="${FH-10}" fill="#9ec9e0" stroke="#4a8ab0" stroke-width="1"/>
<rect x="${zones.air[0]}" y="${Y0+5}" width="${wd(zones.air)}" height="${FH-10}" fill="#ddf0fa" stroke="none"/>
<rect x="${zones.air[0]}" y="${Y0+5}" width="9" height="${FH-10}" fill="#c8a850" stroke="#9a8030" stroke-width="0.5"/>
<rect x="${zones.air[1]-9}" y="${Y0+5}" width="9" height="${FH-10}" fill="#c8a850" stroke="#9a8030" stroke-width="0.5"/>
<rect x="${zones.p2[0]}" y="${Y0+5}" width="${wd(zones.p2)}" height="${FH-10}" fill="#9ec9e0" stroke="#4a8ab0" stroke-width="1"/>
<!-- silikon derzi -->
<ellipse cx="${zones.gL[0]}" cy="${(Y0+YB)/2}" rx="5" ry="9" fill="${SIL}" opacity="0.9"/>
<ellipse cx="${zones.gR[1]}" cy="${(Y0+YB)/2}" rx="5" ry="9" fill="${SIL}" opacity="0.9"/>
<!-- ölçü çizgileri -->
<line x1="${zones.oL[0]}" y1="${YB+14}" x2="${zones.oR[1]}" y2="${YB+14}" stroke="#333" stroke-width="0.7" marker-end="url(#arr)"/>
<line x1="${zones.oL[0]}" y1="${YB+8}" x2="${zones.oL[0]}" y2="${YB+20}" stroke="#333" stroke-width="0.7"/>
<line x1="${zones.oR[1]}" y1="${YB+8}" x2="${zones.oR[1]}" y2="${YB+20}" stroke="#333" stroke-width="0.7"/>
<text x="${cx([zones.oL[0],zones.oR[1]])}" y="${YB+12}" text-anchor="middle" font-size="6.5" fill="#333">? 170 mm — Toplam Çerçeve Genişliği</text>
<line x1="${zones.tL[0]}" y1="${Y0-10}" x2="${zones.tL[1]}" y2="${Y0-10}" stroke="${TB}" stroke-width="0.7"/>
<text x="${cx(zones.tL)}" y="${Y0-12}" text-anchor="middle" font-size="5.5" fill="${TB}">~38mm TB</text>
<line x1="${zones.p1[0]}" y1="${Y0-10}" x2="${zones.p2[1]}" y2="${Y0-10}" stroke="#4a8ab0" stroke-width="0.7"/>
<text x="${cx([zones.p1[0],zones.p2[1]])}" y="${Y0-12}" text-anchor="middle" font-size="5.5" fill="#4a8ab0">4+16+4 mm Isıcam</text>
<!-- lider etiketler -->
<line x1="${cx(zones.oL)}" y1="${Y0}" x2="${cx(zones.oL)}" y2="${Y0-28}" stroke="#555" stroke-width="0.5" stroke-dasharray="3,2"/>
<text x="${cx(zones.oL)}" y="${Y0-30}" text-anchor="middle" font-size="6.5" fill="#333">Dış Çerçeve</text>
<line x1="${cx(zones.tL)}" y1="${Y0}" x2="${cx(zones.tL)-8}" y2="${Y0-16}" stroke="${TB}" stroke-width="0.5" stroke-dasharray="2,2"/>
<text x="${cx(zones.tL)-10}" y="${Y0-18}" text-anchor="end" font-size="6" fill="${TB}">PA66 TB</text>
<line x1="${cx(zones.iL)}" y1="${Y0}" x2="${cx(zones.iL)}" y2="${Y0-28}" stroke="#4a7a96" stroke-width="0.5" stroke-dasharray="3,2"/>
<text x="${cx(zones.iL)}" y="${Y0-30}" text-anchor="middle" font-size="6.5" fill="#4a7a96">İç Kanat</text>
<line x1="${cx(zones.gL)}" y1="${YB}" x2="${cx(zones.gL)}" y2="${YB+10}" stroke="${GKT}" stroke-width="0.5"/>
<text x="${cx(zones.gL)}" y="${YB+18}" text-anchor="middle" font-size="6" fill="${GKT}">EPDM</text>
<text x="${cx([zones.air[0],zones.air[1]])}" y="${(Y0+YB)/2+4}" text-anchor="middle" font-size="9" fill="#4a8ab0" font-weight="700">CAM PAKETİ</text>
<!-- kesit oku A-A -->
<text x="8" y="${Y0-5}" font-size="8" font-weight="800" fill="#0a0f28">A</text>
<text x="708" y="${Y0-5}" font-size="8" font-weight="800" fill="#0a0f28">A</text>
<line x1="14" y1="${Y0}" x2="14" y2="${YB}" stroke="#0a0f28" stroke-width="0.5" stroke-dasharray="5,3"/>
<line x1="706" y1="${Y0}" x2="706" y2="${YB}" stroke="#0a0f28" stroke-width="0.5" stroke-dasharray="5,3"/>
<!-- sorun callout balonları -->${callouts.map(c=>`<circle cx="${c.x}" cy="${c.y}" r="12" fill="none" stroke="${c.col}" stroke-width="1.5"/>
<text x="${c.x}" y="${c.y+4}" text-anchor="middle" font-size="9" fill="${c.col}" font-weight="800">!</text>
<text x="${c.x}" y="${c.y + (c.y<Y0?-16:20)}" text-anchor="middle" font-size="5.5" fill="${c.col}">${c.label}</text>`).join('')}<!-- başlık -->
<text x="360" y="186" text-anchor="middle" font-size="7.5" font-weight="700" fill="#0a0f28">KESİT A-A — YATAY PLAN KESİTİ  (Ölçek ? 1:5)</text>
</svg>`  /* ── DÜŞEY KESİT (B-B) ── */  // viewBox="0 0 290 480"
const XW=60, XF=100, XFR=200, XGR=270, SVW=290









  const topFr=30, topFrB=100, glassT=100, glassB=380, botFrT=380, botFrB=448









  const vSVG = `<svg viewBox="0 0 ${SVW} 480" width="100%" xmlns="http://www.w3.org/2000/svg" style="font-family:'Montserrat',sans-serif">
<defs>
  <pattern id="vw" width="7" height="7" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
<line x1="0" y1="0" x2="0" y2="7" stroke="#aaa" stroke-width="0.7"/>
</pattern>
  <pattern id="vs" width="5" height="5" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
<line x1="0" y1="0" x2="0" y2="5" stroke="#888" stroke-width="1.2"/>
</pattern>
</defs>
<!-- sol duvar (beton) -->
<rect x="0" y="${topFr}" width="${XW}" height="${botFrB-topFr}" fill="url(#vw)" stroke="#888" stroke-width="0.8"/>
<!-- ÜST ÇERÇEVE -->
<rect x="${XW}" y="${topFr}" width="${XFR-XW}" height="${topFrB-topFr}" fill="${ALU}" stroke="#3a5a72" stroke-width="1.5"/>
<line x1="${XW+14}" y1="${topFr}" x2="${XW+14}" y2="${topFrB}" stroke="#4a7a96" stroke-width="0.5" stroke-dasharray="3,2"/>
<line x1="${XW+40}" y1="${topFr}" x2="${XW+40}" y2="${topFrB}" stroke="#4a7a96" stroke-width="0.5" stroke-dasharray="3,2"/>
<!-- üst TB -->
<rect x="${XW+36}" y="${topFr}" width="22" height="${topFrB-topFr}" fill="${TB}" stroke="${isIns?'#a02000':'#9a6010'}" stroke-width="1"/>
<line x1="${XW+40}" y1="${topFr+6}" x2="${XW+54}" y2="${topFrB-6}" stroke="rgba(0,0,0,0.15)" stroke-width="0.7"/>
<line x1="${XW+40}" y1="${topFrB-6}" x2="${XW+54}" y2="${topFr+6}" stroke="rgba(0,0,0,0.15)" stroke-width="0.7"/>
<!-- üst ankraj vidası -->
<rect x="${XW+4}" y="${topFr-14}" width="16" height="14" fill="url(#vs)" stroke="${ANK}" stroke-width="1"/>
<circle cx="${XW+12}" cy="${topFr-7}" r="3.5" fill="${ANK}"/>
<!-- üst drenaj -->
<ellipse cx="${XFR-14}" cy="${topFrB-12}" rx="7" ry="4.5" fill="${DRN}" stroke="${isWtr?'#900':'#1a5a8a'}" stroke-width="0.8"/>
<text x="${XFR-14}" y="${topFrB-2}" text-anchor="middle" font-size="5.5" fill="${DRN}">Drenaj</text>
<!-- üst conta + ayar kütüğü -->
<rect x="${XFR}" y="${topFrB-18}" width="8" height="22" fill="${GKT}" stroke="#000" stroke-width="0.7" rx="1.5"/>
<!-- CAM PAKETİ -->
<rect x="${XFR+8}" y="${glassT}" width="11" height="${glassB-glassT}" fill="#9ec9e0" stroke="#4a8ab0" stroke-width="1"/>
<rect x="${XFR+19}" y="${glassT}" width="9" height="${glassB-glassT}" fill="#c8a850" stroke="#9a8030" stroke-width="0.5"/>
<rect x="${XFR+28}" y="${glassT}" width="${XGR-XFR-36}" height="${glassB-glassT}" fill="#ddf0fa" stroke="none"/>
<rect x="${XGR-18}" y="${glassT}" width="9" height="${glassB-glassT}" fill="#c8a850" stroke="#9a8030" stroke-width="0.5"/>
<rect x="${XGR-9}" y="${glassT}" width="9" height="${glassB-glassT}" fill="#9ec9e0" stroke="#4a8ab0" stroke-width="1"/>
<!-- cam üst/alt silikon -->
<ellipse cx="${XFR+8}" cy="${glassT+18}" rx="4.5" ry="6" fill="${SIL}" opacity="0.9"/>
<ellipse cx="${XFR+8}" cy="${glassB-18}" rx="4.5" ry="6" fill="${SIL}" opacity="0.9"/>
<!-- ALT ÇERÇEVE (eşik) -->
<rect x="${XW}" y="${botFrT}" width="${XFR-XW}" height="${botFrB-botFrT}" fill="${ALU}" stroke="#3a5a72" stroke-width="1.5"/>
<line x1="${XW+14}" y1="${botFrT}" x2="${XW+14}" y2="${botFrB}" stroke="#4a7a96" stroke-width="0.5" stroke-dasharray="3,2"/>
<line x1="${XW+40}" y1="${botFrT}" x2="${XW+40}" y2="${botFrB}" stroke="#4a7a96" stroke-width="0.5" stroke-dasharray="3,2"/>
<!-- alt TB -->
<rect x="${XW+36}" y="${botFrT}" width="22" height="${botFrB-botFrT}" fill="${TB}" stroke="${isIns?'#a02000':'#9a6010'}" stroke-width="1"/>
<!-- alt drenaj delikleri -->
<ellipse cx="${XFR-14}" cy="${botFrT+18}" rx="7" ry="4.5" fill="${DRN}" stroke="${isWtr?'#900':'#1a5a8a'}" stroke-width="0.8"/>
<text x="${XFR-14}" y="${botFrT+28}" text-anchor="middle" font-size="5.5" fill="${DRN}">Drenaj</text>
<!-- alt ankraj -->
<rect x="${XW+4}" y="${botFrB}" width="16" height="14" fill="url(#vs)" stroke="${ANK}" stroke-width="1"/>
<circle cx="${XW+12}" cy="${botFrB+7}" r="3.5" fill="${ANK}"/>
<!-- alt conta -->
<rect x="${XFR}" y="${glassB-6}" width="8" height="22" fill="${GKT}" stroke="#000" stroke-width="0.7" rx="1.5"/>
<!-- ölçü çizgisi (sağ) -->
<line x1="${SVW-10}" y1="${topFr}" x2="${SVW-10}" y2="${botFrB}" stroke="#555" stroke-width="0.6"/>
<line x1="${SVW-16}" y1="${topFr}" x2="${SVW-4}" y2="${topFr}" stroke="#555" stroke-width="0.6"/>
<line x1="${SVW-16}" y1="${botFrB}" x2="${SVW-4}" y2="${botFrB}" stroke="#555" stroke-width="0.6"/>
<text x="${SVW-8}" y="${(topFr+botFrB)/2}" text-anchor="start" font-size="5.5" fill="#555" transform="rotate(90,${SVW-8},${(topFr+botFrB)/2})">? 1200 mm (tipik)</text>
<!-- etiketler (sol) -->
<text x="${XW-3}" y="${(topFr+topFrB)/2+3}" text-anchor="end" font-size="6" fill="#333">Üst Çerçeve</text>
<text x="${XW-3}" y="${(glassT+glassB)/2+3}" text-anchor="end" font-size="6" fill="#4a8ab0">Cam</text>
<text x="${XW-3}" y="${(botFrT+botFrB)/2+3}" text-anchor="end" font-size="6" fill="#333">Alt Eşik</text>
<!-- kesit oku B-B -->
<text x="${XW-8}" y="${topFr-5}" font-size="8" font-weight="800" fill="#0a0f28">B</text>
<text x="${XGR+4}" y="${topFr-5}" font-size="8" font-weight="800" fill="#0a0f28">B</text>
<line x1="${XW-3}" y1="${topFr}" x2="${XGR+3}" y2="${topFr}" stroke="#0a0f28" stroke-width="0.5" stroke-dasharray="5,3"/>
<!-- başlık -->
<text x="${SVW/2}" y="474" text-anchor="middle" font-size="7" font-weight="700" fill="#0a0f28">KESİT B-B — DÜŞEY (1:5)</text>
</svg>`  /* ── Malzeme lejandı ── */








  const matItems = [    {col:ALU,    label:'Alüminyum Profil (Dış)'},    {col:ALU2,   label:'Alüminyum Profil (İç)'},    {col:TB,     label:`PA66 Isı Köprüsü Kesici${isIns?' ?':''}`, warn:isIns},    {col:GKT,    label:`EPDM Conta${isCnt?' ?':''}`, warn:isCnt},    {col:'#9ec9e0', label:'Cam (4 mm pano)'},    {col:'#ddf0fa', label:'Hava Boşluğu (16 mm)'},    {col:'#c8a850', label:'Alüm. Ara Profil (Spacer)'},    {col:SIL,    label:`Silikon Derzi${isSil?' ?':''}`, warn:isSil},    {col:DRN,    label:`Drenaj Kanalı${isWtr?' ?':''}`, warn:isWtr},    {col:ANK,    label:`Ankraj / Vida${isMnj?' ?':''}`, warn:isMnj},  ]









  const legendHtml = matItems.map(m=>`    <div style="display:flex;align-items:center;gap:6px;margin-bottom:5px">
      <div style="width:18px;height:12px;border-radius:2px;border:1px solid rgba(0,0,0,0.2);flex-shrink:0;background:${m.col}">
</div>
      <span style="font-size:6.5pt;color:${m.warn?'#c0392b':'#333'};font-weight:${m.warn?700:400}">${m.label}</span>
    </div>`).join('')
const warnBox = (isIns||isSil||isCnt||isWtr||isMnj||isGap)    ? `<div style="margin-top:8px;background:#fff3cd;border:1px solid #ffc107;border-radius:4px;padding:7px 9px;font-size:6.5pt;color:#664d03">
<strong>? Uyarı:</strong> Kırmızı/turuncu işaretli bileşenlerde sorun tespit edildi.</div>`    : ''  /* ── Sorun referans tablosu ── */








  const sevBg = {Kritik:'#dc2626',Yüksek:'#ea580c',Orta:'#d97706',Düşük:'#16a34a'}
const issueTableRows = issues.slice(0,6).map((iss,i)=>`    <tr style="border-top:1px solid #e5e7eb">
      <td style="padding:4px 7px;font-size:7pt;color:#666">${i+1}</td>
      <td style="padding:4px 7px">
<span style="background:${sevBg[iss.severity]||'#888'};color:#fff;font-size:6pt;padding:1px 6px;border-radius:10px;font-weight:700">${iss.severity||''}</span>
</td>
      <td style="padding:4px 7px;font-size:7pt;font-weight:600;color:#1a1a2e">${iss.title||''}</td>
      <td style="padding:4px 7px;font-size:6.5pt;color:#555">${(iss.solution||'').substring(0,75)}${(iss.solution||'').length>75?'…':''}</td>
    </tr>`).join('')
return `<div style="page-break-before:always;font-family:'Montserrat',sans-serif;padding:18px 24px 36px;background:#fff">
  <!-- Sayfa başlığı -->
  <div style="display:flex;justify-content:space-between;align-items:flex-end;border-bottom:2.5px solid #0a0f28;padding-bottom:8px;margin-bottom:14px">
    <div>
      <div style="font-size:14pt;font-weight:800;color:#0a0f28;
letter-spacing:1.5px">AluSight</div>
      <div style="font-size:7.5pt;color:#666;margin-top:2px">Alüminyum Doğrama — Kesit &amp; Plan Detay Çizimleri</div>
    </div>
    <div style="text-align:right;font-size:6.5pt;color:#666;line-height:1.9">
      <div>
<strong>Çizim No:</strong> ${drawNo}</div>
      <div>
<strong>Ölçek:</strong> 1:5 (gösterim)</div>
      <div>
<strong>Tarih:</strong> ${date} &nbsp;|&nbsp; Rev: R0</div>
    </div>
  </div>
  <!-- KESİT A-A (tam genişlik) -->
  <div style="margin-bottom:16px">
    <div style="font-size:7.5pt;font-weight:700;color:#0a0f28;margin-bottom:6px;display:flex;align-items:center;gap:8px">
      <span style="background:#0a0f28;color:#fff;padding:2px 9px;border-radius:3px;font-size:6.5pt;
letter-spacing:.5px">KESİT A-A</span>      YATAY PLAN KESİTİ — Alüminyum Doğrama Profil Detayı (Isıcam + PA66 Termal Kayıt)    </div>
    <div style="border:1px solid #d1d9e0;border-radius:6px;padding:8px 8px 4px;background:#fafcff">      ${hSVG}    </div>
  </div>
  <!-- Alt bölüm: düşey kesit + lejant yan yana -->
  <div style="display:grid;grid-template-columns:220px 1fr;gap:16px;margin-bottom:16px">
    <!-- KESİT B-B -->
    <div>
      <div style="font-size:7.5pt;font-weight:700;color:#0a0f28;margin-bottom:6px;display:flex;align-items:center;gap:8px">
        <span style="background:#0a0f28;color:#fff;padding:2px 9px;border-radius:3px;font-size:6.5pt">KESİT B-B</span>        Düşey Kesit      </div>
      <div style="border:1px solid #d1d9e0;border-radius:6px;padding:8px;background:#fafcff">        ${vSVG}      </div>
    </div>
    <!-- Sağ sütun: lejant + sorun tablosu + standartlar -->
    <div style="display:flex;flex-direction:column;gap:12px">
      <!-- Malzeme Lejandı -->
      <div style="border:1px solid #d1d9e0;border-radius:6px;padding:12px;background:#fafcff">
        <div style="font-size:7pt;font-weight:700;color:#0a0f28;margin-bottom:8px;text-transform:uppercase;
letter-spacing:.7px">Malzeme Lejandı</div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:0">          ${legendHtml}        </div>        ${warnBox}      </div>
      <!-- Sorun Referans Tablosu -->      ${issueTableRows ? `      <div style="border:1px solid #d1d9e0;border-radius:6px;padding:12px;background:#fafcff;flex:1">
        <div style="font-size:7pt;font-weight:700;color:#0a0f28;margin-bottom:6px;text-transform:uppercase;
letter-spacing:.7px">Sorun Referans Tablosu</div>
        <table style="width:100%;border-collapse:collapse">
          <thead>
<tr style="background:#0a0f28">
            <th style="padding:5px 7px;font-size:6.5pt;color:#fff;text-align:left">#</th>
            <th style="padding:5px 7px;font-size:6.5pt;color:#fff;text-align:left">Önem</th>
            <th style="padding:5px 7px;font-size:6.5pt;color:#fff;text-align:left">Sorun</th>
            <th style="padding:5px 7px;font-size:6.5pt;color:#fff;text-align:left">Çözüm Özeti</th>
          </tr>
</thead>
          <tbody>${issueTableRows}</tbody>
        </table>        ${issues.length>6?`<div style="font-size:6pt;color:#888;margin-top:4px">+${issues.length-6} sorun daha — Sayfa 1'e bakınız.</div>`:''}      </div>` : ''}      <!-- Standartlar -->
      <div style="border:1px solid #bfdbfe;border-radius:6px;padding:10px 12px;background:#eff6ff">
        <div style="font-size:6.5pt;font-weight:700;color:#1e40af;margin-bottom:5px;text-transform:uppercase">Uygulanan Standartlar</div>
        <div style="font-size:6pt;color:#1e40af;line-height:1.9">          EN ISO 10077-2 &nbsp;·&nbsp; EN ISO 13788 &nbsp;·&nbsp; EN 1027 &nbsp;·&nbsp; EN 12208<br>          ASTM C1193 &nbsp;·&nbsp; EN 13830 &nbsp;·&nbsp; EN 1090-1 &nbsp;·&nbsp; TS EN 14351-1<br>          ISO 9001:2015 &nbsp;·&nbsp; TS 11801 &nbsp;·&nbsp; EN 755        </div>
      </div>
    </div>
  </div>
  <!-- Başlık Bloğu (mimari çizim formatı) -->
  <div style="border:2px solid #0a0f28;display:grid;grid-template-columns:3fr 1fr 1fr 1fr;font-size:7pt;color:#333">
    <div style="border-right:1px solid #0a0f28;padding:7px 10px">
      <div style="font-size:5.5pt;color:#999;text-transform:uppercase;margin-bottom:2px">Proje / Konu</div>
      <div style="font-weight:700">Alüminyum Sistem Durum Tespiti</div>
      <div style="font-size:6pt;color:#666;margin-top:1px">AluSight Mimari ve Teknik Ekibi</div>
    </div>
    <div style="border-right:1px solid #0a0f28;padding:7px 10px;text-align:center">
      <div style="font-size:5.5pt;color:#999;text-transform:uppercase;margin-bottom:2px">Ölçek</div>
      <div style="font-weight:700">1 : 5</div>
    </div>
    <div style="border-right:1px solid #0a0f28;padding:7px 10px;text-align:center">
      <div style="font-size:5.5pt;color:#999;text-transform:uppercase;margin-bottom:2px">Çizen</div>
      <div style="font-weight:700">Ozan ASLAN</div>
    </div>
    <div style="padding:7px 10px;text-align:center">
      <div style="font-size:5.5pt;color:#999;text-transform:uppercase;margin-bottom:2px">Tarih</div>
      <div style="font-weight:700">${date}</div>
    </div>
  </div>
</div>`}
/* ── PDF — Sade Danışmanlık Raporu ── */
function downloadPDF(result, notes, mediaCount) {  return new Promise((resolve, reject) => {    setTimeout(() => {      try {        const now     = new Date()
const dateStr = now.toLocaleDateString('tr-TR')
const refNo   = `OZZ-${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}-${String(Math.floor(Math.random()*900)+100)}`









  const cond    = result?.overall_condition || 'Belirsiz'









  const condColor = {'İyi':'#16a34a','Orta':'#d97706','Kötü':'#dc2626','Kritik':'#7f1d1d','Belirsiz':'#555'}
const cc = condColor[cond] || '#555'









  const sevColor  = {'Düşük':'#16a34a','Orta':'#d97706','Yüksek':'#ea580c','Kritik':'#dc2626'}
const prioColor = {'Acil':'#dc2626','Yüksek':'#ea580c','Orta':'#d97706'}
const insIcon   = {'Yeterli':'✅','Yetersiz':'⚠️','Eksik':'❌','Belirsiz':'—','Değerlendirilemez':'🔍'}
const visLabel  = {'confirmed':'Doğrulandı','probable':'Olası Bulgu','not_assessable':'Değerlendirilemez'}
const visColor  = {'confirmed':'#16a34a','probable':'#d97706','not_assessable':'#6b7280'}
const issuesRows = (result.found_issues||[]).map(iss=>`    <tr>
      <td>${iss.category||''}</td>
<td>${iss.title||''}</td>
      <td>
<span class="badge" style="background:${sevColor[iss.severity]||'#888'}">${iss.severity||''}</span>
</td>
      <td>
<span class="badge" style="background:${visColor[iss.visibility]||'#6b7280'}">${visLabel[iss.visibility]||'Olası Bulgu'}</span>
</td>
      <td>${iss.description||''}</td>
<td>${iss.solution||''}</td>
      <td class="std">${iss.standard||'—'}</td>
    </tr>`).join('')
const insRows = [    {key:'thermal',label:'Isı Yalıtımı'},{key:'acoustic',label:'Ses Yalıtımı'},{key:'waterproofing',label:'Su Yalıtımı'}  ].map(({key,label})=>{    const d=result.insulation_report?.[key]||{}
return `<tr>
<td>
<strong>${label}</strong>
</td>
<td>${insIcon[d.status]||'—'} ${d.status||'—'}</td>
<td>${d.observations||'—'}</td>
<td>${(d.required_materials||[]).join(', ')||'—'}</td>
<td>${d.application_method||'—'}</td>
</tr>`  }).join('')
const matRows = (result.missing_materials||[]).map(m=>`    <tr>
<td>
<strong>${m.name||''}</strong>
</td>
<td>${m.purpose||''}</td>
<td>${m.quantity_hint||'—'}</td>
    <td>
<span class="badge" style="background:${prioColor[m.priority]||'#888'}">${m.priority||''}</span>
</td>
</tr>`).join('')
const drawingPage = buildDrawingPage(result)
const html = `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:'Montserrat',sans-serif;color:#1a1a2e;background:#fff;font-size:9pt;-webkit-print-color-adjust:exact;print-color-adjust:exact}.header{background:#0a0f28;color:#fff;padding:22px 28px 16px}.header h1{font-size:18pt;font-weight:800;
letter-spacing:2px}.header .sub{font-size:9pt;color:#99aacc;margin-top:3px}.header .meta{font-size:7.5pt;color:#aab;margin-top:6px}.body{padding:18px 28px 80px}h3{font-size:9.5pt;font-weight:700;color:#0a0f28;margin:18px 0 8px;text-transform:uppercase;
letter-spacing:.8px;border-bottom:2px solid #e5e7eb;padding-bottom:4px}table{width:100%;border-collapse:collapse;margin-bottom:12px;font-size:8pt}thead tr{background:#0a0f28;color:#fff}thead th{padding:7px 9px;text-align:left;font-weight:600;font-size:7.5pt}tbody tr:nth-child(even){background:#f8fafc}tbody td{padding:6px 9px;vertical-align:top;border-bottom:1px solid #e5e7eb;line-height:1.5}.badge{display:inline-block;color:#fff;font-size:7pt;font-weight:700;padding:1.5px 7px;border-radius:20px}.cond{border-radius:8px;padding:14px 20px;margin-bottom:18px}.cond h2{font-size:16pt;font-weight:800;color:#fff}.cond p{font-size:9pt;color:#fff;opacity:.85;margin-top:6px;line-height:1.6}.std{font-size:7pt;color:#666}.info{background:#eff6ff;border:1px solid #bfdbfe;border-radius:6px;padding:10px 14px;margin-top:16px;font-size:7.5pt;color:#1e40af}/* ücretsiz rapor kutusu */.free-box{margin-top:20px;background:linear-gradient(135deg,#fffbeb,#fef9ec);border:1.5px solid #f59e0b;border-radius:10px;padding:18px 22px;position:relative;overflow:hidden}.free-stripe{position:absolute;top:0;left:0;width:5px;height:100%;background:linear-gradient(to bottom,#f59e0b,#d97706)}.free-inner{padding-left:8px}.free-title{display:flex;align-items:center;gap:8px;margin-bottom:8px}.free-title span{font-size:14pt}.free-title div{font-size:10pt;font-weight:800;color:#92400e;
letter-spacing:.3px}.free-body{font-size:8.5pt;color:#78350f;line-height:1.8;margin-bottom:10px}.free-note{font-size:8pt;color:#92400e;line-height:1.8;border-top:1px solid rgba(245,158,11,0.3);padding-top:10px}.free-footer{margin-top:12px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px}.free-contact{font-size:7.5pt;color:#92400e;font-weight:700}.free-badge{background:#f59e0b;color:#fff;font-size:7pt;font-weight:800;padding:5px 14px;border-radius:20px;
letter-spacing:.5px}.footer{position:fixed;bottom:0;left:0;right:0;background:#f8f9fa;border-top:1px solid #e5e7eb;padding:5px 28px;display:flex;justify-content:space-between;font-size:7pt;color:#999}@media print{@page{size:A4;margin:0}.footer{position:fixed;bottom:0}
} </style>
</head>
<body>
<div class="header">
  <h1>AluSight</h1>
  <div class="sub">Alüminyum Sistem Durum Raporu${mediaCount>1?` — ${mediaCount} Görsel Kayıt`:''}</div>
  <div class="meta">Rapor No: ${refNo} &nbsp;|&nbsp; Tarih: ${dateStr} &nbsp;|&nbsp; Hazırlayan: Ozan ASLAN — AluSight Mimari &amp; Teknik Ekibi</div>
</div>
<div class="body">
  <div class="ai-notice" style="background:#fffbeb;border:1.5px solid #f59e0b;border-radius:8px;padding:12px 16px;margin-bottom:18px;font-size:8pt;color:#92400e;line-height:1.6">
    <strong>? Uyarı:</strong> Bu rapor yapay zeka destekli bir <strong>ÖN DEĞERLENDİRMEDİR</strong>. Kesin mühendislik kararları için AluSight teknik ekibi tarafından saha incelemesi yapılması zorunludur.  </div>
  <div class="cond" style="background:${cc}">
    <h2>GENEL DURUM: ${cond.toUpperCase()}</h2>    ${result.summary?`<p>${result.summary}</p>`:''}  </div>  ${issuesRows?`<h3>Tespit Edilen Sorunlar (${result.found_issues?.length||0})</h3>
  <table>
<thead>
<tr>
    <th style="width:12%">Kategori</th>
<th style="width:12%">Sorun</th>
<th style="width:7%">Önem</th>
    <th style="width:10%">Görünürlük</th>
    <th style="width:22%">Açıklama</th>
<th style="width:25%">Çözüm</th>
<th style="width:12%">Standart</th>
  </tr>
</thead>
<tbody>${issuesRows}</tbody>
</table>`:''}  ${insRows?`<h3>Yalıtım Raporu</h3>
  <table>
<thead>
<tr>
    <th style="width:14%">Yalıtım</th>
<th style="width:10%">Durum</th>
<th style="width:24%">Gözlem</th>
    <th style="width:28%">Gerekli Malzeme</th>
<th style="width:24%">Uygulama</th>
  </tr>
</thead>
<tbody>${insRows}</tbody>
</table>`:''}  ${matRows?`<h3>Eksik / Gerekli Malzeme</h3>
  <table>
<thead>
<tr>
    <th style="width:22%">Malzeme</th>
<th style="width:45%">Amaç</th>
<th style="width:18%">Miktar</th>
<th style="width:15%">Öncelik</th>
  </tr>
</thead>
<tbody>${matRows}</tbody>
</table>`:''}  ${result.positive_notes?.length?`<h3>Olumlu Tespitler</h3>
  <ul style="padding-left:16px;font-size:8.5pt;color:#166534">    ${result.positive_notes.map(n=>`<li style="margin:3px 0">? ${n}</li>`).join('')}  </ul>`:''}  ${notes?.trim()?`<h3>Ek Notlar</h3>
  <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:6px;padding:10px 14px;font-size:8.5pt;color:#78350f">${notes}</div>`:''}  <div class="info">
    <strong>Referans:</strong> EN ISO 10077, EN ISO 13788, EN 1027, ASTM C1193, EN 13830, EN 1090 &nbsp;|&nbsp; AluSight Mimari &amp; Teknik Ekibi  </div>
  <!-- Ücretsiz rapor kutusu -->
  <div class="free-box">
    <div class="free-stripe">
</div>
    <div class="free-inner">
      <div class="free-title">
        <span>??</span>
        <div>Bu Rapor Tamamen Ücretsiz Hazırlanmıştır</div>
      </div>
      <div class="free-body">        AluSight olarak, sahaya özel ilk teknik durum raporunuzu <strong>hiçbir ücret talep etmeksizin</strong> sunuyoruz.        Bu hizmet; güvene dayalı iş anlayışımızın ve sahada geçirdiğimiz <strong>8 yılı aşkın deneyimin</strong> bir yansımasıdır.        Raporunuzda yer alan tespitler, Avrupa normlarına uygun standartlar çerçevesinde mimari ve teknik ekibimiz tarafından hazırlanmıştır.      </div>
      <div class="free-note">        Raporumuzun ardından <strong>müdahale, tamir, yenileme veya yeni proje</strong> kapsamında AluSight ile çalışmayı tercih etmeniz halinde,        bu rapordaki tüm tespitler ekibimiz tarafından yerinde değerlendirilerek <strong>size özel teklif</strong> hazırlanacaktır.        <br>
<br>
        <em style="font-size:7.5pt;color:#b45309">Tekliflerimiz; şeffaf fiyatlandırma, Avrupa markası ürünler ve işçilik güvencesiyle sunulmaktadır.</em>
      </div>
      <div class="free-footer">
        <div class="free-contact">📞 +90 535 861 0404 &nbsp;·&nbsp; 🌐 www.alusight.com</div>
        <div class="free-badge">ÜCRETSİZ İLK RAPOR</div>
      </div>
    </div>
  </div>
</div>
<div class="footer">
  <span>AluSight | www.alusight.com | Tel: +90 535 861 0404</span>
  <span>${dateStr} &nbsp;|&nbsp; ${refNo}</span>
</div>${drawingPage}<script>document.fonts.ready.then(()=>window.print())<\/script>
</body>
</html>`









  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
const blobUrl = URL.createObjectURL(blob)
const w = window.open(blobUrl, '_blank', 'width=950,height=750')
if (!w) {          URL.revokeObjectURL(blobUrl)









  throw new Error('PDF penceresi açılamadı. Lütfen açılır pencere engelleyicisini kontrol edin.')        }






  resolve()      }
catch (err) {        reject(err)      }
} , 50)  })}
/* ── Sabitler ── */
const COND_STYLE = {  'İyi':     {bg:'from-green-500/20 to-green-600/10', border:'border-green-500/40',  text:'text-green-300'},  'Orta':    {bg:'from-amber-500/20 to-amber-600/10', border:'border-amber-500/40',  text:'text-amber-300'},  'Kötü':    {bg:'from-red-500/20   to-red-600/10',   border:'border-red-500/40',    text:'text-red-300'},  'Kritik':  {bg:'from-red-700/30   to-red-800/15',   border:'border-red-600/60',    text:'text-red-200'},  'Belirsiz':{bg:'from-white/5      to-white/3',      border:'border-white/20',      text:'text-white/60'},  'Sınırlı Değerlendirme':{bg:'from-blue-500/20 to-blue-600/10', border:'border-blue-500/40', text:'text-blue-300'},}
const SEV = {  'Düşük':  {bg:'bg-green-500/20',  text:'text-green-300',  border:'border-green-500/30'},  'Orta':   {bg:'bg-amber-500/20',  text:'text-amber-300',  border:'border-amber-500/30'},  'Yüksek': {bg:'bg-orange-500/20', text:'text-orange-300', border:'border-orange-500/30'},  'Kritik': {bg:'bg-red-500/25',    text:'text-red-300',    border:'border-red-500/40'},}
const VIS = {  'confirmed':      {label:'Doğrulandı',      bg:'bg-green-500/20',  text:'text-green-300',  border:'border-green-500/30'},  'probable':       {label:'Olası Bulgu',     bg:'bg-amber-500/20',  text:'text-amber-300',  border:'border-amber-500/30'},  'not_assessable': {label:'Değerlendirilemez', bg:'bg-gray-500/20',  text:'text-gray-300',  border:'border-gray-500/30'},}
const INS_STATUS = {  'Yeterli':  {icon:'✅',text:'text-green-400'},  'Yetersiz': {icon:'⚠️',text:'text-amber-400'},  'Eksik':    {icon:'❌',text:'text-red-400'},  'Belirsiz': {icon:'?',text:'text-white/50'},  'Değerlendirilemez': {icon:'🔍',text:'text-blue-400'},}
/* ── Bileşen ── */
export default function OneriPage() {  const [media, setMedia]             = useState([])     // [{type:'image'|'video', src, name}]
const [videoFrames, setVideoFrames] = useState([])     // video'dan çıkarılan base64 kareler
const [videoLoading, setVideoLoading] = useState(false)
const [notes, setNotes]             = useState('')
const [apiKey]              = useState('')
const [keyDraft]            = useState('')
const [showKeyInput]        = useState(false)
const [loading, setLoading]         = useState(false)
const [pdfLoading, setPdfLoading]   = useState(false)
const [loadingMsg, setLoadingMsg]   = useState('')
const [error, setError]             = useState(null)
const [result, setResult]           = useState(null)
const fileRef = useRef()
const resultRef = useRef()
const dragOver = useRef(false)
/* ── Dosya ekleme ── */








  const addFiles = useCallback(async (files) => {    const arr = Array.from(files)
for (const file of arr) {      if (file.type.startsWith('image/')) {        const reader = new FileReader()






  reader.onload = e => setMedia(prev => prev.length < 10 ? [...prev, {type:'image', src:e.target.result, name:file.name}] : prev)






  reader.readAsDataURL(file)      }
else if (file.type.startsWith('video/')) {        setVideoLoading(true)






  setLoadingMsg('Video kareler çıkarılıyor...')
try {          const frames = await extractVideoFrames(file, 6)






  setVideoFrames(prev => [...prev, ...frames])






  setMedia(prev => [...prev, {type:'video', src:frames[0], name:file.name, frameCount:frames.length}])        }
catch(e) {          setError('Video işlenemedi: ' + e.message)        }
finally {          setVideoLoading(false)






  setLoadingMsg('')        }
}
}
} , [])
const handleDrop = (e) => { e.preventDefault(); addFiles(e.dataTransfer.files) }
const handleDrag = (e) => e.preventDefault()
const removeMedia = (i) => setMedia(prev => prev.filter((_,idx)=>idx!==i))
/* ── Analiz ── */








  const handleAnalyze = async () => {    const allImages = [      ...media.filter(m=>m.type==='image').map(m=>m.src),      ...videoFrames,    ]









  if (!allImages.length) { setError('Lütfen en az bir fotoğraf veya video ekleyin.');
return }






  setLoading(true); setError(null); setResult(null)






  setLoadingMsg(`${allImages.length} görsel inceleniyor, rapor hazırlanıyor...`)
try {      const r = await analyzeImages(allImages, '')






  setResult(r)






  setTimeout(() => resultRef.current?.scrollIntoView({behavior:'smooth', block:'start'}), 150)    }
catch(e) {      setError(e.message)    }
finally {      setLoading(false)






  setLoadingMsg('')    }
}
const totalImages = media.filter(m=>m.type==='image').length + videoFrames.length









  const cond = result?.overall_condition || 'Belirsiz'









  const cs   = COND_STYLE[cond] || COND_STYLE['Belirsiz']









  return (    <div className="min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-8">        {/* Başlık */}        <div className="text-center mb-2">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/25 rounded-full px-4 py-1.5 text-xs text-amber-300/80 font-mono mb-5">            GÖRSEL İNCELEME — ÇOK MEDYA DESTEKLİ          </div>
          <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">Alüminyum Sistem Durum Raporu</h1>
          <p className="text-white/45 text-sm max-w-xl mx-auto">            Birden fazla fotoğraf veya video yükleyin — AluSight teknik ekibi tüm açıları birlikte değerlendirerek kapsamlı rapor oluşturur.          </p>
        </div>        {/* Upload Alanı */}        <div






  onDrop={handleDrop} onDragOver={handleDrag}






  className="rounded-2xl border-2 border-dashed border-white/20 hover:border-amber-400/40 bg-black/10 hover:bg-amber-500/5 transition-all"        >          {/* Medya önizleme grid */ }{media.length > 0 && (            <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">              {media.map((m,i) => (                <div key={i} className="relative group rounded-xl overflow-hidden border border-white/15 aspect-square bg-black/20">
                  <img src={m.src} alt={m.name} className="w-full h-full object-cover" />                  {m.type==='video' && (                    <div className="absolute bottom-1 left-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded-full font-mono">                      ?? {m.frameCount} kare                    </div>                  )}                  <button onClick={()=>removeMedia(i)}






  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500/80 hover:bg-red-500 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">                    ?                  </button>
                </div>              )) }{/* Ekle butonu */ }{media.length < 10 && (                <button onClick={()=>fileRef.current?.click()}






  className="aspect-square rounded-xl border-2 border-dashed border-white/15 hover:border-amber-400/40 flex flex-col items-center justify-center gap-1 text-white/30 hover:text-amber-400/60 transition-all">
                  <span className="text-2xl">+</span>
                  <span className="text-[10px] font-mono">Ekle</span>
                </button>              ) }{/* Kamera butonu — sadece native Android */ }{isNative && media.length < 10 && (                <button onClick={async () => {                  try {                    const dataUrl = await takePhotoNative()
if (!dataUrl)
return






  setMedia(prev => [...prev, { id: Date.now() + Math.random(), type: 'image', src: dataUrl, name: `foto_${Date.now()}.jpg` }])                  }
catch (e) { alert('Kamera açılamadı: ' + e.message) }
}
}






  className="aspect-square rounded-xl border-2 border-dashed border-amber-400/40 hover:border-amber-400 flex flex-col items-center justify-center gap-1 text-amber-400/60 hover:text-amber-400 transition-all">
                  <span className="text-2xl">??</span>
                  <span className="text-[10px]">Fotoğraf Çek</span>
                </button>              )}            </div>          ) }{/* Boş alan */ }{media.length === 0 && (            <div className="flex flex-col items-center justify-center py-12 text-center px-8 gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-3xl">??</div>
              <div>
                <p className="text-white/70 font-medium mb-1">Görsel ekleyin</p>
                <p className="text-white/20 text-[11px]">JPG, PNG, WEBP, MP4 — maks 10 dosya</p>
              </div>
              <div className="flex gap-3 flex-wrap justify-center">
                <button onClick={()=>fileRef.current?.click()}






  className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl px-5 py-3 text-sm text-white/70 transition-all">                  ??? Fotoğraf Seç ve Yükle                </button>                {isNative && (                  <button onClick={async () => {                    try {                      const dataUrl = await takePhotoNative()
if (!dataUrl)
return






  setMedia(prev => [...prev, { id: Date.now() + Math.random(), type: 'image', src: dataUrl, name: `foto_${Date.now()}.jpg` }])                    }
catch (e) { alert('Kamera açılamadı: ' + e.message) }
}
}






  className="flex items-center gap-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-400/30 rounded-xl px-5 py-3 text-sm text-amber-300 transition-all">                    ?? Fotoğraf Çek                  </button>                )}              </div>
            </div>          ) }{/* Alt bilgi */ }{media.length > 0 && (            <div className="px-4 pb-4 flex items-center gap-3 flex-wrap">
              <button onClick={()=>fileRef.current?.click()}






  className="text-xs text-amber-400/60 hover:text-amber-300 underline underline-offset-2">                + Daha fazla ekle              </button>
              <span className="text-white/20 text-xs">|</span>
              <span className="text-white/30 text-xs font-mono">                {media.filter(m=>m.type==='image').length} fotoğraf                {media.filter(m=>m.type==='video').length > 0 && ` · ${media.filter(m=>m.type==='video').length} video (${videoFrames.length} kare)` }{' '}— toplam {totalImages} görsel analiz edilecek              </span>
            </div>          )}        </div>
        <input ref={fileRef} type="file" accept="image/*,video/*" multiple className="hidden"






  onChange={e => addFiles(e.target.files)} />        {/* Video yükleniyor */ }{videoLoading && (          <div className="flex items-center gap-3 text-amber-300/70 text-sm">
            <div className="w-4 h-4 border-2 border-t-amber-400 border-r-transparent rounded-full animate-spin shrink-0" />            {loadingMsg}          </div>        ) }{/* Notlar */}        <div>
          <label className="block text-xs text-white/40 font-mono mb-2">EK NOTLAR / SAHA GÖZLEMLERİ (OPSİYONEL)</label>
          <textarea value={notes} onChange={e=>setNotes(e.target.value)}






  placeholder="Örn: Güney cephede yoğun güneş maruziyeti var. 3. katta sızıntı şikayeti alındı..."






  rows={3}






  className="w-full bg-black/30 border border-white/12 rounded-xl p-4 text-sm text-white placeholder-white/20 resize-none focus:outline-none focus:border-amber-400/40 font-sans leading-relaxed" />
        </div>        {/* Analiz Butonu */ }{media.length > 0 && !loading && (          <button onClick={handleAnalyze}






  className="w-full py-4 rounded-2xl font-bold text-base tracking-wide transition-all              bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black shadow-lg shadow-amber-500/25 hover:scale-[1.01]">            {totalImages > 1 ? `${totalImages} Görseli İncele & Rapor Oluştur` : 'İncele & Rapor Oluştur'}          </button>        ) }{/* Loading */ }{loading && (          <div className="flex flex-col items-center justify-center py-16 gap-5">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-2 border-amber-500/20 animate-ping" />
              <div className="absolute inset-2 rounded-full border-2 border-t-amber-400 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
              <div className="absolute inset-4 rounded-full bg-amber-500/20 flex items-center justify-center text-lg">??</div>
            </div>
            <div className="text-center">
              <p className="text-white/80 font-medium">{loadingMsg}</p>
              <p className="text-white/35 text-xs mt-1">~45-60 saniye sürebilir</p>
            </div>
          </div>        ) }{/* Hata */ }{error && (          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-5">
            <div className="flex items-start gap-3">
              <span className="text-red-400 text-xl shrink-0">?</span>
              <div>
                <p className="text-red-300 font-medium text-sm mb-1">Analiz hatası</p>
                <p className="text-red-300/60 text-xs leading-relaxed">{error}</p>
                <button onClick={()=>setShowKeyInput(true)} className="mt-3 text-xs text-amber-400/70 hover:text-amber-300 underline underline-offset-2">                  API anahtarını değiştir                </button>
              </div>
            </div>
          </div>        ) }{/* RAPOR */ }{result && (          <div ref={resultRef} className="space-y-6 pt-2">            {/* AI Uyarısı */}            <div className="flex gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
              <svg className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="text-amber-200 text-sm font-semibold">Yapay Zeka Destekli Ön Değerlendirme</p>
                <p className="text-amber-200/70 text-xs leading-relaxed mt-1">                  {result.ai_disclaimer || 'Bu rapor yapay zeka destekli bir ÖN DEĞERLENDİRMEDİR. Kesin mühendislik kararları için AluSight teknik ekibi tarafından saha incelemesi yapılması zorunludur.'}                </p>
              </div>
            </div>            {/* Genel Durum */}            <div className={`rounded-2xl border p-6 bg-gradient-to-br ${cs.bg} ${cs.border}`}>
              <div className="flex items-start justify-between flex-wrap gap-4">
                <div>
                  <div className="text-xs font-mono text-white/40 mb-2">GENEL DURUM</div>
                  <div className={`text-4xl font-black tracking-tight ${cs.text}`}>{cond.toUpperCase()}</div>                  {result.summary && <p className="text-white/60 text-sm mt-3 max-w-2xl leading-relaxed">{result.summary}</p>}                </div>
                <div className="flex flex-col items-end gap-2">
                  <button






  onClick={async () => {                      if (pdfLoading)
return






  setPdfLoading(true)
try {                        await downloadPDF(result, notes, totalImages)                      }
catch (err) {                        setError(err?.message || 'PDF oluşturulurken bir hata oluştu.')                      }
finally {                        setPdfLoading(false)                      }
}
}






  disabled={pdfLoading}






  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 disabled:bg-white/5 disabled:cursor-not-allowed border border-white/20 text-white text-sm font-medium transition-all"                  >                    {pdfLoading ? (                      <>
 <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
 <span>PDF hazırlanıyor...</span>
 </>                    ) : (                      <>
 <span>?</span>
 <span>PDF İndir</span>
 </>                    )}                  </button>
                  <button onClick={()=>setShowKeyInput(true)} className="text-xs text-white/25 hover:text-white/50 transition-colors">                    API anahtarını değiştir                  </button>
                </div>
              </div>
            </div>            {/* Sorunlar */ }{result.found_issues?.length > 0 && (              <div>
                <h2 className="text-sm font-mono text-white/40 mb-4 uppercase tracking-widest">                  Tespit Edilen Sorunlar — {result.found_issues.length} adet                </h2>
                <div className="space-y-3">                  {result.found_issues.map((issue,i)=>{                    const s = SEV[issue.severity]||SEV['Orta']
                    const v = VIS[issue.visibility]||VIS['probable']







  return (                      <div key={i} className="bg-white/[0.03] border border-white/10 rounded-xl p-5">
                        <div className="flex items-start gap-2 flex-wrap mb-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${s.bg} ${s.text} ${s.border}`}>{issue.severity}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${v.bg} ${v.text} ${v.border}`}>{v.label}</span>
                          <span className="text-[10px] font-mono text-white/35 px-2 py-0.5 bg-white/5 border border-white/10 rounded-full shrink-0">{issue.category}</span>                          {issue.standard && <span className="text-[10px] font-mono text-blue-400/60 px-2 py-0.5 bg-blue-500/5 border border-blue-500/15 rounded-full shrink-0">{issue.standard}</span>}                        </div>
                        <h3 className="text-white font-semibold text-sm mb-1">{issue.title}</h3>
                        <p className="text-white/55 text-xs leading-relaxed">{issue.description}</p>                        {issue.solution && (                          <div className="mt-3 p-3 bg-amber-500/5 border border-amber-500/15 rounded-lg">
                            <span className="text-[10px] font-mono text-amber-400/50 block mb-1">ÇÖZÜM</span>
                            <p className="text-amber-200/70 text-xs leading-relaxed">{issue.solution}</p>
                          </div>                        )}                      </div>                    )                  })}                </div>
              </div>            ) }{/* Yalıtım */ }{result.insulation_report && (              <div>
                <h2 className="text-sm font-mono text-white/40 mb-4 uppercase tracking-widest">Yalıtım Raporu</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">                  {[{key:'thermal',label:'Isı Yalıtımı',icon:'🌡️'},{key:'acoustic',label:'Ses Yalıtımı',icon:'🔊'},{key:'waterproofing',label:'Su Yalıtımı',icon:'💧'}].map(({key,label,icon})=>{                    const d=result.insulation_report[key]||{}
const st=INS_STATUS[d.status]||INS_STATUS['Belirsiz']









  return (                      <div key={key} className="bg-white/[0.03] border border-white/10 rounded-xl p-5 space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{icon}</span>
                          <div>
                            <div className="text-[10px] font-mono text-white/35">{label}</div>
                            <div className={`text-sm font-bold ${st.text}`}>{st.icon }{d.status||'—'}</div>
                          </div>
                        </div>                        {d.observations && <p className="text-white/50 text-xs leading-relaxed">{d.observations}</p> }{d.required_materials?.length>0 && (                          <div>
<div className="text-[10px] font-mono text-white/25 mb-1.5">GEREKLİ MALZEME</div>
                          <div className="flex flex-wrap gap-1">                            {d.required_materials.map((m,mi)=>(                              <span key={mi} className="text-[10px] px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 text-amber-300/70 rounded-full">{m}</span>                            ))}                          </div>
</div>                        ) }{d.application_method && <p className="text-white/35 text-[11px] leading-relaxed border-t border-white/8 pt-2">{d.application_method}</p>}                      </div>                    )                  })}                </div>
              </div>            ) }{/* Malzeme */ }{result.missing_materials?.length>0 && (              <div>
                <h2 className="text-sm font-mono text-white/40 mb-4 uppercase tracking-widest">Eksik / Gerekli Malzeme</h2>
                <div className="overflow-x-auto rounded-xl border border-white/10">
                  <table className="w-full text-xs">
                    <thead className="bg-white/[0.04]">
                      <tr>
                        <th className="text-left text-white/35 font-mono font-normal px-4 py-3">Malzeme</th>
                        <th className="text-left text-white/35 font-mono font-normal px-4 py-3">Amaç</th>
                        <th className="text-left text-white/35 font-mono font-normal px-4 py-3">Miktar</th>
                        <th className="text-right text-white/35 font-mono font-normal px-4 py-3">Öncelik</th>
                      </tr>
                    </thead>
                    <tbody>                      {result.missing_materials.map((mat,i)=>{                        const pc={Acil:'text-red-300 bg-red-500/15 border-red-500/30',Yüksek:'text-orange-300 bg-orange-500/15 border-orange-500/30',Orta:'text-amber-300 bg-amber-500/15 border-amber-500/30'}[mat.priority]||'text-white/50 bg-white/5 border-white/15'









  return (                          <tr key={i} className="border-t border-white/8 hover:bg-white/[0.02]">
                            <td className="px-4 py-3 text-white font-medium">{mat.name}</td>
                            <td className="px-4 py-3 text-white/50">{mat.purpose}</td>
                            <td className="px-4 py-3 text-white/40">{mat.quantity_hint||'—'}</td>
                            <td className="px-4 py-3 text-right">
<span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold ${pc}`}>{mat.priority}</span>
</td>
                          </tr>                        )                      })}                    </tbody>
                  </table>
                </div>
              </div>            ) }{/* Olumlu */ }{result.positive_notes?.length>0 && (              <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-5">
                <div className="text-xs font-mono text-green-400/50 mb-3 uppercase tracking-widest">Olumlu Tespitler</div>                {result.positive_notes.map((n,i)=>(                  <div key={i} className="flex items-start gap-2 text-xs text-green-300/65 mb-1">
                    <span className="text-green-400 shrink-0 mt-0.5">?</span>{n}                  </div>                ))}              </div>            ) }{/* Butonlar */}            <div className="flex flex-wrap gap-3 pt-2">
              <button






  onClick={async () => {                  if (pdfLoading)
return






  setPdfLoading(true)
try {                    await downloadPDF(result, notes, totalImages)                  }
catch (err) {                    setError(err?.message || 'PDF oluşturulurken bir hata oluştu.')                  }
finally {                    setPdfLoading(false)                  }
}
}






  disabled={pdfLoading}






  className="flex-1 min-w-44 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 disabled:from-amber-600 disabled:to-orange-600 disabled:cursor-not-allowed text-black font-bold text-sm hover:from-amber-400 hover:to-orange-400 transition-all"              >                {pdfLoading ? (                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />                    PDF hazırlanıyor...                  </span>                ) : (                  '? PDF Raporu İndir'                )}              </button>
              <button onClick={()=>{setResult(null);setError(null);setMedia([]);setVideoFrames([])}
}






  className="px-5 py-3 rounded-xl bg-white/8 hover:bg-white/12 border border-white/15 text-white/60 hover:text-white/80 text-sm transition-all">                Yeni Analiz              </button>
            </div>
          </div>        )}      </div>
    </div>  )}