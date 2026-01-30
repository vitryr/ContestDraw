# Database Architecture Documentation

## Overview

The Cleack application uses **PostgreSQL** as the primary database with **Prisma ORM** for type-safe database access. The schema is designed for scalability, performance, and maintainability.

## Schema Design Principles

1. **Referential Integrity**: All foreign keys use CASCADE deletion for data consistency
2. **Indexing Strategy**: Strategic indexes on frequently queried columns
3. **Audit Trail**: Complete history tracking via DrawHistory model
4. **Flexible JSON**: Config and metadata stored as JSON for flexibility
5. **Soft Deletes**: Inactive flags instead of hard deletes where appropriate

## Core Models

### User Model
**Purpose**: Authentication and user management

**Key Fields**:
- `id`: CUID primary key
- `email`: Unique email address with index
- `password_hash`: Bcrypt hashed password
- `email_verified`: Email verification status
- `verification_token`: Token for email verification

**Relationships**:
- One-to-many: Credits, Subscriptions, SocialAccounts, Draws, Blacklist, DrawHistory

**Indexes**:
- `email` (unique)
- `created_at`
- `email_verified`

---

### Credit Model
**Purpose**: Track credit purchases and usage

**Transaction Types**:
- `purchase`: User bought credits
- `usage`: Credits consumed for draws
- `refund`: Credits returned to user
- `bonus`: Free credits (welcome bonus, promotions)

**Key Fields**:
- `balance`: Current credit balance (snapshot)
- `amount`: Transaction amount (positive/negative)
- `metadata`: Additional transaction details (JSON)

**Indexes**:
- `user_id`
- `created_at`
- `transaction_type`

**Usage Pattern**:
```typescript
// Calculate current balance
const credits = await prisma.credit.findMany({
  where: { user_id: userId },
  orderBy: { created_at: 'desc' }
});
const currentBalance = credits[0]?.balance || 0;
```

---

### Subscription Model
**Purpose**: Manage recurring subscriptions

**Plan Types**:
- `monthly`: $14.99/month (10 credits/month)
- `annual`: $99.00/year (50 credits/month)
- `enterprise`: Custom pricing

**Status Values**:
- `active`: Currently active
- `cancelled`: Cancelled but still valid until end_date
- `expired`: Past end_date
- `past_due`: Payment failed

**Key Fields**:
- `stripe_subscription_id`: Stripe subscription reference
- `apple_subscription_id`: Apple IAP reference
- `auto_renew`: Whether to renew automatically
- `credits_per_month`: Monthly credit allocation

**Indexes**:
- `user_id`
- `status`
- `end_date`
- `stripe_subscription_id` (unique)
- `apple_subscription_id` (unique)

---

### SocialAccount Model
**Purpose**: Store social media platform connections

**Supported Platforms**:
- `instagram`: Instagram Business/Creator accounts
- `facebook`: Facebook Pages
- `tiktok`: TikTok accounts
- `twitter`: Twitter accounts

**Key Fields**:
- `access_token`: OAuth access token (encrypted)
- `refresh_token`: OAuth refresh token (encrypted)
- `token_expires_at`: Token expiration timestamp
- `is_active`: Account connection status

**Indexes**:
- `user_id`
- `platform`
- `platform_user_id`
- Unique constraint: `(user_id, platform)`

**Security Note**: Tokens should be encrypted at application level before storage.

---

### Draw Model
**Purpose**: Contest draw execution and results

**Status Flow**:
```
pending → processing → completed
                    → failed
                    → cancelled
```

**Config Structure** (JSON):
```json
{
  "filters": {
    "min_followers": 100,
    "exclude_suspicious": true,
    "exclude_businesses": false
  },
  "rules": {
    "require_like": true,
    "require_comment": true,
    "require_follow": false,
    "comment_keywords": ["amazing", "win"]
  },
  "winners_count": 3
}
```

**Winners Structure** (JSON):
```json
[
  {
    "username": "winner1",
    "user_id": "platform_user_id",
    "comment": "Amazing giveaway!",
    "selected_at": "2025-01-05T12:00:00Z"
  }
]
```

**Key Fields**:
- `certificate_hash`: Cryptographic proof of draw integrity
- `video_url`: URL to draw process video
- `credits_used`: Credits consumed for this draw

**Indexes**:
- `user_id`
- `status`
- `platform`
- `created_at`
- `executed_at`

---

### DrawHistory Model
**Purpose**: Audit trail for all draw operations

**Action Types**:
- `created`: Draw initiated
- `started`: Processing began
- `completed`: Successfully finished
- `failed`: Error occurred
- `cancelled`: User cancelled
- `retried`: Draw attempted again

**Key Fields**:
- `details`: Action-specific context (JSON)
- `metadata`: System metadata like IP, user agent (JSON)

**Indexes**:
- `draw_id`
- `user_id`
- `created_at`
- `action`

---

### Blacklist Model
**Purpose**: Exclude specific usernames from draws

**Platform Values**:
- Specific platform: `instagram`, `facebook`, `tiktok`, `twitter`
- All platforms: `all`

**Key Fields**:
- `username`: Blacklisted username
- `reason`: Why user is blacklisted
- `is_active`: Whether blacklist entry is active

**Indexes**:
- `user_id`
- `platform`
- `username`
- Unique constraint: `(user_id, username, platform)`

---

### SystemMetrics Model
**Purpose**: Track system-wide analytics

**Metric Types**:
- `daily_draws`: Number of draws per day
- `user_signups`: New user registrations
- `revenue`: Daily revenue
- `avg_participants_per_draw`: Average participants
- `error_rate`: System error percentage

**Usage**:
```typescript
// Record daily metric
await prisma.systemMetrics.create({
  data: {
    metric_type: 'daily_draws',
    value: 47,
    metadata: { date: '2025-01-05' }
  }
});
```

---

## Database Setup

### 1. Install Dependencies
```bash
cd backend
npm install prisma @prisma/client bcrypt
npm install -D @types/bcrypt
```

### 2. Configure Database
```bash
# Copy environment template
cp prisma/.env.example .env

# Edit .env with your database credentials
DATABASE_URL="postgresql://user:password@localhost:5432/cleack"
```

### 3. Run Migrations
```bash
# Generate Prisma Client
npx prisma generate

# Create database and run migrations
npx prisma migrate dev --name init

# Seed development data
npx prisma db seed
```

### 4. Using Docker (Recommended)
```bash
# Start PostgreSQL container
docker-compose up -d postgres

# Database will be available at localhost:5432
# Credentials: cleack / password
```

---

## Prisma Commands

```bash
# Generate Prisma Client
npx prisma generate

# Create migration
npx prisma migrate dev --name migration_name

# Apply migrations (production)
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset

# Open Prisma Studio (GUI)
npx prisma studio

# Seed database
npx prisma db seed

# Validate schema
npx prisma validate

# Format schema
npx prisma format
```

---

## Performance Optimization

### Indexing Strategy

1. **User lookups**: `email`, `created_at`, `email_verified`
2. **Credit queries**: `user_id`, `created_at`, `transaction_type`
3. **Draw queries**: `user_id`, `status`, `platform`, `created_at`, `executed_at`
4. **Social accounts**: `user_id`, `platform`, `platform_user_id`

### Query Optimization Tips

```typescript
// ✅ Good: Use select to fetch only needed fields
const user = await prisma.user.findUnique({
  where: { id: userId },
  select: { id: true, email: true, name: true }
});

// ✅ Good: Use include for relationships
const draws = await prisma.draw.findMany({
  where: { user_id: userId },
  include: { user: true }
});

// ❌ Bad: Fetch everything
const user = await prisma.user.findUnique({
  where: { id: userId }
});
```

### Connection Pooling

```env
# Limit concurrent connections
DATABASE_URL="postgresql://user:pass@host:5432/db?connection_limit=5"
```

---

## Migration Strategy

### Development
- Use `prisma migrate dev` for schema changes
- Migrations are applied automatically
- Database is seeded after reset

### Production
- Use `prisma migrate deploy` in CI/CD
- Never use `migrate dev` in production
- Always backup before migrations

### Migration Checklist
- [ ] Test migration locally
- [ ] Review generated SQL
- [ ] Backup production database
- [ ] Run in maintenance window
- [ ] Verify data integrity
- [ ] Monitor application logs

---

## Security Considerations

### Sensitive Data
1. **Passwords**: Always use bcrypt with salt rounds ≥ 10
2. **Access Tokens**: Encrypt before storing (use application-level encryption)
3. **Refresh Tokens**: Encrypt before storing
4. **Email Verification Tokens**: Use cryptographically secure random strings

### Access Control
```typescript
// Always filter by user_id to prevent unauthorized access
const draws = await prisma.draw.findMany({
  where: {
    user_id: userId,  // ✅ Required
    status: 'completed'
  }
});
```

### SQL Injection Prevention
- Prisma automatically parameterizes queries
- Avoid raw queries unless necessary
- If using raw SQL, always use parameterized queries:

```typescript
// ✅ Safe
await prisma.$queryRaw`SELECT * FROM users WHERE id = ${userId}`;

// ❌ Dangerous (never do this)
await prisma.$queryRawUnsafe(`SELECT * FROM users WHERE id = ${userId}`);
```

---

## Backup & Recovery

### Automated Backups
```bash
# Daily backup script
pg_dump -h localhost -U cleack cleack > backup_$(date +%Y%m%d).sql

# Restore from backup
psql -h localhost -U cleack cleack < backup_20250105.sql
```

### Point-in-Time Recovery
Enable PostgreSQL WAL archiving for production environments.

---

## Monitoring

### Key Metrics to Track
1. **Query Performance**: Slow query log
2. **Connection Pool**: Active vs. idle connections
3. **Table Size**: Monitor growth trends
4. **Index Usage**: Ensure indexes are being used

### Prisma Logging
```typescript
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
```

---

## Troubleshooting

### Common Issues

**Issue**: Migration fails with "relation already exists"
```bash
# Solution: Reset migrations (development only)
npx prisma migrate reset
```

**Issue**: Cannot connect to database
```bash
# Solution: Check connection string and database is running
psql $DATABASE_URL
```

**Issue**: Prisma Client out of sync
```bash
# Solution: Regenerate Prisma Client
npx prisma generate
```

---

## Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Database Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization)
