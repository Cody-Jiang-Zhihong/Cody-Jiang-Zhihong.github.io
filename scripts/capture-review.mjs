import { chromium } from '@playwright/test';
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const directory = new URL('../docs/previews/',import.meta.url);
await mkdir(directory,{recursive:true});
const browser = await chromium.launch();
try {
  for(const [name,viewport] of [['desktop',{width:1440,height:900}],['phone',{width:390,height:844}]]) {
    const page=await browser.newPage({viewport,deviceScaleFactor:1,reducedMotion:'reduce',...(name==='phone'?{isMobile:true,hasTouch:true}:{})});
    for(const [view,hash] of [['gate','#gate'],['hall','#hall'],['study','#study'],['games','#workshop/games']]) {
      await page.goto('http://127.0.0.1:4173/'+hash);
      await page.locator('.scene-layer.is-visible').waitFor({state:'visible'});
      await page.locator('.is-leaving').waitFor({state:'detached'});
      await page.waitForFunction(()=>[...document.querySelectorAll('.scene-layer.is-visible')].every(el=>Number(getComputedStyle(el).opacity)===1));
      if(view==='games') {
        await page.locator('#detail-dialog').waitFor({state:'visible'});
        await page.locator('#detail-media img').first().waitFor({state:'visible'});
        await page.waitForFunction(()=>[...document.querySelectorAll('#detail-media img')].every(img=>img.complete));
      }
      const output=new URL(`${name}-${view}.webp`,directory);
      await sharp(await page.screenshot()).webp({quality:86}).toFile(fileURLToPath(output));
    }
    await page.close();
  }
} finally { await browser.close(); }
console.log('Saved desktop and phone review screenshots to docs/previews/');
