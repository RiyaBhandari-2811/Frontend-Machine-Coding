# React Interview Guide - Complete Q&A Reference

## Table of Contents
1. Fundamental Questions
2. Advanced Concepts
3. Code Examples & Predictions
4. System Design Questions
5. Real-World Scenarios
6. Tricky Questions
7. Following Up on Answers
8. Question Pattern Recognition

---

## 1. Fundamental Questions

### Q1: What is React and why use it?
**Answer:**
React is a JavaScript library for building UIs with components.

**Why:**
- Component-based: Reusable, maintainable
- Virtual DOM: Efficient updates
- Unidirectional data flow: Predictable
- Large ecosystem: Tools, libraries available
- Developer experience: Hot reload, DevTools

**Code Example:**
```javascript
// Component-based
function App() {
    return (
        <div>
            <Header />
            <Content />
            <Footer />
        </div>
    );
}

// Reusable
<Button label="Click me" />
<Button label="Submit" variant="primary" />
```

---

### Q2: What's difference between state and props?
**Answer:**
- **Props:** Immutable, passed from parent, like function parameters
- **State:** Mutable within component, managed by component itself

**Table:**
| Aspect | Props | State |
|--------|-------|-------|
| Mutable | No | Yes |
| Source | Parent | Component |
| Update | Via parent | Via setState |
| Trigger render | Yes | Yes |

**Example:**
```javascript
// Parent passes props
<Button label="Click" onClick={handleClick} />

// Component manages state
function Counter() {
    const [count, setCount] = useState(0);
    
    return (
        <div>
            <p>Count: {count}</p>  {/* State */}
            <button onClick={() => setCount(count + 1)}>
                {/* Props from parent */}
                Increment
            </button>
        </div>
    );
}
```

---

### Q3: Explain React Hooks
**Answer:**
Hooks let you use state and effects in functional components.

**Common Hooks:**
1. **useState:** Manage component state
2. **useEffect:** Handle side effects
3. **useContext:** Access context value
4. **useReducer:** Complex state logic
5. **useCallback:** Memoize callbacks
6. **useMemo:** Memoize values
7. **useRef:** Store mutable value
8. **Custom:** Create reusable logic

**Rules:**
1. Only call at top level
2. Only from function components or custom hooks
3. Use ESLint plugin to enforce

**Example:**
```javascript
function Counter() {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
        document.title = `Count: ${count}`;
        
        return () => {
            document.title = 'App';
        };
    }, [count]);
    
    return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

---

### Q4: What's Virtual DOM?
**Answer:**
In-memory representation of UI that React uses to optimize rendering.

**How it works:**
1. Component renders → React creates Virtual DOM
2. Update occurs → React creates new Virtual DOM
3. React compares (diffs) old and new Virtual DOM
4. Only changed elements update in real DOM
5. This minimizes expensive DOM operations

**Benefits:**
- Batches updates efficiently
- Prevents unnecessary DOM operations
- Enables time-traveling debugger
- Better performance

**Example:**
```javascript
// Without Virtual DOM (jQuery)
document.getElementById('list').innerHTML += '<li>New Item</li>';  // Rewrites entire list

// With Virtual DOM (React)
<ul>
    {items.map(item => <li key={item.id}>{item.name}</li>)}
</ul>
// Only new <li> is added to real DOM
```

---

## 2. Advanced Concepts

### Q5: Explain closures in React
**Answer:**
Functions retain access to outer scope even after parent function returns.

**Common Issue:**
```javascript
// ✗ WRONG: Stale closure
function Counter() {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
        const timer = setInterval(() => {
            console.log(count);  // Always logs 0 (stale)
        }, 1000);
        
        return () => clearInterval(timer);
    }, []);  // Missing dependency!
}

// ✓ CORRECT: Include in dependencies
useEffect(() => {
    const timer = setInterval(() => {
        console.log(count);  // Logs current count
    }, 1000);
    
    return () => clearInterval(timer);
}, [count]);  // Include dependency
```

---

### Q6: What is prop drilling and solutions?
**Answer:**
Passing props through intermediate components that don't need them.

**Problem:**
```
Grandparent (has data)
    ↓ passes prop
Parent (doesn't use)
    ↓ passes prop
Child (uses)
```

**Solutions:**
1. **Context API:** Skip intermediate components
2. **Redux/State Management:** Global access
3. **Component Composition:** Render children directly

**Example:**
```javascript
// ✗ WRONG: Prop drilling
function Grandparent({ user }) {
    return <Parent user={user} />;
}

function Parent({ user }) {
    return <Child user={user} />;  // Parent doesn't need user
}

function Child({ user }) {
    return <div>{user.name}</div>;
}

// ✓ CORRECT: Use Context
const UserContext = createContext();

function Grandparent({ user }) {
    return (
        <UserContext.Provider value={user}>
            <Parent />
        </UserContext.Provider>
    );
}

function Child() {
    const user = useContext(UserContext);
    return <div>{user.name}</div>;
}
```

---

## 3. Code Examples & Predictions

### Q7: Predict output
```javascript
function Component() {
    const [count, setCount] = useState(0);
    
    useEffect(() => {
        setCount(count + 1);
    }, [count]);
    
    return <div>{count}</div>;
}
```

**Output:**
```
0, 1, 2, 3, ... (infinite loop)
```

**Why:**
- Render: count = 0, display 0
- Effect runs: setCount(1)
- Render: count = 1, display 1
- Effect runs: setCount(2)
- ... repeats indefinitely

---

### Q8: What will render?
```javascript
function Parent() {
    const [text, setText] = useState('hello');
    
    return (
        <div>
            <input
                onChange={(e) => setText(e.target.value)}
                value={text}
            />
            <Child text={text} />
        </div>
    );
}

const Child = React.memo(({ text }) => {
    console.log('Child rendered');
    return <div>{text}</div>;
});
```

**Console output:**
```
Child rendered  (initial)
// After typing in input, Child renders ONLY if text changes
// Because React.memo prevents re-render if props unchanged
```

---

### Q9: Spot the bugs
```javascript
function handleUpdate() {
    const newState = state;
    newState.name = 'Alice';
    setState(newState);  // Bug?
}

// Also...
function Component({ config }) {
    useEffect(() => {
        console.log(config);
    }, [config]);  // Bug?
}
```

**Bugs:**
1. **First:** Direct state mutation. Create new object: `setState({ ...state, name: 'Alice' })`
2. **Second:** Object identity changes on each render. Add `useMemo` or `useCallback`

---

## 4. System Design Questions

### Q10: Design a Todo App
**Requirements:**
- Add, delete, complete todos
- Filter by status
- Persist to localStorage
- Responsive UI

**Solution Architecture:**
```
Components:
- TodoApp (container)
- TodoList (displays todos)
- TodoItem (single todo)
- TodoForm (add new)
- Filter (status filter)

State Management:
- todos: Array<Todo>
- filter: 'all' | 'active' | 'completed'

Data Persistence:
- Save to localStorage on change
- Load from localStorage on mount

Styling:
- CSS Grid for responsive
- Mobile-first design
```

**Code Sketch:**
```javascript
function TodoApp() {
    const [todos, setTodos] = useState([]);
    const [filter, setFilter] = useState('all');
    
    // Load from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('todos');
        if (saved) setTodos(JSON.parse(saved));
    }, []);
    
    // Save to localStorage
    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos));
    }, [todos]);
    
    // ... rest of component
}
```

---

### Q11: Design Real-time Chat App
**Key Challenges:**
1. Real-time messaging (WebSocket)
2. User presence
3. Message history
4. Notifications
5. Typing indicators

**Architecture:**
```
Frontend:
- WebSocket connection
- Message state management
- UI components

Backend:
- WebSocket server
- Message storage
- User management
- Notification service

Real-time Features:
- Event-driven (message received, user typing, online status)
- Optimistic updates (show message before server ack)
- Reconnection logic
```

---

## 5. Real-World Scenarios

### Q12: Handle API error
```javascript
function UserProfile({ userId }) {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        fetch(`/api/users/${userId}`)
            .then(r => r.json())
            .then(setUser)
            .catch(err => {
                // How to handle?
            });
    }, [userId]);
}
```

**Better Handling:**
```javascript
useEffect(() => {
    // Reset state before fetch
    setUser(null);
    setError(null);
    
    const controller = new AbortController();
    
    fetch(`/api/users/${userId}`, { signal: controller.signal })
        .then(r => {
            if (!r.ok) {
                throw new Error(r.statusText);
            }
            return r.json();
        })
        .then(setUser)
        .catch(err => {
            if (err.name !== 'AbortError') {
                setError(err.message);
            }
        });
    
    return () => controller.abort();
}, [userId]);

return (
    <>
        {error && <div className="error">{error}</div>}
        {user && <div>{user.name}</div>}
        {!user && !error && <div>Loading...</div>}
    </>
);
```

---

### Q13: Optimize slow form
```javascript
function Form() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: ''
    });
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));  // Causes re-render
    };
    
    return (
        <form>
            <input name="name" onChange={handleChange} />
            {/* ExpensiveComponent re-renders on every keystroke */}
            <ExpensiveComponent data={data} />
        </form>
    );
}
```

**Optimization:**
```javascript
const FormBody = React.memo(function FormBody({ data, handleChange }) {
    return (
        <>
            <input name="name" onChange={handleChange} />
        </>
    );
});

const MemoizedExpensive = React.memo(ExpensiveComponent);

function Form() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: ''
    });
    
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }, []);
    
    return (
        <form>
            <FormBody data={formData} handleChange={handleChange} />
            <MemoizedExpensive data={data} />
        </form>
    );
}
```

---

## 6. Tricky Questions

### Q14: When does useEffect run?
```javascript
useEffect(() => {
    console.log('Effect ran');
}, []);  // vs [dep] vs no array?
```

**Answer:**
- `[]`: After mount only
- `[dep]`: After mount and when `dep` changes
- No array: After every render

---

### Q15: What's the diff?
```javascript
// Difference between:
function useAsync1(fn) {
    useEffect(() => {
        fn();
    }, [fn]);  // vs [fn.toString()]?
}
```

**Answer:**
- `[fn]`: Function object identity changes every render
- `[fn.toString()]`: String comparison (hacky, don't do it)
- **Correct:** Wrap `fn` in `useCallback`

---

## 7. Following Up on Answers

### Q16: Why is this code anti-pattern?
```javascript
{items.map((item, i) => <Item key={i} {...item} />)}
```

**Follow-ups:**
1. What happens if items reorder?
2. How does React identify components?
3. What's the solution?
4. Performance impact?

**Answers:**
1. Component state gets messed up
2. React uses keys to identify instances
3. Use unique ID: `key={item.id}`
4. Can cause bugs and lost state

---

## 8. Question Pattern Recognition

### Patterns to Recognize
1. **State/Props question:** Explain immutability, one-way flow
2. **Performance question:** Memoization, code splitting, profiling
3. **Error handling:** Try-catch, error boundaries, validation
4. **Testing question:** Mocking, assertions, edge cases
5. **Architecture:** Layers, separation of concerns, scalability

---

## Exercises

### Exercise 1: Mock Interview
**Question:** Describe a complex component you built.

**Answer Structure:**
1. **Problem:** What problem did you solve?
2. **Approach:** How did you structure it?
3. **Challenges:** What was difficult?
4. **Solution:** How did you overcome?
5. **Results:** What was the outcome?

---

## Interview Checklist

**Before Interview:**
- [ ] Review React fundamentals
- [ ] Practice system design
- [ ] Prepare project examples
- [ ] Know your code
- [ ] Think about performance
- [ ] Review algorithms

**During Interview:**
- [ ] Think out loud
- [ ] Ask clarifying questions
- [ ] Admit when you don't know
- [ ] Explain your reasoning
- [ ] Consider edge cases
- [ ] Write clean code

**After Interview:**
- [ ] Send thank you note
- [ ] Review what went well
- [ ] Identify improvements
- [ ] Keep learning

---

## Summary

- **Fundamentals:** Know React basics deeply
- **Advanced:** Understand hooks, closures, optimization
- **Code Prediction:** Practice reading and predicting output
- **System Design:** Think about architecture and scalability
- **Real-World:** Know how to handle errors and optimization
- **Tricky Questions:** Be aware of common gotchas
- **Communication:** Explain clearly, ask questions
- **Practice:** Mock interviews, LeetCode, side projects
- **Confidence:** Know your material, stay calm
- **Growth:** Keep learning after getting job

**Next: Complete reference guide!**
