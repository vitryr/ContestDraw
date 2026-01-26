import { Page, Locator, expect } from '@playwright/test';

export class AuthPage {
  readonly page: Page;
  readonly loginTab: Locator;
  readonly registerTab: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly submitButton: Locator;
  readonly googleButton: Locator;
  readonly facebookButton: Locator;
  readonly forgotPasswordLink: Locator;
  readonly errorMessage: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginTab = page.getByRole('tab', { name: /connexion|login|sign in/i });
    this.registerTab = page.getByRole('tab', { name: /inscription|register|sign up/i });
    this.emailInput = page.getByRole('textbox', { name: /email/i });
    this.passwordInput = page.getByLabel(/^mot de passe|^password/i);
    this.confirmPasswordInput = page.getByLabel(/confirmer|confirm/i);
    this.firstNameInput = page.getByRole('textbox', { name: /prénom|first name/i });
    this.lastNameInput = page.getByRole('textbox', { name: /nom|last name/i });
    this.submitButton = page.getByRole('button', { name: /se connecter|s'inscrire|login|sign|créer/i });
    this.googleButton = page.getByRole('button', { name: /google/i });
    this.facebookButton = page.getByRole('button', { name: /facebook/i });
    this.forgotPasswordLink = page.getByRole('link', { name: /oublié|forgot/i });
    this.errorMessage = page.locator('[role="alert"], .error-message, .toast-error');
    this.successMessage = page.locator('.toast-success, .success-message');
  }

  async goto() {
    await this.page.goto('/auth');
  }

  async login(email: string, password: string) {
    await this.goto();
    await this.loginTab.click();
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async register(user: { email: string; password: string; firstName?: string; lastName?: string }) {
    await this.goto();
    await this.registerTab.click();
    
    if (user.firstName) {
      await this.firstNameInput.fill(user.firstName);
    }
    if (user.lastName) {
      await this.lastNameInput.fill(user.lastName);
    }
    await this.emailInput.fill(user.email);
    await this.passwordInput.fill(user.password);
    await this.confirmPasswordInput.fill(user.password);
    await this.submitButton.click();
  }

  async expectLoginSuccess() {
    await expect(this.page).toHaveURL(/\/dashboard/, { timeout: 10000 });
  }

  async expectRegistrationSuccess() {
    // Either redirected to dashboard or shown verification message
    await expect(
      this.page.locator('text=/dashboard|vérif|verif|email envoyé|check your email/i')
    ).toBeVisible({ timeout: 10000 });
  }

  async expectError(message?: string | RegExp) {
    await expect(this.errorMessage).toBeVisible({ timeout: 5000 });
    if (message) {
      await expect(this.errorMessage).toContainText(message);
    }
  }

  async loginWithGoogle() {
    await this.goto();
    await this.googleButton.click();
  }

  async loginWithFacebook() {
    await this.goto();
    await this.facebookButton.click();
  }

  async forgotPassword(email: string) {
    await this.goto();
    await this.forgotPasswordLink.click();
    await this.emailInput.fill(email);
    await this.submitButton.click();
  }
}
