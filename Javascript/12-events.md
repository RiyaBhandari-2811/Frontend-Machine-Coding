# Event Handling in JavaScript

## Table of Contents
1. What are Events?
2. Event Listeners
3. Event Object
4. Event Types
5. Event Bubbling & Capturing
6. Event Delegation
7. preventDefault & stopPropagation
8. Common Events
9. Event Handler Patterns

---

## 1. What are Events?

### Understanding Events
- **Event**: Action or occurrence on web page
- User interactions: clicks, typing, scrolling
- Browser events: load, resize, unload
- JavaScript can listen and respond to events

### Why Events Matter
```javascript
// Without events - nothing happens when user interacts
// With events - can respond to user actions

// HTML button does nothing by default
// <button id="btn">Click me</button>

// Add JavaScript to respond to click
let btn = document.getElementById("btn");
btn.addEventListener("click", function() {
    alert("Button clicked!");
});
```

---

## 2. Event Listeners

### addEventListener()
```javascript
// addEventListener(eventType, callback, [options])

let btn = document.getElementById("btn");

// Basic listener
btn.addEventListener("click", function() {
    console.log("Button clicked!");
});

// Arrow function
btn.addEventListener("click", () => {
    console.log("Button clicked!");
});

// Handler function
function handleClick() {
    console.log("Button clicked!");
}
btn.addEventListener("click", handleClick);
```

### removeEventListener()
```javascript
let btn = document.getElementById("btn");

function handleClick() {
    console.log("Clicked");
}

// Add listener
btn.addEventListener("click", handleClick);

// Remove listener (must use same function reference)
btn.removeEventListener("click", handleClick);
```

### inline Event Handlers (Old Way - Not Recommended)
```html
<!-- HTML -->
<button onclick="alert('Clicked!')">Click me</button>
<button onclick="handleClick()">Click me</button>

<script>
function handleClick() {
    console.log("Clicked");
}
</script>
```

**Problems:**
- Mixes HTML and JavaScript
- Can't add multiple handlers
- Hard to remove
- Not recommended in modern code

---

## 3. Event Object

### Event Properties
```javascript
let btn = document.getElementById("btn");

btn.addEventListener("click", function(event) {
    // event object contains information about the event
    
    console.log(event.type);           // "click"
    console.log(event.target);         // The element clicked
    console.log(event.currentTarget);  // The element with listener
    console.log(event.timeStamp);      // Time when event occurred
    console.log(event.clientX);        // Mouse X position
    console.log(event.clientY);        // Mouse Y position
});
```

### Common Event Properties
```javascript
document.addEventListener("click", (e) => {
    console.log(e.type);           // "click"
    console.log(e.target);         // Element that triggered event
    console.log(e.currentTarget);  // Element with listener
    console.log(e.button);         // 0=left, 1=middle, 2=right
    console.log(e.ctrlKey);        // true if Ctrl held
    console.log(e.shiftKey);       // true if Shift held
    console.log(e.altKey);         // true if Alt held
});
```

---

## 4. Event Types

### Mouse Events
```javascript
let box = document.querySelector(".box");

// Click
box.addEventListener("click", () => {
    console.log("Clicked!");
});

// Double click
box.addEventListener("dblclick", () => {
    console.log("Double clicked!");
});

// Mouse down (starts click)
box.addEventListener("mousedown", () => {
    console.log("Mouse down");
});

// Mouse up (releases click)
box.addEventListener("mouseup", () => {
    console.log("Mouse up");
});

// Mouse enter
box.addEventListener("mouseenter", () => {
    console.log("Mouse entered");
});

// Mouse leave
box.addEventListener("mouseleave", () => {
    console.log("Mouse left");
});

// Mouse move
box.addEventListener("mousemove", (e) => {
    console.log(e.clientX, e.clientY);  // Position
});

// Context menu (right click)
box.addEventListener("contextmenu", (e) => {
    e.preventDefault();  // Prevent default menu
});
```

### Keyboard Events
```javascript
document.addEventListener("keydown", (e) => {
    console.log("Key down: " + e.key);  // "a", "Enter", "ArrowUp"
    console.log(e.code);               // "KeyA", "Enter", "ArrowUp"
});

document.addEventListener("keyup", (e) => {
    console.log("Key up: " + e.key);
});

document.addEventListener("keypress", (e) => {
    console.log("Key pressed: " + e.key);  // Only printable keys
});

// Input event (better for form input)
let input = document.querySelector("input");
input.addEventListener("input", (e) => {
    console.log("Value: " + e.target.value);
});
```

### Form Events
```javascript
let form = document.querySelector("form");
let input = document.querySelector("input");

// Focus (element focused)
input.addEventListener("focus", () => {
    console.log("Input focused");
});

// Blur (element loses focus)
input.addEventListener("blur", () => {
    console.log("Input blurred");
});

// Change (value changed and unfocused)
input.addEventListener("change", (e) => {
    console.log("Changed to: " + e.target.value);
});

// Input (value changed, fires while typing)
input.addEventListener("input", (e) => {
    console.log("Current value: " + e.target.value);
});

// Submit (form submitted)
form.addEventListener("submit", (e) => {
    e.preventDefault();  // Don't submit
    console.log("Form submitted");
});
```

### Document Events
```javascript
// Page loaded
window.addEventListener("load", () => {
    console.log("Page loaded");
});

// Before unload
window.addEventListener("beforeunload", () => {
    // Warn user before leaving
    return "Are you sure?";
});

// Scroll
window.addEventListener("scroll", () => {
    console.log("Scrolled!");
});

// Resize
window.addEventListener("resize", () => {
    console.log("Window resized!");
});
```

---

## 5. Event Bubbling & Capturing

### Event Bubbling (Default)
```javascript
// HTML:
// <div class="outer">
//   <div class="middle">
//     <button>Click me</button>
//   </div>
// </div>

let btn = document.querySelector("button");
let middle = document.querySelector(".middle");
let outer = document.querySelector(".outer");

// All listeners fire when button clicked
btn.addEventListener("click", () => {
    console.log("Button clicked");
});

middle.addEventListener("click", () => {
    console.log("Middle clicked");  // Fires too!
});

outer.addEventListener("click", () => {
    console.log("Outer clicked");   // Fires too!
});

// Output when clicking button:
// Button clicked
// Middle clicked
// Outer clicked
// Event bubbles up from inner to outer elements
```

### Event Capturing (Optional)
```javascript
// Add listener in capturing phase
outer.addEventListener("click", () => {
    console.log("Outer (capturing)");
}, true);  // true = capturing phase

middle.addEventListener("click", () => {
    console.log("Middle (bubbling)");
}, false);  // false = bubbling phase (default)

btn.addEventListener("click", () => {
    console.log("Button (bubbling)");
});

// Output:
// Outer (capturing) - capturing phase
// Button (bubbling) - bubbling phase
// Middle (bubbling) - bubbling phase

// Capturing phase: outer → middle → button
// Bubbling phase: button → middle → outer
```

### Stopping Propagation
```javascript
let btn = document.querySelector("button");
let parent = document.querySelector(".parent");

btn.addEventListener("click", (e) => {
    console.log("Button");
    e.stopPropagation();  // Stop bubbling
});

parent.addEventListener("click", () => {
    console.log("Parent");  // Won't print
});

// Output: Button (parent listener never fires)
```

---

## 6. Event Delegation

### What is Event Delegation?
- Technique using event bubbling
- Attach single listener to parent
- Handles events for multiple children
- More efficient than individual listeners

### Event Delegation Example
```javascript
// HTML:
// <ul id="list">
//   <li>Item 1</li>
//   <li>Item 2</li>
//   <li>Item 3</li>
// </ul>

// Without delegation (bad - multiple listeners)
let items = document.querySelectorAll("li");
items.forEach(item => {
    item.addEventListener("click", () => {
        console.log("Item clicked");
    });
});
// Problem: If items added dynamically, no listener!

// With delegation (good - single listener)
let list = document.getElementById("list");
list.addEventListener("click", (e) => {
    if (e.target.tagName === "LI") {
        console.log("Item clicked: " + e.target.textContent);
    }
});
// Works for existing AND dynamically added items!
```

### Closest Method with Delegation
```javascript
// HTML:
// <ul class="list">
//   <li class="item">
//     <span>Text</span>
//   </li>
// </ul>

let list = document.querySelector(".list");

list.addEventListener("click", (e) => {
    // Find closest .item element
    let item = e.target.closest(".item");
    if (item) {
        console.log("Item clicked: " + item.textContent);
    }
});

// Works even if span is clicked!
```

---

## 7. preventDefault & stopPropagation

### preventDefault()
```javascript
// Prevents default browser behavior

// Prevent form submission
let form = document.querySelector("form");
form.addEventListener("submit", (e) => {
    e.preventDefault();  // Don't submit
    console.log("Form prevented");
});

// Prevent link navigation
let link = document.querySelector("a");
link.addEventListener("click", (e) => {
    e.preventDefault();  // Don't navigate
    console.log("Link prevented");
});

// Prevent context menu
document.addEventListener("contextmenu", (e) => {
    e.preventDefault();  // Don't show menu
});

// Prevent text selection
let box = document.querySelector(".box");
box.addEventListener("selectstart", (e) => {
    e.preventDefault();  // Can't select text
});
```

### stopPropagation()
```javascript
// Stops event bubbling to parent elements

let child = document.querySelector(".child");
let parent = document.querySelector(".parent");

child.addEventListener("click", (e) => {
    e.stopPropagation();  // Stop bubbling
    console.log("Child clicked");
});

parent.addEventListener("click", () => {
    console.log("Parent clicked");  // Won't fire
});

// Output: Child clicked
// Parent listener never fires
```

### stopImmediatePropagation()
```javascript
// Stops event propagation and other handlers

let btn = document.querySelector("button");

btn.addEventListener("click", (e) => {
    e.stopImmediatePropagation();
    console.log("Handler 1");
});

btn.addEventListener("click", () => {
    console.log("Handler 2");  // Won't fire
});

// Output: Handler 1
```

---

## 8. Common Event Patterns

### Form Validation
```javascript
let form = document.querySelector("form");
let email = form.querySelector("[name='email']");
let password = form.querySelector("[name='password']");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    
    if (!email.value.includes("@")) {
        alert("Invalid email");
        return;
    }
    
    if (password.value.length < 6) {
        alert("Password too short");
        return;
    }
    
    // Valid - submit
    form.submit();
});
```

### Real-time Input Validation
```javascript
let input = document.querySelector("input[name='username']");

input.addEventListener("input", (e) => {
    let value = e.target.value;
    
    if (value.length < 3) {
        input.classList.add("error");
    } else {
        input.classList.remove("error");
    }
});
```

### Toggle Menu
```javascript
let toggleBtn = document.querySelector(".menu-toggle");
let menu = document.querySelector(".menu");

toggleBtn.addEventListener("click", () => {
    menu.classList.toggle("open");
});

// Close when item clicked
menu.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
        menu.classList.remove("open");
    }
});
```

---

## Exercises

### Exercise 1: Click Counter
```javascript
// HTML:
// <button id="btn">Click me</button>
// <p id="count">Clicks: 0</p>

// Count clicks and display

let btn = document.getElementById("btn");
let count = document.getElementById("count");
let clicks = 0;

btn.addEventListener("click", () => {
    clicks++;
    count.textContent = "Clicks: " + clicks;
});
```

### Exercise 2: Input Listener
```javascript
// HTML:
// <input id="search" placeholder="Search...">
// <p id="output"></p>

// Display what user types

let input = document.getElementById("search");
let output = document.getElementById("output");

input.addEventListener("input", (e) => {
    output.textContent = "Searching for: " + e.target.value;
});
```

### Exercise 3: Event Delegation
```javascript
// HTML:
// <ul id="list">
//   <li>Item 1</li>
//   <li>Item 2</li>
//   <li>Item 3</li>
// </ul>

// Log clicked item using delegation

let list = document.getElementById("list");

list.addEventListener("click", (e) => {
    if (e.target.tagName === "LI") {
        console.log("Clicked: " + e.target.textContent);
    }
});
```

---

## Interview Questions

### Theoretical Questions

**Q1: What is event bubbling?**
A: Event starts at target element, then bubbles up through parent elements. Each parent's listeners fire too unless stopped.

**Q2: What's the difference between target and currentTarget?**
A: target is element that triggered event, currentTarget is element with listener. In delegated events, they differ.

**Q3: When should I use event delegation?**
A: For dynamic content (items added after listeners attached), or many items (efficiency). Single listener for many elements.

**Q4: What does preventDefault do?**
A: Stops browser's default action (form submission, link navigation, context menu, etc).

**Q5: Why use addEventListener instead of inline handlers?**
A: Multiple listeners possible, easier to remove, keeps HTML/JS separate, cleaner code.

---

## Code-Based Interview Questions

**Q1: What will be output?**
```javascript
let parent = document.querySelector(".parent");
let child = document.querySelector(".child");

parent.addEventListener("click", () => {
    console.log("Parent");
});

child.addEventListener("click", () => {
    console.log("Child");
});

// Click child
// ?
```
A:
```
Child
Parent
```
Explanation: Bubbling from child to parent

**Q2: Predict output:**
```javascript
let btn = document.querySelector("button");

btn.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("Prevented");
});

// HTML: <button onclick="alert('onclick')">

// Click button
// ?
```
A: Only "Prevented" logs. The onclick handler still fires! preventDefault doesn't affect inline handlers.

**Q3: What will be logged?**
```javascript
let container = document.querySelector(".container");

container.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn")) {
        console.log("Button clicked");
    }
});

// Add button dynamically
let btn = document.createElement("button");
btn.classList.add("btn");
container.appendChild(btn);
btn.click();  // ?
```
A:
```
Button clicked
```
Explanation: Delegation works for dynamically added elements

**Q4: Spot the error:**
```javascript
function handleClick() {
    console.log("Clicked");
}

btn.addEventListener("click", handleClick);
btn.addEventListener("click", function() {
    handleClick();
});

btn.removeEventListener("click", handleClick);
// Second listener still attached!
```
A: Anonymous function wrapper prevents removal.

**Q5: What is output?**
```javascript
let form = document.querySelector("form");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    console.log("Prevented");
});

form.submit();  // ?
```
A:
```
(nothing)
```
Explanation: .preventDefault() doesn't prevent programmatic .submit()

---

## Follow-up Questions & Confusing Concepts

**Q: Can I remove listener added with anonymous function?**
A: No, need function reference. Store function in variable if you might remove it.

**Q: What's the performance cost of event delegation?**
A: Minimal. Recommended even for small numbers of elements. Cleaner than multiple listeners.

**Q: Why doesn't preventDefault() prevent inline onclick?**
A: Because inline handlers run before listener (in event handling chain). Different execution context.

**Q: Can I trigger events programmatically?**
A: Yes, with dispatchEvent() with custom events. But built-in events like submit need .submit() method.

---

## Summary

- **Event**: Action/occurrence on page
- **Listener**: Function called when event occurs
- **addEventListener**: Modern way to add listeners
- **Event object**: Contains information about event
- **Mouse/Keyboard/Form events**: Various event types
- **Bubbling**: Event goes up through parents
- **Capturing**: Event phase before bubbling
- **Delegation**: Single listener for multiple elements
- **preventDefault**: Stop default browser action
- **stopPropagation**: Stop event from bubbling

**Next Step:** Learn about advanced JavaScript patterns and OOP!
