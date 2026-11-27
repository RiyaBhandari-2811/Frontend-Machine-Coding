# React Architecture & Monolithic vs Micro-frontends

## Table of Contents
1. Monolithic Architecture
2. Feature-based Structure
3. Micro-frontends
4. Module Federation
5. Scaling Patterns
6. Component Hierarchy
7. File Organization
8. Architecture Decision Records

---

## 1. Monolithic Architecture

### Traditional Folder Structure
```
src/
├── components/
│   ├── Button.js
│   ├── Card.js
│   ├── Modal.js
│   └── ...
├── pages/
│   ├── Home.js
│   ├── About.js
│   └── ...
├── services/
│   ├── api.js
│   ├── auth.js
│   └── ...
├── hooks/
│   ├── useAuth.js
│   ├── useFetch.js
│   └── ...
├── redux/
│   ├── store.js
│   ├── reducers.js
│   └── actions.js
├── styles/
│   ├── global.css
│   └── ...
└── App.js
```

### Common Issues with Monolith
```javascript
// ✗ PROBLEM: Everything imports from everything
// components/UserCard.js imports from pages/Dashboard
// pages/Dashboard imports from components/UserCard
// Circular dependencies!

// ✗ PROBLEM: Hard to find where logic lives
// User state might be in Redux, Context, Local state, localStorage

// ✗ PROBLEM: Difficult to test in isolation
// Component depends on global state, API, etc.

// ✗ PROBLEM: Sharing code requires exporting through many layers
```

---

## 2. Feature-based Structure

### Organized by Feature
```
src/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   │   ├── LoginForm.js
│   │   │   └── LogoutButton.js
│   │   ├── hooks/
│   │   │   └── useAuth.js
│   │   ├── services/
│   │   │   └── authService.js
│   │   ├── redux/
│   │   │   ├── authSlice.js
│   │   │   └── authSelectors.js
│   │   └── types.ts
│   │
│   ├── todos/
│   │   ├── components/
│   │   │   ├── TodoList.js
│   │   │   ├── TodoItem.js
│   │   │   └── AddTodoForm.js
│   │   ├── hooks/
│   │   │   ├── useTodos.js
│   │   │   └── useTodoFilter.js
│   │   ├── services/
│   │   │   └── todoService.js
│   │   ├── redux/
│   │   │   ├── todoSlice.js
│   │   │   └── todoSelectors.js
│   │   └── types.ts
│   │
│   └── user/
│       ├── components/
│       ├── hooks/
│       ├── services/
│       └── redux/
│
├── shared/
│   ├── components/
│   │   ├── Button.js
│   │   ├── Card.js
│   │   └── Layout.js
│   ├── hooks/
│   │   ├── useWindowSize.js
│   │   └── useLocalStorage.js
│   ├── utils/
│   │   ├── date.js
│   │   └── format.js
│   └── types/
│       └── common.ts
│
├── App.js
└── main.js
```

### Benefits
```
✓ Clear module boundaries
✓ Easy to find related code
✓ Can develop features independently
✓ Easier to refactor feature without affecting others
✓ Easier to delete entire feature
✓ Better for team organization
```

---

## 3. Micro-frontends

### Concept
```javascript
// Split app into multiple independent frontends
// Each team owns their frontend

// Main shell app
function Shell() {
    return (
        <div>
            <Header />
            <Navbar />
            {/* Mount micro-frontends */}
            <div id="auth-mount" />
            <div id="dashboard-mount" />
            <div id="admin-mount" />
            <Footer />
        </div>
    );
}

// Benefits:
// - Independent deployment
// - Team ownership
// - Technology flexibility
// - Scalability
// - Smaller bundles

// Challenges:
// - Complexity
// - Shared state
// - Duplication of dependencies
```

---

## 4. Module Federation

### Webpack Module Federation
```javascript
// webpack.config.js - Shell (host)
module.exports = {
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: 'auto'
    },
    plugins: [
        new ModuleFederationPlugin({
            name: 'shell',
            remotes: {
                auth: 'auth@http://localhost:3001/remoteEntry.js',
                dashboard: 'dashboard@http://localhost:3002/remoteEntry.js'
            },
            shared: {
                react: { singleton: true },
                'react-dom': { singleton: true }
            }
        })
    ]
};

// webpack.config.js - Auth micro-frontend
module.exports = {
    plugins: [
        new ModuleFederationPlugin({
            name: 'auth',
            filename: 'remoteEntry.js',
            exposes: {
                './AuthModule': './src/AuthModule'
            },
            shared: {
                react: { singleton: true },
                'react-dom': { singleton: true }
            }
        })
    ]
};

// Usage in shell
import React, { lazy, Suspense } from 'react';

const AuthModule = lazy(() => import('auth/AuthModule'));

function App() {
    return (
        <Suspense fallback={<div>Loading auth...</div>}>
            <AuthModule />
        </Suspense>
    );
}
```

---

## 5. Scaling Patterns

### Horizontal Scaling (Monorepo)
```
monorepo/
├── packages/
│   ├── ui/              # Shared components
│   │   └── Button.js
│   ├── auth/            # Auth feature
│   │   └── AuthModule.js
│   ├── todos/           # Todos feature
│   │   └── TodoModule.js
│   ├── admin/           # Admin feature
│   │   └── AdminModule.js
│   └── web/             # Main web app
│       └── App.js
├── package.json
└── lerna.json

// Benefits:
// - Shared code
// - Consistent versions
// - Single repo
// - Shared tooling

// Tools:
// - Lerna
// - Yarn workspaces
// - pnpm workspaces
// - Turborepo
```

### Vertical Scaling (Layers)
```
src/
├── presentation/
│   ├── components/
│   ├── pages/
│   └── layout/
├── business/
│   ├── hooks/
│   ├── services/
│   └── logic/
├── data/
│   ├── redux/
│   ├── api/
│   └── cache/
└── infrastructure/
    ├── http/
    ├── storage/
    └── config/

// Benefits:
// - Clear separation of concerns
// - Each layer has single responsibility
// - Easier to test
// - Easier to swap implementations
```

---

## 6. Component Hierarchy

### Composition
```javascript
// Container component (smart)
function TodoContainer() {
    const { todos, loading } = useTodos();
    
    return <TodoPresentation todos={todos} loading={loading} />;
}

// Presentation component (dumb)
function TodoPresentation({ todos, loading }) {
    if (loading) return <div>Loading...</div>;
    return <div>{todos.map(t => <TodoItem key={t.id} todo={t} />)}</div>;
}

// Benefits:
// - Easier to test presentation (no logic)
// - Easier to reuse in different contexts
// - Clear data flow
```

### Compound Components
```javascript
function Tabs({ children }) {
    const [activeTab, setActiveTab] = useState(0);
    return React.Children.map(children, (child) =>
        React.cloneElement(child, { activeTab, setActiveTab })
    );
}

function TabList({ children, activeTab, setActiveTab }) {
    return (
        <div>
            {React.Children.map(children, (child, i) =>
                React.cloneElement(child, { index: i, activeTab, setActiveTab })
            )}
        </div>
    );
}

function Tab({ children, index, activeTab, setActiveTab }) {
    return (
        <button
            onClick={() => setActiveTab(index)}
            className={index === activeTab ? 'active' : ''}
        >
            {children}
        </button>
    );
}

// Usage
<Tabs>
    <TabList>
        <Tab>Tab 1</Tab>
        <Tab>Tab 2</Tab>
    </TabList>
</Tabs>
```

---

## 7. File Organization

### Module Structure
```
src/features/todos/
├── __tests__/
│   ├── TodoList.test.js
│   ├── useTodos.test.js
│   └── todoSlice.test.js
├── components/
│   ├── TodoList.js
│   ├── TodoItem.js
│   ├── AddTodoForm.js
│   └── __stories__/
│       └── TodoList.stories.js
├── hooks/
│   ├── useTodos.js
│   ├── useTodoFilter.js
│   └── useTodoMutation.js
├── services/
│   ├── todoService.js
│   └── todoService.test.js
├── redux/
│   ├── todoSlice.js
│   ├── todoSelectors.js
│   └── todoThunks.js
├── types.ts
├── constants.js
└── index.js  // Public API

// index.js exports only public parts
export { TodoList } from './components/TodoList';
export { useTodos } from './hooks/useTodos';
export { todoSelectors } from './redux/todoSlice';

// Other modules import from public API
import { TodoList } from '../todos';

// Not from internal paths
// import { TodoItem } from '../todos/components/TodoItem';
```

---

## 8. Architecture Decision Records (ADR)

### Template
```markdown
# ADR 001: Use Redux for Global State

## Status
Accepted

## Context
App needs global state for user auth, theme, notifications.
Need to decide between Redux, Context API, Zustand.

## Decision
Use Redux for complex state with time-traveling debugger.

## Consequences
- Pro: Powerful DevTools, large community
- Pro: Clear action/reducer pattern
- Con: Boilerplate code
- Con: Learning curve

## Alternatives
- Context API: Too simple for complexity
- Zustand: Less debugging capabilities
```

---

## Exercises

### Exercise 1: Restructure to Feature-based
```javascript
// Convert flat structure to feature-based
// Before: src/components/LoginForm.js, src/services/auth.js, src/redux/authReducer.js
// After: src/features/auth/...

// Your code
```

**Solution:**
```
Before:
src/components/LoginForm.js
src/components/LogoutButton.js
src/services/auth.js
src/redux/authReducer.js

After:
src/features/auth/
├── components/
│   ├── LoginForm.js
│   └── LogoutButton.js
├── services/
│   └── authService.js
├── redux/
│   └── authSlice.js
└── index.js
```

### Exercise 2: Create Shared Components
```javascript
// Extract common UI components
// Button, Card, Modal, Form components

// Your code
```

**Solution:**
```
src/shared/
├── components/
│   ├── Button.js
│   ├── Card.js
│   ├── Modal.js
│   ├── Form.js
│   ├── Input.js
│   └── __stories__/
├── hooks/
│   ├── useWindowSize.js
│   └── useLocalStorage.js
└── utils/
    ├── format.js
    └── validate.js
```

### Exercise 3: Create Module API
```javascript
// Define public API for auth module
// Hide internal implementation

function AuthModule() {
    // Your code
}
```

**Solution:**
```javascript
// src/features/auth/index.js
export { LoginForm } from './components/LoginForm';
export { useAuth } from './hooks/useAuth';
export { selectUser, selectIsLoading } from './redux/authSelectors';

// Hide internal components
// export { LoginFormInternal } - DON'T do this
```

---

## Interview Questions

### Theoretical Questions

**Q1: What is feature-based structure?**
A: Organizing code by business features instead of file types.

**Q2: When to use monolith?**
A: Small to medium apps, single team.

**Q3: When to use micro-frontends?**
A: Large apps, multiple teams, independent deployment.

**Q4: What is module federation?**
A: Webpack feature sharing code between builds.

**Q5: What is shared module?**
A: Code accessible to multiple features.

---

## Code-Based Interview Questions

**Q1: What is issue?**
```javascript
// src/components/UserCard.js imports from ../pages/Dashboard
// src/pages/Dashboard.js imports from ../components/UserCard
// Problem?
```
A: Circular dependency, hard to untangle

**Q2: Predict:**
```javascript
// src/features/todos/index.js exports everything
export * from './components';
// Is this good?
```
A: No, should explicitly export public API

**Q3: What is better?**
```javascript
// All components in one folder
// vs
// Separated by feature
// Which scales better?
```
A: Separated by feature, easier to maintain

**Q4: Spot the issue:**
```javascript
// src/features/todos/hooks/useTodos.js imports from
// src/features/auth/services/authService.js
// Problem?
```
A: Cross-feature import, should use public APIs

**Q5: What is output?**
```javascript
// Use monorepo with lerna
// Can share code?
```
A: Yes, via workspace packages

---

## Summary

- **Monolithic:** Simple structure, works for small apps
- **Feature-based:** Better organization, scales better
- **Micro-frontends:** Independent teams, complex deployment
- **Module Federation:** Share code between independent builds
- **Monorepo:** Shared code, single repo
- **Layered:** Separation by responsibility
- **Compound Components:** Flexible UI composition
- **Public API:** Hide implementation details
- **ADR:** Document architecture decisions
- **Scaling:** Choose based on team size and complexity

**Next:** API design with React!
