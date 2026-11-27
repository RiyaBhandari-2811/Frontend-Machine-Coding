# React State Management - Context API & Redux

## Table of Contents
1. Context API Basics
2. useReducer with Context
3. Redux Introduction
4. Redux with React
5. Redux DevTools
6. When to Use Each
7. Best Practices
8. Common Patterns

---

## 1. Context API Basics

### Setting Up Context
```javascript
import { createContext, useState } from 'react';

// Create context
export const UserContext = createContext();

// Provider component
export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    
    const login = async (email, password) => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            setUser(data);
        } finally {
            setIsLoading(false);
        }
    };
    
    const logout = () => {
        setUser(null);
    };
    
    const value = { user, login, logout, isLoading };
    
    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}

// Hook to use context
export function useUser() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used inside UserProvider');
    }
    return context;
}
```

### App Structure
```javascript
import { UserProvider } from './UserContext';

function App() {
    return (
        <UserProvider>
            <Header />
            <Main />
            <Footer />
        </UserProvider>
    );
}

function Header() {
    const { user, logout } = useUser();
    
    return (
        <header>
            {user ? (
                <>
                    <span>Welcome {user.name}</span>
                    <button onClick={logout}>Logout</button>
                </>
            ) : (
                <span>Not logged in</span>
            )}
        </header>
    );
}
```

---

## 2. useReducer with Context

### Advanced State Management
```javascript
import { createContext, useReducer, useContext } from 'react';

// Action types
const ACTIONS = {
    SET_USER: 'SET_USER',
    SET_LOADING: 'SET_LOADING',
    SET_ERROR: 'SET_ERROR',
    LOGOUT: 'LOGOUT'
};

// Initial state
const initialState = {
    user: null,
    isLoading: false,
    error: null
};

// Reducer
function authReducer(state, action) {
    switch(action.type) {
        case ACTIONS.SET_USER:
            return { ...state, user: action.payload, error: null };
        
        case ACTIONS.SET_LOADING:
            return { ...state, isLoading: action.payload };
        
        case ACTIONS.SET_ERROR:
            return { ...state, error: action.payload };
        
        case ACTIONS.LOGOUT:
            return initialState;
        
        default:
            return state;
    }
}

// Context
const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [state, dispatch] = useReducer(authReducer, initialState);
    
    const login = async (email, password) => {
        dispatch({ type: ACTIONS.SET_LOADING, payload: true });
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            dispatch({ type: ACTIONS.SET_USER, payload: data });
        } catch (error) {
            dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
        } finally {
            dispatch({ type: ACTIONS.SET_LOADING, payload: false });
        }
    };
    
    const logout = () => {
        dispatch({ type: ACTIONS.LOGOUT });
    };
    
    return (
        <AuthContext.Provider value={{ state, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
```

---

## 3. Redux Introduction

### Redux Concepts
```javascript
// Redux = Global State Container

// Store: Single source of truth (global state)
// Action: What happened (object with type)
// Reducer: How to update state based on action
// Dispatch: Send action to reducer

// Flow:
// Component -> dispatch(action) -> Reducer -> Store -> Component re-renders

const INCREMENT = 'INCREMENT';
const DECREMENT = 'DECREMENT';
const RESET = 'RESET';

// Reducer
function counterReducer(state = 0, action) {
    switch(action.type) {
        case INCREMENT:
            return state + 1;
        case DECREMENT:
            return state - 1;
        case RESET:
            return 0;
        default:
            return state;
    }
}

// Action creators (functions that return actions)
const increment = () => ({ type: INCREMENT });
const decrement = () => ({ type: DECREMENT });
const reset = () => ({ type: RESET });

// Store creation (would use Redux library)
// const store = createStore(counterReducer);
```

### Redux with Multiple Reducers
```javascript
import { createStore, combineReducers } from 'redux';

// User reducer
function userReducer(state = null, action) {
    switch(action.type) {
        case 'LOGIN':
            return action.payload;
        case 'LOGOUT':
            return null;
        default:
            return state;
    }
}

// Theme reducer
function themeReducer(state = 'light', action) {
    switch(action.type) {
        case 'TOGGLE_THEME':
            return state === 'light' ? 'dark' : 'light';
        default:
            return state;
    }
}

// Combine reducers
const rootReducer = combineReducers({
    user: userReducer,
    theme: themeReducer
});

// Store
const store = createStore(rootReducer);

// Now store state looks like:
// { user: null, theme: 'light' }
```

---

## 4. Redux with React

### React-Redux Integration
```javascript
import { createStore } from 'redux';
import { Provider, useSelector, useDispatch } from 'react-redux';

// Reducer
function counterReducer(state = 0, action) {
    switch(action.type) {
        case 'INCREMENT':
            return state + 1;
        case 'DECREMENT':
            return state - 1;
        default:
            return state;
    }
}

// Store
const store = createStore(counterReducer);

// App with Provider
function App() {
    return (
        <Provider store={store}>
            <Counter />
        </Provider>
    );
}

// Component using Redux
function Counter() {
    const count = useSelector(state => state);  // Get from store
    const dispatch = useDispatch();              // Dispatch actions
    
    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
            <button onClick={() => dispatch({ type: 'DECREMENT' })}>-</button>
        </div>
    );
}
```

### Redux Thunk (Async Actions)
```javascript
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

// Initial state
const initialState = {
    users: [],
    loading: false,
    error: null
};

// Reducer
function usersReducer(state = initialState, action) {
    switch(action.type) {
        case 'FETCH_START':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return { ...state, users: action.payload, loading: false };
        case 'FETCH_ERROR':
            return { ...state, error: action.payload, loading: false };
        default:
            return state;
    }
}

// Thunk action (async action creator)
function fetchUsers() {
    return async (dispatch) => {
        dispatch({ type: 'FETCH_START' });
        try {
            const response = await fetch('/api/users');
            const data = await response.json();
            dispatch({ type: 'FETCH_SUCCESS', payload: data });
        } catch (error) {
            dispatch({ type: 'FETCH_ERROR', payload: error.message });
        }
    };
}

// Store with thunk middleware
const store = createStore(usersReducer, applyMiddleware(thunk));

// Component
function UserList() {
    const { users, loading } = useSelector(state => state);
    const dispatch = useDispatch();
    
    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);
    
    return (
        <div>
            {loading ? <p>Loading...</p> : <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>}
        </div>
    );
}
```

---

## 5. Redux DevTools

### Setup and Usage
```javascript
import { createStore, applyMiddleware, compose } from 'redux';

const composeEnhancers = 
    (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

const store = createStore(
    counterReducer,
    composeEnhancers(applyMiddleware(thunk))
);

// Now can inspect Redux state in browser DevTools:
// 1. Install Redux DevTools browser extension
// 2. Open DevTools (F12)
// 3. See Redux tab with:
//    - Current state
//    - Action history
//    - Time travel (undo/redo)
//    - Action details
```

---

## 6. When to Use Each

### Context API vs Redux
```javascript
// USE CONTEXT API WHEN:
// 1. Small to medium apps
// 2. Simple state structure
// 3. Few state changes
// 4. No complex business logic
// 5. Want to avoid extra dependencies

// Example: User auth, theme
function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <Main />
            </AuthProvider>
        </ThemeProvider>
    );
}

// USE REDUX WHEN:
// 1. Large apps
// 2. Complex state structure
// 3. Many state changes
// 4. Need time-travel debugging
// 5. Team familiar with Redux
// 6. Need middleware for async logic

// Example: E-commerce with cart, filters, auth, notifications
const store = createStore(
    combineReducers({
        cart: cartReducer,
        filters: filtersReducer,
        user: userReducer,
        notifications: notificationsReducer
    })
);
```

### Context Performance Consideration
```javascript
// ✗ PROBLEM - All consumers re-render on any state change
const AppContext = createContext();

export function AppProvider({ children }) {
    const [user, setUser] = useState(null);
    const [theme, setTheme] = useState('light');
    
    return (
        <AppContext.Provider value={{ user, theme, setUser, setTheme }}>
            {children}
        </AppContext.Provider>
    );
}

// If only theme changes, all consumers using user re-render too!

// ✓ SOLUTION - Split contexts
export function AppProvider({ children }) {
    return (
        <UserProvider>
            <ThemeProvider>
                {children}
            </ThemeProvider>
        </UserProvider>
    );
}
```

---

## 7. Best Practices

### Redux Best Practices
```javascript
// 1. Keep reducers pure (no mutations)

// ✗ WRONG - Mutating state
function todoReducer(state = [], action) {
    if (action.type === 'ADD') {
        state.push(action.payload);  // MUTATION!
        return state;
    }
    return state;
}

// ✓ CORRECT - Returning new state
function todoReducer(state = [], action) {
    if (action.type === 'ADD') {
        return [...state, action.payload];
    }
    return state;
}

// 2. Single responsibility
// Good: One reducer per domain
// Bad: One huge reducer for everything

// 3. Use action creators
const addTodo = (text) => ({ type: 'ADD', payload: text });
dispatch(addTodo('Learn Redux'));  // Better than writing action inline

// 4. Keep selectors consistent
const selectUser = (state) => state.user;
const selectTheme = (state) => state.theme;

// Use consistently
const user = useSelector(selectUser);
```

### Context API Best Practices
```javascript
// 1. Create custom hooks for context

// ✗ Using context directly
function Component() {
    const auth = useContext(AuthContext);
}

// ✓ Using custom hook
function Component() {
    const auth = useAuth();  // Cleaner
}

// 2. Split contexts by concern
export function AppProvider({ children }) {
    return (
        <AuthProvider>
            <ThemeProvider>
                <LanguageProvider>
                    {children}
                </LanguageProvider>
            </ThemeProvider>
        </AuthProvider>
    );
}

// 3. Memoize context value
function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    
    const value = useMemo(() => ({
        user,
        setUser
    }), [user]);
    
    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}
```

---

## Exercises

### Exercise 1: Theme Context
```javascript
// Create ThemeProvider with toggle functionality
// Use in Header and Main components

function ThemeProvider({ children }) {
    // Your code
}
```

**Solution:**
```javascript
const ThemeContext = createContext();

function ThemeProvider({ children }) {
    const [theme, setTheme] = useState('light');
    
    const toggle = () => setTheme(t => t === 'light' ? 'dark' : 'light');
    
    return (
        <ThemeContext.Provider value={{ theme, toggle }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    return useContext(ThemeContext);
}
```

### Exercise 2: Counter Redux
```javascript
// Create Redux store for counter
// Connect React component with useSelector/useDispatch

function Counter() {
    // Your code
}
```

**Solution:**
```javascript
function counterReducer(state = 0, action) {
    switch(action.type) {
        case 'INCREMENT': return state + 1;
        case 'DECREMENT': return state - 1;
        default: return state;
    }
}

const store = createStore(counterReducer);

function Counter() {
    const count = useSelector(state => state);
    const dispatch = useDispatch();
    
    return (
        <div>
            <p>{count}</p>
            <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
            <button onClick={() => dispatch({ type: 'DECREMENT' })}>-</button>
        </div>
    );
}
```

### Exercise 3: Todo Redux with Thunk
```javascript
// Create Redux store with async fetch
// Use thunk to fetch todos

function TodoList() {
    // Your code
}
```

**Solution:**
```javascript
const initialState = { todos: [], loading: false };

function todoReducer(state = initialState, action) {
    switch(action.type) {
        case 'FETCH_START':
            return { ...state, loading: true };
        case 'FETCH_SUCCESS':
            return { todos: action.payload, loading: false };
        default:
            return state;
    }
}

function fetchTodos() {
    return async (dispatch) => {
        dispatch({ type: 'FETCH_START' });
        const data = await fetch('/api/todos').then(r => r.json());
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
    };
}

const store = createStore(todoReducer, applyMiddleware(thunk));

function TodoList() {
    const { todos, loading } = useSelector(state => state);
    const dispatch = useDispatch();
    
    useEffect(() => {
        dispatch(fetchTodos());
    }, [dispatch]);
    
    return loading ? <p>Loading...</p> : <ul>{todos.map(t => <li key={t.id}>{t.title}</li>)}</ul>;
}
```

---

## Interview Questions

### Theoretical Questions

**Q1: What is Context API?**
A: Way to pass data to deeply nested components without prop drilling.

**Q2: What is Redux?**
A: Predictable state management library based on flux pattern.

**Q3: What is a reducer?**
A: Pure function that takes state and action, returns new state.

**Q4: What is thunk?**
A: Middleware to handle async actions in Redux.

**Q5: When to use Context vs Redux?**
A: Context for simple apps, Redux for complex apps.

---

## Code-Based Interview Questions

**Q1: What is output?**
```javascript
const { theme } = useContext(ThemeContext);
// Will component re-render if unrelated context value changes?
```
A: Yes (whole context value is compared)

**Q2: Predict:**
```javascript
function userReducer(state, action) {
    state.name = action.payload;
    return state;
}
// Will this work correctly?
```
A: No (mutating state is wrong)

**Q3: What happens?**
```javascript
const store = createStore(reducer);
const user = useSelector(state => state.user);
// Can component see Redux changes?
```
A: Yes (useSelector subscribes to store)

**Q4: Spot the issue:**
```javascript
function fetchData() {
    dispatch({ type: 'FETCH' });  // Wrong action type
}
```
A: Thunk must be used, not direct dispatch

**Q5: What is output?**
```javascript
const value = { user, setUser };
<Context.Provider value={value}>
// New object every render, consumers re-render?
```
A: Yes (use useMemo to fix)

---

## Follow-up Questions & Confusing Concepts

**Q: Does Redux require React?**
A: No, can be used with any framework.

**Q: Can I have multiple stores?**
A: Not recommended (defeats purpose).

**Q: Is Redux dead?**
A: No, but newer alternatives like Zustand exist.

**Q: When does useSelector re-render?**
A: When selector result changes (by reference).

---

## Summary

- **Context API**: Simple, built-in, good for simple state
- **useReducer**: Complex state with predictable logic
- **Redux**: Predictable, debuggable, good for large apps
- **Action**: Object describing what happened
- **Reducer**: Pure function updating state
- **Dispatch**: Sending actions to reducer
- **Thunk**: Middleware for async actions
- **Split Concerns**: Separate contexts/reducers by domain
- **Performance**: Memoize context values
- **DevTools**: Redux DevTools for debugging

**Next Step:** Master routing and navigation!
