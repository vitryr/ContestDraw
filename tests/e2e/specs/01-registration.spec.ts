import { test, expect } from '@playwright/test';
import { AuthPage } from '../pages';
import { newUser, testUsers } from '../fixtures/test-data';

test.describe('Scénario 1: Inscription & Onboarding', () => {
  let authPage: AuthPage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
  });

  test('should complete full registration process', async ({ page }) => {
    const user = newUser();
    
    await authPage.register(user);
    
    // Should redirect to dashboard or show verification message
    await authPage.expectRegistrationSuccess();
  });

  test('should show 3 free credits after registration', async ({ page }) => {
    const user = newUser();
    
    await authPage.register(user);
    
    // Wait for dashboard
    await page.waitForURL(/\/dashboard/, { timeout: 15000 });
    
    // Check credits display
    const credits = page.locator('[data-testid="credits-display"], .credits-count');
    await expect(credits).toContainText(/3|trois/i);
  });

  test('should reject weak password', async ({ page }) => {
    await authPage.goto();
    await authPage.register({
      email: 'test@test.com',
      password: '123', // Too weak
    });
    
    await authPage.expectError(/password|mot de passe/i);
  });

  test('should reject password without uppercase', async ({ page }) => {
    await authPage.goto();
    await authPage.register({
      email: 'test@test.com',
      password: 'testtest123!', // No uppercase
    });
    
    await authPage.expectError(/majuscule|uppercase/i);
  });

  test('should reject password without number', async ({ page }) => {
    await authPage.goto();
    await authPage.register({
      email: 'test@test.com',
      password: 'TestTest!!', // No number
    });
    
    await authPage.expectError(/chiffre|number|digit/i);
  });

  test('should reject password without special character', async ({ page }) => {
    await authPage.goto();
    await authPage.register({
      email: 'test@test.com',
      password: 'TestTest123', // No special char
    });
    
    await authPage.expectError(/spécial|special/i);
  });

  test('should reject existing email', async ({ page }) => {
    // Try to register with an already existing email
    await authPage.register({
      email: testUsers.free.email,
      password: 'Test123!@#',
    });
    
    await authPage.expectError(/existe|already|déjà/i);
  });

  test('should reject invalid email format', async ({ page }) => {
    await authPage.goto();
    await authPage.register({
      email: 'not-an-email',
      password: 'Test123!@#',
    });
    
    await authPage.expectError(/email|invalide|invalid/i);
  });

  test('should show onboarding modal on first login', async ({ page }) => {
    const user = newUser();
    
    await authPage.register(user);
    
    // Wait for dashboard
    await page.waitForURL(/\/dashboard/, { timeout: 15000 });
    
    // Should show onboarding/welcome modal
    const welcomeModal = page.locator('[data-testid="onboarding-modal"], .welcome-modal, text=/bienvenue|welcome/i');
    await expect(welcomeModal).toBeVisible({ timeout: 5000 });
  });
});
