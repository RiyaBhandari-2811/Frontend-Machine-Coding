# Loops in JavaScript

## Table of Contents
1. For Loop
2. While Loop
3. Do-While Loop
4. For...In Loop
5. For...Of Loop
6. Loop Control (break, continue)
7. Common Loop Patterns

---

## 1. For Loop

### Basic Syntax
```javascript
for (initialization; condition; increment) {
    // Code to execute repeatedly
}
```

### Simple Example
```javascript
// Print numbers 1 to 5
for (let i = 1; i <= 5; i++) {
    console.log(i);
}
// Output: 1, 2, 3, 4, 5

// Count down from 10 to 1
for (let i = 10; i >= 1; i--) {
    console.log(i);
}
```

### Loop Variables
```javascript
// Initialization: let i = 0 (starts at 0)
// Condition: i < 5 (loop while true)
// Increment: i++ (increase by 1 after each iteration)

for (let i = 0; i < 5; i++) {
    console.log(i);  // 0, 1, 2, 3, 4
}

// Can start/end/increment differently
for (let i = 10; i <= 20; i += 2) {
    console.log(i);  // 10, 12, 14, 16, 18, 20
}
```

### Looping Through Arrays
```javascript
let fruits = ["apple", "banana", "orange"];

for (let i = 0; i < fruits.length; i++) {
    console.log(fruits[i]);
}
// Output:
// apple
// banana
// orange

// Reverse loop
for (let i = fruits.length - 1; i >= 0; i--) {
    console.log(fruits[i]);
}
// Output:
// orange
// banana
// apple
```

### Nested Loops
```javascript
// Print 3x3 grid
for (let i = 1; i <= 3; i++) {
    for (let j = 1; j <= 3; j++) {
        console.log(`(${i}, ${j})`);
    }
}
// Output:
// (1, 1) (1, 2) (1, 3)
// (2, 1) (2, 2) (2, 3)
// (3, 1) (3, 2) (3, 3)

// Multiplication table
for (let i = 1; i <= 5; i++) {
    let row = "";
    for (let j = 1; j <= 5; j++) {
        row += (i * j) + "\t";
    }
    console.log(row);
}
```

---

## 2. While Loop

### Basic Syntax
```javascript
while (condition) {
    // Code executes while condition is true
}
```

### Examples
```javascript
// Count 1 to 5
let i = 1;
while (i <= 5) {
    console.log(i);
    i++;  // Don't forget increment or infinite loop!
}

// Loop while condition changes
let password = "";
while (password !== "admin") {
    password = prompt("Enter password:");
}
console.log("Access granted");
```

### Common Mistake: Infinite Loop
```javascript
// ❌ Infinite loop! i never increments
while (true) {
    console.log("This runs forever!");
}

// ✅ Correct version
let count = 0;
while (count < 5) {
    console.log(count);
    count++;  // Must increment to exit
}
```

---

## 3. Do-While Loop

### Basic Syntax
```javascript
do {
    // Code executes at least once
} while (condition);
```

### Key Difference
- While: Checks condition first, may not execute
- Do-While: Executes first, then checks condition

```javascript
// While loop - may not execute
let x = 10;
while (x < 5) {
    console.log(x);  // Never prints
}

// Do-While loop - always executes at least once
let y = 10;
do {
    console.log(y);  // Prints 10 once
} while (y < 5);
```

### Practical Example
```javascript
// Get valid input from user (at least one attempt)
let input;
do {
    input = prompt("Enter a number 1-10:");
} while (input < 1 || input > 10);
```

---

## 4. For...In Loop

### Basic Syntax
```javascript
for (let key in object) {
    // key contains property name
}
```

### Looping Through Object Properties
```javascript
let person = {
    name: "John",
    age: 25,
    city: "New York"
};

for (let key in person) {
    console.log(key + ": " + person[key]);
}
// Output:
// name: John
// age: 25
// city: New York
```

### For...In with Arrays (not recommended)
```javascript
let fruits = ["apple", "banana", "orange"];

for (let index in fruits) {
    console.log(index + ": " + fruits[index]);
}
// Output:
// 0: apple
// 1: banana
// 2: orange

// Problem: for...in includes inherited properties and non-numeric keys
// Don't use for...in with arrays! Use for or for...of instead
```

---

## 5. For...Of Loop (ES6)

### Basic Syntax
```javascript
for (let value of iterable) {
    // value contains element value
}
```

### Looping Through Arrays
```javascript
let fruits = ["apple", "banana", "orange"];

for (let fruit of fruits) {
    console.log(fruit);
}
// Output:
// apple
// banana
// orange

// With index (use entries())
for (let [index, fruit] of fruits.entries()) {
    console.log(index + ": " + fruit);
}
// Output:
// 0: apple
// 1: banana
// 2: orange
```

### Looping Through Strings
```javascript
let word = "hello";

for (let letter of word) {
    console.log(letter);
}
// Output: h, e, l, l, o
```

### For vs For...Of
```javascript
let arr = ["a", "b", "c"];

// Traditional for loop
for (let i = 0; i < arr.length; i++) {
    console.log(arr[i]);  // Need to access by index
}

// For...of loop (cleaner)
for (let element of arr) {
    console.log(element);  // Direct access to value
}
```

---

## 6. Loop Control Statements

### Break Statement
```javascript
// Exit loop immediately
for (let i = 1; i <= 10; i++) {
    if (i === 5) {
        break;  // Exit loop
    }
    console.log(i);
}
// Output: 1, 2, 3, 4

// Find element in array
let numbers = [2, 4, 6, 8, 10, 12];
for (let num of numbers) {
    if (num === 8) {
        console.log("Found 8!");
        break;  // Exit loop once found
    }
}
```

### Continue Statement
```javascript
// Skip current iteration, continue with next
for (let i = 1; i <= 5; i++) {
    if (i === 3) {
        continue;  // Skip iteration when i === 3
    }
    console.log(i);
}
// Output: 1, 2, 4, 5

// Print only even numbers
for (let i = 1; i <= 10; i++) {
    if (i % 2 !== 0) {
        continue;  // Skip odd numbers
    }
    console.log(i);
}
// Output: 2, 4, 6, 8, 10
```

### Break vs Continue
```javascript
// Break - exits entire loop
for (let i = 1; i <= 5; i++) {
    if (i === 3) break;
    console.log(i);  // 1, 2
}

// Continue - skips to next iteration
for (let i = 1; i <= 5; i++) {
    if (i === 3) continue;
    console.log(i);  // 1, 2, 4, 5
}
```

---

## 7. Common Loop Patterns

### Sum All Elements
```javascript
let numbers = [1, 2, 3, 4, 5];
let sum = 0;

for (let num of numbers) {
    sum += num;
}
console.log(sum);  // 15
```

### Find Maximum/Minimum
```javascript
let scores = [45, 89, 23, 56, 92, 34];
let max = scores[0];

for (let score of scores) {
    if (score > max) {
        max = score;
    }
}
console.log(max);  // 92
```

### Count Occurrences
```javascript
let items = ["apple", "banana", "apple", "orange", "apple"];
let count = 0;

for (let item of items) {
    if (item === "apple") {
        count++;
    }
}
console.log(count);  // 3
```

### Filter Elements
```javascript
let numbers = [1, 2, 3, 4, 5, 6];
let evens = [];

for (let num of numbers) {
    if (num % 2 === 0) {
        evens.push(num);
    }
}
console.log(evens);  // [2, 4, 6]
```

---

## Exercises

### Exercise 1: Print Pyramid
```javascript
// Print a pyramid pattern:
// *
// **
// ***
// ****
// *****

function printPyramid(height) {
    // Your code
}

printPyramid(5);
```

**Solution:**
```javascript
function printPyramid(height) {
    for (let i = 1; i <= height; i++) {
        console.log("*".repeat(i));
    }
}
```

### Exercise 2: Find Index
```javascript
// Find index of element in array
// Return -1 if not found

function findIndex(arr, target) {
    // Your code
}

console.log(findIndex([1, 2, 3, 4, 5], 3));   // 2
console.log(findIndex([1, 2, 3, 4, 5], 10));  // -1
```

**Solution:**
```javascript
function findIndex(arr, target) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === target) {
            return i;
        }
    }
    return -1;
}
```

### Exercise 3: Reverse Array
```javascript
// Reverse array elements without using .reverse()

function reverseArray(arr) {
    let reversed = [];
    // Your code
    return reversed;
}

console.log(reverseArray([1, 2, 3, 4, 5])); // [5, 4, 3, 2, 1]
```

**Solution:**
```javascript
function reverseArray(arr) {
    let reversed = [];
    for (let i = arr.length - 1; i >= 0; i--) {
        reversed.push(arr[i]);
    }
    return reversed;
}
```

---

## Interview Questions

### Theoretical Questions

**Q1: What's the difference between for and while loops?**
A: For loops better when you know iterations count. While loops better when condition is complex. Both achieve same result, choose based on readability.

**Q2: When should I use for...of instead of regular for loop?**
A: Use for...of for simpler syntax when you don't need index. Use regular for when you need index or need to skip iterations.

**Q3: What's the difference between break and continue?**
A: `break` exits entire loop, `continue` skips current iteration and goes to next one.

**Q4: Can loops be nested?**
A: Yes, unlimited nesting. Each inner loop runs completely for each outer loop iteration. Watch performance with many levels.

**Q5: What causes an infinite loop and how to avoid?**
A: Condition never becomes false. Always ensure loop condition will eventually be false and increment/change variables correctly.

---

## Code-Based Interview Questions

**Q1: What will be output?**
```javascript
for (let i = 0; i < 3; i++) {
    console.log(i);
}
// ?
```
A: 
```
0
1
2
```

**Q2: Predict output:**
```javascript
for (let i = 0; i < 5; i++) {
    if (i === 2) continue;
    console.log(i);
}
// ?
```
A:
```
0
1
3
4
```

**Q3: What will be logged?**
```javascript
let arr = [1, 2, 3];
for (let i in arr) {
    console.log(i);
}
// ?
```
A:
```
0
1
2
```
(Note: for...in gives indices for arrays, not values!)

**Q4: Spot the error:**
```javascript
while (true) {
    console.log("Hello");
}
```
A: Infinite loop! Condition always true, needs break statement or false condition.

**Q5: What will be output?**
```javascript
let count = 0;
while (count < 3) {
    count++;
}
console.log(count);  // ?
```
A:
```
3
```

---

## Follow-up Questions & Confusing Concepts

**Q: Why shouldn't I use for...in with arrays?**
A: for...in iterates over all enumerable properties, including inherited ones and array methods. It's meant for objects. Use for or for...of for arrays.

**Q: Can I modify array while looping?**
A: Dangerous! Changes during iteration can cause unexpected skipped elements. Best to filter/map into new array instead.

**Q: What's the performance difference between loop types?**
A: for loop is fastest, for...of is slower but cleaner, while loop similar to for. Optimization rarely matters unless very large arrays.

**Q: Can I break/continue from nested loops?**
A: Break only exits innermost loop. For outer loop, use labeled statements or separate function.

---

## Summary

- **For loop**: When you know iteration count
- **While loop**: When condition is complex
- **Do-while**: Executes at least once
- **For...in**: Object properties (not for arrays!)
- **For...of**: Array/string values (ES6)
- **Break**: Exit loop
- **Continue**: Skip to next iteration
- **Nested loops**: Each inner runs complete for each outer iteration

**Next Step:** Learn about arrays and their methods!
