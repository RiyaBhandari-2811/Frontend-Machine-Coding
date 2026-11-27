# Variables & Data Types in JavaScript

## Table of Contents
1. Introduction to Variables
2. Variable Declaration (var, let, const)
3. Variable Naming Conventions
4. Primitive Data Types
5. Non-Primitive Data Types
6. typeof Operator
7. Special Values: null, undefined, BigInt

---

## 1. Introduction to Variables

### What is a Variable?
- **Variable**: A named container that stores data values
- Think of it like a labeled box where you store information
- Variables have three parts: keyword (var/let/const), name, value

### Why Use Variables?
- Store and reuse data
- Make code readable and maintainable
- Perform operations on data
- Keep track of state changes

### Basic Syntax
```javascript
// Keyword  Name   Assignment operator  Value
let       myAge     =                   25;
```

---

## 2. Variable Declaration Methods

### VAR (Before ES6)

```javascript
var name = "John";
var age = 25;
var isStudent = true;

// Can be redeclared in same scope
var name = "Jane";  // This is allowed!

// Can be reassigned
age = 26;
```

**Problems with var:**
- Function-scoped (not block-scoped) - causes bugs in loops and conditions
- Can be redeclared - causes confusion
- Hoisted in confusing way (covered later)
- Global if declared without assignment

**Don't use var in modern JavaScript!**

---

### LET (ES6+)

```javascript
let name = "John";
let age = 25;

// Can be reassigned
age = 26;  // ✅ Allowed

// Cannot be redeclared in same scope
let age = 27;  // ❌ Error: Identifier 'age' has already been declared

// Block-scoped (covered in detail later)
if (true) {
    let x = 10;
}
console.log(x);  // ❌ Error: x is not defined
```

**When to use let:**
- When you need to reassign the variable
- Default choice for mutable variables
- Preferred over var in modern code

---

### CONST (ES6+)

```javascript
const name = "John";
const age = 25;

// Cannot be reassigned
age = 26;  // ❌ Error: Assignment to constant variable

// Cannot be redeclared
const age = 27;  // ❌ Error

// But objects/arrays can be mutated
const person = { name: "John" };
person.name = "Jane";  // ✅ Allowed - mutating property
person = {};  // ❌ Error - reassignment not allowed
```

**When to use const:**
- Default choice in modern JavaScript
- When value shouldn't change
- Prevents accidental reassignment
- Objects inside const can still be modified

**Modern Practice: Use const by default, let if reassignment needed, never use var**

---

## 3. Variable Naming Conventions

### Valid Variable Names
```javascript
let firstName = "John";       // camelCase ✅ PREFERRED
let first_name = "John";      // snake_case (sometimes)
let FirstName = "John";       // PascalCase (for classes/constructors)
let $name = "John";           // Can start with $
let _name = "John";           // Can start with underscore
let name123 = "John";         // Can contain numbers

// Invalid names ❌
let 123name = "John";         // Can't start with number
let first-name = "John";      // Can't contain hyphen
let first name = "John";      // Can't contain space
let let = 5;                  // Can't use reserved keywords
```

### Naming Best Practices
1. Use **camelCase** for variables and functions
2. Use **PascalCase** for classes
3. Use **UPPER_SNAKE_CASE** for constants
4. Use **descriptive names** that explain the purpose
5. Avoid single letters (except loop counters like i)

```javascript
// Good ✅
const userAge = 25;
const isStudent = true;
const MAX_RETRIES = 3;

// Bad ❌
const ua = 25;
const s = true;
const x = 3;
```

---

## 4. Primitive Data Types

Primitives are immutable (can't be changed, only reassigned).

### String
```javascript
let name = "John";
let greeting = 'Hello';
let message = `Hello ${name}`;  // Template literal (ES6)

console.log(typeof name);  // "string"
```

### Number
```javascript
let age = 25;
let price = 19.99;
let negative = -5;
let result = Infinity;
let invalid = NaN;  // Not a Number

console.log(typeof age);  // "number"
console.log(1 / 0);       // Infinity
console.log("hello" / 2); // NaN
```

### Boolean
```javascript
let isActive = true;
let isDeleted = false;

console.log(typeof isActive);  // "boolean"
```

### Undefined
```javascript
let x;  // Declared but not assigned
console.log(x);           // undefined
console.log(typeof x);    // "undefined"

function test() {
    // No return statement
}
console.log(test());  // undefined
```

### Null
```javascript
let x = null;  // Intentionally set to no value
console.log(x);           // null
console.log(typeof null); // "object" (quirk of JavaScript!)
```

### BigInt (ES2020)
```javascript
let bigNumber = 123456789012345678901234567890n;
let anotherBig = BigInt("123456789012345678901234567890");

console.log(typeof bigNumber);  // "bigint"
console.log(5n + 10n);          // 15n
// Can't mix BigInt and Number
console.log(5n + 10);           // ❌ Error
```

### Symbol (ES6)
```javascript
let sym = Symbol("unique");
console.log(typeof sym);  // "symbol"
```

---

## 5. Non-Primitive Data Types

### Object
```javascript
const person = {
    name: "John",
    age: 25,
    city: "New York"
};

console.log(typeof person);  // "object"
```

### Array
```javascript
const numbers = [1, 2, 3, 4, 5];
console.log(typeof numbers);  // "object" (arrays are special objects)
```

### Function
```javascript
function greet() {
    return "Hello";
}

console.log(typeof greet);  // "function"
```

---

## 6. The typeof Operator

```javascript
console.log(typeof "hello");           // "string"
console.log(typeof 42);                // "number"
console.log(typeof true);              // "boolean"
console.log(typeof undefined);         // "undefined"
console.log(typeof { name: "John" });  // "object"
console.log(typeof [1, 2, 3]);         // "object"
console.log(typeof null);              // "object" ⚠️ Famous quirk!
console.log(typeof function() {});     // "function"
console.log(typeof Symbol("id"));      // "symbol"
console.log(typeof 123n);              // "bigint"
```

**Important Quirk:** `typeof null` returns "object" (bug in JavaScript, kept for backward compatibility)

---

## 7. Special Values

### null vs undefined

| Feature | null | undefined |
|---------|------|-----------|
| Meaning | Intentional absence of value | Uninitialized variable |
| Set by | Developer explicitly | JavaScript automatically |
| typeof | "object" | "undefined" |
| When used | Default return value not set | Variable declared but not assigned |

```javascript
let x = null;      // Intentional - "nothing"
let y;             // Unintentional - undefined
let z = undefined; // Can assign, but unusual
```

### NaN (Not a Number)
```javascript
console.log(0 / 0);              // NaN
console.log(parseInt("hello"));  // NaN
console.log("string" * 2);       // NaN

// Check for NaN (typeof doesn't work!)
console.log(NaN === NaN);        // false (quirk!)
console.log(isNaN("hello"));     // true
console.log(Number.isNaN(NaN));  // true ✅ Better method
```

### Infinity
```javascript
console.log(1 / 0);              // Infinity
console.log(-1 / 0);             // -Infinity
console.log(Infinity * 2);       // Infinity
console.log(Infinity - Infinity); // NaN
console.log(typeof Infinity);    // "number"
```

---

## Exercises

### Exercise 1: Variable Declaration
```javascript
// Use const/let to declare:
// 1. Your name
// 2. Your age
// 3. Whether you're a programmer (true/false)
// 4. Your favorite hobby

// Try to reassign each one
// Which ones allow reassignment? Which don't?
```

**Solution:**
```javascript
const myName = "John";
let myAge = 25;
const isProgrammer = true;
let favoriteHobby = "Gaming";

// myName = "Jane";  // ❌ Error - const can't reassign
myAge = 26;          // ✅ Allowed - let can reassign
// isProgrammer = false;  // ❌ Error
favoriteHobby = "Reading"; // ✅ Allowed
```

### Exercise 2: Data Type Detective
```javascript
// What type is each of these?
let a = "25";
let b = 25;
let c = true;
let d = { age: 25 };
let e = [1, 2, 3];
let f = null;
let g;
let h = 1n;

// Use typeof to check each one
```

**Solution:**
```javascript
console.log(typeof a);  // "string"
console.log(typeof b);  // "number"
console.log(typeof c);  // "boolean"
console.log(typeof d);  // "object"
console.log(typeof e);  // "object"
console.log(typeof f);  // "object" (quirk!)
console.log(typeof g);  // "undefined"
console.log(typeof h);  // "bigint"
```

### Exercise 3: Valid Variable Names
Which of these variable names are valid? Fix the invalid ones.
```javascript
let firstName = "John";      // Valid?
let 123abc = "value";        // Valid?
let first-name = "John";     // Valid?
let _private = "secret";     // Valid?
let $jquery = "value";       // Valid?
let hello world = "hi";      // Valid?
```

**Solution:**
```javascript
let firstName = "John";      // ✅ Valid
// let 123abc = "value";     // ❌ Can't start with number
let firstName = "John";      // ✅ Fixed (or first_name)
let _private = "secret";     // ✅ Valid
let $jquery = "value";       // ✅ Valid
let helloWorld = "hi";       // ✅ Fixed
```

---

## Interview Questions

### Theoretical Questions

**Q1: What's the difference between let and const?**
A: Both are block-scoped (ES6). `let` can be reassigned, `const` cannot. `const` doesn't mean the value is immutable - objects/arrays inside const can be modified. Best practice: use `const` by default, `let` only if you need to reassign.

**Q2: Why should we avoid var?**
A: `var` is function-scoped (not block-scoped), causing bugs in loops. Can be redeclared in same scope. Hoisted in confusing way. `let` and `const` are safer, more predictable.

**Q3: What is the difference between null and undefined?**
A: `undefined` means variable is declared but not initialized (JavaScript sets this). `null` is intentionally set by developer to represent "no value". `typeof null` returns "object" (famous bug).

**Q4: Why does `typeof null` return "object"?**
A: It's a known quirk/bug in JavaScript, kept for backward compatibility. In early JavaScript, type was stored as a tag. `null` has tag 000 (object), but should be its own type. Can't be fixed without breaking old code.

**Q5: What is BigInt and when would you use it?**
A: BigInt is for numbers larger than `Number.MAX_SAFE_INTEGER` (2^53 - 1). Regular numbers lose precision above this. Use BigInt for cryptography, large calculations, handling IDs from APIs. Denote with `n` suffix or `BigInt()` function.

---

## Code-Based Interview Questions

**Q1: What will be the output?**
```javascript
let x = 5;
{
    let x = 10;
    console.log(x);  // ?
}
console.log(x);      // ?
```
A: 
```
10
5
```
Explanation: `let` is block-scoped. The inner block has its own `x` variable.

**Q2: What will be the output?**
```javascript
var name = "John";
var name = "Jane";
console.log(name);  // ?

let age = 25;
let age = 26;  // Error?
```
A: 
```
Jane
Error: Identifier 'age' has already been declared
```
Explanation: `var` can be redeclared, `let` cannot.

**Q3: Spot the error:**
```javascript
const person = { name: "John" };
person = { name: "Jane" };  // Error?
person.name = "Jane";       // Error?
```
A: 
- First reassignment: ❌ Error - can't reassign const variable
- Second (property mutation): ✅ Allowed - mutating object contents is okay

**Q4: What will be the output?**
```javascript
console.log(typeof undefined);    // ?
console.log(typeof null);         // ?
console.log(typeof NaN);          // ?
console.log(NaN === NaN);         // ?
```
A:
```
"undefined"
"object"
"number"
false
```

**Q5: What will be the output?**
```javascript
let x;
console.log(x);           // ?
console.log(typeof x);    // ?
console.log(x == null);   // ?
console.log(x === null);  // ?
```
A:
```
undefined
"undefined"
true
false
```

---

## Follow-up Questions & Confusing Concepts

**Q: Can I use const for objects and then modify the object?**
A: Yes! `const` prevents reassignment, not mutation. The object reference can't change, but its contents can.
```javascript
const obj = { name: "John" };
obj.name = "Jane";  // ✅ Allowed
obj.age = 25;       // ✅ Allowed
obj = {};           // ❌ Error - reassignment
```

**Q: What happens if I declare a variable without let/const/var?**
A: It becomes a global variable (creates property on global object). Avoid this! Always use let/const.
```javascript
x = 5;  // No let/const/var - bad!
console.log(window.x);  // 5 (in browser)
```

**Q: What's the difference between == and ===?**
A: `==` does type coercion, `===` doesn't. Always use `===`.
```javascript
console.log(5 == "5");   // true (coerces to same type)
console.log(5 === "5");  // false (different types)
console.log(null == undefined);  // true
console.log(null === undefined); // false
```

**Q: Why is BigInt a separate type instead of just using large Numbers?**
A: Numbers use floating-point (can't represent large integers precisely). BigInt sacrifices decimal precision for exact integer math. Can't mix them without explicit conversion.

---

## Summary

- **Variables** store data using `let`, `const`, or `var` (avoid `var`)
- **Primitive types**: string, number, boolean, undefined, null, BigInt, Symbol
- **Non-primitive types**: object, array, function
- **typeof** operator checks variable type (quirk: `typeof null` = "object")
- **const** by default, **let** if reassignment needed
- **null** is intentional, **undefined** is uninitialized
- **NaN** is number type but represents invalid number

**Next Step:** Learn string operations and manipulation!
