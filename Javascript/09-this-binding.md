# The 'this' Keyword & Binding in JavaScript

## Table of Contents
1. What is 'this'?
2. Global Context
3. Object Method Context
4. Constructor Functions
5. call() Method
6. apply() Method
7. bind() Method
8. Arrow Functions and 'this'
9. Common Patterns

---

## 1. What is 'this'?

### Understanding 'this'
- **this**: Keyword that refers to object calling the function
- Determined by HOW function is called, not WHERE it's defined
- Context changes based on execution context
- Different in different situations

### Key Principle
```javascript
// 'this' refers to object on LEFT side of dot
let obj = {
    name: "Object",
    getValue: function() {
        console.log(this);  // 'this' refers to obj
    }
};

obj.getValue();  // 'this' is obj

let func = obj.getValue;
func();  // 'this' is global (window in browser, global in Node.js)
```

---

## 2. Global Context

### Browser Global Scope
```javascript
console.log(this);  // window (browser)

function test() {
    console.log(this);  // window (browser)
}

test();

// In browser
console.log(this === window);  // true
console.log(this.name = "Global");  // "Global"
```

### Node.js Global Scope
```javascript
// In Node.js
console.log(this);  // {} (module object, not global)

function test() {
    console.log(this);  // global object
}

test();

// In Node.js
console.log(this === global);  // false (in module)
console.log(this === module.exports);  // true
```

### Strict Mode
```javascript
"use strict";

function test() {
    console.log(this);  // undefined (not global!)
}

test();

// Objects still work
let obj = {
    getValue() {
        console.log(this);  // obj
    }
};
obj.getValue();
```

---

## 3. Object Method Context

### 'this' in Methods
```javascript
let person = {
    name: "John",
    age: 25,
    
    greet() {
        console.log(`Hello, I'm ${this.name}`);
        // 'this' refers to person object
    },
    
    describe() {
        return `${this.name} is ${this.age} years old`;
    }
};

person.greet();     // "Hello, I'm John"
console.log(person.describe());  // "John is 25 years old"
```

### 'this' Context Changes
```javascript
let person = {
    name: "John",
    getName: function() {
        return this.name;
    }
};

console.log(person.getName());  // "John" - this is person

// But if we store function in variable
let getNameFunc = person.getName;
console.log(getNameFunc());     // undefined - this is global

// Even in object, if called without dot
let obj = { name: "Object", getName: person.getName };
console.log(obj.getName());     // "Object" - this is obj
```

### Nested Objects
```javascript
let company = {
    name: "TechCorp",
    location: {
        city: "SF",
        describe() {
            return `${this.city}`;  // 'this' is location object
        }
    }
};

console.log(company.location.describe());  // "SF"
```

---

## 4. Constructor Functions

### 'this' in Constructors
```javascript
function Person(name, age) {
    this.name = name;  // 'this' refers to new object
    this.age = age;
}

let person1 = new Person("John", 25);
let person2 = new Person("Jane", 30);

console.log(person1.name);  // "John"
console.log(person2.name);  // "Jane"
console.log(person1.age);   // 25
```

### Without 'new' Keyword
```javascript
function Person(name) {
    this.name = name;
}

// Without 'new'
let obj = Person("John");  // 'this' is global!
console.log(obj);           // undefined
console.log(window.name);   // "John" (in browser)

// With 'new'
let person = new Person("John");
console.log(person.name);   // "John"
```

---

## 5. call() Method

### Using call()
```javascript
// call(thisArg, arg1, arg2, ...)
function greet(greeting) {
    return `${greeting}, I'm ${this.name}`;
}

let person1 = { name: "John" };
let person2 = { name: "Jane" };

// Same function, different 'this'
console.log(greet.call(person1, "Hello"));  // "Hello, I'm John"
console.log(greet.call(person2, "Hi"));     // "Hi, I'm Jane"
```

### call() with Multiple Arguments
```javascript
function introduce(greeting, punctuation) {
    return `${greeting}, I'm ${this.name}${punctuation}`;
}

let person = { name: "John" };
console.log(introduce.call(person, "Hello", "!"));  // "Hello, I'm John!"
```

### Borrowing Methods
```javascript
let person1 = {
    name: "John",
    greet() {
        return `Hello, ${this.name}!`;
    }
};

let person2 = { name: "Jane" };

// person2 borrows person1's greet method
console.log(person1.greet.call(person2));  // "Hello, Jane!"
```

---

## 6. apply() Method

### Using apply()
```javascript
// apply(thisArg, [arg1, arg2, ...])
function greet(greeting, punctuation) {
    return `${greeting}, I'm ${this.name}${punctuation}`;
}

let person = { name: "John" };

// Arguments as array
console.log(greet.apply(person, ["Hello", "!"]));  // "Hello, I'm John!"

// Same result as call but with array
console.log(greet.call(person, "Hello", "!"));
```

### Finding Max/Min with apply()
```javascript
let numbers = [5, 10, 3, 20, 1];

// Math.max expects individual arguments, not array
console.log(Math.max(...numbers));           // 20 (spread)
console.log(Math.max.apply(null, numbers));  // 20 (apply)

// Both work, spread is more modern
```

### call vs apply
```javascript
function test(a, b) {
    return a + b;
}

// call: arguments as list
test.call(null, 5, 3);        // 8

// apply: arguments as array
test.apply(null, [5, 3]);     // 8
```

---

## 7. bind() Method

### Using bind()
```javascript
// bind() returns NEW function with bound 'this'
function greet(greeting) {
    return `${greeting}, I'm ${this.name}`;
}

let person = { name: "John" };

// Create new function with bound 'this'
let boundGreet = greet.bind(person);
console.log(boundGreet("Hello"));  // "Hello, I'm John"
```

### bind() with Arguments
```javascript
function greet(greeting, punctuation) {
    return `${greeting}, I'm ${this.name}${punctuation}`;
}

let person = { name: "John" };

// Bind 'this' and partial arguments
let boundGreet = greet.bind(person, "Hello");
console.log(boundGreet("!"));      // "Hello, I'm John!"
console.log(boundGreet("?"));      // "Hello, I'm John?"
```

### bind() in Event Handlers
```javascript
// Problem: 'this' in event handler is element
let button = {
    label: "Click Me",
    
    handleClick: function(e) {
        console.log(this.label);  // Wrong 'this'
    }
};

document.addEventListener("click", button.handleClick);  // 'this' is document

// Solution: use bind
document.addEventListener("click", button.handleClick.bind(button));  // 'this' is button
```

### call vs apply vs bind
```javascript
function test(a, b) {
    console.log(this, a, b);
}

let obj = { name: "Object" };

test.call(obj, 1, 2);        // Calls immediately
test.apply(obj, [1, 2]);     // Calls immediately
test.bind(obj, 1, 2)();      // Returns function, need to call

// bind useful when you need to pass function later
setTimeout(test.bind(obj, 1, 2), 1000);  // 'this' bound when executed
```

---

## 8. Arrow Functions and 'this'

### Arrow Functions Don't Have Own 'this'
```javascript
let person = {
    name: "John",
    
    // Regular function
    greet1: function() {
        console.log(this.name);  // "John"
    },
    
    // Arrow function
    greet2: () => {
        console.log(this.name);  // undefined ('this' is global)
    }
};

person.greet1();  // "John"
person.greet2();  // undefined
```

### Arrow Functions Inherit 'this'
```javascript
let person = {
    name: "John",
    
    greet() {
        // 'this' is person in this function
        let arrow = () => {
            console.log(this.name);  // Arrow inherits 'this' from greet
        };
        arrow();
    }
};

person.greet();  // "John"
```

### Arrow Functions in Callbacks
```javascript
let person = {
    name: "John",
    
    // Wrong: regular function
    testRegular: function() {
        setTimeout(function() {
            console.log(this.name);  // undefined ('this' is global)
        }, 100);
    },
    
    // Right: arrow function
    testArrow: function() {
        setTimeout(() => {
            console.log(this.name);  // "John" (inherits 'this')
        }, 100);
    }
};

person.testRegular();  // undefined
person.testArrow();    // "John"
```

### When NOT to Use Arrow Functions
```javascript
// Don't use as methods where you need 'this'
let obj = {
    value: 10,
    getValue: () => {
        return this.value;  // Wrong!
    }
};
obj.getValue();  // undefined

// Don't use as constructors
let MyClass = () => {};
new MyClass();  // Error: MyClass is not a constructor
```

---

## 9. Common Patterns

### Method Borrowing
```javascript
let person = {
    name: "John"
};

function introduce() {
    return `I'm ${this.name}`;
}

// Use person's 'this'
console.log(introduce.call(person));  // "I'm John"
```

### Partial Application
```javascript
function multiply(a, b, c) {
    return a * b * c;
}

// Create specialized function
let double = multiply.bind(null, 2);
console.log(double(3, 4));  // 2 * 3 * 4 = 24

// Add another layer
let doubleTriple = multiply.bind(null, 2, 3);
console.log(doubleTriple(4));  // 2 * 3 * 4 = 24
```

---

## Exercises

### Exercise 1: Fix 'this' Context
```javascript
let user = {
    name: "John",
    
    greet: function() {
        return `Hello, ${this.name}!`;
    }
};

// This breaks the context
let greetUser = user.greet;
console.log(greetUser());  // "Hello, undefined!"

// Fix it with bind
let greetFixed = user.greet.bind(user);
console.log(greetFixed());  // "Hello, John!"
```

### Exercise 2: Borrowing Methods
```javascript
let person1 = {
    name: "John",
    speak() {
        return `${this.name} says hello`;
    }
};

let person2 = { name: "Jane" };

// Borrow person1's speak method for person2
console.log(person1.speak.call(person2));  // "Jane says hello"
```

### Exercise 3: Arrow Function Fix
```javascript
// Fix the arrow function issue
let button = {
    label: "Click",
    
    handleClick: function() {
        console.log(this.label);  // "Click"
        
        // Arrow function - this works!
        let delayed = () => {
            console.log(this.label);
        };
        
        setTimeout(delayed, 100);  // "Click"
    }
};

button.handleClick();
```

---

## Interview Questions

### Theoretical Questions

**Q1: What determines the value of 'this'?**
A: How function is called (execution context), not where it's defined. For methods, 'this' is object on left of dot. For regular functions, 'this' is global/undefined.

**Q2: Why use bind()?**
A: To permanently set 'this' value for a function. Useful in callbacks and event handlers where context would otherwise change.

**Q3: Why can't you use arrow functions as methods?**
A: Arrow functions don't have own 'this', they inherit from surrounding scope. For methods, you need 'this' to refer to the object.

**Q4: What's the difference between call, apply, and bind?**
A: call/apply invoke immediately (call with args list, apply with array), bind returns new function without invoking. Use bind for delayed calls.

**Q5: When is 'this' global/undefined?**
A: Regular function calls (not as method). In strict mode, 'this' is undefined. In non-strict, 'this' is global object.

---

## Code-Based Interview Questions

**Q1: What will be output?**
```javascript
let obj = {
    value: 10,
    getValue: function() {
        return this.value;
    }
};

let func = obj.getValue;
console.log(func());  // ?
```
A:
```
undefined
```
Explanation: 'this' becomes global, not obj

**Q2: Predict output:**
```javascript
let person = {
    name: "John",
    greet: () => {
        return this.name;
    }
};

console.log(person.greet());  // ?
```
A:
```
undefined
```
Explanation: Arrow function doesn't have own 'this'

**Q3: What will be logged?**
```javascript
function test(a, b) {
    console.log(this.x + a + b);
}

test.call({ x: 10 }, 2, 3);  // ?
test.apply({ x: 10 }, [2, 3]);  // ?
test.bind({ x: 10 }, 2, 3)();  // ?
```
A:
```
15
15
15
```

**Q4: Spot the error:**
```javascript
let obj = {
    value: 10,
    handleClick: () => {
        console.log(this.value);
    }
};

document.addEventListener("click", obj.handleClick);
```
A: Arrow function won't have correct 'this'. Use regular function or bind.

**Q5: What is output?**
```javascript
let person = { name: "John" };
function getName() {
    return this.name;
}

let boundGet = getName.bind(person);
console.log(boundGet());  // ?
```
A:
```
"John"
```

---

## Follow-up Questions & Confusing Concepts

**Q: Can I change 'this' multiple times with bind?**
A: No, bind sets 'this' permanently. Can't bind again to change it.

**Q: What if I use call() on bound function?**
A: Bound 'this' takes precedence, call/apply can't change it.

**Q: Why is arrow function 'this' global in some cases?**
A: Arrow functions don't create own 'this', they inherit from lexical scope (where function is defined).

**Q: When should I NOT use bind?**
A: Use arrow functions in callbacks as alternative. bind adds complexity, arrow simpler for callbacks.

---

## Summary

- **this**: Context of object calling function
- **Global**: 'this' in global scope (window/global/undefined)
- **Methods**: 'this' is object calling method
- **Constructors**: 'this' is new object being created
- **call()**: Invoke with specific 'this', args as list
- **apply()**: Invoke with specific 'this', args as array
- **bind()**: Return new function with bound 'this'
- **Arrow functions**: Don't have own 'this', inherit from scope
- **Never use**: Arrow functions as methods or constructors

**Next Step:** Learn about asynchronous JavaScript and promises!
