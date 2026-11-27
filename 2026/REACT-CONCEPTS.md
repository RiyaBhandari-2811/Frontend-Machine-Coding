# React Concepts — the theory interviewers drill

Companion to [README.md](README.md). After the machine-coding build, interviewers probe *how React works*. This is the "sab kuch" theory sheet. Be able to **explain each with an example**, not just define it.

---

## 1. Component lifecycle — the three phases

Every component goes through **Mount → Update → Unmount**. Class components had named methods; **function components use `useEffect`** to hook into each phase.

### Mounting (component created & inserted into DOM)
| Class method | What it did | Hooks equivalent |
|---|---|---|
| `constructor` | init state | `useState` initializer |
| `render` | return JSX | the function body itself |
| `componentDidMount` | run after first paint (fetch, subscriptions, DOM measure) | `useEffect(() => {...}, [])` |

### Updating (re-render due to new props / state / context)
| Class method | What it did | Hooks equivalent |
|---|---|---|
| `render` | re-run | function body re-runs |
| `shouldComponentUpdate` | skip re-render | `React.memo`, `useMemo` |
| `getDerivedStateFromProps` | sync state to props | derive during render instead |
| `componentDidUpdate` | run after update (react to changed prop) | `useEffect(() => {...}, [dep])` |

### Unmounting (removed from DOM)
| Class method | What it did | Hooks equivalent |
|---|---|---|
| `componentWillUnmount` | cleanup (clear timers, unsubscribe, abort) | the **return function** inside `useEffect` |

```jsx
useEffect(() => {
  const id = setInterval(tick, 1000);   // mount / after render (setup)
  return () => clearInterval(id);        // unmount / before next effect (cleanup)
}, []);                                  // [] = run once on mount
```

**Mental model of `useEffect` deps:**
- `[]` → runs once (mount), cleanup on unmount.
- `[a, b]` → runs on mount + whenever `a` or `b` change (cleanup before each re-run).
- *no array* → runs after **every** render (rarely what you want).

> **Common interview trap:** the cleanup function runs **before every re-run of the effect**, not only on unmount. That's how you avoid stale subscriptions/timers.

---

## 2. How a render actually happens (Render vs Commit)

React splits work into two phases:

1. **Render phase** — React calls your component, builds a new **Virtual DOM** tree. *Pure, no side effects, can be paused/restarted (Concurrent).*
2. **Commit phase** — React diffs (reconciles) old vs new tree and applies the **minimal real-DOM changes**. Then `useLayoutEffect` fires (sync, before paint), then browser paints, then `useEffect` fires (async, after paint).

**A re-render does NOT mean the DOM changed** — it means React re-ran the function and diffed. If output is the same, the DOM isn't touched.

---

## 3. What triggers a re-render

A component re-renders when:
1. its **state** changes (`setState` / `useState` setter),
2. its **props** change (because the parent re-rendered),
3. a **context** it consumes changes,
4. its **parent re-renders** (by default children re-render too — unless memoized).

**It does NOT re-render** because a variable changed, or because `localStorage`/a `ref` changed. Only the 4 above.

---

## 4. Reconciliation & the `key` prop

- React compares trees by **element type** and **position**. Same type → update in place; different type → destroy & rebuild (state lost).
- **Lists need stable `key`s** so React matches items across renders. Using array **index as key** breaks on reorder/insert/delete → wrong item state, input values jumping. Use a stable id.
- Changing a component's `key` is a deliberate trick to **force a full remount** (reset its state).

---

## 5. State: rules & gotchas

- **State updates are asynchronous & batched.** `setX(x+1)` thrice in one handler = one increment. Use the **updater form** `setX(p => p+1)` to queue correctly.
- **State is a snapshot.** Within one render, state values are fixed (closures capture them). This causes the **"stale closure"** bug in effects/timers — fix with updater form or correct deps.
- **Never mutate state** — create new objects/arrays (`[...arr]`, `{...obj}`). Mutation skips re-render and breaks `memo`.
- **Derived state:** don't copy props into state; **compute during render** (optionally `useMemo`).
- **Lifting state up:** move shared state to the closest common parent; pass down via props.

---

## 6. Hooks — rules & the important ones

**Rules of Hooks:** only call at the **top level** (never in loops/conditions), only from React functions. Why: React tracks hooks **by call order**.

| Hook | Use for |
|---|---|
| `useState` | local state |
| `useReducer` | complex/related state transitions (prefer over many `useState`) |
| `useEffect` | side effects *after* paint (fetch, subscribe, timers) |
| `useLayoutEffect` | DOM measurement/mutation *before* paint (avoid flicker) |
| `useContext` | read context without prop-drilling |
| `useRef` | mutable value that **doesn't** trigger re-render; DOM node access |
| `useMemo` | cache an expensive **computed value** |
| `useCallback` | cache a **function identity** (so memoized children don't re-render) |
| `useId` | stable unique ids (SSR-safe) |
| `useTransition` / `useDeferredValue` | mark updates non-urgent (concurrent) |
| `useSyncExternalStore` | subscribe to external stores (how Redux/Zustand integrate) |

**Custom hooks** = extract reusable stateful logic (`useDebounce`, `useFetch`, `useOnClickOutside`, `useLocalStorage`, `useInterval`). They share *logic*, not *state*.

---

## 7. Context API (the theme-toggle follow-up)

- Solves **prop-drilling**: `createContext` → `<Provider value={...}>` → `useContext` anywhere below.
- **Every consumer re-renders when the `value` changes** — so:
  - memoize the `value` object (`useMemo`) or it's a new object every render,
  - **split contexts** (e.g. `ThemeValueContext` vs `ThemeSetterContext`) so setters-only consumers don't re-render on value changes,
  - for high-frequency global state, reach for **Zustand/Redux** instead (they use selectors to avoid over-rendering).
- Context is a **dependency-injection / broadcast** tool, *not* a performance tool.

---

## 8. Performance toolbox

- `React.memo(Component)` — skip re-render if props are shallow-equal.
- `useMemo` / `useCallback` — stabilize values/functions passed to memoized children. **Don't sprinkle everywhere** — they have a cost; measure first.
- **Virtualization** for long lists (`@tanstack/virtual`).
- **Code-splitting**: `React.lazy` + `Suspense`, route-based chunks.
- **Keys** correct; avoid inline object/array props to memoized children.
- Measure with **React DevTools Profiler** and **Lighthouse** (LCP/CLS/INP).

---

## 9. Other must-knows

- **Controlled vs uncontrolled** inputs (`value`+`onChange` vs `ref`/`defaultValue`).
- **Error boundaries** (class `componentDidCatch` / `getDerivedStateFromError`) — catch render errors in a subtree.
- **Portals** (`createPortal`) — render outside parent DOM (modals, tooltips).
- **Refs & `forwardRef`** — expose DOM/imperative handle (`useImperativeHandle`).
- **Fragments** (`<>…</>`) — group without extra DOM node.
- **`StrictMode`** double-invokes effects/renders in dev to surface impurity — expected, not a bug.
- **Suspense** — declarative loading boundaries for lazy components & data.
- **Concurrent features** — interruptible rendering, `useTransition`, streaming SSR.

---

## 10. React Server Components vs Client Components (2026)

- **Server Components** (default in Next App Router): render on server, **ship zero JS**, can `await` data directly, no hooks/state/events.
- **Client Components** (`"use client"`): interactive, have state/effects/handlers, hydrate on client.
- **Server Actions**: call server functions from a form/button without writing an API route.
- Know the **boundary rules**: a client component can't import a server component as a child by default (pass it as `children`/props instead).

---

## How to practice this

For each project in [README.md](README.md), after building, answer out loud:
1. **What mounts, updates, unmounts here — and what cleanup is needed?**
2. **What triggers a re-render, and which re-renders are wasteful?**
3. **Where does state live, and could Context / reducer / external store be better?**
4. **How would this behave under SSR vs CSR?**

If you can answer those four for every build, you'll pass the follow-up round. 💪
