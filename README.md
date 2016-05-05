jsonop
======
_JSON-encoded operations on JSON documents_

JSONOP is similar to $.extend but much more flexible. It is invoked as `jsonop.apply(object, change)`. You may also merge multiple changes into a single one with `jsonop.merge(change1, change2)`

The general approach is that change contains new values to insert; if there’s already an old value at that location, a customizable update operation is performed.

The default update operation for objects is recursive merge while for arrays and other it is replacement. However the default can be modified by passing an operation instead of a value. The operation can be a string beginning with `$`, as with `$delete`, or



```
{ foo: 3 }, { foo: 5 } === { foo: 5 }
{ bar: 5 }, { bar: [4, "$add"] } === { bar: 9 }
{ baz: [2, "$add"] }, { baz: [3, "$mul"] } === { baz: [2, "$add", 3, "$mul"] }
```



### Supported Operations ###

#### All values ####

- delete 0
- default 2 (current value, default value)
- replace 2 (useful for objects: don't merge, just replace. For all other types this is the default behavior.)
- merge 2  (treats arrays as tuples, replacing 0th element with 0th, etc. This is the default behavior for objects.)

#### Numbers ####
- add 2
- mul 2
- min 2
- mod 2

#### Arrays ####
- union  2
- inter  2
- remove 2
  These treat the array as a set.

- push 3 (current array, insert position, insert items)
- chop 3 (current array, remove position, remove count)
  These treat the array as a list. Insert/Remove position can be null for end of list, or negative to count backwards. Remove count can also be negative to count backwards.


#### Objects ##

#### Strings ####
- append 3 (current string, string to append, delimiter)
Delimiter is not used if current string is empty

#### Booleans ###
- and 2
- or 2
- not 1


#### Examples ####

```javascript
jsonop.apply(
    { foo: { bar: 3 } },
    { foo: { baz: 4 } }
) === { foo: { bar: 3, baz: 4 }

jsonop.apply(
    { foo: { bar: 3 } },
    { foo: [ { baz: 4}, "$replace" ] }
) === { foo: { baz: 4 } } // op can be defined inside the value it affects

jsonop.apply(
    { foo: { bar: 3 } },
    { foo: "$delete" }
) === { } // or outside

jsonop.apply(
    { foo: [1, 2, 3] },
    { foo: [ null, [4, 5], "$push" ] } // null => insert at end
) === { foo: [1, 2, 3, 4, 5] } // and can work on any value
```
