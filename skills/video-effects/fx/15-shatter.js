// Effect 15
// ---------------- 15 Shatter: a strike lands on his shoulder, the shot cracks like a pane of glass, the shards fly past the camera,
// and the next scene is behind the glass. The face sits whole inside one big shard and leaves last, so it is never covered.
FX[15] = (() => {
  const s = BS, px = Z.w / 2 - 540 * s, py = BEYE - PG.eye * s, pw = 1080 * s, ph = 1920 * s;
  const eb = EB.split(',').map(Number), FB = [px + eb[0] * pw, py + eb[1] * ph, px + eb[2] * pw, py + eb[3] * ph];   // eyes-to-mouth box, zone coords
  const I = [Z.w * (V === 'A' ? .62 : .56), FB[3] + (Z.h - FB[3]) * (V === 'A' ? .55 : .36)];   // the strike: on his chest, below the face
  let seed = 15; const rnd = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const corners = [[FB[0], FB[1]], [FB[2], FB[1]], [FB[0], FB[3]], [FB[2], FB[3]]];
  const ang = corners.map(([x, y]) => Math.atan2(y - I[1], x - I[0])), dst = corners.map(([x, y]) => Math.hypot(x - I[0], y - I[1]));
  const a0 = Math.min(...ang) - .2, a1 = Math.max(...ang) + .2, r0 = Math.min(...dst) - 40, r1 = Math.max(...dst) + 70;
  // spokes: straight rays from the strike, irregular, none through the face sector (a0..a1)
  const sp = [a0, a1]; let a = a1;
  while (true) { a += .38 + rnd() * .34; if (a >= a0 + 2 * Math.PI - .3) break; sp.push(a); }
  sp.sort((x, y) => x - y);
  const dir = k => [Math.cos(sp[k % sp.length] + (k >= sp.length ? 2 * Math.PI : 0)), Math.sin(sp[k % sp.length])];
  const big = ZD * 3, ringsAll = [0, 34, 92, 170, 290, 430, 640, 900, big], fIn = (r0 - 10) / 1.15, fOut = Math.max(r1, 560) / .85;
  const faceRings = [0, 34, 92, ...(fIn > 120 ? [Math.min(170, fIn)] : []), fOut, Math.max(900, fOut * 1.4), big];
  const jit = new Map(); const R = (k, r) => { const key = (k % sp.length) + ':' + r; if (!jit.has(key)) jit.set(key, r === 0 || r === big ? 1 : .87 + rnd() * .26); return r * jit.get(key); };
  const P = (k, r) => { const d = dir(k), rr = R(k, r); return [I[0] + d[0] * rr, I[1] + d[1] * rr]; };
  const fi = sp.indexOf(a0);   // the face sector runs from spoke fi to spoke fi+1
  const cells = [];   // points on one spoke are collinear (jitter only along the ray), so neighbours share edges exactly: no slivers
  for (let k = 0; k < sp.length; k++) {
    const isF = k === fi, rs = isF ? faceRings : ringsAll;
    for (let j = 0; j < rs.length - 1; j++) {
      const ra = rs[j], rb = rs[j + 1], poly = ra === 0 ? [I, P(k + 1, rb), P(k, rb)] : [P(k, ra), P(k + 1, ra), P(k + 1, rb), P(k, rb)];
      const xs = poly.map(p => p[0]), ys = poly.map(p => p[1]);
      if (Math.max(...xs) < 0 || Math.min(...xs) > Z.w || Math.max(...ys) < 0 || Math.min(...ys) > Z.h) continue;
      const cx = xs.reduce((m, v) => m + v, 0) / xs.length, cy = ys.reduce((m, v) => m + v, 0) / ys.length;
      const face = isF && rb === fOut;
      const ccx = cl(cx, 0, Z.w), ccy = cl(cy, 0, Z.h), r = Math.hypot(ccx - I[0], ccy - I[1]);
      cells.push({ poly, c: [ccx, ccy], r, face, bb: [Math.max(0, Math.min(...xs)), Math.max(0, Math.min(...ys)), Math.min(Z.w, Math.max(...xs)), Math.min(Z.h, Math.max(...ys))], rx: (rnd() - .5) * 80, ry: (rnd() - .5) * 80, rz: (rnd() - .5) * 30, z: .7 + rnd() * .9, w: rnd() });
    }
  }
  const rmax = Math.max(...cells.map(c => c.r)) || 1;
  const pts = p => p.map(q => `${q[0].toFixed(1)}px ${q[1].toFixed(1)}px`).join(',');
  const svgPts = p => p.map(q => `${q[0].toFixed(1)},${q[1].toFixed(1)}`).join(' ');
  // the crack lines: every spoke and every ring chord, drawn outward from the strike
  const cracks = [];
  for (let k = 0; k < sp.length; k++) { const rs = k === fi ? faceRings : ringsAll;
    cracks.push({ p: [P(k, 0), P(k, big)], r: 0 });
    for (const r of rs) if (r > 0 && r < big) cracks.push({ p: [P(k, r), P(k + 1, r)], r }); }
  const TB = .3, CR = .07;   // the strike (local plate time: the shards are stills of this exact frame), crack draw time
  const flyEnd = d => d - .03, faceStart = d => flyEnd(d) - .3;
  const shardP = (c, t, d) => { if (c.face) return P_(t, faceStart(d), flyEnd(d) - faceStart(d));
    const s0 = .37 + Math.pow(c.r / rmax, .8) * Math.max(0, faceStart(d) - .37 - .02), dur = Math.min(.45, flyEnd(d) - s0) * (.85 + .15 * c.w); return P_(t, s0, dur); };
  const P_ = (t, a, dd) => cl((t - a) / dd);
  const fly = (c, e, spread, zt, rx, ry, rz) => {   // 2D only: perspective about the camera axis (ZC), the burst away from the strike, foreshortening by the tilt
    const sz = 1500 / (1500 - zt), dx = c.c[0] - I[0], dy = c.c[1] - I[1], n = Math.hypot(dx, dy) || 1, go = spread * ZD * e, rad = Math.PI / 180;
    const wx = c.c[0] + dx / n * go, wy = c.c[1] + dy / n * go, X = ZC[0] + (wx - ZC[0]) * sz, Y = ZC[1] + (wy - ZC[1]) * sz;
    return `translate(${(X - c.c[0]).toFixed(1)}px,${(Y - c.c[1]).toFixed(1)}px) scale(${sz.toFixed(4)}) rotate(${rz.toFixed(2)}deg) scale(${Math.cos(ry * rad).toFixed(4)},${Math.cos(rx * rad).toFixed(4)})`; };
  const shake = t => { const u = t - TB; return u < 0 || u > .18 ? 0 : Math.exp(-u * 22) * Math.sin(u * 95); };
  return {
    name: NAMES[14], row: 14, bg: 'blue', Send: 1, seq: false,
    html(id) {
      // each shard is only as big as its own box (full-card layers x 50 made headless Chrome drop paint)
      const sh = cells.map((c, i) => { if (c.face) return ''; const b = c.bb, rel = c.poly.map(q => [q[0] - b[0], q[1] - b[1]]);
        return `<div class="sh" data-i="${i}" style="left:${b[0].toFixed(1)}px;top:${b[1].toFixed(1)}px;width:${(b[2] - b[0]).toFixed(1)}px;height:${(b[3] - b[1]).toFixed(1)}px;clip-path:polygon(${pts(rel)});transform-origin:${(c.c[0] - b[0]).toFixed(1)}px ${(c.c[1] - b[1]).toFixed(1)}px">` +
          plate(PT(15), Z.w / 2 - b[0], BEYE - b[1], BS, 'deco') + `<div class="gl"></div><svg class="ed" viewBox="0 0 ${(b[2] - b[0]).toFixed(1)} ${(b[3] - b[1]).toFixed(1)}"><polygon points="${svgPts(rel)}"/></svg></div>`; }).join('');
      const fc = cells.findIndex(c => c.face);
      return `<style>
        .fx15 .sh{position:absolute;left:0;top:0;overflow:hidden}.fx15 .sh.mev{width:var(--zw);height:var(--zh);overflow:visible}.fx15 .sh .gl,.fx15 .sh .ed{position:absolute;left:0;top:0;width:100%;height:100%}
        .fx15 .gl{background:linear-gradient(125deg,rgba(255,255,255,.04) 20%,rgba(255,255,255,.42) 50%,rgba(255,255,255,.04) 75%);mix-blend-mode:screen;opacity:0}
        .fx15 .ed polygon{fill:none;stroke:rgba(255,255,255,.95);stroke-width:3.2;stroke-linejoin:round}
        .fx15 .ck line{stroke-linecap:round}.fx15 .ck .d{stroke:rgba(0,10,30,.38);stroke-width:2.6}.fx15 .ck .l{stroke:rgba(255,255,255,.95);stroke-width:1.3}
        .f[data-s=blue] .fx15 .ed polygon{stroke:rgba(200,228,255,.9)}
      </style>
      <div class="Z fx15">${SLOT}<div class="Z shl">${sh}
        <div class="sh mev" style="transform-origin:${cells[fc].c[0].toFixed(1)}px ${cells[fc].c[1].toFixed(1)}px">${himView(PT(15), 'me')}<div class="Z gl"></div><svg class="Z ed" viewBox="0 0 ${Z.w} ${Z.h}"><polygon points="${svgPts(cells[fc].poly)}"/></svg></div></div>
        <svg class="Z ck" viewBox="0 0 ${Z.w} ${Z.h}">${cracks.map(c => `<line class="d" x1="${c.p[0][0].toFixed(1)}" y1="${(c.p[0][1] + 1).toFixed(1)}" x2="${c.p[1][0].toFixed(1)}" y2="${(c.p[1][1] + 1).toFixed(1)}"/><line class="l" x1="${c.p[0][0].toFixed(1)}" y1="${c.p[0][1].toFixed(1)}" x2="${c.p[1][0].toFixed(1)}" y2="${c.p[1][1].toFixed(1)}"/>`).join('')}</svg></div>`;
    },
    camera: () => null,
    seek(cam, t, d) {
      const broke = t >= TB, fc = cells.findIndex(c => c.face), sk = shake(t), cr = P_(t, TB, CR);
      const shl = one(cam, '.shl'); shl.style.transform = `translate(${(sk * 7).toFixed(2)}px,${(sk * -5).toFixed(2)}px)`;
      own(cam, '.sh:not(.mev)').forEach(el => {
        const c = cells[+el.dataset.i], p = shardP(c, t, d), e = Math.pow(p, 1.5);   // ease in: the glass accelerates past the lens
        el.style.display = broke && !c.face && p < 1 ? 'block' : 'none';
        const zf = Math.pow(p, 1.15);   // toward the lens while it bursts out from the strike
        el.style.transform = fly(c, e, .12 + .26 * c.z, (380 + 330 * c.z) * zf, 2 * c.rx * zf, 2 * c.ry * zf, 2.4 * c.rz * zf);
        el.style.opacity = (1 - P_(p, .8, .2)).toFixed(3);
        q(el, '.gl').style.opacity = broke ? ((.25 + .75 * Math.abs(Math.sin((c.ry + c.rx) * p * Math.PI / 90 + c.w * 6))) * cl(p * 5)).toFixed(3) : 0;
        q(el, '.ed').style.opacity = broke ? (.55 + .45 * e).toFixed(3) : 0;
      });
      // his face: the whole plate until the strike, then the one shard that holds his face. It leaves last, toward the camera.
      const me = one(cam, '.mev'), c = cells[fc], p = shardP(c, t, d), e = p * p * p;
      me.style.clipPath = broke ? `polygon(${pts(c.poly)})` : 'none';
      me.style.transform = broke ? fly(c, e, .9, 700 * e, 8 * e, -14 * e, 0) : 'none';
      me.style.opacity = (FACEF ? 1 - P_(p, .1, .25) : 1 - P_(p, .7, .3)).toFixed(3);   // F: the face shard is gone before it drifts off the face behind it
      q(me, '.gl').style.opacity = 0; q(me, '.ed').style.opacity = broke ? (.7 * cr).toFixed(3) : 0;
      // cracks race out from the strike, then hand over to the shard edges as the glass lets go
      const ck = one(cam, '.ck'); ck.style.opacity = broke ? (1 - P_(t, .44, .08)).toFixed(3) : 0;
      own(cam, '.ck line').forEach((l, i) => { const cc = cracks[i >> 1], L = Math.hypot(cc.p[1][0] - cc.p[0][0], cc.p[1][1] - cc.p[0][1]);
        const reach = cr * ZD * 1.6, show = cc.r === 0 ? cl(reach / L) : cl((reach - cc.r) / 60);
        l.style.strokeDasharray = `${L.toFixed(1)} ${L.toFixed(1)}`; l.style.strokeDashoffset = (L * (1 - show)).toFixed(1); });
    },
    win: () => ({ c: ZC, w: Z.w, h: Z.h, rr: 0 }),
    winIn: t => t >= TB ? 1 : 0,
  };
})();
