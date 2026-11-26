# ES6 Modules & Import/Export

## Table of Contents
1. What are Modules?
2. Export Syntax
3. Import Syntax
4. Named Exports
5. Default Exports
6. Mixed Exports
7. Module Patterns
8. Best Practices
9. Browser vs Node.js

---

## 1. What are Modules?

### Why Modules?
- **Code Organization**: Separate concerns into files
- **Reusability**: Use code across projects
- **Maintainability**: Easier to find and modify code
- **Namespacing**: Avoid global scope pollution
- **Dependency Management**: Clear dependencies between files

### Module System Timeline
```javascript
// Before ES6: Global variables (bad)
var user = { name: 'John' };  // Global

// CommonJS (Node.js): module.exports/require
module.exports = { name: 'John' };
const user = require('./user');

// ES6 Modules: import/export (modern standard)
export const user = { name: 'John' };
import { user } from './user';
```

---

## 2. Export Syntax

### Named Exports
```javascript
// utils.js

// Export individual items
export const PI = 3.14159;
export const GRAVITY = 9.8;

export function add(a, b) {
    return a + b;
}

export class Calculator {
    multiply(a, b) {
        return a * b;
    }
}

export const subtract = (a, b) => a - b;
```

### Export at End of File
```javascript
// utils.js

const PI = 3.14159;
function add(a, b) {
    return a + b;
}
class Calculator { }

// Export multiple at once
export { PI, add, Calculator };

// Or with renaming
export { PI as MATH_PI, add as addition };
```

### Default Export
```javascript
// config.js

export default {
    apiUrl: 'https://api.example.com',
    timeout: 5000,
    retries: 3
};

// user.js
export default class User {
    constructor(name) {
        this.name = name;
    }
    
    greet() {
        return 'Hello, ' + this.name;
    }
}

// calculator.js
export default function add(a, b) {
    return a + b;
}
```

---

## 3. Import Syntax

### Named Imports
```javascript
// main.js

// Import specific exports
import { PI, add, Calculator } from './utils.js';

console.log(PI);        // 3.14159
console.log(add(2, 3)); // 5

let calc = new Calculator();
calc.multiply(4, 5);    // 20
```

### Import with Alias
```javascript
// Import with renaming
import { PI as MATH_PI, add as addition } from './utils.js';

console.log(MATH_PI);     // 3.14159
console.log(addition(2, 3));  // 5
```

### Import All Named Exports
```javascript
// Import namespace
import * as utils from './utils.js';

console.log(utils.PI);           // 3.14159
console.log(utils.add(2, 3));    // 5
console.log(new utils.Calculator());
```

### Import Default Export
```javascript
// config.js exports default
// main.js

import config from './config.js';

console.log(config.apiUrl);  // 'https://api.example.com'
console.log(config.timeout); // 5000
```

### Mixed Imports
```javascript
// math.js
export const PI = 3.14159;
export function add(a, b) { return a + b; }
export default class Calculator { }

// main.js
import Calculator, { PI, add } from './math.js';

console.log(PI);            // 3.14159
console.log(add(2, 3));     // 5
let calc = new Calculator();
```

---

## 4. Named Exports

### Multiple Named Exports
```javascript
// user.js

export function getUserById(id) {
    return { id, name: 'John' };
}

export function updateUser(id, data) {
    return { id, ...data };
}

export function deleteUser(id) {
    return { deleted: true, id };
}

// main.js
import { getUserById, updateUser, deleteUser } from './user.js';

console.log(getUserById(1));
console.log(updateUser(1, { age: 25 }));
```

### Exporting Classes
```javascript
// models.js

export class User {
    constructor(name, email) {
        this.name = name;
        this.email = email;
    }
}

export class Post {
    constructor(title, content) {
        this.title = title;
        this.content = content;
    }
}

// main.js
import { User, Post } from './models.js';

let user = new User('John', 'john@example.com');
let post = new Post('My Title', 'Content');
```

### Re-exporting
```javascript
// index.js - Gather and re-export from other modules

export { getUserById, updateUser } from './user.js';
export { getPostById, updatePost } from './post.js';
export { User, Post } from './models.js';

// Now user can import everything from index.js
// import { User, Post, getUserById } from './index.js';
```

---

## 5. Default Exports

### Single Default Export
```javascript
// config.js

export default {
    database: 'mongodb',
    port: 27017,
    host: 'localhost'
};

// Can import with any name
import dbConfig from './config.js';
console.log(dbConfig.port);  // 27017
```

### Default Function
```javascript
// logger.js

export default function log(message) {
    console.log('[LOG]', message);
}

// main.js
import log from './logger.js';

log('Application started');  // [LOG] Application started
```

### Default Class
```javascript
// Application.js

export default class Application {
    constructor(name) {
        this.name = name;
    }
    
    start() {
        console.log(this.name + ' started');
    }
}

// main.js
import Application from './Application.js';

let app = new Application('MyApp');
app.start();
```

### Cannot Have Multiple Defaults
```javascript
// ERROR - Only one default export per module
export default { name: 'John' };
export default function test() {};  // ✗ Syntax error

// OK - One default, multiple named
export default { name: 'John' };
export const version = '1.0.0';
```

---

## 6. Mixed Exports

### Default and Named Together
```javascript
// math.js

export default class Calculator {
    add(a, b) { return a + b; }
}

export const PI = 3.14159;
export function add(a, b) { return a + b; }

// main.js
import Calculator, { PI, add } from './math.js';

console.log(new Calculator().add(2, 3));  // 5
console.log(PI);    // 3.14159
console.log(add(2, 3));  // 5
```

### Separating Concerns
```javascript
// api.js
export default async function fetch(url) {
    // API call logic
}

export const BASE_URL = 'https://api.example.com';
export const ENDPOINTS = {
    users: '/users',
    posts: '/posts'
};

// main.js
import fetch, { BASE_URL, ENDPOINTS } from './api.js';

fetch(BASE_URL + ENDPOINTS.users);
```

---

## 7. Module Patterns

### Feature Module
```javascript
// auth.js - Exports all auth-related functions

function login(username, password) {
    // Login logic
}

function logout() {
    // Logout logic
}

function register(email, password) {
    // Register logic
}

export { login, logout, register };

// main.js
import { login, logout, register } from './auth.js';
```

### Singleton Pattern
```javascript
// database.js - Single instance shared everywhere

class Database {
    constructor() {
        this.connection = null;
    }
    
    connect() {
        this.connection = 'connected';
    }
}

export default new Database();  // Create once, export instance

// main.js
import db from './database.js';
db.connect();

// other.js
import db from './database.js';
// Same db instance!
```

### Facade Pattern
```javascript
// userFacade.js - Simplify complex operations

import * as userAPI from './api/user.js';
import * as authAPI from './api/auth.js';
import { validateEmail } from './validators.js';

export function registerUser(email, password) {
    validateEmail(email);  // Validate
    return authAPI.register(email, password);  // Register
}

export function getUser(id) {
    return userAPI.getUserById(id);  // Get user
}

// main.js
import { registerUser, getUser } from './userFacade.js';
// Simpler interface!
```

---

## 8. Best Practices

### File Organization
```
project/
├── src/
│   ├── index.js (entry point)
│   ├── utils/
│   │   ├── index.js (re-exports)
│   │   ├── math.js
│   │   └── string.js
│   ├── models/
│   │   ├── User.js
│   │   └── Post.js
│   └── api/
│       ├── index.js (re-exports)
│       ├── user.js
│       └── post.js
```

### Use Index Files
```javascript
// utils/index.js - Gather utils exports

export * from './math.js';
export * from './string.js';
export * from './array.js';

// Now: import { add, capitalize, flatten } from './utils';
// Instead of: import { add } from './utils/math'; import { capitalize } from './utils/string'; ...
```

### Named Exports vs Default
```javascript
// Use named when: Multiple related exports from module
export { add, subtract, multiply, divide };

// Use default when: Single main export
export default class User { }

// Use both when: Primary + related utilities
export default class Database { }
export const connect = () => { };
export const disconnect = () => { };
```

### Avoid Circular Dependencies
```javascript
// BAD - Circular dependency
// user.js
import { getPost } from './post.js';
// post.js
import { getUser } from './user.js';

// GOOD - Use index file or separate concerns
// models/index.js
export { User } from './user.js';
export { Post } from './post.js';
// No circular dependency
```

---

## 9. Browser vs Node.js

### Browser Usage
```html
<!-- HTML -->
<!-- Use type="module" for ES6 modules -->
<script type="module" src="app.js"></script>

<!-- app.js -->
import { User } from './models.js';
import config from './config.js';
```

### Node.js Usage
```javascript
// package.json
{
    "type": "module"  // Enable ES6 modules
}

// Or use .mjs file extension

// app.mjs or app.js (with "type": "module")
import { User } from './models.js';
import config from './config.js';
```

### CommonJS (Older Node.js)
```javascript
// Still used in many projects
// util.js
module.exports = {
    add: (a, b) => a + b
};

// main.js
const util = require('./util.js');
util.add(2, 3);
```

---

## Exercises

### Exercise 1: Create Module
```javascript
// math.js
// Export: add, subtract, multiply, divide functions
// Also export PI constant

// main.js
// Import all from math.js
// Use functions and constant
```

**Solution:**
```javascript
// math.js
export const PI = 3.14159;
export const add = (a, b) => a + b;
export const subtract = (a, b) => a - b;
export const multiply = (a, b) => a * b;
export const divide = (a, b) => a / b;

// main.js
import { PI, add, subtract, multiply, divide } from './math.js';
console.log(add(5, 3));
console.log(PI);
```

### Exercise 2: Default Export
```javascript
// config.js
// Export default configuration object

// main.js
// Import default config
```

**Solution:**
```javascript
// config.js
export default {
    apiUrl: 'https://api.example.com',
    timeout: 5000
};

// main.js
import config from './config.js';
console.log(config.apiUrl);
```

### Exercise 3: Mixed Exports
```javascript
// user.js
// Export default User class
// Export named: validateEmail, validatePassword

// main.js
// Import both default and named
```

**Solution:**
```javascript
// user.js
export default class User { }
export function validateEmail(email) { return email.includes('@'); }
export function validatePassword(pwd) { return pwd.length >= 8; }

// main.js
import User, { validateEmail, validatePassword } from './user.js';
```

---

## Interview Questions

### Theoretical Questions

**Q1: What's the difference between named and default exports?**
A: Named exports allow multiple exports, imported by name. Default export is single main export, imported with any name.

**Q2: Why use modules?**
A: Code organization, reusability, maintainability, avoid global scope pollution, clear dependencies.

**Q3: Can module have both default and named exports?**
A: Yes, one default and multiple named in same module.

**Q4: How do you re-export from another module?**
A: export { thing } from './module.js' or export * from './module.js'

**Q5: What's the difference between import and require?**
A: import is ES6 (modern), require is CommonJS (Node.js). import is static, require is dynamic.

---

## Code-Based Interview Questions

**Q1: What will be output?**
```javascript
// math.js
export default 42;
export const PI = 3.14;

// main.js
import num, { PI } from './math.js';
console.log(num, PI);  // ?
```
A:
```
42 3.14
```

**Q2: Predict:**
```javascript
// util.js
export const add = (a, b) => a + b;

// main.js
import { add as sum } from './util.js';
console.log(sum(2, 3));  // ?
```
A:
```
5
```

**Q3: What will be logged?**
```javascript
// config.js
export default { timeout: 5000 };
export const DEBUG = true;

// main.js
import config from './config.js';
console.log(config);  // ?
```
A:
```
{ timeout: 5000 }
```
Explanation: Default export imports object, not named export

**Q4: Spot the issue:**
```javascript
// math.js
export default const PI = 3.14;  // ✗ Syntax error
```
A: Can't use export default with const directly. Use: const PI = 3.14; export default PI;

**Q5: What is output?**
```javascript
// util.js
export const name = 'util';
export default function() { return 'default'; }

// main.js
import * as u from './util.js';
console.log(u.name);         // ?
console.log(u.default());    // ?
```
A:
```
"util"
"default"
```

---

## Follow-up Questions & Confusing Concepts

**Q: Can I dynamically import modules?**
A: Yes, use import() as function: import('./module.js').then(m => m.func())

**Q: Are modules asynchronous?**
A: In browser yes (loads separately), in Node.js synchronous for initial load.

**Q: Do modules have scope?**
A: Yes, module scope. Variables don't pollute global scope unless exported.

**Q: Can I use modules without bundler?**
A: Yes in browser with type="module". Bundlers (Webpack, Vite) optimize further.

---

## Summary

- **Modules**: Organize code into separate files
- **Export**: Share code with other modules
- **Import**: Use code from other modules
- **Named exports**: Multiple exports by name
- **Default export**: Single main export
- **Mixed**: Can have both default and named
- **Re-export**: Export from another module's exports
- **Alias**: Rename imports with 'as'
- **Namespace**: Import all with *
- **Index files**: Gather exports for simpler imports

**Next Step:** Learn about advanced JavaScript concepts!
