'use strict';
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');

// A separate, bounded diagnostic gate. No production styles or animations are disabled.
async function waitRegion(page, row, label) {
  const result = await page.evaluate(async () => {
    const selectors = ['.editor-back','.editor-actions .soft-btn','.editor-title','.field>span',
      '#about a.soft-btn','#settingsPanel .set-tab','#settingsPanel .set-note',
      '#settingsPanel .theme-grid button','.mp-error-action','.mp-failure-copy'];
    const now = () => performance.now();
    const deadline = now() + 2000;
    const history = [];
    const rect = r => ({x:r.x,y:r.y,width:r.width,height:r.height});
    const visible = el => {
      const r = el.getBoundingClientRect(), s = getComputedStyle(el);
      return !!r.width && !!r.height && r.bottom > 0 && r.top < innerHeight &&
        r.right > 0 && r.left < innerWidth && s.display !== 'none' &&
        s.visibility !== 'hidden' && !el.closest('[inert],[hidden],[aria-hidden="true"]');
    };
    const overlap = (a,b) => a.right > b.left && a.left < b.right && a.bottom > b.top && a.top < b.bottom;
    function snapshot() {
      const roots = [...new Set(selectors.flatMap(s => [...document.querySelectorAll(s)]))].filter(visible);
      const boxes = roots.map(el => el.getBoundingClientRect());
      const items = roots.map(el => {
        const s=getComputedStyle(el), ancestors=[];
        for(let x=el;x;x=x.parentElement){const c=getComputedStyle(x);ancestors.push({tag:x.tagName,id:x.id,
          rect:rect(x.getBoundingClientRect()),display:c.display,visibility:c.visibility,opacity:c.opacity,
          transform:c.transform,background:c.backgroundColor,backgroundImage:c.backgroundImage,filter:c.filter});}
        return {tag:el.tagName,id:el.id,cls:String(el.className),rect:rect(el.getBoundingClientRect()),
          color:s.color,opacity:s.opacity,background:s.backgroundColor,ancestors};
      });
      const animations = document.getAnimations().map(a => {
        const target=a.effect?.target;
        if(!target?.getBoundingClientRect) return {state:a.playState,target:String(target),reason:'no-element-target',relevance:'unknown'};
        const r=target.getBoundingClientRect(),s=getComputedStyle(target);
        const related=roots.some(el=>target===el || target.contains(el) || el.contains(target));
        let reason=related?'target-or-ancestor':'overlap-or-unproven';
        let relevance=related?'related':'unknown';
        // Only establish disjointness when visual overflow cannot extend an element into the target.
        if(!related && (s.display==='none'||s.visibility==='hidden'||Number(s.opacity)===0)) {
          relevance='excluded'; reason='hidden';
        } else if(!related && !boxes.some(b=>overlap(r,b)) && s.boxShadow==='none' &&
                  s.filter==='none' && s.textShadow==='none' && s.outlineStyle==='none') {
          relevance='excluded';reason='rectangles-disjoint-and-no-measured-visual-overflow';
        }
        let keys=[];try{keys=[...new Set((a.effect?.getKeyframes?.()||[]).flatMap(Object.keys))];}catch{}
        let timing={};try{const t=a.effect?.getComputedTiming?.();timing={endTime:String(t?.endTime),progress:t?.progress,currentIteration:t?.currentIteration};}catch{}
        return {tag:target.tagName,id:target.id,cls:String(target.className),rect:rect(r),
          state:a.playState,display:s.display,visibility:s.visibility,opacity:s.opacity,
          boxShadow:s.boxShadow,filter:s.filter,textShadow:s.textShadow,keys,timing,relevance,reason};
      });
      const overlays=[...document.querySelectorAll('.cursor-dot,.cursor-ring')].filter(el=>{const r=el.getBoundingClientRect(),c=getComputedStyle(el);return c.display!=='none'&&c.visibility!=='hidden'&&+c.opacity>0&&boxes.some(b=>overlap(r,b));}).map(el=>{const c=getComputedStyle(el);return{cls:el.className,rect:rect(el.getBoundingClientRect()),opacity:c.opacity,transform:c.transform};});
      return {t:now(),scrollX,scrollY,items,animations,overlays};
    }
    function similar(a,b) {
      if(!a||a.items.length!==b.items.length||Math.abs(a.scrollX-b.scrollX)>.25||Math.abs(a.scrollY-b.scrollY)>.25)return false;
      if(a.overlays.length!==b.overlays.length)return false;for(let i=0;i<a.overlays.length;i++){const x=a.overlays[i],y=b.overlays[i];if(x.cls!==y.cls||x.opacity!==y.opacity||x.transform!==y.transform)return false;for(const k of ['x','y','width','height'])if(Math.abs(x.rect[k]-y.rect[k])>.25)return false;}
      for(let i=0;i<a.items.length;i++){
        const x=a.items[i],y=b.items[i];
        if(x.tag!==y.tag||x.id!==y.id||x.cls!==y.cls||x.color!==y.color||x.opacity!==y.opacity||x.background!==y.background||x.ancestors.length!==y.ancestors.length)return false;
        for(let j=0;j<x.ancestors.length;j++){
          const u=x.ancestors[j],v=y.ancestors[j];
          if(u.display!==v.display||u.visibility!==v.visibility||u.opacity!==v.opacity||u.transform!==v.transform||u.background!==v.background||u.backgroundImage!==v.backgroundImage||u.filter!==v.filter)return false;
          // Target rectangles below capture actual displacement; an offscreen ancestor's total height alone is not a target shift.
        }
        for(const k of ['x','y','width','height'])if(Math.abs(x.rect[k]-y.rect[k])>.25)return false;
      }
      return true;
    }
    let previous=null,matched=0;
    while(now()<deadline){
      const s=snapshot();history.push(s);if(history.length>6)history.shift();
      if(s.items.length && similar(previous,s))matched++;else matched=0;
      if(matched>=3)return {pass:true,deadlineMs:2000,history};
      previous=s;
      await new Promise(resolve=>{
        let timer;
        const frame=requestAnimationFrame(()=>{clearTimeout(timer);resolve();});
        timer=setTimeout(()=>{cancelAnimationFrame(frame);resolve();},Math.max(0,deadline-now()));
      });
    }
    return {pass:false,deadlineMs:2000,history,reason:'NO_STABLE_REGION_WITHIN_ORIGINAL_GATE'};
  });
  (row.stability ||= []).push({label,...result});
  if (!result.pass) throw Error('REGION_STABILITY_TIMEOUT_2000MS: see recorded geometry and animations');
}

function checkPixels(out,prefix,elements) {
  const python=process.env.PYTHON || 'python';
  const args=[path.resolve(__dirname,'../../tools/check-contrast-background.py'),path.join(out,prefix+'-background.png'),
    path.join(out,prefix+'-background-verification.png')];
  const r=cp.spawnSync(python,args,{input:JSON.stringify(elements),encoding:'utf8',timeout:10000});
  if(r.error || r.status!==0) return {stable:false,error:String(r.error||r.stderr||r.stdout),status:r.status};
  try{return JSON.parse(r.stdout);}catch(e){return {stable:false,error:String(e),stdout:r.stdout};}
}

async function logFailure(page,row,out) {
  try { row.failureState=await page.evaluate(()=>({url:location.href,readyState:document.readyState,
    theme:{html:document.documentElement.className,data:document.documentElement.dataset.theme,body:document.body.className},
    scroll:{x:scrollX,y:scrollY},active:{tag:document.activeElement?.tagName,id:document.activeElement?.id},
    audio:window.audio?{readyState:audio.readyState,networkState:audio.networkState,error:audio.error?.code,currentSrc:audio.currentSrc}:null,
    player:document.querySelector('#floatingPlayer')?.outerHTML?.slice(0,12000)})); } catch(e){row.failureStateError=String(e);}
  try { const name=row.name+'-FAIL.png';await page.screenshot({path:path.join(out,name),timeout:3000});row.failureScreenshot=name; }
  catch(e){row.failureScreenshotError=String(e);}
}
async function focusKeyboard(page, target, row, label) {
  const handle=await target.elementHandle();
  if(!handle)throw Error('KEYBOARD_TARGET_MISSING');
  const history=[];
  const record={label,target:await handle.evaluate(el=>({tag:el.tagName,id:el.id,text:el.textContent.trim().slice(0,80)})),sequence:history};
  (row.focusDiagnostics ||= []).push(record);
  await page.evaluate(()=>{window.__contrastFocusIds=new WeakMap();window.__contrastFocusSerial=0;});
  for(let i=0;i<120;i++){
    if(await handle.evaluate(el=>el===document.activeElement))return;
    history.push(await page.evaluate(()=>{
      const el=document.activeElement;
      if(!window.__contrastFocusIds.has(el))window.__contrastFocusIds.set(el,++window.__contrastFocusSerial);
      const r=el.getBoundingClientRect();return {key:window.__contrastFocusIds.get(el),tag:el.tagName,id:el.id,
        text:el.textContent.trim().slice(0,80),rect:{x:r.x,y:r.y,width:r.width,height:r.height}};
    }));
    // A repeated, identical focus cycle must occur three consecutive times. This
    // terminates only an unreachable target; no focus or contrast pass is inferred.
    const n=history.length;
    for(let period=1;period<=Math.min(40,Math.floor(n/3));period++){
      const tail=history.slice(n-period*3).map(x=>x.key);
      const same=tail.every((v,j)=>v===tail[j%period]);
      if(same && n>=Math.max(9,period*3)){
        record.cycle={start:n-period*3,period,repeats:3,eventsObserved:n};
        throw Error('KEYBOARD_TARGET_UNREACHABLE_FOCUS_CYCLE: '+JSON.stringify(record.cycle));
      }
    }
    await page.keyboard.press('Tab');
  }
  record.limit=120;
  throw Error('KEYBOARD_TARGET_UNREACHABLE_AFTER_120_TABS');
}
module.exports={waitRegion,checkPixels,logFailure,focusKeyboard};
