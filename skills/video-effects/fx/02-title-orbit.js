// Effect 02
// ---------------- 2 Title Orbit: the title rings his head on the dark grid floor. The O drops out of the ring beside him, and we go through it.
const O = (() => { const s = V !== 'B' ? .62 : .75, cx = Z.w / 2, eye = V !== 'B' ? .5 * Z.h : 760, crown = eye - (PG.eye - PG.crown) * s, font = V !== 'B' ? 60 : 80, rx = 3.9 * font;
  return { s, cx, eye, crown, rx, ry: rx * .13, cy: crown + 6, font, sp: .7 * font, park: V !== 'B' ? [Z.w * .79, eye + 20] : [850, 780], Ro: V !== 'B' ? 84 : 110 }; })();
O.ri = O.Ro * .8;
// the words (--words, up to 12 characters). The ring drops the O out, or the letter right of centre if there is no O.
const WORD = SAY('TITLE ORBIT').replace(/&[a-z]+;/g, '').toUpperCase().slice(0, 12), WC = (WORD.length - 1) / 2;
const OI = (() => { const o = [...WORD].map((c, i) => c === 'O' ? i : -1).filter(i => i >= 0); return o.length ? o.sort((a, b) => Math.abs(a - WC) - Math.abs(b - WC))[0] : Math.ceil(WC); })();
// at rest the letters sit evenly spaced across the front of the ring (readable), while spinning they turn as one rigid ring
const BASE = [...WORD].map((_, i) => Math.acos((i - WC) * O.sp / O.rx) * 180 / Math.PI);
// absolute seconds (the beat is ~1.2s): the words read at rest 0-0.5s, one spin, the O drops out, dive through it over the rest. K here is the time left after the read.
const OT = K => { const rem = Math.max(.45, 2 * K - .5); return { spin: [.5, .45 * rem], drop: .5 + .45 * rem, dropL: .25 * rem, dive: .5 + .6 * rem }; };
const orbPhi = (t, K) => -360 * eio(P(t, OT(K).spin[0], OT(K).spin[1]));
const orbTilt = (t, K) => -8 * eio(P(t, .15, .35)) * Math.PI / 180;
const letterAt = (i, phi, tl) => { const a = (BASE[i] + phi) * Math.PI / 180, s = Math.sin(a), x = O.rx * Math.cos(a), y = O.ry * s, c = Math.cos(tl), si = Math.sin(tl);
  return { X: O.cx + x * c - y * si, Y: O.cy + x * si + y * c, s }; };
function ringPts(tl, a0, a1) { let s = ''; for (let a = a0; a <= a1; a += 4) { const r = a * Math.PI / 180, x = O.rx * Math.cos(r), y = O.ry * Math.sin(r), c = Math.cos(tl), si = Math.sin(tl); s += `${(O.cx + x * c - y * si).toFixed(1)},${(O.cy + x * si + y * c).toFixed(1)} `; } return s; }
const oState = (t, K) => { const tD = OT(K).drop, f = O.font, L = letterAt(OI, orbPhi(tD, K), orbTilt(tD, K)), e = ez(P(t, tD, OT(K).dropL));
  const R = mix(f * .34, O.Ro, e); return { on: t >= tD, c: [mix(L.X, O.park[0], e), mix(L.Y - .14 * f, O.park[1], e)], R, sw: mix(f * .15, O.Ro * .2, e) }; };
const ORBIT = {
  name: 'Title Orbit', row: 1, bg: 'floor', Send: .7 * Z.w / O.ri,   // the O shows 70% of the next shot's width
  // window radius: the O, then it opens out to cover the zone by the hand-off, so no stage or rim shows at its edge
  wr(t, d) { const K = d / 2, os = oState(t, K), dv = OT(K).dive, dl = d - dv; return mix(Math.max(0, os.R - os.sw), 1.02 * ZD / this.Send, ez(P(t, dv, .75 * dl))); },
  html(id) { const sp = cls => [...WORD].map((ch, i) => `<span class="ol ${cls}" data-i="${i}" style="font-size:${O.font}px;width:${O.font * .8}px">${ch === ' ' ? '&nbsp;' : ch}</span>`).join('');
    return `${mbDef(id)}<svg class="Z ringB" viewBox="0 0 ${Z.w} ${Z.h}"><polyline fill="none" class="rb" stroke-width="2.5"/></svg>
      <div class="Z" style="filter:url(#${id}) blur(1.2px)">${sp('ob')}</div>
      ${cutView(PT(2), 'me')}
      <svg class="Z ringF" viewBox="0 0 ${Z.w} ${Z.h}"><polyline fill="none" class="rf" stroke-width="2.5"/></svg>
      <div class="Z" style="filter:url(#${id})">${sp('of')}</div>
      <svg class="Z osv" viewBox="0 0 ${Z.w} ${Z.h}"><circle fill="none"/></svg>${SLOT}`; },
  camera(t, d) { const K = d / 2, dv = OT(K).dive, e = ez(P(t, dv, d - dv)); return e > 0 ? { a: O.park, f: [mix(O.park[0], ZC[0], e), mix(O.park[1], ZC[1], e)], S: Math.pow(this.Send, e) } : null; },
  seek(cam, t, d) { const K = d / 2, phi = orbPhi(t, K), tl = orbTilt(t, K), os = oState(t, K);
    one(cam, '.ringB polyline').setAttribute('points', ringPts(tl, 180, 360)); one(cam, '.ringF polyline').setAttribute('points', ringPts(tl, 0, 180));
    const B = own(cam, '.ob'), Fr = own(cam, '.of');
    for (let i = 0; i < B.length; i++) { const L = letterAt(i, phi, tl), sc = .72 + .28 * (L.s + 1) / 2;
      B[i].style.transform = Fr[i].style.transform = `translate(${(L.X - O.font * .4).toFixed(1)}px,${(L.Y - O.font * .6).toFixed(1)}px) scale(${sc.toFixed(3)})`;
      const hide = i === OI && os.on; B[i].style.opacity = !hide && L.s <= 0 ? .5 : 0; Fr[i].style.opacity = !hide && L.s > 0 ? 1 : 0; }
    const c = one(cam, '.osv circle'); c.setAttribute('cx', os.c[0].toFixed(1)); c.setAttribute('cy', os.c[1].toFixed(1)); c.setAttribute('r', (os.R - os.sw / 2).toFixed(2));
    c.setAttribute('stroke-width', os.sw.toFixed(2)); one(cam, '.osv').style.opacity = os.on ? (1 - P(t, OT(K).dive - .04, .06)).toFixed(3) : 0;   // the white ring clears as we go through, so no white sweeps the frame
    const v = Math.abs(orbPhi(t, K) - orbPhi(t - 1 / 30, K)) * Math.PI / 180 * O.rx * .3;
    one(cam, '.mbs feGaussianBlur').setAttribute('stdDeviation', `${cl(v, 0, 14).toFixed(2)} 0`); },
  win(t, d) { return { c: oState(t, d / 2).c, r: this.wr(t, d) }; },
  winIn: (t, d) => P(t, OT(d / 2).drop + .02, .08),
};

FX[2] = ORBIT;
// Feed cut F (21/10/2026). Review fix: no dropped O ring and no dive into the face. The O stays in the word.
// Seamless: over the last 0.32s the camera rises from his cut-out on the floor to himView while his room fades in behind him and the
// title lifts away, so the Lens beat starts on the exact frame this one ends on.
if (FACEF) { const sk = FX[2].seek, hk = FX[2].html, TOUT = .32, TIN = SETUP.n === 2 ? .32 : 0, CY = V !== 'B' ? .5 * Z.h : 760, CS = V !== 'B' ? .62 : .75;   // cutView's eye and scale for this layout
  Object.assign(FX[2], { fullWin: true,
    html(id, inner) { return hk.call(this, id, inner).replace(`${cutView(PT(2), 'me')}`, `<div class="Z f2room">${plate(PT(2), Z.w / 2, CY, CS, 'me')}</div>${cutView(PT(2), 'me')}`); },
    camera(t, d) { return edgeCam(edgeE(t, d, TIN, TOUT), Z.w / 2, CY, CS); },
    seek(cam, t, d) { sk.call(this, cam, t, d); const e = edgeE(t, d, TIN, TOUT); one(cam, '.osv').style.opacity = 0;
      const K = d / 2, phi = orbPhi(t, K), tl = orbTilt(t, K), L = letterAt(OI, phi, tl), B = own(cam, '.ob'), Fr = own(cam, '.of'); B[OI].style.opacity = L.s <= 0 ? .5 : 0; Fr[OI].style.opacity = L.s > 0 ? 1 : 0;
      one(cam, '.f2room').style.opacity = e.toFixed(3);
      const up = `translateY(${(-160 * e).toFixed(1)}px)`, o = (1 - P(e, 0, .7)).toFixed(3);
      [B[0].parentElement, Fr[0].parentElement, one(cam, '.ringB'), one(cam, '.ringF')].forEach(x => { x.style.transform = up; x.style.opacity = o; }); } }); }
