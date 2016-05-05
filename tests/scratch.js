// function chop (a, pos, num) {
// 	if (pos === null) return a.slice(0, a.length + num);
// 	if (pos < 0) pos = a.length + pos;
// 	if (num < 0) { pos += num; num = -num; }
// 	if (pos < 0) { num += pos; pos = 0; }
// 	console.log(pos, num);
// 	return a.slice(0, pos).concat(a.slice(pos + num));
// };
//
// // console.log(1, chop([1, 2, 3, 4, 5], null, -2));
// // console.log(2, chop([1, 2, 3, 4, 5], 0, 1));
// // console.log(3, chop([1, 2, 3, 4, 5], 2, 1));
// // console.log(4, chop([1, 2, 3, 4, 5], 2, -1));
// // console.log(5, chop([1, 2, 3, 4, 5], -1, 1));
// // console.log(6, chop([1, 2, 3, 4, 5], -1, -2));
// //
// // console.log(7, chop([1, 2, 3, 4, 5], -1, 3));
// console.log(8, chop([1, 2, 3, 4, 5], -3, -5));
//
// console.log(9, chop([1, 2, 3, 4, 5], 2, -3));
// console.log(10, chop([1, 2, 3, 4, 5], 0, -1));
// console.log(11, chop([1, 2, 3, 4, 5], null, 0));
// console.log(11, chop([1, 2, 3, 4, 5], 0, 0));
// console.log(11, chop([1, 2, 3, 4, 5], 3, 0));
// console.log(11, chop([1, 2, 3, 4, 5], -2, 0));

function deop(object) {
	var i, j, clone = object, cloned = false, val;

	if (object === "foo") return "bar";
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

var a = {
	a: 53,
	b: { x: "foo", y: { z: 4 } },
	c: { y: false, z: "potato" },
	d: [ "foo", "bar", { z: 4 } ],
};

var b = deop(a);

console.log(b);
console.log(a === b);
console.log(a.b === b.b);
console.log(a.c === b.c);
console.log(a.b.y === b.b.y);
console.log(a.d === b.d);
console.log(a.d[0] === b.d[0]);
console.log(a.d[1] === b.d[1]);
console.log(a.d[2] === b.d[2]);
