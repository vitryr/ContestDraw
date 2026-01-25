# 🚀 Quick Start Guide - Playwright Tests

## Prerequisites

1. **Backend running:** `http://localhost:3000`
2. **Frontend running:** `http://localhost:3001`
3. **Node.js:** v18+

## Installation (One-time)

```bash
cd /Users/romainvitry/Documents/Dev/ContestDraw/tests/e2e
npm install
npx playwright install
```

## Run Tests

```bash
# All tests
npm test

# Signup tests only
npm run test:signup

# Navigation tests only
npm run test:navigation

# See browser (headed mode)
npm run test:headed

# Debug mode
npm run test:debug

# View last report
npm run report
```

## Test Files

- **Signup:** `specs/signup-workflow.spec.ts` (35+ tests)
- **Navigation:** `specs/home-navigation.spec.ts` (35+ tests)

## Common Commands

| Task | Command |
|------|---------|
| Run all tests | `npm test` |
| Run with browser visible | `npm run test:headed` |
| Debug tests | `npm run test:debug` |
| View report | `npm run report` |
| Run in Chrome only | `npm run test:chromium` |
| Run in Firefox only | `npm run test:firefox` |
| Run mobile tests | `npm run test:mobile` |

## Test Structure

```
tests/e2e/
├── specs/           # Test files (*.spec.ts)
├── pages/           # Page Object Models
├── helpers/         # Test utilities
├── fixtures/        # Test data
└── playwright.config.ts
```

## Debugging Failed Tests

1. **View screenshot:** Check `test-results/` folder
2. **Watch video:** Check `test-results/` folder
3. **View trace:** `npx playwright show-trace test-results/trace.zip`
4. **Run in debug mode:** `npm run test:debug`

## Documentation

- **Full README:** `README.md`
- **Execution Guide:** `TEST_EXECUTION_GUIDE.md`
- **Project Docs:** `../../docs/PLAYWRIGHT_TEST_SUITE.md`

## Need Help?

1. Read error message carefully
2. Check screenshots in `test-results/`
3. Run in headed mode: `npm run test:headed`
4. Run in debug mode: `npm run test:debug`
5. Check documentation files

## Test Coverage

✅ 70+ test cases covering:
- User signup/registration
- Form validation
- Landing page navigation
- Mobile responsiveness
- Accessibility
- Error handling
