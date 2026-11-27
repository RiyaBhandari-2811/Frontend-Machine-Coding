# Date & Time Manipulation

## Table of Contents
1. Date Object Basics
2. Creating Dates
3. Getting Date Components
4. Setting Date Values
5. Date Calculations
6. Date Formatting
7. Timezone Handling
8. Time Zones & Offset
9. Best Practices

---

## 1. Date Object Basics

### What is Date?
- **Date**: Object for working with dates and times
- Internally stores milliseconds since Jan 1, 1970 UTC
- Mutable (unlike some languages)
- Methods for getting/setting components
- Not ideal for complex date logic (use libraries for production)

### Creating Date Objects
```javascript
// Current date and time
let now = new Date();
console.log(now);  // e.g., Wed Nov 26 2025 14:30:45 GMT-0500

// From timestamp (milliseconds since 1970)
let date1 = new Date(1700000000000);
console.log(date1);

// From string
let date2 = new Date('2025-01-15');      // ISO format preferred
let date3 = new Date('January 15, 2025');

// From components (year, month, day, hour, minute, second, ms)
let date4 = new Date(2025, 0, 15, 14, 30, 45, 500);
// Note: Month is 0-indexed (0 = January, 11 = December)
console.log(date4);  // Wed Jan 15 2025 14:30:45 GMT-0500
```

### Invalid Dates
```javascript
// Invalid date
let invalid = new Date('invalid-string');
console.log(invalid);  // Invalid Date

// Check if valid
function isValidDate(date) {
    return date instanceof Date && !isNaN(date);
}

console.log(isValidDate(new Date()));        // true
console.log(isValidDate(new Date('xyz')));   // false
```

---

## 2. Creating Dates

### Date Parsing
```javascript
// ISO 8601 format (most reliable)
let date1 = new Date('2025-01-15');
let date2 = new Date('2025-01-15T14:30:00Z');
let date3 = new Date('2025-01-15T14:30:00+05:00');

// US format (avoid - ambiguous)
let date4 = new Date('01/15/2025');  // MM/DD/YYYY

// Various string formats
new Date('2025-01-15');               // ✓ Works
new Date('January 15, 2025');         // ✓ Works
new Date('Wed Jan 15 2025 14:30:45 GMT-0500');  // ✓ Works
new Date('2025/01/15');               // ✓ Works (US style)
```

### From Components
```javascript
// Date(year, month, day, hour, minute, second, millisecond)
let d1 = new Date(2025, 0, 15);         // Jan 15, 2025 00:00:00
let d2 = new Date(2025, 0, 15, 14);     // Jan 15, 2025 14:00:00
let d3 = new Date(2025, 0, 15, 14, 30);  // Jan 15, 2025 14:30:00
let d4 = new Date(2025, 0, 15, 14, 30, 45);  // With seconds
let d5 = new Date(2025, 0, 15, 14, 30, 45, 500);  // With ms

// CAREFUL: Month is 0-indexed!
let march = new Date(2025, 2, 15);     // March (not February!)
let december = new Date(2025, 11, 25); // December (not January!)
```

### From Timestamp
```javascript
// Milliseconds since Jan 1, 1970 UTC
let timestamp = 1705338600000;
let date = new Date(timestamp);
console.log(date);

// Get current timestamp
let now = Date.now();  // Current milliseconds since 1970
let date2 = new Date(now);
console.log(now);  // e.g., 1705338600000
```

---

## 3. Getting Date Components

### Get Individual Components
```javascript
let date = new Date('2025-01-15T14:30:45.500');

// Date components
console.log(date.getFullYear());     // 2025
console.log(date.getMonth());         // 0 (January, 0-indexed!)
console.log(date.getDate());          // 15 (day of month)
console.log(date.getDay());           // 3 (day of week: 0=Sunday, 6=Saturday)

// Time components
console.log(date.getHours());         // 14
console.log(date.getMinutes());       // 30
console.log(date.getSeconds());       // 45
console.log(date.getMilliseconds());  // 500

// Timestamp
console.log(date.getTime());          // Milliseconds since 1970
```

### Local vs UTC
```javascript
let date = new Date('2025-01-15T14:30:00');

// Local time (browser timezone)
console.log(date.getHours());        // Local hours
console.log(date.getMinutes());      // Local minutes

// UTC time
console.log(date.getUTCHours());     // UTC hours
console.log(date.getUTCMinutes());   // UTC minutes
console.log(date.getUTCFullYear());  // UTC year
console.log(date.getUTCMonth());     // UTC month (0-indexed)
```

### Get Day Name
```javascript
let date = new Date('2025-01-15');
let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
let dayName = days[date.getDay()];
console.log(dayName);  // Wednesday

// Get month name
let months = ['January', 'February', 'March', 'April', 'May', 'June',
              'July', 'August', 'September', 'October', 'November', 'December'];
let monthName = months[date.getMonth()];
console.log(monthName);  // January
```

---

## 4. Setting Date Values

### Set Individual Components
```javascript
let date = new Date('2025-01-15T14:30:45');

// Date components
date.setFullYear(2026);     // Change year
date.setMonth(5);           // Change month to June (0-indexed)
date.setDate(20);           // Change day to 20
date.setHours(16);          // Change hours to 16

// Time components
date.setMinutes(45);        // Change minutes
date.setSeconds(30);        // Change seconds
date.setMilliseconds(500);  // Change milliseconds

console.log(date);  // Jun 20 2026 16:45:30.500

// Set UTC values
let date2 = new Date('2025-01-15T14:30:00');
date2.setUTCHours(20);
date2.setUTCMinutes(15);
console.log(date2);
```

### Set by Timestamp
```javascript
let date = new Date('2025-01-15');

// Change to new timestamp
date.setTime(Date.now());  // Set to current time

console.log(date);  // Current date/time
```

---

## 5. Date Calculations

### Add/Subtract Time
```javascript
let date = new Date('2025-01-15T14:30:00');

// Add days
date.setDate(date.getDate() + 5);  // Add 5 days
console.log(date);  // Jan 20

// Subtract days
date.setDate(date.getDate() - 2);  // Subtract 2 days
console.log(date);  // Jan 18

// Add months
date.setMonth(date.getMonth() + 3);  // Add 3 months
console.log(date);  // Apr 18

// Add hours
date.setHours(date.getHours() + 2);  // Add 2 hours
console.log(date);  // Apr 18 16:30:00
```

### Date Differences
```javascript
let date1 = new Date('2025-01-15');
let date2 = new Date('2025-01-20');

// Difference in milliseconds
let diffMs = date2 - date1;
console.log(diffMs);  // 432000000

// Convert to other units
let diffSeconds = (date2 - date1) / 1000;
let diffMinutes = (date2 - date1) / (1000 * 60);
let diffHours = (date2 - date1) / (1000 * 60 * 60);
let diffDays = (date2 - date1) / (1000 * 60 * 60 * 24);

console.log(diffDays);  // 5
```

### Age Calculation
```javascript
function calculateAge(birthDate) {
    let today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    let monthDiff = today.getMonth() - birthDate.getMonth();
    
    // Adjust if birthday hasn't happened this year
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age;
}

let birthDate = new Date('1990-05-15');
console.log(calculateAge(birthDate));  // Age in years
```

---

## 6. Date Formatting

### toString Methods
```javascript
let date = new Date('2025-01-15T14:30:45');

// Various string formats
console.log(date.toString());        // Wed Jan 15 2025 14:30:45 GMT-0500
console.log(date.toUTCString());     // Wed, 15 Jan 2025 19:30:45 GMT
console.log(date.toISOString());     // 2025-01-15T19:30:45.000Z
console.log(date.toLocaleString());  // 1/15/2025, 2:30:45 PM (varies by locale)
console.log(date.toLocaleDateString()); // 1/15/2025
console.log(date.toLocaleTimeString()); // 2:30:45 PM
```

### Custom Formatting
```javascript
function formatDate(date) {
    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let day = String(date.getDate()).padStart(2, '0');
    let hours = String(date.getHours()).padStart(2, '0');
    let minutes = String(date.getMinutes()).padStart(2, '0');
    let seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

let date = new Date('2025-01-15T14:30:45');
console.log(formatDate(date));  // 2025-01-15 14:30:45
```

### Locale-Specific Formatting
```javascript
let date = new Date('2025-01-15T14:30:45');

// US format
console.log(date.toLocaleString('en-US'));
// 1/15/2025, 2:30:45 PM

// UK format
console.log(date.toLocaleString('en-GB'));
// 15/01/2025, 14:30:45

// German format
console.log(date.toLocaleString('de-DE'));
// 15.1.2025, 14:30:45

// With options
let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
console.log(date.toLocaleDateString('en-US', options));
// Wednesday, January 15, 2025
```

---

## 7. Timezone Handling

### Get Timezone Offset
```javascript
let date = new Date();

// Get offset from UTC in minutes
let offset = date.getTimezoneOffset();
console.log(offset);  // e.g., -300 (for EST = -5 hours)

// Convert to hours
console.log(offset / 60);  // e.g., -5

// Get timezone name
let formatter = new Intl.DateTimeFormat('en-US', { timeZoneName: 'short' });
console.log(formatter.format(date));  // e.g., 1/15/2025, EST
```

### UTC vs Local
```javascript
let date = new Date('2025-01-15T14:30:00Z');  // Z = UTC

// Local time (varies by timezone)
console.log(date.toString());    // Local representation

// Always UTC
console.log(date.toUTCString()); // Always GMT
console.log(date.getUTCHours()); // Always UTC hours

// Get local offset for display
let localDate = date.getTime() + date.getTimezoneOffset() * 60000;
let adjusted = new Date(localDate);
```

---

## 8. Time Zones & Offset

### Format with Timezone
```javascript
function formatWithTimezone(date) {
    let offset = -date.getTimezoneOffset();
    let sign = offset > 0 ? '+' : '-';
    let hours = Math.floor(Math.abs(offset) / 60);
    let minutes = Math.abs(offset) % 60;
    
    let offsetStr = `${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    
    return date.toISOString().slice(0, -1) + offsetStr;
}

let date = new Date('2025-01-15T14:30:45');
console.log(formatWithTimezone(date));  // 2025-01-15T14:30:45-05:00
```

### Different Timezone Display
```javascript
let date = new Date('2025-01-15T14:30:00');

// Display in different timezone (using Intl)
let nyTime = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York'
}).format(date);

let tokyoTime = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Tokyo'
}).format(date);

console.log('New York:', nyTime);
console.log('Tokyo:', tokyoTime);
```

---

## 9. Best Practices

### Use ISO 8601 Format
```javascript
// ✓ GOOD - ISO 8601 (unambiguous)
let date1 = new Date('2025-01-15');
let date2 = new Date('2025-01-15T14:30:00Z');
let date3 = new Date('2025-01-15T14:30:00+05:00');

// ✗ AVOID - Ambiguous formats
let date4 = new Date('01/15/2025');  // MM/DD or DD/MM?
let date5 = new Date('15-01-2025');  // Could be ambiguous
```

### Avoid Mutable Date
```javascript
// ✗ PROBLEM - Mutation can be error-prone
let date = new Date('2025-01-15');
date.setDate(date.getDate() + 1);  // Changes original
console.log(date);

// ✓ BETTER - Create new date
let date2 = new Date('2025-01-15');
let tomorrow = new Date(date2.getTime() + 86400000);  // Add 1 day in ms
console.log(tomorrow);  // Original unchanged
```

### Use Libraries for Complex Logic
```javascript
// For complex date logic, use libraries like:
// - date-fns (lightweight, functional)
// - Day.js (small, Moment.js-compatible)
// - Luxon (powerful, timezone support)
// - Temporal (future standard, still experimental)

// JavaScript Date is limited:
// - Mutable
// - No timezone support
// - Month is 0-indexed (confusing)
// - Calculations are error-prone
```

---

## Exercises

### Exercise 1: Date Formatter
```javascript
// Format date as "Jan 15, 2025"
function formatDate(date) {
    // Your code
}

console.log(formatDate(new Date('2025-01-15')));  // Jan 15, 2025
```

**Solution:**
```javascript
function formatDate(date) {
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
}
```

### Exercise 2: Days Until
```javascript
// Calculate days until a date
function daysUntil(targetDate) {
    // Your code
}

console.log(daysUntil(new Date('2025-12-25')));  // Days until Christmas
```

**Solution:**
```javascript
function daysUntil(targetDate) {
    let today = new Date();
    today.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);
    let diff = targetDate - today;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
```

### Exercise 3: Is Leap Year
```javascript
// Check if year is leap year
function isLeapYear(year) {
    // Your code
}

console.log(isLeapYear(2024));  // true
console.log(isLeapYear(2025));  // false
```

**Solution:**
```javascript
function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}
```

---

## Interview Questions

### Theoretical Questions

**Q1: What's the difference between Date.now() and new Date()?**
A: Date.now() returns timestamp (number). new Date() returns Date object.

**Q2: Why is Month 0-indexed in JavaScript?**
A: Historical quirk from JavaScript's design. 0=January, 11=December.

**Q3: How do you add days to a date?**
A: Use setDate() with current day + number of days.

**Q4: What is getTimezoneOffset()?**
A: Returns difference between UTC and local time in minutes.

**Q5: What's the best format to store dates?**
A: ISO 8601 (YYYY-MM-DDTHH:mm:ssZ) or Unix timestamp.

---

## Code-Based Interview Questions

**Q1: What will be output?**
```javascript
let d = new Date(2025, 0, 15);
console.log(d.getMonth());  // ?
```
A:
```
0
```

**Q2: Predict:**
```javascript
let d = new Date('2025-01-15');
d.setMonth(11);
console.log(d.getMonth());  // ?
```
A:
```
11
```

**Q3: What will be logged?**
```javascript
let d1 = new Date('2025-01-15');
let d2 = new Date('2025-01-20');
console.log(d2 - d1);  // ?
```
A:
```
432000000
```

**Q4: Spot the issue:**
```javascript
new Date('2025/13/15');  // December doesn't exist!
```
A: Month is 0-11, 13 is invalid but Date might still create object.

**Q5: What is output?**
```javascript
console.log(Date.now() > 0);  // ?
```
A:
```
true
```

---

## Follow-up Questions & Confusing Concepts

**Q: Can I compare dates with < or >?**
A: Yes, Date objects convert to numbers for comparison.

**Q: Does Date object account for daylight saving?**
A: Automatically, based on browser/system timezone.

**Q: Why does new Date() sometimes show different time than expected?**
A: Timezone differences. Use UTC methods for consistency.

**Q: Can I store Date in localStorage?**
A: No, must convert to string. Use toISOString() or JSON.stringify().

---

## Summary

- **new Date()**: Create date/time objects
- **getFullYear/Month/Date**: Get components (Month is 0-indexed!)
- **setFullYear/Month/Date**: Set components
- **getTime()**: Get milliseconds since 1970
- **Date.now()**: Current timestamp
- **toISOString()**: Convert to ISO 8601 string
- **Timezone**: getTimezoneOffset() for local offset
- **Calculations**: Add/subtract by converting to milliseconds
- **Formatting**: Use toLocaleString() for locale-specific, or build custom
- **Best practice**: Use libraries for complex date logic

**Next Step:** Learn advanced JavaScript console methods and debugging!
