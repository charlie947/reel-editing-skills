#!/usr/bin/env node
// Put one effect on your talking-head clip.
//   node run.cjs <effect> <clip.mp4> <out.mp4> [--at S] [--len S] [--words "..."] [--from S --to S] [--stage white|blue]
//                [--no-fit] [--workers N] [--keep] [--check]      --check = fit and load the effect only, no render
//   node run.cjs list                        the 20 effects, their defaults and which take --words
// Steps: fit and frames (prep.py) -> what the effect needs -> cut-outs and stills (prep.py) -> 60fps shots in Chrome
// -> 30fps H.264 with light motion blur, your audio kept. Work files go in <out>.work/ beside the output, deleted at the end.
// Needs ffmpeg, Node 18+, Python 3 with torch (see prep.py) and puppeteer: run "npm i puppeteer" in this folder once,
// or point PUPPETEER_PATH at an install you already have.
const fs = require('fs'), path = require('path'), os = require('os');
const { execFileSync, spawn } = require('child_process');

const EFFECTS = {   // slug: [number, default length in seconds, words: max characters (0 = no words)]
  'grid-dive': [1, 1.03, 0], 'title-orbit': [2, 1.23, 12], 'magnifying-lens': [3, 1.49, 0], 'portal': [4, 1.02, 0],
  'clone-room': [5, 1.1, 0], 'infinite-zoom': [6, 1.21, 0], 'cube-spin': [7, 1.22, 0], 'liquid-glass': [8, .99, 0],
  'screen-in-screen': [9, 1.34, 0], 'frame-break': [10, 2, 0], 'tile-tunnel': [11, 1.06, 0], 'depth-ui': [12, 1.16, 60],
  'vertigo': [13, 1.15, 0], 'phone-fan': [14, .98, 0], 'shatter': [15, 1.09, 0], 'spotlight': [16, 1.18, 0],
  'pull-back-reveal': [17, 1.31, 24], 'ribbon-wrap': [18, 1.04, 14], 'zoom-through': [19, 2.5, 60], 'head-pop-out': [20, 0, 40],
};
const HERE = __dirname, FPS = 60;
const die = m => { console.error('video-effects: ' + m); process.exit(1); };
const argv = process.argv.slice(2);
if (!argv.length || argv[0] === 'list' || argv[0] === '--help') {
  for (const [k, [n, len, w]] of Object.entries(EFFECTS)) console.log(`${String(n).padStart(2)}  ${k.padEnd(17)} ${n === 20 ? 'to the end' : len + 's'}${w ? `   --words up to ${w} characters` : ''}`);
  process.exit(0);
}
const [slug, clipIn, outIn] = argv;
const opt = (k, d) => { const i = argv.indexOf('--' + k); return i < 0 ? d : argv[i + 1]; };
const flag = k => argv.includes('--' + k);
if (!EFFECTS[slug]) die(`unknown effect "${slug}". Run: node run.cjs list`);
if (!clipIn || !fs.existsSync(clipIn)) die('give your clip: node run.cjs ' + slug + ' my-clip.mp4 out.mp4');
if (!outIn) die('give the output path, for example ' + slug + '.mp4');
const [N, LEN0, WMAX] = EFFECTS[slug];
const clip = path.resolve(clipIn), out = path.resolve(outIn), work = out + '.work';
let words = opt('words', '');
if (words && !WMAX) console.log(`note: ${slug} shows no words, so --words is ignored`), words = '';
if (words.length > WMAX) console.log(`note: --words cut to ${WMAX} characters for ${slug}`), words = words.slice(0, WMAX);
const stage = opt('stage', 'white');
if (!['white', 'blue', 'grey'].includes(stage)) die('--stage is white, blue or grey');
const run = (cmd, args) => execFileSync(cmd, args, { stdio: ['ignore', 'pipe', 'inherit'] }).toString();
const PY = process.env.PYTHON || 'python3';
let puppeteer;
try { puppeteer = require(process.env.PUPPETEER_PATH || 'puppeteer'); } catch (e) { die('puppeteer not found. Run "npm i puppeteer" in ' + HERE + ' once, or set PUPPETEER_PATH.'); }

// HDR footage (iPhone HLG / Dolby Vision, PQ) is not tone-mapped here and comes out washed out
try { const tr = run('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=color_transfer', '-of', 'csv=p=0', clip]).trim();
  if (/arib-std-b67|smpte2084/.test(tr)) console.log(`warning: your clip is HDR (${tr}). Export it as SDR (Rec.709) first or the colours will look washed out.`); } catch (e) {}

(async () => {
  const T0 = Date.now(), log = m => console.log(`[${((Date.now() - T0) / 1000).toFixed(0).padStart(4)}s] ${m}`);
  fs.rmSync(work, { recursive: true, force: true }); fs.mkdirSync(work, { recursive: true });
  // 1 fit and frames
  const pa = ['prep.py', 'frames', clip, work];
  if (opt('from')) pa.push('--from', opt('from')); if (opt('to')) pa.push('--to', opt('to')); if (flag('no-fit')) pa.push('--no-fit');
  const fr = JSON.parse(run(PY, pa.map(a => a === 'prep.py' ? path.join(HERE, 'prep.py') : a)).trim().split('\n').pop());
  const NF = fr.frames, D = NF / 30;
  log(`frames: ${NF} (${D.toFixed(2)}s), fit: scale ${fr.fit.scale}, crop at ${fr.fit.x},${fr.fit.y}${fr.fit.found ? `, head found in ${fr.fit.found} of 5 samples` : ''}`);
  if (fr.fit.note) console.log('note: ' + fr.fit.note.trim());
  const len = +(opt('len', N === 20 ? 0 : LEN0));
  let at = +(opt('at', -1));
  if (at < 0) at = N === 20 ? Math.min(.6, Math.max(0, D - 2.2)) : Math.min(.6, Math.max(0, D - len - .4));
  if (N !== 20 && at + len > D) die(`the effect needs ${len}s from ${at}s, but the clip is ${D.toFixed(2)}s. Use a longer clip or a smaller --at.`);
  if (N === 20 && D - at < 1.6) die(`head-pop-out needs at least 1.6s after --at. The clip is ${D.toFixed(2)}s.`);
  const SETUP = { n: N, at, len, D, words, stage, stills: 'file://' + work + '/stills', engine: '.' };

  // 2 what the effect needs: cut-out frames and stills
  const page = async (need) => {
    const br = await puppeteer.launch({ args: ['--allow-file-access-from-files', '--disable-web-security', '--font-render-hinting=none'] });
    const g = await br.newPage(); await g.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 1 });
    const errs = []; g.on('pageerror', e => errs.push(e.message));
    await g.evaluateOnNewDocument((S, NF, need, work) => {
      window.SETUP = S; window.NEED = new Set();
      window.LIVE = (k, t) => { const f = Math.max(0, Math.min(NF - 1, Math.round(t * 30))); if (k === 'c') NEED.add(f);
        return need ? 'about:blank' : 'file://' + work + (k === 'c' ? '/c/' : '/p/') + String(f).padStart(5, '0') + (k === 'c' ? '.png' : '.jpg'); };
    }, SETUP, NF, need, work);
    await g.goto('file://' + path.join(HERE, 'page', 'index.html') + '?still&t=0', { waitUntil: 'load' });
    await g.evaluate(() => document.fonts.ready);
    if (errs.length) { await br.close(); die('the effect page failed: ' + errs[0]); }
    return { br, g, errs };
  };
  {
    const { br, g, errs } = await page(true);
    const r = await g.evaluate(async (D, FPS) => {
      for (let n = 0; n < Math.round(D * FPS); n++) EX.seek(STILL, n / FPS);
      const st = {}; for (const m of document.documentElement.outerHTML.matchAll(/(plate|cut)(e|k\d+)s?\.(jpg|png)/g)) (st[m[2]] = st[m[2]] || new Set()).add(m[1]);
      return { c: [...NEED].sort((a, b) => a - b), stills: Object.fromEntries(Object.entries(st).map(([k, v]) => [k, [...v]])) };
    }, D, FPS);
    await br.close();
    if (errs.length) die('the effect page failed: ' + errs[0]);
    fs.writeFileSync(work + '/need.json', JSON.stringify({ ...r, at }));
    log(`needs ${r.c.length} cut-out frames and ${Object.keys(r.stills).length} stills`);
  }
  if (flag('check')) { console.log(`check passed: ${slug} loads and plays from ${at.toFixed(2)}s on your clip`); if (!flag('keep')) fs.rmSync(work, { recursive: true, force: true }); return; }
  // 3 cut-outs and stills
  execFileSync(PY, [path.join(HERE, 'prep.py'), 'matte', work, work + '/need.json'], { stdio: 'inherit' });
  log('cut-outs done');

  // 4 shots: 60fps in W Chrome workers. The odd frame snaps to its partner when the pair straddles a cut between
  // segments, so the motion blur below never blends two shots on one frame.
  fs.mkdirSync(work + '/out', { recursive: true });
  const NS = Math.round(D * FPS), W = Math.max(1, Math.min(+opt('workers', Math.min(5, Math.floor(os.cpus().length / 2))), 8));
  const step = Math.ceil(NS / W);
  const shoot = async (a, b) => {
    const { br, g, errs } = await page(false);
    const B = await g.evaluate(() => EX.SEG.map(s => s[1]));
    const sc = x => { let i = 0; B.forEach((b0, j) => { if (x >= b0) i = j; }); return i; };
    for (let n = a; n < b; n++) {
      const t = (n % 2 === 1 && sc(n / FPS) !== sc((n + 1) / FPS)) ? (n + 1) / FPS : n / FPS;
      await g.evaluate(async t => { EX.seek(STILL, t);
        await Promise.all([...document.images].map(i => (i.complete && i.naturalWidth) || i.src === 'about:blank' ? 0 : i.decode().catch(() => 0))); }, t);
      await g.screenshot({ path: `${work}/out/f${String(n).padStart(5, '0')}.jpg`, type: 'jpeg', quality: 94 });
    }
    await br.close();
    if (errs.length) throw new Error(errs[0]);
  };
  const jobs = []; for (let i = 0; i < W; i++) { const a = i * step, b = Math.min(NS, a + step); if (a < b) jobs.push(shoot(a, b)); }
  await Promise.all(jobs);
  log(`shots: ${fs.readdirSync(work + '/out').length} of ${NS}`);

  // 5 encode: tmix=2 -> 30fps, H.264 limited range bt709, your audio for the same range
  const ss = opt('from') ? ['-ss', opt('from')] : [];
  execFileSync('ffmpeg', ['-v', 'error', '-y', '-framerate', String(FPS), '-start_number', '0', '-i', `${work}/out/f%05d.jpg`, ...ss, '-t', D.toFixed(3), '-i', clip,
    '-filter_complex', '[0:v]tmix=frames=2,fps=30,scale=1080:1920:in_range=full:out_range=limited,format=yuv420p[v]',
    '-map', '[v]', '-map', '1:a:0?', '-c:v', 'libx264', '-profile:v', 'high', '-preset', 'slow', '-b:v', '14M', '-maxrate', '16M', '-bufsize', '24M',
    '-color_range', 'tv', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-c:a', 'aac', '-b:a', '128k', '-ar', '44100',
    '-movflags', '+faststart', '-t', D.toFixed(3), out], { stdio: 'inherit' });
  const pr = run('ffprobe', ['-v', 'error', '-select_streams', 'v:0', '-count_frames', '-show_entries', 'stream=codec_name,width,height,color_range,nb_read_frames', '-show_entries', 'format=duration', '-of', 'compact', out]).trim();
  log('wrote ' + out + '\n       ' + pr.replace(/\n/g, '\n       '));
  console.log(`effect ${slug} runs ${at.toFixed(2)}s to ${(N === 20 ? D : at + len).toFixed(2)}s`);
  if (!flag('keep')) fs.rmSync(work, { recursive: true, force: true });
})().catch(e => die(e.message));
