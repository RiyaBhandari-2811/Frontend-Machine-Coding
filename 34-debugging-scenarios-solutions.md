# Real-World Debugging Scenarios & Solutions

## Table of Contents
1. Common React Bugs
2. State-Related Issues
3. Performance Problems
4. Async Issues
5. Memory Leaks
6. Styling Problems
7. Browser Compatibility
8. Production Issues

---

## 1. Common React Bugs

### Bug #1: Infinite Re-render Loop
**Scenario:**
```javascript
function Component() {
    const [data, setData] = useState(null);
    
    useEffect(() => {
        setData(fetch('/api'));  // ✗ WRONG: missing dependency
    });
    
    return <div>{data}</div>;
}
```

**Problem:** No dependency array, effect runs every render, causing infinite loop.

**Solution:**
```javascript
useEffect(() => {
    fetch('/api').then(setData);
}, []);  // ✓ Empty array: run once
```

**Lessons:**
- Always specify dependencies
- Use ESLint plugin to catch missing deps
- Don't ignore warnings

---

### Bug #2: Stale Closure
**Scenario:**
```javascript
function Timer() {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
        const interval = setInterval(() => {
            console.log(count);  // ✗ WRONG: always logs 0
        }, 1000);
        
        return () => clearInterval(interval);
    }, []);  // ✗ WRONG: missing dependency
}
```

**Problem:** Closure captures initial `count`, effect never re-runs.

**Solution:**
```javascript
useEffect(() => {
    const interval = setInterval(() => {
        setCount(prev => prev + 1);  // ✓ Use updater function
    }, 1000);
    
    return () => clearInterval(interval);
}, []);  // ✓ Updater function doesn't need dependency
```

---

### Bug #3: Key Anti-pattern
**Scenario:**
```javascript
{items.map((item, i) => (
    <Component key={i} {...item} />  // ✗ WRONG: index as key
))}
```

**Problem:** When list reorders, component state gets messed up.

**Solution:**
```javascript
{items.map(item => (
    <Component key={item.id} {...item} />  // ✓ Use unique ID
))}
```

---

### Bug #4: Direct State Mutation
**Scenario:**
```javascript
// ✗ WRONG
state.user.name = 'Alice';
setState(state);  // Won't trigger re-render

// ✓ CORRECT
setState(prev => ({
    ...prev,
    user: { ...prev.user, name: 'Alice' }
}));
```

**Problem:** React compares reference, not deep equality.

---

## 2. State-Related Issues

### Issue: State Update in Unmounted Component
**Scenario:**
```javascript
// ✗ WRONG: Warning if component unmounts before fetch completes
useEffect(() => {
    fetch('/api/data').then(setData);
}, []);
```

**Solution:**
```javascript
// ✓ Abort fetch on unmount
useEffect(() => {
    const controller = new AbortController();
    
    fetch('/api/data', { signal: controller.signal })
        .then(r => r.json())
        .then(setData)
        .catch(err => {
            if (err.name !== 'AbortError') {
                console.error(err);
            }
        });
    
    return () => controller.abort();
}, []);
```

---

### Issue: Outdated Prop in Effect
**Scenario:**
```javascript
// ✗ WRONG: Doesn't respond to prop changes
useEffect(() => {
    console.log(props.value);
}, []);

// ✓ CORRECT: Includes prop in dependencies
useEffect(() => {
    console.log(props.value);
}, [props.value]);
```

---

## 3. Performance Problems

### Problem: Unnecessary Re-renders
**Diagnostic:**
```javascript
// Add render count
function Component() {
    const renders = useRef(0);
    renders.current++;
    
    console.log(`Rendered ${renders.current} times`);
    
    return <div>...</div>;
}
```

**Solutions:**
```javascript
// 1. Memoize component
const MemoizedComponent = React.memo(Component);

// 2. Memoize props
const ParentComponent = () => {
    const callback = useCallback(() => {}, []);
    const value = useMemo(() => ({}), []);
    
    return <Component callback={callback} value={value} />;
};

// 3. Move state down
// Instead of holding state at top level, move to component that needs it
```

---

### Problem: Large List Performance
**Diagnostic:**
```javascript
// Check how many items render
function Item({ item }) {
    console.log('rendering item', item.id);
    return <div>{item.name}</div>;
}
```

**Solution:**
```javascript
// Use virtual scrolling
import { FixedSizeList } from 'react-window';

function LargeList({ items }) {
    return (
        <FixedSizeList
            height={600}
            itemCount={items.length}
            itemSize={80}
            width="100%"
        >
            {({ index, style }) => (
                <div style={style}>
                    <Item item={items[index]} />
                </div>
            )}
        </FixedSizeList>
    );
}
```

---

## 4. Async Issues

### Problem: Race Condition
**Scenario:**
```javascript
// ✗ WRONG: If searches happen fast, results might be wrong
function Search({ query }) {
    const [results, setResults] = useState([]);
    
    useEffect(() => {
        fetch(`/api/search?q=${query}`)
            .then(r => r.json())
            .then(setResults);  // Wrong results if query changed
    }, [query]);
}
```

**Solution:**
```javascript
// ✓ Track latest search
useEffect(() => {
    let isLatest = true;
    
    fetch(`/api/search?q=${query}`)
        .then(r => r.json())
        .then(data => {
            if (isLatest) {
                setResults(data);
            }
        });
    
    return () => {
        isLatest = false;
    };
}, [query]);
```

**Better Solution:**
```javascript
// Use React Query which handles this
const { data: results } = useQuery({
    queryKey: ['search', query],
    queryFn: () => fetch(`/api/search?q=${query}`).then(r => r.json())
});
```

---

### Problem: Callback Hell
**Scenario:**
```javascript
// ✗ WRONG: Nested callbacks
fetch('/api/user')
    .then(r => r.json())
    .then(user => {
        fetch(`/api/posts/${user.id}`)
            .then(r => r.json())
            .then(posts => {
                fetch(`/api/comments`)
                    .then(r => r.json())
                    .then(comments => {
                        // Deep nesting
                    });
            });
    });
```

**Solution:**
```javascript
// ✓ Use async/await
async function loadData() {
    try {
        const userRes = await fetch('/api/user');
        const user = await userRes.json();
        
        const postsRes = await fetch(`/api/posts/${user.id}`);
        const posts = await postsRes.json();
        
        const commentsRes = await fetch('/api/comments');
        const comments = await commentsRes.json();
        
        // All data loaded
    } catch (error) {
        console.error('Error:', error);
    }
}
```

---

## 5. Memory Leaks

### Leak: Uncleaned Event Listener
**Scenario:**
```javascript
// ✗ WRONG: Listener never removed
useEffect(() => {
    window.addEventListener('resize', handleResize);
}, []);
```

**Solution:**
```javascript
// ✓ Clean up listener
useEffect(() => {
    window.addEventListener('resize', handleResize);
    
    return () => {
        window.removeEventListener('resize', handleResize);
    };
}, []);
```

---

### Leak: Uncleaned Timer
**Scenario:**
```javascript
// ✗ WRONG: Timer keeps running
useEffect(() => {
    const timer = setInterval(() => {
        // Do something
    }, 1000);
}, []);
```

**Solution:**
```javascript
// ✓ Clear timer
useEffect(() => {
    const timer = setInterval(() => {
        // Do something
    }, 1000);
    
    return () => clearInterval(timer);
}, []);
```

---

### Leak: Uncleaned Subscription
**Scenario:**
```javascript
// ✗ WRONG
useEffect(() => {
    const subscription = store.subscribe(handleUpdate);
}, []);

// ✓ CORRECT
useEffect(() => {
    const subscription = store.subscribe(handleUpdate);
    
    return () => subscription.unsubscribe();
}, []);
```

---

## 6. Styling Problems

### Problem: CSS Not Applied
**Causes:**
1. CSS file not imported
2. Class name typo
3. CSS specificity issue
4. CSS modules not configured

**Debug:**
```javascript
// 1. Check if styles import
import './styles.css';  // ✓ Needed

// 2. Check class name
<div className="container">  // vs className="Containers" (typo)

// 3. Check in DevTools (F12)
// Look at Computed styles tab
// Check if rule is crossed out

// 4. Use inline styles to test
<div style={{ color: 'red' }}>Test</div>
```

---

### Problem: Tailwind Not Working
**Common Causes:**
```javascript
// ✗ WRONG: Dynamic class names
const color = 'red';
<div className={`text-${color}-500`}>  // Doesn't work (not static)

// ✓ CORRECT: Use static class names
<div className={isActive ? 'text-red-500' : 'text-gray-500'}>

// Also check:
// 1. tailwind.config.js content paths
// 2. PostCSS configured
// 3. Tailwind CSS imported in main.css
```

---

## 7. Browser Compatibility

### Problem: Feature Not Working in Older Browsers
**Solutions:**
```javascript
// 1. Check browser support
// Use caniuse.com

// 2. Use polyfills
import 'core-js/stable';
import 'regenerator-runtime/runtime';

// 3. Use conditional rendering
{browser.supportsWebSocket ? (
    <WebSocketComponent />
) : (
    <PollingComponent />
)}

// 4. Use feature detection
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
}
```

---

## 8. Production Issues

### Issue: Blank White Screen
**Causes:**
1. JavaScript error on load
2. Redux state issue
3. Missing environment variable
4. Build error

**Debug:**
```javascript
// Check browser console (F12 > Console)
// Look for errors

// Add error boundary
class ErrorBoundary extends React.Component {
    componentDidCatch(error, errorInfo) {
        console.log('Error:', error, errorInfo);
    }
    
    render() {
        return this.state.hasError 
            ? <h1>Something went wrong</h1>
            : this.props.children;
    }
}

// Wrap app
<ErrorBoundary>
    <App />
</ErrorBoundary>
```

---

### Issue: Slow Load Time
**Analysis:**
```bash
# 1. Check bundle size
npm run build
ls -lh build/static/js/

# 2. Analyze bundle
npm install --save-dev webpack-bundle-analyzer

# 3. Use Lighthouse
# DevTools > Lighthouse > Generate report

# 4. Check Network tab
# DevTools > Network > See slow requests
```

**Solutions:**
1. Code splitting
2. Lazy loading
3. Image optimization
4. Caching
5. CDN
6. Minification

---

## Exercises

### Exercise 1: Fix Memory Leak
```javascript
// Find and fix the memory leak
useEffect(() => {
    const timer = setInterval(() => {
        fetch('/api/status').then(setStatus);
    }, 5000);
}, []);

// Also event listener
useEffect(() => {
    const handler = () => console.log('resized');
    window.addEventListener('resize', handler);
}, []);
```

**Solution:** Add cleanup functions

### Exercise 2: Fix Performance Issue
```javascript
// Find why this is slow
function UserList({ users, onSelect }) {
    return (
        <div>
            {users.map((user, i) => (
                <div
                    key={i}
                    onClick={() => {
                        const result = heavyCalculation(user);
                        onSelect(result);
                    }}
                >
                    {user.name}
                </div>
            ))}
        </div>
    );
}
```

**Solution:** Use useCallback, React.memo, memoize calculation

### Exercise 3: Debug Race Condition
```javascript
// Two rapid searches might show wrong results
useEffect(() => {
    setLoading(true);
    fetch(`/api/search?q=${query}`)
        .then(r => r.json())
        .then(data => {
            setResults(data);
            setLoading(false);
        });
}, [query]);
```

**Solution:** Track latest request or use React Query

---

## Summary

- **Infinite loops:** Check dependencies in useEffect
- **Stale closures:** Use updater functions or dependencies
- **Wrong keys:** Always use unique IDs, never index
- **State mutations:** Always create new objects
- **Memory leaks:** Clean up listeners, timers, subscriptions
- **Async issues:** Handle race conditions, use proper patterns
- **Performance:** Memoize, lazy load, virtual scroll
- **Styling:** Debug with DevTools, check CSS specificity
- **Browser:** Check compatibility, use polyfills
- **Production:** Use error boundaries, monitoring, logging

**Next: Final reference guide!**
