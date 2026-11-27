# Render Optimization Strategies & Performance Profiling

## Table of Contents
1. Identifying Performance Issues
2. Memoization Strategies
3. Code Splitting
4. Bundle Analysis
5. Image Optimization
6. Virtualization
7. Profiling Tools
8. Real-World Performance Budgets

---

## 1. Identifying Performance Issues

### Performance Metrics
```javascript
// Web Vitals - Google's key metrics
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);  // Cumulative Layout Shift
getFID(console.log);  // First Input Delay
getFCP(console.log);  // First Contentful Paint
getLCP(console.log);  // Largest Contentful Paint
getTTFB(console.log); // Time to First Byte

// Good scores:
// LCP: < 2.5s
// FID: < 100ms
// CLS: < 0.1

// Performance Observer API
const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
        console.log(`${entry.name}: ${entry.duration}ms`);
    }
});

observer.observe({ entryTypes: ['measure', 'navigation'] });
```

### React Profiler API
```javascript
import { Profiler } from 'react';

function onRenderCallback(
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime
) {
    console.log(`${id} (${phase}) took ${actualDuration}ms`);
}

function App() {
    return (
        <Profiler id="app" onRender={onRenderCallback}>
            <Routes />
        </Profiler>
    );
}

// Output:
// app (mount) took 234ms
// app (update) took 56ms
```

---

## 2. Memoization Strategies

### React.memo Optimization
```javascript
// ✗ WRONG - Re-renders on every parent render
function UserCard({ user, onUserClick }) {
    console.log('UserCard rendered');
    return <div onClick={() => onUserClick(user.id)}>{user.name}</div>;
}

function UserList({ users }) {
    return users.map(user => (
        <UserCard key={user.id} user={user} onUserClick={console.log} />
    ));
}

// UserCard renders hundreds of times unnecessarily

// ✓ CORRECT - Memoize with stable props
const UserCard = React.memo(function UserCard({ user, onUserClick }) {
    console.log('UserCard rendered');
    return <div onClick={() => onUserClick(user.id)}>{user.name}</div>;
});

function UserList({ users }) {
    const handleUserClick = useCallback(
        (userId) => console.log(userId),
        []
    );
    
    return users.map(user => (
        <UserCard key={user.id} user={user} onUserClick={handleUserClick} />
    ));
}

// Now only re-renders when user prop changes
```

### Advanced Memoization
```javascript
// Custom comparison function
const MyComponent = React.memo(
    ({ count, name }) => <div>{count} {name}</div>,
    (prevProps, nextProps) => {
        // Return true if props are equal (don't re-render)
        return (
            prevProps.count === nextProps.count &&
            prevProps.name === nextProps.name
        );
    }
);

// Or use shallowEqual
import { shallowEqual } from 'react-redux';

const MyComponent = React.memo(
    ({ data }) => <div>{data.name}</div>,
    (prevProps, nextProps) => shallowEqual(prevProps.data, nextProps.data)
);
```

---

## 3. Code Splitting

### Route-based Splitting
```javascript
import { lazy, Suspense } from 'react';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Admin = lazy(() => import('./pages/Admin'));

function App() {
    return (
        <Suspense fallback={<Loading />}>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/admin" element={<Admin />} />
            </Routes>
        </Suspense>
    );
}

// Benefits:
// - Initial bundle smaller
// - Lazy load on route change
// - Automatic with Webpack
```

### Component-based Splitting
```javascript
const HeavyChart = lazy(() => import('./components/Chart'));
const Editor = lazy(() => import('./components/Editor'));

function Dashboard() {
    const [showChart, setShowChart] = useState(false);
    const [showEditor, setShowEditor] = useState(false);
    
    return (
        <div>
            <button onClick={() => setShowChart(true)}>Show Chart</button>
            <button onClick={() => setShowEditor(true)}>Show Editor</button>
            
            {showChart && (
                <Suspense fallback={<div>Loading chart...</div>}>
                    <HeavyChart />
                </Suspense>
            )}
            
            {showEditor && (
                <Suspense fallback={<div>Loading editor...</div>}>
                    <Editor />
                </Suspense>
            )}
        </div>
    );
}
```

### Webpack Magic Comments
```javascript
// Name chunk
const Component = lazy(() =>
    import(/* webpackChunkName: "feature" */ './Feature')
);

// Prefetch (non-critical)
const Component = lazy(() =>
    import(/* webpackPrefetch: true */ './Feature')
);

// Preload (critical)
const Component = lazy(() =>
    import(/* webpackPreload: true */ './Feature')
);
```

---

## 4. Bundle Analysis

### Analyzing Bundle Size
```bash
# npm install -save-dev source-map-explorer
npm run build
npx source-map-explorer 'build/static/js/*.js'

# Shows:
# - Which packages take space
# - Unused dependencies
# - Duplicate packages
```

### Tree Shaking & Unused Code
```javascript
// ✗ WRONG - Import whole library
import { map, filter, reduce } from 'lodash';

// ✗ All of lodash bundled!

// ✓ CORRECT - Import specific functions
import { map, filter, reduce } from 'lodash-es';

// Or tree-shakable imports
import map from 'lodash/map';
import filter from 'lodash/filter';

// Best practice
// Use native methods when possible
const result = array.map(x => x * 2).filter(x => x > 5);
```

### Production Optimization
```javascript
// webpack.config.js
module.exports = {
    mode: 'production',
    optimization: {
        minimize: true,
        runtimeChunk: 'single',
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors'
                }
            }
        }
    }
};
```

---

## 5. Image Optimization

### Responsive Images
```javascript
// ✗ WRONG - Single large image
<img src="photo-1200.jpg" alt="Photo" />

// ✓ CORRECT - Multiple sizes
<img
    src="photo-800.jpg"
    srcSet="
        photo-400.jpg 400w,
        photo-800.jpg 800w,
        photo-1200.jpg 1200w
    "
    sizes="
        (max-width: 600px) 400px,
        (max-width: 1200px) 800px,
        1200px
    "
    alt="Photo"
/>

// Or use picture element
<picture>
    <source srcSet="photo.webp" type="image/webp" />
    <source srcSet="photo.jpg" type="image/jpeg" />
    <img src="photo.jpg" alt="Photo" />
</picture>
```

### Next.js Image Component
```javascript
import Image from 'next/image';

<Image
    src="/photo.jpg"
    alt="Photo"
    width={800}
    height={600}
    priority        // Load immediately
    quality={75}    // Compress
    placeholder="blur"  // Blur while loading
/>

// Benefits:
// - Automatic optimization
// - Responsive sizes
// - Format conversion (WebP)
// - Lazy loading
```

---

## 6. Virtualization

### Virtual Lists
```javascript
// ✗ WRONG - Render 10,000 items (slow!)
function LargeList({ items }) {
    return (
        <ul>
            {items.map(item => <li key={item.id}>{item.name}</li>)}
        </ul>
    );
}

// ✓ CORRECT - Render only visible items
import { FixedSizeList } from 'react-window';

function VirtualList({ items }) {
    return (
        <FixedSizeList
            height={600}
            itemCount={items.length}
            itemSize={35}
        >
            {({ index, style }) => (
                <div style={style}>
                    {items[index].name}
                </div>
            )}
        </FixedSizeList>
    );
}

// Or use Intersection Observer
function VirtualList({ items }) {
    const [visibleStart, setVisibleStart] = useState(0);
    const itemHeight = 35;
    const containerHeight = 600;
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    
    const visibleItems = items.slice(
        visibleStart,
        visibleStart + visibleCount
    );
    
    return (
        <div
            style={{ height: containerHeight, overflow: 'auto' }}
            onScroll={(e) => {
                const scrollTop = e.currentTarget.scrollTop;
                setVisibleStart(Math.floor(scrollTop / itemHeight));
            }}
        >
            <div style={{ height: items.length * itemHeight }}>
                {visibleItems.map((item, i) => (
                    <div
                        key={item.id}
                        style={{ top: (visibleStart + i) * itemHeight }}
                    >
                        {item.name}
                    </div>
                ))}
            </div>
        </div>
    );
}
```

---

## 7. Profiling Tools

### React DevTools Profiler
```
1. Open React DevTools
2. Go to Profiler tab
3. Click record
4. Interact with app
5. Stop recording
6. Analyze:
   - Which components rendered
   - How long each took
   - Why they rendered
```

### Chrome DevTools Performance
```
1. Open DevTools > Performance
2. Click record
3. Interact with page
4. Stop recording
5. View:
   - Flame chart (what took time)
   - Main thread activity
   - Long tasks (> 50ms)
   - FCP, LCP timestamps
```

### Lighthouse Audit
```bash
# CLI
npm install -g lighthouse
lighthouse https://example.com

# Or use Chrome DevTools > Lighthouse
# Generates report:
# - Performance score
# - Opportunities (what to fix)
# - Diagnostics (details)
```

---

## 8. Real-World Performance Budgets

### Setting Budgets
```javascript
// performance-budget.json
{
    "resourceBudgets": [
        {
            "resourceType": "script",
            "budget": 170  // KB
        },
        {
            "resourceType": "style",
            "budget": 50
        },
        {
            "resourceType": "image",
            "budget": 250
        }
    ]
}

// Or use bundlesize npm package
// package.json
{
    "bundlesize": [
        {
            "name": "main.js",
            "maxSize": "170kb"
        }
    ]
}
```

### Monitoring in Production
```javascript
// Send metrics to analytics
function reportWebVitals(metric) {
    if (navigator.sendBeacon) {
        navigator.sendBeacon('/api/analytics', JSON.stringify(metric));
    }
}

// Use analytics service
import { getCLS, getFID, getLCP } from 'web-vitals';

getCLS(metric => {
    console.log(`CLS: ${metric.value}`);
    // Send to Sentry, DataDog, etc.
});

LCP(metric => {
    console.log(`LCP: ${metric.value}`);
});
```

---

## Exercises

### Exercise 1: Memoization Strategy
```javascript
// Optimize re-renders in list
function UserList({ users, onSelect }) {
    // Your code
}

// User: { id, name, email }
// Called with new onSelect every render
```

**Solution:**
```javascript
const UserCard = React.memo(({ user, onSelect }) => (
    <div onClick={() => onSelect(user.id)}>{user.name}</div>
));

function UserList({ users, onSelect }) {
    const handleSelect = useCallback(onSelect, [onSelect]);
    
    return users.map(user => (
        <UserCard
            key={user.id}
            user={user}
            onSelect={handleSelect}
        />
    ));
}
```

### Exercise 2: Code Splitting
```javascript
// Split admin dashboard into separate chunk
function Dashboard() {
    const [showAdmin, setShowAdmin] = useState(false);
    // Your code
}
```

**Solution:**
```javascript
const AdminPanel = lazy(() => import('./AdminPanel'));

function Dashboard() {
    const [showAdmin, setShowAdmin] = useState(false);
    
    return (
        <div>
            <button onClick={() => setShowAdmin(!showAdmin)}>
                Toggle Admin
            </button>
            {showAdmin && (
                <Suspense fallback={<div>Loading...</div>}>
                    <AdminPanel />
                </Suspense>
            )}
        </div>
    );
}
```

### Exercise 3: Virtual List
```javascript
// Create list that handles 10,000 items
function LargeList({ items }) {
    // Your code
}
```

**Solution:**
```javascript
import { FixedSizeList } from 'react-window';

function LargeList({ items }) {
    return (
        <FixedSizeList
            height={600}
            itemCount={items.length}
            itemSize={35}
            width="100%"
        >
            {({ index, style }) => (
                <div style={style}>
                    {items[index].name}
                </div>
            )}
        </FixedSizeList>
    );
}
```

---

## Interview Questions

### Theoretical Questions

**Q1: What is code splitting?**
A: Splitting bundle into smaller chunks loaded on demand.

**Q2: When to memoize?**
A: When component receives non-memoized props from parent.

**Q3: What is virtualization?**
A: Rendering only visible items, hiding off-screen.

**Q4: What are web vitals?**
A: Google's metrics for user experience.

**Q5: What is tree shaking?**
A: Removing unused code from bundle.

---

## Code-Based Interview Questions

**Q1: What is wrong?**
```javascript
<UserCard user={user} onClick={() => handleClick()} />
// Performance issue?
```
A: New function every render, should use useCallback

**Q2: Predict:**
```javascript
const Component = lazy(() => import('./Heavy'));
// Loads immediately?
```
A: No, loads when first rendered inside Suspense

**Q3: What is better?**
```javascript
import { map } from 'lodash';
// or
import map from 'lodash/map';
// Which for bundle size?
```
A: Second one, tree-shakes better

**Q4: Spot the issue:**
```javascript
{largeList.map((item) => <Item key={index} />)}
// Performance problem?
```
A: Yes, using index as key causes issues

**Q5: What is output?**
```javascript
// Component renders 10,000 times
// Use virtualization?
```
A: Yes, with react-window or similar

---

## Summary

- **Identify Issues:** Use profiler and audit tools
- **Memoization:** React.memo for expensive components
- **useCallback:** When passing functions to memoized children
- **useMemo:** For expensive calculations
- **Code Splitting:** Lazy load non-critical components
- **Bundle Analysis:** Use source-map-explorer
- **Image Optimization:** Responsive images and compression
- **Virtualization:** For large lists
- **Performance Budgets:** Monitor bundle size
- **Web Vitals:** Track LCP, FID, CLS

**Next:** Real-world architectures!
