# Quick Start Guide - Backend Features

## 🚀 Installation & Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

Add to `/backend/.env`:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/cleack"

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

### 3. Run Database Migration

```bash
npm run prisma:migrate
npm run prisma:generate
```

### 4. Start Development Server

```bash
npm run dev
```

## 📋 Quick API Reference

### Story Share Detection

**Schedule Monitoring:**
```typescript
import { scheduleStoryMonitoring } from './jobs/story-monitor.job';

await scheduleStoryMonitoring(
  drawId,
  userId,
  instagramAccountId,
  accessToken,
  startTime,
  endTime
);
```

**Check Status:**
```typescript
import { getStoryMonitoringStatus } from './jobs/story-monitor.job';

const status = await getStoryMonitoringStatus(drawId);
// Returns: { isActive, mentionCount, bonusEntriesApplied }
```

### Follower Verification

**Verify Single User:**
```bash
POST /api/verification/instagram/follower
Content-Type: application/json
Authorization: Bearer <token>

{
  "username": "testuser",
  "targetAccountId": "instagram_account_id",
  "accessToken": "instagram_token"
}
```

**Batch Verify:**
```bash
POST /api/verification/batch
Content-Type: application/json
Authorization: Bearer <token>

{
  "drawId": "draw_id",
  "requests": [
    {
      "username": "user1",
      "platform": "instagram",
      "targetAccount": "account_id"
    }
  ],
  "accessTokens": {
    "instagram": "token",
    "facebook": "token"
  }
}
```

### Blacklist Management

**Add to Blacklist:**
```bash
POST /api/blacklist
Content-Type: application/json
Authorization: Bearer <token>

{
  "username": "spammer123",
  "platform": "INSTAGRAM",
  "reason": "Spam behavior"
}
```

**Import CSV:**
```bash
POST /api/blacklist/import
Content-Type: multipart/form-data
Authorization: Bearer <token>

file: blacklist.csv
```

**Export CSV:**
```bash
GET /api/blacklist/export?platform=INSTAGRAM
Authorization: Bearer <token>
```

**Check if Blacklisted:**
```bash
GET /api/blacklist/check?username=testuser&platform=INSTAGRAM
Authorization: Bearer <token>
```

### Draw Filters

**Filter Participants:**
```typescript
import { filterParticipants } from './utils/draw-filters.util';

const result = await filterParticipants(participants, {
  drawId: "draw123",
  userId: "user456",
  excludeBlacklisted: true,
  requireFollowing: {
    platform: "instagram",
    targetAccount: "account_id",
    accessToken: "token"
  }
});

console.log(result.summary);
// { total, valid, excluded, blacklisted, notFollowing }
```

## 🧪 Testing

### Run All Tests
```bash
npm test
```

### Run Specific Tests
```bash
npm test -- blacklist.service.test.ts
npm test -- follower-verification.service.test.ts
npm test -- story-monitor.job.test.ts
```

### Watch Mode
```bash
npm test -- --watch
```

## 🔍 Debugging

### Check Redis Connection
```bash
redis-cli ping
# Should return: PONG
```

### View Bull Queue Jobs
```typescript
import { storyMonitorQueue } from './jobs/story-monitor.job';

const jobs = await storyMonitorQueue.getJobs(['active', 'waiting', 'completed']);
console.log(jobs);
```

### View Logs
```bash
tail -f logs/error.log
tail -f logs/combined.log
```

## 📊 Monitoring

### Story Monitor Status
```bash
GET /api/draws/:drawId/story-status
```

### Blacklist Statistics
```bash
GET /api/blacklist/stats
```

### Verification Results
```bash
GET /api/verification/results/:drawId
```

## 🛠️ Common Tasks

### Clear All Blacklist Entries
```bash
DELETE /api/blacklist/clear
Authorization: Bearer <token>
```

### Cancel Story Monitoring
```typescript
import { cancelStoryMonitoring } from './jobs/story-monitor.job';

await cancelStoryMonitoring(drawId);
```

### Re-verify Followers
```bash
POST /api/verification/batch
# Send same request again to re-verify
```

## 🐛 Troubleshooting

### Issue: "Redis connection refused"
**Solution:** Make sure Redis is running
```bash
redis-server
```

### Issue: "Instagram API rate limit"
**Solution:** Check rate limit headers and wait
```typescript
// Rate limit info is included in error response
{
  "error": "Rate limit exceeded",
  "rateLimit": {
    "limit": 200,
    "remaining": 0,
    "resetAt": "2025-11-05T16:00:00Z"
  }
}
```

### Issue: "Prisma migration failed"
**Solution:** Reset database
```bash
npm run prisma:migrate reset
npm run prisma:migrate dev
```

### Issue: "CSV import failed"
**Solution:** Check CSV format
```csv
Username,Platform,Reason
user1,INSTAGRAM,Spam
user2,FACEBOOK,Fake account
```

## 📚 Additional Resources

- **Full API Documentation:** `/docs/api/BACKEND_FEATURES.md`
- **Implementation Details:** `/docs/IMPLEMENTATION_SUMMARY.md`
- **Gap Analysis:** Check swarm memory key `gap-analysis`
- **Progress Tracking:** Check swarm memory key `backend-progress`

## 🔐 Security Checklist

- [ ] JWT_SECRET configured in .env
- [ ] Redis password set (if production)
- [ ] Instagram/Facebook API keys secured
- [ ] Rate limiting configured
- [ ] CORS origins restricted
- [ ] File upload limits enforced
- [ ] Input validation active

## 🚢 Deployment

### Pre-deployment Checklist
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database migration run
- [ ] Redis server running
- [ ] API keys valid
- [ ] Logs directory exists
- [ ] Error monitoring set up

### Production Environment
```env
NODE_ENV=production
DATABASE_URL=<production_db_url>
REDIS_HOST=<production_redis>
JWT_SECRET=<strong_secret>
```

## 📞 Support

- **GitHub Issues:** [repository]/issues
- **Documentation:** `/docs`
- **API Reference:** `/docs/api/BACKEND_FEATURES.md`

---

**Last Updated:** 2025-11-05
**Version:** 1.0.0
