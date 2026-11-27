# Objects in JavaScript

## Table of Contents
1. Object Basics & Creation
2. Object Properties
3. Object Methods
4. Accessing Nested Objects
5. Object Iteration
6. Object Destructuring
7. Spread Operator with Objects
8. JSON (JavaScript Object Notation)
9. Object Methods (Object.keys, Object.values, etc.)

---

## 1. Object Basics & Creation

### What is an Object?
- **Object**: Unordered collection of key-value pairs
- Keys (properties) are strings or symbols
- Values can be any data type
- Mutable - properties can be added/modified/deleted

### Creating Objects

#### Object Literal (Preferred)
```javascript
let person = {
    name: "John",
    age: 25,
    city: "New York",
    isStudent: false
};

console.log(person);
// { name: "John", age: 25, city: "New York", isStudent: false }
```

#### Object Constructor
```javascript
let obj = new Object();
obj.name = "John";
obj.age = 25;

console.log(obj);  // { name: "John", age: 25 }
```

#### Empty Object
```javascript
let empty1 = {};
let empty2 = new Object();

console.log(empty1);  // {}
console.log(empty2);  // {}
```

---

## 2. Object Properties

### Accessing Properties

#### Dot Notation (Preferred)
```javascript
let person = {
    name: "John",
    age: 25,
    email: "john@example.com"
};

console.log(person.name);   // "John"
console.log(person.age);    // 25
console.log(person.email);  // "john@example.com"
```

#### Bracket Notation
```javascript
let person = {
    name: "John",
    age: 25,
    "phone number": "123-456-7890"  // Key with space
};

console.log(person["name"]);           // "John"
console.log(person["age"]);            // 25
console.log(person["phone number"]);   // "123-456-7890"
```

#### Dynamic Property Access
```javascript
let person = { name: "John", age: 25, city: "NYC" };
let key = "age";

console.log(person[key]);     // 25 (key is variable)
console.log(person.key);      // undefined (looks for literal key "key")

// Useful for dynamic key access
function getProperty(obj, prop) {
    return obj[prop];
}
console.log(getProperty(person, "name"));  // "John"
```

### Adding/Modifying Properties
```javascript
let person = { name: "John" };

// Add new property
person.age = 25;
person["city"] = "New York";
console.log(person);
// { name: "John", age: 25, city: "New York" }

// Modify existing
person.name = "Jane";
console.log(person.name);  // "Jane"

// Add property with dynamic key
let key = "email";
person[key] = "jane@example.com";
console.log(person.email);  // "jane@example.com"
```

### Deleting Properties
```javascript
let person = {
    name: "John",
    age: 25,
    city: "NYC"
};

delete person.age;
console.log(person);  // { name: "John", city: "NYC" }

console.log(person.age);  // undefined
```

### Checking if Property Exists
```javascript
let person = { name: "John", age: 25 };

console.log("name" in person);      // true
console.log("email" in person);     // false
console.log(person.hasOwnProperty("name"));  // true
console.log(person.hasOwnProperty("toString")); // false
```

---

## 3. Object Methods

### Defining Methods
```javascript
let person = {
    name: "John",
    age: 25,
    
    // Method 1: Function declaration
    greet: function() {
        return `Hello, I'm ${this.name}`;
    },
    
    // Method 2: Shorthand (ES6)
    sayAge() {
        return `I'm ${this.age} years old`;
    },
    
    // Method 3: Arrow function (this doesn't work correctly)
    test: () => {
        return this;  // 'this' refers to global scope
    }
};

console.log(person.greet());     // "Hello, I'm John"
console.log(person.sayAge());    // "I'm 25 years old"
```

### This Keyword
```javascript
let car = {
    brand: "Toyota",
    model: "Camry",
    
    info() {
        return `${this.brand} ${this.model}`;
    },
    
    describe() {
        return `My car is a ${this.brand}`;
    }
};

console.log(car.info());      // "Toyota Camry"
console.log(car.describe());  // "My car is a Toyota"

// 'this' refers to the object calling the method
let getCar = car.info;
console.log(getCar());        // undefined undefined (this is global)
```

---

## 4. Accessing Nested Objects

### Nested Structure
```javascript
let company = {
    name: "TechCorp",
    location: {
        city: "San Francisco",
        country: "USA",
        address: {
            street: "123 Main St",
            zipcode: "94105"
        }
    },
    employees: [
        { name: "John", role: "Developer" },
        { name: "Jane", role: "Designer" }
    ]
};

// Accessing nested properties
console.log(company.location.city);              // "San Francisco"
console.log(company.location.address.street);    // "123 Main St"
console.log(company.employees[0].name);          // "John"
console.log(company.employees[1].role);          // "Designer"
```

### Optional Chaining (ES2020)
```javascript
let user = {
    profile: {
        name: "John"
    }
};

// Without optional chaining - error if profile doesn't exist
console.log(user.profile.name);  // "John"
console.log(user.settings.theme); // Error!

// With optional chaining - returns undefined safely
console.log(user?.profile?.name);  // "John"
console.log(user?.settings?.theme);  // undefined (no error!)
```

---

## 5. Object Iteration

### For...In Loop
```javascript
let person = {
    name: "John",
    age: 25,
    city: "NYC"
};

for (let key in person) {
    console.log(key + ": " + person[key]);
}
// Output:
// name: John
// age: 25
// city: NYC
```

### Object.keys()
```javascript
let person = {
    name: "John",
    age: 25,
    city: "NYC"
};

let keys = Object.keys(person);
console.log(keys);  // ["name", "age", "city"]

// Loop through keys
keys.forEach(key => {
    console.log(key + ": " + person[key]);
});
```

### Object.values()
```javascript
let person = {
    name: "John",
    age: 25,
    city: "NYC"
};

let values = Object.values(person);
console.log(values);  // ["John", 25, "NYC"]
```

### Object.entries()
```javascript
let person = {
    name: "John",
    age: 25,
    city: "NYC"
};

let entries = Object.entries(person);
console.log(entries);
// [["name", "John"], ["age", 25], ["city", "NYC"]]

// Loop with destructuring
entries.forEach(([key, value]) => {
    console.log(key + ": " + value);
});
```

---

## 6. Object Destructuring (ES6)

### Basic Destructuring
```javascript
let person = {
    name: "John",
    age: 25,
    city: "NYC"
};

// Extract properties into variables
const { name, age } = person;
console.log(name);  // "John"
console.log(age);   // 25

// Rename during destructuring
const { name: personName, age: personAge } = person;
console.log(personName);  // "John"
```

### Default Values
```javascript
let person = { name: "John" };

const { name, age = 20, city = "NYC" } = person;
console.log(name);   // "John"
console.log(age);    // 20 (default)
console.log(city);   // "NYC" (default)
```

### Nested Destructuring
```javascript
let company = {
    name: "TechCorp",
    location: {
        city: "SF",
        country: "USA"
    }
};

const { name, location: { city, country } } = company;
console.log(name);     // "TechCorp"
console.log(city);     // "SF"
console.log(country);  // "USA"
```

---

## 7. Spread Operator with Objects (ES2018)

### Copy Objects
```javascript
let original = { name: "John", age: 25 };

// Shallow copy
let copy = { ...original };
copy.name = "Jane";

console.log(original.name);  // "John" (unchanged)
console.log(copy.name);      // "Jane"
```

### Merge Objects
```javascript
let obj1 = { name: "John", age: 25 };
let obj2 = { city: "NYC", country: "USA" };

// Merge two objects
let merged = { ...obj1, ...obj2 };
console.log(merged);
// { name: "John", age: 25, city: "NYC", country: "USA" }

// Merge with override
let updated = { ...obj1, age: 30 };
console.log(updated);  // { name: "John", age: 30 }
```

---

## 8. JSON (JavaScript Object Notation)

### Object to JSON String
```javascript
let person = {
    name: "John",
    age: 25,
    isStudent: true,
    hobbies: ["reading", "gaming"]
};

let json = JSON.stringify(person);
console.log(json);
// {"name":"John","age":25,"isStudent":true,"hobbies":["reading","gaming"]}

// Pretty print with indentation
let prettyJson = JSON.stringify(person, null, 2);
console.log(prettyJson);
/*
{
  "name": "John",
  "age": 25,
  "isStudent": true,
  "hobbies": ["reading", "gaming"]
}
*/
```

### JSON String to Object
```javascript
let jsonString = '{"name":"John","age":25,"city":"NYC"}';

let obj = JSON.parse(jsonString);
console.log(obj);           // { name: "John", age: 25, city: "NYC" }
console.log(obj.name);      // "John"
console.log(obj.age);       // 25

// Invalid JSON throws error
let invalid = '{"name":"John",}';  // Extra comma
JSON.parse(invalid);  // Error: Unexpected token
```

---

## 9. Object Methods

### Object.assign() - Copy/Merge
```javascript
let target = { a: 1 };
let source1 = { b: 2 };
let source2 = { c: 3 };

Object.assign(target, source1, source2);
console.log(target);  // { a: 1, b: 2, c: 3 }
```

### Object.freeze() - Make Immutable
```javascript
let obj = { name: "John", age: 25 };
Object.freeze(obj);

obj.name = "Jane";  // Silently fails (doesn't change)
console.log(obj.name);  // "John"

obj.email = "john@example.com";  // Also fails
console.log(obj.email);  // undefined
```

### Object.seal() - Allow modification, not addition/deletion
```javascript
let obj = { name: "John", age: 25 };
Object.seal(obj);

obj.name = "Jane";   // ✅ Allowed
console.log(obj.name);  // "Jane"

obj.email = "john@example.com";  // ❌ Fails
delete obj.age;  // ❌ Fails
```

---

## Exercises

### Exercise 1: User Profile
```javascript
// Create user object with properties:
// name, email, age, isActive
// Add method to display full profile
// Add method to toggle isActive

let user = {
    // Your code
};

console.log(user.getProfile());
user.toggleActive();
console.log(user.isActive);  // Should toggle
```

**Solution:**
```javascript
let user = {
    name: "John",
    email: "john@example.com",
    age: 25,
    isActive: true,
    
    getProfile() {
        return `${this.name} (${this.email}) - Age ${this.age}`;
    },
    
    toggleActive() {
        this.isActive = !this.isActive;
    }
};

console.log(user.getProfile());  // "John (john@example.com) - Age 25"
user.toggleActive();
console.log(user.isActive);  // false
```

### Exercise 2: Extract and Transform
```javascript
// Given array of users, extract names and create new object
// with format: { [index]: name }

let users = [
    { name: "John", age: 25 },
    { name: "Jane", age: 30 },
    { name: "Bob", age: 28 }
];

function createNameMap(users) {
    // Your code
}

console.log(createNameMap(users));
// { 0: "John", 1: "Jane", 2: "Bob" }
```

**Solution:**
```javascript
function createNameMap(users) {
    let result = {};
    users.forEach((user, index) => {
        result[index] = user.name;
    });
    return result;
}

// Or using reduce
function createNameMap2(users) {
    return users.reduce((acc, user, index) => {
        acc[index] = user.name;
        return acc;
    }, {});
}
```

### Exercise 3: JSON Exercise
```javascript
// Convert object to JSON, modify JSON string, parse back

let data = {
    name: "Project",
    version: "1.0",
    features: ["auth", "api"]
};

function updateVersion(data) {
    // 1. Convert to JSON string
    // 2. Replace version
    // 3. Parse back to object
    // Your code
}

console.log(updateVersion(data));
// Should have version "2.0"
```

**Solution:**
```javascript
function updateVersion(data) {
    let jsonStr = JSON.stringify(data);
    jsonStr = jsonStr.replace('"version":"1.0"', '"version":"2.0"');
    return JSON.parse(jsonStr);
}

// Better approach:
function updateVersion2(data) {
    let newData = JSON.parse(JSON.stringify(data));  // Deep copy
    newData.version = "2.0";
    return newData;
}
```

---

## Interview Questions

### Theoretical Questions

**Q1: What's the difference between dot and bracket notation?**
A: Dot notation for valid identifiers, bracket notation for computed/special keys. Bracket allows variables: `obj[variableKey]`.

**Q2: Why is 'this' important in object methods?**
A: 'this' refers to the object calling the method. Allows methods to access and modify object properties. Arrow functions don't have their own 'this'.

**Q3: What's the difference between for...in and Object.keys()?**
A: for...in iterates inherited properties too, Object.keys() only own properties. Object.keys() preferred for safe iteration.

**Q4: When should I use JSON.stringify vs storing objects?**
A: stringify for storage (databases, files), transmission (APIs), or cloning. Otherwise keep as object for performance.

**Q5: What is optional chaining?**
A: Safely access nested properties without error if intermediate property doesn't exist. `obj?.prop?.nested` returns undefined instead of error.

---

## Code-Based Interview Questions

**Q1: What will be output?**
```javascript
let obj = { a: 1, b: 2 };
let obj2 = obj;
obj2.a = 999;
console.log(obj.a);  // ?
```
A:
```
999
```
Explanation: Both variables reference same object (not copied)

**Q2: Predict output:**
```javascript
let person = {
    name: "John",
    getName: () => {
        return this.name;
    }
};

console.log(person.getName());  // ?
```
A:
```
undefined
```
Explanation: Arrow function doesn't have own 'this', refers to global scope

**Q3: What will be logged?**
```javascript
let obj = { a: 1 };
let keys = Object.keys(obj);
keys.push("b");
console.log(obj.b);  // ?
```
A:
```
undefined
```
Explanation: Modifying keys array doesn't modify object

**Q4: Spot the error:**
```javascript
let json = "{'name':'John'}";
JSON.parse(json);  // Error?
```
A: Error! JSON requires double quotes, not single quotes.

**Q5: What is the output?**
```javascript
let obj = { x: 10 };
let { x, y = 20 } = obj;
console.log(x, y);  // ?
```
A:
```
10 20
```

---

## Follow-up Questions & Confusing Concepts

**Q: Can object keys be numbers?**
A: Keys are always strings or symbols. Numbers get converted to strings: `{1: 'a'}[1]` and `{1: 'a'}['1']` both access same value.

**Q: Why does `for...in` show inherited properties?**
A: Prototypal inheritance (covered later). Use `hasOwnProperty()` to filter.

**Q: What's the difference between shallow and deep copy?**
A: Shallow copy creates new object but references same nested objects. Deep copy creates entirely new nested structure. Use `JSON.parse(JSON.stringify())` for deep copy of simple objects.

**Q: When should I use Object.freeze()?**
A: When you want truly immutable objects. Prevents accidental modifications. Used for constants or configuration objects.

---

## Summary

- **Creation**: Object literal `{}` or constructor
- **Access**: Dot notation (preferred) or bracket notation
- **Methods**: Functions as object properties, use 'this' keyword
- **Nested**: Access with chaining `obj.a.b.c` or optional chaining `obj?.a?.b`
- **Iteration**: for...in, Object.keys(), Object.values(), Object.entries()
- **Destructuring**: Extract properties into variables (ES6)
- **Spread**: Copy/merge objects with `{...obj}`
- **JSON**: stringify/parse for storage and transmission
- **Immutability**: freeze, seal for protection

**Next Step:** Learn about functions and their power!
