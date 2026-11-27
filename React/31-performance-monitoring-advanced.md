# Advanced Performance Monitoring & Optimization Techniques

## Table of Contents
1. Web Vitals Deep Dive
2. Performance Metrics
3. Profiling Strategies
4. Bundle Analysis
5. Runtime Performance
6. User Experience Metrics
7. Optimization Checklist
8. Monitoring Setup

---

## 1. Web Vitals Deep Dive

### Core Web Vitals
```
LCP (Largest Contentful Paint):
- When: Time until largest content element painted
- Target: < 2.5s
- Optimize: Image compression, lazy loading, CDN

INP (Interaction to Next Paint):
- When: Time from user interaction to visual feedback
- Target: < 200ms
- Optimize: Reduce JavaScript, debounce handlers

CLS (Cumulative Layout Shift):
- When: Unexpected layout changes during load
- Target: < 0.1
- Optimize: Set dimensions, avoid late-loading content
```

### Measuring Web Vitals
```javascript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

// All web vitals
getCLS(metric => {
    console.log('CLS:', metric.value);
    sendToAnalytics('CLS', metric.value);
});

getFID(metric => {
    console.log('FID:', metric.value);
});

getFCP(metric => {
    console.log('FCP:', metric.value);
});

getLCP(metric => {
    console.log('LCP:', metric.value);
});

getTTFB(metric => {
    console.log('TTFB:', metric.value);
});
```

---

## 2. Performance Metrics

### Key Metrics
```javascript
// Performance API
const navigationTiming = performance.getEntriesByType('navigation')[0];

// Time to First Byte (TTFB)
const ttfb = navigationTiming.responseStart - navigationTiming.fetchStart;

// First Contentful Paint (FCP)
const fcpMetrics = performance.getEntriesByName('first-contentful-paint');
const fcp = fcpMetrics[0]?.startTime;

// Largest Contentful Paint (LCP)
const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];
    console.log('LCP:', lastEntry.renderTime || lastEntry.loadTime);
});

observer.observe({ entryTypes: ['largest-contentful-paint'] });

// Memory usage (Chrome)
if (performance.memory) {
    console.log('JS Heap:', performance.memory.usedJSHeapSize);
    console.log('JS Heap Limit:', performance.memory.jsHeapSizeLimit);
}
```

### Custom Metrics
```javascript
// Measure custom timing
performance.mark('api-start');
await fetch('/api/data');
performance.mark('api-end');
performance.measure('api-call', 'api-start', 'api-end');

const measure = performance.getEntriesByName('api-call')[0];
console.log('API call took:', measure.duration);

// Mark component render
performance.mark('render-start');
// ... component render
performance.mark('render-end');
performance.measure('render', 'render-start', 'render-end');
```

---

## 3. Profiling Strategies

### React Profiler
```javascript
import { Profiler } from 'react';

function onRenderCallback(
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime,
    interactions
) {
    // Log to analytics
    console.log(`${id} (${phase}) took ${actualDuration}ms`);
    
    // Alert if slow
    if (actualDuration > 100) {
        logSlowComponent({ id, actualDuration });
    }
}

export default function App() {
    return (
        <Profiler id="App" onRender={onRenderCallback}>
            <Components />
        </Profiler>
    );
}
```

### Browser DevTools Profiling
```
Steps:
1. Open DevTools → Performance tab
2. Click Record (Ctrl+Shift+E)
3. Interact with app
4. Stop recording
5. Analyze:
   - Main thread usage
   - Layout, Paint, Composite times
   - Rendering bottlenecks
   - Long tasks (>50ms)
```

### CPU Profiling
```javascript
// Using PerformanceObserver
const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
        // Filter long tasks
        if (entry.duration > 50) {
            console.log('Long task detected:', {
                duration: entry.duration,
                name: entry.name,
                startTime: entry.startTime
            });
        }
    }
});

observer.observe({ entryTypes: ['longtask'] });
```

---

## 4. Bundle Analysis

### Analyze Bundle Size
```bash
# Using source-map-explorer
npm install --save-dev source-map-explorer
npm run build
npx source-map-explorer 'build/static/js/*.js'

# Using webpack-bundle-analyzer
npm install --save-dev webpack-bundle-analyzer

// webpack.config.js
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
    plugins: [
        new BundleAnalyzerPlugin()
    ]
};

npm run build
# Opens http://localhost:8888
```

### Code Splitting
```javascript
// Route-based splitting
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

// Component-based splitting
const HeavyComponent = lazy(() => import('./components/HeavyComponent'));
```

---

## 5. Runtime Performance

### Optimize Re-renders
```javascript
// ✗ SLOW: Re-renders on every keystroke
function SearchUsers({ query }) {
    const [results, setResults] = useState([]);
    
    useEffect(() => {
        const timer = setTimeout(() => {
            searchAPI(query).then(setResults);
        }, 500);
        
        return () => clearTimeout(timer);
    }, [query]);  // Runs on every keystroke
    
    return (
        <>
            <input defaultValue={query} />
            <ExpensiveComponent results={results} />
        </>
    );
}

// ✓ OPTIMIZED: Debounce search
function SearchUsers() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    
    useEffect(() => {
        const timer = setTimeout(() => {
            searchAPI(query).then(setResults);
        }, 500);
        
        return () => clearTimeout(timer);
    }, [query]);
    
    return (
        <>
            <input value={query} onChange={(e) => setQuery(e.target.value)} />
            <Suspense fallback={<div>Loading...</div>}>
                <ExpensiveComponent results={results} />
            </Suspense>
        </>
    );
}
```

### Optimize Lists
```javascript
// ✗ SLOW: Renders entire list
function UserList({ users }) {
    return (
        <div>
            {users.map(user => (
                <UserCard key={user.id} user={user} />
            ))}
        </div>
    );
}

// ✓ OPTIMIZED: Virtual scrolling
import { FixedSizeList } from 'react-window';

function UserList({ users }) {
    const Row = ({ index, style }) => (
        <div style={style}>
            <UserCard user={users[index]} />
        </div>
    );
    
    return (
        <FixedSizeList
            height={600}
            itemCount={users.length}
            itemSize={80}
            width="100%"
        >
            {Row}
        </FixedSizeList>
    );
}
```

---

## 6. User Experience Metrics

### Perceived Performance
```
1. Perceived Load Time:
   - Show skeleton/placeholder
   - Start animation/spinners early
   - Use perceived delays

2. Response Time:
   - Provide immediate feedback
   - Show progress indicators
   - Use optimistic updates

3. Animation Performance:
   - 60fps for smooth animations
   - Use CSS transforms
   - Avoid repaints
```

### Error Tracking
```javascript
// Setup Sentry for error tracking
import * as Sentry from "@sentry/react";

Sentry.init({
    dsn: "https://...@sentry.io/...",
    environment: process.env.NODE_ENV,
    tracesSampleRate: 0.1,
});

// Wrap app
export default Sentry.withProfiler(App);

// Capture exceptions
try {
    // Code
} catch (error) {
    Sentry.captureException(error, {
        tags: {
            section: 'checkout'
        }
    });
}
```

---

## 7. Optimization Checklist

### Before Deployment
- [ ] Bundle size analyzed
- [ ] Code splitting implemented
- [ ] Images optimized (WebP, responsive)
- [ ] Service worker configured
- [ ] Caching strategy set
- [ ] Compression enabled (gzip/brotli)
- [ ] Minification done
- [ ] Source maps generated
- [ ] Environment variables set
- [ ] Error tracking setup

### Production Monitoring
- [ ] Web Vitals tracked
- [ ] Error rate monitored
- [ ] User analytics tracked
- [ ] Performance dashboards created
- [ ] Alerting configured
- [ ] Logs centralized
- [ ] Session replay enabled
- [ ] RUM (Real User Monitoring) active
- [ ] Synthetic monitoring setup
- [ ] SLOs/SLAs defined

---

## 8. Monitoring Setup

### Datadog/New Relic Setup
```javascript
// Initialize monitoring
import { datadogRum } from '@datadog/browser-rum';

datadogRum.init({
    applicationId: 'YOUR_APP_ID',
    clientToken: 'YOUR_CLIENT_TOKEN',
    site: 'datadoghq.com',
    service: 'my-app',
    env: process.env.NODE_ENV,
    version: '1.0.0',
    sessionReplaySampleRate: 100,
    defaultPrivacyLevel: 'mask-user-input',
});

datadogRum.startSessionReplayRecording();

// Track custom events
datadogRum.addRumGlobalContext('user_id', userId);

datadogRum.addAction('user_clicked_button', {
    buttonName: 'purchase'
});
```

### Custom Analytics
```javascript
class Analytics {
    static track(event, properties = {}) {
        const payload = {
            event,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href,
            ...properties
        };
        
        // Send to backend
        fetch('/api/analytics', {
            method: 'POST',
            body: JSON.stringify(payload)
        });
    }
    
    static pageView(pageName) {
        this.track('pageView', { pageName });
    }
    
    static formSubmit(formName, duration) {
        this.track('formSubmit', { formName, duration });
    }
}

// Usage
Analytics.track('user_signup', { plan: 'premium' });
```

---

## Exercises

### Exercise 1: Optimize Slow Component
```javascript
// Identify bottleneck
function Dashboard({ filters }) {
    const [data, setData] = useState([]);
    
    useEffect(() => {
        fetch(`/api/data?filters=${JSON.stringify(filters)}`)
            .then(r => r.json())
            .then(setData);
    }, [filters]);
    
    return (
        <div>
            {data.map(item => (
                <ExpensiveChartComponent key={item.id} data={item} />
            ))}
        </div>
    );
}

// Your solution
```

**Solution:**
```javascript
const Dashboard = React.memo(function Dashboard({ filters }) {
    const [data, setData] = useState([]);
    
    const filterKey = useMemo(() => 
        JSON.stringify(filters),
        [filters]
    );
    
    useEffect(() => {
        fetch(`/api/data?filters=${filterKey}`)
            .then(r => r.json())
            .then(setData);
    }, [filterKey]);
    
    return (
        <div>
            {data.map(item => (
                <React.memo(ExpensiveChartComponent) 
                    key={item.id} 
                    data={item} 
                />
            ))}
        </div>
    );
});
```

### Exercise 2: Analyze Bundle
```bash
# Your analysis task:
# 1. Build the app
# 2. Analyze bundle size
# 3. Identify large libraries
# 4. Create splitting strategy
# 5. Implement changes

npm run build
npx source-map-explorer 'build/**/*.js'
```

### Exercise 3: Setup Monitoring
```javascript
// Setup error tracking and analytics
// 1. Initialize Sentry/DataDog
// 2. Track Web Vitals
// 3. Create custom events
// 4. Setup error boundary
// 5. Test reporting

// Your implementation
```

---

## Interview Questions

**Q1: What's LCP and how to optimize?**
A: Largest Contentful Paint - optimize with lazy loading, images, CDN.

**Q2: How to find slow components?**
A: React Profiler, Chrome DevTools Performance, custom metrics.

**Q3: What's code splitting?**
A: Load code only when needed, reduces initial bundle.

**Q4: How to monitor production?**
A: Use RUM, Web Vitals tracking, error reporting.

**Q5: What's perceived performance?**
A: How fast app feels vs actual speed, use skeletons, spinners, optimistic updates.

---

## Summary

- **Web Vitals:** LCP, INP, CLS are core metrics
- **Profiling:** Use React Profiler and DevTools
- **Bundle:** Analyze size, split code by routes
- **Runtime:** Optimize re-renders, use virtual scrolling
- **Monitoring:** Track errors, analytics, Web Vitals
- **Tools:** Sentry, DataDog, Lighthouse
- **UX:** Show progress, use skeletons, optimistic updates
- **Deployment:** Check all metrics before ship
- **Continuous:** Monitor and improve post-launch
- **Metrics:** Measure everything, data-driven optimization

**Next: Testing at scale & advanced strategies!**
