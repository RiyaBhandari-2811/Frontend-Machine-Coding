# Web Storage APIs - localStorage & sessionStorage

## Table of Contents
1. Introduction to Web Storage
2. localStorage vs sessionStorage
3. localStorage Methods
4. Working with Complex Data
5. Storage Events
6. Best Practices
7. Limitations and Alternatives
8. Practical Examples
9. Security Considerations

---

## 1. Introduction to Web Storage

### What is Web Storage?
- **Web Storage**: Store data on client side (browser)
- Persists data between page reloads
- More space than cookies (5-10MB)
- Synchronous API
- Only accessible via same origin

### Why Use Web Storage?
```javascript
// Before: Store data in cookies
document.cookie = "username=John; expires=...";

// Now: Use localStorage (cleaner!)
localStorage.setItem('username', 'John');

// Also: sessionStorage for temporary data
sessionStorage.setItem('sessionId', 'abc123');
```

### Browser Support
```javascript
// Check if localStorage available
if (typeof(Storage) !== 'undefined') {
    // localStorage available
} else {
    // No web storage support
}

// Works in all modern browsers
// Not available in private/incognito mode sometimes
```

---

## 2. localStorage vs sessionStorage

### Key Differences
```javascript
// localStorage - Persists forever (until manually deleted)
localStorage.setItem('theme', 'dark');
// Close browser - data still there!
// Reopen - data exists!

// sessionStorage - Deleted when browser/tab closes
sessionStorage.setItem('sessionId', 'xyz');
// Close browser - data deleted!

// Both:
// - Same methods
// - Same origin only (domain + protocol + port)
// - 5-10MB space (browser dependent)
// - Synchronous (can block UI)
// - String values only
```

### Storage Scope
```javascript
// localStorage scope
// Same origin = same domain, protocol, port
localStorage.setItem('key', 'value');

// In same origin:
console.log(localStorage.getItem('key'));  // 'value'

// In different domain:
// Can't access! Different origin

// sessionStorage scope
// Same origin AND same tab
sessionStorage.setItem('tabId', '123');

// In same tab, same origin:
console.log(sessionStorage.getItem('tabId'));  // '123'

// In different tab:
// Can't access! Different session
```

---

## 3. localStorage Methods

### setItem() - Store Data
```javascript
// Store key-value pair
localStorage.setItem('username', 'John');
localStorage.setItem('age', '25');
localStorage.setItem('email', 'john@example.com');

// Overwrites if key exists
localStorage.setItem('username', 'Jane');  // John -> Jane

// Values are always strings
localStorage.setItem('number', 123);
console.log(typeof localStorage.getItem('number'));  // 'string'!
```

### getItem() - Retrieve Data
```javascript
// Get value by key
console.log(localStorage.getItem('username'));  // 'Jane'
console.log(localStorage.getItem('age'));       // '25'

// Returns null if key doesn't exist
console.log(localStorage.getItem('nonexistent')); // null

// Always check for null
let theme = localStorage.getItem('theme');
if (theme === null) {
    theme = 'light';  // Default value
}
```

### removeItem() - Delete Single Item
```javascript
localStorage.setItem('temp', 'temporary');
console.log(localStorage.getItem('temp'));  // 'temporary'

localStorage.removeItem('temp');
console.log(localStorage.getItem('temp'));  // null

// Doesn't throw error if key doesn't exist
localStorage.removeItem('nonexistent');  // No error!
```

### clear() - Delete All
```javascript
localStorage.setItem('a', '1');
localStorage.setItem('b', '2');
localStorage.setItem('c', '3');

console.log(localStorage.length);  // 3

localStorage.clear();
console.log(localStorage.length);  // 0
// All data deleted!
```

### key() - Get Key by Index
```javascript
localStorage.setItem('name', 'John');
localStorage.setItem('age', '25');
localStorage.setItem('email', 'john@example.com');

console.log(localStorage.key(0));  // 'name'
console.log(localStorage.key(1));  // 'age'
console.log(localStorage.key(2));  // 'email'
console.log(localStorage.key(3));  // null

// Loop through all items
for (let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    let value = localStorage.getItem(key);
    console.log(key, value);
}
```

### length Property
```javascript
console.log(localStorage.length);  // Number of items

localStorage.setItem('a', '1');
console.log(localStorage.length);  // 1

localStorage.setItem('b', '2');
console.log(localStorage.length);  // 2

localStorage.removeItem('a');
console.log(localStorage.length);  // 1
```

---

## 4. Working with Complex Data

### Storing Objects
```javascript
// Problem: Can only store strings!
let user = { name: 'John', age: 25 };
localStorage.setItem('user', user);
console.log(localStorage.getItem('user'));  // '[object Object]' ✗

// Solution: Use JSON.stringify
localStorage.setItem('user', JSON.stringify(user));
console.log(localStorage.getItem('user'));  // '{"name":"John","age":25}'

// Retrieve and parse
let retrieved = JSON.parse(localStorage.getItem('user'));
console.log(retrieved.name);  // 'John'
```

### Storing Arrays
```javascript
let colors = ['red', 'green', 'blue'];
localStorage.setItem('colors', JSON.stringify(colors));

let retrieved = JSON.parse(localStorage.getItem('colors'));
console.log(retrieved[0]);  // 'red'

// Or with default if null
let colors2 = JSON.parse(localStorage.getItem('colors')) || [];
```

### Storing Complex Structures
```javascript
let app = {
    settings: {
        theme: 'dark',
        language: 'en'
    },
    data: [1, 2, 3],
    lastUpdate: new Date().toISOString()
};

// Save
localStorage.setItem('app', JSON.stringify(app));

// Load
let loaded = JSON.parse(localStorage.getItem('app'));
console.log(loaded.settings.theme);  // 'dark'

// Note: Methods are lost!
// If object has functions, they won't be stored
```

---

## 5. Storage Events

### Storage Event Listener
```javascript
// Listen for storage changes (from other tabs/windows)
window.addEventListener('storage', (event) => {
    console.log('Storage changed!');
    console.log('Key:', event.key);
    console.log('Old value:', event.oldValue);
    console.log('New value:', event.newValue);
    console.log('URL:', event.url);  // Which page changed it
});

// Storage event fired in OTHER tabs!
// Not in the tab that made the change
```

### Cross-Tab Communication
```javascript
// Tab 1: Save data
localStorage.setItem('message', 'Hello from Tab 1');

// Tab 2: Listen for changes
window.addEventListener('storage', (event) => {
    if (event.key === 'message') {
        console.log('Message:', event.newValue);
        // Alert user, update UI, etc
    }
});

// Good for syncing state across tabs
```

### Storage Quota Event
```javascript
// Listen for storage quota exceeded
navigator.storage.addEventListener('persistentStorageQuotaExceeded', () => {
    console.log('Storage quota exceeded!');
    // Clear some data or notify user
});

// Check quota
navigator.storage.estimate().then(estimate => {
    console.log('Usage:', estimate.usage);
    console.log('Quota:', estimate.quota);
    console.log('Percentage:', (estimate.usage / estimate.quota * 100) + '%');
});
```

---

## 6. Best Practices

### Naming Convention
```javascript
// Use namespacing to avoid conflicts
localStorage.setItem('app:username', 'John');
localStorage.setItem('app:theme', 'dark');
localStorage.setItem('app:language', 'en');

// Or use object structure
let appData = {
    username: 'John',
    theme: 'dark'
};
localStorage.setItem('app', JSON.stringify(appData));

// Or prefix classes
class UserPreferences {
    constructor() {
        this.prefix = 'userprefs:';
    }
    
    set(key, value) {
        localStorage.setItem(this.prefix + key, JSON.stringify(value));
    }
    
    get(key) {
        let val = localStorage.getItem(this.prefix + key);
        return val ? JSON.parse(val) : null;
    }
}
```

### Error Handling
```javascript
function safeStorage(key, value) {
    try {
        // Check if localStorage available
        if (!window.localStorage) {
            throw new Error('localStorage not available');
        }
        
        // Check quota
        localStorage.setItem(key, value);
    } catch (e) {
        if (e.name === 'QuotaExceededError') {
            console.log('Storage full!');
        } else {
            console.log('Storage error:', e);
        }
    }
}

// Use it
safeStorage('key', 'value');
```

### Setting Defaults
```javascript
function getItem(key, defaultValue) {
    let value = localStorage.getItem(key);
    
    if (value === null) {
        return defaultValue;
    }
    
    try {
        return JSON.parse(value);
    } catch {
        return value;  // Raw string if can't parse
    }
}

console.log(getItem('theme', 'light'));      // 'light' or stored value
console.log(getItem('config', {}));          // {} or stored object
```

---

## 7. Limitations and Alternatives

### Limitations
```javascript
// 1. String values only
localStorage.setItem('number', 123);
let n = localStorage.getItem('number');
console.log(typeof n);  // 'string', not 'number'!

// 2. Synchronous (can block UI)
localStorage.setItem('key', 'value');  // Blocks main thread

// 3. 5-10MB limit (small for large apps)
// 4. Not encrypted
// 5. Shared across all tabs/windows of same origin
// 6. Lost on data/app clear
```

### Alternatives
```javascript
// SessionStorage - same as localStorage but clears on close
sessionStorage.setItem('sessionId', 'xyz');

// IndexedDB - NoSQL database, async, large storage
// Good for large datasets

// Service Worker Cache - cache API responses
// Good for offline support

// Cookies - small, sent to server, can set expiration
// Good for authentication

// Memory - fastest but lost on page refresh
let cache = {};
cache.theme = 'dark';
```

---

## 8. Practical Examples

### Save User Preferences
```javascript
class UserPrefs {
    constructor() {
        this.storage = localStorage;
        this.prefix = 'prefs:';
    }
    
    setTheme(theme) {
        this.storage.setItem(this.prefix + 'theme', theme);
    }
    
    getTheme() {
        return this.storage.getItem(this.prefix + 'theme') || 'light';
    }
    
    setLanguage(lang) {
        this.storage.setItem(this.prefix + 'language', lang);
    }
    
    getLanguage() {
        return this.storage.getItem(this.prefix + 'language') || 'en';
    }
    
    clear() {
        this.storage.removeItem(this.prefix + 'theme');
        this.storage.removeItem(this.prefix + 'language');
    }
}

// Usage
let prefs = new UserPrefs();
prefs.setTheme('dark');
prefs.setLanguage('es');

console.log(prefs.getTheme());     // 'dark'
console.log(prefs.getLanguage());  // 'es'
```

### Form Auto-Save
```javascript
class FormAutoSave {
    constructor(formId, storageKey) {
        this.form = document.getElementById(formId);
        this.key = storageKey;
        this.loadData();
        this.setupAutoSave();
    }
    
    setupAutoSave() {
        this.form.addEventListener('input', (e) => {
            let formData = new FormData(this.form);
            let data = Object.fromEntries(formData);
            localStorage.setItem(this.key, JSON.stringify(data));
        });
    }
    
    loadData() {
        let saved = localStorage.getItem(this.key);
        if (saved) {
            let data = JSON.parse(saved);
            for (let [key, value] of Object.entries(data)) {
                let field = this.form.elements[key];
                if (field) field.value = value;
            }
        }
    }
    
    clear() {
        localStorage.removeItem(this.key);
    }
}

// Usage
new FormAutoSave('myForm', 'form-data');
```

### Shopping Cart
```javascript
class Cart {
    constructor() {
        this.key = 'cart';
        this.items = JSON.parse(localStorage.getItem(this.key)) || [];
    }
    
    addItem(id, name, price) {
        let item = this.items.find(i => i.id === id);
        if (item) {
            item.quantity++;
        } else {
            this.items.push({ id, name, price, quantity: 1 });
        }
        this.save();
    }
    
    removeItem(id) {
        this.items = this.items.filter(i => i.id !== id);
        this.save();
    }
    
    getTotal() {
        return this.items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    }
    
    getItems() {
        return this.items;
    }
    
    clear() {
        this.items = [];
        this.save();
    }
    
    save() {
        localStorage.setItem(this.key, JSON.stringify(this.items));
    }
}

// Usage
let cart = new Cart();
cart.addItem(1, 'Book', 10);
cart.addItem(2, 'Pen', 2);
console.log(cart.getTotal());  // 12
```

---

## 9. Security Considerations

### XSS Vulnerability
```javascript
// DANGER: Don't store user input directly
let userInput = getUserInput();  // Could be malicious
localStorage.setItem('data', userInput);

// Later:
let data = localStorage.getItem('data');
document.innerHTML = data;  // XSS attack!

// SAFE: Sanitize input
localStorage.setItem('data', sanitize(userInput));

// Or use textContent instead of innerHTML
document.getElementById('output').textContent = data;
```

### CSRF Protection
```javascript
// Don't use localStorage for CSRF tokens
// Use httpOnly cookies instead
// Cookies sent to server automatically with requests

// localStorage requires manual header:
let token = localStorage.getItem('csrf-token');
fetch('/api/post', {
    method: 'POST',
    headers: {
        'X-CSRF-Token': token
    }
});
```

### Sensitive Data
```javascript
// NEVER store passwords, credit cards, etc in localStorage
// It's visible in DevTools!
// Use secure httpOnly cookies instead

// OK to store:
// - User preferences
// - Non-sensitive settings
// - Form drafts
// - Session IDs (can be stolen but not sensitive)

// NOT OK to store:
// - Passwords
// - Credit cards
// - Tokens (unless JWT and not sensitive)
```

---

## Exercises

### Exercise 1: Todo List
```javascript
// Store todos in localStorage
// Implement: addTodo(), getTodos(), removeTodo()
class TodoList {
    // Your code
}

let todos = new TodoList();
todos.addTodo('Buy milk');
todos.addTodo('Read book');
console.log(todos.getTodos());
```

**Solution:**
```javascript
class TodoList {
    constructor() {
        this.key = 'todos';
        this.todos = JSON.parse(localStorage.getItem(this.key)) || [];
    }
    
    addTodo(text) {
        this.todos.push({ id: Date.now(), text, done: false });
        this.save();
    }
    
    getTodos() {
        return this.todos;
    }
    
    removeTodo(id) {
        this.todos = this.todos.filter(t => t.id !== id);
        this.save();
    }
    
    save() {
        localStorage.setItem(this.key, JSON.stringify(this.todos));
    }
}
```

### Exercise 2: Theme Switcher
```javascript
// Switch between light/dark theme, save preference
function saveTheme(theme) {
    // Your code
}

function loadTheme() {
    // Your code
    // Return 'light' or 'dark'
}
```

**Solution:**
```javascript
function saveTheme(theme) {
    localStorage.setItem('theme', theme);
    document.body.className = theme;
}

function loadTheme() {
    let theme = localStorage.getItem('theme') || 'light';
    document.body.className = theme;
    return theme;
}
```

---

## Interview Questions

### Theoretical Questions

**Q1: What's the difference between localStorage and sessionStorage?**
A: localStorage persists until deleted, sessionStorage deleted when tab closes.

**Q2: What type of data can I store?**
A: Only strings. Use JSON.stringify/parse for objects.

**Q3: What's the storage size limit?**
A: Usually 5-10MB per origin (browser dependent).

**Q4: When is storage event triggered?**
A: When storage changes in OTHER tabs/windows of same origin.

**Q5: Can I store password in localStorage?**
A: No, it's not encrypted and visible in DevTools.

---

## Code-Based Interview Questions

**Q1: What will be output?**
```javascript
localStorage.setItem('number', 42);
console.log(typeof localStorage.getItem('number'));  // ?
```
A:
```
"string"
```

**Q2: Predict:**
```javascript
let obj = { name: 'John' };
localStorage.setItem('user', obj);
console.log(localStorage.getItem('user'));  // ?
```
A:
```
"[object Object]"
```
Explanation: Can't store object directly, need JSON.stringify

**Q3: What will be logged?**
```javascript
localStorage.setItem('a', '1');
localStorage.setItem('b', '2');
console.log(localStorage.getItem('c'));  // ?
```
A:
```
null
```

**Q4: Spot the issue:**
```javascript
sessionStorage.setItem('token', token);
// Tab closes - data is lost but app expects it
```
A: sessionStorage deleted on tab close, use localStorage if data should persist.

**Q5: What is output?**
```javascript
localStorage.clear();
console.log(localStorage.length);  // ?
```
A:
```
0
```

---

## Follow-up Questions & Confusing Concepts

**Q: Can I access localStorage from worker?**
A: No, only from main thread. Use postMessage to communicate.

**Q: Is localStorage synchronous?**
A: Yes, which can block UI for large data. Use IndexedDB for async.

**Q: Can I store Date objects?**
A: No, convert to string with toISOString() first.

**Q: Does storage event fire in same tab?**
A: No, only in other tabs/windows of same origin.

---

## Summary

- **localStorage**: Persistent storage, cleared only by user/code
- **sessionStorage**: Temporary, cleared when tab/browser closes
- **Methods**: setItem(), getItem(), removeItem(), clear()
- **Values**: Always strings, use JSON for objects
- **Storage event**: Fired in other tabs when data changes
- **Quota**: Usually 5-10MB per origin
- **Scope**: Same origin (domain + protocol + port)
- **Not secure**: Visible in DevTools, don't store passwords
- **Use cases**: Preferences, drafts, session data, offline data
- **Alternatives**: sessionStorage, IndexedDB, cookies, cache API

**Next Step:** Learn about advanced JavaScript patterns and performance optimization!
