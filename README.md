# jsonop
_JSON-encoded operations on JSON documents_

It’s like `$.extend()`, but much more powerful. Complex operations can be represented intuitively using JSON by assigning special meanings to the value `null` and the property name `"_"` (a single underscore).

## Installation and usage
```sh
$ npm install jsonop
```
```javascript
jsonop = require("jsonop");
```

### Object Operations

**1. Recursive merge (extend)**
```javascript
    jsonop({ a: 3, b: { c: 4 }}, { a: 5, b: { d: 6 }})
    // Returns { a: 5, b: { c: 4, d: 6 }}
```
**2. Delete keys with `<key>: null`**
```javascript
  jsonop({ a: 3, b: 4 }, { a: null });
  // Returns { b: 4 }
```
**3. Replace a subtree with `{ _: null, … }`**
```javascript
    jsonop({ a: 3, b: { c: 4 }}, { a: 5, b: { _: null, d: 6 }})
    // Returns { a: 5, b: { d: 6 }}
```

### Array Operations

**4. Replace array**
```javascript
    jsonop({ a: 3, b: [1, 2, 3]}, { b: [4, 5]})
    // Returns { a: 3, b: [4, 5]}
```

#### Array as List

**5. Append items with `[null, …]`**
Creates the array if it doesn’t exist.
```javascript
    jsonop({ a: 3, b: [1, 2, 3]}, { b: [null, 4, 5]})
    // Returns { a: 3, b: [1, 2, 3, 4, 5]}
    
    jsonop({ a: 3 }, { b: [null, 4, 5]})
    // Returns { a: 3, b: [4, 5]}
```

**6. Prepend items with `[…, null]`**
Creates the array if it doesn’t exist.
```javascript
    jsonop({ a: 3, b: [1, 2, 3]}, { b: [4, 5, null]})
    // Returns { a: 3, b: [4, 5, 1, 2, 3]}
```

**7. Splice with `{ _: [<index>, <remove_count>, <insert_items> ]}`**
Remove or insert items at a specific index.
_Spec under review; Not implemented._
```javascript
    jsonop({ a: 3, b: [1, 2, 3]}, { b: { _: [1, 1, 4, 5]}})
    // Returns { a: 3, b: [1, 4, 5, 3]}
```

#### Array as Set
Set operations only work correctly when items are primitives (strings or numbers).

**8. Add items with `[null, …, null]`**
Creates the array if it doesn’t exist. Skips duplicates.
```javascript
    jsonop({ a: 3, b: [1, 2, 3]}, { b: [null, 3, 5, null]})
    // Returns { a: 3, b: [4, 5, 1, 2, 3]}
```

**9. Remove items with `{ _: <item> }`**
_Not yet implemented._
```javascript
    jsonop({ a: 3, b: [1, 2, 3]}, { b: { _: 3 }})
    // Returns { a: 3, b: [1, 2]}
```

#### Array as Tuple

**10. Replace items with `{ <index>: <item> }`**
_Not yet implemented._
```javascript
    jsonop({ a: 3, b: [1, 2, 3]}, { b: { _: 3 }})
    // Returns { a: 3, b: [1, 2]}
```

## Limitations
- `null` cannot be used
- `"_"` (a single underscore) cannot be used as a property name
- Sets cannot contain objects or arrays

