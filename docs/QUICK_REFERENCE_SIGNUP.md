# Quick Reference: Signup Workflow

## 🚀 Quick Start (5 minutes)

```bash
# 1. Navigate to frontend
cd frontend-web

# 2. Start dev server
npm run dev

# 3. Open browser
# http://localhost:5173/auth

# 4. Test signup flow
# Click "Sign Up" tab
# Fill form with valid data
# Submit and watch the magic happen! ✨
```

## 📁 Key Files

```
Implementation Files:
├── src/pages/AuthPageEnhanced.tsx          # Main auth page (NEW)
├── src/pages/EmailVerificationPage.tsx    # Email verify (NEW)
├── src/components/PasswordStrengthIndicator.tsx  # Password UI (NEW)
├── src/components/LoadingSpinner.tsx       # Loading state (NEW)
├── src/types/auth.ts                       # Auth types (NEW)
├── src/utils/validation.ts                 # Validation utils (NEW)
├── src/services/api.ts                     # API layer (ENHANCED)
└── src/App.tsx                             # Router (UPDATED)

Test Files:
└── tests/frontend/auth-signup.test.tsx     # Test suite (NEW)

Documentation:
├── docs/FRONTEND_AUTH_IMPLEMENTATION.md    # Technical guide
├── docs/SIGNUP_WORKFLOW_COMPLETE.md        # User guide
├── docs/IMPLEMENTATION_SUMMARY_SIGNUP.md   # Summary
└── docs/QUICK_REFERENCE_SIGNUP.md          # This file
```

## 🎯 Common Tasks

### Run Tests
```bash
npm run test                      # Run all tests
npm run test -- --watch           # Watch mode
npm run test -- --coverage        # Coverage report
npm run test auth-signup.test    # Specific file
```

### Build & Deploy
```bash
npm run build                     # Production build
npm run preview                   # Preview build
npm run lint                      # Check linting
npm run typecheck                 # Check types
```

### Debug
```bash
# Check API connection
curl http://localhost:3000/api/health

# Check localStorage
localStorage.getItem('auth_token')

# Clear tokens
localStorage.removeItem('auth_token')
localStorage.removeItem('refresh_token')
```

## 🔧 Configuration Quick Edit

### Change Password Rules
```typescript
// src/pages/AuthPageEnhanced.tsx (line 28)
password: z.string()
  .min(8)  // ← Change minimum length
  .max(128)
  .regex(/[a-z]/)
  .regex(/[A-Z]/)
  .regex(/\d/)
  .regex(/[@$!%*?&#]/)
```

### Customize Validation Messages
```typescript
// src/pages/AuthPageEnhanced.tsx (lines 16-35)
name: z.string()
  .min(2, 'Your custom message here')  // ← Edit message
  .max(100, 'Another custom message')
```

### Change Toast Duration
```typescript
// src/pages/AuthPageEnhanced.tsx (line 48)
toast.success('Welcome back!', {
  duration: 2000,  // ← Change duration (ms)
  icon: '👋',
});
```

### Adjust Redirect Delay
```typescript
// src/pages/AuthPageEnhanced.tsx (line 52)
setTimeout(() => {
  navigate('/dashboard');
}, 1000);  // ← Change delay (ms)
```

## 🎨 Component Usage

### LoadingSpinner
```tsx
import LoadingSpinner from '../components/LoadingSpinner';

// Small inline
<LoadingSpinner size="sm" />

// With text
<LoadingSpinner size="md" text="Processing..." />

// Full screen overlay
<LoadingSpinner size="lg" text="Loading..." fullScreen />
```

### PasswordStrengthIndicator
```tsx
import PasswordStrengthIndicator from '../components/PasswordStrengthIndicator';

// With suggestions
<PasswordStrengthIndicator
  password={watchPassword}
  showSuggestions={true}
/>

// Without suggestions
<PasswordStrengthIndicator
  password={watchPassword}
  showSuggestions={false}
/>
```

## 🔍 Debugging Common Issues

### Validation Not Working
```typescript
// Check form mode
const form = useForm({
  resolver: zodResolver(schema),
  mode: 'onChange'  // ← Should be onChange or onBlur
});
```

### API Calls Failing
```typescript
// Check baseURL
// src/services/api.ts (line 6)
baseURL: '/api',  // ← Should match backend

// Check CORS in backend
// backend/src/index.ts
app.use(cors({
  origin: 'http://localhost:5173'  // ← Frontend URL
}));
```

### Tokens Not Persisting
```javascript
// Check localStorage in browser console
localStorage.setItem('test', 'value');
localStorage.getItem('test');  // Should return 'value'

// Check API interceptor
// src/services/api.ts (lines 13-22)
```

### Tests Failing
```bash
# Install missing dependencies
npm install -D vitest @testing-library/react @testing-library/user-event

# Clear cache
npm run test -- --clearCache

# Check imports
# All test files should import from correct paths
```

## 📊 Validation Rules Quick Ref

| Field | Rules | Pattern |
|-------|-------|---------|
| Name | 2-100 chars, letters/spaces/hyphens | `/^[a-zA-Z\s'-]+$/` |
| Email | Valid email format | Zod email validator |
| Password | 8-128 chars, mixed case, number, special | Multiple regex |
| Confirm | Must match password | Zod refine |

## 🎯 Password Strength Scoring

```
Score 0-1: Weak (Red)
  - Less than 8 characters
  - Missing requirements

Score 2: Fair (Orange)
  - 8+ characters
  - Some requirements met

Score 3: Good (Yellow)
  - 8+ characters
  - Most requirements met

Score 4-5: Strong/Very Strong (Green)
  - 12+ characters
  - All requirements met
```

## 🚨 Error Codes Quick Ref

| Code | Meaning | Handler Location |
|------|---------|------------------|
| 400 | Validation error | Field-level + toast |
| 401 | Unauthorized | Auto-logout + redirect |
| 409 | Duplicate email | Field error + toast |
| 422 | Invalid data | Field-level errors |
| 500 | Server error | Toast notification |

## 🔐 API Endpoints

```typescript
POST /api/auth/register
Body: { email, password, firstName, lastName }
Response: { user, accessToken, refreshToken, expiresIn }

POST /api/auth/login
Body: { email, password }
Response: { user, accessToken, refreshToken, expiresIn }

POST /api/auth/verify-email
Body: { token }
Response: { message }

POST /api/auth/refresh
Body: { refreshToken }
Response: { accessToken, refreshToken, expiresIn }

GET /api/auth/me
Headers: { Authorization: Bearer <token> }
Response: { user }
```

## 🎨 Tailwind Classes Used

```css
/* Forms */
.input-field        /* Styled input elements */
.btn-primary        /* Primary button */
.btn-secondary      /* Secondary button */
.card               /* Card container */

/* Colors */
.text-primary-600   /* Primary text color */
.bg-primary-50      /* Light primary background */
.text-red-600       /* Error text */
.text-green-600     /* Success text */

/* State Classes */
.disabled:opacity-50
.hover:text-primary-700
.focus:ring-primary-500
```

## 📱 Keyboard Shortcuts

```
Tab         Navigate forward
Shift+Tab   Navigate backward
Enter       Submit form
Escape      Close modals (if any)
Space       Toggle checkboxes/radios
```

## 🧪 Test Data

### Valid Test Users
```typescript
// For manual testing
{
  name: "John Doe",
  email: "john@example.com",
  password: "SecurePass123!"
}

{
  name: "Jane Smith",
  email: "jane@example.com",
  password: "StrongPwd456@"
}
```

### Invalid Test Cases
```typescript
// Weak password
{ password: "weak" }

// Invalid email
{ email: "notanemail" }

// Short name
{ name: "A" }

// Mismatched passwords
{
  password: "Pass123!",
  confirmPassword: "Different123!"
}
```

## 🔗 Important URLs

```
Development:
  Frontend: http://localhost:5173
  Backend:  http://localhost:3000
  API Docs: http://localhost:3000/api-docs

Routes:
  Auth:     /auth
  Verify:   /verify-email?token=xxx
  Dashboard: /dashboard
```

## 📞 Getting Help

1. **Check Documentation**
   - `/docs/FRONTEND_AUTH_IMPLEMENTATION.md` - Technical details
   - `/docs/SIGNUP_WORKFLOW_COMPLETE.md` - User flows
   - `/docs/IMPLEMENTATION_SUMMARY_SIGNUP.md` - Overview

2. **Check Tests**
   - `/tests/frontend/auth-signup.test.tsx` - Usage examples

3. **Console Logs**
   - Browser DevTools → Console
   - Check Network tab for API calls
   - Check localStorage for tokens

4. **Common Commands**
   ```bash
   npm run dev          # Start server
   npm run test         # Run tests
   npm run build        # Build for production
   npm run lint         # Check code quality
   ```

## 🎉 Quick Wins

### Add Your Custom Welcome Message
```typescript
// src/pages/AuthPageEnhanced.tsx (line 67)
toast.success('Your custom welcome message! 🎉', {
  duration: 3000,
});
```

### Change Welcome Credits Amount
```typescript
// src/services/api.ts (line 88)
credits: data.data.user.credits || 3  // ← Change default
```

### Add Custom Validation Rule
```typescript
// src/pages/AuthPageEnhanced.tsx
.refine((data) => yourCustomCheck(data), {
  message: "Your custom error message",
  path: ['fieldName'],
})
```

### Customize Password Strength Colors
```typescript
// src/components/PasswordStrengthIndicator.tsx (line 44)
className={`h-full transition-colors ${
  strength.score <= 1 ? 'bg-red-600'    // ← Change colors
  : strength.score === 2 ? 'bg-orange-600'
  : strength.score === 3 ? 'bg-yellow-600'
  : 'bg-green-600'
}`}
```

## ⚡ Performance Tips

```bash
# Use production build for testing performance
npm run build && npm run preview

# Analyze bundle size
npm run build -- --stats

# Check lighthouse score
# DevTools → Lighthouse → Run audit

# Monitor network tab
# Ensure API calls are fast (<200ms)
```

## 🎯 Success Checklist

```
Before Going Live:
□ All tests passing (npm run test)
□ Types checking (npm run typecheck)
□ Lint passing (npm run lint)
□ Build successful (npm run build)
□ Manual testing complete
□ Accessibility tested
□ Mobile responsive checked
□ Error scenarios tested
□ Performance acceptable
□ Documentation reviewed
```

---

**Quick Start**: Copy this file to your local workspace for instant reference!

**Pro Tip**: Keep this file open while developing for quick answers.

**Last Updated**: November 6, 2025
