# Backend Signup Implementation - Setup Guide

## Overview

This document provides a comprehensive guide for the backend signup workflow implementation, including database setup, API endpoints, testing, and deployment.

## Implementation Status

### ✅ Completed Features

1. **User Registration (POST /api/auth/register, /api/auth/signup)**
   - Email and password validation
   - Password hashing with bcrypt (12 rounds)
   - Welcome bonus: 3 free credits
   - JWT token generation
   - Email verification flow
   - Input sanitization and normalization

2. **User Login (POST /api/auth/login)**
   - Secure password verification
   - JWT access and refresh tokens
   - Rate limiting protection

3. **Email Verification (POST /api/auth/verify-email)**
   - Token-based verification
   - 24-hour token expiration
   - Automated email sending via Brevo

4. **Password Reset Flow**
   - Reset request (POST /api/auth/forgot-password)
   - Password update (POST /api/auth/reset-password)
   - 1-hour token expiration
   - One-time use tokens

5. **Token Management**
   - Token refresh (POST /api/auth/refresh)
   - Secure token generation
   - Automatic expiration handling

6. **Security Features**
   - Rate limiting on all endpoints
   - SQL injection prevention (Prisma ORM)
   - XSS protection
   - Password complexity requirements
   - CORS configuration
   - Helmet security headers

## Architecture

### Database Schema

```
User
├── id (UUID, primary key)
├── email (unique, indexed)
├── password (bcrypt hashed)
├── firstName (optional)
├── lastName (optional)
├── emailVerified (boolean)
├── role (default: 'user')
├── credits (default: 3)
├── trial_used (boolean)
├── bonus_granted (boolean)
└── timestamps (createdAt, updatedAt)

EmailVerificationToken
├── id (UUID)
├── userId (foreign key)
├── token (unique, indexed)
├── expiresAt (indexed)
└── createdAt

PasswordResetToken
├── id (UUID)
├── userId (foreign key)
├── token (unique, indexed)
├── expiresAt (indexed)
├── used (boolean)
└── createdAt

CreditTransaction
├── id (UUID)
├── userId (foreign key)
├── type (PURCHASE, CONSUMPTION, REFUND, SUBSCRIPTION)
├── credits (integer)
├── amount (decimal)
├── description
└── createdAt
```

### Service Architecture

```
Controller Layer (auth.controller.v2.ts)
    ↓
Service Layer (auth.service.ts)
    ↓
Data Access Layer (Prisma Client)
    ↓
Database (PostgreSQL)
```

### Middleware Stack

1. **Helmet** - Security headers
2. **CORS** - Cross-origin resource sharing
3. **Rate Limiter** - DDoS protection
4. **Body Parser** - JSON parsing
5. **Express Validator** - Input validation
6. **Error Handler** - Centralized error handling

## Setup Instructions

### Prerequisites

- Node.js >= 18.0.0
- PostgreSQL >= 13
- Redis (optional, for rate limiting)
- Brevo account (for email service)

### 1. Environment Configuration

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Required environment variables:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/contestdraw

# JWT Secrets (generate with: openssl rand -base64 32)
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production

# Email Service (Brevo)
BREVO_API_KEY=your-brevo-api-key-here
BREVO_FROM_EMAIL=noreply@contestdraw.com

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:5173

# Security
BCRYPT_ROUNDS=12
COOKIE_SECRET=your-cookie-secret-key
```

### 2. Database Setup

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# (Optional) Seed database with test data
npm run db:seed
```

### 3. Update Prisma Schema

Add the new token models to `prisma/schema.prisma`:

```prisma
model User {
  // ... existing fields ...
  verificationTokens  EmailVerificationToken[] @relation("UserVerificationTokens")
  passwordResetTokens PasswordResetToken[] @relation("UserPasswordResetTokens")
}

model EmailVerificationToken {
  id        String   @id @default(uuid())
  userId    String
  token     String   @unique
  expiresAt DateTime
  createdAt DateTime @default(now())

  user User @relation("UserVerificationTokens", fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([token])
  @@index([expiresAt])
  @@map("email_verification_tokens")
}

model PasswordResetToken {
  id        String   @id @default(uuid())
  userId    String
  token     String   @unique
  expiresAt DateTime
  used      Boolean  @default(false)
  createdAt DateTime @default(now())

  user User @relation("UserPasswordResetTokens", fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([token])
  @@index([expiresAt])
  @@map("password_reset_tokens")
}
```

### 4. Run Database Migration

```bash
npx prisma migrate dev --name add_auth_tokens
```

### 5. Start Development Server

```bash
# Development mode with hot reload
npm run dev

# Production build
npm run build
npm start
```

The server will start on `http://localhost:3000`.

## Testing

### Run All Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- auth.signup.test.ts

# Run tests in watch mode
npm test -- --watch
```

### Test Coverage

Current test coverage:

- **Unit Tests**: auth.service.ts
- **Integration Tests**: auth API endpoints
- **Security Tests**: SQL injection, XSS, rate limiting

### Manual Testing with cURL

**Register User**:
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

## API Documentation

Complete API documentation is available in:
- `/backend/docs/api/auth-endpoints.md`

Key endpoints:
- `POST /api/auth/register` - User registration
- `POST /api/auth/signup` - Alias for register
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-email` - Email verification
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user

## Security Considerations

### Password Security
- **Hashing**: bcrypt with 12 rounds
- **Requirements**: 8-128 chars, uppercase, lowercase, number, special char
- **Never logged or transmitted** in plain text

### Token Security
- **Access tokens**: 15-minute expiration
- **Refresh tokens**: 7-day expiration
- **JWT signed** with secure secrets
- **Automatic rotation** on refresh

### Rate Limiting
- Registration: 10 requests per 15 min per IP
- Login: 10 requests per 15 min per IP
- Password reset: 5 requests per 15 min per IP

### Input Validation
- Email validation and normalization
- Password complexity requirements
- XSS prevention (input sanitization)
- SQL injection prevention (Prisma ORM)

### HTTPS Enforcement
- Required in production
- Secure cookie flags
- HSTS headers

## Error Handling

### Error Response Format

```json
{
  "status": "error",
  "message": "Human-readable error message",
  "code": "ERROR_CODE",
  "errors": [
    {
      "field": "fieldName",
      "message": "Field-specific error"
    }
  ]
}
```

### Common Error Codes

- `EMAIL_EXISTS` - Email already registered
- `INVALID_CREDENTIALS` - Invalid login credentials
- `INVALID_TOKEN` - Token invalid or expired
- `VALIDATION_ERROR` - Input validation failed
- `USER_NOT_FOUND` - User does not exist

## Monitoring and Logging

### Logging

All authentication events are logged:
- User registration
- Login attempts (success/failure)
- Email verification
- Password resets
- Token refreshes

Logs are stored in `/backend/logs/` with daily rotation.

### Metrics to Monitor

- Registration success rate
- Login success rate
- Email verification rate
- Password reset requests
- Token refresh rate
- API response times
- Error rates by endpoint

## Deployment

### Environment-Specific Configuration

**Development**:
```env
NODE_ENV=development
LOG_LEVEL=debug
```

**Production**:
```env
NODE_ENV=production
LOG_LEVEL=info
FRONTEND_URL=https://app.contestdraw.com
API_URL=https://api.contestdraw.com
```

### Database Migration

```bash
# Run migrations in production
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate
```

### Docker Deployment

```bash
# Build image
docker build -t contestdraw-backend .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e JWT_SECRET="..." \
  contestdraw-backend
```

## Troubleshooting

### Common Issues

**Issue**: "Email sending failed"
**Solution**: Check Brevo API key and configuration

**Issue**: "Database connection failed"
**Solution**: Verify DATABASE_URL and PostgreSQL is running

**Issue**: "JWT verification failed"
**Solution**: Ensure JWT_SECRET matches across restarts

**Issue**: "Rate limit errors"
**Solution**: Implement Redis for distributed rate limiting

### Debug Mode

Enable debug logging:
```env
LOG_LEVEL=debug
NODE_ENV=development
```

## Next Steps

### Pending Implementations

1. **OAuth Integration**
   - Google OAuth
   - Facebook OAuth
   - Apple Sign In

2. **Enhanced Security**
   - Two-factor authentication (2FA)
   - Account lockout after failed attempts
   - IP-based fraud detection

3. **Token Management**
   - Token blacklisting (requires Redis)
   - Device-based token management
   - Session management

4. **Email Features**
   - Email templates with branding
   - Multi-language support
   - Resend verification email endpoint

## Support

For questions or issues:
- Check `/backend/docs/api/auth-endpoints.md` for API details
- Review test files for usage examples
- Check logs in `/backend/logs/` for errors

## Contributors

Backend API implementation completed with:
- Prisma ORM for type-safe database access
- Express.js for REST API
- JWT for authentication
- Brevo for email service
- Jest for testing
