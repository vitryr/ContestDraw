# System Architecture

This document describes the high-level architecture of the ContestDraw platform.

## Table of Contents
- [Overview](#overview)
- [Architecture Diagram](#architecture-diagram)
- [Components](#components)
- [Data Flow](#data-flow)
- [Technology Stack](#technology-stack)
- [Scalability](#scalability)
- [Security](#security)

---

## Overview

ContestDraw is built using a modern, cloud-native architecture with the following key principles:

- **Microservices-oriented**: Modular services with clear responsibilities
- **API-first**: REST API as the core interface
- **Scalable**: Horizontal scaling for high traffic
- **Secure**: GDPR-compliant, encrypted data, OAuth2
- **Resilient**: Fault-tolerant with graceful degradation
- **Observable**: Comprehensive logging and monitoring

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│  Web App (React)  │  Mobile App (React Native)  │  API Clients  │
└─────────────────────────────────────────────────────────────────┘
                               ↓ HTTPS
┌─────────────────────────────────────────────────────────────────┐
│                     CDN / LOAD BALANCER                          │
│                     (CloudFront / AWS ALB)                       │
└─────────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│                      API GATEWAY / BACKEND                       │
├─────────────────────────────────────────────────────────────────┤
│  Express.js REST API  │  Authentication  │  Rate Limiting        │
└─────────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│                       BUSINESS LOGIC LAYER                       │
├─────────────────────────────────────────────────────────────────┤
│  Draw Service  │  User Service  │  Social Media Service          │
│  Filter Service  │  Analytics Service  │  Payment Service        │
└─────────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│                       BACKGROUND JOBS                            │
├─────────────────────────────────────────────────────────────────┤
│  Bull Queue  │  Participant Sync  │  Draw Execution              │
│  Winner Notification  │  Analytics Aggregation                   │
└─────────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│                        DATA LAYER                                │
├─────────────────────────────────────────────────────────────────┤
│  PostgreSQL (Primary)  │  Redis (Cache/Queue)  │  S3 (Storage)  │
└─────────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                             │
├─────────────────────────────────────────────────────────────────┤
│  Instagram API  │  Facebook API  │  Twitter API                  │
│  TikTok API  │  YouTube API  │  Stripe  │  SendGrid             │
└─────────────────────────────────────────────────────────────────┘
```

---

## Components

### 1. Frontend Applications

#### Web Application (React)
- **Technology**: React 18, TypeScript, Vite
- **State Management**: Zustand
- **Data Fetching**: React Query
- **Styling**: Tailwind CSS + HeadlessUI
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod validation

**Key Features:**
- Responsive design (mobile, tablet, desktop)
- Server-side rendering (SSR) for SEO
- Progressive Web App (PWA) capabilities
- Real-time updates via WebSockets

**Directory Structure:**
```
frontend-web/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page-level components
│   ├── hooks/          # Custom React hooks
│   ├── services/       # API service layer
│   ├── stores/         # Zustand state stores
│   ├── utils/          # Utility functions
│   └── types/          # TypeScript type definitions
```

#### Mobile Application (React Native + Expo)
- **Technology**: React Native, Expo, TypeScript
- **State Management**: Zustand
- **Navigation**: React Navigation
- **Styling**: NativeWind (Tailwind for React Native)

**Key Features:**
- Native iOS and Android apps
- Push notifications
- Biometric authentication
- Offline-first architecture

---

### 2. Backend Services

#### API Gateway (Express.js)
- **Technology**: Node.js 18, Express.js, TypeScript
- **ORM**: Prisma
- **Validation**: Zod
- **Authentication**: JWT + OAuth2

**Responsibilities:**
- Request routing and validation
- Authentication and authorization
- Rate limiting (via Redis)
- API versioning
- Error handling and logging

**Middleware Stack:**
```javascript
1. Helmet (security headers)
2. CORS (cross-origin requests)
3. Rate limiter (express-rate-limit + Redis)
4. Body parser (JSON, URL-encoded)
5. JWT authentication
6. Request logging (Morgan + Winston)
7. Error handler
```

#### Service Layer

**Draw Service**
- Create, read, update, delete draws
- Execute draw algorithm
- Manage draw lifecycle (draft → active → processing → completed)
- Generate draw certificates

**User Service**
- User registration, login, profile management
- Email verification
- Password reset
- Credit management

**Social Media Service**
- OAuth connection flow for each platform
- Token refresh logic
- API integration with social platforms
- Participant fetching and caching

**Filter Service**
- Apply filters to participant list
- Validate filter criteria
- Disqualification logic
- Filter cost calculation

**Analytics Service**
- Aggregate contest statistics
- Generate reports
- Track user engagement
- Monitor platform trends

**Payment Service**
- Stripe integration
- Credit purchases
- Subscription management
- Invoice generation

---

### 3. Background Job Processing

**Technology**: Bull (Redis-based queue)

**Job Types:**

**Participant Sync Job**
```javascript
// Fetch participants from social media platform
{
  drawId: "uuid",
  platform: "instagram",
  postId: "ABC123",
  priority: "high"
}
```

**Draw Execution Job**
```javascript
// Execute draw and select winners
{
  drawId: "uuid",
  winnerCount: 3,
  filters: {...},
  randomSeed: "generated"
}
```

**Winner Notification Job** (Future)
```javascript
// Notify winners via DM
{
  drawId: "uuid",
  winnersIds: ["uuid1", "uuid2"],
  messageTemplate: "..."
}
```

**Analytics Aggregation Job**
```javascript
// Aggregate analytics data
{
  type: "daily_stats",
  date: "2025-01-15"
}
```

**Job Queue Configuration:**
- Concurrency: 5 concurrent jobs per worker
- Retries: 3 attempts with exponential backoff
- Timeout: 5 minutes per job
- Dead letter queue for failed jobs

---

### 4. Data Layer

#### PostgreSQL Database

**Schema Design:**

```sql
-- Users
users (id, email, password_hash, first_name, last_name, ...)

-- Draws
draws (id, user_id, title, platform, post_url, status, ...)

-- Participants
participants (id, draw_id, username, follower_count, ...)

-- Winners
winners (id, draw_id, participant_id, selected_at, ...)

-- Social Connections
social_connections (id, user_id, platform, access_token, ...)

-- Credit Transactions
credit_transactions (id, user_id, type, amount, ...)
```

**Database Optimization:**
- Indexes on foreign keys and query columns
- Partitioning for large tables (participants, analytics)
- Connection pooling (PgBouncer)
- Read replicas for analytics queries

#### Redis

**Usage:**
- **Session Storage**: User sessions (JWT refresh tokens)
- **Rate Limiting**: API request tracking
- **Job Queue**: Bull queue storage
- **Caching**: Frequently accessed data (user profiles, draw details)
- **Real-time**: Pub/Sub for WebSocket updates

**Cache Strategy:**
```javascript
// Cache-aside pattern
async function getDraw(drawId) {
  // Try cache first
  const cached = await redis.get(`draw:${drawId}`);
  if (cached) return JSON.parse(cached);

  // Fetch from database
  const draw = await db.draws.findUnique({ where: { id: drawId } });

  // Cache for 5 minutes
  await redis.setex(`draw:${drawId}`, 300, JSON.stringify(draw));

  return draw;
}
```

#### S3 Storage

**Usage:**
- User profile avatars
- Draw certificates (PDFs)
- Exported data (CSV files)
- Static assets (images, videos)

**Bucket Structure:**
```
contestdraw-assets/
├── avatars/
├── certificates/
├── exports/
└── static/
```

---

### 5. External Integrations

#### Social Media Platforms

**Instagram Graph API**
- OAuth 2.0 authentication
- Fetch post comments
- Verify follower status
- Check likes on posts

**Facebook Graph API**
- Page-level access
- Comment fetching
- Reaction verification
- Share tracking

**Twitter API v2**
- OAuth 2.0
- Fetch tweet replies
- Verify retweets and likes
- Follower verification

**TikTok API**
- OAuth 2.0
- Fetch video comments
- Verify followers
- Engagement metrics

**YouTube Data API v3**
- OAuth 2.0
- Fetch video comments
- Subscriber verification
- Like tracking

**API Rate Limiting Handling:**
```javascript
// Exponential backoff with jitter
async function fetchWithRetry(apiCall, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await apiCall();
    } catch (error) {
      if (error.statusCode === 429) { // Rate limited
        const delay = Math.pow(2, i) * 1000 + Math.random() * 1000;
        await sleep(delay);
        continue;
      }
      throw error;
    }
  }
  throw new Error('Max retries exceeded');
}
```

#### Payment Processing (Stripe)

**Integration:**
- Stripe Checkout for credit purchases
- Stripe Billing for subscriptions
- Webhook handling for payment events
- Invoice generation

**Webhook Events:**
- `checkout.session.completed` → Add credits
- `invoice.payment_succeeded` → Renew subscription
- `invoice.payment_failed` → Suspend subscription
- `customer.subscription.deleted` → Downgrade tier

#### Email Service (SendGrid)

**Email Types:**
- Welcome email (on signup)
- Email verification
- Password reset
- Draw completion notification
- Low credit warnings
- Subscription renewal reminders

---

## Data Flow

### User Creates a Draw

```
1. User submits draw form (Frontend)
   ↓
2. POST /api/v1/draws (API Gateway)
   ↓
3. Validate request + check credits (Middleware)
   ↓
4. Create draw in database (Draw Service)
   ↓
5. Return draw ID (API Response)
   ↓
6. User clicks "Sync Participants" (Frontend)
   ↓
7. POST /api/v1/draws/:id/sync (API Gateway)
   ↓
8. Enqueue sync job (Bull Queue)
   ↓
9. Worker picks up job (Background Worker)
   ↓
10. Fetch comments from platform (Social Media Service)
    ↓
11. Store participants in database
    ↓
12. Emit WebSocket update (Real-time)
    ↓
13. Frontend updates participant count
```

### User Executes a Draw

```
1. User clicks "Execute Draw" (Frontend)
   ↓
2. POST /api/v1/draws/:id/execute (API Gateway)
   ↓
3. Validate draw is ready (Draw Service)
   ↓
4. Deduct credits (User Service)
   ↓
5. Enqueue draw execution job (Bull Queue)
   ↓
6. Worker picks up job (Background Worker)
   ↓
7. Apply filters to participants (Filter Service)
   ↓
8. Generate cryptographically secure random numbers
   ↓
9. Select winners
   ↓
10. Update draw status to "completed"
    ↓
11. Store winners in database
    ↓
12. Generate certificate PDF (S3)
    ↓
13. Send completion email (SendGrid)
    ↓
14. Emit WebSocket update
    ↓
15. Frontend displays winners
```

---

## Technology Stack

### Backend
- **Runtime**: Node.js 18 LTS
- **Framework**: Express.js 4
- **Language**: TypeScript 5
- **ORM**: Prisma 5
- **Database**: PostgreSQL 14
- **Cache**: Redis 7
- **Queue**: Bull 4
- **Authentication**: JWT + OAuth2
- **Validation**: Zod
- **Testing**: Jest + Supertest
- **Documentation**: Swagger / OpenAPI 3.0

### Frontend
- **Framework**: React 18
- **Language**: TypeScript 5
- **Build Tool**: Vite 5
- **State**: Zustand
- **Data Fetching**: React Query (TanStack Query)
- **Styling**: Tailwind CSS 3
- **UI Components**: HeadlessUI + Radix UI
- **Forms**: React Hook Form + Zod
- **Routing**: React Router 6
- **Testing**: Vitest + React Testing Library

### Mobile
- **Framework**: React Native + Expo
- **Language**: TypeScript
- **Navigation**: React Navigation
- **State**: Zustand
- **Styling**: NativeWind
- **Testing**: Jest + React Native Testing Library

### Infrastructure
- **Cloud**: AWS
- **Compute**: EC2 (Auto Scaling Group)
- **Database**: RDS PostgreSQL (Multi-AZ)
- **Cache**: ElastiCache Redis
- **Storage**: S3
- **CDN**: CloudFront
- **Load Balancer**: Application Load Balancer (ALB)
- **DNS**: Route 53
- **Monitoring**: CloudWatch + Datadog
- **Logging**: CloudWatch Logs + ELK Stack
- **CI/CD**: GitHub Actions
- **Containers**: Docker + Docker Compose

### DevOps
- **Version Control**: Git + GitHub
- **CI/CD**: GitHub Actions
- **Infrastructure as Code**: Terraform
- **Container Registry**: AWS ECR
- **Secrets Management**: AWS Secrets Manager
- **Monitoring**: Datadog + Sentry
- **Status Page**: Statuspage.io

---

## Scalability

### Horizontal Scaling

**API Servers:**
- Auto-scaling EC2 instances behind ALB
- Target: 100-1000 requests/second per instance
- Scale up: CPU > 70% for 5 minutes
- Scale down: CPU < 30% for 10 minutes

**Background Workers:**
- Separate worker instances for job processing
- Auto-scale based on queue length
- Target: Queue length < 100 jobs

**Database:**
- Read replicas for analytics queries
- Connection pooling (PgBouncer)
- Partitioning for large tables

### Caching Strategy

**Multi-Level Cache:**
1. **L1 - Memory Cache** (in-process): Hot data, 1-minute TTL
2. **L2 - Redis Cache**: Frequently accessed, 5-minute TTL
3. **L3 - Database**: Source of truth

**Cache Invalidation:**
- Write-through cache for critical data
- TTL-based expiration for non-critical data
- Manual cache purging for admin actions

### Performance Targets

| Metric | Target | Notes |
|--------|--------|-------|
| API Response Time (p95) | < 200ms | Excluding external API calls |
| Draw Execution | < 30s | For draws with < 10k participants |
| Participant Sync | < 2min | For posts with < 5k comments |
| Uptime | 99.9% | ~8 hours downtime/year |
| Database Queries | < 50ms | For indexed queries |

---

## Security

### Authentication & Authorization

**JWT-based Authentication:**
- Access tokens: 15 minutes expiry
- Refresh tokens: 30 days expiry (stored in Redis)
- Token rotation on refresh

**OAuth2 for Social Platforms:**
- State parameter for CSRF protection
- Token encryption (AES-256)
- Token refresh before expiry

**Role-Based Access Control (RBAC):**
- Roles: `user`, `admin`
- Permissions checked at API and service level

### Data Protection

**Encryption:**
- **In Transit**: TLS 1.3 (HTTPS)
- **At Rest**:
  - Database: RDS encryption (AES-256)
  - S3: Server-side encryption (SSE-S3)
  - Secrets: AWS Secrets Manager

**PII Protection:**
- Social media tokens encrypted before storage
- Passwords hashed with bcrypt (10 rounds)
- Sensitive data never logged

**GDPR Compliance:**
- Data minimization: Only collect necessary data
- Right to deletion: Cascade delete on account removal
- Data portability: Export functionality
- Consent management: OAuth permissions

### API Security

**Rate Limiting:**
```javascript
// Per user: 100 requests/hour (Free), 1000 requests/hour (Pro)
// Per IP: 1000 requests/hour (unauthenticated)
// Sliding window algorithm via Redis
```

**Input Validation:**
- Zod schema validation for all inputs
- SQL injection prevention (Prisma ORM)
- XSS prevention (sanitization + CSP headers)

**Security Headers:**
```javascript
// Via Helmet.js
{
  contentSecurityPolicy: { /* CSP rules */ },
  hsts: { maxAge: 31536000 },
  noSniff: true,
  xssFilter: true,
  referrerPolicy: { policy: 'same-origin' }
}
```

### Monitoring & Incident Response

**Security Monitoring:**
- Failed login attempts tracking
- Unusual API activity detection
- Real-time alerts for security events

**Incident Response Plan:**
1. Detection (Datadog alerts)
2. Containment (Block IPs, revoke tokens)
3. Eradication (Patch vulnerabilities)
4. Recovery (Restore services)
5. Post-mortem (Document and improve)

---

## Disaster Recovery

### Backup Strategy

**Database Backups:**
- Automated daily snapshots (RDS)
- Retained for 30 days
- Point-in-time recovery enabled

**S3 Backups:**
- Versioning enabled
- Cross-region replication

### Recovery Time Objectives (RTO/RPO)

| Component | RTO | RPO | Notes |
|-----------|-----|-----|-------|
| API Servers | 5 min | 0 | Stateless, instant failover |
| Database | 15 min | 5 min | Restore from snapshot |
| Redis Cache | 1 min | 0 | Rebuild from database |
| Background Jobs | 10 min | 0 | Re-queue failed jobs |

---

## Monitoring & Observability

### Metrics (Datadog)

**Application Metrics:**
- Request rate, latency (p50, p95, p99)
- Error rate (4xx, 5xx)
- Business metrics (draws/day, credits used)

**Infrastructure Metrics:**
- CPU, memory, disk usage
- Database connections, query performance
- Redis cache hit rate

**Custom Metrics:**
```javascript
// Example: Track draw execution time
metrics.timing('draw.execution.duration', duration, {
  platform: 'instagram',
  participantCount: 1250,
  filterCount: 5
});
```

### Logging (CloudWatch + ELK)

**Log Levels:**
- `DEBUG`: Detailed debugging info
- `INFO`: General information
- `WARN`: Warning messages
- `ERROR`: Error messages (with stack traces)
- `FATAL`: Critical errors requiring immediate action

**Structured Logging:**
```javascript
logger.info('Draw executed', {
  drawId: 'uuid',
  userId: 'uuid',
  platform: 'instagram',
  participantCount: 1250,
  winnerCount: 3,
  executionTime: 15234 // ms
});
```

### Tracing (Distributed Tracing)

**OpenTelemetry Integration:**
- Trace requests across services
- Identify slow database queries
- Monitor external API calls

### Alerting

**Critical Alerts (PagerDuty):**
- API error rate > 5%
- Database CPU > 90%
- Queue length > 1000 jobs

**Warning Alerts (Email):**
- API latency p95 > 500ms
- Failed background jobs > 10/hour
- Low credit balance for users

---

**Last Updated:** January 2025
