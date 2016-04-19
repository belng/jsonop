jsonop
======
_JSON-encoded operations on JSON documents_

JSONOP is similar to $.extend but much more flexible. It is invoked as `jsonop(object, change)`.

The general approach is that change contains new values to insert; if there’s already an old value at that location, a customizable update operation is performed.

The default update operation for objects is recursive merge while for arrays and other it is replacement. However the default can be modified using `__op__` keys as shown in the examples below.

#### Examples ####

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
    { foo: 3, baz: 5, __op__: { __all__: "inc" } }
) === { foo: 5, bar: 4, baz: 5 } // __any__ is useful

jsonop(
    { foo: 6 },
    { foo: 4, __op__: { foo: [ "mavg", 10 ] } }
) === { foo: 5.8 } // __op__ with arguments
```

### Supported Operations ###

#### All values ####

- delete
- keep (ignore change if value already exists)

#### Numbers ####
- inc
- mul
- min
- max
- mavg (approx. moving average; param: number of samples)
- mod  (modulus)

#### Arrays ####
- union
- inter
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
