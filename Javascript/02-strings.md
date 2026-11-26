# Strings in JavaScript

## Table of Contents
1. String Basics & Creation
2. String Indexing & Length
3. String Methods
4. Template Literals
5. String Escape Sequences
6. Useful String Operations

---

## 1. String Basics & Creation

### What is a String?
- **String**: Sequence of characters enclosed in quotes
- Primitive data type in JavaScript
- Immutable - can't modify individual characters, only create new strings

### Creating Strings
```javascript
let str1 = "Hello";           // Double quotes
let str2 = 'World';           // Single quotes (same functionality)
let str3 = `JavaScript`;      // Template literal (ES6)
let str4 = String(123);       // Convert to string

// All are equivalent for basic strings
console.log(typeof str1);  // "string"
```

### Single vs Double Quotes
- Both work identically in JavaScript
- Choose one and be consistent
- If string contains quote, use the other or escape it

```javascript
let quote1 = "She said 'hello'";
let quote2 = 'He said "hi"';
let quote3 = "He said \"hi\"";  // Escaped quotes
```

---

## 2. String Indexing & Length

### String Indexing
- Strings are indexed like arrays (0-based)
- Access character at specific position using bracket notation

```javascript
let str = "JavaScript";
console.log(str[0]);      // "J"
console.log(str[4]);      // "S"
console.log(str[10]);     // "t"
console.log(str[11]);     // undefined (out of range)
console.log(str[-1]);     // undefined (negative index doesn't work)
```

### String Length
```javascript
let str = "Hello";
console.log(str.length);  // 5

console.log("".length);              // 0
console.log("How are you?".length);  // 12
```

### Finding Characters
```javascript
let str = "JavaScript";

// Using index (0-based)
console.log(str.charAt(0));    // "J"
console.log(str.charCodeAt(0)); // 74 (ASCII code)

// Find position of character
console.log(str.indexOf("S"));      // 4
console.log(str.indexOf("xyz"));    // -1 (not found)
console.log(str.lastIndexOf("a")); // 9 (last occurrence)
```

---

## 3. Essential String Methods

### Case Conversion
```javascript
let str = "Hello World";

console.log(str.toUpperCase());  // "HELLO WORLD"
console.log(str.toLowerCase());  // "hello world"

// Real-world: validate email
let email = "JOHN@EXAMPLE.COM";
console.log(email.toLowerCase() === "john@example.com");  // true
```

### Trimming Whitespace
```javascript
let str = "  Hello  ";
console.log(str.trim());        // "Hello"
console.log(str.trimStart());   // "Hello  "
console.log(str.trimEnd());     // "  Hello"

// Real-world: form validation
let userInput = "  john@example.com  ";
let clean = userInput.trim().toLowerCase();
```

### Extracting Substrings
```javascript
let str = "JavaScript";

// slice(start, end) - end not included
console.log(str.slice(0, 4));    // "Java"
console.log(str.slice(4));       // "Script"
console.log(str.slice(-6));      // "Script" (from end)
console.log(str.slice(0, -2));   // "JavaScri"

// substring(start, end) - similar to slice, doesn't support negative
console.log(str.substring(0, 4)); // "Java"
console.log(str.substring(4));    // "Script"

// substr(start, length) - DEPRECATED, avoid!
console.log(str.substr(0, 4));   // "Java"
```

### Searching and Matching
```javascript
let text = "The quick brown fox jumps over the lazy dog";

// Check if contains substring
console.log(text.includes("quick"));    // true
console.log(text.includes("xyz"));      // false

// Check if starts or ends with
console.log(text.startsWith("The"));    // true
console.log(text.endsWith("dog"));      // true

// Count occurrences
console.log((text.match(/o/g) || []).length);  // 4 (uses regex)
```

### Replacing Text
```javascript
let str = "hello world hello";

// Replace first occurrence
console.log(str.replace("hello", "hi"));  // "hi world hello"

// Replace all (needs regex with g flag)
console.log(str.replace(/hello/g, "hi")); // "hi world hi"

// Real-world: sanitize user input
let userText = "hello";
userText = userText.replace(/[^a-z]/g, "");  // Remove non-letters
```

### Splitting and Joining
```javascript
// String to Array
let str = "apple,banana,orange";
let fruits = str.split(",");
console.log(fruits);  // ["apple", "banana", "orange"]

// Split by character
let word = "hello";
console.log(word.split(""));  // ["h", "e", "l", "l", "o"]

// Array to String
let arr = ["red", "green", "blue"];
console.log(arr.join(","));    // "red,green,blue"
console.log(arr.join(" - ")); // "red - green - blue"
console.log(arr.join(""));    // "redgreenblue"
```

### Repeating Strings
```javascript
console.log("ab".repeat(3));  // "ababab"
console.log("*".repeat(5));   // "*****"

// Real-world: create visual patterns
console.log("⭐".repeat(5));  // ⭐⭐⭐⭐⭐
```

### Padding
```javascript
let num = "5";
console.log(num.padStart(3, "0"));  // "005"
console.log(num.padEnd(3, "0"));    // "500"

// Real-world: format numbers/IDs
let id = "42";
console.log("ID: " + id.padStart(5, "0"));  // "ID: 00042"
```

---

## 4. Template Literals (ES6)

### Basic Syntax
```javascript
// Old way (concatenation)
let name = "John";
let age = 25;
console.log("My name is " + name + " and I'm " + age + " years old");

// Template literal way (backticks and ${})
console.log(`My name is ${name} and I'm ${age} years old`);
```

### Expressions in Templates
```javascript
let a = 5;
let b = 10;
console.log(`${a} + ${b} = ${a + b}`);  // "5 + 10 = 15"

// Function calls in template
function greet(name) {
    return `Hello, ${name}!`;
}
console.log(`Result: ${greet("Alice")}`);  // "Result: Hello, Alice!"

// Ternary operator
let isActive = true;
console.log(`Status: ${isActive ? "active" : "inactive"}`);  // "Status: active"
```

### Multiline Strings
```javascript
// Old way - concatenation with \n
let old = "line 1\nline 2\nline 3";

// Template literal - preserves actual line breaks
let new_text = `line 1
line 2
line 3`;

// Useful for HTML
let html = `
    <div>
        <h1>Welcome</h1>
        <p>Hello ${name}</p>
    </div>
`;
```

---

## 5. String Escape Sequences

```javascript
console.log("Hello\nWorld");        // \n - newline
console.log("Tab\there");           // \t - tab
console.log("Quote: \"Hello\"");    // \" - double quote
console.log("Backslash: \\");       // \\ - backslash
console.log("Single: \'Quote\'");   // \' - single quote
console.log("Carriage\rReturn");    // \r - carriage return
console.log("Backspace\b");         // \b - backspace
```

---

## Exercises

### Exercise 1: String Manipulation
```javascript
// 1. Create string "Hello World"
// 2. Convert to uppercase
// 3. Find length
// 4. Get character at index 6
// 5. Extract substring "World"
// 6. Check if includes "World"
// 7. Replace "World" with "JavaScript"
```

**Solution:**
```javascript
let str = "Hello World";
console.log(str.toUpperCase());              // "HELLO WORLD"
console.log(str.length);                     // 11
console.log(str[6]);                         // "W"
console.log(str.substring(6));               // "World"
console.log(str.includes("World"));          // true
console.log(str.replace("World", "JavaScript")); // "Hello JavaScript"
```

### Exercise 2: Extract Information
```javascript
// Given email: "john.doe@example.com"
// Extract: username, domain, extension
let email = "john.doe@example.com";

// Your code here
// Expected:
// username: "john.doe"
// domain: "example"
// extension: "com"
```

**Solution:**
```javascript
let email = "john.doe@example.com";

// Extract username (before @)
let username = email.split("@")[0];  // "john.doe"

// Extract domain (between @ and .)
let domainPart = email.split("@")[1];  // "example.com"
let domain = domainPart.split(".")[0];  // "example"

// Extract extension
let extension = domainPart.split(".")[1];  // "com"

console.log(username, domain, extension);
```

### Exercise 3: Template Literals
```javascript
// Create a greeting function that uses template literals
// Function should take name and age
// Output: "Hi, [name]! You are [age] years old."

function greetPerson(name, age) {
    // Your code
}

console.log(greetPerson("Alice", 30));
```

**Solution:**
```javascript
function greetPerson(name, age) {
    return `Hi, ${name}! You are ${age} years old.`;
}

console.log(greetPerson("Alice", 30));
// "Hi, Alice! You are 30 years old."
```

---

## Interview Questions

### Theoretical Questions

**Q1: What is the difference between slice() and substring()?**
A: Both extract substrings. `slice()` accepts negative indices (count from end), `substring()` doesn't. `slice()` preferred. If negative in substring, it converts to 0.

**Q2: Why are strings immutable in JavaScript?**
A: Strings are primitive values. When you "modify" a string, JavaScript creates a new string. This prevents unexpected side effects and allows string interning for memory efficiency.

**Q3: When should I use template literals?**
A: Always! They're cleaner for string interpolation, support multiline strings, and are easier to read than concatenation. Use them for all dynamic strings.

**Q4: What's the difference between includes() and indexOf()?**
A: `includes()` returns boolean (true/false), returns exact position (index or -1). `indexOf()` returns index position (useful when you need the position).

**Q5: Can I modify individual characters in a string?**
A: No, strings are immutable. `str[0] = 'x'` doesn't work. Convert to array, modify, convert back:
```javascript
let str = "hello";
let arr = str.split("");
arr[0] = "H";
str = arr.join("");  // "Hello"
```

---

## Code-Based Interview Questions

**Q1: What will be the output?**
```javascript
let str = "JavaScript";
console.log(str[0]);
console.log(str[-1]);
console.log(str[20]);
console.log(str.length);
```
A: 
```
"J"
undefined
undefined
10
```

**Q2: What will be the output?**
```javascript
let text = "HELLO";
console.log(text.toLowerCase().charAt(0));
console.log(text[0].toLowerCase());
console.log(text.slice(0, 2).toUpperCase());
```
A:
```
"h"
"h"
"HE"
```

**Q3: Predict the output:**
```javascript
console.log("5" + 3);           // ?
console.log("5" - 3);           // ?
console.log("5" * "2");         // ?
console.log("hello" - 5);       // ?
```
A:
```
"53"       // String concatenation
2          // Type coercion: "5" becomes 5
10         // Both coerce to numbers
NaN        // "hello" can't be coerced to number
```

**Q4: Fix the error:**
```javascript
let name = "John Doe";
let firstName = name.substring(0, name.indexOf(" "));
console.log(firstName);  // Should print "John"
// What if there's no space?
```
A: Code works. `indexOf(" ")` returns -1 if no space found, `substring(0, -1)` returns empty string. Better:
```javascript
let name = "John Doe";
let firstName = name.split(" ")[0];  // "John"
```

**Q5: What will be output?**
```javascript
let str = "   hello   ";
console.log(`"${str.trim()}"`);
console.log(str.length);
console.log(str.trim().length);
```
A:
```
"hello"
11
5
```

---

## Follow-up Questions & Confusing Concepts

**Q: What happens with string concatenation and type coercion?**
A: When using `+`, if either operand is string, both convert to string:
```javascript
"5" + 3        // "53" (number to string)
5 + "3"        // "53" (number to string)
5 + 3 + "2"    // "82" (5+3=8, then 8+"2"="82")
"5" + 3 + 2    // "532" (5+3="53", then 53+2="532")
```

**Q: Why does string[-1] return undefined?**
A: Negative indices work in arrays (ES2022+), but not strings. Use `str.slice(-1)` to get last character.

**Q: What's the performance difference between string concatenation methods?**
A: Template literals are fast. Loop concatenation with `+=` is slow in older engines (creates new string each time). Use `array.join()` for many concatenations.

**Q: Can I use template literals in all situations?**
A: Almost yes! Can't use in object keys without parentheses:
```javascript
let obj = {
    [`key_${1 + 2}`]: "value"  // OK with computed property
};
```

---

## Summary

- **Strings** are sequences of characters, immutable
- **Indexing**: `str[0]` gets first character, `str.length` for length
- **Methods**: `toUpperCase()`, `toLowerCase()`, `slice()`, `split()`, `replace()`, `includes()`, etc.
- **Template literals** (backticks) for string interpolation and multiline strings
- **Split/Join**: Convert between strings and arrays
- **Escape sequences**: `\n`, `\t`, `\"`, `\\`, etc.

**Next Step:** Learn about control flow and conditionals!
