/**
 * Test Data Fixtures
 * Centralized test data for consistent testing
 */

export const TEST_USERS = {
  valid: {
    name: 'John Doe',
    email: 'john.doe@test.com',
    password: 'SecurePass123!',
  },
  duplicate: {
    name: 'Duplicate User',
    email: 'duplicate@test.com',
    password: 'Password123!',
  },
  existing: {
    email: 'existing@test.com',
    password: 'ExistingPass123!',
  },
};

export const INVALID_CREDENTIALS = {
  weakPassword: {
    name: 'Test User',
    email: 'test@example.com',
    password: '123',
  },
  invalidEmail: {
    name: 'Test User',
    email: 'invalid-email',
    password: 'ValidPass123!',
  },
  missingName: {
    name: '',
    email: 'test@example.com',
    password: 'ValidPass123!',
  },
  shortName: {
    name: 'A',
    email: 'test@example.com',
    password: 'ValidPass123!',
  },
  mismatchedPasswords: {
    password: 'Password123!',
    confirmPassword: 'DifferentPass123!',
  },
};

export const VALIDATION_MESSAGES = {
  email: {
    invalid: 'Invalid email address',
    required: 'Email is required',
  },
  password: {
    tooShort: 'Password must be at least 6 characters',
    required: 'Password is required',
    mismatch: "Passwords don't match",
  },
  name: {
    tooShort: 'Name must be at least 2 characters',
    required: 'Name is required',
  },
};

export const API_ENDPOINTS = {
  register: '/api/auth/register',
  login: '/api/auth/login',
  logout: '/api/auth/logout',
  profile: '/api/users/profile',
};

export const ROUTES = {
  home: '/',
  auth: '/auth',
  dashboard: '/dashboard',
  profile: '/profile',
  pricing: '/pricing',
  faq: '/faq',
};

export const TIMEOUTS = {
  short: 2000,
  medium: 5000,
  long: 10000,
  api: 15000,
};

export const ERROR_MESSAGES = {
  duplicateEmail: 'Email already exists',
  invalidCredentials: 'Invalid email or password',
  serverError: 'Internal server error',
  networkError: 'Network error',
};

export const SUCCESS_MESSAGES = {
  accountCreated: 'Account created successfully!',
  loginSuccess: 'Welcome back!',
  logoutSuccess: 'Logged out successfully',
};

export const LANDING_PAGE_SECTIONS = {
  hero: {
    id: 'hero',
    title: /Contest Draws|Fair contest draws/i,
  },
  features: {
    id: 'features',
    title: /Powerful Features|Everything you need/i,
  },
  howItWorks: {
    id: 'how-it-works',
    title: /How It Works|Simple process/i,
  },
  pricing: {
    id: 'pricing',
    title: /Pricing|Choose your plan/i,
  },
  testimonials: {
    id: 'testimonials',
    title: /Testimonials|What our users say/i,
  },
  faq: {
    id: 'faq',
    title: /FAQ|Frequently Asked Questions/i,
  },
};

export const NAVIGATION_LINKS = [
  { text: /Features/i, href: '#features' },
  { text: /How it works/i, href: '#how-it-works' },
  { text: /Pricing/i, href: '/pricing' },
  { text: /FAQ/i, href: '/faq' },
];

export const EXTERNAL_LINKS = {
  social: [
    'twitter.com',
    'facebook.com',
    'instagram.com',
    'linkedin.com',
  ],
  docs: ['github.com', 'docs.'],
};

export const BROWSER_VIEWPORTS = {
  mobile: {
    width: 375,
    height: 667,
  },
  tablet: {
    width: 768,
    height: 1024,
  },
  desktop: {
    width: 1920,
    height: 1080,
  },
};

export const TEST_CONFIG = {
  baseURL: process.env.BASE_URL || 'http://localhost:3000',
  apiBaseURL: process.env.API_BASE_URL || 'http://localhost:3000',
  timeout: 30000,
  retries: 2,
};
