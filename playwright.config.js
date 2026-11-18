import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir:'./tests/browser',
  timeout:30000,
  expect:{timeout:7000},
  fullyParallel:true,
  workers:3,
  reporter:[['list'],['json',{outputFile:'.preview/browser-results.json'}]],
  use:{baseURL:'http://127.0.0.1:4173', browserName:'chromium', trace:'retain-on-failure'},
  projects:[
    {name:'desktop',use:{viewport:{width:1440,height:900}}},
    {name:'phone',use:{viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:2}},
    {name:'small-phone',use:{viewport:{width:320,height:568},isMobile:true,hasTouch:true,deviceScaleFactor:2}}
  ],
  webServer:{command:'node scripts/serve.mjs',url:'http://127.0.0.1:4173',reuseExistingServer:true}
});
