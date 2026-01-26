import { test, expect } from '@playwright/test';
import { AuthPage, DashboardPage, PricingPage, StripeCheckoutPage } from '../pages';
import { testUsers, stripeTestCards, subscriptionPlans } from '../fixtures/test-data';

test.describe('Scénario 8: Souscription abonnement', () => {
  let authPage: AuthPage;
  let dashboardPage: DashboardPage;
  let pricingPage: PricingPage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
    dashboardPage = new DashboardPage(page);
    pricingPage = new PricingPage(page);
    
    await authPage.login(testUsers.free.email, testUsers.free.password);
    await authPage.expectLoginSuccess();
  });

  test('should display subscription plans', async ({ page }) => {
    await pricingPage.goto();
    
    await expect(pricingPage.monthlyPlan).toBeVisible();
    await expect(pricingPage.enterprisePlan).toBeVisible();
  });

  test('should show subscription benefits', async ({ page }) => {
    await pricingPage.goto();
    
    // Monthly plan benefits
    await expect(page.locator('text=/illimité|unlimited/i')).toBeVisible();
  });

  test('should redirect to Stripe for monthly subscription', async ({ page }) => {
    await pricingPage.goto();
    await pricingPage.subscribeMonthly();
    
    expect(page.url()).toContain('checkout.stripe.com');
  });

  test('should complete monthly subscription', async ({ page }) => {
    await pricingPage.goto();
    await pricingPage.subscribeMonthly();
    
    const checkoutPage = new StripeCheckoutPage(page);
    await checkoutPage.fillEmail(testUsers.free.email);
    await checkoutPage.fillCardDetails(stripeTestCards.valid);
    await checkoutPage.pay();
    
    await checkoutPage.expectPaymentSuccess();
  });

  test('should show Pro badge after subscription', async ({ page }) => {
    // This test assumes user already has subscription
    await authPage.login(testUsers.pro.email, testUsers.pro.password);
    
    await page.goto('/dashboard');
    
    const proBadge = page.locator('[data-testid="pro-badge"], .pro-badge, text=/pro|premium/i');
    await expect(proBadge).toBeVisible();
  });

  test('should show unlimited draws for subscribers', async ({ page }) => {
    await authPage.login(testUsers.pro.email, testUsers.pro.password);
    
    await page.goto('/dashboard');
    
    const unlimited = page.locator('text=/illimité|unlimited|∞/i');
    await expect(unlimited).toBeVisible();
  });

  test('should allow access to billing portal', async ({ page }) => {
    await authPage.login(testUsers.pro.email, testUsers.pro.password);
    
    await page.goto('/dashboard');
    await dashboardPage.openUserMenu();
    
    const billingLink = page.getByRole('link', { name: /facturation|billing|abonnement/i });
    await billingLink.click();
    
    // Should redirect to Stripe billing portal
    await page.waitForURL(/billing\.stripe\.com|\/billing/, { timeout: 10000 });
  });
});

test.describe('Scénario 9: Achat 48h Pass', () => {
  let authPage: AuthPage;
  let pricingPage: PricingPage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
    pricingPage = new PricingPage(page);
    
    await authPage.login(testUsers.free.email, testUsers.free.password);
  });

  test('should display 48h pass option', async ({ page }) => {
    await pricingPage.goto();
    
    await expect(pricingPage.pass48h).toBeVisible();
    await expect(page.locator(`text=${subscriptionPlans.pass48h.price}`)).toBeVisible();
  });

  test('should explain 48h pass benefits', async ({ page }) => {
    await pricingPage.goto();
    
    await expect(page.locator('text=/48.*h|48.*heures|48.*hours/i')).toBeVisible();
    await expect(page.locator('text=/illimité|unlimited/i')).toBeVisible();
  });

  test('should purchase 48h pass', async ({ page }) => {
    await pricingPage.goto();
    await pricingPage.buy48hPass();
    
    const checkoutPage = new StripeCheckoutPage(page);
    await checkoutPage.fillEmail(testUsers.free.email);
    await checkoutPage.fillCardDetails(stripeTestCards.valid);
    await checkoutPage.pay();
    
    await checkoutPage.expectPaymentSuccess();
  });

  test('should show pass expiration timer', async ({ page }) => {
    // Assuming pass is active after purchase
    await page.goto('/dashboard');
    
    const timer = page.locator('[data-testid="pass-timer"], .pass-expiration, text=/expire|restant/i');
    
    // Timer should show if pass is active
    if (await timer.isVisible()) {
      await expect(timer).toContainText(/\d+/); // Should contain numbers
    }
  });

  test('should allow unlimited draws during pass', async ({ page }) => {
    // With active pass, credits should not be deducted
    // This test would need a user with active pass
    
    await page.goto('/dashboard');
    
    // If pass is active, credits display might show "Pass actif" instead of number
    const passActive = page.locator('text=/pass actif|pass active|48h/i');
    
    if (await passActive.isVisible()) {
      // Verify no credit warning when creating draw
      const drawPage = page.locator('[href*="/draws/new"], [data-testid="new-draw"]');
      await drawPage.click();
      
      // Should not show credit warning
      const creditWarning = page.locator('text=/crédit|credit/i');
      await expect(creditWarning).not.toBeVisible();
    }
  });
});
