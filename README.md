# jsonop
JSON-encoded operations on JSON

JSONOP is similar to $.extend but much more flexible. It is invoked as `jsonop(object, change)`.

The default behavior for objects is recursive merge. For arrays and other
values, the default behavior is replacement.

The default can be modified using __op__ keys.

Examples:

```javascript
jsonop(
    { foo: { bar: 3 } },
    { foo: { baz: 4 } }
) === { foo: { bar: 3, baz: 4 }

jsonop(
    { foo: { bar: 3 } },
    { foo: { baz: 4, __op__: "replace" } }
) === { foo: { baz: 4 } } // op can be defined inside the value it affects

jsonop(
    { foo: { bar: 3 } },
    { foo: { baz: 4 }, __op__: { foo: "delete" } }
) === { } // or outside

jsonop(
    { foo: [1, 2, 3] },
    { foo: [4, 5], __op__: { foo: "splice" } }
) === { foo: [1, 2, 3, 4, 5] } // and can work on any value

jsonop(
    { foo: 2, bar: 4 },
    { foo: 3, baz: 5, __op__: { __any__: "inc" } }
) === { foo: 5, bar: 4, baz: 5 } // __any__ is useful

jsonop(
    { foo: 6 },
    { foo: 4, __op__: { foo: [ "mavg", 10 ] } }
) === { foo: 5.8 } // __op__ with arguments
```

### Supported Operations ###

#### All values ####

- delete
- keep (ignores change if value already exists)

#### Numbers ####
- inc (optional modulus)
- mul (optional modulus)
- min
- max
- mavg (approx. moving average; param: number of samples)

#### Arrays ####
- union (optional values to remove)
- inter (optional values to add)
- splice (insert pos, opt remove count, opt trim start/end; -ve pos from end)
- merge (treat as tuple, skip nulls)

#### Objects ##
- replace (don't merge, just replace)

#### Strings ####
- append (optional delimiter)

#### Bit fields ###
- band
- bor
- bxor

#### Booleans ###
- and
- or
- not*
