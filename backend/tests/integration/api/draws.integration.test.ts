import request from 'supertest';
import { app } from '@/app';
import { PrismaClient } from '@prisma/client';

describe('Draws API Integration', () => {
  let prisma: PrismaClient;
  let authToken: string;
  let userId: string;

  beforeAll(async () => {
    prisma = new PrismaClient();
    await prisma.$connect();

    // Create test user and get auth token
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'drawuser@example.com',
        username: 'drawuser',
        password: 'SecurePass123!',
      });

    authToken = registerResponse.body.token;
    userId = registerResponse.body.user.id;

    // Add credits to user
    await prisma.credit.create({
      data: {
        userId,
        amount: 10,
        type: 'purchase',
      },
    });
  });

  afterAll(async () => {
    await prisma.winner.deleteMany();
    await prisma.participant.deleteMany();
    await prisma.draw.deleteMany();
    await prisma.credit.deleteMany();
    await prisma.user.deleteMany();
    await prisma.$disconnect();
  });

  afterEach(async () => {
    await prisma.winner.deleteMany();
    await prisma.participant.deleteMany();
    await prisma.draw.deleteMany({
      where: { userId },
    });
  });

  describe('POST /api/draws', () => {
    it('should create a new draw with valid data', async () => {
      const drawData = {
        title: 'Summer Giveaway 2024',
        description: 'Win amazing prizes!',
        instagramPostUrl: 'https://www.instagram.com/p/ABC123/',
        winnerCount: 3,
        filters: {
          requireLike: true,
          requireComment: true,
          requireFollow: false,
        },
      };

      const response = await request(app)
        .post('/api/draws')
        .set('Authorization', `Bearer ${authToken}`)
        .send(drawData)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(drawData.title);
      expect(response.body.status).toBe('pending');
      expect(response.body.userId).toBe(userId);
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .post('/api/draws')
        .send({
          title: 'Test Draw',
          instagramPostUrl: 'https://instagram.com/p/TEST/',
          winnerCount: 1,
        })
        .expect(401);

      expect(response.body.error).toContain('Authentication required');
    });

    it('should validate Instagram URL', async () => {
      const response = await request(app)
        .post('/api/draws')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'Test Draw',
          instagramPostUrl: 'invalid-url',
          winnerCount: 1,
        })
        .expect(400);

      expect(response.body.error).toContain('Invalid Instagram post URL');
    });
  });

  describe('GET /api/draws', () => {
    beforeEach(async () => {
      await prisma.draw.createMany({
        data: [
          {
            userId,
            title: 'Draw 1',
            instagramPostUrl: 'https://instagram.com/p/ABC/',
            winnerCount: 1,
            status: 'pending',
          },
          {
            userId,
            title: 'Draw 2',
            instagramPostUrl: 'https://instagram.com/p/DEF/',
            winnerCount: 2,
            status: 'completed',
          },
        ],
      });
    });

    it('should list user draws', async () => {
      const response = await request(app)
        .get('/api/draws')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('title');
      expect(response.body[0]).toHaveProperty('status');
    });

    it('should filter draws by status', async () => {
      const response = await request(app)
        .get('/api/draws?status=completed')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].status).toBe('completed');
    });
  });

  describe('POST /api/draws/:id/execute', () => {
    let drawId: string;

    beforeEach(async () => {
      const draw = await prisma.draw.create({
        data: {
          userId,
          title: 'Test Draw',
          instagramPostUrl: 'https://instagram.com/p/TEST123/',
          winnerCount: 2,
          status: 'pending',
          filters: {
            requireLike: true,
            requireComment: false,
          },
        },
      });
      drawId = draw.id;

      // Add participants
      await prisma.participant.createMany({
        data: Array.from({ length: 20 }, (_, i) => ({
          drawId,
          instagramUsername: `user_${i}`,
          instagramUserId: `${1000 + i}`,
          hasLiked: true,
          hasCommented: i % 2 === 0,
          followsAccount: true,
          isEligible: true,
        })),
      });
    });

    it('should execute draw and select winners', async () => {
      const response = await request(app)
        .post(`/api/draws/${drawId}/execute`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.winners).toHaveLength(2);
      expect(response.body.status).toBe('completed');

      // Verify winners in database
      const winners = await prisma.winner.findMany({ where: { drawId } });
      expect(winners).toHaveLength(2);
    });

    it('should deduct credit on execution', async () => {
      const balanceBefore = await prisma.credit.findMany({ where: { userId } });
      const sumBefore = balanceBefore.reduce((sum, c) => sum + c.amount, 0);

      await request(app)
        .post(`/api/draws/${drawId}/execute`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const balanceAfter = await prisma.credit.findMany({ where: { userId } });
      const sumAfter = balanceAfter.reduce((sum, c) => sum + c.amount, 0);

      expect(sumAfter).toBe(sumBefore - 1);
    });

    it('should reject execution with insufficient credits', async () => {
      // Remove all credits
      await prisma.credit.deleteMany({ where: { userId } });

      const response = await request(app)
        .post(`/api/draws/${drawId}/execute`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);

      expect(response.body.error).toContain('Insufficient credits');
    });

    it('should prevent re-execution of completed draw', async () => {
      await request(app)
        .post(`/api/draws/${drawId}/execute`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const response = await request(app)
        .post(`/api/draws/${drawId}/execute`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);

      expect(response.body.error).toContain('already been executed');
    });
  });

  describe('GET /api/draws/:id', () => {
    let drawId: string;

    beforeEach(async () => {
      const draw = await prisma.draw.create({
        data: {
          userId,
          title: 'Detail Test Draw',
          instagramPostUrl: 'https://instagram.com/p/DETAIL/',
          winnerCount: 1,
          status: 'pending',
        },
      });
      drawId = draw.id;
    });

    it('should retrieve draw details', async () => {
      const response = await request(app)
        .get(`/api/draws/${drawId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.id).toBe(drawId);
      expect(response.body).toHaveProperty('title');
      expect(response.body).toHaveProperty('participants');
      expect(response.body).toHaveProperty('winners');
    });

    it('should return 404 for non-existent draw', async () => {
      const response = await request(app)
        .get('/api/draws/non-existent-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.error).toContain('not found');
    });
  });
});
