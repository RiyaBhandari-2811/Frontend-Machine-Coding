# Operators & Control Flow in JavaScript

## Table of Contents
1. Arithmetic Operators
2. Comparison Operators
3. Logical Operators
4. Assignment Operators
5. Ternary Operator
6. Modern Operators (ES2020+)
7. If/Else Statements
8. Switch Statements
9. Comparison Quirks

---

## 1. Arithmetic Operators

### Basic Arithmetic
```javascript
console.log(5 + 3);      // 8 (addition)
console.log(5 - 3);      // 2 (subtraction)
console.log(5 * 3);      // 15 (multiplication)
console.log(5 / 2);      // 2.5 (division)
console.log(5 % 2);      // 1 (modulo/remainder)
console.log(2 ** 3);     // 8 (exponentiation)
```

### Modulo Operator
```javascript
console.log(10 % 3);     // 1
console.log(10 % 5);     // 0 (10 is divisible by 5)
console.log(-10 % 3);    // -1

// Practical uses:
// Check if even: num % 2 === 0
// Get last digit: num % 10
// Cycle through values: index % array.length
```

### Increment/Decrement
```javascript
let x = 5;

// Pre-increment (increment, then use)
console.log(++x);  // 6, x is now 6

// Post-increment (use, then increment)
let y = 5;
console.log(y++);  // 5, y is now 6

// Pre-decrement
console.log(--x);  // Decrement first
// Post-decrement
console.log(y--);  // Use first
```

---

## 2. Comparison Operators

### Basic Comparison
```javascript
console.log(5 > 3);      // true
console.log(5 < 3);      // false
console.log(5 >= 5);     // true
console.log(5 <= 3);     // false
console.log(5 == 5);     // true (equality, with type coercion)
console.log(5 != 5);     // false (inequality)
console.log(5 === 5);    // true (strict equality, no type coercion)
console.log(5 !== 5);    // false (strict inequality)
```

### == vs ===
```javascript
// == does type coercion (converts types)
console.log(5 == "5");        // true (converts string to number)
console.log(0 == false);      // true (false → 0)
console.log(null == undefined); // true (special case)

// === doesn't do type coercion
console.log(5 === "5");       // false (different types)
console.log(0 === false);     // false (different types)
console.log(null === undefined); // false (different types)

// BEST PRACTICE: Always use ===
```

### String Comparison
```javascript
console.log("a" < "b");       // true (alphabetical order)
console.log("apple" < "banana"); // true
console.log("Apple" < "apple"); // true (uppercase < lowercase)
console.log("10" > "2");      // false (string comparison: "1" < "2")
console.log(10 > "2");        // true (number comparison)
```

---

## 3. Logical Operators

### AND (&&)
```javascript
// Returns true only if both conditions are true
console.log(true && true);    // true
console.log(true && false);   // false
console.log(false && true);   // false
console.log(false && false);  // false

// Practical use
let age = 25;
let hasLicense = true;
if (age >= 18 && hasLicense) {
    console.log("Can drive");  // Prints
}

// Short-circuit evaluation (second operand not evaluated if not needed)
let x = 0;
console.log(false && (x = 5));  // false, x is still 0
```

### OR (||)
```javascript
// Returns true if at least one condition is true
console.log(true || false);   // true
console.log(false || false);  // false
console.log(false || true);   // true

// Practical use
let role = "user";
let isAdmin = false;
if (role === "admin" || isAdmin) {
    console.log("Has access");  // Won't print
}

// Default values (now better with nullish coalescing)
let name = userInput || "Guest";
```

### NOT (!)
```javascript
console.log(!true);           // false
console.log(!false);          // true
console.log(!0);              // true
console.log(!"");             // true
console.log(!"hello");        // false

// Practical use
let isLoggedIn = false;
if (!isLoggedIn) {
    console.log("Please log in");
}
```

### Truth-y and Falsy Values
```javascript
// Falsy values (convert to false):
console.log(Boolean(0));           // false
console.log(Boolean(""));          // false
console.log(Boolean(null));        // false
console.log(Boolean(undefined));   // false
console.log(Boolean(NaN));         // false
console.log(Boolean(false));       // false

// Truthy values (convert to true): everything else
console.log(Boolean(1));           // true
console.log(Boolean("hello"));     // true
console.log(Boolean([]));          // true
console.log(Boolean({}));          // true
console.log(Boolean(function(){})); // true
```

---

## 4. Assignment Operators

### Basic Assignment
```javascript
let x = 5;        // x = 5
x += 3;           // x = x + 3 → x = 8
x -= 2;           // x = x - 2 → x = 6
x *= 2;           // x = x * 2 → x = 12
x /= 3;           // x = x / 3 → x = 4
x %= 3;           // x = x % 3 → x = 1
x **= 2;          // x = x ** 2 → x = 1
```

---

## 5. Ternary Operator (Conditional Expression)

### Syntax
```javascript
// condition ? valueIfTrue : valueIfFalse
let age = 20;
let status = age >= 18 ? "Adult" : "Minor";
console.log(status);  // "Adult"

// Equivalent to:
let status2;
if (age >= 18) {
    status2 = "Adult";
} else {
    status2 = "Minor";
}
```

### Practical Examples
```javascript
// Get max of two numbers
let max = x > y ? x : y;

// Determine grade
let score = 85;
let grade = score >= 90 ? "A" : score >= 80 ? "B" : score >= 70 ? "C" : "F";

// Check if user has access
let hasAccess = isAdmin ? true : (isEditor ? true : false);
```

### Nested Ternary (avoid - use if/else for readability)
```javascript
// Hard to read
let result = x > 10 ? "big" : x > 5 ? "medium" : "small";

// Better readability
let result2;
if (x > 10) result2 = "big";
else if (x > 5) result2 = "medium";
else result2 = "small";
```

---

## 6. Modern Operators (ES2020+)

### Nullish Coalescing Operator (??)
```javascript
// ?? returns right operand if left is null or undefined
// Unlike || which checks for falsy values

let x = null;
let y = x ?? "default";
console.log(y);  // "default"

let a = 0;
let b = a ?? "default";
console.log(b);  // 0 (0 is not null/undefined)

let c = "";
let d = c ?? "default";
console.log(d);  // "" (empty string is not null/undefined)

// Practical use: provide default values
let userInput = null;
let value = userInput ?? "No input provided";

// vs OR operator
let name = userInput || "Guest";  // Also works, but treats 0, "", false as falsy
```

### Optional Chaining Operator (?.)
```javascript
// Safely access nested object properties without checking each level

let user = {
    name: "John",
    address: {
        city: "NYC"
    }
};

// Without optional chaining (error prone)
// let city = user.address.city;  // Works
// let zipCode = user.address.zipCode;  // undefined (safe)
// let country = user.country.name;  // ERROR: Cannot read property of undefined

// With optional chaining (safe)
let city = user?.address?.city;      // "NYC"
let zipCode = user?.address?.zipCode; // undefined (doesn't error)
let country = user?.country?.name;   // undefined (doesn't error)

// Optional chaining with function calls
let user2 = {
    getName() { return "John"; }
};

let name1 = user2?.getName?.();  // "John"
let name2 = user2?.getAge?.();   // undefined (doesn't error)

// Optional chaining with array/object access
let users = [{ name: "John" }, { name: "Jane" }];
let firstUser = users?.[0];      // { name: "John" }
let invalidUser = users?.[10];   // undefined

let obj = { key: "value" };
let val = obj?.["key"];          // "value"
let missing = obj?.["missing"];  // undefined
```

### Nullish Coalescing Assignment (??=)
```javascript
// Assigns only if variable is null or undefined

let x = null;
x ??= "default";
console.log(x);  // "default"

let y = 0;
y ??= "default";
console.log(y);  // 0 (0 is not null/undefined)

let z = "hello";
z ??= "default";
console.log(z);  // "hello"

// Practical use: set default values in objects
let config = {
    timeout: null,
    retries: 3
};

config.timeout ??= 5000;  // Sets timeout to 5000
config.retries ??= 1;     // Keeps retries as 3
```

### Logical Assignment Operators (&&= and ||=)
```javascript
// &&= assigns only if left operand is truthy
let x = 10;
x &&= 20;
console.log(x);  // 20 (x was truthy, so assigned)

let y = 0;
y &&= 20;
console.log(y);  // 0 (y was falsy, so not assigned)

// ||= assigns only if left operand is falsy
let a = null;
a ||= "default";
console.log(a);  // "default" (a was falsy)

let b = "hello";
b ||= "default";
console.log(b);  // "hello" (b was truthy)

// Practical use: conditional updates
let user = { isActive: true };
user.isActive &&= checkPermissions();  // Only call if isActive is true

let config = { timeout: null };
config.timeout ||= 5000;  // Set default if not set
```

### Comparison Table: ??, ||, and ?. 

| Operator | Use Case | Checks |
|----------|----------|--------|
| `??` | Default for null/undefined | Only null/undefined |
| `\|\|` | Default for any falsy | 0, "", false, null, undefined, NaN |
| `?.` | Safe property access | Returns undefined if left is null/undefined |

```javascript
// Example showing differences
let value = 0;

console.log(value || 10);    // 10 (treats 0 as falsy)
console.log(value ?? 10);    // 0 (treats 0 as valid)
console.log(value?.toString?.());  // "0" (safe access)
```

### Chaining Modern Operators
```javascript
// Combine multiple modern operators
let user = {
    profile: {
        name: "John"
    }
};

// Get nested value with defaults
let displayName = user?.profile?.name ?? "Guest";
console.log(displayName);  // "John"

// Get from API with defaults
let response = null;
let data = response?.data?.users ?? [];
console.log(data);  // []

// Safe function call with fallback
let result = user?.getAge?.() ?? 18;
console.log(result);  // 18 (if getAge doesn't exist)
```

---

## 7. If/Else Statements

### Basic Syntax
```javascript
if (condition) {
    // Execute if condition is true
}

if (condition) {
    // Execute if true
} else {
    // Execute if false
}

if (condition1) {
    // Execute if condition1 is true
} else if (condition2) {
    // Execute if condition1 is false but condition2 is true
} else {
    // Execute if all previous conditions are false
}
```

### Examples
```javascript
let age = 20;

if (age < 13) {
    console.log("Child");
} else if (age < 18) {
    console.log("Teen");
} else if (age < 65) {
    console.log("Adult");
} else {
    console.log("Senior");
}
// Output: "Adult"

// Checking multiple conditions
let temperature = 25;
let isRaining = false;

if (temperature > 20 && !isRaining) {
    console.log("Go outside");
} else if (temperature > 20 && isRaining) {
    console.log("Go outside with umbrella");
} else {
    console.log("Stay inside");
}
// Output: "Go outside"
```

---

## 7. Switch Statements

### Basic Syntax
```javascript
switch (expression) {
    case value1:
        // Execute if expression === value1
        break;
    case value2:
        // Execute if expression === value2
        break;
    default:
        // Execute if no case matches
}
```

### Examples
```javascript
let day = 3;
let dayName;

switch (day) {
    case 1:
        dayName = "Monday";
        break;
    case 2:
        dayName = "Tuesday";
        break;
    case 3:
        dayName = "Wednesday";
        break;
    default:
        dayName = "Invalid day";
}
console.log(dayName);  // "Wednesday"

// Grouping cases (fall-through)
let grade = "B";
switch (grade) {
    case "A":
    case "B":
        console.log("Excellent");
        break;
    case "C":
        console.log("Good");
        break;
    case "D":
    case "F":
        console.log("Needs improvement");
        break;
    default:
        console.log("Invalid grade");
}
// If grade is B: "Excellent"
```

### Switch vs If/Else
- Use switch for checking one value against multiple constants
- Use if/else for complex conditions or ranges
- Switch is cleaner for many equal comparisons

---

## Exercises

### Exercise 1: Calculator
```javascript
// Create a function that takes two numbers and an operator
// Return the result

function calculate(num1, operator, num2) {
    // Your code
}

console.log(calculate(5, "+", 3));  // 8
console.log(calculate(10, "-", 4)); // 6
console.log(calculate(6, "*", 2));  // 12
console.log(calculate(15, "/", 3)); // 5
```

**Solution:**
```javascript
function calculate(num1, operator, num2) {
    switch (operator) {
        case "+":
            return num1 + num2;
        case "-":
            return num1 - num2;
        case "*":
            return num1 * num2;
        case "/":
            return num1 / num2;
        default:
            return "Invalid operator";
    }
}
```

### Exercise 2: Grade Checker
```javascript
// Function that takes a score (0-100)
// Returns grade: A (90-100), B (80-89), C (70-79), F (below 70)

function getGrade(score) {
    // Your code
}

console.log(getGrade(95));  // "A"
console.log(getGrade(85));  // "B"
console.log(getGrade(75));  // "C"
console.log(getGrade(60));  // "F"
```

**Solution:**
```javascript
function getGrade(score) {
    if (score >= 90) return "A";
    if (score >= 80) return "B";
    if (score >= 70) return "C";
    return "F";
}
```

### Exercise 3: Even/Odd Checker
```javascript
// Function that returns if number is even or odd
// Use ternary operator

function checkEvenOdd(num) {
    // Your code
}

console.log(checkEvenOdd(4));   // "Even"
console.log(checkEvenOdd(7));   // "Odd"
```

**Solution:**
```javascript
function checkEvenOdd(num) {
    return num % 2 === 0 ? "Even" : "Odd";
}
```

---

## Interview Questions

### Theoretical Questions

**Q1: What's the difference between == and ===?**
A: `==` does type coercion (converts types before comparing), `===` doesn't. Always use `===` to avoid unexpected results.

**Q2: What are truthy and falsy values?**
A: Falsy: 0, "", null, undefined, NaN, false. Truthy: everything else. Important for conditional logic.

**Q3: Why should I use switch instead of multiple if/else?**
A: Switch is cleaner when checking one value against multiple constants. If/else better for complex conditions or ranges.

**Q4: What is short-circuit evaluation?**
A: In `&&`, if first operand is false, second isn't evaluated. In `||`, if first is true, second isn't evaluated. Improves performance and prevents errors.

**Q5: Can I mix multiple operators in one condition?**
A: Yes, with proper precedence: `!` > `&&` > `||`. Use parentheses for clarity.

---

## Code-Based Interview Questions

**Q1: What will be output?**
```javascript
let x = 5;
console.log(x++ + ++x);  // ?
```
A: 
```
12
```
Explanation: `x++` returns 5 (then x becomes 6), then `++x` increments x to 7, so 5 + 7 = 12

**Q2: Predict output:**
```javascript
console.log(0 == false);      // ?
console.log(0 === false);     // ?
console.log("" == false);     // ?
console.log("" === false);    // ?
```
A:
```
true
false
true
false
```

**Q3: What will be logged?**
```javascript
let age = 20;
console.log(age >= 18 ? "Adult" : age >= 13 ? "Teen" : "Child");  // ?
```
A: 
```
"Adult"
```

**Q4: Spot the error:**
```javascript
let x = 5;
switch (x) {
    case 5:
        console.log("Five");
    case 6:
        console.log("Six");
        break;
    default:
        console.log("Other");
}
```
A: Outputs "Five" and "Six" - missing `break` after case 5 (fall-through)

**Q5: What will be output?**
```javascript
console.log(5 > 3 && 2 < 4);       // ?
console.log(5 > 3 || 2 > 4);       // ?
console.log(!(5 > 10));            // ?
```
A:
```
true
true
true
```

---

## Follow-up Questions & Confusing Concepts

**Q: Why does "10" > "2" return false?**
A: Both are strings, so JavaScript does string comparison (not numeric). Character-by-character: "1" < "2" lexicographically. Convert to numbers to compare numerically: `+10 > +2`.

**Q: What happens with chained comparison like 5 < x < 10?**
A: First evaluates `5 < x` (true or false), then tries to compare true/false < 10, giving unexpected results. Use `x > 5 && x < 10` instead.

**Q: When should I use switch vs if/else?**
A: Switch for checking one value against many options. If/else for ranges or complex boolean logic.

**Q: Can switch use non-numeric values?**
A: Yes! Switch works with any expression: strings, booleans, objects, etc.

---

## Summary

- **Arithmetic**: `+`, `-`, `*`, `/`, `%`, `**`, `++`, `--`
- **Comparison**: `>`, `<`, `>=`, `<=`, `==`, `!=`, `===`, `!==` (use `===`)
- **Logical**: `&&` (AND), `||` (OR), `!` (NOT)
- **Ternary**: `condition ? ifTrue : ifFalse`
- **If/Else**: For ranges and complex logic
- **Switch**: For checking one value against many constants
- **Truthy/Falsy**: 0, "", null, undefined, NaN, false are falsy

**Next Step:** Learn about loops and iteration!
