// Effect 17
// ---------------- 17 Pull-Back Reveal: it opens on Spotlight's close-up and pulls right back to show where he is: his shot
// is the preview pane of a clean video editor that fills the card, with a timeline of clips under it and the
// playhead on yours. It holds the wide, then flies back into the preview.
FX[17] = (() => {
  const F = [Z.w / 2, BEYE + (PG.mouth - PG.eye) * BS * .45];               // Spotlight's push lands here at 1.25x
  const S0 = (window.REEL || {}).cut === 'F' ? 1 : 1.25;   // F: opens at his normal size (16 no longer pushes)
  const pw = 1080 * BS, ph = 1920 * BS, px = Z.w / 2 - 540 * BS, py = BEYE - PG.eye * BS;   // the full plate in zone coords
  const PC = [px + pw / 2, py + ph / 2];
  // the editor at the wide, in card pixels: window W, preview pane pv (his shot), timeline tl, side panels (A and B only)
  const m = 24, k = V === 'B' ? 1.5 : V === 'A' ? 1.1 : 1.15, tb = 44 * k;
  const W = [m, m, Z.w - 2 * m, Z.h - 2 * m];
  const L = V === 'L' ? (() => { const pv = [m + 16, m + tb + 6, Z.w - 2 * m - 32, 0]; pv[3] = pv[2] * 16 / 9; return { pv, tl: [m, pv[1] + pv[3] + 14, W[2], Z.h - m - (pv[1] + pv[3] + 14)], side: null }; })()
    : V === 'A' ? (() => { const tlh = 236, h = Z.h - m - tlh - (m + tb) - 12, w = h * 9 / 16; return { pv: [Z.w / 2 - w / 2, m + tb + 6, w, h], tl: [m, Z.h - m - tlh, W[2], tlh], side: [m + 14, Z.w / 2 + w / 2 + 16] }; })()
    : (() => { const y0 = 400, h = 1000, w = h * 9 / 16; return { pv: [Z.w / 2 - w / 2, y0, w, h], tl: [m, y0 + h + 18, W[2], Z.h - m - (y0 + h + 18)], side: [m + 18, Z.w / 2 + w / 2 + 22] }; })();
  const SW = L.pv[2] / pw;                                                       // the wide: the plate exactly fills the preview pane
  const FW = [L.pv[0] + L.pv[2] / 2, L.pv[1] + L.pv[3] / 2];
  const centre = (a, f, S) => [a[0] + (ZC[0] - f[0]) / S, a[1] + (ZC[1] - f[1]) / S];   // the world point at the middle of the card
  const C0 = S0 === 1 ? ZC : centre(F, ZC, S0), CW = centre(PC, FW, SW), C1 = ZC;
  const lg = (a, b, e) => Math.exp(mix(Math.log(a), Math.log(b), e));
  const TO = .5, TH = .82;                                                       // out by 0.5s, hold the wide to 0.82s, back in by d-0.03
  const state = (t, d) => {
    const o = eio(P(t, .02, TO - .02)), i = eio(P(t, TH, Math.max(.2, d - .03 - TH))), drift = 1 - .025 * eio(P(t, TO - .06, TH - TO + .1));
    if (i <= 0) return { c: [mix(C0[0], CW[0], o), mix(C0[1], CW[1], o)], S: lg(S0, SW, o) * drift };
    return { c: [mix(CW[0], C1[0], i), mix(CW[1], C1[1], i)], S: lg(SW * drift, 1, i) };
  };
  // your clip's own clock, for the timecode over the playhead
  const T17 = SETUP.at || 0, L17 = SETUP.len || 1.3;   // where the effect starts in your clip, and its length
  const tc = x => { const f = Math.floor(x * 30 + 1e-6); return `00:${String(Math.floor(f / 30)).padStart(2, '0')}:${String(f % 30).padStart(2, '0')}`; };
  const CWID = V === 'A' ? 200 : V === 'B' ? 270 : 214;
  // the editor chrome, authored in card pixels at the wide (origin = the window's top left)
  const chrome = () => {
    const [wx, wy, ww] = W, X = x => (x - wx).toFixed(1), Y = y => (y - wy).toFixed(1), fs = 15 * k;
    let h = `<div class="tb" style="height:${tb}px"><i></i><i></i><i></i><span>Video edit</span><em>Export</em></div>`;
    const pv = L.pv; h += `<div class="pvf" style="left:${X(pv[0] - 1)}px;top:${Y(pv[1] - 1)}px;width:${pv[2] + 2}px;height:${pv[3] + 2}px"></div>`;
    if (L.side) {   // media bin on the left, inspector on the right
      const sw = pv[0] - 16 - L.side[0], sy = pv[1];
      h += `<div class="pl" style="left:${X(L.side[0])}px;top:${Y(sy)}px;width:${sw.toFixed(1)}px"><b>Media</b>`;
      const tw = (sw - 8) / 2, th = tw * 1.1;
      ['k1', 'k2', 'k3', 'k4', 'k5', 'k6'].forEach((p, j) => { h += `<div class="th" style="left:${(j % 2 * (tw + 8)).toFixed(1)}px;top:${(fs * 2 + Math.floor(j / 2) * (th + 8)).toFixed(1)}px;width:${tw.toFixed(1)}px;height:${th.toFixed(1)}px"><img class="deco" src="${T1}plate${p}s.jpg"></div>`; });
      h += `</div>`;
      const rx = L.side[1], rw = wx + ww - 14 - rx, rows = [['Effect', 'Pull-Back Reveal', 1], ['Zoom out', `${Math.round(SW * 100)}%`], ['Ease', 'In-out'], ['Length', `${L17.toFixed(1)}s`]];
      h += `<div class="pl" style="left:${X(rx)}px;top:${Y(sy)}px;width:${rw.toFixed(1)}px"><b>Inspector</b>${rows.map(([a, b, acc], j) => `<div class="ir" style="top:${(fs * 2.4 + j * fs * 3.6).toFixed(1)}px"><span>${a}</span><strong${acc ? ' class="ac"' : ''}>${b}</strong></div>`).join('')}<div class="sl" style="top:${(fs * 2.4 + 4 * fs * 3.6 + fs * .8).toFixed(1)}px"><u style="width:${Math.round(SW * 100)}%"></u></div></div>`;
    }
    const [tx, ty, tw, tH] = L.tl, cx = wx + ww / 2, cw = CWID, gap = 6 * k;
    const rh = tH - 16 * k, tr = 34 * k, ru = 20 * k, v1 = rh * .34, v2 = rh * .15, au = rh - tr - ru - v1 - v2 - 20 * k;
    let y = ty + 8 * k;
    h += `<div class="tl" style="left:${X(tx)}px;top:${Y(ty)}px;width:${tw}px;height:${tH}px"></div>`;
    h += `<svg class="ic" style="left:${X(tx + 18 * k)}px;top:${Y(y + tr / 2 - 8 * k)}px" width="${16 * k}" height="${16 * k}" viewBox="0 0 16 16"><path d="M3 1.5v13l11-6.5z" fill="#1d1d1f"/></svg>`;
    h += `<div class="tcd" style="left:${X(tx + 44 * k)}px;top:${Y(y)}px;height:${tr}px"></div>`;
    h += `<div class="zm" style="left:${X(tx + tw - 130 * k)}px;top:${Y(y + tr / 2 - 1)}px;width:${100 * k}px"><u></u></div>`;
    y += tr;
    let tk = ''; for (let x = 8, n = 0; x < tw - 8; x += 22 * k, n++) tk += `<i style="left:${x.toFixed(1)}px;height:${(n % 4 ? 6 : 12) * k}px"></i>`;
    h += `<div class="ru" style="left:${X(tx)}px;top:${Y(y)}px;width:${tw}px;height:${ru}px">${tk}</div>`; y += ru + 4 * k;
    let cl = '';
    for (let j = -4; j <= 4; j++) { const n = 16 + j; if (n < 0 || n > 19) continue; cl += `<div class="cl${j ? '' : ' ac'}" style="left:${(cx - cw / 2 + j * (cw + gap) - tx - 8).toFixed(1)}px;width:${cw}px"><span>${j ? 'Clip ' + (n + 1) : SAY('Your clip')}</span></div>`; }
    h += `<div class="trk" style="left:${X(tx + 8)}px;top:${Y(y)}px;width:${tw - 16}px;height:${v1.toFixed(1)}px">${cl}</div>`;
    y += v1 + 6 * k;
    let b2 = ''; [[-1.7, .9], [-.35, .55], [.55, 1.1], [2.1, .7]].forEach(([o, w]) => b2 += `<div class="c2" style="left:${(cx + o * cw - tx - 8).toFixed(1)}px;width:${(w * cw).toFixed(1)}px"></div>`);
    h += `<div class="trk" style="left:${X(tx + 8)}px;top:${Y(y)}px;width:${tw - 16}px;height:${v2.toFixed(1)}px">${b2}</div>`;
    y += v2 + 6 * k;
    let wv = '', sd = 7; const nb = Math.floor((tw - 16) / (5 * k));
    for (let j = 0; j < nb; j++) { sd = (sd * 9301 + 49297) % 233280; const a = .25 + .75 * Math.abs(Math.sin(j * .37)) * (.5 + .5 * sd / 233280); wv += `<rect x="${(j * 5 * k).toFixed(1)}" y="${((1 - a) * au / 2).toFixed(1)}" width="${(3 * k).toFixed(1)}" height="${(a * au).toFixed(1)}" rx="1"/>`; }
    h += `<svg class="wv" style="left:${X(tx + 8)}px;top:${Y(y)}px" width="${tw - 16}" height="${au.toFixed(1)}">${wv}</svg>`;
    h += `<div class="ph" style="left:${X(cx)}px;top:${Y(ty + 8 * k + tr)}px;height:${(y + au - ty - 8 * k - tr).toFixed(1)}px"><b></b></div>`;
    return h;
  };
  return {
    name: NAMES[16], row: 16, bg: 'blue', Send: 1,
    html(id) {
      const fs = 15 * k;
      return `<style>
        .fx17 .ed{position:absolute;left:0;top:0;width:${W[2]}px;height:${W[3]}px;transform-origin:0 0;background:#fff;border-radius:22px;box-shadow:inset 0 0 0 1px rgba(29,29,31,.08),0 30px 70px -20px rgba(0,19,47,.35);font-size:${fs}px;color:#1d1d1f;letter-spacing:-.01em;line-height:1.15}
        .fx17 .ed>*{position:absolute}
        .fx17 .tb{left:0;top:0;width:100%;border-bottom:1px solid rgba(29,29,31,.08);display:flex;align-items:center;gap:${7 * k}px;padding:0 ${16 * k}px;font-weight:600}
        .fx17 .tb i{width:${11 * k}px;height:${11 * k}px;border-radius:50%;background:#d9dde3}.fx17 .tb span{position:absolute;left:0;right:0;text-align:center}
        .fx17 .tb em{margin-left:auto;font-style:normal;background:#0071E3;color:#fff;border-radius:${8 * k}px;padding:${4 * k}px ${12 * k}px;font-size:${13 * k}px;position:relative}
        .fx17 .pvf{border-radius:11px;background:#1d1d1f}
        .fx17 .pl b{display:block;font-size:${12 * k}px;font-weight:600;color:#86868b;text-transform:uppercase;letter-spacing:.06em}
        .fx17 .th{position:absolute;border-radius:${8 * k}px;overflow:hidden;background:#e9edf2}.fx17 .th img{width:100%;height:100%;object-fit:cover;opacity:.9}
        .fx17 .ir{position:absolute;left:0;right:0;display:flex;flex-direction:column;gap:${3 * k}px;border-bottom:1px solid rgba(29,29,31,.07);padding-bottom:${8 * k}px}
        .fx17 .ir span{color:#86868b;font-size:${13 * k}px}.fx17 .ir strong{font-weight:600;white-space:nowrap}.fx17 .ir .ac{color:#0071E3}
        .fx17 .sl{position:absolute;left:0;right:0;height:${4 * k}px;border-radius:9px;background:#e9edf2}.fx17 .sl u{display:block;height:100%;border-radius:9px;background:#0071E3}
        .fx17 .tl{border-top:1px solid rgba(29,29,31,.08);background:#f7f8fa;border-radius:0 0 22px 22px}
        .fx17 .tcd{display:flex;align-items:center;font-weight:600;font-variant-numeric:tabular-nums}
        .fx17 .zm{height:${3 * k}px;border-radius:9px;background:#dfe3e9}.fx17 .zm u{position:absolute;left:55%;top:${-4 * k}px;width:${11 * k}px;height:${11 * k}px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(0,19,47,.3)}
        .fx17 .ru i{position:absolute;bottom:0;width:1px;background:rgba(29,29,31,.22)}
        .fx17 .trk{overflow:hidden}.fx17 .cl{position:absolute;top:0;height:100%;border-radius:${8 * k}px;background:#e9edf2;box-shadow:inset 0 0 0 1px rgba(29,29,31,.07);padding:${8 * k}px ${10 * k}px;font-weight:650;font-size:${16 * k}px;white-space:nowrap;overflow:hidden;color:rgba(29,29,31,.75)}
        .fx17 .cl.ac{background:#0071E3;color:#fff;box-shadow:none}
        .fx17 .c2{position:absolute;top:0;height:100%;border-radius:${6 * k}px;background:#dfe3e9}
        .fx17 .wv rect{fill:#c7ccd4}
        .fx17 .ph{width:2px;margin-left:-1px;background:#0071E3}.fx17 .ph b{position:absolute;left:${-6 * k + 1}px;top:${-8 * k}px;width:${12 * k}px;height:${12 * k}px;border-radius:${3 * k}px;background:#0071E3}
        .fx17 .pn{position:absolute;left:${px.toFixed(1)}px;top:${py.toFixed(1)}px;width:${pw.toFixed(1)}px;height:${ph.toFixed(1)}px;overflow:hidden;background:#222}
      </style><div class="Z fx17">${ebx('blue')}<div class="ed">${chrome()}</div>
        <div class="pn">${plate(PT(17), pw / 2, PG.eye * BS, BS, 'me')}</div>${SLOT}</div>`;
    },
    camera(t, d) { const s = state(t, d); return { a: s.c, f: ZC, S: s.S }; },
    seek(cam, t, d) {
      // the window sits so that at the wide it fills the card: world = CW + (card - ZC) / SW
      const ed = one(cam, '.ed'), o = [CW[0] + (W[0] - ZC[0]) / SW, CW[1] + (W[1] - ZC[1]) / SW];
      ed.style.transform = `translate(${o[0].toFixed(2)}px,${o[1].toFixed(2)}px) scale(${(1 / SW).toFixed(5)})`;
      one(cam, '.pn').style.borderRadius = (10 / SW).toFixed(1) + 'px';
      const ph = one(cam, '.ph'); ph.style.transform = `translateX(${(mix(-.3, .3, P(t, 0, d)) * CWID).toFixed(1)}px)`;   // the playhead runs across the lit clip
      one(cam, '.tcd').textContent = tc(T17 + t);
    },
    win: () => ({ c: ZC, w: Z.w, h: Z.h, rr: 0 }),
    winIn: (t, d) => P(t, d - .1, .07),
  };
})();
