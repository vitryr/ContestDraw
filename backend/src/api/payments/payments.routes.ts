import { Router } from 'express';
import { paymentsController } from './payments.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

/**
 * Payment routes
 * All routes except webhook require authentication
 */

// Get available products and prices
router.get('/products', paymentsController.getProducts);

// Create checkout session for subscription
router.post('/checkout', authenticate, paymentsController.createCheckoutSession);

// Create checkout session for 48h pass
router.post('/checkout/48h-pass', authenticate, paymentsController.create48hPassSession);

// Get current subscription
router.get('/subscription', authenticate, paymentsController.getSubscription);

// Cancel subscription
router.post('/subscription/cancel', authenticate, paymentsController.cancelSubscription);

// Create billing portal session
router.post('/portal', authenticate, paymentsController.createPortalSession);

// Stripe webhook (no auth required, verified by signature)
router.post('/webhook', paymentsController.handleWebhook);

export default router;
