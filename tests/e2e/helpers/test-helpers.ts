/**
 * Test Helper Utilities
 * Provides reusable helper functions for Playwright tests
 */

import { Page, expect } from '@playwright/test';

/**
 * Wait for network idle state
 */
export async function waitForNetworkIdle(page: Page, timeout = 5000): Promise<void> {
  await page.waitForLoadState('networkidle', { timeout });
}

/**
 * Wait for element to be visible with custom timeout
 */
export async function waitForElement(
  page: Page,
  selector: string,
  timeout = 10000
): Promise<void> {
  await page.waitForSelector(selector, { state: 'visible', timeout });
}

/**
 * Clear input field and type new value
 */
export async function clearAndFill(
  page: Page,
  selector: string,
  value: string
): Promise<void> {
  await page.fill(selector, '');
  await page.fill(selector, value);
}

/**
 * Generate unique test user credentials
 */
export function generateTestUser() {
  const timestamp = Date.now();
  return {
    name: `Test User ${timestamp}`,
    email: `test${timestamp}@example.com`,
    password: 'TestPassword123!',
  };
}

/**
 * Generate random string for testing
 */
export function generateRandomString(length = 10): string {
  return Math.random().toString(36).substring(2, length + 2);
}

/**
 * Check if element exists (without throwing)
 */
export async function elementExists(page: Page, selector: string): Promise<boolean> {
  try {
    const element = await page.$(selector);
    return element !== null;
  } catch {
    return false;
  }
}

/**
 * Take screenshot with timestamp
 */
export async function takeTimestampedScreenshot(
  page: Page,
  name: string
): Promise<void> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  await page.screenshot({
    path: `/Users/romainvitry/Documents/Dev/ContestDraw/tests/e2e/test-results/screenshots/${name}-${timestamp}.png`,
    fullPage: true,
  });
}

/**
 * Wait for toast notification to appear
 */
export async function waitForToast(
  page: Page,
  message?: string,
  timeout = 5000
): Promise<void> {
  if (message) {
    await page.waitForSelector(`text=${message}`, { timeout });
  } else {
    // Wait for any toast notification
    await page.waitForSelector('[role="status"], .toast, .notification', { timeout });
  }
}

/**
 * Check if URL matches pattern
 */
export async function expectUrlPattern(page: Page, pattern: RegExp | string): Promise<void> {
  const currentUrl = page.url();
  if (typeof pattern === 'string') {
    expect(currentUrl).toContain(pattern);
  } else {
    expect(currentUrl).toMatch(pattern);
  }
}

/**
 * Verify element text content
 */
export async function verifyTextContent(
  page: Page,
  selector: string,
  expectedText: string
): Promise<void> {
  const element = await page.locator(selector);
  await expect(element).toContainText(expectedText);
}

/**
 * Verify form validation error
 */
export async function verifyValidationError(
  page: Page,
  fieldName: string,
  errorMessage: string
): Promise<void> {
  const errorSelector = `input[name="${fieldName}"] ~ p.text-red-600, input[name="${fieldName}"] + p.text-red-600`;
  await waitForElement(page, errorSelector);
  await verifyTextContent(page, errorSelector, errorMessage);
}

/**
 * Check if link is external
 */
export function isExternalLink(href: string): boolean {
  try {
    const url = new URL(href);
    return url.hostname !== 'localhost' && !url.hostname.includes('127.0.0.1');
  } catch {
    return false;
  }
}

/**
 * Scroll to element smoothly
 */
export async function scrollToElement(
  page: Page,
  selector: string,
  behavior: 'auto' | 'smooth' = 'smooth'
): Promise<void> {
  await page.evaluate(
    ({ sel, beh }) => {
      const element = document.querySelector(sel);
      if (element) {
        element.scrollIntoView({ behavior: beh, block: 'center' });
      }
    },
    { sel: selector, beh: behavior }
  );
}

/**
 * Wait for API response
 */
export async function waitForAPIResponse(
  page: Page,
  urlPattern: string | RegExp,
  timeout = 10000
): Promise<any> {
  const response = await page.waitForResponse(
    (response) => {
      const url = response.url();
      if (typeof urlPattern === 'string') {
        return url.includes(urlPattern);
      }
      return urlPattern.test(url);
    },
    { timeout }
  );
  return response.json();
}

/**
 * Mock API response
 */
export async function mockAPIResponse(
  page: Page,
  urlPattern: string | RegExp,
  responseData: any,
  status = 200
): Promise<void> {
  await page.route(urlPattern, (route) => {
    route.fulfill({
      status,
      contentType: 'application/json',
      body: JSON.stringify(responseData),
    });
  });
}

/**
 * Check element visibility
 */
export async function isVisible(page: Page, selector: string): Promise<boolean> {
  try {
    const element = await page.locator(selector);
    return await element.isVisible();
  } catch {
    return false;
  }
}

/**
 * Get all links on page
 */
export async function getAllLinks(page: Page): Promise<Array<{ text: string; href: string }>> {
  return await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('a[href]'));
    return links.map((link) => ({
      text: link.textContent?.trim() || '',
      href: (link as HTMLAnchorElement).href,
    }));
  });
}

/**
 * Check if page has specific meta tag
 */
export async function hasMetaTag(
  page: Page,
  property: string,
  content?: string
): Promise<boolean> {
  const metaTags = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('meta')).map((meta) => ({
      property: meta.getAttribute('property') || meta.getAttribute('name'),
      content: meta.getAttribute('content'),
    }));
  });

  return metaTags.some(
    (tag) => tag.property === property && (!content || tag.content === content)
  );
}
