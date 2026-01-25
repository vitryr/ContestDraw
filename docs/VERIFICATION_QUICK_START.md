# Public Verification - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Install Dependencies (1 min)

```bash
# Option A: Use the installation script
./scripts/install-verification-deps.sh

# Option B: Manual installation
cd frontend-web && npm install react-helmet-async
cd ../backend && npm install qrcode @types/qrcode
```

### Step 2: Update Database (1 min)

Add to `backend/prisma/schema.prisma`:

```prisma
model Draw {
  // ... existing fields ...
  verificationHash  String?
  randomSeed        String?
}

model Winner {
  // ... existing fields ...
  selectedAt        DateTime  @default(now())
  certificateUrl    String?
}
```

Run migration:

```bash
cd backend
npx prisma migrate dev --name add_verification_fields
```

### Step 3: Wrap React App (30 seconds)

Update `frontend-web/src/main.tsx`:

```tsx
import { HelmetProvider } from 'react-helmet-async';

// ... existing imports ...

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

### Step 4: Update Draw Execution (2 min)

In `backend/src/services/draw.service.ts`:

```typescript
import { generateDrawHash, generateRandomSeed } from '../utils/hash.util';

async function executeDraw(drawId: string) {
  // ... your existing draw logic ...

  const randomSeed = generateRandomSeed();
  const winners = await selectWinners(/* your logic */);

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

  await prisma.draw.update({
    where: { id: drawId },
    data: {
      verificationHash,
      randomSeed,
      executedAt: new Date(),
      status: 'executed'
    }
  });
}
```

### Step 5: Add Verification Link (30 seconds)

In your results page (`frontend-web/src/pages/ResultsPage.tsx`):

```tsx
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

// In your component
<Link
  to={`/verify/${drawId}`}
  className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
>
  <Shield className="w-5 h-5" />
  View Public Verification
</Link>
```

## ✅ Test It

1. **Start your dev servers**:
   ```bash
   # Terminal 1
   cd backend && npm run dev

   # Terminal 2
   cd frontend-web && npm run dev
   ```

2. **Create a test draw** in your application

3. **Execute the draw**

4. **Visit** `http://localhost:5173/verify/{drawId}`

5. **You should see**:
   - ✅ Draw details
   - ✅ Winners list
   - ✅ Hash verification
   - ✅ Social share buttons
   - ✅ Participant list

## 🎯 What You Get

### Public Verification Page (`/verify/:drawId`)
- Full draw transparency
- Winner certificates
- Hash verification with "Verified ✓" badge
- Social sharing (Twitter, Facebook, LinkedIn, WhatsApp, Telegram)
- QR code for mobile verification
- Embed code for websites
- SEO optimized
- No login required

### API Endpoints (No Auth)
- `GET /api/public/verify/:drawId` - Full verification data
- `POST /api/public/verify-hash/:drawId` - Verify hash
- `GET /api/public/qr/:shortCode` - QR code
- `GET /api/public/short/:shortCode` - Short URL redirect

### Security Features
- SHA-256 cryptographic hashing
- Tamper-evident certificates
- Cryptographically secure random number generation
- Public read-only access
- Privacy-protected (no emails exposed)

## 📁 Files Created

**Backend (4 files)**:
- `/backend/src/utils/hash.util.ts` - Hash generation
- `/backend/src/services/sharing.service.ts` - Short URLs, QR codes
- `/backend/src/api/public/public.controller.ts` - API logic
- `/backend/src/api/public/public.routes.ts` - API routes

**Frontend (4 files)**:
- `/frontend-web/src/pages/PublicVerifyPage.tsx` - Main page
- `/frontend-web/src/pages/EmbedVerifyPage.tsx` - Embed widget
- `/frontend-web/src/components/VerifyHash.tsx` - Hash verification
- `/frontend-web/src/components/SocialShare.tsx` - Social sharing

**Documentation (4 files)**:
- `/docs/PUBLIC_VERIFICATION.md` - Full documentation
- `/docs/INSTALLATION_GUIDE.md` - Detailed setup
- `/docs/VERIFICATION_SUMMARY.md` - Implementation summary
- `/docs/VERIFICATION_QUICK_START.md` - This file

**Other (2 files)**:
- `/scripts/install-verification-deps.sh` - Installation script
- `/tests/verification.test.ts` - Test suite

## 🔧 Common Issues

### "Draw not found"
**Fix**: Ensure draw status is "executed":
```sql
UPDATE draws SET status = 'executed' WHERE id = 'your-draw-id';
```

### "Hash is undefined"
**Fix**: Make sure you're generating the hash during draw execution (Step 4 above)

### "QR code not showing"
**Fix**: Install production QR library:
```bash
npm install qrcode @types/qrcode
```

### Routes not working
**Fix**: Backend routes are already registered in `/backend/src/index.ts` (line 87)

## 📚 Learn More

- **Full Documentation**: `/docs/PUBLIC_VERIFICATION.md`
- **Setup Guide**: `/docs/INSTALLATION_GUIDE.md`
- **Summary**: `/docs/VERIFICATION_SUMMARY.md`
- **Tests**: `/tests/verification.test.ts`

## 🎨 Customization

### Change QR Code Style
Edit `/backend/src/services/sharing.service.ts`:

```typescript
import QRCode from 'qrcode';

export async function generateQRCode(url: string): Promise<string> {
  return await QRCode.toDataURL(url, {
    width: 300,
    margin: 2,
    color: {
      dark: '#1e40af',  // Your brand color
      light: '#ffffff'
    }
  });
}
```

### Change Theme Colors
Edit `/frontend-web/src/pages/PublicVerifyPage.tsx` and change Tailwind classes

### Add More Social Platforms
Edit `/backend/src/services/sharing.service.ts` in `generateSocialShareUrls()`

## 🚀 Production Checklist

Before deploying to production:

- [ ] Install `qrcode` npm package
- [ ] Setup Redis for short codes
- [ ] Configure S3/GCS for certificates
- [ ] Add rate limiting
- [ ] Enable CDN caching
- [ ] Test on mobile devices
- [ ] Verify SEO meta tags
- [ ] Check HTTPS is enabled
- [ ] Monitor performance

## 💡 Pro Tips

1. **Short URLs**: Use format `/v/{code}` instead of full `/verify/{drawId}`
2. **QR Codes**: Print on certificates for easy mobile verification
3. **Social Sharing**: Pre-fill with compelling text to increase shares
4. **Embed Widgets**: Add to contest announcement pages
5. **Analytics**: Track verification views to measure trust impact

## 🎉 You're Done!

Your transparency system is now live. Users can:
- ✅ Verify draw results publicly
- ✅ Check certificate authenticity
- ✅ Share verification links
- ✅ Scan QR codes
- ✅ Embed widgets

**Need help?** Check the full documentation in `/docs/`

---

**Quick Start Guide v1.0**
Last updated: November 5, 2025
