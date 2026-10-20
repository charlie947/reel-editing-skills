// Effect 09
// ---------------- 9 Screen in Screen: pull back out of his shot to find it playing as a vertical video on a laptop on a desk, then dive back into the screen.
(() => {
  const Lw = Math.min(.98 * Z.w, .78 * Z.h);                         // lid width
  const dw = .935 * Lw, dh = dw * .625;                                // the display
  const lid = { w: Lw, h: dh + .085 * Lw }, cx = Z.w / 2, ly = .43 * Z.h - lid.h / 2;   // lid top
  const D = { x: cx - dw / 2, y: ly + .032 * Lw, w: dw, h: dh };
  const vh = .9 * dh, vw = vh * Z.w / Z.h, VC = [cx, D.y + dh / 2];   // the vertical video (zone shaped): the window
  const S9 = Z.h / vh;
  const bw = 1.02 * Lw, bh = .4 * Lw, by = ly + lid.h, bw2 = 1.2 * Lw;   // the keyboard deck, seen from just above: a trapezoid widening toward us
  const deck = () => { const X = (u, v) => cx + (u - .5) * mix(bw, bw2, v), Y = v => by + bh * v, pt = (u, v) => `${X(u, v).toFixed(1)},${Y(v).toFixed(1)}`;
    const quad = (u0, v0, u1, v1) => `${pt(u0, v0)} ${pt(u1, v0)} ${pt(u1, v1)} ${pt(u0, v1)}`;
    let k = `<polygon class="d" points="${quad(0, 0, 1, 1)}"/><polygon class="lip" points="${quad(0, .965, 1, 1)}"/><polygon class="kw" points="${quad(.09, .07, .91, .52)}"/>`;
    const rows = [13, 13, 12, 12, 9]; rows.forEach((n, j) => { const v0 = .09 + j * .085, v1 = v0 + .07; for (let i = 0; i < n; i++) { const g = .82 / n, u0 = .1 + i * g + .006, u1 = u0 + g - .012; k += `<polygon class="ky" points="${quad(u0, v0, u1, v1)}"/>`; } });
    k += `<polygon class="tp" points="${quad(.33, .58, .67, .92)}"/>`;
    return `<svg class="Z fx9-deck" viewBox="0 0 ${Z.w} ${Z.h}">${k}</svg>`; };
  const T = { pull: [.02, .40], win: [.55, .14], dive: [.86, .48] };
  const zoom = (t) => { const e1 = ez(P(t, ...T.pull)), e2 = eio(P(t, ...T.dive)), push = 1 + .04 * ez(P(t, .42, .5)) * (1 - e2);
    return e2 > 0 ? { k: e2, S: Math.pow(S9, e2) * push } : { k: 1 - e1, S: Math.pow(S9, 1 - e1) * push }; };
  const inVid = (cls, t) => `<div class="Z" style="transform-origin:0 0;transform:${embT(VC, S9)}">${himView(t, cls)}</div>`;
  const SIS = {
    name: NAMES[8], row: 8, bg: 'blue', Send: S9,
    html(id) {
      const r = v => v.toFixed(1) + 'px';
      return `<div class="Z fx9">
        <div class="fx9-desk" style="top:${r(by - .02 * Lw)}"></div>
        <div class="fx9-sha" style="left:${r(cx - bw2 * .55)};top:${r(by + bh * .55)};width:${r(bw2 * 1.1)};height:${r(bh * .7)}"></div>${deck()}
        <div class="fx9-lid" style="left:${r(cx - Lw / 2)};top:${r(ly)};width:${r(Lw)};height:${r(lid.h)};border-radius:${r(.035 * Lw)} ${r(.035 * Lw)} ${r(.012 * Lw)} ${r(.012 * Lw)}">
          <div class="fx9-cam" style="left:${r(Lw / 2 - .007 * Lw)};top:${r(.012 * Lw)};width:${r(.014 * Lw)};height:${r(.014 * Lw)}"></div></div>
        <div class="fx9-disp" style="left:${r(D.x)};top:${r(D.y)};width:${r(D.w)};height:${r(D.h)};border-radius:${r(.012 * Lw)}">
          <div class="fx9-amb" style="left:${r(-D.x)};top:${r(-D.y)}"><div class="Z" style="transform-origin:${VC[0]}px ${VC[1]}px;transform:scale(1.9)">${inVid('deco', PT(9) + 's')}</div></div>
          <div class="fx9-vig"></div></div>
        <div class="fx9-v" style="border-radius:${r(Z.r / S9)};left:${r(VC[0] - vw / 2)};top:${r(VC[1] - vh / 2)};width:${r(vw)};height:${r(vh)}"><div class="fx9-vin" style="left:${r(-(VC[0] - vw / 2))};top:${r(-(VC[1] - vh / 2))}">${inVid('me', PT(9))}</div></div>
        ${SLOT}
        <div class="fx9-ui" style="left:${r(VC[0] - vw / 2)};top:${r(VC[1] + vh / 2 - Math.max(2, vh * .012))};width:${r(vw)};height:${r(Math.max(2, vh * .012))}"><i></i></div>
      </div>
      <style>
        .fx9 .fx9-desk{position:absolute;left:-20%;width:140%;bottom:-40%}
        .fx9 .fx9-sha{position:absolute;border-radius:50%;filter:blur(14px)}
        .fx9 .fx9-lid,.fx9 .fx9-disp,.fx9 .fx9-v,.fx9 .fx9-ui,.fx9 .fx9-cam{position:absolute}
        .fx9 .fx9-disp,.fx9 .fx9-v{overflow:hidden}
        .fx9 .fx9-amb{position:absolute;width:var(--zw);height:var(--zh);filter:blur(18px) saturate(1.1)}
        .fx9 .fx9-vin{position:absolute;width:var(--zw);height:var(--zh)}
        .fx9 .fx9-vig{position:absolute;inset:0;background:radial-gradient(ellipse 70% 90% at 50% 50%,rgba(0,0,0,.15),rgba(0,0,0,.55))}
        .fx9 .fx9-cam{border-radius:50%;background:#2a2c31;box-shadow:inset 0 0 0 1px rgba(255,255,255,.06)}
        .fx9 .fx9-v{box-shadow:0 0 0 .5px rgba(255,255,255,.12),0 8px 24px rgba(0,0,0,.45)}
        .fx9 .fx9-ui{background:rgba(255,255,255,.28);overflow:hidden}.fx9 .fx9-ui i{position:absolute;left:0;top:0;bottom:0;background:#0071E3}
        .fx9 .fx9-deck polygon{stroke:none}.fx9 .fx9-deck .ky{fill:#2d3035}.fx9 .fx9-deck .kw{fill:#15171a}
        .f[data-s=white] .fx9 .fx9-desk{background:linear-gradient(180deg,#e7ebf0,#f4f6f9 30%,#ffffff 80%);box-shadow:0 -1px 0 rgba(29,29,31,.05)}
        .f[data-s=white] .fx9 .fx9-sha{background:radial-gradient(ellipse 50% 50% at 50% 50%,rgba(0,19,47,.34),rgba(0,19,47,0))}
        .f[data-s=white] .fx9 .fx9-lid{background:#111214;box-shadow:inset 0 0 0 1.5px #c9ced6,inset 0 0 0 2.5px #8d939c,0 30px 60px -24px rgba(0,19,47,.35)}
        .f[data-s=white] .fx9 .fx9-deck .d{fill:#dfe3e8}.f[data-s=white] .fx9 .fx9-deck .lip{fill:#aab1ba}.f[data-s=white] .fx9 .fx9-deck .tp{fill:#d3d8de;stroke:#c3c9d0;stroke-width:1}
        .f[data-s=white] .fx9 .fx9-disp{background:#0b0c0e}
        .f[data-s=blue] .fx9 .fx9-desk{background:linear-gradient(180deg,#0d1a33,#0b1426 40%,#081020);box-shadow:0 -1px 0 rgba(90,176,255,.25)}
        .f[data-s=blue] .fx9 .fx9-sha{background:radial-gradient(ellipse 50% 50% at 50% 50%,rgba(0,0,0,.6),rgba(0,0,0,0))}
        .f[data-s=blue] .fx9 .fx9-lid{background:#0a0b0d;box-shadow:inset 0 0 0 1.5px #aab3c0,inset 0 0 0 2.5px #5d6672,0 30px 60px -24px rgba(0,0,0,.6)}
        .f[data-s=blue] .fx9 .fx9-deck .d{fill:#c9d0d9}.f[data-s=blue] .fx9 .fx9-deck .lip{fill:#7d8794}.f[data-s=blue] .fx9 .fx9-deck .tp{fill:#bcc4ce;stroke:#a9b2bd;stroke-width:1}
        .f[data-s=blue] .fx9 .fx9-disp{background:#050608}
      </style>`;
    },
    camera(t) { const z = zoom(t); return { a: VC, f: [mix(VC[0], ZC[0], z.k), mix(VC[1], ZC[1], z.k)], S: z.S }; },
    seek(cam, t, d) {
      one(cam, '.fx9-ui i').style.width = (100 * cl(.18 + .5 * P(t, 0, 1.34))).toFixed(2) + '%';
      const ui = 1 - P(t, T.dive[0] + .06, .12); one(cam, '.fx9-ui').style.opacity = (ui * P(t, .2, .15)).toFixed(3);   // the progress bar shows only while we are out on the desk
      one(cam, '.fx9-v').style.opacity = (1 - P(t, T.win[0] + T.win[1], .01)).toFixed(3);   // my own shot hands over to the window once the window is fully in
    },
    win: () => ({ c: VC, w: vw, h: vh, rr: Z.r / S9 }),
    winIn: t => P(t, ...T.win),
  };
  FX[9] = SIS;
})();
