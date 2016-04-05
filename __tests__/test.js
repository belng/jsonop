/* eslint-env jest */

jest.dontMock("../src/jsonop");
jest.autoMockOff();

const jsonop = require("../src/jsonop");

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
				g: [ 1, 2, 3, 4, 5 ],
				h: { a: 1, b: 3 }
			},
			{
				a: { bar: "i", baz: 4 },
				b: { __op__: { foo: "delete" } },
				c: { bar: "i", baz: 4 },
				d: { foo: 2, __op__: { foo: [ "inc" ] } },
				e: { foo: "World" },
				f: [ 7, 8, 9 ],
				g: [ 7, null, null, 8 ],
				h: { a: 2, b: 5 },
				__op__: {
					e: { foo: [ "append", " " ] },
					g: "merge",
					f: "splice"
				}
			},
			{
				c: "replace",
				h: { __all__: "inc" }
			}
		)).toEqual(
			{
				a: { foo: 34, bar: "i", baz: 4 },
				b: {},
				c: { bar: "i", baz: 4 },
				d: { foo: 6 },
				e: { foo: "Hello World" },
				f: [ 7, 8, 9 ],
				g: [ 7, 2, 3, 8, 5 ],
				h: { a: 3, b: 8 }
			}
		);
	});

	it("test 2", () => {
		expect(jsonop(
			{ foo: 2, bar: 1, baz: 2 },
			{ foo: 3, bar: 1, baz: 6 }, { __all__: "inc" }
		)).toEqual({ foo: 5, bar: 2, baz: 8 });
	});

	it("test 3", () => {
		expect(jsonop(
			{ foo: 6 },
			{ foo: 4, __op__: { foo: [ "mavg", 10 ] } }
		)).toEqual({ foo: 5.8 });
	});

	it("test 4", () => {
		expect(jsonop(
			{},
			{
				key1: {
					key2: {
						key3: 'value3'
					}
				},
				key4: {
					key5: {
						key6: 'value6'
					}
				}
			}
		)).toEqual(
		{
			key1: {
				key2: {
					key3: 'value3'
				}
			},
			key4: {
				key5: {
					key6: 'value6'
				}
			}
		});
	});


	it("test 5", () => {
		console.log("+++++++++++");
		expect(jsonop(
			{
				"key1": "hello",
				"key2": "world",
			},
			{
				__op__: {
					"key1": "delete"
				}
			}
		)).toEqual({
			"key2": "world",
		});
	});


	it("Array union", () => {
		expect(jsonop([ 1, 2 ], [ 3 ], "union")).toEqual([ 1, 2, 3 ]);
	});
});
