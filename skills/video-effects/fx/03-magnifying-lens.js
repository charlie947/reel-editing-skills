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
