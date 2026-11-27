# React Testing & Quality

## Table of Contents
1. Jest Basics
2. React Testing Library
3. Component Testing
4. Snapshot Testing
5. Mocking
6. Async Testing
7. Code Coverage
8. Best Practices

---

## 1. Jest Basics

### Setup & Configuration
```javascript
// package.json
{
  "jest": {
    "testEnvironment": "jsdom",
    "setupFilesAfterEnv": ["<rootDir>/src/setupTests.js"]
  }
}

// Run tests
npm test

// Watch mode
npm test -- --watch

// Coverage
npm test -- --coverage
```

### Basic Test Structure
```javascript
// math.js
export function add(a, b) {
    return a + b;
}

// math.test.js
import { add } from './math';

describe('Math functions', () => {
    test('add should return sum', () => {
        expect(add(2, 3)).toBe(5);
    });
    
    test('add with negative numbers', () => {
        expect(add(-2, -3)).toBe(-5);
    });
});

// Output:
// PASS  math.test.js
//   Math functions
//     ✓ add should return sum (1 ms)
//     ✓ add with negative numbers (1 ms)
```

### Matchers
```javascript
test('matchers', () => {
    // Equality
    expect(value).toBe(expected);              // ===
    expect(value).toEqual(expected);           // Deep equality
    
    // Truthiness
    expect(value).toBeTruthy();
    expect(value).toBeFalsy();
    expect(value).toBeNull();
    expect(value).toBeUndefined();
    
    // Numbers
    expect(value).toBeGreaterThan(5);
    expect(value).toBeLessThan(10);
    expect(value).toBeCloseTo(0.1 + 0.2);
    
    // Strings
    expect(str).toMatch(/regex/);
    expect(str).toContain('substring');
    
    // Arrays
    expect(arr).toContain('item');
    expect(arr).toHaveLength(3);
    
    // Objects
    expect(obj).toHaveProperty('key');
    expect(obj).toHaveProperty('key', value);
    
    // Exceptions
    expect(() => throwFunc()).toThrow();
    expect(() => throwFunc()).toThrow('error message');
});
```

---

## 2. React Testing Library

### Setup
```javascript
// setupTests.js
import '@testing-library/jest-dom';

// package.json
{
  "devDependencies": {
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0"
  }
}
```

### Basic Component Test
```javascript
// Button.js
export function Button({ onClick, children }) {
    return <button onClick={onClick}>{children}</button>;
}

// Button.test.js
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './Button';

test('Button renders with text', () => {
    render(<Button>Click me</Button>);
    
    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toBeInTheDocument();
});

test('Button calls onClick when clicked', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    
    const button = screen.getByRole('button');
    await userEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
});
```

### Querying Elements
```javascript
import { render, screen } from '@testing-library/react';

render(<Component />);

// Best (by role)
screen.getByRole('button', { name: 'Submit' });

// Good
screen.getByLabelText('Username');
screen.getByPlaceholderText('Enter name');
screen.getByDisplayValue('current value');
screen.getByText('Welcome');

// Last resort
screen.getByTestId('unique-id');

// Query variants
getBy...      // Throws error if not found
queryBy...    // Returns null if not found
findBy...     // Returns promise, waits for element
getAllBy...   // Returns array
queryAllBy... // Returns array or empty array
findAllBy...  // Returns promise with array
```

---

## 3. Component Testing

### Form Component Test
```javascript
// LoginForm.js
export function LoginForm({ onSubmit }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ email, password });
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Email"
            />
            <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password"
            />
            <button type="submit">Login</button>
        </form>
    );
}

// LoginForm.test.js
test('Form submits with email and password', async () => {
    const handleSubmit = jest.fn();
    render(<LoginForm onSubmit={handleSubmit} />);
    
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: 'Login' });
    
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.type(passwordInput, 'password123');
    await userEvent.click(submitButton);
    
    expect(handleSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
    });
});
```

### Conditional Rendering Test
```javascript
function Alert({ type, message }) {
    return (
        <div role="alert" data-testid={`alert-${type}`}>
            {message}
        </div>
    );
}

test('Shows error alert', () => {
    render(<Alert type="error" message="Something went wrong" />);
    
    const alert = screen.getByTestId('alert-error');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent('Something went wrong');
});

test('Shows success alert', () => {
    render(<Alert type="success" message="Success!" />);
    
    const alert = screen.getByTestId('alert-success');
    expect(alert).toBeInTheDocument();
});
```

---

## 4. Snapshot Testing

### Snapshot Basics
```javascript
function Card({ title, description }) {
    return (
        <div className="card">
            <h2>{title}</h2>
            <p>{description}</p>
        </div>
    );
}

// Card.test.js
test('Card snapshot', () => {
    const { container } = render(
        <Card title="Test" description="Description" />
    );
    
    expect(container).toMatchSnapshot();
});

// First run creates Card.test.js.snap:
// exports[`Card snapshot 1`] = `
// <div>
//   <div
//     class="card"
//   >
//     <h2>
//       Test
//     </h2>
//     <p>
//       Description
//     </p>
//   </div>
// </div>
// `;

// If component changes, test fails and prompts to update snapshot
// npm test -- -u
```

### When to Use Snapshots
```
✓ USE for:
  - Stable UI components
  - Full component output

✗ AVOID for:
  - Frequently changing components
  - Random/dynamic data
  - Lists with many items
```

---

## 5. Mocking

### Mock Functions
```javascript
test('Mock function', () => {
    const mock = jest.fn();
    mock('hello');
    
    expect(mock).toHaveBeenCalled();
    expect(mock).toHaveBeenCalledWith('hello');
    expect(mock.mock.calls).toHaveLength(1);
    
    // Return values
    const mockWithReturn = jest.fn(() => 'result');
    expect(mockWithReturn()).toBe('result');
});

// Mock with specific behavior
const mockFetch = jest.fn()
    .mockResolvedValue({ json: () => Promise.resolve({ id: 1 }) });
```

### Mock Modules
```javascript
// math.js
export const api = {
    getUser: () => fetch('/api/user')
};

// Component.js
import { api } from './math';

export function UserCard() {
    const [user, setUser] = useState(null);
    
    useEffect(() => {
        api.getUser().then(r => r.json()).then(setUser);
    }, []);
    
    return <div>{user?.name}</div>;
}

// Component.test.js
jest.mock('./math');
import { api } from './math';

test('Loads user data', async () => {
    api.getUser.mockResolvedValue({
        json: () => Promise.resolve({ name: 'John' })
    });
    
    render(<UserCard />);
    
    await waitFor(() => {
        expect(screen.getByText('John')).toBeInTheDocument();
    });
});
```

### Mock Browser APIs
```javascript
test('Window alert', () => {
    global.alert = jest.fn();
    
    // Trigger alert
    // ...
    
    expect(global.alert).toHaveBeenCalledWith('Alert message');
});

test('LocalStorage', () => {
    const mockStorage = {
        getItem: jest.fn(),
        setItem: jest.fn()
    };
    
    Object.defineProperty(window, 'localStorage', {
        value: mockStorage
    });
    
    localStorage.setItem('key', 'value');
    expect(mockStorage.setItem).toHaveBeenCalledWith('key', 'value');
});
```

---

## 6. Async Testing

### Wait For Elements
```javascript
import { render, screen, waitFor } from '@testing-library/react';

function UserList() {
    const [users, setUsers] = useState([]);
    
    useEffect(() => {
        fetch('/api/users')
            .then(r => r.json())
            .then(setUsers);
    }, []);
    
    return (
        <ul>
            {users.map(u => <li key={u.id}>{u.name}</li>)}
        </ul>
    );
}

test('Displays users after loading', async () => {
    // Mock fetch
    global.fetch = jest.fn(() =>
        Promise.resolve({
            json: () => Promise.resolve([
                { id: 1, name: 'John' }
            ])
        })
    );
    
    render(<UserList />);
    
    // Wait for user to appear
    const user = await screen.findByText('John');
    expect(user).toBeInTheDocument();
});

// Alternative with waitFor
test('Displays users (waitFor)', async () => {
    global.fetch = jest.fn();
    render(<UserList />);
    
    await waitFor(() => {
        expect(screen.getByText('John')).toBeInTheDocument();
    });
});
```

### Act
```javascript
import { render, screen, act } from '@testing-library/react';

test('Update state with act', async () => {
    const { rerender } = render(<Counter />);
    
    const button = screen.getByRole('button');
    
    // Wrap state updates in act
    await act(async () => {
        button.click();
    });
    
    expect(screen.getByText('1')).toBeInTheDocument();
});
```

---

## 7. Code Coverage

### Running Coverage
```bash
npm test -- --coverage

# Output:
# File           | % Stmts | % Branch | % Funcs | % Lines
# --------------|---------|----------|---------|----------
# Button.js     |   100   |    100   |   100   |   100
# LoginForm.js  |    95   |     90   |   100   |    95
```

### Coverage Thresholds
```javascript
// package.json
{
  "jest": {
    "collectCoverageFrom": [
      "src/**/*.js",
      "!src/index.js"
    ],
    "coverageThreshold": {
      "global": {
        "branches": 80,
        "functions": 80,
        "lines": 80,
        "statements": 80
      }
    }
  }
}
```

---

## 8. Best Practices

### Testing Best Practices
```javascript
// 1. Test behavior, not implementation
// ✗ WRONG - Tests implementation
test('state is set to 1', () => {
    const { getByText } = render(<Counter />);
    expect(component.state.count).toBe(1);  // Can't do this with hooks
});

// ✓ CORRECT - Tests behavior
test('displays count of 1', () => {
    render(<Counter />);
    expect(screen.getByText('1')).toBeInTheDocument();
});

// 2. Use query order: getByRole > getByLabel > getByPlaceholder > getByTestId
screen.getByRole('button', { name: 'Submit' });  // Best
screen.getByLabelText('Email');                 // Good
screen.getByTestId('submit-btn');              // Last resort

// 3. Test user interactions
await userEvent.type(input, 'text');
await userEvent.click(button);

// 4. Wait for async operations
await screen.findByText('Loaded');
await waitFor(() => expect(element).toBeInTheDocument());

// 5. Mock external dependencies
jest.mock('axios');
jest.mock('./api');

// 6. Clean up after tests
afterEach(() => {
    jest.clearAllMocks();
});

// 7. Use descriptive test names
test('Submits form with valid email and password', async () => {
    // Test code
});
```

### Component Testing Pattern
```javascript
test('Complete user flow', async () => {
    // 1. Render
    render(<LoginForm onSubmit={handleSubmit} />);
    
    // 2. Query
    const emailInput = screen.getByPlaceholderText('Email');
    const submitButton = screen.getByRole('button');
    
    // 3. Act
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.click(submitButton);
    
    // 4. Assert
    expect(handleSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'test@example.com' })
    );
});
```

---

## Exercises

### Exercise 1: Button Test
```javascript
// Test Button component
// Should render, should handle click

function Button({ onClick, children }) {
    return <button onClick={onClick}>{children}</button>;
}
```

**Solution:**
```javascript
test('Button renders and handles click', async () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    
    await userEvent.click(button);
    expect(handleClick).toHaveBeenCalled();
});
```

### Exercise 2: Form Test
```javascript
// Test form submission
// Mock submit handler

function SimpleForm({ onSubmit }) {
    const [value, setValue] = useState('');
    
    return (
        <form onSubmit={() => onSubmit(value)}>
            <input value={value} onChange={e => setValue(e.target.value)} />
            <button>Submit</button>
        </form>
    );
}
```

**Solution:**
```javascript
test('Form submits with value', async () => {
    const handleSubmit = jest.fn();
    render(<SimpleForm onSubmit={handleSubmit} />);
    
    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button');
    
    await userEvent.type(input, 'test');
    await userEvent.click(button);
    
    expect(handleSubmit).toHaveBeenCalledWith('test');
});
```

### Exercise 3: Async Component Test
```javascript
// Test component that fetches data
// Mock fetch, wait for data

function UserList() {
    const [users, setUsers] = useState([]);
    
    useEffect(() => {
        fetch('/api/users')
            .then(r => r.json())
            .then(setUsers);
    }, []);
    
    return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}
```

**Solution:**
```javascript
test('Displays users after fetch', async () => {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            json: () => Promise.resolve([{ id: 1, name: 'John' }])
        })
    );
    
    render(<UserList />);
    
    const user = await screen.findByText('John');
    expect(user).toBeInTheDocument();
});
```

---

## Interview Questions

### Theoretical Questions

**Q1: What is Jest?**
A: JavaScript testing framework with assertion library.

**Q2: What is React Testing Library?**
A: Library for testing React components by user interactions.

**Q3: What is snapshot testing?**
A: Comparing component output to saved snapshot.

**Q4: When to use queryBy vs getBy?**
A: queryBy for absent elements, getBy for present elements.

**Q5: How to test async operations?**
A: Use findBy or waitFor to wait for elements.

---

## Code-Based Interview Questions

**Q1: What is output?**
```javascript
test('Component renders', () => {
    render(<Component />);
    screen.getByText('Hello');
});
// Should this pass?
```
A: Only if Component renders "Hello" text

**Q2: Predict:**
```javascript
const mockFn = jest.fn(() => 'result');
mockFn();
// What is mockFn.mock.calls length?
```
A: 1 (function called once)

**Q3: What is correct?**
```javascript
test('Async test', async () => {
    // Which should wait for element?
    screen.getByText('Loaded');
    // or
    await screen.findByText('Loaded');
});
```
A: findByText (returns promise)

**Q4: Spot the issue:**
```javascript
test('Button test', () => {
    render(<Button onClick={...} />);
    screen.getByRole('button').click();  // Should use?
});
```
A: Use userEvent.click() not .click()

**Q5: What is output?**
```javascript
expect(mockFn).toHaveBeenCalledWith('arg');
// If called with different arg?
```
A: Test fails (assertion error)

---

## Follow-up Questions & Confusing Concepts

**Q: Should I test implementation details?**
A: No, test behavior/user interactions.

**Q: When to use queryBy?**
A: When testing element should NOT be present.

**Q: Do I need 100% coverage?**
A: No, 70-80% is usually good.

**Q: How to test hooks?**
A: Use renderHook from testing library or test through component.

---

## Summary

- **Jest**: JavaScript testing framework
- **Render**: Render component for testing
- **Screen**: Query elements by role/text
- **UserEvent**: Simulate user interactions
- **FindBy/WaitFor**: Wait for async elements
- **Mock**: Replace dependencies with test doubles
- **Snapshot**: Compare output to saved snapshot
- **Coverage**: Measure code tested
- **Behavior Testing**: Test what user sees
- **Best Practices**: Query by role, mock externals, clean up

**Next Step:** Master advanced component patterns!
