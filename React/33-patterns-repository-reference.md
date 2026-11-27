# React Patterns Repository - Quick Reference Guide

## Table of Contents
1. Component Patterns
2. State Management Patterns
3. Performance Patterns
4. Data Fetching Patterns
5. Form Patterns
6. Routing Patterns
7. Testing Patterns
8. Architecture Patterns

---

## 1. Component Patterns

### Higher-Order Component (HOC)
```javascript
// Pattern: Wraps component to add functionality
function withAuth(WrappedComponent) {
    return function ProtectedComponent(props) {
        const [user, setUser] = useState(null);
        
        useEffect(() => {
            checkAuth().then(setUser);
        }, []);
        
        if (!user) return <Redirect to="/login" />;
        
        return <WrappedComponent {...props} user={user} />;
    };
}

// Usage
const SecureDashboard = withAuth(Dashboard);
```

### Render Props
```javascript
// Pattern: Pass render function as prop
function DataFetcher({ url, children }) {
    const [data, setData] = useState(null);
    
    useEffect(() => {
        fetch(url).then(r => r.json()).then(setData);
    }, [url]);
    
    return children(data);
}

// Usage
<DataFetcher url="/api/users">
    {(users) => <UserList users={users} />}
</DataFetcher>
```

### Compound Component
```javascript
// Pattern: Related components that work together
function Select({ children, value, onChange }) {
    const [open, setOpen] = useState(false);
    
    return (
        <div>
            {React.Children.map(children, child =>
                React.cloneElement(child, { 
                    value, 
                    onChange, 
                    open, 
                    setOpen 
                })
            )}
        </div>
    );
}

// Usage
<Select value={selected} onChange={setSelected}>
    <Select.Toggle />
    <Select.Menu>
        <Select.Option value="a">Option A</Select.Option>
        <Select.Option value="b">Option B</Select.Option>
    </Select.Menu>
</Select>
```

### Container/Presentation
```javascript
// Container (Smart)
function UserListContainer() {
    const [users, setUsers] = useState([]);
    
    useEffect(() => {
        fetchUsers().then(setUsers);
    }, []);
    
    const handleDelete = (id) => {
        deleteUser(id).then(() => {
            setUsers(prev => prev.filter(u => u.id !== id));
        });
    };
    
    return <UserListPresentation users={users} onDelete={handleDelete} />;
}

// Presentation (Dumb)
function UserListPresentation({ users, onDelete }) {
    return (
        <ul>
            {users.map(user => (
                <li key={user.id}>
                    <span>{user.name}</span>
                    <button onClick={() => onDelete(user.id)}>Delete</button>
                </li>
            ))}
        </ul>
    );
}
```

---

## 2. State Management Patterns

### Local State (useState)
```javascript
// Use for: Component-only state
function Counter() {
    const [count, setCount] = useState(0);
    return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### Context with useReducer
```javascript
// Use for: Medium complexity shared state
const AppContext = createContext();

function AppProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, initialState);
    
    return (
        <AppContext.Provider value={{ state, dispatch }}>
            {children}
        </AppContext.Provider>
    );
}
```

### Redux (Complex State)
```javascript
// Use for: Large, complex state with many interactions
// See Redux Toolkit section for modern patterns
```

### Custom Hook Pattern
```javascript
// Use for: Reusable state logic
function useCounter(initialCount = 0) {
    const [count, setCount] = useState(initialCount);
    
    const increment = useCallback(() => setCount(c => c + 1), []);
    const decrement = useCallback(() => setCount(c => c - 1), []);
    const reset = useCallback(() => setCount(initialCount), [initialCount]);
    
    return { count, increment, decrement, reset };
}

// Usage
function Counter() {
    const { count, increment } = useCounter();
    return <button onClick={increment}>{count}</button>;
}
```

---

## 3. Performance Patterns

### Lazy Loading
```javascript
// Route-based
const Home = lazy(() => import('./pages/Home'));
const Admin = lazy(() => import('./pages/Admin'));

function App() {
    return (
        <Suspense fallback={<Loading />}>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/admin" element={<Admin />} />
            </Routes>
        </Suspense>
    );
}
```

### Memoization
```javascript
// Prevent re-renders
const MemoizedComponent = React.memo(Component, (prev, next) => {
    return prev.id === next.id;  // Skip if props equal
});

// Memoize callbacks
const memoCallback = useCallback(() => {
    doSomething(value);
}, [value]);

// Memoize values
const memoValue = useMemo(() => {
    return expensiveCalculation(input);
}, [input]);
```

### Pagination
```javascript
function UserList() {
    const [page, setPage] = useState(1);
    const { data: users } = useQuery({
        queryKey: ['users', page],
        queryFn: () => fetchUsers(page)
    });
    
    return (
        <>
            <div>
                {users.map(u => <UserCard key={u.id} user={u} />)}
            </div>
            <button onClick={() => setPage(p => p + 1)}>Next</button>
        </>
    );
}
```

### Virtual Scrolling
```javascript
// Use react-window for large lists
import { FixedSizeList } from 'react-window';

function LargeList({ items }) {
    return (
        <FixedSizeList
            height={600}
            itemCount={items.length}
            itemSize={80}
        >
            {({ index, style }) => (
                <div style={style}>{items[index].name}</div>
            )}
        </FixedSizeList>
    );
}
```

---

## 4. Data Fetching Patterns

### useEffect + Fetch
```javascript
function UserProfile({ userId }) {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const controller = new AbortController();
        
        fetch(`/api/users/${userId}`, { signal: controller.signal })
            .then(r => r.json())
            .then(setUser)
            .catch(e => {
                if (e.name !== 'AbortError') setError(e);
            });
        
        return () => controller.abort();
    }, [userId]);
    
    if (error) return <Error error={error} />;
    return user ? <Profile user={user} /> : <Loading />;
}
```

### React Query Pattern
```javascript
function UserList() {
    const { data: users, isLoading, error } = useQuery({
        queryKey: ['users'],
        queryFn: fetchUsers,
        staleTime: 5 * 60 * 1000
    });
    
    if (isLoading) return <Loading />;
    if (error) return <Error error={error} />;
    
    return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}
```

### Pagination Pattern
```javascript
function usePaginatedData(url) {
    const [page, setPage] = useState(1);
    
    const { data, isLoading } = useQuery({
        queryKey: [url, page],
        queryFn: () => fetch(`${url}?page=${page}`).then(r => r.json())
    });
    
    return {
        data: data?.items || [],
        page,
        total: data?.total || 0,
        setPage,
        isLoading
    };
}
```

---

## 5. Form Patterns

### Controlled Component
```javascript
function Form() {
    const [formData, setFormData] = useState({
        name: '',
        email: ''
    });
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        submitForm(formData);
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <input 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
            />
            <button type="submit">Submit</button>
        </form>
    );
}
```

### React Hook Form Pattern
```javascript
import { useForm } from 'react-hook-form';

function Form() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <input {...register('name', { required: true })} />
            {errors.name && <span>Name is required</span>}
            <button type="submit">Submit</button>
        </form>
    );
}
```

### Multi-step Form
```javascript
function MultiStepForm() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({});
    
    const handleNext = (stepData) => {
        setFormData(prev => ({ ...prev, ...stepData }));
        setStep(step + 1);
    };
    
    const handleSubmit = () => {
        submitForm(formData);
    };
    
    return (
        <>
            {step === 1 && <Step1 onNext={handleNext} />}
            {step === 2 && <Step2 onNext={handleNext} />}
            {step === 3 && <Step3 onSubmit={handleSubmit} />}
        </>
    );
}
```

---

## 6. Routing Patterns

### Protected Route
```javascript
function ProtectedRoute({ children, isAuthenticated }) {
    return isAuthenticated 
        ? children 
        : <Navigate to="/login" />;
}

// Usage
<Routes>
    <Route path="/dashboard" element={
        <ProtectedRoute isAuthenticated={isAuth}>
            <Dashboard />
        </ProtectedRoute>
    } />
</Routes>
```

### Nested Routes
```javascript
<Routes>
    <Route path="/admin" element={<AdminLayout />}>
        <Route path="users" element={<UserList />} />
        <Route path="settings" element={<Settings />} />
    </Route>
</Routes>

// AdminLayout
function AdminLayout() {
    return (
        <div>
            <Sidebar />
            <main>
                <Outlet />  {/* Renders nested route */}
            </main>
        </div>
    );
}
```

### Dynamic Routes
```javascript
<Routes>
    <Route path="/users/:id" element={<UserDetail />} />
</Routes>

function UserDetail() {
    const { id } = useParams();
    const { data: user } = useQuery({
        queryKey: ['user', id],
        queryFn: () => fetchUser(id)
    });
    
    return <div>{user?.name}</div>;
}
```

---

## 7. Testing Patterns

### Component Testing
```javascript
describe('Button', () => {
    test('renders with label', () => {
        render(<Button label="Click" />);
        expect(screen.getByText('Click')).toBeInTheDocument();
    });
    
    test('calls onClick handler', async () => {
        const handleClick = jest.fn();
        render(<Button label="Click" onClick={handleClick} />);
        
        await userEvent.click(screen.getByText('Click'));
        expect(handleClick).toHaveBeenCalled();
    });
});
```

### Hook Testing
```javascript
describe('useCounter', () => {
    test('increments count', () => {
        const { result } = renderHook(() => useCounter());
        
        act(() => {
            result.current.increment();
        });
        
        expect(result.current.count).toBe(1);
    });
});
```

### Async Testing
```javascript
test('fetches data', async () => {
    render(<UserList />);
    
    // Wait for data to load
    const user = await screen.findByText('Alice');
    expect(user).toBeInTheDocument();
});
```

---

## 8. Architecture Patterns

### Feature-based Structure
```
src/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── redux/
│   ├── todos/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── services/
│   └── shared/
│       ├── components/
│       ├── utils/
│       └── hooks/
```

### Barrel Exports
```javascript
// features/auth/index.ts
export { LoginForm } from './components/LoginForm';
export { useAuth } from './hooks/useAuth';
export { authService } from './services';

// In another file
import { LoginForm, useAuth } from '@/features/auth';
```

### Separation by Layer
```
src/
├── components/     (UI components)
├── hooks/          (Custom hooks)
├── services/       (Business logic)
├── store/          (State management)
├── types/          (TypeScript types)
├── utils/          (Utility functions)
└── constants/      (Constants)
```

---

## Pattern Selection Guide

```
Choosing State Management:
├─ Local only? → useState
├─ Share in subtree? → Context + useReducer
├─ Medium app? → Zustand / Jotai
├─ Large complex? → Redux / Redux Toolkit
└─ Server state? → React Query

Choosing Data Fetching:
├─ Simple one-time? → useEffect + fetch
├─ Complex/multiple? → React Query / SWR
└─ Real-time? → WebSocket + Context

Choosing Component Structure:
├─ Simple UI? → Functional component
├─ Complex logic? → Container + Presentation
├─ Shared behavior? → Custom hook
└─ Cross-cutting? → HOC or Context
```

---

## Exercises

### Exercise 1: Identify Pattern
```javascript
// What pattern is this?
function withTheme(Component) {
    return (props) => {
        const [theme] = useContext(ThemeContext);
        return <Component {...props} theme={theme} />;
    };
}
```

**Answer:** Higher-Order Component (HOC)

### Exercise 2: Convert to Pattern
```javascript
// Convert this to useQuery pattern
useEffect(() => {
    fetch('/api/users')
        .then(r => r.json())
        .then(setUsers);
}, []);
```

**Answer:**
```javascript
const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetch('/api/users').then(r => r.json())
});
```

### Exercise 3: Design Component
```javascript
// Design a component with:
// - Lazy loading
// - Memoization
// - Pagination
// - Error handling
```

**Solution:** Combine patterns from sections above

---

## Summary

- **Components:** HOC, Render Props, Compound, Container/Presentation
- **State:** useState, useReducer, Context, Redux, Zustand
- **Performance:** Lazy load, memoize, paginate, virtual scroll
- **Data:** useEffect+fetch, React Query, SWR, WebSocket
- **Forms:** Controlled, React Hook Form, multi-step
- **Routing:** Protected, nested, dynamic
- **Testing:** Component, hook, async, mock
- **Architecture:** Feature-based, layered, barrel exports
- **Selection:** Choose based on complexity and needs
- **Combination:** Mix patterns for real-world scenarios

**Next: Real-world debugging & case studies!**
