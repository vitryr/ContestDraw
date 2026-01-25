# Test Execution Guide

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Running Tests](#running-tests)
4. [Test Reports](#test-reports)
5. [Debugging Failed Tests](#debugging-failed-tests)
6. [CI/CD Integration](#cicd-integration)
7. [Troubleshooting](#troubleshooting)

## ✅ Prerequisites

Before running tests, ensure:

1. **Node.js installed** (v18 or higher)
   ```bash
   node --version
   ```

2. **Backend server running**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm run dev
   # Should be running on http://localhost:3000
   ```

3. **Frontend server running**
   ```bash
   # Terminal 2 - Frontend
   cd frontend-web
   npm run dev
   # Should be running on http://localhost:3001
   ```

4. **Database running**
   ```bash
   # If using Docker
   docker-compose up -d postgres redis
   ```

## 📦 Installation

### 1. Install Playwright (if needed)

```bash
cd tests/e2e
npm install
```

### 2. Install Browsers

```bash
# Install all browsers
npx playwright install

# Or install specific browsers
npx playwright install chromium
npx playwright install firefox
npx playwright install webkit
```

### 3. Verify Installation

```bash
npx playwright --version
```

## 🚀 Running Tests

### Basic Test Execution

```bash
# Run all tests
npm test

# Run all tests in parallel (faster)
npm test -- --workers=4

# Run tests in serial (one at a time)
npm test -- --workers=1
```

### Run Specific Test Suites

```bash
# Signup workflow tests only
npm run test:signup

# Navigation tests only
npm run test:navigation

# Run specific test file
npx playwright test specs/signup-workflow.spec.ts
```

### Run Specific Test Cases

```bash
# Run tests matching pattern
npx playwright test -g "should complete full signup"

# Run single test by line number
npx playwright test specs/signup-workflow.spec.ts:42
```

### Browser-Specific Testing

```bash
# Run in Chromium only
npm run test:chromium

# Run in Firefox only
npm run test:firefox

# Run in WebKit only
npm run test:webkit

# Run in all browsers
npm test -- --project=chromium --project=firefox --project=webkit
```

### Mobile Testing

```bash
# Run mobile tests
npm run test:mobile

# Run on specific mobile device
npx playwright test --project="Mobile Chrome"
npx playwright test --project="Mobile Safari"
```

### Development Mode

```bash
# Run with browser visible (headed mode)
npm run test:headed

# Run with UI mode (interactive)
npm run test:ui

# Run in debug mode
npm run test:debug

# Run specific test in debug mode
npx playwright test specs/signup-workflow.spec.ts:42 --debug
```

### Watch Mode

```bash
# Watch mode (not built-in, but can use)
npx playwright test --watch
```

## 📊 Test Reports

### View HTML Report

After running tests:

```bash
# Open last test report
npm run report

# Or manually
npx playwright show-report
```

The HTML report includes:
- Test execution summary
- Pass/fail status
- Screenshots of failures
- Videos of failures
- Full test traces
- Execution time

### Report Formats

Playwright generates multiple report formats:

1. **HTML Report** - `playwright-report/index.html`
   - Interactive web-based report
   - Screenshots and videos
   - Full traces

2. **JSON Report** - `test-results.json`
   - Machine-readable results
   - For CI/CD integration

3. **Console Output**
   - Real-time test execution
   - Pass/fail status
   - Execution time

### CI/CD Reports

In CI environments, reports are saved as artifacts:

```yaml
# GitHub Actions example
- uses: actions/upload-artifact@v3
  if: always()
  with:
    name: playwright-report
    path: playwright-report/
```

## 🐛 Debugging Failed Tests

### 1. View Failure Screenshot

Failed tests automatically capture screenshots:

```
test-results/
  signup-workflow-should-complete-signup-chromium/
    test-failed-1.png
```

View the screenshot to see what went wrong.

### 2. Watch Failure Video

Failed tests automatically record videos:

```
test-results/
  signup-workflow-should-complete-signup-chromium/
    video.webm
```

Play the video to see the entire test execution.

### 3. Inspect Test Trace

Traces provide detailed execution information:

```bash
# Open trace viewer
npx playwright show-trace test-results/path-to-trace.zip
```

The trace shows:
- Every action taken
- Screenshots at each step
- Network requests
- Console logs
- DOM snapshots

### 4. Run in Headed Mode

See the test execution in real browser:

```bash
npx playwright test specs/signup-workflow.spec.ts --headed
```

### 5. Use Debug Mode

Step through test execution:

```bash
# Debug specific test
npx playwright test specs/signup-workflow.spec.ts:42 --debug

# Playwright Inspector will open
# You can step through each action
```

### 6. Add Debug Points in Code

```typescript
test('my test', async ({ page }) => {
  await page.goto('/');

  // Pause test execution here
  await page.pause();

  await page.click('button');
});
```

### 7. Console Logging

```typescript
test('my test', async ({ page }) => {
  // Log current URL
  console.log('Current URL:', page.url());

  // Log element state
  const button = page.locator('button');
  console.log('Button visible:', await button.isVisible());

  // Take screenshot for inspection
  await page.screenshot({ path: 'debug.png', fullPage: true });
});
```

### 8. Slow Motion

Run tests in slow motion:

```bash
# Slow down execution by 1000ms per action
npx playwright test --headed --slow-mo=1000
```

## 🔄 CI/CD Integration

### GitHub Actions

Create `.github/workflows/e2e-tests.yml`:

```yaml
name: E2E Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379

    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: |
          cd backend && npm ci
          cd ../frontend-web && npm ci
          cd ../tests/e2e && npm ci

      - name: Install Playwright Browsers
        run: |
          cd tests/e2e
          npx playwright install --with-deps

      - name: Start Backend
        run: |
          cd backend
          npm run build
          npm start &
          sleep 5
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/testdb
          REDIS_URL: redis://localhost:6379

      - name: Start Frontend
        run: |
          cd frontend-web
          npm run build
          npm run preview &
          sleep 5

      - name: Run E2E Tests
        run: |
          cd tests/e2e
          npm test
        env:
          BASE_URL: http://localhost:3001

      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: tests/e2e/playwright-report/
          retention-days: 30

      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: test-results
          path: tests/e2e/test-results/
          retention-days: 30
```

### GitLab CI

Create `.gitlab-ci.yml`:

```yaml
e2e-tests:
  image: mcr.microsoft.com/playwright:v1.40.0-focal
  stage: test
  services:
    - postgres:15
    - redis:7
  variables:
    DATABASE_URL: postgresql://postgres:postgres@postgres:5432/testdb
    REDIS_URL: redis://redis:6379
  script:
    - cd backend && npm ci && npm run build && npm start &
    - cd frontend-web && npm ci && npm run build && npm run preview &
    - sleep 10
    - cd tests/e2e && npm ci
    - npx playwright test
  artifacts:
    when: always
    paths:
      - tests/e2e/playwright-report/
      - tests/e2e/test-results/
    expire_in: 30 days
```

### Jenkins

```groovy
pipeline {
    agent any

    stages {
        stage('Install') {
            steps {
                sh 'cd tests/e2e && npm ci'
                sh 'cd tests/e2e && npx playwright install --with-deps'
            }
        }

        stage('Start Services') {
            steps {
                sh 'docker-compose up -d'
                sh 'cd backend && npm start &'
                sh 'cd frontend-web && npm start &'
                sh 'sleep 10'
            }
        }

        stage('Test') {
            steps {
                sh 'cd tests/e2e && npm test'
            }
        }
    }

    post {
        always {
            publishHTML([
                reportDir: 'tests/e2e/playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright Report'
            ])
            archiveArtifacts artifacts: 'tests/e2e/test-results/**/*'
        }
    }
}
```

## 🔧 Troubleshooting

### Common Issues

#### 1. **Tests timing out**

**Problem:** Tests exceed 30s timeout

**Solutions:**
```typescript
// Increase timeout for specific test
test('slow test', async ({ page }) => {
  test.setTimeout(60000); // 60 seconds
});

// Or globally in playwright.config.ts
export default defineConfig({
  timeout: 60000
});
```

#### 2. **Element not found**

**Problem:** `Error: locator.click: Timeout 30000ms exceeded`

**Solutions:**
```typescript
// Wait for element
await page.waitForSelector('button', { timeout: 10000 });

// Check if element exists
const exists = await page.locator('button').count() > 0;

// Use more specific selector
await page.locator('button[data-testid="submit"]').click();
```

#### 3. **Flaky tests**

**Problem:** Tests pass sometimes, fail others

**Solutions:**
```typescript
// Wait for network to settle
await page.waitForLoadState('networkidle');

// Wait for specific condition
await page.waitForFunction(() => document.readyState === 'complete');

// Add retry logic
await expect(async () => {
  await page.click('button');
}).toPass({ timeout: 10000 });
```

#### 4. **Port already in use**

**Problem:** `Error: listen EADDRINUSE: address already in use`

**Solutions:**
```bash
# Find process using port
lsof -i :3001

# Kill process
kill -9 <PID>

# Or use different port
BASE_URL=http://localhost:3002 npm test
```

#### 5. **Browser not installed**

**Problem:** `Error: browserType.launch: Executable doesn't exist`

**Solutions:**
```bash
# Install browsers
npx playwright install

# Install with system dependencies
npx playwright install --with-deps

# Install specific browser
npx playwright install chromium
```

#### 6. **Database connection errors**

**Problem:** Tests fail due to database issues

**Solutions:**
```bash
# Check database is running
docker-compose ps

# Check connection
psql -h localhost -U postgres -d testdb

# Reset database
npm run prisma:reset
```

#### 7. **Network request failures**

**Problem:** API calls fail during tests

**Solutions:**
```typescript
// Mock API responses
await page.route('**/api/**', route => {
  route.fulfill({
    status: 200,
    body: JSON.stringify({ success: true })
  });
});

// Add retry logic
await page.waitForResponse(
  response => response.url().includes('/api/') && response.status() === 200,
  { timeout: 10000 }
);
```

### Getting Help

1. **Check test output** - Read error messages carefully
2. **View screenshots** - Look at failure screenshots
3. **Watch videos** - Review test execution videos
4. **Inspect traces** - Use trace viewer for detailed info
5. **Run in debug mode** - Step through test execution
6. **Check documentation** - Review Playwright docs
7. **Search issues** - Look for similar issues on GitHub
8. **Ask team** - Contact development team

### Useful Commands

```bash
# Clear test results
rm -rf test-results/ playwright-report/

# Clear Playwright cache
rm -rf ~/.cache/ms-playwright

# Reinstall everything
npm ci && npx playwright install --with-deps

# Check Playwright version
npx playwright --version

# List installed browsers
npx playwright install --dry-run

# Generate new tests
npm run codegen

# Update snapshots
npm test -- --update-snapshots
```

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Test README](./README.md)
- [Project Documentation](../../README.md)
