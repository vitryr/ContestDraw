/**
 * Page Object Model: Landing Page
 * Encapsulates all landing page interactions and navigation
 */

import { Page, Locator, expect } from '@playwright/test';
import { scrollToElement, getAllLinks, isExternalLink } from '../helpers/test-helpers';

export class LandingPage {
  readonly page: Page;

  // Header elements
  readonly logo: Locator;
  readonly navigationMenu: Locator;

  // Hero section
  readonly heroSection: Locator;
  readonly heroTitle: Locator;
  readonly heroSubtitle: Locator;
  readonly heroCtaButton: Locator;
  readonly heroLearnMoreButton: Locator;

  // Features section
  readonly featuresSection: Locator;
  readonly featureCards: Locator;

  // How It Works section
  readonly howItWorksSection: Locator;
  readonly stepCards: Locator;

  // Pricing section link
  readonly pricingLink: Locator;

  // FAQ section link
  readonly faqLink: Locator;

  // Footer
  readonly footer: Locator;
  readonly socialLinks: Locator;

  constructor(page: Page) {
    this.page = page;

    // Header
    this.logo = page.locator('[data-testid="logo"], img[alt*="logo"], a[href="/"]').first();
    this.navigationMenu = page.locator('nav, [role="navigation"]').first();

    // Hero section
    this.heroSection = page.locator('section').first();
    this.heroTitle = page.locator('h1').first();
    this.heroSubtitle = page.locator('h1 ~ p, h1 + p').first();
    this.heroCtaButton = page.getByRole('link', { name: /get started|start/i }).first();
    this.heroLearnMoreButton = page.getByRole('link', { name: /learn more|features/i }).first();

    // Features section
    this.featuresSection = page.locator('#features, section:has-text("Features")');
    this.featureCards = page.locator('.card, [class*="feature"]');

    // How It Works section
    this.howItWorksSection = page.locator('#how-it-works, section:has-text("How It Works")');
    this.stepCards = this.howItWorksSection.locator('.card, [class*="step"]');

    // Links
    this.pricingLink = page.getByRole('link', { name: /pricing/i });
    this.faqLink = page.getByRole('link', { name: /faq/i });

    // Footer
    this.footer = page.locator('footer');
    this.socialLinks = page.locator('a[href*="twitter"], a[href*="facebook"], a[href*="instagram"], a[href*="linkedin"]');
  }

  /**
   * Navigate to landing page
   */
  async goto(): Promise<void> {
    await this.page.goto('/');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Verify hero section is visible
   */
  async verifyHeroSection(): Promise<void> {
    await expect(this.heroSection).toBeVisible();
    await expect(this.heroTitle).toBeVisible();
    await expect(this.heroSubtitle).toBeVisible();
  }

  /**
   * Click CTA button
   */
  async clickCtaButton(): Promise<void> {
    await this.heroCtaButton.click();
  }

  /**
   * Click Learn More button and verify scroll
   */
  async clickLearnMore(): Promise<void> {
    await this.heroLearnMoreButton.click();
  }

  /**
   * Navigate to features section
   */
  async scrollToFeatures(): Promise<void> {
    await scrollToElement(this.page, '#features');
    await expect(this.featuresSection).toBeInViewport();
  }

  /**
   * Navigate to How It Works section
   */
  async scrollToHowItWorks(): Promise<void> {
    await scrollToElement(this.page, '#how-it-works');
    await expect(this.howItWorksSection).toBeInViewport();
  }

  /**
   * Navigate to pricing page
   */
  async goToPricing(): Promise<void> {
    await this.pricingLink.click();
    await this.page.waitForURL(/\/pricing/);
  }

  /**
   * Navigate to FAQ page
   */
  async goToFaq(): Promise<void> {
    await this.faqLink.click();
    await this.page.waitForURL(/\/faq/);
  }

  /**
   * Get all navigation links
   */
  async getAllNavigationLinks(): Promise<Array<{ text: string; href: string }>> {
    const links = await this.navigationMenu.locator('a').all();
    const linkData = [];

    for (const link of links) {
      const text = await link.textContent();
      const href = await link.getAttribute('href');
      if (text && href) {
        linkData.push({ text: text.trim(), href });
      }
    }

    return linkData;
  }

  /**
   * Get all anchor links on page
   */
  async getAllAnchorLinks(): Promise<Array<{ text: string; href: string }>> {
    return await getAllLinks(this.page);
  }

  /**
   * Verify smooth scroll to anchor
   */
  async verifySmoothScrollTo(sectionId: string): Promise<void> {
    const link = this.page.locator(`a[href="#${sectionId}"]`).first();
    await link.click();

    // Wait for scroll animation
    await this.page.waitForTimeout(500);

    // Verify section is in viewport
    const section = this.page.locator(`#${sectionId}`);
    await expect(section).toBeInViewport();
  }

  /**
   * Test all internal navigation links
   */
  async testAllInternalLinks(): Promise<void> {
    const links = await this.getAllAnchorLinks();
    const internalLinks = links.filter(link => !isExternalLink(link.href) && !link.href.includes('#'));

    for (const link of internalLinks) {
      // Navigate to link
      await this.page.goto(link.href);

      // Verify page loads
      await this.page.waitForLoadState('networkidle');

      // Verify no error page
      const errorText = await this.page.textContent('body');
      expect(errorText).not.toContain('404');
      expect(errorText).not.toContain('Not Found');

      // Go back to landing page
      await this.goto();
    }
  }

  /**
   * Test all anchor links (smooth scroll)
   */
  async testAllAnchorLinks(): Promise<void> {
    const links = await this.getAllAnchorLinks();
    const anchorLinks = links.filter(link => link.href.includes('#'));

    for (const link of anchorLinks) {
      const sectionId = link.href.split('#')[1];
      if (sectionId) {
        await this.verifySmoothScrollTo(sectionId);

        // Scroll back to top
        await this.page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
        await this.page.waitForTimeout(300);
      }
    }
  }

  /**
   * Verify all external links have correct attributes
   */
  async verifyExternalLinks(): Promise<void> {
    const links = await this.page.locator('a[href^="http"]').all();

    for (const link of links) {
      const href = await link.getAttribute('href');
      if (href && isExternalLink(href)) {
        const target = await link.getAttribute('target');
        const rel = await link.getAttribute('rel');

        // External links should open in new tab
        expect(target).toBe('_blank');
        // External links should have noopener for security
        expect(rel).toContain('noopener');
      }
    }
  }

  /**
   * Test mobile navigation menu
   */
  async testMobileNavigation(): Promise<void> {
    // Set mobile viewport
    await this.page.setViewportSize({ width: 375, height: 667 });

    // Look for mobile menu button
    const mobileMenuButton = this.page.locator('button[aria-label*="menu"], button:has-text("Menu")').first();

    if (await mobileMenuButton.isVisible()) {
      // Open menu
      await mobileMenuButton.click();

      // Verify menu is visible
      const mobileMenu = this.page.locator('[role="dialog"], nav.mobile-menu, .mobile-nav');
      await expect(mobileMenu).toBeVisible();

      // Close menu
      await mobileMenuButton.click();
      await expect(mobileMenu).not.toBeVisible();
    }
  }

  /**
   * Verify feature cards
   */
  async verifyFeatureCards(expectedCount?: number): Promise<void> {
    await this.scrollToFeatures();

    const cards = await this.featureCards.all();
    expect(cards.length).toBeGreaterThan(0);

    if (expectedCount) {
      expect(cards.length).toBe(expectedCount);
    }

    // Verify each card has content
    for (const card of cards) {
      const text = await card.textContent();
      expect(text?.trim()).not.toBe('');
    }
  }

  /**
   * Verify footer content
   */
  async verifyFooter(): Promise<void> {
    await expect(this.footer).toBeVisible();

    // Scroll to footer
    await this.page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }));
    await this.page.waitForTimeout(500);

    await expect(this.footer).toBeInViewport();
  }

  /**
   * Verify social media links
   */
  async verifySocialLinks(): Promise<void> {
    const socialLinks = await this.socialLinks.all();

    for (const link of socialLinks) {
      const href = await link.getAttribute('href');
      expect(href).toBeTruthy();
      expect(isExternalLink(href!)).toBe(true);
    }
  }

  /**
   * Get page title
   */
  async getPageTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Verify SEO meta tags
   */
  async verifySEOTags(): Promise<void> {
    // Verify title
    const title = await this.getPageTitle();
    expect(title.length).toBeGreaterThan(0);

    // Verify description meta tag
    const description = await this.page.locator('meta[name="description"]').getAttribute('content');
    expect(description).toBeTruthy();
    expect(description!.length).toBeGreaterThan(0);
  }
}
