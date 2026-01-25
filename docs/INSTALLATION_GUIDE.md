# Installation Guide - Public Verification System

## Quick Start

### 1. Install Dependencies

Run the installation script:

```bash
chmod +x scripts/install-verification-deps.sh
./scripts/install-verification-deps.sh
```

Or install manually:

**Frontend:**
```bash
cd frontend-web
npm install react-helmet-async
```

**Backend (recommended for production):**
```bash
cd backend
npm install qrcode @types/qrcode
```

### 2. Update Database Schema

Add these fields to your Prisma schema (`backend/prisma/schema.prisma`):

```prisma
model Draw {
  id                String    @id @default(cuid())
  userId            String
  title             String
  description       String?
  platform          String
  postUrl           String?
  filters           Json      @default("{}")
  winnersCount      Int
  status            String    @default("draft")
  createdAt         DateTime  @default(now())
  executedAt        DateTime?
  verificationHash  String?   // NEW: SHA-256 hash
  randomSeed        String?   // NEW: Cryptographic seed

  user              User      @relation(fields: [userId], references: [id])
  participants      Participant[]
  winners           Winner[]

  @@index([userId])
  @@index([status])
}

model Winner {
  id              String    @id @default(cuid())
  drawId          String
  participantId   String
  position        Int
  selectedAt      DateTime  @default(now()) // NEW: Selection timestamp
  certificateUrl  String?   // NEW: Certificate URL

  draw            Draw      @relation(fields: [drawId], references: [id])
  participant     Participant @relation(fields: [participantId], references: [id])

  @@unique([drawId, participantId])
  @@index([drawId])
}
```

Run migration:

```bash
cd backend
npx prisma migrate dev --name add_verification_fields
npx prisma generate
```

### 3. Update Frontend Main File

Wrap your app with `HelmetProvider` in `frontend-web/src/main.tsx`:

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import './index.css';

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

### 4. Update Draw Execution Logic

Modify your draw execution service to generate hashes:

**File: `backend/src/services/draw.service.ts`**

```typescript
import { generateDrawHash, generateRandomSeed } from '../utils/hash.util';

async function executeDraw(drawId: string) {
  // ... existing draw execution logic ...

  // Generate random seed
  const randomSeed = generateRandomSeed();

  // Select winners using seed (your existing logic)
  const winners = await selectWinners(/* ... */);

  // Generate verification hash
  const verificationHash = generateDrawHash({
    drawId: draw.id,
    timestamp: new Date().toISOString(),
    participants: draw.participants.map(p => ({
      id: p.id,
      name: p.name,
      username: p.username
    })),
    winners: winners.map(w => ({
      id: w.id,
      position: w.position,
      participantId: w.participantId
    })),
    randomSeed,
    filters: draw.filters,
    algorithm: 'Cryptographically Secure PRNG (crypto.randomBytes)'
  });

  // Save hash and seed to database
  await prisma.draw.update({
    where: { id: drawId },
    data: {
      status: 'executed',
      executedAt: new Date(),
      verificationHash,
      randomSeed
    }
  });

  // Generate certificates with hash
  for (const winner of winners) {
    const certificateBuffer = await generateCertificate({
      drawId: draw.id,
      drawTitle: draw.title,
      winnerName: winner.participant.name,
      winnerUsername: winner.participant.username,
      position: winner.position,
      totalParticipants: draw.participants.length,
      executedAt: draw.executedAt.toISOString(),
      verificationHash,
      verificationUrl: `${baseUrl}/verify/${draw.id}`,
      organizerName: draw.user.name
    });

    // Upload certificate (implement your storage logic)
    const certificateUrl = await uploadCertificate(certificateBuffer, draw.id, winner.id);

    await prisma.winner.update({
      where: { id: winner.id },
      data: { certificateUrl }
    });
  }

  return { draw, winners, verificationHash };
}
```

### 5. Add Verification Links to UI

Update your results page to show verification links:

**File: `frontend-web/src/pages/ResultsPage.tsx`**

```tsx
import { Link } from 'react-router-dom';
import { Shield, ExternalLink } from 'lucide-react';

// ... in your component ...

<div className="mt-6">
  <Link
    to={`/verify/${drawId}`}
    className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
  >
    <Shield className="w-5 h-5" />
    View Public Verification
    <ExternalLink className="w-4 h-4" />
  </Link>
  <p className="text-sm text-gray-600 mt-2">
    Share this verification link to prove the authenticity of your draw
  </p>
</div>
```

### 6. Test the Integration

1. **Create a test draw** in your application
2. **Execute the draw** - this should generate a hash
3. **Navigate to** `/verify/{drawId}` - should display verification page
4. **Check features**:
   - ✅ Draw details shown
   - ✅ Winners displayed
   - ✅ Hash verification works
   - ✅ Social sharing buttons functional
   - ✅ QR code displays
   - ✅ Embed code generated

### 7. Environment Variables

Add to your `.env` files:

**Backend (`.env`):**
```env
# Public verification
FRONTEND_URL=http://localhost:5173
CERTIFICATE_STORAGE_URL=https://your-storage.com
```

**Frontend (`.env`):**
```env
VITE_API_URL=http://localhost:3000
```

## Production Setup

### 1. Install QR Code Library

For production, replace placeholder QR code generation:

```bash
cd backend
npm install qrcode @types/qrcode
```

Update `backend/src/services/sharing.service.ts`:

```typescript
import QRCode from 'qrcode';

export async function generateQRCode(url: string): Promise<string> {
  return await QRCode.toDataURL(url, {
    width: 300,
    margin: 2,
    errorCorrectionLevel: 'M',
    color: {
      dark: '#000000',
      light: '#ffffff'
    }
  });
}
```

### 2. Setup Redis for Short Codes

Install Redis client:

```bash
cd backend
npm install ioredis @types/ioredis
```

Update `backend/src/services/sharing.service.ts`:

```typescript
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export async function createShareableLink(
  drawId: string,
  baseUrl: string,
  expiresInDays: number = 90
): Promise<ShareableLink> {
  const shortCode = generateShortCode(drawId);
  const expirySeconds = expiresInDays * 24 * 60 * 60;

  await redis.setex(`short:${shortCode}`, expirySeconds, drawId);

  // ... rest of function
}

export async function resolveShortCode(shortCode: string): Promise<string | null> {
  return await redis.get(`short:${shortCode}`);
}
```

### 3. Setup Certificate Storage (S3/GCS)

Example with AWS S3:

```bash
npm install @aws-sdk/client-s3
```

Create `backend/src/services/storage.service.ts`:

```typescript
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
});

export async function uploadCertificate(
  buffer: Buffer,
  drawId: string,
  winnerId: string
): Promise<string> {
  const key = `certificates/${drawId}/${winnerId}.pdf`;

  await s3.send(new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: 'application/pdf',
    ACL: 'public-read'
  }));

  return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}
```

### 4. Add Rate Limiting

Install rate limiter:

```bash
npm install express-rate-limit
```

Update `backend/src/api/public/public.routes.ts`:

```typescript
import rateLimit from 'express-rate-limit';

const verifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  message: 'Too many verification requests, please try again later'
});

router.get('/verify/:drawId', verifyLimiter, publicController.getDrawVerification);
router.post('/verify-hash/:drawId', verifyLimiter, publicController.verifyHash);
```

### 5. Setup CDN

Configure your CDN (CloudFront, Cloudflare) to cache:
- QR codes: `/api/public/qr/*` (cache for 30 days)
- Verification pages: `/verify/*` (cache for 1 hour)
- Certificates: CDN for S3 bucket

### 6. Monitoring & Analytics

Add analytics to track verification views:

```typescript
// In backend/src/api/public/public.controller.ts

export async function getDrawVerification(req, res, next) {
  // ... existing code ...

  // Log verification view
  await analytics.track({
    event: 'verification_viewed',
    drawId: draw.id,
    ip: req.ip,
    userAgent: req.get('user-agent'),
    timestamp: new Date()
  });

  // ... rest of function
}
```

## Testing

Run tests:

```bash
# Backend tests
cd backend
npm test tests/verification.test.ts

# Frontend tests
cd frontend-web
npm test
```

## Troubleshooting

### Issue: "Draw not found" on verification page

**Solution**: Ensure draw status is "executed" or "completed":

```sql
UPDATE draws SET status = 'executed' WHERE id = 'your-draw-id';
```

### Issue: Hash verification fails

**Solution**: Regenerate hash with correct data structure. Ensure:
- Participants are sorted by ID
- Winners are sorted by position
- All fields match exactly

### Issue: QR code not displaying

**Solution**:
1. Check if `qrcode` npm package is installed
2. Verify QR code endpoint is accessible
3. Check CORS settings allow QR code endpoint

### Issue: Social share buttons not working

**Solution**:
1. Verify URLs are properly encoded
2. Check browser popup blocker settings
3. Test with `window.open` in console

## Security Checklist

- [ ] Rate limiting enabled on public endpoints
- [ ] CORS properly configured
- [ ] Sensitive data (emails) excluded from public responses
- [ ] SSL/TLS enabled (HTTPS)
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (using Prisma ORM)
- [ ] XSS prevention (React auto-escaping)
- [ ] Certificate storage is secure but publicly accessible

## Performance Optimization

1. **Database Indexes**: Ensure indexes on `drawId`, `status`
2. **Caching**: Implement Redis caching for verification data
3. **CDN**: Use CDN for static assets and certificates
4. **Pagination**: Limit participant display (show 20, load more)
5. **Image Optimization**: Optimize QR codes and avatars

## Support

For issues or questions:
1. Check `/docs/PUBLIC_VERIFICATION.md` for detailed documentation
2. Review code comments in implementation files
3. Run test suite: `npm test`
4. Contact development team

---

**Last Updated**: November 5, 2025
