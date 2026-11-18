import { chromium } from '@playwright/test';
import sharp from 'sharp';
import { mkdir, writeFile, copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const base = process.env.PREVIEW_URL || 'http://127.0.0.1:4173';
await mkdir(new URL('../castle/media/',import.meta.url),{recursive:true});
const browser = await chromium.launch();
const captures=[];
try {
  for(const [name,path] of [['project-150','/myGame/PROJECT_150/index.html'],['arcade','/myGame/Codys_Final_Proj/index.html'],['coffee','/webDev_C_Fall2022/week8/week8.html']]) {
    const context=await browser.newContext({viewport:{width:1366,height:768},...(name==='arcade'?{recordVideo:{dir:'.preview/recordings',size:{width:1366,height:768}}}:{})});
    const page=await context.newPage();
    const errors=[]; const listener=err=>errors.push(err.message); page.on('pageerror',listener);
    await page.goto(base+path); await page.waitForLoadState('networkidle');
    const target = page.locator(name === 'coffee'?'#container':'canvas').first();
    await target.waitFor({state:'visible'});
    if(name !== 'coffee') {
      await target.click();
      if(name==='arcade') { await page.keyboard.down('1'); await page.waitForTimeout(160); await page.keyboard.up('1'); }
      // A held key must span game frames for these original GameMaker builds.
      await page.keyboard.down('Space'); await page.waitForTimeout(200); await page.keyboard.up('Space');
      await page.waitForTimeout(450);
    }
    const bytes = name === 'coffee' ? await page.screenshot({fullPage:true}) : await target.screenshot();
    const file = new URL(`../castle/media/${name}.webp`,import.meta.url);
    await sharp(bytes).resize({width:1100,withoutEnlargement:true}).webp({quality:86}).toFile(fileURLToPath(file));
    captures.push({file:`castle/media/${name}.webp`,source:path,capturedAt:new Date().toISOString(),errors});
    if(name==='arcade') {
      await page.waitForTimeout(4500);
      const video=page.video(); await context.close();
      await copyFile(await video.path(),new URL('../castle/media/arcade-demo.webm',import.meta.url));
      captures.push({file:'castle/media/arcade-demo.webm',source:path,capturedAt:new Date().toISOString(),note:'Unedited local capture of the original browser build; title screen followed by gameplay.'});
    } else await context.close();
    page.off('pageerror',listener);
  }
} finally { await browser.close(); }
await writeFile(new URL('../docs/media-provenance.json',import.meta.url),JSON.stringify(captures,null,2)+'\n');
console.log(JSON.stringify(captures,null,2));
