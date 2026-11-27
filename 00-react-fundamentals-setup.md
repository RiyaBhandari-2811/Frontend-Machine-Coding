# React Fundamentals & Setup

## Table of Contents
1. What is React?
2. JSX Syntax
3. Components (Functional vs Class)
4. Props & Prop Drilling
5. State Basics
6. Event Handling
7. Conditional Rendering
8. Lists & Keys
9. Best Practices

---

## 1. What is React?

### React Basics
```javascript
// React is a JavaScript library for building UIs with components
// Key concepts:
// 1. Component-based architecture
// 2. Declarative rendering (describe what UI should look like)
// 3. Virtual DOM (efficient rendering)
// 4. Unidirectional data flow (props down, events up)

// Without React - Imperative (how to do it)
document.getElementById('app').innerHTML = '<h1>Hello</h1>';

// With React - Declarative (what it should be)
<h1>Hello</h1>
```

### Why React?
```javascript
// 1. Reusable components
// 2. Easy to test
// 3. Large ecosystem
// 4. Developer tools
// 5. Active community
// 6. Performance optimized
// 7. Scalable

// Setup:
// npm create vite@latest my-app -- --template react
// cd my-app
// npm install
// npm run dev
```

---

## 2. JSX Syntax

### JSX Basics
```javascript
// JSX looks like HTML but is JavaScript
// Transpiles to: React.createElement()

// JSX
const element = <h1>Hello World</h1>;

// Transpiles to:
const element = React.createElement('h1', null, 'Hello World');

// JSX with expressions
const name = 'John';
const greeting = <h1>Hello, {name}!</h1>;

// JSX with attributes
const button = <button onClick={handleClick}>Click me</button>;

// JSX with children
const container = (
    <div>
        <h1>Title</h1>
        <p>Paragraph</p>
    </div>
);

// ✗ WRONG - JSX can't return multiple elements
// const elements = (
//     <h1>Title</h1>
//     <p>Paragraph</p>  // Error!
// );

// ✓ CORRECT - Wrap in Fragment or div
const elements = (
    <>
        <h1>Title</h1>
        <p>Paragraph</p>
    </>
);
```

### JSX Rules
```javascript
// 1. Single root element
const good = <div><h1>Title</h1></div>;
// const bad = <h1>Title</h1><p>Text</p>;

// 2. Close all tags
const img = <img src="photo.jpg" />;
const div = <div></div>;

// 3. Use className instead of class
const element = <div className="container">Content</div>;
// NOT: <div class="container">

// 4. Use htmlFor instead of for (with labels)
const label = <label htmlFor="name">Name:</label>;

// 5. CSS in JS (camelCase)
const styles = { backgroundColor: 'blue', fontSize: '16px' };
const styled = <div style={styles}>Styled</div>;

// 6. Comments
const commented = (
    <div>
        {/* This is a comment */}
        <p>Text</p>
    </div>
);
```

---

## 3. Components (Functional vs Class)

### Functional Components
```javascript
// Simple function returning JSX
function Welcome() {
    return <h1>Welcome to React!</h1>;
}

// Arrow function
const Welcome = () => {
    return <h1>Welcome to React!</h1>;
};

// Implicit return
const Welcome = () => <h1>Welcome to React!</h1>;

// With props
function Greeting({ name, age }) {
    return <h1>Hello {name}, age {age}</h1>;
}

// Usage
<Greeting name="John" age={30} />
```

### Class Components
```javascript
// Pre-ES6 way (less common now)
class Welcome extends React.Component {
    render() {
        return <h1>Welcome!</h1>;
    }
}

// With props
class Greeting extends React.Component {
    render() {
        const { name, age } = this.props;
        return <h1>Hello {name}, age {age}</h1>;
    }
}

// Usage
<Greeting name="John" age={30} />
```

### Comparison
```javascript
// Functional (Modern, Preferred)
// ✓ Simpler syntax
// ✓ Hooks support
// ✓ Better performance
// ✓ Easier to test

// Class (Legacy)
// ✗ More verbose
// ✗ this binding
// ✗ Lifecycle methods harder
// ✗ Larger bundle

// Best Practice: Use functional components with hooks
```

---

## 4. Props & Prop Drilling

### Props Basics
```javascript
// Props are arguments passed to components
function Welcome(props) {
    return <h1>Hello {props.name}!</h1>;
}

// Destructured props
function Welcome({ name, age }) {
    return (
        <div>
            <h1>Hello {name}!</h1>
            <p>Age: {age}</p>
        </div>
    );
}

// Usage
<Welcome name="John" age={30} />

// Default props
function Greeting({ name = 'Guest' }) {
    return <h1>Hello {name}!</h1>;
}

// Props validation (PropTypes)
// npm install prop-types
import PropTypes from 'prop-types';

function Greeting({ name, age }) {
    return <h1>Hello {name}!</h1>;
}

Greeting.propTypes = {
    name: PropTypes.string.isRequired,
    age: PropTypes.number
};

Greeting.defaultProps = {
    name: 'Guest'
};
```

### Prop Drilling Problem
```javascript
// ✗ PROP DRILLING - Passing props through many levels
function App() {
    const user = { name: 'John', role: 'admin' };
    return <Level1 user={user} />;
}

function Level1({ user }) {
    return <Level2 user={user} />;  // Pass through
}

function Level2({ user }) {
    return <Level3 user={user} />;  // Pass through
}

function Level3({ user }) {
    return <h1>{user.name} - {user.role}</h1>;
}

// ✓ SOLUTION 1: Context API
const UserContext = React.createContext();

function App() {
    const user = { name: 'John', role: 'admin' };
    return (
        <UserContext.Provider value={user}>
            <Level1 />
        </UserContext.Provider>
    );
}

function Level3() {
    const user = useContext(UserContext);
    return <h1>{user.name} - {user.role}</h1>;
}

// ✓ SOLUTION 2: Component composition
function App() {
    return (
        <Level1>
            <Level2>
                <UserInfo />
            </Level2>
        </Level1>
    );
}
```

---

## 5. State Basics

### useState Hook
```javascript
import { useState } from 'react';

// Basic state
function Counter() {
    const [count, setCount] = useState(0);
    
    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={() => setCount(count + 1)}>Increment</button>
        </div>
    );
}

// Multiple state variables
function Form() {
    const [name, setName] = useState('');
    const [age, setAge] = useState(0);
    const [email, setEmail] = useState('');
    
    return (
        <div>
            <input 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
            />
            <input 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
            />
        </div>
    );
}

// State with objects
function Profile() {
    const [user, setUser] = useState({ name: 'John', age: 30 });
    
    // ✓ CORRECT - Create new object
    const updateName = (newName) => {
        setUser({ ...user, name: newName });
    };
    
    // ✗ WRONG - Mutating state directly
    // user.name = newName;  // Don't do this!
    
    return (
        <div>
            <p>{user.name}, {user.age}</p>
            <button onClick={() => updateName('Jane')}>Update</button>
        </div>
    );
}
```

### State Updates
```javascript
// ✗ SLOW - Multiple rerenders
function Counter() {
    const [count, setCount] = useState(0);
    
    const handleClick = () => {
        setCount(count + 1);  // 1 render
        setCount(count + 1);  // 2 render (uses old count!)
        setCount(count + 1);  // 3 render (uses old count!)
    };
    
    return <button onClick={handleClick}>Increment</button>;
}

// ✓ FAST - Batch updates (React auto-batches)
function Counter() {
    const [count, setCount] = useState(0);
    
    const handleClick = async () => {
        setCount(count + 1);  // Batched
        setCount(count + 1);  // Batched
        setCount(count + 1);  // Batched
        // All 3 happen in 1 render cycle
    };
    
    return <button onClick={handleClick}>Increment</button>;
}

// ✓ CORRECT - Functional updates (when depends on previous)
function Counter() {
    const [count, setCount] = useState(0);
    
    const handleClick = () => {
        setCount(prev => prev + 1);  // Uses updated value
        setCount(prev => prev + 1);  // Uses updated value
        setCount(prev => prev + 1);  // Uses updated value
    };
    
    return <button onClick={handleClick}>Increment: {count}</button>;
}
```

---

## 6. Event Handling

### Basic Events
```javascript
// Click handler
function Button() {
    const handleClick = () => {
        console.log('Clicked!');
    };
    
    return <button onClick={handleClick}>Click me</button>;
}

// With parameters
function Button() {
    const handleClick = (message) => {
        console.log(message);
    };
    
    return <button onClick={() => handleClick('Hello')}>Click</button>;
}

// Event object
function Form() {
    const handleChange = (event) => {
        console.log(event.target.value);
    };
    
    return <input onChange={handleChange} />;
}

// Multiple handlers
function Button() {
    const handleClick = () => console.log('Clicked');
    const handleDoubleClick = () => console.log('Double-clicked');
    
    return (
        <button 
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
        >
            Click me
        </button>
    );
}
```

### Form Handling
```javascript
// Controlled input
function Form() {
    const [input, setInput] = useState('');
    
    const handleChange = (e) => {
        setInput(e.target.value);
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();  // Prevent page reload
        console.log('Submitted:', input);
        setInput('');  // Clear input
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <input 
                value={input}
                onChange={handleChange}
                placeholder="Enter text"
            />
            <button type="submit">Submit</button>
        </form>
    );
}

// Multiple inputs
function Form() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <input 
                name="name"
                value={formData.name}
                onChange={handleChange}
            />
            <input 
                name="email"
                value={formData.email}
                onChange={handleChange}
            />
            <textarea 
                name="message"
                value={formData.message}
                onChange={handleChange}
            />
            <button type="submit">Submit</button>
        </form>
    );
}
```

---

## 7. Conditional Rendering

### If/Else
```javascript
// Using if/else outside JSX
function Greeting({ isLoggedIn }) {
    if (isLoggedIn) {
        return <h1>Welcome back!</h1>;
    } else {
        return <h1>Please log in</h1>;
    }
}

// Ternary operator
function Greeting({ isLoggedIn }) {
    return isLoggedIn ? <h1>Welcome!</h1> : <h1>Log in</h1>;
}

// Logical AND (&&)
function Messages({ unreadCount }) {
    return (
        <div>
            {unreadCount > 0 && <p>You have {unreadCount} messages</p>}
        </div>
    );
}

// Switch statement
function Status({ status }) {
    switch(status) {
        case 'loading':
            return <p>Loading...</p>;
        case 'error':
            return <p>Error occurred</p>;
        case 'success':
            return <p>Success!</p>;
        default:
            return null;
    }
}
```

### Conditional Components
```javascript
// Early return
function UserProfile({ user }) {
    if (!user) {
        return <p>User not found</p>;
    }
    
    return (
        <div>
            <h1>{user.name}</h1>
            <p>{user.email}</p>
        </div>
    );
}

// Conditional className
function Button({ isPrimary }) {
    const className = isPrimary ? 'btn-primary' : 'btn-secondary';
    return <button className={className}>Click</button>;
}

// Conditional styles
function Box({ isActive }) {
    const style = {
        backgroundColor: isActive ? 'green' : 'gray',
        padding: '10px'
    };
    return <div style={style}>Box</div>;
}
```

---

## 8. Lists & Keys

### Rendering Lists
```javascript
// Map over array
function UserList({ users }) {
    return (
        <ul>
            {users.map((user) => (
                <li key={user.id}>{user.name}</li>
            ))}
        </ul>
    );
}

// Usage
const users = [
    { id: 1, name: 'John' },
    { id: 2, name: 'Jane' },
    { id: 3, name: 'Bob' }
];

<UserList users={users} />

// With components
function UserList({ users }) {
    return (
        <div>
            {users.map((user) => (
                <UserCard key={user.id} user={user} />
            ))}
        </div>
    );
}

function UserCard({ user }) {
    return <div className="card">{user.name}</div>;
}
```

### Keys
```javascript
// ✗ WRONG - Using index as key (causes bugs)
function List({ items }) {
    return (
        <ul>
            {items.map((item, index) => (
                <li key={index}>{item.name}</li>  // BAD!
            ))}
        </ul>
    );
}

// ✓ CORRECT - Use unique ID
function List({ items }) {
    return (
        <ul>
            {items.map((item) => (
                <li key={item.id}>{item.name}</li>  // GOOD!
            ))}
        </ul>
    );
}

// Why keys matter?
// Keys help React identify which items changed/added/removed
// Without proper keys, React re-renders all items
// Can cause:
// - Lost input focus
// - Animation resets
// - State bugs
// - Performance issues
```

---

## 9. Best Practices

### Component Structure
```javascript
// ✓ GOOD - Clear component structure
function UserProfile({ userId }) {
    const [user, setUser] = useState(null);
    
    useEffect(() => {
        fetchUser(userId).then(setUser);
    }, [userId]);
    
    if (!user) return <p>Loading...</p>;
    
    return (
        <div>
            <h1>{user.name}</h1>
            <p>{user.email}</p>
        </div>
    );
}

// Component naming
// ✓ Use PascalCase (UserProfile, not userProfile)
// ✓ Descriptive names
// ✗ Avoid generic names (Component, Container)

// Props naming
// ✓ Clear prop names
// ✗ Vague props (data, info, value)

// Keep components small
// Split large components into smaller ones
// Each component should do one thing
```

### Performance Tips
```javascript
// 1. Use React.memo for expensive components
const UserCard = React.memo(({ user }) => {
    return <div>{user.name}</div>;
});

// 2. Use useCallback for functions
const handleClick = useCallback(() => {
    console.log('clicked');
}, []);

// 3. Use useMemo for expensive calculations
const expensiveValue = useMemo(() => {
    return computeExpensive(data);
}, [data]);

// 4. Code splitting with React.lazy
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));

<Suspense fallback={<Loading />}>
    <HeavyComponent />
</Suspense>
```

---

## Exercises

### Exercise 1: Counter Component
```javascript
// Create a counter with increment/decrement buttons
// Display current count
// Reset button

function Counter() {
    // Your code
}
```

**Solution:**
```javascript
function Counter() {
    const [count, setCount] = useState(0);
    
    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={() => setCount(count + 1)}>+</button>
            <button onClick={() => setCount(count - 1)}>-</button>
            <button onClick={() => setCount(0)}>Reset</button>
        </div>
    );
}
```

### Exercise 2: Todo List
```javascript
// Create todo list with add/remove
// Display list of todos
// Mark as complete

function TodoList() {
    // Your code
}
```

**Solution:**
```javascript
function TodoList() {
    const [todos, setTodos] = useState([]);
    const [input, setInput] = useState('');
    
    const addTodo = () => {
        setTodos([...todos, { id: Date.now(), text: input, done: false }]);
        setInput('');
    };
    
    const toggleTodo = (id) => {
        setTodos(todos.map(t => 
            t.id === id ? { ...t, done: !t.done } : t
        ));
    };
    
    return (
        <div>
            <input value={input} onChange={e => setInput(e.target.value)} />
            <button onClick={addTodo}>Add</button>
            <ul>
                {todos.map(todo => (
                    <li key={todo.id} onClick={() => toggleTodo(todo.id)}>
                        {todo.text} {todo.done && '✓'}
                    </li>
                ))}
            </ul>
        </div>
    );
}
```

### Exercise 3: Form Validation
```javascript
// Create form with name, email, password
// Validate inputs
// Show error messages

function Form() {
    // Your code
}
```

**Solution:**
```javascript
function Form() {
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [errors, setErrors] = useState({});
    
    const validate = () => {
        const newErrors = {};
        if (!form.name) newErrors.name = 'Name required';
        if (!form.email.includes('@')) newErrors.email = 'Invalid email';
        if (form.password.length < 8) newErrors.password = 'Min 8 chars';
        return newErrors;
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = validate();
        if (Object.keys(newErrors).length === 0) {
            console.log('Valid form', form);
        }
        setErrors(newErrors);
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <input 
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
            />
            {errors.name && <p>{errors.name}</p>}
            <button type="submit">Submit</button>
        </form>
    );
}
```

---

## Interview Questions

### Theoretical Questions

**Q1: What is React?**
A: JavaScript library for building UIs with reusable components and efficient rendering.

**Q2: Functional vs Class components?**
A: Functional are simpler, support hooks. Classes are older, use lifecycle methods.

**Q3: What are props?**
A: Data passed to components. Read-only, flow top-down.

**Q4: What is state?**
A: Local data that component manages. Changes cause re-render.

**Q5: When to use state vs props?**
A: Props for data from parent. State for internal data.

---

## Code-Based Interview Questions

**Q1: What is output?**
```javascript
function App() {
    const [count, setCount] = useState(0);
    return <div>{count}</div>;
}
// Initial render shows?
```
A: 0

**Q2: Predict:**
```javascript
function Counter() {
    const [count, setCount] = useState(0);
    setCount(1);
    setCount(2);
    return <p>{count}</p>;
}
// Renders?
```
A: Infinite loop (setCount in render)

**Q3: What is output?**
```javascript
{[1, 2, 3].map(item => <div key={item}>{item}</div>)}
// ?
```
A: Renders 3 divs with 1, 2, 3

**Q4: Spot the issue:**
```javascript
function List({ items }) {
    return items.map(item => <li key={items.indexOf(item)}>{item}</li>);
}
```
A: Using indexOf as key causes bugs

**Q5: What happens?**
```javascript
<input value={input} />
// Try to type?
```
A: Nothing - no onChange handler (read-only)

---

## Follow-up Questions & Confusing Concepts

**Q: Does React require Babel?**
A: No, but JSX does (Vite/Create-react-app handles it).

**Q: Can I use HTML in React?**
A: No, JSX only. Use className not class.

**Q: Why not mutate state directly?**
A: React won't detect changes, component won't re-render.

**Q: Can I use setState inside render?**
A: No, causes infinite loop.

---

## Summary

- **React**: Component-based UI library
- **JSX**: HTML-like syntax in JavaScript
- **Components**: Reusable UI pieces (functional preferred)
- **Props**: Read-only data from parent
- **State**: Component's internal data
- **Events**: onClick, onChange, onSubmit, etc.
- **Conditional Rendering**: if/ternary/&&
- **Lists**: Map with proper keys
- **Best Practice**: Keep components small, props clear
- **Performance**: React.memo, useCallback, useMemo

**Next Step:** Master hooks and side effects!
