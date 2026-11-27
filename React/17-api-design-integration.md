# API Design, Integration & Best Practices

## Table of Contents
1. REST vs GraphQL
2. API Contract Design
3. Error Handling
4. Pagination Strategies
5. Caching Patterns
6. Rate Limiting
7. Authentication Flows
8. API Versioning

---

## 1. REST vs GraphQL

### REST Pattern
```javascript
// REST - Multiple endpoints
GET /api/users/:id
GET /api/users/:id/posts
GET /api/users/:id/followers

// Many requests needed to get full data

// Hook to fetch REST data
function useUser(userId) {
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    
    useEffect(() => {
        Promise.all([
            fetch(`/api/users/${userId}`).then(r => r.json()),
            fetch(`/api/users/${userId}/posts`).then(r => r.json())
        ]).then(([user, posts]) => {
            setUser(user);
            setPosts(posts);
        });
    }, [userId]);
    
    return { user, posts };
}
```

### GraphQL Pattern
```javascript
// GraphQL - Single request with exact data needed
const query = `
    query GetUser($id: ID!) {
        user(id: $id) {
            id
            name
            email
            posts {
                id
                title
            }
            followers(first: 10) {
                id
                name
            }
        }
    }
`;

// Hook using Apollo Client
import { useQuery, gql } from '@apollo/client';

const GET_USER = gql`
    query GetUser($id: ID!) {
        user(id: $id) {
            id
            name
            posts { id title }
        }
    }
`;

function useUser(userId) {
    const { data, loading, error } = useQuery(GET_USER, {
        variables: { id: userId }
    });
    
    return { user: data?.user, loading, error };
}

// Benefits:
// - Single request
// - Exact data needed
// - Type-safe
// - Cache built-in
```

---

## 2. API Contract Design

### Response Format
```javascript
// ✗ INCONSISTENT
// GET /api/users returns: User object directly
{ id: 1, name: 'John' }

// GET /api/users?page=1 returns: wrapped
{ data: [{ id: 1, name: 'John' }], total: 100 }

// GET /api/users/:id returns: wrapped
{ data: { id: 1, name: 'John' } }

// ✓ CONSISTENT
// All endpoints return consistent format
{
    success: true,
    data: { id: 1, name: 'John' },
    error: null,
    metadata: { timestamp: '2024-01-01T00:00:00Z' }
}

// Error format
{
    success: false,
    data: null,
    error: {
        code: 'USER_NOT_FOUND',
        message: 'User with ID 123 not found',
        details: { userId: 123 }
    },
    metadata: { timestamp: '2024-01-01T00:00:00Z' }
}
```

### Client Implementation
```javascript
// API wrapper
class ApiClient {
    async request(endpoint, options = {}) {
        const response = await fetch(endpoint, options);
        const json = await response.json();
        
        if (!response.ok) {
            throw new ApiError(json.error);
        }
        
        return json.data;  // Extract data
    }
    
    async get(endpoint) {
        return this.request(endpoint);
    }
    
    async post(endpoint, body) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(body)
        });
    }
}

// Usage
const api = new ApiClient();
const user = await api.get('/api/users/123');
```

---

## 3. Error Handling

### Standardized Errors
```javascript
// Error codes
const ErrorCodes = {
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    RATE_LIMIT: 429,
    SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503
};

// Error response
{
    success: false,
    error: {
        code: 'VALIDATION_ERROR',
        message: 'Email is required',
        statusCode: 400,
        validationErrors: [
            { field: 'email', message: 'Email is required' }
        ]
    }
}

// Client error handling
class ApiError extends Error {
    constructor(errorData) {
        super(errorData.message);
        this.code = errorData.code;
        this.statusCode = errorData.statusCode;
        this.validationErrors = errorData.validationErrors;
    }
}

// Usage
function useApi(url) {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        fetch(url)
            .then(r => r.json())
            .then(json => {
                if (!json.success) {
                    throw new ApiError(json.error);
                }
                setData(json.data);
            })
            .catch(err => {
                setError(err);
            });
    }, [url]);
    
    return { data, error };
}
```

---

## 4. Pagination Strategies

### Offset Pagination
```javascript
// API: GET /api/users?page=1&limit=10

// Hook
function usePaginatedFetch(url, pageSize = 10) {
    const [page, setPage] = useState(1);
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    
    useEffect(() => {
        const offset = (page - 1) * pageSize;
        fetch(`${url}?offset=${offset}&limit=${pageSize}`)
            .then(r => r.json())
            .then(res => {
                setData(res.data);
                setTotal(res.total);
            });
    }, [page, pageSize, url]);
    
    return {
        data,
        total,
        page,
        pageSize,
        goToPage: setPage,
        hasNext: page * pageSize < total,
        hasPrev: page > 1
    };
}
```

### Cursor Pagination
```javascript
// API: GET /api/users?cursor=abc123&limit=10
// Returns: { data: [...], nextCursor: 'xyz789' }

function useCursorPagination(url, pageSize = 10) {
    const [items, setItems] = useState([]);
    const [cursor, setCursor] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    
    const fetchMore = useCallback(() => {
        const params = new URLSearchParams({ limit: pageSize });
        if (cursor) params.append('cursor', cursor);
        
        fetch(`${url}?${params}`)
            .then(r => r.json())
            .then(res => {
                setItems(prev => [...prev, ...res.data]);
                setCursor(res.nextCursor);
                setHasMore(!!res.nextCursor);
            });
    }, [url, cursor, pageSize]);
    
    useEffect(() => {
        fetchMore();
    }, []);
    
    return { items, hasMore, fetchMore };
}
```

### Infinite Scroll
```javascript
// Using Intersection Observer
function InfiniteList({ url }) {
    const { items, hasMore, fetchMore } = useCursorPagination(url);
    const lastRef = useRef(null);
    
    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                fetchMore();
            }
        });
        
        if (lastRef.current) {
            observer.observe(lastRef.current);
        }
        
        return () => observer.disconnect();
    }, [hasMore, fetchMore]);
    
    return (
        <div>
            {items.map(item => <div key={item.id}>{item.name}</div>)}
            <div ref={lastRef}>Loading...</div>
        </div>
    );
}
```

---

## 5. Caching Patterns

### Client-side Caching
```javascript
// Simple cache
const cache = {};

function useFetch(url) {
    const [data, setData] = useState(null);
    
    useEffect(() => {
        if (cache[url]) {
            setData(cache[url]);
            return;
        }
        
        fetch(url)
            .then(r => r.json())
            .then(d => {
                cache[url] = d;
                setData(d);
            });
    }, [url]);
    
    return data;
}

// Or use React Query
import { useQuery } from '@tanstack/react-query';

function useUsers() {
    return useQuery({
        queryKey: ['users'],
        queryFn: () => fetch('/api/users').then(r => r.json()),
        staleTime: 5 * 60 * 1000  // 5 minutes
    });
}
```

### Cache Invalidation
```javascript
// Manual invalidation
const queryClient = new QueryClient();

function useDeleteUser() {
    const mutation = useMutation({
        mutationFn: (userId) =>
            fetch(`/api/users/${userId}`, { method: 'DELETE' }),
        onSuccess: () => {
            // Invalidate users cache
            queryClient.invalidateQueries({ queryKey: ['users'] });
        }
    });
    
    return mutation;
}

// Time-based invalidation
{
    staleTime: 5 * 60 * 1000,  // 5 min
    gcTime: 10 * 60 * 1000     // 10 min garbage collect
}
```

---

## 6. Rate Limiting

### Handling Rate Limits
```javascript
// Exponential backoff
async function fetchWithRetry(url, options = {}, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, options);
            
            if (response.status === 429) {
                // Rate limited - wait and retry
                const waitTime = Math.pow(2, i) * 1000;  // 1s, 2s, 4s
                await new Promise(resolve => setTimeout(resolve, waitTime));
                continue;
            }
            
            if (!response.ok) throw new Error('Failed');
            return response;
        } catch (error) {
            if (i === retries - 1) throw error;
        }
    }
}

// Usage in hook
function useFetch(url) {
    const [data, setData] = useState(null);
    
    useEffect(() => {
        fetchWithRetry(url)
            .then(r => r.json())
            .then(setData);
    }, [url]);
    
    return data;
}
```

### Request Deduplication
```javascript
// Don't send duplicate requests
const pendingRequests = new Map();

function useFetch(url) {
    const [data, setData] = useState(null);
    
    useEffect(() => {
        if (pendingRequests.has(url)) {
            // Already fetching
            pendingRequests.get(url).then(setData);
            return;
        }
        
        const promise = fetch(url)
            .then(r => r.json())
            .then(d => {
                setData(d);
                pendingRequests.delete(url);
                return d;
            });
        
        pendingRequests.set(url, promise);
    }, [url]);
    
    return data;
}
```

---

## 7. Authentication Flows

### JWT Token Flow
```javascript
// Login
async function login(email, password) {
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    });
    
    const { token } = await response.json();
    localStorage.setItem('token', token);
    return token;
}

// Authenticated request
function useProtectedApi(url) {
    const [data, setData] = useState(null);
    
    useEffect(() => {
        const token = localStorage.getItem('token');
        
        fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(r => {
                if (r.status === 401) {
                    // Token expired, re-login
                    localStorage.removeItem('token');
                    throw new Error('Unauthorized');
                }
                return r.json();
            })
            .then(setData);
    }, [url]);
    
    return data;
}
```

### Refresh Token
```javascript
// Store both access and refresh tokens
function login(email, password) {
    return fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
    })
        .then(r => r.json())
        .then(({ accessToken, refreshToken }) => {
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
        });
}

// Refresh expired token
async function refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    
    const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        body: JSON.stringify({ refreshToken })
    });
    
    const { accessToken } = await response.json();
    localStorage.setItem('accessToken', accessToken);
    return accessToken;
}

// API interceptor
async function apiCall(url, options = {}) {
    let token = localStorage.getItem('accessToken');
    
    let response = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `Bearer ${token}`
        }
    });
    
    if (response.status === 401) {
        // Try to refresh
        token = await refreshToken();
        
        response = await fetch(url, {
            ...options,
            headers: {
                ...options.headers,
                'Authorization': `Bearer ${token}`
            }
        });
    }
    
    return response;
}
```

---

## 8. API Versioning

### Version in URL
```javascript
// GET /api/v1/users
// GET /api/v2/users

function useUsers(version = 'v1') {
    return useFetch(`/api/${version}/users`);
}
```

### Version in Header
```javascript
// Header: X-API-Version: 2

function apiCall(url, options = {}) {
    return fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            'X-API-Version': '2'
        }
    });
}
```

---

## Exercises

### Exercise 1: API Wrapper
```javascript
// Create ApiClient class with:
// - GET, POST, PUT, DELETE methods
// - Error handling
// - Request/response logging

class ApiClient {
    // Your code
}
```

**Solution:**
```javascript
class ApiClient {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }
    
    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const response = await fetch(url, options);
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message);
        }
        
        return response.json();
    }
    
    get(endpoint) {
        return this.request(endpoint);
    }
    
    post(endpoint, body) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
```

### Exercise 2: Pagination Hook
```javascript
// Create hook that:
// - Handles page changes
// - Tracks total count
// - Loads data for each page

function usePagination(url, pageSize = 10) {
    // Your code
}
```

**Solution:**
```javascript
function usePagination(url, pageSize = 10) {
    const [page, setPage] = useState(1);
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    
    useEffect(() => {
        const offset = (page - 1) * pageSize;
        fetch(`${url}?offset=${offset}&limit=${pageSize}`)
            .then(r => r.json())
            .then(res => {
                setData(res.data);
                setTotal(res.total);
            });
    }, [page, pageSize, url]);
    
    return {
        data,
        total,
        page,
        goToPage: setPage,
        hasNext: page * pageSize < total
    };
}
```

### Exercise 3: Authenticated API
```javascript
// Create hook that:
// - Automatically includes JWT token
// - Handles 401 (unauthorized)
// - Refreshes token if needed

function useAuthenticatedApi(url) {
    // Your code
}
```

**Solution:**
```javascript
function useAuthenticatedApi(url) {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const token = localStorage.getItem('token');
        
        fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(r => {
                if (r.status === 401) {
                    localStorage.removeItem('token');
                    throw new Error('Unauthorized');
                }
                return r.json();
            })
            .then(setData)
            .catch(setError);
    }, [url]);
    
    return { data, error };
}
```

---

## Interview Questions

### Theoretical Questions

**Q1: REST vs GraphQL?**
A: REST - multiple endpoints, GraphQL - single query language.

**Q2: What is API versioning?**
A: Maintaining backwards compatibility with version numbers.

**Q3: What is rate limiting?**
A: Limiting requests per time period to prevent abuse.

**Q4: What is JWT?**
A: Token-based authentication stateless.

**Q5: What is cursor pagination?**
A: Using pointer to next data, good for large datasets.

---

## Summary

- **API Design:** Consistent responses and errors
- **REST:** Multiple endpoints for different resources
- **GraphQL:** Single query language for exact data
- **Error Handling:** Standardized error format
- **Pagination:** Offset or cursor-based
- **Caching:** Reduce redundant requests
- **Rate Limiting:** Exponential backoff
- **Authentication:** JWT tokens
- **Refresh Tokens:** Handle expiration
- **Versioning:** URL or header-based

**Next:** Error handling strategies!
