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
