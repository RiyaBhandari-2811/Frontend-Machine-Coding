# Frontend Foundations: Complete Interview Guide (Questions + Answers)

Comprehensive resource combining questions with detailed answers for all 16 foundational topics. Use this to study, test yourself, and prepare for technical interviews.

**How to use:** Read the question, try to answer it aloud in 30-90 seconds, then check the detailed answer below.

---

## 1. How the web works

### Q: What happens when you enter a URL in the browser and press Enter?
**A:** Browser parses the URL to extract protocol, domain, path, and port → DNS lookup occurs to resolve the domain to an IP address → TCP connection is established with the server (3-way handshake) → TLS handshake happens if HTTPS (encryption negotiation) → HTTP request is sent to the server → Server processes the request and sends back an HTTP response with HTML, CSS, JS, and other assets → Browser receives the response and begins parsing HTML → CSS and JS are fetched as dependencies are discovered → DOM tree is built from HTML → CSSOM tree is built from CSS → Render tree is created by combining DOM and CSSOM → Layout (reflow) calculates positions and sizes of elements → Paint converts the render tree into pixels → Composite combines layers for final display

---

### Q: What is the difference between the frontend and backend?
**A:** 
- **Frontend**: Runs in the user's browser; responsible for UI/UX, user interactions, client-side logic, and presentation
- **Backend**: Runs on the server; handles business logic, database operations, authentication, authorization, and API responses
- Frontend is what users see and interact with; backend is the server-side infrastructure that powers the application

---

### Q: What are the responsibilities of a browser?
**A:**
- Parse HTML, CSS, and JavaScript
- Build the DOM and CSSOM
- Execute JavaScript code
- Render pixels on the screen based on the render tree
- Handle user interactions (clicks, keyboard, scrolling, etc.)
- Manage HTTP requests and responses
- Manage browser APIs (localStorage, sessionStorage, geolocation, etc.)
- Security enforcement (same-origin policy, CORS)
- Caching of resources
- Provide dev tools for debugging

---

### Q: What are HTML, CSS, and JavaScript responsible for?
**A:**
- **HTML**: Structure and semantic meaning of content (markup)
- **CSS**: Visual presentation, styling, layout, and animations
- **JavaScript**: Interactivity, dynamic behavior, and runtime logic

---

### Q: What is the DOM?
**A:**
- Document Object Model: a tree representation of the HTML document in memory
- Allows JavaScript to access and manipulate HTML elements dynamically
- Each HTML element becomes a node in the DOM tree
- JavaScript can query, create, modify, and delete DOM nodes
- Changes to the DOM trigger re-rendering

---

### Q: What is the CSSOM?
**A:**
- CSS Object Model: a tree representation of CSS rules applied to the HTML
- Built from all CSS sources (inline, external, computed styles)
- Combines with the DOM to create the render tree
- JavaScript can read and modify styles via the CSSOM API

---

### Q: How does the browser turn HTML, CSS, and JavaScript into pixels on the screen?
**A:**
1. Parse HTML and build DOM tree
2. Parse CSS and build CSSOM tree
3. Combine DOM and CSSOM to create render tree
4. Run layout (calculate positions and sizes)
5. Run paint (rasterize visual elements)
6. Run composite (combine layers and prepare for display)
7. Display pixels on screen

---

### Q: What is a JavaScript engine? What does it do?
**A:**
- A program that executes JavaScript code (e.g., V8 in Chrome, SpiderMonkey in Firefox)
- Parses JavaScript source code into an AST (Abstract Syntax Tree)
- Compiles code to machine code or bytecode (JIT compilation)
- Manages memory (garbage collection)
- Provides built-in objects and functions (Object, Array, Math, etc.)
- Executes code synchronously in a single-threaded event loop

---

### Q: What is the difference between JavaScript and the DOM?
**A:**
- **JavaScript**: A programming language with built-in objects and APIs
- **DOM**: A browser API that allows JavaScript to interact with HTML elements
- JavaScript can exist without a browser (Node.js); DOM is browser-specific
- JavaScript is the language; DOM is what allows JavaScript to manipulate web pages

---

### Q: What is the difference between a browser and a web server?
**A:**
- **Browser**: Client-side application that requests and displays web pages
- **Web server**: Server-side software that listens for requests and sends responses (e.g., Nginx, Apache)
- Browser initiates connections; server responds to requests

---

## 2. Networking basics

### Q: What is DNS, and why is it needed?
**A:**
- Domain Name System: translates human-readable domain names to IP addresses
- Needed because humans can't remember IP addresses (e.g., 93.184.216.34)
- Allows users to type `example.com` instead of an IP address
- DNS is a hierarchical distributed system with root nameservers, TLDs, and authoritative nameservers

---

### Q: What happens during DNS resolution?
**A:**
1. Browser checks its cache for the domain
2. If not cached, it queries the recursive resolver (usually the ISP's DNS server)
3. Recursive resolver queries the root nameserver
4. Root nameserver responds with the TLD nameserver address
5. Recursive resolver queries the TLD nameserver
6. TLD nameserver responds with the authoritative nameserver address
7. Recursive resolver queries the authoritative nameserver
8. Authoritative nameserver responds with the IP address
9. Recursive resolver caches and returns the IP to the browser

---

### Q: What is an IP address?
**A:**
- Internet Protocol address: unique numerical identifier for a device on a network
- IPv4: 32-bit address (e.g., 192.168.1.1)
- IPv6: 128-bit address (more addresses available)
- Allows devices to find and communicate with each other over the internet

---

### Q: What is HTTP?
**A:**
- HyperText Transfer Protocol: application-layer protocol for transferring data over the web
- Stateless protocol (each request is independent)
- Requests and responses have headers and optional body
- Uses methods like GET, POST, PUT, DELETE, PATCH
- Status codes indicate response type (2xx success, 3xx redirect, 4xx client error, 5xx server error)

---

### Q: What is HTTPS, and how is it different from HTTP?
**A:**
- HTTP Secure: HTTP over TLS/SSL encryption
- Encrypts all data between client and server
- Prevents man-in-the-middle attacks and eavesdropping
- Verified with digital certificates (issued by Certificate Authorities)
- Browsers now warn users about non-HTTPS sites
- Slightly slower than HTTP due to encryption overhead (negligible)

---

### Q: What is TCP?
**A:**
- Transmission Control Protocol: transport layer protocol
- Connection-oriented (establishes connection before sending data)
- Reliable delivery (ensures all packets arrive in order)
- Uses 3-way handshake (SYN, SYN-ACK, ACK) to establish connection
- Used for applications requiring reliability (HTTP, email, FTP)

---

### Q: What is TLS?
**A:**
- Transport Layer Security: cryptographic protocol for secure communication
- Successor to SSL (Secure Sockets Layer)
- Provides encryption, authentication, and integrity
- Handshake process exchanges keys and verifies server identity
- Operates between application layer and transport layer

---

### Q: At a high level, how do TCP, TLS, HTTP, and HTTPS relate to one another?
**A:**
- TCP: reliable transport layer protocol
- TLS: encryption layer built on top of TCP
- HTTP: application protocol that uses TCP
- HTTPS: HTTP using TLS for encryption
- Order: HTTP/HTTPS (application) → TLS (encryption) → TCP (transport) → IP (internet)

---

### Q: What is a client-server architecture?
**A:**
- Model where clients request resources and servers provide them
- Clients: devices or applications making requests (web browsers)
- Servers: computers hosting and serving resources
- Communication is typically request-response based
- Servers are centralized; clients are distributed

---

### Q: What is an HTTP request and an HTTP response?
**A:**
- **HTTP Request**: Message from client to server containing:
  - Method (GET, POST, etc.)
  - URL/path
  - Headers (content-type, authentication, etc.)
  - Optional body (for POST, PUT, PATCH)
- **HTTP Response**: Message from server to client containing:
  - Status code (200, 404, 500, etc.)
  - Headers (content-type, caching, etc.)
  - Optional body (HTML, JSON, etc.)

---

### Q: What are HTTP methods such as GET, POST, PUT, PATCH, and DELETE?
**A:**
- **GET**: Retrieve data; should not have side effects; data in URL
- **POST**: Create new resource; can have body data; has side effects
- **PUT**: Replace entire resource; requires complete resource data
- **PATCH**: Partial update of resource; smaller payload than PUT
- **DELETE**: Remove resource; requests deletion
- Other methods: HEAD (like GET but no body), OPTIONS (describe communication), CONNECT

---

### Q: What are HTTP status codes? What do the 2xx, 3xx, 4xx, and 5xx ranges mean?
**A:**
- **2xx (Success)**: 200 OK, 201 Created, 204 No Content
- **3xx (Redirect)**: 301 Moved Permanently, 302 Found, 304 Not Modified (use cache)
- **4xx (Client Error)**: 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found
- **5xx (Server Error)**: 500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable

---

## 3. Servers, localhost, and ports

### Q: What is a web server?
**A:**
- Software/application that listens for HTTP requests on a network port and sends responses
- Examples: Nginx, Apache, IIS
- Serves static files (HTML, CSS, JS, images)
- Can be configured for caching, SSL, compression, load balancing
- Lightweight and optimized for serving files

---

### Q: What is an application or backend server?
**A:**
- Runs application logic, processes requests, interacts with databases
- Examples: Node.js, Python Flask/Django, Java Spring
- Handles dynamic content generation, business logic, authentication
- Often requires a web server (Nginx/Apache) in front of it in production
- Can also serve files but slower than dedicated web servers

---

### Q: What is the difference between Nginx/Apache and a Node.js server?
**A:**
- **Nginx/Apache**: Web servers written in C; optimized for serving static files and proxying; lightweight
- **Node.js**: JavaScript runtime that can build application/backend servers; runs business logic; slower for static file serving
- In production: Nginx often sits in front of Node.js (reverse proxy)

---

### Q: Can a Node.js application act as a backend server?
**A:**
- Yes, absolutely. Node.js is single-threaded but handles concurrency well with async/await and event loop
- Can handle HTTP requests, database operations, authentication, etc.
- Used for real-time applications, APIs, microservices
- In production, often behind a reverse proxy (Nginx) for performance

---

### Q: What does `localhost` mean?
**A:**
- Refers to the local machine (your computer)
- Alias for the IP address 127.0.0.1 in IPv4
- Alias for ::1 in IPv6
- Used for testing applications locally without network access

---

### Q: What is the purpose of an IP address such as `127.0.0.1`?
**A:**
- 127.0.0.1 is the loopback address in IPv4
- Points to the local machine itself
- Allows communication with services running on the same machine
- Used for local development and testing

---

### Q: What is a port?
**A:**
- Numerical identifier for a specific service on a machine
- Ranges from 0 to 65535
- Ports 0-1023 are reserved for system services
- Each process listening on a machine must use a different port
- Combines with IP address to form a complete address (e.g., 127.0.0.1:3000)

---

### Q: Why do frontend development servers commonly use ports such as 3000, 5173, or 8080?
**A:**
- These are in the ephemeral/dynamic port range (above 1024)
- Not reserved for system services, so can be used freely
- 3000: Common convention for Node.js/Express
- 5173: Default for Vite
- 8080: Common alternative HTTP port
- Developers choose these to avoid conflicts with other services

---

### Q: What is the difference between a development server and a production server?
**A:**
- **Dev Server**: Runs locally; includes hot module replacement, source maps, detailed errors; not optimized for performance
- **Production Server**: Runs on actual server; optimized for performance, security, reliability; minified code; caching strategies
- Dev server rebuilds on file changes; production server is static

---

### Q: Does running an application on localhost mean it is available on the public internet?
**A:**
- No. Localhost (127.0.0.1) only accessible from the same machine
- A firewall typically blocks external access
- To make it public, you need:
  - Public IP address or domain name
  - Server accessible on the internet
  - Proper DNS configuration
  - Open ports (usually port 80 for HTTP, 443 for HTTPS)

---

## 4. JavaScript modules and package management

### Q: Why were JavaScript modules introduced?
**A:**
- Original JavaScript had no module system; all code in global scope
- Large projects led to naming conflicts and spaghetti code
- Modules provide encapsulation and code organization
- Allow importing only what's needed, reducing global pollution
- Improve maintainability and reusability

---

### Q: What are `import` and `export`?
**A:**
- Part of ES6 modules (ESM)
- **export**: Makes variables, functions, or classes available to other modules
- **import**: Brings in exported items from other modules
- Example: `export const func = () => {}; import { func } from './module.js'`
- Allows explicit dependency declaration

---

### Q: What is a module?
**A:**
- Self-contained file with code that performs a specific function
- Can export public API (what other modules can use)
- Can have private code (not exported)
- Each module has its own scope
- Dependencies between modules are explicit

---

### Q: What is the difference between named exports and default exports?
**A:**
- **Named exports**: Module can export multiple items; importer specifies which ones
  - `export const x = 1; export const y = 2;`
  - `import { x, y } from './module'`
- **Default export**: Each module can have one default; importer decides the name
  - `export default function() {}`
  - `import MyFunc from './module'`
- Can mix both: some named, one default

---

### Q: What is ES Modules (ESM)?
**A:**
- Official JavaScript module standard (ES6/ES2015)
- Uses `import` and `export` syntax
- Asynchronous loading; modules load in parallel
- Supported natively in modern browsers and Node.js
- File extension `.mjs` or `"type": "module"` in package.json

---

### Q: What is CommonJS?
**A:**
- Module system used in Node.js before ES modules
- Uses `require()` and `module.exports`
- Synchronous loading (blocks until module is loaded)
- Still widely used in Node.js projects
- Example: `const mod = require('./module'); module.exports = { x: 1 }`

---

### Q: How are `import`/`export` different from `require()`/`module.exports`?
**A:**
- **import/export (ESM)**: Asynchronous, standardized, dead code elimination, top-level only
- **require/module.exports (CommonJS)**: Synchronous, Node.js specific, can be conditional
- ESM is the future standard; CommonJS for Node.js compatibility
- Transpilers like Babel can convert between them

---

### Q: What is a package?
**A:**
- Collection of code/files distributed as a unit
- Usually includes package.json with metadata (name, version, dependencies)
- Can be published to registries like npm
- Installed via package manager into node_modules

---

### Q: What is a dependency?
**A:**
- External package that your project relies on
- Listed in package.json under "dependencies" (production) or "devDependencies" (development only)
- Has its own version requirement
- Can have sub-dependencies (transitive dependencies)

---

### Q: What is the role of a package manager such as npm, pnpm, or Yarn?
**A:**
- Downloads and installs packages from registries
- Manages versions and version conflicts
- Handles dependency resolution (which versions satisfy requirements)
- Creates lockfiles to ensure reproducible installs
- Provides commands to run scripts, publish packages, etc.

---

### Q: What is the purpose of `package.json`?
**A:**
- Metadata file describing the project/package
- Lists dependencies, dev dependencies, and their versions
- Specifies scripts to run (build, test, start)
- Contains project info (name, version, description, author, license)
- Defines module type (ESM vs CommonJS)
- Used by package managers for installation

---

### Q: What is a lockfile, and why should it be committed?
**A:**
- Record of exact versions installed (package-lock.json, yarn.lock, pnpm-lock.yaml)
- Ensures everyone gets same versions (reproducible installs)
- Without it, different team members might install different versions
- Prevents "works on my machine" issues
- Should be committed to version control

---

## 5. Bundlers and why they exist

### Q: What problem did JavaScript bundlers solve?
**A:**
- Early web only had `<script>` tags; couldn't share code between files easily
- Multiple script tags meant global namespace pollution and ordering issues
- Browsers had no module system before ES modules
- Bundlers combined multiple files into one (or few) files for better performance
- Allowed use of modules before browsers supported them

---

### Q: Why did frontend applications need bundling as they grew?
**A:**
- More code modules meant more HTTP requests (slow)
- Global namespace collisions with many script tags
- Needed dependency management
- Code splitting became necessary (not load everything at once)
- Want to remove unused code (tree shaking)

---

### Q: What is a bundler?
**A:**
- Tool that takes multiple JavaScript modules and combines them into one or more files
- Resolves dependencies between modules
- Applies transformations (transpiling, minification, etc.)
- Examples: Webpack, Vite, Rollup, esbuild
- Produces optimized bundles for production

---

### Q: What is an entry point?
**A:**
- Starting file(s) for the bundler to begin traversing dependencies
- Usually `index.js` or `main.js`
- Bundler follows all imports from entry point to find all dependencies
- Multiple entry points can create multiple bundles (code splitting)

---

### Q: What is a dependency graph?
**A:**
- Tree/graph representation of which modules depend on which others
- Bundler builds this by parsing imports
- Used to determine which files to include
- Circular dependencies can complicate the graph

---

### Q: What is a bundle?
**A:**
- Output file(s) produced by bundler
- Contains all necessary code to run the application
- Optimized for performance (minified, tree-shaken, etc.)
- Usually results in 1-5 bundle files for a typical app

---

### Q: What is the difference between a module and a bundle?
**A:**
- **Module**: Individual file with code (source code)
- **Bundle**: Output file combining multiple modules
- Modules are input; bundles are output
- Modules have dependencies; bundles are self-contained

---

### Q: What happens when a bundler follows imports from an entry point?
**A:**
1. Start at entry point file
2. Parse all import/require statements
3. Add imported modules to dependency list
4. Recursively follow imports in those modules
5. Continue until all dependencies found
6. Create bundle with all modules

---

### Q: What is the difference between development and production builds?
**A:**
- **Dev build**: Faster to build, includes source maps, unminified code, error details
- **Production build**: Slower to build, minified, tree-shaken, optimized for size, source maps optional
- Dev build prioritizes rebuild speed; production prioritizes bundle size

---

### Q: Are bundlers still needed when browsers support native JavaScript modules?
**A:**
- Yes, still valuable for:
  - Minification and dead code elimination
  - Transforming modern syntax to supported syntax
  - Optimizing asset loading and splitting
  - Handling non-JS assets (CSS, images)
  - Caching strategies
- Unbundled development is possible (Vite does this)
- Production typically still benefits from bundling

---

## 6. Webpack

### Q: What is Webpack?
**A:**
- Module bundler for JavaScript and static assets
- Powerful and highly configurable
- Takes modules as input, outputs optimized bundles
- Extensive plugin and loader ecosystem
- Industry standard for years, though alternatives exist

---

### Q: What are the main parts of a Webpack configuration?
**A:**
- **Entry**: Which file(s) to start bundling from
- **Output**: Where to save bundles and naming scheme
- **Loaders**: Transform non-JS files and transpile code
- **Plugins**: Optimize bundles, generate HTML, extract CSS, etc.
- **Mode**: Development or production mode
- **Resolve**: How to find modules
- **Dev Server**: Configuration for development server

---

### Q: What is an entry point in Webpack?
**A:**
- Starting file for bundling (can have multiple)
- Webpack follows all imports from here
- Example: `entry: { main: './src/index.js' }`
- Multiple entries: `entry: { app: './src/app.js', admin: './src/admin.js' }`

---

### Q: What is output in Webpack?
**A:**
- Configuration for output bundles
- Specifies filename pattern, path, and other options
- Example: `output: { filename: '[name].bundle.js', path: resolve(__dirname, 'dist') }`
- `[name]` placeholder expands to entry key name

---

### Q: What are loaders?
**A:**
- Transform files before bundling
- Used for non-JS files (CSS, images, TypeScript)
- Examples: babel-loader (transpile JS), css-loader (handle CSS), file-loader (images)
- Configured in `module.rules` array
- Chain: `use: ['style-loader', 'css-loader']` (right to left order)

---

### Q: Why does Webpack need loaders for files such as CSS, TypeScript, or images?
**A:**
- Webpack natively only understands JavaScript modules
- Loaders transform these files into modules Webpack can process
- CSS loader converts CSS to JS that injects styles
- TypeScript loader transpiles TS to JS
- Image loader converts images to data URLs or file references

---

### Q: What are plugins?
**A:**
- Extend Webpack's functionality beyond loaders
- Run at different stages of bundling
- Examples: HtmlWebpackPlugin (generate HTML), MiniCssExtractPlugin (extract CSS to file)
- More flexible than loaders; can access entire compilation
- Configured in `plugins` array

---

### Q: How are loaders different from plugins?
**A:**
- **Loaders**: Transform individual files before bundling
- **Plugins**: Hook into lifecycle events, can access entire bundling process
- Loaders are simpler; plugins are more powerful
- Loaders configured in `module.rules`; plugins in `plugins` array

---

### Q: What is the role of `webpack.config.js`?
**A:**
- Configuration file for Webpack
- Exports configuration object
- Specifies entry, output, loaders, plugins, dev server, etc.
- Can be conditional based on environment (dev vs prod)

---

### Q: What are the limitations or complexities developers can encounter with Webpack?
**A:**
- Complex configuration that's hard to understand for beginners
- Slow rebuild times in development
- Large number of plugins/loaders to learn and configure
- Error messages can be cryptic
- Difficult to optimize and debug build performance
- Overkill for simple projects

---

## 7. Vite and modern frontend tooling

### Q: What is Vite?
**A:**
- Modern frontend build tool and development server
- Created by Evan You (Vue creator)
- Focuses on developer experience and build speed
- Uses esbuild for pre-bundling, Rollup for production builds
- Native ES modules in browser for instant dev server startup

---

### Q: Why was Vite introduced?
**A:**
- Webpack's rebuild times were slow as projects grew
- Dev server startup was slow
- Vite leverages modern browser support for ES modules
- Provides instant feedback during development
- Maintains zero-config defaults for common cases

---

### Q: How is Vite different from Webpack?
**A:**
- **Dev Server**: Vite serves modules unbundled; Webpack bundles everything
- **Startup**: Vite instant startup; Webpack slower
- **Rebuild**: Vite only rebundles changed module; Webpack rebuilds entire bundle
- **Config**: Vite minimal config; Webpack extensive
- **Production**: Vite still uses Rollup bundling (like Webpack); dev is different

---

### Q: How does Vite serve modules during development?
**A:**
- Analyzes entry point for imports
- Serves each module as individual file
- Browser's native ES module support loads them
- On file change, only that module is re-served (HMR)
- Much faster than rebundling entire project

---

### Q: What is native ESM in the browser?
**A:**
- Native support for `import`/`export` in browser JavaScript
- Browsers fetch modules as separate network requests
- Supported in modern browsers (Chrome 61+, Firefox 67+, Safari 10.1+)
- Can import modules directly in HTML: `<script type="module" src="app.js">`

---

### Q: What is dependency pre-bundling, and why does Vite do it?
**A:**
- Vite pre-bundles dependencies into single module
- Dependencies in `node_modules` might have many sub-dependencies
- Pre-bundling reduces number of module requests in dev
- Uses esbuild for fast pre-bundling
- Improves page load performance during development

---

### Q: Why might dependencies need to be converted or optimized before serving?
**A:**
- CommonJS dependencies need conversion to ESM for browser
- Optimizes dependency resolution and reduces requests
- Splits large dependencies to avoid bundling same code twice
- Improves caching of dependency bundles

---

### Q: What is a dev server?
**A:**
- Lightweight server for development (Vite, Webpack dev server)
- Serves source files and handles HMR
- Faster startup and rebuild than production build
- Includes source maps for debugging
- Not meant for production use

---

### Q: Does Vite still bundle the application for production?
**A:**
- Yes. Vite uses Rollup for production builds
- Production bundle is optimized (minified, tree-shaken)
- Dev unbundled approach is only for development
- Production still benefits from bundling

---

### Q: What roles have esbuild, Rollup, and Rolldown played in Vite's tooling?
**A:**
- **esbuild**: Ultra-fast bundler/transpiler; used for pre-bundling deps and fast build transforms
- **Rollup**: Sophisticated bundler; used for production builds; better for libraries
- **Rolldown**: Rust-based next-gen Rollup replacement; planned for future versions
- Vite combines best of each: esbuild speed + Rollup reliability

---

### Q: Is Webpack obsolete now that Vite exists?
**A:**
- No. Webpack still valuable for:
  - Complex projects needing advanced configuration
  - Existing Webpack codebases
  - Extensive plugin ecosystem for specific needs
  - Some specialized use cases
- Vite better for most new projects
- Webpack still widely used in production

---

## 8. HMR and React Fast Refresh

### Q: What is HMR (Hot Module Replacement)?
**A:**
- Development feature that updates code in running app without full page reload
- Changed module is re-executed; app state potentially preserved
- Reduces feedback loop and improves developer experience
- Implemented by dev server (Webpack, Vite, etc.)

---

### Q: Why is HMR useful during development?
**A:**
- Preserves application state across code changes
- Faster feedback than full page reload
- Makes development faster and more enjoyable
- Enables iterative development and experimentation
- Reduces time between code change and seeing result

---

### Q: How is HMR different from a full page reload?
**A:**
- **HMR**: Only changed module re-executed; state preserved
- **Full reload**: Entire page reloaded from scratch; state lost
- HMR faster and preserves app state if implemented correctly
- Some changes might still require full reload (HTML structure, global state)

---

### Q: What happens when you save a file while the dev server is running?
**A:**
1. Dev server detects file change
2. Recompiles only changed module (and dependents)
3. Sends update to browser via WebSocket
4. Browser's HMR client receives update
5. HMR module system removes old module and loads new one
6. Component re-renders if state preserved correctly
7. Visual update appears instantly

---

### Q: What is React Fast Refresh?
**A:**
- Improved HMR specifically for React
- Preserves component state across edits
- Recovers from rendering errors without full reload
- Developed by React team to improve dev experience
- Requires React 17+ and proper setup

---

### Q: How is React Fast Refresh related to HMR?
**A:**
- React Fast Refresh is built on HMR
- Adds React-specific logic to preserve component state
- Handles component lifecycle correctly
- Makes HMR work reliably with React

---

### Q: Does HMR automatically preserve every kind of application state?
**A:**
- No. HMR preserves application state in memory
- But depends on how state is managed
- Component local state preserved if component re-renders
- Global state depends on implementation
- Some states might be lost (e.g., if stored in module-level variables incorrectly)
- Best with state management libraries (Redux, Zustand)

---

## 9. Production build and performance concepts

### Q: What happens when a frontend application is built for production?
**A:**
1. Code is minified (removed whitespace, shortened variable names)
2. Dead code is eliminated (tree shaking)
3. Code is split into chunks for lazy loading
4. Assets are optimized (images compressed, etc.)
5. Source maps generated for debugging (optional)
6. Bundle analyzed for performance
7. Files are ready for deployment to server
8. Browser caches optimized via versioning

---

### Q: What is minification?
**A:**
- Process of removing unnecessary characters from code
- Removes whitespace, comments, shortens variable names
- Reduces file size (sometimes 30-50% reduction)
- Code still functions identically
- Humans can't read minified code (but performance worth it)

---

### Q: What is tree shaking?
**A:**
- Removal of unused code from final bundle
- Requires ES modules (static analysis possible)
- Bundler marks unused exports and doesn't include them
- Requires using named exports (not default)
- Can reduce bundle size significantly

---

### Q: What is dead code?
**A:**
- Code that's never executed or unreachable
- Unused functions, variables, branches
- Increases bundle size unnecessarily
- Bundlers can identify and remove it (with tree shaking)
- Bad practice; should remove manually when possible

---

### Q: What is code splitting?
**A:**
- Dividing bundle into multiple smaller chunks
- Reduces initial bundle size
- Lazy loading chunks on demand
- Route-based splitting: different route = different chunk
- Component-based splitting: load component only when needed

---

### Q: What is lazy loading?
**A:**
- Deferring loading of code/assets until needed
- Dynamic imports: `const mod = await import('./module.js')`
- In React: `const Component = lazy(() => import('./Component'))`
- Reduces initial page load time
- Improves perceived performance

---

### Q: How are code splitting and lazy loading related?
**A:**
- **Code splitting**: Dividing code into chunks
- **Lazy loading**: Loading chunk only when needed
- Lazy loading requires code splitting
- Not all split code is lazy (some preloaded)

---

### Q: What is asset optimization?
**A:**
- Improving size/quality of images, fonts, etc.
- Image optimization: compression, modern formats (WebP), responsive images
- Font optimization: subset fonts, font-display strategy
- CSS/JS minification and compression
- Removes unused assets

---

### Q: Why should production JavaScript bundles be kept small?
**A:**
- Faster network download (especially important for mobile)
- Faster parsing and compilation by browser
- Faster execution (less code = faster)
- Better Core Web Vitals scores
- Saves bandwidth costs
- Better user experience (faster page load)

---

### Q: What is the difference between build-time optimization and runtime performance?
**A:**
- **Build-time**: Minification, tree shaking, code splitting (happens once)
- **Runtime**: Efficient algorithms, avoiding reflows, optimizing event handlers (happens every time user interacts)
- Build-time is automatic; runtime requires careful coding
- Both important for overall performance

---

## 10. Monorepos and workspaces

### Q: What is a monorepo?
**A:**
- Single repository containing multiple related projects/packages
- All code in one place with shared tooling and version control
- Example: Same repo contains web app, mobile app, shared library
- Easier cross-project refactoring and dependency management
- Requires careful structure to avoid spaghetti code

---

### Q: What is a polyrepo?
**A:**
- Multiple separate repositories for different projects
- Each project has its own repo, CI/CD, versioning
- Easier isolation but harder cross-project changes
- Each team can move independently
- Versioning and dependency management more complex

---

### Q: What are the advantages and trade-offs of a monorepo?
**A:**
- **Advantages**: Shared dependencies, easier refactoring, single CI/CD, shared tooling, atomic commits
- **Trade-offs**: Slower operations on huge repos, needs careful structure, all tests run on change, coordination required
- Suits large organizations; might be overkill for small projects

---

### Q: Is a monorepo the same thing as microservices?
**A:**
- No. Monorepo is code organization; microservices is architecture
- Can have monorepo with monolithic backend, or polyrepo with microservices
- Monorepo + microservices: separate services sharing code/tooling

---

### Q: What is a workspace?
**A:**
- Feature in package managers (npm, yarn, pnpm) for managing multiple packages in one repo
- Packages can depend on each other without publishing to npm
- Each package has own `package.json`
- Shared `node_modules` for efficiency

---

### Q: How does a workspace help manage packages inside a monorepo?
**A:**
- Central `package.json` or config (`pnpm-workspace.yaml`)
- Defines which directories are packages
- Dependencies between packages resolved locally
- Single install of all dependencies
- Shared tooling and configuration

---

### Q: What is pnpm?
**A:**
- Fast, space-efficient package manager
- Uses content-addressable file system (single file stored once)
- Strict dependency resolution (no phantom dependencies)
- Excellent workspace support
- Faster than npm and Yarn in most cases

---

### Q: What is the role of `pnpm-workspace.yaml`?
**A:**
- Configuration file for pnpm workspaces
- Lists directories containing packages
- Example: `packages: - 'packages/*'` includes all dirs under packages/
- Defines workspace structure

---

### Q: How can one local package be used by another app in the same workspace?
**A:**
- In package.json, depend on local package: `"@myorg/lib": "workspace:*"`
- pnpm creates symlinks to local packages
- Changes in local package immediately affect dependents
- No need to publish to npm registry

---

### Q: What is the difference between a monorepo, a workspace, and a package manager?
**A:**
- **Monorepo**: Code organization strategy (multiple projects in one repo)
- **Workspace**: Feature in package managers enabling multiple packages in one repo
- **Package manager**: Tool (npm, pnpm, Yarn) that manages dependencies
- Workspaces are tools for implementing monorepos

---

### Q: What is pnpm's content-addressable store, at a high level?
**A:**
- pnpm stores packages in a global store with hash-based file names
- Each file stored once, symlinked to projects that need it
- Saves disk space (doesn't duplicate identical files)
- Makes pnpm faster and more efficient

---

### Q: How does pnpm's approach to storing and linking dependencies help?
**A:**
- Saves disk space (one copy of each package version globally)
- Faster installs (don't re-download same packages)
- Faster project setup (linking is instant)
- Prevents "phantom dependencies" (can't use undeclared deps)
- More reliable builds (explicit dependency declaration required)

---

## 11. Turborepo and Nx

### Q: If workspaces already manage packages, why might a monorepo need Turborepo or Nx?
**A:**
- Workspaces just handle dependencies; don't optimize task execution
- Multiple packages have build scripts, test scripts, lint scripts
- Running all tasks naively is slow (can't parallelize smart)
- Need orchestration for task dependencies (build before test)
- Need caching to avoid re-running unchanged tasks

---

### Q: What is task orchestration?
**A:**
- Coordinating execution of tasks (build, test, lint) across multiple packages
- Defining order: some tasks must complete before others start
- Parallelizing independent tasks
- Managing task dependencies intelligently

---

### Q: What is task dependency ordering?
**A:**
- Some tasks depend on others (can't test before building)
- Ensuring tasks run in correct order
- Example: Package A's build must complete before Package B builds (if B depends on A)
- Turborepo/Nx automatically determine correct order

---

### Q: What is a task pipeline in Turborepo?
**A:**
- Definition of which tasks depend on which others
- Configured in `turbo.json`
- Example: `test` task depends on `build` task
- Ensures `build` runs before `test`

---

### Q: What does `dependsOn` mean in `turbo.json`?
**A:**
- Specifies task dependencies
- `"dependsOn": ["^build"]` means "run build in dependencies first"
- `"dependsOn": ["//#build"]` means "run build in root first"
- Ensures correct execution order

---

### Q: What does `^build` mean?
**A:**
- `^` prefix means "in dependencies"
- `^build` = "run build in dependent packages first"
- `build` = "run build in same package"
- Used to establish task ordering across workspace

---

### Q: If an app depends on a shared package, which should build first?
**A:**
- Shared package should build first
- Then app can build (and use updated shared package)
- Turborepo/Nx handle this automatically with `^` prefix

---

### Q: What is caching in a build system?
**A:**
- Storing build outputs so unnecessary rebuilds avoided
- If inputs haven't changed, cached output reused
- Dramatically speeds up rebuild after no changes
- Requires tracking which inputs affect which outputs

---

### Q: What is a cache hit?
**A:**
- Build system finds cached result for current inputs
- Cached output used instead of running task
- Saves time (sometimes seconds to minutes)
- Reduces CI/CD time significantly

---

### Q: What is a cache miss?
**A:**
- Build system doesn't have cached result for current inputs
- Task must run (source code changed)
- Output saved to cache for future use
- Normal and expected when code changes

---

### Q: How does a build tool decide whether a cached result can be reused?
**A:**
- Hashes inputs (source files, dependencies, config)
- If hash matches cached hash, result can be reused
- If any input changed, hash different, task re-runs
- Some inputs are automatically tracked; others manually specified

---

### Q: What is the difference between local cache and remote cache?
**A:**
- **Local cache**: Stored on developer's machine
- **Remote cache**: Stored on shared server (Turborepo Cloud, Nx Cloud)
- Local cache: fast, only helps that developer
- Remote cache: helps entire team, shared across machines

---

### Q: Why is remote caching useful for teams and CI/CD?
**A:**
- Developer A builds; result cached in cloud
- Developer B pulls, can reuse Developer A's cached build
- CI/CD can reuse caches from previous runs
- Dramatically reduces CI/CD time
- Saves compute resources and time

---

### Q: What is parallel task execution?
**A:**
- Running multiple independent tasks simultaneously
- If Task A and Task B don't depend on each other, run both
- Reduces total time (parallelism instead of sequential)
- Turborepo/Nx automatically parallelize where possible

---

### Q: At a high level, how are Turborepo and Nx different?
**A:**
- **Turborepo**: Lightweight, focused on task orchestration and caching, easier to set up
- **Nx**: More comprehensive, includes code generation, enforces project boundaries, steeper learning curve
- Both speed up monorepos; Turborepo simpler, Nx more powerful
- Turborepo easier for teams new to monorepos

---

## 12. Browser rendering and runtime

### Q: What are the major stages of the browser rendering pipeline?
**A:**
1. **Parse**: Browser parses HTML and builds DOM tree
2. **Style Calculation**: CSSOM is built from CSS; styles computed for each element
3. **Layout**: Browser calculates positions and sizes (geometry) of elements
4. **Paint**: Browser converts render tree to pixels (rasterization)
5. **Composite**: Browser combines layers and prepares for display

---

### Q: What are style calculation, layout, paint, and compositing?
**A:**
- **Style Calculation**: Matching CSS rules to DOM elements; computing final styles
- **Layout (Reflow)**: Calculating geometry (position, size) of elements
- **Paint**: Converting layout to actual pixels (filling pixels with colors)
- **Compositing**: Combining multiple layers into final image for display

---

### Q: What is reflow or layout thrashing?
**A:**
- **Reflow**: Recalculation of element positions/sizes when DOM or styles change
- **Layout thrashing**: Forcing multiple reflows by alternating reads and writes
- Example: `element.offsetHeight; element.style.height = '10px'; element.offsetHeight;`
- Expensive operation; thrashing multiplies cost
- Should batch DOM reads before writes

---

### Q: What is repaint?
**A:**
- Recalculating which pixels need color based on layout
- Less expensive than reflow (layout already calculated)
- Triggered by color changes, background images, etc.
- Still blocks rendering

---

### Q: What is the difference between reflow and repaint?
**A:**
- **Reflow**: Recalculate geometry (position, size, layout)
- **Repaint**: Recalculate which pixels show (color, background)
- Reflow always causes repaint; repaint doesn't always cause reflow
- Reflow much more expensive

---

### Q: What is the critical rendering path?
**A:**
- Sequence of steps browser must complete to display page
- HTML parsing → CSS parsing → JS execution → layout → paint → composite
- Blocking resources (render-blocking CSS, JS in head) delay this
- Optimizing CRP improves page load performance

---

### Q: What blocks HTML parsing?
**A:**
- Synchronous JavaScript (in `<head>` or body without `defer`)
- CSS in `<head>` (needs CSSOM before rendering)
- Large images (HTTP requests block later elements)
- Bad server response time

---

### Q: What do `async` and `defer` do on script tags?
**A:**
- **Default**: Script downloaded and executed; HTML parsing blocked
- **async**: Script downloaded in parallel; executed as soon as ready (might be during/after parsing)
- **defer**: Script downloaded in parallel; executed after HTML parsing complete
- `defer` preserves order; `async` doesn't
- Use `defer` for scripts that depend on DOM, `async` for independent scripts

---

### Q: What is the difference between the JavaScript call stack and the event loop?
**A:**
- **Call Stack**: Stack data structure tracking function calls; executes synchronous code
- **Event Loop**: Checks if call stack is empty; if so, moves callback from queue to stack
- Call stack executes; event loop coordinates async execution
- Event loop enables non-blocking async code

---

### Q: What are tasks and microtasks?
**A:**
- **Tasks (Macrotasks)**: `setTimeout`, `setInterval`, UI events, etc.
- **Microtasks**: Promises, `queueMicrotask()`, MutationObserver
- Microtasks execute before next task
- After each task, all microtasks execute before rendering
- Microtasks have higher priority

---

### Q: How do promises, `setTimeout`, and rendering interact with the event loop?
**A:**
- `setTimeout` callback goes to task queue
- Promise `.then()` goes to microtask queue
- After current JS execution:
  1. All microtasks (promises) execute
  2. Browser may render if needed
  3. Next task (setTimeout) executes
- This order matters for performance and correctness

---

## 13. HTML, CSS, and accessibility

### Q: What is semantic HTML, and why does it matter?
**A:**
- Using HTML elements that describe content meaning (`<article>`, `<nav>`, `<button>` instead of `<div>`)
- Improves accessibility (screen readers understand structure)
- Improves SEO (search engines understand content)
- More maintainable code
- Better keyboard navigation with native elements

---

### Q: What is the difference between block, inline, and inline-block elements?
**A:**
- **Block**: Takes full width; starts new line; respects margin/padding all sides (div, p, h1)
- **Inline**: Only takes needed width; doesn't start new line; vertical margin/padding ignored (span, a, strong)
- **Inline-block**: Like inline but respects margin/padding (can be set via CSS display)
- Display property controls this behavior

---

### Q: What is the CSS box model?
**A:**
- Model for how elements are sized and spaced
- **Content**: Actual content (text, images)
- **Padding**: Space inside element border
- **Border**: Line around padding
- **Margin**: Space outside border
- `box-sizing: border-box` includes padding/border in width/height

---

### Q: What is CSS specificity?
**A:**
- Determines which CSS rule applies when conflicts exist
- Calculated as (a, b, c) where:
  - a = ID selectors (highest)
  - b = Classes, attributes, pseudo-classes
  - c = Element selectors (lowest)
- Inline styles have highest specificity
- `!important` overrides everything (avoid when possible)

---

### Q: How does the cascade determine which CSS rule wins?
**A:**
1. Origin: Inline > Author > Browser defaults
2. Specificity: Higher specificity wins
3. Order: Later rules override earlier if equal specificity
4. Inheritance: Inheritable properties pass to children

---

### Q: What are Flexbox and CSS Grid, and when would you use each?
**A:**
- **Flexbox**: 1D layout (row or column); distributes space; good for components, navigation
- **CSS Grid**: 2D layout (rows and columns); explicit positioning; good for page layouts
- Use Flexbox for simple linear layouts; Grid for complex 2D designs
- Flexbox simpler; Grid more powerful

---

### Q: What are responsive design and media queries?
**A:**
- **Responsive Design**: Website adapts to different screen sizes
- **Media Queries**: CSS conditions based on device properties (width, height, orientation)
- Example: `@media (max-width: 600px) { ... }`
- Mobile-first approach (base styles for mobile, enhance for larger screens)

---

### Q: What are relative CSS units such as `rem`, `em`, `%`, `vw`, and `vh`?
**A:**
- **rem**: Relative to root element font-size (default 16px); 1rem = 16px
- **em**: Relative to parent element font-size; compound when nested
- **%**: Relative to parent element's property
- **vw**: 1% of viewport width; `100vw` = full width
- **vh**: 1% of viewport height; useful for full-height elements
- Use `rem` for scalability; `em` for component-relative sizing

---

### Q: What is the difference between `display: none`, `visibility: hidden`, and `opacity: 0`?
**A:**
- **display: none**: Element removed from layout; no space taken
- **visibility: hidden**: Element invisible but takes up space (layout preserved)
- **opacity: 0**: Element transparent but clickable and takes up space
- Use based on desired effect and interaction needs

---

### Q: What is accessibility (a11y)?
**A:**
- Designing and developing for users with disabilities
- Includes visual, hearing, motor, cognitive disabilities
- Makes web usable for everyone, not just able-bodied users
- Legal requirement in many places (WCAG standards)

---

### Q: Why are labels, keyboard navigation, focus states, and semantic elements important?
**A:**
- **Labels**: Associate text with form inputs for screen readers and usability
- **Keyboard navigation**: Users who can't use mouse need to navigate via keyboard
- **Focus states**: Visual indicator of which element is focused (necessary for keyboard users)
- **Semantic elements**: Screen readers announce element type and role
- All essential for inclusive web design

---

## 14. Browser storage and security basics

### Q: What is the difference between cookies, localStorage, and sessionStorage?
**A:**
- **Cookies**: Sent with every HTTP request; has expiration; size ~4KB; HttpOnly, Secure flags for security
- **localStorage**: Not sent with requests; persistent (doesn't expire); size ~5-10MB; accessible only via JS
- **sessionStorage**: Like localStorage but cleared when tab closed; not shared between tabs
- Use cookies for auth; localStorage for preferences; sessionStorage for temporary data

---

### Q: When would you use each type of browser storage?
**A:**
- **Cookies**: Authentication tokens (sent in requests), user preferences that need to persist
- **localStorage**: User settings, app state that needs to persist across sessions, cached data
- **sessionStorage**: Form data before submission, temporary calculations, data for current session only

---

### Q: What is a cookie's `HttpOnly` flag?
**A:**
- Prevents JavaScript from accessing cookie via `document.cookie`
- Protects against XSS attacks reading sensitive data
- Cookie still sent with HTTP requests
- Server-side only access
- Always set for authentication tokens

---

### Q: What are `Secure` and `SameSite` cookie attributes?
**A:**
- **Secure**: Cookie only sent over HTTPS; prevents sending over unencrypted HTTP
- **SameSite**: Controls when cookie sent with cross-site requests
  - `Strict`: Only sent with same-site requests
  - `Lax`: Sent with same-site and top-level navigations
  - `None`: Sent in all requests (requires Secure flag)
- Protects against CSRF attacks

---

### Q: What is CORS?
**A:**
- Cross-Origin Resource Sharing: mechanism allowing restricted resources on web page accessed from different domain
- Browser enforces same-origin policy; CORS allows exceptions
- Server sends CORS headers indicating who can access
- Example: Web page on `a.com` wants to fetch from `b.com`
- Requires server explicitly granting permission

---

### Q: Why does a browser enforce the same-origin policy?
**A:**
- Security measure preventing malicious scripts from accessing sensitive data
- Malicious website on `evil.com` couldn't access user data from `bank.com`
- Restricts cross-site HTTP requests
- Necessary for security

---

### Q: What is a preflight request?
**A:**
- Automatic request browser sends before actual cross-origin request
- Uses `OPTIONS` method
- Checks if server allows the actual request
- Triggered by certain request types (POST with custom headers, etc.)
- Adds latency but necessary for security

---

### Q: What is the difference between authentication and authorization?
**A:**
- **Authentication**: Verifying user is who they claim (login)
- **Authorization**: Determining what authenticated user can do (permissions)
- Authentication answers "Who are you?"; Authorization answers "What can you do?"
- Both necessary for secure systems

---

### Q: What is XSS?
**A:**
- Cross-Site Scripting: attacker injects malicious script into website
- Scripts run in victim's browser with victim's permissions
- Can steal cookies, session tokens, sensitive data
- Caused by trusting user input without sanitizing
- Prevent by escaping output, validating input, CSP headers

---

### Q: What is CSRF?
**A:**
- Cross-Site Request Forgery: attacker tricks user into making unwanted request
- Example: User logged into bank; visits malicious site that requests transfer
- Browser sends bank cookies automatically, authorizing request
- Prevent with CSRF tokens (unpredictable token validated by server)
- SameSite cookies also help

---

### Q: What are common ways to reduce frontend security risks?
**A:**
- Validate and sanitize all user input
- Escape output to prevent XSS
- Use HTTPS only (Secure cookies)
- Set Content Security Policy headers
- Use HttpOnly, Secure, SameSite cookie flags
- Never store sensitive data in localStorage/sessionStorage
- Use CSRF tokens for state-changing requests
- Keep dependencies updated (patch vulnerabilities)
- Use security headers (X-Frame-Options, X-Content-Type-Options, etc.)

---

## 15. APIs and frontend-backend communication

### Q: How does a frontend application communicate with a backend?
**A:**
- HTTP/HTTPS requests (GET, POST, PUT, DELETE, etc.)
- Sends data to server via URL parameters or request body
- Server processes and sends response (usually JSON)
- Frontend parses response and updates UI

---

### Q: What is the Fetch API?
**A:**
- Browser API for making HTTP requests
- Promise-based (async/await friendly)
- Modern replacement for XMLHttpRequest
- Example: `fetch(url, options).then(r => r.json())`
- Supports method, headers, body, credentials options

---

### Q: How is Fetch different from Axios?
**A:**
- **Fetch**: Browser API, built-in, simpler API
- **Axios**: Library, works in browser and Node.js, interceptors, automatic JSON parsing, timeout support
- Fetch doesn't auto-parse JSON; Axios does
- Axios easier for interceptors and common tasks
- Fetch more lightweight for simple requests

---

### Q: What are request headers and response headers?
**A:**
- **Request headers**: Metadata sent with request (Content-Type, Authorization, User-Agent)
- **Response headers**: Metadata sent back (Content-Type, Set-Cookie, Cache-Control)
- Headers control behavior and security
- Both visible in browser dev tools

---

### Q: What is JSON?
**A:**
- JavaScript Object Notation: text format for structured data
- Human-readable and machine-parseable
- Supports objects, arrays, strings, numbers, booleans, null
- Standard format for API communication
- Smaller than XML; faster to parse

---

### Q: How should a frontend handle loading, success, empty, and error states?
**A:**
- **Loading**: Show spinner/skeleton while fetching; disable interactions
- **Success**: Display data; hide loading state
- **Empty**: Show empty state message if no data returned
- **Error**: Show error message; offer retry option; log to monitoring
- Use conditional rendering based on state variable

---

### Q: What is pagination?
**A:**
- Dividing large dataset into smaller pages
- Frontend requests specific page (e.g., `?page=1&limit=10`)
- Server returns subset plus total count/pages
- Frontend renders buttons to navigate between pages
- Improves performance and UX (don't load everything at once)

---

### Q: What is debouncing?
**A:**
- Technique delaying function execution until after repeated events stop
- Example: User typing; don't search until user stops for 300ms
- Reduces number of function calls
- Improves performance for expensive operations (API calls, filtering)
- Example: `debounce(search, 300)` waits 300ms after last keystroke

---

### Q: What is throttling?
**A:**
- Technique limiting function call rate (maximum once per time interval)
- Example: Scroll event fires many times; throttle to 100ms max
- Ensures function called at regular intervals at most
- Different from debounce (debounce waits for inactivity; throttle enforces rate)
- Use for performance-critical events

---

### Q: What is polling?
**A:**
- Client repeatedly requests data from server at intervals
- Example: Every 5 seconds, `fetch('/api/data')`
- Simple but inefficient (many requests even if no data changed)
- Server load increases with many clients
- Good for simple cases; not for real-time

---

### Q: What are WebSockets and Server-Sent Events (SSE)?
**A:**
- **WebSockets**: Bidirectional persistent connection; both client and server can send
- **SSE**: Unidirectional; server can push to client; uses HTTP
- WebSockets: good for real-time interactions (chat, multiplayer games)
- SSE: good for server-to-client updates (notifications, live data)

---

### Q: When would you choose polling, SSE, or WebSockets?
**A:**
- **Polling**: Simple cases, infrequent updates, low tolerance for delay
- **SSE**: Server-to-client updates, notifications, don't need bidirectional, works with standard HTTP
- **WebSockets**: Real-time, bidirectional, low latency required, chat/gaming
- WebSockets most powerful but most complex

---

## 16. Frontend performance and Core Web Vitals

### Q: What is frontend performance?
**A:**
- Measure of how fast and smoothly a frontend application runs
- Includes page load time, interaction responsiveness, visual stability
- Affects user satisfaction and engagement
- Measured in milliseconds

---

### Q: What are Core Web Vitals?
**A:**
- Three key metrics Google uses to measure page experience
- LCP (Largest Contentful Paint), INP (Interaction to Next Paint), CLS (Cumulative Layout Shift)
- Google ranks pages based on these metrics
- Becoming increasingly important for SEO

---

### Q: What is Largest Contentful Paint (LCP)?
**A:**
- Time until largest content element (image, text block, video) is painted on screen
- Measures perceived load speed
- Target: < 2.5 seconds
- Affected by network speed, server response time, render-blocking resources

---

### Q: What is Interaction to Next Paint (INP)?
**A:**
- Latency from user interaction to next paint (visual response)
- Measures responsiveness to user input
- Target: < 200 milliseconds
- Affected by JavaScript execution, layout calculations

---

### Q: What is Cumulative Layout Shift (CLS)?
**A:**
- Measure of unexpected layout shifts during page lifetime
- Score based on how much content moves unexpectedly
- Target: < 0.1
- Affected by ads, images without dimensions, dynamically injected content

---

### Q: What can cause a poor LCP, INP, or CLS score?
**A:**
- **LCP**: Slow server response, render-blocking CSS/JS, unoptimized images, client-side rendering
- **INP**: Heavy JavaScript execution, long tasks, main thread blocking
- **CLS**: Images/ads without fixed dimensions, dynamically injected content, web fonts loading

---

### Q: How do image optimization, lazy loading, and code splitting improve performance?
**A:**
- **Image optimization**: Smaller files download faster; modern formats (WebP) smaller than PNG/JPG
- **Lazy loading**: Only load images/code when needed; reduces initial bundle; faster first paint
- **Code splitting**: Smaller bundles parse/execute faster; parallelize downloads
- All reduce initial load time and improve Core Web Vitals

---

### Q: What is a performance budget?
**A:**
- Target limits for performance metrics (bundle size, load time, CLS)
- Example: "Bundle size must stay under 100KB"
- Prevents performance regressions
- Enforced in CI/CD to catch problems early
- Helps team stay conscious of performance

---

### Q: How can you measure frontend performance in the browser?
**A:**
- **Lighthouse**: Built-in tool (DevTools > Lighthouse) audits performance
- **WebPageTest**: External tool detailed analysis
- **Performance API**: JavaScript API measuring resource timing
- **Core Web Vitals**: Browser reports via web-vitals library
- **Dev Tools Performance tab**: Record and analyze runtime performance
- Chrome User Experience Report: Real user data

---

## Suggested Learning Order - Key Points

### 1. JavaScript in Depth
- Scope and closures: variable accessibility and data privacy
- Hoisting: variable and function declaration behavior
- `this` keyword: context-dependent binding
- Prototypes and inheritance: OOP in JavaScript
- Promises and async/await: handling asynchronous code
- Event loop deep dive: understanding timing

### 2. TypeScript
- Static types: catch errors before runtime
- Interfaces: defining contracts
- Generics: writing reusable type-safe code
- Utility types: Partial, Pick, Record, etc.
- Typing React: component props and state types

### 3. React
- Components (functional, class-based)
- Props and state management
- Hooks (useState, useEffect, useContext, useReducer)
- Rendering and reconciliation (virtual DOM)
- Performance optimization (memoization, code splitting)

### 4. React Advanced
- Custom hooks and patterns
- State management (Context, Redux, Zustand)
- Form handling and validation
- Error boundaries and error handling
- Testing strategies

### 5. Next.js
- Routing and layouts
- Server and Client Components
- Rendering modes (SSR, SSG, ISR)
- Data fetching patterns
- API routes
- Deployment and caching strategies

### 6. Frontend Architecture
- Project structure and folder organization
- Reusable component design
- Design systems
- Testing strategy
- Monorepos and workspaces
- Observability and monitoring

---

**Study Tips:**
- Read the question first, try to answer without looking at the answer
- Compare your answer to the detailed answer
- Mark questions you struggle with and revisit them
- Try explaining concepts aloud to someone else
- Use these answers as a reference guide for deeper understanding, not just memorization
- Review the suggested learning order to prioritize what to study next
