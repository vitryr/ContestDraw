import { Page } from '@playwright/test';
import { testUsers } from '../fixtures/test-data';

/**
 * Helper to login a user before tests
 */
export async function loginAsUser(
  page: Page,
  user: keyof typeof testUsers = 'free'
): Promise<void> {
  const userData = testUsers[user];
  
  await page.goto('/auth');
  
  // Click login tab if needed
  const loginTab = page.getByRole('tab', { name: /connexion|login|sign in/i });
  if (await loginTab.isVisible()) {
    await loginTab.click();
  }
  
  await page.getByRole('textbox', { name: /email/i }).fill(userData.email);
  await page.getByLabel(/^mot de passe|^password/i).fill(userData.password);
  await page.getByRole('button', { name: /se connecter|login|sign in/i }).click();
  
  // Wait for redirect to dashboard
  await page.waitForURL(/\/dashboard/, { timeout: 10000 });
}

/**
 * Setup authenticated state for test file
 */
export async function setupAuthenticatedUser(
  page: Page,
  user: keyof typeof testUsers = 'free'
): Promise<void> {
  await loginAsUser(page, user);
}

/**
 * Clear auth state
 */
export async function clearAuthState(page: Page): Promise<void> {
  await page.context().clearCookies();
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
}
