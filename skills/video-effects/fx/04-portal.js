// Effect 04 Portal: a ring of blue light opens below his chin, filled with a turning blue swirl. We fly through it into the next effect.
// No second face in the ring while it holds. The next effect fades in only once the dive has opened the ring out.
(() => {
  const PO = V === 'L' ? { c: [Z.w / 2, Z.h * .79], R: 165 } : V === 'A' ? { c: [Z.w * .8, Z.h * .6], R: 140 } : { c: [540, 1440], R: 220 };
  const IN = .84, RW = .16;   // the window is the inner 84% of the ring; the rim is 16% of the radius
  // absolute seconds (the beat is ~1.0s): opens 0.04-0.34, holds open, dive over the last 0.45s (never before 0.57s)
  const TM = d => { const dv = Math.max(.57, d - .45); return { dv, dl: d - dv }; };
  const rad = t => PO.R * ez(P(t, .04, .3));
  FX[4] = {
    name: NAMES[3], row: 3, bg: 'floor', Send: .7 * Z.w / (PO.R * IN),   // the window shows 70% of the next shot's width, so it reads as him, not as a thin card
    // the window radius in this scene's coords: the inner ring, then it opens out to cover the whole zone by the hand-off
    wr(t, d) { const { dv, dl } = TM(d); return mix(rad(t) * (IN + .02), 1.02 * ZD / this.Send, ez(P(t, dv + .05 * dl, .8 * dl))); },
    html() { return `<style>
      .fx4g{position:absolute;border-radius:50%;box-shadow:0 0 70px 14px rgba(0,113,227,.42),0 30px 60px -10px rgba(0,19,47,.35)}
      .fx4r{position:absolute;border-radius:50%;background:conic-gradient(from 0deg,#0071E3,#5AB0FF,#fff,#5AB0FF,#0071E3,#3B8CFF,#e8f3ff,#3B8CFF,#0071E3);
        -webkit-mask:radial-gradient(closest-side,transparent ${(100 * (1 - RW)).toFixed(1)}%,#000 ${(100 * (1 - RW) + .8).toFixed(1)}%);mask:radial-gradient(closest-side,transparent ${(100 * (1 - RW)).toFixed(1)}%,#000 ${(100 * (1 - RW) + .8).toFixed(1)}%)}
      .fx4f{position:absolute;border-radius:50%;background:radial-gradient(closest-side,#fff 0%,#dcecff 34%,rgba(0,113,227,.55) 78%,#0071E3 100%)}
      .fx4f::after{content:'';position:absolute;inset:0;border-radius:50%;background:repeating-conic-gradient(from 0deg,rgba(255,255,255,.55) 0deg 14deg,rgba(255,255,255,0) 14deg 45deg);-webkit-mask:radial-gradient(closest-side,transparent 18%,#000 70%);mask:radial-gradient(closest-side,transparent 18%,#000 70%)}
      .f[data-s=white] .fx4g{box-shadow:0 0 60px 10px rgba(0,113,227,.30),0 30px 60px -12px rgba(0,19,47,.28)}
      </style>${himView(PT(4), 'me')}<div class="fx4g"></div><div class="fx4f"></div>${SLOT}<div class="fx4r"></div>`; },
    camera(t, d) { const { dv, dl } = TM(d), e = ez(P(t, dv, dl)); return e > 0 ? { a: PO.c, f: [mix(PO.c[0], ZC[0], e), mix(PO.c[1], ZC[1], e)], S: Math.pow(this.Send, e) } : null; },
    seek(cam, t, d) { const r = Math.max(rad(t), this.wr(t, d) / (IN + .02)), { dv, dl } = TM(d), fade = 1 - P(t, dv + .5 * dl, .3 * dl);
      const box = el => Object.assign(el.style, { left: (PO.c[0] - r).toFixed(1) + 'px', top: (PO.c[1] - r).toFixed(1) + 'px', width: (2 * r).toFixed(1) + 'px', height: (2 * r).toFixed(1) + 'px', display: r > .5 ? 'block' : 'none' });
      const g = one(cam, '.fx4g'), rim = one(cam, '.fx4r'), fl = one(cam, '.fx4f'); box(g); box(rim); box(fl);
      fl.style.transform = `rotate(${(-160 * t).toFixed(1)}deg)`; fl.style.opacity = fade.toFixed(3);
      rim.style.transform = `rotate(${(400 * t).toFixed(1)}deg)`; rim.style.opacity = fade.toFixed(3); g.style.opacity = fade.toFixed(3); },
    win(t, d) { return { c: PO.c, r: this.wr(t, d) }; },
    winIn: (t, d) => { const { dv, dl } = TM(d); return P(t, dv + .3 * dl, .25 * dl); },   // late: the ring is already wide when the next shot shows
  };
})();

// Feed cut F (20/10/2026 23:36, Charlie 23:34: "portal one looks really cheap on the current reel versus on the infographic"):
// the LinkedIn grid Portal, copied in and scaled to the face card. A glowing blue ring opens on his face. Inside it a smaller
// him turns in a blue vortex. Then we dive through the ring: the inner him grows to fill the card at exactly his plain view,
// so the next effect (which opens on him) takes over with no jump. Cuts A and B keep the ring above.
if (FACEF) (() => {
  const C = [Z.w / 2, BEYE + 100], R = 205, K0 = .42;
  const TM = d => { const dv = Math.max(.5, d - .5); return { dv, dl: d - dv }; };
  const rad = t => R * ez(P(t, .02, .3)), E = (t, d) => { const { dv, dl } = TM(d); return ez(P(t, dv, dl)); };
  const vx = [0, 60, 120, 180, 240, 300].map(r => `<path transform="rotate(${r})" d="${(() => { let d = ''; for (let j = 0; j <= 40; j++) { const t = j / 40, a = t * 3.2, rr = 55 + 45 * t; d += (j ? 'L' : 'M') + (rr * Math.cos(a)).toFixed(1) + ',' + (rr * Math.sin(a)).toFixed(1); } return d; })()}" fill="none" stroke="rgba(170,215,255,.7)" stroke-width="3.5" stroke-linecap="round"/>`).join('');
  FX[4] = {
    name: NAMES[3], row: 3, bg: 'floor', Send: .7 * Z.w / (R * .9),
    wr(t, d) { return mix(rad(t), 1.02 * ZD / this.Send, E(t, d)); },
    html() { return `<style>
      .p4w{position:absolute;border-radius:50%;overflow:hidden;background:#0a2a66}
      .p4c{position:absolute;left:0;top:0;width:${Z.w}px;height:${Z.h}px;transform-origin:0 0}
      .p4t{position:absolute;inset:0;pointer-events:none;border-radius:50%;background:radial-gradient(circle,rgba(0,40,110,0) 0,rgba(0,40,110,0) 55%,rgba(0,80,184,.55) 80%,rgba(4,26,80,.92) 100%)}
      .p4v{position:absolute;inset:0;pointer-events:none;width:100%;height:100%;mix-blend-mode:screen}
      .p4r{position:absolute;border-radius:50%;pointer-events:none;box-shadow:0 0 0 6px #0071E3,0 0 0 10px rgba(127,196,255,.95),0 0 40px 16px rgba(0,113,227,.6),inset 0 0 30px 8px rgba(127,196,255,.6)}
      </style>${himView(PT(4), 'me')}<div class="p4w"><div class="p4c">${himView(PT(4), 'me')}</div><div class="p4t"></div><svg class="p4v" style="pointer-events:none" viewBox="-100 -100 200 200">${vx}</svg></div>${SLOT}<div class="p4r"></div>`; },
    camera(t, d) { const e = E(t, d); return e > 0 ? { a: C, f: [mix(C[0], ZC[0], e), mix(C[1], ZC[1], e)], S: Math.pow(this.Send, e) } : null; },
    seek(cam, t, d) {
      const e = E(t, d), S = Math.pow(this.Send, e), r = Math.max(rad(t), this.wr(t, d)), fade = 1 - P(e, .82, .16);
      const w = one(cam, '.p4w'), rim = one(cam, '.p4r'), c = one(cam, '.p4c'), tn = one(cam, '.p4t'), v = one(cam, '.p4v');
      const box = (el, q) => Object.assign(el.style, { left: (C[0] - q).toFixed(1) + 'px', top: (C[1] - q).toFixed(1) + 'px', width: (2 * q).toFixed(1) + 'px', height: (2 * q).toFixed(1) + 'px', display: q > .5 ? 'block' : 'none' });
      box(w, r); box(rim, r + 5); rim.style.opacity = fade.toFixed(3);
      // the inner him: K0 of his view about the ring centre, growing to exactly his plain view on screen as the dive ends
      const k = K0 + (1 - K0) * eio(e), m = k / S, ox = C[0] - (C[0] - r) + e * (C[0] - ZC[0]) / S - m * C[0], oy = C[1] - (C[1] - r) + e * (C[1] - ZC[1]) / S - m * C[1];
      c.style.transform = `translate(${ox.toFixed(2)}px,${oy.toFixed(2)}px) scale(${m.toFixed(5)})`;
      tn.style.opacity = fade.toFixed(3); v.style.opacity = (1 - P(t, .45, .5)).toFixed(3); v.style.transform = `rotate(${(-250 * t).toFixed(1)}deg)`;
    },
    win(t, d) { return { c: C, r: this.wr(t, d) }; },
    winIn: (t, d) => P(t, d - .133, .133),
  };
})();
