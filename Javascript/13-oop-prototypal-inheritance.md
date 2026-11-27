# Prototypal Inheritance & OOP

## Table of Contents
1. Objects and Methods Review
2. Constructor Functions
3. The Prototype Property
4. The Prototype Chain
5. Creating Inheritance
6. Object.create()
7. ES6 Classes
8. Class Inheritance
9. Object Methods

---

## 1. Objects and Methods Review

### Object Methods Basics
```javascript
// Objects contain properties and methods
let user = {
    name: "John",
    age: 25,
    
    // Method
    greet: function() {
        return "Hello, " + this.name;
    }
};

console.log(user.greet());  // "Hello, John"
console.log(user.age);      // 25

// 'this' refers to the object
let student = {
    name: "Alice",
    greet: function() {
        return "Hi, " + this.name;
    }
};

console.log(student.greet());  // "Hi, Alice"
```

### Object Reuse Problem
```javascript
// Without inheritance, repetition
let user1 = {
    name: "John",
    age: 25,
    greet: function() {
        return "Hello, " + this.name;
    }
};

let user2 = {
    name: "Alice",
    age: 30,
    greet: function() {
        return "Hello, " + this.name;
    }
};

// Both have same greet method - wasteful!
// Solution: Constructor functions and prototypes
```

---

## 2. Constructor Functions

### What is a Constructor?
```javascript
// Regular function
function greet(name) {
    return "Hello, " + name;
}

// Constructor function (convention: capitalize)
function User(name, age) {
    this.name = name;
    this.age = age;
}

// Called with 'new' keyword
let user1 = new User("John", 25);
let user2 = new User("Alice", 30);

console.log(user1.name);  // "John"
console.log(user2.age);   // 30

// Without 'new', 'this' refers to global object (bad!)
let user3 = User("Bob", 20);
console.log(user3);  // undefined
```

### Constructor with Methods
```javascript
function User(name, age) {
    this.name = name;
    this.age = age;
    
    // Method in constructor (not ideal - recreated for each instance)
    this.greet = function() {
        return "Hello, " + this.name;
    };
}

let user = new User("John", 25);
console.log(user.greet());  // "Hello, John"

// Problem: Each instance has own greet function
// Wastes memory!
```

---

## 3. The Prototype Property

### Understanding Prototype
```javascript
// Every function has a 'prototype' property
function User(name) {
    this.name = name;
}

console.log(typeof User.prototype);  // "object"
console.log(User.prototype);         // { constructor: User }

// Add method to prototype (shared by all instances)
User.prototype.greet = function() {
    return "Hello, " + this.name;
};

let user1 = new User("John");
let user2 = new User("Alice");

console.log(user1.greet());  // "Hello, John"
console.log(user2.greet());  // "Hello, Alice"

// Both share same greet function - efficient!
```

### Prototype vs Instance Properties
```javascript
function User(name) {
    this.name = name;  // Instance property
}

User.prototype.greet = function() {  // Shared method
    return "Hello, " + this.name;
};

let user = new User("John");

// Instance properties
console.log(user.name);           // "John" (own property)

// Method lookup: finds in prototype
console.log(user.greet);          // function (from prototype)
console.log(user.greet());        // "Hello, John"

// Check where property comes from
console.log(user.hasOwnProperty("name"));     // true (own)
console.log(user.hasOwnProperty("greet"));    // false (prototype)
```

### Adding Properties to Prototype
```javascript
function Animal(name) {
    this.name = name;
}

// Add method 1
Animal.prototype.speak = function() {
    console.log(this.name + " makes sound");
};

// Add method 2
Animal.prototype.move = function() {
    console.log(this.name + " moves");
};

// Or add multiple at once
Object.assign(Animal.prototype, {
    sleep: function() {
        console.log(this.name + " sleeps");
    },
    eat: function() {
        console.log(this.name + " eats");
    }
});

let dog = new Animal("Dog");
dog.speak();  // "Dog makes sound"
dog.move();   // "Dog moves"
dog.sleep();  // "Dog sleeps"
```

---

## 4. The Prototype Chain

### How Prototype Chain Works
```javascript
// When accessing property:
// 1. Check object itself
// 2. Check object's prototype
// 3. Check prototype's prototype
// 4. Continue up chain until found or null

function Animal(name) {
    this.name = name;
}

Animal.prototype.speak = function() {
    console.log(this.name + " speaks");
};

let dog = new Animal("Dog");

// Property lookup
console.log(dog.name);        // Found in dog itself
console.log(dog.speak);       // Not in dog, found in prototype
console.log(dog.toString);    // Not in prototype, found up chain
// (toString is from Object.prototype)
```

### Visualizing Prototype Chain
```javascript
function User(name) {
    this.name = name;
}

User.prototype.greet = function() {
    return "Hello";
};

let user = new User("John");

// user looks like:
// user = {
//   name: "John"
//   [[Prototype]]: User.prototype
// }
//
// User.prototype = {
//   greet: function() {...}
//   constructor: User
//   [[Prototype]]: Object.prototype
// }
//
// Object.prototype = {
//   toString: function() {...}
//   hasOwnProperty: function() {...}
//   [[Prototype]]: null
// }

console.log(user.__proto__);     // User.prototype
console.log(User.prototype.__proto__);  // Object.prototype
console.log(Object.prototype.__proto__);  // null (end of chain)
```

### Finding Origin of Property
```javascript
function Animal(name) {
    this.name = name;
}

Animal.prototype.type = "Animal";

let dog = new Animal("Dog");

// Check if own property
console.log(dog.hasOwnProperty("name"));     // true
console.log(dog.hasOwnProperty("type"));     // false (from prototype)
console.log(dog.hasOwnProperty("toString"));  // false (from Object.prototype)

// Find where property comes from
function findProperty(obj, prop) {
    if (obj.hasOwnProperty(prop)) {
        return "Own property";
    }
    
    for (let proto = Object.getPrototypeOf(obj); proto; proto = Object.getPrototypeOf(proto)) {
        if (proto.hasOwnProperty(prop)) {
            return "In prototype";
        }
    }
    
    return "Not found";
}

console.log(findProperty(dog, "name"));      // "Own property"
console.log(findProperty(dog, "type"));      // "In prototype"
console.log(findProperty(dog, "missing"));   // "Not found"
```

---

## 5. Creating Inheritance

### Inheritance with Prototypes
```javascript
// Parent constructor
function Animal(name) {
    this.name = name;
}

Animal.prototype.speak = function() {
    console.log(this.name + " makes sound");
};

// Child constructor
function Dog(name, breed) {
    // Call parent constructor
    Animal.call(this, name);  // Sets this.name
    this.breed = breed;
}

// Set up inheritance: Dog.prototype inherits from Animal.prototype
Dog.prototype = Object.create(Animal.prototype);

// Important: Restore constructor reference
Dog.prototype.constructor = Dog;

// Add Dog-specific method
Dog.prototype.bark = function() {
    console.log(this.name + " barks!");
};

let dog = new Dog("Rex", "Labrador");

console.log(dog.name);       // "Rex"
console.log(dog.breed);      // "Labrador"
dog.speak();                 // "Rex makes sound"
dog.bark();                  // "Rex barks!"

// Check inheritance
console.log(dog instanceof Dog);     // true
console.log(dog instanceof Animal);  // true
```

### Inheritance Pattern Step by Step
```javascript
// 1. Define parent
function Parent(name) {
    this.name = name;
}

Parent.prototype.greet = function() {
    return "Hello";
};

// 2. Define child
function Child(name, age) {
    Parent.call(this, name);  // Call parent constructor
    this.age = age;
}

// 3. Set up prototype chain
Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor = Child;

// 4. Add child methods
Child.prototype.childMethod = function() {
    return "Child method";
};

let child = new Child("John", 10);
console.log(child.name);           // "John" (from parent)
console.log(child.greet());        // "Hello" (from parent prototype)
console.log(child.childMethod());  // "Child method"
```

---

## 6. Object.create()

### Using Object.create()
```javascript
// Object.create(proto) - creates object with given prototype

let AnimalProto = {
    speak: function() {
        console.log(this.name + " speaks");
    },
    type: "Animal"
};

// Create object with AnimalProto as prototype
let dog = Object.create(AnimalProto);
dog.name = "Rex";

console.log(dog.name);       // "Rex"
console.log(dog.speak());    // "Rex speaks"
console.log(dog.type);       // "Animal" (from prototype)

// Different from just copying
let copied = AnimalProto;    // Just reference
let created = Object.create(AnimalProto);  // New object with proto
```

### Object.create with Properties
```javascript
let proto = {
    greet: function() {
        return "Hello, " + this.name;
    }
};

// Create with property descriptors
let person = Object.create(proto, {
    name: {
        value: "John",
        writable: true,
        enumerable: true
    },
    age: {
        value: 30,
        writable: false,
        enumerable: true
    }
});

console.log(person.name);  // "John"
console.log(person.greet());  // "Hello, John"
person.age = 25;  // Silently fails (not writable)
```

---

## 7. ES6 Classes

### Class Syntax
```javascript
// ES6 class (syntactic sugar for constructor functions)
class User {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    
    greet() {
        return "Hello, " + this.name;
    }
}

let user = new User("John", 25);
console.log(user.name);       // "John"
console.log(user.greet());    // "Hello, John"

// Class is just function
console.log(typeof User);     // "function"
console.log(typeof user);     // "object"
```

### Class Methods vs Properties
```javascript
class Counter {
    constructor(start) {
        this.count = start;    // Instance property
    }
    
    increment() {              // Method in prototype
        this.count++;
        return this.count;
    }
    
    static description() {     // Static method (on class, not instance)
        return "Counter class";
    }
}

let counter = new Counter(0);
console.log(counter.increment());           // 1
console.log(Counter.description());         // "Counter class"
console.log(counter.description);           // undefined (not on instance)
```

### Getters and Setters
```javascript
class User {
    constructor(firstName, lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
    }
    
    // Getter
    get fullName() {
        return this.firstName + " " + this.lastName;
    }
    
    // Setter
    set fullName(name) {
        let parts = name.split(" ");
        this.firstName = parts[0];
        this.lastName = parts[1];
    }
}

let user = new User("John", "Doe");
console.log(user.fullName);     // "John Doe" (uses getter)
user.fullName = "Alice Smith";  // Uses setter
console.log(user.firstName);    // "Alice"
```

---

## 8. Class Inheritance

### Extends and Super
```javascript
// Parent class
class Animal {
    constructor(name) {
        this.name = name;
    }
    
    speak() {
        console.log(this.name + " makes sound");
    }
}

// Child class
class Dog extends Animal {
    constructor(name, breed) {
        super(name);  // Call parent constructor
        this.breed = breed;
    }
    
    speak() {
        console.log(this.name + " barks!");  // Override
    }
    
    bark() {
        super.speak();  // Call parent method
        console.log("Woof!");
    }
}

let dog = new Dog("Rex", "Labrador");
console.log(dog.name);       // "Rex"
console.log(dog.breed);      // "Labrador"
dog.speak();                 // "Rex barks!"
dog.bark();                  // "Rex makes sound", "Woof!"

console.log(dog instanceof Dog);     // true
console.log(dog instanceof Animal);  // true
```

### Method Override
```javascript
class Shape {
    area() {
        return 0;
    }
}

class Rectangle extends Shape {
    constructor(width, height) {
        super();
        this.width = width;
        this.height = height;
    }
    
    area() {  // Override parent method
        return this.width * this.height;
    }
}

let rect = new Rectangle(5, 10);
console.log(rect.area());  // 50
```

---

## 9. Object Methods

### Object.keys/values/entries
```javascript
let obj = {
    name: "John",
    age: 25,
    city: "NYC"
};

console.log(Object.keys(obj));      // ["name", "age", "city"]
console.log(Object.values(obj));    // ["John", 25, "NYC"]
console.log(Object.entries(obj));   // [["name", "John"], ["age", 25], ...]

// Doesn't include prototype properties
function User(name) {
    this.name = name;
}
User.prototype.role = "user";

let user = new User("John");
console.log(Object.keys(user));     // ["name"] (not "role")
```

### Object.assign()
```javascript
// Copy properties from source to target
let target = { a: 1, b: 2 };
let source = { b: 3, c: 4 };

Object.assign(target, source);
console.log(target);  // { a: 1, b: 3, c: 4 }

// Shallow copy
let original = { name: "John", address: { city: "NYC" } };
let copy = Object.assign({}, original);
copy.address.city = "LA";  // Changes both!
```

### Object.freeze() and Object.seal()
```javascript
let user = { name: "John", age: 25 };

// Freeze: Can't add, modify, or delete
Object.freeze(user);
user.age = 30;  // Silently fails
delete user.name;  // Silently fails
console.log(user);  // { name: "John", age: 25 }

// Seal: Can modify but not add/delete
let profile = { name: "Alice", age: 30 };
Object.seal(profile);
profile.age = 31;  // Works
profile.email = "alice@example.com";  // Fails
```

---

## Exercises

### Exercise 1: Constructor Function
```javascript
// Create Book constructor
// Properties: title, author, year
// Methods: description(), isOld()

function Book(title, author, year) {
    // Your code
}

Book.prototype.description = function() {
    // Your code
};

let book = new Book("1984", "George Orwell", 1949);
console.log(book.description());   // "1984 by George Orwell (1949)"
console.log(book.isOld());         // true
```

**Solution:**
```javascript
function Book(title, author, year) {
    this.title = title;
    this.author = author;
    this.year = year;
}

Book.prototype.description = function() {
    return this.title + " by " + this.author + " (" + this.year + ")";
};

Book.prototype.isOld = function() {
    return new Date().getFullYear() - this.year > 50;
};
```

### Exercise 2: Inheritance
```javascript
// Create Person constructor
// Create Student extends Person
// Student has additional field: grade
// Student overrides greet() method

// Your code
```

**Solution:**
```javascript
function Person(name, age) {
    this.name = name;
    this.age = age;
}

Person.prototype.greet = function() {
    return "Hello, " + this.name;
};

function Student(name, age, grade) {
    Person.call(this, name, age);
    this.grade = grade;
}

Student.prototype = Object.create(Person.prototype);
Student.prototype.constructor = Student;

Student.prototype.greet = function() {
    return "Hello, " + this.name + " (Grade " + this.grade + ")";
};
```

### Exercise 3: ES6 Classes
```javascript
// Create Vehicle class
// Create Car extends Vehicle
// Add method drive()

// Your code
```

**Solution:**
```javascript
class Vehicle {
    constructor(brand) {
        this.brand = brand;
    }
    
    describe() {
        return this.brand + " vehicle";
    }
}

class Car extends Vehicle {
    constructor(brand, model) {
        super(brand);
        this.model = model;
    }
    
    drive() {
        console.log("Driving " + this.brand + " " + this.model);
    }
}
```

---

## Interview Questions

### Theoretical Questions

**Q1: What is prototypal inheritance?**
A: Objects inherit directly from other objects through prototype chain. When property not found, JavaScript looks up the chain.

**Q2: What's difference between Constructor.call() and Object.create()?**
A: call() copies properties and runs constructor code. Object.create() sets up prototype chain without calling constructor.

**Q3: What are the benefits of class syntax over constructor functions?**
A: Cleaner syntax, easier to read, super keyword, automatic return of new instance, clearer inheritance pattern.

**Q4: Why do we use 'new' keyword?**
A: Sets 'this' to new object, sets prototype, returns object. Without 'new', 'this' refers to global object.

**Q5: What's the prototype chain?**
A: Linked chain of objects' prototypes. JavaScript looks for property in object, then prototype, then prototype's prototype, etc.

---

## Code-Based Interview Questions

**Q1: What will be output?**
```javascript
function Animal() {}
Animal.prototype.speak = function() { return "sound"; };

let dog = new Animal();
console.log(dog.speak());  // ?
```
A:
```
"sound"
```

**Q2: Predict:**
```javascript
function User(name) {
    this.name = name;
}

User.prototype.greet = function() {
    return "Hi " + this.name;
};

let user = new User("John");
console.log(user.greet());  // ?
```
A:
```
"Hi John"
```

**Q3: What will be logged?**
```javascript
class Animal {
    constructor(name) {
        this.name = name;
    }
}

class Dog extends Animal {
    constructor(name, breed) {
        super(name);
        this.breed = breed;
    }
}

let dog = new Dog("Rex", "Labrador");
console.log(dog.name);  // ?
```
A:
```
"Rex"
```

**Q4: Spot the issue:**
```javascript
function Animal(name) {
    this.name = name;
}

Animal.prototype.speak = function() {};

function Dog(name) {
    this.name = name;  // Should use Animal.call(this, name)
}

Dog.prototype = Animal.prototype;  // Wrong! Dog and Animal share prototype
Dog.prototype.bark = function() {};
```
A: Modifying Dog.prototype also modifies Animal.prototype. Use Object.create() instead.

**Q5: What is output?**
```javascript
let obj = { name: "John" };
let proto = Object.create(obj);
proto.age = 25;

console.log(proto.name);  // ?
console.log(proto.hasOwnProperty("name"));  // ?
```
A:
```
"John"
false
```
Explanation: name comes from prototype, not own property

---

## Follow-up Questions & Confusing Concepts

**Q: What's difference between __proto__ and prototype?**
A: prototype is property of functions (not objects), __proto__ is on all objects pointing to their prototype.

**Q: Can I modify Array.prototype?**
A: Yes, but risky! Changes affect all arrays. Can cause conflicts with libraries.

**Q: Why not use Dog.prototype = Animal.prototype directly?**
A: Because modifications to Dog.prototype affect Animal.prototype too. Use Object.create() for clean copy.

**Q: What's the instanceof operator checking?**
A: Checks if constructor's prototype exists in object's prototype chain.

---

## Summary

- **Constructor**: Function with 'new' creates object with 'this'
- **Prototype**: Shared methods for all instances
- **Prototype chain**: Linked prototypes for inheritance
- **Object.create()**: Creates object with specific prototype
- **Inheritance**: Set child.prototype = Object.create(Parent.prototype)
- **super**: Call parent constructor/methods
- **ES6 Classes**: Modern syntax for constructors
- **Static methods**: Methods on class, not instance
- **Getters/Setters**: Properties with custom get/set logic

**Next Step:** Learn about advanced JavaScript patterns and async operations!
