import { useEffect, useRef } from 'react'

/* ─── Drawing helpers ──────────────────────────────────────── */

function drawPolarStar(ctx, cx, cy, size, rot, a) {
  ctx.save()
  ctx.translate(cx, cy)
  ctx.rotate(rot)
  const n = 16
  for (let i = 0; i < n; i++) {
    const ang  = (i / n) * Math.PI * 2
    const main = i % 4 === 0
    const sec  = i % 2 === 0
    const len  = main ? size : sec ? size * 0.55 : size * 0.3
    const r0   = size * 0.1
    const al   = main ? a * 3.5 : sec ? a * 2 : a * 0.9
    ctx.beginPath()
    ctx.moveTo(Math.cos(ang) * r0, Math.sin(ang) * r0)
    ctx.lineTo(Math.cos(ang) * len, Math.sin(ang) * len)
    ctx.strokeStyle = `rgba(201,168,76,${al})`
    ctx.lineWidth = main ? 0.8 : 0.45
    ctx.stroke()
  }
  for (const [r, al] of [[size * 0.1, a * 5], [size * 0.04, a * 9]]) {
    ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2)
    ctx.strokeStyle = `rgba(201,168,76,${al})`; ctx.lineWidth = 0.8; ctx.stroke()
  }
  const ch = size * 0.07
  ctx.strokeStyle = `rgba(201,168,76,${a * 6})`; ctx.lineWidth = 0.6
  ctx.beginPath(); ctx.moveTo(-ch, 0); ctx.lineTo(ch, 0)
  ctx.moveTo(0, -ch); ctx.lineTo(0, ch); ctx.stroke()
  ctx.restore()
}

function drawSurmeProfile(ctx, s, gold) {
  const W = 68 * s, H = 44 * s
  const c = gold ? 'rgba(201,168,76,1)' : 'rgba(180,210,240,1)'
  ctx.strokeStyle = c; ctx.lineWidth = 1.0
  ctx.strokeRect(-W / 2, -H / 2, W, H)
  ctx.strokeRect(-W / 2 + 2 * s, -H / 2, W - 4 * s, H * 0.16)
  ctx.strokeRect(-W / 2 + 2 * s, H / 2 - H * 0.16, W - 4 * s, H * 0.16)
  ctx.beginPath(); ctx.moveTo(-W / 2, 0); ctx.lineTo(W / 2, 0); ctx.stroke()
  ctx.strokeRect(-W / 2 + 3 * s, -H / 2 + H * 0.16, W * 0.43, H * 0.68)
  ctx.globalAlpha *= 0.5
  ctx.strokeRect(-W / 2 + W * 0.41, -H / 2 + H * 0.14, W * 0.43, H * 0.68)
  ctx.globalAlpha /= 0.5
  ctx.beginPath()
  ctx.arc(-W / 4, H / 2 - H * 0.08, H * 0.055, 0, Math.PI * 2)
  ctx.arc(W / 4,  H / 2 - H * 0.08, H * 0.055, 0, Math.PI * 2)
  ctx.strokeStyle = 'rgba(201,168,76,1)'; ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(W * 0.3, 0); ctx.lineTo(W * 0.42, 0)
  ctx.moveTo(W * 0.39, -H * 0.07); ctx.lineTo(W * 0.42, 0); ctx.lineTo(W * 0.39, H * 0.07)
  ctx.strokeStyle = 'rgba(201,168,76,1)'; ctx.lineWidth = 0.8; ctx.stroke()
}

function drawYalitimliProfile(ctx, s) {
  const W = 54 * s, H = 78 * s
  ctx.strokeStyle = 'rgba(180,210,240,1)'; ctx.lineWidth = 1.0
  ctx.strokeRect(-W / 2, -H / 2, W * 0.33, H)
  ctx.strokeRect(-W / 2 + 2 * s, -H / 2 + 4 * s, W * 0.22, H - 8 * s)
  ctx.strokeStyle = 'rgba(201,168,76,1)'; ctx.setLineDash([3 * s, 2 * s])
  ctx.strokeRect(-W * 0.17, -H * 0.36, W * 0.34, H * 0.72)
  ctx.setLineDash([])
  ctx.fillStyle = 'rgba(201,168,76,0.08)'
  ctx.fillRect(-W * 0.17, -H * 0.36, W * 0.34, H * 0.72)
  ctx.strokeStyle = 'rgba(180,210,240,1)'; ctx.lineWidth = 1.0
  ctx.strokeRect(W * 0.17, -H / 2, W * 0.33, H)
  ctx.strokeRect(W * 0.17 + 2 * s, -H / 2 + 4 * s, W * 0.22, H - 8 * s)
  ctx.strokeStyle = 'rgba(120,190,255,0.7)'; ctx.lineWidth = 2.0
  ctx.beginPath(); ctx.moveTo(-W * 0.05, -H / 2); ctx.lineTo(-W * 0.05, H / 2); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(W * 0.05,  -H / 2); ctx.lineTo(W * 0.05,  H / 2); ctx.stroke()
}

function drawFrameProfile(ctx, s) {
  const W = 76 * s, H = 76 * s
  ctx.strokeStyle = 'rgba(180,210,240,1)'; ctx.lineWidth = 0.9
  ctx.strokeRect(-W / 2, -H / 2, W, H)
  ctx.beginPath(); ctx.moveTo(0, -H / 2); ctx.lineTo(0, H / 2); ctx.stroke()
  ctx.beginPath(); ctx.moveTo(-W / 2, 0); ctx.lineTo(W / 2, 0); ctx.stroke()
  ctx.strokeStyle = 'rgba(120,190,255,0.4)'; ctx.lineWidth = 0.7
  const pad = 4 * s
  ctx.strokeRect(-W / 2 + pad, -H / 2 + pad, W / 2 - pad * 2, H / 2 - pad * 2)
  ctx.strokeRect(pad / 2,      -H / 2 + pad, W / 2 - pad * 2, H / 2 - pad * 2)
  ctx.strokeRect(-W / 2 + pad, pad / 2,      W / 2 - pad * 2, H / 2 - pad * 2)
  ctx.strokeRect(pad / 2,      pad / 2,      W / 2 - pad * 2, H / 2 - pad * 2)
}

function drawCurtainProfile(ctx, s) {
  const W = 96 * s, H = 110 * s
  ctx.strokeStyle = 'rgba(201,168,76,1)'; ctx.lineWidth = 1.1
  for (let i = 0; i <= 2; i++) {
    const x = -W / 2 + i * W / 2
    ctx.strokeRect(x - 3 * s, -H / 2, 6 * s, H)
  }
  ctx.lineWidth = 0.7
  for (let j = 0; j <= 2; j++) {
    const y = -H / 2 + j * H / 2
    ctx.beginPath(); ctx.moveTo(-W / 2, y); ctx.lineTo(W / 2, y); ctx.stroke()
  }
  ctx.strokeStyle = 'rgba(120,190,255,0.35)'; ctx.lineWidth = 0.6
  for (let c = 0; c < 2; c++) for (let r = 0; r < 2; r++) {
    const pad = 5 * s
    ctx.strokeRect(-W / 2 + c * W / 2 + pad, -H / 2 + r * H / 2 + pad, W / 2 - pad * 2, H / 2 - pad * 2)
  }
}

/* ─── Main component ──────────────────────────────────────── */
export default function AnimatedBg() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animId, w, h, frame = 0

    const resize = () => { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight }
    resize()
    window.addEventListener('resize', resize)

    /* Stars */
    const stars = Array.from({ length: 320 }, () => ({
      x: Math.random(), y: Math.random(),
      r: Math.random() * 1.5 + 0.3,
      a: Math.random() * 0.9 + 0.25,
      twinkle: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.05 + 0.01,
    }))

    /* Nebula blobs */
    const nebulas = [
      { x: 0.15, y: 0.25, rw: 0.42, rh: 0.32, color: '30,80,200',  a: 0.38 },
      { x: 0.80, y: 0.65, rw: 0.36, rh: 0.26, color: '90,30,180',  a: 0.30 },
      { x: 0.50, y: 0.48, rw: 0.60, rh: 0.45, color: '15,55,150',  a: 0.22 },
      { x: 0.25, y: 0.78, rw: 0.28, rh: 0.22, color: '70,20,160',  a: 0.26 },
      { x: 0.75, y: 0.20, rw: 0.34, rh: 0.28, color: '25,85,180',  a: 0.28 },
    ]

    /* Particles */
    const parts = Array.from({ length: 70 }, () => ({
      x: Math.random(), y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0003, vy: (Math.random() - 0.5) * 0.0003,
      r: Math.random() * 1.6 + 0.4, gold: Math.random() > 0.5, a: Math.random() * 0.6 + 0.25,
    }))

    /* Polar stars */
    const polars = [
      { x: 0.12, y: 0.22, size: 150, rot: 0,   drot:  0.0008,  a: 0.12 },
      { x: 0.88, y: 0.78, size: 130, rot: 0.5,  drot: -0.0007,  a: 0.10 },
      { x: 0.50, y: 0.50, size: 240, rot: 0.2,  drot:  0.0004,  a: 0.07 },
      { x: 0.10, y: 0.82, size: 100, rot: 1.2,  drot:  0.0012,  a: 0.10 },
      { x: 0.90, y: 0.18, size: 110, rot: 0.8,  drot: -0.001,   a: 0.10 },
      { x: 0.35, y: 0.70, size:  85, rot: 0.3,  drot:  0.0015,  a: 0.09 },
      { x: 0.70, y: 0.30, size:  95, rot: 1.0,  drot: -0.0012,  a: 0.10 },
    ]

    /* Aluminum profile spacecraft */
    const PROF_TYPES = ['surme', 'yalitimli', 'frame', 'curtain']
    const profCount = 18

    /* Trail history per profile */
    function resetProf(p, init = false) {
      const fromLeft = Math.random() > 0.5
      const speed = (Math.random() * 0.18 + 0.08) / 1000
      if (init) { p.x = Math.random(); p.y = Math.random() }
      else {
        if (fromLeft) { p.x = -0.22; p.y = Math.random() } else { p.x = 1.22; p.y = Math.random() }
      }
      p.vx   = (fromLeft ? 1 : -1) * speed + (Math.random() - 0.5) * speed * 0.25
      p.vy   = (Math.random() - 0.5) * speed * 0.35
      p.rot  = (Math.random() - 0.5) * 0.22
      p.drot = (Math.random() - 0.5) * 0.00022
      p.scale = Math.random() * 1.1 + 0.55
      p.alpha = Math.random() * 0.18 + 0.10   // Çok daha görünür profiller
      p.type  = PROF_TYPES[Math.floor(Math.random() * PROF_TYPES.length)]
      p.gold  = Math.random() > 0.45
      p.trail = []
    }
    const profs = Array.from({ length: profCount }, () => {
      const p = {}; resetProf(p, true); return p
    })

    /* Data streams */
    const cols = Array.from({ length: 20 }, (_, i) => ({
      x: (i + 0.5) / 20 + (Math.random() - 0.5) * 0.025,
      y: Math.random(), speed: (Math.random() * 0.5 + 0.25) / 1000,
      len: Math.random() * 0.16 + 0.06, a: Math.random() * 0.09 + 0.03, gold: Math.random() > 0.5,
    }))

    /* Circuit traces */
    const traces = Array.from({ length: 12 }, () => {
      const segs = []; let nx = Math.random(), ny = Math.random()
      for (let j = 0; j < 7; j++) {
        const d = Math.floor(Math.random() * 4), l = Math.random() * 0.11 + 0.04
        if (d === 0) nx += l; else if (d === 1) nx -= l
        else if (d === 2) ny += l; else ny -= l
        segs.push({ x: Math.max(0.01, Math.min(0.99, nx)), y: Math.max(0.01, Math.min(0.99, ny)) })
      }
      return { segs, a: Math.random() * 0.08 + 0.025, gold: Math.random() > 0.5 }
    })

    /* Blueprint annotations */
    const annots = Array.from({ length: 16 }, () => ({
      x: Math.random(), y: Math.random(),
      vx: (Math.random() - 0.5) * 0.00005, vy: (Math.random() - 0.5) * 0.00005,
      text: ['Ø'+(Math.random()*180+40|0), (Math.random()*8+1).toFixed(1)+'m',
             'T'+(Math.random()*8+2|0)+'mm', (Math.random()*360|0)+'°',
             'R'+(Math.random()*400+80|0), 'SW-'+(Math.random()*60+40|0)+'mm'][Math.floor(Math.random()*6)],
      a: Math.random() * 0.12 + 0.05,
    }))

    const pulses = []
    let vpOff = 0

    /* ─── Draw ─────────────────────────────────── */
    function draw() {
      ctx.clearRect(0, 0, w, h)
      frame++
      vpOff += 0.0004

      // 0. Deep space base with nebulas
      ctx.fillStyle = '#0b1020'
      ctx.fillRect(0, 0, w, h)

      nebulas.forEach(nb => {
        const gx = nb.x * w, gy = nb.y * h
        const rw = nb.rw * w, rh = nb.rh * h
        const g = ctx.createRadialGradient(gx, gy, 0, gx, gy, Math.max(rw, rh))
        g.addColorStop(0, `rgba(${nb.color},${nb.a})`)
        g.addColorStop(0.5, `rgba(${nb.color},${nb.a * 0.4})`)
        g.addColorStop(1, `rgba(${nb.color},0)`)
        ctx.save()
        ctx.scale(rw / Math.max(rw, rh), rh / Math.max(rw, rh))
        ctx.fillStyle = g
        ctx.fillRect(0, 0, w * Math.max(rw, rh) / rw, h * Math.max(rw, rh) / rh)
        ctx.restore()

        const g2 = ctx.createRadialGradient(gx, gy, 0, gx, gy, Math.max(rw, rh))
        g2.addColorStop(0, `rgba(${nb.color},${nb.a})`)
        g2.addColorStop(1, `rgba(${nb.color},0)`)
        ctx.save()
        ctx.translate(gx, gy)
        ctx.scale(1, rh / rw)
        ctx.beginPath()
        ctx.arc(0, 0, rw, 0, Math.PI * 2)
        ctx.fillStyle = g2
        ctx.fill()
        ctx.restore()
      })

      // 1. Stars
      stars.forEach(s => {
        s.twinkle += s.speed
        const ta = s.a * (0.6 + 0.4 * Math.sin(s.twinkle))
        ctx.beginPath()
        ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(220,235,255,${ta})`
        ctx.fill()
        if (s.r > 0.9) {
          ctx.beginPath()
          ctx.arc(s.x * w, s.y * h, s.r * 2.5, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(180,210,255,${ta * 0.12})`
          ctx.fill()
        }
      })

      // 2. Perspective VP grid
      const VPX = w * (0.5 + Math.sin(vpOff) * 0.07)
      const VPY = h * (0.42 + Math.cos(vpOff * 0.7) * 0.055)
      ctx.lineWidth = 0.5
      for (let i = 0; i < 32; i++) {
        const a = (i / 32) * Math.PI * 2
        ctx.beginPath()
        ctx.moveTo(VPX, VPY)
        ctx.lineTo(VPX + Math.cos(a) * Math.max(w, h) * 1.25, VPY + Math.sin(a) * Math.max(w, h) * 1.25)
        ctx.strokeStyle = 'rgba(201,168,76,0.055)'; ctx.stroke()
      }
      for (let r = 50; r < Math.max(w, h) * 1.45; r += 70) {
        ctx.beginPath()
        ctx.ellipse(VPX, VPY, r, r * 0.52, vpOff * 0.08, 0, Math.PI * 2)
        ctx.strokeStyle = 'rgba(201,168,76,0.045)'; ctx.lineWidth = 0.55; ctx.stroke()
      }

      // 3. Orthographic grid
      const gO = (frame * 0.12) % 80
      ctx.lineWidth = 0.5; ctx.strokeStyle = 'rgba(201,168,76,0.055)'
      for (let x = gO - 80; x < w + 80; x += 80) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke() }
      for (let y = gO - 80; y < h + 80; y += 80) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke() }

      // 4. Diagonal lines
      const dO = (frame * 0.08) % 110
      ctx.strokeStyle = 'rgba(201,168,76,0.035)'; ctx.lineWidth = 0.45
      for (let d = -h + dO; d < w + h; d += 110) {
        ctx.beginPath(); ctx.moveTo(d, 0); ctx.lineTo(d + h, h); ctx.stroke()
        ctx.beginPath(); ctx.moveTo(d, 0); ctx.lineTo(d - h, h); ctx.stroke()
      }

      // 5. Polar stars
      polars.forEach(ps => {
        ps.rot += ps.drot
        drawPolarStar(ctx, ps.x * w, ps.y * h, ps.size, ps.rot, ps.a)
      })

      // 6. Circuit traces
      traces.forEach(tr => {
        if (!tr.segs.length) return
        ctx.beginPath(); ctx.moveTo(tr.segs[0].x * w, tr.segs[0].y * h)
        for (let k = 1; k < tr.segs.length; k++) ctx.lineTo(tr.segs[k].x * w, tr.segs[k].y * h)
        ctx.strokeStyle = tr.gold ? `rgba(201,168,76,${tr.a})` : `rgba(180,210,240,${tr.a * 0.75})`
        ctx.lineWidth = 0.5; ctx.stroke()
        tr.segs.forEach(s => {
          ctx.beginPath(); ctx.arc(s.x * w, s.y * h, 1.6, 0, Math.PI * 2)
          ctx.fillStyle = tr.gold ? `rgba(201,168,76,${tr.a * 3})` : `rgba(180,210,240,${tr.a * 2.5})`
          ctx.fill()
        })
      })

      // 7. Aluminum profile spacecraft (with light trails)
      profs.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.rot += p.drot
        p.trail.push({ x: p.x, y: p.y })
        if (p.trail.length > 22) p.trail.shift()
        if (p.x < -0.28 || p.x > 1.28 || p.y < -0.25 || p.y > 1.25) resetProf(p, false)

        // Draw comet trail
        for (let t = 1; t < p.trail.length; t++) {
          const ta = (t / p.trail.length) * p.alpha * 0.55
          ctx.beginPath()
          ctx.moveTo(p.trail[t - 1].x * w, p.trail[t - 1].y * h)
          ctx.lineTo(p.trail[t].x * w, p.trail[t].y * h)
          ctx.strokeStyle = p.gold ? `rgba(201,168,76,${ta})` : `rgba(120,190,255,${ta})`
          ctx.lineWidth = 0.8
          ctx.stroke()
        }

        ctx.save()
        ctx.translate(p.x * w, p.y * h)
        ctx.rotate(p.rot)
        ctx.globalAlpha = p.alpha
        if (p.type === 'surme')       drawSurmeProfile(ctx, p.scale, p.gold)
        else if (p.type === 'yalitimli') drawYalitimliProfile(ctx, p.scale)
        else if (p.type === 'frame')  drawFrameProfile(ctx, p.scale)
        else                          drawCurtainProfile(ctx, p.scale)

        // Thrust glow behind each profile
        const tx = -p.vx * 3500, ty = -p.vy * 3500
        const tg = ctx.createRadialGradient(tx, ty, 0, tx, ty, 28 * p.scale)
        const tc = p.gold ? '201,168,76' : '100,170,255'
        tg.addColorStop(0, `rgba(${tc},0.35)`)
        tg.addColorStop(1, `rgba(${tc},0)`)
        ctx.fillStyle = tg
        ctx.beginPath(); ctx.arc(tx, ty, 28 * p.scale, 0, Math.PI * 2); ctx.fill()

        ctx.globalAlpha = 1; ctx.restore()
      })

      // 8. Data streams
      cols.forEach(c => {
        c.y += c.speed; if (c.y > 1 + c.len) c.y = -c.len
        const x = c.x * w, y = c.y * h, len = c.len * h
        const g = ctx.createLinearGradient(0, y - len, 0, y)
        const col = c.gold ? '201,168,76' : '120,190,255'
        g.addColorStop(0, `rgba(${col},0)`); g.addColorStop(0.7, `rgba(${col},${c.a})`)
        g.addColorStop(1, `rgba(${col},${c.a * 4})`)
        ctx.strokeStyle = g; ctx.lineWidth = 0.6
        ctx.beginPath(); ctx.moveTo(x, y - len); ctx.lineTo(x, y); ctx.stroke()
        ctx.beginPath(); ctx.arc(x, y, 2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${col},${c.a * 5.5})`; ctx.fill()
      })

      // 9. Blueprint annotations
      ctx.font = '8px Montserrat, sans-serif'
      annots.forEach(n => {
        n.x += n.vx; n.y += n.vy
        if (n.x < 0) n.x = 1; if (n.x > 1) n.x = 0
        if (n.y < 0) n.y = 1; if (n.y > 1) n.y = 0
        ctx.fillStyle = `rgba(201,168,76,${n.a * 1.5})`
        ctx.fillText(n.text, n.x * w, n.y * h)
        const tw = ctx.measureText(n.text).width
        ctx.beginPath(); ctx.moveTo(n.x * w - 5, n.y * h + 3)
        ctx.lineTo(n.x * w + tw + 3, n.y * h + 3)
        ctx.strokeStyle = `rgba(201,168,76,${n.a * 0.75})`; ctx.lineWidth = 0.4; ctx.stroke()
      })

      // 10. Particle network
      parts.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = 1; if (p.x > 1) p.x = 0
        if (p.y < 0) p.y = 1; if (p.y > 1) p.y = 0
      })
      for (let i = 0; i < parts.length; i++) {
        for (let j = i + 1; j < parts.length; j++) {
          const dx = (parts[i].x - parts[j].x) * w
          const dy = (parts[i].y - parts[j].y) * h
          const d  = Math.sqrt(dx * dx + dy * dy)
          if (d < 155) {
            ctx.beginPath()
            ctx.moveTo(parts[i].x * w, parts[i].y * h)
            ctx.lineTo(parts[j].x * w, parts[j].y * h)
            ctx.strokeStyle = `rgba(201,168,76,${(1 - d / 155) * 0.35})`
            ctx.lineWidth = 0.55; ctx.stroke()
          }
        }
      }

      // 11. Pulses
      if (frame % 50 === 0) {
        for (let i = 0; i < parts.length; i++) for (let j = i + 1; j < parts.length; j++) {
          const dx = (parts[i].x - parts[j].x) * w, dy = (parts[i].y - parts[j].y) * h
          if (Math.sqrt(dx * dx + dy * dy) < 140 && Math.random() < 0.008) pulses.push({ pi: i, pj: j, t: 0 })
        }
      }
      for (let k = pulses.length - 1; k >= 0; k--) {
        pulses[k].t += 0.030
        if (pulses[k].t >= 1) { pulses.splice(k, 1); continue }
        const pa = parts[pulses[k].pi], pb = parts[pulses[k].pj]
        const px = (pa.x + (pb.x - pa.x) * pulses[k].t) * w
        const py = (pa.y + (pb.y - pa.y) * pulses[k].t) * h
        const pa2 = Math.sin(pulses[k].t * Math.PI)
        ctx.beginPath(); ctx.arc(px, py, 3.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,225,100,${pa2 * 1.0})`; ctx.fill()
        ctx.beginPath(); ctx.arc(px, py, 7, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,225,100,${pa2 * 0.25})`; ctx.fill()
      }

      // 12. Particle dots
      parts.forEach(p => {
        ctx.beginPath(); ctx.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.gold ? `rgba(201,168,76,${p.a})` : `rgba(120,190,255,${p.a * 0.65})`; ctx.fill()
      })

      // 13. Scan sweep
      const sy = (frame * 0.42) % h
      const sg = ctx.createLinearGradient(0, sy - 35, 0, sy + 35)
      sg.addColorStop(0, 'rgba(201,168,76,0)')
      sg.addColorStop(0.5, 'rgba(201,168,76,0.05)')
      sg.addColorStop(1, 'rgba(201,168,76,0)')
      ctx.fillStyle = sg; ctx.fillRect(0, sy - 35, w, 70)

      animId = requestAnimationFrame(draw)
    }

    draw()
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1 }}
    />
  )
}
