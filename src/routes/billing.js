import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { BillingController } from '../controllers/BillingController.js';

const router = express.Router();

/**
 * Billing Routes
 */

// GET /api/v1/billing/all - Admin only
router.get('/all', authMiddleware, BillingController.getAllBills);

// GET /api/v1/billing/my-bills - Customer's own bills
router.get('/my-bills', authMiddleware, BillingController.getMyBills);

// POST /api/v1/billing/generate - Generate new bill
router.post('/generate', authMiddleware, BillingController.generateBill);

export default router;