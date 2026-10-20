// Effect 07 Cube Spin: the shot is the front of a cube. It pulls back a touch and turns a quarter, and the next effect is on the side face.
(() => {
  const W = Z.w, H = Z.h;
  // absolute seconds (the beat is ~1.2s): holds 0-0.4, one quarter turn to 0.08s before the end, lands flat
  const sp = (t, d) => eio(P(t, .4, Math.max(.4, d - .48)));
  FX[7] = {
    name: NAMES[6], row: 6, bg: 'blue', Send: 1,
    html() { return `<style>.fx7p{perspective:${(2.6 * W).toFixed(0)}px;perspective-origin:50% 50%}
        .fx7c{transform-style:preserve-3d;transform-origin:50% 50%}
        .fx7f{position:absolute;left:0;top:0;width:${W}px;height:${H}px;overflow:hidden;backface-visibility:hidden;-webkit-backface-visibility:hidden;transform-origin:50% 50%}
</style>
      <div class="Z fx7p"><div class="Z fx7c">
        <div class="fx7f fx7a" style="transform:translateZ(${W / 2}px)">${himView(PT(7), 'me')}</div>
        <div class="fx7f fx7b" style="transform:rotateY(90deg) translateZ(${W / 2}px)">${SLOT}</div>
      </div></div>`; },
    camera(t, d) { const s = sp(t, d); return s > 0 && s < 1 ? { a: ZC, f: ZC, S: 1 - .3 * Math.sin(Math.PI * s) } : null; },
    seek(cam, t, d) { const s = sp(t, d), th = 90 * s;
      one(cam, '.fx7c').style.transform = `translateZ(${-W / 2}px) rotateY(${(-th).toFixed(3)}deg)`;
      const sh = x => x > .001 ? `brightness(${(1 - .35 * x).toFixed(3)})` : 'none';   // the face turning away darkens (a filter on the face, nothing laid over him)
      one(cam, '.fx7a').style.filter = sh(Math.sin(Math.PI / 2 * s)); one(cam, '.fx7b').style.filter = sh(Math.cos(Math.PI / 2 * s));
      if (FACEF) { one(cam, '.fx7a').style.opacity = s < .5 ? 1 : 0; one(cam, '.fx7b').style.opacity = s < .5 ? 0 : 1; } },   // F: one of him on the cube, a hard swap at 45 degrees (#137/#138)
    win() { return { c: ZC, w: Z.w, h: Z.h, rr: 0 }; },
    winIn: (t, d) => t > .3 ? 1 : 0,
  };
})();
