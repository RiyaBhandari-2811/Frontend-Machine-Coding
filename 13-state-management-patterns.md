# State Management Patterns & Scaling

## Table of Contents
1. Local State vs Global State
2. State Colocation
3. Redux Patterns
4. Context API Optimization
5. Zustand & Alternative Libraries
6. Data Fetching Patterns
7. State Machine Patterns
8. Migration Strategies

---

## 1. Local State vs Global State

### When to Use Each
```javascript
// ✓ LOCAL STATE - UI state, isolated
function SearchInput() {
    const [input, setInput] = useState('');  // Only this component needs it
    const [isFocused, setIsFocused] = useState(false);
    
    return (
        <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onFocus={() => setIsFocused(true)}
        />
    );
}

// ✓ GLOBAL STATE - User info, app settings
// User needs access in many components
const AuthContext = createContext();

function Provider({ children }) {
    const [user, setUser] = useState(null);
    
    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}

// Benefits of local state:
// - Easier to reason about
// - Better performance (fewer re-renders)
// - Easier to test
// - No prop drilling needed
```

### Anti-pattern: Over-globalization
```javascript
// ✗ WRONG - Everything in global store
const store = {
    user: { ... },
    theme: 'light',
    sidebarOpen: false,  // Local UI state - shouldn't be global!
    searchInput: '',     // Local UI state - shouldn't be global!
    sortBy: 'name',
    filterBy: 'active',
    page: 1,
    isLoading: false
};

// ✓ CORRECT - Only share what's needed
const globalStore = {
    user: { ... },
    theme: 'light',
    sortBy: 'name',
    filterBy: 'active'
};

// Local UI state stays in components
function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    return <aside style={{ display: isOpen ? 'block' : 'none' }} />;
}
```

---

## 2. State Colocation

### Lift State Strategically
```javascript
// ✗ WRONG - Lifting too much
function App() {
    const [inputValue, setInputValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [cursorPosition, setCursorPosition] = useState(0);
    // All lifted to App, causes unnecessary re-renders
    
    return <SearchInput input={inputValue} onInput={setInputValue} />;
}

// ✓ CORRECT - Keep state where it's used
function SearchInput() {
    const [inputValue, setInputValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    
    return <input value={inputValue} onChange={e => setInputValue(e.target.value)} />;
}

// ✓ LIFT ONLY WHEN NEEDED
function Dashboard() {
    const [selectedTab, setSelectedTab] = useState('overview');
    
    return (
        <div>
            <Tabs selected={selectedTab} onChange={setSelectedTab} />
            {selectedTab === 'overview' && <Overview />}
            {selectedTab === 'details' && <Details />}
        </div>
    );
}
```

---

## 3. Redux Patterns

### Redux with Hooks
```javascript
import { useSelector, useDispatch } from 'react-redux';

// Selector - Get state
function UserProfile() {
    const user = useSelector(state => state.auth.user);
    const isLoading = useSelector(state => state.auth.isLoading);
    
    return <div>{isLoading ? 'Loading' : user.name}</div>;
}

// Action and reducer
const authSlice = createSlice({
    name: 'auth',
    initialState: { user: null, isLoading: false },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isLoading = false;
            });
    }
});

// Async action
export const fetchUser = createAsyncThunk(
    'auth/fetchUser',
    async (userId) => {
        const response = await fetch(`/api/users/${userId}`);
        return response.json();
    }
);
```

### Redux Toolkit Best Practices
```javascript
import { createSlice, createAsyncThunk, configureStore } from '@reduxjs/toolkit';

// Slice = reducer + actions combined
const todoSlice = createSlice({
    name: 'todos',
    initialState: {
        items: [],
        loading: false,
        error: null
    },
    reducers: {
        // Synchronous actions
        addTodo: (state, action) => {
            state.items.push(action.payload);
        },
        removeTodo: (state, action) => {
            state.items = state.items.filter(t => t.id !== action.payload);
        }
    },
    extraReducers: (builder) => {
        // Handle async actions
        builder
            .addCase(fetchTodos.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchTodos.fulfilled, (state, action) => {
                state.items = action.payload;
                state.loading = false;
            })
            .addCase(fetchTodos.rejected, (state, action) => {
                state.error = action.error.message;
                state.loading = false;
            });
    }
});

export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
    const response = await fetch('/api/todos');
    return response.json();
});

// Store
const store = configureStore({
    reducer: {
        todos: todoSlice.reducer
    }
});

export const { addTodo, removeTodo } = todoSlice.actions;
```

---

## 4. Context API Optimization

### Preventing Unnecessary Re-renders
```javascript
// ✗ WRONG - Everything in one context (all consumers re-render)
const AppContext = createContext();

function Provider({ children }) {
    const [user, setUser] = useState(null);
    const [theme, setTheme] = useState('light');
    const [notification, setNotification] = useState(null);
    
    const value = { user, theme, notification, setUser, setTheme, setNotification };
    
    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Every consumer re-renders when ANY value changes

// ✓ CORRECT - Separate contexts by concern
const AuthContext = createContext();
const ThemeContext = createContext();
const NotificationContext = createContext();

// Or split value and setters
const UserContext = createContext();
const UserSetterContext = createContext();

function Provider({ children }) {
    const [user, setUser] = useState(null);
    
    const userValue = useMemo(() => ({ user }), [user]);
    const setterValue = useMemo(() => ({ setUser }), []);
    
    return (
        <UserContext.Provider value={userValue}>
            <UserSetterContext.Provider value={setterValue}>
                {children}
            </UserSetterContext.Provider>
        </UserContext.Provider>
    );
}

// Now only components reading user re-render on user change
```

### Memoization Strategies
```javascript
function Provider({ children }) {
    const [user, setUser] = useState(null);
    const [theme, setTheme] = useState('light');
    
    // Memoize user value
    const userValue = useMemo(() => ({
        user,
        setUser
    }), [user]);
    
    // Memoize theme value
    const themeValue = useMemo(() => ({
        theme,
        setTheme
    }), [theme]);
    
    return (
        <UserContext.Provider value={userValue}>
            <ThemeContext.Provider value={themeValue}>
                {children}
            </ThemeContext.Provider>
        </UserContext.Provider>
    );
}

// Selector hook to memoize selection
function useUser() {
    const context = useContext(UserContext);
    
    return useMemo(() => ({
        user: context.user
    }), [context.user]);
}
```

---

## 5. Zustand & Alternative Libraries

### Zustand (Lightweight Alternative)
```javascript
import create from 'zustand';

// Simple store
const useStore = create((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    logout: () => set({ user: null })
}));

// Usage
function Component() {
    const user = useStore(state => state.user);
    const setUser = useStore(state => state.setUser);
    
    return <div>{user?.name}</div>;
}

// Async actions
const useStore = create((set) => ({
    user: null,
    isLoading: false,
    fetchUser: async (id) => {
        set({ isLoading: true });
        const user = await fetch(`/api/users/${id}`).then(r => r.json());
        set({ user, isLoading: false });
    }
}));

// Advanced: Middleware
const useStore = create(
    immer(
        (set) => ({
            todos: [],
            addTodo: (todo) => set((state) => {
                state.todos.push(todo);  // Immer handles immutability
            })
        })
    )
);

// Persist plugin
const useStore = create(
    persist(
        (set) => ({
            user: null,
            setUser: (user) => set({ user })
        }),
        { name: 'user-storage' }  // localStorage key
    )
);
```

### Recoil (Facebook Alternative)
```javascript
import { atom, useRecoilState, selector } from 'recoil';

// Atom = smallest unit of state
const userAtom = atom({
    key: 'user',
    default: null
});

const todoListAtom = atom({
    key: 'todoList',
    default: []
});

// Selector = derived state
const todoCountSelector = selector({
    key: 'todoCount',
    get: ({ get }) => {
        const todos = get(todoListAtom);
        return todos.length;
    }
});

// Usage
function Component() {
    const [user, setUser] = useRecoilState(userAtom);
    const todoCount = useRecoilValue(todoCountSelector);
    
    return <div>User: {user?.name}, Todos: {todoCount}</div>;
}
```

---

## 6. Data Fetching Patterns

### React Query (Server State)
```javascript
import { useQuery, useMutation } from '@tanstack/react-query';

// Fetching
function Users() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['users'],
        queryFn: () => fetch('/api/users').then(r => r.json())
    });
    
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error!</div>;
    
    return <div>{data?.map(u => <p key={u.id}>{u.name}</p>)}</div>;
}

// Mutation (create/update/delete)
function CreateUser() {
    const mutation = useMutation({
        mutationFn: (newUser) => fetch('/api/users', {
            method: 'POST',
            body: JSON.stringify(newUser)
        }).then(r => r.json())
    });
    
    return (
        <button onClick={() => mutation.mutate({ name: 'John' })}>
            {mutation.isPending ? 'Creating...' : 'Create'}
        </button>
    );
}

// Automatic caching and refetching
// Stale-while-revalidate pattern
// Background refetching
```

---

## 7. State Machine Patterns

### useReducer for Complex State
```javascript
// Traffic light state machine
const trafficLightMachine = {
    RED: { next: 'GREEN' },
    GREEN: { next: 'YELLOW' },
    YELLOW: { next: 'RED' }
};

function TrafficLight() {
    const [state, dispatch] = useReducer(
        (state, action) => {
            if (action.type === 'CHANGE') {
                return trafficLightMachine[state].next;
            }
            return state;
        },
        'RED'
    );
    
    return (
        <div>
            <div className={`light ${state.toLowerCase()}`} />
            <button onClick={() => dispatch({ type: 'CHANGE' })}>
                Change
            </button>
        </div>
    );
}

// XState for complex machines
import { useMachine } from '@xstate/react';
import { createMachine } from 'xstate';

const fetchMachine = createMachine({
    id: 'fetch',
    initial: 'idle',
    states: {
        idle: {
            on: { FETCH: 'loading' }
        },
        loading: {
            on: {
                SUCCESS: 'success',
                ERROR: 'error'
            }
        },
        success: {
            on: { RESET: 'idle' }
        },
        error: {
            on: { RESET: 'idle' }
        }
    }
});

function Component() {
    const [state, send] = useMachine(fetchMachine);
    
    return (
        <div>
            Status: {state.value}
            <button onClick={() => send({ type: 'FETCH' })}>Fetch</button>
        </div>
    );
}
```

---

## 8. Migration Strategies

### From Local State to Global
```javascript
// Step 1: Create context
const UserContext = createContext();

// Step 2: Create provider
function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}

// Step 3: Move state to provider
function Component() {
    // Before:
    // const [user, setUser] = useState(null);
    
    // After:
    const { user, setUser } = useContext(UserContext);
}

// Step 4: Wrap app
function App() {
    return (
        <UserProvider>
            <Routes />
        </UserProvider>
    );
}
```

---

## Exercises

### Exercise 1: Custom Context Hook
```javascript
// Create context and useContext hook
// Throw error if used outside provider

function useAuth() {
    // Your code
}
```

**Solution:**
```javascript
const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    return (
        <AuthContext.Provider value={{ user, setUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used inside AuthProvider');
    }
    return context;
}
```

### Exercise 2: Redux Slice
```javascript
// Create counter slice with:
// - increment, decrement actions
// - async fetch action

const counterSlice = createSlice({
    // Your code
});
```

**Solution:**
```javascript
const counterSlice = createSlice({
    name: 'counter',
    initialState: { value: 0, loading: false },
    reducers: {
        increment: (state) => { state.value += 1; },
        decrement: (state) => { state.value -= 1; }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchCounter.pending, (state) => {
            state.loading = true;
        }).addCase(fetchCounter.fulfilled, (state, action) => {
            state.value = action.payload;
            state.loading = false;
        });
    }
});

export const fetchCounter = createAsyncThunk('counter/fetch',
    async () => {
        return fetch('/api/counter').then(r => r.json());
    }
);
```

### Exercise 3: Zustand Store
```javascript
// Create user store with:
// - user state
// - setUser action
// - localStorage persistence

const useUserStore = create(
    // Your code
);
```

**Solution:**
```javascript
const useUserStore = create(
    persist(
        (set) => ({
            user: null,
            setUser: (user) => set({ user }),
            logout: () => set({ user: null })
        }),
        { name: 'user-store' }
    )
);
```

---

## Interview Questions

### Theoretical Questions

**Q1: When use Redux vs Context API?**
A: Redux for complex state, Context for simple.

**Q2: What is state colocation?**
A: Keep state as close as possible to where it's used.

**Q3: Why separate contexts?**
A: Avoid unnecessary re-renders.

**Q4: What is selector in Redux?**
A: Function to select part of state.

**Q5: What is state machine?**
A: Graph of states with transitions.

---

## Code-Based Interview Questions

**Q1: What is issue?**
```javascript
const value = { user, setUser };
<Context.Provider value={value}>
// Problem?
```
A: New object every render, use useMemo

**Q2: Predict:**
```javascript
const user = useSelector(state => state.user);
// Re-renders when?
```
A: When user changes (by reference)

**Q3: What is output?**
```javascript
set((state) => { state.items.push(item); })
// Is this safe?
```
A: Depends on library (Immer handles it)

**Q4: Spot the issue:**
```javascript
const [state, dispatch] = useReducer(reducer);
// Dispatch action?
```
A: Need to dispatch proper action object

**Q5: What happens?**
```javascript
const store = create((set) => ({ count: 0 }));
// Persist to localStorage?
```
A: No, need persist middleware

---

## Summary

- **Local State:** UI state that doesn't need sharing
- **Global State:** Shared across components
- **Context API:** Good for simple state
- **Redux:** Better for complex state
- **Zustand:** Lightweight alternative
- **React Query:** Server state management
- **State Machines:** Complex logic flows
- **Memoization:** Prevent unnecessary re-renders
- **Colocation:** Keep state close to usage

**Next:** Middleware and side effects!
