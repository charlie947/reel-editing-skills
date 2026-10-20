// Effect 05 Clone Room: a corridor of copies of him steps out behind him, into his own room. The room and the bottom of the frame stay live footage throughout.
(() => {
  // a corridor of clones behind him, receding upward and alternating sides; the farthest first so nearer ones stand in front
  const PW = 1080 * BS, OFF = [-.08, .08, -.22, .22, -.36, .36], SC = [.54, .54, .66, .66, .82, .82], LIFT = [450, 450, 330, 330, 170, 170], CT = [PT(1), PT(3), PT(8), PT(9), PT(6), PT(4)];
  const FADE = 'mask-image:linear-gradient(#000 58%,transparent 80%);-webkit-mask-image:linear-gradient(#000 58%,transparent 80%)';   // clones melt into the room below the chest (room shows through, never white)
  // absolute seconds (the beat is ~1.1s): clones step out 0.1-0.42, hold, step back in over the last 0.44s
  const TM = d => { const dv = Math.max(.62, d - .44); return { dv, dl: d - .1 - dv }; };   // the return ends 0.1s before the cut, then the next shot fades in over him
  FX[5] = {
    name: NAMES[4], row: 4, bg: 'blue', Send: 1,
    html() { const cl = OFF.map((o, i) => `<div class="fx5c" data-i="${i}">${cut(CT[i], 0, 0, BS * SC[i], 'deco', FADE)}</div>`).join('');
      return `<style>.fx5c{position:absolute;left:0;top:0;width:0;height:0}</style>
        ${himView(PT(5), 'me')}<div class="Z fx5w">${cl}${cut(PT(5), Z.w / 2, BEYE, BS, 'me')}</div>${SLOT}`; },   // room plate, clones, then his own cut-out on top
    camera: () => null,   // no pull-back: the room plate must fill the card the whole time
    seek(cam, t, d) { const { dv, dl } = TM(d), step = eio(P(t, .1, .32)) * (1 - eio(P(t, dv, dl)));
            own(cam, '.fx5c').forEach(c => { const i = +c.dataset.i, x = ZC[0] + OFF[i] * PW * step, lift = LIFT[i] * BS / .769;
        c.style.transform = `translate(${x.toFixed(1)}px,${(BEYE - lift).toFixed(1)}px)`; c.style.opacity = (P(t, .06, .14) * (1 - P(t, dv + .5 * dl, .4 * dl))).toFixed(3); }); },
    win(t, d) { return { c: ZC, w: Z.w, h: Z.h, rr: 0 }; },
    winIn: (t, d) => P(t, d - .1, .09),
  };
})();
