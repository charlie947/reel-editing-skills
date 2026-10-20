// Effect 13
// ---------------- 13 Vertigo: his room falls away into a gridded corridor. A dolly zoom: he holds his size while the corridor stretches away
// behind him (the camera backs in as the lens widens). Then we fly down the corridor into the far wall, which is the next shot.
// Everything is projected by hand in true perspective (screen space), then carried back through the engine camera, so no preserve-3d.
(() => {
  const SIDE = V === 'B';
  const VP = SIDE ? [.7 * Z.w, .3 * Z.h] : [Z.w / 2, .28 * Z.h];   // B: the hook owns the top and the name tag sits at y1080, so he stands left and the corridor runs off to the right                        // the vanishing point, above his head
  const sEnd = SIDE ? .2 : .24, s0 = .72;                             // far wall scale: telephoto start, wide end of the dolly
  const K = SIDE ? .62 : .7, E0 = [Z.w / 2, BEYE], E1 = SIDE ? [.32 * Z.w, .44 * Z.h] : [Z.w / 2, Z.h - (Z.h - BEYE) * K];   // he steps back about the bottom centre
  const S13 = 1 / sEnd;
  const T = { room: [0, (window.REEL || {}).cut === 'F' ? .06 : .16], step: [.02, .42], dolly: [.08, .54], win: [.6, .1], dive: [.64, .51] };
  const sL = t => mix(s0, sEnd, eio(P(t, ...T.dolly)));                // far wall scale during the dolly
  const Dst = s => s / (1 - s);                                        // camera distance (corridor length 1) giving that far wall scale
  const DE = Dst(sEnd), dl = t => eio(P(t, ...T.dive));
  // the state at t: camera distance D, forward travel dz; a point at depth z projects at scale D/(D - dz + z) about VP
  const st = t => { const D = Dst(sL(t)), dz = dl(t); return { D, dz, s: z => { const q = D - dz + z; return q > .02 ? D / q : null; } }; };
  const camS = t => { const c = st(t), f = c.s(1); return f / sEnd; };
  const R0 = [-VP[0], -VP[1], Z.w - VP[0], Z.h - VP[1]];               // the corridor cross-section relative to VP (= the zone at scale 1)
  const NW = 6, NH = Math.max(6, Math.round(NW * Z.h / Z.w)), RINGS = 12;
  const VT = {
    name: NAMES[12], row: 12, bg: 'blue', Send: S13,
    html(id) {
      return `<div class="Z fx13">
        <svg class="Z fx13-sv" viewBox="0 0 ${Z.w} ${Z.h}" style="overflow:visible"><path class="w c"/><path class="w l"/><path class="w r"/><path class="w f"/><path class="g"/><rect class="bw" fill="url(#${id}-l)"/><defs><radialGradient id="${id}-l" cx="50%" cy="50%" r="70%"><stop offset="0" class="l0"/><stop offset="1" class="l1"/></radialGradient></defs></svg>
        ${SLOT}
        <div class="Z fx13-him"><div class="Z fx13-room">${himView(PT(13), 'deco')}</div>${cut(PT(13), Z.w / 2, BEYE, BS, 'me')}</div>
        <svg class="Z fx13-rm" viewBox="0 0 ${Z.w} ${Z.h}" style="overflow:visible"><rect class="rim"/></svg></div>
      <style>
        .fx13 .fx13-him{transform-origin:0 0}.fx13 .fx13-sv .g{fill:none}.fx13 .fx13-rm .rim{fill:none}
        .f[data-s=white] .fx13 .w.c{fill:#f6f8fb}.f[data-s=white] .fx13 .w.l,.f[data-s=white] .fx13 .w.r{fill:#eef2f7}.f[data-s=white] .fx13 .w.f{fill:#e6ebf2}
        .f[data-s=white] .fx13 .g{stroke:rgba(0,113,227,.28)}.f[data-s=white] .fx13 .l0{stop-color:#ffffff}.f[data-s=white] .fx13 .l1{stop-color:#dfe9f6}.f[data-s=white] .fx13 .rim{stroke:#0071E3}
        .f[data-s=blue] .fx13 .w.c{fill:#0c2c62}.f[data-s=blue] .fx13 .w.l,.f[data-s=blue] .fx13 .w.r{fill:#0a2554}.f[data-s=blue] .fx13 .w.f{fill:#081d44}
        .f[data-s=blue] .fx13 .g{stroke:rgba(90,176,255,.5)}.f[data-s=blue] .fx13 .l0{stop-color:#3d86e6}.f[data-s=blue] .fx13 .l1{stop-color:#123a7c}.f[data-s=blue] .fx13 .rim{stroke:#8cc4ff}
      </style>`;
    },
    camera(t) { if (t < T.dive[0]) return null; return { a: VP, f: VP, S: camS(t) }; },
    seek(cam, t, d) {
      const c = st(t), S = t < T.dive[0] ? 1 : camS(t), n = v => v.toFixed(1);
      const pt = (x, y, s) => [VP[0] + x * s / S, VP[1] + y * s / S];      // screen projection, carried back through the camera
      const zN = Math.max(0, c.dz - c.D + .12), sN = c.s(zN), sF = c.s(1);  // the near end of the corridor we draw, and the far wall
      const rect = s => [pt(R0[0], R0[1], s), pt(R0[2], R0[1], s), pt(R0[2], R0[3], s), pt(R0[0], R0[3], s)];
      const A = rect(sN), B = rect(sF), poly = q => 'M' + q.map(p => n(p[0]) + ' ' + n(p[1])).join('L') + 'Z';
      const svg = one(cam, '.fx13-sv'), ws = svg.querySelectorAll('.w');
      [[0, 1], [3, 0], [1, 2], [2, 3]].forEach(([i, j], k) => ws[k].setAttribute('d', poly([A[i], A[j], B[j], B[i]])));   // ceiling, left, right, floor
      // grid: rings at even depth steps (their spacing is what the dolly warps), and lines running down the walls to the far wall
      let g = '';
      for (let i = 1; i < RINGS; i++) { const z = i / RINGS, s = c.s(z); if (s && z >= zN) g += poly(rect(s)); }
      const along = (x, y) => { const p = pt(x, y, sN), q = pt(x, y, sF); g += `M${n(p[0])} ${n(p[1])}L${n(q[0])} ${n(q[1])}`; };
      for (let i = 1; i < NW; i++) { const x = mix(R0[0], R0[2], i / NW); along(x, R0[1]); along(x, R0[3]); }
      for (let i = 1; i < NH; i++) { const y = mix(R0[1], R0[3], i / NH); along(R0[0], y); along(R0[2], y); }
      const gp = svg.querySelector('.g'); gp.setAttribute('d', g); gp.setAttribute('stroke-width', (1.3 / S).toFixed(3));
      const bw = svg.querySelector('.bw'), b0 = B[0], b2 = B[2];
      Object.entries({ x: n(b0[0]), y: n(b0[1]), width: n(b2[0] - b0[0]), height: n(b2[1] - b0[1]), rx: n(Z.r * sF / S) }).forEach(([k, v]) => bw.setAttribute(k, v));
      const rim = one(cam, '.fx13-rm .rim');
      Object.entries({ x: n(b0[0]), y: n(b0[1]), width: n(b2[0] - b0[0]), height: n(b2[1] - b0[1]), rx: n(Z.r * sF / S), 'stroke-width': (1.5 / S).toFixed(3) }).forEach(([k, v]) => rim.setAttribute(k, v));
      rim.style.opacity = (P(t, .2, .2) * (1 - P(t, T.dive[0] + .12, .14))).toFixed(3);
      // him: steps back, then holds his size through the dolly; on the fly-in he is nearest, so he grows fastest and leaves through the bottom
      const k = mix(1, K, ez(P(t, ...T.step))), e = ez(P(t, ...T.step)), ex = mix(E0[0], E1[0], e), ey = mix(E0[1], E1[1], e), s0z = c.s(0);
      const hm = one(cam, '.fx13-him');
      if (!s0z || s0z > 8) hm.style.display = 'none';
      else { hm.style.display = 'block';
        hm.style.transform = `translate(${VP[0]}px,${VP[1]}px) scale(${(s0z / S).toFixed(5)}) translate(${-VP[0]}px,${-VP[1]}px) translate(${ex.toFixed(2)}px,${ey.toFixed(2)}px) scale(${k.toFixed(5)}) translate(${-E0[0]}px,${-E0[1]}px)`;
      }
      one(cam, '.fx13-room').style.opacity = (1 - P(t, ...T.room)).toFixed(3);
    },
    win: () => { const w = Z.w * sEnd, h = Z.h * sEnd; return { c: [VP[0] + (ZC[0] - VP[0]) * sEnd, VP[1] + (ZC[1] - VP[1]) * sEnd], w, h, rr: Z.r * sEnd }; },
    winIn: t => P(t, ...T.win),
  };
  FX[13] = VT;
})();
