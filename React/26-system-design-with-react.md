# System Design with React - Building Scalable Applications

## Table of Contents
1. Application Architecture
2. Data Flow Patterns
3. Separation of Concerns
4. Scalability Principles
5. Performance at Scale
6. Team Collaboration Patterns
7. Design Patterns
8. Case Studies

---

## 1. Application Architecture

### Layered Architecture
```
Application Layer
    ↓
Container/Smart Components Layer
    ↓
Presentation/Dumb Components Layer
    ↓
Services/Business Logic Layer
    ↓
Data/API Layer
    ↓
External Systems (Backend API, Database, etc.)
```

```javascript
// API Layer - Handles external communication
class UserAPI {
    async getUser(id: string): Promise<User> {
        const response = await fetch(`/api/users/${id}`);
        return response.json();
    }
    
    async updateUser(id: string, data: Partial<User>): Promise<User> {
        const response = await fetch(`/api/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
        return response.json();
    }
}

// Business Logic Layer
class UserService {
    constructor(private api: UserAPI) {}
    
    async getUserWithValidation(id: string): Promise<User> {
        if (!id) throw new Error('ID required');
        return this.api.getUser(id);
    }
}

// Smart Component (Container)
function UserContainer({ userId }) {
    const [user, setUser] = useState<User | null>(null);
    const userService = useUserService();
    
    useEffect(() => {
        userService.getUserWithValidation(userId).then(setUser);
    }, [userId, userService]);
    
    return <UserPresentation user={user} />;
}

// Dumb Component (Presentation)
function UserPresentation({ user }) {
    return <div>{user?.name}</div>;
}
```

### Hexagonal Architecture
```
Domain (Business Logic)
    ↑       ↓       ↑       ↓
Adapters:
- Controllers (API endpoints)
- Repositories (Database access)
- External Services (3rd party APIs)
- Presenters (UI rendering)
```

---

## 2. Data Flow Patterns

### Unidirectional Data Flow
```
User Input
    ↓
Action/Event
    ↓
Reducer/Handler
    ↓
State Update
    ↓
Component Re-render
    ↓
UI Display
```

```javascript
// Redux-like pattern
function counterReducer(state, action) {
    switch (action.type) {
        case 'INCREMENT':
            return state + 1;
        case 'DECREMENT':
            return state - 1;
        default:
            return state;
    }
}

function Counter() {
    const [count, dispatch] = useReducer(counterReducer, 0);
    
    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={() => dispatch({ type: 'INCREMENT' })}>+</button>
            <button onClick={() => dispatch({ type: 'DECREMENT' })}>-</button>
        </div>
    );
}
```

### Event-Driven Architecture
```javascript
// Event bus for decoupled communication
class EventBus {
    private listeners = new Map();
    
    on(event: string, callback: (data: any) => void) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }
    
    emit(event: string, data: any) {
        this.listeners.get(event)?.forEach(cb => cb(data));
    }
    
    off(event: string, callback: (data: any) => void) {
        const callbacks = this.listeners.get(event);
        if (callbacks) {
            const index = callbacks.indexOf(callback);
            if (index > -1) callbacks.splice(index, 1);
        }
    }
}

const eventBus = new EventBus();

// Different features can communicate through events
// Feature A: Notify when user logs in
eventBus.emit('user:login', { userId: 123 });

// Feature B: Listen for login event
eventBus.on('user:login', (data) => {
    updateUserDashboard(data.userId);
});
```

---

## 3. Separation of Concerns

### Feature Isolation
```
src/features/
├── auth/
│   ├── components/      (UI components)
│   ├── hooks/           (Custom hooks)
│   ├── services/        (Business logic)
│   ├── redux/           (State management)
│   ├── types.ts         (TypeScript interfaces)
│   └── index.ts         (Public API)
├── todos/
│   ├── components/
│   ├── hooks/
│   └── ...
└── shared/              (Shared across features)
    ├── components/
    ├── hooks/
    ├── utils/
    └── types/
```

### Dependency Injection
```javascript
// Don't depend on concrete implementations
// ✗ WRONG
function UserComponent() {
    const api = new UserAPI();  // Hard dependency
    const [user] = useFetch(api.getUser);
}

// ✓ CORRECT
interface IUserAPI {
    getUser(id: string): Promise<User>;
}

function UserComponent({ userAPI }: { userAPI: IUserAPI }) {
    const [user] = useFetch(() => userAPI.getUser('123'));
}

// Can inject mock for testing
const mockAPI: IUserAPI = {
    getUser: jest.fn()
};

render(<UserComponent userAPI={mockAPI} />);
```

---

## 4. Scalability Principles

### Modular Code
```javascript
// ✗ WRONG - Everything in one file (1000+ lines)
// App.js - 1000 lines

// ✓ CORRECT - Split into modules
// features/todos/components/TodoList.js
// features/todos/hooks/useTodos.js
// features/todos/services/todoService.js
// features/todos/redux/todoSlice.js

// Each module has single responsibility
// Each has 100-200 lines max
```

### Configuration Over Code
```javascript
// Store configuration separately
const config = {
    API_BASE_URL: process.env.REACT_APP_API_URL,
    API_TIMEOUT: 10000,
    FEATURES: {
        newCheckout: featureFlags.isEnabled('new-checkout'),
        advancedAnalytics: featureFlags.isEnabled('advanced-analytics')
    },
    PAGINATION: {
        defaultPageSize: 20,
        maxPageSize: 100
    }
};

// Use consistently throughout app
const userAPI = new UserAPI(config.API_BASE_URL, config.API_TIMEOUT);
```

### Cache Strategy
```javascript
class CachedUserService {
    private cache = new Map<string, User>();
    private ttl = 5 * 60 * 1000;  // 5 minutes
    
    async getUser(id: string): Promise<User> {
        // Check cache
        const cached = this.cache.get(id);
        if (cached) return cached;
        
        // Fetch from API
        const user = await this.api.getUser(id);
        
        // Cache result
        this.cache.set(id, user);
        
        // Clear cache after TTL
        setTimeout(() => this.cache.delete(id), this.ttl);
        
        return user;
    }
}
```

---

## 5. Performance at Scale

### Code Splitting by Feature
```javascript
// Each feature lazy-loaded
const AuthModule = lazy(() => import('./features/auth'));
const TodoModule = lazy(() => import('./features/todos'));
const AdminModule = lazy(() => import('./features/admin'));

function App() {
    return (
        <Suspense fallback={<Loading />}>
            <Routes>
                <Route path="/auth/*" element={<AuthModule />} />
                <Route path="/todos/*" element={<TodoModule />} />
                <Route path="/admin/*" element={<AdminModule />} />
            </Routes>
        </Suspense>
    );
}
```

### Memoization Strategy
```javascript
// Memoize expensive calculations
const expensiveSelector = useMemo(() => {
    return computeExpensiveValue(data);
}, [data]);

// Memoize callbacks to prevent unnecessary renders
const handleUpdate = useCallback(() => {
    dispatch(updateAction);
}, [dispatch]);

// Memoize component if props rarely change
export default React.memo(UserProfile, (prev, next) => {
    return prev.userId === next.userId;
});
```

---

## 6. Team Collaboration Patterns

### Component Versioning
```
components/
├── Button/
│   ├── Button.v1.tsx      (Legacy)
│   ├── Button.v2.tsx      (Current)
│   └── Button.tsx         (Alias to v2)
└── Card/
    └── Card.tsx
```

### Design System
```typescript
// Establish component catalog
// stories/Button.stories.tsx
export default {
    component: Button,
    argTypes: {
        variant: {
            options: ['primary', 'secondary'],
            control: { type: 'radio' }
        }
    }
};

export const Primary = { args: { variant: 'primary' } };
export const Secondary = { args: { variant: 'secondary' } };
```

### Code Ownership
```
CODEOWNERS
# GitHub file ownership
/src/features/auth/ @auth-team
/src/features/todos/ @features-team
/src/shared/ @platform-team
```

---

## 7. Design Patterns

### Singleton Pattern
```javascript
class AppState {
    private static instance: AppState;
    
    private constructor() {}
    
    static getInstance(): AppState {
        if (!AppState.instance) {
            AppState.instance = new AppState();
        }
        return AppState.instance;
    }
}
```

### Observer Pattern
```javascript
class Store {
    private listeners = new Set();
    
    subscribe(listener: () => void) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }
    
    notify() {
        this.listeners.forEach(l => l());
    }
}
```

### Factory Pattern
```javascript
interface ComponentConstructor {
    (props: any): JSX.Element;
}

const componentFactory: Record<string, ComponentConstructor> = {
    'button': Button,
    'card': Card,
    'modal': Modal
};

function renderComponent(type: string, props: any) {
    const Component = componentFactory[type];
    if (!Component) throw new Error(`Unknown component: ${type}`);
    return <Component {...props} />;
}
```

---

## 8. Case Studies

### Large E-commerce App
```
Architecture:
- Product catalog → Lazy load per category
- Shopping cart → Redux with persistence
- Checkout → Multi-step form with validation
- Orders → Real-time updates via WebSocket
- Admin → Role-based access with feature flags

Performance:
- Bundle: 150KB (gzipped)
- FCP: < 1.5s
- LCP: < 2.5s
- CLS: < 0.1
```

### Real-time Collaboration App
```
Architecture:
- Real-time sync via WebSocket
- Operational transformation for conflicts
- Offline-first with service worker
- Local state sync with server

Patterns:
- Event-driven for real-time updates
- Optimistic updates for responsiveness
- Debouncing for server requests
- Conflict resolution for concurrent edits
```

---

## Exercises

### Exercise 1: Design Feature Structure
```typescript
// Design structure for auth feature:
// - Components
// - Hooks
// - Services
// - State management
// - Types

// Your code
```

**Solution:**
```
features/auth/
├── components/
│   ├── LoginForm.tsx
│   ├── LogoutButton.tsx
│   └── ProtectedRoute.tsx
├── hooks/
│   └── useAuth.ts
├── services/
│   └── authService.ts
├── redux/
│   ├── authSlice.ts
│   └── authSelectors.ts
├── types.ts
└── index.ts (public API)
```

### Exercise 2: Implement EventBus
```typescript
// Create EventBus class with:
// - Subscribe to events
// - Emit events
// - Unsubscribe

// Your code
```

**Solution:**
```typescript
class EventBus {
    private listeners = new Map<string, Function[]>();
    
    on(event: string, callback: Function) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event)!.push(callback);
    }
    
    emit(event: string, data: any) {
        this.listeners.get(event)?.forEach(cb => cb(data));
    }
    
    off(event: string, callback: Function) {
        const callbacks = this.listeners.get(event);
        if (callbacks) {
            const i = callbacks.indexOf(callback);
            if (i > -1) callbacks.splice(i, 1);
        }
    }
}
```

### Exercise 3: Design System Component
```typescript
// Create reusable Button component with:
// - Multiple variants
// - Multiple sizes
// - Proper TypeScript typing
// - Storybook stories

// Your code
```

**Solution:**
```typescript
interface ButtonProps {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary';
    size?: 'small' | 'medium' | 'large';
    onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'medium',
    onClick
}) => (
    <button
        className={`btn btn-${variant} btn-${size}`}
        onClick={onClick}
    >
        {children}
    </button>
);
```

---

## Interview Questions

### Theoretical Questions

**Q1: What is system design?**
A: Planning architecture, data flow, and components for scalable apps.

**Q2: What is separation of concerns?**
A: Dividing functionality so each part has single responsibility.

**Q3: When to use lazy loading?**
A: For routes or heavy features not needed immediately.

**Q4: What is dependency injection?**
A: Passing dependencies to components instead of hardcoding.

**Q5: How to design for teams?**
A: Clear module boundaries, shared component system, ownership rules.

---

## Summary

- **Architecture:** Layers from API → Service → Component
- **Data Flow:** Unidirectional for predictability
- **Modularity:** Small focused modules
- **Separation:** Each feature self-contained
- **Scaling:** Code splitting, caching, memoization
- **Performance:** Lazy load, optimize bundles, cache data
- **Teams:** Design system, code ownership, versioning
- **Patterns:** Singleton, Observer, Factory
- **Testing:** Mock dependencies, test in isolation
- **Maintenance:** Configuration over code, documentation

**Next:** Advanced debugging & performance analysis!
