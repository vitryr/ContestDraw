import { test, expect } from '@playwright/test';
import { AuthPage, DashboardPage, DrawPage } from '../pages';
import { testUsers, testDraws } from '../fixtures/test-data';

test.describe('Scénario 4: Création d\'un tirage manuel', () => {
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

  test('should create a manual draw with valid data', async ({ page }) => {
    const draw = testDraws.manual;
    
    await dashboardPage.createNewDraw();
    
    // Step 1: Configuration
    await drawPage.fillConfiguration({
      title: draw.title,
      description: draw.description,
      numberOfWinners: draw.numberOfWinners,
    });
    await drawPage.goToNextStep();
    
    // Step 2: Participants
    await drawPage.addManualParticipants(draw.participants);
    await drawPage.goToNextStep();
    
    // Step 3: Options (skip with defaults)
    await drawPage.goToNextStep();
    
    // Step 4: Create
    await drawPage.createDraw();
    
    // Should be on draw detail page
    await expect(page).toHaveURL(/\/draws\/[a-f0-9-]+/);
  });

  test('should validate minimum 2 participants', async ({ page }) => {
    await dashboardPage.createNewDraw();
    
    await drawPage.fillConfiguration({
      title: 'Test',
      numberOfWinners: 1,
    });
    await drawPage.goToNextStep();
    
    // Add only 1 participant
    await drawPage.addManualParticipants([
      { name: 'Only One', identifier: 'one@test.com' },
    ]);
    
    // Try to proceed
    await drawPage.goToNextStep();
    
    // Should show error
    const error = page.locator('[role="alert"], .error-message');
    await expect(error).toContainText(/minimum|au moins 2|at least 2/i);
  });

  test('should validate winners <= participants', async ({ page }) => {
    await dashboardPage.createNewDraw();
    
    await drawPage.fillConfiguration({
      title: 'Test',
      numberOfWinners: 5, // More than participants
    });
    await drawPage.goToNextStep();
    
    await drawPage.addManualParticipants([
      { name: 'A', identifier: 'a@test.com' },
      { name: 'B', identifier: 'b@test.com' },
    ]);
    await drawPage.goToNextStep();
    await drawPage.goToNextStep();
    
    // Try to create - should fail
    await drawPage.createDrawButton.click();
    
    const error = page.locator('[role="alert"], .error-message');
    await expect(error).toContainText(/plus de gagnants|more winners|pas assez/i);
  });

  test('should detect and warn about duplicate participants', async ({ page }) => {
    await dashboardPage.createNewDraw();
    
    await drawPage.fillConfiguration({
      title: 'Test Doublons',
      numberOfWinners: 1,
    });
    await drawPage.goToNextStep();
    
    // Add duplicates
    await drawPage.addManualParticipants([
      { name: 'Alice', identifier: 'alice@test.com' },
      { name: 'Alice Dupont', identifier: 'alice@test.com' }, // Same email
      { name: 'Bob', identifier: 'bob@test.com' },
    ]);
    
    // Should show duplicate warning
    const warning = page.locator('.warning, .duplicate-warning, [data-testid="duplicate-warning"]');
    await expect(warning).toBeVisible();
  });

  test('should allow CSV import', async ({ page }) => {
    await dashboardPage.createNewDraw();
    
    await drawPage.fillConfiguration({
      title: 'Test CSV Import',
      numberOfWinners: 1,
    });
    await drawPage.goToNextStep();
    
    // Check CSV import button exists
    await expect(drawPage.importCsvButton).toBeVisible();
    
    // Note: Full CSV import test would require file upload mocking
  });

  test('should save draft automatically', async ({ page }) => {
    await dashboardPage.createNewDraw();
    
    await drawPage.fillConfiguration({
      title: 'Draft Test',
      numberOfWinners: 1,
    });
    
    // Wait for auto-save (typically debounced)
    await page.waitForTimeout(2000);
    
    // Navigate away
    await page.goto('/dashboard');
    
    // Draft should be visible in list
    const drafts = page.locator('[data-status="draft"], .draft-draw');
    const count = await drafts.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should handle max title length (200 chars)', async ({ page }) => {
    await dashboardPage.createNewDraw();
    
    const longTitle = 'A'.repeat(250);
    await drawPage.titleInput.fill(longTitle);
    
    // Should be truncated or show error
    const value = await drawPage.titleInput.inputValue();
    expect(value.length).toBeLessThanOrEqual(200);
  });

  test('should create draw with multiple winners', async ({ page }) => {
    const draw = testDraws.multipleWinners;
    
    await dashboardPage.createNewDraw();
    
    await drawPage.fillConfiguration({
      title: draw.title,
      description: draw.description,
      numberOfWinners: draw.numberOfWinners,
    });
    await drawPage.goToNextStep();
    
    await drawPage.addManualParticipants(draw.participants);
    await drawPage.goToNextStep();
    await drawPage.goToNextStep();
    
    await drawPage.createDraw();
    
    await expect(page).toHaveURL(/\/draws\/[a-f0-9-]+/);
  });
});
