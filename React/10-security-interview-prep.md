# React Security & Interview Preparation

## Table of Contents
1. Security Vulnerabilities
2. XSS Prevention
3. CSRF Protection
4. Input Validation
5. Authentication Best Practices
6. Environment Variables
7. Common Interview Patterns
8. Performance Tips

---

## 1. Security Vulnerabilities

### XSS (Cross-Site Scripting)
```javascript
// ✗ VULNERABLE - dangerouslySetInnerHTML
function Comment({ content }) {
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
}

// If content = '<img src=x onerror="alert(\'hacked\')">'
// Script executes!

// ✓ SAFE - React escapes by default
function Comment({ content }) {
    return <div>{content}</div>;  // Auto-escaped
}

// Output: &lt;img src=x onerror=...&gt; (safe)

// If you must use dangerouslySetInnerHTML:
function sanitizeHtml(html) {
    // Use a library like DOMPurify
    return DOMPurify.sanitize(html);
}

function Comment({ content }) {
    return <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }} />;
}
```

### SQL Injection (Backend)
```javascript
// ✗ VULNERABLE - Backend issue, but affects frontend
// Server concatenates user input into SQL
const query = `SELECT * FROM users WHERE email = '${email}'`;

// If email = "' OR '1'='1"
// Query becomes: SELECT * FROM users WHERE email = '' OR '1'='1'
// Returns all users!

// ✓ SAFE - Use parameterized queries (backend)
const query = 'SELECT * FROM users WHERE email = ?';
database.query(query, [email]);

// Frontend validation doesn't prevent SQL injection
// Must validate on backend!
```

---

## 2. XSS Prevention

### Content Security Policy
```javascript
// HTML - Set CSP header
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self'; script-src 'self' cdn.example.com; style-src 'self' 'unsafe-inline'" />

// Or server header
// Content-Security-Policy: default-src 'self'; script-src 'self' cdn.example.com

// Restricts:
// - Script sources
// - Style sources
// - Image sources
// - etc.
```

### Escaping Output
```javascript
// React escapes by default
<div>{userInput}</div>  // Safe

// HTML special chars that get escaped:
// < becomes &lt;
// > becomes &gt;
// & becomes &amp;
// " becomes &quot;
// ' becomes &#x27;

// ✗ WRONG - Bypasses escaping
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✓ CORRECT - Let React escape
<div>{userInput}</div>
```

### Sanitizing HTML
```javascript
// npm install dompurify

import DOMPurify from 'dompurify';

function RichContent({ html }) {
    const sanitized = DOMPurify.sanitize(html);
    return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
}

// DOMPurify config
const sanitized = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
    ALLOWED_ATTR: ['href', 'title'],
    KEEP_CONTENT: true
});
```

---

## 3. CSRF Protection

### CSRF Token
```javascript
// ✗ VULNERABLE - No CSRF protection
function DeleteUser({ userId }) {
    const handleDelete = () => {
        fetch(`/api/users/${userId}`, { method: 'DELETE' });
    };
    
    return <button onClick={handleDelete}>Delete</button>;
}

// Attacker could make you click link that deletes you

// ✓ SAFE - Use CSRF token
function DeleteUser({ userId, csrfToken }) {
    const handleDelete = () => {
        fetch(`/api/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'X-CSRF-Token': csrfToken
            }
        });
    };
    
    return <button onClick={handleDelete}>Delete</button>;
}

// Server verifies token before processing
```

### SameSite Cookie
```javascript
// Server sets cookie with SameSite
// Set-Cookie: session=abc123; SameSite=Strict

// Values:
// Strict - Cookie only sent with same-site requests
// Lax - Cookie sent with top-level navigation (safer default)
// None - Cookie sent with all requests (requires Secure flag)

// Frontend doesn't need to do anything
// Server configures this
```

---

## 4. Input Validation

### Client-side Validation
```javascript
// ✓ ALWAYS validate on client for UX
function RegisterForm() {
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState({});
    
    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };
    
    const handleChange = (e) => {
        const { value } = e.target;
        setEmail(value);
        
        if (value && !validateEmail(value)) {
            setErrors({ email: 'Invalid email' });
        } else {
            setErrors({});
        }
    };
    
    return (
        <div>
            <input value={email} onChange={handleChange} />
            {errors.email && <span>{errors.email}</span>}
        </div>
    );
}

// BUT client validation is not secure!
// Attacker can bypass and send invalid data
```

### Server-side Validation (Essential)
```javascript
// Server MUST validate everything
// Never trust client input

app.post('/register', (req, res) => {
    const { email, password } = req.body;
    
    // Validate email
    if (!email || !email.includes('@')) {
        return res.status(400).json({ error: 'Invalid email' });
    }
    
    // Validate password strength
    if (!password || password.length < 8) {
        return res.status(400).json({ error: 'Password too weak' });
    }
    
    // ... rest of logic
});
```

---

## 5. Authentication Best Practices

### Storing Tokens
```javascript
// ✗ WRONG - Storing in localStorage (vulnerable to XSS)
localStorage.setItem('token', token);
const token = localStorage.getItem('token');

// ✓ BETTER - HttpOnly cookie (can't access from JS)
// Set by server:
// Set-Cookie: token=abc123; HttpOnly; Secure; SameSite=Strict

// Automatically sent with requests
fetch('/api/data', { credentials: 'include' });

// Can't access from JavaScript (safe from XSS)
// But sent automatically with every request
```

### Protecting Routes
```javascript
function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();
    
    if (loading) return <div>Loading...</div>;
    
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    
    return children;
}

// Check if token is valid
function useAuth() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        // Check if user is logged in
        fetch('/api/me', { credentials: 'include' })
            .then(r => {
                if (!r.ok) throw new Error('Not authenticated');
                return r.json();
            })
            .then(setUser)
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);
    
    return { user, loading };
}
```

---

## 6. Environment Variables

### Sensitive Data
```javascript
// ✗ WRONG - Hardcoding API keys
const API_KEY = 'sk_live_123456789';
const API_URL = 'https://api.example.com';

// ✓ CORRECT - Use environment variables
const API_KEY = process.env.REACT_APP_API_KEY;
const API_URL = process.env.REACT_APP_API_URL;

// .env file (never commit!)
REACT_APP_API_KEY=sk_live_123456789
REACT_APP_API_URL=https://api.example.com
REACT_APP_API_SECRET=secret123  // ✗ DON'T expose secrets!

// In .gitignore:
.env
.env.local
.env.*.local

// Note: REACT_APP_ prefix required for Create React App
// Everything gets bundled, so never put secrets in .env

// Secrets must only be on backend!
```

### Environment-specific Config
```javascript
// config.js
export const config = {
    development: {
        apiUrl: 'http://localhost:3000',
        debug: true
    },
    production: {
        apiUrl: 'https://api.example.com',
        debug: false
    }
};

const env = process.env.NODE_ENV;
export default config[env];

// Usage
import config from './config';
fetch(`${config.apiUrl}/api/users`);
```

---

## 7. Common Interview Patterns

### Common Questions
```
Q1: Difference between state and props?
A: State is local and mutable, props are passed and immutable.

Q2: What is Virtual DOM?
A: JavaScript representation of real DOM, React compares for efficiency.

Q3: What is controlled component?
A: Component where React controls input value via state.

Q4: What are hooks?
A: Functions that let you use state/effects in functional components.

Q5: What is key in list?
A: Unique identifier helping React identify which items changed.

Q6: Difference between useEffect and useLayoutEffect?
A: useEffect runs async after render, useLayoutEffect runs sync after DOM updates.

Q7: What is prop drilling?
A: Passing props through many intermediate components.

Q8: What is Context API?
A: Way to share data without prop drilling.

Q9: What is Redux?
A: Predictable state management library.

Q10: Difference between React and Vue?
A: React is more flexible, Vue is more opinionated.
```

---

## 8. Performance Tips

### Performance Checklist
```javascript
// ✓ USE:
// 1. React.memo for expensive components
const MemoComponent = React.memo(Component);

// 2. useCallback for functions in props
const memoizedFn = useCallback(() => {}, [deps]);

// 3. useMemo for expensive calculations
const memoizedValue = useMemo(() => calculate(), [deps]);

// 4. Code splitting
const Component = React.lazy(() => import('./Component'));

// 5. Proper keys in lists
<li key={item.id}>{item.name}</li>  // Good
<li key={index}>{item.name}</li>    // Bad

// ✗ AVOID:
// 1. Creating new objects/functions in render
<Child style={{ color: 'red' }} />      // New object every render
<Child onClick={() => fn()} />          // New function every render

// 2. Unnecessary re-renders
// Don't pass changing objects to memoized children

// 3. Large bundles
// Use code splitting, tree shaking

// 4. Missing dependencies
useEffect(() => { /* uses dep */ }, []);  // Missing dependency!

// 5. Memory leaks
useEffect(() => {
    const timer = setInterval(() => {});
    // Need cleanup function!
});
```

---

## Exercises

### Exercise 1: Safe Input Handling
```javascript
// Create form that:
// - Validates on client
// - Sends to backend for validation
// - Shows errors

function SafeForm() {
    // Your code
}
```

**Solution:**
```javascript
function SafeForm() {
    const [input, setInput] = useState('');
    const [error, setError] = useState('');
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Client validation
        if (!input.trim()) {
            setError('Required');
            return;
        }
        
        // Send to server for validation
        try {
            const response = await fetch('/api/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data: input })
            });
            
            if (!response.ok) {
                const data = await response.json();
                setError(data.error);
            }
        } catch (err) {
            setError('Server error');
        }
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <input value={input} onChange={e => setInput(e.target.value)} />
            {error && <span className="error">{error}</span>}
            <button>Submit</button>
        </form>
    );
}
```

### Exercise 2: Protected API Call
```javascript
// Create hook for authenticated API requests
// Include token in headers

function useProtectedApi(url) {
    // Your code
}
```

**Solution:**
```javascript
function useProtectedApi(url) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        setLoading(true);
        
        const token = localStorage.getItem('token');  // Or get from cookie
        
        fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            credentials: 'include'  // Send cookies
        })
            .then(r => {
                if (r.status === 401) throw new Error('Unauthorized');
                return r.json();
            })
            .then(setData)
            .catch(setError)
            .finally(() => setLoading(false));
    }, [url]);
    
    return { data, loading, error };
}
```

### Exercise 3: Sanitized HTML
```javascript
// Display user-generated HTML safely
// Use DOMPurify

function UserComment({ html }) {
    // Your code
}
```

**Solution:**
```javascript
import DOMPurify from 'dompurify';

function UserComment({ html }) {
    const sanitized = DOMPurify.sanitize(html, {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'br', 'p'],
        ALLOWED_ATTR: []
    });
    
    return (
        <div dangerouslySetInnerHTML={{ __html: sanitized }} />
    );
}
```

---

## Interview Questions

### Security Questions

**Q1: How to prevent XSS?**
A: React escapes by default, avoid dangerouslySetInnerHTML, validate input.

**Q2: What is CSRF?**
A: Cross-Site Request Forgery - attacker tricks you into making unwanted request.

**Q3: Where to store tokens?**
A: HttpOnly cookies (safest), localStorage if necessary.

**Q4: Why validate on backend?**
A: Client validation can be bypassed, only backend is secure.

**Q5: What is Content Security Policy?**
A: HTTP header that restricts script/style/image sources.

---

## Code-Based Interview Questions

**Q1: What is vulnerable?**
```javascript
<div dangerouslySetInnerHTML={{ __html: userInput }} />
// How to fix?
```
A: Use DOMPurify.sanitize() before passing

**Q2: Predict:**
```javascript
const API_KEY = process.env.REACT_APP_SECRET;
// Will this work?
```
A: No, secrets not sent to frontend, use REACT_APP_ prefix

**Q3: What is issue?**
```javascript
localStorage.setItem('token', token);
// Is this secure?
```
A: No, vulnerable to XSS, use HttpOnly cookie

**Q4: Spot the issue:**
```javascript
fetch('/api/delete', { method: 'DELETE' });
// Missing protection?
```
A: Should include CSRF token

**Q5: What is correct?**
```javascript
// Should validate password?
if (password.length > 0) submit();
// Or on backend?
```
A: Both - client for UX, backend for security

---

## Follow-up Questions & Confusing Concepts

**Q: Does React prevent XSS?**
A: Yes by default, but dangerouslySetInnerHTML bypasses it.

**Q: Can I store secrets in .env?**
A: No, they get bundled, use backend only.

**Q: Is client validation enough?**
A: No, only for UX, backend validation is mandatory.

**Q: What if forgot CSRF token?**
A: Vulnerable to attacks, server should require token.

---

## Summary

- **XSS**: Avoid dangerouslySetInnerHTML, let React escape
- **CSRF**: Use tokens on state-changing requests
- **Input Validation**: Client for UX, backend for security
- **Tokens**: Store in HttpOnly cookies, not localStorage
- **Secrets**: Never in code or frontend .env
- **CSP Header**: Restricts script sources
- **DOMPurify**: Sanitize HTML if necessary
- **Environment Variables**: Use REACT_APP_ prefix
- **Backend Validation**: Always validate server-side
- **Dependencies**: Keep secure, use npm audit

**Next Step:** Become an expert!
