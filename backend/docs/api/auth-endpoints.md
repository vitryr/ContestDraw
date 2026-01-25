# Authentication API Documentation

## Overview
The Authentication API provides endpoints for user registration, login, email verification, password reset, and token management.

**Base URL**: `/api/auth`

**Authentication**: Most endpoints are public, but some require JWT authentication.

---

## Endpoints

### 1. User Registration

Register a new user account.

**Endpoint**: `POST /api/auth/register`
**Alias**: `POST /api/auth/signup`

#### Request Body

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | Yes | Valid email address |
| password | string | Yes | 8-128 chars, must contain uppercase, lowercase, number, and special character |
| firstName | string | No | User's first name (1-50 chars) |
| lastName | string | No | User's last name (1-50 chars) |

#### Success Response

**Code**: `201 Created`

```json
{
  "status": "success",
  "message": "Registration successful. Please verify your email to unlock all features.",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "emailVerified": false,
      "role": "user",
      "credits": 3,
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "15m"
  }
}
```

#### Error Responses

**Code**: `400 Bad Request` - Validation Error
```json
{
  "status": "error",
  "message": "Validation failed",
  "code": "VALIDATION_ERROR",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email address"
    },
    {
      "field": "password",
      "message": "Password must contain uppercase, lowercase, number and special character"
    }
  ]
}
```

**Code**: `409 Conflict` - Email Already Exists
```json
{
  "status": "error",
  "message": "Email already registered",
  "code": "EMAIL_EXISTS"
}
```

**Code**: `429 Too Many Requests` - Rate Limit Exceeded
```json
{
  "status": "error",
  "message": "Too many requests, please try again later"
}
```

#### Notes
- New users receive 3 free credits as a welcome bonus
- Email verification email is sent automatically
- Tokens are valid immediately upon registration
- Password requirements:
  - Minimum 8 characters, maximum 128 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character (@$!%*?&)

---

### 2. User Login

Login with email and password.

**Endpoint**: `POST /api/auth/login`

#### Request Body

```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

#### Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | Yes | Valid email address |
| password | string | Yes | User's password |

#### Success Response

**Code**: `200 OK`

```json
{
  "status": "success",
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "emailVerified": true,
      "role": "user",
      "credits": 5
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "15m"
  }
}
```

#### Error Responses

**Code**: `401 Unauthorized` - Invalid Credentials
```json
{
  "status": "error",
  "message": "Invalid email or password",
  "code": "INVALID_CREDENTIALS"
}
```

#### Notes
- Login attempts are rate-limited to prevent brute force attacks
- Access tokens expire after 15 minutes
- Refresh tokens expire after 7 days

---

### 3. Email Verification

Verify email address with token.

**Endpoint**: `POST /api/auth/verify-email`

#### Request Body

```json
{
  "token": "verification-token-from-email"
}
```

#### Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| token | string | Yes | Verification token from email |

#### Success Response

**Code**: `200 OK`

```json
{
  "status": "success",
  "message": "Email verified successfully. You can now access all features."
}
```

#### Error Responses

**Code**: `400 Bad Request` - Invalid Token
```json
{
  "status": "error",
  "message": "Invalid or expired verification token",
  "code": "INVALID_TOKEN"
}
```

#### Notes
- Verification tokens expire after 24 hours
- Email verification unlocks all platform features
- A new verification email can be requested if token expires

---

### 4. Password Reset Request

Request a password reset email.

**Endpoint**: `POST /api/auth/forgot-password`

#### Request Body

```json
{
  "email": "user@example.com"
}
```

#### Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | Yes | User's email address |

#### Success Response

**Code**: `200 OK`

```json
{
  "status": "success",
  "message": "If the email exists, a reset link has been sent. Please check your inbox."
}
```

#### Notes
- Always returns success to prevent email enumeration
- Reset tokens expire after 1 hour
- Rate limited to prevent abuse (5 requests per 15 minutes)

---

### 5. Password Reset

Reset password with token.

**Endpoint**: `POST /api/auth/reset-password`

#### Request Body

```json
{
  "token": "reset-token-from-email",
  "password": "NewSecurePass123!"
}
```

#### Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| token | string | Yes | Reset token from email |
| password | string | Yes | New password (same requirements as registration) |

#### Success Response

**Code**: `200 OK`

```json
{
  "status": "success",
  "message": "Password reset successfully. You can now login with your new password."
}
```

#### Error Responses

**Code**: `400 Bad Request` - Invalid/Expired Token
```json
{
  "status": "error",
  "message": "Invalid or expired reset token",
  "code": "INVALID_TOKEN"
}
```

#### Notes
- Reset tokens can only be used once
- Tokens expire after 1 hour
- New password must meet all password requirements

---

### 6. Token Refresh

Refresh access token using refresh token.

**Endpoint**: `POST /api/auth/refresh`

#### Request Body

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Parameters

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| refreshToken | string | Yes | Valid refresh token |

#### Success Response

**Code**: `200 OK`

```json
{
  "status": "success",
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "15m"
  }
}
```

#### Error Responses

**Code**: `401 Unauthorized` - Invalid Token
```json
{
  "status": "error",
  "message": "Invalid refresh token",
  "code": "INVALID_TOKEN"
}
```

#### Notes
- Generates new access and refresh tokens
- Old tokens become invalid after refresh
- Refresh tokens expire after 7 days

---

### 7. Logout

Logout user (client-side token deletion).

**Endpoint**: `POST /api/auth/logout`

#### Success Response

**Code**: `200 OK`

```json
{
  "status": "success",
  "message": "Logout successful. Please delete your tokens on the client side."
}
```

#### Notes
- JWT tokens are stateless, so logout is handled client-side
- Client should delete stored tokens
- For enhanced security, implement token blacklisting with Redis

---

## OAuth Endpoints

### 8. Google OAuth

**Endpoint**: `GET /api/auth/oauth/google`

Initiates Google OAuth flow.

**Endpoint**: `GET /api/auth/oauth/google/callback`

Handles Google OAuth callback.

**Status**: Not yet implemented

---

### 9. Facebook OAuth

**Endpoint**: `GET /api/auth/oauth/facebook`

Initiates Facebook OAuth flow.

**Endpoint**: `GET /api/auth/oauth/facebook/callback`

Handles Facebook OAuth callback.

**Status**: Not yet implemented

---

## Security Features

### Rate Limiting

All authentication endpoints are rate-limited:

- **Registration/Login**: 10 requests per 15 minutes per IP
- **Password Reset**: 5 requests per 15 minutes per IP
- **Email Verification**: 10 requests per hour per IP

### Password Security

- Passwords are hashed using bcrypt with 12 rounds
- Never stored or transmitted in plain text
- Must meet complexity requirements

### Token Security

- Access tokens: Short-lived (15 minutes)
- Refresh tokens: Long-lived (7 days)
- JWT signed with secure secrets
- Tokens include user ID, email, and role

### Input Validation

- Email addresses are validated and normalized
- Passwords are validated against complexity rules
- All inputs are sanitized to prevent XSS and SQL injection

### HTTPS Only

- All authentication endpoints require HTTPS in production
- Tokens should only be transmitted over secure connections

---

## Error Codes

| Code | Description |
|------|-------------|
| EMAIL_EXISTS | Email address already registered |
| INVALID_CREDENTIALS | Invalid email or password |
| INVALID_TOKEN | Token is invalid or expired |
| TOKEN_EXPIRED | JWT token has expired |
| VALIDATION_ERROR | Request validation failed |
| USER_NOT_FOUND | User does not exist |
| NOT_IMPLEMENTED | Feature not yet implemented |

---

## Testing

### cURL Examples

**Register**:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234!@#$",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

**Login**:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test1234!@#$"
  }'
```

**Refresh Token**:
```bash
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

---

## Best Practices for Frontend Integration

1. **Store tokens securely**:
   - Use HttpOnly cookies for refresh tokens
   - Store access tokens in memory or secure storage
   - Never store tokens in localStorage

2. **Handle token expiration**:
   - Implement automatic token refresh before expiration
   - Handle 401 errors by refreshing tokens
   - Redirect to login on refresh token expiration

3. **Validate input client-side**:
   - Show real-time password strength indicator
   - Validate email format before submission
   - Display clear error messages

4. **Implement proper logout**:
   - Clear all stored tokens
   - Clear user state
   - Redirect to login page

5. **Handle rate limiting**:
   - Display user-friendly messages
   - Implement exponential backoff
   - Show countdown timer for retry

---

## Environment Variables

Required environment variables for authentication:

```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Security
BCRYPT_ROUNDS=12

# Email (Brevo)
BREVO_API_KEY=your-brevo-api-key
BREVO_FROM_EMAIL=noreply@contestdraw.com

# Frontend URL (for email links)
FRONTEND_URL=https://app.contestdraw.com

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/contestdraw
```
