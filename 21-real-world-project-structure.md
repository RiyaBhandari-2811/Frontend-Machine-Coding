# React Real-World Project Structure & Best Practices

## Table of Contents
1. Project Structure Evolution
2. Component Organization
3. Services & Utilities
4. Constants & Enums
5. Testing Structure
6. Documentation Standards
7. Code Review Checklist
8. Project Templates

---

## 1. Project Structure Evolution

### Small Project (< 5K LOC)
```
src/
├── components/
│   ├── Header.js
│   ├── Footer.js
│   └── Button.js
├── pages/
│   ├── Home.js
│   └── About.js
├── hooks/
│   └── useAuth.js
├── services/
│   └── api.js
├── styles/
│   └── global.css
├── App.js
├── index.js
└── config.js
```

### Medium Project (5K-50K LOC)
```
src/
├── features/
│   ├── auth/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── redux/
│   │   └── index.js
│   ├── dashboard/
│   │   ├── components/
│   │   ├── pages/
│   │   └── index.js
│   └── users/
├── shared/
│   ├── components/
│   ├── hooks/
│   ├── utils/
│   └── types/
├── config/
├── styles/
├── App.js
└── index.js
```

### Large Project (> 50K LOC)
```
packages/
├── web/
│   └── src/
│       ├── features/
│       ├── shared/
│       └── App.js
├── admin/
│   └── src/
│       ├── features/
│       └── App.js
├── common/
│   ├── components/
│   ├── hooks/
│   └── utils/
└── types/

monorepo.json
lerna.json
```

---

## 2. Component Organization

### Folder Structure per Component
```
src/features/todos/components/TodoList/
├── TodoList.js
├── TodoList.module.css
├── TodoList.test.js
├── TodoList.stories.js
└── README.md

// README.md documents component usage
# TodoList

## Props
- todos: Array<Todo>
- onDelete: (id: string) => void

## Examples
<TodoList todos={todos} onDelete={handleDelete} />
```

### Naming Conventions
```javascript
// Components - PascalCase
UserProfile.js
TodoList.js

// Hooks - camelCase with 'use' prefix
useAuth.js
useFetch.js

// Utils - camelCase
formatDate.js
validateEmail.js

// Constants - UPPER_CASE
API_BASE_URL
MAX_RETRY_ATTEMPTS

// Types - PascalCase
User.ts
TodoItem.ts
```

---

## 3. Services & Utilities

### API Service
```javascript
// src/services/api.js
class ApiClient {
    constructor(baseURL) {
        this.baseURL = baseURL;
    }
    
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.getToken()}`
            },
            ...options
        });
        
        if (!response.ok) {
            throw new ApiError(response.status, await response.json());
        }
        
        return response.json();
    }
    
    get(endpoint) {
        return this.request(endpoint);
    }
    
    post(endpoint, body) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(body)
        });
    }
    
    getToken() {
        return localStorage.getItem('token');
    }
}

export const api = new ApiClient(process.env.REACT_APP_API_URL);
```

### Utility Functions
```javascript
// src/shared/utils/date.js
export function formatDate(date, format = 'short') {
    const options = format === 'short'
        ? { year: 'numeric', month: 'short', day: 'numeric' }
        : { year: 'numeric', month: 'long', day: 'numeric' };
    
    return new Date(date).toLocaleDateString('en-US', options);
}

export function isDateInPast(date) {
    return new Date(date) < new Date();
}

// src/shared/utils/validate.js
export function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePassword(password) {
    return password.length >= 8;
}
```

---

## 4. Constants & Enums

### Application Constants
```javascript
// src/constants.js
export const API_BASE_URL = process.env.REACT_APP_API_URL;
export const API_TIMEOUT = 10000;
export const MAX_RETRY_ATTEMPTS = 3;
export const DEFAULT_PAGE_SIZE = 20;

// Status constants
export const STATUS = {
    IDLE: 'idle',
    LOADING: 'loading',
    SUCCESS: 'success',
    ERROR: 'error'
};

// User roles
export const USER_ROLES = {
    ADMIN: 'admin',
    USER: 'user',
    GUEST: 'guest'
};

// Routes
export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    DASHBOARD: '/dashboard',
    ADMIN: '/admin',
    NOT_FOUND: '/404'
};
```

### Type Enums
```typescript
// src/types/User.ts
export enum UserRole {
    ADMIN = 'admin',
    USER = 'user',
    GUEST = 'guest'
}

export enum UserStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    BANNED = 'banned'
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    createdAt: string;
}
```

---

## 5. Testing Structure

### Test Organization
```
src/
├── components/
│   ├── Button.js
│   ├── Button.test.js
│   └── Button.stories.js
├── hooks/
│   ├── useAuth.js
│   └── useAuth.test.js
└── services/
    ├── api.js
    └── api.test.js

// Test file naming
ComponentName.test.js
useHookName.test.js
serviceName.test.js

// Test patterns
describe('ComponentName', () => {
    describe('rendering', () => {
        test('renders correctly', () => {});
    });
    
    describe('interactions', () => {
        test('handles click', () => {});
    });
    
    describe('edge cases', () => {
        test('handles null props', () => {});
    });
});
```

---

## 6. Documentation Standards

### README for Features
```markdown
# Auth Feature

## Overview
Handles user authentication and authorization.

## Components
- LoginForm
- LogoutButton
- ProtectedRoute

## Hooks
- useAuth() - Get current user and auth methods
- useAuthGuard() - Protect routes

## Services
- authService.login(email, password)
- authService.logout()
- authService.getCurrentUser()

## Usage
import { LoginForm, useAuth } from '@features/auth';

function MyComponent() {
    const { user, login } = useAuth();
    return <div>{user?.name}</div>;
}
```

### Code Comments
```javascript
// ✓ GOOD - Explains why, not what
// User object is cloned to prevent mutations when updating
const updatedUser = { ...user, name: newName };

// ✗ BAD - Obvious from code
// Set user object
const updatedUser = { ...user, name: newName };

// ✓ GOOD - Explains complex logic
// Exponential backoff: 1s, 2s, 4s, 8s...
const delay = Math.pow(2, retryCount) * 1000;

// TODO: Implement caching for performance improvement
// See issue #123
```

---

## 7. Code Review Checklist

### Functionality
- [ ] Code works as intended
- [ ] No console errors/warnings
- [ ] Handles edge cases
- [ ] No infinite loops
- [ ] Error handling present

### Best Practices
- [ ] DRY - No code duplication
- [ ] SOLID principles followed
- [ ] Descriptive variable names
- [ ] No magic numbers
- [ ] Proper abstraction levels

### Testing
- [ ] Unit tests added
- [ ] >80% code coverage
- [ ] Integration tests for features
- [ ] Edge cases tested
- [ ] Tests pass locally

### Performance
- [ ] No unnecessary renders
- [ ] Props properly memoized
- [ ] API calls optimized
- [ ] No memory leaks
- [ ] Bundle size impact assessed

### Accessibility
- [ ] Semantic HTML used
- [ ] ARIA attributes present
- [ ] Keyboard navigation works
- [ ] Color contrast adequate
- [ ] Screen reader tested

### Security
- [ ] No hardcoded secrets
- [ ] Input validation done
- [ ] XSS protection in place
- [ ] No PII in logs
- [ ] Environment vars used

---

## 8. Project Templates

### Create React App Template
```bash
npx create-react-app my-app
cd my-app

# Add TypeScript
npm install -D typescript @types/react

# Add testing libraries
npm install -D @testing-library/react @testing-library/jest-dom

# Add ESLint
npm install -D eslint eslint-plugin-react

# Add Prettier
npm install -D prettier

# Start
npm start
```

### Vite Template
```bash
npm create vite@latest my-app -- --template react
cd my-app
npm install

# Add TypeScript
npm install -D typescript

# Dev server
npm run dev

# Build
npm run build
```

---

## Exercises

### Exercise 1: Structure Project
```javascript
// Restructure existing project to feature-based
// Before: components/, pages/, services/
// After: features/

// Your code
```

**Solution:**
```
Before:
src/components/LoginForm.js
src/pages/LoginPage.js
src/services/authService.js

After:
src/features/auth/
├── components/LoginForm.js
├── pages/LoginPage.js
├── services/authService.js
└── index.js (exports public API)
```

### Exercise 2: Documentation
```markdown
# Create README for a feature
# Include:
# - Overview
# - Components
# - Hooks
# - Usage example

# Your code
```

**Solution:**
```markdown
# User Feature

## Overview
Manages user profile and preferences.

## Components
- UserProfile
- EditProfile
- PreferencesPanel

## Hooks
- useUser() - Get current user
- useUserUpdate() - Update user

## Usage
import { UserProfile } from '@features/user';
<UserProfile userId={123} />
```

### Exercise 3: Testing Setup
```javascript
// Set up tests for component:
// - Render test
// - Props test
// - Interaction test

// Your code
```

**Solution:**
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button', () => {
    test('renders button with text', () => {
        render(<Button>Click me</Button>);
        expect(screen.getByText('Click me')).toBeInTheDocument();
    });
    
    test('handles click', () => {
        const onClick = jest.fn();
        render(<Button onClick={onClick}>Click</Button>);
        fireEvent.click(screen.getByText('Click'));
        expect(onClick).toHaveBeenCalled();
    });
});
```

---

## Interview Questions

### Theoretical Questions

**Q1: What is feature-based structure?**
A: Organizing code by business features instead of file types.

**Q2: When to split components?**
A: When component exceeds 300 lines or has multiple concerns.

**Q3: What goes in utils?**
A: Reusable functions that don't depend on React.

**Q4: How to document components?**
A: Storybook stories, inline comments, README files.

**Q5: What's in code review?**
A: Functionality, performance, testing, security, accessibility.

---

## Summary

- **Small projects:** Flat structure fine
- **Medium projects:** Feature-based organization
- **Large projects:** Monorepo with separate packages
- **Components:** Group related files in folder
- **Services:** Centralize API and utility logic
- **Constants:** Define in one place
- **Testing:** Co-locate tests with code
- **Documentation:** README, comments, stories
- **Code Review:** Check functionality, performance, security
- **Naming:** Follow conventions consistently

**Next:** Performance patterns deep dive!
