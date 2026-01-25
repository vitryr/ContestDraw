# Public Verification & Transparency System

## Overview

This document describes the public verification and transparency features implemented in ContestDraw to ensure fair and verifiable draw results.

## Features Implemented

### 1. Hash Verification System (`backend/src/utils/hash.util.ts`)

**Purpose**: Generate and verify cryptographic hashes of draw results to ensure integrity and prevent tampering.

**Key Functions**:
- `generateDrawHash(data)` - Creates SHA-256 hash of draw results
- `verifyDrawHash(data, expectedHash)` - Verifies hash integrity
- `generateVerificationCode(hash)` - Creates short 12-character verification code
- `generateRandomSeed()` - Generates cryptographically secure random seed

**Algorithm Details**:
- **Hashing**: SHA-256 (256-bit cryptographic hash)
- **Random Number Generation**: crypto.randomBytes (cryptographically secure PRNG)
- **Data Normalization**: Deterministic JSON serialization with sorted keys

**Example Hash Data**:
```typescript
{
  drawId: "draw_123",
  timestamp: "2025-11-05T10:00:00.000Z",
  participants: [/* sorted by ID */],
  winners: [/* sorted by position */],
  randomSeed: "a1b2c3...",
  filters: { /* applied filters */ },
  algorithm: "Cryptographically Secure PRNG"
}
```

### 2. Shareable Links Service (`backend/src/services/sharing.service.ts`)

**Purpose**: Generate short URLs, QR codes, and embed codes for easy verification sharing.

**Key Features**:

#### Short URLs
- Format: `contestdraw.com/v/{shortCode}` (8-character code)
- Deterministic generation based on draw ID
- Optional expiration support
- In-memory storage (use Redis in production)

#### QR Code Generation
- SVG format for scalability
- Encodes verification URL
- Embeddable in certificates
- **Note**: Currently placeholder, use `qrcode` npm package in production

#### Social Media Sharing
- Twitter, Facebook, LinkedIn integration
- WhatsApp and Telegram support
- Pre-formatted share text
- URL encoding handled automatically

#### Embed Widget
- Configurable width, height, theme
- Optional participant list
- Iframe-based embedding
- Responsive design

**Example Usage**:
```typescript
const link = await createShareableLink(drawId, baseUrl);
// Returns: { shortCode, fullUrl, qrCodeUrl, drawId }

const socialUrls = generateSocialShareUrls(drawId, title, baseUrl);
// Returns: { twitter, facebook, linkedin, whatsapp, telegram }

const embedCode = generateEmbedCode({ drawId, width: 600, height: 400 });
// Returns: HTML iframe code
```

### 3. Enhanced Certificate Service (`backend/src/services/certificate.service.ts`)

**Enhancements to Existing Service**:
- ✅ SHA-256 hash generation (already implemented)
- ✅ Timestamp with timezone
- ✅ Algorithm disclosure
- ⚠️ QR code embedding (needs `qrcode` npm package)
- ⚠️ Verification URL on certificate

**Certificate Contents**:
1. Winner information (name, username, position)
2. Draw details (title, date, participant count)
3. Verification hash (SHA-256, formatted)
4. Verification code (12-character)
5. QR code (for mobile verification)
6. Algorithm details (PRNG + SHA-256)
7. Timestamp with UTC timezone
8. "Verified ✓" badge

### 4. Public Verification API (`backend/src/api/public/`)

**Endpoints** (No Authentication Required):

#### `GET /api/public/verify/:drawId`
Returns complete verification data for a draw.

**Response**:
```json
{
  "draw": {
    "id": "draw_123",
    "title": "Contest Draw",
    "participantsCount": 150,
    "winnersCount": 3,
    "filters": {...},
    "organizer": { "name": "Organizer Name" }
  },
  "winners": [...],
  "participants": [...],
  "verification": {
    "hash": "a1b2c3...",
    "verificationCode": "A1B2C3D4E5F6",
    "algorithm": "Cryptographically Secure PRNG",
    "verified": true
  },
  "sharing": {
    "verificationUrl": "https://...",
    "shortUrl": "https://contestdraw.com/v/abc123",
    "qrCodeUrl": "https://.../qr/abc123",
    "socialUrls": {...}
  }
}
```

#### `POST /api/public/verify-hash/:drawId`
Verify a certificate hash.

**Request**:
```json
{ "hash": "a1b2c3..." }
```

**Response**:
```json
{
  "verified": true,
  "message": "Hash verification successful",
  "expectedHash": "a1b2c3...",
  "providedHash": "a1b2c3..."
}
```

#### `GET /api/public/qr/:shortCode`
Generate QR code image (SVG).

#### `GET /api/public/short/:shortCode`
Redirect short code to verification page.

#### `GET /api/public/embed-code/:drawId`
Get HTML embed code.

#### `GET /api/public/stats`
Public platform statistics.

### 5. Frontend Components

#### `PublicVerifyPage.tsx` (`/verify/:drawId`)
Full verification page with:
- Draw details and organizer info
- Winners list with certificates
- Participant list (collapsible)
- Hash verification widget
- Social sharing buttons
- SEO optimization (meta tags, structured data)
- No authentication required

**SEO Features**:
- Dynamic meta tags (title, description)
- Open Graph tags (Facebook, LinkedIn)
- Twitter Card support
- Canonical URLs
- Structured data (Schema.org Event)

#### `VerifyHash.tsx` Component
Interactive hash verification with:
- Hash display (formatted in 4-character blocks)
- Verification code (12-character)
- Hash input field for verification
- Copy to clipboard functionality
- Verification result (success/failure)
- Algorithm information
- "How it works" explanation

#### `SocialShare.tsx` Component
Social sharing interface with:
- Quick copy link button
- Social media buttons (5 platforms)
- QR code dialog
- Embed code dialog
- Pre-formatted share text

#### `EmbedVerifyPage.tsx` (`/embed/:drawId`)
Lightweight embeddable widget:
- Minimal design (fits iframe)
- Dark/light theme support
- Optional participant list
- Winners display
- Verification code
- "View Full" link
- Responsive layout

### 6. Database Schema Requirements

Add these fields to your Prisma schema:

```prisma
model Draw {
  // ... existing fields ...
  verificationHash  String?   // SHA-256 hash
  randomSeed        String?   // Cryptographic seed used
}

model Winner {
  // ... existing fields ...
  certificateUrl    String?   // URL to certificate PDF
  selectedAt        DateTime  @default(now())
}
```

## Integration Guide

### Backend Integration

1. **Register public routes** in your Express app:

```typescript
// In your main app.ts or index.ts
import publicRoutes from './api/public/public.routes';

app.use('/api/public', publicRoutes);
```

2. **Generate hash when executing draw**:

```typescript
import { generateDrawHash, generateRandomSeed } from './utils/hash.util';

// When executing draw
const randomSeed = generateRandomSeed();
const hash = generateDrawHash({
  drawId: draw.id,
  timestamp: new Date().toISOString(),
  participants: /* ... */,
  winners: /* ... */,
  randomSeed,
  filters: draw.filters,
  algorithm: 'Cryptographically Secure PRNG'
});

// Save to database
await prisma.draw.update({
  where: { id: draw.id },
  data: {
    verificationHash: hash,
    randomSeed: randomSeed
  }
});
```

3. **Generate certificates with hash**:

```typescript
import { generateCertificate } from './services/certificate.service';

const certificateBuffer = await generateCertificate({
  drawId: draw.id,
  drawTitle: draw.title,
  winnerName: winner.name,
  winnerUsername: winner.username,
  position: winner.position,
  totalParticipants: draw.participantsCount,
  executedAt: draw.executedAt.toISOString(),
  verificationHash: draw.verificationHash,
  verificationUrl: `${baseUrl}/verify/${draw.id}`,
  organizerName: organizer.name
});
```

### Frontend Integration

1. **Install dependencies**:

```bash
npm install react-helmet-async
```

2. **Wrap app with HelmetProvider** in `main.tsx`:

```tsx
import { HelmetProvider } from 'react-helmet-async';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
```

3. **Add verification link to ResultsPage**:

```tsx
// In ResultsPage.tsx
<Link to={`/verify/${drawId}`}>
  View Public Verification
</Link>
```

## Production Recommendations

### 1. QR Code Library
Install and use a proper QR code library:

```bash
npm install qrcode
```

Update `sharing.service.ts`:

```typescript
import QRCode from 'qrcode';

export async function generateQRCode(url: string): Promise<string> {
  return await QRCode.toDataURL(url, {
    width: 300,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#ffffff'
    }
  });
}
```

### 2. Redis for Short Codes
Replace in-memory storage with Redis:

```typescript
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export async function createShareableLink(drawId: string, baseUrl: string) {
  const shortCode = generateShortCode(drawId);
  await redis.setex(`short:${shortCode}`, 86400 * 30, drawId); // 30 days
  // ...
}
```

### 3. Certificate Storage
Store certificates in cloud storage (S3, GCS):

```typescript
import { uploadToS3 } from './storage.service';

const certificateUrl = await uploadToS3(
  certificateBuffer,
  `certificates/${drawId}-${winnerId}.pdf`
);

await prisma.winner.update({
  where: { id: winnerId },
  data: { certificateUrl }
});
```

### 4. Rate Limiting
Add rate limiting to public endpoints:

```typescript
import rateLimit from 'express-rate-limit';

const verifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

router.get('/verify/:drawId', verifyLimiter, publicController.getDrawVerification);
```

### 5. CDN for Static Assets
- Host QR codes on CDN
- Cache verification pages
- Use CDN for certificate PDFs

## Security Considerations

1. **Hash Integrity**: SHA-256 hashes are cryptographically secure and tamper-evident
2. **Random Seed**: crypto.randomBytes provides cryptographic-quality randomness
3. **No Authentication**: Public endpoints are read-only and rate-limited
4. **Privacy**: Email addresses and sensitive data are excluded from public responses
5. **Immutability**: Once generated, hashes cannot be modified without detection

## Testing

### Manual Testing

1. **Execute a draw** with the system
2. **Navigate to** `/verify/{drawId}`
3. **Verify features**:
   - Draw details displayed correctly
   - Winners and participants shown
   - Hash verification works
   - Social sharing buttons functional
   - QR code displays
   - Embed code generated

### Automated Testing

Create tests for:
- Hash generation determinism
- Hash verification accuracy
- Short code generation
- API endpoint responses
- Component rendering

## URLs Structure

- Full verification: `https://contestdraw.com/verify/{drawId}`
- Short URL: `https://contestdraw.com/v/{shortCode}`
- Embed widget: `https://contestdraw.com/embed/{drawId}`
- QR code: `https://contestdraw.com/api/public/qr/{shortCode}`

## Future Enhancements

1. **Blockchain Integration**: Store hashes on blockchain for permanent proof
2. **PDF Verification Tool**: Allow users to upload PDFs and verify hashes
3. **Email Verification**: Send verification links to participants
4. **Multi-language Support**: Translate verification pages
5. **Audit Log**: Track all verification attempts
6. **Analytics**: Monitor verification page views
7. **Custom Branding**: Allow organizers to customize verification pages

## Support

For issues or questions about the verification system:
1. Check this documentation
2. Review code comments in implementation files
3. Contact development team

---

**Last Updated**: November 5, 2025
**Version**: 1.0.0
