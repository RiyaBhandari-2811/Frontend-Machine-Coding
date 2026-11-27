# Advanced React Performance Tuning Case Studies

## Table of Contents
1. E-commerce Platform Optimization
2. Social Media Feed Scaling
3. Real-time Dashboard Performance
4. Large Form Performance
5. Data Visualization Optimization
6. Mobile App Performance
7. Monorepo Performance
8. Lessons Learned

---

## 1. E-commerce Platform Optimization

### Initial Performance Issues
```
Metrics:
- LCP: 5.2s (target: 2.5s)
- INP: 450ms (target: 200ms)
- FCP: 3.1s (target: 1.8s)
- Bundle: 1.2MB
- TTI: 7.3s
```

### Problems Identified
```javascript
// Problem 1: Large Bundle
// All product images loaded eagerly
<img src={product.image} />  // High-res image immediately

// Problem 2: Unnecessary Renders
function ProductList({ filters }) {
    // Renders all products on filter change
    return (
        <div>
            {products.map(p => (
                <ProductCard key={p.id} product={p} />  // Not memoized
            ))}
        </div>
    );
}

// Problem 3: Blocking JavaScript
// All JavaScript loaded before render
<script src="app.js" />  {/* No async/defer */}

// Problem 4: Heavy Analytics
// Sending too much data to analytics service
analytics.track(user.toString());
```

### Solutions Implemented

#### 1. Image Optimization
```javascript
// BEFORE: 500KB per image
<img src={product.largeImage} />

// AFTER: Responsive images with modern formats
function ProductImage({ product }) {
    return (
        <picture>
            <source
                srcSet={`${product.id}?w=600&h=600&fm=webp`}
                type="image/webp"
                media="(min-width: 768px)"
            />
            <source
                srcSet={`${product.id}?w=300&h=300&fm=webp`}
                type="image/webp"
            />
            <source
                srcSet={`${product.id}?w=600&h=600`}
                media="(min-width: 768px)"
            />
            <img
                src={`${product.id}?w=300&h=300`}
                alt={product.name}
                loading="lazy"
                decoding="async"
            />
        </picture>
    );
}

// Result: 85% size reduction (500KB → 75KB)
```

#### 2. Code Splitting
```javascript
// BEFORE: 1.2MB main bundle
export default App;

// AFTER: Split by route
const Home = lazy(() => import('./pages/Home'));
const Product = lazy(() => import('./pages/Product'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Admin = lazy(() => import('./pages/Admin'));

function App() {
    return (
        <Suspense fallback={<Loading />}>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/product/:id" element={<Product />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/admin/*" element={<Admin />} />
            </Routes>
        </Suspense>
    );
}

// Result: Initial bundle 320KB, others on demand
```

#### 3. Memoization Strategy
```javascript
// BEFORE: All products re-render
function ProductList({ filters }) {
    return (
        <div>
            {products.map(p => (
                <ProductCard key={p.id} product={p} />
            ))}
        </div>
    );
}

// AFTER: Memoize to prevent re-renders
const ProductCard = React.memo(function ProductCard({ product }) {
    return <div>{product.name}</div>;
});

function ProductList({ filters }) {
    const filteredProducts = useMemo(() => {
        return applyFilters(products, filters);
    }, [products, filters]);
    
    return (
        <div>
            {filteredProducts.map(p => (
                <ProductCard key={p.id} product={p} />
            ))}
        </div>
    );
}

// Result: 60% fewer re-renders
```

#### 4. Script Optimization
```javascript
// BEFORE: Render blocking
<script src="app.js" />

// AFTER: Non-blocking with async
<script src="app.js" async></script>

// Or defer for external dependencies
<script src="analytics.js" defer></script>

// Or dynamic import for heavy libraries
const Chart = lazy(() => import('chart.js'));
```

#### 5. Analytics Optimization
```javascript
// BEFORE: Sending too much data
analytics.track(user.toString());  // 10KB per event

// AFTER: Minimal structured data
analytics.track('product_view', {
    productId: product.id,
    price: product.price,
    category: product.category
});  // 200 bytes per event

// Batch events
const eventQueue = [];
useEffect(() => {
    const timer = setTimeout(() => {
        if (eventQueue.length > 0) {
            analytics.batch(eventQueue);
            eventQueue.length = 0;
        }
    }, 5000);
    
    return () => clearTimeout(timer);
}, []);
```

### Results
```
After Optimization:
- LCP: 5.2s → 1.8s ✓ (60% improvement)
- INP: 450ms → 180ms ✓ (60% improvement)
- FCP: 3.1s → 1.2s ✓ (61% improvement)
- Bundle: 1.2MB → 320KB ✓ (73% reduction)
- TTI: 7.3s → 2.1s ✓ (71% improvement)
- Conversion: +23% (faster load = more conversions)
```

---

## 2. Social Media Feed Scaling

### Initial Problems
```
Metrics:
- Render time: 2000ms for 500 items
- Memory: 180MB after scrolling
- Stutter: Visible lag when scrolling
```

### Solutions

#### Virtual Scrolling
```javascript
// BEFORE: Render all items
{feed.map(item => (
    <FeedItem key={item.id} item={item} />
))}

// AFTER: Only visible items
import { FixedSizeList } from 'react-window';

function VirtualizedFeed({ feed }) {
    const Row = ({ index, style }) => (
        <div style={style}>
            <FeedItem item={feed[index]} />
        </div>
    );
    
    return (
        <FixedSizeList
            height={window.innerHeight}
            itemCount={feed.length}
            itemSize={300}
            width="100%"
        >
            {Row}
        </FixedSizeList>
    );
}

// Result: 60fps scrolling, render time 50ms
```

#### Infinite Scroll with Pagination
```javascript
function Feed() {
    const [page, setPage] = useState(1);
    
    const { data: feedData, isFetching } = useQuery({
        queryKey: ['feed', page],
        queryFn: () => fetchFeed(page),
        getNextPageParam: (lastPage) => lastPage.nextPage
    });
    
    const { ref } = useInView({
        onChange: (inView) => {
            if (inView && !isFetching) {
                setPage(p => p + 1);
            }
        }
    });
    
    return (
        <>
            <VirtualizedFeed feed={allFeed} />
            <div ref={ref}>
                {isFetching && <Skeleton />}
            </div>
        </>
    );
}
```

#### Memoization of Feed Items
```javascript
const FeedItem = React.memo(function FeedItem({ item }) {
    return (
        <div>
            <Avatar url={item.user.avatar} />
            <Content text={item.content} />
            <Reactions count={item.reactionCount} />
        </div>
    );
}, (prev, next) => {
    // Skip re-render if only reaction count changed from like
    return prev.item.id === next.item.id &&
           prev.item.content === next.item.content;
});
```

### Results
```
After Optimization:
- Render time: 2000ms → 50ms ✓ (40x faster)
- Memory: 180MB → 45MB ✓ (75% reduction)
- Scroll FPS: 24fps → 60fps ✓ (perfect smoothness)
- User engagement: +35%
```

---

## 3. Real-time Dashboard Performance

### Initial Issues
```javascript
// BEFORE: Updates cause re-render of entire dashboard
function Dashboard({ metrics }) {
    return (
        <div>
            <MetricCard metric={metrics.users} />
            <MetricCard metric={metrics.revenue} />
            <Chart data={metrics.daily} />
            <Table data={metrics.transactions} />
        </div>
    );
}

// Every metric update re-renders everything
```

### Solutions

#### Granular State Management
```javascript
// BEFORE: Monolithic state
const [metrics, setMetrics] = useState({
    users: 0,
    revenue: 0,
    daily: [],
    transactions: []
});

// AFTER: Separate concerns
function useDashboard() {
    const [users, setUsers] = useState(0);
    const [revenue, setRevenue] = useState(0);
    const dailyData = useQuery(['daily'], fetchDaily);
    const transactions = useQuery(['transactions'], fetchTransactions);
    
    return { users, revenue, dailyData, transactions };
}
```

#### Memoized Expensive Components
```javascript
// Chart re-renders only when data changes
const DashboardChart = React.memo(function Chart({ data }) {
    console.log('Chart rendered');
    return <LineChart data={data} />;
}, (prev, next) => {
    return JSON.stringify(prev.data) === JSON.stringify(next.data);
});

// Table optimized with virtual scrolling
const TransactionTable = React.memo(function Table({ transactions }) {
    return (
        <VirtualTable
            items={transactions}
            itemSize={50}
            height={400}
        />
    );
});
```

#### WebSocket Subscription Optimization
```javascript
function useDashboardMetrics() {
    const metricsRef = useRef({});
    
    useEffect(() => {
        const ws = new WebSocket(WS_URL);
        
        ws.onmessage = (event) => {
            const { type, data } = JSON.parse(event.data);
            
            // Only update changed metrics
            if (metricsRef.current[type] !== data.value) {
                metricsRef.current[type] = data.value;
                
                // Notify subscribers of specific metric
                eventBus.emit(`metric:${type}`, data.value);
            }
        };
    }, []);
}

// Individual metric listens only to its changes
function MetricCard({ type }) {
    const [value, setValue] = useState(0);
    
    useEffect(() => {
        const unsubscribe = eventBus.on(
            `metric:${type}`,
            setValue
        );
        return unsubscribe;
    }, [type]);
    
    return <div>{value}</div>;
}
```

### Results
```
After Optimization:
- Dashboard update time: 500ms → 50ms ✓
- CPU usage: 85% → 15% ✓
- Memory: 250MB → 120MB ✓
- Real-time responsiveness: Excellent
```

---

## 4. Large Form Performance

### Problem
```javascript
// BEFORE: 50 fields, slow typing
function LargeForm() {
    const [formData, setFormData] = useState({
        field1: '', field2: '', ... field50: ''
    });
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        // This creates new object every keystroke
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    return (
        <form>
            {/* All 50 fields re-render on each keystroke */}
            {Object.entries(formData).map(([key, value]) => (
                <Input key={key} name={key} value={value} onChange={handleChange} />
            ))}
        </form>
    );
}
```

### Solution
```javascript
// AFTER: Use React Hook Form
import { useForm, Controller } from 'react-hook-form';

function LargeForm() {
    const { control, handleSubmit, watch } = useForm({
        defaultValues: {
            // 50 fields...
        },
        mode: 'onBlur'  // Validate only on blur
    });
    
    const onSubmit = (data) => {
        // Only submitted data processed
        api.submitForm(data);
    };
    
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {/* Controllers don't re-render on sibling changes */}
            <Controller
                name="email"
                control={control}
                render={({ field }) => <Input {...field} />}
            />
            {/* ... 49 more fields */}
        </form>
    );
}

// Or use uncontrolled components
function LargeFormUncontrolled() {
    const formRef = useRef();
    
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(formRef.current);
        const data = Object.fromEntries(formData);
        api.submitForm(data);
    };
    
    return (
        <form ref={formRef} onSubmit={handleSubmit}>
            <input name="field1" />
            <input name="field2" />
            {/* No re-renders on input changes */}
        </form>
    );
}
```

### Results
```
Before: Input lag, noticeable delay
After: Instant, smooth typing
Typing speed: 24fps → 60fps
```

---

## 5. Data Visualization Optimization

### Problem
```javascript
// BEFORE: Redraw chart on every data point
function RealtimeChart({ data }) {
    return <Chart data={data} />;  // Renders every update
}
```

### Solutions

#### Debounce Updates
```javascript
function RealtimeChart({ data }) {
    const debouncedData = useDeferredValue(data);
    
    return <Chart data={debouncedData} />;
}

// Or manual debouncing
function RealtimeChart({ data }) {
    const [displayData, setDisplayData] = useState(data);
    
    useEffect(() => {
        const timer = setTimeout(() => {
            setDisplayData(data);
        }, 500);  // Update chart every 500ms max
        
        return () => clearTimeout(timer);
    }, [data]);
    
    return <Chart data={displayData} />;
}
```

#### Canvas-based Charts
```javascript
// Use canvas instead of SVG for large datasets
// Canvas: Better performance for large datasets
// SVG: Better for interactions and styling

function PerformanceChart({ data }) {
    // For 10K+ data points, use canvas
    return <CanvasChart data={data} />;
}
```

---

## Lessons Learned

### Key Takeaways
```
1. Measure First
   - Use Lighthouse, DevTools
   - Identify actual bottlenecks
   - Profile before optimizing

2. Optimize Strategically
   - Start with high-impact changes
   - 20% of optimizations give 80% improvement
   - Don't over-engineer

3. Consider Tradeoffs
   - Performance vs Complexity
   - Maintainability vs Speed
   - UX vs Performance

4. Monitor Continuously
   - Set up real user monitoring
   - Track Web Vitals
   - Alert on degradation

5. Test on Real Devices
   - Desktop ≠ Mobile
   - Throttle network
   - Test on slow devices
```

---

## Summary

- **Image optimization:** 85% size reduction
- **Code splitting:** 73% bundle reduction
- **Virtual scrolling:** 40x render improvement
- **Memoization:** Prevent unnecessary renders
- **Granular state:** Only update what changed
- **React Hook Form:** Handle large forms efficiently
- **Debouncing:** Reduce update frequency
- **Canvas charts:** Better for large datasets
- **Monitoring:** Continuous performance tracking
- **User impact:** 23-35% improvement in key metrics

**Next: Complete guide and final references!**
