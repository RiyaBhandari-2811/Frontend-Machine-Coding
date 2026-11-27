# Logging, Monitoring & Observability

## Table of Contents
1. Logging Strategies
2. Performance Monitoring
3. User Analytics
4. Error Tracking
5. Session Replay
6. Dashboards & Alerting
7. Privacy & Compliance
8. Best Practices

---

## 1. Logging Strategies

### Client-side Logging
```javascript
// Log levels
const LOG_LEVELS = {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3
};

class Logger {
    constructor(minLevel = LOG_LEVELS.INFO) {
        this.minLevel = minLevel;
        this.logs = [];
    }
    
    log(level, message, data = {}) {
        if (level < this.minLevel) return;
        
        const entry = {
            timestamp: new Date().toISOString(),
            level: Object.keys(LOG_LEVELS).find(k => LOG_LEVELS[k] === level),
            message,
            data,
            url: window.location.href,
            userAgent: navigator.userAgent
        };
        
        this.logs.push(entry);
        
        // Send to backend if error or warn
        if (level >= LOG_LEVELS.WARN) {
            this.send(entry);
        }
    }
    
    debug(msg, data) { this.log(LOG_LEVELS.DEBUG, msg, data); }
    info(msg, data) { this.log(LOG_LEVELS.INFO, msg, data); }
    warn(msg, data) { this.log(LOG_LEVELS.WARN, msg, data); }
    error(msg, data) { this.log(LOG_LEVELS.ERROR, msg, data); }
    
    send(entry) {
        navigator.sendBeacon('/api/logs', JSON.stringify(entry));
    }
}

const logger = new Logger(LOG_LEVELS.INFO);

// Usage
logger.info('User logged in', { userId: 123 });
logger.error('API call failed', { endpoint: '/api/users', status: 500 });
```

### Structured Logging
```javascript
// Log with context
function logAction(action, metadata) {
    console.log({
        timestamp: new Date().toISOString(),
        action,
        metadata,
        userId: getCurrentUserId(),
        sessionId: getSessionId(),
        url: window.location.href
    });
}

// Usage
logAction('USER_LOGIN', { userId: 123 });
logAction('PURCHASE_COMPLETE', {
    orderId: 'ORD123',
    amount: 99.99,
    items: 3
});
```

---

## 2. Performance Monitoring

### Web Vitals
```javascript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

// Send to monitoring service
function sendMetricToAnalytics(metric) {
    // Google Analytics
    if (window.gtag) {
        window.gtag.event(metric.name, {
            event_category: 'Web Vitals',
            value: Math.round(metric.value),
            event_label: metric.id,
            non_interaction: true
        });
    }
    
    // Custom backend
    fetch('/api/metrics', {
        method: 'POST',
        body: JSON.stringify(metric)
    });
}

// Track all metrics
getCLS(sendMetricToAnalytics);
getFID(sendMetricToAnalytics);
getFCP(sendMetricToAnalytics);
getLCP(sendMetricToAnalytics);
getTTFB(sendMetricToAnalytics);
```

### Custom Performance Marks
```javascript
// Mark start of operation
performance.mark('api-call-start');

// Do operation
await fetch('/api/users');

// Mark end
performance.mark('api-call-end');

// Measure
performance.measure('api-call', 'api-call-start', 'api-call-end');

// Get duration
const measure = performance.getEntriesByName('api-call')[0];
console.log(`API call took ${measure.duration}ms`);

// Send to monitoring
logger.info('API call performance', {
    duration: measure.duration,
    endpoint: '/api/users'
});
```

---

## 3. User Analytics

### Track User Actions
```javascript
class Analytics {
    trackPageView(pageName) {
        this.send('page_view', {
            page: pageName,
            url: window.location.href,
            referrer: document.referrer
        });
    }
    
    trackEvent(eventName, properties = {}) {
        this.send('event', {
            name: eventName,
            properties,
            timestamp: new Date().toISOString()
        });
    }
    
    trackConversion(value, currency = 'USD') {
        this.send('conversion', {
            value,
            currency,
            timestamp: new Date().toISOString()
        });
    }
    
    send(type, data) {
        fetch('/api/analytics', {
            method: 'POST',
            body: JSON.stringify({
                type,
                data,
                userId: this.getUserId(),
                sessionId: this.getSessionId()
            })
        });
    }
    
    getUserId() {
        return localStorage.getItem('userId');
    }
    
    getSessionId() {
        return sessionStorage.getItem('sessionId');
    }
}

const analytics = new Analytics();

// Usage
analytics.trackPageView('home');
analytics.trackEvent('button_clicked', { buttonId: 'signup' });
analytics.trackConversion(99.99);
```

### Funnel Analysis
```javascript
// Track user journey
function useFunnelTracking(steps) {
    useEffect(() => {
        const incomplete = steps.find(s => !s.completed);
        if (!incomplete) {
            analytics.trackEvent('funnel_complete', {
                funnel: 'checkout',
                steps: steps.length
            });
        } else {
            analytics.trackEvent('funnel_drop', {
                funnel: 'checkout',
                step: incomplete.name,
                step_number: steps.indexOf(incomplete) + 1
            });
        }
    }, [steps]);
}

// Usage
<FunnelTracking steps={[
    { name: 'cart', completed: true },
    { name: 'shipping', completed: true },
    { name: 'payment', completed: false }
]} />
```

---

## 4. Error Tracking

### Error Reporting
```javascript
class ErrorTracker {
    captureException(error, context = {}) {
        const errorData = {
            message: error.message,
            stack: error.stack,
            type: error.name,
            context,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };
        
        this.send(errorData);
    }
    
    send(errorData) {
        // Use fetch (not sendBeacon for important data)
        fetch('/api/errors', {
            method: 'POST',
            body: JSON.stringify(errorData),
            keepalive: true
        });
    }
}

const errorTracker = new ErrorTracker();

// Global error handler
window.addEventListener('error', (event) => {
    errorTracker.captureException(event.error, {
        type: 'uncaught'
    });
});

window.addEventListener('unhandledrejection', (event) => {
    errorTracker.captureException(
        event.reason,
        { type: 'unhandled-rejection' }
    );
});
```

---

## 5. Session Replay

### Recording User Sessions
```javascript
// Using third-party service like Hotjar, LogRocket

import { useEffect } from 'react';

function useSessionRecording() {
    useEffect(() => {
        // Initialize session recording
        if (window.LogRocket) {
            window.LogRocket.init('app-id');
            
            // Set user context
            window.LogRocket.identify(userId, {
                name: userName,
                email: userEmail
            });
        }
    }, [userId]);
}

// Or implement basic recording
class SessionRecorder {
    constructor() {
        this.events = [];
        this.startTime = Date.now();
        
        this.recordInteractions();
    }
    
    recordInteractions() {
        // Record clicks
        document.addEventListener('click', (e) => {
            this.addEvent('click', {
                selector: this.getSelector(e.target),
                x: e.clientX,
                y: e.clientY
            });
        });
        
        // Record input changes
        document.addEventListener('input', (e) => {
            this.addEvent('input', {
                selector: this.getSelector(e.target),
                value: e.target.value.length  // Don't log actual value
            });
        });
        
        // Record scroll
        window.addEventListener('scroll', () => {
            this.addEvent('scroll', {
                x: window.scrollX,
                y: window.scrollY
            });
        });
    }
    
    addEvent(type, data) {
        this.events.push({
            type,
            data,
            timestamp: Date.now() - this.startTime
        });
    }
    
    getSelector(element) {
        // Return CSS selector for element
        return element.tagName.toLowerCase();
    }
}
```

---

## 6. Dashboards & Alerting

### Metrics Dashboard
```
Dashboard tracks:
- Page load time (FCP, LCP)
- User interactions (FID)
- Stability (CLS)
- Error rate
- API response times
- User engagement
- Conversion funnels
```

### Alert Rules
```
Alert when:
- Error rate > 5%
- API response time > 2000ms
- Page load time > 3000ms
- Availability < 99%
- Unusual traffic spike
```

---

## 7. Privacy & Compliance

### GDPR Compliance
```javascript
// Ask for consent before tracking
function useAnalyticsConsent() {
    const [hasConsent, setHasConsent] = useState(false);
    
    useEffect(() => {
        const consent = localStorage.getItem('analytics-consent');
        setHasConsent(consent === 'yes');
    }, []);
    
    const handleConsent = (value) => {
        localStorage.setItem('analytics-consent', value ? 'yes' : 'no');
        setHasConsent(value);
    };
    
    return { hasConsent, handleConsent };
}

// Only track if user consents
function trackEvent(eventName) {
    const { hasConsent } = useAnalyticsConsent();
    
    if (hasConsent) {
        analytics.trackEvent(eventName);
    }
}
```

### PII Protection
```javascript
// Don't log sensitive data
class SecureLogger {
    log(message, data) {
        // Remove PII before logging
        const sanitized = this.sanitizeData(data);
        console.log(message, sanitized);
    }
    
    sanitizeizeData(data) {
        const piiFields = ['password', 'email', 'phone', 'ssn', 'credit_card'];
        
        return Object.keys(data).reduce((acc, key) => {
            if (piiFields.includes(key)) {
                acc[key] = '***REDACTED***';
            } else {
                acc[key] = data[key];
            }
            return acc;
        }, {});
    }
}
```

---

## 8. Best Practices

### Monitoring Checklist
```
✓ Track page views and user journeys
✓ Monitor web vitals (LCP, FID, CLS)
✓ Track errors and exceptions
✓ Measure API response times
✓ Monitor memory usage
✓ Track conversion funnels
✓ Capture user interactions
✓ Record session replays for errors
✓ Set up alerting for anomalies
✓ Respect user privacy
✓ Implement GDPR compliance
✓ Don't log PII
```

---

## Exercises

### Exercise 1: Custom Logger
```javascript
// Create logger with:
// - Multiple log levels
// - Send errors to backend
// - Batch logs

class Logger {
    // Your code
}
```

**Solution:**
```javascript
class Logger {
    constructor() {
        this.logs = [];
        this.batch = [];
    }
    
    log(level, message, data) {
        const entry = {
            level,
            message,
            data,
            timestamp: new Date().toISOString()
        };
        
        this.logs.push(entry);
        this.batch.push(entry);
        
        if (this.batch.length >= 10) {
            this.flush();
        }
    }
    
    flush() {
        fetch('/api/logs', {
            method: 'POST',
            body: JSON.stringify(this.batch)
        });
        this.batch = [];
    }
}
```

### Exercise 2: Web Vitals Tracking
```javascript
// Send all web vitals to backend
// Track performance improvement

// Your code
```

**Solution:**
```javascript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function trackWebVitals() {
    [getCLS, getFID, getFCP, getLCP, getTTFB].forEach(metric => {
        metric(m => {
            fetch('/api/vitals', {
                method: 'POST',
                body: JSON.stringify(m)
            });
        });
    });
}

trackWebVitals();
```

### Exercise 3: Analytics Tracking
```javascript
// Track user actions:
// - Page views
// - Button clicks
// - Form submissions

// Your code
```

**Solution:**
```javascript
class Analytics {
    trackPageView(pageName) {
        fetch('/api/analytics', {
            method: 'POST',
            body: JSON.stringify({
                type: 'page_view',
                page: pageName
            })
        });
    }
    
    trackEvent(eventName, data) {
        fetch('/api/analytics', {
            method: 'POST',
            body: JSON.stringify({
                type: 'event',
                name: eventName,
                data
            })
        });
    }
}

// Usage
analytics.trackPageView('home');
document.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
        analytics.trackEvent('button_click', {
            buttonId: e.target.id
        });
    }
});
```

---

## Interview Questions

### Theoretical Questions

**Q1: What is observability?**
A: Ability to understand system state from outputs.

**Q2: What are web vitals?**
A: Google's metrics for user experience.

**Q3: When to log errors vs analytics?**
A: Errors to backend, analytics for dashboards.

**Q4: How to avoid PII leaks?**
A: Sanitize data before logging.

**Q5: What is session replay?**
A: Recording user interactions for debugging.

---

## Summary

- **Logging:** Track application events
- **Levels:** DEBUG, INFO, WARN, ERROR
- **Performance:** Monitor Web Vitals
- **Analytics:** Track user actions
- **Errors:** Capture and send to backend
- **Session Replay:** Record user interactions
- **Privacy:** Ask for consent, sanitize data
- **Alerts:** Trigger on thresholds
- **Dashboards:** Visualize metrics
- **Compliance:** Follow GDPR/privacy laws

**Next:** CI/CD & deployment!
