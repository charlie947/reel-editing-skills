// Your reel. Claude edits this file, never index.html.
// Times are seconds in the CUT recording (after silences are removed).
window.REEL = {
  fps: 30,
  duration: 6,          // length of cut-audio.wav
  faceFrames: 1,        // how many JPGs are in face/ (the demo ships one still)
  capWords: 4,          // words per caption group
  hook: ['Claude edits my reels now', 'Here are the 3 moves I use:'],  // 2 lines, no full stop
  hookEnd: 2.2,         // cut from the hook to the edit at about 2.2s

  // Keep y 930-1040 clear on every beat. That is where the caption pill sits.
  beats: [
    // 1. Your face from frame 0, the hook does the talking
    { start: 0, end: 2.2, layout: 'face' },

    // 2. Split: one big object on top, your face below. It lands on its word.
    { start: 2.2, end: 4.2, layout: 'split',
      html: '<div class="hero" style="position:absolute;left:140px;top:170px;width:800px;height:640px;border-radius:44px;background:#fff;box-shadow:0 40px 80px -40px rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;font-size:150px;font-weight:800;color:#0071e3">3x</div>',
      draw(lt, el) {
        const p = spring(prog(lt, 0, 0.5));
        el.firstChild.style.transform = `perspective(1400px) translateZ(${(1 - p) * -900}px) rotateX(${(1 - p) * 18}deg)`;
        el.firstChild.style.opacity = prog(lt, 0, 0.15);
      } },

    // 3. Full graphic, face hidden
    { start: 4.2, end: 6, layout: 'full',
      html: '<div style="position:absolute;left:0;right:0;top:380px;text-align:center;font-size:120px;font-weight:800;letter-spacing:-0.03em">Your payoff</div>',
      draw(lt, el) { el.firstChild.style.opacity = easeOut(prog(lt, 0, 0.3)); } },
  ],
};
