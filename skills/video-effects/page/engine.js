// Video effects engine. Shared by all 20 effects in fx/. One effect plays on your clip inside a MOTION ZONE (here: the whole frame).
// Each scene is drawn in zone coordinates (0..Z.w, 0..Z.h). It ends by diving into a WINDOW that already shows the next scene
// (your clip again), live. At the hand-off the window fills the zone at identity, so the swap is invisible.
// Pure: seek(el, T) sets every property it touches from T alone, so a still, a check and the render always agree.
// SETUP is written by run.cjs: { n, at, len, D, words, stage, stills, engine }.
const SETUP = window.SETUP || { n: 1, at: .5, len: 1.03, D: 3 };   // opened by hand: Grid Dive with no footage (a load check only)
window.REEL = { layout: 'none', stage: SETUP.stage || 'white', cut: 'F' };   // cut 'F' = the single-effect behaviour: no push before an effect, one face at a time
const V = 'B';   // B = the zone is the whole frame (effects on you, full screen)
const ST = SETUP.stage || 'white';   // white = light studio stages, blue = navy floor and bright blue grid
const T1 = (SETUP.stills || 'stills') + '/', SUN = (SETUP.engine || '.') + '/claude-ai-symbol.svg';   // stills/ = frames of your clip, made by prep.py
const esc = x => String(x).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const SAY = d => esc(SETUP.words || d);   // the optional words an effect shows (--words), or its default
const cl = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const P = (t, a, d) => cl((t - a) / d);
const mix = (a, b, p) => a + (b - a) * p;
const q = (el, s) => el.querySelector(s), qa = (el, s) => [...el.querySelectorAll(s)];
const eio = p => p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
const ez = (() => { const B = (a, b, s) => 3 * (1 - s) * (1 - s) * s * a + 3 * (1 - s) * s * s * b + s * s * s;   // cubic-bezier(.23,1,.32,1)
  return p => { if (p <= 0) return 0; if (p >= 1) return 1; let lo = 0, hi = 1, s = p; for (let i = 0; i < 24; i++) { s = (lo + hi) / 2; if (B(.23, .32, s) < p) lo = s; else hi = s; } return B(1, 1, s); }; })();
const NAMES = ['Grid Dive', 'Title Orbit', 'Magnifying Lens', 'Portal', 'Clone Room', 'Infinite Zoom', 'Cube Spin', 'Liquid Glass', 'Screen in Screen', 'Frame Break',
  'Tile Tunnel', 'Depth UI', 'Vertigo', 'Phone Fan', 'Shatter', 'Spotlight', 'Pull-Back Reveal', 'Ribbon Wrap', 'Zoom-Through', 'Head Pop Out'];

// ---- the motion zone
const Z = V === 'A' ? { x: 74, y: 844, w: 932, h: 876, r: 40 } : V === 'L' ? { x: 450, y: 400, w: 522, h: 1380, r: 36 } : { x: 0, y: 0, w: 1080, h: 1920, r: 0 };
const ZC = [Z.w / 2, Z.h / 2], ZD = Math.hypot(Z.w / 2, Z.h / 2);

// ---- the stage (v1 backgrounds): 'blue' = bright blue with the blueprint grid, 'floor' = dark navy with the blue perspective grid floor
const STAGE = ST === 'blue' ? {
  blue: `<div class="L" style="background:radial-gradient(ellipse 80% 55% at 540px 1100px,#3B8CFF,#0071E3 50%,#00408A)"></div><div class="L bluegrid"></div>`,
  floor: `<div class="L" style="background:radial-gradient(ellipse 70% 45% at 540px 1180px,#123a7a,#0b0f17 70%)"></div><div class="L" style="perspective:700px;perspective-origin:540px 900px"><div class="floor"></div></div><div class="L" style="background:radial-gradient(circle at 540px 1150px,rgba(90,176,255,.45),rgba(90,176,255,0) 420px)"></div>`,
} : ST === 'grey' ? {   // light grey: the white stages one step down, so the white hook card and list panel stand off it
  blue: `<div class="L" style="background:linear-gradient(180deg,#eceef1,#e1e5ea 60%,#d6dbe2)"></div><div class="L wgrid"></div>`,
  floor: `<div class="L" style="background:radial-gradient(ellipse 80% 55% at 540px 1150px,#eef0f3,#dde1e7 60%,#d2d8e0)"></div><div class="L" style="perspective:700px;perspective-origin:540px 900px"><div class="floor wf"></div></div>`,
} : {   // white: the v2 studio (white to cool grey, soft key top left) and a light floor with a faint blue perspective grid
  blue: `<div class="L" style="background:linear-gradient(180deg,#ffffff,#f3f5f8 60%,#e9edf2)"></div><div class="L wgrid"></div><div class="L" style="background:radial-gradient(circle at 260px 260px,rgba(255,255,255,.95),rgba(255,255,255,0) 640px)"></div>`,
  floor: `<div class="L" style="background:radial-gradient(ellipse 80% 55% at 540px 1150px,#ffffff,#eef1f5 60%,#e3e8ef)"></div><div class="L" style="perspective:700px;perspective-origin:540px 900px"><div class="floor wf"></div></div>`,
};
const EDGE = ST === 'blue' ? { blue: '#00408A', floor: '#0b0f17' } : ST === 'grey' ? { blue: '#d6dbe2', floor: '#d2d8e0' } : { blue: '#e9edf2', floor: '#e3e8ef' };
// the stage carried on far past the zone, so a window that is still filling never shows the outer scene round the next one's edges
const ebx = kind => `<div class="ebx" style="left:-2000px;top:-2000px;width:${Z.w + 4000}px;height:${Z.h + 4000}px;background-color:${EDGE[kind]};${kind === 'blue' ? `background-position:${2000 - Z.x}px ${2000 - Z.y}px` : ''}"${kind === 'blue' ? ' data-g="1"' : ''}></div>`;
const stageZ = kind => `<div class="stz" style="left:${-Z.x}px;top:${-Z.y}px">${STAGE[kind]}</div>`;   // the frame stage, in zone coordinates

// ---- you. Every frame is 1080x1920. prep.py scales and places your clip so your head sits where this geometry expects it.
const PG = { crown: 404, brow: 720, eye: 772, mouth: 966, chin: 1130 };
const EB = '.39,.386,.61,.513';   // eyes-to-mouth box as fractions of the frame (x0,y0,x1,y1)
const img = (file, cx, eyeY, s, cls, extra = '') => `<img decoding="sync" class="${cls}" data-eb="${EB}" data-k="${file.startsWith('cut') ? 'c' : 'p'}" src="${T1}${file}" style="position:absolute;left:${(cx - 540 * s).toFixed(1)}px;top:${(eyeY - PG.eye * s).toFixed(1)}px;width:${(1080 * s).toFixed(1)}px;height:${(1920 * s).toFixed(1)}px;${extra}">`;
const plate = (t, cx, eyeY, s, cls, extra) => img(`plate${t}.jpg`, cx, eyeY, s, cls, extra);
const cut = (t, cx, eyeY, s, cls, extra) => img(`cut${t}.png`, cx, eyeY, s, cls, extra);
// smallest scale that still covers a w x h box with the eyes at 40% of its height
const coverS = (w, h, ey = .4) => Math.max(w / 1080, ey * h / PG.eye, (1 - ey) * h / (1920 - PG.eye));
// his talking head fills the zone. A: the zone is the face card (932x876, eyes at 43%). B: the plate fills the frame, eyes at y620.
const BEYE = V !== 'B' ? .43 * Z.h : 620, BS = V !== 'B' ? coverS(Z.w, Z.h, .43) : 1.14;
function card(b, t, cls) { const s = coverS(b.w, b.h); return `<div class="card" style="left:${b.x}px;top:${b.y}px;width:${b.w}px;height:${b.h}px">${plate(t, b.w / 2, b.h * .4, s, cls)}</div>`; }
const himView = (t, cls) => plate(t, Z.w / 2, BEYE, BS, cls);   // his talking head filling the zone (the hand-off state between effects)
const cutView = (t, cls) => V !== 'B' ? cut(t, Z.w / 2, .5 * Z.h, .62, cls) : cut(t, Z.w / 2, 760, .75, cls);   // his cut-out standing on the stage

// ---- camera: scale S about anchor a (zone coords), with a carried to zone point f
const camT = (a, f, S) => `translate(${f[0].toFixed(2)}px,${f[1].toFixed(2)}px) scale(${S.toFixed(5)}) translate(${-a[0].toFixed(2)}px,${-a[1].toFixed(2)}px)`;
// a whole zone scene placed inside a window centred c, so that camT(c, ZC, Send) shows it at identity
const embT = (c, Send) => `translate(${c[0].toFixed(2)}px,${c[1].toFixed(2)}px) scale(${(1 / Send).toFixed(6)}) translate(${-ZC[0]}px,${-ZC[1]}px)`;
const SLOT = '<!--slot-->';
// elements of THIS scene only (never the next scene playing inside its window)
const own = (cam, sel) => qa(cam, sel).filter(e => e.closest('.cam') === cam);
const one = (cam, sel) => own(cam, sel)[0];
const mbDef = id => `<svg class="mbs" width="0" height="0" style="position:absolute"><filter id="${id}" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="0 0"/></filter></svg>`;

// ---- scene DOM. inner = drawn inside another scene's window: no window of its own (one level of nesting).
function sceneDOM(s, next, id, inner) {
  const emb = inner || !next ? '' : `<div class="Z emb"><div class="Z ebg">${ebx(next.bg)}${stageZ(next.bg)}</div>${sceneDOM(next, null, id + 'n', true)}</div>`;
  return `<div class="Z cam">${s.html(id, inner).replace(SLOT, emb)}</div>`;
}
const FACEF = ((window.REEL || {}).cut || '') === 'F';
// Feed cut F seams (21/10/2026): every F effect starts and ends on himView.
// edgeE = 1 at a beat's edges, 0 in its middle (tin/tout: the morph lengths). edgeCam maps a view of him (eye ex,ey at plate scale s) onto himView.
const edgeE = (t, d, tin, tout) => Math.max(tin ? 1 - eio(P(t, 0, tin)) : 0, tout ? eio(P(t, d - tout, tout)) : 0);
const edgeCam = (e, ex, ey, s) => e > 0.0005 ? { a: [ex, ey], f: [mix(ex, Z.w / 2, e), mix(ey, BEYE, e)], S: Math.pow(BS / s, e) } : null;
// hvBox: the transform that moves himView (eye Z.w/2,BEYE, scale BS) to eye (ex,ey) at scale s, for a wrapper holding himView
const hvT = (ex, ey, s) => camT([Z.w / 2, BEYE], [ex, ey], s / BS);
function runScene(s, root, t, d, next) {
  const cam = root.querySelector(':scope > .cam');
  // Feed cut F (21/10/2026 00:20): no dive that crops his face. Any camera push in (S > 1) is dropped
  // on the effects that opt in (noDive): Title Orbit, Lens, Ribbon. Every other camera plays as at 20:36.
  const c0 = s.camera ? s.camera(t, d) : null, c = FACEF && s.noDive && c0 && c0.S > 1.001 ? null : c0;
  cam.style.transformOrigin = '0 0'; cam.style.transform = c ? camT(c.a, c.f, c.S) : 'none';
  s.seek(cam, t, d);
  const emb = one(cam, '.emb');
  // Feed cut F (20/10/2026 23:40): every effect moves exactly as at 20:36.
  // Only the hand-off changes: while a view of him is on the card, the next shot waits and dissolves in over the last 4 frames
  // to the seam (no double head, no one-frame pop). When the effect itself has hidden him, the next shot shows as designed.
  const faces = FACEF && next && s.seq !== false && s.Send !== 1 ? own(cam, 'img[data-eb]').filter(m => !m.closest('[data-noface]')) : [];
  const vis = m => { const r = m.getBoundingClientRect(); if (r.width < 2) return false; let o = 1; for (let e = m; e && e !== cam; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden') return false; o *= +cs.opacity; } return o > .05; };
  if (emb && next) {
    // F (opt-in fullWin): the hand-off is the next effect at full card, dissolving in over the last 2 frames (no window, no early ring, no ghost dive)
    const FW = FACEF && !!s.fullWin, W = FW ? { c: ZC, w: Z.w, h: Z.h, rr: 0 } : s.win(t, d), Se = FW ? 1 : s.Send;
    emb.style.transformOrigin = '0 0'; emb.style.transform = FW && c ? camT(c.f, c.a, 1 / c.S) : embT(W.c, Se);   // F full-card hand-off: undo this scene's camera, so the next scene sits at identity
    emb.style.clipPath = W.r != null ? `circle(${(W.r * Se).toFixed(1)}px at ${ZC[0]}px ${ZC[1]}px)`
      : `inset(${(ZC[1] - W.h * Se / 2).toFixed(1)}px ${(ZC[0] - W.w * Se / 2).toFixed(1)}px ${(ZC[1] - W.h * Se / 2).toFixed(1)}px ${(ZC[0] - W.w * Se / 2).toFixed(1)}px round ${((W.rr || 0) * Se).toFixed(1)}px)`;
    const wi = FW ? cl((t - (d - .067)) / .067) : s.winIn ? s.winIn(t, d) : 1, o = faces.some(vis) && s.dissolve !== false ? Math.min(wi, cl((t - (d - .133)) / .133)) : wi; emb.style.opacity = o.toFixed(3); emb.style.visibility = o > 0 ? 'visible' : 'hidden';
    if (o > 0) runScene(next, emb, t - d, next.d || d, null);
  }
}

// ---- the still for effect i (1-based). PT(own effect) = your frame 0.3s into the effect. Any other i = another frame of your
// clip (grid tiles, clones, thumbnails), so every copy of you is a different moment. Thumbs: add 's'. prep.py writes the files.
const PT = i => i === SETUP.n ? 'e' : 'k' + ((i - (SETUP.n || 1) + 20) % 20);
const FX = [];   // FX[i] = the scene object of effect i (1-based), registered by fx/NN-name.js
