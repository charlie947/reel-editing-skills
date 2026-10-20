// Effect 11
// ---------------- 11 Tile Tunnel: we fly backwards out of his shot down a tunnel lined with plain tiles (him only at the far opening), then fly down it again.
// The tiles carry plain tones, never thumbnails of the face (one live face at a time).
// Real perspective: every tile is projected from 3D by its own matrix3d (no preserve-3d). The engine camera carries the scale so the opening is a plain window.
(() => {
  const S11 = 4, F = 1.15 * Math.max(Z.w, Z.h) / 2, Wt = Z.w / 2, Ht = Z.h / 2, ZE = 0, ZA = ZE - F, DZ = F * (S11 - 1);
  const ts0 = Math.min(Z.w, Z.h) / 2.1, ROWS = Math.max(2, Math.round(2 * Ht / ts0)), COLS = Math.max(2, Math.round(2 * Wt / ts0));
  const RINGS = Math.ceil((DZ + .3 * F) / ts0), TL = (DZ + .3 * F) / RINGS, GAP = .045;
  const rnd = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
  // tiles: wall (0 left,1 right,2 ceiling,3 floor), cell (i across, k along depth)
  const TILES = []; for (let k = 0; k < RINGS; k++) for (let wl = 0; wl < 4; wl++) { const n = wl < 2 ? ROWS : COLS; for (let i = 0; i < n; i++) { const id = TILES.length, r = rnd(id + 1);
    TILES.push({ wl, i, n, k, img: null, tone: Math.floor(rnd(id + 3) * 3) }); } }
  TILES.sort((a, b) => a.k - b.k);   // far rings first in the DOM (k = 0 is at the opening)
  const corner = (T, u, v) => { // u across the wall, v along depth (0 at the opening side of the cell)
    const z = ZE - (T.k + v) * TL, a = -1 + 2 * (T.i + u) / T.n;
    return T.wl === 0 ? [-Wt, a * Ht, z] : T.wl === 1 ? [Wt, a * Ht, z] : T.wl === 2 ? [a * Wt, -Ht, z] : [a * Wt, Ht, z]; };
  const camZ = (t, d) => { const u = (FACEF ? eio(P(t, 0, .46)) : ez(P(t, .02, .34))) * (1 - .06 * ez(P(t, .36, .4))), w = eio(P(t, d - .44, .44)); return ZA - DZ * u * (1 - w); };
  const Sof = zc => S11 * F / (ZE - zc);
  function hom(q, w, h) { const [[x0, y0], [x1, y1], [x2, y2], [x3, y3]] = q, dx1 = x1 - x2, dx2 = x3 - x2, dx3 = x0 - x1 + x2 - x3, dy1 = y1 - y2, dy2 = y3 - y2, dy3 = y0 - y1 + y2 - y3;
    const den = dx1 * dy2 - dx2 * dy1, g = (dx3 * dy2 - dx2 * dy3) / den, hh = (dx1 * dy3 - dx3 * dy1) / den;
    const a = x1 - x0 + g * x1, b = x3 - x0 + hh * x3, d = y1 - y0 + g * y1, e = y3 - y0 + hh * y3;
    return `matrix3d(${[a / w, d / w, 0, g / w, b / h, e / h, 0, hh / h, 0, 0, 1, 0, x0, y0, 0, 1].map(v => +v.toFixed(6)).join(',')})`; }
  const TT = {
    name: NAMES[10], row: 10, bg: 'blue', Send: S11,
    html() {
      const tiles = TILES.map(T => `<div class="fx11-t${T.img ? ' im' : ' p' + T.tone}"${T.img ? ` style="background-image:url(${T1}plate${T.img}.jpg)"` : ''}><i></i></div>`).join('');
      return `<div class="Z fx11"><div class="Z fx11-wl">${tiles}</div>
        <div class="fx11-op" style="left:${(ZC[0] - Z.w / S11 / 2).toFixed(1)}px;top:${(ZC[1] - Z.h / S11 / 2).toFixed(1)}px;width:${(Z.w / S11).toFixed(1)}px;height:${(Z.h / S11).toFixed(1)}px;border-radius:${(Z.r / S11).toFixed(2)}px">
          <div class="Z" style="left:${(-(ZC[0] - Z.w / S11 / 2)).toFixed(1)}px;top:${(-(ZC[1] - Z.h / S11 / 2)).toFixed(1)}px"><div class="Z" style="transform-origin:0 0;transform:${embT(ZC, S11)}">${himView(PT(11), 'me')}</div></div></div>
        ${SLOT}</div>
      <style>
        .fx11 .fx11-t{position:absolute;left:0;top:0;width:100px;height:100px;transform-origin:0 0;border-radius:9px;overflow:hidden;background-size:cover;background-position:center 28%;backface-visibility:visible}
        .fx11 .fx11-t i{position:absolute;inset:0}
        .fx11 .fx11-op{position:absolute;overflow:hidden}
        .f[data-s=white] .fx11 .fx11-t.p0{background:linear-gradient(150deg,#ffffff,#eef1f5)}
        .f[data-s=white] .fx11 .fx11-t.p1{background:linear-gradient(150deg,#f7f9fb,#e4e9ef)}
        .f[data-s=white] .fx11 .fx11-t.p2{background:linear-gradient(150deg,#fbfcfd,#e9edf2)}
        .f[data-s=white] .fx11 .fx11-t{box-shadow:inset 0 0 0 2px rgba(29,29,31,.06)}
        .f[data-s=white] .fx11 .fx11-t i{background:#f3f5f8}
        .f[data-s=white] .fx11 .fx11-op{--rc:0,113,227}
        .f[data-s=blue] .fx11 .fx11-t.p0{background:linear-gradient(150deg,#1d4f9e,#0f2f66)}
        .f[data-s=blue] .fx11 .fx11-t.p1{background:linear-gradient(150deg,#163f82,#0b2552)}
        .f[data-s=blue] .fx11 .fx11-t.p2{background:linear-gradient(150deg,#235aad,#123672)}
        .f[data-s=blue] .fx11 .fx11-t{box-shadow:inset 0 0 0 2px rgba(160,205,255,.14)}
        .f[data-s=blue] .fx11 .fx11-t i{background:#0a1a38}
        .f[data-s=blue] .fx11 .fx11-op{--rc:140,196,255}
      </style>`;
    },
    camera(t, d) { return { a: ZC, f: ZC, S: Sof(camZ(t, d)) }; },
    seek(cam, t, d) {
      const zc = camZ(t, d), S = Sof(zc), els = own(cam, '.fx11-t'), near = zc + .55 * F;
      const pr = ([X, Y, Zz]) => { const k = F / (Zz - zc); return [ZC[0] + X * k / S, ZC[1] + Y * k / S]; };   // screen projection, carried back through the camera scale
      TILES.forEach((T, j) => { const el = els[j], z0 = ZE - (T.k + 1) * TL;   // the cell's near edge
        if (ZE - T.k * TL < near) { el.style.display = 'none'; return; }
        const vN = z0 < near ? (ZE - near) / TL - T.k : 1;   // clip the part of the cell behind the near plane (it is outside the zone anyway)
        if (vN < GAP + .02) { el.style.display = 'none'; return; }
        const quad = T.wl === 0 ? [pr(corner(T, GAP, Math.min(vN, 1 - GAP))), pr(corner(T, GAP, GAP)), pr(corner(T, 1 - GAP, GAP)), pr(corner(T, 1 - GAP, Math.min(vN, 1 - GAP)))]
          : T.wl === 1 ? [pr(corner(T, GAP, GAP)), pr(corner(T, GAP, Math.min(vN, 1 - GAP))), pr(corner(T, 1 - GAP, Math.min(vN, 1 - GAP))), pr(corner(T, 1 - GAP, GAP))]
          : T.wl === 2 ? [pr(corner(T, GAP, Math.min(vN, 1 - GAP))), pr(corner(T, 1 - GAP, Math.min(vN, 1 - GAP))), pr(corner(T, 1 - GAP, GAP)), pr(corner(T, GAP, GAP))]
          : [pr(corner(T, GAP, GAP)), pr(corner(T, 1 - GAP, GAP)), pr(corner(T, 1 - GAP, Math.min(vN, 1 - GAP))), pr(corner(T, GAP, Math.min(vN, 1 - GAP)))];
        el.style.display = 'block'; el.style.transform = hom(quad, 100, 100);
        const depth = (ZE - (T.k + .5) * TL) - zc;                      // haze: far tiles melt into the light at the end of the tunnel
        el.firstChild.style.opacity = cl((depth - 1.1 * F) / (2.6 * F) * .85 + .05, 0, .9).toFixed(3); });
      const v = Math.abs(Sof(camZ(t + 1 / 30, d)) - S) * 30 / S;          // motion blur on the walls while we fly
      one(cam, '.fx11-wl').style.filter = v > .4 ? `blur(${cl((v - .4) * .5, 0, 2.2).toFixed(2)}px)` : 'none';
      const op = one(cam, '.fx11-op'), ro = P(t, .1, .2) * (1 - P(t, .5, .1));   // a thin accent rim marks the opening while we are out in the tunnel
      op.style.opacity = (1 - P(t, .62, .01)).toFixed(3);
      op.style.boxShadow = `0 0 0 ${(1.2 / S).toFixed(2)}px rgba(var(--rc),${ro.toFixed(3)}),0 0 0 ${(4 / S).toFixed(2)}px rgba(var(--rc),${(.14 * ro).toFixed(3)})`;
    },
    win: () => ({ c: ZC, w: Z.w / S11, h: Z.h / S11, rr: Z.r / S11 }),
    winIn: t => P(t, .48, .14),
  };
  FX[11] = TT;
})();
