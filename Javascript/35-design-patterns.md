# Design Patterns in JavaScript

## Table of Contents
1. Singleton Pattern
2. Factory Pattern
3. Observer Pattern
4. Module Pattern
5. Strategy Pattern
6. State Pattern
7. Command Pattern
8. Adapter Pattern
9. Best Practices

---

## 1. Singleton Pattern

### Single Instance Only
```javascript
// ✗ WRONG - Multiple instances possible
class Database {
    constructor() {
        this.connection = new Connection();
    }
}

let db1 = new Database();
let db2 = new Database();
// Two different instances - wasteful!

// ✓ CORRECT - Single instance
class Database {
    constructor() {
        if (Database.instance) {
            return Database.instance;
        }
        this.connection = new Connection();
        Database.instance = this;
    }
}

let db1 = new Database();
let db2 = new Database();
console.log(db1 === db2);  // true - same instance!
```

### Using IIFE
```javascript
let Singleton = (function() {
    let instance;
    
    function createInstance() {
        return {
            connection: new Connection(),
            query: function(sql) {
                // Execute query
            }
        };
    }
    
    return {
        getInstance: function() {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();

// Usage
let db1 = Singleton.getInstance();
let db2 = Singleton.getInstance();
console.log(db1 === db2);  // true
```

### Logger Example
```javascript
class Logger {
    constructor() {
        if (!Logger.instance) {
            this.logs = [];
            Logger.instance = this;
        }
        return Logger.instance;
    }
    
    log(message) {
        this.logs.push({
            message,
            timestamp: new Date()
        });
    }
    
    getLogs() {
        return this.logs;
    }
}

// Usage
let logger1 = new Logger();
logger1.log('App started');

let logger2 = new Logger();
logger2.log('Processing...');

console.log(logger1 === logger2);  // true
console.log(logger1.getLogs().length);  // 2 - same logs!
```

---

## 2. Factory Pattern

### Object Factory
```javascript
// ✗ WRONG - Duplicated creation logic
let user = new User('john');
let admin = new User('jane');
admin.role = 'admin';
admin.permissions = ['read', 'write', 'delete'];

// ✓ CORRECT - Factory handles creation
class UserFactory {
    static createUser(name, type = 'user') {
        if (type === 'admin') {
            return new Admin(name);
        } else if (type === 'moderator') {
            return new Moderator(name);
        } else {
            return new User(name);
        }
    }
}

let user = UserFactory.createUser('john', 'user');
let admin = UserFactory.createUser('jane', 'admin');
let mod = UserFactory.createUser('bob', 'moderator');
```

### Classes
```javascript
class User {
    constructor(name) {
        this.name = name;
        this.role = 'user';
        this.permissions = ['read'];
    }
}

class Admin extends User {
    constructor(name) {
        super(name);
        this.role = 'admin';
        this.permissions = ['read', 'write', 'delete'];
    }
}

class Moderator extends User {
    constructor(name) {
        super(name);
        this.role = 'moderator';
        this.permissions = ['read', 'write'];
    }
}
```

### Transport Factory
```javascript
class Transport {
    send(cargo) {
        throw new Error('send() must be implemented');
    }
}

class Truck extends Transport {
    send(cargo) {
        return `Shipping ${cargo} by truck`;
    }
}

class Ship extends Transport {
    send(cargo) {
        return `Shipping ${cargo} by ship`;
    }
}

class TransportFactory {
    static createTransport(type) {
        if (type === 'truck') {
            return new Truck();
        } else if (type === 'ship') {
            return new Ship();
        }
    }
}

// Usage
let shipping = TransportFactory.createTransport('truck');
console.log(shipping.send('Books'));  // Shipping Books by truck
```

---

## 3. Observer Pattern

### Event Emitter
```javascript
class EventEmitter {
    constructor() {
        this.events = {};
    }
    
    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }
    
    emit(event, data) {
        if (this.events[event]) {
            this.events[event].forEach(callback => {
                callback(data);
            });
        }
    }
    
    off(event, callback) {
        if (this.events[event]) {
            this.events[event] = this.events[event]
                .filter(cb => cb !== callback);
        }
    }
}

// Usage
let emitter = new EventEmitter();

emitter.on('user-login', (user) => {
    console.log(`${user.name} logged in`);
});

emitter.on('user-login', (user) => {
    console.log(`Activity: User ${user.id} online`);
});

emitter.emit('user-login', { name: 'John', id: 123 });
// Output:
// John logged in
// Activity: User 123 online
```

### Store/State Management
```javascript
class Store {
    constructor(initialState) {
        this.state = initialState;
        this.observers = [];
    }
    
    subscribe(observer) {
        this.observers.push(observer);
        // Notify immediately
        observer(this.state);
    }
    
    getState() {
        return this.state;
    }
    
    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.notify();
    }
    
    notify() {
        this.observers.forEach(observer => {
            observer(this.state);
        });
    }
}

// Usage
let store = new Store({ count: 0 });

store.subscribe((state) => {
    console.log('Count changed:', state.count);
});

store.setState({ count: 1 });  // Notifies all subscribers
store.setState({ count: 2 });
```

---

## 4. Module Pattern

### Private Variables
```javascript
// ✗ EXPOSED - Variables are public
let counter = 0;
function increment() { counter++; }
function getCount() { return counter; }

// Someone could do: counter = 100  (bad!)

// ✓ PRIVATE - Using IIFE
let counterModule = (function() {
    let counter = 0;  // Private
    
    return {
        increment() {
            counter++;
        },
        decrement() {
            counter--;
        },
        getCount() {
            return counter;
        }
    };
})();

counterModule.increment();
counterModule.increment();
console.log(counterModule.getCount());  // 2
console.log(counterModule.counter);  // undefined (private!)
```

### Module with Methods
```javascript
let userModule = (function() {
    // Private
    let users = [];
    
    function validate(user) {
        return user.email && user.name;
    }
    
    // Public API
    return {
        addUser: function(user) {
            if (validate(user)) {
                users.push(user);
                return true;
            }
            return false;
        },
        
        getUsers: function() {
            return [...users];  // Return copy
        },
        
        removeUser: function(email) {
            users = users.filter(u => u.email !== email);
        }
    };
})();

// Usage
userModule.addUser({ name: 'John', email: 'john@example.com' });
console.log(userModule.getUsers());
// Can't directly modify users array
```

---

## 5. Strategy Pattern

### Different Algorithms
```javascript
// ✗ WRONG - Many if/else
class PaymentProcessor {
    process(amount, method) {
        if (method === 'credit') {
            return this.processCreditCard(amount);
        } else if (method === 'paypal') {
            return this.processPayPal(amount);
        } else if (method === 'crypto') {
            return this.processCrypto(amount);
        }
    }
}

// ✓ CORRECT - Strategy pattern
class PaymentStrategy {
    pay(amount) {
        throw new Error('pay() must be implemented');
    }
}

class CreditCardStrategy extends PaymentStrategy {
    pay(amount) {
        return `Processing $${amount} with credit card`;
    }
}

class PayPalStrategy extends PaymentStrategy {
    pay(amount) {
        return `Processing $${amount} with PayPal`;
    }
}

class CryptoStrategy extends PaymentStrategy {
    pay(amount) {
        return `Processing $${amount} with crypto`;
    }
}

class PaymentProcessor {
    constructor(strategy) {
        this.strategy = strategy;
    }
    
    process(amount) {
        return this.strategy.pay(amount);
    }
}

// Usage
let payment = new PaymentProcessor(new CreditCardStrategy());
console.log(payment.process(50));

// Switch strategy
payment.strategy = new PayPalStrategy();
console.log(payment.process(50));
```

### Sorting Strategies
```javascript
class Sorter {
    constructor(strategy) {
        this.strategy = strategy;
    }
    
    sort(array) {
        return this.strategy.sort(array);
    }
}

class BubbleSort {
    sort(array) {
        // Bubble sort implementation
        return array;
    }
}

class QuickSort {
    sort(array) {
        // Quick sort implementation
        return array;
    }
}

// Usage
let sorter = new Sorter(new QuickSort());
let sorted = sorter.sort([3, 1, 4, 1, 5]);

// Switch algorithm
sorter.strategy = new BubbleSort();
sorted = sorter.sort([3, 1, 4, 1, 5]);
```

---

## 6. State Pattern

### State Machines
```javascript
// ✗ COMPLEX - Many flags and logic
class MediaPlayer {
    constructor() {
        this.isPlaying = false;
        this.isPaused = false;
    }
    
    play() {
        if (!this.isPlaying && !this.isPaused) {
            this.isPlaying = true;
            console.log('Playing...');
        }
    }
    
    pause() {
        if (this.isPlaying) {
            this.isPlaying = false;
            this.isPaused = true;
            console.log('Paused');
        }
    }
}

// ✓ CORRECT - State pattern
class PlayerState {
    play(player) {}
    pause(player) {}
    stop(player) {}
}

class StoppedState extends PlayerState {
    play(player) {
        player.setState(new PlayingState());
        console.log('Playing...');
    }
}

class PlayingState extends PlayerState {
    pause(player) {
        player.setState(new PausedState());
        console.log('Paused');
    }
    
    stop(player) {
        player.setState(new StoppedState());
        console.log('Stopped');
    }
}

class PausedState extends PlayerState {
    play(player) {
        player.setState(new PlayingState());
        console.log('Resuming...');
    }
    
    stop(player) {
        player.setState(new StoppedState());
        console.log('Stopped');
    }
}

class MediaPlayer {
    constructor() {
        this.state = new StoppedState();
    }
    
    setState(state) {
        this.state = state;
    }
    
    play() { this.state.play(this); }
    pause() { this.state.pause(this); }
    stop() { this.state.stop(this); }
}

// Usage
let player = new MediaPlayer();
player.play();    // Playing...
player.pause();   // Paused
player.play();    // Resuming...
```

---

## 7. Command Pattern

### Undo/Redo
```javascript
class Command {
    execute() {}
    undo() {}
}

class AddCommand extends Command {
    constructor(list, item) {
        super();
        this.list = list;
        this.item = item;
    }
    
    execute() {
        this.list.push(this.item);
    }
    
    undo() {
        this.list.pop();
    }
}

class RemoveCommand extends Command {
    constructor(list, item) {
        super();
        this.list = list;
        this.item = item;
        this.index = -1;
    }
    
    execute() {
        this.index = this.list.indexOf(this.item);
        this.list.splice(this.index, 1);
    }
    
    undo() {
        this.list.splice(this.index, 0, this.item);
    }
}

class CommandHistory {
    constructor() {
        this.commands = [];
        this.index = -1;
    }
    
    execute(command) {
        command.execute();
        this.commands.push(command);
        this.index++;
    }
    
    undo() {
        if (this.index >= 0) {
            this.commands[this.index].undo();
            this.index--;
        }
    }
    
    redo() {
        if (this.index < this.commands.length - 1) {
            this.index++;
            this.commands[this.index].execute();
        }
    }
}

// Usage
let list = [];
let history = new CommandHistory();

history.execute(new AddCommand(list, 'Item 1'));
history.execute(new AddCommand(list, 'Item 2'));
console.log(list);  // ['Item 1', 'Item 2']

history.undo();
console.log(list);  // ['Item 1']

history.redo();
console.log(list);  // ['Item 1', 'Item 2']
```

---

## 8. Adapter Pattern

### Interface Compatibility
```javascript
// Old API
class OldPaymentGateway {
    sendPayment(amount, cardNumber) {
        return `Paid $${amount} with card ${cardNumber}`;
    }
}

// New API (different interface)
class NewPaymentGateway {
    submitTransaction(transaction) {
        return `Transaction ${transaction.id} submitted`;
    }
}

// Adapter to make old API work with new code
class PaymentAdapter {
    constructor(newGateway) {
        this.gateway = newGateway;
    }
    
    sendPayment(amount, cardNumber) {
        let transaction = {
            id: Math.random(),
            amount: amount,
            card: cardNumber
        };
        return this.gateway.submitTransaction(transaction);
    }
}

// Usage
let newGateway = new NewPaymentGateway();
let adapter = new PaymentAdapter(newGateway);

// Can still use old interface
console.log(adapter.sendPayment(50, '1234-5678-9012-3456'));
```

---

## 9. Best Practices

### Composition Over Inheritance
```javascript
// ✗ WRONG - Deep inheritance
class Animal {}
class Mammal extends Animal {}
class Dog extends Mammal {}
class GoldenRetriever extends Dog {}  // Too deep!

// ✓ CORRECT - Composition
class Dog {
    constructor(name) {
        this.name = name;
        this.behavior = new FriendlyBehavior();
    }
    
    act() {
        return this.behavior.act();
    }
}

class FriendlyBehavior {
    act() {
        return 'wags tail';
    }
}
```

### Single Responsibility
```javascript
// ✗ WRONG - Doing too much
class User {
    constructor(name, email) {
        this.name = name;
        this.email = email;
    }
    
    save() { /* Save to DB */ }
    send Email() { /* Send email */ }
    generateReport() { /* Create report */ }
}

// ✓ CORRECT - Single responsibility
class User {
    constructor(name, email) {
        this.name = name;
        this.email = email;
    }
}

class UserRepository {
    save(user) { /* Save to DB */ }
}

class EmailService {
    send(user) { /* Send email */ }
}

class ReportGenerator {
    generate(user) { /* Create report */ }
}
```

---

## Exercises

### Exercise 1: Implement Singleton
```javascript
// Create a configuration singleton that stores app settings
// Should only have one instance

class AppConfig {
    // Your code
}

let config1 = new AppConfig();
let config2 = new AppConfig();
console.log(config1 === config2);  // Should be true
```

**Solution:**
```javascript
class AppConfig {
    constructor() {
        if (AppConfig.instance) {
            return AppConfig.instance;
        }
        this.settings = {};
        AppConfig.instance = this;
    }
    
    setSetting(key, value) {
        this.settings[key] = value;
    }
    
    getSetting(key) {
        return this.settings[key];
    }
}
```

### Exercise 2: Implement Factory
```javascript
// Create factory for different vehicle types

class VehicleFactory {
    // Your code
}

let car = VehicleFactory.create('car');
let truck = VehicleFactory.create('truck');
```

**Solution:**
```javascript
class Vehicle {
    constructor(type) {
        this.type = type;
    }
}

class Car extends Vehicle {
    constructor() {
        super('car');
        this.doors = 4;
    }
}

class Truck extends Vehicle {
    constructor() {
        super('truck');
        this.bed = true;
    }
}

class VehicleFactory {
    static create(type) {
        if (type === 'car') {
            return new Car();
        } else if (type === 'truck') {
            return new Truck();
        }
    }
}
```

### Exercise 3: Implement Observer
```javascript
// Create form that notifies subscribers when value changes

class Form extends EventEmitter {
    // Your code
}

let form = new Form();
form.on('change', (data) => {
    console.log('Form changed:', data);
});
form.emit('change', { field: 'email', value: 'john@example.com' });
```

**Solution:**
```javascript
class Form extends EventEmitter {
    constructor() {
        super();
        this.data = {};
    }
    
    setValue(field, value) {
        this.data[field] = value;
        this.emit('change', { field, value });
    }
}
```

---

## Interview Questions

### Theoretical Questions

**Q1: What is Singleton Pattern?**
A: Ensures only one instance of class exists throughout application.

**Q2: What is Factory Pattern?**
A: Creates objects without specifying exact classes.

**Q3: What is Observer Pattern?**
A: Notifies multiple objects about state changes.

**Q4: What is Strategy Pattern?**
A: Encapsulates different algorithms in classes.

**Q5: When to use composition over inheritance?**
A: When you want flexibility and avoid deep hierarchies.

---

## Code-Based Interview Questions

**Q1: What is output?**
```javascript
let s1 = new Singleton();
let s2 = new Singleton();
console.log(s1 === s2);  // ?
```
A:
```
true
(both are same instance)
```

**Q2: Predict:**
```javascript
let module = (function() {
    let private = 'secret';
    return { getPrivate: () => private };
})();
console.log(module.private);  // ?
```
A:
```
undefined
(private is in closure, not public)
```

**Q3: What will execute?**
```javascript
let observer = new Observer();
observer.subscribe(() => console.log('A'));
observer.subscribe(() => console.log('B'));
observer.notify();  // ?
```
A:
```
A
B
```

**Q4: Spot the issue:**
```javascript
class Factory {
    static create(type) {
        if (type === 'a') return new A();
        if (type === 'b') return new B();
        // Missing default!
    }
}
```
A: Returns undefined for unknown types

**Q5: What is output?**
```javascript
let store = new Store({ count: 0 });
store.setState({ count: 1 });
console.log(store.getState().count);  // ?
```
A:
```
1
```

---

## Follow-up Questions & Confusing Concepts

**Q: Is Singleton pattern bad?**
A: Can be, makes testing difficult. Use dependency injection instead.

**Q: When should I use Factory?**
A: When you have many similar objects to create.

**Q: What is difference between Strategy and State?**
A: Strategy is chosen by client. State is changed by object itself.

**Q: Can I use multiple inheritance?**
A: JavaScript uses prototypal inheritance, not multiple inheritance.

---

## Summary

- **Singleton**: One instance only
- **Factory**: Create objects without specifying classes
- **Observer**: Notify multiple subscribers of changes
- **Module**: Private variables and public API
- **Strategy**: Different algorithms interchangeably
- **State**: Object changes behavior based on state
- **Command**: Encapsulate requests as objects (undo/redo)
- **Adapter**: Make incompatible interfaces compatible
- **SOLID principles**: Design for maintainability
- **Composition**: Prefer over deep inheritance hierarchies

**Next Step:** Master testing frameworks and unit testing!
