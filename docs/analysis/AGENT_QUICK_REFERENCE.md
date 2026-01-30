# Agent Quick Reference Guide
**Cleack Codebase**

---

## Critical Information for Agents

### Most Important Files to Know

**Frontend (React/TypeScript):**
- `frontend-web/src/App.tsx` - All routes defined here
- `frontend-web/src/pages/AuthPage.tsx` - Login/signup UI
- `frontend-web/src/store/useAuthStore.ts` - Auth state management
- `frontend-web/src/services/api.ts` - HTTP client with interceptors
- `frontend-web/src/components/Layout.tsx` - Header, footer, navigation
- `frontend-web/src/pages/LandingPage.tsx` - Home page with all links

**Backend (Express/TypeScript):**
- `backend/src/api/auth/auth.controller.ts` - Auth handlers (LOGIN, REGISTER)
- `backend/src/api/auth/auth.routes.ts` - Auth endpoints
- `backend/src/middleware/auth.middleware.ts` - JWT verification
- `backend/src/config/config.ts` - Configuration/secrets
- `backend/src/index.ts` - Server entry point

---

## Quick Task Reference

### Task 1: Add Missing /api/auth/me Endpoint

**Location:** `backend/src/api/auth/auth.controller.ts`

**What to add:**
```typescript
export const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
  // req.user should be set by auth.middleware.ts
  const user = users.get(req.user?.email);
  
  if (!user) {
    throw new AppError('User not found', 404, 'USER_NOT_FOUND');
  }

  res.status(200).json({
    status: 'success',
    data: {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        emailVerified: user.emailVerified
      }
    }
  });
});
```

**Then update auth.routes.ts:**
```typescript
router.get('/me', authMiddleware, authController.getCurrentUser);
```

**Why:** Frontend calls `authApi.getCurrentUser()` to restore user session on app load.

---

### Task 2: Add FAQ Route

**Location:** `frontend-web/src/App.tsx`

**What to add:**
```typescript
import FAQPage from './pages/FAQPage';

// Inside Routes, add:
<Route path="faq" element={<FAQPage />} />
```

**Then update footer link in Layout.tsx:**
```typescript
// Change from: <a href="#" className="...">Documentation</a>
// To:
<Link to="/faq" className="hover:text-primary-600">{t('footer.documentation')}</Link>
```

**Why:** FAQPage component already exists and is complete, just needs routing.

---

### Task 3: Fix Broken Footer Links

**Location:** `frontend-web/src/components/Layout.tsx`

**Option A - Remove them:**
```typescript
// Delete the company and legal sections if they're not ready
```

**Option B - Implement them:**
Create new pages:
- `frontend-web/src/pages/AboutPage.tsx`
- `frontend-web/src/pages/PrivacyPage.tsx`
- `frontend-web/src/pages/TermsPage.tsx`

Then add routes and update footer links.

**Why:** Currently all company/legal links point to `#` (nowhere).

---

### Task 4: Fix User Name Mismatch

**Location:** `backend/src/api/auth/auth.controller.ts` response vs Frontend

**Issue:**
- Backend sends: `firstName`, `lastName`
- Frontend expects: `name`

**Solution Option 1 - Backend side:**
```typescript
// In auth controller, when returning user:
{
  id: user.id,
  email: user.email,
  name: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
  firstName: user.firstName,
  lastName: user.lastName,
  emailVerified: user.emailVerified
}
```

**Solution Option 2 - Frontend side:**
```typescript
// In useAuthStore.ts, after receiving user:
user = {
  ...user,
  name: `${user.firstName} ${user.lastName}`.trim()
}
```

**Why:** Type mismatch causes potential undefined errors.

---

## Code Location Quick Map

### Frontend Routes
| Route | File | Component |
|-------|------|-----------|
| `/` | App.tsx | LandingPage |
| `/auth` | App.tsx | AuthPage |
| `/pricing` | App.tsx | PricingPage |
| `/dashboard` | App.tsx | DashboardPage (protected) |
| `/faq` | App.tsx | FAQPage (MISSING ROUTE) |

### Backend Endpoints
| Method | Endpoint | Handler | File |
|--------|----------|---------|------|
| POST | `/api/auth/register` | register | auth.controller.ts |
| POST | `/api/auth/login` | login | auth.controller.ts |
| GET | `/api/auth/me` | getCurrentUser (MISSING) | auth.controller.ts |
| POST | `/api/auth/verify-email` | verifyEmail | auth.controller.ts |

### State Management (Zustand)
- `useAuthStore.ts` - User auth state (user, isLoading, error, login, register, logout, loadUser)
- `useCreditsStore.ts` - Credit balance
- `useDrawStore.ts` - Draw management

### API Client
- `src/services/api.ts` - Axios instance with:
  - Request interceptor (adds Authorization header)
  - Response interceptor (handles 401, errors)
  - authApi (login, register, logout, getCurrentUser)
  - drawApi, participantsApi, winnersApi, creditsApi, socialApi

---

## Common Patterns

### Frontend Form Pattern (Zod + React Hook Form)
```typescript
const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Min 6 chars')
});

const form = useForm<z.infer<typeof schema>>({
  resolver: zodResolver(schema)
});

form.handleSubmit(async (data) => {
  await authStore.login(data.email, data.password);
  navigate('/dashboard');
});
```

### Backend Controller Pattern
```typescript
export const handler = asyncHandler(async (req: Request, res: Response) => {
  // Validation done by middleware
  // Business logic here
  
  res.status(200).json({
    status: 'success',
    message: 'Success message',
    data: { /* response data */ }
  });
});
```

### Protected Component Pattern
```typescript
const ProtectedRoute = ({ children }) => {
  const { user } = useAuthStore();
  return user ? children : <Navigate to="/auth" />;
};

// Usage:
<Route path="dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
```

---

## Testing Checklist

### Auth Flow Tests
- [ ] Register new user
- [ ] Login with correct credentials
- [ ] Reject login with wrong password
- [ ] Reject login with non-existent email
- [ ] Verify email token
- [ ] Password reset flow
- [ ] Token refresh

### Navigation Tests
- [ ] Landing page links to /auth
- [ ] Landing page links to /pricing
- [ ] FAQ link works (after adding route)
- [ ] Protected routes redirect unauthenticated users
- [ ] User can logout

### API Tests
- [ ] POST /api/auth/register returns 201
- [ ] POST /api/auth/login returns 200 with tokens
- [ ] GET /api/auth/me requires auth header
- [ ] Invalid JWT returns 401

---

## Common Issues to Watch For

1. **localStorage.getItem('auth_token')** - Key name must match exactly
2. **Authorization header format** - Must be `Bearer {token}`, not `Token {token}`
3. **CORS issues** - Check frontend baseURL `/api` matches backend routing
4. **Form validation** - Zod schemas must match backend validation
5. **Protected routes** - Must use ProtectedRoute wrapper
6. **State persistence** - useAuthStore.loadUser() called on app mount

---

## Environment Variables Required

**Backend (.env):**
```
JWT_SECRET=your_secret_key
JWT_REFRESH_SECRET=your_refresh_secret
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=10
```

**Frontend:**
- Uses `/api` relative path (no env var needed if same domain)
- Or configure in `vite.config.ts` if different domain

---

## Running the Application

**Frontend:**
```bash
cd frontend-web
npm install
npm run dev        # Start dev server (Vite)
npm run build      # Build for production
npm run type-check # Check TypeScript
npm run lint       # ESLint check
```

**Backend:**
```bash
cd backend
npm install
npm run dev        # Start with nodemon
npm run build      # Compile TypeScript
npm test           # Run tests
npm run prisma:migrate  # Run database migrations
```

---

## Key Dependencies

**Frontend:**
- React 18.2 + TypeScript
- React Router 6.20 (routing)
- Zustand 4.4.7 (state management)
- Axios 1.6.2 (HTTP)
- React Hook Form 7.48.2 (forms)
- Zod 3.22.4 (validation)
- Framer Motion 10.16.16 (animations)
- TailwindCSS 3.3.6 (styling)

**Backend:**
- Express 4.18.2 (framework)
- TypeScript 5.3.3 (language)
- Prisma 5.8.0 (ORM)
- JWT 9.0.2 (auth tokens)
- bcrypt 5.1.1 (password hashing)
- Jest 29.7.0 (testing)

---

**Last Updated:** 2025-11-06
**Memory Location:** `/docs/analysis/AGENT_QUICK_REFERENCE.md`

Use this alongside CODEBASE_ANALYSIS.md for full context.
