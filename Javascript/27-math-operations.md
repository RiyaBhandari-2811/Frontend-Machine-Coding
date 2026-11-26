# Math Operations & Methods

## Table of Contents
1. Math Object Properties
2. Basic Math Methods
3. Rounding Methods
4. Random Numbers
5. Trigonometric Functions
6. Power & Root Operations
7. Min & Max Operations
8. Common Math Patterns
9. Best Practices

---

## 1. Math Object Properties

### Mathematical Constants
```javascript
// PI - Ratio of circle circumference to diameter
console.log(Math.PI);        // 3.141592653589793

// E - Euler's number (base of natural logarithm)
console.log(Math.E);         // 2.718281828459045

// LN2 - Natural log of 2
console.log(Math.LN2);       // 0.6931471805599453

// LN10 - Natural log of 10
console.log(Math.LN10);      // 2.302585092994046

// LOG2E - Base 2 logarithm of E
console.log(Math.LOG2E);     // 1.4426950408889634

// LOG10E - Base 10 logarithm of E
console.log(Math.LOG10E);    // 0.4342944819032518

// SQRT2 - Square root of 2
console.log(Math.SQRT2);     // 1.4142135623730951

// SQRT1_2 - Square root of 1/2
console.log(Math.SQRT1_2);   // 0.7071067811865476
```

---

## 2. Basic Math Methods

### Absolute Value
```javascript
// Return positive value
console.log(Math.abs(5));      // 5
console.log(Math.abs(-5));     // 5
console.log(Math.abs(-3.14));  // 3.14

// Practical use: Distance
let distance = Math.abs(x1 - x2);
console.log(distance);
```

### Power Operations
```javascript
// Power: a^b
console.log(Math.pow(2, 3));      // 8 (2^3)
console.log(Math.pow(5, 2));      // 25 (5^2)
console.log(Math.pow(2, -1));     // 0.5 (2^-1)
console.log(Math.pow(16, 0.5));   // 4 (square root)

// Square operator (more readable)
console.log(2 ** 3);  // 8
console.log(5 ** 2);  // 25
```

### Square Root
```javascript
// Square root
console.log(Math.sqrt(9));       // 3
console.log(Math.sqrt(16));      // 4
console.log(Math.sqrt(2));       // 1.4142135623730951

// Cube root (using pow)
console.log(Math.pow(8, 1/3));   // 2 (cube root of 8)
console.log(Math.pow(27, 1/3));  // 3 (cube root of 27)
```

---

## 3. Rounding Methods

### Floor (Round Down)
```javascript
// Round down to nearest integer
console.log(Math.floor(4.7));    // 4
console.log(Math.floor(4.2));    // 4
console.log(Math.floor(-4.7));   // -5 (rounds toward negative infinity)

// Use case: Get integer part
let decimal = 3.14159;
let integer = Math.floor(decimal);
console.log(integer);  // 3
```

### Ceil (Round Up)
```javascript
// Round up to nearest integer
console.log(Math.ceil(4.1));     // 5
console.log(Math.ceil(4.7));     // 5
console.log(Math.ceil(-4.1));    // -4 (rounds toward positive infinity)

// Use case: Pagination
let totalItems = 23;
let itemsPerPage = 10;
let pages = Math.ceil(totalItems / itemsPerPage);
console.log(pages);  // 3
```

### Round (Nearest Integer)
```javascript
// Round to nearest integer
console.log(Math.round(4.4));    // 4
console.log(Math.round(4.5));    // 5 (rounds half up)
console.log(Math.round(-4.5));   // -4 (banker's rounding)

// Round to decimal places
function roundTo(num, decimals) {
    let factor = Math.pow(10, decimals);
    return Math.round(num * factor) / factor;
}

console.log(roundTo(3.14159, 2));  // 3.14
console.log(roundTo(3.14159, 3));  // 3.142
```

### Truncate (Remove Decimals)
```javascript
// Remove decimal part
console.log(Math.trunc(4.7));    // 4
console.log(Math.trunc(-4.7));   // -4

// vs Math.floor()
console.log(Math.floor(-4.7));   // -5
console.log(Math.trunc(-4.7));   // -4 (difference!)

// Use case: Convert to integer without rounding
let value = 42.999;
console.log(Math.trunc(value));  // 42 (not 43)
```

---

## 4. Random Numbers

### Basic Random
```javascript
// Random number 0 (inclusive) to 1 (exclusive)
console.log(Math.random());  // e.g., 0.7234891824123

// Random integer 0-9
let randomInt = Math.floor(Math.random() * 10);
console.log(randomInt);  // 0-9

// Random integer 1-10
let randomInt1To10 = Math.floor(Math.random() * 10) + 1;
console.log(randomInt1To10);  // 1-10
```

### Random Range Function
```javascript
// Random integer in range [min, max]
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

console.log(randomInt(1, 10));     // 1-10
console.log(randomInt(50, 100));   // 50-100
console.log(randomInt(-5, 5));     // -5 to 5

// Random decimal in range
function randomDecimal(min, max) {
    return Math.random() * (max - min) + min;
}

console.log(randomDecimal(0, 1));    // 0 to 1
console.log(randomDecimal(10, 20));  // 10 to 20
```

### Random Array Element
```javascript
let arr = ['apple', 'banana', 'orange', 'grape'];

function randomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

console.log(randomElement(arr));  // Random element

// Or using crypto (more secure for sensitive data)
// But Math.random is fine for general use
```

---

## 5. Trigonometric Functions

### Sine, Cosine, Tangent
```javascript
// Trigonometric functions (input in radians!)
console.log(Math.sin(0));           // 0
console.log(Math.sin(Math.PI / 2)); // 1

console.log(Math.cos(0));           // 1
console.log(Math.cos(Math.PI));     // -1

console.log(Math.tan(0));           // 0
console.log(Math.tan(Math.PI / 4)); // 1

// Convert degrees to radians
function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
}

// Convert radians to degrees
function radiansToDegrees(radians) {
    return radians * (180 / Math.PI);
}

console.log(Math.sin(degreesToRadians(90)));  // 1
```

### Inverse Trigonometric
```javascript
// Arcsine, Arccosine, Arctangent
console.log(Math.asin(0));     // 0
console.log(Math.asin(1));     // PI/2 (90 degrees)

console.log(Math.acos(0));     // PI/2
console.log(Math.acos(1));     // 0

console.log(Math.atan(0));     // 0
console.log(Math.atan(1));     // PI/4 (45 degrees)

// atan2(y, x) - angle between point and origin
console.log(Math.atan2(1, 1));  // PI/4 (45 degrees)
```

---

## 6. Power & Root Operations

### Exponential Functions
```javascript
// e^x (exponential)
console.log(Math.exp(0));  // 1
console.log(Math.exp(1));  // 2.718281828459045 (e)
console.log(Math.exp(2));  // 7.389056098930652

// Natural logarithm (base e)
console.log(Math.log(1));       // 0
console.log(Math.log(Math.E));  // 1
console.log(Math.log(10));      // 2.302585092994046

// Logarithm base 10
console.log(Math.log10(1));     // 0
console.log(Math.log10(10));    // 1
console.log(Math.log10(100));   // 2

// Logarithm base 2
console.log(Math.log2(1));      // 0
console.log(Math.log2(2));      // 1
console.log(Math.log2(8));      // 3
```

### Hyperbolic Functions
```javascript
// Sinh, Cosh, Tanh
console.log(Math.sinh(0));  // 0
console.log(Math.cosh(0));  // 1
console.log(Math.tanh(0));  // 0

// Use case: Physics, engineering calculations
```

---

## 7. Min & Max Operations

### Min & Max Values
```javascript
// Maximum value
console.log(Math.max(1, 2, 3, 4, 5));           // 5
console.log(Math.max(-1, -10, -5));             // -1
console.log(Math.max());                        // -Infinity

// Minimum value
console.log(Math.min(1, 2, 3, 4, 5));           // 1
console.log(Math.min(-1, -10, -5));             // -10
console.log(Math.min());                        // Infinity

// With arrays (use spread operator)
let arr = [5, 2, 8, 1, 9];
console.log(Math.max(...arr));  // 9
console.log(Math.min(...arr));  // 1
```

### Clamp Value
```javascript
// Clamp value between min and max
function clamp(value, min, max) {
    return Math.max(min, Math.min(value, max));
}

console.log(clamp(5, 0, 10));      // 5
console.log(clamp(15, 0, 10));     // 10
console.log(clamp(-5, 0, 10));     // 0

// Use case: Constraining slider values, volume, opacity
let volume = clamp(userInput, 0, 100);
```

### Sign Function
```javascript
// Get sign of number (-1, 0, or 1)
console.log(Math.sign(10));    // 1
console.log(Math.sign(-10));   // -1
console.log(Math.sign(0));     // 0
console.log(Math.sign(-0));    // -0

// Use case: Determine direction
let direction = Math.sign(x - previousX);  // 1, -1, or 0
```

---

## 8. Common Math Patterns

### Distance Between Points
```javascript
// Distance formula: sqrt((x2-x1)^2 + (y2-y1)^2)
function distance(x1, y1, x2, y2) {
    let dx = x2 - x1;
    let dy = y2 - y1;
    return Math.sqrt(dx * dx + dy * dy);
}

console.log(distance(0, 0, 3, 4));  // 5 (3-4-5 triangle)
```

### Percentage Calculations
```javascript
// Calculate percentage
function percentage(value, total) {
    return (value / total) * 100;
}

console.log(percentage(25, 100));  // 25%

// Increase by percentage
function increaseByPercent(value, percent) {
    return value * (1 + percent / 100);
}

console.log(increaseByPercent(100, 10));  // 110

// Decrease by percentage
function decreaseByPercent(value, percent) {
    return value * (1 - percent / 100);
}

console.log(decreaseByPercent(100, 10));  // 90
```

### Random in Range with Distribution
```javascript
// Gaussian (bell curve) random
function gaussianRandom() {
    let u1 = Math.random();
    let u2 = Math.random();
    return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

console.log(gaussianRandom());  // Gaussian distribution
```

---

## 9. Best Practices

### Understand Floating Point
```javascript
// Floating point precision issues
console.log(0.1 + 0.2);        // 0.30000000000000004 (not 0.3)
console.log(0.1 + 0.2 === 0.3);  // false

// Solution: Compare with epsilon
function isEqual(a, b, epsilon = 0.00001) {
    return Math.abs(a - b) < epsilon;
}

console.log(isEqual(0.1 + 0.2, 0.3));  // true
```

### Use Appropriate Methods
```javascript
// ✓ GOOD - Clear intent
let roundedPrice = Math.round(price * 100) / 100;

// ✗ WRONG - Complex and hard to read
let wrongPrice = Math.floor(price * 100 + 0.5) / 100;

// ✓ GOOD - Use specific methods
let pages = Math.ceil(total / perPage);  // For pagination

// ✗ WRONG - Unclear calculation
let wrongPages = Math.floor(total / perPage + 0.9999);
```

### For Complex Calculations
```javascript
// Consider library for complex math
// - Complex numbers
// - Matrix operations
// - Statistics
// Use: math.js, numeric.js, etc.

// But JavaScript Math is enough for:
// - Basic arithmetic
// - Geometry
// - Trigonometry
// - Random numbers
```

---

## Exercises

### Exercise 1: Temperature Converter
```javascript
// Convert between Celsius and Fahrenheit
function celsiusToFahrenheit(celsius) {
    // Your code
}

function fahrenheitToCelsius(fahrenheit) {
    // Your code
}

console.log(celsiusToFahrenheit(0));    // 32
console.log(fahrenheitToCelsius(32));   // 0
```

**Solution:**
```javascript
function celsiusToFahrenheit(celsius) {
    return (celsius * 9/5) + 32;
}

function fahrenheitToCelsius(fahrenheit) {
    return (fahrenheit - 32) * 5/9;
}
```

### Exercise 2: Dice Roll
```javascript
// Simulate dice roll (1-6)
function rollDice() {
    // Your code
}

console.log(rollDice());  // Random 1-6
```

**Solution:**
```javascript
function rollDice() {
    return Math.floor(Math.random() * 6) + 1;
}
```

### Exercise 3: Average & Rounding
```javascript
// Calculate average and round to 2 decimals
function roundedAverage(numbers) {
    // Your code
}

console.log(roundedAverage([10.5, 20.3, 15.7]));  // 15.5
```

**Solution:**
```javascript
function roundedAverage(numbers) {
    let sum = numbers.reduce((a, b) => a + b, 0);
    let avg = sum / numbers.length;
    return Math.round(avg * 100) / 100;
}
```

---

## Interview Questions

### Theoretical Questions

**Q1: What's the difference between Math.floor and Math.trunc?**
A: floor rounds toward negative infinity. trunc removes decimal part.

**Q2: How do you generate random integer in range?**
A: Math.floor(Math.random() * (max - min + 1)) + min

**Q3: What is floating point precision issue?**
A: 0.1 + 0.2 ≠ 0.3 due to binary representation.

**Q4: How do you convert degrees to radians?**
A: degrees * (Math.PI / 180)

**Q5: What is Math.sign used for?**
A: Returns -1, 0, or 1 to indicate number's sign.

---

## Code-Based Interview Questions

**Q1: What will be output?**
```javascript
console.log(Math.floor(4.9));  // ?
```
A:
```
4
```

**Q2: Predict:**
```javascript
console.log(Math.max(1, 2, 3));  // ?
```
A:
```
3
```

**Q3: What will be logged?**
```javascript
console.log(Math.round(2.5));  // ?
```
A:
```
2 or 3
(Implementation dependent, usually 3)
```

**Q4: Spot the issue:**
```javascript
let randomInt = Math.random() * 10;  // Returns decimal, not integer!
```
A: Use Math.floor() to convert to integer.

**Q5: What is output?**
```javascript
console.log(Math.sqrt(16));  // ?
```
A:
```
4
```

---

## Follow-up Questions & Confusing Concepts

**Q: Does Math.random ever return exactly 1?**
A: No, it returns [0, 1) - never includes 1.

**Q: Why does Math.round use banker's rounding?**
A: Implementation detail, affects .5 values.

**Q: Can I use Math for security-related randomness?**
A: No, use crypto.getRandomValues() for security.

**Q: What's Math.sign(-0)?**
A: Returns -0, not 0 (negative zero edge case).

---

## Summary

- **Constants**: PI, E, LN2, LN10, SQRT2
- **Rounding**: floor(), ceil(), round(), trunc()
- **Random**: random() returns [0, 1), use formulas for ranges
- **Powers**: pow(), **, sqrt()
- **Trigonometry**: sin(), cos(), tan(), and inverse functions
- **Logarithms**: log(), log10(), log2()
- **Min/Max**: max(), min(), sign()
- **Precision**: Watch out for floating point errors
- **Best practice**: Use libraries for complex math
- **Security**: Use crypto.getRandomValues() for secure randomness

**Next Step:** Master type checking with typeof and instanceof operators!
