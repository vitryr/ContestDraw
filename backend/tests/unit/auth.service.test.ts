import { AuthService } from '@/services/auth.service';
import { PrismaClient } from '@prisma/client';
import { TestFactories } from '@tests/utils/test-factories';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('AuthService', () => {
  let authService: AuthService;
  let mockPrisma: jest.Mocked<PrismaClient>;

  beforeEach(() => {
    mockPrisma = new PrismaClient() as jest.Mocked<PrismaClient>;
    authService = new AuthService(mockPrisma);
  });

  describe('register', () => {
    it('should create a new user with hashed password', async () => {
      const userData = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'SecurePass123!',
      };

      const mockUser = TestFactories.createUser({
        email: userData.email,
        username: userData.username,
      });

      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed_password');
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (mockPrisma.user.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await authService.register(userData);

      expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: {
          email: userData.email,
          username: userData.username,
          passwordHash: 'hashed_password',
        },
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw error if email already exists', async () => {
      const userData = {
        email: 'existing@example.com',
        username: 'testuser',
        password: 'SecurePass123!',
      };

      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(
        TestFactories.createUser({ email: userData.email })
      );

      await expect(authService.register(userData)).rejects.toThrow(
        'Email already registered'
      );
    });

    it('should validate password strength', async () => {
      const weakPassword = {
        email: 'test@example.com',
        username: 'testuser',
        password: '123',
      };

      await expect(authService.register(weakPassword)).rejects.toThrow(
        'Password must be at least 8 characters'
      );
    });
  });

  describe('login', () => {
    it('should return JWT token on successful login', async () => {
      const credentials = {
        email: 'test@example.com',
        password: 'SecurePass123!',
      };

      const mockUser = TestFactories.createUser({
        email: credentials.email,
        passwordHash: 'hashed_password',
      });

      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue('jwt_token_123');

      const result = await authService.login(credentials);

      expect(result).toHaveProperty('token', 'jwt_token_123');
      expect(result).toHaveProperty('user');
      expect(result.user.email).toBe(credentials.email);
    });

    it('should throw error on invalid credentials', async () => {
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        authService.login({ email: 'test@example.com', password: 'wrong' })
      ).rejects.toThrow('Invalid credentials');
    });

    it('should throw error on incorrect password', async () => {
      const mockUser = TestFactories.createUser();
      (mockPrisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        authService.login({ email: 'test@example.com', password: 'wrong' })
      ).rejects.toThrow('Invalid credentials');
    });
  });

  describe('verifyToken', () => {
    it('should verify and decode valid JWT token', () => {
      const mockDecoded = { userId: '123', email: 'test@example.com' };
      (jwt.verify as jest.Mock).mockReturnValue(mockDecoded);

      const result = authService.verifyToken('valid_token');

      expect(jwt.verify).toHaveBeenCalledWith('valid_token', expect.any(String));
      expect(result).toEqual(mockDecoded);
    });

    it('should throw error on invalid token', () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      expect(() => authService.verifyToken('invalid_token')).toThrow();
    });
  });

  describe('resetPassword', () => {
    it('should update user password', async () => {
      const userId = '123';
      const newPassword = 'NewSecurePass123!';
      const mockUser = TestFactories.createUser({ id: userId });

      (bcrypt.hash as jest.Mock).mockResolvedValue('new_hashed_password');
      (mockPrisma.user.update as jest.Mock).mockResolvedValue(mockUser);

      await authService.resetPassword(userId, newPassword);

      expect(bcrypt.hash).toHaveBeenCalledWith(newPassword, 10);
      expect(mockPrisma.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { passwordHash: 'new_hashed_password' },
      });
    });
  });
});
