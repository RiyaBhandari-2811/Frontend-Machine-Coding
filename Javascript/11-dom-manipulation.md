# DOM Basics & Manipulation

## Table of Contents
1. What is the DOM?
2. Selecting Elements
3. Modifying Element Content
4. Manipulating Attributes
5. Modifying CSS Classes
6. Changing Inline Styles
7. Creating & Removing Elements
8. Traversing the DOM
9. DOM Collections

---

## 1. What is the DOM?

### Understanding the DOM
- **DOM (Document Object Model)**: Tree representation of HTML document
- Interface for JavaScript to interact with web page
- Each HTML tag becomes object with properties and methods
- Dynamic - can change while page is running

### DOM Structure
```javascript
// HTML:
// <html>
//   <body>
//     <div id="container">
//       <p class="text">Hello</p>
//     </div>
//   </body>
// </html>

// JavaScript can access:
document.documentElement  // <html>
document.body            // <body>
document.getElementById("container")  // <div>
document.querySelector(".text")       // <p>
```

### document Object
```javascript
// document is global object representing the page
console.log(document.title);           // Page title
console.log(document.url);             // Page URL
console.log(document.domain);          // Domain
console.log(document.body);            // <body>
console.log(document.head);            // <head>
```

---

## 2. Selecting Elements

### getElementById()
```javascript
// HTML: <div id="main">Content</div>

let element = document.getElementById("main");
console.log(element);  // <div id="main">Content</div>

// Returns null if not found
let notFound = document.getElementById("missing");
console.log(notFound);  // null

// IDs must be unique
let el = document.getElementById("main");
console.log(el.textContent);  // "Content"
```

### getElementsByClassName()
```javascript
// HTML:
// <p class="highlight">Text 1</p>
// <p class="highlight">Text 2</p>
// <p>Text 3</p>

let elements = document.getElementsByClassName("highlight");
console.log(elements.length);  // 2
console.log(elements[0]);      // First <p> with class "highlight"

// Returns HTMLCollection (live - updates if DOM changes)
for (let el of elements) {
    console.log(el.textContent);  // "Text 1", "Text 2"
}
```

### getElementsByTagName()
```javascript
// HTML:
// <p>Paragraph 1</p>
// <p>Paragraph 2</p>
// <p>Paragraph 3</p>

let paragraphs = document.getElementsByTagName("p");
console.log(paragraphs.length);  // 3

// Can be called on any element
let container = document.getElementById("container");
let children = container.getElementsByTagName("*");  // All children
```

### querySelector()
```javascript
// CSS selector - single element (first match)

// ID selector
let element = document.querySelector("#main");

// Class selector
let element = document.querySelector(".highlight");

// Tag selector
let element = document.querySelector("p");

// Complex selectors
let element = document.querySelector("div.container > p.text");

// Attribute selector
let element = document.querySelector('[data-id="123"]');

// Returns null if not found
let notFound = document.querySelector(".missing");
```

### querySelectorAll()
```javascript
// CSS selector - all matching elements

// Get all paragraphs
let paragraphs = document.querySelectorAll("p");
console.log(paragraphs.length);

// Get all elements with class
let highlights = document.querySelectorAll(".highlight");

// Complex selector
let elements = document.querySelectorAll("div.container p.text");

// Returns NodeList (static - doesn't update)
for (let el of elements) {
    console.log(el);
}

// Convert to array
let arr = Array.from(elements);
let arr2 = [...elements];
```

### querySelector vs getElementsBy
```javascript
// querySelector:
// - Any CSS selector
// - Returns single element (first match)
// - querySelectorAll returns NodeList (static)
// - Slower for simple cases

// getElementBy*:
// - Specific selector types only
// - Returns HTMLCollection (live for getElementById returns single)
// - Faster for simple cases
// - getElementsByClassName returns HTMLCollection

// Modern practice: Use querySelector/querySelectorAll
let el = document.querySelector("#id");  // Preferred
```

---

## 3. Modifying Element Content

### textContent
```javascript
// HTML: <div id="box">Hello <b>World</b></div>

let box = document.getElementById("box");
console.log(box.textContent);  // "Hello World" (no tags)

// Set text
box.textContent = "New text";
// HTML becomes: <div id="box">New text</div>

// textContent is safer (doesn't parse HTML)
box.textContent = "<script>alert('xss')</script>";
// Displays literal text, doesn't execute
```

### innerHTML
```javascript
// HTML: <div id="box">Hello <b>World</b></div>

let box = document.getElementById("box");
console.log(box.innerHTML);  // "Hello <b>World</b>" (with tags)

// Set HTML
box.innerHTML = "<p>New content</p>";
// HTML becomes: <div id="box"><p>New content</p></div>

// CAUTION: innerHTML can execute scripts
box.innerHTML = "<script>alert('danger')</script>";  // ⚠️ Security risk!

// XSS vulnerability
let userInput = getUserInput();  // "<img src=x onerror='alert(1)'>"
box.innerHTML = userInput;  // DANGEROUS!
```

### innerText
```javascript
// Similar to textContent but:
// - Respects CSS visibility
// - Slower (requires layout computation)
// - Better for display purposes

let box = document.getElementById("box");
box.innerText = "New text";
```

### textContent vs innerHTML
```javascript
// HTML: <div>Hello <b>World</b></div>

let div = document.querySelector("div");

console.log(div.textContent);   // "Hello World" (no HTML)
console.log(div.innerHTML);     // "Hello <b>World</b>"

// Setting:
div.textContent = "<p>Test</p>";  // Literal text
// Result: <div>&lt;p&gt;Test&lt;/p&gt;</div>

div.innerHTML = "<p>Test</p>";    // Parsed as HTML
// Result: <div><p>Test</p></div>
```

---

## 4. Manipulating Attributes

### getAttribute()
```javascript
// HTML: <img id="photo" src="image.jpg" alt="Photo" data-id="123">

let img = document.getElementById("photo");

console.log(img.getAttribute("src"));      // "image.jpg"
console.log(img.getAttribute("alt"));      // "Photo"
console.log(img.getAttribute("data-id"));  // "123"
console.log(img.getAttribute("missing"));  // null
```

### setAttribute()
```javascript
let img = document.getElementById("photo");

// Set attribute
img.setAttribute("src", "new-image.jpg");
img.setAttribute("alt", "New photo");
img.setAttribute("data-category", "photos");

// HTML becomes:
// <img id="photo" src="new-image.jpg" alt="New photo" data-category="photos">
```

### Direct Property Access
```javascript
// Many attributes are properties
let input = document.querySelector("input");

// Can set directly
input.value = "New value";
input.placeholder = "Enter text...";
input.disabled = true;

// But for data attributes, use getAttribute/setAttribute
input.setAttribute("data-id", "123");
```

### removeAttribute()
```javascript
let input = document.querySelector("input");

input.removeAttribute("disabled");   // Enable input
input.removeAttribute("placeholder");
```

### hasAttribute()
```javascript
let img = document.querySelector("img");

if (img.hasAttribute("alt")) {
    console.log("Image has alt text");
}
```

---

## 5. Modifying CSS Classes

### classList API
```javascript
// HTML: <div class="box active">Content</div>

let box = document.querySelector(".box");

// Get all classes
console.log(box.classList);  // DOMTokenList with "box", "active"

// Check if has class
console.log(box.classList.contains("active"));  // true
console.log(box.classList.contains("hidden"));  // false

// Add class
box.classList.add("highlighted");
// HTML becomes: <div class="box active highlighted">

// Add multiple classes
box.classList.add("shadow", "border");

// Remove class
box.classList.remove("active");
// HTML becomes: <div class="box highlighted shadow border">

// Remove multiple classes
box.classList.remove("shadow", "border");

// Toggle class (add if missing, remove if present)
box.classList.toggle("active");   // Adds since missing
box.classList.toggle("active");   // Removes since present

// Toggle with force (true = add, false = remove)
box.classList.toggle("active", true);   // Add
box.classList.toggle("active", false);  // Remove

// Replace class
box.classList.replace("box", "container");
// HTML becomes: <div class="container highlighted">
```

### className Property (Old Way)
```javascript
// HTML: <div class="box active">Content</div>

let box = document.querySelector("div");

// Get all classes as string
console.log(box.className);  // "box active"

// Set classes (replaces all)
box.className = "new-class";
// HTML becomes: <div class="new-class">

// Append class (messy)
box.className += " another-class";
// classList is better!
```

---

## 6. Changing Inline Styles

### style Property
```javascript
// HTML: <div>Content</div>

let div = document.querySelector("div");

// Set inline styles
div.style.color = "red";
div.style.backgroundColor = "lightblue";
div.style.padding = "10px";
div.style.fontSize = "20px";

// HTML becomes:
// <div style="color: red; background-color: lightblue; padding: 10px; font-size: 20px;">

// CSS property names become camelCase in JavaScript
// CSS: background-color → JavaScript: backgroundColor
// CSS: font-size → JavaScript: fontSize
// CSS: z-index → JavaScript: zIndex

// Get inline style
console.log(div.style.color);  // "red"

// Set to empty string to remove
div.style.color = "";  // Removes color style

// Not recommended to set many styles
// Better to use classes
```

### getComputedStyle()
```javascript
// Get ALL styles (including from CSS)
let box = document.querySelector(".box");

let styles = getComputedStyle(box);
console.log(styles.color);           // Computed color
console.log(styles.backgroundColor); // Computed background
console.log(styles.width);           // Computed width

// Get specific style
let width = getComputedStyle(box).width;
```

---

## 7. Creating & Removing Elements

### createElement()
```javascript
// Create new element
let p = document.createElement("p");
p.textContent = "New paragraph";
p.classList.add("text");

console.log(p);  // <p class="text">New paragraph</p>
// But not in DOM yet!

// Add to DOM
document.body.appendChild(p);  // Add at end
```

### appendChild()
```javascript
let container = document.getElementById("container");
let newDiv = document.createElement("div");
newDiv.textContent = "New content";

// Add at end
container.appendChild(newDiv);
```

### insertBefore()
```javascript
let container = document.getElementById("container");
let newDiv = document.createElement("div");

let firstChild = container.firstChild;
// Insert before first child
container.insertBefore(newDiv, firstChild);
```

### removeChild()
```javascript
let container = document.getElementById("container");
let p = container.querySelector("p");

// Remove element
container.removeChild(p);

// Element removed from DOM but still in memory
// Can add it elsewhere
anotherContainer.appendChild(p);
```

### remove()
```javascript
let p = document.querySelector("p");

// Remove directly (modern way)
p.remove();  // Removed from DOM
```

### replaceChild()
```javascript
let container = document.getElementById("container");
let oldElement = container.querySelector("p");
let newElement = document.createElement("div");

container.replaceChild(newElement, oldElement);
```

---

## 8. Traversing the DOM

### Parent/Child/Sibling
```javascript
// HTML:
// <div id="container">
//   <p id="paragraph">Text</p>
//   <span>More text</span>
// </div>

let p = document.getElementById("paragraph");

// Parent
console.log(p.parentElement);  // <div id="container">
console.log(p.parentNode);     // Same in modern browsers

// Siblings
console.log(p.nextElementSibling);  // <span>
console.log(p.previousElementSibling);  // null (no previous sibling)

// Children
let container = document.getElementById("container");
console.log(container.firstElementChild);  // <p>
console.log(container.lastElementChild);   // <span>
console.log(container.children);           // All children
console.log(container.childNodes);         // All nodes (including text)
```

### Finding Closest Parent
```javascript
// HTML:
// <div class="container">
//   <div class="item">
//     <button id="btn">Click</button>
//   </div>
// </div>

let btn = document.getElementById("btn");

// Find closest parent with class
let item = btn.closest(".item");        // <div class="item">
let container = btn.closest(".container");  // <div class="container">
let notFound = btn.closest(".missing");     // null
```

---

## Exercises

### Exercise 1: Element Selection
```javascript
// HTML:
// <div class="container">
//   <p id="intro">Introduction</p>
//   <ul>
//     <li>Item 1</li>
//     <li class="highlight">Item 2</li>
//     <li>Item 3</li>
//   </ul>
// </div>

// 1. Select intro paragraph
// 2. Select all li elements
// 3. Select li with class "highlight"
// 4. Select container div

// Your code
```

**Solution:**
```javascript
let intro = document.getElementById("intro");
let items = document.querySelectorAll("li");
let highlighted = document.querySelector(".highlight");
let container = document.querySelector(".container");
```

### Exercise 2: Modify Content
```javascript
// 1. Create new paragraph
// 2. Set text to "Hello World"
// 3. Add to body
// 4. Change text to uppercase

// Your code
```

**Solution:**
```javascript
let p = document.createElement("p");
p.textContent = "Hello World";
document.body.appendChild(p);
p.textContent = p.textContent.toUpperCase();
```

### Exercise 3: Modify Classes
```javascript
// Add "active" class to element
// Remove "inactive" class
// Check if has "highlight" class

let box = document.querySelector(".box");
// Your code
```

**Solution:**
```javascript
box.classList.add("active");
box.classList.remove("inactive");
console.log(box.classList.contains("highlight"));
```

---

## Interview Questions

### Theoretical Questions

**Q1: What is the DOM?**
A: Document Object Model - tree of HTML elements as objects. JavaScript interface to interact with web page.

**Q2: What's the difference between textContent and innerHTML?**
A: textContent is text only, innerHTML includes HTML tags. innerHTML is security risk (XSS), use textContent for user input.

**Q3: When should I use classList vs className?**
A: classList for adding/removing specific classes. className for replacing all classes (rare). classList modern and cleaner.

**Q4: What's difference between querySelector and getElementById?**
A: querySelector is more flexible (any CSS selector), but getElementById faster. For modern code, querySelector fine.

**Q5: Why use classes instead of inline styles?**
A: Classes better for maintainability, reusability, performance. Inline styles hard to manage and can't use CSS features (media queries, etc).

---

## Code-Based Interview Questions

**Q1: What will be output?**
```javascript
let p = document.createElement("p");
p.textContent = "Test";
console.log(p);  // ?
console.log(document.body.contains(p));  // ?
```
A:
```
<p>Test</p>
false (not in DOM yet)
```

**Q2: Predict:**
```javascript
let div = document.querySelector("div");
div.innerHTML = "<p>Text</p>";
let p = div.querySelector("p");
console.log(p.textContent);  // ?
```
A:
```
"Text"
```

**Q3: What will be logged?**
```javascript
let box = document.querySelector(".box");
box.classList.add("active");
box.classList.toggle("active");
console.log(box.classList.contains("active"));  // ?
```
A:
```
false
```
Explanation: Toggle adds if missing, removes if present. Active was present so removed.

**Q4: Spot the security issue:**
```javascript
let userComment = getUserComment();  // "<img src=x onerror='alert(1)'>"
document.getElementById("comments").innerHTML = userComment;  // ✗ XSS!
```
A: Use textContent instead, or sanitize input.

**Q5: What is output?**
```javascript
let p = document.querySelector("p");
let parent = p.parentElement;
console.log(parent);  // ?
```
A:
```
(parent element of p - could be div, body, etc)
```

---

## Follow-up Questions & Confusing Concepts

**Q: What's the difference between children and childNodes?**
A: children returns elements only, childNodes includes text nodes and comments. Use children for most cases.

**Q: Can I modify removed elements?**
A: Yes! Removed elements still in memory, can add back later.

**Q: Why is innerHTML considered dangerous?**
A: Can execute scripts if HTML contains malicious code. Always sanitize user input.

**Q: What's difference between appendChild and insertBefore?**
A: appendChild adds at end, insertBefore adds before specific element. appendChild most common.

---

## Summary

- **DOM**: Tree of HTML elements as JavaScript objects
- **Selection**: querySelector/querySelectorAll (modern), getElementById (old)
- **Content**: textContent (text only), innerHTML (HTML - security risk)
- **Attributes**: getAttribute, setAttribute, removeAttribute
- **Classes**: classList.add/remove/toggle/contains
- **Styles**: style property for inline, getComputedStyle for all
- **Creation**: createElement, appendChild, insertBefore
- **Removal**: removeChild, remove
- **Traversal**: parentElement, children, siblings, closest

**Next Step:** Learn about events and user interactions!
