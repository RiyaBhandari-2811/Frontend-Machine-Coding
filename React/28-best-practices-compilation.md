# React Best Practices Compilation & Interview Mastery

## Table of Contents
1. Code Quality Standards
2. Performance Checklist
3. Security Checklist
4. Accessibility Checklist
5. Testing Strategy
6. Documentation Standards
7. Common Pitfalls
8. Interview Preparation

---

## 1. Code Quality Standards

### Code Style
```javascript
// Use consistent naming
// ✓ GOOD
const userName = 'Alice';
const getUserById = (id) => {};

// ✗ BAD
const user_name = 'Alice';
const get_user_by_id = (id) => {};

// Keep functions small and focused
// ✓ GOOD (20-30 lines)
function handleUserUpdate() {
    // Single responsibility
}

// ✗ BAD (200+ lines)
function handleEverything() {
    // Does everything
}

// Use meaningful variable names
// ✓ GOOD
const userCount = users.length;
const isAdmin = user.role === 'admin';

// ✗ BAD
const c = users.length;
const a = user.role === 'admin';
```

### Code Principles
```
SOLID Principles:
S - Single Responsibility: Each module has one job
O - Open/Closed: Open for extension, closed for modification
L - Liskov Substitution: Subtypes must substitute base types
I - Interface Segregation: Specific interfaces over general ones
D - Dependency Inversion: Depend on abstractions, not concretions

DRY (Don't Repeat Yourself): Extract common code

KISS (Keep It Simple, Stupid): Simplest solution is usually best

YAGNI (You Aren't Gonna Need It): Don't add features you don't need
```

---

## 2. Performance Checklist

### Application Level
- [ ] Code splitting implemented for routes
- [ ] Lazy loading for heavy components
- [ ] Image optimization (responsive, formats, lazy load)
- [ ] Bundle analysis done
- [ ] Tree shaking enabled
- [ ] Service worker for offline
- [ ] Minification and compression
- [ ] CDN configured
- [ ] Caching strategy in place

### Component Level
- [ ] React.memo for expensive components
- [ ] useCallback for event handlers
- [ ] useMemo for expensive calculations
- [ ] Keys properly set for lists
- [ ] No inline object/array creation
- [ ] No unnecessary re-renders

### Metrics
- [ ] FCP (First Contentful Paint) < 1.8s
- [ ] LCP (Largest Contentful Paint) < 2.5s
- [ ] CLS (Cumulative Layout Shift) < 0.1
- [ ] INP (Interaction to Next Paint) < 200ms
- [ ] Lighthouse score > 90

---

## 3. Security Checklist

### Input Security
- [ ] All user input validated
- [ ] Server-side validation done
- [ ] SQL injection prevention
- [ ] XSS prevention (DOMPurify for HTML)
- [ ] No eval() usage

### Authentication & Authorization
- [ ] JWT/OAuth implemented
- [ ] Secure token storage (HttpOnly cookies)
- [ ] CSRF protection in place
- [ ] Password properly hashed (bcrypt, Argon2)
- [ ] Session timeout configured

### Data Security
- [ ] HTTPS enforced
- [ ] Secrets in environment variables
- [ ] No sensitive data in localStorage
- [ ] API rate limiting
- [ ] CORS properly configured

### Dependencies
- [ ] No dependencies with known vulnerabilities
- [ ] Regular npm audit
- [ ] Minimum dependency set
- [ ] Pinned versions for critical packages

---

## 4. Accessibility Checklist

### WCAG 2.1 Level AA
- [ ] Semantic HTML used
- [ ] ARIA labels for non-semantic elements
- [ ] Form labels associated with inputs
- [ ] Keyboard navigation works
- [ ] Focus visible and managed
- [ ] Color contrast ratio 4.5:1 (text)
- [ ] Error messages clear and helpful
- [ ] Alt text for images
- [ ] Video captions
- [ ] Screen reader tested

### Tools
- [ ] axe DevTools browser extension
- [ ] WAVE Web Accessibility Evaluation
- [ ] Lighthouse accessibility audit
- [ ] Manual keyboard testing
- [ ] Screen reader testing (NVDA, JAWS)

---

## 5. Testing Strategy

### Test Pyramid
```
        /\
       /  \     E2E (10%)
      /____\
     /      \
    /  Unit  \  Integration (30%)
   /________\
  /          \
 /    Unit    \ Unit Tests (60%)
/_____________\
```

### Test Coverage
```
Target:
- Statements: > 80%
- Branches: > 75%
- Functions: > 80%
- Lines: > 80%
```

### Testing Checklist
- [ ] Unit tests for business logic
- [ ] Component tests for rendering
- [ ] Integration tests for feature flows
- [ ] E2E tests for user journeys
- [ ] Error scenarios tested
- [ ] Edge cases covered
- [ ] Accessibility tested
- [ ] Performance tests included
- [ ] Snapshot tests cautiously
- [ ] Mock external dependencies

---

## 6. Documentation Standards

### Code Comments
```javascript
// Good: Explains why, not what
// User object is cloned to prevent mutations
const updatedUser = { ...user, name: newName };

// Bad: States obvious
// Set updated user
const updatedUser = { ...user, name: newName };

// TODO: Add caching for performance
// See issue #123 for details
```

### Component Documentation
```typescript
/**
 * UserProfile component displays user information
 * 
 * @component
 * @example
 * return (
 *   <UserProfile userId={123} onUpdate={handleUpdate} />
 * )
 * 
 * @param {string} userId - User ID to display
 * @param {Function} onUpdate - Callback when user updates
 * @returns {JSX.Element}
 */
function UserProfile({ userId, onUpdate }) {
    // Implementation
}
```

### README Template
```markdown
# Feature Name

## Overview
Brief description of what this feature does.

## Usage
```jsx
<Component prop="value" />
```

## Props
- `prop` (string, required): Description
- `optional` (boolean): Description

## Examples
Link to Storybook or examples.

## Testing
How to test this component.

## Related
Links to related components or docs.
```

---

## 7. Common Pitfalls

### State Management
```javascript
// ✗ WRONG: Mutating state directly
state.user.name = 'Alice';

// ✓ CORRECT: Creating new object
setState(prev => ({ ...prev, user: { ...prev.user, name: 'Alice' } }));

// ✗ WRONG: State in props
function Child(props) {
    const [state] = useState(props.initialValue);  // Won't update when prop changes
}

// ✓ CORRECT: Use effect for prop changes
useEffect(() => {
    setState(initialValue);
}, [initialValue]);
```

### Dependencies
```javascript
// ✗ WRONG: Missing dependency
useEffect(() => {
    console.log(userId);
}, []);  // userId not in dependencies!

// ✓ CORRECT: Include all dependencies
useEffect(() => {
    console.log(userId);
}, [userId]);
```

### Keys in Lists
```javascript
// ✗ WRONG: Using index as key
{items.map((item, index) => <Item key={index} {...item} />)}

// ✓ CORRECT: Using unique identifier
{items.map(item => <Item key={item.id} {...item} />)}
```

---

## 8. Interview Preparation

### Front-end Concepts
1. **React Fundamentals**: JSX, Components, Props, State
2. **Hooks**: useState, useEffect, useContext, useReducer, custom hooks
3. **Performance**: Memoization, code splitting, lazy loading
4. **State Management**: Redux, Context API, Zustand
5. **Routing**: React Router, nested routes, protected routes
6. **Testing**: Jest, React Testing Library
7. **TypeScript**: Basic types, interfaces, generics
8. **CSS**: Flexbox, Grid, responsive design

### Common Interview Questions

#### Beginner Level
1. What is JSX?
2. What's the difference between state and props?
3. When to use useState vs useReducer?
4. How does rendering work in React?
5. What is virtual DOM?

#### Intermediate Level
1. What are React hooks and rules?
2. How to optimize performance?
3. What is prop drilling and how to solve it?
4. How does useEffect work?
5. What is React.memo?

#### Advanced Level
1. Design a state management solution
2. How to handle complex form state?
3. Implement a custom hook for X functionality
4. What patterns to use for scalable apps?
5. How to debug performance issues?

### System Design Questions
1. Design a photo sharing app
2. Build a real-time chat application
3. Create a e-commerce platform
4. Build a productivity app with collaboration
5. Design a content management system

---

## Exercises

### Exercise 1: Code Review
```javascript
// Review this code for issues
function UserList({ users }) {
    return (
        <ul>
            {users.map((user, i) => (
                <li key={i} onClick={() => console.log(user)}>
                    {user.name}
                </li>
            ))}
        </ul>
    );
}
```

**Issues Found:**
1. Using index as key (should use user.id)
2. Creating function in render (should use useCallback)
3. Console.log in production

**Corrected:**
```javascript
const UserList = React.memo(function UserList({ users }) {
    const handleClick = useCallback((user) => {
        console.log(user);
    }, []);
    
    return (
        <ul>
            {users.map(user => (
                <li key={user.id} onClick={() => handleClick(user)}>
                    {user.name}
                </li>
            ))}
        </ul>
    );
});
```

### Exercise 2: Performance Optimization
```javascript
// Optimize this component
function Dashboard({ userId, filters }) {
    const [data, setData] = useState(null);
    
    useEffect(() => {
        fetch(`/api/data?userId=${userId}&filters=${filters}`)
            .then(r => r.json())
            .then(setData);
    }, [userId, filters]);
    
    return <div>{data?.map(item => <Item key={item.id} {...item} />)}</div>;
}
```

**Solution:**
```javascript
const Dashboard = React.memo(function Dashboard({ userId, filters }) {
    const [data, setData] = useState(null);
    
    const queryKey = useMemo(() => ({
        userId,
        filters: JSON.stringify(filters)
    }), [userId, filters]);
    
    useEffect(() => {
        fetch(`/api/data?userId=${queryKey.userId}&filters=${queryKey.filters}`)
            .then(r => r.json())
            .then(setData);
    }, [queryKey]);
    
    return (
        <div>
            {data?.map(item => (
                <React.memo(Item) key={item.id} {...item} />
            ))}
        </div>
    );
});
```

### Exercise 3: Security Review
```javascript
// Find security issues
function UserProfile({ user }) {
    const handleUpdate = async (name) => {
        const response = await fetch('/api/update', {
            method: 'POST',
            body: JSON.stringify({ name })
        });
        setUser(await response.json());
    };
    
    return (
        <div>
            <h1 dangerouslySetInnerHTML={{ __html: user.name }} />
        </div>
    );
}
```

**Issues:**
1. No CSRF protection
2. dangerouslySetInnerHTML (XSS vulnerability)
3. No error handling
4. No input validation

**Fixed:**
```javascript
function UserProfile({ user }) {
    const handleUpdate = async (name) => {
        if (!name || name.length > 100) {
            setError('Invalid name');
            return;
        }
        
        try {
            const response = await fetch('/api/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': getCsrfToken()
                },
                body: JSON.stringify({ name })
            });
            
            if (!response.ok) throw new Error('Update failed');
            setUser(await response.json());
        } catch (error) {
            setError(error.message);
        }
    };
    
    return <div><h1>{sanitize(user.name)}</h1></div>;
}
```

---

## Interview Questions

### Behavioral Questions

**Q1: Describe a challenging bug you fixed**
A: Explain the problem, debugging process, and solution

**Q2: How do you approach learning new technologies?**
A: Show curiosity, example projects, continuous learning

**Q3: Tell about a performance optimization you did**
A: Problem, solution, metrics improved

---

## Summary

- **Quality:** Consistent code, SOLID principles
- **Performance:** Lazy load, memoize, optimize metrics
- **Security:** Validate, protect tokens, sanitize HTML
- **Accessibility:** Semantic HTML, ARIA, keyboard nav
- **Testing:** Unit, integration, E2E tests
- **Documentation:** Comments, READMEs, type hints
- **Pitfalls:** State mutations, missing deps, bad keys
- **Interview:** Systems design, code review, problem-solving
- **Preparation:** Practice, mock interviews, projects
- **Growth:** Keep learning, review code, contribute OSS

**Next:** Complete interview guide & next steps!
