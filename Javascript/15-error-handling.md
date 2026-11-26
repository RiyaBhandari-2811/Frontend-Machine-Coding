# Error Handling in JavaScript

## Table of Contents
1. Types of Errors
2. Try-Catch-Finally
3. Error Object
4. Throwing Errors
5. Custom Errors
6. Error Handling Patterns
7. Async Error Handling
8. Best Practices
9. Debugging

---

## 1. Types of Errors

### Syntax Errors
```javascript
// Syntax errors caught at parse time
let x = {  // Missing closing brace - SyntaxError
let y = "unclosed string;  // SyntaxError

// These prevent code from running at all
```

### Runtime Errors
```javascript
// ReferenceError - Variable not defined
console.log(undefinedVariable);  // ReferenceError

// TypeError - Wrong type operation
let x = 5;
x.toUpperCase();  // TypeError: x.toUpperCase is not a function

let obj = null;
obj.property;  // TypeError: Cannot read property of null

// RangeError - Value out of range
let arr = new Array(-1);  // RangeError: Invalid array length
```

### Logic Errors
```javascript
// No error thrown, but code doesn't work as expected
function calculateDiscount(price, discount) {
    return price - discount;  // Should multiply by discount
}

calculateDiscount(100, 0.1);  // Returns 99.9 instead of 90
// Logic is wrong, but no error thrown
```

### Common Error Types
```javascript
// ReferenceError
let x = y;  // y not defined

// TypeError
null.foo;  // Cannot read property

// SyntaxError
eval("bad code!");

// RangeError
let arr = new Array(-1);

// URIError
decodeURIComponent("%");

// Error - Generic
throw new Error("Something went wrong");
```

---

## 2. Try-Catch-Finally

### Basic Try-Catch
```javascript
try {
    // Code that might throw error
    let result = JSON.parse("invalid json");
    console.log(result);
} catch (error) {
    // Handle error
    console.log("Error caught:", error.message);
    console.log("Error type:", error.name);
}

// Output: Error caught: Unexpected token i in JSON at position 0
// Program continues after catch block
```

### Catch Block Parameters
```javascript
try {
    throw new Error("Something broke!");
} catch (error) {
    // error object contains information
    console.log(error.name);           // "Error"
    console.log(error.message);        // "Something broke!"
    console.log(error.stack);          // Stack trace
    
    // Can be any value
    console.log(error instanceof Error);  // true
}
```

### Finally Block
```javascript
// Finally always runs (even if error or return)
try {
    console.log("Try");
    // throw new Error("Error!");
    return "Return from try";
} catch (error) {
    console.log("Catch:", error.message);
    return "Return from catch";
} finally {
    console.log("Finally");  // Always runs!
}

// Output:
// Try
// Finally
// Returns "Return from try"
```

### Try-Catch-Finally Pattern
```javascript
let file = null;

try {
    // Open file
    file = openFile("data.txt");
    // Process file
    let data = processFile(file);
    return data;
} catch (error) {
    // Handle error
    console.error("Error processing file:", error);
    return null;
} finally {
    // Cleanup (always runs)
    if (file) {
        closeFile(file);  // Always close file
    }
}

// File always closed whether success or error
```

### Nested Try-Catch
```javascript
try {
    try {
        throw new Error("Inner error");
    } catch (innerError) {
        console.log("Inner catch:", innerError.message);
        throw innerError;  // Re-throw to outer catch
    }
} catch (outerError) {
    console.log("Outer catch:", outerError.message);
}

// Output:
// Inner catch: Inner error
// Outer catch: Inner error
```

---

## 3. Error Object

### Error Properties
```javascript
try {
    throw new Error("Something went wrong");
} catch (error) {
    // Error object properties
    console.log(error.name);      // "Error"
    console.log(error.message);   // "Something went wrong"
    console.log(error.stack);     // Stack trace string
    
    // Browser-specific
    console.log(error.fileName);  // File where error occurred
    console.log(error.lineNumber); // Line number
}
```

### Accessing Stack Trace
```javascript
try {
    function level3() {
        throw new Error("Error at level 3");
    }
    
    function level2() {
        level3();
    }
    
    function level1() {
        level2();
    }
    
    level1();
} catch (error) {
    // Stack shows call chain
    console.log(error.stack);
    // Error: Error at level 3
    //   at level3 (file.js:2:11)
    //   at level2 (file.js:5:5)
    //   at level1 (file.js:8:5)
}
```

---

## 4. Throwing Errors

### Throw Statement
```javascript
// Can throw any value
throw "error message";           // string
throw 42;                        // number
throw { error: "Custom" };       // object
throw new Error("Error!");       // Error object

// Best practice: throw Error object
function validateAge(age) {
    if (age < 0) {
        throw new Error("Age cannot be negative");
    }
    return age;
}

try {
    validateAge(-5);
} catch (error) {
    console.log(error.message);  // "Age cannot be negative"
}
```

### Conditional Throwing
```javascript
function processUser(user) {
    if (!user) {
        throw new Error("User is required");
    }
    
    if (!user.name) {
        throw new Error("User must have a name");
    }
    
    if (user.age < 18) {
        throw new Error("User must be 18+");
    }
    
    return user;
}

try {
    processUser({ name: "John" });  // Throws: User must be 18+
} catch (error) {
    console.error(error.message);
}
```

### Re-throwing Errors
```javascript
try {
    // Some code
    JSON.parse("invalid");
} catch (error) {
    // Log error
    console.error("Error:", error);
    
    // Do something specific
    if (error instanceof SyntaxError) {
        // Handle syntax error
    } else {
        // Re-throw if can't handle
        throw error;
    }
}
```

---

## 5. Custom Errors

### Creating Custom Error Classes
```javascript
// Extend Error class
class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = "ValidationError";
    }
}

// Use custom error
try {
    throw new ValidationError("Invalid input");
} catch (error) {
    console.log(error.name);     // "ValidationError"
    console.log(error.message);  // "Invalid input"
    console.log(error instanceof ValidationError);  // true
}
```

### Multiple Custom Errors
```javascript
class NotFoundError extends Error {
    constructor(resource) {
        super(`${resource} not found`);
        this.name = "NotFoundError";
    }
}

class PermissionError extends Error {
    constructor(action) {
        super(`Permission denied for ${action}`);
        this.name = "PermissionError";
    }
}

try {
    throw new NotFoundError("User");
} catch (error) {
    if (error instanceof NotFoundError) {
        console.log("User not found");
    } else if (error instanceof PermissionError) {
        console.log("Permission denied");
    }
}
```

### Error with Additional Properties
```javascript
class NetworkError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = "NetworkError";
        this.statusCode = statusCode;
        this.timestamp = new Date();
    }
}

try {
    throw new NetworkError("Server error", 500);
} catch (error) {
    console.log(error.message);    // "Server error"
    console.log(error.statusCode); // 500
    console.log(error.timestamp);  // Date
}
```

---

## 6. Error Handling Patterns

### Input Validation
```javascript
function createUser(name, email, age) {
    // Validate inputs
    if (!name || typeof name !== 'string') {
        throw new Error("Name must be a non-empty string");
    }
    
    if (!email || !email.includes('@')) {
        throw new Error("Invalid email");
    }
    
    if (age < 18) {
        throw new Error("Must be 18+");
    }
    
    return { name, email, age };
}

try {
    let user = createUser("John", "john@example.com", 25);
    console.log("User created:", user);
} catch (error) {
    console.error("Failed to create user:", error.message);
}
```

### Parse and Fallback
```javascript
function parseJSON(jsonString, fallback = null) {
    try {
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("JSON parse error:", error.message);
        return fallback;
    }
}

let data = parseJSON("invalid json", {});  // Returns {}
let data2 = parseJSON('{"name": "John"}'); // Returns object
```

### Wrapper for Safety
```javascript
function safeExecute(fn, ...args) {
    try {
        return { success: true, result: fn(...args) };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

function riskyOperation() {
    throw new Error("Something failed");
}

let result = safeExecute(riskyOperation);
console.log(result);  // { success: false, error: "Something failed" }
```

---

## 7. Async Error Handling

### Try-Catch with Async/Await
```javascript
async function fetchUserData(userId) {
    try {
        // Await throws if promise rejects
        let response = await fetch(`/api/users/${userId}`);
        
        if (!response.ok) {
            throw new Error("HTTP " + response.status);
        }
        
        let user = await response.json();
        return user;
    } catch (error) {
        // Catches fetch errors AND thrown errors
        console.error("Error fetching user:", error.message);
        return null;
    }
}

// Call async function
fetchUserData(1).then(user => {
    if (user) {
        console.log(user);
    }
});
```

### Promise Catch
```javascript
// Promise chain error handling
fetch('/api/data')
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => {
        console.error("Error:", error.message);
    });

// Error can come from any step
```

### Multiple Awaits
```javascript
async function getUserWithPosts(userId) {
    try {
        // Await multiple operations
        let userResponse = await fetch(`/api/users/${userId}`);
        if (!userResponse.ok) throw new Error("Failed to fetch user");
        let user = await userResponse.json();
        
        let postsResponse = await fetch(`/api/users/${userId}/posts`);
        if (!postsResponse.ok) throw new Error("Failed to fetch posts");
        let posts = await postsResponse.json();
        
        return { user, posts };
    } catch (error) {
        console.error("Error:", error.message);
        return null;
    }
}
```

---

## 8. Best Practices

### Never Swallow Errors Silently
```javascript
// BAD - Silent failure
try {
    risky();
} catch (error) {
    // Doing nothing!
}

// BETTER - Log error
try {
    risky();
} catch (error) {
    console.error("Error:", error);
}

// BEST - Log and handle appropriately
try {
    risky();
} catch (error) {
    console.error("Operation failed:", error);
    // Notify user or take action
}
```

### Be Specific with Catch
```javascript
// AVOID - Catching everything
try {
    let user = getUser();
    return user.name;
} catch (error) {
    // Could be "getUser" error or property access error
    console.log("Error");
}

// BETTER - Check error type
try {
    let user = getUser();
    return user.name;
} catch (error) {
    if (error instanceof TypeError) {
        console.error("Invalid user object");
    } else {
        console.error("Failed to get user");
    }
}
```

### Use Specific Error Types
```javascript
// Use appropriate Error types
throw new TypeError("Expected string");      // For type issues
throw new RangeError("Value out of range");  // For range issues
throw new SyntaxError("Invalid format");     // For format issues
throw new Error("Generic error message");    // For other errors
```

---

## 9. Debugging

### Using Console Methods
```javascript
// Different logging levels
console.log("Info message");
console.warn("Warning message");
console.error("Error message");

// Better error handling
try {
    risky();
} catch (error) {
    // All useful info
    console.error("Error caught:");
    console.error("  Type:", error.name);
    console.error("  Message:", error.message);
    console.error("  Stack:", error.stack);
}
```

### Browser Debugger
```javascript
// Set breakpoint
function problematicFunction() {
    debugger;  // Execution pauses here when debugger open
    // Now step through code
}

// Open DevTools (F12) → Sources tab → Set breakpoints
```

---

## Exercises

### Exercise 1: Input Validation
```javascript
// Create function that validates email
// Throw error if invalid

function validateEmail(email) {
    // Your code
}

try {
    validateEmail("invalid");
} catch (error) {
    console.log(error.message);
}
```

**Solution:**
```javascript
function validateEmail(email) {
    if (!email || typeof email !== 'string') {
        throw new Error("Email must be a string");
    }
    if (!email.includes('@') || !email.includes('.')) {
        throw new Error("Invalid email format");
    }
    return email;
}
```

### Exercise 2: Safe JSON Parse
```javascript
// Create function that safely parses JSON
// Return fallback if invalid

function safeJsonParse(jsonString, fallback = {}) {
    // Your code
}

console.log(safeJsonParse('{"name":"John"}'));  // Object
console.log(safeJsonParse("invalid"));           // {}
```

**Solution:**
```javascript
function safeJsonParse(jsonString, fallback = {}) {
    try {
        return JSON.parse(jsonString);
    } catch (error) {
        console.error("JSON parse failed:", error.message);
        return fallback;
    }
}
```

### Exercise 3: Custom Error Class
```javascript
// Create custom ApiError class
// Should extend Error
// Should have statusCode property

class ApiError extends Error {
    // Your code
}

try {
    throw new ApiError("Not found", 404);
} catch (error) {
    console.log(error.message);
    console.log(error.statusCode);
}
```

**Solution:**
```javascript
class ApiError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = "ApiError";
        this.statusCode = statusCode;
    }
}
```

---

## Interview Questions

### Theoretical Questions

**Q1: What's the difference between throw and return?**
A: throw stops execution and passes control to catch block. return stops function and returns value. throw passes error up chain.

**Q2: Does finally block always run?**
A: Yes, except if script crashes or return in finally. Runs after try or catch.

**Q3: Can I catch errors in async functions?**
A: Yes, with try-catch or .catch() on Promise. await throws if promise rejects.

**Q4: What's the difference between Error types?**
A: TypeError for type issues, RangeError for range, SyntaxError for format, ReferenceError for undefined variables.

**Q5: Should I throw or log errors?**
A: Throw for exceptional conditions that must be handled. Log for informational purposes. Do both for important errors.

---

## Code-Based Interview Questions

**Q1: What will be output?**
```javascript
try {
    throw new Error("Error!");
} catch (error) {
    console.log(error.message);
} finally {
    console.log("Finally");
}

// ?
```
A:
```
Error!
Finally
```

**Q2: Predict:**
```javascript
function test() {
    try {
        return "try";
    } finally {
        return "finally";
    }
}

console.log(test());  // ?
```
A:
```
"finally"
```
Explanation: finally return overrides try return

**Q3: What will be logged?**
```javascript
try {
    JSON.parse("invalid");
} catch (error) {
    console.log(error.name);  // ?
}
```
A:
```
"SyntaxError"
```

**Q4: Spot the issue:**
```javascript
try {
    // Some code
} catch {
    // Error object not available
    console.log(error);  // ✗ Error not defined
}
```
A: Catch needs parameter: catch(error)

**Q5: What is output?**
```javascript
async function test() {
    try {
        throw new Error("Error");
    } catch (e) {
        console.log("Caught");
        throw e;
    }
}

test().catch(() => console.log("Promise caught"));

// ?
```
A:
```
Caught
Promise caught
```

---

## Follow-up Questions & Confusing Concepts

**Q: Can I catch specific error types in JavaScript?**
A: Yes, with instanceof. if (error instanceof TypeError) { ... }

**Q: Does finally run if return in catch?**
A: Yes, finally always runs. But return in finally overrides catch return.

**Q: Can empty catch block be used?**
A: Technically yes, but bad practice. Always handle errors appropriately.

**Q: Should I use custom errors?**
A: Yes, for specific error conditions. Makes error handling clearer.

---

## Summary

- **Try-catch**: Catch runtime errors and prevent crash
- **Finally**: Always runs, good for cleanup
- **Throw**: Create error at any point
- **Error types**: TypeError, ReferenceError, SyntaxError, RangeError
- **Custom errors**: Extend Error class for specific cases
- **Re-throw**: throw error from catch to handle at higher level
- **Async error**: Use try-catch with async/await
- **Best practices**: Log errors, handle specifically, don't swallow silently
- **Validation**: Throw early with clear messages
- **Debugging**: Use console and browser DevTools

**Next Step:** Learn about advanced JavaScript patterns!
