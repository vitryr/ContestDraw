/**
 * Branding Service
 * White-label customization for enterprise organizations
 */

import { PrismaClient } from '@prisma/client';
import { Branding, UpdateBrandingDTO } from '../types/enterprise.types';

export class BrandingService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Get or create branding for organization
   */
  async getOrCreateBranding(organizationId: string): Promise<Branding> {
    let branding = await this.prisma.branding.findUnique({
      where: { organizationId }
    });

    if (!branding) {
      // Create default branding
      branding = await this.prisma.branding.create({
        data: {
          organizationId,
          primaryColor: '#1976d2',
          secondaryColor: '#dc004e',
          removeBranding: false,
          settings: {}
        }
      });
    }

    return branding;
  }

  /**
   * Update organization branding
   */
  async updateBranding(
    organizationId: string,
    data: UpdateBrandingDTO
  ): Promise<Branding> {
    // Ensure branding exists
    await this.getOrCreateBranding(organizationId);

    return this.prisma.branding.update({
      where: { organizationId },
      data: {
        ...data,
        updatedAt: new Date()
      }
    });
  }

  /**
   * Upload logo for organization
   */
  async uploadLogo(
    organizationId: string,
    logoUrl: string
  ): Promise<Branding> {
    await this.getOrCreateBranding(organizationId);

    return this.prisma.branding.update({
      where: { organizationId },
      data: {
        logoUrl,
        updatedAt: new Date()
      }
    });
  }

  /**
   * Upload favicon for organization
   */
  async uploadFavicon(
    organizationId: string,
    faviconUrl: string
  ): Promise<Branding> {
    await this.getOrCreateBranding(organizationId);

    return this.prisma.branding.update({
      where: { organizationId },
      data: {
        faviconUrl,
        updatedAt: new Date()
      }
    });
  }

  /**
   * Set custom domain
   */
  async setCustomDomain(
    organizationId: string,
    customDomain: string
  ): Promise<Branding> {
    // Check if domain is already in use
    const existing = await this.prisma.branding.findUnique({
      where: { customDomain }
    });

    if (existing && existing.organizationId !== organizationId) {
      throw new Error('Custom domain already in use by another organization');
    }

    await this.getOrCreateBranding(organizationId);

    return this.prisma.branding.update({
      where: { organizationId },
      data: {
        customDomain,
        updatedAt: new Date()
      }
    });
  }

  /**
   * Remove custom domain
   */
  async removeCustomDomain(organizationId: string): Promise<Branding> {
    return this.prisma.branding.update({
      where: { organizationId },
      data: {
        customDomain: null,
        updatedAt: new Date()
      }
    });
  }

  /**
   * Update color theme
   */
  async updateColorTheme(
    organizationId: string,
    colors: {
      primaryColor?: string;
      secondaryColor?: string;
      accentColor?: string;
    }
  ): Promise<Branding> {
    await this.getOrCreateBranding(organizationId);

    return this.prisma.branding.update({
      where: { organizationId },
      data: {
        ...colors,
        updatedAt: new Date()
      }
    });
  }

  /**
   * Toggle branding removal (for premium users)
   */
  async toggleBrandingRemoval(
    organizationId: string,
    removeBranding: boolean
  ): Promise<Branding> {
    // Check if organization has premium subscription
    const org = await this.prisma.organization.findUnique({
      where: { id: organizationId },
      include: {
        subscriptions: {
          where: { status: 'ACTIVE' },
          take: 1
        }
      }
    });

    if (!org || org.subscriptions.length === 0) {
      throw new Error('Active enterprise subscription required to remove branding');
    }

    await this.getOrCreateBranding(organizationId);

    return this.prisma.branding.update({
      where: { organizationId },
      data: {
        removeBranding,
        updatedAt: new Date()
      }
    });
  }

  /**
   * Set custom CSS
   */
  async setCustomCSS(
    organizationId: string,
    customCss: string
  ): Promise<Branding> {
    // Validate CSS (basic check)
    if (customCss.length > 50000) {
      throw new Error('Custom CSS exceeds maximum size (50KB)');
    }

    await this.getOrCreateBranding(organizationId);

    return this.prisma.branding.update({
      where: { organizationId },
      data: {
        customCss,
        updatedAt: new Date()
      }
    });
  }

  /**
   * Update email branding
   */
  async updateEmailBranding(
    organizationId: string,
    data: {
      emailFromName?: string;
      emailReplyTo?: string;
    }
  ): Promise<Branding> {
    await this.getOrCreateBranding(organizationId);

    return this.prisma.branding.update({
      where: { organizationId },
      data: {
        ...data,
        updatedAt: new Date()
      }
    });
  }

  /**
   * Get branding by custom domain
   */
  async getBrandingByDomain(domain: string): Promise<Branding | null> {
    return this.prisma.branding.findUnique({
      where: { customDomain: domain },
      include: {
        organization: true
      }
    });
  }

  /**
   * Reset branding to defaults
   */
  async resetBranding(organizationId: string): Promise<Branding> {
    return this.prisma.branding.update({
      where: { organizationId },
      data: {
        logoUrl: null,
        faviconUrl: null,
        primaryColor: '#1976d2',
        secondaryColor: '#dc004e',
        accentColor: null,
        customCss: null,
        removeBranding: false,
        settings: {},
        updatedAt: new Date()
      }
    });
  }

  /**
   * Generate CSS variables from branding
   */
  generateCSSVariables(branding: Branding): string {
    return `
      :root {
        --primary-color: ${branding.primaryColor};
        --secondary-color: ${branding.secondaryColor};
        --accent-color: ${branding.accentColor || branding.primaryColor};
      }
      ${branding.customCss || ''}
    `.trim();
  }

  /**
   * Get branding configuration for frontend
   */
  async getFrontendConfig(organizationId: string): Promise<{
    colors: {
      primary: string;
      secondary: string;
      accent?: string;
    };
    logo?: string;
    favicon?: string;
    removeBranding: boolean;
    customCSS?: string;
  }> {
    const branding = await this.getOrCreateBranding(organizationId);

    return {
      colors: {
        primary: branding.primaryColor,
        secondary: branding.secondaryColor,
        accent: branding.accentColor || undefined
      },
      logo: branding.logoUrl || undefined,
      favicon: branding.faviconUrl || undefined,
      removeBranding: branding.removeBranding,
      customCSS: branding.customCss || undefined
    };
  }
}
