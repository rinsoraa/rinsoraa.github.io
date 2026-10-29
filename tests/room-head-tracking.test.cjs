'use strict';
const fs = require('node:fs'), vm = require('node:vm'), assert = require('node:assert/strict');
const source = fs.readFileSync(process.argv[2] || 'room/room.js', 'utf8');
const from = source.indexOf('function jp(e) {'), to = source.indexOf('function Mp(', from);
assert(from >= 0 && to > from, 'Actual room head tracking function must be tested');
class Vector {
  constructor(x = 0, y = 0, z = 0) { this.set(x, y, z); }
  set(x, y, z) { Object.assign(this, {x, y, z}); return this; }
  copy(v) { return this.set(v.x, v.y, v.z); }
  clone() { return new Vector(this.x, this.y, this.z); }
  sub(v) { this.x -= v.x; this.y -= v.y; this.z -= v.z; return this; }
  normalize() { const n = Math.hypot(this.x, this.y, this.z) || 1; this.x /= n; this.y /= n; this.z /= n; return this; }
  applyQuaternion() { return this; } // Identity parent/rest frame; real GLB covered in browser.
}
function harness(yaw, pitch, pointer = true) {
  const target = new Vector(-Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), -Math.cos(yaw) * Math.cos(pitch));
  const outputs = [], identity = {copy() { return this; }, invert() { return this; }};
  const state = {hp: {enabled: true, maxYaw: 1.31, maxPitch: .87, smoothing: 8}, gp: pointer, yp: 0, bp: 0,
    xp: {getWorldPosition(v) { return v.set(0, 0, 0); }, parent: {getWorldQuaternion() { return identity; }},
      quaternion: {slerp(q) { outputs.push(q.direction.clone()); }}}, Sp: identity,
    vp: new Vector(), Tp: new Vector(), Dp: new Vector(), Op: identity, wp: new Vector(0, 0, -1),
    kp: {setFromUnitVectors(a, b) { this.direction = b.clone(); return this; }, premultiply() { return this; }},
    _p: {setFromCamera() {}, intersectObject() { return [{point: target, object: {name: 'test-room-surface'}}]; }}, tf: {}, jd: {position: target}, Q: {},
    V: {clamp: (n, lo, hi) => Math.max(lo, Math.min(hi, n))}, Math};
  vm.createContext(state); vm.runInContext(source.slice(from, to), state);
  return {state, outputs, step() { state.jp(1 / 60); }};
}
for (const [yaw, pitch] of [[.4, .2], [3, 0], [-3, 0], [2.6, 1.3], [-2.6, -1.3]]) {
  const h = harness(yaw, pitch);
  for (let i = 0; i < 240; i++) h.step();
  for (const d of h.outputs) {
    const actualYaw = Math.atan2(-d.x, -d.z), actualPitch = Math.asin(d.y);
    assert(Math.abs(actualYaw) <= 1.31 + 1e-8, `Applied head yaw ${actualYaw} exceeds limit for rear target ${yaw}`);
    assert(Math.abs(actualPitch) <= .87 + 1e-8, `Applied head pitch ${actualPitch} exceeds limit`);
    assert(Math.abs(Math.hypot(d.x, d.y, d.z) - 1) < 1e-8);
  }
  if (Math.abs(yaw) < 1.31 && Math.abs(pitch) < .87) {
    const d = h.outputs.at(-1);
    assert(Math.abs(Math.atan2(-d.x, -d.z) - yaw) < 1e-6, 'In-range tracking remains responsive');
  }
  h.state.hp.enabled = false; const count = h.outputs.length; h.step(); assert.equal(h.outputs.length, count);
  h.state.xp = null; h.step();
}
const fallback = harness(2.9, -.9, false); for (let i = 0; i < 240; i++) fallback.step();
assert(Math.abs(Math.atan2(-fallback.outputs.at(-1).x, -fallback.outputs.at(-1).z)) <= 1.31 + 1e-8);
console.log('PASS actual room head tracking: applied yaw/pitch limits, rear targets, normal tracking, disabled/missing head and camera fallback');
