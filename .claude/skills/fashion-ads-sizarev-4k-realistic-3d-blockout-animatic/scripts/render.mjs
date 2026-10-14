#!/usr/bin/env node
// Render a blockout-animatic spec to MP4 (deterministic frame capture → ffmpeg).
// Usage: node render.mjs <spec.json> <out.mp4> [--preview-png out.png --at 3.2]
// Needs: playwright (npm i -g playwright or npx), Chromium, ffmpeg on PATH.
import { readFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); }
catch { const g = (await import('node:child_process')).execSync('npm root -g').toString().trim(); ({ chromium } = require(path.join(g, 'playwright'))); }

const [specPath, outPath, ...rest] = process.argv.slice(2);
if (!specPath || !outPath) { console.error('usage: node render.mjs <spec.json> <out.mp4> [--preview-png file --at seconds]'); process.exit(1); }
const opt = {}; for (let i = 0; i < rest.length; i += 2) opt[rest[i].replace(/^--/, '')] = rest[i + 1];
const spec = JSON.parse(readFileSync(specPath, 'utf8'));
const here = path.dirname(fileURLToPath(import.meta.url));
const engine = pathToFileURL(path.join(here, '..', 'engine', 'animatic.html')).href + '?capture=1';

const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'], ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}) });
const page = await browser.newPage({ viewport: { width: spec.width || 1280, height: spec.height || 720 } });
page.on('pageerror', e => console.error('page error:', e.message));
await page.addInitScript(s => { window.SPEC = s; }, spec);
await page.goto(engine);
await page.waitForFunction(() => window.__ready === true, null, { timeout: 60000 });

const grab = async t => Buffer.from((await page.evaluate(tt => { window.__render(tt); return document.querySelector('canvas').toDataURL('image/jpeg', 0.93); }, t)).split(',')[1], 'base64');

if (opt['preview-png']) {
  const { writeFileSync } = await import('node:fs');
  writeFileSync(opt['preview-png'], await grab(parseFloat(opt.at || '0')));
  await browser.close(); process.exit(0);
}

const fps = spec.fps || 24, frames = Math.round(spec.duration * fps);
const ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-', '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '16', '-movflags', '+faststart', outPath], { stdio: ['pipe', 'inherit', 'inherit'] });
for (let f = 0; f < frames; f++) {
  ff.stdin.write(await grab(f / fps));
  if (f % fps === 0) process.stderr.write(`\rframe ${f}/${frames}`);
}
ff.stdin.end();
await new Promise(r => ff.on('close', r));
await browser.close();
console.error(`\nwrote ${outPath} (${frames} frames @ ${fps}fps)`);
