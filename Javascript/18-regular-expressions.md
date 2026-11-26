# Regular Expressions (Regex)

## Table of Contents
1. Introduction to Regex
2. Pattern Syntax
3. Regex Methods
4. String Methods with Regex
5. Regex Flags
6. Character Classes
7. Quantifiers
8. Groups and Capturing
9. Common Patterns

---

## 1. Introduction to Regex

### What are Regular Expressions?
- **Regex**: Pattern matching and text manipulation
- Match, search, replace, validate text
- Powerful but can be complex
- Used across many languages

### Creating Regex
```javascript
// Two ways to create regex

// 1. Regex literal (preferred)
let pattern1 = /hello/;
let pattern2 = /[0-9]+/;
let pattern3 = /test/gi;  // With flags

// 2. RegExp constructor
let pattern4 = new RegExp('hello');
let pattern5 = new RegExp('[0-9]+');
let pattern6 = new RegExp('test', 'gi');  // Constructor: pattern, flags

// Same thing, different syntax
console.log(/hello/);     // /hello/
console.log(new RegExp('hello'));  // /hello/
```

---

## 2. Pattern Syntax

### Literal Characters
```javascript
// Match exact text
let pattern = /hello/;
console.log(pattern.test('hello world'));    // true
console.log(pattern.test('goodbye'));        // false

// Numbers as literals
let number = /42/;
console.log(number.test('The answer is 42')); // true

// Special characters need escaping
let dot = /\./;  // Matches literal dot
console.log(dot.test('3.14'));  // true
console.log(dot.test('314'));   // false
```

### Metacharacters
```javascript
// . - Any character (except newline)
let any = /a.b/;
console.log(any.test('aab'));   // true
console.log(any.test('a-b'));   // true
console.log(any.test('ab'));    // false (needs character between)

// ^ - Start of string
let start = /^hello/;
console.log(start.test('hello world'));  // true
console.log(start.test('say hello'));    // false

// $ - End of string
let end = /world$/;
console.log(end.test('hello world'));  // true
console.log(end.test('world of pain')); // false

// * - Zero or more (of previous char)
let star = /lo*/;  // l, l, ll, lll, etc.
console.log(star.test('l'));     // true
console.log(star.test('lol'));   // true
console.log(star.test('loooool'));  // true
```

---

## 3. Regex Methods

### test() - Check if Pattern Matches
```javascript
let pattern = /hello/;

console.log(pattern.test('hello world'));  // true
console.log(pattern.test('goodbye'));      // false

// Works with case-sensitive by default
let lowerCase = /hello/;
console.log(lowerCase.test('HELLO'));  // false

// Use flag for case-insensitive
let caseInsensitive = /hello/i;
console.log(caseInsensitive.test('HELLO'));  // true
```

### exec() - Get Match Details
```javascript
let pattern = /a(.)\1/;  // 'a' followed by any char repeated
let str = 'aabbcc';

let result = pattern.exec(str);
console.log(result);
// [
//   '0': 'aa',      // Full match
//   '1': 'a',       // Captured group
//   index: 0,       // Position
//   input: 'aabbcc',
//   groups: undefined
// ]

// If no match
let noMatch = /x/.exec('aabbcc');
console.log(noMatch);  // null
```

---

## 4. String Methods with Regex

### match() - Get All Matches
```javascript
let str = 'The numbers are 42, 100, and 7';

// Without global flag - first match only
let first = str.match(/\d+/);
console.log(first[0]);  // '42'

// With global flag - all matches
let all = str.match(/\d+/g);
console.log(all);  // ['42', '100', '7']

// No match returns null
let noMatch = str.match(/x/);
console.log(noMatch);  // null
```

### search() - Find Index
```javascript
let str = 'hello world';

console.log(str.search(/world/));      // 6 (index where 'world' starts)
console.log(str.search(/hello/));      // 0
console.log(str.search(/xyz/));        // -1 (not found)

// vs indexOf
console.log(str.indexOf('world'));     // 6 (same result)
// But search() can use patterns!
console.log(str.search(/\w+o/));       // 4 (word chars ending in 'o')
```

### replace() - Replace Matches
```javascript
let str = 'The price is $5';

// Replace first match
console.log(str.replace(/\$/, '€'));  // 'The price is €5'

// Replace all matches with global flag
let str2 = 'cat bat cat';
console.log(str2.replace(/at/g, 'ath'));  // 'cath bath cath'

// Replace with function
let str3 = 'I have 2 apples and 3 oranges';
let result = str3.replace(/\d+/g, (match) => {
    return parseInt(match) * 2;
});
console.log(result);  // 'I have 4 apples and 6 oranges'
```

### split() - Split by Pattern
```javascript
let str = 'apple, orange; banana: grape';

// Split by comma or semicolon
let fruits = str.split(/[,;:]/);
console.log(fruits);  // ['apple', ' orange', ' banana', ' grape']

// With numbers
let str2 = 'abc123def456ghi';
let parts = str2.split(/\d+/);
console.log(parts);  // ['abc', 'def', 'ghi']
```

---

## 5. Regex Flags

### Flag Types
```javascript
let pattern = /hello/gi;
//           ^^ Flags

// g - global (all matches, not just first)
let global = /a/g;
console.log('banana'.match(global));  // ['a', 'a', 'a']

// i - case-insensitive
let insensitive = /hello/i;
console.log(insensitive.test('HELLO'));  // true

// m - multiline (^ and $ match line boundaries)
let multiline = /^test/m;

// u - unicode
let unicode = /./u;

// s - dot matches newlines too
let dotAll = /a.b/s;
console.log(dotAll.test('a\nb'));  // true with 's'

// Combine flags
let combined = /test/gim;  // global, insensitive, multiline
```

---

## 6. Character Classes

### Brackets [ ]
```javascript
// [abc] - Matches a, b, or c
let vowel = /[aeiou]/;
console.log(vowel.test('hello'));  // true (matches 'e')

// [a-z] - Matches any lowercase letter
let lower = /[a-z]/;
console.log(lower.test('Hello'));  // true (matches 'e', 'l', 'l', 'o')

// [0-9] - Matches any digit
let digit = /[0-9]/;
console.log(digit.test('abc123'));  // true

// [^...] - NOT these characters
let notVowel = /[^aeiou]/;
console.log(notVowel.test('hello'));  // true (matches 'h', 'l', 'l')
```

### Shorthand Classes
```javascript
// \d - Digit (0-9)
let digit = /\d+/;
console.log(digit.test('The price is 42'));  // true

// \D - Not a digit
let nonDigit = /\D+/;
console.log(nonDigit.test('123'));  // false
console.log(nonDigit.test('abc'));  // true

// \w - Word character (a-z, A-Z, 0-9, _)
let word = /\w+/;
console.log(word.test('hello_123'));  // true

// \W - Not word character
let nonWord = /\W/;
console.log(nonWord.test('hello@world'));  // true (matches @)

// \s - Whitespace (space, tab, newline)
let space = /\s/;
console.log(space.test('hello world'));  // true

// \S - Not whitespace
let nonSpace = /\S/;
console.log(nonSpace.test('hello'));  // true
```

---

## 7. Quantifiers

### Repetition
```javascript
// * - Zero or more
let star = /ab*/;
console.log(star.test('a'));      // true
console.log(star.test('abb'));    // true
console.log(star.test('abbbb'));  // true

// + - One or more
let plus = /ab+/;
console.log(plus.test('a'));      // false
console.log(plus.test('ab'));     // true
console.log(plus.test('abbbb'));  // true

// ? - Zero or one (optional)
let question = /ab?/;
console.log(question.test('a'));   // true
console.log(question.test('ab'));  // true
console.log(question.test('abb')); // true (matches 'ab')

// {n} - Exactly n
let exact = /a{3}/;
console.log(exact.test('aaa'));   // true
console.log(exact.test('aaaa'));  // true (matches first 'aaa')
console.log(exact.test('aa'));    // false

// {n,m} - Between n and m
let range = /a{2,4}/;
console.log(range.test('aa'));    // true
console.log(range.test('aaa'));   // true
console.log(range.test('aaaaa'));  // true (matches 'aaaa')
```

---

## 8. Groups and Capturing

### Parentheses ()
```javascript
// Group characters
let group = /(ab)+/;  // 'ab' repeated
console.log(group.test('ab'));      // true
console.log(group.test('abab'));    // true
console.log(group.test('ababab'));  // true

// Capturing groups
let pattern = /(\w+)@(\w+)/;
let email = 'john@example.com';

let match = pattern.exec(email);
console.log(match[0]);  // 'john@example'
console.log(match[1]);  // 'john'
console.log(match[2]);  // 'example'

// In replace() with $1, $2
let url = 'example@domain.com';
console.log(url.replace(/(\w+)@(\w+)/, '$2/$1'));
// 'domain/example'
```

### Non-capturing Groups
```javascript
// (?:...) - Don't capture
let pattern = /(?:ab)+/;  // Same as (ab)+ but doesn't capture
let match = pattern.exec('ababab');
console.log(match[1]);  // undefined (not captured)

// Useful for efficiency
let email = /(?:john|jane)@example/;
console.log(email.test('john@example'));  // true
console.log(email.test('jane@example'));  // true
```

---

## 9. Common Patterns

### Email Validation
```javascript
// Basic email pattern
let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
console.log(emailPattern.test('john@example.com'));  // true
console.log(emailPattern.test('invalid.email'));      // false

// Better pattern (still simplified)
let email = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
```

### Phone Number
```javascript
// US phone: (123) 456-7890 or 123-456-7890
let phone = /^\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})$/;
console.log(phone.test('(555) 123-4567'));  // true
console.log(phone.test('555-123-4567'));    // true
```

### URL Validation
```javascript
// Simple URL pattern
let url = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/.*)?$/;
console.log(url.test('https://example.com'));  // true
console.log(url.test('example.com'));          // true
console.log(url.test('example'));              // false
```

### Password Validation
```javascript
// At least 8 chars, 1 uppercase, 1 lowercase, 1 digit
let password = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
console.log(password.test('MyPass123'));  // true
console.log(password.test('mypass123'));  // false (no uppercase)
```

### HTML Tag Removal
```javascript
let html = '<p>Hello <b>world</b></p>';
let clean = html.replace(/<[^>]*>/g, '');
console.log(clean);  // 'Hello world'
```

---

## Exercises

### Exercise 1: Extract Numbers
```javascript
// Extract all numbers from string
let str = 'Item 1 costs $5.99, Item 2 costs $10.50';

// Your code
// Should return: ['1', '5', '99', '2', '10', '50'] or similar
```

**Solution:**
```javascript
let numbers = str.match(/\d+/g);
console.log(numbers);  // ['1', '5', '99', '2', '10', '50']
```

### Exercise 2: Validate Email
```javascript
// Create function to validate email
function isValidEmail(email) {
    // Your code
}

console.log(isValidEmail('john@example.com'));  // true
console.log(isValidEmail('invalid.email'));     // false
```

**Solution:**
```javascript
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
```

### Exercise 3: Replace Pattern
```javascript
// Replace phone number format
let phone = '5551234567';
// Should become: (555) 123-4567

// Your code
```

**Solution:**
```javascript
let formatted = phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
console.log(formatted);  // (555) 123-4567
```

---

## Interview Questions

### Theoretical Questions

**Q1: What's the difference between . and \w in regex?**
A: . matches any character (except newline), \w matches word characters (a-z, A-Z, 0-9, _).

**Q2: What does /g flag do?**
A: Global - finds all matches, not just first. Without /g, only first match found.

**Q3: What's the difference between test() and exec()?**
A: test() returns boolean. exec() returns match object with details or null.

**Q4: When would I use capturing groups?**
A: To extract specific parts of match, or use in replace() with $1, $2 references.

**Q5: What's difference between * and +?**
A: * matches zero or more, + matches one or more. * can match empty.

---

## Code-Based Interview Questions

**Q1: What will be output?**
```javascript
let pattern = /hello/i;
console.log(pattern.test('HELLO'));  // ?
```
A:
```
true
```

**Q2: Predict:**
```javascript
let str = 'The numbers are 1, 2, 3';
console.log(str.match(/\d/));  // ?
```
A:
```
['1']
```
Explanation: No global flag, only first match

**Q3: What will be logged?**
```javascript
let str = 'aabbcc';
console.log(str.match(/a./g));  // ?
```
A:
```
['ab']
```

**Q4: Spot the issue:**
```javascript
let pattern = /(abc)*/;  // Captures 'abc' or nothing
console.log(pattern.exec(''));  // Matches empty string!
```
A: * allows zero matches. Use + or ? for different behavior.

**Q5: What is output?**
```javascript
let str = 'john@example.com';
console.log(str.replace(/(.+)@(.+)/, '$2-$1'));  // ?
```
A:
```
"example.com-john"
```

---

## Follow-up Questions & Confusing Concepts

**Q: Are regex expressions case-sensitive by default?**
A: Yes, unless /i flag used.

**Q: What's the performance cost of complex regex?**
A: Can be expensive for large strings or complex patterns. Test performance if needed.

**Q: Can I use regex with multiline strings?**
A: Yes, use /m flag for ^ and $ to match line boundaries.

**Q: How do I escape special characters?**
A: Use backslash: \. \* \? \( etc. Or use RegExp constructor for dynamic patterns.

---

## Summary

- **Regex**: Pattern matching and text manipulation
- **test()**: Check if pattern matches
- **exec()**: Get match details
- **match()**: Get all matches with /g flag
- **replace()**: Replace matches, can use function or $1, $2
- **Character classes**: [abc], \d, \w, \s
- **Quantifiers**: *, +, ?, {n,m}
- **Flags**: g (global), i (insensitive), m (multiline)
- **Groups**: () for capturing, (?:) for non-capturing
- **Common patterns**: Email, phone, URL, password validation

**Next Step:** Learn about advanced JavaScript data structures!
