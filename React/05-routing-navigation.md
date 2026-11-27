# React Router & Navigation

## Table of Contents
1. React Router Setup
2. Basic Routing
3. Navigation
4. Route Parameters
5. Query Strings
6. Nested Routes
7. Protected Routes
8. Navigation Guards

---

## 1. React Router Setup

### Installation & Setup
```javascript
// Install
npm install react-router-dom

// App.js
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

// File structure:
// src/
//   pages/
//     Home.js
//     About.js
//     Contact.js
//   App.js
```

### Layout with Routing
```javascript
function App() {
    return (
        <BrowserRouter>
            <Navigation />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
            </Routes>
            <Footer />
        </BrowserRouter>
    );
}

function Navigation() {
    return (
        <nav>
            <a href="/">Home</a>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
        </nav>
    );
}
```

---

## 2. Basic Routing

### Route Basics
```javascript
// Simple route
<Route path="/" element={<Home />} />

// Route with component that takes props
<Route path="/user" element={<User userName="John" />} />

// 404 Not Found - wildcard route
<Routes>
    <Route path="/" element={<Home />} />
    <Route path="*" element={<NotFound />} />
</Routes>

// Redirects
import { Navigate } from 'react-router-dom';

<Route path="/old-path" element={<Navigate to="/new-path" />} />
```

### Component Access to Route Data
```javascript
import { useLocation, useNavigate } from 'react-router-dom';

function Contact() {
    const location = useLocation();
    const navigate = useNavigate();
    
    console.log('Current path:', location.pathname);
    
    const handleClick = () => {
        navigate('/');  // Go to home
    };
    
    return <button onClick={handleClick}>Go Home</button>;
}
```

---

## 3. Navigation

### Using Link Component (Preferred)
```javascript
import { Link } from 'react-router-dom';

function Navigation() {
    return (
        <nav>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
        </nav>
    );
}

// Benefits:
// 1. Doesn't reload page
// 2. Only updates necessary components
// 3. Browser history works
// 4. Can use active styling
```

### NavLink (Active Styling)
```javascript
import { NavLink } from 'react-router-dom';

function Navigation() {
    return (
        <nav>
            <NavLink
                to="/"
                className={({ isActive }) => isActive ? 'active' : ''}
            >
                Home
            </NavLink>
            <NavLink
                to="/about"
                className={({ isActive }) => isActive ? 'active' : ''}
            >
                About
            </NavLink>
        </nav>
    );
}

// CSS
/* .active { color: red; } */
```

### useNavigate Hook
```javascript
import { useNavigate } from 'react-router-dom';

function LoginForm() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    
    const handleLogin = async () => {
        const response = await fetch('/api/login', {
            method: 'POST',
            body: JSON.stringify({ email })
        });
        
        if (response.ok) {
            navigate('/dashboard');  // Redirect after login
        }
    };
    
    return (
        <form onSubmit={handleLogin}>
            <input value={email} onChange={e => setEmail(e.target.value)} />
            <button>Login</button>
        </form>
    );
}
```

### Browser History
```javascript
function Component() {
    const navigate = useNavigate();
    
    return (
        <div>
            <button onClick={() => navigate('/')}>Home</button>
            <button onClick={() => navigate(-1)}>Go Back</button>
            <button onClick={() => navigate(-2)}>Go Back 2 Pages</button>
        </div>
    );
}
```

---

## 4. Route Parameters

### URL Parameters
```javascript
// Define route with parameter
<Route path="/user/:id" element={<UserProfile />} />

// Component using parameter
import { useParams } from 'react-router-dom';

function UserProfile() {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    
    useEffect(() => {
        fetch(`/api/user/${id}`)
            .then(r => r.json())
            .then(setUser);
    }, [id]);
    
    if (!user) return <p>Loading...</p>;
    
    return <h1>{user.name}</h1>;
}

// Link to route
<Link to={`/user/123`}>View User 123</Link>
```

### Multiple Parameters
```javascript
// Route
<Route path="/user/:userId/post/:postId" element={<Post />} />

// Component
function Post() {
    const { userId, postId } = useParams();
    return <h1>User {userId}, Post {postId}</h1>;
}

// Link
<Link to="/user/123/post/456">View Post</Link>
```

### Optional Parameters
```javascript
// Route with optional parameter
<Route path="/user/:id?" element={<UserPage />} />

// Component
function UserPage() {
    const { id } = useParams();
    
    if (id) {
        return <h1>User {id}</h1>;
    } else {
        return <h1>All Users</h1>;
    }
}
```

---

## 5. Query Strings

### Reading Query Strings
```javascript
import { useSearchParams } from 'react-router-dom';

function SearchPage() {
    const [searchParams] = useSearchParams();
    
    const query = searchParams.get('q');
    const page = searchParams.get('page');
    
    return <h1>Search: {query} (Page {page})</h1>;
}

// URL: /search?q=react&page=2
// Output: Search: react (Page 2)
```

### Setting Query Strings
```javascript
function SearchForm() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [input, setInput] = useState('');
    
    const handleSearch = (e) => {
        e.preventDefault();
        setSearchParams({ q: input, page: 1 });
    };
    
    return (
        <form onSubmit={handleSearch}>
            <input value={input} onChange={e => setInput(e.target.value)} />
            <button>Search</button>
        </form>
    );
}
```

### Multiple Query Parameters
```javascript
function FilterPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    
    const category = searchParams.get('category');
    const price = searchParams.get('price');
    const sort = searchParams.get('sort');
    
    const handleFilter = (newCategory) => {
        setSearchParams({
            category: newCategory,
            price: price || 'all',
            sort: sort || 'name'
        });
    };
    
    return (
        <div>
            <button onClick={() => handleFilter('electronics')}>Electronics</button>
            <button onClick={() => handleFilter('books')}>Books</button>
        </div>
    );
}
```

---

## 6. Nested Routes

### Nested Routes Structure
```javascript
// App.js
<Routes>
    <Route path="/" element={<Home />} />
    <Route path="/dashboard" element={<Dashboard />}>
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        <Route path="analytics" element={<Analytics />} />
    </Route>
</Routes>

// Dashboard.js
import { Outlet, Link } from 'react-router-dom';

function Dashboard() {
    return (
        <div className="dashboard">
            <aside>
                <nav>
                    <Link to="/dashboard/profile">Profile</Link>
                    <Link to="/dashboard/settings">Settings</Link>
                    <Link to="/dashboard/analytics">Analytics</Link>
                </nav>
            </aside>
            <main>
                <Outlet />  {/* Renders nested route here */}
            </main>
        </div>
    );
}

// Profile.js
function Profile() {
    return <h1>User Profile</h1>;
}
```

### Relative Routes
```javascript
function Dashboard() {
    return (
        <div>
            <nav>
                <Link to="profile">Profile</Link>  {/* Relative to /dashboard */}
                <Link to="settings">Settings</Link>
            </nav>
            <Outlet />
        </div>
    );
}
```

---

## 7. Protected Routes

### Auth Guard
```javascript
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ isAuthenticated, children }) {
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    
    return children;
}

// Usage
function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}
```

### Role-based Access
```javascript
function AdminRoute({ user, children }) {
    if (!user || user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }
    
    return children;
}

// Usage
<Route
    path="/admin"
    element={
        <AdminRoute user={user}>
            <AdminPanel />
        </AdminRoute>
    }
/>
```

### Context with Protected Routes
```javascript
import { useAuth } from './AuthContext';

function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();
    
    if (loading) return <div>Loading...</div>;
    
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    
    return children;
}

// Usage
<Route
    path="/dashboard"
    element={
        <ProtectedRoute>
            <Dashboard />
        </ProtectedRoute>
    }
/>
```

---

## 8. Navigation Guards

### Before Navigation
```javascript
function App() {
    const [isDirty, setIsDirty] = useState(false);
    
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = 'Are you sure?';
            }
        };
        
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isDirty]);
    
    return <div>{/* ... */}</div>;
}
```

### Prompt Before Navigation
```javascript
import { useEffect } from 'react';

function FormPage() {
    const [isDirty, setIsDirty] = useState(false);
    const navigate = useNavigate();
    
    useEffect(() => {
        return () => {
            if (isDirty) {
                const confirmed = window.confirm('Discard changes?');
                if (!confirmed) {
                    navigate('/form');
                }
            }
        };
    }, [isDirty]);
    
    return (
        <form onChange={() => setIsDirty(true)}>
            {/* ... */}
        </form>
    );
}
```

---

## Exercises

### Exercise 1: Basic Routing
```javascript
// Create app with Home, About, Contact pages
// Add navigation bar

function App() {
    // Your code
}
```

**Solution:**
```javascript
function App() {
    return (
        <BrowserRouter>
            <Navigation />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
            </Routes>
        </BrowserRouter>
    );
}

function Navigation() {
    return (
        <nav>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/contact">Contact</NavLink>
        </nav>
    );
}
```

### Exercise 2: Route Parameters
```javascript
// Create user profile page with :id param
// Fetch and display user data

function App() {
    // Your code
}
```

**Solution:**
```javascript
function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/user/:id" element={<UserProfile />} />
            </Routes>
        </BrowserRouter>
    );
}

function UserProfile() {
    const { id } = useParams();
    const [user, setUser] = useState(null);
    
    useEffect(() => {
        fetch(`/api/user/${id}`)
            .then(r => r.json())
            .then(setUser);
    }, [id]);
    
    return user ? <h1>{user.name}</h1> : <p>Loading...</p>;
}
```

### Exercise 3: Protected Routes
```javascript
// Create login page
// Protect dashboard route
// Redirect to login if not authenticated

function App() {
    // Your code
}
```

**Solution:**
```javascript
function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login setAuthenticated={setIsAuthenticated} />} />
                <Route
                    path="/dashboard"
                    element={
                        isAuthenticated ? <Dashboard /> : <Navigate to="/login" />
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}
```

---

## Interview Questions

### Theoretical Questions

**Q1: What is React Router?**
A: Library for client-side routing (navigation without page reloads).

**Q2: What is difference between Link and anchor tag?**
A: Link doesn't reload page, anchor tag reloads.

**Q3: What are route parameters?**
A: Dynamic parts of URL path (e.g., /user/:id).

**Q4: What is Outlet?**
A: Component that renders nested route content.

**Q5: How to protect routes?**
A: Create ProtectedRoute wrapper that checks auth.

---

## Code-Based Interview Questions

**Q1: What is output?**
```javascript
<Route path="/user/:id" element={<User />} />
// /user/123 matches?
```
A: Yes, id = "123"

**Q2: Predict:**
```javascript
<Link to="/about">About</Link>
// Does this reload page?
```
A: No (client-side navigation)

**Q3: What is output?**
```javascript
const [params] = useSearchParams();
const query = params.get('q');
// URL: /search?q=react&page=2
// query value?
```
A: "react"

**Q4: Spot the issue:**
```javascript
function Protected({ children }) {
    if (!user) return <div>No access</div>;
    return children;
}
// Should this redirect?
```
A: Yes, should use Navigate to redirect

**Q5: What happens?**
```javascript
<Route path="/user/:id?" element={<User />} />
// /user and /user/123 both match?
```
A: Yes (optional parameter)

---

## Follow-up Questions & Confusing Concepts

**Q: What is difference between Route and Link?**
A: Route defines page, Link navigates to it.

**Q: Can I use multiple Outlets?**
A: Yes, one per nested route level.

**Q: When to use query params vs URL params?**
A: Params for required, query for optional/filtering.

**Q: How to handle 404 pages?**
A: Use wildcard route (* path) at end.

---

## Summary

- **BrowserRouter**: Wrapper for routing
- **Routes & Route**: Define pages and paths
- **Link/NavLink**: Navigate without reload
- **useParams**: Access URL parameters
- **useSearchParams**: Access query strings
- **useNavigate**: Programmatic navigation
- **Outlet**: Render nested routes
- **Protected Routes**: Check auth before rendering
- **Nested Routes**: Organize related pages
- **History**: Browser back/forward works

**Next Step:** Master API integration!
