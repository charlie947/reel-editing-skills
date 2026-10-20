// Effect 19
// ---------------- 19 Zoom-Through: a clean Claude chat window. Your ask sits at the top, Claude's reply streams in with
// the finished cut as a video card, then the camera flies through the card into your clip (playing live in it).
FX[19] = (() => {
  const k = V === 'B' ? 1.5 : V === 'L' ? 1.12 : 1.15;
  const G = V === 'L' ? { SE: 1.55, win: [24, 24, Z.w - 48, Z.h - 48], hd: 64, bub: 106, rep: 228, cy: 290, inp: Z.h - 24 - 84 }
    : V === 'A' ? { SE: 2.0, win: [24, 24, Z.w - 48, Z.h - 48], hd: 58, bub: 92, rep: 150, cy: 196, inp: Z.h - 24 - 74 }
    : { SE: 1.8, win: [24, 24, Z.w - 48, Z.h - 48], hd: 92, bub: 410, rep: 540, cy: 618, inp: Z.h - 24 - 100 };
  G.card = [(Z.w - Z.w / G.SE) / 2, G.cy];
  const SE = G.SE, CW = Z.w / SE, CH = Z.h / SE, CC = [G.card[0] + CW / 2, G.card[1] + CH / 2];
  G.chip = G.card[1] + CH + 18 * k;
  const R0 = 18 * k, RE = Z.r / SE;                                            // the card's corners land on the card's own radius
  // read, then fly from DV to d-0.03. DV is 1.3s on the 2.5s cuts (A, B). Feed cut F gives this effect 0.97s, so the read shrinks
  // to d-0.46 and the fly still lands at identity before the hand-off (a fixed 1.3s would cut before the fly lands).
  const DV = d => Math.min(1.3, Math.max(.2, d - .46));   // a short beat: a 0.5s read, then a 0.4s fly
  const zoom = (t, d) => eio(P(t, DV(d), Math.max(.3, d - .03 - DV(d))));
  const REPLY = 'Done. Here is your zoom-through:'.split(' ');
  return {
    name: NAMES[18], row: 18, bg: 'blue', Send: SE,
    html(id, inner) {
      const fs = 22 * k, [wx, wy, ww, wh] = G.win;
      return `<style>
        .fx19 .ap{position:absolute;left:${wx}px;top:${wy}px;width:${ww}px;height:${wh}px;background:#fff;border-radius:${28 * k}px;box-shadow:inset 0 0 0 1px rgba(29,29,31,.07),0 30px 70px -20px rgba(0,19,47,.35);color:#1d1d1f;font-size:${fs}px;letter-spacing:-.015em;line-height:1.3}
        .fx19 .ap>*{position:absolute}
        .fx19 .hd{left:0;top:0;width:100%;height:${G.hd}px;border-bottom:1px solid rgba(29,29,31,.07);display:flex;align-items:center;justify-content:center;gap:${10 * k}px;font-weight:650;font-size:${fs}px}
        .fx19 .hd img,.fx19 .rp img{height:${(fs * 1.15).toFixed(1)}px}
        .fx19 .bb{right:${20 * k}px;max-width:${(ww * .74).toFixed(0)}px;background:#f0f2f5;border-radius:${20 * k}px ${20 * k}px ${6 * k}px ${20 * k}px;padding:${12 * k}px ${16 * k}px;font-weight:500}
        .fx19 .rp{left:${20 * k}px;right:${20 * k}px;display:flex;gap:${10 * k}px;align-items:flex-start;font-weight:500}
        .fx19 .rp span i{font-style:normal;opacity:0}
        .fx19 .ch{left:${G.card[0] - wx}px;width:${(Z.w / G.SE).toFixed(1)}px;justify-content:center;display:flex;gap:${8 * k}px}.fx19 .ch b{font-weight:600;font-size:${(fs * .78).toFixed(1)}px;padding:${7 * k}px ${14 * k}px;border-radius:99px;box-shadow:inset 0 0 0 1.5px rgba(29,29,31,.12);white-space:nowrap}
        .fx19 .in{left:${16 * k}px;right:${16 * k}px;height:${(G.inp > 0 ? 62 * k : 0)}px;border-radius:${18 * k}px;box-shadow:inset 0 0 0 1.5px rgba(29,29,31,.12);display:flex;align-items:center;padding:0 ${10 * k}px 0 ${18 * k}px;color:#86868b}
        .fx19 .in u{margin-left:auto;width:${40 * k}px;height:${40 * k}px;border-radius:${12 * k}px;background:#0071E3;display:flex;align-items:center;justify-content:center}
        .fx19 .cd{position:absolute;left:${G.card[0]}px;top:${G.card[1]}px;width:${CW.toFixed(1)}px;height:${CH.toFixed(1)}px;box-shadow:0 2px 6px rgba(0,19,47,.12),0 24px 50px -16px rgba(0,19,47,.45)}
        .fx19 .ph{position:absolute;left:${G.card[0]}px;top:${G.card[1]}px;width:${CW.toFixed(1)}px;height:${CH.toFixed(1)}px;overflow:hidden;background:#1d1d1f}
        .fx19 .sc{position:absolute;left:${(G.card[0] + 14 * k).toFixed(1)}px;top:${(G.card[1] + CH - 18 * k).toFixed(1)}px;width:${(CW - 28 * k).toFixed(1)}px;height:${4 * k}px;border-radius:9px;background:rgba(255,255,255,.4)}.fx19 .sc u{display:block;height:100%;border-radius:9px;background:#fff}
      </style><div class="Z fx19">${ebx('blue')}${stageZ('blue')}<div class="Z apl"><div class="ap">
          <div class="hd"><img src="${SUN}">Claude</div>
          <div class="bb" style="top:${G.bub - wy}px">${SAY('Add a zoom-through to my video')}</div>
          <div class="rp" style="top:${G.rep - wy}px"><img src="${SUN}"><span>${REPLY.map(w => `<i>${w} </i>`).join('')}</span></div>
          <div class="ch" style="top:${(G.chip - wy).toFixed(1)}px"><b>Make it slower</b><b>Add captions</b></div>
          <div class="in" style="top:${G.inp - wy}px">Reply to Claude<u><svg width="${18 * k}" height="${18 * k}" viewBox="0 0 18 18"><path d="M9 15V3M3.5 8.5 9 3l5.5 5.5" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></u></div>
        </div><div class="cd"></div></div>
        ${inner ? `<div class="ph">${plate(PT(20), CW / 2, BEYE / SE, BS / SE, 'deco')}</div>` : ''}${SLOT}<div class="sc"><u></u></div></div>`;
    },
    camera(t, d) { const e = zoom(t, d), h = .035 * eio(P(t, .25, DV(d) - .25)) * (1 - e), p = e + h * (1 - e);   // a slow lean toward the card while it reads, then the fly-through
      return p > 0 ? { a: CC, f: [mix(CC[0], ZC[0], p), mix(CC[1], ZC[1], p)], S: Math.pow(SE, p) } : null; },
    seek(cam, t, d) {
      const e = zoom(t, d), r = mix(R0, RE, e);
      own(cam, '.rp span i').forEach((w, j) => { w.style.opacity = ez(P(t, .08 + j * .06, .14)).toFixed(3); });
      const ap = one(cam, '.apl'), v = Math.sin(Math.PI * e);
      ap.style.filter = v > .02 ? `blur(${(2.6 * v).toFixed(2)}px)` : 'none';   // motion blur on the app only, never on the cut inside the card
      ap.style.opacity = (1 - .25 * P(e, .6, .4)).toFixed(3);
      const cd = one(cam, '.cd'); cd.style.borderRadius = r.toFixed(1) + 'px';
      const ph = one(cam, '.ph'); if (ph) ph.style.borderRadius = r.toFixed(1) + 'px';
      const sc = one(cam, '.sc'); sc.style.opacity = (1 - P(e, 0, .15)).toFixed(3); q(sc, 'u').style.width = (100 * mix(.12, .58, P(t, 0, DV(d)))).toFixed(1) + '%';
    },
    win(t, d) { return { c: CC, w: CW, h: CH, rr: mix(R0, RE, zoom(t, d)) }; },
    winIn: () => 1,
  };
})();
