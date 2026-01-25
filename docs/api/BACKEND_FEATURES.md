# Backend Features API Documentation

## Overview

This document describes the three major backend features implemented for the ContestDraw system:

1. **Story Share Detection System** - Real-time monitoring of Instagram story mentions
2. **Follower Verification API** - Instagram/Facebook follower verification
3. **User Blacklist Feature** - Participant exclusion management

## 1. Story Share Detection System

### Description
Monitors Instagram Mentions API for story shares during contest periods. Implements 24h time window tracking and applies bonus participations for users who shared to their stories.

### Database Schema

```prisma
model StoryMention {
  id               String   @id @default(uuid())
  drawId           String
  instagramMediaId String
  username         String
  userId           String?
  mentionedAt      DateTime
  verified         Boolean  @default(false)
  bonusApplied     Boolean  @default(false)
  metadata         Json?
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
}
```

### Background Job

**Location**: `/backend/src/jobs/story-monitor.job.ts`

#### Key Functions

##### `scheduleStoryMonitoring()`
Schedules periodic monitoring for a draw's story mentions.

```typescript
await scheduleStoryMonitoring(
  drawId: string,
  userId: string,
  instagramAccountId: string,
  accessToken: string,
  startTime: Date,
  endTime: Date
)
```

**Parameters:**
- `drawId` - Draw identifier
- `userId` - User who owns the draw
- `instagramAccountId` - Instagram business account ID
- `accessToken` - Instagram Graph API access token
- `startTime` - Contest start time
- `endTime` - Contest end time

**Behavior:**
- Runs every hour during contest period
- Fetches story mentions via Instagram Mentions API
- Filters mentions within 24h window
- Stores valid mentions in database
- Applies 3 bonus entries per story share

##### `cancelStoryMonitoring(drawId)`
Cancels monitoring for a specific draw.

##### `getStoryMonitoringStatus(drawId)`
Returns current monitoring status and statistics.

**Response:**
```json
{
  "isActive": boolean,
  "mentionCount": number,
  "bonusEntriesApplied": number
}
```

### Features

- ✅ Hourly monitoring via Bull queue
- ✅ 24-hour story window tracking
- ✅ Duplicate mention prevention
- ✅ Automatic bonus entry application (3x per share)
- ✅ Metadata tracking for audit trail
- ✅ Redis-backed job queue
- ✅ Error handling and logging

---

## 2. Follower Verification API

### Description
Verifies if participants follow required Instagram accounts or like Facebook pages. Provides batch verification for efficient processing.

### Database Schema

```prisma
model FollowerVerification {
  id           String   @id @default(uuid())
  drawId       String
  username     String
  platform     String
  targetAccount String
  isFollowing  Boolean
  verifiedAt   DateTime
  metadata     Json?
  createdAt    DateTime @default(now())
}
```

### Service

**Location**: `/backend/src/services/follower-verification.service.ts`

#### API Endpoints

##### POST `/api/verification/instagram/follower`
Verify single Instagram follower.

**Request Body:**
```json
{
  "username": "testuser",
  "targetAccountId": "instagram_account_id",
  "accessToken": "instagram_access_token"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "username": "testuser",
    "targetAccountId": "instagram_account_id",
    "isFollowing": true,
    "platform": "instagram"
  }
}
```

##### POST `/api/verification/facebook/page-like`
Verify Facebook page like.

**Request Body:**
```json
{
  "userId": "facebook_user_id",
  "pageId": "facebook_page_id",
  "accessToken": "facebook_access_token"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "facebook_user_id",
    "pageId": "facebook_page_id",
    "isLiking": true,
    "platform": "facebook"
  }
}
```

##### POST `/api/verification/batch`
Batch verify multiple users.

**Request Body:**
```json
{
  "drawId": "draw_id",
  "requests": [
    {
      "username": "user1",
      "platform": "instagram",
      "targetAccount": "account_id"
    },
    {
      "username": "user2",
      "platform": "facebook",
      "targetAccount": "page_id"
    }
  ],
  "accessTokens": {
    "instagram": "token",
    "facebook": "token"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "username": "user1",
      "platform": "instagram",
      "targetAccount": "account_id",
      "isFollowing": true,
      "verifiedAt": "2025-11-05T10:00:00Z"
    }
  ],
  "summary": {
    "total": 2,
    "success": 2,
    "failed": 0,
    "following": 1,
    "notFollowing": 1
  }
}
```

##### GET `/api/verification/results/:drawId`
Get verification results for a draw.

**Response:**
```json
{
  "success": true,
  "data": [...],
  "summary": {
    "total": 100,
    "following": 85,
    "notFollowing": 15
  }
}
```

### Features

- ✅ Instagram follower verification via Graph API
- ✅ Facebook page like verification
- ✅ Batch processing (10 users per batch)
- ✅ Automatic pagination handling
- ✅ Result caching (10 min TTL)
- ✅ Rate limit handling
- ✅ Error recovery with retries

---

## 3. User Blacklist Feature

### Description
Allows organizers to maintain blacklists of usernames to exclude from draws. Supports CSV import/export and integrates with draw filter logic.

### Database Schema

```prisma
model Blacklist {
  id        String   @id @default(uuid())
  userId    String
  username  String
  platform  String   @default("INSTAGRAM")
  reason    String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  user User @relation(fields: [userId], references: [id])
  @@unique([userId, username, platform])
}
```

### API Endpoints

**Base URL**: `/api/blacklist`

#### GET `/api/blacklist`
Get all blacklisted users.

**Query Parameters:**
- `platform` (optional) - Filter by platform
- `search` (optional) - Search by username

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "blacklist_id",
      "username": "spammer123",
      "platform": "INSTAGRAM",
      "reason": "Spam behavior",
      "createdAt": "2025-11-05T10:00:00Z"
    }
  ],
  "count": 1
}
```

#### POST `/api/blacklist`
Add user to blacklist.

**Request Body:**
```json
{
  "username": "spammer123",
  "platform": "INSTAGRAM",
  "reason": "Spam behavior"
}
```

**Response:**
```json
{
  "success": true,
  "data": {...},
  "message": "User added to blacklist successfully"
}
```

#### PUT `/api/blacklist/:id`
Update blacklist entry.

**Request Body:**
```json
{
  "reason": "Updated reason"
}
```

#### DELETE `/api/blacklist/:id`
Remove user from blacklist.

#### POST `/api/blacklist/bulk`
Bulk add users.

**Request Body:**
```json
{
  "entries": [
    {
      "username": "user1",
      "platform": "INSTAGRAM",
      "reason": "Spam"
    },
    {
      "username": "user2"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "successCount": 2,
    "errorCount": 0,
    "errors": []
  }
}
```

#### POST `/api/blacklist/import`
Import from CSV file.

**Request:**
- Content-Type: `multipart/form-data`
- File field: `file` (CSV file)
- Max size: 5MB

**CSV Format:**
```csv
Username,Platform,Reason
spammer1,INSTAGRAM,Spam behavior
spammer2,FACEBOOK,Fake account
```

**Response:**
```json
{
  "success": true,
  "data": {
    "successCount": 2,
    "errorCount": 0,
    "errors": []
  },
  "message": "Import completed: 2 added, 0 failed"
}
```

#### GET `/api/blacklist/export`
Export to CSV file.

**Query Parameters:**
- `platform` (optional) - Filter by platform

**Response:**
- Content-Type: `text/csv`
- File download

#### GET `/api/blacklist/check`
Check if username is blacklisted.

**Query Parameters:**
- `username` (required)
- `platform` (optional, default: INSTAGRAM)

**Response:**
```json
{
  "success": true,
  "data": {
    "username": "testuser",
    "platform": "INSTAGRAM",
    "isBlacklisted": false
  }
}
```

#### GET `/api/blacklist/stats`
Get blacklist statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalCount": 150,
    "byPlatform": {
      "INSTAGRAM": 120,
      "FACEBOOK": 30
    }
  }
}
```

#### DELETE `/api/blacklist/clear`
Clear all blacklist entries.

**Query Parameters:**
- `platform` (optional) - Clear specific platform only

### Features

- ✅ CRUD operations for blacklist management
- ✅ CSV import/export with XLSX library
- ✅ Bulk operations support
- ✅ Platform-specific filtering
- ✅ Username search functionality
- ✅ Integration with draw filters
- ✅ Statistics and reporting
- ✅ Reason tracking for audit

---

## Draw Integration

### Draw Filters Utility

**Location**: `/backend/src/utils/draw-filters.util.ts`

#### `filterParticipants()`
Main filtering function that applies blacklist and follower verification.

```typescript
const result = await filterParticipants(participants, {
  drawId: "draw123",
  userId: "user456",
  requireFollowing: {
    platform: "instagram",
    targetAccount: "account_id",
    accessToken: "token"
  },
  excludeBlacklisted: true,
  platform: "INSTAGRAM"
});
```

**Returns:**
```typescript
{
  validParticipants: Participant[],
  excludedParticipants: Participant[],
  excludedReasons: Map<string, string[]>,
  summary: {
    total: number,
    valid: number,
    excluded: number,
    blacklisted: number,
    notFollowing: number
  }
}
```

#### `validateParticipantsForDraw()`
Validates participants before draw execution.

#### `applyFiltersAndUpdateDraw()`
Applies filters and marks excluded participants in metadata.

---

## Testing

### Test Files

1. **Blacklist Service**: `/backend/tests/services/blacklist.service.test.ts`
2. **Follower Verification**: `/backend/tests/services/follower-verification.service.test.ts`
3. **Story Monitor Job**: `/backend/tests/jobs/story-monitor.job.test.ts`

### Running Tests

```bash
npm test
```

### Test Coverage

- ✅ Service unit tests
- ✅ API endpoint tests
- ✅ Background job tests
- ✅ Error handling tests
- ✅ Integration tests

---

## Environment Variables

Add to `.env`:

```env
# Redis (for Bull queue)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Instagram Graph API
INSTAGRAM_CLIENT_ID=your_client_id
INSTAGRAM_CLIENT_SECRET=your_client_secret

# Facebook Graph API
FACEBOOK_APP_ID=your_app_id
FACEBOOK_APP_SECRET=your_app_secret
```

---

## Migration

Run Prisma migration to create new tables:

```bash
npm run prisma:migrate
npm run prisma:generate
```

---

## Performance Considerations

### Story Monitor
- Runs hourly to minimize API calls
- Uses Redis for job queue
- Implements deduplication
- Caches results

### Follower Verification
- Batch processing (10 users/batch)
- 10-minute cache TTL
- Rate limit handling
- Retry mechanism

### Blacklist
- Indexed queries for performance
- CSV streaming for large files
- Bulk operations support
- Efficient filtering

---

## Security

- ✅ JWT authentication required
- ✅ User ownership verification
- ✅ Input validation with express-validator
- ✅ File upload restrictions (CSV only, 5MB max)
- ✅ SQL injection prevention (Prisma)
- ✅ Rate limiting on API endpoints
- ✅ Access token encryption (recommended)

---

## Error Handling

All endpoints follow standard error format:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "statusCode": 400
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `409` - Conflict (duplicate)
- `500` - Internal Server Error

---

## Next Steps

### Recommended Enhancements

1. **Story Monitor**
   - Webhook support for real-time updates
   - Multiple account monitoring
   - Custom bonus entry configuration

2. **Follower Verification**
   - Twitter/X integration
   - TikTok follower verification
   - Scheduled re-verification

3. **Blacklist**
   - Shared blacklists across organization
   - Temporary blacklisting with expiry
   - Pattern matching (regex support)
   - Auto-blacklist based on behavior

---

## Support

For issues or questions:
- GitHub Issues: [repository]/issues
- Email: support@contestdraw.com
- Documentation: /docs

---

**Last Updated**: 2025-11-05
**Version**: 1.0.0
**Authors**: Backend Development Team
