import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import prisma from '../config/db.js';

const router = express.Router();

// CREATE PAYMENT
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { bill_id, amount, payment_method } = req.body;
    const userId = req.user.id;

    if (!bill_id || !amount || !payment_method) {
      return res.status(400).json({
        status: 'error',
        message: 'bill_id, amount, dan payment_method wajib diisi'
      });
    }

    if (typeof amount !== 'number') {
      return res.status(400).json({
        status: 'error',
        message: 'Amount harus berupa angka'
      });
    }

    const bill = await prisma.bill.findFirst({
      where: {
        id: bill_id,
        customerId: userId
      }
    });

    if (!bill) {
      return res.status(404).json({
        status: 'error',
        message: 'Bill not found'
      });
    }

    const paymentRef = `PAY-${Date.now()}`;

    const payment = await prisma.payment.create({
      data: {
        billId: bill_id,
        amount,
        paymentMethod: payment_method,
        referenceNumber: paymentRef,
        status: 'paid',
      }
    });

    const payments = await prisma.payment.findMany({
      where: { billId: bill_id }
    });

    const totalPaid = payments.reduce((sum, p) =>
      sum + (p.status === 'paid' ? p.amount : 0), 0);

    if (totalPaid >= bill.totalAmount) {
      await prisma.bill.update({
        where: { id: bill_id },
        data: { status: 'paid' }
      });
    }

    res.success({
      payment,
      totalPaid
    }, 'Payment successful', 201);

  } catch (error) {
    console.error('[Payment Error]', error);
    res.status(500).json({ status: 'error', message: error.message });
  }
});

export default router;