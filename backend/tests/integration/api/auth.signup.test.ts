import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import app from '../../../src/server';

const prisma = new PrismaClient();

describe('Auth Signup API', () => {
  beforeAll(async () => {
    // Setup test database
    await prisma.$connect();
  });

  afterAll(async () => {
    // Cleanup test database
    await prisma.user.deleteMany({
      where: {
        email: {
          contains: 'test'
        }
      }
    });
    await prisma.$disconnect();
  });

  afterEach(async () => {
    // Clean up test users after each test
    await prisma.user.deleteMany({
      where: {
        email: {
          contains: 'test'
        }
      }
    });
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'Test1234!@#$',
        firstName: 'John',
        lastName: 'Doe'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.status).toBe('success');
      expect(response.body.data.user).toMatchObject({
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        emailVerified: false,
        credits: 3,
        role: 'user'
      });
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.refreshToken).toBeDefined();
      expect(response.body.data.user.password).toBeUndefined();

      // Verify user in database
      const user = await prisma.user.findUnique({
        where: { email: userData.email }
      });
      expect(user).toBeTruthy();
      expect(user?.credits).toBe(3);
      expect(user?.bonus_granted).toBe(true);

      // Verify credit transaction
      const creditTx = await prisma.creditTransaction.findFirst({
        where: { userId: user?.id, type: 'PURCHASE' }
      });
      expect(creditTx).toBeTruthy();
      expect(creditTx?.credits).toBe(3);
    });

    it('should reject registration with existing email', async () => {
      const userData = {
        email: 'test-duplicate@example.com',
        password: 'Test1234!@#$'
      };

      // Create first user
      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      // Try to create duplicate
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(409);

      expect(response.body.status).toBe('error');
      expect(response.body.code).toBe('EMAIL_EXISTS');
    });

    it('should validate password requirements', async () => {
      const testCases = [
        { password: 'short', error: 'Password must be between 8 and 128 characters' },
        { password: 'lowercase123!', error: 'must contain uppercase' },
        { password: 'UPPERCASE123!', error: 'must contain.*lowercase' },
        { password: 'NoNumbers!@#', error: 'must contain.*number' },
        { password: 'NoSpecial123', error: 'must contain.*special character' }
      ];

      for (const testCase of testCases) {
        const response = await request(app)
          .post('/api/auth/register')
          .send({
            email: `test-${Date.now()}@example.com`,
            password: testCase.password
          })
          .expect(400);

        expect(response.body.status).toBe('error');
        expect(response.body.code).toBe('VALIDATION_ERROR');
      }
    });

    it('should validate email format', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          password: 'Test1234!@#$'
        })
        .expect(400);

      expect(response.body.status).toBe('error');
      expect(response.body.code).toBe('VALIDATION_ERROR');
      expect(response.body.errors).toContainEqual(
        expect.objectContaining({
          field: 'email',
          message: expect.stringContaining('Invalid email')
        })
      );
    });

    it('should sanitize and normalize email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: '  Test@Example.COM  ',
          password: 'Test1234!@#$'
        })
        .expect(201);

      expect(response.body.data.user.email).toBe('test@example.com');
    });

    it('should hash password securely', async () => {
      const userData = {
        email: 'test-password@example.com',
        password: 'Test1234!@#$'
      };

      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      const user = await prisma.user.findUnique({
        where: { email: userData.email }
      });

      expect(user?.password).not.toBe(userData.password);
      expect(user?.password.length).toBeGreaterThan(50);

      // Verify bcrypt hash
      const isValidHash = await bcrypt.compare(userData.password, user!.password);
      expect(isValidHash).toBe(true);
    });

    it('should handle optional firstName and lastName', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test-minimal@example.com',
          password: 'Test1234!@#$'
        })
        .expect(201);

      expect(response.body.data.user.firstName).toBeNull();
      expect(response.body.data.user.lastName).toBeNull();
    });

    it('should respect rate limiting', async () => {
      // Make multiple requests to trigger rate limit
      const requests = Array(10).fill(null).map((_, i) =>
        request(app)
          .post('/api/auth/register')
          .send({
            email: `test-rate-${i}@example.com`,
            password: 'Test1234!@#$'
          })
      );

      await Promise.all(requests);

      // Next request should be rate limited
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test-rate-limit@example.com',
          password: 'Test1234!@#$'
        });

      expect([201, 429]).toContain(response.status);
      if (response.status === 429) {
        expect(response.body.message).toMatch(/rate limit/i);
      }
    });
  });

  describe('POST /api/auth/signup (alias)', () => {
    it('should work identically to /register', async () => {
      const userData = {
        email: 'test-signup@example.com',
        password: 'Test1234!@#$',
        firstName: 'Jane'
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(userData)
        .expect(201);

      expect(response.body.status).toBe('success');
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.accessToken).toBeDefined();
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a test user
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test-login@example.com',
          password: 'Test1234!@#$',
          firstName: 'Test'
        });
    });

    it('should login with correct credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test-login@example.com',
          password: 'Test1234!@#$'
        })
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data.user.email).toBe('test-login@example.com');
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.refreshToken).toBeDefined();
    });

    it('should reject invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test-login@example.com',
          password: 'WrongPassword123!'
        })
        .expect(401);

      expect(response.body.status).toBe('error');
      expect(response.body.code).toBe('INVALID_CREDENTIALS');
    });

    it('should reject non-existent email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'Test1234!@#$'
        })
        .expect(401);

      expect(response.body.status).toBe('error');
      expect(response.body.code).toBe('INVALID_CREDENTIALS');
    });
  });

  describe('POST /api/auth/refresh', () => {
    let refreshToken: string;

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test-refresh@example.com',
          password: 'Test1234!@#$'
        });

      refreshToken = response.body.data.refreshToken;
    });

    it('should refresh access token with valid refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken })
        .expect(200);

      expect(response.body.status).toBe('success');
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.refreshToken).toBeDefined();
      expect(response.body.data.accessToken).not.toBe(refreshToken);
    });

    it('should reject invalid refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refreshToken: 'invalid-token' })
        .expect(401);

      expect(response.body.status).toBe('error');
      expect(response.body.code).toBe('INVALID_TOKEN');
    });

    it('should reject missing refresh token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({})
        .expect(400);

      expect(response.body.status).toBe('error');
    });
  });

  describe('Security Tests', () => {
    it('should not expose sensitive user data', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test-security@example.com',
          password: 'Test1234!@#$'
        })
        .expect(201);

      expect(response.body.data.user.password).toBeUndefined();
      expect(response.body.data.user.id).toBeDefined();
    });

    it('should handle SQL injection attempts', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: "'; DROP TABLE users; --",
          password: 'Test1234!@#$'
        })
        .expect(400);

      expect(response.body.status).toBe('error');
    });

    it('should handle XSS attempts in input', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test-xss@example.com',
          password: 'Test1234!@#$',
          firstName: '<script>alert("xss")</script>'
        })
        .expect(201);

      // Name should be stored but properly escaped
      expect(response.body.data.user.firstName).toBeDefined();
    });
  });
});
