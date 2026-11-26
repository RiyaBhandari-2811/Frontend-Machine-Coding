# Arrays in JavaScript

## Table of Contents
1. Array Basics & Creation
2. Array Indexing & Length
3. Array Mutation Methods (push, pop, shift, unshift, splice)
4. Array Transformation Methods (map, filter, reduce)
5. Array Search Methods (find, findIndex, includes, indexOf)
6. Array Ordering (sort, reverse)
7. Array Combination (concat, spread operator)
8. Array Iteration (forEach, for...of)
9. Multi-dimensional Arrays

---

## 1. Array Basics & Creation

### What is an Array?
- **Array**: Ordered collection of values
- Indexed starting at 0
- Can contain any data type (mixed types allowed)
- Mutable - can be modified

### Creating Arrays
```javascript
// Array literal (preferred)
let fruits = ["apple", "banana", "orange"];
let mixed = [1, "hello", true, null];
let empty = [];

// Array constructor (rarely used)
let arr = new Array(5);  // Creates array with 5 empty slots
let arr2 = new Array("a", "b", "c");  // Same as ["a", "b", "c"]
```

### Array vs Object
```javascript
// Array - ordered collection with indices
let arr = ["first", "second", "third"];
console.log(arr[0]);  // "first"

// Object - unordered key-value pairs
let obj = { 0: "first", 1: "second" };  // Don't do this!
```

---

## 2. Array Indexing & Length

### Accessing Elements
```javascript
let colors = ["red", "green", "blue"];

console.log(colors[0]);      // "red" (first element)
console.log(colors[1]);      // "green"
console.log(colors[2]);      // "blue"
console.log(colors[10]);     // undefined (out of range)
console.log(colors[-1]);     // undefined (negative index)
console.log(colors.at(-1));  // "blue" (ES2022)
```

### Array Length
```javascript
let arr = [1, 2, 3, 4, 5];
console.log(arr.length);  // 5

// Can modify length
arr.length = 3;
console.log(arr);  // [1, 2, 3] - truncates array

// Add elements by setting length
arr.length = 5;
console.log(arr);  // [1, 2, 3, empty, empty]
```

### Checking if Array
```javascript
let arr = [1, 2, 3];
let obj = { name: "John" };

console.log(Array.isArray(arr));   // true
console.log(Array.isArray(obj));   // false
console.log(arr instanceof Array); // true
```

---

## 3. Array Mutation Methods

### Push - Add to end
```javascript
let arr = [1, 2, 3];
arr.push(4);           // Add single element
console.log(arr);      // [1, 2, 3, 4]

arr.push(5, 6, 7);     // Add multiple elements
console.log(arr);      // [1, 2, 3, 4, 5, 6, 7]
console.log(arr.push(8));  // Returns new length: 8
```

### Pop - Remove from end
```javascript
let arr = [1, 2, 3];
let last = arr.pop();  // Returns removed element
console.log(last);     // 3
console.log(arr);      // [1, 2]

arr.pop();             // Remove another
console.log(arr);      // [1]

[].pop();              // Returns undefined
```

### Shift - Remove from beginning
```javascript
let arr = [1, 2, 3];
let first = arr.shift();  // Returns removed element
console.log(first);       // 1
console.log(arr);         // [2, 3]
```

### Unshift - Add to beginning
```javascript
let arr = [2, 3];
arr.unshift(1);           // Add single element
console.log(arr);         // [1, 2, 3]

arr.unshift(-1, 0);       // Add multiple
console.log(arr);         // [-1, 0, 1, 2, 3]
```

### Splice - Add/remove at any position
```javascript
let arr = ["a", "b", "c", "d"];

// Remove 2 elements starting at index 1
let removed = arr.splice(1, 2);  // Returns removed elements
console.log(removed);  // ["b", "c"]
console.log(arr);      // ["a", "d"]

// Add elements without removing
let arr2 = ["a", "b", "c"];
arr2.splice(1, 0, "x", "y");  // Remove 0, add x,y
console.log(arr2);  // ["a", "x", "y", "b", "c"]

// Replace elements
let arr3 = ["a", "b", "c"];
arr3.splice(1, 1, "X", "Y");  // Remove 1, add X,Y
console.log(arr3);  // ["a", "X", "Y", "c"]
```

### Copy Operations
```javascript
let original = [1, 2, 3];

// Shallow copy (all create new array reference)
let copy1 = original.slice();
let copy2 = [...original];  // Spread operator
let copy3 = Array.from(original);

// Modify copy shouldn't affect original
copy1[0] = 999;
console.log(original[0]);  // 1 (unchanged)
```

---

## 4. Array Transformation Methods

### Map - Transform each element
```javascript
let numbers = [1, 2, 3, 4];

// Multiply each by 2
let doubled = numbers.map(num => num * 2);
console.log(doubled);  // [2, 4, 6, 8]

// Convert to objects
let items = ["apple", "banana"];
let result = items.map((item, index) => ({
    id: index,
    name: item
}));
// [{id: 0, name: "apple"}, {id: 1, name: "banana"}]

// Keep original unchanged
console.log(numbers);  // [1, 2, 3, 4] (unchanged)
```

### Filter - Select elements
```javascript
let numbers = [1, 2, 3, 4, 5, 6];

// Get even numbers
let evens = numbers.filter(num => num % 2 === 0);
console.log(evens);  // [2, 4, 6]

// Get numbers greater than 3
let gt3 = numbers.filter(num => num > 3);
console.log(gt3);  // [4, 5, 6]

// Remove falsy values
let mixed = [0, 1, false, 2, "", 3, null];
let truthy = mixed.filter(Boolean);
console.log(truthy);  // [1, 2, 3]
```

### Reduce - Combine into single value
```javascript
let numbers = [1, 2, 3, 4];

// Sum all elements
let sum = numbers.reduce((acc, num) => acc + num, 0);
console.log(sum);  // 10

// Without initial value (uses first element)
let sum2 = numbers.reduce((acc, num) => acc + num);
console.log(sum2);  // 10

// Multiply all elements
let product = numbers.reduce((acc, num) => acc * num, 1);
console.log(product);  // 24

// Count occurrences
let items = ["a", "b", "a", "c", "a", "b"];
let counts = items.reduce((acc, item) => {
    acc[item] = (acc[item] || 0) + 1;
    return acc;
}, {});
// {a: 3, b: 2, c: 1}
```

---

## 5. Array Search Methods

### Find - Get first matching element
```javascript
let users = [
    { id: 1, name: "John" },
    { id: 2, name: "Jane" },
    { id: 3, name: "Bob" }
];

let user = users.find(u => u.name === "Jane");
console.log(user);  // {id: 2, name: "Jane"}

let notFound = users.find(u => u.name === "Alice");
console.log(notFound);  // undefined
```

### FindIndex - Get index of match
```javascript
let arr = [5, 12, 8, 130, 44];

let index = arr.findIndex(x => x > 100);
console.log(index);  // 3 (130 is at index 3)

let noMatch = arr.findIndex(x => x > 200);
console.log(noMatch);  // -1 (not found)
```

### Includes - Check if exists
```javascript
let arr = ["apple", "banana", "orange"];

console.log(arr.includes("banana"));  // true
console.log(arr.includes("grape"));   // false

// Works with any type
console.log([1, 2, 3].includes(2));   // true
console.log([null, undefined].includes(null));  // true
```

### IndexOf - Get position
```javascript
let arr = ["a", "b", "c", "b"];

console.log(arr.indexOf("b"));    // 1 (first occurrence)
console.log(arr.lastIndexOf("b")); // 3 (last occurrence)
console.log(arr.indexOf("z"));    // -1 (not found)
```

---

## 6. Array Ordering

### Sort - Arrange elements
```javascript
let numbers = [3, 1, 4, 1, 5];
numbers.sort();
console.log(numbers);  // [1, 1, 3, 4, 5]

// GOTCHA: Sorts as strings!
let mixed = [10, 2, 30, 1];
mixed.sort();
console.log(mixed);  // [1, 10, 2, 30] (string sort!)

// Correct numeric sort
mixed.sort((a, b) => a - b);
console.log(mixed);  // [1, 2, 10, 30]

// Sort descending
mixed.sort((a, b) => b - a);
console.log(mixed);  // [30, 10, 2, 1]

// Sort objects by property
let users = [
    { name: "John", age: 25 },
    { name: "Jane", age: 20 },
    { name: "Bob", age: 30 }
];
users.sort((a, b) => a.age - b.age);
// Sorted by age: Jane(20), John(25), Bob(30)
```

### Reverse - Reverse order
```javascript
let arr = [1, 2, 3, 4];
arr.reverse();
console.log(arr);  // [4, 3, 2, 1]

let str = "hello";
let reversed = str.split("").reverse().join("");
console.log(reversed);  // "olleh"
```

---

## 7. Array Combination

### Concat - Combine arrays
```javascript
let arr1 = [1, 2];
let arr2 = [3, 4];
let arr3 = [5, 6];

let combined = arr1.concat(arr2, arr3);
console.log(combined);  // [1, 2, 3, 4, 5, 6]

// Original arrays unchanged
console.log(arr1);  // [1, 2]

// Can add elements
let mixed = arr1.concat(arr2, 7, [8, 9]);
console.log(mixed);  // [1, 2, 3, 4, 7, 8, 9]
```

### Spread Operator
```javascript
let arr1 = [1, 2];
let arr2 = [3, 4];

// Combine
let combined = [...arr1, ...arr2];
console.log(combined);  // [1, 2, 3, 4]

// Add elements
let all = [0, ...arr1, 2.5, ...arr2, 5];
console.log(all);  // [0, 1, 2, 2.5, 3, 4, 5]
```

---

## 8. Array Iteration

### ForEach - Run function on each element
```javascript
let arr = [1, 2, 3];

arr.forEach(num => {
    console.log(num * 2);
});
// Output: 2, 4, 6

// With index and array
arr.forEach((num, index, array) => {
    console.log(`${index}: ${num}`);
});
// 0: 1
// 1: 2
// 2: 3
```

### Every - Check if all match
```javascript
let arr = [2, 4, 6, 8];

console.log(arr.every(num => num % 2 === 0));  // true (all even)
console.log(arr.every(num => num > 5));        // false
```

### Some - Check if any match
```javascript
let arr = [2, 4, 7, 8];

console.log(arr.some(num => num % 2 !== 0));   // true (7 is odd)
console.log(arr.some(num => num > 10));        // false
```

---

## 9. Multi-dimensional Arrays

### 2D Arrays (Arrays of Arrays)
```javascript
let matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
];

console.log(matrix[0][0]);  // 1
console.log(matrix[1][2]);  // 6
console.log(matrix[2][1]);  // 8
```

### Flatten Array
```javascript
let nested = [1, [2, 3], [4, [5, 6]]];

// Shallow flatten (one level)
let flat1 = nested.flat();
console.log(flat1);  // [1, 2, 3, 4, [5, 6]]

// Deep flatten (all levels)
let flatDeep = nested.flat(Infinity);
console.log(flatDeep);  // [1, 2, 3, 4, 5, 6]
```

---

## Exercises

### Exercise 1: Array Manipulation
```javascript
let nums = [1, 2, 3, 4, 5];

// 1. Double each number
// 2. Filter to get only numbers > 5
// 3. Sum all numbers
// 4. Find if any number is 3

// Your code
```

**Solution:**
```javascript
let nums = [1, 2, 3, 4, 5];

let doubled = nums.map(n => n * 2);
let gt5 = nums.filter(n => n > 5);
let sum = nums.reduce((acc, n) => acc + n, 0);
let hasThree = nums.includes(3);

console.log(doubled);  // [2, 4, 6, 8, 10]
console.log(gt5);      // [] (empty, no nums > 5)
console.log(sum);      // 15
console.log(hasThree); // true
```

### Exercise 2: Grade Calculator
```javascript
let scores = [85, 92, 78, 95, 88];

// Return object with:
// - average: average score
// - highest: highest score
// - lowestPassing: lowest score >= 80

function gradeStats(scores) {
    // Your code
}
```

**Solution:**
```javascript
function gradeStats(scores) {
    return {
        average: scores.reduce((a, b) => a + b, 0) / scores.length,
        highest: Math.max(...scores),
        lowestPassing: scores.filter(s => s >= 80).sort()[0]
    };
}

console.log(gradeStats([85, 92, 78, 95, 88]));
// {average: 87.6, highest: 95, lowestPassing: 85}
```

### Exercise 3: Unique Elements
```javascript
// Remove duplicates from array

function unique(arr) {
    // Your code
}

console.log(unique([1, 2, 2, 3, 3, 3, 4])); // [1, 2, 3, 4]
```

**Solution:**
```javascript
function unique(arr) {
    return [...new Set(arr)];  // Set removes duplicates
}

// Or using filter
function unique2(arr) {
    return arr.filter((v, i, a) => a.indexOf(v) === i);
}
```

---

## Interview Questions

### Theoretical Questions

**Q1: What's the difference between map and forEach?**
A: `map` returns new array with transformed elements, `forEach` doesn't return anything. Use map when you need new array, forEach for side effects.

**Q2: What does reduce do?**
A: Reduces array to single value by applying function to accumulator and each element. Useful for sums, products, grouping, etc.

**Q3: Can I modify array while iterating?**
A: Dangerous with forEach/map. Changes can skip/repeat elements. Use filter/map to create new array instead.

**Q4: How is sort different from other array methods?**
A: Sort mutates original array and treats elements as strings by default (need comparator for numbers).

**Q5: What's the difference between includes and indexOf?**
A: `includes` returns boolean, `indexOf` returns position (-1 if not found). Use includes for existence check.

---

## Code-Based Interview Questions

**Q1: What will be output?**
```javascript
let arr = [1, 2, 3];
let result = arr.map(x => x * 2);
console.log(arr);     // ?
console.log(result);  // ?
```
A:
```
[1, 2, 3]  (original unchanged)
[2, 4, 6]  (new array)
```

**Q2: Predict output:**
```javascript
let arr = [1, 2, 3, 4, 5];
let result = arr.filter(x => x > 3).map(x => x * 2);
console.log(result);  // ?
```
A:
```
[8, 10]
```
Explanation: filter gets [4, 5], map transforms to [8, 10]

**Q3: What will be logged?**
```javascript
console.log([1, 2, 10, 20].sort());  // ?
```
A:
```
[1, 10, 2, 20]
```
Explanation: Default string sort, "10" < "2" lexicographically

**Q4: Spot the error:**
```javascript
let arr = [1, 2, 3];
arr.forEach(x => arr.push(x * 10));
```
A: Infinite loop! Pushing to array while iterating causes infinite additions.

**Q5: What is the output?**
```javascript
let arr = [1, 2, 3];
let sum = arr.reduce((a, b) => a + b);
console.log(sum);  // ?
```
A:
```
6
```

---

## Follow-up Questions & Confusing Concepts

**Q: Why does sort treat numbers as strings?**
A: For consistency - sort works on any type. Always use custom comparator for numbers: `(a, b) => a - b`.

**Q: Can I break out of map/forEach?**
A: No. Use regular for loop or find() if you need to exit early.

**Q: What's the difference between slice and splice?**
A: `slice(start, end)` doesn't modify original, `splice(start, deleteCount)` does modify. Never use splice in iterations.

**Q: Is array.length accurate for sparse arrays?**
A: Technically yes, but sparse arrays can have confusing behavior with empty slots.

---

## Summary

- **Creation**: `[]` or `new Array()`
- **Mutation**: `push`, `pop`, `shift`, `unshift`, `splice`
- **Transform**: `map`, `filter`, `reduce`
- **Search**: `find`, `includes`, `indexOf`
- **Sort/Reverse**: Remember sort is by string by default
- **Combine**: `concat` or spread `...`
- **Iterate**: `forEach`, `for...of`, `map`
- **Flatten**: `flat()` for nested arrays

**Next Step:** Learn about objects and key-value data structures!
