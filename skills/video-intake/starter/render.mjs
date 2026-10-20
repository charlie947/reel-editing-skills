// Render the video to PNG frames, then to an MP4 every platform accepts.
//   npm i puppeteer            (once)
//   node render.mjs            full video  -> frames/ then video.mp4
//   node render.mjs --stills 0.5,3,5      -> still-0.5.jpg ... to check before a full render
//   node render.mjs --from 12 --to 18     -> only that part, as video-12-18.mp4 (to check one beat)
//   add --format linkedin | square | wide -> 4:5, 1:1 or 16:9, written as video-linkedin.mp4 and so on
//   (--linkedin still works)
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const puppeteer = require(process.env.PUPPETEER_PATH || 'puppeteer');
const dir = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const stillsArg = args.includes('--stills') ? args[args.indexOf('--stills') + 1] : null;
const format = args.includes('--format') ? args[args.indexOf('--format') + 1] : args.includes('--linkedin') ? 'linkedin' : 'vertical';
const [W, H] = { vertical: [1080, 1920], linkedin: [1080, 1350], square: [1080, 1080], wide: [1920, 1080] }[format];
const from = args.includes('--from') ? +args[args.indexOf('--from') + 1] : null;
const to = args.includes('--to') ? +args[args.indexOf('--to') + 1] : null;
const tag = (format === 'vertical' ? '' : '-' + format) + (from != null || to != null ? `-${from ?? 0}-${to ?? 'end'}` : '');

const browser = await puppeteer.launch({ headless: 'new', args: ['--allow-file-access-from-files', '--force-color-profile=srgb'] });
const page = await browser.newPage();
const errors = [];
page.on('pageerror', e => errors.push(e.message));
await page.setViewport({ width: W, height: H });
await page.goto('file://' + path.join(dir, 'index.html') + '?render' + '&f=' + format, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
const { fps, duration } = await page.evaluate(() => ({ fps: VIDEO.fps, duration: VIDEO.duration }));

if (stillsArg) {
  for (const t of stillsArg.split(',').map(Number)) {
    await page.evaluate(t => seek(t), t);
    await page.screenshot({ path: path.join(dir, `still${tag}-${t}.jpg`), type: 'jpeg', quality: 90 });
  }
  await browser.close();
  if (errors.length) { console.error(errors.join('\n')); process.exit(2); }
  console.log('stills written');
  process.exit(0);
}

const out = path.join(dir, 'frames' + tag);
fs.mkdirSync(out, { recursive: true });
const first = Math.round((from ?? 0) * fps), total = Math.round(Math.min(to ?? duration, duration) * fps);
for (let i = first; i < total; i++) {
  await page.evaluate(t => seek(t), i / fps);
  await page.screenshot({ path: path.join(out, String(i - first).padStart(6, '0') + '.png') });
  if (i % fps === 0) process.stdout.write(`\r${i}/${total} frames`);
}
await browser.close();
if (errors.length) { console.error('\n' + errors.join('\n')); process.exit(2); }

// H.264, limited range, bt709, faststart: the file every platform accepts without washing it out
execFileSync('ffmpeg', ['-y', '-framerate', String(fps), '-i', path.join(out, '%06d.png'), '-ss', String(first / fps), '-i', path.join(dir, 'cut-audio.wav'),
  '-vf', 'scale=out_color_matrix=bt709:out_range=tv,format=yuv420p',
  '-c:v', 'libx264', '-profile:v', 'high', '-crf', '18', '-pix_fmt', 'yuv420p', '-color_range', 'tv',
  '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709',
  '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', path.join(dir, `video${tag}.mp4`)], { stdio: 'inherit' });
console.log(`\nvideo${tag}.mp4 written. Delete frames${tag}/ when you are happy with it.`);
