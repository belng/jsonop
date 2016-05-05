var jsonop = require('../src/jsonop.js'),
	test = require('ava');

test('kitchen sink', (t) => {
	t.deepEqual(
		jsonop.apply(
			{
				a: 1,
				b: 2,
				c: 3,
				d: 4,
				e: 5,
				f: { foo: 6 },
				g: [7, 8, 9],
				h: [8, 9, 10],
				i: { foo: 9 },
			},
			{
				a: 3,
				b: [2, "$add"],
				d: [4, "$mul"],
				e: "$delete",
				f: { bar: 7 },
				g: [10, 11],
				h: [ [11, 9, 4], "$union" ],
				i: [ { bar: 10 }, "$replace" ],
				j: [ 3, "$add" ],
			}
		),
		{
			a: 3,
			b: 4,
			c: 3,
			d: 16,
			f: { foo: 6, bar: 7 },
			g: [10, 11],
			h: [8, 9, 10, 11, 4],
			i: { bar: 10 },
			j: 3
		}
	);

	t.deepEqual(
		jsonop.merge(
			{
				a: 3,
				b: [4, "$mul", 5, "$mod"],
				c: [ [1, 2, 3], "$union"]
			},
			{
				a: [4, "$mul"],
				b: [3, "$add"],
				c: [4, 5, 6],
				d: [ "asdf", "$append" ],
				e: 55
			}
		),
		{
			a: 12,
			b: [4, "$mul", 5, "$mod", 3, "$add"],
			c: [4, 5, 6],
			d: ["asdf", "$append"],
			e: 55
		}
	);
});
