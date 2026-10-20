// Effect 03
// ---------------- 3 Magnifying Lens: a glass disc glides in over his chest and magnifies what is under it (1.4x, never his face). Then it opens out
// gently into the next effect. A loupe on the eyes reads as a second head, so the glass stays on the chest.
const LZ = V === 'L' ? { r: .33 * Z.w, c: [Z.w - 36 - .33 * Z.w, .8 * Z.h] } : V === 'A' ? { r: 175, c: [Z.w - 60 - 175, .74 * Z.h] } : { r: 230, c: [740, 1330] };
const LMAG = 1.4;   // a gentle loupe: his chest under the glass at 1.4x, never his face
const LEYE = [Z.w / 2 + 22 * BS, BEYE + 300 * BS];   // the copy scales about his chin: its (hidden) face stays over his real face, and the glass shows only his chest at 1.4x
const LIN = .88;
const lensAt = (t, K) => { const u = ez(P(t, .04, .46)), p0 = [Z.w + LZ.r + 60, Z.h * .95], m = [Z.w + 20, LZ.c[1] + LZ.r]; return [(1 - u) * (1 - u) * p0[0] + 2 * (1 - u) * u * m[0] + u * u * LZ.c[0], (1 - u) * (1 - u) * p0[1] + 2 * (1 - u) * u * m[1] + u * u * LZ.c[1]]; };
const lensDv = K => Math.max(.85, 2 * K - .5);   // absolute: glide in by 0.5s, hold, dive over the last 0.5s
const lensZ = (t, K) => ez(P(t, lensDv(K), 2 * K - lensDv(K)));
const lensHim = cls => plate(PT(3), Z.w / 2, BEYE, BS, cls);
const LENS = {
  name: 'Magnifying Lens', row: 2, bg: 'blue', Send: .35 * Z.w / (LZ.r * LIN),   // half the old push (1.2x in V1, was 2.4x): the lens opens out gently instead of diving hard at his face
  // window radius: the lens, then it opens out to cover the zone by the hand-off
  wr(t, d) { const K = d / 2, dv = lensDv(K), dl = 2 * K - dv; return mix(LZ.r * LIN, 1.02 * ZD / this.Send, ez(P(t, dv + .05 * dl, .8 * dl))); },
  html() { return `<div class="Z body">${lensHim('me')}</div><div class="Z lensIn"><div class="Z mag" data-noface="1">${lensHim('me')}</div>${SLOT}</div><div class="lensG"></div><div class="lensR"></div>`; },
  camera(t, d) { const z = lensZ(t, d / 2); return z > 0 ? { a: LZ.c, f: [mix(LZ.c[0], ZC[0], z), mix(LZ.c[1], ZC[1], z)], S: Math.pow(this.Send, z) } : null; },
  seek(cam, t, d) { const K = d / 2, z = lensZ(t, K), L = lensAt(t, K), r = LZ.r, band = 1 - P(t, lensDv(K), .15);
    const li = one(cam, '.lensIn'); li.style.clipPath = `circle(${Math.max(r, this.wr(t, d) + 2).toFixed(1)}px at ${L[0].toFixed(1)}px ${L[1].toFixed(1)}px)`;
    const mg = one(cam, '.mag'); mg.style.transformOrigin = '0 0'; mg.style.transform = `translate(${LEYE[0].toFixed(1)}px,${LEYE[1].toFixed(1)}px) scale(${LMAG}) translate(${(-LEYE[0]).toFixed(1)}px,${(-LEYE[1]).toFixed(1)}px)`; mg.style.opacity = (1 - P(t, lensDv(K) - .04, .06)).toFixed(3);   // gone before the circle opens out
    const vis = L[0] - r < Z.w;
    ['.lensG', '.lensR'].forEach(s => Object.assign(one(cam, s).style, { display: vis ? 'block' : 'none', left: (L[0] - r).toFixed(1) + 'px', top: (L[1] - r).toFixed(1) + 'px', width: 2 * r + 'px', height: 2 * r + 'px' }));
    li.style.display = vis ? 'block' : 'none';
    one(cam, '.lensG').style.opacity = (1 - P(t, lensDv(K), .15)).toFixed(3); one(cam, '.lensR').style.opacity = band.toFixed(3); },
  win(t, d) { return { c: lensAt(t, d / 2), r: this.wr(t, d) }; },
  winIn: (t, d) => { const dv = lensDv(d / 2), dl = d - dv; return P(t, dv + .3 * dl, .25 * dl); },   // the next effect fades in late, once the circle is wide, so no small second him is held in the glass
};

FX[3] = LENS;

// Feed cut F (20/10/2026 23:38, Charlie 23:34: the grid tiles look "way more premium"): the LinkedIn grid Lens, copied in and
// scaled to the face card. A real magnifying glass (thick graphite rim, handle, highlight) glides in over his chest logo at 2.2x
// and drifts so the magnified detail moves. It never covers his face. Then it opens out into the next effect. A and B unchanged.
if (FACEF) (() => {
  const R = 150, MAG = 2.2, C0 = [350, 1090], TG = [450, 1060];
  const at = t => { const u = ez(P(t, .02, .4)), p0 = [Z.w + R + 120, Z.h + 40], dr = [24 * Math.sin(5.2 * t), 9 * Math.sin(10.4 * t)];
    return [mix(p0[0], C0[0], u) + dr[0], mix(p0[1], C0[1], u) + dr[1]]; };
  const DV = d => Math.max(.8, d - .5), Zf = (t, d) => ez(P(t, DV(d), d - DV(d)));
  FX[3] = Object.assign({}, LENS, {
    Send: .45 * Z.w / R,
    wr(t, d) { const dv = DV(d), dl = d - dv; return mix(R * .9, 1.02 * ZD / this.Send, ez(P(t, dv + .05 * dl, .8 * dl))); },
    html() { return `<style>
      .l3h{position:absolute;width:52px;height:250px;border-radius:26px;transform-origin:26px 0;background:linear-gradient(90deg,#141518,#4b4e55 38%,#24262b 70%,#101113);box-shadow:0 16px 30px -6px rgba(0,19,47,.55)}
      .l3h i{position:absolute;left:4px;right:4px;top:0;height:46px;border-radius:6px;background:linear-gradient(90deg,#7d828b,#d9dce1 40%,#7d828b)}
      .l3s{position:absolute;border-radius:50%;pointer-events:none;background:radial-gradient(ellipse 42% 30% at 28% 20%,rgba(255,255,255,.85),rgba(255,255,255,0) 72%),radial-gradient(ellipse 30% 14% at 72% 86%,rgba(255,255,255,.35),rgba(255,255,255,0) 70%),radial-gradient(circle,rgba(255,255,255,0) 62%,rgba(150,200,255,.22) 100%)}
      .l3r{position:absolute;border-radius:50%;pointer-events:none;box-shadow:inset 0 0 0 3px rgba(255,255,255,.95),inset 0 0 22px 4px rgba(0,19,47,.3),0 0 0 15px #2a2c31,0 0 0 17px #6b6f77,0 0 0 18px rgba(0,0,0,.35),0 24px 44px -6px rgba(0,19,47,.6)}
      </style><div class="Z body">${lensHim('me')}</div><div class="l3h"><i></i></div><div class="Z lensIn"><div class="Z mag" data-noface>${lensHim('me')}</div>${SLOT}</div><div class="l3s"></div><div class="l3r"></div>`; },
    camera(t, d) { const z = Zf(t, d), L = at(t); return z > 0 ? { a: L, f: [mix(L[0], ZC[0], z), mix(L[1], ZC[1], z)], S: Math.pow(this.Send, z) } : null; },
    seek(cam, t, d) { const L = at(t), z = Zf(t, d), band = 1 - P(t, DV(d), .15);
      const li = one(cam, '.lensIn'); li.style.clipPath = `circle(${Math.max(R * .9, this.wr(t, d) + 2).toFixed(1)}px at ${L[0].toFixed(1)}px ${L[1].toFixed(1)}px)`;
      const mg = one(cam, '.mag'); mg.style.transformOrigin = '0 0'; mg.style.transform = `translate(${L[0].toFixed(1)}px,${L[1].toFixed(1)}px) scale(${MAG}) translate(${(-TG[0] - (L[0] - C0[0])).toFixed(1)}px,${(-TG[1] - (L[1] - C0[1])).toFixed(1)}px)`;
      mg.style.opacity = (1 - P(t, DV(d) - .04, .06)).toFixed(3);
      ['.l3s', '.l3r'].forEach(s => Object.assign(one(cam, s).style, { left: (L[0] - R).toFixed(1) + 'px', top: (L[1] - R).toFixed(1) + 'px', width: 2 * R + 'px', height: 2 * R + 'px', opacity: band.toFixed(3) }));
      const a = 42 * Math.PI / 180, rr = R + 14; Object.assign(one(cam, '.l3h').style, { left: (L[0] + rr * Math.cos(a) - 26).toFixed(1) + 'px', top: (L[1] + rr * Math.sin(a)).toFixed(1) + 'px', transform: 'rotate(-48deg)', opacity: band.toFixed(3) }); },
    win(t, d) { return { c: at(t), r: this.wr(t, d) }; },
    winIn: (t, d) => { const dv = DV(d), dl = d - dv; return P(t, dv + .3 * dl, .25 * dl); },
  });
})();
// Feed cut F (21/10/2026, Charlie: "it zooms here, then goes nowhere"): no dive. The beat ends on the magnifier over his chest logo;
// Portal dissolves in over the last 4 frames, so no ring shows early.
if (FACEF) { const sk = FX[3].seek; Object.assign(FX[3], { noDive: true, fullWin: true, seek(cam, t, d) { sk.call(this, cam, t, 99); } }); }   // 99: the rim and the 2.2x logo hold to the last frame
