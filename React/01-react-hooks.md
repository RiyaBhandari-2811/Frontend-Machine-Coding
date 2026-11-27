# React Hooks Deep Dive

## Table of Contents
1. useState - State Management
2. useEffect - Side Effects
3. useContext - Context API
4. useReducer - Complex State
5. useCallback & useMemo
6. useRef - Direct DOM Access
7. Custom Hooks
8. Hook Rules
9. Best Practices

---

## 1. useState - State Management

### Advanced useState
```javascript
// Lazy initialization
function Component() {
    // expensiveComputation() runs ONCE on mount
    const [state, setState] = useState(() => expensiveComputation());
    return <div>{state}</div>;
}

// Without lazy init - runs every render!
function BadComponent() {
    const [state, setState] = useState(expensiveComputation());  // DON'T!
}

// Multiple states vs single object
// ✓ GOOD - Separate concerns
function Form() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
}

// ✗ AVOID - Harder to update
function Form() {
    const [form, setForm] = useState({ name: '', email: '', message: '' });
    // Always need: setForm({ ...form, name: value })
}

// Updating complex state
function Profile() {
    const [user, setUser] = useState({ name: 'John', settings: { theme: 'dark' } });
    
    const updateTheme = (newTheme) => {
        setUser({
            ...user,
            settings: {
                ...user.settings,
                theme: newTheme
            }
        });
    };
    
    return <button onClick={() => updateTheme('light')}>Change Theme</button>;
}
```

---

## 2. useEffect - Side Effects

### Basic useEffect
```javascript
import { useEffect, useState } from 'react';

// Runs after every render (DANGEROUS!)
useEffect(() => {
    console.log('Runs after every render');
});

// Runs once on mount ([] dependency)
useEffect(() => {
    console.log('Runs once on mount');
}, []);

// Runs when dependencies change
function UserProfile({ userId }) {
    const [user, setUser] = useState(null);
    
    useEffect(() => {
        fetchUser(userId).then(setUser);
    }, [userId]);  // Re-run when userId changes
    
    return <div>{user?.name}</div>;
}

// Cleanup function (runs on unmount)
function Timer() {
    useEffect(() => {
        const interval = setInterval(() => {
            console.log('tick');
        }, 1000);
        
        return () => clearInterval(interval);  // Cleanup
    }, []);
    
    return <p>Timer running</p>;
}
```

### Common Patterns
```javascript
// Fetching data
function UserList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        setLoading(true);
        fetch('/api/users')
            .then(r => r.json())
            .then(data => {
                setUsers(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err);
                setLoading(false);
            });
    }, []);
    
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    
    return (
        <ul>
            {users.map(u => <li key={u.id}>{u.name}</li>)}
        </ul>
    );
}

// Event listener
function WindowSize() {
    const [size, setSize] = useState({ width: 0, height: 0 });
    
    useEffect(() => {
        const handleResize = () => {
            setSize({ width: window.innerWidth, height: window.innerHeight });
        };
        
        window.addEventListener('resize', handleResize);
        
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    return <p>{size.width}x{size.height}</p>;
}

// Document title
function Page({ title }) {
    useEffect(() => {
        document.title = title;
    }, [title]);
    
    return <h1>{title}</h1>;
}
```

---

## 3. useContext - Context API

### Context Setup
```javascript
import { createContext, useContext, useState } from 'react';

// Create context
const ThemeContext = createContext();

// Provider component
export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState('light');
    
    const toggleTheme = () => {
        setTheme(t => t === 'light' ? 'dark' : 'light');
    };
    
    const value = { theme, toggleTheme };
    
    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

// Hook to use context
export function useTheme() {
    return useContext(ThemeContext);
}

// Usage in App
function App() {
    return (
        <ThemeProvider>
            <Header />
            <Main />
        </ThemeProvider>
    );
}

// Usage in component
function Header() {
    const { theme, toggleTheme } = useTheme();
    
    return (
        <div style={{ background: theme === 'light' ? '#fff' : '#333' }}>
            <button onClick={toggleTheme}>Toggle Theme</button>
        </div>
    );
}
```

### Multiple Contexts
```javascript
const ThemeContext = createContext();
const AuthContext = createContext();
const LanguageContext = createContext();

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <LanguageProvider>
                    <Main />
                </LanguageProvider>
            </AuthProvider>
        </ThemeProvider>
    );
}

// Or combine into single context
const AppContext = createContext();

export function AppProvider({ children }) {
    const [theme, setTheme] = useState('light');
    const [auth, setAuth] = useState(null);
    const [language, setLanguage] = useState('en');
    
    return (
        <AppContext.Provider value={{ theme, auth, language }}>
            {children}
        </AppContext.Provider>
    );
}
```

---

## 4. useReducer - Complex State

### useReducer Pattern
```javascript
import { useReducer } from 'react';

// Action types
const ACTIONS = {
    ADD: 'add',
    REMOVE: 'remove',
    UPDATE: 'update',
    RESET: 'reset'
};

// Reducer function
function todoReducer(state, action) {
    switch(action.type) {
        case ACTIONS.ADD:
            return [...state, { id: Date.now(), text: action.payload, done: false }];
        
        case ACTIONS.REMOVE:
            return state.filter(t => t.id !== action.payload);
        
        case ACTIONS.UPDATE:
            return state.map(t =>
                t.id === action.payload.id ? { ...t, done: !t.done } : t
            );
        
        case ACTIONS.RESET:
            return [];
        
        default:
            return state;
    }
}

// Component using reducer
function TodoList() {
    const [todos, dispatch] = useReducer(todoReducer, []);
    
    const addTodo = (text) => {
        dispatch({ type: ACTIONS.ADD, payload: text });
    };
    
    const removeTodo = (id) => {
        dispatch({ type: ACTIONS.REMOVE, payload: id });
    };
    
    const toggleTodo = (id) => {
        dispatch({ type: ACTIONS.UPDATE, payload: { id } });
    };
    
    return (
        <div>
            {todos.map(t => (
                <div key={t.id}>
                    <input type="checkbox" checked={t.done} onChange={() => toggleTodo(t.id)} />
                    {t.text}
                    <button onClick={() => removeTodo(t.id)}>Delete</button>
                </div>
            ))}
        </div>
    );
}
```

### useState vs useReducer
```javascript
// useState - For simple state
function Counter() {
    const [count, setCount] = useState(0);
    return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}

// useReducer - For complex state logic
function Counter() {
    const [state, dispatch] = useReducer(reducer, { count: 0 });
    return <button onClick={() => dispatch({ type: 'INCREMENT' })}>{state.count}</button>;
}

// When to use which:
// useState: Single values, simple updates
// useReducer: Multiple related values, complex logic, predictable updates
```

---

## 5. useCallback & useMemo

### useCallback
```javascript
import { useCallback, useState } from 'react';

// Without useCallback - new function every render
function Parent() {
    const [count, setCount] = useState(0);
    
    const handleClick = () => {  // New function every render!
        console.log('clicked');
    };
    
    return <Child onClick={handleClick} />;
}

// With useCallback - same function reference
function Parent() {
    const [count, setCount] = useState(0);
    
    const handleClick = useCallback(() => {  // Same function if deps unchanged
        console.log('clicked');
    }, []);  // No dependencies = same function always
    
    return <Child onClick={handleClick} />;
}

// With dependencies
function Parent({ userId }) {
    const handleFetch = useCallback(() => {
        fetch(`/api/user/${userId}`);
    }, [userId]);  // Recreate when userId changes
    
    return <Child onFetch={handleFetch} />;
}

// Memoized child component
const Child = React.memo(({ onClick }) => {
    return <button onClick={onClick}>Click</button>;
});
```

### useMemo
```javascript
import { useMemo, useState } from 'react';

// Without useMemo - expensive calculation every render
function Component({ data }) {
    const expensiveValue = calculateExpensive(data);  // Runs every render!
    return <div>{expensiveValue}</div>;
}

// With useMemo - cache expensive calculation
function Component({ data }) {
    const expensiveValue = useMemo(() => {
        return calculateExpensive(data);
    }, [data]);  // Recalculate only when data changes
    
    return <div>{expensiveValue}</div>;
}

// Memoizing objects to prevent re-renders
function Parent() {
    const config = useMemo(() => ({
        theme: 'dark',
        language: 'en'
    }), []);
    
    return <Child config={config} />;
}
```

---

## 6. useRef - Direct DOM Access

### useRef Basics
```javascript
import { useRef } from 'react';

// Focus input
function TextInput() {
    const inputRef = useRef(null);
    
    const handleClick = () => {
        inputRef.current.focus();
    };
    
    return (
        <>
            <input ref={inputRef} />
            <button onClick={handleClick}>Focus input</button>
        </>
    );
}

// Get input value
function Form() {
    const inputRef = useRef(null);
    
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(inputRef.current.value);  // Don't use this for state!
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <input ref={inputRef} />
            <button type="submit">Submit</button>
        </form>
    );
}

// Mutable value that doesn't cause re-render
function Stopwatch() {
    const intervalRef = useRef(null);
    const [seconds, setSeconds] = useState(0);
    
    const start = () => {
        intervalRef.current = setInterval(() => {
            setSeconds(s => s + 1);
        }, 1000);
    };
    
    const stop = () => {
        clearInterval(intervalRef.current);
    };
    
    return (
        <>
            <p>{seconds}s</p>
            <button onClick={start}>Start</button>
            <button onClick={stop}>Stop</button>
        </>
    );
}
```

### useRef vs useState
```javascript
// useState - Triggers re-render
function Counter() {
    const [count, setCount] = useState(0);  // Re-renders on change
    return <p>{count}</p>;
}

// useRef - No re-render
function Counter() {
    const countRef = useRef(0);  // No re-render!
    
    const increment = () => {
        countRef.current++;
        // Component won't re-render, can't see change
    };
    
    return <button onClick={increment}>Click</button>;
}

// useRef for display value vs internal tracking
function VideoPlayer() {
    const videoRef = useRef(null);
    
    const handlePlay = () => {
        videoRef.current.play();  // Direct API call
    };
    
    return (
        <>
            <video ref={videoRef} src="movie.mp4" />
            <button onClick={handlePlay}>Play</button>
        </>
    );
}
```

---

## 7. Custom Hooks

### Creating Custom Hooks
```javascript
// Custom hook for fetching data
function useFetch(url) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        fetch(url)
            .then(r => r.json())
            .then(d => { setData(d); setLoading(false); })
            .catch(e => { setError(e); setLoading(false); });
    }, [url]);
    
    return { data, loading, error };
}

// Usage
function UserProfile({ userId }) {
    const { data: user, loading, error } = useFetch(`/api/users/${userId}`);
    
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error</p>;
    
    return <h1>{user.name}</h1>;
}

// Custom hook for local storage
function useLocalStorage(key, initialValue) {
    const [state, setState] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch {
            return initialValue;
        }
    });
    
    const setValue = (value) => {
        setState(value);
        window.localStorage.setItem(key, JSON.stringify(value));
    };
    
    return [state, setValue];
}

// Usage
function Settings() {
    const [theme, setTheme] = useLocalStorage('theme', 'light');
    
    return (
        <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>
            Current: {theme}
        </button>
    );
}
```

### More Custom Hooks
```javascript
// useToggle
function useToggle(initial = false) {
    const [value, setValue] = useState(initial);
    const toggle = useCallback(() => setValue(v => !v), []);
    return [value, toggle];
}

// useAsync
function useAsync(asyncFunction, immediate = true) {
    const [status, setStatus] = useState('idle');
    const [result, setResult] = useState(null);
    
    useEffect(() => {
        if (!immediate) return;
        
        setStatus('pending');
        asyncFunction().then(
            r => { setResult(r); setStatus('success'); },
            e => { setResult(e); setStatus('error'); }
        );
    }, [asyncFunction, immediate]);
    
    return { status, result };
}

// useWindowSize
function useWindowSize() {
    const [size, setSize] = useState({ width: 0, height: 0 });
    
    useEffect(() => {
        const handleResize = () => {
            setSize({ width: window.innerWidth, height: window.innerHeight });
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    return size;
}
```

---

## 8. Hook Rules

### Rules of Hooks
```javascript
// 1. Only call at top level (not in loops, conditions)

// ✗ WRONG
function Component({ condition }) {
    if (condition) {
        const [state, setState] = useState(0);  // WRONG!
    }
}

// ✓ CORRECT
function Component({ condition }) {
    const [state, setState] = useState(0);  // TOP LEVEL
    
    if (condition) {
        // Use state inside condition
    }
}

// 2. Only call in React components (not regular functions)

// ✗ WRONG
function regularFunction() {
    const [state, setState] = useState(0);  // WRONG!
}

// ✓ CORRECT - In React component
function Component() {
    const [state, setState] = useState(0);  // OK!
}

// ✓ CORRECT - In custom hook
function useCustom() {
    const [state, setState] = useState(0);  // OK!
}

// 3. Dependency array importance
function Component({ id }) {
    useEffect(() => {
        // This runs only once ([]  means no deps)
        console.log('mount');
    }, []);
    
    useEffect(() => {
        // This runs when id changes
        console.log('id changed:', id);
    }, [id]);
    
    useEffect(() => {
        // This runs every render (no deps array)
        // console.log('every render - avoid!');
    });
}
```

---

## 9. Best Practices

### Hook Patterns
```javascript
// Extract logic to custom hooks
// ✗ HARD TO TEST
function Component() {
    const [count, setCount] = useState(0);
    useEffect(() => { /* complex logic */ }, [count]);
    return <div>{count}</div>;
}

// ✓ EASY TO TEST
function useCounter() {
    const [count, setCount] = useState(0);
    // Logic here
    return { count, setCount };
}

function Component() {
    const { count } = useCounter();
    return <div>{count}</div>;
}

// Keep dependencies correct
// ✗ MISSING DEPENDENCY - Stale data
function Component({ userId }) {
    useEffect(() => {
        fetch(`/api/user/${userId}`);
    }, []);  // userId missing!
}

// ✓ CORRECT - Include dependencies
function Component({ userId }) {
    useEffect(() => {
        fetch(`/api/user/${userId}`);
    }, [userId]);  // userId included
}

// Use functional updates for state depending on previous
// ✗ WRONG
const handleClick = () => {
    setCount(count + 1);  // Uses stale count
    setCount(count + 1);  // Uses stale count
};

// ✓ CORRECT
const handleClick = () => {
    setCount(c => c + 1);  // Uses updated value
    setCount(c => c + 1);  // Uses updated value
};
```

---

## Exercises

### Exercise 1: useEffect Cleanup
```javascript
// Create component that sets up interval
// Cleanup on unmount
function Timer() {
    // Your code
}
```

**Solution:**
```javascript
function Timer() {
    const [seconds, setSeconds] = useState(0);
    
    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds(s => s + 1);
        }, 1000);
        
        return () => clearInterval(interval);
    }, []);
    
    return <p>{seconds}s</p>;
}
```

### Exercise 2: Custom Hook
```javascript
// Create useInput hook for controlled input
// Should return value, setValue, reset

function useInput(initial = '') {
    // Your code
}
```

**Solution:**
```javascript
function useInput(initial = '') {
    const [value, setValue] = useState(initial);
    
    return {
        value,
        setValue,
        reset: () => setValue(initial),
        bind: { value, onChange: e => setValue(e.target.value) }
    };
}

// Usage
function Form() {
    const name = useInput('');
    return (
        <div>
            <input {...name.bind} />
            <button onClick={name.reset}>Reset</button>
        </div>
    );
}
```

### Exercise 3: useReducer Form
```javascript
// Create form with useReducer
// Handle multiple input fields

function useForm(initial) {
    // Your code
}
```

**Solution:**
```javascript
function useForm(initial) {
    const [formData, dispatch] = useReducer(
        (state, action) => {
            switch(action.type) {
                case 'SET_FIELD':
                    return { ...state, [action.field]: action.value };
                case 'RESET':
                    return initial;
                default:
                    return state;
            }
        },
        initial
    );
    
    return {
        formData,
        setField: (field, value) => dispatch({ type: 'SET_FIELD', field, value }),
        reset: () => dispatch({ type: 'RESET' })
    };
}
```

---

## Interview Questions

### Theoretical Questions

**Q1: What is useEffect?**
A: Hook to run side effects (fetching, timers, subscriptions) in functional components.

**Q2: What is dependency array?**
A: Array that determines when effect runs. Empty = once. Missing = every render.

**Q3: What is useContext?**
A: Hook to access context values without prop drilling.

**Q4: When to use useReducer vs useState?**
A: useReducer for complex state logic. useState for simple values.

**Q5: What is useRef?**
A: Hook to access DOM elements directly or store mutable values.

---

## Code-Based Interview Questions

**Q1: What is output?**
```javascript
function Component() {
    useEffect(() => {
        console.log('mount');
        return () => console.log('unmount');
    }, []);
}
// Order?
```
A: 'mount' on mount, 'unmount' on unmount

**Q2: Predict:**
```javascript
function Component({ id }) {
    useEffect(() => {
        fetch(`/api/user/${id}`);
    }, []);  // Missing dependency!
}
// If id changes?
```
A: Doesn't refetch (stale dependency)

**Q3: What is output?**
```javascript
const [count, setCount] = useState(0);
setCount(1);
setCount(2);
console.log(count);  // ?
```
A: 0 (setState is async)

**Q4: Spot the issue:**
```javascript
useEffect(() => {
    const interval = setInterval(() => {
        setCount(c => c + 1);
    }, 1000);
}, [count]);  // Should this include count?
```
A: No, causes restart every render

**Q5: What is output?**
```javascript
const ref = useRef(0);
ref.current++;
// Component re-renders?
```
A: No (useRef doesn't trigger re-render)

---

## Follow-up Questions & Confusing Concepts

**Q: Does useEffect run before or after render?**
A: After render (after DOM painted).

**Q: Can I use async directly in useEffect?**
A: No, need wrapper function.

**Q: What if dependency changes constantly?**
A: Effect runs every render, can cause infinite loops.

**Q: Why call it cleanup function?**
A: Cleans up resources (intervals, listeners, subscriptions).

---

## Summary

- **useState**: Simple state management
- **useEffect**: Side effects and lifecycle
- **useContext**: Share data without prop drilling
- **useReducer**: Complex state with actions
- **useCallback**: Memoize functions
- **useMemo**: Memoize values
- **useRef**: Direct DOM access or mutable values
- **Custom Hooks**: Reusable logic
- **Hook Rules**: Top-level only, in components/hooks
- **Dependencies**: Include all external values used in effect

**Next Step:** Master rendering optimization and advanced patterns!
