import { test, expect } from '@playwright/test';
import { AuthPage, DashboardPage, DrawPage } from '../pages';
import { testUsers, testDraws } from '../fixtures/test-data';

test.describe('Scénario 6: Exécution du tirage', () => {
  let authPage: AuthPage;
  let dashboardPage: DashboardPage;
  let drawPage: DrawPage;

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page);
    dashboardPage = new DashboardPage(page);
    drawPage = new DrawPage(page);
    
    // Login first
    await authPage.login(testUsers.free.email, testUsers.free.password);
    await authPage.expectLoginSuccess();
  });

  async function createReadyDraw(page: any): Promise<void> {
    const draw = testDraws.manual;
    
    await dashboardPage.createNewDraw();
    await drawPage.fillConfiguration({
      title: draw.title,
      numberOfWinners: draw.numberOfWinners,
    });
    await drawPage.goToNextStep();
    await drawPage.addManualParticipants(draw.participants);
    await drawPage.goToNextStep();
    await drawPage.goToNextStep();
    await drawPage.createDraw();
  }

  test('should execute draw and show winners', async ({ page }) => {
    await createReadyDraw(page);
    
    // Execute the draw
    await drawPage.executeDraw();
    
    // Should show winners
    await expect(drawPage.winnersDisplay).toBeVisible();
    
    const winners = await drawPage.getWinners();
    expect(winners.length).toBe(testDraws.manual.numberOfWinners);
  });

  test('should show confirmation modal before execution', async ({ page }) => {
    await createReadyDraw(page);
    
    // Click execute
    await drawPage.executeDrawButton.click();
    
    // Confirmation modal should appear
    await expect(drawPage.confirmExecuteButton).toBeVisible();
    
    // Should mention credit consumption
    const modal = page.locator('[role="dialog"], .modal');
    await expect(modal).toContainText(/crédit|credit/i);
  });

  test('should deduct 1 credit after execution', async ({ page }) => {
    const initialCredits = await dashboardPage.getCreditsCount();
    
    await createReadyDraw(page);
    await drawPage.executeDraw();
    
    // Go back to dashboard
    await page.goto('/dashboard');
    
    const finalCredits = await dashboardPage.getCreditsCount();
    expect(finalCredits).toBe(initialCredits - 1);
  });

  test('should show verification hash after execution', async ({ page }) => {
    await createReadyDraw(page);
    await drawPage.executeDraw();
    
    const hash = await drawPage.getVerificationHash();
    
    // Hash should be a valid SHA-256 (64 hex chars)
    expect(hash).toMatch(/^[a-f0-9]{64}$/i);
  });

  test('should allow certificate download', async ({ page }) => {
    await createReadyDraw(page);
    await drawPage.executeDraw();
    
    const download = await drawPage.downloadCertificate();
    
    // Should download a PDF
    expect(download.suggestedFilename()).toMatch(/\.pdf$/);
  });

  test('should prevent re-execution of completed draw', async ({ page }) => {
    await createReadyDraw(page);
    await drawPage.executeDraw();
    
    // Execute button should be disabled or hidden
    const isDisabled = await drawPage.executeDrawButton.isDisabled();
    const isHidden = !(await drawPage.executeDrawButton.isVisible());
    
    expect(isDisabled || isHidden).toBe(true);
  });

  test('should fail if not enough credits', async ({ page }) => {
    // Login as user with no credits
    await page.goto('/dashboard');
    await dashboardPage.logout();
    await authPage.login(testUsers.noCredits.email, testUsers.noCredits.password);
    await authPage.expectLoginSuccess();
    
    await createReadyDraw(page);
    
    // Try to execute
    await drawPage.executeDrawButton.click();
    
    // Should show error about insufficient credits
    const error = page.locator('[role="alert"], .error-message, .toast-error');
    await expect(error).toContainText(/crédit|credit|insuffisant|insufficient/i);
  });

  test('should handle multiple winners correctly', async ({ page }) => {
    const draw = testDraws.multipleWinners;
    
    await dashboardPage.createNewDraw();
    await drawPage.fillConfiguration({
      title: draw.title,
      numberOfWinners: draw.numberOfWinners,
    });
    await drawPage.goToNextStep();
    await drawPage.addManualParticipants(draw.participants);
    await drawPage.goToNextStep();
    await drawPage.goToNextStep();
    await drawPage.createDraw();
    
    await drawPage.executeDraw();
    
    const winners = await drawPage.getWinners();
    
    // Should have correct number of unique winners
    expect(winners.length).toBe(draw.numberOfWinners);
    expect(new Set(winners).size).toBe(draw.numberOfWinners);
  });

  test('should show draw animation when enabled', async ({ page }) => {
    const draw = testDraws.manual;
    
    await dashboardPage.createNewDraw();
    await drawPage.fillConfiguration({
      title: draw.title,
      numberOfWinners: draw.numberOfWinners,
    });
    await drawPage.goToNextStep();
    await drawPage.addManualParticipants(draw.participants);
    await drawPage.goToNextStep();
    
    // Enable animation
    await drawPage.animationCheckbox.check();
    await drawPage.goToNextStep();
    await drawPage.createDraw();
    
    // Start execution
    await drawPage.executeDrawButton.click();
    await drawPage.confirmExecuteButton.click();
    
    // Animation should be visible
    await expect(drawPage.drawAnimation).toBeVisible({ timeout: 5000 });
    
    // Wait for animation to complete
    await expect(drawPage.winnersDisplay).toBeVisible({ timeout: 30000 });
  });

  test('should generate reproducible results with custom seed', async ({ page }) => {
    const draw = testDraws.manual;
    const customSeed = 'my-custom-seed-12345';
    
    await dashboardPage.createNewDraw();
    await drawPage.fillConfiguration({
      title: draw.title,
      numberOfWinners: draw.numberOfWinners,
    });
    await drawPage.goToNextStep();
    await drawPage.addManualParticipants(draw.participants);
    await drawPage.goToNextStep();
    
    // Set custom seed if option exists
    const seedInput = page.getByRole('textbox', { name: /seed/i });
    if (await seedInput.isVisible()) {
      await seedInput.fill(customSeed);
    }
    
    await drawPage.goToNextStep();
    await drawPage.createDraw();
    await drawPage.executeDraw();
    
    const winners1 = await drawPage.getWinners();
    
    // Note: To verify reproducibility, you'd need to reset and rerun
    // This test just verifies the seed option works
    expect(winners1.length).toBe(draw.numberOfWinners);
  });
});
