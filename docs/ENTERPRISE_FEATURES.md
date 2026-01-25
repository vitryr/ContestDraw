# Enterprise Features Documentation

## Overview

Complete multi-tenant system for agencies and large clients with white-label customization options.

## Implementation Date

November 5, 2025

## Features Implemented

### 1. Organization Management System

**Models Added:**
- `Organization` - Parent account for agencies
- `OrganizationMember` - User memberships with roles
- Hierarchical permission system

**Key Features:**
- Create and manage organizations
- Invite/remove members with role-based access
- Owner, Admin, Member, and Viewer roles
- Organization dashboard with analytics
- Up to 10 sub-accounts per organization
- Centralized billing management

**API Endpoints:**
```
POST   /api/organizations                    - Create organization
GET    /api/organizations                    - List user's organizations
GET    /api/organizations/:id                - Get organization details
PATCH  /api/organizations/:id                - Update organization
DELETE /api/organizations/:id                - Delete organization
GET    /api/organizations/:id/dashboard      - Organization dashboard
GET    /api/organizations/:id/members        - List members
POST   /api/organizations/:id/members        - Invite member
DELETE /api/organizations/:id/members/:userId - Remove member
PATCH  /api/organizations/:id/members/:userId - Update member role
```

### 2. Multi-Brand Account Management

**Models Added:**
- `Brand` - Brand/sub-account within organization
- `BrandDraw` - Links draws to brands
- `BrandSocialAccount` - Links social accounts to brands

**Key Features:**
- Multiple brands per organization
- Track draws by brand/sub-account
- Connect social media accounts to brands
- Brand switching capability
- Brand-specific analytics
- Active/inactive brand status

**API Endpoints:**
```
POST   /api/brands                           - Create brand
GET    /api/brands                           - List user's brands
GET    /api/brands/:id                       - Get brand details
PATCH  /api/brands/:id                       - Update brand
DELETE /api/brands/:id                       - Delete brand
GET    /api/brands/:id/social-accounts       - List connected accounts
POST   /api/brands/:id/social-accounts       - Connect social account
GET    /api/brands/:id/draws                 - List brand draws
POST   /api/brands/:id/draws                 - Assign draw to brand
GET    /api/brands/:id/analytics             - Brand analytics
```

### 3. White-label Customization

**Models Added:**
- `Branding` - White-label customization settings

**Key Features:**
- Custom logo upload
- Favicon customization
- Color theme (primary, secondary, accent)
- Custom domain support
- Remove app branding (premium)
- Custom CSS injection
- Email branding (from name, reply-to)
- Frontend configuration API

**API Endpoints:**
```
GET    /api/branding/:organizationId                - Get branding
PATCH  /api/branding/:organizationId                - Update branding
POST   /api/branding/:organizationId/logo           - Upload logo
PATCH  /api/branding/:organizationId/colors         - Update colors
POST   /api/branding/:organizationId/css            - Set custom CSS
POST   /api/branding/:organizationId/domain         - Set custom domain
PATCH  /api/branding/:organizationId/remove         - Toggle branding removal
GET    /api/branding/:organizationId/config         - Get frontend config
POST   /api/branding/:organizationId/reset          - Reset to defaults
```

### 4. Enterprise Pricing Tier

**Pricing:**
- **€49/month** for ENTERPRISE tier
- Up to 10 sub-accounts
- 30 credits per month
- 10 connected social accounts
- White-label customization
- Custom domain
- Priority support
- Advanced analytics
- API access
- Centralized billing

**Subscription Features:**
```typescript
{
  creditsPerMonth: 30,
  connectedAccounts: 10,
  prioritySupport: true,
  advancedAnalytics: true,
  apiAccess: true,
  whiteLabelBranding: true,
  maxSubAccounts: 10
}
```

## Database Schema Updates

### New Tables

1. **organizations**
   - id, name, slug, ownerId
   - subscriptionTier, maxSubAccounts
   - billingEmail, settings
   - Unique slug for custom URLs

2. **organization_members**
   - organizationId, userId, role
   - permissions (JSON), invitedBy
   - Hierarchical access control

3. **brands**
   - organizationId, userId, name, slug
   - description, settings, isActive
   - Unique slug per organization

4. **brand_draws**
   - Links draws to brands
   - Many-to-many relationship

5. **brand_social_accounts**
   - Links social accounts to brands
   - Active/inactive status

6. **brandings**
   - organizationId (one-to-one)
   - Logo, favicon, colors
   - Custom domain, CSS
   - Email branding settings

### Schema Modifications

- Updated `User` model with organization relations
- Updated `Draw` model with brandDraws relation
- Updated `SocialAccount` model with brandSocialAccounts relation
- Updated `Subscription` model with organizationId

## Services Implemented

### OrganizationService
- CRUD operations for organizations
- Member management (invite, remove, update roles)
- Permission checking
- Dashboard analytics
- Organization context management

### BrandService
- CRUD operations for brands
- Social account connections
- Draw assignments
- Brand analytics
- Active/inactive toggling

### BrandingService
- White-label customization
- Logo and favicon management
- Color theme management
- Custom domain handling
- Custom CSS injection
- Frontend configuration generation

### SubscriptionService (Updated)
- Enterprise tier pricing
- Organization subscription creation
- Enterprise feature access control

## Middleware

### organization.middleware.ts

**Functions:**
- `requireOrganizationMember` - Check membership
- `requireOrganizationPermission` - Check specific permission
- `requireOrganizationOwner` - Verify ownership
- `attachOrganizationContext` - Add context to request
- `requireEnterpriseSubscription` - Verify active subscription

## TypeScript Types

### enterprise.types.ts

**Enums:**
- OrganizationRole (OWNER, ADMIN, MEMBER, VIEWER)
- OrganizationTier

**Interfaces:**
- Organization, OrganizationMember
- Brand, BrandSettings
- Branding, BrandingSettings
- OrganizationDashboard
- OrganizationPermissions
- Various DTOs for create/update operations

## Testing

### Test Files Created

1. **tests/enterprise/organization.test.ts**
   - Organization CRUD operations
   - Member management
   - Permission system
   - Dashboard functionality

2. **tests/enterprise/brand.test.ts**
   - Brand CRUD operations
   - Social account connections
   - Draw assignments
   - Analytics

3. **tests/enterprise/branding.test.ts**
   - White-label customization
   - Logo/favicon handling
   - Color theme management
   - Custom domain handling
   - CSS injection

## Security Considerations

1. **Access Control:**
   - Role-based permissions
   - Organization membership verification
   - Owner-only operations protected

2. **Data Isolation:**
   - Multi-tenant data separation
   - Organization-scoped queries
   - Brand-level access control

3. **Validation:**
   - Unique slug enforcement
   - Custom domain validation
   - CSS size limits (50KB)
   - Subscription verification

## Usage Examples

### Creating an Organization

```typescript
POST /api/organizations
{
  "name": "Acme Marketing Agency",
  "slug": "acme-agency",
  "billingEmail": "billing@acme.com",
  "maxSubAccounts": 10
}
```

### Creating a Brand

```typescript
POST /api/brands
{
  "organizationId": "org-id",
  "name": "Client Brand A",
  "slug": "client-a",
  "description": "Social media management for Client A"
}
```

### Updating Branding

```typescript
PATCH /api/branding/org-id
{
  "primaryColor": "#FF5733",
  "secondaryColor": "#33FF57",
  "logoUrl": "https://cdn.example.com/logo.png",
  "customDomain": "draws.clientdomain.com",
  "removeBranding": true
}
```

## Migration Path

To migrate from single-tenant to multi-tenant:

1. Run Prisma migrations:
```bash
cd backend
npx prisma migrate dev --name add-enterprise-features
npx prisma generate
```

2. Update existing subscriptions (if needed)
3. Create default organizations for existing users (optional)

## Future Enhancements

- [ ] Organization-level analytics dashboard
- [ ] Advanced permission groups
- [ ] API key management per organization
- [ ] Webhook notifications
- [ ] Audit log for organization changes
- [ ] Team collaboration features
- [ ] White-label mobile app support
- [ ] SSO/SAML integration

## Support

For enterprise tier support:
- Priority email support
- Dedicated account manager (Enterprise Plus)
- Custom integration assistance
- Onboarding support

## Billing

- Centralized billing per organization
- All sub-accounts included in base price
- Automatic invoicing
- Payment via Stripe
- EUR currency

---

**Implementation Status:** ✅ Complete
**Date:** November 5, 2025
**Version:** 1.0.0
