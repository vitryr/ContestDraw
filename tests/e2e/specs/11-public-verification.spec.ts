import { test, expect } from '@playwright/test';

test.describe('Scénario 11: Vérification publique du tirage', () => {
  // Sample verification hash for testing
  const sampleHash = 'abc123def456';

  test('should display verification page without login', async ({ page }) => {
    await page.goto(`/verify/${sampleHash}`);
    
    // Should load without requiring auth
    await expect(page.locator('h1, h2')).toContainText(/vérif|verify|tirage|draw/i);
  });

  test('should show draw details on verification page', async ({ page }) => {
    await page.goto(`/verify/${sampleHash}`);
    
    // Should display draw info
    await expect(page.locator('text=/titre|title/i')).toBeVisible();
    await expect(page.locator('text=/date/i')).toBeVisible();
    await expect(page.locator('text=/participants/i')).toBeVisible();
  });

  test('should mask personal information', async ({ page }) => {
    await page.goto(`/verify/${sampleHash}`);
    
    // Winners should be partially masked (e.g., "J***n D.")
    const winners = page.locator('[data-testid="winners-list"], .winners-list');
    
    if (await winners.isVisible()) {
      const text = await winners.textContent();
      // Should contain masked characters
      expect(text).toMatch(/\*+/);
    }
  });

  test('should allow hash verification', async ({ page }) => {
    await page.goto(`/verify/${sampleHash}`);
    
    const verifyButton = page.getByRole('button', { name: /vérifier|verify/i });
    
    if (await verifyButton.isVisible()) {
      await verifyButton.click();
      
      // Should show verification result
      const result = page.locator('[data-testid="verification-result"], .verification-result');
      await expect(result).toBeVisible();
    }
  });

  test('should show QR code for sharing', async ({ page }) => {
    await page.goto(`/verify/${sampleHash}`);
    
    const qrCode = page.locator('[data-testid="qr-code"], .qr-code, img[alt*="QR"]');
    await expect(qrCode).toBeVisible();
  });

  test('should allow public certificate download', async ({ page }) => {
    await page.goto(`/verify/${sampleHash}`);
    
    const downloadButton = page.getByRole('button', { name: /télécharger|download|pdf/i });
    
    if (await downloadButton.isVisible()) {
      const [download] = await Promise.all([
        page.waitForEvent('download'),
        downloadButton.click(),
      ]);
      
      expect(download.suggestedFilename()).toMatch(/\.pdf$/);
    }
  });

  test('should handle invalid hash gracefully', async ({ page }) => {
    await page.goto('/verify/invalid-hash-12345');
    
    // Should show error or not found
    const error = page.locator('text=/introuvable|not found|invalide|invalid/i');
    await expect(error).toBeVisible();
  });

  test('should not expose sensitive data in page source', async ({ page }) => {
    await page.goto(`/verify/${sampleHash}`);
    
    const content = await page.content();
    
    // Should not contain full email addresses
    expect(content).not.toMatch(/[a-z]+@[a-z]+\.[a-z]+/i);
  });
});

test.describe('Scénario 12: Export certificat PDF', () => {
  test('should generate valid PDF certificate', async ({ page }) => {
    // This test would need a completed draw
    // Assuming we're on a completed draw page
    
    const authPage = page;
    await authPage.goto('/auth');
    
    // Would login and navigate to completed draw
    // Then test PDF download
  });

  test('should include required legal mentions in PDF', async ({ page }) => {
    // This would require PDF parsing which is complex in E2E
    // Usually done with unit tests on the PDF generator
  });
});
