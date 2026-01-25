import { test, expect } from '@playwright/test';

test.describe('Draw Creation and Execution', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('input[name="email"]', 'testuser@example.com');
    await page.fill('input[name="password"]', 'Password123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('should create a new draw', async ({ page }) => {
    await page.click('text=Create New Draw');

    await page.fill('input[name="title"]', 'E2E Test Giveaway');
    await page.fill(
      'textarea[name="description"]',
      'Testing draw creation flow'
    );
    await page.fill(
      'input[name="instagramPostUrl"]',
      'https://www.instagram.com/p/TEST123/'
    );
    await page.fill('input[name="winnerCount"]', '3');

    // Configure filters
    await page.check('input[name="requireLike"]');
    await page.check('input[name="requireComment"]');

    await page.click('button[text="Create Draw"]');

    await expect(page.locator('text=Draw created successfully')).toBeVisible();
    await expect(page).toHaveURL(/\/draws\/[a-z0-9-]+/);
  });

  test('should validate Instagram URL format', async ({ page }) => {
    await page.click('text=Create New Draw');

    await page.fill('input[name="title"]', 'Test Draw');
    await page.fill('input[name="instagramPostUrl"]', 'invalid-url');
    await page.fill('input[name="winnerCount"]', '1');

    await page.click('button[text="Create Draw"]');

    await expect(
      page.locator('text=Please enter a valid Instagram post URL')
    ).toBeVisible();
  });

  test('should execute draw and display winners', async ({ page }) => {
    // Create draw first
    await page.click('text=Create New Draw');
    await page.fill('input[name="title"]', 'Execution Test');
    await page.fill(
      'input[name="instagramPostUrl"]',
      'https://www.instagram.com/p/EXEC123/'
    );
    await page.fill('input[name="winnerCount"]', '2');
    await page.click('button[text="Create Draw"]');

    // Wait for draw creation
    await expect(page).toHaveURL(/\/draws\/[a-z0-9-]+/);

    // Execute draw
    await page.click('button[text="Execute Draw"]');

    // Confirm execution
    await page.click('button[text="Confirm"]');

    // Wait for animation
    await expect(page.locator('[data-testid="draw-animation"]')).toBeVisible({
      timeout: 10000,
    });

    // Verify winners are displayed
    await expect(page.locator('[data-testid="winner-list"]')).toBeVisible({
      timeout: 15000,
    });
    const winners = await page.locator('[data-testid="winner-item"]').count();
    expect(winners).toBe(2);
  });

  test('should download certificate after draw execution', async ({ page }) => {
    // Navigate to completed draw
    await page.goto('/draws/completed-draw-id');

    const [download] = await Promise.all([
      page.waitForEvent('download'),
      page.click('button[text="Download Certificate"]'),
    ]);

    expect(download.suggestedFilename()).toContain('certificate');
    expect(download.suggestedFilename()).toMatch(/\.pdf$/);
  });

  test('should handle insufficient credits error', async ({ page }) => {
    // Ensure user has 0 credits (via API or test setup)
    await page.evaluate(() => {
      localStorage.setItem('test_zero_credits', 'true');
    });

    await page.click('text=Create New Draw');
    await page.fill('input[name="title"]', 'No Credits Test');
    await page.fill(
      'input[name="instagramPostUrl"]',
      'https://www.instagram.com/p/TEST/'
    );
    await page.fill('input[name="winnerCount"]', '1');
    await page.click('button[text="Create Draw"]');

    await page.click('button[text="Execute Draw"]');

    await expect(
      page.locator('text=Insufficient credits')
    ).toBeVisible();
    await expect(
      page.locator('button[text="Buy Credits"]')
    ).toBeVisible();
  });

  test('should filter participants correctly', async ({ page }) => {
    await page.click('text=Create New Draw');

    // Setup draw with specific filters
    await page.fill('input[name="title"]', 'Filter Test');
    await page.fill(
      'input[name="instagramPostUrl"]',
      'https://www.instagram.com/p/FILTER/'
    );
    await page.fill('input[name="winnerCount"]', '1');

    await page.check('input[name="requireLike"]');
    await page.check('input[name="requireComment"]');
    await page.check('input[name="requireFollow"]');

    await page.click('button[text="Create Draw"]');

    // Verify filter summary
    await expect(
      page.locator('text=Must have liked the post')
    ).toBeVisible();
    await expect(
      page.locator('text=Must have commented')
    ).toBeVisible();
    await expect(
      page.locator('text=Must be following')
    ).toBeVisible();
  });
});
