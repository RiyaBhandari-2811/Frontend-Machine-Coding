# React Advanced Topics & Next.js Basics

## Table of Contents
1. Advanced Patterns
2. Performance Optimization Deep Dive
3. Server Components (Next.js)
4. Static Generation
5. API Routes
6. TypeScript with React
7. Web Workers
8. Summary & Next Steps

---

## 1. Advanced Patterns

### Signals Pattern (Alternative to State)
```javascript
// Not standard React, but emerging pattern
// Faster updates, less re-renders

// Signal library example (like Preact signals)
function Counter() {
    const count = signal(0);
    
    return (
        <button onClick={() => count.value++}>
            {count.value}  {/* Only this updates, not whole component */}
        </button>
    );
}

// Benefits:
// - Granular reactivity
// - No batching delays
// - Less re-renders
// - More efficient for large apps

// Current alternatives:
// - Jotai
// - Zustand
// - Recoil
```

### Concurrent Features
```javascript
import { startTransition, useTransition, useDeferredValue } from 'react';

// useTransition - Mark updates as non-urgent
function SearchComponent() {
    const [input, setInput] = useState('');
    const [results, setResults] = useState([]);
    const [isPending, startTransition] = useTransition();
    
    const handleChange = (e) => {
        const value = e.target.value;
        setInput(value);  // Urgent - update input immediately
        
        startTransition(() => {
            // Non-urgent - can be interrupted
            setResults(expensiveSearch(value));
        });
    };
    
    return (
        <div>
            <input value={input} onChange={handleChange} />
            {isPending && <p>Searching...</p>}
            <ul>{results.map(r => <li key={r.id}>{r.name}</li>)}</ul>
        </div>
    );
}

// useDeferredValue - Defer non-urgent values
function SearchResults({ query }) {
    const deferredQuery = useDeferredValue(query);
    const [results, setResults] = useState([]);
    
    useEffect(() => {
        setResults(search(deferredQuery));
    }, [deferredQuery]);
    
    return <ul>{results.map(r => <li key={r.id}>{r.name}</li>)}</ul>;
}
```

---

## 2. Performance Optimization Deep Dive

### Bundle Analysis
```bash
# npm install -save-dev source-map-explorer
npm run build
npx source-map-explorer 'build/static/js/*.js'

# Shows:
# - Which packages take space
# - Unused dependencies
# - Duplicate packages
```

### Code Splitting Advanced
```javascript
// Route-based splitting
const routes = [
    { path: '/', component: React.lazy(() => import('./Home')) },
    { path: '/about', component: React.lazy(() => import('./About')) },
    { path: '/admin', component: React.lazy(() => import('./Admin')) }
];

// Component-based splitting
const Modal = React.lazy(() => import('./Modal'));
const Chart = React.lazy(() => import('./Chart'));

// Webpack magic comments
const Component = React.lazy(() =>
    import(/* webpackChunkName: "feature" */ './Feature')
);

// Prefetching
useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = '/chunks/feature.js';
    document.head.appendChild(link);
}, []);
```

### Image Optimization
```javascript
// ✗ WRONG - Large unoptimized images
<img src="photo.jpg" width="800" height="600" />

// ✓ CORRECT - Multiple sizes with srcset
<img
    src="photo-800.jpg"
    srcSet="photo-400.jpg 400w, photo-800.jpg 800w, photo-1200.jpg 1200w"
    sizes="(max-width: 600px) 400px, (max-width: 1200px) 800px, 1200px"
    alt="Description"
/>

// Or use WebP format
<picture>
    <source srcSet="photo.webp" type="image/webp" />
    <source srcSet="photo.jpg" type="image/jpeg" />
    <img src="photo.jpg" alt="Description" />
</picture>

// Use next/image for automatic optimization in Next.js
import Image from 'next/image';

<Image
    src="/photo.jpg"
    alt="Description"
    width={800}
    height={600}
    priority
    quality={75}
/>
```

---

## 3. Server Components (Next.js)

### React Server Components
```javascript
// app/page.js (automatically server component)
export default async function Page() {
    const data = await fetch('https://api.example.com/data', {
        next: { revalidate: 60 }  // ISR - revalidate every 60 seconds
    });
    
    return <div>{/* data */}</div>;
}

// Benefits:
// - Direct database access
// - No JavaScript sent to browser
// - Faster initial load
// - Secure (API keys hidden)

// Using client components
'use client';

import { useState } from 'react';

export default function Counter() {
    const [count, setCount] = useState(0);
    return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}

// Mix server and client components
import Counter from './Counter';  // Client component

export default function Page() {
    return (
        <div>
            <h1>Server-rendered content</h1>
            <Counter />  {/* Client interactivity */}
        </div>
    );
}
```

---

## 4. Static Generation

### Static Site Generation (SSG)
```javascript
// next.config.js
export const config = {
    unstable_staticParams: true
};

// app/blog/[slug]/page.js
export async function generateStaticParams() {
    const posts = await fetch('https://api.example.com/posts');
    const data = await posts.json();
    
    return data.map(post => ({
        slug: post.slug
    }));
}

export default async function Post({ params }) {
    const response = await fetch(`https://api.example.com/posts/${params.slug}`);
    const post = await response.json();
    
    return <article>{post.content}</article>;
}

// Benefits:
// - Pre-built pages
// - Ultra fast CDN delivery
// - No server needed
// - Revalidate on-demand
```

### Incremental Static Regeneration (ISR)
```javascript
// Generate pages on-demand, then cache
export default async function Post({ params }) {
    const response = await fetch(
        `https://api.example.com/posts/${params.slug}`,
        { next: { revalidate: 60 } }  // Revalidate every 60 seconds
    );
    
    const post = await response.json();
    return <article>{post.content}</article>;
}

// First visitor triggers generation
// Subsequent visitors get cached version
// After 60 seconds, next visitor triggers regeneration
```

---

## 5. API Routes

### Creating API Routes (Next.js)
```javascript
// app/api/users/route.js
export async function GET(request) {
    const users = await db.query('SELECT * FROM users');
    return Response.json(users);
}

export async function POST(request) {
    const data = await request.json();
    const user = await db.query(
        'INSERT INTO users (name, email) VALUES (?, ?)',
        [data.name, data.email]
    );
    return Response.json(user, { status: 201 });
}

// app/api/users/[id]/route.js
export async function GET(request, { params }) {
    const user = await db.query('SELECT * FROM users WHERE id = ?', [params.id]);
    return Response.json(user);
}

export async function PUT(request, { params }) {
    const data = await request.json();
    const user = await db.query(
        'UPDATE users SET name = ?, email = ? WHERE id = ?',
        [data.name, data.email, params.id]
    );
    return Response.json(user);
}

// Usage from frontend
const response = await fetch('/api/users');
const users = await response.json();
```

---

## 6. TypeScript with React

### Component Types
```typescript
import { FC, ReactNode } from 'react';

// Props interface
interface ButtonProps {
    onClick: () => void;
    children: ReactNode;
    disabled?: boolean;
    variant?: 'primary' | 'secondary';
}

// Function component with types
const Button: FC<ButtonProps> = ({
    onClick,
    children,
    disabled = false,
    variant = 'primary'
}) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`btn btn-${variant}`}
        >
            {children}
        </button>
    );
};

export default Button;
```

### Hooks with Types
```typescript
import { useState, Dispatch, SetStateAction } from 'react';

// Hook return type
function useInput(initial: string): [string, (value: string) => void] {
    const [value, setValue] = useState<string>(initial);
    
    const handleChange = (newValue: string) => {
        setValue(newValue);
    };
    
    return [value, handleChange];
}

// Generic types
function useFetch<T>(url: string): {
    data: T | null;
    loading: boolean;
    error: Error | null;
} {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    
    // ...
    
    return { data, loading, error };
}
```

---

## 7. Web Workers

### Background Tasks
```javascript
// worker.js
self.onmessage = (event) => {
    const data = event.data;
    const result = heavyComputation(data);
    self.postMessage(result);
};

function heavyComputation(data) {
    // Expensive task
    return data.map(x => x * 2);
}

// Component.js
function Component() {
    const [result, setResult] = useState(null);
    
    const handleStart = () => {
        const worker = new Worker('worker.js');
        worker.postMessage([1, 2, 3, 4, 5]);
        
        worker.onmessage = (event) => {
            setResult(event.data);
            worker.terminate();
        };
    };
    
    return (
        <div>
            <button onClick={handleStart}>Start heavy task</button>
            {result && <p>Result: {result}</p>}
        </div>
    );
}

// Benefits:
// - Main thread not blocked
// - App stays responsive
// - Smooth 60 FPS
```

---

## 8. Summary & Next Steps

### Learning Path Completed
```
✓ React Fundamentals (Hooks, JSX, State, Props)
✓ Rendering & Performance (Virtual DOM, Memoization, Code Splitting)
✓ State Management (Context, Redux)
✓ Forms & Validation
✓ Routing & Navigation
✓ API Integration
✓ Testing (Jest, React Testing Library)
✓ Component Patterns (Compound, HOC, Render Props)
✓ Accessibility
✓ Security & Interviews
✓ Advanced Topics (Server Components, TypeScript)

Topics covered: 11 comprehensive modules with 100+ code examples
```

### Next Learning Paths
```
Choose based on your interests:

1. FULL-STACK DEVELOPER
   → Learn Node.js/Express or Django
   → Database (PostgreSQL/MongoDB)
   → Docker/DevOps
   → AWS/Vercel deployment

2. FRONTEND SPECIALIST
   → Master CSS (Tailwind, CSS-in-JS)
   → Animation (Framer Motion, React Spring)
   → Design Systems (Storybook)
   → Web Performance (Lighthouse, Web Vitals)

3. WEB DEVELOPER
   → Next.js mastery
   → Database/ORM (Prisma)
   → Authentication (NextAuth)
   → Full deployment pipeline

4. REACT SPECIALIST
   → React Native (Mobile)
   → React Query (Data fetching)
   → Vitest (Testing)
   → Advanced patterns (Atom-based state)
```

### Resources for Continued Learning
```
Official Documentation:
- React: https://react.dev
- Next.js: https://nextjs.org/docs
- TypeScript: https://www.typescriptlang.org/docs

Learning Platforms:
- Scrimba: Interactive courses
- egghead: Short focused lessons
- Frontend Masters: Advanced courses
- Kent C. Dodds: React testing

Practice:
- LeetCode: Algorithm practice
- HackerRank: Coding challenges
- Frontend Mentor: Real-world projects
- Build your own projects

Stay Current:
- Follow React blogs and newsletters
- Attend local meetups
- Contribute to open source
- Build side projects
```

---

## Final Tips for Interview Success

### Before Interview
```
✓ Practice explaining concepts out loud
✓ Code on whiteboard/screen share (tool they provide)
✓ Ask clarifying questions
✓ Think out loud while solving
✓ Test your code mentally
✓ Review this entire course 2-3 times
✓ Build 2-3 projects showcasing your skills
✓ Contribute to open source
✓ Read others' code on GitHub
✓ Practice mock interviews
```

### During Interview
```
✓ Listen carefully to the question
✓ Clarify requirements before coding
✓ Start with simple solution, optimize
✓ Mention trade-offs of approaches
✓ Test edge cases
✓ Explain what you're doing
✓ Ask for feedback
✓ Be honest about not knowing something
✓ Show your problem-solving process
✓ Mention performance/security considerations
```

### Common Interview Red Flags to Avoid
```
✗ Using array index as key in list
✗ Creating functions inside render
✗ Missing dependencies in useEffect
✗ Not handling loading/error states
✗ Hardcoding API endpoints
✗ No input validation
✗ Not testing for accessibility
✗ Memory leaks (no cleanup)
✗ Race conditions (async)
✗ Over-engineering simple solutions
```

---

## Project Ideas to Showcase Skills

### Beginner
```
1. Todo App with local storage
2. Weather app (API integration)
3. Recipe finder (search, filters)
4. Movie database (pagination)
5. Notes app (CRUD operations)
```

### Intermediate
```
1. E-commerce store (cart, checkout)
2. Social media feed (infinite scroll)
3. Chat application (real-time)
4. Project management tool (Kanban)
5. Analytics dashboard (charts)
```

### Advanced
```
1. SaaS application (full-stack)
2. Collaborative editor (real-time)
3. Mobile app (React Native)
4. Browser extension
5. Developer tool/CLI
```

---

## Exercises: Final Challenge

### Exercise 1: Build Todo App
```javascript
// Features:
// 1. Add, delete, edit todos
// 2. Mark as complete
// 3. Filter (all, active, completed)
// 4. Local storage persistence
// 5. Responsive design
// 6. Accessibility
// 7. Unit tests
```

### Exercise 2: Weather App
```javascript
// Features:
// 1. Search cities (API)
// 2. Show current weather
// 3. 7-day forecast
// 4. Location-based weather
// 5. Favorite cities
// 6. Responsive design
// 7. Dark/light theme
```

### Exercise 3: Social Media Clone
```javascript
// Features:
// 1. User authentication
// 2. Create/edit/delete posts
// 3. Like/comment on posts
// 4. User profiles
// 5. Follow/unfollow users
// 6. Real-time notifications
// 7. Fully responsive
// 8. Database integration
// 9. Full test coverage
// 10. Security best practices
```

---

## Congratulations!

You've completed a comprehensive React course covering:

✅ Core Concepts (11 modules)
✅ 100+ Code Examples
✅ Best Practices
✅ Interview Preparation
✅ Advanced Topics
✅ Security & Accessibility

**You're now prepared to:**
- Interview for React positions
- Build production applications
- Optimize performance
- Secure your applications
- Mentor others in React
- Contribute to open source

**Next Steps:**
1. Build 2-3 portfolio projects
2. Contribute to React ecosystem
3. Learn complementary skills (Node, TypeScript)
4. Practice interview problems
5. Network with other developers

**Good Luck! 🚀**
