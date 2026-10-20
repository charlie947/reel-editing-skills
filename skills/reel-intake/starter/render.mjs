// Render the reel to PNG frames, then to an Instagram-ready MP4.
//   npm i puppeteer            (once)
//   node render.mjs            full reel  -> frames/ then reel.mp4
//   node render.mjs --stills 0.5,3,5      -> still-0.5.jpg ... to check before a full render
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const puppeteer = require(process.env.PUPPETEER_PATH || 'puppeteer');
const dir = path.dirname(new URL(import.meta.url).pathname);
const args = process.argv.slice(2);
const stillsArg = args.includes('--stills') ? args[args.indexOf('--stills') + 1] : null;

const browser = await puppeteer.launch({ headless: 'new', args: ['--allow-file-access-from-files', '--force-color-profile=srgb'] });
const page = await browser.newPage();
const errors = [];
page.on('pageerror', e => errors.push(e.message));
await page.setViewport({ width: 1080, height: 1920 });
await page.goto('file://' + path.join(dir, 'index.html') + '?render', { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
const { fps, duration } = await page.evaluate(() => ({ fps: REEL.fps, duration: REEL.duration }));

if (stillsArg) {
  for (const t of stillsArg.split(',').map(Number)) {
    await page.evaluate(t => seek(t), t);
    await page.screenshot({ path: path.join(dir, `still-${t}.jpg`), type: 'jpeg', quality: 90 });
  }
  await browser.close();
  if (errors.length) { console.error(errors.join('\n')); process.exit(2); }
  console.log('stills written');
  process.exit(0);
}

const out = path.join(dir, 'frames');
fs.mkdirSync(out, { recursive: true });
const total = Math.round(duration * fps);
for (let i = 0; i < total; i++) {
  await page.evaluate(t => seek(t), i / fps);
  await page.screenshot({ path: path.join(out, String(i).padStart(6, '0') + '.png') });
  if (i % fps === 0) process.stdout.write(`\r${i}/${total} frames`);
}
await browser.close();
if (errors.length) { console.error('\n' + errors.join('\n')); process.exit(2); }

// H.264, limited range, bt709, faststart: the file Instagram accepts without washing it out
execFileSync('ffmpeg', ['-y', '-framerate', String(fps), '-i', path.join(out, '%06d.png'), '-i', path.join(dir, 'cut-audio.wav'),
  '-vf', 'scale=out_color_matrix=bt709:out_range=tv,format=yuv420p',
  '-c:v', 'libx264', '-profile:v', 'high', '-crf', '18', '-pix_fmt', 'yuv420p', '-color_range', 'tv',
  '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709',
  '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', path.join(dir, 'reel.mp4')], { stdio: 'inherit' });
console.log('\nreel.mp4 written. Delete frames/ when you are happy with it.');
