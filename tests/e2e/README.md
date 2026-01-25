# E2E Testing Documentation

## Overview

This directory contains comprehensive end-to-end tests for the ContestDraw platform using Playwright. The tests cover critical user flows including signup/authentication and landing page navigation.

## 🚀 Quick Start

### Installation

Playwright is already installed. If you need to reinstall browsers:

```bash
cd /Users/romainvitry/Documents/Dev/ContestDraw/tests/e2e
npx playwright install
```

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npx playwright test specs/signup-workflow.spec.ts

# Run tests in headed mode (see browser)
npx playwright test --headed

# Run tests in debug mode
npx playwright test --debug

# Run tests in specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Run tests on mobile devices
npx playwright test --project="Mobile Chrome"
npx playwright test --project="Mobile Safari"
```

### Viewing Test Reports

```bash
# Open last test report
npx playwright show-report

# View specific report
npx playwright show-report playwright-report
```

## 📁 Directory Structure

```
tests/e2e/
├── specs/                      # Test specifications
│   ├── signup-workflow.spec.ts # Signup/registration tests
│   └── home-navigation.spec.ts # Landing page navigation tests
├── pages/                      # Page Object Models
│   ├── AuthPage.ts            # Authentication page POM
│   └── LandingPage.ts         # Landing page POM
├── helpers/                    # Test utilities
│   └── test-helpers.ts        # Reusable helper functions
├── fixtures/                   # Test data
│   └── test-data.ts           # Centralized test data
├── playwright.config.ts        # Playwright configuration
└── README.md                   # This file
```

## 🧪 Test Suites

### 1. Signup Workflow Tests (`specs/signup-workflow.spec.ts`)

Comprehensive tests for user registration:

- ✅ **Valid Signup Flow**
  - Complete end-to-end registration
  - Minimum valid requirements
  - Special characters in name
  - Whitespace trimming

- ✅ **Form Validation Errors**
  - Invalid email format
  - Missing required fields
  - Weak passwords
  - Password mismatch
  - Multiple validation errors
  - Field-level validation on blur

- ✅ **Duplicate Email Handling**
  - Error on existing email
  - Retry after duplicate error

- ✅ **Password Requirements**
  - Minimum length validation
  - Long passwords
  - Special characters
  - Unicode characters

- ✅ **API Error Handling**
  - Network errors
  - Server errors (500)
  - Timeout errors
  - Button disabled during API call

- ✅ **UI/UX Behavior**
  - Toggle between signin/signup
  - Form state management
  - Password visibility toggle
  - Form persistence on errors

- ✅ **Accessibility**
  - ARIA labels
  - Keyboard navigation

**Total Test Cases: 35+**

### 2. Home Navigation Tests (`specs/home-navigation.spec.ts`)

Comprehensive tests for landing page navigation:

- ✅ **Page Load and Initial State**
  - Successful page load
  - All main sections display
  - Valid page title
  - SEO meta tags

- ✅ **Anchor Links and Smooth Scrolling**
  - Scroll to features section
  - Scroll to how-it-works section
  - All anchor links tested
  - Hash navigation via URL

- ✅ **Navigation Menu Links**
  - Pricing page navigation
  - FAQ page navigation
  - CTA button functionality
  - All menu links tested
  - Active navigation states

- ✅ **External Links**
  - Open in new tab
  - Security attributes (noopener)
  - Social media links
  - No navigation away

- ✅ **Page Redirections**
  - CTA redirects
  - Logo click returns home
  - Browser back/forward navigation
  - All internal links tested

- ✅ **Mobile Navigation**
  - Mobile menu button
  - Menu open/close
  - Mobile navigation links
  - Viewport changes

- ✅ **Responsive Design**
  - Tablet responsiveness
  - Mobile responsiveness
  - Desktop responsiveness
  - Cross-viewport functionality

- ✅ **Keyboard Navigation**
  - Tab key navigation
  - Enter key activation
  - Skip to main content

- ✅ **Performance and Loading**
  - Load time validation
  - No broken images
  - Lazy loading

**Total Test Cases: 35+**

## 🎯 Page Object Models (POMs)

### AuthPage (`pages/AuthPage.ts`)

Encapsulates authentication page interactions:

**Methods:**
- `goto()` - Navigate to auth page
- `switchToSignUp()` - Switch to registration form
- `switchToSignIn()` - Switch to login form
- `login(email, password)` - Complete login
- `register(name, email, password, confirmPassword)` - Complete registration
- `verifyValidationError(field, message)` - Check validation errors
- `verifySuccessToast(message)` - Verify success notification
- `verifyRedirectToDashboard()` - Check redirect after auth
- `fillPartialRegistration(fields)` - Fill form partially for testing
- `submitForm()` - Submit current form
- `isSignInFormActive()` - Check which form is active
- `isSignUpFormActive()` - Check which form is active
- `getAllValidationErrors()` - Get all error messages
- `isSubmitDisabled()` - Check button state

### LandingPage (`pages/LandingPage.ts`)

Encapsulates landing page interactions:

**Methods:**
- `goto()` - Navigate to landing page
- `verifyHeroSection()` - Verify hero section visibility
- `clickCtaButton()` - Click CTA button
- `scrollToFeatures()` - Scroll to features section
- `scrollToHowItWorks()` - Scroll to how-it-works section
- `goToPricing()` - Navigate to pricing page
- `goToFaq()` - Navigate to FAQ page
- `getAllNavigationLinks()` - Get all nav links
- `getAllAnchorLinks()` - Get all page links
- `verifySmoothScrollTo(sectionId)` - Test smooth scrolling
- `testAllInternalLinks()` - Test all internal navigation
- `testAllAnchorLinks()` - Test all anchor links
- `verifyExternalLinks()` - Verify external link attributes
- `testMobileNavigation()` - Test mobile menu
- `verifyFeatureCards(count)` - Verify feature cards
- `verifyFooter()` - Verify footer content
- `verifySocialLinks()` - Verify social media links
- `getPageTitle()` - Get page title
- `verifySEOTags()` - Verify SEO meta tags

## 🛠 Helper Functions (`helpers/test-helpers.ts`)

Reusable utility functions:

- `waitForNetworkIdle(page, timeout)` - Wait for network idle state
- `waitForElement(page, selector, timeout)` - Wait for element visibility
- `clearAndFill(page, selector, value)` - Clear and fill input
- `generateTestUser()` - Generate unique test credentials
- `generateRandomString(length)` - Generate random string
- `elementExists(page, selector)` - Check element existence
- `takeTimestampedScreenshot(page, name)` - Screenshot with timestamp
- `waitForToast(page, message, timeout)` - Wait for toast notification
- `expectUrlPattern(page, pattern)` - Verify URL pattern
- `verifyTextContent(page, selector, text)` - Verify element text
- `verifyValidationError(page, field, message)` - Verify form errors
- `isExternalLink(href)` - Check if link is external
- `scrollToElement(page, selector, behavior)` - Smooth scroll to element
- `waitForAPIResponse(page, urlPattern, timeout)` - Wait for API response
- `mockAPIResponse(page, urlPattern, data, status)` - Mock API responses
- `isVisible(page, selector)` - Check element visibility
- `getAllLinks(page)` - Get all links on page
- `hasMetaTag(page, property, content)` - Check for meta tags

## 📊 Test Data (`fixtures/test-data.ts`)

Centralized test data for consistent testing:

- **TEST_USERS** - Valid and test user credentials
- **INVALID_CREDENTIALS** - Invalid data for validation tests
- **VALIDATION_MESSAGES** - Expected validation error messages
- **API_ENDPOINTS** - API endpoint URLs
- **ROUTES** - Application routes
- **TIMEOUTS** - Standard timeout values
- **ERROR_MESSAGES** - Expected error messages
- **SUCCESS_MESSAGES** - Expected success messages
- **LANDING_PAGE_SECTIONS** - Landing page section selectors
- **NAVIGATION_LINKS** - Expected navigation links
- **EXTERNAL_LINKS** - External link patterns
- **BROWSER_VIEWPORTS** - Standard viewport sizes
- **TEST_CONFIG** - Test configuration

## 🐛 Debugging

### View Test in Browser

```bash
# Run in headed mode
npx playwright test --headed

# Run in debug mode (step through)
npx playwright test --debug

# Run specific test in debug mode
npx playwright test specs/signup-workflow.spec.ts:35 --debug
```

### View Test Traces

When tests fail, traces are automatically captured:

```bash
# Open trace viewer
npx playwright show-trace test-results/path-to-trace.zip
```

### Screenshots and Videos

Failed tests automatically capture:
- Screenshots (saved to `test-results/`)
- Videos (saved to `test-results/`)

### Common Issues

#### 1. **Tests timing out**

```typescript
// Increase timeout for specific test
test('slow test', async ({ page }) => {
  test.setTimeout(60000); // 60 seconds
  // ... test code
});
```

#### 2. **Element not found**

```bash
# Run with --debug to see what's on page
npx playwright test --debug

# Take screenshot to inspect
await page.screenshot({ path: 'debug.png', fullPage: true });
```

#### 3. **Network errors**

```bash
# Check if backend is running
curl http://localhost:3000/api/health

# Check if frontend is running
curl http://localhost:3001
```

#### 4. **Flaky tests**

```typescript
// Use waitFor methods
await page.waitForSelector('text=Success');
await page.waitForLoadState('networkidle');

// Add explicit waits
await page.waitForTimeout(500);
```

## ⚙️ Configuration

### Playwright Config (`playwright.config.ts`)

```typescript
{
  testDir: './',
  baseURL: 'http://localhost:3001',
  timeout: 30000,
  retries: 2 (in CI),
  workers: 1 (in CI), undefined (local),
  projects: [
    'chromium',
    'firefox',
    'webkit',
    'Mobile Chrome',
    'Mobile Safari'
  ]
}
```

### Environment Variables

```bash
# Set custom base URL
BASE_URL=http://localhost:3001 npx playwright test

# Set API base URL
API_BASE_URL=http://localhost:3000 npx playwright test

# Run in CI mode
CI=true npx playwright test
```

## 📈 Test Coverage

### Current Coverage

- **Signup Flow:** 35+ test cases
- **Navigation:** 35+ test cases
- **Total:** 70+ test cases

### Coverage Areas

- ✅ Happy path scenarios
- ✅ Form validation
- ✅ Error handling
- ✅ Edge cases
- ✅ Mobile responsiveness
- ✅ Keyboard navigation
- ✅ Accessibility
- ✅ Performance
- ✅ SEO

## 🚀 CI/CD Integration

### GitHub Actions Example

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - name: Install dependencies
        run: npm ci
      - name: Install Playwright
        run: npx playwright install --with-deps
      - name: Run tests
        run: npm test
      - uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
```

## 📝 Writing New Tests

### 1. Create Test File

```typescript
// tests/e2e/specs/my-feature.spec.ts
import { test, expect } from '@playwright/test';
import { MyPage } from '../pages/MyPage';

test.describe('My Feature', () => {
  test('should do something', async ({ page }) => {
    const myPage = new MyPage(page);
    await myPage.goto();
    // ... test steps
  });
});
```

### 2. Create Page Object Model

```typescript
// tests/e2e/pages/MyPage.ts
import { Page, Locator } from '@playwright/test';

export class MyPage {
  readonly page: Page;
  readonly myButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.myButton = page.locator('button#my-button');
  }

  async goto() {
    await this.page.goto('/my-page');
  }

  async clickButton() {
    await this.myButton.click();
  }
}
```

### 3. Add Test Data

```typescript
// tests/e2e/fixtures/test-data.ts
export const MY_FEATURE_DATA = {
  valid: { /* ... */ },
  invalid: { /* ... */ }
};
```

## 🔍 Best Practices

1. **Use Page Object Models** - Encapsulate page interactions
2. **Use Test Data Fixtures** - Centralize test data
3. **Use Helper Functions** - Reuse common functionality
4. **Write Clear Test Names** - Describe what is being tested
5. **Test One Thing** - Each test should verify one behavior
6. **Use Proper Waits** - Wait for elements/network/state
7. **Clean Up After Tests** - Reset state if needed
8. **Handle Flaky Tests** - Add retries and better waits
9. **Document Complex Tests** - Add comments for clarity
10. **Keep Tests Independent** - Tests should not depend on each other

## 📚 Resources

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [Playwright Debugging](https://playwright.dev/docs/debug)
- [Playwright Test Patterns](https://playwright.dev/docs/test-patterns)

## 🤝 Contributing

When adding new tests:

1. Follow the existing structure
2. Use Page Object Models
3. Add test data to fixtures
4. Use helper functions
5. Write clear, descriptive test names
6. Add documentation
7. Ensure tests are independent
8. Run tests locally before committing

## 📞 Support

For issues or questions:
- Check existing test examples
- Review Playwright documentation
- Check test output and traces
- Contact the development team
