/**
 * Organization Management Service
 * Handles multi-tenant organization operations, hierarchical permissions
 */

import { PrismaClient } from '@prisma/client';
import {
  Organization,
  OrganizationMember,
  OrganizationRole,
  CreateOrganizationDTO,
  UpdateOrganizationDTO,
  InviteMemberDTO,
  OrganizationDashboard,
  OrganizationPermissions
} from '../types/enterprise.types';

export class OrganizationService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Create new organization
   */
  async createOrganization(
    ownerId: string,
    data: CreateOrganizationDTO
  ): Promise<Organization> {
    // Check if slug is already taken
    const existing = await this.prisma.organization.findUnique({
      where: { slug: data.slug }
    });

    if (existing) {
      throw new Error('Organization slug already exists');
    }

    // Create organization with owner as first member
    const organization = await this.prisma.organization.create({
      data: {
        name: data.name,
        slug: data.slug,
        ownerId,
        billingEmail: data.billingEmail,
        maxSubAccounts: data.maxSubAccounts || 10,
        subscriptionTier: 'ENTERPRISE',
        settings: data.settings || {}
      }
    });

    // Automatically add owner as admin member
    await this.prisma.organizationMember.create({
      data: {
        organizationId: organization.id,
        userId: ownerId,
        role: OrganizationRole.OWNER,
        permissions: ['*'] // Full permissions
      }
    });

    return organization;
  }

  /**
   * Get organization by ID
   */
  async getOrganization(organizationId: string): Promise<Organization | null> {
    return this.prisma.organization.findUnique({
      where: { id: organizationId },
      include: {
        owner: {
          select: { id: true, email: true, firstName: true, lastName: true }
        },
        members: {
          include: {
            user: {
              select: { id: true, email: true, firstName: true, lastName: true }
            }
          }
        },
        brands: true,
        branding: true
      }
    });
  }

  /**
   * Update organization
   */
  async updateOrganization(
    organizationId: string,
    data: UpdateOrganizationDTO
  ): Promise<Organization> {
    return this.prisma.organization.update({
      where: { id: organizationId },
      data: {
        ...data,
        updatedAt: new Date()
      }
    });
  }

  /**
   * Delete organization
   */
  async deleteOrganization(organizationId: string): Promise<void> {
    await this.prisma.organization.delete({
      where: { id: organizationId }
    });
  }

  /**
   * Get all organizations for a user
   */
  async getUserOrganizations(userId: string): Promise<Organization[]> {
    const memberships = await this.prisma.organizationMember.findMany({
      where: { userId },
      include: {
        organization: {
          include: {
            branding: true,
            _count: {
              select: {
                members: true,
                brands: true
              }
            }
          }
        }
      }
    });

    return memberships.map(m => m.organization);
  }

  /**
   * Invite member to organization
   */
  async inviteMember(
    organizationId: string,
    invitedBy: string,
    data: InviteMemberDTO
  ): Promise<OrganizationMember> {
    // Find user by email
    const user = await this.prisma.user.findUnique({
      where: { email: data.email }
    });

    if (!user) {
      throw new Error('User not found with this email');
    }

    // Check if already a member
    const existing = await this.prisma.organizationMember.findUnique({
      where: {
        organizationId_userId: {
          organizationId,
          userId: user.id
        }
      }
    });

    if (existing) {
      throw new Error('User is already a member of this organization');
    }

    // Check sub-account limit
    const org = await this.prisma.organization.findUnique({
      where: { id: organizationId },
      include: { _count: { select: { members: true } } }
    });

    if (org && org._count.members >= org.maxSubAccounts) {
      throw new Error('Organization has reached maximum sub-accounts limit');
    }

    // Create membership
    return this.prisma.organizationMember.create({
      data: {
        organizationId,
        userId: user.id,
        role: data.role,
        permissions: data.permissions || [],
        invitedBy
      }
    });
  }

  /**
   * Remove member from organization
   */
  async removeMember(
    organizationId: string,
    userId: string
  ): Promise<void> {
    // Cannot remove owner
    const org = await this.prisma.organization.findUnique({
      where: { id: organizationId }
    });

    if (org && org.ownerId === userId) {
      throw new Error('Cannot remove organization owner');
    }

    await this.prisma.organizationMember.delete({
      where: {
        organizationId_userId: {
          organizationId,
          userId
        }
      }
    });
  }

  /**
   * Update member role and permissions
   */
  async updateMemberRole(
    organizationId: string,
    userId: string,
    role: OrganizationRole,
    permissions?: string[]
  ): Promise<OrganizationMember> {
    return this.prisma.organizationMember.update({
      where: {
        organizationId_userId: {
          organizationId,
          userId
        }
      },
      data: {
        role,
        permissions: permissions || [],
        updatedAt: new Date()
      }
    });
  }

  /**
   * Get organization members
   */
  async getMembers(organizationId: string): Promise<OrganizationMember[]> {
    return this.prisma.organizationMember.findMany({
      where: { organizationId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            createdAt: true
          }
        }
      },
      orderBy: { joinedAt: 'desc' }
    });
  }

  /**
   * Get organization dashboard with analytics
   */
  async getDashboard(organizationId: string): Promise<OrganizationDashboard> {
    const org = await this.getOrganization(organizationId);
    if (!org) {
      throw new Error('Organization not found');
    }

    const [members, brands, draws, creditTransactions] = await Promise.all([
      this.prisma.organizationMember.count({
        where: { organizationId }
      }),
      this.prisma.brand.count({
        where: { organizationId }
      }),
      this.prisma.brand.findMany({
        where: { organizationId },
        include: {
          draws: {
            include: { draw: true }
          }
        }
      }),
      this.prisma.organizationMember.findMany({
        where: { organizationId },
        include: {
          user: {
            include: {
              creditTransactions: {
                where: { type: 'CONSUMPTION' },
                orderBy: { createdAt: 'desc' },
                take: 10
              }
            }
          }
        }
      })
    ]);

    const totalDraws = draws.reduce((sum, brand) => sum + brand.draws.length, 0);
    const creditsUsed = creditTransactions.reduce(
      (sum, member) =>
        sum +
        member.user.creditTransactions.reduce(
          (total, tx) => total + Math.abs(tx.credits),
          0
        ),
      0
    );

    // Recent activity (last 10 events)
    const recentActivity = await this.getRecentActivity(organizationId, 10);

    return {
      organization: org,
      totalMembers: members,
      totalBrands: brands,
      totalDraws,
      creditsUsed,
      recentActivity
    };
  }

  /**
   * Get recent activity for organization
   */
  private async getRecentActivity(
    organizationId: string,
    limit: number
  ): Promise<any[]> {
    const brands = await this.prisma.brand.findMany({
      where: { organizationId },
      select: { id: true }
    });

    const brandIds = brands.map(b => b.id);

    const recentDraws = await this.prisma.brandDraw.findMany({
      where: { brandId: { in: brandIds } },
      include: {
        draw: {
          include: { user: { select: { id: true, email: true } } }
        },
        brand: { select: { name: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    });

    return recentDraws.map(bd => ({
      id: bd.id,
      type: 'draw' as const,
      description: `Draw "${bd.draw.title}" created in brand "${bd.brand.name}"`,
      userId: bd.draw.userId,
      brandId: bd.brandId,
      timestamp: bd.createdAt
    }));
  }

  /**
   * Check user permissions in organization
   */
  async getUserPermissions(
    organizationId: string,
    userId: string
  ): Promise<OrganizationPermissions> {
    const member = await this.prisma.organizationMember.findUnique({
      where: {
        organizationId_userId: {
          organizationId,
          userId
        }
      }
    });

    if (!member) {
      return {
        canManageMembers: false,
        canManageBrands: false,
        canManageBilling: false,
        canManageBranding: false,
        canCreateDraws: false,
        canViewAnalytics: false
      };
    }

    const hasFullAccess =
      member.role === OrganizationRole.OWNER ||
      member.role === OrganizationRole.ADMIN;

    return {
      canManageMembers: hasFullAccess,
      canManageBrands: hasFullAccess || member.role === OrganizationRole.MEMBER,
      canManageBilling: member.role === OrganizationRole.OWNER,
      canManageBranding: hasFullAccess,
      canCreateDraws: member.role !== OrganizationRole.VIEWER,
      canViewAnalytics: true
    };
  }

  /**
   * Check if user is member of organization
   */
  async isMember(organizationId: string, userId: string): Promise<boolean> {
    const member = await this.prisma.organizationMember.findUnique({
      where: {
        organizationId_userId: {
          organizationId,
          userId
        }
      }
    });

    return member !== null;
  }
}
