# Destructuring & Spread Operator

## Table of Contents
1. Array Destructuring Basics
2. Object Destructuring Basics
3. Destructuring with Defaults
4. Nested Destructuring
5. Rest Parameter
6. Spread Operator Arrays
7. Spread Operator Objects
8. Combined Patterns
9. Advanced Destructuring

---

## 1. Array Destructuring Basics

### Simple Array Destructuring
```javascript
// Without destructuring
let arr = [1, 2, 3];
let first = arr[0];
let second = arr[1];

// With destructuring
let [first, second, third] = [1, 2, 3];
console.log(first);   // 1
console.log(second);  // 2
console.log(third);   // 3

// Skipping elements
let [a, , c] = [1, 2, 3];
console.log(a);  // 1
console.log(c);  // 3
```

### Swapping Values
```javascript
// Without destructuring
let x = 5, y = 10;
let temp = x;
x = y;
y = temp;

// With destructuring (clean!)
let [x, y] = [5, 10];
[x, y] = [y, x];  // Swap in one line
console.log(x);  // 10
console.log(y);  // 5
```

### Extracting from Function Return
```javascript
function getCoordinates() {
    return [10, 20];
}

// Without destructuring
let result = getCoordinates();
let x = result[0];
let y = result[1];

// With destructuring
let [x, y] = getCoordinates();
console.log(x, y);  // 10, 20
```

---

## 2. Object Destructuring Basics

### Simple Object Destructuring
```javascript
// Without destructuring
let person = { name: 'John', age: 30, city: 'NYC' };
let name = person.name;
let age = person.age;

// With destructuring
let { name, age, city } = person;
console.log(name);   // 'John'
console.log(age);    // 30
console.log(city);   // 'NYC'

// Order doesn't matter (unlike arrays)
let { city, name } = person;  // Works fine
```

### Renaming Properties
```javascript
let person = { name: 'John', age: 30 };

// Destructure with new names
let { name: personName, age: personAge } = person;
console.log(personName);  // 'John'
console.log(personAge);   // 30
console.log(name);        // ReferenceError (name doesn't exist)
```

### Partial Destructuring
```javascript
let person = { name: 'John', age: 30, city: 'NYC' };

// Extract only what you need
let { name, age } = person;
console.log(name);  // 'John'
console.log(age);   // 30
// city is not extracted
```

---

## 3. Destructuring with Defaults

### Array with Defaults
```javascript
// Without defaults
let [a, b] = [1];
console.log(a);  // 1
console.log(b);  // undefined

// With defaults
let [x = 10, y = 20] = [1];
console.log(x);  // 1
console.log(y);  // 20 (default used)

// Defaults only used if undefined
let [p = 10, q = 20] = [5, undefined];
console.log(p);  // 5
console.log(q);  // 20
```

### Object with Defaults
```javascript
let person = { name: 'John' };

// Without defaults
let { name, age } = person;
console.log(age);  // undefined

// With defaults
let { name, age = 25 } = person;
console.log(age);  // 25

// Mix - some with defaults, some without
let { name, age = 25, city = 'NYC' } = person;
console.log(city);  // 'NYC'
```

### Function Parameter Defaults
```javascript
// Destructure in function parameters
function displayUser({ name, age = 25 }) {
    console.log(name);
    console.log(age);
}

displayUser({ name: 'John' });
// John
// 25

// With entire object default
function displayUser({ name = 'Unknown', age = 25 } = {}) {
    console.log(name, age);
}

displayUser();  // 'Unknown' 25
displayUser({ name: 'Alice' });  // 'Alice' 25
```

---

## 4. Nested Destructuring

### Nested Arrays
```javascript
let matrix = [
    [1, 2],
    [3, 4],
    [5, 6]
];

// Extract specific values
let [[a, b], [c, d]] = matrix;
console.log(a);  // 1
console.log(b);  // 2
console.log(c);  // 3
console.log(d);  // 4

// Skip values
let [[x], [, y]] = matrix;
console.log(x);  // 1
console.log(y);  // 4
```

### Nested Objects
```javascript
let company = {
    name: 'TechCorp',
    employee: {
        name: 'John',
        address: {
            city: 'NYC',
            zip: '10001'
        }
    }
};

// Deep destructuring
let { employee: { name, address: { city } } } = company;
console.log(name);  // 'John'
console.log(city);  // 'NYC'

// With defaults
let { employee: { name, title = 'Developer' } } = company;
console.log(title);  // 'Developer'
```

### Mixed Nesting
```javascript
let data = {
    users: [
        { name: 'John', age: 30 },
        { name: 'Alice', age: 25 }
    ]
};

// Extract first user's name
let { users: [{ name }] } = data;
console.log(name);  // 'John'
```

---

## 5. Rest Parameter

### Array Rest
```javascript
// Collect remaining elements
let [first, ...rest] = [1, 2, 3, 4, 5];
console.log(first);  // 1
console.log(rest);   // [2, 3, 4, 5]

// Rest must be last
let [a, b, ...c] = [1, 2, 3, 4];
console.log(a);  // 1
console.log(b);  // 2
console.log(c);  // [3, 4]

// Works with skipping
let [x, , ...y] = [1, 2, 3, 4];
console.log(x);  // 1
console.log(y);  // [3, 4]
```

### Object Rest
```javascript
// Collect remaining properties
let { name, ...rest } = { name: 'John', age: 30, city: 'NYC' };
console.log(name);  // 'John'
console.log(rest);  // { age: 30, city: 'NYC' }

// Use in function to separate values
let { status, ...data } = response;
console.log(status);  // 200
console.log(data);    // All other properties
```

### Function Rest Parameters
```javascript
// Accept any number of arguments
function sum(...numbers) {
    return numbers.reduce((a, b) => a + b, 0);
}

console.log(sum(1, 2, 3, 4, 5));  // 15

// Mix regular and rest parameters
function greet(greeting, ...names) {
    console.log(greeting, names.join(' and '));
}

greet('Hello', 'John', 'Alice', 'Bob');
// Hello John and Alice and Bob
```

---

## 6. Spread Operator Arrays

### Copy Array
```javascript
let original = [1, 2, 3];

// Without spread (reference)
let copy1 = original;
copy1[0] = 99;
console.log(original[0]);  // 99 (changed!)

// With spread (true copy)
let copy2 = [...original];
copy2[0] = 99;
console.log(original[0]);  // 1 (unchanged)
```

### Merge Arrays
```javascript
let arr1 = [1, 2];
let arr2 = [3, 4];
let arr3 = [5, 6];

// Merge multiple arrays
let merged = [...arr1, ...arr2, ...arr3];
console.log(merged);  // [1, 2, 3, 4, 5, 6]

// Insert in middle
let result = [1, 2, ...arr1, 3, 4];
console.log(result);  // [1, 2, 1, 2, 3, 4]
```

### Add Elements
```javascript
let arr = [2, 3];

// Add at beginning
let withStart = [1, ...arr];
console.log(withStart);  // [1, 2, 3]

// Add at end
let withEnd = [...arr, 4];
console.log(withEnd);  // [2, 3, 4]

// Add in middle
let withMiddle = [1, ...arr, 4];
console.log(withMiddle);  // [1, 2, 3, 4]
```

### Function Arguments
```javascript
function sum(a, b, c) {
    return a + b + c;
}

let numbers = [1, 2, 3];
console.log(sum(...numbers));  // 6
// Same as: sum(1, 2, 3)

// Works with Math functions
let arr = [5, 6, 2, 8, 1];
console.log(Math.max(...arr));  // 8
console.log(Math.min(...arr));  // 1
```

---

## 7. Spread Operator Objects

### Copy Object
```javascript
let original = { name: 'John', age: 30 };

// Shallow copy
let copy = { ...original };
copy.name = 'Alice';
console.log(original.name);  // 'John' (unchanged)

// But nested objects still reference
let obj = { name: 'John', address: { city: 'NYC' } };
let copy2 = { ...obj };
copy2.address.city = 'LA';
console.log(obj.address.city);  // 'LA' (changed!)
```

### Merge Objects
```javascript
let obj1 = { a: 1, b: 2 };
let obj2 = { c: 3, d: 4 };

let merged = { ...obj1, ...obj2 };
console.log(merged);  // { a: 1, b: 2, c: 3, d: 4 }

// Override properties
let defaults = { a: 1, b: 2, c: 3 };
let custom = { b: 20, d: 40 };
let result = { ...defaults, ...custom };
console.log(result);  // { a: 1, b: 20, c: 3, d: 40 }
```

### Add Properties
```javascript
let user = { name: 'John', age: 30 };

// Add new properties
let userWithEmail = {
    ...user,
    email: 'john@example.com'
};
console.log(userWithEmail);
// { name: 'John', age: 30, email: 'john@example.com' }

// Update property
let updated = {
    ...user,
    age: 31
};
console.log(updated);  // { name: 'John', age: 31 }
```

---

## 8. Combined Patterns

### Destructuring and Spread Together
```javascript
// Separate first element, collect rest
let [first, ...rest] = [1, 2, 3, 4];
let merged = [first, ...rest, 5];
console.log(merged);  // [1, 2, 3, 4, 5]

// Destructure with renaming and spread
let { name, age, ...otherProps } = {
    name: 'John',
    age: 30,
    city: 'NYC',
    country: 'USA'
};
console.log(name);        // 'John'
console.log(otherProps);  // { city: 'NYC', country: 'USA' }
```

### In Function Parameters
```javascript
// Destructure in parameters, use spread elsewhere
function processUser({ name, age }, ...others) {
    console.log('User:', name, age);
    console.log('Others:', others);
}

processUser({ name: 'John', age: 30 }, 'extra1', 'extra2');
// User: John 30
// Others: ['extra1', 'extra2']
```

### Common React Pattern
```javascript
// Destructure props, pass remaining to child
function Component({ children, className, ...rest }) {
    return <div className={className} {...rest}>
        {children}
    </div>;
}

// All remaining props spread onto div
```

---

## 9. Advanced Destructuring

### Conditional Destructuring
```javascript
let response = { status: 200, data: { name: 'John' } };

// Extract conditionally
let { status, data: { name } = {} } = response;
console.log(name);  // 'John'

// If no data, default object used
let response2 = { status: 404 };
let { data: { name: name2 } = {} } = response2;
console.log(name2);  // undefined (safely)
```

### Multiple Assignment
```javascript
// Assign to multiple places
let obj1, obj2;
({ name: obj1, age: obj2 } = { name: 'John', age: 30 });
console.log(obj1);  // 'John'
console.log(obj2);  // 30
```

### Dynamic Keys
```javascript
// Can't destructure with dynamic keys directly
// But can use: for..of with Object.entries
let person = { name: 'John', age: 30 };

for (let [key, value] of Object.entries(person)) {
    console.log(key, value);
}
// name John
// age 30
```

---

## Exercises

### Exercise 1: Array Destructuring
```javascript
// Extract first, second, and rest from array
let arr = [1, 2, 3, 4, 5];

// Your code

console.log(first);   // 1
console.log(second);  // 2
console.log(rest);    // [3, 4, 5]
```

**Solution:**
```javascript
let [first, second, ...rest] = [1, 2, 3, 4, 5];
```

### Exercise 2: Object Destructuring
```javascript
// Extract name and age, rename to fullName
let person = { name: 'John', age: 30, city: 'NYC' };

// Your code

console.log(fullName);  // 'John'
console.log(age);       // 30
```

**Solution:**
```javascript
let { name: fullName, age } = person;
```

### Exercise 3: Spread Operator
```javascript
// Merge two objects, with second overriding first
let obj1 = { a: 1, b: 2, c: 3 };
let obj2 = { b: 20, d: 4 };

// Your code

console.log(merged);  // { a: 1, b: 20, c: 3, d: 4 }
```

**Solution:**
```javascript
let merged = { ...obj1, ...obj2 };
```

---

## Interview Questions

### Theoretical Questions

**Q1: What's the difference between destructuring and accessing properties?**
A: Destructuring creates new variables directly. Property access requires accessing through object/array each time. Destructuring is cleaner.

**Q2: When should I use rest parameter vs spread operator?**
A: Rest in destructuring or function parameters to collect values. Spread to expand values. Opposite purposes.

**Q3: Does spread create deep or shallow copy?**
A: Shallow copy. Nested objects/arrays still reference original.

**Q4: Can I use destructuring in loops?**
A: Yes, with for...of on array or Object.entries().

**Q5: What happens if destructured variable doesn't exist in source?**
A: Undefined, unless default value provided. Defaults only used if undefined.

---

## Code-Based Interview Questions

**Q1: What will be output?**
```javascript
let [a = 10, b = 20] = [5];
console.log(a, b);  // ?
```
A:
```
5 20
```

**Q2: Predict:**
```javascript
let { x, y } = { x: 1, y: 2, z: 3 };
console.log(x, y, z);  // ?
```
A:
```
1 2 undefined
```

**Q3: What will be logged?**
```javascript
let arr = [1, 2, 3];
let [x, ...y] = arr;
console.log(y);  // ?
```
A:
```
[2, 3]
```

**Q4: Spot the issue:**
```javascript
let { name, ...rest, age } = obj;  // ✗ Rest not last!
```
A: Rest parameter must be last in destructuring.

**Q5: What is output?**
```javascript
let obj = { a: 1, b: 2 };
let copy = { ...obj };
copy.a = 99;
console.log(obj.a);  // ?
```
A:
```
1
```
Explanation: Shallow copy, primitive not affected

---

## Follow-up Questions & Confusing Concepts

**Q: Can I destructure from arrays of objects?**
A: Yes, combine array and object destructuring: let [{ name }] = arrayOfObjects

**Q: What if I destructure more than exists?**
A: Get undefined for extras (unless default provided).

**Q: Can spread be used in object literals?**
A: Yes, creates new object with merged properties.

**Q: Why use destructuring over accessing properties?**
A: Cleaner code, less repetition, easier to read, can set defaults.

---

## Summary

- **Array destructuring**: Extract elements by position
- **Object destructuring**: Extract properties by name
- **Defaults**: Provide fallback values for missing values
- **Nested destructuring**: Access deeply nested values
- **Rest (...rest)**: Collect remaining values
- **Spread (...)**: Expand arrays/objects
- **Function parameters**: Destructure in params
- **Swapping**: Easy value swapping with arrays
- **Shallow copy**: Spread copies only first level
- **Merging**: Easily merge arrays and objects

**Next Step:** Learn about advanced JavaScript patterns and ES6 modules!
