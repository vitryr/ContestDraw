/**
 * Organization Service Tests
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { PrismaClient } from '@prisma/client';
import { OrganizationService } from '../../backend/src/services/organization.service';
import { OrganizationRole } from '../../backend/src/types/enterprise.types';

const prisma = new PrismaClient();
const organizationService = new OrganizationService(prisma);

describe('Organization Service', () => {
  let testUserId: string;
  let testOrganizationId: string;
  let memberUserId: string;

  beforeAll(async () => {
    // Create test users
    const owner = await prisma.user.create({
      data: {
        email: 'org-owner@test.com',
        password: 'hashedpassword',
        firstName: 'Owner',
        lastName: 'Test'
      }
    });
    testUserId = owner.id;

    const member = await prisma.user.create({
      data: {
        email: 'org-member@test.com',
        password: 'hashedpassword',
        firstName: 'Member',
        lastName: 'Test'
      }
    });
    memberUserId = member.id;
  });

  afterAll(async () => {
    // Cleanup
    if (testOrganizationId) {
      await prisma.organization.delete({ where: { id: testOrganizationId } });
    }
    await prisma.user.deleteMany({
      where: {
        email: { in: ['org-owner@test.com', 'org-member@test.com'] }
      }
    });
    await prisma.$disconnect();
  });

  describe('createOrganization', () => {
    it('should create organization with owner', async () => {
      const organization = await organizationService.createOrganization(
        testUserId,
        {
          name: 'Test Agency',
          slug: 'test-agency',
          billingEmail: 'billing@test-agency.com',
          maxSubAccounts: 10
        }
      );

      testOrganizationId = organization.id;

      expect(organization).toBeDefined();
      expect(organization.name).toBe('Test Agency');
      expect(organization.slug).toBe('test-agency');
      expect(organization.ownerId).toBe(testUserId);
      expect(organization.maxSubAccounts).toBe(10);
    });

    it('should reject duplicate slug', async () => {
      await expect(
        organizationService.createOrganization(testUserId, {
          name: 'Duplicate',
          slug: 'test-agency', // Same slug
          billingEmail: 'dup@test.com'
        })
      ).rejects.toThrow('Organization slug already exists');
    });
  });

  describe('getOrganization', () => {
    it('should retrieve organization with relations', async () => {
      const organization = await organizationService.getOrganization(
        testOrganizationId
      );

      expect(organization).toBeDefined();
      expect(organization?.id).toBe(testOrganizationId);
      expect(organization?.owner).toBeDefined();
      expect(organization?.members).toBeDefined();
    });
  });

  describe('updateOrganization', () => {
    it('should update organization details', async () => {
      const updated = await organizationService.updateOrganization(
        testOrganizationId,
        {
          name: 'Updated Agency Name',
          maxSubAccounts: 15
        }
      );

      expect(updated.name).toBe('Updated Agency Name');
      expect(updated.maxSubAccounts).toBe(15);
    });
  });

  describe('Member Management', () => {
    it('should invite member to organization', async () => {
      const member = await organizationService.inviteMember(
        testOrganizationId,
        testUserId,
        {
          email: 'org-member@test.com',
          role: OrganizationRole.MEMBER
        }
      );

      expect(member).toBeDefined();
      expect(member.userId).toBe(memberUserId);
      expect(member.role).toBe(OrganizationRole.MEMBER);
    });

    it('should list organization members', async () => {
      const members = await organizationService.getMembers(testOrganizationId);

      expect(members.length).toBeGreaterThanOrEqual(2); // Owner + member
      expect(members.some(m => m.userId === testUserId)).toBe(true);
      expect(members.some(m => m.userId === memberUserId)).toBe(true);
    });

    it('should update member role', async () => {
      const updated = await organizationService.updateMemberRole(
        testOrganizationId,
        memberUserId,
        OrganizationRole.ADMIN
      );

      expect(updated.role).toBe(OrganizationRole.ADMIN);
    });

    it('should check if user is member', async () => {
      const isMember = await organizationService.isMember(
        testOrganizationId,
        memberUserId
      );

      expect(isMember).toBe(true);
    });
  });

  describe('Permissions', () => {
    it('should return correct permissions for owner', async () => {
      const permissions = await organizationService.getUserPermissions(
        testOrganizationId,
        testUserId
      );

      expect(permissions.canManageMembers).toBe(true);
      expect(permissions.canManageBrands).toBe(true);
      expect(permissions.canManageBilling).toBe(true);
      expect(permissions.canManageBranding).toBe(true);
    });

    it('should return correct permissions for admin', async () => {
      const permissions = await organizationService.getUserPermissions(
        testOrganizationId,
        memberUserId
      );

      expect(permissions.canManageMembers).toBe(true);
      expect(permissions.canManageBrands).toBe(true);
      expect(permissions.canManageBilling).toBe(false); // Only owner
    });
  });

  describe('Dashboard', () => {
    it('should retrieve organization dashboard', async () => {
      const dashboard = await organizationService.getDashboard(
        testOrganizationId
      );

      expect(dashboard).toBeDefined();
      expect(dashboard.organization).toBeDefined();
      expect(dashboard.totalMembers).toBeGreaterThanOrEqual(2);
      expect(dashboard.totalBrands).toBeDefined();
      expect(dashboard.totalDraws).toBeDefined();
    });
  });
});
