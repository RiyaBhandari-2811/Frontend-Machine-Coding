# Advanced Array Methods & Static Methods

## Table of Contents
1. Advanced Array Methods
2. Array.from()
3. Array.of()
4. Array.isArray()
5. Array.prototype Methods
6. Performance Considerations
7. Array Transformations
8. Practical Patterns
9. Best Practices

---

## 1. Advanced Array Methods

### flat() - Flatten Arrays
```javascript
// Flatten nested arrays
let arr = [1, 2, [3, 4, [5, 6]]];

// Default depth is 1
console.log(arr.flat());
// [1, 2, 3, 4, [5, 6]]

// Depth 2
console.log(arr.flat(2));
// [1, 2, 3, 4, 5, 6]

// Flatten completely (Infinity)
console.log(arr.flat(Infinity));
// [1, 2, 3, 4, 5, 6]

// Removes holes
let sparse = [1, , 3, , 5];
console.log(sparse.flat());
// [1, 3, 5]
```

### flatMap() - Map Then Flatten
```javascript
// flatMap = map + flat combined
let arr = [1, 2, 3, 4];

// Without flatMap
let mapped = arr.map(x => [x, x * 2]);
// [[1, 2], [2, 4], [3, 6], [4, 8]]

// With flatMap (flattens by 1 level)
let result = arr.flatMap(x => [x, x * 2]);
// [1, 2, 2, 4, 3, 6, 4, 8]

// Practical: Duplicate each element
console.log([1, 2, 3].flatMap(x => [x, x]));
// [1, 1, 2, 2, 3, 3]

// Filter and map combined
console.log([1, 2, 3, 4].flatMap(x => x % 2 === 0 ? [x * 10] : []));
// [20, 40]
```

### find() - Find First Element
```javascript
let users = [
    { id: 1, name: 'John', active: true },
    { id: 2, name: 'Jane', active: false },
    { id: 3, name: 'Bob', active: true }
];

// Find first active user
let active = users.find(user => user.active);
console.log(active);  // { id: 1, name: 'John', active: true }

// Not found returns undefined
let missing = users.find(user => user.id === 999);
console.log(missing);  // undefined

// Find with index
let found = users.find((user, index) => index === 2);
console.log(found);  // { id: 3, name: 'Bob', active: true }
```

### findIndex() - Find Index
```javascript
let arr = [10, 20, 30, 40, 50];

// Find index of first value > 25
let index = arr.findIndex(x => x > 25);
console.log(index);  // 2 (value 30)

// Not found returns -1
let notFound = arr.findIndex(x => x > 100);
console.log(notFound);  // -1

// Works with objects
let users = [
    { id: 1, name: 'John' },
    { id: 2, name: 'Jane' }
];

let idx = users.findIndex(u => u.name === 'Jane');
console.log(idx);  // 1
```

### findLast() & findLastIndex() - From End (ES2023)
```javascript
let arr = [10, 20, 30, 40, 50];

// Find from end
let last = arr.findLast(x => x > 25);
console.log(last);  // 50 (not 30!)

// Find index from end
let idx = arr.findLastIndex(x => x > 25);
console.log(idx);  // 4

// Useful for reverse searches
let events = [
    { time: '10:00', type: 'login' },
    { time: '11:30', type: 'logout' },
    { time: '14:00', type: 'login' }
];

let lastLogin = events.findLast(e => e.type === 'login');
console.log(lastLogin);  // { time: '14:00', type: 'login' }
```

### includes() - Check if Contains
```javascript
let arr = [1, 2, 3, 4, 5];

console.log(arr.includes(3));  // true
console.log(arr.includes(10));  // false

// Works with NaN
let arr2 = [1, 2, NaN, 4];
console.log(arr2.includes(NaN));  // true (different from indexOf!)

// With start index
console.log(arr.includes(3, 3));  // false (search from index 3)
console.log(arr.includes(3, 2));  // true

// String search
console.log('hello'.includes('ll'));  // true
```

### some() & every() - Predicates
```javascript
let nums = [1, 2, 3, 4, 5];

// some() - at least one matches
console.log(nums.some(x => x > 4));  // true
console.log(nums.some(x => x > 10));  // false

// every() - all match
console.log(nums.every(x => x > 0));   // true
console.log(nums.every(x => x > 3));   // false (1, 2 don't match)

// Practical: Validation
let form = {
    name: 'John',
    email: 'john@example.com',
    age: 25
};

function isValidForm(obj) {
    return Object.values(obj).every(val => val !== '' && val !== null);
}

console.log(isValidForm(form));  // true
```

---

## 2. Array.from()

### Convert to Array
```javascript
// From array-like objects
let arrayLike = { 0: 'a', 1: 'b', 2: 'c', length: 3 };
let arr1 = Array.from(arrayLike);
console.log(arr1);  // ['a', 'b', 'c']

// From string
let arr2 = Array.from('hello');
console.log(arr2);  // ['h', 'e', 'l', 'l', 'o']

// From Set
let set = new Set([1, 2, 3]);
let arr3 = Array.from(set);
console.log(arr3);  // [1, 2, 3]

// From Map
let map = new Map([['a', 1], ['b', 2]]);
let arr4 = Array.from(map);
console.log(arr4);  // [['a', 1], ['b', 2]]
```

### With Mapping Function
```javascript
// Convert and transform
let nums = Array.from({ length: 5 }, (_, i) => i + 1);
console.log(nums);  // [1, 2, 3, 4, 5]

// Generate range
function range(start, end) {
    return Array.from({ length: end - start }, (_, i) => start + i);
}

console.log(range(1, 5));  // [1, 2, 3, 4]

// Convert and double
let arr = Array.from([1, 2, 3], x => x * 2);
console.log(arr);  // [2, 4, 6]
```

---

## 3. Array.of()

### Create Array Explicitly
```javascript
// Avoids Array constructor confusion
let arr1 = Array(5);     // Creates sparse array with 5 empty slots
console.log(arr1.length);  // 5
console.log(arr1[0]);      // undefined

// Use Array.of for explicit values
let arr2 = Array.of(5);    // Creates array with single element 5
console.log(arr2.length);  // 1
console.log(arr2[0]);      // 5

// Multiple values
let arr3 = Array.of(1, 2, 3, 4, 5);
console.log(arr3);  // [1, 2, 3, 4, 5]
```

---

## 4. Array.isArray()

### Check if Array
```javascript
console.log(Array.isArray([1, 2, 3]));       // true
console.log(Array.isArray('hello'));         // false
console.log(Array.isArray({ length: 2 }));   // false
console.log(Array.isArray(null));            // false
console.log(Array.isArray(undefined));       // false

// Useful for validation
function processData(data) {
    if (!Array.isArray(data)) {
        data = [data];  // Wrap in array
    }
    
    return data.map(item => item * 2);
}

console.log(processData(5));       // [10]
console.log(processData([1, 2]));  // [2, 4]
```

---

## 5. Array.prototype Methods

### at() - Negative Indexing (ES2022)
```javascript
let arr = [10, 20, 30, 40, 50];

// Positive index
console.log(arr.at(0));   // 10
console.log(arr.at(2));   // 30

// Negative index (from end)
console.log(arr.at(-1));  // 50 (last element)
console.log(arr.at(-2));  // 40 (second from end)

// Practical: Get last element
function getLast(arr) {
    return arr.at(-1);  // Cleaner than arr[arr.length - 1]
}
```

### fill() - Fill Elements
```javascript
let arr = new Array(5);
arr.fill(0);
console.log(arr);  // [0, 0, 0, 0, 0]

// Fill range
let arr2 = [1, 2, 3, 4, 5];
arr2.fill(99, 1, 3);  // Fill indices 1-2 with 99
console.log(arr2);  // [1, 99, 99, 4, 5]

// Create matrix
let matrix = Array(3).fill(null).map(() => Array(3).fill(0));
console.log(matrix);  // 3x3 matrix of zeros
```

### copyWithin() - Copy Within Array
```javascript
let arr = [1, 2, 3, 4, 5];

// Copy indices 0-1 to indices 2-3
arr.copyWithin(2, 0, 2);
console.log(arr);  // [1, 2, 1, 2, 5]

// Rotate array
let rotate = [1, 2, 3, 4, 5];
rotate.copyWithin(0, -2);  // Move last 2 to start
console.log(rotate);  // [4, 5, 3, 4, 5]
```

### keys(), values(), entries()
```javascript
let arr = ['a', 'b', 'c'];

// Keys
console.log([...arr.keys()]);
// [0, 1, 2]

// Values
console.log([...arr.values()]);
// ['a', 'b', 'c']

// Entries (key-value pairs)
console.log([...arr.entries()]);
// [[0, 'a'], [1, 'b'], [2, 'c']]

// Useful for destructuring
for (let [i, v] of arr.entries()) {
    console.log(`${i}: ${v}`);
}
```

---

## 6. Performance Considerations

### Method Comparison
```javascript
let arr = Array.from({ length: 1000000 }, (_, i) => i);

// Map is usually fastest for transformations
arr.map(x => x * 2);

// Find stops early if match found
arr.find(x => x > 999999);  // Stops immediately

// Every stops early if condition fails
arr.every(x => x < 1000000);  // Stops at first failure

// forEach always iterates entire array
arr.forEach(x => console.log(x));  // Slower for early exit

// Use slice to work with subset
arr.slice(0, 10).map(x => x * 2);  // Only 10 iterations
```

### Memory Efficiency
```javascript
// Don't create intermediate arrays if not needed
let arr = [1, 2, 3, 4, 5];

// Creates intermediate array: [2, 4, 6, 8, 10]
let result = arr.map(x => x * 2).filter(x => x > 4);  // [6, 8, 10]

// More efficient with reduce
let result2 = arr.reduce((acc, x) => {
    let doubled = x * 2;
    if (doubled > 4) acc.push(doubled);
    return acc;
}, []);  // [6, 8, 10]
```

---

## 7. Array Transformations

### Group By
```javascript
// Group elements by property
let users = [
    { name: 'John', role: 'admin' },
    { name: 'Jane', role: 'user' },
    { name: 'Bob', role: 'admin' }
];

let grouped = users.reduce((acc, user) => {
    if (!acc[user.role]) acc[user.role] = [];
    acc[user.role].push(user);
    return acc;
}, {});

console.log(grouped);
// {
//   admin: [{name: 'John', ...}, {name: 'Bob', ...}],
//   user: [{name: 'Jane', ...}]
// }

// Or with Object.groupBy (new in some environments)
let grouped2 = Object.groupBy(users, u => u.role);
```

### Partition
```javascript
// Split array into two based on condition
function partition(arr, predicate) {
    return arr.reduce(
        ([pass, fail], item) =>
            predicate(item)
                ? [[...pass, item], fail]
                : [pass, [...fail, item]],
        [[], []]
    );
}

let nums = [1, 2, 3, 4, 5, 6];
let [even, odd] = partition(nums, x => x % 2 === 0);
console.log(even);  // [2, 4, 6]
console.log(odd);   // [1, 3, 5]
```

### Unique
```javascript
// Remove duplicates - multiple approaches
let arr = [1, 2, 2, 3, 3, 3];

// Using Set
let unique1 = [...new Set(arr)];  // [1, 2, 3]

// Using filter
let unique2 = arr.filter((v, i, a) => a.indexOf(v) === i);  // [1, 2, 3]

// Using reduce
let unique3 = arr.reduce((acc, v) => 
    acc.includes(v) ? acc : [...acc, v], []);  // [1, 2, 3]
```

---

## 8. Practical Patterns

### Array Utilities
```javascript
// Shuffle
function shuffle(arr) {
    return arr.sort(() => Math.random() - 0.5);
}

// Chunk
function chunk(arr, size) {
    return Array.from({ length: Math.ceil(arr.length / size) },
        (_, i) => arr.slice(i * size, i * size + size)
    );
}

// Zip (combine arrays)
function zip(...arrays) {
    return Array.from({ length: Math.min(...arrays.map(a => a.length)) },
        (_, i) => arrays.map(a => a[i])
    );
}

// Test
let arr = [1, 2, 3, 4, 5];
console.log(shuffle(arr));      // Randomized
console.log(chunk(arr, 2));     // [[1,2], [3,4], [5]]
console.log(zip([1,2,3], ['a','b','c']));  // [[1,'a'], [2,'b'], [3,'c']]
```

---

## Exercises

### Exercise 1: Flatten Array
```javascript
let nested = [1, [2, [3, 4]], 5];

// Flatten completely
// Your code

console.log(result);  // [1, 2, 3, 4, 5]
```

**Solution:**
```javascript
let result = nested.flat(Infinity);
```

### Exercise 2: Transform with flatMap
```javascript
let arr = [1, 2, 3];

// Use flatMap to duplicate each element
// Your code

console.log(result);  // [1, 1, 2, 2, 3, 3]
```

**Solution:**
```javascript
let result = arr.flatMap(x => [x, x]);
```

### Exercise 3: Array Utilities
```javascript
// Find all numbers > 5 and double them
let nums = [1, 3, 5, 7, 9];

// Your code

console.log(result);  // [12, 14, 18]
```

**Solution:**
```javascript
let result = nums.flatMap(x => x > 5 ? [x * 2] : []);
```

---

## Interview Questions

### Theoretical Questions

**Q1: What's the difference between flat() and flatMap()?**
A: flat() flattens nested arrays. flatMap() maps then flattens one level.

**Q2: When would I use find() vs includes()?**
A: find() gets element (useful for objects). includes() checks existence (boolean).

**Q3: What's the difference between Array.isArray() and typeof?**
A: Array.isArray() correctly identifies arrays. typeof returns 'object' for arrays.

**Q4: Why use Array.of() instead of Array()?**
A: Array() creates sparse array for single number. Array.of() treats numbers as values.

**Q5: What is the performance difference between map/filter vs reduce?**
A: map/filter create intermediate arrays. reduce is more memory efficient.

---

## Code-Based Interview Questions

**Q1: What will be output?**
```javascript
console.log([1, [2, 3]].flat());  // ?
```
A:
```
[1, 2, 3]
```

**Q2: Predict:**
```javascript
console.log([1, 2, 3].flatMap(x => [x, x * 2]));  // ?
```
A:
```
[1, 2, 2, 4, 3, 6]
```

**Q3: What will be logged?**
```javascript
let arr = [1, 2, 3, 4, 5];
console.log(arr.at(-1));  // ?
```
A:
```
5
```

**Q4: Spot the issue:**
```javascript
Array(5);  // Creates array with 5 empty slots
Array.of(5);  // Creates array with element 5
```
A: Different behavior - important distinction!

**Q5: What is output?**
```javascript
console.log(Array.isArray([1, 2, 3]));  // ?
console.log(typeof [1, 2, 3]);  // ?
```
A:
```
true
"object"
```

---

## Follow-up Questions & Confusing Concepts

**Q: Does flat() remove undefined values?**
A: No, only holes from sparse arrays. undefined elements are kept.

**Q: Can I use find() with async functions?**
A: Yes, but it won't wait for promises. Use for...of with await instead.

**Q: Why use Array.from() instead of spread?**
A: Array.from() can take mapping function. More flexible for transformations.

**Q: When does includes() work but indexOf() doesn't?**
A: With NaN - includes(NaN) is true but indexOf(NaN) is -1.

---

## Summary

- **flat()**: Flatten nested arrays (default depth 1)
- **flatMap()**: Map then flatten (depth 1)
- **find()**: Get first matching element
- **findIndex()**: Get index of first match
- **includes()**: Check if array contains value
- **some()**: Any element matches predicate
- **every()**: All elements match predicate
- **Array.from()**: Convert array-like to array
- **Array.of()**: Create array from values
- **Array.isArray()**: Check if value is array
- **at()**: Access elements with negative indices
- **Performance**: Use reduce for efficiency, find for early exit

**Next Step:** Explore advanced JavaScript patterns and best practices!
