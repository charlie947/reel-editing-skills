// Effect 20
// ---------------- 20 Head Pop Out (holds to the end of your clip). Your shot shrinks into a blue panel on the stage and your head
// and shoulders, cut out of the same frame, spring up out of its top edge. With --words, a white card with your words settles on
// the panel under you. Drawn on the whole frame (fullHTML). Inside another effect's window (inner) it is the card version.
FX[20] = (() => {
  const POP = V === 'L', RP = V === 'B' ? 44 : 30;
  // V1 end state: scale, eye-box centre x and crown y (zone px), the spring travel, the plate row the panel top sits on
  // (1150: his neck, just above where the shoulders widen past the 460px panel), and the panel foot (2px inside the plate's end)
  const H = { s: .845, cx: Z.w / 2, crown: 45, rise: 120, chest: 1150 };
  const CROWN = 435;   // top of his hair on the cut-out plate (alpha bbox)
  const PTOP = H.crown + (H.chest - CROWN) * H.s, PBOT = H.crown + (1920 - CROWN) * H.s - 2;
  // the end state per layout: the panel, the CTA card (and, A/B, him: scale about the bottom centre, x shift)
  const G = POP ? { pn: [40, PTOP, Z.w - 80, PBOT - PTOP], cta: [46, 1110, Z.w - 92], fs: 40 }
    : V === 'A' ? { s: .8, dx: -170, rise: 50, pn: [30, 668, Z.w - 60, Z.h - 30 - 668], cta: [492, 214, 414], fs: 41 }
    : { s: .82, dx: 0, rise: 90, pn: [44, 1112, Z.w - 88, Z.h - 44 - 1112], cta: [96, 1500, Z.w - 192], fs: 66 };
  const spring = p => p <= 0 ? 0 : p >= 1 ? 1 : 1 - Math.exp(-6 * p) * Math.cos(9 * p) * (1 - p);
  const X = { cutIn: [.34, .14], plOut: [.4, .14], shrink: [.55, .62], pop: [.78, .7], cta: [1.45, .45], kw: [3.78, .5] };
  // the panel shrinks from the full card to its end rect
  const pnAt = t => { const e = ez(P(t, ...X.shrink));
    return [mix(0, G.pn[0], e), mix(0, G.pn[1], e), mix(Z.w, G.pn[2], e), mix(Z.h, G.pn[3], e), mix(0, RP, e)]; };
  const himT = t => {
    const e = ez(P(t, ...X.shrink)), sp = spring(P(t, ...X.pop));
    if (POP) {   // origin 0 0: scale and place the eye-box centre, sunk by rise until the spring lifts him (no overshoot above the end)
      const eyeE = H.crown + (PG.eye - CROWN) * H.s, s = mix(BS, H.s, e), cx = mix(Z.w / 2, H.cx, e);
      const eye = mix(BEYE, eyeE + H.rise, e) - H.rise * Math.min(sp, 1), g = s / BS;
      return `translate(${(cx - g * Z.w / 2).toFixed(2)}px,${(eye - g * BEYE).toFixed(2)}px) scale(${g.toFixed(5)})`;
    }
    const s = mix(1, G.s, e), dy = G.rise * (1 - sp) * P(t, X.pop[0] - .2, .2);   // dips as the panel lands, then springs up through its top edge
    return `translate(${(G.dx * e).toFixed(1)}px,${dy.toFixed(1)}px) scale(${s.toFixed(4)})`;
  };
  // ---- full frame (frame px). FS/FEYE = the full-frame plate framing (as B). XF = the beats, shifted by the 0.35s grow.
  const FULLF = (window.REEL || {}).cut === 'F', FS = 1.14, FEYE = 620;
  const XF = { grow: [0, .35], cutIn: [.36, .12], plOut: [.42, .14], shrink: [.56, .62], pop: [.8, .7] };
  const GF = { s: .82, rise: 90, pn: [108, 1112, 864, 1876 - 1112], r: 44 };
  // the optional words card: on the panel, under your chin, after the pop (--words)
  const WCARD = SETUP.words ? `<div class="wc"><b>${SAY('')}</b></div>` : '';
  const fullHTML = () => `<style>
      .fx20f .wc{position:absolute;left:156px;top:1540px;width:768px;padding:34px 40px;border-radius:36px;background:#fff;text-align:center;color:#1d1d1f;box-shadow:0 2px 6px rgba(0,19,47,.12),0 26px 60px -16px rgba(0,19,47,.5)}
      .fx20f .wc b{display:block;font-weight:800;font-size:58px;line-height:1.08;letter-spacing:-.03em}
      .fx20f .pn{position:absolute;background:#0071E3;box-shadow:0 2px 6px rgba(0,19,47,.12),0 30px 70px -18px rgba(0,19,47,.45),inset 0 1px 0 rgba(255,255,255,.22)}
      .fx20f .hm{transform-origin:0 0}
    </style><div class="Z fx20f"><div class="Z win"><div class="L">${STAGE.floor}</div><div class="pn"></div>
      <div class="Z pw"><div class="Z hm">${plate(PT(20), 540, FEYE, FS, 'me pl')}</div></div>
      <div class="Z hc"><div class="Z hm">${cut(PT(20), 540, FEYE, FS, 'me cu')}</div></div>${WCARD}</div></div>`;
  const fullSeek = (cam, t) => {
    // the grow: window and plate both go linearly in g from the card to the frame, so the plate covers the window all the way
    const g = eio(P(t, ...XF.grow)), wx = mix(Z.x, 0, g), wy = mix(Z.y, 0, g), ww = mix(Z.w, 1080, g), wh = mix(Z.h, 1920, g);
    one(cam, '.win').style.clipPath = `inset(${wy.toFixed(1)}px ${(1080 - wx - ww).toFixed(1)}px ${(1920 - wy - wh).toFixed(1)}px ${wx.toFixed(1)}px round ${mix(Z.r, 0, g).toFixed(1)}px)`;
    const k = mix(BS, FS, g) / FS, tx = mix(Z.x + Z.w / 2, 540, g) - k * 540, ty = mix(Z.y + BEYE, FEYE, g) - k * FEYE;
    // then the B move: scale about the bottom centre, dip as the panel lands, spring up through its top edge
    const e = ez(P(t, ...XF.shrink)), sp = spring(P(t, ...XF.pop)), sb = mix(1, GF.s, e), dy = GF.rise * (1 - sp) * P(t, XF.pop[0] - .2, .2);
    const tf = `translate(${(sb * tx + 540 * (1 - sb)).toFixed(2)}px,${(sb * ty + 1920 * (1 - sb) + dy).toFixed(2)}px) scale(${(sb * k).toFixed(5)})`;
    own(cam, '.hm').forEach(m => m.style.transform = tf);
    const pl = one(cam, 'img.pl'), cu = one(cam, 'img.cu'), a = P(t, ...XF.cutIn), b = 1 - P(t, ...XF.plOut);
    cu.style.opacity = a.toFixed(3); cu.style.display = a > 0 ? 'block' : 'none';
    pl.style.opacity = b.toFixed(3); pl.style.display = b > 0 ? 'block' : 'none';
    const x = mix(0, GF.pn[0], e), y = mix(0, GF.pn[1], e), w = mix(1080, GF.pn[2], e), h = mix(1920, GF.pn[3], e), pr = x + w, pb = y + h;
    Object.assign(one(cam, '.pn').style, { left: x.toFixed(1) + 'px', top: y.toFixed(1) + 'px', width: w.toFixed(1) + 'px', height: h.toFixed(1) + 'px', borderRadius: mix(0, GF.r, e).toFixed(1) + 'px' });
    // the cut-out: clipped to the panel's sides and bottom, open above its top, so the head breaks out onto the stage
    const wc = one(cam, '.wc'); if (wc) { const c = ez(P(t, 1.47, .45)); wc.style.opacity = c.toFixed(3); wc.style.display = c > 0 ? 'block' : 'none'; wc.style.transform = `translateY(${(40 * (1 - c)).toFixed(1)}px) scale(${mix(.94, 1, c).toFixed(4)})`; }
    one(cam, '.hc').style.clipPath = `polygon(-400px -2000px,1480px -2000px,1480px ${y.toFixed(1)}px,${pr.toFixed(1)}px ${y.toFixed(1)}px,${pr.toFixed(1)}px ${pb.toFixed(1)}px,${x.toFixed(1)}px ${pb.toFixed(1)}px,${x.toFixed(1)}px ${y.toFixed(1)}px,-400px ${y.toFixed(1)}px)`;
  };
  return {
    name: NAMES[19], row: 19, bg: 'floor', Send: 1,
    html(id, inner) {
      if (FULLF && !inner) return fullHTML();
      const fs = G.fs;
      return `<style>
        .fx20 .pn{position:absolute;background:#0071E3;box-shadow:0 2px 6px rgba(0,19,47,.12),0 30px 70px -18px rgba(0,19,47,.45),inset 0 1px 0 rgba(255,255,255,.22)}
        .f[data-s=blue] .fx20 .pn{box-shadow:inset 0 0 0 2px rgba(255,255,255,.55),0 30px 70px -18px rgba(0,0,0,.5)}
        .fx20 .hm{transform-origin:${POP ? '0 0' : `${Z.w / 2}px ${Z.h}px`}}
        .fx20 .ct{position:absolute;left:${G.cta[0]}px;top:${G.cta[1]}px;width:${G.cta[2]}px;background:#fff;border-radius:${(fs * .55).toFixed(0)}px;padding:${(fs * .5).toFixed(0)}px ${(fs * .55).toFixed(0)}px;box-shadow:0 2px 6px rgba(0,19,47,.12),0 26px 60px -16px rgba(0,19,47,.5);color:#1d1d1f;text-align:center}
        .fx20 .ct b{display:block;font-weight:800;font-size:${fs}px;letter-spacing:-.035em;line-height:1.05;white-space:nowrap}
        .fx20 .ct b span{position:relative;color:#0071E3;display:inline-block;transform-origin:0 70%}
        .fx20 .ct b span u{position:absolute;left:0;right:0;bottom:${(-fs * .1).toFixed(1)}px;height:${(fs * .09).toFixed(1)}px;border-radius:9px;background:#0071E3;transform-origin:0 50%}
        .fx20 .ct p{margin:${(fs * .32).toFixed(0)}px 0 0;font-weight:550;font-size:${(fs * .54).toFixed(1)}px;line-height:1.25;letter-spacing:-.015em;color:rgba(29,29,31,.72);white-space:nowrap}
        .fx20 .rim{box-shadow:inset 0 0 0 4px #0071E3,0 30px 70px -18px rgba(0,19,47,.4)}
      </style><div class="Z fx20">${POP ? `<div class="Z pw"><div class="Z hm">${plate(PT(20), Z.w / 2, BEYE, BS, 'me pl')}</div></div><div class="Z rim"></div>`
        : `<div class="pn"></div>${himView(PT(20), 'me pl')}`}
        <div class="Z hc"><div class="Z hm">${cut(PT(20), Z.w / 2, BEYE, BS, 'me cu')}</div></div>
        ${SLOT}</div>`;
    },
    camera: () => null,
    seek(cam, t, d) {
      if (one(cam, '.fx20f')) return fullSeek(cam, t);
      const pl = one(cam, 'img.pl'), cu = one(cam, 'img.cu');
      const a = P(t, ...X.cutIn), b = 1 - P(t, ...X.plOut);
      cu.style.opacity = a.toFixed(3); cu.style.display = a > 0 ? 'block' : 'none';
      const [x, y, w, h, r] = pnAt(t);
      if (POP) {   // the plate moves with the cut-out, framed by the panel; the cut-out shows only above the panel top, inside its sides
        const pr = x + w, pb = y + h;
        one(cam, '.pw').style.clipPath = `inset(${y.toFixed(1)}px ${(Z.w - pr).toFixed(1)}px ${(Z.h - pb).toFixed(1)}px ${x.toFixed(1)}px round ${r.toFixed(1)}px)`;
        Object.assign(one(cam, '.rim').style, { left: x.toFixed(1) + 'px', top: y.toFixed(1) + 'px', width: w.toFixed(1) + 'px', height: h.toFixed(1) + 'px', borderRadius: r.toFixed(1) + 'px', opacity: P(t, X.shrink[0], .2).toFixed(3) });
        one(cam, '.hc').style.clipPath = `polygon(${x.toFixed(1)}px -2000px,${pr.toFixed(1)}px -2000px,${pr.toFixed(1)}px ${(y + 6).toFixed(1)}px,${x.toFixed(1)}px ${(y + 6).toFixed(1)}px)`;
        own(cam, '.hm').forEach(m => m.style.transform = himT(t));
      } else {
      pl.style.opacity = b.toFixed(3); pl.style.display = b > 0 ? 'block' : 'none';
      const pn = one(cam, '.pn');
      Object.assign(pn.style, { left: x.toFixed(1) + 'px', top: y.toFixed(1) + 'px', width: w.toFixed(1) + 'px', height: h.toFixed(1) + 'px', borderRadius: r.toFixed(1) + 'px', display: h > .5 ? 'block' : 'none' });
      const W = Z.w + 400, pb = y + h, pr = x + w;
      // clipped to the panel's sides and bottom, open above its top: the head breaks out
      one(cam, '.hc').style.clipPath = `polygon(-400px -2000px,${W}px -2000px,${W}px ${y.toFixed(1)}px,${pr.toFixed(1)}px ${y.toFixed(1)}px,${pr.toFixed(1)}px ${pb.toFixed(1)}px,${x.toFixed(1)}px ${pb.toFixed(1)}px,${x.toFixed(1)}px ${y.toFixed(1)}px,-400px ${y.toFixed(1)}px)`;
      one(cam, '.hm').style.transform = himT(t);
      }
    },
    win: () => ({ c: ZC, w: Z.w, h: Z.h, rr: 0 }),
    winIn: () => 0,
  };
})();
