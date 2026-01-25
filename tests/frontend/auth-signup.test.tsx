import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import AuthPageEnhanced from '../../frontend-web/src/pages/AuthPageEnhanced';
import { authApi } from '../../frontend-web/src/services/api';

// Mock the API module
vi.mock('../../frontend-web/src/services/api', () => ({
  authApi: {
    register: vi.fn(),
    login: vi.fn(),
  },
}));

// Mock the router
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock toast
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock zustand store
vi.mock('../../frontend-web/src/store/useAuthStore', () => ({
  useAuthStore: () => ({
    login: vi.fn(),
    register: vi.fn().mockImplementation(async (data) => {
      return authApi.register(data);
    }),
    isLoading: false,
  }),
}));

describe('Signup Form Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderAuthPage = () => {
    return render(
      <BrowserRouter>
        <AuthPageEnhanced />
      </BrowserRouter>
    );
  };

  describe('Form Validation', () => {
    it('should show validation errors for empty fields', async () => {
      renderAuthPage();

      // Switch to signup tab
      const signupTab = screen.getByRole('tab', { name: /sign up/i });
      await userEvent.click(signupTab);

      // Try to submit empty form
      const submitButton = screen.getByRole('button', { name: /create account/i });
      await userEvent.click(submitButton);

      // Check for validation errors
      await waitFor(() => {
        expect(screen.getByText(/name is required/i)).toBeInTheDocument();
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
        expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
      });
    });

    it('should validate email format', async () => {
      renderAuthPage();

      // Switch to signup
      await userEvent.click(screen.getByRole('tab', { name: /sign up/i }));

      // Enter invalid email
      const emailInput = screen.getByLabelText(/email address/i);
      await userEvent.type(emailInput, 'invalid-email');
      await userEvent.tab(); // Trigger blur validation

      await waitFor(() => {
        expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
      });
    });

    it('should validate password strength requirements', async () => {
      renderAuthPage();

      await userEvent.click(screen.getByRole('tab', { name: /sign up/i }));

      const passwordInput = screen.getByLabelText(/^password$/i);

      // Test weak password
      await userEvent.type(passwordInput, 'weak');

      await waitFor(() => {
        expect(screen.getByText(/password must be at least 8 characters/i)).toBeInTheDocument();
      });

      // Clear and test password without uppercase
      await userEvent.clear(passwordInput);
      await userEvent.type(passwordInput, 'password123!');

      await waitFor(() => {
        expect(screen.getByText(/password must contain at least one uppercase letter/i)).toBeInTheDocument();
      });
    });

    it('should validate password confirmation match', async () => {
      renderAuthPage();

      await userEvent.click(screen.getByRole('tab', { name: /sign up/i }));

      const passwordInput = screen.getByLabelText(/^password$/i);
      const confirmInput = screen.getByLabelText(/confirm password/i);

      await userEvent.type(passwordInput, 'ValidPass123!');
      await userEvent.type(confirmInput, 'DifferentPass123!');
      await userEvent.tab();

      await waitFor(() => {
        expect(screen.getByText(/passwords don't match/i)).toBeInTheDocument();
      });
    });

    it('should show password strength indicator', async () => {
      renderAuthPage();

      await userEvent.click(screen.getByRole('tab', { name: /sign up/i }));

      const passwordInput = screen.getByLabelText(/^password$/i);

      // Type a strong password
      await userEvent.type(passwordInput, 'StrongPass123!');

      await waitFor(() => {
        expect(screen.getByText(/strong|very strong/i)).toBeInTheDocument();
      });
    });
  });

  describe('Password Visibility Toggle', () => {
    it('should toggle password visibility', async () => {
      renderAuthPage();

      await userEvent.click(screen.getByRole('tab', { name: /sign up/i }));

      const passwordInput = screen.getByLabelText(/^password$/i) as HTMLInputElement;
      const toggleButton = screen.getAllByLabelText(/show password/i)[0];

      // Initially should be password type
      expect(passwordInput.type).toBe('password');

      // Click to show
      await userEvent.click(toggleButton);
      expect(passwordInput.type).toBe('text');

      // Click to hide
      await userEvent.click(toggleButton);
      expect(passwordInput.type).toBe('password');
    });
  });

  describe('Form Submission', () => {
    it('should successfully submit valid signup form', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        emailVerified: false,
        credits: 3,
      };

      (authApi.register as any).mockResolvedValue({
        user: mockUser,
        accessToken: 'mock-token',
        refreshToken: 'mock-refresh-token',
        expiresIn: 3600,
      });

      renderAuthPage();

      await userEvent.click(screen.getByRole('tab', { name: /sign up/i }));

      // Fill form with valid data
      await userEvent.type(screen.getByLabelText(/full name/i), 'John Doe');
      await userEvent.type(screen.getByLabelText(/email address/i), 'test@example.com');
      await userEvent.type(screen.getByLabelText(/^password$/i), 'ValidPass123!');
      await userEvent.type(screen.getByLabelText(/confirm password/i), 'ValidPass123!');

      // Submit form
      const submitButton = screen.getByRole('button', { name: /create account/i });
      await userEvent.click(submitButton);

      // Wait for API call
      await waitFor(() => {
        expect(authApi.register).toHaveBeenCalledWith({
          name: 'John Doe',
          email: 'test@example.com',
          password: 'ValidPass123!',
        });
      });
    });

    it('should handle duplicate email error', async () => {
      (authApi.register as any).mockRejectedValue({
        response: {
          status: 409,
          data: {
            message: 'Email already registered',
          },
        },
      });

      renderAuthPage();

      await userEvent.click(screen.getByRole('tab', { name: /sign up/i }));

      // Fill form
      await userEvent.type(screen.getByLabelText(/full name/i), 'John Doe');
      await userEvent.type(screen.getByLabelText(/email address/i), 'existing@example.com');
      await userEvent.type(screen.getByLabelText(/^password$/i), 'ValidPass123!');
      await userEvent.type(screen.getByLabelText(/confirm password/i), 'ValidPass123!');

      // Submit
      await userEvent.click(screen.getByRole('button', { name: /create account/i }));

      await waitFor(() => {
        expect(screen.getByText(/email already exists/i)).toBeInTheDocument();
      });
    });

    it('should handle network errors gracefully', async () => {
      (authApi.register as any).mockRejectedValue({
        message: 'Network Error',
      });

      renderAuthPage();

      await userEvent.click(screen.getByRole('tab', { name: /sign up/i }));

      // Fill and submit form
      await userEvent.type(screen.getByLabelText(/full name/i), 'John Doe');
      await userEvent.type(screen.getByLabelText(/email address/i), 'test@example.com');
      await userEvent.type(screen.getByLabelText(/^password$/i), 'ValidPass123!');
      await userEvent.type(screen.getByLabelText(/confirm password/i), 'ValidPass123!');

      await userEvent.click(screen.getByRole('button', { name: /create account/i }));

      // Should show error message
      await waitFor(() => {
        expect(authApi.register).toHaveBeenCalled();
      });
    });
  });

  describe('Loading States', () => {
    it('should show loading state during submission', async () => {
      let resolveRegister: any;
      (authApi.register as any).mockImplementation(
        () => new Promise((resolve) => (resolveRegister = resolve))
      );

      renderAuthPage();

      await userEvent.click(screen.getByRole('tab', { name: /sign up/i }));

      // Fill form
      await userEvent.type(screen.getByLabelText(/full name/i), 'John Doe');
      await userEvent.type(screen.getByLabelText(/email address/i), 'test@example.com');
      await userEvent.type(screen.getByLabelText(/^password$/i), 'ValidPass123!');
      await userEvent.type(screen.getByLabelText(/confirm password/i), 'ValidPass123!');

      // Submit
      await userEvent.click(screen.getByRole('button', { name: /create account/i }));

      // Check loading state
      await waitFor(() => {
        expect(screen.getByText(/creating account/i)).toBeInTheDocument();
      });

      // Resolve promise
      resolveRegister({
        user: { id: '123', email: 'test@example.com' },
        accessToken: 'token',
      });
    });

    it('should disable form during submission', async () => {
      let resolveRegister: any;
      (authApi.register as any).mockImplementation(
        () => new Promise((resolve) => (resolveRegister = resolve))
      );

      renderAuthPage();

      await userEvent.click(screen.getByRole('tab', { name: /sign up/i }));

      // Fill form
      await userEvent.type(screen.getByLabelText(/full name/i), 'John Doe');
      await userEvent.type(screen.getByLabelText(/email address/i), 'test@example.com');
      await userEvent.type(screen.getByLabelText(/^password$/i), 'ValidPass123!');
      await userEvent.type(screen.getByLabelText(/confirm password/i), 'ValidPass123!');

      const submitButton = screen.getByRole('button', { name: /create account/i });
      await userEvent.click(submitButton);

      // Button should be disabled
      await waitFor(() => {
        expect(submitButton).toBeDisabled();
      });

      resolveRegister({
        user: { id: '123', email: 'test@example.com' },
        accessToken: 'token',
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      renderAuthPage();

      // Check for proper labels
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });

    it('should have proper tab navigation', async () => {
      renderAuthPage();

      await userEvent.click(screen.getByRole('tab', { name: /sign up/i }));

      const nameInput = screen.getByLabelText(/full name/i);
      const emailInput = screen.getByLabelText(/email address/i);
      const passwordInput = screen.getByLabelText(/^password$/i);

      // Tab through form
      nameInput.focus();
      await userEvent.tab();
      expect(emailInput).toHaveFocus();

      await userEvent.tab();
      expect(passwordInput).toHaveFocus();
    });

    it('should announce errors to screen readers', async () => {
      renderAuthPage();

      await userEvent.click(screen.getByRole('tab', { name: /sign up/i }));

      const emailInput = screen.getByLabelText(/email address/i);
      await userEvent.type(emailInput, 'invalid');
      await userEvent.tab();

      await waitFor(() => {
        const error = screen.getByText(/please enter a valid email address/i);
        expect(error).toHaveAttribute('role', 'alert');
      });
    });
  });

  describe('Form Reset', () => {
    it('should reset form when switching between login and signup', async () => {
      renderAuthPage();

      // Fill signup form
      await userEvent.click(screen.getByRole('tab', { name: /sign up/i }));
      await userEvent.type(screen.getByLabelText(/full name/i), 'John Doe');
      await userEvent.type(screen.getByLabelText(/email address/i), 'test@example.com');

      // Switch to login
      await userEvent.click(screen.getByRole('tab', { name: /sign in/i }));

      // Switch back to signup
      await userEvent.click(screen.getByRole('tab', { name: /sign up/i }));

      // Form should be empty
      const nameInput = screen.getByLabelText(/full name/i) as HTMLInputElement;
      expect(nameInput.value).toBe('');
    });
  });
});
