# Generators & Iterators

## Table of Contents
1. What are Generators?
2. Generator Functions
3. Yield Keyword
4. Generator Methods
5. Iterator Protocol
6. Generator Delegation
7. Generators with Async
8. Practical Use Cases
9. Best Practices

---

## 1. What are Generators?

### Understanding Generators
- **Generator**: Function that can pause and resume execution
- Returns iterator object
- Maintains internal state
- Useful for lazy evaluation
- More memory efficient than arrays

### Generator vs Regular Function
```javascript
// Regular function - executes all at once
function regular() {
    return 1;
}
console.log(regular());  // 1

// Generator - can pause and resume
function* generator() {
    yield 1;
    yield 2;
    yield 3;
}

let gen = generator();  // Returns iterator
console.log(gen.next());  // { value: 1, done: false }
console.log(gen.next());  // { value: 2, done: false }
console.log(gen.next());  // { value: 3, done: false }
console.log(gen.next());  // { value: undefined, done: true }
```

### Why Use Generators?
```javascript
// Without generator: Need to store entire array in memory
function getAllNumbers(n) {
    let result = [];
    for (let i = 0; i < n; i++) {
        result.push(i);
    }
    return result;  // All 1,000,000 numbers at once!
}

let numbers = getAllNumbers(1000000);  // Memory intensive

// With generator: Produces one at a time
function* getNumbers(n) {
    for (let i = 0; i < n; i++) {
        yield i;  // Only one number at a time
    }
}

let gen = getNumbers(1000000);
console.log(gen.next().value);  // 0
console.log(gen.next().value);  // 1
// Much more memory efficient!
```

---

## 2. Generator Functions

### Defining Generators
```javascript
// Function must have * after function keyword
function* myGenerator() {
    yield 1;
    yield 2;
    yield 3;
}

// Or with arrow-like syntax (ES2022)
const myGen = function* () {
    yield 1;
    yield 2;
};

// Can't use arrow functions
// const gen = *() => { }  ✗ Syntax error
```

### Calling Generators
```javascript
function* simple() {
    yield 'first';
    yield 'second';
    return 'third';  // Ends generator
}

// Generator function returns iterator
let gen = simple();
console.log(gen);  // Object [Generator]

// Not the same as calling function
// Generator doesn't execute until you call next()
```

### Next Method
```javascript
function* counter() {
    console.log('Start');
    yield 1;
    console.log('After 1');
    yield 2;
    console.log('After 2');
    yield 3;
    console.log('Done');
}

let gen = counter();
console.log(gen.next());  // Start, { value: 1, done: false }
console.log(gen.next());  // After 1, { value: 2, done: false }
console.log(gen.next());  // After 2, { value: 3, done: false }
console.log(gen.next());  // Done, { value: undefined, done: true }
```

---

## 3. Yield Keyword

### Basic Yield
```javascript
function* simple() {
    yield 'a';
    yield 'b';
    yield 'c';
}

for (let value of simple()) {
    console.log(value);  // a, b, c
}
```

### Yield Expressions
```javascript
// Yield can be used in expressions
function* process() {
    let x = yield 'waiting for input';
    console.log('Received:', x);
    
    let y = yield 'waiting for more';
    console.log('Received:', y);
}

let gen = process();
gen.next();              // Starts, yields 'waiting for input'
gen.next(10);           // Passes 10, resumes, yields 'waiting for more'
gen.next(20);           // Passes 20, resumes
// Console: Received: 10, Received: 20
```

### Yield in Loops
```javascript
function* range(start, end) {
    for (let i = start; i < end; i++) {
        yield i;
    }
}

console.log([...range(1, 5)]);  // [1, 2, 3, 4]

// Memory efficient for large ranges
for (let num of range(1, 1000000)) {
    if (num > 10) break;  // Can stop early
}
```

---

## 4. Generator Methods

### Return Method
```javascript
function* gen() {
    yield 1;
    yield 2;
    yield 3;
}

let g = gen();
console.log(g.next());   // { value: 1, done: false }
console.log(g.return('stopped'));  // { value: 'stopped', done: true }
console.log(g.next());   // { value: undefined, done: true }
```

### Throw Method
```javascript
function* gen() {
    try {
        yield 1;
        yield 2;
        yield 3;
    } catch (e) {
        console.log('Caught:', e);
    }
}

let g = gen();
console.log(g.next());   // { value: 1, done: false }
console.log(g.throw(new Error('Error!')));  // Caught: Error!, then continues
```

### Both Methods Example
```javascript
function* task() {
    try {
        yield 'step 1';
        yield 'step 2';
        yield 'step 3';
    } finally {
        console.log('Cleanup');
    }
}

let gen = task();
gen.next();     // { value: 'step 1', done: false }
gen.return();   // Cleanup, { value: undefined, done: true }
```

---

## 5. Iterator Protocol

### Understanding Iterator Protocol
- **Iterator**: Object with `next()` method
- Returns object with `value` and `done` properties
- Can be iterated with for...of

### Creating Custom Iterator
```javascript
// Not a generator, but follows iterator protocol
let countdown = {
    count: 3,
    
    [Symbol.iterator]() {
        return this;
    },
    
    next() {
        if (this.count > 0) {
            return { value: this.count--, done: false };
        }
        return { done: true };
    }
};

for (let val of countdown) {
    console.log(val);  // 3, 2, 1
}
```

### Generator Creates Iterator
```javascript
// Generator automatically creates iterator
function* range(n) {
    for (let i = 1; i <= n; i++) {
        yield i;
    }
}

let iter = range(3);
console.log(iter[Symbol.iterator]() === iter);  // true

// Can use in for...of
for (let val of range(3)) {
    console.log(val);  // 1, 2, 3
}

// Can convert to array
console.log([...range(3)]);  // [1, 2, 3]
```

---

## 6. Generator Delegation

### Yield* Syntax
```javascript
function* inner() {
    yield 'a';
    yield 'b';
}

function* outer() {
    yield 'start';
    yield* inner();  // Delegate to inner
    yield 'end';
}

console.log([...outer()]);  // ['start', 'a', 'b', 'end']
```

### Chaining Generators
```javascript
function* gen1() {
    yield 1;
    yield 2;
}

function* gen2() {
    yield 'a';
    yield 'b';
}

function* combined() {
    yield* gen1();
    yield* gen2();
}

console.log([...combined()]);  // [1, 2, 'a', 'b']
```

---

## 7. Generators with Async

### Promise Handling
```javascript
// Pre-async/await pattern
function* fetchData() {
    let user = yield fetch('/api/user').then(r => r.json());
    let posts = yield fetch(`/api/posts/${user.id}`).then(r => r.json());
    return { user, posts };
}

// Now we have async/await (simpler!)
async function fetchData() {
    let user = await fetch('/api/user').then(r => r.json());
    let posts = await fetch(`/api/posts/${user.id}`).then(r => r.json());
    return { user, posts };
}
```

### Generator Run Function
```javascript
function run(generator) {
    const iterator = generator();
    
    function handle(result) {
        if (result.done) return Promise.resolve(result.value);
        
        return Promise.resolve(result.value)
            .then(res => handle(iterator.next(res)))
            .catch(err => iterator.throw(err));
    }
    
    return handle(iterator.next());
}

// Use with generators
function* loadUser() {
    try {
        let user = yield fetch('/api/user').then(r => r.json());
        return user;
    } catch (e) {
        console.log('Error:', e);
    }
}

run(loadUser()).then(user => console.log(user));
```

---

## 8. Practical Use Cases

### Infinite Sequences
```javascript
function* infiniteSequence() {
    let n = 0;
    while (true) {
        yield n++;
    }
}

// Can use, but stop when needed
let gen = infiniteSequence();
console.log(gen.next().value);  // 0
console.log(gen.next().value);  // 1
// Can continue forever
```

### Fibonacci Sequence
```javascript
function* fibonacci() {
    let a = 0, b = 1;
    
    while (true) {
        yield a;
        [a, b] = [b, a + b];
    }
}

// Get first 10 Fibonacci numbers
let fib = fibonacci();
for (let i = 0; i < 10; i++) {
    console.log(fib.next().value);
}
```

### Tree Traversal
```javascript
function* traverse(tree) {
    yield tree.value;
    
    if (tree.left) {
        yield* traverse(tree.left);
    }
    if (tree.right) {
        yield* traverse(tree.right);
    }
}

let binaryTree = {
    value: 1,
    left: { value: 2, left: null, right: null },
    right: { value: 3, left: null, right: null }
};

console.log([...traverse(binaryTree)]);  // [1, 2, 3]
```

### Pagination
```javascript
function* paginate(items, pageSize) {
    for (let i = 0; i < items.length; i += pageSize) {
        yield items.slice(i, i + pageSize);
    }
}

let items = Array.from({ length: 100 }, (_, i) => i);
for (let page of paginate(items, 10)) {
    console.log('Page:', page);  // [0-9], [10-19], etc
}
```

---

## 9. Best Practices

### Use Cases for Generators
```javascript
// Good for:
// 1. Lazy evaluation (compute on demand)
function* range(n) {
    for (let i = 0; i < n; i++) {
        yield i;
    }
}

// 2. Infinite sequences
function* infinite() {
    let n = 0;
    while (true) yield n++;
}

// 3. Memory efficiency
function* readFile(lines) {
    for (let line of lines) {
        yield line;
    }
}

// Not ideal for:
// - If you need random access (use arrays)
// - If you need to iterate multiple times (harder than arrays)
```

### Generator Exhaustion
```javascript
function* gen() {
    yield 1;
    yield 2;
}

let g = gen();
let arr1 = [...g];  // [1, 2]
let arr2 = [...g];  // [] - Generator exhausted!

// Create new generator for reuse
let g1 = gen();
let g2 = gen();
```

---

## Exercises

### Exercise 1: Simple Generator
```javascript
// Create generator that yields 1, 2, 3
function* counter() {
    // Your code
}

// Test
let gen = counter();
console.log(gen.next());  // { value: 1, done: false }
console.log(gen.next());  // { value: 2, done: false }
console.log(gen.next());  // { value: 3, done: false }
console.log(gen.next());  // { value: undefined, done: true }
```

**Solution:**
```javascript
function* counter() {
    yield 1;
    yield 2;
    yield 3;
}
```

### Exercise 2: Range Generator
```javascript
// Create generator that yields range of numbers
function* range(start, end) {
    // Your code
}

console.log([...range(1, 5)]);  // [1, 2, 3, 4]
```

**Solution:**
```javascript
function* range(start, end) {
    for (let i = start; i < end; i++) {
        yield i;
    }
}
```

### Exercise 3: Fibonacci
```javascript
// Create generator that yields Fibonacci numbers
function* fibonacci(n) {
    // Your code - yield first n Fibonacci numbers
}

console.log([...fibonacci(5)]);  // [0, 1, 1, 2, 3]
```

**Solution:**
```javascript
function* fibonacci(n) {
    let a = 0, b = 1;
    for (let i = 0; i < n; i++) {
        yield a;
        [a, b] = [b, a + b];
    }
}
```

---

## Interview Questions

### Theoretical Questions

**Q1: What's the difference between generator and iterator?**
A: Generator is function that returns iterator. Iterator is object with next() method.

**Q2: When would I use generators vs arrays?**
A: Generators for lazy evaluation and large/infinite sequences. Arrays for random access.

**Q3: What does yield do?**
A: Pauses generator execution and returns value. Next call resumes from that point.

**Q4: Can generators be iterated multiple times?**
A: No, generator exhausts after one iteration. Must create new generator for reuse.

**Q5: What is yield*?**
A: Delegates to another generator. Yields all values from inner generator.

---

## Code-Based Interview Questions

**Q1: What will be output?**
```javascript
function* gen() {
    yield 1;
    yield 2;
}

let g = gen();
console.log(g.next().value);  // ?
console.log(g.next().value);  // ?
```
A:
```
1
2
```

**Q2: Predict:**
```javascript
function* gen() {
    yield 1;
    yield 2;
}

console.log([...gen()]);  // ?
```
A:
```
[1, 2]
```

**Q3: What will be logged?**
```javascript
function* gen() {
    yield 1;
}

for (let val of gen()) {
    console.log(val);  // ?
}
```
A:
```
1
```

**Q4: Spot the issue:**
```javascript
const gen = () => {  // ✗ Can't use arrow function
    yield 1;
};
```
A: Arrow functions can't be generators. Use function* instead.

**Q5: What is output?**
```javascript
function* gen() {
    yield* [1, 2, 3];
}

console.log([...gen()]);  // ?
```
A:
```
[1, 2, 3]
```

---

## Follow-up Questions & Confusing Concepts

**Q: Can I call next() with arguments?**
A: Yes, next(value) passes value as result of yield expression.

**Q: Are generators synchronous or asynchronous?**
A: Synchronous, but often used to manage async code (before async/await).

**Q: What happens if generator throws error?**
A: Use throw() method on generator or try/catch inside.

**Q: Can generator have return value?**
A: Yes, return value comes in final next() call with done: true.

---

## Summary

- **Generator**: Function that can pause and resume
- **Function***: Syntax for defining generator
- **Yield**: Pauses execution, returns value
- **Iterator**: Object with next() method
- **Symbol.iterator**: Makes object iterable
- **Lazy evaluation**: Compute values on demand
- **Memory efficient**: Don't store all values at once
- **Delegation**: Use yield* to delegate to another generator
- **Exhaustion**: Generator can only be iterated once
- **Use cases**: Infinite sequences, lazy evaluation, pagination

**Next Step:** Explore more advanced JavaScript concepts!
