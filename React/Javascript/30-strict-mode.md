# Strict Mode

## Table of Contents
1. What is Strict Mode
2. Enabling Strict Mode
3. Strict Mode Restrictions
4. Variable Rules
5. Function Rules
6. Object Rules
7. Changes in Behavior
8. Benefits & Trade-offs
9. Best Practices

---

## 1. What is Strict Mode

### Introduction
```javascript
// Strict mode is a way to opt-in to a restricted variant of JavaScript
// Enforces stricter parsing and error handling
// Helps catch common coding issues

// Before strict mode (sloppy mode):
x = 42;  // Creates global variable (accidentally!)

// With strict mode:
'use strict';
x = 42;  // ReferenceError: x is not defined
```

### Why Strict Mode?
- Prevents "unsafe" actions
- Improves performance (easier to optimize)
- Prepares code for future JavaScript versions
- Catches common programming mistakes
- Explicitly declares intent with 'use strict'

---

## 2. Enabling Strict Mode

### Global Strict Mode
```javascript
// At the top of a file (before any other code)
'use strict';

function test() {
    x = 42;  // Error: x is not defined
}

test();
```

### Function-Level Strict Mode
```javascript
// Apply only to specific function
function strictFunc() {
    'use strict';
    
    y = 42;  // Error: y is not defined
    console.log('This function is strict');
}

function sloppyFunc() {
    // This function is NOT strict
    z = 42;  // No error (creates global variable)
}

strictFunc();   // Error
sloppyFunc();   // Works
```

### Module-Level Strict Mode
```javascript
// In ES6 modules, strict mode is automatic
// No need to declare 'use strict'

export function test() {
    x = 42;  // Error (automatically strict)
}

// Class bodies are also strict by default
class MyClass {
    method() {
        x = 42;  // Error (strict)
    }
}
```

---

## 3. Strict Mode Restrictions

### Implicit Global Variables
```javascript
// SLOPPY MODE
function test() {
    x = 42;  // Creates global variable window.x
}
test();
console.log(window.x);  // 42

// STRICT MODE
'use strict';
function test2() {
    y = 42;  // ReferenceError!
}
test2();  // Error
```

### Declaring Variables
```javascript
'use strict';

// Must declare with var, let, or const
z = 42;         // Error: z is not defined
var a = 1;      // OK
let b = 2;      // OK
const c = 3;    // OK

// No variable hoisting pitfalls
function test() {
    console.log(d);  // ReferenceError (not undefined)
    var d = 10;      // d is declared here
}
test();
```

### Deleting Variables
```javascript
'use strict';

let x = 42;
delete x;  // SyntaxError in strict mode

// But can still delete object properties
let obj = { a: 1 };
delete obj.a;  // OK
```

---

## 4. Variable Rules

### Variable Redeclaration
```javascript
// SLOPPY MODE
var x = 1;
var x = 2;  // Allowed (re-declare)

// STRICT MODE
'use strict';
var y = 1;
var y = 2;  // SyntaxError in some cases

// Let and const always prevent redeclaration
let z = 1;
let z = 2;  // SyntaxError
```

### Object Property Rules
```javascript
'use strict';

// Can't delete non-configurable properties
let obj = {};
Object.defineProperty(obj, 'x', {
    value: 42,
    configurable: false
});

delete obj.x;  // TypeError!
```

---

## 5. Function Rules

### Function Declaration vs Expression
```javascript
'use strict';

// Function declarations can't be conditional
if (true) {
    function test() {  // This might error
        return 42;
    }
}

// Use function expressions instead
let test2;
if (true) {
    test2 = function() {
        return 42;
    };
}
```

### Function Parameter Rules
```javascript
'use strict';

// Duplicate parameter names not allowed
function test(a, b, a) {  // SyntaxError
    return a + b;
}

// OK in sloppy mode (last parameter wins)
function test2(x, x, x) {
    return x;  // Returns last x
}
```

### Arguments Object
```javascript
'use strict';

function test(a, b) {
    arguments[0] = 999;  // Does NOT change a
    console.log(a);      // Still 1
}

test(1, 2);

// vs sloppy mode
function test2(a, b) {
    arguments[0] = 999;  // Changes a!
    console.log(a);      // 999
}
test2(1, 2);
```

### Modifying Arguments
```javascript
'use strict';

function test(a) {
    console.log(a);    // 1
    a = 2;
    console.log(arguments[0]);  // Still 1 (not bound)
}

test(1);

// vs sloppy mode
function test2(a) {
    console.log(a);    // 1
    a = 2;
    console.log(arguments[0]);  // 2 (bound)
}
test2(1);
```

### eval() Function
```javascript
'use strict';

// eval doesn't create variables in outer scope
eval("var x = 42");
console.log(x);  // ReferenceError (x doesn't exist)

// vs sloppy mode
eval("var y = 42");
console.log(y);  // 42 (created in global scope)
```

---

## 6. Object Rules

### this in Functions
```javascript
'use strict';

function test() {
    console.log(this);  // undefined (not global!)
}
test();

// vs sloppy mode
function test2() {
    console.log(this);  // window (global object)
}
test2();
```

### this in Methods
```javascript
'use strict';

let obj = {
    name: 'Test',
    test: function() {
        console.log(this);  // obj (unchanged)
    }
};
obj.test();

// But if called as function:
let test = obj.test;
test();  // undefined (not obj)
```

### Object Literal Duplicate Keys
```javascript
// SLOPPY MODE
let obj = {
    x: 1,
    x: 2  // Last value wins
};
console.log(obj.x);  // 2 (allowed, last wins)

// STRICT MODE
'use strict';
let obj2 = {
    y: 1,
    y: 2  // SyntaxError in strict mode
};
```

---

## 7. Changes in Behavior

### with Statement
```javascript
// with statement not allowed in strict mode
'use strict';

let obj = { x: 10, y: 20 };
with (obj) {        // SyntaxError!
    console.log(x);
}

// Use alternative
console.log(obj.x);  // OK
```

### Octal Literals
```javascript
// SLOPPY MODE
let num = 010;  // 8 (octal)

// STRICT MODE
'use strict';
let num2 = 010;  // SyntaxError
let num3 = 0o10; // OK (ES6 octal notation)
```

### Escape Sequences
```javascript
'use strict';

// Escape sequences like \x not allowed in strings
let str = '\x41';  // SyntaxError

// Use Unicode escapes instead
let str2 = '\u0041';  // OK ("A")
let str3 = '\u{41}';  // OK ("A")
```

---

## 8. Benefits & Trade-offs

### Performance Benefits
```javascript
'use strict';

// Engines can optimize better
// - No global variable creation by accident
// - this is undefined when called as function
// - Arguments not bound to parameter

function calculate(a, b, c) {
    return a + b + c;
}

// Without strict mode, engine must track:
// - Possible global variable creation
// - this binding
// - arguments binding

// With strict mode, simpler optimization possible
```

### Error Detection
```javascript
'use strict';

// Catches mistakes early
let obj = {};

// Attempting to write to non-writable property
Object.defineProperty(obj, 'x', {
    value: 42,
    writable: false
});

obj.x = 100;  // TypeError (instead of silently failing)
```

### Trade-offs
```javascript
// Some old code might break
function test() {
    result = 42;  // Error in strict mode
}

// Must refactor to:
function test2() {
    var result = 42;  // OK
}

// But this is GOOD - forces better practices
```

---

## 9. Best Practices

### Use Global Strict Mode
```javascript
// ✓ GOOD - Entire file uses strict mode
'use strict';

function test() {
    x = 42;  // Error
}

// Place at very top of file (after comments/copyright)
/*
 * MyModule
 * Version 1.0
 */
'use strict';

// All code below is strict
```

### Avoid Function-Level Strict
```javascript
// ✗ AVOID - Inconsistent strictness
function strict() {
    'use strict';
    // strict code
}

function sloppy() {
    // sloppy code
}

// ✓ PREFER - File-level strict
'use strict';

function test() {
    // All functions are strict
}
```

### Modern Code is Implicit Strict
```javascript
// In ES6 modules (implicit strict)
export function test() {
    x = 42;  // Error (automatically strict)
}

// In classes (implicit strict)
class MyClass {
    method() {
        y = 42;  // Error (strict)
    }
}

// No need to declare 'use strict'
```

---

## Exercises

### Exercise 1: Convert to Strict Mode
```javascript
// Convert this to strict mode
function greet(name) {
    message = 'Hello, ' + name;  // Global variable!
    return message;
}

// Your code
```

**Solution:**
```javascript
'use strict';

function greet(name) {
    let message = 'Hello, ' + name;  // Properly declared
    return message;
}
```

### Exercise 2: Identify Strict Mode Violations
```javascript
// Find the error
function test() {
    'use strict';
    
    obj = { a: 1 };  // Error: obj not declared
    delete x;        // Error: can't delete variable
}
```

**Solution:**
```javascript
function test() {
    'use strict';
    
    let obj = { a: 1 };  // Declare variable
    // delete not applicable here (delete is for properties)
}
```

### Exercise 3: Fix this Binding
```javascript
// Find the issue
let obj = {
    value: 42,
    getValue: function() {
        'use strict';
        return this.value;
    }
};

let func = obj.getValue;
console.log(func());  // Error?
```

**Solution:**
```javascript
// In strict mode, this is undefined when called as function
// Solution 1: Call on object
console.log(obj.getValue());  // 42

// Solution 2: Use arrow function (binds this)
let obj2 = {
    value: 42,
    getValue: () => this.value
};

// Solution 3: Bind explicitly
let func = obj.getValue.bind(obj);
console.log(func());  // 42
```

---

## Interview Questions

### Theoretical Questions

**Q1: What is strict mode?**
A: Restricted variant of JavaScript enforcing stricter parsing and error handling.

**Q2: How do you enable strict mode?**
A: Use 'use strict'; at top of file or function.

**Q3: What error occurs without variable declaration in strict mode?**
A: ReferenceError for undefined variable assignment.

**Q4: What is this in a function in strict mode?**
A: undefined (not global object).

**Q5: Are modules automatically strict?**
A: Yes, ES6 modules are strict by default.

---

## Code-Based Interview Questions

**Q1: What will be output?**
```javascript
'use strict';
x = 42;
// ?
```
A:
```
ReferenceError: x is not defined
```

**Q2: Predict:**
```javascript
'use strict';
function test() {
    console.log(this);
}
test();
// ?
```
A:
```
undefined
```

**Q3: What will be logged?**
```javascript
'use strict';
let obj = { x: 1, x: 2 };
// ?
```
A:
```
SyntaxError: Duplicate data property in object literal
```

**Q4: Spot the issue:**
```javascript
'use strict';
function test(a, a) {  // Duplicate parameters
    return a;
}
```
A: SyntaxError in strict mode (not allowed).

**Q5: What is output?**
```javascript
'use strict';
function test(a) {
    a = 999;
    console.log(arguments[0]);
}
test(1);
// ?
```
A:
```
1
(arguments not bound in strict mode)
```

---

## Follow-up Questions & Confusing Concepts

**Q: Does strict mode affect performance?**
A: Yes, usually improves it by allowing better optimization.

**Q: Can I use strict mode in browsers?**
A: Yes, all modern browsers support it.

**Q: What about older browsers?**
A: They ignore 'use strict' (safe to use).

**Q: Should entire project be strict?**
A: Yes, recommended for new code.

---

## Summary

- **'use strict'**: Enables strict mode (place at top of file)
- **Global variables**: Not allowed (must declare with var/let/const)
- **this binding**: undefined when called as function (not global)
- **eval**: Doesn't leak to outer scope
- **arguments**: Not bound to parameters
- **Duplicate properties**: Syntax error in object literals
- **Octal literals**: Not allowed (use 0o notation)
- **Benefits**: Better optimization, error detection, cleaner code
- **Modules/Classes**: Automatically strict (ES6+)
- **Best practice**: Use strict mode for all new code

**Next Step:** Master REST APIs and modern HTTP patterns!
