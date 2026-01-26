import { test, expect } from '@playwright/test';
import { AuthPage, DashboardPage, PricingPage, StripeCheckoutPage } from '../pages';
import { testUsers, stripeTestCards, creditPacks } from '../fixtures/test-data';

test.describe('Scénario 7: Achat de crédits (Stripe)', () => {
  let authPage: AuthPage;
  let dashboardPage: DashboardPage;
  let pricingPage: PricingPage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
    dashboardPage = new DashboardPage(page);
    pricingPage = new PricingPage(page);
    
    // Login first
    await authPage.login(testUsers.free.email, testUsers.free.password);
    await authPage.expectLoginSuccess();
  });

  test('should display all credit packs on pricing page', async ({ page }) => {
    await pricingPage.goto();
    await pricingPage.expectLoaded();
    
    // All packs should be visible
    await expect(pricingPage.pack1Credit).toBeVisible();
    await expect(pricingPage.pack5Credits).toBeVisible();
    await expect(pricingPage.pack10Credits).toBeVisible();
    await expect(pricingPage.pack20Credits).toBeVisible();
  });

  test('should show correct prices for each pack', async ({ page }) => {
    await pricingPage.goto();
    
    // Check prices are displayed
    await expect(page.locator(`text=${creditPacks.single.price}`)).toBeVisible();
    await expect(page.locator(`text=${creditPacks.five.price}`)).toBeVisible();
    await expect(page.locator(`text=${creditPacks.ten.price}`)).toBeVisible();
    await expect(page.locator(`text=${creditPacks.twenty.price}`)).toBeVisible();
  });

  test('should redirect to Stripe Checkout when buying credits', async ({ page }) => {
    await pricingPage.goto();
    
    // Click on 5 credits pack
    await pricingPage.buyCredits(5);
    
    // Should be on Stripe Checkout
    expect(page.url()).toContain('checkout.stripe.com');
  });

  test('should complete payment with valid test card', async ({ page }) => {
    await pricingPage.goto();
    await pricingPage.buyCredits(5);
    
    const checkoutPage = new StripeCheckoutPage(page);
    
    // Fill card details
    await checkoutPage.fillEmail(testUsers.free.email);
    await checkoutPage.fillCardDetails(stripeTestCards.valid);
    
    // Submit payment
    await checkoutPage.pay();
    
    // Should redirect to success page
    await checkoutPage.expectPaymentSuccess();
  });

  test('should show error for declined card', async ({ page }) => {
    await pricingPage.goto();
    await pricingPage.buyCredits(1);
    
    const checkoutPage = new StripeCheckoutPage(page);
    
    await checkoutPage.fillEmail(testUsers.free.email);
    await checkoutPage.fillCardDetails(stripeTestCards.declined);
    await checkoutPage.pay();
    
    // Should show decline error
    await checkoutPage.expectPaymentError(/declined|refusée/i);
  });

  test('should handle 3D Secure authentication', async ({ page }) => {
    await pricingPage.goto();
    await pricingPage.buyCredits(1);
    
    const checkoutPage = new StripeCheckoutPage(page);
    
    await checkoutPage.fillEmail(testUsers.free.email);
    await checkoutPage.fillCardDetails(stripeTestCards.requires3DS);
    await checkoutPage.pay();
    
    // Should show 3DS iframe or redirect
    const threeDSFrame = page.frameLocator('iframe[name*="stripe-challenge"]');
    await expect(threeDSFrame.locator('body')).toBeVisible({ timeout: 10000 });
  });

  test('should add credits to account after successful payment', async ({ page }) => {
    const initialCredits = await dashboardPage.getCreditsCount();
    
    await pricingPage.goto();
    await pricingPage.buyCredits(5);
    
    const checkoutPage = new StripeCheckoutPage(page);
    await checkoutPage.fillEmail(testUsers.free.email);
    await checkoutPage.fillCardDetails(stripeTestCards.valid);
    await checkoutPage.pay();
    
    await checkoutPage.expectPaymentSuccess();
    
    // Go to dashboard and verify credits
    await page.goto('/dashboard');
    const finalCredits = await dashboardPage.getCreditsCount();
    
    expect(finalCredits).toBe(initialCredits + 5);
  });

  test('should show payment confirmation email option', async ({ page }) => {
    await pricingPage.goto();
    await pricingPage.buyCredits(1);
    
    // Stripe checkout should have email field
    const emailField = page.locator('#email');
    await expect(emailField).toBeVisible();
  });

  test('should allow user to go back from checkout', async ({ page }) => {
    await pricingPage.goto();
    await pricingPage.buyCredits(1);
    
    // Wait for Stripe checkout to load
    await page.waitForURL(/checkout\.stripe\.com/);
    
    // Find and click back/cancel link
    const backLink = page.locator('a[href*="cancel"], text=/retour|back|cancel/i');
    if (await backLink.isVisible()) {
      await backLink.click();
      
      // Should return to app
      await expect(page).not.toHaveURL(/checkout\.stripe\.com/);
    }
  });
});

test.describe('Scénario 7b: Achat depuis le dashboard', () => {
  test('should show buy credits prompt when credits are low', async ({ page }) => {
    const authPage = new AuthPage(page);
    const dashboardPage = new DashboardPage(page);
    
    // Login as user with 0 credits
    await authPage.login(testUsers.noCredits.email, testUsers.noCredits.password);
    await authPage.expectLoginSuccess();
    
    // Dashboard should show prompt to buy credits
    const buyPrompt = page.locator('[data-testid="buy-credits-prompt"], .buy-credits-cta');
    await expect(buyPrompt).toBeVisible();
  });
});
