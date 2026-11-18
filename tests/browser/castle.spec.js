import { test, expect } from '@playwright/test';
import { hallway, exhibits } from '../../castle/scene-map.js';
async function scene(page,room) {
  await expect(page.locator('#app')).toHaveAttribute('data-room',room);
  await expect(page.locator(`.is-visible[data-scene="${room}"]`)).toBeVisible();
  await expect(page.locator('.is-leaving')).toHaveCount(0);
}
async function spatial(page,target,isMobile) {
  const point = [...hallway,...Object.values(exhibits).flat()].find(p=>(p.room || p.detail) === target);
  const world = page.locator('.scene-layer.is-visible .world');
  const box = await world.boundingBox();
  const x = box.x + box.width*point.anchor[0], y = box.y + box.height*point.anchor[1];
  if(isMobile) await page.touchscreen.tap(x,y); else await page.mouse.click(x,y);
}
test('gate opens with click/tap; all entrances and objects work',async({page,isMobile},testInfo)=>{
  const errors=[]; page.on('pageerror',err=>errors.push(err.message));
  const requested=[]; page.on('request',req=>{if(req.url().endsWith('.webp')) requested.push(req.url());});
  await page.goto('/'); await scene(page,'gate');
  await page.screenshot({path:`.preview/${testInfo.project.name}-gate.png`});
  await page.getByRole('button',{name:'Push open the castle doors'}).click(); await scene(page,'hall');
  await page.screenshot({path:`.preview/${testInfo.project.name}-hall.png`});
  expect(requested.filter(src=>/study-|workshop-|observatory-|great-hall-/.test(src))).toHaveLength(0);
  for(const [room,detail] of [['great-hall','abyssalpact'],['study','cv'],['observatory','jepa'],['workshop','games']]) {
    await spatial(page,room,isMobile); await scene(page,room);
    await spatial(page,detail,isMobile);
    await expect(page.locator('#detail-dialog')).toBeVisible();
    await expect(page).toHaveURL(new RegExp('#'+room+'/'+detail+'$'));
    await page.getByRole('button',{name:'Close exhibit',exact:true}).click();
    await expect(page.locator('#detail-dialog')).not.toBeVisible();
    await expect(page.locator(`.is-visible [data-target="${detail}"]`)).toBeFocused();
    await page.getByRole('button',{name:'Hall',exact:true}).click(); await scene(page,'hall');
  }
  expect(errors).toEqual([]);
});
test('deep links, browser back/forward, and old hashes restore state',async({page})=>{
  await page.goto('/#experience');
  await expect(page).toHaveURL(/#study\/experience$/);
  await expect(page.getByRole('heading',{name:'Background & Experience'})).toBeVisible();
  await page.getByRole('button',{name:'Close exhibit',exact:true}).click();
  await expect(page).toHaveURL(/#study$/);
  await page.locator('.is-visible [data-target="cv"]').press('Enter');
  await expect(page.locator('#detail-dialog')).toBeVisible();
  await page.goBack(); await expect(page.locator('#detail-dialog')).not.toBeVisible();
  await page.goForward(); await expect(page.locator('#detail-dialog')).toBeVisible();
  await page.reload(); await expect(page.locator('#detail-dialog')).toBeVisible();
  await page.keyboard.press('Escape'); await expect(page).toHaveURL(/#study$/);
  await page.goto('/#projects'); await scene(page,'great-hall');
  await page.getByRole('button',{name:'Room guide',exact:false}).click();
  await page.getByRole('link',{name:/Airline Ticket Booking System/}).click();
  await expect(page.getByRole('heading',{name:'Airline Ticket Booking System'})).toBeVisible();
});
test('keyboard gate, drag gate, floorplan, and reduced motion',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/#gate'); await scene(page,'gate');
  await page.keyboard.press('Tab'); await expect(page.getByRole('button',{name:'Go straight to the hall'})).toBeFocused();
  await page.keyboard.press('Tab'); await expect(page.getByRole('link',{name:'Read the concise portfolio'})).toBeFocused();
  await page.keyboard.press('Tab'); await expect(page.locator('.gate-hit')).toBeFocused();
  await page.keyboard.press('Space'); await scene(page,'hall');
  await page.getByRole('button',{name:'Open castle floor plan'}).click();
  await expect(page.locator('#map-dialog')).toBeVisible();
  await page.keyboard.press('Escape'); await expect(page.getByRole('button',{name:'Open castle floor plan'})).toBeFocused();
  await page.getByRole('button',{name:'Open castle floor plan'}).click();
  await page.getByRole('button',{name:'Return to the front door'}).click(); await scene(page,'gate');
  const door = await page.locator('.gate-hit').boundingBox();
  await page.mouse.move(door.x+door.width*.5,door.y+door.height*.5); await page.mouse.down();
  await page.mouse.move(door.x+door.width*.5+70,door.y+door.height*.5,{steps:8}); await page.mouse.up();
  await scene(page,'hall');
  const transform = await page.locator('.is-visible .world').evaluate(el=>getComputedStyle(el).transform);
  expect(transform).toBe('matrix(1, 0, 0, 1, 0, 0)');
});
test('blocked scene displays retry and recovers without changing URL',async({page})=>{
  let blocked = true;
  await page.route('**/observatory-*.webp',route=>blocked?route.abort():route.continue());
  await page.goto('/#observatory');
  await expect(page.getByRole('button',{name:'Try again',exact:true})).toBeVisible();
  blocked=false; await page.getByRole('button',{name:'Try again',exact:true}).click();
  await scene(page,'observatory'); await expect(page.locator('#loading-status')).toBeHidden();
  await expect(page).toHaveURL(/#observatory$/);
});
test('scene destinations stay on screen and meet touch-size bounds',async({page})=>{
  await page.goto('/#hall'); await scene(page,'hall');
  const dimensions = await page.locator('.is-visible .spatial-region').evaluateAll(buttons=>buttons.map(button=>{
    const r=button.getBoundingClientRect();
    return {label:button.getAttribute('aria-label'),x:r.x,y:r.y,w:r.width,h:r.height,right:r.right,bottom:r.bottom,vw:innerWidth,vh:innerHeight};
  }));
  for(const d of dimensions) {
    expect(d.x,d.label).toBeGreaterThanOrEqual(0); expect(d.right,d.label).toBeLessThanOrEqual(d.vw);
    expect(d.y,d.label).toBeGreaterThanOrEqual(0); expect(d.bottom,d.label).toBeLessThanOrEqual(d.vh);
    expect(d.w,d.label).toBeGreaterThanOrEqual(44); expect(d.h,d.label).toBeGreaterThanOrEqual(44);
  }
  expect(await page.evaluate(()=>document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
test('the concise portfolio works with JavaScript disabled',async({browser},testInfo)=>{
  const ctx=await browser.newContext({javaScriptEnabled:false,viewport:testInfo.project.use.viewport});
  const page=await ctx.newPage();
  await page.goto('http://127.0.0.1:4173/');
  await page.getByRole('link',{name:'Read the portfolio — projects, experience, CV & contact'}).click();
  await expect(page.getByRole('heading',{name:'Zhihong (Cody) Jiang',exact:true})).toBeVisible();
  await page.getByRole('link',{name:'CV & resumes',exact:true}).click();
  await expect(page).toHaveURL(/read\.html#resume$/);
  expect(await page.locator('main a[href*="myResume"]').count()).toBeGreaterThanOrEqual(5);
  await ctx.close();
});
test('real media is lazy, plays on request, stops on close, and retries failed images',async({page})=>{
  let blockImage=true;
  const videos=[]; page.on('request',request=>{if(request.url().endsWith('.webm')) videos.push(request.url());});
  await page.route('**/project-150.webp',route=>blockImage?route.abort():route.continue());
  await page.goto('/#workshop/games');
  await expect(page.locator('#detail-dialog')).toBeVisible();
  await expect(page.getByRole('button',{name:'Retry image',exact:true})).toBeVisible();
  expect(videos).toHaveLength(0);
  blockImage=false; await page.getByRole('button',{name:'Retry image',exact:true}).click();
  await expect(page.locator('#detail-media img[src$="project-150.webp"]')).toBeVisible();
  const video=page.locator('#detail-media video');
  await video.scrollIntoViewIfNeeded();
  await video.evaluate(el=>el.play());
  await expect.poll(()=>video.evaluate(el=>el.currentTime)).toBeGreaterThan(0);
  await page.getByRole('button',{name:'Close exhibit',exact:true}).click();
  await expect.poll(()=>video.getAttribute('src')).toBeNull();
});
