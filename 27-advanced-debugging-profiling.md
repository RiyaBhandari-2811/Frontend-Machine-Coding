# Advanced Debugging, Performance Analysis & Profiling

## Table of Contents
1. Debugging Strategies
2. React DevTools
3. Browser DevTools
4. Performance Profiling
5. Memory Leaks Detection
6. Network Debugging
7. Console Tips & Tricks
8. Debugging Tools

---

## 1. Debugging Strategies

### Console Logging Best Practices
```javascript
// ✗ WRONG - Hard to find logs
console.log(data);
console.log(state);

// ✓ CORRECT - Labeled and structured
console.log('UserComponent - data:', data);
console.log('UserComponent - state:', { loading, error });

// Use different levels
console.debug('Detailed info for development');
console.info('Informational messages');
console.warn('Warning messages');
console.error('Error messages');

// Group related logs
console.group('User Fetch');
console.log('Fetching user...');
console.log('Response:', response);
console.groupEnd();

// Table format
console.table([
    { id: 1, name: 'Alice', age: 30 },
    { id: 2, name: 'Bob', age: 25 }
]);

// Timing
console.time('fetchData');
// ... fetch logic
console.timeEnd('fetchData');  // Logs: fetchData: 123ms
```

### Conditional Breaking
```javascript
// Add debugging without console pollution
if (process.env.NODE_ENV === 'development') {
    console.log('Debug info:', data);
}

// Or use debug flag
const DEBUG = process.env.REACT_APP_DEBUG === 'true';
if (DEBUG) console.log(state);

// Create debug utility
const createLogger = (namespace: string) => ({
    log: (...args: any[]) => console.log(`[${namespace}]`, ...args),
    error: (...args: any[]) => console.error(`[${namespace}]`, ...args),
    warn: (...args: any[]) => console.warn(`[${namespace}]`, ...args)
});

const logger = createLogger('UserComponent');
logger.log('User loaded', user);
```

---

## 2. React DevTools

### Component Profiling
```
Steps:
1. Install React Developer Tools extension
2. Open DevTools → Components tab
3. Click Profiler
4. Record interactions
5. Analyze render times

Metrics:
- Render time: Time spent rendering
- Commit time: Time spent committing to DOM
- Interactions: User events, state changes
```

### Component Tree Analysis
```
Right-click component → Inspect component
Features:
- View props and state
- Modify props in real-time
- See component hierarchy
- Track re-renders
```

---

## 3. Browser DevTools

### Performance Panel
```
Steps:
1. Open DevTools → Performance
2. Record (Ctrl+Shift+E)
3. Interact with app
4. Stop recording
5. Analyze:
   - Main thread usage
   - Layout, Paint, Composite times
   - FCP, LCP, CLS
   - Long tasks (>50ms)
```

### Network Panel
```
Features:
- Request timeline
- Response headers
- Request size
- Waterfall chart
- Filter by type (XHR, images, etc.)
- Throttle network speed
- Block requests
```

### Sources Panel
```
Debugging:
1. Set breakpoints (click line number)
2. Conditional breakpoint (right-click line)
3. Step over (F10)
4. Step into (F11)
5. Step out (Shift+F11)
6. Continue (F8)

Watch expressions:
- Monitor variable values
- Hover to see value
- Add to watch list
```

---

## 4. Performance Profiling

### React Profiler API
```javascript
import { Profiler } from 'react';

function onRenderCallback(
    id: string,                    // Component name
    phase: 'mount' | 'update',     // Mount or update
    actualDuration: number,        // Render time (ms)
    baseDuration: number,          // Render time without memoization
    startTime: number,             // When render started
    commitTime: number,            // When render committed
    interactions: Set<any>         // Associated interactions
) {
    console.log(`${id} (${phase}) took ${actualDuration}ms`);
}

function MyApp() {
    return (
        <Profiler id="App" onRender={onRenderCallback}>
            <Components />
        </Profiler>
    );
}
```

### Identify Slow Components
```javascript
// Find components taking > 100ms to render
const slowComponents = [];

const profilerCallback = (id, phase, actualDuration) => {
    if (actualDuration > 100) {
        slowComponents.push({ id, phase, duration: actualDuration });
    }
};

// Then optimize:
// 1. Split into smaller components
// 2. Use React.memo
// 3. Use useCallback for callbacks
// 4. Use useMemo for computed values
// 5. Move state down
```

---

## 5. Memory Leaks Detection

### Chrome DevTools Memory
```
Steps:
1. Open DevTools → Memory
2. Take heap snapshot (baseline)
3. Interact with app (create/destroy components)
4. Take heap snapshot (after)
5. Take heap snapshot (after more interactions)
6. Compare snapshots

Look for:
- Objects increasing after cleanup
- Event listeners not removed
- Timers not cleared
- Subscriptions not unsubscribed
```

### Common Memory Leaks
```javascript
// ✗ LEAK: Event listener not removed
useEffect(() => {
    window.addEventListener('resize', handleResize);
    // No cleanup!
}, []);

// ✓ FIXED
useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
}, []);

// ✗ LEAK: Timer not cleared
useEffect(() => {
    const timer = setInterval(() => {
        setData(fetch...);
    }, 1000);
    // No cleanup!
}, []);

// ✓ FIXED
useEffect(() => {
    const timer = setInterval(() => {
        setData(fetch...);
    }, 1000);
    return () => clearInterval(timer);
}, []);

// ✗ LEAK: Subscription not unsubscribed
useEffect(() => {
    const subscription = store.subscribe(setData);
    // No cleanup!
}, []);

// ✓ FIXED
useEffect(() => {
    const subscription = store.subscribe(setData);
    return () => subscription.unsubscribe();
}, []);
```

---

## 6. Network Debugging

### Fetch Interceptor
```javascript
// Log all API calls
const originalFetch = window.fetch;
window.fetch = function(...args) {
    const [url] = args;
    console.time(url);
    return originalFetch.apply(this, args)
        .then(response => {
            console.timeEnd(url);
            console.log(`${response.status} - ${url}`);
            return response;
        })
        .catch(error => {
            console.error(`Error - ${url}:`, error);
            throw error;
        });
};
```

### Slow Network Simulation
```javascript
// Throttle network in DevTools
// DevTools → Network → Throttle dropdown
// Presets: Fast 3G, Slow 3G, Offline

// Or programmatically
const throttledFetch = (url, options, delay = 2000) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(fetch(url, options));
        }, delay);
    });
};
```

---

## 7. Console Tips & Tricks

### Power User Tips
```javascript
// Copy to clipboard
copy(objectOrString);

// Store in temp variable
// Right-click value in console → Store as global temp
// $0, $1, $2 etc available

// Get element
document.querySelector('#my-element');  // $
document.querySelectorAll('.item');     // $$

// Last return value
$_

// XPath selector
$x('//button')

// Monitor function calls
monitorEvents(element, 'click');  // Log all clicks
unmonitorEvents(element, 'click');  // Stop monitoring

// Get event listeners
getEventListeners(element);

// Styling in console
console.log('%cStyled text', 'color: red; font-size: 20px;');
```

---

## 8. Debugging Tools

### React DevTools Profiler
```
Features:
- Record component renders
- Identify unnecessary renders
- See render duration
- Compare renders
- Analyze performance
```

### Redux DevTools
```javascript
// Setup Redux DevTools
import { composeWithDevTools } from 'redux-devtools-extension';

const store = createStore(
    rootReducer,
    composeWithDevTools()
);

// Features:
// - Time-travel debugging
// - Action history
// - Dispatch actions
// - Diff state between actions
```

### Lighthouse
```bash
npm install -g lighthouse
lighthouse https://example.com --view

# Metrics:
# - Performance (0-100)
# - Accessibility
# - Best Practices
# - SEO

# Run from DevTools:
# DevTools → Lighthouse → Generate report
```

### Web Vitals Monitor
```javascript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(metric => console.log('CLS:', metric.value));
getFID(metric => console.log('FID:', metric.value));
getFCP(metric => console.log('FCP:', metric.value));
getLCP(metric => console.log('LCP:', metric.value));
getTTFB(metric => console.log('TTFB:', metric.value));
```

---

## Exercises

### Exercise 1: Debug Slow Component
```javascript
// Identify why UserList renders slowly
// Use Profiler API to measure
// Add React.memo
// Use useCallback

function UserList({ users, onSelect }) {
    const handleSelect = () => {
        onSelect(user.id);  // New function every render
    };
    
    return (
        <div>
            {users.map(user => (
                <div key={user.id} onClick={handleSelect}>
                    {user.name}
                </div>
            ))}
        </div>
    );
}
```

**Solution:**
```javascript
const UserListItem = React.memo(function UserListItem({ user, onSelect }) {
    const handleClick = useCallback(() => {
        onSelect(user.id);
    }, [user.id, onSelect]);
    
    return <div onClick={handleClick}>{user.name}</div>;
});

function UserList({ users, onSelect }) {
    const memoizedOnSelect = useCallback(onSelect, [onSelect]);
    
    return (
        <Profiler id="UserList" onRender={console.log}>
            <div>
                {users.map(user => (
                    <UserListItem
                        key={user.id}
                        user={user}
                        onSelect={memoizedOnSelect}
                    />
                ))}
            </div>
        </Profiler>
    );
}
```

### Exercise 2: Find Memory Leak
```javascript
// Find and fix memory leak
useEffect(() => {
    const timer = setInterval(() => {
        fetch('/api/data').then(setData);
    }, 5000);
}, []);

// Also event listener leak
useEffect(() => {
    const handleClick = () => console.log('clicked');
    document.addEventListener('click', handleClick);
}, []);
```

**Solution:**
```javascript
// Fix timer leak
useEffect(() => {
    const timer = setInterval(() => {
        fetch('/api/data').then(setData);
    }, 5000);
    
    return () => clearInterval(timer);
}, []);

// Fix event listener leak
useEffect(() => {
    const handleClick = () => console.log('clicked');
    document.addEventListener('click', handleClick);
    
    return () => document.removeEventListener('click', handleClick);
}, []);
```

### Exercise 3: Create Debug Logger
```javascript
// Create logger utility:
// - Namespace support
// - Conditional logging
// - Log levels

// Your code
```

**Solution:**
```javascript
const createLogger = (namespace: string) => {
    const prefix = `[${namespace}]`;
    
    return {
        log: (...args: any[]) => {
            if (process.env.NODE_ENV === 'development') {
                console.log(prefix, ...args);
            }
        },
        error: (...args: any[]) => console.error(prefix, ...args),
        warn: (...args: any[]) => console.warn(prefix, ...args)
    };
};

const logger = createLogger('UserComponent');
logger.log('User data:', user);  // Only logs in development
```

---

## Interview Questions

### Theoretical Questions

**Q1: What is memory leak?**
A: Objects/listeners not released after use stays in memory.

**Q2: How to debug React?**
A: React DevTools, Console logging, Performance panel.

**Q3: What is profiler?**
A: Tool measuring component render times.

**Q4: How to find slow components?**
A: Use React Profiler, check render times > 100ms.

**Q5: What causes memory leaks?**
A: Uncleaned timers, event listeners, subscriptions.

---

## Summary

- **Logging:** Structured, labeled, different levels
- **React DevTools:** Inspect components, track renders
- **Browser DevTools:** Performance, Network, Sources
- **Profiler API:** Measure component render times
- **Memory:** Use heap snapshots to find leaks
- **Network:** Monitor requests, throttle speeds
- **Console:** Use power user features
- **Tools:** Lighthouse, Redux DevTools, Web Vitals
- **Prevention:** Cleanup effects, remove listeners
- **Optimization:** Memoize, useCallback, lazy load

**Next:** Interview mastery & advanced Q&A!
