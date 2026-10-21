// Effect 18
// ---------------- 18 Ribbon Wrap: a blue satin ribbon unrolls round him in a helix (across his chest, behind his head,
// over his crown) carrying your words. A gift tag drops off the ribbon and the camera dives into the tag.
// The tag carries a play mark, never the next shot (a second face), and the next shot fades in only once the dive is under way.
FX[18] = (() => {
  const s = BS, px = Z.w / 2 - 540 * s, py = BEYE - PG.eye * s, pw = 1080 * s, ph = 1920 * s;
  const U = (x, y) => [px + x * s, py + y * s];                               // plate units -> zone
  const R = V === 'L' ? 330 : 430;                                            // helix radius (plate units)
  const YC = V === 'B' ? 1330 : 1250, YB = V === 'B' ? 780 : 760;             // chest pass centre, back pass (behind the head) centre
  const K = (YC - YB) / Math.PI;                                              // rise per radian
  const BH = 84, CX = 540;
  const T0 = -Math.PI / 2 - .35, TE = 2.5 * Math.PI + .25;                    // the ribbon runs from low left round to above the crown
  const at = th => [CX + R * Math.sin(th), YC - K * th];                      // centre line, plate units
  const EBOX = (() => { const b = EB.split(',').map(Number); return [b[0] * 1080 - 30, b[1] * 1920 - 30, b[2] * 1080 + 30, b[3] * 1920 + 30]; })();
  const hitsFace = (a, b) => { const x0 = Math.min(a[0], b[0]), x1 = Math.max(a[0], b[0]), y0 = Math.min(a[1], b[1]) - BH / 2, y1 = Math.max(a[1], b[1]) + BH / 2; return x1 > EBOX[0] && x0 < EBOX[2] && y1 > EBOX[1] && y0 < EBOX[3]; };
  const hex = (a, b, p) => { const A = [parseInt(a.slice(1, 3), 16), parseInt(a.slice(3, 5), 16), parseInt(a.slice(5), 16)], B = [parseInt(b.slice(1, 3), 16), parseInt(b.slice(3, 5), 16), parseInt(b.slice(5), 16)]; return `rgb(${A.map((v, i) => Math.round(mix(v, B[i], p))).join(',')})`; };
  // the gift tag: a window in the zone's aspect, hanging off the ribbon
  const HA = V === 'A' ? .55 * Math.PI : .3 * Math.PI, HP = U(...at(HA));
  const TW = Z.w * (V === 'A' ? .2 : .2), TH = TW * Z.h / Z.w, SE = Z.w / TW;
  const TC = V === 'A' ? [Z.w * .86, HP[1] + 40 + TH * .62] : V === 'B' ? [Z.w * .79, HP[1] + 110 + TH * .62] : [Math.min(Z.w - TW * .62, HP[0] - 8), HP[1] + 44 + TH * .62];
  const TR = V === 'B' ? 14 : 10;
  const TD = .3, TI = .3, DV = .78;                                           // drawn by 0.3s, tag in 0.3-0.45, dive from 0.78s
  const head = t => mix(T0, TE, ez(P(t, 0, TD)));
  const tagIn = t => ez(P(t, TI, .16));
  const tagC = t => [TC[0], TC[1] - 46 * (1 - tagIn(t))];
  const RW = SAY('RIBBON WRAP').toUpperCase().slice(0, 14);   // the words on the ribbon (--words, up to 14 characters)
  const N = 130, path = (a, b) => { let d = ''; for (let i = 0; i <= 40; i++) { const p = U(...at(mix(a, b, i / 40))); d += (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1); } return d; };
  return {
    name: NAMES[17], row: 17, bg: 'floor', Send: SE,
    html(id) {
      const fs = 54 * s;
      return `<style>
        .fx18 .bk{-webkit-mask-image:linear-gradient(#000,#000),url(${T1}cut${PT(18)}.png);-webkit-mask-size:100% 100%,${pw.toFixed(1)}px ${ph.toFixed(1)}px;-webkit-mask-position:0 0,${px.toFixed(1)}px ${py.toFixed(1)}px;-webkit-mask-repeat:no-repeat;-webkit-mask-composite:xor;mask-composite:exclude}
        .fx18 svg{overflow:visible}.fx18 .fr{filter:drop-shadow(0 ${(10 * s).toFixed(1)}px ${(12 * s).toFixed(1)}px rgba(0,19,47,.32))}
        .fx18 text{font-weight:800;font-size:${fs.toFixed(1)}px;letter-spacing:.14em;fill:#fff;dominant-baseline:central}
        .fx18 .tg{position:absolute;background:#fff;border-radius:${(TR + 6)}px;box-shadow:0 2px 6px rgba(0,19,47,.12),0 20px 40px -12px rgba(0,19,47,.4)}
        .fx18 .tg i{position:absolute;left:50%;width:${(TW * .14).toFixed(1)}px;height:${(TW * .14).toFixed(1)}px;margin-left:${(-TW * .07).toFixed(1)}px;border-radius:50%;border:${Math.max(2, TW * .025).toFixed(1)}px solid #0071E3;background:#e9edf2}
        .fx18 .tc{position:absolute;border-radius:${TR}px;background:#f3f5f8;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:${(TW * .08).toFixed(1)}px}
        .fx18 .tc b{font-weight:800;font-size:${(TW * .42).toFixed(1)}px;line-height:1;color:#1d1d1f;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
        .fx18 .tc u{display:block;width:${(TW * .34).toFixed(1)}px;height:${Math.max(3, TW * .045).toFixed(1)}px;border-radius:99px;background:#0071E3}
        .fx18 .st{stroke:#1d1d1f;stroke-opacity:.55;stroke-width:${Math.max(1.5, 2.5 * s).toFixed(1)};fill:none}
      </style><div class="Z fx18">${himView(PT(18), 'me')}
        <div class="Z bk"><svg class="Z" viewBox="0 0 ${Z.w} ${Z.h}"><g class="bq"></g></svg></div>
        <svg class="Z st0" viewBox="0 0 ${Z.w} ${Z.h}"><path class="st"/></svg>
        <svg class="Z fr" viewBox="0 0 ${Z.w} ${Z.h}"><defs><path id="${id}p1" d="${path(-Math.PI / 2 + .12, Math.PI / 2 - .12)}"/><path id="${id}p2" d="${path(1.5 * Math.PI + .12, 2.5 * Math.PI - .12)}"/></defs>
          <g class="fq"></g><text class="t1"><textPath href="#${id}p1" startOffset="50%" text-anchor="middle">${RW}</textPath></text><text class="t2"><textPath href="#${id}p2" startOffset="50%" text-anchor="middle">${RW}</textPath></text></svg>
        <div class="tg"><i></i></div><div class="tc"><svg viewBox="0 0 24 24" style="width:${(TW * .34).toFixed(1)}px;height:${(TW * .34).toFixed(1)}px"><path d="M7 4.5v15l12.5-7.5z" fill="#1d1d1f"/></svg><u></u></div>${SLOT}</div>`;
    },
    camera(t, d) { const e = eio(P(t, DV, Math.max(.12, d - .03 - DV))), W = tagC(t); return e > 0 ? { a: W, f: [mix(W[0], ZC[0], e), mix(W[1], ZC[1], e)], S: Math.pow(SE, e) } : null; },
    seek(cam, t, d) {
      const hb = head(t); let fq = '', bq = '';
      for (let i = 0; i < N; i++) {
        const a = mix(T0, TE, i / N); if (a >= hb) break; const b = Math.min(mix(T0, TE, (i + 1) / N), hb), m = (a + b) / 2, c = Math.cos(m);
        const A = at(a), B = at(b);
        const q = [U(A[0], A[1] - BH / 2), U(B[0], B[1] - BH / 2), U(B[0], B[1] + BH / 2), U(A[0], A[1] + BH / 2)].map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' ');
        if (c >= 0) { const f = hex('#0a4fa8', '#2b8cff', Math.pow(c, .7)); fq += `<polygon points="${q}" fill="${f}" stroke="${f}" stroke-width=".8"/>`;
          const t0 = U(A[0], A[1] - BH / 2 + 5), t1 = U(B[0], B[1] - BH / 2 + 5); fq += `<line x1="${t0[0].toFixed(1)}" y1="${t0[1].toFixed(1)}" x2="${t1[0].toFixed(1)}" y2="${t1[1].toFixed(1)}" stroke="rgba(255,255,255,${(.18 + .3 * c).toFixed(2)})" stroke-width="${(3 * s).toFixed(1)}"/>`; }
        else if (!hitsFace(A, B)) { const f = hex('#062a5e', '#0a3f8c', Math.pow(-c, .7)); bq += `<polygon points="${q}" fill="${f}" stroke="${f}" stroke-width=".8"/>`; }
      }
      one(cam, '.fq').innerHTML = fq; one(cam, '.bq').innerHTML = bq;
      const sc = P(t, .12, .12), sp = 50 - 5 * eio(P(t, .2, DV - .2));
      const t1 = one(cam, '.t1'); t1.style.opacity = (hb > Math.PI / 2 ? ez(sc) : 0).toFixed(3); t1.firstChild.setAttribute('startOffset', sp.toFixed(2) + '%');
      const t2 = one(cam, '.t2'); t2.style.opacity = (hb > 2.5 * Math.PI - .1 ? ez(P(t, TD - .04, .12)) : 0).toFixed(3); t2.firstChild.setAttribute('startOffset', sp.toFixed(2) + '%');
      const W = tagC(t), o = tagIn(t), pad = TW * .08, top = TW * .26;
      const tg = one(cam, '.tg'); Object.assign(tg.style, { left: (W[0] - TW / 2 - pad).toFixed(1) + 'px', top: (W[1] - TH / 2 - top).toFixed(1) + 'px', width: (TW + 2 * pad).toFixed(1) + 'px', height: (TH + pad + top).toFixed(1) + 'px', opacity: o.toFixed(3) });
      q(tg, 'i').style.top = (top * .28).toFixed(1) + 'px';
      Object.assign(one(cam, '.tc').style, { left: (W[0] - TW / 2).toFixed(1) + 'px', top: (W[1] - TH / 2).toFixed(1) + 'px', width: TW.toFixed(1) + 'px', height: TH.toFixed(1) + 'px', opacity: (o * (1 - (FACEF ? P(t, DV, .3 * Math.max(.12, d - .03 - DV)) : this.winIn(t, d)))).toFixed(3) });   // F: the tag clears as the dive starts, never a white card over his face   // the number hands over to the next shot, never shows through it
      const ey = [W[0], W[1] - TH / 2 - top * .62];
      const st = one(cam, '.st'); st.setAttribute('d', `M${HP[0].toFixed(1)} ${HP[1].toFixed(1)} Q${((HP[0] + ey[0]) / 2 + 6).toFixed(1)} ${((HP[1] + ey[1]) / 2 + 14).toFixed(1)} ${ey[0].toFixed(1)} ${ey[1].toFixed(1)}`); st.style.opacity = o.toFixed(3);
    },
    win(t) { return { c: tagC(t), w: TW, h: TH, rr: TR }; },
    winIn: (t, d) => { const dl = Math.max(.12, d - .03 - DV); return P(t, DV + .45 * dl, .3 * dl); },   // late: the tag is already big when the next shot shows
  };
})();
// Feed cut F (21/10/2026): no gift tag, no "19" card, no dive. Zoom-Through dissolves in over 4 frames.
if (FACEF) { const sk = FX[18].seek; Object.assign(FX[18], { noDive: true, fullWin: true, seek(cam, t, d) { sk.call(this, cam, t, d); own(cam, '.tg,.tc').forEach(e => e.style.display = 'none'); } }); }
