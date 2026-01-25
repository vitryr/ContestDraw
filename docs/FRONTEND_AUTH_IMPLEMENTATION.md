# Frontend Authentication Implementation Guide

## Overview

This document describes the complete frontend authentication implementation for the ContestDraw application, including signup, login, email verification, and password reset flows.

## Architecture

### File Structure

```
frontend-web/src/
├── pages/
│   ├── AuthPageEnhanced.tsx      # Main authentication page (login/signup)
│   └── EmailVerificationPage.tsx # Email verification handler
├── components/
│   ├── PasswordStrengthIndicator.tsx  # Real-time password strength
│   └── LoadingSpinner.tsx             # Loading state component
├── services/
│   └── api.ts                    # API integration layer
├── store/
│   └── useAuthStore.ts          # Zustand state management
├── types/
│   ├── index.ts                 # General types
│   └── auth.ts                  # Auth-specific types
└── utils/
    └── validation.ts            # Validation utilities
```

## Features Implemented

### 1. Enhanced Form Validation

**Location**: `/frontend-web/src/pages/AuthPageEnhanced.tsx`

#### Validation Rules:

**Email:**
- Required field
- Valid email format
- Normalized to lowercase
- Real-time validation on blur

**Password (Signup):**
- Minimum 8 characters, maximum 128 characters
- Must contain:
  - At least one lowercase letter (a-z)
  - At least one uppercase letter (A-Z)
  - At least one number (0-9)
  - At least one special character (@$!%*?&#)
- Real-time validation on change
- Visual strength indicator

**Name (Signup):**
- Minimum 2 characters
- Maximum 100 characters
- Only letters, spaces, hyphens, and apostrophes allowed
- Trimmed and sanitized

**Password Confirmation:**
- Must match password field
- Real-time validation

#### Implementation:

```typescript
const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name must be less than 100 characters')
      .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens and apostrophes'),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address')
      .toLowerCase(),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(128, 'Password must be less than 128 characters')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/\d/, 'Password must contain at least one number')
      .regex(/[@$!%*?&#]/, 'Password must contain at least one special character'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });
```

### 2. Password Strength Indicator

**Location**: `/frontend-web/src/components/PasswordStrengthIndicator.tsx`

#### Features:
- Real-time strength calculation (0-5 scale)
- Visual progress bar with color coding:
  - **Red**: Weak (score 0-1)
  - **Orange**: Fair (score 2)
  - **Yellow**: Good (score 3)
  - **Green**: Strong-Very Strong (score 4-5)
- Checklist of requirements:
  - ✓ At least 8 characters
  - ✓ Uppercase and lowercase letters
  - ✓ At least one number
  - ✓ At least one special character
- Animated transitions

#### Usage:

```tsx
<PasswordStrengthIndicator password={watchPassword} showSuggestions={true} />
```

### 3. Loading States

**Location**: `/frontend-web/src/components/LoadingSpinner.tsx`

#### Features:
- Three sizes: sm, md, lg
- Optional text message
- Full-screen overlay option
- Smooth rotation animation

#### Implementation:

```tsx
{isLoading ? (
  <>
    <LoadingSpinner size="sm" />
    <span>Creating account...</span>
  </>
) : (
  'Create Account'
)}
```

### 4. Error Handling

#### API-Level Error Handling

**Location**: `/frontend-web/src/services/api.ts`

```typescript
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    const message = error.response?.data?.message || 'An error occurred';

    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/auth';
      toast.error('Session expired. Please login again.');
    } else {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);
```

#### Form-Level Error Handling

**Features:**
- Field-specific error messages
- Toast notifications for global errors
- Focus management on error fields
- 409 (Conflict) handling for duplicate emails
- Validation error display from backend

#### Example:

```typescript
try {
  await registerUser(data);
  toast.success('Account created successfully! 🎉');
} catch (error: any) {
  if (error.response?.status === 409) {
    toast.error('This email is already registered. Try logging in instead.');
    registerForm.setError('email', {
      type: 'manual',
      message: 'Email already exists',
    });
  } else {
    toast.error(error.response?.data?.message || 'Registration failed');
  }

  // Focus first error field
  const firstError = Object.keys(registerForm.formState.errors)[0];
  if (firstError) {
    registerForm.setFocus(firstError as any);
  }
}
```

### 5. Success Animations

**Features:**
- Checkmark animation on success
- Fade-in/fade-out transitions
- Success toast messages with custom icons
- Welcome message for new users
- Free credits notification
- Smooth redirect to dashboard

#### Implementation:

```tsx
<AnimatePresence mode="wait">
  {showSuccess ? (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      transition={{ type: 'spring', duration: 0.5 }}
    >
      <CheckCircle2 className="w-12 h-12 text-green-600" />
      <h2>Account Created!</h2>
    </motion.div>
  ) : (
    // Form content
  )}
</AnimatePresence>
```

### 6. Accessibility (a11y)

#### Features Implemented:

**Semantic HTML:**
- Proper `<label>` elements with `htmlFor`
- `<button>` elements with descriptive text
- Tab-based navigation with `role="tab"`

**ARIA Attributes:**
```tsx
<input
  id="register-email"
  type="email"
  aria-invalid={!!errors.email}
  aria-describedby={errors.email ? 'register-email-error' : undefined}
  autoComplete="email"
/>

{errors.email && (
  <p id="register-email-error" role="alert">
    {errors.email.message}
  </p>
)}
```

**Keyboard Navigation:**
- Tab order follows visual flow
- Enter key submits forms
- Escape key closes modals (if applicable)
- Focus management on errors

**Screen Reader Support:**
- `aria-live="polite"` for password strength
- `aria-busy` for loading states
- `role="alert"` for error messages
- Descriptive `aria-label` for icon buttons

**Focus Management:**
```typescript
// Focus first error field
const firstError = Object.keys(formState.errors)[0];
if (firstError) {
  setFocus(firstError as any);
}
```

### 7. Password Visibility Toggle

**Features:**
- Eye/EyeOff icon toggle
- Independent toggles for password and confirm password
- Accessible labels
- Smooth transitions

```tsx
<button
  type="button"
  onClick={() => setShowPassword(!showPassword)}
  aria-label={showPassword ? 'Hide password' : 'Show password'}
>
  {showPassword ? <EyeOff /> : <Eye />}
</button>
```

### 8. Email Verification Flow

**Location**: `/frontend-web/src/pages/EmailVerificationPage.tsx`

#### Flow:
1. User receives verification email with token
2. User clicks link: `/verify-email?token=xxx`
3. Page automatically verifies token
4. Shows success/error state
5. Redirects to login after 3 seconds

#### Features:
- Automatic verification on page load
- Loading state during verification
- Success animation
- Error handling with retry option
- Countdown timer for redirect

### 9. TypeScript Types

**Location**: `/frontend-web/src/types/auth.ts`

```typescript
export interface AuthUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  emailVerified: boolean;
  credits?: number;
  role?: string;
  createdAt?: string;
}

export interface LoginResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
  expiresIn: string | number;
}

export interface RegisterResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
  expiresIn: string | number;
}
```

## API Integration

### Authentication Endpoints

**POST /api/auth/register**
```typescript
authApi.register({
  email: string;
  password: string;
  name: string; // Split into firstName/lastName internally
})
```

**POST /api/auth/login**
```typescript
authApi.login(email: string, password: string)
```

**POST /api/auth/verify-email**
```typescript
authApi.verifyEmail(token: string)
```

**POST /api/auth/refresh**
```typescript
authApi.refreshToken(refreshToken: string)
```

### Token Management

Tokens are stored in localStorage:
- `auth_token`: Access token (JWT)
- `refresh_token`: Refresh token for token renewal

Access token is automatically added to all API requests via interceptor:

```typescript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## State Management

**Location**: `/frontend-web/src/store/useAuthStore.ts`

Using Zustand for global auth state:

```typescript
interface AuthStore {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
  clearError: () => void;
}
```

## Testing

**Location**: `/tests/frontend/auth-signup.test.tsx`

### Test Coverage:

1. **Form Validation**
   - Empty field validation
   - Email format validation
   - Password strength requirements
   - Password confirmation matching

2. **Password Visibility**
   - Toggle functionality
   - Type attribute changes

3. **Form Submission**
   - Successful registration
   - Duplicate email handling
   - Network error handling

4. **Loading States**
   - Loading indicator display
   - Form disable during submission

5. **Accessibility**
   - ARIA labels presence
   - Tab navigation order
   - Screen reader announcements

6. **Form Reset**
   - Clearing on tab switch

### Running Tests:

```bash
cd frontend-web
npm run test
```

## Usage

### Replace Existing Auth Page

In your router configuration:

```typescript
import AuthPageEnhanced from './pages/AuthPageEnhanced';
import EmailVerificationPage from './pages/EmailVerificationPage';

// Routes
<Route path="/auth" element={<AuthPageEnhanced />} />
<Route path="/verify-email" element={<EmailVerificationPage />} />
```

### Migration from Old Auth Page

1. Backup current `AuthPage.tsx`
2. Rename `AuthPageEnhanced.tsx` to `AuthPage.tsx`
3. Update imports if necessary
4. Test all flows thoroughly

## Configuration

### Environment Variables

```env
VITE_API_URL=http://localhost:3000
```

### Tailwind CSS Classes

The component uses these custom classes (ensure they're defined):
- `input-field`: Styled input elements
- `btn-primary`: Primary button style
- `btn-secondary`: Secondary button style
- `card`: Card container style

## Best Practices

1. **Security:**
   - Never log passwords
   - Store tokens securely
   - Validate on both client and server
   - Use HTTPS in production

2. **User Experience:**
   - Show clear error messages
   - Provide feedback for all actions
   - Use animations sparingly
   - Ensure fast load times

3. **Accessibility:**
   - Test with screen readers
   - Support keyboard navigation
   - Provide sufficient color contrast
   - Use semantic HTML

4. **Performance:**
   - Debounce validation checks
   - Lazy load heavy components
   - Optimize re-renders with React.memo
   - Use code splitting

## Troubleshooting

### Common Issues:

**Issue**: Form validation not working
- Check Zod schema is properly configured
- Verify react-hook-form resolver is installed
- Ensure form mode is set correctly

**Issue**: API calls failing
- Check baseURL in axios config
- Verify backend is running
- Check CORS configuration
- Inspect network tab for errors

**Issue**: Tokens not persisting
- Check localStorage is enabled
- Verify token key names match
- Check for localStorage quota errors

**Issue**: Password strength not showing
- Verify password field is being watched
- Check component is imported correctly
- Ensure Framer Motion is installed

## Future Enhancements

- [ ] Social authentication (Google, Facebook)
- [ ] Two-factor authentication (2FA)
- [ ] Password reset flow UI
- [ ] Remember me functionality
- [ ] Biometric authentication (mobile)
- [ ] Session management dashboard
- [ ] Login activity tracking
- [ ] Passwordless authentication (magic links)

## Support

For issues or questions:
- Create an issue in the repository
- Contact the development team
- Check the main README.md for general setup

---

**Last Updated**: November 6, 2025
**Version**: 2.0.0
**Author**: ContestDraw Development Team
