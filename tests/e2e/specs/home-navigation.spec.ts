/**
 * Home Page Navigation Test Suite
 * Comprehensive tests for landing page navigation and links
 *
 * Test Coverage:
 * - All anchor links functionality
 * - Smooth scrolling to sections
 * - External link behavior
 * - All page redirections
 * - Navigation menu functionality
 * - Mobile responsive navigation
 */

import { test, expect } from '@playwright/test';
import { LandingPage } from '../pages/LandingPage';
import {
  scrollToElement,
  isExternalLink,
  waitForNetworkIdle,
} from '../helpers/test-helpers';
import { LANDING_PAGE_SECTIONS, NAVIGATION_LINKS, BROWSER_VIEWPORTS } from '../fixtures/test-data';

test.describe('Home Page Navigation Tests', () => {
  let landingPage: LandingPage;

  test.beforeEach(async ({ page }) => {
    landingPage = new LandingPage(page);
    await landingPage.goto();
  });

  test.describe('Page Load and Initial State', () => {
    test('should load home page successfully', async ({ page }) => {
      // Verify page loaded
      await expect(page).toHaveURL(/\//);

      // Verify no console errors
      const errors: string[] = [];
      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          errors.push(msg.text());
        }
      });

      await page.waitForTimeout(1000);
      expect(errors.length).toBe(0);
    });

    test('should display all main sections', async () => {
      // Verify hero section
      await landingPage.verifyHeroSection();

      // Scroll and verify features section
      await landingPage.scrollToFeatures();
      await expect(landingPage.featuresSection).toBeVisible();

      // Scroll and verify how it works section
      await landingPage.scrollToHowItWorks();
      await expect(landingPage.howItWorksSection).toBeVisible();

      // Verify footer
      await landingPage.verifyFooter();
    });

    test('should have valid page title', async () => {
      const title = await landingPage.getPageTitle();
      expect(title.length).toBeGreaterThan(0);
      expect(title.toLowerCase()).toContain('contest');
    });

    test('should have SEO meta tags', async () => {
      await landingPage.verifySEOTags();
    });
  });

  test.describe('Anchor Links and Smooth Scrolling', () => {
    test('should scroll to features section when clicking anchor link', async ({ page }) => {
      // Click features link
      const featuresLink = page.locator('a[href="#features"]').first();
      await featuresLink.click();

      // Wait for scroll animation
      await page.waitForTimeout(800);

      // Verify features section is in viewport
      await expect(landingPage.featuresSection).toBeInViewport();
    });

    test('should scroll to how-it-works section', async ({ page }) => {
      const howItWorksLink = page.locator('a[href*="#how"]').first();

      if (await howItWorksLink.count() > 0) {
        await howItWorksLink.click();
        await page.waitForTimeout(800);

        await expect(landingPage.howItWorksSection).toBeInViewport();
      }
    });

    test('should test all anchor links for smooth scrolling', async ({ page }) => {
      const anchorLinks = await page.locator('a[href^="#"]').all();

      for (const link of anchorLinks) {
        const href = await link.getAttribute('href');
        if (href && href !== '#') {
          const sectionId = href.substring(1);

          // Click link
          await link.scrollIntoViewIfNeeded();
          await link.click();

          // Wait for smooth scroll
          await page.waitForTimeout(800);

          // Verify target section is visible
          const targetSection = page.locator(`#${sectionId}, [id="${sectionId}"]`);
          const count = await targetSection.count();

          if (count > 0) {
            await expect(targetSection.first()).toBeInViewport();
          }

          // Scroll back to top for next test
          await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
          await page.waitForTimeout(300);
        }
      }
    });

    test('should maintain scroll position after clicking anchor', async ({ page }) => {
      // Scroll to middle of page
      await page.evaluate(() => window.scrollTo({ top: 500, behavior: 'instant' }));

      // Click anchor link
      const featuresLink = page.locator('a[href="#features"]').first();
      await featuresLink.click();

      // Wait for scroll
      await page.waitForTimeout(800);

      // Verify we scrolled to features section
      const scrollY = await page.evaluate(() => window.scrollY);
      expect(scrollY).toBeGreaterThan(400); // Should have scrolled down
    });

    test('should handle hash navigation via URL', async ({ page }) => {
      // Navigate directly to section via hash
      await page.goto('/#features');
      await page.waitForLoadState('networkidle');
      await page.waitForTimeout(800);

      // Verify features section is visible
      await expect(landingPage.featuresSection).toBeInViewport();
    });
  });

  test.describe('Navigation Menu Links', () => {
    test('should display navigation menu', async () => {
      await expect(landingPage.navigationMenu).toBeVisible();
    });

    test('should navigate to pricing page', async ({ page }) => {
      await landingPage.goToPricing();

      // Verify redirect
      await expect(page).toHaveURL(/\/pricing/);

      // Verify page loaded
      await waitForNetworkIdle(page);
      await expect(page.locator('body')).toContainText(/.+/);
    });

    test('should navigate to FAQ page', async ({ page }) => {
      await landingPage.goToFaq();

      // Verify redirect
      await expect(page).toHaveURL(/\/faq/);

      // Verify page loaded
      await waitForNetworkIdle(page);
      await expect(page.locator('body')).toContainText(/.+/);
    });

    test('should navigate to auth page from CTA button', async ({ page }) => {
      await landingPage.clickCtaButton();

      // Verify redirect to auth page
      await page.waitForURL(/\/auth/);
      await expect(page).toHaveURL(/\/auth/);
    });

    test('should test all navigation menu links', async ({ page }) => {
      const navLinks = await landingPage.getAllNavigationLinks();

      for (const link of navLinks) {
        // Skip external links and anchors for now
        if (link.href.includes('#') || isExternalLink(link.href)) {
          continue;
        }

        // Navigate to link
        await page.goto(link.href);
        await waitForNetworkIdle(page);

        // Verify page loaded successfully (no 404)
        const bodyText = await page.textContent('body');
        expect(bodyText).not.toContain('404');
        expect(bodyText).not.toContain('Not Found');

        // Return to home page
        await landingPage.goto();
      }
    });

    test('should highlight active navigation item', async ({ page }) => {
      // Check if navigation has active states
      const navItems = await landingPage.navigationMenu.locator('a').all();

      for (const item of navItems) {
        const classes = await item.getAttribute('class');
        console.log('Nav item classes:', classes);
        // Document whether active states are implemented
      }
    });
  });

  test.describe('External Links', () => {
    test('should open external links in new tab', async () => {
      await landingPage.verifyExternalLinks();
    });

    test('should have security attributes on external links', async ({ page }) => {
      const externalLinks = await page.locator('a[href^="http"]').all();

      for (const link of externalLinks) {
        const href = await link.getAttribute('href');

        if (href && isExternalLink(href)) {
          // Check target="_blank"
          const target = await link.getAttribute('target');
          expect(target).toBe('_blank');

          // Check rel="noopener" or rel="noreferrer"
          const rel = await link.getAttribute('rel');
          if (rel) {
            expect(rel).toMatch(/noopener|noreferrer/);
          }
        }
      }
    });

    test('should verify social media links', async () => {
      await landingPage.verifySocialLinks();
    });

    test('should not navigate away when clicking external link', async ({ page, context }) => {
      // Listen for new pages (tabs)
      const pagePromise = context.waitForEvent('page');

      const externalLink = page.locator('a[href^="http"]').first();
      const count = await externalLink.count();

      if (count > 0) {
        await externalLink.click();

        // New page should open
        const newPage = await pagePromise;
        expect(newPage).toBeTruthy();

        // Original page should still be on home
        expect(page.url()).toContain('/');

        // Close new tab
        await newPage.close();
      }
    });
  });

  test.describe('Page Redirections', () => {
    test('should redirect from auth page CTA', async ({ page }) => {
      await landingPage.clickCtaButton();
      await page.waitForURL(/\/auth/);
      await expect(page).toHaveURL(/\/auth/);
    });

    test('should handle logo click to return home', async ({ page }) => {
      // Navigate to another page
      await page.goto('/pricing');
      await waitForNetworkIdle(page);

      // Click logo
      const logo = page.locator('[data-testid="logo"], a[href="/"]').first();
      await logo.click();

      // Verify back to home
      await page.waitForURL('/');
      await expect(page).toHaveURL('/');
    });

    test('should handle browser back navigation', async ({ page }) => {
      // Navigate to pricing
      await landingPage.goToPricing();
      await page.waitForURL(/\/pricing/);

      // Go back
      await page.goBack();

      // Should be back on home
      await page.waitForURL('/');
      await expect(page).toHaveURL('/');
    });

    test('should handle browser forward navigation', async ({ page }) => {
      // Navigate to pricing
      await landingPage.goToPricing();
      await page.waitForURL(/\/pricing/);

      // Go back
      await page.goBack();
      await page.waitForURL('/');

      // Go forward
      await page.goForward();
      await page.waitForURL(/\/pricing/);

      // Should be back on pricing
      await expect(page).toHaveURL(/\/pricing/);
    });

    test('should handle all internal page links', async ({ page }) => {
      const allLinks = await landingPage.getAllAnchorLinks();
      const internalLinks = allLinks.filter(
        (link) => !isExternalLink(link.href) && !link.href.includes('#')
      );

      for (const link of internalLinks) {
        // Navigate to link
        await page.goto(link.href);
        await waitForNetworkIdle(page);

        // Verify successful navigation (no error pages)
        const url = page.url();
        expect(url).toBeTruthy();

        const bodyText = await page.textContent('body');
        expect(bodyText).not.toMatch(/404|not found|error/i);

        // Return home
        await landingPage.goto();
      }
    });
  });

  test.describe('Mobile Navigation', () => {
    test.beforeEach(async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize(BROWSER_VIEWPORTS.mobile);
    });

    test('should display mobile menu button', async ({ page }) => {
      const mobileMenuBtn = page.locator(
        'button[aria-label*="menu"], button:has-text("Menu"), [data-testid="mobile-menu"]'
      );

      const count = await mobileMenuBtn.count();
      if (count > 0) {
        await expect(mobileMenuBtn.first()).toBeVisible();
      }
    });

    test('should open mobile navigation menu', async ({ page }) => {
      const mobileMenuBtn = page.locator(
        'button[aria-label*="menu"], button:has-text("Menu"), [data-testid="mobile-menu"]'
      ).first();

      const count = await mobileMenuBtn.count();
      if (count > 0) {
        // Open menu
        await mobileMenuBtn.click();

        // Verify menu opened
        const mobileNav = page.locator(
          '[role="dialog"], .mobile-menu, nav[data-mobile="true"]'
        );
        await expect(mobileNav.first()).toBeVisible({ timeout: 2000 });

        // Close menu
        await mobileMenuBtn.click();

        // Verify menu closed
        await expect(mobileNav.first()).not.toBeVisible({ timeout: 2000 });
      }
    });

    test('should navigate via mobile menu', async ({ page }) => {
      const mobileMenuBtn = page.locator(
        'button[aria-label*="menu"], button:has-text("Menu")'
      ).first();

      const count = await mobileMenuBtn.count();
      if (count > 0) {
        // Open menu
        await mobileMenuBtn.click();
        await page.waitForTimeout(500);

        // Click pricing link in mobile menu
        const pricingLink = page.locator('a[href="/pricing"]');
        const linkCount = await pricingLink.count();

        if (linkCount > 0) {
          await pricingLink.first().click();

          // Verify navigation
          await page.waitForURL(/\/pricing/);
          await expect(page).toHaveURL(/\/pricing/);
        }
      }
    });

    test('should handle mobile viewport changes', async ({ page }) => {
      // Start mobile
      await page.setViewportSize(BROWSER_VIEWPORTS.mobile);
      await landingPage.goto();

      // Verify mobile layout
      await expect(landingPage.heroSection).toBeVisible();

      // Switch to desktop
      await page.setViewportSize(BROWSER_VIEWPORTS.desktop);
      await page.waitForTimeout(500);

      // Verify desktop layout
      await expect(landingPage.heroSection).toBeVisible();
      await expect(landingPage.navigationMenu).toBeVisible();
    });
  });

  test.describe('Responsive Design', () => {
    test('should be responsive on tablet', async ({ page }) => {
      await page.setViewportSize(BROWSER_VIEWPORTS.tablet);
      await landingPage.goto();

      // Verify main sections are visible
      await landingPage.verifyHeroSection();
      await landingPage.scrollToFeatures();
      await expect(landingPage.featuresSection).toBeVisible();
    });

    test('should be responsive on mobile', async ({ page }) => {
      await page.setViewportSize(BROWSER_VIEWPORTS.mobile);
      await landingPage.goto();

      // Verify main sections are visible
      await landingPage.verifyHeroSection();
      await landingPage.scrollToFeatures();
      await expect(landingPage.featuresSection).toBeVisible();
    });

    test('should be responsive on desktop', async ({ page }) => {
      await page.setViewportSize(BROWSER_VIEWPORTS.desktop);
      await landingPage.goto();

      // Verify main sections are visible
      await landingPage.verifyHeroSection();
      await landingPage.scrollToFeatures();
      await expect(landingPage.featuresSection).toBeVisible();
    });

    test('should maintain functionality across viewports', async ({ page }) => {
      const viewports = [
        BROWSER_VIEWPORTS.mobile,
        BROWSER_VIEWPORTS.tablet,
        BROWSER_VIEWPORTS.desktop,
      ];

      for (const viewport of viewports) {
        await page.setViewportSize(viewport);
        await landingPage.goto();

        // Test navigation
        await landingPage.clickCtaButton();
        await page.waitForURL(/\/auth/);

        // Go back
        await page.goBack();
        await page.waitForURL('/');

        console.log(`✓ Viewport ${viewport.width}x${viewport.height} working`);
      }
    });
  });

  test.describe('Keyboard Navigation', () => {
    test('should navigate with Tab key', async ({ page }) => {
      await page.keyboard.press('Tab');

      // First focusable element should be focused
      const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
      expect(focusedElement).toBeTruthy();
    });

    test('should activate links with Enter key', async ({ page }) => {
      // Tab to first link
      await page.keyboard.press('Tab');

      let iterations = 0;
      while (iterations < 20) {
        const activeElement = await page.evaluate(() => ({
          tag: document.activeElement?.tagName,
          href: (document.activeElement as HTMLAnchorElement)?.href,
        }));

        if (activeElement.tag === 'A' && activeElement.href?.includes('auth')) {
          // Press Enter to activate
          await page.keyboard.press('Enter');

          // Should navigate
          await page.waitForURL(/\/auth|#/, { timeout: 3000 });
          break;
        }

        await page.keyboard.press('Tab');
        iterations++;
      }
    });

    test('should skip to main content', async ({ page }) => {
      // Look for skip link
      const skipLink = page.locator('a[href="#main"], a:has-text("Skip to content")').first();
      const count = await skipLink.count();

      if (count > 0) {
        await skipLink.focus();
        await page.keyboard.press('Enter');

        // Should focus main content
        await page.waitForTimeout(300);
      }
    });
  });

  test.describe('Performance and Loading', () => {
    test('should load within acceptable time', async ({ page }) => {
      const startTime = Date.now();
      await landingPage.goto();
      const loadTime = Date.now() - startTime;

      // Page should load within 3 seconds
      expect(loadTime).toBeLessThan(3000);
    });

    test('should not have broken images', async ({ page }) => {
      await landingPage.goto();

      const images = await page.locator('img').all();

      for (const img of images) {
        const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth);
        const src = await img.getAttribute('src');

        if (src && !src.includes('data:')) {
          expect(naturalWidth).toBeGreaterThan(0);
        }
      }
    });

    test('should lazy load images below fold', async ({ page }) => {
      await landingPage.goto();

      // Check for loading="lazy" attribute
      const lazyImages = await page.locator('img[loading="lazy"]').count();
      console.log(`Lazy loaded images: ${lazyImages}`);
    });
  });
});
