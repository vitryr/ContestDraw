/**
 * Brand Service Tests
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { PrismaClient } from '@prisma/client';
import { BrandService } from '../../backend/src/services/brand.service';
import { OrganizationService } from '../../backend/src/services/organization.service';

const prisma = new PrismaClient();
const brandService = new BrandService(prisma);
const organizationService = new OrganizationService(prisma);

describe('Brand Service', () => {
  let testUserId: string;
  let testOrganizationId: string;
  let testBrandId: string;

  beforeAll(async () => {
    // Create test user
    const user = await prisma.user.create({
      data: {
        email: 'brand-test@test.com',
        password: 'hashedpassword',
        firstName: 'Brand',
        lastName: 'Tester'
      }
    });
    testUserId = user.id;

    // Create test organization
    const organization = await organizationService.createOrganization(
      testUserId,
      {
        name: 'Brand Test Agency',
        slug: 'brand-test-agency',
        billingEmail: 'billing@brand-test.com'
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

  describe('createBrand', () => {
    it('should create brand within organization', async () => {
      const brand = await brandService.createBrand(
        testOrganizationId,
        testUserId,
        {
          name: 'Test Brand',
          slug: 'test-brand',
          description: 'A test brand for testing'
        }
      );

      testBrandId = brand.id;

      expect(brand).toBeDefined();
      expect(brand.name).toBe('Test Brand');
      expect(brand.slug).toBe('test-brand');
      expect(brand.organizationId).toBe(testOrganizationId);
      expect(brand.isActive).toBe(true);
    });

    it('should reject duplicate slug in same organization', async () => {
      await expect(
        brandService.createBrand(testOrganizationId, testUserId, {
          name: 'Duplicate Brand',
          slug: 'test-brand', // Same slug
          description: 'Duplicate'
        })
      ).rejects.toThrow('Brand slug already exists in this organization');
    });
  });

  describe('getBrand', () => {
    it('should retrieve brand with relations', async () => {
      const brand = await brandService.getBrand(testBrandId);

      expect(brand).toBeDefined();
      expect(brand?.id).toBe(testBrandId);
      expect(brand?.organization).toBeDefined();
      expect(brand?.user).toBeDefined();
    });
  });

  describe('updateBrand', () => {
    it('should update brand details', async () => {
      const updated = await brandService.updateBrand(testBrandId, {
        name: 'Updated Brand Name',
        description: 'Updated description'
      });

      expect(updated.name).toBe('Updated Brand Name');
      expect(updated.description).toBe('Updated description');
    });
  });

  describe('getOrganizationBrands', () => {
    it('should list all brands for organization', async () => {
      const brands = await brandService.getOrganizationBrands(
        testOrganizationId
      );

      expect(brands.length).toBeGreaterThanOrEqual(1);
      expect(brands.some(b => b.id === testBrandId)).toBe(true);
    });
  });

  describe('getUserBrands', () => {
    it('should list brands accessible by user', async () => {
      const brands = await brandService.getUserBrands(testUserId);

      expect(brands.length).toBeGreaterThanOrEqual(1);
      expect(brands.some(b => b.id === testBrandId)).toBe(true);
    });
  });

  describe('toggleBrandStatus', () => {
    it('should toggle brand active status', async () => {
      const deactivated = await brandService.toggleBrandStatus(
        testBrandId,
        false
      );
      expect(deactivated.isActive).toBe(false);

      const activated = await brandService.toggleBrandStatus(testBrandId, true);
      expect(activated.isActive).toBe(true);
    });
  });

  describe('getBrandAnalytics', () => {
    it('should retrieve brand analytics', async () => {
      const analytics = await brandService.getBrandAnalytics(testBrandId);

      expect(analytics).toBeDefined();
      expect(analytics.totalDraws).toBeDefined();
      expect(analytics.totalParticipants).toBeDefined();
      expect(analytics.connectedAccounts).toBeDefined();
      expect(analytics.recentDraws).toBeDefined();
    });
  });
});
