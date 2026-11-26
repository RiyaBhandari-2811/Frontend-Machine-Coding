# Performance Optimization

## Table of Contents
1. Identify Performance Issues
2. Memory Management
3. Code Optimization
4. DOM Performance
5. Network Optimization
6. Rendering Performance
7. Profiling & Measurement
8. Caching Strategies
9. Best Practices

---

## 1. Identify Performance Issues

### Common Performance Bottlenecks
```javascript
// 1. Inefficient loops and algorithms
// ✗ SLOW - O(n²) complexity
let arr = Array.from({ length: 10000 }, (_, i) => i);
for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length; j++) {
        // Nested loops = slow
    }
}

// 2. Memory leaks (unreleased objects)
let cache = {};
function addToCache(key, value) {
    cache[key] = value;  // Never cleaned up
}

// 3. Synchronous operations blocking main thread
let result = heavyCalculation();  // Blocks everything

// 4. Excessive DOM manipulation
let element = document.getElementById('list');
for (let i = 0; i < 1000; i++) {
    element.innerHTML += `<li>Item ${i}</li>`;  // Slow!
}

// 5. Poor network requests
// Making 100 sequential fetch calls instead of parallel
```

---

## 2. Memory Management

### Detecting Memory Leaks
```javascript
// ✗ MEMORY LEAK - Global reference not released
let cache = {};
function loadData(id) {
    let data = { id, largeArray: new Array(10000) };
    cache[id] = data;  // Never released
}

// ✓ CORRECT - Clean up old data
function loadData(id) {
    if (cache.length > 100) {
        cache.shift();  // Remove oldest
    }
    cache.push({ id, data });
}

// Using WeakMap for auto-cleanup
let cache2 = new WeakMap();
function cacheData(obj, data) {
    cache2.set(obj, data);  // Auto-cleaned when obj is GC'd
}
```

### Event Listener Management
```javascript
// ✗ MEMORY LEAK - Listeners never removed
function attachListener() {
    element.addEventListener('click', () => {
        heavyOperation();
    });
}

// ✓ CORRECT - Remove listeners
function attachListener() {
    let handler = () => heavyOperation();
    element.addEventListener('click', handler);
    
    // Later:
    element.removeEventListener('click', handler);
}

// Or use once option
element.addEventListener('click', handler, { once: true });
```

### Clearing References
```javascript
// ✗ MEMORY LEAK - References prevent garbage collection
class Cache {
    constructor() {
        this.data = {};
    }
    
    add(key, value) {
        this.data[key] = value;  // Never cleaned
    }
}

// ✓ CORRECT - Implement cleanup
class Cache {
    constructor(maxSize = 100) {
        this.data = {};
        this.maxSize = maxSize;
    }
    
    add(key, value) {
        if (Object.keys(this.data).length >= this.maxSize) {
            // Remove oldest
            let oldKey = Object.keys(this.data)[0];
            delete this.data[oldKey];
        }
        this.data[key] = value;
    }
    
    clear() {
        this.data = {};
    }
}
```

---

## 3. Code Optimization

### Algorithm Complexity
```javascript
// ✗ SLOW - O(n²) nested loop
function findDuplicate(arr) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[i] === arr[j]) return arr[i];
        }
    }
}

// ✓ FAST - O(n) with Set
function findDuplicate(arr) {
    let seen = new Set();
    for (let num of arr) {
        if (seen.has(num)) return num;
        seen.add(num);
    }
}

// Performance comparison
let largeArr = Array.from({ length: 1000 }, () => Math.random() * 1000);

console.time('nested');
findDuplicate(largeArr);  // Slow
console.timeEnd('nested');

console.time('set');
findDuplicate(largeArr);  // Fast
console.timeEnd('set');
```

### Avoid Blocking Operations
```javascript
// ✗ BLOCKS - Synchronous heavy computation
function blockingCalculation() {
    for (let i = 0; i < 1000000000; i++) {
        Math.sqrt(i);
    }
}

blockingCalculation();  // Everything else waits!

// ✓ NON-BLOCKING - Use async
async function nonBlockingCalculation() {
    return new Promise(resolve => {
        setTimeout(() => {
            for (let i = 0; i < 1000000000; i++) {
                Math.sqrt(i);
            }
            resolve();
        }, 0);  // Let browser render first
    });
}

await nonBlockingCalculation();  // Doesn't block
```

### Early Exit & Short-Circuit
```javascript
// ✗ INEFFICIENT - Processes everything
function hasNegative(arr) {
    let hasNeg = false;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] < 0) hasNeg = true;  // Don't stop!
    }
    return hasNeg;
}

// ✓ EFFICIENT - Exit early
function hasNegative(arr) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] < 0) return true;  // Exit immediately
    }
    return false;
}

// Using some()
function hasNegative(arr) {
    return arr.some(x => x < 0);  // Stops on first match
}
```

---

## 4. DOM Performance

### Batch DOM Updates
```javascript
// ✗ SLOW - Reflow on each append
let element = document.getElementById('list');
for (let i = 0; i < 1000; i++) {
    let item = document.createElement('li');
    item.textContent = `Item ${i}`;
    element.appendChild(item);  // Reflow each time!
}

// ✓ FAST - Single reflow
let element = document.getElementById('list');
let fragment = document.createDocumentFragment();
for (let i = 0; i < 1000; i++) {
    let item = document.createElement('li');
    item.textContent = `Item ${i}`;
    fragment.appendChild(item);
}
element.appendChild(fragment);  // Single reflow

// Or use innerHTML (careful with XSS)
let html = '';
for (let i = 0; i < 1000; i++) {
    html += `<li>Item ${i}</li>`;
}
element.innerHTML = html;  // Single reflow
```

### Event Delegation
```javascript
// ✗ SLOW - Many listeners
let items = document.querySelectorAll('.item');
items.forEach(item => {
    item.addEventListener('click', () => {
        item.style.backgroundColor = 'red';
    });
});

// ✓ FAST - Single listener
let list = document.getElementById('list');
list.addEventListener('click', (e) => {
    if (e.target.classList.contains('item')) {
        e.target.style.backgroundColor = 'red';
    }
});
```

### Remove Unnecessary DOM Nodes
```javascript
// ✗ SLOW - Heavy DOM tree
// Keep all 10000 nodes even if not visible

// ✓ FAST - Only render visible nodes
class VirtualList {
    constructor(container, items, itemHeight) {
        this.container = container;
        this.items = items;
        this.itemHeight = itemHeight;
        this.visibleCount = Math.ceil(container.clientHeight / itemHeight);
        
        container.addEventListener('scroll', () => this.render());
        this.render();
    }
    
    render() {
        let scrollTop = this.container.scrollTop;
        let startIndex = Math.floor(scrollTop / this.itemHeight);
        let endIndex = startIndex + this.visibleCount;
        
        // Only render visible items
        this.container.innerHTML = this.items
            .slice(startIndex, endIndex)
            .map(item => `<div>${item}</div>`)
            .join('');
    }
}
```

---

## 5. Network Optimization

### Parallel Requests
```javascript
// ✗ SLOW - Sequential requests
let user = await fetch('/api/user').then(r => r.json());
let posts = await fetch('/api/posts').then(r => r.json());
let comments = await fetch('/api/comments').then(r => r.json());

// ✓ FAST - Parallel requests
let [user, posts, comments] = await Promise.all([
    fetch('/api/user').then(r => r.json()),
    fetch('/api/posts').then(r => r.json()),
    fetch('/api/comments').then(r => r.json())
]);
```

### Request Debouncing
```javascript
// ✗ SLOW - Request on every keystroke
input.addEventListener('input', (e) => {
    fetch(`/api/search?q=${e.target.value}`);
});

// ✓ FAST - Request only after user stops typing
let debounceTimer;
input.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        fetch(`/api/search?q=${e.target.value}`);
    }, 300);  // Wait 300ms after last keystroke
});
```

### Response Caching
```javascript
// Simple cache
let cache = {};
async function cachedFetch(url, ttl = 60000) {
    if (cache[url] && Date.now() - cache[url].time < ttl) {
        return cache[url].data;
    }
    
    let response = await fetch(url);
    let data = await response.json();
    cache[url] = { data, time: Date.now() };
    return data;
}

// Or use browser cache
fetch(url, {
    headers: {
        'Cache-Control': 'max-age=3600'  // Cache for 1 hour
    }
});
```

---

## 6. Rendering Performance

### Avoid Forced Reflows
```javascript
// ✗ SLOW - Causes reflow
let element = document.getElementById('box');
element.style.width = '200px';
let width = element.offsetWidth;  // Reflow!
element.style.width = '300px';

// ✓ FAST - Read then write
let width = element.offsetWidth;
element.style.width = '200px';
element.style.width = '300px';
```

### Use requestAnimationFrame
```javascript
// ✗ SLOW - Might not sync with browser refresh
setInterval(() => {
    updateAnimation();
}, 16);  // ~60fps but not guaranteed

// ✓ FAST - Synced with browser
function animate() {
    updateAnimation();
    requestAnimationFrame(animate);  // Calls on repaint
}
requestAnimationFrame(animate);
```

### Optimize CSS
```javascript
// ✗ SLOW - Complex selectors
// .container > .item > .content > span {  }

// ✓ FAST - Simple selectors
// .item-content {  }

// Use CSS classes for state
element.classList.add('active');  // vs inline styles

// Hardware acceleration
// Use transform and opacity (don't reflow)
element.style.transform = 'translateX(100px)';
element.style.opacity = 0.5;
```

---

## 7. Profiling & Measurement

### Performance Timing
```javascript
// Measure specific operations
console.time('operation');

// Do work
let result = expensiveCalculation();

console.timeEnd('operation');
// Output: operation: 123.45ms

// Use performance API for precision
let start = performance.now();
let result = expensiveCalculation();
let end = performance.now();
console.log(`Time: ${end - start}ms`);
```

### Analyze with Chrome DevTools
```javascript
// 1. Open DevTools (F12)
// 2. Go to Performance tab
// 3. Click Record
// 4. Perform actions
// 5. Stop recording
// 6. Analyze flame graph

// Or programmatically start profiling
console.profile('MyProfile');
expensiveOperation();
console.profileEnd('MyProfile');

// View in Performance tab of DevTools
```

### Memory Profiling
```javascript
// Check memory usage (Chrome only)
if (performance.memory) {
    console.log({
        usedJSHeapSize: performance.memory.usedJSHeapSize,
        totalJSHeapSize: performance.memory.totalJSHeapSize,
        jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
    });
}

// Use heap snapshots in DevTools
// to find memory leaks
```

---

## 8. Caching Strategies

### Browser Cache
```javascript
// HTTP cache headers
fetch(url, {
    headers: {
        'Cache-Control': 'max-age=3600',  // Cache for 1 hour
        'Expires': new Date(Date.now() + 3600000).toUTCString()
    }
});
```

### Application Cache
```javascript
class AppCache {
    constructor(storage = localStorage) {
        this.storage = storage;
        this.prefix = 'cache_';
    }
    
    set(key, value, ttl = 3600000) {
        let item = {
            value,
            expires: Date.now() + ttl
        };
        this.storage.setItem(this.prefix + key, JSON.stringify(item));
    }
    
    get(key) {
        let item = this.storage.getItem(this.prefix + key);
        if (!item) return null;
        
        let { value, expires } = JSON.parse(item);
        if (Date.now() > expires) {
            this.storage.removeItem(this.prefix + key);
            return null;
        }
        return value;
    }
}

// Usage
let cache = new AppCache();
cache.set('user', userData, 3600000);  // 1 hour
let user = cache.get('user');
```

---

## 9. Best Practices

### Profile Before Optimizing
```javascript
// Don't guess - measure!
// 1. Measure current performance
console.time('baseline');
expensiveOperation();
console.timeEnd('baseline');

// 2. Optimize
// Make changes

// 3. Measure again
console.time('optimized');
expensiveOperation();
console.timeEnd('optimized');

// 4. Verify improvement
// Compare baseline vs optimized
```

### Use Libraries
```javascript
// Don't reinvent the wheel
// Use optimized libraries:

// Virtual scrolling: react-window, vue-virtual-scroller
// Image lazy loading: Intersection Observer
// Animation: GSAP, Framer Motion
// Date manipulation: date-fns, day.js
// State management: Redux, Zustand

// Libraries are battle-tested and optimized
```

### Monitor Production
```javascript
// Use performance monitoring services
// - Sentry for error tracking
// - New Relic for APM
// - Google Analytics for user metrics

// Track real user metrics
// - Largest Contentful Paint (LCP)
// - Cumulative Layout Shift (CLS)
// - First Input Delay (FID)

// Don't optimize for internal testing
// Optimize for real user experience
```

---

## Exercises

### Exercise 1: Optimize Algorithm
```javascript
// Optimize this to O(n) instead of O(n²)
function findSum(arr, target) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[i] + arr[j] === target) {
                return [arr[i], arr[j]];
            }
        }
    }
}

// Your optimized version
```

**Solution:**
```javascript
function findSum(arr, target) {
    let seen = new Set();
    for (let num of arr) {
        let needed = target - num;
        if (seen.has(needed)) {
            return [num, needed];
        }
        seen.add(num);
    }
}
```

### Exercise 2: Batch DOM Updates
```javascript
// Optimize this DOM update
let container = document.getElementById('list');
for (let i = 0; i < 100; i++) {
    let item = document.createElement('div');
    item.textContent = `Item ${i}`;
    container.appendChild(item);  // Slow!
}
```

**Solution:**
```javascript
let container = document.getElementById('list');
let fragment = document.createDocumentFragment();
for (let i = 0; i < 100; i++) {
    let item = document.createElement('div');
    item.textContent = `Item ${i}`;
    fragment.appendChild(item);
}
container.appendChild(fragment);
```

### Exercise 3: Debounce Search
```javascript
// Add debouncing to search input
let input = document.getElementById('search');
input.addEventListener('input', (e) => {
    fetch(`/api/search?q=${e.target.value}`);
});
```

**Solution:**
```javascript
let input = document.getElementById('search');
let debounceTimer;
input.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        fetch(`/api/search?q=${e.target.value}`);
    }, 300);
});
```

---

## Interview Questions

### Theoretical Questions

**Q1: What causes memory leaks?**
A: Unreleased references to objects, removed event listeners, circular references.

**Q2: What is the difference between reflow and repaint?**
A: Reflow recalculates layout. Repaint updates visuals.

**Q3: How do you optimize loops?**
A: Exit early, avoid nested loops, use efficient data structures.

**Q4: What is event delegation?**
A: Single listener on parent handles events for children.

**Q5: How do you cache API responses?**
A: Store in memory/localStorage with TTL and validate expiration.

---

## Code-Based Interview Questions

**Q1: What will be output?**
```javascript
console.time('x');
for (let i = 0; i < 1000; i++) {}
console.timeEnd('x');
// ?
```
A:
```
x: 0.123ms (or similar small number)
```

**Q2: Predict:**
```javascript
let cache = {};
let obj = { a: 1 };
cache[obj] = 'value';
// What is cache['[object Object]']?
```
A:
```
"value"
(object converted to string '[object Object]')
```

**Q3: What is faster?**
```javascript
// Which is faster?
element.innerHTML = data;  // vs
element.textContent = data;
```
A: textContent is faster (no HTML parsing needed)

**Q4: Spot the issue:**
```javascript
for (let i = 0; i < elements.length; i++) {  // Length checked each time!
    doSomething(elements[i]);
}
```
A: Cache length: `for (let i = 0, len = elements.length; i < len; i++)`

**Q5: What is output?**
```javascript
performance.now() === performance.now()  // ?
```
A:
```
false
(timestamps are different)
```

---

## Follow-up Questions & Confusing Concepts

**Q: Does async always improve performance?**
A: No, only if it prevents blocking main thread.

**Q: Can I optimize without profiling?**
A: Risky - optimize based on measurements, not guesses.

**Q: What is "jank"?**
A: Visible frame drops due to slow rendering.

**Q: How do I find memory leaks?**
A: Use Chrome DevTools heap snapshots.

---

## Summary

- **Algorithm complexity**: Use O(n) instead of O(n²) when possible
- **Memory management**: Clean up references, remove event listeners
- **DOM performance**: Batch updates, use DocumentFragment, event delegation
- **Network**: Parallel requests, debouncing, caching
- **Rendering**: Avoid forced reflows, use requestAnimationFrame
- **Profiling**: Use Chrome DevTools, performance API
- **Caching**: Implement TTL-based caching strategies
- **Monitor**: Track real user metrics, not lab tests
- **Identify**: Profile before optimizing
- **Best practice**: Use optimized libraries, avoid premature optimization

**Next Step:** Master security best practices and common vulnerabilities!
