# Testing Documentation - ContestDraw

## Overview

Comprehensive testing infrastructure with **>80% code coverage** targeting across all layers.

## Test Structure

```
ContestDraw/
├── backend/tests/          # Backend tests (Jest)
│   ├── unit/              # Unit tests
│   ├── integration/       # API integration tests
│   ├── utils/             # Test utilities
│   └── setup.ts           # Jest configuration
├── frontend-web/tests/    # Frontend tests (Vitest)
│   ├── components/        # Component tests
│   ├── hooks/             # Hook tests
│   ├── integration/       # Integration tests
│   └── setup.ts           # Vitest configuration
├── tests/
│   ├── e2e/               # E2E tests (Playwright)
│   └── performance/       # Performance tests (K6)
└── .github/workflows/     # CI/CD pipelines
    └── test.yml           # GitHub Actions workflow
```

## Backend Tests (Jest)

### Configuration
**File:** `/Users/romainvitry/Documents/Dev/ContestDraw/backend/jest.config.js`

**Coverage Thresholds:**
- Branches: 80%
- Functions: 80%
- Lines: 80%
- Statements: 80%

### Unit Tests

#### 1. Authentication Service
**File:** `/Users/romainvitry/Documents/Dev/ContestDraw/backend/tests/unit/auth.service.test.ts`

**Tests:**
- User registration with password hashing
- Duplicate email validation
- Password strength requirements
- Login with JWT token generation
- Token verification and validation
- Password reset functionality

**Coverage:**
- ✅ register()
- ✅ login()
- ✅ verifyToken()
- ✅ resetPassword()

#### 2. Draw Service
**File:** `/Users/romainvitry/Documents/Dev/ContestDraw/backend/tests/unit/draw.service.test.ts`

**Tests:**
- Draw creation with validation
- Instagram URL format validation
- Winner count enforcement
- Filter application (likes, comments, follows)
- Random winner selection algorithm
- Eligibility verification
- Edge cases (insufficient participants)

**Coverage:**
- ✅ createDraw()
- ✅ executeDrawWithFilters()
- ✅ applyFilters()
- ✅ getDraw()

#### 3. Payment Service
**File:** `/Users/romainvitry/Documents/Dev/ContestDraw/backend/tests/unit/payment.service.test.ts`

**Tests:**
- Stripe checkout session creation
- Pricing tier calculations
- Webhook signature verification
- Payment event processing
- Credit balance calculation
- Credit deduction with validation
- Insufficient credit handling

**Coverage:**
- ✅ createCheckoutSession()
- ✅ handleWebhook()
- ✅ getCreditBalance()
- ✅ deductCredits()

#### 4. Instagram Service
**File:** `/Users/romainvitry/Documents/Dev/ContestDraw/backend/tests/unit/instagram.service.test.ts`

**Tests:**
- Fetch post likers with pagination
- Fetch post comments
- Bot comment filtering
- Follow status verification
- Post ID extraction from URLs
- Credential validation
- Rate limiting handling
- 2FA challenge detection

**Coverage:**
- ✅ fetchPostLikers()
- ✅ fetchPostComments()
- ✅ checkUserFollows()
- ✅ extractPostId()
- ✅ validateCredentials()

### Integration Tests

#### 1. Auth API Integration
**File:** `/Users/romainvitry/Documents/Dev/ContestDraw/backend/tests/integration/api/auth.integration.test.ts`

**Test Flows:**
- Complete registration → database verification
- Duplicate email rejection
- Email format validation
- Password requirement enforcement
- Login with valid credentials
- Invalid credentials rejection
- Token-based authentication
- Token refresh mechanism

**Database:** PostgreSQL test instance

#### 2. Draws API Integration
**File:** `/Users/romainvitry/Documents/Dev/ContestDraw/backend/tests/integration/api/draws.integration.test.ts`

**Test Flows:**
- Create draw → database persistence
- List user draws with filtering
- Draw execution → winner selection
- Credit deduction verification
- Insufficient credit handling
- Duplicate execution prevention
- Draw detail retrieval

**Database:** PostgreSQL test instance with transactions

### Test Utilities

#### Test Factories
**File:** `/Users/romainvitry/Documents/Dev/ContestDraw/backend/tests/utils/test-factories.ts`

**Factories:**
- `TestFactories.createUser()` - Mock user data
- `TestFactories.createDraw()` - Mock draw data
- `TestFactories.createParticipant()` - Mock participant
- `TestFactories.createWinner()` - Mock winner
- `TestFactories.createCredit()` - Mock credit transaction
- `TestFactories.createInstagramUser()` - Mock IG user
- `TestFactories.createMultiple()` - Bulk generation

#### Mock Helpers
**File:** `/Users/romainvitry/Documents/Dev/ContestDraw/backend/tests/utils/mock-helpers.ts`

**Helpers:**
- `MockHelpers.mockPrismaTransaction()` - Database mocks
- `MockHelpers.mockInstagramAPI()` - Instagram API mocks
- `MockHelpers.mockStripeSession()` - Stripe mocks
- `MockHelpers.mockRequest()` - Express request mocks
- `MockHelpers.mockResponse()` - Express response mocks

### Running Backend Tests

```bash
cd backend

# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test suite
npm test -- auth.service.test.ts

# Watch mode
npm test -- --watch

# Integration tests only
npm run test:integration
```

## Frontend Tests (Vitest + React Testing Library)

### Configuration
**File:** `/Users/romainvitry/Documents/Dev/ContestDraw/frontend-web/vitest.config.ts`

**Coverage Thresholds:**
- Branches: 80%
- Functions: 80%
- Lines: 80%
- Statements: 80%

### Component Tests

#### DrawAnimation Component
**File:** `/Users/romainvitry/Documents/Dev/ContestDraw/frontend-web/tests/components/DrawAnimation.test.tsx`

**Tests:**
- Animation container rendering
- Participant name display
- Animation completion callback
- Winner count verification
- Confetti effect display

### Hook Tests

#### useAuth Hook
**File:** `/Users/romainvitry/Documents/Dev/ContestDraw/frontend-web/tests/hooks/useAuth.test.ts`

**Tests:**
- Login with token storage
- Registration with auto-login
- Logout with state clearing
- Token persistence after reload
- Invalid token handling
- Loading state management

### Running Frontend Tests

```bash
cd frontend-web

# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Watch mode
npm test -- --watch

# UI mode
npm test -- --ui
```

## E2E Tests (Playwright)

### Configuration
**File:** `/Users/romainvitry/Documents/Dev/ContestDraw/tests/e2e/playwright.config.ts`

**Browsers:**
- Chromium (Desktop)
- Firefox (Desktop)
- WebKit (Safari)
- Mobile Chrome (Pixel 5)
- Mobile Safari (iPhone 12)

### Test Suites

#### 1. Authentication Flow
**File:** `/Users/romainvitry/Documents/Dev/ContestDraw/tests/e2e/auth-flow.spec.ts`

**Test Scenarios:**
- Complete registration process
- Login existing user
- Password validation errors
- Logout functionality
- Session persistence after reload

#### 2. Draw Creation Flow
**File:** `/Users/romainvitry/Documents/Dev/ContestDraw/tests/e2e/draw-creation.spec.ts`

**Test Scenarios:**
- Create new draw with filters
- Instagram URL validation
- Execute draw and view winners
- Download certificate PDF
- Insufficient credits error
- Filter configuration

### Running E2E Tests

```bash
cd tests/e2e

# Install Playwright browsers
npx playwright install

# Run all E2E tests
npx playwright test

# Run specific browser
npx playwright test --project=chromium

# Run in headed mode (see browser)
npx playwright test --headed

# Run specific test file
npx playwright test auth-flow.spec.ts

# Debug mode
npx playwright test --debug

# Generate report
npx playwright show-report
```

## Performance Tests (K6)

### Load Test
**File:** `/Users/romainvitry/Documents/Dev/ContestDraw/tests/performance/load-test.js`

**Scenario:**
- Ramp up: 10 → 50 → 100 users
- Duration: 4 minutes
- Thresholds:
  - 95% requests < 500ms
  - Failure rate < 1%

**Tests:**
- Draw creation
- Draw retrieval
- Draw listing
- Credit balance check

### Stress Test
**File:** `/Users/romainvitry/Documents/Dev/ContestDraw/tests/performance/stress-test.js`

**Scenario:**
- Ramp up: 100 → 500 → 1000 users
- Duration: 8 minutes
- Thresholds:
  - 99% requests < 2s
  - Failure rate < 5%

### Running Performance Tests

```bash
# Install k6
brew install k6  # macOS
# OR
sudo apt-get install k6  # Linux

# Run load test
k6 run tests/performance/load-test.js

# Run stress test
k6 run tests/performance/stress-test.js

# With custom base URL
BASE_URL=https://staging.example.com k6 run tests/performance/load-test.js

# Generate HTML report
k6 run --out json=results.json tests/performance/load-test.js
```

## CI/CD Integration (GitHub Actions)

### Workflow
**File:** `/Users/romainvitry/Documents/Dev/ContestDraw/.github/workflows/test.yml`

**Jobs:**

#### 1. Backend Tests
- Setup PostgreSQL test database
- Run Prisma migrations
- Execute unit tests with coverage
- Execute integration tests
- Upload coverage to Codecov

#### 2. Frontend Tests
- Install dependencies
- Run Vitest tests with coverage
- Upload coverage to Codecov

#### 3. E2E Tests
- Setup PostgreSQL
- Start backend server
- Start frontend dev server
- Run Playwright tests across browsers
- Upload test reports

#### 4. Performance Tests
- Install k6
- Run load tests on staging
- Upload performance results

#### 5. Test Summary
- Aggregate results from all jobs
- Generate summary report

### Triggers
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`
- Performance tests only on `main` pushes

## Coverage Reports

### Viewing Coverage

```bash
# Backend
cd backend
npm test -- --coverage
open coverage/lcov-report/index.html

# Frontend
cd frontend-web
npm test -- --coverage
open coverage/index.html
```

### CI Coverage
- Codecov integration for automated tracking
- Coverage reports on every PR
- Coverage badges in README

## Test Data Management

### Database Seeding
```bash
cd backend
npx prisma db seed
```

### Test Database Reset
```bash
cd backend
npm run test:db:reset
```

### Mock Data Generation
Use `TestFactories` for consistent test data:

```typescript
import { TestFactories } from '@tests/utils/test-factories';

const mockUsers = TestFactories.createMultiple(
  () => TestFactories.createUser(),
  10
);
```

## Best Practices

### 1. Test Organization
- **Unit tests**: Test individual functions/methods in isolation
- **Integration tests**: Test API endpoints with database
- **E2E tests**: Test complete user workflows
- **Performance tests**: Test under load conditions

### 2. Test Naming
```typescript
describe('ServiceName', () => {
  describe('methodName', () => {
    it('should do something when condition', () => {
      // Test implementation
    });
  });
});
```

### 3. AAA Pattern
```typescript
it('should calculate total correctly', () => {
  // Arrange
  const items = [1, 2, 3];

  // Act
  const result = calculateTotal(items);

  // Assert
  expect(result).toBe(6);
});
```

### 4. Test Independence
- Each test should be independent
- Use `beforeEach` for setup
- Use `afterEach` for cleanup
- No shared state between tests

### 5. Mock External Dependencies
- Mock APIs (Instagram, Stripe)
- Mock databases (use test DB)
- Mock file system operations
- Mock time-dependent functions

## Troubleshooting

### Common Issues

#### 1. Jest Timeout
```typescript
// Increase timeout for slow tests
jest.setTimeout(10000);
```

#### 2. Playwright Browser Install
```bash
npx playwright install --with-deps
```

#### 3. Database Connection
```bash
# Check PostgreSQL is running
pg_isready

# Reset test database
npm run test:db:reset
```

#### 4. Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

## Test Metrics

### Current Coverage Targets
- **Backend**: >80% (unit + integration)
- **Frontend**: >80% (components + hooks)
- **E2E**: Critical user paths
- **Performance**: P95 < 500ms

### Test Execution Times
- **Backend Unit**: ~2-3 minutes
- **Backend Integration**: ~3-5 minutes
- **Frontend**: ~1-2 minutes
- **E2E**: ~5-10 minutes
- **Performance**: ~5-10 minutes

## Future Enhancements

### Planned Additions
1. Visual regression testing (Percy/Chromatic)
2. Mobile app E2E tests (Appium/Detox)
3. Security testing (OWASP ZAP)
4. Accessibility testing (axe-core)
5. Contract testing (Pact)
6. Mutation testing (Stryker)

### Test Automation Goals
- Pre-commit hooks for fast tests
- Pre-push hooks for full test suite
- Automated test generation
- AI-powered test case generation

## Resources

### Documentation
- [Jest Documentation](https://jestjs.io/)
- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [K6 Documentation](https://k6.io/docs/)
- [Testing Library](https://testing-library.com/)

### Team Guidelines
- Write tests before implementation (TDD)
- Maintain >80% coverage
- Update tests with code changes
- Review test coverage in PRs
- Run full test suite before merging

---

**Created by:** Testing Engineer Agent
**Last Updated:** 2025-11-05
**Swarm Coordination:** swarm-1762353983518-ed1xkmbzy
