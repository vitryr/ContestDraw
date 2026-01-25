# Instagram Draw Workflow - Complete Guide

## 🎯 Overview

This document explains how Instagram draw creation and participant scraping works in ContestDraw.

---

## 📋 The Complete Workflow

### **Phase 1: Create Draft Draw** ✅ (NOW WORKING)

User creates a draw with Instagram post URL but **NO participants yet**:

```json
POST /api/draws
{
  "title": "Summer Giveaway 2024",
  "description": "Win amazing prizes!",
  "numberOfWinners": 2,
  "platform": "instagram",
  "postUrl": "https://www.instagram.com/p/DOLG2E2CEa7/",
  "status": "draft"
  // NO participants field!
}
```

**Backend Response:**
```json
{
  "status": "success",
  "message": "Draw created successfully",
  "data": {
    "draw": {
      "id": "uuid-here",
      "status": "DRAFT",
      "participants": [],  // Empty array for now
      "platform": "instagram",
      "postUrl": "https://www.instagram.com/p/DOLG2E2CEa7/"
    }
  }
}
```

---

### **Phase 2: Connect Instagram Account** (REQUIRES OAUTH)

Before scraping, user must connect their Instagram Business account:

```typescript
// Instagram OAuth Flow
1. User clicks "Connect Instagram"
2. Redirected to Instagram OAuth consent screen
3. User authorizes app
4. App receives authorization code
5. Backend exchanges code for access token

// Backend call
const instagramService = new InstagramService();
const account = await instagramService.connectAccount(userId, authCode);
// Returns: { accessToken, expiresAt, username, accountId }
```

**Requirements:**
- Instagram Business or Creator account
- App registered in Meta Developer Console
- Instagram Graph API permissions: `instagram_basic`, `pages_show_list`

---

### **Phase 3: Import Participants from Instagram** (TODO: Need endpoint)

Once Instagram is connected, scrape participants from the post:

```typescript
// Proposed endpoint (needs to be implemented)
POST /api/draws/:id/import-participants
{
  "source": "instagram",
  "accessToken": "user-instagram-token"
}
```

**Backend Process:**
```typescript
// Using InstagramService.fetchComments()
const comments = await instagramService.fetchComments(
  postUrl,
  accessToken,
  maxComments  // Optional limit
);

// Comments become participants
const participants = comments.data.map(comment => ({
  name: comment.username,
  identifier: comment.userId,
  source: 'INSTAGRAM',
  metadata: {
    commentText: comment.text,
    timestamp: comment.timestamp,
    likes: comment.likes
  }
}));

// Update draw
draw.participants = participants;
draw.status = 'READY';  // Now ready to execute
```

---

### **Phase 4: Execute Draw**

Once participants are imported, execute the draw:

```typescript
POST /api/draws/:id/execute
{
  "algorithm": "crypto-random",
  "seed": "optional-seed"
}
```

Winners are selected from the imported Instagram commenters!

---

## 🔧 What Was Fixed Today

### **Problem:**
Backend controller required `participants` array even for draft draws, causing validation error:

```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": [
    {
      "field": "participants",
      "message": "At least one participant is required"
    }
  ]
}
```

### **Solution:**

#### 1. **Updated Validation** (draws.routes.ts)
```typescript
// Made participants optional for draft draws
body('participants').optional().isArray()
body('status').optional().isIn(['draft', 'configured', 'ready'])
body('platform').optional().trim()
body('postUrl').optional().trim().isURL()
```

#### 2. **Updated Controller** (draws.controller.ts)
```typescript
// Before (BROKEN):
const { participants } = req.body;
if (numberOfWinners > participants.length) { // ❌ Crash if participants undefined
  throw new AppError('...');
}

// After (FIXED):
const isDraft = status === 'draft' || !participants || participants.length === 0;

// Validate only if participants provided
if (participants && participants.length > 0) {
  if (numberOfWinners > participants.length && !allowDuplicates) {
    throw new AppError('...');
  }
}

// Set status based on whether participants exist
status: isDraft ? DrawStatus.DRAFT : DrawStatus.READY,
participants: participants && participants.length > 0 ? [...] : [],
platform: platform || null,
postUrl: postUrl || null
```

---

## 📊 Draw Status Flow

```
DRAFT
  ↓ (user connects Instagram & imports participants)
READY
  ↓ (user clicks "Execute Draw")
PROCESSING
  ↓ (random selection algorithm runs)
COMPLETED
```

---

## 🔑 Instagram API Integration

### **Service Methods Available:**

```typescript
class InstagramService {
  // OAuth connection
  async connectAccount(userId: string, authCode: string): Promise<SocialAccount>

  // Scrape comments from post
  async fetchComments(
    postUrl: string,
    accessToken: string,
    maxComments?: number
  ): Promise<PaginatedResponse<Comment>>

  // Get likes count
  async fetchLikes(postUrl: string, accessToken: string): Promise<number>

  // Verify if user follows account
  async verifyFollowing(
    username: string,
    targetAccount: string,
    accessToken: string
  ): Promise<boolean>

  // Story mentions (business accounts only)
  async fetchStoryMentions(
    accountId: string,
    accessToken: string
  ): Promise<PaginatedResponse<InstagramStoryMention>>

  // Parse Instagram URL
  parsePostUrl(url: string): string  // Extracts media ID
}
```

### **Supported URL Formats:**
```
✅ https://www.instagram.com/p/CODE/
✅ https://instagram.com/p/CODE/
✅ https://www.instagram.com/reel/CODE/
✅ https://www.instagram.com/tv/CODE/
```

---

## 🧪 Testing Instructions

### **1. Test Draft Draw Creation (NOW WORKS!)**

```bash
# Test with your provided payload
curl -X POST http://localhost:8000/api/draws \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "test 33",
    "description": "",
    "numberOfWinners": 2,
    "platform": "instagram",
    "postUrl": "https://www.instagram.com/p/DOLG2E2CEa7/",
    "status": "draft"
  }'

# Expected: 201 Created with DRAFT status
```

### **2. Test Instagram OAuth (Requires Setup)**

1. Create app in Meta Developer Console
2. Add Instagram Graph API product
3. Configure OAuth redirect URI
4. Set environment variables:
   ```bash
   INSTAGRAM_CLIENT_ID=your-app-id
   INSTAGRAM_CLIENT_SECRET=your-secret
   INSTAGRAM_REDIRECT_URI=http://localhost:3000/auth/instagram/callback
   ```

### **3. Test Comment Scraping (Once Connected)**

```typescript
const instagramService = new InstagramService();
const comments = await instagramService.fetchComments(
  'https://www.instagram.com/p/DOLG2E2CEa7/',
  accessToken
);

console.log(`Found ${comments.data.length} comments`);
// Each comment has: username, text, timestamp, likes
```

---

## ⚠️ Current Limitations

### **Instagram API Restrictions:**
1. **Requires Business/Creator Account** - Personal accounts can't use Graph API
2. **Rate Limits** - 200 calls per hour per user
3. **Permissions Required** - App must be reviewed by Meta
4. **Following Verification Limited** - Requires special permissions

### **Workarounds:**
- **Manual Upload:** Users can export Instagram commenters manually and upload CSV
- **Screenshot Import:** OCR from Instagram comment screenshots
- **Third-party Services:** Use services like Exportomments or CommentPicker

---

## 🚀 Next Steps to Complete Instagram Integration

### **1. Create Import Participants Endpoint**

```typescript
// backend/src/api/draws/draws.controller.ts

export const importParticipants = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { source, accessToken } = req.body;

  const draw = draws.get(id);
  if (draw.status !== DrawStatus.DRAFT) {
    throw new AppError('Can only import to draft draws', 400);
  }

  const instagramService = new InstagramService();
  const comments = await instagramService.fetchComments(
    draw.postUrl,
    accessToken
  );

  draw.participants = comments.data.map(comment => ({
    id: crypto.randomUUID(),
    name: comment.username,
    identifier: comment.userId,
    source: 'INSTAGRAM',
    metadata: { text: comment.text, timestamp: comment.timestamp }
  }));

  draw.status = DrawStatus.READY;

  res.json({ success: true, participantsCount: draw.participants.length });
});
```

### **2. Add Route**

```typescript
// backend/src/api/draws/draws.routes.ts
router.post('/:id/import-participants', importParticipants);
```

### **3. Frontend Integration**

```typescript
// After creating draft draw
if (platform === 'instagram') {
  // Show "Connect Instagram" button
  // Then "Import Participants" button
  await api.post(`/draws/${drawId}/import-participants`, {
    source: 'instagram',
    accessToken: userInstagramToken
  });
}
```

---

## 📝 Summary

### **Before Fix:**
- ❌ Draft draws couldn't be created without participants
- ❌ Instagram URL was ignored
- ❌ Validation error: "At least one participant is required"

### **After Fix:**
- ✅ Draft draws can be created with just Instagram URL
- ✅ Participants array is optional for drafts
- ✅ Platform and postUrl are stored for later import
- ✅ Status automatically set to DRAFT when no participants
- 🚧 Import participants endpoint still needs to be implemented

### **Files Modified:**
- `backend/src/api/draws/draws.routes.ts` - Made participants optional
- `backend/src/api/draws/draws.controller.ts` - Added draft draw support

---

## 🔗 Related Documentation

- Instagram Graph API: https://developers.facebook.com/docs/instagram-api
- Instagram Basic Display API: https://developers.facebook.com/docs/instagram-basic-display-api
- Meta App Review: https://developers.facebook.com/docs/app-review

---

**Last Updated:** November 6, 2025 19:15 CET
**Status:** ✅ Draft draw creation working, Instagram import pending
**Next:** Implement `/draws/:id/import-participants` endpoint
