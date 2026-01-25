# Contest Draw API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication

Most endpoints require authentication via JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Response Format

### Success Response
```json
{
  "status": "success",
  "data": { ... },
  "message": "Optional message"
}
```

### Error Response
```json
{
  "status": "error",
  "message": "Error description",
  "code": "ERROR_CODE",
  "errors": [
    {
      "field": "fieldName",
      "message": "Validation error"
    }
  ]
}
```

## Endpoints

### Authentication

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

#### Verify Email
```http
POST /auth/verify-email
Content-Type: application/json

{
  "token": "verification_token_here"
}
```

#### Forgot Password
```http
POST /auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

#### Reset Password
```http
POST /auth/reset-password
Content-Type: application/json

{
  "token": "reset_token_here",
  "password": "NewSecurePass123!"
}
```

### Users

#### Get Current User
```http
GET /users/me
Authorization: Bearer <token>
```

#### Update Profile
```http
PATCH /users/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Doe",
  "language": "en",
  "timezone": "UTC"
}
```

#### Delete Account
```http
DELETE /users/me
Authorization: Bearer <token>
```

#### Get Statistics
```http
GET /users/stats
Authorization: Bearer <token>
```

### Credits

#### Get Balance
```http
GET /credits/balance
Authorization: Bearer <token>
```

#### Purchase Credits
```http
POST /credits/purchase
Authorization: Bearer <token>
Content-Type: application/json

{
  "packageId": "pro",
  "paymentMethod": "card"
}
```

#### Get Transaction History
```http
GET /credits/history?page=1&limit=20&type=PURCHASE
Authorization: Bearer <token>
```

#### Create Subscription
```http
POST /credits/subscription
Authorization: Bearer <token>
Content-Type: application/json

{
  "planId": "pro",
  "paymentMethod": "card"
}
```

#### Cancel Subscription
```http
DELETE /credits/subscription
Authorization: Bearer <token>
```

### Draws

#### Create Draw
```http
POST /draws
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Instagram Giveaway",
  "description": "Monthly contest",
  "numberOfWinners": 3,
  "allowDuplicates": false,
  "participants": [
    {
      "name": "John Doe",
      "identifier": "@johndoe",
      "source": "INSTAGRAM"
    }
  ]
}
```

#### List Draws
```http
GET /draws?page=1&limit=20&status=COMPLETED&sortBy=createdAt&sortOrder=desc
Authorization: Bearer <token>
```

#### Get Draw Details
```http
GET /draws/:id
Authorization: Bearer <token>
```

#### Delete Draw
```http
DELETE /draws/:id
Authorization: Bearer <token>
```

#### Execute Draw
```http
POST /draws/:id/execute
Authorization: Bearer <token>
Content-Type: application/json

{
  "algorithm": "crypto-random",
  "seed": "optional_seed"
}
```

#### Generate Certificate
```http
GET /draws/:id/certificate
Authorization: Bearer <token>
```

#### Export Results
```http
POST /draws/:id/export
Authorization: Bearer <token>
Content-Type: application/json

{
  "format": "csv"
}
```

### Social Platforms

#### Connect Platform
```http
POST /social/connect/:platform
Authorization: Bearer <token>

# Platform: instagram, facebook, twitter, tiktok, youtube
```

#### Disconnect Platform
```http
DELETE /social/disconnect/:platform
Authorization: Bearer <token>
```

#### List Connected Accounts
```http
GET /social/accounts
Authorization: Bearer <token>
```

#### Fetch Participants
```http
POST /social/fetch-participants
Authorization: Bearer <token>
Content-Type: application/json

{
  "url": "https://instagram.com/p/ABC123",
  "platform": "instagram",
  "type": "comments"
}
```

## Error Codes

| Code | Description |
|------|-------------|
| `EMAIL_EXISTS` | Email already registered |
| `INVALID_CREDENTIALS` | Invalid email or password |
| `TOKEN_EXPIRED` | JWT token expired |
| `INVALID_TOKEN` | Invalid JWT token |
| `VALIDATION_ERROR` | Request validation failed |
| `DRAW_NOT_FOUND` | Draw not found |
| `ACCESS_DENIED` | Access denied to resource |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `PLATFORM_NOT_CONNECTED` | Social platform not connected |

## Rate Limits

| Endpoint | Limit |
|----------|-------|
| Authentication | 5 requests / 15 minutes |
| Email operations | 10 requests / hour |
| Draw execution | 20 requests / hour |
| General API | 100 requests / 15 minutes |
