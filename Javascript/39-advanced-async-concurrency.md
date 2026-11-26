# Advanced Async Patterns & Concurrency

## Table of Contents
1. Promise Chaining Advanced
2. Async/Await Deep Dive
3. Concurrent vs Sequential
4. Race Conditions & Locks
5. Queue & Throttling
6. Cancellation Patterns
7. Parallel Processing
8. Error Recovery
9. Best Practices

---

## 1. Promise Chaining Advanced

### Chaining Promises
```javascript
// Basic chaining
fetch('/api/user/1')
    .then(response => response.json())
    .then(user => fetch(`/api/posts/${user.id}`))
    .then(response => response.json())
    .then(posts => console.log(posts))
    .catch(error => console.error('Error:', error));

// Issue: Response body consumed once
// ✓ CORRECT - Create new response
fetch('/api/user/1')
    .then(response => response.json())
    .then(user => {
        console.log(user);  // Can access before fetch
        return fetch(`/api/posts/${user.id}`);
    })
    .then(response => response.json())
    .then(posts => console.log(posts))
    .catch(error => console.error('Error:', error));
```

### Promise Methods
```javascript
// Promise.all - Wait for all promises
Promise.all([
    fetch('/api/user/1').then(r => r.json()),
    fetch('/api/posts/1').then(r => r.json()),
    fetch('/api/comments/1').then(r => r.json())
])
.then(([user, posts, comments]) => {
    console.log(user, posts, comments);
})
.catch(error => {
    // If ANY promise rejects, all fails
    console.error('Error:', error);
});

// Promise.allSettled - Get all results (resolved/rejected)
Promise.allSettled([
    fetch('/api/valid').then(r => r.json()),
    fetch('/api/broken').then(r => r.json())
])
.then(results => {
    // [ { status: 'fulfilled', value: ... },
    //   { status: 'rejected', reason: ... } ]
});

// Promise.race - Return first settled promise
Promise.race([
    fetch('/api/fast'),
    fetch('/api/slow'),
    timeout(5000)  // Timeout race
])
.then(result => console.log(result));

// Promise.any - Return first fulfilled (ES2021)
Promise.any([
    fetch('/api/url1').catch(() => { throw new Error('1 failed'); }),
    fetch('/api/url2').catch(() => { throw new Error('2 failed'); })
])
.then(result => console.log(result))
.catch(error => console.log('All failed'));
```

### Timeout Pattern
```javascript
function timeout(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(new Error(`Timeout after ${ms}ms`));
        }, ms);
    });
}

// Use with race
Promise.race([
    fetch('/api/data'),
    timeout(5000)
])
.then(response => response.json())
.catch(error => console.error(error));
```

---

## 2. Async/Await Deep Dive

### Basic Async/Await
```javascript
// ✗ PROMISE CHAIN - Harder to read
function getUser() {
    return fetch('/api/user/1')
        .then(r => r.json())
        .then(user => fetch(`/api/posts/${user.id}`))
        .then(r => r.json())
        .then(posts => ({ user, posts }));
}

// ✓ ASYNC/AWAIT - Easier to read
async function getUser() {
    let userResponse = await fetch('/api/user/1');
    let user = await userResponse.json();
    
    let postsResponse = await fetch(`/api/posts/${user.id}`);
    let posts = await postsResponse.json();
    
    return { user, posts };
}

// Usage
getUser().then(data => console.log(data));

// Or in another async function
async function main() {
    let data = await getUser();
    console.log(data);
}
```

### Error Handling
```javascript
// ✗ PROMISE - Many .catch() needed
fetch('/api/user')
    .then(r => r.json())
    .catch(error => console.error('Fetch failed:', error))
    .then(user => fetch(`/api/posts/${user.id}`))
    .catch(error => console.error('Second fetch failed:', error));

// ✓ ASYNC/AWAIT - try/catch
async function getUserAndPosts() {
    try {
        let userResponse = await fetch('/api/user');
        let user = await userResponse.json();
        
        let postsResponse = await fetch(`/api/posts/${user.id}`);
        let posts = await postsResponse.json();
        
        return { user, posts };
    } catch (error) {
        console.error('Error:', error);
        throw error;  // Re-throw if needed
    } finally {
        console.log('Request complete');
    }
}
```

### Async IIFE
```javascript
// Execute async immediately
(async () => {
    try {
        let data = await fetch('/api/data').then(r => r.json());
        console.log(data);
    } catch (error) {
        console.error(error);
    }
})();
```

---

## 3. Concurrent vs Sequential

### Sequential (One After Another)
```javascript
// ✓ USE WHEN - Previous result needed for next
async function getUserThenPosts() {
    let user = await fetchUser(1);
    let posts = await fetchPosts(user.id);  // Needs user.id
    return { user, posts };
}

// Time: fetchUser time + fetchPosts time
```

### Concurrent (All at Once)
```javascript
// ✓ USE WHEN - Requests are independent
async function getUserAndPosts() {
    // Fetch both simultaneously
    let [user, posts] = await Promise.all([
        fetchUser(1),
        fetchPosts(1)
    ]);
    return { user, posts };
}

// Time: max(fetchUser time, fetchPosts time) - Much faster!
```

### Mixed Approach
```javascript
async function getFullData() {
    // Sequential: get user first
    let user = await fetchUser(1);
    
    // Concurrent: then get related data
    let [posts, comments] = await Promise.all([
        fetchPosts(user.id),
        fetchComments(user.id)
    ]);
    
    return { user, posts, comments };
}
```

---

## 4. Race Conditions & Locks

### Race Condition Problem
```javascript
// ✗ RACE CONDITION - Requests can complete out of order
let currentData = null;

function fetchData(query) {
    // Request 1 for 'a'
    fetch(`/api/search?q=${query}`).then(r => {
        // Might arrive after request 2!
        currentData = r;
    });
}

fetchData('a');  // Request 1 starts
fetchData('ab');  // Request 2 starts, might finish first

// Result: currentData is from first request but we wanted second
```

### Abort Controller Solution
```javascript
let currentRequest = null;

async function fetchData(query) {
    // Cancel previous request
    if (currentRequest) {
        currentRequest.abort();
    }
    
    // Create new request
    currentRequest = new AbortController();
    
    try {
        let response = await fetch(
            `/api/search?q=${query}`,
            { signal: currentRequest.signal }
        );
        return await response.json();
    } catch (error) {
        if (error.name === 'AbortError') {
            console.log('Request was cancelled');
        } else {
            throw error;
        }
    }
}

fetchData('a');  // Request 1 starts
fetchData('ab');  // Request 1 cancelled, Request 2 starts
```

### Promise Lock Pattern
```javascript
class AsyncLock {
    constructor() {
        this.locked = false;
        this.queue = [];
    }
    
    async acquire() {
        while (this.locked) {
            // Wait for lock to be released
            await new Promise(resolve => {
                this.queue.push(resolve);
            });
        }
        this.locked = true;
    }
    
    release() {
        let next = this.queue.shift();
        if (next) {
            next();  // Release next waiting promise
        } else {
            this.locked = false;
        }
    }
    
    async run(fn) {
        await this.acquire();
        try {
            return await fn();
        } finally {
            this.release();
        }
    }
}

// Usage
let lock = new AsyncLock();

lock.run(async () => {
    // Only one of these runs at a time
    console.log('Task 1 running');
    await sleep(1000);
});

lock.run(async () => {
    console.log('Task 2 running');  // Runs after Task 1
});
```

---

## 5. Queue & Throttling

### Request Queue
```javascript
class RequestQueue {
    constructor(concurrency = 1) {
        this.concurrency = concurrency;
        this.running = 0;
        this.queue = [];
    }
    
    async add(fn) {
        // Wait if at capacity
        while (this.running >= this.concurrency) {
            await new Promise(resolve => {
                this.queue.push(resolve);
            });
        }
        
        this.running++;
        
        try {
            return await fn();
        } finally {
            this.running--;
            let next = this.queue.shift();
            if (next) next();
        }
    }
}

// Usage - max 3 concurrent requests
let queue = new RequestQueue(3);

for (let i = 1; i <= 10; i++) {
    queue.add(() => fetch(`/api/item/${i}`));
}
```

### Throttling
```javascript
function throttle(fn, delay) {
    let lastCall = 0;
    let timeoutId;
    
    return function(...args) {
        let now = Date.now();
        
        if (now - lastCall >= delay) {
            lastCall = now;
            return fn.apply(this, args);
        } else {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                lastCall = Date.now();
                fn.apply(this, args);
            }, delay - (now - lastCall));
        }
    };
}

// Usage - API call max once per 300ms
let throttledSearch = throttle((query) => {
    fetch(`/api/search?q=${query}`);
}, 300);

input.addEventListener('input', (e) => {
    throttledSearch(e.target.value);
});
```

---

## 6. Cancellation Patterns

### AbortController
```javascript
let controller = new AbortController();

// Start request
let promise = fetch('/api/large-file', {
    signal: controller.signal
});

// Cancel after 5 seconds
setTimeout(() => {
    controller.abort();
}, 5000);

promise
    .then(r => r.json())
    .catch(error => {
        if (error.name === 'AbortError') {
            console.log('Request cancelled');
        }
    });
```

### Custom Cancellation
```javascript
class CancelToken {
    constructor() {
        this.cancelled = false;
        this.callbacks = [];
    }
    
    cancel() {
        this.cancelled = true;
        this.callbacks.forEach(cb => cb());
    }
    
    onCancel(callback) {
        if (this.cancelled) {
            callback();
        } else {
            this.callbacks.push(callback);
        }
    }
}

// Usage
let token = new CancelToken();

async function fetchWithCancel() {
    return new Promise((resolve, reject) => {
        let request = fetch('/api/data');
        
        token.onCancel(() => {
            request.abort();
            reject(new Error('Cancelled'));
        });
        
        request.then(r => r.json()).then(resolve).catch(reject);
    });
}

fetchWithCancel();
// Later:
token.cancel();  // Cancels the request
```

---

## 7. Parallel Processing

### Process Array in Parallel
```javascript
// Get multiple items in parallel
let ids = [1, 2, 3, 4, 5];

// Using map + Promise.all
let promises = ids.map(id => fetchItem(id));
let items = await Promise.all(promises);

// Or concise
let items = await Promise.all(ids.map(id => fetchItem(id)));
```

### Batch Processing
```javascript
// Process in batches
async function processBatch(items, batchSize, fn) {
    let results = [];
    
    for (let i = 0; i < items.length; i += batchSize) {
        let batch = items.slice(i, i + batchSize);
        let batchResults = await Promise.all(
            batch.map(item => fn(item))
        );
        results.push(...batchResults);
    }
    
    return results;
}

// Process 100 items in batches of 10
let results = await processBatch(
    Array.from({ length: 100 }, (_, i) => i + 1),
    10,
    async (id) => fetchItem(id)
);
```

---

## 8. Error Recovery

### Retry Logic
```javascript
async function fetchWithRetry(url, maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            let response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            if (attempt === maxRetries) {
                throw error;  // Last attempt
            }
            
            // Exponential backoff
            let delay = Math.pow(2, attempt - 1) * 1000;
            await new Promise(r => setTimeout(r, delay));
        }
    }
}

// Usage
let data = await fetchWithRetry('/api/data', 3);
```

### Fallback Pattern
```javascript
async function getDataWithFallback() {
    try {
        // Try primary source
        return await fetch('/api/primary').then(r => r.json());
    } catch (error) {
        try {
            // Try fallback
            return await fetch('/api/fallback').then(r => r.json());
        } catch (fallbackError) {
            // Use cached data as last resort
            return getCachedData();
        }
    }
}
```

---

## 9. Best Practices

### Avoid Callback Hell
```javascript
// ✗ CALLBACK HELL
function getUserData(id, callback) {
    fetchUser(id, function(user) {
        fetchPosts(user.id, function(posts) {
            fetchComments(user.id, function(comments) {
                callback(null, { user, posts, comments });
            }, callback);
        }, callback);
    }, callback);
}

// ✓ CLEAN - Using async/await
async function getUserData(id) {
    let user = await fetchUser(id);
    let posts = await fetchPosts(user.id);
    let comments = await fetchComments(user.id);
    return { user, posts, comments };
}
```

### Avoid Unhandled Rejections
```javascript
// ✗ DANGEROUS - Unhandled rejection
async function main() {
    let data = await fetch('/api/data');  // Might reject
}

// ✓ SAFE - Handle errors
async function main() {
    try {
        let data = await fetch('/api/data');
    } catch (error) {
        console.error('Error:', error);
    }
}

// Global handler
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled rejection at:', promise, 'reason:', reason);
});
```

---

## Exercises

### Exercise 1: Concurrent Requests
```javascript
// Fetch user and posts concurrently
async function getUserWithPosts(userId) {
    // Your code
}
```

**Solution:**
```javascript
async function getUserWithPosts(userId) {
    let [user, posts] = await Promise.all([
        fetch(`/api/users/${userId}`).then(r => r.json()),
        fetch(`/api/posts?userId=${userId}`).then(r => r.json())
    ]);
    return { user, posts };
}
```

### Exercise 2: Timeout
```javascript
// Fetch with 5 second timeout
async function fetchWithTimeout(url, timeout = 5000) {
    // Your code
}
```

**Solution:**
```javascript
async function fetchWithTimeout(url, timeout = 5000) {
    return Promise.race([
        fetch(url),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Timeout')), timeout)
        )
    ]);
}
```

### Exercise 3: Request Queue
```javascript
// Process 10 items with max 3 concurrent
// Using RequestQueue class
```

**Solution:**
```javascript
let queue = new RequestQueue(3);
let items = Array.from({ length: 10 }, (_, i) => i + 1);

await Promise.all(items.map(id =>
    queue.add(() => fetchItem(id))
));
```

---

## Interview Questions

### Theoretical Questions

**Q1: What is difference between async/await and promises?**
A: async/await is syntactic sugar that makes promises easier to read.

**Q2: What is a race condition?**
A: When multiple operations complete in unpredictable order.

**Q3: How do you cancel a fetch?**
A: Use AbortController and pass signal to fetch.

**Q4: What is concurrency vs parallelism?**
A: Concurrency is interleaved execution. Parallelism is true simultaneous execution.

**Q5: When should operations be sequential vs concurrent?**
A: Concurrent if independent. Sequential if one depends on other.

---

## Code-Based Interview Questions

**Q1: What is output?**
```javascript
async function test() {
    let result = await Promise.resolve(5);
    console.log(result);  // ?
}
test();
```
A:
```
5
```

**Q2: Predict:**
```javascript
Promise.all([
    Promise.resolve(1),
    Promise.reject('error'),
    Promise.resolve(3)
]).catch(e => console.log(e));  // ?
```
A:
```
error
(Promise.all rejects if any rejects)
```

**Q3: What is timing?**
```javascript
let p = fetchSlow();  // Takes 2s
let p2 = fetchFast();  // Takes 1s
await Promise.all([p, p2]);  // ?
```
A:
```
~2 seconds
(waits for slowest)
```

**Q4: Spot the issue:**
```javascript
let response = await fetch(url);  // No error handling!
```
A: fetch doesn't reject on HTTP errors (404, 500), only network errors

**Q5: What is output?**
```javascript
let controller = new AbortController();
controller.abort();
// What happens to fetch with this signal?
```
A: Request is immediately aborted/rejected

---

## Follow-up Questions & Confusing Concepts

**Q: Why use Promise.race() for timeout?**
A: First promise to settle wins. Timeout rejects after delay.

**Q: Does async/await use less memory than promises?**
A: No, same underneath. Async/await is just syntax.

**Q: Can I use multiple await in series?**
A: Yes, but slower. Use Promise.all() if independent.

**Q: What is "await hell"?**
A: Using await sequentially when could be concurrent.

---

## Summary

- **Promise Chaining**: Chain .then() for sequential operations
- **Promise Methods**: all(), race(), allSettled(), any()
- **Async/Await**: Modern syntax for cleaner promise handling
- **Error Handling**: try/catch for async/await
- **Sequential**: Use when result depends on previous operation
- **Concurrent**: Use Promise.all() for independent operations
- **Race Conditions**: Cancel previous request with AbortController
- **Locks**: Custom AsyncLock for critical sections
- **Request Queue**: Limit concurrent requests
- **Throttling**: Limit function calls rate
- **Cancellation**: AbortController or custom CancelToken
- **Retry Logic**: Exponential backoff for failed requests
- **Error Recovery**: Fallback sources and cached data
- **Best Practice**: Prefer async/await, handle errors, avoid mixing

**Next Step:** You've mastered JavaScript! Apply to real projects!
