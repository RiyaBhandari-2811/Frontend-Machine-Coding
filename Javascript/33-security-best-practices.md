# Security Best Practices

## Table of Contents
1. Common Security Vulnerabilities
2. Cross-Site Scripting (XSS)
3. Cross-Site Request Forgery (CSRF)
4. Injection Attacks
5. Sensitive Data Handling
6. Authentication & Authorization
7. API Security
8. Browser Security Features
9. Best Practices

---

## 1. Common Security Vulnerabilities

### OWASP Top 10
```javascript
// Most common web vulnerabilities:
// 1. Injection (SQL, Command, etc)
// 2. Broken Authentication
// 3. Sensitive Data Exposure
// 4. XML External Entities (XXE)
// 5. Broken Access Control
// 6. Security Misconfiguration
// 7. Cross-Site Scripting (XSS)
// 8. Insecure Deserialization
// 9. Using Components with Known Vulnerabilities
// 10. Insufficient Logging & Monitoring
```

---

## 2. Cross-Site Scripting (XSS)

### Stored XSS
```javascript
// ✗ VULNERABLE - User input directly in HTML
function displayComment(comment) {
    document.getElementById('comments').innerHTML = comment;
}

// User submits: <script>alert('Hacked!')</script>
// Script executes when page loads!

// ✓ SECURE - Escape HTML entities
function displayComment(comment) {
    let escaped = document.createElement('div');
    escaped.textContent = comment;  // Uses textContent (escapes)
    document.getElementById('comments').appendChild(escaped);
}

// Or use library
// npm install xss
// const xss = require('xss');
// let sanitized = xss(comment);
```

### Reflected XSS
```javascript
// ✗ VULNERABLE - Using URL parameters directly
let name = new URLSearchParams(window.location.search).get('name');
document.getElementById('greeting').innerHTML = `Hello, ${name}!`;

// URL: ?name=<img src=x onerror="alert('XSS')">
// XSS executes!

// ✓ SECURE - Escape before rendering
let name = new URLSearchParams(window.location.search).get('name');
let escaped = document.createElement('div');
escaped.textContent = name;
document.getElementById('greeting').textContent = `Hello, ${escaped.textContent}!`;
```

### DOM-Based XSS
```javascript
// ✗ VULNERABLE - Using eval or innerHTML with user input
let userCode = getUserInput();
eval(userCode);  // NEVER DO THIS!

document.body.innerHTML = userCode;  // Also dangerous

// ✗ VULNERABLE - Setting dangerous properties
element.innerHTML = `<img src=x onerror="alert('XSS')">`;

// ✓ SECURE - Use textContent
element.textContent = userInput;

// ✓ SECURE - Use createElement
let img = document.createElement('img');
img.src = userInput;  // src is not evaluated as code
```

### Content Security Policy (CSP)
```javascript
// Add to HTML header
// <meta http-equiv="Content-Security-Policy" 
//       content="default-src 'self'; script-src 'self'">

// Or HTTP header
// Content-Security-Policy: default-src 'self'; script-src 'self'

// This:
// - Prevents inline scripts
// - Prevents eval()
// - Only allows scripts from same origin
// - Blocks inline event handlers

// Blocks XSS attacks effectively
```

---

## 3. Cross-Site Request Forgery (CSRF)

### CSRF Attack
```javascript
// ✗ VULNERABLE - No CSRF protection
// Attacker creates form on their site:
<form method="POST" action="https://bank.example.com/transfer">
  <input name="amount" value="1000">
  <input name="to" value="attacker-account">
</form>
<script>document.forms[0].submit();</script>

// If user is logged in to bank, transfer happens!

// ✓ SECURE - CSRF token verification
// Server sends unique token to client
let token = generateCSRFToken();

// Client includes token in request
fetch('https://bank.example.com/transfer', {
    method: 'POST',
    headers: {
        'X-CSRF-Token': token
    },
    body: JSON.stringify({
        amount: 1000,
        to: 'account123'
    })
});

// Server verifies token - attacker can't get it!
```

### SameSite Cookie
```javascript
// Set-Cookie: sessionid=abc123; SameSite=Strict

// SameSite options:
// 'Strict' - Only sent with same-site requests
// 'Lax' - Sent with top-level navigations
// 'None' - Sent with all requests (requires Secure flag)

// Prevents CSRF by blocking cross-site cookie sending
```

---

## 4. Injection Attacks

### SQL Injection
```javascript
// ✗ VULNERABLE - Concatenating user input
let userId = getUserInput();
let query = `SELECT * FROM users WHERE id = ${userId}`;
// User inputs: 1; DROP TABLE users; --
// Query becomes: SELECT * FROM users WHERE id = 1; DROP TABLE users; --

// ✓ SECURE - Use parameterized queries
let query = 'SELECT * FROM users WHERE id = ?';
executeQuery(query, [userId]);  // Parameter binding

// Or on backend with library
let user = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
```

### Command Injection
```javascript
// ✗ VULNERABLE - Executing user input as command
let filename = getUserInput();
require('child_process').exec(`cat ${filename}`);
// User inputs: file.txt; rm -rf /
// DISASTER!

// ✓ SECURE - Use array arguments (no shell parsing)
let { exec } = require('child_process');
exec('cat', [filename]);  // Arguments are escaped

// Or use safer alternatives
const fs = require('fs');
fs.readFileSync(filename);  // No shell involved
```

### Template Injection
```javascript
// ✗ VULNERABLE - Evaluating user input as template
let template = getUserInput();
let html = eval(`\`${template}\``);  // User input is code!

// ✓ SECURE - Use template engine safely
// Handlebars, EJS, Nunjucks handle escaping
let html = renderTemplate('template.html', { userInput });

// Or escape manually
let userInput = getUserInput();
let escaped = userInput
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
```

---

## 5. Sensitive Data Handling

### Never Log Secrets
```javascript
// ✗ WRONG - Logs password
function login(username, password) {
    console.log('User login:', username, password);  // NEVER!
    // ...
}

// ✓ CORRECT - Don't log sensitive data
function login(username, password) {
    console.log('User login:', username);  // Never log password
    // ...
}
```

### Secure Storage
```javascript
// ✗ UNSAFE - Storing in localStorage
localStorage.setItem('authToken', token);
// Vulnerable to XSS!

// ✗ UNSAFE - Storing in cookie without flags
document.cookie = `token=${token}`;
// Vulnerable to XSS!

// ✓ SECURE - HttpOnly cookie (server-side)
// Set-Cookie: token=abc123; HttpOnly; Secure; SameSite=Strict

// If must use localStorage, encrypt data
// const encrypted = encrypt(sensitiveData, key);
// localStorage.setItem('data', encrypted);
```

### Clear Sensitive Data
```javascript
// ✓ SECURE - Clear sensitive data after use
let password = getUserPassword();
// Authenticate...
password = null;  // Clear from memory

// Use TypedArrays for sensitive data
let sensitiveBuffer = new Uint8Array(32);
// ... use it ...
sensitiveBuffer.fill(0);  // Zero out memory
```

---

## 6. Authentication & Authorization

### Strong Passwords
```javascript
// ✗ WEAK - No validation
function setPassword(password) {
    // Accept any password
    user.password = password;
}

// ✓ STRONG - Validate requirements
function setPassword(password) {
    if (password.length < 12) {
        throw new Error('Password must be 12+ characters');
    }
    if (!/[A-Z]/.test(password)) {
        throw new Error('Password must contain uppercase');
    }
    if (!/[a-z]/.test(password)) {
        throw new Error('Password must contain lowercase');
    }
    if (!/[0-9]/.test(password)) {
        throw new Error('Password must contain number');
    }
    if (!/[!@#$%^&*]/.test(password)) {
        throw new Error('Password must contain special char');
    }
    
    // Hash password (NEVER store plaintext!)
    user.password = hashPassword(password);
}
```

### Multi-Factor Authentication
```javascript
// ✓ SECURE - Require multiple verification methods
async function login(username, password) {
    // Check password
    let user = await verifyPassword(username, password);
    
    // Send 2FA code
    let code = generateCode();
    sendCode(user.email, code);
    
    // Require code verification
    return { requiresCode: true, sessionId: generateSession() };
}

// User enters code
async function verifyCode(sessionId, code) {
    // Verify code matches
    if (!verifyCode(sessionId, code)) {
        throw new Error('Invalid code');
    }
    
    // Create authenticated session
    return generateAuthToken();
}
```

---

## 7. API Security

### Input Validation
```javascript
// ✗ VULNERABLE - No validation
app.post('/api/user', (req, res) => {
    let user = req.body;
    db.insert(user);  // No validation!
});

// ✓ SECURE - Validate all input
app.post('/api/user', (req, res) => {
    let { email, name, age } = req.body;
    
    // Validate email
    if (!isValidEmail(email)) {
        return res.status(400).json({ error: 'Invalid email' });
    }
    
    // Validate name
    if (typeof name !== 'string' || name.length < 1 || name.length > 100) {
        return res.status(400).json({ error: 'Invalid name' });
    }
    
    // Validate age
    if (!Number.isInteger(age) || age < 0 || age > 150) {
        return res.status(400).json({ error: 'Invalid age' });
    }
    
    db.insert({ email, name, age });
    res.json({ success: true });
});
```

### Rate Limiting
```javascript
// Prevent brute force attacks
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 100  // Limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);

// Or implement custom rate limiting
let attempts = {};
app.post('/api/login', (req, res) => {
    let ip = req.ip;
    attempts[ip] = (attempts[ip] || 0) + 1;
    
    if (attempts[ip] > 5) {
        return res.status(429).json({ error: 'Too many attempts' });
    }
    
    // ... login logic ...
    
    // Reset after successful login
    attempts[ip] = 0;
});
```

---

## 8. Browser Security Features

### HTTPS Only
```javascript
// ✗ UNSAFE - Using HTTP
// All traffic is unencrypted!

// ✓ SECURE - Use HTTPS
// All traffic is encrypted

// Force HTTPS
// Add to HTML header:
// <meta http-equiv="upgrade-insecure-requests" content="1">

// Or HTTP header:
// Strict-Transport-Security: max-age=31536000; includeSubDomains
```

### X-Frame-Options
```javascript
// Prevent clickjacking
// Add HTTP header:
// X-Frame-Options: DENY

// Or allow only same-origin:
// X-Frame-Options: SAMEORIGIN

// Prevents your site from being framed
// Protects against clickjacking attacks
```

### X-XSS-Protection
```javascript
// Legacy XSS filter (modern CSP preferred)
// Add HTTP header:
// X-XSS-Protection: 1; mode=block

// But use Content-Security-Policy instead
// (more robust and modern)
```

---

## 9. Best Practices

### Principle of Least Privilege
```javascript
// Give only necessary permissions
// ✗ WRONG - Admin to edit profile
let user = { role: 'admin' };
editProfile(user);  // Too much power

// ✓ CORRECT - Specific permission
let user = { permissions: ['edit-profile'] };
if (user.permissions.includes('edit-profile')) {
    editProfile(user);
}
```

### Defense in Depth
```javascript
// Multiple layers of security
// 1. Client-side validation (UX)
// 2. HTTPS encryption (transport)
// 3. Server-side validation (security)
// 4. Database access control (storage)
// 5. Audit logging (detection)

// Don't rely on single layer
```

### Regular Updates
```javascript
// Keep dependencies updated
// npm audit
// npm update

// Check for vulnerabilities
// npm install -g snyk
// snyk test

// Use security tools
// GitHub security alerts
// npm audit
// OWASP ZAP
```

---

## Exercises

### Exercise 1: Fix XSS
```javascript
// Fix this XSS vulnerability
function displayUserComment(comment) {
    document.getElementById('comments').innerHTML = comment;
}
```

**Solution:**
```javascript
function displayUserComment(comment) {
    let div = document.createElement('div');
    div.textContent = comment;  // Safe - no HTML parsing
    document.getElementById('comments').appendChild(div);
}
```

### Exercise 2: Validate Input
```javascript
// Add validation to email input
function setEmail(email) {
    user.email = email;  // No validation!
}
```

**Solution:**
```javascript
function setEmail(email) {
    // Validate email format
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        throw new Error('Invalid email format');
    }
    user.email = email;
}
```

### Exercise 3: Secure Password Storage
```javascript
// Store password securely
function setPassword(plaintext) {
    user.password = plaintext;  // WRONG!
}
```

**Solution:**
```javascript
const bcrypt = require('bcrypt');

async function setPassword(plaintext) {
    // Hash with salt
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(plaintext, salt);
}
```

---

## Interview Questions

### Theoretical Questions

**Q1: What is XSS?**
A: Cross-Site Scripting - injecting malicious scripts into web pages.

**Q2: What is CSRF?**
A: Cross-Site Request Forgery - forcing users to perform unwanted actions.

**Q3: How do you prevent XSS?**
A: Escape HTML, use Content Security Policy, validate input.

**Q4: What should never be stored client-side?**
A: Sensitive data like passwords, keys, tokens in localStorage.

**Q5: What is HTTPS?**
A: HTTP over SSL/TLS - encrypts data in transit.

---

## Code-Based Interview Questions

**Q1: What will be output?**
```javascript
let html = '<img src=x onerror="alert(1)">';
document.body.innerHTML = html;
// ?
```
A:
```
XSS attack - alert(1) executes
```

**Q2: Predict:**
```javascript
let userInput = '</script><script>alert(2)</script>';
element.textContent = userInput;
// ?
```
A:
```
No XSS - textContent escapes
```

**Q3: What is dangerous?**
```javascript
let code = getUserInput();
eval(code);  // ?
```
A: XSS/Code injection vulnerability

**Q4: Spot the issue:**
```javascript
localStorage.setItem('token', authToken);
// Vulnerable to?
```
A: XSS attacks

**Q5: What is output?**
```javascript
password.length > 8 ? 'strong' : 'weak';
// Adequate validation?
```
A: No - password needs complexity requirements too

---

## Follow-up Questions & Confusing Concepts

**Q: Does HTTPS prevent XSS?**
A: No, only encrypts transport. Need CSP, escaping, validation.

**Q: Can I trust client-side validation?**
A: No, always validate on server too.

**Q: Is localStorage safe?**
A: No, vulnerable to XSS. Never store sensitive data there.

**Q: Should I store JWT in localStorage?**
A: Risky. HttpOnly cookie is more secure.

---

## Summary

- **XSS**: Inject malicious scripts - prevent with escaping and CSP
- **CSRF**: Force unwanted actions - prevent with tokens and SameSite
- **Injection**: Malicious input in queries - prevent with parameterization
- **Authentication**: Use strong passwords, 2FA, secure storage
- **API Security**: Validate all input, rate limit, use HTTPS
- **Browser**: Use HTTPS, CSP, security headers
- **Data**: Never log secrets, use HttpOnly cookies
- **Principles**: Least privilege, defense in depth, regular updates
- **Never trust**: Client-side validation, user input, localStorage
- **Best practice**: Security by design, regular audits

**Next Step:** Master Web Workers and threading patterns!
