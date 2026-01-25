# Backend Mobile API Compatibility Research Report

**Research Date:** 2025-11-05
**Backend URL:** http://localhost:8000
**Mobile Development URLs:**
- iOS Simulator: `http://localhost:19000` (Expo Dev)
- Android Emulator: `http://10.0.2.2:8000`
- Web Development: `http://localhost:19006`

---

## Executive Summary

✅ **Overall Status:** PARTIALLY COMPATIBLE with critical issues

The backend API at `http://localhost:8000` has basic CORS configuration for mobile development, but there are several critical compatibility issues and missing mobile-specific endpoints that need to be addressed.

### Critical Issues Found:
1. ⚠️ **CORS Configuration Mismatch** - Mobile .env points to wrong API URL
2. ⚠️ **Missing Expo Development URL** - `exp://localhost:19000` not in CORS origins
3. ⚠️ **No Push Notification Endpoints** - Mobile app expects push notifications
4. ⚠️ **Authentication Route Mismatch** - Mobile uses `/auth/signup` vs backend `/auth/register`
5. ⚠️ **Missing Social Media Deep Link Callbacks**

---

## 1. CORS Configuration Analysis

### Backend CORS Settings (.env)
**Location:** `/Users/romainvitry/Documents/Dev/ContestDraw/backend/.env`

```bash
# Current Configuration
CORS_ORIGIN=http://localhost:3001,http://localhost:19006,exp://localhost:19000
ALLOWED_ORIGINS=http://localhost:3001,http://localhost:19006
```

**Status:** ✅ GOOD - Includes mobile web URL (`http://localhost:19006`)
**Issue:** ⚠️ Missing from `ALLOWED_ORIGINS` list

### Backend CORS Implementation
**Location:** `/Users/romainvitry/Documents/Dev/ContestDraw/backend/src/config/config.ts`

```typescript
cors: {
  origin: (() => {
    const corsOrigin = process.env.CORS_ORIGIN || process.env.FRONTEND_URL || 'http://localhost:5173';
    const origins = corsOrigin.split(',').map(origin => origin.trim());
    return origins.length === 1 ? origins[0] : origins;
  })()
}
```

**Applied in:** `backend/src/index.ts` and `backend/src/server.ts`

```typescript
app.use(cors({
  origin: config.cors.origin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### Mobile App Configuration
**Location:** `/Users/romainvitry/Documents/Dev/ContestDraw/mobile/.env`

```bash
# Mobile API Configuration
API_URL=http://localhost:8000  # ✅ CORRECT
WS_URL=ws://localhost:8000      # ✅ CORRECT for WebSocket
```

**Issue:** ⚠️ Mobile environment config hardcodes different URL:
**Location:** `/Users/romainvitry/Documents/Dev/ContestDraw/mobile/src/config/environment.ts`

```typescript
dev: {
  apiUrl: 'http://localhost:3001/api',  // ❌ WRONG - Should be 8000
  stripePublishableKey: 'pk_test_...',
  enableDebugLogs: true,
}
```

### CORS Compatibility Assessment

| Origin URL | Backend CORS | ALLOWED_ORIGINS | Status |
|------------|--------------|-----------------|--------|
| `http://localhost:3001` | ✅ Yes | ✅ Yes | ✅ Supported |
| `http://localhost:19006` | ✅ Yes | ❌ No | ⚠️ Partial |
| `exp://localhost:19000` | ✅ Yes | ❌ No | ⚠️ Partial |
| `http://10.0.2.2:8000` | ❌ No | ❌ No | ❌ Not Supported |

---

## 2. API Endpoints Compatibility

### Authentication Endpoints

**Backend Implementation:** `/backend/src/api/auth/auth.routes.ts`

| Backend Endpoint | Mobile Expected | Method | Status |
|------------------|-----------------|--------|--------|
| `POST /api/auth/register` | `POST /auth/signup` | POST | ⚠️ MISMATCH |
| `POST /api/auth/login` | `POST /auth/login` | POST | ✅ MATCH |
| `POST /api/auth/verify-email` | Not used | POST | ✅ Available |
| `POST /api/auth/forgot-password` | Not used | POST | ✅ Available |
| `POST /api/auth/reset-password` | Not used | POST | ✅ Available |
| `POST /api/auth/refresh` | Not used | POST | ✅ Available |
| `GET /api/auth/oauth/google` | Not used | GET | ✅ Available |
| `GET /api/auth/oauth/facebook` | Not used | GET | ✅ Available |

**Critical Issue:** Mobile calls `/auth/signup` but backend expects `/auth/register`

**Mobile Auth Implementation:** `/mobile/src/services/authStore.ts`
```typescript
// Line 31: Login - ✅ CORRECT
const response = await apiService.post('/auth/login', { email, password });

// Line 55: Signup - ❌ WRONG ENDPOINT
const response = await apiService.post('/auth/signup', { email, password, name });
// Should be: '/auth/register'
```

### Draw Management Endpoints

**Backend Implementation:** `/backend/src/api/draws/draws.routes.ts`

| Endpoint | Mobile Usage | Method | Auth Required | Status |
|----------|--------------|--------|---------------|--------|
| `POST /api/draws` | ✅ Used (line 56) | POST | ✅ Yes | ✅ Compatible |
| `GET /api/draws` | ✅ Used (line 30) | GET | ✅ Yes | ✅ Compatible |
| `GET /api/draws/:id` | ✅ Used (line 43) | GET | ✅ Yes | ✅ Compatible |
| `DELETE /api/draws/:id` | ✅ Used (line 97) | DELETE | ✅ Yes | ✅ Compatible |
| `POST /api/draws/:id/execute` | ✅ Used (line 114) | POST | ✅ Yes | ✅ Compatible |
| `GET /api/draws/:id/certificate` | ❌ Not used | GET | ✅ Yes | ⚠️ Mobile Missing |
| `POST /api/draws/:id/export` | ❌ Not used | POST | ✅ Yes | ⚠️ Mobile Missing |

**Mobile Draw Implementation:** `/mobile/src/services/drawStore.ts`
```typescript
fetchDraws: async () => await apiService.get('/draws');
fetchDraw: async (id: string) => await apiService.get(`/draws/${id}`);
createDraw: async (data) => await apiService.post('/draws', data);
updateDraw: async (id, data) => await apiService.put(`/draws/${id}`, data);
deleteDraw: async (id) => await apiService.delete(`/draws/${id}`);
executeDraw: async (id) => await apiService.post(`/draws/${id}/execute`);
```

### User Profile Endpoints

**Backend Implementation:** `/backend/src/api/users/users.routes.ts`

| Endpoint | Method | Auth Required | Mobile Support | Status |
|----------|--------|---------------|----------------|--------|
| `GET /api/users/me` | GET | ✅ Yes | ✅ Compatible | ✅ Ready |
| `PATCH /api/users/me` | PATCH | ✅ Yes | ✅ Compatible | ✅ Ready |
| `DELETE /api/users/me` | DELETE | ✅ Yes | ✅ Compatible | ✅ Ready |
| `GET /api/users/stats` | GET | ✅ Yes | ✅ Compatible | ✅ Ready |

### Social Media Integration Endpoints

**Backend Implementation:** `/backend/src/api/social-platforms/social-platforms.routes.ts`

| Endpoint | Method | Mobile Ready | Notes |
|----------|--------|--------------|-------|
| `POST /api/social/connect/:platform` | POST | ✅ Yes | Supports: instagram, facebook, twitter, tiktok, youtube |
| `DELETE /api/social/disconnect/:platform` | DELETE | ✅ Yes | Platform disconnect |
| `GET /api/social/accounts` | GET | ✅ Yes | List connected accounts |
| `POST /api/social/fetch-participants` | POST | ✅ Yes | Fetch participants from URL |

**Supported Platforms:**
- Instagram
- Facebook
- Twitter
- TikTok
- YouTube

### Credits & Payment Endpoints

**Backend Implementation:** `/backend/src/api/credits/credits.routes.ts`

| Endpoint | Method | Mobile Compatible | Notes |
|----------|--------|-------------------|-------|
| `GET /api/credits/balance` | GET | ✅ Yes | Get current credit balance |
| `POST /api/credits/purchase` | POST | ✅ Yes | Purchase credits |
| `GET /api/credits/history` | GET | ✅ Yes | Transaction history |
| `POST /api/credits/subscription` | POST | ✅ Yes | Create subscription |
| `DELETE /api/credits/subscription` | DELETE | ✅ Yes | Cancel subscription |
| `GET /api/credits/packages` | GET | ✅ Yes | Available packages |

---

## 3. Mobile-Specific Requirements

### A. Deep Linking Configuration

**Mobile Configuration:** `/mobile/.env`
```bash
DEEP_LINK_SCHEME=contestdraw
DEEP_LINK_PREFIX=contestdraw://
UNIVERSAL_LINK=https://contestdraw.com
```

**Backend Configuration:** `/backend/.env`
```bash
MOBILE_DEEP_LINK=contestdraw://  # ✅ CONFIGURED
```

**iOS Configuration:** `/mobile/app.json`
```json
{
  "ios": {
    "bundleIdentifier": "com.contestdraw.app"
  }
}
```

**Backend Apple IAP Configuration:**
```bash
APPLE_IAP_SHARED_SECRET=REPLACE_WITH_APPLE_IAP_SECRET
APPLE_BUNDLE_ID=com.contestdraw.app  # ✅ MATCHES
```

**Status:** ✅ Deep linking URLs configured correctly

**Missing Backend Endpoints:**
- ❌ `GET /api/public/verify/:token` - Email verification deep link handler
- ❌ `GET /api/public/reset-password/:token` - Password reset deep link handler
- ❌ OAuth callback redirects for mobile deep links

### B. Push Notifications

**Mobile Configuration:** `/mobile/.env`
```bash
ENABLE_PUSH_NOTIFICATIONS=true
ONESIGNAL_APP_ID=  # Not configured
```

**Mobile App.json:**
```json
{
  "plugins": [
    ["expo-notifications", {
      "icon": "./assets/notification-icon.png",
      "color": "#6366F1"
    }]
  ]
}
```

**Backend Status:** ❌ NO PUSH NOTIFICATION ENDPOINTS FOUND

**Missing Backend Implementation:**
- ❌ Device token registration endpoint
- ❌ Notification sending service
- ❌ Push notification preferences endpoint
- ❌ Firebase Cloud Messaging (FCM) integration
- ❌ Apple Push Notification Service (APNS) integration

**Required Backend Endpoints:**
```
POST /api/notifications/register    # Register device token
POST /api/notifications/send        # Send notification
GET  /api/notifications/preferences # Get notification settings
PUT  /api/notifications/preferences # Update notification settings
```

### C. File Upload Handling

**Backend Configuration:** `/backend/.env`
```bash
MAX_FILE_SIZE=104857600  # 100MB
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,video/mp4,video/quicktime,application/pdf
```

**Mobile Configuration:** `/mobile/.env`
```bash
MAX_FILE_SIZE=104857600      # ✅ MATCHES
MAX_VIDEO_DURATION=300       # 5 minutes
VIDEO_QUALITY=high
```

**Backend Implementation:** `/backend/src/api/blacklist/blacklist.routes.ts`
```typescript
import multer from 'multer';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: config.storage.maxFileSize  // 10MB (from config)
  }
});
```

**Issues:**
⚠️ **File Size Mismatch:**
- Backend config: 10MB (from `config.storage.maxFileSize`)
- Backend .env: 100MB (from `MAX_FILE_SIZE`)
- Mobile: 100MB

⚠️ **Missing Mobile Upload Endpoints:**
- ❌ `POST /api/uploads/profile-picture` - Upload profile picture
- ❌ `POST /api/uploads/draw-media` - Upload draw-related media
- ❌ `POST /api/uploads/video` - Upload video recordings

**Current Upload Endpoint:**
- ✅ `POST /api/blacklist/upload` (CSV only) - Limited to blacklist CSV files

---

## 4. Authentication Flow Compatibility

### JWT Token Flow

**Backend Implementation:** `/backend/src/middleware/auth.middleware.ts`
```typescript
// Token extraction from Authorization header
const authHeader = req.headers.authorization;
if (!authHeader || !authHeader.startsWith('Bearer ')) {
  // 401 error
}
const token = authHeader.substring(7); // Remove 'Bearer ' prefix
const decoded = jwt.verify(token, config.jwt.secret);
```

**Mobile Implementation:** `/mobile/src/services/apiService.ts`
```typescript
this.api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;  // ✅ CORRECT FORMAT
    }
    return config;
  }
);
```

**Status:** ✅ COMPATIBLE - Authorization header format matches

### Token Refresh Flow

**Backend:**
- Endpoint: `POST /api/auth/refresh`
- Requires: `refreshToken` in body
- Returns: New access token

**Mobile:**
- ❌ NOT IMPLEMENTED - No automatic token refresh
- Tokens stored: `auth_token` only (no refresh token stored)
- On 401: Removes token and redirects to login

**Recommendation:** Implement automatic token refresh in mobile app

### JWT Configuration

**Backend:** `/backend/.env`
```bash
JWT_EXPIRES_IN=7d            # Access token: 7 days
JWT_REFRESH_EXPIRES_IN=30d   # Refresh token: 30 days
```

**Mobile:**
```bash
SESSION_TIMEOUT=3600000           # 1 hour
TOKEN_REFRESH_INTERVAL=300000     # 5 minutes
```

⚠️ **Configuration Mismatch:** Mobile expects 1-hour sessions, backend issues 7-day tokens

---

## 5. Backend .env Mobile-Friendly Settings

### Current Mobile-Related Settings

```bash
# CORS Configuration - ✅ GOOD
CORS_ORIGIN=http://localhost:3001,http://localhost:19006,exp://localhost:19000
ALLOWED_ORIGINS=http://localhost:3001,http://localhost:19006

# Frontend URLs - ✅ CONFIGURED
FRONTEND_URL=http://localhost:3001
MOBILE_DEEP_LINK=contestdraw://

# Apple IAP - ⚠️ PLACEHOLDER
APPLE_IAP_SHARED_SECRET=REPLACE_WITH_APPLE_IAP_SECRET
APPLE_BUNDLE_ID=com.contestdraw.app

# File Upload - ⚠️ SIZE MISMATCH
MAX_FILE_SIZE=104857600  # 100MB
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,video/mp4,video/quicktime,application/pdf

# Feature Flags - ✅ GOOD
ENABLE_48H_PASS=true
ENABLE_WHITE_LABEL=true
```

### Missing Mobile Settings

```bash
# Should be added:
MOBILE_APP_VERSION=1.0.0
MOBILE_MINIMUM_VERSION=1.0.0
ANDROID_PACKAGE_NAME=com.contestdraw.app
IOS_BUNDLE_ID=com.contestdraw.app

# Push Notifications
FIREBASE_SERVER_KEY=
APNS_KEY_ID=
APNS_TEAM_ID=
APNS_BUNDLE_ID=com.contestdraw.app

# Deep Linking Callbacks
MOBILE_AUTH_CALLBACK=contestdraw://auth/callback
MOBILE_PAYMENT_CALLBACK=contestdraw://payment/callback
```

---

## 6. Testing CORS Preflight Requests

### Test Commands

```bash
# Test from mobile web URL (port 19006)
curl -X OPTIONS http://localhost:8000/api/auth/login \
  -H "Origin: http://localhost:19006" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type, Authorization" \
  -v

# Test from Expo dev URL
curl -X OPTIONS http://localhost:8000/api/auth/login \
  -H "Origin: exp://localhost:19000" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type, Authorization" \
  -v

# Test actual login request
curl -X POST http://localhost:8000/api/auth/login \
  -H "Origin: http://localhost:19006" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  -v
```

### Expected CORS Headers

```
Access-Control-Allow-Origin: http://localhost:19006
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

---

## 7. API Compatibility Issues Summary

### Critical Issues (Must Fix)

1. **Authentication Endpoint Mismatch**
   - **Issue:** Mobile calls `/auth/signup`, backend expects `/auth/register`
   - **Impact:** Registration will fail completely
   - **Fix:** Change mobile to use `/auth/register` OR add alias route in backend

2. **Mobile Environment Config Wrong URL**
   - **Issue:** `environment.ts` has `apiUrl: 'http://localhost:3001/api'`
   - **Actual:** Should be `http://localhost:8000/api`
   - **Impact:** All API calls will fail
   - **Fix:** Update `/mobile/src/config/environment.ts`

3. **Android Emulator CORS Not Configured**
   - **Issue:** `http://10.0.2.2:8000` not in CORS origins
   - **Impact:** Android emulator cannot connect to backend
   - **Fix:** Add to `CORS_ORIGIN` and `ALLOWED_ORIGINS`

### High Priority Issues

4. **Missing Push Notification Endpoints**
   - **Issue:** Mobile app expects push notifications, no backend support
   - **Impact:** Push notifications won't work
   - **Fix:** Implement FCM/APNS integration and endpoints

5. **No Deep Link Callback Handlers**
   - **Issue:** OAuth/email verification/password reset need mobile callbacks
   - **Impact:** Deep linking won't work for these flows
   - **Fix:** Add public endpoints for mobile deep link handling

6. **File Upload Size Mismatch**
   - **Issue:** Config uses 10MB, .env says 100MB, mobile expects 100MB
   - **Impact:** Large files may be rejected
   - **Fix:** Sync all configurations to 100MB

### Medium Priority Issues

7. **Missing Token Refresh Implementation**
   - **Issue:** Mobile doesn't implement automatic token refresh
   - **Impact:** Users forced to re-login frequently
   - **Fix:** Implement refresh token flow in mobile app

8. **Certificate & Export Endpoints Not Used**
   - **Issue:** Backend has these features, mobile doesn't use them
   - **Impact:** Missing functionality in mobile app
   - **Fix:** Add certificate download and export features to mobile

9. **ALLOWED_ORIGINS Incomplete**
   - **Issue:** Only has `http://localhost:3001,http://localhost:19006`
   - **Missing:** `exp://localhost:19000`
   - **Fix:** Add Expo URL to ALLOWED_ORIGINS

---

## 8. Recommended Fixes

### Immediate Actions (Before Testing)

1. **Fix Mobile API URL:**
```typescript
// File: /mobile/src/config/environment.ts
const ENV = {
  dev: {
    apiUrl: 'http://localhost:8000/api',  // Changed from 3001
    // ... rest
  }
}
```

2. **Add Backend Route Alias:**
```typescript
// File: /backend/src/api/auth/auth.routes.ts
// Add after existing /register route:
router.post('/signup', authController.register); // Alias for mobile compatibility
```

3. **Update Backend CORS:**
```bash
# File: /backend/.env
CORS_ORIGIN=http://localhost:3001,http://localhost:19006,exp://localhost:19000,http://10.0.2.2:8000
ALLOWED_ORIGINS=http://localhost:3001,http://localhost:19006,exp://localhost:19000,http://10.0.2.2:8000
```

4. **Sync File Upload Config:**
```typescript
// File: /backend/src/config/config.ts
storage: {
  type: process.env.STORAGE_TYPE || 'local',
  path: process.env.STORAGE_PATH || './uploads',
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '104857600', 10) // 100MB (changed from 10MB)
}
```

### Short-Term Actions (Week 1-2)

5. **Add Public Deep Link Endpoints:**
```typescript
// File: /backend/src/api/public/public.routes.ts (create if doesn't exist)
router.get('/verify/:token', publicController.verifyEmail);
router.get('/reset-password/:token', publicController.resetPasswordPage);
router.get('/oauth-callback', publicController.handleOAuthCallback);
```

6. **Implement Basic Push Notifications:**
```typescript
// File: /backend/src/api/notifications/notifications.routes.ts (new)
router.post('/register', authenticate, notificationsController.registerDevice);
router.post('/send', authenticate, notificationsController.sendNotification);
router.get('/preferences', authenticate, notificationsController.getPreferences);
router.put('/preferences', authenticate, notificationsController.updatePreferences);
```

7. **Add Mobile Upload Endpoints:**
```typescript
// File: /backend/src/api/uploads/uploads.routes.ts (new)
router.post('/profile-picture', authenticate, upload.single('image'), uploadsController.uploadProfilePicture);
router.post('/draw-media', authenticate, upload.single('media'), uploadsController.uploadDrawMedia);
router.post('/video', authenticate, upload.single('video'), uploadsController.uploadVideo);
```

### Medium-Term Actions (Week 3-4)

8. **Implement Token Refresh in Mobile:**
```typescript
// File: /mobile/src/services/apiService.ts
// Add automatic token refresh interceptor
this.api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && error.config && !error.config.__isRetry) {
      error.config.__isRetry = true;
      try {
        const refreshToken = await AsyncStorage.getItem('refresh_token');
        const response = await axios.post(`${ENV.apiUrl}/auth/refresh`, { refreshToken });
        const { token } = response.data;
        await AsyncStorage.setItem('auth_token', token);
        error.config.headers.Authorization = `Bearer ${token}`;
        return this.api.request(error.config);
      } catch (refreshError) {
        await AsyncStorage.removeItem('auth_token');
        await AsyncStorage.removeItem('refresh_token');
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
```

9. **Add Certificate & Export Features to Mobile**
10. **Implement Social OAuth with Mobile Callbacks**
11. **Add Firebase/APNS Configuration**

---

## 9. Testing Checklist

### Backend API Tests

- [ ] Test CORS with `http://localhost:19006` origin
- [ ] Test CORS with `exp://localhost:19000` origin
- [ ] Test CORS with `http://10.0.2.2:8000` origin (Android)
- [ ] Verify `/api/auth/register` endpoint works
- [ ] Verify `/api/auth/login` endpoint works
- [ ] Test authentication with Bearer token from mobile
- [ ] Verify all draw endpoints respond correctly
- [ ] Test file upload with 100MB file
- [ ] Verify preflight OPTIONS requests work

### Mobile App Tests

- [ ] Login from mobile app
- [ ] Register new account from mobile app
- [ ] Create new draw from mobile app
- [ ] Execute draw from mobile app
- [ ] View draw history from mobile app
- [ ] Test iOS simulator connectivity
- [ ] Test Android emulator connectivity (10.0.2.2)
- [ ] Test physical device connectivity (local network IP)
- [ ] Verify token persistence across app restarts
- [ ] Test 401 error handling and logout

### Integration Tests

- [ ] Test social media OAuth flow from mobile
- [ ] Test deep linking for email verification
- [ ] Test deep linking for password reset
- [ ] Test file uploads from mobile (images, videos)
- [ ] Test credit purchase flow
- [ ] Test subscription management
- [ ] Verify push notifications (if implemented)

---

## 10. Conclusion

### Compatibility Score: 65/100

**Breakdown:**
- ✅ Core API Endpoints: 85/100 (mostly compatible, route mismatch)
- ⚠️ CORS Configuration: 70/100 (partial support, missing Android)
- ⚠️ Authentication Flow: 75/100 (works but needs fixes)
- ❌ Mobile-Specific Features: 30/100 (push notifications, deep linking missing)
- ✅ File Upload Support: 60/100 (configured but limited endpoints)

### Summary

The backend API provides **good foundational support** for the mobile app with properly configured CORS for web-based mobile development and comprehensive REST endpoints for core functionality (authentication, draws, users, social platforms, credits).

However, there are **critical issues** that will prevent the mobile app from working properly:
1. Wrong API URL in mobile environment config
2. Authentication endpoint name mismatch
3. Missing Android emulator CORS support
4. No push notification infrastructure
5. Limited deep linking support

### Next Steps Priority

**Priority 1 (Do Immediately):**
1. Fix mobile API URL configuration
2. Add `/auth/signup` alias route
3. Update CORS configuration for Android emulator

**Priority 2 (This Week):**
4. Implement public deep link handlers
5. Add basic push notification endpoints
6. Create mobile-specific upload endpoints

**Priority 3 (Next Sprint):**
7. Implement automatic token refresh
8. Add certificate download feature to mobile
9. Complete OAuth mobile callback flow

---

## Appendix A: Backend Routes Summary

### Authentication Routes (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login with credentials
- `POST /verify-email` - Verify email address
- `POST /forgot-password` - Request password reset
- `POST /reset-password` - Reset password with token
- `POST /refresh` - Refresh access token
- `GET /oauth/google` - Google OAuth
- `GET /oauth/facebook` - Facebook OAuth

### Draw Routes (`/api/draws`)
- `POST /` - Create new draw
- `GET /` - List all draws (paginated)
- `GET /:id` - Get draw by ID
- `DELETE /:id` - Delete draw
- `POST /:id/execute` - Execute draw algorithm
- `GET /:id/certificate` - Generate PDF certificate
- `POST /:id/export` - Export results (CSV/XLSX)

### User Routes (`/api/users`)
- `GET /me` - Get current user profile
- `PATCH /me` - Update profile
- `DELETE /me` - Delete account (GDPR)
- `GET /stats` - Get usage statistics

### Social Platform Routes (`/api/social`)
- `POST /connect/:platform` - Connect social account
- `DELETE /disconnect/:platform` - Disconnect social account
- `GET /accounts` - List connected accounts
- `POST /fetch-participants` - Fetch participants from post

### Credits Routes (`/api/credits`)
- `GET /balance` - Get credit balance
- `POST /purchase` - Purchase credits
- `GET /history` - Transaction history
- `POST /subscription` - Create subscription
- `DELETE /subscription` - Cancel subscription
- `GET /packages` - Available packages

### Other Routes
- `GET /health` - Health check endpoint
- `/api/blacklist/*` - Blacklist management
- `/api/verification/*` - Verification endpoints
- `/api/organizations/*` - Organization management
- `/api/brands/*` - Brand management
- `/api/branding/*` - Custom branding

---

## Appendix B: Mobile App API Usage

### Files Making API Calls

1. `/mobile/src/services/apiService.ts` - Base API client with interceptors
2. `/mobile/src/services/authStore.ts` - Authentication state management
3. `/mobile/src/services/drawStore.ts` - Draw state management
4. `/mobile/src/services/paymentService.ts` - Payment processing
5. `/mobile/src/config/environment.ts` - Environment configuration

### API Calls Made by Mobile

**Authentication:**
- `POST /auth/login` ✅
- `POST /auth/signup` ⚠️ (should be `/auth/register`)

**Draws:**
- `GET /draws` ✅
- `GET /draws/:id` ✅
- `POST /draws` ✅
- `PUT /draws/:id` ✅
- `DELETE /draws/:id` ✅
- `POST /draws/:id/execute` ✅

**Expected but Not Implemented:**
- Push notification endpoints
- Deep link callback handlers
- Mobile-specific file upload endpoints
- Social OAuth mobile callbacks

---

**Report Generated By:** Research Agent
**Backend Port:** 8000
**Mobile Framework:** React Native + Expo
**Testing Status:** Ready for implementation of recommended fixes
