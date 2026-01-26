/**
 * Organization Middleware
 * Handles hierarchical permissions and multi-tenant access control
 */

import { Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../types";
import { OrganizationService } from "../services/organization.service";

const prisma = new PrismaClient();
const organizationService = new OrganizationService(prisma);

/**
 * Check if user is member of organization
 */
export async function requireOrganizationMember(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const organizationId = req.params.organizationId || req.params.id;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized",
      });
    }

    if (!organizationId) {
      return res.status(400).json({
        status: "error",
        message: "Organization ID required",
      });
    }

    const isMember = await organizationService.isMember(organizationId, userId);

    if (!isMember) {
      return res.status(403).json({
        status: "error",
        message: "Access denied - not a member of this organization",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Check if user has specific permission in organization
 */
export function requireOrganizationPermission(
  permission: keyof import("../types/enterprise.types").OrganizationPermissions,
) {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const organizationId = req.params.organizationId || req.params.id;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({
          status: "error",
          message: "Unauthorized",
        });
      }

      if (!organizationId) {
        return res.status(400).json({
          status: "error",
          message: "Organization ID required",
        });
      }

      const permissions = await organizationService.getUserPermissions(
        organizationId,
        userId,
      );

      if (!permissions[permission]) {
        return res.status(403).json({
          status: "error",
          message: `Insufficient permissions - requires: ${permission}`,
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

/**
 * Check if user is organization owner
 */
export async function requireOrganizationOwner(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const organizationId = req.params.organizationId || req.params.id;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        status: "error",
        message: "Unauthorized",
      });
    }

    if (!organizationId) {
      return res.status(400).json({
        status: "error",
        message: "Organization ID required",
      });
    }

    const organization =
      await organizationService.getOrganization(organizationId);

    if (!organization || organization.ownerId !== userId) {
      return res.status(403).json({
        status: "error",
        message: "Access denied - must be organization owner",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Attach organization context to request
 */
export async function attachOrganizationContext(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const organizationId = req.params.organizationId || req.params.id;
    const userId = req.user?.id;

    if (organizationId && userId) {
      const [organization, permissions] = await Promise.all([
        organizationService.getOrganization(organizationId),
        organizationService.getUserPermissions(organizationId, userId),
      ]);

      // Attach to request for downstream use
      (req as any).organizationContext = {
        organization,
        permissions,
      };
    }

    next();
  } catch (error) {
    next(error);
  }
}

/**
 * Check organization subscription status
 */
export async function requireEnterpriseSubscription(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const organizationId = req.params.organizationId || req.params.id;

    if (!organizationId) {
      return res.status(400).json({
        status: "error",
        message: "Organization ID required",
      });
    }

    const organization =
      await organizationService.getOrganization(organizationId);

    if (!organization) {
      return res.status(404).json({
        status: "error",
        message: "Organization not found",
      });
    }

    // Check for active subscription
    const hasActiveSubscription = await prisma.subscription.findFirst({
      where: {
        organizationId,
        status: "ACTIVE",
        planId: "enterprise",
      },
    });

    if (!hasActiveSubscription) {
      return res.status(403).json({
        status: "error",
        message: "Active enterprise subscription required",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
}
