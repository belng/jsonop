"use strict";

const opfn = {
	keep: (a) => a,
	inc: (a, b, params) => (params && params[0]) ? (a + b) % params[0] : a + b,
	mul: (a, b, params) => (params && params[0]) ? (a * b) % params[0] : a * b,
	min: (a, b) => Math.min(a, b),
	max: (a, b) => Math.max(a, b),
	mavg: (a, b, params) => (a * (params[0] - 1) + b) / params[0],
	union: (a, b, params) => {
		const map = {};

		for (const i of a) { map[i] = true; }
		for (const i of params) { delete map[i]; }
		for (const i of b) { map[i] = true; }

		return Object.keys(map);
	},
	inter: (a, b, params) => {
		const map = {};

		for (const i of b) { if (i in a) { map[i] = true; } }
		for (const i in params) { map[i] = true; }

		return Object.keys(map);
	},
	splice: (a, b, params) => {
		if (params.length >= 2) {
			a.splice(
				params[0] === null ? Infinity : params[0], params[1], ...b
			);
		}
		if (params.length >= 4) {
			return a.slice(
				params[2] === null ? Infinity : params[2],
				params[3] === null ? Infinity : params[3]
			);
		} else { return a; }
	},
	replace: (a, b) => b,
	append: (a, b, params) => a + (params[0] || "") + b,
	band: (a, b) => a & b,
	bor: (a, b) => a | b,
	bxor: (a, b) => a ^ b,
	and: (a, b) => a && b,
	or: (a, b) => a || b,
	not: (a) => !a
	// delete and merge are handled separately below
};

function deleteOps(obj) {
	const stack = [ obj ];

	do {
		const o = stack.pop();

		delete stack.__op__;
		for (const i in o) {
			if (typeof o[i] === "object" && o[i] !== null) {
				stack.push(o[i]);
			}
		}
	} while (stack.length);
	return obj;
}

function isOp(op) {
	return typeof op === "string" || Array.isArray(op);
}

function opval(a, b, i, op, stack) {
	if (op === "delete" || op && op[0] === "delete") {
		delete a[i];
	} else if (op && isOp(op) && op !== "merge" && op[0] !== "merge") {
		if (Array.isArray(op)) {
			a[i] = deleteOps(opfn[op.shift()](a[i], b[i], op));
		} else {
			a[i] = deleteOps(opfn[op](a[i], b[i]));
		}
	} else if (
		Array.isArray(b[i]) && Array.isArray(a[i]) &&
		(op === "merge" || op && op[0] === "merge")
	) {
		stack.push({ a: a[i], b: b[i] });
	} else if (Array.isArray(b) && b[i] === null) {
		// While merging arrays, skip nulls
	} else if (
		typeof b[i] === "object" && typeof a[i] === "object" &&
		b[i] !== null && a[i] !== null &&
		!Array.isArray(a[i]) && !Array.isArray(b[i])
	) {
		stack.push({ a: a[i], b: b[i], op });
	} else {
		a[i] = b[i];
	}
}

function jsonop (oa, ob, oop) {
	const el = { _: oa }, stack = [ { a: el, b: { _: ob }, op: { _: oop } } ];

	do {
		const frame = stack.pop(),
			a = frame.a, b = frame.b;
		let op, map;

		if (frame.op && b.__op__) {
			op = jsonop(frame.op, b.__op__);
		} else {
			op = b.__op__ || frame.op;
		}
		map = op ? {} : b;

		if (op) {
			for (const i in b) { if (i !== "__op__") { map[i] = true; } }

			if (op.__all__) {
				for (const i in a) { map[i] = true; }
			} else {
				for (const i in op) { map[i] = true; }
			}
		}

		for (const i in map) {
			opval(a, b, i, b[i] && isOp(b[i].__op__) ? b[i].__op__ :
				op && (op[i] || op.__all__), stack);
		}
	} while (stack.length);

	return el._;
}

module.exports = jsonop;
