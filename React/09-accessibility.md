# React Accessibility & Best Practices

## Table of Contents
1. Semantic HTML
2. ARIA Attributes
3. Keyboard Navigation
4. Screen Readers
5. Color & Contrast
6. Focus Management
7. Common Patterns
8. Testing Accessibility

---

## 1. Semantic HTML

### Semantic Elements
```javascript
// ✗ WRONG - Using divs for everything
function Header() {
    return (
        <div className="header">
            <div className="logo">Logo</div>
            <div className="nav">
                <div className="nav-item">Home</div>
                <div className="nav-item">About</div>
            </div>
        </div>
    );
}

// ✓ CORRECT - Using semantic HTML
function Header() {
    return (
        <header>
            <img src="logo.png" alt="Company Logo" />
            <nav>
                <a href="/">Home</a>
                <a href="/about">About</a>
            </nav>
        </header>
    );
}

// Important semantic elements:
// <header> - Page header
// <nav> - Navigation
// <main> - Main content
// <article> - Article content
// <section> - Content section
// <aside> - Sidebar/related content
// <footer> - Page footer
// <figure> - Image with caption
// <figcaption> - Caption for figure
// <button> - Clickable button
// <label> - Form label
```

### Form Semantics
```javascript
// ✗ WRONG - No semantic connection
function LoginForm() {
    return (
        <div>
            <div>Email:</div>
            <input type="email" />
            <div>Password:</div>
            <input type="password" />
            <div onClick={handleSubmit}>Login</div>
        </div>
    );
}

// ✓ CORRECT - Proper form semantics
function LoginForm() {
    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="email">Email:</label>
                <input id="email" type="email" required />
            </div>
            <div>
                <label htmlFor="password">Password:</label>
                <input id="password" type="password" required />
            </div>
            <button type="submit">Login</button>
        </form>
    );
}

// Benefits:
// 1. Labels associated with inputs
// 2. Screen readers announce properly
// 3. Mobile browsers show correct keyboard
// 4. Better form validation
```

---

## 2. ARIA Attributes

### ARIA Roles, States, Properties
```javascript
// Role - What is this element?
<div role="button">Click me</div>
<div role="navigation">Navigation</div>
<div role="alert">Alert message</div>

// State - Current state?
<button aria-pressed={isPressed}>Toggle</button>
<div aria-expanded={isOpen}>Content</div>
<div aria-hidden="true">Hidden from screen readers</div>

// Property - Additional info?
<input aria-label="Email address" />
<input aria-describedby="email-help" />
<div id="email-help">We'll never share your email</div>

// Live regions - Content changes?
<div aria-live="polite" aria-atomic="true">
    {message}
</div>
```

### ARIA Example: Modal
```javascript
// Accessible modal
function Modal({ isOpen, onClose, children }) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);
    
    if (!isOpen) return null;
    
    return (
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
        >
            <div>
                <h2 id="modal-title">Modal Title</h2>
                <p id="modal-description">Modal description</p>
                {children}
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
}
```

### ARIA Buttons
```javascript
// ✗ WRONG - Div that looks like button
<div onClick={handleClick} className="button">
    Delete
</div>

// ✓ CORRECT - Proper button
<button onClick={handleClick}>Delete</button>

// If must use div:
<div
    role="button"
    tabIndex={0}
    onClick={handleClick}
    onKeyPress={e => e.key === 'Enter' && handleClick()}
    aria-label="Delete item"
>
    Delete
</div>

// But just use button!
```

---

## 3. Keyboard Navigation

### Tab Order
```javascript
// ✗ WRONG - Elements not in natural order
function Form() {
    return (
        <form>
            <input />
            <input tabIndex={5} />
            <input tabIndex={2} />
            <button tabIndex={-1}>Submit</button>  {/* Unfocusable */}
        </form>
    );
}

// ✓ CORRECT - Natural tab order
function Form() {
    return (
        <form>
            <input />
            <input />
            <input />
            <button>Submit</button>
        </form>
    );
}

// TabIndex:
// -1 = Not in tab order (but focusable via script)
// 0 = Natural tab order
// 1+ = Explicit order (avoid if possible)
```

### Keyboard Event Handling
```javascript
// Handle keyboard events
function AccessibleDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const items = ['Option 1', 'Option 2', 'Option 3'];
    
    const handleKeyDown = (e) => {
        switch(e.key) {
            case 'Enter':
            case ' ':
                setIsOpen(!isOpen);
                e.preventDefault();
                break;
            case 'ArrowDown':
                if (isOpen) {
                    setSelectedIndex(i => Math.min(i + 1, items.length - 1));
                } else {
                    setIsOpen(true);
                }
                e.preventDefault();
                break;
            case 'ArrowUp':
                if (isOpen) {
                    setSelectedIndex(i => Math.max(i - 1, -1));
                }
                e.preventDefault();
                break;
            case 'Escape':
                setIsOpen(false);
                e.preventDefault();
                break;
            default:
                break;
        }
    };
    
    return (
        <div>
            <button onClick={() => setIsOpen(!isOpen)} onKeyDown={handleKeyDown}>
                Options
            </button>
            {isOpen && (
                <ul>
                    {items.map((item, i) => (
                        <li
                            key={item}
                            className={selectedIndex === i ? 'selected' : ''}
                        >
                            {item}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
```

---

## 4. Screen Readers

### Screen Reader Optimization
```javascript
// ✗ WRONG - Screen reader can't understand
function Dashboard() {
    return (
        <div>
            <div>📊 Q1 Revenue</div>
            <div>$1.2M</div>
            <div>↑ 15%</div>
        </div>
    );
}

// ✓ CORRECT - Meaningful content
function Dashboard() {
    return (
        <section aria-labelledby="revenue-heading">
            <h2 id="revenue-heading">Q1 Revenue</h2>
            <dl>
                <dt>Revenue:</dt>
                <dd>$1.2 Million</dd>
                <dt>Growth:</dt>
                <dd>15% increase</dd>
            </dl>
        </section>
    );
}

// Screen reader announces:
// "Q1 Revenue, heading, level 2"
// "Revenue: 1.2 Million"
// "Growth: 15% increase"
```

### Alt Text
```javascript
// ✗ WRONG
<img src="chart.png" />
<img src="logo.png" alt="logo" />

// ✓ CORRECT
<img src="chart.png" alt="Sales chart showing 50% growth in Q1" />
<img src="logo.png" alt="Company Logo" />

// Decorative images
<img src="border.png" alt="" aria-hidden="true" />

// Images with text
<figure>
    <img src="user.png" alt="User avatar" />
    <figcaption>John Doe</figcaption>
</figure>
```

---

## 5. Color & Contrast

### Contrast Ratios
```javascript
// WCAG AA requires:
// 4.5:1 for normal text
// 3:1 for large text (18pt+)

// WCAG AAA requires:
// 7:1 for normal text
// 4.5:1 for large text

// ✗ POOR CONTRAST
<p style={{ color: '#888', background: '#fff' }}>Text</p>  {/* ~3:1 */}

// ✓ GOOD CONTRAST
<p style={{ color: '#000', background: '#fff' }}>Text</p>  {/* ~21:1 */}

// Check contrast:
// Use WebAIM Contrast Checker
// Use Lighthouse audit
// Browser DevTools accessibility panel
```

### Color Alone
```javascript
// ✗ WRONG - Using color only to convey info
<div>
    <span style={{ color: 'green' }}>Required field</span>
    <span style={{ color: 'red' }}>Error field</span>
</div>

// ✓ CORRECT - Use color + other indicators
<div>
    <span style={{ color: 'green' }}>✓ Required field</span>
    <span style={{ color: 'red' }}>✗ Error field</span>
</div>

// Better:
<div>
    <label>Name <span aria-label="required">*</span></label>
    <input required />
</div>

<div role="alert" className="error">
    Email is invalid
</div>
```

---

## 6. Focus Management

### Focus Indicators
```javascript
// ✗ WRONG - Removing focus outline
button {
    outline: none;  /* BAD! */
}

// ✓ CORRECT - Custom focus indicator
button {
    outline: 2px solid #4A90E2;
    outline-offset: 2px;
}

button:focus-visible {
    outline: 2px solid #4A90E2;
}

// Focus visible (only keyboard focus)
button:focus-visible {
    box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.5);
}
```

### Focus Trap (Modal)
```javascript
function Modal({ isOpen, onClose, children }) {
    const containerRef = useRef(null);
    
    useEffect(() => {
        if (!isOpen) return;
        
        const handleKeyDown = (e) => {
            if (e.key !== 'Tab') return;
            
            const focusableElements = containerRef.current.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.shiftKey && document.activeElement === firstElement) {
                lastElement.focus();
                e.preventDefault();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
                firstElement.focus();
                e.preventDefault();
            }
        };
        
        document.addEventListener('keydown', handleKeyDown);
        firstElement?.focus();
        
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);
    
    if (!isOpen) return null;
    
    return (
        <div ref={containerRef} role="dialog">
            {children}
        </div>
    );
}
```

---

## 7. Common Patterns

### Accessible Navigation
```javascript
function Navigation() {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
        <nav>
            <button
                aria-label="Toggle navigation menu"
                aria-expanded={isOpen}
                onClick={() => setIsOpen(!isOpen)}
            >
                Menu
            </button>
            
            <ul style={{ display: isOpen ? 'block' : 'none' }}>
                <li><a href="/">Home</a></li>
                <li><a href="/about">About</a></li>
                <li><a href="/contact">Contact</a></li>
            </ul>
        </nav>
    );
}
```

### Accessible Form Group
```javascript
function FormGroup({ label, error, children, required }) {
    const id = useId();
    
    return (
        <div>
            <label htmlFor={id}>
                {label}
                {required && <span aria-label="required">*</span>}
            </label>
            {children}
            {error && (
                <span role="alert" id={`${id}-error`} className="error">
                    {error}
                </span>
            )}
        </div>
    );
}

// Usage
<FormGroup label="Email" required error={emailError}>
    <input
        id="email"
        type="email"
        aria-describedby="email-error"
    />
</FormGroup>
```

---

## 8. Testing Accessibility

### Automated Testing
```javascript
// jest-axe
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('No accessibility violations', async () => {
    const { container } = render(<Component />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
});

// Setup:
// npm install --save-dev jest-axe
```

### Manual Testing Checklist
```
✓ Keyboard navigation (Tab, Arrow keys, Enter)
✓ Screen reader (NVDA, JAWS, VoiceOver)
✓ Color contrast (Use WebAIM checker)
✓ Form labels (All inputs have labels)
✓ Alt text (All images have alt text)
✓ Focus indicators (Visible outline)
✓ Focus trap (Modal contains focus)
✓ Error messages (Use role="alert")
✓ ARIA roles (Appropriate roles)
✓ Semantic HTML (Use proper elements)
```

---

## Exercises

### Exercise 1: Accessible Form
```javascript
// Create form with:
// - Proper labels
// - Error messages with role="alert"
// - Required indicator

function AccessibleForm() {
    // Your code
}
```

**Solution:**
```javascript
function AccessibleForm() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!email.includes('@')) {
            setError('Invalid email');
        }
    };
    
    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="email">
                    Email <span aria-label="required">*</span>
                </label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                {error && <span role="alert">{error}</span>}
            </div>
            <button type="submit">Submit</button>
        </form>
    );
}
```

### Exercise 2: Keyboard Navigation
```javascript
// Create dropdown with keyboard support
// Arrow keys, Enter, Escape

function AccessibleDropdown() {
    // Your code
}
```

**Solution:**
```javascript
function AccessibleDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const items = ['Option 1', 'Option 2'];
    
    const handleKeyDown = (e) => {
        switch(e.key) {
            case 'Enter':
                setIsOpen(!isOpen);
                e.preventDefault();
                break;
            case 'ArrowDown':
                setSelectedIndex(i => Math.min(i + 1, items.length - 1));
                e.preventDefault();
                break;
            case 'Escape':
                setIsOpen(false);
                e.preventDefault();
                break;
            default:
                break;
        }
    };
    
    return (
        <button onKeyDown={handleKeyDown} aria-expanded={isOpen}>
            Menu
        </button>
    );
}
```

### Exercise 3: Semantic HTML
```javascript
// Convert div-based layout to semantic HTML
// Use proper header, nav, main, footer

function Layout() {
    // Your code
}
```

**Solution:**
```javascript
function Layout() {
    return (
        <>
            <header>
                <img src="logo.png" alt="Logo" />
                <nav>
                    <a href="/">Home</a>
                    <a href="/about">About</a>
                </nav>
            </header>
            <main>
                <article>
                    <h1>Article Title</h1>
                    <p>Content</p>
                </article>
            </main>
            <footer>
                <p>&copy; 2024</p>
            </footer>
        </>
    );
}
```

---

## Interview Questions

### Theoretical Questions

**Q1: What is semantic HTML?**
A: HTML that clearly describes its content (button, nav, article).

**Q2: What is ARIA?**
A: Accessible Rich Internet Applications - attributes for accessibility.

**Q3: What is focus management?**
A: Moving keyboard focus to appropriate element.

**Q4: What is alt text?**
A: Text describing image for screen readers.

**Q5: What is WCAG?**
A: Web Content Accessibility Guidelines - accessibility standards.

---

## Code-Based Interview Questions

**Q1: What is wrong?**
```javascript
<img src="chart.png" />
// Should have?
```
A: Alt attribute with description

**Q2: Predict:**
```javascript
<div onClick={handleClick} className="button">
    Click
</div>
// Is this accessible?
```
A: No, should use button element

**Q3: What is output?**
```javascript
button { outline: none; }
// Is this good for accessibility?
```
A: No, removes focus indicator

**Q4: Spot the issue:**
```javascript
<input />
// Missing accessibility?
```
A: Missing label (should have label with htmlFor)

**Q5: What is correct?**
```javascript
{error && <div>{error}</div>}
// Should add?
```
A: role="alert" for screen reader notification

---

## Follow-up Questions & Confusing Concepts

**Q: Does semantic HTML matter if I use ARIA?**
A: Yes, semantic HTML is foundation.

**Q: Which ARIA role for button?**
A: Use button element, only if needed use role="button".

**Q: Can I style focus outline?**
A: Yes, but must remain visible and clear.

**Q: What if skip-to-main link?**
A: Link to jump over nav to main content.

---

## Summary

- **Semantic HTML**: Use proper elements (button, nav, main)
- **Labels**: All inputs should have labels
- **ARIA**: Enhance accessibility when semantic HTML insufficient
- **Keyboard Navigation**: Support Tab, Arrow keys, Enter, Escape
- **Focus Indicators**: Always visible outline
- **Alt Text**: Describe all images
- **Contrast**: 4.5:1 minimum for text
- **Screen Readers**: Test with actual screen readers
- **WCAG Standards**: Follow Web Accessibility Guidelines
- **Automated Testing**: Use jest-axe for violations

**Next Step:** Master security & performance optimization!
