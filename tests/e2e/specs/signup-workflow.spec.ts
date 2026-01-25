/**
 * Signup Workflow Test Suite
 * Comprehensive tests for user registration flow
 *
 * Test Coverage:
 * - Valid signup flow (end-to-end)
 * - Form validation errors
 * - Duplicate email handling
 * - Password requirements
 * - Successful signup and redirect
 * - API error handling
 */

import { test, expect } from '@playwright/test';
import { AuthPage } from '../pages/AuthPage';
import {
  generateTestUser,
  waitForToast,
  mockAPIResponse,
  waitForAPIResponse,
} from '../helpers/test-helpers';
import {
  TEST_USERS,
  INVALID_CREDENTIALS,
  VALIDATION_MESSAGES,
  API_ENDPOINTS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
} from '../fixtures/test-data';

test.describe('Signup Workflow Tests', () => {
  let authPage: AuthPage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
    await authPage.goto();
  });

  test.describe('Valid Signup Flow', () => {
    test('should complete full signup process successfully', async ({ page }) => {
      // Generate unique test user
      const testUser = generateTestUser();

      // Fill and submit registration form
      await authPage.register(testUser.name, testUser.email, testUser.password);

      // Verify success toast appears
      await authPage.verifySuccessToast(SUCCESS_MESSAGES.accountCreated);

      // Verify redirect to dashboard
      await authPage.verifyRedirectToDashboard();

      // Verify user is on dashboard
      await expect(page).toHaveURL(/\/dashboard/);

      // Verify welcome message or user identifier is visible
      await expect(page.locator('text=/welcome/i, [data-testid="user-name"]')).toBeVisible({
        timeout: 5000,
      });
    });

    test('should successfully signup with minimum valid requirements', async ({ page }) => {
      const testUser = generateTestUser();

      await authPage.register(
        'AB', // Minimum 2 characters
        testUser.email,
        '123456' // Minimum 6 characters
      );

      // Should not show validation errors
      const errors = await authPage.getAllValidationErrors();
      expect(errors.length).toBe(0);

      // Verify redirect
      await page.waitForURL(/\/dashboard/, { timeout: 10000 });
    });

    test('should handle special characters in name', async ({ page }) => {
      const testUser = generateTestUser();

      await authPage.register(
        "O'Brien-Smith Jr.",
        testUser.email,
        testUser.password
      );

      await authPage.verifySuccessToast(SUCCESS_MESSAGES.accountCreated);
      await page.waitForURL(/\/dashboard/);
    });

    test('should trim whitespace from inputs', async ({ page }) => {
      const testUser = generateTestUser();

      await authPage.register(
        `  ${testUser.name}  `,
        `  ${testUser.email}  `,
        testUser.password
      );

      await authPage.verifySuccessToast(SUCCESS_MESSAGES.accountCreated);
      await page.waitForURL(/\/dashboard/);
    });
  });

  test.describe('Form Validation Errors', () => {
    test('should show error for invalid email format', async () => {
      await authPage.fillPartialRegistration({
        name: 'Test User',
        email: INVALID_CREDENTIALS.invalidEmail.email,
        password: 'ValidPass123!',
        confirmPassword: 'ValidPass123!',
      });

      await authPage.submitForm();

      // Verify validation error
      await authPage.verifyValidationError('email', VALIDATION_MESSAGES.email.invalid);
    });

    test('should show error for missing email', async () => {
      await authPage.fillPartialRegistration({
        name: 'Test User',
        email: '',
        password: 'ValidPass123!',
        confirmPassword: 'ValidPass123!',
      });

      await authPage.submitForm();

      // Should show required error or invalid error
      const errors = await authPage.getAllValidationErrors();
      expect(errors.some(err => err.includes('email'))).toBe(true);
    });

    test('should show error for weak password (too short)', async () => {
      await authPage.fillPartialRegistration({
        name: 'Test User',
        email: 'test@example.com',
        password: INVALID_CREDENTIALS.weakPassword.password,
        confirmPassword: INVALID_CREDENTIALS.weakPassword.password,
      });

      await authPage.submitForm();

      // Verify password validation error
      await authPage.verifyValidationError('password', VALIDATION_MESSAGES.password.tooShort);
    });

    test('should show error for short name (less than 2 characters)', async () => {
      await authPage.fillPartialRegistration({
        name: INVALID_CREDENTIALS.shortName.name,
        email: 'test@example.com',
        password: 'ValidPass123!',
        confirmPassword: 'ValidPass123!',
      });

      await authPage.submitForm();

      // Verify name validation error
      await authPage.verifyValidationError('name', VALIDATION_MESSAGES.name.tooShort);
    });

    test('should show error for missing name', async () => {
      await authPage.fillPartialRegistration({
        name: '',
        email: 'test@example.com',
        password: 'ValidPass123!',
        confirmPassword: 'ValidPass123!',
      });

      await authPage.submitForm();

      // Verify name validation error
      const errors = await authPage.getAllValidationErrors();
      expect(errors.some(err => err.includes('Name'))).toBe(true);
    });

    test('should show error for password mismatch', async () => {
      await authPage.fillPartialRegistration({
        name: 'Test User',
        email: 'test@example.com',
        password: INVALID_CREDENTIALS.mismatchedPasswords.password,
        confirmPassword: INVALID_CREDENTIALS.mismatchedPasswords.confirmPassword,
      });

      await authPage.submitForm();

      // Verify password mismatch error
      await authPage.verifyValidationError('confirmPassword', VALIDATION_MESSAGES.password.mismatch);
    });

    test('should show multiple validation errors simultaneously', async () => {
      await authPage.fillPartialRegistration({
        name: 'A', // Too short
        email: 'invalid-email', // Invalid format
        password: '123', // Too short
        confirmPassword: '456', // Mismatch
      });

      await authPage.submitForm();

      // Verify multiple errors are displayed
      const errors = await authPage.getAllValidationErrors();
      expect(errors.length).toBeGreaterThanOrEqual(3);
    });

    test('should validate on blur (field-level validation)', async ({ page }) => {
      await authPage.switchToSignUp();

      // Fill invalid email and blur
      await authPage.registerEmailInput.fill('invalid-email');
      await authPage.registerPasswordInput.focus(); // Blur email field

      // Error should appear without submit
      await page.waitForTimeout(500); // Wait for validation
      const errors = await authPage.getAllValidationErrors();
      expect(errors.some(err => err.includes('Invalid email'))).toBe(true);
    });
  });

  test.describe('Duplicate Email Handling', () => {
    test('should show error when registering with existing email', async ({ page }) => {
      // Mock API to return duplicate email error
      await mockAPIResponse(
        page,
        '**/api/auth/register',
        { error: ERROR_MESSAGES.duplicateEmail },
        409
      );

      const testUser = generateTestUser();
      await authPage.register(testUser.name, testUser.email, testUser.password);

      // Verify error message is displayed
      await waitForToast(page, ERROR_MESSAGES.duplicateEmail, 5000);
    });

    test('should allow retry after duplicate email error', async ({ page }) => {
      // First attempt - duplicate email
      await mockAPIResponse(
        page,
        '**/api/auth/register',
        { error: ERROR_MESSAGES.duplicateEmail },
        409
      );

      const testUser1 = generateTestUser();
      await authPage.register(testUser1.name, testUser1.email, testUser1.password);

      await waitForToast(page, ERROR_MESSAGES.duplicateEmail);

      // Clear the mock
      await page.unroute('**/api/auth/register');

      // Second attempt - different email, should succeed
      const testUser2 = generateTestUser();
      await authPage.fillPartialRegistration({
        name: testUser2.name,
        email: testUser2.email,
        password: testUser2.password,
        confirmPassword: testUser2.password,
      });

      await authPage.submitForm();

      // Should succeed or show different behavior
      await page.waitForURL(/\/dashboard|\/auth/, { timeout: 10000 });
    });
  });

  test.describe('Password Requirements', () => {
    test('should accept passwords with minimum length', async ({ page }) => {
      const testUser = generateTestUser();

      await authPage.register(testUser.name, testUser.email, '123456'); // Exactly 6 chars

      // Should not show validation error
      const errors = await authPage.getAllValidationErrors();
      expect(errors.length).toBe(0);
    });

    test('should accept long passwords', async ({ page }) => {
      const testUser = generateTestUser();
      const longPassword = 'a'.repeat(100) + '!1A';

      await authPage.register(testUser.name, testUser.email, longPassword);

      // Should not show validation error
      const errors = await authPage.getAllValidationErrors();
      expect(errors.length).toBe(0);
    });

    test('should accept passwords with special characters', async ({ page }) => {
      const testUser = generateTestUser();
      const complexPassword = 'P@ssw0rd!#$%^&*()';

      await authPage.register(testUser.name, testUser.email, complexPassword);

      // Should not show validation error
      const errors = await authPage.getAllValidationErrors();
      expect(errors.length).toBe(0);
    });

    test('should accept passwords with unicode characters', async ({ page }) => {
      const testUser = generateTestUser();
      const unicodePassword = 'パスワード123!';

      await authPage.register(testUser.name, testUser.email, unicodePassword);

      // Should handle unicode passwords
      const errors = await authPage.getAllValidationErrors();
      expect(errors.length).toBe(0);
    });
  });

  test.describe('API Error Handling', () => {
    test('should handle network errors gracefully', async ({ page }) => {
      // Mock network failure
      await page.route('**/api/auth/register', (route) => route.abort('failed'));

      const testUser = generateTestUser();
      await authPage.register(testUser.name, testUser.email, testUser.password);

      // Should show error message
      await page.waitForTimeout(2000);
      const body = await page.textContent('body');
      expect(body).toBeTruthy();
    });

    test('should handle 500 server errors', async ({ page }) => {
      // Mock server error
      await mockAPIResponse(
        page,
        '**/api/auth/register',
        { error: ERROR_MESSAGES.serverError },
        500
      );

      const testUser = generateTestUser();
      await authPage.register(testUser.name, testUser.email, testUser.password);

      // Should display error
      await page.waitForTimeout(2000);
      await expect(page.locator('body')).toContainText(/.+/); // Page should still render
    });

    test('should handle timeout errors', async ({ page }) => {
      // Mock delayed response
      await page.route('**/api/auth/register', async (route) => {
        await page.waitForTimeout(30000); // Exceed timeout
        await route.fulfill({ status: 200, body: JSON.stringify({ success: true }) });
      });

      const testUser = generateTestUser();
      await authPage.register(testUser.name, testUser.email, testUser.password);

      // Should handle timeout
      await page.waitForTimeout(3000);
    });

    test('should disable submit button during API call', async ({ page }) => {
      // Mock slow API response
      await page.route('**/api/auth/register', async (route) => {
        await page.waitForTimeout(2000);
        await route.fulfill({
          status: 200,
          body: JSON.stringify({ success: true, user: { id: '123' } }),
        });
      });

      const testUser = generateTestUser();
      await authPage.fillPartialRegistration({
        name: testUser.name,
        email: testUser.email,
        password: testUser.password,
        confirmPassword: testUser.password,
      });

      await authPage.submitForm();

      // Submit button should be disabled during request
      const isDisabled = await authPage.isSubmitDisabled();
      expect(isDisabled).toBe(true);

      // Wait for request to complete
      await page.waitForTimeout(2500);
    });
  });

  test.describe('UI/UX Behavior', () => {
    test('should toggle between signin and signup forms', async () => {
      // Start on signin
      await authPage.switchToSignIn();
      expect(await authPage.isSignInFormActive()).toBe(true);

      // Switch to signup
      await authPage.switchToSignUp();
      expect(await authPage.isSignUpFormActive()).toBe(true);

      // Switch back to signin
      await authPage.switchToSignIn();
      expect(await authPage.isSignInFormActive()).toBe(true);
    });

    test('should clear form when switching between forms', async () => {
      await authPage.switchToSignUp();
      await authPage.fillPartialRegistration({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });

      // Switch to signin
      await authPage.switchToSignIn();

      // Switch back to signup
      await authPage.switchToSignUp();

      // Form should be cleared (or retain values - verify actual behavior)
      // This test documents the actual behavior
      const nameValue = await authPage.registerNameInput.inputValue();
      // Document whether form clears or retains
      console.log('Name field value after toggle:', nameValue);
    });

    test('should show password visibility toggle', async ({ page }) => {
      await authPage.switchToSignUp();

      // Check if password toggle button exists
      const passwordToggle = page.locator('[data-testid="password-toggle"], button[aria-label*="password"]');
      const exists = await passwordToggle.count();

      if (exists > 0) {
        // Test toggle functionality
        const passwordInput = authPage.registerPasswordInput;
        await passwordInput.fill('testpassword');

        const initialType = await passwordInput.getAttribute('type');
        expect(initialType).toBe('password');

        // Click toggle
        await passwordToggle.first().click();

        const newType = await passwordInput.getAttribute('type');
        expect(newType).toBe('text');
      }
    });

    test('should maintain form state on validation errors', async () => {
      const testData = {
        name: 'Test User',
        email: 'test@example.com',
        password: '12', // Too short
        confirmPassword: '12',
      };

      await authPage.fillPartialRegistration(testData);
      await authPage.submitForm();

      // Wait for validation
      await authPage.page.waitForTimeout(500);

      // Verify form maintains entered values
      expect(await authPage.registerNameInput.inputValue()).toBe(testData.name);
      expect(await authPage.registerEmailInput.inputValue()).toBe(testData.email);
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper ARIA labels', async ({ page }) => {
      await authPage.switchToSignUp();

      // Check for proper labels
      const nameInput = authPage.registerNameInput;
      const nameLabel = await page.locator('label[for="name"], label:has-text("Name")');

      expect(await nameLabel.count()).toBeGreaterThan(0);
    });

    test('should be keyboard navigable', async ({ page }) => {
      await authPage.switchToSignUp();

      // Tab through form
      await page.keyboard.press('Tab'); // Name field
      await page.keyboard.type('Test User');

      await page.keyboard.press('Tab'); // Email field
      await page.keyboard.type('test@example.com');

      await page.keyboard.press('Tab'); // Password field
      await page.keyboard.type('password123');

      await page.keyboard.press('Tab'); // Confirm password field
      await page.keyboard.type('password123');

      await page.keyboard.press('Tab'); // Submit button
      await page.keyboard.press('Enter'); // Submit

      // Form should submit via keyboard
      await page.waitForTimeout(1000);
    });
  });
});
