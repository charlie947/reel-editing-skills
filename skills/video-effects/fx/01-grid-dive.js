// Effect 01. Shared helpers for every fx file (cutView) live here too.
// Scene contract (zone coordinates, t = seconds from the scene's start, d = its length, K = d/2 so timings stretch with the beat):
//   { name, row, bg:'blue'|'floor', html(id, inner) with SLOT where the next scene shows, camera(t,d)->{a,f,S}|null,
//     seek(cam, t, d) using own()/one(), win(t,d)->{c,r}|{c,w,h,rr}, Send (constant), winIn(t,d)->0..1 (0 at t<0.15s so seams stay exact) }

// ---------------- 1 Grid Dive: his talking head is one tile. Pull back to a wall of tiles on the stage, dive into the next tile.
const G = (() => { const TW = .2 * Z.w, TH = TW * Z.h / Z.w, g = .035 * Z.w; const at = (i, j) => [ZC[0] + i * (TW + g), ZC[1] + j * (TH + g)];
  return { TW, TH, at, Tc: at(0, 0), Th: at(1, 0), S0: Z.w / TW }; })();
const TILE_T = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(j => 'k' + j);   // wall tiles: stills from across your clip (prep.py)
function mini(c, inner, bg, k) { const s = G.TW / Z.w;
  return `<div class="gt${k ? ' ' + k : ''}" style="left:${(c[0] - G.TW / 2).toFixed(1)}px;top:${(c[1] - G.TH / 2).toFixed(1)}px;width:${G.TW.toFixed(1)}px;height:${G.TH.toFixed(1)}px"><div class="Z" style="transform-origin:0 0;transform:scale(${s.toFixed(5)})">${stageZ(bg)}${inner}</div></div>`; }
const GT = (t, d) => { const dv = Math.max(.58, d - .45); return { e1: eio(P(t, .03, .3)), e2: eio(P(t, dv, d - dv)), foc: ez(P(t, .33, .2)) }; };   // absolute seconds: the beat is only ~1.0s
const GRID = {
  name: 'Grid Dive', row: 0, bg: 'blue', Send: G.S0, seq: false,
  html(id, inner) { let h = '';
    for (let j = -3; j <= 3; j++) for (let i = -3; i <= 3; i++) { if (!i && !j || i === 1 && !j) continue; const n = (i + 3) * 7 + j + 3, ty = n % 3, t = TILE_T[n % TILE_T.length];
      h += mini(G.at(i, j), ty === 0 || ST !== 'blue' ? himView(t + 's', 'deco') : cutView(t + 's', 'deco'), ty === 1 ? 'floor' : 'blue', 'w'); }   // light stages: every wall tile is a full plate (a cut-out on white read as an empty card)   // wall tiles use 324px thumbnails so Chrome keeps every tile painted
    h += mini(G.Tc, himView(PT(1), 'me'), 'blue', 'tc');
    h += `<div class="hero">${mini(G.Th, cutView(PT(2) + 's', 'deco'), 'floor', 'th')}${SLOT}</div>`;
    return `<div class="Z world">${h}</div>`; },
  camera(t, d) { const { e1, e2 } = GT(t, d);
    return e2 > 0 ? { a: G.Th, f: [mix(G.Th[0], ZC[0], e2), mix(G.Th[1], ZC[1], e2)], S: Math.pow(G.S0, e2) } : { a: G.Tc, f: ZC, S: Math.pow(G.S0, 1 - e1) }; },
  seek(cam, t, d) { const { e1, e2 } = GT(t, d), foc = GT(t, d).foc * (1 - e2);
    const w = one(cam, '.world'); w.style.transformOrigin = `${G.Th[0]}px ${G.Th[1]}px`;
    w.style.transform = `rotate(${(-3 * e1 * (1 - e2)).toFixed(3)}deg)`;   // 2D only: a 3D wall dropped tiles and the hook layer in headless Chrome after long runs
    own(cam, '.gt.w,.gt.tc').forEach(g => g.style.filter = foc > 0 ? `brightness(${mix(1, .78, foc).toFixed(3)}) blur(${(1.6 * foc).toFixed(2)}px)` : 'none');
    own(cam, '.gt').forEach(g => g.style.borderRadius = (V !== 'B' ? 10 : 16) * e1 * (1 - e2) + 'px');
    const th = one(cam, '.gt.th'); th.style.boxShadow = `0 ${(24 * foc).toFixed(1)}px ${(50 * foc).toFixed(1)}px rgba(0,19,47,${(.45 * foc).toFixed(3)})`; },
  win(t, d) { const { e1, e2 } = GT(t, d); return { c: G.Th, w: G.TW, h: G.TH, rr: (V !== 'B' ? 10 : 16) * e1 * (1 - e2) }; },
  winIn: (t, d) => P(t, .15, .15),
};

FX[1] = GRID;
