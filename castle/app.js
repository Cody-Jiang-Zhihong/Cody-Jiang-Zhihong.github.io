import { content } from './content.js';
import { hallway, exhibits } from './scene-map.js';
import { parseRoute, pathFor } from './routes.js';
import { renderMedia, stopMedia } from './media.js';

const $ = id => document.getElementById(id);
const app = $('app'), stage = $('stage');
const detailDialog = $('detail-dialog'), mapDialog = $('map-dialog'), guideDialog = $('guide-dialog');
const layers = [$('scene-a'), $('scene-b')];
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const touch = matchMedia('(hover: none)');
const portrait = matchMedia('(max-width: 700px) and (orientation: portrait)');
const imageCache = new Map(), visited = new Set();
const session = Math.random().toString(36).slice(2);
let currentRoom = null, layerIndex = 0, routeVersion = 0, routedHash = null, activeDetail = null;
let gateOpening = false, returnFocus = null, nextOrigin = null;
let usingKeyboard = false;
const title = room => room === 'gate' ? 'At the threshold' : room === 'hall' ? 'The Hall' : content.rooms[room].title;
const wait = ms => new Promise(resolve => setTimeout(resolve, motion.matches ? 0 : ms));
const frame = () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
const asset = room => '/castle/assets/' + ({gate:'gate-v2',hall:'hall-map-v2'}[room] || room) + (innerWidth <= 700 ? '-768.webp' : '-1536.webp');
const mayPreload = () => !navigator.connection?.saveData && !/^(slow-)?2g$/.test(navigator.connection?.effectiveType || '');

function loadImage(room) {
  const src = asset(room);
  if (imageCache.has(src)) return imageCache.get(src);
  const promise = new Promise((resolve,reject) => {
    const img = new Image();
    let settled = false;
    const timer = setTimeout(() => { img.src = ''; fail(); }, 12000);
    function fail() { if(settled) return; settled = true; clearTimeout(timer); imageCache.delete(src); reject(new Error('Scene unavailable')); }
    img.onload = () => { if(settled) return; settled = true; clearTimeout(timer); resolve(img); };
    img.onerror = fail; img.decoding = 'async'; img.src = src;
  });
  imageCache.set(src,promise);
  return promise;
}
function prewarm(room) { if (room && mayPreload()) loadImage(room).catch(()=>{}); }
function loading(message, retry) {
  $('loading-status').hidden = !message;
  $('loading-text').textContent = message || '';
  $('retry-load').hidden = !retry;
  $('retry-load').onclick = retry || null;
  stage.setAttribute('aria-busy', String(!!message && !retry));
}
function go(room,detail,origin) {
  const hash = pathFor(room,detail);
  nextOrigin = origin || null;
  if (location.hash !== hash) history.pushState({castle:true, session, type:detail?'exhibit':'room', parentHash:location.hash || '#gate'},'',hash);
  route();
}
function setCaption(point) {
  document.querySelector('.scene-guidance').classList.toggle('has-hover',!!point);
  if (point) { $('hover-title').textContent = point.label; $('hover-subtitle').textContent = point.subtitle; }
}
function spatialButton(point,index,room) {
  const button = document.createElement('button');
  const xs = point.points.map(p=>p[0]), ys = point.points.map(p=>p[1]);
  const x = Math.min(...xs), y = Math.min(...ys), w = Math.max(...xs)-x, h = Math.max(...ys)-y;
  const local = point.points.map(p=>[(p[0]-x)/w*100,(p[1]-y)/h*100]);
  button.className = 'spatial-region' + (point.detail?' object-region':'');
  button.type = 'button'; button.dataset.target = point.detail || point.room;
  button.setAttribute('aria-label',(point.detail?'Open ':'Enter ')+point.label);
  button.style.cssText = `left:${x*100}%;top:${y*100}%;width:${w*100}%;height:${h*100}%;clip-path:polygon(${local.map(p=>p[0]+'% '+p[1]+'%').join(',')});--reveal-delay:${.25+index*.25}s`;
  const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
  svg.classList.add('region-light'); svg.setAttribute('viewBox','0 0 100 100'); svg.setAttribute('preserveAspectRatio','none'); svg.setAttribute('aria-hidden','true');
  const polygon = document.createElementNS('http://www.w3.org/2000/svg','polygon');
  polygon.setAttribute('points',local.map(p=>p.join(',')).join(' ')); svg.append(polygon);
  const marker = document.createElement('span'); marker.className = 'region-marker'; marker.setAttribute('aria-hidden','true');
  marker.style.left = ((point.anchor[0]-x)/w*100)+'%'; marker.style.top = ((point.anchor[1]-y)/h*100)+'%';
  button.append(svg,marker);
  button.addEventListener('pointerenter',()=>{ if(!touch.matches) setCaption(point); prewarm(point.room); });
  button.addEventListener('pointerleave',()=>setCaption(null));
  button.addEventListener('focus',()=>{ if(button.matches(':focus-visible')) setCaption(point); prewarm(point.room); });
  button.addEventListener('blur',()=>setCaption(null));
  button.addEventListener('click',()=>{ setCaption(null); returnFocus = point.detail || point.room; go(point.room || room,point.detail,point.anchor); });
  return button;
}
function doorAngles(gate,progress) {
  gate.style.setProperty('--left-angle',(progress*88)+'deg');
  gate.style.setProperty('--right-angle',(-progress*88)+'deg');
}
function makeGate(world,src) {
  const gate = document.createElement('div'); gate.className = 'gate-opening';
  gate.innerHTML = '<div class="gate-interior" aria-hidden="true"></div><div class="door-leaf door-left" aria-hidden="true"></div><div class="door-leaf door-right" aria-hidden="true"></div><button class="gate-hit" aria-label="Push open the castle doors"><span class="sr-only">Click, drag, or press Enter or Space to open the doors and enter the hall.</span></button>';
  gate.querySelectorAll('.door-leaf').forEach(leaf=>leaf.style.backgroundImage=`url("${src}")`);
  world.append(gate);
  const button = gate.querySelector('button');
  let start = null, progress = 0, suppressClick = false;
  button.addEventListener('pointerdown',e=>{
    if(gateOpening || e.button !== 0) return;
    start = {x:e.clientX,y:e.clientY}; progress = 0; suppressClick = false;
    button.setPointerCapture(e.pointerId); gate.classList.add('is-dragging');
  });
  button.addEventListener('pointermove',e=>{
    if(!start || gateOpening) return;
    const distance = Math.hypot(e.clientX-start.x,e.clientY-start.y);
    progress = Math.min(.85,distance/Math.min(stage.clientWidth*.35,220));
    if(distance > 6) { suppressClick = true; doorAngles(gate,progress); }
  });
  button.addEventListener('pointerup',()=>{
    if(!start) return;
    start = null; gate.classList.remove('is-dragging');
    if(progress > .13) openGate(gate);
    else { doorAngles(gate,0); suppressClick = false; }
  });
  button.addEventListener('pointercancel',()=>{ start = null; suppressClick = false; gate.classList.remove('is-dragging'); doorAngles(gate,0); });
  button.addEventListener('click',e=>{ if(suppressClick && e.detail !== 0) { suppressClick = false; return; } suppressClick = false; openGate(gate); });
}
async function openGate(gate) {
  if(gateOpening || currentRoom !== 'gate') return;
  gateOpening = true; const request = routeVersion;
  app.classList.add('is-opening'); gate.querySelector('button').setAttribute('aria-busy','true');
  const timer = setTimeout(()=>{ if(request === routeVersion) loading('Preparing the hall…'); },350);
  let image;
  try { image = await loadImage('hall'); }
  catch {
    clearTimeout(timer); if(request !== routeVersion) return;
    gateOpening = false; app.classList.remove('is-opening'); gate.querySelector('button').setAttribute('aria-busy','false');
    doorAngles(gate,0); loading('The hall could not load.',()=>openGate(gate)); return;
  }
  clearTimeout(timer); if(request !== routeVersion || currentRoom !== 'gate') return;
  loading(); gate.querySelector('.gate-interior').style.backgroundImage = `url("${image.src}")`;
  gate.classList.add('is-opening'); doorAngles(gate,1);
  await wait(720);
  if(request === routeVersion && currentRoom === 'gate') go('hall',null,[.5,.54]);
}
function buildScene(layer,room,image) {
  layer.replaceChildren(); layer.dataset.scene = room;
  const ambient = document.createElement('div'); ambient.className = 'scene-ambient'; ambient.style.backgroundImage = `url("${image.src}")`; ambient.setAttribute('aria-hidden','true');
  const world = document.createElement('div'); world.className = 'world';
  const img = document.createElement('img'); img.className = 'scene-art'; img.src = image.src; img.alt = ''; img.draggable = false; img.width = 1536; img.height = 1024;
  world.append(img); layer.append(ambient,world);
  if(room === 'gate') makeGate(world,image.src);
  else (room === 'hall'?hallway:exhibits[room]).forEach((point,index)=>{
    world.append(spatialButton(point,index,room));
    const label = document.createElement('span'); label.className = 'region-label'; label.setAttribute('aria-hidden','true');
    label.textContent = room === 'hall' ? point.label.replace('The ','') : String(index+1);
    label.style.left = point.anchor[0]*100+'%'; label.style.top = point.anchor[1]*100+'%';
    world.append(label);
  });
  if(!visited.has(room)) { world.classList.add('discovering'); visited.add(room); setTimeout(()=>world.classList.remove('discovering'),4000); }
  layoutWorld(layer);
}
function layoutWorld(layer) {
  const world = layer.querySelector('.world'); if(!world) return;
  const w = stage.clientWidth, h = stage.clientHeight, ratio = w/h;
  const isGate = layer.dataset.scene === 'gate';
  const contain = !isGate && (ratio < 1.15 || ratio > 2.1);
  const scale = portrait.matches && isGate ? Math.min(h/1024,w/690) : contain ? Math.min(w/1536,(portrait.matches?h-280:h)/1024) : Math.max(w/1536,h/1024);
  const dw = 1536*scale, dh = 1024*scale;
  const top = portrait.matches ? isGate ? Math.max(105,(h-dh)/2) : Math.max(160,(h-dh)*.40) : (h-dh)/2;
  Object.assign(world.style,{width:dw+'px',height:dh+'px',left:(w-dw)/2+'px',top:top+'px'});
  world.style.setProperty('--world-width',dw+'px'); world.style.setProperty('--world-height',dh+'px');
  world.style.setProperty('--door-left-x',(-434/1536*dw)+'px'); world.style.setProperty('--door-right-x',(-.5*dw)+'px'); world.style.setProperty('--door-y',(-205/1024*dh)+'px');
  app.style.setProperty('--scene-bottom',(top+dh)+'px');
}
function updateHud(room) {
  app.dataset.room = room; app.classList.remove('is-opening'); gateOpening = false; setCaption(null);
  $('scene-title').textContent = title(room) + ' — Cody Jiang’s castle';
  $('scene-location').textContent = room === 'gate' ? 'AT THE THRESHOLD' : title(room).toUpperCase();
  $('room-subtitle').textContent = room === 'gate' ? '' : room === 'hall' ? 'Four doorways. A few small worlds.' : content.rooms[room].subtitle;
  $('return-hall').hidden = room === 'gate' || room === 'hall'; $('map-control').hidden = room === 'gate'; $('room-guide').hidden = !content.rooms[room];
  $('skip-entrance').hidden = room !== 'gate';
  $('scene-hint').textContent = room === 'gate' ? (touch.matches?'Tap or drag the doors to enter.':'Click, drag, or use Enter to open the doors.') : room === 'hall' ? 'Choose an archway. Or take the stairs.' : (touch.matches?'Tap an object to open its story.':'Explore the objects that catch your eye.');
  document.title = room === 'gate' ? 'Cody Jiang — A Castle of Small Worlds' : title(room) + ' — Cody Jiang';
  $('scene-announcement').textContent = room === 'gate' ? 'Castle entrance. Open the doors to enter.' : room === 'hall' ? 'Inside the hall. Gallery on the left, study at the back left, observatory up the central stairs, workshop on the right.' : 'Entered '+title(room)+'. '+content.rooms[room].subtitle;
  document.querySelectorAll('.plan-room').forEach(button=>{ if(button.dataset.room === room) button.setAttribute('aria-current','location'); else button.removeAttribute('aria-current'); });
  $('plan-position').textContent = room === 'hall' ? 'You are here' : '';
}
async function changeRoom(room,version) {
  if(room === currentRoom) {
    if(room === 'gate' && gateOpening) {
      const gate = layers[layerIndex].querySelector('.gate-opening');
      gateOpening = false; app.classList.remove('is-opening');
      gate.classList.remove('is-opening','is-dragging'); doorAngles(gate,0); gate.querySelector('button').setAttribute('aria-busy','false');
    }
    return true;
  }
  const previous = currentRoom;
  const timer = setTimeout(()=>{ if(version === routeVersion) loading('Entering '+title(room)+'…'); },250);
  let image;
  try { image = await loadImage(room); }
  catch { clearTimeout(timer); if(version === routeVersion) loading('This space could not load. You can retry or use the Index.',()=>route()); return false; }
  clearTimeout(timer); if(version !== routeVersion) return false; loading();
  const old = layers[layerIndex], next = layers[1-layerIndex];
  next.className = 'scene-layer is-arriving'; next.inert = true; buildScene(next,room,image);
  const oldWorld = old.querySelector('.world');
  if(oldWorld) oldWorld.style.transformOrigin = nextOrigin ? nextOrigin.map(n=>n*100+'%').join(' ') : '50% 50%';
  nextOrigin = null;
  await frame(); if(version !== routeVersion) return false;
  old.className = 'scene-layer is-leaving'; old.inert = true;
  next.className = 'scene-layer is-visible'; next.inert = false;
  layerIndex = 1-layerIndex; currentRoom = room; updateHud(room);
  if(previous) {
    const target = room === 'hall' && content.rooms[previous] ? previous : null;
    const focus = usingKeyboard ? target ? next.querySelector(`[data-target="${target}"]`) : next.querySelector('button') : $('scene-title');
    focus?.focus({preventScroll:true});
  }
  await wait(previous?660:0); if(version !== routeVersion) return false;
  old.replaceChildren(); old.className = 'scene-layer';
  if(room === 'gate' && mayPreload()) {
    const idle = window.requestIdleCallback || (callback=>setTimeout(callback,1000));
    idle(()=>{ if(currentRoom === 'gate') prewarm('hall'); },{timeout:2000});
  }
  return true;
}
function renderDetail(id) {
  const d = content.details[id]; activeDetail = id;
  document.title = d.title + ' — Cody Jiang';
  $('detail-eyebrow').textContent = d.eyebrow; $('detail-title').textContent = d.title; $('detail-summary').textContent = d.summary;
  renderMedia($('detail-media'),d.media);
  const missing = $('detail-missing'); missing.replaceChildren(); missing.hidden = !d.missing?.length;
  if(d.missing?.length) {
    const h = document.createElement('h3'); h.textContent = 'Materials to be added';
    const list = document.createElement('ul');
    d.missing.forEach(text=>{ const li = document.createElement('li'); li.textContent = text; list.append(li); }); missing.append(h,list);
  }
  const sections = $('detail-sections'); sections.replaceChildren();
  d.sections.forEach(s=>{ const section = document.createElement('section'), h = document.createElement('h3'), p = document.createElement('p'); h.textContent = s.heading; p.textContent = s.body; section.append(h,p); sections.append(section); });
  const links = $('detail-links'); links.replaceChildren();
  d.links.forEach(l=>{
    const a = document.createElement('a'); a.href = l.href; a.textContent = l.label.replace(/\s*↗/g,'');
    if(/^https?:/.test(l.href)) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
    if(l.kind) { const kind = document.createElement('span'); kind.className = 'link-kind'; kind.textContent = l.kind; a.prepend(kind); }
    const arrow = document.createElement('span'); arrow.className = 'arrow-icon'; arrow.setAttribute('aria-hidden','true'); a.append(arrow); links.append(a);
  });
  $('detail-location').textContent = title(currentRoom); $('share-status').textContent = '';
  if(!detailDialog.open) detailDialog.showModal(); $('detail-body').scrollTop = 0;
}
function restoreFocus(id) {
  const button = layers[layerIndex].querySelector(`[data-target="${id}"]`) || $('room-guide');
  if(!button.hidden) button.focus({preventScroll:true});
}
function closeDetail() {
  if(!activeDetail) return;
  returnFocus = activeDetail;
  const state = history.state;
  if(state?.session === session && state.type === 'exhibit' && state.parentHash === pathFor(currentRoom)) history.back();
  else { history.replaceState({castle:true,type:'room'},'',pathFor(currentRoom)); route(); }
}
async function route() {
  const version = ++routeVersion; loading();
  const {room,detail,hash} = parseRoute(location.hash);
  if(location.hash && location.hash !== hash) history.replaceState({castle:true,type:detail?'exhibit':'room'},'',hash);
  routedHash = location.hash;
  const closed = activeDetail;
  if(detailDialog.open && activeDetail !== detail) { stopMedia($('detail-media')); detailDialog.close(); }
  if(mapDialog.open) mapDialog.close(); if(guideDialog.open) guideDialog.close();
  activeDetail = null;
  const ok = await changeRoom(room,version); if(!ok || version !== routeVersion) return;
  if(detail) renderDetail(detail);
  else if(closed) { document.title = title(room)+' — Cody Jiang'; restoreFocus(closed); }
}
function showGuide() {
  setCaption(null);
  $('guide-title').textContent = title(currentRoom);
  const links = $('guide-links'); links.replaceChildren();
  content.rooms[currentRoom].entries.forEach(id=>{
    const a = document.createElement('a'); a.href = pathFor(currentRoom,id);
    const h = document.createElement('strong'), p = document.createElement('span');
    h.textContent = content.details[id].title; p.textContent = content.details[id].eyebrow;
    a.append(h,p); a.onclick = e=>{ e.preventDefault(); returnFocus = id; go(currentRoom,id); }; links.append(a);
  });
  guideDialog.showModal();
}
$('return-hall').addEventListener('click',()=>go('hall'));
$('skip-entrance').addEventListener('click',()=>go('hall'));
$('map-control').addEventListener('click',()=>{ setCaption(null); mapDialog.showModal(); });
$('close-map').addEventListener('click',()=>mapDialog.close());
$('close-detail').addEventListener('click',closeDetail);
$('room-guide').addEventListener('click',showGuide);
$('close-guide').addEventListener('click',()=>guideDialog.close());
$('revisit-gate').addEventListener('click',()=>go('gate'));
document.querySelectorAll('.plan-room').forEach(button=>button.addEventListener('click',()=>go(button.dataset.room)));
detailDialog.addEventListener('close',()=>{ if(!detailDialog.open) stopMedia($('detail-media')); });
detailDialog.addEventListener('cancel',e=>{ e.preventDefault(); closeDetail(); });
[detailDialog,mapDialog,guideDialog].forEach(dialog=>dialog.addEventListener('click',e=>{
  if(e.target !== dialog) return;
  const r = dialog.getBoundingClientRect();
  if(e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) {
    if(dialog === detailDialog) closeDetail(); else dialog.close();
  }
}));
$('share-exhibit').addEventListener('click',async()=>{
  try { await navigator.clipboard.writeText(location.href); $('share-status').textContent = 'Exhibit link copied.'; }
  catch { $('share-status').textContent = 'Copy this address: '+location.href; }
});
document.addEventListener('keydown',e=>{
  usingKeyboard = true;
  if(e.key === 'Escape' && !detailDialog.open && !mapDialog.open && !guideDialog.open && content.rooms[currentRoom]) { e.preventDefault(); go('hall'); }
});
document.addEventListener('pointerdown',()=>{ usingKeyboard = false; },{passive:true});
const historyChange = () => { if(location.hash !== routedHash) route(); };
window.addEventListener('popstate',historyChange); window.addEventListener('hashchange',historyChange);
window.addEventListener('resize',()=>layers.forEach(layoutWorld));
route();
