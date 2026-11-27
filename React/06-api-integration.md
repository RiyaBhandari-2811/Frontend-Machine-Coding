# React API Integration & Error Handling

## Table of Contents
1. Fetch API Basics
2. useEffect with API Calls
3. Error Handling
4. Loading States
5. Request Cancellation
6. Interceptors & Middleware
7. API Wrapper Functions
8. Best Practices

---

## 1. Fetch API Basics

### Basic Fetch
```javascript
// GET request
fetch('https://api.example.com/users')
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));

// POST request
fetch('https://api.example.com/users', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name: 'John' })
})
    .then(response => response.json())
    .then(data => console.log(data));

// PUT request
fetch('https://api.example.com/users/1', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Jane' })
});

// DELETE request
fetch('https://api.example.com/users/1', {
    method: 'DELETE'
});
```

### Request Options
```javascript
const options = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer token123'
    },
    body: JSON.stringify({ key: 'value' }),
    mode: 'cors',           // Allow cross-origin
    credentials: 'include', // Include cookies
    cache: 'no-cache'       // Don't cache
};

fetch('https://api.example.com/data', options);
```

---

## 2. useEffect with API Calls

### Basic Data Fetching
```javascript
import { useEffect, useState } from 'react';

function UserList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        setLoading(true);
        
        fetch('https://api.example.com/users')
            .then(response => response.json())
            .then(data => {
                setUsers(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []);
    
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    
    return (
        <ul>
            {users.map(user => <li key={user.id}>{user.name}</li>)}
        </ul>
    );
}
```

### Async/Await Pattern
```javascript
function UserList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const response = await fetch('https://api.example.com/users');
                if (!response.ok) throw new Error('Failed to fetch');
                const data = await response.json();
                setUsers(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        
        fetchUsers();
    }, []);
    
    return (
        <div>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            {!loading && !error && (
                <ul>
                    {users.map(user => <li key={user.id}>{user.name}</li>)}
                </ul>
            )}
        </div>
    );
}
```

### Dependent Requests
```javascript
function UserProfile({ userId }) {
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    
    // Fetch user data
    useEffect(() => {
        fetch(`https://api.example.com/users/${userId}`)
            .then(r => r.json())
            .then(setUser);
    }, [userId]);
    
    // Fetch posts when user is loaded
    useEffect(() => {
        if (user) {
            fetch(`https://api.example.com/users/${user.id}/posts`)
                .then(r => r.json())
                .then(setPosts);
        }
    }, [user]);
    
    return (
        <div>
            {user && <h1>{user.name}</h1>}
            {posts.map(post => <p key={post.id}>{post.title}</p>)}
        </div>
    );
}
```

---

## 3. Error Handling

### HTTP Status Codes
```javascript
async function fetchData() {
    try {
        const response = await fetch('https://api.example.com/data');
        
        // Check status codes
        if (response.status === 404) {
            throw new Error('Not found');
        }
        if (response.status === 401) {
            throw new Error('Unauthorized');
        }
        if (response.status === 500) {
            throw new Error('Server error');
        }
        
        // Or use response.ok
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
    }
}
```

### Error Boundary Component
```javascript
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    
    static getDerivedStateFromError(error) {
        return { hasError: true };
    }
    
    componentDidCatch(error, errorInfo) {
        console.error('Error caught:', error, errorInfo);
    }
    
    render() {
        if (this.state.hasError) {
            return <h1>Something went wrong</h1>;
        }
        
        return this.props.children;
    }
}

// Usage
<ErrorBoundary>
    <UserList />
</ErrorBoundary>
```

### Custom Error Handling Hook
```javascript
function useApi(url) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        setLoading(true);
        
        fetch(url)
            .then(r => {
                if (!r.ok) throw new Error(`${r.status} ${r.statusText}`);
                return r.json();
            })
            .then(setData)
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, [url]);
    
    return { data, loading, error };
}

// Usage
function Component() {
    const { data, loading, error } = useApi('https://api.example.com/users');
    
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    
    return <ul>{data.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}
```

---

## 4. Loading States

### Loading Spinner
```javascript
function LoadingSpinner() {
    return (
        <div className="spinner">
            <div className="spin"></div>
            <p>Loading...</p>
        </div>
    );
}

// CSS
/* .spinner {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.spin {
    border: 4px solid #ccc;
    border-top-color: #333;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
} */
```

### Skeleton Loader
```javascript
function SkeletonLoader() {
    return (
        <div>
            <div className="skeleton skeleton-title"></div>
            <div className="skeleton skeleton-text"></div>
            <div className="skeleton skeleton-text"></div>
        </div>
    );
}

// CSS
/* .skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
}

@keyframes loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
} */
```

### Conditional Rendering
```javascript
function UserList() {
    const { data, loading, error } = useApi('/users');
    
    return (
        <div>
            {loading && <LoadingSpinner />}
            {error && <ErrorMessage message={error} />}
            {!loading && !error && data && (
                <ul>
                    {data.map(user => <li key={user.id}>{user.name}</li>)}
                </ul>
            )}
        </div>
    );
}
```

---

## 5. Request Cancellation

### AbortController
```javascript
function SearchUsers() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const abortControllerRef = useRef(null);
    
    useEffect(() => {
        if (!query) return;
        
        // Cancel previous request
        abortControllerRef.current?.abort();
        
        // Create new abort controller
        abortControllerRef.current = new AbortController();
        
        fetch(`/api/search?q=${query}`, {
            signal: abortControllerRef.current.signal
        })
            .then(r => r.json())
            .then(setResults)
            .catch(err => {
                if (err.name !== 'AbortError') {
                    console.error('Search error:', err);
                }
            });
    }, [query]);
    
    return (
        <div>
            <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search..."
            />
            <ul>
                {results.map(r => <li key={r.id}>{r.name}</li>)}
            </ul>
        </div>
    );
}
```

### Cleanup on Unmount
```javascript
function UserList() {
    const [users, setUsers] = useState([]);
    const abortControllerRef = useRef(null);
    
    useEffect(() => {
        abortControllerRef.current = new AbortController();
        
        fetch('/api/users', {
            signal: abortControllerRef.current.signal
        })
            .then(r => r.json())
            .then(setUsers);
        
        return () => {
            abortControllerRef.current.abort();  // Cancel on unmount
        };
    }, []);
    
    return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}
```

---

## 6. Interceptors & Middleware

### Create API Client
```javascript
// api.js
const API_BASE = 'https://api.example.com';

export const api = {
    async request(endpoint, options = {}) {
        const url = `${API_BASE}${endpoint}`;
        
        // Add auth token
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };
        
        const token = localStorage.getItem('token');
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }
        
        const response = await fetch(url, {
            ...options,
            headers
        });
        
        // Handle 401 Unauthorized
        if (response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        
        if (!response.ok) {
            throw new Error(`${response.status} ${response.statusText}`);
        }
        
        return response.json();
    },
    
    get(endpoint) {
        return this.request(endpoint);
    },
    
    post(endpoint, body) {
        return this.request(endpoint, { method: 'POST', body: JSON.stringify(body) });
    },
    
    put(endpoint, body) {
        return this.request(endpoint, { method: 'PUT', body: JSON.stringify(body) });
    },
    
    delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }
};

// Usage
function Component() {
    const [users, setUsers] = useState([]);
    
    useEffect(() => {
        api.get('/users').then(setUsers);
    }, []);
    
    return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}
```

---

## 7. API Wrapper Functions

### Custom Hook for API
```javascript
function useApi(url, options = {}) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        setLoading(true);
        
        api.get(url)
            .then(setData)
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, [url]);
    
    return { data, loading, error };
}

// Usage
function UserList() {
    const { data: users, loading, error } = useApi('/users');
    
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    
    return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}
```

### Mutation Hook
```javascript
function useMutation(method) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const mutate = async (endpoint, data) => {
        setLoading(true);
        setError(null);
        
        try {
            const result = await api[method](endpoint, data);
            setLoading(false);
            return result;
        } catch (err) {
            setError(err.message);
            setLoading(false);
            throw err;
        }
    };
    
    return { mutate, loading, error };
}

// Usage
function CreateUser() {
    const { mutate, loading } = useMutation('post');
    
    const handleCreate = async (data) => {
        const user = await mutate('/users', data);
        console.log('User created:', user);
    };
    
    return <button onClick={() => handleCreate({ name: 'John' })} disabled={loading}>
        {loading ? 'Creating...' : 'Create'}
    </button>;
}
```

---

## 8. Best Practices

### API Best Practices
```javascript
// 1. Use base URL and paths
// ✗ WRONG
fetch('https://api.example.com/api/v1/users')
fetch('https://api.example.com/api/v1/posts')

// ✓ CORRECT
const api = new API('https://api.example.com/api/v1');
api.get('/users');
api.get('/posts');

// 2. Always handle errors
// ✗ WRONG
useEffect(() => {
    fetch('/api/users').then(r => r.json()).then(setUsers);
}, []);

// ✓ CORRECT
useEffect(() => {
    fetch('/api/users')
        .then(r => r.json())
        .then(setUsers)
        .catch(err => setError(err));
}, []);

// 3. Cancel requests on unmount
// ✓ CORRECT
useEffect(() => {
    const controller = new AbortController();
    
    fetch('/api/users', { signal: controller.signal })
        .then(r => r.json())
        .then(setUsers);
    
    return () => controller.abort();
}, []);

// 4. Use proper HTTP methods
GET    - Fetch data
POST   - Create data
PUT    - Update all fields
PATCH  - Update some fields
DELETE - Delete data

// 5. Handle loading and error states
const [data, setData] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
```

---

## Exercises

### Exercise 1: Fetch User Data
```javascript
// Fetch and display users from API
// Show loading and error states

function UserList() {
    // Your code
}
```

**Solution:**
```javascript
function UserList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/users')
            .then(r => r.json())
            .then(setUsers)
            .catch(setError)
            .finally(() => setLoading(false));
    }, []);
    
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    
    return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}
```

### Exercise 2: Search with Cancellation
```javascript
// Search users with request cancellation
// Cancel previous request when new search

function SearchUsers() {
    // Your code
}
```

**Solution:**
```javascript
function SearchUsers() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const abortRef = useRef(null);
    
    useEffect(() => {
        if (!query) {
            setResults([]);
            return;
        }
        
        abortRef.current?.abort();
        abortRef.current = new AbortController();
        
        fetch(`/api/search?q=${query}`, { signal: abortRef.current.signal })
            .then(r => r.json())
            .then(setResults);
    }, [query]);
    
    return (
        <div>
            <input value={query} onChange={e => setQuery(e.target.value)} />
            <ul>{results.map(r => <li key={r.id}>{r.name}</li>)}</ul>
        </div>
    );
}
```

### Exercise 3: Create User
```javascript
// Form to create user via API
// Show loading while submitting
// Handle errors

function CreateUserForm() {
    // Your code
}
```

**Solution:**
```javascript
function CreateUserForm() {
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        
        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name })
            });
            
            if (!response.ok) throw new Error('Failed to create');
            
            const user = await response.json();
            setName('');
            alert('User created!');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <input value={name} onChange={e => setName(e.target.value)} />
            {error && <p className="error">{error}</p>}
            <button disabled={loading}>{loading ? 'Creating...' : 'Create'}</button>
        </form>
    );
}
```

---

## Interview Questions

### Theoretical Questions

**Q1: What is fetch?**
A: Browser API for making HTTP requests (alternative to XMLHttpRequest).

**Q2: What is JSON?**
A: JavaScript Object Notation - format for data exchange.

**Q3: What is HTTP status code 404?**
A: Not Found - requested resource doesn't exist.

**Q4: When to use PUT vs PATCH?**
A: PUT for full update, PATCH for partial.

**Q5: How to prevent race condition?**
A: Use AbortController to cancel previous requests.

---

## Code-Based Interview Questions

**Q1: What is output?**
```javascript
fetch('/api/users')
    .then(r => r.json())
    .then(console.log);
// Will this work for 404 response?
```
A: Yes, it will log the error response (404 not caught automatically)

**Q2: Predict:**
```javascript
useEffect(() => {
    fetch('/api/users')
        .then(r => r.json())
        .then(setUsers);
}, [setUsers]);
// Is this correct dependency?
```
A: No, setUsers doesn't change but fetch should have empty deps

**Q3: What is output?**
```javascript
const response = await fetch('/api/data');
const data = await response.json();
// Can data be undefined?
```
A: No if response is valid JSON, but can be null

**Q4: Spot the issue:**
```javascript
fetch('/api/users')
    .then(data => console.log(data))  // Wrong!
// Should be?
```
A: `.then(r => r.json()).then(data => console.log(data))`

**Q5: What happens?**
```javascript
abortRef.current.abort();
// Does component update?
```
A: Catch throws AbortError, need to check name

---

## Follow-up Questions & Confusing Concepts

**Q: Does fetch send cookies?**
A: No by default, need credentials: 'include'.

**Q: What if API response is not JSON?**
A: Use response.text() instead of response.json().

**Q: Can I abort completed request?**
A: No, abort only works on pending requests.

**Q: What is CORS?**
A: Cross-Origin Resource Sharing - security policy.

---

## Summary

- **Fetch API**: Make HTTP requests
- **Then/Catch/Finally**: Handle async operations
- **Async/Await**: Cleaner async syntax
- **Error Handling**: Check status, catch errors
- **Loading States**: Show spinner/skeleton
- **AbortController**: Cancel pending requests
- **API Client**: Wrapper for all requests
- **Dependencies**: Empty array for single fetch
- **Cleanup**: Cancel requests on unmount
- **Status Codes**: 200 OK, 404 Not Found, 500 Server Error

**Next Step:** Master React testing!
