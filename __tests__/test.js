/* eslint-env jest */

jest.dontMock("../jsonop");
jest.autoMockOff();

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
					e: { foo: [ "append", " " ] },
					g: "merge"
				}
			},
			{
				c: "replace"
			}
		)).toEqual(
			{
				a: { foo: 34, bar: "i", baz: 4 },
				b: {},
				c: { bar: "i", baz: 4 },
				d: { foo: 6 },
				e: { foo: "Hello World" },
				f: [ 7, 8, 9 ],
				g: [ 7, 2, 3, 8, 5 ] 
			}
		);
	});
	
	it("test 2", () => {
		expect(jsonop(
			{ foo: 2, bar: 4 },
			{ foo: 3, baz: 5, __op__: { __any__: "inc" } }
		)).toEqual({ foo: 5, bar: 4, baz: 5 });
	});
	
	it("test 3", () => {
		expect(jsonop(
			{ foo: 6 },
			{ foo: 4, __op__: { foo: [ "mavg", 10 ] } }
		)).toEqual({ foo: 5.8 });
	})
});
