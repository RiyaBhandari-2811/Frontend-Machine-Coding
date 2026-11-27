# React Rendering & Performance Optimization

## Table of Contents
1. How React Renders
2. React.memo for Optimization
3. Code Splitting with React.lazy
4. useDeferredValue & useTransition
5. Virtual DOM & Reconciliation
6. Profiling Performance
7. Common Performance Pitfalls
8. Best Practices
9. Summary

---

## 1. How React Renders

### Rendering Cycle
```javascript
// React rendering process:
// 1. Component function called
// 2. Returns JSX (which becomes React elements)
// 3. React creates virtual DOM
// 4. Compares with previous virtual DOM (reconciliation)
// 5. Updates only changed parts in real DOM
// 6. Browser paints changes

function Component() {
    // 1. Function called
    const [count, setCount] = useState(0);
    
    // 2. Returns JSX
    return (
        <div>
            <p>{count}</p>
            <button onClick={() => setCount(count + 1)}>Increment</button>
        </div>
    );
}

// What causes re-render:
// 1. State changed (setState)
// 2. Props changed
// 3. Parent component re-rendered
// 4. Context changed
```

### Component Re-renders
```javascript
// Parent re-render causes all children to re-render
function Parent() {
    const [parentCount, setParentCount] = useState(0);
    
    return (
        <div>
            <p>{parentCount}</p>
            <button onClick={() => setParentCount(c => c + 1)}>Parent</button>
            <Child />  {/* Re-renders even though props didn't change! */}
        </div>
    );
}

function Child() {
    console.log('Child rendered');
    return <p>Child</p>;
}

// Output:
// Parent re-renders = 1 console log
// Parent re-renders = 2 console log
// Parent re-renders = 3 console log
// (Child renders even with no prop changes!)
```

---

## 2. React.memo for Optimization

### Memoization Basics
```javascript
// Without memo - re-renders on every parent re-render
function Child({ name }) {
    console.log('Child rendered');
    return <h1>Hello {name}</h1>;
}

function Parent() {
    const [count, setCount] = useState(0);
    
    return (
        <div>
            <p>{count}</p>
            <button onClick={() => setCount(c => c + 1)}>Increment</button>
            <Child name="John" />  {/* name never changes but Child re-renders! */}
        </div>
    );
}

// With memo - only re-renders if props change
const Child = React.memo(({ name }) => {
    console.log('Child rendered');
    return <h1>Hello {name}</h1>;
});

// Now Child only renders when name prop changes
```

### When to Use memo
```javascript
// ✓ USE MEMO WHEN:
// 1. Component is expensive to render
// 2. Gets same props frequently
// 3. Parent re-renders often

function ExpensiveComponent({ data }) {
    // Lots of calculations
    const processed = expensiveCalculation(data);
    return <div>{processed}</div>;
}

export default React.memo(ExpensiveComponent);

// ✗ DON'T USE MEMO when:
// 1. Component is already fast
// 2. Receives different props often
// 3. Props comparison is expensive

// ✓ CUSTOM COMPARISON
const MyComponent = React.memo(
    ({ name, age }) => <div>{name} - {age}</div>,
    (prevProps, nextProps) => {
        // Return true if props are equal (don't re-render)
        // Return false if props changed (re-render)
        return prevProps.name === nextProps.name;
    }
);
```

---

## 3. Code Splitting with React.lazy

### Lazy Loading
```javascript
import React, { Suspense } from 'react';

// Regular import - loaded at startup
// import HeavyComponent from './HeavyComponent';

// Lazy import - loaded on demand
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));

function App() {
    return (
        <div>
            <Suspense fallback={<div>Loading...</div>}>
                <HeavyComponent />
            </Suspense>
        </div>
    );
}

// Benefits:
// 1. Smaller initial bundle
// 2. Faster page load
// 3. Component loaded when needed
```

### Route-based Code Splitting
```javascript
import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Lazy load route components
const Home = React.lazy(() => import('./pages/Home'));
const About = React.lazy(() => import('./pages/About'));
const Contact = React.lazy(() => import('./pages/Contact'));

function App() {
    return (
        <BrowserRouter>
            <Suspense fallback={<Loading />}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}

function Loading() {
    return <div className="loading">Loading...</div>;
}
```

---

## 4. useDeferredValue & useTransition

### useDeferredValue
```javascript
import { useState, useDeferredValue } from 'react';

function SearchUsers() {
    const [input, setInput] = useState('');
    const deferredValue = useDeferredValue(input);
    
    return (
        <div>
            <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Search..."
            />
            {/* Shows old value while searching, then updates */}
            <SearchResults query={deferredValue} />
        </div>
    );
}

function SearchResults({ query }) {
    // If query is deferred, this uses old value while searching
    return <ul>{renderResults(query)}</ul>;
}

// Benefits:
// 1. Input feels responsive
// 2. Results update when ready
// 3. No jank or janky UI
```

### useTransition
```javascript
import { useState, useTransition } from 'react';

function TabComponent() {
    const [tab, setTab] = useState('about');
    const [isPending, startTransition] = useTransition();
    
    const selectTab = (nextTab) => {
        startTransition(() => {
            setTab(nextTab);
        });
    };
    
    return (
        <div>
            <button 
                onClick={() => selectTab('about')}
                disabled={isPending}
            >
                About {isPending && '...'}
            </button>
            <button 
                onClick={() => selectTab('posts')}
                disabled={isPending}
            >
                Posts {isPending && '...'}
            </button>
            
            {isPending ? (
                <Skeleton />
            ) : (
                <TabContent tab={tab} />
            )}
        </div>
    );
}

// Benefits:
// 1. Show loading state
// 2. Keep old UI while rendering new
// 3. Cancel slow updates if needed
```

---

## 5. Virtual DOM & Reconciliation

### How Reconciliation Works
```javascript
// Before render:
<div>
    <p>Count: 0</p>
    <button>Click me</button>
</div>

// After setState({ count: 1 }):
<div>
    <p>Count: 1</p>
    <button>Click me</button>
</div>

// React compares:
// 1. Same div? Yes, keep it
// 2. Same p? Yes, but content changed, update text
// 3. Same button? Yes, keep it

// Result: Only the text "1" is updated in DOM
// (Most efficient approach)

// Without Virtual DOM (jQuery style):
// Would recreate entire structure every time
```

### Key for List Reconciliation
```javascript
// ✗ WITHOUT KEYS - Breaks when list changes
function TodoList({ todos }) {
    return (
        <ul>
            {todos.map((todo, index) => (
                <li key={index}>{todo.text}</li>  // BAD!
            ))}
        </ul>
    );
}

// If todos = ['A', 'B', 'C']
// Then delete B to get ['A', 'C']
// React thinks: 'C' is now at index 1 where 'B' was
// But it's actually the same element moved!

// ✓ WITH PROPER KEYS - Works correctly
function TodoList({ todos }) {
    return (
        <ul>
            {todos.map(todo => (
                <li key={todo.id}>{todo.text}</li>  // GOOD!
            ))}
        </ul>
    );
}

// Now React knows 'C' is the same item (key='3')
// Just moved position
```

---

## 6. Profiling Performance

### React DevTools Profiler
```javascript
// In browser:
// 1. Install React DevTools extension
// 2. Go to Components tab
// 3. Find Profiler tab
// 4. Click record (circle)
// 5. Interact with app
// 6. Stop recording
// 7. Analyze render times

// What you see:
// - Which components rendered
// - How long each took
// - Why they rendered
// - Props that caused render

// Performance tab:
// - Frame rate
// - Memory usage
// - Long tasks
```

### Measuring Manually
```javascript
import { Profiler } from 'react';

function onRenderCallback(id, phase, actualDuration) {
    console.log(`${id} (${phase}) took ${actualDuration}ms`);
}

function App() {
    return (
        <Profiler id="App" onRender={onRenderCallback}>
            <Header />
            <Main />
        </Profiler>
    );
}

// Output:
// App (mount) took 15.3ms
// App (update) took 8.1ms
```

---

## 7. Common Performance Pitfalls

### Inline Object Props
```javascript
// ✗ SLOW - New object every render
function Parent() {
    return <Child style={{ color: 'red' }} />;
}

// Even though Child is memoized, new style object = re-render
const Child = React.memo(({ style }) => <div style={style}>Text</div>);

// ✓ FAST - Constant object
const STYLE = { color: 'red' };

function Parent() {
    return <Child style={STYLE} />;
}
```

### Inline Function Props
```javascript
// ✗ SLOW - New function every render
function Parent() {
    return <Child onClick={() => console.log('clicked')} />;
}

// ✓ FAST - Constant function
const handleClick = () => console.log('clicked');

function Parent() {
    return <Child onClick={handleClick} />;
}

// Or use useCallback
function Parent() {
    const handleClick = useCallback(() => {
        console.log('clicked');
    }, []);
    
    return <Child onClick={handleClick} />;
}
```

### Conditional Rendering Mistakes
```javascript
// ✗ SLOW - Unmounts/remounts component
function Component({ visible }) {
    return visible ? <ExpensiveComponent /> : null;
}

// ✓ FAST - Hides with CSS
function Component({ visible }) {
    return (
        <div style={{ display: visible ? 'block' : 'none' }}>
            <ExpensiveComponent />
        </div>
    );
}
```

---

## 8. Best Practices

### Performance Checklist
```
✓ Use React.memo for expensive components
✓ Use useCallback for functions in props
✓ Use useMemo for expensive calculations
✓ Use React.lazy for route components
✓ Proper keys in lists (use ID, not index)
✓ Avoid inline objects/functions
✓ Monitor with React DevTools Profiler
✓ Code split at route level
✓ Use useTransition for slow updates
✓ Consider useDeferredValue for search/filter
```

### Component Structure for Performance
```javascript
// Split components for independent updates
// ✗ MONOLITHIC - Whole component re-renders
function User() {
    const [name, setName] = useState('John');
    const [settings, setSettings] = useState({});
    
    return (
        <div>
            <NameDisplay name={name} />
            <SettingsPanel settings={settings} />
        </div>
    );
}

// ✓ SPLIT - Each can update independently
function User() {
    return (
        <div>
            <NameSection />
            <SettingsSection />
        </div>
    );
}

function NameSection() {
    const [name, setName] = useState('John');
    return <NameDisplay name={name} />;
}

function SettingsSection() {
    const [settings, setSettings] = useState({});
    return <SettingsPanel settings={settings} />;
}
```

---

## Exercises

### Exercise 1: Memoize Component
```javascript
// Create expensive component and memoize it
function ExpensiveList({ items }) {
    // Expensive calculation
    return <ul>{items.map(i => <li key={i}>{i}</li>)}</ul>;
}
```

**Solution:**
```javascript
const ExpensiveList = React.memo(({ items }) => {
    return <ul>{items.map(i => <li key={i}>{i}</li>)}</ul>;
});
```

### Exercise 2: Code Splitting
```javascript
// Create lazy-loaded modal component
// Show loading while loading

function App() {
    // Your code
}
```

**Solution:**
```javascript
const Modal = React.lazy(() => import('./Modal'));

function App() {
    const [showModal, setShowModal] = useState(false);
    
    return (
        <div>
            <button onClick={() => setShowModal(true)}>Open Modal</button>
            {showModal && (
                <Suspense fallback={<div>Loading modal...</div>}>
                    <Modal onClose={() => setShowModal(false)} />
                </Suspense>
            )}
        </div>
    );
}
```

### Exercise 3: useCallback
```javascript
// Create parent with memoized child
// Pass callback that includes dependency

function Parent({ userId }) {
    // Your code
}
```

**Solution:**
```javascript
function Parent({ userId }) {
    const handleFetch = useCallback(() => {
        fetch(`/api/user/${userId}`);
    }, [userId]);
    
    return <Child onFetch={handleFetch} />;
}

const Child = React.memo(({ onFetch }) => (
    <button onClick={onFetch}>Fetch</button>
));
```

---

## Interview Questions

### Theoretical Questions

**Q1: When does React re-render?**
A: State changes, props change, parent re-renders, context changes.

**Q2: What is Virtual DOM?**
A: JavaScript representation of DOM. React compares old/new virtual DOMs.

**Q3: What is reconciliation?**
A: Process of comparing virtual DOMs and updating real DOM efficiently.

**Q4: When to use React.memo?**
A: When component is expensive and receives same props frequently.

**Q5: What is code splitting?**
A: Breaking code into chunks and loading on-demand instead of upfront.

---

## Code-Based Interview Questions

**Q1: What is output?**
```javascript
function Parent() {
    const [count, setCount] = useState(0);
    return (
        <>
            <Child />
            <button onClick={() => setCount(c => c + 1)}>{count}</button>
        </>
    );
}

const Child = React.memo(() => <p>Child</p>);
// When button clicked, Child re-renders?
```
A: No (memo prevents it, props unchanged)

**Q2: Predict:**
```javascript
<Child style={{ color: 'red' }} />
const Child = React.memo(({ style }) => <div style={style} />);
// Re-renders each parent render?
```
A: Yes (new object each time)

**Q3: What is output?**
```javascript
const MyComponent = React.lazy(() => import('./Comp'));
<Suspense fallback={<Loading />}>
    <MyComponent />
</Suspense>
// Shows Loading initially?
```
A: Yes (until component loads)

**Q4: Spot the issue:**
```javascript
function SearchResults({ query }) {
    const deferredQuery = useDeferredValue(query);
    // Should this re-render immediately?
}
```
A: Shows old query while new one processes

**Q5: What happens?**
```javascript
const handler = () => console.log('click');
<Child onClick={handler} />
// Should use useCallback?
```
A: Yes if Child is memoized (new function each render)

---

## Follow-up Questions & Confusing Concepts

**Q: Does React.memo help with state updates inside component?**
A: No, only prevents re-render from parent.

**Q: Can I use Suspense everywhere?**
A: Only for lazy components and async data fetching (future).

**Q: What if memo causes bugs?**
A: Use custom comparison or remove memo.

**Q: How much performance improvement?**
A: Varies, measure with Profiler first.

---

## Summary

- **Rendering**: Component → Virtual DOM → Real DOM
- **Reconciliation**: Smart comparison to update only changed parts
- **React.memo**: Prevent unnecessary child re-renders
- **React.lazy**: Code splitting for faster initial load
- **useTransition**: Handle slow state updates gracefully
- **useDeferredValue**: Keep UI responsive during updates
- **Keys**: Essential for list rendering
- **Profiling**: Use DevTools to find bottlenecks
- **Pitfalls**: Inline objects, functions, bad keys
- **Best Practice**: Profile before optimizing

**Next Step:** Master routing and navigation!
