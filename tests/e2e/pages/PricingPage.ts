import { Page, Locator, expect } from '@playwright/test';

export class PricingPage {
  readonly page: Page;
  
  // Credit packs
  readonly creditPacks: Locator;
  readonly pack1Credit: Locator;
  readonly pack5Credits: Locator;
  readonly pack10Credits: Locator;
  readonly pack20Credits: Locator;
  
  // Subscriptions
  readonly subscriptionPlans: Locator;
  readonly monthlyPlan: Locator;
  readonly enterprisePlan: Locator;
  readonly pass48h: Locator;
  
  // Stripe Checkout elements (in iframe)
  readonly stripeFrame: Locator;

  constructor(page: Page) {
    this.page = page;
    
    this.creditPacks = page.locator('[data-testid="credit-packs"], .credit-packs');
    this.pack1Credit = page.locator('[data-testid="pack-1"], [data-credits="1"]').getByRole('button');
    this.pack5Credits = page.locator('[data-testid="pack-5"], [data-credits="5"]').getByRole('button');
    this.pack10Credits = page.locator('[data-testid="pack-10"], [data-credits="10"]').getByRole('button');
    this.pack20Credits = page.locator('[data-testid="pack-20"], [data-credits="20"]').getByRole('button');
    
    this.subscriptionPlans = page.locator('[data-testid="subscription-plans"], .subscription-plans');
    this.monthlyPlan = page.locator('[data-plan="monthly"]').getByRole('button');
    this.enterprisePlan = page.locator('[data-plan="enterprise"]').getByRole('button');
    this.pass48h = page.locator('[data-plan="48h-pass"]').getByRole('button');
    
    this.stripeFrame = page.frameLocator('iframe[name*="stripe"]');
  }

  async goto() {
    await this.page.goto('/pricing');
  }

  async expectLoaded() {
    await expect(this.creditPacks.or(this.subscriptionPlans)).toBeVisible({ timeout: 10000 });
  }

  async buyCredits(amount: 1 | 5 | 10 | 20) {
    const packButton = {
      1: this.pack1Credit,
      5: this.pack5Credits,
      10: this.pack10Credits,
      20: this.pack20Credits,
    }[amount];
    
    await packButton.click();
    // Should redirect to Stripe Checkout
    await this.page.waitForURL(/checkout\.stripe\.com/, { timeout: 10000 });
  }

  async subscribeMonthly() {
    await this.monthlyPlan.click();
    await this.page.waitForURL(/checkout\.stripe\.com/, { timeout: 10000 });
  }

  async subscribeEnterprise() {
    await this.enterprisePlan.click();
    await this.page.waitForURL(/checkout\.stripe\.com/, { timeout: 10000 });
  }

  async buy48hPass() {
    await this.pass48h.click();
    await this.page.waitForURL(/checkout\.stripe\.com/, { timeout: 10000 });
  }
}

export class StripeCheckoutPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly cardNumberInput: Locator;
  readonly cardExpiryInput: Locator;
  readonly cardCvcInput: Locator;
  readonly payButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.locator('#email');
    this.cardNumberInput = page.locator('#cardNumber');
    this.cardExpiryInput = page.locator('#cardExpiry');
    this.cardCvcInput = page.locator('#cardCvc');
    this.payButton = page.locator('[data-testid="hosted-payment-submit-button"], .SubmitButton');
    this.errorMessage = page.locator('.Error, [data-testid="error-message"]');
  }

  async fillCardDetails(card: { number: string; expiry: string; cvc: string }) {
    await this.cardNumberInput.fill(card.number);
    await this.cardExpiryInput.fill(card.expiry);
    await this.cardCvcInput.fill(card.cvc);
  }

  async fillEmail(email: string) {
    await this.emailInput.fill(email);
  }

  async pay() {
    await this.payButton.click();
  }

  async expectPaymentSuccess() {
    // Should redirect back to success page
    await this.page.waitForURL(/\/success|\/dashboard/, { timeout: 30000 });
  }

  async expectPaymentError(message?: string | RegExp) {
    await expect(this.errorMessage).toBeVisible({ timeout: 10000 });
    if (message) {
      await expect(this.errorMessage).toContainText(message);
    }
  }
}
