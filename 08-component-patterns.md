# React Component Patterns & Advanced Techniques

## Table of Contents
1. Compound Components
2. Render Props Pattern
3. Custom Hooks Pattern
4. Higher-Order Components (HOC)
5. Error Boundaries
6. Portals
7. Fragments & Keys
8. Best Practices

---

## 1. Compound Components

### Basic Compound Component
```javascript
// Tabs.js - Main component
export function Tabs({ children }) {
    const [activeTab, setActiveTab] = useState(0);
    
    return (
        <div>
            {children}  {/* Pass context to children */}
        </div>
    );
}

// TabList.js
export function TabList({ children }) {
    return <div className="tab-list">{children}</div>;
}

// Tab.js
export function Tab({ children, onClick }) {
    return <button onClick={onClick}>{children}</button>;
}

// TabPanel.js
export function TabPanel({ children, isActive }) {
    return isActive ? <div className="tab-panel">{children}</div> : null;
}

// Usage
<Tabs>
    <TabList>
        <Tab>Tab 1</Tab>
        <Tab>Tab 2</Tab>
        <Tab>Tab 3</Tab>
    </TabList>
    <TabPanel isActive={activeTab === 0}>Panel 1</TabPanel>
    <TabPanel isActive={activeTab === 1}>Panel 2</TabPanel>
    <TabPanel isActive={activeTab === 2}>Panel 3</TabPanel>
</Tabs>
```

### Tabs with Context (Better Pattern)
```javascript
const TabsContext = createContext();

export function Tabs({ children }) {
    const [activeTab, setActiveTab] = useState(0);
    
    return (
        <TabsContext.Provider value={{ activeTab, setActiveTab }}>
            {children}
        </TabsContext.Provider>
    );
}

export function TabList({ children }) {
    return <div className="tab-list">{children}</div>;
}

export function Tab({ children, index }) {
    const { activeTab, setActiveTab } = useContext(TabsContext);
    
    return (
        <button
            onClick={() => setActiveTab(index)}
            className={activeTab === index ? 'active' : ''}
        >
            {children}
        </button>
    );
}

export function TabPanel({ children, index }) {
    const { activeTab } = useContext(TabsContext);
    
    return activeTab === index ? (
        <div className="tab-panel">{children}</div>
    ) : null;
}

// Usage - Much cleaner!
<Tabs>
    <TabList>
        <Tab index={0}>Tab 1</Tab>
        <Tab index={1}>Tab 2</Tab>
        <Tab index={2}>Tab 3</Tab>
    </TabList>
    <TabPanel index={0}>Panel 1</TabPanel>
    <TabPanel index={1}>Panel 2</TabPanel>
    <TabPanel index={2}>Panel 3</TabPanel>
</Tabs>
```

---

## 2. Render Props Pattern

### Render Props Basics
```javascript
// DataFetcher.js
class DataFetcher extends React.Component {
    constructor(props) {
        super(props);
        this.state = { data: null, loading: true, error: null };
    }
    
    componentDidMount() {
        fetch(this.props.url)
            .then(r => r.json())
            .then(data => {
                this.setState({ data, loading: false });
            })
            .catch(error => {
                this.setState({ error, loading: false });
            });
    }
    
    render() {
        return this.props.render(this.state);
    }
}

// Usage
<DataFetcher url="/api/users" render={({ data, loading, error }) => (
    <>
        {loading && <p>Loading...</p>}
        {error && <p>Error</p>}
        {data && <ul>{data.map(u => <li key={u.id}>{u.name}</li>)}</ul>}
    </>
)} />

// Alternative with children as function
<DataFetcher url="/api/users">
    {({ data, loading, error }) => (
        <>
            {loading && <p>Loading...</p>}
            {error && <p>Error</p>}
            {data && <ul>{data.map(u => <li key={u.id}>{u.name}</li>)}</ul>}
        </>
    )}
</DataFetcher>
```

### Modern Hook Alternative
```javascript
// Hook instead of render props
function useDataFetch(url) {
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

// Usage - Much cleaner!
function UserList() {
    const { data, loading, error } = useDataFetch('/api/users');
    
    return (
        <>
            {loading && <p>Loading...</p>}
            {error && <p>Error</p>}
            {data && <ul>{data.map(u => <li key={u.id}>{u.name}</li>)}</ul>}
        </>
    );
}
```

---

## 3. Custom Hooks Pattern

### Creating Reusable Hooks
```javascript
// useWindowSize.js
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

// useLocalStorage.js
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

// usePrevious.js
function usePrevious(value) {
    const ref = useRef();
    
    useEffect(() => {
        ref.current = value;
    }, [value]);
    
    return ref.current;
}

// Usage
function Component() {
    const { width, height } = useWindowSize();
    const [theme, setTheme] = useLocalStorage('theme', 'light');
    const previousWidth = usePrevious(width);
    
    return <div>Width: {width}, Prev: {previousWidth}</div>;
}
```

### Hook Composition
```javascript
// useAsync.js
function useAsync(asyncFn, immediate = true) {
    const [status, setStatus] = useState('idle');
    const [value, setValue] = useState(null);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        if (!immediate) return;
        
        setStatus('pending');
        asyncFn()
            .then(r => { setValue(r); setStatus('success'); })
            .catch(e => { setError(e); setStatus('error'); });
    }, [asyncFn, immediate]);
    
    return { status, value, error };
}

// useFetch.js
function useFetch(url) {
    return useAsync(() => fetch(url).then(r => r.json()), true);
}

// useFetchOnce.js
function useFetchOnce(url) {
    const [result, setResult] = useState(null);
    
    const { status, value } = useAsync(
        () => fetch(url).then(r => r.json()),
        true
    );
    
    return { isLoading: status === 'pending', data: value, error: null };
}
```

---

## 4. Higher-Order Components (HOC)

### Basic HOC
```javascript
// withTheme.js
function withTheme(Component) {
    return function ThemedComponent(props) {
        const [theme, setTheme] = useState('light');
        
        const toggleTheme = () => {
            setTheme(t => t === 'light' ? 'dark' : 'light');
        };
        
        return (
            <Component
                theme={theme}
                toggleTheme={toggleTheme}
                {...props}
            />
        );
    };
}

// MyComponent.js
function MyComponent({ theme, toggleTheme }) {
    return (
        <div style={{ background: theme === 'light' ? '#fff' : '#333' }}>
            <p>Current theme: {theme}</p>
            <button onClick={toggleTheme}>Toggle</button>
        </div>
    );
}

// Apply HOC
export default withTheme(MyComponent);
```

### HOC with Authentication
```javascript
function withAuth(Component) {
    return function ProtectedComponent(props) {
        const { user, loading } = useAuth();
        
        if (loading) return <div>Loading...</div>;
        
        if (!user) {
            return <Navigate to="/login" />;
        }
        
        return <Component user={user} {...props} />;
    };
}

// Usage
function Dashboard({ user }) {
    return <h1>Welcome {user.name}</h1>;
}

export default withAuth(Dashboard);
```

### Combining HOCs
```javascript
// Apply multiple HOCs
const EnhancedComponent = withTheme(withAuth(withLogging(Component)));

// Or use compose
function compose(...hocs) {
    return (Component) =>
        hocs.reduceRight((Comp, hoc) => hoc(Comp), Component);
}

const enhance = compose(withTheme, withAuth, withLogging);
export default enhance(Component);
```

---

## 5. Error Boundaries

### Error Boundary Class Component
```javascript
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    
    static getDerivedStateFromError(error) {
        return { hasError: true };
    }
    
    componentDidCatch(error, errorInfo) {
        console.error('Error caught:', error, errorInfo);
        // Log to error tracking service
        // logErrorToService(error, errorInfo);
    }
    
    render() {
        if (this.state.hasError) {
            return (
                <div className="error-container">
                    <h1>Something went wrong</h1>
                    <button onClick={() => this.setState({ hasError: false })}>
                        Try again
                    </button>
                </div>
            );
        }
        
        return this.props.children;
    }
}

// Usage
<ErrorBoundary>
    <UserProfile />
</ErrorBoundary>
```

### Error Boundary with Recovery
```javascript
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, errorCount: 0 };
    }
    
    static getDerivedStateFromError(error) {
        return { hasError: true };
    }
    
    componentDidCatch(error, errorInfo) {
        this.setState(prev => ({ errorCount: prev.errorCount + 1 }));
    }
    
    handleReset = () => {
        this.setState({ hasError: false, errorCount: 0 });
    };
    
    render() {
        if (this.state.hasError) {
            if (this.state.errorCount > 3) {
                return <div>Too many errors. Please refresh page.</div>;
            }
            
            return (
                <div>
                    <h1>Error occurred</h1>
                    <button onClick={this.handleReset}>Retry</button>
                </div>
            );
        }
        
        return this.props.children;
    }
}
```

---

## 6. Portals

### Portal Basics
```javascript
import { createPortal } from 'react-dom';

function Modal({ children, onClose }) {
    return createPortal(
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                {children}
                <button onClick={onClose}>Close</button>
            </div>
        </div>,
        document.getElementById('modal-root')  // Renders outside main DOM tree
    );
}

// HTML
// <div id="root"></div>
// <div id="modal-root"></div>  <- Modal renders here

// Usage
function App() {
    const [showModal, setShowModal] = useState(false);
    
    return (
        <div>
            <button onClick={() => setShowModal(true)}>Open Modal</button>
            {showModal && (
                <Modal onClose={() => setShowModal(false)}>
                    <h2>Modal Content</h2>
                </Modal>
            )}
        </div>
    );
}
```

### Portal for Tooltips
```javascript
function Tooltip({ children, text }) {
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const triggerRef = useRef(null);
    
    useEffect(() => {
        if (triggerRef.current) {
            const rect = triggerRef.current.getBoundingClientRect();
            setPosition({
                top: rect.bottom + 10,
                left: rect.left
            });
        }
    }, []);
    
    return (
        <>
            <div ref={triggerRef}>{children}</div>
            {createPortal(
                <div
                    style={{
                        position: 'fixed',
                        top: position.top,
                        left: position.left,
                        background: 'black',
                        color: 'white',
                        padding: '8px',
                        borderRadius: '4px'
                    }}
                >
                    {text}
                </div>,
                document.body
            )}
        </>
    );
}
```

---

## 7. Fragments & Keys

### Fragments
```javascript
// ✗ WRONG - Unnecessary div wrapper
function Component() {
    return (
        <div>
            <Header />
            <Main />
            <Footer />
        </div>
    );
}

// ✓ CORRECT - Fragment
function Component() {
    return (
        <>
            <Header />
            <Main />
            <Footer />
        </>
    );
}

// Or explicit
import { Fragment } from 'react';

function Component() {
    return (
        <Fragment>
            <Header />
            <Main />
            <Footer />
        </Fragment>
    );
}
```

### Keys in Lists
```javascript
// ✗ WRONG - Using index as key
function UserList({ users }) {
    return (
        <ul>
            {users.map((user, index) => (
                <li key={index}>{user.name}</li>  // BAD!
            ))}
        </ul>
    );
}

// ✓ CORRECT - Using unique ID
function UserList({ users }) {
    return (
        <ul>
            {users.map(user => (
                <li key={user.id}>{user.name}</li>  // GOOD!
            ))}
        </ul>
    );
}

// Why keys matter:
// Without key, React matches by position
// If list changes, wrong data appears with wrong component state
// With unique key, React knows which item is which
```

---

## 8. Best Practices

### Component Design Pattern
```javascript
// 1. Use compound components for related UI parts
<Dropdown>
    <DropdownTrigger>Open</DropdownTrigger>
    <DropdownMenu>
        <DropdownItem>Item 1</DropdownItem>
    </DropdownMenu>
</Dropdown>

// 2. Prefer hooks over HOC/render props
// Hooks are cleaner and easier to compose

// 3. Error boundaries for unexpected errors
<ErrorBoundary>
    <App />
</ErrorBoundary>

// 4. Use portals for modals/tooltips
// Keeps DOM structure clean

// 5. Keys for lists
// Always use stable unique ID, not index

// 6. PropTypes or TypeScript
function Button({ onClick, children, variant = 'primary' }) {
    // Validates props
}
```

---

## Exercises

### Exercise 1: Compound Component
```javascript
// Create Card compound component
// Card > Card.Header, Card.Body, Card.Footer

function Card() {
    // Your code
}
```

**Solution:**
```javascript
export function Card({ children }) {
    return <div className="card">{children}</div>;
}

Card.Header = ({ children }) => <div className="card-header">{children}</div>;
Card.Body = ({ children }) => <div className="card-body">{children}</div>;
Card.Footer = ({ children }) => <div className="card-footer">{children}</div>;

// Usage
<Card>
    <Card.Header>Title</Card.Header>
    <Card.Body>Content</Card.Body>
    <Card.Footer>Footer</Card.Footer>
</Card>
```

### Exercise 2: Custom Hook
```javascript
// Create useToggle hook
// Returns [value, toggle]

function useToggle(initial = false) {
    // Your code
}
```

**Solution:**
```javascript
function useToggle(initial = false) {
    const [value, setValue] = useState(initial);
    const toggle = () => setValue(v => !v);
    return [value, toggle];
}

// Usage
function Component() {
    const [isOpen, toggle] = useToggle();
    return <button onClick={toggle}>{isOpen ? 'Open' : 'Closed'}</button>;
}
```

### Exercise 3: Error Boundary
```javascript
// Create error boundary
// Catch errors and show fallback UI

class ErrorBoundary extends React.Component {
    // Your code
}
```

**Solution:**
```javascript
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    
    static getDerivedStateFromError(error) {
        return { hasError: true };
    }
    
    render() {
        if (this.state.hasError) {
            return <h1>Something went wrong</h1>;
        }
        
        return this.props.children;
    }
}
```

---

## Interview Questions

### Theoretical Questions

**Q1: What is compound component?**
A: Related components that share context (Header, Body, Footer).

**Q2: What is render props?**
A: Pattern passing function as prop to render content.

**Q3: What is HOC?**
A: Function taking component and returning enhanced component.

**Q4: When to use portal?**
A: For modals, tooltips, or anything outside DOM tree.

**Q5: Why use keys in lists?**
A: React identifies which items changed/removed.

---

## Code-Based Interview Questions

**Q1: What is output?**
```javascript
function Component({ children }) {
    return children;
}
// Is children needed?
```
A: Yes, to render passed JSX

**Q2: Predict:**
```javascript
<ul>
    {items.map((item) => <li key={item.name}>{item.name}</li>)}
</ul>
// If name is not unique, issue?
```
A: Yes, can cause rendering bugs

**Q3: What is output?**
```javascript
{createPortal(<Modal />, document.body)}
// Where does Modal render?
```
A: In document.body, not in component tree

**Q4: Spot the issue:**
```javascript
function HOC(Component) {
    return <Component {...props} />;  // Wrong!
}
```
A: Should return function, not JSX

**Q5: What happens?**
```javascript
class ErrorBoundary extends Component {
    // No getDerivedStateFromError
    componentDidCatch() { }  // Only this
}
// Will catch error and re-render?
```
A: No, need getDerivedStateFromError

---

## Follow-up Questions & Confusing Concepts

**Q: When to use HOC vs hooks?**
A: Prefer hooks for new code.

**Q: Can I use portal with hooks?**
A: Yes, createPortal works with hooks.

**Q: Does error boundary catch async errors?**
A: No, only during render.

**Q: Can compound components pass data?**
A: Yes, through context provider.

---

## Summary

- **Compound Components**: Related UI parts (Header, Body, Footer)
- **Render Props**: Function as prop to render content
- **Custom Hooks**: Reusable logic
- **HOC**: Component wrapper for enhancement
- **Error Boundaries**: Catch render errors
- **Portals**: Render outside main DOM tree
- **Fragments**: Group without wrapper
- **Keys**: Identify list items uniquely
- **Best Patterns**: Compound > HOC > Render Props
- **Modern Approach**: Prefer hooks over all

**Next Step:** Master accessibility & performance!
