# Scope, Hoisting & Closures in JavaScript

## Table of Contents
1. Lexical Scope
2. Function Scope
3. Block Scope
4. Scope Chain
5. Hoisting
6. Temporal Dead Zone
7. Closures
8. Practical Closure Patterns

---

## 1. Lexical Scope

### What is Lexical Scope?
- **Lexical Scope**: Inner functions can access variables from outer scope
- Scope determined by position in code, not execution order
- Also called "static scope"

### Lexical Scope Example
```javascript
let global = "global";

function outer() {
    let outerVar = "outer";
    
    function inner() {
        let innerVar = "inner";
        
        // Can access all outer scopes
        console.log(innerVar);    // "inner" - own scope
        console.log(outerVar);    // "outer" - parent scope
        console.log(global);      // "global" - global scope
    }
    
    inner();
}

outer();
```

### Scope Hierarchy
```javascript
// Global scope
let a = 1;

{
    // Block scope (inside {})
    let b = 2;
    
    function test() {
        // Function scope
        let c = 3;
        
        console.log(a, b, c);  // Can access all
    }
}

console.log(a);     // 1 (global)
console.log(b);     // Error - not in global scope
```

---

## 2. Function Scope

### var is Function-Scoped
```javascript
function test() {
    if (true) {
        var x = 10;  // var is scoped to function, not block
    }
    console.log(x);  // 10 (accessible outside block)
}

test();

console.log(x);  // undefined (outside function)
```

### let/const are Block-Scoped
```javascript
function test() {
    if (true) {
        let x = 10;    // let is scoped to block
        const y = 20;  // const is scoped to block
    }
    console.log(x);  // Error: x is not defined
    console.log(y);  // Error: y is not defined
}

test();
```

### Function Scope Impact
```javascript
// Problem with var
for (var i = 0; i < 3; i++) {
    // i is function-scoped, not block-scoped
}
console.log(i);  // 3 (exists outside loop!)

// Solution with let
for (let j = 0; j < 3; j++) {
    // j is block-scoped
}
console.log(j);  // Error: j is not defined
```

---

## 3. Block Scope

### Block Scope with let/const
```javascript
// All blocks create scope with let/const
{
    let x = 10;
}
console.log(x);  // Error

// if blocks
if (true) {
    let x = 10;
}
console.log(x);  // Error

// for loops
for (let i = 0; i < 5; i++) {
    // i is scoped to loop
}
console.log(i);  // Error

// while loops
while (true) {
    let x = 10;
    break;
}
console.log(x);  // Error
```

### var in Loops (Common Problem)
```javascript
// WRONG - var creates one i for all iterations
for (var i = 0; i < 3; i++) {
    setTimeout(() => {
        console.log(i);  // All print 3
    }, 100);
}
// Output: 3, 3, 3

// CORRECT - let creates i for each iteration
for (let i = 0; i < 3; i++) {
    setTimeout(() => {
        console.log(i);  // 0, 1, 2
    }, 100);
}
// Output: 0, 1, 2
```

---

## 4. Scope Chain

### Variable Lookup (Scope Chain)
```javascript
let global = "global";

function outer() {
    let outerVar = "outer";
    
    function middle() {
        let middleVar = "middle";
        
        function inner() {
            let innerVar = "inner";
            
            // Variable lookup order:
            // 1. Own scope: innerVar
            // 2. Outer scope (middle): middleVar
            // 3. Outer scope (outer): outerVar
            // 4. Global scope: global
            
            console.log(innerVar, middleVar, outerVar, global);
        }
        
        inner();
    }
    
    middle();
}

outer();
// "inner middle outer global"
```

### Shadowing
```javascript
let x = "global";

function test() {
    let x = "local";  // Shadows global x
    console.log(x);   // "local"
}

test();
console.log(x);  // "global"

// Can shadow across multiple levels
let a = 1;
function f1() {
    let a = 2;
    function f2() {
        let a = 3;
        console.log(a);  // 3 (closest scope)
    }
    f2();
}
f1();
```

---

## 5. Hoisting

### Variable Hoisting with var
```javascript
// BEFORE: Code as written
console.log(x);  // undefined
var x = 5;
console.log(x);  // 5

// AFTER: What JavaScript does (hoisting)
var x;           // Declaration hoisted
console.log(x);  // undefined
x = 5;           // Assignment stays in place
console.log(x);  // 5
```

### let/const Hoisting
```javascript
// let and const are also hoisted, but not initialized
console.log(y);  // Error: Cannot access 'y' before initialization
let y = 10;

// This is called Temporal Dead Zone (TDZ)
function test() {
    if (true) {
        console.log(z);  // Error - in TDZ
        let z = 5;       // z declared here
    }
}
```

### Function Hoisting
```javascript
// Function declarations are fully hoisted (declaration + assignment)
console.log(greet("John"));  // "Hello, John!" - works!

function greet(name) {
    return `Hello, ${name}!`;
}

// Function expressions are NOT fully hoisted
console.log(add(5, 3));  // Error: add is not a function

let add = function(a, b) {
    return a + b;
};
```

### Hoisting Order
```javascript
// 1. Function declarations hoisted first
// 2. Variable declarations hoisted second
// 3. Variable assignments stay in place

console.log(typeof greet);  // "function" (hoisted)
console.log(typeof name);   // "undefined" (declared but not assigned)

function greet() {}
let name = "John";
```

---

## 6. Temporal Dead Zone (TDZ)

### What is TDZ?
- **TDZ**: Period from start of block until variable declaration where variable can't be accessed
- Only affects let and const
- Error: "Cannot access [variable] before initialization"

```javascript
// TDZ starts here
console.log(x);  // Error: Cannot access 'x' before initialization
// TDZ ends here
let x = 5;
console.log(x);  // 5

// TDZ in function
function test() {
    // TDZ for y starts
    if (true) {
        console.log(y);  // Error - y in TDZ
        let y = 10;      // TDZ ends, y declared
    }
}
```

### typeof Operator and TDZ
```javascript
// Without let/const
console.log(typeof undeclared);  // "undefined" - safe

// With let/const (in TDZ)
console.log(typeof x);  // Error: Cannot access 'x' before initialization
let x = 5;
```

---

## 7. Closures

### What is a Closure?
- **Closure**: Function that has access to variables from outer scope even after outer function finishes
- Every function creates closure of outer scope
- Powerful for data privacy and state management

### Basic Closure
```javascript
function outer() {
    let count = 0;  // Outer variable
    
    function inner() {
        count++;
        console.log(count);
    }
    
    return inner;
}

let counter = outer();
counter();  // 1
counter();  // 2
counter();  // 3
// count variable is "closed over" by inner function
```

### Closure Captured Values
```javascript
function makeCounter(start = 0) {
    let count = start;  // Captured by closure
    
    return {
        increment() {
            count++;
            return count;
        },
        decrement() {
            count--;
            return count;
        },
        getValue() {
            return count;
        }
    };
}

let counter = makeCounter(5);
console.log(counter.increment());  // 6
console.log(counter.increment());  // 7
console.log(counter.decrement());  // 6
console.log(counter.getValue());   // 6
```

### Private Variables via Closure
```javascript
function createBankAccount(initialBalance) {
    // Private variable - can't access directly
    let balance = initialBalance;
    
    // Public methods - can access private balance
    return {
        deposit(amount) {
            balance += amount;
            return balance;
        },
        withdraw(amount) {
            if (amount > balance) {
                return "Insufficient funds";
            }
            balance -= amount;
            return balance;
        },
        getBalance() {
            return balance;
        }
    };
}

let account = createBankAccount(100);
console.log(account.deposit(50));      // 150
console.log(account.withdraw(30));     // 120
console.log(account.balance);          // undefined (private!)
console.log(account.getBalance());     // 120
```

---

## 8. Practical Closure Patterns

### Closure with Loops
```javascript
// Problem: var in loop
function setupButtons1() {
    var buttons = document.querySelectorAll("button");
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", function() {
            console.log(i);  // All print last value!
        });
    }
}

// Solution 1: Use let
function setupButtons2() {
    var buttons = document.querySelectorAll("button");
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", function() {
            console.log(i);  // Correct values
        });
    }
}

// Solution 2: IIFE closure
function setupButtons3() {
    var buttons = document.querySelectorAll("button");
    for (var i = 0; i < buttons.length; i++) {
        (function(j) {
            buttons[j].addEventListener("click", function() {
                console.log(j);  // Correct values
            });
        })(i);
    }
}
```

### Function Factory
```javascript
function createMultiplier(multiplier) {
    // multiplier is captured in closure
    return function(num) {
        return num * multiplier;
    };
}

let double = createMultiplier(2);
let triple = createMultiplier(3);
let quadruple = createMultiplier(4);

console.log(double(5));      // 10
console.log(triple(5));      // 15
console.log(quadruple(5));   // 20
```

### Memoization with Closure
```javascript
function memoize(func) {
    // Cache stored in closure
    let cache = {};
    
    return function(arg) {
        if (arg in cache) {
            console.log("From cache:", arg);
            return cache[arg];
        }
        console.log("Computing:", arg);
        let result = func(arg);
        cache[arg] = result;
        return result;
    };
}

let fibonacci = memoize(function(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
});

console.log(fibonacci(5));  // Computing many values
console.log(fibonacci(5));  // From cache: 5
```

---

## Exercises

### Exercise 1: Private Counter
```javascript
// Create counter with private count
// Should have increment, decrement, reset methods

function createCounter() {
    // Your code
}

let counter = createCounter();
console.log(counter.increment());  // 1
console.log(counter.increment());  // 2
console.log(counter.decrement());  // 1
counter.reset();
console.log(counter.getValue());   // 0
```

**Solution:**
```javascript
function createCounter() {
    let count = 0;
    
    return {
        increment() {
            count++;
            return count;
        },
        decrement() {
            count--;
            return count;
        },
        reset() {
            count = 0;
        },
        getValue() {
            return count;
        }
    };
}
```

### Exercise 2: Scope Hoisting Quiz
```javascript
// What will be output?
console.log(x);
var x = 5;
console.log(x);

function test() {
    console.log(y);
    var y = 10;
    console.log(y);
}
test();
```

**Solution:**
```
undefined  (x hoisted but not assigned)
5
undefined  (y hoisted in function scope)
10
```

### Exercise 3: Closure with Loop
```javascript
// Fix the loop to log correct indices

function setupArray() {
    let results = [];
    
    for (var i = 0; i < 3; i++) {
        results.push(function() {
            return i;
        });
    }
    
    return results;
}

let funcs = setupArray();
console.log(funcs[0]());  // Should be 0, but prints 3
console.log(funcs[1]());  // Should be 1, but prints 3
console.log(funcs[2]());  // Should be 2, prints 3
```

**Solution:**
```javascript
function setupArray() {
    let results = [];
    
    for (let i = 0; i < 3; i++) {  // Change var to let
        results.push(function() {
            return i;
        });
    }
    
    return results;
}

// Or use IIFE
function setupArray2() {
    let results = [];
    
    for (var i = 0; i < 3; i++) {
        (function(j) {
            results.push(function() {
                return j;
            });
        })(i);
    }
    
    return results;
}
```

---

## Interview Questions

### Theoretical Questions

**Q1: What is lexical scope?**
A: Scope determined by function's position in code, not execution order. Inner functions access outer variables regardless of when/where function is called.

**Q2: What's the difference between function scope and block scope?**
A: Function scope (var) accessible anywhere in function. Block scope (let/const) only accessible within block `{}`. Block scope safer, preferred.

**Q3: What is hoisting?**
A: Variables/functions moved to top of scope during compilation. Functions fully hoisted, var partially, let/const not initialized.

**Q4: What's the Temporal Dead Zone?**
A: Period from start of block until let/const declaration where variable can't be accessed. Throws error if accessed.

**Q5: Why are closures useful?**
A: Enable data privacy, state management, function factories, callbacks. Fundamental to functional programming patterns.

---

## Code-Based Interview Questions

**Q1: What will be output?**
```javascript
console.log(x);
var x = 5;
function test() {
    console.log(x);
    var x = 10;
}
test();
```
A:
```
undefined
undefined  (not 5!)
```
Explanation: x is hoisted in test() function scope, shadowing outer x

**Q2: Predict output:**
```javascript
for (var i = 0; i < 3; i++) {
    setTimeout(() => console.log(i), 0);
}
// ?
```
A:
```
3
3
3
```
Explanation: var is function-scoped, single i for all iterations

**Q3: What will be logged?**
```javascript
let x = 1;
function test() {
    console.log(x);  // ?
    let x = 2;
}
test();
```
A:
```
Error: Cannot access 'x' before initialization
```
Explanation: Temporal Dead Zone with let

**Q4: Spot the closure:**
```javascript
function counter() {
    let count = 0;
    return () => ++count;
}

let c1 = counter();
let c2 = counter();

console.log(c1());  // ?
console.log(c1());  // ?
console.log(c2());  // ?
```
A:
```
1
2
1
```
Explanation: Each closure has own count variable

**Q5: What is output?**
```javascript
function test() {
    let x = 1;
    if (true) {
        let x = 2;
        console.log(x);
    }
    console.log(x);
}
test();  // ?
```
A:
```
2
1
```

---

## Follow-up Questions & Confusing Concepts

**Q: Why use let/const instead of var?**
A: let/const have block scope (safer), not hoisted in problematic way, prevent redeclaration. var is legacy, avoid in modern code.

**Q: Can I access variables before they're declared?**
A: With var, yes (undefined). With let/const, no (Temporal Dead Zone error). Best practice: declare at top of scope.

**Q: Does closure cause memory leaks?**
A: Closures hold references to outer variables. If not careful, can prevent garbage collection. Usually fine, just be aware.

**Q: How do I debug hoisting issues?**
A: Don't rely on hoisting. Always declare variables at top of scope. Use `let`/`const` for predictable behavior.

---

## Summary

- **Lexical Scope**: Determined by code position, not execution
- **Function Scope**: var accessible anywhere in function
- **Block Scope**: let/const accessible only in block
- **Scope Chain**: Variable lookup goes up scope levels
- **Hoisting**: Declarations moved to top (functions fully, var partially, let/const not)
- **TDZ**: Can't access let/const before declaration
- **Closure**: Function captures variables from outer scope
- **Data Privacy**: Use closures to create private variables
- **Patterns**: Function factories, memoization, module pattern

**Next Step:** Learn about this keyword and object-oriented patterns!
