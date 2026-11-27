# React Tools, Libraries & Ecosystem Guide

## Table of Contents
1. Build Tools & Bundlers
2. State Management Ecosystem
3. Testing Tools & Frameworks
4. Component Libraries
5. Styling Solutions
6. Developer Tools
7. Utility Libraries
8. Monorepo Tools

---

## 1. Build Tools & Bundlers

### Vite
```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    'vendor': ['react', 'react-dom'],
                    'utils': ['lodash', 'axios']
                }
            }
        }
    },
    server: {
        proxy: {
            '/api': 'http://localhost:3000'
        }
    }
});

// npm run dev (HMR enabled)
// npm run build (tree-shaking, code splitting)
// npm run preview (production preview)
```

### Webpack
```javascript
// webpack.config.js
module.exports = {
    mode: 'production',
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[contenthash].js',
        chunkFilename: '[name].[contenthash].chunk.js'
    },
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                use: 'babel-loader'
            }
        ]
    },
    plugins: [
        new BundleAnalyzerPlugin()
    ]
};
```

### Create React App
```bash
# Traditional CRA setup
npx create-react-app my-app
cd my-app
npm start

# Modern alternatives
npx create-react-app --template typescript
```

---

## 2. State Management Ecosystem

### Redux Toolkit
```javascript
import { createSlice, createAsyncThunk, configureStore } from '@reduxjs/toolkit';

// Thunk for async
export const fetchUsers = createAsyncThunk(
    'users/fetchUsers',
    async () => {
        const response = await fetch('/api/users');
        return response.json();
    }
);

// Slice
const usersSlice = createSlice({
    name: 'users',
    initialState: { data: [], loading: false },
    reducers: {
        userAdded: (state, action) => {
            state.data.push(action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.data = action.payload;
                state.loading = false;
            });
    }
});

// Store
const store = configureStore({
    reducer: {
        users: usersSlice.reducer
    }
});

// Usage
function Users() {
    const dispatch = useDispatch();
    const users = useSelector(state => state.users.data);
    
    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);
}
```

### Zustand
```javascript
import create from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
    persist(
        (set) => ({
            count: 0,
            increment: () => set(state => ({ count: state.count + 1 })),
            decrement: () => set(state => ({ count: state.count - 1 }))
        }),
        {
            name: 'app-storage'  // localStorage key
        }
    )
);

// Simple usage
function Counter() {
    const { count, increment, decrement } = useStore();
    return (
        <div>
            <p>{count}</p>
            <button onClick={increment}>+</button>
            <button onClick={decrement}>-</button>
        </div>
    );
}
```

### React Query / TanStack Query
```javascript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

function Users() {
    const queryClient = useQueryClient();
    
    // Fetch data
    const { data: users, isLoading, error } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            const response = await fetch('/api/users');
            return response.json();
        },
        staleTime: 5 * 60 * 1000  // 5 minutes
    });
    
    // Mutate data
    const { mutate: deleteUser } = useMutation({
        mutationFn: (userId) => fetch(`/api/users/${userId}`, { method: 'DELETE' }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        }
    });
    
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    
    return (
        <div>
            {users.map(user => (
                <div key={user.id}>
                    <span>{user.name}</span>
                    <button onClick={() => deleteUser(user.id)}>Delete</button>
                </div>
            ))}
        </div>
    );
}
```

---

## 3. Testing Tools & Frameworks

### Jest
```javascript
// __tests__/utils.test.js
describe('utils', () => {
    test('add works correctly', () => {
        expect(add(2, 3)).toBe(5);
    });
    
    test('fetch API', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve({ id: 1 })
            })
        );
        
        const data = await fetchUser();
        expect(data.id).toBe(1);
    });
});
```

### React Testing Library
```javascript
import { render, screen, userEvent } from '@testing-library/react';

describe('Button', () => {
    test('renders and handles click', async () => {
        const handleClick = jest.fn();
        render(<Button onClick={handleClick}>Click me</Button>);
        
        const button = screen.getByText('Click me');
        await userEvent.click(button);
        
        expect(handleClick).toHaveBeenCalled();
    });
});
```

### Cypress
```javascript
// cypress/e2e/app.cy.js
describe('App', () => {
    it('should navigate and test features', () => {
        cy.visit('http://localhost:3000');
        cy.get('[data-testid="login-button"]').click();
        cy.url().should('include', '/login');
        cy.get('input').type('user@example.com');
        cy.get('button[type="submit"]').click();
        cy.contains('Welcome').should('be.visible');
    });
});
```

---

## 4. Component Libraries

### Chakra UI
```jsx
import { Box, Button, Input, ChakraProvider } from '@chakra-ui/react';

function App() {
    return (
        <ChakraProvider>
            <Box p={4}>
                <Input placeholder="Enter text" />
                <Button mt={4} colorScheme="blue">
                    Submit
                </Button>
            </Box>
        </ChakraProvider>
    );
}
```

### Material-UI
```jsx
import { Button, TextField, Box } from '@mui/material';

function App() {
    return (
        <Box sx={{ p: 2 }}>
            <TextField label="Enter text" />
            <Button variant="contained" sx={{ mt: 2 }}>
                Submit
            </Button>
        </Box>
    );
}
```

### Shadcn/ui
```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
```

```jsx
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function App() {
    return (
        <div className="p-4">
            <Input placeholder="Enter text" />
            <Button className="mt-4">Submit</Button>
        </div>
    );
}
```

---

## 5. Styling Solutions

### Tailwind CSS
```jsx
function App() {
    return (
        <div className="container mx-auto p-4">
            <input className="border border-gray-300 px-2 py-1 rounded" />
            <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Submit
            </button>
        </div>
    );
}
```

### Styled Components
```javascript
import styled from 'styled-components';

const Container = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: ${props => props.p || 0}px;
`;

const Button = styled.button`
    background-color: ${props => props.primary ? 'blue' : 'gray'};
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    
    &:hover {
        opacity: 0.8;
    }
`;

function App() {
    return (
        <Container p={16}>
            <Button primary>Submit</Button>
        </Container>
    );
}
```

### CSS Modules
```css
/* Button.module.css */
.button {
    background-color: blue;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
}

.button:hover {
    opacity: 0.8;
}
```

```javascript
import styles from './Button.module.css';

function Button() {
    return <button className={styles.button}>Submit</button>;
}
```

---

## 6. Developer Tools

### React DevTools
```
Install: Chrome Extension / Firefox Extension
Features:
- Component Inspector
- Props & State viewer
- Profiler
- Component highlights
- Re-render tracking
```

### Redux DevTools
```bash
npm install redux-devtools-extension

# Configure in store
import { composeWithDevTools } from 'redux-devtools-extension';

const store = createStore(
    reducer,
    composeWithDevTools()
);
```

### Storybook
```bash
npx sb init
npm run storybook
```

```javascript
// Button.stories.js
export default {
    component: Button,
    title: 'Components/Button'
};

export const Primary = {
    args: { label: 'Primary', variant: 'primary' }
};

export const Secondary = {
    args: { label: 'Secondary', variant: 'secondary' }
};
```

---

## 7. Utility Libraries

### Lodash
```javascript
import { debounce, throttle, groupBy, pick } from 'lodash';

// Debounce
const debouncedSearch = debounce((query) => {
    searchAPI(query);
}, 300);

// Group
const grouped = groupBy(users, 'role');

// Pick
const userPreview = pick(user, ['id', 'name', 'email']);
```

### Axios
```javascript
import axios from 'axios';

// Setup
const api = axios.create({
    baseURL: 'https://api.example.com',
    timeout: 10000,
    headers: {
        'Authorization': `Bearer ${token}`
    }
});

// Request
api.get('/users').then(response => console.log(response.data));

// Error handling
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            // Handle unauthorized
        }
        return Promise.reject(error);
    }
);
```

### Date-fns
```javascript
import { format, addDays, differenceInDays } from 'date-fns';

const today = new Date();
const tomorrow = addDays(today, 1);
const diff = differenceInDays(tomorrow, today);  // 1

const formatted = format(today, 'yyyy-MM-dd');  // 2024-01-15
```

---

## 8. Monorepo Tools

### Monorepo Structure
```
monorepo/
├── packages/
│   ├── ui/              (Shared UI components)
│   ├── utils/           (Shared utilities)
│   ├── web/             (Main web app)
│   └── mobile/          (Mobile app)
├── package.json
└── pnpm-workspace.yaml
```

### Monorepo Setup
```bash
# Using pnpm workspaces
pnpm init
# Add packages/*/package.json

# pnpm-workspace.yaml
packages:
  - 'packages/*'

# Install
pnpm install

# Run command in all packages
pnpm -r run build

# Run in specific package
pnpm --filter @monorepo/ui run build
```

### Turborepo
```json
// turbo.json
{
    "tasks": {
        "build": {
            "dependsOn": ["^build"],
            "outputs": ["dist/**"]
        },
        "test": {
            "inputs": ["src/**", "package.json"]
        }
    }
}
```

```bash
npx turbo build
npx turbo test --filter=@monorepo/web
```

---

## Exercises

### Exercise 1: Setup New Project
```bash
# Create new React project with:
# 1. Vite for bundling
# 2. Tailwind CSS for styling
# 3. React Query for data
# 4. TypeScript
# 5. ESLint & Prettier

npm create vite@latest my-app -- --template react-ts
# Configure rest...
```

### Exercise 2: Integrate Testing
```bash
# Setup testing:
# 1. Install Jest & React Testing Library
# 2. Create test file
# 3. Write component test
# 4. Add to CI/CD

npm install --save-dev jest @testing-library/react
npm run test
```

### Exercise 3: Create Component Library
```bash
# Create reusable component library:
# 1. Setup Storybook
# 2. Create 5 components
# 3. Document each
# 4. Publish to npm

npx sb init
npm run storybook
# Add components and stories
npm publish
```

---

## Interview Questions

**Q1: What's the difference between Vite and Webpack?**
A: Vite is faster (native ESM), Webpack more mature (better for complex configs).

**Q2: When to use Redux vs Zustand?**
A: Redux for large apps with complex state, Zustand for simpler state.

**Q3: How to structure monorepo?**
A: By feature or by platform, use workspaces or Turborepo.

**Q4: What's the best component library?**
A: Depends on project: Chakra (ease), MUI (features), Shadcn (customization).

**Q5: React Testing Library best practices?**
A: Test behavior not implementation, use user-centric queries.

---

## Summary

- **Build:** Vite (fast), Webpack (flexible), CRA (simple)
- **State:** Redux (complex), Zustand (simple), React Query (async)
- **Testing:** Jest (unit), RTL (components), Cypress (E2E)
- **UI:** Chakra (complete), MUI (rich), Shadcn (customizable)
- **Styling:** Tailwind (utility), SC (CSS-in-JS), Modules (scoped)
- **Tools:** React DevTools, Storybook, Redux DevTools
- **Utils:** Lodash, Axios, Date-fns
- **Monorepo:** Pnpm, Yarn, Turborepo
- **Ecosystem:** Vast and growing
- **Choice:** Depends on project needs

**Next: Real-world patterns & debugging!**
