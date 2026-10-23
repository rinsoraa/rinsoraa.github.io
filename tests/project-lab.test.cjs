'use strict';
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const window={},document={readyState:'loading',addEventListener(){},querySelector(){return null;}};
const context={window,document,URL,URLSearchParams};
for(const file of ['projects-data.js','projects.js','project-lab-data.js','project-lab-model.js'])vm.runInNewContext(fs.readFileSync(file,'utf8'),context);
const M=window.RinsoraLabModel,RP=window.RinsoraProjects,data=RP.read();
for(const q of ['', '?lab=1','?ui02=1','?ui02=0&lab=1','?ui02=1&lab=01'])assert.equal(M.enabled(q),false);
for(const q of ['?ui02=1&lab=1','?cover=1&ui02=1&lab=1'])assert.equal(M.enabled(q),true);
for(const n of [0,1,2,3,6]){
 const sample={categories:data.categories,items:data.items.slice(0,n)},model=M.build(sample,window.RINSORA_PROJECT_LAB,RP.newestFirst);
 assert.equal(model.items.length,n);assert.equal(model.find('missing'),null);assert.equal(model.filter('').length,n);
 for(const p of model.items){const html=M.card(p,false);assert(html.includes(M.href(p.id)));assert.equal(html.includes('<img'),Boolean(p.cover));assert(html.includes(p.name));}
 assert(model.categories.every(c=>model.filter(c).length>0));
}
const model=M.build(data,window.RINSORA_PROJECT_LAB,RP.newestFirst);
assert(!/class="lab-card(?:[ "-])/.test(M.card(model.items[0],true)), 'gallery must not reuse the existing settings lab-card class');
assert.deepEqual(Array.from(model.featured,p=>p.id),['catoobot','dsh-pulse-rail','trayhider']);
const reversed=M.build({...data,items:[...data.items].reverse()},window.RINSORA_PROJECT_LAB,RP.newestFirst);
assert.deepEqual(Array.from(reversed.featured,p=>p.id),['catoobot','dsh-pulse-rail','trayhider']);
assert.equal(model.filter('Bot').length,1);assert.equal(model.filter('Github项目').length,5);assert.equal(model.filter('missing').length,0);
assert.equal(M.route('#/lab/catoobot'),'catoobot');assert.equal(M.route('#/post/hello.html'),null);assert.equal(M.route('#project'),null);
assert.equal(M.route('#/lab/%E0%A4%A'),'');assert.equal(M.route('#/lab/%3Cscript%3E'),'');
for(const url of ['javascript:alert(1)','data:text/html,x','http://example.com','//example.com','https://user:secret@example.com','https://example.com/\nx'])assert.equal(M.external(url),'');
assert.equal(M.external('https://github.com/rinsoraa/CatooBot'),'https://github.com/rinsoraa/CatooBot');
for(const src of ['https://evil/x.webp','assets/projects/other/cover.webp','assets/projects/catoobot/../x.webp','assets/projects/catoobot/%2e%2e.webp','assets/projects/catoobot/x.svg','assets/projects/catoobot/x.webp?x','assets/projects/catoobot/a\\b.webp'])assert.equal(M.media({src,width:100,height:80},'catoobot'),null);
assert.equal(M.media({src:'assets/projects/catoobot/cover.webp'},'catoobot'),null);
assert(M.media({src:'assets/projects/catoobot/cover.webp',width:100,height:80},'catoobot'));
const hostile={...data.items[0],id:'safe-id',name:'<img src=x onerror=alert(1)>',desc:'" & <script>',category:'<tag>',url:'javascript:alert(1)',tags:['<b>'],status:'<svg>'};
const hostileModel=M.build({categories:['<tag>'],items:[hostile]}, {'safe-id':{story:['<script>'],gallery:[{src:'https://evil/x.webp',width:10,height:10}]},orphan:{}},RP.newestFirst);
const html=M.card(hostileModel.items[0],true);assert(!html.includes('<img'));assert(!html.includes('javascript:'));assert(html.includes('&lt;img'));assert(html.includes('&lt;script&gt;'));assert.equal(hostileModel.items[0].gallery.length,0);assert.equal(hostileModel.items[0].cover,null);assert(hostileModel.orphans.includes('orphan'));
assert.equal(M.build(data,{},RP.newestFirst).items.length,6);
const source=fs.readFileSync('ui02.js','utf8');
const links=[],u={window:{RinsoraLab:{enabled:false,recentCard(){throw Error('disabled Lab called');}}},document:{documentElement:{classList:{add(){}}},createElement:()=>({}),head:{appendChild:x=>links.push(x)}},location:{search:'?ui02=1'},URLSearchParams};
vm.runInNewContext(source,u);const unchanged=u.window.RinsoraUI02.renderRecent([],data.items.slice(0,3));assert(unchanged.includes('target="_blank"'));assert(!unchanged.includes('#/lab/'));
console.log('PASS Lab strict gates, counts 0/1/2/3/6, configured featured IDs, dynamic filters, missing/unknown/linkless/media-less enrichment, XSS, safe paths/URLs, routes and disabled recent behavior');
