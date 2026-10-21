// Effect 10
// ---------------- 10 Frame Break: his shot shrinks into a printed photo. The print keeps his body (a still, like any print); his live head and
// shoulders stay out over the top border, chips of the border fly off, a long readable hold, then we dive into the print.
(() => {
  const COL = 1265;                                                     // the print's top edge on his plate (px): just under his shoulders
  const W1 = Math.min(.86 * Z.w, .4 * Z.h), sH = W1 / 1080, H1 = (1920 - COL) * sH, B = .035 * W1, BB = 2.6 * B;   // the print is exactly his plate below the edge (a 6x4)
  const headUp = (COL - PG.crown) * sH;                                 // crown to collar
  const total = headUp + H1 + BB, top0 = Math.max(.04 * Z.h, (Z.h - total) / 2 + .01 * Z.h);
  const R1 = { x: Z.w / 2 - W1 / 2, y: top0 + headUp, w: W1, h: H1 };    // the print's image area (scene coords)
  const eyeH = R1.y - (COL - PG.eye) * sH, cx = Z.w / 2, RC = [cx, R1.y + H1 / 2];
  const S10 = 2.4, wE = Z.w / S10, hE = Z.h / S10, LIFT = 0;
  const sp = p => p <= 0 ? 0 : p >= 1 ? 1 : 1 - Math.exp(-6 * p) * Math.cos(9 * p) * (1 - p);
  const DF = .78;   // the face-card beat length this older block was timed to (the F block below replaces it in this pack)
  const form = t => FACEF ? ez(P(t, .04, .34)) * (1 - eio(P(t, DF - .22, .2))) : ez(P(t, .08, .72));   // F's beat is 0.78s: the print lands by 0.38s, holds, and opens back out to his full view for the seam (no double head)
  const dv = (t, d) => FACEF ? 0 : eio(P(t, d - .56, .56));   // F: no dive, the print holds at full strength to the seam
  // him: scale and eye height (scene coords), and the live/still split line at his collar
  const him = t => { const f = form(t), lift = LIFT * sp(P(t, .55, .7)); const s = mix(BS, sH, f), ey = mix(BEYE, eyeH, f) - lift; return { s, ey, col: ey + (COL - PG.eye) * s }; };
  const rect = t => { const f = form(t); return { x0: mix(-.12 * Z.w, R1.x, f), x1: mix(1.12 * Z.w, R1.x + W1, f), y0: mix(-.12 * Z.h, R1.y, f), y1: mix(1.12 * Z.h, R1.y + H1, f), b: B * f }; };
  const HT = h => `translate(${cx}px,${h.ey.toFixed(2)}px) scale(${(h.s / BS).toFixed(5)}) translate(${-cx}px,${(-BEYE).toFixed(2)}px)`;
  const ins = (x0, y0, x1, y1) => `inset(${y0.toFixed(1)}px ${(Z.w - x1).toFixed(1)}px ${(Z.h - y1).toFixed(1)}px ${x0.toFixed(1)}px)`;
  // border chips: start on the top border just outside his shoulders, fly up and out, fall, fade. Never toward his face.
  const CH = [[-1, .9, 160, 330, -260, .9], [-1, .97, 230, 250, 340, .7], [-1, .84, 110, 400, -120, .55], [-1, 1.02, 300, 190, 210, .45],
              [1, .9, 170, 320, 280, .85], [1, .97, 240, 260, -330, .7], [1, .85, 120, 390, 150, .5], [1, 1.03, 290, 200, -230, .42]];
  const chipShapes = ['0 0,100% 18%,78% 100%,8% 72%', '12% 0,100% 30%,60% 100%,0 60%', '0 20%,85% 0,100% 85%,20% 100%', '30% 0,100% 50%,40% 100%,0 40%'];
  const FB = {
    name: NAMES[9], row: 9, bg: 'floor', Send: S10,
    html(id) {
      const chips = CH.map((c, i) => `<div class="fx10-ch" style="clip-path:polygon(${chipShapes[i % 4]})"></div>`).join('');
      return `<div class="Z fx10"><div class="Z fx10-w">
        <div class="fx10-pp"></div>
        <div class="Z fx10-r"><div class="fx10-bd"></div><div class="Z fx10-room"><div class="Z fx10-h">${himView(PT(10), 'deco')}</div></div>
          <div class="Z fx10-tor"><div class="Z fx10-h">${cut(PT(10), cx, BEYE, BS, 'deco')}</div></div></div>
        ${SLOT}
        <div class="Z fx10-hd"><div class="Z fx10-h">${cut(PT(10), cx, BEYE, BS, 'me')}</div></div>
        <div class="Z fx10-chs">${chips}</div></div></div>
      <style>
        .fx10 .fx10-pp{position:absolute}.fx10 .fx10-bd{position:absolute;left:0;top:0;width:var(--zw);height:var(--zh)}
        .fx10 .fx10-h{transform-origin:0 0}.fx10 .fx10-ch{position:absolute;left:0;top:0;width:${(.06 * W1).toFixed(1)}px;height:${(.045 * W1).toFixed(1)}px}
        .f[data-s=white] .fx10 .fx10-pp{background:#fff;box-shadow:inset 0 0 0 1px rgba(29,29,31,.05),0 2px 4px rgba(0,19,47,.08),0 34px 60px -26px rgba(0,19,47,.45)}
        .f[data-s=white] .fx10 .fx10-bd{background:radial-gradient(ellipse 70% 60% at 50% 38%,#f4f7fb,#dfe6ef 70%,#cfd8e4)}
        .f[data-s=white] .fx10 .fx10-hd{filter:drop-shadow(0 14px 16px rgba(0,19,47,.22))}
        .f[data-s=white] .fx10 .fx10-ch{background:linear-gradient(160deg,#ffffff,#eef1f5)}
        .f[data-s=white] .fx10 .fx10-chs{filter:drop-shadow(0 6px 6px rgba(0,19,47,.22))}
        .f[data-s=blue] .fx10 .fx10-pp{background:#f4f6f9;box-shadow:0 2px 4px rgba(0,0,0,.25),0 34px 60px -26px rgba(0,0,0,.7)}
        .f[data-s=blue] .fx10 .fx10-bd{background:radial-gradient(ellipse 70% 60% at 50% 38%,#1c4f9a,#0b2a5c 70%,#071a3a)}
        .f[data-s=blue] .fx10 .fx10-hd{filter:drop-shadow(0 14px 16px rgba(0,0,0,.4))}
        .f[data-s=blue] .fx10 .fx10-ch{background:linear-gradient(160deg,#ffffff,#dfe5ee)}
        .f[data-s=blue] .fx10 .fx10-chs{filter:drop-shadow(0 6px 6px rgba(0,0,0,.4))}
      </style>`;
    },
    camera(t, d) { const e = dv(t, d), push = 1 + .07 * ez(P(t, .9, 2.5)); if (t <= .9) return null;
      return { a: RC, f: [mix(RC[0], ZC[0], e), mix(RC[1], ZC[1], e)], S: Math.pow(S10, e) * mix(push, 1, e) }; },
    seek(cam, t, d) {
      const h = him(t), R = rect(t), e = dv(t, d), HTs = HT(h);
      own(cam, '.fx10-h').forEach(x => x.style.transform = HTs);
      const w = one(cam, '.fx10-w'), rot = -3.2 * ez(P(t, .15, .8)) * (1 - eio(P(t, d - .75, .6)));
      w.style.transformOrigin = `${RC[0]}px ${RC[1]}px`; w.style.transform = `rotate(${rot.toFixed(3)}deg)`;
      Object.assign(one(cam, '.fx10-pp').style, { left: (R.x0 - R.b).toFixed(1) + 'px', top: (R.y0 - R.b).toFixed(1) + 'px', width: (R.x1 - R.x0 + 2 * R.b).toFixed(1) + 'px', height: (R.y1 - R.y0 + R.b + BB * form(t)).toFixed(1) + 'px' });
      one(cam, '.fx10-r').style.clipPath = ins(R.x0, R.y0, R.x1, R.y1);
      one(cam, '.fx10-room').style.opacity = (FACEF ? 1 - form(t) : 1 - P(t, .12, .4)).toFixed(3);            // the room dissolves to the studio backdrop
      const L = mix(1.15 * Z.h, R1.y + .3 * H1, ez(P(t, .1, .7)));                      // live above this line (inside the print), the print's still below it
      one(cam, '.fx10-tor').style.clipPath = ins(-50, L, Z.w + 50, Z.h + 50);
      const hd = one(cam, '.fx10-hd'), yb = Math.min(R.y0, L), q = v => v.toFixed(1) + 'px', bg = 3 * Z.h;   // over the top border he is free; below it he stays inside the print
      hd.style.clipPath = `polygon(${q(-bg)} ${q(-bg)},${q(bg)} ${q(-bg)},${q(bg)} ${q(yb)},${q(R.x1)} ${q(yb)},${q(R.x1)} ${q(L)},${q(R.x0)} ${q(L)},${q(R.x0)} ${q(yb)},${q(-bg)} ${q(yb)})`;
      hd.style.opacity = (FACEF ? 1 - P(t, d - .133, .133) : 1 - P(t, d - .28, .14)).toFixed(3);   // F: his live head stays out to the seam, then hands over with the dissolve
      // chips
      const tc = t - .62; const chs = own(cam, '.fx10-ch');
      CH.forEach(([sd, xs, vx, vy, vr, sc], i) => { const c = chs[i]; if (tc <= 0 || tc > 1.6) { c.style.display = 'none'; return; }
        const x0 = cx + sd * (.5 * W1 * xs - .03 * Z.w), y0 = R1.y - B / 2, k = W1 / 451;
        const x = x0 + sd * vx * k * tc, y = y0 - vy * k * tc + .5 * 1100 * k * tc * tc, o = 1 - P(tc, .9, .5);
        Object.assign(c.style, { display: 'block', opacity: (o * (FACEF ? Math.min(1, 3 * form(t)) : 1)).toFixed(3), transform: `translate(${x.toFixed(1)}px,${y.toFixed(1)}px) rotate(${(vr * tc).toFixed(1)}deg) scale(${sc})` }); });
    },
    win(t, d) { const m = eio(P(t, d - .5, .5)); return { c: RC, w: mix(W1, wE, m), h: mix(H1, hE, m), rr: Z.r / S10 * m }; },
    winIn: (t, d) => P(t, d - .3, .1),
  };
  FX[10] = FB;
})();


// Feed cut F (20/10/2026 23:50): the grid build does not fit the tall face card (his shoulders fill its width, so the frame hides behind him).
// F keeps this reel build at full strength (print lands by 0.44s, live head over the top border, chips fly) and dissolves into the
// next effect over the last 4 frames, with no dive (F's 0.78s beat is too short for one). A and B unchanged.
if (FACEF) Object.assign(FX[10], { Send: 1, camera: () => null, win: () => ({ c: ZC, w: Z.w, h: Z.h, rr: 0 }), winIn: (t, d) => P(t, d - .133, .133) });
// r7 (21/10/2026).
// One clean photo, all live: his shot shrinks into a white-mat print of his head and shoulders (one picture, no still body, so no seam).
// His live cut-out breaks out over the top border with chips flying, then the print grows back out to himView for the hand-off.
if (FACEF) (() => {
  const PX0 = 150, PX1 = 930, PY0 = 690, PY1 = 1240;                       // the print's crop on his plate: brow to upper chest, shoulder to shoulder
  const sP = .88 * Z.w / (PX1 - PX0), pw = (PX1 - PX0) * sP, ph = (PY1 - PY0) * sP;
  const px = (Z.w - pw) / 2, py = BEYE + 40, eyP = py + (PG.eye - PY0) * sP, exP = px + (540 - PX0) * sP, MAT = 12, MATB = 30;
  const TIN = .26, TOUT = .24;
  const CHP = [[-.42, -.9, 70, 1.1], [-.3, -1.1, -140, .8], [-.12, -1, 60, .6], [.14, -1.05, -80, .7], [.3, -.95, 120, .9], [.44, -1.1, -60, 1]];
  FX[10] = Object.assign({}, FX[10], {
    Send: 1, fullWin: true, camera: () => null,
    html(id, inner) {
      return `<style>.fx10v .pm{position:absolute;background:#fff;box-shadow:inset 0 0 0 1px rgba(29,29,31,.05),0 2px 4px rgba(0,19,47,.08),0 34px 60px -22px rgba(0,19,47,.5)}
        .fx10v .ch{position:absolute;width:26px;height:18px;background:#fff;box-shadow:0 4px 8px rgba(0,19,47,.25)}</style>
        <div class="Z fx10v"><div class="Z f10t" style="transform-origin:${Z.w / 2}px ${py + ph / 2}px"><div class="pm"></div>
        <div class="Z f10p" style="overflow:hidden"><div class="Z f10h" style="transform-origin:0 0">${himView(PT(10), 'me')}</div></div>
        <div class="Z f10c" style="overflow:hidden"><div class="Z f10hc" style="transform-origin:0 0">${cut(PT(10), Z.w / 2, BEYE, BS, 'me')}</div></div>
        ${CHP.map((c, i) => `<div class="ch c${i}" style="clip-path:polygon(${['0 0,100% 18%,78% 100%,8% 72%', '12% 0,100% 30%,60% 100%,0 60%', '0 20%,85% 0,100% 85%,20% 100%'][i % 3]})"></div>`).join('')}</div></div>${SLOT}`;
    },
    seek(cam, t, d) {
      const e = edgeE(t, d, TIN, TOUT), f = 1 - e, hold = P(t, TIN, d - TIN - TOUT);
      const s = Math.pow(BS, e) * Math.pow(sP * (1 + .03 * hold), f), ex = mix(exP, Z.w / 2, e), ey = mix(eyP, BEYE, e);
      const L = mix(px, 0, e), T = mix(py, 0, e), R = mix(px + pw, Z.w, e), B = mix(py + ph, Z.h, e);
      const tr = hvT(ex, ey, s); one(cam, '.f10h').style.transform = tr; one(cam, '.f10hc').style.transform = tr;
      one(cam, '.f10p').style.clipPath = `inset(${T.toFixed(1)}px ${(Z.w - R).toFixed(1)}px ${(Z.h - B).toFixed(1)}px ${L.toFixed(1)}px)`;
      one(cam, '.f10c').style.clipPath = `inset(0px 0px ${(Z.h - T - 2).toFixed(1)}px 0px)`;           // his head out over the top border, live, the same picture
      const m = one(cam, '.pm'), mt = MAT * f, mb = MATB * f;
      Object.assign(m.style, { left: (L - mt).toFixed(1) + 'px', top: (T - mt).toFixed(1) + 'px', width: (R - L + 2 * mt).toFixed(1) + 'px', height: (B - T + mt + mb).toFixed(1) + 'px', opacity: P(f, 0, .3).toFixed(3) });
      one(cam, '.f10t').style.transform = `rotate(${(-3.5 * f + 1.2 * Math.sin(Math.PI * hold) * f).toFixed(2)}deg)`;
      const bt = P(t, TIN - .04, .42);                                     // the chips break off the top border as his head comes through
      CHP.forEach(([ux, uy, rot, sp], i) => { const c = one(cam, '.fx10v .c' + i), g = bt * sp, x = px + pw / 2 + ux * pw + 160 * ux * g, y = T - 10 + uy * 260 * g + 420 * g * g;
        Object.assign(c.style, { left: x.toFixed(1) + 'px', top: y.toFixed(1) + 'px', transform: `rotate(${(rot * g).toFixed(1)}deg)`, opacity: (bt > 0 ? 1 - P(g, .6, .4) : 0) * (1 - P(e, 0, .2)) }); });
    },
    win: () => ({ c: ZC, w: Z.w, h: Z.h, rr: 0 }),
  });
})();
