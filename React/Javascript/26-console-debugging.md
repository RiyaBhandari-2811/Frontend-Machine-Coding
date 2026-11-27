# Console Methods & Debugging

## Table of Contents
1. console.log & Variants
2. Console Styling & Formatting
3. Console Tables & Groups
4. Console Timing
5. Console Assertions
6. Debugging Techniques
7. Performance Monitoring
8. Browser DevTools
9. Best Practices

---

## 1. console.log & Variants

### Basic Logging
```javascript
// Log to console
console.log('Hello, World!');  // Simple message

// Multiple arguments
console.log('User:', 'John', 'Age:', 25);

// Log objects
let user = { name: 'John', age: 25 };
console.log(user);
// Output: { name: 'John', age: 25 }

// Log arrays
let arr = [1, 2, 3, 4, 5];
console.log(arr);
// Output: [ 1, 2, 3, 4, 5 ]
```

### Console Variants
```javascript
// Info - informational messages
console.info('Application started');

// Warn - warning messages (yellow)
console.warn('This is a warning!');

// Error - error messages (red)
console.error('An error occurred!');

// Debug - debug messages (depends on log level)
console.debug('Debug info');

// Clear console
console.clear();  // Clears all messages
```

### String Substitution
```javascript
// Use format specifiers with printf-style formatting
console.log('Hello %s, you are %d years old', 'John', 25);
// Output: Hello John, you are 25 years old

// %s = string, %d = decimal, %i = integer, %f = float
console.log('Pi is approximately %f', Math.PI);
// Output: Pi is approximately 3.141592653589793

// %o = object, %O = object (expandable)
let obj = { a: 1, b: 2 };
console.log('Object: %o', obj);
```

---

## 2. Console Styling & Formatting

### CSS Styling
```javascript
// Style text with CSS (Chrome, Firefox, Edge)
console.log('%cHello World', 'color: red; font-size: 20px;');

// Multiple styled parts
console.log('%cWarning:%c Something went wrong', 
            'color: orange; font-weight: bold;',
            'color: red;');

// Background color
console.log('%cSuccess', 'background: green; color: white; padding: 2px;');

// Common styling patterns
console.log('%c✓ Success', 'color: green; font-weight: bold;');
console.log('%c✗ Error', 'color: red; font-weight: bold;');
console.log('%c⚠ Warning', 'color: orange; font-weight: bold;');
```

### Complex Formatting
```javascript
// Multi-line formatting
console.log(`
    User Details:
    - Name: John
    - Age: 25
    - Email: john@example.com
`);

// Template literals with values
let name = 'John', age = 25;
console.log(`
    Name: ${name}
    Age: ${age}
`);
```

---

## 3. Console Tables & Groups

### console.table()
```javascript
// Display data as table
let users = [
    { name: 'John', age: 25, city: 'NYC' },
    { name: 'Jane', age: 30, city: 'LA' },
    { name: 'Bob', age: 28, city: 'Chicago' }
];

console.table(users);
// Output: Formatted table in console

// Table with specific columns
console.table(users, ['name', 'age']);  // Show only name and age

// Object keys as table
let obj = {
    user1: { age: 25, city: 'NYC' },
    user2: { age: 30, city: 'LA' }
};
console.table(obj);
```

### console.group()
```javascript
// Group related logs
console.group('User Details');
    console.log('Name: John');
    console.log('Age: 25');
    console.log('Email: john@example.com');
console.groupEnd();

// Nested groups
console.group('Database');
    console.group('Queries');
        console.log('SELECT * FROM users');
        console.log('INSERT INTO users VALUES...');
    console.groupEnd();
    console.log('Connected');
console.groupEnd();

// Collapsed groups by default
console.groupCollapsed('Details');
    console.log('Hidden by default');
console.groupEnd();
```

### console.dir()
```javascript
// Display object properties
let obj = { a: 1, b: { c: 2 }, d: 3 };
console.dir(obj);  // Shows all properties

// vs console.log()
console.log(obj);     // Might be more compact
console.dir(obj);     // Always shows properties
```

---

## 4. Console Timing

### console.time()
```javascript
// Measure performance
console.time('operation');

// Do some work
for (let i = 0; i < 1000000; i++) {
    Math.sqrt(i);
}

console.timeEnd('operation');
// Output: operation: 2.345ms

// Time multiple operations
console.time('sort');
let arr = Array.from({ length: 100000 }, () => Math.random());
arr.sort((a, b) => a - b);
console.timeEnd('sort');
// Output: sort: 15.234ms
```

### console.timeLog()
```javascript
// Log time without ending timer
console.time('download');

console.timeLog('download');  // Check progress
// Output: download: 0.123ms

setTimeout(() => {
    console.timeLog('download');
    // Output: download: 100.456ms
}, 100);

setTimeout(() => {
    console.timeEnd('download');
}, 200);
```

### Profile Performance
```javascript
// Start profiling (Chrome DevTools)
console.profile('MyProfile');

// Do work
for (let i = 0; i < 100000; i++) {
    Math.sqrt(i);
}

// End profiling
console.profileEnd('MyProfile');

// View profile in Performance tab
```

---

## 5. Console Assertions

### console.assert()
```javascript
// Log only if assertion fails
let x = 5;
console.assert(x > 10, 'x should be greater than 10');
// Output: Assertion failed: x should be greater than 10

console.assert(x > 0, 'x should be positive');
// No output (assertion passed)

// Useful for validation
function divide(a, b) {
    console.assert(b !== 0, 'Divisor cannot be zero');
    return a / b;
}

divide(10, 0);  // Shows assertion error
```

### Error Handling with Console
```javascript
// Log with context
function calculateArea(length, width) {
    console.assert(length > 0, 'Length must be positive');
    console.assert(width > 0, 'Width must be positive');
    return length * width;
}

calculateArea(-5, 10);  // Shows assertion errors
```

---

## 6. Debugging Techniques

### Conditional Logging
```javascript
// Log only in development
const isDev = process.env.NODE_ENV === 'development';

if (isDev) {
    console.log('Debug info');
}

// Or use a debug flag
const DEBUG = true;

DEBUG && console.log('User data:', userData);
```

### Structured Logging
```javascript
// Log with context and level
function log(level, message, data) {
    let timestamp = new Date().toISOString();
    let log = `[${timestamp}] [${level}] ${message}`;
    
    if (data) {
        console.log(log, data);
    } else {
        console.log(log);
    }
}

log('INFO', 'User logged in', { userId: 123 });
log('ERROR', 'API call failed', { status: 500 });

// Output:
// [2025-01-15T14:30:45.123Z] [INFO] User logged in { userId: 123 }
// [2025-01-15T14:30:46.456Z] [ERROR] API call failed { status: 500 }
```

### Debugging with Breakpoints
```javascript
// Conditional breakpoint (in browser DevTools)
// Can set condition: debugger; only runs when true

function processUser(user) {
    debugger;  // Pauses execution here
    console.log(user);
}

processUser({ name: 'John' });

// In Chrome DevTools:
// 1. Set breakpoint on line
// 2. Right-click breakpoint
// 3. Add condition: user.name === 'John'
// 4. Breakpoint only triggers for that condition
```

### Stack Trace
```javascript
// Log stack trace
function foo() {
    console.trace('Stack trace at foo:');
}

function bar() {
    foo();
}

function baz() {
    bar();
}

baz();
// Output:
// Stack trace at foo:
// baz
// bar
// foo
// (anonymous)
```

---

## 7. Performance Monitoring

### Track Memory Usage
```javascript
// Chrome only: performance.memory
if (performance.memory) {
    console.log('Memory:', {
        usedJSHeapSize: performance.memory.usedJSHeapSize,
        totalJSHeapSize: performance.memory.totalJSHeapSize,
        jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
    });
}

// Output:
// Memory: {
//     usedJSHeapSize: 1234567,
//     totalJSHeapSize: 2345678,
//     jsHeapSizeLimit: 2000000000
// }
```

### Monitor Performance Metrics
```javascript
// Measure important metrics
console.time('Total');

console.time('Render');
renderUI();
console.timeEnd('Render');

console.time('API Call');
fetchData();
console.timeEnd('API Call');

console.timeEnd('Total');

// Output:
// Render: 25.123ms
// API Call: 234.456ms
// Total: 259.579ms
```

### Console Profiling
```javascript
// Profile function execution
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

console.profile('fib');
let result = fibonacci(10);
console.profileEnd('fib');

// View profile in Chrome DevTools > Performance tab
```

---

## 8. Browser DevTools

### Debugger Keyword
```javascript
// Pauses execution when DevTools open
function criticalOperation() {
    debugger;  // Execution pauses here
    return calculateSomething();
}

// Only pauses if DevTools open (dev mode)
if (isDevelopment) {
    debugger;
}
```

### Console API in DevTools
```javascript
// In browser console:

// Get element
document.querySelector('.button')

// Monitor element
monitorEvents(element, 'click')  // Logs all events

// Copy to clipboard
copy(variable)

// Get element in console
// 1. Right-click element in Inspector
// 2. Select "Copy JS path"
// 3. Paste in console

// Get performance data
performance.getEntriesByType('navigation')
performance.getEntriesByType('resource')
```

---

## 9. Best Practices

### Production vs Development
```javascript
// Development: Verbose logging
const isDev = process.env.NODE_ENV === 'development';

function log(...args) {
    if (isDev) {
        console.log(...args);
    }
}

log('Debug info');  // Only in development

// Or use logger library
// import logger from 'bunyan' or 'winston'
```

### Avoid Console in Production
```javascript
// ✗ WRONG - Logs to console in production
console.log('User data:', userData);

// ✓ CORRECT - Only in development
if (isDev) {
    console.log('User data:', userData);
}

// Use logger service
logger.debug('User data:', userData);  // May not log in production
```

### Remove Debug Logs Before Deploy
```javascript
// ✗ WRONG - Leaves debug code
console.log('API Response:', response);
console.log('Processing complete');

// ✓ CORRECT - Clean code
// Remove all console.log before production
// Or use build tool to strip them
```

### Use Appropriate Log Levels
```javascript
// Info: Informational messages
console.info('User logged in');

// Warn: Warning messages
console.warn('API rate limit approaching');

// Error: Error messages
console.error('Request failed:', error);

// Debug: Detailed debug info
console.debug('Variable state:', state);

// Not Recommended: Just use console.log
console.log('This should be .info or .warn');
```

---

## Exercises

### Exercise 1: Custom Logger
```javascript
// Create logger with levels
class Logger {
    // Your code
}

let logger = new Logger();
logger.info('Starting app');
logger.warn('Low memory');
logger.error('Connection failed');
```

**Solution:**
```javascript
class Logger {
    info(msg) { console.log(`[INFO] ${msg}`); }
    warn(msg) { console.warn(`[WARN] ${msg}`); }
    error(msg) { console.error(`[ERROR] ${msg}`); }
}
```

### Exercise 2: Performance Timer
```javascript
// Create reusable timer
function createTimer(name) {
    // Your code
}

let timer = createTimer('download');
// ... some work
console.log(timer.elapsed());  // Time passed
```

**Solution:**
```javascript
function createTimer(name) {
    let start = performance.now();
    return {
        elapsed: () => performance.now() - start,
        log: () => console.log(`${name}: ${performance.now() - start}ms`)
    };
}
```

### Exercise 3: Table Display
```javascript
// Display formatted data
function displayUsers(users) {
    // Your code
}

let users = [
    { id: 1, name: 'John', active: true },
    { id: 2, name: 'Jane', active: false }
];

displayUsers(users);
```

**Solution:**
```javascript
function displayUsers(users) {
    console.table(users);
}
```

---

## Interview Questions

### Theoretical Questions

**Q1: What's the difference between console.log and console.error?**
A: console.error displays in red and may include stack trace.

**Q2: Can you style console output?**
A: Yes, with %c and CSS (Chrome, Firefox, Edge support).

**Q3: What is console.assert used for?**
A: Log only if condition is false (validation).

**Q4: How do you measure execution time?**
A: Use console.time() and console.timeEnd().

**Q5: What is debugger keyword?**
A: Pauses code execution when DevTools is open.

---

## Code-Based Interview Questions

**Q1: What will be output?**
```javascript
console.log('%cRed', 'color: red;');
// ?
```
A:
```
Red (displayed in red color)
```

**Q2: Predict:**
```javascript
console.time('x');
console.timeEnd('x');
// ?
```
A:
```
x: 0.123ms (or similar small number)
```

**Q3: What will be logged?**
```javascript
console.assert(false, 'Failed');
console.assert(true, 'Passed');
// ?
```
A:
```
Assertion failed: Failed
(Nothing for second assert)
```

**Q4: Spot the issue:**
```javascript
console.log('x: %d', '25');  // Expects number, gets string
```
A: String will be coerced to number, outputs: x: 25

**Q5: What is output?**
```javascript
let arr = [1, 2, 3];
console.table(arr);
// ?
```
A:
```
Formatted table:
(index) | Values
   0    |   1
   1    |   2
   2    |   3
```

---

## Follow-up Questions & Confusing Concepts

**Q: Does console.log slow down code?**
A: Minimally, but remove in production for best performance.

**Q: Can I log to file from browser?**
A: No, use backend logging service (Sentry, LogRocket, etc).

**Q: What's the difference between log and debug?**
A: Both similar, debug requires meeting log level threshold.

**Q: Can I add breakpoints programmatically?**
A: Yes, use debugger; keyword or DevTools conditionals.

---

## Summary

- **console.log()**: Basic logging
- **console.info/warn/error**: Log levels
- **console.table()**: Display data as table
- **console.group()**: Group related logs
- **console.time()**: Measure execution time
- **console.assert()**: Log if condition false
- **console.trace()**: Show stack trace
- **%c**: Style console output with CSS
- **debugger**: Pause execution in DevTools
- **Best practice**: Remove all logs before production

**Next Step:** Master Math operations and built-in functions!
