# CI/CD, Deployment & Production Strategies

## Table of Contents
1. Build Optimization
2. Environment Management
3. Deployment Strategies
4. Blue-Green Deployment
5. Canary Releases
6. CI/CD Pipelines
7. Production Monitoring
8. Rollback Strategies

---

## 1. Build Optimization

### Code Splitting
```javascript
// Route-based splitting
import { lazy, Suspense } from 'react';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Admin = lazy(() => import('./pages/Admin'));

function App() {
    return (
        <Router>
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/admin" element={<Admin />} />
                </Routes>
            </Suspense>
        </Router>
    );
}

// Component-based splitting
const HeavyComponent = lazy(() => import('./HeavyComponent'));

function Page() {
    return (
        <Suspense fallback={<div>Loading component...</div>}>
            <HeavyComponent />
        </Suspense>
    );
}
```

### Tree Shaking
```javascript
// ✗ WRONG - Import entire library
import * as utils from './utils';
utils.formatDate();

// ✓ CORRECT - Import only what you need
import { formatDate } from './utils';
formatDate();

// Package.json setup
{
    "sideEffects": false,  // Enable tree shaking
    "main": "dist/index.js",
    "module": "dist/index.esm.js"
}

// Avoid default exports (harder to tree shake)
// Use named exports
export { formatDate };
export { formatCurrency };
```

### Bundle Analysis
```javascript
// webpack.config.js
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
    .BundleAnalyzerPlugin;

module.exports = {
    plugins: [
        new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            openAnalyzer: false,
            reportFilename: 'bundle-report.html'
        })
    ]
};

// Run: npm run build
// Check: dist/bundle-report.html
```

---

## 2. Environment Management

### Environment Configuration
```javascript
// .env.local (not in git)
REACT_APP_API_URL=http://localhost:3000

// .env.development
REACT_APP_API_URL=http://localhost:3000
REACT_APP_LOG_LEVEL=debug

// .env.production
REACT_APP_API_URL=https://api.example.com
REACT_APP_LOG_LEVEL=error
REACT_APP_ENABLE_ANALYTICS=true

// Usage
const API_URL = process.env.REACT_APP_API_URL;
const LOG_LEVEL = process.env.REACT_APP_LOG_LEVEL;

// Never expose secrets in client-side code
// ✗ WRONG
const API_KEY = 'sk_live_123abc';

// ✓ CORRECT - Backend only
// Store in .env server-side
```

### Feature Flags
```javascript
// Control features without deploying
class FeatureFlags {
    constructor() {
        this.flags = {};
    }
    
    async load() {
        const response = await fetch('/api/feature-flags');
        this.flags = await response.json();
    }
    
    isEnabled(featureName) {
        return this.flags[featureName] || false;
    }
}

const featureFlags = new FeatureFlags();

// Usage
<Suspense fallback={null}>
    {featureFlags.isEnabled('new-checkout') && <NewCheckout />}
    {!featureFlags.isEnabled('new-checkout') && <OldCheckout />}
</Suspense>

// Or custom hook
function useFeature(featureName) {
    const [enabled, setEnabled] = useState(false);
    
    useEffect(() => {
        featureFlags.load().then(() => {
            setEnabled(featureFlags.isEnabled(featureName));
        });
    }, [featureName]);
    
    return enabled;
}
```

---

## 3. Deployment Strategies

### Manual Deployment
```bash
# Build
npm run build

# Upload to hosting
aws s3 sync dist/ s3://my-bucket/

# Invalidate cache
aws cloudfront create-invalidation \
    --distribution-id E123ABC \
    --paths "/*"
```

### Automated Deployment
```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Deploy to S3
        run: |
          aws s3 sync dist/ s3://my-bucket/ \
            --delete \
            --cache-control "max-age=31536000" \
            --exclude "index.html"
          
          aws s3 cp dist/index.html s3://my-bucket/ \
            --cache-control "max-age=0"
      
      - name: Invalidate CloudFront
        run: |
          aws cloudfront create-invalidation \
            --distribution-id ${{ secrets.CF_DIST_ID }} \
            --paths "/*"
```

---

## 4. Blue-Green Deployment

### Zero-downtime Updates
```
Concept:
- Blue: Current production
- Green: New version
- Route traffic to green only when ready
- If issues, route back to blue
```

### Implementation
```javascript
// Load balancer config
// Route 100% to Blue (current version)
// Deploy Green (new version)
// Run smoke tests on Green
// If pass: Route 100% to Green
// If fail: Keep routing to Blue

// Gradual switch
// 0% -> Green, 100% -> Blue
// 10% -> Green, 90% -> Blue
// 50% -> Green, 50% -> Blue
// 100% -> Green, 0% -> Blue
```

---

## 5. Canary Releases

### Gradual Rollout
```javascript
// Roll out to small percentage of users
// Monitor metrics
// If good, increase percentage
// If bad, rollback

// Using feature flags
function getVersion() {
    const userId = getCurrentUserId();
    const hash = hashUserId(userId);
    
    if (hash % 100 < 5) {
        // 5% get new version
        return 'v2';
    }
    return 'v1';
}

// Using load balancer weights
// Version1: 95%
// Version2: 5%
// Monitor error rate, latency, etc.
// If metrics good after 1 hour:
//   Version1: 50%
//   Version2: 50%
// After another hour, fully switch to Version2
```

---

## 6. CI/CD Pipelines

### Complete Pipeline
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Lint
        run: npm run lint
      
      - name: Type check
        run: npm run type-check
      
      - name: Unit tests
        run: npm run test
      
      - name: Integration tests
        run: npm run test:integration
      
      - name: Upload coverage
        uses: codecov/codecov-action@v2

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Analyze bundle
        run: npm run analyze:bundle
      
      - name: Upload artifact
        uses: actions/upload-artifact@v2
        with:
          name: dist
          path: dist/

  deploy-staging:
    needs: build
    if: github.ref == 'refs/heads/develop'
    runs-on: ubuntu-latest
    steps:
      - name: Download artifact
        uses: actions/download-artifact@v2
        with:
          name: dist
      
      - name: Deploy to staging
        run: |
          aws s3 sync . s3://staging-bucket/ --delete

  deploy-production:
    needs: build
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Download artifact
        uses: actions/download-artifact@v2
        with:
          name: dist
      
      - name: Deploy to production
        run: |
          aws s3 sync . s3://prod-bucket/ --delete
      
      - name: Smoke tests
        run: |
          curl https://app.example.com/health
      
      - name: Notify team
        if: failure()
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: 'Production deployment failed!'
```

---

## 7. Production Monitoring

### Health Checks
```javascript
// Health check endpoint
app.get('/health', (req, res) => {
    const health = {
        status: 'UP',
        timestamp: new Date().toISOString(),
        checks: {
            database: isDatabaseHealthy(),
            cache: isCacheHealthy(),
            api: isApiHealthy()
        }
    };
    
    const statusCode = Object.values(health.checks).every(c => c)
        ? 200
        : 503;
    
    res.status(statusCode).json(health);
});

// Monitor in browser
function useHealthCheck() {
    const [healthy, setHealthy] = useState(true);
    
    useEffect(() => {
        const interval = setInterval(() => {
            fetch('/api/health')
                .then(r => r.ok ? setHealthy(true) : setHealthy(false))
                .catch(() => setHealthy(false));
        }, 30000);  // Check every 30 seconds
        
        return () => clearInterval(interval);
    }, []);
    
    return healthy;
}
```

### Uptime Monitoring
```javascript
// External uptime monitoring
// - Pingdom
// - UptimeRobot
// - New Relic
// - DataDog

// Alert if downtime exceeds threshold
// Get paged on critical issues
// Track SLA (99.9%, 99.95%, etc.)
```

---

## 8. Rollback Strategies

### Quick Rollback
```bash
# Keep previous version available
# If issues detected:

aws s3 sync s3://backup-bucket/ s3://prod-bucket/ --delete

# Or use git revert
git revert HEAD

# Redeploy previous version
npm run build
npm run deploy:prod
```

### Blue-Green Rollback
```
If issues with Green:
1. Keep Blue running
2. Reroute traffic back to Blue
3. Investigate Green
4. Fix issues
5. Test Green again
6. Reroute to Green when ready
```

---

## Exercises

### Exercise 1: Environment Configuration
```javascript
// Set up for 3 environments:
// - Development
// - Staging
// - Production

// Your code
```

**Solution:**
```
.env.development
REACT_APP_API_URL=http://localhost:3000
REACT_APP_ENV=development

.env.staging
REACT_APP_API_URL=https://staging-api.example.com
REACT_APP_ENV=staging

.env.production
REACT_APP_API_URL=https://api.example.com
REACT_APP_ENV=production
```

### Exercise 2: Feature Flags
```javascript
// Create feature flag system with:
// - Toggle features without deploy
// - Control rollout percentage

// Your code
```

**Solution:**
```javascript
class FeatureFlags {
    async load() {
        const response = await fetch('/api/feature-flags');
        this.flags = await response.json();
    }
    
    isEnabled(name, userId) {
        const flag = this.flags[name];
        if (!flag) return false;
        
        // If percentage-based
        if (flag.rollout) {
            const hash = userId % 100;
            return hash < flag.rollout;
        }
        
        return flag.enabled;
    }
}
```

### Exercise 3: Deploy Script
```javascript
// Create script to:
// - Build app
// - Upload to S3
// - Invalidate cache

// Your code
```

**Solution:**
```bash
#!/bin/bash
npm run build
aws s3 sync dist/ s3://my-bucket/ --delete
aws cloudfront create-invalidation \
    --distribution-id E123ABC \
    --paths "/*"
echo "Deployment complete!"
```

---

## Interview Questions

### Theoretical Questions

**Q1: What is blue-green deployment?**
A: Running two production environments, switch between them.

**Q2: What is canary release?**
A: Gradual rollout to small percentage of users.

**Q3: When to do rollback?**
A: When production metrics degrade significantly.

**Q4: How to avoid downtime?**
A: Use blue-green or canary strategies.

**Q5: What is feature flag?**
A: Toggle feature without code deployment.

---

## Summary

- **Build:** Code splitting, tree shaking, bundle analysis
- **Environment:** Separate configs for dev/staging/prod
- **Deployment:** Manual or automated via CI/CD
- **Blue-Green:** Zero-downtime updates
- **Canary:** Gradual rollout to users
- **Pipeline:** Lint → Test → Build → Deploy
- **Monitoring:** Health checks, uptime, metrics
- **Rollback:** Keep previous version ready
- **Feature Flags:** Control rollout without deploy
- **SLA:** Track uptime and performance

**Next:** Interview mastery & system design!
