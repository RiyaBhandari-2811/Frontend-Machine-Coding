# Timers & Performance APIs

## Table of Contents
1. setTimeout - Delay Execution
2. setInterval - Repeat Execution
3. clearTimeout & clearInterval
4. requestAnimationFrame - Smooth Animations
5. Performance API
6. Timing Patterns
7. Common Pitfalls
8. Advanced Patterns
9. Best Practices

---

## 1. setTimeout - Delay Execution

### Basic setTimeout
```javascript
// Execute function after delay (milliseconds)
setTimeout(() => {
    console.log('Hello after 2 seconds');
}, 2000);

console.log('This prints first');
// Output:
// This prints first
// Hello after 2 seconds (after 2 seconds)

// setTimeout returns ID (for cancellation)
let id = setTimeout(() => {
    console.log('Delayed');
}, 1000);

console.log(id);  // 1 (or some positive number)
```

### setTimeout with Arguments
```javascript
// Pass arguments to callback
setTimeout((name, age) => {
    console.log(`Hello ${name}, age ${age}`);
}, 1000, 'John', 25);
// Output: Hello John, age 25

// Multiple parameters
setTimeout(function(a, b, c) {
    console.log(a + b + c);  // 15
}, 1000, 5, 7, 3);
```

### Timing Accuracy
```javascript
// Minimum delay is ~4ms (browsers enforce this)
setTimeout(() => {
    console.log('Very quick');
}, 1);  // Actual delay: ~4ms

// Delays can be longer than specified (browser dependent)
let start = Date.now();
setTimeout(() => {
    let end = Date.now();
    console.log('Actual delay:', end - start);  // Might be 2050+ ms
}, 2000);

// Not guaranteed exact timing due to:
// - Browser busy with other tasks
// - Tab visibility (throttled when hidden)
// - System load
```

---

## 2. setInterval - Repeat Execution

### Basic setInterval
```javascript
// Execute function repeatedly at interval
let count = 0;
let id = setInterval(() => {
    count++;
    console.log('Count:', count);
}, 1000);

// Output (every 1 second):
// Count: 1
// Count: 2
// Count: 3
// ...

// Stop after 5 iterations
setTimeout(() => {
    clearInterval(id);
}, 5000);
```

### setInterval with Condition
```javascript
let attempts = 0;

let id = setInterval(() => {
    attempts++;
    console.log('Attempt:', attempts);
    
    if (attempts >= 5) {
        clearInterval(id);
        console.log('Done!');
    }
}, 1000);
```

### Common Use Cases
```javascript
// 1. Auto-refresh data
let refreshId = setInterval(() => {
    fetch('/api/data').then(r => r.json()).then(updateUI);
}, 5000);  // Every 5 seconds

// 2. Countdown timer
let seconds = 10;
let countdownId = setInterval(() => {
    console.log(seconds + ' seconds remaining');
    seconds--;
    
    if (seconds < 0) {
        clearInterval(countdownId);
        console.log('Time up!');
    }
}, 1000);

// 3. Heartbeat (keep connection alive)
let heartbeatId = setInterval(() => {
    fetch('/api/ping');  // Send ping
}, 30000);  // Every 30 seconds
```

---

## 3. clearTimeout & clearInterval

### Cancel Pending Timer
```javascript
let id = setTimeout(() => {
    console.log('This will be cancelled');
}, 2000);

// Cancel before it executes
setTimeout(() => {
    clearTimeout(id);
    console.log('Timer cancelled');
}, 1000);

// Output:
// Timer cancelled
// (Never prints "This will be cancelled")
```

### Cancel Interval
```javascript
let count = 0;
let id = setInterval(() => {
    count++;
    console.log('Count:', count);
    
    if (count === 3) {
        clearInterval(id);  // Stop interval
    }
}, 1000);

// Output:
// Count: 1
// Count: 2
// Count: 3
// (Stops after 3)
```

### Return Values
```javascript
// clearTimeout/clearInterval return undefined
let id = setTimeout(() => {}, 1000);
let result = clearTimeout(id);
console.log(result);  // undefined

// But timer is successfully cleared
// Calling clear on invalid ID is safe
clearTimeout(999999);  // No error
```

---

## 4. requestAnimationFrame - Smooth Animations

### What is requestAnimationFrame?
```javascript
// Execute callback before next repaint
// Synchronized with browser's refresh rate (typically 60fps)

function animate() {
    // Update position
    element.style.left = x + 'px';
    
    // Schedule next frame
    requestAnimationFrame(animate);
}

// Start animation
requestAnimationFrame(animate);

// vs setTimeout (not synchronized)
setTimeout(() => {
    element.style.left = x + 'px';
    arguments.passed(arguments);
}, 16);  // ~60fps
// Can cause jank (not smooth)
```

### Animation Loop
```javascript
let position = 0;
const element = document.getElementById('box');

function animate(timestamp) {
    position += 5;  // Move 5px
    element.style.transform = `translateX(${position}px)`;
    
    if (position < 500) {
        requestAnimationFrame(animate);  // Continue animation
    }
}

requestAnimationFrame(animate);  // Start
```

### With Timestamps
```javascript
let startTime = null;

function animate(currentTime) {
    if (!startTime) startTime = currentTime;
    
    let elapsed = currentTime - startTime;
    let progress = elapsed / 1000;  // 1 second duration
    
    element.style.opacity = progress;
    
    if (elapsed < 1000) {
        requestAnimationFrame(animate);  // Continue
    }
}

requestAnimationFrame(animate);  // Start
```

### Cancel Animation
```javascript
let id = requestAnimationFrame(animate);

// Cancel before it runs
cancelAnimationFrame(id);

// Or inside animation
let id2;
function animate() {
    // Update...
    
    if (shouldStop) {
        cancelAnimationFrame(id2);
        return;
    }
    
    id2 = requestAnimationFrame(animate);
}

id2 = requestAnimationFrame(animate);
```

---

## 5. Performance API

### Performance.now()
```javascript
// High-resolution timestamp (microseconds)
// Not affected by system clock adjustments

let start = performance.now();

// Do something
for (let i = 0; i < 1000000; i++) {
    Math.sqrt(i);
}

let end = performance.now();
console.log('Time:', end - start, 'ms');  // e.g., 2.5ms

// vs Date.now() (lower resolution)
let d1 = Date.now();
let d2 = Date.now();
console.log(d2 - d1);  // Often 0 (millisecond resolution)

let p1 = performance.now();
let p2 = performance.now();
console.log(p2 - p1);  // e.g., 0.123456 (more precise)
```

### Performance.mark() & measure()
```javascript
// Mark specific points
performance.mark('start');

// Do work
let result = 0;
for (let i = 0; i < 1000000; i++) {
    result += Math.sqrt(i);
}

performance.mark('end');

// Measure between marks
performance.measure('calculation', 'start', 'end');

// Get measurement
let measures = performance.getEntriesByName('calculation');
console.log(measures[0].duration);  // Duration in ms
```

### Performance.getEntries()
```javascript
// Get all performance data
let entries = performance.getEntries();

entries.forEach(entry => {
    console.log(entry.name, entry.duration);
});

// Filter by type
let navigationTiming = performance.getEntriesByType('navigation');
let resourceTiming = performance.getEntriesByType('resource');

// Navigation timing
let nav = navigationTiming[0];
console.log('DNS lookup:', nav.domainLookupEnd - nav.domainLookupStart);
console.log('TCP connection:', nav.connectEnd - nav.connectStart);
console.log('DOM ready:', nav.domInteractive - nav.fetchStart);
console.log('Page loaded:', nav.loadEventEnd - nav.fetchStart);
```

---

## 6. Timing Patterns

### Debouncing
```javascript
function debounce(func, delay) {
    let id;
    
    return function(...args) {
        clearTimeout(id);  // Cancel previous
        
        id = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

// Usage: Search input (wait for user to stop typing)
let search = debounce((query) => {
    console.log('Searching for:', query);
}, 500);

element.addEventListener('input', (e) => {
    search(e.target.value);
});

// Only searches 500ms after user stops typing
```

### Throttling
```javascript
function throttle(func, delay) {
    let lastCall = 0;
    
    return function(...args) {
        let now = Date.now();
        
        if (now - lastCall >= delay) {
            lastCall = now;
            func.apply(this, args);
        }
    };
}

// Usage: Scroll event (expensive operation)
let onScroll = throttle(() => {
    console.log('Scrolled!');
}, 1000);  // Max once per second

window.addEventListener('scroll', onScroll);

// Called at most once per second
```

### Polling with Backoff
```javascript
async function pollWithBackoff(fetch, timeout = 1000, maxAttempts = 5) {
    for (let i = 0; i < maxAttempts; i++) {
        try {
            return await fetch();
        } catch (e) {
            if (i === maxAttempts - 1) throw e;
            
            await new Promise(resolve => setTimeout(resolve, timeout));
            timeout *= 2;  // Exponential backoff
        }
    }
}

// Try every 1s, then 2s, then 4s, etc
pollWithBackoff(() => fetch('/api/data'));
```

---

## 7. Common Pitfalls

### this Context Issues
```javascript
let obj = {
    value: 42,
    
    delayedLog: function() {
        // ✗ WRONG - this will be undefined/window
        setTimeout(function() {
            console.log(this.value);
        }, 1000);
    }
};

obj.delayedLog();  // undefined or error

// ✓ CORRECT - Use arrow function
let obj2 = {
    value: 42,
    
    delayedLog: function() {
        setTimeout(() => {
            console.log(this.value);  // 42 ✓
        }, 1000);
    }
};

obj2.delayedLog();  // 42
```

### Memory Leaks
```javascript
// ✗ MEMORY LEAK - Interval never cleared
setInterval(() => {
    console.log('Running');
}, 1000);  // Runs forever!

// ✓ CORRECT - Clear when done
let id = setInterval(() => {
    console.log('Running');
}, 1000);

// Stop after 10 seconds
setTimeout(() => {
    clearInterval(id);
}, 10000);

// ✗ MEMORY LEAK - Callback holds reference to large object
let largeData = new Array(1000000).fill('data');
setTimeout(() => {
    console.log(largeData.length);  // Data not garbage collected!
}, 60000);

// ✓ CORRECT - Clean up reference
setTimeout(() => {
    console.log(largeData.length);
    largeData = null;  // Allow garbage collection
}, 60000);
```

### Tab Visibility
```javascript
// Timers are throttled when tab not visible
let id = setInterval(() => {
    console.log('Running');
}, 100);  // Every 100ms normally

// When tab becomes hidden:
// - Throttled to max 1000ms intervals
// - Some browsers pause completely
// - Syncs when tab becomes visible again

// Solution: Monitor visibility
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        clearInterval(id);  // Pause
    } else {
        id = setInterval(() => {
            console.log('Running');
        }, 100);  // Resume
    }
});
```

---

## 8. Advanced Patterns

### Async Delay
```javascript
// Delay function (promise-based)
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Usage with async/await
async function sequentialOperations() {
    console.log('Start');
    
    await delay(1000);
    console.log('After 1 second');
    
    await delay(2000);
    console.log('After 3 seconds total');
}

sequentialOperations();
```

### Retry with Timeout
```javascript
async function fetchWithTimeout(url, timeout = 5000) {
    return Promise.race([
        fetch(url),
        new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Timeout')), timeout)
        )
    ]);
}

// Usage
fetchWithTimeout('/api/data', 5000)
    .then(r => r.json())
    .then(data => console.log(data))
    .catch(e => console.log('Error:', e.message));
```

### Animation Queue
```javascript
class AnimationQueue {
    constructor() {
        this.queue = [];
        this.isRunning = false;
    }
    
    add(animation, duration) {
        this.queue.push({ animation, duration });
        this.run();
    }
    
    run() {
        if (this.isRunning || this.queue.length === 0) return;
        
        this.isRunning = true;
        let { animation, duration } = this.queue.shift();
        
        animation();
        
        setTimeout(() => {
            this.isRunning = false;
            this.run();  // Next animation
        }, duration);
    }
}

// Usage
let q = new AnimationQueue();
q.add(() => fadeIn(), 1000);
q.add(() => moveLeft(), 500);
q.add(() => fadeOut(), 1000);
```

---

## 9. Best Practices

### Choose Right Timer
```javascript
// setTimeout: One-time delayed execution
setTimeout(() => updateUI(), 100);

// setInterval: Repeated execution (less preferred)
setInterval(() => updateUI(), 1000);

// requestAnimationFrame: Animations (best for smooth motion)
requestAnimationFrame(animate);

// Promises/async: For async operations (preferred over callbacks)
await delay(1000);
```

### Always Clean Up
```javascript
class Timer {
    constructor() {
        this.id = null;
    }
    
    start() {
        this.id = setInterval(() => {
            console.log('Running');
        }, 1000);
    }
    
    stop() {
        if (this.id) {
            clearInterval(this.id);
            this.id = null;
        }
    }
    
    destroy() {
        this.stop();
    }
}

// Usage with cleanup
let timer = new Timer();
timer.start();
// ... later
timer.destroy();  // Cleanup
```

---

## Exercises

### Exercise 1: Countdown Timer
```javascript
// Create countdown from 10 to 0
function countdown(start = 10) {
    // Your code
}

countdown();
// Output: 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, Blast off!
```

**Solution:**
```javascript
function countdown(start = 10) {
    let count = start;
    let id = setInterval(() => {
        console.log(count);
        if (count === 0) {
            console.log('Blast off!');
            clearInterval(id);
        }
        count--;
    }, 1000);
}
```

### Exercise 2: Debounce Function
```javascript
// Implement debounce
function debounce(func, delay) {
    // Your code
}

let log = debounce(() => console.log('Done typing'), 500);
log();
log();
log();  // Only prints once after 500ms
```

**Solution:**
```javascript
function debounce(func, delay) {
    let id;
    return function(...args) {
        clearTimeout(id);
        id = setTimeout(() => func.apply(this, args), delay);
    };
}
```

### Exercise 3: Measure Performance
```javascript
// Measure time to sort 1 million numbers
function measureSort() {
    // Your code
}

measureSort();  // Output: Time: X.XXms
```

**Solution:**
```javascript
function measureSort() {
    let arr = Array.from({ length: 1000000 }, () => Math.random());
    
    let start = performance.now();
    arr.sort((a, b) => a - b);
    let end = performance.now();
    
    console.log(`Time: ${(end - start).toFixed(2)}ms`);
}
```

---

## Interview Questions

### Theoretical Questions

**Q1: What's the difference between setTimeout and setInterval?**
A: setTimeout executes once after delay. setInterval repeats at interval.

**Q2: When should I use requestAnimationFrame?**
A: For smooth animations synchronized with browser refresh rate.

**Q3: What's the minimum setTimeout delay?**
A: ~4ms in modern browsers (enforced by spec).

**Q4: What is debouncing vs throttling?**
A: Debounce waits for inactivity. Throttle limits frequency.

**Q5: What is performance.now()?**
A: High-resolution timestamp (microseconds) for precise measurements.

---

## Code-Based Interview Questions

**Q1: What will be output?**
```javascript
let id = setTimeout(() => {
    console.log('Hello');
}, 1000);

clearTimeout(id);
// ?
```
A:
```
(Nothing - timer is cancelled)
```

**Q2: Predict:**
```javascript
setInterval(() => console.log('x'), 100);
// What prints in 250ms?
```
A:
```
x
x
(Prints twice - at 100ms and 200ms)
```

**Q3: What will be logged?**
```javascript
let count = 0;
let id = setInterval(() => {
    count++;
    if (count === 2) clearInterval(id);
}, 100);

console.log(id);  // ?
```
A:
```
1
(Positive number - timer ID)
```

**Q4: Spot the issue:**
```javascript
setTimeout(() => {
    console.log(this.value);  // 'this' might be undefined
}, 1000);
```
A: Use arrow function to preserve this context.

**Q5: What is output?**
```javascript
let start = performance.now();
setTimeout(() => {
    let end = performance.now();
    console.log(end - start > 1000);  // ?
}, 1000);
```
A:
```
true
(Actual delay >= 1000ms)
```

---

## Follow-up Questions & Confusing Concepts

**Q: Can I clear a timer that's already executed?**
A: Yes, calling clear() on completed timer is safe (no-op).

**Q: Does requestAnimationFrame ever skip frames?**
A: No, guaranteed to be called before every repaint if tab visible.

**Q: Can I nest setTimeout calls?**
A: Yes, creates callback chain, but can lead to "callback hell".

**Q: What happens to timers when browser tab is hidden?**
A: Throttled or paused depending on browser and timer type.

---

## Summary

- **setTimeout**: One-time delayed execution
- **setInterval**: Repeated execution at intervals
- **clearTimeout/clearInterval**: Cancel pending timers
- **requestAnimationFrame**: Synchronize with browser refresh
- **performance.now()**: High-resolution timestamp
- **Debouncing**: Wait for inactivity before executing
- **Throttling**: Execute at most once per interval
- **Memory leaks**: Always clear intervals and timeouts
- **this binding**: Use arrow functions in timers
- **Minimum delay**: Browser enforces ~4ms minimum

**Next Step:** Master Date/Time manipulation and other JavaScript APIs!
