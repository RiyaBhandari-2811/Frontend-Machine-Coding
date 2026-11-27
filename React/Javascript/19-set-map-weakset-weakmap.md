# Set, Map, WeakSet & WeakMap

## Table of Contents
1. Set Data Structure
2. Set Methods and Properties
3. Set Use Cases
4. Map Data Structure
5. Map Methods and Properties
6. Map vs Object
7. WeakSet
8. WeakMap
9. Advanced Patterns

---

## 1. Set Data Structure

### What is a Set?
- **Set**: Collection of unique values
- No duplicates allowed
- Any data type (objects, functions, etc.)
- Maintains insertion order
- Not indexed

### Creating Sets
```javascript
// Create empty set
let set1 = new Set();

// Create with initial values
let set2 = new Set([1, 2, 3]);
console.log(set2);  // Set(3) { 1, 2, 3 }

// From string (each character is element)
let set3 = new Set('hello');
console.log(set3);  // Set(4) { 'h', 'e', 'l', 'o' } - duplicates removed!

// From array with duplicates
let arr = [1, 2, 2, 3, 3, 3];
let set4 = new Set(arr);
console.log(set4);  // Set(3) { 1, 2, 3 } - duplicates removed
```

### Adding and Removing
```javascript
let set = new Set();

// Add element
set.add(1);
set.add(2);
set.add(3);
console.log(set);  // Set(3) { 1, 2, 3 }

// Add returns set (chainable)
set.add(4).add(5).add(6);
console.log(set);  // Set(6) { 1, 2, 3, 4, 5, 6 }

// Delete element
set.delete(3);
console.log(set);  // Set(5) { 1, 2, 4, 5, 6 }

// Clear all elements
set.clear();
console.log(set);  // Set(0) {}
```

---

## 2. Set Methods and Properties

### has() - Check if Contains
```javascript
let set = new Set([1, 2, 3]);

console.log(set.has(1));  // true
console.log(set.has(5));  // false

// Useful for validation
if (set.has('admin')) {
    // User is admin
}
```

### size - Get Count
```javascript
let set = new Set([1, 2, 3, 4, 5]);

console.log(set.size);  // 5

// Update and check
set.add(6);
console.log(set.size);  // 6

set.delete(1);
console.log(set.size);  // 5
```

### Iterating Sets
```javascript
let set = new Set(['a', 'b', 'c']);

// for...of loop
for (let value of set) {
    console.log(value);
}
// a, b, c

// forEach with callback
set.forEach((value, index, theSet) => {
    console.log(value);  // Index same as value for Set
});

// Convert to array
let arr = Array.from(set);  // or [...set]
console.log(arr);  // ['a', 'b', 'c']
```

### Set Methods
```javascript
let set1 = new Set([1, 2, 3]);
let set2 = new Set([2, 3, 4]);

// Union (combine both)
let union = new Set([...set1, ...set2]);
console.log(union);  // Set(4) { 1, 2, 3, 4 }

// Intersection (common elements)
let intersection = new Set([...set1].filter(x => set2.has(x)));
console.log(intersection);  // Set(2) { 2, 3 }

// Difference (in set1 but not set2)
let difference = new Set([...set1].filter(x => !set2.has(x)));
console.log(difference);  // Set(1) { 1 }
```

---

## 3. Set Use Cases

### Remove Duplicates
```javascript
// Without set
let arr = [1, 2, 2, 3, 3, 3];
let unique = [];
for (let item of arr) {
    if (!unique.includes(item)) {
        unique.push(item);
    }
}
console.log(unique);  // [1, 2, 3]

// With set (clean!)
let unique2 = Array.from(new Set(arr));
console.log(unique2);  // [1, 2, 3]

// Or with spread
let unique3 = [...new Set(arr)];
console.log(unique3);  // [1, 2, 3]
```

### Track Visited
```javascript
// Keep track of visited nodes in graph
let visited = new Set();

function traverse(node) {
    if (visited.has(node.id)) return;  // Already visited
    
    visited.add(node.id);
    console.log(node);
    
    for (let child of node.children) {
        traverse(child);
    }
}
```

### Filter by Unique Values
```javascript
let users = [
    { id: 1, name: 'John' },
    { id: 2, name: 'Alice' },
    { id: 1, name: 'John' }  // Duplicate
];

// Get unique IDs
let uniqueIds = [...new Set(users.map(u => u.id))];
console.log(uniqueIds);  // [1, 2]
```

---

## 4. Map Data Structure

### What is a Map?
- **Map**: Key-value pairs (like objects)
- Keys can be ANY type (objects, functions, etc.)
- Maintains insertion order
- Has built-in methods for common operations
- Better performance for frequent changes

### Creating Maps
```javascript
// Empty map
let map1 = new Map();

// With initial entries
let map2 = new Map([
    ['name', 'John'],
    ['age', 25],
    ['email', 'john@example.com']
]);

console.log(map2);
// Map(3) { 'name' => 'John', 'age' => 25, 'email' => 'john@example.com' }

// Keys can be objects
let key1 = { id: 1 };
let key2 = { id: 2 };
let map3 = new Map([
    [key1, 'value1'],
    [key2, 'value2']
]);
```

### Setting and Getting
```javascript
let map = new Map();

// Set values
map.set('name', 'John');
map.set('age', 25);
map.set(1, 'one');

// Get values
console.log(map.get('name'));  // 'John'
console.log(map.get('age'));   // 25
console.log(map.get(1));       // 'one'
console.log(map.get('missing')); // undefined

// Set is chainable
map.set('city', 'NYC')
   .set('country', 'USA');
```

### Deleting
```javascript
let map = new Map([
    ['a', 1],
    ['b', 2],
    ['c', 3]
]);

console.log(map.size);  // 3

map.delete('b');
console.log(map.size);  // 2
console.log(map.has('b')); // false

map.clear();
console.log(map.size);  // 0
```

---

## 5. Map Methods and Properties

### has() - Check if Key Exists
```javascript
let map = new Map([
    ['name', 'John'],
    ['age', 25]
]);

console.log(map.has('name'));      // true
console.log(map.has('missing'));   // false
```

### size - Get Number of Entries
```javascript
let map = new Map([
    ['a', 1],
    ['b', 2],
    ['c', 3]
]);

console.log(map.size);  // 3
```

### Iterating Maps
```javascript
let map = new Map([
    ['name', 'John'],
    ['age', 25],
    ['email', 'john@example.com']
]);

// for...of on entries
for (let [key, value] of map) {
    console.log(key, value);
}

// for...of on keys
for (let key of map.keys()) {
    console.log(key);
}

// for...of on values
for (let value of map.values()) {
    console.log(value);
}

// forEach
map.forEach((value, key) => {
    console.log(key, value);
});

// Get all entries as array
let entries = Array.from(map);
console.log(entries);
// [['name', 'John'], ['age', 25], ...]
```

---

## 6. Map vs Object

### Key Differences
```javascript
// Map: Keys can be any type
let map = new Map();
map.set(1, 'one');
map.set('1', 'string one');
map.set(true, 'boolean');
map.set({}, 'object');

console.log(map.size);  // 4 (all different keys)

// Object: Keys are strings or symbols
let obj = {};
obj[1] = 'one';
obj['1'] = 'string one';  // Overwrites obj[1]!
obj[true] = 'boolean';    // Keys become strings

console.log(Object.keys(obj));  // ['1', 'true']
```

### Performance
```javascript
// Map: Optimized for frequent additions/deletions
let map = new Map();
for (let i = 0; i < 1000000; i++) {
    map.set(i, i);
}

// Object: Good for static data
let obj = {};
for (let i = 0; i < 1000000; i++) {
    obj[i] = i;
}

// Map is faster for large datasets with changes
```

### When to Use
```javascript
// Use Map when:
// - Keys aren't strings/symbols
// - Frequently adding/removing entries
// - Need built-in methods
let map = new Map();

// Use Object when:
// - Only string/symbol keys
// - Static data
// - JSON serialization needed
let obj = {};
```

### Converting Between
```javascript
// Object to Map
let obj = { a: 1, b: 2, c: 3 };
let map = new Map(Object.entries(obj));

// Map to Object
let map2 = new Map([['a', 1], ['b', 2]]);
let obj2 = Object.fromEntries(map2);

// Map to JSON
let jsonStr = JSON.stringify(Array.from(map2.entries()));
```

---

## 7. WeakSet

### What is WeakSet?
- **WeakSet**: Set of objects only (not primitives)
- Objects are "weakly" referenced
- If no other references to object, it can be garbage collected
- Not iterable, no size property
- Private data storage

### WeakSet Usage
```javascript
let weakSet = new WeakSet();

let obj1 = { id: 1 };
let obj2 = { id: 2 };

weakSet.add(obj1);
weakSet.add(obj2);

console.log(weakSet.has(obj1));  // true
console.log(weakSet.has(obj2));  // true

weakSet.delete(obj1);
console.log(weakSet.has(obj1));  // false

// Can't iterate
// for (let obj of weakSet) {}  // ✗ Error!
```

### Private Data with WeakSet
```javascript
let privateData = new WeakSet();

class User {
    constructor(name) {
        this.name = name;
        privateData.add(this);  // Mark as private
    }
    
    isPrivate() {
        return privateData.has(this);
    }
}

let user = new User('John');
console.log(user.isPrivate());  // true

// Can't access privateData from outside
```

---

## 8. WeakMap

### What is WeakMap?
- **WeakMap**: Map with object keys only (not iterable)
- Objects are weakly referenced
- Used for private data or caching
- Perfect for associating data with objects

### WeakMap Usage
```javascript
let cache = new WeakMap();

let key = { id: 1 };
let value = 'cached value';

cache.set(key, value);
console.log(cache.get(key));  // 'cached value'
console.log(cache.has(key));  // true

cache.delete(key);
console.log(cache.has(key));  // false

// Can't iterate
// for (let [k, v] of cache) {}  // ✗ Error!
```

### Private Properties with WeakMap
```javascript
// WeakMap for private properties
let privateProperties = new WeakMap();

class BankAccount {
    constructor(owner, balance) {
        this.owner = owner;
        // Private balance
        privateProperties.set(this, { balance });
    }
    
    getBalance() {
        return privateProperties.get(this).balance;
    }
    
    withdraw(amount) {
        let data = privateProperties.get(this);
        data.balance -= amount;
    }
}

let account = new BankAccount('John', 1000);
console.log(account.getBalance());  // 1000
account.withdraw(100);
console.log(account.getBalance());  // 900

console.log(account.balance);  // undefined (private!)
```

---

## 9. Advanced Patterns

### Cache with WeakMap
```javascript
// Expensive computation with caching
let cache = new WeakMap();

function expensiveComputation(obj) {
    if (cache.has(obj)) {
        console.log('From cache');
        return cache.get(obj);
    }
    
    console.log('Computing...');
    let result = obj.value * 2;  // Expensive operation
    cache.set(obj, result);
    return result;
}

let obj = { value: 5 };
expensiveComputation(obj);  // Computing... returns 10
expensiveComputation(obj);  // From cache, returns 10

// When obj is garbage collected, cache entry removed automatically
```

### Map as Counter
```javascript
// Count occurrences
let counts = new Map();

let items = ['a', 'b', 'a', 'c', 'b', 'a'];

for (let item of items) {
    counts.set(item, (counts.get(item) || 0) + 1);
}

console.log(counts);  // Map { 'a' => 3, 'b' => 2, 'c' => 1 }
```

---

## Exercises

### Exercise 1: Remove Duplicates
```javascript
// Use Set to remove duplicates from array
let arr = [1, 2, 2, 3, 3, 3, 4, 4, 4, 4];

// Your code

console.log(result);  // [1, 2, 3, 4]
```

**Solution:**
```javascript
let result = [...new Set(arr)];
// or
let result = Array.from(new Set(arr));
```

### Exercise 2: Map Counter
```javascript
// Count word frequency using Map
let text = 'the quick brown fox jumps over the lazy dog';
let words = text.split(' ');

// Your code

// Map should have: 'the' => 2, 'quick' => 1, etc
```

**Solution:**
```javascript
let freq = new Map();
for (let word of words) {
    freq.set(word, (freq.get(word) || 0) + 1);
}
```

### Exercise 3: Private Data
```javascript
// Use WeakMap for private data
class User {
    constructor(name, password) {
        this.name = name;
        // Password should be private
    }
}

// Your code
```

**Solution:**
```javascript
let privateData = new WeakMap();

class User {
    constructor(name, password) {
        this.name = name;
        privateData.set(this, { password });
    }
    
    checkPassword(pwd) {
        return privateData.get(this).password === pwd;
    }
}
```

---

## Interview Questions

### Theoretical Questions

**Q1: What's the difference between Set and Array?**
A: Set has unique values only, optimized for membership checking. Array allows duplicates, optimized for indexing.

**Q2: When would I use Map instead of Object?**
A: Map when keys aren't strings, need frequent changes, or want built-in methods. Object for static string keys.

**Q3: What's the difference between WeakSet and Set?**
A: WeakSet stores objects weakly (can be garbage collected), not iterable, no size. Set stores any type, iterable.

**Q4: Why use WeakMap for private data?**
A: Prevents memory leaks, automatically cleans up when object is deleted, true privacy.

**Q5: Can Set have duplicate values?**
A: No, Set automatically removes duplicates. That's its main purpose.

---

## Code-Based Interview Questions

**Q1: What will be output?**
```javascript
let set = new Set([1, 1, 2, 2, 3, 3]);
console.log(set.size);  // ?
```
A:
```
3
```

**Q2: Predict:**
```javascript
let map = new Map([['a', 1], ['b', 2]]);
console.log(map.get('a'));  // ?
```
A:
```
1
```

**Q3: What will be logged?**
```javascript
let arr = [1, 2, 2, 3, 3, 3];
let set = new Set(arr);
console.log([...set]);  // ?
```
A:
```
[1, 2, 3]
```

**Q4: Spot the issue:**
```javascript
let weakSet = new WeakSet();
weakSet.add('string');  // ✗ Error! WeakSet only stores objects
```
A: WeakSet only accepts objects, not primitives.

**Q5: What is output?**
```javascript
let map = new Map();
map.set('a', 1).set('b', 2).set('c', 3);
console.log(map.size);  // ?
```
A:
```
3
```

---

## Follow-up Questions & Confusing Concepts

**Q: Can I iterate WeakSet or WeakMap?**
A: No, they're not iterable. By design, to prevent interference with garbage collection.

**Q: What happens when object in WeakMap is deleted?**
A: Entry is automatically removed by garbage collector. No memory leak.

**Q: Can Set store objects?**
A: Yes, but different object instances are different values: new Set([{}, {}]).size = 2

**Q: When would I use Set vs Array.includes()?**
A: Set for large collections or frequent lookups (O(1) vs O(n)).

---

## Summary

- **Set**: Unique values, any type, optimized for membership
- **Map**: Key-value pairs, any key type, better than Object for many cases
- **WeakSet**: Objects only, automatically garbage collected
- **WeakMap**: Object keys only, used for private data
- **Duplicate removal**: Use Set with spread operator
- **Iteration**: For...of works with Set/Map, not WeakSet/WeakMap
- **Performance**: Set/Map faster than array/object for size operations
- **Private data**: Use WeakMap to associate data with objects safely
- **Converting**: Use Array.from(), Object.entries(), Object.fromEntries()
- **Memory**: WeakSet/WeakMap for data that shouldn't prevent garbage collection

**Next Step:** Master advanced JavaScript patterns and best practices!
