import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const types = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.json':'application/json', '.webp':'image/webp', '.jpg':'image/jpeg', '.png':'image/png', '.svg':'image/svg+xml', '.pdf':'application/pdf', '.mp4':'video/mp4', '.webm':'video/webm', '.vtt':'text/vtt', '.ico':'image/x-icon', '.mp3':'audio/mpeg', '.ogg':'audio/ogg', '.wav':'audio/wav', '.woff2':'font/woff2' };
const port = Number(process.env.PORT || 4173);
createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const segments = pathname.split('/');
    if (segments.some(p => p.startsWith('.') || p === 'node_modules')) throw new Error('Private path');
    let file = resolve(root, '.' + pathname);
    if (file !== root && !file.startsWith(root + sep)) throw new Error('Outside root');
    if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
    const bytes = await readFile(file);
    res.writeHead(200, { 'Content-Type':types[extname(file)] || 'application/octet-stream', 'Cache-Control':'no-store' });
    res.end(req.method === 'HEAD' ? undefined : bytes);
  } catch {
    res.writeHead(404, { 'Content-Type':'text/plain; charset=utf-8' });
    res.end('Not found');
  }
}).listen(port, '127.0.0.1', () => console.log(`Castle preview: http://127.0.0.1:${port}`));
