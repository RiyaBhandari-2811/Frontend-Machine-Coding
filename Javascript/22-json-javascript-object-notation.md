# JSON - JavaScript Object Notation

## Table of Contents
1. What is JSON?
2. JSON Data Types
3. JSON.stringify()
4. JSON.parse()
5. Working with Nested JSON
6. JSON Validation
7. JSON Transformations
8. Common Patterns
9. Best Practices

---

## 1. What is JSON?

### JSON Basics
- **JSON**: Lightweight data format for data interchange
- Language-independent (used everywhere)
- Text-based (easy to transmit)
- Uses JavaScript object/array syntax
- Stands for JavaScript Object Notation

### Why JSON?
```javascript
// Before JSON: XML was common (verbose)
// <user>
//   <name>John</name>
//   <age>25</age>
// </user>

// JSON: Cleaner and lighter
{
    "name": "John",
    "age": 25
}

// JSON vs JavaScript object:
// JSON: Keys must be strings
{ "name": "John" }

// JavaScript: Keys can be unquoted
{ name: "John" }
```

### JSON Structure
```javascript
// Valid JSON structures:

// 1. Object
{
    "name": "John",
    "age": 25
}

// 2. Array
["apple", "banana", "cherry"]

// 3. Can start with array or object
// Everything else is invalid JSON

// Invalid - string alone
"hello"  // Not valid JSON on its own

// Invalid - number alone
42  // Not valid JSON on its own

// Invalid - undefined
undefined  // Not valid JSON
```

---

## 2. JSON Data Types

### Supported Types
```javascript
{
    "string": "hello",
    "number": 42,
    "integer": 100,
    "decimal": 3.14,
    "boolean": true,
    "null": null,
    "array": [1, 2, 3],
    "object": {
        "nested": "value"
    }
}

// Not supported:
// - undefined
// - Functions
// - Symbols
// - BigInt (needs special handling)
// - Date objects (must convert to string)
// - NaN, Infinity
```

### Type Examples
```javascript
// Strings - must use double quotes
"name"      // ✓
'name'      // ✗ Single quotes not allowed
"name: \"admin\""  // ✓ Escaped quotes

// Numbers - no special notation
42          // ✓
3.14        // ✓
1e2         // ✓ Scientific notation
0x10        // ✗ Hex not allowed
NaN         // ✗ Not allowed
Infinity    // ✗ Not allowed

// Booleans - lowercase only
true        // ✓
false       // ✓
True        // ✗ Not allowed
False       // ✗ Not allowed

// Null
null        // ✓
undefined   // ✗ Not allowed
```

---

## 3. JSON.stringify()

### Basic Stringification
```javascript
// Convert object to JSON string
let user = {
    name: 'John',
    age: 25,
    email: 'john@example.com'
};

let json = JSON.stringify(user);
console.log(json);
// {"name":"John","age":25,"email":"john@example.com"}

// Keys automatically quoted
// No trailing commas
// No undefined values
```

### Formatting Output
```javascript
let user = {
    name: 'John',
    age: 25,
    hobbies: ['reading', 'coding']
};

// No formatting (default)
JSON.stringify(user);
// {"name":"John","age":25,"hobbies":["reading","coding"]}

// With indentation (2 spaces)
JSON.stringify(user, null, 2);
// {
//   "name": "John",
//   "age": 25,
//   "hobbies": [
//     "reading",
//     "coding"
//   ]
// }

// With indentation (4 spaces)
JSON.stringify(user, null, 4);
```

### Replacer Function
```javascript
let user = {
    name: 'John',
    age: 25,
    password: 'secret123'
};

// Skip password field
let json = JSON.stringify(user, (key, value) => {
    if (key === 'password') {
        return undefined;  // Omit password
    }
    return value;
});

console.log(json);  // {"name":"John","age":25}
```

### toJSON Method
```javascript
let user = {
    name: 'John',
    age: 25,
    
    toJSON() {
        return {
            name: this.name,
            age: this.age
            // Don't include sensitive data
        };
    }
};

console.log(JSON.stringify(user));
// {"name":"John","age":25}
```

---

## 4. JSON.parse()

### Basic Parsing
```javascript
// Convert JSON string to object
let json = '{"name":"John","age":25,"email":"john@example.com"}';

let user = JSON.parse(json);
console.log(user.name);   // 'John'
console.log(user.age);    // 25
console.log(user.email);  // 'john@example.com'

// Can access properties
console.log(typeof user);  // 'object'
```

### Parsing Arrays
```javascript
let json = '[1,2,3,4,5]';
let arr = JSON.parse(json);
console.log(arr[0]);  // 1
console.log(arr.length);  // 5

// Array of objects
let json2 = '[{"id":1,"name":"John"},{"id":2,"name":"Jane"}]';
let users = JSON.parse(json2);
console.log(users[0].name);  // 'John'
```

### Reviver Function
```javascript
let json = '{"date":"2023-01-15","amount":100}';

// Without reviver
let obj1 = JSON.parse(json);
console.log(obj1.date);  // '2023-01-15' (string)

// With reviver - convert date string to Date object
let obj2 = JSON.parse(json, (key, value) => {
    if (key === 'date') {
        return new Date(value);
    }
    return value;
});

console.log(obj2.date instanceof Date);  // true
console.log(obj2.date.getFullYear());    // 2023
```

### Error Handling
```javascript
let json = '{"invalid": json}';  // Invalid JSON

try {
    let obj = JSON.parse(json);
} catch (e) {
    console.log('Invalid JSON:', e.message);
}

// Provide default value
function safeJsonParse(json, defaultValue) {
    try {
        return JSON.parse(json);
    } catch (e) {
        return defaultValue;
    }
}

let result = safeJsonParse('invalid', {});
console.log(result);  // {}
```

---

## 5. Working with Nested JSON

### Nested Objects
```javascript
let company = {
    name: 'TechCorp',
    address: {
        street: '123 Main St',
        city: 'NYC',
        country: 'USA'
    },
    employees: [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' }
    ]
};

let json = JSON.stringify(company, null, 2);

// Parse back
let parsed = JSON.parse(json);
console.log(parsed.address.city);           // 'NYC'
console.log(parsed.employees[0].name);      // 'John'
```

### Deeply Nested Data
```javascript
let data = {
    level1: {
        level2: {
            level3: {
                level4: {
                    value: 'deep'
                }
            }
        }
    }
};

let json = JSON.stringify(data);
let restored = JSON.parse(json);
console.log(restored.level1.level2.level3.level4.value);  // 'deep'

// Find deep value with optional chaining
let value = JSON.parse(json)?.level1?.level2?.level3?.level4?.value;
```

---

## 6. JSON Validation

### Valid JSON Checking
```javascript
function isValidJson(str) {
    try {
        JSON.parse(str);
        return true;
    } catch (e) {
        return false;
    }
}

console.log(isValidJson('{"name":"John"}'));      // true
console.log(isValidJson('{name: "John"}'));       // false (unquoted key)
console.log(isValidJson("{'name':'John'}"));      // false (single quotes)
console.log(isValidJson('{"name":"John",}'));     // false (trailing comma)
```

### Schema Validation
```javascript
// Simple schema validation
function validateUser(json) {
    try {
        let user = JSON.parse(json);
        
        if (!user.name || typeof user.name !== 'string') {
            throw new Error('Name must be a string');
        }
        
        if (!Number.isInteger(user.age) || user.age < 0) {
            throw new Error('Age must be a positive integer');
        }
        
        if (!user.email || !user.email.includes('@')) {
            throw new Error('Invalid email');
        }
        
        return { valid: true, user };
    } catch (e) {
        return { valid: false, error: e.message };
    }
}

let result = validateUser('{"name":"John","age":25,"email":"john@example.com"}');
console.log(result.valid);  // true
```

---

## 7. JSON Transformations

### Filter Properties
```javascript
let user = {
    name: 'John',
    age: 25,
    email: 'john@example.com',
    password: 'secret'
};

// Remove password
let safe = JSON.parse(JSON.stringify(user), (key, value) => {
    if (key === 'password') return undefined;
    return value;
});

console.log(safe);  // { name, age, email - no password }
```

### Transform Values
```javascript
let data = {
    name: 'john',
    email: 'JOHN@EXAMPLE.COM',
    age: 25
};

// Normalize values
let normalized = JSON.parse(JSON.stringify(data), (key, value) => {
    if (typeof value === 'string') {
        return value.toLowerCase();
    }
    return value;
});

console.log(normalized);
// { name: 'john', email: 'john@example.com', age: 25 }
```

### Add Computed Properties
```javascript
let products = [
    { name: 'Book', price: 10, quantity: 2 },
    { name: 'Pen', price: 2, quantity: 5 }
];

// Add total for each
let withTotals = JSON.parse(JSON.stringify(products));
withTotals.forEach(p => {
    p.total = p.price * p.quantity;
});

console.log(withTotals[0].total);  // 20
```

---

## 8. Common Patterns

### Clone Object (Deep Copy)
```javascript
let original = {
    name: 'John',
    hobbies: ['reading', 'coding']
};

// Deep clone using JSON (works for simple objects)
let clone = JSON.parse(JSON.stringify(original));

clone.hobbies.push('gaming');
console.log(original.hobbies);  // ['reading', 'coding'] - unchanged!
console.log(clone.hobbies);     // ['reading', 'coding', 'gaming']

// Limitation: Functions and undefined lost
let obj = {
    name: 'John',
    greet() { return 'Hi'; }  // Lost!
};

let cloned = JSON.parse(JSON.stringify(obj));
console.log(cloned.greet);  // undefined
```

### API Request/Response
```javascript
// Send object as JSON
let userData = {
    name: 'John',
    age: 25
};

fetch('/api/users', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
});

// Receive JSON response
fetch('/api/users/1')
    .then(response => response.json())  // Parse JSON
    .then(user => console.log(user.name))
    .catch(error => console.log('Error:', error));
```

### Local Storage Serialization
```javascript
// Store object
let settings = {
    theme: 'dark',
    language: 'en',
    notifications: true
};

localStorage.setItem('settings', JSON.stringify(settings));

// Retrieve and parse
let saved = JSON.parse(localStorage.getItem('settings'));
console.log(saved.theme);  // 'dark'
```

---

## 9. Best Practices

### Date Handling
```javascript
let event = {
    name: 'Conference',
    date: new Date('2023-01-15'),  // Date object
    time: '9:00 AM'
};

// Problem: Date becomes string
console.log(JSON.stringify(event));
// {"name":"Conference","date":"2023-01-15T00:00:00.000Z","time":"9:00 AM"}

// Solution 1: Use replacer
let json = JSON.stringify(event, (key, value) => {
    if (value instanceof Date) {
        return value.toISOString();  // or custom format
    }
    return value;
});

// Solution 2: Store as string
let event2 = {
    name: 'Conference',
    date: '2023-01-15',  // Already a string
    time: '9:00 AM'
};

// When parsing, convert back to Date
let parsed = JSON.parse(json);
parsed.date = new Date(parsed.date);
```

### Large Numbers (BigInt)
```javascript
// BigInt not supported in JSON
let big = {
    id: 12345678901234567890n  // BigInt
};

console.log(JSON.stringify(big));  // Error!

// Solution: Convert to string
let json = JSON.stringify({
    id: big.id.toString()
});

// Parse and convert back
let parsed = JSON.parse(json);
let id = BigInt(parsed.id);
```

### Circular References
```javascript
// Circular reference
let obj = { name: 'John' };
obj.self = obj;  // Points to itself

console.log(JSON.stringify(obj));  // Error: Circular

// Solution: Use replacer to skip
let json = JSON.stringify(obj, (key, value) => {
    if (key === 'self') return undefined;
    return value;
});

console.log(json);  // {"name":"John"}
```

---

## Exercises

### Exercise 1: Convert Object to JSON
```javascript
let person = {
    name: 'Alice',
    age: 30,
    city: 'Boston'
};

// Convert to JSON string
// Your code

console.log(json);  // Should be a string
console.log(typeof json);  // 'string'
```

**Solution:**
```javascript
let json = JSON.stringify(person);
```

### Exercise 2: Parse JSON
```javascript
let json = '{"name":"Bob","score":95}';

// Parse JSON to object
// Your code

console.log(obj.name);   // 'Bob'
console.log(obj.score);  // 95
```

**Solution:**
```javascript
let obj = JSON.parse(json);
```

### Exercise 3: Format JSON
```javascript
let data = {
    users: [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' }
    ]
};

// Convert to formatted JSON (2-space indent)
// Your code
```

**Solution:**
```javascript
let formatted = JSON.stringify(data, null, 2);
```

---

## Interview Questions

### Theoretical Questions

**Q1: What's the difference between JSON and JavaScript objects?**
A: JSON keys must be strings, no functions/undefined. JavaScript objects are more flexible.

**Q2: Can I store Date in JSON?**
A: No, Date becomes ISO string. Must convert manually or use replacer function.

**Q3: What's JSON.stringify used for?**
A: Convert JavaScript objects to JSON strings for storage, transmission, or logging.

**Q4: What's JSON.parse used for?**
A: Convert JSON strings back to JavaScript objects for use in code.

**Q5: What is a replacer function?**
A: Function in stringify to filter/transform values before serialization.

---

## Code-Based Interview Questions

**Q1: What will be output?**
```javascript
let obj = { name: 'John', age: 25 };
let json = JSON.stringify(obj);
console.log(typeof json);  // ?
```
A:
```
"string"
```

**Q2: Predict:**
```javascript
let json = '{"name":"Alice","age":30}';
let obj = JSON.parse(json);
console.log(obj.name);  // ?
```
A:
```
"Alice"
```

**Q3: What will be logged?**
```javascript
let obj = { a: 1, b: undefined };
console.log(JSON.stringify(obj));  // ?
```
A:
```
{"a":1}
```
Explanation: undefined values are omitted

**Q4: Spot the issue:**
```javascript
let invalid = '{"name":"John",}';  // ✗ Trailing comma
JSON.parse(invalid);  // Error!
```
A: JSON doesn't allow trailing commas. Must be valid JSON.

**Q5: What is output?**
```javascript
let obj = { x: 1, y: 2 };
let copy = JSON.parse(JSON.stringify(obj));
copy.x = 999;
console.log(obj.x);  // ?
```
A:
```
1
```

---

## Follow-up Questions & Confusing Concepts

**Q: Can I store functions in JSON?**
A: No, functions are lost. Convert to string or omit with replacer.

**Q: Does JSON support comments?**
A: No, JSON is data format only, no comments allowed.

**Q: What's the difference between JSON and JavaScript object literals?**
A: JSON is a string format with stricter rules. Object literals are code with more features.

**Q: Can JSON handle circular references?**
A: No, will throw error. Use replacer to skip circular properties.

---

## Summary

- **JSON**: Data format for exchanging data
- **stringify()**: Convert object to JSON string
- **parse()**: Convert JSON string to object
- **Data types**: String, number, boolean, null, array, object
- **Not supported**: Functions, undefined, Symbols, BigInt, Dates
- **Replacer**: Filter/transform values during stringify
- **Reviver**: Transform values during parse
- **Deep clone**: Use JSON.stringify + JSON.parse
- **Formatting**: Third parameter in stringify for pretty-printing
- **Validation**: Try parse with try/catch to validate

**Next Step:** Master JavaScript APIs and browser features!
