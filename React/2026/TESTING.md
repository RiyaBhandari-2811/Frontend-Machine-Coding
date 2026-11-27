# Frontend Testing — the round you can't skip

Companion to [README.md](README.md), [REACT-CONCEPTS.md](REACT-CONCEPTS.md), [BUILD-TOOLING.md](BUILD-TOOLING.md). Tekion and Ather both call out **unit tests / TDD-BDD** explicitly, and every machine-coding round scores you higher if you write (or can describe) tests. This is the "how I'd test it" sheet.

> In a timed round you rarely finish full tests. What wins: **say what you'd test and why**, and write 1–2 real tests for the core logic. This file makes that fast.

---

## 1. The testing pyramid (say this out loud)

- **Unit** (many, fast) — pure functions, hooks, single components in isolation.
- **Integration** (some) — a few components working together, with mocked network.
- **End-to-end** (few, slow) — real browser, full user flow (Playwright/Cypress).

Bottom-heavy: lots of unit, fewer integration, a handful of e2e.

---

## 2. Tools

| Tool | Role |
|---|---|
| **Vitest / Jest** | Test runner + assertions (Vitest for Vite, Jest for Webpack/CRA) |
| **React Testing Library (RTL)** | Render components, query like a user, fire events |
| **@testing-library/user-event** | Realistic user interactions (preferred over `fireEvent`) |
| **MSW (Mock Service Worker)** | Intercept network at the HTTP layer — mock APIs without stubbing `fetch` |
| **Playwright / Cypress** | End-to-end in a real browser |

---

## 3. RTL golden rule

**Test behavior the user sees, not implementation details.** Query by role/text/label, not by class or component internals. If you refactor internals without changing behavior, tests should still pass.

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('increments the counter', async () => {
  render(<Counter />);
  const btn = screen.getByRole('button', { name: /increment/i });
  await userEvent.click(btn);
  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});
```

**Query priority (accessibility-first):** `getByRole` > `getByLabelText` > `getByText` > `getByTestId` (last resort). This doubles as an a11y check — if you can't query by role, your markup probably isn't accessible.

**`getBy` vs `queryBy` vs `findBy`:**
- `getBy*` — throws if not found (assert it exists).
- `queryBy*` — returns null (assert it does **not** exist).
- `findBy*` — async, waits for it to appear (use after an async action).

---

## 4. The things interviewers expect you to test

For a typical machine-coding component (e.g. Autocomplete, Form, Data table):

- **Renders** the initial state correctly (empty / loading / data).
- **User interaction** does the right thing (type, click, select, submit).
- **Async**: loading → success and loading → error paths (mock the fetch with MSW).
- **Edge cases**: empty results, validation errors, disabled states.
- **Accessibility**: focus moves correctly, ARIA states (`aria-expanded`, `aria-invalid`).
- **Debounce / race conditions**: a stale request doesn't overwrite a newer result.

> In the round, literally say: *"I'd test: initial render, the happy-path interaction, the error state, and the empty state. Here's the core one..."* then write that one.

---

## 5. Testing hooks & async

```tsx
import { renderHook, waitFor } from '@testing-library/react';

test('useDebounce delays the value', async () => {
  const { result, rerender } = renderHook(({ v }) => useDebounce(v, 300), {
    initialProps: { v: 'a' },
  });
  rerender({ v: 'ab' });
  expect(result.current).toBe('a');            // not updated yet
  await waitFor(() => expect(result.current).toBe('ab'));
});
```

Mock timers (`vi.useFakeTimers()` / `jest.useFakeTimers()`) for debounce/throttle without real waits.

---

## 6. Mocking network with MSW

```ts
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  http.get('/api/search', () => HttpResponse.json([{ id: 1, name: 'Riya' }]))
);
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

MSW mocks at the network boundary, so your component uses real `fetch`/axios — closer to production than stubbing the client.

---

## 7. TDD & BDD (Ather asks for this)

- **TDD = red → green → refactor:** write a failing test for the smallest behavior, make it pass with minimal code, then clean up. Repeat. Good for pure logic (a calculator engine, a reducer, a formatter).
- **BDD = describe behavior in Given-When-Then**, often in plain language (Gherkin/Cucumber). In React, RTL already reads BDD-style:
  ```
  Given a rendered form
  When the user submits it empty
  Then an error message appears
  ```

**TDD-friendly machine-coding targets:** calculator engine, cart totals reducer, validation function, pagination math. Write the test first, then implement.

---

## 8. End-to-end (Playwright)

```ts
import { test, expect } from '@playwright/test';

test('user can search and select', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('textbox', { name: /search/i }).fill('react');
  await page.getByRole('option', { name: /react router/i }).click();
  await expect(page.getByText(/selected: react router/i)).toBeVisible();
});
```

Use e2e sparingly for critical flows (login, checkout, search-to-result). They're slow but catch integration bugs units miss.

---

## 9. Quick interview answers

- **"How would you test this component?"**
  > Unit-test the core logic and user interactions with React Testing Library, querying by role so it doubles as an accessibility check. Mock the network with MSW for loading/error paths, and add one Playwright e2e for the critical flow.
- **"Unit vs integration vs e2e?"**
  > Unit = isolated logic/components, fast and many; integration = a few components with mocked network; e2e = real browser, full flow, few and slow.
- **"What do you test first under time pressure?"**
  > The core behavior the prompt asks for, plus the error/empty states — those are where bugs and interviewer follow-ups live.

---

## How to practice

For 3–4 builds in [README.md](README.md) (Autocomplete, Form with validation, Data table), add:
1. One RTL test for the happy-path interaction.
2. One MSW-mocked error-state test.
3. Say the full test list out loud even if you only write two.

Being able to *talk* tests fluently is often enough to pass the testing bar in a machine-coding round. ✅
