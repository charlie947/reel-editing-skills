// Effect 08
// ---------------- 8 Liquid Glass: a drop of clear glass rises over his chest, spreads into a pill (spring), reshapes into a tall pane, and we dive through it.
(() => {
  const S8 = 2;                                                  // the pane fills the zone at 2x
  const MOUTH = BEYE + (PG.mouth - PG.eye) * BS;                 // his mouth in zone coords (the pane never rises above it)
  const w1 = .8 * Z.w, h1 = Math.min(.14 * Z.h, .42 * w1);        // the pill at rest
  const wE = Z.w / S8, hE = Z.h / S8;                            // the pane at the hand-off
  const cy = Math.max(.8 * Z.h, MOUTH + .03 * Z.h + hE / 2);     // pane top stays under his mouth
  const C = [Z.w / 2, cy], yP = Math.max(cy, .87 * Z.h);
  const spring = p => p <= 0 ? 0 : p >= 1 ? 1 : 1 - Math.exp(-5 * p) * Math.cos(10 * p) * (1 - p);
  const T = { rise: [.03, .40], spread: [.10, .46], morph: [.50, .24], dive: [.62, .37], win: [.62, .1] };
  // the glass shape at time t (scene coords): { c, w, h, rr }
  const geo = t => {
    const u = ez(P(t, ...T.rise)), sp = spring(P(t, ...T.spread)), m = ez(P(t, ...T.morph));
    const d0 = .9 * h1, wP = mix(d0, w1, sp), hP = h1 * Math.pow(w1 / Math.max(wP, 1), .35);
    const y = mix(mix(Z.h + h1, yP, u), cy, m);
    const w = mix(wP, wE, m), h = mix(hP, hE, m), rr = mix(Math.min(wP, hP) / 2, Z.r / S8, m);
    return { c: [C[0], y], w, h, rr };
  };
  const dive = t => eio(P(t, ...T.dive));
  const LG = {
    name: NAMES[7], row: 7, bg: 'floor', Send: S8,
    html(id) {
      return `<div class="Z fx8">${himView(PT(8), 'me')}
        <svg class="fx8-f" width="0" height="0" style="position:absolute"><filter id="${id}-w" x="-5%" y="-5%" width="110%" height="110%" color-interpolation-filters="sRGB">
          <feGaussianBlur in="SourceAlpha" stdDeviation="20" result="b"/><feColorMatrix in="b" values="0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0 0 1" result="a"/>
          <feConvolveMatrix in="a" order="3" kernelMatrix="-1 0 1 -2 0 2 -1 0 1" divisor=".35" bias=".5" preserveAlpha="true" edgeMode="duplicate" result="gx"/>
          <feConvolveMatrix in="a" order="3" kernelMatrix="-1 -2 -1 0 0 0 1 2 1" divisor=".35" bias=".5" preserveAlpha="true" edgeMode="duplicate" result="gy"/>
          <feColorMatrix in="gx" values="1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1" result="rx"/><feColorMatrix in="gy" values="0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 1" result="ry"/>
          <feComposite in="rx" in2="ry" operator="arithmetic" k2="1" k3="1" result="m"/>
          <feDisplacementMap in="SourceGraphic" in2="m" scale="40" xChannelSelector="R" yChannelSelector="G" result="d"/><feComposite in="d" in2="SourceAlpha" operator="in"/></filter><filter id="${id}-b" x="-5%" y="-5%" width="110%" height="110%" color-interpolation-filters="sRGB">
          <feGaussianBlur in="SourceAlpha" stdDeviation="20" result="b"/><feColorMatrix in="b" values="0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0 0 1" result="a"/>
          <feConvolveMatrix in="a" order="3" kernelMatrix="-1 0 1 -2 0 2 -1 0 1" divisor=".35" bias=".5" preserveAlpha="true" edgeMode="duplicate" result="gx"/>
          <feConvolveMatrix in="a" order="3" kernelMatrix="-1 -2 -1 0 0 0 1 2 1" divisor=".35" bias=".5" preserveAlpha="true" edgeMode="duplicate" result="gy"/>
          <feColorMatrix in="gx" values="1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1" result="rx"/><feColorMatrix in="gy" values="0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 1" result="ry"/>
          <feComposite in="rx" in2="ry" operator="arithmetic" k2="1" k3="1" result="m"/>
          <feDisplacementMap in="SourceGraphic" in2="m" scale="40" xChannelSelector="R" yChannelSelector="G" result="d"/></filter></svg>
        <div class="fx8-sd"></div><div class="fx8-g" style="filter:url(#${id}-w)"><div class="fx8-in" data-noface>${himView(PT(8), 'deco')}</div><div class="fx8-sh"></div></div>
        ${SLOT}<div class="fx8-fr" style="backdrop-filter:url(#${id}-b) blur(4px) brightness(1.05)"></div><div class="fx8-fr" style="backdrop-filter:url(#${id}-b) blur(4px) brightness(1.05)"></div><div class="fx8-fr" style="backdrop-filter:url(#${id}-b) blur(4px) brightness(1.05)"></div><div class="fx8-fr" style="backdrop-filter:url(#${id}-b) blur(4px) brightness(1.05)"></div><div class="fx8-fr" style="backdrop-filter:blur(2.5px)"></div><div class="fx8-fr" style="backdrop-filter:blur(2.5px)"></div><div class="fx8-fr" style="backdrop-filter:blur(2.5px)"></div><div class="fx8-fr" style="backdrop-filter:blur(2.5px)"></div><div class="fx8-fr" style="backdrop-filter:blur(1.2px)"></div><div class="fx8-fr" style="backdrop-filter:blur(1.2px)"></div><div class="fx8-fr" style="backdrop-filter:blur(1.2px)"></div><div class="fx8-fr" style="backdrop-filter:blur(1.2px)"></div><div class="fx8-r"><div class="fx8-sp"></div><div class="fx8-sw"></div></div></div>
        <style>
          .fx8-g{position:absolute;overflow:hidden;isolation:isolate}.fx8-sd{position:absolute}
          .fx8-in{position:absolute;left:0;top:0;width:var(--zw);height:var(--zh);transform-origin:0 0}
          .fx8-sh{position:absolute;inset:0;border-radius:inherit}
          .fx8-r{position:absolute;pointer-events:none;overflow:hidden}.fx8-fr{position:absolute;pointer-events:none}
          .fx8-sw{position:absolute;top:-20%;bottom:-20%;left:0;width:38%;transform-origin:50% 50%}
          .fx8-sp{position:absolute;inset:0;border-radius:inherit}
          .f[data-s=white] .fx8-sd{box-shadow:0 22px 44px -18px rgba(0,19,47,.38),0 4px 10px -4px rgba(0,19,47,.18)}
          .f[data-s=white] .fx8-sh{background:linear-gradient(180deg,rgba(255,255,255,.16),rgba(255,255,255,0) 38%,rgba(0,19,47,0) 70%,rgba(0,19,47,.10))}
          .f[data-s=white] .fx8-r{box-shadow:inset 0 1.5px 0 rgba(255,255,255,.95),inset 0 -1.5px 0 rgba(255,255,255,.45),inset 0 0 0 1px rgba(255,255,255,.55),inset 0 0 18px rgba(255,255,255,.28),inset 0 -8px 22px -12px rgba(0,19,47,.25)}
          .f[data-s=white] .fx8-sw{background:linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.34) 45%,rgba(255,255,255,.5) 50%,rgba(255,255,255,.34) 55%,rgba(255,255,255,0))}
          .f[data-s=white] .fx8-sp{background:radial-gradient(ellipse 42% 26% at 30% 14%,rgba(255,255,255,.55),rgba(255,255,255,0) 70%),radial-gradient(ellipse 30% 18% at 76% 92%,rgba(255,255,255,.22),rgba(255,255,255,0) 70%)}
          .f[data-s=blue] .fx8-sd{box-shadow:0 22px 44px -18px rgba(0,8,24,.6),0 4px 10px -4px rgba(0,8,24,.35)}
          .f[data-s=blue] .fx8-sh{background:linear-gradient(180deg,rgba(160,205,255,.18),rgba(160,205,255,0) 40%,rgba(0,8,24,0) 70%,rgba(0,8,24,.16))}
          .f[data-s=blue] .fx8-r{box-shadow:inset 0 1.5px 0 rgba(220,236,255,.95),inset 0 -1.5px 0 rgba(160,205,255,.45),inset 0 0 0 1px rgba(160,205,255,.5),inset 0 0 18px rgba(160,205,255,.25),inset 0 -8px 22px -12px rgba(0,8,24,.4)}
          .f[data-s=blue] .fx8-sw{background:linear-gradient(90deg,rgba(220,236,255,0),rgba(220,236,255,.3) 45%,rgba(220,236,255,.46) 50%,rgba(220,236,255,.3) 55%,rgba(220,236,255,0))}
          .f[data-s=blue] .fx8-sp{background:radial-gradient(ellipse 42% 26% at 30% 14%,rgba(220,236,255,.5),rgba(220,236,255,0) 70%),radial-gradient(ellipse 30% 18% at 76% 92%,rgba(160,205,255,.2),rgba(160,205,255,0) 70%)}
        </style>`;
    },
    camera(t, d) { const e = dive(t); if (e <= 0) return null; const g = geo(t); return { a: g.c, f: [mix(g.c[0], ZC[0], e), mix(g.c[1], ZC[1], e)], S: Math.pow(S8, e) }; },
    seek(cam, t, d) {
      const g = geo(t), vis = g.c[1] - g.h / 2 < Z.h + 4 && t > 0, x0 = g.c[0] - g.w / 2, y0 = g.c[1] - g.h / 2;
      const box = { display: vis ? 'block' : 'none', left: x0.toFixed(1) + 'px', top: y0.toFixed(1) + 'px', width: g.w.toFixed(1) + 'px', height: g.h.toFixed(1) + 'px', borderRadius: g.rr.toFixed(1) + 'px' };
      const gl = one(cam, '.fx8-g'), rim = one(cam, '.fx8-r'), sd = one(cam, '.fx8-sd'); [gl, rim, sd].forEach(e => Object.assign(e.style, box));
      // the frosted edge band: three nested rings of four strips, each frosting what is under it (his frame, then the next shot),
      // so the frost is strongest at the rim and fades inward; the middle stays clear
      const fr = own(cam, '.fx8-fr'), bw = cl(.15 * Math.min(g.w, g.h), 10, 44), n = v => v.toFixed(1) + 'px', R = n(Math.min(g.rr, g.h / 2));
      for (let i = 0; i < 3; i++) { const k = Math.min(bw * [1, .62, .3][i], g.h / 2, g.w / 2);
        [[x0, y0, g.w, k, `${R} ${R} 0 0`], [x0, y0 + g.h - k, g.w, k, `0 0 ${R} ${R}`], [x0, y0 + k, k, g.h - 2 * k, '0'], [x0 + g.w - k, y0 + k, k, g.h - 2 * k, '0']]
          .forEach(([x, y, w, h, br], j) => Object.assign(fr[i * 4 + j].style, { display: box.display, left: n(x), top: n(y), width: n(w), height: n(Math.max(h, 0)), borderRadius: br })); }
      const sw = P(t, .56, .34), sx = mix(-.55, 1.25, eio(sw));   // a soft specular sweeps across the glass once
      Object.assign(one(cam, '.fx8-sw').style, { left: (sx * 100).toFixed(1) + '%', transform: 'rotate(18deg)', opacity: (Math.sin(Math.PI * sw)).toFixed(3) });
      // inside the glass: your frame magnified (data-noface: the one-face rule ignores it, since the glass stays under your mouth) about the glass centre, with a slow liquid refraction that calms as the drop settles
      const mag = 1.14, inn = one(cam, '.fx8-in');
      inn.style.transform = `translate(${(-x0).toFixed(1)}px,${(-y0).toFixed(1)}px) translate(${g.c[0].toFixed(1)}px,${g.c[1].toFixed(1)}px) scale(${mag}) translate(${(-g.c[0]).toFixed(1)}px,${(-g.c[1]).toFixed(1)}px)`;
      // edge lensing: the slope of the blurred pane shape bends what is under the rim, like a thick lens
      const sg = cl(.16 * Math.min(g.w, g.h), 6, 40), dv = (8 / (2.5 * sg) / .42).toFixed(4);
      own(cam, '.fx8-f feGaussianBlur').forEach(b => b.setAttribute('stdDeviation', sg.toFixed(2)));
      own(cam, '.fx8-f feConvolveMatrix').forEach(c => c.setAttribute('divisor', dv));
      own(cam, '.fx8-f feDisplacementMap').forEach(m => m.setAttribute('scale', (-1.1 * sg).toFixed(2)));
      const fade = 1 - P(t, d - .17, .14);                         // rim, frost and shadow hold through the dive and clear just before the hand-off
      rim.style.opacity = fade.toFixed(3); fr.forEach(e => e.style.opacity = (fade * P(t, .63, .07)).toFixed(3));   // frost once the pane has squared up sd.style.opacity = (1 - P(t, T.dive[0] + .08, .2)).toFixed(3);
    },
    win(t) { const g = geo(t); return { c: g.c, w: g.w, h: g.h, rr: g.rr }; },
    winIn: t => P(t, ...T.win),
  };
  FX[8] = LG;
})();
// Feed cut F (21/10/2026, Charlie: "between Liquid Glass and here is very fast"): no dive into the pane. His face stays whole with the
// glass over him to the end; Screen in Screen dissolves in over the last 4 frames.
if (FACEF) Object.assign(FX[8], { noDive: true, fullWin: true });
