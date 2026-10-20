/* behind-my-head: a real page, an app screen or one big number BEHIND you, with you cut out in front.
   Paste this whole file at the top of video.js, above window.VIDEO. Edit video.js only, never index.html.
   Needs face/ (from video-intake) and cut/ (from scripts/matte.py) with the same frame numbers.

   A page behind you, landing on a word, with an optional part of it lifting out on a second word:
     behindMyHead({ start: 4.2, end: 8.6, page: 'assets/page.png', url: 'yoursite.com/pricing', word: 'pricing', headTop: 430,
                    focus: { word: 'annual', x: 40, y: 120, w: 300, h: 260 } })
   One number behind you, rolling in and settling on its word:
     behindMyHead({ start: 8.6, end: 11.4, number: '12,400', label: 'Customers', word: 'twelve', headTop: 430 })

   Options for both:
     word      the word it lands on (first time it is said inside the beat). A number of seconds also works
     headTop   REQUIRED. The y of the top of your head, printed by scripts/matte.py. The graphic needs room above
               your head. If your head sits too high, you are shrunk a little (down to 80%) onto a blurred copy of
               the room to make that room. Past 80% it stops with an error that says what to change
     plate     'plate.jpg' from scripts/plate.py: blurred room behind and a slow camera push (tripod shots only)
     top       move the page or number up or down (pixels from the top of the frame)
     ext       'webp' (default) or 'png', whatever matte.py wrote
   Page only:  page (a real screenshot), url (types into the bar), height (visible page height, default 560),
               focus { word, x, y, w, h } a box on the page in pixels at 960 wide, it lifts out on its word
   Number only: number ('12,400', '$3.2m', '87%'), label, size (digit height, default 220)

   Built for 9:16. For 4:5, 1:1 and 16:9 use a split beat for this line instead.
*/
(function () {
  const C = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const P = (t, a, d) => C((t - a) / d);
  const out3 = p => 1 - Math.pow(1 - p, 3);
  const io3 = p => p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
  const back = p => { const c = 1.6; return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); };
  const sprung = s => s <= 0 ? 0 : 1 - Math.exp(-5.5 * s) * Math.cos(8.5 * s);   // reaches full size 0.19s in, then settles
  const pad6 = n => String(n).padStart(6, '0');
  const norm = s => String(s).toLowerCase().replace(/[^a-z0-9]/g, '');
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  // the first time WORD (or a short phrase) is said inside [from, to). A number is a time in seconds.
  function wordTime(word, from, to) {
    if (typeof word === 'number') return word;
    const parts = String(word).trim().split(/\s+/).map(norm);
    for (let i = 0; i < WORDS.length; i++) {
      if (WORDS[i].s < from - 0.01 || WORDS[i].s >= to) continue;
      if (parts.every((p, k) => WORDS[i + k] && norm(WORDS[i + k].w) === p)) return WORDS[i].s;
    }
    throw new Error(`behindMyHead: "${word}" is not said between ${from}s and ${to}s. Check words.js`);
  }
  const setSrc = (img, s) => { if (img.getAttribute('src') !== s) img.setAttribute('src', s); };

  function behindMyHead(o) {
    const start = o.start, end = o.end, ext = o.ext || 'webp';
    const isNum = o.number != null;
    const L = wordTime(o.word, start, end);
    const F = !isNum && o.focus ? wordTime(o.focus.word, L, end) : null;
    const plate = o.plate || null;
    const FULL = 'position:absolute;left:0;top:0;width:1080px;height:1920px';

    // ---- the graphic that sits behind you ----
    let graphic, H = o.height || 560, D = o.size || 220, digits = 0;
    // room above your head: the page's top 55% or the whole number (bar its bottom quarter) must sit above it,
    // and the label must clear Instagram's top 220px
    const ht = o.headTop;
    if (ht == null) throw new Error('behindMyHead: pass headTop, the number scripts/matte.py prints');
    let top = isNum ? (o.top ?? 180) : (o.top ?? 200);
    const need = isNum ? top + 100 + .75 * D : top + 66 + .55 * H;
    const k = ht >= need ? 1 : (1920 - need) / (1920 - ht);                // shrink you from the bottom edge
    if (k < .8) throw new Error(`behindMyHead: the top of your head is at y ${ht}. This beat needs it at y ${Math.round(need)} or lower, ` +
      `and shrinking you to 80% only gets it to y ${Math.round(1920 - (1920 - ht) * .8)}. Film with your head lower in frame, ` +
      `pass a smaller ${isNum ? 'size' : 'height'}, or use animated-numbers in a split beat for this line.`);
    const htK = 1920 - (1920 - ht) * k;
    if (isNum && o.top == null) top = Math.max(180, Math.round(htK - 100 - .75 * D));
    if (!isNum) {
      const f = o.focus;
      if (f && f.y + f.h > .55 * H) throw new Error(`behindMyHead: the focus box ends at y ${f.y + f.h} on the page, behind your head. Pick a box in the top ${Math.round(.55 * H)}px of the page`);
      graphic = `
      <div class="bmh-persp" style="position:absolute;inset:0;perspective:1700px;perspective-origin:50% 40%">
        <div class="bmh-win" style="position:absolute;left:60px;top:${top}px;width:960px;border-radius:30px;overflow:hidden;background:#fff;transform-origin:50% 100%;opacity:0;
             box-shadow:0 60px 140px rgba(0,0,0,.55),0 0 0 1px rgba(255,255,255,.5)">
          <div style="height:66px;background:linear-gradient(#fbfbfd,#f1f1f4);display:flex;align-items:center;padding:0 24px;gap:10px;border-bottom:1px solid #e3e3e8;position:relative">
            <span style="width:15px;height:15px;border-radius:50%;background:#d2d2d7"></span><span style="width:15px;height:15px;border-radius:50%;background:#d2d2d7"></span><span style="width:15px;height:15px;border-radius:50%;background:#d2d2d7"></span>
            <div style="position:absolute;left:50%;top:13px;transform:translateX(-50%);height:40px;min-width:420px;padding:0 18px;border-radius:12px;background:#fff;border:1px solid #e1e1e6;
                 font-size:21px;color:#1d1d1f;display:flex;align-items:center;justify-content:center;font-weight:500;letter-spacing:-.01em;white-space:nowrap">
              <span class="bmh-u"></span><i class="bmh-caret" style="display:inline-block;width:2px;height:24px;background:#0071E3;margin-left:2px"></i></div>
          </div>
          <div style="position:relative;width:960px;height:${H}px;overflow:hidden;background:#fff">
            <img class="bmh-pg" src="${esc(o.page)}" style="position:absolute;left:0;top:0;width:960px;height:auto;transform-origin:50% 0">
            <div class="bmh-dim" style="position:absolute;inset:0;background:rgba(255,255,255,.55);opacity:0"></div>
            ${f ? `<div class="bmh-lift" style="position:absolute;left:${f.x}px;top:${f.y}px;width:${f.w}px;height:${f.h}px;border-radius:16px;overflow:hidden;transform-origin:0 0;opacity:0;
                 box-shadow:0 30px 70px rgba(0,0,0,.45),0 0 0 3px #0071E3"><img src="${esc(o.page)}" style="position:absolute;left:${-f.x}px;top:${-f.y}px;width:960px;height:auto"></div>` : ''}
          </div>
        </div>
      </div>`;
    } else {
      const txt = String(o.number);
      digits = (txt.match(/\d/g) || []).length;
      const ph = D + 190;
      let k = 0;
      const slots = [...txt].map(ch => {
        const cell = `display:block;height:${D}px;line-height:${D}px;font-size:${Math.round(D * .97)}px;font-weight:800;letter-spacing:-.04em;color:#1d1d1f;font-variant-numeric:tabular-nums`;
        if (!/\d/.test(ch)) return `<span style="${cell}">${esc(ch)}</span>`;
        let h = ''; for (let r = 0; r < 3; r++) for (let d = 0; d < 10; d++) h += `<b style="${cell}">${d}</b>`;
        return `<div style="height:${D}px;overflow:hidden"><div class="bmh-strip" data-i="${k++}" style="display:flex;flex-direction:column">${h}<b style="${cell}">${ch}</b></div></div>`;
      }).join('');
      graphic = `
      <div class="bmh-panel" style="position:absolute;left:60px;top:${top}px;width:960px;height:${ph}px;border-radius:44px;background:#fff;transform-origin:50% 100%;opacity:0;
           box-shadow:0 50px 120px rgba(0,0,0,.5)">
        <div class="bmh-lab" style="position:absolute;left:0;right:0;top:40px;text-align:center;font-size:34px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#1d1d1f">${esc(o.label || '')}</div>
        <div class="bmh-num" style="position:absolute;left:0;right:0;top:100px;display:flex;justify-content:center">${slots}</div>
        <div class="bmh-bar" style="position:absolute;left:50%;top:${120 + D}px;height:8px;width:0;border-radius:4px;background:#0071E3;transform:translateX(-50%)"></div>
      </div>`;
    }

    const SHRINK = k < 1 ? `transform:scale(${k});transform-origin:540px 1920px;` : '';
    const SIDES = 'mask-image:linear-gradient(90deg,transparent,#000 7%,#000 93%,transparent);';
    const FEATHER = 'mask-image:linear-gradient(90deg,transparent,#000 7%,#000 93%,transparent),linear-gradient(transparent,#000 9%);mask-composite:intersect;';
    const scrim = isNum
      ? 'linear-gradient(180deg,rgba(4,6,12,.72),rgba(4,6,12,.25) 55%,rgba(0,0,0,0))'
      : 'radial-gradient(ellipse at 50% 30%,rgba(10,12,20,.25),rgba(5,6,10,.7))';
    const html = `
    <div class="bmh" style="${FULL};overflow:hidden;background:#000">
      ${k < 1 ? `<img class="bmh-fill" ${plate ? `src="${esc(plate)}"` : ''} style="${FULL};filter:blur(30px) brightness(.5);transform:scale(1.12)">` : ''}
      <div class="bmh-room" style="position:absolute;inset:-40px;transform-origin:580px 940px">
        <img class="bmh-bg" ${plate ? `src="${esc(plate)}"` : ''} style="position:absolute;left:40px;top:40px;width:1080px;height:1920px;${SHRINK}${k < 1 ? FEATHER : ''}${plate ? 'filter:blur(13px) brightness(.62) saturate(1.1)' : ''}">
      </div>
      <div class="bmh-scrim" style="position:absolute;inset:0;background:${scrim};opacity:0"></div>
      <div class="bmh-cam" style="position:absolute;inset:0;transform-origin:540px 900px">
        <div class="bmh-back" style="position:absolute;inset:0">${graphic}</div>
        <img class="bmh-cut" style="${FULL};${SHRINK}${k < 1 ? SIDES : ''}">
      </div>
    </div>`;

    const URL_ = o.url || '';
    const s0 = Math.max(start, L - 0.19);                                   // page: first reaches full size on the word
    const rollEnd = i => L - (digits - 1 - i) * 0.15;                       // number: the left digit settles first, the right one on the word
    const rollStart = L - (digits - 1) * 0.15 - 1.0;
    const n0 = Math.max(start, rollStart - 0.2);

    return {
      start, end, layout: 'full', html,
      draw(lt, el, t) {
        const q = c => el.querySelector('.bmh-' + c);
        // you, frame by frame: the room frame behind, the cut-out of the same frame in front
        const f = Math.min(VIDEO.faceFrames, Math.max(1, Math.round(t * VIDEO.fps) + 1));
        if (!plate) setSrc(q('bg'), 'face/' + pad6(f) + '.jpg');
        if (k < 1 && !plate) setSrc(q('fill'), 'face/' + pad6(f) + '.jpg');
        setSrc(q('cut'), 'cut/' + pad6(f) + '.' + ext);

        const ex = io3(P(t, end - 0.3, 0.3));                                // the graphic falls back in the last 0.3s
        const inAt = isNum ? n0 : s0;
        q('scrim').style.opacity = out3(P(t, inAt - 0.1, 0.7)) * (1 - ex);

        // slow push with depth: room moves least, you move most. Only with a clean plate, or your ghost would show
        const p = plate ? io3(P(t, start, end - start)) : 0;
        q('room').style.transform = `translateX(${-8 * p}px) scale(${1 + .03 * p})`;
        q('back').style.transform = `translateX(${5 * p}px) scale(${1 - .014 * p})`;
        q('cam').style.transform = `translateX(${-16 * p}px) scale(${1 + .06 * p})`;

        if (!isNum) {
          const r = sprung(t - s0), ry = -7 + 10 * io3(P(t, start, end - start));
          const win = q('win');
          win.style.opacity = out3(P(t, s0 - 0.05, 0.25)) * (1 - ex);
          win.style.transform = `translateY(${(1 - r) * 520}px) rotateX(${(1 - r) * 42 + 7}deg) rotateY(${ry}deg) scale(${(.82 + .18 * Math.min(r, 1.04)) * (1 - .06 * ex)})`;
          q('u').textContent = URL_.slice(0, Math.round(URL_.length * P(t, s0 + 0.4, 0.8)));
          q('caret').style.opacity = (t < s0 + 1.3 || Math.floor(t * 2.5) % 2 === 0) && t < s0 + 3 ? 1 : 0;
          q('pg').style.transform = `scale(${1 + .035 * io3(P(t, s0 + 1, 4))})`;
          if (F != null) {
            const a = back(P(t, F - 0.22, 0.55)) * (1 - out3(P(t, end - 0.75, 0.45)));   // reaches full lift on its word
            const lift = q('lift');
            lift.style.opacity = C(a * 3);
            lift.style.transform = `translate(${-6 * a}px,${-24 * a}px) scale(${1 + .3 * a})`;
            q('dim').style.opacity = C(a);
          }
        } else {
          const r = sprung(t - n0);
          const panel = q('panel');
          panel.style.opacity = out3(P(t, n0, 0.25)) * (1 - ex);
          panel.style.transform = `translateY(${(1 - r) * 360}px) scale(${(.86 + .14 * Math.min(r, 1.04)) * (1 - .06 * ex)})`;
          q('lab').style.opacity = out3(P(t, n0 + 0.1, 0.4));
          el.querySelectorAll('.bmh-strip').forEach(st => {
            const i = +st.dataset.i, e = 1 - Math.pow(1 - P(t, rollStart, rollEnd(i) - rollStart), 4);
            st.style.transform = `translateY(${-e * 30 * D}px)`;
            st.style.opacity = .55 + .45 * e;
          });
          q('num').style.transform = `scale(${1 + .04 * Math.sin(Math.PI * P(t, L, 0.35))})`;
          q('bar').style.width = (520 * out3(P(t, L - 0.1, 0.5))) + 'px';
        }
      },
    };
  }
  window.behindMyHead = behindMyHead;
})();
