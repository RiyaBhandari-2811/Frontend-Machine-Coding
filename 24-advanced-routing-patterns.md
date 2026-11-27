# Advanced Routing Patterns & Navigation

## Table of Contents
1. Dynamic Routing
2. Protected Routes
3. Nested Routes
4. Route Parameters
5. Query Parameters
6. Programmatic Navigation
7. Route Transitions
8. Navigation Patterns

---

## 1. Dynamic Routing

### Route Configuration
```javascript
// Static route definition
<Routes>
    <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />
    <Route path="/contact" element={<Contact />} />
</Routes>

// Dynamic route configuration
const routes = [
    { path: '/', component: Home },
    { path: '/about', component: About },
    { path: '/contact', component: Contact }
];

<Routes>
    {routes.map(route => (
        <Route
            key={route.path}
            path={route.path}
            element={<route.component />}
        />
    ))}
</Routes>
```

### Route Matching
```javascript
// Path patterns
<Route path="/" element={<Home />} />  // Exact match
<Route path="/users/:id" element={<User />} />  // Param
<Route path="/posts/:id/comments/:commentId" element={<Comment />} />  // Multiple params
<Route path="/search/*" element={<Search />} />  // Wildcard
<Route path="*" element={<NotFound />} />  // 404 fallback
```

---

## 2. Protected Routes

### Authentication Guard
```javascript
function ProtectedRoute({ children, isAuthenticated }) {
    return isAuthenticated
        ? children
        : <Navigate to="/login" replace />;
}

// Usage
<Routes>
    <Route path="/login" element={<Login />} />
    <Route
        path="/dashboard"
        element={
            <ProtectedRoute isAuthenticated={isLoggedIn}>
                <Dashboard />
            </ProtectedRoute>
        }
    />
</Routes>
```

### Role-Based Access
```javascript
function RoleProtectedRoute({ children, requiredRole, userRole }) {
    if (!userRole) {
        return <Navigate to="/login" replace />;
    }
    
    if (userRole !== requiredRole) {
        return <Navigate to="/forbidden" replace />;
    }
    
    return children;
}

// Usage
<Route
    path="/admin"
    element={
        <RoleProtectedRoute requiredRole="admin" userRole={currentUserRole}>
            <AdminPanel />
        </RoleProtectedRoute>
    }
/>
```

### Async Authentication Check
```javascript
function ProtectedRouteAsync({ children }) {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    
    useEffect(() => {
        checkAuth().then(isAuth => {
            setIsAuthenticated(isAuth);
            setIsLoading(false);
        });
    }, []);
    
    if (isLoading) {
        return <div>Checking authentication...</div>;
    }
    
    return isAuthenticated
        ? children
        : <Navigate to="/login" replace />;
}
```

---

## 3. Nested Routes

### Layout with Nested Routes
```javascript
function Layout() {
    return (
        <div className="layout">
            <Navbar />
            <div className="content">
                <Outlet />  {/* Renders nested route */}
            </div>
            <Footer />
        </div>
    );
}

// Nested route definition
<Routes>
    <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/dashboard" element={<Dashboard />}>
            <Route path="overview" element={<Overview />} />
            <Route path="analytics" element={<Analytics />} />
        </Route>
    </Route>
</Routes>

// URL examples:
// /dashboard -> shows Dashboard, Outlet renders nothing
// /dashboard/overview -> shows Dashboard, Outlet renders Overview
// /dashboard/analytics -> shows Dashboard, Outlet renders Analytics
```

---

## 4. Route Parameters

### Path Parameters
```javascript
function UserProfile() {
    // Get :id from URL path
    const { id } = useParams();
    
    const [user, setUser] = useState(null);
    
    useEffect(() => {
        fetch(`/api/users/${id}`)
            .then(r => r.json())
            .then(setUser);
    }, [id]);
    
    return <div>{user?.name}</div>;
}

// URL: /users/123
// params: { id: '123' }

// Route definition
<Route path="/users/:id" element={<UserProfile />} />
<Route path="/posts/:postId/comments/:commentId" element={<Comment />} />
```

### Optional Parameters
```javascript
// Make parameter optional with ?
<Route path="/posts/:id?" element={<Posts />} />

// URL: /posts -> shows all posts
// URL: /posts/5 -> shows specific post
```

---

## 5. Query Parameters

### Reading Query Parameters
```javascript
function SearchResults() {
    // Get query parameters
    const [searchParams] = useSearchParams();
    
    const query = searchParams.get('q');
    const page = searchParams.get('page') || '1';
    
    return (
        <div>
            <h1>Results for "{query}"</h1>
            <p>Page {page}</p>
        </div>
    );
}

// URL: /search?q=react&page=2
// searchParams.get('q') -> 'react'
// searchParams.get('page') -> '2'
```

### Setting Query Parameters
```javascript
function SearchForm() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [query, setQuery] = useState(searchParams.get('q') || '');
    
    const handleSearch = () => {
        setSearchParams({ q: query, page: 1 });
    };
    
    return (
        <div>
            <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search..."
            />
            <button onClick={handleSearch}>Search</button>
        </div>
    );
}
```

---

## 6. Programmatic Navigation

### Navigate Hook
```javascript
function LoginForm() {
    const navigate = useNavigate();
    
    const handleSubmit = async (email, password) => {
        try {
            const response = await login(email, password);
            
            // Redirect to dashboard
            navigate('/dashboard');
            
            // Or with state
            navigate('/dashboard', { state: { from: location.pathname } });
            
            // Or replace history
            navigate('/dashboard', { replace: true });
            
            // Go back
            navigate(-1);
        } catch (error) {
            console.error(error);
        }
    };
    
    return (
        <form onSubmit={e => {
            e.preventDefault();
            handleSubmit(email, password);
        }}>
            {/* Form fields */}
        </form>
    );
}
```

### Navigation State
```javascript
// Sending state
navigate('/dashboard', { state: { userId: 123 } });

// Receiving state
function Dashboard() {
    const location = useLocation();
    const userId = location.state?.userId;
    
    return <div>User ID: {userId}</div>;
}
```

---

## 7. Route Transitions

### Animated Transitions
```javascript
import { useTransition } from 'react';

function NavLink({ to, children }) {
    const navigate = useNavigate();
    const [isPending, startTransition] = useTransition();
    
    return (
        <Link
            to={to}
            onClick={(e) => {
                e.preventDefault();
                startTransition(() => {
                    navigate(to);
                });
            }}
            className={isPending ? 'pending' : ''}
        >
            {children}
        </Link>
    );
}
```

### Page Transition Animation
```javascript
function PageTransition({ children }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            {children}
        </motion.div>
    );
}

// Usage with AnimatePresence
import { AnimatePresence } from 'framer-motion';

<AnimatePresence mode="wait">
    <Routes location={location} key={location.pathname}>
        <Route
            path="/"
            element={
                <PageTransition>
                    <Home />
                </PageTransition>
            }
        />
    </Routes>
</AnimatePresence>
```

---

## 8. Navigation Patterns

### Breadcrumb Navigation
```javascript
function Breadcrumbs() {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter(x => x);
    
    return (
        <nav>
            <Link to="/">Home</Link>
            {pathnames.map((name, index) => {
                const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
                return (
                    <span key={routeTo}>
                        {' > '}
                        <Link to={routeTo}>{name}</Link>
                    </span>
                );
            })}
        </nav>
    );
}

// /posts/5/comments -> Home > posts > 5 > comments
```

### Active Link Styling
```javascript
function NavBar() {
    return (
        <nav>
            <NavLink to="/">Home</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/contact">Contact</NavLink>
        </nav>
    );
}

function NavLink({ to, children }) {
    return (
        <Link
            to={to}
            className={({ isActive }) => isActive ? 'active' : ''}
        >
            {children}
        </Link>
    );
}
```

### Dynamic Navigation Menu
```javascript
const menuItems = [
    { label: 'Home', path: '/' },
    { label: 'Products', path: '/products' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' }
];

function Navigation() {
    return (
        <nav>
            {menuItems.map(item => (
                <Link
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => isActive ? 'active' : ''}
                >
                    {item.label}
                </Link>
            ))}
        </nav>
    );
}
```

---

## Exercises

### Exercise 1: Protected Route
```javascript
// Create ProtectedRoute that:
// - Checks if user authenticated
// - Redirects to login if not
// - Shows component if authenticated

// Your code
```

**Solution:**
```javascript
function ProtectedRoute({ children, isAuthenticated }) {
    return isAuthenticated
        ? children
        : <Navigate to="/login" replace />;
}

// Usage
<Route
    path="/dashboard"
    element={
        <ProtectedRoute isAuthenticated={isLoggedIn}>
            <Dashboard />
        </ProtectedRoute>
    }
/>
```

### Exercise 2: Dynamic Navigation Menu
```javascript
// Create menu from route config:
// - Display menu items
// - Highlight active route
// - Handle nested routes

// Your code
```

**Solution:**
```javascript
const menuItems = [
    { label: 'Home', path: '/' },
    { label: 'Products', path: '/products' }
];

function Navigation() {
    return (
        <nav>
            {menuItems.map(item => (
                <Link
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => isActive ? 'active' : ''}
                >
                    {item.label}
                </Link>
            ))}
        </nav>
    );
}
```

### Exercise 3: Breadcrumb Navigation
```javascript
// Create breadcrumb that:
// - Shows current path
// - Links to parent paths
// - Updates on route change

// Your code
```

**Solution:**
```javascript
function Breadcrumbs() {
    const location = useLocation();
    const paths = location.pathname.split('/').filter(Boolean);
    
    return (
        <nav>
            <Link to="/">Home</Link>
            {paths.map((path, i) => (
                <span key={i}>
                    {' > '}
                    <Link to={`/${paths.slice(0, i + 1).join('/')}`}>
                        {path}
                    </Link>
                </span>
            ))}
        </nav>
    );
}
```

---

## Interview Questions

### Theoretical Questions

**Q1: What is React Router?**
A: Library for client-side routing and navigation.

**Q2: What is Outlet?**
A: Component that renders nested route element.

**Q3: How to protect routes?**
A: Create ProtectedRoute wrapper checking authentication.

**Q4: What are route parameters?**
A: Dynamic parts of URL like /users/:id.

**Q5: What are query parameters?**
A: Optional parameters in URL like ?page=2&sort=date.

---

## Summary

- **Dynamic Routing:** Configure routes programmatically
- **Protected Routes:** Check auth before rendering
- **Nested Routes:** Parent/child route structure with Outlet
- **Path Params:** Dynamic segments like :id
- **Query Params:** Optional search params
- **Navigation:** Navigate hook for programmatic routing
- **Transitions:** Animate between routes
- **Patterns:** Breadcrumbs, active links, dynamic menus
- **State Passing:** Use location.state to pass data
- **History:** Replace or preserve browser history

**Next:** TypeScript integration with React!
