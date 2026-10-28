'use strict';
const fs = require('fs'), vm = require('vm'), assert = require('assert/strict');
const source = fs.readFileSync('ui02.js','utf8');
function init(search) {
  const classes = [], links = [];
  const window = {};
  const document = { documentElement: { classList: { add: c => classes.push(c) } }, createElement: () => ({}), head: { appendChild: el => links.push(el) } };
  vm.runInNewContext(source,{ URLSearchParams, location:{search}, window, document });
  return { window, classes, links };
}
for(const query of ['', '?ui02=0', '?ui02=01']) {
  const h=init(query); assert.equal(h.window.RinsoraUI02, undefined);assert.equal(h.classes.length,0);assert.equal(h.links.length,0);
}
const h = init('?ui02=1'), render = h.window.RinsoraUI02.renderRecent;
assert.equal(h.classes[0],'ui02-preview');assert.equal(h.links.length,1);
const data={window:{}};vm.runInNewContext(fs.readFileSync('projects-data.js','utf8'),data);
const projects = data.window.RINSORA_PROJECTS.items;
const posts=Array.from({length:3},(_,i)=>({title:'完整长标题 <test> '+i,href:'posts/example-'+i+'.html',desc:'Text & detail',category:'分类',date:'2026.10.22'}));
for(let n=0;n<=3;n++) {
  const html=render(posts.slice(0,n),projects.slice(0,n));
  assert.equal((html.match(/class="u2-post(?: |")/g)||[]).length,n);
  assert.equal((html.match(/class="u2-project(?: |")/g)||[]).length,n);
  assert.equal((html.match(/home-content-group/g)||[]).length,n?2:0);
  if(n) assert(html.includes('data-count="'+n+'"')); else assert.equal(html,'');
  assert(!html.includes('<test>'));
}
for(const p of projects) {
 const html=render([], [p]);
 const expected=({'catoobot':'bot','dsh-pulse-rail':'pulse','trayhider':'window','markdown-reader':'document'})[p.id]||'generic';
 assert(html.includes('u2-identity-'+expected));assert(html.includes(p.url));assert(html.includes(p.name));
}
const fallback=render([],[{id:'unknown',name:'New & unknown',desc:'A',tags:['C++'],status:'Draft'}]);
assert(fallback.includes('u2-identity-generic'));assert(fallback.includes('New &amp; unknown'));assert(!fallback.includes('href='));assert(fallback.includes('Draft'));
console.log('PASS strict preview gate, no default CSS injection, 0/1/2/3 counts, full escaped titles, real IDs/URLs, identity mapping independent of order, unknown/no-link/status fallback');
