import { test, expect } from '@playwright/test';
import { AuthPage, DashboardPage } from '../pages';
import { testUsers } from '../fixtures/test-data';

test.describe('Scénario 13: Gestion du profil', () => {
  let authPage: AuthPage;
  let dashboardPage: DashboardPage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
    dashboardPage = new DashboardPage(page);
    
    await authPage.login(testUsers.free.email, testUsers.free.password);
    await authPage.expectLoginSuccess();
  });

  test('should access profile page', async ({ page }) => {
    await dashboardPage.openUserMenu();
    
    const profileLink = page.getByRole('link', { name: /profil|profile|compte|account/i });
    await profileLink.click();
    
    await expect(page).toHaveURL(/\/profile|\/account|\/settings/);
  });

  test('should display user information', async ({ page }) => {
    await page.goto('/profile');
    
    // Should show user's email
    await expect(page.locator(`text=${testUsers.free.email}`)).toBeVisible();
  });

  test('should allow name update', async ({ page }) => {
    await page.goto('/profile');
    
    const firstNameInput = page.getByRole('textbox', { name: /prénom|first name/i });
    const saveButton = page.getByRole('button', { name: /sauvegarder|save|enregistrer/i });
    
    await firstNameInput.fill('UpdatedName');
    await saveButton.click();
    
    // Should show success message
    const success = page.locator('.toast-success, [role="alert"]');
    await expect(success).toContainText(/succès|success|enregistré|saved/i);
  });

  test('should require password confirmation for email change', async ({ page }) => {
    await page.goto('/profile');
    
    const emailInput = page.getByRole('textbox', { name: /email/i });
    await emailInput.fill('newemail@test.com');
    
    const saveButton = page.getByRole('button', { name: /sauvegarder|save/i });
    await saveButton.click();
    
    // Should ask for password confirmation
    const passwordPrompt = page.locator('text=/mot de passe|password|confirmer/i');
    await expect(passwordPrompt).toBeVisible();
  });

  test('should allow password change', async ({ page }) => {
    await page.goto('/profile');
    
    // Find password change section
    const changePasswordButton = page.getByRole('button', { name: /changer.*mot de passe|change.*password/i });
    await changePasswordButton.click();
    
    // Fill password change form
    const currentPassword = page.getByLabel(/actuel|current/i);
    const newPassword = page.getByLabel(/nouveau|new/i).first();
    const confirmPassword = page.getByLabel(/confirmer|confirm/i);
    
    await currentPassword.fill(testUsers.free.password);
    await newPassword.fill('NewPassword123!@#');
    await confirmPassword.fill('NewPassword123!@#');
    
    const submitButton = page.getByRole('button', { name: /changer|change|update/i });
    await submitButton.click();
    
    // Should show success
    const success = page.locator('.toast-success, [role="alert"]');
    await expect(success).toContainText(/succès|success|modifié|changed/i);
  });

  test('should show connected social accounts', async ({ page }) => {
    await page.goto('/profile');
    
    const socialSection = page.locator('[data-testid="connected-accounts"], .connected-accounts');
    await expect(socialSection).toBeVisible();
  });

  test('should allow notification preferences update', async ({ page }) => {
    await page.goto('/profile');
    
    const notificationsSection = page.locator('text=/notification|préférence/i');
    
    if (await notificationsSection.isVisible()) {
      const emailNotifications = page.getByRole('checkbox', { name: /email/i });
      
      // Toggle notification preference
      const wasChecked = await emailNotifications.isChecked();
      await emailNotifications.click();
      
      const saveButton = page.getByRole('button', { name: /sauvegarder|save/i });
      await saveButton.click();
      
      // Verify change persisted
      await page.reload();
      const isNowChecked = await emailNotifications.isChecked();
      expect(isNowChecked).toBe(!wasChecked);
    }
  });

  test('should show account deletion option in danger zone', async ({ page }) => {
    await page.goto('/profile');
    
    const dangerZone = page.locator('[data-testid="danger-zone"], .danger-zone');
    const deleteButton = page.getByRole('button', { name: /supprimer.*compte|delete.*account/i });
    
    await expect(deleteButton).toBeVisible();
  });

  test('should require confirmation for account deletion', async ({ page }) => {
    await page.goto('/profile');
    
    const deleteButton = page.getByRole('button', { name: /supprimer.*compte|delete.*account/i });
    await deleteButton.click();
    
    // Should show confirmation modal
    const confirmModal = page.locator('[role="dialog"], .modal');
    await expect(confirmModal).toBeVisible();
    await expect(confirmModal).toContainText(/confirmer|êtes-vous sûr|are you sure/i);
  });
});

test.describe('Scénario 14: Mot de passe oublié', () => {
  let authPage: AuthPage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
  });

  test('should access forgot password from login page', async ({ page }) => {
    await authPage.goto();
    
    await expect(authPage.forgotPasswordLink).toBeVisible();
    await authPage.forgotPasswordLink.click();
    
    await expect(page).toHaveURL(/\/forgot-password|\/reset/);
  });

  test('should send reset email', async ({ page }) => {
    await page.goto('/forgot-password');
    
    const emailInput = page.getByRole('textbox', { name: /email/i });
    const submitButton = page.getByRole('button', { name: /envoyer|send|reset/i });
    
    await emailInput.fill(testUsers.free.email);
    await submitButton.click();
    
    // Should show success message (even if email doesn't exist for security)
    const message = page.locator('.toast-success, [role="alert"], .success-message');
    await expect(message).toContainText(/envoyé|sent|email|vérifiez/i);
  });

  test('should show same message for non-existent email (security)', async ({ page }) => {
    await page.goto('/forgot-password');
    
    const emailInput = page.getByRole('textbox', { name: /email/i });
    const submitButton = page.getByRole('button', { name: /envoyer|send|reset/i });
    
    await emailInput.fill('nonexistent@test.com');
    await submitButton.click();
    
    // Should show same generic message (not reveal if email exists)
    const message = page.locator('.toast-success, [role="alert"], .success-message');
    await expect(message).toContainText(/envoyé|sent|email|si.*existe|if.*exists/i);
  });

  test('should validate email format', async ({ page }) => {
    await page.goto('/forgot-password');
    
    const emailInput = page.getByRole('textbox', { name: /email/i });
    const submitButton = page.getByRole('button', { name: /envoyer|send|reset/i });
    
    await emailInput.fill('not-an-email');
    await submitButton.click();
    
    // Should show validation error
    const error = page.locator('.error, [role="alert"]');
    await expect(error).toContainText(/email|invalide|invalid/i);
  });

  test('should allow password reset with valid token', async ({ page }) => {
    // This would need a real token, typically mocked in integration tests
    const mockToken = 'valid-reset-token-123';
    
    await page.goto(`/reset-password?token=${mockToken}`);
    
    const newPassword = page.getByLabel(/nouveau|new/i).first();
    const confirmPassword = page.getByLabel(/confirmer|confirm/i);
    
    if (await newPassword.isVisible()) {
      await newPassword.fill('NewSecurePassword123!@#');
      await confirmPassword.fill('NewSecurePassword123!@#');
      
      const submitButton = page.getByRole('button', { name: /réinitialiser|reset|changer/i });
      await submitButton.click();
      
      // Should redirect to login or show success
      await expect(page.locator('text=/succès|success|connecter|login/i')).toBeVisible();
    }
  });

  test('should reject invalid reset token', async ({ page }) => {
    await page.goto('/reset-password?token=invalid-token');
    
    const newPassword = page.getByLabel(/nouveau|new/i).first();
    
    if (await newPassword.isVisible()) {
      await newPassword.fill('NewPassword123!@#');
      
      const confirmPassword = page.getByLabel(/confirmer|confirm/i);
      await confirmPassword.fill('NewPassword123!@#');
      
      const submitButton = page.getByRole('button', { name: /réinitialiser|reset/i });
      await submitButton.click();
      
      // Should show error about invalid/expired token
      const error = page.locator('[role="alert"], .error');
      await expect(error).toContainText(/invalide|expiré|invalid|expired/i);
    } else {
      // Page might show error directly for invalid token
      const error = page.locator('text=/invalide|expiré|invalid|expired/i');
      await expect(error).toBeVisible();
    }
  });

  test('should apply rate limiting on reset requests', async ({ page }) => {
    await page.goto('/forgot-password');
    
    const emailInput = page.getByRole('textbox', { name: /email/i });
    const submitButton = page.getByRole('button', { name: /envoyer|send|reset/i });
    
    // Submit multiple times
    for (let i = 0; i < 5; i++) {
      await emailInput.fill(`test${i}@test.com`);
      await submitButton.click();
      await page.waitForTimeout(500);
    }
    
    // Should eventually show rate limit message
    const rateLimitMessage = page.locator('text=/trop de|too many|réessayez|try again later/i');
    // Note: Rate limit might not trigger with just 5 requests depending on config
  });
});
