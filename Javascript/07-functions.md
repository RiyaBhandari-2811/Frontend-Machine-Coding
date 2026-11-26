# Functions in JavaScript

## Table of Contents
1. Function Basics & Declaration
2. Function Parameters & Arguments
3. Return Values
4. Function Scope
5. Arrow Functions (ES6)
6. Higher-Order Functions
7. Callback Functions
8. Default Parameters & Rest Parameters
9. Anonymous Functions

---

## 1. Function Basics & Declaration

### What is a Function?
- **Function**: Reusable block of code that performs specific task
- Accepts inputs (parameters), returns output
- Can be called multiple times
- Improves code organization and reusability

### Function Declaration
```javascript
// Function declaration
function greet(name) {
    return `Hello, ${name}!`;
}

console.log(greet("John"));  // "Hello, John!"

// Function with no parameters
function sayHi() {
    console.log("Hi!");
}
sayHi();  // "Hi!"

// Function with no return
function logMessage(msg) {
    console.log(msg);  // No return statement
}
logMessage("Hello");  // undefined
```

### Function Expression
```javascript
// Function stored in variable
let greet = function(name) {
    return `Hello, ${name}!`;
};

console.log(greet("Jane"));  // "Hello, Jane!"

// Anonymous function (no name)
let add = function(a, b) {
    return a + b;
};

console.log(add(5, 3));  // 8

// Named function expression (name only used inside)
let multiply = function multiply(a, b) {
    return a * b;
};

console.log(multiply(4, 5));  // 20
```

### Declaration vs Expression
```javascript
// Declaration - hoisted (can call before defining)
console.log(sayHello());  // Works! "Hello"
function sayHello() {
    return "Hello";
}

// Expression - not hoisted (must define before calling)
console.log(greet("John"));  // Error! greet is not defined
let greet = function(name) {
    return `Hello, ${name}!`;
};
```

---

## 2. Function Parameters & Arguments

### Parameters vs Arguments
```javascript
// Parameters: defined in function declaration
function add(a, b) {
    return a + b;
}

// Arguments: values passed when calling function
let result = add(5, 3);  // 5 and 3 are arguments

console.log(result);  // 8
```

### Number of Parameters
```javascript
// Exact parameters
function twoParams(a, b) {
    return a + b;
}
console.log(twoParams(1, 2));      // 3
console.log(twoParams(1));         // NaN (b is undefined)
console.log(twoParams(1, 2, 3));   // 3 (extra ignored)

// Different number of arguments allowed
function flexible(a, b, c) {
    console.log(a, b, c);
}
flexible(1);           // 1, undefined, undefined
flexible(1, 2);        // 1, 2, undefined
flexible(1, 2, 3, 4);  // 1, 2, 3 (4 ignored)
```

### arguments Object
```javascript
function sum() {
    let total = 0;
    for (let i = 0; i < arguments.length; i++) {
        total += arguments[i];
    }
    return total;
}

console.log(sum(1, 2, 3, 4, 5));  // 15

// Note: arguments is array-like but not real array
console.log(Array.isArray(arguments));  // false
```

---

## 3. Return Values

### Basic Return
```javascript
function add(a, b) {
    return a + b;
}

let result = add(5, 3);
console.log(result);  // 8

// No return statement returns undefined
function test() {
    // No return
}
console.log(test());  // undefined

// Early return
function checkAge(age) {
    if (age < 0) {
        return "Invalid age";
    }
    if (age < 18) {
        return "Minor";
    }
    return "Adult";
}

console.log(checkAge(-5));   // "Invalid age"
console.log(checkAge(15));   // "Minor"
console.log(checkAge(25));   // "Adult"
```

### Multiple Return Values
```javascript
// Return array (destructure)
function getCoordinates() {
    return [10, 20];
}

let [x, y] = getCoordinates();
console.log(x, y);  // 10, 20

// Return object (destructure)
function getUserInfo() {
    return {
        name: "John",
        age: 25
    };
}

let { name, age } = getUserInfo();
console.log(name, age);  // "John", 25
```

---

## 4. Function Scope

### Global Scope
```javascript
let globalVar = "I'm global";

function test() {
    console.log(globalVar);  // Can access global
}

test();  // "I'm global"
console.log(globalVar);  // "I'm global"
```

### Local Scope
```javascript
function greet() {
    let localVar = "Local";
    console.log(localVar);  // "Local"
}

greet();  // "Local"
console.log(localVar);  // Error: localVar is not defined
```

### Nested Scope (Inner accesses outer)
```javascript
let outer = "outer";

function outerFunc() {
    let outerLocal = "outer local";
    
    function innerFunc() {
        let innerLocal = "inner local";
        
        console.log(innerLocal);    // "inner local" - own
        console.log(outerLocal);    // "outer local" - parent scope
        console.log(outer);         // "outer" - global scope
    }
    
    innerFunc();
    console.log(innerLocal);  // Error: not in outerFunc scope
}

outerFunc();
```

### Block Scope (let/const)
```javascript
function test() {
    if (true) {
        let x = 10;
        const y = 20;
        console.log(x, y);  // 10, 20
    }
    console.log(x);  // Error: x is not defined
    console.log(y);  // Error: y is not defined
}

// var doesn't have block scope
function test2() {
    if (true) {
        var v = 10;
    }
    console.log(v);  // 10 (var is function-scoped)
}
```

---

## 5. Arrow Functions (ES6)

### Arrow Function Syntax
```javascript
// Regular function
function add(a, b) {
    return a + b;
}

// Arrow function
let add2 = (a, b) => {
    return a + b;
};

// Concise arrow function (implicit return)
let add3 = (a, b) => a + b;

console.log(add(5, 3));   // 8
console.log(add2(5, 3));  // 8
console.log(add3(5, 3));  // 8
```

### Arrow Function Variations
```javascript
// No parameters
let greet = () => "Hello";
console.log(greet());  // "Hello"

// Single parameter (parentheses optional)
let square = x => x * x;
let square2 = (x) => x * x;
console.log(square(5));   // 25

// Multiple parameters
let multiply = (a, b) => a * b;
console.log(multiply(3, 4));  // 12

// Multiple statements (need return)
let calculate = (a, b) => {
    let sum = a + b;
    return sum * 2;
};
console.log(calculate(5, 3));  // 16
```

### Arrow Functions vs Regular Functions

| Feature | Arrow | Regular |
|---------|-------|---------|
| Syntax | Concise | Longer |
| this binding | Lexical | Dynamic |
| Hoisting | Not hoisted | Hoisted |
| constructor | Can't use as constructor | Can use |

```javascript
let obj = {
    name: "John",
    // Regular function - 'this' works
    getName1: function() {
        return this.name;
    },
    // Arrow function - 'this' is global
    getName2: () => {
        return this.name;  // undefined
    }
};

console.log(obj.getName1());  // "John"
console.log(obj.getName2());  // undefined
```

---

## 6. Higher-Order Functions

### Functions that Return Functions
```javascript
function makeMultiplier(multiplier) {
    return function(num) {
        return num * multiplier;
    };
}

let double = makeMultiplier(2);
let triple = makeMultiplier(3);

console.log(double(5));  // 10
console.log(triple(5));  // 15
```

### Functions that Accept Functions
```javascript
// Function that accepts another function
function execute(func, value) {
    return func(value);
}

let square = x => x * x;
let double = x => x * 2;

console.log(execute(square, 5));  // 25
console.log(execute(double, 5));  // 10
```

---

## 7. Callback Functions

### Basic Callbacks
```javascript
// Callback: function passed to another function
function processArray(arr, callback) {
    for (let i = 0; i < arr.length; i++) {
        callback(arr[i], i);
    }
}

processArray([1, 2, 3], (value, index) => {
    console.log(`Index ${index}: ${value}`);
});
// Index 0: 1
// Index 1: 2
// Index 2: 3
```

### Real-world: Array Methods
```javascript
let numbers = [1, 2, 3, 4, 5];

// map callback
let doubled = numbers.map(num => num * 2);
console.log(doubled);  // [2, 4, 6, 8, 10]

// filter callback
let evens = numbers.filter(num => num % 2 === 0);
console.log(evens);  // [2, 4]

// forEach callback
numbers.forEach((num, index) => {
    console.log(`${index}: ${num}`);
});
```

---

## 8. Default Parameters & Rest Parameters

### Default Parameters
```javascript
// ES5 way
function greet(name) {
    name = name || "Guest";
    return `Hello, ${name}!`;
}

console.log(greet("John"));   // "Hello, John!"
console.log(greet());         // "Hello, Guest!"

// ES6 way (better)
function greet2(name = "Guest") {
    return `Hello, ${name}!`;
}

console.log(greet2("Jane"));  // "Hello, Jane!"
console.log(greet2());        // "Hello, Guest!"

// Default can be expression
function getDate(date = new Date()) {
    return date;
}
```

### Rest Parameters
```javascript
// Accept any number of parameters
function sum(...numbers) {
    return numbers.reduce((a, b) => a + b, 0);
}

console.log(sum(1, 2, 3));           // 6
console.log(sum(1, 2, 3, 4, 5));     // 15

// Mix regular and rest parameters
function introduce(name, ...hobbies) {
    console.log(`${name} likes: ${hobbies.join(", ")}`);
}

introduce("John", "reading", "gaming", "coding");
// "John likes: reading, gaming, coding"
```

---

## 9. Anonymous Functions

### Immediately Invoked Function Expression (IIFE)
```javascript
// Anonymous function executed immediately
(function() {
    console.log("I run immediately!");
})();
// "I run immediately!"

// With parameters
(function(name) {
    console.log(`Hello, ${name}!`);
})("John");
// "Hello, John!"

// Arrow IIFE
(() => {
    console.log("Arrow IIFE!");
})();
// "Arrow IIFE!"
```

### Module Pattern
```javascript
let counter = (function() {
    let count = 0;  // Private variable
    
    return {
        increment() {
            count++;
            return count;
        },
        decrement() {
            count--;
            return count;
        },
        getCount() {
            return count;
        }
    };
})();

console.log(counter.increment());  // 1
console.log(counter.increment());  // 2
console.log(counter.getCount());   // 2
```

---

## Exercises

### Exercise 1: Temperature Converter
```javascript
// Create function to convert Celsius to Fahrenheit
// Formula: (C × 9/5) + 32

function celsiusToFahrenheit(celsius) {
    // Your code
}

console.log(celsiusToFahrenheit(0));    // 32
console.log(celsiusToFahrenheit(100));  // 212
console.log(celsiusToFahrenheit(25));   // 77
```

**Solution:**
```javascript
function celsiusToFahrenheit(celsius) {
    return (celsius * 9/5) + 32;
}

// Or arrow function
const c2f = c => (c * 9/5) + 32;
```

### Exercise 2: Higher-Order Function
```javascript
// Create function that returns a multiplier function
// multiplierFactory(2)(5) should return 10

function multiplierFactory(factor) {
    // Your code
}

console.log(multiplierFactory(2)(5));   // 10
console.log(multiplierFactory(3)(4));   // 12
```

**Solution:**
```javascript
function multiplierFactory(factor) {
    return num => num * factor;
}
```

### Exercise 3: Array Processor
```javascript
// Create function that applies transformations to array

function processArray(arr, transform) {
    // Your code
}

let numbers = [1, 2, 3, 4];
console.log(processArray(numbers, x => x * 2));
// [2, 4, 6, 8]
console.log(processArray(numbers, x => x > 2));
// [false, false, true, true]
```

**Solution:**
```javascript
function processArray(arr, transform) {
    return arr.map(transform);
}

// Or without map
function processArray2(arr, transform) {
    let result = [];
    for (let item of arr) {
        result.push(transform(item));
    }
    return result;
}
```

---

## Interview Questions

### Theoretical Questions

**Q1: What's the difference between function declaration and expression?**
A: Declarations are hoisted (can call before defining), expressions aren't. Declarations use `function` keyword, expressions assign to variable.

**Q2: Why use arrow functions?**
A: Concise syntax, lexical 'this' binding (inherits from parent), no own arguments object. Great for callbacks and simple functions.

**Q3: What is a closure?**
A: Function that remembers variables from outer scope even after outer function finishes. Powerful for data privacy and stateful functions.

**Q4: What's the difference between parameters and arguments?**
A: Parameters are placeholders in definition, arguments are values passed when calling. Can have more/fewer arguments than parameters.

**Q5: Why use higher-order functions?**
A: Enable powerful abstractions, composability, and functional programming patterns. Allow customizing behavior without rewriting functions.

---

## Code-Based Interview Questions

**Q1: What will be output?**
```javascript
function test() {
    console.log(a);
    var a = 5;
}
test();  // ?
```
A:
```
undefined
```
Explanation: Hoisting - `var a` is hoisted, initialized as undefined

**Q2: Predict output:**
```javascript
let obj = {
    name: "John",
    getName: () => this.name
};

console.log(obj.getName());  // ?
```
A:
```
undefined
```
Explanation: Arrow function doesn't have own 'this'

**Q3: What will be logged?**
```javascript
let x = 5;
function test() {
    console.log(x);  // ?
    let x = 10;
}
test();
```
A:
```
Error: Cannot access 'x' before initialization
```
Explanation: Temporal Dead Zone with let

**Q4: Spot the error:**
```javascript
let obj = {
    value: 10,
    getValue: () => {
        return this.value;
    }
};
```
A: Arrow function won't have access to `this.value`. Use regular function instead.

**Q5: What is output?**
```javascript
let result = (function(a, b) {
    return a + b;
})(5, 3);

console.log(result);  // ?
```
A:
```
8
```

---

## Follow-up Questions & Confusing Concepts

**Q: Can I use arrow functions as methods?**
A: Technically yes, but 'this' won't refer to object. Use regular functions for methods where you need 'this'.

**Q: What's the difference between arguments object and rest parameters?**
A: Rest parameters create real array, arguments is array-like. Rest is modern, preferred approach.

**Q: Can arrow functions be hoisted?**
A: No. Arrow functions are expressions (like `let`), not declarations. Must define before use.

**Q: What happens if I return object from arrow function?**
A: Need parentheses: `() => ({ key: 'value' })`. Without parentheses, `{}` is code block, not object.

---

## Summary

- **Declaration**: `function name() {}` - hoisted
- **Expression**: `let f = function() {}` - not hoisted
- **Arrow**: `() => {}` - concise, lexical this
- **Parameters**: Placeholders in definition
- **Arguments**: Values passed when calling
- **Return**: Exit function and return value
- **Scope**: Local, global, nested, block scope
- **Callback**: Function passed to another function
- **Higher-order**: Function takes/returns function
- **Default parameters**: `(param = default) =>`
- **Rest parameters**: `(...args) =>`

**Next Step:** Learn about scope, hoisting, and closures!
