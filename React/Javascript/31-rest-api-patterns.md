# REST APIs & Network Patterns

## Table of Contents
1. REST API Fundamentals
2. HTTP Methods (GET, POST, PUT, PATCH, DELETE)
3. API Request Patterns
4. Response Handling
5. Error Handling
6. CORS & Security
7. API Authentication
8. Advanced Patterns
9. Best Practices

---

## 1. REST API Fundamentals

### What is REST?
```javascript
// REST = Representational State Transfer
// Built on HTTP standard
// Use standard methods for CRUD operations
// Stateless communication

// REST Principles:
// 1. Client-Server architecture
// 2. Statelessness (each request is independent)
// 3. Uniform interface (consistent endpoints)
// 4. Cacheability (responses can be cached)
// 5. Layered system (client doesn't know if connected directly)
```

### Resource-Based Endpoints
```javascript
// RESTful endpoints use nouns (resources), not verbs
// ✗ WRONG - Verb-based
GET /getUser/123
POST /createUser
DELETE /deleteUser/123

// ✓ CORRECT - Resource-based
GET /users/123
POST /users
DELETE /users/123

// Collections and sub-resources
GET /users              // List all users
GET /users/123          // Single user
GET /users/123/posts    // User's posts
GET /posts/456/comments // Post's comments
```

---

## 2. HTTP Methods

### GET - Retrieve Data
```javascript
// GET is idempotent (safe, no side effects)
// Retrieve data from server

// Basic GET
fetch('https://api.example.com/users')
    .then(response => response.json())
    .then(data => console.log(data));

// GET with parameters
fetch('https://api.example.com/users?page=2&limit=10')
    .then(response => response.json())
    .then(data => console.log(data));

// GET specific resource
fetch('https://api.example.com/users/123')
    .then(response => response.json())
    .then(user => console.log(user));
```

### POST - Create Data
```javascript
// POST creates new resource
// Usually returns created resource with ID

fetch('https://api.example.com/users', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        name: 'John',
        email: 'john@example.com'
    })
})
.then(response => response.json())
.then(newUser => console.log(newUser));

// POST response typically includes new ID
// Response status: 201 Created
```

### PUT - Replace Data
```javascript
// PUT replaces entire resource
// Idempotent (same result if called multiple times)

fetch('https://api.example.com/users/123', {
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        name: 'Jane Doe',
        email: 'jane@example.com',
        age: 30  // All fields required
    })
})
.then(response => response.json())
.then(updatedUser => console.log(updatedUser));

// PUT replaces the ENTIRE resource
// Must send all fields
```

### PATCH - Partial Update
```javascript
// PATCH updates partial resource
// Only send fields to update

fetch('https://api.example.com/users/123', {
    method: 'PATCH',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        email: 'newemail@example.com'  // Only update email
    })
})
.then(response => response.json())
.then(updatedUser => console.log(updatedUser));

// PATCH only changes specified fields
// Other fields remain unchanged
```

### DELETE - Remove Data
```javascript
// DELETE removes resource
// Idempotent

fetch('https://api.example.com/users/123', {
    method: 'DELETE',
    headers: {
        'Authorization': 'Bearer token123'
    }
})
.then(response => {
    if (response.ok) {
        console.log('User deleted');
    }
});

// Response status: 204 No Content (or 200 OK)
// Usually no response body
```

---

## 3. API Request Patterns

### Request with Headers
```javascript
// Set custom headers for authentication, content type, etc
fetch('https://api.example.com/data', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGc...',
        'X-API-Key': 'secret-key-123',
        'User-Agent': 'MyApp/1.0'
    }
})
.then(response => response.json())
.then(data => console.log(data));

// Common headers:
// Content-Type: application/json, text/plain, multipart/form-data
// Authorization: Bearer <token>, Basic <credentials>
// Accept: application/json
// Accept-Encoding: gzip, deflate
```

### Request with Query Parameters
```javascript
// Append query string for filtering, pagination, sorting
let url = new URL('https://api.example.com/users');
url.searchParams.append('page', 1);
url.searchParams.append('limit', 20);
url.searchParams.append('sort', 'name');
url.searchParams.append('order', 'asc');

fetch(url)
    .then(response => response.json())
    .then(data => console.log(data));

// Or manually construct
fetch('https://api.example.com/users?page=1&limit=20&sort=name')
    .then(response => response.json())
    .then(data => console.log(data));
```

### Request with Form Data
```javascript
// Send form data or file upload
let formData = new FormData();
formData.append('name', 'John');
formData.append('email', 'john@example.com');
formData.append('avatar', fileInput.files[0]);

fetch('https://api.example.com/users', {
    method: 'POST',
    body: formData  // Don't set Content-Type (browser sets it)
})
.then(response => response.json())
.then(data => console.log(data));
```

### Request with Timeout
```javascript
// Use AbortController for timeout
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 5000);

fetch('https://api.example.com/data', {
    signal: controller.signal
})
.then(response => response.json())
.then(data => console.log(data))
.catch(error => {
    if (error.name === 'AbortError') {
        console.log('Request timed out');
    }
})
.finally(() => clearTimeout(timeoutId));
```

---

## 4. Response Handling

### Parse Response
```javascript
// Different response formats
fetch('https://api.example.com/data')
    .then(response => {
        // response.json() - Parse as JSON
        // response.text() - Parse as text
        // response.blob() - Parse as binary
        // response.arrayBuffer() - Parse as array buffer
        return response.json();
    })
    .then(data => console.log(data));

// Chaining with appropriate format
fetch('https://api.example.com/image.png')
    .then(response => response.blob())
    .then(blob => {
        const url = URL.createObjectURL(blob);
        // Use blob URL
    });
```

### Response Headers
```javascript
fetch('https://api.example.com/data')
    .then(response => {
        // Access response headers
        console.log(response.headers.get('Content-Type'));
        console.log(response.headers.get('X-Total-Count'));
        
        // All headers
        response.headers.forEach((value, name) => {
            console.log(`${name}: ${value}`);
        });
        
        return response.json();
    })
    .then(data => console.log(data));
```

### Status Code Handling
```javascript
fetch('https://api.example.com/data')
    .then(response => {
        console.log(response.status);      // 200, 404, 500, etc
        console.log(response.statusText);  // "OK", "Not Found", etc
        console.log(response.ok);          // true if status 200-299
        
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }
        return response.json();
    })
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
```

---

## 5. Error Handling

### Network Error vs HTTP Error
```javascript
// Network errors (fetch rejects only on network failure)
fetch('https://api.example.com/data')
    .then(response => {
        if (!response.ok) {
            // HTTP error (200-599) - still resolves!
            throw new Error(`HTTP ${response.status}`);
        }
        return response.json();
    })
    .catch(error => {
        // Network error OR thrown error
        console.error('Error:', error.message);
    });

// fetch() does NOT reject on HTTP error status!
// Must check response.ok manually
```

### Detailed Error Handling
```javascript
async function fetchData(url) {
    try {
        const response = await fetch(url);
        
        // Check status
        if (response.status === 401) {
            throw new Error('Unauthorized - refresh token');
        }
        if (response.status === 403) {
            throw new Error('Forbidden - access denied');
        }
        if (response.status === 404) {
            throw new Error('Not found - resource does not exist');
        }
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        // Network error or timeout
        console.error('Request failed:', error.message);
        throw error;
    }
}
```

### Error Response Parsing
```javascript
fetch('https://api.example.com/data')
    .then(async response => {
        if (!response.ok) {
            // Try to parse error details from response
            const errorData = await response.json();
            throw new Error(errorData.message || 'Unknown error');
        }
        return response.json();
    })
    .catch(error => console.error('Error:', error.message));
```

---

## 6. CORS & Security

### CORS (Cross-Origin Resource Sharing)
```javascript
// CORS allows cross-origin requests
// Server must set appropriate headers

// Same-origin request (no CORS issues)
fetch('/api/data')  // Same domain
    .then(response => response.json());

// Cross-origin request (CORS needed)
fetch('https://other-domain.com/api/data')  // Different domain
    .then(response => response.json());

// Browser sends automatic CORS headers
// Server must respond with:
// Access-Control-Allow-Origin: *
// Access-Control-Allow-Methods: GET, POST, etc
```

### CORS with Credentials
```javascript
// Include cookies/credentials in cross-origin request
fetch('https://api.example.com/user', {
    method: 'GET',
    credentials: 'include',  // Include cookies
    headers: {
        'Content-Type': 'application/json'
    }
})
.then(response => response.json())
.then(data => console.log(data));

// credentials options:
// 'omit' - Don't include credentials (default)
// 'same-origin' - Include only for same-origin
// 'include' - Always include credentials
```

---

## 7. API Authentication

### Bearer Token Authentication
```javascript
// Most common for APIs (JWT)
function fetchWithAuth(url, token) {
    return fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
}

// Usage
let token = localStorage.getItem('authToken');
fetchWithAuth('https://api.example.com/user', token)
    .then(response => response.json())
    .then(data => console.log(data));
```

### Basic Authentication
```javascript
// Encode credentials in header
function basicAuth(username, password) {
    let credentials = btoa(`${username}:${password}`);
    
    return fetch('https://api.example.com/data', {
        headers: {
            'Authorization': `Basic ${credentials}`
        }
    });
}

basicAuth('user', 'pass123')
    .then(response => response.json())
    .then(data => console.log(data));

// ✗ AVOID - Sends password in Base64 (easily decoded)
// ✓ PREFER - Use HTTPS + Bearer tokens
```

### API Key Authentication
```javascript
// Simple API key in headers or params
fetch('https://api.example.com/data', {
    headers: {
        'X-API-Key': 'secret-key-123'
    }
})
.then(response => response.json())
.then(data => console.log(data));

// Or as query parameter
fetch('https://api.example.com/data?apiKey=secret-key-123')
    .then(response => response.json())
    .then(data => console.log(data));
```

---

## 8. Advanced Patterns

### Retry Logic
```javascript
async function fetchWithRetry(url, options = {}, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            let response = await fetch(url, options);
            if (response.ok) return response;
            
            // Don't retry on 4xx errors
            if (response.status >= 400 && response.status < 500) {
                throw new Error(`HTTP ${response.status}`);
            }
        } catch (error) {
            if (i === retries - 1) throw error;
            
            // Exponential backoff
            await new Promise(resolve => 
                setTimeout(resolve, Math.pow(2, i) * 1000)
            );
        }
    }
}

// Usage
fetchWithRetry('https://api.example.com/data')
    .then(response => response.json())
    .then(data => console.log(data));
```

### Request Queue
```javascript
class APIQueue {
    constructor(maxConcurrent = 3) {
        this.maxConcurrent = maxConcurrent;
        this.queue = [];
        this.running = 0;
    }
    
    async add(request) {
        return new Promise((resolve, reject) => {
            this.queue.push({ request, resolve, reject });
            this.process();
        });
    }
    
    async process() {
        while (this.running < this.maxConcurrent && this.queue.length > 0) {
            this.running++;
            let { request, resolve, reject } = this.queue.shift();
            
            try {
                let result = await request();
                resolve(result);
            } catch (error) {
                reject(error);
            } finally {
                this.running--;
                this.process();
            }
        }
    }
}

// Usage
let queue = new APIQueue(3);
queue.add(() => fetch('/api/users'))
    .then(r => r.json())
    .then(data => console.log(data));
```

### Request Caching
```javascript
class APICache {
    constructor(ttl = 60000) {  // 60 second TTL
        this.cache = new Map();
        this.ttl = ttl;
    }
    
    async fetch(url, options = {}) {
        // Check cache
        if (this.cache.has(url)) {
            let { data, timestamp } = this.cache.get(url);
            if (Date.now() - timestamp < this.ttl) {
                return data;
            }
        }
        
        // Fetch new data
        let response = await fetch(url, options);
        let data = await response.json();
        
        // Cache result
        this.cache.set(url, { data, timestamp: Date.now() });
        
        return data;
    }
    
    clear() {
        this.cache.clear();
    }
}

// Usage
let cache = new APICache(60000);  // 60 second cache
cache.fetch('https://api.example.com/data')
    .then(data => console.log(data));
```

---

## 9. Best Practices

### Use Appropriate HTTP Methods
```javascript
// ✓ GOOD - Correct method for operation
GET /users                    // List/retrieve
POST /users                   // Create
PUT /users/123                // Replace
PATCH /users/123              // Partial update
DELETE /users/123             // Delete

// ✗ WRONG - Using wrong methods
GET /users/create
POST /users/list
GET /users/delete/123
```

### Consistent Error Handling
```javascript
class API {
    async request(url, options = {}) {
        try {
            let response = await fetch(url, options);
            
            if (!response.ok) {
                let error = new Error('API Error');
                error.status = response.status;
                error.data = await response.json().catch(() => ({}));
                throw error;
            }
            
            return await response.json();
        } catch (error) {
            // Log error
            console.error('API Request failed:', error);
            throw error;
        }
    }
}

// Use consistently across app
let api = new API();
api.request('/api/data')
    .then(data => console.log(data))
    .catch(error => handleError(error));
```

### Versioning APIs
```javascript
// API versioning for backward compatibility
// Version in URL
fetch('https://api.example.com/v2/users')
    .then(response => response.json());

// Version in header
fetch('https://api.example.com/users', {
    headers: {
        'API-Version': '2'
    }
})
.then(response => response.json());

// Allows new versions without breaking old clients
```

---

## Exercises

### Exercise 1: Simple Fetch
```javascript
// Fetch and display users
async function getUsers() {
    // Your code
}

// Expected: Call https://jsonplaceholder.typicode.com/users
// Display names in console
```

**Solution:**
```javascript
async function getUsers() {
    try {
        let response = await fetch('https://jsonplaceholder.typicode.com/users');
        let users = await response.json();
        users.forEach(user => console.log(user.name));
    } catch (error) {
        console.error('Error:', error);
    }
}
```

### Exercise 2: Create User
```javascript
// POST new user to API
async function createUser(name, email) {
    // Your code
}

console.log(await createUser('John', 'john@example.com'));
```

**Solution:**
```javascript
async function createUser(name, email) {
    let response = await fetch('https://jsonplaceholder.typicode.com/users', {
        method: 'POST',
        body: JSON.stringify({ name, email })
    });
    return await response.json();
}
```

### Exercise 3: Error Handling
```javascript
// Fetch with proper error handling
async function fetchWithError(url) {
    // Your code
}
```

**Solution:**
```javascript
async function fetchWithError(url) {
    try {
        let response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return await response.json();
    } catch (error) {
        console.error('Error:', error.message);
        throw error;
    }
}
```

---

## Interview Questions

### Theoretical Questions

**Q1: What is REST?**
A: Representational State Transfer - architectural style using HTTP for CRUD operations.

**Q2: What's the difference between PUT and PATCH?**
A: PUT replaces entire resource, PATCH updates partially.

**Q3: Why doesn't fetch() reject on HTTP errors?**
A: To distinguish network errors from HTTP errors - must check response.ok.

**Q4: How do you handle CORS issues?**
A: Server must set Access-Control-Allow-Origin header.

**Q5: What is bearer token authentication?**
A: JWT token passed in Authorization header for API requests.

---

## Code-Based Interview Questions

**Q1: What will be output?**
```javascript
fetch('https://api.example.com/404')
    .then(r => console.log(r.ok))  // ?
```
A:
```
false
(still resolves, doesn't throw)
```

**Q2: Predict:**
```javascript
let response = await fetch(url);
let data = await response.json();
// response.json() called twice?
```
A: Body can only be read once - second call returns empty.

**Q3: What is the headers for POST?**
```javascript
fetch(url, {
    method: 'POST',
    body: JSON.stringify(data)
})
// What header is missing?
```
A: Content-Type: application/json

**Q4: Spot the issue:**
```javascript
fetch(url, {
    headers: {
        'Authorization': 'Bearer ' + token  // Best practice?
    }
})
```
A: Use template literal: `Bearer ${token}`

**Q5: What is output?**
```javascript
let token = 'abc123';
btoa(`user:${token}`);  // ?
```
A: Base64-encoded string (for Basic auth)

---

## Follow-up Questions & Confusing Concepts

**Q: Does CORS only apply to fetch?**
A: No, also XMLHttpRequest, images, scripts, etc.

**Q: Can I bypass CORS restriction?**
A: No, it's browser security. Server must enable it.

**Q: What about rate limiting in APIs?**
A: Servers send headers like X-RateLimit-Remaining.

**Q: How do I store sensitive auth tokens?**
A: Secure HttpOnly cookie (not localStorage for sensitive data).

---

## Summary

- **HTTP Methods**: GET (retrieve), POST (create), PUT (replace), PATCH (update), DELETE (remove)
- **Endpoints**: Resource-based (/users not /getUser)
- **Response handling**: Check response.ok, then parse with .json()
- **Status codes**: 2xx success, 3xx redirect, 4xx client error, 5xx server error
- **CORS**: Cross-origin requests need server headers
- **Authentication**: Bearer tokens (JWT), Basic auth, API keys
- **Error handling**: fetch only rejects on network error
- **Retry logic**: Implement exponential backoff for resilience
- **Caching**: Use appropriate cache TTL for data
- **Best practice**: Type-check headers, validate responses, handle all errors

**Next Step:** Master performance optimization and best practices!
