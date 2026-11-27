# JavaScript Basics & Setup

## Table of Contents
1. JavaScript vs ECMAScript
2. Setting up your environment
3. Running your first program
4. Understanding the JavaScript ecosystem

---

## 1. JavaScript vs ECMAScript

### What is JavaScript?
- **JavaScript (JS)**: A programming language created by Brendan Eich in 1995
- Initially called "Mocha", then "LiveScript", finally "JavaScript" for marketing reasons
- Primary language for web development (runs in browsers)
- Now also runs on servers (Node.js), desktop apps (Electron), mobile (React Native)

### What is ECMAScript?
- **ECMAScript (ES)**: The standardized specification of JavaScript
- Maintained by ECMA International (TC39 committee)
- JavaScript is the most well-known implementation of ECMAScript standard
- Other implementations: ActionScript (Flash), Jscript (older IE)

### ECMAScript Versions
- **ES1 (1997)**: First standardized version
- **ES5 (2009)**: Major improvements (strict mode, JSON, Array methods)
- **ES6/ES2015 (2015)**: Huge update (classes, arrow functions, modules, Promises, let/const, template literals)
- **ES2016+**: Annual updates with smaller additions
- Modern JavaScript = ES2015 + features since then

### Why the distinction matters?
- Some older browsers only support ES5
- Build tools (Babel) transpile modern JS to older versions for compatibility
- Understanding ES5 helps you understand how things work under the hood

---

## 2. Setting Up Your Environment

### Download VSCode
1. Go to https://code.visualstudio.com/
2. Download for your OS (Windows/Mac/Linux)
3. Install following the prompts
4. Launch VSCode

### Essential VSCode Extensions
1. **Code Runner** - Run JavaScript directly in VSCode
   - Search in Extensions → Install
   - Right-click file → Run Code
   
2. **Live Server** - Run HTML with auto-reload
3. **ES7+ React/Redux/React-Native snippets** - Code shortcuts
4. **Prettier** - Format code automatically

### Setup Node.js (Optional but Recommended)
1. Go to https://nodejs.org/
2. Download LTS (Long Term Support) version
3. Install following prompts
4. Verify installation: Open terminal and run `node --version`

### Create Project Structure
```
javascript-learning/
├── 01-basics/
│   ├── hello-world.js
│   ├── variables.js
│   └── ...
├── 02-arrays/
├── 03-objects/
├── index.html
└── README.md
```

---

## 3. Running Your First Program

### Method 1: Browser Console
1. Open browser → Press F12 or Cmd+Option+I
2. Go to "Console" tab
3. Type: `console.log("Hello World!")`
4. Press Enter
5. See output: `Hello World!`

### Method 2: VSCode with Code Runner
```javascript
// hello-world.js
console.log("Hello World!");
```
1. Open file in VSCode
2. Right-click → Run Code
3. See output in terminal

### Method 3: HTML File
```html
<!DOCTYPE html>
<html>
<head>
    <title>My First Program</title>
</head>
<body>
    <h1>Open Developer Console (F12)</h1>
    <script>
        console.log("Hello from browser!");
    </script>
</body>
</html>
```

### Method 4: Node.js
```bash
# In terminal
node hello-world.js
```

---

## 4. Understanding the JavaScript Ecosystem

### What is the DOM?
- **DOM (Document Object Model)**: Interface to HTML from JavaScript
- Allows JS to manipulate web pages
- Covered in detail in later sections

### What is Node.js?
- JavaScript runtime for running JS outside browsers
- Allows server-side development
- Access to file system, database, server capabilities
- Used by millions of web applications

### What is a Package Manager?
- **npm** (Node Package Manager): Install third-party libraries
- **yarn**, **pnpm**: Alternatives to npm
- Manage dependencies for projects

### Common Terminology
- **Variable**: Container to store data
- **Function**: Reusable block of code
- **Object**: Collection of properties and methods
- **Array**: Ordered collection of elements
- **Callback**: Function passed as argument to another function
- **Asynchronous**: Code that doesn't execute immediately
- **Promise**: Object representing future value
- **API**: Way to request data from servers

---

## Exercises

### Exercise 1: Setup and First Log
1. Create a new folder called `javascript-learning`
2. Create file `01-hello.js`
3. Write code that logs "Welcome to JavaScript!"
4. Run it using Code Runner
5. Verify the output

### Exercise 2: Multiple Statements
```javascript
// Write code that outputs:
console.log("My name is John");
console.log("I am learning JavaScript");
console.log("JavaScript is awesome!");
```

### Exercise 3: Browser Console Practice
1. Open any website
2. Press F12 to open Developer Tools
3. Go to Console tab
4. Type: `2 + 2` and press Enter
5. Type: `"Hello" + " " + "World"` and press Enter
6. Observe results

---

## Interview Questions

### Theoretical Questions

**Q1: What is the difference between JavaScript and ECMAScript?**
A: JavaScript is a programming language, ECMAScript is the standardized specification. JavaScript implements ECMAScript standard. It's like how "C" is a language and "ANSI C" is the standard for C.

**Q2: Why was JavaScript created? What was its original purpose?**
A: JavaScript was created in 1995 by Brendan Eich in just 10 days for Netscape Navigator to make web pages interactive. Originally called LiveScript, it was renamed JavaScript for marketing reasons to piggyback on Java's popularity (despite being completely different).

**Q3: What are the major differences between ES5 and ES6?**
A: ES6 (2015) introduced: arrow functions, classes, let/const, template literals, destructuring, modules, Promises, default parameters, rest/spread operators. ES5 (2009) had: strict mode, JSON object, Array methods (map, filter, reduce), Object.create, Object.defineProperty.

**Q4: Why do we need transpilers like Babel?**
A: Modern JavaScript (ES6+) isn't supported by older browsers. Babel converts modern syntax to ES5 that all browsers understand, allowing developers to use new features while maintaining compatibility.

**Q5: What is the difference between using JavaScript in a browser vs Node.js?**
A: Browser: Can manipulate DOM, access window object, localStorage; can't access file system directly. Node.js: Can access file system, OS, server capabilities; no DOM, no browser APIs; used for backend development.

---

## Code-Based Interview Questions

**Q1: What will be the output?**
```javascript
console.log(typeof "hello");
console.log(typeof 42);
console.log(typeof true);
```
A: 
```
"string"
"number"
"boolean"
```

**Q2: Spot the error and fix it:**
```javascript
console.log("My age is" 25);
```
A: Missing `+` operator for concatenation
```javascript
console.log("My age is " + 25);  // or
console.log("My age is", 25);     // or
console.log(`My age is ${25}`);
```

**Q3: What will be the output?**
```javascript
var x = 5;
{
    var x = 10;
}
console.log(x);
```
A: Output: `10` (var is function-scoped, not block-scoped, covered later in detail)

---

## Follow-up Questions & Edge Cases

**Q: Why shouldn't we use `var` anymore?**
A: `var` has confusing function-scoping and hoisting behavior. `let` and `const` have predictable block-scoping. `var` can be redeclared in same scope, `let` and `const` can't. Modern practice uses `let` and `const`.

**Q: What if I want to run JavaScript on my computer without a browser?**
A: Use Node.js. Install from nodejs.org, then run JavaScript files using `node filename.js` in terminal.

**Q: Can JavaScript run outside of browsers?**
A: Yes! Node.js, Deno, Bun are JavaScript runtimes. Electron builds desktop apps with JS. React Native builds mobile apps.

**Q: What's the relationship between JavaScript and Java?**
A: Nothing! Marketing trick. JavaScript was originally called Mocha/LiveScript. At the time, Java was trending, so it was renamed to JavaScript to attract developers. They're completely different languages.

---

## Summary

- **JavaScript** is the programming language for web development
- **ECMAScript** is the standardized specification
- **ES6 (2015)** was a major update with modern features
- Set up **VSCode** and **Node.js** for local development
- Use **console.log()** to output data
- JavaScript runs in **browsers** and **Node.js** runtime

**Next Step:** Learn variables and data types!
