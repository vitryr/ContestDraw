/**
 * Organizations API Controller
 * Handles organization management endpoints
 */

import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { OrganizationService } from "../../services/organization.service";
import { AuthRequest } from "../../types";
import {
  CreateOrganizationDTO,
  UpdateOrganizationDTO,
  InviteMemberDTO,
} from "../../types/enterprise.types";

const prisma = new PrismaClient();
const organizationService = new OrganizationService(prisma);

export class OrganizationsController {
  /**
   * Create new organization
   * POST /api/organizations
   */
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({
          status: "error",
          message: "Unauthorized",
        });
      }

      const data: CreateOrganizationDTO = req.body;

      // Validate required fields
      if (!data.name || !data.slug || !data.billingEmail) {
        return res.status(400).json({
          status: "error",
          message: "Missing required fields: name, slug, billingEmail",
        });
      }

      const organization = await organizationService.createOrganization(
        userId,
        data,
      );

      res.status(201).json({
        status: "success",
        data: organization,
        message: "Organization created successfully",
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Get organization by ID
   * GET /api/organizations/:id
   */
  async getById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          status: "error",
          message: "Unauthorized",
        });
      }

      // Check if user is member
      const isMember = await organizationService.isMember(id, userId);
      if (!isMember) {
        return res.status(403).json({
          status: "error",
          message: "Access denied",
        });
      }

      const organization = await organizationService.getOrganization(id);

      if (!organization) {
        return res.status(404).json({
          status: "error",
          message: "Organization not found",
        });
      }

      res.json({
        status: "success",
        data: organization,
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Get all organizations for current user
   * GET /api/organizations
   */
  async getUserOrganizations(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          status: "error",
          message: "Unauthorized",
        });
      }

      const organizations =
        await organizationService.getUserOrganizations(userId);

      res.json({
        status: "success",
        data: organizations,
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Update organization
   * PATCH /api/organizations/:id
   */
  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const data: UpdateOrganizationDTO = req.body;

      if (!userId) {
        return res.status(401).json({
          status: "error",
          message: "Unauthorized",
        });
      }

      // Check permissions
      const permissions = await organizationService.getUserPermissions(
        id,
        userId,
      );

      if (!permissions.canManageBilling) {
        return res.status(403).json({
          status: "error",
          message: "Insufficient permissions",
        });
      }

      const organization = await organizationService.updateOrganization(
        id,
        data,
      );

      res.json({
        status: "success",
        data: organization,
        message: "Organization updated successfully",
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Delete organization
   * DELETE /api/organizations/:id
   */
  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          status: "error",
          message: "Unauthorized",
        });
      }

      // Only owner can delete
      const org = await organizationService.getOrganization(id);
      if (!org || org.ownerId !== userId) {
        return res.status(403).json({
          status: "error",
          message: "Only organization owner can delete",
        });
      }

      await organizationService.deleteOrganization(id);

      res.json({
        status: "success",
        message: "Organization deleted successfully",
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Get organization dashboard
   * GET /api/organizations/:id/dashboard
   */
  async getDashboard(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          status: "error",
          message: "Unauthorized",
        });
      }

      // Check membership
      const isMember = await organizationService.isMember(id, userId);
      if (!isMember) {
        return res.status(403).json({
          status: "error",
          message: "Access denied",
        });
      }

      const dashboard = await organizationService.getDashboard(id);

      res.json({
        status: "success",
        data: dashboard,
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Get organization members
   * GET /api/organizations/:id/members
   */
  async getMembers(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          status: "error",
          message: "Unauthorized",
        });
      }

      // Check membership
      const isMember = await organizationService.isMember(id, userId);
      if (!isMember) {
        return res.status(403).json({
          status: "error",
          message: "Access denied",
        });
      }

      const members = await organizationService.getMembers(id);

      res.json({
        status: "success",
        data: members,
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Invite member to organization
   * POST /api/organizations/:id/members
   */
  async inviteMember(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = req.user?.id;
      const data: InviteMemberDTO = req.body;

      if (!userId) {
        return res.status(401).json({
          status: "error",
          message: "Unauthorized",
        });
      }

      // Check permissions
      const permissions = await organizationService.getUserPermissions(
        id,
        userId,
      );

      if (!permissions.canManageMembers) {
        return res.status(403).json({
          status: "error",
          message: "Insufficient permissions",
        });
      }

      const member = await organizationService.inviteMember(id, userId, data);

      res.status(201).json({
        status: "success",
        data: member,
        message: "Member invited successfully",
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Remove member from organization
   * DELETE /api/organizations/:id/members/:userId
   */
  async removeMember(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id, userId: targetUserId } = req.params;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          status: "error",
          message: "Unauthorized",
        });
      }

      // Check permissions
      const permissions = await organizationService.getUserPermissions(
        id,
        userId,
      );

      if (!permissions.canManageMembers) {
        return res.status(403).json({
          status: "error",
          message: "Insufficient permissions",
        });
      }

      await organizationService.removeMember(id, targetUserId);

      res.json({
        status: "success",
        message: "Member removed successfully",
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * Update member role
   * PATCH /api/organizations/:id/members/:userId
   */
  async updateMemberRole(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id, userId: targetUserId } = req.params;
      const userId = req.user?.id;
      const { role, permissions } = req.body;

      if (!userId) {
        return res.status(401).json({
          status: "error",
          message: "Unauthorized",
        });
      }

      // Check permissions
      const userPermissions = await organizationService.getUserPermissions(
        id,
        userId,
      );

      if (!userPermissions.canManageMembers) {
        return res.status(403).json({
          status: "error",
          message: "Insufficient permissions",
        });
      }

      const member = await organizationService.updateMemberRole(
        id,
        targetUserId,
        role,
        permissions,
      );

      res.json({
        status: "success",
        data: member,
        message: "Member role updated successfully",
      });
    } catch (error: any) {
      next(error);
    }
  }
}

export default new OrganizationsController();
