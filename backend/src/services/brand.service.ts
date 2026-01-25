/**
 * Brand Management Service
 * Multi-brand account management for organizations
 */

import { PrismaClient } from '@prisma/client';
import {
  Brand,
  CreateBrandDTO,
  UpdateBrandDTO
} from '../types/enterprise.types';

export class BrandService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Create new brand within organization
   */
  async createBrand(
    organizationId: string,
    userId: string,
    data: CreateBrandDTO
  ): Promise<Brand> {
    // Check if slug is unique within organization
    const existing = await this.prisma.brand.findUnique({
      where: {
        organizationId_slug: {
          organizationId,
          slug: data.slug
        }
      }
    });

    if (existing) {
      throw new Error('Brand slug already exists in this organization');
    }

    return this.prisma.brand.create({
      data: {
        organizationId,
        userId,
        name: data.name,
        slug: data.slug,
        description: data.description,
        settings: data.settings || {},
        isActive: true
      }
    });
  }

  /**
   * Get brand by ID
   */
  async getBrand(brandId: string): Promise<Brand | null> {
    return this.prisma.brand.findUnique({
      where: { id: brandId },
      include: {
        organization: true,
        user: {
          select: { id: true, email: true, firstName: true, lastName: true }
        },
        socialAccounts: {
          include: {
            socialAccount: true
          }
        },
        draws: {
          include: {
            draw: true
          }
        }
      }
    });
  }

  /**
   * Update brand
   */
  async updateBrand(brandId: string, data: UpdateBrandDTO): Promise<Brand> {
    return this.prisma.brand.update({
      where: { id: brandId },
      data: {
        ...data,
        updatedAt: new Date()
      }
    });
  }

  /**
   * Delete brand
   */
  async deleteBrand(brandId: string): Promise<void> {
    await this.prisma.brand.delete({
      where: { id: brandId }
    });
  }

  /**
   * Get all brands for organization
   */
  async getOrganizationBrands(organizationId: string): Promise<Brand[]> {
    return this.prisma.brand.findMany({
      where: { organizationId },
      include: {
        user: {
          select: { id: true, email: true, firstName: true, lastName: true }
        },
        _count: {
          select: {
            socialAccounts: true,
            draws: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * Get brands accessible by user
   */
  async getUserBrands(userId: string): Promise<Brand[]> {
    // Get user's organization memberships
    const memberships = await this.prisma.organizationMember.findMany({
      where: { userId },
      select: { organizationId: true }
    });

    const orgIds = memberships.map(m => m.organizationId);

    return this.prisma.brand.findMany({
      where: {
        OR: [
          { userId }, // Brands created by user
          { organizationId: { in: orgIds } } // Brands in user's organizations
        ]
      },
      include: {
        organization: {
          select: { name: true, slug: true }
        },
        _count: {
          select: {
            socialAccounts: true,
            draws: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  /**
   * Connect social account to brand
   */
  async connectSocialAccount(
    brandId: string,
    socialAccountId: string
  ): Promise<void> {
    // Check if connection already exists
    const existing = await this.prisma.brandSocialAccount.findUnique({
      where: {
        brandId_socialAccountId: {
          brandId,
          socialAccountId
        }
      }
    });

    if (existing) {
      throw new Error('Social account already connected to this brand');
    }

    await this.prisma.brandSocialAccount.create({
      data: {
        brandId,
        socialAccountId,
        isActive: true
      }
    });
  }

  /**
   * Disconnect social account from brand
   */
  async disconnectSocialAccount(
    brandId: string,
    socialAccountId: string
  ): Promise<void> {
    await this.prisma.brandSocialAccount.delete({
      where: {
        brandId_socialAccountId: {
          brandId,
          socialAccountId
        }
      }
    });
  }

  /**
   * Get social accounts connected to brand
   */
  async getBrandSocialAccounts(brandId: string): Promise<any[]> {
    const connections = await this.prisma.brandSocialAccount.findMany({
      where: { brandId, isActive: true },
      include: {
        socialAccount: {
          select: {
            id: true,
            platform: true,
            platformUsername: true,
            connectedAt: true
          }
        }
      }
    });

    return connections.map(c => c.socialAccount);
  }

  /**
   * Assign draw to brand
   */
  async assignDrawToBrand(brandId: string, drawId: string): Promise<void> {
    // Check if assignment already exists
    const existing = await this.prisma.brandDraw.findUnique({
      where: {
        brandId_drawId: {
          brandId,
          drawId
        }
      }
    });

    if (existing) {
      return; // Already assigned
    }

    await this.prisma.brandDraw.create({
      data: {
        brandId,
        drawId
      }
    });
  }

  /**
   * Unassign draw from brand
   */
  async unassignDrawFromBrand(brandId: string, drawId: string): Promise<void> {
    await this.prisma.brandDraw.delete({
      where: {
        brandId_drawId: {
          brandId,
          drawId
        }
      }
    });
  }

  /**
   * Get draws for brand
   */
  async getBrandDraws(brandId: string): Promise<any[]> {
    const brandDraws = await this.prisma.brandDraw.findMany({
      where: { brandId },
      include: {
        draw: {
          include: {
            user: {
              select: { id: true, email: true, firstName: true, lastName: true }
            },
            _count: {
              select: {
                participants: true,
                winners: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return brandDraws.map(bd => bd.draw);
  }

  /**
   * Get brand analytics
   */
  async getBrandAnalytics(brandId: string): Promise<{
    totalDraws: number;
    totalParticipants: number;
    totalWinners: number;
    connectedAccounts: number;
    recentDraws: any[];
  }> {
    const [brandDraws, socialAccounts] = await Promise.all([
      this.prisma.brandDraw.findMany({
        where: { brandId },
        include: {
          draw: {
            include: {
              _count: {
                select: {
                  participants: true,
                  winners: true
                }
              }
            }
          }
        }
      }),
      this.prisma.brandSocialAccount.count({
        where: { brandId, isActive: true }
      })
    ]);

    const totalDraws = brandDraws.length;
    const totalParticipants = brandDraws.reduce(
      (sum, bd) => sum + bd.draw._count.participants,
      0
    );
    const totalWinners = brandDraws.reduce(
      (sum, bd) => sum + bd.draw._count.winners,
      0
    );

    const recentDraws = brandDraws
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, 5)
      .map(bd => bd.draw);

    return {
      totalDraws,
      totalParticipants,
      totalWinners,
      connectedAccounts: socialAccounts,
      recentDraws
    };
  }

  /**
   * Toggle brand active status
   */
  async toggleBrandStatus(brandId: string, isActive: boolean): Promise<Brand> {
    return this.prisma.brand.update({
      where: { id: brandId },
      data: {
        isActive,
        updatedAt: new Date()
      }
    });
  }
}
