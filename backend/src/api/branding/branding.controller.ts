/**
 * Branding API Controller
 * White-label customization endpoints
 */

import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { BrandingService } from '../../services/branding.service';
import { OrganizationService } from '../../services/organization.service';
import { AuthRequest } from '../../types';
import { UpdateBrandingDTO } from '../../types/enterprise.types';

const prisma = new PrismaClient();
const brandingService = new BrandingService(prisma);
const organizationService = new OrganizationService(prisma);

export class BrandingController {
  /**
   * Get organization branding
   * GET /api/organizations/:organizationId/branding
   */
  async get(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { organizationId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          status: 'error',
          message: 'Unauthorized'
        });
      }

      // Check membership
      const isMember = await organizationService.isMember(
        organizationId,
        userId
      );

      if (!isMember) {
        return res.status(403).json({
          status: 'error',
          message: 'Access denied'
        });
      }

      const branding = await brandingService.getOrCreateBranding(
        organizationId
      );

      res.json({
        status: 'success',
        data: branding
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Update organization branding
   * PATCH /api/organizations/:organizationId/branding
   */
  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { organizationId } = req.params;
      const userId = req.user?.id;
      const data: UpdateBrandingDTO = req.body;

      if (!userId) {
        return res.status(401).json({
          status: 'error',
          message: 'Unauthorized'
        });
      }

      // Check permissions
      const permissions = await organizationService.getUserPermissions(
        organizationId,
        userId
      );

      if (!permissions.canManageBranding) {
        return res.status(403).json({
          status: 'error',
          message: 'Insufficient permissions'
        });
      }

      const branding = await brandingService.updateBranding(
        organizationId,
        data
      );

      res.json({
        status: 'success',
        data: branding,
        message: 'Branding updated successfully'
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Upload logo
   * POST /api/organizations/:organizationId/branding/logo
   */
  async uploadLogo(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { organizationId } = req.params;
      const { logoUrl } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          status: 'error',
          message: 'Unauthorized'
        });
      }

      if (!logoUrl) {
        return res.status(400).json({
          status: 'error',
          message: 'logoUrl is required'
        });
      }

      // Check permissions
      const permissions = await organizationService.getUserPermissions(
        organizationId,
        userId
      );

      if (!permissions.canManageBranding) {
        return res.status(403).json({
          status: 'error',
          message: 'Insufficient permissions'
        });
      }

      const branding = await brandingService.uploadLogo(
        organizationId,
        logoUrl
      );

      res.json({
        status: 'success',
        data: branding,
        message: 'Logo uploaded successfully'
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Update color theme
   * PATCH /api/organizations/:organizationId/branding/colors
   */
  async updateColors(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { organizationId } = req.params;
      const { primaryColor, secondaryColor, accentColor } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          status: 'error',
          message: 'Unauthorized'
        });
      }

      // Check permissions
      const permissions = await organizationService.getUserPermissions(
        organizationId,
        userId
      );

      if (!permissions.canManageBranding) {
        return res.status(403).json({
          status: 'error',
          message: 'Insufficient permissions'
        });
      }

      const branding = await brandingService.updateColorTheme(organizationId, {
        primaryColor,
        secondaryColor,
        accentColor
      });

      res.json({
        status: 'success',
        data: branding,
        message: 'Color theme updated successfully'
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Set custom domain
   * POST /api/organizations/:organizationId/branding/domain
   */
  async setCustomDomain(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { organizationId } = req.params;
      const { customDomain } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          status: 'error',
          message: 'Unauthorized'
        });
      }

      if (!customDomain) {
        return res.status(400).json({
          status: 'error',
          message: 'customDomain is required'
        });
      }

      // Check permissions
      const permissions = await organizationService.getUserPermissions(
        organizationId,
        userId
      );

      if (!permissions.canManageBranding) {
        return res.status(403).json({
          status: 'error',
          message: 'Insufficient permissions'
        });
      }

      const branding = await brandingService.setCustomDomain(
        organizationId,
        customDomain
      );

      res.json({
        status: 'success',
        data: branding,
        message: 'Custom domain set successfully'
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Toggle branding removal
   * PATCH /api/organizations/:organizationId/branding/remove
   */
  async toggleBrandingRemoval(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { organizationId } = req.params;
      const { removeBranding } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          status: 'error',
          message: 'Unauthorized'
        });
      }

      // Check permissions
      const permissions = await organizationService.getUserPermissions(
        organizationId,
        userId
      );

      if (!permissions.canManageBranding) {
        return res.status(403).json({
          status: 'error',
          message: 'Insufficient permissions'
        });
      }

      const branding = await brandingService.toggleBrandingRemoval(
        organizationId,
        removeBranding
      );

      res.json({
        status: 'success',
        data: branding,
        message: 'Branding settings updated successfully'
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Set custom CSS
   * POST /api/organizations/:organizationId/branding/css
   */
  async setCustomCSS(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { organizationId } = req.params;
      const { customCss } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          status: 'error',
          message: 'Unauthorized'
        });
      }

      // Check permissions
      const permissions = await organizationService.getUserPermissions(
        organizationId,
        userId
      );

      if (!permissions.canManageBranding) {
        return res.status(403).json({
          status: 'error',
          message: 'Insufficient permissions'
        });
      }

      const branding = await brandingService.setCustomCSS(
        organizationId,
        customCss
      );

      res.json({
        status: 'success',
        data: branding,
        message: 'Custom CSS updated successfully'
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Get frontend config
   * GET /api/organizations/:organizationId/branding/config
   */
  async getFrontendConfig(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { organizationId } = req.params;

      const config = await brandingService.getFrontendConfig(organizationId);

      res.json({
        status: 'success',
        data: config
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Reset branding to defaults
   * POST /api/organizations/:organizationId/branding/reset
   */
  async reset(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { organizationId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          status: 'error',
          message: 'Unauthorized'
        });
      }

      // Check permissions
      const permissions = await organizationService.getUserPermissions(
        organizationId,
        userId
      );

      if (!permissions.canManageBranding) {
        return res.status(403).json({
          status: 'error',
          message: 'Insufficient permissions'
        });
      }

      const branding = await brandingService.resetBranding(organizationId);

      res.json({
        status: 'success',
        data: branding,
        message: 'Branding reset to defaults'
      });
    } catch (error: any) {
      next(error);
    }
  }
}

export default new BrandingController();
