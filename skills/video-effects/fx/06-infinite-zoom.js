// Effect 06 Infinite Zoom: a framed copy of the empty stage appears beside him, with a frame inside it. We zoom through both into the next effect.
// No copy of the face in the frames (two faces at once reads badly). The next effect fades in late, once the inner frame is big.
(() => {
  const f = V === 'L' ? .26 : .3, w1 = Z.w * f, p = V === 'L' ? [Z.w - w1 - 14, Z.h * .56] : V === 'A' ? [Z.w - w1 - 24, 60] : [1080 - w1 - 40, 380];
  const M = x => [p[0] + f * x[0], p[1] + f * x[1]], FP = [p[0] / (1 - f), p[1] / (1 - f)];   // FP: the fixed point of the copy map, the camera scales about it
  const rect = k => { const s = Math.pow(f, k), o = k === 1 ? p : M(p); return { x: o[0], y: o[1], w: Z.w * s, h: Z.h * s, s }; };
  const R1 = rect(1), R2 = rect(2), BW = 5;
  // absolute seconds (the beat is ~1.2s): the copy appears 0.04-0.28, holds, then one continuous zoom from 0.5s to the end
  const zz = (t, d) => eio(P(t, .5, d - .5));
  FX[6] = {
    name: NAMES[5], row: 5, bg: 'floor', Send: 1 / (f * f),
    html() { return `<style>.fx6c{position:absolute;overflow:hidden;background-color:#f3f5f8;background-image:linear-gradient(rgba(29,29,31,.06) 2px,transparent 2px),linear-gradient(90deg,rgba(29,29,31,.06) 2px,transparent 2px);background-size:${(90 * f).toFixed(1)}px ${(90 * f).toFixed(1)}px}
        .f[data-s=blue] .fx6c{background-color:#0b3a7a;background-image:linear-gradient(rgba(255,255,255,.08) 2px,transparent 2px),linear-gradient(90deg,rgba(255,255,255,.08) 2px,transparent 2px)}
        .fx6b{position:absolute;outline:${BW}px solid #fff;box-shadow:0 18px 40px -10px rgba(0,19,47,.38)}
        .fx6b2{position:absolute;outline:${(BW * f).toFixed(2)}px solid #fff}</style>
      ${himView(PT(6), 'me')}
      <div class="fx6k"><div class="fx6b" style="left:${R1.x}px;top:${R1.y}px;width:${R1.w}px;height:${R1.h}px"></div>
        <div class="fx6c" style="left:${R1.x}px;top:${R1.y}px;width:${R1.w}px;height:${R1.h}px"></div>
        <div class="fx6b2" style="left:${R2.x}px;top:${R2.y}px;width:${R2.w}px;height:${R2.h}px"></div></div>${SLOT}`; },
    camera(t, d) { const z = zz(t, d); return z > 0 ? { a: FP, f: FP, S: Math.pow(this.Send, z) } : null; },
    seek(cam, t, d) { const a = ez(P(t, .04, .24)), k = one(cam, '.fx6k'), s = mix(.9, 1, a), c = [R1.x + R1.w / 2, R1.y + R1.h / 2];
      k.style.transformOrigin = `${c[0]}px ${c[1]}px`; k.style.transform = zz(t, d) > 0 ? 'none' : `scale(${s.toFixed(4)})`; k.style.opacity = a.toFixed(3); },
    win() { return { c: [R2.x + R2.w / 2, R2.y + R2.h / 2], w: R2.w, h: R2.h, rr: 0 }; },
    winIn: (t, d) => ez(P(t, .5 + .45 * (d - .5), .25 * (d - .5))),   // late: only once the zoom has made the inner frame big
  };
})();
