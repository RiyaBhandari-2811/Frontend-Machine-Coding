# Testing & Unit Testing with Jest

## Table of Contents
1. Testing Fundamentals
2. Setting Up Jest
3. Writing Test Suites
4. Assertions & Matchers
5. Mocking & Spies
6. Async Testing
7. Code Coverage
8. Best Practices
9. Common Patterns

---

## 1. Testing Fundamentals

### Why Test?
```javascript
// ✗ RISKY - No tests
function add(a, b) {
    return a + b;  // What if someone changes this?
}

// ✓ SAFE - With tests
function add(a, b) {
    return a + b;
}

// Every change is verified automatically
test('add should return sum', () => {
    expect(add(2, 3)).toBe(5);
});
```

### Test Structure
```javascript
// 1. Setup - Prepare test data
// 2. Execute - Run the code
// 3. Assert - Verify results

test('user should login', () => {
    // Setup
    let user = { email: 'john@example.com', password: 'secret' };
    
    // Execute
    let result = login(user.email, user.password);
    
    // Assert
    expect(result.success).toBe(true);
    expect(result.token).toBeDefined();
});
```

### Types of Tests
```javascript
// 1. Unit Tests - Test individual functions
test('sum of 2+3 is 5', () => {
    expect(add(2, 3)).toBe(5);
});

// 2. Integration Tests - Test multiple units working together
test('user can login and access profile', () => {
    let token = login('john@example.com', 'password');
    let profile = getProfile(token);
    expect(profile.name).toBe('John');
});

// 3. E2E Tests - Test entire user flow
// (Usually with Selenium, Cypress, Playwright)
// User clicks button -> Page loads -> Data displays
```

---

## 2. Setting Up Jest

### Installation
```bash
npm install --save-dev jest

# Add to package.json
"scripts": {
  "test": "jest",
  "test:watch": "jest --watch",
  "test:coverage": "jest --coverage"
}
```

### Configuration
```javascript
// jest.config.js
module.exports = {
    testEnvironment: 'jsdom',  // For DOM testing
    coveragePathIgnorePatterns: ['/node_modules/'],
    testMatch: ['**/*.test.js', '**/*.spec.js'],
    collectCoverageFrom: ['src/**/*.js']
};
```

### Basic Test File
```javascript
// math.test.js
const { add, subtract } = require('./math');

describe('Math operations', () => {
    test('add should return sum', () => {
        expect(add(2, 3)).toBe(5);
    });
    
    test('subtract should return difference', () => {
        expect(subtract(5, 2)).toBe(3);
    });
});

// Run with: npm test
```

---

## 3. Writing Test Suites

### Describe Blocks
```javascript
// Organize related tests
describe('User authentication', () => {
    describe('login', () => {
        test('should login with correct credentials', () => {
            // ...
        });
        
        test('should reject wrong password', () => {
            // ...
        });
    });
    
    describe('logout', () => {
        test('should clear session', () => {
            // ...
        });
    });
});
```

### Setup & Teardown
```javascript
describe('Database operations', () => {
    let db;
    
    // Setup before each test
    beforeEach(() => {
        db = new Database();
        db.connect();
    });
    
    // Cleanup after each test
    afterEach(() => {
        db.close();
    });
    
    // Setup once for all tests
    beforeAll(() => {
        console.log('Starting test suite');
    });
    
    // Cleanup once after all tests
    afterAll(() => {
        console.log('Finished test suite');
    });
    
    test('should insert record', () => {
        db.insert({ id: 1, name: 'John' });
        expect(db.records.length).toBe(1);
    });
});
```

---

## 4. Assertions & Matchers

### Equality
```javascript
test('equality matchers', () => {
    // Exact equality
    expect(2 + 2).toBe(4);
    
    // Deep equality
    expect({ name: 'John' }).toEqual({ name: 'John' });
    
    // Not equal
    expect(5).not.toBe(3);
});
```

### Truthiness
```javascript
test('truthiness', () => {
    expect(true).toBeTruthy();
    expect(false).toBeFalsy();
    expect(null).toBeNull();
    expect(undefined).toBeUndefined();
    expect('value').toBeDefined();
});
```

### Numbers
```javascript
test('number comparisons', () => {
    expect(5).toBeGreaterThan(4);
    expect(3).toBeLessThan(5);
    expect(5).toBeGreaterThanOrEqual(5);
    expect(3.14).toBeCloseTo(3.14159, 2);  // 2 decimal places
});
```

### Strings
```javascript
test('string matchers', () => {
    expect('hello world').toMatch(/world/);
    expect('john@example.com').toMatch(/@/);
    expect('testing').toHaveLength(7);
    expect('hello').toContain('ell');
});
```

### Arrays & Objects
```javascript
test('array and object matchers', () => {
    expect([1, 2, 3]).toContain(2);
    expect([1, 2, 3]).toHaveLength(3);
    
    let user = { name: 'John', age: 30 };
    expect(user).toHaveProperty('name');
    expect(user).toHaveProperty('name', 'John');
    
    expect({ a: 1, b: 2 }).toMatchObject({ a: 1 });
});
```

### Exceptions
```javascript
test('throwing exceptions', () => {
    // Expect function to throw
    expect(() => {
        throw new Error('Invalid input');
    }).toThrow();
    
    // Expect specific error type
    expect(() => {
        throw new TypeError('Type error');
    }).toThrow(TypeError);
    
    // Expect specific message
    expect(() => {
        throw new Error('Invalid email');
    }).toThrow('Invalid email');
});
```

---

## 5. Mocking & Spies

### Mock Functions
```javascript
test('mock function calls', () => {
    let callback = jest.fn();
    
    // Call mock function
    callback('hello');
    callback('world');
    
    // Verify it was called
    expect(callback).toHaveBeenCalled();
    expect(callback).toHaveBeenCalledTimes(2);
    expect(callback).toHaveBeenCalledWith('hello');
    
    // Get call details
    console.log(callback.mock.calls);  // [['hello'], ['world']]
    console.log(callback.mock.results);  // Return values
});
```

### Mock Return Values
```javascript
test('mock return values', () => {
    let getUserName = jest.fn();
    
    // Set return value
    getUserName.mockReturnValue('John');
    expect(getUserName()).toBe('John');
    
    // Set different return for different calls
    getUserName.mockReturnValueOnce('John');
    getUserName.mockReturnValueOnce('Jane');
    
    expect(getUserName()).toBe('John');
    expect(getUserName()).toBe('Jane');
    
    // Throw error
    let throwError = jest.fn();
    throwError.mockImplementation(() => {
        throw new Error('API error');
    });
    
    expect(throwError).toThrow('API error');
});
```

### Spying on Methods
```javascript
// Real object with spy
let user = {
    login: (email, password) => {
        return { token: 'abc123' };
    }
};

// Spy on method
let spy = jest.spyOn(user, 'login');

// Call method
user.login('john@example.com', 'password');

// Verify call
expect(spy).toHaveBeenCalledWith('john@example.com', 'password');

// Restore original
spy.mockRestore();
```

### Mocking Modules
```javascript
// math.js
export const add = (a, b) => a + b;

// calculator.test.js
jest.mock('./math');
import * as math from './math';

test('calculator uses math.add', () => {
    math.add.mockReturnValue(10);
    
    let result = calculator.calculate(5, 5);
    
    expect(math.add).toHaveBeenCalledWith(5, 5);
    expect(result).toBe(10);
});
```

---

## 6. Async Testing

### Promises
```javascript
test('async promise', () => {
    // Return promise
    return fetch('/api/user/1')
        .then(response => response.json())
        .then(data => {
            expect(data.name).toBe('John');
        });
});

// Or use resolves
test('promise resolves', () => {
    return expect(
        fetch('/api/user/1').then(r => r.json())
    ).resolves.toHaveProperty('name', 'John');
});

// Expect rejection
test('promise rejects', () => {
    return expect(
        fetch('/api/invalid')
    ).rejects.toThrow();
});
```

### Async/Await
```javascript
test('async/await', async () => {
    let response = await fetch('/api/user/1');
    let data = await response.json();
    
    expect(data.name).toBe('John');
});

// With error handling
test('async error', async () => {
    try {
        await fetch('/api/invalid');
        fail('Should have thrown');  // Never reached
    } catch (error) {
        expect(error).toBeDefined();
    }
});
```

### Callback Tests
```javascript
test('callback', (done) => {
    setTimeout(() => {
        expect(true).toBe(true);
        done();  // Tell Jest test is done
    }, 100);
});
```

### Mocking Async Calls
```javascript
test('mock API call', async () => {
    global.fetch = jest.fn();
    fetch.mockResolvedValueOnce({
        json: async () => ({ name: 'John' })
    });
    
    let response = await fetch('/api/user/1');
    let data = await response.json();
    
    expect(data.name).toBe('John');
});
```

---

## 7. Code Coverage

### Running Coverage
```bash
npm run test:coverage

# Output:
# PASS  src/math.test.js
# COVERAGE: 95.2% Lines, 92.3% Functions, 88.5% Branches
```

### Coverage Thresholds
```javascript
// jest.config.js
module.exports = {
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80
        }
    }
};
```

### Coverage Report
```bash
# Generate HTML report
jest --coverage --collectCoverageFrom="src/**/*.js"

# View in browser
# open coverage/lcov-report/index.html
```

---

## 8. Best Practices

### Test Naming
```javascript
// ✗ UNCLEAR
test('works', () => {});

// ✓ CLEAR
test('should return sum of two numbers', () => {});
test('should throw error for invalid email', () => {});
test('should login with correct credentials', () => {});
```

### One Assertion Per Test
```javascript
// ✗ MULTIPLE ASSERTIONS - Hard to debug
test('user object', () => {
    let user = createUser('John', 30);
    expect(user.name).toBe('John');
    expect(user.age).toBe(30);
    expect(user.created).toBeDefined();
});

// ✓ SEPARATE TESTS
test('user has correct name', () => {
    expect(createUser('John').name).toBe('John');
});

test('user has correct age', () => {
    expect(createUser('John', 30).age).toBe(30);
});
```

### Test Isolation
```javascript
// ✗ DEPENDENT - Tests affect each other
let globalUser;
test('create user', () => {
    globalUser = createUser('John');
    expect(globalUser.name).toBe('John');
});

test('update user', () => {
    globalUser.name = 'Jane';  // Depends on previous test!
    expect(globalUser.name).toBe('Jane');
});

// ✓ INDEPENDENT
test('create user', () => {
    let user = createUser('John');
    expect(user.name).toBe('John');
});

test('update user', () => {
    let user = createUser('John');
    user.name = 'Jane';
    expect(user.name).toBe('Jane');
});
```

---

## 9. Common Patterns

### Testing API Calls
```javascript
test('fetch user data', async () => {
    global.fetch = jest.fn();
    fetch.mockResolvedValue({
        json: async () => ({ id: 1, name: 'John' })
    });
    
    let user = await getUser(1);
    
    expect(fetch).toHaveBeenCalledWith('/api/users/1');
    expect(user.name).toBe('John');
});
```

### Testing DOM Manipulation
```javascript
test('click button updates text', () => {
    document.body.innerHTML = `
        <button id="btn">Click me</button>
        <div id="result"></div>
    `;
    
    let button = document.getElementById('btn');
    let result = document.getElementById('result');
    
    button.addEventListener('click', () => {
        result.textContent = 'Clicked!';
    });
    
    button.click();
    expect(result.textContent).toBe('Clicked!');
});
```

### Testing Classes
```javascript
class Calculator {
    constructor() {
        this.value = 0;
    }
    
    add(n) {
        this.value += n;
        return this;
    }
    
    getResult() {
        return this.value;
    }
}

test('calculator chain operations', () => {
    let calc = new Calculator();
    let result = calc.add(5).add(3).getResult();
    expect(result).toBe(8);
});
```

---

## Exercises

### Exercise 1: Write Tests
```javascript
// math.js
export function multiply(a, b) {
    return a * b;
}

// Write tests in math.test.js
```

**Solution:**
```javascript
import { multiply } from './math';

describe('multiply', () => {
    test('should return product of two numbers', () => {
        expect(multiply(3, 4)).toBe(12);
    });
    
    test('should handle negative numbers', () => {
        expect(multiply(-3, 4)).toBe(-12);
    });
    
    test('should handle zero', () => {
        expect(multiply(5, 0)).toBe(0);
    });
});
```

### Exercise 2: Mock Function
```javascript
// Create a test that mocks a callback
let processData = jest.fn();

// Call it and verify
processData([1, 2, 3]);
// Your assertion here
```

**Solution:**
```javascript
let processData = jest.fn();
processData([1, 2, 3]);

expect(processData).toHaveBeenCalled();
expect(processData).toHaveBeenCalledWith([1, 2, 3]);
```

### Exercise 3: Async Test
```javascript
// Test this async function
async function getUser(id) {
    let response = await fetch(`/api/users/${id}`);
    return response.json();
}

// Write test with mocked fetch
```

**Solution:**
```javascript
test('getUser fetches and returns user', async () => {
    global.fetch = jest.fn();
    fetch.mockResolvedValue({
        json: async () => ({ id: 1, name: 'John' })
    });
    
    let user = await getUser(1);
    
    expect(fetch).toHaveBeenCalledWith('/api/users/1');
    expect(user.name).toBe('John');
});
```

---

## Interview Questions

### Theoretical Questions

**Q1: What is unit testing?**
A: Testing individual functions or methods in isolation.

**Q2: What is a mock?**
A: Fake object that simulates real behavior for testing.

**Q3: What is test coverage?**
A: Percentage of code tested by unit tests.

**Q4: Why test asynchronous code?**
A: Ensure promises/callbacks resolve correctly and handle errors.

**Q5: What is AAA pattern?**
A: Arrange (setup), Act (execute), Assert (verify).

---

## Code-Based Interview Questions

**Q1: What will pass?**
```javascript
expect({ a: 1 }).toEqual({ a: 1 });  // ?
```
A:
```
true
(deep equality check)
```

**Q2: Predict:**
```javascript
let mock = jest.fn();
mock.mockReturnValue(5);
console.log(mock());  // ?
```
A:
```
5
```

**Q3: What is called?**
```javascript
let spy = jest.fn();
spy('hello');
expect(spy.mock.calls[0][0]).toBe('?');  // ?
```
A:
```
'hello'
```

**Q4: Spot the issue:**
```javascript
test('should login', async () => {
    let result = await login(user);
    // No expect statement!
});
```
A: Test passes even if login fails (no assertion)

**Q5: What is output?**
```javascript
expect(() => {
    throw new Error('Test');
}).toThrow('Test');  // ?
```
A:
```
true
(assertion passes)
```

---

## Follow-up Questions & Confusing Concepts

**Q: What is difference between toBe and toEqual?**
A: toBe checks strict equality (===). toEqual checks value equality.

**Q: Should I test private methods?**
A: No, test public behavior. Private methods are tested indirectly.

**Q: How much coverage is enough?**
A: Aim for 80%+ but focus on critical paths.

**Q: What is TDD?**
A: Write tests before writing code.

---

## Summary

- **Testing**: Verify code works correctly
- **Jest**: JavaScript testing framework
- **Unit tests**: Test single functions
- **Mocking**: Replace dependencies with fakes
- **Spies**: Track function calls
- **Async testing**: Test promises and async/await
- **Coverage**: Measure code tested
- **Best practices**: Clear names, isolated tests, one assertion
- **Patterns**: API testing, DOM testing, class testing
- **TDD**: Test-Driven Development approach

**Next Step:** Master code quality, refactoring, and final best practices!
