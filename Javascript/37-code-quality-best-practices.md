# Code Quality & Best Practices

## Table of Contents
1. Code Style & Formatting
2. Naming Conventions
3. Documentation & Comments
4. Error Handling
5. Performance Principles
6. Security Practices
7. Code Review Checklist
8. Refactoring Techniques
9. Final Summary

---

## 1. Code Style & Formatting

### Consistent Formatting
```javascript
// ✗ INCONSISTENT
function add(a,b){return a+b}
let result=add(2,3)
if(result>5){console.log(result)}

// ✓ CONSISTENT
function add(a, b) {
    return a + b;
}

let result = add(2, 3);

if (result > 5) {
    console.log(result);
}
```

### Use Linter (ESLint)
```javascript
// .eslintrc.json
{
    "env": {
        "browser": true,
        "node": true,
        "es2021": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 12,
        "sourceType": "module"
    },
    "rules": {
        "indent": ["error", 4],
        "linebreak-style": ["error", "unix"],
        "quotes": ["error", "single"],
        "semi": ["error", "always"]
    }
}

// Run linter
// npm install --save-dev eslint
// npm run lint
```

### Prettier for Formatting
```bash
npm install --save-dev prettier

# Format files
npx prettier --write src/**/*.js

# .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80
}
```

---

## 2. Naming Conventions

### Variable Names
```javascript
// ✗ UNCLEAR
let d = new Date();
let x = arr.length;
let temp = 'john';

// ✓ CLEAR
let currentDate = new Date();
let arrayLength = arr.length;
let userName = 'john';
```

### Function Names
```javascript
// ✗ UNCLEAR
function process(data) {}
function do_something() {}
function h() {}

// ✓ CLEAR - Use verbs for functions
function processUserData(data) {}
function validateEmail(email) {}
function fetchUserProfile(userId) {}
```

### Boolean Names
```javascript
// ✗ UNCLEAR
let status = true;
let valid = true;
let count = 1;

// ✓ CLEAR - Use is/has/should prefix
let isActive = true;
let hasPermission = true;
let shouldRender = true;
```

### Constants
```javascript
// ✗ UNCLEAR
const pi = 3.14159;
const max = 100;

// ✓ CLEAR - Use UPPERCASE for constants
const PI = 3.14159;
const MAX_RETRIES = 100;
const API_BASE_URL = 'https://api.example.com';
```

### Class Names
```javascript
// ✗ UNCLEAR
class user {}
class data_processor {}

// ✓ CLEAR - Use PascalCase
class User {}
class DataProcessor {}
class APIClient {}
```

---

## 3. Documentation & Comments

### Code Comments
```javascript
// ✗ UNNECESSARY COMMENTS
let x = 5;  // Set x to 5
x++;  // Increment x
console.log(x);  // Print x

// ✓ MEANINGFUL COMMENTS
// Max number of connection retries before failure
const MAX_RETRIES = 5;

// Exponential backoff: start at 100ms, double each retry
let backoffMs = 100 * Math.pow(2, retryCount);
```

### JSDoc Comments
```javascript
/**
 * Calculate sum of two numbers
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} Sum of a and b
 * @example
 * add(2, 3);  // Returns 5
 */
function add(a, b) {
    return a + b;
}

/**
 * Fetch user data from API
 * @async
 * @param {string} userId - User ID to fetch
 * @returns {Promise<User>} User object
 * @throws {Error} If user not found
 */
async function getUser(userId) {
    // ...
}

/**
 * User class representing a person
 * @class
 * @param {string} name - User's name
 * @param {number} age - User's age
 */
class User {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
}
```

### README Documentation
```markdown
# Project Name

## Description
Brief description of what project does.

## Installation
npm install

## Usage
npm start

## API Reference

### getUser(id)
Fetches user data by ID.
- **Parameters**: id (string)
- **Returns**: Promise<User>
- **Throws**: Error if user not found

## Testing
npm test

## Contributing
Instructions for contributing.

## License
MIT
```

---

## 4. Error Handling

### Fail Fast
```javascript
// ✗ RISKY - Continues with invalid data
function processUser(user) {
    console.log(user.name);  // Might crash
    console.log(user.email);  // Might crash
    return user;
}

// ✓ SAFE - Validate early
function processUser(user) {
    if (!user) {
        throw new Error('User is required');
    }
    if (!user.name) {
        throw new Error('User name is required');
    }
    if (!user.email) {
        throw new Error('User email is required');
    }
    
    console.log(user.name);
    console.log(user.email);
    return user;
}
```

### Meaningful Errors
```javascript
// ✗ UNCLEAR
throw new Error('Error');
throw new Error('Invalid');

// ✓ CLEAR
throw new Error('Email format is invalid. Expected: user@domain.com');
throw new Error('User not found with ID: 123');
throw new Error('Database connection failed after 5 retries');
```

### Error Recovery
```javascript
// ✗ NO RECOVERY
async function fetchUser(id) {
    return fetch(`/api/users/${id}`).then(r => r.json());
}

// ✓ WITH RECOVERY
async function fetchUserWithRetry(id, maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            let response = await fetch(`/api/users/${id}`);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            if (attempt === maxRetries) {
                throw error;
            }
            // Wait before retry (exponential backoff)
            await new Promise(r => setTimeout(r, Math.pow(2, attempt) * 1000));
        }
    }
}
```

---

## 5. Performance Principles

### Avoid Premature Optimization
```javascript
// ✗ PREMATURE - Optimize later if needed
// Complex algorithm but not proven to be bottleneck

// ✓ CORRECT - Optimize only when necessary
// 1. Write clear code
// 2. Profile to find bottlenecks
// 3. Optimize only bottlenecks
// 4. Verify improvement
```

### Memory Leaks
```javascript
// ✗ MEMORY LEAK
class Cache {
    constructor() {
        this.data = {};
    }
    
    set(key, value) {
        this.data[key] = value;  // Never cleaned!
    }
}

// ✓ CORRECT
class Cache {
    constructor(maxSize = 100) {
        this.data = {};
        this.maxSize = maxSize;
    }
    
    set(key, value) {
        if (Object.keys(this.data).length >= this.maxSize) {
            // Remove oldest entry
            let oldestKey = Object.keys(this.data)[0];
            delete this.data[oldestKey];
        }
        this.data[key] = value;
    }
}
```

### Lazy Loading
```javascript
// ✗ SLOW - Load everything upfront
class App {
    constructor() {
        this.users = fetchAllUsers();  // Might be huge
        this.posts = fetchAllPosts();  // Might be huge
        this.comments = fetchAllComments();  // Might be huge
    }
}

// ✓ FAST - Load on demand
class App {
    constructor() {
        this._users = null;
        this._posts = null;
    }
    
    getUsers() {
        if (!this._users) {
            this._users = fetchAllUsers();
        }
        return this._users;
    }
    
    getPosts() {
        if (!this._posts) {
            this._posts = fetchAllPosts();
        }
        return this._posts;
    }
}
```

---

## 6. Security Practices

### Input Validation
```javascript
// ✗ NO VALIDATION
app.post('/api/user', (req, res) => {
    let user = req.body;
    db.insert(user);
});

// ✓ VALIDATED
app.post('/api/user', (req, res) => {
    let { email, name } = req.body;
    
    // Validate email
    if (!email.match(/@/)) {
        return res.status(400).json({ error: 'Invalid email' });
    }
    
    // Validate name
    if (!name || name.length < 2 || name.length > 100) {
        return res.status(400).json({ error: 'Invalid name' });
    }
    
    db.insert({ email, name });
    res.json({ success: true });
});
```

### Avoid Dangerous Functions
```javascript
// ✗ DANGEROUS
let userCode = getUserInput();
eval(userCode);  // NEVER DO THIS!

// ✗ DANGEROUS
let template = getUserInput();
new Function(template)();  // Also dangerous

// ✗ DANGEROUS
element.innerHTML = userInput;  // XSS vulnerability

// ✓ SAFE
element.textContent = userInput;  // Safe
// Or use template literals with escaping
```

---

## 7. Code Review Checklist

### Functionality
```javascript
// ✓ Does code work as intended?
// ✓ Are edge cases handled?
// ✓ Are error conditions covered?
// ✓ Does it integrate with existing code?

// Example issues:
// - Off-by-one errors in loops
// - Missing null checks
// - Incorrect type conversions
// - Race conditions
```

### Performance
```javascript
// ✓ Is algorithm efficient?
// ✓ Are there obvious bottlenecks?
// ✓ Is data duplicated unnecessarily?
// ✓ Are external calls minimized?

// Example issues:
// - O(n²) algorithm when O(n) exists
// - Loading entire dataset when paginating
// - Multiple DOM manipulations in loop
```

### Security
```javascript
// ✓ Is user input validated?
// ✓ Are secrets handled securely?
// ✓ Is data encrypted in transit/storage?
// ✓ Are permissions checked?

// Example issues:
// - SQL injection vulnerability
// - Hardcoded API keys
// - Missing CSRF protection
```

### Code Quality
```javascript
// ✓ Is code readable and maintainable?
// ✓ Are variable names clear?
// ✓ Is code properly formatted?
// ✓ Are there duplicated sections?

// Example issues:
// - Unclear variable names
// - Functions too long (>50 lines)
// - Commented-out code
// - Magic numbers
```

---

## 8. Refactoring Techniques

### Extract Function
```javascript
// ✗ LONG FUNCTION - Hard to test
function processOrder(order) {
    // Validate order
    if (!order.id || !order.items || order.items.length === 0) {
        throw new Error('Invalid order');
    }
    
    // Calculate total
    let total = 0;
    for (let item of order.items) {
        total += item.price * item.quantity;
    }
    
    // Apply discount
    if (total > 1000) {
        total *= 0.9;
    }
    
    // Save order
    db.saveOrder({ ...order, total });
    
    return total;
}

// ✓ REFACTORED - Smaller, testable functions
function validateOrder(order) {
    if (!order.id || !order.items || order.items.length === 0) {
        throw new Error('Invalid order');
    }
}

function calculateTotal(items) {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function applyDiscount(total) {
    return total > 1000 ? total * 0.9 : total;
}

function processOrder(order) {
    validateOrder(order);
    let total = calculateTotal(order.items);
    total = applyDiscount(total);
    db.saveOrder({ ...order, total });
    return total;
}
```

### Reduce Complexity
```javascript
// ✗ COMPLEX - Many if/else
function getStatus(order) {
    if (order.paid) {
        if (order.shipped) {
            if (order.delivered) {
                return 'Delivered';
            }
            return 'In transit';
        }
        return 'Paid';
    } else {
        if (order.cancelled) {
            return 'Cancelled';
        }
        return 'Pending payment';
    }
}

// ✓ SIMPLE - Using early returns
function getStatus(order) {
    if (order.cancelled) return 'Cancelled';
    if (order.delivered) return 'Delivered';
    if (order.shipped) return 'In transit';
    if (order.paid) return 'Paid';
    return 'Pending payment';
}
```

### Use Constants
```javascript
// ✗ MAGIC NUMBERS
function validatePassword(password) {
    if (password.length < 8) return false;
    if (password.length > 128) return false;
    // ...
}

// ✓ NAMED CONSTANTS
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 128;

function validatePassword(password) {
    if (password.length < MIN_PASSWORD_LENGTH) return false;
    if (password.length > MAX_PASSWORD_LENGTH) return false;
    // ...
}
```

---

## 9. Final Summary

### Principles to Follow
```javascript
// 1. Keep It Simple (KISS)
// Don't over-engineer. Simple code is easier to maintain.

// 2. DRY - Don't Repeat Yourself
// Extract common code to functions or modules.

// 3. YAGNI - You Ain't Gonna Need It
// Don't add features you don't need yet.

// 4. SOLID Principles
// Single Responsibility, Open/Closed, Liskov, Interface Segregation, Dependency Inversion

// 5. Boy Scout Rule
// Leave code better than you found it.

// 6. Fail Fast
// Validate inputs and throw errors early.

// 7. Write Tests
// Test your code to ensure it works.

// 8. Document Code
// Comments and JSDoc help future developers.

// 9. Review Code
// Get feedback from team members.

// 10. Refactor Regularly
// Improve code quality over time.
```

### Development Workflow
```javascript
// 1. Write tests first (TDD)
// 2. Write minimal code to pass tests
// 3. Refactor to improve quality
// 4. Code review
// 5. Merge to main branch
// 6. Deploy to production
// 7. Monitor for issues
// 8. Iterate and improve
```

### Tools for Quality
```bash
# Linting
npm install --save-dev eslint

# Formatting
npm install --save-dev prettier

# Testing
npm install --save-dev jest

# Type checking
npm install --save-dev typescript

# Security scanning
npm audit

# Code coverage
jest --coverage
```

---

## Exercises

### Exercise 1: Refactor Code
```javascript
// Refactor this to remove duplication
function getUserName(user) {
    if (!user) return 'Unknown';
    if (!user.firstName) return 'Unknown';
    return user.firstName;
}

function getUserAge(user) {
    if (!user) return 0;
    if (!user.age) return 0;
    return user.age;
}
```

**Solution:**
```javascript
function getProperty(obj, key, defaultValue) {
    return obj && obj[key] ? obj[key] : defaultValue;
}

function getUserName(user) {
    return getProperty(user, 'firstName', 'Unknown');
}

function getUserAge(user) {
    return getProperty(user, 'age', 0);
}
```

### Exercise 2: Add Error Handling
```javascript
// Add proper error handling
function parseJSON(json) {
    return JSON.parse(json);
}
```

**Solution:**
```javascript
function parseJSON(json) {
    if (!json || typeof json !== 'string') {
        throw new Error('Invalid JSON: input must be a string');
    }
    
    try {
        return JSON.parse(json);
    } catch (error) {
        throw new Error(`Failed to parse JSON: ${error.message}`);
    }
}
```

### Exercise 3: Document Code
```javascript
// Add JSDoc comments
function mergeArrays(arr1, arr2) {
    return [...new Set([...arr1, ...arr2])];
}
```

**Solution:**
```javascript
/**
 * Merge two arrays and remove duplicates
 * @param {Array} arr1 - First array
 * @param {Array} arr2 - Second array
 * @returns {Array} Merged array with unique values
 * @example
 * mergeArrays([1, 2], [2, 3]);  // Returns [1, 2, 3]
 */
function mergeArrays(arr1, arr2) {
    return [...new Set([...arr1, ...arr2])];
}
```

---

## Interview Questions

### Theoretical Questions

**Q1: What is technical debt?**
A: Shortcuts taken that hurt code quality and maintainability.

**Q2: What is refactoring?**
A: Improving code structure without changing its behavior.

**Q3: What is code smell?**
A: Indicator of potential design issues in code.

**Q4: What is SOLID?**
A: Principles for writing maintainable object-oriented code.

**Q5: Why write tests?**
A: Verify code works, catch regressions, enable refactoring safely.

---

## Code-Based Interview Questions

**Q1: Identify the issue:**
```javascript
function add(a, b) {
    return a + b;  // Implicit number coercion!
}
add('5', '3');  // ?
```
A:
```
'53'
(string concatenation, not addition)
```

**Q2: What's wrong?**
```javascript
let cache = {};
function memoize(fn) {
    return function(...args) {
        let key = JSON.stringify(args);
        if (!cache[key]) {
            cache[key] = fn(...args);
        }
        return cache[key];
    };
}
// Memory leak: cache never cleared!
```
A: Cache grows indefinitely

**Q3: Spot the bug:**
```javascript
function processArray(arr) {
    for (let i = 0; i < arr.length; i++) {
        arr.splice(i, 1);  // Modifying while iterating!
    }
}
```
A: Skips elements

**Q4: What is output?**
```javascript
let obj = { a: 1 };
// Make it private
// Your solution?
```
A: Use IIFE or WeakMap

**Q5: Predict:**
```javascript
// Which is more efficient?
arr.map(x => x * 2).filter(x => x > 5);
arr.filter(x => x * 2 > 5).map(x => x * 2);
```
A: Depends on data, but second may short-circuit sooner

---

## Follow-up Questions & Confusing Concepts

**Q: When should I write comments?**
A: When WHY is not obvious from code. Not when WHAT is obvious.

**Q: Is code coverage of 100% necessary?**
A: No, 80%+ is good. Focus on critical paths.

**Q: Should I optimize for readability or performance?**
A: Readability first. Optimize bottlenecks later if needed.

**Q: How often should I refactor?**
A: Continuously. Leave code better than you found it.

---

## Summary

- **Code Style**: Use linter (ESLint), formatter (Prettier)
- **Naming**: Clear names for variables, functions, classes
- **Documentation**: JSDoc, README, meaningful comments
- **Error Handling**: Validate input, fail fast, meaningful errors
- **Performance**: Avoid premature optimization, profile first
- **Security**: Validate input, avoid dangerous functions
- **Code Review**: Check functionality, performance, security, quality
- **Refactoring**: Extract functions, reduce complexity, use constants
- **SOLID Principles**: Write maintainable, testable code
- **Testing**: Test-driven development for quality assurance

**You have completed 37 comprehensive JavaScript topics! Congratulations! 🎉**

**Continue mastering JavaScript with:**
- Advanced frameworks (React, Vue, Angular)
- Backend development (Node.js, Express)
- Database design and optimization
- System design and architecture
- Real-world projects and contribution to open source
