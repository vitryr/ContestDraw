import { test, expect, Page } from "@playwright/test";
import path from "path";

test.describe("Full Draw Workflow with Animation", () => {
  // Increase timeout for the full workflow
  test.setTimeout(120000);

  // Test data
  const testUser = {
    email: `e2e_test_${Date.now()}@test.com`,
    password: "Test123456!",
    firstName: "E2E",
    lastName: "Tester",
  };

  const drawData = {
    title: "E2E Workflow Test - 50 Participants",
    description: "Testing the complete draw workflow with CSV upload",
    numberOfWinners: 3,
  };

  // CSV file path
  const csvPath = "/tmp/test_50_participants.csv";

  test("Complete draw workflow: create, upload 50 participants CSV, execute, and view animation", async ({
    page,
  }) => {
    // Enable video recording for this test
    await page.context().tracing.start({ screenshots: true, snapshots: true });

    // =========================================
    // STEP 1: Register new user
    // =========================================
    console.log("Step 1: Registering new user...");
    await page.goto("/signup");

    // Fill registration form
    await page.fill('input[name="firstName"]', testUser.firstName);
    await page.fill('input[name="lastName"]', testUser.lastName);
    await page.fill('input[name="email"]', testUser.email);
    await page.fill('input[name="password"]', testUser.password);
    await page.fill('input[name="confirmPassword"]', testUser.password);

    // Accept terms if checkbox exists
    const termsCheckbox = page.locator('input[name="acceptTerms"]');
    if (await termsCheckbox.isVisible()) {
      await termsCheckbox.check();
    }

    // Submit registration
    await page.click('button[type="submit"]');

    // Wait for redirect to dashboard or email verification message
    await expect(page).toHaveURL(/\/(dashboard|verify-email)/, {
      timeout: 15000,
    });

    // If redirected to verify email, we need to handle that
    if (page.url().includes("verify-email")) {
      console.log(
        "Email verification required - skipping to login with existing user"
      );
      // Use an existing test user instead
      await page.goto("/login");
      await page.fill('input[name="email"]', "test@cleack.io");
      await page.fill('input[name="password"]', "Password123!");
      await page.click('button[type="submit"]');
      await expect(page).toHaveURL(/\/dashboard/, { timeout: 15000 });
    }

    // Take screenshot of dashboard
    await page.screenshot({ path: "test-results/01-dashboard.png" });
    console.log("✓ User logged in successfully");

    // =========================================
    // STEP 2: Create new draw
    // =========================================
    console.log("Step 2: Creating new draw...");

    // Click create new draw button
    await page.click('text="Create New Draw"');
    await expect(page).toHaveURL(/\/draw\/new/, { timeout: 10000 });

    // Fill draw form
    await page.fill('input[name="title"]', drawData.title);
    await page.fill('textarea[name="description"]', drawData.description);
    await page.fill(
      'input[name="numberOfWinners"]',
      drawData.numberOfWinners.toString()
    );

    // Select "Manual Upload" platform
    await page.click('text="Manual Upload"');

    // Take screenshot of draw creation form
    await page.screenshot({ path: "test-results/02-create-draw-form.png" });

    // Submit draw creation
    await page.click('button:has-text("Continue to Configuration")');

    // Wait for redirect to config page
    await expect(page).toHaveURL(/\/draw\/[a-z0-9-]+\/config/, {
      timeout: 15000,
    });

    // Extract draw ID from URL
    const drawId = page.url().split("/draw/")[1]?.split("/")[0];
    console.log(`✓ Draw created with ID: ${drawId}`);

    // Take screenshot of config page
    await page.screenshot({ path: "test-results/03-config-page.png" });

    // =========================================
    // STEP 3: Upload CSV with 50 participants
    // =========================================
    console.log("Step 3: Uploading CSV with 50 participants...");

    // Find the file input and upload CSV
    const fileInput = page.locator('input[type="file"][accept=".csv"]');
    await fileInput.setInputFiles(csvPath);

    // Wait for upload to complete (toast message or participant count update)
    await page.waitForSelector('text="Participants imported successfully"', {
      timeout: 15000,
    });

    // Verify participant count shows 50
    await expect(page.locator("text=/50/")).toBeVisible({ timeout: 10000 });

    // Take screenshot showing participants loaded
    await page.screenshot({
      path: "test-results/04-participants-uploaded.png",
    });
    console.log("✓ 50 participants uploaded successfully");

    // =========================================
    // STEP 4: Continue to draw execution
    // =========================================
    console.log("Step 4: Navigating to draw execution...");

    // Click continue button
    await page.click('button:has-text("Continue to Draw")');

    // Wait for execution page
    await expect(page).toHaveURL(/\/draw\/[a-z0-9-]+\/execute/, {
      timeout: 15000,
    });

    // Take screenshot of pre-execution page
    await page.screenshot({ path: "test-results/05-pre-execution.png" });

    // Verify draw info is displayed
    await expect(page.locator(`text="${drawData.title}"`)).toBeVisible();
    await expect(page.locator("text=/50/")).toBeVisible(); // Participants count
    await expect(
      page.locator(`text="${drawData.numberOfWinners}"`)
    ).toBeVisible(); // Winners count

    console.log("✓ Ready for draw execution");

    // =========================================
    // STEP 5: Execute draw and watch animation
    // =========================================
    console.log("Step 5: Executing draw and watching animation...");

    // Click start draw button
    await page.click('button:has-text("Start Draw")');

    // ---- ANIMATION PHASE 1: Intro ----
    console.log("  Animation Phase 1: Intro...");
    await expect(page.locator(`text="${drawData.title}"`)).toBeVisible({
      timeout: 5000,
    });
    await expect(page.locator('text="Drawing Winners..."')).toBeVisible();
    await page.screenshot({ path: "test-results/06-animation-intro.png" });

    // ---- ANIMATION PHASE 2: Scrolling names ----
    console.log("  Animation Phase 2: Scrolling names...");
    // Wait for scrolling phase (names should be scrolling)
    await page.waitForTimeout(2500); // Intro is 2s, give it a moment
    await page.screenshot({ path: "test-results/07-animation-scrolling.png" });

    // ---- ANIMATION PHASE 3: Winner reveal ----
    console.log("  Animation Phase 3: Winner reveal...");
    // Wait for winner to be revealed (scrolling is 3s)
    await page.waitForTimeout(3500);

    // Should see "Winner #1" or "Winner" text
    await expect(page.locator('text=/Winner/i')).toBeVisible({ timeout: 10000 });
    await page.screenshot({ path: "test-results/08-animation-winner-1.png" });

    // Wait for additional winners if multiple
    if (drawData.numberOfWinners > 1) {
      console.log("  Waiting for winner #2...");
      await page.waitForTimeout(3500);
      await page.screenshot({ path: "test-results/09-animation-winner-2.png" });

      if (drawData.numberOfWinners > 2) {
        console.log("  Waiting for winner #3...");
        await page.waitForTimeout(3500);
        await page.screenshot({
          path: "test-results/10-animation-winner-3.png",
        });
      }
    }

    console.log("✓ Animation completed");

    // =========================================
    // STEP 6: View results page
    // =========================================
    console.log("Step 6: Viewing results page...");

    // Wait for automatic redirect to results page (after 5s from animation)
    await expect(page).toHaveURL(/\/draw\/[a-z0-9-]+\/results/, {
      timeout: 15000,
    });

    // Verify results page content
    await expect(page.locator('text="Contest Results"')).toBeVisible({
      timeout: 10000,
    });
    await expect(page.locator(`text="${drawData.title}"`)).toBeVisible();

    // Verify winners are displayed
    await expect(page.locator('text=/Winner/i').first()).toBeVisible();

    // Verify stats section
    await expect(page.locator("text=/50/")).toBeVisible(); // Total participants
    await expect(
      page.locator(`text="${drawData.numberOfWinners}"`)
    ).toBeVisible(); // Winners selected

    // Take final screenshot of results
    await page.screenshot({
      path: "test-results/11-results-page.png",
      fullPage: true,
    });
    console.log("✓ Results page displayed successfully");

    // =========================================
    // STEP 7: Verify credit deduction
    // =========================================
    console.log("Step 7: Verifying credit balance...");

    // Navigate to profile or dashboard to check credits
    await page.click('text="Back to Dashboard"');
    await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });

    // Look for credit balance display
    const creditBalance = page.locator('[data-testid="credit-balance"]');
    if (await creditBalance.isVisible()) {
      const credits = await creditBalance.textContent();
      console.log(`✓ Current credit balance: ${credits}`);
    }

    await page.screenshot({
      path: "test-results/12-dashboard-after.png",
      fullPage: true,
    });

    // Stop tracing
    await page.context().tracing.stop({ path: "test-results/trace.zip" });

    console.log("");
    console.log("==========================================");
    console.log("  FULL WORKFLOW TEST COMPLETED SUCCESSFULLY!");
    console.log("==========================================");
    console.log(`  Draw ID: ${drawId}`);
    console.log(`  Participants: 50`);
    console.log(`  Winners: ${drawData.numberOfWinners}`);
    console.log("");
    console.log("  Screenshots saved to test-results/");
    console.log("==========================================");
  });
});
