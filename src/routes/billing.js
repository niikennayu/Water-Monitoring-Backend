import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import prisma from '../config/db.js';

const router = express.Router();

// GET ALL BILLS
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const bills = await prisma.bill.findMany({
      where: { customerId: userId },
      include: {
        payments: true
      },
      orderBy: { billingDate: 'desc' }
    });

    res.success({
      customer_id: userId,
      bills,
      total_bills: bills.length,
      total_amount: bills.reduce((sum, bill) => sum + (bill.totalAmount || 0), 0)
    }, 'Bills fetched successfully');

  } catch (error) {
    console.error('[Billing Error]', error);

    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to fetch billing data'
    });
  }
});

// GET BY CUSTOMER NUMBER
router.get('/:customer_number', authMiddleware, async (req, res) => {
  try {
    const { customer_number } = req.params;
    const userId = req.user.id;

    const bills = await prisma.bill.findMany({
      where: { customerId: userId },
      include: {
        payments: {
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { billingDate: 'desc' }
    });

    if (!bills.length) {
      return res.status(404).json({
        status: 'error',
        message: 'No bills found'
      });
    }

    res.success({
      customer_number,
      bills,
      summary: {
        total_bills: bills.length,
        total_amount: bills.reduce((sum, b) => sum + (b.totalAmount || 0), 0),
        paid_amount: bills
          .filter(b => b.status === 'paid')
          .reduce((sum, b) => sum + (b.totalAmount || 0), 0),
        pending_amount: bills
          .filter(b => b.status === 'pending')
          .reduce((sum, b) => sum + (b.totalAmount || 0), 0)
      }
    }, 'Bills fetched');

  } catch (error) {
    console.error('[Billing Error]', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

// GET DETAIL
router.get('/:id/detail', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const bill = await prisma.bill.findFirst({
      where: {
        id,
        customerId: userId
      },
      include: {
        payments: true
      }
    });

    if (!bill) {
      return res.status(404).json({
        status: 'error',
        message: 'Bill not found'
      });
    }

    res.success(bill, 'Bill detail fetched');

  } catch (error) {
    console.error('[Billing Detail Error]', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

export default router;