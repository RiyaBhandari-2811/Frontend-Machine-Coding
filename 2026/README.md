# Frontend Machine Coding — 2026 Roadmap

Prep track for the **Full-Stack interview loop**, starting with the frontend machine-coding round.
Goes from basics → advanced, and deliberately covers the four things interviewers probe in 2026:

1. **Component craft** — clean, accessible, reusable UI built fast under time pressure.
2. **State management** — local → lifted → global → server state, and knowing which to reach for.
3. **Rendering strategies** — CSR / SSR / SSG / ISR / streaming / React Server Components.
4. **AI integration** — streaming LLM responses, chat UIs, tool-calling UIs, RAG-style search.

> The `../old/` folder holds the earlier vanilla-JS practice set (BMI calc, coin toss, etc.). Reuse it only as a warm-up.

---

## ▶️ Where to start

You're React-strong already, so skip the Tier 0 warm-ups:

1. **Tier 1** — Autocomplete → Data table → Form with validation (the staples), reading **[REACT-CONCEPTS.md](REACT-CONCEPTS.md)** alongside.
2. Write **1 test per build** from **[TESTING.md](TESTING.md)**.
3. Then **Tier 3** (state management) → **Tier 5** (AI UIs).
4. Revise infra from **[BUILD-TOOLING.md](BUILD-TOOLING.md)** (Webpack, Module Federation) before senior/full-stack rounds.

---

## How to use this list

- **Stack:** Default to **React + TypeScript + Vite** for component rounds; **Next.js (App Router)** for anything involving SSR/RSC/AI/data. A few drills are intentionally **vanilla JS** to keep fundamentals sharp.
- **Time-box each build** like the real round: Easy ~30 min, Medium ~45–60 min, Hard 60–90 min.
- For each project, after building, write 3 lines: *what state lives where*, *what you'd test*, *how it fails at scale*.
- Checkboxes below — tick as you go.

---

## Tier 0 — Warm-up (vanilla JS, DOM, events) — ~30 min each

Rebuild from memory, no framework. Focus: DOM APIs, event delegation, closures.

- [ ] **Counter + stopwatch** (start/pause/reset, `setInterval` cleanup)
- [ ] **Accordion / FAQ** (one-open vs multi-open, ARIA)
- [ ] **Tabs** (keyboard arrow navigation, `role="tablist"`)
- [ ] **Star rating** (hover vs selected, half-stars)
- [ ] **Toast / notification stack** (auto-dismiss, queue, pause-on-hover)
- [ ] **Modal / dialog** (focus trap, ESC to close, scroll lock, portal)
- [ ] **Accessible dropdown menu** (click-outside, keyboard, `aria-expanded`)

**Concepts:** event delegation, debounce/throttle (write both by hand), `AbortController`, focus management, a11y basics.

---

## Tier 0.5 — Classic mini-apps — ~30 min each

Small, complete apps at the same level as your `../old/` set. Great for rebuilding confidence and warming up before a round. Do these in React once you've done the vanilla warm-ups (theme toggle is a frequent real interview opener).

> **How to read the follow-ups (↳):** build the base version first, then an interviewer escalates. Each ↳ is a realistic next ask — practice saying *and then* doing them. This is where rounds are actually won or lost.

- [ ] **Theme / dark-mode toggle** — `localStorage` persist, `prefers-color-scheme` system default, CSS variables, no flash-on-load (FOUC)
  - ↳ Lift state into a **`ThemeContext` + `useContext`** so any component can read/toggle without prop-drilling
  - ↳ Wrap it in a **custom hook `useTheme()`** that throws if used outside the provider
  - ↳ Support **3+ themes** (light/dark/system/custom), not just a boolean — move to `useReducer`
  - ↳ **Avoid re-rendering the whole tree** on toggle — split context (value vs setter), or memoize
  - ↳ **SSR/Next.js:** prevent the flash — set the class in an inline script before hydration
  - ↳ Sync theme **across browser tabs** (`storage` event)
- [ ] **Calculator** — operator precedence or simple chaining, keyboard input, decimal/clear
  - ↳ Add **history** of calculations (store in state → then `localStorage`)
  - ↳ Handle **edge cases**: divide-by-zero, floating-point (0.1+0.2), long numbers
  - ↳ Refactor engine logic into a **pure function** and unit-test it
- [ ] **Weather app** — fetch by city, loading/error states, debounce input, unit toggle (°C/°F)
  - ↳ **Cancel stale requests** (`AbortController`) when user types fast
  - ↳ **Cache** responses so re-searching a city is instant (stale-while-revalidate)
  - ↳ Extract a reusable **`useFetch` / `useDebounce`** hook; then swap to **TanStack Query**
  - ↳ Geolocation default + **recent searches** persisted
- [ ] **Pomodoro timer** — work/break cycles, start/pause/reset, notification on finish
  - ↳ Keep accurate time when tab is **backgrounded** (don't trust `setInterval` drift — use timestamps)
  - ↳ Persist running session so a **refresh doesn't lose** progress
- [ ] **Stopwatch + laps** — `performance.now()`, lap list, formatting
  - ↳ Why `setInterval` drifts and how timestamp-based timing fixes it
  - ↳ Extract a **`useInterval`** custom hook (the classic Dan Abramov pattern)
- [ ] **Currency / unit converter** — live rate fetch (or mock), two-way binding
  - ↳ Two inputs that **update each other** (controlled, avoid infinite loops)
  - ↳ Debounce + cache rates; handle API failure gracefully
- [ ] **Markdown previewer** — textarea → rendered HTML (sanitize!), split pane
  - ↳ **Sanitize** to prevent XSS (why `dangerouslySetInnerHTML` is dangerous)
  - ↳ Debounce rendering; synced scroll between panes
- [ ] **Color palette / picker generator** — copy-to-clipboard, random, contrast check
  - ↳ WCAG **contrast ratio** calc; lock colors; export as CSS variables
- [ ] **QR code generator** — input → QR, download as image
  - ↳ Debounced live preview; download via canvas → `toBlob`
- [ ] **Digital clock + world clocks** — timezone handling, `setInterval` cleanup
  - ↳ Multiple zones with `Intl.DateTimeFormat`; cleanup on unmount (lifecycle!)
- [ ] **Quiz app** — question flow, score, timer per question, review answers
  - ↳ Model as a **state machine** (idle → question → feedback → result)
  - ↳ Fetch questions from API; shuffle; persist progress
- [ ] **Typing speed test** — WPM/accuracy, live highlight of typed chars
  - ↳ Performance with long text (avoid re-rendering every char)
- [ ] **Expense tracker / budget** — add/edit/delete, totals, `localStorage`, category filter
  - ↳ Lift to **Context**, then **`useReducer`**, then compare with **Zustand**
  - ↳ Derived totals via `useMemo`; charts (ties into the dataviz skill)
- [ ] **Notes app** — CRUD, search, `localStorage`, (bonus: tags)
  - ↳ Debounced search; optimistic add/delete; then move storage to **IndexedDB**
- [ ] **Image search gallery** — Unsplash/Pexels API, grid, lazy-load, infinite scroll
  - ↳ `IntersectionObserver` infinite scroll; cancel stale requests; skeletons

**Concepts:** `localStorage` persistence, `prefers-color-scheme`, CSS variables for theming, **Context API + custom hooks**, `useReducer`, fetch + loading/error UI, timers & cleanup (lifecycle), clipboard API, input sanitization/XSS.

---

## Tier 1 — Core components (React) — ~45 min each

The classic machine-coding staples. Expect at least one of these in a real round — and expect the follow-ups.

- [ ] **Autocomplete / Typeahead** — debounced fetch, keyboard nav, highlight match, cache results, cancel stale requests (`AbortController`)
  - ↳ Handle the **race condition** (slow earlier request resolving after a newer one)
  - ↳ Cache + LRU eviction; show recent/empty states; full **keyboard a11y** (`aria-activedescendant`)
  - ↳ Make it **generic/reusable** (render-prop or headless) for any data source
- [ ] **Multi-select combobox w/ chips** — controlled value, remove chips, filter, create-new
  - ↳ Controlled **and** uncontrolled modes; async options; virtualize long option lists
- [ ] **Data table** — sort, filter, column resize, row selection, sticky header
  - ↳ **Server-side** sort/filter/pagination; then **virtualize** 100k rows
  - ↳ Memoize rows to stop full re-render on one cell change (perf + `React.memo`)
- [ ] **Pagination** (offset) and **Infinite scroll** (`IntersectionObserver`)
  - ↳ Cursor-based pagination; cache pages; scroll-restoration on back
- [ ] **Carousel / image slider** — autoplay, swipe, lazy-load, dots
  - ↳ Pause autoplay on hover/focus/tab-blur; a11y (`aria-live`); infinite loop
- [ ] **Nested comments / threads** — recursive render, collapse, reply
  - ↳ Normalize the tree in state; lazy-load deep replies; optimistic post
- [ ] **File-tree / nested checkboxes** — indeterminate state propagation up & down
  - ↳ Performance on deep trees; controlled selection as a derived computation
- [ ] **Form with validation** — field-level + submit-level, async validation, error summary
  - ↳ Build it with **`useReducer`**, then **React Hook Form**; schema validation (Zod)
  - ↳ Controlled vs uncontrolled tradeoffs; accessibility of errors
- [ ] **Drag-and-drop list** (reorder) — pointer events or `dnd-kit`
  - ↳ Keyboard-accessible DnD; persist order; drag between lists (→ Kanban in Tier 2)

**Concepts:** controlled vs uncontrolled, lifting state, `useRef`, derived state, custom hooks (`useDebounce`, `useFetch`, `useOnClickOutside`), memoization (`useMemo`/`useCallback`/`React.memo`, when NOT to), race conditions, virtualization, headless/reusable component design.

> 📘 For the **theory interviewers drill alongside these** — component lifecycle, how hooks map to each phase, reconciliation, re-render rules — see **[REACT-CONCEPTS.md](REACT-CONCEPTS.md)**.

---

## Tier 2 — Async, data & resilience — ~60 min each

- [ ] **Paginated search w/ caching** — stale-while-revalidate by hand, then redo with **TanStack Query**
- [ ] **Polling + optimistic updates** — like/upvote with rollback on failure
- [ ] **Kanban board** — drag between columns, optimistic move, persist
- [ ] **Chat UI (no AI yet)** — message list virtualization, "is typing", scroll-to-bottom logic
- [ ] **Virtualized list (10k+ rows)** — windowing by hand, then `@tanstack/virtual`
- [ ] **Undo/redo** — command stack / history reducer
- [ ] **Multi-step wizard** — per-step validation, persisted draft, back/forward

**Concepts:** server state vs client state, request dedup, retry/backoff, race conditions, suspense boundaries, error boundaries, virtualization.

---

## Tier 3 — State management (go deep) — build same app 3 ways

Build **one non-trivial app** (a **shopping cart** or **task board**) three times to *feel* the tradeoffs:

- [ ] **`useReducer` + Context** — understand re-render cost, context splitting
- [ ] **Zustand** — selectors, slices, middleware (persist, devtools)
- [ ] **Redux Toolkit** — slices, RTK Query, normalized entities, `createEntityAdapter`

Then one round of each:

- [ ] **Jotai or Recoil** — atom-based / bottom-up state
- [ ] **XState** — model a checkout or media-player as a state machine
- [ ] **URL as state** — filters/tabs synced to query params (shareable, back-button safe)

**Concepts:** normalization, selectors & memoized derivations, re-render minimization, when global is overkill, server state ≠ UI state, finite state machines.

---

## Tier 4 — Rendering strategies (Next.js App Router) — the SSR/CSR round

Build the **same product-listing + detail page** under each strategy and articulate the tradeoffs.

- [ ] **CSR** — plain React SPA; understand hydration, white-screen, SEO cost
- [ ] **SSR** — per-request render; `fetch` on server, cookies/auth, TTFB vs TTI
- [ ] **SSG** — `generateStaticParams`, build-time data
- [ ] **ISR** — `revalidate`, on-demand revalidation (`revalidatePath`/`revalidateTag`)
- [ ] **Streaming SSR + Suspense** — `loading.tsx`, progressive render, skeletons
- [ ] **React Server Components + Server Actions** — zero-JS components, forms without API routes, `use client` boundary
- [ ] **Islands / partial hydration** — (compare mentally with Astro)

**Concepts:** hydration & its cost, waterfalls vs parallel fetch, caching layers (request/data/full-route), `use client` vs server boundary, edge vs node runtime, SEO & Core Web Vitals (LCP/CLS/INP).

---

## Tier 5 — AI-infused builds (the 2026 differentiator) — ~60–90 min

Now that AI is table stakes, interviewers increasingly add an LLM twist. Use the **Anthropic / OpenAI** SDK with a **Next.js route handler / Server Action**; **stream** tokens to the client.

- [ ] **Streaming chat UI** — SSE / `ReadableStream`, token-by-token render, stop/regenerate, abort mid-stream
- [ ] **AI autocomplete / "ghost text"** — inline completion like Copilot, debounce, accept-on-Tab
- [ ] **RAG-style doc search** — upload text → chunk → embed → semantic search → cite sources (can mock embeddings)
- [ ] **Tool-calling / function-calling UI** — render tool invocations + results inline (e.g. "search", "calculator")
- [ ] **Structured output form-filler** — LLM returns JSON schema → populate a form, show validation
- [ ] **AI summarizer with streaming + markdown render** — handle partial markdown safely
- [ ] **Prompt playground** — system/user prompt editor, model picker, token/latency display
- [ ] **Agent UI with reasoning trace** — show the agent's steps (thought → tool call → observation), collapsible and streaming as it runs (NetApp-style agent interfaces)
- [ ] **RAG answer with source citations** — render the answer plus the retrieved sources it's grounded in, with relevance score and click-to-expand
- [ ] **Eval dashboard** — compare outputs across prompts/models, show LLM-as-judge scores, latency, and token/cost per run

**Concepts:** streaming (SSE vs fetch streams), backpressure & abort, rendering partial/markdown safely, latency UX (optimistic skeletons), keeping **API keys server-side only**, rate-limit & error handling, cost/token awareness, surfacing agent reasoning & retrieval sources in the UI.

> 🤖 The backend for these (agents, RAG, LLM cost optimization, MLOps) is in **[../../backend-machine-coding-prep/AI-ENGINEERING.md](../../backend-machine-coding-prep/AI-ENGINEERING.md)** — build the API there, the UI here.

> Keep the secret on the server (route handler / Server Action). Never ship a provider key to the browser.

---

## Tier 6 — Advanced / system-design-flavored — 90 min

- [ ] **Design a component library primitive set** — Button/Input/Select/Modal with variants, theming (CSS vars), a11y, headless pattern
- [ ] **Spreadsheet / grid** — editable cells, formulas, keyboard nav, large grid perf
- [ ] **Rich text editor basics** — `contenteditable` or Lexical/TipTap, toolbar, serialize
- [ ] **Image gallery with lazy-load + blur-up + lightbox**
- [ ] **Real-time collaborative cursor / presence** — WebSocket, optimistic + reconcile
- [ ] **Offline-first todo** — Service Worker, IndexedDB, sync-on-reconnect
- [ ] **i18n + theming + RTL** app shell
- [ ] **Cross-platform (React Native) basics** — shared components, pixel-perfect UI, native APIs (Tekion-style mobile roles; you have this from DCT)
- [ ] **Micro-frontend shell** (concept) — module federation overview

**Concepts:** headless components, design tokens, WebSockets, Service Workers/PWA, IndexedDB, performance budgets, bundle splitting, accessibility at scale.

> 🏗️ For the **build-tooling theory interviewers drill** — Webpack (loaders/plugins/code-splitting/tree-shaking), Vite vs Webpack, **Module Federation & micro-frontends**, and monorepos/Nx — see **[BUILD-TOOLING.md](BUILD-TOOLING.md)**.

---

## Cross-cutting checklist (hit these in every build)

- **Accessibility:** semantic HTML, keyboard nav, focus management, ARIA only when needed, color contrast.
- **Performance:** avoid unnecessary re-renders, memo wisely, lazy-load, virtualize long lists, measure (React DevTools Profiler, Lighthouse).
- **Testing:** React Testing Library (user-centric), a couple of unit tests for logic, think about what you'd test even if you don't write it. → full patterns (RTL/Vitest/MSW/Playwright, TDD/BDD) in **[TESTING.md](TESTING.md)**.
- **TypeScript:** props typed, discriminated unions for variants, no `any`.
- **Error & loading states:** every async path has loading / empty / error UI.
- **Clean code:** small components, custom hooks for logic, clear naming, no dead code.

---

## Suggested 6-week cadence

| Week | Focus |
|------|-------|
| 1 | Tier 0 + Tier 0.5 (warm-ups, classic mini-apps) + start Tier 1 |
| 2 | Tier 1 finish + Tier 2 (async, data) |
| 3 | Tier 3 (state management, all variants) |
| 4 | Tier 4 (CSR/SSR/SSG/ISR/RSC) |
| 5 | Tier 5 (AI builds) |
| 6 | Tier 6 + mock interviews (timed, full) |

---

## Quick reference — what each round really tests

- **Component round:** Can you build clean, accessible, reusable UI fast?
- **State round:** Do you pick the right tool and avoid re-render / prop-drilling traps?
- **Rendering round:** Do you understand CSR vs SSR vs SSG vs ISR vs RSC tradeoffs (SEO, TTFB, hydration)?
- **AI round:** Can you stream, handle partial data, keep keys safe, and design good latency UX?
- **System-design round:** Can you reason about scale, perf budgets, real-time, and offline?

Good luck. Build, time yourself, and reflect after each one. 🚀
