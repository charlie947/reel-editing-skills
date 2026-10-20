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
  const form = t => ez(P(t, .08, .72));
  const dv = (t, d) => eio(P(t, d - .56, .56));
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
      one(cam, '.fx10-room').style.opacity = (1 - P(t, .12, .4)).toFixed(3);            // the room dissolves to the studio backdrop
      const L = mix(1.15 * Z.h, R1.y + .3 * H1, ez(P(t, .1, .7)));                      // live above this line (inside the print), the print's still below it
      one(cam, '.fx10-tor').style.clipPath = ins(-50, L, Z.w + 50, Z.h + 50);
      const hd = one(cam, '.fx10-hd'), yb = Math.min(R.y0, L), q = v => v.toFixed(1) + 'px', bg = 3 * Z.h;   // over the top border he is free; below it he stays inside the print
      hd.style.clipPath = `polygon(${q(-bg)} ${q(-bg)},${q(bg)} ${q(-bg)},${q(bg)} ${q(yb)},${q(R.x1)} ${q(yb)},${q(R.x1)} ${q(L)},${q(R.x0)} ${q(L)},${q(R.x0)} ${q(yb)},${q(-bg)} ${q(yb)})`;
      hd.style.opacity = (1 - P(t, d - .28, .14)).toFixed(3);
      // chips
      const tc = t - .62; const chs = own(cam, '.fx10-ch');
      CH.forEach(([sd, xs, vx, vy, vr, sc], i) => { const c = chs[i]; if (tc <= 0 || tc > 1.6) { c.style.display = 'none'; return; }
        const x0 = cx + sd * (.5 * W1 * xs - .03 * Z.w), y0 = R1.y - B / 2, k = W1 / 451;
        const x = x0 + sd * vx * k * tc, y = y0 - vy * k * tc + .5 * 1100 * k * tc * tc, o = 1 - P(tc, .9, .5);
        Object.assign(c.style, { display: 'block', opacity: o.toFixed(3), transform: `translate(${x.toFixed(1)}px,${y.toFixed(1)}px) rotate(${(vr * tc).toFixed(1)}deg) scale(${sc})` }); });
    },
    win(t, d) { const m = eio(P(t, d - .5, .5)); return { c: RC, w: mix(W1, wE, m), h: mix(H1, hE, m), rr: Z.r / S10 * m }; },
    winIn: (t, d) => P(t, d - .3, .1),
  };
  FX[10] = FB;
})();
