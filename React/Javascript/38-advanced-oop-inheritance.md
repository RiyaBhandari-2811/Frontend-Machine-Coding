# Advanced OOP & Prototypal Inheritance

## Table of Contents
1. Prototypal Inheritance Deep Dive
2. Constructor Functions vs Classes
3. Object Creation Patterns
4. The `this` Context
5. Prototype Chain
6. Mixins & Composition
7. Getters & Setters
8. Static Methods & Properties
9. Advanced Patterns

---

## 1. Prototypal Inheritance Deep Dive

### Prototype Basics
```javascript
// Every object has a [[Prototype]] (internal slot)
let obj = {};
console.log(Object.getPrototypeOf(obj));  // Object.prototype

// Objects inherit from their prototype
function Animal(name) {
    this.name = name;
}

Animal.prototype.speak = function() {
    console.log(`${this.name} makes a sound`);
};

let dog = new Animal('Dog');
dog.speak();  // Dog makes a sound

// Check if property is own or inherited
console.log(dog.hasOwnProperty('name'));  // true (own)
console.log(dog.hasOwnProperty('speak'));  // false (inherited)
```

### Object.create
```javascript
// Create object with specific prototype
let parentObj = {
    greet: function() {
        return `Hello, ${this.name}`;
    }
};

let childObj = Object.create(parentObj);
childObj.name = 'John';

console.log(childObj.greet());  // Hello, John

// Benefits over constructor functions:
// - Explicit prototype
// - No constructor call needed
// - Cleaner inheritance

// Create with null prototype (no inherited properties)
let cleanObj = Object.create(null);
console.log(Object.getPrototypeOf(cleanObj));  // null
```

### Prototype Chain
```javascript
// Chain: dog -> Animal.prototype -> Object.prototype -> null

function Animal(name) {
    this.name = name;
}

Animal.prototype.eat = function() {
    console.log(`${this.name} eats`);
};

function Dog(name, breed) {
    Animal.call(this, name);  // Call parent constructor
    this.breed = breed;
}

// Set up inheritance
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;  // Fix constructor reference

Dog.prototype.bark = function() {
    console.log(`${this.name} barks`);
};

let dog = new Dog('Buddy', 'Golden Retriever');

// Traverses chain: dog -> Dog.prototype -> Animal.prototype -> Object.prototype
dog.eat();  // Buddy eats
dog.bark();  // Buddy barks
console.log(dog instanceof Animal);  // true
console.log(dog instanceof Dog);  // true
```

---

## 2. Constructor Functions vs Classes

### Constructor Functions
```javascript
// Traditional way (pre-ES6)
function Person(name, age) {
    this.name = name;
    this.age = age;
}

Person.prototype.greet = function() {
    return `Hi, I'm ${this.name}`;
};

let person = new Person('John', 30);
console.log(person.greet());  // Hi, I'm John
```

### ES6 Classes
```javascript
// Modern way (ES6+)
class Person {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    
    greet() {
        return `Hi, I'm ${this.name}`;
    }
}

let person = new Person('John', 30);
console.log(person.greet());  // Hi, I'm John

// Behind the scenes, still uses prototypal inheritance
console.log(person instanceof Person);  // true
```

### Comparison
```javascript
// Constructor Function
function Dog(name) {
    this.name = name;
}

Dog.prototype.bark = function() {
    console.log('Woof!');
};

// ES6 Class (equivalent)
class Dog {
    constructor(name) {
        this.name = name;
    }
    
    bark() {
        console.log('Woof!');
    }
}

// Key differences:
// 1. Classes are hoisted differently
// 2. Classes have a default strict mode
// 3. Classes methods are non-enumerable
// 4. Classes can extend other classes more easily
```

### Class Inheritance
```javascript
class Animal {
    constructor(name) {
        this.name = name;
    }
    
    eat() {
        console.log(`${this.name} eats`);
    }
}

class Dog extends Animal {
    constructor(name, breed) {
        super(name);  // Call parent constructor
        this.breed = breed;
    }
    
    bark() {
        console.log('Woof!');
    }
    
    eat() {
        // Override parent method
        super.eat();  // Call parent method
        console.log('Dog eats dog food');
    }
}

let dog = new Dog('Buddy', 'Golden');
dog.eat();  // Buddy eats
            // Dog eats dog food
```

---

## 3. Object Creation Patterns

### Object Literal
```javascript
// Simplest way
let obj = {
    name: 'John',
    age: 30,
    greet() {
        return `Hi, ${this.name}`;
    }
};

console.log(obj.greet());  // Hi, John
```

### Factory Function
```javascript
// Avoid using new, return object
function createPerson(name, age) {
    return {
        name,
        age,
        greet() {
            return `Hi, ${this.name}`;
        },
        
        // Can add private variables via closure
        getSecret() {
            return 'secret';
        }
    };
}

let person = createPerson('John', 30);
console.log(person.greet());  // Hi, John

// Benefit: flexible, can return different object types
function createUser(type) {
    if (type === 'admin') {
        return { isAdmin: true };
    } else {
        return { isAdmin: false };
    }
}
```

### Builder Pattern
```javascript
class UserBuilder {
    constructor(name) {
        this.name = name;
    }
    
    setAge(age) {
        this.age = age;
        return this;  // Chaining
    }
    
    setEmail(email) {
        this.email = email;
        return this;
    }
    
    setRole(role) {
        this.role = role;
        return this;
    }
    
    build() {
        // Validation
        if (!this.name) throw new Error('Name is required');
        
        return {
            name: this.name,
            age: this.age,
            email: this.email,
            role: this.role || 'user'
        };
    }
}

// Usage
let user = new UserBuilder('John')
    .setAge(30)
    .setEmail('john@example.com')
    .setRole('admin')
    .build();

console.log(user);
```

---

## 4. The `this` Context

### How `this` is Determined
```javascript
// 1. Method call - this = object
let obj = {
    name: 'John',
    greet() {
        console.log(this.name);  // this = obj
    }
};
obj.greet();  // John

// 2. Function call - this = undefined (strict) or window (loose)
function greet() {
    console.log(this);  // window (or undefined in strict)
}
greet();

// 3. Constructor call - this = new object
function Person(name) {
    this.name = name;  // this = new Person
}
new Person('John');

// 4. Arrow functions - inherit this from surrounding scope
let obj = {
    name: 'John',
    greet: () => {
        console.log(this);  // this = surrounding scope (window/module)
    },
    regularGreet() {
        let arrow = () => {
            console.log(this);  // this = obj
        };
        arrow();
    }
};
```

### Explicit Binding
```javascript
// call() - Call function with specific this
let person = { name: 'John' };
function greet(greeting) {
    console.log(`${greeting}, ${this.name}`);
}

greet.call(person, 'Hello');  // Hello, John

// apply() - Like call but with array of arguments
greet.apply(person, ['Hi']);  // Hi, John

// bind() - Return new function with bound this
let boundGreet = greet.bind(person);
boundGreet('Hey');  // Hey, John

// Practical use - save method from object
let obj = {
    name: 'John',
    greet() {
        console.log(this.name);
    }
};

let sayName = obj.greet;  // Loses context
sayName();  // undefined (this is window/undefined)

let boundSayName = obj.greet.bind(obj);  // Preserve context
boundSayName();  // John
```

---

## 5. Prototype Chain

### Traversing the Chain
```javascript
// Look at prototype chain
function Animal(name) {
    this.name = name;
}

Animal.prototype.kingdom = 'Animalia';

function Dog(name, breed) {
    Animal.call(this, name);
    this.breed = breed;
}

Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;
Dog.prototype.family = 'Canidae';

let dog = new Dog('Buddy', 'Golden');

// Properties exist at different levels
console.log(dog.hasOwnProperty('name'));  // true (own)
console.log(dog.hasOwnProperty('breed'));  // true (own)
console.log(dog.hasOwnProperty('family'));  // false (Dog.prototype)
console.log(dog.hasOwnProperty('kingdom'));  // false (Animal.prototype)

// But all are accessible
console.log(dog.name);  // Buddy
console.log(dog.breed);  // Golden
console.log(dog.family);  // Canidae
console.log(dog.kingdom);  // Animalia

// Get all property names (own + inherited)
console.log(Object.keys(dog));  // ['name', 'breed'] (own only)

// Get all property names including inherited
for (let key in dog) {
    console.log(key);  // name, breed, family, kingdom, constructor
}
```

### Modifying Prototype
```javascript
// Add method to built-in prototype (careful!)
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

console.log('hello'.capitalize());  // Hello

// CAUTION: Don't override existing methods
// Don't add to prototypes you don't own (causes conflicts)

// Better: Create utility functions
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

console.log(capitalize('hello'));  // Hello
```

---

## 6. Mixins & Composition

### Mixins
```javascript
// Reusable behavior as objects
let canEat = {
    eat() {
        return `${this.name} eats`;
    }
};

let canWalk = {
    walk() {
        return `${this.name} walks`;
    }
};

let canSwim = {
    swim() {
        return `${this.name} swims`;
    }
};

// Combine mixins
class Dog {
    constructor(name) {
        this.name = name;
    }
}

// Add mixin methods to prototype
Object.assign(Dog.prototype, canEat, canWalk);

let dog = new Dog('Buddy');
console.log(dog.eat());  // Buddy eats
console.log(dog.walk());  // Buddy walks

// Better for composition than inheritance
// Avoid deep inheritance hierarchies
```

### Composition Over Inheritance
```javascript
// ✗ INHERITANCE (inflexible)
class Bird {
    fly() { }
}

class Dog extends Animal {
    // Doesn't have fly method
}

// ✓ COMPOSITION (flexible)
class Animal {
    constructor(name) {
        this.name = name;
    }
}

class FlyingBehavior {
    fly() {
        return `${this.name} flies`;
    }
}

class Dog {
    constructor(name) {
        this.name = name;
        this.behavior = new FlyingBehavior();
    }
    
    fly() {
        return this.behavior.fly();
    }
}

// Can mix and match behaviors
let dog = new Dog('Buddy');
console.log(dog.fly());  // Buddy flies
```

---

## 7. Getters & Setters

### Property Accessors
```javascript
class User {
    constructor(firstName, lastName) {
        this._firstName = firstName;  // Convention: _ = private
        this._lastName = lastName;
    }
    
    // Getter
    get fullName() {
        return `${this._firstName} ${this._lastName}`;
    }
    
    // Setter
    set fullName(name) {
        [this._firstName, this._lastName] = name.split(' ');
    }
    
    get age() {
        // Computed property
        return new Date().getFullYear() - this._birthYear;
    }
    
    set age(age) {
        this._birthYear = new Date().getFullYear() - age;
    }
}

let user = new User('John', 'Doe');
console.log(user.fullName);  // John Doe

user.fullName = 'Jane Smith';
console.log(user._firstName);  // Jane
console.log(user._lastName);  // Smith
```

### Object.defineProperty
```javascript
let obj = {};

Object.defineProperty(obj, 'name', {
    get() {
        return this._name;
    },
    set(value) {
        if (value.length < 2) {
            throw new Error('Name too short');
        }
        this._name = value;
    },
    enumerable: true,
    configurable: true
});

obj.name = 'John';
console.log(obj.name);  // John
// obj.name = 'J';  // Throws error
```

---

## 8. Static Methods & Properties

### Static Methods
```javascript
class MathUtils {
    static add(a, b) {
        return a + b;
    }
    
    static subtract(a, b) {
        return a - b;
    }
    
    // Instance method
    multiply(a, b) {
        return a * b;
    }
}

// Call static on class
console.log(MathUtils.add(5, 3));  // 8
console.log(MathUtils.subtract(5, 3));  // 2

// Instance method needs instance
let utils = new MathUtils();
console.log(utils.multiply(5, 3));  // 15
```

### Static Properties
```javascript
class Database {
    static instance = null;
    static connections = [];
    
    static getInstance() {
        if (!this.instance) {
            this.instance = new Database();
        }
        return this.instance;
    }
    
    constructor() {
        this.id = Math.random();
        Database.connections.push(this);
    }
}

let db1 = Database.getInstance();
let db2 = Database.getInstance();

console.log(db1 === db2);  // true
console.log(Database.connections.length);  // 1
```

---

## 9. Advanced Patterns

### Closures for Private Data
```javascript
// ✗ EXPOSED - Data is public
class Account {
    constructor(balance) {
        this.balance = balance;
    }
    
    withdraw(amount) {
        this.balance -= amount;
    }
}

let account = new Account(1000);
account.balance = 10000;  // Easy to cheat!

// ✓ PRIVATE - Using closure
class SecureAccount {
    constructor(balance) {
        let _balance = balance;  // Private via closure
        
        this.withdraw = (amount) => {
            if (amount > _balance) {
                throw new Error('Insufficient funds');
            }
            _balance -= amount;
        };
        
        this.getBalance = () => _balance;
    }
}

let account = new SecureAccount(1000);
account.withdraw(100);
console.log(account.getBalance());  // 900
// account._balance = 10000;  // Undefined - private!
```

### WeakMap for Private Properties
```javascript
// Use WeakMap to store private data
let privateData = new WeakMap();

class User {
    constructor(name, password) {
        this.name = name;
        privateData.set(this, { password });
    }
    
    verifyPassword(pwd) {
        return privateData.get(this).password === pwd;
    }
}

let user = new User('John', 'secret123');
console.log(user.verifyPassword('secret123'));  // true
console.log(user.verifyPassword('wrong'));  // false
console.log(user.password);  // undefined (private!)

// When user is garbage collected, private data is too
```

---

## Exercises

### Exercise 1: Inheritance Chain
```javascript
// Create: Vehicle -> Car -> SportsCar
// Vehicle: constructor(brand), drive()
// Car: constructor(brand, doors), honk()
// SportsCar: constructor(brand, doors, speed), turbo()
```

**Solution:**
```javascript
class Vehicle {
    constructor(brand) {
        this.brand = brand;
    }
    drive() {
        return `${this.brand} is driving`;
    }
}

class Car extends Vehicle {
    constructor(brand, doors) {
        super(brand);
        this.doors = doors;
    }
    honk() {
        return 'Honk!';
    }
}

class SportsCar extends Car {
    constructor(brand, doors, speed) {
        super(brand, doors);
        this.speed = speed;
    }
    turbo() {
        return `Turbo engaged! Speed: ${this.speed}`;
    }
}
```

### Exercise 2: Mixin Pattern
```javascript
// Create canFly, canSwim mixins
// Apply to Duck class
// Duck should fly() and swim()
```

**Solution:**
```javascript
let canFly = {
    fly() {
        return `${this.name} flies`;
    }
};

let canSwim = {
    swim() {
        return `${this.name} swims`;
    }
};

class Duck {
    constructor(name) {
        this.name = name;
    }
}

Object.assign(Duck.prototype, canFly, canSwim);

let duck = new Duck('Donald');
console.log(duck.fly());  // Donald flies
console.log(duck.swim());  // Donald swims
```

### Exercise 3: Private Data
```javascript
// Create Counter class with private count
// Should have increment(), decrement(), getCount()
// Count should not be directly accessible
```

**Solution:**
```javascript
let privateCounter = new WeakMap();

class Counter {
    constructor(initialValue = 0) {
        privateCounter.set(this, initialValue);
    }
    
    increment() {
        let count = privateCounter.get(this);
        privateCounter.set(this, count + 1);
    }
    
    decrement() {
        let count = privateCounter.get(this);
        privateCounter.set(this, count - 1);
    }
    
    getCount() {
        return privateCounter.get(this);
    }
}
```

---

## Interview Questions

### Theoretical Questions

**Q1: What is prototypal inheritance?**
A: Objects inherit from other objects via prototype chain.

**Q2: What is the difference between `call` and `apply`?**
A: `call` takes arguments directly. `apply` takes array of arguments.

**Q3: How does `this` work in arrow functions?**
A: Arrow functions inherit `this` from surrounding scope (lexical).

**Q4: What is a mixin?**
A: Reusable object with methods that can be applied to other objects.

**Q5: Why use getters/setters?**
A: To add validation and computed properties.

---

## Code-Based Interview Questions

**Q1: What is output?**
```javascript
function Person(name) {
    this.name = name;
}
let p = new Person('John');
console.log(p instanceof Person);  // ?
```
A:
```
true
```

**Q2: Predict:**
```javascript
let obj = {
    name: 'John',
    greet: () => {
        console.log(this.name);
    }
};
obj.greet();  // ?
```
A:
```
undefined
(arrow inherits this from outer scope)
```

**Q3: What is output?**
```javascript
let obj = { x: 10 };
let fn = function() { return this.x; };
let bound = fn.bind(obj);
console.log(bound());  // ?
```
A:
```
10
```

**Q4: Spot the issue:**
```javascript
Dog.prototype = Animal.prototype;  // Wrong!
// Should use:
Dog.prototype = Object.create(Animal.prototype);
```
A: Direct assignment causes Dog and Animal to share prototype

**Q5: What is output?**
```javascript
class A { static x = 10; }
class B extends A {}
console.log(B.x);  // ?
```
A:
```
10
(static properties are inherited)
```

---

## Follow-up Questions & Confusing Concepts

**Q: Should I use classes or functions?**
A: Classes are cleaner for most use cases. Use functions for factory patterns.

**Q: Is prototypal inheritance dead?**
A: No, classes use it under the hood. Still relevant for understanding.

**Q: Why use WeakMap for private data?**
A: Automatic garbage collection when object is deleted.

**Q: Can I have multiple inheritance?**
A: No, but can use mixins for similar effect.

---

## Summary

- **Prototypal Inheritance**: Objects inherit from other objects
- **Constructor Functions**: Traditional way pre-ES6
- **ES6 Classes**: Modern syntax, same inheritance under the hood
- **Prototype Chain**: dog -> Dog.prototype -> Animal.prototype -> Object.prototype
- **Object Creation**: Literals, factories, builders, constructors
- **this Context**: Determined by how function is called
- **Explicit Binding**: call(), apply(), bind()
- **Mixins**: Reusable behavior via Object.assign()
- **Getters/Setters**: Property accessors with validation
- **Static Methods**: Called on class, not instance
- **Private Data**: Closures, WeakMap for encapsulation

**Next Step:** Complete capstone with real-world project patterns!
