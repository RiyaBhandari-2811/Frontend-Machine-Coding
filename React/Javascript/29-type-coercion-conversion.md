# Type Coercion & Conversion

## Table of Contents
1. Implicit Type Coercion
2. Explicit Type Conversion
3. String Coercion
4. Number Coercion
5. Boolean Coercion
6. Object Coercion
7. Comparison Coercion
8. Common Pitfalls
9. Best Practices

---

## 1. Implicit Type Coercion

### Automatic Conversions
```javascript
// JavaScript automatically converts types
// String concatenation coerces to string
console.log('5' + 3);                 // "53" (3 becomes string)
console.log('5' + true);              // "5true"
console.log('5' + null);              // "5null"
console.log('5' + undefined);         // "5undefined"

// Math operations coerce to number
console.log('5' - 2);                 // 3 (strings become numbers)
console.log('10' / '2');              // 5
console.log('10' * '2');              // 20
console.log('10' % '3');              // 1

// But addition is special (string concatenation priority)
console.log('5' + 2);                 // "52" (not 7!)
console.log(2 + '5');                 // "25"
```

### Order Matters with Addition
```javascript
// Addition checks for strings first
console.log(1 + 2 + '3');            // "33" (1 + 2 = 3, then "3" + "3")
console.log('3' + 1 + 2);            // "312" (3 + 1 = "31", then "31" + 2)

// vs other operators
console.log(1 + 2 * '3');            // 7 (multiply first: 2 * 3 = 6, then 1 + 6)
```

### Comparison Coercion
```javascript
// == allows type coercion
console.log(5 == '5');               // true (string becomes number)
console.log(0 == false);             // true (false becomes 0)
console.log(null == undefined);      // true (special rule)
console.log('0' == false);           // true (chain coercion)

// === doesn't coerce
console.log(5 === '5');              // false
console.log(0 === false);            // false
console.log(null === undefined);     // false
```

---

## 2. Explicit Type Conversion

### Convert to String
```javascript
// Method 1: String() constructor
console.log(String(42));             // "42"
console.log(String(true));           // "true"
console.log(String(null));           // "null"
console.log(String(undefined));      // "undefined"

// Method 2: toString()
console.log((42).toString());        // "42"
console.log(true.toString());        // "true"

// Method 3: Template literals
console.log(`${42}`);                // "42"
console.log(`${true}`);              // "true"

// Method 4: String concatenation
console.log(42 + '');                // "42"
console.log(true + '');              // "true"
```

### Convert to Number
```javascript
// Method 1: Number() constructor
console.log(Number('42'));           // 42
console.log(Number('3.14'));         // 3.14
console.log(Number(true));           // 1
console.log(Number(false));          // 0
console.log(Number(null));           // 0
console.log(Number(undefined));      // NaN

// Method 2: parseInt() - parses integer
console.log(parseInt('42'));         // 42
console.log(parseInt('3.14'));       // 3 (stops at decimal)
console.log(parseInt('0x10'));       // 16 (hex)

// Method 3: parseFloat() - parses decimal
console.log(parseFloat('3.14'));     // 3.14
console.log(parseFloat('3.14px'));   // 3.14 (ignores suffix)

// Method 4: Unary + operator
console.log(+'42');                  // 42
console.log(+true);                  // 1
console.log(+false);                 // 0
```

### Convert to Boolean
```javascript
// Method 1: Boolean() constructor
console.log(Boolean(42));            // true
console.log(Boolean(0));             // false
console.log(Boolean('hello'));       // true
console.log(Boolean(''));            // false
console.log(Boolean(null));          // false
console.log(Boolean(undefined));     // false

// Method 2: Double negation !!
console.log(!!42);                   // true
console.log(!!0);                    // false
console.log(!'hello');               // false

// Method 3: If statement (implicit)
if (42) {
    console.log('true');
}
```

---

## 3. String Coercion

### What Becomes String?
```javascript
// Truthiness of string coercion
// Numbers to strings
String(0);                           // "0"
String(42);                          // "42"
String(-3.14);                       // "-3.14"
String(Infinity);                    // "Infinity"
String(NaN);                         // "NaN"

// Booleans to strings
String(true);                        // "true"
String(false);                       // "false"

// Objects to strings
String({});                          // "[object Object]"
String([]);                          // "" (empty string!)
String([1, 2, 3]);                   // "1,2,3"
String(new Date());                  // Date string representation

// Special values
String(null);                        // "null"
String(undefined);                   // "undefined"
```

### Implicit String Coercion
```javascript
// Triggered by + with string
5 + 'hello';                         // "5hello"
true + ' value';                     // "true value"

// Triggered by template literals
`Number: ${42}`;                     // "Number: 42"
`Array: ${[1, 2, 3]}`;              // "Array: 1,2,3"

// toString() is called implicitly
let obj = { toString: () => 'Custom' };
console.log(obj + '');               // "Custom"
```

---

## 4. Number Coercion

### What Becomes Number?
```javascript
// String to number conversions
Number('42');                        // 42
Number('3.14');                      // 3.14
Number('  10  ');                    // 10 (whitespace ignored)
Number('');                          // 0 (empty string!)
Number('12px');                      // NaN (contains non-numeric chars)
Number('0x10');                      // 16 (hex)

// Boolean to number
Number(true);                        // 1
Number(false);                       // 0

// Objects to number (calls valueOf, then toString)
Number([]);                          // 0
Number(['5']);                       // 5
Number(['5', '10']);                 // NaN (multiple values)

// Null and undefined
Number(null);                        // 0
Number(undefined);                   // NaN
```

### Implicit Number Coercion
```javascript
// Math operators (except +) coerce to number
'10' - 5;                            // 5
'10' * 2;                            // 20
'10' / 2;                            // 5
'10' % 3;                            // 1

// Comparison operators
'5' > 3;                             // true (coerced to number)
'5' < '10';                          // false (string comparison!)

// Unary + coerces to number
+'42';                               // 42
+true;                               // 1
+false;                              // 0
```

---

## 5. Boolean Coercion

### Falsy Values
```javascript
// Only these are falsy:
Boolean(false);                      // false
Boolean(0);                          // false
Boolean(-0);                         // false
Boolean('');                         // false
Boolean(null);                       // false
Boolean(undefined);                  // false
Boolean(NaN);                        // false

// Everything else is truthy:
Boolean(42);                         // true
Boolean('0');                        // true (string "0" is truthy!)
Boolean([]);                         // true (empty array!)
Boolean({});                         // true (empty object!)
Boolean(new Date());                 // true
```

### Implicit Boolean Coercion
```javascript
// Logical operators
if (5) console.log('truthy');        // 5 is truthy
if ('0') console.log('truthy');      // '0' is truthy (string!)

// && and || operators
5 && console.log('yes');             // "yes"
0 && console.log('no');              // (not called)

// ! operator (negation)
!42;                                 // false
!'';                                 // true
```

---

## 6. Object Coercion

### Object to Primitive
```javascript
// When object is coerced, JavaScript tries:
// 1. valueOf() - returns primitive value
// 2. toString() - returns string representation

let obj = {
    valueOf: () => 42,
    toString: () => '[Custom Object]'
};

console.log(obj + 0);                // 42 (valueOf called)
console.log(obj + '');               // "42" (valueOf then toString)

// Without valueOf
let obj2 = {
    toString: () => 'Hello'
};

console.log(obj2 + '');              // "Hello"
```

### Array to Primitive
```javascript
// Arrays use toString by default
[].toString();                       // ""
[1, 2, 3].toString();                // "1,2,3"

// In coercion
[] + 0;                              // "0" ([] becomes "")
[1] + 0;                             // "10" ([1] becomes "1")
[1, 2] + 0;                          // "1,20"
```

---

## 7. Comparison Coercion

### == vs ===
```javascript
// == allows coercion (unpredictable)
5 == '5';                            // true
0 == false;                          // true
'' == false;                         // true
null == undefined;                   // true (special rule)
[] == '';                            // true

// === no coercion (predictable)
5 === '5';                           // false
0 === false;                         // false
[] === '';                           // false
null === undefined;                  // false
```

### Comparison with Different Types
```javascript
// String vs Number
'10' > '9';                          // false (string comparison)
'10' > 9;                            // true (number comparison)

// Boolean coerces to number
true > 0;                            // true (true is 1)
false < 1;                           // true (false is 0)

// Null and undefined
null == 0;                           // false (null doesn't equal 0!)
null < 1;                            // true (null coerces to 0)
undefined < 1;                       // false (undefined becomes NaN)
```

---

## 8. Common Pitfalls

### The Addition Trap
```javascript
// ✗ WRONG - Unexpected string concatenation
let result = 5 + 2 + '3';           // "73"
let result2 = '3' + 2 + 5;          // "325"

// ✓ CORRECT - Explicit conversion
let result3 = (5 + 2) + Number('3'); // 10

// ✗ WRONG - Relying on coercion
let total = 10 + 20 + userInput;    // Could be string!

// ✓ CORRECT - Explicit type check
let total2 = 10 + 20 + Number(userInput);
```

### Empty Array Truthiness
```javascript
// ✗ WRONG - Empty array is truthy!
if ([]) {
    console.log('Empty array is truthy');  // This runs!
}

// ✓ CORRECT - Explicit check
if (Array.isArray(arr) && arr.length > 0) {
    console.log('Non-empty array');
}
```

### String Zero is Truthy
```javascript
// ✗ WRONG - "0" is truthy, but 0 is falsy
if ('0') {
    console.log('String zero is truthy');  // This runs!
}

// ✓ CORRECT
if (Number('0')) {
    console.log('This does not run');
}
```

### Comparison Inconsistency
```javascript
// ✗ INCONSISTENT
[] == 0;                             // true
[] == false;                         // true
0 == false;                          // true
But:
[] == false;                         // false (!)

// ✓ Always use ===
[] === 0;                            // false
[] === false;                        // false
0 === false;                         // false
```

---

## 9. Best Practices

### Always Use ===
```javascript
// ✗ AVOID - Coercion causes bugs
if (x == 5) {}
if (x == true) {}

// ✓ PREFER - Explicit comparison
if (x === 5) {}
if (x === true) {}

// Use type checking if needed
if (typeof x === 'number' && x === 5) {}
```

### Explicit Conversions
```javascript
// ✗ AVOID - Relying on implicit coercion
let total = price + quantity + tax;

// ✓ EXPLICIT - Clear intent
let total = Number(price) + Number(quantity) + Number(tax);

// ✗ AVOID - Trusting coercion
if (userInput) {
    return parseInt(userInput);
}

// ✓ EXPLICIT - Type safe
if (userInput && typeof userInput === 'string') {
    return parseInt(userInput, 10);  // Specify radix
}
```

### Create Type Guard Functions
```javascript
// Utility functions for consistent conversions
const toNumber = (value) => {
    let num = Number(value);
    return isNaN(num) ? 0 : num;
};

const toString = (value) => {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    return String(value);
};

const toBoolean = (value) => Boolean(value);

// Use consistently
let count = toNumber(userInput);
let display = toString(value);
let isActive = toBoolean(flag);
```

---

## Exercises

### Exercise 1: Safe Number Parsing
```javascript
// Parse number safely
function safeParseNumber(value) {
    // Your code
}

console.log(safeParseNumber('42'));       // 42
console.log(safeParseNumber('3.14'));     // 3.14
console.log(safeParseNumber('invalid'));  // 0 (default)
```

**Solution:**
```javascript
function safeParseNumber(value) {
    let num = Number(value);
    return isNaN(num) ? 0 : num;
}
```

### Exercise 2: Type Converter
```javascript
// Convert value to specified type
function convert(value, type) {
    // Your code
}

console.log(convert('42', 'number'));     // 42
console.log(convert(42, 'string'));       // "42"
console.log(convert('true', 'boolean'));  // true
```

**Solution:**
```javascript
function convert(value, type) {
    switch (type) {
        case 'number':
            return Number(value);
        case 'string':
            return String(value);
        case 'boolean':
            return Boolean(value);
        default:
            return value;
    }
}
```

### Exercise 3: Check Truthy Values
```javascript
// Count truthy values
function countTruthy(values) {
    // Your code
}

console.log(countTruthy([0, '0', '', false, null, undefined, 42])); // 2
```

**Solution:**
```javascript
function countTruthy(values) {
    return values.filter(v => !!v).length;
}
```

---

## Interview Questions

### Theoretical Questions

**Q1: What is the difference between == and ===?**
A: == allows type coercion. === requires same type.

**Q2: What values are falsy?**
A: false, 0, '', null, undefined, NaN

**Q3: What does empty array coerce to?**
A: Empty string when string coerced, 0 when number coerced.

**Q4: Why is "0" truthy but 0 is falsy?**
A: Non-empty strings are truthy. 0 is a falsy number.

**Q5: What is the result of null == undefined?**
A: true (special coercion rule).

---

## Code-Based Interview Questions

**Q1: What will be output?**
```javascript
console.log(5 + '5');  // ?
```
A:
```
"55"
```

**Q2: Predict:**
```javascript
console.log('5' - 2);  // ?
```
A:
```
3
```

**Q3: What will be logged?**
```javascript
console.log(Boolean([]));  // ?
```
A:
```
true
```

**Q4: Spot the issue:**
```javascript
if (userInput == 0) {  // Should use ===
    console.log('User is zero');
}
```
A: Use === to avoid unexpected coercion.

**Q5: What is output?**
```javascript
console.log(null == undefined);  // ?
```
A:
```
true
```

---

## Follow-up Questions & Confusing Concepts

**Q: Does array == false ever true?**
A: Yes! [] == false is true due to coercion chain.

**Q: Can you force number coercion?**
A: Use Number(), parseInt(), parseFloat(), or unary +.

**Q: What about object coercion?**
A: Calls valueOf() first, then toString() if needed.

**Q: Is "0" == true or false?**
A: "0" == false is true (chain coercion).

---

## Summary

- **== vs ===**: == coerces, === doesn't (always use ===)
- **Falsy values**: false, 0, '', null, undefined, NaN
- **String coercion**: String(), toString(), or template literals
- **Number coercion**: Number(), parseInt(), parseFloat(), or unary +
- **Boolean coercion**: Boolean() or !! operator
- **Addition is special**: + with string does concatenation
- **Array coercion**: [] becomes "" as string, 0 as number
- **Comparison coercion**: Unpredictable with ==, avoid it
- **Object coercion**: Tries valueOf() then toString()
- **Best practice**: Use explicit conversions, always use ===

**Next Step:** Learn strict mode and its implications for code quality!
