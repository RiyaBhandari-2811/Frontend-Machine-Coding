# Middleware, Side Effects & Advanced Effects

## Table of Contents
1. Middleware Patterns
2. Advanced Side Effects
3. Redux Middleware
4. Custom Middleware
5. Effect Orchestration
6. Async Patterns
7. Race Conditions & Cancellation
8. Testing Side Effects

---

## 1. Middleware Patterns

### Redux Middleware Basics
```javascript
// Middleware = intercept actions before they reach reducer

// Logger middleware
const loggerMiddleware = (store) => (next) => (action) => {
    console.log('dispatching', action);
    const result = next(action);
    console.log('next state', store.getState());
    return result;
};

// Add to store
const store = createStore(
    rootReducer,
    applyMiddleware(loggerMiddleware)
);

// Redux Thunk - Handle async actions
const thunk = (store) => (next) => (action) => {
    if (typeof action === 'function') {
        return action(store.dispatch, store.getState);
    }
    return next(action);
};

// Usage
export const fetchUser = (userId) => async (dispatch, getState) => {
    dispatch({ type: 'FETCH_START' });
    try {
        const user = await fetch(`/api/users/${userId}`).then(r => r.json());
        dispatch({ type: 'FETCH_SUCCESS', payload: user });
    } catch (error) {
        dispatch({ type: 'FETCH_ERROR', payload: error });
    }
};
```

### Middleware Composition
```javascript
// Combine multiple middleware
const store = createStore(
    rootReducer,
    applyMiddleware(
        loggerMiddleware,
        thunk,
        analyticsMiddleware,
        errorMiddleware
    )
);

// Error middleware
const errorMiddleware = (store) => (next) => (action) => {
    try {
        return next(action);
    } catch (error) {
        console.error('Error:', error);
        store.dispatch({ type: 'ERROR', payload: error });
        throw error;
    }
};

// Analytics middleware
const analyticsMiddleware = (store) => (next) => (action) => {
    // Track action
    analytics.track('action', {
        type: action.type,
        timestamp: Date.now()
    });
    return next(action);
};
```

---

## 2. Advanced Side Effects

### useEffect Patterns
```javascript
// ✗ WRONG - Multiple concerns in one effect
useEffect(() => {
    // Fetch data
    fetch(url).then(setData);
    
    // Setup event listener
    window.addEventListener('resize', handleResize);
    
    // Track analytics
    analytics.track('view');
    
    // Return cleanup
    return () => {
        window.removeEventListener('resize', handleResize);
    };
}, [url]);

// ✓ CORRECT - Separate concerns
// Effect 1: Fetch data
useEffect(() => {
    fetch(url).then(setData);
}, [url]);

// Effect 2: Setup event listener
useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
}, []);

// Effect 3: Track analytics
useEffect(() => {
    analytics.track('view');
}, []);
```

### Conditional Effects
```javascript
// Skip effect based on condition
useEffect(() => {
    if (!userId) return;  // Don't run if no userId
    
    fetch(`/api/users/${userId}`).then(setUser);
}, [userId]);

// Multiple conditions
useEffect(() => {
    if (!isLoggedIn || !hasPremium) return;
    
    fetchPremiumContent();
}, [isLoggedIn, hasPremium]);

// Effect that runs conditionally
function Component({ shouldFetch }) {
    useEffect(() => {
        if (!shouldFetch) return;
        
        const controller = new AbortController();
        fetch(url, { signal: controller.signal }).then(setData);
        
        return () => controller.abort();
    }, [shouldFetch, url]);
}
```

---

## 3. Redux Middleware

### Redux Saga (Complex Async)
```javascript
import { createSlice, configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { call, put, takeEvery, select } from 'redux-saga/effects';

// Saga = worker function
function* fetchUserSaga(action) {
    try {
        const user = yield call(() =>
            fetch(`/api/users/${action.payload}`).then(r => r.json())
        );
        yield put(userFetched(user));
    } catch (error) {
        yield put(userFetchFailed(error));
    }
}

// Watch saga
function* watchFetchUser() {
    yield takeEvery('user/fetchRequested', fetchUserSaga);
}

// Setup middleware
const sagaMiddleware = createSagaMiddleware();
const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(sagaMiddleware)
});

sagaMiddleware.run(watchFetchUser);
```

### Redux Observable (RxJS)
```javascript
import { Epic, ofType } from 'redux-observable';
import { mergeMap, map, catchError } from 'rxjs/operators';

// Epic = observable stream
const fetchUserEpic: Epic = (action$, state$) =>
    action$.pipe(
        ofType('user/fetchRequested'),
        mergeMap(action =>
            fetch(`/api/users/${action.payload}`)
                .then(r => r.json())
                .then(user => ({ type: 'user/fetched', payload: user }))
                .catch(error => ({ type: 'user/failed', payload: error }))
        )
    );

// Combine epics
const rootEpic = combineEpics(fetchUserEpic, otherEpic);

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(createEpicMiddleware(rootEpic))
});
```

---

## 4. Custom Middleware

### Create Custom Middleware
```javascript
// Debounce middleware
const debounceMiddleware = (store) => {
    const debounced = {};
    
    return (next) => (action) => {
        if (action.type === 'SEARCH') {
            clearTimeout(debounced['search']);
            debounced['search'] = setTimeout(() => {
                next(action);
            }, 300);
        } else {
            next(action);
        }
    };
};

// Validation middleware
const validateMiddleware = (store) => (next) => (action) => {
    // Validate action
    if (!action.type || !action.type.length) {
        console.error('Invalid action');
        return;
    }
    next(action);
};

// Persistence middleware
const persistenceMiddleware = (store) => (next) => (action) => {
    const result = next(action);
    
    // Save to localStorage
    if (action.type.startsWith('USER_')) {
        const state = store.getState();
        localStorage.setItem('appState', JSON.stringify(state.user));
    }
    
    return result;
};

// Create Redux enhancer
const enhancer = compose(
    applyMiddleware(
        debounceMiddleware,
        validateMiddleware,
        persistenceMiddleware,
        thunk
    ),
    window.__REDUX_DEVTOOLS_EXTENSION__ || (f => f)
);

const store = createStore(rootReducer, enhancer);
```

---

## 5. Effect Orchestration

### Coordinating Multiple Effects
```javascript
// Load user, then posts, then comments
function Component({ userId }) {
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const [comments, setComments] = useState([]);
    
    // Effect 1: Load user
    useEffect(() => {
        fetch(`/api/users/${userId}`)
            .then(r => r.json())
            .then(setUser);
    }, [userId]);
    
    // Effect 2: Load posts (depends on user)
    useEffect(() => {
        if (!user) return;
        
        fetch(`/api/users/${user.id}/posts`)
            .then(r => r.json())
            .then(setPosts);
    }, [user]);
    
    // Effect 3: Load comments (depends on posts)
    useEffect(() => {
        if (posts.length === 0) return;
        
        const postIds = posts.map(p => p.id).join(',');
        fetch(`/api/comments?posts=${postIds}`)
            .then(r => r.json())
            .then(setComments);
    }, [posts]);
}

// Or use custom hook
function useCascadingData(userId) {
    const [data, setData] = useState({
        user: null,
        posts: [],
        comments: []
    });
    
    useEffect(() => {
        let mounted = true;
        
        const load = async () => {
            const user = await fetch(`/api/users/${userId}`).then(r => r.json());
            if (!mounted) return;
            
            const posts = await fetch(`/api/users/${user.id}/posts`).then(r => r.json());
            if (!mounted) return;
            
            const comments = await fetch(`/api/comments?posts=${posts.map(p => p.id).join(',')}`).then(r => r.json());
            if (!mounted) return;
            
            setData({ user, posts, comments });
        };
        
        load();
        
        return () => { mounted = false; };
    }, [userId]);
    
    return data;
}
```

---

## 6. Async Patterns

### Promise Handling
```javascript
// ✗ WRONG - Swallowing error
useEffect(() => {
    fetch(url).then(r => r.json()).then(setData);  // No error handling!
}, [url]);

// ✓ CORRECT - Handle errors
useEffect(() => {
    fetch(url)
        .then(r => {
            if (!r.ok) throw new Error('Failed');
            return r.json();
        })
        .then(setData)
        .catch(e => {
            console.error(e);
            setError(e.message);
        });
}, [url]);

// Async/await pattern
useEffect(() => {
    const load = async () => {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed');
            const data = await response.json();
            setData(data);
        } catch (error) {
            setError(error.message);
        }
    };
    
    load();
}, [url]);
```

### Promise.all & Race
```javascript
// Wait for multiple async operations
useEffect(() => {
    const load = async () => {
        try {
            const [users, posts] = await Promise.all([
                fetch('/api/users').then(r => r.json()),
                fetch('/api/posts').then(r => r.json())
            ]);
            setData({ users, posts });
        } catch (error) {
            setError(error);
        }
    };
    
    load();
}, []);

// Race - first to complete
useEffect(() => {
    const load = async () => {
        try {
            const result = await Promise.race([
                fetch(url1).then(r => r.json()),
                fetch(url2).then(r => r.json()),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
            ]);
            setData(result);
        } catch (error) {
            setError(error);
        }
    };
    
    load();
}, [url1, url2]);
```

---

## 7. Race Conditions & Cancellation

### AbortController Pattern
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
    
    // Cleanup - abort fetch if component unmounts or url changes
    return () => controller.abort();
}, [url]);

// Multiple concurrent requests
useEffect(() => {
    const controller = new AbortController();
    
    const load = async () => {
        try {
            const [users, posts] = await Promise.all([
                fetch('/api/users', { signal: controller.signal }).then(r => r.json()),
                fetch('/api/posts', { signal: controller.signal }).then(r => r.json())
            ]);
            setData({ users, posts });
        } catch (error) {
            if (error.name !== 'AbortError') {
                setError(error);
            }
        }
    };
    
    load();
    
    return () => controller.abort();
}, []);
```

### Preventing Stale Data
```javascript
// ✗ WRONG - Race condition
function Component({ id }) {
    const [data, setData] = useState(null);
    
    useEffect(() => {
        fetch(`/api/items/${id}`).then(r => r.json()).then(setData);
    }, [id]);
    
    // If id changes quickly, old request might complete after new one
}

// ✓ CORRECT - Track latest request
function Component({ id }) {
    const [data, setData] = useState(null);
    
    useEffect(() => {
        let isMounted = true;
        
        fetch(`/api/items/${id}`)
            .then(r => r.json())
            .then(d => {
                if (isMounted) setData(d);  // Only update if still mounted
            });
        
        return () => { isMounted = false; };
    }, [id]);
}
```

---

## 8. Testing Side Effects

### Testing useEffect
```javascript
import { renderHook, waitFor } from '@testing-library/react';

test('useEffect fetches data', async () => {
    global.fetch = jest.fn(() =>
        Promise.resolve({ json: () => Promise.resolve({ id: 1 }) })
    );
    
    const { result } = renderHook(() => useFetch('/api/data'));
    
    await waitFor(() => {
        expect(result.current.data).toEqual({ id: 1 });
    });
});

// Test cleanup
test('useEffect cleanup called', async () => {
    const cleanup = jest.fn();
    
    renderHook(() => {
        useEffect(() => {
            return cleanup;
        }, []);
    });
    
    // Unmount
    // cleanup is called
});

// Mock timers
test('debounce works', async () => {
    jest.useFakeTimers();
    
    const { result } = renderHook(() => useDebounce('test', 300));
    
    expect(result.current).toBe(undefined);
    
    jest.advanceTimersByTime(300);
    
    expect(result.current).toBe('test');
});
```

---

## Exercises

### Exercise 1: Custom Thunk
```javascript
// Create thunk that:
// - Fetches data
// - Dispatches loading, success, error actions

function fetchData(url) {
    // Your code
}
```

**Solution:**
```javascript
function fetchData(url) {
    return async (dispatch) => {
        dispatch({ type: 'FETCH_START' });
        try {
            const data = await fetch(url).then(r => r.json());
            dispatch({ type: 'FETCH_SUCCESS', payload: data });
        } catch (error) {
            dispatch({ type: 'FETCH_ERROR', payload: error });
        }
    };
}
```

### Exercise 2: Cascading Effects
```javascript
// Create form that:
// - Loads countries
// - Loads states based on country
// - Loads cities based on state

function LocationForm() {
    // Your code
}
```

**Solution:**
```javascript
function LocationForm() {
    const [country, setCountry] = useState(null);
    const [state, setState] = useState(null);
    const [countries, setCountries] = useState([]);
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    
    useEffect(() => {
        fetch('/api/countries').then(r => r.json()).then(setCountries);
    }, []);
    
    useEffect(() => {
        if (!country) return;
        fetch(`/api/countries/${country.id}/states`).then(r => r.json()).then(setStates);
    }, [country]);
    
    useEffect(() => {
        if (!state) return;
        fetch(`/api/states/${state.id}/cities`).then(r => r.json()).then(setCities);
    }, [state]);
    
    return (
        <form>
            <select value={country?.id} onChange={e => setCountry(countries.find(c => c.id == e.target.value))}>
                {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
        </form>
    );
}
```

### Exercise 3: Abort Controller
```javascript
// Create fetch hook with cancellation
// Cancel if component unmounts or params change

function useFetch(url) {
    // Your code
}
```

**Solution:**
```javascript
function useFetch(url) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const controller = new AbortController();
        setLoading(true);
        
        fetch(url, { signal: controller.signal })
            .then(r => r.json())
            .then(setData)
            .catch(e => {
                if (e.name !== 'AbortError') {
                    setError(e);
                }
            })
            .finally(() => setLoading(false));
        
        return () => controller.abort();
    }, [url]);
    
    return { data, loading, error };
}
```

---

## Interview Questions

### Theoretical Questions

**Q1: What is middleware?**
A: Function that intercepts actions before reducer.

**Q2: When to use Redux Thunk?**
A: For simple async actions.

**Q3: When to use Redux Saga?**
A: For complex async workflows.

**Q4: What is race condition?**
A: When results depend on timing of events.

**Q5: How to prevent stale data?**
A: Check if mounted before setState.

---

## Code-Based Interview Questions

**Q1: What is wrong?**
```javascript
useEffect(() => {
    fetch(url).then(setData);
}, []);
// Issue if url changes?
```
A: Won't refetch on url change, missing dependency

**Q2: Predict:**
```javascript
useEffect(() => {
    const timer = setTimeout(() => {
        setCount(c => c + 1);
    }, 1000);
}, []);
// Cleanup needed?
```
A: Yes, need to clearTimeout in cleanup

**Q3: What happens?**
```javascript
let isMounted = true;
useEffect(() => {
    setData();
    return () => { isMounted = false; };
}, []);
// Race condition fixed?
```
A: Yes, checks isMounted before setState

**Q4: Spot the issue:**
```javascript
const controller = new AbortController();
fetch(url, { signal: controller.signal });
// Cleanup?
```
A: Need to call controller.abort() in cleanup

**Q5: What is output?**
```javascript
yield call(fetch, url);
// What is this?
```
A: Redux Saga effect, calls fetch

---

## Summary

- **Middleware:** Intercept actions
- **Thunk:** Simple async
- **Saga:** Complex workflows
- **Observable:** RxJS streams
- **Multiple Effects:** Separate concerns
- **Race Conditions:** Use AbortController or isMounted flag
- **Cascading:** Coordinate dependent effects
- **Testing:** Mock fetch, use waitFor
- **Cleanup:** Always cleanup timers, listeners, requests
- **Error Handling:** Always catch errors

**Next:** Render optimization strategies!
