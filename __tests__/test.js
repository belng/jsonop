/* eslint-env jest */

jest.dontMock("../jsonop");

const jsonop = require("../jsonop");

describe("jsonop", () => {
	it("kitchen sink", () => {
		expect(jsonop(
			{
				a: { foo: 34, bar: "h" },
				b: { foo: 4 },
				c: { foo: 34, bar: "h" },
				d: { foo: 4 },
				e: { foo: "Hello" },
				f: [ 1, 2, 3, 4, 5 ],
				g: [ 1, 2, 3, 4, 5 ]
			},
			{
				a: { bar: "i", baz: 4 },
				b: { __op__: { foo: "delete" } },
				c: { bar: "i", baz: 4 },
				d: { foo: 2, __op__: { foo: [ "inc" ] } },
				e: { foo: "World" },
				f: [ 7, 8, 9 ],
				g: [ 7, null, null, 8 ],

				__op__: {
					c: "replace",
					e: { foo: [ "append", " " ] },
					g: "merge"
				}
			}
		)).toEqual(
			{
				a: { foo: 34, bar: "i", baz: 4 },
				b: {},
				c: { bar: "i", baz: 4 },
				d: { foo: 6 },
				e: { foo: "Hello World" },
				f: [ 7, 8, 9 ],
				g: [ 7, 2, 3, 8, 5 ] }
		);
	});
});
