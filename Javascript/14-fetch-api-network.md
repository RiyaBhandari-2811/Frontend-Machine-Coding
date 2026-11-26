# Fetch API & Network Requests

## Table of Contents
1. Introduction to Fetch API
2. Making GET Requests
3. Making POST Requests
4. HTTP Methods
5. Headers and Options
6. Error Handling
7. Working with JSON
8. Advanced Patterns
9. Comparison with XMLHttpRequest

---

## 1. Introduction to Fetch API

### What is Fetch API?
```javascript
// Fetch API: Modern way to make HTTP requests
// Returns a Promise
// Replaces older XMLHttpRequest

// Basic syntax
fetch(url)
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
```

### Why Fetch over XMLHttpRequest?
```javascript
// XMLHttpRequest (old way - verbose)
let xhr = new XMLHttpRequest();
xhr.open('GET', url);
xhr.onload = function() {
    if (xhr.status === 200) {
        let data = JSON.parse(xhr.responseText);
    }
};
xhr.onerror = function() {
    console.error('Request failed');
};
xhr.send();

// Fetch (modern - cleaner)
fetch(url)
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.error(err));
```

---

## 2. Making GET Requests

### Simple GET Request
```javascript
// GET is default method
fetch('https://api.example.com/users')
    .then(response => {
        console.log(response.status);  // 200
        console.log(response.ok);      // true
        return response.json();        // Parse JSON
    })
    .then(data => {
        console.log(data);  // Array of users
    })
    .catch(error => {
        console.error('Error:', error);
    });
```

### GET with Query Parameters
```javascript
// Method 1: Build URL with parameters
let params = new URLSearchParams({
    name: 'John',
    age: 25,
    city: 'NYC'
});

fetch('https://api.example.com/users?' + params)
    .then(res => res.json())
    .then(data => console.log(data));

// Method 2: String concatenation
let name = 'John';
let age = 25;
let url = `https://api.example.com/users?name=${name}&age=${age}`;

fetch(url)
    .then(res => res.json())
    .then(data => console.log(data));
```

### Response Object
```javascript
fetch(url)
    .then(response => {
        // Response properties
        console.log(response.status);       // 200, 404, 500, etc
        console.log(response.statusText);   // "OK", "Not Found", etc
        console.log(response.ok);           // true if 200-299
        console.log(response.url);          // Final URL (after redirects)
        console.log(response.headers);      // Headers object
        
        // Check if successful
        if (!response.ok) {
            throw new Error('HTTP error ' + response.status);
        }
        
        return response.json();  // Parse body
    })
    .then(data => console.log(data))
    .catch(error => console.error(error));
```

---

## 3. Making POST Requests

### Simple POST Request
```javascript
// POST with JSON data
let userData = {
    name: 'John',
    email: 'john@example.com',
    age: 25
};

fetch('https://api.example.com/users', {
    method: 'POST',          // Set method
    headers: {
        'Content-Type': 'application/json'  // Tell server it's JSON
    },
    body: JSON.stringify(userData)  // Convert to JSON string
})
    .then(res => res.json())
    .then(data => {
        console.log('User created:', data);
    })
    .catch(error => console.error(error));
```

### Form Data POST
```javascript
// Send form data
let formData = new FormData();
formData.append('username', 'john');
formData.append('email', 'john@example.com');
formData.append('avatar', fileInput.files[0]);  // File upload

fetch('https://api.example.com/register', {
    method: 'POST',
    body: formData  // Don't set Content-Type (browser sets it)
})
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
```

### Full POST Example
```javascript
function createUser(user) {
    return fetch('https://api.example.com/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer token123'  // Add auth token
        },
        body: JSON.stringify(user)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to create user: ' + response.status);
            }
            return response.json();
        });
}

createUser({ name: 'John', email: 'john@example.com' })
    .then(newUser => console.log('Created:', newUser))
    .catch(error => console.error(error));
```

---

## 4. HTTP Methods

### Common HTTP Methods
```javascript
// GET - Retrieve data
fetch(url)
    .then(res => res.json());

// POST - Create new resource
fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
});

// PUT - Replace entire resource
fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
});

// PATCH - Partial update
fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'NewName' })
});

// DELETE - Remove resource
fetch(url, {
    method: 'DELETE'
});

// HEAD - Like GET but no response body
fetch(url, {
    method: 'HEAD'
});
```

### CRUD Example
```javascript
const API = 'https://api.example.com/posts';

// Create
function createPost(post) {
    return fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post)
    }).then(r => r.json());
}

// Read
function getPost(id) {
    return fetch(API + '/' + id)
        .then(r => r.json());
}

// Update
function updatePost(id, post) {
    return fetch(API + '/' + id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(post)
    }).then(r => r.json());
}

// Delete
function deletePost(id) {
    return fetch(API + '/' + id, {
        method: 'DELETE'
    }).then(r => r.json());
}
```

---

## 5. Headers and Options

### Setting Headers
```javascript
// Different content types
let jsonData = { name: 'John' };

fetch(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',      // For JSON
    },
    body: JSON.stringify(jsonData)
});

// Add authentication
fetch(url, {
    headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    }
});

// Custom headers
fetch(url, {
    headers: {
        'Custom-Header': 'value',
        'API-Key': 'secret-key'
    }
});

// Multiple headers
fetch(url, {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer token',
        'X-Requested-With': 'XMLHttpRequest'
    }
});
```

### Fetch Options
```javascript
fetch(url, {
    method: 'POST',                    // HTTP method
    headers: { },                      // Request headers
    body: data,                        // Request body
    
    // Other options
    mode: 'cors',                      // CORS mode: 'cors', 'no-cors', 'same-origin'
    credentials: 'include',            // Send cookies: 'omit', 'same-origin', 'include'
    cache: 'default',                  // Cache mode: 'default', 'no-store', 'reload', 'no-cache'
    redirect: 'follow',                // Follow redirects: 'follow', 'error', 'manual'
    signal: abortController.signal     // For cancellation
});
```

### CORS (Cross-Origin Resource Sharing)
```javascript
// CORS allows requests across domains
fetch('https://different-domain.com/api', {
    method: 'GET',
    mode: 'cors',           // Enable CORS
    headers: {
        'Content-Type': 'application/json'
    }
})
    .then(res => res.json())
    .catch(error => console.error('CORS error:', error));
```

---

## 6. Error Handling

### Network Errors vs HTTP Errors
```javascript
fetch(url)
    .then(response => {
        // Network OK but HTTP error
        if (!response.ok) {
            throw new Error('HTTP error ' + response.status);
        }
        return response.json();
    })
    .then(data => console.log(data))
    .catch(error => {
        // Network error OR thrown error
        console.error('Error:', error.message);
    });

// Important: Fetch only rejects on network errors, not HTTP errors!
```

### Handling Different Status Codes
```javascript
fetch(url)
    .then(response => {
        switch (response.status) {
            case 200:
                return response.json();  // Success
            case 404:
                throw new Error('Not found');
            case 401:
                throw new Error('Unauthorized');
            case 500:
                throw new Error('Server error');
            default:
                throw new Error('HTTP ' + response.status);
        }
    })
    .then(data => console.log(data))
    .catch(error => console.error(error));
```

### Retry Pattern
```javascript
function fetchWithRetry(url, options = {}, maxRetries = 3) {
    return fetch(url, options)
        .then(response => {
            if (response.ok) return response;
            if (response.status >= 500) {
                throw new Error('Server error');  // Retry
            }
            throw new Error('Not retryable');  // Don't retry
        })
        .catch(error => {
            if (maxRetries > 0) {
                return new Promise(resolve => {
                    setTimeout(() => {
                        resolve(fetchWithRetry(url, options, maxRetries - 1));
                    }, 1000);  // Wait 1 second before retry
                });
            }
            throw error;
        });
}

fetchWithRetry(url)
    .then(res => res.json())
    .catch(err => console.error('Failed after retries:', err));
```

---

## 7. Working with JSON

### Parse JSON Response
```javascript
// Most common: Parse to JSON
fetch(url)
    .then(response => response.json())  // Returns Promise
    .then(data => console.log(data))
    .catch(error => console.error(error));

// Parse as text
fetch(url)
    .then(response => response.text())  // Returns Promise<string>
    .then(text => console.log(text));

// Parse as blob (for files)
fetch(url)
    .then(response => response.blob())  // Returns Promise<Blob>
    .then(blob => console.log(blob));
```

### Handle Invalid JSON
```javascript
fetch(url)
    .then(response => {
        if (!response.ok) throw new Error('HTTP error');
        
        // Check content type
        let contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Not JSON');
        }
        
        return response.json();
    })
    .then(data => console.log(data))
    .catch(error => console.error(error));
```

---

## 8. Advanced Patterns

### Request Timeout
```javascript
function fetchWithTimeout(url, timeout = 5000) {
    let controller = new AbortController();
    let timeoutId = setTimeout(() => controller.abort(), timeout);
    
    return fetch(url, { signal: controller.signal })
        .finally(() => clearTimeout(timeoutId));
}

fetchWithTimeout(url, 5000)
    .then(res => res.json())
    .catch(error => console.error(error));
```

### Abort Request
```javascript
let controller = new AbortController();

let fetchPromise = fetch(url, {
    signal: controller.signal
});

// Cancel request
button.addEventListener('click', () => {
    controller.abort();
});

fetchPromise
    .then(res => res.json())
    .catch(error => {
        if (error.name === 'AbortError') {
            console.log('Request cancelled');
        }
    });
```

### Parallel Requests
```javascript
// Fetch multiple resources
Promise.all([
    fetch('https://api.example.com/users').then(r => r.json()),
    fetch('https://api.example.com/posts').then(r => r.json()),
    fetch('https://api.example.com/comments').then(r => r.json())
])
    .then(([users, posts, comments]) => {
        console.log('Users:', users);
        console.log('Posts:', posts);
        console.log('Comments:', comments);
    })
    .catch(error => console.error(error));
```

### Sequential Requests
```javascript
// First request, then second based on result
fetch('https://api.example.com/users/1')
    .then(res => res.json())
    .then(user => {
        // Use user ID for second request
        return fetch('https://api.example.com/posts/' + user.id);
    })
    .then(res => res.json())
    .then(post => console.log(post))
    .catch(error => console.error(error));

// Or with async/await
async function getPostForUser() {
    let user = await fetch('https://api.example.com/users/1').then(r => r.json());
    let post = await fetch('https://api.example.com/posts/' + user.id).then(r => r.json());
    return post;
}
```

---

## 9. Comparison with XMLHttpRequest

### XMLHttpRequest (Outdated)
```javascript
let xhr = new XMLHttpRequest();

xhr.open('GET', 'https://api.example.com/users');
xhr.setRequestHeader('Content-Type', 'application/json');

xhr.onload = function() {
    if (xhr.status === 200) {
        let data = JSON.parse(xhr.responseText);
        console.log(data);
    }
};

xhr.onerror = function() {
    console.error('Request failed');
};

xhr.onprogress = function(e) {
    console.log(e.loaded + '/' + e.total);
};

xhr.send();
```

### Fetch (Modern)
```javascript
// Same as XMLHttpRequest above, but cleaner
fetch('https://api.example.com/users', {
    headers: { 'Content-Type': 'application/json' }
})
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(error => console.error(error));
```

---

## Exercises

### Exercise 1: Fetch User Data
```javascript
// Fetch user with ID 1 from JSONPlaceholder API
// URL: https://jsonplaceholder.typicode.com/users/1

// Your code
```

**Solution:**
```javascript
fetch('https://jsonplaceholder.typicode.com/users/1')
    .then(response => {
        if (!response.ok) throw new Error('HTTP ' + response.status);
        return response.json();
    })
    .then(user => console.log(user.name))
    .catch(error => console.error(error));
```

### Exercise 2: Create New Post
```javascript
// Create new post on JSONPlaceholder
// POST to: https://jsonplaceholder.typicode.com/posts
// Data: { title: "My Post", body: "Content", userId: 1 }

// Your code
```

**Solution:**
```javascript
fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        title: 'My Post',
        body: 'Content',
        userId: 1
    })
})
    .then(res => res.json())
    .then(data => console.log('Created:', data))
    .catch(error => console.error(error));
```

### Exercise 3: Fetch with Timeout
```javascript
// Fetch data with 3 second timeout
// Use AbortController

// Your code
```

**Solution:**
```javascript
let controller = new AbortController();
let timeout = setTimeout(() => controller.abort(), 3000);

fetch('https://api.example.com/data', {
    signal: controller.signal
})
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(error => {
        if (error.name === 'AbortError') {
            console.log('Request timed out');
        }
    })
    .finally(() => clearTimeout(timeout));
```

---

## Interview Questions

### Theoretical Questions

**Q1: What does fetch return?**
A: Promise that resolves to Response object. Rejects only on network errors, not HTTP errors (like 404).

**Q2: How do I know if fetch request failed?**
A: Check response.ok (true for 200-299). Catch error for network failures. HTTP errors must check status.

**Q3: What's the difference between body parameter and setting it?**
A: Body can be string, Blob, FormData, etc. For JSON, use JSON.stringify(). Don't forget to set Content-Type header.

**Q4: How do I add authentication to fetch?**
A: Use Authorization header with 'Bearer token' or other auth scheme. Set in headers option.

**Q5: Can I cancel fetch request?**
A: Yes, with AbortController. Create controller, pass signal, call abort() to cancel.

---

## Code-Based Interview Questions

**Q1: What will be output?**
```javascript
fetch('https://api.example.com/nonexistent')
    .then(res => res.json())
    .then(data => console.log(data))
    .catch(err => console.log('Error'));

// Server returns 404
// ?
```
A:
```
(tries to parse as JSON, may fail on 404 response body, or logs parsed data)
```
Explanation: Fetch doesn't reject on 404! Must check response.ok.

**Q2: Predict:**
```javascript
fetch(url)
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.log(error.message));

// Network fails
// ?
```
A:
```
(error message, e.g., "Failed to fetch")
```

**Q3: What will be logged?**
```javascript
fetch(url, {
    headers: { 'Content-Type': 'application/json' }
})
    .then(r => r.json())
    .then(d => console.log(typeof d));

// Server returns: { "name": "John" }
// ?
```
A:
```
"object"
```

**Q4: Spot the issue:**
```javascript
fetch(url, {
    method: 'POST',
    body: JSON.stringify(data)
    // Missing Content-Type header!
})
```
A: Should include headers: { 'Content-Type': 'application/json' }

**Q5: What is output?**
```javascript
let controller = new AbortController();
fetch(url, { signal: controller.signal })
    .catch(e => console.log(e.name));

setTimeout(() => controller.abort(), 100);

// ?
```
A:
```
"AbortError"
```

---

## Follow-up Questions & Confusing Concepts

**Q: Does fetch send cookies?**
A: No by default. Use credentials: 'include' to send cookies with request.

**Q: What's the difference between POST and PUT?**
A: POST creates new resource, PUT replaces entire resource. PATCH does partial update.

**Q: Can I modify response after fetching?**
A: No, can read body once. Use response.clone() if need multiple reads.

**Q: How do I upload files?**
A: Create FormData, append file, POST FormData (don't set Content-Type, browser does).

---

## Summary

- **Fetch API**: Modern way to make HTTP requests, returns Promise
- **Response**: Contains status, ok, json(), text(), blob() methods
- **Methods**: GET, POST, PUT, PATCH, DELETE
- **Headers**: Set Content-Type and Authorization
- **HTTP Errors**: Check response.ok, not caught by catch()
- **Network Errors**: Rejected by Promise, caught by catch()
- **JSON**: Use response.json() to parse response
- **Abort**: Use AbortController to cancel request
- **Options**: mode, credentials, cache, redirect, signal
- **CORS**: Enable cross-origin requests with mode: 'cors'

**Next Step:** Learn about error handling with try/catch/finally!
