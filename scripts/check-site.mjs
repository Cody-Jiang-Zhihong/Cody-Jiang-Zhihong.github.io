import { readFile, access, stat } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { Window } from 'happy-dom';
import { content } from '../castle/content.js';
import { parseRoute } from '../castle/routes.js';
import { html as generatedRead } from './build-content.mjs';

const root = resolve(import.meta.dirname,'..');
const failures = [], checked = new Set();
if((await readFile(resolve(root,'read.html'),'utf8')).replace(/\r\n/g,'\n') !== generatedRead) failures.push('read.html is stale. Run npm run build.');
async function local(href, page) {
  if(!href || /^(data:|mailto:|tel:|https?:)/.test(href)) return;
  const url = new URL(href,'https://local.test/'+page);
  const path = decodeURIComponent(url.pathname);
  const file = resolve(root,'.'+path);
  const key = path+url.hash;
  if(checked.has(key)) return;
  checked.add(key);
  try {
    const info = await stat(file);
    const finalFile = info.isDirectory()?join(file,'index.html'):file;
    await access(finalFile);
    if(url.hash && finalFile.endsWith('.html')) {
      if(path === '/' || path === '/index.html') {
        if(parseRoute(url.hash).hash !== url.hash) failures.push(`Noncanonical castle link: ${href} in ${page}`);
      } else {
        const win = new Window(); win.document.write(await readFile(finalFile,'utf8'));
        if(!win.document.getElementById(decodeURIComponent(url.hash.slice(1)))) failures.push(`Missing anchor ${href} in ${page}`);
        win.happyDOM.abort();
      }
    }
  } catch { failures.push(`Missing local resource ${href} in ${page}`); }
}
for(const page of ['index.html','read.html','legacy/index.html']) {
  const html = await readFile(resolve(root,page),'utf8');
  const win = new Window(); win.document.write(html);
  for(const el of win.document.querySelectorAll('[href],[src]')) await local(el.getAttribute('href') || el.getAttribute('src'),page);
  if(page !== 'legacy/index.html') {
    const ids = [...win.document.querySelectorAll('[id]')].map(el=>el.id);
    if(new Set(ids).size !== ids.length) failures.push(`Duplicate IDs in ${page}`);
    if(!win.document.querySelector('meta[name="description"]')) failures.push(`Missing description in ${page}`);
    if(!win.document.querySelector('meta[property="og:image"]')) failures.push(`Missing social image in ${page}`);
  }
  win.happyDOM.abort();
}
for(const [id,d] of Object.entries(content.details)) {
  for(const link of d.links) await local(link.href, 'index.html');
  for(const item of d.media || []) {
    if(!item.pending && item.src) await local(item.src,'index.html');
    if(item.fullSrc) await local(item.fullSrc,'index.html');
    if(item.poster) await local(item.poster,'index.html');
    for(const track of item.tracks || []) await local(track.src,'index.html');
  }
  if(!Object.values(content.rooms).some(room=>room.entries.includes(id))) failures.push(`Unreachable exhibit: ${id}`);
}
for(const name of ['gate-v2','hall-map-v2','great-hall','observatory','study','workshop']) {
  for(const width of [768,1536]) await local(`/castle/assets/${name}-${width}.webp`,'index.html');
}
if((await readFile(resolve(root,'CNAME'),'utf8')).trim() !== 'codyjiang.com') failures.push('CNAME changed');
if(process.argv.includes('--http')) {
  const base = process.env.PREVIEW_URL || 'http://127.0.0.1:4173';
  for(const path of checked) {
    try {
      const response = await fetch(new URL(path,base),{method:'HEAD'});
      if(!response.ok) failures.push(`HTTP ${response.status}: ${path}`);
    } catch { failures.push(`Preview not reachable: ${path}`); break; }
  }
}
if(failures.length) { console.error(failures.join('\n')); process.exitCode = 1; }
else console.log(`Checked ${checked.size} local paths/anchors; all exhibits reachable; CNAME intact.`);
