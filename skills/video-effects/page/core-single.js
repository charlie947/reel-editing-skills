// One effect on your clip. The timeline: your clip as it is until --at, the effect for --len seconds, then your clip again
// (the effect dives into it, so the hand-off is seamless). Head Pop Out is an ending: it holds to the end of the clip.
// seek is a pure function of T (no state carried between calls), so a check, a still and the render always agree.
const N = SETUP.n, AT = SETUP.at || 0, D = SETUP.D;
if (!FX[N]) throw new Error('no effect ' + N);
const EFF = FX[N];
// your clip at its talking-head framing, live, no window of its own
const PLAIN = { name: 'clip', row: -1, bg: EFF.bg, Send: 1, html() { return `${himView(PT(N), 'me')}${SLOT}`; }, camera: () => null, seek() {}, win: () => ({ c: ZC, w: Z.w, h: Z.h, rr: 0 }), winIn: () => 0 };
// these effects open on their own layout (measured: a jump of 15+ grey levels in the first frame), so they dissolve in from
// your plain shot over XF seconds. The rest open on your plain shot already and need nothing.
const XF = SETUP.xf ?? ([11, 12, 13, 16, 19].includes(N) ? .3 : 0);
const END = N === 20 ? D : Math.min(D, AT + SETUP.len);
const SEG = [];
if (AT > 0) SEG.push([PLAIN, 0, AT, null]);
SEG.push([EFF, AT, END, END < D ? PLAIN : null]);
if (END < D) SEG.push([PLAIN, END, D, null]);
let UID = 0;
function build(el) {
  el.className = 'f'; el.dataset.v = V; el.dataset.s = ST === 'blue' ? 'blue' : 'white'; el.dataset.stage = ST; const u = 'z' + (UID++);
  el.style.setProperty('--zw', Z.w + 'px'); el.style.setProperty('--zh', Z.h + 'px');
  el.innerHTML = `<div class="L stage"><div class="L sb">${STAGE.blue}</div><div class="L sf">${STAGE.floor}</div></div>
    <div class="zone" style="left:0;top:0;width:${Z.w}px;height:${Z.h}px">${SEG.map(([s, , , nx], i) => `<div class="Z seg">${sceneDOM(s, nx, u + 's' + i, false)}</div>`).join('')}</div>
    <div class="L grain"></div>`;
}
// The dissolve in from your plain shot never shows two of you: while it runs, the effect starts zoomed so the biggest live view of
// you in it sits exactly where your plain shot has you (same eye point, same size), then eases out to the effect's own framing.
const shown = (m, stop) => { for (let e = m; e && e !== stop; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity < .05) return false; } return true; };
function lineUp(el, g, e) {
  const fr = q(el, '.zone').getBoundingClientRect(), fw = q(el, '.zone').offsetWidth ? fr.width / q(el, '.zone').offsetWidth : 1;
  let best = null;
  qa(g, 'img.me').forEach(m => { const r = m.getBoundingClientRect(); if (r.width > 2 && shown(m, g) && (!best || r.width > best.width)) best = r; });
  if (!best) return;
  const s = best.width / fw / 1080, ex = (best.left - fr.left) / fw + 540 * s, ey = (best.top - fr.top) / fw + PG.eye * s;
  if (Math.abs(s - BS) < .002 && Math.abs(ex - Z.w / 2) < 1 && Math.abs(ey - BEYE) < 1) return;   // already on your plain framing
  g.style.transformOrigin = '0 0'; g.style.transform = camT([ex, ey], [mix(ex, Z.w / 2, e), mix(ey, BEYE, e)], Math.pow(BS / s, e));
}
function seek(el, T) {
  const t = cl(T, 0, D - 1e-4);
  let i = SEG.findIndex(([, a, b]) => t >= a && t < b); if (i < 0) i = SEG.length - 1;
  const [s, a, b, nx] = SEG[i], d = b - a, lt = t - a;
  // most effects open on their own layout, not on your plain shot, so the first XF seconds dissolve from your plain shot into it
  const xf = AT > 0 && s === EFF && lt < .7 * XF ? 1 - eio(lt / (.7 * XF)) : 0, G = qa(el, '.seg');
  G.forEach((g, j) => { g.style.display = j === i || (xf > 0 && j === 0) ? 'block' : 'none'; g.style.opacity = j === 0 && xf > 0 ? xf.toFixed(3) : ''; g.style.zIndex = j === 0 && xf > 0 ? '2' : ''; });
  G[i].style.transform = '';
  runScene(s, G[i], lt, d, nx);
  if (AT > 0 && s === EFF && XF > 0 && lt < 2 * XF) lineUp(el, G[i], 1 - eio(P(lt, .6 * XF, 1.4 * XF)));   // lined up while your plain shot fades, then out to the effect's framing
  if (xf > 0) runScene(PLAIN, G[0], t, AT, null);
  if (window.LIVE) (xf > 0 ? [G[i], G[0]] : [G[i]]).forEach(g => qa(g, 'img.me').forEach(m => { const v = LIVE(m.dataset.k, t); if (m.getAttribute('src') !== v) m.setAttribute('src', v); }));   // every live view of you gets your frame at t (p = full frame, c = cut-out)
  const fl = mix(s.bg === 'floor' ? 1 : 0, nx && nx.bg === 'floor' ? 1 : s.bg === 'floor' ? 1 : 0, eio(P(lt, d - .45, .45)));
  q(el, '.sf').style.opacity = fl.toFixed(3);
  const n = Math.floor(T * 24) % 9; q(el, '.grain').style.backgroundPosition = `${(n * 73) % 200}px ${(n * 131) % 200}px`;
  return { i, t: lt, name: s.name };
}
window.EX = { SEG: SEG.map(([s, a, b]) => [s.name, a, b]), D, Z, V, ST, build, seek, PG, FX };
