/**
 * GS Diamond Logo Animation
 * Finds every [data-gs-logo] element and runs the GS ↔ diamond cycle.
 * Cycle: 10 s  (letters → diamond → letters)
 */
(function () {
  'use strict';

  const CYCLE = 10000;
  const GOLD  = '#c9a84c';

  function eio(t) { return t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2; }
  function lerp(a,b,t){ return a + (b-a)*t; }
  function clamp(v,lo=0,hi=1){ return Math.max(lo, Math.min(hi,v)); }
  function ph(t,s,e){ return eio(clamp((t-s)/(e-s))); }

  /* Build DOM for one logo instance */
  function buildLogo(container) {
    container.style.position = 'relative';
    container.style.overflow = 'visible';

    // -- LETTERS --
    const wrap = document.createElement('div');
    wrap.style.cssText = `
      position:absolute;inset:0;
      display:flex;align-items:center;justify-content:center;
      gap:0;pointer-events:none;
    `;

    const mkLetter = (ch, offX) => {
      const s = document.createElement('span');
      s.textContent = ch;
      s.style.cssText = `
        font-family:'Playfair Display',serif;
        font-style:italic;font-weight:700;
        font-size:26px;color:${GOLD};
        line-height:1;will-change:transform,opacity;
        display:inline-block;
      `;
      s.style.transform = `translateX(${offX}px)`;
      return s;
    };

    const lG = mkLetter('G', -13);
    const lS = mkLetter('S',  13);
    wrap.appendChild(lG);
    wrap.appendChild(lS);
    container.appendChild(wrap);

    // -- DIAMOND SVG --
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('width',  '52');
    svg.setAttribute('height', '52');
    svg.setAttribute('viewBox','-26 -26 52 52');
    svg.setAttribute('fill',   'none');
    svg.style.cssText = `
      position:absolute;top:50%;left:50%;
      transform:translate(-50%,-50%) scale(0);
      pointer-events:none;will-change:transform,opacity;
    `;

    const defs = document.createElementNS(ns,'defs');
    const filt = document.createElementNS(ns,'filter');
    filt.id = 'gsGlow' + Math.random().toString(36).slice(2,7);
    filt.setAttribute('x','-40%');filt.setAttribute('y','-40%');
    filt.setAttribute('width','180%');filt.setAttribute('height','180%');
    const blur = document.createElementNS(ns,'feGaussianBlur');
    blur.setAttribute('in','SourceGraphic');blur.setAttribute('stdDeviation','2');blur.setAttribute('result','b');
    const merge = document.createElementNS(ns,'feMerge');
    const mn1 = document.createElementNS(ns,'feMergeNode'); mn1.setAttribute('in','b');
    const mn2 = document.createElementNS(ns,'feMergeNode'); mn2.setAttribute('in','SourceGraphic');
    merge.appendChild(mn1); merge.appendChild(mn2);
    filt.appendChild(blur); filt.appendChild(merge);
    defs.appendChild(filt);
    svg.appendChild(defs);

    // helper
    const el = (tag,attrs={}) => {
      const e = document.createElementNS(ns, tag);
      Object.entries(attrs).forEach(([k,v]) => e.setAttribute(k,v));
      return e;
    };

    // fill
    const fillPoly = el('polygon',{
      points:'0,-22 22,0 0,22 -22,0',
      fill:'rgba(201,168,76,0.08)', opacity:'0'
    });

    // facets (simplified for small size)
    const fGroup = el('g',{
      stroke:GOLD,'stroke-width':'0.7',
      'stroke-linejoin':'round',opacity:'0'
    });
    [
      '0,-22 22,0 10,-10', '0,-22 -22,0 -10,-10',
      '22,0 0,22 10,10',   '-22,0 0,22 -10,10',
      '0,-10 10,0 0,-22',  '0,-10 -10,0 0,-22',
      '0,10 10,0 0,22',    '0,10 -10,0 0,22',
    ].forEach(pts => {
      fGroup.appendChild(el('polygon',{points:pts,fill:'rgba(255,225,100,0.07)'}));
    });
    // inner table
    fGroup.appendChild(el('polygon',{
      points:'0,-10 10,0 0,10 -10,0',
      fill:'rgba(255,240,160,0.12)',stroke:GOLD,'stroke-width':'0.8'
    }));
    // spoke lines
    [[-10,0,-22,0],[10,0,22,0],[0,-10,0,-22],[0,10,0,22],
     [-10,0,0,-10],[10,0,0,-10],[10,0,0,10],[-10,0,0,10]
    ].forEach(([x1,y1,x2,y2]) => {
      fGroup.appendChild(el('line',{x1,y1,x2,y2}));
    });

    // outer edge
    const outerPoly = el('polygon',{
      points:'0,-22 22,0 0,22 -22,0',
      stroke:GOLD,'stroke-width':'1.8',
      fill:'none',
      filter:`url(#${filt.id})`
    });
    // glow duplicate
    const glowPoly = el('polygon',{
      points:'0,-22 22,0 0,22 -22,0',
      stroke:'rgba(255,215,80,0.4)','stroke-width':'3',
      fill:'none',opacity:'0'
    });

    svg.appendChild(fillPoly);
    svg.appendChild(fGroup);
    svg.appendChild(glowPoly);
    svg.appendChild(outerPoly);
    container.appendChild(svg);

    return { lG, lS, svg, outerPoly, glowPoly, fGroup, fillPoly };
  }

  /* Animate one instance */
  function animateLogo(els, t0Ref) {
    const { lG, lS, svg, outerPoly, glowPoly, fGroup, fillPoly } = els;

    function frame(ts) {
      const t = ((ts - t0Ref[0]) % CYCLE) / CYCLE;

      const pMerge   = ph(t, 0.18, 0.44);
      const pDiamond = ph(t, 0.40, 0.56);
      const pSplit   = ph(t, 0.66, 0.86);

      /* letters */
      const gOff = lerp(-13, 0, pMerge);
      const sOff = lerp( 13, 0, pMerge);
      const lScale = lerp(1, 0.05, pMerge);

      let lOpacity = pSplit > 0 ? lerp(0,1,pSplit) : lerp(1,0,pMerge);
      const gFinal = pSplit > 0 ? lerp(0,-13,pSplit) : gOff;
      const sFinal = pSplit > 0 ? lerp(0, 13,pSplit) : sOff;
      const scFinal = pSplit > 0 ? lerp(0.05,1,pSplit) : lScale;

      lG.style.transform = `translateX(${gFinal}px) scale(${scFinal})`;
      lS.style.transform = `translateX(${sFinal}px) scale(${scFinal})`;
      lG.style.opacity = lOpacity;
      lS.style.opacity = lOpacity;

      // letter glow when fully visible
      const holdLetter = t < 0.18 || t > 0.86;
      const glow = holdLetter ? '0 0 14px rgba(201,168,76,0.55)' : 'none';
      lG.style.textShadow = glow;
      lS.style.textShadow = glow;

      /* diamond */
      let dOp = pSplit > 0 ? lerp(1,0,pSplit) : pMerge;
      svg.style.transform = `translate(-50%,-50%) scale(${dOp})`;
      svg.style.opacity   = dOp;
      fillPoly.style.opacity = dOp;
      fGroup.style.opacity   = dOp;

      const gv = dOp * pDiamond;
      glowPoly.style.opacity = gv * 0.9;

      const r  = Math.round(lerp(201,255,gv*0.5));
      const g2 = Math.round(lerp(168,235,gv*0.4));
      const b  = Math.round(lerp(76, 140,gv*0.35));
      const col = `rgb(${r},${g2},${b})`;
      outerPoly.setAttribute('stroke', col);
      svg.style.filter = gv > 0.1
        ? `drop-shadow(0 0 ${(gv*8).toFixed(0)}px rgba(255,210,70,0.6))`
        : 'none';

      requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }

  /* Init all instances */
  function init() {
    document.querySelectorAll('[data-gs-logo]').forEach(container => {
      const els   = buildLogo(container);
      const t0Ref = [performance.now()];
      animateLogo(els, t0Ref);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
