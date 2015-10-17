function jsonop (a, b) {
	var i, j, el = { _: a }, stacka = [el], stackb = [{ _: b }];
	
	do {
		a = stacka.pop();
		b = stackb.pop();

		for (i in b) {
			if (b[i] === null) {
				delete a[i];
			} else if (b[i] instanceof Array) {
				if (a[i] instanceof Array) {
					if (b[i][0] === null && b[i][b[i].length-1] === null) {
						for (j = 1; j < b[i].length - 1; j++) {
							if (a[i].indexOf(b[i][j]) < 0) a[i].push(b[i][j]);
						}
					} else if (b[i][b[i].length-1] === null) {
						a[i] = b[i].slice(0, -1).concat(a[i]);
					} else if (b[i][0] === null) {
						a[i] = a[i].concat(b[i].slice(1));
					} else {
						a[i] = b[i];
					}
				} else {
					if (b[i][0] === null) b[i].shift();
					if (b[i][b[i].length-1] === null) b[i].pop();
					a[i] = b[i];
				}
			} else if (typeof b[i] === "object" && typeof a[i] === "object") {
				if (b._ === null || a[i] instanceof Array) {
					delete b._;
					a[i] = b[i];
				} else {
					stacka.push(a[i]);
					stackb.push(b[i]);
				}
			} else {
				a[i] = b[i];
			}
		}
	} while (stacka.length);
	
	return el._;
}

module.exports = jsonop;

