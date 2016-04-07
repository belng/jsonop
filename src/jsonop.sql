CREATE FUNCTION jsonop(oa jsonb, ob jsonb, oop jsonb) RETURNS jsonb AS $$
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

	function fn(oa, ob, oop) {
		var el = { _: oa },
		    stack = [{ a: el, b: { _: ob }, op: { _: oop } }];

		var opfn = {
			keep: function keep(a) {
				return a;
			},
			inc: function inc(a, b, params) {
				return params && params[0] ? (a + b) % params[0] : a + b;
			},
			mul: function mul(a, b, params) {
				return params && params[0] ? a * b % params[0] : a * b;
			},
			min: function min(a, b) {
				return Math.min(a, b);
			},
			max: function max(a, b) {
				return Math.max(a, b);
			},
			mavg: function mavg(a, b, params) {
				return (a * (params[0] - 1) + b) / params[0];
			},
			union: function union(a, b, p) {
				console.log("union", a, b, p);
				var arr = Array.isArray(b) ? a.concat(b) : a,
				    result = [],
				    map = {},
				    params = p || [];

				arr.forEach(function (e) {
					if (!map[e] && params.indexOf(e) < 0) result.push(e);
					map[e] = true;
				});

				return result;
			},
			inter: function inter(a, b, params) {
				var map = {};

				for (var _iterator = b, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
					var _ref;

					if (_isArray) {
						if (_i >= _iterator.length) break;
						_ref = _iterator[_i++];
					} else {
						_i = _iterator.next();
						if (_i.done) break;
						_ref = _i.value;
					}

					var i = _ref;
					if (i in a) {
						map[i] = true;
					}
				}
				if (params) for (var i in params) {
					map[i] = true;
				}

				return Object.keys(map);
			},
			splice: function splice(a, b, params) {
				if (params.length >= 2) {
					a.splice.apply(a, [params[0] === null ? Infinity : params[0], params[1]].concat(b));
				}
				if (params.length >= 4) {
					return a.slice(params[2] === null ? Infinity : params[2], params[3] === null ? Infinity : params[3]);
				} else {
					return a;
				}
			},
			replace: function replace(a, b) {
				return b;
			},
			append: function append(a, b, params) {
				return a + (params[0] || "") + b;
			},
			band: function band(a, b) {
				return a & b;
			},
			bor: function bor(a, b) {
				return a | b;
			},
			bxor: function bxor(a, b) {
				return a ^ b;
			},
			and: function and(a, b) {
				return a && b;
			},
			or: function or(a, b) {
				return a || b;
			},
			not: function not(a) {
				return !a;
			}
			// delete and merge are handled separately below
		};

		function deleteOps(obj) {
			var stack = [obj];

			do {
				var o = stack.pop();

				delete stack.__op__;
				for (var i in o) {
					if (_typeof(o[i]) === "object" && o[i] !== null) {
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

			console.log(a, b, i, op, stack);

			if (op === "delete" || op && op[0] === "delete") {
				delete a[i];
			} else if (op && isOp(op) && op !== "merge" && op[0] !== "merge") {
				if (Array.isArray(op)) {
					a[i] = deleteOps(opfn[op.shift()](a[i], b[i], op));
				} else {
					a[i] = deleteOps(opfn[op](a[i], b[i]));
				}
			} else if (Array.isArray(b[i]) && Array.isArray(a[i]) && (op === "merge" || op && op[0] === "merge")) {
				stack.push({ a: a[i], b: b[i] });
			} else if (Array.isArray(b) && b[i] === null) {
				// While merging arrays, skip nulls
			} else if (_typeof(b[i]) === "object" && _typeof(a[i]) === "object" && b[i] !== null && a[i] !== null && !Array.isArray(a[i]) && !Array.isArray(b[i])) {
					stack.push({ a: a[i], b: b[i], op: op });
				} else {
					a[i] = b[i];
				}
		}

		var count = 0;
		do {
			var frame = stack.pop(),
			    a = frame.a,
			    b = frame.b;
			var op = undefined,
			    map = undefined;

			count++;
			if (count > 1000) {
				throw Error('Cycle?');
			}
			if (frame.op && b.__op__) {
				op = jsonop(frame.op, b.__op__);
			} else {
				op = b.__op__ || frame.op;
			}
			map = op ? {} : b;

			if (op) {
				for (var i in b) {
					if (i !== "__op__") {
						map[i] = true;
					}
				}

				if (op.__all__) {
					for (var i in a) {
						map[i] = true;
					}
				} else {
					for (var i in op) {
						map[i] = true;
					}
				}
			}

			for (var i in map) {
				opval(a, b, i, b[i] && isOp(b[i].__op__) ? b[i].__op__ : op && (op[i] || op.__all__), stack);
			}
		} while (stack.length);

		return el._;
	}

	return fn(oa, ob, oop);

$$ LANGUAGE plv8 IMMUTABLE;
