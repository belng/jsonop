var jsonop = require("./jsonop"),
	assert = require("assert");

it("should merge objects recursively", () => {
	assert.deepEqual(
		jsonop({
			a: 1,
			b: { d: 4, c: false },
			c: [1, 2, 3]
		}, {
			b: { c: null },
			c: [null, 3, 5, null]
		}),
		{
			a: 1,
			b: { d: 4 },
			c: [1, 2, 3, 5 ]
		}
	);
});


