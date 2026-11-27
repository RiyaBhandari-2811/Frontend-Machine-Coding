# Custom Hooks Deep Dive & Reusable Logic

## Table of Contents
1. Hook Composition
2. Advanced useEffect Patterns
3. useCallback & useMemo Mastery
4. useRef Advanced Patterns
5. Creating Reusable Hooks
6. Hook Testing
7. Common Pitfalls
8. Performance Considerations

---

## 1. Hook Composition

### Building Custom Hooks
```javascript
// useToggle - Simple state toggle
function useToggle(initial = false) {
    const [value, setValue] = useState(initial);
    
    return [
        value,
        () => setValue(v => !v)
    ];
}

// Usage
const [isOpen, toggle] = useToggle(false);

// useAsync - Handle async operations
function useAsync(asyncFn, immediate = true) {
    const [status, setStatus] = useState('idle');
    const [value, setValue] = useState(null);
    const [error, setError] = useState(null);
    
    const execute = useCallback(async () => {
        setStatus('pending');
        try {
            const response = await asyncFn();
            setValue(response);
            setStatus('success');
            return response;
        } catch (err) {
            setError(err);
            setStatus('error');
        }
    }, [asyncFn]);
    
    useEffect(() => {
        if (immediate) execute();
    }, [execute, immediate]);
    
    return { execute, status, value, error };
}

// Usage
const { status, value, error } = useAsync(() => fetch('/api/users').then(r => r.json()));
```

### Composing Multiple Hooks
```javascript
// useFetch - Fetch with caching
function useFetch(url, options = {}) {
    const cache = useRef({});
    const [status, setStatus] = useState('idle');
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        if (!url) return;
        
        // Check cache
        if (cache.current[url]) {
            setData(cache.current[url]);
            return;
        }
        
        setStatus('pending');
        fetch(url, options)
            .then(r => {
                if (!r.ok) throw new Error('Failed');
                return r.json();
            })
            .then(d => {
                cache.current[url] = d;  // Cache result
                setData(d);
                setStatus('success');
            })
            .catch(e => {
                setError(e);
                setStatus('error');
            });
    }, [url, options]);
    
    return { status, data, error };
}

// usePaginatedFetch - Pagination on top of fetch
function usePaginatedFetch(url, pageSize = 10) {
    const [page, setPage] = useState(1);
    const { status, data, error } = useFetch(`${url}?page=${page}&size=${pageSize}`);
    
    return {
        status,
        data,
        error,
        page,
        goToPage: setPage,
        nextPage: () => setPage(p => p + 1),
        prevPage: () => setPage(p => Math.max(1, p - 1))
    };
}
```

---

## 2. Advanced useEffect Patterns

### Dependent Effects
```javascript
// ✗ WRONG - Missing dependency
useEffect(() => {
    const timer = setInterval(() => {
        console.log(count);  // Uses stale count
    }, 1000);
}, []);

// ✓ CORRECT - Include dependency
useEffect(() => {
    const timer = setInterval(() => {
        console.log(count);
    }, 1000);
    
    return () => clearInterval(timer);
}, [count]);

// Better - Use functional update to avoid dependency
useEffect(() => {
    const timer = setInterval(() => {
        setCount(c => c + 1);
    }, 1000);
    
    return () => clearInterval(timer);
}, []);  // No dependency needed
```

### Multiple Effects
```javascript
// Separate concerns into multiple effects
function Component({ id, url }) {
    // Effect 1: Fetch data
    useEffect(() => {
        fetch(`${url}/${id}`).then(r => r.json()).then(setData);
    }, [id, url]);
    
    // Effect 2: Save to localStorage
    useEffect(() => {
        localStorage.setItem('lastId', id);
    }, [id]);
    
    // Effect 3: Track analytics
    useEffect(() => {
        analytics.track('page_view');
    }, []);
}

// Benefits:
// - Each effect has single responsibility
// - Easier to debug
// - Easier to test
// - Clearer dependencies
```

### Effect Cleanup Patterns
```javascript
// Event listener cleanup
useEffect(() => {
    const handleResize = () => {
        setSize({ width: window.innerWidth });
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
        window.removeEventListener('resize', handleResize);
    };
}, []);

// Subscription cleanup
useEffect(() => {
    const subscription = dataStore.subscribe(setData);
    
    return () => {
        subscription.unsubscribe();
    };
}, []);

// Abort controller cleanup
useEffect(() => {
    const controller = new AbortController();
    
    fetch(url, { signal: controller.signal })
        .then(r => r.json())
        .then(setData);
    
    return () => {
        controller.abort();
    };
}, [url]);
```

---

## 3. useCallback & useMemo Mastery

### useCallback Deep Dive
```javascript
// ✗ WRONG - Creating new function every render
function Parent() {
    const handleClick = () => {
        console.log('clicked');
    };
    
    return <Child onClick={handleClick} />;
}

// Child re-renders even though logic is same

// ✓ CORRECT - Memoized callback
function Parent() {
    const handleClick = useCallback(() => {
        console.log('clicked');
    }, []);
    
    return <Child onClick={handleClick} />;
}

// Advanced: Callback with dependencies
function useFetch(url) {
    const [data, setData] = useState(null);
    
    const refetch = useCallback(() => {
        fetch(url)
            .then(r => r.json())
            .then(setData);
    }, [url]);  // Recreate when url changes
    
    useEffect(() => {
        refetch();
    }, [refetch]);
    
    return { data, refetch };
}
```

### useMemo Advanced Patterns
```javascript
// Memoize expensive calculations
function Component({ items, sortBy }) {
    const sortedItems = useMemo(() => {
        return items.sort((a, b) => {
            if (sortBy === 'name') return a.name.localeCompare(b.name);
            return a.price - b.price;
        });
    }, [items, sortBy]);
    
    return <List items={sortedItems} />;
}

// Memoize object to prevent re-renders
function Parent({ userId }) {
    const user = useMemo(() => ({ id: userId, name: 'John' }), [userId]);
    
    return <Child user={user} />;
}

// Memoize context value
function Provider() {
    const [theme, setTheme] = useState('light');
    
    const value = useMemo(() => ({
        theme,
        toggleTheme: () => setTheme(t => t === 'light' ? 'dark' : 'light')
    }), [theme]);
    
    return <Context.Provider value={value}>{children}</Context.Provider>;
}
```

---

## 4. useRef Advanced Patterns

### DOM Access
```javascript
// ✗ WRONG - Directly manipulating DOM
function TextInput() {
    const handleClick = () => {
        document.querySelector('input').focus();
    };
    
    return (
        <div>
            <input />
            <button onClick={handleClick}>Focus</button>
        </div>
    );
}

// ✓ CORRECT - Using useRef
function TextInput() {
    const inputRef = useRef(null);
    
    const handleClick = () => {
        inputRef.current.focus();
    };
    
    return (
        <div>
            <input ref={inputRef} />
            <button onClick={handleClick}>Focus</button>
        </div>
    );
}

// Getting input value
function Form() {
    const inputRef = useRef(null);
    
    const handleSubmit = () => {
        console.log(inputRef.current.value);
    };
    
    return (
        <form>
            <input ref={inputRef} />
            <button onClick={handleSubmit}>Submit</button>
        </form>
    );
}
```

### useRef for Mutable Values
```javascript
// Store mutable value that persists across renders
function StopWatch() {
    const intervalRef = useRef(null);
    const [time, setTime] = useState(0);
    
    const start = () => {
        intervalRef.current = setInterval(() => {
            setTime(t => t + 1);
        }, 100);
    };
    
    const stop = () => {
        clearInterval(intervalRef.current);
    };
    
    return (
        <div>
            <div>{time}</div>
            <button onClick={start}>Start</button>
            <button onClick={stop}>Stop</button>
        </div>
    );
}

// Persist previous value
function usePrevious(value) {
    const ref = useRef();
    
    useEffect(() => {
        ref.current = value;
    }, [value]);
    
    return ref.current;
}

// Usage
function Component({ count }) {
    const prevCount = usePrevious(count);
    return <div>Now: {count}, Before: {prevCount}</div>;
}
```

---

## 5. Creating Reusable Hooks

### useLocalStorage Hook
```javascript
function useLocalStorage(key, initialValue) {
    const [state, setState] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });
    
    const setValue = (value) => {
        try {
            const valueToStore = value instanceof Function ? value(state) : value;
            setState(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(error);
        }
    };
    
    return [state, setValue];
}

// Usage
const [name, setName] = useLocalStorage('name', 'John');
```

### useWindowSize Hook
```javascript
function useWindowSize() {
    const [size, setSize] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0
    });
    
    useEffect(() => {
        const handleResize = () => {
            setSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    return size;
}

// Usage
const { width, height } = useWindowSize();
```

### useDebounce Hook
```javascript
function useDebounce(value, delay = 500) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        
        return () => clearTimeout(timer);
    }, [value, delay]);
    
    return debouncedValue;
}

// Usage - Search with API call
function SearchUsers({ query }) {
    const debouncedQuery = useDebounce(query, 300);
    const { data: results } = useFetch(`/api/users?q=${debouncedQuery}`);
    
    return <div>{results}</div>;
}
```

---

## 6. Hook Testing

### Testing Custom Hooks
```javascript
import { renderHook, act } from '@testing-library/react';

// Test useToggle
test('useToggle toggles value', () => {
    const { result } = renderHook(() => useToggle(false));
    
    expect(result.current[0]).toBe(false);
    
    act(() => {
        result.current[1]();
    });
    
    expect(result.current[0]).toBe(true);
});

// Test useAsync
test('useAsync fetches data', async () => {
    const mockFetch = jest.fn()
        .mockResolvedValue({ success: true });
    
    const { result, waitForNextUpdate } = renderHook(() =>
        useAsync(mockFetch)
    );
    
    expect(result.current.status).toBe('pending');
    
    await waitForNextUpdate();
    
    expect(result.current.status).toBe('success');
    expect(result.current.value).toEqual({ success: true });
});

// Test useLocalStorage
test('useLocalStorage persists value', () => {
    const { result } = renderHook(() => useLocalStorage('test', 'initial'));
    
    expect(result.current[0]).toBe('initial');
    
    act(() => {
        result.current[1]('updated');
    });
    
    expect(result.current[0]).toBe('updated');
    expect(localStorage.getItem('test')).toBe('"updated"');
});
```

---

## 7. Common Pitfalls

### Pitfall 1: Dependencies
```javascript
// ✗ WRONG - Infinite loop
useEffect(() => {
    setData(fetch(...));
}, [data]);  // data changes, effect runs, data changes, loop!

// ✓ CORRECT - Proper dependencies
useEffect(() => {
    setData(fetch(...));
}, []);  // Run once on mount
```

### Pitfall 2: Closures
```javascript
// ✗ WRONG - Closure captures old value
useEffect(() => {
    const timer = setInterval(() => {
        console.log(count);  // Always logs initial count
    }, 1000);
}, []);

// ✓ CORRECT - Add to dependencies
useEffect(() => {
    const timer = setInterval(() => {
        console.log(count);
    }, 1000);
    return () => clearInterval(timer);
}, [count]);
```

---

## 8. Performance Considerations

### When NOT to Memoize
```javascript
// ✗ Over-memoizing (slower than needed)
useMemo(() => count + 1, [count]);  // Simple math doesn't need memoization

useCallback(() => setName(n), []);  // Simple setState doesn't need callback

// ✓ Memoize only expensive operations
useMemo(() => {
    return items.sort().filter().map();  // Complex computation
}, [items]);
```

---

## Exercises

### Exercise 1: useAsync Hook
```javascript
// Create hook that:
// - Takes async function
// - Returns status, data, error
// - Supports manual refetch

function useAsync(asyncFn, immediate = true) {
    // Your code
}
```

**Solution:**
```javascript
function useAsync(asyncFn, immediate = true) {
    const [status, setStatus] = useState('idle');
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    
    const execute = useCallback(async () => {
        setStatus('pending');
        try {
            const result = await asyncFn();
            setData(result);
            setStatus('success');
        } catch (err) {
            setError(err);
            setStatus('error');
        }
    }, [asyncFn]);
    
    useEffect(() => {
        if (immediate) execute();
    }, [execute, immediate]);
    
    return { status, data, error, execute };
}
```

### Exercise 2: useFetch Hook
```javascript
// Create hook that:
// - Fetches from URL
// - Caches results
// - Handles errors

function useFetch(url) {
    // Your code
}
```

**Solution:**
```javascript
function useFetch(url) {
    const cache = useRef({});
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        if (!url) return;
        
        if (cache.current[url]) {
            setData(cache.current[url]);
            return;
        }
        
        setLoading(true);
        fetch(url)
            .then(r => r.json())
            .then(d => {
                cache.current[url] = d;
                setData(d);
            })
            .catch(setError)
            .finally(() => setLoading(false));
    }, [url]);
    
    return { data, loading, error };
}
```

### Exercise 3: useDebounce Hook
```javascript
// Create hook that:
// - Debounces value changes
// - Takes delay parameter
// - Returns debounced value

function useDebounce(value, delay) {
    // Your code
}
```

**Solution:**
```javascript
function useDebounce(value, delay = 500) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        
        return () => clearTimeout(timer);
    }, [value, delay]);
    
    return debouncedValue;
}
```

---

## Interview Questions

### Theoretical Questions

**Q1: What is custom hook?**
A: Function that reuses stateful logic.

**Q2: When to use useCallback?**
A: When passing function to memoized child component.

**Q3: When to use useMemo?**
A: For expensive calculations or object dependencies.

**Q4: What is closure in hooks?**
A: Function captures variables from its scope.

**Q5: Why track dependencies?**
A: Ensures hook runs when needed.

---

## Code-Based Interview Questions

**Q1: What is wrong?**
```javascript
useEffect(() => {
    setData(fetch(...));
}, [data]);
// Issue?
```
A: Infinite loop - data dependency causes updates

**Q2: Predict:**
```javascript
const { count } = props;
useEffect(() => {
    console.log(count);
}, []);
// Logs?
```
A: Initial count only, stale closure

**Q3: What is output?**
```javascript
const memoized = useMemo(() => ({a: 1}), []);
<Child obj={memoized} />
// Re-renders Child?
```
A: No, same object reference

**Q4: Spot the issue:**
```javascript
useCallback(() => {
    setSomething(value);  // value from prop
}, []);
// Problem?
```
A: Stale prop value, need in dependencies

**Q5: What happens?**
```javascript
const ref = useRef(0);
ref.current++;
// Re-render?
```
A: No, ref changes don't trigger render

---

## Summary

- **Custom Hooks:** Encapsulate reusable logic
- **Composition:** Combine hooks for complex behavior
- **Dependencies:** Critical for correctness
- **useCallback/useMemo:** Optimize strategically, not everywhere
- **useRef:** Persist mutable values, DOM access
- **Testing:** Use renderHook from testing library
- **Performance:** Profile before optimizing
- **Closures:** Understand scope and stale values

**Next:** State management patterns!
