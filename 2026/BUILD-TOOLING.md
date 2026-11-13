# Build Tooling & Micro-Frontends — the infra interviewers drill

Companion to [README.md](README.md) and [REACT-CONCEPTS.md](REACT-CONCEPTS.md). This is the "how your code actually ships" sheet: bundlers, code splitting, Webpack, Module Federation, monorepos. These come up in full-stack / senior frontend rounds. Be able to **explain each with an example**, not just define it.

> You have real talking points here from **DCT**: an **Nx monorepo** sharing code across **Samsung Smart TV, Android/Fire TV, and Web**, built on **Webpack + Module Federation**. Tie answers back to that.

---

## 1. Why bundlers exist (the 10-second story)

Browsers historically couldn't load hundreds of small JS modules efficiently. A **bundler** takes your many source files (JS/TS, CSS, images) + their `import` graph and produces a few optimized files the browser can load fast.

A bundler does four jobs:
1. **Resolve** the dependency graph (follow every `import`).
2. **Transform** each file via **loaders** (TS→JS, JSX→JS, SCSS→CSS).
3. **Bundle** into chunks.
4. **Optimize** (minify, tree-shake, split, hash for caching).

---

## 2. Webpack core concepts

| Concept | What it is |
|---|---|
| **Entry** | Starting file(s) of the dependency graph (`src/index.tsx`) |
| **Output** | Where bundles are written + naming (`[name].[contenthash].js`) |
| **Loaders** | Transform non-JS files so Webpack can process them (`babel-loader`, `ts-loader`, `css-loader`, `style-loader`) |
| **Plugins** | Hook into the whole build for broader tasks (`HtmlWebpackPlugin`, `DefinePlugin`, `MiniCssExtractPlugin`, `ModuleFederationPlugin`) |
| **Mode** | `development` (fast, readable) vs `production` (minified, optimized) |

**Loaders vs Plugins (classic trap):** loaders work **per-file** during transformation; plugins work on the **whole bundle/build lifecycle**. Module Federation is a **plugin**.

```js
// webpack.config.js (shape, not memorize)
module.exports = {
  entry: './src/index.tsx',
  output: { filename: '[name].[contenthash].js', clean: true },
  module: { rules: [{ test: /\.tsx?$/, use: 'babel-loader' }] },
  plugins: [new HtmlWebpackPlugin()],
};
```

---

## 3. Code splitting & lazy loading

Don't ship one giant bundle. Split so users download only what they need.

- **Dynamic `import()`** → creates a separate chunk, loaded on demand:
  ```js
  const Chart = React.lazy(() => import('./Chart')); // own chunk, loaded when rendered
  ```
- **Route-based splitting** — each route its own chunk (biggest real-world win).
- **`SplitChunksPlugin`** — pull shared deps (e.g. `react`) into a common `vendors` chunk so they're cached once.

**Why it matters:** smaller initial bundle → faster **LCP/TTI**. Pair `React.lazy` with `<Suspense fallback>`.

---

## 4. Tree shaking & optimization

- **Tree shaking** = dead-code elimination. Works only with **ES modules** (`import`/`export`) because they're statically analyzable; CommonJS (`require`) isn't.
- Mark packages side-effect-free with `"sideEffects": false` in `package.json` so unused exports get dropped.
- Production also does **minification** (Terser), **scope hoisting**, and **content hashing** for long-term caching.

**Trap:** importing a whole library (`import _ from 'lodash'`) kills tree shaking. Import the function (`import debounce from 'lodash/debounce'`) or use ESM builds.

---

## 5. Dev experience: dev server, HMR, source maps

- **Dev server** serves the app locally with live reload.
- **HMR (Hot Module Replacement)** swaps changed modules **without a full reload**, preserving component state. Huge for DX.
- **Source maps** map minified output back to original source so stack traces/breakpoints are readable (`devtool: 'source-map'`).

---

## 6. Webpack vs Vite vs the others (very common Q)

| Tool | How it works | Best for |
|---|---|---|
| **Webpack** | Bundles everything up-front; mature, huge plugin ecosystem (incl. Module Federation) | Large/legacy apps, micro-frontends |
| **Vite** | Dev: serves native **ES modules** (no bundling) → instant startup; uses **esbuild** for deps, **Rollup** for prod build | New projects, fast DX |
| **esbuild** | Go-based bundler/transpiler, extremely fast | Speed-critical tooling |
| **Rollup** | ESM-focused, great tree shaking | Libraries |
| **Turbopack** | Rust-based Webpack successor (Next.js) | Next.js apps |

**One-liner:** "Webpack bundles before serving; Vite serves native ES modules in dev so startup is near-instant, and bundles with Rollup only for production." Vite is the default for new work; Webpack still wins when you need **Module Federation** maturity.

---

## 7. Module Federation (the micro-frontend question) ⭐

**What it solves:** lets **separately built and deployed** apps **share code and components at runtime**. Multiple teams ship independent apps that compose into one experience — without rebuilding each other.

**Core vocabulary:**
| Term | Meaning |
|---|---|
| **Host (shell)** | The app that *consumes* remote modules at runtime |
| **Remote** | An app that *exposes* modules for others to load |
| **`exposes`** | What a remote makes available (`'./Button': './src/Button'`) |
| **`remotes`** | What a host points to (URL of a remote's `remoteEntry.js`) |
| **`shared`** | Deps shared across apps (e.g. `react`) so they're not loaded twice |

```js
// A remote exposing a component
new ModuleFederationPlugin({
  name: 'catalog',
  filename: 'remoteEntry.js',
  exposes: { './ProductCard': './src/ProductCard' },
  shared: { react: { singleton: true }, 'react-dom': { singleton: true } },
});

// A host consuming it
new ModuleFederationPlugin({
  name: 'shell',
  remotes: { catalog: 'catalog@https://cdn.example.com/remoteEntry.js' },
  shared: { react: { singleton: true } },
});

const ProductCard = React.lazy(() => import('catalog/ProductCard')); // loaded at RUNTIME
```

**Why `singleton: true` matters (classic trap):** React must be a **single instance** across host + remotes, or hooks break ("invalid hook call" / two Reacts). `singleton` forces one shared copy; version mismatches warn/error.

**Build-time sharing (monorepo libs) vs runtime sharing (Module Federation):**
- **Nx library** = shared at **build time**, bundled into each app. Change it → rebuild/redeploy consumers.
- **Module Federation** = shared at **runtime**, loaded over HTTP. Change a remote → redeploy *only* that remote; hosts pick it up live. That independent-deploy ability is the whole point of micro-frontends.

**Trade-offs to mention:** independent deploys & team autonomy, BUT harder versioning, runtime coupling, more network requests, and shared-dependency headaches. Don't reach for it unless multiple teams/apps genuinely need independent deploys.

---

## 8. Monorepos & Nx (your DCT setup)

- **Monorepo** = many apps/libs in one repo with shared tooling.
- **Nx** adds: a dependency graph, **`affected`** commands (only build/test what changed), **computation caching** (don't rebuild unchanged code), and generators.
- **"3 platforms, 1 codebase"** = Smart TV / mobile / web apps sharing UI and logic through Nx libraries, each built with Webpack; Module Federation lets pieces load at runtime.

**Monorepo ≠ micro-frontend.** A monorepo is a *code organization* choice (build time); micro-frontends are a *runtime composition* choice. You can have either without the other.

---

## 9. Performance & caching

- **Content hashing** (`[contenthash]`) → filenames change only when content changes → long-term browser caching.
- **Bundle analysis** — `webpack-bundle-analyzer` to find bloat; set a **performance budget**.
- **Split vendor vs app code** so app changes don't bust the big cached vendor chunk.
- Watch **Core Web Vitals**: smaller/split bundles → better LCP & INP.

---

## 10. Quick answers to the exact questions you got asked

- **"Years of experience with Webpack / Module Federation?"**
  > ~1 year with Webpack and Module Federation, used in an Nx monorepo to share code across Smart TV, mobile, and web at DCT.

- **"Difference between loaders and plugins?"**
  > Loaders transform individual files during the build (TS→JS, SCSS→CSS); plugins hook into the whole build lifecycle for broader tasks like generating HTML or Module Federation.

- **"Webpack vs Vite?"**
  > Webpack bundles everything before serving; Vite serves native ES modules in dev for instant startup and bundles with Rollup only for production. Vite for new apps, Webpack when I need Module Federation maturity.

- **"How does Module Federation share React safely?"**
  > Mark shared deps as `singleton: true` so host and remotes use one React instance, otherwise hooks break.

---

## How to practice this

1. Scaffold a tiny **host + one remote** with Module Federation (or Nx's MF generator) and load a remote component at runtime.
2. Run `webpack-bundle-analyzer` on any Tier 1–2 build and cut the biggest chunk.
3. Convert a route to `React.lazy` + dynamic `import()` and watch the network tab split.

If you can explain **build-time vs runtime sharing** and **why `singleton` matters**, you've covered 80% of what this round asks. 💪
