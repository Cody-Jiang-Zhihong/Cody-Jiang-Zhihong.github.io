// DOM integration checks exercise the actual app. They do not replace browser QA.
import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';
import { Window } from 'happy-dom';
import { content } from '../castle/content.js';
import { hallway, exhibits } from '../castle/scene-map.js';
import { parseRoute, pathFor } from '../castle/routes.js';
import { renderMedia, stopMedia } from '../castle/media.js';

const shell = await readFile(new URL('../index.html',import.meta.url),'utf8');
const source = (await readFile(new URL('../castle/app.js',import.meta.url),'utf8')).replace(/^import .+;\n/gm,'');
const delay = () => new Promise(resolve=>setTimeout(resolve,25));
async function setup(hash='', {mobile=false,reduced=false,failRoom=null}={}) {
  const win = new Window({url:'https://castle.test/'+hash});
  win.document.write(shell.replace(/<script[^>]*>.*?<\/script>/gs,''));
  const stage = win.document.getElementById('stage');
  Object.defineProperties(stage,{clientWidth:{get:()=>mobile?390:1440},clientHeight:{get:()=>mobile?844:900}});
  const requests = [];
  let failed = !!failRoom;
  class Image {
    set src(value) {
      this._src = value;
      if(!value) return;
      requests.push(value);
      queueMicrotask(()=>failed && value.includes(failRoom)?this.onerror?.():this.onload?.());
    }
    get src() { return this._src; }
  }
  const originalHistory = [{hash,state:null}]; let position = 0;
  const emit = () => { win.dispatchEvent(new win.PopStateEvent('popstate')); win.dispatchEvent(new win.HashChangeEvent('hashchange')); };
  const history = {
    get state() { return originalHistory[position].state; },
    pushState(state,_,hash) { win.location.hash = hash; originalHistory.splice(++position); originalHistory.push({hash,state}); },
    replaceState(state,_,hash) { win.location.hash = hash; originalHistory[position] = {hash,state}; },
    back() { if(position>0) { win.location.hash = originalHistory[--position].hash; emit(); } },
    forward() { if(position<originalHistory.length-1) { win.location.hash = originalHistory[++position].hash; emit(); } }
  };
  for(const dialog of win.document.querySelectorAll('dialog')) {
    dialog.showModal = () => { dialog._opener=win.document.activeElement; dialog.open = true; dialog.querySelector('button')?.focus(); };
    dialog.close = () => { dialog.open=false; dialog._opener?.focus(); dialog.dispatchEvent(new win.Event('close')); };
  }
  const context = {document:win.document,window:win,location:win.location,history,Image,content,hallway,exhibits,parseRoute,pathFor,
    navigator:{connection:{saveData:true}},innerWidth:mobile?390:1440,
    matchMedia:query=>({matches:query.includes('reduced-motion')?reduced:query.includes('hover')?mobile:query.includes('portrait')?mobile:false}),
    requestAnimationFrame:cb=>queueMicrotask(cb),
    setTimeout:(cb,ms)=>setTimeout(cb,Math.min(ms,12)),clearTimeout,console};
  context.renderMedia = (container,data)=>{ const doc = globalThis.document; globalThis.document=win.document; try { renderMedia(container,data); } finally { globalThis.document=doc; } };
  context.stopMedia = stopMedia;
  vm.runInNewContext(source,context);
  await delay();
  const $ = id=>win.document.getElementById(id);
  const click = async selector=>{ const element=win.document.querySelector(selector); assert.ok(element,selector); element.click(); await delay(); };
  return {win,$,history,requests,click,recover:()=>{failed=false;},dispose:()=>win.happyDOM.abort()};
}
for(const mobile of [false,true]) {
  test(`${mobile?'portrait':'desktop'}: gate, room, exhibit, history, and keyboard escape`,async()=>{
    const app=await setup('',{mobile});
    assert.equal(app.$('app').dataset.room,'gate');
    await app.click('.gate-hit');
    assert.equal(app.$('app').dataset.room,'hall');
    assert.equal(app.win.document.querySelectorAll('.is-visible .spatial-region').length,4);
    assert.ok(!app.requests.some(src=>src.includes('study-') || src.includes('workshop-')),'Rooms should not eagerly load');
    await app.click('.is-visible [data-target="study"]');
    await app.click('.is-visible [data-target="cv"]');
    assert.equal(app.$('detail-dialog').open,true);
    assert.equal(app.win.location.hash,'#study/cv');
    await app.click('#close-detail');
    assert.equal(app.$('detail-dialog').open,false);
    assert.equal(app.win.location.hash,'#study');
    assert.equal(app.win.document.activeElement.dataset.target,'cv');
    app.history.forward(); await delay();
    assert.equal(app.$('detail-dialog').open,true);
    const cancel = new app.win.Event('cancel',{cancelable:true}); app.$('detail-dialog').dispatchEvent(cancel); await delay();
    assert.equal(app.$('detail-dialog').open,false);
    app.win.document.dispatchEvent(new app.win.KeyboardEvent('keydown',{key:'Escape'})); await delay();
    assert.equal(app.$('app').dataset.room,'hall');
    await app.dispose();
  });
}
test('legacy experience deep link opens directly and closes inside the castle',async()=>{
  const app=await setup('#experience');
  assert.equal(app.win.location.hash,'#study/experience');
  assert.equal(app.$('detail-title').textContent,'Background & Experience');
  await app.click('#close-detail');
  assert.equal(app.win.location.hash,'#study');
  assert.equal(app.win.document.activeElement.id,'room-guide');
  await app.dispose();
});
test('failed scene can retry the same URL successfully',async()=>{
  const app=await setup('#observatory',{failRoom:'observatory'});
  assert.equal(app.$('retry-load').hidden,false);
  app.recover(); await app.click('#retry-load');
  assert.equal(app.$('app').dataset.room,'observatory');
  assert.equal(app.$('loading-status').hidden,true);
  assert.equal(app.requests.filter(src=>src.includes('observatory')).length,2);
  await app.dispose();
});
test('reduced motion supports entry and nonspatial room-guide exhibits',async()=>{
  const app=await setup('#great-hall',{reduced:true});
  await app.click('#room-guide');
  assert.equal(app.$('guide-dialog').open,true);
  await app.click('#guide-links a[href="#great-hall/airline"]');
  assert.equal(app.$('detail-dialog').open,true);
  assert.equal(app.$('detail-title').textContent,'Airline Ticket Booking System');
  await app.click('#close-detail');
  assert.equal(app.win.location.hash,'#great-hall');
  await app.dispose();
});
