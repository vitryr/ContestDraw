/**
 * Brands API Controller
 * Multi-brand account management
 */

import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { BrandService } from '../../services/brand.service';
import { OrganizationService } from '../../services/organization.service';
import { AuthRequest } from '../../types';
import { CreateBrandDTO, UpdateBrandDTO } from '../../types/enterprise.types';

const prisma = new PrismaClient();
const brandService = new BrandService(prisma);
const organizationService = new OrganizationService(prisma);

export class BrandsController {
  /**
   * Create new brand
   * POST /api/brands
   */
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          status: 'error',
          message: 'Unauthorized'
        });
      }

      const { organizationId, ...data }: CreateBrandDTO & { organizationId: string } = req.body;

      if (!organizationId) {
        return res.status(400).json({
          status: 'error',
          message: 'organizationId is required'
        });
      }

      // Check permissions
      const permissions = await organizationService.getUserPermissions(
        organizationId,
        userId
      );

      if (!permissions.canManageBrands) {
        return res.status(403).json({
          status: 'error',
          message: 'Insufficient permissions'
        });
      }

      const brand = await brandService.createBrand(organizationId, userId, data);

      res.status(201).json({
        status: 'success',
        data: brand,
        message: 'Brand created successfully'
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Get brand by ID
   * GET /api/brands/:id
   */
  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          status: 'error',
          message: 'Unauthorized'
        });
      }

      const brand = await brandService.getBrand(id);

      if (!brand) {
        return res.status(404).json({
          status: 'error',
          message: 'Brand not found'
        });
      }

      // Check if user has access
      const isMember = await organizationService.isMember(
        brand.organizationId,
        userId
      );

      if (!isMember) {
        return res.status(403).json({
          status: 'error',
          message: 'Access denied'
        });
      }

      res.json({
        status: 'success',
        data: brand
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Get user's brands
   * GET /api/brands
   */
  async getUserBrands(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          status: 'error',
          message: 'Unauthorized'
        });
      }

      const brands = await brandService.getUserBrands(userId);

      res.json({
        status: 'success',
        data: brands
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Update brand
   * PATCH /api/brands/:id
   */
  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const data: UpdateBrandDTO = req.body;

      if (!userId) {
        return res.status(401).json({
          status: 'error',
          message: 'Unauthorized'
        });
      }

      const brand = await brandService.getBrand(id);
      if (!brand) {
        return res.status(404).json({
          status: 'error',
          message: 'Brand not found'
        });
      }

      // Check permissions
      const permissions = await organizationService.getUserPermissions(
        brand.organizationId,
        userId
      );

      if (!permissions.canManageBrands) {
        return res.status(403).json({
          status: 'error',
          message: 'Insufficient permissions'
        });
      }

      const updatedBrand = await brandService.updateBrand(id, data);

      res.json({
        status: 'success',
        data: updatedBrand,
        message: 'Brand updated successfully'
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Delete brand
   * DELETE /api/brands/:id
   */
  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          status: 'error',
          message: 'Unauthorized'
        });
      }

      const brand = await brandService.getBrand(id);
      if (!brand) {
        return res.status(404).json({
          status: 'error',
          message: 'Brand not found'
        });
      }

      // Check permissions
      const permissions = await organizationService.getUserPermissions(
        brand.organizationId,
        userId
      );

      if (!permissions.canManageBrands) {
        return res.status(403).json({
          status: 'error',
          message: 'Insufficient permissions'
        });
      }

      await brandService.deleteBrand(id);

      res.json({
        status: 'success',
        message: 'Brand deleted successfully'
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Connect social account to brand
   * POST /api/brands/:id/social-accounts
   */
  async connectSocialAccount(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const { socialAccountId } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          status: 'error',
          message: 'Unauthorized'
        });
      }

      const brand = await brandService.getBrand(id);
      if (!brand) {
        return res.status(404).json({
          status: 'error',
          message: 'Brand not found'
        });
      }

      // Check permissions
      const permissions = await organizationService.getUserPermissions(
        brand.organizationId,
        userId
      );

      if (!permissions.canManageBrands) {
        return res.status(403).json({
          status: 'error',
          message: 'Insufficient permissions'
        });
      }

      await brandService.connectSocialAccount(id, socialAccountId);

      res.json({
        status: 'success',
        message: 'Social account connected successfully'
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Get brand social accounts
   * GET /api/brands/:id/social-accounts
   */
  async getSocialAccounts(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          status: 'error',
          message: 'Unauthorized'
        });
      }

      const brand = await brandService.getBrand(id);
      if (!brand) {
        return res.status(404).json({
          status: 'error',
          message: 'Brand not found'
        });
      }

      // Check access
      const isMember = await organizationService.isMember(
        brand.organizationId,
        userId
      );

      if (!isMember) {
        return res.status(403).json({
          status: 'error',
          message: 'Access denied'
        });
      }

      const accounts = await brandService.getBrandSocialAccounts(id);

      res.json({
        status: 'success',
        data: accounts
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Get brand draws
   * GET /api/brands/:id/draws
   */
  async getDraws(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          status: 'error',
          message: 'Unauthorized'
        });
      }

      const brand = await brandService.getBrand(id);
      if (!brand) {
        return res.status(404).json({
          status: 'error',
          message: 'Brand not found'
        });
      }

      // Check access
      const isMember = await organizationService.isMember(
        brand.organizationId,
        userId
      );

      if (!isMember) {
        return res.status(403).json({
          status: 'error',
          message: 'Access denied'
        });
      }

      const draws = await brandService.getBrandDraws(id);

      res.json({
        status: 'success',
        data: draws
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Assign draw to brand
   * POST /api/brands/:id/draws
   */
  async assignDraw(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { drawId } = req.body;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          status: 'error',
          message: 'Unauthorized'
        });
      }

      const brand = await brandService.getBrand(id);
      if (!brand) {
        return res.status(404).json({
          status: 'error',
          message: 'Brand not found'
        });
      }

      // Check permissions
      const permissions = await organizationService.getUserPermissions(
        brand.organizationId,
        userId
      );

      if (!permissions.canManageBrands) {
        return res.status(403).json({
          status: 'error',
          message: 'Insufficient permissions'
        });
      }

      await brandService.assignDrawToBrand(id, drawId);

      res.json({
        status: 'success',
        message: 'Draw assigned to brand successfully'
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Get brand analytics
   * GET /api/brands/:id/analytics
   */
  async getAnalytics(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          status: 'error',
          message: 'Unauthorized'
        });
      }

      const brand = await brandService.getBrand(id);
      if (!brand) {
        return res.status(404).json({
          status: 'error',
          message: 'Brand not found'
        });
      }

      // Check access
      const isMember = await organizationService.isMember(
        brand.organizationId,
        userId
      );

      if (!isMember) {
        return res.status(403).json({
          status: 'error',
          message: 'Access denied'
        });
      }

      const analytics = await brandService.getBrandAnalytics(id);

      res.json({
        status: 'success',
        data: analytics
      });
    } catch (error: any) {
      next(error);
    }
  }
}

export default new BrandsController();
