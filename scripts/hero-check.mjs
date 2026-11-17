import assert from 'node:assert/strict';
import {chromium} from 'playwright-core';
const browser=await chromium.launch({executablePath:'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',headless:true});
const baseUrl = process.env.LASERX_URL ?? 'http://127.0.0.1:3000';
const report=[];
try{
 for(const width of [1440,1024,768,390]){
  const page=await browser.newPage({viewport:{width,height:900},reducedMotion:'no-preference'});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(baseUrl,{waitUntil:'networkidle'});
  await page.waitForFunction(()=>[...document.querySelectorAll('#proses video')].every(v=>v.readyState>=2));
  const travel=await page.locator('#proses').evaluate(s=>s.offsetHeight-innerHeight);
  const jump=async p=>{await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),travel*p);await page.waitForTimeout(450)};
  for(const [scene,p] of [['wood',.28],['mold',.56],['metal',.85]]){
   await jump(p);
   const layer=page.locator(`[data-scene="${scene}"]`);
   const data=await layer.evaluate(el=>({opacity:+getComputedStyle(el).opacity,time:el.querySelector('video').currentTime,height:el.getBoundingClientRect().height}));
   assert(data.opacity>.95,`${width}: ${scene} visible`);assert(data.time>.1,`${width}: ${scene} scrubbed`);assert(data.height>=890,`${width}: expanded media`);
   if(width===1440||width===390)await page.screenshot({path:`artifacts/hero-${width}-${scene}.png`});
  }
  await jump(.35);const forward=await page.locator('[data-scene="wood"] video').evaluate(v=>v.currentTime);
  await jump(.23);const back=await page.locator('[data-scene="wood"] video').evaluate(v=>v.currentTime);assert(back<forward,'reverse scroll seeks backwards');
  await jump(0);await page.getByRole('link',{name:'Xidmətləri kəşf et',exact:true}).focus();assert(await page.evaluate(()=>document.activeElement?.getAttribute('href'))==='#xidmetler');
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth),0);
  assert.equal(errors.length,0,errors.join(';'));
  await page.screenshot({path:`artifacts/hero-final-${width}.png`});
  report.push({width,reverse:true,scenes:3,errors});await page.close();
 }
 for (const locale of ['az','ru','en','tr']) {
  const localized = await browser.newPage({viewport:{width:390,height:844}});
  await localized.goto(baseUrl+(locale==='az'?'':'/'+locale),{waitUntil:'networkidle'});
  const layout = await localized.evaluate(()=>{
   const h = document.querySelector('h1');
   const copy = document.querySelector('[data-hero-copy]');
   const image = document.querySelector('[data-scene="wood"]');
   return {lines:h.getBoundingClientRect().height / parseFloat(getComputedStyle(h).lineHeight), copyBottom:copy.getBoundingClientRect().bottom, imageTop:image.getBoundingClientRect().top};
  });
  assert(layout.lines < 3.1,locale+': heading within three lines');
  assert(layout.copyBottom < layout.imageTop,locale+': mobile copy clears image');
  await localized.screenshot({path:'artifacts/hero-mobile-'+locale+'.png'});
  await localized.close();
 }
 const reduced=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
 await reduced.goto(baseUrl,{waitUntil:'networkidle'});
 assert.equal(await reduced.locator('#proses video[src]').count(),0);assert(await reduced.locator('#proses').evaluate(s=>s.offsetHeight<innerHeight+10));
 await reduced.screenshot({path:'artifacts/hero-reduced-motion.png'});
 console.log(JSON.stringify({ok:true,report,reducedMotion:true},null,2));
}finally{await browser.close()}
