/**
 * Branding Service Tests
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { PrismaClient } from '@prisma/client';
import { BrandingService } from '../../backend/src/services/branding.service';
import { OrganizationService } from '../../backend/src/services/organization.service';

const prisma = new PrismaClient();
const brandingService = new BrandingService(prisma);
const organizationService = new OrganizationService(prisma);

describe('Branding Service', () => {
  let testUserId: string;
  let testOrganizationId: string;

  beforeAll(async () => {
    // Create test user
    const user = await prisma.user.create({
      data: {
        email: 'branding-test@test.com',
        password: 'hashedpassword',
        firstName: 'Branding',
        lastName: 'Tester'
      }
    });
    testUserId = user.id;

    // Create test organization
    const organization = await organizationService.createOrganization(
      testUserId,
      {
        name: 'Branding Test Agency',
        slug: 'branding-test-agency',
        billingEmail: 'billing@branding-test.com'
      }
    );
    testOrganizationId = organization.id;
  });

  afterAll(async () => {
    // Cleanup
    if (testOrganizationId) {
      await prisma.organization.delete({ where: { id: testOrganizationId } });
    }
    await prisma.user.delete({ where: { id: testUserId } });
    await prisma.$disconnect();
  });

  describe('getOrCreateBranding', () => {
    it('should create default branding if not exists', async () => {
      const branding = await brandingService.getOrCreateBranding(
        testOrganizationId
      );

      expect(branding).toBeDefined();
      expect(branding.organizationId).toBe(testOrganizationId);
      expect(branding.primaryColor).toBe('#1976d2');
      expect(branding.secondaryColor).toBe('#dc004e');
      expect(branding.removeBranding).toBe(false);
    });

    it('should return existing branding on second call', async () => {
      const branding = await brandingService.getOrCreateBranding(
        testOrganizationId
      );

      expect(branding).toBeDefined();
      expect(branding.organizationId).toBe(testOrganizationId);
    });
  });

  describe('updateBranding', () => {
    it('should update branding details', async () => {
      const updated = await brandingService.updateBranding(testOrganizationId, {
        primaryColor: '#ff0000',
        secondaryColor: '#00ff00',
        accentColor: '#0000ff'
      });

      expect(updated.primaryColor).toBe('#ff0000');
      expect(updated.secondaryColor).toBe('#00ff00');
      expect(updated.accentColor).toBe('#0000ff');
    });
  });

  describe('uploadLogo', () => {
    it('should set logo URL', async () => {
      const branding = await brandingService.uploadLogo(
        testOrganizationId,
        'https://example.com/logo.png'
      );

      expect(branding.logoUrl).toBe('https://example.com/logo.png');
    });
  });

  describe('updateColorTheme', () => {
    it('should update color theme', async () => {
      const branding = await brandingService.updateColorTheme(
        testOrganizationId,
        {
          primaryColor: '#333333',
          secondaryColor: '#666666'
        }
      );

      expect(branding.primaryColor).toBe('#333333');
      expect(branding.secondaryColor).toBe('#666666');
    });
  });

  describe('setCustomDomain', () => {
    it('should set custom domain', async () => {
      const domain = 'custom-test.example.com';
      const branding = await brandingService.setCustomDomain(
        testOrganizationId,
        domain
      );

      expect(branding.customDomain).toBe(domain);
    });

    it('should reject duplicate domain', async () => {
      // Create another organization
      const user2 = await prisma.user.create({
        data: {
          email: 'branding-test-2@test.com',
          password: 'hashedpassword'
        }
      });

      const org2 = await organizationService.createOrganization(user2.id, {
        name: 'Another Org',
        slug: 'another-org-2',
        billingEmail: 'billing@another.com'
      });

      await expect(
        brandingService.setCustomDomain(
          org2.id,
          'custom-test.example.com' // Same domain
        )
      ).rejects.toThrow('Custom domain already in use');

      // Cleanup
      await prisma.organization.delete({ where: { id: org2.id } });
      await prisma.user.delete({ where: { id: user2.id } });
    });
  });

  describe('setCustomCSS', () => {
    it('should set custom CSS', async () => {
      const css = '.custom { color: red; }';
      const branding = await brandingService.setCustomCSS(
        testOrganizationId,
        css
      );

      expect(branding.customCss).toBe(css);
    });

    it('should reject CSS exceeding size limit', async () => {
      const largeCss = 'a'.repeat(60000); // > 50KB

      await expect(
        brandingService.setCustomCSS(testOrganizationId, largeCss)
      ).rejects.toThrow('Custom CSS exceeds maximum size');
    });
  });

  describe('generateCSSVariables', () => {
    it('should generate CSS variables from branding', async () => {
      const branding = await brandingService.getOrCreateBranding(
        testOrganizationId
      );
      const css = brandingService.generateCSSVariables(branding);

      expect(css).toContain(':root');
      expect(css).toContain('--primary-color');
      expect(css).toContain('--secondary-color');
    });
  });

  describe('getFrontendConfig', () => {
    it('should return frontend-friendly configuration', async () => {
      const config = await brandingService.getFrontendConfig(
        testOrganizationId
      );

      expect(config).toBeDefined();
      expect(config.colors).toBeDefined();
      expect(config.colors.primary).toBeDefined();
      expect(config.colors.secondary).toBeDefined();
      expect(config.removeBranding).toBeDefined();
    });
  });

  describe('resetBranding', () => {
    it('should reset branding to defaults', async () => {
      // First customize
      await brandingService.updateBranding(testOrganizationId, {
        primaryColor: '#custom',
        logoUrl: 'https://example.com/custom.png'
      });

      // Then reset
      const branding = await brandingService.resetBranding(testOrganizationId);

      expect(branding.primaryColor).toBe('#1976d2');
      expect(branding.logoUrl).toBeNull();
      expect(branding.customCss).toBeNull();
    });
  });
});
