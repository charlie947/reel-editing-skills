// Effect 16
// ---------------- 16 Spotlight: the card goes dark and one hard-edged theatre light finds his face, holds, then opens up
// while the camera pushes into the light. The push lands on a close-up of him, which is where Pull-Back Reveal starts.
FX[16] = (() => {
  const F = [Z.w / 2, BEYE + (PG.mouth - PG.eye) * BS * .45];   // the face, between the eyes and the mouth (shared with 17)
  const R = (PG.chin - PG.crown) * BS * .62;                     // the pool: the whole head and a little shoulder
  const P0 = [F[0] - .78 * R, F[1] - .62 * R];                   // where the light starts: its edge already on his cheek
  const SE = (window.REEL || {}).cut === 'F' ? 1 : 1.25;   // F: no push onto the face. A/B keep 1.25. 17 opens at the same size                                               // the push into the light (17 opens at this close-up)
  const TF = .22, TO = .7;                                       // finds him by 0.22s, holds 0.48s, then opens
  const pool = (t, d) => { const u = ez(P(t, 0, TF)), o = eio(P(t, TO, Math.max(.2, d - .2 - TO))); return { c: [mix(P0[0], F[0], u), mix(P0[1], F[1], u)], r: mix(R, ZD * 2.4, o * o), dk: 1 - o }; };
  return {
    name: NAMES[15], row: 15, bg: 'floor', Send: SE,
    html(id) {
      return `<style>
        .fx16 .dk{--dk:17,18,21}.f[data-s=blue] .fx16 .dk{--dk:3,9,22}
        .fx16 .bm{mix-blend-mode:screen}.fx16 .bm polygon{fill:rgba(255,255,255,.075)}
      </style><div class="Z fx16">${himView(PT(16), 'me')}<div class="Z dk"></div>
        <svg class="Z bm" viewBox="0 0 ${Z.w} ${Z.h}"><defs><filter id="${id}b" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="18"/></filter></defs><polygon filter="url(#${id}b)"/></svg>${SLOT}</div>`;
    },
    // F: no push and no pan (SE 1), so his face hands to 17 in the same place
    camera(t, d) { if (SE === 1) return null; const e = eio(P(t, TO, d - .03 - TO)); return e > 0 ? { a: F, f: [mix(F[0], ZC[0], e), mix(F[1], ZC[1], e)], S: Math.pow(SE, e) } : null; },
    seek(cam, t, d) {
      const p = pool(t, d), a = .93 * p.dk, soft = p.r * .7;
      one(cam, '.dk').style.background = `radial-gradient(circle ${p.r.toFixed(1)}px at ${p.c[0].toFixed(1)}px ${p.c[1].toFixed(1)}px,rgba(var(--dk),0) 0px,rgba(var(--dk),0) ${soft.toFixed(1)}px,rgba(var(--dk),${(a * .55).toFixed(3)}) ${(p.r * .9).toFixed(1)}px,rgba(var(--dk),${a.toFixed(3)}) ${p.r.toFixed(1)}px)`;
      // the beam: a faint shaft from a lamp above the card down to the pool, gone as the light opens
      const src = [p.c[0] - .35 * Z.w, -.25 * Z.h], ang = Math.atan2(p.c[1] - src[1], p.c[0] - src[0]), nx = -Math.sin(ang), ny = Math.cos(ang), w = p.r * .62, ux = Math.cos(ang), uy = Math.sin(ang), E = [p.c[0] - ux * p.r * .95, p.c[1] - uy * p.r * .95];   // the shaft stops where it meets the pool, above his head
      one(cam, '.bm polygon').setAttribute('points', `${(src[0] - nx * 14).toFixed(1)},${(src[1] - ny * 14).toFixed(1)} ${(src[0] + nx * 14).toFixed(1)},${(src[1] + ny * 14).toFixed(1)} ${(E[0] + nx * w).toFixed(1)},${(E[1] + ny * w).toFixed(1)} ${(E[0] - nx * w).toFixed(1)},${(E[1] - ny * w).toFixed(1)}`);
      one(cam, '.bm').style.opacity = (p.dk * (1 - P(t, TO, .15))).toFixed(3);
    },
    win: () => ({ c: SE === 1 ? ZC : F, w: Z.w / SE, h: Z.h / SE, rr: 0 }),   // F: no push, so the window is the zone itself and 17 opens exactly on him
    winIn: (t, d) => P(t, d - .17, .12),
  };
})();
