/*
	This file is intentionally written in ES3.
*/

"use strict";

function JO (left, right, apply) {
	var opfn;

	function isArray(arr) {
		return Object.prototype.toString.call(arr) === "[object Array]";
	}

	function updater(fn) {
		return function (a, b) {
			return typeof a === "undefined" ? deop(b) : fn(a, b);
		};
	}

	opfn = {
		$delete: function (a) { return; },
		$default: updater(function (a, b) { return a; }),
		$replace: function (a, b) { return deop(b); },

		$add: updater(function (a, b) { return a + b; }),
		$mul: updater(function (a, b) { return a * b; }),
		$min: updater(function (a, b) { return Math.min(a, b); }),
		$max: updater(function (a, b) { return Math.max(a, b); }),
		$mod: updater(function (a, b) { return a % b; }),

		$union: updater(function (a, b) {
			var result = a.slice(0), i = 0, l = b.length;
			for (; i < l; i++) if (a.indexOf(b[i]) === -1) result.push(b[i]);
			return result;
		}),
		$inter: updater(function (a, b) {
			var result = [], i = 0, l = b.length;
			for (; i < l; i++) if (a.indexOf(b[i]) >= 0) result.push(b[i]);
			return result;
		}),
		$remove: updater(function (a, b) {
			var pos = a.indexOf(b);
			if (pos >= 0) return a.slice(0, pos).concat(a.slice(pos + 1));
		}),

		$push: function (a, pos, b) {
			if (typeof a === "undefined") return;
			if (pos === null) return a.concat(deop(b));
			return a.slice(0, pos).concat(deop(b), a.slice(pos));
		},
		$chop: function (a, pos, num) {
			if (typeof a === "undefined") return [];
			if (pos === null) return a.slice(0, a.length + num);
			if (pos < 0) pos = a.length + pos;
			if (num < 0) { pos += num; num = -num; }
			if (pos < 0) { num += pos; pos = 0; }
			return a.slice(0, pos).concat(a.slice(pos + num));
		},

		$merge: updater(function (a, b) {
			var i = 0, l = b.length, r = a.slice(0);
			for (; i < l; i++) if (b[i] !== null) r[i] = jsonop(r[i], b[i]);
			return r;
		}),

		$append: updater(function (a, b) { return a + b; }),

		$and: updater(function (a, b) { return a && b; }),
		$or: updater(function (a, b) { return a || b; }),
		$not: function (a) { return !a; }
	};

	function isOperator(value) {
		return (typeof value === "string" && value[0] === "$");
	}

	function isOperation(value) {
		var i, l;
		if (isOperator(value)) return true;
		if (isArray(value)) {
			for (i = 0, l = value.length; i < l; i++) {
				if (isOperator(value[i])) return true;
			}
		}
		return false;
	}

	function execute(tokens) {
		var stack = [], i = 0, l = tokens.length, j, fn, args;
		for(; i < l; i++) if (isOperator(tokens[i])) {
			fn = opfn[tokens[i]]; args = [];
			if (typeof fn !== "function") throw Error("NoSuchOp " + tokens[i]);
			for (j = 0; j < fn.length; j++) args.unshift(stack.pop());
			stack.push(fn.apply(null, args));
		} else {
			stack.push(tokens[i]);
		}
		if (stack.length !== 1) throw Error("OpRun " + JSON.stringify(tokens));
		return stack[0];
	}

	function merge(left, right) {
		var i, result = {}, res;
		for (i in left) result[i] = left[i];
		for (i in right) {
			res = jsonop(result[i], right[i]);
			if (typeof res === "undefined") {
				delete result[i];
			} else {
				result[i] = res;
			}
		}
		return result;
	}

	function deop(object) {
		var i, j, clone = object, cloned = false, val;

		if (!apply) return object;
		if (isOperation(object)) return execute([ undefined ].concat(object));
		if (typeof object !== "object" || object === null) return object;

		for (i in object) {
			val = deop(object[i]);
			if (val !== object[i]) {
				if (!cloned) {
					clone = Array.isArray(object) ? [] : {};
					for (j in object) {
						if (j === i) break;
						clone[j] = object[j];
					}
					cloned = true;
				}
			}
			if (cloned) clone[i] = val;
		}

		return clone;
	}

	function jsonop(left, right) {
		if (isOperation(right)) {
			right = isArray(right) ? right : [ right ];
			if (isOperation(left)) {
				left = isArray(left) ? left : [ left ];
				if (!apply) return left.concat(right);
				return execute([ undefined ].concat(left, right));
			}

			if (!apply && typeof left === "undefined") return right;
			return execute([ left ].concat(right));
		}

		if (typeof left === "object" && left !== null && !isArray(left)) {
			if (typeof right === "object" && right !== null && !isArray(right)){
				return merge(left, right);
			}
		}

		return typeof right !== "undefined" ? deop(right) : left;
	}

	return jsonop(left, right);
}

JO.merge = function (left, right) { return JO(left, right, false); };
JO.apply = function (left, right) { return JO(left, right, true); };

module.exports = JO;
