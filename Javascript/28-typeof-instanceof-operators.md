# Type Checking: typeof & instanceof Operators

## Table of Contents
1. typeof Operator
2. typeof Results
3. instanceof Operator
4. Object Type Checking
5. Primitive vs Object Types
6. Type Checking Patterns
7. Edge Cases & Gotchas
8. Combining Operators
9. Best Practices

---

## 1. typeof Operator

### Basic typeof
```javascript
// Get type of value as string
console.log(typeof 42);              // "number"
console.log(typeof "hello");         // "string"
console.log(typeof true);            // "boolean"
console.log(typeof undefined);       // "undefined"
console.log(typeof Symbol('id'));    // "symbol"
console.log(typeof 123n);            // "bigint"

// typeof returns a string
let type = typeof 42;
console.log(typeof type);  // "string" (typeof returns string!)
```

### typeof with Objects
```javascript
// Objects return "object"
console.log(typeof {});           // "object"
console.log(typeof []);           // "object" (array is object!)
console.log(typeof null);         // "object" (famous bug!)
console.log(typeof new Date());   // "object"
console.log(typeof new Map());    // "object"
```

### typeof with Functions
```javascript
// Functions return "function"
console.log(typeof function() {});  // "function"
console.log(typeof (() => {}));     // "function"
console.log(typeof Math.max);       // "function"
console.log(typeof String);         // "function"

// Class is also function
class User {}
console.log(typeof User);  // "function"
```

---

## 2. typeof Results

### Complete Reference Table
```javascript
// Primitives
typeof undefined          // "undefined"
typeof true              // "boolean"
typeof false             // "boolean"
typeof 42                // "number"
typeof 123.45            // "number"
typeof "hello"           // "string"
typeof ""                // "string"
typeof Symbol('id')      // "symbol"
typeof 123n              // "bigint"

// Objects
typeof {}                // "object"
typeof []                // "object"
typeof null              // "object" (bug!)
typeof new Date()        // "object"
typeof new Error()       // "object"
typeof new Map()         // "object"
typeof new Set()         // "object"
typeof /regex/           // "object"

// Functions
typeof function() {}     // "function"
typeof (() => {})        // "function"
typeof class User {}     // "function"
typeof Math.pow          // "function"
```

### Null is Tricky
```javascript
// null is NOT an object (even though typeof returns "object")
let x = null;
console.log(typeof x);            // "object" (incorrect!)
console.log(x === null);          // true (correct way to check)

// Check for null
function isNull(x) {
    return x === null;
}

console.log(isNull(null));        // true
console.log(isNull(undefined));   // false
console.log(isNull(0));           // false
```

---

## 3. instanceof Operator

### Basic instanceof
```javascript
// Check if object is instance of class/constructor
let arr = [1, 2, 3];
console.log(arr instanceof Array);        // true
console.log(arr instanceof Object);       // true (all objects)

let date = new Date();
console.log(date instanceof Date);        // true
console.log(date instanceof Object);      // true

let regex = /test/;
console.log(regex instanceof RegExp);     // true
console.log(regex instanceof Object);     // true
```

### instanceof with Classes
```javascript
class Animal {}
class Dog extends Animal {}

let dog = new Dog();
console.log(dog instanceof Dog);          // true
console.log(dog instanceof Animal);       // true (inheritance)
console.log(dog instanceof Object);       // true

let animal = new Animal();
console.log(animal instanceof Dog);       // false
```

### instanceof with Primitives
```javascript
// Primitives return false (they're not objects)
console.log(42 instanceof Number);        // false
console.log("hello" instanceof String);   // false
console.log(true instanceof Boolean);     // false

// But wrapped objects return true
let num = new Number(42);
console.log(num instanceof Number);       // true

let str = new String("hello");
console.log(str instanceof String);       // true
```

---

## 4. Object Type Checking

### Check Array
```javascript
let arr = [1, 2, 3];
let obj = { a: 1 };

// Method 1: instanceof (simple)
console.log(arr instanceof Array);        // true
console.log(obj instanceof Array);        // false

// Method 2: Array.isArray (most reliable)
console.log(Array.isArray(arr));          // true
console.log(Array.isArray(obj));          // false

// Method 3: toString (works across frames)
console.log(Object.prototype.toString.call(arr));   // [object Array]
console.log(Object.prototype.toString.call(obj));   // [object Object]
```

### Check Plain Object
```javascript
// Check if plain object (not array, date, etc)
function isPlainObject(obj) {
    return obj && typeof obj === 'object' && obj.constructor === Object;
}

console.log(isPlainObject({}));           // true
console.log(isPlainObject({ a: 1 }));     // true
console.log(isPlainObject([]));           // false
console.log(isPlainObject(new Date()));   // false
console.log(isPlainObject(null));         // false
```

### Check Specific Types
```javascript
// Check if Date
function isDate(obj) {
    return obj instanceof Date;
}

// Check if RegExp
function isRegExp(obj) {
    return obj instanceof RegExp;
}

// Check if Map
function isMap(obj) {
    return obj instanceof Map;
}

// Check if Set
function isSet(obj) {
    return obj instanceof Set;
}

console.log(isDate(new Date()));      // true
console.log(isRegExp(/test/));        // true
console.log(isMap(new Map()));        // true
console.log(isSet(new Set()));        // true
```

---

## 5. Primitive vs Object Types

### Primitive Type Checking
```javascript
// Check if primitive
function isPrimitive(value) {
    return value !== Object(value);
}

console.log(isPrimitive(42));         // true
console.log(isPrimitive("hello"));    // true
console.log(isPrimitive(true));       // true
console.log(isPrimitive(null));       // true
console.log(isPrimitive(undefined));  // true

console.log(isPrimitive({}));         // false
console.log(isPrimitive([]));         // false
```

### Object Type Checking
```javascript
// Check if object (not primitive)
function isObject(value) {
    return typeof value === 'object' && value !== null;
}

console.log(isObject({}));            // true
console.log(isObject([]));            // true
console.log(isObject(new Date()));    // true

console.log(isObject(42));            // false
console.log(isObject("hello"));       // false
console.log(isObject(null));          // false
```

### Determine Actual Type
```javascript
// Get actual type name
function getType(value) {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (Array.isArray(value)) return 'array';
    return typeof value;
}

console.log(getType(42));            // "number"
console.log(getType("hello"));       // "string"
console.log(getType([]));            // "array"
console.log(getType({}));            // "object"
console.log(getType(null));          // "null"
console.log(getType(undefined));     // "undefined"
```

---

## 6. Type Checking Patterns

### Type Guard Function
```javascript
// Guard functions for different types
const isNumber = (x) => typeof x === 'number';
const isString = (x) => typeof x === 'string';
const isBoolean = (x) => typeof x === 'boolean';
const isArray = (x) => Array.isArray(x);
const isObject = (x) => typeof x === 'object' && x !== null;
const isFunction = (x) => typeof x === 'function';
const isDefined = (x) => x !== undefined;
const isNull = (x) => x === null;

// Usage
function processValue(value) {
    if (isNumber(value)) {
        console.log('Processing number:', value * 2);
    } else if (isString(value)) {
        console.log('Processing string:', value.toUpperCase());
    } else if (isArray(value)) {
        console.log('Processing array:', value.length);
    }
}
```

### Type Validation
```javascript
// Validate function input
function calculateArea(length, width) {
    if (typeof length !== 'number' || length <= 0) {
        throw new Error('Length must be positive number');
    }
    if (typeof width !== 'number' || width <= 0) {
        throw new Error('Width must be positive number');
    }
    return length * width;
}

calculateArea(5, 10);      // 50
calculateArea(-5, 10);     // Error!
calculateArea("5", 10);    // Error!
```

### Type Coercion Safety
```javascript
// Avoid implicit type coercion
// ✗ WRONG - Relies on coercion
if (value == 42) {}        // Might be string "42"

// ✓ CORRECT - Type safe
if (typeof value === 'number' && value === 42) {}

// ✗ WRONG - typeof might be unexpected
if (typeof array === 'object') {   // Also true for null!
    console.log(array.length);
}

// ✓ CORRECT - Explicit check
if (Array.isArray(array)) {
    console.log(array.length);
}
```

---

## 7. Edge Cases & Gotchas

### typeof null Bug
```javascript
// Famous JavaScript bug
console.log(typeof null);           // "object" (not "null"!)

// Correct way to check for null
let x = null;
console.log(x === null);            // true
console.log(x != null);             // false (use != for null/undefined)

// Check for both null and undefined
console.log(x == null);             // true (matches both)
console.log(x != null);             // false
```

### typeof undefined vs not defined
```javascript
// typeof doesn't throw for undefined variables
console.log(typeof undefinedVariable);  // "undefined" (safe!)

// But accessing throws error
console.log(undefinedVariable);         // ReferenceError!

// Use typeof to check if variable exists
if (typeof jQuery !== 'undefined') {
    // jQuery is loaded
}
```

### Arrays vs Objects
```javascript
// Arrays are objects
let arr = [1, 2, 3];
console.log(typeof arr);              // "object" (not "array"!)
console.log(arr instanceof Array);    // true
console.log(Array.isArray(arr));      // true ✓

// Correct check
function isArray(value) {
    return Array.isArray(value);      // Most reliable
}
```

### NaN is a number
```javascript
// Confusing: NaN is typeof "number"
console.log(typeof NaN);              // "number"
console.log(NaN === NaN);             // false (NaN is special!)

// Check for NaN
console.log(isNaN(NaN));              // true
console.log(Number.isNaN(NaN));       // true (more reliable)
console.log(Object.is(NaN, NaN));     // true (alternative)
```

### Symbol Uniqueness
```javascript
// Each symbol is unique
let sym1 = Symbol('id');
let sym2 = Symbol('id');

console.log(sym1 === sym2);           // false (different symbols)
console.log(typeof sym1);             // "symbol"

// Symbol is primitive, not instanceof anything
console.log(sym1 instanceof Symbol);  // false
```

---

## 8. Combining Operators

### Validation with Both
```javascript
// Use both typeof and instanceof for robust checks
function processData(data) {
    // Check if it's an object
    if (typeof data !== 'object' || data === null) {
        throw new Error('Data must be an object');
    }
    
    // Check specific type
    if (data instanceof Date) {
        console.log('Processing date:', data.toISOString());
    } else if (Array.isArray(data)) {
        console.log('Processing array:', data.length);
    } else if (data instanceof Map) {
        console.log('Processing map:', data.size);
    } else {
        console.log('Processing plain object');
    }
}
```

### Type Narrowing
```javascript
// Type narrowing pattern
function getValue(input) {
    // Narrow type progressively
    if (input === null || input === undefined) {
        return 'No value';
    }
    
    if (typeof input === 'string') {
        return input.toUpperCase();
    }
    
    if (typeof input === 'number') {
        return input * 2;
    }
    
    if (Array.isArray(input)) {
        return input.map(x => x * 2);
    }
    
    return 'Unknown type';
}
```

---

## 9. Best Practices

### Use Correct Check for Each Type
```javascript
// Primitives: typeof
typeof value === 'number'
typeof value === 'string'
typeof value === 'boolean'
typeof value === 'undefined'

// Arrays: Array.isArray
Array.isArray(value)

// Objects: instanceof or check constructor
value instanceof Date
value instanceof RegExp
value instanceof Map

// Null: ===
value === null

// General object: typeof + null check
typeof value === 'object' && value !== null
```

### Avoid typeof for Type Coercion
```javascript
// ✗ AVOID - typeof can hide bugs
let result = typeof input === 'number' ? input + 10 : '10';

// ✓ BETTER - Explicit type handling
let result;
if (typeof input === 'number') {
    result = input + 10;
} else {
    result = '10';
}
```

### Create Type Guard Utilities
```javascript
// Create reusable type guards
const TypeGuards = {
    isString: (x) => typeof x === 'string',
    isNumber: (x) => typeof x === 'number' && !isNaN(x),
    isArray: (x) => Array.isArray(x),
    isDate: (x) => x instanceof Date,
    isNull: (x) => x === null,
    isDefined: (x) => x !== undefined,
    isFunction: (x) => typeof x === 'function',
};

// Use consistently
if (TypeGuards.isNumber(value)) {
    // Process number
}
```

---

## Exercises

### Exercise 1: Type Checker
```javascript
// Return true type of value
function getActualType(value) {
    // Your code
}

console.log(getActualType([]));           // "array"
console.log(getActualType({}));           // "object"
console.log(getActualType(null));         // "null"
console.log(getActualType(42));           // "number"
```

**Solution:**
```javascript
function getActualType(value) {
    if (value === null) return 'null';
    if (Array.isArray(value)) return 'array';
    return typeof value;
}
```

### Exercise 2: Type Validator
```javascript
// Validate value matches expected type
function validate(value, expectedType) {
    // Your code
}

console.log(validate(42, 'number'));      // true
console.log(validate("hello", 'string')); // true
console.log(validate([], 'array'));       // true
console.log(validate(42, 'string'));      // false
```

**Solution:**
```javascript
function validate(value, expectedType) {
    if (expectedType === 'array') {
        return Array.isArray(value);
    }
    if (expectedType === 'null') {
        return value === null;
    }
    return typeof value === expectedType;
}
```

### Exercise 3: Safe Property Access
```javascript
// Safely get object property
function getProperty(obj, prop) {
    // Your code
}

let user = { name: 'John', age: 25 };
console.log(getProperty(user, 'name'));   // 'John'
console.log(getProperty(user, 'missing')); // undefined (no error)
```

**Solution:**
```javascript
function getProperty(obj, prop) {
    if (typeof obj !== 'object' || obj === null) {
        return undefined;
    }
    return obj[prop];
}
```

---

## Interview Questions

### Theoretical Questions

**Q1: What does typeof return?**
A: A string representing the type of value.

**Q2: What's the difference between typeof and instanceof?**
A: typeof returns primitive type. instanceof checks prototype chain.

**Q3: Why does typeof null return "object"?**
A: Historical bug in JavaScript (can't be changed for compatibility).

**Q4: What's the best way to check if something is an array?**
A: Array.isArray() (most reliable).

**Q5: Can you use typeof to check if variable is undefined?**
A: Yes, typeof returns "undefined" safely (no ReferenceError).

---

## Code-Based Interview Questions

**Q1: What will be output?**
```javascript
console.log(typeof []);  // ?
```
A:
```
"object"
```

**Q2: Predict:**
```javascript
console.log([] instanceof Array);  // ?
```
A:
```
true
```

**Q3: What will be logged?**
```javascript
console.log(typeof null);  // ?
```
A:
```
"object"
```

**Q4: Spot the issue:**
```javascript
if (typeof value == 'number') {  // Should use ===
    return value;
}
```
A: Use === instead of ==, though both work here.

**Q5: What is output?**
```javascript
console.log(Array.isArray([1, 2, 3]));  // ?
```
A:
```
true
```

---

## Follow-up Questions & Confusing Concepts

**Q: Can you use instanceof with primitives?**
A: No, they return false. Primitives aren't instances.

**Q: What is Symbol type used for?**
A: Creating unique identifiers, mostly for object properties.

**Q: How do you check for NaN correctly?**
A: Use Number.isNaN() or Object.is(value, NaN).

**Q: Can you check if function is async?**
A: typeof returns "function", no native way to check async.

---

## Summary

- **typeof**: Check primitive types (number, string, boolean, undefined, symbol, bigint, function)
- **typeof null**: Returns "object" (famous bug)
- **typeof arrays**: Returns "object" (not "array"!)
- **instanceof**: Check class/constructor relationships
- **Array.isArray()**: Most reliable way to check arrays
- **Null check**: Use === null (not typeof)
- **Combining checks**: typeof for primitives, instanceof for objects
- **Safe access**: Check type before accessing properties
- **Edge cases**: NaN, Symbol, null, undefined have quirks
- **Best practice**: Create type guard functions for consistency

**Next Step:** Understand type coercion and conversion in JavaScript!
