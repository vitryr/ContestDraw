import { PaymentService } from '@/services/payment.service';
import { PrismaClient } from '@prisma/client';
import { TestFactories } from '@tests/utils/test-factories';
import { MockHelpers } from '@tests/utils/mock-helpers';
import Stripe from 'stripe';

jest.mock('stripe');

describe('PaymentService', () => {
  let paymentService: PaymentService;
  let mockPrisma: jest.Mocked<PrismaClient>;
  let mockStripe: jest.Mocked<Stripe>;

  beforeEach(() => {
    mockPrisma = new PrismaClient() as jest.Mocked<PrismaClient>;
    mockStripe = new Stripe('test_key') as jest.Mocked<Stripe>;
    paymentService = new PaymentService(mockPrisma, mockStripe);
  });

  describe('createCheckoutSession', () => {
    it('should create Stripe checkout session for credit purchase', async () => {
      const userId = '123';
      const creditAmount = 10;
      const mockSession = MockHelpers.mockStripeSession({
        url: 'https://checkout.stripe.com/session_123',
      });

      (mockStripe.checkout.sessions.create as jest.Mock).mockResolvedValue(
        mockSession
      );

      const result = await paymentService.createCheckoutSession(
        userId,
        creditAmount
      );

      expect(mockStripe.checkout.sessions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          mode: 'payment',
          line_items: expect.arrayContaining([
            expect.objectContaining({
              price_data: expect.objectContaining({
                currency: 'eur',
                product_data: expect.objectContaining({
                  name: expect.stringContaining('credits'),
                }),
              }),
            }),
          ]),
          metadata: expect.objectContaining({
            userId,
            creditAmount: String(creditAmount),
          }),
        })
      );
      expect(result.url).toBe(mockSession.url);
    });

    it('should calculate correct pricing tiers', async () => {
      const testCases = [
        { credits: 5, expectedPrice: 500 }, // 5 credits = €5
        { credits: 10, expectedPrice: 900 }, // 10% discount
        { credits: 50, expectedPrice: 4000 }, // 20% discount
      ];

      for (const { credits, expectedPrice } of testCases) {
        (mockStripe.checkout.sessions.create as jest.Mock).mockResolvedValue(
          MockHelpers.mockStripeSession()
        );

        await paymentService.createCheckoutSession('123', credits);

        const call = (mockStripe.checkout.sessions.create as jest.Mock).mock
          .calls[0][0];
        expect(call.line_items[0].price_data.unit_amount).toBe(expectedPrice);
      }
    });

    it('should enforce minimum credit purchase', async () => {
      await expect(
        paymentService.createCheckoutSession('123', 0)
      ).rejects.toThrow('Minimum 1 credit required');
    });
  });

  describe('handleWebhook', () => {
    it('should process successful payment webhook', async () => {
      const webhookPayload = {
        type: 'checkout.session.completed',
        data: {
          object: MockHelpers.mockStripeSession({
            metadata: { userId: '123', creditAmount: '10' },
          }),
        },
      };

      const mockCredit = TestFactories.createCredit({
        userId: '123',
        amount: 10,
      });

      (mockStripe.webhooks.constructEvent as jest.Mock).mockReturnValue(
        webhookPayload
      );
      (mockPrisma.credit.create as jest.Mock).mockResolvedValue(mockCredit);

      await paymentService.handleWebhook(
        JSON.stringify(webhookPayload),
        'stripe_signature'
      );

      expect(mockPrisma.credit.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: '123',
          amount: 10,
          type: 'purchase',
        }),
      });
    });

    it('should handle webhook signature verification failure', async () => {
      (mockStripe.webhooks.constructEvent as jest.Mock).mockImplementation(
        () => {
          throw new Error('Invalid signature');
        }
      );

      await expect(
        paymentService.handleWebhook('payload', 'bad_signature')
      ).rejects.toThrow('Invalid signature');
    });

    it('should ignore non-payment events', async () => {
      const webhookPayload = {
        type: 'customer.updated',
        data: { object: {} },
      };

      (mockStripe.webhooks.constructEvent as jest.Mock).mockReturnValue(
        webhookPayload
      );

      await paymentService.handleWebhook(
        JSON.stringify(webhookPayload),
        'signature'
      );

      expect(mockPrisma.credit.create).not.toHaveBeenCalled();
    });
  });

  describe('getCreditBalance', () => {
    it('should calculate total credit balance', async () => {
      const userId = '123';
      const credits = [
        TestFactories.createCredit({ userId, amount: 10, type: 'purchase' }),
        TestFactories.createCredit({ userId, amount: -3, type: 'draw_usage' }),
        TestFactories.createCredit({ userId, amount: 5, type: 'purchase' }),
      ];

      (mockPrisma.credit.findMany as jest.Mock).mockResolvedValue(credits);

      const balance = await paymentService.getCreditBalance(userId);

      expect(balance).toBe(12); // 10 - 3 + 5
    });

    it('should return zero for user with no credits', async () => {
      (mockPrisma.credit.findMany as jest.Mock).mockResolvedValue([]);

      const balance = await paymentService.getCreditBalance('123');

      expect(balance).toBe(0);
    });
  });

  describe('deductCredits', () => {
    it('should deduct credits for draw execution', async () => {
      const userId = '123';
      const drawId = 'draw_123';
      const amount = 1;

      (mockPrisma.credit.create as jest.Mock).mockResolvedValue(
        TestFactories.createCredit({
          userId,
          amount: -amount,
          type: 'draw_usage',
        })
      );

      await paymentService.deductCredits(userId, drawId, amount);

      expect(mockPrisma.credit.create).toHaveBeenCalledWith({
        data: {
          userId,
          amount: -amount,
          type: 'draw_usage',
          metadata: { drawId },
        },
      });
    });

    it('should validate sufficient balance before deduction', async () => {
      const userId = '123';
      (mockPrisma.credit.findMany as jest.Mock).mockResolvedValue([
        TestFactories.createCredit({ amount: 1 }),
      ]);

      await expect(
        paymentService.deductCredits(userId, 'draw_123', 5)
      ).rejects.toThrow('Insufficient credits');
    });
  });
});
