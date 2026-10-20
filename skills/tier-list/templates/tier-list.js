/* tier-list: an S to F tier list on top, you in a face card below with your head breaking out of it.
   Each item flies out from your head and drops into its row on the word you say it.
   Paste this whole file at the top of video.js, above window.VIDEO. Edit video.js only, never index.html.
   Needs face/ (from video-intake) and cut/ (from scripts/matte.py) with the same frame numbers.

     tierList({ start: 3.1, end: 12.8, title: 'Ways to win clients', headTop: 430,
                items: [ { text: 'Referrals', tier: 'S', word: 'referrals' },
                         { text: 'Cold email', tier: 'B', word: 'cold email' },
                         { text: 'Bought lists', tier: 'F', word: 'bought' } ] })

   Options:
     items     text on the chip, its tier, and the word it lands on (first time it is said inside the beat,
               after the item before it). Leave out word and the chip text is used. A number of seconds also works
     tiers     default ['S','A','B','C','D','F']. Fewer rows get taller
     title     optional line above the board. Keep it under 30 characters
     headTop   from matte.py. Sets the card crop so the top of your head clears the card
     cropY     set the crop yourself instead: the frame row (frame pixels) at the card's top edge
     zoom      1 to 1.1, scales you and the card picture together. Never more than 1.1
     ext       'webp' (default) or 'png', whatever matte.py wrote

   Built for 9:16. For 4:5, 1:1 and 16:9 put the board in a full beat and drop the break-out.
*/
(function () {
  const C = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const P = (t, a, d) => C((t - a) / d);
  const out3 = p => 1 - Math.pow(1 - p, 3);
  const back = p => { const c = 1.6; return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); };
  const pad6 = n => String(n).padStart(6, '0');
  const norm = s => String(s).toLowerCase().replace(/[^a-z0-9]/g, '');
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const setSrc = (img, s) => { if (img.getAttribute('src') !== s) img.setAttribute('src', s); };

  function wordTime(word, from, to) {
    if (typeof word === 'number') return word;
    const parts = String(word).trim().split(/\s+/).map(norm);
    for (let i = 0; i < WORDS.length; i++) {
      if (WORDS[i].s < from - 0.01 || WORDS[i].s >= to) continue;
      if (parts.every((p, k) => WORDS[i + k] && norm(WORDS[i + k].w) === p)) return WORDS[i].s;
    }
    throw new Error(`tierList: "${word}" is not said between ${from.toFixed(2)}s and ${to}s. Check words.js`);
  }

  // one accent, stepped down to grey: S is the brand blue, F is plain grey
  const COLOURS = ['#0071E3', '#2f8bea', '#5ea5f0', '#9cc7f6', '#cfe2fa', '#e8e8ed'];
  const INK = ['#fff', '#fff', '#fff', '#1d1d1f', '#1d1d1f', '#1d1d1f'];

  function tierList(o) {
    const tiers = o.tiers || ['S', 'A', 'B', 'C', 'D', 'F'];
    const start = o.start, end = o.end, ext = o.ext || 'webp';
    let after = start;
    const items = o.items.map(it => {
      const row = tiers.indexOf(it.tier);
      if (row < 0) throw new Error(`tierList: tier "${it.tier}" for "${it.text}" is not one of ${tiers.join(' ')}`);
      const at = wordTime(it.word ?? it.text, after, end); after = at + 0.01;
      return { text: it.text, row, at };
    });

    // board: below the top 220px, above the break-out zone. Rows share the space
    const T = o.title ? 230 : null, R0 = o.title ? 320 : 240, R1 = 880, GAP = 12, n = tiers.length;
    const RH = (R1 - R0 - GAP * (n - 1)) / n, LW = 112, X0 = 60, TX = X0 + LW + 14, TW = 1020 - TX;
    const CH = Math.round(RH - 16), FS = Math.round(Math.min(48, CH * .6));

    // face card: same box as the starter's split card. The picture inside is cropped so your head clears its top
    const CARD = { x: 40, y: 1000, w: 1000, h: 860 };
    const zoom = C(o.zoom ?? 1, 1, 1.1), s = CARD.w / 1080 * zoom;
    const cropY = o.cropY ?? ((o.headTop ?? 420) + 130 / s);   // about 130px of your head rises above the card
    const fx = CARD.x + (CARD.w - 1080 * s) / 2, fy = CARD.y - cropY * s;
    const PIC = `position:absolute;width:${1080 * s}px;height:${1920 * s}px`;

    const rows = tiers.map((k, i) => {
      const c = Math.min(i, COLOURS.length - 1);
      return `<div style="position:absolute;left:${X0}px;top:${R0 + i * (RH + GAP)}px;width:960px;height:${RH}px">
        <div class="tl-lab" style="position:absolute;left:0;top:0;width:${LW}px;height:${RH}px;border-radius:22px;background:${COLOURS[c]};color:${INK[c]};
             display:flex;align-items:center;justify-content:center;font-size:${Math.round(RH * .52)}px;font-weight:800">${esc(k)}</div>
        <div style="position:absolute;left:${LW + 14}px;right:0;top:0;bottom:0;border-radius:22px;background:#f5f5f7"></div></div>`;
    }).join('');
    const chips = items.map(it => `<div class="tl-chip" style="position:absolute;left:0;top:0;height:${CH}px;padding:0 24px;border-radius:18px;background:#fff;
         display:flex;align-items:center;white-space:nowrap;font-size:${FS}px;font-weight:700;letter-spacing:-.015em;color:#1d1d1f;opacity:0;transform-origin:0 0;
         box-shadow:0 14px 34px rgba(16,24,40,.16),0 0 0 1px rgba(16,24,40,.06)">${esc(it.text)}</div>`).join('');

    const html = `
    <div class="tl" style="position:absolute;left:0;top:0;width:1080px;height:1920px;background:#fff;overflow:hidden">
      ${T != null ? `<div class="tl-title" style="position:absolute;left:60px;right:60px;top:${T}px;text-align:center;font-size:54px;font-weight:700;letter-spacing:-.025em;color:#1d1d1f">${esc(o.title)}</div>` : ''}
      <div class="tl-board">${rows}</div>
      <div style="position:absolute;left:${CARD.x}px;top:${CARD.y}px;width:${CARD.w}px;height:${CARD.h}px;border-radius:44px;overflow:hidden;box-shadow:0 30px 80px rgba(16,24,40,.25)">
        <img class="tl-bg" style="${PIC};left:${fx - CARD.x}px;top:${fy - CARD.y}px"></div>
      <div style="position:absolute;left:${CARD.x}px;top:0;width:${CARD.w}px;height:${CARD.y + CARD.h}px;overflow:hidden;clip-path:inset(0 round 0 0 44px 44px)">
        <img class="tl-cut" style="${PIC};left:${fx - CARD.x}px;top:${fy}px"></div>
      ${chips}
    </div>`;

    return {
      start, end, layout: 'full', html,
      draw(lt, el, t) {
        // you: the card shows the frame, the cut-out of the same frame sits over it with the same crop, open at the top
        const f = Math.min(VIDEO.faceFrames, Math.max(1, Math.round(t * VIDEO.fps) + 1));
        setSrc(el.querySelector('.tl-bg'), 'face/' + pad6(f) + '.jpg');
        setSrc(el.querySelector('.tl-cut'), 'cut/' + pad6(f) + '.' + ext);

        const title = el.querySelector('.tl-title');
        if (title) { title.style.opacity = out3(P(t, start, .35)); title.style.transform = `translateY(${(1 - out3(P(t, start, .45))) * 24}px)`; }
        el.querySelector('.tl-board').style.opacity = out3(P(t, start, .3));

        // slots: chips sit left to right in their row. A row that would overflow shrinks its chips to fit
        const nodes = [...el.querySelectorAll('.tl-chip')];
        const widths = nodes.map(c => c.offsetWidth);
        const used = tiers.map(() => 0), fit = tiers.map(() => 1);
        items.forEach((it, i) => { used[it.row] += widths[i] + 12; });
        used.forEach((u, r) => { if (u + 12 > TW) fit[r] = (TW - 12 * (1 + items.filter(x => x.row === r).length)) / (u - 12 * items.filter(x => x.row === r).length); });
        const xAt = tiers.map(() => TX + 12);

        const pulse = tiers.map(() => 0);
        items.forEach((it, i) => {
          const c = nodes[i], k = fit[it.row], w = widths[i] * k;
          const tx = xAt[it.row]; xAt[it.row] += w + 12;
          const ty = R0 + it.row * (RH + GAP) + (RH - CH * k) / 2;
          const p = P(t, it.at - 0.45, 0.55), e = out3(p);                 // launches from your head, lands on its word
          const sx = 540 - w / 2, sy = CARD.y - 150;
          const x = sx + (tx - sx) * e, y = sy + (ty - sy) * e - Math.sin(Math.PI * p) * 60;
          c.style.opacity = t < it.at - 0.45 ? 0 : C(p * 5);
          c.style.transform = `translate(${x}px,${y}px) rotate(${(1 - e) * -10}deg) scale(${(.55 + .45 * back(p)) * k})`;
          const land = t - it.at; if (land > 0 && land < .35) pulse[it.row] = Math.max(pulse[it.row], Math.sin(Math.PI * land / .35));
        });
        el.querySelectorAll('.tl-lab').forEach((l, i) => { l.style.transform = `scale(${1 + .1 * pulse[i]})`; });
      },
    };
  }
  window.tierList = tierList;
})();
