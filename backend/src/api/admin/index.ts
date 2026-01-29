import { Router } from 'express';
import { authMiddleware, requireAdmin } from '../../middleware/auth.middleware';
import { prisma } from '../../utils/prisma';
import { logger } from '../../utils/logger';

const router = Router();

// All admin routes require authentication and admin role
router.use(authMiddleware);
router.use(requireAdmin);

/**
 * GET /admin/stats/overview
 * Get dashboard overview statistics
 */
router.get('/stats/overview', async (req, res) => {
  try {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

    // Get counts
    const [
      totalUsers,
      totalDraws,
      usersLastMonth,
      drawsLastMonth,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.draw.count(),
      prisma.user.count({ where: { createdAt: { gte: lastMonth } } }),
      prisma.draw.count({ where: { createdAt: { gte: lastMonth } } }),
    ]);

    // Calculate revenue (mock for now - integrate with Stripe)
    const totalRevenue = 28450; // Replace with actual Stripe data
    const revenueLastMonth = 24000;

    // Calculate changes
    const usersChange = totalUsers > 0 
      ? Math.round((usersLastMonth / (totalUsers - usersLastMonth)) * 100) 
      : 0;
    const drawsChange = totalDraws > 0 
      ? Math.round((drawsLastMonth / (totalDraws - drawsLastMonth)) * 100) 
      : 0;
    const revenueChange = revenueLastMonth > 0 
      ? Math.round(((totalRevenue - revenueLastMonth) / revenueLastMonth) * 100) 
      : 0;

    // Conversion rate (mock)
    const conversionRate = 12.5;

    res.json({
      totalUsers,
      totalDraws,
      totalRevenue,
      conversionRate,
      usersChange,
      drawsChange,
      revenueChange,
    });
  } catch (error) {
    logger.error('Failed to get admin stats:', error);
    res.status(500).json({ error: 'Failed to get statistics' });
  }
});

/**
 * GET /admin/activities/recent
 * Get recent activities
 */
router.get('/activities/recent', async (req, res) => {
  try {
    const [recentUsers, recentDraws] = await Promise.all([
      prisma.user.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        select: { id: true, email: true, createdAt: true },
      }),
      prisma.draw.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { email: true } } },
      }),
    ]);

    const activities = [
      ...recentUsers.map((u) => ({
        id: `user-${u.id}`,
        type: 'user' as const,
        description: 'Nouvel utilisateur inscrit',
        timestamp: u.createdAt.toISOString(),
        user: u.email,
      })),
      ...recentDraws.map((d) => ({
        id: `draw-${d.id}`,
        type: 'draw' as const,
        description: `Tirage "${d.title}" ${d.status === 'completed' ? 'terminé' : 'créé'}`,
        timestamp: d.createdAt.toISOString(),
        user: d.user?.email,
      })),
    ]
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 20);

    res.json(activities);
  } catch (error) {
    logger.error('Failed to get recent activities:', error);
    res.status(500).json({ error: 'Failed to get activities' });
  }
});

/**
 * GET /admin/users
 * List all users with pagination
 */
router.get('/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string;
    const filter = req.query.filter as string;

    const where: any = {};
    
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (filter === 'pro') {
      where.subscriptionStatus = 'active';
    } else if (filter === 'free') {
      where.subscriptionStatus = { not: 'active' };
    } else if (filter === 'banned') {
      where.isBanned = true;
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          subscriptionStatus: true,
          createdAt: true,
          lastLoginAt: true,
          isBanned: true,
          _count: { select: { draws: true } },
        },
      }),
      prisma.user.count({ where }),
    ]);

    res.json({
      users: users.map((u) => ({
        ...u,
        plan: u.subscriptionStatus === 'active' ? 'pro' : 'free',
        drawsCount: u._count.draws,
      })),
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    logger.error('Failed to get users:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

/**
 * GET /admin/users/:id
 * Get user details
 */
router.get('/users/:id', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: {
        draws: { take: 10, orderBy: { createdAt: 'desc' } },
        _count: { select: { draws: true } },
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    logger.error('Failed to get user:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

/**
 * POST /admin/users/:id/ban
 * Ban/unban a user
 */
router.post('/users/:id/ban', async (req, res) => {
  try {
    const { banned } = req.body;

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { isBanned: banned },
    });

    logger.info(`User ${user.email} ${banned ? 'banned' : 'unbanned'} by admin`);
    res.json({ success: true, user });
  } catch (error) {
    logger.error('Failed to ban/unban user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

/**
 * GET /admin/draws
 * List all draws with pagination
 */
router.get('/draws', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string;
    const filter = req.query.filter as string;

    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (filter && filter !== 'all') {
      where.status = filter;
    }

    const [draws, total] = await Promise.all([
      prisma.draw.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { email: true } },
          _count: { select: { participants: true, winners: true } },
        },
      }),
      prisma.draw.count({ where }),
    ]);

    res.json({
      draws: draws.map((d) => ({
        id: d.id,
        title: d.title,
        userId: d.userId,
        userEmail: d.user?.email,
        status: d.status,
        participantsCount: d._count.participants,
        winnersCount: d._count.winners,
        platform: d.source || 'csv',
        createdAt: d.createdAt.toISOString(),
        completedAt: d.completedAt?.toISOString(),
      })),
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    logger.error('Failed to get draws:', error);
    res.status(500).json({ error: 'Failed to get draws' });
  }
});

/**
 * GET /admin/draws/:id
 * Get draw details with participants and winners
 */
router.get('/draws/:id', async (req, res) => {
  try {
    const draw = await prisma.draw.findUnique({
      where: { id: req.params.id },
      include: {
        user: { select: { id: true, email: true, firstName: true, lastName: true } },
        participants: { take: 100 },
        winners: true,
      },
    });

    if (!draw) {
      return res.status(404).json({ error: 'Draw not found' });
    }

    res.json(draw);
  } catch (error) {
    logger.error('Failed to get draw:', error);
    res.status(500).json({ error: 'Failed to get draw' });
  }
});

/**
 * GET /admin/payments
 * List all payments (from Stripe)
 */
router.get('/payments', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const filter = req.query.filter as string;

    // TODO: Integrate with Stripe API
    // For now, return mock data
    const payments = [
      { id: '1', stripeId: 'pi_1234567890', userEmail: 'jean@example.com', amount: 2900, currency: 'eur', status: 'succeeded', plan: 'Pro Mensuel', createdAt: new Date().toISOString() },
      { id: '2', stripeId: 'pi_1234567891', userEmail: 'marie@example.com', amount: 9900, currency: 'eur', status: 'succeeded', plan: 'Pro Annuel', createdAt: new Date().toISOString() },
    ];

    res.json({
      payments,
      totalPages: 15,
      total: 300,
      stats: {
        totalRevenue: 28450,
        monthRevenue: 8920,
        avgTransaction: 24.5,
        refundRate: 2.3,
      },
    });
  } catch (error) {
    logger.error('Failed to get payments:', error);
    res.status(500).json({ error: 'Failed to get payments' });
  }
});

export default router;
