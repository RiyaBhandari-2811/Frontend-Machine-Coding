# React with TypeScript - Type Safety & Best Practices

## Table of Contents
1. TypeScript Setup
2. Component Types
3. Props Typing
4. State & Hooks Typing
5. Event Handling
6. Advanced Types
7. Generic Components
8. Best Practices

---

## 1. TypeScript Setup

### Create React App with TypeScript
```bash
npx create-react-app my-app --template typescript

# Or add to existing project
npm install --save typescript @types/react @types/react-dom

# Create tsconfig.json
npx tsc --init
```

### TypeScript Configuration
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "jsx": "react-jsx",
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node"
  }
}
```

---

## 2. Component Types

### Functional Component
```typescript
import React, { FC, ReactNode } from 'react';

// Type 1: FC (Function Component)
const MyComponent: FC = () => {
    return <div>Hello</div>;
};

// Type 2: React.FunctionComponent
const MyComponent2: React.FunctionComponent = () => {
    return <div>Hello</div>;
};

// Type 3: Arrow function with return type
const MyComponent3 = (): JSX.Element => {
    return <div>Hello</div>;
};

// Best practice: Explicit with props type
interface MyComponentProps {
    name: string;
    age: number;
    children?: ReactNode;
}

const MyComponent4: FC<MyComponentProps> = ({ name, age, children }) => {
    return (
        <div>
            <h1>{name} ({age})</h1>
            {children}
        </div>
    );
};
```

### Class Component
```typescript
import React, { Component } from 'react';

interface Props {
    name: string;
}

interface State {
    count: number;
}

class Counter extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { count: 0 };
    }
    
    render(): JSX.Element {
        return (
            <div>
                <p>{this.props.name}: {this.state.count}</p>
                <button onClick={() => this.setState({ count: this.state.count + 1 })}>
                    Increment
                </button>
            </div>
        );
    }
}
```

---

## 3. Props Typing

### Component Props
```typescript
interface ButtonProps {
    // Required string
    label: string;
    
    // Optional boolean
    disabled?: boolean;
    
    // Event handler
    onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
    
    // Union type
    variant: 'primary' | 'secondary' | 'danger';
    
    // Optional with default
    size?: 'small' | 'medium' | 'large';
}

const Button: FC<ButtonProps> = ({
    label,
    disabled = false,
    onClick,
    variant,
    size = 'medium'
}) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`btn btn-${variant} btn-${size}`}
        >
            {label}
        </button>
    );
};
```

### Children Type
```typescript
interface CardProps {
    title: string;
    children?: React.ReactNode;  // Any valid React content
}

const Card: FC<CardProps> = ({ title, children }) => {
    return (
        <div className="card">
            <h2>{title}</h2>
            <div className="content">{children}</div>
        </div>
    );
};

interface ListProps {
    items: React.ReactElement[];  // Array of React elements
}

const List: FC<ListProps> = ({ items }) => {
    return <ul>{items}</ul>;
};
```

---

## 4. State & Hooks Typing

### useState
```typescript
// Explicit type
const [count, setCount] = useState<number>(0);

// Type inference
const [name, setName] = useState('');  // Inferred as string

// Complex type
interface User {
    id: number;
    name: string;
    email: string;
}

const [user, setUser] = useState<User | null>(null);

const [users, setUsers] = useState<User[]>([]);
```

### useEffect
```typescript
// No return
useEffect(() => {
    console.log('Component mounted');
}, []);

// With cleanup
useEffect(() => {
    const timer = setTimeout(() => {
        setCount(c => c + 1);
    }, 1000);
    
    return () => clearTimeout(timer);
}, []);

// Type dependencies
useEffect(() => {
    // userId changes
}, [userId]);
```

### useContext
```typescript
interface User {
    id: number;
    name: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}
```

### Custom Hooks
```typescript
// Hook with typed return
function useFetch<T>(url: string): {
    data: T | null;
    loading: boolean;
    error: Error | null;
} {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    
    useEffect(() => {
        setLoading(true);
        fetch(url)
            .then(r => r.json())
            .then((d: T) => setData(d))
            .catch(err => setError(err))
            .finally(() => setLoading(false));
    }, [url]);
    
    return { data, loading, error };
}

// Usage with generic
interface Post {
    id: number;
    title: string;
}

const { data: posts } = useFetch<Post[]>('/api/posts');
```

---

## 5. Event Handling

### React Events
```typescript
// Click event
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log(e.currentTarget);
};

// Form event
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.value);
};

// Keyboard event
const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
        console.log('Enter pressed');
    }
};

// Form submit
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(e.currentTarget);
};

// Generic event
const handleChange2 = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    console.log(e.target.value);
};
```

---

## 6. Advanced Types

### Utility Types
```typescript
// Partial - all properties optional
type UserUpdate = Partial<User>;

// Required - all properties required
type CompleteUser = Required<User>;

// Readonly - all properties readonly
type ReadonlyUser = Readonly<User>;

// Pick - select specific properties
type UserPreview = Pick<User, 'id' | 'name'>;

// Omit - exclude specific properties
type UserWithoutPassword = Omit<User, 'password'>;

// Record - map keys to values
type UserRoles = Record<'admin' | 'user' | 'guest', boolean>;
// { admin: boolean, user: boolean, guest: boolean }
```

### Union & Intersection
```typescript
// Union - one or the other
type Status = 'pending' | 'success' | 'error';

type LoadingState = {
    status: 'loading';
    error: null;
};

type ErrorState = {
    status: 'error';
    error: Error;
};

type State = LoadingState | ErrorState;

// Intersection - combination
type Named = { name: string };
type Aged = { age: number };
type Person = Named & Aged;  // { name: string, age: number }
```

---

## 7. Generic Components

### Generic List Component
```typescript
interface ListProps<T> {
    items: T[];
    renderItem: (item: T) => ReactNode;
    keyExtractor: (item: T) => string | number;
}

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
    return (
        <ul>
            {items.map(item => (
                <li key={keyExtractor(item)}>
                    {renderItem(item)}
                </li>
            ))}
        </ul>
    );
}

// Usage
<List<User>
    items={users}
    renderItem={user => <span>{user.name}</span>}
    keyExtractor={user => user.id}
/>
```

### Generic Hook
```typescript
function useAsync<T, E = string>(
    asyncFunction: () => Promise<T>,
    immediate = true
) {
    const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
    const [value, setValue] = useState<T | null>(null);
    const [error, setError] = useState<E | null>(null);
    
    const execute = useCallback(async () => {
        setStatus('pending');
        try {
            const response = await asyncFunction();
            setValue(response);
            setStatus('success');
        } catch (error) {
            setError(error as E);
            setStatus('error');
        }
    }, [asyncFunction]);
    
    useEffect(() => {
        if (immediate) {
            execute();
        }
    }, [execute, immediate]);
    
    return { execute, status, value, error };
}
```

---

## 8. Best Practices

### Type Checklist
```typescript
// ✓ Always type props
interface Props {
    name: string;
}

// ✓ Use specific types (not any)
// ✗ const data: any = fetchData();
const data: User = fetchData();

// ✓ Type event handlers
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {};

// ✓ Type state
const [user, setUser] = useState<User | null>(null);

// ✓ Type function returns
function getData(): Promise<User[]> {
    return fetch('/api/users').then(r => r.json());
}

// ✓ Use enums for constants
enum Status {
    PENDING = 'pending',
    SUCCESS = 'success',
    ERROR = 'error'
}

// ✓ Use interfaces for objects
interface User {
    id: number;
    name: string;
}

// ✓ Use type aliases for unions
type Result<T> = { success: true; data: T } | { success: false; error: string };
```

### Common Patterns
```typescript
// Make components generic
function useValue<T>(initialValue: T) {
    const [value, setValue] = useState<T>(initialValue);
    return { value, setValue };
}

// Extract complex props to separate interface
interface ComplexComponentProps extends BaseProps {
    // Additional props
}

// Use as const for literal types
const SIZES = ['small', 'medium', 'large'] as const;
type Size = typeof SIZES[number];  // 'small' | 'medium' | 'large'

// Conditional types
type IsString<T> = T extends string ? true : false;
```

---

## Exercises

### Exercise 1: Type Component Props
```typescript
// Create Button component with:
// - Required label
// - Optional disabled
// - Click handler
// - Variant type

// Your code
```

**Solution:**
```typescript
interface ButtonProps {
    label: string;
    disabled?: boolean;
    onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
    variant: 'primary' | 'secondary';
}

const Button: FC<ButtonProps> = ({ label, onClick, variant }) => (
    <button onClick={onClick} className={variant}>
        {label}
    </button>
);
```

### Exercise 2: Type Custom Hook
```typescript
// Create useAsync hook that:
// - Accepts async function
// - Returns data, loading, error
// - Is generic for any data type

// Your code
```

**Solution:**
```typescript
function useAsync<T>(
    fn: () => Promise<T>
): {
    data: T | null;
    loading: boolean;
    error: Error | null;
} {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    
    useEffect(() => {
        fn()
            .then(setData)
            .catch(setError)
            .finally(() => setLoading(false));
    }, [fn]);
    
    return { data, loading, error };
}
```

### Exercise 3: Generic List Component
```typescript
// Create List component that:
// - Works with any data type
// - Renders items with custom renderer
// - Extracts keys safely

// Your code
```

**Solution:**
```typescript
interface ListProps<T> {
    items: T[];
    renderItem: (item: T) => ReactNode;
    keyExtractor: (item: T) => string | number;
}

const List = <T,>({ items, renderItem, keyExtractor }: ListProps<T>) => (
    <ul>
        {items.map(item => (
            <li key={keyExtractor(item)}>{renderItem(item)}</li>
        ))}
    </ul>
);
```

---

## Interview Questions

### Theoretical Questions

**Q1: What is TypeScript?**
A: Superset of JavaScript adding static type checking.

**Q2: Why use TypeScript in React?**
A: Catch errors early, better IDE support, self-documenting code.

**Q3: What is FC?**
A: FunctionComponent type for React components.

**Q4: How to type props?**
A: Create interface or type alias for component props.

**Q5: What are generics?**
A: Reusable components/hooks that work with any type.

---

## Summary

- **Setup:** Create React App or add typescript package
- **Components:** FC<Props> for functions, Component<Props, State> for classes
- **Props:** Always create interface/type for props
- **State:** Use useState<Type>() with explicit types
- **Events:** React.ChangeEvent, React.MouseEvent, etc.
- **Hooks:** Type return value and dependencies
- **Generics:** <T> makes components reusable with types
- **Utilities:** Partial, Pick, Omit for type manipulation
- **Best Practices:** No any, explicit types, type returns
- **Benefits:** Type safety, autocomplete, documentation

**Next:** System design patterns!
