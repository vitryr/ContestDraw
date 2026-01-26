/**
 * Enterprise Features Type Definitions
 * Organizations, Brands, and White-label Branding
 */

export enum OrganizationRole {
  OWNER = "owner",
  ADMIN = "admin",
  MEMBER = "member",
  VIEWER = "viewer",
}

export enum OrganizationTier {
  ENTERPRISE = "ENTERPRISE",
  ENTERPRISE_PLUS = "ENTERPRISE_PLUS",
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
  subscriptionTier: string;
  maxSubAccounts: number;
  billingEmail: string;
  settings?: OrganizationSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrganizationSettings {
  allowMemberInvites?: boolean;
  requireEmailVerification?: boolean;
  defaultBrandPermissions?: string[];
  customFields?: Record<string, any>;
}

export interface OrganizationMember {
  id: string;
  organizationId: string;
  userId: string;
  role: OrganizationRole;
  permissions?: string[];
  invitedBy?: string;
  joinedAt: Date;
  updatedAt: Date;
}

export interface Brand {
  id: string;
  organizationId: string;
  userId: string;
  name: string;
  slug: string;
  description?: string;
  settings?: BrandSettings;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BrandSettings {
  autoAssignDraws?: boolean;
  socialMediaDefaults?: Record<string, any>;
  notificationPreferences?: Record<string, boolean>;
}

export interface Branding {
  id: string;
  organizationId: string;
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor?: string;
  customDomain?: string;
  removeBranding: boolean;
  customCss?: string;
  emailFromName?: string;
  emailReplyTo?: string;
  settings?: BrandingSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface BrandingSettings {
  showPoweredBy?: boolean;
  customFooterText?: string;
  customMetaTags?: Record<string, string>;
}

export interface CreateOrganizationDTO {
  name: string;
  slug: string;
  billingEmail: string;
  maxSubAccounts?: number;
  settings?: OrganizationSettings;
}

export interface UpdateOrganizationDTO {
  name?: string;
  billingEmail?: string;
  maxSubAccounts?: number;
  settings?: OrganizationSettings;
}

export interface InviteMemberDTO {
  email: string;
  role: OrganizationRole;
  permissions?: string[];
}

export interface CreateBrandDTO {
  name: string;
  slug: string;
  description?: string;
  settings?: BrandSettings;
}

export interface UpdateBrandDTO {
  name?: string;
  description?: string;
  settings?: BrandSettings;
  isActive?: boolean;
}

export interface UpdateBrandingDTO {
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  customDomain?: string;
  removeBranding?: boolean;
  customCss?: string;
  emailFromName?: string;
  emailReplyTo?: string;
  settings?: BrandingSettings;
}

export interface OrganizationDashboard {
  organization: Organization;
  totalMembers: number;
  totalBrands: number;
  totalDraws: number;
  creditsUsed: number;
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  type: "draw" | "brand" | "member" | "subscription";
  description: string;
  userId: string;
  brandId?: string;
  timestamp: Date;
}

export interface OrganizationPermissions {
  canManageMembers: boolean;
  canManageBrands: boolean;
  canManageBilling: boolean;
  canManageBranding: boolean;
  canCreateDraws: boolean;
  canViewAnalytics: boolean;
}
