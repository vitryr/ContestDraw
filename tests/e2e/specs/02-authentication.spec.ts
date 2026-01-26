import { test, expect } from '@playwright/test';
import { AuthPage, DashboardPage } from '../pages';
import { testUsers } from '../fixtures/test-data';

test.describe('Scénario 2: Connexion (Email & OAuth)', () => {
  let authPage: AuthPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
    dashboardPage = new DashboardPage(page);
  });

  test.describe('Email Login', () => {
    test('should login with valid credentials', async ({ page }) => {
      await authPage.login(testUsers.free.email, testUsers.free.password);
      
      await authPage.expectLoginSuccess();
      await dashboardPage.expectLoaded();
    });

    test('should show error with invalid password', async ({ page }) => {
      await authPage.login(testUsers.free.email, 'WrongPassword123!');
      
      await authPage.expectError(/incorrect|invalid|invalide/i);
    });

    test('should show error with non-existent email', async ({ page }) => {
      await authPage.login('nonexistent@test.com', 'Test123!@#');
      
      await authPage.expectError(/existe pas|not found|introuvable/i);
    });

    test('should persist session after page reload', async ({ page }) => {
      await authPage.login(testUsers.free.email, testUsers.free.password);
      await authPage.expectLoginSuccess();
      
      // Reload the page
      await page.reload();
      
      // Should still be on dashboard
      await dashboardPage.expectLoaded();
    });

    test('should logout successfully', async ({ page }) => {
      await authPage.login(testUsers.free.email, testUsers.free.password);
      await authPage.expectLoginSuccess();
      
      await dashboardPage.logout();
      
      // Should be on landing or auth page
      await expect(page).toHaveURL(/\/$|\/auth/);
    });

    test('should apply rate limiting after multiple failed attempts', async ({ page }) => {
      // Attempt multiple failed logins
      for (let i = 0; i < 6; i++) {
        await authPage.login(testUsers.free.email, 'WrongPass!');
        await page.waitForTimeout(500);
      }
      
      // Should show rate limit error
      await authPage.expectError(/trop de tentatives|too many|rate limit|réessayez/i);
    });
  });

  test.describe('OAuth Login', () => {
    test('should show Google OAuth popup', async ({ page, context }) => {
      await authPage.goto();
      
      // Listen for popup
      const popupPromise = context.waitForEvent('page');
      
      await authPage.googleButton.click();
      
      const popup = await popupPromise;
      
      // Should open Google OAuth
      expect(popup.url()).toContain('accounts.google.com');
    });

    test('should show Facebook OAuth popup', async ({ page, context }) => {
      await authPage.goto();
      
      const popupPromise = context.waitForEvent('page');
      
      await authPage.facebookButton.click();
      
      const popup = await popupPromise;
      
      // Should open Facebook OAuth
      expect(popup.url()).toContain('facebook.com');
    });
  });

  test.describe('Session Management', () => {
    test('should redirect to auth when accessing protected route while logged out', async ({ page }) => {
      await page.goto('/dashboard');
      
      // Should redirect to auth
      await expect(page).toHaveURL(/\/auth|\/login/);
    });

    test('should remember user after closing browser (if remember me)', async ({ page }) => {
      await authPage.goto();
      
      // Check "Remember me" if exists
      const rememberMe = page.getByRole('checkbox', { name: /souvenir|remember/i });
      if (await rememberMe.isVisible()) {
        await rememberMe.check();
      }
      
      await authPage.login(testUsers.free.email, testUsers.free.password);
      await authPage.expectLoginSuccess();
      
      // Store cookies
      const cookies = await page.context().cookies();
      
      // Check for persistent cookie
      const authCookie = cookies.find(c => c.name.includes('token') || c.name.includes('session'));
      expect(authCookie).toBeTruthy();
    });
  });
});
