# Advanced Error Handling Strategies

## Table of Contents
1. Error Types & Classification
2. Error Boundaries
3. User-Facing Error Messages
4. Logging & Monitoring
5. Recovery Strategies
6. Global Error Handlers
7. Testing Error Scenarios
8. Best Practices

---

## 1. Error Types & Classification

### Error Categories
```javascript
// User Errors - User's fault (validation, etc.)
class ValidationError extends Error {
    constructor(message, field) {
        super(message);
        this.name = 'ValidationError';
        this.field = field;
        this.isUserError = true;
    }
}

// System Errors - Server/network issue
class SystemError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = 'SystemError';
        this.statusCode = statusCode;
        this.isUserError = false;
    }
}

// Permission Errors
class PermissionError extends Error {
    constructor(message) {
        super(message);
        this.name = 'PermissionError';
        this.isUserError = false;
    }
}

// Not Found Errors
class NotFoundError extends Error {
    constructor(resource) {
        super(`${resource} not found`);
        this.name = 'NotFoundError';
        this.resource = resource;
    }
}

// Usage
function getUser(userId) {
    if (!userId) {
        throw new ValidationError('User ID is required', 'userId');
    }
    
    return fetch(`/api/users/${userId}`)
        .then(r => {
            if (r.status === 404) {
                throw new NotFoundError('User');
            }
            if (r.status === 403) {
                throw new PermissionError('Access denied');
            }
            if (!r.ok) {
                throw new SystemError('Server error', r.status);
            }
            return r.json();
        });
}
```

---

## 2. Error Boundaries

### Basic Error Boundary
```javascript
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }
    
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    
    componentDidCatch(error, errorInfo) {
        // Log to error tracking service
        console.error('Error caught:', error, errorInfo);
    }
    
    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };
    
    render() {
        if (this.state.hasError) {
            return (
                <div className="error-container">
                    <h1>Something went wrong</h1>
                    <p>{this.state.error?.message}</p>
                    <button onClick={this.handleReset}>Try again</button>
                </div>
            );
        }
        
        return this.props.children;
    }
}

// Usage
<ErrorBoundary>
    <App />
</ErrorBoundary>
```

### Advanced Error Boundary
```javascript
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorCount: 0,
            lastErrorTime: null
        };
    }
    
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    
    componentDidCatch(error, errorInfo) {
        const now = Date.now();
        
        // Track error frequency
        if (this.state.lastErrorTime && now - this.state.lastErrorTime < 1000) {
            // Multiple errors in quick succession
            this.setState(prev => ({
                errorCount: prev.errorCount + 1
            }));
            
            if (this.state.errorCount > 5) {
                // Too many errors, need page reload
                window.location.reload();
            }
        }
        
        // Log to error tracking service
        this.logError(error, errorInfo);
        
        this.setState({ lastErrorTime: now });
    }
    
    logError = (error, errorInfo) => {
        // Send to Sentry, DataDog, etc.
        fetch('/api/errors', {
            method: 'POST',
            body: JSON.stringify({
                message: error.message,
                stack: error.stack,
                componentStack: errorInfo.componentStack,
                userAgent: navigator.userAgent
            })
        });
    };
    
    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorCount: 0
        });
    };
    
    render() {
        if (this.state.hasError) {
            return (
                <div className="error-screen">
                    <h1>Oops! Something went wrong</h1>
                    <p>{this.state.error?.message}</p>
                    <button onClick={this.handleReset}>Reset</button>
                    <button onClick={() => window.location.href = '/'}>
                        Go Home
                    </button>
                </div>
            );
        }
        
        return this.props.children;
    }
}
```

---

## 3. User-Facing Error Messages

### Error Display Strategy
```javascript
// ✗ WRONG - Technical error messages
<div>{error.message}</div>  {/* "TypeError: Cannot read property 'name' of undefined" */}

// ✓ CORRECT - User-friendly messages
function getErrorMessage(error) {
    if (error instanceof ValidationError) {
        return `Please fix: ${error.message}`;
    }
    
    if (error instanceof NotFoundError) {
        return `The ${error.resource} you're looking for doesn't exist.`;
    }
    
    if (error instanceof PermissionError) {
        return "You don't have permission to access this.";
    }
    
    if (error instanceof SystemError) {
        if (error.statusCode === 500) {
            return 'Server error. Please try again later.';
        }
        return 'Network error. Please check your connection.';
    }
    
    return 'An unexpected error occurred.';
}

// Usage
function Component() {
    const [error, setError] = useState(null);
    
    return (
        <div>
            {error && (
                <div className="error-message" role="alert">
                    {getErrorMessage(error)}
                </div>
            )}
        </div>
    );
}
```

### Form-level Errors
```javascript
function Form() {
    const [errors, setErrors] = useState({});
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            await submitForm(formData);
        } catch (error) {
            if (error instanceof ValidationError) {
                // Field-specific error
                setErrors(prev => ({
                    ...prev,
                    [error.field]: error.message
                }));
            } else {
                // General error
                setErrors({ general: getErrorMessage(error) });
            }
        }
    };
    
    return (
        <form onSubmit={handleSubmit}>
            {errors.general && <div className="error">{errors.general}</div>}
            <div>
                <input name="email" />
                {errors.email && <span className="error">{errors.email}</span>}
            </div>
        </form>
    );
}
```

---

## 4. Logging & Monitoring

### Centralized Logging
```javascript
// Create logger service
class Logger {
    log(level, message, context = {}) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            level,
            message,
            context,
            userAgent: navigator.userAgent,
            url: window.location.href
        };
        
        console.log(logEntry);
        
        // Send to backend
        if (level === 'error' || level === 'warn') {
            this.sendToBackend(logEntry);
        }
    }
    
    error(message, context) {
        this.log('error', message, context);
    }
    
    warn(message, context) {
        this.log('warn', message, context);
    }
    
    info(message, context) {
        this.log('info', message, context);
    }
    
    sendToBackend(logEntry) {
        navigator.sendBeacon(
            '/api/logs',
            JSON.stringify(logEntry)
        );
    }
}

const logger = new Logger();

// Usage
try {
    await fetchUser();
} catch (error) {
    logger.error('Failed to fetch user', {
        userId: 123,
        error: error.message
    });
}
```

### Error Tracking Service (Sentry)
```javascript
import * as Sentry from "@sentry/react";

// Initialize
Sentry.init({
    dsn: "https://...@sentry.io/...",
    tracesSampleRate: 1.0,
    environment: process.env.NODE_ENV
});

// Catch errors
function Component() {
    const handleError = (error) => {
        Sentry.captureException(error, {
            tags: {
                component: 'UserProfile'
            },
            extra: {
                userId: user.id
            }
        });
    };
    
    return (
        <div>
            {/* Component */}
        </div>
    );
}

// Automatic error boundary
export default Sentry.withErrorBoundary(App, {
    fallback: <div>An error has occurred</div>,
    showDialog: true
});
```

---

## 5. Recovery Strategies

### Automatic Retry
```javascript
async function retryWithBackoff(fn, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            
            const delay = Math.pow(2, i) * 1000;
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

// Usage in hook
function useFetch(url) {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        retryWithBackoff(() =>
            fetch(url).then(r => r.json())
        )
            .then(setData)
            .catch(setError);
    }, [url]);
    
    return { data, error };
}
```

### Fallback Data
```javascript
function useUserWithFallback(userId) {
    const [user, setUser] = useState(null);
    
    useEffect(() => {
        fetch(`/api/users/${userId}`)
            .then(r => r.json())
            .then(setUser)
            .catch(() => {
                // Use cached/fallback data
                const cached = localStorage.getItem(`user-${userId}`);
                if (cached) {
                    setUser(JSON.parse(cached));
                }
            });
    }, [userId]);
    
    return user;
}
```

---

## 6. Global Error Handlers

### Window Error Handler
```javascript
// Catch unhandled errors
window.addEventListener('error', (event) => {
    console.error('Uncaught error:', event.error);
    
    // Log to backend
    fetch('/api/errors', {
        method: 'POST',
        body: JSON.stringify({
            message: event.message,
            stack: event.error?.stack,
            type: 'uncaught'
        })
    });
});

// Catch unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    
    // Log to backend
    fetch('/api/errors', {
        method: 'POST',
        body: JSON.stringify({
            message: event.reason?.message,
            stack: event.reason?.stack,
            type: 'unhandled-rejection'
        })
    });
});
```

---

## 7. Testing Error Scenarios

### Testing Error Boundary
```javascript
test('ErrorBoundary catches errors', () => {
    const ThrowError = () => {
        throw new Error('Test error');
    };
    
    expect(() => {
        render(
            <ErrorBoundary>
                <ThrowError />
            </ErrorBoundary>
        );
    }).toThrow();
});

test('ErrorBoundary displays fallback UI', () => {
    const ThrowError = () => {
        throw new Error('Test error');
    };
    
    const { container } = render(
        <ErrorBoundary>
            <ThrowError />
        </ErrorBoundary>
    );
    
    expect(container.textContent).toContain('Something went wrong');
});
```

### Testing Error Handling
```javascript
test('useAsync handles errors', async () => {
    const mockFn = jest.fn().mockRejectedValue(new Error('API error'));
    
    const { result, waitForNextUpdate } = renderHook(() =>
        useAsync(mockFn)
    );
    
    await waitForNextUpdate();
    
    expect(result.current.error).toEqual(expect.any(Error));
    expect(result.current.status).toBe('error');
});
```

---

## Exercises

### Exercise 1: Custom Error Class
```javascript
// Create ApiError class with:
// - Status code
// - Error code
// - Validation errors

class ApiError extends Error {
    // Your code
}
```

**Solution:**
```javascript
class ApiError extends Error {
    constructor(statusCode, errorCode, message, validationErrors = {}) {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.validationErrors = validationErrors;
        this.name = 'ApiError';
    }
}
```

### Exercise 2: Error Message Helper
```javascript
// Create function that maps error types to user messages

function getUserFriendlyMessage(error) {
    // Your code
}
```

**Solution:**
```javascript
function getUserFriendlyMessage(error) {
    if (error instanceof ValidationError) {
        return `Please fix: ${error.message}`;
    }
    if (error instanceof ApiError) {
        if (error.statusCode === 404) return 'Not found';
        if (error.statusCode === 500) return 'Server error';
    }
    return 'An error occurred';
}
```

### Exercise 3: Global Error Handler
```javascript
// Set up handlers for:
// - Uncaught errors
// - Unhandled rejections
// - Log to backend

// Your code
```

**Solution:**
```javascript
window.addEventListener('error', (e) => {
    fetch('/api/errors', {
        method: 'POST',
        body: JSON.stringify({
            message: e.message,
            stack: e.error?.stack,
            type: 'error'
        })
    });
});

window.addEventListener('unhandledrejection', (e) => {
    fetch('/api/errors', {
        method: 'POST',
        body: JSON.stringify({
            message: e.reason?.message,
            type: 'rejection'
        })
    });
});
```

---

## Interview Questions

### Theoretical Questions

**Q1: What is error boundary?**
A: React component catching errors in child tree.

**Q2: When to show user errors?**
A: Always for user errors, never technical details.

**Q3: How to track errors?**
A: Use Sentry or similar error tracking service.

**Q4: What errors can't boundary catch?**
A: Event handlers, async code, server rendering.

**Q5: How to retry failed requests?**
A: Exponential backoff pattern.

---

## Summary

- **Error Types:** Classify as user, system, permission
- **Error Boundaries:** Catch render errors
- **User Messages:** Never show technical details
- **Logging:** Send to backend for monitoring
- **Recovery:** Retry with backoff, fallback data
- **Global Handlers:** Catch unhandled errors
- **Testing:** Test error scenarios
- **Monitoring:** Use Sentry or similar
- **User Experience:** Show helpful messages
- **Debugging:** Log context for investigation

**Next:** Logging & monitoring!
