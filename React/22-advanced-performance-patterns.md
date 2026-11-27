# Advanced Performance Patterns & Optimization

## Table of Contents
1. Lazy Loading Strategies
2. Image Optimization
3. Component Memoization
4. Bundle Size Reduction
5. Rendering Optimization
6. Memory Management
7. Network Optimization
8. Performance Profiling Tools

---

## 1. Lazy Loading Strategies

### Route-Based Lazy Loading
```javascript
import { lazy, Suspense } from 'react';

const Home = lazy(() => import('./pages/Home'));
const Settings = lazy(() => import('./pages/Settings'));
const Admin = lazy(() => import('./pages/Admin'));

function App() {
    return (
        <BrowserRouter>
            <Suspense fallback={<Loading />}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/admin" element={<Admin />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}
```

### Component-Based Lazy Loading
```javascript
const HeavyChart = lazy(() =>
    import(/* webpackChunkName: "chart" */ './HeavyChart')
);

function Dashboard() {
    const [showChart, setShowChart] = useState(false);
    
    return (
        <div>
            <button onClick={() => setShowChart(true)}>Show Chart</button>
            {showChart && (
                <Suspense fallback={<div>Loading chart...</div>}>
                    <HeavyChart />
                </Suspense>
            )}
        </div>
    );
}
```

### Conditional Lazy Loading
```javascript
const MediaComponent = lazy(() => {
    if (isMobile()) {
        return import('./MobileList');
    }
    return import('./DesktopTable');
});
```

---

## 2. Image Optimization

### Responsive Images
```javascript
// Using srcset for different screen sizes
<img
    src="image-400w.jpg"
    srcSet="
        image-400w.jpg 400w,
        image-800w.jpg 800w,
        image-1200w.jpg 1200w
    "
    alt="Description"
/>

// Picture element for art direction
<picture>
    <source media="(max-width: 600px)" srcSet="image-mobile.jpg" />
    <source media="(max-width: 1200px)" srcSet="image-tablet.jpg" />
    <img src="image-desktop.jpg" alt="Description" />
</picture>
```

### Next.js Image Component
```javascript
import Image from 'next/image';

<Image
    src="/hero.jpg"
    alt="Hero"
    width={1200}
    height={600}
    priority  // Load immediately (above fold)
    quality={75}  // Compression quality
/>

// Benefits:
// - Automatic format selection (webp, avif)
// - Responsive sizing
// - Lazy loading
// - Placeholder blur
```

### Format Optimization
```javascript
// Use modern formats
// WEBP: 25-35% smaller than JPG
// AVIF: 50-60% smaller than JPG

<picture>
    <source type="image/avif" srcSet="image.avif" />
    <source type="image/webp" srcSet="image.webp" />
    <img src="image.jpg" alt="Fallback" />
</picture>
```

### Lazy Loading Images
```javascript
// Intersection Observer
function LazyImage({ src, alt }) {
    const [imageSrc, setImageSrc] = useState(null);
    const imgRef = useRef(null);
    
    useEffect(() => {
        if (!imageSrc) return;
        
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                setImageSrc(src);
                observer.unobserve(imgRef.current);
            }
        });
        
        observer.observe(imgRef.current);
        return () => observer.disconnect();
    }, [src, imageSrc]);
    
    return (
        <img
            ref={imgRef}
            src={imageSrc}
            alt={alt}
            loading="lazy"
        />
    );
}
```

---

## 3. Component Memoization

### React.memo
```javascript
// Without memo - re-renders even if props unchanged
function Item({ name, onClick }) {
    console.log('Item rendered');
    return <div onClick={onClick}>{name}</div>;
}

// With memo - only re-renders if props change
const MemoizedItem = React.memo(Item);

// Comparison function
const MemoizedItem = React.memo(Item, (prevProps, nextProps) => {
    // Return true if props equal (skip render)
    return prevProps.name === nextProps.name &&
           prevProps.onClick === nextProps.onClick;
});
```

### useMemo
```javascript
function ExpensiveComponent({ data }) {
    // ✗ WRONG - Recalculates every render
    const processed = data.map(d => d * 2).sort((a, b) => a - b);
    
    // ✓ CORRECT - Only recalculates when data changes
    const processed = useMemo(
        () => data.map(d => d * 2).sort((a, b) => a - b),
        [data]
    );
    
    return <div>{processed.join(', ')}</div>;
}
```

### useCallback
```javascript
function Parent() {
    // ✗ WRONG - New function every render
    const handleClick = () => {
        dispatch(action);
    };
    
    // ✓ CORRECT - Same function reference if deps unchanged
    const handleClick = useCallback(() => {
        dispatch(action);
    }, [dispatch]);
    
    return <Child onClick={handleClick} />;
}
```

---

## 4. Bundle Size Reduction

### Code Splitting
```javascript
// Before: 500KB bundle
// After: 50KB initial + 150KB for each chunk

// main chunk: 50KB
// dashboard chunk: 150KB (loaded on demand)
// admin chunk: 200KB (loaded on demand)

function Router() {
    return (
        <Suspense fallback={<Loading />}>
            <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </Suspense>
    );
}
```

### Tree Shaking
```javascript
// ✗ WRONG - Imports everything
import * as lodash from 'lodash';
lodash.map([1, 2, 3], x => x * 2);

// ✓ CORRECT - Only import what you use
import { map } from 'lodash-es';
map([1, 2, 3], x => x * 2);

// package.json
{
    "sideEffects": false  // Enable tree shaking
}
```

### Dynamic Imports
```javascript
// Load only when needed
function loadChartLibrary() {
    return import('chart.js');
}

// Use
useEffect(() => {
    loadChartLibrary().then(Chart => {
        // Use Chart
    });
}, []);
```

---

## 5. Rendering Optimization

### Virtual Scrolling
```javascript
import { FixedSizeList } from 'react-window';

function VirtualList({ items }) {
    return (
        <FixedSizeList
            height={600}
            itemCount={items.length}
            itemSize={50}
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

// Before: Render 10,000 items - slow
// After: Render 20 visible items - fast
```

### Pagination
```javascript
function PaginatedList({ items, pageSize = 20 }) {
    const [page, setPage] = useState(0);
    
    const start = page * pageSize;
    const end = start + pageSize;
    const pageItems = items.slice(start, end);
    
    return (
        <div>
            {pageItems.map(item => <Item key={item.id} {...item} />)}
            <button onClick={() => setPage(p => p + 1)}>Next</button>
        </div>
    );
}
```

---

## 6. Memory Management

### Cleanup in Effects
```javascript
// ✗ WRONG - Memory leak
useEffect(() => {
    window.addEventListener('resize', handleResize);
    // No cleanup - listener stays in memory
}, []);

// ✓ CORRECT - Proper cleanup
useEffect(() => {
    window.addEventListener('resize', handleResize);
    
    return () => {
        window.removeEventListener('resize', handleResize);
    };
}, []);
```

### Subscription Management
```javascript
useEffect(() => {
    const subscription = dataStore.subscribe(setData);
    
    // Cleanup subscription
    return () => subscription.unsubscribe();
}, []);
```

### Abort Controller
```javascript
useEffect(() => {
    const controller = new AbortController();
    
    fetch(url, { signal: controller.signal })
        .then(r => r.json())
        .then(setData)
        .catch(error => {
            if (error.name !== 'AbortError') {
                setError(error);
            }
        });
    
    // Abort request if component unmounts
    return () => controller.abort();
}, [url]);
```

---

## 7. Network Optimization

### Request Deduplication
```javascript
const pendingRequests = new Map();

async function cachedFetch(url) {
    if (pendingRequests.has(url)) {
        return pendingRequests.get(url);
    }
    
    const promise = fetch(url)
        .then(r => r.json())
        .finally(() => pendingRequests.delete(url));
    
    pendingRequests.set(url, promise);
    return promise;
}
```

### Response Caching
```javascript
function useQuery(url, options = {}) {
    const cache = useRef({});
    const [data, setData] = useState(null);
    
    useEffect(() => {
        if (cache.current[url]) {
            setData(cache.current[url]);
            return;
        }
        
        fetch(url)
            .then(r => r.json())
            .then(d => {
                cache.current[url] = d;
                setData(d);
            });
    }, [url]);
    
    return data;
}
```

### Compression
```javascript
// Enable gzip compression on server
// nginx example
gzip on;
gzip_types text/plain text/css application/json application/javascript;
gzip_min_length 1024;
```

---

## 8. Performance Profiling Tools

### React DevTools Profiler
```javascript
// Measure component render times
// Profile → Interactions tab
// See which components are slow

function SlowComponent() {
    // Expensive computation
    const result = calculate();
    return <div>{result}</div>;
}

// Use Profiler API
import { Profiler } from 'react';

<Profiler
    id="SlowComponent"
    onRender={(id, phase, actualDuration) => {
        console.log(`${id} (${phase}) took ${actualDuration}ms`);
    }}
>
    <SlowComponent />
</Profiler>
```

### Chrome DevTools
```
1. Open DevTools → Performance tab
2. Click Record
3. Interact with app
4. Stop recording
5. Analyze:
   - Long tasks (> 50ms)
   - Main thread usage
   - Layout/Paint time
   - FCP, LCP metrics
```

### Lighthouse
```bash
# Run audit
npm install -g lighthouse
lighthouse https://example.com --view

# Metrics:
# - Performance (0-100)
# - Accessibility
# - Best Practices
# - SEO
# - PWA
```

---

## Exercises

### Exercise 1: Lazy Load Component
```javascript
// Create lazy-loaded modal that:
// - Opens on button click
// - Loads only when needed
// - Shows fallback while loading

// Your code
```

**Solution:**
```javascript
const Modal = lazy(() => import('./Modal'));

function Page() {
    const [open, setOpen] = useState(false);
    
    return (
        <div>
            <button onClick={() => setOpen(true)}>Open</button>
            {open && (
                <Suspense fallback={<div>Loading...</div>}>
                    <Modal onClose={() => setOpen(false)} />
                </Suspense>
            )}
        </div>
    );
}
```

### Exercise 2: Optimize List Rendering
```javascript
// Convert regular list to virtual list:
// - 10,000 items
// - Only render visible items

// Your code
```

**Solution:**
```javascript
import { FixedSizeList } from 'react-window';

function VirtualList({ items }) {
    return (
        <FixedSizeList
            height={600}
            itemCount={items.length}
            itemSize={50}
        >
            {({ index, style }) => (
                <div style={style}>{items[index].name}</div>
            )}
        </FixedSizeList>
    );
}
```

### Exercise 3: Memoization Setup
```javascript
// Optimize component with:
// - React.memo
// - useCallback
// - useMemo

// Your code
```

**Solution:**
```javascript
const Item = React.memo(({ item, onDelete }) => (
    <div>
        {item.name}
        <button onClick={() => onDelete(item.id)}>Delete</button>
    </div>
));

function List({ items }) {
    const handleDelete = useCallback((id) => {
        setItems(prev => prev.filter(i => i.id !== id));
    }, []);
    
    const processed = useMemo(() =>
        items.map(i => i.name).sort(),
        [items]
    );
    
    return <div>{processed.map(name => <div key={name}>{name}</div>)}</div>;
}
```

---

## Interview Questions

### Theoretical Questions

**Q1: What is code splitting?**
A: Breaking bundle into chunks loaded on demand.

**Q2: When to use lazy()?**
A: For routes or heavy components loaded later.

**Q3: What does React.memo do?**
A: Prevents re-render if props haven't changed.

**Q4: When to use useMemo?**
A: For expensive calculations that rarely change.

**Q5: What is virtual scrolling?**
A: Rendering only visible items for large lists.

---

## Summary

- **Lazy Loading:** Route-based, component-based chunks
- **Images:** Responsive, modern formats, lazy load
- **Memoization:** React.memo, useCallback, useMemo
- **Bundle:** Tree shaking, code splitting, dynamic imports
- **Rendering:** Virtual scrolling, pagination
- **Memory:** Cleanup subscriptions, abort requests
- **Network:** Deduplication, caching, compression
- **Tools:** React Profiler, Chrome DevTools, Lighthouse
- **Metrics:** FCP, LCP, CLS, INP, TTFB
- **Trade-offs:** Complexity vs performance gain

**Next:** Advanced form patterns!
