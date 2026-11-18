(() => {
  'use strict';
  const content = window.CASTLE_CONTENT;
  if (!content) return;
  const $ = id => document.getElementById(id);
  const app = $('app'), stage = $('stage'), dialog = $('detail-dialog'), mapDialog = $('map-dialog');
  const layers = [$('scene-a'), $('scene-b')];
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const touch = matchMedia('(hover: none)');
  const imageCache = new Map(), visited = new Set();
  let currentRoom = null, layerIndex = 0, routeVersion = 0, activeDetail = null, routedHash = null;
  let gateOpening = false, nextOrigin = null, returnFocus = null;
  const hallway = [
    {room:'great-hall',label:'The Gallery',subtitle:'SELECTED WORK',anchor:[.13,.70],points:[[.028,.456],[.038,.409],[.055,.366],[.080,.333],[.113,.310],[.139,.312],[.169,.334],[.196,.369],[.217,.415],[.232,.476],[.232,.714],[.030,.762]]},
    {room:'study',label:'The Study',subtitle:'ABOUT & CV',anchor:[.375,.63],points:[[.300,.457],[.323,.410],[.344,.390],[.374,.385],[.408,.406],[.433,.445],[.451,.478],[.451,.633],[.301,.657]]},
    {room:'observatory',label:'The Observatory',subtitle:'RESEARCH',anchor:[.60,.66],points:[[.480,.696],[.708,.696],[.724,.642],[.725,.486],[.726,.366],[.731,.318],[.724,.208],[.703,.151],[.669,.115],[.628,.106],[.591,.130],[.567,.178],[.561,.266],[.517,.303],[.506,.334],[.511,.371],[.544,.418],[.551,.444],[.548,.501],[.534,.566],[.503,.623],[.477,.662]]},
    {room:'workshop',label:'The Workshop',subtitle:'GAMES & CRAFT',anchor:[.87,.69],points:[[.783,.515],[.794,.452],[.815,.409],[.846,.371],[.881,.349],[.913,.353],[.943,.381],[.962,.429],[.973,.483],[.975,.747],[.785,.702]]}
  ];
  const exhibits = {
    'great-hall':[
      {detail:'abyssalpact',label:'Gameplay AI',subtitle:'THE STRATEGY TABLE',anchor:[.25,.73],points:[[.08,.65],[.28,.58],[.43,.69],[.43,.87],[.08,.87]]},
      {detail:'jepa',label:'JEPA World Model',subtitle:'THE LATENT SCULPTURE',anchor:[.57,.58],points:[[.46,.31],[.66,.31],[.69,.69],[.46,.70]]},
      {detail:'steam',label:'Steam Review Radar',subtitle:'THE SIGNAL INSTRUMENT',anchor:[.82,.66],points:[[.72,.43],[.92,.43],[.95,.76],[.72,.77]]}
    ],
    observatory:[
      {detail:'debt',label:'Code & Technical Debt',subtitle:'NOTES ON THE DESK',anchor:[.24,.70],points:[[.08,.62],[.37,.61],[.40,.83],[.09,.84]]},
      {detail:'jepa',label:'JEPA World Model',subtitle:'A STUDY OF POSSIBLE FUTURES',anchor:[.50,.56],points:[[.38,.25],[.63,.25],[.65,.69],[.38,.70]]}
    ],
    workshop:[
      {detail:'games',label:'Games & Experiments',subtitle:'AT THE COMPUTER',anchor:[.30,.60],points:[[.17,.39],[.41,.39],[.43,.76],[.17,.76]]},
      {detail:'craft',label:'The Miniature Bench',subtitle:'PAINTING & KITBASHING',anchor:[.63,.64],points:[[.50,.37],[.73,.37],[.76,.76],[.50,.76]]},
      {detail:'jiji',label:'Meet JiJi',subtitle:'THE STUDIO COMPANION',anchor:[.88,.66],points:[[.80,.45],[.98,.45],[.99,.76],[.80,.76]]}
    ],
    study:[
      {detail:'cv',label:'Curriculum Vitae',subtitle:'OPEN THE FOLIO',anchor:[.35,.74],points:[[.19,.65],[.43,.63],[.47,.84],[.20,.86]]},
      {detail:'about',label:'About Cody',subtitle:'THE PERSON BEHIND THE PROJECTS',anchor:[.64,.41],points:[[.53,.15],[.75,.15],[.75,.49],[.53,.49]]},
      {detail:'contact',label:'Get in Touch',subtitle:'A LETTER FROM THE STUDY',anchor:[.82,.64],points:[[.72,.51],[.91,.51],[.94,.77],[.72,.77]]}
    ]
  };
  const asset = room => 'assets/' + ({gate:'gate-v2',hall:'hall-map-v2'}[room] || room) + '.png';
  const title = room => room === 'gate' ? 'At the threshold' : room === 'hall' ? 'The Hall' : content.rooms[room].title;
  const wait = ms => new Promise(resolve => setTimeout(resolve, motion.matches ? 0 : ms));
  const frame = () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));

  function loadImage(room) {
    if (imageCache.has(room)) return imageCache.get(room);
    const promise = new Promise((resolve,reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => { imageCache.delete(room); reject(new Error('Scene unavailable')); };
      img.src = asset(room);
    });
    imageCache.set(room,promise);
    return promise;
  }
  function loading(message, retry) {
    $('loading-status').hidden = !message;
    $('loading-text').textContent = message || '';
    $('retry-load').hidden = !retry;
    $('retry-load').onclick = retry || null;
  }
  function go(room,detail,origin) {
    const path = '#' + room + (detail ? '/' + detail : '');
    nextOrigin = origin || null;
    if (location.hash !== path) history.pushState({castle:true,type:detail?'exhibit':'room',parent:currentRoom},'',path);
    route();
  }
  function setCaption(point) {
    document.querySelector('.scene-guidance').classList.toggle('has-hover',!!point);
    if (point) { $('hover-title').textContent=point.label; $('hover-subtitle').textContent=point.subtitle; }
  }
  function spatialButton(point,index,room) {
    const button = document.createElement('button');
    const xs=point.points.map(p=>p[0]), ys=point.points.map(p=>p[1]);
    const x=Math.min(...xs), y=Math.min(...ys), w=Math.max(...xs)-x, h=Math.max(...ys)-y;
    const local = point.points.map(p=>[(p[0]-x)/w*100,(p[1]-y)/h*100]);
    button.className='spatial-region'+(point.detail?' object-region':'');
    button.type='button';button.dataset.target=point.detail || point.room;
    button.setAttribute('aria-label',(point.detail?'Open ':'Enter ')+point.label);
    button.style.cssText=`left:${x*100}%;top:${y*100}%;width:${w*100}%;height:${h*100}%;clip-path:polygon(${local.map(p=>p[0]+'% '+p[1]+'%').join(',')});--reveal-delay:${.4+index*.38}s`;
    const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
    svg.classList.add('region-light');svg.setAttribute('viewBox','0 0 100 100');svg.setAttribute('preserveAspectRatio','none');svg.setAttribute('aria-hidden','true');
    const polygon=document.createElementNS('http://www.w3.org/2000/svg','polygon');polygon.setAttribute('points',local.map(p=>p.join(',')).join(' '));svg.append(polygon);
    const marker=document.createElement('span');marker.className='region-marker';marker.setAttribute('aria-hidden','true');
    marker.style.left=((point.anchor[0]-x)/w*100)+'%';marker.style.top=((point.anchor[1]-y)/h*100)+'%';
    button.append(svg,marker);
    button.addEventListener('pointerenter',()=>{if(!touch.matches)setCaption(point);});
    button.addEventListener('pointerleave',()=>setCaption(null));
    button.addEventListener('focus',()=>{if(button.matches(':focus-visible'))setCaption(point);});
    button.addEventListener('blur',()=>setCaption(null));
    button.addEventListener('click',()=>{setCaption(null);returnFocus=point.detail||point.room;go(point.room||room,point.detail,point.anchor);});
    return button;
  }
  function doorAngles(gate,progress) {
    gate.style.setProperty('--left-angle',(progress*88)+'deg');
    gate.style.setProperty('--right-angle',(-progress*88)+'deg');
  }
  function makeGate(world) {
    const gate=document.createElement('div');gate.className='gate-opening';
    gate.innerHTML='<div class="gate-interior" aria-hidden="true"></div><div class="door-leaf door-left" aria-hidden="true"></div><div class="door-leaf door-right" aria-hidden="true"></div><button class="gate-hit" aria-label="Push open the castle doors"><span class="sr-only">Click, drag, or press Enter to open the doors and enter the hall.</span></button>';
    world.append(gate);
    const button=gate.querySelector('button');
    let start=null, progress=0, suppressClick=false;
    button.addEventListener('pointerdown',e=>{
      if(gateOpening||e.button!==0)return;
      start={x:e.clientX,y:e.clientY};progress=0;suppressClick=false;
      button.setPointerCapture(e.pointerId);gate.classList.add('is-dragging');
    });
    button.addEventListener('pointermove',e=>{
      if(!start||gateOpening)return;
      const distance=Math.hypot(e.clientX-start.x,e.clientY-start.y);
      progress=Math.min(.85,distance/Math.min(stage.clientWidth*.35,220));
      if(distance>6){suppressClick=true;doorAngles(gate,progress);}
    });
    button.addEventListener('pointerup',()=>{
      if(!start)return;start=null;gate.classList.remove('is-dragging');
      if(progress>.13)openGate(gate);else {doorAngles(gate,0);suppressClick=false;}
    });
    button.addEventListener('pointercancel',()=>{start=null;suppressClick=false;gate.classList.remove('is-dragging');doorAngles(gate,0);});
    button.addEventListener('click',e=>{if(suppressClick&&e.detail!==0){suppressClick=false;return;}suppressClick=false;openGate(gate);});
  }
  async function openGate(gate) {
    if(gateOpening||currentRoom!=='gate')return;
    gateOpening=true;const request=routeVersion;
    app.classList.add('is-opening');gate.querySelector('button').setAttribute('aria-busy','true');
    const timer=setTimeout(()=>{if(request===routeVersion)loading('Preparing the hall…');},450);
    try {await loadImage('hall');}
    catch(error){clearTimeout(timer);if(request!==routeVersion)return;gateOpening=false;app.classList.remove('is-opening');gate.querySelector('button').setAttribute('aria-busy','false');doorAngles(gate,0);loading('The hall could not load.',()=>openGate(gate));return;}
    clearTimeout(timer);if(request!==routeVersion||currentRoom!=='gate')return;loading();
    gate.classList.add('is-opening');doorAngles(gate,1);
    await wait(720);
    if(request!==routeVersion||currentRoom!=='gate')return;
    go('hall',null,[.5,.54]);
  }
  function buildScene(layer,room) {
    layer.replaceChildren();layer.dataset.scene=room;
    const ambient=document.createElement('div');ambient.className='scene-ambient';ambient.style.backgroundImage=`url("${asset(room)}")`;ambient.setAttribute('aria-hidden','true');
    const world=document.createElement('div');world.className='world';
    const img=document.createElement('img');img.className='scene-art';img.src=asset(room);img.alt='';img.draggable=false;
    world.append(img);layer.append(ambient,world);
    if(room==='gate')makeGate(world);
    else (room==='hall'?hallway:exhibits[room]).forEach((p,i)=>world.append(spatialButton(p,i,room)));
    if(!visited.has(room)){world.classList.add('discovering');visited.add(room);setTimeout(()=>world.classList.remove('discovering'),4000);}
    layoutWorld(layer);
  }
  function layoutWorld(layer) {
    const world=layer.querySelector('.world');if(!world)return;
    const w=stage.clientWidth,h=stage.clientHeight,ratio=w/h;
    // Keep every destination visible on portrait and ultrawide screens.
    const contain=layer.dataset.scene!=='gate' && (ratio<1.15 || ratio>2.1);
    const scale=contain?Math.min(w/1536,h/1024):Math.max(w/1536,h/1024);
    const dw=1536*scale,dh=1024*scale;
    world.style.width=dw+'px';world.style.height=dh+'px';world.style.left=(w-dw)/2+'px';world.style.top=(h-dh)/2+'px';
    world.style.setProperty('--world-width',dw+'px');world.style.setProperty('--world-height',dh+'px');
    world.style.setProperty('--door-left-x',(-434/1536*dw)+'px');world.style.setProperty('--door-right-x',(-.5*dw)+'px');world.style.setProperty('--door-y',(-205/1024*dh)+'px');
  }
  function updateHud(room) {
    app.dataset.room=room;app.classList.remove('is-opening');gateOpening=false;setCaption(null);
    $('scene-title').textContent=title(room)+" — Cody Jiang's castle";
    $('scene-location').textContent=room==='gate'?'AT THE THRESHOLD':title(room).toUpperCase();
    $('return-hall').hidden=room==='gate'||room==='hall';$('map-control').hidden=room==='gate';
    $('scene-hint').textContent=room==='gate'?(touch.matches?'Tap or drag the doors to push them open.':'Click or drag the doors to push them open.'):room==='hall'?'Choose an archway. Or take the stairs.':(touch.matches?'Touch something that catches your eye.':'Explore the objects that catch your eye.');
    document.title=(room==='gate'?'Cody Jiang — A Castle of Small Worlds':title(room)+' — Cody Jiang');
    $('scene-announcement').textContent=room==='gate'?'Castle entrance. Open the doors to enter.':room==='hall'?'Inside the hall. The gallery is on the left, the study at the back, the observatory up the stairs, and the workshop on the right.':'Entered '+title(room)+'. '+content.rooms[room].subtitle;
    document.querySelectorAll('.plan-room').forEach(b=>{if(b.dataset.room===room)b.setAttribute('aria-current','location');else b.removeAttribute('aria-current');});
    $('plan-position').textContent=room==='hall'?'You are here':'';
  }
  async function changeRoom(room,version) {
    if(room===currentRoom){
      loading();
      if(room==='gate'&&gateOpening){
        const gate=layers[layerIndex].querySelector('.gate-opening');
        gateOpening=false;app.classList.remove('is-opening');
        if(gate){gate.classList.remove('is-opening','is-dragging');doorAngles(gate,0);gate.querySelector('button').setAttribute('aria-busy','false');}
      }
      return true;
    }
    const previous=currentRoom;
    const timer=setTimeout(()=>{if(version===routeVersion)loading('Entering '+title(room)+'…');},350);
    try {await loadImage(room);}
    catch(error){clearTimeout(timer);if(version===routeVersion)loading('This space could not load.',()=>route());return false;}
    clearTimeout(timer);if(version!==routeVersion)return false;loading();
    const old=layers[layerIndex],next=layers[1-layerIndex];
    next.className='scene-layer is-arriving';next.inert=true;buildScene(next,room);
    const oldWorld=old.querySelector('.world');
    if(oldWorld)oldWorld.style.transformOrigin=(nextOrigin?nextOrigin.map(n=>n*100+'%').join(' '):'50% 50%');
    nextOrigin=null;
    await frame();if(version!==routeVersion)return false;
    old.className='scene-layer is-leaving';old.inert=true;
    next.className='scene-layer is-visible';next.inert=false;
    layerIndex=1-layerIndex;currentRoom=room;updateHud(room);
    if(previous && room==='hall' && content.rooms[previous])returnFocus=previous;
    if(previous){
      const focus=room==='hall'&&returnFocus?next.querySelector(`[data-target="${returnFocus}"]`):next.querySelector('button');
      if(focus)focus.focus({preventScroll:true});
    }
    await wait(previous?660:0);if(version!==routeVersion)return false;
    old.replaceChildren();old.className='scene-layer';
    if(room==='hall')Object.keys(content.rooms).forEach(r=>loadImage(r).catch(()=>{}));
    return true;
  }
  function renderDetail(id) {
    const d=content.details[id];activeDetail=id;
    $('detail-eyebrow').textContent=d.eyebrow;$('detail-title').textContent=d.title;$('detail-summary').textContent=d.summary;
    const sections=$('detail-sections');sections.replaceChildren();
    d.sections.forEach(s=>{const section=document.createElement('section'),h=document.createElement('h3'),p=document.createElement('p');h.textContent=s.heading;p.textContent=s.body;section.append(h,p);sections.append(section);});
    const links=$('detail-links');links.replaceChildren();
    d.links.forEach(l=>{const a=document.createElement('a');a.href=l.href;a.textContent=l.label.replace(/\s*↗/g,'');if(!l.href.startsWith('mailto:')){a.target='_blank';a.rel='noopener';}const arrow=document.createElement('span');arrow.className='arrow-icon';arrow.setAttribute('aria-hidden','true');a.append(arrow);links.append(a);});
    $('detail-location').textContent=title(currentRoom);
    if(!dialog.open)dialog.showModal();dialog.scrollTop=0;
  }
  function closeDetail() {
    if(!activeDetail)return;
    returnFocus=activeDetail;
    if(history.state?.type==='exhibit' && history.state.parent===currentRoom)history.back();
    else {history.replaceState({castle:true,type:'room'},'','#'+currentRoom);route();}
  }
  async function route() {
    const version=++routeVersion;
    loading();
    let [room,detail]=location.hash.slice(1).split('/');room=room||'gate';
    if(room==='castle'){room='hall';history.replaceState({castle:true,type:'room'},'','#hall');}
    if(!['gate','hall',...Object.keys(content.rooms)].includes(room)){room='hall';detail=null;history.replaceState({castle:true,type:'room'},'','#hall');}
    const validDetail=detail && exhibits[room]?.some(e=>e.detail===detail);
    if(detail&&!validDetail){detail=null;history.replaceState({castle:true,type:'room'},'','#'+room);}
    routedHash=location.hash;
    const closed=activeDetail;
    if(dialog.open && activeDetail!==detail)dialog.close();
    if(mapDialog.open)mapDialog.close();
    activeDetail=null;
    const ok=await changeRoom(room,version);if(!ok||version!==routeVersion)return;
    if(detail)renderDetail(detail);
    else if(closed){const button=layers[layerIndex].querySelector(`[data-target="${closed}"]`);if(button)button.focus({preventScroll:true});}
  }
  $('return-hall').addEventListener('click',()=>go('hall'));
  $('skip-entrance').addEventListener('click',()=>go('hall'));
  $('map-control').addEventListener('click',()=>{setCaption(null);mapDialog.showModal();});
  $('close-map').addEventListener('click',()=>mapDialog.close());
  $('close-detail').addEventListener('click',closeDetail);
  $('revisit-gate').addEventListener('click',()=>go('gate'));
  document.querySelectorAll('.plan-room').forEach(b=>b.addEventListener('click',()=>go(b.dataset.room)));
  dialog.addEventListener('cancel',e=>{e.preventDefault();closeDetail();});
  [dialog,mapDialog].forEach(d=>d.addEventListener('click',e=>{if(e.target!==d)return;const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom){if(d===dialog)closeDetail();else d.close();}}));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!dialog.open&&!mapDialog.open&&content.rooms[currentRoom]){e.preventDefault();go('hall');}});
  const historyChange=()=>{if(location.hash!==routedHash)route();};
  window.addEventListener('popstate',historyChange);window.addEventListener('hashchange',historyChange);
  window.addEventListener('resize',()=>layers.forEach(layoutWorld));
  route();loadImage('hall').catch(()=>{});
})();
