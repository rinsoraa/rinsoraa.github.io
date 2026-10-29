window.dispatchEvent(new CustomEvent('rinsora:room-evaluating', { detail: import.meta.url }));
var e = 1e3, t = 1001, n = 1002, r = 1003, i = 1004, a = 1005, o = 1006, s = 1007, c = 1008, l = 1009, u = 1012, d = 1014, f = 1015, p = 1016, m = 1017, h = 1018, g = 1020, _ = 1023, v = 1026, y = 1027, b = 1028, x = 1029, S = 1030, C = 1031, w = 1033, T = 2200, E = 2300, D = 2301, O = 2302, ee = 2303, k = 2400, A = 2401, j = 2402, te = 2500, M = "srgb", N = "srgb-linear", ne = "linear", P = "srgb", re = 7680, F = 35044, ie = 2e3;
function ae(e) {
	for (let t = e.length - 1; t >= 0; --t) if (e[t] >= 65535) return !0;
	return !1;
}
function oe(e) {
	return ArrayBuffer.isView(e) && !(e instanceof DataView);
}
function se(e) {
	return document.createElementNS("http://www.w3.org/1999/xhtml", e);
}
function ce() {
	let e = se("canvas");
	return e.style.display = "block", e;
}
var le = {};
function ue(...e) {
	let t = "THREE." + e.shift();
	console.log(t, ...e);
}
function de(e) {
	let t = e[0];
	if (typeof t == "string" && t.startsWith("TSL:")) {
		let t = e[1];
		t && t.isStackTrace ? e[0] += " " + t.getLocation() : e[1] = "Stack trace not available. Enable \"THREE.Node.captureStackTrace\" to capture stack traces.";
	}
	return e;
}
function I(...e) {
	e = de(e);
	let t = "THREE." + e.shift();
	{
		let n = e[0];
		n && n.isStackTrace ? console.warn(n.getError(t)) : console.warn(t, ...e);
	}
}
function L(...e) {
	e = de(e);
	let t = "THREE." + e.shift();
	{
		let n = e[0];
		n && n.isStackTrace ? console.error(n.getError(t)) : console.error(t, ...e);
	}
}
function fe(...e) {
	let t = e.join(" ");
	t in le || (le[t] = !0, I(...e));
}
function pe(e, t, n) {
	return new Promise(function(r, i) {
		function a() {
			switch (e.clientWaitSync(t, e.SYNC_FLUSH_COMMANDS_BIT, 0)) {
				case e.WAIT_FAILED:
					i();
					break;
				case e.TIMEOUT_EXPIRED:
					setTimeout(a, n);
					break;
				default: r();
			}
		}
		setTimeout(a, n);
	});
}
var me = {
	0: 1,
	2: 6,
	4: 7,
	3: 5,
	1: 0,
	6: 2,
	7: 4,
	5: 3
}, he = class {
	addEventListener(e, t) {
		this._listeners === void 0 && (this._listeners = {});
		let n = this._listeners;
		n[e] === void 0 && (n[e] = []), n[e].indexOf(t) === -1 && n[e].push(t);
	}
	hasEventListener(e, t) {
		let n = this._listeners;
		return n !== void 0 && n[e] !== void 0 && n[e].indexOf(t) !== -1;
	}
	removeEventListener(e, t) {
		let n = this._listeners;
		if (n === void 0) return;
		let r = n[e];
		if (r !== void 0) {
			let e = r.indexOf(t);
			e !== -1 && r.splice(e, 1);
		}
	}
	dispatchEvent(e) {
		let t = this._listeners;
		if (t === void 0) return;
		let n = t[e.type];
		if (n !== void 0) {
			e.target = this;
			let t = n.slice(0);
			for (let n = 0, r = t.length; n < r; n++) t[n].call(this, e);
			e.target = null;
		}
	}
}, ge = /* @__PURE__ */ "00.01.02.03.04.05.06.07.08.09.0a.0b.0c.0d.0e.0f.10.11.12.13.14.15.16.17.18.19.1a.1b.1c.1d.1e.1f.20.21.22.23.24.25.26.27.28.29.2a.2b.2c.2d.2e.2f.30.31.32.33.34.35.36.37.38.39.3a.3b.3c.3d.3e.3f.40.41.42.43.44.45.46.47.48.49.4a.4b.4c.4d.4e.4f.50.51.52.53.54.55.56.57.58.59.5a.5b.5c.5d.5e.5f.60.61.62.63.64.65.66.67.68.69.6a.6b.6c.6d.6e.6f.70.71.72.73.74.75.76.77.78.79.7a.7b.7c.7d.7e.7f.80.81.82.83.84.85.86.87.88.89.8a.8b.8c.8d.8e.8f.90.91.92.93.94.95.96.97.98.99.9a.9b.9c.9d.9e.9f.a0.a1.a2.a3.a4.a5.a6.a7.a8.a9.aa.ab.ac.ad.ae.af.b0.b1.b2.b3.b4.b5.b6.b7.b8.b9.ba.bb.bc.bd.be.bf.c0.c1.c2.c3.c4.c5.c6.c7.c8.c9.ca.cb.cc.cd.ce.cf.d0.d1.d2.d3.d4.d5.d6.d7.d8.d9.da.db.dc.dd.de.df.e0.e1.e2.e3.e4.e5.e6.e7.e8.e9.ea.eb.ec.ed.ee.ef.f0.f1.f2.f3.f4.f5.f6.f7.f8.f9.fa.fb.fc.fd.fe.ff".split("."), _e = 1234567, ve = Math.PI / 180, ye = 180 / Math.PI;
function be() {
	let e = Math.random() * 4294967295 | 0, t = Math.random() * 4294967295 | 0, n = Math.random() * 4294967295 | 0, r = Math.random() * 4294967295 | 0;
	return (ge[e & 255] + ge[e >> 8 & 255] + ge[e >> 16 & 255] + ge[e >> 24 & 255] + "-" + ge[t & 255] + ge[t >> 8 & 255] + "-" + ge[t >> 16 & 15 | 64] + ge[t >> 24 & 255] + "-" + ge[n & 63 | 128] + ge[n >> 8 & 255] + "-" + ge[n >> 16 & 255] + ge[n >> 24 & 255] + ge[r & 255] + ge[r >> 8 & 255] + ge[r >> 16 & 255] + ge[r >> 24 & 255]).toLowerCase();
}
function R(e, t, n) {
	return Math.max(t, Math.min(n, e));
}
function xe(e, t) {
	return (e % t + t) % t;
}
function Se(e, t, n, r, i) {
	return r + (e - t) * (i - r) / (n - t);
}
function Ce(e, t, n) {
	return e === t ? 0 : (n - e) / (t - e);
}
function we(e, t, n) {
	return (1 - n) * e + n * t;
}
function Te(e, t, n, r) {
	return we(e, t, 1 - Math.exp(-n * r));
}
function Ee(e, t = 1) {
	return t - Math.abs(xe(e, t * 2) - t);
}
function De(e, t, n) {
	return e <= t ? 0 : e >= n ? 1 : (e = (e - t) / (n - t), e * e * (3 - 2 * e));
}
function Oe(e, t, n) {
	return e <= t ? 0 : e >= n ? 1 : (e = (e - t) / (n - t), e * e * e * (e * (e * 6 - 15) + 10));
}
function ke(e, t) {
	return e + Math.floor(Math.random() * (t - e + 1));
}
function Ae(e, t) {
	return e + Math.random() * (t - e);
}
function je(e) {
	return e * (.5 - Math.random());
}
function Me(e) {
	e !== void 0 && (_e = e);
	let t = _e += 1831565813;
	return t = Math.imul(t ^ t >>> 15, t | 1), t ^= t + Math.imul(t ^ t >>> 7, t | 61), ((t ^ t >>> 14) >>> 0) / 4294967296;
}
function Ne(e) {
	return e * ve;
}
function Pe(e) {
	return e * ye;
}
function Fe(e) {
	return e > 0 && Number.isInteger(e) && 2 ** Math.round(Math.log2(e)) === e;
}
function Ie(e) {
	return 2 ** Math.ceil(Math.log(e) / Math.LN2);
}
function z(e) {
	return 2 ** Math.floor(Math.log(e) / Math.LN2);
}
function Le(e, t, n, r, i) {
	let a = Math.cos, o = Math.sin, s = a(n / 2), c = o(n / 2), l = a((t + r) / 2), u = o((t + r) / 2), d = a((t - r) / 2), f = o((t - r) / 2), p = a((r - t) / 2), m = o((r - t) / 2);
	switch (i) {
		case "XYX":
			e.set(s * u, c * d, c * f, s * l);
			break;
		case "YZY":
			e.set(c * f, s * u, c * d, s * l);
			break;
		case "ZXZ":
			e.set(c * d, c * f, s * u, s * l);
			break;
		case "XZX":
			e.set(s * u, c * m, c * p, s * l);
			break;
		case "YXY":
			e.set(c * p, s * u, c * m, s * l);
			break;
		case "ZYZ":
			e.set(c * m, c * p, s * u, s * l);
			break;
		default: I("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: " + i);
	}
}
function Re(e, t) {
	switch (t.constructor) {
		case Float32Array: return e;
		case Uint32Array: return e / 4294967295;
		case Uint16Array: return e / 65535;
		case Uint8Array:
		case Uint8ClampedArray: return e / 255;
		case Int32Array: return Math.max(e / 2147483647, -1);
		case Int16Array: return Math.max(e / 32767, -1);
		case Int8Array: return Math.max(e / 127, -1);
		default: throw Error("THREE.MathUtils: Invalid component type.");
	}
}
function B(e, t) {
	switch (t.constructor) {
		case Float32Array: return e;
		case Uint32Array: return Math.round(e * 4294967295);
		case Uint16Array: return Math.round(e * 65535);
		case Uint8Array:
		case Uint8ClampedArray: return Math.round(e * 255);
		case Int32Array: return Math.round(e * 2147483647);
		case Int16Array: return Math.round(e * 32767);
		case Int8Array: return Math.round(e * 127);
		default: throw Error("THREE.MathUtils: Invalid component type.");
	}
}
var V = {
	DEG2RAD: ve,
	RAD2DEG: ye,
	generateUUID: be,
	clamp: R,
	euclideanModulo: xe,
	mapLinear: Se,
	inverseLerp: Ce,
	lerp: we,
	damp: Te,
	pingpong: Ee,
	smoothstep: De,
	smootherstep: Oe,
	randInt: ke,
	randFloat: Ae,
	randFloatSpread: je,
	seededRandom: Me,
	degToRad: Ne,
	radToDeg: Pe,
	isPowerOfTwo: Fe,
	ceilPowerOfTwo: Ie,
	floorPowerOfTwo: z,
	setQuaternionFromProperEuler: Le,
	normalize: B,
	denormalize: Re
}, H = class e {
	static {
		e.prototype.isVector2 = !0;
	}
	constructor(e = 0, t = 0) {
		this.x = e, this.y = t;
	}
	get width() {
		return this.x;
	}
	set width(e) {
		this.x = e;
	}
	get height() {
		return this.y;
	}
	set height(e) {
		this.y = e;
	}
	set(e, t) {
		return this.x = e, this.y = t, this;
	}
	setScalar(e) {
		return this.x = e, this.y = e, this;
	}
	setX(e) {
		return this.x = e, this;
	}
	setY(e) {
		return this.y = e, this;
	}
	setComponent(e, t) {
		switch (e) {
			case 0:
				this.x = t;
				break;
			case 1:
				this.y = t;
				break;
			default: throw Error("THREE.Vector2: index is out of range: " + e);
		}
		return this;
	}
	getComponent(e) {
		switch (e) {
			case 0: return this.x;
			case 1: return this.y;
			default: throw Error("THREE.Vector2: index is out of range: " + e);
		}
	}
	clone() {
		return new this.constructor(this.x, this.y);
	}
	copy(e) {
		return this.x = e.x, this.y = e.y, this;
	}
	add(e) {
		return this.x += e.x, this.y += e.y, this;
	}
	addScalar(e) {
		return this.x += e, this.y += e, this;
	}
	addVectors(e, t) {
		return this.x = e.x + t.x, this.y = e.y + t.y, this;
	}
	addScaledVector(e, t) {
		return this.x += e.x * t, this.y += e.y * t, this;
	}
	sub(e) {
		return this.x -= e.x, this.y -= e.y, this;
	}
	subScalar(e) {
		return this.x -= e, this.y -= e, this;
	}
	subVectors(e, t) {
		return this.x = e.x - t.x, this.y = e.y - t.y, this;
	}
	multiply(e) {
		return this.x *= e.x, this.y *= e.y, this;
	}
	multiplyScalar(e) {
		return this.x *= e, this.y *= e, this;
	}
	divide(e) {
		return this.x /= e.x, this.y /= e.y, this;
	}
	divideScalar(e) {
		return this.multiplyScalar(1 / e);
	}
	applyMatrix3(e) {
		let t = this.x, n = this.y, r = e.elements;
		return this.x = r[0] * t + r[3] * n + r[6], this.y = r[1] * t + r[4] * n + r[7], this;
	}
	min(e) {
		return this.x = Math.min(this.x, e.x), this.y = Math.min(this.y, e.y), this;
	}
	max(e) {
		return this.x = Math.max(this.x, e.x), this.y = Math.max(this.y, e.y), this;
	}
	clamp(e, t) {
		return this.x = R(this.x, e.x, t.x), this.y = R(this.y, e.y, t.y), this;
	}
	clampScalar(e, t) {
		return this.x = R(this.x, e, t), this.y = R(this.y, e, t), this;
	}
	clampLength(e, t) {
		let n = this.length();
		return this.divideScalar(n || 1).multiplyScalar(R(n, e, t));
	}
	floor() {
		return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this;
	}
	ceil() {
		return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this;
	}
	round() {
		return this.x = Math.round(this.x), this.y = Math.round(this.y), this;
	}
	roundToZero() {
		return this.x = Math.trunc(this.x), this.y = Math.trunc(this.y), this;
	}
	negate() {
		return this.x = -this.x, this.y = -this.y, this;
	}
	dot(e) {
		return this.x * e.x + this.y * e.y;
	}
	cross(e) {
		return this.x * e.y - this.y * e.x;
	}
	lengthSq() {
		return this.x * this.x + this.y * this.y;
	}
	length() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}
	manhattanLength() {
		return Math.abs(this.x) + Math.abs(this.y);
	}
	normalize() {
		return this.divideScalar(this.length() || 1);
	}
	angle() {
		return Math.atan2(-this.y, -this.x) + Math.PI;
	}
	angleTo(e) {
		let t = Math.sqrt(this.lengthSq() * e.lengthSq());
		if (t === 0) return Math.PI / 2;
		let n = this.dot(e) / t;
		return Math.acos(R(n, -1, 1));
	}
	distanceTo(e) {
		return Math.sqrt(this.distanceToSquared(e));
	}
	distanceToSquared(e) {
		let t = this.x - e.x, n = this.y - e.y;
		return t * t + n * n;
	}
	manhattanDistanceTo(e) {
		return Math.abs(this.x - e.x) + Math.abs(this.y - e.y);
	}
	setLength(e) {
		return this.normalize().multiplyScalar(e);
	}
	lerp(e, t) {
		return this.x += (e.x - this.x) * t, this.y += (e.y - this.y) * t, this;
	}
	lerpVectors(e, t, n) {
		return this.x = e.x + (t.x - e.x) * n, this.y = e.y + (t.y - e.y) * n, this;
	}
	equals(e) {
		return e.x === this.x && e.y === this.y;
	}
	fromArray(e, t = 0) {
		return this.x = e[t], this.y = e[t + 1], this;
	}
	toArray(e = [], t = 0) {
		return e[t] = this.x, e[t + 1] = this.y, e;
	}
	fromBufferAttribute(e, t) {
		return this.x = e.getX(t), this.y = e.getY(t), this;
	}
	rotateAround(e, t) {
		let n = Math.cos(t), r = Math.sin(t), i = this.x - e.x, a = this.y - e.y;
		return this.x = i * n - a * r + e.x, this.y = i * r + a * n + e.y, this;
	}
	random() {
		return this.x = Math.random(), this.y = Math.random(), this;
	}
	*[Symbol.iterator]() {
		yield this.x, yield this.y;
	}
}, U = class {
	constructor(e = 0, t = 0, n = 0, r = 1) {
		this.isQuaternion = !0, this._x = e, this._y = t, this._z = n, this._w = r;
	}
	static slerpFlat(e, t, n, r, i, a, o) {
		let s = n[r + 0], c = n[r + 1], l = n[r + 2], u = n[r + 3], d = i[a + 0], f = i[a + 1], p = i[a + 2], m = i[a + 3];
		if (u !== m || s !== d || c !== f || l !== p) {
			let e = s * d + c * f + l * p + u * m;
			e < 0 && (d = -d, f = -f, p = -p, m = -m, e = -e);
			let t = 1 - o;
			if (e < .9995) {
				let n = Math.acos(e), r = Math.sin(n);
				t = Math.sin(t * n) / r, o = Math.sin(o * n) / r, s = s * t + d * o, c = c * t + f * o, l = l * t + p * o, u = u * t + m * o;
			} else {
				s = s * t + d * o, c = c * t + f * o, l = l * t + p * o, u = u * t + m * o;
				let e = 1 / Math.sqrt(s * s + c * c + l * l + u * u);
				s *= e, c *= e, l *= e, u *= e;
			}
		}
		e[t] = s, e[t + 1] = c, e[t + 2] = l, e[t + 3] = u;
	}
	static multiplyQuaternionsFlat(e, t, n, r, i, a) {
		let o = n[r], s = n[r + 1], c = n[r + 2], l = n[r + 3], u = i[a], d = i[a + 1], f = i[a + 2], p = i[a + 3];
		return e[t] = o * p + l * u + s * f - c * d, e[t + 1] = s * p + l * d + c * u - o * f, e[t + 2] = c * p + l * f + o * d - s * u, e[t + 3] = l * p - o * u - s * d - c * f, e;
	}
	get x() {
		return this._x;
	}
	set x(e) {
		this._x = e, this._onChangeCallback();
	}
	get y() {
		return this._y;
	}
	set y(e) {
		this._y = e, this._onChangeCallback();
	}
	get z() {
		return this._z;
	}
	set z(e) {
		this._z = e, this._onChangeCallback();
	}
	get w() {
		return this._w;
	}
	set w(e) {
		this._w = e, this._onChangeCallback();
	}
	set(e, t, n, r) {
		return this._x = e, this._y = t, this._z = n, this._w = r, this._onChangeCallback(), this;
	}
	clone() {
		return new this.constructor(this._x, this._y, this._z, this._w);
	}
	copy(e) {
		return this._x = e.x, this._y = e.y, this._z = e.z, this._w = e.w, this._onChangeCallback(), this;
	}
	setFromEuler(e, t = !0) {
		let n = e._x, r = e._y, i = e._z, a = e._order, o = Math.cos, s = Math.sin, c = o(n / 2), l = o(r / 2), u = o(i / 2), d = s(n / 2), f = s(r / 2), p = s(i / 2);
		switch (a) {
			case "XYZ":
				this._x = d * l * u + c * f * p, this._y = c * f * u - d * l * p, this._z = c * l * p + d * f * u, this._w = c * l * u - d * f * p;
				break;
			case "YXZ":
				this._x = d * l * u + c * f * p, this._y = c * f * u - d * l * p, this._z = c * l * p - d * f * u, this._w = c * l * u + d * f * p;
				break;
			case "ZXY":
				this._x = d * l * u - c * f * p, this._y = c * f * u + d * l * p, this._z = c * l * p + d * f * u, this._w = c * l * u - d * f * p;
				break;
			case "ZYX":
				this._x = d * l * u - c * f * p, this._y = c * f * u + d * l * p, this._z = c * l * p - d * f * u, this._w = c * l * u + d * f * p;
				break;
			case "YZX":
				this._x = d * l * u + c * f * p, this._y = c * f * u + d * l * p, this._z = c * l * p - d * f * u, this._w = c * l * u - d * f * p;
				break;
			case "XZY":
				this._x = d * l * u - c * f * p, this._y = c * f * u - d * l * p, this._z = c * l * p + d * f * u, this._w = c * l * u + d * f * p;
				break;
			default: I("Quaternion: .setFromEuler() encountered an unknown order: " + a);
		}
		return t === !0 && this._onChangeCallback(), this;
	}
	setFromAxisAngle(e, t) {
		let n = t / 2, r = Math.sin(n);
		return this._x = e.x * r, this._y = e.y * r, this._z = e.z * r, this._w = Math.cos(n), this._onChangeCallback(), this;
	}
	setFromRotationMatrix(e) {
		let t = e.elements, n = t[0], r = t[4], i = t[8], a = t[1], o = t[5], s = t[9], c = t[2], l = t[6], u = t[10], d = n + o + u;
		if (d > 0) {
			let e = .5 / Math.sqrt(d + 1);
			this._w = .25 / e, this._x = (l - s) * e, this._y = (i - c) * e, this._z = (a - r) * e;
		} else if (n > o && n > u) {
			let e = 2 * Math.sqrt(1 + n - o - u);
			this._w = (l - s) / e, this._x = .25 * e, this._y = (r + a) / e, this._z = (i + c) / e;
		} else if (o > u) {
			let e = 2 * Math.sqrt(1 + o - n - u);
			this._w = (i - c) / e, this._x = (r + a) / e, this._y = .25 * e, this._z = (s + l) / e;
		} else {
			let e = 2 * Math.sqrt(1 + u - n - o);
			this._w = (a - r) / e, this._x = (i + c) / e, this._y = (s + l) / e, this._z = .25 * e;
		}
		return this._onChangeCallback(), this;
	}
	setFromUnitVectors(e, t) {
		let n = e.dot(t) + 1;
		return n < 1e-8 ? (n = 0, Math.abs(e.x) > Math.abs(e.z) ? (this._x = -e.y, this._y = e.x, this._z = 0, this._w = n) : (this._x = 0, this._y = -e.z, this._z = e.y, this._w = n)) : (this._x = e.y * t.z - e.z * t.y, this._y = e.z * t.x - e.x * t.z, this._z = e.x * t.y - e.y * t.x, this._w = n), this.normalize();
	}
	angleTo(e) {
		return 2 * Math.acos(Math.abs(R(this.dot(e), -1, 1)));
	}
	rotateTowards(e, t) {
		let n = this.angleTo(e);
		if (n === 0) return this;
		let r = Math.min(1, t / n);
		return this.slerp(e, r), this;
	}
	identity() {
		return this.set(0, 0, 0, 1);
	}
	invert() {
		return this.conjugate();
	}
	conjugate() {
		return this._x *= -1, this._y *= -1, this._z *= -1, this._onChangeCallback(), this;
	}
	dot(e) {
		return this._x * e._x + this._y * e._y + this._z * e._z + this._w * e._w;
	}
	lengthSq() {
		return this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w;
	}
	length() {
		return Math.sqrt(this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w);
	}
	normalize() {
		let e = this.length();
		return e === 0 ? (this._x = 0, this._y = 0, this._z = 0, this._w = 1) : (e = 1 / e, this._x *= e, this._y *= e, this._z *= e, this._w *= e), this._onChangeCallback(), this;
	}
	multiply(e) {
		return this.multiplyQuaternions(this, e);
	}
	premultiply(e) {
		return this.multiplyQuaternions(e, this);
	}
	multiplyQuaternions(e, t) {
		let n = e._x, r = e._y, i = e._z, a = e._w, o = t._x, s = t._y, c = t._z, l = t._w;
		return this._x = n * l + a * o + r * c - i * s, this._y = r * l + a * s + i * o - n * c, this._z = i * l + a * c + n * s - r * o, this._w = a * l - n * o - r * s - i * c, this._onChangeCallback(), this;
	}
	slerp(e, t) {
		let n = e._x, r = e._y, i = e._z, a = e._w, o = this.dot(e);
		o < 0 && (n = -n, r = -r, i = -i, a = -a, o = -o);
		let s = 1 - t;
		if (o < .9995) {
			let e = Math.acos(o), c = Math.sin(e);
			s = Math.sin(s * e) / c, t = Math.sin(t * e) / c, this._x = this._x * s + n * t, this._y = this._y * s + r * t, this._z = this._z * s + i * t, this._w = this._w * s + a * t, this._onChangeCallback();
		} else this._x = this._x * s + n * t, this._y = this._y * s + r * t, this._z = this._z * s + i * t, this._w = this._w * s + a * t, this.normalize();
		return this;
	}
	slerpQuaternions(e, t, n) {
		return this.copy(e).slerp(t, n);
	}
	random() {
		let e = 2 * Math.PI * Math.random(), t = 2 * Math.PI * Math.random(), n = Math.random(), r = Math.sqrt(1 - n), i = Math.sqrt(n);
		return this.set(r * Math.sin(e), r * Math.cos(e), i * Math.sin(t), i * Math.cos(t));
	}
	equals(e) {
		return e._x === this._x && e._y === this._y && e._z === this._z && e._w === this._w;
	}
	fromArray(e, t = 0) {
		return this._x = e[t], this._y = e[t + 1], this._z = e[t + 2], this._w = e[t + 3], this._onChangeCallback(), this;
	}
	toArray(e = [], t = 0) {
		return e[t] = this._x, e[t + 1] = this._y, e[t + 2] = this._z, e[t + 3] = this._w, e;
	}
	fromBufferAttribute(e, t) {
		return this._x = e.getX(t), this._y = e.getY(t), this._z = e.getZ(t), this._w = e.getW(t), this._onChangeCallback(), this;
	}
	toJSON() {
		return this.toArray();
	}
	_onChange(e) {
		return this._onChangeCallback = e, this;
	}
	_onChangeCallback() {}
	*[Symbol.iterator]() {
		yield this._x, yield this._y, yield this._z, yield this._w;
	}
}, W = class e {
	static {
		e.prototype.isVector3 = !0;
	}
	constructor(e = 0, t = 0, n = 0) {
		this.x = e, this.y = t, this.z = n;
	}
	set(e, t, n) {
		return n === void 0 && (n = this.z), this.x = e, this.y = t, this.z = n, this;
	}
	setScalar(e) {
		return this.x = e, this.y = e, this.z = e, this;
	}
	setX(e) {
		return this.x = e, this;
	}
	setY(e) {
		return this.y = e, this;
	}
	setZ(e) {
		return this.z = e, this;
	}
	setComponent(e, t) {
		switch (e) {
			case 0:
				this.x = t;
				break;
			case 1:
				this.y = t;
				break;
			case 2:
				this.z = t;
				break;
			default: throw Error("THREE.Vector3: index is out of range: " + e);
		}
		return this;
	}
	getComponent(e) {
		switch (e) {
			case 0: return this.x;
			case 1: return this.y;
			case 2: return this.z;
			default: throw Error("THREE.Vector3: index is out of range: " + e);
		}
	}
	clone() {
		return new this.constructor(this.x, this.y, this.z);
	}
	copy(e) {
		return this.x = e.x, this.y = e.y, this.z = e.z, this;
	}
	add(e) {
		return this.x += e.x, this.y += e.y, this.z += e.z, this;
	}
	addScalar(e) {
		return this.x += e, this.y += e, this.z += e, this;
	}
	addVectors(e, t) {
		return this.x = e.x + t.x, this.y = e.y + t.y, this.z = e.z + t.z, this;
	}
	addScaledVector(e, t) {
		return this.x += e.x * t, this.y += e.y * t, this.z += e.z * t, this;
	}
	sub(e) {
		return this.x -= e.x, this.y -= e.y, this.z -= e.z, this;
	}
	subScalar(e) {
		return this.x -= e, this.y -= e, this.z -= e, this;
	}
	subVectors(e, t) {
		return this.x = e.x - t.x, this.y = e.y - t.y, this.z = e.z - t.z, this;
	}
	multiply(e) {
		return this.x *= e.x, this.y *= e.y, this.z *= e.z, this;
	}
	multiplyScalar(e) {
		return this.x *= e, this.y *= e, this.z *= e, this;
	}
	multiplyVectors(e, t) {
		return this.x = e.x * t.x, this.y = e.y * t.y, this.z = e.z * t.z, this;
	}
	applyEuler(e) {
		return this.applyQuaternion(Be.setFromEuler(e));
	}
	applyAxisAngle(e, t) {
		return this.applyQuaternion(Be.setFromAxisAngle(e, t));
	}
	applyMatrix3(e) {
		let t = this.x, n = this.y, r = this.z, i = e.elements;
		return this.x = i[0] * t + i[3] * n + i[6] * r, this.y = i[1] * t + i[4] * n + i[7] * r, this.z = i[2] * t + i[5] * n + i[8] * r, this;
	}
	applyNormalMatrix(e) {
		return this.applyMatrix3(e).normalize();
	}
	applyMatrix4(e) {
		let t = this.x, n = this.y, r = this.z, i = e.elements, a = 1 / (i[3] * t + i[7] * n + i[11] * r + i[15]);
		return this.x = (i[0] * t + i[4] * n + i[8] * r + i[12]) * a, this.y = (i[1] * t + i[5] * n + i[9] * r + i[13]) * a, this.z = (i[2] * t + i[6] * n + i[10] * r + i[14]) * a, this;
	}
	applyQuaternion(e) {
		let t = this.x, n = this.y, r = this.z, i = e.x, a = e.y, o = e.z, s = e.w, c = 2 * (a * r - o * n), l = 2 * (o * t - i * r), u = 2 * (i * n - a * t);
		return this.x = t + s * c + a * u - o * l, this.y = n + s * l + o * c - i * u, this.z = r + s * u + i * l - a * c, this;
	}
	project(e) {
		return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix);
	}
	unproject(e) {
		return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld);
	}
	transformDirection(e) {
		let t = this.x, n = this.y, r = this.z, i = e.elements;
		return this.x = i[0] * t + i[4] * n + i[8] * r, this.y = i[1] * t + i[5] * n + i[9] * r, this.z = i[2] * t + i[6] * n + i[10] * r, this.normalize();
	}
	divide(e) {
		return this.x /= e.x, this.y /= e.y, this.z /= e.z, this;
	}
	divideScalar(e) {
		return this.multiplyScalar(1 / e);
	}
	min(e) {
		return this.x = Math.min(this.x, e.x), this.y = Math.min(this.y, e.y), this.z = Math.min(this.z, e.z), this;
	}
	max(e) {
		return this.x = Math.max(this.x, e.x), this.y = Math.max(this.y, e.y), this.z = Math.max(this.z, e.z), this;
	}
	clamp(e, t) {
		return this.x = R(this.x, e.x, t.x), this.y = R(this.y, e.y, t.y), this.z = R(this.z, e.z, t.z), this;
	}
	clampScalar(e, t) {
		return this.x = R(this.x, e, t), this.y = R(this.y, e, t), this.z = R(this.z, e, t), this;
	}
	clampLength(e, t) {
		let n = this.length();
		return this.divideScalar(n || 1).multiplyScalar(R(n, e, t));
	}
	floor() {
		return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this.z = Math.floor(this.z), this;
	}
	ceil() {
		return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this.z = Math.ceil(this.z), this;
	}
	round() {
		return this.x = Math.round(this.x), this.y = Math.round(this.y), this.z = Math.round(this.z), this;
	}
	roundToZero() {
		return this.x = Math.trunc(this.x), this.y = Math.trunc(this.y), this.z = Math.trunc(this.z), this;
	}
	negate() {
		return this.x = -this.x, this.y = -this.y, this.z = -this.z, this;
	}
	dot(e) {
		return this.x * e.x + this.y * e.y + this.z * e.z;
	}
	lengthSq() {
		return this.x * this.x + this.y * this.y + this.z * this.z;
	}
	length() {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	}
	manhattanLength() {
		return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
	}
	normalize() {
		return this.divideScalar(this.length() || 1);
	}
	setLength(e) {
		return this.normalize().multiplyScalar(e);
	}
	lerp(e, t) {
		return this.x += (e.x - this.x) * t, this.y += (e.y - this.y) * t, this.z += (e.z - this.z) * t, this;
	}
	lerpVectors(e, t, n) {
		return this.x = e.x + (t.x - e.x) * n, this.y = e.y + (t.y - e.y) * n, this.z = e.z + (t.z - e.z) * n, this;
	}
	cross(e) {
		return this.crossVectors(this, e);
	}
	crossVectors(e, t) {
		let n = e.x, r = e.y, i = e.z, a = t.x, o = t.y, s = t.z;
		return this.x = r * s - i * o, this.y = i * a - n * s, this.z = n * o - r * a, this;
	}
	projectOnVector(e) {
		let t = e.lengthSq();
		if (t === 0) return this.set(0, 0, 0);
		let n = e.dot(this) / t;
		return this.copy(e).multiplyScalar(n);
	}
	projectOnPlane(e) {
		return ze.copy(this).projectOnVector(e), this.sub(ze);
	}
	reflect(e) {
		return this.sub(ze.copy(e).multiplyScalar(2 * this.dot(e)));
	}
	angleTo(e) {
		let t = Math.sqrt(this.lengthSq() * e.lengthSq());
		if (t === 0) return Math.PI / 2;
		let n = this.dot(e) / t;
		return Math.acos(R(n, -1, 1));
	}
	distanceTo(e) {
		return Math.sqrt(this.distanceToSquared(e));
	}
	distanceToSquared(e) {
		let t = this.x - e.x, n = this.y - e.y, r = this.z - e.z;
		return t * t + n * n + r * r;
	}
	manhattanDistanceTo(e) {
		return Math.abs(this.x - e.x) + Math.abs(this.y - e.y) + Math.abs(this.z - e.z);
	}
	setFromSpherical(e) {
		return this.setFromSphericalCoords(e.radius, e.phi, e.theta);
	}
	setFromSphericalCoords(e, t, n) {
		let r = Math.sin(t) * e;
		return this.x = r * Math.sin(n), this.y = Math.cos(t) * e, this.z = r * Math.cos(n), this;
	}
	setFromCylindrical(e) {
		return this.setFromCylindricalCoords(e.radius, e.theta, e.y);
	}
	setFromCylindricalCoords(e, t, n) {
		return this.x = e * Math.sin(t), this.y = n, this.z = e * Math.cos(t), this;
	}
	setFromMatrixPosition(e) {
		let t = e.elements;
		return this.x = t[12], this.y = t[13], this.z = t[14], this;
	}
	setFromMatrixScale(e) {
		let t = this.setFromMatrixColumn(e, 0).length(), n = this.setFromMatrixColumn(e, 1).length(), r = this.setFromMatrixColumn(e, 2).length();
		return this.x = t, this.y = n, this.z = r, this;
	}
	setFromMatrixColumn(e, t) {
		return this.fromArray(e.elements, t * 4);
	}
	setFromMatrix3Column(e, t) {
		return this.fromArray(e.elements, t * 3);
	}
	setFromEuler(e) {
		return this.x = e._x, this.y = e._y, this.z = e._z, this;
	}
	setFromColor(e) {
		return this.x = e.r, this.y = e.g, this.z = e.b, this;
	}
	equals(e) {
		return e.x === this.x && e.y === this.y && e.z === this.z;
	}
	fromArray(e, t = 0) {
		return this.x = e[t], this.y = e[t + 1], this.z = e[t + 2], this;
	}
	toArray(e = [], t = 0) {
		return e[t] = this.x, e[t + 1] = this.y, e[t + 2] = this.z, e;
	}
	fromBufferAttribute(e, t) {
		return this.x = e.getX(t), this.y = e.getY(t), this.z = e.getZ(t), this;
	}
	random() {
		return this.x = Math.random(), this.y = Math.random(), this.z = Math.random(), this;
	}
	randomDirection() {
		let e = Math.random() * Math.PI * 2, t = Math.random() * 2 - 1, n = Math.sqrt(1 - t * t);
		return this.x = n * Math.cos(e), this.y = t, this.z = n * Math.sin(e), this;
	}
	*[Symbol.iterator]() {
		yield this.x, yield this.y, yield this.z;
	}
}, ze = /*@__PURE__*/ new W(), Be = /*@__PURE__*/ new U(), G = class e {
	static {
		e.prototype.isMatrix3 = !0;
	}
	constructor(e, t, n, r, i, a, o, s, c) {
		this.elements = [
			1,
			0,
			0,
			0,
			1,
			0,
			0,
			0,
			1
		], e !== void 0 && this.set(e, t, n, r, i, a, o, s, c);
	}
	set(e, t, n, r, i, a, o, s, c) {
		let l = this.elements;
		return l[0] = e, l[1] = r, l[2] = o, l[3] = t, l[4] = i, l[5] = s, l[6] = n, l[7] = a, l[8] = c, this;
	}
	identity() {
		return this.set(1, 0, 0, 0, 1, 0, 0, 0, 1), this;
	}
	copy(e) {
		let t = this.elements, n = e.elements;
		return t[0] = n[0], t[1] = n[1], t[2] = n[2], t[3] = n[3], t[4] = n[4], t[5] = n[5], t[6] = n[6], t[7] = n[7], t[8] = n[8], this;
	}
	extractBasis(e, t, n) {
		return e.setFromMatrix3Column(this, 0), t.setFromMatrix3Column(this, 1), n.setFromMatrix3Column(this, 2), this;
	}
	setFromMatrix4(e) {
		let t = e.elements;
		return this.set(t[0], t[4], t[8], t[1], t[5], t[9], t[2], t[6], t[10]), this;
	}
	multiply(e) {
		return this.multiplyMatrices(this, e);
	}
	premultiply(e) {
		return this.multiplyMatrices(e, this);
	}
	multiplyMatrices(e, t) {
		let n = e.elements, r = t.elements, i = this.elements, a = n[0], o = n[3], s = n[6], c = n[1], l = n[4], u = n[7], d = n[2], f = n[5], p = n[8], m = r[0], h = r[3], g = r[6], _ = r[1], v = r[4], y = r[7], b = r[2], x = r[5], S = r[8];
		return i[0] = a * m + o * _ + s * b, i[3] = a * h + o * v + s * x, i[6] = a * g + o * y + s * S, i[1] = c * m + l * _ + u * b, i[4] = c * h + l * v + u * x, i[7] = c * g + l * y + u * S, i[2] = d * m + f * _ + p * b, i[5] = d * h + f * v + p * x, i[8] = d * g + f * y + p * S, this;
	}
	multiplyScalar(e) {
		let t = this.elements;
		return t[0] *= e, t[3] *= e, t[6] *= e, t[1] *= e, t[4] *= e, t[7] *= e, t[2] *= e, t[5] *= e, t[8] *= e, this;
	}
	determinant() {
		let e = this.elements, t = e[0], n = e[1], r = e[2], i = e[3], a = e[4], o = e[5], s = e[6], c = e[7], l = e[8];
		return t * a * l - t * o * c - n * i * l + n * o * s + r * i * c - r * a * s;
	}
	invert() {
		let e = this.elements, t = e[0], n = e[1], r = e[2], i = e[3], a = e[4], o = e[5], s = e[6], c = e[7], l = e[8], u = l * a - o * c, d = o * s - l * i, f = c * i - a * s, p = t * u + n * d + r * f;
		if (p === 0) return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0);
		let m = 1 / p;
		return e[0] = u * m, e[1] = (r * c - l * n) * m, e[2] = (o * n - r * a) * m, e[3] = d * m, e[4] = (l * t - r * s) * m, e[5] = (r * i - o * t) * m, e[6] = f * m, e[7] = (n * s - c * t) * m, e[8] = (a * t - n * i) * m, this;
	}
	transpose() {
		let e, t = this.elements;
		return e = t[1], t[1] = t[3], t[3] = e, e = t[2], t[2] = t[6], t[6] = e, e = t[5], t[5] = t[7], t[7] = e, this;
	}
	getNormalMatrix(e) {
		return this.setFromMatrix4(e).invert().transpose();
	}
	transposeIntoArray(e) {
		let t = this.elements;
		return e[0] = t[0], e[1] = t[3], e[2] = t[6], e[3] = t[1], e[4] = t[4], e[5] = t[7], e[6] = t[2], e[7] = t[5], e[8] = t[8], this;
	}
	setUvTransform(e, t, n, r, i, a, o) {
		let s = Math.cos(i), c = Math.sin(i);
		return this.set(n * s, n * c, -n * (s * a + c * o) + a + e, -r * c, r * s, -r * (-c * a + s * o) + o + t, 0, 0, 1), this;
	}
	scale(e, t) {
		return fe("Matrix3: .scale() is deprecated. Use .makeScale() instead."), this.premultiply(Ve.makeScale(e, t)), this;
	}
	rotate(e) {
		return fe("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."), this.premultiply(Ve.makeRotation(-e)), this;
	}
	translate(e, t) {
		return fe("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."), this.premultiply(Ve.makeTranslation(e, t)), this;
	}
	makeTranslation(e, t) {
		return e.isVector2 ? this.set(1, 0, e.x, 0, 1, e.y, 0, 0, 1) : this.set(1, 0, e, 0, 1, t, 0, 0, 1), this;
	}
	makeRotation(e) {
		let t = Math.cos(e), n = Math.sin(e);
		return this.set(t, -n, 0, n, t, 0, 0, 0, 1), this;
	}
	makeScale(e, t) {
		return this.set(e, 0, 0, 0, t, 0, 0, 0, 1), this;
	}
	equals(e) {
		let t = this.elements, n = e.elements;
		for (let e = 0; e < 9; e++) if (t[e] !== n[e]) return !1;
		return !0;
	}
	fromArray(e, t = 0) {
		for (let n = 0; n < 9; n++) this.elements[n] = e[n + t];
		return this;
	}
	toArray(e = [], t = 0) {
		let n = this.elements;
		return e[t] = n[0], e[t + 1] = n[1], e[t + 2] = n[2], e[t + 3] = n[3], e[t + 4] = n[4], e[t + 5] = n[5], e[t + 6] = n[6], e[t + 7] = n[7], e[t + 8] = n[8], e;
	}
	clone() {
		return new this.constructor().fromArray(this.elements);
	}
}, Ve = /*@__PURE__*/ new G(), He = /*@__PURE__*/ new G().set(.4123908, .3575843, .1804808, .212639, .7151687, .0721923, .0193308, .1191948, .9505322), Ue = /*@__PURE__*/ new G().set(3.2409699, -1.5373832, -.4986108, -.9692436, 1.8759675, .0415551, .0556301, -.203977, 1.0569715);
function We() {
	let e = {
		enabled: !0,
		workingColorSpace: N,
		spaces: {},
		convert: function(e, t, n) {
			return this.enabled === !1 || t === n || !t || !n || (this.spaces[t].transfer === "srgb" && (e.r = Ge(e.r), e.g = Ge(e.g), e.b = Ge(e.b)), this.spaces[t].primaries !== this.spaces[n].primaries && (e.applyMatrix3(this.spaces[t].toXYZ), e.applyMatrix3(this.spaces[n].fromXYZ)), this.spaces[n].transfer === "srgb" && (e.r = Ke(e.r), e.g = Ke(e.g), e.b = Ke(e.b))), e;
		},
		workingToColorSpace: function(e, t) {
			return this.convert(e, this.workingColorSpace, t);
		},
		colorSpaceToWorking: function(e, t) {
			return this.convert(e, t, this.workingColorSpace);
		},
		getPrimaries: function(e) {
			return this.spaces[e].primaries;
		},
		getTransfer: function(e) {
			return e === "" ? ne : this.spaces[e].transfer;
		},
		getToneMappingMode: function(e) {
			return this.spaces[e].outputColorSpaceConfig.toneMappingMode || "standard";
		},
		getLuminanceCoefficients: function(e, t = this.workingColorSpace) {
			return e.fromArray(this.spaces[t].luminanceCoefficients);
		},
		define: function(e) {
			Object.assign(this.spaces, e);
		},
		_getMatrix: function(e, t, n) {
			return e.copy(this.spaces[t].toXYZ).multiply(this.spaces[n].fromXYZ);
		},
		_getDrawingBufferColorSpace: function(e) {
			return this.spaces[e].outputColorSpaceConfig.drawingBufferColorSpace;
		},
		_getUnpackColorSpace: function(e = this.workingColorSpace) {
			return this.spaces[e].workingColorSpaceConfig.unpackColorSpace;
		},
		fromWorkingColorSpace: function(t, n) {
			return fe("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."), e.workingToColorSpace(t, n);
		},
		toWorkingColorSpace: function(t, n) {
			return fe("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."), e.colorSpaceToWorking(t, n);
		}
	}, t = [
		.64,
		.33,
		.3,
		.6,
		.15,
		.06
	], n = [
		.2126,
		.7152,
		.0722
	], r = [.3127, .329];
	return e.define({
		[N]: {
			primaries: t,
			whitePoint: r,
			transfer: ne,
			toXYZ: He,
			fromXYZ: Ue,
			luminanceCoefficients: n,
			workingColorSpaceConfig: { unpackColorSpace: M },
			outputColorSpaceConfig: { drawingBufferColorSpace: M }
		},
		[M]: {
			primaries: t,
			whitePoint: r,
			transfer: P,
			toXYZ: He,
			fromXYZ: Ue,
			luminanceCoefficients: n,
			outputColorSpaceConfig: { drawingBufferColorSpace: M }
		}
	}), e;
}
var K = /*@__PURE__*/ We();
function Ge(e) {
	return e < .04045 ? e * .0773993808 : (e * .9478672986 + .0521327014) ** 2.4;
}
function Ke(e) {
	return e < .0031308 ? e * 12.92 : 1.055 * e ** .41666 - .055;
}
var qe, Je = class {
	static getDataURL(e, t = "image/png") {
		if (/^data:/i.test(e.src) || typeof HTMLCanvasElement > "u") return e.src;
		let n;
		if (e instanceof HTMLCanvasElement) n = e;
		else {
			qe === void 0 && (qe = se("canvas")), qe.width = e.width, qe.height = e.height;
			let t = qe.getContext("2d");
			e instanceof ImageData ? t.putImageData(e, 0, 0) : t.drawImage(e, 0, 0, e.width, e.height), n = qe;
		}
		return n.toDataURL(t);
	}
	static sRGBToLinear(e) {
		if (typeof HTMLImageElement < "u" && e instanceof HTMLImageElement || typeof HTMLCanvasElement < "u" && e instanceof HTMLCanvasElement || typeof ImageBitmap < "u" && e instanceof ImageBitmap) {
			let t = se("canvas");
			t.width = e.width, t.height = e.height;
			let n = t.getContext("2d");
			n.drawImage(e, 0, 0, e.width, e.height);
			let r = n.getImageData(0, 0, e.width, e.height), i = r.data;
			for (let e = 0; e < i.length; e++) i[e] = Ge(i[e] / 255) * 255;
			return n.putImageData(r, 0, 0), t;
		}
		if (e.data) {
			let t = e.data.slice(0);
			for (let e = 0; e < t.length; e++) t instanceof Uint8Array || t instanceof Uint8ClampedArray ? t[e] = Math.floor(Ge(t[e] / 255) * 255) : t[e] = Ge(t[e]);
			return {
				data: t,
				width: e.width,
				height: e.height
			};
		}
		return I("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."), e;
	}
}, Ye = 0, Xe = class {
	constructor(e = null) {
		this.isTextureSource = !0, Object.defineProperty(this, "id", { value: Ye++ }), this.uuid = be(), this.data = e, this.dataReady = !0, this.version = 0;
	}
	getSize(e) {
		let t = this.data;
		return typeof HTMLVideoElement < "u" && t instanceof HTMLVideoElement ? e.set(t.videoWidth, t.videoHeight, 0) : typeof VideoFrame < "u" && t instanceof VideoFrame ? e.set(t.displayWidth, t.displayHeight, 0) : t === null ? e.set(0, 0, 0) : e.set(t.width, t.height, t.depth || 0), e;
	}
	set needsUpdate(e) {
		e === !0 && this.version++;
	}
	toJSON(e) {
		let t = e === void 0 || typeof e == "string";
		if (!t && e.images[this.uuid] !== void 0) return e.images[this.uuid];
		let n = {
			uuid: this.uuid,
			url: ""
		}, r = this.data;
		if (r !== null) {
			let e;
			if (Array.isArray(r)) {
				e = [];
				for (let t = 0, n = r.length; t < n; t++) r[t].isDataTexture ? e.push(Ze(r[t].image)) : e.push(Ze(r[t]));
			} else e = Ze(r);
			n.url = e;
		}
		return t || (e.images[this.uuid] = n), n;
	}
};
function Ze(e) {
	return typeof HTMLImageElement < "u" && e instanceof HTMLImageElement || typeof HTMLCanvasElement < "u" && e instanceof HTMLCanvasElement || typeof ImageBitmap < "u" && e instanceof ImageBitmap ? Je.getDataURL(e) : e.data ? {
		data: Array.from(e.data),
		width: e.width,
		height: e.height,
		type: e.data.constructor.name
	} : (I("Texture: Unable to serialize Texture."), {});
}
var Qe = 0, $e = /*@__PURE__*/ new W(), et = class r extends he {
	constructor(e = r.DEFAULT_IMAGE, n = r.DEFAULT_MAPPING, i = t, a = t, s = o, u = c, d = _, f = l, p = r.DEFAULT_ANISOTROPY, m = "") {
		super(), this.isTexture = !0, Object.defineProperty(this, "id", { value: Qe++ }), this.uuid = be(), this.name = "", this.source = new Xe(e), this.mipmaps = [], this.mapping = n, this.channel = 0, this.wrapS = i, this.wrapT = a, this.magFilter = s, this.minFilter = u, this.anisotropy = p, this.format = d, this.internalFormat = null, this.type = f, this.offset = new H(0, 0), this.repeat = new H(1, 1), this.center = new H(0, 0), this.rotation = 0, this.matrixAutoUpdate = !0, this.matrix = new G(), this.generateMipmaps = !0, this.premultiplyAlpha = !1, this.flipY = !0, this.unpackAlignment = 4, this.colorSpace = m, this.userData = {}, this.updateRanges = [], this.version = 0, this.onUpdate = null, this.renderTarget = null, this.isRenderTargetTexture = !1, this.isArrayTexture = !!(e && e.depth && e.depth > 1), this.pmremVersion = 0, this.normalized = !1;
	}
	get width() {
		return this.source.getSize($e).x;
	}
	get height() {
		return this.source.getSize($e).y;
	}
	get depth() {
		return this.source.getSize($e).z;
	}
	get image() {
		return this.source.data;
	}
	set image(e) {
		this.source.data = e;
	}
	updateMatrix() {
		this.matrix.setUvTransform(this.offset.x, this.offset.y, this.repeat.x, this.repeat.y, this.rotation, this.center.x, this.center.y);
	}
	addUpdateRange(e, t) {
		this.updateRanges.push({
			start: e,
			count: t
		});
	}
	clearUpdateRanges() {
		this.updateRanges.length = 0;
	}
	clone() {
		return new this.constructor().copy(this);
	}
	copy(e) {
		return this.name = e.name, this.source = e.source, this.mipmaps = e.mipmaps.slice(0), this.mapping = e.mapping, this.channel = e.channel, this.wrapS = e.wrapS, this.wrapT = e.wrapT, this.magFilter = e.magFilter, this.minFilter = e.minFilter, this.anisotropy = e.anisotropy, this.format = e.format, this.internalFormat = e.internalFormat, this.type = e.type, this.normalized = e.normalized, this.offset.copy(e.offset), this.repeat.copy(e.repeat), this.center.copy(e.center), this.rotation = e.rotation, this.matrixAutoUpdate = e.matrixAutoUpdate, this.matrix.copy(e.matrix), this.generateMipmaps = e.generateMipmaps, this.premultiplyAlpha = e.premultiplyAlpha, this.flipY = e.flipY, this.unpackAlignment = e.unpackAlignment, this.colorSpace = e.colorSpace, this.renderTarget = e.renderTarget, this.isRenderTargetTexture = e.isRenderTargetTexture, this.isArrayTexture = e.isArrayTexture, this.userData = JSON.parse(JSON.stringify(e.userData)), this.needsUpdate = !0, this;
	}
	setValues(e) {
		for (let t in e) {
			let n = e[t];
			if (n === void 0) {
				I(`Texture.setValues(): parameter '${t}' has value of undefined.`);
				continue;
			}
			let r = this[t];
			r === void 0 ? I(`Texture.setValues(): property '${t}' does not exist.`) : r && n && r.isVector2 && n.isVector2 || r && n && r.isVector3 && n.isVector3 || r && n && r.isMatrix3 && n.isMatrix3 ? r.copy(n) : this[t] = n;
		}
	}
	toJSON(e) {
		let t = e === void 0 || typeof e == "string";
		if (!t && e.textures[this.uuid] !== void 0) return e.textures[this.uuid];
		let n = {
			metadata: {
				version: 4.7,
				type: "Texture",
				generator: "Texture.toJSON"
			},
			uuid: this.uuid,
			name: this.name,
			image: this.source.toJSON(e).uuid,
			mapping: this.mapping,
			channel: this.channel,
			repeat: [this.repeat.x, this.repeat.y],
			offset: [this.offset.x, this.offset.y],
			center: [this.center.x, this.center.y],
			rotation: this.rotation,
			wrap: [this.wrapS, this.wrapT],
			format: this.format,
			internalFormat: this.internalFormat,
			type: this.type,
			normalized: this.normalized,
			colorSpace: this.colorSpace,
			minFilter: this.minFilter,
			magFilter: this.magFilter,
			anisotropy: this.anisotropy,
			flipY: this.flipY,
			generateMipmaps: this.generateMipmaps,
			premultiplyAlpha: this.premultiplyAlpha,
			unpackAlignment: this.unpackAlignment
		};
		return Object.keys(this.userData).length > 0 && (n.userData = this.userData), t || (e.textures[this.uuid] = n), n;
	}
	dispose() {
		this.dispatchEvent({ type: "dispose" });
	}
	transformUv(r) {
		if (this.mapping !== 300) return r;
		if (r.applyMatrix3(this.matrix), r.x < 0 || r.x > 1) switch (this.wrapS) {
			case e:
				r.x -= Math.floor(r.x);
				break;
			case t:
				r.x = r.x < 0 ? 0 : 1;
				break;
			case n: Math.abs(Math.floor(r.x) % 2) === 1 ? r.x = Math.ceil(r.x) - r.x : r.x -= Math.floor(r.x);
		}
		if (r.y < 0 || r.y > 1) switch (this.wrapT) {
			case e:
				r.y -= Math.floor(r.y);
				break;
			case t:
				r.y = r.y < 0 ? 0 : 1;
				break;
			case n: Math.abs(Math.floor(r.y) % 2) === 1 ? r.y = Math.ceil(r.y) - r.y : r.y -= Math.floor(r.y);
		}
		return this.flipY && (r.y = 1 - r.y), r;
	}
	set needsUpdate(e) {
		e === !0 && (this.version++, this.source.needsUpdate = !0);
	}
	set needsPMREMUpdate(e) {
		e === !0 && this.pmremVersion++;
	}
};
et.DEFAULT_IMAGE = null, et.DEFAULT_MAPPING = 300, et.DEFAULT_ANISOTROPY = 1;
var tt = class e {
	static {
		e.prototype.isVector4 = !0;
	}
	constructor(e = 0, t = 0, n = 0, r = 1) {
		this.x = e, this.y = t, this.z = n, this.w = r;
	}
	get width() {
		return this.z;
	}
	set width(e) {
		this.z = e;
	}
	get height() {
		return this.w;
	}
	set height(e) {
		this.w = e;
	}
	set(e, t, n, r) {
		return this.x = e, this.y = t, this.z = n, this.w = r, this;
	}
	setScalar(e) {
		return this.x = e, this.y = e, this.z = e, this.w = e, this;
	}
	setX(e) {
		return this.x = e, this;
	}
	setY(e) {
		return this.y = e, this;
	}
	setZ(e) {
		return this.z = e, this;
	}
	setW(e) {
		return this.w = e, this;
	}
	setComponent(e, t) {
		switch (e) {
			case 0:
				this.x = t;
				break;
			case 1:
				this.y = t;
				break;
			case 2:
				this.z = t;
				break;
			case 3:
				this.w = t;
				break;
			default: throw Error("THREE.Vector4: index is out of range: " + e);
		}
		return this;
	}
	getComponent(e) {
		switch (e) {
			case 0: return this.x;
			case 1: return this.y;
			case 2: return this.z;
			case 3: return this.w;
			default: throw Error("THREE.Vector4: index is out of range: " + e);
		}
	}
	clone() {
		return new this.constructor(this.x, this.y, this.z, this.w);
	}
	copy(e) {
		return this.x = e.x, this.y = e.y, this.z = e.z, this.w = e.w === void 0 ? 1 : e.w, this;
	}
	add(e) {
		return this.x += e.x, this.y += e.y, this.z += e.z, this.w += e.w, this;
	}
	addScalar(e) {
		return this.x += e, this.y += e, this.z += e, this.w += e, this;
	}
	addVectors(e, t) {
		return this.x = e.x + t.x, this.y = e.y + t.y, this.z = e.z + t.z, this.w = e.w + t.w, this;
	}
	addScaledVector(e, t) {
		return this.x += e.x * t, this.y += e.y * t, this.z += e.z * t, this.w += e.w * t, this;
	}
	sub(e) {
		return this.x -= e.x, this.y -= e.y, this.z -= e.z, this.w -= e.w, this;
	}
	subScalar(e) {
		return this.x -= e, this.y -= e, this.z -= e, this.w -= e, this;
	}
	subVectors(e, t) {
		return this.x = e.x - t.x, this.y = e.y - t.y, this.z = e.z - t.z, this.w = e.w - t.w, this;
	}
	multiply(e) {
		return this.x *= e.x, this.y *= e.y, this.z *= e.z, this.w *= e.w, this;
	}
	multiplyScalar(e) {
		return this.x *= e, this.y *= e, this.z *= e, this.w *= e, this;
	}
	applyMatrix4(e) {
		let t = this.x, n = this.y, r = this.z, i = this.w, a = e.elements;
		return this.x = a[0] * t + a[4] * n + a[8] * r + a[12] * i, this.y = a[1] * t + a[5] * n + a[9] * r + a[13] * i, this.z = a[2] * t + a[6] * n + a[10] * r + a[14] * i, this.w = a[3] * t + a[7] * n + a[11] * r + a[15] * i, this;
	}
	divide(e) {
		return this.x /= e.x, this.y /= e.y, this.z /= e.z, this.w /= e.w, this;
	}
	divideScalar(e) {
		return this.multiplyScalar(1 / e);
	}
	setAxisAngleFromQuaternion(e) {
		this.w = 2 * Math.acos(e.w);
		let t = Math.sqrt(1 - e.w * e.w);
		return t < 1e-4 ? (this.x = 1, this.y = 0, this.z = 0) : (this.x = e.x / t, this.y = e.y / t, this.z = e.z / t), this;
	}
	setAxisAngleFromRotationMatrix(e) {
		let t, n, r, i, a = .01, o = .1, s = e.elements, c = s[0], l = s[4], u = s[8], d = s[1], f = s[5], p = s[9], m = s[2], h = s[6], g = s[10];
		if (Math.abs(l - d) < a && Math.abs(u - m) < a && Math.abs(p - h) < a) {
			if (Math.abs(l + d) < o && Math.abs(u + m) < o && Math.abs(p + h) < o && Math.abs(c + f + g - 3) < o) return this.set(1, 0, 0, 0), this;
			t = Math.PI;
			let e = (c + 1) / 2, s = (f + 1) / 2, _ = (g + 1) / 2, v = (l + d) / 4, y = (u + m) / 4, b = (p + h) / 4;
			return e > s && e > _ ? e < a ? (n = 0, r = .707106781, i = .707106781) : (n = Math.sqrt(e), r = v / n, i = y / n) : s > _ ? s < a ? (n = .707106781, r = 0, i = .707106781) : (r = Math.sqrt(s), n = v / r, i = b / r) : _ < a ? (n = .707106781, r = .707106781, i = 0) : (i = Math.sqrt(_), n = y / i, r = b / i), this.set(n, r, i, t), this;
		}
		let _ = Math.sqrt((h - p) * (h - p) + (u - m) * (u - m) + (d - l) * (d - l));
		return Math.abs(_) < .001 && (_ = 1), this.x = (h - p) / _, this.y = (u - m) / _, this.z = (d - l) / _, this.w = Math.acos((c + f + g - 1) / 2), this;
	}
	setFromMatrixPosition(e) {
		let t = e.elements;
		return this.x = t[12], this.y = t[13], this.z = t[14], this.w = t[15], this;
	}
	min(e) {
		return this.x = Math.min(this.x, e.x), this.y = Math.min(this.y, e.y), this.z = Math.min(this.z, e.z), this.w = Math.min(this.w, e.w), this;
	}
	max(e) {
		return this.x = Math.max(this.x, e.x), this.y = Math.max(this.y, e.y), this.z = Math.max(this.z, e.z), this.w = Math.max(this.w, e.w), this;
	}
	clamp(e, t) {
		return this.x = R(this.x, e.x, t.x), this.y = R(this.y, e.y, t.y), this.z = R(this.z, e.z, t.z), this.w = R(this.w, e.w, t.w), this;
	}
	clampScalar(e, t) {
		return this.x = R(this.x, e, t), this.y = R(this.y, e, t), this.z = R(this.z, e, t), this.w = R(this.w, e, t), this;
	}
	clampLength(e, t) {
		let n = this.length();
		return this.divideScalar(n || 1).multiplyScalar(R(n, e, t));
	}
	floor() {
		return this.x = Math.floor(this.x), this.y = Math.floor(this.y), this.z = Math.floor(this.z), this.w = Math.floor(this.w), this;
	}
	ceil() {
		return this.x = Math.ceil(this.x), this.y = Math.ceil(this.y), this.z = Math.ceil(this.z), this.w = Math.ceil(this.w), this;
	}
	round() {
		return this.x = Math.round(this.x), this.y = Math.round(this.y), this.z = Math.round(this.z), this.w = Math.round(this.w), this;
	}
	roundToZero() {
		return this.x = Math.trunc(this.x), this.y = Math.trunc(this.y), this.z = Math.trunc(this.z), this.w = Math.trunc(this.w), this;
	}
	negate() {
		return this.x = -this.x, this.y = -this.y, this.z = -this.z, this.w = -this.w, this;
	}
	dot(e) {
		return this.x * e.x + this.y * e.y + this.z * e.z + this.w * e.w;
	}
	lengthSq() {
		return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
	}
	length() {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
	}
	manhattanLength() {
		return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z) + Math.abs(this.w);
	}
	normalize() {
		return this.divideScalar(this.length() || 1);
	}
	setLength(e) {
		return this.normalize().multiplyScalar(e);
	}
	lerp(e, t) {
		return this.x += (e.x - this.x) * t, this.y += (e.y - this.y) * t, this.z += (e.z - this.z) * t, this.w += (e.w - this.w) * t, this;
	}
	lerpVectors(e, t, n) {
		return this.x = e.x + (t.x - e.x) * n, this.y = e.y + (t.y - e.y) * n, this.z = e.z + (t.z - e.z) * n, this.w = e.w + (t.w - e.w) * n, this;
	}
	equals(e) {
		return e.x === this.x && e.y === this.y && e.z === this.z && e.w === this.w;
	}
	fromArray(e, t = 0) {
		return this.x = e[t], this.y = e[t + 1], this.z = e[t + 2], this.w = e[t + 3], this;
	}
	toArray(e = [], t = 0) {
		return e[t] = this.x, e[t + 1] = this.y, e[t + 2] = this.z, e[t + 3] = this.w, e;
	}
	fromBufferAttribute(e, t) {
		return this.x = e.getX(t), this.y = e.getY(t), this.z = e.getZ(t), this.w = e.getW(t), this;
	}
	random() {
		return this.x = Math.random(), this.y = Math.random(), this.z = Math.random(), this.w = Math.random(), this;
	}
	*[Symbol.iterator]() {
		yield this.x, yield this.y, yield this.z, yield this.w;
	}
}, nt = class extends he {
	constructor(e = 1, t = 1, n = {}) {
		super(), n = Object.assign({
			generateMipmaps: !1,
			internalFormat: null,
			minFilter: o,
			depthBuffer: !0,
			stencilBuffer: !1,
			resolveColorBuffer: !0,
			resolveDepthBuffer: !0,
			resolveStencilBuffer: !0,
			storeMultisampledColorBuffer: !0,
			storeMultisampledDepthBuffer: !0,
			storeMultisampledStencilBuffer: !0,
			depthTexture: null,
			samples: 0,
			count: 1,
			depth: 1,
			multiview: !1,
			useArrayDepthTexture: !1
		}, n), this.isRenderTarget = !0, this.width = e, this.height = t, this.depth = n.depth, this.scissor = new tt(0, 0, e, t), this.scissorTest = !1, this.viewport = new tt(0, 0, e, t), this.textures = [];
		let r = new et({
			width: e,
			height: t,
			depth: n.depth
		}), i = n.count;
		for (let e = 0; e < i; e++) this.textures[e] = r.clone(), this.textures[e].isRenderTargetTexture = !0, this.textures[e].renderTarget = this;
		this._setTextureOptions(n), this.depthBuffer = n.depthBuffer, this.stencilBuffer = n.stencilBuffer, this.resolveColorBuffer = n.resolveColorBuffer, this.resolveDepthBuffer = n.resolveDepthBuffer, this.resolveStencilBuffer = n.resolveStencilBuffer, this.storeMultisampledColorBuffer = n.storeMultisampledColorBuffer, this.storeMultisampledDepthBuffer = n.storeMultisampledDepthBuffer, this.storeMultisampledStencilBuffer = n.storeMultisampledStencilBuffer, this._depthTexture = null, this.depthTexture = n.depthTexture, this.samples = n.samples, this.multiview = n.multiview, this.useArrayDepthTexture = n.useArrayDepthTexture;
	}
	_setTextureOptions(e = {}) {
		let t = {
			minFilter: o,
			generateMipmaps: !1,
			flipY: !1,
			internalFormat: null
		};
		e.mapping !== void 0 && (t.mapping = e.mapping), e.wrapS !== void 0 && (t.wrapS = e.wrapS), e.wrapT !== void 0 && (t.wrapT = e.wrapT), e.wrapR !== void 0 && (t.wrapR = e.wrapR), e.magFilter !== void 0 && (t.magFilter = e.magFilter), e.minFilter !== void 0 && (t.minFilter = e.minFilter), e.format !== void 0 && (t.format = e.format), e.type !== void 0 && (t.type = e.type), e.anisotropy !== void 0 && (t.anisotropy = e.anisotropy), e.colorSpace !== void 0 && (t.colorSpace = e.colorSpace), e.flipY !== void 0 && (t.flipY = e.flipY), e.generateMipmaps !== void 0 && (t.generateMipmaps = e.generateMipmaps), e.internalFormat !== void 0 && (t.internalFormat = e.internalFormat);
		for (let e = 0; e < this.textures.length; e++) this.textures[e].setValues(t);
	}
	get texture() {
		return this.textures[0];
	}
	set texture(e) {
		this.textures[0] = e;
	}
	set depthTexture(e) {
		this._depthTexture !== null && this._depthTexture.renderTarget === this && (this._depthTexture.renderTarget = null), e !== null && e.renderTarget === null && (e.renderTarget = this), this._depthTexture = e;
	}
	get depthTexture() {
		return this._depthTexture;
	}
	setSize(e, t, n = 1) {
		if (this.width !== e || this.height !== t || this.depth !== n) {
			this.width = e, this.height = t, this.depth = n;
			for (let r = 0, i = this.textures.length; r < i; r++) this.textures[r].image.width = e, this.textures[r].image.height = t, this.textures[r].image.depth = n, this.textures[r].isData3DTexture !== !0 && (this.textures[r].isArrayTexture = this.textures[r].image.depth > 1);
			this.dispose();
		}
		this.viewport.set(0, 0, e, t), this.scissor.set(0, 0, e, t);
	}
	clone() {
		return new this.constructor().copy(this);
	}
	copy(e) {
		this.width = e.width, this.height = e.height, this.depth = e.depth, this.scissor.copy(e.scissor), this.scissorTest = e.scissorTest, this.viewport.copy(e.viewport), this.textures.length = 0;
		for (let t = 0, n = e.textures.length; t < n; t++) {
			this.textures[t] = e.textures[t].clone(), this.textures[t].isRenderTargetTexture = !0, this.textures[t].renderTarget = this;
			let n = Object.assign({}, e.textures[t].image);
			this.textures[t].source = new Xe(n);
		}
		if (this.depthBuffer = e.depthBuffer, this.stencilBuffer = e.stencilBuffer, this.resolveColorBuffer = e.resolveColorBuffer, this.resolveDepthBuffer = e.resolveDepthBuffer, this.resolveStencilBuffer = e.resolveStencilBuffer, this.storeMultisampledColorBuffer = e.storeMultisampledColorBuffer, this.storeMultisampledDepthBuffer = e.storeMultisampledDepthBuffer, this.storeMultisampledStencilBuffer = e.storeMultisampledStencilBuffer, e.depthTexture !== null) {
			if (e.depthTexture.renderTarget === e) {
				let t = e.depthTexture.clone();
				t.renderTarget = null, this.depthTexture = t;
			} else this.depthTexture = e.depthTexture;
		}
		return this.samples = e.samples, this.multiview = e.multiview, this.useArrayDepthTexture = e.useArrayDepthTexture, this;
	}
	dispose() {
		this.dispatchEvent({ type: "dispose" });
	}
}, rt = class extends nt {
	constructor(e = 1, t = 1, n = {}) {
		super(e, t, n), this.isWebGLRenderTarget = !0;
	}
}, it = class extends et {
	constructor(e = null, n = 1, i = 1, a = 1) {
		super(null), this.isDataArrayTexture = !0, this.image = {
			data: e,
			width: n,
			height: i,
			depth: a
		}, this.magFilter = r, this.minFilter = r, this.wrapR = t, this.generateMipmaps = !1, this.flipY = !1, this.unpackAlignment = 1, this.layerUpdates = /* @__PURE__ */ new Set();
	}
	copy(e) {
		return super.copy(e), this.wrapR = e.wrapR, this;
	}
	addLayerUpdate(e) {
		this.layerUpdates.add(e);
	}
	clearLayerUpdates() {
		this.layerUpdates.clear();
	}
}, at = class extends et {
	constructor(e = null, n = 1, i = 1, a = 1) {
		super(null), this.isData3DTexture = !0, this.image = {
			data: e,
			width: n,
			height: i,
			depth: a
		}, this.magFilter = r, this.minFilter = r, this.wrapR = t, this.generateMipmaps = !1, this.flipY = !1, this.unpackAlignment = 1;
	}
	copy(e) {
		return super.copy(e), this.wrapR = e.wrapR, this;
	}
}, q = class e {
	static {
		e.prototype.isMatrix4 = !0;
	}
	constructor(e, t, n, r, i, a, o, s, c, l, u, d, f, p, m, h) {
		this.elements = [
			1,
			0,
			0,
			0,
			0,
			1,
			0,
			0,
			0,
			0,
			1,
			0,
			0,
			0,
			0,
			1
		], e !== void 0 && this.set(e, t, n, r, i, a, o, s, c, l, u, d, f, p, m, h);
	}
	set(e, t, n, r, i, a, o, s, c, l, u, d, f, p, m, h) {
		let g = this.elements;
		return g[0] = e, g[4] = t, g[8] = n, g[12] = r, g[1] = i, g[5] = a, g[9] = o, g[13] = s, g[2] = c, g[6] = l, g[10] = u, g[14] = d, g[3] = f, g[7] = p, g[11] = m, g[15] = h, this;
	}
	identity() {
		return this.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1), this;
	}
	clone() {
		return new e().fromArray(this.elements);
	}
	copy(e) {
		let t = this.elements, n = e.elements;
		return t[0] = n[0], t[1] = n[1], t[2] = n[2], t[3] = n[3], t[4] = n[4], t[5] = n[5], t[6] = n[6], t[7] = n[7], t[8] = n[8], t[9] = n[9], t[10] = n[10], t[11] = n[11], t[12] = n[12], t[13] = n[13], t[14] = n[14], t[15] = n[15], this;
	}
	copyPosition(e) {
		let t = this.elements, n = e.elements;
		return t[12] = n[12], t[13] = n[13], t[14] = n[14], this;
	}
	setFromMatrix3(e) {
		let t = e.elements;
		return this.set(t[0], t[3], t[6], 0, t[1], t[4], t[7], 0, t[2], t[5], t[8], 0, 0, 0, 0, 1), this;
	}
	extractBasis(e, t, n) {
		return this.determinantAffine() === 0 ? (e.set(1, 0, 0), t.set(0, 1, 0), n.set(0, 0, 1), this) : (e.setFromMatrixColumn(this, 0), t.setFromMatrixColumn(this, 1), n.setFromMatrixColumn(this, 2), this);
	}
	makeBasis(e, t, n) {
		return this.set(e.x, t.x, n.x, 0, e.y, t.y, n.y, 0, e.z, t.z, n.z, 0, 0, 0, 0, 1), this;
	}
	extractRotation(e) {
		if (e.determinantAffine() === 0) return this.identity();
		let t = this.elements, n = e.elements, r = 1 / ot.setFromMatrixColumn(e, 0).length(), i = 1 / ot.setFromMatrixColumn(e, 1).length(), a = 1 / ot.setFromMatrixColumn(e, 2).length();
		return t[0] = n[0] * r, t[1] = n[1] * r, t[2] = n[2] * r, t[3] = 0, t[4] = n[4] * i, t[5] = n[5] * i, t[6] = n[6] * i, t[7] = 0, t[8] = n[8] * a, t[9] = n[9] * a, t[10] = n[10] * a, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, this;
	}
	makeRotationFromEuler(e) {
		let t = this.elements, n = e.x, r = e.y, i = e.z, a = Math.cos(n), o = Math.sin(n), s = Math.cos(r), c = Math.sin(r), l = Math.cos(i), u = Math.sin(i);
		if (e.order === "XYZ") {
			let e = a * l, n = a * u, r = o * l, i = o * u;
			t[0] = s * l, t[4] = -s * u, t[8] = c, t[1] = n + r * c, t[5] = e - i * c, t[9] = -o * s, t[2] = i - e * c, t[6] = r + n * c, t[10] = a * s;
		} else if (e.order === "YXZ") {
			let e = s * l, n = s * u, r = c * l, i = c * u;
			t[0] = e + i * o, t[4] = r * o - n, t[8] = a * c, t[1] = a * u, t[5] = a * l, t[9] = -o, t[2] = n * o - r, t[6] = i + e * o, t[10] = a * s;
		} else if (e.order === "ZXY") {
			let e = s * l, n = s * u, r = c * l, i = c * u;
			t[0] = e - i * o, t[4] = -a * u, t[8] = r + n * o, t[1] = n + r * o, t[5] = a * l, t[9] = i - e * o, t[2] = -a * c, t[6] = o, t[10] = a * s;
		} else if (e.order === "ZYX") {
			let e = a * l, n = a * u, r = o * l, i = o * u;
			t[0] = s * l, t[4] = r * c - n, t[8] = e * c + i, t[1] = s * u, t[5] = i * c + e, t[9] = n * c - r, t[2] = -c, t[6] = o * s, t[10] = a * s;
		} else if (e.order === "YZX") {
			let e = a * s, n = a * c, r = o * s, i = o * c;
			t[0] = s * l, t[4] = i - e * u, t[8] = r * u + n, t[1] = u, t[5] = a * l, t[9] = -o * l, t[2] = -c * l, t[6] = n * u + r, t[10] = e - i * u;
		} else if (e.order === "XZY") {
			let e = a * s, n = a * c, r = o * s, i = o * c;
			t[0] = s * l, t[4] = -u, t[8] = c * l, t[1] = e * u + i, t[5] = a * l, t[9] = n * u - r, t[2] = r * u - n, t[6] = o * l, t[10] = i * u + e;
		}
		return t[3] = 0, t[7] = 0, t[11] = 0, t[12] = 0, t[13] = 0, t[14] = 0, t[15] = 1, this;
	}
	makeRotationFromQuaternion(e) {
		return this.compose(ct, e, lt);
	}
	lookAt(e, t, n) {
		let r = this.elements;
		return ft.subVectors(e, t), ft.lengthSq() === 0 && (ft.z = 1), ft.normalize(), ut.crossVectors(n, ft), ut.lengthSq() === 0 && (Math.abs(n.z) === 1 ? ft.x += 1e-4 : ft.z += 1e-4, ft.normalize(), ut.crossVectors(n, ft)), ut.normalize(), dt.crossVectors(ft, ut), r[0] = ut.x, r[4] = dt.x, r[8] = ft.x, r[1] = ut.y, r[5] = dt.y, r[9] = ft.y, r[2] = ut.z, r[6] = dt.z, r[10] = ft.z, this;
	}
	multiply(e) {
		return this.multiplyMatrices(this, e);
	}
	premultiply(e) {
		return this.multiplyMatrices(e, this);
	}
	multiplyMatrices(e, t) {
		let n = e.elements, r = t.elements, i = this.elements, a = n[0], o = n[4], s = n[8], c = n[12], l = n[1], u = n[5], d = n[9], f = n[13], p = n[2], m = n[6], h = n[10], g = n[14], _ = n[3], v = n[7], y = n[11], b = n[15], x = r[0], S = r[4], C = r[8], w = r[12], T = r[1], E = r[5], D = r[9], O = r[13], ee = r[2], k = r[6], A = r[10], j = r[14], te = r[3], M = r[7], N = r[11], ne = r[15];
		return i[0] = a * x + o * T + s * ee + c * te, i[4] = a * S + o * E + s * k + c * M, i[8] = a * C + o * D + s * A + c * N, i[12] = a * w + o * O + s * j + c * ne, i[1] = l * x + u * T + d * ee + f * te, i[5] = l * S + u * E + d * k + f * M, i[9] = l * C + u * D + d * A + f * N, i[13] = l * w + u * O + d * j + f * ne, i[2] = p * x + m * T + h * ee + g * te, i[6] = p * S + m * E + h * k + g * M, i[10] = p * C + m * D + h * A + g * N, i[14] = p * w + m * O + h * j + g * ne, i[3] = _ * x + v * T + y * ee + b * te, i[7] = _ * S + v * E + y * k + b * M, i[11] = _ * C + v * D + y * A + b * N, i[15] = _ * w + v * O + y * j + b * ne, this;
	}
	multiplyScalar(e) {
		let t = this.elements;
		return t[0] *= e, t[4] *= e, t[8] *= e, t[12] *= e, t[1] *= e, t[5] *= e, t[9] *= e, t[13] *= e, t[2] *= e, t[6] *= e, t[10] *= e, t[14] *= e, t[3] *= e, t[7] *= e, t[11] *= e, t[15] *= e, this;
	}
	determinant() {
		let e = this.elements, t = e[0], n = e[4], r = e[8], i = e[12], a = e[1], o = e[5], s = e[9], c = e[13], l = e[2], u = e[6], d = e[10], f = e[14], p = e[3], m = e[7], h = e[11], g = e[15], _ = s * f - c * d, v = o * f - c * u, y = o * d - s * u, b = a * f - c * l, x = a * d - s * l, S = a * u - o * l;
		return t * (m * _ - h * v + g * y) - n * (p * _ - h * b + g * x) + r * (p * v - m * b + g * S) - i * (p * y - m * x + h * S);
	}
	determinantAffine() {
		let e = this.elements, t = e[0], n = e[4], r = e[8], i = e[1], a = e[5], o = e[9], s = e[2], c = e[6], l = e[10];
		return t * (a * l - o * c) - n * (i * l - o * s) + r * (i * c - a * s);
	}
	transpose() {
		let e = this.elements, t;
		return t = e[1], e[1] = e[4], e[4] = t, t = e[2], e[2] = e[8], e[8] = t, t = e[6], e[6] = e[9], e[9] = t, t = e[3], e[3] = e[12], e[12] = t, t = e[7], e[7] = e[13], e[13] = t, t = e[11], e[11] = e[14], e[14] = t, this;
	}
	setPosition(e, t, n) {
		let r = this.elements;
		return e.isVector3 ? (r[12] = e.x, r[13] = e.y, r[14] = e.z) : (r[12] = e, r[13] = t, r[14] = n), this;
	}
	invert() {
		let e = this.elements, t = e[0], n = e[1], r = e[2], i = e[3], a = e[4], o = e[5], s = e[6], c = e[7], l = e[8], u = e[9], d = e[10], f = e[11], p = e[12], m = e[13], h = e[14], g = e[15], _ = t * o - n * a, v = t * s - r * a, y = t * c - i * a, b = n * s - r * o, x = n * c - i * o, S = r * c - i * s, C = l * m - u * p, w = l * h - d * p, T = l * g - f * p, E = u * h - d * m, D = u * g - f * m, O = d * g - f * h, ee = _ * O - v * D + y * E + b * T - x * w + S * C;
		if (ee === 0) return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
		let k = 1 / ee;
		return e[0] = (o * O - s * D + c * E) * k, e[1] = (r * D - n * O - i * E) * k, e[2] = (m * S - h * x + g * b) * k, e[3] = (d * x - u * S - f * b) * k, e[4] = (s * T - a * O - c * w) * k, e[5] = (t * O - r * T + i * w) * k, e[6] = (h * y - p * S - g * v) * k, e[7] = (l * S - d * y + f * v) * k, e[8] = (a * D - o * T + c * C) * k, e[9] = (n * T - t * D - i * C) * k, e[10] = (p * x - m * y + g * _) * k, e[11] = (u * y - l * x - f * _) * k, e[12] = (o * w - a * E - s * C) * k, e[13] = (t * E - n * w + r * C) * k, e[14] = (m * v - p * b - h * _) * k, e[15] = (l * b - u * v + d * _) * k, this;
	}
	scale(e) {
		let t = this.elements, n = e.x, r = e.y, i = e.z;
		return t[0] *= n, t[4] *= r, t[8] *= i, t[1] *= n, t[5] *= r, t[9] *= i, t[2] *= n, t[6] *= r, t[10] *= i, t[3] *= n, t[7] *= r, t[11] *= i, this;
	}
	getMaxScaleOnAxis() {
		let e = this.elements, t = e[0] * e[0] + e[1] * e[1] + e[2] * e[2], n = e[4] * e[4] + e[5] * e[5] + e[6] * e[6], r = e[8] * e[8] + e[9] * e[9] + e[10] * e[10];
		return Math.sqrt(Math.max(t, n, r));
	}
	makeTranslation(e, t, n) {
		return e.isVector3 ? this.set(1, 0, 0, e.x, 0, 1, 0, e.y, 0, 0, 1, e.z, 0, 0, 0, 1) : this.set(1, 0, 0, e, 0, 1, 0, t, 0, 0, 1, n, 0, 0, 0, 1), this;
	}
	makeRotationX(e) {
		let t = Math.cos(e), n = Math.sin(e);
		return this.set(1, 0, 0, 0, 0, t, -n, 0, 0, n, t, 0, 0, 0, 0, 1), this;
	}
	makeRotationY(e) {
		let t = Math.cos(e), n = Math.sin(e);
		return this.set(t, 0, n, 0, 0, 1, 0, 0, -n, 0, t, 0, 0, 0, 0, 1), this;
	}
	makeRotationZ(e) {
		let t = Math.cos(e), n = Math.sin(e);
		return this.set(t, -n, 0, 0, n, t, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1), this;
	}
	makeRotationAxis(e, t) {
		let n = Math.cos(t), r = Math.sin(t), i = 1 - n, a = e.x, o = e.y, s = e.z, c = i * a, l = i * o;
		return this.set(c * a + n, c * o - r * s, c * s + r * o, 0, c * o + r * s, l * o + n, l * s - r * a, 0, c * s - r * o, l * s + r * a, i * s * s + n, 0, 0, 0, 0, 1), this;
	}
	makeScale(e, t, n) {
		return this.set(e, 0, 0, 0, 0, t, 0, 0, 0, 0, n, 0, 0, 0, 0, 1), this;
	}
	makeShear(e, t, n, r, i, a) {
		return this.set(1, n, i, 0, e, 1, a, 0, t, r, 1, 0, 0, 0, 0, 1), this;
	}
	compose(e, t, n) {
		let r = this.elements, i = t._x, a = t._y, o = t._z, s = t._w, c = i + i, l = a + a, u = o + o, d = i * c, f = i * l, p = i * u, m = a * l, h = a * u, g = o * u, _ = s * c, v = s * l, y = s * u, b = n.x, x = n.y, S = n.z;
		return r[0] = (1 - (m + g)) * b, r[1] = (f + y) * b, r[2] = (p - v) * b, r[3] = 0, r[4] = (f - y) * x, r[5] = (1 - (d + g)) * x, r[6] = (h + _) * x, r[7] = 0, r[8] = (p + v) * S, r[9] = (h - _) * S, r[10] = (1 - (d + m)) * S, r[11] = 0, r[12] = e.x, r[13] = e.y, r[14] = e.z, r[15] = 1, this;
	}
	decompose(e, t, n) {
		let r = this.elements;
		e.x = r[12], e.y = r[13], e.z = r[14];
		let i = this.determinantAffine();
		if (i === 0) return n.set(1, 1, 1), t.identity(), this;
		let a = ot.set(r[0], r[1], r[2]).length(), o = ot.set(r[4], r[5], r[6]).length(), s = ot.set(r[8], r[9], r[10]).length();
		i < 0 && (a = -a), st.copy(this);
		let c = 1 / a, l = 1 / o, u = 1 / s;
		return st.elements[0] *= c, st.elements[1] *= c, st.elements[2] *= c, st.elements[4] *= l, st.elements[5] *= l, st.elements[6] *= l, st.elements[8] *= u, st.elements[9] *= u, st.elements[10] *= u, t.setFromRotationMatrix(st), n.x = a, n.y = o, n.z = s, this;
	}
	makePerspective(e, t, n, r, i, a, o = ie, s = !1) {
		let c = this.elements, l = 2 * i / (t - e), u = 2 * i / (n - r), d = (t + e) / (t - e), f = (n + r) / (n - r), p, m;
		if (s) p = i / (a - i), m = a * i / (a - i);
		else if (o === 2e3) p = -(a + i) / (a - i), m = -2 * a * i / (a - i);
		else if (o === 2001) p = -a / (a - i), m = -a * i / (a - i);
		else throw Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: " + o);
		return c[0] = l, c[4] = 0, c[8] = d, c[12] = 0, c[1] = 0, c[5] = u, c[9] = f, c[13] = 0, c[2] = 0, c[6] = 0, c[10] = p, c[14] = m, c[3] = 0, c[7] = 0, c[11] = -1, c[15] = 0, this;
	}
	makeOrthographic(e, t, n, r, i, a, o = ie, s = !1) {
		let c = this.elements, l = 2 / (t - e), u = 2 / (n - r), d = -(t + e) / (t - e), f = -(n + r) / (n - r), p, m;
		if (s) p = 1 / (a - i), m = a / (a - i);
		else if (o === 2e3) p = -2 / (a - i), m = -(a + i) / (a - i);
		else if (o === 2001) p = -1 / (a - i), m = -i / (a - i);
		else throw Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: " + o);
		return c[0] = l, c[4] = 0, c[8] = 0, c[12] = d, c[1] = 0, c[5] = u, c[9] = 0, c[13] = f, c[2] = 0, c[6] = 0, c[10] = p, c[14] = m, c[3] = 0, c[7] = 0, c[11] = 0, c[15] = 1, this;
	}
	equals(e) {
		let t = this.elements, n = e.elements;
		for (let e = 0; e < 16; e++) if (t[e] !== n[e]) return !1;
		return !0;
	}
	fromArray(e, t = 0) {
		for (let n = 0; n < 16; n++) this.elements[n] = e[n + t];
		return this;
	}
	toArray(e = [], t = 0) {
		let n = this.elements;
		return e[t] = n[0], e[t + 1] = n[1], e[t + 2] = n[2], e[t + 3] = n[3], e[t + 4] = n[4], e[t + 5] = n[5], e[t + 6] = n[6], e[t + 7] = n[7], e[t + 8] = n[8], e[t + 9] = n[9], e[t + 10] = n[10], e[t + 11] = n[11], e[t + 12] = n[12], e[t + 13] = n[13], e[t + 14] = n[14], e[t + 15] = n[15], e;
	}
}, ot = /*@__PURE__*/ new W(), st = /*@__PURE__*/ new q(), ct = /*@__PURE__*/ new W(0, 0, 0), lt = /*@__PURE__*/ new W(1, 1, 1), ut = /*@__PURE__*/ new W(), dt = /*@__PURE__*/ new W(), ft = /*@__PURE__*/ new W(), pt = /*@__PURE__*/ new q(), mt = /*@__PURE__*/ new U(), ht = class e {
	constructor(t = 0, n = 0, r = 0, i = e.DEFAULT_ORDER) {
		this.isEuler = !0, this._x = t, this._y = n, this._z = r, this._order = i;
	}
	get x() {
		return this._x;
	}
	set x(e) {
		this._x = e, this._onChangeCallback();
	}
	get y() {
		return this._y;
	}
	set y(e) {
		this._y = e, this._onChangeCallback();
	}
	get z() {
		return this._z;
	}
	set z(e) {
		this._z = e, this._onChangeCallback();
	}
	get order() {
		return this._order;
	}
	set order(e) {
		this._order = e, this._onChangeCallback();
	}
	set(e, t, n, r = this._order) {
		return this._x = e, this._y = t, this._z = n, this._order = r, this._onChangeCallback(), this;
	}
	clone() {
		return new this.constructor(this._x, this._y, this._z, this._order);
	}
	copy(e) {
		return this._x = e._x, this._y = e._y, this._z = e._z, this._order = e._order, this._onChangeCallback(), this;
	}
	setFromRotationMatrix(e, t = this._order, n = !0) {
		let r = e.elements, i = r[0], a = r[4], o = r[8], s = r[1], c = r[5], l = r[9], u = r[2], d = r[6], f = r[10];
		switch (t) {
			case "XYZ":
				this._y = Math.asin(R(o, -1, 1)), Math.abs(o) < .9999999 ? (this._x = Math.atan2(-l, f), this._z = Math.atan2(-a, i)) : (this._x = Math.atan2(d, c), this._z = 0);
				break;
			case "YXZ":
				this._x = Math.asin(-R(l, -1, 1)), Math.abs(l) < .9999999 ? (this._y = Math.atan2(o, f), this._z = Math.atan2(s, c)) : (this._y = Math.atan2(-u, i), this._z = 0);
				break;
			case "ZXY":
				this._x = Math.asin(R(d, -1, 1)), Math.abs(d) < .9999999 ? (this._y = Math.atan2(-u, f), this._z = Math.atan2(-a, c)) : (this._y = 0, this._z = Math.atan2(s, i));
				break;
			case "ZYX":
				this._y = Math.asin(-R(u, -1, 1)), Math.abs(u) < .9999999 ? (this._x = Math.atan2(d, f), this._z = Math.atan2(s, i)) : (this._x = 0, this._z = Math.atan2(-a, c));
				break;
			case "YZX":
				this._z = Math.asin(R(s, -1, 1)), Math.abs(s) < .9999999 ? (this._x = Math.atan2(-l, c), this._y = Math.atan2(-u, i)) : (this._x = 0, this._y = Math.atan2(o, f));
				break;
			case "XZY":
				this._z = Math.asin(-R(a, -1, 1)), Math.abs(a) < .9999999 ? (this._x = Math.atan2(d, c), this._y = Math.atan2(o, i)) : (this._x = Math.atan2(-l, f), this._y = 0);
				break;
			default: I("Euler: .setFromRotationMatrix() encountered an unknown order: " + t);
		}
		return this._order = t, n === !0 && this._onChangeCallback(), this;
	}
	setFromQuaternion(e, t, n) {
		return pt.makeRotationFromQuaternion(e), this.setFromRotationMatrix(pt, t, n);
	}
	setFromVector3(e, t = this._order) {
		return this.set(e.x, e.y, e.z, t);
	}
	reorder(e) {
		return mt.setFromEuler(this), this.setFromQuaternion(mt, e);
	}
	equals(e) {
		return e._x === this._x && e._y === this._y && e._z === this._z && e._order === this._order;
	}
	fromArray(e) {
		return this._x = e[0], this._y = e[1], this._z = e[2], e[3] !== void 0 && (this._order = e[3]), this._onChangeCallback(), this;
	}
	toArray(e = [], t = 0) {
		return e[t] = this._x, e[t + 1] = this._y, e[t + 2] = this._z, e[t + 3] = this._order, e;
	}
	_onChange(e) {
		return this._onChangeCallback = e, this;
	}
	_onChangeCallback() {}
	*[Symbol.iterator]() {
		yield this._x, yield this._y, yield this._z, yield this._order;
	}
};
ht.DEFAULT_ORDER = "XYZ";
var gt = class {
	constructor() {
		this.mask = 1;
	}
	set(e) {
		this.mask = 1 << e >>> 0;
	}
	enable(e) {
		this.mask |= 1 << e;
	}
	enableAll() {
		this.mask = -1;
	}
	toggle(e) {
		this.mask ^= 1 << e;
	}
	disable(e) {
		this.mask &= ~(1 << e);
	}
	disableAll() {
		this.mask = 0;
	}
	test(e) {
		return (this.mask & e.mask) !== 0;
	}
	isEnabled(e) {
		return !!(this.mask & 1 << e);
	}
}, _t = 0, vt = /*@__PURE__*/ new W(), yt = /*@__PURE__*/ new U(), bt = /*@__PURE__*/ new q(), xt = /*@__PURE__*/ new W(), St = /*@__PURE__*/ new W(), Ct = /*@__PURE__*/ new W(), wt = /*@__PURE__*/ new U(), Tt = /*@__PURE__*/ new W(1, 0, 0), Et = /*@__PURE__*/ new W(0, 1, 0), Dt = /*@__PURE__*/ new W(0, 0, 1), Ot = { type: "added" }, kt = { type: "removed" }, At = {
	type: "childadded",
	child: null
}, jt = {
	type: "childremoved",
	child: null
}, Mt = class e extends he {
	constructor() {
		super(), this.isObject3D = !0, Object.defineProperty(this, "id", { value: _t++ }), this.uuid = be(), this.name = "", this.type = "Object3D", this.parent = null, this.children = [], this.up = e.DEFAULT_UP.clone();
		let t = new W(), n = new ht(), r = new U(), i = new W(1, 1, 1);
		function a() {
			r.setFromEuler(n, !1);
		}
		function o() {
			n.setFromQuaternion(r, void 0, !1);
		}
		n._onChange(a), r._onChange(o), Object.defineProperties(this, {
			position: {
				configurable: !0,
				enumerable: !0,
				value: t
			},
			rotation: {
				configurable: !0,
				enumerable: !0,
				value: n
			},
			quaternion: {
				configurable: !0,
				enumerable: !0,
				value: r
			},
			scale: {
				configurable: !0,
				enumerable: !0,
				value: i
			},
			modelViewMatrix: { value: new q() },
			normalMatrix: { value: new G() }
		}), this.matrix = new q(), this.matrixWorld = new q(), this.matrixAutoUpdate = e.DEFAULT_MATRIX_AUTO_UPDATE, this.matrixWorldAutoUpdate = e.DEFAULT_MATRIX_WORLD_AUTO_UPDATE, this.matrixWorldNeedsUpdate = !1, this.layers = new gt(), this.visible = !0, this.castShadow = !1, this.receiveShadow = !1, this.frustumCulled = !0, this.renderOrder = 0, this.animations = [], this.customDepthMaterial = void 0, this.customDistanceMaterial = void 0, this.static = !1, this.userData = {}, this.pivot = null;
	}
	onBeforeShadow() {}
	onAfterShadow() {}
	onBeforeRender() {}
	onAfterRender() {}
	applyMatrix4(e) {
		this.matrixAutoUpdate && this.updateMatrix(), this.matrix.premultiply(e), this.matrix.decompose(this.position, this.quaternion, this.scale);
	}
	applyQuaternion(e) {
		return this.quaternion.premultiply(e), this;
	}
	setRotationFromAxisAngle(e, t) {
		this.quaternion.setFromAxisAngle(e, t);
	}
	setRotationFromEuler(e) {
		this.quaternion.setFromEuler(e, !0);
	}
	setRotationFromMatrix(e) {
		this.quaternion.setFromRotationMatrix(e);
	}
	setRotationFromQuaternion(e) {
		this.quaternion.copy(e);
	}
	rotateOnAxis(e, t) {
		return yt.setFromAxisAngle(e, t), this.quaternion.multiply(yt), this;
	}
	rotateOnWorldAxis(e, t) {
		return yt.setFromAxisAngle(e, t), this.quaternion.premultiply(yt), this;
	}
	rotateX(e) {
		return this.rotateOnAxis(Tt, e);
	}
	rotateY(e) {
		return this.rotateOnAxis(Et, e);
	}
	rotateZ(e) {
		return this.rotateOnAxis(Dt, e);
	}
	translateOnAxis(e, t) {
		return vt.copy(e).applyQuaternion(this.quaternion), this.position.add(vt.multiplyScalar(t)), this;
	}
	translateX(e) {
		return this.translateOnAxis(Tt, e);
	}
	translateY(e) {
		return this.translateOnAxis(Et, e);
	}
	translateZ(e) {
		return this.translateOnAxis(Dt, e);
	}
	localToWorld(e) {
		return this.updateWorldMatrix(!0, !1), e.applyMatrix4(this.matrixWorld);
	}
	worldToLocal(e) {
		return this.updateWorldMatrix(!0, !1), e.applyMatrix4(bt.copy(this.matrixWorld).invert());
	}
	lookAt(e, t, n) {
		e.isVector3 ? xt.copy(e) : xt.set(e, t, n);
		let r = this.parent;
		this.updateWorldMatrix(!0, !1), St.setFromMatrixPosition(this.matrixWorld), this.isCamera || this.isLight ? bt.lookAt(St, xt, this.up) : bt.lookAt(xt, St, this.up), this.quaternion.setFromRotationMatrix(bt), r && (bt.extractRotation(r.matrixWorld), yt.setFromRotationMatrix(bt), this.quaternion.premultiply(yt.invert()));
	}
	add(e) {
		if (arguments.length > 1) {
			for (let e = 0; e < arguments.length; e++) this.add(arguments[e]);
			return this;
		}
		return e === this ? (L("Object3D.add: object can't be added as a child of itself.", e), this) : (e && e.isObject3D ? (e.removeFromParent(), e.parent = this, this.children.push(e), e.dispatchEvent(Ot), At.child = e, this.dispatchEvent(At), At.child = null) : L("Object3D.add: object not an instance of THREE.Object3D.", e), this);
	}
	remove(e) {
		if (arguments.length > 1) {
			for (let e = 0; e < arguments.length; e++) this.remove(arguments[e]);
			return this;
		}
		let t = this.children.indexOf(e);
		return t !== -1 && (e.parent = null, this.children.splice(t, 1), e.dispatchEvent(kt), jt.child = e, this.dispatchEvent(jt), jt.child = null), this;
	}
	removeFromParent() {
		let e = this.parent;
		return e !== null && e.remove(this), this;
	}
	clear() {
		return this.remove(...this.children);
	}
	attach(e) {
		return this.updateWorldMatrix(!0, !1), bt.copy(this.matrixWorld).invert(), e.parent !== null && (e.parent.updateWorldMatrix(!0, !1), bt.multiply(e.parent.matrixWorld)), e.applyMatrix4(bt), e.removeFromParent(), e.parent = this, this.children.push(e), e.updateWorldMatrix(!1, !0), e.dispatchEvent(Ot), At.child = e, this.dispatchEvent(At), At.child = null, this;
	}
	getObjectById(e) {
		return this.getObjectByProperty("id", e);
	}
	getObjectByName(e) {
		return this.getObjectByProperty("name", e);
	}
	getObjectByProperty(e, t) {
		if (this[e] === t) return this;
		for (let n = 0, r = this.children.length; n < r; n++) {
			let r = this.children[n].getObjectByProperty(e, t);
			if (r !== void 0) return r;
		}
	}
	getObjectsByProperty(e, t, n = []) {
		this[e] === t && n.push(this);
		let r = this.children;
		for (let i = 0, a = r.length; i < a; i++) r[i].getObjectsByProperty(e, t, n);
		return n;
	}
	getWorldPosition(e) {
		return this.updateWorldMatrix(!0, !1), e.setFromMatrixPosition(this.matrixWorld);
	}
	getWorldQuaternion(e) {
		return this.updateWorldMatrix(!0, !1), this.matrixWorld.decompose(St, e, Ct), e;
	}
	getWorldScale(e) {
		return this.updateWorldMatrix(!0, !1), this.matrixWorld.decompose(St, wt, e), e;
	}
	getWorldDirection(e) {
		this.updateWorldMatrix(!0, !1);
		let t = this.matrixWorld.elements;
		return e.set(t[8], t[9], t[10]).normalize();
	}
	raycast() {}
	intersectsFrustum() {}
	traverse(e) {
		e(this);
		let t = this.children;
		for (let n = 0, r = t.length; n < r; n++) t[n].traverse(e);
	}
	traverseVisible(e) {
		if (this.visible === !1) return;
		e(this);
		let t = this.children;
		for (let n = 0, r = t.length; n < r; n++) t[n].traverseVisible(e);
	}
	traverseAncestors(e) {
		let t = this.parent;
		t !== null && (e(t), t.traverseAncestors(e));
	}
	updateMatrix() {
		this.matrix.compose(this.position, this.quaternion, this.scale);
		let e = this.pivot;
		if (e !== null) {
			let t = e.x, n = e.y, r = e.z, i = this.matrix.elements;
			i[12] += t - i[0] * t - i[4] * n - i[8] * r, i[13] += n - i[1] * t - i[5] * n - i[9] * r, i[14] += r - i[2] * t - i[6] * n - i[10] * r;
		}
		this.matrixWorldNeedsUpdate = !0;
	}
	updateMatrixWorld(e) {
		this.matrixAutoUpdate && this.updateMatrix(), (this.matrixWorldNeedsUpdate || e) && (this.matrixWorldAutoUpdate === !0 && (this.parent === null ? this.matrixWorld.copy(this.matrix) : this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix)), this.matrixWorldNeedsUpdate = !1, e = !0);
		let t = this.children;
		for (let n = 0, r = t.length; n < r; n++) t[n].updateMatrixWorld(e);
	}
	updateWorldMatrix(e, t, n = !1) {
		let r = this.parent;
		if (e === !0 && r !== null && r.updateWorldMatrix(!0, !1), this.matrixAutoUpdate && this.updateMatrix(), (this.matrixWorldNeedsUpdate || n) && (this.matrixWorldAutoUpdate === !0 && (this.parent === null ? this.matrixWorld.copy(this.matrix) : this.matrixWorld.multiplyMatrices(this.parent.matrixWorld, this.matrix)), this.matrixWorldNeedsUpdate = !1, n = !0), t === !0) {
			let e = this.children;
			for (let t = 0, r = e.length; t < r; t++) e[t].updateWorldMatrix(!1, !0, n);
		}
	}
	toJSON(e) {
		let t = e === void 0 || typeof e == "string", n = {};
		t && (e = {
			geometries: {},
			materials: {},
			textures: {},
			images: {},
			shapes: {},
			skeletons: {},
			animations: {},
			nodes: {}
		}, n.metadata = {
			version: 4.7,
			type: "Object",
			generator: "Object3D.toJSON"
		});
		let r = {};
		r.uuid = this.uuid, r.type = this.type, r.name = this.name, r.castShadow = this.castShadow, r.receiveShadow = this.receiveShadow, r.visible = this.visible, r.frustumCulled = this.frustumCulled, r.renderOrder = this.renderOrder, r.static = this.static, r.matrixAutoUpdate = this.matrixAutoUpdate, Object.keys(this.userData).length > 0 && (r.userData = this.userData), r.layers = this.layers.mask, r.matrix = this.matrix.toArray(), r.up = this.up.toArray(), this.pivot !== null && (r.pivot = this.pivot.toArray()), this.morphTargetDictionary !== void 0 && (r.morphTargetDictionary = Object.assign({}, this.morphTargetDictionary)), this.morphTargetInfluences !== void 0 && (r.morphTargetInfluences = this.morphTargetInfluences.slice()), this.isInstancedMesh && (r.type = "InstancedMesh", r.count = this.count, r.instanceMatrix = this.instanceMatrix.toJSON(), this.instanceColor !== null && (r.instanceColor = this.instanceColor.toJSON())), this.isBatchedMesh && (r.type = "BatchedMesh", r.perObjectFrustumCulled = this.perObjectFrustumCulled, r.sortObjects = this.sortObjects, r.drawRanges = this._drawRanges, r.reservedRanges = this._reservedRanges, r.geometryInfo = this._geometryInfo.map((e) => ({
			...e,
			boundingBox: e.boundingBox ? e.boundingBox.toJSON() : void 0,
			boundingSphere: e.boundingSphere ? e.boundingSphere.toJSON() : void 0
		})), r.instanceInfo = this._instanceInfo.map((e) => ({ ...e })), r.availableInstanceIds = this._availableInstanceIds.slice(), r.availableGeometryIds = this._availableGeometryIds.slice(), r.nextIndexStart = this._nextIndexStart, r.nextVertexStart = this._nextVertexStart, r.geometryCount = this._geometryCount, r.maxInstanceCount = this._maxInstanceCount, r.maxVertexCount = this._maxVertexCount, r.maxIndexCount = this._maxIndexCount, r.geometryInitialized = this._geometryInitialized, r.matricesTexture = this._matricesTexture.toJSON(e), r.indirectTexture = this._indirectTexture.toJSON(e), this._colorsTexture !== null && (r.colorsTexture = this._colorsTexture.toJSON(e)), this.boundingSphere !== null && (r.boundingSphere = this.boundingSphere.toJSON()), this.boundingBox !== null && (r.boundingBox = this.boundingBox.toJSON()));
		function i(t, n) {
			return t[n.uuid] === void 0 && (t[n.uuid] = n.toJSON(e)), n.uuid;
		}
		if (this.isScene) this.background && (this.background.isColor ? r.background = this.background.toJSON() : this.background.isTexture && (r.background = this.background.toJSON(e).uuid)), this.environment && this.environment.isTexture && this.environment.isRenderTargetTexture !== !0 && (r.environment = this.environment.toJSON(e).uuid);
		else if (this.isMesh || this.isLine || this.isPoints) {
			r.geometry = i(e.geometries, this.geometry);
			let t = this.geometry.parameters;
			if (t !== void 0 && t.shapes !== void 0) {
				let n = t.shapes;
				if (Array.isArray(n)) for (let t = 0, r = n.length; t < r; t++) {
					let r = n[t];
					i(e.shapes, r);
				}
				else i(e.shapes, n);
			}
		}
		if (this.isSkinnedMesh && (r.bindMode = this.bindMode, r.bindMatrix = this.bindMatrix.toArray(), this.skeleton !== void 0 && (i(e.skeletons, this.skeleton), r.skeleton = this.skeleton.uuid)), this.material !== void 0) {
			if (Array.isArray(this.material)) {
				let t = [];
				for (let n = 0, r = this.material.length; n < r; n++) t.push(i(e.materials, this.material[n]));
				r.material = t;
			} else r.material = i(e.materials, this.material);
		}
		if (this.children.length > 0) {
			r.children = [];
			for (let t = 0; t < this.children.length; t++) r.children.push(this.children[t].toJSON(e).object);
		}
		if (this.animations.length > 0) {
			r.animations = [];
			for (let t = 0; t < this.animations.length; t++) {
				let n = this.animations[t];
				r.animations.push(i(e.animations, n));
			}
		}
		if (t) {
			let t = a(e.geometries), r = a(e.materials), i = a(e.textures), o = a(e.images), s = a(e.shapes), c = a(e.skeletons), l = a(e.animations), u = a(e.nodes);
			t.length > 0 && (n.geometries = t), r.length > 0 && (n.materials = r), i.length > 0 && (n.textures = i), o.length > 0 && (n.images = o), s.length > 0 && (n.shapes = s), c.length > 0 && (n.skeletons = c), l.length > 0 && (n.animations = l), u.length > 0 && (n.nodes = u);
		}
		return n.object = r, n;
		function a(e) {
			let t = [];
			for (let n in e) {
				let r = e[n];
				delete r.metadata, t.push(r);
			}
			return t;
		}
	}
	clone(e) {
		return new this.constructor().copy(this, e);
	}
	copy(e, t = !0) {
		if (this.name = e.name, this.up.copy(e.up), this.position.copy(e.position), this.rotation.order = e.rotation.order, this.quaternion.copy(e.quaternion), this.scale.copy(e.scale), this.pivot = e.pivot === null ? null : e.pivot.clone(), this.matrix.copy(e.matrix), this.matrixWorld.copy(e.matrixWorld), this.matrixAutoUpdate = e.matrixAutoUpdate, this.matrixWorldAutoUpdate = e.matrixWorldAutoUpdate, this.matrixWorldNeedsUpdate = e.matrixWorldNeedsUpdate, this.layers.mask = e.layers.mask, this.visible = e.visible, this.castShadow = e.castShadow, this.receiveShadow = e.receiveShadow, this.frustumCulled = e.frustumCulled, this.renderOrder = e.renderOrder, this.static = e.static, this.animations = e.animations.slice(), this.userData = JSON.parse(JSON.stringify(e.userData)), t === !0) for (let t = 0; t < e.children.length; t++) {
			let n = e.children[t];
			this.add(n.clone());
		}
		return this;
	}
	dispose() {
		this.dispatchEvent({ type: "dispose" });
	}
};
Mt.DEFAULT_UP = /*@__PURE__*/ new W(0, 1, 0), Mt.DEFAULT_MATRIX_AUTO_UPDATE = !0, Mt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE = !0;
var Nt = class extends Mt {
	constructor() {
		super(), this.isGroup = !0, this.type = "Group";
	}
}, Pt = { type: "move" }, Ft = class {
	constructor() {
		this._targetRay = null, this._grip = null, this._hand = null;
	}
	getHandSpace() {
		return this._hand === null && (this._hand = new Nt(), this._hand.matrixAutoUpdate = !1, this._hand.visible = !1, this._hand.joints = {}, this._hand.inputState = { pinching: !1 }), this._hand;
	}
	getTargetRaySpace() {
		return this._targetRay === null && (this._targetRay = new Nt(), this._targetRay.matrixAutoUpdate = !1, this._targetRay.visible = !1, this._targetRay.hasLinearVelocity = !1, this._targetRay.linearVelocity = new W(), this._targetRay.hasAngularVelocity = !1, this._targetRay.angularVelocity = new W()), this._targetRay;
	}
	getGripSpace() {
		return this._grip === null && (this._grip = new Nt(), this._grip.matrixAutoUpdate = !1, this._grip.visible = !1, this._grip.hasLinearVelocity = !1, this._grip.linearVelocity = new W(), this._grip.hasAngularVelocity = !1, this._grip.angularVelocity = new W(), this._grip.eventsEnabled = !1), this._grip;
	}
	dispatchEvent(e) {
		return this._targetRay !== null && this._targetRay.dispatchEvent(e), this._grip !== null && this._grip.dispatchEvent(e), this._hand !== null && this._hand.dispatchEvent(e), this;
	}
	connect(e) {
		if (e && e.hand) {
			let t = this._hand;
			if (t) for (let n of e.hand.values()) this._getHandJoint(t, n);
		}
		return this.dispatchEvent({
			type: "connected",
			data: e
		}), this;
	}
	disconnect(e) {
		return this.dispatchEvent({
			type: "disconnected",
			data: e
		}), this._targetRay !== null && (this._targetRay.visible = !1), this._grip !== null && (this._grip.visible = !1), this._hand !== null && (this._hand.visible = !1), this;
	}
	update(e, t, n) {
		let r = null, i = null, a = null, o = this._targetRay, s = this._grip, c = this._hand;
		if (e && t.session.visibilityState !== "visible-blurred") {
			if (c && e.hand) {
				a = !0;
				for (let r of e.hand.values()) {
					let e = t.getJointPose(r, n), i = this._getHandJoint(c, r);
					e !== null && (i.matrix.fromArray(e.transform.matrix), i.matrix.decompose(i.position, i.rotation, i.scale), i.matrixWorldNeedsUpdate = !0, i.jointRadius = e.radius), i.visible = e !== null;
				}
				let r = c.joints["index-finger-tip"], i = c.joints["thumb-tip"], o = r.position.distanceTo(i.position);
				c.inputState.pinching && o > .025 ? (c.inputState.pinching = !1, this.dispatchEvent({
					type: "pinchend",
					handedness: e.handedness,
					target: this
				})) : !c.inputState.pinching && o <= .015 && (c.inputState.pinching = !0, this.dispatchEvent({
					type: "pinchstart",
					handedness: e.handedness,
					target: this
				}));
			} else s !== null && e.gripSpace && (i = t.getPose(e.gripSpace, n), i !== null && (s.matrix.fromArray(i.transform.matrix), s.matrix.decompose(s.position, s.rotation, s.scale), s.matrixWorldNeedsUpdate = !0, i.linearVelocity ? (s.hasLinearVelocity = !0, s.linearVelocity.copy(i.linearVelocity)) : s.hasLinearVelocity = !1, i.angularVelocity ? (s.hasAngularVelocity = !0, s.angularVelocity.copy(i.angularVelocity)) : s.hasAngularVelocity = !1, s.eventsEnabled && s.dispatchEvent({
				type: "gripUpdated",
				data: e,
				target: this
			})));
			o !== null && (r = t.getPose(e.targetRaySpace, n), r === null && i !== null && (r = i), r !== null && (o.matrix.fromArray(r.transform.matrix), o.matrix.decompose(o.position, o.rotation, o.scale), o.matrixWorldNeedsUpdate = !0, r.linearVelocity ? (o.hasLinearVelocity = !0, o.linearVelocity.copy(r.linearVelocity)) : o.hasLinearVelocity = !1, r.angularVelocity ? (o.hasAngularVelocity = !0, o.angularVelocity.copy(r.angularVelocity)) : o.hasAngularVelocity = !1, this.dispatchEvent(Pt)));
		}
		return o !== null && (o.visible = r !== null), s !== null && (s.visible = i !== null), c !== null && (c.visible = a !== null), this;
	}
	_getHandJoint(e, t) {
		if (e.joints[t.jointName] === void 0) {
			let n = new Nt();
			n.matrixAutoUpdate = !1, n.visible = !1, e.joints[t.jointName] = n, e.add(n);
		}
		return e.joints[t.jointName];
	}
}, It = {
	aliceblue: 15792383,
	antiquewhite: 16444375,
	aqua: 65535,
	aquamarine: 8388564,
	azure: 15794175,
	beige: 16119260,
	bisque: 16770244,
	black: 0,
	blanchedalmond: 16772045,
	blue: 255,
	blueviolet: 9055202,
	brown: 10824234,
	burlywood: 14596231,
	cadetblue: 6266528,
	chartreuse: 8388352,
	chocolate: 13789470,
	coral: 16744272,
	cornflowerblue: 6591981,
	cornsilk: 16775388,
	crimson: 14423100,
	cyan: 65535,
	darkblue: 139,
	darkcyan: 35723,
	darkgoldenrod: 12092939,
	darkgray: 11119017,
	darkgreen: 25600,
	darkgrey: 11119017,
	darkkhaki: 12433259,
	darkmagenta: 9109643,
	darkolivegreen: 5597999,
	darkorange: 16747520,
	darkorchid: 10040012,
	darkred: 9109504,
	darksalmon: 15308410,
	darkseagreen: 9419919,
	darkslateblue: 4734347,
	darkslategray: 3100495,
	darkslategrey: 3100495,
	darkturquoise: 52945,
	darkviolet: 9699539,
	deeppink: 16716947,
	deepskyblue: 49151,
	dimgray: 6908265,
	dimgrey: 6908265,
	dodgerblue: 2003199,
	firebrick: 11674146,
	floralwhite: 16775920,
	forestgreen: 2263842,
	fuchsia: 16711935,
	gainsboro: 14474460,
	ghostwhite: 16316671,
	gold: 16766720,
	goldenrod: 14329120,
	gray: 8421504,
	green: 32768,
	greenyellow: 11403055,
	grey: 8421504,
	honeydew: 15794160,
	hotpink: 16738740,
	indianred: 13458524,
	indigo: 4915330,
	ivory: 16777200,
	khaki: 15787660,
	lavender: 15132410,
	lavenderblush: 16773365,
	lawngreen: 8190976,
	lemonchiffon: 16775885,
	lightblue: 11393254,
	lightcoral: 15761536,
	lightcyan: 14745599,
	lightgoldenrodyellow: 16448210,
	lightgray: 13882323,
	lightgreen: 9498256,
	lightgrey: 13882323,
	lightpink: 16758465,
	lightsalmon: 16752762,
	lightseagreen: 2142890,
	lightskyblue: 8900346,
	lightslategray: 7833753,
	lightslategrey: 7833753,
	lightsteelblue: 11584734,
	lightyellow: 16777184,
	lime: 65280,
	limegreen: 3329330,
	linen: 16445670,
	magenta: 16711935,
	maroon: 8388608,
	mediumaquamarine: 6737322,
	mediumblue: 205,
	mediumorchid: 12211667,
	mediumpurple: 9662683,
	mediumseagreen: 3978097,
	mediumslateblue: 8087790,
	mediumspringgreen: 64154,
	mediumturquoise: 4772300,
	mediumvioletred: 13047173,
	midnightblue: 1644912,
	mintcream: 16121850,
	mistyrose: 16770273,
	moccasin: 16770229,
	navajowhite: 16768685,
	navy: 128,
	oldlace: 16643558,
	olive: 8421376,
	olivedrab: 7048739,
	orange: 16753920,
	orangered: 16729344,
	orchid: 14315734,
	palegoldenrod: 15657130,
	palegreen: 10025880,
	paleturquoise: 11529966,
	palevioletred: 14381203,
	papayawhip: 16773077,
	peachpuff: 16767673,
	peru: 13468991,
	pink: 16761035,
	plum: 14524637,
	powderblue: 11591910,
	purple: 8388736,
	rebeccapurple: 6697881,
	red: 16711680,
	rosybrown: 12357519,
	royalblue: 4286945,
	saddlebrown: 9127187,
	salmon: 16416882,
	sandybrown: 16032864,
	seagreen: 3050327,
	seashell: 16774638,
	sienna: 10506797,
	silver: 12632256,
	skyblue: 8900331,
	slateblue: 6970061,
	slategray: 7372944,
	slategrey: 7372944,
	snow: 16775930,
	springgreen: 65407,
	steelblue: 4620980,
	tan: 13808780,
	teal: 32896,
	thistle: 14204888,
	tomato: 16737095,
	turquoise: 4251856,
	violet: 15631086,
	wheat: 16113331,
	white: 16777215,
	whitesmoke: 16119285,
	yellow: 16776960,
	yellowgreen: 10145074
}, Lt = {
	h: 0,
	s: 0,
	l: 0
}, Rt = {
	h: 0,
	s: 0,
	l: 0
};
function zt(e, t, n) {
	return n < 0 && (n += 1), n > 1 && --n, n < 1 / 6 ? e + (t - e) * 6 * n : n < 1 / 2 ? t : n < 2 / 3 ? e + (t - e) * 6 * (2 / 3 - n) : e;
}
var J = class {
	constructor(e, t, n) {
		return this.isColor = !0, this.r = 1, this.g = 1, this.b = 1, this.set(e, t, n);
	}
	set(e, t, n) {
		if (t === void 0 && n === void 0) {
			let t = e;
			t && t.isColor ? this.copy(t) : typeof t == "number" ? this.setHex(t) : typeof t == "string" && this.setStyle(t);
		} else this.setRGB(e, t, n);
		return this;
	}
	setScalar(e) {
		return this.r = e, this.g = e, this.b = e, this;
	}
	setHex(e, t = M) {
		return e = Math.floor(e), this.r = (e >> 16 & 255) / 255, this.g = (e >> 8 & 255) / 255, this.b = (e & 255) / 255, K.colorSpaceToWorking(this, t), this;
	}
	setRGB(e, t, n, r = K.workingColorSpace) {
		return this.r = e, this.g = t, this.b = n, K.colorSpaceToWorking(this, r), this;
	}
	setHSL(e, t, n, r = K.workingColorSpace) {
		if (e = xe(e, 1), t = R(t, 0, 1), n = R(n, 0, 1), t === 0) this.r = this.g = this.b = n;
		else {
			let r = n <= .5 ? n * (1 + t) : n + t - n * t, i = 2 * n - r;
			this.r = zt(i, r, e + 1 / 3), this.g = zt(i, r, e), this.b = zt(i, r, e - 1 / 3);
		}
		return K.colorSpaceToWorking(this, r), this;
	}
	setStyle(e, t = M) {
		function n(t) {
			t !== void 0 && parseFloat(t) < 1 && I("Color: Alpha component of " + e + " will be ignored.");
		}
		let r;
		if (r = /^(\w+)\(([^\)]*)\)/.exec(e)) {
			let i, a = r[1], o = r[2];
			switch (a) {
				case "rgb":
				case "rgba":
					if (i = /^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o)) return n(i[4]), this.setRGB(Math.min(255, parseInt(i[1], 10)) / 255, Math.min(255, parseInt(i[2], 10)) / 255, Math.min(255, parseInt(i[3], 10)) / 255, t);
					if (i = /^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o)) return n(i[4]), this.setRGB(Math.min(100, parseInt(i[1], 10)) / 100, Math.min(100, parseInt(i[2], 10)) / 100, Math.min(100, parseInt(i[3], 10)) / 100, t);
					break;
				case "hsl":
				case "hsla":
					if (i = /^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o)) return n(i[4]), this.setHSL(parseFloat(i[1]) / 360, parseFloat(i[2]) / 100, parseFloat(i[3]) / 100, t);
					break;
				default: I("Color: Unknown color model " + e);
			}
		} else if (r = /^\#([A-Fa-f\d]+)$/.exec(e)) {
			let n = r[1], i = n.length;
			if (i === 3) return this.setRGB(parseInt(n.charAt(0), 16) / 15, parseInt(n.charAt(1), 16) / 15, parseInt(n.charAt(2), 16) / 15, t);
			if (i === 6) return this.setHex(parseInt(n, 16), t);
			I("Color: Invalid hex color " + e);
		} else if (e && e.length > 0) return this.setColorName(e, t);
		return this;
	}
	setColorName(e, t = M) {
		let n = It[e.toLowerCase()];
		return n === void 0 ? I("Color: Unknown color " + e) : this.setHex(n, t), this;
	}
	clone() {
		return new this.constructor(this.r, this.g, this.b);
	}
	copy(e) {
		return this.r = e.r, this.g = e.g, this.b = e.b, this;
	}
	copySRGBToLinear(e) {
		return this.r = Ge(e.r), this.g = Ge(e.g), this.b = Ge(e.b), this;
	}
	copyLinearToSRGB(e) {
		return this.r = Ke(e.r), this.g = Ke(e.g), this.b = Ke(e.b), this;
	}
	convertSRGBToLinear() {
		return this.copySRGBToLinear(this), this;
	}
	convertLinearToSRGB() {
		return this.copyLinearToSRGB(this), this;
	}
	getHex(e = M) {
		return K.workingToColorSpace(Bt.copy(this), e), Math.round(R(Bt.r * 255, 0, 255)) * 65536 + Math.round(R(Bt.g * 255, 0, 255)) * 256 + Math.round(R(Bt.b * 255, 0, 255));
	}
	getHexString(e = M) {
		return ("000000" + this.getHex(e).toString(16)).slice(-6);
	}
	getHSL(e, t = K.workingColorSpace) {
		K.workingToColorSpace(Bt.copy(this), t);
		let n = Bt.r, r = Bt.g, i = Bt.b, a = Math.max(n, r, i), o = Math.min(n, r, i), s, c, l = (o + a) / 2;
		if (o === a) s = 0, c = 0;
		else {
			let e = a - o;
			switch (c = l <= .5 ? e / (a + o) : e / (2 - a - o), a) {
				case n:
					s = (r - i) / e + (r < i ? 6 : 0);
					break;
				case r:
					s = (i - n) / e + 2;
					break;
				case i: s = (n - r) / e + 4;
			}
			s /= 6;
		}
		return e.h = s, e.s = c, e.l = l, e;
	}
	getRGB(e, t = K.workingColorSpace) {
		return K.workingToColorSpace(Bt.copy(this), t), e.r = Bt.r, e.g = Bt.g, e.b = Bt.b, e;
	}
	getStyle(e = M) {
		K.workingToColorSpace(Bt.copy(this), e);
		let t = Bt.r, n = Bt.g, r = Bt.b;
		return e === "srgb" ? `rgb(${Math.round(t * 255)},${Math.round(n * 255)},${Math.round(r * 255)})` : `color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`;
	}
	offsetHSL(e, t, n) {
		return this.getHSL(Lt), this.setHSL(Lt.h + e, Lt.s + t, Lt.l + n);
	}
	add(e) {
		return this.r += e.r, this.g += e.g, this.b += e.b, this;
	}
	addColors(e, t) {
		return this.r = e.r + t.r, this.g = e.g + t.g, this.b = e.b + t.b, this;
	}
	addScalar(e) {
		return this.r += e, this.g += e, this.b += e, this;
	}
	sub(e) {
		return this.r = Math.max(0, this.r - e.r), this.g = Math.max(0, this.g - e.g), this.b = Math.max(0, this.b - e.b), this;
	}
	multiply(e) {
		return this.r *= e.r, this.g *= e.g, this.b *= e.b, this;
	}
	multiplyScalar(e) {
		return this.r *= e, this.g *= e, this.b *= e, this;
	}
	lerp(e, t) {
		return this.r += (e.r - this.r) * t, this.g += (e.g - this.g) * t, this.b += (e.b - this.b) * t, this;
	}
	lerpColors(e, t, n) {
		return this.r = e.r + (t.r - e.r) * n, this.g = e.g + (t.g - e.g) * n, this.b = e.b + (t.b - e.b) * n, this;
	}
	lerpHSL(e, t) {
		this.getHSL(Lt), e.getHSL(Rt);
		let n = we(Lt.h, Rt.h, t), r = we(Lt.s, Rt.s, t), i = we(Lt.l, Rt.l, t);
		return this.setHSL(n, r, i), this;
	}
	setFromVector3(e) {
		return this.r = e.x, this.g = e.y, this.b = e.z, this;
	}
	applyMatrix3(e) {
		let t = this.r, n = this.g, r = this.b, i = e.elements;
		return this.r = i[0] * t + i[3] * n + i[6] * r, this.g = i[1] * t + i[4] * n + i[7] * r, this.b = i[2] * t + i[5] * n + i[8] * r, this;
	}
	equals(e) {
		return e.r === this.r && e.g === this.g && e.b === this.b;
	}
	fromArray(e, t = 0) {
		return this.r = e[t], this.g = e[t + 1], this.b = e[t + 2], this;
	}
	toArray(e = [], t = 0) {
		return e[t] = this.r, e[t + 1] = this.g, e[t + 2] = this.b, e;
	}
	fromBufferAttribute(e, t) {
		return this.r = e.getX(t), this.g = e.getY(t), this.b = e.getZ(t), this;
	}
	toJSON() {
		return this.getHex();
	}
	*[Symbol.iterator]() {
		yield this.r, yield this.g, yield this.b;
	}
}, Bt = /*@__PURE__*/ new J();
J.NAMES = It;
var Vt = class e {
	constructor(e, t = 1, n = 1e3) {
		this.isFog = !0, this.name = "", this.color = new J(e), this.near = t, this.far = n;
	}
	clone() {
		return new e(this.color, this.near, this.far);
	}
	toJSON() {
		return {
			type: "Fog",
			name: this.name,
			color: this.color.getHex(),
			near: this.near,
			far: this.far
		};
	}
}, Ht = class extends Mt {
	constructor() {
		super(), this.isScene = !0, this.type = "Scene", this.background = null, this.environment = null, this.fog = null, this.backgroundBlurriness = 0, this.backgroundIntensity = 1, this.backgroundRotation = new ht(), this.environmentIntensity = 1, this.environmentRotation = new ht(), this.overrideMaterial = null, typeof __THREE_DEVTOOLS__ < "u" && __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe", { detail: this }));
	}
	copy(e, t) {
		return super.copy(e, t), e.background !== null && (this.background = e.background.clone()), e.environment !== null && (this.environment = e.environment.clone()), e.fog !== null && (this.fog = e.fog.clone()), this.backgroundBlurriness = e.backgroundBlurriness, this.backgroundIntensity = e.backgroundIntensity, this.backgroundRotation.copy(e.backgroundRotation), this.environmentIntensity = e.environmentIntensity, this.environmentRotation.copy(e.environmentRotation), e.overrideMaterial !== null && (this.overrideMaterial = e.overrideMaterial.clone()), this.matrixAutoUpdate = e.matrixAutoUpdate, this;
	}
	toJSON(e) {
		let t = super.toJSON(e);
		return this.fog !== null && (t.object.fog = this.fog.toJSON()), t.object.backgroundBlurriness = this.backgroundBlurriness, t.object.backgroundIntensity = this.backgroundIntensity, t.object.backgroundRotation = this.backgroundRotation.toArray(), t.object.environmentIntensity = this.environmentIntensity, t.object.environmentRotation = this.environmentRotation.toArray(), t;
	}
}, Ut = /*@__PURE__*/ new W(), Wt = /*@__PURE__*/ new W(), Gt = /*@__PURE__*/ new W(), Kt = /*@__PURE__*/ new W(), qt = /*@__PURE__*/ new W(), Jt = /*@__PURE__*/ new W(), Yt = /*@__PURE__*/ new W(), Xt = /*@__PURE__*/ new W(), Zt = /*@__PURE__*/ new W(), Qt = /*@__PURE__*/ new W(), $t = /*@__PURE__*/ new tt(), en = /*@__PURE__*/ new tt(), tn = /*@__PURE__*/ new tt(), nn = class e {
	constructor(e = new W(), t = new W(), n = new W()) {
		this.a = e, this.b = t, this.c = n;
	}
	static getNormal(e, t, n, r) {
		r.subVectors(n, t), Ut.subVectors(e, t), r.cross(Ut);
		let i = r.lengthSq();
		return i > 0 ? r.multiplyScalar(1 / Math.sqrt(i)) : r.set(0, 0, 0);
	}
	static getBarycoord(e, t, n, r, i) {
		Ut.subVectors(r, t), Wt.subVectors(n, t), Gt.subVectors(e, t);
		let a = Ut.dot(Ut), o = Ut.dot(Wt), s = Ut.dot(Gt), c = Wt.dot(Wt), l = Wt.dot(Gt), u = a * c - o * o;
		if (u === 0) return i.set(0, 0, 0), null;
		let d = 1 / u, f = (c * s - o * l) * d, p = (a * l - o * s) * d;
		return i.set(1 - f - p, p, f);
	}
	static containsPoint(e, t, n, r) {
		return this.getBarycoord(e, t, n, r, Kt) !== null && Kt.x >= 0 && Kt.y >= 0 && Kt.x + Kt.y <= 1;
	}
	static getInterpolation(e, t, n, r, i, a, o, s) {
		return this.getBarycoord(e, t, n, r, Kt) === null ? (s.x = 0, s.y = 0, "z" in s && (s.z = 0), "w" in s && (s.w = 0), null) : (s.setScalar(0), s.addScaledVector(i, Kt.x), s.addScaledVector(a, Kt.y), s.addScaledVector(o, Kt.z), s);
	}
	static getInterpolatedAttribute(e, t, n, r, i, a) {
		return $t.setScalar(0), en.setScalar(0), tn.setScalar(0), $t.fromBufferAttribute(e, t), en.fromBufferAttribute(e, n), tn.fromBufferAttribute(e, r), a.setScalar(0), a.addScaledVector($t, i.x), a.addScaledVector(en, i.y), a.addScaledVector(tn, i.z), a;
	}
	static isFrontFacing(e, t, n, r) {
		return Ut.subVectors(n, t), Wt.subVectors(e, t), Ut.cross(Wt).dot(r) < 0;
	}
	set(e, t, n) {
		return this.a.copy(e), this.b.copy(t), this.c.copy(n), this;
	}
	setFromPointsAndIndices(e, t, n, r) {
		return this.a.copy(e[t]), this.b.copy(e[n]), this.c.copy(e[r]), this;
	}
	setFromAttributeAndIndices(e, t, n, r) {
		return this.a.fromBufferAttribute(e, t), this.b.fromBufferAttribute(e, n), this.c.fromBufferAttribute(e, r), this;
	}
	clone() {
		return new this.constructor().copy(this);
	}
	copy(e) {
		return this.a.copy(e.a), this.b.copy(e.b), this.c.copy(e.c), this;
	}
	getArea() {
		return Ut.subVectors(this.c, this.b), Wt.subVectors(this.a, this.b), Ut.cross(Wt).length() * .5;
	}
	getMidpoint(e) {
		return e.addVectors(this.a, this.b).add(this.c).multiplyScalar(1 / 3);
	}
	getNormal(t) {
		return e.getNormal(this.a, this.b, this.c, t);
	}
	getPlane(e) {
		return e.setFromCoplanarPoints(this.a, this.b, this.c);
	}
	getBarycoord(t, n) {
		return e.getBarycoord(t, this.a, this.b, this.c, n);
	}
	getInterpolation(t, n, r, i, a) {
		return e.getInterpolation(t, this.a, this.b, this.c, n, r, i, a);
	}
	containsPoint(t) {
		return e.containsPoint(t, this.a, this.b, this.c);
	}
	isFrontFacing(t) {
		return e.isFrontFacing(this.a, this.b, this.c, t);
	}
	intersectsBox(e) {
		return e.intersectsTriangle(this);
	}
	closestPointToPoint(e, t) {
		let n = this.a, r = this.b, i = this.c, a, o;
		qt.subVectors(r, n), Jt.subVectors(i, n), Xt.subVectors(e, n);
		let s = qt.dot(Xt), c = Jt.dot(Xt);
		if (s <= 0 && c <= 0) return t.copy(n);
		Zt.subVectors(e, r);
		let l = qt.dot(Zt), u = Jt.dot(Zt);
		if (l >= 0 && u <= l) return t.copy(r);
		let d = s * u - l * c;
		if (d <= 0 && s >= 0 && l <= 0) return a = s / (s - l), t.copy(n).addScaledVector(qt, a);
		Qt.subVectors(e, i);
		let f = qt.dot(Qt), p = Jt.dot(Qt);
		if (p >= 0 && f <= p) return t.copy(i);
		let m = f * c - s * p;
		if (m <= 0 && c >= 0 && p <= 0) return o = c / (c - p), t.copy(n).addScaledVector(Jt, o);
		let h = l * p - f * u;
		if (h <= 0 && u - l >= 0 && f - p >= 0) return Yt.subVectors(i, r), o = (u - l) / (u - l + (f - p)), t.copy(r).addScaledVector(Yt, o);
		let g = 1 / (h + m + d);
		return a = m * g, o = d * g, t.copy(n).addScaledVector(qt, a).addScaledVector(Jt, o);
	}
	equals(e) {
		return e.a.equals(this.a) && e.b.equals(this.b) && e.c.equals(this.c);
	}
}, rn = class {
	constructor(e = new W(Infinity, Infinity, Infinity), t = new W(-Infinity, -Infinity, -Infinity)) {
		this.isBox3 = !0, this.min = e, this.max = t;
	}
	set(e, t) {
		return this.min.copy(e), this.max.copy(t), this;
	}
	setFromArray(e) {
		this.makeEmpty();
		for (let t = 0, n = e.length; t < n; t += 3) this.expandByPoint(on.fromArray(e, t));
		return this;
	}
	setFromBufferAttribute(e) {
		this.makeEmpty();
		for (let t = 0, n = e.count; t < n; t++) this.expandByPoint(on.fromBufferAttribute(e, t));
		return this;
	}
	setFromPoints(e) {
		this.makeEmpty();
		for (let t = 0, n = e.length; t < n; t++) this.expandByPoint(e[t]);
		return this;
	}
	setFromCenterAndSize(e, t) {
		let n = on.copy(t).multiplyScalar(.5);
		return this.min.copy(e).sub(n), this.max.copy(e).add(n), this;
	}
	setFromObject(e, t = !1) {
		return this.makeEmpty(), this.expandByObject(e, t);
	}
	clone() {
		return new this.constructor().copy(this);
	}
	copy(e) {
		return this.min.copy(e.min), this.max.copy(e.max), this;
	}
	makeEmpty() {
		return this.min.x = this.min.y = this.min.z = Infinity, this.max.x = this.max.y = this.max.z = -Infinity, this;
	}
	isEmpty() {
		return this.max.x < this.min.x || this.max.y < this.min.y || this.max.z < this.min.z;
	}
	getCenter(e) {
		return this.isEmpty() ? e.set(0, 0, 0) : e.addVectors(this.min, this.max).multiplyScalar(.5);
	}
	getSize(e) {
		return this.isEmpty() ? e.set(0, 0, 0) : e.subVectors(this.max, this.min);
	}
	expandByPoint(e) {
		return this.min.min(e), this.max.max(e), this;
	}
	expandByVector(e) {
		return this.min.sub(e), this.max.add(e), this;
	}
	expandByScalar(e) {
		return this.min.addScalar(-e), this.max.addScalar(e), this;
	}
	expandByObject(e, t = !1) {
		e.updateWorldMatrix(!1, !1);
		let n = e.geometry;
		if (n !== void 0) {
			let r = n.getAttribute("position");
			if (t === !0 && r !== void 0 && e.isInstancedMesh !== !0) for (let t = 0, n = r.count; t < n; t++) e.isMesh === !0 ? e.getVertexPosition(t, on) : on.fromBufferAttribute(r, t), on.applyMatrix4(e.matrixWorld), this.expandByPoint(on);
			else e.boundingBox === void 0 ? (n.boundingBox === null && n.computeBoundingBox(), sn.copy(n.boundingBox)) : (e.boundingBox === null && e.computeBoundingBox(), sn.copy(e.boundingBox)), sn.applyMatrix4(e.matrixWorld), this.union(sn);
		}
		let r = e.children;
		for (let e = 0, n = r.length; e < n; e++) this.expandByObject(r[e], t);
		return this;
	}
	containsPoint(e) {
		return e.x >= this.min.x && e.x <= this.max.x && e.y >= this.min.y && e.y <= this.max.y && e.z >= this.min.z && e.z <= this.max.z;
	}
	containsBox(e) {
		return this.min.x <= e.min.x && e.max.x <= this.max.x && this.min.y <= e.min.y && e.max.y <= this.max.y && this.min.z <= e.min.z && e.max.z <= this.max.z;
	}
	getParameter(e, t) {
		return t.set((e.x - this.min.x) / (this.max.x - this.min.x), (e.y - this.min.y) / (this.max.y - this.min.y), (e.z - this.min.z) / (this.max.z - this.min.z));
	}
	intersectsBox(e) {
		return e.max.x >= this.min.x && e.min.x <= this.max.x && e.max.y >= this.min.y && e.min.y <= this.max.y && e.max.z >= this.min.z && e.min.z <= this.max.z;
	}
	intersectsSphere(e) {
		return this.clampPoint(e.center, on), on.distanceToSquared(e.center) <= e.radius * e.radius;
	}
	intersectsPlane(e) {
		let t, n;
		return e.normal.x > 0 ? (t = e.normal.x * this.min.x, n = e.normal.x * this.max.x) : (t = e.normal.x * this.max.x, n = e.normal.x * this.min.x), e.normal.y > 0 ? (t += e.normal.y * this.min.y, n += e.normal.y * this.max.y) : (t += e.normal.y * this.max.y, n += e.normal.y * this.min.y), e.normal.z > 0 ? (t += e.normal.z * this.min.z, n += e.normal.z * this.max.z) : (t += e.normal.z * this.max.z, n += e.normal.z * this.min.z), t <= -e.constant && n >= -e.constant;
	}
	intersectsTriangle(e) {
		if (this.isEmpty()) return !1;
		this.getCenter(mn), hn.subVectors(this.max, mn), cn.subVectors(e.a, mn), ln.subVectors(e.b, mn), un.subVectors(e.c, mn), dn.subVectors(ln, cn), fn.subVectors(un, ln), pn.subVectors(cn, un);
		let t = [
			0,
			-dn.z,
			dn.y,
			0,
			-fn.z,
			fn.y,
			0,
			-pn.z,
			pn.y,
			dn.z,
			0,
			-dn.x,
			fn.z,
			0,
			-fn.x,
			pn.z,
			0,
			-pn.x,
			-dn.y,
			dn.x,
			0,
			-fn.y,
			fn.x,
			0,
			-pn.y,
			pn.x,
			0
		];
		return !vn(t, cn, ln, un, hn) || (t = [
			1,
			0,
			0,
			0,
			1,
			0,
			0,
			0,
			1
		], !vn(t, cn, ln, un, hn)) ? !1 : (gn.crossVectors(dn, fn), t = [
			gn.x,
			gn.y,
			gn.z
		], vn(t, cn, ln, un, hn));
	}
	clampPoint(e, t) {
		return t.copy(e).clamp(this.min, this.max);
	}
	distanceToPoint(e) {
		return this.clampPoint(e, on).distanceTo(e);
	}
	getBoundingSphere(e) {
		return this.isEmpty() ? e.makeEmpty() : (this.getCenter(e.center), e.radius = this.getSize(on).length() * .5), e;
	}
	intersect(e) {
		return this.min.max(e.min), this.max.min(e.max), this.isEmpty() && this.makeEmpty(), this;
	}
	union(e) {
		return this.min.min(e.min), this.max.max(e.max), this;
	}
	applyMatrix4(e) {
		return this.isEmpty() || (an[0].set(this.min.x, this.min.y, this.min.z).applyMatrix4(e), an[1].set(this.min.x, this.min.y, this.max.z).applyMatrix4(e), an[2].set(this.min.x, this.max.y, this.min.z).applyMatrix4(e), an[3].set(this.min.x, this.max.y, this.max.z).applyMatrix4(e), an[4].set(this.max.x, this.min.y, this.min.z).applyMatrix4(e), an[5].set(this.max.x, this.min.y, this.max.z).applyMatrix4(e), an[6].set(this.max.x, this.max.y, this.min.z).applyMatrix4(e), an[7].set(this.max.x, this.max.y, this.max.z).applyMatrix4(e), this.setFromPoints(an)), this;
	}
	translate(e) {
		return this.min.add(e), this.max.add(e), this;
	}
	equals(e) {
		return e.min.equals(this.min) && e.max.equals(this.max);
	}
	toJSON() {
		return {
			min: this.min.toArray(),
			max: this.max.toArray()
		};
	}
	fromJSON(e) {
		return this.min.fromArray(e.min), this.max.fromArray(e.max), this;
	}
}, an = [
	/*@__PURE__*/ new W(),
	/*@__PURE__*/ new W(),
	/*@__PURE__*/ new W(),
	/*@__PURE__*/ new W(),
	/*@__PURE__*/ new W(),
	/*@__PURE__*/ new W(),
	/*@__PURE__*/ new W(),
	/*@__PURE__*/ new W()
], on = /*@__PURE__*/ new W(), sn = /*@__PURE__*/ new rn(), cn = /*@__PURE__*/ new W(), ln = /*@__PURE__*/ new W(), un = /*@__PURE__*/ new W(), dn = /*@__PURE__*/ new W(), fn = /*@__PURE__*/ new W(), pn = /*@__PURE__*/ new W(), mn = /*@__PURE__*/ new W(), hn = /*@__PURE__*/ new W(), gn = /*@__PURE__*/ new W(), _n = /*@__PURE__*/ new W();
function vn(e, t, n, r, i) {
	for (let a = 0, o = e.length - 3; a <= o; a += 3) {
		_n.fromArray(e, a);
		let o = i.x * Math.abs(_n.x) + i.y * Math.abs(_n.y) + i.z * Math.abs(_n.z), s = t.dot(_n), c = n.dot(_n), l = r.dot(_n);
		if (Math.max(-Math.max(s, c, l), Math.min(s, c, l)) > o) return !1;
	}
	return !0;
}
var yn = /*@__PURE__*/ new W(), bn = /*@__PURE__*/ new H(), xn = 0, Sn = class extends he {
	constructor(e, t, n = !1) {
		if (super(), Array.isArray(e)) throw TypeError("THREE.BufferAttribute: array should be a Typed Array.");
		this.isBufferAttribute = !0, Object.defineProperty(this, "id", { value: xn++ }), this.name = "", this.array = e, this.itemSize = t, this.count = e === void 0 ? 0 : e.length / t, this.normalized = n, this.usage = F, this.updateRanges = [], this.gpuType = f, this.version = 0;
	}
	onUploadCallback() {}
	set needsUpdate(e) {
		e === !0 && this.version++;
	}
	setUsage(e) {
		return this.usage = e, this;
	}
	addUpdateRange(e, t) {
		this.updateRanges.push({
			start: e,
			count: t
		});
	}
	clearUpdateRanges() {
		this.updateRanges.length = 0;
	}
	copy(e) {
		return this.name = e.name, this.array = new e.array.constructor(e.array), this.itemSize = e.itemSize, this.count = e.count, this.normalized = e.normalized, this.usage = e.usage, this.gpuType = e.gpuType, this;
	}
	copyAt(e, t, n) {
		e *= this.itemSize, n *= t.itemSize;
		for (let r = 0, i = this.itemSize; r < i; r++) this.array[e + r] = t.array[n + r];
		return this;
	}
	copyArray(e) {
		return this.array.set(e), this;
	}
	applyMatrix3(e) {
		if (this.itemSize === 2) for (let t = 0, n = this.count; t < n; t++) bn.fromBufferAttribute(this, t), bn.applyMatrix3(e), this.setXY(t, bn.x, bn.y);
		else if (this.itemSize === 3) for (let t = 0, n = this.count; t < n; t++) yn.fromBufferAttribute(this, t), yn.applyMatrix3(e), this.setXYZ(t, yn.x, yn.y, yn.z);
		return this;
	}
	applyMatrix4(e) {
		for (let t = 0, n = this.count; t < n; t++) yn.fromBufferAttribute(this, t), yn.applyMatrix4(e), this.setXYZ(t, yn.x, yn.y, yn.z);
		return this;
	}
	applyNormalMatrix(e) {
		for (let t = 0, n = this.count; t < n; t++) yn.fromBufferAttribute(this, t), yn.applyNormalMatrix(e), this.setXYZ(t, yn.x, yn.y, yn.z);
		return this;
	}
	transformDirection(e) {
		for (let t = 0, n = this.count; t < n; t++) yn.fromBufferAttribute(this, t), yn.transformDirection(e), this.setXYZ(t, yn.x, yn.y, yn.z);
		return this;
	}
	set(e, t = 0) {
		return this.array.set(e, t), this;
	}
	getComponent(e, t) {
		let n = this.array[e * this.itemSize + t];
		return this.normalized && (n = Re(n, this.array)), n;
	}
	setComponent(e, t, n) {
		return this.normalized && (n = B(n, this.array)), this.array[e * this.itemSize + t] = n, this;
	}
	getX(e) {
		let t = this.array[e * this.itemSize];
		return this.normalized && (t = Re(t, this.array)), t;
	}
	setX(e, t) {
		return this.normalized && (t = B(t, this.array)), this.array[e * this.itemSize] = t, this;
	}
	getY(e) {
		let t = this.array[e * this.itemSize + 1];
		return this.normalized && (t = Re(t, this.array)), t;
	}
	setY(e, t) {
		return this.normalized && (t = B(t, this.array)), this.array[e * this.itemSize + 1] = t, this;
	}
	getZ(e) {
		let t = this.array[e * this.itemSize + 2];
		return this.normalized && (t = Re(t, this.array)), t;
	}
	setZ(e, t) {
		return this.normalized && (t = B(t, this.array)), this.array[e * this.itemSize + 2] = t, this;
	}
	getW(e) {
		let t = this.array[e * this.itemSize + 3];
		return this.normalized && (t = Re(t, this.array)), t;
	}
	setW(e, t) {
		return this.normalized && (t = B(t, this.array)), this.array[e * this.itemSize + 3] = t, this;
	}
	setXY(e, t, n) {
		return e *= this.itemSize, this.normalized && (t = B(t, this.array), n = B(n, this.array)), this.array[e + 0] = t, this.array[e + 1] = n, this;
	}
	setXYZ(e, t, n, r) {
		return e *= this.itemSize, this.normalized && (t = B(t, this.array), n = B(n, this.array), r = B(r, this.array)), this.array[e + 0] = t, this.array[e + 1] = n, this.array[e + 2] = r, this;
	}
	setXYZW(e, t, n, r, i) {
		return e *= this.itemSize, this.normalized && (t = B(t, this.array), n = B(n, this.array), r = B(r, this.array), i = B(i, this.array)), this.array[e + 0] = t, this.array[e + 1] = n, this.array[e + 2] = r, this.array[e + 3] = i, this;
	}
	onUpload(e) {
		return this.onUploadCallback = e, this;
	}
	clone() {
		return new this.constructor(this.array, this.itemSize).copy(this);
	}
	toJSON() {
		let e = {
			itemSize: this.itemSize,
			type: this.array.constructor.name,
			array: Array.from(this.array),
			normalized: this.normalized
		};
		return e.name = this.name, e.usage = this.usage, e.gpuType = this.gpuType, e;
	}
	dispose() {
		this.dispatchEvent({ type: "dispose" });
	}
}, Cn = class extends Sn {
	constructor(e, t, n) {
		super(new Uint16Array(e), t, n);
	}
}, wn = class extends Sn {
	constructor(e, t, n) {
		super(new Uint32Array(e), t, n);
	}
}, Tn = class extends Sn {
	constructor(e, t, n) {
		super(new Float32Array(e), t, n);
	}
}, En = /*@__PURE__*/ new rn(), Dn = /*@__PURE__*/ new W(), On = /*@__PURE__*/ new W(), kn = class {
	constructor(e = new W(), t = -1) {
		this.isSphere = !0, this.center = e, this.radius = t;
	}
	set(e, t) {
		return this.center.copy(e), this.radius = t, this;
	}
	setFromPoints(e, t) {
		let n = this.center;
		t === void 0 ? En.setFromPoints(e).getCenter(n) : n.copy(t);
		let r = 0;
		for (let t = 0, i = e.length; t < i; t++) r = Math.max(r, n.distanceToSquared(e[t]));
		return this.radius = Math.sqrt(r), this;
	}
	copy(e) {
		return this.center.copy(e.center), this.radius = e.radius, this;
	}
	isEmpty() {
		return this.radius < 0;
	}
	makeEmpty() {
		return this.center.set(0, 0, 0), this.radius = -1, this;
	}
	containsPoint(e) {
		return e.distanceToSquared(this.center) <= this.radius * this.radius;
	}
	distanceToPoint(e) {
		return e.distanceTo(this.center) - this.radius;
	}
	intersectsSphere(e) {
		let t = this.radius + e.radius;
		return e.center.distanceToSquared(this.center) <= t * t;
	}
	intersectsBox(e) {
		return e.intersectsSphere(this);
	}
	intersectsPlane(e) {
		return Math.abs(e.distanceToPoint(this.center)) <= this.radius;
	}
	clampPoint(e, t) {
		let n = this.center.distanceToSquared(e);
		return t.copy(e), n > this.radius * this.radius && (t.sub(this.center).normalize(), t.multiplyScalar(this.radius).add(this.center)), t;
	}
	getBoundingBox(e) {
		return this.isEmpty() ? (e.makeEmpty(), e) : (e.set(this.center, this.center), e.expandByScalar(this.radius), e);
	}
	applyMatrix4(e) {
		return this.center.applyMatrix4(e), this.radius *= e.getMaxScaleOnAxis(), this;
	}
	translate(e) {
		return this.center.add(e), this;
	}
	expandByPoint(e) {
		if (this.isEmpty()) return this.center.copy(e), this.radius = 0, this;
		Dn.subVectors(e, this.center);
		let t = Dn.lengthSq();
		if (t > this.radius * this.radius) {
			let e = Math.sqrt(t), n = (e - this.radius) * .5;
			this.center.addScaledVector(Dn, n / e), this.radius += n;
		}
		return this;
	}
	union(e) {
		return e.isEmpty() ? this : this.isEmpty() ? (this.copy(e), this) : (this.center.equals(e.center) === !0 ? this.radius = Math.max(this.radius, e.radius) : (On.subVectors(e.center, this.center).setLength(e.radius), this.expandByPoint(Dn.copy(e.center).add(On)), this.expandByPoint(Dn.copy(e.center).sub(On))), this);
	}
	equals(e) {
		return e.center.equals(this.center) && e.radius === this.radius;
	}
	clone() {
		return new this.constructor().copy(this);
	}
	toJSON() {
		return {
			radius: this.radius,
			center: this.center.toArray()
		};
	}
	fromJSON(e) {
		return this.radius = e.radius, this.center.fromArray(e.center), this;
	}
}, An = 0, jn = /*@__PURE__*/ new q(), Mn = /*@__PURE__*/ new Mt(), Nn = /*@__PURE__*/ new W(), Pn = /*@__PURE__*/ new rn(), Fn = /*@__PURE__*/ new rn(), In = /*@__PURE__*/ new W(), Ln = class e extends he {
	constructor() {
		super(), this.isBufferGeometry = !0, Object.defineProperty(this, "id", { value: An++ }), this.uuid = be(), this.name = "", this.type = "BufferGeometry", this.index = null, this.indirect = null, this.indirectOffset = 0, this.attributes = {}, this.morphAttributes = {}, this.morphTargetsRelative = !1, this.groups = [], this.boundingBox = null, this.boundingSphere = null, this.drawRange = {
			start: 0,
			count: Infinity
		}, this.userData = {}, this._transformed = !1;
	}
	getIndex() {
		return this.index;
	}
	setIndex(e) {
		return this.index = Array.isArray(e) ? new (ae(e) ? wn : Cn)(e, 1) : e, this;
	}
	setIndirect(e, t = 0) {
		return this.indirect = e, this.indirectOffset = t, this;
	}
	getIndirect() {
		return this.indirect;
	}
	getAttribute(e) {
		return this.attributes[e];
	}
	setAttribute(e, t) {
		return this.attributes[e] = t, this;
	}
	deleteAttribute(e) {
		return delete this.attributes[e], this;
	}
	hasAttribute(e) {
		return this.attributes[e] !== void 0;
	}
	addGroup(e, t, n = 0) {
		this.groups.push({
			start: e,
			count: t,
			materialIndex: n
		});
	}
	clearGroups() {
		this.groups = [];
	}
	setDrawRange(e, t) {
		this.drawRange.start = e, this.drawRange.count = t;
	}
	applyMatrix4(e) {
		let t = this.attributes.position;
		t !== void 0 && (t.applyMatrix4(e), t.needsUpdate = !0);
		let n = this.attributes.normal;
		if (n !== void 0) {
			let t = new G().getNormalMatrix(e);
			n.applyNormalMatrix(t), n.needsUpdate = !0;
		}
		let r = this.attributes.tangent;
		return r !== void 0 && (r.transformDirection(e), r.needsUpdate = !0), this.boundingBox !== null && this.computeBoundingBox(), this.boundingSphere !== null && this.computeBoundingSphere(), this._transformed = !0, this;
	}
	applyQuaternion(e) {
		return jn.makeRotationFromQuaternion(e), this.applyMatrix4(jn), this;
	}
	rotateX(e) {
		return jn.makeRotationX(e), this.applyMatrix4(jn), this;
	}
	rotateY(e) {
		return jn.makeRotationY(e), this.applyMatrix4(jn), this;
	}
	rotateZ(e) {
		return jn.makeRotationZ(e), this.applyMatrix4(jn), this;
	}
	translate(e, t, n) {
		return jn.makeTranslation(e, t, n), this.applyMatrix4(jn), this;
	}
	scale(e, t, n) {
		return jn.makeScale(e, t, n), this.applyMatrix4(jn), this;
	}
	lookAt(e) {
		return Mn.lookAt(e), Mn.updateMatrix(), this.applyMatrix4(Mn.matrix), this;
	}
	center() {
		return this.computeBoundingBox(), this.boundingBox.getCenter(Nn).negate(), this.translate(Nn.x, Nn.y, Nn.z), this;
	}
	setFromPoints(e) {
		let t = this.getAttribute("position");
		if (t === void 0) {
			let t = [];
			for (let n = 0, r = e.length; n < r; n++) {
				let r = e[n];
				t.push(r.x, r.y, r.z || 0);
			}
			this.setAttribute("position", new Tn(t, 3));
		} else {
			let n = Math.min(e.length, t.count);
			for (let r = 0; r < n; r++) {
				let n = e[r];
				t.setXYZ(r, n.x, n.y, n.z || 0);
			}
			e.length > t.count && I("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."), t.needsUpdate = !0;
		}
		return this;
	}
	computeBoundingBox() {
		this.boundingBox === null && (this.boundingBox = new rn());
		let e = this.attributes.position, t = this.morphAttributes.position;
		if (e && e.isGLBufferAttribute) L("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.", this), this.boundingBox.set(new W(-Infinity, -Infinity, -Infinity), new W(Infinity, Infinity, Infinity));
		else {
			if (e !== void 0) {
				if (this.boundingBox.setFromBufferAttribute(e), t) for (let e = 0, n = t.length; e < n; e++) {
					let n = t[e];
					Pn.setFromBufferAttribute(n), this.morphTargetsRelative ? (In.addVectors(this.boundingBox.min, Pn.min), this.boundingBox.expandByPoint(In), In.addVectors(this.boundingBox.max, Pn.max), this.boundingBox.expandByPoint(In)) : (this.boundingBox.expandByPoint(Pn.min), this.boundingBox.expandByPoint(Pn.max));
				}
			} else this.boundingBox.makeEmpty();
			(isNaN(this.boundingBox.min.x) || isNaN(this.boundingBox.min.y) || isNaN(this.boundingBox.min.z)) && L("BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The \"position\" attribute is likely to have NaN values.", this);
		}
	}
	computeBoundingSphere() {
		this.boundingSphere === null && (this.boundingSphere = new kn());
		let e = this.attributes.position, t = this.morphAttributes.position;
		if (e && e.isGLBufferAttribute) L("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.", this), this.boundingSphere.set(new W(), Infinity);
		else if (e) {
			let n = this.boundingSphere.center;
			if (Pn.setFromBufferAttribute(e), t) for (let e = 0, n = t.length; e < n; e++) {
				let n = t[e];
				Fn.setFromBufferAttribute(n), this.morphTargetsRelative ? (In.addVectors(Pn.min, Fn.min), Pn.expandByPoint(In), In.addVectors(Pn.max, Fn.max), Pn.expandByPoint(In)) : (Pn.expandByPoint(Fn.min), Pn.expandByPoint(Fn.max));
			}
			Pn.getCenter(n);
			let r = 0;
			for (let t = 0, i = e.count; t < i; t++) In.fromBufferAttribute(e, t), r = Math.max(r, n.distanceToSquared(In));
			if (t) for (let i = 0, a = t.length; i < a; i++) {
				let a = t[i], o = this.morphTargetsRelative;
				for (let t = 0, i = a.count; t < i; t++) In.fromBufferAttribute(a, t), o && (Nn.fromBufferAttribute(e, t), In.add(Nn)), r = Math.max(r, n.distanceToSquared(In));
			}
			this.boundingSphere.radius = Math.sqrt(r), isNaN(this.boundingSphere.radius) && L("BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The \"position\" attribute is likely to have NaN values.", this);
		}
	}
	computeTangents() {
		let e = this.index, t = this.attributes;
		if (e === null || t.position === void 0 || t.normal === void 0 || t.uv === void 0) {
			L("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");
			return;
		}
		let n = t.position, r = t.normal, i = t.uv, a = this.getAttribute("tangent");
		(a === void 0 || a.count !== n.count) && (a = new Sn(new Float32Array(4 * n.count), 4), this.setAttribute("tangent", a));
		let o = [], s = [];
		for (let e = 0; e < n.count; e++) o[e] = new W(), s[e] = new W();
		let c = new W(), l = new W(), u = new W(), d = new H(), f = new H(), p = new H(), m = new W(), h = new W();
		function g(e, t, r) {
			c.fromBufferAttribute(n, e), l.fromBufferAttribute(n, t), u.fromBufferAttribute(n, r), d.fromBufferAttribute(i, e), f.fromBufferAttribute(i, t), p.fromBufferAttribute(i, r), l.sub(c), u.sub(c), f.sub(d), p.sub(d);
			let a = 1 / (f.x * p.y - p.x * f.y);
			isFinite(a) && (m.copy(l).multiplyScalar(p.y).addScaledVector(u, -f.y).multiplyScalar(a), h.copy(u).multiplyScalar(f.x).addScaledVector(l, -p.x).multiplyScalar(a), o[e].add(m), o[t].add(m), o[r].add(m), s[e].add(h), s[t].add(h), s[r].add(h));
		}
		let _ = this.groups;
		_.length === 0 && (_ = [{
			start: 0,
			count: e.count
		}]);
		for (let t = 0, n = _.length; t < n; ++t) {
			let n = _[t], r = n.start, i = n.count;
			for (let t = r, n = r + i; t < n; t += 3) g(e.getX(t + 0), e.getX(t + 1), e.getX(t + 2));
		}
		let v = new W(), y = new W(), b = new W(), x = new W();
		function S(e) {
			b.fromBufferAttribute(r, e), x.copy(b);
			let t = o[e];
			v.copy(t), v.sub(b.multiplyScalar(b.dot(t))).normalize(), y.crossVectors(x, t);
			let n = y.dot(s[e]) < 0 ? -1 : 1;
			a.setXYZW(e, v.x, v.y, v.z, n);
		}
		for (let t = 0, n = _.length; t < n; ++t) {
			let n = _[t], r = n.start, i = n.count;
			for (let t = r, n = r + i; t < n; t += 3) S(e.getX(t + 0)), S(e.getX(t + 1)), S(e.getX(t + 2));
		}
		this._transformed = !0;
	}
	computeVertexNormals() {
		let e = this.index, t = this.getAttribute("position");
		if (t !== void 0) {
			let n = this.getAttribute("normal");
			if (n === void 0 || n.count !== t.count) n = new Sn(new Float32Array(t.count * 3), 3), this.setAttribute("normal", n);
			else for (let e = 0, t = n.count; e < t; e++) n.setXYZ(e, 0, 0, 0);
			let r = new W(), i = new W(), a = new W(), o = new W(), s = new W(), c = new W(), l = new W(), u = new W();
			if (e) for (let d = 0, f = e.count; d < f; d += 3) {
				let f = e.getX(d + 0), p = e.getX(d + 1), m = e.getX(d + 2);
				r.fromBufferAttribute(t, f), i.fromBufferAttribute(t, p), a.fromBufferAttribute(t, m), l.subVectors(a, i), u.subVectors(r, i), l.cross(u), o.fromBufferAttribute(n, f), s.fromBufferAttribute(n, p), c.fromBufferAttribute(n, m), o.add(l), s.add(l), c.add(l), n.setXYZ(f, o.x, o.y, o.z), n.setXYZ(p, s.x, s.y, s.z), n.setXYZ(m, c.x, c.y, c.z);
			}
			else for (let e = 0, o = t.count; e < o; e += 3) r.fromBufferAttribute(t, e + 0), i.fromBufferAttribute(t, e + 1), a.fromBufferAttribute(t, e + 2), l.subVectors(a, i), u.subVectors(r, i), l.cross(u), n.setXYZ(e + 0, l.x, l.y, l.z), n.setXYZ(e + 1, l.x, l.y, l.z), n.setXYZ(e + 2, l.x, l.y, l.z);
			this.normalizeNormals(), n.needsUpdate = !0;
		}
	}
	normalizeNormals() {
		let e = this.attributes.normal;
		for (let t = 0, n = e.count; t < n; t++) In.fromBufferAttribute(e, t), In.normalize(), e.setXYZ(t, In.x, In.y, In.z);
	}
	toNonIndexed() {
		function t(e, t) {
			let n = e.array, r = e.itemSize, i = e.normalized, a = new n.constructor(t.length * r), o = 0, s = 0;
			for (let i = 0, c = t.length; i < c; i++) {
				o = e.isInterleavedBufferAttribute ? t[i] * e.data.stride + e.offset : t[i] * r;
				for (let e = 0; e < r; e++) a[s++] = n[o++];
			}
			return new Sn(a, r, i);
		}
		if (this.index === null) return I("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."), this;
		let n = new e(), r = this.index.array, i = this.attributes;
		for (let e in i) {
			let a = i[e], o = t(a, r);
			n.setAttribute(e, o);
		}
		let a = this.morphAttributes;
		for (let e in a) {
			let i = [], o = a[e];
			for (let e = 0, n = o.length; e < n; e++) {
				let n = o[e], a = t(n, r);
				i.push(a);
			}
			n.morphAttributes[e] = i;
		}
		n.morphTargetsRelative = this.morphTargetsRelative;
		let o = this.groups;
		for (let e = 0, t = o.length; e < t; e++) {
			let t = o[e];
			n.addGroup(t.start, t.count, t.materialIndex);
		}
		return n;
	}
	toJSON() {
		let e = { metadata: {
			version: 4.7,
			type: "BufferGeometry",
			generator: "BufferGeometry.toJSON"
		} };
		if (e.uuid = this.uuid, e.type = this.parameters !== void 0 && this._transformed === !0 ? "BufferGeometry" : this.type, e.name = this.name, Object.keys(this.userData).length > 0 && (e.userData = this.userData), this.parameters !== void 0 && this._transformed !== !0) {
			let t = this.parameters;
			for (let n in t) t[n] !== void 0 && (e[n] = t[n]);
			return e;
		}
		e.data = { attributes: {} };
		let t = this.index;
		t !== null && (e.data.index = {
			type: t.array.constructor.name,
			array: Array.prototype.slice.call(t.array)
		});
		let n = this.attributes;
		for (let t in n) {
			let r = n[t];
			e.data.attributes[t] = r.toJSON(e.data);
		}
		let r = {}, i = !1;
		for (let t in this.morphAttributes) {
			let n = this.morphAttributes[t], a = [];
			for (let t = 0, r = n.length; t < r; t++) {
				let r = n[t];
				a.push(r.toJSON(e.data));
			}
			a.length > 0 && (r[t] = a, i = !0);
		}
		i && (e.data.morphAttributes = r, e.data.morphTargetsRelative = this.morphTargetsRelative);
		let a = this.groups;
		a.length > 0 && (e.data.groups = JSON.parse(JSON.stringify(a)));
		let o = this.boundingSphere;
		return o !== null && (e.data.boundingSphere = o.toJSON()), e;
	}
	clone() {
		return new this.constructor().copy(this);
	}
	copy(e) {
		this.index = null, this.attributes = {}, this.morphAttributes = {}, this.groups = [], this.boundingBox = null, this.boundingSphere = null;
		let t = {};
		this.name = e.name;
		let n = e.index;
		n !== null && this.setIndex(n.clone());
		let r = e.attributes;
		for (let e in r) {
			let n = r[e];
			this.setAttribute(e, n.clone(t));
		}
		let i = e.morphAttributes;
		for (let e in i) {
			let n = [], r = i[e];
			for (let e = 0, i = r.length; e < i; e++) n.push(r[e].clone(t));
			this.morphAttributes[e] = n;
		}
		this.morphTargetsRelative = e.morphTargetsRelative;
		let a = e.groups;
		for (let e = 0, t = a.length; e < t; e++) {
			let t = a[e];
			this.addGroup(t.start, t.count, t.materialIndex);
		}
		let o = e.boundingBox;
		o !== null && (this.boundingBox = o.clone());
		let s = e.boundingSphere;
		return s !== null && (this.boundingSphere = s.clone()), this.drawRange.start = e.drawRange.start, this.drawRange.count = e.drawRange.count, this.userData = e.userData, this._transformed = e._transformed, this;
	}
	dispose() {
		this.dispatchEvent({ type: "dispose" });
	}
}, Rn = class {
	constructor(e, t) {
		this.isInterleavedBuffer = !0, this.array = e, this.stride = t, this.count = e === void 0 ? 0 : e.length / t, this.usage = F, this.updateRanges = [], this.version = 0, this.uuid = be();
	}
	onUploadCallback() {}
	set needsUpdate(e) {
		e === !0 && this.version++;
	}
	setUsage(e) {
		return this.usage = e, this;
	}
	addUpdateRange(e, t) {
		this.updateRanges.push({
			start: e,
			count: t
		});
	}
	clearUpdateRanges() {
		this.updateRanges.length = 0;
	}
	copy(e) {
		return this.array = new e.array.constructor(e.array), this.count = e.count, this.stride = e.stride, this.usage = e.usage, this;
	}
	copyAt(e, t, n) {
		e *= this.stride, n *= t.stride;
		for (let r = 0, i = this.stride; r < i; r++) this.array[e + r] = t.array[n + r];
		return this;
	}
	set(e, t = 0) {
		return this.array.set(e, t), this;
	}
	clone(e) {
		e.arrayBuffers === void 0 && (e.arrayBuffers = {}), this.array.buffer._uuid === void 0 && (this.array.buffer._uuid = be()), e.arrayBuffers[this.array.buffer._uuid] === void 0 && (e.arrayBuffers[this.array.buffer._uuid] = this.array.slice(0).buffer);
		let t = new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]), n = new this.constructor(t, this.stride);
		return n.setUsage(this.usage), n;
	}
	onUpload(e) {
		return this.onUploadCallback = e, this;
	}
	toJSON(e) {
		e.arrayBuffers === void 0 && (e.arrayBuffers = {}), this.array.buffer._uuid === void 0 && (this.array.buffer._uuid = be()), e.arrayBuffers[this.array.buffer._uuid] === void 0 && (e.arrayBuffers[this.array.buffer._uuid] = Array.from(new Uint32Array(this.array.buffer)));
		let t = {
			uuid: this.uuid,
			buffer: this.array.buffer._uuid,
			type: this.array.constructor.name,
			stride: this.stride
		};
		return t.usage = this.usage, t;
	}
}, zn = /*@__PURE__*/ new W(), Bn = class e {
	constructor(e, t, n, r = !1) {
		this.isInterleavedBufferAttribute = !0, this.name = "", this.data = e, this.itemSize = t, this.offset = n, this.normalized = r;
	}
	get count() {
		return this.data.count;
	}
	get array() {
		return this.data.array;
	}
	set needsUpdate(e) {
		this.data.needsUpdate = e;
	}
	applyMatrix4(e) {
		for (let t = 0, n = this.data.count; t < n; t++) zn.fromBufferAttribute(this, t), zn.applyMatrix4(e), this.setXYZ(t, zn.x, zn.y, zn.z);
		return this;
	}
	applyNormalMatrix(e) {
		for (let t = 0, n = this.count; t < n; t++) zn.fromBufferAttribute(this, t), zn.applyNormalMatrix(e), this.setXYZ(t, zn.x, zn.y, zn.z);
		return this;
	}
	transformDirection(e) {
		for (let t = 0, n = this.count; t < n; t++) zn.fromBufferAttribute(this, t), zn.transformDirection(e), this.setXYZ(t, zn.x, zn.y, zn.z);
		return this;
	}
	getComponent(e, t) {
		let n = this.array[e * this.data.stride + this.offset + t];
		return this.normalized && (n = Re(n, this.array)), n;
	}
	setComponent(e, t, n) {
		return this.normalized && (n = B(n, this.array)), this.data.array[e * this.data.stride + this.offset + t] = n, this;
	}
	setX(e, t) {
		return this.normalized && (t = B(t, this.array)), this.data.array[e * this.data.stride + this.offset] = t, this;
	}
	setY(e, t) {
		return this.normalized && (t = B(t, this.array)), this.data.array[e * this.data.stride + this.offset + 1] = t, this;
	}
	setZ(e, t) {
		return this.normalized && (t = B(t, this.array)), this.data.array[e * this.data.stride + this.offset + 2] = t, this;
	}
	setW(e, t) {
		return this.normalized && (t = B(t, this.array)), this.data.array[e * this.data.stride + this.offset + 3] = t, this;
	}
	getX(e) {
		let t = this.data.array[e * this.data.stride + this.offset];
		return this.normalized && (t = Re(t, this.array)), t;
	}
	getY(e) {
		let t = this.data.array[e * this.data.stride + this.offset + 1];
		return this.normalized && (t = Re(t, this.array)), t;
	}
	getZ(e) {
		let t = this.data.array[e * this.data.stride + this.offset + 2];
		return this.normalized && (t = Re(t, this.array)), t;
	}
	getW(e) {
		let t = this.data.array[e * this.data.stride + this.offset + 3];
		return this.normalized && (t = Re(t, this.array)), t;
	}
	setXY(e, t, n) {
		return e = e * this.data.stride + this.offset, this.normalized && (t = B(t, this.array), n = B(n, this.array)), this.data.array[e + 0] = t, this.data.array[e + 1] = n, this;
	}
	setXYZ(e, t, n, r) {
		return e = e * this.data.stride + this.offset, this.normalized && (t = B(t, this.array), n = B(n, this.array), r = B(r, this.array)), this.data.array[e + 0] = t, this.data.array[e + 1] = n, this.data.array[e + 2] = r, this;
	}
	setXYZW(e, t, n, r, i) {
		return e = e * this.data.stride + this.offset, this.normalized && (t = B(t, this.array), n = B(n, this.array), r = B(r, this.array), i = B(i, this.array)), this.data.array[e + 0] = t, this.data.array[e + 1] = n, this.data.array[e + 2] = r, this.data.array[e + 3] = i, this;
	}
	clone(t) {
		if (t === void 0) {
			ue("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");
			let e = [];
			for (let t = 0; t < this.count; t++) {
				let n = t * this.data.stride + this.offset;
				for (let t = 0; t < this.itemSize; t++) e.push(this.data.array[n + t]);
			}
			return new Sn(new this.array.constructor(e), this.itemSize, this.normalized);
		}
		return t.interleavedBuffers === void 0 && (t.interleavedBuffers = {}), t.interleavedBuffers[this.data.uuid] === void 0 && (t.interleavedBuffers[this.data.uuid] = this.data.clone(t)), new e(t.interleavedBuffers[this.data.uuid], this.itemSize, this.offset, this.normalized);
	}
	toJSON(e) {
		if (e === void 0) {
			ue("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");
			let e = [];
			for (let t = 0; t < this.count; t++) {
				let n = t * this.data.stride + this.offset;
				for (let t = 0; t < this.itemSize; t++) e.push(this.data.array[n + t]);
			}
			return {
				itemSize: this.itemSize,
				type: this.array.constructor.name,
				array: e,
				normalized: this.normalized
			};
		}
		return e.interleavedBuffers === void 0 && (e.interleavedBuffers = {}), e.interleavedBuffers[this.data.uuid] === void 0 && (e.interleavedBuffers[this.data.uuid] = this.data.toJSON(e)), {
			isInterleavedBufferAttribute: !0,
			itemSize: this.itemSize,
			data: this.data.uuid,
			offset: this.offset,
			normalized: this.normalized
		};
	}
}, Vn = /*@__PURE__*/ new W(), Hn = /*@__PURE__*/ new W(), Un = /*@__PURE__*/ new G(), Wn = class {
	constructor(e = new W(1, 0, 0), t = 0) {
		this.isPlane = !0, this.normal = e, this.constant = t;
	}
	set(e, t) {
		return this.normal.copy(e), this.constant = t, this;
	}
	setComponents(e, t, n, r) {
		return this.normal.set(e, t, n), this.constant = r, this;
	}
	setFromNormalAndCoplanarPoint(e, t) {
		return this.normal.copy(e), this.constant = -t.dot(this.normal), this;
	}
	setFromCoplanarPoints(e, t, n) {
		let r = Vn.subVectors(n, t).cross(Hn.subVectors(e, t)).normalize();
		return this.setFromNormalAndCoplanarPoint(r, e), this;
	}
	copy(e) {
		return this.normal.copy(e.normal), this.constant = e.constant, this;
	}
	normalize() {
		let e = 1 / this.normal.length();
		return this.normal.multiplyScalar(e), this.constant *= e, this;
	}
	negate() {
		return this.constant *= -1, this.normal.negate(), this;
	}
	distanceToPoint(e) {
		return this.normal.dot(e) + this.constant;
	}
	distanceToSphere(e) {
		return this.distanceToPoint(e.center) - e.radius;
	}
	projectPoint(e, t) {
		return t.copy(e).addScaledVector(this.normal, -this.distanceToPoint(e));
	}
	intersectLine(e, t, n = !0) {
		let r = e.delta(Vn), i = this.normal.dot(r);
		if (i === 0) return this.distanceToPoint(e.start) === 0 ? t.copy(e.start) : null;
		let a = -(e.start.dot(this.normal) + this.constant) / i;
		return n === !0 && (a < 0 || a > 1) ? null : t.copy(e.start).addScaledVector(r, a);
	}
	intersectsLine(e) {
		let t = this.distanceToPoint(e.start), n = this.distanceToPoint(e.end);
		return t < 0 && n > 0 || n < 0 && t > 0;
	}
	intersectsBox(e) {
		return e.intersectsPlane(this);
	}
	intersectsSphere(e) {
		return e.intersectsPlane(this);
	}
	coplanarPoint(e) {
		return e.copy(this.normal).multiplyScalar(-this.constant);
	}
	applyMatrix4(e, t) {
		let n = t || Un.getNormalMatrix(e), r = this.coplanarPoint(Vn).applyMatrix4(e), i = this.normal.applyMatrix3(n).normalize();
		return this.constant = -r.dot(i), this;
	}
	translate(e) {
		return this.constant -= e.dot(this.normal), this;
	}
	equals(e) {
		return e.normal.equals(this.normal) && e.constant === this.constant;
	}
	clone() {
		return new this.constructor().copy(this);
	}
	toJSON() {
		return {
			normal: this.normal.toArray(),
			constant: this.constant
		};
	}
	fromJSON(e) {
		return this.normal.fromArray(e.normal), this.constant = e.constant, this;
	}
}, Gn = 0, Kn = class extends he {
	constructor() {
		super(), this.isMaterial = !0, Object.defineProperty(this, "id", { value: Gn++ }), this.uuid = be(), this.name = "", this.type = "Material", this.blending = 1, this.side = 0, this.vertexColors = !1, this.opacity = 1, this.transparent = !1, this.alphaHash = !1, this.blendSrc = 204, this.blendDst = 205, this.blendEquation = 100, this.blendSrcAlpha = null, this.blendDstAlpha = null, this.blendEquationAlpha = null, this.blendColor = new J(0, 0, 0), this.blendAlpha = 0, this.depthFunc = 3, this.depthTest = !0, this.depthWrite = !0, this.stencilWriteMask = 255, this.stencilFunc = 519, this.stencilRef = 0, this.stencilFuncMask = 255, this.stencilFail = re, this.stencilZFail = re, this.stencilZPass = re, this.stencilWrite = !1, this.clippingPlanes = null, this.clipIntersection = !1, this.clipShadows = !1, this.shadowSide = null, this.colorWrite = !0, this.precision = null, this.polygonOffset = !1, this.polygonOffsetFactor = 0, this.polygonOffsetUnits = 0, this.dithering = !1, this.alphaToCoverage = !1, this.premultipliedAlpha = !1, this.forceSinglePass = !1, this.allowOverride = !0, this.visible = !0, this.toneMapped = !0, this.userData = {}, this.version = 0, this._alphaTest = 0;
	}
	get alphaTest() {
		return this._alphaTest;
	}
	set alphaTest(e) {
		this._alphaTest > 0 != e > 0 && this.version++, this._alphaTest = e;
	}
	onBeforeRender() {}
	onBeforeCompile() {}
	customProgramCacheKey() {
		return this.onBeforeCompile.toString();
	}
	setValues(e) {
		if (e !== void 0) for (let t in e) {
			let n = e[t];
			if (n === void 0) {
				I(`Material: parameter '${t}' has value of undefined.`);
				continue;
			}
			let r = this[t];
			r === void 0 ? I(`Material: '${t}' is not a property of THREE.${this.type}.`) : r && r.isColor ? r.set(n) : r && r.isVector2 && n && n.isVector2 || r && r.isEuler && n && n.isEuler || r && r.isVector3 && n && n.isVector3 ? r.copy(n) : this[t] = n;
		}
	}
	toJSON(e) {
		let t = e === void 0 || typeof e == "string";
		t && (e = {
			textures: {},
			images: {}
		});
		let n = { metadata: {
			version: 4.7,
			type: "Material",
			generator: "Material.toJSON"
		} };
		n.uuid = this.uuid, n.type = this.type, n.blending = this.blending, n.side = this.side, n.shadowSide = this.shadowSide, n.vertexColors = this.vertexColors, n.opacity = this.opacity, n.transparent = this.transparent, n.blendSrc = this.blendSrc, n.blendDst = this.blendDst, n.blendEquation = this.blendEquation, n.blendSrcAlpha = this.blendSrcAlpha, n.blendDstAlpha = this.blendDstAlpha, n.blendEquationAlpha = this.blendEquationAlpha, n.blendColor = this.blendColor.getHex(), n.blendAlpha = this.blendAlpha, n.depthFunc = this.depthFunc, n.depthTest = this.depthTest, n.depthWrite = this.depthWrite, n.colorWrite = this.colorWrite, n.clipIntersection = this.clipIntersection, n.clipShadows = this.clipShadows, n.stencilWriteMask = this.stencilWriteMask, n.stencilFunc = this.stencilFunc, n.stencilRef = this.stencilRef, n.stencilFuncMask = this.stencilFuncMask, n.stencilFail = this.stencilFail, n.stencilZFail = this.stencilZFail, n.stencilZPass = this.stencilZPass, n.stencilWrite = this.stencilWrite, n.polygonOffset = this.polygonOffset, n.polygonOffsetFactor = this.polygonOffsetFactor, n.polygonOffsetUnits = this.polygonOffsetUnits, n.dithering = this.dithering, n.alphaTest = this.alphaTest, n.alphaHash = this.alphaHash, n.alphaToCoverage = this.alphaToCoverage, n.premultipliedAlpha = this.premultipliedAlpha, n.forceSinglePass = this.forceSinglePass, n.allowOverride = this.allowOverride, n.visible = this.visible, n.toneMapped = this.toneMapped, n.name = this.name, this.color && this.color.isColor && (n.color = this.color.getHex()), this.roughness !== void 0 && (n.roughness = this.roughness), this.metalness !== void 0 && (n.metalness = this.metalness), this.sheen !== void 0 && (n.sheen = this.sheen), this.sheenColor && this.sheenColor.isColor && (n.sheenColor = this.sheenColor.getHex()), this.sheenRoughness !== void 0 && (n.sheenRoughness = this.sheenRoughness), this.emissive && this.emissive.isColor && (n.emissive = this.emissive.getHex()), this.emissiveIntensity !== void 0 && (n.emissiveIntensity = this.emissiveIntensity), this.specular && this.specular.isColor && (n.specular = this.specular.getHex()), this.specularIntensity !== void 0 && (n.specularIntensity = this.specularIntensity), this.specularColor && this.specularColor.isColor && (n.specularColor = this.specularColor.getHex()), this.shininess !== void 0 && (n.shininess = this.shininess), this.clearcoat !== void 0 && (n.clearcoat = this.clearcoat), this.clearcoatRoughness !== void 0 && (n.clearcoatRoughness = this.clearcoatRoughness), this.clearcoatMap && this.clearcoatMap.isTexture && (n.clearcoatMap = this.clearcoatMap.toJSON(e).uuid), this.clearcoatRoughnessMap && this.clearcoatRoughnessMap.isTexture && (n.clearcoatRoughnessMap = this.clearcoatRoughnessMap.toJSON(e).uuid), this.clearcoatNormalMap && this.clearcoatNormalMap.isTexture && (n.clearcoatNormalMap = this.clearcoatNormalMap.toJSON(e).uuid, n.clearcoatNormalScale = this.clearcoatNormalScale.toArray()), this.sheenColorMap && this.sheenColorMap.isTexture && (n.sheenColorMap = this.sheenColorMap.toJSON(e).uuid), this.sheenRoughnessMap && this.sheenRoughnessMap.isTexture && (n.sheenRoughnessMap = this.sheenRoughnessMap.toJSON(e).uuid), this.dispersion !== void 0 && (n.dispersion = this.dispersion), this.retroreflectivity !== void 0 && (n.retroreflectivity = this.retroreflectivity), this.iridescence !== void 0 && (n.iridescence = this.iridescence), this.iridescenceIOR !== void 0 && (n.iridescenceIOR = this.iridescenceIOR), this.iridescenceThicknessRange !== void 0 && (n.iridescenceThicknessRange = this.iridescenceThicknessRange), this.iridescenceMap && this.iridescenceMap.isTexture && (n.iridescenceMap = this.iridescenceMap.toJSON(e).uuid), this.iridescenceThicknessMap && this.iridescenceThicknessMap.isTexture && (n.iridescenceThicknessMap = this.iridescenceThicknessMap.toJSON(e).uuid), this.anisotropy !== void 0 && (n.anisotropy = this.anisotropy), this.anisotropyRotation !== void 0 && (n.anisotropyRotation = this.anisotropyRotation), this.anisotropyMap && this.anisotropyMap.isTexture && (n.anisotropyMap = this.anisotropyMap.toJSON(e).uuid), this.map && this.map.isTexture && (n.map = this.map.toJSON(e).uuid), this.matcap && this.matcap.isTexture && (n.matcap = this.matcap.toJSON(e).uuid), this.alphaMap && this.alphaMap.isTexture && (n.alphaMap = this.alphaMap.toJSON(e).uuid), this.lightMap && this.lightMap.isTexture && (n.lightMap = this.lightMap.toJSON(e).uuid, n.lightMapIntensity = this.lightMapIntensity), this.aoMap && this.aoMap.isTexture && (n.aoMap = this.aoMap.toJSON(e).uuid, n.aoMapIntensity = this.aoMapIntensity), this.bumpMap && this.bumpMap.isTexture && (n.bumpMap = this.bumpMap.toJSON(e).uuid, n.bumpScale = this.bumpScale), this.normalMap && this.normalMap.isTexture && (n.normalMap = this.normalMap.toJSON(e).uuid, n.normalMapType = this.normalMapType, n.normalScale = this.normalScale.toArray()), this.displacementMap && this.displacementMap.isTexture && (n.displacementMap = this.displacementMap.toJSON(e).uuid, n.displacementScale = this.displacementScale, n.displacementBias = this.displacementBias), this.roughnessMap && this.roughnessMap.isTexture && (n.roughnessMap = this.roughnessMap.toJSON(e).uuid), this.metalnessMap && this.metalnessMap.isTexture && (n.metalnessMap = this.metalnessMap.toJSON(e).uuid), this.emissiveMap && this.emissiveMap.isTexture && (n.emissiveMap = this.emissiveMap.toJSON(e).uuid), this.specularMap && this.specularMap.isTexture && (n.specularMap = this.specularMap.toJSON(e).uuid), this.specularIntensityMap && this.specularIntensityMap.isTexture && (n.specularIntensityMap = this.specularIntensityMap.toJSON(e).uuid), this.specularColorMap && this.specularColorMap.isTexture && (n.specularColorMap = this.specularColorMap.toJSON(e).uuid), this.envMap && this.envMap.isTexture && (n.envMap = this.envMap.toJSON(e).uuid, this.combine !== void 0 && (n.combine = this.combine)), this.envMapRotation !== void 0 && (n.envMapRotation = this.envMapRotation.toArray()), this.envMapIntensity !== void 0 && (n.envMapIntensity = this.envMapIntensity), this.reflectivity !== void 0 && (n.reflectivity = this.reflectivity), this.refractionRatio !== void 0 && (n.refractionRatio = this.refractionRatio), this.gradientMap && this.gradientMap.isTexture && (n.gradientMap = this.gradientMap.toJSON(e).uuid), this.transmission !== void 0 && (n.transmission = this.transmission), this.transmissionMap && this.transmissionMap.isTexture && (n.transmissionMap = this.transmissionMap.toJSON(e).uuid), this.thickness !== void 0 && (n.thickness = this.thickness), this.thicknessMap && this.thicknessMap.isTexture && (n.thicknessMap = this.thicknessMap.toJSON(e).uuid), this.attenuationDistance !== void 0 && (n.attenuationDistance = this.attenuationDistance), this.attenuationColor !== void 0 && (n.attenuationColor = this.attenuationColor.getHex()), this.size !== void 0 && (n.size = this.size), this.sizeAttenuation !== void 0 && (n.sizeAttenuation = this.sizeAttenuation), Array.isArray(this.clippingPlanes) && this.clippingPlanes.length > 0 && (n.clippingPlanes = this.clippingPlanes.map((e) => e.toJSON())), this.rotation !== void 0 && (n.rotation = this.rotation), this.depthPacking !== void 0 && (n.depthPacking = this.depthPacking), this.linewidth !== void 0 && (n.linewidth = this.linewidth), this.linecap !== void 0 && (n.linecap = this.linecap), this.linejoin !== void 0 && (n.linejoin = this.linejoin), this.dashSize !== void 0 && (n.dashSize = this.dashSize), this.gapSize !== void 0 && (n.gapSize = this.gapSize), this.scale !== void 0 && (n.scale = this.scale), this.wireframe !== void 0 && (n.wireframe = this.wireframe), this.wireframeLinewidth !== void 0 && (n.wireframeLinewidth = this.wireframeLinewidth), this.wireframeLinecap !== void 0 && (n.wireframeLinecap = this.wireframeLinecap), this.wireframeLinejoin !== void 0 && (n.wireframeLinejoin = this.wireframeLinejoin), this.flatShading !== void 0 && (n.flatShading = this.flatShading), this.fog !== void 0 && (n.fog = this.fog), Object.keys(this.userData).length > 0 && (n.userData = this.userData);
		function r(e) {
			let t = [];
			for (let n in e) {
				let r = e[n];
				delete r.metadata, t.push(r);
			}
			return t;
		}
		if (t) {
			let t = r(e.textures), i = r(e.images);
			t.length > 0 && (n.textures = t), i.length > 0 && (n.images = i);
		}
		return n;
	}
	fromJSON(e, t) {
		if (e.uuid !== void 0 && (this.uuid = e.uuid), e.name !== void 0 && (this.name = e.name), e.color !== void 0 && this.color !== void 0 && this.color.setHex(e.color), e.roughness !== void 0 && (this.roughness = e.roughness), e.metalness !== void 0 && (this.metalness = e.metalness), e.sheen !== void 0 && (this.sheen = e.sheen), e.sheenColor !== void 0 && (this.sheenColor = new J().setHex(e.sheenColor)), e.sheenRoughness !== void 0 && (this.sheenRoughness = e.sheenRoughness), e.emissive !== void 0 && this.emissive !== void 0 && this.emissive.setHex(e.emissive), e.specular !== void 0 && this.specular !== void 0 && this.specular.setHex(e.specular), e.specularIntensity !== void 0 && (this.specularIntensity = e.specularIntensity), e.specularColor !== void 0 && this.specularColor !== void 0 && this.specularColor.setHex(e.specularColor), e.shininess !== void 0 && (this.shininess = e.shininess), e.clearcoat !== void 0 && (this.clearcoat = e.clearcoat), e.clearcoatRoughness !== void 0 && (this.clearcoatRoughness = e.clearcoatRoughness), e.dispersion !== void 0 && (this.dispersion = e.dispersion), e.retroreflectivity !== void 0 && (this.retroreflectivity = e.retroreflectivity), e.iridescence !== void 0 && (this.iridescence = e.iridescence), e.iridescenceIOR !== void 0 && (this.iridescenceIOR = e.iridescenceIOR), e.iridescenceThicknessRange !== void 0 && (this.iridescenceThicknessRange = e.iridescenceThicknessRange), e.transmission !== void 0 && (this.transmission = e.transmission), e.thickness !== void 0 && (this.thickness = e.thickness), e.attenuationDistance !== void 0 && (this.attenuationDistance = e.attenuationDistance), e.attenuationColor !== void 0 && this.attenuationColor !== void 0 && this.attenuationColor.setHex(e.attenuationColor), e.anisotropy !== void 0 && (this.anisotropy = e.anisotropy), e.anisotropyRotation !== void 0 && (this.anisotropyRotation = e.anisotropyRotation), e.fog !== void 0 && (this.fog = e.fog), e.flatShading !== void 0 && (this.flatShading = e.flatShading), e.blending !== void 0 && (this.blending = e.blending), e.combine !== void 0 && (this.combine = e.combine), e.side !== void 0 && (this.side = e.side), e.shadowSide !== void 0 && (this.shadowSide = e.shadowSide), e.opacity !== void 0 && (this.opacity = e.opacity), e.transparent !== void 0 && (this.transparent = e.transparent), e.alphaTest !== void 0 && (this.alphaTest = e.alphaTest), e.alphaHash !== void 0 && (this.alphaHash = e.alphaHash), e.depthFunc !== void 0 && (this.depthFunc = e.depthFunc), e.depthTest !== void 0 && (this.depthTest = e.depthTest), e.depthWrite !== void 0 && (this.depthWrite = e.depthWrite), e.colorWrite !== void 0 && (this.colorWrite = e.colorWrite), e.clippingPlanes !== void 0 && (this.clippingPlanes = e.clippingPlanes.map((e) => new Wn().fromJSON(e))), e.clipIntersection !== void 0 && (this.clipIntersection = e.clipIntersection), e.clipShadows !== void 0 && (this.clipShadows = e.clipShadows), e.depthPacking !== void 0 && (this.depthPacking = e.depthPacking), e.blendSrc !== void 0 && (this.blendSrc = e.blendSrc), e.blendDst !== void 0 && (this.blendDst = e.blendDst), e.blendEquation !== void 0 && (this.blendEquation = e.blendEquation), e.blendSrcAlpha !== void 0 && (this.blendSrcAlpha = e.blendSrcAlpha), e.blendDstAlpha !== void 0 && (this.blendDstAlpha = e.blendDstAlpha), e.blendEquationAlpha !== void 0 && (this.blendEquationAlpha = e.blendEquationAlpha), e.blendColor !== void 0 && this.blendColor !== void 0 && this.blendColor.setHex(e.blendColor), e.blendAlpha !== void 0 && (this.blendAlpha = e.blendAlpha), e.stencilWriteMask !== void 0 && (this.stencilWriteMask = e.stencilWriteMask), e.stencilFunc !== void 0 && (this.stencilFunc = e.stencilFunc), e.stencilRef !== void 0 && (this.stencilRef = e.stencilRef), e.stencilFuncMask !== void 0 && (this.stencilFuncMask = e.stencilFuncMask), e.stencilFail !== void 0 && (this.stencilFail = e.stencilFail), e.stencilZFail !== void 0 && (this.stencilZFail = e.stencilZFail), e.stencilZPass !== void 0 && (this.stencilZPass = e.stencilZPass), e.stencilWrite !== void 0 && (this.stencilWrite = e.stencilWrite), e.wireframe !== void 0 && (this.wireframe = e.wireframe), e.wireframeLinewidth !== void 0 && (this.wireframeLinewidth = e.wireframeLinewidth), e.wireframeLinecap !== void 0 && (this.wireframeLinecap = e.wireframeLinecap), e.wireframeLinejoin !== void 0 && (this.wireframeLinejoin = e.wireframeLinejoin), e.rotation !== void 0 && (this.rotation = e.rotation), e.linewidth !== void 0 && (this.linewidth = e.linewidth), e.linecap !== void 0 && (this.linecap = e.linecap), e.linejoin !== void 0 && (this.linejoin = e.linejoin), e.dashSize !== void 0 && (this.dashSize = e.dashSize), e.gapSize !== void 0 && (this.gapSize = e.gapSize), e.scale !== void 0 && (this.scale = e.scale), e.polygonOffset !== void 0 && (this.polygonOffset = e.polygonOffset), e.polygonOffsetFactor !== void 0 && (this.polygonOffsetFactor = e.polygonOffsetFactor), e.polygonOffsetUnits !== void 0 && (this.polygonOffsetUnits = e.polygonOffsetUnits), e.dithering !== void 0 && (this.dithering = e.dithering), e.alphaToCoverage !== void 0 && (this.alphaToCoverage = e.alphaToCoverage), e.premultipliedAlpha !== void 0 && (this.premultipliedAlpha = e.premultipliedAlpha), e.forceSinglePass !== void 0 && (this.forceSinglePass = e.forceSinglePass), e.allowOverride !== void 0 && (this.allowOverride = e.allowOverride), e.visible !== void 0 && (this.visible = e.visible), e.toneMapped !== void 0 && (this.toneMapped = e.toneMapped), e.userData !== void 0 && (this.userData = e.userData), e.vertexColors !== void 0 && (this.vertexColors = typeof e.vertexColors == "number" ? e.vertexColors > 0 : e.vertexColors), e.size !== void 0 && (this.size = e.size), e.sizeAttenuation !== void 0 && (this.sizeAttenuation = e.sizeAttenuation), e.map !== void 0 && (this.map = t[e.map] || null), e.matcap !== void 0 && (this.matcap = t[e.matcap] || null), e.alphaMap !== void 0 && (this.alphaMap = t[e.alphaMap] || null), e.bumpMap !== void 0 && (this.bumpMap = t[e.bumpMap] || null), e.bumpScale !== void 0 && (this.bumpScale = e.bumpScale), e.normalMap !== void 0 && (this.normalMap = t[e.normalMap] || null), e.normalMapType !== void 0 && (this.normalMapType = e.normalMapType), e.normalScale !== void 0) {
			let t = e.normalScale;
			Array.isArray(t) === !1 && (t = [t, t]), this.normalScale = new H().fromArray(t);
		}
		return e.displacementMap !== void 0 && (this.displacementMap = t[e.displacementMap] || null), e.displacementScale !== void 0 && (this.displacementScale = e.displacementScale), e.displacementBias !== void 0 && (this.displacementBias = e.displacementBias), e.roughnessMap !== void 0 && (this.roughnessMap = t[e.roughnessMap] || null), e.metalnessMap !== void 0 && (this.metalnessMap = t[e.metalnessMap] || null), e.emissiveMap !== void 0 && (this.emissiveMap = t[e.emissiveMap] || null), e.emissiveIntensity !== void 0 && (this.emissiveIntensity = e.emissiveIntensity), e.specularMap !== void 0 && (this.specularMap = t[e.specularMap] || null), e.specularIntensityMap !== void 0 && (this.specularIntensityMap = t[e.specularIntensityMap] || null), e.specularColorMap !== void 0 && (this.specularColorMap = t[e.specularColorMap] || null), e.envMap !== void 0 && (this.envMap = t[e.envMap] || null), e.envMapRotation !== void 0 && this.envMapRotation.fromArray(e.envMapRotation), e.envMapIntensity !== void 0 && (this.envMapIntensity = e.envMapIntensity), e.reflectivity !== void 0 && (this.reflectivity = e.reflectivity), e.refractionRatio !== void 0 && (this.refractionRatio = e.refractionRatio), e.lightMap !== void 0 && (this.lightMap = t[e.lightMap] || null), e.lightMapIntensity !== void 0 && (this.lightMapIntensity = e.lightMapIntensity), e.aoMap !== void 0 && (this.aoMap = t[e.aoMap] || null), e.aoMapIntensity !== void 0 && (this.aoMapIntensity = e.aoMapIntensity), e.gradientMap !== void 0 && (this.gradientMap = t[e.gradientMap] || null), e.clearcoatMap !== void 0 && (this.clearcoatMap = t[e.clearcoatMap] || null), e.clearcoatRoughnessMap !== void 0 && (this.clearcoatRoughnessMap = t[e.clearcoatRoughnessMap] || null), e.clearcoatNormalMap !== void 0 && (this.clearcoatNormalMap = t[e.clearcoatNormalMap] || null), e.clearcoatNormalScale !== void 0 && (this.clearcoatNormalScale = new H().fromArray(e.clearcoatNormalScale)), e.iridescenceMap !== void 0 && (this.iridescenceMap = t[e.iridescenceMap] || null), e.iridescenceThicknessMap !== void 0 && (this.iridescenceThicknessMap = t[e.iridescenceThicknessMap] || null), e.transmissionMap !== void 0 && (this.transmissionMap = t[e.transmissionMap] || null), e.thicknessMap !== void 0 && (this.thicknessMap = t[e.thicknessMap] || null), e.anisotropyMap !== void 0 && (this.anisotropyMap = t[e.anisotropyMap] || null), e.sheenColorMap !== void 0 && (this.sheenColorMap = t[e.sheenColorMap] || null), e.sheenRoughnessMap !== void 0 && (this.sheenRoughnessMap = t[e.sheenRoughnessMap] || null), this;
	}
	clone() {
		return new this.constructor().copy(this);
	}
	copy(e) {
		this.name = e.name, this.blending = e.blending, this.side = e.side, this.vertexColors = e.vertexColors, this.opacity = e.opacity, this.transparent = e.transparent, this.blendSrc = e.blendSrc, this.blendDst = e.blendDst, this.blendEquation = e.blendEquation, this.blendSrcAlpha = e.blendSrcAlpha, this.blendDstAlpha = e.blendDstAlpha, this.blendEquationAlpha = e.blendEquationAlpha, this.blendColor.copy(e.blendColor), this.blendAlpha = e.blendAlpha, this.depthFunc = e.depthFunc, this.depthTest = e.depthTest, this.depthWrite = e.depthWrite, this.stencilWriteMask = e.stencilWriteMask, this.stencilFunc = e.stencilFunc, this.stencilRef = e.stencilRef, this.stencilFuncMask = e.stencilFuncMask, this.stencilFail = e.stencilFail, this.stencilZFail = e.stencilZFail, this.stencilZPass = e.stencilZPass, this.stencilWrite = e.stencilWrite;
		let t = e.clippingPlanes, n = null;
		if (t !== null) {
			let e = t.length;
			n = Array(e);
			for (let r = 0; r !== e; ++r) n[r] = t[r].clone();
		}
		return this.clippingPlanes = n, this.clipIntersection = e.clipIntersection, this.clipShadows = e.clipShadows, this.shadowSide = e.shadowSide, this.colorWrite = e.colorWrite, this.precision = e.precision, this.polygonOffset = e.polygonOffset, this.polygonOffsetFactor = e.polygonOffsetFactor, this.polygonOffsetUnits = e.polygonOffsetUnits, this.dithering = e.dithering, this.alphaTest = e.alphaTest, this.alphaHash = e.alphaHash, this.alphaToCoverage = e.alphaToCoverage, this.premultipliedAlpha = e.premultipliedAlpha, this.forceSinglePass = e.forceSinglePass, this.allowOverride = e.allowOverride, this.visible = e.visible, this.toneMapped = e.toneMapped, this.userData = JSON.parse(JSON.stringify(e.userData)), this;
	}
	dispose() {
		this.dispatchEvent({ type: "dispose" });
	}
	set needsUpdate(e) {
		e === !0 && this.version++;
	}
}, qn = /*@__PURE__*/ new W(), Jn = /*@__PURE__*/ new W(), Yn = /*@__PURE__*/ new W(), Xn = /*@__PURE__*/ new W(), Zn = class {
	constructor(e = new W(), t = new W(0, 0, -1)) {
		this.origin = e, this.direction = t;
	}
	set(e, t) {
		return this.origin.copy(e), this.direction.copy(t), this;
	}
	copy(e) {
		return this.origin.copy(e.origin), this.direction.copy(e.direction), this;
	}
	at(e, t) {
		return t.copy(this.origin).addScaledVector(this.direction, e);
	}
	lookAt(e) {
		return this.direction.copy(e).sub(this.origin).normalize(), this;
	}
	recast(e) {
		return this.origin.copy(this.at(e, qn)), this;
	}
	closestPointToPoint(e, t) {
		t.subVectors(e, this.origin);
		let n = t.dot(this.direction);
		return n < 0 ? t.copy(this.origin) : t.copy(this.origin).addScaledVector(this.direction, n);
	}
	distanceToPoint(e) {
		return Math.sqrt(this.distanceSqToPoint(e));
	}
	distanceSqToPoint(e) {
		let t = qn.subVectors(e, this.origin).dot(this.direction);
		return t < 0 ? this.origin.distanceToSquared(e) : (qn.copy(this.origin).addScaledVector(this.direction, t), qn.distanceToSquared(e));
	}
	distanceSqToSegment(e, t, n, r) {
		Jn.copy(e).add(t).multiplyScalar(.5), Yn.copy(t).sub(e).normalize(), Xn.copy(this.origin).sub(Jn);
		let i = e.distanceTo(t) * .5, a = -this.direction.dot(Yn), o = Xn.dot(this.direction), s = -Xn.dot(Yn), c = Xn.lengthSq(), l = Math.abs(1 - a * a), u, d, f, p;
		if (l > 0) {
			if (u = a * s - o, d = a * o - s, p = i * l, u >= 0) {
				if (d >= -p) {
					if (d <= p) {
						let e = 1 / l;
						u *= e, d *= e, f = u * (u + a * d + 2 * o) + d * (a * u + d + 2 * s) + c;
					} else d = i, u = Math.max(0, -(a * d + o)), f = -u * u + d * (d + 2 * s) + c;
				} else d = -i, u = Math.max(0, -(a * d + o)), f = -u * u + d * (d + 2 * s) + c;
			} else d <= -p ? (u = Math.max(0, -(-a * i + o)), d = u > 0 ? -i : Math.min(Math.max(-i, -s), i), f = -u * u + d * (d + 2 * s) + c) : d <= p ? (u = 0, d = Math.min(Math.max(-i, -s), i), f = d * (d + 2 * s) + c) : (u = Math.max(0, -(a * i + o)), d = u > 0 ? i : Math.min(Math.max(-i, -s), i), f = -u * u + d * (d + 2 * s) + c);
		} else d = a > 0 ? -i : i, u = Math.max(0, -(a * d + o)), f = -u * u + d * (d + 2 * s) + c;
		return n && n.copy(this.origin).addScaledVector(this.direction, u), r && r.copy(Jn).addScaledVector(Yn, d), f;
	}
	intersectSphere(e, t) {
		if (e.radius < 0) return null;
		qn.subVectors(e.center, this.origin);
		let n = qn.dot(this.direction), r = qn.dot(qn) - n * n, i = e.radius * e.radius;
		if (r > i) return null;
		let a = Math.sqrt(i - r), o = n - a, s = n + a;
		return s < 0 ? null : o < 0 ? this.at(s, t) : this.at(o, t);
	}
	intersectsSphere(e) {
		return e.radius < 0 ? !1 : this.distanceSqToPoint(e.center) <= e.radius * e.radius;
	}
	distanceToPlane(e) {
		let t = e.normal.dot(this.direction);
		if (t === 0) return e.distanceToPoint(this.origin) === 0 ? 0 : null;
		let n = -(this.origin.dot(e.normal) + e.constant) / t;
		return n >= 0 ? n : null;
	}
	intersectPlane(e, t) {
		let n = this.distanceToPlane(e);
		return n === null ? null : this.at(n, t);
	}
	intersectsPlane(e) {
		let t = e.distanceToPoint(this.origin);
		return t === 0 || e.normal.dot(this.direction) * t < 0;
	}
	intersectBox(e, t) {
		let n, r, i, a, o, s, c = 1 / this.direction.x, l = 1 / this.direction.y, u = 1 / this.direction.z, d = this.origin;
		return c >= 0 ? (n = (e.min.x - d.x) * c, r = (e.max.x - d.x) * c) : (n = (e.max.x - d.x) * c, r = (e.min.x - d.x) * c), l >= 0 ? (i = (e.min.y - d.y) * l, a = (e.max.y - d.y) * l) : (i = (e.max.y - d.y) * l, a = (e.min.y - d.y) * l), n > a || i > r || ((i > n || isNaN(n)) && (n = i), (a < r || isNaN(r)) && (r = a), u >= 0 ? (o = (e.min.z - d.z) * u, s = (e.max.z - d.z) * u) : (o = (e.max.z - d.z) * u, s = (e.min.z - d.z) * u), n > s || o > r) || ((o > n || n !== n) && (n = o), (s < r || r !== r) && (r = s), r < 0) ? null : this.at(n >= 0 ? n : r, t);
	}
	intersectsBox(e) {
		return this.intersectBox(e, qn) !== null;
	}
	intersectTriangle(e, t, n, r, i) {
		let a = this.origin, o = this.direction, s = o.x, c = o.y, l = o.z, u = e.x - a.x, d = e.y - a.y, f = e.z - a.z, p = t.x - a.x, m = t.y - a.y, h = t.z - a.z, g = n.x - a.x, _ = n.y - a.y, v = n.z - a.z, y = Math.abs(s), b = Math.abs(c), x = Math.abs(l), S, C, w, T, E, D, O, ee, k, A, j, te;
		if (y >= b && y >= x ? (w = s, D = u, k = p, te = g, s >= 0 ? (S = c, C = l, T = d, E = f, O = m, ee = h, A = _, j = v) : (S = l, C = c, T = f, E = d, O = h, ee = m, A = v, j = _)) : b >= x ? (w = c, D = d, k = m, te = _, c >= 0 ? (S = l, C = s, T = f, E = u, O = h, ee = p, A = v, j = g) : (S = s, C = l, T = u, E = f, O = p, ee = h, A = g, j = v)) : (w = l, D = f, k = h, te = v, l >= 0 ? (S = s, C = c, T = u, E = d, O = p, ee = m, A = g, j = _) : (S = c, C = s, T = d, E = u, O = m, ee = p, A = _, j = g)), w === 0) return null;
		let M = S / w, N = C / w, ne = 1 / w, P = T - M * D, re = E - N * D, F = O - M * k, ie = ee - N * k, ae = A - M * te, oe = j - N * te, se = ae * ie - oe * F, ce = P * oe - re * ae, le = F * re - ie * P;
		if (r) {
			if (se < 0 || ce < 0 || le < 0) return null;
		} else if ((se < 0 || ce < 0 || le < 0) && (se > 0 || ce > 0 || le > 0)) return null;
		let ue = se + ce + le;
		if (ue === 0) return null;
		let de = ne * (se * D + ce * k + le * te);
		return (ue > 0 ? de < 0 : de > 0) ? null : this.at(de / ue, i);
	}
	applyMatrix4(e) {
		return this.origin.applyMatrix4(e), this.direction.transformDirection(e), this;
	}
	equals(e) {
		return e.origin.equals(this.origin) && e.direction.equals(this.direction);
	}
	clone() {
		return new this.constructor().copy(this);
	}
}, Qn = class extends Kn {
	constructor(e) {
		super(), this.isMeshBasicMaterial = !0, this.type = "MeshBasicMaterial", this.color = new J(16777215), this.map = null, this.lightMap = null, this.lightMapIntensity = 1, this.aoMap = null, this.aoMapIntensity = 1, this.specularMap = null, this.alphaMap = null, this.envMap = null, this.envMapRotation = new ht(), this.combine = 0, this.reflectivity = 1, this.refractionRatio = .98, this.wireframe = !1, this.wireframeLinewidth = 1, this.wireframeLinecap = "round", this.wireframeLinejoin = "round", this.fog = !0, this.setValues(e);
	}
	copy(e) {
		return super.copy(e), this.color.copy(e.color), this.map = e.map, this.lightMap = e.lightMap, this.lightMapIntensity = e.lightMapIntensity, this.aoMap = e.aoMap, this.aoMapIntensity = e.aoMapIntensity, this.specularMap = e.specularMap, this.alphaMap = e.alphaMap, this.envMap = e.envMap, this.envMapRotation.copy(e.envMapRotation), this.combine = e.combine, this.reflectivity = e.reflectivity, this.refractionRatio = e.refractionRatio, this.wireframe = e.wireframe, this.wireframeLinewidth = e.wireframeLinewidth, this.wireframeLinecap = e.wireframeLinecap, this.wireframeLinejoin = e.wireframeLinejoin, this.fog = e.fog, this;
	}
}, $n = /*@__PURE__*/ new q(), er = /*@__PURE__*/ new Zn(), tr = /*@__PURE__*/ new kn(), nr = /*@__PURE__*/ new W(), rr = /*@__PURE__*/ new W(), ir = /*@__PURE__*/ new W(), ar = /*@__PURE__*/ new W(), or = /*@__PURE__*/ new W(), sr = /*@__PURE__*/ new W(), cr = /*@__PURE__*/ new W(), lr = /*@__PURE__*/ new W(), ur = class extends Mt {
	constructor(e = new Ln(), t = new Qn()) {
		super(), this.isMesh = !0, this.type = "Mesh", this.geometry = e, this.material = t, this.morphTargetDictionary = void 0, this.morphTargetInfluences = void 0, this.count = 1, this.updateMorphTargets();
	}
	copy(e, t) {
		return super.copy(e, t), e.morphTargetInfluences !== void 0 && (this.morphTargetInfluences = e.morphTargetInfluences.slice()), e.morphTargetDictionary !== void 0 && (this.morphTargetDictionary = Object.assign({}, e.morphTargetDictionary)), this.material = Array.isArray(e.material) ? e.material.slice() : e.material, this.geometry = e.geometry, this;
	}
	updateMorphTargets() {
		let e = this.geometry.morphAttributes, t = Object.keys(e);
		if (t.length > 0) {
			let n = e[t[0]];
			if (n !== void 0) {
				this.morphTargetInfluences = [], this.morphTargetDictionary = {};
				for (let e = 0, t = n.length; e < t; e++) {
					let t = n[e].name || String(e);
					this.morphTargetInfluences.push(0), this.morphTargetDictionary[t] = e;
				}
			}
		}
	}
	getVertexPosition(e, t) {
		let n = this.geometry, r = n.attributes.position, i = n.morphAttributes.position, a = n.morphTargetsRelative;
		t.fromBufferAttribute(r, e);
		let o = this.morphTargetInfluences;
		if (i && o) {
			sr.set(0, 0, 0);
			for (let n = 0, r = i.length; n < r; n++) {
				let r = o[n], s = i[n];
				r !== 0 && (or.fromBufferAttribute(s, e), a ? sr.addScaledVector(or, r) : sr.addScaledVector(or.sub(t), r));
			}
			t.add(sr);
		}
		return t;
	}
	intersectsFrustum(e) {
		return e.intersectsObject(this);
	}
	raycast(e, t) {
		let n = this.geometry, r = this.material, i = this.matrixWorld;
		r !== void 0 && (n.boundingSphere === null && n.computeBoundingSphere(), tr.copy(n.boundingSphere), tr.applyMatrix4(i), er.copy(e.ray).recast(e.near), !(tr.containsPoint(er.origin) === !1 && (er.intersectSphere(tr, nr) === null || er.origin.distanceToSquared(nr) > (e.far - e.near) ** 2)) && ($n.copy(i).invert(), er.copy(e.ray).applyMatrix4($n), (n.boundingBox === null || er.intersectsBox(n.boundingBox) !== !1) && this._computeIntersections(e, t, er)));
	}
	_computeIntersections(e, t, n) {
		let r, i = this.geometry, a = this.material, o = i.index, s = i.attributes.position, c = i.attributes.uv, l = i.attributes.uv1, u = i.attributes.normal, d = i.groups, f = i.drawRange;
		if (o !== null) {
			if (Array.isArray(a)) for (let i = 0, s = d.length; i < s; i++) {
				let s = d[i], p = a[s.materialIndex], m = Math.max(s.start, f.start), h = Math.min(o.count, Math.min(s.start + s.count, f.start + f.count));
				for (let i = m, a = h; i < a; i += 3) {
					let a = o.getX(i), d = o.getX(i + 1), f = o.getX(i + 2);
					r = fr(this, p, e, n, c, l, u, a, d, f), r && (r.faceIndex = Math.floor(i / 3), r.face.materialIndex = s.materialIndex, t.push(r));
				}
			}
			else {
				let i = Math.max(0, f.start), s = Math.min(o.count, f.start + f.count);
				for (let d = i, f = s; d < f; d += 3) {
					let i = o.getX(d), s = o.getX(d + 1), f = o.getX(d + 2);
					r = fr(this, a, e, n, c, l, u, i, s, f), r && (r.faceIndex = Math.floor(d / 3), t.push(r));
				}
			}
		} else if (s !== void 0) {
			if (Array.isArray(a)) for (let i = 0, o = d.length; i < o; i++) {
				let o = d[i], p = a[o.materialIndex], m = Math.max(o.start, f.start), h = Math.min(s.count, Math.min(o.start + o.count, f.start + f.count));
				for (let i = m, a = h; i < a; i += 3) {
					let a = i, s = i + 1, d = i + 2;
					r = fr(this, p, e, n, c, l, u, a, s, d), r && (r.faceIndex = Math.floor(i / 3), r.face.materialIndex = o.materialIndex, t.push(r));
				}
			}
			else {
				let i = Math.max(0, f.start), o = Math.min(s.count, f.start + f.count);
				for (let s = i, d = o; s < d; s += 3) {
					let i = s, o = s + 1, d = s + 2;
					r = fr(this, a, e, n, c, l, u, i, o, d), r && (r.faceIndex = Math.floor(s / 3), t.push(r));
				}
			}
		}
	}
};
function dr(e, t, n, r, i, a, o, s) {
	let c;
	if (c = t.side === 1 ? r.intersectTriangle(o, a, i, !0, s) : r.intersectTriangle(i, a, o, t.side === 0, s), c === null) return null;
	lr.copy(s), lr.applyMatrix4(e.matrixWorld);
	let l = n.ray.origin.distanceTo(lr);
	return l < n.near || l > n.far ? null : {
		distance: l,
		point: lr.clone(),
		object: e
	};
}
function fr(e, t, n, r, i, a, o, s, c, l) {
	e.getVertexPosition(s, rr), e.getVertexPosition(c, ir), e.getVertexPosition(l, ar);
	let u = dr(e, t, n, r, rr, ir, ar, cr);
	if (u) {
		let e = new W();
		nn.getBarycoord(cr, rr, ir, ar, e), i && (u.uv = nn.getInterpolatedAttribute(i, s, c, l, e, new H())), a && (u.uv1 = nn.getInterpolatedAttribute(a, s, c, l, e, new H())), o && (u.normal = nn.getInterpolatedAttribute(o, s, c, l, e, new W()), u.normal.dot(r.direction) > 0 && u.normal.multiplyScalar(-1));
		let t = {
			a: s,
			b: c,
			c: l,
			normal: new W(),
			materialIndex: 0
		};
		nn.getNormal(rr, ir, ar, t.normal), u.face = t, u.barycoord = e;
	}
	return u;
}
var pr = /*@__PURE__*/ new tt(), mr = /*@__PURE__*/ new tt(), hr = /*@__PURE__*/ new tt(), gr = /*@__PURE__*/ new tt(), _r = /*@__PURE__*/ new q(), vr = /*@__PURE__*/ new W(), yr = /*@__PURE__*/ new kn(), br = /*@__PURE__*/ new q(), xr = /*@__PURE__*/ new Zn(), Sr = class extends ur {
	constructor(e, t) {
		super(e, t), this.isSkinnedMesh = !0, this.type = "SkinnedMesh", this.bindMode = "attached", this.bindMatrix = new q(), this.bindMatrixInverse = new q(), this.boundingBox = null, this.boundingSphere = null;
	}
	computeBoundingBox() {
		let e = this.geometry;
		this.boundingBox === null && (this.boundingBox = new rn()), this.boundingBox.makeEmpty();
		let t = e.getAttribute("position");
		for (let e = 0; e < t.count; e++) this.getVertexPosition(e, vr), this.boundingBox.expandByPoint(vr);
	}
	computeBoundingSphere() {
		let e = this.geometry;
		this.boundingSphere === null && (this.boundingSphere = new kn()), this.boundingSphere.makeEmpty();
		let t = e.getAttribute("position");
		for (let e = 0; e < t.count; e++) this.getVertexPosition(e, vr), this.boundingSphere.expandByPoint(vr);
	}
	copy(e, t) {
		return super.copy(e, t), this.bindMode = e.bindMode, this.bindMatrix.copy(e.bindMatrix), this.bindMatrixInverse.copy(e.bindMatrixInverse), this.skeleton = e.skeleton, e.boundingBox !== null && (this.boundingBox = e.boundingBox.clone()), e.boundingSphere !== null && (this.boundingSphere = e.boundingSphere.clone()), this;
	}
	raycast(e, t) {
		let n = this.material, r = this.matrixWorld;
		n !== void 0 && (this.boundingSphere === null && this.computeBoundingSphere(), yr.copy(this.boundingSphere), yr.applyMatrix4(r), e.ray.intersectsSphere(yr) !== !1 && (br.copy(r).invert(), xr.copy(e.ray).applyMatrix4(br), (this.boundingBox === null || xr.intersectsBox(this.boundingBox) !== !1) && this._computeIntersections(e, t, xr)));
	}
	getVertexPosition(e, t) {
		return super.getVertexPosition(e, t), this.applyBoneTransform(e, t), t;
	}
	bind(e, t) {
		this.skeleton = e, t === void 0 && (this.updateMatrixWorld(!0), this.skeleton.calculateInverses(), t = this.matrixWorld), this.bindMatrix.copy(t), this.bindMatrixInverse.copy(t).invert();
	}
	pose() {
		this.skeleton.pose();
	}
	normalizeSkinWeights() {
		let e = new tt(), t = this.geometry.attributes.skinWeight;
		for (let n = 0, r = t.count; n < r; n++) {
			e.fromBufferAttribute(t, n);
			let r = 1 / e.manhattanLength();
			r === Infinity ? e.set(1, 0, 0, 0) : e.multiplyScalar(r), t.setXYZW(n, e.x, e.y, e.z, e.w);
		}
	}
	updateMatrixWorld(e) {
		super.updateMatrixWorld(e), this.bindMode === "attached" ? this.bindMatrixInverse.copy(this.matrixWorld).invert() : this.bindMode === "detached" ? this.bindMatrixInverse.copy(this.bindMatrix).invert() : I("SkinnedMesh: Unrecognized bindMode: " + this.bindMode);
	}
	applyBoneTransform(e, t) {
		let n = this.skeleton, r = this.geometry;
		mr.fromBufferAttribute(r.attributes.skinIndex, e), hr.fromBufferAttribute(r.attributes.skinWeight, e), t.isVector4 ? (pr.copy(t), t.set(0, 0, 0, 0)) : (pr.set(...t, 1), t.set(0, 0, 0)), pr.applyMatrix4(this.bindMatrix);
		for (let e = 0; e < 4; e++) {
			let r = hr.getComponent(e);
			if (r !== 0) {
				let i = mr.getComponent(e);
				_r.multiplyMatrices(n.bones[i].matrixWorld, n.boneInverses[i]), t.addScaledVector(gr.copy(pr).applyMatrix4(_r), r);
			}
		}
		return t.isVector4 && (t.w = pr.w), t.applyMatrix4(this.bindMatrixInverse);
	}
}, Cr = class extends Mt {
	constructor() {
		super(), this.isBone = !0, this.type = "Bone";
	}
}, wr = class extends et {
	constructor(e = null, t = 1, n = 1, i, a, o, s, c, l = r, u = r, d, f) {
		super(null, o, s, c, l, u, i, a, d, f), this.isDataTexture = !0, this.image = {
			data: e,
			width: t,
			height: n
		}, this.generateMipmaps = !1, this.flipY = !1, this.unpackAlignment = 1;
	}
}, Tr = /*@__PURE__*/ new q(), Er = /*@__PURE__*/ new q(), Dr = class e {
	constructor(e = [], t = []) {
		this.uuid = be(), this.bones = e.slice(0), this.boneInverses = t, this.boneMatrices = null, this.boneTexture = null, this.init();
	}
	init() {
		let e = this.bones, t = this.boneInverses;
		if (this.boneMatrices = new Float32Array(e.length * 16), t.length === 0) this.calculateInverses();
		else if (e.length !== t.length) {
			I("Skeleton: Number of inverse bone matrices does not match amount of bones."), this.boneInverses = [];
			for (let e = 0, t = this.bones.length; e < t; e++) this.boneInverses.push(new q());
		}
	}
	calculateInverses() {
		this.boneInverses.length = 0;
		for (let e = 0, t = this.bones.length; e < t; e++) {
			let t = new q();
			this.bones[e] && t.copy(this.bones[e].matrixWorld).invert(), this.boneInverses.push(t);
		}
	}
	pose() {
		for (let e = 0, t = this.bones.length; e < t; e++) {
			let t = this.bones[e];
			t && t.matrixWorld.copy(this.boneInverses[e]).invert();
		}
		for (let e = 0, t = this.bones.length; e < t; e++) {
			let t = this.bones[e];
			t && (t.parent && t.parent.isBone ? (t.matrix.copy(t.parent.matrixWorld).invert(), t.matrix.multiply(t.matrixWorld)) : t.matrix.copy(t.matrixWorld), t.matrix.decompose(t.position, t.quaternion, t.scale));
		}
	}
	update() {
		let e = this.bones, t = this.boneInverses, n = this.boneMatrices, r = this.boneTexture;
		for (let r = 0, i = e.length; r < i; r++) {
			let i = e[r] ? e[r].matrixWorld : Er;
			Tr.multiplyMatrices(i, t[r]), Tr.toArray(n, r * 16);
		}
		r !== null && (r.needsUpdate = !0);
	}
	clone() {
		return new e(this.bones, this.boneInverses);
	}
	computeBoneTexture() {
		let e = Math.sqrt(this.bones.length * 4);
		e = Math.ceil(e / 4) * 4, e = Math.max(e, 4);
		let t = new Float32Array(e * e * 4);
		t.set(this.boneMatrices);
		let n = new wr(t, e, e, _, f);
		return n.needsUpdate = !0, this.boneMatrices = t, this.boneTexture = n, this;
	}
	getBoneByName(e) {
		for (let t = 0, n = this.bones.length; t < n; t++) {
			let n = this.bones[t];
			if (n.name === e) return n;
		}
	}
	dispose() {
		this.boneTexture !== null && (this.boneTexture.dispose(), this.boneTexture = null);
	}
	fromJSON(e, t) {
		this.uuid = e.uuid;
		for (let n = 0, r = e.bones.length; n < r; n++) {
			let r = e.bones[n], i = t[r];
			i === void 0 && (I("Skeleton: No bone found with UUID:", r), i = new Cr()), this.bones.push(i), this.boneInverses.push(new q().fromArray(e.boneInverses[n]));
		}
		return this.init(), this;
	}
	toJSON() {
		let e = {
			metadata: {
				version: 4.7,
				type: "Skeleton",
				generator: "Skeleton.toJSON"
			},
			bones: [],
			boneInverses: []
		};
		e.uuid = this.uuid;
		let t = this.bones, n = this.boneInverses;
		for (let r = 0, i = t.length; r < i; r++) {
			let i = t[r];
			e.bones.push(i.uuid);
			let a = n[r];
			e.boneInverses.push(a.toArray());
		}
		return e;
	}
}, Or = class extends Sn {
	constructor(e, t, n, r = 1) {
		super(e, t, n), this.isInstancedBufferAttribute = !0, this.meshPerAttribute = r;
	}
	copy(e) {
		return super.copy(e), this.meshPerAttribute = e.meshPerAttribute, this;
	}
	toJSON() {
		let e = super.toJSON();
		return e.meshPerAttribute = this.meshPerAttribute, e.isInstancedBufferAttribute = !0, e;
	}
}, kr = /*@__PURE__*/ new q(), Ar = /*@__PURE__*/ new q(), jr = [], Mr = /*@__PURE__*/ new rn(), Nr = /*@__PURE__*/ new q(), Pr = /*@__PURE__*/ new ur(), Fr = /*@__PURE__*/ new kn(), Ir = class extends ur {
	constructor(e, t, n) {
		super(e, t), this.isInstancedMesh = !0, this.instanceMatrix = new Or(new Float32Array(n * 16), 16), this.instanceColor = null, this.morphTexture = null, this.count = n, this.boundingBox = null, this.boundingSphere = null;
		for (let e = 0; e < n; e++) this.setMatrixAt(e, Nr);
	}
	computeBoundingBox() {
		let e = this.geometry, t = this.count;
		this.boundingBox === null && (this.boundingBox = new rn()), e.boundingBox === null && e.computeBoundingBox(), this.boundingBox.makeEmpty();
		for (let n = 0; n < t; n++) this.getMatrixAt(n, kr), Mr.copy(e.boundingBox).applyMatrix4(kr), this.boundingBox.union(Mr);
	}
	computeBoundingSphere() {
		let e = this.geometry, t = this.count;
		this.boundingSphere === null && (this.boundingSphere = new kn()), e.boundingSphere === null && e.computeBoundingSphere(), this.boundingSphere.makeEmpty();
		for (let n = 0; n < t; n++) this.getMatrixAt(n, kr), Fr.copy(e.boundingSphere).applyMatrix4(kr), this.boundingSphere.union(Fr);
	}
	copy(e, t) {
		return super.copy(e, t), this.instanceMatrix.copy(e.instanceMatrix), e.morphTexture !== null && (this.morphTexture = e.morphTexture.clone()), e.instanceColor !== null && (this.instanceColor = e.instanceColor.clone()), this.count = e.count, e.boundingBox !== null && (this.boundingBox = e.boundingBox.clone()), e.boundingSphere !== null && (this.boundingSphere = e.boundingSphere.clone()), this;
	}
	getColorAt(e, t) {
		return this.instanceColor === null ? t.setRGB(1, 1, 1) : t.fromArray(this.instanceColor.array, e * 3);
	}
	getMatrixAt(e, t) {
		return t.fromArray(this.instanceMatrix.array, e * 16);
	}
	getMorphAt(e, t) {
		let n = t.morphTargetInfluences, r = this.morphTexture.source.data.data, i = e * (n.length + 1) + 1;
		for (let e = 0; e < n.length; e++) n[e] = r[i + e];
	}
	raycast(e, t) {
		let n = this.matrixWorld, r = this.count;
		if (Pr.geometry = this.geometry, Pr.material = this.material, Pr.material !== void 0 && (this.boundingSphere === null && this.computeBoundingSphere(), Fr.copy(this.boundingSphere), Fr.applyMatrix4(n), e.ray.intersectsSphere(Fr) !== !1)) for (let i = 0; i < r; i++) {
			this.getMatrixAt(i, kr), Ar.multiplyMatrices(n, kr), Pr.matrixWorld = Ar, Pr.raycast(e, jr);
			for (let e = 0, n = jr.length; e < n; e++) {
				let n = jr[e];
				n.instanceId = i, n.object = this, t.push(n);
			}
			jr.length = 0;
		}
	}
	setColorAt(e, t) {
		return this.instanceColor === null && (this.instanceColor = new Or(new Float32Array(this.instanceMatrix.count * 3).fill(1), 3)), t.toArray(this.instanceColor.array, e * 3), this;
	}
	setMatrixAt(e, t) {
		return t.toArray(this.instanceMatrix.array, e * 16), this;
	}
	setMorphAt(e, t) {
		let n = t.morphTargetInfluences, r = n.length + 1;
		this.morphTexture === null && (this.morphTexture = new wr(new Float32Array(r * this.count), r, this.count, b, f));
		let i = this.morphTexture.source.data.data, a = 0;
		for (let e = 0; e < n.length; e++) a += n[e];
		let o = this.geometry.morphTargetsRelative ? 1 : 1 - a, s = r * e;
		return i[s] = o, i.set(n, s + 1), this;
	}
	updateMorphTargets() {}
	dispose() {
		super.dispose(), this.morphTexture !== null && (this.morphTexture.dispose(), this.morphTexture = null);
	}
}, Lr = /*@__PURE__*/ new kn(), Rr = /*@__PURE__*/ new H(.5, .5), zr = /*@__PURE__*/ new W(), Br = class {
	constructor(e = new Wn(), t = new Wn(), n = new Wn(), r = new Wn(), i = new Wn(), a = new Wn()) {
		this.planes = [
			e,
			t,
			n,
			r,
			i,
			a
		];
	}
	set(e, t, n, r, i, a) {
		let o = this.planes;
		return o[0].copy(e), o[1].copy(t), o[2].copy(n), o[3].copy(r), o[4].copy(i), o[5].copy(a), this;
	}
	copy(e) {
		let t = this.planes;
		for (let n = 0; n < 6; n++) t[n].copy(e.planes[n]);
		return this;
	}
	setFromProjectionMatrix(e, t = ie, n = !1) {
		let r = this.planes, i = e.elements, a = i[0], o = i[1], s = i[2], c = i[3], l = i[4], u = i[5], d = i[6], f = i[7], p = i[8], m = i[9], h = i[10], g = i[11], _ = i[12], v = i[13], y = i[14], b = i[15];
		if (r[0].setComponents(c - a, f - l, g - p, b - _).normalize(), r[1].setComponents(c + a, f + l, g + p, b + _).normalize(), r[2].setComponents(c + o, f + u, g + m, b + v).normalize(), r[3].setComponents(c - o, f - u, g - m, b - v).normalize(), n) r[4].setComponents(s, d, h, y).normalize(), r[5].setComponents(c - s, f - d, g - h, b - y).normalize();
		else if (r[4].setComponents(c - s, f - d, g - h, b - y).normalize(), t === 2e3) r[5].setComponents(c + s, f + d, g + h, b + y).normalize();
		else if (t === 2001) r[5].setComponents(s, d, h, y).normalize();
		else throw Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: " + t);
		return this;
	}
	intersectsObject(e) {
		if (e.boundingSphere !== void 0) e.boundingSphere === null && e.computeBoundingSphere(), Lr.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);
		else {
			let t = e.geometry;
			t.boundingSphere === null && t.computeBoundingSphere(), Lr.copy(t.boundingSphere).applyMatrix4(e.matrixWorld);
		}
		return this.intersectsSphere(Lr);
	}
	intersectsSprite(e) {
		return Lr.center.set(0, 0, 0), Lr.radius = .7071067811865476 + Rr.distanceTo(e.center), Lr.applyMatrix4(e.matrixWorld), this.intersectsSphere(Lr);
	}
	intersectsSphere(e) {
		let t = this.planes, n = e.center, r = -e.radius;
		for (let e = 0; e < 6; e++) if (t[e].distanceToPoint(n) < r) return !1;
		return !0;
	}
	intersectsBox(e) {
		let t = this.planes;
		for (let n = 0; n < 6; n++) {
			let r = t[n];
			if (zr.x = r.normal.x > 0 ? e.max.x : e.min.x, zr.y = r.normal.y > 0 ? e.max.y : e.min.y, zr.z = r.normal.z > 0 ? e.max.z : e.min.z, r.distanceToPoint(zr) < 0) return !1;
		}
		return !0;
	}
	containsPoint(e) {
		let t = this.planes;
		for (let n = 0; n < 6; n++) if (t[n].distanceToPoint(e) < 0) return !1;
		return !0;
	}
	clone() {
		return new this.constructor().copy(this);
	}
}, Vr = class extends Kn {
	constructor(e) {
		super(), this.isLineBasicMaterial = !0, this.type = "LineBasicMaterial", this.color = new J(16777215), this.map = null, this.linewidth = 1, this.linecap = "round", this.linejoin = "round", this.fog = !0, this.setValues(e);
	}
	copy(e) {
		return super.copy(e), this.color.copy(e.color), this.map = e.map, this.linewidth = e.linewidth, this.linecap = e.linecap, this.linejoin = e.linejoin, this.fog = e.fog, this;
	}
}, Hr = /*@__PURE__*/ new W(), Ur = /*@__PURE__*/ new W(), Wr = /*@__PURE__*/ new q(), Gr = /*@__PURE__*/ new Zn(), Kr = /*@__PURE__*/ new kn(), qr = /*@__PURE__*/ new W(), Jr = /*@__PURE__*/ new W(), Yr = class extends Mt {
	constructor(e = new Ln(), t = new Vr()) {
		super(), this.isLine = !0, this.type = "Line", this.geometry = e, this.material = t, this.morphTargetDictionary = void 0, this.morphTargetInfluences = void 0, this.updateMorphTargets();
	}
	copy(e, t) {
		return super.copy(e, t), this.material = Array.isArray(e.material) ? e.material.slice() : e.material, this.geometry = e.geometry, this;
	}
	computeLineDistances() {
		let e = this.geometry;
		if (e.index === null) {
			let t = e.attributes.position, n = [0];
			for (let e = 1, r = t.count; e < r; e++) Hr.fromBufferAttribute(t, e - 1), Ur.fromBufferAttribute(t, e), n[e] = n[e - 1], n[e] += Hr.distanceTo(Ur);
			e.setAttribute("lineDistance", new Tn(n, 1));
		} else I("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");
		return this;
	}
	intersectsFrustum(e) {
		return e.intersectsObject(this);
	}
	raycast(e, t) {
		let n = this.geometry, r = this.matrixWorld, i = e.params.Line.threshold, a = n.drawRange;
		if (n.boundingSphere === null && n.computeBoundingSphere(), Kr.copy(n.boundingSphere), Kr.applyMatrix4(r), Kr.radius += i, e.ray.intersectsSphere(Kr) === !1) return;
		Wr.copy(r).invert(), Gr.copy(e.ray).applyMatrix4(Wr);
		let o = i / ((this.scale.x + this.scale.y + this.scale.z) / 3), s = o * o, c = this.isLineSegments ? 2 : 1, l = n.index, u = n.attributes.position;
		if (l !== null) {
			let n = Math.max(0, a.start), r = Math.min(l.count, a.start + a.count);
			for (let i = n, a = r - 1; i < a; i += c) {
				let n = l.getX(i), r = l.getX(i + 1), a = Xr(this, e, Gr, s, n, r, i);
				a && t.push(a);
			}
			if (this.isLineLoop) {
				let i = l.getX(r - 1), a = l.getX(n), o = Xr(this, e, Gr, s, i, a, r - 1);
				o && t.push(o);
			}
		} else {
			let n = Math.max(0, a.start), r = Math.min(u.count, a.start + a.count);
			for (let i = n, a = r - 1; i < a; i += c) {
				let n = Xr(this, e, Gr, s, i, i + 1, i);
				n && t.push(n);
			}
			if (this.isLineLoop) {
				let i = Xr(this, e, Gr, s, r - 1, n, r - 1);
				i && t.push(i);
			}
		}
	}
	updateMorphTargets() {
		let e = this.geometry.morphAttributes, t = Object.keys(e);
		if (t.length > 0) {
			let n = e[t[0]];
			if (n !== void 0) {
				this.morphTargetInfluences = [], this.morphTargetDictionary = {};
				for (let e = 0, t = n.length; e < t; e++) {
					let t = n[e].name || String(e);
					this.morphTargetInfluences.push(0), this.morphTargetDictionary[t] = e;
				}
			}
		}
	}
};
function Xr(e, t, n, r, i, a, o) {
	let s = e.geometry.attributes.position;
	if (Hr.fromBufferAttribute(s, i), Ur.fromBufferAttribute(s, a), n.distanceSqToSegment(Hr, Ur, qr, Jr) > r) return;
	qr.applyMatrix4(e.matrixWorld);
	let c = t.ray.origin.distanceTo(qr);
	if (!(c < t.near || c > t.far)) return {
		distance: c,
		point: Jr.clone().applyMatrix4(e.matrixWorld),
		index: o,
		face: null,
		faceIndex: null,
		barycoord: null,
		object: e
	};
}
var Zr = /*@__PURE__*/ new W(), Qr = /*@__PURE__*/ new W(), $r = class extends Yr {
	constructor(e, t) {
		super(e, t), this.isLineSegments = !0, this.type = "LineSegments";
	}
	computeLineDistances() {
		let e = this.geometry;
		if (e.index === null) {
			let t = e.attributes.position, n = [];
			for (let e = 0, r = t.count; e < r; e += 2) Zr.fromBufferAttribute(t, e), Qr.fromBufferAttribute(t, e + 1), n[e] = e === 0 ? 0 : n[e - 1], n[e + 1] = n[e] + Zr.distanceTo(Qr);
			e.setAttribute("lineDistance", new Tn(n, 1));
		} else I("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");
		return this;
	}
}, ei = class extends Yr {
	constructor(e, t) {
		super(e, t), this.isLineLoop = !0, this.type = "LineLoop";
	}
}, ti = class extends Kn {
	constructor(e) {
		super(), this.isPointsMaterial = !0, this.type = "PointsMaterial", this.color = new J(16777215), this.map = null, this.alphaMap = null, this.size = 1, this.sizeAttenuation = !0, this.fog = !0, this.setValues(e);
	}
	copy(e) {
		return super.copy(e), this.color.copy(e.color), this.map = e.map, this.alphaMap = e.alphaMap, this.size = e.size, this.sizeAttenuation = e.sizeAttenuation, this.fog = e.fog, this;
	}
}, ni = /*@__PURE__*/ new q(), ri = /*@__PURE__*/ new Zn(), ii = /*@__PURE__*/ new kn(), ai = /*@__PURE__*/ new W(), oi = class extends Mt {
	constructor(e = new Ln(), t = new ti()) {
		super(), this.isPoints = !0, this.type = "Points", this.geometry = e, this.material = t, this.morphTargetDictionary = void 0, this.morphTargetInfluences = void 0, this.updateMorphTargets();
	}
	copy(e, t) {
		return super.copy(e, t), this.material = Array.isArray(e.material) ? e.material.slice() : e.material, this.geometry = e.geometry, this;
	}
	intersectsFrustum(e) {
		return e.intersectsObject(this);
	}
	raycast(e, t) {
		let n = this.geometry, r = this.matrixWorld, i = e.params.Points.threshold, a = n.drawRange;
		if (n.boundingSphere === null && n.computeBoundingSphere(), ii.copy(n.boundingSphere), ii.applyMatrix4(r), ii.radius += i, e.ray.intersectsSphere(ii) === !1) return;
		ni.copy(r).invert(), ri.copy(e.ray).applyMatrix4(ni);
		let o = i / ((this.scale.x + this.scale.y + this.scale.z) / 3), s = o * o, c = n.index, l = n.attributes.position;
		if (c !== null) {
			let n = Math.max(0, a.start), i = Math.min(c.count, a.start + a.count);
			for (let a = n, o = i; a < o; a++) {
				let n = c.getX(a);
				ai.fromBufferAttribute(l, n), si(ai, n, s, r, e, t, this);
			}
		} else {
			let n = Math.max(0, a.start), i = Math.min(l.count, a.start + a.count);
			for (let a = n, o = i; a < o; a++) ai.fromBufferAttribute(l, a), si(ai, a, s, r, e, t, this);
		}
	}
	updateMorphTargets() {
		let e = this.geometry.morphAttributes, t = Object.keys(e);
		if (t.length > 0) {
			let n = e[t[0]];
			if (n !== void 0) {
				this.morphTargetInfluences = [], this.morphTargetDictionary = {};
				for (let e = 0, t = n.length; e < t; e++) {
					let t = n[e].name || String(e);
					this.morphTargetInfluences.push(0), this.morphTargetDictionary[t] = e;
				}
			}
		}
	}
};
function si(e, t, n, r, i, a, o) {
	let s = ri.distanceSqToPoint(e);
	if (s < n) {
		let n = new W();
		ri.closestPointToPoint(e, n), n.applyMatrix4(r);
		let c = i.ray.origin.distanceTo(n);
		if (c < i.near || c > i.far) return;
		a.push({
			distance: c,
			distanceToRay: Math.sqrt(s),
			point: n,
			index: t,
			face: null,
			faceIndex: null,
			barycoord: null,
			object: o
		});
	}
}
var ci = class extends et {
	constructor(e = [], t = 301, n, r, i, a, o, s, c, l) {
		super(e, t, n, r, i, a, o, s, c, l), this.isCubeTexture = !0, this.flipY = !1;
	}
	get images() {
		return this.image;
	}
	set images(e) {
		this.image = e;
	}
}, li = class extends et {
	constructor(e, t, n = d, i, a, o, s = r, c = r, l, u = v, f = 1) {
		if (u !== 1026 && u !== 1027) throw Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");
		super({
			width: e,
			height: t,
			depth: f
		}, i, a, o, s, c, u, n, l), this.isDepthTexture = !0, this.flipY = !1, this.generateMipmaps = !1, this.compareFunction = null;
	}
	copy(e) {
		return super.copy(e), this.source = new Xe(Object.assign({}, e.image)), this.compareFunction = e.compareFunction, this;
	}
	toJSON(e) {
		let t = super.toJSON(e);
		return t.compareFunction = this.compareFunction, t;
	}
}, ui = class extends li {
	constructor(e, t = d, n = 301, i, a, o = r, s = r, c, l = v) {
		let u = {
			width: e,
			height: e,
			depth: 1
		}, f = [
			u,
			u,
			u,
			u,
			u,
			u
		];
		super(e, e, t, n, i, a, o, s, c, l), this.image = f, this.isCubeDepthTexture = !0, this.isCubeTexture = !0;
	}
	get images() {
		return this.image;
	}
	set images(e) {
		this.image = e;
	}
}, di = class extends et {
	constructor(e = null) {
		super(), this.sourceTexture = e, this.isExternalTexture = !0;
	}
	copy(e) {
		return super.copy(e), this.sourceTexture = e.sourceTexture, this;
	}
}, fi = class e extends Ln {
	constructor(e = 1, t = 1, n = 1, r = 1, i = 1, a = 1) {
		super(), this.type = "BoxGeometry", this.parameters = {
			width: e,
			height: t,
			depth: n,
			widthSegments: r,
			heightSegments: i,
			depthSegments: a
		};
		let o = this;
		r = Math.floor(r), i = Math.floor(i), a = Math.floor(a);
		let s = [], c = [], l = [], u = [], d = 0, f = 0;
		p("z", "y", "x", -1, -1, n, t, e, a, i, 0), p("z", "y", "x", 1, -1, n, t, -e, a, i, 1), p("x", "z", "y", 1, 1, e, n, t, r, a, 2), p("x", "z", "y", 1, -1, e, n, -t, r, a, 3), p("x", "y", "z", 1, -1, e, t, n, r, i, 4), p("x", "y", "z", -1, -1, e, t, -n, r, i, 5), this.setIndex(s), this.setAttribute("position", new Tn(c, 3)), this.setAttribute("normal", new Tn(l, 3)), this.setAttribute("uv", new Tn(u, 2));
		function p(e, t, n, r, i, a, p, m, h, g, _) {
			let v = a / h, y = p / g, b = a / 2, x = p / 2, S = m / 2, C = h + 1, w = g + 1, T = 0, E = 0, D = new W();
			for (let a = 0; a < w; a++) {
				let o = a * y - x;
				for (let s = 0; s < C; s++) D[e] = (s * v - b) * r, D[t] = o * i, D[n] = S, c.push(D.x, D.y, D.z), D[e] = 0, D[t] = 0, D[n] = m > 0 ? 1 : -1, l.push(D.x, D.y, D.z), u.push(s / h), u.push(1 - a / g), T += 1;
			}
			for (let e = 0; e < g; e++) for (let t = 0; t < h; t++) {
				let n = d + t + C * e, r = d + t + C * (e + 1), i = d + (t + 1) + C * (e + 1), a = d + (t + 1) + C * e;
				s.push(n, r, a), s.push(r, i, a), E += 6;
			}
			o.addGroup(f, E, _), f += E, d += T;
		}
	}
	copy(e) {
		return super.copy(e), this.parameters = Object.assign({}, e.parameters), this;
	}
	static fromJSON(t) {
		return new e(t.width, t.height, t.depth, t.widthSegments, t.heightSegments, t.depthSegments);
	}
}, pi = class e extends Ln {
	constructor(e = 1, t = 1, n = 1, r = 1) {
		super(), this.type = "PlaneGeometry", this.parameters = {
			width: e,
			height: t,
			widthSegments: n,
			heightSegments: r
		};
		let i = e / 2, a = t / 2, o = Math.floor(n), s = Math.floor(r), c = o + 1, l = s + 1, u = e / o, d = t / s, f = [], p = [], m = [], h = [];
		for (let e = 0; e < l; e++) {
			let t = e * d - a;
			for (let n = 0; n < c; n++) {
				let r = n * u - i;
				p.push(r, -t, 0), m.push(0, 0, 1), h.push(n / o), h.push(1 - e / s);
			}
		}
		for (let e = 0; e < s; e++) for (let t = 0; t < o; t++) {
			let n = t + c * e, r = t + c * (e + 1), i = t + 1 + c * (e + 1), a = t + 1 + c * e;
			f.push(n, r, a), f.push(r, i, a);
		}
		this.setIndex(f), this.setAttribute("position", new Tn(p, 3)), this.setAttribute("normal", new Tn(m, 3)), this.setAttribute("uv", new Tn(h, 2));
	}
	copy(e) {
		return super.copy(e), this.parameters = Object.assign({}, e.parameters), this;
	}
	static fromJSON(t) {
		return new e(t.width, t.height, t.widthSegments, t.heightSegments);
	}
};
function mi(e) {
	let t = {};
	for (let n in e) {
		t[n] = {};
		for (let r in e[n]) {
			let i = e[n][r];
			if (gi(i)) i.isRenderTargetTexture ? (I("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."), t[n][r] = null) : t[n][r] = i.clone();
			else if (Array.isArray(i)) {
				if (gi(i[0])) {
					let e = [];
					for (let t = 0, n = i.length; t < n; t++) e[t] = i[t].clone();
					t[n][r] = e;
				} else t[n][r] = i.slice();
			} else t[n][r] = i;
		}
	}
	return t;
}
function hi(e) {
	let t = {};
	for (let n = 0; n < e.length; n++) {
		let r = mi(e[n]);
		for (let e in r) t[e] = r[e];
	}
	return t;
}
function gi(e) {
	return e && (e.isColor || e.isMatrix3 || e.isMatrix4 || e.isVector2 || e.isVector3 || e.isVector4 || e.isTexture || e.isQuaternion);
}
function _i(e) {
	let t = [];
	for (let n = 0; n < e.length; n++) t.push(e[n].clone());
	return t;
}
function vi(e) {
	let t = e.getRenderTarget();
	return t === null ? e.outputColorSpace : t.isXRRenderTarget === !0 ? t.texture.colorSpace : K.workingColorSpace;
}
var yi = {
	clone: mi,
	merge: hi
}, bi = "void main() {\n	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}", xi = "void main() {\n	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );\n}", Si = class extends Kn {
	constructor(e) {
		super(), this.isShaderMaterial = !0, this.type = "ShaderMaterial", this.defines = {}, this.uniforms = {}, this.uniformsGroups = [], this.vertexShader = bi, this.fragmentShader = xi, this.linewidth = 1, this.wireframe = !1, this.wireframeLinewidth = 1, this.fog = !1, this.lights = !1, this.clipping = !1, this.forceSinglePass = !0, this.extensions = {
			clipCullDistance: !1,
			multiDraw: !1
		}, this.defaultAttributeValues = {
			color: [
				1,
				1,
				1
			],
			uv: [0, 0],
			uv1: [0, 0]
		}, this.index0AttributeName = void 0, this.uniformsNeedUpdate = !1, this.glslVersion = null, e !== void 0 && this.setValues(e);
	}
	copy(e) {
		return super.copy(e), this.fragmentShader = e.fragmentShader, this.vertexShader = e.vertexShader, this.uniforms = mi(e.uniforms), this.uniformsGroups = _i(e.uniformsGroups), this.defines = Object.assign({}, e.defines), this.wireframe = e.wireframe, this.wireframeLinewidth = e.wireframeLinewidth, this.fog = e.fog, this.lights = e.lights, this.clipping = e.clipping, this.extensions = Object.assign({}, e.extensions), this.glslVersion = e.glslVersion, this.defaultAttributeValues = Object.assign({}, e.defaultAttributeValues), this.index0AttributeName = e.index0AttributeName, this.uniformsNeedUpdate = e.uniformsNeedUpdate, this;
	}
	toJSON(e) {
		let t = super.toJSON(e);
		t.glslVersion = this.glslVersion, t.uniforms = {};
		for (let n in this.uniforms) {
			let r = this.uniforms[n].value;
			r && r.isTexture ? t.uniforms[n] = {
				type: "t",
				value: r.toJSON(e).uuid
			} : r && r.isColor ? t.uniforms[n] = {
				type: "c",
				value: r.getHex()
			} : r && r.isVector2 ? t.uniforms[n] = {
				type: "v2",
				value: r.toArray()
			} : r && r.isVector3 ? t.uniforms[n] = {
				type: "v3",
				value: r.toArray()
			} : r && r.isVector4 ? t.uniforms[n] = {
				type: "v4",
				value: r.toArray()
			} : r && r.isMatrix3 ? t.uniforms[n] = {
				type: "m3",
				value: r.toArray()
			} : r && r.isMatrix4 ? t.uniforms[n] = {
				type: "m4",
				value: r.toArray()
			} : t.uniforms[n] = { value: r };
		}
		Object.keys(this.defines).length > 0 && (t.defines = this.defines), t.vertexShader = this.vertexShader, t.fragmentShader = this.fragmentShader, t.lights = this.lights, t.clipping = this.clipping;
		let n = {};
		for (let e in this.extensions) this.extensions[e] === !0 && (n[e] = !0);
		return Object.keys(n).length > 0 && (t.extensions = n), t;
	}
	fromJSON(e, t) {
		if (super.fromJSON(e, t), e.uniforms !== void 0) for (let n in e.uniforms) {
			let r = e.uniforms[n];
			switch (this.uniforms[n] = {}, r.type) {
				case "t":
					this.uniforms[n].value = t[r.value] || null;
					break;
				case "c":
					this.uniforms[n].value = new J().setHex(r.value);
					break;
				case "v2":
					this.uniforms[n].value = new H().fromArray(r.value);
					break;
				case "v3":
					this.uniforms[n].value = new W().fromArray(r.value);
					break;
				case "v4":
					this.uniforms[n].value = new tt().fromArray(r.value);
					break;
				case "m3":
					this.uniforms[n].value = new G().fromArray(r.value);
					break;
				case "m4":
					this.uniforms[n].value = new q().fromArray(r.value);
					break;
				default: this.uniforms[n].value = r.value;
			}
		}
		if (e.defines !== void 0 && (this.defines = e.defines), e.vertexShader !== void 0 && (this.vertexShader = e.vertexShader), e.fragmentShader !== void 0 && (this.fragmentShader = e.fragmentShader), e.glslVersion !== void 0 && (this.glslVersion = e.glslVersion), e.extensions !== void 0) for (let t in e.extensions) this.extensions[t] = e.extensions[t];
		return e.lights !== void 0 && (this.lights = e.lights), e.clipping !== void 0 && (this.clipping = e.clipping), this;
	}
}, Ci = class extends Si {
	constructor(e) {
		super(e), this.isRawShaderMaterial = !0, this.type = "RawShaderMaterial";
	}
}, wi = class extends Kn {
	constructor(e) {
		super(), this.isMeshStandardMaterial = !0, this.type = "MeshStandardMaterial", this.defines = { STANDARD: "" }, this.color = new J(16777215), this.roughness = 1, this.metalness = 0, this.map = null, this.lightMap = null, this.lightMapIntensity = 1, this.aoMap = null, this.aoMapIntensity = 1, this.emissive = new J(0), this.emissiveIntensity = 1, this.emissiveMap = null, this.bumpMap = null, this.bumpScale = 1, this.normalMap = null, this.normalMapType = 0, this.normalScale = new H(1, 1), this.displacementMap = null, this.displacementScale = 1, this.displacementBias = 0, this.roughnessMap = null, this.metalnessMap = null, this.alphaMap = null, this.envMap = null, this.envMapRotation = new ht(), this.envMapIntensity = 1, this.wireframe = !1, this.wireframeLinewidth = 1, this.wireframeLinecap = "round", this.wireframeLinejoin = "round", this.flatShading = !1, this.fog = !0, this.setValues(e);
	}
	copy(e) {
		return super.copy(e), this.defines = { STANDARD: "" }, this.color.copy(e.color), this.roughness = e.roughness, this.metalness = e.metalness, this.map = e.map, this.lightMap = e.lightMap, this.lightMapIntensity = e.lightMapIntensity, this.aoMap = e.aoMap, this.aoMapIntensity = e.aoMapIntensity, this.emissive.copy(e.emissive), this.emissiveMap = e.emissiveMap, this.emissiveIntensity = e.emissiveIntensity, this.bumpMap = e.bumpMap, this.bumpScale = e.bumpScale, this.normalMap = e.normalMap, this.normalMapType = e.normalMapType, this.normalScale.copy(e.normalScale), this.displacementMap = e.displacementMap, this.displacementScale = e.displacementScale, this.displacementBias = e.displacementBias, this.roughnessMap = e.roughnessMap, this.metalnessMap = e.metalnessMap, this.alphaMap = e.alphaMap, this.envMap = e.envMap, this.envMapRotation.copy(e.envMapRotation), this.envMapIntensity = e.envMapIntensity, this.wireframe = e.wireframe, this.wireframeLinewidth = e.wireframeLinewidth, this.wireframeLinecap = e.wireframeLinecap, this.wireframeLinejoin = e.wireframeLinejoin, this.flatShading = e.flatShading, this.fog = e.fog, this;
	}
}, Ti = class extends wi {
	constructor(e) {
		super(), this.isMeshPhysicalMaterial = !0, this.defines = {
			STANDARD: "",
			PHYSICAL: ""
		}, this.type = "MeshPhysicalMaterial", this.anisotropyRotation = 0, this.anisotropyMap = null, this.clearcoatMap = null, this.clearcoatRoughness = 0, this.clearcoatRoughnessMap = null, this.clearcoatNormalScale = new H(1, 1), this.clearcoatNormalMap = null, this.ior = 1.5, Object.defineProperty(this, "reflectivity", {
			get: function() {
				return R(2.5 * (this.ior - 1) / (this.ior + 1), 0, 1);
			},
			set: function(e) {
				this.ior = (1 + .4 * e) / (1 - .4 * e);
			}
		}), this.iridescenceMap = null, this.iridescenceIOR = 1.3, this.iridescenceThicknessRange = [100, 400], this.iridescenceThicknessMap = null, this.sheenColor = new J(0), this.sheenColorMap = null, this.sheenRoughness = 1, this.sheenRoughnessMap = null, this.transmissionMap = null, this.thickness = 0, this.thicknessMap = null, this.attenuationDistance = Infinity, this.attenuationColor = new J(1, 1, 1), this.specularIntensity = 1, this.specularIntensityMap = null, this.specularColor = new J(1, 1, 1), this.specularColorMap = null, this._anisotropy = 0, this._clearcoat = 0, this._dispersion = 0, this._iridescence = 0, this._retroreflectivity = 0, this._sheen = 0, this._transmission = 0, this.setValues(e);
	}
	get anisotropy() {
		return this._anisotropy;
	}
	set anisotropy(e) {
		this._anisotropy > 0 != e > 0 && this.version++, this._anisotropy = e;
	}
	get clearcoat() {
		return this._clearcoat;
	}
	set clearcoat(e) {
		this._clearcoat > 0 != e > 0 && this.version++, this._clearcoat = e;
	}
	get iridescence() {
		return this._iridescence;
	}
	set iridescence(e) {
		this._iridescence > 0 != e > 0 && this.version++, this._iridescence = e;
	}
	get dispersion() {
		return this._dispersion;
	}
	set dispersion(e) {
		this._dispersion > 0 != e > 0 && this.version++, this._dispersion = e;
	}
	get retroreflectivity() {
		return this._retroreflectivity;
	}
	set retroreflectivity(e) {
		this._retroreflectivity > 0 != e > 0 && this.version++, this._retroreflectivity = e;
	}
	get sheen() {
		return this._sheen;
	}
	set sheen(e) {
		this._sheen > 0 != e > 0 && this.version++, this._sheen = e;
	}
	get transmission() {
		return this._transmission;
	}
	set transmission(e) {
		this._transmission > 0 != e > 0 && this.version++, this._transmission = e;
	}
	copy(e) {
		return super.copy(e), this.defines = {
			STANDARD: "",
			PHYSICAL: ""
		}, this.anisotropy = e.anisotropy, this.anisotropyRotation = e.anisotropyRotation, this.anisotropyMap = e.anisotropyMap, this.clearcoat = e.clearcoat, this.clearcoatMap = e.clearcoatMap, this.clearcoatRoughness = e.clearcoatRoughness, this.clearcoatRoughnessMap = e.clearcoatRoughnessMap, this.clearcoatNormalMap = e.clearcoatNormalMap, this.clearcoatNormalScale.copy(e.clearcoatNormalScale), this.dispersion = e.dispersion, this.ior = e.ior, this.iridescence = e.iridescence, this.iridescenceMap = e.iridescenceMap, this.iridescenceIOR = e.iridescenceIOR, this.iridescenceThicknessRange = [...e.iridescenceThicknessRange], this.iridescenceThicknessMap = e.iridescenceThicknessMap, this.retroreflectivity = e.retroreflectivity, this.sheen = e.sheen, this.sheenColor.copy(e.sheenColor), this.sheenColorMap = e.sheenColorMap, this.sheenRoughness = e.sheenRoughness, this.sheenRoughnessMap = e.sheenRoughnessMap, this.transmission = e.transmission, this.transmissionMap = e.transmissionMap, this.thickness = e.thickness, this.thicknessMap = e.thicknessMap, this.attenuationDistance = e.attenuationDistance, this.attenuationColor.copy(e.attenuationColor), this.specularIntensity = e.specularIntensity, this.specularIntensityMap = e.specularIntensityMap, this.specularColor.copy(e.specularColor), this.specularColorMap = e.specularColorMap, this;
	}
}, Ei = class extends Kn {
	constructor(e) {
		super(), this.isMeshNormalMaterial = !0, this.type = "MeshNormalMaterial", this.bumpMap = null, this.bumpScale = 1, this.normalMap = null, this.normalMapType = 0, this.normalScale = new H(1, 1), this.displacementMap = null, this.displacementScale = 1, this.displacementBias = 0, this.wireframe = !1, this.wireframeLinewidth = 1, this.flatShading = !1, this.setValues(e);
	}
	copy(e) {
		return super.copy(e), this.bumpMap = e.bumpMap, this.bumpScale = e.bumpScale, this.normalMap = e.normalMap, this.normalMapType = e.normalMapType, this.normalScale.copy(e.normalScale), this.displacementMap = e.displacementMap, this.displacementScale = e.displacementScale, this.displacementBias = e.displacementBias, this.wireframe = e.wireframe, this.wireframeLinewidth = e.wireframeLinewidth, this.flatShading = e.flatShading, this;
	}
}, Di = class extends Kn {
	constructor(e) {
		super(), this.isMeshDepthMaterial = !0, this.type = "MeshDepthMaterial", this.depthPacking = 3200, this.map = null, this.alphaMap = null, this.displacementMap = null, this.displacementScale = 1, this.displacementBias = 0, this.wireframe = !1, this.wireframeLinewidth = 1, this.setValues(e);
	}
	copy(e) {
		return super.copy(e), this.depthPacking = e.depthPacking, this.map = e.map, this.alphaMap = e.alphaMap, this.displacementMap = e.displacementMap, this.displacementScale = e.displacementScale, this.displacementBias = e.displacementBias, this.wireframe = e.wireframe, this.wireframeLinewidth = e.wireframeLinewidth, this;
	}
}, Oi = class extends Kn {
	constructor(e) {
		super(), this.isMeshDistanceMaterial = !0, this.type = "MeshDistanceMaterial", this.map = null, this.alphaMap = null, this.displacementMap = null, this.displacementScale = 1, this.displacementBias = 0, this.setValues(e);
	}
	copy(e) {
		return super.copy(e), this.map = e.map, this.alphaMap = e.alphaMap, this.displacementMap = e.displacementMap, this.displacementScale = e.displacementScale, this.displacementBias = e.displacementBias, this;
	}
};
function ki(e, t) {
	return !e || e.constructor === t ? e : typeof t.BYTES_PER_ELEMENT == "number" ? new t(e) : Array.prototype.slice.call(e);
}
function Ai(e) {
	return e !== void 0 && e.inTangents !== void 0 && e.outTangents !== void 0;
}
function ji(e) {
	function t(t, n) {
		return e[t] - e[n];
	}
	let n = e.length, r = Array(n);
	for (let e = 0; e !== n; ++e) r[e] = e;
	return r.sort(t), r;
}
function Mi(e, t, n) {
	let r = e.length, i = new e.constructor(r);
	for (let a = 0, o = 0; o !== r; ++a) {
		let r = n[a] * t;
		for (let n = 0; n !== t; ++n) i[o++] = e[r + n];
	}
	return i;
}
function Ni(e, t, n, r) {
	let i = 1, a = e[0];
	for (; a !== void 0 && a[r] === void 0;) a = e[i++];
	if (a === void 0) return;
	let o = a[r];
	if (o !== void 0) {
		if (Array.isArray(o)) do
			o = a[r], o !== void 0 && (t.push(a.time), n.push(...o)), a = e[i++];
		while (a !== void 0);
		else if (o.toArray !== void 0) do
			o = a[r], o !== void 0 && (t.push(a.time), o.toArray(n, n.length)), a = e[i++];
		while (a !== void 0);
		else do
			o = a[r], o !== void 0 && (t.push(a.time), n.push(o)), a = e[i++];
		while (a !== void 0);
	}
}
var Pi = class {
	constructor(e, t, n, r) {
		this.parameterPositions = e, this._cachedIndex = 0, this.resultBuffer = r === void 0 ? new t.constructor(n) : r, this.sampleValues = t, this.valueSize = n, this.settings = null, this.DefaultSettings_ = {};
	}
	evaluate(e) {
		let t = this.parameterPositions, n = this._cachedIndex, r = t[n], i = t[n - 1];
		validate_interval: {
			seek: {
				let a;
				linear_scan: {
					forward_scan: if (!(e < r)) {
						for (let a = n + 2;;) {
							if (r === void 0) {
								if (e < i) break forward_scan;
								return n = t.length, this._cachedIndex = n, this.copySampleValue_(n - 1);
							}
							if (n === a) break;
							if (i = r, r = t[++n], e < r) break seek;
						}
						a = t.length;
						break linear_scan;
					}
					if (!(e >= i)) {
						let o = t[1];
						e < o && (n = 2, i = o);
						for (let a = n - 2;;) {
							if (i === void 0) return this._cachedIndex = 0, this.copySampleValue_(0);
							if (n === a) break;
							if (r = i, i = t[--n - 1], e >= i) break seek;
						}
						a = n, n = 0;
						break linear_scan;
					}
					break validate_interval;
				}
				for (; n < a;) {
					let r = n + a >>> 1;
					e < t[r] ? a = r : n = r + 1;
				}
				if (r = t[n], i = t[n - 1], i === void 0) return this._cachedIndex = 0, this.copySampleValue_(0);
				if (r === void 0) return n = t.length, this._cachedIndex = n, this.copySampleValue_(n - 1);
			}
			this._cachedIndex = n, this.intervalChanged_(n, i, r);
		}
		return this.interpolate_(n, i, e, r);
	}
	getSettings_() {
		return this.settings || this.DefaultSettings_;
	}
	copySampleValue_(e) {
		let t = this.resultBuffer, n = this.sampleValues, r = this.valueSize, i = e * r;
		for (let e = 0; e !== r; ++e) t[e] = n[i + e];
		return t;
	}
	interpolate_() {
		throw Error("THREE.Interpolant: Call to abstract method.");
	}
	intervalChanged_() {}
}, Fi = class extends Pi {
	constructor(e, t, n, r) {
		super(e, t, n, r), this._weightPrev = -0, this._offsetPrev = -0, this._weightNext = -0, this._offsetNext = -0, this.DefaultSettings_ = {
			endingStart: k,
			endingEnd: k
		};
	}
	intervalChanged_(e, t, n) {
		let r = this.parameterPositions, i = e - 2, a = e + 1, o = r[i], s = r[a];
		if (o === void 0) switch (this.getSettings_().endingStart) {
			case A:
				i = e, o = 2 * t - n;
				break;
			case j:
				i = r.length - 2, o = t + r[i] - r[i + 1];
				break;
			default: i = e, o = n;
		}
		if (s === void 0) switch (this.getSettings_().endingEnd) {
			case A:
				a = e, s = 2 * n - t;
				break;
			case j:
				a = 1, s = n + r[1] - r[0];
				break;
			default: a = e - 1, s = t;
		}
		let c = (n - t) * .5, l = this.valueSize;
		this._weightPrev = c / (t - o), this._weightNext = c / (s - n), this._offsetPrev = i * l, this._offsetNext = a * l;
	}
	interpolate_(e, t, n, r) {
		let i = this.resultBuffer, a = this.sampleValues, o = this.valueSize, s = e * o, c = s - o, l = this._offsetPrev, u = this._offsetNext, d = this._weightPrev, f = this._weightNext, p = (n - t) / (r - t), m = p * p, h = m * p, g = -d * h + 2 * d * m - d * p, _ = (1 + d) * h + (-1.5 - 2 * d) * m + (-.5 + d) * p + 1, v = (-1 - f) * h + (1.5 + f) * m + .5 * p, y = f * h - f * m;
		for (let e = 0; e !== o; ++e) i[e] = g * a[l + e] + _ * a[c + e] + v * a[s + e] + y * a[u + e];
		return i;
	}
}, Ii = class extends Pi {
	constructor(e, t, n, r) {
		super(e, t, n, r);
	}
	interpolate_(e, t, n, r) {
		let i = this.resultBuffer, a = this.sampleValues, o = this.valueSize, s = e * o, c = s - o, l = (n - t) / (r - t), u = 1 - l;
		for (let e = 0; e !== o; ++e) i[e] = a[c + e] * u + a[s + e] * l;
		return i;
	}
}, Li = class extends Pi {
	constructor(e, t, n, r) {
		super(e, t, n, r);
	}
	interpolate_(e) {
		return this.copySampleValue_(e - 1);
	}
}, Ri = class extends Pi {
	interpolate_(e, t, n, r) {
		let i = this.resultBuffer, a = this.sampleValues, o = this.valueSize, s = e * o, c = s - o, l = this.inTangents, u = this.outTangents;
		if (!l || !u) {
			let e = (n - t) / (r - t), l = 1 - e;
			for (let t = 0; t !== o; ++t) i[t] = a[c + t] * l + a[s + t] * e;
			return i;
		}
		let d = o * 2, f = e - 1;
		for (let p = 0; p !== o; ++p) {
			let o = a[c + p], m = a[s + p], h = f * d + p * 2, g = u[h], _ = u[h + 1], v = e * d + p * 2, y = l[v], b = l[v + 1], x = Vi(n, t, g, y, r);
			i[p] = zi(x, o, _, b, m);
		}
		return i;
	}
};
function zi(e, t, n, r, i) {
	let a = 1 - e;
	return a * a * a * t + 3 * a * a * e * n + 3 * a * e * e * r + e * e * e * i;
}
function Bi(e, t, n, r, i) {
	let a = 1 - e;
	return 3 * a * a * (n - t) + 6 * a * e * (r - n) + 3 * e * e * (i - r);
}
function Vi(e, t, n, r, i) {
	let a = (e - t) / (i - t);
	for (let o = 0; o < 8; o++) {
		let o = zi(a, t, n, r, i) - e;
		if (Math.abs(o) < 1e-10) break;
		let s = Bi(a, t, n, r, i);
		if (Math.abs(s) < 1e-10) break;
		a = Math.max(0, Math.min(1, a - o / s));
	}
	return a;
}
var Hi = class {
	constructor(e, t, n, r) {
		if (e === void 0) throw Error("THREE.KeyframeTrack: track name is undefined");
		if (t === void 0 || t.length === 0) throw Error("THREE.KeyframeTrack: no keyframes in track named " + e);
		this.name = e, this.times = ki(t, this.TimeBufferType), this.values = ki(n, this.ValueBufferType), this.setInterpolation(r || this.DefaultInterpolation);
	}
	static toJSON(e) {
		let t = e.constructor, n;
		if (t.toJSON !== this.toJSON) n = t.toJSON(e);
		else {
			n = {
				name: e.name,
				times: ki(e.times, Array),
				values: ki(e.values, Array)
			};
			let t = e.getInterpolation();
			t !== e.DefaultInterpolation && (n.interpolation = t), Ai(e.settings) && (n.settings = {
				inTangents: ki(e.settings.inTangents, Array),
				outTangents: ki(e.settings.outTangents, Array)
			});
		}
		return n.type = e.ValueTypeName, n;
	}
	InterpolantFactoryMethodDiscrete(e) {
		return new Li(this.times, this.values, this.getValueSize(), e);
	}
	InterpolantFactoryMethodLinear(e) {
		return new Ii(this.times, this.values, this.getValueSize(), e);
	}
	InterpolantFactoryMethodSmooth(e) {
		return new Fi(this.times, this.values, this.getValueSize(), e);
	}
	InterpolantFactoryMethodBezier(e) {
		let t = new Ri(this.times, this.values, this.getValueSize(), e);
		return this.settings && (t.inTangents = this.settings.inTangents, t.outTangents = this.settings.outTangents), t;
	}
	setInterpolation(e) {
		let t;
		switch (e) {
			case E:
				t = this.InterpolantFactoryMethodDiscrete;
				break;
			case D:
				t = this.InterpolantFactoryMethodLinear;
				break;
			case O:
				t = this.InterpolantFactoryMethodSmooth;
				break;
			case ee: t = this.InterpolantFactoryMethodBezier;
		}
		if (t === void 0) {
			let t = "unsupported interpolation for " + this.ValueTypeName + " keyframe track named " + this.name;
			if (this.createInterpolant === void 0) {
				if (e !== this.DefaultInterpolation) this.setInterpolation(this.DefaultInterpolation);
				else throw Error(t);
			}
			return I("KeyframeTrack:", t), this;
		}
		return this.createInterpolant = t, this;
	}
	getInterpolation() {
		switch (this.createInterpolant) {
			case this.InterpolantFactoryMethodDiscrete: return E;
			case this.InterpolantFactoryMethodLinear: return D;
			case this.InterpolantFactoryMethodSmooth: return O;
			case this.InterpolantFactoryMethodBezier: return ee;
		}
	}
	getValueSize() {
		return this.values.length / this.times.length;
	}
	shift(e) {
		if (e !== 0) {
			let t = this.times;
			for (let n = 0, r = t.length; n !== r; ++n) t[n] += e;
		}
		return this;
	}
	scale(e) {
		if (e !== 1) {
			let t = this.times;
			for (let n = 0, r = t.length; n !== r; ++n) t[n] *= e;
			Ai(this.settings) && (Ui(this.settings.inTangents, e), Ui(this.settings.outTangents, e));
		}
		return this;
	}
	trim(e, t) {
		let n = this.times, r = n.length, i = 0, a = r - 1;
		for (; i !== r && n[i] < e;) ++i;
		for (; a !== -1 && n[a] > t;) --a;
		if (++a, i !== 0 || a !== r) {
			i >= a && (a = Math.max(a, 1), i = a - 1);
			let e = this.getValueSize();
			this.times = n.slice(i, a), this.values = this.values.slice(i * e, a * e);
		}
		return this;
	}
	validate() {
		let e = !0, t = this.getValueSize();
		t - Math.floor(t) !== 0 && (L("KeyframeTrack: Invalid value size in track.", this), e = !1);
		let n = this.times, r = this.values, i = n.length;
		i === 0 && (L("KeyframeTrack: Track is empty.", this), e = !1);
		let a = null;
		for (let t = 0; t !== i; t++) {
			let r = n[t];
			if (typeof r == "number" && isNaN(r)) {
				L("KeyframeTrack: Time is not a valid number.", this, t, r), e = !1;
				break;
			}
			if (a !== null && a > r) {
				L("KeyframeTrack: Out of order keys.", this, t, r, a), e = !1;
				break;
			}
			a = r;
		}
		if (r !== void 0 && oe(r)) for (let t = 0, n = r.length; t !== n; ++t) {
			let n = r[t];
			if (isNaN(n)) {
				L("KeyframeTrack: Value is not a valid number.", this, t, n), e = !1;
				break;
			}
		}
		return e;
	}
	optimize() {
		let e = this.times.slice(), t = this.values.slice(), n = this.getValueSize(), r = this.getInterpolation() === O, i = e.length - 1, a = 1;
		for (let o = 1; o < i; ++o) {
			let i = !1, s = e[o];
			if (s !== e[o + 1] && (o !== 1 || s !== e[0])) {
				if (r) i = !0;
				else {
					let e = o * n, r = e - n, a = e + n;
					for (let o = 0; o !== n; ++o) {
						let n = t[e + o];
						if (n !== t[r + o] || n !== t[a + o]) {
							i = !0;
							break;
						}
					}
				}
			}
			if (i) {
				if (o !== a) {
					e[a] = e[o];
					let r = o * n, i = a * n;
					for (let e = 0; e !== n; ++e) t[i + e] = t[r + e];
				}
				++a;
			}
		}
		if (i > 0) {
			e[a] = e[i];
			for (let e = i * n, r = a * n, o = 0; o !== n; ++o) t[r + o] = t[e + o];
			++a;
		}
		return a === e.length ? (this.times = e, this.values = t) : (this.times = e.slice(0, a), this.values = t.slice(0, a * n)), this;
	}
	clone() {
		let e = this.times.slice(), t = this.values.slice(), n = this.constructor, r = new n(this.name, e, t);
		return r.createInterpolant = this.createInterpolant, Ai(this.settings) && (r.settings = {
			inTangents: this.settings.inTangents.slice(),
			outTangents: this.settings.outTangents.slice()
		}), r;
	}
};
function Ui(e, t) {
	for (let n = 0, r = e.length; n !== r; n += 2) e[n] *= t;
}
Hi.prototype.ValueTypeName = "", Hi.prototype.TimeBufferType = Float32Array, Hi.prototype.ValueBufferType = Float32Array, Hi.prototype.DefaultInterpolation = D;
var Wi = class extends Hi {
	constructor(e, t, n) {
		super(e, t, n);
	}
};
Wi.prototype.ValueTypeName = "bool", Wi.prototype.ValueBufferType = Array, Wi.prototype.DefaultInterpolation = E, Wi.prototype.InterpolantFactoryMethodLinear = void 0, Wi.prototype.InterpolantFactoryMethodSmooth = void 0;
var Gi = class extends Hi {
	constructor(e, t, n, r) {
		super(e, t, n, r);
	}
};
Gi.prototype.ValueTypeName = "color";
var Ki = class extends Hi {
	constructor(e, t, n, r) {
		super(e, t, n, r);
	}
};
Ki.prototype.ValueTypeName = "number";
var qi = class extends Pi {
	constructor(e, t, n, r) {
		super(e, t, n, r);
	}
	interpolate_(e, t, n, r) {
		let i = this.resultBuffer, a = this.sampleValues, o = this.valueSize, s = (n - t) / (r - t), c = e * o;
		for (let e = c + o; c !== e; c += 4) U.slerpFlat(i, 0, a, c - o, a, c, s);
		return i;
	}
}, Ji = class extends Hi {
	constructor(e, t, n, r) {
		super(e, t, n, r);
	}
	InterpolantFactoryMethodLinear(e) {
		return new qi(this.times, this.values, this.getValueSize(), e);
	}
};
Ji.prototype.ValueTypeName = "quaternion", Ji.prototype.InterpolantFactoryMethodSmooth = void 0;
var Yi = class extends Hi {
	constructor(e, t, n) {
		super(e, t, n);
	}
};
Yi.prototype.ValueTypeName = "string", Yi.prototype.ValueBufferType = Array, Yi.prototype.DefaultInterpolation = E, Yi.prototype.InterpolantFactoryMethodLinear = void 0, Yi.prototype.InterpolantFactoryMethodSmooth = void 0;
var Xi = class extends Hi {
	constructor(e, t, n, r) {
		super(e, t, n, r);
	}
};
Xi.prototype.ValueTypeName = "vector";
var Zi = class {
	constructor(e = "", t = -1, n = [], r = te) {
		this.name = e, this.tracks = n, this.duration = t, this.blendMode = r, this.uuid = be(), this.userData = {}, this.duration < 0 && this.resetDuration();
	}
	static parse(e) {
		let t = [], n = e.tracks, r = 1 / (e.fps || 1);
		for (let e = 0, i = n.length; e !== i; ++e) t.push($i(n[e]).scale(r));
		let i = new this(e.name, e.duration, t, e.blendMode);
		return i.uuid = e.uuid, i.userData = JSON.parse(e.userData || "{}"), i;
	}
	static toJSON(e) {
		let t = [], n = e.tracks, r = {
			name: e.name,
			duration: e.duration,
			tracks: t,
			uuid: e.uuid,
			blendMode: e.blendMode,
			userData: JSON.stringify(e.userData)
		};
		for (let e = 0, r = n.length; e !== r; ++e) t.push(Hi.toJSON(n[e]));
		return r;
	}
	static CreateFromMorphTargetSequence(e, t, n, r) {
		let i = t.length, a = [];
		for (let e = 0; e < i; e++) {
			let o = [], s = [];
			o.push((e + i - 1) % i, e, (e + 1) % i), s.push(0, 1, 0);
			let c = ji(o);
			o = Mi(o, 1, c), s = Mi(s, 1, c), !r && o[0] === 0 && (o.push(i), s.push(s[0])), a.push(new Ki(".morphTargetInfluences[" + t[e].name + "]", o, s).scale(1 / n));
		}
		return new this(e, -1, a);
	}
	static findByName(e, t) {
		let n = e;
		if (!Array.isArray(e)) {
			let t = e;
			n = t.geometry && t.geometry.animations || t.animations;
		}
		for (let e = 0; e < n.length; e++) if (n[e].name === t) return n[e];
		return null;
	}
	static CreateClipsFromMorphTargetSequences(e, t, n) {
		let r = {}, i = /^([\w-]*?)([\d]+)$/;
		for (let t = 0, n = e.length; t < n; t++) {
			let n = e[t], a = n.name.match(i);
			if (a && a.length > 1) {
				let e = a[1], t = r[e];
				t || (r[e] = t = []), t.push(n);
			}
		}
		let a = [];
		for (let e in r) a.push(this.CreateFromMorphTargetSequence(e, r[e], t, n));
		return a;
	}
	resetDuration() {
		let e = this.tracks, t = 0;
		for (let n = 0, r = e.length; n !== r; ++n) {
			let e = this.tracks[n];
			t = Math.max(t, e.times[e.times.length - 1]);
		}
		return this.duration = t, this;
	}
	trim() {
		for (let e = 0; e < this.tracks.length; e++) this.tracks[e].trim(0, this.duration);
		return this;
	}
	validate() {
		let e = !0;
		for (let t = 0; t < this.tracks.length; t++) e &&= this.tracks[t].validate();
		return e;
	}
	optimize() {
		for (let e = 0; e < this.tracks.length; e++) this.tracks[e].optimize();
		return this;
	}
	clone() {
		let e = [];
		for (let t = 0; t < this.tracks.length; t++) e.push(this.tracks[t].clone());
		let t = new this.constructor(this.name, this.duration, e, this.blendMode);
		return t.userData = JSON.parse(JSON.stringify(this.userData)), t;
	}
	toJSON() {
		return this.constructor.toJSON(this);
	}
};
function Qi(e) {
	switch (e.toLowerCase()) {
		case "scalar":
		case "double":
		case "float":
		case "number":
		case "integer": return Ki;
		case "vector":
		case "vector2":
		case "vector3":
		case "vector4": return Xi;
		case "color": return Gi;
		case "quaternion": return Ji;
		case "bool":
		case "boolean": return Wi;
		case "string": return Yi;
	}
	throw Error("THREE.KeyframeTrack: Unsupported typeName: " + e);
}
function $i(e) {
	if (e.type === void 0) throw Error("THREE.KeyframeTrack: track type undefined, can not parse");
	let t = Qi(e.type);
	if (e.times === void 0) {
		let t = [], n = [];
		Ni(e.keys, t, n, "value"), e.times = t, e.values = n;
	}
	let n;
	return n = t.parse === void 0 ? new t(e.name, e.times, e.values, e.interpolation) : t.parse(e), Ai(e.settings) && (n.settings = {
		inTangents: ki(e.settings.inTangents, Float32Array),
		outTangents: ki(e.settings.outTangents, Float32Array)
	}), n;
}
var ea = {
	enabled: !1,
	files: {},
	add: function(e, t) {
		this.enabled !== !1 && (ta(e) || (this.files[e] = t));
	},
	get: function(e) {
		if (this.enabled !== !1 && !ta(e)) return this.files[e];
	},
	remove: function(e) {
		delete this.files[e];
	},
	clear: function() {
		this.files = {};
	}
};
function ta(e) {
	try {
		let t = e.slice(e.indexOf(":") + 1);
		return new URL(t).protocol === "blob:";
	} catch {
		return !1;
	}
}
var na = /*@__PURE__*/ new class {
	constructor(e, t, n) {
		let r = this, i = !1, a = 0, o = 0, s, c = [];
		this.onStart = void 0, this.onLoad = e, this.onProgress = t, this.onError = n, this._abortController = null, this.itemStart = function(e) {
			o++, i === !1 && r.onStart !== void 0 && r.onStart(e, a, o), i = !0;
		}, this.itemEnd = function(e) {
			a++, r.onProgress !== void 0 && r.onProgress(e, a, o), a === o && (i = !1, r.onLoad !== void 0 && r.onLoad());
		}, this.itemError = function(e) {
			r.onError !== void 0 && r.onError(e);
		}, this.resolveURL = function(e) {
			return e = e.normalize("NFC"), s ? s(e) : e;
		}, this.setURLModifier = function(e) {
			return s = e, this;
		}, this.addHandler = function(e, t) {
			return c.push(e, t), this;
		}, this.removeHandler = function(e) {
			let t = c.indexOf(e);
			return t !== -1 && c.splice(t, 2), this;
		}, this.getHandler = function(e) {
			for (let t = 0, n = c.length; t < n; t += 2) {
				let n = c[t], r = c[t + 1];
				if (n.global && (n.lastIndex = 0), n.test(e)) return r;
			}
			return null;
		}, this.abort = function() {
			return this.abortController.abort(), this._abortController = null, this;
		};
	}
	get abortController() {
		return this._abortController ||= new AbortController(), this._abortController;
	}
}(), ra = class {
	constructor(e) {
		this.manager = e === void 0 ? na : e, this.crossOrigin = "anonymous", this.withCredentials = !1, this.path = "", this.resourcePath = "", this.requestHeader = {}, typeof __THREE_DEVTOOLS__ < "u" && __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe", { detail: this }));
	}
	load() {}
	loadAsync(e, t) {
		let n = this;
		return new Promise(function(r, i) {
			n.load(e, r, t, i);
		});
	}
	parse() {}
	setCrossOrigin(e) {
		return this.crossOrigin = e, this;
	}
	setWithCredentials(e) {
		return this.withCredentials = e, this;
	}
	setPath(e) {
		return this.path = e, this;
	}
	setResourcePath(e) {
		return this.resourcePath = e, this;
	}
	setRequestHeader(e) {
		return this.requestHeader = e, this;
	}
	abort() {
		return this;
	}
};
ra.DEFAULT_MATERIAL_NAME = "__DEFAULT";
var ia = {}, aa = class extends Error {
	constructor(e, t) {
		super(e), this.response = t;
	}
}, oa = class extends ra {
	constructor(e) {
		super(e), this.mimeType = "", this.responseType = "", this._abortController = new AbortController();
	}
	load(e, t, n, r) {
		e === void 0 && (e = ""), this.path !== void 0 && (e = this.path + e), e = this.manager.resolveURL(e);
		let i = ea.get(`file:${e}`);
		if (i !== void 0) {
			this.manager.itemStart(e), setTimeout(() => {
				t && t(i), this.manager.itemEnd(e);
			}, 0);
			return;
		}
		if (ia[e] !== void 0) {
			ia[e].push({
				onLoad: t,
				onProgress: n,
				onError: r
			});
			return;
		}
		ia[e] = [], ia[e].push({
			onLoad: t,
			onProgress: n,
			onError: r
		});
		let a = new Request(e, {
			headers: new Headers(this.requestHeader),
			credentials: this.withCredentials ? "include" : "same-origin",
			signal: typeof AbortSignal.any == "function" ? AbortSignal.any([this._abortController.signal, this.manager.abortController.signal]) : this._abortController.signal
		}), o = this.mimeType, s = this.responseType;
		fetch(a).then((t) => {
			if (t.status === 200 || t.status === 0) {
				if (t.status === 0 && I("FileLoader: HTTP Status 0 received."), typeof ReadableStream > "u" || t.body === void 0 || t.body.getReader === void 0) return t;
				let n = ia[e], r = t.body.getReader(), i = t.headers.get("X-File-Size") || t.headers.get("Content-Length"), a = i ? parseInt(i) : 0, o = a !== 0, s = 0, c = new ReadableStream({ start(e) {
					t();
					function t() {
						r.read().then(({ done: r, value: i }) => {
							if (r) e.close();
							else {
								s += i.byteLength;
								let r = new ProgressEvent("progress", {
									lengthComputable: o,
									loaded: s,
									total: a
								});
								for (let e = 0, t = n.length; e < t; e++) {
									let t = n[e];
									t.onProgress && t.onProgress(r);
								}
								e.enqueue(i), t();
							}
						}, (t) => {
							e.error(t);
						});
					}
				} });
				return new Response(c);
			}
			throw new aa(`fetch for "${t.url}" responded with ${t.status}: ${t.statusText}`, t);
		}).then((e) => {
			switch (s) {
				case "arraybuffer": return e.arrayBuffer();
				case "blob": return e.blob();
				case "document": return e.text().then((e) => new DOMParser().parseFromString(e, o));
				case "json": return e.json();
				default:
					if (o === "") return e.text();
					{
						let t = /charset="?([^;"\s]*)"?/i.exec(o), n = t && t[1] ? t[1].toLowerCase() : void 0, r = new TextDecoder(n);
						return e.arrayBuffer().then((e) => r.decode(e));
					}
			}
		}).then((t) => {
			ea.add(`file:${e}`, t);
			let n = ia[e];
			delete ia[e];
			for (let e = 0, r = n.length; e < r; e++) {
				let r = n[e];
				r.onLoad && r.onLoad(t);
			}
		}).catch((t) => {
			let n = ia[e];
			if (n === void 0) throw this.manager.itemError(e), t;
			delete ia[e];
			for (let e = 0, r = n.length; e < r; e++) {
				let r = n[e];
				r.onError && r.onError(t);
			}
			this.manager.itemError(e);
		}).finally(() => {
			this.manager.itemEnd(e);
		}), this.manager.itemStart(e);
	}
	setResponseType(e) {
		return this.responseType = e, this;
	}
	setMimeType(e) {
		return this.mimeType = e, this;
	}
	abort() {
		return this._abortController.abort(), this._abortController = new AbortController(), this;
	}
}, sa = /* @__PURE__ */ new WeakMap(), ca = class extends ra {
	constructor(e) {
		super(e);
	}
	load(e, t, n, r) {
		this.path !== void 0 && (e = this.path + e), e = this.manager.resolveURL(e);
		let i = this, a = ea.get(`image:${e}`);
		if (a !== void 0) {
			if (a.complete === !0) i.manager.itemStart(e), setTimeout(function() {
				t && t(a), i.manager.itemEnd(e);
			}, 0);
			else {
				let e = sa.get(a);
				e === void 0 && (e = [], sa.set(a, e)), e.push({
					onLoad: t,
					onError: r
				});
			}
			return a;
		}
		let o = se("img");
		function s() {
			l(), t && t(this);
			let n = sa.get(this) || [];
			for (let e = 0; e < n.length; e++) {
				let t = n[e];
				t.onLoad && t.onLoad(this);
			}
			sa.delete(this), i.manager.itemEnd(e);
		}
		function c(t) {
			l(), r && r(t), ea.remove(`image:${e}`);
			let n = sa.get(this) || [];
			for (let e = 0; e < n.length; e++) {
				let r = n[e];
				r.onError && r.onError(t);
			}
			sa.delete(this), i.manager.itemError(e), i.manager.itemEnd(e);
		}
		function l() {
			o.removeEventListener("load", s, !1), o.removeEventListener("error", c, !1);
		}
		return o.addEventListener("load", s, !1), o.addEventListener("error", c, !1), e.slice(0, 5) !== "data:" && this.crossOrigin !== void 0 && (o.crossOrigin = this.crossOrigin), ea.add(`image:${e}`, o), i.manager.itemStart(e), o.src = e, o;
	}
}, la = class extends ra {
	constructor(e) {
		super(e);
	}
	load(e, t, n, r) {
		let i = new et(), a = new ca(this.manager);
		return a.setCrossOrigin(this.crossOrigin), a.setPath(this.path), a.load(e, function(e) {
			i.image = e, i.needsUpdate = !0, t !== void 0 && t(i);
		}, n, r), i;
	}
}, ua = class extends Mt {
	constructor(e, t = 1) {
		super(), this.isLight = !0, this.type = "Light", this.color = new J(e), this.intensity = t;
	}
	copy(e, t) {
		return super.copy(e, t), this.color.copy(e.color), this.intensity = e.intensity, this;
	}
	toJSON(e) {
		let t = super.toJSON(e);
		return t.object.color = this.color.getHex(), t.object.intensity = this.intensity, t;
	}
}, da = class extends ua {
	constructor(e, t, n) {
		super(e, n), this.isHemisphereLight = !0, this.type = "HemisphereLight", this.position.copy(Mt.DEFAULT_UP), this.updateMatrix(), this.groundColor = new J(t);
	}
	copy(e, t) {
		return super.copy(e, t), this.groundColor.copy(e.groundColor), this;
	}
	toJSON(e) {
		let t = super.toJSON(e);
		return t.object.groundColor = this.groundColor.getHex(), t;
	}
}, fa = /*@__PURE__*/ new q(), pa = /*@__PURE__*/ new W(), ma = /*@__PURE__*/ new W(), ha = class {
	constructor(e) {
		this.camera = e, this.intensity = 1, this.bias = 0, this.biasNode = null, this.normalBias = 0, this.radius = 1, this.blurSamples = 8, this.mapSize = new H(512, 512), this.mapType = l, this.map = null, this.mapPass = null, this.matrix = new q(), this.autoUpdate = !0, this.needsUpdate = !1, this._frustum = new Br(), this._frameExtents = new H(1, 1), this._viewportCount = 1, this._viewports = [new tt(0, 0, 1, 1)];
	}
	getViewportCount() {
		return this._viewportCount;
	}
	getCamera() {
		return this.camera;
	}
	getFrustum() {
		return this._frustum;
	}
	updateMatrices(e) {
		let t = this.camera;
		pa.setFromMatrixPosition(e.matrixWorld), t.position.copy(pa), ma.setFromMatrixPosition(e.target.matrixWorld), t.lookAt(ma), t.updateMatrixWorld(), this._updateMatrix(t, this.matrix, this._frustum);
	}
	_updateMatrix(e, t, n, r) {
		fa.multiplyMatrices(e.projectionMatrix, e.matrixWorldInverse), n.setFromProjectionMatrix(fa, e.coordinateSystem, e.reversedDepth);
		let i = this._frameExtents, a = r ? r.z / i.x : 1, o = r ? r.w / i.y : 1, s = r ? r.x / i.x : 0, c = r ? r.y / i.y : 0;
		e.coordinateSystem === 2001 || e.reversedDepth ? t.set(.5 * a, 0, 0, .5 * a + s, 0, .5 * o, 0, .5 * o + c, 0, 0, 1, 0, 0, 0, 0, 1) : t.set(.5 * a, 0, 0, .5 * a + s, 0, .5 * o, 0, .5 * o + c, 0, 0, .5, .5, 0, 0, 0, 1), t.multiply(fa);
	}
	getViewport(e) {
		return this._viewports[e];
	}
	getFrameExtents() {
		return this._frameExtents;
	}
	dispose() {
		this.map && this.map.dispose(), this.mapPass && this.mapPass.dispose();
	}
	copy(e) {
		return this.camera = e.camera.clone(), this.intensity = e.intensity, this.bias = e.bias, this.radius = e.radius, this.autoUpdate = e.autoUpdate, this.needsUpdate = e.needsUpdate, this.normalBias = e.normalBias, this.blurSamples = e.blurSamples, this.mapSize.copy(e.mapSize), this.biasNode = e.biasNode, this;
	}
	clone() {
		return new this.constructor().copy(this);
	}
	toJSON() {
		let e = {};
		return e.intensity = this.intensity, e.bias = this.bias, e.normalBias = this.normalBias, e.radius = this.radius, e.blurSamples = this.blurSamples, e.mapSize = this.mapSize.toArray(), e.camera = this.camera.toJSON(!1).object, delete e.camera.matrix, e;
	}
}, ga = /*@__PURE__*/ new W(), _a = /*@__PURE__*/ new U(), va = /*@__PURE__*/ new W(), ya = class extends Mt {
	constructor() {
		super(), this.isCamera = !0, this.type = "Camera", this.matrixWorldInverse = new q(), this.projectionMatrix = new q(), this.projectionMatrixInverse = new q(), this.coordinateSystem = ie, this._reversedDepth = !1;
	}
	get reversedDepth() {
		return this._reversedDepth;
	}
	copy(e, t) {
		return super.copy(e, t), this.matrixWorldInverse.copy(e.matrixWorldInverse), this.projectionMatrix.copy(e.projectionMatrix), this.projectionMatrixInverse.copy(e.projectionMatrixInverse), this.coordinateSystem = e.coordinateSystem, this;
	}
	getWorldDirection(e) {
		return super.getWorldDirection(e).negate();
	}
	updateMatrixWorld(e) {
		super.updateMatrixWorld(e), this.matrixWorld.decompose(ga, _a, va), va.x === 1 && va.y === 1 && va.z === 1 ? this.matrixWorldInverse.copy(this.matrixWorld).invert() : this.matrixWorldInverse.compose(ga, _a, va.set(1, 1, 1)).invert();
	}
	updateWorldMatrix(e, t, n = !1) {
		super.updateWorldMatrix(e, t, n), this.matrixWorld.decompose(ga, _a, va), va.x === 1 && va.y === 1 && va.z === 1 ? this.matrixWorldInverse.copy(this.matrixWorld).invert() : this.matrixWorldInverse.compose(ga, _a, va.set(1, 1, 1)).invert();
	}
	clone() {
		return new this.constructor().copy(this);
	}
}, ba = /*@__PURE__*/ new W(), xa = /*@__PURE__*/ new H(), Sa = /*@__PURE__*/ new H(), Ca = class extends ya {
	constructor(e = 50, t = 1, n = .1, r = 2e3) {
		super(), this.isPerspectiveCamera = !0, this.type = "PerspectiveCamera", this.fov = e, this.zoom = 1, this.near = n, this.far = r, this.focus = 10, this.aspect = t, this.view = null, this.filmGauge = 35, this.filmOffset = 0, this.updateProjectionMatrix();
	}
	copy(e, t) {
		return super.copy(e, t), this.fov = e.fov, this.zoom = e.zoom, this.near = e.near, this.far = e.far, this.focus = e.focus, this.aspect = e.aspect, this.view = e.view === null ? null : Object.assign({}, e.view), this.filmGauge = e.filmGauge, this.filmOffset = e.filmOffset, this;
	}
	setFocalLength(e) {
		let t = .5 * this.getFilmHeight() / e;
		this.fov = ye * 2 * Math.atan(t), this.updateProjectionMatrix();
	}
	getFocalLength() {
		let e = Math.tan(ve * .5 * this.fov);
		return .5 * this.getFilmHeight() / e;
	}
	getEffectiveFOV() {
		return ye * 2 * Math.atan(Math.tan(ve * .5 * this.fov) / this.zoom);
	}
	getFilmWidth() {
		return this.filmGauge * Math.min(this.aspect, 1);
	}
	getFilmHeight() {
		return this.filmGauge / Math.max(this.aspect, 1);
	}
	getViewBounds(e, t, n) {
		ba.set(-1, -1, .5).applyMatrix4(this.projectionMatrixInverse), t.set(ba.x, ba.y).multiplyScalar(-e / ba.z), ba.set(1, 1, .5).applyMatrix4(this.projectionMatrixInverse), n.set(ba.x, ba.y).multiplyScalar(-e / ba.z);
	}
	getViewSize(e, t) {
		return this.getViewBounds(e, xa, Sa), t.subVectors(Sa, xa);
	}
	setViewOffset(e, t, n, r, i, a) {
		this.aspect = e / t, this.view === null && (this.view = {
			enabled: !0,
			fullWidth: 1,
			fullHeight: 1,
			offsetX: 0,
			offsetY: 0,
			width: 1,
			height: 1
		}), this.view.enabled = !0, this.view.fullWidth = e, this.view.fullHeight = t, this.view.offsetX = n, this.view.offsetY = r, this.view.width = i, this.view.height = a, this.updateProjectionMatrix();
	}
	clearViewOffset() {
		this.view !== null && (this.view.enabled = !1), this.updateProjectionMatrix();
	}
	updateProjectionMatrix() {
		let e = this.near, t = e * Math.tan(ve * .5 * this.fov) / this.zoom, n = 2 * t, r = this.aspect * n, i = -.5 * r, a = this.view;
		if (this.view !== null && this.view.enabled) {
			let e = a.fullWidth, o = a.fullHeight;
			i += a.offsetX * r / e, t -= a.offsetY * n / o, r *= a.width / e, n *= a.height / o;
		}
		let o = this.filmOffset;
		o !== 0 && (i += e * o / this.getFilmWidth()), this.projectionMatrix.makePerspective(i, i + r, t, t - n, e, this.far, this.coordinateSystem, this.reversedDepth), this.projectionMatrixInverse.copy(this.projectionMatrix).invert();
	}
	toJSON(e) {
		let t = super.toJSON(e);
		return t.object.fov = this.fov, t.object.zoom = this.zoom, t.object.near = this.near, t.object.far = this.far, t.object.focus = this.focus, t.object.aspect = this.aspect, this.view !== null && (t.object.view = Object.assign({}, this.view)), t.object.filmGauge = this.filmGauge, t.object.filmOffset = this.filmOffset, t;
	}
}, wa = class extends ha {
	constructor() {
		super(new Ca(50, 1, .5, 500)), this.isSpotLightShadow = !0, this.focus = 1, this.aspect = 1;
	}
	updateMatrices(e) {
		let t = this.camera, n = ye * 2 * e.angle * this.focus, r = this.mapSize.width / this.mapSize.height * this.aspect, i = e.distance || t.far;
		(n !== t.fov || r !== t.aspect || i !== t.far) && (t.fov = n, t.aspect = r, t.far = i, t.updateProjectionMatrix()), super.updateMatrices(e);
	}
	copy(e) {
		return super.copy(e), this.focus = e.focus, this.aspect = e.aspect, this;
	}
	toJSON() {
		let e = super.toJSON();
		return e.focus = this.focus, e.aspect = this.aspect, e;
	}
}, Ta = class extends ua {
	constructor(e, t, n = 0, r = Math.PI / 3, i = 0, a = 2) {
		super(e, t), this.isSpotLight = !0, this.type = "SpotLight", this.position.copy(Mt.DEFAULT_UP), this.updateMatrix(), this.target = new Mt(), this.distance = n, this.angle = r, this.penumbra = i, this.decay = a, this.map = null, this.shadow = new wa();
	}
	get power() {
		return this.intensity * Math.PI;
	}
	set power(e) {
		this.intensity = e / Math.PI;
	}
	dispose() {
		super.dispose(), this.shadow.dispose();
	}
	copy(e, t) {
		return super.copy(e, t), this.distance = e.distance, this.angle = e.angle, this.penumbra = e.penumbra, this.decay = e.decay, this.target = e.target.clone(), this.map = e.map, this.shadow = e.shadow.clone(), this;
	}
	toJSON(e) {
		let t = super.toJSON(e);
		return t.object.distance = this.distance, t.object.angle = this.angle, t.object.decay = this.decay, t.object.penumbra = this.penumbra, t.object.target = this.target.uuid, this.map && this.map.isTexture && (t.object.map = this.map.toJSON(e).uuid), t.object.shadow = this.shadow.toJSON(), t;
	}
}, Ea = class extends ha {
	constructor() {
		super(new Ca(90, 1, .5, 500)), this.isPointLightShadow = !0;
	}
}, Da = class extends ua {
	constructor(e, t, n = 0, r = 2) {
		super(e, t), this.isPointLight = !0, this.type = "PointLight", this.distance = n, this.decay = r, this.shadow = new Ea();
	}
	get power() {
		return this.intensity * 4 * Math.PI;
	}
	set power(e) {
		this.intensity = e / (4 * Math.PI);
	}
	dispose() {
		super.dispose(), this.shadow.dispose();
	}
	copy(e, t) {
		return super.copy(e, t), this.distance = e.distance, this.decay = e.decay, this.shadow = e.shadow.clone(), this;
	}
	toJSON(e) {
		let t = super.toJSON(e);
		return t.object.distance = this.distance, t.object.decay = this.decay, t.object.shadow = this.shadow.toJSON(), t;
	}
}, Oa = class extends ya {
	constructor(e = -1, t = 1, n = 1, r = -1, i = .1, a = 2e3) {
		super(), this.isOrthographicCamera = !0, this.type = "OrthographicCamera", this.zoom = 1, this.view = null, this.left = e, this.right = t, this.top = n, this.bottom = r, this.near = i, this.far = a, this.updateProjectionMatrix();
	}
	copy(e, t) {
		return super.copy(e, t), this.left = e.left, this.right = e.right, this.top = e.top, this.bottom = e.bottom, this.near = e.near, this.far = e.far, this.zoom = e.zoom, this.view = e.view === null ? null : Object.assign({}, e.view), this;
	}
	setViewOffset(e, t, n, r, i, a) {
		this.view === null && (this.view = {
			enabled: !0,
			fullWidth: 1,
			fullHeight: 1,
			offsetX: 0,
			offsetY: 0,
			width: 1,
			height: 1
		}), this.view.enabled = !0, this.view.fullWidth = e, this.view.fullHeight = t, this.view.offsetX = n, this.view.offsetY = r, this.view.width = i, this.view.height = a, this.updateProjectionMatrix();
	}
	clearViewOffset() {
		this.view !== null && (this.view.enabled = !1), this.updateProjectionMatrix();
	}
	updateProjectionMatrix() {
		let e = (this.right - this.left) / (2 * this.zoom), t = (this.top - this.bottom) / (2 * this.zoom), n = (this.right + this.left) / 2, r = (this.top + this.bottom) / 2, i = n - e, a = n + e, o = r + t, s = r - t;
		if (this.view !== null && this.view.enabled) {
			let e = (this.right - this.left) / this.view.fullWidth / this.zoom, t = (this.top - this.bottom) / this.view.fullHeight / this.zoom;
			i += e * this.view.offsetX, a = i + e * this.view.width, o -= t * this.view.offsetY, s = o - t * this.view.height;
		}
		this.projectionMatrix.makeOrthographic(i, a, o, s, this.near, this.far, this.coordinateSystem, this.reversedDepth), this.projectionMatrixInverse.copy(this.projectionMatrix).invert();
	}
	toJSON(e) {
		let t = super.toJSON(e);
		return t.object.zoom = this.zoom, t.object.left = this.left, t.object.right = this.right, t.object.top = this.top, t.object.bottom = this.bottom, t.object.near = this.near, t.object.far = this.far, this.view !== null && (t.object.view = Object.assign({}, this.view)), t;
	}
}, ka = class extends ha {
	constructor() {
		super(new Oa(-5, 5, 5, -5, .5, 500)), this.isDirectionalLightShadow = !0;
	}
}, Aa = class extends ua {
	constructor(e, t) {
		super(e, t), this.isDirectionalLight = !0, this.type = "DirectionalLight", this.position.copy(Mt.DEFAULT_UP), this.updateMatrix(), this.target = new Mt(), this.shadow = new ka();
	}
	dispose() {
		super.dispose(), this.shadow.dispose();
	}
	copy(e) {
		return super.copy(e), this.target = e.target.clone(), this.shadow = e.shadow.clone(), this;
	}
	toJSON(e) {
		let t = super.toJSON(e);
		return t.object.shadow = this.shadow.toJSON(), t.object.target = this.target.uuid, t;
	}
}, ja = class {
	static extractUrlBase(e) {
		let t = e.lastIndexOf("/");
		return t === -1 ? "./" : e.slice(0, t + 1);
	}
	static resolveURL(e, t) {
		return typeof e != "string" || e === "" ? "" : (/^https?:\/\//i.test(t) && /^\//.test(e) && (t = t.replace(/(^https?:\/\/[^\/]+).*/i, "$1")), /^(https?:)?\/\//i.test(e) || /^data:.*,.*$/i.test(e) || /^blob:.*$/i.test(e) ? e : t + e);
	}
}, Ma = /* @__PURE__ */ new WeakMap(), Na = class extends ra {
	constructor(e) {
		super(e), this.isImageBitmapLoader = !0, typeof createImageBitmap > "u" && I("ImageBitmapLoader: createImageBitmap() not supported."), typeof fetch > "u" && I("ImageBitmapLoader: fetch() not supported."), this.options = { premultiplyAlpha: "none" }, this._abortController = new AbortController();
	}
	setOptions(e) {
		return this.options = e, this;
	}
	load(e, t, n, r) {
		e === void 0 && (e = ""), this.path !== void 0 && (e = this.path + e), e = this.manager.resolveURL(e);
		let i = this, a = ea.get(`image-bitmap:${e}`);
		if (a !== void 0) {
			if (i.manager.itemStart(e), a.then) {
				a.then((n) => {
					Ma.has(a) === !0 ? (r && r(Ma.get(a)), i.manager.itemError(e), i.manager.itemEnd(e)) : (t && t(n), i.manager.itemEnd(e));
				});
				return;
			}
			setTimeout(function() {
				t && t(a), i.manager.itemEnd(e);
			}, 0);
			return;
		}
		let o = {};
		o.credentials = this.crossOrigin === "anonymous" ? "same-origin" : "include", o.headers = this.requestHeader, o.signal = typeof AbortSignal.any == "function" ? AbortSignal.any([this._abortController.signal, this.manager.abortController.signal]) : this._abortController.signal;
		let s = fetch(e, o).then(function(e) {
			return e.blob();
		}).then(function(e) {
			return createImageBitmap(e, Object.assign({}, i.options, { colorSpaceConversion: "none" }));
		}).then(function(n) {
			return ea.add(`image-bitmap:${e}`, n), t && t(n), i.manager.itemEnd(e), n;
		}).catch(function(t) {
			r && r(t), Ma.set(s, t), ea.remove(`image-bitmap:${e}`), i.manager.itemError(e), i.manager.itemEnd(e);
		});
		ea.add(`image-bitmap:${e}`, s), i.manager.itemStart(e);
	}
	abort() {
		return this._abortController.abort(), this._abortController = new AbortController(), this;
	}
}, Pa = -90, Fa = 1, Ia = class extends Mt {
	constructor(e, t, n) {
		super(), this.type = "CubeCamera", this.renderTarget = n, this.coordinateSystem = null, this.activeMipmapLevel = 0;
		let r = new Ca(Pa, Fa, e, t);
		r.layers = this.layers, this.add(r);
		let i = new Ca(Pa, Fa, e, t);
		i.layers = this.layers, this.add(i);
		let a = new Ca(Pa, Fa, e, t);
		a.layers = this.layers, this.add(a);
		let o = new Ca(Pa, Fa, e, t);
		o.layers = this.layers, this.add(o);
		let s = new Ca(Pa, Fa, e, t);
		s.layers = this.layers, this.add(s);
		let c = new Ca(Pa, Fa, e, t);
		c.layers = this.layers, this.add(c);
	}
	updateCoordinateSystem() {
		let e = this.coordinateSystem, t = this.children.concat(), [n, r, i, a, o, s] = t;
		for (let e of t) this.remove(e);
		if (e === 2e3) n.up.set(0, 1, 0), n.lookAt(1, 0, 0), r.up.set(0, 1, 0), r.lookAt(-1, 0, 0), i.up.set(0, 0, -1), i.lookAt(0, 1, 0), a.up.set(0, 0, 1), a.lookAt(0, -1, 0), o.up.set(0, 1, 0), o.lookAt(0, 0, 1), s.up.set(0, 1, 0), s.lookAt(0, 0, -1);
		else if (e === 2001) n.up.set(0, -1, 0), n.lookAt(-1, 0, 0), r.up.set(0, -1, 0), r.lookAt(1, 0, 0), i.up.set(0, 0, 1), i.lookAt(0, 1, 0), a.up.set(0, 0, -1), a.lookAt(0, -1, 0), o.up.set(0, -1, 0), o.lookAt(0, 0, 1), s.up.set(0, -1, 0), s.lookAt(0, 0, -1);
		else throw Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: " + e);
		for (let e of t) this.add(e), e.updateMatrixWorld();
	}
	update(e, t) {
		this.parent === null && this.updateMatrixWorld();
		let { renderTarget: n, activeMipmapLevel: r } = this;
		this.coordinateSystem !== e.coordinateSystem && (this.coordinateSystem = e.coordinateSystem, this.updateCoordinateSystem());
		let [i, a, o, s, c, l] = this.children, u = e.getRenderTarget(), d = e.getActiveCubeFace(), f = e.getActiveMipmapLevel(), p = e.xr.enabled;
		e.xr.enabled = !1;
		let m = n.texture.generateMipmaps;
		n.texture.generateMipmaps = !1;
		let h = !1;
		h = e.isWebGLRenderer === !0 ? e.state.buffers.depth.getReversed() : e.reversedDepthBuffer, e.setRenderTarget(n, 0, r), h && e.autoClear === !1 && e.clearDepth(), e.render(t, i), e.setRenderTarget(n, 1, r), h && e.autoClear === !1 && e.clearDepth(), e.render(t, a), e.setRenderTarget(n, 2, r), h && e.autoClear === !1 && e.clearDepth(), e.render(t, o), e.setRenderTarget(n, 3, r), h && e.autoClear === !1 && e.clearDepth(), e.render(t, s), e.setRenderTarget(n, 4, r), h && e.autoClear === !1 && e.clearDepth(), e.render(t, c), n.texture.generateMipmaps = m, e.setRenderTarget(n, 5, r), h && e.autoClear === !1 && e.clearDepth(), e.render(t, l), e.setRenderTarget(u, d, f), e.xr.enabled = p, n.texture.needsPMREMUpdate = !0;
	}
}, La = class extends Ca {
	constructor(e = []) {
		super(), this.isArrayCamera = !0, this.isMultiViewCamera = !1, this.cameras = e;
	}
}, Ra = class {
	constructor() {
		this._previousTime = 0, this._currentTime = 0, this._startTime = performance.now(), this._delta = 0, this._elapsed = 0, this._timescale = 1, this._document = null, this._pageVisibilityHandler = null;
	}
	connect(e) {
		this._document = e, e.hidden !== void 0 && (this._pageVisibilityHandler = za.bind(this), e.addEventListener("visibilitychange", this._pageVisibilityHandler, !1));
	}
	disconnect() {
		this._pageVisibilityHandler !== null && (this._document.removeEventListener("visibilitychange", this._pageVisibilityHandler), this._pageVisibilityHandler = null), this._document = null;
	}
	getDelta() {
		return this._delta / 1e3;
	}
	getElapsed() {
		return this._elapsed / 1e3;
	}
	getTimescale() {
		return this._timescale;
	}
	setTimescale(e) {
		return this._timescale = e, this;
	}
	reset() {
		return this._currentTime = performance.now() - this._startTime, this;
	}
	dispose() {
		this.disconnect();
	}
	update(e) {
		return this._pageVisibilityHandler !== null && this._document.hidden === !0 ? this._delta = 0 : (this._previousTime = this._currentTime, this._currentTime = (e === void 0 ? performance.now() : e) - this._startTime, this._delta = (this._currentTime - this._previousTime) * this._timescale, this._elapsed += this._delta), this;
	}
};
function za() {
	this._document.hidden === !1 && this.reset();
}
var Ba = class {
	constructor(e, t, n) {
		this.binding = e, this.valueSize = n;
		let r, i, a;
		switch (t) {
			case "quaternion":
				r = this._slerp, i = this._slerpAdditive, a = this._setAdditiveIdentityQuaternion, this.buffer = new Float64Array(n * 6), this._workIndex = 5;
				break;
			case "string":
			case "bool":
				r = this._select, i = this._select, a = this._setAdditiveIdentityOther, this.buffer = Array(n * 5);
				break;
			default: r = this._lerp, i = this._lerpAdditive, a = this._setAdditiveIdentityNumeric, this.buffer = new Float64Array(n * 5);
		}
		this._mixBufferRegion = r, this._mixBufferRegionAdditive = i, this._setIdentity = a, this._origIndex = 3, this._addIndex = 4, this.cumulativeWeight = 0, this.cumulativeWeightAdditive = 0, this.useCount = 0, this.referenceCount = 0;
	}
	accumulate(e, t) {
		let n = this.buffer, r = this.valueSize, i = e * r + r, a = this.cumulativeWeight;
		if (a === 0) {
			for (let e = 0; e !== r; ++e) n[i + e] = n[e];
			a = t;
		} else {
			a += t;
			let e = t / a;
			this._mixBufferRegion(n, i, 0, e, r);
		}
		this.cumulativeWeight = a;
	}
	accumulateAdditive(e) {
		let t = this.buffer, n = this.valueSize, r = n * this._addIndex;
		this.cumulativeWeightAdditive === 0 && this._setIdentity(), this._mixBufferRegionAdditive(t, r, 0, e, n), this.cumulativeWeightAdditive += e;
	}
	apply(e) {
		let t = this.valueSize, n = this.buffer, r = e * t + t, i = this.cumulativeWeight, a = this.cumulativeWeightAdditive, o = this.binding;
		if (this.cumulativeWeight = 0, this.cumulativeWeightAdditive = 0, i < 1) {
			let e = t * this._origIndex;
			this._mixBufferRegion(n, r, e, 1 - i, t);
		}
		a > 0 && this._mixBufferRegionAdditive(n, r, this._addIndex * t, 1, t);
		for (let e = t, i = t + t; e !== i; ++e) if (n[e] !== n[e + t]) {
			o.setValue(n, r);
			break;
		}
	}
	saveOriginalState() {
		let e = this.binding, t = this.buffer, n = this.valueSize, r = n * this._origIndex;
		e.getValue(t, r);
		for (let e = n, i = r; e !== i; ++e) t[e] = t[r + e % n];
		this._setIdentity(), this.cumulativeWeight = 0, this.cumulativeWeightAdditive = 0;
	}
	restoreOriginalState() {
		let e = this.valueSize * 3;
		this.binding.setValue(this.buffer, e);
	}
	_setAdditiveIdentityNumeric() {
		let e = this._addIndex * this.valueSize, t = e + this.valueSize;
		for (let n = e; n < t; n++) this.buffer[n] = 0;
	}
	_setAdditiveIdentityQuaternion() {
		this._setAdditiveIdentityNumeric(), this.buffer[this._addIndex * this.valueSize + 3] = 1;
	}
	_setAdditiveIdentityOther() {
		let e = this._origIndex * this.valueSize, t = this._addIndex * this.valueSize;
		for (let n = 0; n < this.valueSize; n++) this.buffer[t + n] = this.buffer[e + n];
	}
	_select(e, t, n, r, i) {
		if (r >= .5) for (let r = 0; r !== i; ++r) e[t + r] = e[n + r];
	}
	_slerp(e, t, n, r) {
		U.slerpFlat(e, t, e, t, e, n, r);
	}
	_slerpAdditive(e, t, n, r, i) {
		let a = this._workIndex * i;
		U.multiplyQuaternionsFlat(e, a, e, t, e, n), U.slerpFlat(e, t, e, t, e, a, r);
	}
	_lerp(e, t, n, r, i) {
		let a = 1 - r;
		for (let o = 0; o !== i; ++o) {
			let i = t + o;
			e[i] = e[i] * a + e[n + o] * r;
		}
	}
	_lerpAdditive(e, t, n, r, i) {
		for (let a = 0; a !== i; ++a) {
			let i = t + a;
			e[i] = e[i] + e[n + a] * r;
		}
	}
}, Va = "\\[\\]\\.:\\/", Ha = /* @__PURE__ */ RegExp("[\\[\\]\\.:\\/]", "g"), Ua = "[^\\[\\]\\.:\\/]", Wa = "[^" + Va.replace("\\.", "") + "]", Ga = /*@__PURE__*/ "((?:WC+[\\/:])*)".replace("WC", Ua), Ka = /*@__PURE__*/ "(WCOD+)?".replace("WCOD", Wa), qa = /*@__PURE__*/ "(?:\\.(WC+)(?:\\[(.+)\\])?)?".replace("WC", Ua), Ja = /*@__PURE__*/ "\\.(WC+)(?:\\[(.+)\\])?".replace("WC", Ua), Ya = RegExp("^" + Ga + Ka + qa + Ja + "$"), Xa = [
	"material",
	"materials",
	"bones",
	"map"
], Za = class {
	constructor(e, t, n) {
		let r = n || Qa.parseTrackName(t);
		this._targetGroup = e, this._bindings = e.subscribe_(t, r);
	}
	getValue(e, t) {
		this.bind();
		let n = this._targetGroup.nCachedObjects_, r = this._bindings[n];
		r !== void 0 && r.getValue(e, t);
	}
	setValue(e, t) {
		let n = this._bindings;
		for (let r = this._targetGroup.nCachedObjects_, i = n.length; r !== i; ++r) n[r].setValue(e, t);
	}
	bind() {
		let e = this._bindings;
		for (let t = this._targetGroup.nCachedObjects_, n = e.length; t !== n; ++t) e[t].bind();
	}
	unbind() {
		let e = this._bindings;
		for (let t = this._targetGroup.nCachedObjects_, n = e.length; t !== n; ++t) e[t].unbind();
	}
}, Qa = class e {
	constructor(t, n, r) {
		this.path = n, this.parsedPath = r || e.parseTrackName(n), this.node = e.findNode(t, this.parsedPath.nodeName), this.rootNode = t, this.getValue = this._getValue_unbound, this.setValue = this._setValue_unbound;
	}
	static create(t, n, r) {
		return t && t.isAnimationObjectGroup ? new e.Composite(t, n, r) : new e(t, n, r);
	}
	static sanitizeNodeName(e) {
		return e.replace(/\s/g, "_").replace(Ha, "");
	}
	static parseTrackName(e) {
		let t = Ya.exec(e);
		if (t === null) throw Error("THREE.PropertyBinding: Cannot parse trackName: " + e);
		let n = {
			nodeName: t[2],
			objectName: t[3],
			objectIndex: t[4],
			propertyName: t[5],
			propertyIndex: t[6]
		}, r = n.nodeName && n.nodeName.lastIndexOf(".");
		if (r !== void 0 && r !== -1) {
			let e = n.nodeName.substring(r + 1);
			Xa.indexOf(e) !== -1 && (n.nodeName = n.nodeName.substring(0, r), n.objectName = e);
		}
		if (n.propertyName === null || n.propertyName.length === 0) throw Error("THREE.PropertyBinding: can not parse propertyName from trackName: " + e);
		return n;
	}
	static findNode(e, t) {
		if (t === void 0 || t === "" || t === "." || t === -1 || t === e.name || t === e.uuid) return e;
		if (e.skeleton) {
			let n = e.skeleton.getBoneByName(t);
			if (n !== void 0) return n;
		}
		if (e.children) {
			let n = function(e) {
				for (let r = 0; r < e.length; r++) {
					let i = e[r];
					if (i.name === t || i.uuid === t) return i;
					let a = n(i.children);
					if (a) return a;
				}
				return null;
			}, r = n(e.children);
			if (r) return r;
		}
		return null;
	}
	_getValue_unavailable() {}
	_setValue_unavailable() {}
	_getValue_direct(e, t) {
		e[t] = this.targetObject[this.propertyName];
	}
	_getValue_array(e, t) {
		let n = this.resolvedProperty;
		for (let r = 0, i = n.length; r !== i; ++r) e[t++] = n[r];
	}
	_getValue_arrayElement(e, t) {
		e[t] = this.resolvedProperty[this.propertyIndex];
	}
	_getValue_toArray(e, t) {
		this.resolvedProperty.toArray(e, t);
	}
	_setValue_direct(e, t) {
		this.targetObject[this.propertyName] = e[t];
	}
	_setValue_direct_setNeedsUpdate(e, t) {
		this.targetObject[this.propertyName] = e[t], this.targetObject.needsUpdate = !0;
	}
	_setValue_direct_setMatrixWorldNeedsUpdate(e, t) {
		this.targetObject[this.propertyName] = e[t], this.targetObject.matrixWorldNeedsUpdate = !0;
	}
	_setValue_array(e, t) {
		let n = this.resolvedProperty;
		for (let r = 0, i = n.length; r !== i; ++r) n[r] = e[t++];
	}
	_setValue_array_setNeedsUpdate(e, t) {
		let n = this.resolvedProperty;
		for (let r = 0, i = n.length; r !== i; ++r) n[r] = e[t++];
		this.targetObject.needsUpdate = !0;
	}
	_setValue_array_setMatrixWorldNeedsUpdate(e, t) {
		let n = this.resolvedProperty;
		for (let r = 0, i = n.length; r !== i; ++r) n[r] = e[t++];
		this.targetObject.matrixWorldNeedsUpdate = !0;
	}
	_setValue_arrayElement(e, t) {
		this.resolvedProperty[this.propertyIndex] = e[t];
	}
	_setValue_arrayElement_setNeedsUpdate(e, t) {
		this.resolvedProperty[this.propertyIndex] = e[t], this.targetObject.needsUpdate = !0;
	}
	_setValue_arrayElement_setMatrixWorldNeedsUpdate(e, t) {
		this.resolvedProperty[this.propertyIndex] = e[t], this.targetObject.matrixWorldNeedsUpdate = !0;
	}
	_setValue_fromArray(e, t) {
		this.resolvedProperty.fromArray(e, t);
	}
	_setValue_fromArray_setNeedsUpdate(e, t) {
		this.resolvedProperty.fromArray(e, t), this.targetObject.needsUpdate = !0;
	}
	_setValue_fromArray_setMatrixWorldNeedsUpdate(e, t) {
		this.resolvedProperty.fromArray(e, t), this.targetObject.matrixWorldNeedsUpdate = !0;
	}
	_getValue_unbound(e, t) {
		this.bind(), this.getValue(e, t);
	}
	_setValue_unbound(e, t) {
		this.bind(), this.setValue(e, t);
	}
	bind() {
		let t = this.node, n = this.parsedPath, r = n.objectName, i = n.propertyName, a = n.propertyIndex;
		if (t || (t = e.findNode(this.rootNode, n.nodeName), this.node = t), this.getValue = this._getValue_unavailable, this.setValue = this._setValue_unavailable, !t) {
			I("PropertyBinding: No target node found for track: " + this.path + ".");
			return;
		}
		if (r) {
			let e = n.objectIndex;
			switch (r) {
				case "materials":
					if (!t.material) {
						L("PropertyBinding: Can not bind to material as node does not have a material.", this);
						return;
					}
					if (!t.material.materials) {
						L("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.", this);
						return;
					}
					t = t.material.materials;
					break;
				case "bones":
					if (!t.skeleton) {
						L("PropertyBinding: Can not bind to bones as node does not have a skeleton.", this);
						return;
					}
					t = t.skeleton.bones;
					for (let n = 0; n < t.length; n++) if (t[n].name === e) {
						e = n;
						break;
					}
					break;
				case "map":
					if ("map" in t) {
						t = t.map;
						break;
					}
					if (!t.material) {
						L("PropertyBinding: Can not bind to material as node does not have a material.", this);
						return;
					}
					if (!t.material.map) {
						L("PropertyBinding: Can not bind to material.map as node.material does not have a map.", this);
						return;
					}
					t = t.material.map;
					break;
				default:
					if (t[r] === void 0) {
						L("PropertyBinding: Can not bind to objectName of node undefined.", this);
						return;
					}
					t = t[r];
			}
			if (e !== void 0) {
				if (t[e] === void 0) {
					L("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.", this, t);
					return;
				}
				t = t[e];
			}
		}
		let o = t[i];
		if (o === void 0) {
			let e = n.nodeName;
			L("PropertyBinding: Trying to update property for track: " + e + "." + i + " but it wasn't found.", t);
			return;
		}
		let s = this.Versioning.None;
		this.targetObject = t, t.isMaterial === !0 ? s = this.Versioning.NeedsUpdate : t.isObject3D === !0 && (s = this.Versioning.MatrixWorldNeedsUpdate);
		let c = this.BindingType.Direct;
		if (a !== void 0) {
			if (i === "morphTargetInfluences") {
				if (!t.geometry) {
					L("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.", this);
					return;
				}
				if (!t.geometry.morphAttributes) {
					L("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.", this);
					return;
				}
				t.morphTargetDictionary[a] !== void 0 && (a = t.morphTargetDictionary[a]);
			}
			c = this.BindingType.ArrayElement, this.resolvedProperty = o, this.propertyIndex = a;
		} else o.fromArray !== void 0 && o.toArray !== void 0 ? (c = this.BindingType.HasFromToArray, this.resolvedProperty = o) : Array.isArray(o) ? (c = this.BindingType.EntireArray, this.resolvedProperty = o) : this.propertyName = i;
		this.getValue = this.GetterByBindingType[c], this.setValue = this.SetterByBindingTypeAndVersioning[c][s];
	}
	unbind() {
		this.node = null, this.getValue = this._getValue_unbound, this.setValue = this._setValue_unbound;
	}
};
Qa.Composite = Za, Qa.prototype.BindingType = {
	Direct: 0,
	EntireArray: 1,
	ArrayElement: 2,
	HasFromToArray: 3
}, Qa.prototype.Versioning = {
	None: 0,
	NeedsUpdate: 1,
	MatrixWorldNeedsUpdate: 2
}, Qa.prototype.GetterByBindingType = [
	Qa.prototype._getValue_direct,
	Qa.prototype._getValue_array,
	Qa.prototype._getValue_arrayElement,
	Qa.prototype._getValue_toArray
], Qa.prototype.SetterByBindingTypeAndVersioning = [
	[
		Qa.prototype._setValue_direct,
		Qa.prototype._setValue_direct_setNeedsUpdate,
		Qa.prototype._setValue_direct_setMatrixWorldNeedsUpdate
	],
	[
		Qa.prototype._setValue_array,
		Qa.prototype._setValue_array_setNeedsUpdate,
		Qa.prototype._setValue_array_setMatrixWorldNeedsUpdate
	],
	[
		Qa.prototype._setValue_arrayElement,
		Qa.prototype._setValue_arrayElement_setNeedsUpdate,
		Qa.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate
	],
	[
		Qa.prototype._setValue_fromArray,
		Qa.prototype._setValue_fromArray_setNeedsUpdate,
		Qa.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate
	]
];
var $a = class {
	constructor(e, t, n = null, r = t.blendMode) {
		this._mixer = e, this._clip = t, this._localRoot = n, this.blendMode = r;
		let i = t.tracks, a = i.length, o = Array(a), s = {
			endingStart: k,
			endingEnd: k
		};
		for (let e = 0; e !== a; ++e) {
			let t = i[e].createInterpolant(null);
			o[e] = t, t.settings = s;
		}
		this._interpolantSettings = s, this._interpolants = o, this._propertyBindings = Array(a), this._cacheIndex = null, this._byClipCacheIndex = null, this._timeScaleInterpolant = null, this._restoreTimeScale = null, this._weightInterpolant = null, this.loop = 2201, this._loopCount = -1, this._startTime = null, this.time = 0, this.timeScale = 1, this._effectiveTimeScale = 1, this.weight = 1, this._effectiveWeight = 1, this.repetitions = Infinity, this.paused = !1, this.enabled = !0, this.clampWhenFinished = !1, this.zeroSlopeAtStart = !0, this.zeroSlopeAtEnd = !0;
	}
	play() {
		return this._mixer._activateAction(this), this;
	}
	stop() {
		return this._mixer._deactivateAction(this), this.reset();
	}
	reset() {
		return this.paused = !1, this.enabled = !0, this.time = 0, this._loopCount = -1, this._startTime = null, this.stopFading().stopWarping();
	}
	isRunning() {
		return this.enabled && !this.paused && this.timeScale !== 0 && this._startTime === null && this._mixer._isActiveAction(this);
	}
	isScheduled() {
		return this._mixer._isActiveAction(this);
	}
	startAt(e) {
		return this._startTime = e, this;
	}
	setLoop(e, t) {
		return this.loop = e, this.repetitions = t, this;
	}
	setEffectiveWeight(e) {
		return this.weight = e, this._effectiveWeight = this.enabled ? e : 0, this.stopFading();
	}
	getEffectiveWeight() {
		return this._effectiveWeight;
	}
	fadeIn(e) {
		return this._scheduleFading(e, 0, 1);
	}
	fadeOut(e) {
		return this._scheduleFading(e, 1, 0);
	}
	crossFadeFrom(e, t, n = !1) {
		if (e.fadeOut(t), this.fadeIn(t), n === !0) {
			let n = this._clip.duration, r = e._clip.duration, i = r / n, a = n / r;
			e._restoreTimeScale = e.timeScale, this._restoreTimeScale = this.timeScale, e.warp(1, i, t), this.warp(a, 1, t);
		}
		return this;
	}
	crossFadeTo(e, t, n = !1) {
		return e.crossFadeFrom(this, t, n);
	}
	stopFading() {
		let e = this._weightInterpolant;
		return e !== null && (this._weightInterpolant = null, this._mixer._takeBackControlInterpolant(e)), this;
	}
	setEffectiveTimeScale(e) {
		return this.timeScale = e, this._effectiveTimeScale = this.paused ? 0 : e, this.stopWarping();
	}
	getEffectiveTimeScale() {
		return this._effectiveTimeScale;
	}
	setDuration(e) {
		return this.timeScale = this._clip.duration / e, this.stopWarping();
	}
	syncWith(e) {
		return this.time = e.time, this.timeScale = e.timeScale, this.stopWarping();
	}
	halt(e) {
		return this.warp(this._effectiveTimeScale, 0, e);
	}
	warp(e, t, n) {
		let r = this._mixer, i = r.time, a = this.timeScale, o = this._timeScaleInterpolant;
		o === null && (o = r._lendControlInterpolant(), this._timeScaleInterpolant = o);
		let s = o.parameterPositions, c = o.sampleValues;
		return s[0] = i, s[1] = i + n, c[0] = e / a, c[1] = t / a, this;
	}
	stopWarping() {
		let e = this._timeScaleInterpolant;
		return e !== null && (this._timeScaleInterpolant = null, this._mixer._takeBackControlInterpolant(e)), this._restoreTimeScale = null, this;
	}
	getMixer() {
		return this._mixer;
	}
	getClip() {
		return this._clip;
	}
	getRoot() {
		return this._localRoot || this._mixer._root;
	}
	_update(e, t, n, r) {
		if (!this.enabled) {
			this._updateWeight(e);
			return;
		}
		let i = this._startTime;
		if (i !== null) {
			let r = (e - i) * n;
			r < 0 || n === 0 ? t = 0 : (this._startTime = null, t = n * r);
		}
		t *= this._updateTimeScale(e);
		let a = this._updateTime(t), o = this._updateWeight(e);
		if (o > 0) {
			let e = this._interpolants, t = this._propertyBindings;
			switch (this.blendMode) {
				case 2501:
					for (let n = 0, r = e.length; n !== r; ++n) e[n].evaluate(a), t[n].accumulateAdditive(o);
					break;
				case te:
				default: for (let n = 0, i = e.length; n !== i; ++n) e[n].evaluate(a), t[n].accumulate(r, o);
			}
		}
	}
	_updateWeight(e) {
		let t = 0;
		if (this.enabled) {
			t = this.weight;
			let n = this._weightInterpolant;
			if (n !== null) {
				let r = n.evaluate(e)[0];
				t *= r, e > n.parameterPositions[1] && (this.stopFading(), r === 0 && (this.enabled = !1));
			}
		}
		return this._effectiveWeight = t, t;
	}
	_updateTimeScale(e) {
		let t = 0;
		if (!this.paused) {
			t = this.timeScale;
			let n = this._timeScaleInterpolant;
			if (n !== null) {
				let r = n.evaluate(e)[0];
				t *= r, e > n.parameterPositions[1] && (t === 0 ? this.paused = !0 : (this._restoreTimeScale !== null && (t = this._restoreTimeScale), this.timeScale = t), this.stopWarping());
			}
		}
		return this._effectiveTimeScale = t, t;
	}
	_updateTime(e) {
		let t = this._clip.duration, n = this.loop, r = this.time + e, i = this._loopCount, a = n === 2202;
		if (e === 0) return i === -1 ? r : a && (i & 1) == 1 ? t - r : r;
		if (n === 2200) {
			i === -1 && (this._loopCount = 0, this._setEndings(!0, !0, !1));
			handle_stop: {
				if (r >= t) r = t;
				else if (r < 0) r = 0;
				else {
					this.time = r;
					break handle_stop;
				}
				this.clampWhenFinished ? this.paused = !0 : this.enabled = !1, this.time = r, this._mixer.dispatchEvent({
					type: "finished",
					action: this,
					direction: e < 0 ? -1 : 1
				});
			}
		} else {
			if (i === -1 && (e >= 0 ? (i = 0, this._setEndings(!0, this.repetitions === 0, a)) : this._setEndings(this.repetitions === 0, !0, a)), r >= t || r < 0) {
				let n = Math.floor(r / t);
				r -= t * n, i += Math.abs(n);
				let o = this.repetitions - i;
				if (o <= 0) this.clampWhenFinished ? this.paused = !0 : this.enabled = !1, r = e > 0 ? t : 0, this.time = r, this._mixer.dispatchEvent({
					type: "finished",
					action: this,
					direction: e > 0 ? 1 : -1
				});
				else {
					if (o === 1) {
						let t = e < 0;
						this._setEndings(t, !t, a);
					} else this._setEndings(!1, !1, a);
					this._loopCount = i, this.time = r, this._mixer.dispatchEvent({
						type: "loop",
						action: this,
						loopDelta: n
					});
				}
			} else this._loopCount = i, this.time = r;
			if (a && (i & 1) == 1) return t - r;
		}
		return r;
	}
	_setEndings(e, t, n) {
		let r = this._interpolantSettings;
		n ? (r.endingStart = A, r.endingEnd = A) : (r.endingStart = e ? this.zeroSlopeAtStart ? A : k : j, r.endingEnd = t ? this.zeroSlopeAtEnd ? A : k : j);
	}
	_scheduleFading(e, t, n) {
		let r = this._mixer, i = r.time, a = this._weightInterpolant;
		a === null && (a = r._lendControlInterpolant(), this._weightInterpolant = a);
		let o = a.parameterPositions, s = a.sampleValues;
		return o[0] = i, s[0] = t, o[1] = i + e, s[1] = n, this;
	}
}, eo = /* @__PURE__ */ new Float32Array(1), to = class extends he {
	constructor(e) {
		super(), this._root = e, this._initMemoryManager(), this._accuIndex = 0, this.time = 0, this.timeScale = 1, typeof __THREE_DEVTOOLS__ < "u" && __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe", { detail: this }));
	}
	_bindAction(e, t) {
		let n = e._localRoot || this._root, r = e._clip.tracks, i = r.length, a = e._propertyBindings, o = e._interpolants, s = n.uuid, c = this._bindingsByRootAndName, l = c[s];
		l === void 0 && (l = {}, c[s] = l);
		for (let e = 0; e !== i; ++e) {
			let i = r[e], c = i.name, u = l[c];
			if (u !== void 0) ++u.referenceCount, a[e] = u;
			else {
				if (u = a[e], u !== void 0) {
					u._cacheIndex === null && (++u.referenceCount, this._addInactiveBinding(u, s, c));
					continue;
				}
				let r = t && t._propertyBindings[e].binding.parsedPath;
				u = new Ba(Qa.create(n, c, r), i.ValueTypeName, i.getValueSize()), ++u.referenceCount, this._addInactiveBinding(u, s, c), a[e] = u;
			}
			o[e].resultBuffer = u.buffer;
		}
	}
	_activateAction(e) {
		if (!this._isActiveAction(e)) {
			if (e._cacheIndex === null) {
				let t = (e._localRoot || this._root).uuid, n = e._clip.uuid, r = this._actionsByClip[n];
				this._bindAction(e, r && r.knownActions[0]), this._addInactiveAction(e, n, t);
			}
			let t = e._propertyBindings;
			for (let e = 0, n = t.length; e !== n; ++e) {
				let n = t[e];
				n.useCount++ === 0 && (this._lendBinding(n), n.saveOriginalState());
			}
			this._lendAction(e);
		}
	}
	_deactivateAction(e) {
		if (this._isActiveAction(e)) {
			let t = e._propertyBindings;
			for (let e = 0, n = t.length; e !== n; ++e) {
				let n = t[e];
				--n.useCount === 0 && (n.restoreOriginalState(), this._takeBackBinding(n));
			}
			this._takeBackAction(e);
		}
	}
	_initMemoryManager() {
		this._actions = [], this._nActiveActions = 0, this._actionsByClip = {}, this._bindings = [], this._nActiveBindings = 0, this._bindingsByRootAndName = {}, this._controlInterpolants = [], this._nActiveControlInterpolants = 0;
		let e = this;
		this.stats = {
			actions: {
				get total() {
					return e._actions.length;
				},
				get inUse() {
					return e._nActiveActions;
				}
			},
			bindings: {
				get total() {
					return e._bindings.length;
				},
				get inUse() {
					return e._nActiveBindings;
				}
			},
			controlInterpolants: {
				get total() {
					return e._controlInterpolants.length;
				},
				get inUse() {
					return e._nActiveControlInterpolants;
				}
			}
		};
	}
	_isActiveAction(e) {
		let t = e._cacheIndex;
		return t !== null && t < this._nActiveActions;
	}
	_addInactiveAction(e, t, n) {
		let r = this._actions, i = this._actionsByClip, a = i[t];
		if (a === void 0) a = {
			knownActions: [e],
			actionByRoot: {}
		}, e._byClipCacheIndex = 0, i[t] = a;
		else {
			let t = a.knownActions;
			e._byClipCacheIndex = t.length, t.push(e);
		}
		e._cacheIndex = r.length, r.push(e), a.actionByRoot[n] = e;
	}
	_removeInactiveAction(e) {
		let t = this._actions, n = t[t.length - 1], r = e._cacheIndex;
		n._cacheIndex = r, t[r] = n, t.pop(), e._cacheIndex = null;
		let i = e._clip.uuid, a = this._actionsByClip, o = a[i], s = o.knownActions, c = s[s.length - 1], l = e._byClipCacheIndex;
		c._byClipCacheIndex = l, s[l] = c, s.pop(), e._byClipCacheIndex = null;
		let u = o.actionByRoot, d = (e._localRoot || this._root).uuid;
		delete u[d], s.length === 0 && delete a[i], this._removeInactiveBindingsForAction(e);
	}
	_removeInactiveBindingsForAction(e) {
		let t = e._propertyBindings;
		for (let e = 0, n = t.length; e !== n; ++e) {
			let n = t[e];
			--n.referenceCount === 0 && this._removeInactiveBinding(n);
		}
	}
	_lendAction(e) {
		let t = this._actions, n = e._cacheIndex, r = this._nActiveActions++, i = t[r];
		e._cacheIndex = r, t[r] = e, i._cacheIndex = n, t[n] = i;
	}
	_takeBackAction(e) {
		let t = this._actions, n = e._cacheIndex, r = --this._nActiveActions, i = t[r];
		e._cacheIndex = r, t[r] = e, i._cacheIndex = n, t[n] = i;
	}
	_addInactiveBinding(e, t, n) {
		let r = this._bindingsByRootAndName, i = this._bindings, a = r[t];
		a === void 0 && (a = {}, r[t] = a), a[n] = e, e._cacheIndex = i.length, i.push(e);
	}
	_removeInactiveBinding(e) {
		let t = this._bindings, n = e.binding, r = n.rootNode.uuid, i = n.path, a = this._bindingsByRootAndName, o = a[r], s = t[t.length - 1], c = e._cacheIndex;
		s._cacheIndex = c, t[c] = s, t.pop(), delete o[i], Object.keys(o).length === 0 && delete a[r];
	}
	_lendBinding(e) {
		let t = this._bindings, n = e._cacheIndex, r = this._nActiveBindings++, i = t[r];
		e._cacheIndex = r, t[r] = e, i._cacheIndex = n, t[n] = i;
	}
	_takeBackBinding(e) {
		let t = this._bindings, n = e._cacheIndex, r = --this._nActiveBindings, i = t[r];
		e._cacheIndex = r, t[r] = e, i._cacheIndex = n, t[n] = i;
	}
	_lendControlInterpolant() {
		let e = this._controlInterpolants, t = this._nActiveControlInterpolants++, n = e[t];
		return n === void 0 && (n = new Ii(/* @__PURE__ */ new Float32Array(2), /* @__PURE__ */ new Float32Array(2), 1, eo), n.__cacheIndex = t, e[t] = n), n;
	}
	_takeBackControlInterpolant(e) {
		let t = this._controlInterpolants, n = e.__cacheIndex, r = --this._nActiveControlInterpolants, i = t[r];
		e.__cacheIndex = r, t[r] = e, i.__cacheIndex = n, t[n] = i;
	}
	clipAction(e, t, n) {
		let r = t || this._root, i = r.uuid, a = typeof e == "string" ? Zi.findByName(r, e) : e, o = a === null ? e : a.uuid, s = this._actionsByClip[o], c = null;
		if (n === void 0 && (n = a === null ? te : a.blendMode), s !== void 0) {
			let e = s.actionByRoot[i];
			if (e !== void 0 && e.blendMode === n) return e;
			c = s.knownActions[0], a === null && (a = c._clip);
		}
		if (a === null) return null;
		let l = new $a(this, a, t, n);
		return this._bindAction(l, c), this._addInactiveAction(l, o, i), l;
	}
	existingAction(e, t) {
		let n = t || this._root, r = n.uuid, i = typeof e == "string" ? Zi.findByName(n, e) : e, a = i ? i.uuid : e, o = this._actionsByClip[a];
		return o === void 0 ? null : o.actionByRoot[r] || null;
	}
	stopAllAction() {
		let e = this._actions, t = this._nActiveActions;
		for (let n = t - 1; n >= 0; --n) e[n].stop();
		return this;
	}
	update(e) {
		e *= this.timeScale;
		let t = this._actions, n = this._nActiveActions, r = this.time += e, i = Math.sign(e), a = this._accuIndex ^= 1;
		for (let o = 0; o !== n; ++o) t[o]._update(r, e, i, a);
		let o = this._bindings, s = this._nActiveBindings;
		for (let e = 0; e !== s; ++e) o[e].apply(a);
		return this;
	}
	setTime(e) {
		this.time = 0;
		for (let e = 0; e < this._actions.length; e++) this._actions[e].time = 0;
		return this.update(e);
	}
	getRoot() {
		return this._root;
	}
	uncacheClip(e) {
		let t = this._actions, n = e.uuid, r = this._actionsByClip, i = r[n];
		if (i !== void 0) {
			let e = i.knownActions;
			for (let n = 0, r = e.length; n !== r; ++n) {
				let r = e[n];
				this._deactivateAction(r);
				let i = r._cacheIndex, a = t[t.length - 1];
				r._cacheIndex = null, r._byClipCacheIndex = null, a._cacheIndex = i, t[i] = a, t.pop(), this._removeInactiveBindingsForAction(r);
			}
			delete r[n];
		}
	}
	uncacheRoot(e) {
		let t = e.uuid, n = this._actionsByClip;
		for (let e in n) {
			let r = n[e].actionByRoot[t];
			r !== void 0 && (this._deactivateAction(r), this._removeInactiveAction(r));
		}
		let r = this._bindingsByRootAndName[t];
		if (r !== void 0) for (let e in r) {
			let t = r[e];
			t.restoreOriginalState(), this._removeInactiveBinding(t);
		}
	}
	uncacheAction(e, t) {
		let n = this.existingAction(e, t);
		n !== null && (this._deactivateAction(n), this._removeInactiveAction(n));
	}
}, no = /*@__PURE__*/ new q(), ro = class {
	constructor(e, t, n = 0, r = Infinity) {
		this.ray = new Zn(e, t), this.near = n, this.far = r, this.camera = null, this.layers = new gt(), this.params = {
			Mesh: {},
			Line: { threshold: 1 },
			LOD: {},
			Points: { threshold: 1 },
			Sprite: {}
		};
	}
	set(e, t) {
		this.ray.set(e, t);
	}
	setFromCamera(e, t) {
		t.isPerspectiveCamera ? (this.ray.origin.setFromMatrixPosition(t.matrixWorld), this.ray.direction.set(e.x, e.y, .5).unproject(t).sub(this.ray.origin).normalize(), this.camera = t) : t.isOrthographicCamera ? (this.ray.origin.set(e.x, e.y, t.projectionMatrix.elements[14]).unproject(t), this.ray.direction.set(0, 0, -1).transformDirection(t.matrixWorld), this.camera = t) : L("Raycaster: Unsupported camera type: " + t.type);
	}
	setFromXRController(e) {
		return no.identity().extractRotation(e.matrixWorld), this.ray.origin.setFromMatrixPosition(e.matrixWorld), this.ray.direction.set(0, 0, -1).applyMatrix4(no), this;
	}
	intersectObject(e, t = !0, n = []) {
		return ao(e, this, n, t), n.sort(io), n;
	}
	intersectObjects(e, t = !0, n = []) {
		for (let r = 0, i = e.length; r < i; r++) ao(e[r], this, n, t);
		return n.sort(io), n;
	}
};
function io(e, t) {
	return e.distance - t.distance;
}
function ao(e, t, n, r) {
	let i = !0;
	if (e.layers.test(t.layers) && e.raycast(t, n) === !1 && (i = !1), i === !0 && r === !0) {
		let r = e.children;
		for (let e = 0, i = r.length; e < i; e++) ao(r[e], t, n, !0);
	}
}
(class e {
	static {
		e.prototype.isMatrix2 = !0;
	}
	constructor(e, t, n, r) {
		this.elements = [
			1,
			0,
			0,
			1
		], e !== void 0 && this.set(e, t, n, r);
	}
	identity() {
		return this.set(1, 0, 0, 1), this;
	}
	fromArray(e, t = 0) {
		for (let n = 0; n < 4; n++) this.elements[n] = e[n + t];
		return this;
	}
	set(e, t, n, r) {
		let i = this.elements;
		return i[0] = e, i[2] = t, i[1] = n, i[3] = r, this;
	}
});
function oo(e, t, n, r) {
	let i = so(r);
	switch (n) {
		case 1021: return e * t;
		case b: return e * t / i.components * i.byteLength;
		case x: return e * t / i.components * i.byteLength;
		case S: return e * t * 2 / i.components * i.byteLength;
		case C: return e * t * 2 / i.components * i.byteLength;
		case 1022: return e * t * 3 / i.components * i.byteLength;
		case _: return e * t * 4 / i.components * i.byteLength;
		case w: return e * t * 4 / i.components * i.byteLength;
		case 33776:
		case 33777: return Math.floor((e + 3) / 4) * Math.floor((t + 3) / 4) * 8;
		case 33778:
		case 33779: return Math.floor((e + 3) / 4) * Math.floor((t + 3) / 4) * 16;
		case 35841:
		case 35843: return Math.max(e, 16) * Math.max(t, 8) / 4;
		case 35840:
		case 35842: return Math.max(e, 8) * Math.max(t, 8) / 2;
		case 36196:
		case 37492:
		case 37488:
		case 37489: return Math.floor((e + 3) / 4) * Math.floor((t + 3) / 4) * 8;
		case 37496:
		case 37490:
		case 37491: return Math.floor((e + 3) / 4) * Math.floor((t + 3) / 4) * 16;
		case 37808: return Math.floor((e + 3) / 4) * Math.floor((t + 3) / 4) * 16;
		case 37809: return Math.floor((e + 4) / 5) * Math.floor((t + 3) / 4) * 16;
		case 37810: return Math.floor((e + 4) / 5) * Math.floor((t + 4) / 5) * 16;
		case 37811: return Math.floor((e + 5) / 6) * Math.floor((t + 4) / 5) * 16;
		case 37812: return Math.floor((e + 5) / 6) * Math.floor((t + 5) / 6) * 16;
		case 37813: return Math.floor((e + 7) / 8) * Math.floor((t + 4) / 5) * 16;
		case 37814: return Math.floor((e + 7) / 8) * Math.floor((t + 5) / 6) * 16;
		case 37815: return Math.floor((e + 7) / 8) * Math.floor((t + 7) / 8) * 16;
		case 37816: return Math.floor((e + 9) / 10) * Math.floor((t + 4) / 5) * 16;
		case 37817: return Math.floor((e + 9) / 10) * Math.floor((t + 5) / 6) * 16;
		case 37818: return Math.floor((e + 9) / 10) * Math.floor((t + 7) / 8) * 16;
		case 37819: return Math.floor((e + 9) / 10) * Math.floor((t + 9) / 10) * 16;
		case 37820: return Math.floor((e + 11) / 12) * Math.floor((t + 9) / 10) * 16;
		case 37821: return Math.floor((e + 11) / 12) * Math.floor((t + 11) / 12) * 16;
		case 36492:
		case 36494:
		case 36495: return Math.ceil(e / 4) * Math.ceil(t / 4) * 16;
		case 36283:
		case 36284: return Math.ceil(e / 4) * Math.ceil(t / 4) * 8;
		case 36285:
		case 36286: return Math.ceil(e / 4) * Math.ceil(t / 4) * 16;
	}
	throw Error(`Unable to determine texture byte length for ${n} format.`);
}
function so(e) {
	switch (e) {
		case l:
		case 1010: return {
			byteLength: 1,
			components: 1
		};
		case u:
		case 1011:
		case p: return {
			byteLength: 2,
			components: 1
		};
		case m:
		case h: return {
			byteLength: 2,
			components: 4
		};
		case d:
		case 1013:
		case f: return {
			byteLength: 4,
			components: 1
		};
		case 35902:
		case 35899: return {
			byteLength: 4,
			components: 3
		};
	}
	throw Error(`THREE.TextureUtils: Unknown texture type ${e}.`);
}
typeof __THREE_DEVTOOLS__ < "u" && __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register", { detail: { revision: "186" } })), typeof window < "u" && (window.__THREE__ ? I("WARNING: Multiple instances of Three.js being imported.") : window.__THREE__ = "186");
//#endregion
//#region node_modules/three/build/three.module.js
function co() {
	let e = null, t = !1, n = null, r = null;
	function i(t, a) {
		r = e.requestAnimationFrame(i), n(t, a);
	}
	return {
		start: function() {
			t !== !0 && n !== null && e !== null && (r = e.requestAnimationFrame(i), t = !0);
		},
		stop: function() {
			e !== null && e.cancelAnimationFrame(r), t = !1;
		},
		setAnimationLoop: function(e) {
			n = e;
		},
		setContext: function(t) {
			e = t;
		}
	};
}
function lo(e) {
	let t = /* @__PURE__ */ new WeakMap();
	function n(t, n) {
		let r = t.array, i = t.usage, a = r.byteLength, o = e.createBuffer();
		e.bindBuffer(n, o), e.bufferData(n, r, i), t.onUploadCallback();
		let s;
		if (r instanceof Float32Array) s = e.FLOAT;
		else if (typeof Float16Array < "u" && r instanceof Float16Array) s = e.HALF_FLOAT;
		else if (r instanceof Uint16Array) s = t.isFloat16BufferAttribute ? e.HALF_FLOAT : e.UNSIGNED_SHORT;
		else if (r instanceof Int16Array) s = e.SHORT;
		else if (r instanceof Uint32Array) s = e.UNSIGNED_INT;
		else if (r instanceof Int32Array) s = e.INT;
		else if (r instanceof Int8Array) s = e.BYTE;
		else if (r instanceof Uint8Array) s = e.UNSIGNED_BYTE;
		else if (r instanceof Uint8ClampedArray) s = e.UNSIGNED_BYTE;
		else throw Error("THREE.WebGLAttributes: Unsupported buffer data format: " + r);
		return {
			buffer: o,
			type: s,
			bytesPerElement: r.BYTES_PER_ELEMENT,
			version: t.version,
			size: a
		};
	}
	function r(t, n, r) {
		let i = n.array, a = n.updateRanges;
		if (e.bindBuffer(r, t), a.length === 0) e.bufferSubData(r, 0, i);
		else {
			a.sort((e, t) => e.start - t.start);
			let t = 0;
			for (let e = 1; e < a.length; e++) {
				let n = a[t], r = a[e];
				r.start <= n.start + n.count + 1 ? n.count = Math.max(n.count, r.start + r.count - n.start) : (++t, a[t] = r);
			}
			a.length = t + 1;
			for (let t = 0, n = a.length; t < n; t++) {
				let n = a[t];
				e.bufferSubData(r, n.start * i.BYTES_PER_ELEMENT, i, n.start, n.count);
			}
			n.clearUpdateRanges();
		}
		n.onUploadCallback();
	}
	function i(e) {
		return e.isInterleavedBufferAttribute && (e = e.data), t.get(e);
	}
	function a(n) {
		n.isInterleavedBufferAttribute && (n = n.data);
		let r = t.get(n);
		r && (e.deleteBuffer(r.buffer), t.delete(n));
	}
	function o(e, i) {
		if (e.isInterleavedBufferAttribute && (e = e.data), e.isGLBufferAttribute) {
			let n = t.get(e);
			(!n || n.version < e.version) && t.set(e, {
				buffer: e.buffer,
				type: e.type,
				bytesPerElement: e.elementSize,
				version: e.version
			});
			return;
		}
		let a = t.get(e);
		if (a === void 0) t.set(e, n(e, i));
		else if (a.version < e.version) {
			if (a.size !== e.array.byteLength) throw Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");
			r(a.buffer, e, i), a.version = e.version;
		}
	}
	return {
		get: i,
		remove: a,
		update: o
	};
}
var Y = {
	alphahash_fragment: "#ifdef USE_ALPHAHASH\n	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;\n#endif",
	alphahash_pars_fragment: "#ifdef USE_ALPHAHASH\n	const float ALPHA_HASH_SCALE = 0.05;\n	float hash2D( vec2 value ) {\n		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );\n	}\n	float hash3D( vec3 value ) {\n		return hash2D( vec2( hash2D( value.xy ), value.z ) );\n	}\n	float getAlphaHashThreshold( vec3 position ) {\n		float maxDeriv = max(\n			length( dFdx( position.xyz ) ),\n			length( dFdy( position.xyz ) )\n		);\n		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );\n		vec2 pixScales = vec2(\n			exp2( floor( log2( pixScale ) ) ),\n			exp2( ceil( log2( pixScale ) ) )\n		);\n		vec2 alpha = vec2(\n			hash3D( floor( pixScales.x * position.xyz ) ),\n			hash3D( floor( pixScales.y * position.xyz ) )\n		);\n		float lerpFactor = fract( log2( pixScale ) );\n		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;\n		float a = min( lerpFactor, 1.0 - lerpFactor );\n		vec3 cases = vec3(\n			x * x / ( 2.0 * a * ( 1.0 - a ) ),\n			( x - 0.5 * a ) / ( 1.0 - a ),\n			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )\n		);\n		float threshold = ( x < ( 1.0 - a ) )\n			? ( ( x < a ) ? cases.x : cases.y )\n			: cases.z;\n		return clamp( threshold , 1.0e-6, 1.0 );\n	}\n#endif",
	alphamap_fragment: "#ifdef USE_ALPHAMAP\n	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;\n#endif",
	alphamap_pars_fragment: "#ifdef USE_ALPHAMAP\n	uniform sampler2D alphaMap;\n#endif",
	alphatest_fragment: "#ifdef USE_ALPHATEST\n	#ifdef ALPHA_TO_COVERAGE\n	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );\n	if ( diffuseColor.a == 0.0 ) discard;\n	#else\n	if ( diffuseColor.a < alphaTest ) discard;\n	#endif\n#endif",
	alphatest_pars_fragment: "#ifdef USE_ALPHATEST\n	uniform float alphaTest;\n#endif",
	aomap_fragment: "#ifdef USE_AOMAP\n	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;\n	reflectedLight.indirectDiffuse *= ambientOcclusion;\n	#if defined( USE_CLEARCOAT ) \n		clearcoatSpecularIndirect *= ambientOcclusion;\n	#endif\n	#if defined( USE_SHEEN ) \n		sheenSpecularIndirect *= ambientOcclusion;\n	#endif\n	#if defined( USE_ENVMAP ) && defined( STANDARD )\n		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );\n		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );\n	#endif\n#endif",
	aomap_pars_fragment: "#ifdef USE_AOMAP\n	uniform sampler2D aoMap;\n	uniform float aoMapIntensity;\n#endif",
	batching_pars_vertex: "#ifdef USE_BATCHING\n	#if ! defined( GL_ANGLE_multi_draw )\n	#define gl_DrawID _gl_DrawID\n	uniform int _gl_DrawID;\n	#endif\n	uniform highp sampler2D batchingTexture;\n	uniform highp usampler2D batchingIdTexture;\n	mat4 getBatchingMatrix( const in float i ) {\n		int size = textureSize( batchingTexture, 0 ).x;\n		int j = int( i ) * 4;\n		int x = j % size;\n		int y = j / size;\n		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );\n		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );\n		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );\n		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );\n		return mat4( v1, v2, v3, v4 );\n	}\n	float getIndirectIndex( const in int i ) {\n		int size = textureSize( batchingIdTexture, 0 ).x;\n		int x = i % size;\n		int y = i / size;\n		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );\n	}\n#endif\n#ifdef USE_BATCHING_COLOR\n	uniform sampler2D batchingColorTexture;\n	vec4 getBatchingColor( const in float i ) {\n		int size = textureSize( batchingColorTexture, 0 ).x;\n		int j = int( i );\n		int x = j % size;\n		int y = j / size;\n		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );\n	}\n#endif",
	batching_vertex: "#ifdef USE_BATCHING\n	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );\n#endif",
	begin_vertex: "vec3 transformed = vec3( position );\n#ifdef USE_ALPHAHASH\n	vPosition = vec3( position );\n#endif",
	beginnormal_vertex: "vec3 objectNormal = vec3( normal );\n#ifdef USE_TANGENT\n	vec3 objectTangent = vec3( tangent.xyz );\n#endif",
	bsdfs: "float G_BlinnPhong_Implicit( ) {\n	return 0.25;\n}\nfloat D_BlinnPhong( const in float shininess, const in float dotNH ) {\n	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );\n}\nvec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {\n	vec3 halfDir = normalize( lightDir + viewDir );\n	float dotNH = saturate( dot( normal, halfDir ) );\n	float dotVH = saturate( dot( viewDir, halfDir ) );\n	vec3 F = F_Schlick( specularColor, 1.0, dotVH );\n	float G = G_BlinnPhong_Implicit( );\n	float D = D_BlinnPhong( shininess, dotNH );\n	return F * ( G * D );\n} // validated",
	iridescence_fragment: "#ifdef USE_IRIDESCENCE\n	const mat3 XYZ_TO_REC709 = mat3(\n		 3.2404542, -0.9692660,  0.0556434,\n		-1.5371385,  1.8760108, -0.2040259,\n		-0.4985314,  0.0415560,  1.0572252\n	);\n	vec3 Fresnel0ToIor( vec3 fresnel0 ) {\n		vec3 sqrtF0 = sqrt( fresnel0 );\n		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );\n	}\n	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {\n		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );\n	}\n	float IorToFresnel0( float transmittedIor, float incidentIor ) {\n		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));\n	}\n	vec3 evalSensitivity( float OPD, vec3 shift ) {\n		float phase = 2.0 * PI * OPD * 1.0e-9;\n		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );\n		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );\n		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );\n		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );\n		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );\n		xyz /= 1.0685e-7;\n		vec3 rgb = XYZ_TO_REC709 * xyz;\n		return rgb;\n	}\n	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {\n		vec3 I;\n		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );\n		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );\n		float cosTheta2Sq = 1.0 - sinTheta2Sq;\n		if ( cosTheta2Sq < 0.0 ) {\n			return vec3( 1.0 );\n		}\n		float cosTheta2 = sqrt( cosTheta2Sq );\n		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );\n		float R12 = F_Schlick( R0, 1.0, cosTheta1 );\n		float T121 = 1.0 - R12;\n		float phi12 = 0.0;\n		if ( iridescenceIOR < outsideIOR ) phi12 = PI;\n		float phi21 = PI - phi12;\n		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );\n		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );\n		vec3 phi23 = vec3( 0.0 );\n		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;\n		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;\n		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;\n		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;\n		vec3 phi = vec3( phi21 ) + phi23;\n		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );\n		vec3 r123 = sqrt( R123 );\n		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );\n		vec3 C0 = R12 + Rs;\n		I = C0;\n		vec3 Cm = Rs - T121;\n		for ( int m = 1; m <= 2; ++ m ) {\n			Cm *= r123;\n			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );\n			I += Cm * Sm;\n		}\n		return max( I, vec3( 0.0 ) );\n	}\n#endif",
	bumpmap_pars_fragment: "#ifdef USE_BUMPMAP\n	uniform sampler2D bumpMap;\n	uniform float bumpScale;\n	vec2 dHdxy_fwd() {\n		vec2 dSTdx = dFdx( vBumpMapUv );\n		vec2 dSTdy = dFdy( vBumpMapUv );\n		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;\n		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;\n		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;\n		return vec2( dBx, dBy );\n	}\n	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {\n		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );\n		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );\n		vec3 vN = surf_norm;\n		vec3 R1 = cross( vSigmaY, vN );\n		vec3 R2 = cross( vN, vSigmaX );\n		float fDet = dot( vSigmaX, R1 ) * faceDirection;\n		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );\n		return normalize( abs( fDet ) * surf_norm - vGrad );\n	}\n#endif",
	clipping_planes_fragment: "#if NUM_CLIPPING_PLANES > 0\n	vec4 plane;\n	#ifdef ALPHA_TO_COVERAGE\n		float distanceToPlane, distanceGradient;\n		float clipOpacity = 1.0;\n		#pragma unroll_loop_start\n		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {\n			plane = clippingPlanes[ i ];\n			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;\n			distanceGradient = fwidth( distanceToPlane ) / 2.0;\n			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );\n			if ( clipOpacity == 0.0 ) discard;\n		}\n		#pragma unroll_loop_end\n		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES\n			float unionClipOpacity = 1.0;\n			#pragma unroll_loop_start\n			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {\n				plane = clippingPlanes[ i ];\n				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;\n				distanceGradient = fwidth( distanceToPlane ) / 2.0;\n				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );\n			}\n			#pragma unroll_loop_end\n			clipOpacity *= 1.0 - unionClipOpacity;\n		#endif\n		diffuseColor.a *= clipOpacity;\n		if ( diffuseColor.a == 0.0 ) discard;\n	#else\n		#pragma unroll_loop_start\n		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {\n			plane = clippingPlanes[ i ];\n			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;\n		}\n		#pragma unroll_loop_end\n		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES\n			bool clipped = true;\n			#pragma unroll_loop_start\n			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {\n				plane = clippingPlanes[ i ];\n				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;\n			}\n			#pragma unroll_loop_end\n			if ( clipped ) discard;\n		#endif\n	#endif\n#endif",
	clipping_planes_pars_fragment: "#if NUM_CLIPPING_PLANES > 0\n	varying vec3 vClipPosition;\n	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];\n#endif",
	clipping_planes_pars_vertex: "#if NUM_CLIPPING_PLANES > 0\n	varying vec3 vClipPosition;\n#endif",
	clipping_planes_vertex: "#if NUM_CLIPPING_PLANES > 0\n	vClipPosition = - mvPosition.xyz;\n#endif",
	color_fragment: "#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )\n	diffuseColor *= vColor;\n#endif",
	color_pars_fragment: "#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )\n	varying vec4 vColor;\n#endif",
	color_pars_vertex: "#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )\n	varying vec4 vColor;\n#endif",
	color_vertex: "#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )\n	vColor = vec4( 1.0 );\n#endif\n#ifdef USE_COLOR_ALPHA\n	vColor *= color;\n#elif defined( USE_COLOR )\n	vColor.rgb *= color;\n#endif\n#ifdef USE_INSTANCING_COLOR\n	vColor.rgb *= instanceColor.rgb;\n#endif\n#ifdef USE_BATCHING_COLOR\n	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );\n#endif",
	common: "#define PI 3.141592653589793\n#define PI2 6.283185307179586\n#define PI_HALF 1.5707963267948966\n#define RECIPROCAL_PI 0.3183098861837907\n#define RECIPROCAL_PI2 0.15915494309189535\n#define EPSILON 1e-6\n#ifndef saturate\n#define saturate( a ) clamp( a, 0.0, 1.0 )\n#endif\n#define whiteComplement( a ) ( 1.0 - saturate( a ) )\nfloat pow2( const in float x ) { return x*x; }\nvec3 pow2( const in vec3 x ) { return x*x; }\nfloat pow3( const in float x ) { return x*x*x; }\nfloat pow4( const in float x ) { float x2 = x*x; return x2*x2; }\nfloat max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }\nfloat average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }\nhighp float rand( const in vec2 uv ) {\n	const highp float a = 12.9898, b = 78.233, c = 43758.5453;\n	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );\n	return fract( sin( sn ) * c );\n}\n#ifdef HIGH_PRECISION\n	float precisionSafeLength( vec3 v ) { return length( v ); }\n#else\n	float precisionSafeLength( vec3 v ) {\n		float maxComponent = max3( abs( v ) );\n		return length( v / maxComponent ) * maxComponent;\n	}\n#endif\nstruct IncidentLight {\n	vec3 color;\n	vec3 direction;\n	bool visible;\n};\nstruct ReflectedLight {\n	vec3 directDiffuse;\n	vec3 directSpecular;\n	vec3 indirectDiffuse;\n	vec3 indirectSpecular;\n};\n#ifdef USE_ALPHAHASH\n	varying vec3 vPosition;\n#endif\nvec3 transformDirection( in vec3 dir, in mat4 matrix ) {\n	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );\n}\n#define inverseTransformDirection transformDirectionByInverseViewMatrix\nvec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {\n	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );\n}\nvec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {\n	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );\n}\nbool isPerspectiveMatrix( mat4 m ) {\n	return m[ 2 ][ 3 ] == - 1.0;\n}\nvec2 equirectUv( in vec3 dir ) {\n	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;\n	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;\n	return vec2( u, v );\n}\nvec3 BRDF_Lambert( const in vec3 diffuseColor ) {\n	return RECIPROCAL_PI * diffuseColor;\n}\nvec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {\n	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );\n	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );\n}\nfloat F_Schlick( const in float f0, const in float f90, const in float dotVH ) {\n	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );\n	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );\n} // validated",
	cube_uv_reflection_fragment: "#ifdef ENVMAP_TYPE_CUBE_UV\n	#define cubeUV_minMipLevel 4.0\n	#define cubeUV_minTileSize 16.0\n	float getFace( vec3 direction ) {\n		vec3 absDirection = abs( direction );\n		float face = - 1.0;\n		if ( absDirection.x > absDirection.z ) {\n			if ( absDirection.x > absDirection.y )\n				face = direction.x > 0.0 ? 0.0 : 3.0;\n			else\n				face = direction.y > 0.0 ? 1.0 : 4.0;\n		} else {\n			if ( absDirection.z > absDirection.y )\n				face = direction.z > 0.0 ? 2.0 : 5.0;\n			else\n				face = direction.y > 0.0 ? 1.0 : 4.0;\n		}\n		return face;\n	}\n	vec2 getUV( vec3 direction, float face ) {\n		vec2 uv;\n		if ( face == 0.0 ) {\n			uv = vec2( direction.z, direction.y ) / abs( direction.x );\n		} else if ( face == 1.0 ) {\n			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );\n		} else if ( face == 2.0 ) {\n			uv = vec2( - direction.x, direction.y ) / abs( direction.z );\n		} else if ( face == 3.0 ) {\n			uv = vec2( - direction.z, direction.y ) / abs( direction.x );\n		} else if ( face == 4.0 ) {\n			uv = vec2( - direction.x, direction.z ) / abs( direction.y );\n		} else {\n			uv = vec2( direction.x, direction.y ) / abs( direction.z );\n		}\n		return 0.5 * ( uv + 1.0 );\n	}\n	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {\n		float face = getFace( direction );\n		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );\n		mipInt = max( mipInt, cubeUV_minMipLevel );\n		float faceSize = exp2( mipInt );\n		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;\n		if ( face > 2.0 ) {\n			uv.y += faceSize;\n			face -= 3.0;\n		}\n		uv.x += face * faceSize;\n		uv.x += filterInt * 3.0 * cubeUV_minTileSize;\n		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );\n		uv.x *= CUBEUV_TEXEL_WIDTH;\n		uv.y *= CUBEUV_TEXEL_HEIGHT;\n		#ifdef texture2DGradEXT\n			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;\n		#else\n			return texture2D( envMap, uv ).rgb;\n		#endif\n	}\n	#define cubeUV_r0 1.0\n	#define cubeUV_m0 - 2.0\n	#define cubeUV_r1 0.8\n	#define cubeUV_m1 - 1.0\n	#define cubeUV_r4 0.4\n	#define cubeUV_m4 2.0\n	#define cubeUV_r5 0.305\n	#define cubeUV_m5 3.0\n	#define cubeUV_r6 0.21\n	#define cubeUV_m6 4.0\n	float roughnessToMip( float roughness ) {\n		float mip = 0.0;\n		if ( roughness >= cubeUV_r1 ) {\n			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;\n		} else if ( roughness >= cubeUV_r4 ) {\n			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;\n		} else if ( roughness >= cubeUV_r5 ) {\n			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;\n		} else if ( roughness >= cubeUV_r6 ) {\n			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;\n		} else {\n			mip = - 2.0 * log2( 1.16 * roughness );		}\n		return mip;\n	}\n	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {\n		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );\n		float mipF = fract( mip );\n		float mipInt = floor( mip );\n		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );\n		if ( mipF == 0.0 ) {\n			return vec4( color0, 1.0 );\n		} else {\n			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );\n			return vec4( mix( color0, color1, mipF ), 1.0 );\n		}\n	}\n#endif",
	defaultnormal_vertex: "vec3 transformedNormal = objectNormal;\n#ifdef USE_TANGENT\n	vec3 transformedTangent = objectTangent;\n#endif\n#ifdef USE_BATCHING\n	mat3 bm = mat3( batchingMatrix );\n	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );\n	transformedNormal = bm * transformedNormal;\n	#ifdef USE_TANGENT\n		transformedTangent = bm * transformedTangent;\n	#endif\n#endif\n#ifdef USE_INSTANCING\n	mat3 im = mat3( instanceMatrix );\n	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );\n	transformedNormal = im * transformedNormal;\n	#ifdef USE_TANGENT\n		transformedTangent = im * transformedTangent;\n	#endif\n#endif\ntransformedNormal = normalMatrix * transformedNormal;\n#ifdef FLIP_SIDED\n	transformedNormal = - transformedNormal;\n#endif\n#ifdef USE_TANGENT\n	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;\n#endif",
	displacementmap_pars_vertex: "#ifdef USE_DISPLACEMENTMAP\n	uniform sampler2D displacementMap;\n	uniform float displacementScale;\n	uniform float displacementBias;\n#endif",
	displacementmap_vertex: "#ifdef USE_DISPLACEMENTMAP\n	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );\n#endif",
	emissivemap_fragment: "#ifdef USE_EMISSIVEMAP\n	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );\n	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE\n		emissiveColor = sRGBTransferEOTF( emissiveColor );\n	#endif\n	totalEmissiveRadiance *= emissiveColor.rgb;\n#endif",
	emissivemap_pars_fragment: "#ifdef USE_EMISSIVEMAP\n	uniform sampler2D emissiveMap;\n#endif",
	colorspace_fragment: "gl_FragColor = linearToOutputTexel( gl_FragColor );",
	colorspace_pars_fragment: "vec4 LinearTransferOETF( in vec4 value ) {\n	return value;\n}\nvec4 sRGBTransferEOTF( in vec4 value ) {\n	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );\n}\nvec4 sRGBTransferOETF( in vec4 value ) {\n	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );\n}",
	envmap_fragment: "#ifdef USE_ENVMAP\n	#ifdef ENV_WORLDPOS\n		vec3 cameraToFrag;\n		if ( isOrthographic ) {\n			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );\n		} else {\n			cameraToFrag = normalize( vWorldPosition - cameraPosition );\n		}\n		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );\n		#ifdef ENVMAP_MODE_REFLECTION\n			vec3 reflectVec = reflect( cameraToFrag, worldNormal );\n		#else\n			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );\n		#endif\n	#else\n		vec3 reflectVec = vReflect;\n	#endif\n	#ifdef ENVMAP_TYPE_CUBE\n		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );\n		#ifdef ENVMAP_BLENDING_MULTIPLY\n			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );\n		#elif defined( ENVMAP_BLENDING_MIX )\n			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );\n		#elif defined( ENVMAP_BLENDING_ADD )\n			outgoingLight += envColor.xyz * specularStrength * reflectivity;\n		#endif\n	#endif\n#endif",
	envmap_common_pars_fragment: "#ifdef USE_ENVMAP\n	uniform float envMapIntensity;\n	uniform mat3 envMapRotation;\n	#ifdef ENVMAP_TYPE_CUBE\n		uniform samplerCube envMap;\n	#else\n		uniform sampler2D envMap;\n	#endif\n#endif",
	envmap_pars_fragment: "#ifdef USE_ENVMAP\n	uniform float reflectivity;\n	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )\n		#define ENV_WORLDPOS\n	#endif\n	#ifdef ENV_WORLDPOS\n		varying vec3 vWorldPosition;\n		uniform float refractionRatio;\n	#else\n		varying vec3 vReflect;\n	#endif\n#endif",
	envmap_pars_vertex: "#ifdef USE_ENVMAP\n	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )\n		#define ENV_WORLDPOS\n	#endif\n	#ifdef ENV_WORLDPOS\n		\n		varying vec3 vWorldPosition;\n	#else\n		varying vec3 vReflect;\n		uniform float refractionRatio;\n	#endif\n#endif",
	envmap_physical_pars_fragment: "#ifdef USE_ENVMAP\n	vec3 getIBLIrradiance( const in vec3 normal ) {\n		#ifdef ENVMAP_TYPE_CUBE_UV\n			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );\n			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );\n			return PI * envMapColor.rgb * envMapIntensity;\n		#else\n			return vec3( 0.0 );\n		#endif\n	}\n	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {\n		#ifdef ENVMAP_TYPE_CUBE_UV\n			vec3 reflectVec = reflect( - viewDir, normal );\n			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );\n			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );\n			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );\n			return envMapColor.rgb * envMapIntensity;\n		#else\n			return vec3( 0.0 );\n		#endif\n	}\n	#ifdef USE_RETROREFLECTION\n		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {\n			#ifdef ENVMAP_TYPE_CUBE_UV\n				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );\n				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );\n				vec4 envMapColor = textureCubeUV( envMap, envMapRotation * retroVec, roughness );\n				return envMapColor.rgb * envMapIntensity;\n			#else\n				return vec3( 0.0 );\n			#endif\n		}\n	#endif\n	#ifdef USE_ANISOTROPY\n		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {\n			#ifdef ENVMAP_TYPE_CUBE_UV\n				vec3 bentNormal = cross( bitangent, viewDir );\n				bentNormal = normalize( cross( bentNormal, bitangent ) );\n				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );\n				return getIBLRadiance( viewDir, bentNormal, roughness );\n			#else\n				return vec3( 0.0 );\n			#endif\n		}\n		#ifdef USE_RETROREFLECTION\n			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {\n				#ifdef ENVMAP_TYPE_CUBE_UV\n					vec3 bentNormal = cross( bitangent, viewDir );\n					bentNormal = normalize( cross( bentNormal, bitangent ) );\n					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );\n					return getIBLRetroRadiance( viewDir, bentNormal, roughness );\n				#else\n					return vec3( 0.0 );\n				#endif\n			}\n		#endif\n	#endif\n#endif",
	envmap_vertex: "#ifdef USE_ENVMAP\n	#ifdef ENV_WORLDPOS\n		vWorldPosition = worldPosition.xyz;\n	#else\n		vec3 cameraToVertex;\n		if ( isOrthographic ) {\n			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );\n		} else {\n			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );\n		}\n		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );\n		#ifdef ENVMAP_MODE_REFLECTION\n			vReflect = reflect( cameraToVertex, worldNormal );\n		#else\n			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );\n		#endif\n	#endif\n#endif",
	fog_vertex: "#ifdef USE_FOG\n	vFogDepth = - mvPosition.z;\n#endif",
	fog_pars_vertex: "#ifdef USE_FOG\n	varying float vFogDepth;\n#endif",
	fog_fragment: "#ifdef USE_FOG\n	#ifdef FOG_EXP2\n		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );\n	#else\n		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );\n	#endif\n	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );\n#endif",
	fog_pars_fragment: "#ifdef USE_FOG\n	uniform vec3 fogColor;\n	varying float vFogDepth;\n	#ifdef FOG_EXP2\n		uniform float fogDensity;\n	#else\n		uniform float fogNear;\n		uniform float fogFar;\n	#endif\n#endif",
	gradientmap_pars_fragment: "#ifdef USE_GRADIENTMAP\n	uniform sampler2D gradientMap;\n#endif\nvec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {\n	float dotNL = dot( normal, lightDirection );\n	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );\n	#ifdef USE_GRADIENTMAP\n		return vec3( texture2D( gradientMap, coord ).r );\n	#else\n		vec2 fw = fwidth( coord ) * 0.5;\n		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );\n	#endif\n}",
	lightmap_pars_fragment: "#ifdef USE_LIGHTMAP\n	uniform sampler2D lightMap;\n	uniform float lightMapIntensity;\n#endif",
	lights_lambert_fragment: "LambertMaterial material;\nmaterial.diffuseColor = diffuseColor.rgb;\nmaterial.specularStrength = specularStrength;",
	lights_lambert_pars_fragment: "varying vec3 vViewPosition;\nstruct LambertMaterial {\n	vec3 diffuseColor;\n	float specularStrength;\n};\nvoid RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {\n	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );\n	vec3 irradiance = dotNL * directLight.color;\n	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );\n}\nvoid RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {\n	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );\n}\n#define RE_Direct				RE_Direct_Lambert\n#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert",
	lights_pars_begin: "uniform bool receiveShadow;\nuniform vec3 ambientLightColor;\n#if defined( USE_LIGHT_PROBES )\n	uniform vec3 lightProbe[ 9 ];\n#endif\nvec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {\n	float x = normal.x, y = normal.y, z = normal.z;\n	vec3 result = shCoefficients[ 0 ] * 0.886227;\n	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;\n	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;\n	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;\n	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;\n	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;\n	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );\n	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;\n	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );\n	return result;\n}\nvec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {\n	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );\n	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );\n	return irradiance;\n}\nvec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {\n	vec3 irradiance = ambientLightColor;\n	return irradiance;\n}\nfloat getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {\n	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );\n	if ( cutoffDistance > 0.0 ) {\n		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );\n	}\n	return distanceFalloff;\n}\nfloat getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {\n	return smoothstep( coneCosine, penumbraCosine, angleCosine );\n}\n#if NUM_SUN_LIGHTS > 0\n	struct SunLight {\n		vec3 direction;\n		vec3 color;\n	};\n	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];\n	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {\n		light.color = sunLight.color;\n		light.direction = sunLight.direction;\n		light.visible = true;\n	}\n#endif\n#if NUM_DIR_LIGHTS > 0\n	struct DirectionalLight {\n		vec3 direction;\n		vec3 color;\n	};\n	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];\n	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {\n		light.color = directionalLight.color;\n		light.direction = directionalLight.direction;\n		light.visible = true;\n	}\n#endif\n#if NUM_POINT_LIGHTS > 0\n	struct PointLight {\n		vec3 position;\n		vec3 color;\n		float distance;\n		float decay;\n	};\n	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];\n	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {\n		vec3 lVector = pointLight.position - geometryPosition;\n		light.direction = normalize( lVector );\n		float lightDistance = length( lVector );\n		light.color = pointLight.color;\n		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );\n		light.visible = ( light.color != vec3( 0.0 ) );\n	}\n#endif\n#if NUM_SPOT_LIGHTS > 0\n	struct SpotLight {\n		vec3 position;\n		vec3 direction;\n		vec3 color;\n		float distance;\n		float decay;\n		float coneCos;\n		float penumbraCos;\n	};\n	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];\n	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {\n		vec3 lVector = spotLight.position - geometryPosition;\n		light.direction = normalize( lVector );\n		float angleCos = dot( light.direction, spotLight.direction );\n		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );\n		if ( spotAttenuation > 0.0 ) {\n			float lightDistance = length( lVector );\n			light.color = spotLight.color * spotAttenuation;\n			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );\n			light.visible = ( light.color != vec3( 0.0 ) );\n		} else {\n			light.color = vec3( 0.0 );\n			light.visible = false;\n		}\n	}\n#endif\n#if NUM_RECT_AREA_LIGHTS > 0\n	struct RectAreaLight {\n		vec3 color;\n		vec3 position;\n		vec3 halfWidth;\n		vec3 halfHeight;\n	};\n	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;\n	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];\n#endif\n#if NUM_HEMI_LIGHTS > 0\n	struct HemisphereLight {\n		vec3 direction;\n		vec3 skyColor;\n		vec3 groundColor;\n	};\n	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];\n	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {\n		float dotNL = dot( normal, hemiLight.direction );\n		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;\n		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );\n		return irradiance;\n	}\n#endif\n#include <lightprobes_pars_fragment>",
	lights_toon_fragment: "ToonMaterial material;\nmaterial.diffuseColor = diffuseColor.rgb;",
	lights_toon_pars_fragment: "varying vec3 vViewPosition;\nstruct ToonMaterial {\n	vec3 diffuseColor;\n};\nvoid RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {\n	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;\n	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );\n}\nvoid RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {\n	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );\n}\n#define RE_Direct				RE_Direct_Toon\n#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon",
	lights_phong_fragment: "BlinnPhongMaterial material;\nmaterial.diffuseColor = diffuseColor.rgb;\nmaterial.specularColor = specular;\nmaterial.specularShininess = shininess;\nmaterial.specularStrength = specularStrength;",
	lights_phong_pars_fragment: "varying vec3 vViewPosition;\nstruct BlinnPhongMaterial {\n	vec3 diffuseColor;\n	vec3 specularColor;\n	float specularShininess;\n	float specularStrength;\n};\nvoid RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {\n	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );\n	vec3 irradiance = dotNL * directLight.color;\n	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );\n	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;\n}\nvoid RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {\n	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );\n}\n#define RE_Direct				RE_Direct_BlinnPhong\n#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong",
	lights_physical_fragment: "PhysicalMaterial material;\nmaterial.diffuseColor = diffuseColor.rgb;\nmaterial.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );\nmaterial.metalness = metalnessFactor;\nvec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );\nfloat geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );\nmaterial.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;\nmaterial.roughness = min( material.roughness, 1.0 );\n#ifdef IOR\n	material.ior = ior;\n	#ifdef USE_SPECULAR\n		float specularIntensityFactor = specularIntensity;\n		vec3 specularColorFactor = specularColor;\n		#ifdef USE_SPECULAR_COLORMAP\n			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;\n		#endif\n		#ifdef USE_SPECULAR_INTENSITYMAP\n			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;\n		#endif\n		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );\n	#else\n		float specularIntensityFactor = 1.0;\n		vec3 specularColorFactor = vec3( 1.0 );\n		material.specularF90 = 1.0;\n	#endif\n	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;\n	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );\n#else\n	material.specularColor = vec3( 0.04 );\n	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );\n	material.specularF90 = 1.0;\n#endif\n#ifdef USE_CLEARCOAT\n	material.clearcoat = clearcoat;\n	material.clearcoatRoughness = clearcoatRoughness;\n	material.clearcoatF0 = vec3( 0.04 );\n	material.clearcoatF90 = 1.0;\n	#ifdef USE_CLEARCOATMAP\n		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;\n	#endif\n	#ifdef USE_CLEARCOAT_ROUGHNESSMAP\n		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;\n	#endif\n	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );\n	material.clearcoatRoughness += geometryRoughness;\n	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );\n#endif\n#ifdef USE_DISPERSION\n	material.dispersion = dispersion;\n#endif\n#ifdef USE_RETROREFLECTION\n	material.retroreflectivity = retroreflectivity;\n#endif\n#ifdef USE_IRIDESCENCE\n	material.iridescence = iridescence;\n	material.iridescenceIOR = iridescenceIOR;\n	#ifdef USE_IRIDESCENCEMAP\n		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;\n	#endif\n	#ifdef USE_IRIDESCENCE_THICKNESSMAP\n		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;\n	#else\n		material.iridescenceThickness = iridescenceThicknessMaximum;\n	#endif\n#endif\n#ifdef USE_SHEEN\n	material.sheenColor = sheenColor;\n	#ifdef USE_SHEEN_COLORMAP\n		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;\n	#endif\n	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );\n	#ifdef USE_SHEEN_ROUGHNESSMAP\n		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;\n	#endif\n#endif\n#ifdef USE_ANISOTROPY\n	#ifdef USE_ANISOTROPYMAP\n		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );\n		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;\n		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;\n	#else\n		vec2 anisotropyV = anisotropyVector;\n	#endif\n	material.anisotropy = length( anisotropyV );\n	if( material.anisotropy == 0.0 ) {\n		anisotropyV = vec2( 1.0, 0.0 );\n	} else {\n		anisotropyV /= material.anisotropy;\n		material.anisotropy = saturate( material.anisotropy );\n	}\n	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );\n	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;\n	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;\n#endif",
	lights_physical_pars_fragment: "uniform sampler2D dfgLUT;\nstruct PhysicalMaterial {\n	vec3 diffuseColor;\n	vec3 diffuseContribution;\n	vec3 specularColor;\n	vec3 specularColorBlended;\n	float roughness;\n	float metalness;\n	float specularF90;\n	float dispersion;\n	vec2 dfg;\n	vec3 multiScatteringCompensation;\n	#ifdef USE_RETROREFLECTION\n		float retroreflectivity;\n	#endif\n	#ifdef USE_CLEARCOAT\n		float clearcoat;\n		float clearcoatRoughness;\n		vec3 clearcoatF0;\n		float clearcoatF90;\n	#endif\n	#ifdef USE_IRIDESCENCE\n		float iridescence;\n		float iridescenceIOR;\n		float iridescenceThickness;\n		vec3 iridescenceFresnel;\n		vec3 iridescenceF0Dielectric;\n		vec3 iridescenceF0Metallic;\n	#endif\n	#ifdef USE_SHEEN\n		vec3 sheenColor;\n		float sheenRoughness;\n	#endif\n	#ifdef IOR\n		float ior;\n	#endif\n	#ifdef USE_TRANSMISSION\n		float transmission;\n		float transmissionAlpha;\n		float thickness;\n		float attenuationDistance;\n		vec3 attenuationColor;\n	#endif\n	#ifdef USE_ANISOTROPY\n		float anisotropy;\n		float alphaT;\n		vec3 anisotropyT;\n		vec3 anisotropyB;\n	#endif\n};\nvec3 clearcoatSpecularDirect = vec3( 0.0 );\nvec3 clearcoatSpecularIndirect = vec3( 0.0 );\nvec3 sheenSpecularDirect = vec3( 0.0 );\nvec3 sheenSpecularIndirect = vec3(0.0 );\nvec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {\n    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );\n    float x2 = x * x;\n    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );\n    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );\n}\nfloat V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {\n	float a2 = pow2( alpha );\n	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );\n	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );\n	return 0.5 / max( gv + gl, EPSILON );\n}\nfloat D_GGX( const in float alpha, const in float dotNH ) {\n	float a2 = pow2( alpha );\n	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;\n	return RECIPROCAL_PI * a2 / pow2( denom );\n}\n#ifdef USE_ANISOTROPY\n	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {\n		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );\n		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );\n		return 0.5 / max( gv + gl, EPSILON );\n	}\n	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {\n		float a2 = alphaT * alphaB;\n		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );\n		highp float v2 = dot( v, v );\n		float w2 = a2 / v2;\n		return RECIPROCAL_PI * a2 * pow2 ( w2 );\n	}\n#endif\n#ifdef USE_CLEARCOAT\n	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {\n		vec3 f0 = material.clearcoatF0;\n		float f90 = material.clearcoatF90;\n		float roughness = material.clearcoatRoughness;\n		float alpha = pow2( roughness );\n		vec3 halfDir = normalize( lightDir + viewDir );\n		float dotNL = saturate( dot( normal, lightDir ) );\n		float dotNV = saturate( dot( normal, viewDir ) );\n		float dotNH = saturate( dot( normal, halfDir ) );\n		float dotVH = saturate( dot( viewDir, halfDir ) );\n		vec3 F = F_Schlick( f0, f90, dotVH );\n		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );\n		float D = D_GGX( alpha, dotNH );\n		return F * ( V * D );\n	}\n#endif\nvec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {\n	vec3 f0 = material.specularColorBlended;\n	float f90 = material.specularF90;\n	float roughness = material.roughness;\n	float alpha = pow2( roughness );\n	vec3 halfDir = normalize( lightDir + viewDir );\n	float dotNL = saturate( dot( normal, lightDir ) );\n	float dotNV = saturate( dot( normal, viewDir ) );\n	float dotNH = saturate( dot( normal, halfDir ) );\n	float dotVH = saturate( dot( viewDir, halfDir ) );\n	vec3 F = F_Schlick( f0, f90, dotVH );\n	#ifdef USE_IRIDESCENCE\n		F = mix( F, material.iridescenceFresnel, material.iridescence );\n	#endif\n	#ifdef USE_ANISOTROPY\n		float dotTL = dot( material.anisotropyT, lightDir );\n		float dotTV = dot( material.anisotropyT, viewDir );\n		float dotTH = dot( material.anisotropyT, halfDir );\n		float dotBL = dot( material.anisotropyB, lightDir );\n		float dotBV = dot( material.anisotropyB, viewDir );\n		float dotBH = dot( material.anisotropyB, halfDir );\n		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );\n		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );\n	#else\n		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );\n		float D = D_GGX( alpha, dotNH );\n	#endif\n	return F * ( V * D );\n}\nvec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {\n	const float LUT_SIZE = 64.0;\n	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;\n	const float LUT_BIAS = 0.5 / LUT_SIZE;\n	float dotNV = saturate( dot( N, V ) );\n	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );\n	uv = uv * LUT_SCALE + LUT_BIAS;\n	return uv;\n}\nfloat LTC_ClippedSphereFormFactor( const in vec3 f ) {\n	float l = length( f );\n	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );\n}\nvec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {\n	float x = dot( v1, v2 );\n	float y = abs( x );\n	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;\n	float b = 3.4175940 + ( 4.1616724 + y ) * y;\n	float v = a / b;\n	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;\n	return cross( v1, v2 ) * theta_sintheta;\n}\nvec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {\n	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];\n	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];\n	vec3 lightNormal = cross( v1, v2 );\n	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );\n	vec3 T1, T2;\n	T1 = normalize( V - N * dot( V, N ) );\n	T2 = - cross( N, T1 );\n	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );\n	vec3 coords[ 4 ];\n	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );\n	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );\n	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );\n	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );\n	coords[ 0 ] = normalize( coords[ 0 ] );\n	coords[ 1 ] = normalize( coords[ 1 ] );\n	coords[ 2 ] = normalize( coords[ 2 ] );\n	coords[ 3 ] = normalize( coords[ 3 ] );\n	vec3 vectorFormFactor = vec3( 0.0 );\n	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );\n	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );\n	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );\n	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );\n	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );\n	return vec3( result );\n}\n#if defined( USE_SHEEN )\nfloat D_Charlie( float roughness, float dotNH ) {\n	float alpha = pow2( roughness );\n	float invAlpha = 1.0 / alpha;\n	float cos2h = dotNH * dotNH;\n	float sin2h = max( 1.0 - cos2h, 0.0078125 );\n	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );\n}\nfloat V_Neubelt( float dotNV, float dotNL ) {\n	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );\n}\nvec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {\n	vec3 halfDir = normalize( lightDir + viewDir );\n	float dotNL = saturate( dot( normal, lightDir ) );\n	float dotNV = saturate( dot( normal, viewDir ) );\n	float dotNH = saturate( dot( normal, halfDir ) );\n	float D = D_Charlie( sheenRoughness, dotNH );\n	float V = V_Neubelt( dotNV, dotNL );\n	return sheenColor * ( D * V );\n}\n#endif\nfloat IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {\n	float dotNV = saturate( dot( normal, viewDir ) );\n	float r2 = roughness * roughness;\n	float rInv = 1.0 / ( roughness + 0.1 );\n	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;\n	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;\n	float DG = exp( a * dotNV + b );\n	return saturate( DG );\n}\nvec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {\n	float dotNV = saturate( dot( normal, viewDir ) );\n	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;\n	return specularColor * fab.x + specularF90 * fab.y;\n}\n#ifdef USE_IRIDESCENCE\nvoid computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {\n#else\nvoid computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {\n#endif\n	#ifdef USE_IRIDESCENCE\n		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );\n	#else\n		vec3 Fr = specularColor;\n	#endif\n	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;\n	float Ess = fab.x + fab.y;\n	float Ems = 1.0 - Ess;\n	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );\n	singleScatter += FssEss;\n	multiScatter += Fms * Ems;\n}\n#if NUM_RECT_AREA_LIGHTS > 0\n	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {\n		vec3 normal = geometryNormal;\n		vec3 viewDir = geometryViewDir;\n		vec3 position = geometryPosition;\n		vec3 lightPos = rectAreaLight.position;\n		vec3 halfWidth = rectAreaLight.halfWidth;\n		vec3 halfHeight = rectAreaLight.halfHeight;\n		vec3 lightColor = rectAreaLight.color;\n		float roughness = material.roughness;\n		vec3 rectCoords[ 4 ];\n		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;\n		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;\n		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;\n		vec2 uv = LTC_Uv( normal, viewDir, roughness );\n		vec4 t1 = texture2D( ltc_1, uv );\n		vec4 t2 = texture2D( ltc_2, uv );\n		mat3 mInv = mat3(\n			vec3( t1.x, 0, t1.y ),\n			vec3(    0, 1,    0 ),\n			vec3( t1.z, 0, t1.w )\n		);\n		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );\n		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );\n		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );\n		#ifdef USE_CLEARCOAT\n			vec3 Ncc = geometryClearcoatNormal;\n			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );\n			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );\n			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );\n			mat3 mInvClearcoat = mat3(\n				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),\n				vec3(             0, 1,             0 ),\n				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )\n			);\n			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;\n			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );\n		#endif\n	}\n#endif\nvoid RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {\n	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );\n	vec3 irradiance = dotNL * directLight.color;\n	#ifdef USE_CLEARCOAT\n		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );\n		vec3 ccIrradiance = dotNLcc * directLight.color;\n		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );\n	#endif\n	#ifdef USE_SHEEN\n \n 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );\n \n 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );\n 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );\n \n 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );\n \n 		irradiance *= sheenEnergyComp;\n \n 	#endif\n	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );\n	#ifdef USE_RETROREFLECTION\n		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );\n		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );\n		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );\n	#endif\n	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;\n	vec3 halfDir = normalize( directLight.direction + geometryViewDir );\n	float dotVH = saturate( dot( geometryViewDir, halfDir ) );\n	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );\n	#ifdef USE_RETROREFLECTION\n		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );\n		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );\n		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );\n		F = mix( F, retroF, saturate( material.retroreflectivity ) );\n	#endif\n	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - F );\n}\nvoid RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {\n	vec3 singleScattering = vec3( 0.0 );\n	vec3 multiScattering = vec3( 0.0 );\n	#ifdef USE_IRIDESCENCE\n		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );\n	#else\n		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );\n	#endif\n	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );\n	#ifdef USE_SHEEN\n		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );\n		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;\n		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;\n		diffuse *= sheenEnergyComp;\n	#endif\n	reflectedLight.indirectDiffuse += diffuse;\n}\nvoid RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {\n	#ifdef USE_CLEARCOAT\n		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );\n	#endif\n	#ifdef USE_SHEEN\n		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;\n 	#endif\n	vec3 singleScatteringDielectric = vec3( 0.0 );\n	vec3 multiScatteringDielectric = vec3( 0.0 );\n	vec3 singleScatteringMetallic = vec3( 0.0 );\n	vec3 multiScatteringMetallic = vec3( 0.0 );\n	#ifdef USE_IRIDESCENCE\n		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );\n		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );\n	#else\n		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );\n		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );\n	#endif\n	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );\n	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );\n	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;\n	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );\n	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;\n	vec3 indirectSpecular = radiance * singleScattering;\n	indirectSpecular += multiScattering * cosineWeightedIrradiance;\n	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;\n	#ifdef USE_SHEEN\n		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );\n		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;\n		indirectSpecular *= sheenEnergyComp;\n		indirectDiffuse *= sheenEnergyComp;\n	#endif\n	reflectedLight.indirectSpecular += indirectSpecular;\n	reflectedLight.indirectDiffuse += indirectDiffuse;\n}\n#define RE_Direct				RE_Direct_Physical\n#define RE_Direct_RectArea		RE_Direct_RectArea_Physical\n#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical\n#define RE_IndirectSpecular		RE_IndirectSpecular_Physical\nfloat computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {\n	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );\n}",
	lights_fragment_begin: "\nvec3 geometryPosition = - vViewPosition;\nvec3 geometryNormal = normal;\nvec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );\nvec3 geometryClearcoatNormal = vec3( 0.0 );\n#ifdef USE_CLEARCOAT\n	geometryClearcoatNormal = clearcoatNormal;\n#endif\n#ifdef USE_IRIDESCENCE\n	float dotNVi = saturate( dot( normal, geometryViewDir ) );\n	if ( material.iridescenceThickness == 0.0 ) {\n		material.iridescence = 0.0;\n	} else {\n		material.iridescence = saturate( material.iridescence );\n	}\n	if ( material.iridescence > 0.0 ) {\n		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );\n		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );\n		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );\n		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );\n		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );\n	}\n#endif\n#ifdef STANDARD\n	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );\n	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;\n	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )\n		float EssMs = material.dfg.x + material.dfg.y;\n		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );\n	#endif\n#endif\nIncidentLight directLight;\n#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )\n	PointLight pointLight;\n	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0\n	PointLightShadow pointLightShadow;\n	#endif\n	#pragma unroll_loop_start\n	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {\n		pointLight = pointLights[ i ];\n		getPointLightInfo( pointLight, geometryPosition, directLight );\n		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )\n		pointLightShadow = pointLightShadows[ i ];\n		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;\n		#endif\n		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );\n	}\n	#pragma unroll_loop_end\n#endif\n#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )\n	SpotLight spotLight;\n	vec4 spotColor;\n	vec3 spotLightCoord;\n	bool inSpotLightMap;\n	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0\n	SpotLightShadow spotLightShadow;\n	#endif\n	#pragma unroll_loop_start\n	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {\n		spotLight = spotLights[ i ];\n		getSpotLightInfo( spotLight, geometryPosition, directLight );\n		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )\n		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX\n		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )\n		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS\n		#else\n		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )\n		#endif\n		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )\n			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;\n			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );\n			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );\n			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;\n		#endif\n		#undef SPOT_LIGHT_MAP_INDEX\n		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )\n		spotLightShadow = spotLightShadows[ i ];\n		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;\n		#endif\n		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );\n	}\n	#pragma unroll_loop_end\n#endif\n#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )\n	SunLight sunLight;\n	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0\n	SunLightShadow sunLightShadow;\n	#endif\n	#pragma unroll_loop_start\n	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {\n		sunLight = sunLights[ i ];\n		getSunLightInfo( sunLight, directLight );\n		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )\n		sunLightShadow = sunLightShadows[ i ];\n		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;\n		#endif\n		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );\n	}\n	#pragma unroll_loop_end\n#endif\n#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )\n	DirectionalLight directionalLight;\n	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0\n	DirectionalLightShadow directionalLightShadow;\n	#endif\n	#pragma unroll_loop_start\n	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {\n		directionalLight = directionalLights[ i ];\n		getDirectionalLightInfo( directionalLight, directLight );\n		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )\n		directionalLightShadow = directionalLightShadows[ i ];\n		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;\n		#endif\n		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );\n	}\n	#pragma unroll_loop_end\n#endif\n#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )\n	RectAreaLight rectAreaLight;\n	#pragma unroll_loop_start\n	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {\n		rectAreaLight = rectAreaLights[ i ];\n		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );\n	}\n	#pragma unroll_loop_end\n#endif\n#if defined( RE_IndirectDiffuse )\n	vec3 iblIrradiance = vec3( 0.0 );\n	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );\n	#if defined( USE_LIGHT_PROBES )\n		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );\n	#endif\n	#if ( NUM_HEMI_LIGHTS > 0 )\n		#pragma unroll_loop_start\n		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {\n			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );\n		}\n		#pragma unroll_loop_end\n	#endif\n	#ifdef USE_LIGHT_PROBES_GRID\n		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;\n		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );\n		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );\n	#endif\n#endif\n#if defined( RE_IndirectSpecular )\n	vec3 radiance = vec3( 0.0 );\n	vec3 clearcoatRadiance = vec3( 0.0 );\n#endif",
	lights_fragment_maps: "#if defined( RE_IndirectDiffuse )\n	#ifdef USE_LIGHTMAP\n		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );\n		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;\n		irradiance += lightMapIrradiance;\n	#endif\n	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )\n		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )\n			iblIrradiance += getIBLIrradiance( geometryNormal );\n		#endif\n	#endif\n#endif\n#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )\n	#ifdef USE_ANISOTROPY\n		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );\n	#else\n		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );\n	#endif\n	#ifdef USE_RETROREFLECTION\n		#ifdef USE_ANISOTROPY\n			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );\n		#else\n			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );\n		#endif\n		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );\n	#endif\n	radiance += iblRadiance;\n	#ifdef USE_CLEARCOAT\n		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );\n	#endif\n#endif",
	lights_fragment_end: "#if defined( RE_IndirectDiffuse )\n	#if defined( LAMBERT ) || defined( PHONG )\n		irradiance += iblIrradiance;\n	#endif\n	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );\n#endif\n#if defined( RE_IndirectSpecular )\n	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );\n#endif",
	lightprobes_pars_fragment: "#ifdef USE_LIGHT_PROBES_GRID\nuniform highp sampler3D probesSH;\nuniform vec3 probesMin;\nuniform vec3 probesMax;\nuniform vec3 probesResolution;\nvec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {\n	vec3 res = probesResolution;\n	vec3 gridRange = probesMax - probesMin;\n	vec3 resMinusOne = res - 1.0;\n	vec3 probeSpacing = gridRange / resMinusOne;\n	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;\n	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );\n	uvw = uvw * resMinusOne / res + 0.5 / res;\n	float nz          = res.z;\n	float paddedSlices = nz + 2.0;\n	float atlasDepth  = 7.0 * paddedSlices;\n	float uvZBase     = uvw.z * nz + 1.0;\n	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );\n	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );\n	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );\n	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );\n	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );\n	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );\n	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );\n	vec3 c0 = s0.xyz;\n	vec3 c1 = vec3( s0.w, s1.xy );\n	vec3 c2 = vec3( s1.zw, s2.x );\n	vec3 c3 = s2.yzw;\n	vec3 c4 = s3.xyz;\n	vec3 c5 = vec3( s3.w, s4.xy );\n	vec3 c6 = vec3( s4.zw, s5.x );\n	vec3 c7 = s5.yzw;\n	vec3 c8 = s6.xyz;\n	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;\n	vec3 result = c0 * 0.886227;\n	result += c1 * 2.0 * 0.511664 * y;\n	result += c2 * 2.0 * 0.511664 * z;\n	result += c3 * 2.0 * 0.511664 * x;\n	result += c4 * 2.0 * 0.429043 * x * y;\n	result += c5 * 2.0 * 0.429043 * y * z;\n	result += c6 * ( 0.743125 * z * z - 0.247708 );\n	result += c7 * 2.0 * 0.429043 * x * z;\n	result += c8 * 0.429043 * ( x * x - y * y );\n	return max( result, vec3( 0.0 ) );\n}\n#endif",
	logdepthbuf_fragment: "#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )\n	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;\n#endif",
	logdepthbuf_pars_fragment: "#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )\n	uniform float logDepthBufFC;\n	varying float vFragDepth;\n	varying float vIsPerspective;\n#endif",
	logdepthbuf_pars_vertex: "#ifdef USE_LOGARITHMIC_DEPTH_BUFFER\n	varying float vFragDepth;\n	varying float vIsPerspective;\n#endif",
	logdepthbuf_vertex: "#ifdef USE_LOGARITHMIC_DEPTH_BUFFER\n	vFragDepth = 1.0 + gl_Position.w;\n	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );\n#endif",
	map_fragment: "#ifdef USE_MAP\n	vec4 sampledDiffuseColor = texture2D( map, vMapUv );\n	#ifdef DECODE_VIDEO_TEXTURE\n		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );\n	#endif\n	diffuseColor *= sampledDiffuseColor;\n#endif",
	map_pars_fragment: "#ifdef USE_MAP\n	uniform sampler2D map;\n#endif",
	map_particle_fragment: "#if defined( USE_MAP ) || defined( USE_ALPHAMAP )\n	#if defined( USE_POINTS_UV )\n		vec2 uv = vUv;\n	#else\n		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;\n	#endif\n#endif\n#ifdef USE_MAP\n	diffuseColor *= texture2D( map, uv );\n#endif\n#ifdef USE_ALPHAMAP\n	diffuseColor.a *= texture2D( alphaMap, uv ).g;\n#endif",
	map_particle_pars_fragment: "#if defined( USE_POINTS_UV )\n	varying vec2 vUv;\n#else\n	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )\n		uniform mat3 uvTransform;\n	#endif\n#endif\n#ifdef USE_MAP\n	uniform sampler2D map;\n#endif\n#ifdef USE_ALPHAMAP\n	uniform sampler2D alphaMap;\n#endif",
	metalnessmap_fragment: "float metalnessFactor = metalness;\n#ifdef USE_METALNESSMAP\n	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );\n	metalnessFactor *= texelMetalness.b;\n#endif",
	metalnessmap_pars_fragment: "#ifdef USE_METALNESSMAP\n	uniform sampler2D metalnessMap;\n#endif",
	morphinstance_vertex: "#ifdef USE_INSTANCING_MORPH\n	float morphTargetInfluences[ MORPHTARGETS_COUNT ];\n	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;\n	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {\n		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;\n	}\n#endif",
	morphcolor_vertex: "#if defined( USE_MORPHCOLORS )\n	vColor *= morphTargetBaseInfluence;\n	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {\n		#if defined( USE_COLOR_ALPHA )\n			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];\n		#elif defined( USE_COLOR )\n			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];\n		#endif\n	}\n#endif",
	morphnormal_vertex: "#ifdef USE_MORPHNORMALS\n	objectNormal *= morphTargetBaseInfluence;\n	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {\n		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];\n	}\n#endif",
	morphtarget_pars_vertex: "#ifdef USE_MORPHTARGETS\n	#ifndef USE_INSTANCING_MORPH\n		uniform float morphTargetBaseInfluence;\n		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];\n	#endif\n	uniform sampler2DArray morphTargetsTexture;\n	uniform ivec2 morphTargetsTextureSize;\n	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {\n		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;\n		int y = texelIndex / morphTargetsTextureSize.x;\n		int x = texelIndex - y * morphTargetsTextureSize.x;\n		ivec3 morphUV = ivec3( x, y, morphTargetIndex );\n		return texelFetch( morphTargetsTexture, morphUV, 0 );\n	}\n#endif",
	morphtarget_vertex: "#ifdef USE_MORPHTARGETS\n	transformed *= morphTargetBaseInfluence;\n	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {\n		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];\n	}\n#endif",
	normal_fragment_begin: "float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;\n#ifdef FLAT_SHADED\n	vec3 fdx = dFdx( vViewPosition );\n	vec3 fdy = dFdy( vViewPosition );\n	vec3 normal = normalize( cross( fdx, fdy ) );\n#else\n	vec3 normal = normalize( vNormal );\n	#ifdef DOUBLE_SIDED\n		normal *= faceDirection;\n	#endif\n#endif\n#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )\n	#ifdef USE_TANGENT\n		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );\n	#else\n		mat3 tbn = getTangentFrame( - vViewPosition, normal,\n		#if defined( USE_NORMALMAP )\n			vNormalMapUv\n		#elif defined( USE_CLEARCOAT_NORMALMAP )\n			vClearcoatNormalMapUv\n		#else\n			vUv\n		#endif\n		);\n	#endif\n	#ifdef DOUBLE_SIDED\n		tbn[0] *= faceDirection;\n		tbn[1] *= faceDirection;\n	#endif\n#endif\n#ifdef USE_CLEARCOAT_NORMALMAP\n	#ifdef USE_TANGENT\n		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );\n	#else\n		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );\n	#endif\n	#ifdef DOUBLE_SIDED\n		tbn2[0] *= faceDirection;\n		tbn2[1] *= faceDirection;\n	#endif\n#endif\nvec3 nonPerturbedNormal = normal;",
	normal_fragment_maps: "#ifdef USE_NORMALMAP_OBJECTSPACE\n	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;\n	#ifdef FLIP_SIDED\n		normal = - normal;\n	#endif\n	#ifdef DOUBLE_SIDED\n		normal = normal * faceDirection;\n	#endif\n	normal = normalize( normalMatrix * normal );\n#elif defined( USE_NORMALMAP_TANGENTSPACE )\n	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;\n	#if defined( USE_PACKED_NORMALMAP )\n		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );\n	#endif\n	mapN.xy *= normalScale;\n	normal = normalize( tbn * mapN );\n#elif defined( USE_BUMPMAP )\n	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );\n#endif",
	normal_pars_fragment: "#ifndef FLAT_SHADED\n	varying vec3 vNormal;\n	#ifdef USE_TANGENT\n		varying vec3 vTangent;\n		varying vec3 vBitangent;\n	#endif\n#endif",
	normal_pars_vertex: "#ifndef FLAT_SHADED\n	varying vec3 vNormal;\n	#ifdef USE_TANGENT\n		varying vec3 vTangent;\n		varying vec3 vBitangent;\n	#endif\n#endif",
	normal_vertex: "#ifndef FLAT_SHADED\n	vNormal = normalize( transformedNormal );\n	#ifdef USE_TANGENT\n		vTangent = normalize( transformedTangent );\n		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );\n		#ifdef FLIP_SIDED\n			vBitangent = - vBitangent;\n		#endif\n	#endif\n#endif",
	normalmap_pars_fragment: "#ifdef USE_NORMALMAP\n	uniform sampler2D normalMap;\n	uniform vec2 normalScale;\n#endif\n#ifdef USE_NORMALMAP_OBJECTSPACE\n	uniform mat3 normalMatrix;\n#endif\n#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )\n	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {\n		vec3 q0 = dFdx( eye_pos.xyz );\n		vec3 q1 = dFdy( eye_pos.xyz );\n		vec2 st0 = dFdx( uv.st );\n		vec2 st1 = dFdy( uv.st );\n		vec3 N = surf_norm;\n		vec3 q1perp = cross( q1, N );\n		vec3 q0perp = cross( N, q0 );\n		vec3 T = q1perp * st0.x + q0perp * st1.x;\n		vec3 B = q1perp * st0.y + q0perp * st1.y;\n		float det = max( dot( T, T ), dot( B, B ) );\n		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );\n		return mat3( T * scale, B * scale, N );\n	}\n#endif",
	clearcoat_normal_fragment_begin: "#ifdef USE_CLEARCOAT\n	vec3 clearcoatNormal = nonPerturbedNormal;\n#endif",
	clearcoat_normal_fragment_maps: "#ifdef USE_CLEARCOAT_NORMALMAP\n	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;\n	clearcoatMapN.xy *= clearcoatNormalScale;\n	clearcoatNormal = normalize( tbn2 * clearcoatMapN );\n#endif",
	clearcoat_pars_fragment: "#ifdef USE_CLEARCOATMAP\n	uniform sampler2D clearcoatMap;\n#endif\n#ifdef USE_CLEARCOAT_NORMALMAP\n	uniform sampler2D clearcoatNormalMap;\n	uniform vec2 clearcoatNormalScale;\n#endif\n#ifdef USE_CLEARCOAT_ROUGHNESSMAP\n	uniform sampler2D clearcoatRoughnessMap;\n#endif",
	iridescence_pars_fragment: "#ifdef USE_IRIDESCENCEMAP\n	uniform sampler2D iridescenceMap;\n#endif\n#ifdef USE_IRIDESCENCE_THICKNESSMAP\n	uniform sampler2D iridescenceThicknessMap;\n#endif",
	opaque_fragment: "#ifdef OPAQUE\ndiffuseColor.a = 1.0;\n#endif\n#ifdef USE_TRANSMISSION\ndiffuseColor.a *= material.transmissionAlpha;\n#endif\ngl_FragColor = vec4( outgoingLight, diffuseColor.a );",
	packing: "vec3 packNormalToRGB( const in vec3 normal ) {\n	return normalize( normal ) * 0.5 + 0.5;\n}\nvec3 unpackRGBToNormal( const in vec3 rgb ) {\n	return 2.0 * rgb.xyz - 1.0;\n}\nconst float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;\nconst float Inv255 = 1. / 255.;\nconst vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );\nconst vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );\nconst vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );\nconst vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );\nvec4 packDepthToRGBA( const in float v ) {\n	if( v <= 0.0 )\n		return vec4( 0., 0., 0., 0. );\n	if( v >= 1.0 )\n		return vec4( 1., 1., 1., 1. );\n	float vuf;\n	float af = modf( v * PackFactors.a, vuf );\n	float bf = modf( vuf * ShiftRight8, vuf );\n	float gf = modf( vuf * ShiftRight8, vuf );\n	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );\n}\nvec3 packDepthToRGB( const in float v ) {\n	if( v <= 0.0 )\n		return vec3( 0., 0., 0. );\n	if( v >= 1.0 )\n		return vec3( 1., 1., 1. );\n	float vuf;\n	float bf = modf( v * PackFactors.b, vuf );\n	float gf = modf( vuf * ShiftRight8, vuf );\n	return vec3( vuf * Inv255, gf * PackUpscale, bf );\n}\nvec2 packDepthToRG( const in float v ) {\n	if( v <= 0.0 )\n		return vec2( 0., 0. );\n	if( v >= 1.0 )\n		return vec2( 1., 1. );\n	float vuf;\n	float gf = modf( v * 256., vuf );\n	return vec2( vuf * Inv255, gf );\n}\nfloat unpackRGBAToDepth( const in vec4 v ) {\n	return dot( v, UnpackFactors4 );\n}\nfloat unpackRGBToDepth( const in vec3 v ) {\n	return dot( v, UnpackFactors3 );\n}\nfloat unpackRGToDepth( const in vec2 v ) {\n	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;\n}\nvec4 pack2HalfToRGBA( const in vec2 v ) {\n	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );\n	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );\n}\nvec2 unpackRGBATo2Half( const in vec4 v ) {\n	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );\n}\nfloat viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {\n	return ( viewZ + near ) / ( near - far );\n}\nfloat orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {\n	#ifdef USE_REVERSED_DEPTH_BUFFER\n	\n		return depth * ( far - near ) - far;\n	#else\n		return depth * ( near - far ) - near;\n	#endif\n}\nfloat viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {\n	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );\n}\nfloat perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {\n	\n	#ifdef USE_REVERSED_DEPTH_BUFFER\n		return ( near * far ) / ( ( near - far ) * depth - near );\n	#else\n		return ( near * far ) / ( ( far - near ) * depth - far );\n	#endif\n}",
	premultiplied_alpha_fragment: "#ifdef PREMULTIPLIED_ALPHA\n	gl_FragColor.rgb *= gl_FragColor.a;\n#endif",
	project_vertex: "vec4 mvPosition = vec4( transformed, 1.0 );\n#ifdef USE_BATCHING\n	mvPosition = batchingMatrix * mvPosition;\n#endif\n#ifdef USE_INSTANCING\n	mvPosition = instanceMatrix * mvPosition;\n#endif\nmvPosition = modelViewMatrix * mvPosition;\ngl_Position = projectionMatrix * mvPosition;",
	dithering_fragment: "#ifdef DITHERING\n	gl_FragColor.rgb = dithering( gl_FragColor.rgb );\n#endif",
	dithering_pars_fragment: "#ifdef DITHERING\n	vec3 dithering( vec3 color ) {\n		float grid_position = rand( gl_FragCoord.xy );\n		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );\n		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );\n		return color + dither_shift_RGB;\n	}\n#endif",
	roughnessmap_fragment: "float roughnessFactor = roughness;\n#ifdef USE_ROUGHNESSMAP\n	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );\n	roughnessFactor *= texelRoughness.g;\n#endif",
	roughnessmap_pars_fragment: "#ifdef USE_ROUGHNESSMAP\n	uniform sampler2D roughnessMap;\n#endif",
	shadowmap_pars_fragment: "#if NUM_SPOT_LIGHT_COORDS > 0\n	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];\n#endif\n#if NUM_SPOT_LIGHT_MAPS > 0\n	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];\n#endif\n#ifdef USE_SHADOWMAP\n	#if NUM_SUN_LIGHT_SHADOWS > 0\n		#define SUN_LIGHT_CASCADES 2\n		#if defined( SHADOWMAP_TYPE_PCF )\n			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];\n		#else\n			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];\n		#endif\n		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];\n		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];\n		varying vec4 vSunShadowWorldPosition;\n		varying vec3 vSunShadowWorldNormal;\n		struct SunLightShadow {\n			float shadowIntensity;\n			float shadowBias;\n			float shadowNormalBias;\n			float shadowRadius;\n			vec2 shadowMapSize;\n		};\n		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];\n	#endif\n	#if NUM_DIR_LIGHT_SHADOWS > 0\n		#if defined( SHADOWMAP_TYPE_PCF )\n			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];\n		#else\n			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];\n		#endif\n		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];\n		struct DirectionalLightShadow {\n			float shadowIntensity;\n			float shadowBias;\n			float shadowNormalBias;\n			float shadowRadius;\n			vec2 shadowMapSize;\n		};\n		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];\n	#endif\n	#if NUM_SPOT_LIGHT_SHADOWS > 0\n		#if defined( SHADOWMAP_TYPE_PCF )\n			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];\n		#else\n			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];\n		#endif\n		struct SpotLightShadow {\n			float shadowIntensity;\n			float shadowBias;\n			float shadowNormalBias;\n			float shadowRadius;\n			vec2 shadowMapSize;\n		};\n		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];\n	#endif\n	#if NUM_POINT_LIGHT_SHADOWS > 0\n		#if defined( SHADOWMAP_TYPE_PCF )\n			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];\n		#elif defined( SHADOWMAP_TYPE_BASIC )\n			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];\n		#endif\n		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];\n		struct PointLightShadow {\n			float shadowIntensity;\n			float shadowBias;\n			float shadowNormalBias;\n			float shadowRadius;\n			vec2 shadowMapSize;\n			float shadowCameraNear;\n			float shadowCameraFar;\n		};\n		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];\n	#endif\n	#if defined( SHADOWMAP_TYPE_PCF )\n		float interleavedGradientNoise( vec2 position ) {\n			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );\n		}\n		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {\n			const float goldenAngle = 2.399963229728653;\n			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );\n			float theta = float( sampleIndex ) * goldenAngle + phi;\n			return vec2( cos( theta ), sin( theta ) ) * r;\n		}\n	#endif\n	#if defined( SHADOWMAP_TYPE_PCF )\n		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {\n			float shadow = 1.0;\n			shadowCoord.xyz /= shadowCoord.w;\n			shadowCoord.z += shadowBias;\n			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;\n			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;\n			if ( frustumTest ) {\n				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;\n				float radius = shadowRadius * texelSize.x;\n				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;\n				shadow = (\n					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +\n					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +\n					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +\n					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +\n					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )\n				) * 0.2;\n			}\n			return mix( 1.0, shadow, shadowIntensity );\n		}\n	#elif defined( SHADOWMAP_TYPE_VSM )\n		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {\n			float shadow = 1.0;\n			shadowCoord.xyz /= shadowCoord.w;\n			#ifdef USE_REVERSED_DEPTH_BUFFER\n				shadowCoord.z -= shadowBias;\n			#else\n				shadowCoord.z += shadowBias;\n			#endif\n			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;\n			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;\n			if ( frustumTest ) {\n				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;\n				float mean = distribution.x;\n				float variance = distribution.y * distribution.y;\n				#ifdef USE_REVERSED_DEPTH_BUFFER\n					float hard_shadow = step( mean, shadowCoord.z );\n				#else\n					float hard_shadow = step( shadowCoord.z, mean );\n				#endif\n				\n				if ( hard_shadow == 1.0 ) {\n					shadow = 1.0;\n				} else {\n					variance = max( variance, 0.0000001 );\n					float d = shadowCoord.z - mean;\n					float p_max = variance / ( variance + d * d );\n					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );\n					shadow = max( hard_shadow, p_max );\n				}\n			}\n			return mix( 1.0, shadow, shadowIntensity );\n		}\n	#else\n		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {\n			float shadow = 1.0;\n			shadowCoord.xyz /= shadowCoord.w;\n			#ifdef USE_REVERSED_DEPTH_BUFFER\n				shadowCoord.z -= shadowBias;\n			#else\n				shadowCoord.z += shadowBias;\n			#endif\n			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;\n			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;\n			if ( frustumTest ) {\n				float depth = texture2D( shadowMap, shadowCoord.xy ).r;\n				#ifdef USE_REVERSED_DEPTH_BUFFER\n					shadow = step( depth, shadowCoord.z );\n				#else\n					shadow = step( shadowCoord.z, depth );\n				#endif\n			}\n			return mix( 1.0, shadow, shadowIntensity );\n		}\n	#endif\n	#if NUM_SUN_LIGHT_SHADOWS > 0\n		float getSunShadow(\n			#if defined( SHADOWMAP_TYPE_PCF )\n				sampler2DShadow shadowMap,\n			#else\n				sampler2D shadowMap,\n			#endif\n			SunLightShadow sunLightShadow,\n			int shadowIndex\n		) {\n			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );\n			float viewDepth = vSunShadowWorldPosition.w;\n			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;\n			float shadow = 1.0;\n			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {\n				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];\n				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {\n					float cascadeShadow = getShadow(\n						shadowMap,\n						sunLightShadow.shadowMapSize,\n						sunLightShadow.shadowIntensity,\n						sunLightShadow.shadowBias,\n						sunLightShadow.shadowRadius,\n						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition\n					);\n					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );\n				}\n			}\n			return shadow;\n		}\n	#endif\n	#if NUM_POINT_LIGHT_SHADOWS > 0\n	#if defined( SHADOWMAP_TYPE_PCF )\n	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {\n		float shadow = 1.0;\n		vec3 lightToPosition = shadowCoord.xyz;\n		vec3 bd3D = normalize( lightToPosition );\n		vec3 absVec = abs( lightToPosition );\n		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );\n		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {\n			#ifdef USE_REVERSED_DEPTH_BUFFER\n				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );\n				dp -= shadowBias;\n			#else\n				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );\n				dp += shadowBias;\n			#endif\n			float texelSize = shadowRadius / shadowMapSize.x;\n			vec3 absDir = abs( bd3D );\n			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );\n			tangent = normalize( cross( bd3D, tangent ) );\n			vec3 bitangent = cross( bd3D, tangent );\n			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;\n			vec2 sample0 = vogelDiskSample( 0, 5, phi );\n			vec2 sample1 = vogelDiskSample( 1, 5, phi );\n			vec2 sample2 = vogelDiskSample( 2, 5, phi );\n			vec2 sample3 = vogelDiskSample( 3, 5, phi );\n			vec2 sample4 = vogelDiskSample( 4, 5, phi );\n			shadow = (\n				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +\n				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +\n				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +\n				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +\n				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )\n			) * 0.2;\n		}\n		return mix( 1.0, shadow, shadowIntensity );\n	}\n	#elif defined( SHADOWMAP_TYPE_BASIC )\n	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {\n		float shadow = 1.0;\n		vec3 lightToPosition = shadowCoord.xyz;\n		vec3 absVec = abs( lightToPosition );\n		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );\n		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {\n			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );\n			dp += shadowBias;\n			vec3 bd3D = normalize( lightToPosition );\n			float depth = textureCube( shadowMap, bd3D ).r;\n			#ifdef USE_REVERSED_DEPTH_BUFFER\n				depth = 1.0 - depth;\n			#endif\n			shadow = step( dp, depth );\n		}\n		return mix( 1.0, shadow, shadowIntensity );\n	}\n	#endif\n	#endif\n#endif",
	shadowmap_pars_vertex: "#if NUM_SPOT_LIGHT_COORDS > 0\n	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];\n	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];\n#endif\n#ifdef USE_SHADOWMAP\n	#if NUM_SUN_LIGHT_SHADOWS > 0\n		varying vec4 vSunShadowWorldPosition;\n		varying vec3 vSunShadowWorldNormal;\n	#endif\n	#if NUM_DIR_LIGHT_SHADOWS > 0\n		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];\n		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];\n		struct DirectionalLightShadow {\n			float shadowIntensity;\n			float shadowBias;\n			float shadowNormalBias;\n			float shadowRadius;\n			vec2 shadowMapSize;\n		};\n		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];\n	#endif\n	#if NUM_SPOT_LIGHT_SHADOWS > 0\n		struct SpotLightShadow {\n			float shadowIntensity;\n			float shadowBias;\n			float shadowNormalBias;\n			float shadowRadius;\n			vec2 shadowMapSize;\n		};\n		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];\n	#endif\n	#if NUM_POINT_LIGHT_SHADOWS > 0\n		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];\n		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];\n		struct PointLightShadow {\n			float shadowIntensity;\n			float shadowBias;\n			float shadowNormalBias;\n			float shadowRadius;\n			vec2 shadowMapSize;\n			float shadowCameraNear;\n			float shadowCameraFar;\n		};\n		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];\n	#endif\n#endif",
	shadowmap_vertex: "#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )\n	#ifdef HAS_NORMAL\n		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );\n	#else\n		vec3 shadowWorldNormal = vec3( 0.0 );\n	#endif\n	vec4 shadowWorldPosition;\n#endif\n#if defined( USE_SHADOWMAP )\n	#if NUM_SUN_LIGHT_SHADOWS > 0\n		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );\n		vSunShadowWorldNormal = shadowWorldNormal;\n	#endif\n	#if NUM_DIR_LIGHT_SHADOWS > 0\n		#pragma unroll_loop_start\n		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {\n			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );\n			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;\n		}\n		#pragma unroll_loop_end\n	#endif\n	#if NUM_POINT_LIGHT_SHADOWS > 0\n		#pragma unroll_loop_start\n		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {\n			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );\n			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;\n		}\n		#pragma unroll_loop_end\n	#endif\n#endif\n#if NUM_SPOT_LIGHT_COORDS > 0\n	#pragma unroll_loop_start\n	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {\n		shadowWorldPosition = worldPosition;\n		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )\n			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;\n		#endif\n		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;\n	}\n	#pragma unroll_loop_end\n#endif",
	shadowmask_pars_fragment: "float getShadowMask() {\n	float shadow = 1.0;\n	#ifdef USE_SHADOWMAP\n	#if NUM_SUN_LIGHT_SHADOWS > 0\n	SunLightShadow sunLight;\n	#pragma unroll_loop_start\n	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {\n		sunLight = sunLightShadows[ i ];\n		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;\n	}\n	#pragma unroll_loop_end\n	#endif\n	#if NUM_DIR_LIGHT_SHADOWS > 0\n	DirectionalLightShadow directionalLight;\n	#pragma unroll_loop_start\n	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {\n		directionalLight = directionalLightShadows[ i ];\n		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;\n	}\n	#pragma unroll_loop_end\n	#endif\n	#if NUM_SPOT_LIGHT_SHADOWS > 0\n	SpotLightShadow spotLight;\n	#pragma unroll_loop_start\n	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {\n		spotLight = spotLightShadows[ i ];\n		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;\n	}\n	#pragma unroll_loop_end\n	#endif\n	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )\n	PointLightShadow pointLight;\n	#pragma unroll_loop_start\n	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {\n		pointLight = pointLightShadows[ i ];\n		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;\n	}\n	#pragma unroll_loop_end\n	#endif\n	#endif\n	return shadow;\n}",
	skinbase_vertex: "#ifdef USE_SKINNING\n	mat4 boneMatX = getBoneMatrix( skinIndex.x );\n	mat4 boneMatY = getBoneMatrix( skinIndex.y );\n	mat4 boneMatZ = getBoneMatrix( skinIndex.z );\n	mat4 boneMatW = getBoneMatrix( skinIndex.w );\n#endif",
	skinning_pars_vertex: "#ifdef USE_SKINNING\n	uniform mat4 bindMatrix;\n	uniform mat4 bindMatrixInverse;\n	uniform highp sampler2D boneTexture;\n	mat4 getBoneMatrix( const in float i ) {\n		int size = textureSize( boneTexture, 0 ).x;\n		int j = int( i ) * 4;\n		int x = j % size;\n		int y = j / size;\n		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );\n		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );\n		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );\n		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );\n		return mat4( v1, v2, v3, v4 );\n	}\n#endif",
	skinning_vertex: "#ifdef USE_SKINNING\n	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );\n	vec4 skinned = vec4( 0.0 );\n	skinned += boneMatX * skinVertex * skinWeight.x;\n	skinned += boneMatY * skinVertex * skinWeight.y;\n	skinned += boneMatZ * skinVertex * skinWeight.z;\n	skinned += boneMatW * skinVertex * skinWeight.w;\n	transformed = ( bindMatrixInverse * skinned ).xyz;\n#endif",
	skinnormal_vertex: "#ifdef USE_SKINNING\n	mat4 skinMatrix = mat4( 0.0 );\n	skinMatrix += skinWeight.x * boneMatX;\n	skinMatrix += skinWeight.y * boneMatY;\n	skinMatrix += skinWeight.z * boneMatZ;\n	skinMatrix += skinWeight.w * boneMatW;\n	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;\n	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;\n	#ifdef USE_TANGENT\n		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;\n	#endif\n#endif",
	specularmap_fragment: "float specularStrength;\n#ifdef USE_SPECULARMAP\n	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );\n	specularStrength = texelSpecular.r;\n#else\n	specularStrength = 1.0;\n#endif",
	specularmap_pars_fragment: "#ifdef USE_SPECULARMAP\n	uniform sampler2D specularMap;\n#endif",
	tonemapping_fragment: "#if defined( TONE_MAPPING )\n	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );\n#endif",
	tonemapping_pars_fragment: "#ifndef saturate\n#define saturate( a ) clamp( a, 0.0, 1.0 )\n#endif\nuniform float toneMappingExposure;\nvec3 LinearToneMapping( vec3 color ) {\n	return saturate( toneMappingExposure * color );\n}\nvec3 ReinhardToneMapping( vec3 color ) {\n	color *= toneMappingExposure;\n	return saturate( color / ( vec3( 1.0 ) + color ) );\n}\nvec3 CineonToneMapping( vec3 color ) {\n	color *= toneMappingExposure;\n	color = max( vec3( 0.0 ), color - 0.004 );\n	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );\n}\nvec3 RRTAndODTFit( vec3 v ) {\n	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;\n	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;\n	return a / b;\n}\nvec3 ACESFilmicToneMapping( vec3 color ) {\n	const mat3 ACESInputMat = mat3(\n		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),\n		vec3( 0.04823, 0.01566, 0.83777 )\n	);\n	const mat3 ACESOutputMat = mat3(\n		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),\n		vec3( -0.07367, -0.00605,  1.07602 )\n	);\n	color *= toneMappingExposure / 0.6;\n	color = ACESInputMat * color;\n	color = RRTAndODTFit( color );\n	color = ACESOutputMat * color;\n	return saturate( color );\n}\nconst mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(\n	vec3( 1.6605, - 0.1246, - 0.0182 ),\n	vec3( - 0.5876, 1.1329, - 0.1006 ),\n	vec3( - 0.0728, - 0.0083, 1.1187 )\n);\nconst mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(\n	vec3( 0.6274, 0.0691, 0.0164 ),\n	vec3( 0.3293, 0.9195, 0.0880 ),\n	vec3( 0.0433, 0.0113, 0.8956 )\n);\nvec3 agxDefaultContrastApprox( vec3 x ) {\n	vec3 x2 = x * x;\n	vec3 x4 = x2 * x2;\n	return + 15.5 * x4 * x2\n		- 40.14 * x4 * x\n		+ 31.96 * x4\n		- 6.868 * x2 * x\n		+ 0.4298 * x2\n		+ 0.1191 * x\n		- 0.00232;\n}\nvec3 AgXToneMapping( vec3 color ) {\n	const mat3 AgXInsetMatrix = mat3(\n		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),\n		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),\n		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )\n	);\n	const mat3 AgXOutsetMatrix = mat3(\n		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),\n		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),\n		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )\n	);\n	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;\n	color *= toneMappingExposure;\n	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;\n	color = AgXInsetMatrix * color;\n	color = max( color, 1e-10 );	color = log2( color );\n	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );\n	color = clamp( color, 0.0, 1.0 );\n	color = agxDefaultContrastApprox( color );\n	color = AgXOutsetMatrix * color;\n	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );\n	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;\n	color = clamp( color, 0.0, 1.0 );\n	return color;\n}\nvec3 NeutralToneMapping( vec3 color ) {\n	const float StartCompression = 0.8 - 0.04;\n	const float Desaturation = 0.15;\n	color *= toneMappingExposure;\n	float x = min( color.r, min( color.g, color.b ) );\n	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;\n	color -= offset;\n	float peak = max( color.r, max( color.g, color.b ) );\n	if ( peak < StartCompression ) return color;\n	float d = 1. - StartCompression;\n	float newPeak = 1. - d * d / ( peak + d - StartCompression );\n	color *= newPeak / peak;\n	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );\n	return mix( color, vec3( newPeak ), g );\n}\nvec3 CustomToneMapping( vec3 color ) { return color; }",
	transmission_fragment: "#ifdef USE_TRANSMISSION\n	material.transmission = transmission;\n	material.transmissionAlpha = 1.0;\n	material.thickness = thickness;\n	material.attenuationDistance = attenuationDistance;\n	material.attenuationColor = attenuationColor;\n	#ifdef USE_TRANSMISSIONMAP\n		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;\n	#endif\n	#ifdef USE_THICKNESSMAP\n		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;\n	#endif\n	vec3 pos = vWorldPosition;\n	vec3 v = normalize( cameraPosition - pos );\n	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );\n	vec4 transmitted = getIBLVolumeRefraction(\n		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,\n		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,\n		material.attenuationColor, material.attenuationDistance );\n	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );\n	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );\n#endif",
	transmission_pars_fragment: "#ifdef USE_TRANSMISSION\n	uniform float transmission;\n	uniform float thickness;\n	uniform float attenuationDistance;\n	uniform vec3 attenuationColor;\n	#ifdef USE_TRANSMISSIONMAP\n		uniform sampler2D transmissionMap;\n	#endif\n	#ifdef USE_THICKNESSMAP\n		uniform sampler2D thicknessMap;\n	#endif\n	uniform vec2 transmissionSamplerSize;\n	uniform sampler2D transmissionSamplerMap;\n	uniform mat4 modelMatrix;\n	uniform mat4 projectionMatrix;\n	varying vec3 vWorldPosition;\n	float w0( float a ) {\n		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );\n	}\n	float w1( float a ) {\n		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );\n	}\n	float w2( float a ){\n		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );\n	}\n	float w3( float a ) {\n		return ( 1.0 / 6.0 ) * ( a * a * a );\n	}\n	float g0( float a ) {\n		return w0( a ) + w1( a );\n	}\n	float g1( float a ) {\n		return w2( a ) + w3( a );\n	}\n	float h0( float a ) {\n		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );\n	}\n	float h1( float a ) {\n		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );\n	}\n	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {\n		uv = uv * texelSize.zw + 0.5;\n		vec2 iuv = floor( uv );\n		vec2 fuv = fract( uv );\n		float g0x = g0( fuv.x );\n		float g1x = g1( fuv.x );\n		float h0x = h0( fuv.x );\n		float h1x = h1( fuv.x );\n		float h0y = h0( fuv.y );\n		float h1y = h1( fuv.y );\n		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;\n		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;\n		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;\n		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;\n		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +\n			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );\n	}\n	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {\n		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );\n		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );\n		vec2 fLodSizeInv = 1.0 / fLodSize;\n		vec2 cLodSizeInv = 1.0 / cLodSize;\n		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );\n		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );\n		return mix( fSample, cSample, fract( lod ) );\n	}\n	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {\n		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );\n		vec3 modelScale;\n		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );\n		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );\n		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );\n		return normalize( refractionVector ) * thickness * modelScale;\n	}\n	float applyIorToRoughness( const in float roughness, const in float ior ) {\n		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );\n	}\n	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {\n		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );\n		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );\n	}\n	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {\n		if ( isinf( attenuationDistance ) ) {\n			return vec3( 1.0 );\n		} else {\n			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;\n			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;\n		}\n	}\n	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,\n		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,\n		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,\n		const in vec3 attenuationColor, const in float attenuationDistance ) {\n		vec4 transmittedLight;\n		vec3 transmittance;\n		#ifdef USE_DISPERSION\n			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;\n			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );\n			for ( int i = 0; i < 3; i ++ ) {\n				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );\n				vec3 refractedRayExit = position + transmissionRay;\n				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );\n				vec2 refractionCoords = ndcPos.xy / ndcPos.w;\n				refractionCoords += 1.0;\n				refractionCoords /= 2.0;\n				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );\n				transmittedLight[ i ] = transmissionSample[ i ];\n				transmittedLight.a += transmissionSample.a;\n				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];\n			}\n			transmittedLight.a /= 3.0;\n		#else\n			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );\n			vec3 refractedRayExit = position + transmissionRay;\n			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );\n			vec2 refractionCoords = ndcPos.xy / ndcPos.w;\n			refractionCoords += 1.0;\n			refractionCoords /= 2.0;\n			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );\n			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );\n		#endif\n		vec3 attenuatedColor = transmittance * transmittedLight.rgb;\n		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );\n		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;\n		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );\n	}\n#endif",
	uv_pars_fragment: "#if defined( USE_UV ) || defined( USE_ANISOTROPY )\n	varying vec2 vUv;\n#endif\n#ifdef USE_MAP\n	varying vec2 vMapUv;\n#endif\n#ifdef USE_ALPHAMAP\n	varying vec2 vAlphaMapUv;\n#endif\n#ifdef USE_LIGHTMAP\n	varying vec2 vLightMapUv;\n#endif\n#ifdef USE_AOMAP\n	varying vec2 vAoMapUv;\n#endif\n#ifdef USE_BUMPMAP\n	varying vec2 vBumpMapUv;\n#endif\n#ifdef USE_NORMALMAP\n	varying vec2 vNormalMapUv;\n#endif\n#ifdef USE_EMISSIVEMAP\n	varying vec2 vEmissiveMapUv;\n#endif\n#ifdef USE_METALNESSMAP\n	varying vec2 vMetalnessMapUv;\n#endif\n#ifdef USE_ROUGHNESSMAP\n	varying vec2 vRoughnessMapUv;\n#endif\n#ifdef USE_ANISOTROPYMAP\n	varying vec2 vAnisotropyMapUv;\n#endif\n#ifdef USE_CLEARCOATMAP\n	varying vec2 vClearcoatMapUv;\n#endif\n#ifdef USE_CLEARCOAT_NORMALMAP\n	varying vec2 vClearcoatNormalMapUv;\n#endif\n#ifdef USE_CLEARCOAT_ROUGHNESSMAP\n	varying vec2 vClearcoatRoughnessMapUv;\n#endif\n#ifdef USE_IRIDESCENCEMAP\n	varying vec2 vIridescenceMapUv;\n#endif\n#ifdef USE_IRIDESCENCE_THICKNESSMAP\n	varying vec2 vIridescenceThicknessMapUv;\n#endif\n#ifdef USE_SHEEN_COLORMAP\n	varying vec2 vSheenColorMapUv;\n#endif\n#ifdef USE_SHEEN_ROUGHNESSMAP\n	varying vec2 vSheenRoughnessMapUv;\n#endif\n#ifdef USE_SPECULARMAP\n	varying vec2 vSpecularMapUv;\n#endif\n#ifdef USE_SPECULAR_COLORMAP\n	varying vec2 vSpecularColorMapUv;\n#endif\n#ifdef USE_SPECULAR_INTENSITYMAP\n	varying vec2 vSpecularIntensityMapUv;\n#endif\n#ifdef USE_TRANSMISSIONMAP\n	uniform mat3 transmissionMapTransform;\n	varying vec2 vTransmissionMapUv;\n#endif\n#ifdef USE_THICKNESSMAP\n	uniform mat3 thicknessMapTransform;\n	varying vec2 vThicknessMapUv;\n#endif",
	uv_pars_vertex: "#if defined( USE_UV ) || defined( USE_ANISOTROPY )\n	varying vec2 vUv;\n#endif\n#ifdef USE_MAP\n	uniform mat3 mapTransform;\n	varying vec2 vMapUv;\n#endif\n#ifdef USE_ALPHAMAP\n	uniform mat3 alphaMapTransform;\n	varying vec2 vAlphaMapUv;\n#endif\n#ifdef USE_LIGHTMAP\n	uniform mat3 lightMapTransform;\n	varying vec2 vLightMapUv;\n#endif\n#ifdef USE_AOMAP\n	uniform mat3 aoMapTransform;\n	varying vec2 vAoMapUv;\n#endif\n#ifdef USE_BUMPMAP\n	uniform mat3 bumpMapTransform;\n	varying vec2 vBumpMapUv;\n#endif\n#ifdef USE_NORMALMAP\n	uniform mat3 normalMapTransform;\n	varying vec2 vNormalMapUv;\n#endif\n#ifdef USE_DISPLACEMENTMAP\n	uniform mat3 displacementMapTransform;\n	varying vec2 vDisplacementMapUv;\n#endif\n#ifdef USE_EMISSIVEMAP\n	uniform mat3 emissiveMapTransform;\n	varying vec2 vEmissiveMapUv;\n#endif\n#ifdef USE_METALNESSMAP\n	uniform mat3 metalnessMapTransform;\n	varying vec2 vMetalnessMapUv;\n#endif\n#ifdef USE_ROUGHNESSMAP\n	uniform mat3 roughnessMapTransform;\n	varying vec2 vRoughnessMapUv;\n#endif\n#ifdef USE_ANISOTROPYMAP\n	uniform mat3 anisotropyMapTransform;\n	varying vec2 vAnisotropyMapUv;\n#endif\n#ifdef USE_CLEARCOATMAP\n	uniform mat3 clearcoatMapTransform;\n	varying vec2 vClearcoatMapUv;\n#endif\n#ifdef USE_CLEARCOAT_NORMALMAP\n	uniform mat3 clearcoatNormalMapTransform;\n	varying vec2 vClearcoatNormalMapUv;\n#endif\n#ifdef USE_CLEARCOAT_ROUGHNESSMAP\n	uniform mat3 clearcoatRoughnessMapTransform;\n	varying vec2 vClearcoatRoughnessMapUv;\n#endif\n#ifdef USE_SHEEN_COLORMAP\n	uniform mat3 sheenColorMapTransform;\n	varying vec2 vSheenColorMapUv;\n#endif\n#ifdef USE_SHEEN_ROUGHNESSMAP\n	uniform mat3 sheenRoughnessMapTransform;\n	varying vec2 vSheenRoughnessMapUv;\n#endif\n#ifdef USE_IRIDESCENCEMAP\n	uniform mat3 iridescenceMapTransform;\n	varying vec2 vIridescenceMapUv;\n#endif\n#ifdef USE_IRIDESCENCE_THICKNESSMAP\n	uniform mat3 iridescenceThicknessMapTransform;\n	varying vec2 vIridescenceThicknessMapUv;\n#endif\n#ifdef USE_SPECULARMAP\n	uniform mat3 specularMapTransform;\n	varying vec2 vSpecularMapUv;\n#endif\n#ifdef USE_SPECULAR_COLORMAP\n	uniform mat3 specularColorMapTransform;\n	varying vec2 vSpecularColorMapUv;\n#endif\n#ifdef USE_SPECULAR_INTENSITYMAP\n	uniform mat3 specularIntensityMapTransform;\n	varying vec2 vSpecularIntensityMapUv;\n#endif\n#ifdef USE_TRANSMISSIONMAP\n	uniform mat3 transmissionMapTransform;\n	varying vec2 vTransmissionMapUv;\n#endif\n#ifdef USE_THICKNESSMAP\n	uniform mat3 thicknessMapTransform;\n	varying vec2 vThicknessMapUv;\n#endif",
	uv_vertex: "#if defined( USE_UV ) || defined( USE_ANISOTROPY )\n	vUv = vec3( uv, 1 ).xy;\n#endif\n#ifdef USE_MAP\n	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_ALPHAMAP\n	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_LIGHTMAP\n	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_AOMAP\n	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_BUMPMAP\n	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_NORMALMAP\n	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_DISPLACEMENTMAP\n	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_EMISSIVEMAP\n	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_METALNESSMAP\n	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_ROUGHNESSMAP\n	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_ANISOTROPYMAP\n	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_CLEARCOATMAP\n	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_CLEARCOAT_NORMALMAP\n	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_CLEARCOAT_ROUGHNESSMAP\n	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_IRIDESCENCEMAP\n	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_IRIDESCENCE_THICKNESSMAP\n	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_SHEEN_COLORMAP\n	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_SHEEN_ROUGHNESSMAP\n	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_SPECULARMAP\n	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_SPECULAR_COLORMAP\n	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_SPECULAR_INTENSITYMAP\n	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_TRANSMISSIONMAP\n	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;\n#endif\n#ifdef USE_THICKNESSMAP\n	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;\n#endif",
	worldpos_vertex: "#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0\n	vec4 worldPosition = vec4( transformed, 1.0 );\n	#ifdef USE_BATCHING\n		worldPosition = batchingMatrix * worldPosition;\n	#endif\n	#ifdef USE_INSTANCING\n		worldPosition = instanceMatrix * worldPosition;\n	#endif\n	worldPosition = modelMatrix * worldPosition;\n#endif",
	background_vert: "varying vec2 vUv;\nuniform mat3 uvTransform;\nvoid main() {\n	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;\n	gl_Position = vec4( position.xy, 1.0, 1.0 );\n}",
	background_frag: "uniform sampler2D t2D;\nuniform float backgroundIntensity;\nvarying vec2 vUv;\nvoid main() {\n	vec4 texColor = texture2D( t2D, vUv );\n	#ifdef DECODE_VIDEO_TEXTURE\n		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );\n	#endif\n	texColor.rgb *= backgroundIntensity;\n	gl_FragColor = texColor;\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n}",
	backgroundCube_vert: "varying vec3 vWorldDirection;\n#include <common>\nvoid main() {\n	vWorldDirection = transformDirection( position, modelMatrix );\n	#include <begin_vertex>\n	#include <project_vertex>\n	gl_Position.z = gl_Position.w;\n}",
	backgroundCube_frag: "#ifdef ENVMAP_TYPE_CUBE\n	uniform samplerCube envMap;\n#elif defined( ENVMAP_TYPE_CUBE_UV )\n	uniform sampler2D envMap;\n#endif\nuniform float backgroundBlurriness;\nuniform float backgroundIntensity;\nuniform mat3 backgroundRotation;\nvarying vec3 vWorldDirection;\n#include <cube_uv_reflection_fragment>\nvoid main() {\n	#ifdef ENVMAP_TYPE_CUBE\n		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );\n	#elif defined( ENVMAP_TYPE_CUBE_UV )\n		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );\n	#else\n		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );\n	#endif\n	texColor.rgb *= backgroundIntensity;\n	gl_FragColor = texColor;\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n}",
	cube_vert: "varying vec3 vWorldDirection;\n#include <common>\nvoid main() {\n	vWorldDirection = transformDirection( position, modelMatrix );\n	#include <begin_vertex>\n	#include <project_vertex>\n	gl_Position.z = gl_Position.w;\n}",
	cube_frag: "uniform samplerCube tCube;\nuniform float tFlip;\nuniform float opacity;\nvarying vec3 vWorldDirection;\nvoid main() {\n	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );\n	gl_FragColor = texColor;\n	gl_FragColor.a *= opacity;\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n}",
	depth_vert: "#include <common>\n#include <batching_pars_vertex>\n#include <uv_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvarying vec2 vHighPrecisionZW;\nvoid main() {\n	#include <uv_vertex>\n	#include <batching_vertex>\n	#include <skinbase_vertex>\n	#include <morphinstance_vertex>\n	#ifdef USE_DISPLACEMENTMAP\n		#include <beginnormal_vertex>\n		#include <morphnormal_vertex>\n		#include <skinnormal_vertex>\n	#endif\n	#include <begin_vertex>\n	#include <morphtarget_vertex>\n	#include <skinning_vertex>\n	#include <displacementmap_vertex>\n	#include <project_vertex>\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n	vHighPrecisionZW = gl_Position.zw;\n}",
	depth_frag: "#if DEPTH_PACKING == 3200\n	uniform float opacity;\n#endif\n#include <common>\n#include <packing>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <alphahash_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvarying vec2 vHighPrecisionZW;\nvoid main() {\n	vec4 diffuseColor = vec4( 1.0 );\n	#include <clipping_planes_fragment>\n	#if DEPTH_PACKING == 3200\n		diffuseColor.a = opacity;\n	#endif\n	#include <map_fragment>\n	#include <alphamap_fragment>\n	#include <alphatest_fragment>\n	#include <alphahash_fragment>\n	#include <logdepthbuf_fragment>\n	#ifdef USE_REVERSED_DEPTH_BUFFER\n		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];\n	#else\n		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;\n	#endif\n	#if DEPTH_PACKING == 3200\n		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );\n	#elif DEPTH_PACKING == 3201\n		gl_FragColor = packDepthToRGBA( fragCoordZ );\n	#elif DEPTH_PACKING == 3202\n		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );\n	#elif DEPTH_PACKING == 3203\n		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );\n	#endif\n}",
	distance_vert: "#define DISTANCE\nvarying vec3 vWorldPosition;\n#include <common>\n#include <batching_pars_vertex>\n#include <uv_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	#include <uv_vertex>\n	#include <batching_vertex>\n	#include <skinbase_vertex>\n	#include <morphinstance_vertex>\n	#ifdef USE_DISPLACEMENTMAP\n		#include <beginnormal_vertex>\n		#include <morphnormal_vertex>\n		#include <skinnormal_vertex>\n	#endif\n	#include <begin_vertex>\n	#include <morphtarget_vertex>\n	#include <skinning_vertex>\n	#include <displacementmap_vertex>\n	#include <project_vertex>\n	#include <worldpos_vertex>\n	#include <clipping_planes_vertex>\n	vWorldPosition = worldPosition.xyz;\n}",
	distance_frag: "#define DISTANCE\nuniform vec3 referencePosition;\nuniform float nearDistance;\nuniform float farDistance;\nvarying vec3 vWorldPosition;\n#include <common>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <alphahash_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	vec4 diffuseColor = vec4( 1.0 );\n	#include <clipping_planes_fragment>\n	#include <map_fragment>\n	#include <alphamap_fragment>\n	#include <alphatest_fragment>\n	#include <alphahash_fragment>\n	float dist = length( vWorldPosition - referencePosition );\n	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );\n	dist = saturate( dist );\n	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );\n}",
	equirect_vert: "varying vec3 vWorldDirection;\n#include <common>\nvoid main() {\n	vWorldDirection = transformDirection( position, modelMatrix );\n	#include <begin_vertex>\n	#include <project_vertex>\n}",
	equirect_frag: "uniform sampler2D tEquirect;\nvarying vec3 vWorldDirection;\n#include <common>\nvoid main() {\n	vec3 direction = normalize( vWorldDirection );\n	vec2 sampleUV = equirectUv( direction );\n	gl_FragColor = texture2D( tEquirect, sampleUV );\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n}",
	linedashed_vert: "uniform float scale;\nattribute float lineDistance;\nvarying float vLineDistance;\n#include <common>\n#include <uv_pars_vertex>\n#include <color_pars_vertex>\n#include <fog_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	vLineDistance = scale * lineDistance;\n	#include <uv_vertex>\n	#include <color_vertex>\n	#include <morphinstance_vertex>\n	#include <morphcolor_vertex>\n	#include <begin_vertex>\n	#include <morphtarget_vertex>\n	#include <project_vertex>\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n	#include <fog_vertex>\n}",
	linedashed_frag: "uniform vec3 diffuse;\nuniform float opacity;\nuniform float dashSize;\nuniform float totalSize;\nvarying float vLineDistance;\n#include <common>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <fog_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	vec4 diffuseColor = vec4( diffuse, opacity );\n	#include <clipping_planes_fragment>\n	if ( mod( vLineDistance, totalSize ) > dashSize ) {\n		discard;\n	}\n	vec3 outgoingLight = vec3( 0.0 );\n	#include <logdepthbuf_fragment>\n	#include <map_fragment>\n	#include <color_fragment>\n	outgoingLight = diffuseColor.rgb;\n	#include <opaque_fragment>\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n	#include <fog_fragment>\n	#include <premultiplied_alpha_fragment>\n}",
	meshbasic_vert: "#include <common>\n#include <batching_pars_vertex>\n#include <uv_pars_vertex>\n#include <envmap_pars_vertex>\n#include <color_pars_vertex>\n#include <fog_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	#include <uv_vertex>\n	#include <color_vertex>\n	#include <morphinstance_vertex>\n	#include <morphcolor_vertex>\n	#include <batching_vertex>\n	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )\n		#include <beginnormal_vertex>\n		#include <morphnormal_vertex>\n		#include <skinbase_vertex>\n		#include <skinnormal_vertex>\n		#include <defaultnormal_vertex>\n	#endif\n	#include <begin_vertex>\n	#include <morphtarget_vertex>\n	#include <skinning_vertex>\n	#include <project_vertex>\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n	#include <worldpos_vertex>\n	#include <envmap_vertex>\n	#include <fog_vertex>\n}",
	meshbasic_frag: "uniform vec3 diffuse;\nuniform float opacity;\n#ifndef FLAT_SHADED\n	varying vec3 vNormal;\n#endif\n#include <common>\n#include <dithering_pars_fragment>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <alphahash_pars_fragment>\n#include <aomap_pars_fragment>\n#include <lightmap_pars_fragment>\n#include <envmap_common_pars_fragment>\n#include <envmap_pars_fragment>\n#include <fog_pars_fragment>\n#include <specularmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	vec4 diffuseColor = vec4( diffuse, opacity );\n	#include <clipping_planes_fragment>\n	#include <logdepthbuf_fragment>\n	#include <map_fragment>\n	#include <color_fragment>\n	#include <alphamap_fragment>\n	#include <alphatest_fragment>\n	#include <alphahash_fragment>\n	#include <specularmap_fragment>\n	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );\n	#ifdef USE_LIGHTMAP\n		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );\n		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;\n	#else\n		reflectedLight.indirectDiffuse += vec3( 1.0 );\n	#endif\n	#include <aomap_fragment>\n	reflectedLight.indirectDiffuse *= diffuseColor.rgb;\n	vec3 outgoingLight = reflectedLight.indirectDiffuse;\n	#include <envmap_fragment>\n	#include <opaque_fragment>\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n	#include <fog_fragment>\n	#include <premultiplied_alpha_fragment>\n	#include <dithering_fragment>\n}",
	meshlambert_vert: "#define LAMBERT\nvarying vec3 vViewPosition;\n#include <common>\n#include <batching_pars_vertex>\n#include <uv_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <envmap_pars_vertex>\n#include <color_pars_vertex>\n#include <fog_pars_vertex>\n#include <normal_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <shadowmap_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	#include <uv_vertex>\n	#include <color_vertex>\n	#include <morphinstance_vertex>\n	#include <morphcolor_vertex>\n	#include <batching_vertex>\n	#include <beginnormal_vertex>\n	#include <morphnormal_vertex>\n	#include <skinbase_vertex>\n	#include <skinnormal_vertex>\n	#include <defaultnormal_vertex>\n	#include <normal_vertex>\n	#include <begin_vertex>\n	#include <morphtarget_vertex>\n	#include <skinning_vertex>\n	#include <displacementmap_vertex>\n	#include <project_vertex>\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n	vViewPosition = - mvPosition.xyz;\n	#include <worldpos_vertex>\n	#include <envmap_vertex>\n	#include <shadowmap_vertex>\n	#include <fog_vertex>\n}",
	meshlambert_frag: "#define LAMBERT\nuniform vec3 diffuse;\nuniform vec3 emissive;\nuniform float opacity;\n#include <common>\n#include <dithering_pars_fragment>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <alphahash_pars_fragment>\n#include <aomap_pars_fragment>\n#include <lightmap_pars_fragment>\n#include <emissivemap_pars_fragment>\n#include <cube_uv_reflection_fragment>\n#include <envmap_common_pars_fragment>\n#include <envmap_pars_fragment>\n#include <envmap_physical_pars_fragment>\n#include <fog_pars_fragment>\n#include <bsdfs>\n#include <lights_pars_begin>\n#include <normal_pars_fragment>\n#include <lights_lambert_pars_fragment>\n#include <shadowmap_pars_fragment>\n#include <bumpmap_pars_fragment>\n#include <normalmap_pars_fragment>\n#include <specularmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	vec4 diffuseColor = vec4( diffuse, opacity );\n	#include <clipping_planes_fragment>\n	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );\n	vec3 totalEmissiveRadiance = emissive;\n	#include <logdepthbuf_fragment>\n	#include <map_fragment>\n	#include <color_fragment>\n	#include <alphamap_fragment>\n	#include <alphatest_fragment>\n	#include <alphahash_fragment>\n	#include <specularmap_fragment>\n	#include <normal_fragment_begin>\n	#include <normal_fragment_maps>\n	#include <emissivemap_fragment>\n	#include <lights_lambert_fragment>\n	#include <lights_fragment_begin>\n	#include <lights_fragment_maps>\n	#include <lights_fragment_end>\n	#include <aomap_fragment>\n	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;\n	#include <envmap_fragment>\n	#include <opaque_fragment>\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n	#include <fog_fragment>\n	#include <premultiplied_alpha_fragment>\n	#include <dithering_fragment>\n}",
	meshmatcap_vert: "#define MATCAP\nvarying vec3 vViewPosition;\n#include <common>\n#include <batching_pars_vertex>\n#include <uv_pars_vertex>\n#include <color_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <fog_pars_vertex>\n#include <normal_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	#include <uv_vertex>\n	#include <color_vertex>\n	#include <morphinstance_vertex>\n	#include <morphcolor_vertex>\n	#include <batching_vertex>\n	#include <beginnormal_vertex>\n	#include <morphnormal_vertex>\n	#include <skinbase_vertex>\n	#include <skinnormal_vertex>\n	#include <defaultnormal_vertex>\n	#include <normal_vertex>\n	#include <begin_vertex>\n	#include <morphtarget_vertex>\n	#include <skinning_vertex>\n	#include <displacementmap_vertex>\n	#include <project_vertex>\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n	#include <fog_vertex>\n	vViewPosition = - mvPosition.xyz;\n}",
	meshmatcap_frag: "#define MATCAP\nuniform vec3 diffuse;\nuniform float opacity;\nuniform sampler2D matcap;\nvarying vec3 vViewPosition;\n#include <common>\n#include <dithering_pars_fragment>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <alphahash_pars_fragment>\n#include <fog_pars_fragment>\n#include <normal_pars_fragment>\n#include <bumpmap_pars_fragment>\n#include <normalmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	vec4 diffuseColor = vec4( diffuse, opacity );\n	#include <clipping_planes_fragment>\n	#include <logdepthbuf_fragment>\n	#include <map_fragment>\n	#include <color_fragment>\n	#include <alphamap_fragment>\n	#include <alphatest_fragment>\n	#include <alphahash_fragment>\n	#include <normal_fragment_begin>\n	#include <normal_fragment_maps>\n	vec3 viewDir = normalize( vViewPosition );\n	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );\n	vec3 y = cross( viewDir, x );\n	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;\n	#ifdef USE_MATCAP\n		vec4 matcapColor = texture2D( matcap, uv );\n	#else\n		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );\n	#endif\n	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;\n	#include <opaque_fragment>\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n	#include <fog_fragment>\n	#include <premultiplied_alpha_fragment>\n	#include <dithering_fragment>\n}",
	meshnormal_vert: "#define NORMAL\n#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )\n	varying vec3 vViewPosition;\n#endif\n#include <common>\n#include <batching_pars_vertex>\n#include <uv_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <normal_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	#include <uv_vertex>\n	#include <batching_vertex>\n	#include <beginnormal_vertex>\n	#include <morphinstance_vertex>\n	#include <morphnormal_vertex>\n	#include <skinbase_vertex>\n	#include <skinnormal_vertex>\n	#include <defaultnormal_vertex>\n	#include <normal_vertex>\n	#include <begin_vertex>\n	#include <morphtarget_vertex>\n	#include <skinning_vertex>\n	#include <displacementmap_vertex>\n	#include <project_vertex>\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )\n	vViewPosition = - mvPosition.xyz;\n#endif\n}",
	meshnormal_frag: "#define NORMAL\nuniform float opacity;\n#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )\n	varying vec3 vViewPosition;\n#endif\n#include <uv_pars_fragment>\n#include <normal_pars_fragment>\n#include <bumpmap_pars_fragment>\n#include <normalmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );\n	#include <clipping_planes_fragment>\n	#include <logdepthbuf_fragment>\n	#include <normal_fragment_begin>\n	#include <normal_fragment_maps>\n	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );\n	#ifdef OPAQUE\n		gl_FragColor.a = 1.0;\n	#endif\n}",
	meshphong_vert: "#define PHONG\nvarying vec3 vViewPosition;\n#include <common>\n#include <batching_pars_vertex>\n#include <uv_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <envmap_pars_vertex>\n#include <color_pars_vertex>\n#include <fog_pars_vertex>\n#include <normal_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <shadowmap_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	#include <uv_vertex>\n	#include <color_vertex>\n	#include <morphcolor_vertex>\n	#include <batching_vertex>\n	#include <beginnormal_vertex>\n	#include <morphinstance_vertex>\n	#include <morphnormal_vertex>\n	#include <skinbase_vertex>\n	#include <skinnormal_vertex>\n	#include <defaultnormal_vertex>\n	#include <normal_vertex>\n	#include <begin_vertex>\n	#include <morphtarget_vertex>\n	#include <skinning_vertex>\n	#include <displacementmap_vertex>\n	#include <project_vertex>\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n	vViewPosition = - mvPosition.xyz;\n	#include <worldpos_vertex>\n	#include <envmap_vertex>\n	#include <shadowmap_vertex>\n	#include <fog_vertex>\n}",
	meshphong_frag: "#define PHONG\nuniform vec3 diffuse;\nuniform vec3 emissive;\nuniform vec3 specular;\nuniform float shininess;\nuniform float opacity;\n#include <common>\n#include <dithering_pars_fragment>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <alphahash_pars_fragment>\n#include <aomap_pars_fragment>\n#include <lightmap_pars_fragment>\n#include <emissivemap_pars_fragment>\n#include <cube_uv_reflection_fragment>\n#include <envmap_common_pars_fragment>\n#include <envmap_pars_fragment>\n#include <envmap_physical_pars_fragment>\n#include <fog_pars_fragment>\n#include <bsdfs>\n#include <lights_pars_begin>\n#include <normal_pars_fragment>\n#include <lights_phong_pars_fragment>\n#include <shadowmap_pars_fragment>\n#include <bumpmap_pars_fragment>\n#include <normalmap_pars_fragment>\n#include <specularmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	vec4 diffuseColor = vec4( diffuse, opacity );\n	#include <clipping_planes_fragment>\n	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );\n	vec3 totalEmissiveRadiance = emissive;\n	#include <logdepthbuf_fragment>\n	#include <map_fragment>\n	#include <color_fragment>\n	#include <alphamap_fragment>\n	#include <alphatest_fragment>\n	#include <alphahash_fragment>\n	#include <specularmap_fragment>\n	#include <normal_fragment_begin>\n	#include <normal_fragment_maps>\n	#include <emissivemap_fragment>\n	#include <lights_phong_fragment>\n	#include <lights_fragment_begin>\n	#include <lights_fragment_maps>\n	#include <lights_fragment_end>\n	#include <aomap_fragment>\n	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;\n	#include <envmap_fragment>\n	#include <opaque_fragment>\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n	#include <fog_fragment>\n	#include <premultiplied_alpha_fragment>\n	#include <dithering_fragment>\n}",
	meshphysical_vert: "#define STANDARD\nvarying vec3 vViewPosition;\n#ifdef USE_TRANSMISSION\n	varying vec3 vWorldPosition;\n#endif\n#include <common>\n#include <batching_pars_vertex>\n#include <uv_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <color_pars_vertex>\n#include <fog_pars_vertex>\n#include <normal_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <shadowmap_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	#include <uv_vertex>\n	#include <color_vertex>\n	#include <morphinstance_vertex>\n	#include <morphcolor_vertex>\n	#include <batching_vertex>\n	#include <beginnormal_vertex>\n	#include <morphnormal_vertex>\n	#include <skinbase_vertex>\n	#include <skinnormal_vertex>\n	#include <defaultnormal_vertex>\n	#include <normal_vertex>\n	#include <begin_vertex>\n	#include <morphtarget_vertex>\n	#include <skinning_vertex>\n	#include <displacementmap_vertex>\n	#include <project_vertex>\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n	vViewPosition = - mvPosition.xyz;\n	#include <worldpos_vertex>\n	#include <shadowmap_vertex>\n	#include <fog_vertex>\n#ifdef USE_TRANSMISSION\n	vWorldPosition = worldPosition.xyz;\n#endif\n}",
	meshphysical_frag: "#define STANDARD\n#ifdef PHYSICAL\n	#define IOR\n	#define USE_SPECULAR\n#endif\nuniform vec3 diffuse;\nuniform vec3 emissive;\nuniform float roughness;\nuniform float metalness;\nuniform float opacity;\n#ifdef IOR\n	uniform float ior;\n#endif\n#ifdef USE_SPECULAR\n	uniform float specularIntensity;\n	uniform vec3 specularColor;\n	#ifdef USE_SPECULAR_COLORMAP\n		uniform sampler2D specularColorMap;\n	#endif\n	#ifdef USE_SPECULAR_INTENSITYMAP\n		uniform sampler2D specularIntensityMap;\n	#endif\n#endif\n#ifdef USE_CLEARCOAT\n	uniform float clearcoat;\n	uniform float clearcoatRoughness;\n#endif\n#ifdef USE_DISPERSION\n	uniform float dispersion;\n#endif\n#ifdef USE_RETROREFLECTION\n	uniform float retroreflectivity;\n#endif\n#ifdef USE_IRIDESCENCE\n	uniform float iridescence;\n	uniform float iridescenceIOR;\n	uniform float iridescenceThicknessMinimum;\n	uniform float iridescenceThicknessMaximum;\n#endif\n#ifdef USE_SHEEN\n	uniform vec3 sheenColor;\n	uniform float sheenRoughness;\n	#ifdef USE_SHEEN_COLORMAP\n		uniform sampler2D sheenColorMap;\n	#endif\n	#ifdef USE_SHEEN_ROUGHNESSMAP\n		uniform sampler2D sheenRoughnessMap;\n	#endif\n#endif\n#ifdef USE_ANISOTROPY\n	uniform vec2 anisotropyVector;\n	#ifdef USE_ANISOTROPYMAP\n		uniform sampler2D anisotropyMap;\n	#endif\n#endif\nvarying vec3 vViewPosition;\n#include <common>\n#include <dithering_pars_fragment>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <alphahash_pars_fragment>\n#include <aomap_pars_fragment>\n#include <lightmap_pars_fragment>\n#include <emissivemap_pars_fragment>\n#include <iridescence_fragment>\n#include <cube_uv_reflection_fragment>\n#include <envmap_common_pars_fragment>\n#include <envmap_physical_pars_fragment>\n#include <fog_pars_fragment>\n#include <lights_pars_begin>\n#include <normal_pars_fragment>\n#include <lights_physical_pars_fragment>\n#include <transmission_pars_fragment>\n#include <shadowmap_pars_fragment>\n#include <bumpmap_pars_fragment>\n#include <normalmap_pars_fragment>\n#include <clearcoat_pars_fragment>\n#include <iridescence_pars_fragment>\n#include <roughnessmap_pars_fragment>\n#include <metalnessmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	vec4 diffuseColor = vec4( diffuse, opacity );\n	#include <clipping_planes_fragment>\n	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );\n	vec3 totalEmissiveRadiance = emissive;\n	#include <logdepthbuf_fragment>\n	#include <map_fragment>\n	#include <color_fragment>\n	#include <alphamap_fragment>\n	#include <alphatest_fragment>\n	#include <alphahash_fragment>\n	#include <roughnessmap_fragment>\n	#include <metalnessmap_fragment>\n	#include <normal_fragment_begin>\n	#include <normal_fragment_maps>\n	#include <clearcoat_normal_fragment_begin>\n	#include <clearcoat_normal_fragment_maps>\n	#include <emissivemap_fragment>\n	#include <lights_physical_fragment>\n	#include <lights_fragment_begin>\n	#include <lights_fragment_maps>\n	#include <lights_fragment_end>\n	#include <aomap_fragment>\n	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;\n	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;\n	#include <transmission_fragment>\n	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;\n	#ifdef USE_SHEEN\n \n		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;\n \n 	#endif\n	#ifdef USE_CLEARCOAT\n		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );\n		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );\n		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;\n	#endif\n	#include <opaque_fragment>\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n	#include <fog_fragment>\n	#include <premultiplied_alpha_fragment>\n	#include <dithering_fragment>\n}",
	meshtoon_vert: "#define TOON\nvarying vec3 vViewPosition;\n#include <common>\n#include <batching_pars_vertex>\n#include <uv_pars_vertex>\n#include <displacementmap_pars_vertex>\n#include <color_pars_vertex>\n#include <fog_pars_vertex>\n#include <normal_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <shadowmap_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	#include <uv_vertex>\n	#include <color_vertex>\n	#include <morphinstance_vertex>\n	#include <morphcolor_vertex>\n	#include <batching_vertex>\n	#include <beginnormal_vertex>\n	#include <morphnormal_vertex>\n	#include <skinbase_vertex>\n	#include <skinnormal_vertex>\n	#include <defaultnormal_vertex>\n	#include <normal_vertex>\n	#include <begin_vertex>\n	#include <morphtarget_vertex>\n	#include <skinning_vertex>\n	#include <displacementmap_vertex>\n	#include <project_vertex>\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n	vViewPosition = - mvPosition.xyz;\n	#include <worldpos_vertex>\n	#include <shadowmap_vertex>\n	#include <fog_vertex>\n}",
	meshtoon_frag: "#define TOON\nuniform vec3 diffuse;\nuniform vec3 emissive;\nuniform float opacity;\n#include <common>\n#include <dithering_pars_fragment>\n#include <color_pars_fragment>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <alphahash_pars_fragment>\n#include <aomap_pars_fragment>\n#include <lightmap_pars_fragment>\n#include <emissivemap_pars_fragment>\n#include <gradientmap_pars_fragment>\n#include <fog_pars_fragment>\n#include <bsdfs>\n#include <lights_pars_begin>\n#include <normal_pars_fragment>\n#include <lights_toon_pars_fragment>\n#include <shadowmap_pars_fragment>\n#include <bumpmap_pars_fragment>\n#include <normalmap_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	vec4 diffuseColor = vec4( diffuse, opacity );\n	#include <clipping_planes_fragment>\n	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );\n	vec3 totalEmissiveRadiance = emissive;\n	#include <logdepthbuf_fragment>\n	#include <map_fragment>\n	#include <color_fragment>\n	#include <alphamap_fragment>\n	#include <alphatest_fragment>\n	#include <alphahash_fragment>\n	#include <normal_fragment_begin>\n	#include <normal_fragment_maps>\n	#include <emissivemap_fragment>\n	#include <lights_toon_fragment>\n	#include <lights_fragment_begin>\n	#include <lights_fragment_maps>\n	#include <lights_fragment_end>\n	#include <aomap_fragment>\n	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;\n	#include <opaque_fragment>\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n	#include <fog_fragment>\n	#include <premultiplied_alpha_fragment>\n	#include <dithering_fragment>\n}",
	points_vert: "uniform float size;\nuniform float scale;\n#include <common>\n#include <color_pars_vertex>\n#include <fog_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\n#ifdef USE_POINTS_UV\n	varying vec2 vUv;\n	uniform mat3 uvTransform;\n#endif\nvoid main() {\n	#ifdef USE_POINTS_UV\n		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;\n	#endif\n	#include <color_vertex>\n	#include <morphinstance_vertex>\n	#include <morphcolor_vertex>\n	#include <begin_vertex>\n	#include <morphtarget_vertex>\n	#include <project_vertex>\n	gl_PointSize = size;\n	#ifdef USE_SIZEATTENUATION\n		bool isPerspective = isPerspectiveMatrix( projectionMatrix );\n		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );\n	#endif\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n	#include <worldpos_vertex>\n	#include <fog_vertex>\n}",
	points_frag: "uniform vec3 diffuse;\nuniform float opacity;\n#include <common>\n#include <color_pars_fragment>\n#include <map_particle_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <alphahash_pars_fragment>\n#include <fog_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	vec4 diffuseColor = vec4( diffuse, opacity );\n	#include <clipping_planes_fragment>\n	vec3 outgoingLight = vec3( 0.0 );\n	#include <logdepthbuf_fragment>\n	#include <map_particle_fragment>\n	#include <color_fragment>\n	#include <alphatest_fragment>\n	#include <alphahash_fragment>\n	outgoingLight = diffuseColor.rgb;\n	#include <opaque_fragment>\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n	#include <fog_fragment>\n	#include <premultiplied_alpha_fragment>\n}",
	shadow_vert: "#include <common>\n#include <batching_pars_vertex>\n#include <fog_pars_vertex>\n#include <morphtarget_pars_vertex>\n#include <skinning_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <shadowmap_pars_vertex>\nvoid main() {\n	#include <batching_vertex>\n	#include <beginnormal_vertex>\n	#include <morphinstance_vertex>\n	#include <morphnormal_vertex>\n	#include <skinbase_vertex>\n	#include <skinnormal_vertex>\n	#include <defaultnormal_vertex>\n	#include <begin_vertex>\n	#include <morphtarget_vertex>\n	#include <skinning_vertex>\n	#include <project_vertex>\n	#include <logdepthbuf_vertex>\n	#include <worldpos_vertex>\n	#include <shadowmap_vertex>\n	#include <fog_vertex>\n}",
	shadow_frag: "uniform vec3 color;\nuniform float opacity;\n#include <common>\n#include <fog_pars_fragment>\n#include <bsdfs>\n#include <lights_pars_begin>\n#include <logdepthbuf_pars_fragment>\n#include <shadowmap_pars_fragment>\n#include <shadowmask_pars_fragment>\nvoid main() {\n	#include <logdepthbuf_fragment>\n	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n	#include <fog_fragment>\n	#include <premultiplied_alpha_fragment>\n}",
	sprite_vert: "uniform float rotation;\nuniform vec2 center;\n#include <common>\n#include <uv_pars_vertex>\n#include <fog_pars_vertex>\n#include <logdepthbuf_pars_vertex>\n#include <clipping_planes_pars_vertex>\nvoid main() {\n	#include <uv_vertex>\n	vec4 mvPosition = modelViewMatrix[ 3 ];\n	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );\n	#ifndef USE_SIZEATTENUATION\n		bool isPerspective = isPerspectiveMatrix( projectionMatrix );\n		if ( isPerspective ) scale *= - mvPosition.z;\n	#endif\n	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;\n	vec2 rotatedPosition;\n	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;\n	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;\n	mvPosition.xy += rotatedPosition;\n	gl_Position = projectionMatrix * mvPosition;\n	#include <logdepthbuf_vertex>\n	#include <clipping_planes_vertex>\n	#include <fog_vertex>\n}",
	sprite_frag: "uniform vec3 diffuse;\nuniform float opacity;\n#include <common>\n#include <uv_pars_fragment>\n#include <map_pars_fragment>\n#include <alphamap_pars_fragment>\n#include <alphatest_pars_fragment>\n#include <alphahash_pars_fragment>\n#include <fog_pars_fragment>\n#include <logdepthbuf_pars_fragment>\n#include <clipping_planes_pars_fragment>\nvoid main() {\n	vec4 diffuseColor = vec4( diffuse, opacity );\n	#include <clipping_planes_fragment>\n	vec3 outgoingLight = vec3( 0.0 );\n	#include <logdepthbuf_fragment>\n	#include <map_fragment>\n	#include <alphamap_fragment>\n	#include <alphatest_fragment>\n	#include <alphahash_fragment>\n	outgoingLight = diffuseColor.rgb;\n	#include <opaque_fragment>\n	#include <tonemapping_fragment>\n	#include <colorspace_fragment>\n	#include <fog_fragment>\n}"
}, X = {
	common: {
		diffuse: { value: /*@__PURE__*/ new J(16777215) },
		opacity: { value: 1 },
		map: { value: null },
		mapTransform: { value: /*@__PURE__*/ new G() },
		alphaMap: { value: null },
		alphaMapTransform: { value: /*@__PURE__*/ new G() },
		alphaTest: { value: 0 }
	},
	specularmap: {
		specularMap: { value: null },
		specularMapTransform: { value: /*@__PURE__*/ new G() }
	},
	envmap: {
		envMap: { value: null },
		envMapRotation: { value: /*@__PURE__*/ new G() },
		reflectivity: { value: 1 },
		ior: { value: 1.5 },
		refractionRatio: { value: .98 },
		dfgLUT: { value: null }
	},
	aomap: {
		aoMap: { value: null },
		aoMapIntensity: { value: 1 },
		aoMapTransform: { value: /*@__PURE__*/ new G() }
	},
	lightmap: {
		lightMap: { value: null },
		lightMapIntensity: { value: 1 },
		lightMapTransform: { value: /*@__PURE__*/ new G() }
	},
	bumpmap: {
		bumpMap: { value: null },
		bumpMapTransform: { value: /*@__PURE__*/ new G() },
		bumpScale: { value: 1 }
	},
	normalmap: {
		normalMap: { value: null },
		normalMapTransform: { value: /*@__PURE__*/ new G() },
		normalScale: { value: /*@__PURE__*/ new H(1, 1) }
	},
	displacementmap: {
		displacementMap: { value: null },
		displacementMapTransform: { value: /*@__PURE__*/ new G() },
		displacementScale: { value: 1 },
		displacementBias: { value: 0 }
	},
	emissivemap: {
		emissiveMap: { value: null },
		emissiveMapTransform: { value: /*@__PURE__*/ new G() }
	},
	metalnessmap: {
		metalnessMap: { value: null },
		metalnessMapTransform: { value: /*@__PURE__*/ new G() }
	},
	roughnessmap: {
		roughnessMap: { value: null },
		roughnessMapTransform: { value: /*@__PURE__*/ new G() }
	},
	gradientmap: { gradientMap: { value: null } },
	fog: {
		fogDensity: { value: 25e-5 },
		fogNear: { value: 1 },
		fogFar: { value: 2e3 },
		fogColor: { value: /*@__PURE__*/ new J(16777215) }
	},
	lights: {
		ambientLightColor: { value: [] },
		lightProbe: { value: [] },
		sunLights: {
			value: [],
			properties: {
				direction: {},
				color: {}
			}
		},
		sunLightShadows: {
			value: [],
			properties: {
				shadowIntensity: 1,
				shadowBias: {},
				shadowNormalBias: {},
				shadowRadius: {},
				shadowMapSize: {}
			}
		},
		sunShadowMatrix: { value: [] },
		sunShadowCascade: { value: [] },
		directionalLights: {
			value: [],
			properties: {
				direction: {},
				color: {}
			}
		},
		directionalLightShadows: {
			value: [],
			properties: {
				shadowIntensity: 1,
				shadowBias: {},
				shadowNormalBias: {},
				shadowRadius: {},
				shadowMapSize: {}
			}
		},
		directionalShadowMatrix: { value: [] },
		spotLights: {
			value: [],
			properties: {
				color: {},
				position: {},
				direction: {},
				distance: {},
				coneCos: {},
				penumbraCos: {},
				decay: {}
			}
		},
		spotLightShadows: {
			value: [],
			properties: {
				shadowIntensity: 1,
				shadowBias: {},
				shadowNormalBias: {},
				shadowRadius: {},
				shadowMapSize: {}
			}
		},
		spotLightMap: { value: [] },
		spotLightMatrix: { value: [] },
		pointLights: {
			value: [],
			properties: {
				color: {},
				position: {},
				decay: {},
				distance: {}
			}
		},
		pointLightShadows: {
			value: [],
			properties: {
				shadowIntensity: 1,
				shadowBias: {},
				shadowNormalBias: {},
				shadowRadius: {},
				shadowMapSize: {},
				shadowCameraNear: {},
				shadowCameraFar: {}
			}
		},
		pointShadowMatrix: { value: [] },
		hemisphereLights: {
			value: [],
			properties: {
				direction: {},
				skyColor: {},
				groundColor: {}
			}
		},
		rectAreaLights: {
			value: [],
			properties: {
				color: {},
				position: {},
				width: {},
				height: {}
			}
		},
		ltc_1: { value: null },
		ltc_2: { value: null },
		probesSH: { value: null },
		probesMin: { value: /*@__PURE__*/ new W() },
		probesMax: { value: /*@__PURE__*/ new W() },
		probesResolution: { value: /*@__PURE__*/ new W() }
	},
	points: {
		diffuse: { value: /*@__PURE__*/ new J(16777215) },
		opacity: { value: 1 },
		size: { value: 1 },
		scale: { value: 1 },
		map: { value: null },
		alphaMap: { value: null },
		alphaMapTransform: { value: /*@__PURE__*/ new G() },
		alphaTest: { value: 0 },
		uvTransform: { value: /*@__PURE__*/ new G() }
	},
	sprite: {
		diffuse: { value: /*@__PURE__*/ new J(16777215) },
		opacity: { value: 1 },
		center: { value: /*@__PURE__*/ new H(.5, .5) },
		rotation: { value: 0 },
		map: { value: null },
		mapTransform: { value: /*@__PURE__*/ new G() },
		alphaMap: { value: null },
		alphaMapTransform: { value: /*@__PURE__*/ new G() },
		alphaTest: { value: 0 }
	}
}, uo = {
	basic: {
		uniforms: /*@__PURE__*/ hi([
			X.common,
			X.specularmap,
			X.envmap,
			X.aomap,
			X.lightmap,
			X.fog
		]),
		vertexShader: Y.meshbasic_vert,
		fragmentShader: Y.meshbasic_frag
	},
	lambert: {
		uniforms: /*@__PURE__*/ hi([
			X.common,
			X.specularmap,
			X.envmap,
			X.aomap,
			X.lightmap,
			X.emissivemap,
			X.bumpmap,
			X.normalmap,
			X.displacementmap,
			X.fog,
			X.lights,
			{
				emissive: { value: /*@__PURE__*/ new J(0) },
				envMapIntensity: { value: 1 }
			}
		]),
		vertexShader: Y.meshlambert_vert,
		fragmentShader: Y.meshlambert_frag
	},
	phong: {
		uniforms: /*@__PURE__*/ hi([
			X.common,
			X.specularmap,
			X.envmap,
			X.aomap,
			X.lightmap,
			X.emissivemap,
			X.bumpmap,
			X.normalmap,
			X.displacementmap,
			X.fog,
			X.lights,
			{
				emissive: { value: /*@__PURE__*/ new J(0) },
				specular: { value: /*@__PURE__*/ new J(1118481) },
				shininess: { value: 30 },
				envMapIntensity: { value: 1 }
			}
		]),
		vertexShader: Y.meshphong_vert,
		fragmentShader: Y.meshphong_frag
	},
	standard: {
		uniforms: /*@__PURE__*/ hi([
			X.common,
			X.envmap,
			X.aomap,
			X.lightmap,
			X.emissivemap,
			X.bumpmap,
			X.normalmap,
			X.displacementmap,
			X.roughnessmap,
			X.metalnessmap,
			X.fog,
			X.lights,
			{
				emissive: { value: /*@__PURE__*/ new J(0) },
				roughness: { value: 1 },
				metalness: { value: 0 },
				envMapIntensity: { value: 1 }
			}
		]),
		vertexShader: Y.meshphysical_vert,
		fragmentShader: Y.meshphysical_frag
	},
	toon: {
		uniforms: /*@__PURE__*/ hi([
			X.common,
			X.aomap,
			X.lightmap,
			X.emissivemap,
			X.bumpmap,
			X.normalmap,
			X.displacementmap,
			X.gradientmap,
			X.fog,
			X.lights,
			{ emissive: { value: /*@__PURE__*/ new J(0) } }
		]),
		vertexShader: Y.meshtoon_vert,
		fragmentShader: Y.meshtoon_frag
	},
	matcap: {
		uniforms: /*@__PURE__*/ hi([
			X.common,
			X.bumpmap,
			X.normalmap,
			X.displacementmap,
			X.fog,
			{ matcap: { value: null } }
		]),
		vertexShader: Y.meshmatcap_vert,
		fragmentShader: Y.meshmatcap_frag
	},
	points: {
		uniforms: /*@__PURE__*/ hi([X.points, X.fog]),
		vertexShader: Y.points_vert,
		fragmentShader: Y.points_frag
	},
	dashed: {
		uniforms: /*@__PURE__*/ hi([
			X.common,
			X.fog,
			{
				scale: { value: 1 },
				dashSize: { value: 1 },
				totalSize: { value: 2 }
			}
		]),
		vertexShader: Y.linedashed_vert,
		fragmentShader: Y.linedashed_frag
	},
	depth: {
		uniforms: /*@__PURE__*/ hi([X.common, X.displacementmap]),
		vertexShader: Y.depth_vert,
		fragmentShader: Y.depth_frag
	},
	normal: {
		uniforms: /*@__PURE__*/ hi([
			X.common,
			X.bumpmap,
			X.normalmap,
			X.displacementmap,
			{ opacity: { value: 1 } }
		]),
		vertexShader: Y.meshnormal_vert,
		fragmentShader: Y.meshnormal_frag
	},
	sprite: {
		uniforms: /*@__PURE__*/ hi([X.sprite, X.fog]),
		vertexShader: Y.sprite_vert,
		fragmentShader: Y.sprite_frag
	},
	background: {
		uniforms: {
			uvTransform: { value: /*@__PURE__*/ new G() },
			t2D: { value: null },
			backgroundIntensity: { value: 1 }
		},
		vertexShader: Y.background_vert,
		fragmentShader: Y.background_frag
	},
	backgroundCube: {
		uniforms: {
			envMap: { value: null },
			backgroundBlurriness: { value: 0 },
			backgroundIntensity: { value: 1 },
			backgroundRotation: { value: /*@__PURE__*/ new G() }
		},
		vertexShader: Y.backgroundCube_vert,
		fragmentShader: Y.backgroundCube_frag
	},
	cube: {
		uniforms: {
			tCube: { value: null },
			tFlip: { value: -1 },
			opacity: { value: 1 }
		},
		vertexShader: Y.cube_vert,
		fragmentShader: Y.cube_frag
	},
	equirect: {
		uniforms: { tEquirect: { value: null } },
		vertexShader: Y.equirect_vert,
		fragmentShader: Y.equirect_frag
	},
	distance: {
		uniforms: /*@__PURE__*/ hi([
			X.common,
			X.displacementmap,
			{
				referencePosition: { value: /*@__PURE__*/ new W() },
				nearDistance: { value: 1 },
				farDistance: { value: 1e3 }
			}
		]),
		vertexShader: Y.distance_vert,
		fragmentShader: Y.distance_frag
	},
	shadow: {
		uniforms: /*@__PURE__*/ hi([
			X.lights,
			X.fog,
			{
				color: { value: /*@__PURE__*/ new J(0) },
				opacity: { value: 1 }
			}
		]),
		vertexShader: Y.shadow_vert,
		fragmentShader: Y.shadow_frag
	}
};
uo.physical = {
	uniforms: /*@__PURE__*/ hi([uo.standard.uniforms, {
		clearcoat: { value: 0 },
		clearcoatMap: { value: null },
		clearcoatMapTransform: { value: /*@__PURE__*/ new G() },
		clearcoatNormalMap: { value: null },
		clearcoatNormalMapTransform: { value: /*@__PURE__*/ new G() },
		clearcoatNormalScale: { value: /*@__PURE__*/ new H(1, 1) },
		clearcoatRoughness: { value: 0 },
		clearcoatRoughnessMap: { value: null },
		clearcoatRoughnessMapTransform: { value: /*@__PURE__*/ new G() },
		dispersion: { value: 0 },
		retroreflectivity: { value: 0 },
		iridescence: { value: 0 },
		iridescenceMap: { value: null },
		iridescenceMapTransform: { value: /*@__PURE__*/ new G() },
		iridescenceIOR: { value: 1.3 },
		iridescenceThicknessMinimum: { value: 100 },
		iridescenceThicknessMaximum: { value: 400 },
		iridescenceThicknessMap: { value: null },
		iridescenceThicknessMapTransform: { value: /*@__PURE__*/ new G() },
		sheen: { value: 0 },
		sheenColor: { value: /*@__PURE__*/ new J(0) },
		sheenColorMap: { value: null },
		sheenColorMapTransform: { value: /*@__PURE__*/ new G() },
		sheenRoughness: { value: 1 },
		sheenRoughnessMap: { value: null },
		sheenRoughnessMapTransform: { value: /*@__PURE__*/ new G() },
		transmission: { value: 0 },
		transmissionMap: { value: null },
		transmissionMapTransform: { value: /*@__PURE__*/ new G() },
		transmissionSamplerSize: { value: /*@__PURE__*/ new H() },
		transmissionSamplerMap: { value: null },
		thickness: { value: 0 },
		thicknessMap: { value: null },
		thicknessMapTransform: { value: /*@__PURE__*/ new G() },
		attenuationDistance: { value: 0 },
		attenuationColor: { value: /*@__PURE__*/ new J(0) },
		specularColor: { value: /*@__PURE__*/ new J(1, 1, 1) },
		specularColorMap: { value: null },
		specularColorMapTransform: { value: /*@__PURE__*/ new G() },
		specularIntensity: { value: 1 },
		specularIntensityMap: { value: null },
		specularIntensityMapTransform: { value: /*@__PURE__*/ new G() },
		anisotropyVector: { value: /*@__PURE__*/ new H() },
		anisotropyMap: { value: null },
		anisotropyMapTransform: { value: /*@__PURE__*/ new G() }
	}]),
	vertexShader: Y.meshphysical_vert,
	fragmentShader: Y.meshphysical_frag
};
var fo = {
	r: 0,
	b: 0,
	g: 0
}, po = /*@__PURE__*/ new q(), mo = /*@__PURE__*/ new G();
mo.set(-1, 0, 0, 0, 1, 0, 0, 0, 1);
function ho(e, t, n, r, i, a) {
	let o = new J(0), s = i === !0 ? 0 : 1, c, l, u = null, d = 0, f = null;
	function p(e) {
		let n = e.isScene === !0 ? e.background : null;
		if (n && n.isTexture) {
			let r = e.backgroundBlurriness > 0;
			n = t.get(n, r);
		}
		return n;
	}
	function m(t) {
		let r = !1, i = p(t);
		i === null ? g(o, s) : i && i.isColor && (g(i, 1), r = !0);
		let c = e.xr.getEnvironmentBlendMode();
		c === "additive" ? n.buffers.color.setClear(0, 0, 0, 1, a) : c === "alpha-blend" && n.buffers.color.setClear(0, 0, 0, 0, a), (e.autoClear || r) && (n.buffers.depth.setTest(!0), n.buffers.depth.setMask(!0), n.buffers.color.setMask(!0), e.clear(e.autoClearColor, e.autoClearDepth, e.autoClearStencil));
	}
	function h(t, n) {
		let i = p(n);
		i && (i.isCubeTexture || i.mapping === 306) ? (l === void 0 && (l = new ur(new fi(1, 1, 1), new Si({
			name: "BackgroundCubeMaterial",
			uniforms: mi(uo.backgroundCube.uniforms),
			vertexShader: uo.backgroundCube.vertexShader,
			fragmentShader: uo.backgroundCube.fragmentShader,
			side: 1,
			depthTest: !1,
			depthWrite: !1,
			fog: !1,
			allowOverride: !1
		})), l.geometry.deleteAttribute("normal"), l.geometry.deleteAttribute("uv"), l.onBeforeRender = function(e, t, n) {
			this.matrixWorld.copyPosition(n.matrixWorld);
		}, Object.defineProperty(l.material, "envMap", { get: function() {
			return this.uniforms.envMap.value;
		} }), r.update(l)), l.material.uniforms.envMap.value = i, l.material.uniforms.backgroundBlurriness.value = n.backgroundBlurriness, l.material.uniforms.backgroundIntensity.value = n.backgroundIntensity, l.material.uniforms.backgroundRotation.value.setFromMatrix4(po.makeRotationFromEuler(n.backgroundRotation)).transpose(), i.isCubeTexture && i.isRenderTargetTexture === !1 && l.material.uniforms.backgroundRotation.value.premultiply(mo), l.material.toneMapped = K.getTransfer(i.colorSpace) !== P, (u !== i || d !== i.version || f !== e.toneMapping) && (l.material.needsUpdate = !0, u = i, d = i.version, f = e.toneMapping), l.layers.enableAll(), t.unshift(l, l.geometry, l.material, 0, 0, null)) : i && i.isTexture && (c === void 0 && (c = new ur(new pi(2, 2), new Si({
			name: "BackgroundMaterial",
			uniforms: mi(uo.background.uniforms),
			vertexShader: uo.background.vertexShader,
			fragmentShader: uo.background.fragmentShader,
			side: 0,
			depthTest: !1,
			depthWrite: !1,
			fog: !1,
			allowOverride: !1
		})), c.geometry.deleteAttribute("normal"), Object.defineProperty(c.material, "map", { get: function() {
			return this.uniforms.t2D.value;
		} }), r.update(c)), c.material.uniforms.t2D.value = i, c.material.uniforms.backgroundIntensity.value = n.backgroundIntensity, c.material.toneMapped = K.getTransfer(i.colorSpace) !== P, i.matrixAutoUpdate === !0 && i.updateMatrix(), c.material.uniforms.uvTransform.value.copy(i.matrix), (u !== i || d !== i.version || f !== e.toneMapping) && (c.material.needsUpdate = !0, u = i, d = i.version, f = e.toneMapping), c.layers.enableAll(), t.unshift(c, c.geometry, c.material, 0, 0, null));
	}
	function g(t, r) {
		t.getRGB(fo, vi(e)), n.buffers.color.setClear(fo.r, fo.g, fo.b, r, a);
	}
	function _() {
		l !== void 0 && (l.geometry.dispose(), l.material.dispose(), l = void 0), c !== void 0 && (c.geometry.dispose(), c.material.dispose(), c = void 0);
	}
	return {
		getClearColor: function() {
			return o;
		},
		setClearColor: function(e, t = 1) {
			o.set(e), s = t, g(o, s);
		},
		getClearAlpha: function() {
			return s;
		},
		setClearAlpha: function(e) {
			s = e, g(o, s);
		},
		render: m,
		addToRenderList: h,
		dispose: _
	};
}
function go(e, t) {
	let n = e.getParameter(e.MAX_VERTEX_ATTRIBS), r = {}, i = f(null), a = i, o = !1;
	function s(n, r, i, s, c) {
		let u = !1, f = d(n, s, i, r);
		a !== f && (a = f, l(a.object)), u = p(n, s, i, c), u && m(n, s, i, c), c !== null && t.update(c, e.ELEMENT_ARRAY_BUFFER), (u || o) && (o = !1, b(n, r, i, s), c !== null && e.bindBuffer(e.ELEMENT_ARRAY_BUFFER, t.get(c).buffer));
	}
	function c() {
		return e.createVertexArray();
	}
	function l(t) {
		return e.bindVertexArray(t);
	}
	function u(t) {
		return e.deleteVertexArray(t);
	}
	function d(e, t, n, i) {
		let a = i.wireframe === !0, o = r[t.id];
		o === void 0 && (o = {}, r[t.id] = o);
		let s = e.isInstancedMesh === !0 ? e.id : 0, l = o[s];
		l === void 0 && (l = {}, o[s] = l);
		let u = l[n.id];
		u === void 0 && (u = {}, l[n.id] = u);
		let d = u[a];
		return d === void 0 && (d = f(c()), u[a] = d), d;
	}
	function f(e) {
		let t = [], r = [], i = [];
		for (let e = 0; e < n; e++) t[e] = 0, r[e] = 0, i[e] = 0;
		return {
			geometry: null,
			program: null,
			wireframe: !1,
			newAttributes: t,
			enabledAttributes: r,
			attributeDivisors: i,
			object: e,
			attributes: {},
			index: null
		};
	}
	function p(e, t, n, r) {
		let i = a.attributes, o = t.attributes, s = 0, c = n.getAttributes();
		for (let t in c) if (c[t].location >= 0) {
			let n = i[t], r = o[t];
			if (r === void 0 && (t === "instanceMatrix" && e.instanceMatrix && (r = e.instanceMatrix), t === "instanceColor" && e.instanceColor && (r = e.instanceColor)), n === void 0 || n.attribute !== r || r && n.data !== r.data) return !0;
			s++;
		}
		return a.attributesNum !== s || a.index !== r;
	}
	function m(e, t, n, r) {
		let i = {}, o = t.attributes, s = 0, c = n.getAttributes();
		for (let t in c) if (c[t].location >= 0) {
			let n = o[t];
			n === void 0 && (t === "instanceMatrix" && e.instanceMatrix && (n = e.instanceMatrix), t === "instanceColor" && e.instanceColor && (n = e.instanceColor));
			let r = {};
			r.attribute = n, n && n.data && (r.data = n.data), i[t] = r, s++;
		}
		a.attributes = i, a.attributesNum = s, a.index = r;
	}
	function h() {
		let e = a.newAttributes;
		for (let t = 0, n = e.length; t < n; t++) e[t] = 0;
	}
	function g(e) {
		_(e, 0);
	}
	function _(t, n) {
		let r = a.newAttributes, i = a.enabledAttributes, o = a.attributeDivisors;
		r[t] = 1, i[t] === 0 && (e.enableVertexAttribArray(t), i[t] = 1), o[t] !== n && (e.vertexAttribDivisor(t, n), o[t] = n);
	}
	function v() {
		let t = a.newAttributes, n = a.enabledAttributes;
		for (let r = 0, i = n.length; r < i; r++) n[r] !== t[r] && (e.disableVertexAttribArray(r), n[r] = 0);
	}
	function y(t, n, r, i, a, o, s) {
		s === !0 ? e.vertexAttribIPointer(t, n, r, a, o) : e.vertexAttribPointer(t, n, r, i, a, o);
	}
	function b(n, r, i, a) {
		h();
		let o = a.attributes, s = i.getAttributes(), c = r.defaultAttributeValues;
		for (let r in s) {
			let i = s[r];
			if (i.location >= 0) {
				let s = o[r];
				if (s === void 0 && (r === "instanceMatrix" && n.instanceMatrix && (s = n.instanceMatrix), r === "instanceColor" && n.instanceColor && (s = n.instanceColor)), s !== void 0) {
					let r = s.normalized, o = s.itemSize, c = t.get(s);
					if (c === void 0) continue;
					let l = c.buffer, u = c.type, d = c.bytesPerElement, f = u === e.INT || u === e.UNSIGNED_INT || s.gpuType === 1013;
					if (s.isInterleavedBufferAttribute) {
						let t = s.data, c = t.stride, p = s.offset;
						if (t.isInstancedInterleavedBuffer) {
							for (let e = 0; e < i.locationSize; e++) _(i.location + e, t.meshPerAttribute);
							n.isInstancedMesh !== !0 && a._maxInstanceCount === void 0 && (a._maxInstanceCount = t.meshPerAttribute * t.count);
						} else for (let e = 0; e < i.locationSize; e++) g(i.location + e);
						e.bindBuffer(e.ARRAY_BUFFER, l);
						for (let e = 0; e < i.locationSize; e++) y(i.location + e, o / i.locationSize, u, r, c * d, (p + o / i.locationSize * e) * d, f);
					} else {
						if (s.isInstancedBufferAttribute) {
							for (let e = 0; e < i.locationSize; e++) _(i.location + e, s.meshPerAttribute);
							n.isInstancedMesh !== !0 && a._maxInstanceCount === void 0 && (a._maxInstanceCount = s.meshPerAttribute * s.count);
						} else for (let e = 0; e < i.locationSize; e++) g(i.location + e);
						e.bindBuffer(e.ARRAY_BUFFER, l);
						for (let e = 0; e < i.locationSize; e++) y(i.location + e, o / i.locationSize, u, r, o * d, o / i.locationSize * e * d, f);
					}
				} else if (c !== void 0) {
					let t = c[r];
					if (t !== void 0) switch (t.length) {
						case 2:
							e.vertexAttrib2fv(i.location, t);
							break;
						case 3:
							e.vertexAttrib3fv(i.location, t);
							break;
						case 4:
							e.vertexAttrib4fv(i.location, t);
							break;
						default: e.vertexAttrib1fv(i.location, t);
					}
				}
			}
		}
		v();
	}
	function x() {
		T();
		for (let e in r) {
			let t = r[e];
			for (let e in t) {
				let n = t[e];
				for (let e in n) {
					let t = n[e];
					for (let e in t) u(t[e].object), delete t[e];
					delete n[e];
				}
			}
			delete r[e];
		}
	}
	function S(e) {
		if (r[e.id] === void 0) return;
		let t = r[e.id];
		for (let e in t) {
			let n = t[e];
			for (let e in n) {
				let t = n[e];
				for (let e in t) u(t[e].object), delete t[e];
				delete n[e];
			}
		}
		delete r[e.id];
	}
	function C(e) {
		for (let t in r) {
			let n = r[t];
			for (let t in n) {
				let r = n[t];
				if (r[e.id] === void 0) continue;
				let i = r[e.id];
				for (let e in i) u(i[e].object), delete i[e];
				delete r[e.id];
			}
		}
	}
	function w(e) {
		for (let t in r) {
			let n = r[t], i = e.isInstancedMesh === !0 ? e.id : 0, a = n[i];
			if (a !== void 0) {
				for (let e in a) {
					let t = a[e];
					for (let e in t) u(t[e].object), delete t[e];
					delete a[e];
				}
				delete n[i], Object.keys(n).length === 0 && delete r[t];
			}
		}
	}
	function T() {
		E(), o = !0, a !== i && (a = i, l(a.object));
	}
	function E() {
		i.geometry = null, i.program = null, i.wireframe = !1;
	}
	return {
		setup: s,
		reset: T,
		resetDefaultState: E,
		dispose: x,
		releaseStatesOfGeometry: S,
		releaseStatesOfObject: w,
		releaseStatesOfProgram: C,
		initAttributes: h,
		enableAttribute: g,
		disableUnusedAttributes: v
	};
}
function _o(e, t, n) {
	let r;
	function i(e) {
		r = e;
	}
	function a(t, i) {
		e.drawArrays(r, t, i), n.update(i, r, 1);
	}
	function o(t, i, a) {
		a !== 0 && (e.drawArraysInstanced(r, t, i, a), n.update(i, r, a));
	}
	function s(e, i, a) {
		if (a === 0) return;
		t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(r, e, 0, i, 0, a);
		let o = 0;
		for (let e = 0; e < a; e++) o += i[e];
		n.update(o, r, 1);
	}
	this.setMode = i, this.render = a, this.renderInstances = o, this.renderMultiDraw = s;
}
function vo(e, t, n, r) {
	let i;
	function a() {
		if (i !== void 0) return i;
		if (t.has("EXT_texture_filter_anisotropic") === !0) {
			let n = t.get("EXT_texture_filter_anisotropic");
			i = e.getParameter(n.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
		} else i = 0;
		return i;
	}
	function o(t) {
		return t === 1023 || r.convert(t) === e.getParameter(e.IMPLEMENTATION_COLOR_READ_FORMAT);
	}
	function s(n) {
		let i = n === 1016 && (t.has("EXT_color_buffer_half_float") || t.has("EXT_color_buffer_float"));
		return !(n !== 1009 && n !== 1015 && !i && r.convert(n) !== e.getParameter(e.IMPLEMENTATION_COLOR_READ_TYPE));
	}
	function c(t) {
		if (t === "highp") {
			if (e.getShaderPrecisionFormat(e.VERTEX_SHADER, e.HIGH_FLOAT).precision > 0 && e.getShaderPrecisionFormat(e.FRAGMENT_SHADER, e.HIGH_FLOAT).precision > 0) return "highp";
			t = "mediump";
		}
		return t === "mediump" && e.getShaderPrecisionFormat(e.VERTEX_SHADER, e.MEDIUM_FLOAT).precision > 0 && e.getShaderPrecisionFormat(e.FRAGMENT_SHADER, e.MEDIUM_FLOAT).precision > 0 ? "mediump" : "lowp";
	}
	let l = n.precision === void 0 ? "highp" : n.precision, u = c(l);
	u !== l && (I("WebGLRenderer:", l, "not supported, using", u, "instead."), l = u);
	let d = n.logarithmicDepthBuffer === !0, f = n.reversedDepthBuffer === !0 && t.has("EXT_clip_control");
	n.reversedDepthBuffer === !0 && f === !1 && I("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");
	let p = e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS), m = e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS), h = e.getParameter(e.MAX_TEXTURE_SIZE), g = e.getParameter(e.MAX_CUBE_MAP_TEXTURE_SIZE), _ = e.getParameter(e.MAX_VERTEX_ATTRIBS), v = e.getParameter(e.MAX_VERTEX_UNIFORM_VECTORS), y = e.getParameter(e.MAX_VARYING_VECTORS), b = e.getParameter(e.MAX_FRAGMENT_UNIFORM_VECTORS), x = e.getParameter(e.MAX_SAMPLES), S = e.getParameter(e.SAMPLES);
	return {
		isWebGL2: !0,
		getMaxAnisotropy: a,
		getMaxPrecision: c,
		textureFormatReadable: o,
		textureTypeReadable: s,
		precision: l,
		logarithmicDepthBuffer: d,
		reversedDepthBuffer: f,
		maxTextures: p,
		maxVertexTextures: m,
		maxTextureSize: h,
		maxCubemapSize: g,
		maxAttributes: _,
		maxVertexUniforms: v,
		maxVaryings: y,
		maxFragmentUniforms: b,
		maxSamples: x,
		samples: S
	};
}
function yo(e) {
	let t = this, n = null, r = 0, i = !1, a = !1, o = new Wn(), s = new G(), c = {
		value: null,
		needsUpdate: !1
	};
	this.uniform = c, this.numPlanes = 0, this.numIntersection = 0, this.init = function(e, t) {
		let n = e.length !== 0 || t || r !== 0 || i;
		return i = t, r = e.length, n;
	}, this.beginShadows = function() {
		a = !0, u(null);
	}, this.endShadows = function() {
		a = !1;
	}, this.setGlobalState = function(e, t) {
		n = u(e, t, 0);
	}, this.setState = function(t, o, s) {
		let d = t.clippingPlanes, f = t.clipIntersection, p = t.clipShadows, m = e.get(t);
		if (!i || d === null || d.length === 0 || a && !p) a ? u(null) : l();
		else {
			let e = a ? 0 : r, t = e * 4, i = m.clippingState || null;
			c.value = i, i = u(d, o, t, s);
			for (let e = 0; e !== t; ++e) i[e] = n[e];
			m.clippingState = i, this.numIntersection = f ? this.numPlanes : 0, this.numPlanes += e;
		}
	};
	function l() {
		c.value !== n && (c.value = n, c.needsUpdate = r > 0), t.numPlanes = r, t.numIntersection = 0;
	}
	function u(e, n, r, i) {
		let a = e === null ? 0 : e.length, l = null;
		if (a !== 0) {
			if (l = c.value, i !== !0 || l === null) {
				let t = r + a * 4, i = n.matrixWorldInverse;
				s.getNormalMatrix(i), (l === null || l.length < t) && (l = new Float32Array(t));
				for (let t = 0, n = r; t !== a; ++t, n += 4) o.copy(e[t]).applyMatrix4(i, s), o.normal.toArray(l, n), l[n + 3] = o.constant;
			}
			c.value = l, c.needsUpdate = !0;
		}
		return t.numPlanes = a, t.numIntersection = 0, l;
	}
}
var bo = 4, xo = 6, So = 20, Co = 256, wo = /*@__PURE__*/ new Oa(), To = /*@__PURE__*/ new J(), Eo = null, Do = 0, Oo = 0, ko = !1, Ao = /*@__PURE__*/ new W(), jo = /*@__PURE__*/ new W(), Mo = class {
	constructor(e) {
		this._renderer = e, this._pingPongRenderTarget = null, this._lodMax = 0, this._cubeSize = 0, this._sizeLods = [], this._lodMeshes = [], this._backgroundBox = null, this._cubemapMaterial = null, this._equirectMaterial = null, this._blurMaterial = null, this._ggxMaterial = null;
	}
	fromScene(e, t = 0, n = .1, r = 100, i = {}) {
		let { size: a = 256, position: o = Ao } = i;
		Eo = this._renderer.getRenderTarget(), Do = this._renderer.getActiveCubeFace(), Oo = this._renderer.getActiveMipmapLevel(), ko = this._renderer.xr.enabled, this._renderer.xr.enabled = !1, this._setSize(a);
		let s = this._allocateTargets();
		return s.depthBuffer = !0, this._sceneToCubeUV(e, n, r, s, o), t > 0 && this._blur(s, 0, 0, t), this._applyPMREM(s), this._cleanup(s), s;
	}
	fromEquirectangular(e, t = null) {
		return this._fromTexture(e, t);
	}
	fromCubemap(e, t = null) {
		return this._fromTexture(e, t);
	}
	compileCubemapShader() {
		this._cubemapMaterial === null && (this._cubemapMaterial = zo(), this._compileMaterial(this._cubemapMaterial));
	}
	compileEquirectangularShader() {
		this._equirectMaterial === null && (this._equirectMaterial = Ro(), this._compileMaterial(this._equirectMaterial));
	}
	dispose() {
		this._dispose(), this._cubemapMaterial !== null && this._cubemapMaterial.dispose(), this._equirectMaterial !== null && this._equirectMaterial.dispose(), this._backgroundBox !== null && (this._backgroundBox.geometry.dispose(), this._backgroundBox.material.dispose());
	}
	_setSize(e) {
		this._lodMax = Math.floor(Math.log2(e)), this._cubeSize = 2 ** this._lodMax;
	}
	_dispose() {
		this._blurMaterial !== null && this._blurMaterial.dispose(), this._ggxMaterial !== null && this._ggxMaterial.dispose(), this._pingPongRenderTarget !== null && this._pingPongRenderTarget.dispose();
		for (let e = 0; e < this._lodMeshes.length; e++) this._lodMeshes[e].geometry.dispose();
	}
	_cleanup(e) {
		this._renderer.setRenderTarget(Eo, Do, Oo), this._renderer.xr.enabled = ko, e.scissorTest = !1, Fo(e, 0, 0, e.width, e.height);
	}
	_fromTexture(e, t) {
		e.mapping === 301 || e.mapping === 302 ? this._setSize(e.image.length === 0 ? 16 : e.image[0].width || e.image[0].image.width) : this._setSize(e.image.width / 4), Eo = this._renderer.getRenderTarget(), Do = this._renderer.getActiveCubeFace(), Oo = this._renderer.getActiveMipmapLevel(), ko = this._renderer.xr.enabled, this._renderer.xr.enabled = !1;
		let n = t || this._allocateTargets();
		return this._textureToCubeUV(e, n), this._applyPMREM(n), this._cleanup(n), n;
	}
	_allocateTargets() {
		let e = 3 * Math.max(this._cubeSize, 112), t = 4 * this._cubeSize, n = {
			magFilter: o,
			minFilter: o,
			generateMipmaps: !1,
			type: p,
			format: _,
			colorSpace: N,
			depthBuffer: !1
		}, r = Po(e, t, n);
		if (this._pingPongRenderTarget === null || this._pingPongRenderTarget.width !== e || this._pingPongRenderTarget.height !== t) {
			this._pingPongRenderTarget !== null && this._dispose(), this._pingPongRenderTarget = Po(e, t, n);
			let { _lodMax: r } = this;
			({lodMeshes: this._lodMeshes, sizeLods: this._sizeLods} = No(r)), this._blurMaterial = Lo(r, e, t), this._ggxMaterial = Io(r, e, t);
		}
		return r;
	}
	_compileMaterial(e) {
		let t = new ur(new Ln(), e);
		this._renderer.compile(t, wo);
	}
	_sceneToCubeUV(e, t, n, r, i) {
		let a = new Ca(90, 1, t, n), o = [
			1,
			-1,
			1,
			1,
			1,
			1
		], s = [
			1,
			1,
			1,
			-1,
			-1,
			-1
		], c = this._renderer, l = c.autoClear, u = c.toneMapping;
		c.getClearColor(To), c.toneMapping = 0, c.autoClear = !1, c.state.buffers.depth.getReversed() && (c.setRenderTarget(r), c.clearDepth(), c.setRenderTarget(null)), this._backgroundBox === null && (this._backgroundBox = new ur(new fi(), new Qn({
			name: "PMREM.Background",
			side: 1,
			depthWrite: !1,
			depthTest: !1
		})));
		let d = this._backgroundBox, f = d.material, p = !1, m = e.background;
		m ? m.isColor && (f.color.copy(m), e.background = null, p = !0) : (f.color.copy(To), p = !0);
		for (let t = 0; t < 6; t++) {
			let n = t % 3;
			n === 0 ? (a.up.set(0, o[t], 0), a.position.set(i.x, i.y, i.z), a.lookAt(i.x + s[t], i.y, i.z)) : n === 1 ? (a.up.set(0, 0, o[t]), a.position.set(i.x, i.y, i.z), a.lookAt(i.x, i.y + s[t], i.z)) : (a.up.set(0, o[t], 0), a.position.set(i.x, i.y, i.z), a.lookAt(i.x, i.y, i.z + s[t]));
			let l = this._cubeSize;
			Fo(r, n * l, t > 2 ? l : 0, l, l), c.setRenderTarget(r), p && c.render(d, a), c.render(e, a);
		}
		c.toneMapping = u, c.autoClear = l, e.background = m;
	}
	_textureToCubeUV(e, t) {
		let n = this._renderer, r = e.mapping === 301 || e.mapping === 302;
		r ? (this._cubemapMaterial === null && (this._cubemapMaterial = zo()), this._cubemapMaterial.uniforms.flipEnvMap.value = e.isRenderTargetTexture === !1 ? -1 : 1) : this._equirectMaterial === null && (this._equirectMaterial = Ro());
		let i = r ? this._cubemapMaterial : this._equirectMaterial, a = this._lodMeshes[0];
		a.material = i;
		let o = i.uniforms;
		o.envMap.value = e;
		let s = this._cubeSize;
		Fo(t, 0, 0, 3 * s, 2 * s), n.setRenderTarget(t), n.render(a, wo);
	}
	_applyPMREM(e) {
		let t = this._renderer, n = t.autoClear;
		t.autoClear = !1;
		let r = this._lodMeshes.length;
		for (let t = 1; t < r; t++) this._applyGGXFilter(e, t - 1, t);
		t.autoClear = n;
	}
	_applyGGXFilter(e, t, n) {
		let r = this._renderer, i = this._pingPongRenderTarget, a = this._ggxMaterial, o = this._lodMeshes[n];
		o.material = a;
		let s = a.uniforms, c = n / (this._lodMeshes.length - 1), l = t / (this._lodMeshes.length - 1), u = Math.sqrt(c * c - l * l) * (c * 1.25), { _lodMax: d } = this, f = this._sizeLods[n], p = 3 * f * (n > d - bo ? n - d + bo : 0), m = 4 * (this._cubeSize - f);
		s.envMap.value = e.texture, s.roughness.value = u, s.mipInt.value = d - t, Fo(i, p, m, 3 * f, 2 * f), r.setRenderTarget(i), r.render(o, wo), s.envMap.value = i.texture, s.roughness.value = 0, s.mipInt.value = d - n, Fo(e, p, m, 3 * f, 2 * f), r.setRenderTarget(e), r.render(o, wo);
	}
	_blur(e, t, n, r) {
		let i = this._pingPongRenderTarget, a = Math.min(r, Math.PI) / Math.SQRT2;
		this._blurPass(e, i, t, n, a), this._blurPass(i, e, n, n, a);
	}
	_blurPass(e, t, n, r, i) {
		let a = this._renderer, o = this._blurMaterial, s = this._lodMeshes[r];
		s.material = o;
		let c = o.uniforms;
		c.envMap.value = e.texture, c.sigma.value = i, c.mipInt.value = this._lodMax - n;
		let l = this._sizeLods[r];
		Fo(t, 3 * l * (r > this._lodMax - bo ? r - this._lodMax + bo : 0), 4 * (this._cubeSize - l), 3 * l, 2 * l), a.setRenderTarget(t), a.render(s, wo);
	}
};
function No(e) {
	let t = [], n = [], r = e, i = e - bo + 1 + xo;
	for (let e = 0; e < i; e++) {
		let e = 2 ** r;
		t.push(e);
		let i = 1 / (e - 2), a = -i, o = 1 + i, s = [
			a,
			a,
			o,
			a,
			o,
			o,
			a,
			a,
			o,
			o,
			a,
			o
		], c = /* @__PURE__ */ new Float32Array(108), l = /* @__PURE__ */ new Float32Array(108);
		for (let e = 0; e < 6; e++) {
			let t = e % 3 * 2 / 3 - 1, n = e > 2 ? 0 : -1, r = [
				t,
				n,
				0,
				t + 2 / 3,
				n,
				0,
				t + 2 / 3,
				n + 1,
				0,
				t,
				n,
				0,
				t + 2 / 3,
				n + 1,
				0,
				t,
				n + 1,
				0
			];
			c.set(r, 18 * e);
			for (let t = 0; t < 6; t++) {
				let n = s[t * 2] * 2 - 1, r = s[t * 2 + 1] * 2 - 1;
				e === 0 ? jo.set(1, r, n) : e === 1 ? jo.set(-n, 1, -r) : e === 2 ? jo.set(-n, r, 1) : e === 3 ? jo.set(-1, r, -n) : e === 4 ? jo.set(-n, -1, r) : jo.set(n, r, -1), jo.toArray(l, (e * 6 + t) * 3);
			}
		}
		let u = new Ln();
		u.setAttribute("position", new Sn(c, 3)), u.setAttribute("outputDirection", new Sn(l, 3)), n.push(new ur(u, null)), r > bo && r--;
	}
	return {
		lodMeshes: n,
		sizeLods: t
	};
}
function Po(e, t, n) {
	let r = new rt(e, t, n);
	return r.texture.mapping = 306, r.texture.name = "PMREM.cubeUv", r.scissorTest = !0, r;
}
function Fo(e, t, n, r, i) {
	e.viewport.set(t, n, r, i), e.scissor.set(t, n, r, i);
}
function Io(e, t, n) {
	return new Si({
		name: "PMREMGGXConvolution",
		defines: {
			GGX_SAMPLES: Co,
			CUBEUV_TEXEL_WIDTH: 1 / t,
			CUBEUV_TEXEL_HEIGHT: 1 / n,
			CUBEUV_MAX_MIP: `${e}.0`
		},
		uniforms: {
			envMap: { value: null },
			roughness: { value: 0 },
			mipInt: { value: 0 }
		},
		vertexShader: Bo(),
		fragmentShader: "\n\n			precision highp float;\n			precision highp int;\n\n			varying vec3 vOutputDirection;\n\n			uniform sampler2D envMap;\n			uniform float roughness;\n			uniform float mipInt;\n\n			#define ENVMAP_TYPE_CUBE_UV\n			#include <cube_uv_reflection_fragment>\n\n			#define PI 3.14159265359\n\n			// Van der Corput radical inverse\n			float radicalInverse_VdC(uint bits) {\n				bits = (bits << 16u) | (bits >> 16u);\n				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);\n				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);\n				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);\n				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);\n				return float(bits) * 2.3283064365386963e-10; // / 0x100000000\n			}\n\n			// Hammersley sequence\n			vec2 hammersley(uint i, uint N) {\n				return vec2(float(i) / float(N), radicalInverse_VdC(i));\n			}\n\n			// GGX VNDF importance sampling (Eric Heitz 2018)\n			// \"Sampling the GGX Distribution of Visible Normals\"\n			// https://jcgt.org/published/0007/04/01/\n			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {\n				float alpha = roughness * roughness;\n\n				// Section 4.1: Orthonormal basis\n				vec3 T1 = vec3(1.0, 0.0, 0.0);\n				vec3 T2 = cross(V, T1);\n\n				// Section 4.2: Parameterization of projected area\n				float r = sqrt(Xi.x);\n				float phi = 2.0 * PI * Xi.y;\n				float t1 = r * cos(phi);\n				float t2 = r * sin(phi);\n				float s = 0.5 * (1.0 + V.z);\n				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;\n\n				// Section 4.3: Reprojection onto hemisphere\n				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;\n\n				// Section 3.4: Transform back to ellipsoid configuration\n				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));\n			}\n\n			void main() {\n				vec3 N = normalize(vOutputDirection);\n				vec3 V = N; // Assume view direction equals normal for pre-filtering\n\n				vec3 prefilteredColor = vec3(0.0);\n				float totalWeight = 0.0;\n\n				// For very low roughness, just sample the environment directly\n				if (roughness < 0.001) {\n					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);\n					return;\n				}\n\n				// Tangent space basis for VNDF sampling\n				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);\n				vec3 tangent = normalize(cross(up, N));\n				vec3 bitangent = cross(N, tangent);\n\n				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {\n					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));\n\n					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)\n					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);\n\n					// Transform H back to world space\n					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);\n					vec3 L = normalize(2.0 * dot(V, H) * H - V);\n\n					float NdotL = max(dot(N, L), 0.0);\n\n					if(NdotL > 0.0) {\n						// Sample environment at fixed mip level\n						// VNDF importance sampling handles the distribution filtering\n						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);\n\n						// Weight by NdotL for the split-sum approximation\n						// VNDF PDF naturally accounts for the visible microfacet distribution\n						prefilteredColor += sampleColor * NdotL;\n						totalWeight += NdotL;\n					}\n				}\n\n				if (totalWeight > 0.0) {\n					prefilteredColor = prefilteredColor / totalWeight;\n				}\n\n				gl_FragColor = vec4(prefilteredColor, 1.0);\n			}\n		",
		blending: 0,
		depthTest: !1,
		depthWrite: !1
	});
}
function Lo(e, t, n) {
	return new Si({
		name: "SphericalGaussianBlur",
		defines: {
			SAMPLES: So,
			CUBEUV_TEXEL_WIDTH: 1 / t,
			CUBEUV_TEXEL_HEIGHT: 1 / n,
			CUBEUV_MAX_MIP: `${e}.0`
		},
		uniforms: {
			envMap: { value: null },
			sigma: { value: 0 },
			mipInt: { value: 0 }
		},
		vertexShader: Bo(),
		fragmentShader: "\n\n			precision highp float;\n			precision highp int;\n\n			varying vec3 vOutputDirection;\n\n			uniform sampler2D envMap;\n			uniform float sigma;\n			uniform float mipInt;\n\n			#define ENVMAP_TYPE_CUBE_UV\n			#include <cube_uv_reflection_fragment>\n\n			#define PI 3.14159265359\n			#define GOLDEN_ANGLE 2.39996322973\n\n			void main() {\n\n				if ( sigma == 0.0 ) {\n\n					gl_FragColor = vec4( bilinearCubeUV( envMap, vOutputDirection, mipInt ), 1.0 );\n					return;\n\n				}\n\n				vec3 outputDirection = normalize( vOutputDirection );\n\n				vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );\n				vec3 tangent = normalize( cross( up, outputDirection ) );\n				vec3 bitangent = cross( outputDirection, tangent );\n\n				// Truncate the kernel at three standard deviations or at the antipode.\n				float thetaMax = min( 3.0 * sigma, PI );\n				float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );\n\n				vec3 accumColor = vec3( 0.0 );\n				float accumWeight = 0.0;\n\n				for ( int i = 0; i < SAMPLES; i ++ ) {\n\n					// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.\n					float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );\n					float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );\n					float phi = float( i ) * GOLDEN_ANGLE;\n\n					vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;\n					vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;\n\n					// Correct the planar sample density to solid angle.\n					float weight = sin( theta ) / theta;\n\n					accumColor += weight * bilinearCubeUV( envMap, sampleDirection, mipInt );\n					accumWeight += weight;\n\n				}\n\n				gl_FragColor = vec4( accumColor / accumWeight, 1.0 );\n\n			}\n		",
		blending: 0,
		depthTest: !1,
		depthWrite: !1
	});
}
function Ro() {
	return new Si({
		name: "EquirectangularToCubeUV",
		uniforms: { envMap: { value: null } },
		vertexShader: Bo(),
		fragmentShader: "\n\n			precision mediump float;\n			precision mediump int;\n\n			varying vec3 vOutputDirection;\n\n			uniform sampler2D envMap;\n\n			#include <common>\n\n			void main() {\n\n				vec3 outputDirection = normalize( vOutputDirection );\n				vec2 uv = equirectUv( outputDirection );\n\n				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );\n\n			}\n		",
		blending: 0,
		depthTest: !1,
		depthWrite: !1
	});
}
function zo() {
	return new Si({
		name: "CubemapToCubeUV",
		uniforms: {
			envMap: { value: null },
			flipEnvMap: { value: -1 }
		},
		vertexShader: Bo(),
		fragmentShader: "\n\n			precision mediump float;\n			precision mediump int;\n\n			uniform float flipEnvMap;\n\n			varying vec3 vOutputDirection;\n\n			uniform samplerCube envMap;\n\n			void main() {\n\n				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );\n\n			}\n		",
		blending: 0,
		depthTest: !1,
		depthWrite: !1
	});
}
function Bo() {
	return "\n\n		precision mediump float;\n		precision mediump int;\n\n		attribute vec3 outputDirection;\n\n		varying vec3 vOutputDirection;\n\n		void main() {\n\n			vOutputDirection = outputDirection;\n			gl_Position = vec4( position, 1.0 );\n\n		}\n	";
}
var Vo = class extends rt {
	constructor(e = 1, t = {}) {
		super(e, e, t), this.isWebGLCubeRenderTarget = !0;
		let n = {
			width: e,
			height: e,
			depth: 1
		}, r = [
			n,
			n,
			n,
			n,
			n,
			n
		];
		this.texture = new ci(r), this._setTextureOptions(t), this.texture.isRenderTargetTexture = !0;
	}
	fromEquirectangularTexture(e, t) {
		this.texture.type = t.type, this.texture.colorSpace = t.colorSpace, this.texture.generateMipmaps = t.generateMipmaps, this.texture.minFilter = t.minFilter, this.texture.magFilter = t.magFilter;
		let n = {
			uniforms: { tEquirect: { value: null } },
			vertexShader: "\n\n				varying vec3 vWorldDirection;\n\n				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {\n\n					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );\n\n				}\n\n				void main() {\n\n					vWorldDirection = transformDirection( position, modelMatrix );\n\n					#include <begin_vertex>\n					#include <project_vertex>\n\n				}\n			",
			fragmentShader: "\n\n				uniform sampler2D tEquirect;\n\n				varying vec3 vWorldDirection;\n\n				#include <common>\n\n				void main() {\n\n					vec3 direction = normalize( vWorldDirection );\n\n					vec2 sampleUV = equirectUv( direction );\n\n					gl_FragColor = texture2D( tEquirect, sampleUV );\n\n				}\n			"
		}, r = new fi(5, 5, 5), i = new Si({
			name: "CubemapFromEquirect",
			uniforms: mi(n.uniforms),
			vertexShader: n.vertexShader,
			fragmentShader: n.fragmentShader,
			side: 1,
			blending: 0
		});
		i.uniforms.tEquirect.value = t;
		let a = new ur(r, i), s = t.minFilter;
		return t.minFilter === 1008 && (t.minFilter = o), new Ia(1, 10, this).update(e, a), t.minFilter = s, a.geometry.dispose(), a.material.dispose(), this;
	}
	clear(e, t = !0, n = !0, r = !0) {
		let i = e.getRenderTarget();
		for (let i = 0; i < 6; i++) e.setRenderTarget(this, i), e.clear(t, n, r);
		e.setRenderTarget(i);
	}
};
function Ho(e) {
	let t = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap(), r = null;
	function i(e, t = !1) {
		return e == null ? null : t ? o(e) : a(e);
	}
	function a(n) {
		if (n && n.isTexture) {
			let r = n.mapping;
			if (r === 303 || r === 304) {
				if (t.has(n)) {
					let e = t.get(n).texture;
					return s(e, n.mapping);
				}
				{
					let r = n.image;
					if (r && r.height > 0) {
						let i = new Vo(r.height);
						return i.fromEquirectangularTexture(e, n), t.set(n, i), n.addEventListener("dispose", l), s(i.texture, n.mapping);
					}
					return null;
				}
			}
		}
		return n;
	}
	function o(t) {
		if (t && t.isTexture) {
			let i = t.mapping, a = i === 303 || i === 304, o = i === 301 || i === 302;
			if (a || o) {
				let i = n.get(t), s = i === void 0 ? 0 : i.texture.pmremVersion;
				if (t.isRenderTargetTexture && t.pmremVersion !== s) return r === null && (r = new Mo(e)), i = a ? r.fromEquirectangular(t, i) : r.fromCubemap(t, i), i.texture.pmremVersion = t.pmremVersion, n.set(t, i), i.texture;
				if (i !== void 0) return i.texture;
				{
					let s = t.image;
					return a && s && s.height > 0 || o && s && c(s) ? (r === null && (r = new Mo(e)), i = a ? r.fromEquirectangular(t) : r.fromCubemap(t), i.texture.pmremVersion = t.pmremVersion, n.set(t, i), t.addEventListener("dispose", u), i.texture) : null;
				}
			}
		}
		return t;
	}
	function s(e, t) {
		return t === 303 ? e.mapping = 301 : t === 304 && (e.mapping = 302), e;
	}
	function c(e) {
		let t = 0;
		for (let n = 0; n < 6; n++) e[n] !== void 0 && t++;
		return t === 6;
	}
	function l(e) {
		let n = e.target;
		n.removeEventListener("dispose", l);
		let r = t.get(n);
		r !== void 0 && (t.delete(n), r.dispose());
	}
	function u(e) {
		let t = e.target;
		t.removeEventListener("dispose", u);
		let r = n.get(t);
		r !== void 0 && (n.delete(t), r.dispose());
	}
	function d() {
		t = /* @__PURE__ */ new WeakMap(), n = /* @__PURE__ */ new WeakMap(), r !== null && (r.dispose(), r = null);
	}
	return {
		get: i,
		dispose: d
	};
}
function Uo(e) {
	let t = {};
	function n(n) {
		if (t[n] !== void 0) return t[n];
		let r = e.getExtension(n);
		return t[n] = r, r;
	}
	return {
		has: function(e) {
			return n(e) !== null;
		},
		init: function() {
			n("EXT_color_buffer_float"), n("WEBGL_clip_cull_distance"), n("OES_texture_float_linear"), n("EXT_color_buffer_half_float"), n("WEBGL_multisampled_render_to_texture"), n("WEBGL_render_shared_exponent");
		},
		get: function(e) {
			let t = n(e);
			return t === null && fe("WebGLRenderer: " + e + " extension not supported."), t;
		}
	};
}
function Wo(e, t, n, r) {
	let i = {}, a = /* @__PURE__ */ new WeakMap();
	function o(e) {
		let s = e.target;
		s.index !== null && t.remove(s.index);
		for (let e in s.attributes) t.remove(s.attributes[e]);
		s.removeEventListener("dispose", o), delete i[s.id];
		let c = a.get(s);
		c && (t.remove(c), a.delete(s)), r.releaseStatesOfGeometry(s), s.isInstancedBufferGeometry === !0 && delete s._maxInstanceCount, n.memory.geometries--;
	}
	function s(e, t) {
		return i[t.id] === !0 || (t.addEventListener("dispose", o), i[t.id] = !0, n.memory.geometries++), t;
	}
	function c(n) {
		let r = n.attributes;
		for (let n in r) t.update(r[n], e.ARRAY_BUFFER);
	}
	function l(e) {
		let n = [], r = e.index, i = e.attributes.position, o = 0;
		if (i === void 0) return;
		if (r !== null) {
			let e = r.array;
			o = r.version;
			for (let t = 0, r = e.length; t < r; t += 3) {
				let r = e[t + 0], i = e[t + 1], a = e[t + 2];
				n.push(r, i, i, a, a, r);
			}
		} else {
			let e = i.array;
			o = i.version;
			for (let t = 0, r = e.length / 3 - 1; t < r; t += 3) {
				let e = t + 0, r = t + 1, i = t + 2;
				n.push(e, r, r, i, i, e);
			}
		}
		let s = new (i.count >= 65535 ? wn : Cn)(n, 1);
		s.version = o;
		let c = a.get(e);
		c && t.remove(c), a.set(e, s);
	}
	function u(e) {
		let t = a.get(e);
		if (t) {
			let n = e.index;
			n !== null && t.version < n.version && l(e);
		} else l(e);
		return a.get(e);
	}
	return {
		get: s,
		update: c,
		getWireframeAttribute: u
	};
}
function Go(e, t, n) {
	let r;
	function i(e) {
		r = e;
	}
	let a, o;
	function s(e) {
		a = e.type, o = e.bytesPerElement;
	}
	function c(t, i) {
		e.drawElements(r, i, a, t * o), n.update(i, r, 1);
	}
	function l(t, i, s) {
		s !== 0 && (e.drawElementsInstanced(r, i, a, t * o, s), n.update(i, r, s));
	}
	function u(e, i, o) {
		if (o === 0) return;
		t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(r, i, 0, a, e, 0, o);
		let s = 0;
		for (let e = 0; e < o; e++) s += i[e];
		n.update(s, r, 1);
	}
	this.setMode = i, this.setIndex = s, this.render = c, this.renderInstances = l, this.renderMultiDraw = u;
}
function Ko(e) {
	let t = {
		geometries: 0,
		textures: 0
	}, n = {
		frame: 0,
		calls: 0,
		triangles: 0,
		points: 0,
		lines: 0
	};
	function r(t, r, i) {
		switch (n.calls++, r) {
			case e.TRIANGLES:
				n.triangles += t / 3 * i;
				break;
			case e.LINES:
				n.lines += t / 2 * i;
				break;
			case e.LINE_STRIP:
				n.lines += i * (t - 1);
				break;
			case e.LINE_LOOP:
				n.lines += i * t;
				break;
			case e.POINTS:
				n.points += i * t;
				break;
			default: L("WebGLInfo: Unknown draw mode:", r);
		}
	}
	function i() {
		n.calls = 0, n.triangles = 0, n.points = 0, n.lines = 0;
	}
	return {
		memory: t,
		render: n,
		programs: null,
		autoReset: !0,
		reset: i,
		update: r
	};
}
function qo(e, t, n) {
	let r = /* @__PURE__ */ new WeakMap(), i = new tt();
	function a(a, o, s) {
		let c = a.morphTargetInfluences, l = o.morphAttributes.position || o.morphAttributes.normal || o.morphAttributes.color, u = l === void 0 ? 0 : l.length, d = r.get(o);
		if (d === void 0 || d.count !== u) {
			d !== void 0 && d.texture.dispose();
			let e = o.morphAttributes.position !== void 0, n = o.morphAttributes.normal !== void 0, a = o.morphAttributes.color !== void 0, s = o.morphAttributes.position || [], c = o.morphAttributes.normal || [], l = o.morphAttributes.color || [], p = 0;
			e === !0 && (p = 1), n === !0 && (p = 2), a === !0 && (p = 3);
			let m = o.attributes.position.count * p, h = 1;
			m > t.maxTextureSize && (h = Math.ceil(m / t.maxTextureSize), m = t.maxTextureSize);
			let g = new Float32Array(m * h * 4 * u), _ = new it(g, m, h, u);
			_.type = f, _.needsUpdate = !0;
			let v = p * 4;
			for (let t = 0; t < u; t++) {
				let r = s[t], o = c[t], u = l[t], d = m * h * 4 * t;
				for (let t = 0; t < r.count; t++) {
					let s = t * v;
					e === !0 && (i.fromBufferAttribute(r, t), g[d + s + 0] = i.x, g[d + s + 1] = i.y, g[d + s + 2] = i.z, g[d + s + 3] = 0), n === !0 && (i.fromBufferAttribute(o, t), g[d + s + 4] = i.x, g[d + s + 5] = i.y, g[d + s + 6] = i.z, g[d + s + 7] = 0), a === !0 && (i.fromBufferAttribute(u, t), g[d + s + 8] = i.x, g[d + s + 9] = i.y, g[d + s + 10] = i.z, g[d + s + 11] = u.itemSize === 4 ? i.w : 1);
				}
			}
			d = {
				count: u,
				texture: _,
				size: new H(m, h)
			}, r.set(o, d);
			function y() {
				_.dispose(), r.delete(o), o.removeEventListener("dispose", y);
			}
			o.addEventListener("dispose", y);
		}
		if (a.isInstancedMesh === !0 && a.morphTexture !== null) s.getUniforms().setValue(e, "morphTexture", a.morphTexture, n);
		else {
			let t = 0;
			for (let e = 0; e < c.length; e++) t += c[e];
			let n = o.morphTargetsRelative ? 1 : 1 - t;
			s.getUniforms().setValue(e, "morphTargetBaseInfluence", n), s.getUniforms().setValue(e, "morphTargetInfluences", c);
		}
		s.getUniforms().setValue(e, "morphTargetsTexture", d.texture, n), s.getUniforms().setValue(e, "morphTargetsTextureSize", d.size);
	}
	return { update: a };
}
function Jo(e, t, n, r, i) {
	let a = /* @__PURE__ */ new WeakMap();
	function o(r) {
		let o = i.render.frame, s = r.geometry, l = t.get(r, s);
		if (a.get(l) !== o && (t.update(l), a.set(l, o)), r.isInstancedMesh && (r.hasEventListener("dispose", c) === !1 && r.addEventListener("dispose", c), a.get(r) !== o && (n.update(r.instanceMatrix, e.ARRAY_BUFFER), r.instanceColor !== null && n.update(r.instanceColor, e.ARRAY_BUFFER), a.set(r, o))), r.isSkinnedMesh) {
			let e = r.skeleton;
			a.get(e) !== o && (e.update(), a.set(e, o));
		}
		return l;
	}
	function s() {
		a = /* @__PURE__ */ new WeakMap();
	}
	function c(e) {
		let t = e.target;
		t.removeEventListener("dispose", c), r.releaseStatesOfObject(t), n.remove(t.instanceMatrix), t.instanceColor !== null && n.remove(t.instanceColor);
	}
	return {
		update: o,
		dispose: s
	};
}
var Yo = {
	1: "LINEAR_TONE_MAPPING",
	2: "REINHARD_TONE_MAPPING",
	3: "CINEON_TONE_MAPPING",
	4: "ACES_FILMIC_TONE_MAPPING",
	6: "AGX_TONE_MAPPING",
	7: "NEUTRAL_TONE_MAPPING",
	5: "CUSTOM_TONE_MAPPING"
};
function Xo(e, t, n, r, i, a) {
	let o = new rt(t, n, {
		type: e,
		depthBuffer: i,
		stencilBuffer: a,
		samples: r ? 4 : 0,
		storeMultisampledDepthBuffer: !1,
		storeMultisampledStencilBuffer: !1,
		resolveDepthBuffer: !1,
		resolveStencilBuffer: !1
	}), s = null, c = null, l = new Ln();
	l.setAttribute("position", new Tn([
		-1,
		3,
		0,
		-1,
		-1,
		0,
		3,
		-1,
		0
	], 3)), l.setAttribute("uv", new Tn([
		0,
		2,
		0,
		0,
		2,
		0
	], 2));
	let u = new Ci({
		uniforms: { tDiffuse: { value: null } },
		vertexShader: "\n			precision highp float;\n\n			uniform mat4 modelViewMatrix;\n			uniform mat4 projectionMatrix;\n\n			attribute vec3 position;\n			attribute vec2 uv;\n\n			varying vec2 vUv;\n\n			void main() {\n				vUv = uv;\n				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n			}",
		fragmentShader: "\n			precision highp float;\n\n			uniform sampler2D tDiffuse;\n\n			varying vec2 vUv;\n\n			#include <tonemapping_pars_fragment>\n			#include <colorspace_pars_fragment>\n\n			void main() {\n				gl_FragColor = texture2D( tDiffuse, vUv );\n\n				#ifdef LINEAR_TONE_MAPPING\n					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );\n				#elif defined( REINHARD_TONE_MAPPING )\n					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );\n				#elif defined( CINEON_TONE_MAPPING )\n					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );\n				#elif defined( ACES_FILMIC_TONE_MAPPING )\n					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );\n				#elif defined( AGX_TONE_MAPPING )\n					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );\n				#elif defined( NEUTRAL_TONE_MAPPING )\n					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );\n				#elif defined( CUSTOM_TONE_MAPPING )\n					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );\n				#endif\n\n				#ifdef SRGB_TRANSFER\n					gl_FragColor = sRGBTransferOETF( gl_FragColor );\n				#endif\n			}",
		depthTest: !1,
		depthWrite: !1
	}), d = new ur(l, u), f = new Oa(-1, 1, 1, -1, 0, 1), m = null, h = null, g = !1, _, v = null, y = [], b = !1;
	this.setSize = function(e, t) {
		o.setSize(e, t), s !== null && s.setSize(e, t), c !== null && c.setSize(e, t);
		for (let n = 0; n < y.length; n++) {
			let r = y[n];
			r.setSize && r.setSize(e, t);
		}
	}, this.setEffects = function(e) {
		y = e, b = y.length > 0 && y[0].isRenderPass === !0;
		let t = o.width, n = o.height;
		y.length > 0 && s === null && (s = new rt(t, n, {
			type: p,
			depthBuffer: !1,
			stencilBuffer: !1
		}), c = new rt(t, n, {
			type: p,
			depthBuffer: !1,
			stencilBuffer: !1
		}));
		for (let e = 0; e < y.length; e++) {
			let r = y[e];
			r.setSize && r.setSize(t, n);
		}
	}, this.begin = function(e, t) {
		if (g || e.toneMapping === 0 && y.length === 0) return !1;
		if (v = t, t !== null) {
			let e = t.width, n = t.height;
			(o.width !== e || o.height !== n) && this.setSize(e, n);
		}
		return b === !1 && e.setRenderTarget(o), _ = e.toneMapping, e.toneMapping = 0, !0;
	}, this.hasRenderPass = function() {
		return b;
	}, this.end = function(e, t) {
		e.toneMapping = _, g = !0;
		let n = o, r = s;
		for (let i = 0; i < y.length; i++) {
			let a = y[i];
			a.enabled !== !1 && (a.render(e, r, n, t), a.needsSwap !== !1 && (n = r, r = r === s ? c : s));
		}
		if (m !== e.outputColorSpace || h !== e.toneMapping) {
			m = e.outputColorSpace, h = e.toneMapping, u.defines = {}, K.getTransfer(m) === "srgb" && (u.defines.SRGB_TRANSFER = "");
			let t = Yo[h];
			t && (u.defines[t] = ""), u.needsUpdate = !0;
		}
		u.uniforms.tDiffuse.value = n.texture, e.setRenderTarget(v), e.render(d, f), v = null, g = !1;
	}, this.isCompositing = function() {
		return g;
	}, this.dispose = function() {
		o.dispose(), s !== null && s.dispose(), c !== null && c.dispose(), l.dispose(), u.dispose();
	};
}
var Zo = /*@__PURE__*/ new et(), Qo = /*@__PURE__*/ new li(1, 1), $o = /*@__PURE__*/ new it(), es = /*@__PURE__*/ new at(), ts = /*@__PURE__*/ new ci(), ns = [], rs = [], is = /* @__PURE__ */ new Float32Array(16), as = /* @__PURE__ */ new Float32Array(9), os = /* @__PURE__ */ new Float32Array(4);
function ss(e, t, n) {
	let r = e[0];
	if (r <= 0 || r > 0) return e;
	let i = t * n, a = ns[i];
	if (a === void 0 && (a = new Float32Array(i), ns[i] = a), t !== 0) {
		r.toArray(a, 0);
		for (let r = 1, i = 0; r !== t; ++r) i += n, e[r].toArray(a, i);
	}
	return a;
}
function cs(e, t) {
	if (e.length !== t.length) return !1;
	for (let n = 0, r = e.length; n < r; n++) if (e[n] !== t[n]) return !1;
	return !0;
}
function ls(e, t) {
	for (let n = 0, r = t.length; n < r; n++) e[n] = t[n];
}
function us(e, t) {
	let n = rs[t];
	n === void 0 && (n = new Int32Array(t), rs[t] = n);
	for (let r = 0; r !== t; ++r) n[r] = e.allocateTextureUnit();
	return n;
}
function ds(e, t) {
	let n = this.cache;
	n[0] !== t && (e.uniform1f(this.addr, t), n[0] = t);
}
function fs(e, t) {
	let n = this.cache;
	if (t.x !== void 0) (n[0] !== t.x || n[1] !== t.y) && (e.uniform2f(this.addr, t.x, t.y), n[0] = t.x, n[1] = t.y);
	else {
		if (cs(n, t)) return;
		e.uniform2fv(this.addr, t), ls(n, t);
	}
}
function ps(e, t) {
	let n = this.cache;
	if (t.x !== void 0) (n[0] !== t.x || n[1] !== t.y || n[2] !== t.z) && (e.uniform3f(this.addr, t.x, t.y, t.z), n[0] = t.x, n[1] = t.y, n[2] = t.z);
	else if (t.r !== void 0) (n[0] !== t.r || n[1] !== t.g || n[2] !== t.b) && (e.uniform3f(this.addr, t.r, t.g, t.b), n[0] = t.r, n[1] = t.g, n[2] = t.b);
	else {
		if (cs(n, t)) return;
		e.uniform3fv(this.addr, t), ls(n, t);
	}
}
function ms(e, t) {
	let n = this.cache;
	if (t.x !== void 0) (n[0] !== t.x || n[1] !== t.y || n[2] !== t.z || n[3] !== t.w) && (e.uniform4f(this.addr, t.x, t.y, t.z, t.w), n[0] = t.x, n[1] = t.y, n[2] = t.z, n[3] = t.w);
	else {
		if (cs(n, t)) return;
		e.uniform4fv(this.addr, t), ls(n, t);
	}
}
function hs(e, t) {
	let n = this.cache, r = t.elements;
	if (r === void 0) {
		if (cs(n, t)) return;
		e.uniformMatrix2fv(this.addr, !1, t), ls(n, t);
	} else {
		if (cs(n, r)) return;
		os.set(r), e.uniformMatrix2fv(this.addr, !1, os), ls(n, r);
	}
}
function gs(e, t) {
	let n = this.cache, r = t.elements;
	if (r === void 0) {
		if (cs(n, t)) return;
		e.uniformMatrix3fv(this.addr, !1, t), ls(n, t);
	} else {
		if (cs(n, r)) return;
		as.set(r), e.uniformMatrix3fv(this.addr, !1, as), ls(n, r);
	}
}
function _s(e, t) {
	let n = this.cache, r = t.elements;
	if (r === void 0) {
		if (cs(n, t)) return;
		e.uniformMatrix4fv(this.addr, !1, t), ls(n, t);
	} else {
		if (cs(n, r)) return;
		is.set(r), e.uniformMatrix4fv(this.addr, !1, is), ls(n, r);
	}
}
function vs(e, t) {
	let n = this.cache;
	n[0] !== t && (e.uniform1i(this.addr, t), n[0] = t);
}
function ys(e, t) {
	let n = this.cache;
	if (t.x !== void 0) (n[0] !== t.x || n[1] !== t.y) && (e.uniform2i(this.addr, t.x, t.y), n[0] = t.x, n[1] = t.y);
	else {
		if (cs(n, t)) return;
		e.uniform2iv(this.addr, t), ls(n, t);
	}
}
function bs(e, t) {
	let n = this.cache;
	if (t.x !== void 0) (n[0] !== t.x || n[1] !== t.y || n[2] !== t.z) && (e.uniform3i(this.addr, t.x, t.y, t.z), n[0] = t.x, n[1] = t.y, n[2] = t.z);
	else {
		if (cs(n, t)) return;
		e.uniform3iv(this.addr, t), ls(n, t);
	}
}
function xs(e, t) {
	let n = this.cache;
	if (t.x !== void 0) (n[0] !== t.x || n[1] !== t.y || n[2] !== t.z || n[3] !== t.w) && (e.uniform4i(this.addr, t.x, t.y, t.z, t.w), n[0] = t.x, n[1] = t.y, n[2] = t.z, n[3] = t.w);
	else {
		if (cs(n, t)) return;
		e.uniform4iv(this.addr, t), ls(n, t);
	}
}
function Ss(e, t) {
	let n = this.cache;
	n[0] !== t && (e.uniform1ui(this.addr, t), n[0] = t);
}
function Cs(e, t) {
	let n = this.cache;
	if (t.x !== void 0) (n[0] !== t.x || n[1] !== t.y) && (e.uniform2ui(this.addr, t.x, t.y), n[0] = t.x, n[1] = t.y);
	else {
		if (cs(n, t)) return;
		e.uniform2uiv(this.addr, t), ls(n, t);
	}
}
function ws(e, t) {
	let n = this.cache;
	if (t.x !== void 0) (n[0] !== t.x || n[1] !== t.y || n[2] !== t.z) && (e.uniform3ui(this.addr, t.x, t.y, t.z), n[0] = t.x, n[1] = t.y, n[2] = t.z);
	else {
		if (cs(n, t)) return;
		e.uniform3uiv(this.addr, t), ls(n, t);
	}
}
function Ts(e, t) {
	let n = this.cache;
	if (t.x !== void 0) (n[0] !== t.x || n[1] !== t.y || n[2] !== t.z || n[3] !== t.w) && (e.uniform4ui(this.addr, t.x, t.y, t.z, t.w), n[0] = t.x, n[1] = t.y, n[2] = t.z, n[3] = t.w);
	else {
		if (cs(n, t)) return;
		e.uniform4uiv(this.addr, t), ls(n, t);
	}
}
function Es(e, t, n) {
	let r = this.cache, i = n.allocateTextureUnit();
	r[0] !== i && (e.uniform1i(this.addr, i), r[0] = i);
	let a;
	this.type === e.SAMPLER_2D_SHADOW ? (Qo.compareFunction = n.isReversedDepthBuffer() ? 518 : 515, a = Qo) : a = Zo, n.setTexture2D(t || a, i);
}
function Ds(e, t, n) {
	let r = this.cache, i = n.allocateTextureUnit();
	r[0] !== i && (e.uniform1i(this.addr, i), r[0] = i), n.setTexture3D(t || es, i);
}
function Os(e, t, n) {
	let r = this.cache, i = n.allocateTextureUnit();
	r[0] !== i && (e.uniform1i(this.addr, i), r[0] = i), n.setTextureCube(t || ts, i);
}
function ks(e, t, n) {
	let r = this.cache, i = n.allocateTextureUnit();
	r[0] !== i && (e.uniform1i(this.addr, i), r[0] = i), n.setTexture2DArray(t || $o, i);
}
function As(e) {
	switch (e) {
		case 5126: return ds;
		case 35664: return fs;
		case 35665: return ps;
		case 35666: return ms;
		case 35674: return hs;
		case 35675: return gs;
		case 35676: return _s;
		case 5124:
		case 35670: return vs;
		case 35667:
		case 35671: return ys;
		case 35668:
		case 35672: return bs;
		case 35669:
		case 35673: return xs;
		case 5125: return Ss;
		case 36294: return Cs;
		case 36295: return ws;
		case 36296: return Ts;
		case 35678:
		case 36198:
		case 36298:
		case 36306:
		case 35682: return Es;
		case 35679:
		case 36299:
		case 36307: return Ds;
		case 35680:
		case 36300:
		case 36308:
		case 36293: return Os;
		case 36289:
		case 36303:
		case 36311:
		case 36292: return ks;
	}
}
function js(e, t) {
	e.uniform1fv(this.addr, t);
}
function Ms(e, t) {
	let n = ss(t, this.size, 2);
	e.uniform2fv(this.addr, n);
}
function Ns(e, t) {
	let n = ss(t, this.size, 3);
	e.uniform3fv(this.addr, n);
}
function Ps(e, t) {
	let n = ss(t, this.size, 4);
	e.uniform4fv(this.addr, n);
}
function Fs(e, t) {
	let n = ss(t, this.size, 4);
	e.uniformMatrix2fv(this.addr, !1, n);
}
function Is(e, t) {
	let n = ss(t, this.size, 9);
	e.uniformMatrix3fv(this.addr, !1, n);
}
function Ls(e, t) {
	let n = ss(t, this.size, 16);
	e.uniformMatrix4fv(this.addr, !1, n);
}
function Rs(e, t) {
	e.uniform1iv(this.addr, t);
}
function zs(e, t) {
	e.uniform2iv(this.addr, t);
}
function Bs(e, t) {
	e.uniform3iv(this.addr, t);
}
function Vs(e, t) {
	e.uniform4iv(this.addr, t);
}
function Hs(e, t) {
	e.uniform1uiv(this.addr, t);
}
function Us(e, t) {
	e.uniform2uiv(this.addr, t);
}
function Ws(e, t) {
	e.uniform3uiv(this.addr, t);
}
function Gs(e, t) {
	e.uniform4uiv(this.addr, t);
}
function Ks(e, t, n) {
	let r = this.cache, i = t.length, a = us(n, i);
	cs(r, a) || (e.uniform1iv(this.addr, a), ls(r, a));
	let o;
	o = this.type === e.SAMPLER_2D_SHADOW ? Qo : Zo;
	for (let e = 0; e !== i; ++e) n.setTexture2D(t[e] || o, a[e]);
}
function qs(e, t, n) {
	let r = this.cache, i = t.length, a = us(n, i);
	cs(r, a) || (e.uniform1iv(this.addr, a), ls(r, a));
	for (let e = 0; e !== i; ++e) n.setTexture3D(t[e] || es, a[e]);
}
function Js(e, t, n) {
	let r = this.cache, i = t.length, a = us(n, i);
	cs(r, a) || (e.uniform1iv(this.addr, a), ls(r, a));
	for (let e = 0; e !== i; ++e) n.setTextureCube(t[e] || ts, a[e]);
}
function Ys(e, t, n) {
	let r = this.cache, i = t.length, a = us(n, i);
	cs(r, a) || (e.uniform1iv(this.addr, a), ls(r, a));
	for (let e = 0; e !== i; ++e) n.setTexture2DArray(t[e] || $o, a[e]);
}
function Xs(e) {
	switch (e) {
		case 5126: return js;
		case 35664: return Ms;
		case 35665: return Ns;
		case 35666: return Ps;
		case 35674: return Fs;
		case 35675: return Is;
		case 35676: return Ls;
		case 5124:
		case 35670: return Rs;
		case 35667:
		case 35671: return zs;
		case 35668:
		case 35672: return Bs;
		case 35669:
		case 35673: return Vs;
		case 5125: return Hs;
		case 36294: return Us;
		case 36295: return Ws;
		case 36296: return Gs;
		case 35678:
		case 36198:
		case 36298:
		case 36306:
		case 35682: return Ks;
		case 35679:
		case 36299:
		case 36307: return qs;
		case 35680:
		case 36300:
		case 36308:
		case 36293: return Js;
		case 36289:
		case 36303:
		case 36311:
		case 36292: return Ys;
	}
}
var Zs = class {
	constructor(e, t, n) {
		this.id = e, this.addr = n, this.cache = [], this.type = t.type, this.setValue = As(t.type);
	}
}, Qs = class {
	constructor(e, t, n) {
		this.id = e, this.addr = n, this.cache = [], this.type = t.type, this.size = t.size, this.setValue = Xs(t.type);
	}
}, $s = class {
	constructor(e) {
		this.id = e, this.seq = [], this.map = {};
	}
	setValue(e, t, n) {
		let r = this.seq;
		for (let i = 0, a = r.length; i !== a; ++i) {
			let a = r[i];
			a.setValue(e, t[a.id], n);
		}
	}
}, ec = /(\w+)(\])?(\[|\.)?/g;
function tc(e, t) {
	e.seq.push(t), e.map[t.id] = t;
}
function nc(e, t, n) {
	let r = e.name, i = r.length;
	for (ec.lastIndex = 0;;) {
		let a = ec.exec(r), o = ec.lastIndex, s = a[1], c = a[2] === "]", l = a[3];
		if (c && (s |= 0), l === void 0 || l === "[" && o + 2 === i) {
			tc(n, l === void 0 ? new Zs(s, e, t) : new Qs(s, e, t));
			break;
		}
		{
			let e = n.map[s];
			e === void 0 && (e = new $s(s), tc(n, e)), n = e;
		}
	}
}
var rc = class {
	constructor(e, t) {
		this.seq = [], this.map = {};
		let n = e.getProgramParameter(t, e.ACTIVE_UNIFORMS);
		for (let r = 0; r < n; ++r) {
			let n = e.getActiveUniform(t, r);
			nc(n, e.getUniformLocation(t, n.name), this);
		}
		let r = [], i = [];
		for (let t of this.seq) t.type === e.SAMPLER_2D_SHADOW || t.type === e.SAMPLER_CUBE_SHADOW || t.type === e.SAMPLER_2D_ARRAY_SHADOW ? r.push(t) : i.push(t);
		r.length > 0 && (this.seq = r.concat(i));
	}
	setValue(e, t, n, r) {
		let i = this.map[t];
		i !== void 0 && i.setValue(e, n, r);
	}
	setOptional(e, t, n) {
		let r = t[n];
		r !== void 0 && this.setValue(e, n, r);
	}
	static upload(e, t, n, r) {
		for (let i = 0, a = t.length; i !== a; ++i) {
			let a = t[i], o = n[a.id];
			o.needsUpdate !== !1 && a.setValue(e, o.value, r);
		}
	}
	static seqWithValue(e, t) {
		let n = [];
		for (let r = 0, i = e.length; r !== i; ++r) {
			let i = e[r];
			i.id in t && n.push(i);
		}
		return n;
	}
};
function ic(e, t, n) {
	let r = e.createShader(t);
	return e.shaderSource(r, n), e.compileShader(r), r;
}
var ac = 37297, oc = 0;
function sc(e, t) {
	let n = e.split("\n"), r = [], i = Math.max(t - 6, 0), a = Math.min(t + 6, n.length);
	for (let e = i; e < a; e++) {
		let i = e + 1;
		r.push(`${i === t ? ">" : " "} ${i}: ${n[e]}`);
	}
	return r.join("\n");
}
var cc = /*@__PURE__*/ new G();
function lc(e) {
	K._getMatrix(cc, K.workingColorSpace, e);
	let t = `mat3( ${cc.elements.map((e) => e.toFixed(4))} )`;
	switch (K.getTransfer(e)) {
		case ne: return [t, "LinearTransferOETF"];
		case P: return [t, "sRGBTransferOETF"];
		default: return I("WebGLProgram: Unsupported color space: ", e), [t, "LinearTransferOETF"];
	}
}
function uc(e, t, n) {
	let r = e.getShaderParameter(t, e.COMPILE_STATUS), i = (e.getShaderInfoLog(t) || "").trim();
	if (r && i === "") return "";
	let a = /ERROR: 0:(\d+)/.exec(i);
	if (a) {
		let r = parseInt(a[1]);
		return n.toUpperCase() + "\n\n" + i + "\n\n" + sc(e.getShaderSource(t), r);
	}
	return i;
}
function dc(e, t) {
	let n = lc(t);
	return [
		`vec4 ${e}( vec4 value ) {`,
		`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,
		"}"
	].join("\n");
}
var fc = {
	1: "Linear",
	2: "Reinhard",
	3: "Cineon",
	4: "ACESFilmic",
	6: "AgX",
	7: "Neutral",
	5: "Custom"
};
function pc(e, t) {
	let n = fc[t];
	return n === void 0 ? (I("WebGLProgram: Unsupported toneMapping:", t), "vec3 " + e + "( vec3 color ) { return LinearToneMapping( color ); }") : "vec3 " + e + "( vec3 color ) { return " + n + "ToneMapping( color ); }";
}
var mc = /*@__PURE__*/ new W();
function hc() {
	return K.getLuminanceCoefficients(mc), [
		"float luminance( const in vec3 rgb ) {",
		`	const vec3 weights = vec3( ${mc.x.toFixed(4)}, ${mc.y.toFixed(4)}, ${mc.z.toFixed(4)} );`,
		"	return dot( weights, rgb );",
		"}"
	].join("\n");
}
function gc(e) {
	return [e.extensionClipCullDistance ? "#extension GL_ANGLE_clip_cull_distance : require" : "", e.extensionMultiDraw ? "#extension GL_ANGLE_multi_draw : require" : ""].filter(yc).join("\n");
}
function _c(e) {
	let t = [];
	for (let n in e) {
		let r = e[n];
		r !== !1 && t.push("#define " + n + " " + r);
	}
	return t.join("\n");
}
function vc(e, t) {
	let n = {}, r = e.getProgramParameter(t, e.ACTIVE_ATTRIBUTES);
	for (let i = 0; i < r; i++) {
		let r = e.getActiveAttrib(t, i), a = r.name, o = 1;
		r.type === e.FLOAT_MAT2 && (o = 2), r.type === e.FLOAT_MAT3 && (o = 3), r.type === e.FLOAT_MAT4 && (o = 4), n[a] = {
			type: r.type,
			location: e.getAttribLocation(t, a),
			locationSize: o
		};
	}
	return n;
}
function yc(e) {
	return e !== "";
}
function bc(e, t) {
	let n = t.numSpotLightShadows + t.numSpotLightMaps - t.numSpotLightShadowsWithMaps;
	return e.replace(/NUM_SUN_LIGHTS/g, t.numSunLights).replace(/NUM_DIR_LIGHTS/g, t.numDirLights).replace(/NUM_SPOT_LIGHTS/g, t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g, t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g, n).replace(/NUM_RECT_AREA_LIGHTS/g, t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g, t.numPointLights).replace(/NUM_HEMI_LIGHTS/g, t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g, t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g, t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g, t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g, t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g, t.numPointLightShadows);
}
function xc(e, t) {
	return e.replace(/NUM_CLIPPING_PLANES/g, t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g, t.numClippingPlanes - t.numClipIntersection);
}
var Sc = /^[ \t]*#include +<([\w\d./]+)>/gm;
function Cc(e) {
	return e.replace(Sc, Tc);
}
var wc = /* @__PURE__ */ new Map();
function Tc(e, t) {
	let n = Y[t];
	if (n === void 0) {
		let e = wc.get(t);
		if (e !== void 0) n = Y[e], I("WebGLRenderer: Shader chunk \"%s\" has been deprecated. Use \"%s\" instead.", t, e);
		else throw Error("THREE.WebGLProgram: Can not resolve #include <" + t + ">");
	}
	return Cc(n);
}
var Ec = /#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;
function Dc(e) {
	return e.replace(Ec, Oc);
}
function Oc(e, t, n, r) {
	let i = "";
	for (let e = parseInt(t); e < parseInt(n); e++) i += r.replace(/\[\s*i\s*\]/g, "[ " + e + " ]").replace(/UNROLLED_LOOP_INDEX/g, e);
	return i;
}
function kc(e) {
	let t = `precision ${e.precision} float;
	precision ${e.precision} int;
	precision ${e.precision} sampler2D;
	precision ${e.precision} samplerCube;
	precision ${e.precision} sampler3D;
	precision ${e.precision} sampler2DArray;
	precision ${e.precision} sampler2DShadow;
	precision ${e.precision} samplerCubeShadow;
	precision ${e.precision} sampler2DArrayShadow;
	precision ${e.precision} isampler2D;
	precision ${e.precision} isampler3D;
	precision ${e.precision} isamplerCube;
	precision ${e.precision} isampler2DArray;
	precision ${e.precision} usampler2D;
	precision ${e.precision} usampler3D;
	precision ${e.precision} usamplerCube;
	precision ${e.precision} usampler2DArray;
	`;
	return e.precision === "highp" ? t += "\n#define HIGH_PRECISION" : e.precision === "mediump" ? t += "\n#define MEDIUM_PRECISION" : e.precision === "lowp" && (t += "\n#define LOW_PRECISION"), t;
}
var Ac = {
	1: "SHADOWMAP_TYPE_PCF",
	3: "SHADOWMAP_TYPE_VSM"
};
function jc(e) {
	return Ac[e.shadowMapType] || "SHADOWMAP_TYPE_BASIC";
}
var Mc = {
	301: "ENVMAP_TYPE_CUBE",
	302: "ENVMAP_TYPE_CUBE",
	306: "ENVMAP_TYPE_CUBE_UV"
};
function Nc(e) {
	return e.envMap === !1 ? "ENVMAP_TYPE_CUBE" : Mc[e.envMapMode] || "ENVMAP_TYPE_CUBE";
}
var Pc = { 302: "ENVMAP_MODE_REFRACTION" };
function Fc(e) {
	return e.envMap === !1 ? "ENVMAP_MODE_REFLECTION" : Pc[e.envMapMode] || "ENVMAP_MODE_REFLECTION";
}
var Ic = {
	0: "ENVMAP_BLENDING_MULTIPLY",
	1: "ENVMAP_BLENDING_MIX",
	2: "ENVMAP_BLENDING_ADD"
};
function Lc(e) {
	return e.envMap === !1 ? "ENVMAP_BLENDING_NONE" : Ic[e.combine] || "ENVMAP_BLENDING_NONE";
}
function Rc(e) {
	let t = e.envMapCubeUVHeight;
	if (t === null) return null;
	let n = Math.log2(t) - 2, r = 1 / t;
	return {
		texelWidth: 1 / (3 * Math.max(2 ** n, 112)),
		texelHeight: r,
		maxMip: n
	};
}
function zc(e, t, n, r) {
	let i = e.getContext(), a = n.defines, o = n.vertexShader, s = n.fragmentShader, c = jc(n), l = Nc(n), u = Fc(n), d = Lc(n), f = Rc(n), p = gc(n), m = _c(a), h = i.createProgram(), g, _, v = n.glslVersion ? "#version " + n.glslVersion + "\n" : "";
	n.isRawShaderMaterial ? (g = [
		"#define SHADER_TYPE " + n.shaderType,
		"#define SHADER_NAME " + n.shaderName,
		m
	].filter(yc).join("\n"), g.length > 0 && (g += "\n"), _ = [
		"#define SHADER_TYPE " + n.shaderType,
		"#define SHADER_NAME " + n.shaderName,
		m
	].filter(yc).join("\n"), _.length > 0 && (_ += "\n")) : (g = [
		kc(n),
		"#define SHADER_TYPE " + n.shaderType,
		"#define SHADER_NAME " + n.shaderName,
		m,
		n.extensionClipCullDistance ? "#define USE_CLIP_DISTANCE" : "",
		n.batching ? "#define USE_BATCHING" : "",
		n.batchingColor ? "#define USE_BATCHING_COLOR" : "",
		n.instancing ? "#define USE_INSTANCING" : "",
		n.instancingColor ? "#define USE_INSTANCING_COLOR" : "",
		n.instancingMorph ? "#define USE_INSTANCING_MORPH" : "",
		n.useFog && n.fog ? "#define USE_FOG" : "",
		n.useFog && n.fogExp2 ? "#define FOG_EXP2" : "",
		n.map ? "#define USE_MAP" : "",
		n.envMap ? "#define USE_ENVMAP" : "",
		n.envMap ? "#define " + u : "",
		n.lightMap ? "#define USE_LIGHTMAP" : "",
		n.aoMap ? "#define USE_AOMAP" : "",
		n.bumpMap ? "#define USE_BUMPMAP" : "",
		n.normalMap ? "#define USE_NORMALMAP" : "",
		n.normalMapObjectSpace ? "#define USE_NORMALMAP_OBJECTSPACE" : "",
		n.normalMapTangentSpace ? "#define USE_NORMALMAP_TANGENTSPACE" : "",
		n.displacementMap ? "#define USE_DISPLACEMENTMAP" : "",
		n.emissiveMap ? "#define USE_EMISSIVEMAP" : "",
		n.anisotropy ? "#define USE_ANISOTROPY" : "",
		n.anisotropyMap ? "#define USE_ANISOTROPYMAP" : "",
		n.clearcoatMap ? "#define USE_CLEARCOATMAP" : "",
		n.clearcoatRoughnessMap ? "#define USE_CLEARCOAT_ROUGHNESSMAP" : "",
		n.clearcoatNormalMap ? "#define USE_CLEARCOAT_NORMALMAP" : "",
		n.iridescenceMap ? "#define USE_IRIDESCENCEMAP" : "",
		n.iridescenceThicknessMap ? "#define USE_IRIDESCENCE_THICKNESSMAP" : "",
		n.specularMap ? "#define USE_SPECULARMAP" : "",
		n.specularColorMap ? "#define USE_SPECULAR_COLORMAP" : "",
		n.specularIntensityMap ? "#define USE_SPECULAR_INTENSITYMAP" : "",
		n.roughnessMap ? "#define USE_ROUGHNESSMAP" : "",
		n.metalnessMap ? "#define USE_METALNESSMAP" : "",
		n.alphaMap ? "#define USE_ALPHAMAP" : "",
		n.alphaHash ? "#define USE_ALPHAHASH" : "",
		n.transmission ? "#define USE_TRANSMISSION" : "",
		n.transmissionMap ? "#define USE_TRANSMISSIONMAP" : "",
		n.thicknessMap ? "#define USE_THICKNESSMAP" : "",
		n.sheenColorMap ? "#define USE_SHEEN_COLORMAP" : "",
		n.sheenRoughnessMap ? "#define USE_SHEEN_ROUGHNESSMAP" : "",
		n.mapUv ? "#define MAP_UV " + n.mapUv : "",
		n.alphaMapUv ? "#define ALPHAMAP_UV " + n.alphaMapUv : "",
		n.lightMapUv ? "#define LIGHTMAP_UV " + n.lightMapUv : "",
		n.aoMapUv ? "#define AOMAP_UV " + n.aoMapUv : "",
		n.emissiveMapUv ? "#define EMISSIVEMAP_UV " + n.emissiveMapUv : "",
		n.bumpMapUv ? "#define BUMPMAP_UV " + n.bumpMapUv : "",
		n.normalMapUv ? "#define NORMALMAP_UV " + n.normalMapUv : "",
		n.displacementMapUv ? "#define DISPLACEMENTMAP_UV " + n.displacementMapUv : "",
		n.metalnessMapUv ? "#define METALNESSMAP_UV " + n.metalnessMapUv : "",
		n.roughnessMapUv ? "#define ROUGHNESSMAP_UV " + n.roughnessMapUv : "",
		n.anisotropyMapUv ? "#define ANISOTROPYMAP_UV " + n.anisotropyMapUv : "",
		n.clearcoatMapUv ? "#define CLEARCOATMAP_UV " + n.clearcoatMapUv : "",
		n.clearcoatNormalMapUv ? "#define CLEARCOAT_NORMALMAP_UV " + n.clearcoatNormalMapUv : "",
		n.clearcoatRoughnessMapUv ? "#define CLEARCOAT_ROUGHNESSMAP_UV " + n.clearcoatRoughnessMapUv : "",
		n.iridescenceMapUv ? "#define IRIDESCENCEMAP_UV " + n.iridescenceMapUv : "",
		n.iridescenceThicknessMapUv ? "#define IRIDESCENCE_THICKNESSMAP_UV " + n.iridescenceThicknessMapUv : "",
		n.sheenColorMapUv ? "#define SHEEN_COLORMAP_UV " + n.sheenColorMapUv : "",
		n.sheenRoughnessMapUv ? "#define SHEEN_ROUGHNESSMAP_UV " + n.sheenRoughnessMapUv : "",
		n.specularMapUv ? "#define SPECULARMAP_UV " + n.specularMapUv : "",
		n.specularColorMapUv ? "#define SPECULAR_COLORMAP_UV " + n.specularColorMapUv : "",
		n.specularIntensityMapUv ? "#define SPECULAR_INTENSITYMAP_UV " + n.specularIntensityMapUv : "",
		n.transmissionMapUv ? "#define TRANSMISSIONMAP_UV " + n.transmissionMapUv : "",
		n.thicknessMapUv ? "#define THICKNESSMAP_UV " + n.thicknessMapUv : "",
		n.vertexTangents && n.flatShading === !1 ? "#define USE_TANGENT" : "",
		n.vertexNormals ? "#define HAS_NORMAL" : "",
		n.vertexColors ? "#define USE_COLOR" : "",
		n.vertexAlphas ? "#define USE_COLOR_ALPHA" : "",
		n.vertexUv1s ? "#define USE_UV1" : "",
		n.vertexUv2s ? "#define USE_UV2" : "",
		n.vertexUv3s ? "#define USE_UV3" : "",
		n.pointsUvs ? "#define USE_POINTS_UV" : "",
		n.flatShading ? "#define FLAT_SHADED" : "",
		n.skinning ? "#define USE_SKINNING" : "",
		n.morphTargets ? "#define USE_MORPHTARGETS" : "",
		n.morphNormals && n.flatShading === !1 ? "#define USE_MORPHNORMALS" : "",
		n.morphColors ? "#define USE_MORPHCOLORS" : "",
		n.morphTargetsCount > 0 ? "#define MORPHTARGETS_TEXTURE_STRIDE " + n.morphTextureStride : "",
		n.morphTargetsCount > 0 ? "#define MORPHTARGETS_COUNT " + n.morphTargetsCount : "",
		n.doubleSided ? "#define DOUBLE_SIDED" : "",
		n.flipSided ? "#define FLIP_SIDED" : "",
		n.shadowMapEnabled ? "#define USE_SHADOWMAP" : "",
		n.shadowMapEnabled ? "#define " + c : "",
		n.sizeAttenuation ? "#define USE_SIZEATTENUATION" : "",
		n.numLightProbes > 0 ? "#define USE_LIGHT_PROBES" : "",
		n.logarithmicDepthBuffer ? "#define USE_LOGARITHMIC_DEPTH_BUFFER" : "",
		n.reversedDepthBuffer ? "#define USE_REVERSED_DEPTH_BUFFER" : "",
		"uniform mat4 modelMatrix;",
		"uniform mat4 modelViewMatrix;",
		"uniform mat4 projectionMatrix;",
		"uniform mat4 viewMatrix;",
		"uniform mat3 normalMatrix;",
		"uniform vec3 cameraPosition;",
		"uniform bool isOrthographic;",
		"#ifdef USE_INSTANCING",
		"	attribute mat4 instanceMatrix;",
		"#endif",
		"#ifdef USE_INSTANCING_COLOR",
		"	attribute vec3 instanceColor;",
		"#endif",
		"#ifdef USE_INSTANCING_MORPH",
		"	uniform sampler2D morphTexture;",
		"#endif",
		"attribute vec3 position;",
		"attribute vec3 normal;",
		"attribute vec2 uv;",
		"#ifdef USE_UV1",
		"	attribute vec2 uv1;",
		"#endif",
		"#ifdef USE_UV2",
		"	attribute vec2 uv2;",
		"#endif",
		"#ifdef USE_UV3",
		"	attribute vec2 uv3;",
		"#endif",
		"#ifdef USE_TANGENT",
		"	attribute vec4 tangent;",
		"#endif",
		"#if defined( USE_COLOR_ALPHA )",
		"	attribute vec4 color;",
		"#elif defined( USE_COLOR )",
		"	attribute vec3 color;",
		"#endif",
		"#ifdef USE_SKINNING",
		"	attribute vec4 skinIndex;",
		"	attribute vec4 skinWeight;",
		"#endif",
		"\n"
	].filter(yc).join("\n"), _ = [
		kc(n),
		"#define SHADER_TYPE " + n.shaderType,
		"#define SHADER_NAME " + n.shaderName,
		m,
		n.useFog && n.fog ? "#define USE_FOG" : "",
		n.useFog && n.fogExp2 ? "#define FOG_EXP2" : "",
		n.alphaToCoverage ? "#define ALPHA_TO_COVERAGE" : "",
		n.map ? "#define USE_MAP" : "",
		n.matcap ? "#define USE_MATCAP" : "",
		n.envMap ? "#define USE_ENVMAP" : "",
		n.envMap ? "#define " + l : "",
		n.envMap ? "#define " + u : "",
		n.envMap ? "#define " + d : "",
		f ? "#define CUBEUV_TEXEL_WIDTH " + f.texelWidth : "",
		f ? "#define CUBEUV_TEXEL_HEIGHT " + f.texelHeight : "",
		f ? "#define CUBEUV_MAX_MIP " + f.maxMip + ".0" : "",
		n.lightMap ? "#define USE_LIGHTMAP" : "",
		n.aoMap ? "#define USE_AOMAP" : "",
		n.bumpMap ? "#define USE_BUMPMAP" : "",
		n.normalMap ? "#define USE_NORMALMAP" : "",
		n.normalMapObjectSpace ? "#define USE_NORMALMAP_OBJECTSPACE" : "",
		n.normalMapTangentSpace ? "#define USE_NORMALMAP_TANGENTSPACE" : "",
		n.packedNormalMap ? "#define USE_PACKED_NORMALMAP" : "",
		n.emissiveMap ? "#define USE_EMISSIVEMAP" : "",
		n.anisotropy ? "#define USE_ANISOTROPY" : "",
		n.anisotropyMap ? "#define USE_ANISOTROPYMAP" : "",
		n.clearcoat ? "#define USE_CLEARCOAT" : "",
		n.clearcoatMap ? "#define USE_CLEARCOATMAP" : "",
		n.clearcoatRoughnessMap ? "#define USE_CLEARCOAT_ROUGHNESSMAP" : "",
		n.clearcoatNormalMap ? "#define USE_CLEARCOAT_NORMALMAP" : "",
		n.dispersion ? "#define USE_DISPERSION" : "",
		n.retroreflection ? "#define USE_RETROREFLECTION" : "",
		n.iridescence ? "#define USE_IRIDESCENCE" : "",
		n.iridescenceMap ? "#define USE_IRIDESCENCEMAP" : "",
		n.iridescenceThicknessMap ? "#define USE_IRIDESCENCE_THICKNESSMAP" : "",
		n.specularMap ? "#define USE_SPECULARMAP" : "",
		n.specularColorMap ? "#define USE_SPECULAR_COLORMAP" : "",
		n.specularIntensityMap ? "#define USE_SPECULAR_INTENSITYMAP" : "",
		n.roughnessMap ? "#define USE_ROUGHNESSMAP" : "",
		n.metalnessMap ? "#define USE_METALNESSMAP" : "",
		n.alphaMap ? "#define USE_ALPHAMAP" : "",
		n.alphaTest ? "#define USE_ALPHATEST" : "",
		n.alphaHash ? "#define USE_ALPHAHASH" : "",
		n.sheen ? "#define USE_SHEEN" : "",
		n.sheenColorMap ? "#define USE_SHEEN_COLORMAP" : "",
		n.sheenRoughnessMap ? "#define USE_SHEEN_ROUGHNESSMAP" : "",
		n.transmission ? "#define USE_TRANSMISSION" : "",
		n.transmissionMap ? "#define USE_TRANSMISSIONMAP" : "",
		n.thicknessMap ? "#define USE_THICKNESSMAP" : "",
		n.vertexTangents && n.flatShading === !1 ? "#define USE_TANGENT" : "",
		n.vertexColors || n.instancingColor ? "#define USE_COLOR" : "",
		n.vertexAlphas || n.batchingColor ? "#define USE_COLOR_ALPHA" : "",
		n.vertexUv1s ? "#define USE_UV1" : "",
		n.vertexUv2s ? "#define USE_UV2" : "",
		n.vertexUv3s ? "#define USE_UV3" : "",
		n.pointsUvs ? "#define USE_POINTS_UV" : "",
		n.gradientMap ? "#define USE_GRADIENTMAP" : "",
		n.flatShading ? "#define FLAT_SHADED" : "",
		n.doubleSided ? "#define DOUBLE_SIDED" : "",
		n.flipSided ? "#define FLIP_SIDED" : "",
		n.shadowMapEnabled ? "#define USE_SHADOWMAP" : "",
		n.shadowMapEnabled ? "#define " + c : "",
		n.premultipliedAlpha ? "#define PREMULTIPLIED_ALPHA" : "",
		n.numLightProbes > 0 ? "#define USE_LIGHT_PROBES" : "",
		n.numLightProbeGrids > 0 ? "#define USE_LIGHT_PROBES_GRID" : "",
		n.decodeVideoTexture ? "#define DECODE_VIDEO_TEXTURE" : "",
		n.decodeVideoTextureEmissive ? "#define DECODE_VIDEO_TEXTURE_EMISSIVE" : "",
		n.logarithmicDepthBuffer ? "#define USE_LOGARITHMIC_DEPTH_BUFFER" : "",
		n.reversedDepthBuffer ? "#define USE_REVERSED_DEPTH_BUFFER" : "",
		"uniform mat4 viewMatrix;",
		"uniform vec3 cameraPosition;",
		"uniform bool isOrthographic;",
		n.toneMapping === 0 ? "" : "#define TONE_MAPPING",
		n.toneMapping === 0 ? "" : Y.tonemapping_pars_fragment,
		n.toneMapping === 0 ? "" : pc("toneMapping", n.toneMapping),
		n.dithering ? "#define DITHERING" : "",
		n.opaque ? "#define OPAQUE" : "",
		Y.colorspace_pars_fragment,
		dc("linearToOutputTexel", n.outputColorSpace),
		hc(),
		n.useDepthPacking ? "#define DEPTH_PACKING " + n.depthPacking : "",
		"\n"
	].filter(yc).join("\n")), o = Cc(o), o = bc(o, n), o = xc(o, n), s = Cc(s), s = bc(s, n), s = xc(s, n), o = Dc(o), s = Dc(s), n.isRawShaderMaterial !== !0 && (v = "#version 300 es\n", g = [
		p,
		"#define attribute in",
		"#define varying out",
		"#define texture2D texture"
	].join("\n") + "\n" + g, _ = [
		"#define varying in",
		n.glslVersion === "300 es" ? "" : "layout(location = 0) out highp vec4 pc_fragColor;",
		n.glslVersion === "300 es" ? "" : "#define gl_FragColor pc_fragColor",
		"#define gl_FragDepthEXT gl_FragDepth",
		"#define texture2D texture",
		"#define textureCube texture",
		"#define texture2DProj textureProj",
		"#define texture2DLodEXT textureLod",
		"#define texture2DProjLodEXT textureProjLod",
		"#define textureCubeLodEXT textureLod",
		"#define texture2DGradEXT textureGrad",
		"#define texture2DProjGradEXT textureProjGrad",
		"#define textureCubeGradEXT textureGrad"
	].join("\n") + "\n" + _);
	let y = v + g + o, b = v + _ + s, x = ic(i, i.VERTEX_SHADER, y), S = ic(i, i.FRAGMENT_SHADER, b);
	i.attachShader(h, x), i.attachShader(h, S), n.index0AttributeName === void 0 ? n.hasPositionAttribute === !0 && i.bindAttribLocation(h, 0, "position") : i.bindAttribLocation(h, 0, n.index0AttributeName), i.linkProgram(h);
	function C(t) {
		if (e.debug.checkShaderErrors) {
			let n = i.getProgramInfoLog(h) || "", r = i.getShaderInfoLog(x) || "", a = i.getShaderInfoLog(S) || "", o = n.trim(), s = r.trim(), c = a.trim(), l = !0, u = !0;
			if (i.getProgramParameter(h, i.LINK_STATUS) === !1) {
				if (l = !1, typeof e.debug.onShaderError == "function") e.debug.onShaderError(i, h, x, S);
				else {
					let e = uc(i, x, "vertex"), n = uc(i, S, "fragment");
					L("WebGLProgram: Shader Error " + i.getError() + " - VALIDATE_STATUS " + i.getProgramParameter(h, i.VALIDATE_STATUS) + "\n\nMaterial Name: " + t.name + "\nMaterial Type: " + t.type + "\n\nProgram Info Log: " + o + "\n" + e + "\n" + n);
				}
			} else o === "" ? (s === "" || c === "") && (u = !1) : I("WebGLProgram: Program Info Log:", o);
			u && (t.diagnostics = {
				runnable: l,
				programLog: o,
				vertexShader: {
					log: s,
					prefix: g
				},
				fragmentShader: {
					log: c,
					prefix: _
				}
			});
		}
		i.deleteShader(x), i.deleteShader(S), w = new rc(i, h), T = vc(i, h);
	}
	let w;
	this.getUniforms = function() {
		return w === void 0 && C(this), w;
	};
	let T;
	this.getAttributes = function() {
		return T === void 0 && C(this), T;
	};
	let E = n.rendererExtensionParallelShaderCompile === !1;
	return this.isReady = function() {
		return E === !1 && (E = i.getProgramParameter(h, ac)), E;
	}, this.destroy = function() {
		r.releaseStatesOfProgram(this), i.deleteProgram(h), this.program = void 0;
	}, this.type = n.shaderType, this.name = n.shaderName, this.id = oc++, this.cacheKey = t, this.usedTimes = 1, this.program = h, this.vertexShader = x, this.fragmentShader = S, this;
}
var Bc = 0, Vc = class {
	constructor() {
		this.shaderCache = /* @__PURE__ */ new Map(), this.materialCache = /* @__PURE__ */ new Map();
	}
	update(e, t, n) {
		let r = this._getShaderCacheForMaterial(e);
		return r.has(t) === !1 && (r.add(t), t.usedTimes++), r.has(n) === !1 && (r.add(n), n.usedTimes++), this;
	}
	remove(e) {
		let t = this.materialCache.get(e);
		for (let e of t) e.usedTimes--, e.usedTimes === 0 && this.shaderCache.delete(e.code);
		return this.materialCache.delete(e), this;
	}
	getVertexShaderStage(e) {
		return this._getShaderStage(e.vertexShader);
	}
	getFragmentShaderStage(e) {
		return this._getShaderStage(e.fragmentShader);
	}
	dispose() {
		this.shaderCache.clear(), this.materialCache.clear();
	}
	_getShaderCacheForMaterial(e) {
		let t = this.materialCache, n = t.get(e);
		return n === void 0 && (n = /* @__PURE__ */ new Set(), t.set(e, n)), n;
	}
	_getShaderStage(e) {
		let t = this.shaderCache, n = t.get(e);
		return n === void 0 && (n = new Hc(e), t.set(e, n)), n;
	}
}, Hc = class {
	constructor(e) {
		this.id = Bc++, this.code = e, this.usedTimes = 0;
	}
};
function Uc(e) {
	return e === 1030 || e === 37490 || e === 36285;
}
function Wc(e, t, n, r, i, a) {
	let o = new gt(), s = new Vc(), c = /* @__PURE__ */ new Set(), l = [], u = /* @__PURE__ */ new Map(), d = r.logarithmicDepthBuffer, f = r.precision, p = {
		MeshDepthMaterial: "depth",
		MeshDistanceMaterial: "distance",
		MeshNormalMaterial: "normal",
		MeshBasicMaterial: "basic",
		MeshLambertMaterial: "lambert",
		MeshPhongMaterial: "phong",
		MeshToonMaterial: "toon",
		MeshStandardMaterial: "physical",
		MeshPhysicalMaterial: "physical",
		MeshMatcapMaterial: "matcap",
		LineBasicMaterial: "basic",
		LineDashedMaterial: "dashed",
		PointsMaterial: "points",
		ShadowMaterial: "shadow",
		SpriteMaterial: "sprite"
	};
	function m(e) {
		return c.add(e), e === 0 ? "uv" : `uv${e}`;
	}
	function h(i, o, l, u, h, g) {
		let _ = u.fog, v = h.geometry, y = i.isMeshStandardMaterial || i.isMeshLambertMaterial || i.isMeshPhongMaterial ? u.environment : null, b = i.isMeshStandardMaterial || i.isMeshLambertMaterial && !i.envMap || i.isMeshPhongMaterial && !i.envMap, x = t.get(i.envMap || y, b), S = x && x.mapping === 306 ? x.image.height : null, C = p[i.type];
		i.precision !== null && (f = r.getMaxPrecision(i.precision), f !== i.precision && I("WebGLProgram.getParameters:", i.precision, "not supported, using", f, "instead."));
		let w = v.morphAttributes.position || v.morphAttributes.normal || v.morphAttributes.color, T = w === void 0 ? 0 : w.length, E = 0;
		v.morphAttributes.position !== void 0 && (E = 1), v.morphAttributes.normal !== void 0 && (E = 2), v.morphAttributes.color !== void 0 && (E = 3);
		let D, O, ee, k;
		if (C) {
			let e = uo[C];
			D = e.vertexShader, O = e.fragmentShader;
		} else {
			D = i.vertexShader, O = i.fragmentShader;
			let e = s.getVertexShaderStage(i), t = s.getFragmentShaderStage(i);
			s.update(i, e, t), ee = e.id, k = t.id;
		}
		let A = e.getRenderTarget(), j = e.state.buffers.depth.getReversed(), te = h.isInstancedMesh === !0, M = h.isBatchedMesh === !0, N = !!i.map, ne = !!i.matcap, P = !!x, re = !!i.aoMap, F = !!i.lightMap, ie = !!i.bumpMap && i.wireframe === !1, ae = !!i.normalMap, oe = !!i.displacementMap, se = !!i.emissiveMap, ce = !!i.metalnessMap, le = !!i.roughnessMap, ue = i.anisotropy > 0, de = i.clearcoat > 0, L = i.dispersion > 0, fe = i.retroreflectivity > 0, pe = i.iridescence > 0, me = i.sheen > 0, he = i.transmission > 0, ge = ue && !!i.anisotropyMap, _e = de && !!i.clearcoatMap, ve = de && !!i.clearcoatNormalMap, ye = de && !!i.clearcoatRoughnessMap, be = pe && !!i.iridescenceMap, R = pe && !!i.iridescenceThicknessMap, xe = me && !!i.sheenColorMap, Se = me && !!i.sheenRoughnessMap, Ce = !!i.specularMap, we = !!i.specularColorMap, Te = !!i.specularIntensityMap, Ee = he && !!i.transmissionMap, De = he && !!i.thicknessMap, Oe = !!i.gradientMap, ke = !!i.alphaMap, Ae = i.alphaTest > 0, je = !!i.alphaHash, Me = !!i.extensions, Ne = 0;
		i.toneMapped && (A === null || A.isXRRenderTarget === !0) && (Ne = e.toneMapping);
		let Pe = {
			shaderID: C,
			shaderType: i.type,
			shaderName: i.name,
			vertexShader: D,
			fragmentShader: O,
			defines: i.defines,
			customVertexShaderID: ee,
			customFragmentShaderID: k,
			isRawShaderMaterial: i.isRawShaderMaterial === !0,
			glslVersion: i.glslVersion,
			precision: f,
			batching: M,
			batchingColor: M && h._colorsTexture !== null,
			instancing: te,
			instancingColor: te && h.instanceColor !== null,
			instancingMorph: te && h.morphTexture !== null,
			outputColorSpace: A === null ? e.outputColorSpace : A.isXRRenderTarget === !0 ? A.texture.colorSpace : K.workingColorSpace,
			alphaToCoverage: !!i.alphaToCoverage,
			map: N,
			matcap: ne,
			envMap: P,
			envMapMode: P && x.mapping,
			envMapCubeUVHeight: S,
			aoMap: re,
			lightMap: F,
			bumpMap: ie,
			normalMap: ae,
			displacementMap: oe,
			emissiveMap: se,
			normalMapObjectSpace: ae && i.normalMapType === 1,
			normalMapTangentSpace: ae && i.normalMapType === 0,
			packedNormalMap: ae && i.normalMapType === 0 && Uc(i.normalMap.format),
			metalnessMap: ce,
			roughnessMap: le,
			anisotropy: ue,
			anisotropyMap: ge,
			clearcoat: de,
			clearcoatMap: _e,
			clearcoatNormalMap: ve,
			clearcoatRoughnessMap: ye,
			dispersion: L,
			retroreflection: fe,
			iridescence: pe,
			iridescenceMap: be,
			iridescenceThicknessMap: R,
			sheen: me,
			sheenColorMap: xe,
			sheenRoughnessMap: Se,
			specularMap: Ce,
			specularColorMap: we,
			specularIntensityMap: Te,
			transmission: he,
			transmissionMap: Ee,
			thicknessMap: De,
			gradientMap: Oe,
			opaque: i.transparent === !1 && i.blending === 1 && i.alphaToCoverage === !1,
			alphaMap: ke,
			alphaTest: Ae,
			alphaHash: je,
			combine: i.combine,
			mapUv: N && m(i.map.channel),
			aoMapUv: re && m(i.aoMap.channel),
			lightMapUv: F && m(i.lightMap.channel),
			bumpMapUv: ie && m(i.bumpMap.channel),
			normalMapUv: ae && m(i.normalMap.channel),
			displacementMapUv: oe && m(i.displacementMap.channel),
			emissiveMapUv: se && m(i.emissiveMap.channel),
			metalnessMapUv: ce && m(i.metalnessMap.channel),
			roughnessMapUv: le && m(i.roughnessMap.channel),
			anisotropyMapUv: ge && m(i.anisotropyMap.channel),
			clearcoatMapUv: _e && m(i.clearcoatMap.channel),
			clearcoatNormalMapUv: ve && m(i.clearcoatNormalMap.channel),
			clearcoatRoughnessMapUv: ye && m(i.clearcoatRoughnessMap.channel),
			iridescenceMapUv: be && m(i.iridescenceMap.channel),
			iridescenceThicknessMapUv: R && m(i.iridescenceThicknessMap.channel),
			sheenColorMapUv: xe && m(i.sheenColorMap.channel),
			sheenRoughnessMapUv: Se && m(i.sheenRoughnessMap.channel),
			specularMapUv: Ce && m(i.specularMap.channel),
			specularColorMapUv: we && m(i.specularColorMap.channel),
			specularIntensityMapUv: Te && m(i.specularIntensityMap.channel),
			transmissionMapUv: Ee && m(i.transmissionMap.channel),
			thicknessMapUv: De && m(i.thicknessMap.channel),
			alphaMapUv: ke && m(i.alphaMap.channel),
			vertexTangents: !!v.attributes.tangent && (ae || ue),
			vertexNormals: !!v.attributes.normal,
			vertexColors: i.vertexColors,
			vertexAlphas: i.vertexColors === !0 && !!v.attributes.color && v.attributes.color.itemSize === 4,
			pointsUvs: h.isPoints === !0 && !!v.attributes.uv && (N || ke),
			fog: !!_,
			useFog: i.fog === !0,
			fogExp2: !!_ && _.isFogExp2,
			flatShading: i.wireframe === !1 && (i.flatShading === !0 || v.attributes.normal === void 0 && ae === !1 && (i.isMeshLambertMaterial || i.isMeshPhongMaterial || i.isMeshStandardMaterial || i.isMeshPhysicalMaterial)),
			sizeAttenuation: i.sizeAttenuation === !0,
			logarithmicDepthBuffer: d,
			reversedDepthBuffer: j,
			skinning: h.isSkinnedMesh === !0,
			hasPositionAttribute: v.attributes.position !== void 0,
			morphTargets: v.morphAttributes.position !== void 0,
			morphNormals: v.morphAttributes.normal !== void 0,
			morphColors: v.morphAttributes.color !== void 0,
			morphTargetsCount: T,
			morphTextureStride: E,
			numSunLights: o.sun.length,
			numDirLights: o.directional.length,
			numPointLights: o.point.length,
			numSpotLights: o.spot.length,
			numSpotLightMaps: o.spotLightMap.length,
			numRectAreaLights: o.rectArea.length,
			numHemiLights: o.hemi.length,
			numSunLightShadows: o.sunShadowMap.length,
			numDirLightShadows: o.directionalShadowMap.length,
			numPointLightShadows: o.pointShadowMap.length,
			numSpotLightShadows: o.spotShadowMap.length,
			numSpotLightShadowsWithMaps: o.numSpotLightShadowsWithMaps,
			numLightProbes: o.numLightProbes,
			numLightProbeGrids: g.length,
			numClippingPlanes: a.numPlanes,
			numClipIntersection: a.numIntersection,
			dithering: i.dithering,
			shadowMapEnabled: e.shadowMap.enabled && l.length > 0,
			shadowMapType: e.shadowMap.type,
			toneMapping: Ne,
			decodeVideoTexture: N && i.map.isVideoTexture === !0 && K.getTransfer(i.map.colorSpace) === "srgb",
			decodeVideoTextureEmissive: se && i.emissiveMap.isVideoTexture === !0 && K.getTransfer(i.emissiveMap.colorSpace) === "srgb",
			premultipliedAlpha: i.premultipliedAlpha,
			doubleSided: i.side === 2,
			flipSided: i.side === 1,
			useDepthPacking: i.depthPacking >= 0,
			depthPacking: i.depthPacking || 0,
			index0AttributeName: i.index0AttributeName,
			extensionClipCullDistance: Me && i.extensions.clipCullDistance === !0 && n.has("WEBGL_clip_cull_distance"),
			extensionMultiDraw: (Me && i.extensions.multiDraw === !0 || M) && n.has("WEBGL_multi_draw"),
			rendererExtensionParallelShaderCompile: n.has("KHR_parallel_shader_compile"),
			customProgramCacheKey: i.customProgramCacheKey()
		};
		return Pe.vertexUv1s = c.has(1), Pe.vertexUv2s = c.has(2), Pe.vertexUv3s = c.has(3), c.clear(), Pe;
	}
	function g(t) {
		let n = [];
		if (t.shaderID ? n.push(t.shaderID) : (n.push(t.customVertexShaderID), n.push(t.customFragmentShaderID)), t.defines !== void 0) for (let e in t.defines) n.push(e), n.push(t.defines[e]);
		return t.isRawShaderMaterial === !1 && (_(n, t), v(n, t), n.push(e.outputColorSpace)), n.push(t.customProgramCacheKey), n.join();
	}
	function _(e, t) {
		e.push(t.precision), e.push(t.outputColorSpace), e.push(t.envMapMode), e.push(t.envMapCubeUVHeight), e.push(t.mapUv), e.push(t.alphaMapUv), e.push(t.lightMapUv), e.push(t.aoMapUv), e.push(t.bumpMapUv), e.push(t.normalMapUv), e.push(t.displacementMapUv), e.push(t.emissiveMapUv), e.push(t.metalnessMapUv), e.push(t.roughnessMapUv), e.push(t.anisotropyMapUv), e.push(t.clearcoatMapUv), e.push(t.clearcoatNormalMapUv), e.push(t.clearcoatRoughnessMapUv), e.push(t.iridescenceMapUv), e.push(t.iridescenceThicknessMapUv), e.push(t.sheenColorMapUv), e.push(t.sheenRoughnessMapUv), e.push(t.specularMapUv), e.push(t.specularColorMapUv), e.push(t.specularIntensityMapUv), e.push(t.transmissionMapUv), e.push(t.thicknessMapUv), e.push(t.combine), e.push(t.fogExp2), e.push(t.sizeAttenuation), e.push(t.morphTargetsCount), e.push(t.morphAttributeCount), e.push(t.numSunLights), e.push(t.numDirLights), e.push(t.numPointLights), e.push(t.numSpotLights), e.push(t.numSpotLightMaps), e.push(t.numHemiLights), e.push(t.numRectAreaLights), e.push(t.numSunLightShadows), e.push(t.numDirLightShadows), e.push(t.numPointLightShadows), e.push(t.numSpotLightShadows), e.push(t.numSpotLightShadowsWithMaps), e.push(t.numLightProbes), e.push(t.shadowMapType), e.push(t.toneMapping), e.push(t.numClippingPlanes), e.push(t.numClipIntersection), e.push(t.depthPacking);
	}
	function v(e, t) {
		o.disableAll(), t.instancing && o.enable(0), t.instancingColor && o.enable(1), t.instancingMorph && o.enable(2), t.matcap && o.enable(3), t.envMap && o.enable(4), t.normalMapObjectSpace && o.enable(5), t.normalMapTangentSpace && o.enable(6), t.clearcoat && o.enable(7), t.iridescence && o.enable(8), t.alphaTest && o.enable(9), t.vertexColors && o.enable(10), t.vertexAlphas && o.enable(11), t.vertexUv1s && o.enable(12), t.vertexUv2s && o.enable(13), t.vertexUv3s && o.enable(14), t.vertexTangents && o.enable(15), t.anisotropy && o.enable(16), t.alphaHash && o.enable(17), t.batching && o.enable(18), t.dispersion && o.enable(19), t.retroreflection && o.enable(24), t.batchingColor && o.enable(20), t.gradientMap && o.enable(21), t.packedNormalMap && o.enable(22), t.vertexNormals && o.enable(23), e.push(o.mask), o.disableAll(), t.fog && o.enable(0), t.useFog && o.enable(1), t.flatShading && o.enable(2), t.logarithmicDepthBuffer && o.enable(3), t.reversedDepthBuffer && o.enable(4), t.skinning && o.enable(5), t.morphTargets && o.enable(6), t.morphNormals && o.enable(7), t.morphColors && o.enable(8), t.premultipliedAlpha && o.enable(9), t.shadowMapEnabled && o.enable(10), t.doubleSided && o.enable(11), t.flipSided && o.enable(12), t.useDepthPacking && o.enable(13), t.dithering && o.enable(14), t.transmission && o.enable(15), t.sheen && o.enable(16), t.opaque && o.enable(17), t.pointsUvs && o.enable(18), t.decodeVideoTexture && o.enable(19), t.decodeVideoTextureEmissive && o.enable(20), t.alphaToCoverage && o.enable(21), t.numLightProbeGrids > 0 && o.enable(22), t.hasPositionAttribute && o.enable(23), e.push(o.mask);
	}
	function y(e) {
		let t = p[e.type], n;
		if (t) {
			let e = uo[t];
			n = yi.clone(e.uniforms);
		} else n = e.uniforms;
		return n;
	}
	function b(t, n) {
		let r = u.get(n);
		return r === void 0 ? (r = new zc(e, n, t, i), l.push(r), u.set(n, r)) : ++r.usedTimes, r;
	}
	function x(e) {
		if (--e.usedTimes === 0) {
			let t = l.indexOf(e);
			l[t] = l[l.length - 1], l.pop(), u.delete(e.cacheKey), e.destroy();
		}
	}
	function S(e) {
		s.remove(e);
	}
	function C() {
		s.dispose();
	}
	return {
		getParameters: h,
		getProgramCacheKey: g,
		getUniforms: y,
		acquireProgram: b,
		releaseProgram: x,
		releaseShaderCache: S,
		programs: l,
		dispose: C
	};
}
function Gc() {
	let e = /* @__PURE__ */ new WeakMap();
	function t(t) {
		return e.has(t);
	}
	function n(t) {
		let n = e.get(t);
		return n === void 0 && (n = {}, e.set(t, n)), n;
	}
	function r(t) {
		e.delete(t);
	}
	function i(t, n, r) {
		e.get(t)[n] = r;
	}
	function a() {
		e = /* @__PURE__ */ new WeakMap();
	}
	return {
		has: t,
		get: n,
		remove: r,
		update: i,
		dispose: a
	};
}
function Kc(e, t) {
	return e.groupOrder === t.groupOrder ? e.renderOrder === t.renderOrder ? e.material.id === t.material.id ? e.materialVariant === t.materialVariant ? e.z === t.z ? e.id - t.id : e.z - t.z : e.materialVariant - t.materialVariant : e.material.id - t.material.id : e.renderOrder - t.renderOrder : e.groupOrder - t.groupOrder;
}
function qc(e, t) {
	return e.groupOrder === t.groupOrder ? e.renderOrder === t.renderOrder ? e.z === t.z ? e.id - t.id : t.z - e.z : e.renderOrder - t.renderOrder : e.groupOrder - t.groupOrder;
}
function Jc() {
	let e = [], t = 0, n = [], r = [], i = [];
	function a() {
		t = 0, n.length = 0, r.length = 0, i.length = 0;
	}
	function o(e) {
		let t = 0;
		return e.isInstancedMesh && (t += 2), e.isSkinnedMesh && (t += 1), t;
	}
	function s(n, r, i, a, s, c) {
		let l = e[t];
		return l === void 0 ? (l = {
			id: n.id,
			object: n,
			geometry: r,
			material: i,
			materialVariant: o(n),
			groupOrder: a,
			renderOrder: n.renderOrder,
			z: s,
			group: c
		}, e[t] = l) : (l.id = n.id, l.object = n, l.geometry = r, l.material = i, l.materialVariant = o(n), l.groupOrder = a, l.renderOrder = n.renderOrder, l.z = s, l.group = c), t++, l;
	}
	function c(e, t, a, o, c, l, u) {
		u.reversedDepth === !0 && (c = -c);
		let d = s(e, t, a, o, c, l);
		a.transmission > 0 ? r.push(d) : a.transparent === !0 ? i.push(d) : n.push(d);
	}
	function l(e, t, a, o, c, l) {
		let u = s(e, t, a, o, c, l);
		a.transmission > 0 ? r.unshift(u) : a.transparent === !0 ? i.unshift(u) : n.unshift(u);
	}
	function u(e, t) {
		n.length > 1 && n.sort(e || Kc), r.length > 1 && r.sort(t || qc), i.length > 1 && i.sort(t || qc);
	}
	function d() {
		for (let n = t, r = e.length; n < r; n++) {
			let t = e[n];
			if (t.id === null) break;
			t.id = null, t.object = null, t.geometry = null, t.material = null, t.group = null;
		}
	}
	return {
		opaque: n,
		transmissive: r,
		transparent: i,
		init: a,
		push: c,
		unshift: l,
		finish: d,
		sort: u
	};
}
function Yc() {
	let e = /* @__PURE__ */ new WeakMap();
	function t(t, n) {
		let r = e.get(t), i;
		return r === void 0 ? (i = new Jc(), e.set(t, [i])) : n >= r.length ? (i = new Jc(), r.push(i)) : i = r[n], i;
	}
	function n() {
		e = /* @__PURE__ */ new WeakMap();
	}
	return {
		get: t,
		dispose: n
	};
}
function Xc() {
	let e = {};
	return { get: function(t) {
		if (e[t.id] !== void 0) return e[t.id];
		let n;
		switch (t.type) {
			case "SunLight":
			case "DirectionalLight":
				n = {
					direction: new W(),
					color: new J()
				};
				break;
			case "SpotLight":
				n = {
					position: new W(),
					direction: new W(),
					color: new J(),
					distance: 0,
					coneCos: 0,
					penumbraCos: 0,
					decay: 0
				};
				break;
			case "PointLight":
				n = {
					position: new W(),
					color: new J(),
					distance: 0,
					decay: 0
				};
				break;
			case "HemisphereLight":
				n = {
					direction: new W(),
					skyColor: new J(),
					groundColor: new J()
				};
				break;
			case "RectAreaLight": n = {
				color: new J(),
				position: new W(),
				halfWidth: new W(),
				halfHeight: new W()
			};
		}
		return e[t.id] = n, n;
	} };
}
function Zc() {
	let e = {};
	return { get: function(t) {
		if (e[t.id] !== void 0) return e[t.id];
		let n;
		switch (t.type) {
			case "SunLight":
			case "DirectionalLight":
				n = {
					shadowIntensity: 1,
					shadowBias: 0,
					shadowNormalBias: 0,
					shadowRadius: 1,
					shadowMapSize: new H()
				};
				break;
			case "SpotLight":
				n = {
					shadowIntensity: 1,
					shadowBias: 0,
					shadowNormalBias: 0,
					shadowRadius: 1,
					shadowMapSize: new H()
				};
				break;
			case "PointLight": n = {
				shadowIntensity: 1,
				shadowBias: 0,
				shadowNormalBias: 0,
				shadowRadius: 1,
				shadowMapSize: new H(),
				shadowCameraNear: 1,
				shadowCameraFar: 1e3
			};
		}
		return e[t.id] = n, n;
	} };
}
var Qc = 0;
function $c(e, t) {
	return (t.castShadow ? 2 : 0) - (e.castShadow ? 2 : 0) + +!!t.map - !!e.map;
}
function el(e) {
	let t = new Xc(), n = Zc(), r = {
		version: 0,
		hash: {
			sunLength: -1,
			directionalLength: -1,
			pointLength: -1,
			spotLength: -1,
			rectAreaLength: -1,
			hemiLength: -1,
			numSunShadows: -1,
			numDirectionalShadows: -1,
			numPointShadows: -1,
			numSpotShadows: -1,
			numSpotMaps: -1,
			numLightProbes: -1
		},
		ambient: [
			0,
			0,
			0
		],
		probe: [],
		sun: [],
		sunShadow: [],
		sunShadowMap: [],
		sunShadowMatrix: [],
		sunShadowCascade: [],
		directional: [],
		directionalShadow: [],
		directionalShadowMap: [],
		directionalShadowMatrix: [],
		spot: [],
		spotLightMap: [],
		spotShadow: [],
		spotShadowMap: [],
		spotLightMatrix: [],
		rectArea: [],
		rectAreaLTC1: null,
		rectAreaLTC2: null,
		point: [],
		pointShadow: [],
		pointShadowMap: [],
		pointShadowMatrix: [],
		hemi: [],
		numSpotLightShadowsWithMaps: 0,
		numLightProbes: 0
	};
	for (let e = 0; e < 9; e++) r.probe.push(new W());
	let i = new W(), a = new q(), o = new q();
	function s(i) {
		let a = 0, o = 0, s = 0;
		for (let e = 0; e < 9; e++) r.probe[e].set(0, 0, 0);
		let c = 0, l = 0, u = 0, d = 0, f = 0, p = 0, m = 0, h = 0, g = 0, _ = 0, v = 0, y = 0, b = 0, x = 0;
		i.sort($c);
		for (let e = 0, S = i.length; e < S; e++) {
			let S = i[e], C = S.color, w = S.intensity, T = S.distance, E = null;
			if (S.shadow && S.shadow.map && (E = S.shadow.map.texture.format === 1030 ? S.shadow.map.texture : S.shadow.map.depthTexture || S.shadow.map.texture), S.isAmbientLight) a += C.r * w, o += C.g * w, s += C.b * w;
			else if (S.isLightProbe) {
				for (let e = 0; e < 9; e++) r.probe[e].addScaledVector(S.sh.coefficients[e], w);
				x++;
			} else if (S.isSunLight) {
				let e = t.get(S);
				if (e.color.copy(S.color).multiplyScalar(S.intensity), S.castShadow) {
					let e = S.shadow, t = n.get(S);
					t.shadowIntensity = e.intensity, t.shadowBias = e.bias, t.shadowNormalBias = e.normalBias, t.shadowRadius = e.radius, t.shadowMapSize.copy(e.mapSize).multiply(e.getFrameExtents()), r.sunShadow[l] = t, r.sunShadowMap[l] = E;
					let i = e.getViewportCount();
					for (let t = 0; t < i; t++) r.sunShadowMatrix[u + t] = e.getMatrix(t), r.sunShadowCascade[u + t] = e._cascadeData[t];
					u += i, l++;
				}
				r.sun[c] = e, c++;
			} else if (S.isDirectionalLight) {
				let e = t.get(S);
				if (e.color.copy(S.color).multiplyScalar(S.intensity), S.castShadow) {
					let e = S.shadow, t = n.get(S);
					t.shadowIntensity = e.intensity, t.shadowBias = e.bias, t.shadowNormalBias = e.normalBias, t.shadowRadius = e.radius, t.shadowMapSize = e.mapSize, r.directionalShadow[d] = t, r.directionalShadowMap[d] = E, r.directionalShadowMatrix[d] = S.shadow.matrix, g++;
				}
				r.directional[d] = e, d++;
			} else if (S.isSpotLight) {
				let e = t.get(S);
				e.position.setFromMatrixPosition(S.matrixWorld), e.color.copy(C).multiplyScalar(w), e.distance = T, e.coneCos = Math.cos(S.angle), e.penumbraCos = Math.cos(S.angle * (1 - S.penumbra)), e.decay = S.decay, r.spot[p] = e;
				let i = S.shadow;
				if (S.map && (r.spotLightMap[y] = S.map, y++, i.updateMatrices(S), S.castShadow && b++), r.spotLightMatrix[p] = i.matrix, S.castShadow) {
					let e = n.get(S);
					e.shadowIntensity = i.intensity, e.shadowBias = i.bias, e.shadowNormalBias = i.normalBias, e.shadowRadius = i.radius, e.shadowMapSize = i.mapSize, r.spotShadow[p] = e, r.spotShadowMap[p] = E, v++;
				}
				p++;
			} else if (S.isRectAreaLight) {
				let e = t.get(S);
				e.color.copy(C).multiplyScalar(w), e.halfWidth.set(S.width * .5, 0, 0), e.halfHeight.set(0, S.height * .5, 0), r.rectArea[m] = e, m++;
			} else if (S.isPointLight) {
				let e = t.get(S);
				if (e.color.copy(S.color).multiplyScalar(S.intensity), e.distance = S.distance, e.decay = S.decay, S.castShadow) {
					let e = S.shadow, t = n.get(S);
					t.shadowIntensity = e.intensity, t.shadowBias = e.bias, t.shadowNormalBias = e.normalBias, t.shadowRadius = e.radius, t.shadowMapSize = e.mapSize, t.shadowCameraNear = e.camera.near, t.shadowCameraFar = e.camera.far, r.pointShadow[f] = t, r.pointShadowMap[f] = E, r.pointShadowMatrix[f] = S.shadow.matrix, _++;
				}
				r.point[f] = e, f++;
			} else if (S.isHemisphereLight) {
				let e = t.get(S);
				e.skyColor.copy(S.color).multiplyScalar(w), e.groundColor.copy(S.groundColor).multiplyScalar(w), r.hemi[h] = e, h++;
			}
		}
		m > 0 && (e.has("OES_texture_float_linear") === !0 ? (r.rectAreaLTC1 = X.LTC_FLOAT_1, r.rectAreaLTC2 = X.LTC_FLOAT_2) : (r.rectAreaLTC1 = X.LTC_HALF_1, r.rectAreaLTC2 = X.LTC_HALF_2)), r.ambient[0] = a, r.ambient[1] = o, r.ambient[2] = s;
		let S = r.hash;
		(S.sunLength !== c || S.directionalLength !== d || S.pointLength !== f || S.spotLength !== p || S.rectAreaLength !== m || S.hemiLength !== h || S.numSunShadows !== l || S.numDirectionalShadows !== g || S.numPointShadows !== _ || S.numSpotShadows !== v || S.numSpotMaps !== y || S.numLightProbes !== x) && (r.sun.length = c, r.directional.length = d, r.spot.length = p, r.rectArea.length = m, r.point.length = f, r.hemi.length = h, r.sunShadow.length = l, r.sunShadowMap.length = l, r.sunShadowMatrix.length = u, r.sunShadowCascade.length = u, r.directionalShadow.length = g, r.directionalShadowMap.length = g, r.directionalShadowMatrix.length = g, r.pointShadow.length = _, r.pointShadowMap.length = _, r.pointShadowMatrix.length = _, r.spotShadow.length = v, r.spotShadowMap.length = v, r.spotLightMatrix.length = v + y - b, r.spotLightMap.length = y, r.numSpotLightShadowsWithMaps = b, r.numLightProbes = x, S.sunLength = c, S.directionalLength = d, S.pointLength = f, S.spotLength = p, S.rectAreaLength = m, S.hemiLength = h, S.numSunShadows = l, S.numDirectionalShadows = g, S.numPointShadows = _, S.numSpotShadows = v, S.numSpotMaps = y, S.numLightProbes = x, r.version = Qc++);
	}
	function c(e, t) {
		let n = 0, s = 0, c = 0, l = 0, u = 0, d = 0, f = t.matrixWorldInverse;
		for (let t = 0, p = e.length; t < p; t++) {
			let p = e[t];
			if (p.isSunLight) {
				let e = r.sun[n];
				e.direction.setFromMatrixPosition(p.matrixWorld), e.direction.transformDirection(f), n++;
			} else if (p.isDirectionalLight) {
				let e = r.directional[s];
				e.direction.setFromMatrixPosition(p.matrixWorld), i.setFromMatrixPosition(p.target.matrixWorld), e.direction.sub(i), e.direction.transformDirection(f), s++;
			} else if (p.isSpotLight) {
				let e = r.spot[l];
				e.position.setFromMatrixPosition(p.matrixWorld), e.position.applyMatrix4(f), e.direction.setFromMatrixPosition(p.matrixWorld), i.setFromMatrixPosition(p.target.matrixWorld), e.direction.sub(i), e.direction.transformDirection(f), l++;
			} else if (p.isRectAreaLight) {
				let e = r.rectArea[u];
				e.position.setFromMatrixPosition(p.matrixWorld), e.position.applyMatrix4(f), o.identity(), a.copy(p.matrixWorld), a.premultiply(f), o.extractRotation(a), e.halfWidth.set(p.width * .5, 0, 0), e.halfHeight.set(0, p.height * .5, 0), e.halfWidth.applyMatrix4(o), e.halfHeight.applyMatrix4(o), u++;
			} else if (p.isPointLight) {
				let e = r.point[c];
				e.position.setFromMatrixPosition(p.matrixWorld), e.position.applyMatrix4(f), c++;
			} else if (p.isHemisphereLight) {
				let e = r.hemi[d];
				e.direction.setFromMatrixPosition(p.matrixWorld), e.direction.transformDirection(f), d++;
			}
		}
	}
	return {
		setup: s,
		setupView: c,
		state: r
	};
}
function tl(e) {
	let t = new el(e), n = [], r = [], i = [];
	function a(e) {
		d.camera = e, n.length = 0, r.length = 0, i.length = 0;
	}
	function o(e) {
		n.push(e);
	}
	function s(e) {
		r.push(e);
	}
	function c(e) {
		i.push(e);
	}
	function l() {
		t.setup(n);
	}
	function u(e) {
		t.setupView(n, e);
	}
	let d = {
		lightsArray: n,
		shadowsArray: r,
		lightProbeGridArray: i,
		camera: null,
		lights: t,
		transmissionRenderTarget: {},
		textureUnits: 0
	};
	return {
		init: a,
		state: d,
		setupLights: l,
		setupLightsView: u,
		pushLight: o,
		pushShadow: s,
		pushLightProbeGrid: c
	};
}
function nl(e) {
	let t = /* @__PURE__ */ new WeakMap();
	function n(n, r = 0) {
		let i = t.get(n), a;
		return i === void 0 ? (a = new tl(e), t.set(n, [a])) : r >= i.length ? (a = new tl(e), i.push(a)) : a = i[r], a;
	}
	function r() {
		t = /* @__PURE__ */ new WeakMap();
	}
	return {
		get: n,
		dispose: r
	};
}
var rl = "void main() {\n	gl_Position = vec4( position, 1.0 );\n}", il = "uniform sampler2D shadow_pass;\nuniform vec2 resolution;\nuniform float radius;\nvoid main() {\n	const float samples = float( VSM_SAMPLES );\n	float mean = 0.0;\n	float squared_mean = 0.0;\n	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );\n	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;\n	for ( float i = 0.0; i < samples; i ++ ) {\n		float uvOffset = uvStart + i * uvStride;\n		#ifdef HORIZONTAL_PASS\n			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;\n			mean += distribution.x;\n			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;\n		#else\n			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;\n			mean += depth;\n			squared_mean += depth * depth;\n		#endif\n	}\n	mean = mean / samples;\n	squared_mean = squared_mean / samples;\n	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );\n	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );\n}", al = [
	/*@__PURE__*/ new W(1, 0, 0),
	/*@__PURE__*/ new W(-1, 0, 0),
	/*@__PURE__*/ new W(0, 1, 0),
	/*@__PURE__*/ new W(0, -1, 0),
	/*@__PURE__*/ new W(0, 0, 1),
	/*@__PURE__*/ new W(0, 0, -1)
], ol = [
	/*@__PURE__*/ new W(0, -1, 0),
	/*@__PURE__*/ new W(0, -1, 0),
	/*@__PURE__*/ new W(0, 0, 1),
	/*@__PURE__*/ new W(0, 0, -1),
	/*@__PURE__*/ new W(0, -1, 0),
	/*@__PURE__*/ new W(0, -1, 0)
], sl = /*@__PURE__*/ new q(), cl = /*@__PURE__*/ new W(), ll = /*@__PURE__*/ new W();
function ul(e, t, n) {
	let i = new Br(), a = new H(), s = new H(), c = new tt(), l = new Di(), u = new Oi(), m = {}, h = n.maxTextureSize, g = {
		0: 1,
		1: 0,
		2: 2
	}, _ = new Si({
		defines: { VSM_SAMPLES: 8 },
		uniforms: {
			shadow_pass: { value: null },
			resolution: { value: new H() },
			radius: { value: 4 }
		},
		vertexShader: rl,
		fragmentShader: il
	}), y = _.clone();
	y.defines.HORIZONTAL_PASS = 1;
	let b = new Ln();
	b.setAttribute("position", new Sn(new Float32Array([
		-1,
		-1,
		.5,
		3,
		-1,
		.5,
		-1,
		3,
		.5
	]), 3));
	let x = new ur(b, _), C = this;
	this.enabled = !1, this.autoUpdate = !0, this.needsUpdate = !1, this.type = 1;
	let w = this.type;
	this.render = function(t, n, l) {
		if (C.enabled === !1 || C.autoUpdate === !1 && C.needsUpdate === !1 || t.length === 0) return;
		this.type === 2 && (I("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."), this.type = 1);
		let u = e.getRenderTarget(), m = e.getActiveCubeFace(), g = e.getActiveMipmapLevel(), _ = e.state;
		_.setBlending(0), _.buffers.depth.getReversed() === !0 ? _.buffers.color.setClear(0, 0, 0, 0) : _.buffers.color.setClear(1, 1, 1, 1), _.buffers.depth.setTest(!0), _.setScissorTest(!1);
		let y = w !== this.type;
		y && n.traverse(function(e) {
			e.material && (Array.isArray(e.material) ? e.material.forEach((e) => e.needsUpdate = !0) : e.material.needsUpdate = !0);
		});
		for (let u = 0, m = t.length; u < m; u++) {
			let m = t[u], g = m.shadow;
			if (g === void 0) {
				I("WebGLShadowMap:", m, "has no shadow.");
				continue;
			}
			if (g.autoUpdate === !1 && g.needsUpdate === !1) continue;
			a.copy(g.mapSize);
			let b = g.getFrameExtents();
			a.multiply(b), s.copy(g.mapSize), (a.x > h || a.y > h) && (a.x > h && (s.x = Math.floor(h / b.x), a.x = s.x * b.x, g.mapSize.x = s.x), a.y > h && (s.y = Math.floor(h / b.y), a.y = s.y * b.y, g.mapSize.y = s.y));
			let x = e.state.buffers.depth.getReversed();
			if (g.camera._reversedDepth = x, g.map === null || y === !0) {
				if (g.map !== null && (g.map.depthTexture !== null && (g.map.depthTexture.dispose(), g.map.depthTexture = null), g.map.dispose()), this.type === 3) {
					if (m.isPointLight) {
						I("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");
						continue;
					}
					g.map = new rt(a.x, a.y, {
						format: S,
						type: p,
						minFilter: o,
						magFilter: o,
						generateMipmaps: !1
					}), g.map.texture.name = m.name + ".shadowMap", g.map.depthTexture = new li(a.x, a.y, f), g.map.depthTexture.name = m.name + ".shadowMapDepth", g.map.depthTexture.format = v, g.map.depthTexture.compareFunction = null, g.map.depthTexture.minFilter = r, g.map.depthTexture.magFilter = r;
				} else m.isPointLight ? (g.map = new Vo(a.x), g.map.depthTexture = new ui(a.x, d)) : (g.map = new rt(a.x, a.y), g.map.depthTexture = new li(a.x, a.y, d)), g.map.depthTexture.name = m.name + ".shadowMap", g.map.depthTexture.format = v, this.type === 1 ? (g.map.depthTexture.compareFunction = x ? 518 : 515, g.map.depthTexture.minFilter = o, g.map.depthTexture.magFilter = o) : (g.map.depthTexture.compareFunction = null, g.map.depthTexture.minFilter = r, g.map.depthTexture.magFilter = r);
				g.camera.updateProjectionMatrix();
			}
			g.map.isWebGLCubeRenderTarget !== !0 && (g.map.width !== a.x || g.map.height !== a.y) && g.map.setSize(a.x, a.y);
			let C = g.map.isWebGLCubeRenderTarget ? 6 : g.getViewportCount();
			m.isPointLight !== !0 && g.updateMatrices(m, l);
			for (let t = 0; t < C; t++) {
				let r = g.getCamera(t);
				if (m.isPointLight) {
					let e = g.camera, n = g.matrix, r = m.distance || e.far;
					r !== e.far && (e.far = r, e.updateProjectionMatrix()), cl.setFromMatrixPosition(m.matrixWorld), e.position.copy(cl), ll.copy(e.position), ll.add(al[t]), e.up.copy(ol[t]), e.lookAt(ll), e.updateMatrixWorld(), n.makeTranslation(-cl.x, -cl.y, -cl.z), sl.multiplyMatrices(e.projectionMatrix, e.matrixWorldInverse), g._frustum.setFromProjectionMatrix(sl, e.coordinateSystem, e.reversedDepth);
				}
				if (g.map.isWebGLCubeRenderTarget) e.setRenderTarget(g.map, t), e.clear();
				else {
					t === 0 && (e.setRenderTarget(g.map), e.clear());
					let n = g.getViewport(t);
					c.set(s.x * n.x, s.y * n.y, s.x * n.z, s.y * n.w), _.viewport(c);
				}
				i = g.getFrustum(t), D(n, l, r, m, this.type);
			}
			g.isPointLightShadow !== !0 && this.type === 3 && T(g, l), g.needsUpdate = !1;
		}
		w = this.type, C.needsUpdate = !1, e.setRenderTarget(u, m, g);
	};
	function T(n, r) {
		let i = t.update(x);
		_.defines.VSM_SAMPLES !== n.blurSamples && (_.defines.VSM_SAMPLES = n.blurSamples, y.defines.VSM_SAMPLES = n.blurSamples, _.needsUpdate = !0, y.needsUpdate = !0), n.mapPass === null ? n.mapPass = new rt(a.x, a.y, {
			format: S,
			type: p
		}) : (n.mapPass.width !== n.map.width || n.mapPass.height !== n.map.height) && n.mapPass.setSize(n.map.width, n.map.height), _.uniforms.shadow_pass.value = n.map.depthTexture, _.uniforms.resolution.value.set(n.map.width, n.map.height), _.uniforms.radius.value = n.radius, e.setRenderTarget(n.mapPass), e.clear(), e.renderBufferDirect(r, null, i, _, x, null), y.uniforms.shadow_pass.value = n.mapPass.texture, y.uniforms.resolution.value.set(n.map.width, n.map.height), y.uniforms.radius.value = n.radius, e.setRenderTarget(n.map), e.clear(), e.renderBufferDirect(r, null, i, y, x, null);
	}
	function E(t, n, r, i) {
		let a = null, o = r.isPointLight === !0 ? t.customDistanceMaterial : t.customDepthMaterial;
		if (o !== void 0) a = o;
		else if (a = r.isPointLight === !0 ? u : l, e.localClippingEnabled && n.clipShadows === !0 && Array.isArray(n.clippingPlanes) && n.clippingPlanes.length !== 0 || n.displacementMap && n.displacementScale !== 0 || n.alphaMap && n.alphaTest > 0 || n.map && n.alphaTest > 0 || n.alphaToCoverage === !0) {
			let e = a.uuid, t = n.uuid, r = m[e];
			r === void 0 && (r = {}, m[e] = r);
			let i = r[t];
			i === void 0 && (i = a.clone(), r[t] = i, n.addEventListener("dispose", O)), a = i;
		}
		if (a.visible = n.visible, a.wireframe = n.wireframe, i === 3 ? a.side = n.shadowSide === null ? n.side : n.shadowSide : a.side = n.shadowSide === null ? g[n.side] : n.shadowSide, a.alphaMap = n.alphaMap, a.alphaTest = n.alphaToCoverage === !0 ? .5 : n.alphaTest, a.map = n.map, a.clipShadows = n.clipShadows, a.clippingPlanes = n.clippingPlanes, a.clipIntersection = n.clipIntersection, a.displacementMap = n.displacementMap, a.displacementScale = n.displacementScale, a.displacementBias = n.displacementBias, a.wireframeLinewidth = n.wireframeLinewidth, a.linewidth = n.linewidth, r.isPointLight === !0 && a.isMeshDistanceMaterial === !0) {
			let t = e.properties.get(a);
			t.light = r;
		}
		return a;
	}
	function D(n, r, a, o, s) {
		if (n.visible === !1) return;
		if (n.layers.test(r.layers) && (n.isMesh || n.isLine || n.isPoints) && (n.castShadow || n.receiveShadow && s === 3) && (!n.frustumCulled || n.intersectsFrustum(i))) {
			n.modelViewMatrix.multiplyMatrices(a.matrixWorldInverse, n.matrixWorld);
			let i = t.update(n), c = n.material;
			if (Array.isArray(c)) {
				let t = i.groups;
				for (let l = 0, u = t.length; l < u; l++) {
					let u = t[l], d = c[u.materialIndex];
					if (d && d.visible) {
						let t = E(n, d, o, s);
						n.onBeforeShadow(e, n, r, a, i, t, u), e.renderBufferDirect(a, null, i, t, n, u), n.onAfterShadow(e, n, r, a, i, t, u);
					}
				}
			} else if (c.visible) {
				let t = E(n, c, o, s);
				n.onBeforeShadow(e, n, r, a, i, t, null), e.renderBufferDirect(a, null, i, t, n, null), n.onAfterShadow(e, n, r, a, i, t, null);
			}
		}
		let c = n.children;
		for (let e = 0, t = c.length; e < t; e++) D(c[e], r, a, o, s);
	}
	function O(e) {
		e.target.removeEventListener("dispose", O);
		for (let t in m) {
			let n = m[t], r = e.target.uuid;
			r in n && (n[r].dispose(), delete n[r]);
		}
	}
}
function dl(e, t) {
	function n() {
		let t = !1, n = new tt(), r = null, i = new tt(0, 0, 0, 0);
		return {
			setMask: function(n) {
				r !== n && !t && (e.colorMask(n, n, n, n), r = n);
			},
			setLocked: function(e) {
				t = e;
			},
			setClear: function(t, r, a, o, s) {
				s === !0 && (t *= o, r *= o, a *= o), n.set(t, r, a, o), i.equals(n) === !1 && (e.clearColor(t, r, a, o), i.copy(n));
			},
			reset: function() {
				t = !1, r = null, i.set(-1, 0, 0, 0);
			}
		};
	}
	function r() {
		let n = !1, r = !1, i = null, a = null, o = null;
		return {
			setReversed: function(e) {
				if (r !== e) {
					let n = t.get("EXT_clip_control");
					e ? n.clipControlEXT(n.LOWER_LEFT_EXT, n.ZERO_TO_ONE_EXT) : n.clipControlEXT(n.LOWER_LEFT_EXT, n.NEGATIVE_ONE_TO_ONE_EXT), r = e;
					let i = o;
					o = null, this.setClear(i);
				}
			},
			getReversed: function() {
				return r;
			},
			setTest: function(t) {
				t ? ce(e.DEPTH_TEST) : le(e.DEPTH_TEST);
			},
			setMask: function(t) {
				i !== t && !n && (e.depthMask(t), i = t);
			},
			setFunc: function(t) {
				if (r && (t = me[t]), a !== t) {
					switch (t) {
						case 0:
							e.depthFunc(e.NEVER);
							break;
						case 1:
							e.depthFunc(e.ALWAYS);
							break;
						case 2:
							e.depthFunc(e.LESS);
							break;
						case 3:
							e.depthFunc(e.LEQUAL);
							break;
						case 4:
							e.depthFunc(e.EQUAL);
							break;
						case 5:
							e.depthFunc(e.GEQUAL);
							break;
						case 6:
							e.depthFunc(e.GREATER);
							break;
						case 7:
							e.depthFunc(e.NOTEQUAL);
							break;
						default: e.depthFunc(e.LEQUAL);
					}
					a = t;
				}
			},
			setLocked: function(e) {
				n = e;
			},
			setClear: function(t) {
				o !== t && (o = t, r && (t = 1 - t), e.clearDepth(t));
			},
			reset: function() {
				n = !1, i = null, a = null, o = null, r = !1;
			}
		};
	}
	function i() {
		let t = !1, n = null, r = null, i = null, a = null, o = null, s = null, c = null, l = null;
		return {
			setTest: function(n) {
				t || (n ? ce(e.STENCIL_TEST) : le(e.STENCIL_TEST));
			},
			setMask: function(r) {
				n !== r && !t && (e.stencilMask(r), n = r);
			},
			setFunc: function(t, n, o) {
				(r !== t || i !== n || a !== o) && (e.stencilFunc(t, n, o), r = t, i = n, a = o);
			},
			setOp: function(t, n, r) {
				(o !== t || s !== n || c !== r) && (e.stencilOp(t, n, r), o = t, s = n, c = r);
			},
			setLocked: function(e) {
				t = e;
			},
			setClear: function(t) {
				l !== t && (e.clearStencil(t), l = t);
			},
			reset: function() {
				t = !1, n = null, r = null, i = null, a = null, o = null, s = null, c = null, l = null;
			}
		};
	}
	let a = new n(), o = new r(), s = new i(), c = /* @__PURE__ */ new WeakMap(), l = /* @__PURE__ */ new WeakMap(), u = {}, d = {}, f = {}, p = /* @__PURE__ */ new WeakMap(), m = [], h = null, g = !1, _ = null, v = null, y = null, b = null, x = null, S = null, C = null, w = new J(0, 0, 0), T = 0, E = !1, D = null, O = null, ee = null, k = null, A = null, j = e.getParameter(e.MAX_COMBINED_TEXTURE_IMAGE_UNITS), te = !1, M = 0, N = e.getParameter(e.VERSION);
	N.indexOf("WebGL") === -1 ? N.indexOf("OpenGL ES") !== -1 && (M = parseFloat(/^OpenGL ES (\d)/.exec(N)[1]), te = M >= 2) : (M = parseFloat(/^WebGL (\d)/.exec(N)[1]), te = M >= 1);
	let ne = null, P = {}, re = e.getParameter(e.SCISSOR_BOX), F = e.getParameter(e.VIEWPORT), ie = new tt().fromArray(re), ae = new tt().fromArray(F);
	function oe(t, n, r, i) {
		let a = /* @__PURE__ */ new Uint8Array(4), o = e.createTexture();
		e.bindTexture(t, o), e.texParameteri(t, e.TEXTURE_MIN_FILTER, e.NEAREST), e.texParameteri(t, e.TEXTURE_MAG_FILTER, e.NEAREST);
		for (let o = 0; o < r; o++) t === e.TEXTURE_3D || t === e.TEXTURE_2D_ARRAY ? e.texImage3D(n, 0, e.RGBA, 1, 1, i, 0, e.RGBA, e.UNSIGNED_BYTE, a) : e.texImage2D(n + o, 0, e.RGBA, 1, 1, 0, e.RGBA, e.UNSIGNED_BYTE, a);
		return o;
	}
	let se = {};
	se[e.TEXTURE_2D] = oe(e.TEXTURE_2D, e.TEXTURE_2D, 1), se[e.TEXTURE_CUBE_MAP] = oe(e.TEXTURE_CUBE_MAP, e.TEXTURE_CUBE_MAP_POSITIVE_X, 6), se[e.TEXTURE_2D_ARRAY] = oe(e.TEXTURE_2D_ARRAY, e.TEXTURE_2D_ARRAY, 1, 1), se[e.TEXTURE_3D] = oe(e.TEXTURE_3D, e.TEXTURE_3D, 1, 1), a.setClear(0, 0, 0, 1), o.setClear(1), s.setClear(0), ce(e.DEPTH_TEST), o.setFunc(3), _e(!1), ve(1), ce(e.CULL_FACE), he(0);
	function ce(t) {
		u[t] !== !0 && (e.enable(t), u[t] = !0);
	}
	function le(t) {
		u[t] !== !1 && (e.disable(t), u[t] = !1);
	}
	function ue(t, n) {
		return f[t] !== n && (e.bindFramebuffer(t, n), f[t] = n, t === e.DRAW_FRAMEBUFFER && (f[e.FRAMEBUFFER] = n), t === e.FRAMEBUFFER && (f[e.DRAW_FRAMEBUFFER] = n), !0);
	}
	function de(t, n) {
		let r = m, i = !1;
		if (t) {
			r = p.get(n), r === void 0 && (r = [], p.set(n, r));
			let a = t.textures;
			if (r.length !== a.length || r[0] !== e.COLOR_ATTACHMENT0) {
				for (let t = 0, n = a.length; t < n; t++) r[t] = e.COLOR_ATTACHMENT0 + t;
				r.length = a.length, i = !0;
			}
		} else r[0] !== e.BACK && (r[0] = e.BACK, i = !0);
		i && e.drawBuffers(r);
	}
	function I(t) {
		return h !== t && (e.useProgram(t), h = t, !0);
	}
	let fe = {
		100: e.FUNC_ADD,
		101: e.FUNC_SUBTRACT,
		102: e.FUNC_REVERSE_SUBTRACT
	};
	fe[103] = e.MIN, fe[104] = e.MAX;
	let pe = {
		200: e.ZERO,
		201: e.ONE,
		202: e.SRC_COLOR,
		204: e.SRC_ALPHA,
		210: e.SRC_ALPHA_SATURATE,
		208: e.DST_COLOR,
		206: e.DST_ALPHA,
		203: e.ONE_MINUS_SRC_COLOR,
		205: e.ONE_MINUS_SRC_ALPHA,
		209: e.ONE_MINUS_DST_COLOR,
		207: e.ONE_MINUS_DST_ALPHA,
		211: e.CONSTANT_COLOR,
		212: e.ONE_MINUS_CONSTANT_COLOR,
		213: e.CONSTANT_ALPHA,
		214: e.ONE_MINUS_CONSTANT_ALPHA
	};
	function he(t, n, r, i, a, o, s, c, l, u) {
		if (t === 0) g === !0 && (le(e.BLEND), g = !1);
		else if (g === !1 && (ce(e.BLEND), g = !0), t !== 5) {
			if (t !== _ || u !== E) {
				if ((v !== 100 || x !== 100) && (e.blendEquation(e.FUNC_ADD), v = 100, x = 100), u) switch (t) {
					case 1:
						e.blendFuncSeparate(e.ONE, e.ONE_MINUS_SRC_ALPHA, e.ONE, e.ONE_MINUS_SRC_ALPHA);
						break;
					case 2:
						e.blendFunc(e.ONE, e.ONE);
						break;
					case 3:
						e.blendFuncSeparate(e.ZERO, e.ONE_MINUS_SRC_COLOR, e.ZERO, e.ONE);
						break;
					case 4:
						e.blendFuncSeparate(e.DST_COLOR, e.ONE_MINUS_SRC_ALPHA, e.ZERO, e.ONE);
						break;
					default: L("WebGLState: Invalid blending: ", t);
				}
				else switch (t) {
					case 1:
						e.blendFuncSeparate(e.SRC_ALPHA, e.ONE_MINUS_SRC_ALPHA, e.ONE, e.ONE_MINUS_SRC_ALPHA);
						break;
					case 2:
						e.blendFuncSeparate(e.SRC_ALPHA, e.ONE, e.ONE, e.ONE);
						break;
					case 3:
						L("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");
						break;
					case 4:
						L("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");
						break;
					default: L("WebGLState: Invalid blending: ", t);
				}
				y = null, b = null, S = null, C = null, w.set(0, 0, 0), T = 0, _ = t, E = u;
			}
		} else a ||= n, o ||= r, s ||= i, (n !== v || a !== x) && (e.blendEquationSeparate(fe[n], fe[a]), v = n, x = a), (r !== y || i !== b || o !== S || s !== C) && (e.blendFuncSeparate(pe[r], pe[i], pe[o], pe[s]), y = r, b = i, S = o, C = s), (c.equals(w) === !1 || l !== T) && (e.blendColor(c.r, c.g, c.b, l), w.copy(c), T = l), _ = t, E = !1;
	}
	function ge(t, n) {
		t.side === 2 ? le(e.CULL_FACE) : ce(e.CULL_FACE);
		let r = t.side === 1;
		n && (r = !r), _e(r), t.blending === 1 && t.transparent === !1 ? he(0) : he(t.blending, t.blendEquation, t.blendSrc, t.blendDst, t.blendEquationAlpha, t.blendSrcAlpha, t.blendDstAlpha, t.blendColor, t.blendAlpha, t.premultipliedAlpha), o.setFunc(t.depthFunc), o.setTest(t.depthTest), o.setMask(t.depthWrite), a.setMask(t.colorWrite);
		let i = t.stencilWrite;
		s.setTest(i), i && (s.setMask(t.stencilWriteMask), s.setFunc(t.stencilFunc, t.stencilRef, t.stencilFuncMask), s.setOp(t.stencilFail, t.stencilZFail, t.stencilZPass)), be(t.polygonOffset, t.polygonOffsetFactor, t.polygonOffsetUnits), t.alphaToCoverage === !0 ? ce(e.SAMPLE_ALPHA_TO_COVERAGE) : le(e.SAMPLE_ALPHA_TO_COVERAGE);
	}
	function _e(t) {
		D !== t && (t ? e.frontFace(e.CW) : e.frontFace(e.CCW), D = t);
	}
	function ve(t) {
		t === 0 ? le(e.CULL_FACE) : (ce(e.CULL_FACE), t !== O && (t === 1 ? e.cullFace(e.BACK) : t === 2 ? e.cullFace(e.FRONT) : e.cullFace(e.FRONT_AND_BACK))), O = t;
	}
	function ye(t) {
		t !== ee && (te && e.lineWidth(t), ee = t);
	}
	function be(t, n, r) {
		t ? (ce(e.POLYGON_OFFSET_FILL), (k !== n || A !== r) && (k = n, A = r, o.getReversed() && (n = -n), e.polygonOffset(n, r))) : le(e.POLYGON_OFFSET_FILL);
	}
	function R(t) {
		t ? ce(e.SCISSOR_TEST) : le(e.SCISSOR_TEST);
	}
	function xe(t) {
		t === void 0 && (t = e.TEXTURE0 + j - 1), ne !== t && (e.activeTexture(t), ne = t);
	}
	function Se(t, n, r) {
		r === void 0 && (r = ne === null ? e.TEXTURE0 + j - 1 : ne);
		let i = P[r];
		i === void 0 && (i = {
			type: void 0,
			texture: void 0
		}, P[r] = i), (i.type !== t || i.texture !== n) && (ne !== r && (e.activeTexture(r), ne = r), e.bindTexture(t, n || se[t]), i.type = t, i.texture = n);
	}
	function Ce() {
		let t = P[ne];
		t !== void 0 && t.type !== void 0 && (e.bindTexture(t.type, null), t.type = void 0, t.texture = void 0);
	}
	function we() {
		try {
			e.compressedTexImage2D(...arguments);
		} catch (e) {
			L("WebGLState:", e);
		}
	}
	function Te() {
		try {
			e.compressedTexImage3D(...arguments);
		} catch (e) {
			L("WebGLState:", e);
		}
	}
	function Ee() {
		try {
			e.texSubImage2D(...arguments);
		} catch (e) {
			L("WebGLState:", e);
		}
	}
	function De() {
		try {
			e.texSubImage3D(...arguments);
		} catch (e) {
			L("WebGLState:", e);
		}
	}
	function Oe() {
		try {
			e.compressedTexSubImage2D(...arguments);
		} catch (e) {
			L("WebGLState:", e);
		}
	}
	function ke() {
		try {
			e.compressedTexSubImage3D(...arguments);
		} catch (e) {
			L("WebGLState:", e);
		}
	}
	function Ae() {
		try {
			e.texStorage2D(...arguments);
		} catch (e) {
			L("WebGLState:", e);
		}
	}
	function je() {
		try {
			e.texStorage3D(...arguments);
		} catch (e) {
			L("WebGLState:", e);
		}
	}
	function Me() {
		try {
			e.texImage2D(...arguments);
		} catch (e) {
			L("WebGLState:", e);
		}
	}
	function Ne() {
		try {
			e.texImage3D(...arguments);
		} catch (e) {
			L("WebGLState:", e);
		}
	}
	function Pe(t) {
		return d[t] === void 0 ? e.getParameter(t) : d[t];
	}
	function Fe(t, n) {
		d[t] !== n && (e.pixelStorei(t, n), d[t] = n);
	}
	function Ie(t) {
		ie.equals(t) === !1 && (e.scissor(t.x, t.y, t.z, t.w), ie.copy(t));
	}
	function z(t) {
		ae.equals(t) === !1 && (e.viewport(t.x, t.y, t.z, t.w), ae.copy(t));
	}
	function Le(t, n) {
		let r = l.get(n);
		r === void 0 && (r = /* @__PURE__ */ new WeakMap(), l.set(n, r));
		let i = r.get(t);
		i === void 0 && (i = e.getUniformBlockIndex(n, t.name), r.set(t, i));
	}
	function Re(t, n) {
		let r = l.get(n).get(t);
		c.get(n) !== r && (e.uniformBlockBinding(n, r, t.__bindingPointIndex), c.set(n, r));
	}
	function B() {
		e.disable(e.BLEND), e.disable(e.CULL_FACE), e.disable(e.DEPTH_TEST), e.disable(e.POLYGON_OFFSET_FILL), e.disable(e.SCISSOR_TEST), e.disable(e.STENCIL_TEST), e.disable(e.SAMPLE_ALPHA_TO_COVERAGE), e.blendEquation(e.FUNC_ADD), e.blendFunc(e.ONE, e.ZERO), e.blendFuncSeparate(e.ONE, e.ZERO, e.ONE, e.ZERO), e.blendColor(0, 0, 0, 0), e.colorMask(!0, !0, !0, !0), e.clearColor(0, 0, 0, 0), e.depthMask(!0), e.depthFunc(e.LESS), o.setReversed(!1), e.clearDepth(1), e.stencilMask(4294967295), e.stencilFunc(e.ALWAYS, 0, 4294967295), e.stencilOp(e.KEEP, e.KEEP, e.KEEP), e.clearStencil(0), e.cullFace(e.BACK), e.frontFace(e.CCW), e.polygonOffset(0, 0), e.activeTexture(e.TEXTURE0), e.bindFramebuffer(e.FRAMEBUFFER, null), e.bindFramebuffer(e.DRAW_FRAMEBUFFER, null), e.bindFramebuffer(e.READ_FRAMEBUFFER, null), e.useProgram(null), e.lineWidth(1), e.scissor(0, 0, e.canvas.width, e.canvas.height), e.viewport(0, 0, e.canvas.width, e.canvas.height), e.pixelStorei(e.PACK_ALIGNMENT, 4), e.pixelStorei(e.UNPACK_ALIGNMENT, 4), e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL, !1), e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1), e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL, e.BROWSER_DEFAULT_WEBGL), e.pixelStorei(e.PACK_ROW_LENGTH, 0), e.pixelStorei(e.PACK_SKIP_PIXELS, 0), e.pixelStorei(e.PACK_SKIP_ROWS, 0), e.pixelStorei(e.UNPACK_ROW_LENGTH, 0), e.pixelStorei(e.UNPACK_IMAGE_HEIGHT, 0), e.pixelStorei(e.UNPACK_SKIP_PIXELS, 0), e.pixelStorei(e.UNPACK_SKIP_ROWS, 0), e.pixelStorei(e.UNPACK_SKIP_IMAGES, 0), u = {}, d = {}, ne = null, P = {}, f = {}, p = /* @__PURE__ */ new WeakMap(), m = [], h = null, g = !1, _ = null, v = null, y = null, b = null, x = null, S = null, C = null, w = new J(0, 0, 0), T = 0, E = !1, D = null, O = null, ee = null, k = null, A = null, ie.set(0, 0, e.canvas.width, e.canvas.height), ae.set(0, 0, e.canvas.width, e.canvas.height), a.reset(), o.reset(), s.reset();
	}
	return {
		buffers: {
			color: a,
			depth: o,
			stencil: s
		},
		enable: ce,
		disable: le,
		bindFramebuffer: ue,
		drawBuffers: de,
		useProgram: I,
		setBlending: he,
		setMaterial: ge,
		setFlipSided: _e,
		setCullFace: ve,
		setLineWidth: ye,
		setPolygonOffset: be,
		setScissorTest: R,
		activeTexture: xe,
		bindTexture: Se,
		unbindTexture: Ce,
		compressedTexImage2D: we,
		compressedTexImage3D: Te,
		texImage2D: Me,
		texImage3D: Ne,
		pixelStorei: Fe,
		getParameter: Pe,
		updateUBOMapping: Le,
		uniformBlockBinding: Re,
		texStorage2D: Ae,
		texStorage3D: je,
		texSubImage2D: Ee,
		texSubImage3D: De,
		compressedTexSubImage2D: Oe,
		compressedTexSubImage3D: ke,
		scissor: Ie,
		viewport: z,
		reset: B
	};
}
function fl(l, u, d, f, p, m, h) {
	let g = u.has("WEBGL_multisampled_render_to_texture") ? u.get("WEBGL_multisampled_render_to_texture") : null, _ = typeof navigator > "u" ? !1 : /OculusBrowser/g.test(navigator.userAgent), v = new H(), b = /* @__PURE__ */ new WeakMap(), x = /* @__PURE__ */ new Set(), S, C = /* @__PURE__ */ new WeakMap(), w = !1;
	try {
		w = typeof OffscreenCanvas < "u" && new OffscreenCanvas(1, 1).getContext("2d") !== null;
	} catch {}
	function T(e, t) {
		return w ? new OffscreenCanvas(e, t) : se("canvas");
	}
	function E(e, t, n) {
		let r = 1, i = Ie(e);
		if ((i.width > n || i.height > n) && (r = n / Math.max(i.width, i.height)), r < 1) {
			if (typeof HTMLImageElement < "u" && e instanceof HTMLImageElement || typeof HTMLCanvasElement < "u" && e instanceof HTMLCanvasElement || typeof ImageBitmap < "u" && e instanceof ImageBitmap || typeof VideoFrame < "u" && e instanceof VideoFrame) {
				let n = Math.floor(r * i.width), a = Math.floor(r * i.height);
				S === void 0 && (S = T(n, a));
				let o = t ? T(n, a) : S;
				return o.width = n, o.height = a, o.getContext("2d").drawImage(e, 0, 0, n, a), I("WebGLRenderer: Texture has been resized from (" + i.width + "x" + i.height + ") to (" + n + "x" + a + ")."), o;
			}
			return "data" in e && I("WebGLRenderer: Image in DataTexture is too big (" + i.width + "x" + i.height + ")."), e;
		}
		return e;
	}
	function D(e) {
		return e.generateMipmaps;
	}
	function O(e) {
		l.generateMipmap(e);
	}
	function ee(e) {
		return e.isWebGLCubeRenderTarget ? l.TEXTURE_CUBE_MAP : e.isWebGL3DRenderTarget ? l.TEXTURE_3D : e.isWebGLArrayRenderTarget || e.isCompressedArrayTexture ? l.TEXTURE_2D_ARRAY : l.TEXTURE_2D;
	}
	function k(e, t, n, r, i, a = !1) {
		if (e !== null) {
			if (l[e] !== void 0) return l[e];
			I("WebGLRenderer: Attempt to use non-existing WebGL internal format '" + e + "'");
		}
		let o;
		r && (o = u.get("EXT_texture_norm16"), o || I("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));
		let s = t;
		if (t === l.RED && (n === l.FLOAT && (s = l.R32F), n === l.HALF_FLOAT && (s = l.R16F), n === l.UNSIGNED_BYTE && (s = l.R8), n === l.UNSIGNED_SHORT && o && (s = o.R16_EXT), n === l.SHORT && o && (s = o.R16_SNORM_EXT)), t === l.RED_INTEGER && (n === l.UNSIGNED_BYTE && (s = l.R8UI), n === l.UNSIGNED_SHORT && (s = l.R16UI), n === l.UNSIGNED_INT && (s = l.R32UI), n === l.BYTE && (s = l.R8I), n === l.SHORT && (s = l.R16I), n === l.INT && (s = l.R32I)), t === l.RG && (n === l.FLOAT && (s = l.RG32F), n === l.HALF_FLOAT && (s = l.RG16F), n === l.UNSIGNED_BYTE && (s = l.RG8), n === l.UNSIGNED_SHORT && o && (s = o.RG16_EXT), n === l.SHORT && o && (s = o.RG16_SNORM_EXT)), t === l.RG_INTEGER && (n === l.UNSIGNED_BYTE && (s = l.RG8UI), n === l.UNSIGNED_SHORT && (s = l.RG16UI), n === l.UNSIGNED_INT && (s = l.RG32UI), n === l.BYTE && (s = l.RG8I), n === l.SHORT && (s = l.RG16I), n === l.INT && (s = l.RG32I)), t === l.RGB_INTEGER && (n === l.UNSIGNED_BYTE && (s = l.RGB8UI), n === l.UNSIGNED_SHORT && (s = l.RGB16UI), n === l.UNSIGNED_INT && (s = l.RGB32UI), n === l.BYTE && (s = l.RGB8I), n === l.SHORT && (s = l.RGB16I), n === l.INT && (s = l.RGB32I)), t === l.RGBA_INTEGER && (n === l.UNSIGNED_BYTE && (s = l.RGBA8UI), n === l.UNSIGNED_SHORT && (s = l.RGBA16UI), n === l.UNSIGNED_INT && (s = l.RGBA32UI), n === l.BYTE && (s = l.RGBA8I), n === l.SHORT && (s = l.RGBA16I), n === l.INT && (s = l.RGBA32I)), t === l.RGB && (n === l.UNSIGNED_SHORT && o && (s = o.RGB16_EXT), n === l.SHORT && o && (s = o.RGB16_SNORM_EXT), n === l.UNSIGNED_INT_5_9_9_9_REV && (s = l.RGB9_E5), n === l.UNSIGNED_INT_10F_11F_11F_REV && (s = l.R11F_G11F_B10F)), t === l.RGBA) {
			let e = a ? ne : K.getTransfer(i);
			n === l.FLOAT && (s = l.RGBA32F), n === l.HALF_FLOAT && (s = l.RGBA16F), n === l.UNSIGNED_BYTE && (s = e === "srgb" ? l.SRGB8_ALPHA8 : l.RGBA8), n === l.UNSIGNED_SHORT && o && (s = o.RGBA16_EXT), n === l.SHORT && o && (s = o.RGBA16_SNORM_EXT), n === l.UNSIGNED_SHORT_4_4_4_4 && (s = l.RGBA4), n === l.UNSIGNED_SHORT_5_5_5_1 && (s = l.RGB5_A1);
		}
		return (s === l.R16F || s === l.R32F || s === l.RG16F || s === l.RG32F || s === l.RGBA16F || s === l.RGBA32F) && u.get("EXT_color_buffer_float"), s;
	}
	function A(e, t) {
		let n;
		return e ? t === null || t === 1014 || t === 1020 ? n = l.DEPTH24_STENCIL8 : t === 1015 ? n = l.DEPTH32F_STENCIL8 : t === 1012 && (n = l.DEPTH24_STENCIL8, I("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")) : t === null || t === 1014 || t === 1020 ? n = l.DEPTH_COMPONENT24 : t === 1015 ? n = l.DEPTH_COMPONENT32F : t === 1012 && (n = l.DEPTH_COMPONENT16), n;
	}
	function j(e, t) {
		return D(e) === !0 || e.isFramebufferTexture && e.minFilter !== 1003 && e.minFilter !== 1006 ? Math.log2(Math.max(t.width, t.height)) + 1 : e.mipmaps !== void 0 && e.mipmaps.length > 0 ? e.mipmaps.length : e.isCompressedTexture && Array.isArray(e.image) ? t.mipmaps.length : 1;
	}
	function te(e) {
		let t = e.target;
		t.removeEventListener("dispose", te), N(t), t.isVideoTexture && b.delete(t), t.isHTMLTexture && x.delete(t);
	}
	function M(e) {
		let t = e.target;
		t.removeEventListener("dispose", M), re(t);
	}
	function N(e) {
		let t = f.get(e);
		if (t.__webglInit === void 0) return;
		let n = e.source, r = C.get(n);
		if (r) {
			let i = r[t.__cacheKey];
			i.usedTimes--, i.usedTimes === 0 && P(e), Object.keys(r).length === 0 && C.delete(n);
		}
		f.remove(e);
	}
	function P(e) {
		let t = f.get(e);
		l.deleteTexture(t.__webglTexture);
		let n = e.source, r = C.get(n);
		delete r[t.__cacheKey], h.memory.textures--;
	}
	function re(e) {
		let t = f.get(e);
		if (e.depthTexture && (e.depthTexture.dispose(), f.remove(e.depthTexture)), e.isWebGLCubeRenderTarget) for (let e = 0; e < 6; e++) {
			if (Array.isArray(t.__webglFramebuffer[e])) for (let n = 0; n < t.__webglFramebuffer[e].length; n++) l.deleteFramebuffer(t.__webglFramebuffer[e][n]);
			else l.deleteFramebuffer(t.__webglFramebuffer[e]);
			t.__webglDepthbuffer && l.deleteRenderbuffer(t.__webglDepthbuffer[e]);
		}
		else {
			if (Array.isArray(t.__webglFramebuffer)) for (let e = 0; e < t.__webglFramebuffer.length; e++) l.deleteFramebuffer(t.__webglFramebuffer[e]);
			else l.deleteFramebuffer(t.__webglFramebuffer);
			if (t.__webglDepthbuffer && l.deleteRenderbuffer(t.__webglDepthbuffer), t.__webglMultisampledFramebuffer && l.deleteFramebuffer(t.__webglMultisampledFramebuffer), t.__webglColorRenderbuffer) for (let e = 0; e < t.__webglColorRenderbuffer.length; e++) t.__webglColorRenderbuffer[e] && l.deleteRenderbuffer(t.__webglColorRenderbuffer[e]);
			t.__webglDepthRenderbuffer && l.deleteRenderbuffer(t.__webglDepthRenderbuffer);
		}
		let n = e.textures;
		for (let e = 0, t = n.length; e < t; e++) {
			let t = f.get(n[e]);
			t.__webglTexture && (l.deleteTexture(t.__webglTexture), h.memory.textures--), f.remove(n[e]);
		}
		f.remove(e);
	}
	let F = 0;
	function ie() {
		F = 0;
	}
	function ae() {
		return F;
	}
	function oe(e) {
		F = e;
	}
	function ce() {
		let e = F;
		return e >= p.maxTextures && I("WebGLTextures: Trying to use " + (e + 1) + " texture units while this GPU supports only " + p.maxTextures), F += 1, e;
	}
	function le(e) {
		let t = [];
		return t.push(e.wrapS), t.push(e.wrapT), t.push(e.wrapR || 0), t.push(e.magFilter), t.push(e.minFilter), t.push(e.anisotropy), t.push(e.internalFormat), t.push(e.format), t.push(e.type), t.push(e.generateMipmaps), t.push(e.premultiplyAlpha), t.push(e.flipY), t.push(e.unpackAlignment), t.push(e.colorSpace), t.join();
	}
	function ue(e, t) {
		let n = f.get(e);
		if (e.isVideoTexture && Pe(e), e.isRenderTargetTexture === !1 && e.isExternalTexture !== !0 && e.version > 0 && n.__version !== e.version) {
			let r = e.image;
			if (r === null) I("WebGLRenderer: Texture marked for update but no image data found.");
			else if (r.complete === !1) I("WebGLRenderer: Texture marked for update but image is incomplete");
			else {
				R(n, e, t);
				return;
			}
		} else e.isExternalTexture && (n.__webglTexture = e.sourceTexture ? e.sourceTexture : null);
		d.bindTexture(l.TEXTURE_2D, n.__webglTexture, l.TEXTURE0 + t);
	}
	function de(e, t) {
		let n = f.get(e);
		e.isRenderTargetTexture === !1 && e.version > 0 && n.__version !== e.version ? R(n, e, t) : (e.isExternalTexture && (n.__webglTexture = e.sourceTexture ? e.sourceTexture : null), d.bindTexture(l.TEXTURE_2D_ARRAY, n.__webglTexture, l.TEXTURE0 + t));
	}
	function fe(e, t) {
		let n = f.get(e);
		e.isRenderTargetTexture === !1 && e.version > 0 && n.__version !== e.version ? R(n, e, t) : d.bindTexture(l.TEXTURE_3D, n.__webglTexture, l.TEXTURE0 + t);
	}
	function pe(e, t) {
		let n = f.get(e);
		e.isCubeDepthTexture !== !0 && e.version > 0 && n.__version !== e.version ? xe(n, e, t) : d.bindTexture(l.TEXTURE_CUBE_MAP, n.__webglTexture, l.TEXTURE0 + t);
	}
	let me = {
		[e]: l.REPEAT,
		[t]: l.CLAMP_TO_EDGE,
		[n]: l.MIRRORED_REPEAT
	}, he = {
		[r]: l.NEAREST,
		[i]: l.NEAREST_MIPMAP_NEAREST,
		[a]: l.NEAREST_MIPMAP_LINEAR,
		[o]: l.LINEAR,
		[s]: l.LINEAR_MIPMAP_NEAREST,
		[c]: l.LINEAR_MIPMAP_LINEAR
	}, ge = {
		512: l.NEVER,
		519: l.ALWAYS,
		513: l.LESS,
		515: l.LEQUAL,
		514: l.EQUAL,
		518: l.GEQUAL,
		516: l.GREATER,
		517: l.NOTEQUAL
	};
	function _e(e, t) {
		if (t.type === 1015 && u.has("OES_texture_float_linear") === !1 && (t.magFilter === 1006 || t.magFilter === 1007 || t.magFilter === 1005 || t.magFilter === 1008 || t.minFilter === 1006 || t.minFilter === 1007 || t.minFilter === 1005 || t.minFilter === 1008) && I("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."), l.texParameteri(e, l.TEXTURE_WRAP_S, me[t.wrapS]), l.texParameteri(e, l.TEXTURE_WRAP_T, me[t.wrapT]), (e === l.TEXTURE_3D || e === l.TEXTURE_2D_ARRAY) && l.texParameteri(e, l.TEXTURE_WRAP_R, me[t.wrapR]), l.texParameteri(e, l.TEXTURE_MAG_FILTER, he[t.magFilter]), l.texParameteri(e, l.TEXTURE_MIN_FILTER, he[t.minFilter]), t.compareFunction && (l.texParameteri(e, l.TEXTURE_COMPARE_MODE, l.COMPARE_REF_TO_TEXTURE), l.texParameteri(e, l.TEXTURE_COMPARE_FUNC, ge[t.compareFunction])), u.has("EXT_texture_filter_anisotropic") === !0) {
			if (t.magFilter === 1003 || t.minFilter !== 1005 && t.minFilter !== 1008 || t.type === 1015 && u.has("OES_texture_float_linear") === !1) return;
			if (t.anisotropy > 1 || f.get(t).__currentAnisotropy) {
				let n = u.get("EXT_texture_filter_anisotropic");
				l.texParameterf(e, n.TEXTURE_MAX_ANISOTROPY_EXT, Math.min(t.anisotropy, p.getMaxAnisotropy())), f.get(t).__currentAnisotropy = t.anisotropy;
			}
		}
	}
	function ve(e, t) {
		let n = !1;
		e.__webglInit === void 0 && (e.__webglInit = !0, t.addEventListener("dispose", te));
		let r = t.source, i = C.get(r);
		i === void 0 && (i = {}, C.set(r, i));
		let a = le(t);
		if (a !== e.__cacheKey) {
			i[a] === void 0 && (i[a] = {
				texture: l.createTexture(),
				usedTimes: 0
			}, h.memory.textures++, n = !0), i[a].usedTimes++;
			let r = i[e.__cacheKey];
			r !== void 0 && (i[e.__cacheKey].usedTimes--, r.usedTimes === 0 && P(t)), e.__cacheKey = a, e.__webglTexture = i[a].texture;
		}
		return n;
	}
	function ye(e, t, n) {
		return Math.floor(Math.floor(e / n) / t);
	}
	function be(e, t, n, r) {
		let i = e.updateRanges;
		if (i.length === 0) d.texSubImage2D(l.TEXTURE_2D, 0, 0, 0, t.width, t.height, n, r, t.data);
		else {
			i.sort((e, t) => e.start - t.start);
			let a = 0;
			for (let e = 1; e < i.length; e++) {
				let n = i[a], r = i[e], o = n.start + n.count, s = ye(r.start, t.width, 4), c = ye(n.start, t.width, 4);
				r.start <= o + 1 && s === c && ye(r.start + r.count - 1, t.width, 4) === s ? n.count = Math.max(n.count, r.start + r.count - n.start) : (++a, i[a] = r);
			}
			i.length = a + 1;
			let o = d.getParameter(l.UNPACK_ROW_LENGTH), s = d.getParameter(l.UNPACK_SKIP_PIXELS), c = d.getParameter(l.UNPACK_SKIP_ROWS);
			d.pixelStorei(l.UNPACK_ROW_LENGTH, t.width);
			for (let e = 0, a = i.length; e < a; e++) {
				let a = i[e], o = Math.floor(a.start / 4), s = Math.ceil(a.count / 4), c = o % t.width, u = Math.floor(o / t.width), f = s;
				d.pixelStorei(l.UNPACK_SKIP_PIXELS, c), d.pixelStorei(l.UNPACK_SKIP_ROWS, u), d.texSubImage2D(l.TEXTURE_2D, 0, c, u, f, 1, n, r, t.data);
			}
			e.clearUpdateRanges(), d.pixelStorei(l.UNPACK_ROW_LENGTH, o), d.pixelStorei(l.UNPACK_SKIP_PIXELS, s), d.pixelStorei(l.UNPACK_SKIP_ROWS, c);
		}
	}
	function R(e, t, n) {
		let r = l.TEXTURE_2D;
		(t.isDataArrayTexture || t.isCompressedArrayTexture) && (r = l.TEXTURE_2D_ARRAY), t.isData3DTexture && (r = l.TEXTURE_3D);
		let i = ve(e, t), a = t.source;
		d.bindTexture(r, e.__webglTexture, l.TEXTURE0 + n);
		let o = f.get(a);
		if (a.version !== o.__version || i === !0) {
			if (d.activeTexture(l.TEXTURE0 + n), !(typeof ImageBitmap < "u" && t.image instanceof ImageBitmap)) {
				let e = K.getPrimaries(K.workingColorSpace), n = t.colorSpace === "" ? null : K.getPrimaries(t.colorSpace), r = t.colorSpace === "" || e === n ? l.NONE : l.BROWSER_DEFAULT_WEBGL;
				d.pixelStorei(l.UNPACK_FLIP_Y_WEBGL, t.flipY), d.pixelStorei(l.UNPACK_PREMULTIPLY_ALPHA_WEBGL, t.premultiplyAlpha), d.pixelStorei(l.UNPACK_COLORSPACE_CONVERSION_WEBGL, r);
			}
			d.pixelStorei(l.UNPACK_ALIGNMENT, t.unpackAlignment);
			let e = E(t.image, !1, p.maxTextureSize);
			e = Fe(t, e);
			let s = m.convert(t.format, t.colorSpace), c = m.convert(t.type), u = k(t.internalFormat, s, c, t.normalized, t.colorSpace, t.isVideoTexture);
			_e(r, t);
			let f, h = t.mipmaps, g = t.isVideoTexture !== !0, _ = o.__version === void 0 || i === !0, v = a.dataReady, b = j(t, e);
			if (t.isDepthTexture) u = A(t.format === y, t.type), _ && (g ? d.texStorage2D(l.TEXTURE_2D, 1, u, e.width, e.height) : d.texImage2D(l.TEXTURE_2D, 0, u, e.width, e.height, 0, s, c, null));
			else if (t.isDataTexture) {
				if (h.length > 0) {
					g && _ && d.texStorage2D(l.TEXTURE_2D, b, u, h[0].width, h[0].height);
					for (let e = 0, t = h.length; e < t; e++) f = h[e], g ? v && d.texSubImage2D(l.TEXTURE_2D, e, 0, 0, f.width, f.height, s, c, f.data) : d.texImage2D(l.TEXTURE_2D, e, u, f.width, f.height, 0, s, c, f.data);
					t.generateMipmaps = !1;
				} else g ? (_ && d.texStorage2D(l.TEXTURE_2D, b, u, e.width, e.height), v && be(t, e, s, c)) : d.texImage2D(l.TEXTURE_2D, 0, u, e.width, e.height, 0, s, c, e.data);
			} else if (t.isCompressedTexture) {
				if (t.isCompressedArrayTexture) {
					g && _ && d.texStorage3D(l.TEXTURE_2D_ARRAY, b, u, h[0].width, h[0].height, e.depth);
					for (let n = 0, r = h.length; n < r; n++) if (f = h[n], t.format !== 1023) {
						if (s !== null) {
							if (g) {
								if (v) {
									if (t.layerUpdates.size > 0) {
										let e = oo(f.width, f.height, t.format, t.type);
										for (let r of t.layerUpdates) {
											let t = f.data.subarray(r * e / f.data.BYTES_PER_ELEMENT, (r + 1) * e / f.data.BYTES_PER_ELEMENT);
											d.compressedTexSubImage3D(l.TEXTURE_2D_ARRAY, n, 0, 0, r, f.width, f.height, 1, s, t);
										}
									} else d.compressedTexSubImage3D(l.TEXTURE_2D_ARRAY, n, 0, 0, 0, f.width, f.height, e.depth, s, f.data);
								}
							} else d.compressedTexImage3D(l.TEXTURE_2D_ARRAY, n, u, f.width, f.height, e.depth, 0, f.data, 0, 0);
						} else I("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");
					} else g ? v && d.texSubImage3D(l.TEXTURE_2D_ARRAY, n, 0, 0, 0, f.width, f.height, e.depth, s, c, f.data) : d.texImage3D(l.TEXTURE_2D_ARRAY, n, u, f.width, f.height, e.depth, 0, s, c, f.data);
					t.layerUpdates.size > 0 && t.clearLayerUpdates();
				} else {
					g && _ && d.texStorage2D(l.TEXTURE_2D, b, u, h[0].width, h[0].height);
					for (let e = 0, n = h.length; e < n; e++) f = h[e], t.format === 1023 ? g ? v && d.texSubImage2D(l.TEXTURE_2D, e, 0, 0, f.width, f.height, s, c, f.data) : d.texImage2D(l.TEXTURE_2D, e, u, f.width, f.height, 0, s, c, f.data) : s === null ? I("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()") : g ? v && d.compressedTexSubImage2D(l.TEXTURE_2D, e, 0, 0, f.width, f.height, s, f.data) : d.compressedTexImage2D(l.TEXTURE_2D, e, u, f.width, f.height, 0, f.data);
				}
			} else if (t.isDataArrayTexture) {
				if (g) {
					if (_ && d.texStorage3D(l.TEXTURE_2D_ARRAY, b, u, e.width, e.height, e.depth), v) {
						if (t.layerUpdates.size > 0) {
							let n = oo(e.width, e.height, t.format, t.type);
							for (let r of t.layerUpdates) {
								let t = e.data.subarray(r * n / e.data.BYTES_PER_ELEMENT, (r + 1) * n / e.data.BYTES_PER_ELEMENT);
								d.texSubImage3D(l.TEXTURE_2D_ARRAY, 0, 0, 0, r, e.width, e.height, 1, s, c, t);
							}
							t.clearLayerUpdates();
						} else d.texSubImage3D(l.TEXTURE_2D_ARRAY, 0, 0, 0, 0, e.width, e.height, e.depth, s, c, e.data);
					}
				} else d.texImage3D(l.TEXTURE_2D_ARRAY, 0, u, e.width, e.height, e.depth, 0, s, c, e.data);
			} else if (t.isData3DTexture) g ? (_ && d.texStorage3D(l.TEXTURE_3D, b, u, e.width, e.height, e.depth), v && d.texSubImage3D(l.TEXTURE_3D, 0, 0, 0, 0, e.width, e.height, e.depth, s, c, e.data)) : d.texImage3D(l.TEXTURE_3D, 0, u, e.width, e.height, e.depth, 0, s, c, e.data);
			else if (t.isFramebufferTexture) {
				if (_) {
					if (g) d.texStorage2D(l.TEXTURE_2D, b, u, e.width, e.height);
					else {
						let t = e.width, n = e.height;
						for (let e = 0; e < b; e++) d.texImage2D(l.TEXTURE_2D, e, u, t, n, 0, s, c, null), t >>= 1, n >>= 1;
					}
				}
			} else if (t.isHTMLTexture) {
				if ("texElementImage2D" in l) {
					let n = l.canvas;
					if (n.hasAttribute("layoutsubtree") || n.setAttribute("layoutsubtree", "true"), e.parentNode !== n) {
						n.appendChild(e), x.add(t), n.onpaint = (e) => {
							let t = e.changedElements;
							for (let e of x) t.includes(e.image) && (e.needsUpdate = !0);
						}, n.requestPaint();
						return;
					}
					if (l.texElementImage2D.length === 3) l.texElementImage2D(l.TEXTURE_2D, l.RGBA8, e);
					else {
						let t = l.RGBA, n = l.RGBA, r = l.UNSIGNED_BYTE;
						l.texElementImage2D(l.TEXTURE_2D, 0, t, n, r, e);
					}
					l.texParameteri(l.TEXTURE_2D, l.TEXTURE_MIN_FILTER, l.LINEAR), l.texParameteri(l.TEXTURE_2D, l.TEXTURE_WRAP_S, l.CLAMP_TO_EDGE), l.texParameteri(l.TEXTURE_2D, l.TEXTURE_WRAP_T, l.CLAMP_TO_EDGE);
				}
			} else if (h.length > 0) {
				if (g && _) {
					let e = Ie(h[0]);
					d.texStorage2D(l.TEXTURE_2D, b, u, e.width, e.height);
				}
				for (let e = 0, t = h.length; e < t; e++) f = h[e], g ? v && d.texSubImage2D(l.TEXTURE_2D, e, 0, 0, s, c, f) : d.texImage2D(l.TEXTURE_2D, e, u, s, c, f);
				t.generateMipmaps = !1;
			} else if (g) {
				if (_) {
					let t = Ie(e);
					d.texStorage2D(l.TEXTURE_2D, b, u, t.width, t.height);
				}
				v && d.texSubImage2D(l.TEXTURE_2D, 0, 0, 0, s, c, e);
			} else d.texImage2D(l.TEXTURE_2D, 0, u, s, c, e);
			D(t) && O(r), o.__version = a.version, t.onUpdate && t.onUpdate(t);
		}
		e.__version = t.version;
	}
	function xe(e, t, n) {
		if (t.image.length !== 6) return;
		let r = ve(e, t), i = t.source;
		d.bindTexture(l.TEXTURE_CUBE_MAP, e.__webglTexture, l.TEXTURE0 + n);
		let a = f.get(i);
		if (i.version !== a.__version || r === !0) {
			d.activeTexture(l.TEXTURE0 + n);
			let e = K.getPrimaries(K.workingColorSpace), o = t.colorSpace === "" ? null : K.getPrimaries(t.colorSpace), s = t.colorSpace === "" || e === o ? l.NONE : l.BROWSER_DEFAULT_WEBGL;
			d.pixelStorei(l.UNPACK_FLIP_Y_WEBGL, t.flipY), d.pixelStorei(l.UNPACK_PREMULTIPLY_ALPHA_WEBGL, t.premultiplyAlpha), d.pixelStorei(l.UNPACK_ALIGNMENT, t.unpackAlignment), d.pixelStorei(l.UNPACK_COLORSPACE_CONVERSION_WEBGL, s);
			let c = t.isCompressedTexture || t.image[0].isCompressedTexture, u = t.image[0] && t.image[0].isDataTexture, f = [];
			for (let e = 0; e < 6; e++) !c && !u ? f[e] = E(t.image[e], !0, p.maxCubemapSize) : f[e] = u ? t.image[e].image : t.image[e], f[e] = Fe(t, f[e]);
			let h = f[0], g = m.convert(t.format, t.colorSpace), _ = m.convert(t.type), v = k(t.internalFormat, g, _, t.normalized, t.colorSpace), y = t.isVideoTexture !== !0, b = a.__version === void 0 || r === !0, x = i.dataReady, S = j(t, h);
			_e(l.TEXTURE_CUBE_MAP, t);
			let C;
			if (c) {
				y && b && d.texStorage2D(l.TEXTURE_CUBE_MAP, S, v, h.width, h.height);
				for (let e = 0; e < 6; e++) {
					C = f[e].mipmaps;
					for (let n = 0; n < C.length; n++) {
						let r = C[n];
						t.format === 1023 ? y ? x && d.texSubImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X + e, n, 0, 0, r.width, r.height, g, _, r.data) : d.texImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X + e, n, v, r.width, r.height, 0, g, _, r.data) : g === null ? I("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()") : y ? x && d.compressedTexSubImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X + e, n, 0, 0, r.width, r.height, g, r.data) : d.compressedTexImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X + e, n, v, r.width, r.height, 0, r.data);
					}
				}
			} else {
				if (C = t.mipmaps, y && b) {
					C.length > 0 && S++;
					let e = Ie(f[0]);
					d.texStorage2D(l.TEXTURE_CUBE_MAP, S, v, e.width, e.height);
				}
				for (let e = 0; e < 6; e++) if (u) {
					y ? x && d.texSubImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X + e, 0, 0, 0, f[e].width, f[e].height, g, _, f[e].data) : d.texImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X + e, 0, v, f[e].width, f[e].height, 0, g, _, f[e].data);
					for (let t = 0; t < C.length; t++) {
						let n = C[t].image[e].image;
						y ? x && d.texSubImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X + e, t + 1, 0, 0, n.width, n.height, g, _, n.data) : d.texImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X + e, t + 1, v, n.width, n.height, 0, g, _, n.data);
					}
				} else {
					y ? x && d.texSubImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X + e, 0, 0, 0, g, _, f[e]) : d.texImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X + e, 0, v, g, _, f[e]);
					for (let t = 0; t < C.length; t++) {
						let n = C[t];
						y ? x && d.texSubImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X + e, t + 1, 0, 0, g, _, n.image[e]) : d.texImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X + e, t + 1, v, g, _, n.image[e]);
					}
				}
			}
			D(t) && O(l.TEXTURE_CUBE_MAP), a.__version = i.version, t.onUpdate && t.onUpdate(t);
		}
		e.__version = t.version;
	}
	function Se(e, t, n, r, i, a) {
		let o = m.convert(n.format, n.colorSpace), s = m.convert(n.type), c = k(n.internalFormat, o, s, n.normalized, n.colorSpace), u = f.get(t), p = f.get(n);
		if (p.__renderTarget = t, !u.__hasExternalTextures) {
			let e = Math.max(1, t.width >> a), n = Math.max(1, t.height >> a);
			i === l.TEXTURE_3D || i === l.TEXTURE_2D_ARRAY ? d.texImage3D(i, a, c, e, n, t.depth, 0, o, s, null) : d.texImage2D(i, a, c, e, n, 0, o, s, null);
		}
		d.bindFramebuffer(l.FRAMEBUFFER, e), Ne(t) ? g.framebufferTexture2DMultisampleEXT(l.FRAMEBUFFER, r, i, p.__webglTexture, 0, Me(t)) : (i === l.TEXTURE_2D || i >= l.TEXTURE_CUBE_MAP_POSITIVE_X && i <= l.TEXTURE_CUBE_MAP_NEGATIVE_Z) && l.framebufferTexture2D(l.FRAMEBUFFER, r, i, p.__webglTexture, a), d.bindFramebuffer(l.FRAMEBUFFER, null);
	}
	function Ce(e, t, n) {
		if (l.bindRenderbuffer(l.RENDERBUFFER, e), t.depthBuffer) {
			let r = t.depthTexture, i = r && r.isDepthTexture ? r.type : null, a = A(t.stencilBuffer, i), o = t.stencilBuffer ? l.DEPTH_STENCIL_ATTACHMENT : l.DEPTH_ATTACHMENT;
			Ne(t) ? g.renderbufferStorageMultisampleEXT(l.RENDERBUFFER, Me(t), a, t.width, t.height) : n ? l.renderbufferStorageMultisample(l.RENDERBUFFER, Me(t), a, t.width, t.height) : l.renderbufferStorage(l.RENDERBUFFER, a, t.width, t.height), l.framebufferRenderbuffer(l.FRAMEBUFFER, o, l.RENDERBUFFER, e);
		} else {
			let e = t.textures;
			for (let r = 0; r < e.length; r++) {
				let i = e[r], a = m.convert(i.format, i.colorSpace), o = m.convert(i.type), s = k(i.internalFormat, a, o, i.normalized, i.colorSpace);
				Ne(t) ? g.renderbufferStorageMultisampleEXT(l.RENDERBUFFER, Me(t), s, t.width, t.height) : n ? l.renderbufferStorageMultisample(l.RENDERBUFFER, Me(t), s, t.width, t.height) : l.renderbufferStorage(l.RENDERBUFFER, s, t.width, t.height);
			}
		}
		l.bindRenderbuffer(l.RENDERBUFFER, null);
	}
	function we(e, t, n) {
		let r = t.isWebGLCubeRenderTarget === !0;
		if (d.bindFramebuffer(l.FRAMEBUFFER, e), !(t.depthTexture && t.depthTexture.isDepthTexture)) throw Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");
		let i = f.get(t.depthTexture);
		if (i.__renderTarget = t, (!i.__webglTexture || t.depthTexture.image.width !== t.width || t.depthTexture.image.height !== t.height) && (t.depthTexture.image.width = t.width, t.depthTexture.image.height = t.height, t.depthTexture.needsUpdate = !0), r) {
			if (i.__webglInit === void 0 && (i.__webglInit = !0, t.depthTexture.addEventListener("dispose", te)), i.__webglTexture === void 0) {
				i.__webglTexture = l.createTexture(), d.bindTexture(l.TEXTURE_CUBE_MAP, i.__webglTexture), _e(l.TEXTURE_CUBE_MAP, t.depthTexture);
				let e = m.convert(t.depthTexture.format), n = m.convert(t.depthTexture.type), r;
				t.depthTexture.format === 1026 ? r = l.DEPTH_COMPONENT24 : t.depthTexture.format === 1027 && (r = l.DEPTH24_STENCIL8);
				for (let i = 0; i < 6; i++) l.texImage2D(l.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, r, t.width, t.height, 0, e, n, null);
			}
		} else ue(t.depthTexture, 0);
		let a = i.__webglTexture, o = Me(t), s = r ? l.TEXTURE_CUBE_MAP_POSITIVE_X + n : l.TEXTURE_2D, c = t.depthTexture.format === 1027 ? l.DEPTH_STENCIL_ATTACHMENT : l.DEPTH_ATTACHMENT;
		if (t.depthTexture.format === 1026) Ne(t) ? g.framebufferTexture2DMultisampleEXT(l.FRAMEBUFFER, c, s, a, 0, o) : l.framebufferTexture2D(l.FRAMEBUFFER, c, s, a, 0);
		else if (t.depthTexture.format === 1027) Ne(t) ? g.framebufferTexture2DMultisampleEXT(l.FRAMEBUFFER, c, s, a, 0, o) : l.framebufferTexture2D(l.FRAMEBUFFER, c, s, a, 0);
		else throw Error("THREE.WebGLTextures: Unknown depthTexture format.");
	}
	function Te(e) {
		let t = f.get(e), n = e.isWebGLCubeRenderTarget === !0;
		if (t.__boundDepthTexture !== e.depthTexture) {
			let n = e.depthTexture;
			if (t.__depthDisposeCallback && t.__depthDisposeCallback(), n) {
				let e = () => {
					delete t.__boundDepthTexture, delete t.__depthDisposeCallback, n.removeEventListener("dispose", e);
				};
				n.addEventListener("dispose", e), t.__depthDisposeCallback = e;
			}
			t.__boundDepthTexture = n;
		}
		if (e.depthTexture && !t.__autoAllocateDepthBuffer) {
			if (n) for (let n = 0; n < 6; n++) we(t.__webglFramebuffer[n], e, n);
			else {
				let n = e.texture.mipmaps;
				n && n.length > 0 ? we(t.__webglFramebuffer[0], e, 0) : we(t.__webglFramebuffer, e, 0);
			}
		} else if (n) {
			t.__webglDepthbuffer = [];
			for (let n = 0; n < 6; n++) if (d.bindFramebuffer(l.FRAMEBUFFER, t.__webglFramebuffer[n]), t.__webglDepthbuffer[n] === void 0) t.__webglDepthbuffer[n] = l.createRenderbuffer(), Ce(t.__webglDepthbuffer[n], e, !1);
			else {
				let r = e.stencilBuffer ? l.DEPTH_STENCIL_ATTACHMENT : l.DEPTH_ATTACHMENT, i = t.__webglDepthbuffer[n];
				l.bindRenderbuffer(l.RENDERBUFFER, i), l.framebufferRenderbuffer(l.FRAMEBUFFER, r, l.RENDERBUFFER, i);
			}
		} else {
			let n = e.texture.mipmaps;
			if (n && n.length > 0 ? d.bindFramebuffer(l.FRAMEBUFFER, t.__webglFramebuffer[0]) : d.bindFramebuffer(l.FRAMEBUFFER, t.__webglFramebuffer), t.__webglDepthbuffer === void 0) t.__webglDepthbuffer = l.createRenderbuffer(), Ce(t.__webglDepthbuffer, e, !1);
			else {
				let n = e.stencilBuffer ? l.DEPTH_STENCIL_ATTACHMENT : l.DEPTH_ATTACHMENT, r = t.__webglDepthbuffer;
				l.bindRenderbuffer(l.RENDERBUFFER, r), l.framebufferRenderbuffer(l.FRAMEBUFFER, n, l.RENDERBUFFER, r);
			}
		}
		d.bindFramebuffer(l.FRAMEBUFFER, null);
	}
	function Ee(e, t, n) {
		let r = f.get(e);
		t !== void 0 && Se(r.__webglFramebuffer, e, e.texture, l.COLOR_ATTACHMENT0, l.TEXTURE_2D, 0), n !== void 0 && Te(e);
	}
	function De(e) {
		let t = e.texture, n = f.get(e), r = f.get(t);
		e.addEventListener("dispose", M);
		let i = e.textures, a = e.isWebGLCubeRenderTarget === !0, o = i.length > 1;
		if (o || (r.__webglTexture === void 0 && (r.__webglTexture = l.createTexture()), r.__version = t.version, h.memory.textures++), a) {
			n.__webglFramebuffer = [];
			for (let e = 0; e < 6; e++) if (t.mipmaps && t.mipmaps.length > 0) {
				n.__webglFramebuffer[e] = [];
				for (let r = 0; r < t.mipmaps.length; r++) n.__webglFramebuffer[e][r] = l.createFramebuffer();
			} else n.__webglFramebuffer[e] = l.createFramebuffer();
		} else {
			if (t.mipmaps && t.mipmaps.length > 0) {
				n.__webglFramebuffer = [];
				for (let e = 0; e < t.mipmaps.length; e++) n.__webglFramebuffer[e] = l.createFramebuffer();
			} else n.__webglFramebuffer = l.createFramebuffer();
			if (o) for (let e = 0, t = i.length; e < t; e++) {
				let t = f.get(i[e]);
				t.__webglTexture === void 0 && (t.__webglTexture = l.createTexture(), h.memory.textures++);
			}
			if (e.samples > 0 && Ne(e) === !1) {
				n.__webglMultisampledFramebuffer = l.createFramebuffer(), n.__webglColorRenderbuffer = [], d.bindFramebuffer(l.FRAMEBUFFER, n.__webglMultisampledFramebuffer);
				for (let t = 0; t < i.length; t++) {
					let r = i[t];
					n.__webglColorRenderbuffer[t] = l.createRenderbuffer(), l.bindRenderbuffer(l.RENDERBUFFER, n.__webglColorRenderbuffer[t]);
					let a = m.convert(r.format, r.colorSpace), o = m.convert(r.type), s = k(r.internalFormat, a, o, r.normalized, r.colorSpace, e.isXRRenderTarget === !0), c = Me(e);
					l.renderbufferStorageMultisample(l.RENDERBUFFER, c, s, e.width, e.height), l.framebufferRenderbuffer(l.FRAMEBUFFER, l.COLOR_ATTACHMENT0 + t, l.RENDERBUFFER, n.__webglColorRenderbuffer[t]);
				}
				l.bindRenderbuffer(l.RENDERBUFFER, null), e.depthBuffer && (n.__webglDepthRenderbuffer = l.createRenderbuffer(), Ce(n.__webglDepthRenderbuffer, e, !0)), d.bindFramebuffer(l.FRAMEBUFFER, null);
			}
		}
		if (a) {
			d.bindTexture(l.TEXTURE_CUBE_MAP, r.__webglTexture), _e(l.TEXTURE_CUBE_MAP, t);
			for (let r = 0; r < 6; r++) if (t.mipmaps && t.mipmaps.length > 0) for (let i = 0; i < t.mipmaps.length; i++) Se(n.__webglFramebuffer[r][i], e, t, l.COLOR_ATTACHMENT0, l.TEXTURE_CUBE_MAP_POSITIVE_X + r, i);
			else Se(n.__webglFramebuffer[r], e, t, l.COLOR_ATTACHMENT0, l.TEXTURE_CUBE_MAP_POSITIVE_X + r, 0);
			D(t) && O(l.TEXTURE_CUBE_MAP), d.unbindTexture();
		} else if (o) {
			for (let t = 0, r = i.length; t < r; t++) {
				let r = i[t], a = f.get(r), o = l.TEXTURE_2D;
				(e.isWebGL3DRenderTarget || e.isWebGLArrayRenderTarget) && (o = e.isWebGL3DRenderTarget ? l.TEXTURE_3D : l.TEXTURE_2D_ARRAY), d.bindTexture(o, a.__webglTexture), _e(o, r), Se(n.__webglFramebuffer, e, r, l.COLOR_ATTACHMENT0 + t, o, 0), D(r) && O(o);
			}
			d.unbindTexture();
		} else {
			let i = l.TEXTURE_2D;
			if ((e.isWebGL3DRenderTarget || e.isWebGLArrayRenderTarget) && (i = e.isWebGL3DRenderTarget ? l.TEXTURE_3D : l.TEXTURE_2D_ARRAY), d.bindTexture(i, r.__webglTexture), _e(i, t), t.mipmaps && t.mipmaps.length > 0) for (let r = 0; r < t.mipmaps.length; r++) Se(n.__webglFramebuffer[r], e, t, l.COLOR_ATTACHMENT0, i, r);
			else Se(n.__webglFramebuffer, e, t, l.COLOR_ATTACHMENT0, i, 0);
			D(t) && O(i), d.unbindTexture();
		}
		e.depthBuffer && Te(e);
	}
	function Oe(e) {
		let t = e.textures;
		for (let n = 0, r = t.length; n < r; n++) {
			let r = t[n];
			if (D(r)) {
				let t = ee(e), n = f.get(r).__webglTexture;
				d.bindTexture(t, n), O(t), d.unbindTexture();
			}
		}
	}
	let ke = [], Ae = [];
	function je(e) {
		if (e.samples > 0) {
			if (Ne(e) === !1) {
				let t = e.textures, n = e.width, r = e.height, i = l.COLOR_BUFFER_BIT, a = e.stencilBuffer ? l.DEPTH_STENCIL_ATTACHMENT : l.DEPTH_ATTACHMENT, o = f.get(e), s = t.length > 1;
				if (s) for (let e = 0; e < t.length; e++) d.bindFramebuffer(l.FRAMEBUFFER, o.__webglMultisampledFramebuffer), l.framebufferRenderbuffer(l.FRAMEBUFFER, l.COLOR_ATTACHMENT0 + e, l.RENDERBUFFER, null), d.bindFramebuffer(l.FRAMEBUFFER, o.__webglFramebuffer), l.framebufferTexture2D(l.DRAW_FRAMEBUFFER, l.COLOR_ATTACHMENT0 + e, l.TEXTURE_2D, null, 0);
				d.bindFramebuffer(l.READ_FRAMEBUFFER, o.__webglMultisampledFramebuffer);
				let c = e.texture.mipmaps;
				c && c.length > 0 ? d.bindFramebuffer(l.DRAW_FRAMEBUFFER, o.__webglFramebuffer[0]) : d.bindFramebuffer(l.DRAW_FRAMEBUFFER, o.__webglFramebuffer);
				for (let c = 0; c < t.length; c++) {
					if (e.resolveDepthBuffer && (e.depthBuffer && (i |= l.DEPTH_BUFFER_BIT), e.stencilBuffer && e.resolveStencilBuffer && (i |= l.STENCIL_BUFFER_BIT)), s) {
						l.framebufferRenderbuffer(l.READ_FRAMEBUFFER, l.COLOR_ATTACHMENT0, l.RENDERBUFFER, o.__webglColorRenderbuffer[c]);
						let e = f.get(t[c]).__webglTexture;
						l.framebufferTexture2D(l.DRAW_FRAMEBUFFER, l.COLOR_ATTACHMENT0, l.TEXTURE_2D, e, 0);
					}
					l.blitFramebuffer(0, 0, n, r, 0, 0, n, r, i, l.NEAREST), _ === !0 && (ke.length = 0, Ae.length = 0, ke.push(l.COLOR_ATTACHMENT0 + c), e.depthBuffer && e.storeMultisampledDepthBuffer === !1 && (ke.push(a), Ae.push(a), l.invalidateFramebuffer(l.DRAW_FRAMEBUFFER, Ae)), l.invalidateFramebuffer(l.READ_FRAMEBUFFER, ke));
				}
				if (d.bindFramebuffer(l.READ_FRAMEBUFFER, null), d.bindFramebuffer(l.DRAW_FRAMEBUFFER, null), s) for (let e = 0; e < t.length; e++) {
					d.bindFramebuffer(l.FRAMEBUFFER, o.__webglMultisampledFramebuffer), l.framebufferRenderbuffer(l.FRAMEBUFFER, l.COLOR_ATTACHMENT0 + e, l.RENDERBUFFER, o.__webglColorRenderbuffer[e]);
					let n = f.get(t[e]).__webglTexture;
					d.bindFramebuffer(l.FRAMEBUFFER, o.__webglFramebuffer), l.framebufferTexture2D(l.DRAW_FRAMEBUFFER, l.COLOR_ATTACHMENT0 + e, l.TEXTURE_2D, n, 0);
				}
				d.bindFramebuffer(l.DRAW_FRAMEBUFFER, o.__webglMultisampledFramebuffer);
			} else if (e.depthBuffer && e.storeMultisampledDepthBuffer === !1 && _) {
				let t = e.stencilBuffer ? l.DEPTH_STENCIL_ATTACHMENT : l.DEPTH_ATTACHMENT;
				l.invalidateFramebuffer(l.DRAW_FRAMEBUFFER, [t]);
			}
		}
	}
	function Me(e) {
		return Math.min(p.maxSamples, e.samples);
	}
	function Ne(e) {
		let t = f.get(e);
		return e.samples > 0 && u.has("WEBGL_multisampled_render_to_texture") === !0 && t.__useRenderToTexture !== !1;
	}
	function Pe(e) {
		let t = h.render.frame;
		b.get(e) !== t && (b.set(e, t), e.update());
	}
	function Fe(e, t) {
		let n = e.colorSpace, r = e.format, i = e.type;
		return e.isCompressedTexture === !0 || e.isVideoTexture === !0 || n !== "srgb-linear" && n !== "" && (K.getTransfer(n) === "srgb" ? (r !== 1023 || i !== 1009) && I("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.") : L("WebGLTextures: Unsupported texture color space:", n)), t;
	}
	function Ie(e) {
		return typeof HTMLImageElement < "u" && e instanceof HTMLImageElement ? (v.width = e.naturalWidth || e.width, v.height = e.naturalHeight || e.height) : typeof VideoFrame < "u" && e instanceof VideoFrame ? (v.width = e.displayWidth, v.height = e.displayHeight) : (v.width = e.width, v.height = e.height), v;
	}
	this.allocateTextureUnit = ce, this.resetTextureUnits = ie, this.getTextureUnits = ae, this.setTextureUnits = oe, this.setTexture2D = ue, this.setTexture2DArray = de, this.setTexture3D = fe, this.setTextureCube = pe, this.rebindTextures = Ee, this.setupRenderTarget = De, this.updateRenderTargetMipmap = Oe, this.updateMultisampleRenderTarget = je, this.setupDepthRenderbuffer = Te, this.setupFrameBufferTexture = Se, this.useMultisampledRTT = Ne, this.isReversedDepthBuffer = function() {
		return d.buffers.depth.getReversed();
	};
}
function pl(e, t) {
	function n(n, r = "") {
		let i, a = K.getTransfer(r);
		if (n === 1009) return e.UNSIGNED_BYTE;
		if (n === 1017) return e.UNSIGNED_SHORT_4_4_4_4;
		if (n === 1018) return e.UNSIGNED_SHORT_5_5_5_1;
		if (n === 35902) return e.UNSIGNED_INT_5_9_9_9_REV;
		if (n === 35899) return e.UNSIGNED_INT_10F_11F_11F_REV;
		if (n === 1010) return e.BYTE;
		if (n === 1011) return e.SHORT;
		if (n === 1012) return e.UNSIGNED_SHORT;
		if (n === 1013) return e.INT;
		if (n === 1014) return e.UNSIGNED_INT;
		if (n === 1015) return e.FLOAT;
		if (n === 1016) return e.HALF_FLOAT;
		if (n === 1021) return e.ALPHA;
		if (n === 1022) return e.RGB;
		if (n === 1023) return e.RGBA;
		if (n === 1026) return e.DEPTH_COMPONENT;
		if (n === 1027) return e.DEPTH_STENCIL;
		if (n === 1028) return e.RED;
		if (n === 1029) return e.RED_INTEGER;
		if (n === 1030) return e.RG;
		if (n === 1031) return e.RG_INTEGER;
		if (n === 1033) return e.RGBA_INTEGER;
		if (n === 33776 || n === 33777 || n === 33778 || n === 33779) {
			if (a === "srgb") {
				if (i = t.get("WEBGL_compressed_texture_s3tc_srgb"), i !== null) {
					if (n === 33776) return i.COMPRESSED_SRGB_S3TC_DXT1_EXT;
					if (n === 33777) return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;
					if (n === 33778) return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;
					if (n === 33779) return i.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT;
				} else return null;
			} else if (i = t.get("WEBGL_compressed_texture_s3tc"), i !== null) {
				if (n === 33776) return i.COMPRESSED_RGB_S3TC_DXT1_EXT;
				if (n === 33777) return i.COMPRESSED_RGBA_S3TC_DXT1_EXT;
				if (n === 33778) return i.COMPRESSED_RGBA_S3TC_DXT3_EXT;
				if (n === 33779) return i.COMPRESSED_RGBA_S3TC_DXT5_EXT;
			} else return null;
		}
		if (n === 35840 || n === 35841 || n === 35842 || n === 35843) {
			if (i = t.get("WEBGL_compressed_texture_pvrtc"), i !== null) {
				if (n === 35840) return i.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
				if (n === 35841) return i.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
				if (n === 35842) return i.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;
				if (n === 35843) return i.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG;
			} else return null;
		}
		if (n === 36196 || n === 37492 || n === 37496 || n === 37488 || n === 37489 || n === 37490 || n === 37491) {
			if (i = t.get("WEBGL_compressed_texture_etc"), i !== null) {
				if (n === 36196 || n === 37492) return a === "srgb" ? i.COMPRESSED_SRGB8_ETC2 : i.COMPRESSED_RGB8_ETC2;
				if (n === 37496) return a === "srgb" ? i.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC : i.COMPRESSED_RGBA8_ETC2_EAC;
				if (n === 37488) return i.COMPRESSED_R11_EAC;
				if (n === 37489) return i.COMPRESSED_SIGNED_R11_EAC;
				if (n === 37490) return i.COMPRESSED_RG11_EAC;
				if (n === 37491) return i.COMPRESSED_SIGNED_RG11_EAC;
			} else return null;
		}
		if (n === 37808 || n === 37809 || n === 37810 || n === 37811 || n === 37812 || n === 37813 || n === 37814 || n === 37815 || n === 37816 || n === 37817 || n === 37818 || n === 37819 || n === 37820 || n === 37821) {
			if (i = t.get("WEBGL_compressed_texture_astc"), i !== null) {
				if (n === 37808) return a === "srgb" ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR : i.COMPRESSED_RGBA_ASTC_4x4_KHR;
				if (n === 37809) return a === "srgb" ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR : i.COMPRESSED_RGBA_ASTC_5x4_KHR;
				if (n === 37810) return a === "srgb" ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR : i.COMPRESSED_RGBA_ASTC_5x5_KHR;
				if (n === 37811) return a === "srgb" ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR : i.COMPRESSED_RGBA_ASTC_6x5_KHR;
				if (n === 37812) return a === "srgb" ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR : i.COMPRESSED_RGBA_ASTC_6x6_KHR;
				if (n === 37813) return a === "srgb" ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR : i.COMPRESSED_RGBA_ASTC_8x5_KHR;
				if (n === 37814) return a === "srgb" ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR : i.COMPRESSED_RGBA_ASTC_8x6_KHR;
				if (n === 37815) return a === "srgb" ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR : i.COMPRESSED_RGBA_ASTC_8x8_KHR;
				if (n === 37816) return a === "srgb" ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR : i.COMPRESSED_RGBA_ASTC_10x5_KHR;
				if (n === 37817) return a === "srgb" ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR : i.COMPRESSED_RGBA_ASTC_10x6_KHR;
				if (n === 37818) return a === "srgb" ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR : i.COMPRESSED_RGBA_ASTC_10x8_KHR;
				if (n === 37819) return a === "srgb" ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR : i.COMPRESSED_RGBA_ASTC_10x10_KHR;
				if (n === 37820) return a === "srgb" ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR : i.COMPRESSED_RGBA_ASTC_12x10_KHR;
				if (n === 37821) return a === "srgb" ? i.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR : i.COMPRESSED_RGBA_ASTC_12x12_KHR;
			} else return null;
		}
		if (n === 36492 || n === 36494 || n === 36495) {
			if (i = t.get("EXT_texture_compression_bptc"), i !== null) {
				if (n === 36492) return a === "srgb" ? i.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT : i.COMPRESSED_RGBA_BPTC_UNORM_EXT;
				if (n === 36494) return i.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;
				if (n === 36495) return i.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT;
			} else return null;
		}
		if (n === 36283 || n === 36284 || n === 36285 || n === 36286) {
			if (i = t.get("EXT_texture_compression_rgtc"), i !== null) {
				if (n === 36283) return i.COMPRESSED_RED_RGTC1_EXT;
				if (n === 36284) return i.COMPRESSED_SIGNED_RED_RGTC1_EXT;
				if (n === 36285) return i.COMPRESSED_RED_GREEN_RGTC2_EXT;
				if (n === 36286) return i.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT;
			} else return null;
		}
		return n === 1020 ? e.UNSIGNED_INT_24_8 : e[n] === void 0 ? null : e[n];
	}
	return { convert: n };
}
var ml = "\nvoid main() {\n\n	gl_Position = vec4( position, 1.0 );\n\n}", hl = "\nuniform sampler2DArray depthColor;\nuniform float depthWidth;\nuniform float depthHeight;\n\nvoid main() {\n\n	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );\n\n	if ( coord.x >= 1.0 ) {\n\n		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;\n\n	} else {\n\n		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;\n\n	}\n\n}", gl = class {
	constructor() {
		this.texture = null, this.mesh = null, this.depthNear = 0, this.depthFar = 0;
	}
	init(e, t) {
		if (this.texture === null) {
			let n = new di(e.texture);
			(e.depthNear !== t.depthNear || e.depthFar !== t.depthFar) && (this.depthNear = e.depthNear, this.depthFar = e.depthFar), this.texture = n;
		}
	}
	getMesh(e) {
		if (this.texture !== null && this.mesh === null) {
			let t = e.cameras[0].viewport, n = new Si({
				vertexShader: ml,
				fragmentShader: hl,
				uniforms: {
					depthColor: { value: this.texture },
					depthWidth: { value: t.z },
					depthHeight: { value: t.w }
				}
			});
			this.mesh = new ur(new pi(20, 20), n);
		}
		return this.mesh;
	}
	reset() {
		this.texture = null, this.mesh = null;
	}
	getDepthTexture() {
		return this.texture;
	}
}, _l = class extends he {
	constructor(e, t) {
		super();
		let n = this, r = null, i = 1, a = null, o = "local-floor", s = 1, c = null, u = null, f = null, p = null, m = null, h = null, b = typeof XRWebGLBinding < "u", x = new gl(), S = {}, C = t.getContextAttributes(), w = null, T = null, E = [], D = [], O = new H(), ee = null, k = null, A = new Ca();
		A.viewport = new tt();
		let j = new Ca();
		j.viewport = new tt();
		let te = [A, j], M = new La(), N = null, ne = null;
		this.cameraAutoUpdate = !0, this.enabled = !1, this.isPresenting = !1, this.getController = function(e) {
			let t = E[e];
			return t === void 0 && (t = new Ft(), E[e] = t), t.getTargetRaySpace();
		}, this.getControllerGrip = function(e) {
			let t = E[e];
			return t === void 0 && (t = new Ft(), E[e] = t), t.getGripSpace();
		}, this.getHand = function(e) {
			let t = E[e];
			return t === void 0 && (t = new Ft(), E[e] = t), t.getHandSpace();
		};
		function P(e) {
			let t = D.indexOf(e.inputSource);
			if (t === -1) return;
			let n = E[t];
			n !== void 0 && (n.update(e.inputSource, e.frame, c || a), n.dispatchEvent({
				type: e.type,
				data: e.inputSource
			}));
		}
		function re() {
			r.removeEventListener("select", P), r.removeEventListener("selectstart", P), r.removeEventListener("selectend", P), r.removeEventListener("squeeze", P), r.removeEventListener("squeezestart", P), r.removeEventListener("squeezeend", P), r.removeEventListener("end", re), r.removeEventListener("inputsourceschange", F);
			for (let e = 0; e < E.length; e++) {
				let t = D[e];
				t !== null && (D[e] = null, E[e].disconnect(t));
			}
			N = null, ne = null, x.reset();
			for (let e in S) delete S[e];
			if (e.setRenderTarget(w), m = null, p = null, f = null, r = null, T = null, de.stop(), n.isPresenting = !1, e.setPixelRatio(ee), e.setSize(O.width, O.height, !1), k !== null) {
				let e = k.camera;
				e.fov = k.fov, e.zoom = k.zoom, e.updateProjectionMatrix(), k = null;
			}
			n.dispatchEvent({ type: "sessionend" });
		}
		this.setFramebufferScaleFactor = function(e) {
			i = e, n.isPresenting === !0 && I("WebXRManager: Cannot change framebuffer scale while presenting.");
		}, this.setReferenceSpaceType = function(e) {
			o = e, n.isPresenting === !0 && I("WebXRManager: Cannot change reference space type while presenting.");
		}, this.getReferenceSpace = function() {
			return c || a;
		}, this.setReferenceSpace = function(e) {
			c = e;
		}, this.getBaseLayer = function() {
			return p === null ? m : p;
		}, this.getBinding = function() {
			return f === null && b && (f = new XRWebGLBinding(r, t)), f;
		}, this.getFrame = function() {
			return h;
		}, this.getSession = function() {
			return r;
		}, this.setSession = async function(u) {
			if (r = u, r !== null) {
				if (w = e.getRenderTarget(), r.addEventListener("select", P), r.addEventListener("selectstart", P), r.addEventListener("selectend", P), r.addEventListener("squeeze", P), r.addEventListener("squeezestart", P), r.addEventListener("squeezeend", P), r.addEventListener("end", re), r.addEventListener("inputsourceschange", F), C.xrCompatible !== !0 && await t.makeXRCompatible(), ee = e.getPixelRatio(), e.getSize(O), b && "createProjectionLayer" in XRWebGLBinding.prototype) {
					let n = null, a = null, o = null;
					C.depth && (o = C.stencil ? t.DEPTH24_STENCIL8 : t.DEPTH_COMPONENT24, n = C.stencil ? y : v, a = C.stencil ? g : d);
					let s = {
						colorFormat: t.RGBA8,
						depthFormat: o,
						scaleFactor: i
					};
					f = this.getBinding(), p = f.createProjectionLayer(s), r.updateRenderState({ layers: [p] }), e.setPixelRatio(1), e.setSize(p.textureWidth, p.textureHeight, !1), T = new rt(p.textureWidth, p.textureHeight, {
						format: _,
						type: l,
						depthTexture: new li(p.textureWidth, p.textureHeight, a, void 0, void 0, void 0, void 0, void 0, void 0, n),
						stencilBuffer: C.stencil,
						colorSpace: e.outputColorSpace,
						samples: C.antialias ? 4 : 0,
						resolveDepthBuffer: p.ignoreDepthValues === !1,
						resolveStencilBuffer: p.ignoreDepthValues === !1,
						storeMultisampledDepthBuffer: p.ignoreDepthValues === !1,
						storeMultisampledStencilBuffer: p.ignoreDepthValues === !1
					});
				} else {
					let n = {
						antialias: C.antialias,
						alpha: !0,
						depth: C.depth,
						stencil: C.stencil,
						framebufferScaleFactor: i
					};
					m = new XRWebGLLayer(r, t, n), r.updateRenderState({ baseLayer: m }), e.setPixelRatio(1), e.setSize(m.framebufferWidth, m.framebufferHeight, !1), T = new rt(m.framebufferWidth, m.framebufferHeight, {
						format: _,
						type: l,
						colorSpace: e.outputColorSpace,
						stencilBuffer: C.stencil,
						resolveDepthBuffer: m.ignoreDepthValues === !1,
						resolveStencilBuffer: m.ignoreDepthValues === !1,
						storeMultisampledDepthBuffer: m.ignoreDepthValues === !1,
						storeMultisampledStencilBuffer: m.ignoreDepthValues === !1
					});
				}
				T.isXRRenderTarget = !0, this.setFoveation(s), c = null, a = await r.requestReferenceSpace(o), de.setContext(r), de.start(), n.isPresenting = !0, n.dispatchEvent({ type: "sessionstart" });
			}
		}, this.getEnvironmentBlendMode = function() {
			if (r !== null) return r.environmentBlendMode;
		}, this.getDepthTexture = function() {
			return x.getDepthTexture();
		};
		function F(e) {
			for (let t = 0; t < e.removed.length; t++) {
				let n = e.removed[t], r = D.indexOf(n);
				r >= 0 && (D[r] = null, E[r].disconnect(n));
			}
			for (let t = 0; t < e.added.length; t++) {
				let n = e.added[t], r = D.indexOf(n);
				if (r === -1) {
					for (let e = 0; e < E.length; e++) if (e >= D.length) {
						D.push(n), r = e;
						break;
					} else if (D[e] === null) {
						D[e] = n, r = e;
						break;
					}
					if (r === -1) break;
				}
				let i = E[r];
				i && i.connect(n);
			}
		}
		let ie = new W(), ae = new W();
		function oe(e, t, n) {
			ie.setFromMatrixPosition(t.matrixWorld), ae.setFromMatrixPosition(n.matrixWorld);
			let r = ie.distanceTo(ae), i = t.projectionMatrix.elements, a = n.projectionMatrix.elements, o = i[14] / (i[10] - 1), s = i[14] / (i[10] + 1), c = (i[9] + 1) / i[5], l = (i[9] - 1) / i[5], u = (i[8] - 1) / i[0], d = (a[8] + 1) / a[0], f = o * u, p = o * d, m = r / (-u + d), h = m * -u;
			if (t.matrixWorld.decompose(e.position, e.quaternion, e.scale), e.translateX(h), e.translateZ(m), e.matrixWorld.compose(e.position, e.quaternion, e.scale), e.matrixWorldInverse.copy(e.matrixWorld).invert(), i[10] === -1) e.projectionMatrix.copy(t.projectionMatrix), e.projectionMatrixInverse.copy(t.projectionMatrixInverse);
			else {
				let t = o + m, n = s + m, i = f - h, a = p + (r - h), u = c * s / n * t, d = l * s / n * t;
				e.projectionMatrix.makePerspective(i, a, u, d, t, n), e.projectionMatrixInverse.copy(e.projectionMatrix).invert();
			}
		}
		function se(e, t) {
			t === null ? e.matrixWorld.copy(e.matrix) : e.matrixWorld.multiplyMatrices(t.matrixWorld, e.matrix), e.matrixWorldInverse.copy(e.matrixWorld).invert();
		}
		this.updateCamera = function(e) {
			if (r === null) return;
			let t = e.near, n = e.far;
			x.texture !== null && (x.depthNear > 0 && (t = x.depthNear), x.depthFar > 0 && (n = x.depthFar)), M.near = j.near = A.near = t, M.far = j.far = A.far = n, (N !== M.near || ne !== M.far) && (r.updateRenderState({
				depthNear: M.near,
				depthFar: M.far
			}), N = M.near, ne = M.far), M.layers.mask = e.layers.mask | 6, A.layers.mask = M.layers.mask & -5, j.layers.mask = M.layers.mask & -3;
			let i = e.parent, a = M.cameras;
			se(M, i);
			for (let e = 0; e < a.length; e++) se(a[e], i);
			a.length === 2 ? oe(M, A, j) : M.projectionMatrix.copy(A.projectionMatrix), k === null && e.isPerspectiveCamera && (k = {
				camera: e,
				fov: e.fov,
				zoom: e.zoom
			}), ce(e, M, i);
		};
		function ce(e, t, n) {
			n === null ? e.matrix.copy(t.matrixWorld) : (e.matrix.copy(n.matrixWorld), e.matrix.invert(), e.matrix.multiply(t.matrixWorld)), e.matrix.decompose(e.position, e.quaternion, e.scale), e.updateMatrixWorld(!0), e.projectionMatrix.copy(t.projectionMatrix), e.projectionMatrixInverse.copy(t.projectionMatrixInverse), e.isPerspectiveCamera && (e.fov = ye * 2 * Math.atan(1 / e.projectionMatrix.elements[5]), e.zoom = 1);
		}
		this.getCamera = function() {
			return M;
		}, this.getFoveation = function() {
			if (p !== null || m !== null) return s;
		}, this.setFoveation = function(e) {
			s = e, p !== null && (p.fixedFoveation = e), m !== null && m.fixedFoveation !== void 0 && (m.fixedFoveation = e);
		}, this.hasDepthSensing = function() {
			return x.texture !== null;
		}, this.getDepthSensingMesh = function() {
			return x.getMesh(M);
		}, this.getCameraTexture = function(e) {
			return S[e];
		};
		let le = null;
		function ue(t, i) {
			if (u = i.getViewerPose(c || a), h = i, u !== null) {
				let t = u.views;
				m !== null && (e.setRenderTargetFramebuffer(T, m.framebuffer), e.setRenderTarget(T));
				let i = !1;
				t.length !== M.cameras.length && (M.cameras.length = 0, i = !0);
				for (let n = 0; n < t.length; n++) {
					let r = t[n], a = null;
					if (m !== null) a = m.getViewport(r);
					else {
						let t = f.getViewSubImage(p, r);
						a = t.viewport, n === 0 && (e.setRenderTargetTextures(T, t.colorTexture, t.depthStencilTexture), e.setRenderTarget(T));
					}
					let o = te[n];
					o === void 0 && (o = new Ca(), o.layers.enable(n), o.viewport = new tt(), te[n] = o), o.matrix.fromArray(r.transform.matrix), o.matrix.decompose(o.position, o.quaternion, o.scale), o.projectionMatrix.fromArray(r.projectionMatrix), o.projectionMatrixInverse.copy(o.projectionMatrix).invert(), o.viewport.set(a.x, a.y, a.width, a.height), n === 0 && (M.matrix.copy(o.matrix), M.matrix.decompose(M.position, M.quaternion, M.scale)), i === !0 && M.cameras.push(o);
				}
				let a = r.enabledFeatures;
				if (a && a.includes("depth-sensing") && r.depthUsage == "gpu-optimized" && b) {
					f = n.getBinding();
					let e = f.getDepthInformation(t[0]);
					e && e.isValid && e.texture && x.init(e, r.renderState);
				}
				if (a && a.includes("camera-access") && b) {
					e.state.unbindTexture(), f = n.getBinding();
					for (let e = 0; e < t.length; e++) {
						let n = t[e].camera;
						if (n) {
							let e = S[n];
							e || (e = new di(), S[n] = e);
							let t = f.getCameraImage(n);
							e.sourceTexture = t;
						}
					}
				}
			}
			for (let e = 0; e < E.length; e++) {
				let t = D[e], n = E[e];
				t !== null && n !== void 0 && n.update(t, i, c || a);
			}
			le && le(t, i), i.detectedPlanes && n.dispatchEvent({
				type: "planesdetected",
				data: i
			}), h = null;
		}
		let de = new co();
		de.setAnimationLoop(ue), this.setAnimationLoop = function(e) {
			le = e;
		}, this.dispose = function() {};
	}
}, vl = /*@__PURE__*/ new q(), yl = /*@__PURE__*/ new G();
yl.set(-1, 0, 0, 0, 1, 0, 0, 0, 1);
function bl(e, t) {
	function n(e, t) {
		e.matrixAutoUpdate === !0 && e.updateMatrix(), t.value.copy(e.matrix);
	}
	function r(t, n) {
		n.color.getRGB(t.fogColor.value, vi(e)), n.isFog ? (t.fogNear.value = n.near, t.fogFar.value = n.far) : n.isFogExp2 && (t.fogDensity.value = n.density);
	}
	function i(e, t, n, r, i) {
		t.isNodeMaterial ? t.uniformsNeedUpdate = !1 : t.isMeshBasicMaterial ? a(e, t) : t.isMeshLambertMaterial ? (a(e, t), t.envMap && (e.envMapIntensity.value = t.envMapIntensity)) : t.isMeshToonMaterial ? (a(e, t), d(e, t)) : t.isMeshPhongMaterial ? (a(e, t), u(e, t), t.envMap && (e.envMapIntensity.value = t.envMapIntensity)) : t.isMeshStandardMaterial ? (a(e, t), f(e, t), t.isMeshPhysicalMaterial && p(e, t, i)) : t.isMeshMatcapMaterial ? (a(e, t), m(e, t)) : t.isMeshDepthMaterial ? a(e, t) : t.isMeshDistanceMaterial ? (a(e, t), h(e, t)) : t.isMeshNormalMaterial ? a(e, t) : t.isLineBasicMaterial ? (o(e, t), t.isLineDashedMaterial && s(e, t)) : t.isPointsMaterial ? c(e, t, n, r) : t.isSpriteMaterial ? l(e, t) : t.isShadowMaterial ? (e.color.value.copy(t.color), e.opacity.value = t.opacity) : t.isShaderMaterial && (t.uniformsNeedUpdate = !1);
	}
	function a(e, r) {
		e.opacity.value = r.opacity, r.color && e.diffuse.value.copy(r.color), r.emissive && e.emissive.value.copy(r.emissive).multiplyScalar(r.emissiveIntensity), r.map && (e.map.value = r.map, n(r.map, e.mapTransform)), r.alphaMap && (e.alphaMap.value = r.alphaMap, n(r.alphaMap, e.alphaMapTransform)), r.bumpMap && (e.bumpMap.value = r.bumpMap, n(r.bumpMap, e.bumpMapTransform), e.bumpScale.value = r.bumpScale, r.side === 1 && (e.bumpScale.value *= -1)), r.normalMap && (e.normalMap.value = r.normalMap, n(r.normalMap, e.normalMapTransform), e.normalScale.value.copy(r.normalScale), r.side === 1 && e.normalScale.value.negate()), r.displacementMap && (e.displacementMap.value = r.displacementMap, n(r.displacementMap, e.displacementMapTransform), e.displacementScale.value = r.displacementScale, e.displacementBias.value = r.displacementBias), r.emissiveMap && (e.emissiveMap.value = r.emissiveMap, n(r.emissiveMap, e.emissiveMapTransform)), r.specularMap && (e.specularMap.value = r.specularMap, n(r.specularMap, e.specularMapTransform)), r.alphaTest > 0 && (e.alphaTest.value = r.alphaTest);
		let i = t.get(r), a = i.envMap, o = i.envMapRotation;
		a && (e.envMap.value = a, e.envMapRotation.value.setFromMatrix4(vl.makeRotationFromEuler(o)).transpose(), a.isCubeTexture && a.isRenderTargetTexture === !1 && e.envMapRotation.value.premultiply(yl), e.reflectivity.value = r.reflectivity, e.ior.value = r.ior, e.refractionRatio.value = r.refractionRatio), r.lightMap && (e.lightMap.value = r.lightMap, e.lightMapIntensity.value = r.lightMapIntensity, n(r.lightMap, e.lightMapTransform)), r.aoMap && (e.aoMap.value = r.aoMap, e.aoMapIntensity.value = r.aoMapIntensity, n(r.aoMap, e.aoMapTransform));
	}
	function o(e, t) {
		e.diffuse.value.copy(t.color), e.opacity.value = t.opacity, t.map && (e.map.value = t.map, n(t.map, e.mapTransform));
	}
	function s(e, t) {
		e.dashSize.value = t.dashSize, e.totalSize.value = t.dashSize + t.gapSize, e.scale.value = t.scale;
	}
	function c(e, t, r, i) {
		e.diffuse.value.copy(t.color), e.opacity.value = t.opacity, e.size.value = t.size * r, e.scale.value = i * .5, t.map && (e.map.value = t.map, n(t.map, e.uvTransform)), t.alphaMap && (e.alphaMap.value = t.alphaMap, n(t.alphaMap, e.alphaMapTransform)), t.alphaTest > 0 && (e.alphaTest.value = t.alphaTest);
	}
	function l(e, t) {
		e.diffuse.value.copy(t.color), e.opacity.value = t.opacity, e.rotation.value = t.rotation, t.map && (e.map.value = t.map, n(t.map, e.mapTransform)), t.alphaMap && (e.alphaMap.value = t.alphaMap, n(t.alphaMap, e.alphaMapTransform)), t.alphaTest > 0 && (e.alphaTest.value = t.alphaTest);
	}
	function u(e, t) {
		e.specular.value.copy(t.specular), e.shininess.value = Math.max(t.shininess, 1e-4);
	}
	function d(e, t) {
		t.gradientMap && (e.gradientMap.value = t.gradientMap);
	}
	function f(e, t) {
		e.metalness.value = t.metalness, t.metalnessMap && (e.metalnessMap.value = t.metalnessMap, n(t.metalnessMap, e.metalnessMapTransform)), e.roughness.value = t.roughness, t.roughnessMap && (e.roughnessMap.value = t.roughnessMap, n(t.roughnessMap, e.roughnessMapTransform)), t.envMap && (e.envMapIntensity.value = t.envMapIntensity);
	}
	function p(e, t, r) {
		e.ior.value = t.ior, t.sheen > 0 && (e.sheenColor.value.copy(t.sheenColor).multiplyScalar(t.sheen), e.sheenRoughness.value = t.sheenRoughness, t.sheenColorMap && (e.sheenColorMap.value = t.sheenColorMap, n(t.sheenColorMap, e.sheenColorMapTransform)), t.sheenRoughnessMap && (e.sheenRoughnessMap.value = t.sheenRoughnessMap, n(t.sheenRoughnessMap, e.sheenRoughnessMapTransform))), t.clearcoat > 0 && (e.clearcoat.value = t.clearcoat, e.clearcoatRoughness.value = t.clearcoatRoughness, t.clearcoatMap && (e.clearcoatMap.value = t.clearcoatMap, n(t.clearcoatMap, e.clearcoatMapTransform)), t.clearcoatRoughnessMap && (e.clearcoatRoughnessMap.value = t.clearcoatRoughnessMap, n(t.clearcoatRoughnessMap, e.clearcoatRoughnessMapTransform)), t.clearcoatNormalMap && (e.clearcoatNormalMap.value = t.clearcoatNormalMap, n(t.clearcoatNormalMap, e.clearcoatNormalMapTransform), e.clearcoatNormalScale.value.copy(t.clearcoatNormalScale), t.side === 1 && e.clearcoatNormalScale.value.negate())), t.dispersion > 0 && (e.dispersion.value = t.dispersion), t.retroreflectivity > 0 && (e.retroreflectivity.value = t.retroreflectivity), t.iridescence > 0 && (e.iridescence.value = t.iridescence, e.iridescenceIOR.value = t.iridescenceIOR, e.iridescenceThicknessMinimum.value = t.iridescenceThicknessRange[0], e.iridescenceThicknessMaximum.value = t.iridescenceThicknessRange[1], t.iridescenceMap && (e.iridescenceMap.value = t.iridescenceMap, n(t.iridescenceMap, e.iridescenceMapTransform)), t.iridescenceThicknessMap && (e.iridescenceThicknessMap.value = t.iridescenceThicknessMap, n(t.iridescenceThicknessMap, e.iridescenceThicknessMapTransform))), t.transmission > 0 && (e.transmission.value = t.transmission, e.transmissionSamplerMap.value = r.texture, e.transmissionSamplerSize.value.set(r.width, r.height), t.transmissionMap && (e.transmissionMap.value = t.transmissionMap, n(t.transmissionMap, e.transmissionMapTransform)), e.thickness.value = t.thickness, t.thicknessMap && (e.thicknessMap.value = t.thicknessMap, n(t.thicknessMap, e.thicknessMapTransform)), e.attenuationDistance.value = t.attenuationDistance, e.attenuationColor.value.copy(t.attenuationColor)), t.anisotropy > 0 && (e.anisotropyVector.value.set(t.anisotropy * Math.cos(t.anisotropyRotation), t.anisotropy * Math.sin(t.anisotropyRotation)), t.anisotropyMap && (e.anisotropyMap.value = t.anisotropyMap, n(t.anisotropyMap, e.anisotropyMapTransform))), e.specularIntensity.value = t.specularIntensity, e.specularColor.value.copy(t.specularColor), t.specularColorMap && (e.specularColorMap.value = t.specularColorMap, n(t.specularColorMap, e.specularColorMapTransform)), t.specularIntensityMap && (e.specularIntensityMap.value = t.specularIntensityMap, n(t.specularIntensityMap, e.specularIntensityMapTransform));
	}
	function m(e, t) {
		t.matcap && (e.matcap.value = t.matcap);
	}
	function h(e, n) {
		let r = t.get(n).light;
		e.referencePosition.value.setFromMatrixPosition(r.matrixWorld), e.nearDistance.value = r.shadow.camera.near, e.farDistance.value = r.shadow.camera.far;
	}
	return {
		refreshFogUniforms: r,
		refreshMaterialUniforms: i
	};
}
function xl(e, t, n, r) {
	let i = {}, a = {}, o = [], s = e.getParameter(e.MAX_UNIFORM_BUFFER_BINDINGS);
	function c(e, t) {
		let n = t.program;
		r.uniformBlockBinding(e, n);
	}
	function l(e, n) {
		let o = i[e.id];
		o === void 0 && (g(e), o = u(e), i[e.id] = o, e.addEventListener("dispose", v));
		let s = n.program;
		r.updateUBOMapping(e, s);
		let c = t.render.frame;
		a[e.id] !== c && (f(e), a[e.id] = c);
	}
	function u(t) {
		let n = d();
		t.__bindingPointIndex = n;
		let r = e.createBuffer(), i = t.__size, a = t.usage;
		return e.bindBuffer(e.UNIFORM_BUFFER, r), e.bufferData(e.UNIFORM_BUFFER, i, a), e.bindBuffer(e.UNIFORM_BUFFER, null), e.bindBufferBase(e.UNIFORM_BUFFER, n, r), r;
	}
	function d() {
		for (let e = 0; e < s; e++) if (o.indexOf(e) === -1) return o.push(e), e;
		return L("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."), 0;
	}
	function f(t) {
		let n = i[t.id], r = t.uniforms, a = t.__cache;
		e.bindBuffer(e.UNIFORM_BUFFER, n);
		for (let e = 0, t = r.length; e < t; e++) {
			let t = r[e];
			if (Array.isArray(t)) for (let n = 0, r = t.length; n < r; n++) p(t[n], e, n, a);
			else p(t, e, 0, a);
		}
		e.bindBuffer(e.UNIFORM_BUFFER, null);
	}
	function p(t, n, r, i) {
		if (h(t, n, r, i) === !0) {
			let n = t.__offset, r = t.value;
			if (Array.isArray(r)) {
				let e = 0;
				for (let n = 0; n < r.length; n++) {
					let i = r[n], a = _(i);
					m(i, t.__data, e), typeof i != "number" && typeof i != "boolean" && !i.isMatrix3 && !ArrayBuffer.isView(i) && (e += a.storage / Float32Array.BYTES_PER_ELEMENT);
				}
			} else m(r, t.__data, 0);
			e.bufferSubData(e.UNIFORM_BUFFER, n, t.__data);
		}
	}
	function m(e, t, n) {
		typeof e == "number" || typeof e == "boolean" ? t[0] = e : e.isMatrix3 ? (t[0] = e.elements[0], t[1] = e.elements[1], t[2] = e.elements[2], t[3] = 0, t[4] = e.elements[3], t[5] = e.elements[4], t[6] = e.elements[5], t[7] = 0, t[8] = e.elements[6], t[9] = e.elements[7], t[10] = e.elements[8], t[11] = 0) : ArrayBuffer.isView(e) ? t.set(new e.constructor(e.buffer, e.byteOffset, t.length)) : e.toArray(t, n);
	}
	function h(e, t, n, r) {
		let i = e.value, a = t + "_" + n;
		if (r[a] === void 0) return r[a] = typeof i == "number" || typeof i == "boolean" ? i : ArrayBuffer.isView(i) ? i.slice() : i.clone(), !0;
		{
			let e = r[a];
			if (typeof i == "number" || typeof i == "boolean") {
				if (e !== i) return r[a] = i, !0;
			} else if (ArrayBuffer.isView(i)) return !0;
			else if (e.equals(i) === !1) return e.copy(i), !0;
		}
		return !1;
	}
	function g(e) {
		let t = e.uniforms, n = 0;
		for (let e = 0, r = t.length; e < r; e++) {
			let r = Array.isArray(t[e]) ? t[e] : [t[e]];
			for (let e = 0, t = r.length; e < t; e++) {
				let t = r[e], i = Array.isArray(t.value) ? t.value : [t.value];
				for (let e = 0, r = i.length; e < r; e++) {
					let r = i[e], a = _(r), o = n % 16, s = o % a.boundary, c = o + s;
					n += s, c !== 0 && 16 - c < a.storage && (n += 16 - c), t.__data = new Float32Array(a.storage / Float32Array.BYTES_PER_ELEMENT), t.__offset = n, n += a.storage;
				}
			}
		}
		let r = n % 16;
		return r > 0 && (n += 16 - r), e.__size = n, e.__cache = {}, this;
	}
	function _(e) {
		let t = {
			boundary: 0,
			storage: 0
		};
		return typeof e == "number" || typeof e == "boolean" ? (t.boundary = 4, t.storage = 4) : e.isVector2 ? (t.boundary = 8, t.storage = 8) : e.isVector3 || e.isColor ? (t.boundary = 16, t.storage = 12) : e.isVector4 ? (t.boundary = 16, t.storage = 16) : e.isMatrix3 ? (t.boundary = 48, t.storage = 48) : e.isMatrix4 ? (t.boundary = 64, t.storage = 64) : e.isTexture ? I("WebGLRenderer: Texture samplers can not be part of an uniforms group.") : ArrayBuffer.isView(e) ? (t.boundary = 16, t.storage = e.byteLength) : I("WebGLRenderer: Unsupported uniform value type.", e), t;
	}
	function v(t) {
		let n = t.target;
		n.removeEventListener("dispose", v);
		let r = o.indexOf(n.__bindingPointIndex);
		o.splice(r, 1), e.deleteBuffer(i[n.id]), delete i[n.id], delete a[n.id];
	}
	function y() {
		for (let t in i) e.deleteBuffer(i[t]);
		o = [], i = {}, a = {};
	}
	return {
		bind: c,
		update: l,
		dispose: y
	};
}
var Sl = new Uint16Array([
	12469,
	15057,
	12620,
	14925,
	13266,
	14620,
	13807,
	14376,
	14323,
	13990,
	14545,
	13625,
	14713,
	13328,
	14840,
	12882,
	14931,
	12528,
	14996,
	12233,
	15039,
	11829,
	15066,
	11525,
	15080,
	11295,
	15085,
	10976,
	15082,
	10705,
	15073,
	10495,
	13880,
	14564,
	13898,
	14542,
	13977,
	14430,
	14158,
	14124,
	14393,
	13732,
	14556,
	13410,
	14702,
	12996,
	14814,
	12596,
	14891,
	12291,
	14937,
	11834,
	14957,
	11489,
	14958,
	11194,
	14943,
	10803,
	14921,
	10506,
	14893,
	10278,
	14858,
	9960,
	14484,
	14039,
	14487,
	14025,
	14499,
	13941,
	14524,
	13740,
	14574,
	13468,
	14654,
	13106,
	14743,
	12678,
	14818,
	12344,
	14867,
	11893,
	14889,
	11509,
	14893,
	11180,
	14881,
	10751,
	14852,
	10428,
	14812,
	10128,
	14765,
	9754,
	14712,
	9466,
	14764,
	13480,
	14764,
	13475,
	14766,
	13440,
	14766,
	13347,
	14769,
	13070,
	14786,
	12713,
	14816,
	12387,
	14844,
	11957,
	14860,
	11549,
	14868,
	11215,
	14855,
	10751,
	14825,
	10403,
	14782,
	10044,
	14729,
	9651,
	14666,
	9352,
	14599,
	9029,
	14967,
	12835,
	14966,
	12831,
	14963,
	12804,
	14954,
	12723,
	14936,
	12564,
	14917,
	12347,
	14900,
	11958,
	14886,
	11569,
	14878,
	11247,
	14859,
	10765,
	14828,
	10401,
	14784,
	10011,
	14727,
	9600,
	14660,
	9289,
	14586,
	8893,
	14508,
	8533,
	15111,
	12234,
	15110,
	12234,
	15104,
	12216,
	15092,
	12156,
	15067,
	12010,
	15028,
	11776,
	14981,
	11500,
	14942,
	11205,
	14902,
	10752,
	14861,
	10393,
	14812,
	9991,
	14752,
	9570,
	14682,
	9252,
	14603,
	8808,
	14519,
	8445,
	14431,
	8145,
	15209,
	11449,
	15208,
	11451,
	15202,
	11451,
	15190,
	11438,
	15163,
	11384,
	15117,
	11274,
	15055,
	10979,
	14994,
	10648,
	14932,
	10343,
	14871,
	9936,
	14803,
	9532,
	14729,
	9218,
	14645,
	8742,
	14556,
	8381,
	14461,
	8020,
	14365,
	7603,
	15273,
	10603,
	15272,
	10607,
	15267,
	10619,
	15256,
	10631,
	15231,
	10614,
	15182,
	10535,
	15118,
	10389,
	15042,
	10167,
	14963,
	9787,
	14883,
	9447,
	14800,
	9115,
	14710,
	8665,
	14615,
	8318,
	14514,
	7911,
	14411,
	7507,
	14279,
	7198,
	15314,
	9675,
	15313,
	9683,
	15309,
	9712,
	15298,
	9759,
	15277,
	9797,
	15229,
	9773,
	15166,
	9668,
	15084,
	9487,
	14995,
	9274,
	14898,
	8910,
	14800,
	8539,
	14697,
	8234,
	14590,
	7790,
	14479,
	7409,
	14367,
	7067,
	14178,
	6621,
	15337,
	8619,
	15337,
	8631,
	15333,
	8677,
	15325,
	8769,
	15305,
	8871,
	15264,
	8940,
	15202,
	8909,
	15119,
	8775,
	15022,
	8565,
	14916,
	8328,
	14804,
	8009,
	14688,
	7614,
	14569,
	7287,
	14448,
	6888,
	14321,
	6483,
	14088,
	6171,
	15350,
	7402,
	15350,
	7419,
	15347,
	7480,
	15340,
	7613,
	15322,
	7804,
	15287,
	7973,
	15229,
	8057,
	15148,
	8012,
	15046,
	7846,
	14933,
	7611,
	14810,
	7357,
	14682,
	7069,
	14552,
	6656,
	14421,
	6316,
	14251,
	5948,
	14007,
	5528,
	15356,
	5942,
	15356,
	5977,
	15353,
	6119,
	15348,
	6294,
	15332,
	6551,
	15302,
	6824,
	15249,
	7044,
	15171,
	7122,
	15070,
	7050,
	14949,
	6861,
	14818,
	6611,
	14679,
	6349,
	14538,
	6067,
	14398,
	5651,
	14189,
	5311,
	13935,
	4958,
	15359,
	4123,
	15359,
	4153,
	15356,
	4296,
	15353,
	4646,
	15338,
	5160,
	15311,
	5508,
	15263,
	5829,
	15188,
	6042,
	15088,
	6094,
	14966,
	6001,
	14826,
	5796,
	14678,
	5543,
	14527,
	5287,
	14377,
	4985,
	14133,
	4586,
	13869,
	4257,
	15360,
	1563,
	15360,
	1642,
	15358,
	2076,
	15354,
	2636,
	15341,
	3350,
	15317,
	4019,
	15273,
	4429,
	15203,
	4732,
	15105,
	4911,
	14981,
	4932,
	14836,
	4818,
	14679,
	4621,
	14517,
	4386,
	14359,
	4156,
	14083,
	3795,
	13808,
	3437,
	15360,
	122,
	15360,
	137,
	15358,
	285,
	15355,
	636,
	15344,
	1274,
	15322,
	2177,
	15281,
	2765,
	15215,
	3223,
	15120,
	3451,
	14995,
	3569,
	14846,
	3567,
	14681,
	3466,
	14511,
	3305,
	14344,
	3121,
	14037,
	2800,
	13753,
	2467,
	15360,
	0,
	15360,
	1,
	15359,
	21,
	15355,
	89,
	15346,
	253,
	15325,
	479,
	15287,
	796,
	15225,
	1148,
	15133,
	1492,
	15008,
	1749,
	14856,
	1882,
	14685,
	1886,
	14506,
	1783,
	14324,
	1608,
	13996,
	1398,
	13702,
	1183
]), Cl = null;
function wl() {
	return Cl === null && (Cl = new wr(Sl, 16, 16, S, p), Cl.name = "DFG_LUT", Cl.minFilter = o, Cl.magFilter = o, Cl.wrapS = t, Cl.wrapT = t, Cl.generateMipmaps = !1, Cl.needsUpdate = !0), Cl;
}
var Tl = class {
	constructor(e = {}) {
		let { canvas: t = ce(), context: n = null, depth: r = !0, stencil: i = !1, alpha: a = !1, antialias: o = !1, premultipliedAlpha: s = !0, preserveDrawingBuffer: f = !1, powerPreference: _ = "default", failIfMajorPerformanceCaveat: v = !1, reversedDepthBuffer: y = !1, outputBufferType: b = l } = e;
		this.isWebGLRenderer = !0;
		let S;
		if (n !== null) {
			if (typeof WebGLRenderingContext < "u" && n instanceof WebGLRenderingContext) throw Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");
			S = n.getContextAttributes().alpha;
		} else S = a;
		let T = b, E = /* @__PURE__ */ new Set([
			w,
			C,
			x
		]), D = /* @__PURE__ */ new Set([
			l,
			d,
			u,
			g,
			m,
			h
		]), O = /* @__PURE__ */ new Uint32Array(4), ee = /* @__PURE__ */ new Int32Array(4), k = new W(), A = null, j = null, te = [], N = [], ne = null;
		this.domElement = t, this.debug = {
			checkShaderErrors: !0,
			diagnostics: { keywords: !1 },
			onShaderError: null
		}, this.autoClear = !0, this.autoClearColor = !0, this.autoClearDepth = !0, this.autoClearStencil = !0, this.sortObjects = !0, this.clippingPlanes = [], this.localClippingEnabled = !1, this.toneMapping = 0, this.toneMappingExposure = 1, this.transmissionResolutionScale = 1;
		let P = this, re = !1, F = null, ae = null, oe = null, se = null;
		this._outputColorSpace = M;
		let le = 0, de = 0, fe = null, me = -1, he = null, ge = new tt(), _e = new tt(), ve = null, ye = new J(0), be = 0, R = t.width, xe = t.height, Se = 1, Ce = null, we = null, Te = new tt(0, 0, R, xe), Ee = new tt(0, 0, R, xe), De = !1, Oe = new Br(), ke = !1, Ae = !1, je = new q(), Me = new W(), Ne = new tt(), Pe = {
			background: null,
			fog: null,
			environment: null,
			overrideMaterial: null,
			isScene: !0
		}, Fe = !1;
		function Ie() {
			return fe === null ? Se : 1;
		}
		let z = n;
		function Le(e, n) {
			return t.getContext(e, n);
		}
		let Re, B, V, H, U, ze, Be, G, Ve, He, Ue, We, Ge, Ke, qe, Je, Ye, Xe, Ze, Qe, $e, et, nt;
		try {
			let e = {
				alpha: !0,
				depth: r,
				stencil: i,
				antialias: o,
				premultipliedAlpha: s,
				preserveDrawingBuffer: f,
				powerPreference: _,
				failIfMajorPerformanceCaveat: v
			};
			if ("setAttribute" in t && t.setAttribute("data-engine", "three.js r186"), t.addEventListener("webglcontextlost", ot, !1), t.addEventListener("webglcontextrestored", st, !1), t.addEventListener("webglcontextcreationerror", ct, !1), z === null) {
				let t = "webgl2";
				if (z = Le(t, e), z === null) throw Le(t) ? Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes.") : Error("THREE.WebGLRenderer: Error creating WebGL context.");
			}
			it();
		} catch (e) {
			throw t.removeEventListener("webglcontextlost", ot, !1), t.removeEventListener("webglcontextrestored", st, !1), t.removeEventListener("webglcontextcreationerror", ct, !1), L("WebGLRenderer: " + e.message), e;
		}
		function it() {
			Re = new Uo(z), Re.init(), $e = new pl(z, Re), B = new vo(z, Re, e, $e), V = new dl(z, Re), B.reversedDepthBuffer && y && V.buffers.depth.setReversed(!0), ae = z.createFramebuffer(), oe = z.createFramebuffer(), se = z.createFramebuffer(), H = new Ko(z), U = new Gc(), ze = new fl(z, Re, V, U, B, $e, H), Be = new Ho(P), G = new lo(z), et = new go(z, G), Ve = new Wo(z, G, H, et), He = new Jo(z, Ve, G, et, H), Xe = new qo(z, B, ze), qe = new yo(U), Ue = new Wc(P, Be, Re, B, et, qe), We = new bl(P, U), Ge = new Yc(), Ke = new nl(Re), Ye = new ho(P, Be, V, He, S, s), Je = new ul(P, He, B), nt = new xl(z, H, B, V), Ze = new _o(z, Re, H), Qe = new Go(z, Re, H), H.programs = Ue.programs, P.capabilities = B, P.extensions = Re, P.properties = U, P.renderLists = Ge, P.shadowMap = Je, P.state = V, P.info = H;
		}
		T !== 1009 && (ne = new Xo(T, t.width, t.height, o, r, i));
		let at = new _l(P, z);
		this.xr = at, this.getContext = function() {
			return z;
		}, this.getContextAttributes = function() {
			return z.getContextAttributes();
		}, this.forceContextLoss = function() {
			let e = Re.get("WEBGL_lose_context");
			e && e.loseContext();
		}, this.forceContextRestore = function() {
			let e = Re.get("WEBGL_lose_context");
			e && e.restoreContext();
		}, this.getPixelRatio = function() {
			return Se;
		}, this.setPixelRatio = function(e) {
			e !== void 0 && (Se = e, this.setSize(R, xe, !1));
		}, this.getSize = function(e) {
			return e.set(R, xe);
		}, this.setSize = function(e, n, r = !0) {
			at.isPresenting ? I("WebGLRenderer: Can't change size while VR device is presenting.") : (R = e, xe = n, t.width = Math.floor(e * Se), t.height = Math.floor(n * Se), r === !0 && (t.style.width = e + "px", t.style.height = n + "px"), ne !== null && ne.setSize(t.width, t.height), this.setViewport(0, 0, e, n));
		}, this.getDrawingBufferSize = function(e) {
			return e.set(R * Se, xe * Se).floor();
		}, this.setDrawingBufferSize = function(e, n, r) {
			R = e, xe = n, Se = r, t.width = Math.floor(e * r), t.height = Math.floor(n * r), this.setViewport(0, 0, e, n);
		}, this.setEffects = function(e) {
			if (T === 1009) L("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");
			else {
				if (e) {
					for (let t = 0; t < e.length; t++) if (e[t].isOutputPass === !0) {
						I("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");
						break;
					}
				}
				ne.setEffects(e || []);
			}
		}, this.getCurrentViewport = function(e) {
			return e.copy(ge);
		}, this.getViewport = function(e) {
			return e.copy(Te);
		}, this.setViewport = function(e, t, n, r) {
			e.isVector4 ? Te.set(e.x, e.y, e.z, e.w) : Te.set(e, t, n, r), V.viewport(ge.copy(Te).multiplyScalar(Se).round());
		}, this.getScissor = function(e) {
			return e.copy(Ee);
		}, this.setScissor = function(e, t, n, r) {
			e.isVector4 ? Ee.set(e.x, e.y, e.z, e.w) : Ee.set(e, t, n, r), V.scissor(_e.copy(Ee).multiplyScalar(Se).round());
		}, this.getScissorTest = function() {
			return De;
		}, this.setScissorTest = function(e) {
			V.setScissorTest(De = e);
		}, this.setOpaqueSort = function(e) {
			Ce = e;
		}, this.setTransparentSort = function(e) {
			we = e;
		}, this.getClearColor = function(e) {
			return e.copy(Ye.getClearColor());
		}, this.setClearColor = function() {
			Ye.setClearColor(...arguments);
		}, this.getClearAlpha = function() {
			return Ye.getClearAlpha();
		}, this.setClearAlpha = function() {
			Ye.setClearAlpha(...arguments);
		}, this.clear = function(e = !0, t = !0, n = !0) {
			let r = 0;
			if (e) {
				let e = !1;
				if (fe !== null) {
					let t = fe.texture.format;
					e = E.has(t);
				}
				if (e) {
					let e = fe.texture.type, t = D.has(e), n = Ye.getClearColor(), r = Ye.getClearAlpha(), i = n.r, a = n.g, o = n.b;
					t ? (O[0] = i, O[1] = a, O[2] = o, O[3] = r, z.clearBufferuiv(z.COLOR, 0, O)) : (ee[0] = i, ee[1] = a, ee[2] = o, ee[3] = r, z.clearBufferiv(z.COLOR, 0, ee));
				} else r |= z.COLOR_BUFFER_BIT;
			}
			t && (r |= z.DEPTH_BUFFER_BIT, this.state.buffers.depth.setMask(!0)), n && (r |= z.STENCIL_BUFFER_BIT, this.state.buffers.stencil.setMask(4294967295)), r !== 0 && z.clear(r);
		}, this.clearColor = function() {
			this.clear(!0, !1, !1);
		}, this.clearDepth = function() {
			this.clear(!1, !0, !1);
		}, this.clearStencil = function() {
			this.clear(!1, !1, !0);
		}, this.setNodesHandler = function(e) {
			e.setRenderer(this), F = e;
		}, this.dispose = function() {
			t.removeEventListener("webglcontextlost", ot, !1), t.removeEventListener("webglcontextrestored", st, !1), t.removeEventListener("webglcontextcreationerror", ct, !1), Ye.dispose(), Ge.dispose(), Ke.dispose(), U.dispose(), Be.dispose(), He.dispose(), et.dispose(), nt.dispose(), Ue.dispose(), at.dispose(), at.removeEventListener("sessionstart", ht), at.removeEventListener("sessionend", gt), _t.stop();
		};
		function ot(e) {
			e.preventDefault(), ue("WebGLRenderer: Context Lost."), re = !0;
		}
		function st() {
			ue("WebGLRenderer: Context Restored."), re = !1;
			let e = H.autoReset, t = Je.enabled, n = Je.autoUpdate, r = Je.needsUpdate, i = Je.type;
			it(), H.autoReset = e, Je.enabled = t, Je.autoUpdate = n, Je.needsUpdate = r, Je.type = i;
		}
		function ct(e) {
			L("WebGLRenderer: A WebGL context could not be created. Reason: ", e.statusMessage);
		}
		function lt(e) {
			let t = e.target;
			t.removeEventListener("dispose", lt), ut(t);
		}
		function ut(e) {
			dt(e), U.remove(e);
		}
		function dt(e) {
			let t = U.get(e).programs;
			t !== void 0 && (t.forEach(function(e) {
				Ue.releaseProgram(e);
			}), e.isShaderMaterial && Ue.releaseShaderCache(e));
		}
		this.renderBufferDirect = function(e, t, n, r, i, a) {
			t === null && (t = Pe);
			let o = i.isMesh && i.matrixWorld.determinantAffine() < 0, s = Dt(e, t, n, r, i);
			V.setMaterial(r, o);
			let c = n.index, l = 1;
			if (r.wireframe === !0) {
				if (c = Ve.getWireframeAttribute(n), c === void 0) return;
				l = 2;
			}
			let u = n.drawRange, d = n.attributes.position, f = u.start * l, p = (u.start + u.count) * l;
			a !== null && (f = Math.max(f, a.start * l), p = Math.min(p, (a.start + a.count) * l)), c === null ? d != null && (f = Math.max(f, 0), p = Math.min(p, d.count)) : (f = Math.max(f, 0), p = Math.min(p, c.count));
			let m = p - f;
			if (m < 0 || m === Infinity) return;
			et.setup(i, r, s, n, c);
			let h, g = Ze;
			if (c !== null && (h = G.get(c), g = Qe, g.setIndex(h)), i.isMesh) r.wireframe === !0 ? (V.setLineWidth(r.wireframeLinewidth * Ie()), g.setMode(z.LINES)) : g.setMode(z.TRIANGLES);
			else if (i.isLine) {
				let e = r.linewidth;
				e === void 0 && (e = 1), V.setLineWidth(e * Ie()), i.isLineSegments ? g.setMode(z.LINES) : i.isLineLoop ? g.setMode(z.LINE_LOOP) : g.setMode(z.LINE_STRIP);
			} else i.isPoints ? g.setMode(z.POINTS) : i.isSprite && g.setMode(z.TRIANGLES);
			if (i.isBatchedMesh) {
				if (Re.get("WEBGL_multi_draw")) g.renderMultiDraw(i._multiDrawStarts, i._multiDrawCounts, i._multiDrawCount);
				else {
					let e = i._multiDrawStarts, t = i._multiDrawCounts, n = i._multiDrawCount, a = c ? G.get(c).bytesPerElement : 1, o = U.get(r).currentProgram.getUniforms();
					for (let r = 0; r < n; r++) o.setValue(z, "_gl_DrawID", r), g.render(e[r] / a, t[r]);
				}
			} else if (i.isInstancedMesh) g.renderInstances(f, m, i.count);
			else if (n.isInstancedBufferGeometry) {
				let e = n._maxInstanceCount === void 0 ? Infinity : n._maxInstanceCount, t = Math.min(n.instanceCount, e);
				g.renderInstances(f, m, t);
			} else g.render(f, m);
		};
		function ft(e, t, n, r) {
			F !== null && e.isNodeMaterial && F.setObject(r, e), ke === !0 && qe.setState(e, n, !1), e.transparent === !0 && e.side === 2 && e.forceSinglePass === !1 ? (e.side = 1, e.needsUpdate = !0, Ct(e, t, r), e.side = 0, e.needsUpdate = !0, Ct(e, t, r), e.side = 2) : Ct(e, t, r);
		}
		this.compile = function(e, t, n = null) {
			n === null && (n = e), F !== null && F.renderStart(e, t, n), j = Ke.get(n), j.init(t), N.push(j), n.traverseVisible(function(e) {
				e.isLight && e.layers.test(t.layers) && (j.pushLight(e), e.castShadow && j.pushShadow(e));
			}), e !== n && e.traverseVisible(function(e) {
				e.isLight && e.layers.test(t.layers) && (j.pushLight(e), e.castShadow && j.pushShadow(e));
			}), j.setupLights(), F !== null && F.updateLights(j.state.lightsArray), Ae = this.localClippingEnabled, ke = qe.init(this.clippingPlanes, Ae), ke === !0 && qe.setGlobalState(this.clippingPlanes, t), F !== null && Je.render(j.state.shadowsArray, n, t);
			let r = /* @__PURE__ */ new Set();
			return e.traverse(function(e) {
				if (!(e.isMesh || e.isPoints || e.isLine || e.isSprite)) return;
				let i = e.material;
				if (i) {
					if (Array.isArray(i)) for (let a = 0; a < i.length; a++) {
						let o = i[a];
						ft(o, n, t, e), r.add(o);
					}
					else ft(i, n, t, e), r.add(i);
				}
			}), j = N.pop(), F !== null && F.renderEnd(), r;
		}, this.compileAsync = function(e, t, n = null) {
			let r = this.compile(e, t, n);
			return new Promise((t) => {
				function n() {
					r.forEach(function(e) {
						let t = U.get(e).currentProgram;
						(t === void 0 || t.isReady()) && r.delete(e);
					}), r.size === 0 ? t(e) : setTimeout(n, 10);
				}
				Re.get("KHR_parallel_shader_compile") === null ? setTimeout(n, 10) : n();
			});
		};
		let pt = null;
		function mt(e) {
			pt && pt(e);
		}
		function ht() {
			_t.stop();
		}
		function gt() {
			_t.start();
		}
		let _t = new co();
		_t.setAnimationLoop(mt), typeof self < "u" && _t.setContext(self), this.setAnimationLoop = function(e) {
			pt = e, at.setAnimationLoop(e), e === null ? _t.stop() : _t.start();
		}, at.addEventListener("sessionstart", ht), at.addEventListener("sessionend", gt), this.render = function(e, t) {
			if (t !== void 0 && t.isCamera !== !0) {
				L("WebGLRenderer.render: camera is not an instance of THREE.Camera.");
				return;
			}
			if (re === !0) return;
			F !== null && F.renderStart(e, t);
			let n = at.enabled === !0 && at.isPresenting === !0, r = ne !== null && (fe === null || n) && ne.begin(P, fe);
			if (e.matrixWorldAutoUpdate === !0 && e.updateMatrixWorld(), t.parent === null && t.matrixWorldAutoUpdate === !0 && t.updateMatrixWorld(), at.enabled === !0 && at.isPresenting === !0 && (ne === null || ne.isCompositing() === !1) && (at.cameraAutoUpdate === !0 && at.updateCamera(t), t = at.getCamera()), e.isScene === !0 && e.onBeforeRender(P, e, t, fe), j = Ke.get(e, N.length), j.init(t), j.state.textureUnits = ze.getTextureUnits(), N.push(j), je.multiplyMatrices(t.projectionMatrix, t.matrixWorldInverse), Oe.setFromProjectionMatrix(je, ie, t.reversedDepth), Ae = this.localClippingEnabled, ke = qe.init(this.clippingPlanes, Ae), A = Ge.get(e, te.length), A.init(), te.push(A), at.enabled === !0 && at.isPresenting === !0) {
				let e = P.xr.getDepthSensingMesh();
				e !== null && vt(e, t, -Infinity, P.sortObjects);
			}
			vt(e, t, 0, P.sortObjects), A.finish(), F !== null && F.updateLights(j.state.lightsArray), P.sortObjects === !0 && A.sort(Ce, we), Fe = at.enabled === !1 || at.isPresenting === !1 || at.hasDepthSensing() === !1, Fe && Ye.addToRenderList(A, e), this.info.render.frame++, this.info.autoReset === !0 && this.info.reset(), ke === !0 && qe.beginShadows();
			let i = j.state.shadowsArray;
			if (Je.render(i, e, t), ke === !0 && qe.endShadows(), (r && ne.hasRenderPass()) === !1) {
				let n = A.opaque, r = A.transmissive;
				if (j.setupLights(), t.isArrayCamera) {
					let i = t.cameras;
					if (r.length > 0) for (let t = 0, a = i.length; t < a; t++) {
						let a = i[t];
						bt(n, r, e, a);
					}
					Fe && Ye.render(e);
					for (let t = 0, n = i.length; t < n; t++) {
						let n = i[t];
						yt(A, e, n, n.viewport);
					}
				} else r.length > 0 && bt(n, r, e, t), Fe && Ye.render(e), yt(A, e, t);
			}
			fe !== null && de === 0 && (ze.updateMultisampleRenderTarget(fe), ze.updateRenderTargetMipmap(fe)), r && ne.end(P), e.isScene === !0 && e.onAfterRender(P, e, t), et.resetDefaultState(), me = -1, he = null, N.pop(), N.length > 0 ? (j = N[N.length - 1], ze.setTextureUnits(j.state.textureUnits), ke === !0 && qe.setGlobalState(P.clippingPlanes, j.state.camera)) : j = null, te.pop(), A = te.length > 0 ? te[te.length - 1] : null, F !== null && F.renderEnd();
		};
		function vt(e, t, n, r) {
			if (e.visible === !1) return;
			if (e.layers.test(t.layers)) {
				if (e.isGroup) n = e.renderOrder;
				else if (e.isLOD) e.autoUpdate === !0 && e.update(t);
				else if (e.isLightProbeGrid) j.pushLightProbeGrid(e);
				else if (e.isLight) j.pushLight(e), e.castShadow && j.pushShadow(e);
				else if (e.isSprite) {
					if (!e.frustumCulled || e.intersectsFrustum(Oe)) {
						r && Ne.setFromMatrixPosition(e.matrixWorld).applyMatrix4(je);
						let i = He.update(e), a = e.material;
						a.visible && A.push(e, i, a, n, Ne.z, null, t);
					}
				} else if ((e.isMesh || e.isLine || e.isPoints) && (!e.frustumCulled || e.intersectsFrustum(Oe))) {
					let i = He.update(e), a = e.material;
					if (r && (e.boundingSphere === void 0 ? (i.boundingSphere === null && i.computeBoundingSphere(), Ne.copy(i.boundingSphere.center)) : (e.boundingSphere === null && e.computeBoundingSphere(), Ne.copy(e.boundingSphere.center)), Ne.applyMatrix4(e.matrixWorld).applyMatrix4(je)), Array.isArray(a)) {
						let r = i.groups;
						for (let o = 0, s = r.length; o < s; o++) {
							let s = r[o], c = a[s.materialIndex];
							c && c.visible && A.push(e, i, c, n, Ne.z, s, t);
						}
					} else a.visible && A.push(e, i, a, n, Ne.z, null, t);
				}
			}
			let i = e.children;
			for (let e = 0, a = i.length; e < a; e++) vt(i[e], t, n, r);
		}
		function yt(e, t, n, r) {
			let { opaque: i, transmissive: a, transparent: o } = e;
			j.setupLightsView(n), ke === !0 && qe.setGlobalState(P.clippingPlanes, n), r && V.viewport(ge.copy(r)), i.length > 0 && xt(i, t, n), a.length > 0 && xt(a, t, n), o.length > 0 && xt(o, t, n), V.buffers.depth.setTest(!0), V.buffers.depth.setMask(!0), V.buffers.color.setMask(!0), V.setPolygonOffset(!1);
		}
		function bt(e, t, n, r) {
			if ((n.isScene === !0 ? n.overrideMaterial : null) !== null) return;
			if (j.state.transmissionRenderTarget[r.id] === void 0) {
				let e = Re.has("EXT_color_buffer_half_float") || Re.has("EXT_color_buffer_float");
				j.state.transmissionRenderTarget[r.id] = new rt(1, 1, {
					generateMipmaps: !0,
					type: e ? p : l,
					minFilter: c,
					samples: Math.max(4, B.samples),
					stencilBuffer: i,
					resolveDepthBuffer: !1,
					resolveStencilBuffer: !1,
					storeMultisampledDepthBuffer: !1,
					storeMultisampledStencilBuffer: !1,
					colorSpace: K.workingColorSpace
				});
			}
			let a = j.state.transmissionRenderTarget[r.id], o = r.viewport || ge;
			a.setSize(o.z * P.transmissionResolutionScale, o.w * P.transmissionResolutionScale);
			let s = P.getRenderTarget(), u = P.getActiveCubeFace(), d = P.getActiveMipmapLevel();
			P.setRenderTarget(a), P.getClearColor(ye), be = P.getClearAlpha(), be < 1 && P.setClearColor(16777215, .5), P.clear(), Fe && Ye.render(n);
			let f = P.toneMapping;
			P.toneMapping = 0;
			let m = r.viewport;
			if (r.viewport !== void 0 && (r.viewport = void 0), j.setupLightsView(r), ke === !0 && qe.setGlobalState(P.clippingPlanes, r), xt(e, n, r), ze.updateMultisampleRenderTarget(a), ze.updateRenderTargetMipmap(a), Re.has("WEBGL_multisampled_render_to_texture") === !1) {
				let e = !1;
				for (let i = 0, a = t.length; i < a; i++) {
					let { object: a, geometry: o, material: s, group: c } = t[i];
					if (s.side === 2 && a.layers.test(r.layers)) {
						let t = s.side;
						s.side = 1, s.needsUpdate = !0, St(a, n, r, o, s, c), s.side = t, s.needsUpdate = !0, e = !0;
					}
				}
				e === !0 && (ze.updateMultisampleRenderTarget(a), ze.updateRenderTargetMipmap(a));
			}
			P.setRenderTarget(s, u, d), P.setClearColor(ye, be), m !== void 0 && (r.viewport = m), P.toneMapping = f;
		}
		function xt(e, t, n) {
			let r = t.isScene === !0 ? t.overrideMaterial : null;
			for (let i = 0, a = e.length; i < a; i++) {
				let a = e[i], { object: o, geometry: s, group: c } = a, l = a.material;
				l.allowOverride === !0 && r !== null && (l = r), o.layers.test(n.layers) && St(o, t, n, s, l, c);
			}
		}
		function St(e, t, n, r, i, a) {
			F !== null && i.isNodeMaterial && F.setObject(e, i), e.onBeforeRender(P, t, n, r, i, a), e.modelViewMatrix.multiplyMatrices(n.matrixWorldInverse, e.matrixWorld), e.normalMatrix.getNormalMatrix(e.modelViewMatrix), i.onBeforeRender(P, t, n, r, e, a), i.transparent === !0 && i.side === 2 && i.forceSinglePass === !1 ? (i.side = 1, i.needsUpdate = !0, P.renderBufferDirect(n, t, r, i, e, a), i.side = 0, i.needsUpdate = !0, P.renderBufferDirect(n, t, r, i, e, a), i.side = 2) : P.renderBufferDirect(n, t, r, i, e, a), e.onAfterRender(P, t, n, r, i, a);
		}
		function Ct(e, t, n) {
			t.isScene !== !0 && (t = Pe);
			let r = U.get(e), i = j.state.lights, a = j.state.shadowsArray, o = i.state.version, s = Ue.getParameters(e, i.state, a, t, n, j.state.lightProbeGridArray), c = Ue.getProgramCacheKey(s), l = r.programs;
			r.environment = e.isMeshStandardMaterial || e.isMeshLambertMaterial || e.isMeshPhongMaterial ? t.environment : null, r.fog = t.fog;
			let u = e.isMeshStandardMaterial || e.isMeshLambertMaterial && !e.envMap || e.isMeshPhongMaterial && !e.envMap;
			r.envMap = Be.get(e.envMap || r.environment, u), r.envMapRotation = r.environment !== null && e.envMap === null ? t.environmentRotation : e.envMapRotation, l === void 0 && (e.addEventListener("dispose", lt), l = /* @__PURE__ */ new Map(), r.programs = l);
			let d = l.get(c);
			if (d !== void 0) {
				if (r.currentProgram === d && r.lightsStateVersion === o) return Tt(e, s), d;
			} else s.uniforms = Ue.getUniforms(e), F !== null && e.isNodeMaterial && F.build(e, n, s), e.onBeforeCompile(s, P), d = Ue.acquireProgram(s, c), l.set(c, d), r.uniforms = s.uniforms;
			let f = r.uniforms;
			return (!e.isShaderMaterial && !e.isRawShaderMaterial || e.clipping === !0) && (f.clippingPlanes = qe.uniform), Tt(e, s), r.needsLights = kt(e), r.lightsStateVersion = o, r.needsLights && (f.ambientLightColor.value = i.state.ambient, f.lightProbe.value = i.state.probe, f.sunLights.value = i.state.sun, f.sunLightShadows.value = i.state.sunShadow, f.directionalLights.value = i.state.directional, f.directionalLightShadows.value = i.state.directionalShadow, f.spotLights.value = i.state.spot, f.spotLightShadows.value = i.state.spotShadow, f.rectAreaLights.value = i.state.rectArea, f.ltc_1.value = i.state.rectAreaLTC1, f.ltc_2.value = i.state.rectAreaLTC2, f.pointLights.value = i.state.point, f.pointLightShadows.value = i.state.pointShadow, f.hemisphereLights.value = i.state.hemi, f.sunShadowMatrix.value = i.state.sunShadowMatrix, f.sunShadowCascade.value = i.state.sunShadowCascade, f.directionalShadowMatrix.value = i.state.directionalShadowMatrix, f.spotLightMatrix.value = i.state.spotLightMatrix, f.spotLightMap.value = i.state.spotLightMap, f.pointShadowMatrix.value = i.state.pointShadowMatrix), r.lightProbeGrid = j.state.lightProbeGridArray.length > 0, r.currentProgram = d, r.uniformsList = null, d;
		}
		function wt(e) {
			if (e.uniformsList === null) {
				let t = e.currentProgram.getUniforms();
				e.uniformsList = rc.seqWithValue(t.seq, e.uniforms);
			}
			return e.uniformsList;
		}
		function Tt(e, t) {
			let n = U.get(e);
			n.outputColorSpace = t.outputColorSpace, n.batching = t.batching, n.batchingColor = t.batchingColor, n.instancing = t.instancing, n.instancingColor = t.instancingColor, n.instancingMorph = t.instancingMorph, n.skinning = t.skinning, n.morphTargets = t.morphTargets, n.morphNormals = t.morphNormals, n.morphColors = t.morphColors, n.morphTargetsCount = t.morphTargetsCount, n.numClippingPlanes = t.numClippingPlanes, n.numIntersection = t.numClipIntersection, n.vertexAlphas = t.vertexAlphas, n.vertexTangents = t.vertexTangents, n.toneMapping = t.toneMapping;
		}
		function Et(e, t) {
			if (e.length === 0) return null;
			if (e.length === 1) return e[0].texture === null ? null : e[0];
			k.setFromMatrixPosition(t.matrixWorld);
			for (let t = 0, n = e.length; t < n; t++) {
				let n = e[t];
				if (n.texture !== null && n.boundingBox.containsPoint(k)) return n;
			}
			return null;
		}
		function Dt(e, t, n, r, i) {
			t.isScene !== !0 && (t = Pe), ze.resetTextureUnits();
			let a = t.fog, o = r.isMeshStandardMaterial || r.isMeshLambertMaterial || r.isMeshPhongMaterial ? t.environment : null, s = fe === null ? P.outputColorSpace : fe.isXRRenderTarget === !0 ? fe.texture.colorSpace : K.workingColorSpace, c = r.isMeshStandardMaterial || r.isMeshLambertMaterial && !r.envMap || r.isMeshPhongMaterial && !r.envMap, l = Be.get(r.envMap || o, c), u = r.vertexColors === !0 && !!n.attributes.color && n.attributes.color.itemSize === 4, d = !!n.attributes.tangent && (!!r.normalMap || r.anisotropy > 0), f = !!n.morphAttributes.position, p = !!n.morphAttributes.normal, m = !!n.morphAttributes.color, h = 0;
			r.toneMapped && (fe === null || fe.isXRRenderTarget === !0) && (h = P.toneMapping);
			let g = n.morphAttributes.position || n.morphAttributes.normal || n.morphAttributes.color, _ = g === void 0 ? 0 : g.length, v = U.get(r), y = j.state.lights;
			if (ke === !0 && (Ae === !0 || e !== he)) {
				let t = e === he && r.id === me;
				qe.setState(r, e, t);
			}
			let b = !1;
			r.version === v.__version ? v.needsLights && v.lightsStateVersion !== y.state.version ? b = !0 : v.outputColorSpace === s ? i.isBatchedMesh && v.batching === !1 || !i.isBatchedMesh && v.batching === !0 || i.isBatchedMesh && v.batchingColor === !0 && i._colorsTexture === null || i.isBatchedMesh && v.batchingColor === !1 && i._colorsTexture !== null || i.isInstancedMesh && v.instancing === !1 || !i.isInstancedMesh && v.instancing === !0 || i.isSkinnedMesh && v.skinning === !1 || !i.isSkinnedMesh && v.skinning === !0 || i.isInstancedMesh && v.instancingColor === !0 && i.instanceColor === null || i.isInstancedMesh && v.instancingColor === !1 && i.instanceColor !== null || i.isInstancedMesh && v.instancingMorph === !0 && i.morphTexture === null || i.isInstancedMesh && v.instancingMorph === !1 && i.morphTexture !== null ? b = !0 : v.envMap === l ? r.fog === !0 && v.fog !== a || v.numClippingPlanes !== void 0 && (v.numClippingPlanes !== qe.numPlanes || v.numIntersection !== qe.numIntersection) ? b = !0 : v.vertexAlphas === u && v.vertexTangents === d && v.morphTargets === f && v.morphNormals === p && v.morphColors === m && v.toneMapping === h && v.morphTargetsCount === _ ? !!v.lightProbeGrid != j.state.lightProbeGridArray.length > 0 && (b = !0) : b = !0 : b = !0 : b = !0 : (b = !0, v.__version = r.version);
			let x = v.currentProgram;
			b === !0 && (x = Ct(r, t, i), F && r.isNodeMaterial && F.onUpdateProgram(r, x, v));
			let S = !1, C = !1, w = !1, T = x.getUniforms(), E = v.uniforms;
			if (V.useProgram(x.program) && (S = !0, C = !0, w = !0), r.id !== me && (me = r.id, C = !0), v.needsLights) {
				let e = Et(j.state.lightProbeGridArray, i);
				v.lightProbeGrid !== e && (v.lightProbeGrid = e, C = !0);
			}
			if (S || he !== e) {
				V.buffers.depth.getReversed() && e.reversedDepth !== !0 && (e._reversedDepth = !0, e.updateProjectionMatrix()), T.setValue(z, "projectionMatrix", e.projectionMatrix), T.setValue(z, "viewMatrix", e.matrixWorldInverse);
				let t = T.map.cameraPosition;
				t !== void 0 && t.setValue(z, Me.setFromMatrixPosition(e.matrixWorld)), B.logarithmicDepthBuffer && T.setValue(z, "logDepthBufFC", 2 / (Math.log(e.far + 1) / Math.LN2)), (r.isMeshPhongMaterial || r.isMeshToonMaterial || r.isMeshLambertMaterial || r.isMeshBasicMaterial || r.isMeshStandardMaterial || r.isShaderMaterial) && T.setValue(z, "isOrthographic", e.isOrthographicCamera === !0), he !== e && (he = e, C = !0, w = !0);
			}
			if (v.needsLights && (y.state.sunShadowMap.length > 0 && T.setValue(z, "sunShadowMap", y.state.sunShadowMap, ze), y.state.directionalShadowMap.length > 0 && T.setValue(z, "directionalShadowMap", y.state.directionalShadowMap, ze), y.state.spotShadowMap.length > 0 && T.setValue(z, "spotShadowMap", y.state.spotShadowMap, ze), y.state.pointShadowMap.length > 0 && T.setValue(z, "pointShadowMap", y.state.pointShadowMap, ze)), i.isSkinnedMesh) {
				T.setOptional(z, i, "bindMatrix"), T.setOptional(z, i, "bindMatrixInverse");
				let e = i.skeleton;
				e && (e.boneTexture === null && e.computeBoneTexture(), T.setValue(z, "boneTexture", e.boneTexture, ze));
			}
			i.isBatchedMesh && (T.setOptional(z, i, "batchingTexture"), T.setValue(z, "batchingTexture", i._matricesTexture, ze), T.setOptional(z, i, "batchingIdTexture"), T.setValue(z, "batchingIdTexture", i._indirectTexture, ze), T.setOptional(z, i, "batchingColorTexture"), i._colorsTexture !== null && T.setValue(z, "batchingColorTexture", i._colorsTexture, ze));
			let D = n.morphAttributes;
			if ((D.position !== void 0 || D.normal !== void 0 || D.color !== void 0) && Xe.update(i, n, x), (C || v.receiveShadow !== i.receiveShadow) && (v.receiveShadow = i.receiveShadow, T.setValue(z, "receiveShadow", i.receiveShadow)), (r.isMeshStandardMaterial || r.isMeshLambertMaterial || r.isMeshPhongMaterial) && r.envMap === null && t.environment !== null && (E.envMapIntensity.value = t.environmentIntensity), E.dfgLUT !== void 0 && (E.dfgLUT.value = wl()), C) {
				if (T.setValue(z, "toneMappingExposure", P.toneMappingExposure), v.needsLights && Ot(E, w), a && r.fog === !0 && We.refreshFogUniforms(E, a), We.refreshMaterialUniforms(E, r, Se, xe, j.state.transmissionRenderTarget[e.id]), v.needsLights && v.lightProbeGrid) {
					let e = v.lightProbeGrid;
					E.probesSH.value = e.texture, E.probesMin.value.copy(e.boundingBox.min), E.probesMax.value.copy(e.boundingBox.max), E.probesResolution.value.copy(e.resolution);
				}
				rc.upload(z, wt(v), E, ze);
			}
			if (r.isShaderMaterial && r.uniformsNeedUpdate === !0 && (rc.upload(z, wt(v), E, ze), r.uniformsNeedUpdate = !1), r.isSpriteMaterial && T.setValue(z, "center", i.center), T.setValue(z, "modelViewMatrix", i.modelViewMatrix), T.setValue(z, "normalMatrix", i.normalMatrix), T.setValue(z, "modelMatrix", i.matrixWorld), r.uniformsGroups !== void 0) {
				let e = r.uniformsGroups;
				for (let t = 0, n = e.length; t < n; t++) {
					let n = e[t];
					nt.update(n, x), nt.bind(n, x);
				}
			}
			return x;
		}
		function Ot(e, t) {
			e.ambientLightColor.needsUpdate = t, e.lightProbe.needsUpdate = t, e.sunLights.needsUpdate = t, e.sunLightShadows.needsUpdate = t, e.directionalLights.needsUpdate = t, e.directionalLightShadows.needsUpdate = t, e.pointLights.needsUpdate = t, e.pointLightShadows.needsUpdate = t, e.spotLights.needsUpdate = t, e.spotLightShadows.needsUpdate = t, e.rectAreaLights.needsUpdate = t, e.hemisphereLights.needsUpdate = t;
		}
		function kt(e) {
			return e.isMeshLambertMaterial || e.isMeshToonMaterial || e.isMeshPhongMaterial || e.isMeshStandardMaterial || e.isShadowMaterial || e.isShaderMaterial && e.lights === !0;
		}
		this.getActiveCubeFace = function() {
			return le;
		}, this.getActiveMipmapLevel = function() {
			return de;
		}, this.getRenderTarget = function() {
			return fe;
		}, this.setRenderTargetTextures = function(e, t, n) {
			let r = U.get(e);
			r.__autoAllocateDepthBuffer = e.resolveDepthBuffer === !1, r.__autoAllocateDepthBuffer === !1 && (r.__useRenderToTexture = !1), U.get(e.texture).__webglTexture = t, U.get(e.depthTexture).__webglTexture = r.__autoAllocateDepthBuffer ? void 0 : n, r.__hasExternalTextures = !0;
		}, this.setRenderTargetFramebuffer = function(e, t) {
			let n = U.get(e);
			n.__webglFramebuffer = t, n.__useDefaultFramebuffer = t === void 0;
		}, this.setRenderTarget = function(e, t = 0, n = 0) {
			fe = e, le = t, de = n;
			let r = null, i = !1, a = !1;
			if (e) {
				let o = U.get(e);
				if (o.__useDefaultFramebuffer !== void 0) {
					V.bindFramebuffer(z.FRAMEBUFFER, o.__webglFramebuffer), ge.copy(e.viewport), _e.copy(e.scissor), ve = e.scissorTest, V.viewport(ge), V.scissor(_e), V.setScissorTest(ve), me = -1;
					return;
				}
				if (o.__webglFramebuffer === void 0) ze.setupRenderTarget(e);
				else if (o.__hasExternalTextures) ze.rebindTextures(e, U.get(e.texture).__webglTexture, U.get(e.depthTexture).__webglTexture);
				else if (e.depthBuffer) {
					let t = e.depthTexture;
					if (o.__boundDepthTexture !== t) {
						if (t !== null && U.has(t) && (e.width !== t.image.width || e.height !== t.image.height)) throw Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");
						ze.setupDepthRenderbuffer(e);
					}
				}
				let s = e.texture;
				(s.isData3DTexture || s.isDataArrayTexture || s.isCompressedArrayTexture) && (a = !0);
				let c = U.get(e).__webglFramebuffer;
				e.isWebGLCubeRenderTarget ? (r = Array.isArray(c[t]) ? c[t][n] : c[t], i = !0) : r = e.samples > 0 && ze.useMultisampledRTT(e) === !1 ? U.get(e).__webglMultisampledFramebuffer : Array.isArray(c) ? c[n] : c, ge.copy(e.viewport), _e.copy(e.scissor), ve = e.scissorTest;
			} else ge.copy(Te).multiplyScalar(Se).floor(), _e.copy(Ee).multiplyScalar(Se).floor(), ve = De;
			if (n !== 0 && (r = ae), V.bindFramebuffer(z.FRAMEBUFFER, r) && V.drawBuffers(e, r), V.viewport(ge), V.scissor(_e), V.setScissorTest(ve), i) {
				let r = U.get(e.texture);
				z.framebufferTexture2D(z.FRAMEBUFFER, z.COLOR_ATTACHMENT0, z.TEXTURE_CUBE_MAP_POSITIVE_X + t, r.__webglTexture, n);
			} else if (a) {
				let r = t;
				for (let t = 0; t < e.textures.length; t++) {
					let i = U.get(e.textures[t]);
					z.framebufferTextureLayer(z.FRAMEBUFFER, z.COLOR_ATTACHMENT0 + t, i.__webglTexture, n, r);
				}
			} else if (e !== null && n !== 0) {
				let t = U.get(e.texture);
				z.framebufferTexture2D(z.FRAMEBUFFER, z.COLOR_ATTACHMENT0, z.TEXTURE_2D, t.__webglTexture, n);
			}
			me = -1;
		};
		function At(e) {
			let t = U.get(e);
			return (t.__readFormat !== e.format || t.__readType !== e.type) && (t.__readFormat = e.format, t.__readType = e.type, t.__formatReadable = B.textureFormatReadable(e.format), t.__typeReadable = B.textureTypeReadable(e.type)), t;
		}
		this.readRenderTargetPixels = function(e, t, n, r, i, a, o, s = 0) {
			if (!(e && e.isWebGLRenderTarget)) {
				L("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");
				return;
			}
			let c = U.get(e).__webglFramebuffer;
			if (e.isWebGLCubeRenderTarget && o !== void 0 && (c = c[o]), c) {
				V.bindFramebuffer(z.FRAMEBUFFER, c);
				try {
					let o = e.textures[s], c = o.format, l = o.type;
					e.textures.length > 1 && z.readBuffer(z.COLOR_ATTACHMENT0 + s);
					let u = At(o);
					if (u.__formatReadable === !1) {
						L("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");
						return;
					}
					if (u.__typeReadable === !1) {
						L("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");
						return;
					}
					t >= 0 && t <= e.width - r && n >= 0 && n <= e.height - i && z.readPixels(t, n, r, i, $e.convert(c), $e.convert(l), a);
				} finally {
					let e = fe === null ? null : U.get(fe).__webglFramebuffer;
					V.bindFramebuffer(z.FRAMEBUFFER, e);
				}
			}
		}, this.readRenderTargetPixelsAsync = async function(e, t, n, r, i, a, o, s = 0) {
			if (!(e && e.isWebGLRenderTarget)) throw Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");
			let c = U.get(e).__webglFramebuffer;
			if (e.isWebGLCubeRenderTarget && o !== void 0 && (c = c[o]), c) {
				if (t >= 0 && t <= e.width - r && n >= 0 && n <= e.height - i) {
					V.bindFramebuffer(z.FRAMEBUFFER, c);
					let o = e.textures[s], l = o.format, u = o.type;
					e.textures.length > 1 && z.readBuffer(z.COLOR_ATTACHMENT0 + s);
					let d = At(o);
					if (d.__formatReadable === !1) throw Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");
					if (d.__typeReadable === !1) throw Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");
					let f = z.createBuffer();
					z.bindBuffer(z.PIXEL_PACK_BUFFER, f), z.bufferData(z.PIXEL_PACK_BUFFER, a.byteLength, z.STREAM_READ), z.readPixels(t, n, r, i, $e.convert(l), $e.convert(u), 0), z.bindBuffer(z.PIXEL_PACK_BUFFER, null);
					let p = fe === null ? null : U.get(fe).__webglFramebuffer;
					V.bindFramebuffer(z.FRAMEBUFFER, p);
					let m = z.fenceSync(z.SYNC_GPU_COMMANDS_COMPLETE, 0);
					return z.flush(), await pe(z, m, 4), z.bindBuffer(z.PIXEL_PACK_BUFFER, f), z.getBufferSubData(z.PIXEL_PACK_BUFFER, 0, a), z.bindBuffer(z.PIXEL_PACK_BUFFER, null), z.deleteBuffer(f), z.deleteSync(m), a;
				}
				throw Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.");
			}
		}, this.copyFramebufferToTexture = function(e, t = null, n = 0) {
			let r = 2 ** -n, i = Math.floor(e.image.width * r), a = Math.floor(e.image.height * r), o = t === null ? 0 : t.x, s = t === null ? 0 : t.y;
			ze.setTexture2D(e, 0), z.copyTexSubImage2D(z.TEXTURE_2D, n, 0, 0, o, s, i, a), V.unbindTexture();
		}, this.copyTextureToTexture = function(e, t, n = null, r = null, i = 0, a = 0) {
			let o, s, c, l, u, d, f, p, m, h = e.isCompressedTexture ? e.mipmaps[a] : e.image;
			if (n !== null) o = n.max.x - n.min.x, s = n.max.y - n.min.y, c = n.isBox3 ? n.max.z - n.min.z : 1, l = n.min.x, u = n.min.y, d = n.isBox3 ? n.min.z : 0;
			else {
				let t = 2 ** -i;
				o = Math.floor(h.width * t), s = Math.floor(h.height * t), c = e.isDataArrayTexture ? h.depth : e.isData3DTexture ? Math.floor(h.depth * t) : 1, l = 0, u = 0, d = 0;
			}
			r === null ? (f = 0, p = 0, m = 0) : (f = r.x, p = r.y, m = r.z);
			let g = $e.convert(t.format), _ = $e.convert(t.type), v;
			t.isData3DTexture ? (ze.setTexture3D(t, 0), v = z.TEXTURE_3D) : t.isDataArrayTexture || t.isCompressedArrayTexture ? (ze.setTexture2DArray(t, 0), v = z.TEXTURE_2D_ARRAY) : (ze.setTexture2D(t, 0), v = z.TEXTURE_2D), V.activeTexture(z.TEXTURE0), V.pixelStorei(z.UNPACK_FLIP_Y_WEBGL, t.flipY), V.pixelStorei(z.UNPACK_PREMULTIPLY_ALPHA_WEBGL, t.premultiplyAlpha), V.pixelStorei(z.UNPACK_ALIGNMENT, t.unpackAlignment);
			let y = V.getParameter(z.UNPACK_ROW_LENGTH), b = V.getParameter(z.UNPACK_IMAGE_HEIGHT), x = V.getParameter(z.UNPACK_SKIP_PIXELS), S = V.getParameter(z.UNPACK_SKIP_ROWS), C = V.getParameter(z.UNPACK_SKIP_IMAGES);
			V.pixelStorei(z.UNPACK_ROW_LENGTH, h.width), V.pixelStorei(z.UNPACK_IMAGE_HEIGHT, h.height), V.pixelStorei(z.UNPACK_SKIP_PIXELS, l), V.pixelStorei(z.UNPACK_SKIP_ROWS, u), V.pixelStorei(z.UNPACK_SKIP_IMAGES, d);
			let w = e.isDataArrayTexture || e.isData3DTexture, T = t.isDataArrayTexture || t.isData3DTexture;
			if (e.isDepthTexture) {
				let n = U.get(e), r = U.get(t), h = U.get(n.__renderTarget), g = U.get(r.__renderTarget);
				V.bindFramebuffer(z.READ_FRAMEBUFFER, h.__webglFramebuffer), V.bindFramebuffer(z.DRAW_FRAMEBUFFER, g.__webglFramebuffer);
				for (let n = 0; n < c; n++) w && (z.framebufferTextureLayer(z.READ_FRAMEBUFFER, z.COLOR_ATTACHMENT0, U.get(e).__webglTexture, i, d + n), z.framebufferTextureLayer(z.DRAW_FRAMEBUFFER, z.COLOR_ATTACHMENT0, U.get(t).__webglTexture, a, m + n)), z.blitFramebuffer(l, u, o, s, f, p, o, s, z.DEPTH_BUFFER_BIT, z.NEAREST);
				V.bindFramebuffer(z.READ_FRAMEBUFFER, null), V.bindFramebuffer(z.DRAW_FRAMEBUFFER, null);
			} else if (i !== 0 || e.isRenderTargetTexture || U.has(e)) {
				let n = U.get(e), r = U.get(t);
				V.bindFramebuffer(z.READ_FRAMEBUFFER, oe), V.bindFramebuffer(z.DRAW_FRAMEBUFFER, se);
				for (let e = 0; e < c; e++) w ? z.framebufferTextureLayer(z.READ_FRAMEBUFFER, z.COLOR_ATTACHMENT0, n.__webglTexture, i, d + e) : z.framebufferTexture2D(z.READ_FRAMEBUFFER, z.COLOR_ATTACHMENT0, z.TEXTURE_2D, n.__webglTexture, i), T ? z.framebufferTextureLayer(z.DRAW_FRAMEBUFFER, z.COLOR_ATTACHMENT0, r.__webglTexture, a, m + e) : z.framebufferTexture2D(z.DRAW_FRAMEBUFFER, z.COLOR_ATTACHMENT0, z.TEXTURE_2D, r.__webglTexture, a), i === 0 ? T ? z.copyTexSubImage3D(v, a, f, p, m + e, l, u, o, s) : z.copyTexSubImage2D(v, a, f, p, l, u, o, s) : z.blitFramebuffer(l, u, o, s, f, p, o, s, z.COLOR_BUFFER_BIT, z.NEAREST);
				V.bindFramebuffer(z.READ_FRAMEBUFFER, null), V.bindFramebuffer(z.DRAW_FRAMEBUFFER, null);
			} else T ? e.isDataTexture || e.isData3DTexture ? z.texSubImage3D(v, a, f, p, m, o, s, c, g, _, h.data) : t.isCompressedArrayTexture ? z.compressedTexSubImage3D(v, a, f, p, m, o, s, c, g, h.data) : z.texSubImage3D(v, a, f, p, m, o, s, c, g, _, h) : e.isDataTexture ? z.texSubImage2D(z.TEXTURE_2D, a, f, p, o, s, g, _, h.data) : e.isCompressedTexture ? z.compressedTexSubImage2D(z.TEXTURE_2D, a, f, p, h.width, h.height, g, h.data) : z.texSubImage2D(z.TEXTURE_2D, a, f, p, o, s, g, _, h);
			V.pixelStorei(z.UNPACK_ROW_LENGTH, y), V.pixelStorei(z.UNPACK_IMAGE_HEIGHT, b), V.pixelStorei(z.UNPACK_SKIP_PIXELS, x), V.pixelStorei(z.UNPACK_SKIP_ROWS, S), V.pixelStorei(z.UNPACK_SKIP_IMAGES, C), a === 0 && t.generateMipmaps && z.generateMipmap(v), V.unbindTexture();
		}, this.initRenderTarget = function(e) {
			U.get(e).__webglFramebuffer === void 0 && ze.setupRenderTarget(e);
		}, this.initTexture = function(e) {
			e.isCubeTexture ? ze.setTextureCube(e, 0) : e.isData3DTexture ? ze.setTexture3D(e, 0) : e.isDataArrayTexture || e.isCompressedArrayTexture ? ze.setTexture2DArray(e, 0) : ze.setTexture2D(e, 0), V.unbindTexture();
		}, this.resetState = function() {
			le = 0, de = 0, fe = null, V.reset(), et.reset();
		}, typeof __THREE_DEVTOOLS__ < "u" && __THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe", { detail: this }));
	}
	get coordinateSystem() {
		return ie;
	}
	get outputColorSpace() {
		return this._outputColorSpace;
	}
	set outputColorSpace(e) {
		this._outputColorSpace = e;
		let t = this.getContext();
		t.drawingBufferColorSpace = K._getDrawingBufferColorSpace(e), t.unpackColorSpace = K._getUnpackColorSpace();
	}
}, El = "/room/assets/minecraft/block/", Dl = "/room/assets/minecraft/environment/", Ol = {
	floor: {
		texture: "oak_planks",
		note: "地板主格"
	},
	floorAlt: {
		texture: "spruce_planks",
		note: "地板交错格"
	},
	wall: {
		texture: "calcite",
		note: "墙面（暖白）"
	},
	wallPink: {
		texture: "pink_wool",
		note: "墙面粉色装饰板 / 地毯中心"
	},
	trim: {
		texture: "stripped_oak_log",
		note: "踢脚线"
	},
	wood: {
		texture: "oak_planks",
		note: "床架 / 柜体 / 窗框"
	},
	woodLight: {
		texture: "birch_planks",
		note: "桌面 / 床头柜 / 柜背板"
	},
	darkWood: {
		texture: "dark_oak_planks",
		note: "桌腿 / 书架隔板 / 底座"
	},
	bookcase: {
		texture: "bookshelf",
		note: "书架主体（原版书架正面自带书脊）"
	},
	cream: {
		texture: "white_wool",
		note: "床垫 / 海报纸底"
	},
	lampShade: {
		texture: "white_wool",
		note: "台灯灯罩与灯泡（夜里自发光，需与床垫分开）"
	},
	white: {
		texture: "white_concrete",
		note: "枕头 / 键盘按键 / 窗棂"
	},
	pink: {
		texture: "pink_wool",
		note: "地毯 / 椅面 / 花盆"
	},
	pinkDark: {
		texture: "magenta_wool",
		note: "椅背 / 深粉装饰"
	},
	blue: {
		texture: "light_blue_wool",
		note: "床毯"
	},
	blueDark: {
		texture: "blue_wool",
		note: "床毯折边"
	},
	yellow: {
		texture: "yellow_wool",
		note: "台灯底座 / 海报太阳"
	},
	green: {
		texture: "green_wool",
		note: "海报山丘"
	},
	purple: {
		texture: "purple_wool",
		note: "书脊"
	},
	bookRed: {
		texture: "red_wool",
		note: "书脊"
	},
	bookBlue: {
		texture: "blue_wool",
		note: "书脊"
	},
	bookYellow: {
		texture: "yellow_wool",
		note: "书脊"
	},
	black: {
		texture: "black_concrete",
		note: "显示器外壳 / 椅子底盘 / 唱片"
	},
	screen: {
		texture: "gray_concrete",
		note: "键盘底座"
	},
	screenLit: {
		texture: "light_blue_concrete",
		note: "显示器屏幕"
	},
	machine: {
		texture: "light_gray_concrete",
		note: "主机箱体"
	},
	jukeboxSide: {
		texture: "jukebox_side",
		note: "唱片机侧面（原版唱片机）"
	},
	jukeboxTop: {
		texture: "jukebox_top",
		note: "唱片机顶面"
	},
	soil: {
		texture: "dirt",
		note: "花盆泥土"
	},
	leaf: {
		texture: "oak_leaves",
		cutout: !0,
		tint: "#8ed16a",
		note: "植物叶片（镂空 + 染色）"
	},
	greenDark: {
		texture: "oak_leaves",
		cutout: !0,
		tint: "#5e8f43",
		note: "植物茎干/深色叶片（同上）"
	},
	leafOak: {
		texture: "oak_leaves",
		cutout: !0,
		tint: "#8ed16a",
		note: "橡木树叶（灰度贴图 → 染成橡木绿）"
	},
	leafAzalea: {
		texture: "flowering_azalea_leaves",
		cutout: !0,
		note: "盛开的杜鹃花树叶（自带颜色：绿叶 + 紫花）"
	},
	leafCherry: {
		texture: "cherry_leaves",
		cutout: !0,
		note: "樱花树叶（自带颜色：粉色）"
	},
	glass: {
		texture: "glass",
		blend: !0,
		uv: "fit",
		note: "窗户玻璃板（真正需要混合的半透明材质）"
	},
	chain: {
		texture: "chain",
		cutout: !0,
		uv: "fit",
		note: "吊灯链条（镂空）"
	},
	lanternBodySide: {
		texture: "lantern_side",
		uv: "fit",
		note: "灯体四面：玻璃与灯芯"
	},
	lanternBodyEnd: {
		texture: "lantern_body_end",
		uv: "fit",
		note: "灯体上下面（暗面）"
	},
	lanternCapSide: {
		texture: "lantern_cap_side",
		uv: "fit",
		note: "顶盖侧面（灯框）"
	},
	lanternCapTop: {
		texture: "lantern_cap_top",
		uv: "fit",
		note: "顶盖顶面（灯框）"
	},
	lanternBase: {
		texture: "lantern_body_end",
		uv: "fit",
		note: "灯底座"
	},
	screenOff: {
		texture: "screen_off",
		uv: "fit",
		note: "显示器正面：熄屏"
	},
	pillow: {
		texture: "gray_wool",
		note: "床上的枕头（灰色羊毛）"
	}
}, kl = /* @__PURE__ */ new Map();
function Al(t) {
	return t.colorSpace = M, t.magFilter = r, t.minFilter = r, t.generateMipmaps = !1, t.wrapS = e, t.wrapT = e, t.anisotropy = 1, t;
}
function jl(e, t, n = El) {
	let r = n + e;
	if (kl.has(r)) return kl.get(r);
	let i = Al(new la().load(r + ".png", t));
	return i.name = "mc:" + e, kl.set(r, i), i;
}
function Ml(e, t) {
	return jl(e, t, Dl);
}
function Nl(e, t, n, r) {
	let i = jl(e, r).clone();
	return i.repeat.set(1, 1 / n), i.offset.set(0, 1 - (t + 1) / n), i.needsUpdate = !0, i.name = "mc:" + e + "#" + t, i;
}
function Pl(e, { onLoad: t, uv: n, tile: r } = {}) {
	let i = Ol[e];
	if (!i) throw Error("未在素材清单中定义的材质键: " + e);
	let a = new wi({
		map: i.slice ? Nl(i.texture, i.slice[0], i.slice[1], t) : jl(i.texture, t),
		roughness: .94,
		metalness: 0,
		...i.tint ? { color: new J(i.tint) } : {},
		...i.cutout ? {
			transparent: !1,
			alphaTest: .5
		} : {},
		...i.blend ? { transparent: !0 } : {}
	});
	return a.name = "mc-" + e, a.userData.mc = {
		key: e,
		texture: i.texture,
		tile: r ?? i.tile ?? 1,
		uv: n ?? i.uv ?? "tile",
		note: i.note
	}, a;
}
function Fl(e, t, n = {}) {
	let r = Array.isArray(n) ? n : null, [i, a, o] = t, s = [
		[o, a],
		[o, a],
		[i, o],
		[i, o],
		[i, a],
		[i, a]
	], c = e.attributes.uv, l = !1;
	for (let e = 0; e < 6; e++) {
		let t = (r ? r[e] : n) || {}, i = t.tile ?? 1;
		if ((t.uv ?? "tile") === "fit" || i <= 0) continue;
		let a = s[e][0] / i, o = s[e][1] / i;
		for (let t = 0; t < 4; t++) {
			let n = e * 4 + t;
			c.setXY(n, c.getX(n) * a, c.getY(n) * o);
		}
		l = !0;
	}
	return l && (c.needsUpdate = !0), e;
}
function Il({ side: e, top: t, bottom: n, end: r, front: i }, { onLoad: a } = {}) {
	let o = /* @__PURE__ */ new Map(), s = (e) => e ? (o.has(e) || o.set(e, Pl(e, { onLoad: a })), o.get(e)) : null, c = s(e);
	return [
		c,
		c,
		s(t ?? r ?? e),
		s(n ?? r ?? e),
		s(i ?? e),
		c
	];
}
function Ll(e, t) {
	return e.onBeforeCompile = (n) => {
		n.uniforms.mixTexture = { value: t }, n.uniforms.mixAmount = { value: 0 }, n.fragmentShader = n.fragmentShader.replace("#include <common>", "#include <common>\nuniform sampler2D mixTexture;\nuniform float mixAmount;").replace("#include <map_fragment>", "diffuseColor *= mix( texture2D( map, vMapUv ), texture2D( mixTexture, vMapUv ), mixAmount );"), e.userData.mixShader = n;
	}, e.customProgramCacheKey = () => "tex-mix-" + (e.uuid || ""), e;
}
function Rl(e, t) {
	let n = e.userData && e.userData.mixShader;
	n && (n.uniforms.mixAmount.value = t);
}
//#endregion
//#region node_modules/three/examples/jsm/utils/BufferGeometryUtils.js
function zl(e, t) {
	if (t === 0) return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."), e;
	if (t === 2 || t === 1) {
		let n = e.getIndex();
		if (n === null) {
			let t = [], r = e.getAttribute("position");
			if (r !== void 0) {
				for (let e = 0; e < r.count; e++) t.push(e);
				e.setIndex(t), n = e.getIndex();
			} else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."), e;
		}
		let r = n.count - 2, i = [];
		if (t === 2) for (let e = 1; e <= r; e++) i.push(n.getX(0)), i.push(n.getX(e)), i.push(n.getX(e + 1));
		else for (let e = 0; e < r; e++) e % 2 == 0 ? (i.push(n.getX(e)), i.push(n.getX(e + 1)), i.push(n.getX(e + 2))) : (i.push(n.getX(e + 2)), i.push(n.getX(e + 1)), i.push(n.getX(e)));
		return i.length / 3 !== r && console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles."), e.setIndex(i), e.clearGroups(), e;
	}
	return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:", t), e;
}
//#endregion
//#region node_modules/three/examples/jsm/utils/SkeletonUtils.js
function Bl(e) {
	let t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map(), r = e.clone();
	return Vl(e, r, function(e, r) {
		t.set(r, e), n.set(e, r);
	}), r.traverse(function(e) {
		if (!e.isSkinnedMesh) return;
		let r = e, i = t.get(e), a = i.skeleton.bones;
		r.skeleton = i.skeleton.clone(), r.bindMatrix.copy(i.bindMatrix), r.skeleton.bones = a.map(function(e) {
			return n.get(e);
		}), r.bind(r.skeleton, r.bindMatrix);
	}), r;
}
function Vl(e, t, n) {
	n(e, t);
	for (let r = 0; r < e.children.length; r++) Vl(e.children[r], t.children[r], n);
}
//#endregion
//#region node_modules/three/examples/jsm/loaders/GLTFLoader.js
var Hl = class extends ra {
	constructor(e) {
		super(e), this.dracoLoader = null, this.ktx2Loader = null, this.meshoptDecoder = null, this.pluginCallbacks = [], this.register(function(e) {
			return new Yl(e);
		}), this.register(function(e) {
			return new Xl(e);
		}), this.register(function(e) {
			return new au(e);
		}), this.register(function(e) {
			return new ou(e);
		}), this.register(function(e) {
			return new su(e);
		}), this.register(function(e) {
			return new Ql(e);
		}), this.register(function(e) {
			return new $l(e);
		}), this.register(function(e) {
			return new eu(e);
		}), this.register(function(e) {
			return new tu(e);
		}), this.register(function(e) {
			return new Jl(e);
		}), this.register(function(e) {
			return new nu(e);
		}), this.register(function(e) {
			return new Zl(e);
		}), this.register(function(e) {
			return new iu(e);
		}), this.register(function(e) {
			return new ru(e);
		}), this.register(function(e) {
			return new Kl(e);
		}), this.register(function(e) {
			return new cu(e, Gl.EXT_MESHOPT_COMPRESSION);
		}), this.register(function(e) {
			return new cu(e, Gl.KHR_MESHOPT_COMPRESSION);
		}), this.register(function(e) {
			return new lu(e);
		});
	}
	load(e, t, n, r) {
		let i = this, a;
		if (this.resourcePath !== "") a = this.resourcePath;
		else if (this.path !== "") {
			let t = ja.extractUrlBase(e);
			a = ja.resolveURL(t, this.path);
		} else a = ja.extractUrlBase(e);
		this.manager.itemStart(e);
		let o = function(t) {
			r ? r(t) : console.error(t), i.manager.itemError(e), i.manager.itemEnd(e);
		}, s = new oa(this.manager);
		s.setPath(this.path), s.setResponseType("arraybuffer"), s.setRequestHeader(this.requestHeader), s.setWithCredentials(this.withCredentials), s.load(e, function(n) {
			try {
				i.parse(n, a, function(n) {
					t(n), i.manager.itemEnd(e);
				}, o);
			} catch (e) {
				o(e);
			}
		}, n, o);
	}
	setDRACOLoader(e) {
		return this.dracoLoader = e, this;
	}
	setKTX2Loader(e) {
		return this.ktx2Loader = e, this;
	}
	setMeshoptDecoder(e) {
		return this.meshoptDecoder = e, this;
	}
	register(e) {
		return this.pluginCallbacks.indexOf(e) === -1 && this.pluginCallbacks.push(e), this;
	}
	unregister(e) {
		return this.pluginCallbacks.indexOf(e) !== -1 && this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e), 1), this;
	}
	parse(e, t, n, r) {
		let i, a = {}, o = {}, s = new TextDecoder();
		if (typeof e == "string") i = JSON.parse(e);
		else if (e instanceof ArrayBuffer) {
			if (s.decode(new Uint8Array(e, 0, 4)) === uu) {
				try {
					a[Gl.KHR_BINARY_GLTF] = new pu(e);
				} catch (e) {
					r && r(e);
					return;
				}
				i = JSON.parse(a[Gl.KHR_BINARY_GLTF].content);
			} else i = JSON.parse(s.decode(e));
		} else i = e;
		if (i.asset === void 0 || i.asset.version[0] < 2) {
			r && r(/* @__PURE__ */ Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));
			return;
		}
		let c = new zu(i, {
			path: t || this.resourcePath || "",
			crossOrigin: this.crossOrigin,
			requestHeader: this.requestHeader,
			manager: this.manager,
			ktx2Loader: this.ktx2Loader,
			meshoptDecoder: this.meshoptDecoder
		});
		c.fileLoader.setRequestHeader(this.requestHeader);
		for (let e = 0; e < this.pluginCallbacks.length; e++) {
			let t = this.pluginCallbacks[e](c);
			t.name || console.error("THREE.GLTFLoader: Invalid plugin found: missing name"), o[t.name] = t, a[t.name] = !0;
		}
		if (i.extensionsUsed) for (let e = 0; e < i.extensionsUsed.length; ++e) {
			let t = i.extensionsUsed[e], n = i.extensionsRequired || [];
			switch (t) {
				case Gl.KHR_MATERIALS_UNLIT:
					a[t] = new ql();
					break;
				case Gl.KHR_DRACO_MESH_COMPRESSION:
					a[t] = new mu(i, this.dracoLoader);
					break;
				case Gl.KHR_TEXTURE_TRANSFORM:
					a[t] = new hu();
					break;
				case Gl.KHR_MESH_QUANTIZATION:
					a[t] = new gu();
					break;
				default: n.indexOf(t) >= 0 && o[t] === void 0 && console.warn("THREE.GLTFLoader: Unknown extension \"" + t + "\".");
			}
		}
		c.setExtensions(a), c.setPlugins(o), c.parse(n, r);
	}
	parseAsync(e, t) {
		let n = this;
		return new Promise(function(r, i) {
			n.parse(e, t, r, i);
		});
	}
};
function Ul() {
	let e = {};
	return {
		get: function(t) {
			return e[t];
		},
		add: function(t, n) {
			e[t] = n;
		},
		remove: function(t) {
			delete e[t];
		},
		removeAll: function() {
			e = {};
		}
	};
}
function Wl(e, t, n) {
	let r = e.json.materials[t];
	return r.extensions && r.extensions[n] ? r.extensions[n] : null;
}
var Gl = {
	KHR_BINARY_GLTF: "KHR_binary_glTF",
	KHR_DRACO_MESH_COMPRESSION: "KHR_draco_mesh_compression",
	KHR_LIGHTS_PUNCTUAL: "KHR_lights_punctual",
	KHR_MATERIALS_CLEARCOAT: "KHR_materials_clearcoat",
	KHR_MATERIALS_DISPERSION: "KHR_materials_dispersion",
	KHR_MATERIALS_IOR: "KHR_materials_ior",
	KHR_MATERIALS_SHEEN: "KHR_materials_sheen",
	KHR_MATERIALS_SPECULAR: "KHR_materials_specular",
	KHR_MATERIALS_TRANSMISSION: "KHR_materials_transmission",
	KHR_MATERIALS_IRIDESCENCE: "KHR_materials_iridescence",
	KHR_MATERIALS_ANISOTROPY: "KHR_materials_anisotropy",
	KHR_MATERIALS_UNLIT: "KHR_materials_unlit",
	KHR_MATERIALS_VOLUME: "KHR_materials_volume",
	KHR_TEXTURE_BASISU: "KHR_texture_basisu",
	KHR_TEXTURE_TRANSFORM: "KHR_texture_transform",
	KHR_MESH_QUANTIZATION: "KHR_mesh_quantization",
	KHR_MATERIALS_EMISSIVE_STRENGTH: "KHR_materials_emissive_strength",
	EXT_MATERIALS_BUMP: "EXT_materials_bump",
	EXT_TEXTURE_WEBP: "EXT_texture_webp",
	EXT_TEXTURE_AVIF: "EXT_texture_avif",
	EXT_MESHOPT_COMPRESSION: "EXT_meshopt_compression",
	KHR_MESHOPT_COMPRESSION: "KHR_meshopt_compression",
	EXT_MESH_GPU_INSTANCING: "EXT_mesh_gpu_instancing"
}, Kl = class {
	constructor(e) {
		this.parser = e, this.name = Gl.KHR_LIGHTS_PUNCTUAL, this.cache = {
			refs: {},
			uses: {}
		};
	}
	_markDefs() {
		let e = this.parser, t = this.parser.json.nodes || [];
		for (let n = 0, r = t.length; n < r; n++) {
			let r = t[n];
			r.extensions && r.extensions[this.name] && r.extensions[this.name].light !== void 0 && e._addNodeRef(this.cache, r.extensions[this.name].light);
		}
	}
	_loadLight(e) {
		let t = this.parser, n = "light:" + e, r = t.cache.get(n);
		if (r) return r;
		let i = t.json, a = ((i.extensions && i.extensions[this.name] || {}).lights || [])[e], o, s = new J(16777215);
		a.color !== void 0 && s.setRGB(a.color[0], a.color[1], a.color[2], N);
		let c = a.range === void 0 ? 0 : a.range;
		switch (a.type) {
			case "directional":
				o = new Aa(s), o.target.position.set(0, 0, -1), o.add(o.target);
				break;
			case "point":
				o = new Da(s), o.distance = c;
				break;
			case "spot":
				o = new Ta(s), o.distance = c, a.spot = a.spot || {}, a.spot.innerConeAngle = a.spot.innerConeAngle === void 0 ? 0 : a.spot.innerConeAngle, a.spot.outerConeAngle = a.spot.outerConeAngle === void 0 ? Math.PI / 4 : a.spot.outerConeAngle, o.angle = a.spot.outerConeAngle, o.penumbra = 1 - a.spot.innerConeAngle / a.spot.outerConeAngle, o.target.position.set(0, 0, -1), o.add(o.target);
				break;
			default: throw Error("THREE.GLTFLoader: Unexpected light type: " + a.type);
		}
		return o.position.set(0, 0, 0), ju(o, a), a.intensity !== void 0 && (o.intensity = a.intensity), o.name = t.createUniqueName(a.name || "light_" + e), r = Promise.resolve(o), t.cache.add(n, r), r;
	}
	getDependency(e, t) {
		if (e === "light") return this._loadLight(t);
	}
	createNodeAttachment(e) {
		let t = this, n = this.parser, r = n.json.nodes[e], i = (r.extensions && r.extensions[this.name] || {}).light;
		return i === void 0 ? null : this._loadLight(i).then(function(e) {
			return n._getNodeRef(t.cache, i, e);
		});
	}
}, ql = class {
	constructor() {
		this.name = Gl.KHR_MATERIALS_UNLIT;
	}
	getMaterialType() {
		return Qn;
	}
	extendParams(e, t, n) {
		let r = [];
		e.color = new J(1, 1, 1), e.opacity = 1;
		let i = t.pbrMetallicRoughness;
		if (i) {
			if (Array.isArray(i.baseColorFactor)) {
				let t = i.baseColorFactor;
				e.color.setRGB(t[0], t[1], t[2], N), e.opacity = t[3];
			}
			i.baseColorTexture !== void 0 && r.push(n.assignTexture(e, "map", i.baseColorTexture, M));
		}
		return Promise.all(r);
	}
}, Jl = class {
	constructor(e) {
		this.parser = e, this.name = Gl.KHR_MATERIALS_EMISSIVE_STRENGTH;
	}
	extendMaterialParams(e, t) {
		let n = Wl(this.parser, e, this.name);
		return n === null || n.emissiveStrength !== void 0 && (t.emissiveIntensity = n.emissiveStrength), Promise.resolve();
	}
}, Yl = class {
	constructor(e) {
		this.parser = e, this.name = Gl.KHR_MATERIALS_CLEARCOAT;
	}
	getMaterialType(e) {
		return Wl(this.parser, e, this.name) === null ? null : Ti;
	}
	extendMaterialParams(e, t) {
		let n = Wl(this.parser, e, this.name);
		if (n === null) return Promise.resolve();
		let r = [];
		if (n.clearcoatFactor !== void 0 && (t.clearcoat = n.clearcoatFactor), n.clearcoatTexture !== void 0 && r.push(this.parser.assignTexture(t, "clearcoatMap", n.clearcoatTexture)), n.clearcoatRoughnessFactor !== void 0 && (t.clearcoatRoughness = n.clearcoatRoughnessFactor), n.clearcoatRoughnessTexture !== void 0 && r.push(this.parser.assignTexture(t, "clearcoatRoughnessMap", n.clearcoatRoughnessTexture)), n.clearcoatNormalTexture !== void 0 && (r.push(this.parser.assignTexture(t, "clearcoatNormalMap", n.clearcoatNormalTexture)), n.clearcoatNormalTexture.scale !== void 0)) {
			let e = n.clearcoatNormalTexture.scale;
			t.clearcoatNormalScale = new H(e, e);
		}
		return Promise.all(r);
	}
}, Xl = class {
	constructor(e) {
		this.parser = e, this.name = Gl.KHR_MATERIALS_DISPERSION;
	}
	getMaterialType(e) {
		return Wl(this.parser, e, this.name) === null ? null : Ti;
	}
	extendMaterialParams(e, t) {
		let n = Wl(this.parser, e, this.name);
		return n === null || (t.dispersion = n.dispersion === void 0 ? 0 : n.dispersion), Promise.resolve();
	}
}, Zl = class {
	constructor(e) {
		this.parser = e, this.name = Gl.KHR_MATERIALS_IRIDESCENCE;
	}
	getMaterialType(e) {
		return Wl(this.parser, e, this.name) === null ? null : Ti;
	}
	extendMaterialParams(e, t) {
		let n = Wl(this.parser, e, this.name);
		if (n === null) return Promise.resolve();
		let r = [];
		return n.iridescenceFactor !== void 0 && (t.iridescence = n.iridescenceFactor), n.iridescenceTexture !== void 0 && r.push(this.parser.assignTexture(t, "iridescenceMap", n.iridescenceTexture)), n.iridescenceIor !== void 0 && (t.iridescenceIOR = n.iridescenceIor), t.iridescenceThicknessRange === void 0 && (t.iridescenceThicknessRange = [100, 400]), n.iridescenceThicknessMinimum !== void 0 && (t.iridescenceThicknessRange[0] = n.iridescenceThicknessMinimum), n.iridescenceThicknessMaximum !== void 0 && (t.iridescenceThicknessRange[1] = n.iridescenceThicknessMaximum), n.iridescenceThicknessTexture !== void 0 && r.push(this.parser.assignTexture(t, "iridescenceThicknessMap", n.iridescenceThicknessTexture)), Promise.all(r);
	}
}, Ql = class {
	constructor(e) {
		this.parser = e, this.name = Gl.KHR_MATERIALS_SHEEN;
	}
	getMaterialType(e) {
		return Wl(this.parser, e, this.name) === null ? null : Ti;
	}
	extendMaterialParams(e, t) {
		let n = Wl(this.parser, e, this.name);
		if (n === null) return Promise.resolve();
		let r = [];
		if (t.sheenColor = new J(0, 0, 0), t.sheenRoughness = 0, t.sheen = 1, n.sheenColorFactor !== void 0) {
			let e = n.sheenColorFactor;
			t.sheenColor.setRGB(e[0], e[1], e[2], N);
		}
		return n.sheenRoughnessFactor !== void 0 && (t.sheenRoughness = n.sheenRoughnessFactor), n.sheenColorTexture !== void 0 && r.push(this.parser.assignTexture(t, "sheenColorMap", n.sheenColorTexture, M)), n.sheenRoughnessTexture !== void 0 && r.push(this.parser.assignTexture(t, "sheenRoughnessMap", n.sheenRoughnessTexture)), Promise.all(r);
	}
}, $l = class {
	constructor(e) {
		this.parser = e, this.name = Gl.KHR_MATERIALS_TRANSMISSION;
	}
	getMaterialType(e) {
		return Wl(this.parser, e, this.name) === null ? null : Ti;
	}
	extendMaterialParams(e, t) {
		let n = Wl(this.parser, e, this.name);
		if (n === null) return Promise.resolve();
		let r = [];
		return n.transmissionFactor !== void 0 && (t.transmission = n.transmissionFactor), n.transmissionTexture !== void 0 && r.push(this.parser.assignTexture(t, "transmissionMap", n.transmissionTexture)), Promise.all(r);
	}
}, eu = class {
	constructor(e) {
		this.parser = e, this.name = Gl.KHR_MATERIALS_VOLUME;
	}
	getMaterialType(e) {
		return Wl(this.parser, e, this.name) === null ? null : Ti;
	}
	extendMaterialParams(e, t) {
		let n = Wl(this.parser, e, this.name);
		if (n === null) return Promise.resolve();
		let r = [];
		t.thickness = n.thicknessFactor === void 0 ? 0 : n.thicknessFactor, n.thicknessTexture !== void 0 && r.push(this.parser.assignTexture(t, "thicknessMap", n.thicknessTexture)), t.attenuationDistance = n.attenuationDistance || Infinity;
		let i = n.attenuationColor || [
			1,
			1,
			1
		];
		return t.attenuationColor = new J().setRGB(i[0], i[1], i[2], N), Promise.all(r);
	}
}, tu = class {
	constructor(e) {
		this.parser = e, this.name = Gl.KHR_MATERIALS_IOR;
	}
	getMaterialType(e) {
		return Wl(this.parser, e, this.name) === null ? null : Ti;
	}
	extendMaterialParams(e, t) {
		let n = Wl(this.parser, e, this.name);
		return n === null || (t.ior = n.ior === void 0 ? 1.5 : n.ior, t.ior === 0 && (t.ior = 1e3)), Promise.resolve();
	}
}, nu = class {
	constructor(e) {
		this.parser = e, this.name = Gl.KHR_MATERIALS_SPECULAR;
	}
	getMaterialType(e) {
		return Wl(this.parser, e, this.name) === null ? null : Ti;
	}
	extendMaterialParams(e, t) {
		let n = Wl(this.parser, e, this.name);
		if (n === null) return Promise.resolve();
		let r = [];
		t.specularIntensity = n.specularFactor === void 0 ? 1 : n.specularFactor, n.specularTexture !== void 0 && r.push(this.parser.assignTexture(t, "specularIntensityMap", n.specularTexture));
		let i = n.specularColorFactor || [
			1,
			1,
			1
		];
		return t.specularColor = new J().setRGB(i[0], i[1], i[2], N), n.specularColorTexture !== void 0 && r.push(this.parser.assignTexture(t, "specularColorMap", n.specularColorTexture, M)), Promise.all(r);
	}
}, ru = class {
	constructor(e) {
		this.parser = e, this.name = Gl.EXT_MATERIALS_BUMP;
	}
	getMaterialType(e) {
		return Wl(this.parser, e, this.name) === null ? null : Ti;
	}
	extendMaterialParams(e, t) {
		let n = Wl(this.parser, e, this.name);
		if (n === null) return Promise.resolve();
		let r = [];
		return t.bumpScale = n.bumpFactor === void 0 ? 1 : n.bumpFactor, n.bumpTexture !== void 0 && r.push(this.parser.assignTexture(t, "bumpMap", n.bumpTexture)), Promise.all(r);
	}
}, iu = class {
	constructor(e) {
		this.parser = e, this.name = Gl.KHR_MATERIALS_ANISOTROPY;
	}
	getMaterialType(e) {
		return Wl(this.parser, e, this.name) === null ? null : Ti;
	}
	extendMaterialParams(e, t) {
		let n = Wl(this.parser, e, this.name);
		if (n === null) return Promise.resolve();
		let r = [];
		return n.anisotropyStrength !== void 0 && (t.anisotropy = n.anisotropyStrength), n.anisotropyRotation !== void 0 && (t.anisotropyRotation = n.anisotropyRotation), n.anisotropyTexture !== void 0 && r.push(this.parser.assignTexture(t, "anisotropyMap", n.anisotropyTexture)), Promise.all(r);
	}
}, au = class {
	constructor(e) {
		this.parser = e, this.name = Gl.KHR_TEXTURE_BASISU;
	}
	loadTexture(e) {
		let t = this.parser, n = t.json, r = n.textures[e];
		if (!r.extensions || !r.extensions[this.name]) return null;
		let i = r.extensions[this.name], a = t.options.ktx2Loader;
		if (!a) {
			if (n.extensionsRequired && n.extensionsRequired.indexOf(this.name) >= 0) throw Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");
			return null;
		}
		return t.loadTextureImage(e, i.source, a);
	}
}, ou = class {
	constructor(e) {
		this.parser = e, this.name = Gl.EXT_TEXTURE_WEBP;
	}
	loadTexture(e) {
		let t = this.name, n = this.parser, r = n.json, i = r.textures[e];
		if (!i.extensions || !i.extensions[t]) return null;
		let a = i.extensions[t], o = r.images[a.source], s = n.textureLoader;
		if (o.uri) {
			let e = n.options.manager.getHandler(o.uri);
			e !== null && (s = e);
		}
		return n.loadTextureImage(e, a.source, s);
	}
}, su = class {
	constructor(e) {
		this.parser = e, this.name = Gl.EXT_TEXTURE_AVIF;
	}
	loadTexture(e) {
		let t = this.name, n = this.parser, r = n.json, i = r.textures[e];
		if (!i.extensions || !i.extensions[t]) return null;
		let a = i.extensions[t], o = r.images[a.source], s = n.textureLoader;
		if (o.uri) {
			let e = n.options.manager.getHandler(o.uri);
			e !== null && (s = e);
		}
		return n.loadTextureImage(e, a.source, s);
	}
}, cu = class {
	constructor(e, t) {
		this.name = t, this.parser = e;
	}
	loadBufferView(e) {
		let t = this.parser.json, n = t.bufferViews[e];
		if (n.extensions && n.extensions[this.name]) {
			let e = n.extensions[this.name], r = this.parser.getDependency("buffer", e.buffer), i = this.parser.options.meshoptDecoder;
			if (!i || !i.supported) {
				if (t.extensionsRequired && t.extensionsRequired.indexOf(this.name) >= 0) throw Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");
				return null;
			}
			return r.then(function(t) {
				let n = e.byteOffset || 0, r = e.byteLength || 0, a = e.count, o = e.byteStride, s = new Uint8Array(t, n, r);
				return i.decodeGltfBufferAsync ? i.decodeGltfBufferAsync(a, o, s, e.mode, e.filter).then(function(e) {
					return e.buffer;
				}) : i.ready.then(function() {
					let t = new ArrayBuffer(a * o);
					return i.decodeGltfBuffer(new Uint8Array(t), a, o, s, e.mode, e.filter), t;
				});
			});
		}
		return null;
	}
}, lu = class {
	constructor(e) {
		this.name = Gl.EXT_MESH_GPU_INSTANCING, this.parser = e;
	}
	createNodeMesh(e) {
		let t = this.parser.json, n = t.nodes[e];
		if (!n.extensions || !n.extensions[this.name] || n.mesh === void 0) return null;
		let r = t.meshes[n.mesh];
		for (let e of r.primitives) if (e.mode !== bu.TRIANGLES && e.mode !== bu.TRIANGLE_STRIP && e.mode !== bu.TRIANGLE_FAN && e.mode !== void 0) return null;
		let i = n.extensions[this.name].attributes, a = [], o = {};
		for (let e in i) a.push(this.parser.getDependency("accessor", i[e]).then((t) => (o[e] = t, o[e])));
		return a.length < 1 ? null : (a.push(this.parser.createNodeMesh(e)), Promise.all(a).then((e) => {
			let t = e.pop(), n = t.isGroup ? t.children : [t], r = e[0].count, i = [];
			for (let e of n) {
				let t = new q(), n = new W(), a = new U(), s = new W(1, 1, 1), c = new Ir(e.geometry, e.material, r);
				for (let e = 0; e < r; e++) o.TRANSLATION && n.fromBufferAttribute(o.TRANSLATION, e), o.ROTATION && a.fromBufferAttribute(o.ROTATION, e), o.SCALE && s.fromBufferAttribute(o.SCALE, e), c.setMatrixAt(e, t.compose(n, a, s));
				let l = null;
				for (let e in o) if (e === "_COLOR_0") {
					let t = o[e];
					c.instanceColor = new Or(t.array, t.itemSize, t.normalized);
				} else if (e !== "TRANSLATION" && e !== "ROTATION" && e !== "SCALE") {
					if (l === null) {
						let e = c.geometry;
						l = new Ln(), l.name = e.name;
						for (let t in e.attributes) l.setAttribute(t, e.attributes[t]);
						for (let t in e.morphAttributes) l.morphAttributes[t] = e.morphAttributes[t];
						e.index !== null && l.setIndex(e.index), l.morphTargetsRelative = e.morphTargetsRelative;
						for (let t of e.groups) l.addGroup(t.start, t.count, t.materialIndex);
						e.boundingBox !== null && (l.boundingBox = e.boundingBox.clone()), e.boundingSphere !== null && (l.boundingSphere = e.boundingSphere.clone()), l.drawRange.start = e.drawRange.start, l.drawRange.count = e.drawRange.count, l.userData = Object.assign({}, e.userData), c.geometry = l;
					}
					let t = o[e];
					l.setAttribute(e, new Or(t.array, t.itemSize, t.normalized));
				}
				Mt.prototype.copy.call(c, e), this.parser.assignFinalMaterial(c), i.push(c);
			}
			return t.isGroup ? (t.clear(), t.add(...i), t) : i[0];
		}));
	}
}, uu = "glTF", du = 12, fu = {
	JSON: 1313821514,
	BIN: 5130562
}, pu = class {
	constructor(e) {
		this.name = Gl.KHR_BINARY_GLTF, this.content = null, this.body = null;
		let t = new DataView(e, 0, du), n = new TextDecoder();
		if (this.header = {
			magic: n.decode(new Uint8Array(e.slice(0, 4))),
			version: t.getUint32(4, !0),
			length: t.getUint32(8, !0)
		}, this.header.magic !== uu) throw Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");
		if (this.header.version < 2) throw Error("THREE.GLTFLoader: Legacy binary file detected.");
		let r = this.header.length - du, i = new DataView(e, du), a = 0;
		for (; a < r;) {
			let t = i.getUint32(a, !0);
			a += 4;
			let r = i.getUint32(a, !0);
			if (a += 4, r === fu.JSON) {
				let r = new Uint8Array(e, du + a, t);
				this.content = n.decode(r);
			} else if (r === fu.BIN) {
				let n = du + a;
				this.body = e.slice(n, n + t);
			}
			a += t;
		}
		if (this.content === null) throw Error("THREE.GLTFLoader: JSON content not found.");
	}
}, mu = class {
	constructor(e, t) {
		if (!t) throw Error("THREE.GLTFLoader: No DRACOLoader instance provided.");
		this.name = Gl.KHR_DRACO_MESH_COMPRESSION, this.json = e, this.dracoLoader = t, this.dracoLoader.preload();
	}
	decodePrimitive(e, t) {
		let n = this.json, r = this.dracoLoader, i = e.extensions[this.name].bufferView, a = e.extensions[this.name].attributes, o = {}, s = {}, c = {};
		for (let e in a) {
			let t = Tu[e] || e.toLowerCase();
			o[t] = a[e];
		}
		for (let t in e.attributes) {
			let r = Tu[t] || t.toLowerCase();
			if (a[t] !== void 0) {
				let i = n.accessors[e.attributes[t]];
				c[r] = xu[i.componentType].name, s[r] = i.normalized === !0;
			}
		}
		return t.getDependency("bufferView", i).then(function(e) {
			return new Promise(function(t, n) {
				r.decodeDracoFile(e, function(e) {
					for (let t in e.attributes) {
						let n = e.attributes[t], r = s[t];
						r !== void 0 && (n.normalized = r);
					}
					t(e);
				}, o, c, N, n);
			});
		});
	}
}, hu = class {
	constructor() {
		this.name = Gl.KHR_TEXTURE_TRANSFORM;
	}
	extendTexture(e, t) {
		if ((t.texCoord === void 0 || t.texCoord === e.channel) && t.offset === void 0 && t.rotation === void 0 && t.scale === void 0) return e;
		if (e = e.clone(), t.texCoord !== void 0 && (e.channel = t.texCoord), t.offset !== void 0 && e.offset.fromArray(t.offset), t.rotation !== void 0 && (e.rotation = t.rotation), t.scale !== void 0 && e.repeat.fromArray(t.scale), t.rotation !== void 0) {
			let t = Math.cos(e.rotation), n = Math.sin(e.rotation);
			e.matrix.set(e.repeat.x * t, e.repeat.y * n, e.offset.x, -e.repeat.x * n, e.repeat.y * t, e.offset.y, 0, 0, 1), e.matrixAutoUpdate = !1;
		}
		return e.needsUpdate = !0, e;
	}
}, gu = class {
	constructor() {
		this.name = Gl.KHR_MESH_QUANTIZATION;
	}
}, _u = class extends Pi {
	constructor(e, t, n, r) {
		super(e, t, n, r);
	}
	copySampleValue_(e) {
		let t = this.resultBuffer, n = this.sampleValues, r = this.valueSize, i = e * r * 3 + r;
		for (let e = 0; e !== r; e++) t[e] = n[i + e];
		return t;
	}
	interpolate_(e, t, n, r) {
		let i = this.resultBuffer, a = this.sampleValues, o = this.valueSize, s = o * 2, c = o * 3, l = r - t, u = (n - t) / l, d = u * u, f = d * u, p = e * c, m = p - c, h = -2 * f + 3 * d, g = f - d, _ = 1 - h, v = g - d + u;
		for (let e = 0; e !== o; e++) {
			let t = a[m + e + o], n = a[m + e + s] * l, r = a[p + e + o], c = a[p + e] * l;
			i[e] = _ * t + v * n + h * r + g * c;
		}
		return i;
	}
}, vu = new U(), yu = class extends _u {
	interpolate_(e, t, n, r) {
		let i = super.interpolate_(e, t, n, r);
		return vu.fromArray(i).normalize().toArray(i), i;
	}
}, bu = {
	FLOAT: 5126,
	FLOAT_MAT3: 35675,
	FLOAT_MAT4: 35676,
	FLOAT_VEC2: 35664,
	FLOAT_VEC3: 35665,
	FLOAT_VEC4: 35666,
	LINEAR: 9729,
	REPEAT: 10497,
	SAMPLER_2D: 35678,
	POINTS: 0,
	LINES: 1,
	LINE_LOOP: 2,
	LINE_STRIP: 3,
	TRIANGLES: 4,
	TRIANGLE_STRIP: 5,
	TRIANGLE_FAN: 6,
	UNSIGNED_BYTE: 5121,
	UNSIGNED_SHORT: 5123
}, xu = {
	5120: Int8Array,
	5121: Uint8Array,
	5122: Int16Array,
	5123: Uint16Array,
	5125: Uint32Array,
	5126: Float32Array
}, Su = {
	9728: r,
	9729: o,
	9984: i,
	9985: s,
	9986: a,
	9987: c
}, Cu = {
	33071: t,
	33648: n,
	10497: e
}, wu = {
	SCALAR: 1,
	VEC2: 2,
	VEC3: 3,
	VEC4: 4,
	MAT2: 4,
	MAT3: 9,
	MAT4: 16
}, Tu = {
	POSITION: "position",
	NORMAL: "normal",
	TANGENT: "tangent",
	TEXCOORD_0: "uv",
	TEXCOORD_1: "uv1",
	TEXCOORD_2: "uv2",
	TEXCOORD_3: "uv3",
	COLOR_0: "color",
	WEIGHTS_0: "skinWeight",
	JOINTS_0: "skinIndex"
}, Eu = {
	scale: "scale",
	translation: "position",
	rotation: "quaternion",
	weights: "morphTargetInfluences"
}, Du = {
	CUBICSPLINE: void 0,
	LINEAR: D,
	STEP: E
}, Ou = {
	OPAQUE: "OPAQUE",
	MASK: "MASK",
	BLEND: "BLEND"
};
function ku(e) {
	return e.DefaultMaterial === void 0 && (e.DefaultMaterial = new wi({
		color: 16777215,
		emissive: 0,
		metalness: 1,
		roughness: 1,
		transparent: !1,
		depthTest: !0,
		side: 0
	})), e.DefaultMaterial;
}
function Au(e, t, n) {
	for (let r in n.extensions) e[r] === void 0 && (t.userData.gltfExtensions = t.userData.gltfExtensions || {}, t.userData.gltfExtensions[r] = n.extensions[r]);
}
function ju(e, t) {
	t.extras !== void 0 && (typeof t.extras == "object" ? Object.assign(e.userData, t.extras) : console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, " + t.extras));
}
function Mu(e, t, n) {
	let r = !1, i = !1, a = !1;
	for (let e = 0, n = t.length; e < n; e++) {
		let n = t[e];
		if (n.POSITION !== void 0 && (r = !0), n.NORMAL !== void 0 && (i = !0), n.COLOR_0 !== void 0 && (a = !0), r && i && a) break;
	}
	if (!r && !i && !a) return Promise.resolve(e);
	let o = [], s = [], c = [];
	for (let l = 0, u = t.length; l < u; l++) {
		let u = t[l];
		if (r) {
			let t = u.POSITION === void 0 ? e.attributes.position : n.getDependency("accessor", u.POSITION);
			o.push(t);
		}
		if (i) {
			let t = u.NORMAL === void 0 ? e.attributes.normal : n.getDependency("accessor", u.NORMAL);
			s.push(t);
		}
		if (a) {
			let t = u.COLOR_0 === void 0 ? e.attributes.color : n.getDependency("accessor", u.COLOR_0);
			c.push(t);
		}
	}
	return Promise.all([
		Promise.all(o),
		Promise.all(s),
		Promise.all(c)
	]).then(function(t) {
		let n = t[0], o = t[1], s = t[2];
		return r && (e.morphAttributes.position = n), i && (e.morphAttributes.normal = o), a && (e.morphAttributes.color = s), e.morphTargetsRelative = !0, e;
	});
}
function Nu(e, t) {
	if (e.updateMorphTargets(), t.weights !== void 0) for (let n = 0, r = t.weights.length; n < r; n++) e.morphTargetInfluences[n] = t.weights[n];
	if (t.extras && Array.isArray(t.extras.targetNames)) {
		let n = t.extras.targetNames;
		if (e.morphTargetInfluences.length === n.length) {
			e.morphTargetDictionary = {};
			for (let t = 0, r = n.length; t < r; t++) e.morphTargetDictionary[n[t]] = t;
		} else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.");
	}
}
function Pu(e) {
	let t, n = e.extensions && e.extensions[Gl.KHR_DRACO_MESH_COMPRESSION];
	if (t = n ? "draco:" + n.bufferView + ":" + n.indices + ":" + Fu(n.attributes) : e.indices + ":" + Fu(e.attributes) + ":" + e.mode, e.targets !== void 0) for (let n = 0, r = e.targets.length; n < r; n++) t += ":" + Fu(e.targets[n]);
	return t;
}
function Fu(e) {
	let t = "", n = Object.keys(e).sort();
	for (let r = 0, i = n.length; r < i; r++) t += n[r] + ":" + e[n[r]] + ";";
	return t;
}
function Iu(e) {
	switch (e) {
		case Int8Array: return 1 / 127;
		case Uint8Array: return 1 / 255;
		case Int16Array: return 1 / 32767;
		case Uint16Array: return 1 / 65535;
		default: throw Error("THREE.GLTFLoader: Unsupported normalized accessor component type.");
	}
}
function Lu(e) {
	return e.search(/\.jpe?g($|\?)/i) > 0 || e.search(/^data\:image\/jpeg/) === 0 ? "image/jpeg" : e.search(/\.webp($|\?)/i) > 0 || e.search(/^data\:image\/webp/) === 0 ? "image/webp" : e.search(/\.ktx2($|\?)/i) > 0 || e.search(/^data\:image\/ktx2/) === 0 ? "image/ktx2" : "image/png";
}
var Ru = new q(), zu = class {
	constructor(e = {}, t = {}) {
		this.json = e, this.extensions = {}, this.plugins = {}, this.options = t, this.cache = new Ul(), this.associations = /* @__PURE__ */ new Map(), this.primitiveCache = {}, this.nodeCache = {}, this.meshCache = {
			refs: {},
			uses: {}
		}, this.cameraCache = {
			refs: {},
			uses: {}
		}, this.lightCache = {
			refs: {},
			uses: {}
		}, this.sourceCache = {}, this.textureCache = {}, this.nodeNamesUsed = {};
		let n = !1, r = -1, i = !1, a = -1;
		if (typeof navigator < "u" && navigator.userAgent !== void 0) {
			let e = navigator.userAgent;
			n = /^((?!chrome|android).)*safari/i.test(e) === !0;
			let t = e.match(/Version\/(\d+)/);
			r = n && t ? parseInt(t[1], 10) : -1, i = e.indexOf("Firefox") > -1, a = i ? e.match(/Firefox\/([0-9]+)\./)[1] : -1;
		}
		this.textureLoader = typeof createImageBitmap > "u" || n && r < 17 || i && a < 98 ? new la(this.options.manager) : new Na(this.options.manager), this.textureLoader.setCrossOrigin(this.options.crossOrigin), this.textureLoader.setRequestHeader(this.options.requestHeader), this.fileLoader = new oa(this.options.manager), this.fileLoader.setResponseType("arraybuffer"), this.options.crossOrigin === "use-credentials" && this.fileLoader.setWithCredentials(!0);
	}
	setExtensions(e) {
		this.extensions = e;
	}
	setPlugins(e) {
		this.plugins = e;
	}
	parse(e, t) {
		let n = this, r = this.json, i = this.extensions;
		this.cache.removeAll(), this.nodeCache = {}, this._invokeAll(function(e) {
			return e._markDefs && e._markDefs();
		}), Promise.all(this._invokeAll(function(e) {
			return e.beforeRoot && e.beforeRoot();
		})).then(function() {
			return Promise.all([
				n.getDependencies("scene"),
				n.getDependencies("animation"),
				n.getDependencies("camera")
			]);
		}).then(function(t) {
			let a = {
				scene: t[0][r.scene || 0],
				scenes: t[0],
				animations: t[1],
				cameras: t[2],
				asset: r.asset,
				parser: n,
				userData: {}
			};
			return Au(i, a, r), ju(a, r), Promise.all(n._invokeAll(function(e) {
				return e.afterRoot && e.afterRoot(a);
			})).then(function() {
				for (let e of a.scenes) e.updateMatrixWorld();
				e(a);
			});
		}).catch(t);
	}
	_markDefs() {
		let e = this.json.nodes || [], t = this.json.skins || [], n = this.json.meshes || [];
		for (let n = 0, r = t.length; n < r; n++) {
			let r = t[n].joints;
			for (let t = 0, n = r.length; t < n; t++) e[r[t]].isBone = !0;
		}
		for (let t = 0, r = e.length; t < r; t++) {
			let r = e[t];
			r.mesh !== void 0 && (this._addNodeRef(this.meshCache, r.mesh), r.skin !== void 0 && (n[r.mesh].isSkinnedMesh = !0)), r.camera !== void 0 && this._addNodeRef(this.cameraCache, r.camera);
		}
	}
	_addNodeRef(e, t) {
		t !== void 0 && (e.refs[t] === void 0 && (e.refs[t] = e.uses[t] = 0), e.refs[t]++);
	}
	_getNodeRef(e, t, n) {
		if (e.refs[t] <= 1) return n;
		let r = n.clone(), i = (e, t) => {
			let n = this.associations.get(e);
			n != null && this.associations.set(t, n);
			for (let [n, r] of e.children.entries()) i(r, t.children[n]);
		};
		return i(n, r), r.name += "_instance_" + e.uses[t]++, r;
	}
	_invokeOne(e) {
		let t = Object.values(this.plugins);
		t.push(this);
		for (let n = 0; n < t.length; n++) {
			let r = e(t[n]);
			if (r) return r;
		}
		return null;
	}
	_invokeAll(e) {
		let t = Object.values(this.plugins);
		t.unshift(this);
		let n = [];
		for (let r = 0; r < t.length; r++) {
			let i = e(t[r]);
			i && n.push(i);
		}
		return n;
	}
	getDependency(e, t) {
		let n = e + ":" + t, r = this.cache.get(n);
		if (!r) {
			switch (e) {
				case "scene":
					r = this.loadScene(t);
					break;
				case "node":
					r = this._invokeOne(function(e) {
						return e.loadNode && e.loadNode(t);
					});
					break;
				case "mesh":
					r = this._invokeOne(function(e) {
						return e.loadMesh && e.loadMesh(t);
					});
					break;
				case "accessor":
					r = this.loadAccessor(t);
					break;
				case "bufferView":
					r = this._invokeOne(function(e) {
						return e.loadBufferView && e.loadBufferView(t);
					});
					break;
				case "buffer":
					r = this.loadBuffer(t);
					break;
				case "material":
					r = this._invokeOne(function(e) {
						return e.loadMaterial && e.loadMaterial(t);
					});
					break;
				case "texture":
					r = this._invokeOne(function(e) {
						return e.loadTexture && e.loadTexture(t);
					});
					break;
				case "skin":
					r = this.loadSkin(t);
					break;
				case "animation":
					r = this._invokeOne(function(e) {
						return e.loadAnimation && e.loadAnimation(t);
					});
					break;
				case "camera":
					r = this.loadCamera(t);
					break;
				default: if (r = this._invokeOne(function(n) {
					return n != this && n.getDependency && n.getDependency(e, t);
				}), !r) throw Error("Unknown type: " + e);
			}
			this.cache.add(n, r);
		}
		return r;
	}
	getDependencies(e) {
		let t = this.cache.get(e);
		if (!t) {
			let n = this, r = this.json[e + (e === "mesh" ? "es" : "s")] || [];
			t = Promise.all(r.map(function(t, r) {
				return n.getDependency(e, r);
			})), this.cache.add(e, t);
		}
		return t;
	}
	loadBuffer(e) {
		let t = this.json.buffers[e], n = this.fileLoader;
		if (t.type && t.type !== "arraybuffer") throw Error("THREE.GLTFLoader: " + t.type + " buffer type is not supported.");
		if (t.uri === void 0 && e === 0) return Promise.resolve(this.extensions[Gl.KHR_BINARY_GLTF].body);
		let r = this.options;
		return new Promise(function(e, i) {
			n.load(ja.resolveURL(t.uri, r.path), e, void 0, function() {
				i(/* @__PURE__ */ Error("THREE.GLTFLoader: Failed to load buffer \"" + t.uri + "\"."));
			});
		});
	}
	loadBufferView(e) {
		let t = this.json.bufferViews[e];
		return this.getDependency("buffer", t.buffer).then(function(e) {
			let n = t.byteLength || 0, r = t.byteOffset || 0;
			return e.slice(r, r + n);
		});
	}
	loadAccessor(e) {
		let t = this, n = this.json, r = this.json.accessors[e];
		if (r.bufferView === void 0 && r.sparse === void 0) {
			let e = wu[r.type], t = xu[r.componentType], n = r.normalized === !0, i = new t(r.count * e);
			return Promise.resolve(new Sn(i, e, n));
		}
		let i = [];
		return r.bufferView === void 0 ? i.push(null) : i.push(this.getDependency("bufferView", r.bufferView)), r.sparse !== void 0 && (i.push(this.getDependency("bufferView", r.sparse.indices.bufferView)), i.push(this.getDependency("bufferView", r.sparse.values.bufferView))), Promise.all(i).then(function(e) {
			let i = e[0], a = wu[r.type], o = xu[r.componentType], s = o.BYTES_PER_ELEMENT, c = s * a, l = r.byteOffset || 0, u = r.bufferView === void 0 ? void 0 : n.bufferViews[r.bufferView].byteStride, d = r.normalized === !0, f, p;
			if (u && u !== c) {
				let e = Math.floor(l / u), n = "InterleavedBuffer:" + r.bufferView + ":" + r.componentType + ":" + e + ":" + r.count, c = t.cache.get(n);
				c || (f = new o(i, e * u, r.count * u / s), c = new Rn(f, u / s), t.cache.add(n, c)), p = new Bn(c, a, l % u / s, d);
			} else f = i === null ? new o(r.count * a) : new o(i, l, r.count * a), p = new Sn(f, a, d);
			if (r.sparse !== void 0) {
				let t = wu.SCALAR, n = xu[r.sparse.indices.componentType], s = r.sparse.indices.byteOffset || 0, c = r.sparse.values.byteOffset || 0, l = new n(e[1], s, r.sparse.count * t), u = new o(e[2], c, r.sparse.count * a);
				i !== null && (p = new Sn(p.array.slice(), p.itemSize, p.normalized)), p.normalized = !1;
				for (let e = 0, t = l.length; e < t; e++) {
					let t = l[e];
					if (p.setX(t, u[e * a]), a >= 2 && p.setY(t, u[e * a + 1]), a >= 3 && p.setZ(t, u[e * a + 2]), a >= 4 && p.setW(t, u[e * a + 3]), a >= 5) throw Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.");
				}
				p.normalized = d;
			}
			return p;
		});
	}
	loadTexture(e) {
		let t = this.json, n = this.options, r = t.textures[e].source, i = t.images[r], a = this.textureLoader;
		if (i.uri) {
			let e = n.manager.getHandler(i.uri);
			e !== null && (a = e);
		}
		return this.loadTextureImage(e, r, a);
	}
	loadTextureImage(e, t, n) {
		let r = this, i = this.json, a = i.textures[e], o = i.images[t], s = (o.uri || o.bufferView) + ":" + a.sampler;
		if (this.textureCache[s]) return this.textureCache[s];
		let c = this.loadImageSource(t, n).then(function(t) {
			t.flipY = !1, t.name = a.name || o.name || "", t.name === "" && typeof o.uri == "string" && o.uri.startsWith("data:image/") === !1 && (t.name = o.uri);
			let n = (i.samplers || {})[a.sampler] || {};
			return t.magFilter = Su[n.magFilter] || 1006, t.minFilter = Su[n.minFilter] || 1008, t.wrapS = Cu[n.wrapS] || 1e3, t.wrapT = Cu[n.wrapT] || 1e3, t.generateMipmaps = !t.isCompressedTexture && t.minFilter !== 1003 && t.minFilter !== 1006, r.associations.set(t, { textures: e }), t;
		}).catch(function() {
			return null;
		});
		return this.textureCache[s] = c, c;
	}
	loadImageSource(e, t) {
		let n = this, r = this.json, i = this.options;
		if (this.sourceCache[e] !== void 0) return this.sourceCache[e].then((e) => e.clone());
		let a = r.images[e], o = self.URL || self.webkitURL, s = a.uri || "", c = !1;
		if (a.bufferView !== void 0) s = n.getDependency("bufferView", a.bufferView).then(function(e) {
			c = !0;
			let t = new Blob([e], { type: a.mimeType });
			return s = o.createObjectURL(t), s;
		});
		else if (a.uri === void 0) throw Error("THREE.GLTFLoader: Image " + e + " is missing URI and bufferView");
		let l = Promise.resolve(s).then(function(e) {
			return new Promise(function(n, r) {
				let a = n;
				t.isImageBitmapLoader === !0 && (a = function(e) {
					let t = new et(e);
					t.needsUpdate = !0, n(t);
				}), t.load(ja.resolveURL(e, i.path), a, void 0, r);
			});
		}).then(function(e) {
			return c === !0 && o.revokeObjectURL(s), ju(e, a), e.userData.mimeType = a.mimeType || Lu(a.uri), e;
		}).catch(function(e) {
			throw console.error("THREE.GLTFLoader: Couldn't load texture", s), e;
		});
		return this.sourceCache[e] = l, l;
	}
	assignTexture(e, t, n, r) {
		let i = this;
		return this.getDependency("texture", n.index).then(function(a) {
			if (!a) return null;
			if (n.texCoord !== void 0 && n.texCoord > 0 && (a = a.clone(), a.channel = n.texCoord), i.extensions[Gl.KHR_TEXTURE_TRANSFORM]) {
				let e = n.extensions === void 0 ? void 0 : n.extensions[Gl.KHR_TEXTURE_TRANSFORM];
				if (e) {
					let t = i.associations.get(a);
					a = i.extensions[Gl.KHR_TEXTURE_TRANSFORM].extendTexture(a, e), i.associations.set(a, t);
				}
			}
			return r !== void 0 && (a.colorSpace = r), e[t] = a, a;
		});
	}
	assignFinalMaterial(e) {
		let t = e.geometry, n = e.material, r = t.attributes.tangent === void 0, i = t.attributes.color !== void 0, a = t.attributes.normal === void 0;
		if (e.isPoints) {
			let e = "PointsMaterial:" + n.uuid, t = this.cache.get(e);
			t || (t = new ti(), Kn.prototype.copy.call(t, n), t.color.copy(n.color), t.map = n.map, t.sizeAttenuation = !1, this.cache.add(e, t)), n = t;
		} else if (e.isLine) {
			let e = "LineBasicMaterial:" + n.uuid, t = this.cache.get(e);
			t || (t = new Vr(), Kn.prototype.copy.call(t, n), t.color.copy(n.color), t.map = n.map, this.cache.add(e, t)), n = t;
		}
		if (r || i || a) {
			let e = "ClonedMaterial:" + n.uuid + ":";
			r && (e += "derivative-tangents:"), i && (e += "vertex-colors:"), a && (e += "flat-shading:");
			let t = this.cache.get(e);
			t || (t = n.clone(), i && (t.vertexColors = !0), a && (t.flatShading = !0), r && (t.normalScale && (t.normalScale.y *= -1), t.clearcoatNormalScale && (t.clearcoatNormalScale.y *= -1)), this.cache.add(e, t), this.associations.set(t, this.associations.get(n))), n = t;
		}
		e.material = n;
	}
	getMaterialType() {
		return wi;
	}
	loadMaterial(e) {
		let t = this, n = this.json, r = this.extensions, i = n.materials[e], a, o = {}, s = i.extensions || {}, c = [];
		if (s[Gl.KHR_MATERIALS_UNLIT]) {
			let e = r[Gl.KHR_MATERIALS_UNLIT];
			a = e.getMaterialType(), c.push(e.extendParams(o, i, t));
		} else {
			let n = i.pbrMetallicRoughness || {};
			if (o.color = new J(1, 1, 1), o.opacity = 1, Array.isArray(n.baseColorFactor)) {
				let e = n.baseColorFactor;
				o.color.setRGB(e[0], e[1], e[2], N), o.opacity = e[3];
			}
			n.baseColorTexture !== void 0 && c.push(t.assignTexture(o, "map", n.baseColorTexture, M)), o.metalness = n.metallicFactor === void 0 ? 1 : n.metallicFactor, o.roughness = n.roughnessFactor === void 0 ? 1 : n.roughnessFactor, n.metallicRoughnessTexture !== void 0 && (c.push(t.assignTexture(o, "metalnessMap", n.metallicRoughnessTexture)), c.push(t.assignTexture(o, "roughnessMap", n.metallicRoughnessTexture))), a = this._invokeOne(function(t) {
				return t.getMaterialType && t.getMaterialType(e);
			}), c.push(Promise.all(this._invokeAll(function(t) {
				return t.extendMaterialParams && t.extendMaterialParams(e, o);
			})));
		}
		i.doubleSided === !0 && (o.side = 2);
		let l = i.alphaMode || Ou.OPAQUE;
		if (l === Ou.BLEND ? (o.transparent = !0, o.depthWrite = !1) : (o.transparent = !1, l === Ou.MASK && (o.alphaTest = i.alphaCutoff === void 0 ? .5 : i.alphaCutoff)), i.normalTexture !== void 0 && a !== Qn && (c.push(t.assignTexture(o, "normalMap", i.normalTexture)), o.normalScale = new H(1, 1), i.normalTexture.scale !== void 0)) {
			let e = i.normalTexture.scale;
			o.normalScale.set(e, e);
		}
		if (i.occlusionTexture !== void 0 && a !== Qn && (c.push(t.assignTexture(o, "aoMap", i.occlusionTexture)), i.occlusionTexture.strength !== void 0 && (o.aoMapIntensity = i.occlusionTexture.strength)), i.emissiveFactor !== void 0 && a !== Qn) {
			let e = i.emissiveFactor;
			o.emissive = new J().setRGB(e[0], e[1], e[2], N);
		}
		return i.emissiveTexture !== void 0 && a !== Qn && c.push(t.assignTexture(o, "emissiveMap", i.emissiveTexture, M)), Promise.all(c).then(function() {
			let n = new a(o);
			return i.name && (n.name = i.name), ju(n, i), t.associations.set(n, { materials: e }), i.extensions && Au(r, n, i), n;
		});
	}
	createUniqueName(e) {
		let t = Qa.sanitizeNodeName(e || "");
		return t in this.nodeNamesUsed ? t + "_" + ++this.nodeNamesUsed[t] : (this.nodeNamesUsed[t] = 0, t);
	}
	loadGeometries(e) {
		let t = this, n = this.extensions, r = this.primitiveCache;
		function i(e) {
			return n[Gl.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(e, t).then(function(n) {
				return Vu(n, e, t);
			});
		}
		let a = [];
		for (let n = 0, o = e.length; n < o; n++) {
			let o = e[n], s = Pu(o), c = r[s];
			if (c) a.push(c.promise);
			else {
				let e;
				e = o.extensions && o.extensions[Gl.KHR_DRACO_MESH_COMPRESSION] ? i(o) : Vu(new Ln(), o, t), o.mode === bu.TRIANGLE_STRIP ? e = e.then((e) => zl(e, 1)) : o.mode === bu.TRIANGLE_FAN && (e = e.then((e) => zl(e, 2))), r[s] = {
					primitive: o,
					promise: e
				}, a.push(e);
			}
		}
		return Promise.all(a);
	}
	loadMesh(e) {
		let t = this, n = this.json, r = this.extensions, i = n.meshes[e], a = i.primitives, o = [];
		for (let e = 0, t = a.length; e < t; e++) {
			let t = a[e].material === void 0 ? ku(this.cache) : this.getDependency("material", a[e].material);
			o.push(t);
		}
		return o.push(t.loadGeometries(a)), Promise.all(o).then(async function(n) {
			let o = n.slice(0, n.length - 1), s = n[n.length - 1], c = [];
			for (let n = 0, l = s.length; n < l; n++) {
				let l = s[n], u = a[n], d, f = o[n];
				if (u.mode === bu.TRIANGLES || u.mode === bu.TRIANGLE_STRIP || u.mode === bu.TRIANGLE_FAN || u.mode === void 0) {
					let e = i.isSkinnedMesh === !0, t = l.hasAttribute("skinIndex") && l.hasAttribute("skinWeight");
					e && t === !1 && console.warn("THREE.GLTFLoader: Missing skinIndex or skinWeight attributes. Skinning disabled."), d = e && t ? new Sr(l, f) : new ur(l, f), d.isSkinnedMesh === !0 && d.normalizeSkinWeights();
				} else if (u.mode === bu.LINES) d = new $r(l, f);
				else if (u.mode === bu.LINE_STRIP) d = new Yr(l, f);
				else if (u.mode === bu.LINE_LOOP) d = new ei(l, f);
				else if (u.mode === bu.POINTS) d = new oi(l, f);
				else throw Error("THREE.GLTFLoader: Primitive mode unsupported: " + u.mode);
				Object.keys(d.geometry.morphAttributes).length > 0 && Nu(d, i), d.name = t.createUniqueName(i.name || "mesh_" + e), ju(d, i), u.extensions && Au(r, d, u), t.assignFinalMaterial(d), c.push(d);
			}
			for (let n = 0, r = c.length; n < r; n++) t.associations.set(c[n], {
				meshes: e,
				primitives: n
			});
			if (c.length === 1) return i.extensions && Au(r, c[0], i), c[0];
			let l = new Nt();
			i.extensions && Au(r, l, i), t.associations.set(l, { meshes: e });
			for (let e = 0, t = c.length; e < t; e++) l.add(c[e]);
			return l;
		});
	}
	loadCamera(e) {
		let t, n = this.json.cameras[e], r = n[n.type];
		if (!r) console.warn("THREE.GLTFLoader: Missing camera parameters.");
		else return n.type === "perspective" ? t = new Ca(V.radToDeg(r.yfov), r.aspectRatio || 1, r.znear || 1, r.zfar || 2e6) : n.type === "orthographic" && (t = new Oa(-r.xmag, r.xmag, r.ymag, -r.ymag, r.znear, r.zfar)), n.name && (t.name = this.createUniqueName(n.name)), ju(t, n), Promise.resolve(t);
	}
	loadSkin(e) {
		let t = this.json.skins[e], n = [];
		for (let e = 0, r = t.joints.length; e < r; e++) n.push(this._loadNodeShallow(t.joints[e]));
		return t.inverseBindMatrices === void 0 ? n.push(null) : n.push(this.getDependency("accessor", t.inverseBindMatrices)), Promise.all(n).then(function(e) {
			let n = e.pop(), r = e, i = [], a = [];
			for (let e = 0, o = r.length; e < o; e++) {
				let o = r[e];
				if (o) {
					i.push(o);
					let t = new q();
					n !== null && t.fromArray(n.array, e * 16), a.push(t);
				} else console.warn("THREE.GLTFLoader: Joint \"%s\" could not be found.", t.joints[e]);
			}
			return new Dr(i, a);
		});
	}
	loadAnimation(e) {
		let t = this.json, n = this, r = t.animations[e], i = r.name ? r.name : "animation_" + e, a = [], o = [], s = [], c = [], l = [];
		for (let e = 0, t = r.channels.length; e < t; e++) {
			let t = r.channels[e], n = r.samplers[t.sampler], i = t.target, u = i.node, d = r.parameters === void 0 ? n.input : r.parameters[n.input], f = r.parameters === void 0 ? n.output : r.parameters[n.output];
			i.node !== void 0 && (a.push(this.getDependency("node", u)), o.push(this.getDependency("accessor", d)), s.push(this.getDependency("accessor", f)), c.push(n), l.push(i));
		}
		return Promise.all([
			Promise.all(a),
			Promise.all(o),
			Promise.all(s),
			Promise.all(c),
			Promise.all(l)
		]).then(function(e) {
			let t = e[0], a = e[1], o = e[2], s = e[3], c = e[4], l = [];
			for (let e = 0, r = t.length; e < r; e++) {
				let r = t[e], i = a[e], u = o[e], d = s[e], f = c[e];
				if (r === void 0) continue;
				r.updateMatrix && r.updateMatrix();
				let p = n._createAnimationTracks(r, i, u, d, f);
				if (p) for (let e = 0; e < p.length; e++) l.push(p[e]);
			}
			let u = new Zi(i, void 0, l);
			return ju(u, r), u;
		});
	}
	createNodeMesh(e) {
		let t = this.json, n = this, r = t.nodes[e];
		return r.mesh === void 0 ? null : n.getDependency("mesh", r.mesh).then(function(e) {
			let t = n._getNodeRef(n.meshCache, r.mesh, e);
			return r.weights !== void 0 && t.traverse(function(e) {
				if (e.isMesh) for (let t = 0, n = r.weights.length; t < n; t++) e.morphTargetInfluences[t] = r.weights[t];
			}), t;
		});
	}
	loadNode(e) {
		let t = this.json, n = this, r = t.nodes[e], i = n._loadNodeShallow(e), a = [], o = r.children || [];
		for (let e = 0, t = o.length; e < t; e++) a.push(n.getDependency("node", o[e]));
		let s = r.skin === void 0 ? Promise.resolve(null) : n.getDependency("skin", r.skin);
		return Promise.all([
			i,
			Promise.all(a),
			s
		]).then(function(e) {
			let t = e[0], n = e[1], r = e[2];
			r !== null && t.traverse(function(e) {
				e.isSkinnedMesh && e.bind(r, Ru);
			});
			for (let e = 0, r = n.length; e < r; e++) t.add(n[e]);
			if (t.userData.pivot !== void 0 && n.length > 0) {
				let e = t.userData.pivot, r = n[0];
				t.pivot = new W().fromArray(e), t.position.x -= e[0], t.position.y -= e[1], t.position.z -= e[2], r.position.set(0, 0, 0), delete t.userData.pivot;
			}
			return t;
		});
	}
	_loadNodeShallow(e) {
		let t = this.json, n = this.extensions, r = this;
		if (this.nodeCache[e] !== void 0) return this.nodeCache[e];
		let i = t.nodes[e], a = i.name ? r.createUniqueName(i.name) : "", o = [], s = r._invokeOne(function(t) {
			return t.createNodeMesh && t.createNodeMesh(e);
		});
		return s && o.push(s), i.camera !== void 0 && o.push(r.getDependency("camera", i.camera).then(function(e) {
			return r._getNodeRef(r.cameraCache, i.camera, e);
		})), r._invokeAll(function(t) {
			return t.createNodeAttachment && t.createNodeAttachment(e);
		}).forEach(function(e) {
			o.push(e);
		}), this.nodeCache[e] = Promise.all(o).then(function(t) {
			let o;
			if (o = i.isBone === !0 ? new Cr() : t.length > 1 ? new Nt() : t.length === 1 ? t[0] : new Mt(), o !== t[0]) for (let e = 0, n = t.length; e < n; e++) o.add(t[e]);
			if (i.name && (o.userData.name = i.name, o.name = a), ju(o, i), i.extensions && Au(n, o, i), i.matrix !== void 0) {
				let e = new q();
				e.fromArray(i.matrix), o.applyMatrix4(e);
			} else i.translation !== void 0 && o.position.fromArray(i.translation), i.rotation !== void 0 && o.quaternion.fromArray(i.rotation), i.scale !== void 0 && o.scale.fromArray(i.scale);
			if (!r.associations.has(o)) r.associations.set(o, {});
			else if (i.mesh !== void 0 && r.meshCache.refs[i.mesh] > 1) {
				let e = r.associations.get(o);
				r.associations.set(o, { ...e });
			}
			return r.associations.get(o).nodes = e, o;
		}), this.nodeCache[e];
	}
	loadScene(e) {
		let t = this.extensions, n = this.json.scenes[e], r = this, i = new Nt();
		n.name && (i.name = r.createUniqueName(n.name)), ju(i, n), n.extensions && Au(t, i, n);
		let a = n.nodes || [], o = [];
		for (let e = 0, t = a.length; e < t; e++) o.push(r.getDependency("node", a[e]));
		return Promise.all(o).then(function(e) {
			for (let t = 0, n = e.length; t < n; t++) {
				let n = e[t];
				n.parent === null ? i.add(n) : i.add(Bl(n));
			}
			return r.associations = ((e) => {
				let t = /* @__PURE__ */ new Map();
				for (let [e, n] of r.associations) (e instanceof Kn || e instanceof et) && t.set(e, n);
				return e.traverse((e) => {
					let n = r.associations.get(e);
					n != null && t.set(e, n);
				}), t;
			})(i), i;
		});
	}
	_createAnimationTracks(e, t, n, r, i) {
		let a = [], o = e.name ? e.name : e.uuid, s = [];
		function c(e) {
			e.morphTargetInfluences && s.push(e.name ? e.name : e.uuid);
		}
		Eu[i.path] === Eu.weights ? (c(e), e.isGroup && e.children.forEach(c)) : s.push(o);
		let l;
		switch (Eu[i.path]) {
			case Eu.weights:
				l = Ki;
				break;
			case Eu.rotation:
				l = Ji;
				break;
			case Eu.translation:
			case Eu.scale:
				l = Xi;
				break;
			default: switch (n.itemSize) {
				case 1:
					l = Ki;
					break;
				default: l = Xi;
			}
		}
		let u = r.interpolation === void 0 ? D : Du[r.interpolation], d = this._getArrayFromAccessor(n);
		for (let e = 0, n = s.length; e < n; e++) {
			let n = new l(s[e] + "." + Eu[i.path], t.array, d, u);
			r.interpolation === "CUBICSPLINE" && this._createCubicSplineTrackInterpolant(n), a.push(n);
		}
		return a;
	}
	_getArrayFromAccessor(e) {
		let t = e.array;
		if (e.normalized) {
			let e = Iu(t.constructor), n = new Float32Array(t.length);
			for (let r = 0, i = t.length; r < i; r++) n[r] = t[r] * e;
			t = n;
		}
		return t;
	}
	_createCubicSplineTrackInterpolant(e) {
		e.createInterpolant = function(e) {
			return new (this instanceof Ji ? yu : _u)(this.times, this.values, this.getValueSize() / 3, e);
		}, e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline = !0;
	}
};
function Bu(e, t, n) {
	let r = t.attributes, i = new rn();
	if (r.POSITION !== void 0) {
		let e = n.json.accessors[r.POSITION], t = e.min, a = e.max;
		if (t !== void 0 && a !== void 0) {
			if (i.set(new W(t[0], t[1], t[2]), new W(a[0], a[1], a[2])), e.normalized) {
				let t = Iu(xu[e.componentType]);
				i.min.multiplyScalar(t), i.max.multiplyScalar(t);
			}
		} else {
			console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");
			return;
		}
	} else return;
	let a = t.targets;
	if (a !== void 0) {
		let e = new W(), t = new W();
		for (let r = 0, i = a.length; r < i; r++) {
			let i = a[r];
			if (i.POSITION !== void 0) {
				let r = n.json.accessors[i.POSITION], a = r.min, o = r.max;
				if (a !== void 0 && o !== void 0) {
					if (t.setX(Math.max(Math.abs(a[0]), Math.abs(o[0]))), t.setY(Math.max(Math.abs(a[1]), Math.abs(o[1]))), t.setZ(Math.max(Math.abs(a[2]), Math.abs(o[2]))), r.normalized) {
						let e = Iu(xu[r.componentType]);
						t.multiplyScalar(e);
					}
					e.max(t);
				} else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");
			}
		}
		i.expandByVector(e);
	}
	e.boundingBox = i;
	let o = new kn();
	i.getCenter(o.center), o.radius = i.min.distanceTo(i.max) / 2, e.boundingSphere = o;
}
function Vu(e, t, n) {
	let r = t.attributes, i = [];
	function a(t, r) {
		return n.getDependency("accessor", t).then(function(t) {
			e.setAttribute(r, t);
		});
	}
	for (let t in r) {
		let n = Tu[t] || t.toLowerCase();
		n in e.attributes || i.push(a(r[t], n));
	}
	if (t.indices !== void 0 && !e.index) {
		let r = n.getDependency("accessor", t.indices).then(function(t) {
			e.setIndex(t);
		});
		i.push(r);
	}
	return K.workingColorSpace !== "srgb-linear" && "COLOR_0" in r && console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${K.workingColorSpace}" not supported.`), ju(e, t), Bu(e, t, n), Promise.all(i).then(function() {
		return t.targets === void 0 ? e : Mu(e, t.targets, n);
	});
}
//#endregion
//#region node_modules/three/examples/jsm/shaders/CopyShader.js
var Hu = {
	name: "CopyShader",
	uniforms: {
		tDiffuse: { value: null },
		opacity: { value: 1 }
	},
	vertexShader: "\n\n		varying vec2 vUv;\n\n		void main() {\n\n			vUv = uv;\n			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\n		}",
	fragmentShader: "\n\n		uniform float opacity;\n\n		uniform sampler2D tDiffuse;\n\n		varying vec2 vUv;\n\n		void main() {\n\n			vec4 texel = texture2D( tDiffuse, vUv );\n			gl_FragColor = opacity * texel;\n\n\n		}"
}, Uu = class {
	constructor() {
		this.isPass = !0, this.enabled = !0, this.needsSwap = !0, this.clear = !1, this.renderToScreen = !1;
	}
	setSize() {}
	render() {
		console.error("THREE.Pass: .render() must be implemented in derived pass.");
	}
	dispose() {}
}, Wu = new Oa(-1, 1, 1, -1, 0, 1), Gu = new class extends Ln {
	constructor() {
		super(), this.setAttribute("position", new Tn([
			-1,
			3,
			0,
			-1,
			-1,
			0,
			3,
			-1,
			0
		], 3)), this.setAttribute("uv", new Tn([
			0,
			2,
			0,
			0,
			2,
			0
		], 2));
	}
}(), Ku = class {
	constructor(e) {
		this._mesh = new ur(Gu, e);
	}
	dispose() {
		this._mesh.geometry.dispose();
	}
	render(e) {
		e.render(this._mesh, Wu);
	}
	get material() {
		return this._mesh.material;
	}
	set material(e) {
		this._mesh.material = e;
	}
}, qu = class extends Uu {
	constructor(e, t = "tDiffuse") {
		super(), this.textureID = t, this.uniforms = null, this.material = null, e instanceof Si ? (this.uniforms = e.uniforms, this.material = e) : e && (this.uniforms = yi.clone(e.uniforms), this.material = new Si({
			name: e.name === void 0 ? "unspecified" : e.name,
			defines: Object.assign({}, e.defines),
			uniforms: this.uniforms,
			vertexShader: e.vertexShader,
			fragmentShader: e.fragmentShader
		})), this._fsQuad = new Ku(this.material);
	}
	render(e, t, n) {
		this.uniforms[this.textureID] && (this.uniforms[this.textureID].value = n.texture), this._fsQuad.material = this.material, this.renderToScreen ? (e.setRenderTarget(null), this._fsQuad.render(e)) : (e.setRenderTarget(t), this.clear && e.clear(e.autoClearColor, e.autoClearDepth, e.autoClearStencil), this._fsQuad.render(e));
	}
	dispose() {
		this.material.dispose(), this._fsQuad.dispose();
	}
}, Ju = class extends Uu {
	constructor(e, t) {
		super(), this.scene = e, this.camera = t, this.clear = !0, this.needsSwap = !1, this.inverse = !1;
	}
	render(e, t, n) {
		let r = e.getContext(), i = e.state;
		i.buffers.color.setMask(!1), i.buffers.depth.setMask(!1), i.buffers.color.setLocked(!0), i.buffers.depth.setLocked(!0);
		let a, o;
		this.inverse ? (a = 0, o = 1) : (a = 1, o = 0), i.buffers.stencil.setTest(!0), i.buffers.stencil.setOp(r.REPLACE, r.REPLACE, r.REPLACE), i.buffers.stencil.setFunc(r.ALWAYS, a, 4294967295), i.buffers.stencil.setClear(o), i.buffers.stencil.setLocked(!0), e.setRenderTarget(n), this.clear && e.clear(), e.render(this.scene, this.camera), e.setRenderTarget(t), this.clear && e.clear(), e.render(this.scene, this.camera), i.buffers.color.setLocked(!1), i.buffers.depth.setLocked(!1), i.buffers.color.setMask(!0), i.buffers.depth.setMask(!0), i.buffers.stencil.setLocked(!1), i.buffers.stencil.setFunc(r.EQUAL, 1, 4294967295), i.buffers.stencil.setOp(r.KEEP, r.KEEP, r.KEEP), i.buffers.stencil.setLocked(!0);
	}
}, Yu = class extends Uu {
	constructor() {
		super(), this.needsSwap = !1;
	}
	render(e) {
		e.state.buffers.stencil.setLocked(!1), e.state.buffers.stencil.setTest(!1);
	}
}, Xu = class {
	constructor(e, t) {
		if (this.renderer = e, this._pixelRatio = e.getPixelRatio(), t === void 0) {
			let n = e.getSize(new H());
			this._width = n.width, this._height = n.height, t = new rt(this._width * this._pixelRatio, this._height * this._pixelRatio, { type: p }), t.texture.name = "EffectComposer.rt1";
		} else this._width = t.width, this._height = t.height;
		this.renderTarget1 = t, this.renderTarget2 = t.clone(), this.renderTarget2.texture.name = "EffectComposer.rt2", this.writeBuffer = this.renderTarget1, this.readBuffer = this.renderTarget2, this.renderToScreen = !0, this.passes = [], this.copyPass = new qu(Hu), this.copyPass.material.blending = 0, this.timer = new Ra();
	}
	swapBuffers() {
		let e = this.readBuffer;
		this.readBuffer = this.writeBuffer, this.writeBuffer = e;
	}
	addPass(e) {
		this.passes.push(e), e.setSize(this._width * this._pixelRatio, this._height * this._pixelRatio);
	}
	insertPass(e, t) {
		this.passes.splice(t, 0, e), e.setSize(this._width * this._pixelRatio, this._height * this._pixelRatio);
	}
	removePass(e) {
		let t = this.passes.indexOf(e);
		t !== -1 && this.passes.splice(t, 1);
	}
	isLastEnabledPass(e) {
		for (let t = e + 1; t < this.passes.length; t++) if (this.passes[t].enabled) return !1;
		return !0;
	}
	render(e) {
		this.timer.update(), e === void 0 && (e = this.timer.getDelta());
		let t = this.renderer.getRenderTarget(), n = !1;
		for (let t = 0, r = this.passes.length; t < r; t++) {
			let r = this.passes[t];
			if (r.enabled !== !1) {
				if (r.renderToScreen = this.renderToScreen && this.isLastEnabledPass(t), r.render(this.renderer, this.writeBuffer, this.readBuffer, e, n), r.needsSwap) {
					if (n) {
						let t = this.renderer.getContext(), n = this.renderer.state.buffers.stencil;
						n.setFunc(t.NOTEQUAL, 1, 4294967295), this.copyPass.render(this.renderer, this.writeBuffer, this.readBuffer, e), n.setFunc(t.EQUAL, 1, 4294967295);
					}
					this.swapBuffers();
				}
				Ju !== void 0 && (r instanceof Ju ? n = !0 : r instanceof Yu && (n = !1));
			}
		}
		this.renderer.setRenderTarget(t);
	}
	reset(e) {
		if (e === void 0) {
			let t = this.renderer.getSize(new H());
			this._pixelRatio = this.renderer.getPixelRatio(), this._width = t.width, this._height = t.height, e = this.renderTarget1.clone(), e.setSize(this._width * this._pixelRatio, this._height * this._pixelRatio);
		}
		this.renderTarget1.dispose(), this.renderTarget2.dispose(), this.renderTarget1 = e, this.renderTarget2 = e.clone(), this.writeBuffer = this.renderTarget1, this.readBuffer = this.renderTarget2;
	}
	setSize(e, t) {
		this._width = e, this._height = t;
		let n = this._width * this._pixelRatio, r = this._height * this._pixelRatio;
		this.renderTarget1.setSize(n, r), this.renderTarget2.setSize(n, r);
		for (let e = 0; e < this.passes.length; e++) this.passes[e].setSize(n, r);
	}
	setPixelRatio(e) {
		this._pixelRatio = e, this.setSize(this._width, this._height);
	}
	dispose() {
		this.renderTarget1.dispose(), this.renderTarget2.dispose(), this.copyPass.dispose();
	}
}, Zu = class extends Uu {
	constructor(e, t, n = null, r = null, i = null) {
		super(), this.scene = e, this.camera = t, this.overrideMaterial = n, this.clearColor = r, this.clearAlpha = i, this.clear = !0, this.clearDepth = !1, this.needsSwap = !1, this.isRenderPass = !0, this._oldClearColor = new J();
	}
	render(e, t, n) {
		let r = e.autoClear;
		e.autoClear = !1;
		let i, a;
		this.overrideMaterial !== null && (a = this.scene.overrideMaterial, this.scene.overrideMaterial = this.overrideMaterial), this.clearColor !== null && (e.getClearColor(this._oldClearColor), e.setClearColor(this.clearColor, e.getClearAlpha())), this.clearAlpha !== null && (i = e.getClearAlpha(), e.setClearAlpha(this.clearAlpha)), this.clearDepth == 1 && e.clearDepth(), e.setRenderTarget(this.renderToScreen ? null : n), this.clear === !0 && e.clear(e.autoClearColor, e.autoClearDepth, e.autoClearStencil), e.render(this.scene, this.camera), this.clearColor !== null && e.setClearColor(this._oldClearColor), this.clearAlpha !== null && e.setClearAlpha(i), this.overrideMaterial !== null && (this.scene.overrideMaterial = a), e.autoClear = r;
	}
}, Qu = {
	name: "LuminosityHighPassShader",
	uniforms: {
		tDiffuse: { value: null },
		luminosityThreshold: { value: 1 },
		smoothWidth: { value: 1 },
		defaultColor: { value: new J(0) },
		defaultOpacity: { value: 0 }
	},
	vertexShader: "\n\n		varying vec2 vUv;\n\n		void main() {\n\n			vUv = uv;\n\n			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\n		}",
	fragmentShader: "\n\n		uniform sampler2D tDiffuse;\n		uniform vec3 defaultColor;\n		uniform float defaultOpacity;\n		uniform float luminosityThreshold;\n		uniform float smoothWidth;\n\n		varying vec2 vUv;\n\n		void main() {\n\n			vec4 texel = texture2D( tDiffuse, vUv );\n\n			float v = luminance( texel.xyz );\n\n			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );\n\n			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );\n\n			gl_FragColor = mix( outputColor, texel, alpha );\n\n		}"
}, $u = class e extends Uu {
	constructor(e, t = 1, n, r) {
		super(), this.strength = t, this.radius = n, this.threshold = r, this.resolution = e === void 0 ? new H(256, 256) : new H(e.x, e.y), this.clearColor = new J(0, 0, 0), this.needsSwap = !1, this.renderTargetsHorizontal = [], this.renderTargetsVertical = [], this.nMips = 5;
		let i = Math.round(this.resolution.x / 2), a = Math.round(this.resolution.y / 2);
		this.renderTargetBright = new rt(i, a, {
			type: p,
			depthBuffer: !1
		}), this.renderTargetBright.texture.name = "UnrealBloomPass.bright", this.renderTargetBright.texture.generateMipmaps = !1;
		for (let e = 0; e < this.nMips; e++) {
			let t = new rt(i, a, {
				type: p,
				depthBuffer: !1
			});
			t.texture.name = "UnrealBloomPass.h" + e, t.texture.generateMipmaps = !1, this.renderTargetsHorizontal.push(t);
			let n = new rt(i, a, {
				type: p,
				depthBuffer: !1
			});
			n.texture.name = "UnrealBloomPass.v" + e, n.texture.generateMipmaps = !1, this.renderTargetsVertical.push(n), i = Math.round(i / 2), a = Math.round(a / 2);
		}
		let o = Qu;
		this.highPassUniforms = yi.clone(o.uniforms), this.highPassUniforms.luminosityThreshold.value = r, this.highPassUniforms.smoothWidth.value = .01, this.materialHighPassFilter = new Si({
			uniforms: this.highPassUniforms,
			vertexShader: o.vertexShader,
			fragmentShader: o.fragmentShader
		}), this.separableBlurMaterials = [];
		let s = [
			6,
			10,
			14,
			18,
			22
		];
		i = Math.round(this.resolution.x / 2), a = Math.round(this.resolution.y / 2);
		for (let e = 0; e < this.nMips; e++) this.separableBlurMaterials.push(this._getSeparableBlurMaterial(s[e])), this.separableBlurMaterials[e].uniforms.invSize.value = new H(1 / i, 1 / a), i = Math.round(i / 2), a = Math.round(a / 2);
		this.compositeMaterial = this._getCompositeMaterial(this.nMips), this.compositeMaterial.uniforms.blurTexture1.value = this.renderTargetsVertical[0].texture, this.compositeMaterial.uniforms.blurTexture2.value = this.renderTargetsVertical[1].texture, this.compositeMaterial.uniforms.blurTexture3.value = this.renderTargetsVertical[2].texture, this.compositeMaterial.uniforms.blurTexture4.value = this.renderTargetsVertical[3].texture, this.compositeMaterial.uniforms.blurTexture5.value = this.renderTargetsVertical[4].texture, this.compositeMaterial.uniforms.bloomStrength.value = t, this.compositeMaterial.uniforms.bloomRadius.value = .1;
		let c = [
			1,
			.8,
			.6,
			.4,
			.2
		];
		this.compositeMaterial.uniforms.bloomFactors.value = c, this.bloomTintColors = [
			new W(1, 1, 1),
			new W(1, 1, 1),
			new W(1, 1, 1),
			new W(1, 1, 1),
			new W(1, 1, 1)
		], this.compositeMaterial.uniforms.bloomTintColors.value = this.bloomTintColors, this.copyUniforms = yi.clone(Hu.uniforms), this.blendMaterial = new Si({
			uniforms: this.copyUniforms,
			vertexShader: Hu.vertexShader,
			fragmentShader: Hu.fragmentShader,
			premultipliedAlpha: !0,
			blending: 2,
			depthTest: !1,
			depthWrite: !1,
			transparent: !0
		}), this._oldClearColor = new J(), this._oldClearAlpha = 1, this._basic = new Qn(), this._fsQuad = new Ku(null);
	}
	dispose() {
		for (let e = 0; e < this.renderTargetsHorizontal.length; e++) this.renderTargetsHorizontal[e].dispose();
		for (let e = 0; e < this.renderTargetsVertical.length; e++) this.renderTargetsVertical[e].dispose();
		this.renderTargetBright.dispose();
		for (let e = 0; e < this.separableBlurMaterials.length; e++) this.separableBlurMaterials[e].dispose();
		this.compositeMaterial.dispose(), this.blendMaterial.dispose(), this._basic.dispose(), this._fsQuad.dispose();
	}
	setSize(e, t) {
		let n = Math.round(e / 2), r = Math.round(t / 2);
		this.renderTargetBright.setSize(n, r);
		for (let e = 0; e < this.nMips; e++) this.renderTargetsHorizontal[e].setSize(n, r), this.renderTargetsVertical[e].setSize(n, r), this.separableBlurMaterials[e].uniforms.invSize.value = new H(1 / n, 1 / r), n = Math.round(n / 2), r = Math.round(r / 2);
	}
	render(t, n, r, i, a) {
		t.getClearColor(this._oldClearColor), this._oldClearAlpha = t.getClearAlpha();
		let o = t.autoClear;
		t.autoClear = !1, t.setClearColor(this.clearColor, 0), a && t.state.buffers.stencil.setTest(!1), this.renderToScreen && (this._fsQuad.material = this._basic, this._basic.map = r.texture, t.setRenderTarget(null), t.clear(), this._fsQuad.render(t)), this.highPassUniforms.tDiffuse.value = r.texture, this.highPassUniforms.luminosityThreshold.value = this.threshold, this._fsQuad.material = this.materialHighPassFilter, t.setRenderTarget(this.renderTargetBright), t.clear(), this._fsQuad.render(t);
		let s = this.renderTargetBright;
		for (let n = 0; n < this.nMips; n++) this._fsQuad.material = this.separableBlurMaterials[n], this.separableBlurMaterials[n].uniforms.colorTexture.value = s.texture, this.separableBlurMaterials[n].uniforms.direction.value = e.BlurDirectionX, t.setRenderTarget(this.renderTargetsHorizontal[n]), t.clear(), this._fsQuad.render(t), this.separableBlurMaterials[n].uniforms.colorTexture.value = this.renderTargetsHorizontal[n].texture, this.separableBlurMaterials[n].uniforms.direction.value = e.BlurDirectionY, t.setRenderTarget(this.renderTargetsVertical[n]), t.clear(), this._fsQuad.render(t), s = this.renderTargetsVertical[n];
		this._fsQuad.material = this.compositeMaterial, this.compositeMaterial.uniforms.bloomStrength.value = this.strength, this.compositeMaterial.uniforms.bloomRadius.value = this.radius, this.compositeMaterial.uniforms.bloomTintColors.value = this.bloomTintColors, t.setRenderTarget(this.renderTargetsHorizontal[0]), t.clear(), this._fsQuad.render(t), this._fsQuad.material = this.blendMaterial, this.copyUniforms.tDiffuse.value = this.renderTargetsHorizontal[0].texture, a && t.state.buffers.stencil.setTest(!0), this.renderToScreen ? (t.setRenderTarget(null), this._fsQuad.render(t)) : (t.setRenderTarget(r), this._fsQuad.render(t)), t.setClearColor(this._oldClearColor, this._oldClearAlpha), t.autoClear = o;
	}
	_getSeparableBlurMaterial(e) {
		let t = [], n = e / 3;
		for (let r = 0; r < e; r++) t.push(.39894 * Math.exp(-.5 * r * r / (n * n)) / n);
		let r = [], i = [];
		for (let n = 1; n < e; n += 2) {
			let a = t[n], o = n + 1 < e ? t[n + 1] : 0, s = a + o;
			r.push((n * a + (n + 1) * o) / s), i.push(s);
		}
		return new Si({
			defines: { KERNEL_PAIRS: r.length },
			uniforms: {
				colorTexture: { value: null },
				invSize: { value: new H(.5, .5) },
				direction: { value: new H(.5, .5) },
				centerWeight: { value: t[0] },
				gaussianOffsets: { value: r },
				gaussianWeights: { value: i }
			},
			vertexShader: "\n\n				varying vec2 vUv;\n\n				void main() {\n\n					vUv = uv;\n					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\n				}",
			fragmentShader: "\n\n				#include <common>\n\n				varying vec2 vUv;\n\n				uniform sampler2D colorTexture;\n				uniform vec2 invSize;\n				uniform vec2 direction;\n				uniform float centerWeight;\n				uniform float gaussianOffsets[KERNEL_PAIRS];\n				uniform float gaussianWeights[KERNEL_PAIRS];\n\n				void main() {\n\n					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * centerWeight;\n\n					for ( int i = 0; i < KERNEL_PAIRS; i ++ ) {\n\n						vec2 uvOffset = direction * invSize * gaussianOffsets[ i ];\n						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;\n						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;\n						diffuseSum += ( sample1 + sample2 ) * gaussianWeights[ i ];\n\n					}\n\n					gl_FragColor = vec4( diffuseSum, 1.0 );\n\n				}"
		});
	}
	_getCompositeMaterial(e) {
		return new Si({
			defines: { NUM_MIPS: e },
			uniforms: {
				blurTexture1: { value: null },
				blurTexture2: { value: null },
				blurTexture3: { value: null },
				blurTexture4: { value: null },
				blurTexture5: { value: null },
				bloomStrength: { value: 1 },
				bloomFactors: { value: null },
				bloomTintColors: { value: null },
				bloomRadius: { value: 0 }
			},
			vertexShader: "\n\n				varying vec2 vUv;\n\n				void main() {\n\n					vUv = uv;\n					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\n				}",
			fragmentShader: "\n\n				varying vec2 vUv;\n\n				uniform sampler2D blurTexture1;\n				uniform sampler2D blurTexture2;\n				uniform sampler2D blurTexture3;\n				uniform sampler2D blurTexture4;\n				uniform sampler2D blurTexture5;\n				uniform float bloomStrength;\n				uniform float bloomRadius;\n				uniform float bloomFactors[NUM_MIPS];\n				uniform vec3 bloomTintColors[NUM_MIPS];\n\n				float lerpBloomFactor( const in float factor ) {\n\n					float mirrorFactor = 1.2 - factor;\n					return mix( factor, mirrorFactor, bloomRadius );\n\n				}\n\n				void main() {\n\n					// 3.0 for backwards compatibility with previous alpha-based intensity\n					vec3 bloom = 3.0 * bloomStrength * (\n						lerpBloomFactor( bloomFactors[ 0 ] ) * bloomTintColors[ 0 ] * texture2D( blurTexture1, vUv ).rgb +\n						lerpBloomFactor( bloomFactors[ 1 ] ) * bloomTintColors[ 1 ] * texture2D( blurTexture2, vUv ).rgb +\n						lerpBloomFactor( bloomFactors[ 2 ] ) * bloomTintColors[ 2 ] * texture2D( blurTexture3, vUv ).rgb +\n						lerpBloomFactor( bloomFactors[ 3 ] ) * bloomTintColors[ 3 ] * texture2D( blurTexture4, vUv ).rgb +\n						lerpBloomFactor( bloomFactors[ 4 ] ) * bloomTintColors[ 4 ] * texture2D( blurTexture5, vUv ).rgb\n					);\n\n					float bloomAlpha = max( bloom.r, max( bloom.g, bloom.b ) );\n					gl_FragColor = vec4( bloom, bloomAlpha );\n\n				}"
		});
	}
};
$u.BlurDirectionX = new H(1, 0), $u.BlurDirectionY = new H(0, 1);
//#endregion
//#region node_modules/three/examples/jsm/shaders/OutputShader.js
var ed = {
	name: "OutputShader",
	uniforms: {
		tDiffuse: { value: null },
		toneMappingExposure: { value: 1 }
	},
	vertexShader: "\n		precision highp float;\n\n		uniform mat4 modelViewMatrix;\n		uniform mat4 projectionMatrix;\n\n		attribute vec3 position;\n		attribute vec2 uv;\n\n		varying vec2 vUv;\n\n		void main() {\n\n			vUv = uv;\n			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n\n		}",
	fragmentShader: "\n\n		precision highp float;\n\n		uniform sampler2D tDiffuse;\n\n		#include <tonemapping_pars_fragment>\n		#include <colorspace_pars_fragment>\n\n		varying vec2 vUv;\n\n		void main() {\n\n			gl_FragColor = texture2D( tDiffuse, vUv );\n\n			// tone mapping\n\n			#ifdef LINEAR_TONE_MAPPING\n\n				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );\n\n			#elif defined( REINHARD_TONE_MAPPING )\n\n				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );\n\n			#elif defined( CINEON_TONE_MAPPING )\n\n				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );\n\n			#elif defined( ACES_FILMIC_TONE_MAPPING )\n\n				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );\n\n			#elif defined( AGX_TONE_MAPPING )\n\n				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );\n\n			#elif defined( NEUTRAL_TONE_MAPPING )\n\n				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );\n\n			#elif defined( CUSTOM_TONE_MAPPING )\n\n				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );\n\n			#endif\n\n			// color space\n\n			#ifdef SRGB_TRANSFER\n\n				gl_FragColor = sRGBTransferOETF( gl_FragColor );\n\n			#endif\n\n		}"
}, td = class extends Uu {
	constructor() {
		super(), this.isOutputPass = !0, this.uniforms = yi.clone(ed.uniforms), this.material = new Ci({
			name: ed.name,
			uniforms: this.uniforms,
			vertexShader: ed.vertexShader,
			fragmentShader: ed.fragmentShader
		}), this._fsQuad = new Ku(this.material), this._outputColorSpace = null, this._toneMapping = null;
	}
	render(e, t, n) {
		this.uniforms.tDiffuse.value = n.texture, this.uniforms.toneMappingExposure.value = e.toneMappingExposure, (this._outputColorSpace !== e.outputColorSpace || this._toneMapping !== e.toneMapping) && (this._outputColorSpace = e.outputColorSpace, this._toneMapping = e.toneMapping, this.material.defines = {}, K.getTransfer(this._outputColorSpace) === "srgb" && (this.material.defines.SRGB_TRANSFER = ""), this._toneMapping === 1 ? this.material.defines.LINEAR_TONE_MAPPING = "" : this._toneMapping === 2 ? this.material.defines.REINHARD_TONE_MAPPING = "" : this._toneMapping === 3 ? this.material.defines.CINEON_TONE_MAPPING = "" : this._toneMapping === 4 ? this.material.defines.ACES_FILMIC_TONE_MAPPING = "" : this._toneMapping === 6 ? this.material.defines.AGX_TONE_MAPPING = "" : this._toneMapping === 7 ? this.material.defines.NEUTRAL_TONE_MAPPING = "" : this._toneMapping === 5 && (this.material.defines.CUSTOM_TONE_MAPPING = ""), this.material.needsUpdate = !0), this.renderToScreen === !0 ? (e.setRenderTarget(null), this._fsQuad.render(e)) : (e.setRenderTarget(t), this.clear && e.clear(e.autoClearColor, e.autoClearDepth, e.autoClearStencil), this._fsQuad.render(e));
	}
	dispose() {
		this.material.dispose(), this._fsQuad.dispose();
	}
}, nd = {
	name: "GTAOShader",
	defines: {
		PERSPECTIVE_CAMERA: 1,
		SAMPLES: 16,
		NORMAL_VECTOR_TYPE: 1,
		DEPTH_SWIZZLING: "x",
		SCREEN_SPACE_RADIUS: 0,
		SCREEN_SPACE_RADIUS_SCALE: 100,
		SCENE_CLIP_BOX: 0
	},
	uniforms: {
		tNormal: { value: null },
		tDepth: { value: null },
		tNoise: { value: null },
		resolution: { value: new H() },
		cameraNear: { value: null },
		cameraFar: { value: null },
		cameraProjectionMatrix: { value: new q() },
		cameraProjectionMatrixInverse: { value: new q() },
		cameraWorldMatrix: { value: new q() },
		radius: { value: .25 },
		distanceExponent: { value: 1 },
		thickness: { value: 1 },
		distanceFallOff: { value: 1 },
		scale: { value: 1 },
		sceneBoxMin: { value: new W(-1, -1, -1) },
		sceneBoxMax: { value: new W(1, 1, 1) }
	},
	vertexShader: "\n\n		varying vec2 vUv;\n\n		void main() {\n			vUv = uv;\n			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n		}",
	fragmentShader: "\n		varying vec2 vUv;\n		uniform highp sampler2D tNormal;\n		uniform highp sampler2D tDepth;\n		uniform sampler2D tNoise;\n		uniform vec2 resolution;\n		uniform float cameraNear;\n		uniform float cameraFar;\n		uniform mat4 cameraProjectionMatrix;\n		uniform mat4 cameraProjectionMatrixInverse;\n		uniform mat4 cameraWorldMatrix;\n		uniform float radius;\n		uniform float distanceExponent;\n		uniform float thickness;\n		uniform float distanceFallOff;\n		uniform float scale;\n		#if SCENE_CLIP_BOX == 1\n			uniform vec3 sceneBoxMin;\n			uniform vec3 sceneBoxMax;\n		#endif\n\n		#include <common>\n		#include <packing>\n\n		#ifndef FRAGMENT_OUTPUT\n		#define FRAGMENT_OUTPUT vec4(vec3(ao), 1.)\n		#endif\n\n		vec3 getViewPosition( const in vec2 screenPosition, const in float depth ) {\n			#ifdef USE_REVERSED_DEPTH_BUFFER\n				vec4 clipSpacePosition = vec4( vec2( screenPosition ) * 2.0 - 1.0, depth, 1.0 );\n			#else\n				vec4 clipSpacePosition = vec4( vec3( screenPosition, depth ) * 2.0 - 1.0, 1.0 );\n			#endif\n			vec4 viewSpacePosition = cameraProjectionMatrixInverse * clipSpacePosition;\n			return viewSpacePosition.xyz / viewSpacePosition.w;\n		}\n\n		float getDepth(const vec2 uv) {\n			return textureLod(tDepth, uv.xy, 0.0).DEPTH_SWIZZLING;\n		}\n\n		float fetchDepth(const ivec2 uv) {\n			return texelFetch(tDepth, uv.xy, 0).DEPTH_SWIZZLING;\n		}\n\n		float getViewZ(const in float depth) {\n			#if PERSPECTIVE_CAMERA == 1\n				return perspectiveDepthToViewZ(depth, cameraNear, cameraFar);\n			#else\n				return orthographicDepthToViewZ(depth, cameraNear, cameraFar);\n			#endif\n		}\n\n		vec3 computeNormalFromDepth(const vec2 uv) {\n			vec2 size = vec2(textureSize(tDepth, 0));\n			ivec2 p = ivec2(uv * size);\n			float c0 = fetchDepth(p);\n			float l2 = fetchDepth(p - ivec2(2, 0));\n			float l1 = fetchDepth(p - ivec2(1, 0));\n			float r1 = fetchDepth(p + ivec2(1, 0));\n			float r2 = fetchDepth(p + ivec2(2, 0));\n			float b2 = fetchDepth(p - ivec2(0, 2));\n			float b1 = fetchDepth(p - ivec2(0, 1));\n			float t1 = fetchDepth(p + ivec2(0, 1));\n			float t2 = fetchDepth(p + ivec2(0, 2));\n			float dl = abs((2.0 * l1 - l2) - c0);\n			float dr = abs((2.0 * r1 - r2) - c0);\n			float db = abs((2.0 * b1 - b2) - c0);\n			float dt = abs((2.0 * t1 - t2) - c0);\n			vec3 ce = getViewPosition(uv, c0).xyz;\n			vec3 dpdx = (dl < dr) ? ce - getViewPosition((uv - vec2(1.0 / size.x, 0.0)), l1).xyz : -ce + getViewPosition((uv + vec2(1.0 / size.x, 0.0)), r1).xyz;\n			vec3 dpdy = (db < dt) ? ce - getViewPosition((uv - vec2(0.0, 1.0 / size.y)), b1).xyz : -ce + getViewPosition((uv + vec2(0.0, 1.0 / size.y)), t1).xyz;\n			return normalize(cross(dpdx, dpdy));\n		}\n\n		vec3 getViewNormal(const vec2 uv) {\n			#if NORMAL_VECTOR_TYPE == 2\n				return normalize(textureLod(tNormal, uv, 0.).rgb);\n			#elif NORMAL_VECTOR_TYPE == 1\n				return unpackRGBToNormal(textureLod(tNormal, uv, 0.).rgb);\n			#else\n				return computeNormalFromDepth(uv);\n			#endif\n		}\n\n		vec3 getSceneUvAndDepth(vec3 sampleViewPos) {\n			vec4 sampleClipPos = cameraProjectionMatrix * vec4(sampleViewPos, 1.);\n			vec2 sampleUv = sampleClipPos.xy / sampleClipPos.w * 0.5 + 0.5;\n			float sampleSceneDepth = getDepth(sampleUv);\n			return vec3(sampleUv, sampleSceneDepth);\n		}\n\n		void main() {\n			float depth = getDepth(vUv.xy);\n\n			#ifdef USE_REVERSED_DEPTH_BUFFER\n				if (depth <= 0.0) {\n					discard;\n					return;\n				}\n			#else\n				if (depth >= 1.0) {\n					discard;\n					return;\n				}\n			#endif\n			\n			vec3 viewPos = getViewPosition(vUv, depth);\n			vec3 viewNormal = getViewNormal(vUv);\n\n			float radiusToUse = radius;\n			float distanceFalloffToUse = thickness;\n			#if SCREEN_SPACE_RADIUS == 1\n				float radiusScale = getViewPosition(vec2(0.5 + float(SCREEN_SPACE_RADIUS_SCALE) / resolution.x, 0.0), depth).x;\n				radiusToUse *= radiusScale;\n				distanceFalloffToUse *= radiusScale;\n			#endif\n\n			#if SCENE_CLIP_BOX == 1\n				vec3 worldPos = (cameraWorldMatrix * vec4(viewPos, 1.0)).xyz;\n				float boxDistance = length(max(vec3(0.0), max(sceneBoxMin - worldPos, worldPos - sceneBoxMax)));\n				if (boxDistance > radiusToUse) {\n					discard;\n					return;\n				}\n			#endif\n\n			vec2 noiseResolution = vec2(textureSize(tNoise, 0));\n			vec2 noiseUv = vUv * resolution / noiseResolution;\n			vec4 noiseTexel = textureLod(tNoise, noiseUv, 0.0);\n			vec3 randomVec = noiseTexel.xyz * 2.0 - 1.0;\n			vec3 tangent = normalize(vec3(randomVec.xy, 0.));\n			vec3 bitangent = vec3(-tangent.y, tangent.x, 0.);\n			mat3 kernelMatrix = mat3(tangent, bitangent, vec3(0., 0., 1.));\n\n			const int DIRECTIONS = SAMPLES < 30 ? 3 : 5;\n			const int STEPS = (SAMPLES + DIRECTIONS - 1) / DIRECTIONS;\n			float ao = 0.0;\n			for (int i = 0; i < DIRECTIONS; ++i) {\n\n				float angle = float(i) / float(DIRECTIONS) * PI;\n				vec4 sampleDir = vec4(cos(angle), sin(angle), 0., 0.5 + 0.5 * noiseTexel.w);\n				sampleDir.xyz = normalize(kernelMatrix * sampleDir.xyz);\n\n				vec3 viewDir = normalize(-viewPos.xyz);\n				vec3 sliceBitangent = normalize(cross(sampleDir.xyz, viewDir));\n				vec3 sliceTangent = cross(sliceBitangent, viewDir);\n				vec3 normalInSlice = normalize(viewNormal - sliceBitangent * dot(viewNormal, sliceBitangent));\n\n				vec3 tangentToNormalInSlice = cross(normalInSlice, sliceBitangent);\n				vec2 cosHorizons = vec2(dot(viewDir, tangentToNormalInSlice), dot(viewDir, -tangentToNormalInSlice));\n\n				for (int j = 0; j < STEPS; ++j) {\n					vec3 sampleViewOffset = sampleDir.xyz * radiusToUse * sampleDir.w * pow(float(j + 1) / float(STEPS), distanceExponent);\n\n					vec3 sampleSceneUvDepth = getSceneUvAndDepth(viewPos + sampleViewOffset);\n					vec3 sampleSceneViewPos = getViewPosition(sampleSceneUvDepth.xy, sampleSceneUvDepth.z);\n					vec3 viewDelta = sampleSceneViewPos - viewPos;\n					if (abs(viewDelta.z) < thickness) {\n						float sampleCosHorizon = dot(viewDir, normalize(viewDelta));\n						cosHorizons.x += max(0., (sampleCosHorizon - cosHorizons.x) * mix(1., 2. / float(j + 2), distanceFallOff));\n					}\n\n					sampleSceneUvDepth = getSceneUvAndDepth(viewPos - sampleViewOffset);\n					sampleSceneViewPos = getViewPosition(sampleSceneUvDepth.xy, sampleSceneUvDepth.z);\n					viewDelta = sampleSceneViewPos - viewPos;\n					if (abs(viewDelta.z) < thickness) {\n						float sampleCosHorizon = dot(viewDir, normalize(viewDelta));\n						cosHorizons.y += max(0., (sampleCosHorizon - cosHorizons.y) * mix(1., 2. / float(j + 2), distanceFallOff));\n					}\n				}\n\n				vec2 sinHorizons = sqrt(1. - cosHorizons * cosHorizons);\n				float nx = dot(normalInSlice, sliceTangent);\n				float ny = dot(normalInSlice, viewDir);\n				float nxb = 1. / 2. * (acos(cosHorizons.y) - acos(cosHorizons.x) + sinHorizons.x * cosHorizons.x - sinHorizons.y * cosHorizons.y);\n				float nyb = 1. / 2. * (2. - cosHorizons.x * cosHorizons.x - cosHorizons.y * cosHorizons.y);\n				float occlusion = nx * nxb + ny * nyb;\n				ao += occlusion;\n			}\n\n			ao = clamp(ao / float(DIRECTIONS), 0., 1.);\n		#if SCENE_CLIP_BOX == 1\n			ao = mix(ao, 1., smoothstep(0., radiusToUse, boxDistance));\n		#endif\n			ao = pow(ao, scale);\n\n			gl_FragColor = FRAGMENT_OUTPUT;\n		}"
}, rd = {
	name: "GTAODepthShader",
	defines: { PERSPECTIVE_CAMERA: 1 },
	uniforms: {
		tDepth: { value: null },
		cameraNear: { value: null },
		cameraFar: { value: null }
	},
	vertexShader: "\n		varying vec2 vUv;\n\n		void main() {\n			vUv = uv;\n			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n		}",
	fragmentShader: "\n		uniform sampler2D tDepth;\n		uniform float cameraNear;\n		uniform float cameraFar;\n		varying vec2 vUv;\n\n		#include <packing>\n\n		float getLinearDepth( const in vec2 screenPosition ) {\n			#if PERSPECTIVE_CAMERA == 1\n				float fragCoordZ = texture2D( tDepth, screenPosition ).x;\n				float viewZ = perspectiveDepthToViewZ( fragCoordZ, cameraNear, cameraFar );\n				return viewZToOrthographicDepth( viewZ, cameraNear, cameraFar );\n			#else\n				return texture2D( tDepth, screenPosition ).x;\n			#endif\n		}\n\n		void main() {\n			float depth = getLinearDepth( vUv );\n			gl_FragColor = vec4( vec3( 1.0 - depth ), 1.0 );\n\n		}"
}, id = {
	name: "GTAOBlendShader",
	uniforms: {
		tDiffuse: { value: null },
		intensity: { value: 1 }
	},
	vertexShader: "\n		varying vec2 vUv;\n\n		void main() {\n			vUv = uv;\n			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n		}",
	fragmentShader: "\n		uniform float intensity;\n		uniform sampler2D tDiffuse;\n		varying vec2 vUv;\n\n		void main() {\n			vec4 texel = texture2D( tDiffuse, vUv );\n			gl_FragColor = vec4(mix(vec3(1.), texel.rgb, intensity), texel.a);\n		}"
};
function ad(t = 5) {
	let n = Math.floor(t) % 2 == 0 ? Math.floor(t) + 1 : Math.floor(t), r = od(n), i = r.length, a = new Uint8Array(i * 4);
	for (let e = 0; e < i; ++e) {
		let t = r[e], n = 2 * Math.PI * t / i, o = new W(Math.cos(n), Math.sin(n), 0).normalize();
		a[e * 4] = (o.x * .5 + .5) * 255, a[e * 4 + 1] = (o.y * .5 + .5) * 255, a[e * 4 + 2] = 127, a[e * 4 + 3] = 255;
	}
	let o = new wr(a, n, n);
	return o.wrapS = e, o.wrapT = e, o.needsUpdate = !0, o;
}
function od(e) {
	let t = Math.floor(e) % 2 == 0 ? Math.floor(e) + 1 : Math.floor(e), n = t * t, r = Array(n).fill(0), i = Math.floor(t / 2), a = t - 1;
	for (let e = 1; e <= n;) i === -1 && a === t ? (a = t - 2, i = 0) : (a === t && (a = 0), i < 0 && (i = t - 1)), r[i * t + a] === 0 ? (r[i * t + a] = e++, a++, i--) : (a -= 2, i++);
	return r;
}
//#endregion
//#region node_modules/three/examples/jsm/shaders/PoissonDenoiseShader.js
var sd = {
	name: "PoissonDenoiseShader",
	defines: {
		SAMPLES: 16,
		SAMPLE_VECTORS: cd(16, 2, 1),
		NORMAL_VECTOR_TYPE: 1,
		DEPTH_VALUE_SOURCE: 0
	},
	uniforms: {
		tDiffuse: { value: null },
		tNormal: { value: null },
		tDepth: { value: null },
		tNoise: { value: null },
		resolution: { value: new H() },
		cameraProjectionMatrixInverse: { value: new q() },
		lumaPhi: { value: 5 },
		depthPhi: { value: 5 },
		normalPhi: { value: 5 },
		radius: { value: 4 },
		index: { value: 0 }
	},
	vertexShader: "\n\n		varying vec2 vUv;\n\n		void main() {\n			vUv = uv;\n			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n		}",
	fragmentShader: "\n\n		varying vec2 vUv;\n\n		uniform sampler2D tDiffuse;\n		uniform sampler2D tNormal;\n		uniform sampler2D tDepth;\n		uniform sampler2D tNoise;\n		uniform vec2 resolution;\n		uniform mat4 cameraProjectionMatrixInverse;\n		uniform float lumaPhi;\n		uniform float depthPhi;\n		uniform float normalPhi;\n		uniform float radius;\n		uniform int index;\n\n		#include <common>\n		#include <packing>\n\n		#ifndef SAMPLE_LUMINANCE\n		#define SAMPLE_LUMINANCE dot(vec3(0.2125, 0.7154, 0.0721), a)\n		#endif\n\n		#ifndef FRAGMENT_OUTPUT\n		#define FRAGMENT_OUTPUT vec4(denoised, 1.)\n		#endif\n\n		float getLuminance(const in vec3 a) {\n			return SAMPLE_LUMINANCE;\n		}\n\n		const vec3 poissonDisk[SAMPLES] = SAMPLE_VECTORS;\n\n		vec3 getViewPosition( const in vec2 screenPosition, const in float depth ) {\n			#ifdef USE_REVERSED_DEPTH_BUFFER\n				vec4 clipSpacePosition = vec4( vec2( screenPosition ) * 2.0 - 1.0, depth, 1.0 );\n			#else\n				vec4 clipSpacePosition = vec4( vec3( screenPosition, depth ) * 2.0 - 1.0, 1.0 );\n			#endif\n			vec4 viewSpacePosition = cameraProjectionMatrixInverse * clipSpacePosition;\n			return viewSpacePosition.xyz / viewSpacePosition.w;\n		}\n\n		float getDepth(const vec2 uv) {\n		#if DEPTH_VALUE_SOURCE == 1\n			return textureLod(tDepth, uv.xy, 0.0).a;\n		#else\n			return textureLod(tDepth, uv.xy, 0.0).r;\n		#endif\n		}\n\n		float fetchDepth(const ivec2 uv) {\n			#if DEPTH_VALUE_SOURCE == 1\n				return texelFetch(tDepth, uv.xy, 0).a;\n			#else\n				return texelFetch(tDepth, uv.xy, 0).r;\n			#endif\n		}\n\n		vec3 computeNormalFromDepth(const vec2 uv) {\n			vec2 size = vec2(textureSize(tDepth, 0));\n			ivec2 p = ivec2(uv * size);\n			float c0 = fetchDepth(p);\n			float l2 = fetchDepth(p - ivec2(2, 0));\n			float l1 = fetchDepth(p - ivec2(1, 0));\n			float r1 = fetchDepth(p + ivec2(1, 0));\n			float r2 = fetchDepth(p + ivec2(2, 0));\n			float b2 = fetchDepth(p - ivec2(0, 2));\n			float b1 = fetchDepth(p - ivec2(0, 1));\n			float t1 = fetchDepth(p + ivec2(0, 1));\n			float t2 = fetchDepth(p + ivec2(0, 2));\n			float dl = abs((2.0 * l1 - l2) - c0);\n			float dr = abs((2.0 * r1 - r2) - c0);\n			float db = abs((2.0 * b1 - b2) - c0);\n			float dt = abs((2.0 * t1 - t2) - c0);\n			vec3 ce = getViewPosition(uv, c0).xyz;\n			vec3 dpdx = (dl < dr) ?  ce - getViewPosition((uv - vec2(1.0 / size.x, 0.0)), l1).xyz\n									: -ce + getViewPosition((uv + vec2(1.0 / size.x, 0.0)), r1).xyz;\n			vec3 dpdy = (db < dt) ?  ce - getViewPosition((uv - vec2(0.0, 1.0 / size.y)), b1).xyz\n									: -ce + getViewPosition((uv + vec2(0.0, 1.0 / size.y)), t1).xyz;\n			return normalize(cross(dpdx, dpdy));\n		}\n\n		vec3 getViewNormal(const vec2 uv) {\n		#if NORMAL_VECTOR_TYPE == 2\n			return normalize(textureLod(tNormal, uv, 0.).rgb);\n		#elif NORMAL_VECTOR_TYPE == 1\n			return unpackRGBToNormal(textureLod(tNormal, uv, 0.).rgb);\n		#else\n			return computeNormalFromDepth(uv);\n		#endif\n		}\n\n		void denoiseSample(in vec3 center, in vec3 viewNormal, in vec3 viewPos, in vec2 sampleUv, inout vec3 denoised, inout float totalWeight) {\n			vec4 sampleTexel = textureLod(tDiffuse, sampleUv, 0.0);\n			float sampleDepth = getDepth(sampleUv);\n			vec3 sampleNormal = getViewNormal(sampleUv);\n			vec3 neighborColor = sampleTexel.rgb;\n			vec3 viewPosSample = getViewPosition(sampleUv, sampleDepth);\n\n			float normalDiff = dot(viewNormal, sampleNormal);\n			float normalSimilarity = pow(max(normalDiff, 0.), normalPhi);\n			float lumaDiff = abs(getLuminance(neighborColor) - getLuminance(center));\n			float lumaSimilarity = max(1.0 - lumaDiff / lumaPhi, 0.0);\n			float depthDiff = abs(dot(viewPos - viewPosSample, viewNormal));\n			float depthSimilarity = max(1. - depthDiff / depthPhi, 0.);\n			float w = lumaSimilarity * depthSimilarity * normalSimilarity;\n\n			denoised += w * neighborColor;\n			totalWeight += w;\n		}\n\n		void main() {\n			float depth = getDepth(vUv.xy);\n			vec3 viewNormal = getViewNormal(vUv);\n			if (depth == 1. || dot(viewNormal, viewNormal) == 0.) {\n				discard;\n				return;\n			}\n			vec4 texel = textureLod(tDiffuse, vUv, 0.0);\n			vec3 center = texel.rgb;\n			vec3 viewPos = getViewPosition(vUv, depth);\n\n			vec2 noiseResolution = vec2(textureSize(tNoise, 0));\n			vec2 noiseUv = vUv * resolution / noiseResolution;\n			vec4 noiseTexel = textureLod(tNoise, noiseUv, 0.0);\n      		vec2 noiseVec = vec2(sin(noiseTexel[index % 4] * 2. * PI), cos(noiseTexel[index % 4] * 2. * PI));\n    		mat2 rotationMatrix = mat2(noiseVec.x, -noiseVec.y, noiseVec.x, noiseVec.y);\n\n			float totalWeight = 1.0;\n			vec3 denoised = texel.rgb;\n			for (int i = 0; i < SAMPLES; i++) {\n				vec3 sampleDir = poissonDisk[i];\n				vec2 offset = rotationMatrix * (sampleDir.xy * (1. + sampleDir.z * (radius - 1.)) / resolution);\n				vec2 sampleUv = vUv + offset;\n				denoiseSample(center, viewNormal, viewPos, sampleUv, denoised, totalWeight);\n			}\n\n			if (totalWeight > 0.) {\n				denoised /= totalWeight;\n			}\n			gl_FragColor = FRAGMENT_OUTPUT;\n		}"
};
function cd(e, t, n) {
	let r = ld(e, t, n), i = "vec3[SAMPLES](";
	for (let t = 0; t < e; t++) {
		let n = r[t];
		i += `vec3(${n.x}, ${n.y}, ${n.z})${t < e - 1 ? "," : ")"}`;
	}
	return i;
}
function ld(e, t, n) {
	let r = [];
	for (let i = 0; i < e; i++) {
		let a = 2 * Math.PI * t * i / e, o = (i / (e - 1)) ** n;
		r.push(new W(Math.cos(a), Math.sin(a), o));
	}
	return r;
}
//#endregion
//#region node_modules/three/examples/jsm/math/SimplexNoise.js
var ud = class {
	constructor(e = Math) {
		this.grad3 = [
			[
				1,
				1,
				0
			],
			[
				-1,
				1,
				0
			],
			[
				1,
				-1,
				0
			],
			[
				-1,
				-1,
				0
			],
			[
				1,
				0,
				1
			],
			[
				-1,
				0,
				1
			],
			[
				1,
				0,
				-1
			],
			[
				-1,
				0,
				-1
			],
			[
				0,
				1,
				1
			],
			[
				0,
				-1,
				1
			],
			[
				0,
				1,
				-1
			],
			[
				0,
				-1,
				-1
			]
		], this.grad4 = [
			[
				0,
				1,
				1,
				1
			],
			[
				0,
				1,
				1,
				-1
			],
			[
				0,
				1,
				-1,
				1
			],
			[
				0,
				1,
				-1,
				-1
			],
			[
				0,
				-1,
				1,
				1
			],
			[
				0,
				-1,
				1,
				-1
			],
			[
				0,
				-1,
				-1,
				1
			],
			[
				0,
				-1,
				-1,
				-1
			],
			[
				1,
				0,
				1,
				1
			],
			[
				1,
				0,
				1,
				-1
			],
			[
				1,
				0,
				-1,
				1
			],
			[
				1,
				0,
				-1,
				-1
			],
			[
				-1,
				0,
				1,
				1
			],
			[
				-1,
				0,
				1,
				-1
			],
			[
				-1,
				0,
				-1,
				1
			],
			[
				-1,
				0,
				-1,
				-1
			],
			[
				1,
				1,
				0,
				1
			],
			[
				1,
				1,
				0,
				-1
			],
			[
				1,
				-1,
				0,
				1
			],
			[
				1,
				-1,
				0,
				-1
			],
			[
				-1,
				1,
				0,
				1
			],
			[
				-1,
				1,
				0,
				-1
			],
			[
				-1,
				-1,
				0,
				1
			],
			[
				-1,
				-1,
				0,
				-1
			],
			[
				1,
				1,
				1,
				0
			],
			[
				1,
				1,
				-1,
				0
			],
			[
				1,
				-1,
				1,
				0
			],
			[
				1,
				-1,
				-1,
				0
			],
			[
				-1,
				1,
				1,
				0
			],
			[
				-1,
				1,
				-1,
				0
			],
			[
				-1,
				-1,
				1,
				0
			],
			[
				-1,
				-1,
				-1,
				0
			]
		], this.p = [];
		for (let t = 0; t < 256; t++) this.p[t] = Math.floor(e.random() * 256);
		this.perm = [];
		for (let e = 0; e < 512; e++) this.perm[e] = this.p[e & 255];
		this.simplex = [
			[
				0,
				1,
				2,
				3
			],
			[
				0,
				1,
				3,
				2
			],
			[
				0,
				0,
				0,
				0
			],
			[
				0,
				2,
				3,
				1
			],
			[
				0,
				0,
				0,
				0
			],
			[
				0,
				0,
				0,
				0
			],
			[
				0,
				0,
				0,
				0
			],
			[
				1,
				2,
				3,
				0
			],
			[
				0,
				2,
				1,
				3
			],
			[
				0,
				0,
				0,
				0
			],
			[
				0,
				3,
				1,
				2
			],
			[
				0,
				3,
				2,
				1
			],
			[
				0,
				0,
				0,
				0
			],
			[
				0,
				0,
				0,
				0
			],
			[
				0,
				0,
				0,
				0
			],
			[
				1,
				3,
				2,
				0
			],
			[
				0,
				0,
				0,
				0
			],
			[
				0,
				0,
				0,
				0
			],
			[
				0,
				0,
				0,
				0
			],
			[
				0,
				0,
				0,
				0
			],
			[
				0,
				0,
				0,
				0
			],
			[
				0,
				0,
				0,
				0
			],
			[
				0,
				0,
				0,
				0
			],
			[
				0,
				0,
				0,
				0
			],
			[
				1,
				2,
				0,
				3
			],
			[
				0,
				0,
				0,
				0
			],
			[
				1,
				3,
				0,
				2
			],
			[
				0,
				0,
				0,
				0
			],
			[
				0,
				0,
				0,
				0
			],
			[
				0,
				0,
				0,
				0
			],
			[
				2,
				3,
				0,
				1
			],
			[
				2,
				3,
				1,
				0
			],
			[
				1,
				0,
				2,
				3
			],
			[
				1,
				0,
				3,
				2
			],
			[
				0,
				0,
				0,
				0
			],
			[
				0,
				0,
				0,
				0
			],
			[
				0,
				0,
				0,
				0
			],
			[
				2,
				0,
				3,
				1
			],
			[
				0,
				0,
				0,
				0
			],
			[
				2,
				1,
				3,
				0
			],
			[
				0,
				0,
				0,
				0
			],
			[
				0,
				0,
				0,
				0
			],
			[
				0,
				0,
				0,
				0
			],
			[
				0,
				0,
				0,
				0
			],
			[
				0,
				0,
				0,
				0
			],
			[
				0,
				0,
				0,
				0
			],
			[
				0,
				0,
				0,
				0
			],
			[
				0,
				0,
				0,
				0
			],
			[
				2,
				0,
				1,
				3
			],
			[
				0,
				0,
				0,
				0
			],
			[
				0,
				0,
				0,
				0
			],
			[
				0,
				0,
				0,
				0
			],
			[
				3,
				0,
				1,
				2
			],
			[
				3,
				0,
				2,
				1
			],
			[
				0,
				0,
				0,
				0
			],
			[
				3,
				1,
				2,
				0
			],
			[
				2,
				1,
				0,
				3
			],
			[
				0,
				0,
				0,
				0
			],
			[
				0,
				0,
				0,
				0
			],
			[
				0,
				0,
				0,
				0
			],
			[
				3,
				1,
				0,
				2
			],
			[
				0,
				0,
				0,
				0
			],
			[
				3,
				2,
				0,
				1
			],
			[
				3,
				2,
				1,
				0
			]
		];
	}
	noise(e, t) {
		let n, r, i, a = .5 * (Math.sqrt(3) - 1), o = (e + t) * a, s = Math.floor(e + o), c = Math.floor(t + o), l = (3 - Math.sqrt(3)) / 6, u = (s + c) * l, d = s - u, f = c - u, p = e - d, m = t - f, h, g;
		p > m ? (h = 1, g = 0) : (h = 0, g = 1);
		let _ = p - h + l, v = m - g + l, y = p - 1 + 2 * l, b = m - 1 + 2 * l, x = s & 255, S = c & 255, C = this.perm[x + this.perm[S]] % 12, w = this.perm[x + h + this.perm[S + g]] % 12, T = this.perm[x + 1 + this.perm[S + 1]] % 12, E = .5 - p * p - m * m;
		E < 0 ? n = 0 : (E *= E, n = E * E * this._dot(this.grad3[C], p, m));
		let D = .5 - _ * _ - v * v;
		D < 0 ? r = 0 : (D *= D, r = D * D * this._dot(this.grad3[w], _, v));
		let O = .5 - y * y - b * b;
		return O < 0 ? i = 0 : (O *= O, i = O * O * this._dot(this.grad3[T], y, b)), 70 * (n + r + i);
	}
	noise3d(e, t, n) {
		let r, i, a, o, s = (e + t + n) * (1 / 3), c = Math.floor(e + s), l = Math.floor(t + s), u = Math.floor(n + s), d = 1 / 6, f = (c + l + u) * d, p = c - f, m = l - f, h = u - f, g = e - p, _ = t - m, v = n - h, y, b, x, S, C, w;
		g >= _ ? _ >= v ? (y = 1, b = 0, x = 0, S = 1, C = 1, w = 0) : g >= v ? (y = 1, b = 0, x = 0, S = 1, C = 0, w = 1) : (y = 0, b = 0, x = 1, S = 1, C = 0, w = 1) : _ < v ? (y = 0, b = 0, x = 1, S = 0, C = 1, w = 1) : g < v ? (y = 0, b = 1, x = 0, S = 0, C = 1, w = 1) : (y = 0, b = 1, x = 0, S = 1, C = 1, w = 0);
		let T = g - y + d, E = _ - b + d, D = v - x + d, O = g - S + 2 * d, ee = _ - C + 2 * d, k = v - w + 2 * d, A = g - 1 + 3 * d, j = _ - 1 + 3 * d, te = v - 1 + 3 * d, M = c & 255, N = l & 255, ne = u & 255, P = this.perm[M + this.perm[N + this.perm[ne]]] % 12, re = this.perm[M + y + this.perm[N + b + this.perm[ne + x]]] % 12, F = this.perm[M + S + this.perm[N + C + this.perm[ne + w]]] % 12, ie = this.perm[M + 1 + this.perm[N + 1 + this.perm[ne + 1]]] % 12, ae = .6 - g * g - _ * _ - v * v;
		ae < 0 ? r = 0 : (ae *= ae, r = ae * ae * this._dot3(this.grad3[P], g, _, v));
		let oe = .6 - T * T - E * E - D * D;
		oe < 0 ? i = 0 : (oe *= oe, i = oe * oe * this._dot3(this.grad3[re], T, E, D));
		let se = .6 - O * O - ee * ee - k * k;
		se < 0 ? a = 0 : (se *= se, a = se * se * this._dot3(this.grad3[F], O, ee, k));
		let ce = .6 - A * A - j * j - te * te;
		return ce < 0 ? o = 0 : (ce *= ce, o = ce * ce * this._dot3(this.grad3[ie], A, j, te)), 32 * (r + i + a + o);
	}
	noise4d(e, t, n, r) {
		let i = this.grad4, a = this.simplex, o = this.perm, s = (Math.sqrt(5) - 1) / 4, c = (5 - Math.sqrt(5)) / 20, l, u, d, f, p, m = (e + t + n + r) * s, h = Math.floor(e + m), g = Math.floor(t + m), _ = Math.floor(n + m), v = Math.floor(r + m), y = (h + g + _ + v) * c, b = h - y, x = g - y, S = _ - y, C = v - y, w = e - b, T = t - x, E = n - S, D = r - C, O = w > T ? 32 : 0, ee = w > E ? 16 : 0, k = T > E ? 8 : 0, A = w > D ? 4 : 0, j = T > D ? 2 : 0, te = +(E > D), M = O + ee + k + A + j + te, N = +(a[M][0] >= 3), ne = +(a[M][1] >= 3), P = +(a[M][2] >= 3), re = +(a[M][3] >= 3), F = +(a[M][0] >= 2), ie = +(a[M][1] >= 2), ae = +(a[M][2] >= 2), oe = +(a[M][3] >= 2), se = +(a[M][0] >= 1), ce = +(a[M][1] >= 1), le = +(a[M][2] >= 1), ue = +(a[M][3] >= 1), de = w - N + c, I = T - ne + c, L = E - P + c, fe = D - re + c, pe = w - F + 2 * c, me = T - ie + 2 * c, he = E - ae + 2 * c, ge = D - oe + 2 * c, _e = w - se + 3 * c, ve = T - ce + 3 * c, ye = E - le + 3 * c, be = D - ue + 3 * c, R = w - 1 + 4 * c, xe = T - 1 + 4 * c, Se = E - 1 + 4 * c, Ce = D - 1 + 4 * c, we = h & 255, Te = g & 255, Ee = _ & 255, De = v & 255, Oe = o[we + o[Te + o[Ee + o[De]]]] % 32, ke = o[we + N + o[Te + ne + o[Ee + P + o[De + re]]]] % 32, Ae = o[we + F + o[Te + ie + o[Ee + ae + o[De + oe]]]] % 32, je = o[we + se + o[Te + ce + o[Ee + le + o[De + ue]]]] % 32, Me = o[we + 1 + o[Te + 1 + o[Ee + 1 + o[De + 1]]]] % 32, Ne = .6 - w * w - T * T - E * E - D * D;
		Ne < 0 ? l = 0 : (Ne *= Ne, l = Ne * Ne * this._dot4(i[Oe], w, T, E, D));
		let Pe = .6 - de * de - I * I - L * L - fe * fe;
		Pe < 0 ? u = 0 : (Pe *= Pe, u = Pe * Pe * this._dot4(i[ke], de, I, L, fe));
		let Fe = .6 - pe * pe - me * me - he * he - ge * ge;
		Fe < 0 ? d = 0 : (Fe *= Fe, d = Fe * Fe * this._dot4(i[Ae], pe, me, he, ge));
		let Ie = .6 - _e * _e - ve * ve - ye * ye - be * be;
		Ie < 0 ? f = 0 : (Ie *= Ie, f = Ie * Ie * this._dot4(i[je], _e, ve, ye, be));
		let z = .6 - R * R - xe * xe - Se * Se - Ce * Ce;
		return z < 0 ? p = 0 : (z *= z, p = z * z * this._dot4(i[Me], R, xe, Se, Ce)), 27 * (l + u + d + f + p);
	}
	_dot(e, t, n) {
		return e[0] * t + e[1] * n;
	}
	_dot3(e, t, n, r) {
		return e[0] * t + e[1] * n + e[2] * r;
	}
	_dot4(e, t, n, r, i) {
		return e[0] * t + e[1] * n + e[2] * r + e[3] * i;
	}
}, dd = class t extends Uu {
	constructor(e, t, n = 512, r = 512, i, a, o) {
		super(), this.width = n, this.height = r, this.clear = !0, this.camera = t, this.scene = e, this.output = 0, this._renderGBuffer = !0, this._visibilityCache = [], this.blendIntensity = 1, this.pdRings = 2, this.pdRadiusExponent = 2, this.pdSamples = 16, this.gtaoNoiseTexture = ad(), this.pdNoiseTexture = this._generateNoise(), this.gtaoRenderTarget = new rt(this.width, this.height, {
			type: p,
			depthBuffer: !1
		}), this.pdRenderTarget = this.gtaoRenderTarget.clone(), this.gtaoMaterial = new Si({
			defines: Object.assign({}, nd.defines),
			uniforms: yi.clone(nd.uniforms),
			vertexShader: nd.vertexShader,
			fragmentShader: nd.fragmentShader,
			blending: 0,
			depthTest: !1,
			depthWrite: !1
		}), this.gtaoMaterial.defines.PERSPECTIVE_CAMERA = +!!this.camera.isPerspectiveCamera, this.gtaoMaterial.uniforms.tNoise.value = this.gtaoNoiseTexture, this.gtaoMaterial.uniforms.resolution.value.set(this.width, this.height), this.gtaoMaterial.uniforms.cameraNear.value = this.camera.near, this.gtaoMaterial.uniforms.cameraFar.value = this.camera.far, this.normalMaterial = new Ei(), this.normalMaterial.blending = 0, this.pdMaterial = new Si({
			defines: Object.assign({}, sd.defines),
			uniforms: yi.clone(sd.uniforms),
			vertexShader: sd.vertexShader,
			fragmentShader: sd.fragmentShader,
			depthTest: !1,
			depthWrite: !1
		}), this.pdMaterial.uniforms.tDiffuse.value = this.gtaoRenderTarget.texture, this.pdMaterial.uniforms.tNoise.value = this.pdNoiseTexture, this.pdMaterial.uniforms.resolution.value.set(this.width, this.height), this.pdMaterial.uniforms.lumaPhi.value = 10, this.pdMaterial.uniforms.depthPhi.value = 2, this.pdMaterial.uniforms.normalPhi.value = 3, this.pdMaterial.uniforms.radius.value = 8, this.depthRenderMaterial = new Si({
			defines: Object.assign({}, rd.defines),
			uniforms: yi.clone(rd.uniforms),
			vertexShader: rd.vertexShader,
			fragmentShader: rd.fragmentShader,
			blending: 0
		}), this.depthRenderMaterial.uniforms.cameraNear.value = this.camera.near, this.depthRenderMaterial.uniforms.cameraFar.value = this.camera.far, this.copyMaterial = new Si({
			uniforms: yi.clone(Hu.uniforms),
			vertexShader: Hu.vertexShader,
			fragmentShader: Hu.fragmentShader,
			transparent: !0,
			depthTest: !1,
			depthWrite: !1,
			blendSrc: 208,
			blendDst: 200,
			blendEquation: 100,
			blendSrcAlpha: 206,
			blendDstAlpha: 200,
			blendEquationAlpha: 100
		}), this.blendMaterial = new Si({
			uniforms: yi.clone(id.uniforms),
			vertexShader: id.vertexShader,
			fragmentShader: id.fragmentShader,
			transparent: !0,
			depthTest: !1,
			depthWrite: !1,
			blending: 5,
			blendSrc: 208,
			blendDst: 200,
			blendEquation: 100,
			blendSrcAlpha: 206,
			blendDstAlpha: 200,
			blendEquationAlpha: 100
		}), this._fsQuad = new Ku(null), this._originalClearColor = new J(), this.setGBuffer(i ? i.depthTexture : void 0, i ? i.normalTexture : void 0), a !== void 0 && this.updateGtaoMaterial(a), o !== void 0 && this.updatePdMaterial(o);
	}
	setSize(e, t) {
		this.width = e, this.height = t, this.gtaoRenderTarget.setSize(e, t), this.normalRenderTarget.setSize(e, t), this.pdRenderTarget.setSize(e, t), this.gtaoMaterial.uniforms.resolution.value.set(e, t), this.gtaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix), this.gtaoMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse), this.pdMaterial.uniforms.resolution.value.set(e, t), this.pdMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse);
	}
	dispose() {
		this.gtaoNoiseTexture.dispose(), this.pdNoiseTexture.dispose(), this.normalRenderTarget.dispose(), this.gtaoRenderTarget.dispose(), this.pdRenderTarget.dispose(), this.normalMaterial.dispose(), this.pdMaterial.dispose(), this.copyMaterial.dispose(), this.depthRenderMaterial.dispose(), this._fsQuad.dispose();
	}
	get gtaoMap() {
		return this.pdRenderTarget.texture;
	}
	setGBuffer(e, t) {
		e === void 0 ? (this.depthTexture = new li(), this.depthTexture.format = y, this.depthTexture.type = g, this.normalRenderTarget = new rt(this.width, this.height, {
			minFilter: r,
			magFilter: r,
			type: p,
			depthTexture: this.depthTexture
		}), this.normalTexture = this.normalRenderTarget.texture, this._renderGBuffer = !0) : (this.depthTexture = e, this.normalTexture = t, this._renderGBuffer = !1);
		let n = +!!this.normalTexture, i = this.depthTexture === this.normalTexture ? "w" : "x";
		this.gtaoMaterial.defines.NORMAL_VECTOR_TYPE = n, this.gtaoMaterial.defines.DEPTH_SWIZZLING = i, this.gtaoMaterial.uniforms.tNormal.value = this.normalTexture, this.gtaoMaterial.uniforms.tDepth.value = this.depthTexture, this.pdMaterial.defines.NORMAL_VECTOR_TYPE = n, this.pdMaterial.defines.DEPTH_SWIZZLING = i, this.pdMaterial.uniforms.tNormal.value = this.normalTexture, this.pdMaterial.uniforms.tDepth.value = this.depthTexture, this.depthRenderMaterial.uniforms.tDepth.value = this.normalRenderTarget.depthTexture;
	}
	setSceneClipBox(e) {
		e ? (this.gtaoMaterial.needsUpdate = this.gtaoMaterial.defines.SCENE_CLIP_BOX !== 1, this.gtaoMaterial.defines.SCENE_CLIP_BOX = 1, this.gtaoMaterial.uniforms.sceneBoxMin.value.copy(e.min), this.gtaoMaterial.uniforms.sceneBoxMax.value.copy(e.max)) : (this.gtaoMaterial.needsUpdate = this.gtaoMaterial.defines.SCENE_CLIP_BOX === 0, this.gtaoMaterial.defines.SCENE_CLIP_BOX = 0);
	}
	updateGtaoMaterial(e) {
		e.radius !== void 0 && (this.gtaoMaterial.uniforms.radius.value = e.radius), e.distanceExponent !== void 0 && (this.gtaoMaterial.uniforms.distanceExponent.value = e.distanceExponent), e.thickness !== void 0 && (this.gtaoMaterial.uniforms.thickness.value = e.thickness), e.distanceFallOff !== void 0 && (this.gtaoMaterial.uniforms.distanceFallOff.value = e.distanceFallOff, this.gtaoMaterial.needsUpdate = !0), e.scale !== void 0 && (this.gtaoMaterial.uniforms.scale.value = e.scale), e.samples !== void 0 && e.samples !== this.gtaoMaterial.defines.SAMPLES && (this.gtaoMaterial.defines.SAMPLES = e.samples, this.gtaoMaterial.needsUpdate = !0), e.screenSpaceRadius !== void 0 && +!!e.screenSpaceRadius !== this.gtaoMaterial.defines.SCREEN_SPACE_RADIUS && (this.gtaoMaterial.defines.SCREEN_SPACE_RADIUS = +!!e.screenSpaceRadius, this.gtaoMaterial.needsUpdate = !0);
	}
	updatePdMaterial(e) {
		let t = !1;
		e.lumaPhi !== void 0 && (this.pdMaterial.uniforms.lumaPhi.value = e.lumaPhi), e.depthPhi !== void 0 && (this.pdMaterial.uniforms.depthPhi.value = e.depthPhi), e.normalPhi !== void 0 && (this.pdMaterial.uniforms.normalPhi.value = e.normalPhi), e.radius !== void 0 && e.radius !== this.radius && (this.pdMaterial.uniforms.radius.value = e.radius), e.radiusExponent !== void 0 && e.radiusExponent !== this.pdRadiusExponent && (this.pdRadiusExponent = e.radiusExponent, t = !0), e.rings !== void 0 && e.rings !== this.pdRings && (this.pdRings = e.rings, t = !0), e.samples !== void 0 && e.samples !== this.pdSamples && (this.pdSamples = e.samples, t = !0), t && (this.pdMaterial.defines.SAMPLES = this.pdSamples, this.pdMaterial.defines.SAMPLE_VECTORS = cd(this.pdSamples, this.pdRings, this.pdRadiusExponent), this.pdMaterial.needsUpdate = !0);
	}
	render(e, n, r) {
		switch (this._renderGBuffer && (this._overrideVisibility(), this._renderOverride(e, this.normalMaterial, this.normalRenderTarget, 7829503, 1), this._restoreVisibility()), this.gtaoMaterial.uniforms.cameraNear.value = this.camera.near, this.gtaoMaterial.uniforms.cameraFar.value = this.camera.far, this.gtaoMaterial.uniforms.cameraProjectionMatrix.value.copy(this.camera.projectionMatrix), this.gtaoMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse), this.gtaoMaterial.uniforms.cameraWorldMatrix.value.copy(this.camera.matrixWorld), this._renderPass(e, this.gtaoMaterial, this.gtaoRenderTarget, 16777215, 1), this.pdMaterial.uniforms.cameraProjectionMatrixInverse.value.copy(this.camera.projectionMatrixInverse), this._renderPass(e, this.pdMaterial, this.pdRenderTarget, 16777215, 1), this.output) {
			case t.OUTPUT.Off: break;
			case t.OUTPUT.Diffuse:
				this.copyMaterial.uniforms.tDiffuse.value = r.texture, this.copyMaterial.blending = 0, this._renderPass(e, this.copyMaterial, this.renderToScreen ? null : n);
				break;
			case t.OUTPUT.AO:
				this.copyMaterial.uniforms.tDiffuse.value = this.gtaoRenderTarget.texture, this.copyMaterial.blending = 0, this._renderPass(e, this.copyMaterial, this.renderToScreen ? null : n);
				break;
			case t.OUTPUT.Denoise:
				this.copyMaterial.uniforms.tDiffuse.value = this.pdRenderTarget.texture, this.copyMaterial.blending = 0, this._renderPass(e, this.copyMaterial, this.renderToScreen ? null : n);
				break;
			case t.OUTPUT.Depth:
				this.depthRenderMaterial.uniforms.cameraNear.value = this.camera.near, this.depthRenderMaterial.uniforms.cameraFar.value = this.camera.far, this._renderPass(e, this.depthRenderMaterial, this.renderToScreen ? null : n);
				break;
			case t.OUTPUT.Normal:
				this.copyMaterial.uniforms.tDiffuse.value = this.normalRenderTarget.texture, this.copyMaterial.blending = 0, this._renderPass(e, this.copyMaterial, this.renderToScreen ? null : n);
				break;
			case t.OUTPUT.Default:
				this.copyMaterial.uniforms.tDiffuse.value = r.texture, this.copyMaterial.blending = 0, this._renderPass(e, this.copyMaterial, this.renderToScreen ? null : n), this.blendMaterial.uniforms.intensity.value = this.blendIntensity, this.blendMaterial.uniforms.tDiffuse.value = this.pdRenderTarget.texture, this._renderPass(e, this.blendMaterial, this.renderToScreen ? null : n);
				break;
			default: console.warn("THREE.GTAOPass: Unknown output type.");
		}
	}
	_renderPass(e, t, n, r, i) {
		e.getClearColor(this._originalClearColor);
		let a = e.getClearAlpha(), o = e.autoClear;
		e.setRenderTarget(n), e.autoClear = !1, r != null && (e.setClearColor(r), e.setClearAlpha(i || 0), e.clear()), this._fsQuad.material = t, this._fsQuad.render(e), e.autoClear = o, e.setClearColor(this._originalClearColor), e.setClearAlpha(a);
	}
	_renderOverride(e, t, n, r, i) {
		e.getClearColor(this._originalClearColor);
		let a = e.getClearAlpha(), o = e.autoClear;
		e.setRenderTarget(n), e.autoClear = !1, r = t.clearColor || r, i = t.clearAlpha || i, r != null && (e.setClearColor(r), e.setClearAlpha(i || 0), e.clear()), this.scene.overrideMaterial = t, e.render(this.scene, this.camera), this.scene.overrideMaterial = null, e.autoClear = o, e.setClearColor(this._originalClearColor), e.setClearAlpha(a);
	}
	_overrideVisibility() {
		let e = this.scene, t = this._visibilityCache;
		e.traverse(function(e) {
			(e.isPoints || e.isLine || e.isLine2) && e.visible && (e.visible = !1, t.push(e));
		});
	}
	_restoreVisibility() {
		let e = this._visibilityCache;
		for (let t = 0; t < e.length; t++) e[t].visible = !0;
		e.length = 0;
	}
	_generateNoise(t = 64) {
		let n = new ud(), r = t * t * 4, i = new Uint8Array(r);
		for (let e = 0; e < t; e++) for (let r = 0; r < t; r++) {
			let a = e, o = r;
			i[(e * t + r) * 4] = (n.noise(a, o) * .5 + .5) * 255, i[(e * t + r) * 4 + 1] = (n.noise(a + t, o) * .5 + .5) * 255, i[(e * t + r) * 4 + 2] = (n.noise(a, o + t) * .5 + .5) * 255, i[(e * t + r) * 4 + 3] = (n.noise(a + t, o + t) * .5 + .5) * 255;
		}
		let a = new wr(i, t, t, _, l);
		return a.wrapS = e, a.wrapT = e, a.needsUpdate = !0, a;
	}
};
dd.OUTPUT = {
	Off: -1,
	Default: 0,
	Diffuse: 1,
	Depth: 2,
	Normal: 3,
	AO: 4,
	Denoise: 5
};
//#endregion
//#region src/postfx.js
var fd = {
	uniforms: {
		tDiffuse: { value: null },
		uLightPos: { value: new H(.5, .5) },
		uIntensity: { value: 1 },
		uAspect: { value: 1 }
	},
	vertexShader: "\n    varying vec2 vUv;\n    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }\n  ",
	fragmentShader: "\n    uniform sampler2D tDiffuse;\n    uniform vec2 uLightPos;\n    uniform float uIntensity;\n    uniform float uAspect;\n    varying vec2 vUv;\n    #define SAMPLES 48\n    void main() {\n      vec4 base = texture2D(tDiffuse, vUv);\n      if (uIntensity <= 0.001) { gl_FragColor = base; return; }\n      // 从当前像素朝光源方向等距采样，越靠光源累加权重越高\n      vec2 delta = (vUv - uLightPos) / float(SAMPLES);\n      delta.x *= uAspect;\n      vec3 acc = vec3(0.0);\n      float illum = 1.0;\n      vec2 cur = vUv;\n      for (int i = 0; i < SAMPLES; i++) {\n        cur -= delta;\n        // 4 抽头软化：避免把太阳那样的硬亮核直接拉成十字星芒\n        float soft = 0.0018;\n        vec3 s = texture2D(tDiffuse, cur).rgb * 0.4;\n        s += texture2D(tDiffuse, cur + vec2(soft, 0.0)).rgb * 0.15;\n        s += texture2D(tDiffuse, cur - vec2(soft, 0.0)).rgb * 0.15;\n        s += texture2D(tDiffuse, cur + vec2(0.0, soft)).rgb * 0.15;\n        s += texture2D(tDiffuse, cur - vec2(0.0, soft)).rgb * 0.15;\n        float lum = max(max(s.r, s.g), s.b);\n        acc += s * smoothstep(0.42, 1.0, lum) * illum;   // 只有亮部（窗外天空 / 灯芯）才发出光束\n        illum *= 0.96;\n      }\n      acc /= float(SAMPLES);\n      // 光源屏幕位置附近必须淡出：径向模糊在亮核两侧的采样方向相反，\n      // 会糊出一个十字星芒（太阳/月亮/灯芯这种小亮核尤其明显）。\n      float dist = length((vUv - uLightPos) * vec2(uAspect, 1.0));\n      float core = smoothstep(0.06, 0.34, dist);          // 亮核附近 → 0\n      float prox = 1.0 - clamp(dist * 1.35, 0.0, 1.0);    // 越近越强（但已被 core 抑制）\n      gl_FragColor = vec4(base.rgb + acc * uIntensity * core * (0.3 + prox * 0.9), base.a);\n    }\n  "
}, pd = {
	uniforms: {
		tDiffuse: { value: null },
		uResolution: { value: new H(1, 1) },
		uTime: { value: 0 },
		uSaturation: { value: 1.13 },
		uContrast: { value: 1.07 },
		uLift: { value: .017 },
		uVignette: { value: .38 },
		uGrain: { value: .009 },
		uShadowTint: { value: new J("#9db4dc") },
		uHighlightTint: { value: new J("#ffe7c4") },
		uTintStrength: { value: .12 }
	},
	vertexShader: "\n    varying vec2 vUv;\n    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }\n  ",
	fragmentShader: "\n    uniform sampler2D tDiffuse;\n    uniform vec2 uResolution;\n    uniform float uTime, uSaturation, uContrast, uLift, uVignette, uGrain, uTintStrength;\n    uniform vec3 uShadowTint, uHighlightTint;\n    varying vec2 vUv;\n    float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }\n    void main() {\n      vec3 c = texture2D(tDiffuse, vUv).rgb;\n      float lum = dot(c, vec3(0.2126, 0.7152, 0.0722));\n      // 分离色调：暗部混合冷色、亮部混合暖色\n      vec3 tint = mix(uShadowTint, uHighlightTint, smoothstep(0.15, 0.85, lum));\n      c = mix(c, c * (tint * 1.6), uTintStrength);\n      // 暗部抬升 + 对比 + 饱和度\n      c = c + uLift * (1.0 - c);\n      c = (c - 0.5) * uContrast + 0.5;\n      c = mix(vec3(lum), c, uSaturation);\n      // 暗角\n      vec2 d = (vUv - 0.5) * vec2(1.0, 0.92);\n      c *= 1.0 - uVignette * dot(d, d) * 2.2;\n      // 极细颗粒（兼作 dither，消除渐变上的色带）\n      // 静态颗粒：只用于 dither（消除渐变色带）。不能带时间项，\n      // 否则鼠标移动（相机视差）时逐帧变化的噪点会被看成\"闪烁\"。\n      c += (hash(vUv * uResolution) - 0.5) * uGrain;\n      gl_FragColor = vec4(max(c, 0.0), 1.0);\n    }\n  "
};
function md({ renderer: e, scene: t, camera: n, width: r, height: i, lightWorldPos: a }) {
	let o = new Xu(e, new rt(r, i, {
		type: p,
		samples: 4
	}));
	o.addPass(new Zu(t, n));
	let s = new dd(t, n, r, i);
	s.output = dd.OUTPUT.Default, s.updateGtaoMaterial({
		radius: .42,
		distanceExponent: 1,
		thickness: 1,
		scale: 1,
		samples: 16,
		distanceFallOff: 1,
		screenSpaceRadius: !1
	}), o.addPass(s);
	let c = new $u(new H(r, i), .2, .58, .82);
	o.addPass(c);
	let l = new qu(fd);
	o.addPass(l);
	let u = new qu(pd);
	o.addPass(u), o.addPass(new td());
	let d = {
		enabled: !0,
		gtao: !0,
		gtaoIntensity: .12,
		bloom: !0,
		godRays: !1,
		grade: !0,
		bloomStrength: .2,
		godRaysDay: .45,
		godRaysNight: 0,
		grain: .002,
		saturation: 1.16,
		liftDay: .017,
		liftNight: .042,
		vignetteDay: .34,
		vignetteNight: .38,
		gtaoNightScale: .55
	};
	function f() {
		s.enabled = d.enabled && d.gtao, s.blendIntensity = d.gtaoIntensity, c.enabled = d.enabled && d.bloom, c.strength = d.bloomStrength, l.enabled = d.enabled && d.godRays, u.enabled = d.enabled && d.grade, u.uniforms.uGrain.value = d.grain, u.uniforms.uSaturation.value = d.saturation;
	}
	let m = new W(), h = new H(.5, .5), g = 0, _ = {
		bloomStrength: .26,
		godRaysDay: .55,
		godRaysNight: 0,
		lightDay: a || new W(-5.6, 3.3, 0),
		lightNight: new W(0, 5.42, 0)
	};
	return f(), {
		composer: o,
		config: _,
		state: d,
		apply: f,
		setSize(e, t) {
			o.setSize(e, t), c.setSize(e, t), u.uniforms.uResolution.value.set(e, t), l.uniforms.uAspect.value = e / Math.max(1, t);
		},
		update(e, t, r) {
			u.uniforms.uTime.value = t, u.uniforms.uLift.value = d.liftDay + (d.liftNight - d.liftDay) * r, u.uniforms.uVignette.value = d.vignetteDay + (d.vignetteNight - d.vignetteDay) * r, s.enabled && (s.blendIntensity = d.gtaoIntensity * (1 - (1 - d.gtaoNightScale) * r));
			let i = _.lightNight && r > .5 ? _.lightNight : _.lightDay;
			m.copy(i).project(n);
			let a = m.z < 1 && Math.abs(m.x) < 1.6 && Math.abs(m.y) < 1.6, o = new H(m.x * .5 + .5, m.y * .5 + .5), c = d.godRaysDay + (d.godRaysNight - d.godRaysDay) * r, f = a ? c : 0, p = 1 - Math.exp(-6 * Math.max(0, e));
			h.lerp(o, p), g += (f - g) * p, l.uniforms.uLightPos.value.copy(h), l.uniforms.uIntensity.value = g;
		}
	};
}
//#endregion
//#region src/main.js
var hd = typeof window.__ROOM_OPTIONS__ == "object" && window.__ROOM_OPTIONS__ || {}, gd = hd.root || "#scene-root", _d = document.querySelector(gd) || document.body, vd = hd.embed === !0 || new URLSearchParams(location.search).get("embed") === "1";
vd && hd.embedClass !== !1 && document.body.classList.add(hd.embedClass || "embed");
function yd() {
	let e = () => {};
	return {
		style: {},
		dataset: {},
		classList: {
			add: e,
			remove: e,
			toggle: e,
			contains: () => !1
		},
		textContent: "",
		innerHTML: "",
		value: "",
		open: !1,
		hidden: !1,
		addEventListener: e,
		removeEventListener: e,
		appendChild: (e) => e,
		removeChild: e,
		showModal: e,
		close: e,
		focus: e,
		blur: e,
		setAttribute: e,
		removeAttribute: e,
		querySelector: () => null,
		querySelectorAll: () => [],
		contains: () => !1,
		getBoundingClientRect: () => ({
			left: 0,
			top: 0,
			width: 0,
			height: 0,
			right: 0,
			bottom: 0
		})
	};
}
function bd(e) {
	let t = document.querySelector(e);
	return !t && !vd && console.warn("[room] 缺少可选元素 " + e + "，已用空操作占位"), t || yd();
}
var xd = bd("#loading-note"), Sd = bd("#reset-view"), Cd = bd("#lock-zoom"), wd = bd("#info-dialog"), Td = bd("#dialog-close"), Ed = bd("#dialog-eyebrow"), Dd = bd("#dialog-title"), Od = bd("#dialog-description"), kd = bd("#toast"), Ad = new Ht();
Ad.background = new J("#eadbd3"), Ad.fog = new Vt("#eadbd3", 18, 38);
var jd = new Ca(38, 1, .1, 100);
jd.position.set(11, 9, 13);
var Md = new Tl({
	antialias: !0,
	alpha: !1,
	powerPreference: "high-performance"
});
Md.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75)), Md.shadowMap.enabled = !0, Md.shadowMap.type = 1, Md.outputColorSpace = M, Md.toneMapping = 4, Md.toneMappingExposure = 1.15, _d.appendChild(Md.domElement);
var Nd = md({
	renderer: Md,
	scene: Ad,
	camera: jd,
	width: window.innerWidth,
	height: window.innerHeight,
	lightWorldPos: new W(-5.6, 3.3, 0)
}), Pd = Nd.composer;
function Fd() {
	let e = document.createElement("div");
	e.style.cssText = "position:fixed;right:14px;bottom:92px;z-index:30;background:rgba(20,18,22,.88);color:#e8e2dc;border:1px solid #3d3941;border-radius:10px;padding:9px 11px;font:11px/1.75 ui-monospace,monospace", e.innerHTML = "<div style=\"font-weight:600;letter-spacing:.08em;margin-bottom:5px\">光影调试</div>" + [
		["gtao", "GTAO 接触遮蔽"],
		["bloom", "Bloom"],
		["godRays", "体积光束"],
		["grade", "调色"]
	].map(([e, t]) => `<label style="display:block;cursor:pointer"><input type="checkbox" data-k="${e}" ${Nd.state[e] ? "checked" : ""}> ${t}</label>`).join("") + "<label style=\"display:block\">颗粒 <input type=\"range\" data-k=\"grain\" min=\"0\" max=\"0.03\" step=\"0.001\" value=\"" + Nd.state.grain + "\" style=\"width:76px;vertical-align:middle\"></label><label style=\"display:block\">遮蔽 <input type=\"range\" data-k=\"gtaoIntensity\" min=\"0\" max=\"1.5\" step=\"0.05\" value=\"" + Nd.state.gtaoIntensity + "\" style=\"width:76px;vertical-align:middle\"></label><label style=\"display:block\">光束 <input type=\"range\" data-k=\"godRaysDay\" min=\"0\" max=\"1\" step=\"0.05\" value=\"" + Nd.state.godRaysDay + "\" style=\"width:76px;vertical-align:middle\"></label><button data-a=\"off\" style=\"margin-top:5px\">全部关闭</button> <button data-a=\"on\">全部开启</button><label style=\"display:block;margin-top:5px\"><input type=\"checkbox\" data-b=\"blink\" checked> 眼睛动画</label><button data-a=\"hold\" style=\"margin-top:4px;width:100%\">播放一次眼睛动画</button><div style=\"margin-top:6px;border-top:1px solid #3d3941;padding-top:5px;color:#cfc6be\">夜晚</div><label style=\"display:block\">环境 <input type=\"range\" data-n=\"hemi\" min=\"0\" max=\"1\" step=\"0.02\" value=\"1\" style=\"width:62px;vertical-align:middle\"></label><label style=\"display:block\">抬升 <input type=\"range\" data-n=\"liftNight\" min=\"0\" max=\"0.09\" step=\"0.005\" value=\"0.03\" style=\"width:62px;vertical-align:middle\"></label><label style=\"display:block\">暗角 <input type=\"range\" data-n=\"vignetteNight\" min=\"0\" max=\"0.6\" step=\"0.02\" value=\"0.6\" style=\"width:62px;vertical-align:middle\"></label><label style=\"display:block\">曝光 <input type=\"range\" data-n=\"exposure\" min=\"0.8\" max=\"1.9\" step=\"0.02\" value=\"0.8\" style=\"width:62px;vertical-align:middle\"></label><button data-a=\"copy\" style=\"margin-top:4px;width:100%\">复制当前参数</button>", e.addEventListener("input", (e) => {
		if (e.target.dataset.b === "blink") {
			pp(e.target.checked);
			return;
		}
		let t = e.target.dataset.n;
		if (t) {
			window.__night.set({ [t]: Number(e.target.value) });
			return;
		}
		let n = e.target.dataset.k;
		n && (Nd.state[n] = e.target.type === "checkbox" ? e.target.checked : Number(e.target.value), Nd.apply());
	}), e.addEventListener("click", (t) => {
		let n = t.target.dataset.a;
		if (n) {
			if (n === "hold") mp();
			else if (n === "copy") {
				let e = {
					...window.__fx.get(),
					...window.__night.get()
				}, n = JSON.stringify(e);
				console.log("[fx] 当前参数：", n), navigator.clipboard && navigator.clipboard.writeText && navigator.clipboard.writeText(n), t.target.textContent = "已复制（见控制台）";
			} else Nd.state.enabled = n === "on", Nd.apply(), e.querySelectorAll("[data-k]").forEach((e) => {
				let t = e.dataset.k;
				e.type === "checkbox" && (e.checked = !!Nd.state[t]);
			});
		}
	}), document.body.appendChild(e), window.__night = {
		get: () => ({
			hemi: Bf.hemi,
			exposure: Bf.exposure,
			liftNight: Nd.state.liftNight,
			vignetteNight: Nd.state.vignetteNight,
			gtaoNightScale: Nd.state.gtaoNightScale
		}),
		set: (e) => (e.hemi !== void 0 && (Bf.hemi = e.hemi), e.exposure !== void 0 && (Bf.exposure = e.exposure), e.liftNight !== void 0 && (Nd.state.liftNight = e.liftNight), e.vignetteNight !== void 0 && (Nd.state.vignetteNight = e.vignetteNight), e.gtaoNightScale !== void 0 && (Nd.state.gtaoNightScale = e.gtaoNightScale), Nd.apply(), window.__night.get())
	};
}
vd || Fd(), window.__fx = {
	get: () => ({ ...Nd.state }),
	set: (e) => (Object.assign(Nd.state, e), Nd.apply(), window.__fx.get()),
	off: () => window.__fx.set({ enabled: !1 }),
	on: () => window.__fx.set({ enabled: !0 })
};
function Id() {
	Pd.render();
}
var Ld = new W(4.4226, 5.5026, 7.2804), Rd = new W(3.3696, 3.915, -.5315), zd = 12, Bd = .04, Vd = .02, Hd = zd * Bd, Ud = zd * Vd, Wd = .05, Gd = 9, Kd = 22;
jd.position.copy(Ld), jd.lookAt(Rd);
var qd = jd.quaternion.clone();
qd.set(-.17034, .256497, .045976, .950305).normalize(), jd.quaternion.copy(qd);
var Jd = new W(1, 0, 0).applyQuaternion(qd);
Jd.y = 0, Jd.normalize();
var Yd = new W(0, 1, 0).applyQuaternion(qd).normalize(), Xd = Rd.clone().sub(Ld).normalize(), Zd = Ld.distanceTo(Rd), Qd = !0, $d = 1.04;
function ef() {
	if (ef.disabled || !Q) return !1;
	let e = new W().subVectors(Ld, Rd).normalize(), t = new rn().setFromObject(Q);
	if (t.isEmpty()) return !1;
	let n = t.getBoundingSphere(new kn()), r = V.degToRad(jd.fov) / 2, i = Math.atan(Math.tan(r) * Math.max(jd.aspect, .001)), a = n.radius * $d / Math.sin(Math.min(r, i));
	return Ld.copy(Rd).addScaledVector(e, a), Zd = Ld.distanceTo(Rd), af = Zd, of = Zd, jd.position.copy(Ld), jd.quaternion.copy(qd), console.log("[room] fit: radius " + n.radius.toFixed(2) + " -> dist " + Zd.toFixed(2) + " (aspect " + jd.aspect.toFixed(2) + ")"), !0;
}
window.addEventListener("resize", () => {
	ef();
}), Md.domElement.style.touchAction = "pan-y", Md.domElement.addEventListener("wheel", uf, { passive: !1 });
var tf = {
	x: 0,
	y: 0
}, nf = {
	x: 0,
	y: 0
}, rf = new W(), af = Zd, of = Zd, sf = !1;
function cf() {
	tf.x = 0, tf.y = 0, gp = !1;
}
function lf(e, t) {
	let n = Md.domElement.getBoundingClientRect();
	n.width <= 0 || n.height <= 0 || (e >= n.left && e <= n.right && t >= n.top && t <= n.bottom ? (gp = !0, tf.x = V.clamp((e - n.left) / n.width * 2 - 1, -1, 1), tf.y = V.clamp(1 - (t - n.top) / n.height * 2, -1, 1)) : cf());
}
function uf(e) {}
function df(e) {
	af = Zd, of = Zd, wd.open && cf();
	let t = 1 - Math.exp(-6.5 * Math.max(0, e));
	nf.x += (tf.x - nf.x) * t, nf.y += (tf.y - nf.y) * t, af += (of - af) * t;
	let n = V.clamp(af, Gd, Kd);
	rf.copy(Jd).multiplyScalar(nf.x * Hd).addScaledVector(Yd, nf.y * Ud), jd.position.copy(Ld).add(rf).addScaledVector(Xd, Zd - n), jd.quaternion.copy(qd);
}
var ff = new da("#fff4df", "#928179", 1.35);
Ad.add(ff);
var pf = new Aa("#fff0d5", 1.9);
pf.shadow.radius = 3, pf.position.set(-13, 7.5, 4.5), pf.target.position.set(1.5, .2, -.5), pf.target.updateMatrixWorld(), pf.castShadow = !0, pf.shadow.mapSize.set(2048, 2048), pf.shadow.camera.left = -15, pf.shadow.camera.right = 15, pf.shadow.camera.top = 15, pf.shadow.camera.bottom = -15, pf.shadow.bias = -2e-4, pf.shadow.normalBias = .022, Ad.add(pf), Ad.add(pf.target);
var Z = Object.fromEntries(Object.keys(Ol).map((e) => [e, Pl(e, { onLoad: () => Id() })])), Q = new Nt();
Ad.add(Q);
var mf = [], hf = [];
function $(e, t, n, r, i, a = {}) {
	let o = new fi(n[0], n[1], n[2]), s = {
		tile: 1,
		uv: "tile"
	};
	Fl(o, n, Array.isArray(i) ? i.map((e) => e?.userData?.mc ?? s) : i?.userData?.mc ?? s);
	let c = new ur(o, i);
	return c.name = t, c.position.set(r[0], r[1], r[2]), c.castShadow = a.castShadow ?? !0, c.receiveShadow = a.receiveShadow ?? !0, a.rotation && c.rotation.set(...a.rotation), e.add(c), c;
}
function gf(e, t, n, r = 1, i = Z.leaf) {
	let a = .46 * r, o = .38 * r, s = .3 * r;
	$(e, "plant-pot-rim", [
		a,
		.09 * r,
		a
	], [
		t,
		.24 * r,
		n
	], Z.pink), $(e, "plant-pot-mid", [
		o,
		.15 * r,
		o
	], [
		t,
		.13 * r,
		n
	], Z.pink), $(e, "plant-pot-low", [
		s,
		.09 * r,
		s
	], [
		t,
		.045 * r,
		n
	], Z.pinkDark), $(e, "plant-soil", [
		o - .05 * r,
		.06 * r,
		o - .05 * r
	], [
		t,
		.27 * r,
		n
	], Z.soil, { castShadow: !1 }), $(e, "plant-stem", [
		.07 * r,
		.3 * r,
		.07 * r
	], [
		t,
		.45 * r,
		n
	], Z.greenDark), [
		[
			0,
			.62,
			0,
			.3,
			.16,
			.3
		],
		[
			-.16,
			.5,
			.1,
			.22,
			.14,
			.22
		],
		[
			.17,
			.52,
			-.08,
			.2,
			.13,
			.2
		],
		[
			.078,
			.72,
			.12,
			.18,
			.12,
			.18
		],
		[
			-.1,
			.74,
			-.12,
			.17,
			.11,
			.17
		],
		[
			.14,
			.4,
			.14,
			.16,
			.1,
			.16
		],
		[
			-.15,
			.38,
			-.14,
			.15,
			.1,
			.15
		],
		[
			0,
			.84,
			0,
			.15,
			.1,
			.15
		]
	].forEach(([a, o, s, c, l, u], d) => {
		let f = 1 + d % 3 * .017, p = 1 + d % 2 * .021;
		$(e, "plant-leaf-" + d, [
			c * r * f,
			l * r * p,
			u * r * f
		], [
			t + a * r * f,
			o * r,
			n + s * r * f
		], i, { castShadow: !1 });
	});
}
function _f(e, t, n, r, i, a, o) {
	let s = new Qn({
		transparent: !0,
		opacity: 0,
		depthWrite: !1,
		color: "#ffffff"
	}), c = new ur(new fi(...a), s);
	return c.position.set(...o), c.userData.hotspot = {
		id: t,
		title: n,
		eyebrow: r,
		description: i
	}, c.name = `hotspot-${t}`, e.add(c), mf.push(c), hf.push(c), c;
}
$(Q, "room-floor-base", [
	12,
	.42,
	10
], [
	0,
	-.21,
	1
], Z.darkWood);
for (let e = -5.5; e <= 5.5; e += 1) for (let t = -3.5; t <= 5.5; t += 1) {
	let n = (Math.round(e + 5.5) + Math.round(t + 3.5)) % 2 == 0;
	$(Q, "floor-plank", [
		1,
		.045,
		1
	], [
		e,
		.015,
		t
	], n ? Z.floor : Z.floorAlt, { castShadow: !1 });
}
var vf = 8;
$(Q, "back-wall", [
	11.96,
	vf,
	.35
], [
	0,
	vf / 2,
	-3.92
], Z.wall), $(Q, "back-wall-pink-panel", [
	5.6,
	3.35,
	.06
], [
	-2.6,
	2.5,
	-3.695
], Z.wallPink, { castShadow: !1 }), $(Q, "back-wall-trim", [
	11.9,
	.22,
	.42
], [
	0,
	.11,
	-3.83
], Z.trim), $(Q, "left-wall", [
	.35,
	vf,
	7.96
], [
	-5.92,
	vf / 2,
	0
], Z.wall), $(Q, "left-wall-trim", [
	.42,
	.212,
	7.9
], [
	-5.83,
	.106,
	0
], Z.trim), $(Q, "right-wall-return", [
	.35,
	vf,
	7.96
], [
	5.92,
	vf / 2,
	0
], Z.wall), $(Q, "right-return-trim", [
	.42,
	.2,
	7.9
], [
	5.83,
	.1,
	0
], Z.trim), $(Q, "rug-shadow", [
	3.5,
	.05,
	3.5
], [
	-3,
	.06,
	1
], Z.darkWood), $(Q, "rug", [
	3.35,
	.06,
	3.35
], [
	-3,
	.095,
	1
], Z.pink), $(Q, "rug-center", [
	2.65,
	.025,
	2.65
], [
	-3,
	.152,
	1
], Z.wallPink, { castShadow: !1 }), $(Q, "bed-frame", [
	2.65,
	.42,
	3.15
], [
	-3.1,
	.42,
	1
], Z.wood), $(Q, "bed-mattress", [
	2.55,
	.42,
	3
], [
	-3.1,
	.81,
	1
], Z.cream), $(Q, "bed-blanket", [
	2.58,
	.18,
	1.75
], [
	-3.1,
	1.08,
	1.62
], Z.blue), $(Q, "bed-blanket-fold", [
	2.54,
	.11,
	.35
], [
	-3.1,
	1.17,
	.77
], Z.blueDark), $(Q, "bed-pillow-a", [
	.82,
	.22,
	.68
], [
	-3.72,
	1.15,
	-.02
], Z.pillow), $(Q, "bed-pillow-b", [
	.82,
	.22,
	.68
], [
	-2.55,
	1.15,
	-.02
], Z.pillow), $(Q, "bed-headboard", [
	2.8,
	1.05,
	.2
], [
	-3.1,
	1,
	-.72
], Z.woodLight), $(Q, "desk-top", [
	3.55,
	.22,
	1.35
], [
	2.05,
	1.55,
	-2.25
], Z.woodLight);
for (let e of [.55, 3.55]) $(Q, "desk-leg", [
	.18,
	1.4,
	.18
], [
	e,
	.76,
	-2.25
], Z.darkWood);
$(Q, "desk-front-apron", [
	3.35,
	.24,
	.16
], [
	2.05,
	1.34,
	-1.672
], Z.wood);
var yf = Il({
	side: "black",
	top: "black",
	bottom: "black",
	front: "screenOff"
}, { onLoad: () => Id() }), bf = yf[4], xf = jl("screen_on");
Ll(bf, xf), bf.emissiveMap = xf, bf.emissive = new J(16777215), bf.emissiveIntensity = 0, $(Q, "monitor-body", [
	1.25,
	.82,
	.13
], [
	2.05,
	2.12,
	-2.62
], yf), $(Q, "monitor-stand", [
	.16,
	.25,
	.14
], [
	2.05,
	1.69,
	-2.43
], Z.black), $(Q, "monitor-foot", [
	.52,
	.07,
	.3
], [
	2.05,
	1.59,
	-2.36
], Z.black), $(Q, "keyboard", [
	1.08,
	.08,
	.36
], [
	2.05,
	1.71,
	-1.78
], Z.screen);
for (let e = 0; e < 3; e++) for (let t = 0; t < 12; t++) $(Q, "keyboard-key", [
	.07,
	.022,
	.07
], [
	1.6 + t * .082,
	1.762,
	-1.87 + e * .084
], Z.white, { castShadow: !1 });
$(Q, "computer-tower", [
	.48,
	.9,
	.58
], [
	4,
	.55,
	-2.34
], Z.machine), $(Q, "computer-tower-front", [
	.035,
	.58,
	.37
], [
	4.25,
	.55,
	-2.34
], Z.black, { castShadow: !1 }), $(Q, "computer-led", [
	.045,
	.045,
	.045
], [
	4.28,
	.79,
	-2.2
], Z.pink, { castShadow: !1 }), $(Q, "chair-seat", [
	1,
	.22,
	.9
], [
	2,
	.82,
	-.75
], Z.pink), $(Q, "chair-back", [
	.95,
	.95,
	.12
], [
	2,
	1.36,
	-.3
], Z.pinkDark), $(Q, "chair-post", [
	.17,
	.58,
	.17
], [
	2,
	.43,
	-.75
], Z.black);
for (let e = 0; e < 5; e++) {
	let t = e / 5 * Math.PI * 2 + .3, n = Math.cos(t) * .42, r = Math.sin(t) * .42;
	$(Q, "chair-arm", [
		.62,
		.07,
		.09
	], [
		2 + n,
		.135,
		-.75 + r
	], Z.black, { rotation: [
		0,
		-t,
		0
	] }), $(Q, "chair-caster", [
		.1,
		.09,
		.1
	], [
		2 + n * 1.85,
		.075,
		-.75 + r * 1.85
	], Z.black);
}
$(Q, "bookcase-body", [
	2,
	3,
	.65
], [
	-4.45,
	1.52,
	-3.36
], Z.bookcase);
for (let e of [
	.55,
	1.35,
	2.15,
	2.85
]) $(Q, "bookcase-shelf", [
	1.95,
	.12,
	.69
], [
	-4.45,
	e,
	-3.32
], Z.darkWood);
var Sf = [
	Z.bookRed,
	Z.bookBlue,
	Z.bookYellow,
	Z.green,
	Z.purple
];
[
	{
		y: .88,
		z: -3.25,
		xs: [
			-5.12,
			-4.82,
			-4.5,
			-4.17,
			-3.88
		]
	},
	{
		y: 1.68,
		z: -3.25,
		xs: [
			-5.13,
			-4.79,
			-4.44,
			-4.08
		]
	},
	{
		y: 2.48,
		z: -3.25,
		xs: [
			-5.1,
			-4.78,
			-4.45,
			-4.13,
			-3.85
		]
	}
].forEach((e, t) => e.xs.forEach((n, r) => {
	let i = .38 + (r + t) % 3 * .055;
	$(Q, "book", [
		.22,
		i,
		.28
	], [
		n,
		e.y + i / 2 - .08,
		e.z
	], Sf[(r + t) % Sf.length]);
})), $(Q, "tiny-plant-shelf-pot", [
	.33,
	.25,
	.28
], [
	-4,
	2.95,
	-3.23
], Z.pink), $(Q, "tiny-plant-shelf-leaf", [
	.3,
	.35,
	.24
], [
	-4,
	3.22,
	-3.23
], Z.leafOak), $(Q, "record-table-top", [
	1.55,
	.18,
	1.25
], [
	4.48,
	1.35,
	.1
], Z.woodLight);
for (let e of [3.9, 5.06]) for (let t of [-.32, .52]) $(Q, "record-table-leg", [
	.13,
	1.25,
	.13
], [
	e,
	.67,
	t
], Z.darkWood);
$(Q, "record-player-base", [
	1,
	.16,
	.88
], [
	4.45,
	1.52,
	.1
], Z.jukeboxSide), $(Q, "record-disc", [
	.62,
	.045,
	.62
], [
	4.42,
	1.63,
	.09
], Z.black), $(Q, "record-label", [
	.2,
	.055,
	.2
], [
	4.42,
	1.66,
	.09
], Z.yellow), $(Q, "record-player-lid", [
	1.02,
	.045,
	.05
], [
	4.45,
	1.73,
	-.34
], Z.cream), $(Q, "record-player-arm", [
	.07,
	.06,
	.42
], [
	4.76,
	1.69,
	.04
], Z.white, { rotation: [
	0,
	.25,
	-.18
] }), gf(Q, -5.05, 2.75, .95, Z.leafCherry), gf(Q, 5, -1.05, .8, Z.leafOak), $(Q, "poster-frame", [
	1.45,
	1.7,
	.12
], [
	-.7,
	3.05,
	-3.68
], Z.wood), $(Q, "poster-paper", [
	1.25,
	1.5,
	.04
], [
	-.7,
	3.05,
	-3.59
], Z.cream, { castShadow: !1 }), $(Q, "poster-sun", [
	.36,
	.36,
	.03
], [
	-.72,
	3.34,
	-3.545
], Z.yellow, { castShadow: !1 }), $(Q, "poster-hill-left", [
	.42,
	.3,
	.03
], [
	-1.02,
	2.84,
	-3.545
], Z.green, {
	castShadow: !1,
	rotation: [
		0,
		0,
		-.3
	]
}), $(Q, "poster-hill-right", [
	.5,
	.44,
	.03
], [
	-.44,
	2.84,
	-3.545
], Z.blue, {
	castShadow: !1,
	rotation: [
		0,
		0,
		.3
	]
});
var Cf = Pl("glass", { uv: "fit" }), wf = Ml("sky_day"), Tf = Ml("sky_night"), Ef = new Qn({
	map: wf,
	fog: !1
});
Ef.onBeforeCompile = (e) => {
	e.uniforms.skyNightMap = { value: Tf }, e.uniforms.skyMix = { value: 0 }, e.fragmentShader = e.fragmentShader.replace("#include <common>", "#include <common>\nuniform sampler2D skyNightMap;\nuniform float skyMix;").replace("#include <map_fragment>", "diffuseColor *= mix( texture2D( map, vMapUv ), texture2D( skyNightMap, vMapUv ), skyMix );"), Ef.userData.shader = e;
}, Ef.customProgramCacheKey = () => "sky-crossfade", $(Q, "window-frame-top", [
	.14,
	.16,
	1.98
], [
	-5.665,
	4.09,
	0
], Z.wood), $(Q, "window-frame-bottom", [
	.14,
	.16,
	1.98
], [
	-5.665,
	2.41,
	0
], Z.wood), $(Q, "window-frame-left", [
	.14,
	1.52,
	.16
], [
	-5.665,
	3.25,
	-.91
], Z.wood), $(Q, "window-frame-right", [
	.14,
	1.52,
	.16
], [
	-5.665,
	3.25,
	.91
], Z.wood), $(Q, "window-glass", [
	.03,
	1.52,
	1.66
], [
	-5.63,
	3.25,
	0
], Cf, { castShadow: !1 });
var Df = new ur(new fi(.03, 1.72, 1.86), Ef);
Df.position.set(-5.72, 3.25, 0), Q.add(Df), $(Q, "nightstand", [
	1,
	.8,
	.85
], [
	-4.78,
	.42,
	-.85
], Z.woodLight), $(Q, "nightstand-drawer", [
	.7,
	.25,
	.06
], [
	-4.78,
	.48,
	-.39
], Z.wood), $(Q, "lamp-base", [
	.38,
	.12,
	.38
], [
	-4.78,
	.89,
	-.85
], Z.yellow), $(Q, "lamp-stem", [
	.12,
	.38,
	.12
], [
	-4.78,
	1.12,
	-.85
], Z.wood), $(Q, "lamp-shade", [
	.52,
	.3,
	.52
], [
	-4.78,
	1.42,
	-.85
], Z.cream);
var Of = new Da("#ffd7a1", 5, 4, 2);
Of.position.set(-4.78, 1.42, -.85), Ad.add(Of);
var kf = $(Q, "light-button", [
	.1875,
	.25,
	.375
], [
	-5.65125,
	1.9,
	-2.5
], Pl("wood", { uv: "fit" }), { castShadow: !1 });
kf.userData.action = "toggleNight", mf.push(kf);
var Af = Il({
	side: "lanternBodySide",
	top: "lanternBodyEnd",
	bottom: "lanternBodyEnd"
}, { onLoad: () => Id() }), jf = Il({
	side: "lanternCapSide",
	top: "lanternCapTop",
	bottom: "lanternBodyEnd"
}, { onLoad: () => Id() }), Mf = Il({
	side: "lanternBase",
	top: "lanternBodyEnd",
	bottom: "lanternBodyEnd"
}, { onLoad: () => Id() }), Nf = Af[0];
Nf.emissiveMap = Nf.map, Nf.emissive = new J(16777215), Nf.emissiveIntensity = 0, $(Q, "lantern-chain", [
	.07,
	2.4,
	.07
], [
	0,
	7.05,
	0
], Z.chain, { castShadow: !1 }), $(Q, "lantern-cap", [
	.36,
	.12,
	.36
], [
	0,
	5.79,
	0
], jf, { castShadow: !1 }), $(Q, "lantern-body", [
	.3,
	.5,
	.3
], [
	0,
	5.48,
	0
], Af, { castShadow: !1 }), $(Q, "lantern-bottom", [
	.38,
	.1,
	.38
], [
	0,
	5.18,
	0
], Mf, { castShadow: !1 });
var Pf = new Da("#ffbe78", 0, 22, 2);
Pf.position.set(0, 5.42, 0), Pf.castShadow = !0, Pf.shadow.mapSize.set(1024, 1024), Pf.shadow.bias = -.0015, Pf.shadow.normalBias = .05, Ad.add(Pf);
var Ff = new Aa("#ffd8e8", .28);
Ff.position.set(4, 6, 7), Ff.target.position.set(0, 2.2, 0), Ad.add(Ff, Ff.target);
var If = new Da("#8fb9ff", 0, 8.5, 2);
If.position.set(-4.95, 3.4, .2), Ad.add(If);
var Lf = new Da("#9fd8ff", 0, 5.2, 2);
Lf.position.set(2.05, 2, -2.12), Ad.add(Lf);
var Rf = new Da("#ffd7e8", 0, 4.6, 2);
Rf.position.set(-1.15, 2.65, 3.15), Ad.add(Rf);
var zf = {
	background: new J("#eadbd3"),
	fog: new J("#eadbd3"),
	hemiSky: new J("#fff4df"),
	hemiGround: new J("#928179"),
	hemi: 1.15,
	sunColor: new J("#fff0d5"),
	sun: 2.3,
	lamp: 0,
	lantern: 0,
	sky: new J("#ffffff"),
	exposure: 1.15,
	fill: .18,
	moon: 0,
	monitor: .35
}, Bf = {
	background: new J("#24253a"),
	fog: new J("#24253a"),
	hemiSky: new J("#6679b2"),
	hemiGround: new J("#302c46"),
	hemi: 1.7,
	sunColor: new J("#9db4e8"),
	sun: .16,
	lamp: 1.2,
	lantern: 26,
	sky: new J("#d6daf0"),
	exposure: .86,
	fill: .26,
	moon: 1.6,
	monitor: .6
}, Vf = 1, Hf = 0;
function Uf(e) {
	Ad.background.copy(zf.background).lerp(Bf.background, e), Ad.fog.color.copy(zf.fog).lerp(Bf.fog, e), ff.color.copy(zf.hemiSky).lerp(Bf.hemiSky, e), ff.groundColor.copy(zf.hemiGround).lerp(Bf.hemiGround, e), ff.intensity = zf.hemi + (Bf.hemi - zf.hemi) * e, pf.color.copy(zf.sunColor).lerp(Bf.sunColor, e), pf.intensity = zf.sun + (Bf.sun - zf.sun) * e, Of.intensity = zf.lamp + (Bf.lamp - zf.lamp) * e, Pf.intensity = zf.lantern + (Bf.lantern - zf.lantern) * e, Ff.intensity = zf.fill + (Bf.fill - zf.fill) * e, If.intensity = zf.moon + (Bf.moon - zf.moon) * e, Lf.intensity = zf.monitor + (Bf.monitor - zf.monitor) * e, Rf.intensity = e * 4.2, Z.lampShade.emissive.setRGB(1, .84, .6).multiplyScalar(e * .35);
	let t = Ef.userData.shader;
	t && (t.uniforms.skyMix.value = e), Ef.color.copy(zf.sky).lerp(Bf.sky, e), Md.toneMappingExposure = zf.exposure + (Bf.exposure - zf.exposure) * e, Nf.emissiveIntensity = e * .7, kf.position.x = -5.65125 - e * .02, kf.position.z = -2.5;
}
function Wf() {
	let e = Vf < .5;
	Vf = +!!e, window.dispatchEvent(new CustomEvent("room:night", { detail: { night: e } })), Yp(e ? "夜晚模式：吊灯已点亮" : "白天模式：阳光回来了");
}
for (let [e, t] of [
	[-4.36, -.46],
	[-1.84, -.46],
	[-4.36, 2.46],
	[-1.84, 2.46]
]) $(Q, "bed-leg", [
	.17,
	.24,
	.17
], [
	e,
	.11,
	t
], Z.darkWood);
$(Q, "bed-rail-left", [
	.07,
	.26,
	3.1
], [
	-4.455,
	.46,
	1
], Z.wood), $(Q, "bed-rail-right", [
	.07,
	.26,
	3.1
], [
	-1.745,
	.46,
	1
], Z.wood), $(Q, "bed-rail-foot", [
	2.72,
	.24,
	.09
], [
	-3.1,
	.6,
	2.52
], Z.wood), $(Q, "bed-head-post-left", [
	.22,
	1.5,
	.2
], [
	-4.4,
	1.22,
	-.745
], Z.wood), $(Q, "bed-head-post-right", [
	.22,
	1.5,
	.2
], [
	-1.8,
	1.22,
	-.745
], Z.wood), $(Q, "bed-head-cap", [
	2.95,
	.13,
	.3
], [
	-3.1,
	1.95,
	-.72
], Z.woodLight), $(Q, "bed-head-panel", [
	2.5,
	.85,
	.07
], [
	-3.1,
	1.5,
	-.644
], Z.woodLight, { castShadow: !1 }), $(Q, "bed-mattress-top", [
	2.5,
	.07,
	2.94
], [
	-3.1,
	1.055,
	1
], Z.cream, { castShadow: !1 }), $(Q, "bed-blanket-edge-near", [
	2.6,
	.09,
	.09
], [
	-3.1,
	1.09,
	.72
], Z.blueDark, { castShadow: !1 }), $(Q, "bed-blanket-edge-far", [
	2.6,
	.09,
	.09
], [
	-3.1,
	1.09,
	2.5
], Z.blueDark, { castShadow: !1 }), $(Q, "bed-blanket-drape-left", [
	.09,
	.3,
	1.78
], [
	-4.4,
	1,
	1.62
], Z.blue, { castShadow: !1 }), $(Q, "bed-blanket-drape-right", [
	.09,
	.3,
	1.78
], [
	-1.8,
	1,
	1.62
], Z.blue, { castShadow: !1 }), $(Q, "bed-pillow-a-top", [
	.78,
	.07,
	.64
], [
	-3.72,
	1.29,
	-.02
], Z.pillow, { castShadow: !1 }), $(Q, "bed-pillow-b-top", [
	.78,
	.07,
	.64
], [
	-2.55,
	1.29,
	-.02
], Z.pillow, { castShadow: !1 }), $(Q, "bed-pillow-a-seam", [
	.84,
	.05,
	.06
], [
	-3.72,
	1.16,
	.33
], Z.white, { castShadow: !1 }), $(Q, "bed-pillow-b-seam", [
	.84,
	.05,
	.06
], [
	-2.55,
	1.16,
	.33
], Z.white, { castShadow: !1 }), $(Q, "rug-border-n", [
	3.31,
	.02,
	.16
], [
	-3,
	.128,
	-.6
], Z.pinkDark, { castShadow: !1 }), $(Q, "rug-border-s", [
	3.31,
	.02,
	.16
], [
	-3,
	.128,
	2.6
], Z.pinkDark, { castShadow: !1 }), $(Q, "rug-border-w", [
	.16,
	.02,
	2.99
], [
	-4.6,
	.128,
	1
], Z.pinkDark, { castShadow: !1 }), $(Q, "rug-border-e", [
	.16,
	.02,
	2.99
], [
	-1.4,
	.128,
	1
], Z.pinkDark, { castShadow: !1 });
for (let [e, t] of [
	[-.8, -.8],
	[.8, -.8],
	[-.8, .8],
	[.8, .8]
]) $(Q, "rug-diamond", [
	.34,
	.02,
	.34
], [
	-3 + e,
	.166,
	1 + t
], Z.pinkDark, { castShadow: !1 });
$(Q, "nightstand-top", [
	1.06,
	.07,
	.91
], [
	-4.78,
	.855,
	-.85
], Z.wood), $(Q, "nightstand-drawer-upper", [
	.68,
	.22,
	.05
], [
	-4.78,
	.67,
	-.397
], Z.wood), $(Q, "nightstand-handle-upper", [
	.26,
	.04,
	.05
], [
	-4.78,
	.67,
	-.355
], Z.yellow, { castShadow: !1 }), $(Q, "nightstand-handle-lower", [
	.26,
	.04,
	.05
], [
	-4.78,
	.48,
	-.355
], Z.yellow, { castShadow: !1 });
for (let [e, t] of [
	[-5.22, -1.22],
	[-4.34, -1.22],
	[-5.22, -.48],
	[-4.34, -.48]
]) $(Q, "nightstand-leg", [
	.1,
	.07,
	.1
], [
	e,
	.035,
	t
], Z.darkWood);
$(Q, "lamp-base-lower", [
	.44,
	.06,
	.44
], [
	-4.78,
	.882,
	-.85
], Z.yellow), $(Q, "lamp-base-upper", [
	.3,
	.09,
	.3
], [
	-4.78,
	.935,
	-.85
], Z.yellow), $(Q, "lamp-ring", [
	.16,
	.05,
	.16
], [
	-4.78,
	1.24,
	-.85
], Z.wood), $(Q, "lamp-shade-lower", [
	.46,
	.1,
	.46
], [
	-4.78,
	1.32,
	-.85
], Z.lampShade, { castShadow: !1 }), $(Q, "lamp-shade-mid", [
	.37,
	.1,
	.37
], [
	-4.78,
	1.42,
	-.85
], Z.lampShade, { castShadow: !1 }), $(Q, "lamp-shade-top", [
	.28,
	.09,
	.28
], [
	-4.78,
	1.51,
	-.85
], Z.lampShade, { castShadow: !1 }), $(Q, "lamp-bulb", [
	.19,
	.12,
	.19
], [
	-4.78,
	1.3,
	-.85
], Z.lampShade, { castShadow: !1 }), $(Q, "desk-edge-front", [
	3.57,
	.2,
	.06
], [
	2.05,
	1.55,
	-1.56
], Z.wood), $(Q, "desk-edge-left", [
	.06,
	.18,
	1.37
], [
	.26,
	1.55,
	-2.25
], Z.wood), $(Q, "desk-edge-right", [
	.06,
	.18,
	1.37
], [
	3.84,
	1.55,
	-2.25
], Z.wood);
for (let e of [.55, 3.55]) $(Q, "desk-leg-top", [
	.24,
	.12,
	.24
], [
	e,
	1.42,
	-2.25
], Z.wood), $(Q, "desk-leg-foot", [
	.24,
	.08,
	.24
], [
	e,
	.04,
	-2.25
], Z.darkWood);
$(Q, "desk-back-rail", [
	3.35,
	.12,
	.1
], [
	2.05,
	1.45,
	-2.88
], Z.wood), $(Q, "desk-drawer", [
	.86,
	.24,
	.5
], [
	1.15,
	1.34,
	-2.2
], Z.wood), $(Q, "desk-drawer-face", [
	.8,
	.2,
	.05
], [
	1.15,
	1.34,
	-1.93
], Z.woodLight), $(Q, "desk-drawer-handle", [
	.3,
	.045,
	.05
], [
	1.15,
	1.34,
	-1.895
], Z.yellow, { castShadow: !1 }), $(Q, "desk-mouse", [
	.12,
	.05,
	.2
], [
	2.66,
	1.7,
	-1.78
], Z.white), $(Q, "desk-mug", [
	.15,
	.17,
	.15
], [
	3.35,
	1.75,
	-2.05
], Z.white), $(Q, "desk-mug-handle", [
	.05,
	.1,
	.05
], [
	3.44,
	1.75,
	-2.05
], Z.white, { castShadow: !1 }), $(Q, "desk-book-a", [
	.36,
	.07,
	.28
], [
	.85,
	1.7,
	-2.45
], Z.bookRed), $(Q, "desk-book-b", [
	.32,
	.06,
	.25
], [
	.89,
	1.765,
	-2.44
], Z.bookBlue), $(Q, "monitor-back", [
	1.06,
	.64,
	.05
], [
	2.05,
	2.12,
	-2.71
], Z.black), $(Q, "monitor-neck", [
	.1,
	.3,
	.1
], [
	2.05,
	1.72,
	-2.36
], Z.black), $(Q, "monitor-foot-plate", [
	.6,
	.05,
	.36
], [
	2.05,
	1.565,
	-2.36
], Z.black), $(Q, "tower-top", [
	.5,
	.05,
	.6
], [
	4,
	1.025,
	-2.34
], Z.machine);
for (let e = 0; e < 4; e++) $(Q, "tower-vent", [
	.02,
	.03,
	.34
], [
	4.285,
	.42 + e * .055,
	-2.34
], Z.black, { castShadow: !1 });
$(Q, "tower-drive", [
	.02,
	.06,
	.34
], [
	4.285,
	.72,
	-2.34
], Z.black, { castShadow: !1 }), $(Q, "tower-button", [
	.05,
	.05,
	.05
], [
	4.29,
	.9,
	-2.2
], Z.machine, { castShadow: !1 });
for (let e = 0; e < 3; e++) $(Q, "tower-top-vent", [
	.34,
	.02,
	.04
], [
	4,
	1.055,
	-2.5 + e * .14
], Z.black, { castShadow: !1 });
$(Q, "chair-cushion", [
	.94,
	.08,
	.84
], [
	2,
	.95,
	-.75
], Z.pink), $(Q, "chair-post-cover", [
	.22,
	.14,
	.22
], [
	2,
	.62,
	-.75
], Z.black), $(Q, "chair-back-post-left", [
	.09,
	1,
	.14
], [
	1.55,
	1.36,
	-.29
], Z.black), $(Q, "chair-back-post-right", [
	.09,
	1,
	.14
], [
	2.45,
	1.36,
	-.29
], Z.black);
for (let e = 0; e < 3; e++) $(Q, "chair-back-slat", [
	.82,
	.13,
	.1
], [
	2,
	1.06 + e * .3,
	-.25
], Z.pinkDark);
$(Q, "bookcase-top", [
	2.12,
	.1,
	.74
], [
	-4.45,
	3.07,
	-3.36
], Z.wood), $(Q, "bookcase-bottom", [
	2.12,
	.12,
	.74
], [
	-4.45,
	.04,
	-3.36
], Z.wood), $(Q, "bookcase-post-left", [
	.09,
	2.94,
	.1
], [
	-5.41,
	1.5,
	-3.09
], Z.darkWood), $(Q, "bookcase-post-right", [
	.09,
	2.94,
	.1
], [
	-3.49,
	1.5,
	-3.09
], Z.darkWood), [
	{
		y: .13,
		xs: [
			-5.15,
			-4.86,
			-4.52,
			-4.2,
			-3.9
		],
		mats: [
			Z.bookRed,
			Z.bookYellow,
			Z.bookBlue,
			Z.purple,
			Z.green
		]
	},
	{
		y: 1.05,
		xs: [
			-4.72,
			-4.36,
			-4.02
		],
		mats: [
			Z.bookBlue,
			Z.bookRed,
			Z.green
		]
	},
	{
		y: 1.9,
		xs: [
			-5,
			-4.66,
			-4.3
		],
		mats: [
			Z.purple,
			Z.bookYellow,
			Z.bookRed
		]
	}
].forEach((e, t) => e.xs.forEach((n, r) => {
	let i = .26 + (r + t) % 3 * .045;
	$(Q, "book-extra", [
		.2,
		i,
		.26
	], [
		n,
		e.y + i / 2,
		-3.22
	], e.mats[r % e.mats.length]);
}));
for (let e of [
	.75,
	1.55,
	2.35
]) $(Q, "bookcase-stop", [
	.06,
	.22,
	.28
], [
	-3.66,
	e,
	-3.24
], Z.darkWood);
$(Q, "bookcase-crate", [
	.42,
	.34,
	.42
], [
	-5,
	3.29,
	-3.36
], Z.woodLight), $(Q, "bookcase-crate-lid", [
	.46,
	.05,
	.46
], [
	-5,
	3.48,
	-3.36
], Z.wood), $(Q, "record-shelf", [
	1.35,
	.08,
	1.05
], [
	4.48,
	.52,
	.1
], Z.woodLight);
for (let [e, t] of [
	[3.9, -.32],
	[5.06, -.32],
	[3.9, .52],
	[5.06, .52]
]) $(Q, "record-leg-foot", [
	.16,
	.06,
	.16
], [
	e,
	.03,
	t
], Z.darkWood);
$(Q, "record-platter", [
	.72,
	.03,
	.72
], [
	4.42,
	1.605,
	.09
], Z.machine), $(Q, "record-spindle", [
	.05,
	.07,
	.05
], [
	4.42,
	1.68,
	.09
], Z.machine), $(Q, "record-knob-a", [
	.08,
	.08,
	.07
], [
	4.06,
	1.6,
	-.26
], Z.machine), $(Q, "record-knob-b", [
	.08,
	.08,
	.07
], [
	4.21,
	1.6,
	-.26
], Z.machine), $(Q, "record-arm-base", [
	.1,
	.08,
	.1
], [
	4.74,
	1.62,
	-.3
], Z.machine), $(Q, "corner-post-left", [
	.24,
	vf,
	.24
], [
	-5.75,
	vf / 2,
	-3.75
], Z.darkWood), $(Q, "corner-post-right", [
	.24,
	vf,
	.24
], [
	5.75,
	vf / 2,
	-3.75
], Z.darkWood), $(Q, "back-wall-cap", [
	12.2,
	.15,
	.45
], [
	0,
	8.075,
	-3.92
], Z.trim), $(Q, "right-wall-cap", [
	.45,
	.15,
	8.06
], [
	5.92,
	8.075,
	0
], Z.trim), $(Q, "left-wall-cap", [
	.45,
	.148,
	8.06
], [
	-5.92,
	8.075,
	0
], Z.trim), $(Q, "right-return-cap", [
	.45,
	.15,
	2.7
], [
	5.92,
	3.16,
	-2.8
], Z.trim), $(Q, "pink-panel-frame-top", [
	5.72,
	.12,
	.09
], [
	-2.6,
	4.23,
	-3.695
], Z.wood), $(Q, "pink-panel-frame-bottom", [
	5.72,
	.12,
	.09
], [
	-2.6,
	.77,
	-3.695
], Z.wood), $(Q, "pink-panel-frame-left", [
	.12,
	3.6,
	.09
], [
	-5.51,
	2.5,
	-3.695
], Z.wood), $(Q, "pink-panel-frame-right", [
	.12,
	3.6,
	.09
], [
	.31,
	2.5,
	-3.695
], Z.wood), $(Q, "window-sill", [
	.44,
	.09,
	2.12
], [
	-5.52,
	2.3,
	0
], Z.wood), $(Q, "window-lintel", [
	.34,
	.11,
	2.12
], [
	-5.56,
	4.2,
	0
], Z.wood), $(Q, "poster-nail", [
	.06,
	.06,
	.05
], [
	-.7,
	3.96,
	-3.66
], Z.black, { castShadow: !1 });
for (let [e, t] of [
	[-.145, -.145],
	[.145, -.145],
	[-.145, .145],
	[.145, .145]
]) $(Q, "lantern-post", [
	.05,
	.46,
	.05
], [
	e,
	5.46,
	t
], Z.machine, { castShadow: !1 });
$(Q, "lantern-hook-base", [
	.12,
	.07,
	.12
], [
	0,
	5.89,
	0
], Z.machine, { castShadow: !1 }), $(Q, "lantern-hook", [
	.06,
	.05,
	.06
], [
	0,
	5.95,
	0
], Z.chain, { castShadow: !1 }), $(Q, "clock-frame", [
	.64,
	.64,
	.08
], [
	2.6,
	3.5,
	-3.695
], Z.wood), $(Q, "clock-face", [
	.5,
	.5,
	.03
], [
	2.6,
	3.5,
	-3.645
], Z.white, { castShadow: !1 }), $(Q, "clock-hand-hour", [
	.05,
	.19,
	.02
], [
	2.6,
	3.54,
	-3.628
], Z.black, { castShadow: !1 }), $(Q, "clock-hand-minute", [
	.16,
	.05,
	.02
], [
	2.665,
	3.5,
	-3.628
], Z.black, { castShadow: !1 }), $(Q, "clock-pin", [
	.07,
	.07,
	.02
], [
	2.6,
	3.5,
	-3.622
], Z.black, { castShadow: !1 });
for (let e of [-3.5, 3.5]) $(Q, "clock-tick", [
	.04,
	.04,
	.02
], [
	2.6,
	3.5 + e * .06,
	-3.626
], Z.black, { castShadow: !1 });
$(Q, "wall-shelf", [
	1.5,
	.08,
	.34
], [
	4.5,
	2.75,
	-3.55
], Z.woodLight), $(Q, "wall-shelf-bracket-left", [
	.08,
	.24,
	.08
], [
	3.9,
	2.63,
	-3.62
], Z.darkWood), $(Q, "wall-shelf-bracket-right", [
	.08,
	.24,
	.08
], [
	5.1,
	2.63,
	-3.62
], Z.darkWood);
for (let e = 0; e < 3; e++) $(Q, "shelf-book", [
	.15,
	.26 + e * .03,
	.22
], [
	4.16 + e * .17,
	2.92 + e * .015,
	-3.55
], [
	Z.bookRed,
	Z.bookBlue,
	Z.bookYellow
][e]);
$(Q, "shelf-crate", [
	.3,
	.24,
	.3
], [
	5,
	2.91,
	-3.55
], Z.wood), $(Q, "shelf-pot", [
	.18,
	.17,
	.18
], [
	4.45,
	2.875,
	-3.4
], Z.pink), $(Q, "shelf-pot-leaf", [
	.22,
	.14,
	.22
], [
	4.45,
	3,
	-3.4
], Z.leafCherry, { castShadow: !1 }), $(Q, "desk-mousepad", [
	.42,
	.02,
	.32
], [
	2.66,
	1.675,
	-1.78
], Z.black, { castShadow: !1 }), $(Q, "headphone-cup-left", [
	.17,
	.18,
	.17
], [
	3.16,
	1.75,
	-2.42
], Z.black), $(Q, "headphone-cup-right", [
	.17,
	.18,
	.17
], [
	3.62,
	1.75,
	-2.42
], Z.black), [
	[3.16, 1.87],
	[3.28, 1.94],
	[3.39, 1.96],
	[3.5, 1.94],
	[3.62, 1.87]
].forEach(([e, t], n) => $(Q, "headphone-band-" + n, [
	.15,
	.07,
	.09
], [
	e,
	t,
	-2.42
], Z.black));
for (let e = 0; e < 4; e++) $(Q, "desk-cable", [
	.34,
	.03,
	.05
], [
	2.6 + e * .4,
	1.675,
	-2.88 + e % 2 * .03
], Z.black, { castShadow: !1 });
$(Q, "sill-pot", [
	.24,
	.2,
	.24
], [
	-5.46,
	2.46,
	.62
], Z.pink), $(Q, "sill-pot-rim", [
	.28,
	.06,
	.28
], [
	-5.46,
	2.57,
	.62
], Z.pink), $(Q, "sill-pot-soil", [
	.18,
	.04,
	.18
], [
	-5.46,
	2.58,
	.62
], Z.soil, { castShadow: !1 }), $(Q, "sill-plant-stem", [
	.05,
	.16,
	.05
], [
	-5.46,
	2.67,
	.62
], Z.greenDark), $(Q, "sill-plant-leaf-a", [
	.16,
	.1,
	.16
], [
	-5.46,
	2.79,
	.62
], Z.leafAzalea, { castShadow: !1 }), $(Q, "sill-plant-leaf-b", [
	.13,
	.09,
	.13
], [
	-5.38,
	2.73,
	.68
], Z.leafAzalea, { castShadow: !1 }), $(Q, "sill-plant-leaf-c", [
	.12,
	.08,
	.12
], [
	-5.54,
	2.71,
	.56
], Z.leafAzalea, { castShadow: !1 }), $(Q, "floor-slipper-a", [
	.3,
	.09,
	.46
], [
	-2.5,
	.085,
	3.35
], Z.pinkDark), $(Q, "floor-slipper-b", [
	.3,
	.09,
	.46
], [
	-2.14,
	.085,
	3.5
], Z.pinkDark), $(Q, "floor-book-a", [
	.34,
	.08,
	.26
], [
	-1.2,
	.078,
	3.2
], Z.bookBlue), $(Q, "floor-book-b", [
	.32,
	.07,
	.24
], [
	-1.15,
	.155,
	3.25
], Z.bookRed), $(Q, "floor-book-c", [
	.3,
	.06,
	.23
], [
	-1.24,
	.22,
	3.14
], Z.purple), $(Q, "roof-beam-left", [
	.3,
	.22,
	8.7
], [
	-5.9,
	8.26,
	0
], Z.darkWood), $(Q, "roof-beam-right", [
	.3,
	.22,
	8.7
], [
	5.9,
	8.26,
	0
], Z.darkWood), $(Q, "roof-beam-back", [
	12.4,
	.22,
	.3
], [
	0,
	8.26,
	-3.9
], Z.darkWood);
for (let e = 0; e < 5; e++) $(Q, "rug-fringe-n", [
	.18,
	.03,
	.1
], [
	-4.5 + e * .75,
	.14,
	-.62
], Z.pinkDark, { castShadow: !1 }), $(Q, "rug-fringe-s", [
	.18,
	.03,
	.1
], [
	-4.5 + e * .75,
	.14,
	2.62
], Z.pinkDark, { castShadow: !1 });
$(Q, "curtain-rod", [
	.06,
	.06,
	2.35
], [
	-5.48,
	4.16,
	0
], Z.darkWood, { castShadow: !1 });
var Gf = [];
for (let e of [-1, 1]) {
	let t = new Nt();
	t.position.set(-5.47, 4.1, e * 1.03), t.userData.baseRot = e * .018, Q.add(t);
	for (let e = 0; e < 4; e++) $(t, "curtain-fold-" + e, [
		.055,
		1.74 - e * .035,
		.105
	], [
		.006 * e,
		-.87,
		-.16 + e * .105
	], e % 2 ? Z.cream : Z.pink, { castShadow: !1 });
	Gf.push(t);
}
var Kf = [], qf = [], Jf = [], Yf = Z.black, Xf = -5.02, Zf = 4.08;
for (let e = 0; e < 13; e++) {
	let t = e / 12, n = -5.02 + t * 5.04, r = 4.08 - Math.sin(t * Math.PI) * .24;
	if (e > 0) {
		let e = Math.hypot(n - Xf, r - Zf), t = Math.atan2(r - Zf, n - Xf);
		$(Q, "fairy-wire", [
			e,
			.012,
			.012
		], [
			(n + Xf) / 2,
			(r + Zf) / 2,
			-3.53
		], Yf, {
			rotation: [
				0,
				0,
				t
			],
			castShadow: !1
		});
	}
	let i = new wi({
		color: "#ffe2ad",
		emissive: new J("#ffb35c"),
		emissiveIntensity: .9,
		roughness: .42,
		metalness: 0
	}), a = $(Q, "fairy-bulb-" + e, [
		.055,
		.075,
		.055
	], [
		n,
		r - .045,
		-3.5149999999999997
	], i, { castShadow: !1 });
	Kf.push(i), qf.push(a), Jf.push(e * .71), Xf = n, Zf = r;
}
var Qf = new Da("#ffbf7a", 0, 4.5, 2);
Qf.position.set(-2.5, 3.85, -3.15), Ad.add(Qf);
function $f(e, t, n) {
	let r = [];
	for (let t = 0; t < e; t++) r.push(-5.69, 2.55 + Math.random() * 1.55, (Math.random() - .5) * 1.42);
	let i = new Ln();
	i.setAttribute("position", new Tn(r, 3));
	let a = new oi(i, new ti({
		color: t,
		size: n,
		transparent: !0,
		opacity: .75,
		depthWrite: !1,
		sizeAttenuation: !0,
		blending: 2
	}));
	return a.name = "window-stars", Q.add(a), a;
}
var ep = $f(26, "#cfe4ff", .032), tp = $f(10, "#ffd8ea", .045), np = new Nt();
np.name = "plush-cat", np.position.set(-3.92, 1.18, 2.02), np.rotation.y = .28, np.scale.setScalar(.82), Q.add(np), $(np, "plush-cat-body", [
	.58,
	.42,
	.42
], [
	0,
	.21,
	0
], Z.cream), $(np, "plush-cat-head", [
	.46,
	.38,
	.4
], [
	0,
	.55,
	.02
], Z.cream), $(np, "plush-cat-ear-l", [
	.15,
	.18,
	.11
], [
	-.14,
	.78,
	.02
], Z.pink, { rotation: [
	0,
	0,
	-.16
] }), $(np, "plush-cat-ear-r", [
	.15,
	.18,
	.11
], [
	.14,
	.78,
	.02
], Z.pink, { rotation: [
	0,
	0,
	.16
] }), $(np, "plush-cat-eye-l", [
	.05,
	.05,
	.03
], [
	-.09,
	.59,
	.225
], Z.black, { castShadow: !1 }), $(np, "plush-cat-eye-r", [
	.05,
	.05,
	.03
], [
	.09,
	.59,
	.225
], Z.black, { castShadow: !1 }), $(np, "plush-cat-nose", [
	.055,
	.04,
	.03
], [
	0,
	.51,
	.23
], Z.pinkDark, { castShadow: !1 }), $(np, "plush-cat-tail", [
	.11,
	.11,
	.42
], [
	.3,
	.2,
	-.12
], Z.pink, { rotation: [
	.3,
	0,
	0
] }), $(np, "plush-cat-paw-l", [
	.16,
	.08,
	.16
], [
	-.16,
	.05,
	.14
], Z.pink, { castShadow: !1 }), $(np, "plush-cat-paw-r", [
	.16,
	.08,
	.16
], [
	.16,
	.05,
	.14
], Z.pink, { castShadow: !1 });
var rp = {
	url: "/room/assets/models/rinsoraneko.glb",
	targetHeight: 1.875,
	FRONT_AXIS: -1,
	pose: "sit",
	stand: { position: [
		.9,
		0,
		2.15
	] },
	sit: {
		position: [
			-1.88,
			.52,
			1
		],
		legBend: .48,
		faceTarget: [3.2, 1],
		headFaceCamera: !0
	}
}, ip = new Nt();
ip.name = "rinsoraCharacterRoot";
var ap = rp[rp.pose], op = [], sp = {
	enabled: !0,
	mixer: null,
	action: null,
	clip: null,
	names: []
};
function cp(e, t) {
	let n = t || [];
	if (sp.names = n.map((e) => e.name), !n.length) {
		console.log("[eye] 模型不含动画");
		return;
	}
	sp.mixer = new to(e);
	let r = n.find((e) => e.name.toLowerCase() === "animation") || n.find((e) => /animation/i.test(e.name) && !/blink|gaze/i.test(e.name)) || n[0];
	sp.clip = r.name, sp.action = sp.mixer.clipAction(r), sp.action.setLoop(T, 1), sp.action.clampWhenFinished = !1, sp.timer = 1.5 + Math.random() * 3, console.log("[eye] 待机动画 = " + r.name + "（模型共 " + n.length + " 个：" + sp.names.join(", ") + "）");
}
var lp = {
	min: 4,
	max: 11,
	fade: .12
};
function up() {
	let e = sp;
	return e.action ? (e.action.reset(), e.action.setLoop(T, 1), e.action.clampWhenFinished = !1, e.action.fadeIn(lp.fade).play(), e.playing = !0, e.clip) : null;
}
function dp(e) {
	let t = sp;
	t.mixer && (t.mixer.update(e), t.enabled && !t.paused && (t.playing ? (!t.action || !t.action.isRunning()) && (t.playing = !1, t.timer = lp.min + Math.random() * (lp.max - lp.min)) : (t.timer -= Math.max(0, e), t.timer <= 0 && up())));
}
function fp() {
	let e = [], t = sp.mixer ? sp.mixer.getRoot() : null;
	if (!t) return e;
	let n = (t) => {
		if (/^(eyes|pupils|blink-lids|lids-down)/i.test(t.name || "")) {
			let n = new W();
			t.getWorldPosition(n), e.push({
				name: t.name,
				visible: t.visible,
				parent: t.parent && t.parent.name || null,
				local: t.position.toArray().map((e) => +e.toFixed(3)),
				world: n.toArray().map((e) => +e.toFixed(3)),
				scale: t.scale.toArray().map((e) => +e.toFixed(3)),
				hasMesh: !!t.isMesh || !!(t.children || []).some((e) => e.isMesh)
			});
		}
		(t.children || []).forEach(n);
	};
	return n(t), e;
}
function pp(e) {
	return sp.enabled = !!e, sp.action && (sp.action.paused = !sp.enabled), sp.action && (sp.action.paused = !sp.enabled), sp.enabled;
}
function mp() {
	let e = up();
	return console.log("[eye] 重播一次 " + e), sp.clip;
}
window.__eyeAnim = {
	parts: fp,
	status: () => ({
		clip: sp.clip,
		names: sp.names,
		enabled: sp.enabled,
		eyePartsBound: sp.partsBound || 0,
		headBone: xp && xp.name || null
	}),
	enable: pp,
	replay: mp
};
var hp = {
	enabled: !0,
	maxYaw: 1.31,
	maxPitch: .87,
	smoothing: 8,
	faceForward: .25,
	faceUp: .25
}, gp = !1, _p = new ro(), vp = new W(), yp = 0, bp = 0, xp = null, Sp = null, Cp = new W(0, 1, 0), wp = new W(0, 0, -1), Tp = new W(), Ep = new W(), Dp = new W(), Op = new U(), kp = new U();
new ht(0, 0, 0, "YXZ");
function Ap() {
	if (!xp) return null;
	let e = ip.scale.x || 1;
	return xp.getWorldPosition(Tp), Dp.copy(wp).applyQuaternion(xp.getWorldQuaternion(Op)), Ep.copy(Tp).addScaledVector(Dp, hp.faceForward * e).addScaledVector(Cp, hp.faceUp * e);
}
function jp(e) {
	if (!xp || !hp.enabled) return;
	xp.getWorldPosition(Tp);
	let t = !1;
	if (gp) {
		_p.setFromCamera(tf, jd);
		let e = _p.intersectObject(Q, !0);
		e.length && (vp.copy(e[0].point), e[0].object.name, t = !0);
	}
	t || vp.copy(jd.position), Dp.copy(vp).sub(Tp).normalize(), xp.parent.getWorldQuaternion(Op).invert(), Dp.applyQuaternion(Op).normalize();
	let n = Math.atan2(-Dp.x, -Dp.z), r = Math.asin(V.clamp(Dp.y, -1, 1)), i = 1 - Math.exp(-hp.smoothing * Math.max(0, e)), a = n - yp;
	for (; a > Math.PI;) a -= Math.PI * 2;
	for (; a < -Math.PI;) a += Math.PI * 2;
	yp = V.clamp(yp + a * i, -hp.maxYaw, hp.maxYaw), bp = V.clamp(bp + (r - bp) * i, -hp.maxPitch, hp.maxPitch);
	// Use the bounded angles for the applied direction, not the raw rear target.
	Dp.set(-Math.sin(yp) * Math.cos(bp), Math.sin(bp), -Math.cos(yp) * Math.cos(bp));
	Sp && (Op.copy(Sp).invert(), Dp.applyQuaternion(Op).normalize()), kp.setFromUnitVectors(wp, Dp), Sp && kp.premultiply(Sp), xp.quaternion.slerp(kp, 1 - Math.exp(-hp.smoothing * Math.max(0, e)));
}
function Mp(e, t) {
	let n = Math.atan2(e, t);
	return rp.FRONT_AXIS < 0 ? n + Math.PI : n;
}
ip.position.set(ap.position[0], ap.position[1], ap.position[2]);
var Np = ap.faceTarget || [jd.position.x, jd.position.z];
ip.rotation.y = Mp(Np[0] - ap.position[0], Np[1] - ap.position[2]), Ad.add(ip), window.__room = window.__room || {}, window.__room.character = ip, window.__room.setCharacterYaw = (e) => (ip.rotation.y = Number(e) || 0, ip.rotation.y), window.__room.setNight = (e) => (Vf = +!!e, window.dispatchEvent(new CustomEvent("room:night", { detail: { night: !!e } })), Vf), window.__room.getNight = () => Vf === 1, new Hl().load(rp.url, (e) => {
	let t = e.scene, n = new rn().setFromObject(t), r = n.getSize(new W()), i = n.getCenter(new W());
	if (!Number.isFinite(r.y) || r.y <= 0) {
		console.error("[character] GLB 包围盒异常，已放弃放置：", r.toArray());
		return;
	}
	let a = rp.targetHeight / r.y;
	if (t.position.set(-i.x, -n.min.y, -i.z), t.traverse((e) => {
		(e.isMesh || e.isSkinnedMesh) && (e.castShadow = !0, e.receiveShadow = !0);
	}), ap.legBend) {
		let e = /^(Left|Right)_Leg(_\d+)?$/, n = [];
		t.traverse((t) => {
			t.name && e.test(t.name) && n.push(t);
		});
		let r = n.filter((e) => {
			for (let r = e.parent; r && r !== t; r = r.parent) if (n.indexOf(r) !== -1) return !1;
			return !0;
		});
		op = r, r.forEach((e) => {
			e.rotation.x = ap.legBend;
		}), console.log("[character] 坐姿：已旋转 " + r.length + " 根大腿节点（匹配 " + n.length + " 个）" + (r.length ? " → " + r.map((e) => e.name).join(", ") : " ⚠️ 一根都没匹配到！") + " " + (ap.legBend * 180 / Math.PI).toFixed(0) + "°");
	}
	t.traverse((e) => {
		!xp && /^Head/.test(e.name || "") && (e.isBone || e.children && e.children.length) && (xp = e, Sp = e.quaternion.clone());
	}), ip.scale.setScalar(a), ip.add(t), sp.partsBound = 0, cp(t, e.animations), Id();
	let o = Ap();
	console.log("[character] 已加载 " + rp.url + "：原始高度 " + r.y.toFixed(3) + "，缩放 " + a.toFixed(4) + "，最终身高 " + (r.y * a).toFixed(3) + (o ? "；面部世界坐标 (" + o.x.toFixed(3) + ", " + o.y.toFixed(3) + ", " + o.z.toFixed(3) + ")" : ""));
}, void 0, (e) => {
	console.error("[character] GLB 加载失败：" + rp.url, e);
}), _f(Q, "projects", "PROJECTS", "THE LITTLE COMPUTER", "这里会陈列我的项目、实验和正在制作的小工具。下一步可以把它连接到个人网站的项目页面。", [
	1.9,
	1.5,
	1.3
], [
	2.05,
	2.1,
	-2.15
]), _f(Q, "blog", "BLOG", "THE BOOKSHELF", "把写过的文章、学习记录和折腾技术时留下的笔记，慢慢收进这座书架。", [
	2.15,
	3.1,
	.95
], [
	-4.45,
	1.75,
	-3.2
]), _f(Q, "music", "MUSIC", "THE RECORD PLAYER", "这里会成为音乐博物馆的入口：唱片、歌词、专辑档案，以及喜欢的声音。", [
	1.5,
	1.25,
	1.25
], [
	4.45,
	1.65,
	.1
]), _f(Q, "moments", "MOMENTS", "THE WINDOW CORNER", "日常碎片、灵感和生活里的小事，可以放在这个角落里。", [
	.7,
	2.1,
	1.9
], [
	-5.35,
	2.8,
	.1
]);
var Pp = 96, Fp = /* @__PURE__ */ new Float32Array(288), Ip = new Float32Array(Pp), Lp = new Float32Array(Pp), Rp = /* @__PURE__ */ new Float32Array(288), zp = [
	new J("#ffe6b8"),
	new J("#ffc9df"),
	new J("#bcd8ff")
];
for (let e = 0; e < Pp; e++) {
	Fp[e * 3] = (Math.random() - .5) * 10.5, Fp[e * 3 + 1] = .45 + Math.random() * 4.7, Fp[e * 3 + 2] = (Math.random() - .5) * 6.4, Ip[e] = .22 + Math.random() * .62, Lp[e] = Math.random() * Math.PI * 2;
	let t = zp[e % zp.length];
	Rp[e * 3] = t.r, Rp[e * 3 + 1] = t.g, Rp[e * 3 + 2] = t.b;
}
var Bp = new Ln();
Bp.setAttribute("position", new Sn(Fp, 3)), Bp.setAttribute("aSize", new Sn(Ip, 1)), Bp.setAttribute("aPhase", new Sn(Lp, 1)), Bp.setAttribute("aColor", new Sn(Rp, 3));
var Vp = new Si({
	uniforms: {
		uTime: { value: 0 },
		uOpacity: { value: .58 },
		uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, 1.75) }
	},
	vertexShader: "\n    attribute float aSize;\n    attribute float aPhase;\n    attribute vec3 aColor;\n    uniform float uTime;\n    uniform float uPixelRatio;\n    varying vec3 vColor;\n    varying float vAlpha;\n    void main() {\n      vec3 p = position;\n      p.x += sin(uTime * 0.23 + aPhase) * 0.10;\n      p.y += sin(uTime * 0.34 + aPhase * 1.7) * 0.16;\n      p.z += cos(uTime * 0.19 + aPhase * 0.8) * 0.08;\n      vec4 mv = modelViewMatrix * vec4(p, 1.0);\n      gl_Position = projectionMatrix * mv;\n      gl_PointSize = aSize * uPixelRatio * (80.0 / max(1.0, -mv.z));\n      vColor = aColor;\n      vAlpha = 0.48 + 0.42 * sin(uTime * 0.9 + aPhase * 2.1);\n    }\n  ",
	fragmentShader: "\n    uniform float uOpacity;\n    varying vec3 vColor;\n    varying float vAlpha;\n    void main() {\n      vec2 uv = gl_PointCoord - 0.5;\n      float d = length(uv);\n      float core = smoothstep(0.5, 0.06, d);\n      float alpha = core * uOpacity * max(0.12, vAlpha);\n      if (alpha < 0.01) discard;\n      gl_FragColor = vec4(vColor * (0.8 + core * 0.55), alpha);\n    }\n  ",
	transparent: !0,
	depthWrite: !1,
	blending: 2
}), Hp = new oi(Bp, Vp);
Hp.name = "ambient-dust", Ad.add(Hp);
var Up = new ro(), Wp = new H(), Gp = null, Kp = 0, qp = 0, Jp;
function Yp(e) {
	kd.textContent = e, kd.classList.add("is-visible"), clearTimeout(Jp), Jp = setTimeout(() => kd.classList.remove("is-visible"), 1800);
}
var Xp = {
	moments: "#moments",
	blog: "#blog",
	projects: "#projects",
	music: "https://rinsora.dpdns.org/#museum"
}, Zp = null;
window.__room = window.__room || {}, window.__room.hotspots = () => ({ ...Xp }), window.__room.onHotspot = (e) => (Zp = typeof e == "function" ? e : null, !0);
function Qp(e) {
	if (!e) return !1;
	if (e.charAt(0) === "#") {
		let t = document.querySelector(e);
		t ? t.scrollIntoView({
			behavior: "smooth",
			block: "start"
		}) : location.hash = e;
	} else location.href = e;
	return !0;
}
function $p(e) {
	let t = Xp[e] || null;
	return window.dispatchEvent(new CustomEvent("room:hotspot", { detail: {
		id: e,
		url: t
	} })), typeof Zp == "function" ? (Zp(e, t), !0) : typeof window.roomOnHotspot == "function" ? (window.roomOnHotspot(e, t), !0) : Qp(t);
}
window.__room.trigger = (e) => $p(e);
function em(e) {
	vd ? $p(e.id) : (Ed.textContent = e.eyebrow, Dd.textContent = e.title, Od.textContent = e.description, typeof wd.showModal == "function" ? wd.showModal() : Yp(`${e.title}：${e.description}`));
}
function tm(e) {
	let t = Md.domElement.getBoundingClientRect();
	Wp.x = (e.clientX - t.left) / t.width * 2 - 1, Wp.y = -((e.clientY - t.top) / t.height) * 2 + 1;
}
Md.domElement.addEventListener("pointermove", (e) => {
	tm(e), Up.setFromCamera(Wp, jd);
	let t = Up.intersectObjects(mf, !1)[0]?.object ?? null;
	Kp = t && t.userData.hotspot && t.userData.hotspot.id === "projects" ? 1 : 0, t !== Gp && (Gp = t, Md.domElement.style.cursor = Gp ? "pointer" : "default");
}), Md.domElement.addEventListener("click", (e) => {
	tm(e), Up.setFromCamera(Wp, jd);
	let t = Up.intersectObjects(mf, !1);
	if (t.length) {
		let e = t[0].object;
		if (e.userData.action === "toggleNight") {
			Wf();
			return;
		}
		em(e.userData.hotspot);
	}
}), window.addEventListener("pointermove", (e) => {
	if (e.pointerType === "touch") return;
	let t = e.target;
	t && typeof t.closest == "function" && t.closest(".reset-view, .lock-zoom, .info-dialog") ? cf() : lf(e.clientX, e.clientY);
}, { passive: !0 }), Md.domElement.addEventListener("pointerleave", () => {
	cf(), Kp = 0;
}), document.addEventListener("mouseleave", () => {
	cf(), Kp = 0;
}), document.addEventListener("visibilitychange", () => {
	fm = document.hidden;
	if (fm) { cancelAnimationFrame(roomFrame); roomFrame = null; cf(); }
	else if (!dm) { lm = performance.now(); scheduleRoomFrame(); }
}), window.addEventListener("blur", cf), window.addEventListener("pagehide", cf);
var nm = /* @__PURE__ */ new Map(), rm = 0, im = 0;
function am() {
	let [e, t] = [...nm.values()];
	return Math.hypot(e.x - t.x, e.y - t.y);
}
Md.domElement.addEventListener("pointerdown", (e) => {
	e.pointerType === "touch" && (nm.set(e.pointerId, {
		x: e.clientX,
		y: e.clientY
	}), nm.size === 2 && (rm = am(), im = of));
}), Md.domElement.addEventListener("pointermove", (e) => {
	if (e.pointerType !== "touch" || !nm.has(e.pointerId) || (nm.set(e.pointerId, {
		x: e.clientX,
		y: e.clientY
	}), nm.size !== 2 || sf || rm <= 0)) return;
	let t = am();
	t <= 0 || (of = V.clamp(rm / t * im, Gd, Kd));
});
function om(e) {
	e.pointerType === "touch" && (nm.delete(e.pointerId), nm.size < 2 && (rm = 0));
}
Md.domElement.addEventListener("pointerup", om), Md.domElement.addEventListener("pointercancel", om);
function sm(e) {
	sf = e, Cd.classList.toggle("is-active", e), Cd.setAttribute("aria-pressed", String(e)), Cd.querySelector("span").textContent = e ? "缩放已固定" : "固定缩放", e && (of = Zd), Yp(e ? "已固定缩放大小，只保留鼠标平移" : "已恢复滚轮 / 双指缩放");
}
Cd.addEventListener("click", () => sm(!sf)), Sd.addEventListener("click", () => {
	cf(), nf.x = 0, nf.y = 0, of = Zd, af = Zd, jd.position.copy(Ld), jd.quaternion.copy(qd), Yp("已回到最初的观察视角");
}), Td.addEventListener("click", () => wd.close()), wd.addEventListener("click", (e) => {
	let t = wd.getBoundingClientRect();
	(e.clientX < t.left || e.clientX > t.right || e.clientY < t.top || e.clientY > t.bottom) && wd.close();
});
function cm() {
	let e = Math.max(1, _d.clientWidth), t = Math.max(1, _d.clientHeight);
	if (jd.aspect = e / t, jd.updateProjectionMatrix(), Md.setSize(e, t, !1), hd.root || vd) {
		let e = Md.domElement;
		e.style.display = "block", e.style.width = "100%", e.style.height = "100%";
	}
	Pd.setSize(e, t), Nd.setSize(e, t);
}
new ResizeObserver(cm).observe(_d), cm(), Md.domElement.style.cursor = "default", xd.classList.add("is-hidden");
var lm = performance.now(), um = 0, dm = vd, fm = document.hidden, pm = 0, roomFrame = null;
function scheduleRoomFrame() {
	if (!dm && !fm && roomFrame === null) roomFrame = requestAnimationFrame(mm);
}
window.__room = window.__room || {}, window.__room.pause = () => {
	dm = !0; cancelAnimationFrame(roomFrame); roomFrame = null; return !0;
}, window.__room.resume = () => {
	let e = dm;
	dm = !1; if (e && !fm) { lm = performance.now(); scheduleRoomFrame(); }
	return e;
}, window.__room.isPaused = () => dm || fm, window.__room.frames = () => pm;
function mm() {
	roomFrame = null;
	if (dm || fm) return;
	scheduleRoomFrame(); pm++;
	let e = performance.now(), t = Math.min((e - lm) / 1e3, Wd);
	lm = e, um += t;
	let n = um;
	Vp.uniforms.uTime.value = n, Hp.rotation.y = n * .012;
	for (let e = 0; e < Gf.length; e++) {
		let t = Gf[e];
		t.rotation.z = t.userData.baseRot + Math.sin(n * .62 + e * 1.7) * .012;
	}
	for (let e = 0; e < Kf.length; e++) Kf[e].emissiveIntensity = .82 + Math.sin(n * 1.8 + Jf[e]) * .12;
	Qf.intensity = Hf * (.9 + Math.sin(n * 2.1) * .1), ep.material.opacity = .55 + Math.sin(n * .85) * .18, tp.material.opacity = .5 + Math.cos(n * .67) * .16, np.position.y = 1.18 + Math.sin(n * 1.25) * .004;
	for (let e = 0; e < op.length; e++) op[e].rotation.x = ap.legBend + Math.sin(n * 1.35 + e * Math.PI) * .018;
	ip.position.y = ap.position[1] + Math.sin(n * 1.15) * .005, df(t), jp(t), dp(t), Hf += (Vf - Hf) * (1 - Math.exp(-2.6 * t)), Math.abs(Vf - Hf) < .001 && (Hf = Vf), Uf(Hf), Nd.update(t, n, Hf), qp += (Kp - qp) * (1 - Math.exp(-7 * t)), Math.abs(Kp - qp) < .002 && (qp = Kp), Rl(bf, qp), bf.emissiveIntensity = qp * .3, Lf.intensity += qp * .55, Id();
}
mm(), window.__roomDebug = { camera() {
	return {
		position: [
			+jd.position.x.toFixed(4),
			+jd.position.y.toFixed(4),
			+jd.position.z.toFixed(4)
		],
		quaternion: [
			+jd.quaternion.x.toFixed(6),
			+jd.quaternion.y.toFixed(6),
			+jd.quaternion.z.toFixed(6),
			+jd.quaternion.w.toFixed(6)
		],
		fov: jd.fov,
		aspect: +jd.aspect.toFixed(4),
		locked: Qd
	};
} }, window.__roomDebug.meshes = function(e) {
	let t = [], n = new W();
	return Q.traverse(function(r) {
		if (!r.isMesh) return;
		r.getWorldPosition(n);
		let i = new rn().setFromObject(r).getSize(new W());
		if (!(n.y < (e === void 0 ? 4.2 : e))) {
			var a = Array.isArray(r.material) ? r.material[0] : r.material, o = a && a.userData && a.userData.mc && a.userData.mc.texture || a && a.name || "?";
			t.push({
				n: r.name || r.type,
				t: o,
				y: +n.y.toFixed(2),
				c: [
					+n.x.toFixed(2),
					+n.y.toFixed(2),
					+n.z.toFixed(2)
				],
				s: [
					+i.x.toFixed(2),
					+i.y.toFixed(2),
					+i.z.toFixed(2)
				]
			});
		}
	}), t.sort(function(e, t) {
		return t.y - e.y;
	}), t;
}, window.__roomDebug.pickOn = function(e) {
	return window.__roomDebug._pick = e !== !1, "点选识别: " + (window.__roomDebug._pick ? "已开启 —— 点击画面中的物体，控制台会打印它的名字与材质" : "已关闭");
}, window.__roomDebug.hide = function(e, t) {
	let n = 0;
	return Q.traverse(function(r) {
		r.isMesh && r.name === e && (r.visible = t === !1, n++);
	}), console.log("[hide]", e, "共", n, "个 →", t === !1 ? "显示" : "隐藏"), n;
}, Md.domElement.addEventListener("pointerdown", function(e) {
	if (!window.__roomDebug._pick) return;
	let t = Md.domElement.getBoundingClientRect(), n = new H((e.clientX - t.left) / t.width * 2 - 1, -((e.clientY - t.top) / t.height) * 2 + 1), r = new ro();
	r.setFromCamera(n, jd);
	let i = r.intersectObjects(Q.children, !0);
	if (!i.length) {
		console.log("[pick] 没点到东西");
		return;
	}
	let a = i[0].object, o = Array.isArray(a.material) ? a.material[0] : a.material, s = o && o.userData && o.userData.mc && o.userData.mc.texture || o && o.name || "?", c = a.getWorldPosition(new W());
	console.log("[pick] 名称=" + (a.name || a.type) + " | 材质=" + s + " | 世界坐标=[" + [
		+c.x.toFixed(2),
		+c.y.toFixed(2),
		+c.z.toFixed(2)
	].join(", ") + "]");
});
//#endregion

window.dispatchEvent(new CustomEvent('rinsora:room-ready', { detail: import.meta.url }));
