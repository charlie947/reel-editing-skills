// Effect 14
// ---------------- 14 Phone Fan: we pull out of his shot to find it on a phone screen, four more phones fan out from behind it like a hand of
// cards (each showing a plain app screen, never the face: one live face at a time), then we dive back into the centre phone. No preserve-3d: each phone is one rotated 2D element.
(() => {
  const sh = (V === 'A' ? .5 : .34) * Z.h, sw = sh * Z.w / Z.h, SC = [Z.w / 2, (V === 'A' ? .48 : .46) * Z.h];   // the centre screen = the window
  const S14 = Z.h / sh, rs = Z.r / S14, b = Math.max(6, .045 * sw), rb = rs + b;   // screen radius matches the zone, bezel round it
  const PV = [SC[0], SC[1] + 1.1 * sh];                                     // the fan pivot, low like a hand holding cards
  const ANG = V === 'A' ? [-20, -10, 10, 20] : [-14, -7, 7, 14];
  const T = { pull: [.02, .36], fan: [.16, .44], win: [.44, .1], dive: [.52, .46] };
  const zoom = t => { const e1 = FACEF ? eio(P(t, 0, .4)) : ez(P(t, ...T.pull)),   // F r7: the pull-back eases in from himView (was a 2-frame drop at the seam)
    e2 = eio(P(t, ...T.dive)); return e2 > 0 ? e2 : 1 - e1; };
  const r = v => v.toFixed(1) + 'px';
  const phone = (inner, cls = '') => `<div class="fx14-ph${cls}" style="left:${r(SC[0] - sw / 2 - b)};top:${r(SC[1] - sh / 2 - b)};width:${r(sw + 2 * b)};height:${r(sh + 2 * b)};border-radius:${r(rb)};padding:${r(b)}">
      <div class="fx14-sc" style="border-radius:${r(rs)}">${inner}</div></div>`;
  const PF = {
    name: NAMES[13], row: 13, bg: 'floor', Send: S14,
    html() {
      const order = [0, 3, 1, 2];   // outer phones first, so the inner ones sit on top of them
      const ui = i => `<div class="fx14-th fx14-ui u${i}"><b></b><i></i><em></em><em></em><u></u></div>`;
      const sides = order.map(i => phone(ui(i), ' fx14-sd" data-i="' + i)).join('');
      const own0 = `<div class="fx14-v" style="left:${r(-(SC[0] - sw / 2))};top:${r(-(SC[1] - sh / 2))}"><div class="Z" style="transform-origin:0 0;transform:${embT(SC, S14)}">${himView(PT(14), 'me')}</div></div>`;
      return `<div class="Z fx14"><div class="fx14-sha" style="left:${r(SC[0] - 1.4 * sw)};top:${r(SC[1] + .42 * sh)};width:${r(2.8 * sw)};height:${r(.3 * sh)}"></div>
        ${sides}${phone(own0, ' fx14-c')}
        ${SLOT}<div class="fx14-is" style="left:${r(SC[0] - .14 * sw)};top:${r(SC[1] - sh / 2 + .022 * sh)};width:${r(.28 * sw)};height:${r(.034 * sh)}"></div></div>
      <style>
        .fx14 .fx14-ph{position:absolute;box-sizing:border-box;background:#1d1d1f}
        .fx14 .fx14-sc{position:relative;width:100%;height:100%;overflow:hidden;background:#0b0c0e}
        .fx14 .fx14-th{position:absolute;inset:0}
        .fx14 .fx14-ui{background:#f3f5f8;padding:${r(.12 * sw)} ${r(.09 * sw)} 0;box-sizing:border-box;display:flex;flex-direction:column;gap:${r(.06 * sw)}}
        .fx14 .fx14-ui b{display:block;width:45%;height:${r(.07 * sw)};border-radius:99px;background:#1d1d1f}
        .fx14 .fx14-ui i{display:block;height:${r(.62 * sw)};border-radius:${r(.07 * sw)};background:#e1e5eb}
        .fx14 .fx14-ui em{display:block;height:${r(.05 * sw)};border-radius:99px;background:#d2d6dd}.fx14 .fx14-ui em+em{width:70%}
        .fx14 .fx14-ui u{display:block;width:55%;height:${r(.14 * sw)};border-radius:99px;background:#0071E3;margin-top:${r(.04 * sw)}}
        .fx14 .fx14-ui.u1 i,.fx14 .fx14-ui.u2 i{height:${r(.36 * sw)}}.fx14 .fx14-ui.u3 i{background:#d9dee5}
        .fx14 .fx14-v{position:absolute;width:var(--zw);height:var(--zh)}
        .fx14 .fx14-is{position:absolute;border-radius:99px;background:#000}
        .fx14 .fx14-sha{position:absolute;border-radius:50%;filter:blur(18px)}
        .f[data-s=white] .fx14 .fx14-ph{box-shadow:inset 0 0 0 1.5px #3a3a3c,inset 0 0 0 2.5px #0d0d0f,0 30px 50px -22px rgba(0,19,47,.45),0 4px 10px rgba(0,19,47,.12)}
        .f[data-s=white] .fx14 .fx14-sha{background:radial-gradient(ellipse 50% 50% at 50% 50%,rgba(0,19,47,.28),rgba(0,19,47,0))}
        .f[data-s=blue] .fx14 .fx14-ph{box-shadow:inset 0 0 0 1.5px #5d6672,inset 0 0 0 2.5px #0d0d0f,0 30px 50px -22px rgba(0,0,0,.7),0 4px 10px rgba(0,0,0,.3)}
        .f[data-s=blue] .fx14 .fx14-sha{background:radial-gradient(ellipse 50% 50% at 50% 50%,rgba(0,0,0,.55),rgba(0,0,0,0))}
      </style>`;
    },
    camera(t) { const k = zoom(t); return { a: SC, f: [mix(SC[0], ZC[0], k), mix(SC[1], ZC[1], k)], S: Math.pow(S14, k) }; },
    seek(cam, t, d) {
      const f = P(t, ...T.fan), sp = f <= 0 ? 0 : f >= 1 ? 1 : 1 - Math.exp(-6 * f) * Math.cos(7 * f) * (1 - f);   // the fan springs open
      const x0 = SC[0] - sw / 2 - b, y0 = SC[1] - sh / 2 - b;
      own(cam, '.fx14-sd').forEach(el => { const i = +el.dataset.i, a = ANG[i] * sp, outer = i === 0 || i === 3;
        el.style.transformOrigin = `${(PV[0] - x0).toFixed(1)}px ${(PV[1] - y0).toFixed(1)}px`;
        el.style.transform = `rotate(${a.toFixed(3)}deg) scale(${mix(1, outer ? .86 : .93, sp).toFixed(4)})`;
        el.style.filter = `brightness(${outer ? .9 : .96})`;
        el.style.visibility = sp > .002 ? 'visible' : 'hidden'; });
      one(cam, '.fx14-v').style.opacity = (1 - P(t, T.win[0] + T.win[1], .01)).toFixed(3);   // my shot hands over to the window once the window is fully in
      one(cam, '.fx14-is').style.opacity = (P(t, .1, .1) * (1 - P(t, T.dive[0] + .04, .1))).toFixed(3);
      one(cam, '.fx14-sha').style.opacity = P(t, .1, .2).toFixed(3);
    },
    win: () => ({ c: SC, w: sw, h: sh, rr: rs }),
    winIn: t => P(t, ...T.win),
  };
  FX[14] = PF;
})();
