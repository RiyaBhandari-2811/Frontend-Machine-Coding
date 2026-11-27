# Asynchronous JavaScript & Promises

## Table of Contents
1. Synchronous vs Asynchronous
2. The Event Loop
3. setTimeout and setInterval
4. Callbacks
5. Callback Hell
6. Promises Basics
7. Promise States
8. Promise Methods
9. Async/Await Introduction

---

## 1. Synchronous vs Asynchronous

### Synchronous Execution
```javascript
// Synchronous: Code executes line by line
console.log("Step 1");
console.log("Step 2");
console.log("Step 3");

// Output:
// Step 1
// Step 2
// Step 3

// Each line waits for previous to complete
function slow() {
    for (let i = 0; i < 1000000000; i++) {}
    return "Done";
}

console.log("Before slow");
console.log(slow());  // Waits for loop to finish
console.log("After slow");
```

### Asynchronous Execution
```javascript
// Asynchronous: Code doesn't wait for certain operations
console.log("Step 1");

setTimeout(() => {
    console.log("Step 2");  // Runs later
}, 1000);

console.log("Step 3");

// Output:
// Step 1
// Step 3
// Step 2 (after 1 second)
```

### Why Asynchronous?
```javascript
// Without async: Browser freezes during network request
function fetchUserSync() {
    // Browser would freeze here until response arrives
}

// With async: Browser stays responsive
function fetchUserAsync() {
    // Browser continues while waiting for response
    // Callback when data arrives
}
```

---

## 2. The Event Loop

### Understanding Event Loop
```javascript
// JavaScript has: Call Stack, Task Queue, Event Loop

console.log("1. Script start");

setTimeout(() => {
    console.log("2. Timeout callback");
}, 0);

console.log("3. Script end");

// Output:
// 1. Script start
// 3. Script end
// 2. Timeout callback

// Explanation:
// 1. "Script start" - main code
// 2. setTimeout goes to task queue (not executed immediately)
// 3. "Script end" - main code continues
// 4. Main code finishes, event loop checks task queue
// 5. Timeout callback runs
```

### Call Stack & Task Queue
```javascript
// Call Stack: Executes synchronous code
function a() {
    console.log("a");
    b();
}

function b() {
    console.log("b");
}

a();  // Executes: a, b

// Task Queue: Holds async callbacks
setTimeout(() => {
    console.log("setTimeout");
}, 0);

Promise.resolve().then(() => {
    console.log("Promise");
});

console.log("sync");

// Output:
// sync
// Promise (microtask)
// setTimeout (macrotask)
```

---

## 3. setTimeout and setInterval

### setTimeout
```javascript
// setTimeout(callback, delayInMs)

// Basic timer
setTimeout(() => {
    console.log("Runs after 1 second");
}, 1000);

// With arguments
setTimeout((name, age) => {
    console.log(`${name} is ${age}`);
}, 500, "John", 25);

// Can clear timeout
let timeoutId = setTimeout(() => {
    console.log("This won't run");
}, 1000);

clearTimeout(timeoutId);  // Cancel before it runs
```

### setInterval
```javascript
// setInterval(callback, intervalInMs)

// Runs repeatedly
let count = 0;
let intervalId = setInterval(() => {
    count++;
    console.log(count);
}, 1000);

// Stop after 5 seconds
setTimeout(() => {
    clearInterval(intervalId);
}, 5000);

// Output: 1, 2, 3, 4, 5
```

### Zero Delay timeout
```javascript
// setTimeout with 0 still goes to task queue
setTimeout(() => {
    console.log("setTimeout 0");
}, 0);

console.log("sync");

// Output:
// sync
// setTimeout 0
// setTimeout 0 isn't truly immediate!
```

---

## 4. Callbacks

### What is a Callback?
```javascript
// Callback: Function passed to another function

// Basic callback
function greeting(name, callback) {
    callback(name);  // Execute callback with name
}

greeting("John", (n) => {
    console.log(`Hello, ${n}!`);
});
// "Hello, John!"
```

### Callbacks with Async
```javascript
// Simulating async operation
function fetchData(callback) {
    setTimeout(() => {
        callback("Data received");
    }, 1000);
}

fetchData((data) => {
    console.log(data);  // "Data received" after 1 second
});

console.log("Fetching...");  // Runs first
// Output:
// Fetching...
// Data received (after 1 second)
```

### Error Handling with Callbacks
```javascript
function fetchWithError(success, callback, errorCallback) {
    setTimeout(() => {
        if (success) {
            callback("Success!");
        } else {
            errorCallback("Error occurred");
        }
    }, 1000);
}

fetchWithError(true, 
    (data) => console.log(data),  // Success
    (error) => console.error(error)  // Error
);

fetchWithError(false,
    (data) => console.log(data),
    (error) => console.error(error)
);
```

---

## 5. Callback Hell

### The Problem
```javascript
// Callback Hell: Deeply nested callbacks
getUser(userId, function(user) {
    getProfile(user.id, function(profile) {
        getSettings(profile.id, function(settings) {
            getPreferences(settings.id, function(preferences) {
                // So many indentation levels!
                console.log(preferences);
            }, onError);
        }, onError);
    }, onError);
}, onError);

// Hard to read, error handling messy
```

### Why It's Bad
```javascript
// 1. Hard to read (pyramid shape)
// 2. Error handling repeated
// 3. Difficult to maintain
// 4. Easy to make mistakes
```

### Solutions

#### 1. Named Functions
```javascript
function handlePreferences(preferences) {
    console.log(preferences);
}

function getPreferencesWrapper(settings) {
    getPreferences(settings.id, handlePreferences, onError);
}

function getSettingsWrapper(profile) {
    getSettings(profile.id, getPreferencesWrapper, onError);
}

function getProfileWrapper(user) {
    getProfile(user.id, getSettingsWrapper, onError);
}

getUser(userId, getProfileWrapper, onError);
```

#### 2. Promises (Better!)
```javascript
getUser(userId)
    .then(user => getProfile(user.id))
    .then(profile => getSettings(profile.id))
    .then(settings => getPreferences(settings.id))
    .then(preferences => console.log(preferences))
    .catch(error => console.error(error));
```

---

## 6. Promises Basics

### Creating Promises
```javascript
// Promise: Object representing eventual value
let promise = new Promise((resolve, reject) => {
    // resolve - called when operation succeeds
    // reject - called when operation fails
});

// Example
let myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("Success!");  // Promise resolved
    }, 1000);
});

// Using the promise
myPromise.then((result) => {
    console.log(result);  // "Success!" after 1 second
});
```

### Promise Workflow
```javascript
// 1. Create promise
let promise = new Promise((resolve, reject) => {
    // 2. Async operation
    setTimeout(() => {
        // 3. Resolve/reject promise
        resolve("Done!");
    }, 1000);
});

// 4. Handle result
promise.then((result) => {
    console.log(result);  // "Done!"
});
```

---

## 7. Promise States

### Three States
```javascript
// 1. PENDING: Initial state, operation ongoing
let pending = new Promise((resolve, reject) => {
    // Still deciding...
});

// 2. FULFILLED: Operation succeeded
let fulfilled = new Promise((resolve, reject) => {
    resolve("Success!");  // Fulfilled
});

// 3. REJECTED: Operation failed
let rejected = new Promise((resolve, reject) => {
    reject("Error!");  // Rejected
});

// Once settled (fulfilled or rejected), state doesn't change
let immutable = new Promise((resolve, reject) => {
    resolve("First");
    resolve("Second");  // Ignored
    reject("Error");    // Ignored
});

immutable.then(r => console.log(r));  // "First"
```

---

## 8. Promise Methods

### .then()
```javascript
// .then(onFulfilled, onRejected)
let promise = Promise.resolve("Success!");

promise.then(
    (result) => console.log(result),  // "Success!"
    (error) => console.error(error)
);

// Can chain then
Promise.resolve(5)
    .then(x => {
        console.log(x);  // 5
        return x * 2;    // Return value passed to next then
    })
    .then(x => {
        console.log(x);  // 10
        return x + 5;
    })
    .then(x => {
        console.log(x);  // 15
    });
```

### .catch()
```javascript
// .catch(onRejected) - handles errors

Promise.reject("Error!")
    .catch((error) => {
        console.log(error);  // "Error!"
    });

// Catches errors in chain
Promise.resolve(5)
    .then(x => x / 0)  // NaN, not error
    .then(x => {
        throw new Error("Error!");
    })
    .catch((error) => {
        console.log("Caught:", error);
    });
```

### .finally()
```javascript
// .finally(callback) - runs regardless of result
let promise = Promise.resolve("Success!");

promise
    .then(result => console.log(result))
    .finally(() => {
        console.log("Done!");  // Always runs
    });

// Useful for cleanup
let resource;
getResource()
    .then(r => {
        resource = r;
        return useResource(r);
    })
    .finally(() => {
        resource.cleanup();  // Always cleanup
    });
```

### Promise.all()
```javascript
// Wait for all promises

let p1 = Promise.resolve(1);
let p2 = Promise.resolve(2);
let p3 = Promise.resolve(3);

Promise.all([p1, p2, p3]).then(results => {
    console.log(results);  // [1, 2, 3]
});

// If any rejects, whole thing rejects
Promise.all([
    Promise.resolve(1),
    Promise.reject("Error!"),
    Promise.resolve(3)
]).catch(error => {
    console.log(error);  // "Error!"
});
```

### Promise.race()
```javascript
// Wait for first to settle

let p1 = new Promise(resolve => setTimeout(() => resolve(1), 1000));
let p2 = new Promise(resolve => setTimeout(() => resolve(2), 100));

Promise.race([p1, p2]).then(result => {
    console.log(result);  // 2 (p2 finishes first)
});
```

---

## 9. Async/Await Introduction

### What is Async/Await?
```javascript
// Async/await: Cleaner promise syntax
// Async function always returns promise

async function greeting() {
    return "Hello";  // Returns Promise.resolve("Hello")
}

greeting().then(result => {
    console.log(result);  // "Hello"
});
```

### Await
```javascript
// Await: Waits for promise, returns result
// Can only use in async function

async function getUser() {
    let user = await fetchUser();  // Wait for promise
    console.log(user);
    return user;
}

// Without await
async function fetchData() {
    let data = fetchUser();  // Returns promise, not data
    console.log(data);  // Promise object
}
```

### Cleaner than Promises
```javascript
// Promises
function getUser() {
    return fetchUser()
        .then(user => fetchProfile(user.id))
        .then(profile => console.log(profile))
        .catch(error => console.error(error));
}

// Async/await (much cleaner!)
async function getUser() {
    try {
        let user = await fetchUser();
        let profile = await fetchProfile(user.id);
        console.log(profile);
    } catch (error) {
        console.error(error);
    }
}
```

---

## Exercises

### Exercise 1: setTimeout Delay
```javascript
// Create function that delays and returns value

function delay(ms, value) {
    // Your code
    return new Promise(/* ... */);
}

delay(1000, "Hello").then(result => {
    console.log(result);  // "Hello" after 1 second
});
```

**Solution:**
```javascript
function delay(ms, value) {
    return new Promise(resolve => {
        setTimeout(() => resolve(value), ms);
    });
}
```

### Exercise 2: Retry Function
```javascript
// Retry operation up to 3 times on failure

async function retryAsync(fn, times = 3) {
    // Your code
}

retryAsync(async () => {
    // Some operation
});
```

**Solution:**
```javascript
async function retryAsync(fn, times = 3) {
    for (let i = 0; i < times; i++) {
        try {
            return await fn();
        } catch (error) {
            if (i === times - 1) throw error;
        }
    }
}
```

### Exercise 3: Promise Chain
```javascript
// Chain promises to simulate user data fetch

function getUser(id) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ id, name: "John" });
        }, 100);
    });
}

function getProfile(userId) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve({ userId, bio: "Developer" });
        }, 100);
    });
}

// Chain them
getUser(1)
    .then(user => getProfile(user.id))
    .then(profile => console.log(profile));
```

---

## Interview Questions

### Theoretical Questions

**Q1: What's the difference between synchronous and asynchronous?**
A: Synchronous executes line by line, waits for each to complete. Asynchronous allows code to continue while operation completes in background.

**Q2: What is the event loop?**
A: Mechanism checking call stack and task queue. When stack empty, moves callbacks from queue to stack for execution.

**Q3: Why can't we use setTimeout with 0?**
A: setTimeout goes to task queue, executes after call stack clears. 0 delay doesn't mean immediately.

**Q4: What is callback hell?**
A: Deeply nested callbacks making code hard to read and maintain. Solution: Use promises or async/await.

**Q5: What are promise states?**
A: Pending (initial), Fulfilled (resolved), Rejected. Once settled, state can't change.

---

## Code-Based Interview Questions

**Q1: What will be output?**
```javascript
console.log("1");
setTimeout(() => console.log("2"), 0);
console.log("3");
```
A:
```
1
3
2
```
Explanation: setTimeout goes to task queue

**Q2: Predict output:**
```javascript
let p = Promise.resolve(5)
    .then(x => x * 2)
    .then(x => x + 10);

p.then(x => console.log(x));  // ?
```
A:
```
20
```
Explanation: 5 * 2 = 10, 10 + 10 = 20

**Q3: What will be logged?**
```javascript
let p = new Promise(resolve => {
    resolve(1);
    resolve(2);  // Ignored
});

p.then(x => console.log(x));  // ?
```
A:
```
1
```
Explanation: Promise resolves to first value only

**Q4: Spot the error:**
```javascript
let result = Promise.resolve(5);
console.log(result);  // Can't log promise value directly
```
A: Use `.then()` to access resolved value.

**Q5: What is output?**
```javascript
Promise.resolve([1, 2, 3])
    .then(arr => arr.map(x => x * 2))
    .then(arr => console.log(arr));  // ?
```
A:
```
[2, 4, 6]
```

---

## Follow-up Questions & Confusing Concepts

**Q: Does setTimeout execute exactly after delay?**
A: No, it's minimum delay. Actual time depends on call stack and other tasks.

**Q: What's difference between microtasks and macrotasks?**
A: Promises (microtasks) run before setTimeout (macrotasks). Microtasks have higher priority.

**Q: Can I use await outside async function?**
A: No, only inside async functions. Top-level await only in modules.

**Q: What if promise never settles?**
A: Callback never runs. Promise hangs indefinitely. Use timeout with Promise.race().

---

## Summary

- **Synchronous**: Executes sequentially, waits for each
- **Asynchronous**: Continues while operations complete
- **Event Loop**: Checks queue when stack empty
- **setTimeout**: Schedules callback (task queue)
- **Callback**: Function passed for async result
- **Callback Hell**: Deeply nested callbacks, hard to read
- **Promise**: Object representing future value
- **States**: Pending → Fulfilled/Rejected
- **.then()**: Handle fulfilled promise
- **.catch()**: Handle rejected promise
- **async/await**: Cleaner promise syntax

**Next Step:** Learn about DOM manipulation and browser APIs!
