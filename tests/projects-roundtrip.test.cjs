'use strict';
const fs = require('node:fs'), vm = require('node:vm'), assert = require('node:assert/strict');
const window = {}, document = { readyState: 'loading', addEventListener() {}, querySelector() { return null; } };
const context = { window, document, console, URL, URLSearchParams, setTimeout() { return 1; }, clearTimeout() {} };
vm.runInNewContext(fs.readFileSync('projects-data.js', 'utf8'), context);
vm.runInNewContext(fs.readFileSync('projects.js', 'utf8'), context);
vm.runInNewContext(fs.readFileSync('project-lab-data.js', 'utf8'), context);
const RP = window.RinsoraProjects, baseline = JSON.parse(JSON.stringify(RP.read()));
for (const status of ['Active', '']) {
  const data = structuredClone(baseline); data.items[0].status = status;
  const result = RP.parse(RP.serialize(data));
  assert.equal(result.items[0].status, status);
  for (let i = 0; i < baseline.items.length; i++) for (const k of ['date','id','category','url']) assert.equal(result.items[i][k], baseline.items[i][k]);
  assert.equal(result.items.length, 6);
}
const legacy = structuredClone(baseline); delete legacy.items[0].status;
assert.equal(RP.cleanItem(RP.parse(RP.serialize(legacy)).items[0]).status, '');
const elements = new Map();
function element() { return { value: '', hidden: false, disabled: false, children: [], dataset: {}, classList: { toggle() {} }, addEventListener() {}, querySelectorAll() { return []; }, appendChild(n) { this.children.push(n); }, focus() {}, insertAdjacentHTML() {} }; }
document.querySelector = selector => { if (!elements.has(selector)) elements.set(selector, element()); return elements.get(selector); };
document.createElement = element;
let stored = RP.serialize(baseline), writes = [];
window.location = { search: '', pathname: '/project-editor.html' };
window.history = { replaceState() {} };
window.GH = {
  hasToken: () => false,
  loadCfg: () => ({owner:'fixture',repo:'fixture',branch:'fixture'}), token: () => '',
  getFile: async path => { assert.equal(path, 'projects-data.js'); return { text: stored, sha: 'mock-sha' }; },
  putFile: async (path, text, message, sha) => { assert.equal(path, 'projects-data.js'); assert.equal(sha, 'mock-sha'); writes.push({path, text}); stored = text; }
};
vm.runInNewContext(fs.readFileSync('project-editor.js', 'utf8'), context);
const editor = window.RinsoraProjectEditor;
const extraBefore = JSON.stringify(window.RINSORA_PROJECT_LAB);
async function flushSaved() { for (let i = 0; i < 20; i++) { await new Promise(r => setImmediate(r)); if (!elements.get('#btnSave').disabled) return; } throw new Error('Mock save did not settle'); }
(async () => {
  editor.state.data = RP.parse(stored); editor.openItem('catoobot');
  elements.get('#fStatus').value = 'Active';
  elements.get('#fDesc').value += ' / fixture edit';
  const concurrent = RP.parse(stored); concurrent.items.push({...baseline.items[0], id:'concurrent-project'}); stored=RP.serialize(concurrent);
  editor.save(); await flushSaved();
  assert.equal(writes.length, 1); const saved=RP.parse(stored);
  assert.equal(saved.items.length, 7); assert(saved.items.some(p => p.id==='concurrent-project'));
  const item=saved.items.find(p=>p.id==='catoobot'); assert.equal(item.status,'Active');
  for(const k of ['id','date','category','url']) assert.equal(item[k],baseline.items.find(p=>p.id==='catoobot')[k]);
  for(const original of baseline.items.filter(p=>p.id!=='catoobot')) assert.deepEqual(JSON.parse(JSON.stringify(saved.items.find(p=>p.id===original.id))),original);
  assert.equal(elements.get('#fStatus').value,'Active');
  assert(elements.get('#saveStatus').textContent.includes('已提交'));
  editor.openItem('catoobot');elements.get('#fStatus').value='';editor.save();await flushSaved();
  assert.equal(RP.parse(stored).items.find(p=>p.id==='catoobot').status,'');
  assert.equal(JSON.stringify(window.RINSORA_PROJECT_LAB),extraBefore);
  assert(writes.every(w=>w.path==='projects-data.js'));
  console.log('PASS project status Active/empty/legacy roundtrip; actual editor Mock save preserves identity, other/concurrent projects and independent enrichment; no network or Token');
})().catch(e=>{console.error(e);process.exitCode=1;});
