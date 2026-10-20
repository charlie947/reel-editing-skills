// Effect 12
// ---------------- 12 Depth UI: his room falls away and he stands in a space of real app windows at different depths (a terminal rendering
// the video, a video timeline of plain clip blocks, and a Claude chat), all above his head (beside him in B). Soft parallax: far windows move
// less, he moves more. We fly into the Claude window. Everything is 2D: depth is faked by how much each layer moves with the camera.
(() => {
  const SIDE = V === 'B', K = SIDE ? .62 : V === 'A' ? .62 : .58, E0 = [Z.w / 2, BEYE];
  const E1 = SIDE ? [.36 * Z.w, .43 * Z.h] : [Z.w / 2, Z.h - (Z.h - BEYE) * K];   // where his eye line ends up (V1/A: he steps back about the bottom centre)
  const crownY = E1[1] - (PG.eye - PG.crown) * BS * K, top = crownY - 14;          // every window stays above this line
  const TB = 34, PAD = 10, GAP = 14;                                                 // title bar, window padding
  // layout per config: terminal (TM), timeline (TL), Claude window outer box (CW: x, y, w, h)
  let TM, TL, CW, wc, hc;
  if (SIDE) {
    wc = .3 * Z.w; hc = wc * Z.h / Z.w;
    CW = { w: wc + 2 * PAD, h: TB + hc + PAD }; CW.x = Z.w - 20 - CW.w; CW.y = .35 * Z.h;
    TM = { x: 20, y: .2 * Z.h, w: .5 * Z.w, h: 150 }; TL = { x: TM.x + TM.w + GAP, y: .2 * Z.h, w: Z.w - 20 - (TM.x + TM.w + GAP), h: CW.y - 16 - .2 * Z.h };
  } else if (V === 'A') {
    CW = { y: 18, h: top - 18 }; hc = CW.h - TB - PAD; wc = hc * Z.w / Z.h; CW.w = wc + 2 * PAD; CW.x = Z.w - 16 - CW.w;
    TM = { x: 16, y: 18, w: CW.x - 16 - GAP, h: 128 }; TL = { x: 16, y: TM.y + TM.h + GAP, w: TM.w, h: top - (TM.y + TM.h + GAP) };
  } else {
    TM = { x: 14, y: 18, w: Z.w - 28, h: 150 };
    CW = { x: 14, y: TM.y + TM.h + GAP, h: 0 }; CW.h = top - CW.y; hc = CW.h - TB - PAD; wc = hc * Z.w / Z.h; CW.w = wc + 2 * PAD;
    TL = { x: CW.x + CW.w + GAP, y: CW.y + .18 * CW.h, w: Z.w - 14 - (CW.x + CW.w + GAP), h: 210 };
  }
  const WC = [CW.x + PAD + wc / 2, CW.y + TB + hc / 2], S12 = Z.h / hc;
  const back = [{ el: 'tm', z: .7, dx: -1 }, { el: 'tl', z: .45, dx: 1 }];
  const T = { room: [0, (window.REEL || {}).cut === 'F' ? .06 : .13], step: [.02, .44], back: [.08, .4], front: [.14, .42], dive: [.66, .5], win: [.76, .1] };
  const dive = t => eio(P(t, ...T.dive));
  const camS = t => Math.pow(S12, dive(t));
  const dots = '<div class="fx12-tb"><b></b><b></b><b></b></div>';
  const r = v => v.toFixed(1) + 'px', box = b => `left:${r(b.x)};top:${r(b.y)};width:${r(b.w)};height:${r(b.h)}`;
  // clip blocks carry plain labels, never a thumbnail of the face (one live face at a time)
  const thumbs = ['Intro', 'Main', 'Outro'].map((w, n) => `<div class="fx12-clip c${n}"><span>${w}</span></div>`).join('');
  const DU = {
    name: NAMES[11], row: 11, bg: 'floor', Send: S12,
    html() {
      return `<div class="Z fx12">
        <div class="Z fx12-L fx12-bk"><div class="fx12-win fx12-term" style="${box(TM)}">${dots}
          <div class="fx12-cmd"><span class="pr">$</span> render my-video.mp4</div>
          <div class="fx12-prog"><span>Rendering</span><i><u></u></i><span>72%</span></div></div></div>
        <div class="Z fx12-L fx12-bk"><div class="fx12-win fx12-tlw" style="${box(TL)}">${dots}
          <div class="fx12-tlh"><b>my-video.mp4</b><span>00:19</span></div>
          <div class="fx12-track">${thumbs}<div class="fx12-ph"></div></div></div></div>
        <div class="Z fx12-L fx12-him"><div class="Z fx12-room">${himView(PT(12), 'deco')}</div>${cut(PT(12), Z.w / 2, BEYE, BS, 'me')}</div>
        <div class="Z fx12-L fx12-fr"><div class="fx12-win" style="${box(CW)};border-radius:16px">${dots}</div>
          <div class="fx12-ct" style="left:${r(WC[0] - wc / 2)};top:${r(WC[1] - hc / 2)};width:${r(wc)};height:${r(hc)};border-radius:${r(Z.r / S12)}">
            <div class="fx12-chat">
              <div class="fx12-who"><img src="${SUN}"><b>Claude</b></div>
              <div class="fx12-u">${SAY('Add a depth effect to my video')}</div>
              <div class="fx12-a">Done. Your video<br>now has depth.</div>
              <div class="fx12-in"><span>Reply…</span><em><svg viewBox="0 0 24 24"><path d="M12 19V6M6.5 11.5 12 6l5.5 5.5" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg></em></div>
            </div>
          </div>
          ${SLOT}</div>
      </div>
      <style>
        .fx12 .fx12-L{transform-origin:0 0}
        .fx12 .fx12-win{position:absolute;overflow:hidden;border-radius:14px;background:#fff}
        .fx12 .fx12-tb{height:${TB}px;display:flex;align-items:center;gap:7px;padding-left:13px}
        .fx12 .fx12-tb b{width:10px;height:10px;border-radius:50%;background:#d2d2d7}
        .fx12 .fx12-term{background:#1d1d1f}.fx12 .fx12-term .fx12-tb b{background:#48484a}
        .fx12 .fx12-cmd,.fx12 .fx12-prog{font:500 22px/1.3 'SF Mono',ui-monospace,Menlo,monospace;color:#fff;padding:0 16px;white-space:pre-wrap;letter-spacing:-.01em}
        .fx12 .fx12-cmd .pr{color:#8e8e93}
        .fx12 .fx12-prog{display:flex;align-items:center;gap:12px;margin-top:12px;color:#c7c7cc}
        .fx12 .fx12-prog i{flex:1;height:8px;border-radius:99px;background:#3a3a3c;position:relative;overflow:hidden}
        .fx12 .fx12-prog u{position:absolute;left:0;top:0;bottom:0;width:72%;border-radius:99px;background:#0071E3}
        .fx12 .fx12-tlh{display:flex;justify-content:space-between;align-items:baseline;padding:0 14px 10px;font-size:22px;line-height:1.1}
        .fx12 .fx12-tlh b{font-weight:650;color:#1d1d1f}.fx12 .fx12-tlh span{color:#86868b;font-variant-numeric:tabular-nums}
        .fx12 .fx12-track{position:relative;display:flex;gap:6px;padding:0 14px;height:calc(100% - ${TB + 46}px);min-height:60px}
        .fx12 .fx12-clip{flex:1;min-width:0;position:relative;overflow:hidden;border-radius:8px;background:#e4e8ee;box-shadow:inset 0 0 0 1px rgba(29,29,31,.08)}
        .fx12 .fx12-clip.c1{background:#d9dee5}.fx12 .fx12-clip.c2{background:#eceff3}
        .fx12 .fx12-clip span{position:absolute;left:5px;right:5px;bottom:6px;font-size:13px;font-weight:600;line-height:1.15;color:#1d1d1f;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
        .fx12 .fx12-clip:nth-child(2){box-shadow:inset 0 0 0 3px #0071E3}
        .fx12 .fx12-ph{position:absolute;top:-6px;bottom:-4px;left:52%;width:3px;border-radius:2px;background:#0071E3}
        .fx12 .fx12-ph::before{content:'';position:absolute;left:-5px;top:-6px;width:13px;height:13px;border-radius:50%;background:#0071E3}
        .fx12 .fx12-ct{position:absolute;overflow:hidden;background:#fff}
        .fx12 .fx12-chat{position:absolute;inset:0;padding:8px 14px 14px;display:flex;flex-direction:column;gap:16px;font-size:22px;line-height:1.25;color:#1d1d1f}
        .fx12 .fx12-who{display:flex;align-items:center;gap:8px;font-weight:650}.fx12 .fx12-who img{width:26px;height:26px}
        .fx12 .fx12-u{align-self:flex-end;max-width:90%;background:#f0f1f4;border-radius:18px;padding:9px 14px;margin-top:6px}
        .fx12 .fx12-a{max-width:100%}
        .fx12 .fx12-in{margin-top:auto;height:48px;border-radius:24px;border:1.5px solid #e1e3e8;display:flex;align-items:center;justify-content:space-between;padding:0 6px 0 16px;color:#8e8e93}
        .fx12 .fx12-in em{width:36px;height:36px;border-radius:50%;background:#0071E3;display:flex;align-items:center;justify-content:center}.fx12 .fx12-in svg{width:22px;height:22px}
        .f[data-s=white] .fx12 .fx12-win{box-shadow:0 0 0 1px rgba(29,29,31,.07),0 2px 6px rgba(0,19,47,.06),0 28px 60px -22px rgba(0,19,47,.34)}
        .f[data-s=blue] .fx12 .fx12-win{box-shadow:0 0 0 1px rgba(255,255,255,.18),0 2px 6px rgba(0,0,0,.2),0 28px 60px -22px rgba(0,0,0,.6)}
      </style>`;
    },
    camera(t) { const e = dive(t); if (e <= 0) return null; return { a: WC, f: [mix(WC[0], ZC[0], e), mix(WC[1], ZC[1], e)], S: camS(t) }; },
    seek(cam, t, d) {
      const S = camS(t), st = ez(P(t, ...T.step)), k = mix(1, K, st);
      // depth during the dive: a layer at depth z moves with the camera by S^(1-z) (counter-scaled about the camera anchor); him, nearer, by S^1.25
      const dep = z => { const c = Math.pow(S, -z); return `translate(${WC[0]}px,${WC[1]}px) scale(${c.toFixed(5)}) translate(${-WC[0]}px,${-WC[1]}px)`; };
      const hm = one(cam, '.fx12-him'), ex = mix(E0[0], E1[0], st), ey = mix(E0[1], E1[1], st);
      hm.style.transform = `${dep(-.25)} translate(${ex.toFixed(2)}px,${ey.toFixed(2)}px) scale(${k.toFixed(5)}) translate(${-E0[0]}px,${-E0[1]}px)`;
      if (SIDE) { const m = `radial-gradient(${(.52 * Z.w).toFixed(0)}px ${(.58 * Z.h).toFixed(0)}px at 50% 43%,#000 62%,rgba(0,0,0,${(1 - st).toFixed(3)}) 99%)`;   // in B his plate is narrower than the frame once he steps back: his edges dissolve into the stage
        hm.style.webkitMaskImage = hm.style.maskImage = m; }
      one(cam, '.fx12-room').style.opacity = (1 - P(t, ...T.room)).toFixed(3);
      own(cam, '.fx12-bk').forEach((el, i) => { const b = back[i], a = ez(P(t, T.back[0] + .06 * i, T.back[1])), drift = (1 - a) * .05 * Z.w * b.dx;
        el.style.transform = `${dep(b.z)} translate(${drift.toFixed(1)}px,${((1 - a) * .02 * Z.h).toFixed(1)}px)`;
        el.style.opacity = a.toFixed(3); });
      const f = ez(P(t, ...T.front)), fr = one(cam, '.fx12-fr');
      fr.style.transform = `translate(0px,${((1 - f) * .06 * Z.h).toFixed(1)}px) translate(${WC[0]}px,${WC[1]}px) scale(${mix(.94, 1, f).toFixed(4)}) translate(${-WC[0]}px,${-WC[1]}px)`;
      fr.style.opacity = f.toFixed(3);
    },
    win: () => ({ c: WC, w: wc, h: hc, rr: Z.r / S12 }),
    winIn: t => P(t, ...T.win),
  };
  FX[12] = DU;
})();
// Feed cut F (21/10/2026, Charlie: "really the best we can do for depth UI?"): the grid v5 tile, re-laid for the tall card. He stays full
// size and centred. Claude chat and the timeline hang BEHIND him (his head cuts into them, via his matte); the terminal and the "Reel ready"
// toast float IN FRONT of his shoulders. A slow orbit: far panels slide less than he does, near ones much more, each turns to face the lens.
if (FACEF) (() => {
  const CL = `<img src="${SUN}" style="width:100%;height:100%;display:block">`;
  const tl = [['#0071E3', 24, 120], ['#635BFF', 96, 88], ['#0071E3', 8, 72], ['#9ec5f8', 120, 96]];
  // [class, x, y, w, h, depth, base turn]
  const L = [['b0', -40, 170, 300, 196, -.55, 16], ['b1', 300, 380, 300, 188, -.55, -16], ['f0', 8, 930, 300, 150, 1.15, 12], ['f1', 208, 1130, 300, 112, 1.15, -12]];
  const box = (c, x, y, w, h, st, inner) => `<div class="w ${c}" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;${st}">${inner}</div>`;
  const bar = (dark) => `<div class="br" style="${dark ? 'background:#2a2b30;border-color:#34353b' : ''}"><i></i><i></i><i></i></div>`;
  FX[12] = Object.assign({}, FX[12], {
    Send: 1, fullWin: true, camera: () => null,
    html(id, inner) {
      const [b0, b1, f0, f1] = L;
      return `<style>.fx12v{perspective:1200px;perspective-origin:${Z.w / 2}px ${BEYE}px}.fx12v .w{position:absolute;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 6px rgba(0,19,47,.12),0 30px 60px -18px rgba(0,19,47,.45)}
        .fx12v .f{box-shadow:0 2px 6px rgba(0,19,47,.16),0 40px 80px -10px rgba(0,19,47,.55)}
        .fx12v .br{height:32px;border-bottom:1px solid #eceef1;display:flex;gap:7px;align-items:center;padding-left:14px}.fx12v .br i{width:10px;height:10px;border-radius:50%;background:#d6d9de}
        .fx12v .rm,.fx12v .mt{position:absolute;left:0;top:0;width:${Z.w}px;height:${Z.h}px;transform-origin:${Z.w / 2}px ${BEYE}px}</style>
        <div class="Z fx12v"><div class="rm">${himView(PT(12), 'fx12-room')}</div>
        ${box('b0', ...b0.slice(1, 5), '', `${bar()}<div style="padding:14px 18px;display:flex;flex-direction:column;gap:12px"><div style="display:flex;gap:10px;align-items:center;font-weight:800;font-size:26px;color:#1d1d1f"><div style="width:30px;height:30px">${CL}</div>Claude</div>
          <div style="height:12px;width:240px;border-radius:6px;background:#e8eaee"></div><div style="height:12px;width:190px;border-radius:6px;background:#e8eaee"></div>
          <div style="align-self:flex-end;padding:8px 18px;border-radius:16px;background:#0071E3;color:#fff;font-size:22px;font-weight:700">Make it pop</div></div>`)}
        ${box('b1', ...b1.slice(1, 5), 'background:#1d1d1f', `${bar(1)}<div style="padding:14px 16px;position:relative;display:flex;flex-direction:column;gap:11px">${tl.map(([c, a, b]) => `<div style="height:22px;position:relative"><div style="position:absolute;left:${a}px;width:${b}px;height:22px;border-radius:6px;background:${c}"></div></div>`).join('')}
          <div class="ph" style="position:absolute;left:130px;top:6px;width:4px;height:140px;border-radius:2px;background:#fff"></div></div>`)}
        <div class="mt">${cut(PT(12), Z.w / 2, BEYE, BS, 'fx12-me')}</div>
        ${box('f0 f', ...f0.slice(1, 5), 'background:#1d1d1f', `${bar(1)}<div style="font-family:ui-monospace,Menlo,monospace;color:#fff;font-size:20px;line-height:28px;padding:10px 16px">$ claude render<br><span style="color:#9ec5f8">20 effects · 1080x1920</span></div>
          <div style="position:absolute;left:16px;right:16px;bottom:14px;height:11px;border-radius:6px;background:#3a3b41;overflow:hidden"><div class="pb" style="height:100%;background:#0071E3"></div></div>`)}
        ${box('f1 f', ...f1.slice(1, 5), 'border-radius:22px;display:flex;align-items:center;gap:14px;padding:0 20px', `<div style="flex:none;width:56px;height:56px;border-radius:50%;background:#0071E3;display:flex;align-items:center;justify-content:center"><svg viewBox="0 0 24 24" style="width:32px;height:32px"><path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
          <div><div style="font-weight:800;font-size:30px;color:#1d1d1f;line-height:1.1">Reel ready</div><div style="font-size:18px;color:#6e6e73;margin-top:4px">exported in 12s</div></div>`)}
        </div>${SLOT}`;
    },
    seek(cam, t, d) {
      const u = cl(t / d), c = -Math.cos(Math.PI * u), A = 30, sh = `translateX(${(-A * .35 * c).toFixed(2)}px) scale(1.04)`;
      one(cam, '.fx12v .rm').style.transform = sh; one(cam, '.fx12v .mt').style.transform = sh;
      L.forEach(([k, x, y, w, h, dz, ry], i) => { const e = one(cam, '.fx12v .' + k), a = ez(P(t, .04 + .07 * i, .3));
        e.style.transform = `translate(${(-A * (.35 + dz) * c).toFixed(1)}px,${((1 - a) * 40 * Math.sign(dz)).toFixed(1)}px) rotateY(${(ry - 12 * c * Math.sign(dz)).toFixed(2)}deg)`;
        e.style.opacity = a.toFixed(3); });
      one(cam, '.fx12v .ph').style.left = (130 - 60 * c).toFixed(1) + 'px'; one(cam, '.fx12v .pb').style.width = (100 * mix(.2, 1, ez(P(t, .1, .7 * d)))).toFixed(1) + '%';
    },
    win: () => ({ c: ZC, w: Z.w, h: Z.h, rr: 0 }), winIn: (t, d) => P(t, d - .133, .133),
  });
})();
