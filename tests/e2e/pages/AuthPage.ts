/**
 * Page Object Model: Authentication Page
 * Encapsulates all authentication page interactions
 */

import { Page, Locator, expect } from '@playwright/test';
import { waitForToast, waitForNetworkIdle } from '../helpers/test-helpers';

export class AuthPage {
  readonly page: Page;

  // Tab buttons
  readonly signInTab: Locator;
  readonly signUpTab: Locator;

  // Login form elements
  readonly loginEmailInput: Locator;
  readonly loginPasswordInput: Locator;
  readonly loginSubmitButton: Locator;

  // Register form elements
  readonly registerNameInput: Locator;
  readonly registerEmailInput: Locator;
  readonly registerPasswordInput: Locator;
  readonly registerConfirmPasswordInput: Locator;
  readonly registerSubmitButton: Locator;

  // Common elements
  readonly toggleFormButton: Locator;
  readonly pageTitle: Locator;

  constructor(page: Page) {
    this.page = page;

    // Tab buttons
    this.signInTab = page.getByRole('button', { name: /sign in/i });
    this.signUpTab = page.getByRole('button', { name: /sign up/i });

    // Login form
    this.loginEmailInput = page.locator('input[name="email"]').first();
    this.loginPasswordInput = page.locator('input[name="password"]').first();
    this.loginSubmitButton = page.locator('button[type="submit"]', { hasText: /sign in/i });

    // Register form
    this.registerNameInput = page.locator('input[name="name"]');
    this.registerEmailInput = page.locator('input[name="email"]').nth(1);
    this.registerPasswordInput = page.locator('input[name="password"]').nth(1);
    this.registerConfirmPasswordInput = page.locator('input[name="confirmPassword"]');
    this.registerSubmitButton = page.locator('button[type="submit"]', { hasText: /create account/i });

    // Common
    this.toggleFormButton = page.locator('button', { hasText: /sign up|sign in/i }).last();
    this.pageTitle = page.locator('h1');
  }

  /**
   * Navigate to auth page
   */
  async goto(): Promise<void> {
    await this.page.goto('/auth');
    await waitForNetworkIdle(this.page);
  }

  /**
   * Switch to sign up tab
   */
  async switchToSignUp(): Promise<void> {
    await this.signUpTab.click();
    await expect(this.registerNameInput).toBeVisible();
  }

  /**
   * Switch to sign in tab
   */
  async switchToSignIn(): Promise<void> {
    await this.signInTab.click();
    await expect(this.loginEmailInput).toBeVisible();
  }

  /**
   * Fill and submit login form
   */
  async login(email: string, password: string): Promise<void> {
    await this.switchToSignIn();
    await this.loginEmailInput.fill(email);
    await this.loginPasswordInput.fill(password);
    await this.loginSubmitButton.click();
  }

  /**
   * Fill and submit registration form
   */
  async register(
    name: string,
    email: string,
    password: string,
    confirmPassword?: string
  ): Promise<void> {
    await this.switchToSignUp();
    await this.registerNameInput.fill(name);
    await this.registerEmailInput.fill(email);
    await this.registerPasswordInput.fill(password);
    await this.registerConfirmPasswordInput.fill(confirmPassword || password);
    await this.registerSubmitButton.click();
  }

  /**
   * Verify validation error for specific field
   */
  async verifyValidationError(fieldName: string, errorMessage: string): Promise<void> {
    const errorLocator = this.page.locator(`input[name="${fieldName}"] ~ p.text-red-600, input[name="${fieldName}"] + p.text-red-600`).first();
    await expect(errorLocator).toBeVisible();
    await expect(errorLocator).toContainText(errorMessage);
  }

  /**
   * Verify success toast
   */
  async verifySuccessToast(message: string): Promise<void> {
    await waitForToast(this.page, message);
  }

  /**
   * Verify error toast
   */
  async verifyErrorToast(message: string): Promise<void> {
    await waitForToast(this.page, message);
  }

  /**
   * Check if currently on sign in form
   */
  async isSignInFormActive(): Promise<boolean> {
    return await this.loginEmailInput.isVisible();
  }

  /**
   * Check if currently on sign up form
   */
  async isSignUpFormActive(): Promise<boolean> {
    return await this.registerNameInput.isVisible();
  }

  /**
   * Verify page title
   */
  async verifyPageTitle(title: string): Promise<void> {
    await expect(this.pageTitle).toContainText(title);
  }

  /**
   * Get all form validation errors
   */
  async getAllValidationErrors(): Promise<string[]> {
    const errors = await this.page.locator('p.text-red-600').allTextContents();
    return errors;
  }

  /**
   * Check if submit button is disabled
   */
  async isSubmitDisabled(): Promise<boolean> {
    const submitButton = await this.isSignInFormActive()
      ? this.loginSubmitButton
      : this.registerSubmitButton;
    return await submitButton.isDisabled();
  }

  /**
   * Verify redirect after successful auth
   */
  async verifyRedirectToDashboard(): Promise<void> {
    await this.page.waitForURL(/\/dashboard/, { timeout: 10000 });
    await expect(this.page).toHaveURL(/\/dashboard/);
  }

  /**
   * Fill partial registration form (for testing validation)
   */
  async fillPartialRegistration(fields: {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }): Promise<void> {
    await this.switchToSignUp();

    if (fields.name !== undefined) {
      await this.registerNameInput.fill(fields.name);
    }
    if (fields.email !== undefined) {
      await this.registerEmailInput.fill(fields.email);
    }
    if (fields.password !== undefined) {
      await this.registerPasswordInput.fill(fields.password);
    }
    if (fields.confirmPassword !== undefined) {
      await this.registerConfirmPasswordInput.fill(fields.confirmPassword);
    }
  }

  /**
   * Click submit button
   */
  async submitForm(): Promise<void> {
    const submitButton = await this.isSignInFormActive()
      ? this.loginSubmitButton
      : this.registerSubmitButton;
    await submitButton.click();
  }

  /**
   * Wait for form submission to complete
   */
  async waitForSubmission(timeout = 10000): Promise<void> {
    await this.page.waitForLoadState('networkidle', { timeout });
  }
}
