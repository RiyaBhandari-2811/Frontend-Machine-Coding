# Web Workers & Threading

## Table of Contents
1. Web Workers Fundamentals
2. Creating Workers
3. Communication with Workers
4. Worker Limitations
5. Shared Workers
6. Service Workers Basics
7. Worker Use Cases
8. Performance Benefits
9. Best Practices

---

## 1. Web Workers Fundamentals

### What are Web Workers?
```javascript
// Web Workers run JavaScript in background threads
// Benefits:
// - Offload heavy computation from main thread
// - Don't block UI rendering
// - Parallel processing
// - Can't access DOM (limitation)

// Two types:
// 1. Dedicated Workers - Single thread per worker
// 2. Shared Workers - Shared by multiple pages/workers
```

### Why Use Web Workers?
```javascript
// ✗ SLOW - Blocks main thread
function heavyCalculation() {
    for (let i = 0; i < 1000000000; i++) {
        Math.sqrt(i);
    }
    updateUI();  // UI frozen until done!
}

heavyCalculation();

// ✓ FAST - Offload to worker
let worker = new Worker('worker.js');
worker.postMessage({ task: 'calculate' });

worker.onmessage = (e) => {
    updateUI(e.data);  // Called when worker finishes
    // UI stays responsive!
};
```

---

## 2. Creating Workers

### Dedicated Worker
```javascript
// main.js
let worker = new Worker('worker.js');

// Send data to worker
worker.postMessage({
    command: 'calculate',
    data: [1, 2, 3, 4, 5]
});

// Receive result
worker.onmessage = (event) => {
    console.log('Result:', event.data);
};

// Handle errors
worker.onerror = (error) => {
    console.error('Worker error:', error.message);
};

// Terminate when done
// worker.terminate();
```

### Worker File
```javascript
// worker.js
// This runs in separate thread

// Receive message from main
self.onmessage = (event) => {
    let { command, data } = event.data;
    
    if (command === 'calculate') {
        // Do heavy computation
        let result = data.reduce((a, b) => a + b, 0);
        
        // Send result back
        self.postMessage({
            result: result,
            timestamp: Date.now()
        });
    }
};

// Or using addEventListener
self.addEventListener('message', (event) => {
    console.log('Worker received:', event.data);
});
```

### Inline Worker
```javascript
// Create worker from inline blob
let workerCode = `
self.onmessage = (e) => {
    let result = e.data * 2;
    self.postMessage(result);
};
`;

let blob = new Blob([workerCode], { type: 'application/javascript' });
let workerUrl = URL.createObjectURL(blob);
let worker = new Worker(workerUrl);

worker.postMessage(5);
worker.onmessage = (e) => {
    console.log('Result:', e.data);  // 10
};
```

---

## 3. Communication with Workers

### Message Structure
```javascript
// main.js - Send structured message
worker.postMessage({
    id: 1,
    task: 'process',
    payload: {
        array: [1, 2, 3],
        options: { sort: true }
    }
});

// worker.js - Receive and process
self.onmessage = (e) => {
    let { id, task, payload } = e.data;
    
    let result;
    if (task === 'process') {
        result = performOperation(payload);
    }
    
    // Send back with same ID
    self.postMessage({
        id: id,
        result: result
    });
};
```

### Transferable Objects
```javascript
// main.js - Transfer array buffer (move ownership)
let buffer = new ArrayBuffer(1024);
worker.postMessage({
    command: 'process',
    buffer: buffer
}, [buffer]);  // Transfer ownership

console.log(buffer.byteLength);  // 0 (transferred!)

// vs copying
worker.postMessage({
    command: 'process',
    buffer: buffer
});  // Buffer is copied instead

// worker.js - Receive transferred buffer
self.onmessage = (e) => {
    let { buffer } = e.data;
    // Work with buffer...
};
```

### Promise-Based Communication
```javascript
// main.js - Wrapper for promise-based communication
class WorkerPool {
    constructor(workerScript) {
        this.worker = new Worker(workerScript);
        this.callbacks = new Map();
        this.id = 0;
        
        this.worker.onmessage = (e) => {
            let { id, result, error } = e.data;
            let callback = this.callbacks.get(id);
            if (callback) {
                if (error) {
                    callback.reject(new Error(error));
                } else {
                    callback.resolve(result);
                }
                this.callbacks.delete(id);
            }
        };
    }
    
    async run(task, data) {
        return new Promise((resolve, reject) => {
            let id = this.id++;
            this.callbacks.set(id, { resolve, reject });
            this.worker.postMessage({ id, task, data });
        });
    }
}

// Usage
let pool = new WorkerPool('worker.js');
let result = await pool.run('calculate', [1, 2, 3]);
console.log(result);
```

---

## 4. Worker Limitations

### What Workers Can't Do
```javascript
// ✗ CANNOT - Access DOM
self.document;  // undefined
document.getElementById('x');  // Error

// ✗ CANNOT - Access parent window
window;  // undefined
parent;  // undefined

// ✗ CANNOT - Alert or confirm
alert('hello');  // Error

// ✗ CANNOT - Modify parent's variables
// (can only communicate via messages)
```

### What Workers Can Do
```javascript
// ✓ CAN - Use setTimeout/setInterval
setTimeout(() => {
    self.postMessage('Done!');
}, 1000);

// ✓ CAN - Fetch data
fetch('/api/data')
    .then(r => r.json())
    .then(data => {
        self.postMessage({ result: data });
    });

// ✓ CAN - Use WebSocket
let ws = new WebSocket('ws://localhost:8080');
ws.onmessage = (e) => {
    self.postMessage({ data: e.data });
};

// ✓ CAN - Create other workers (nested)
let subWorker = new Worker('sub-worker.js');
```

---

## 5. Shared Workers

### Create Shared Worker
```javascript
// main.js - Multiple pages can connect
let worker = new SharedWorker('shared-worker.js');
worker.port.start();

// Send message
worker.port.postMessage('Hello from tab 1');

// Receive message
worker.port.onmessage = (e) => {
    console.log('Received:', e.data);
};

// Another tab can connect to same worker
// let worker2 = new SharedWorker('shared-worker.js');
// worker2.port.start();
```

### Shared Worker File
```javascript
// shared-worker.js
let ports = [];

self.onconnect = (e) => {
    let port = e.ports[0];
    ports.push(port);
    
    port.onmessage = (message) => {
        // Broadcast to all connected ports
        ports.forEach(p => {
            p.postMessage(`Echo: ${message.data}`);
        });
    };
    
    port.start();
};
```

### Broadcasting Between Tabs
```javascript
// shared-worker.js - Coordinate between tabs
let ports = new Set();

self.onconnect = (e) => {
    let port = e.ports[0];
    ports.add(port);
    
    // Notify existing clients of new connection
    ports.forEach(p => {
        if (p !== port) {
            p.postMessage({ type: 'userConnected', userCount: ports.size });
        }
    });
    
    port.onmessage = (e) => {
        // Broadcast to all tabs
        ports.forEach(p => {
            p.postMessage({ type: 'message', data: e.data });
        });
    };
    
    port.onmessageerror = () => {
        ports.delete(port);
    };
};
```

---

## 6. Service Workers Basics

### Register Service Worker
```javascript
// main.js - Register worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
        .then(reg => {
            console.log('Service Worker registered');
        })
        .catch(err => {
            console.log('Service Worker registration failed:', err);
        });
}
```

### Service Worker File
```javascript
// service-worker.js
// Runs in background, survives page reload
// Used for caching, offline support, notifications

self.addEventListener('install', (e) => {
    console.log('Service Worker installing...');
    // Cache assets for offline use
});

self.addEventListener('activate', (e) => {
    console.log('Service Worker activating...');
    // Clean up old caches
});

self.addEventListener('fetch', (e) => {
    // Intercept network requests
    if (e.request.method === 'GET') {
        e.respondWith(
            caches.match(e.request)
                .then(response => response || fetch(e.request))
                .catch(() => caches.match('/offline.html'))
        );
    }
});
```

---

## 7. Worker Use Cases

### Image Processing
```javascript
// main.js
let worker = new Worker('image-worker.js');

function processImage(imageData) {
    // Transfer pixel data to worker
    worker.postMessage({
        command: 'process',
        imageData: imageData
    }, [imageData.data.buffer]);
    
    worker.onmessage = (e) => {
        displayProcessedImage(e.data);
    };
}

// image-worker.js
self.onmessage = (e) => {
    let { imageData } = e.data;
    
    // Apply filters (expensive operation)
    for (let i = 0; i < imageData.data.length; i += 4) {
        let r = imageData.data[i];
        let g = imageData.data[i + 1];
        let b = imageData.data[i + 2];
        
        // Grayscale
        let gray = r * 0.3 + g * 0.59 + b * 0.11;
        imageData.data[i] = gray;
        imageData.data[i + 1] = gray;
        imageData.data[i + 2] = gray;
    }
    
    self.postMessage(imageData);
};
```

### Data Processing
```javascript
// main.js - Analyze large dataset
let worker = new Worker('data-worker.js');

function analyzeData(data) {
    worker.postMessage({
        command: 'analyze',
        data: data
    });
    
    worker.onmessage = (e) => {
        console.log('Analysis:', e.data);  // { mean: 50, median: 48, ... }
    };
}

// data-worker.js
self.onmessage = (e) => {
    let { data } = e.data;
    
    let sorted = [...data].sort((a, b) => a - b);
    let mean = data.reduce((a, b) => a + b, 0) / data.length;
    let median = sorted[Math.floor(sorted.length / 2)];
    
    self.postMessage({ mean, median, count: data.length });
};
```

### Polling
```javascript
// main.js
let worker = new Worker('poll-worker.js');

function startPolling() {
    worker.postMessage({
        command: 'start',
        url: '/api/status',
        interval: 5000  // Every 5 seconds
    });
    
    worker.onmessage = (e) => {
        updateStatus(e.data);
    };
}

// poll-worker.js
let pollInterval;

self.onmessage = (e) => {
    let { command, url, interval } = e.data;
    
    if (command === 'start') {
        pollInterval = setInterval(async () => {
            let response = await fetch(url);
            let data = await response.json();
            self.postMessage(data);
        }, interval);
    } else if (command === 'stop') {
        clearInterval(pollInterval);
    }
};
```

---

## 8. Performance Benefits

### Main Thread Remains Responsive
```javascript
// Without worker - UI freezes
function blockingOperation() {
    for (let i = 0; i < 1000000000; i++) {
        Math.sqrt(i);
    }
}

blockingOperation();  // Everything frozen!

// With worker - UI responsive
let worker = new Worker('calc-worker.js');
worker.postMessage('calculate');
worker.onmessage = (e) => {
    console.log('Result:', e.data);
};

// Can click buttons, scroll, etc. while calculating
```

### Parallel Processing
```javascript
// main.js - Process multiple items in parallel
let workers = [
    new Worker('worker.js'),
    new Worker('worker.js'),
    new Worker('worker.js')
];

function processManyItems(items) {
    items.forEach((item, i) => {
        workers[i % workers.length].postMessage(item);
    });
}

// vs sequential (much slower)
// for (let item of items) {
//     processSync(item);  // Waits for each
// }
```

---

## 9. Best Practices

### Error Handling
```javascript
// main.js
let worker = new Worker('worker.js');

worker.onerror = (error) => {
    console.error('Worker error:', {
        message: error.message,
        filename: error.filename,
        lineno: error.lineno
    });
};

// worker.js
try {
    // Do something
} catch (error) {
    self.postMessage({
        type: 'error',
        message: error.message
    });
}
```

### Worker Pool
```javascript
class WorkerPool {
    constructor(workerScript, poolSize = 4) {
        this.workers = [];
        this.queue = [];
        
        for (let i = 0; i < poolSize; i++) {
            let worker = new Worker(workerScript);
            worker.available = true;
            this.workers.push(worker);
        }
    }
    
    async run(task) {
        // Find available worker
        let worker = this.workers.find(w => w.available);
        
        if (!worker) {
            // Queue if no available workers
            return new Promise((resolve) => {
                this.queue.push({ task, resolve });
            });
        }
        
        return new Promise((resolve) => {
            worker.available = false;
            
            worker.onmessage = (e) => {
                worker.available = true;
                resolve(e.data);
                
                // Process queued tasks
                if (this.queue.length > 0) {
                    let { task, resolve } = this.queue.shift();
                    this.run(task).then(resolve);
                }
            };
            
            worker.postMessage(task);
        });
    }
}

// Usage
let pool = new WorkerPool('worker.js', 4);
let results = await Promise.all([
    pool.run(task1),
    pool.run(task2),
    pool.run(task3)
]);
```

### Termination
```javascript
// Always terminate workers when done
let worker = new Worker('worker.js');

// Use it
worker.postMessage('task');
worker.onmessage = (e) => {
    console.log(e.data);
    
    // Clean up
    worker.terminate();  // Stop worker
};

// Or in component cleanup
// React
useEffect(() => {
    let worker = new Worker('worker.js');
    return () => worker.terminate();
}, []);
```

---

## Exercises

### Exercise 1: Simple Worker
```javascript
// Create a worker that squares a number
// main.js
let worker = new Worker('square-worker.js');
worker.postMessage(5);
worker.onmessage = (e) => {
    console.log(e.data);  // 25
};

// Your worker.js
```

**Solution:**
```javascript
// square-worker.js
self.onmessage = (e) => {
    let result = e.data * e.data;
    self.postMessage(result);
};
```

### Exercise 2: Heavy Calculation
```javascript
// Create worker for fibonacci (heavy calculation)
function fib(n) {
    return n <= 1 ? n : fib(n - 1) + fib(n - 2);
}

// Offload to worker
```

**Solution:**
```javascript
// main.js
let worker = new Worker('fib-worker.js');
worker.postMessage(40);
worker.onmessage = (e) => {
    console.log('Fib(40) =', e.data);
};

// fib-worker.js
function fib(n) {
    return n <= 1 ? n : fib(n - 1) + fib(n - 2);
}

self.onmessage = (e) => {
    self.postMessage(fib(e.data));
};
```

### Exercise 3: Worker Pool
```javascript
// Create pool to process multiple tasks
// Use provided WorkerPool class
let pool = new WorkerPool('worker.js', 2);

// Your code to process 5 tasks in parallel
```

**Solution:**
```javascript
let pool = new WorkerPool('worker.js', 2);

let tasks = [1, 2, 3, 4, 5];
let results = await Promise.all(
    tasks.map(task => pool.run(task))
);
console.log(results);
```

---

## Interview Questions

### Theoretical Questions

**Q1: What is a Web Worker?**
A: JavaScript running in background thread, doesn't block main thread.

**Q2: Can Web Workers access the DOM?**
A: No, they can't modify the page directly.

**Q3: What is the difference between dedicated and shared workers?**
A: Dedicated workers serve one context. Shared workers serve multiple.

**Q4: How do workers communicate with main thread?**
A: Through postMessage() and onmessage events.

**Q5: What is a Service Worker?**
A: Special worker for caching, offline support, notifications.

---

## Code-Based Interview Questions

**Q1: What will be output?**
```javascript
let worker = new Worker('worker.js');
worker.postMessage('hello');
// Worker receives what?
```
A:
```
'hello' (in worker's onmessage)
```

**Q2: Predict:**
```javascript
// In worker
self.postMessage(document);  // ?
```
A:
```
Error - document is undefined in worker
```

**Q3: What is transferred?**
```javascript
let buffer = new ArrayBuffer(1024);
worker.postMessage({buffer}, [buffer]);
console.log(buffer.byteLength);  // ?
```
A:
```
0
(ownership transferred to worker)
```

**Q4: Spot the issue:**
```javascript
worker.addEventListener('message', (e) => {  // Missing start!
    console.log(e.data);
});
```
A: For SharedWorker, need `port.start()` after addEventListener

**Q5: What is output?**
```javascript
// main.js
let w = new Worker('w.js');
w.terminate();
w.postMessage('hello');  // ?
```
A:
```
No error but worker is terminated, won't process
```

---

## Follow-up Questions & Confusing Concepts

**Q: Can workers create other workers?**
A: Yes, workers can spawn nested workers.

**Q: What about worker performance?**
A: Overhead of creating thread, but worth for heavy computation.

**Q: How do I debug workers?**
A: Chrome DevTools Sources tab shows worker threads.

**Q: Can I share worker between tabs?**
A: Yes, use SharedWorker instead of Worker.

---

## Summary

- **Web Workers**: JavaScript threads that don't block UI
- **Dedicated Workers**: Individual thread per worker
- **Shared Workers**: Multiple pages share one worker
- **Communication**: postMessage() and onmessage events
- **Limitations**: No DOM access, no alert, no window
- **Transferable**: Arrays, buffers can be transferred (not copied)
- **Service Workers**: Background workers for caching, offline, notifications
- **Use cases**: Heavy calculations, image processing, polling, data analysis
- **Performance**: Main thread stays responsive
- **Termination**: Always clean up with terminate()

**Next Step:** Master design patterns for scalable JavaScript!
