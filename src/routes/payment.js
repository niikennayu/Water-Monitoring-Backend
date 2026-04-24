import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import prisma from '../config/db.js';

const router = express.Router();

/**
 * Payment Routes (Simulasi Xendit)
 * 
 * POST /api/v1/payment - Process payment untuk bill
 * PUT /api/v1/payment/:payment_id - Update payment status
 * GET /api/v1/payment/:payment_id - Get payment detail
 * 
 * Simulasi saja, tidak integrasi Xendit asli
 * Update status bill menjadi "paid" setelah pembayaran berhasil
 */

// POST /api/v1/payment - Process payment
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { bill_id, amount, payment_method } = req.body;
    const userId = req.user.id;

    // Validasi input
    if (!bill_id || !amount || !payment_method) {
      return res.status(400).json({
        status: 'error',
        message: 'bill_id, amount, dan payment_method wajib diisi'
      });
    }

    // Cek apakah bill ada dan milik customer yang login
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

    // Validasi amount
    if (amount > bill.totalAmount) {
      return res.status(400).json({
        status: 'error',
        message: `Payment amount cannot exceed bill total (Rp ${bill.totalAmount})`
      });
    }

    // Generate payment reference (simulasi)
    const paymentRef = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Simulasi pembayaran berhasil (dalam kasus nyata, integrasi dengan gateway)
    // Misalkan pembayaran selalu berhasil untuk simulasi
    const payment = await prisma.payment.create({
      data: {
        billId: bill_id,
        amount,
        paymentMethod: payment_method,
        referenceNumber: paymentRef,
        status: 'success', // Simulasi: selalu berhasil
        proofUrl: `https://payment-proof.local/${paymentRef}`,
        description: `Payment for bill ${bill_id} using ${payment_method}`
      }
    });

    // Cek apakah bill sudah fully paid
    const allPayments = await prisma.payment.findMany({
      where: { billId: bill_id }
    });

    const totalPaid = allPayments.reduce((sum, p) => sum + (p.status === 'success' ? p.amount : 0), 0);
    const isFullyPaid = totalPaid >= bill.totalAmount;

    // Update bill status jika fully paid
    if (isFullyPaid) {
      await prisma.bill.update({
        where: { id: bill_id },
        data: { status: 'paid' }
      });
    }

    res.status(201).json({
      status: 'success',
      message: isFullyPaid ? 'Payment successful. Bill marked as paid.' : 'Payment successful.',
      data: {
        payment: {
          id: payment.id,
          reference: payment.referenceNumber,
          amount: payment.amount,
          status: payment.status,
          method: payment.paymentMethod,
          timestamp: payment.createdAt
        },
        bill: {
          id: bill.id,
          status: isFullyPaid ? 'paid' : bill.status,
          totalAmount: bill.totalAmount,
          totalPaid,
          remaining: Math.max(0, bill.totalAmount - totalPaid)
        }
      }
    });

  } catch (error) {
    console.error('[Payment Error]', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to process payment'
    });
  }
});

// GET /api/v1/payment/:payment_id - Get payment detail
router.get('/:payment_id', authMiddleware, async (req, res) => {
  try {
    const { payment_id } = req.params;
    const userId = req.user.id;

    // Cek apakah payment ada dan milik customer yang login
    const payment = await prisma.payment.findFirst({
      where: {
        id: payment_id,
        bill: {
          customerId: userId
        }
      },
      include: {
        bill: true
      }
    });

    if (!payment) {
      return res.status(404).json({
        status: 'error',
        message: 'Payment not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: payment
    });

  } catch (error) {
    console.error('[Payment Detail Error]', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to fetch payment detail'
    });
  }
});

// PUT /api/v1/payment/:payment_id - Update payment status (admin only dalam kasus nyata)
router.put('/:payment_id', authMiddleware, async (req, res) => {
  try {
    const { payment_id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    // Validasi status
    const validStatuses = ['pending', 'success', 'failed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        status: 'error',
        message: `Invalid status. Allowed: ${validStatuses.join(', ')}`
      });
    }

    // Cek apakah payment ada dan milik customer yang login
    const payment = await prisma.payment.findFirst({
      where: {
        id: payment_id,
        bill: {
          customerId: userId
        }
      }
    });

    if (!payment) {
      return res.status(404).json({
        status: 'error',
        message: 'Payment not found'
      });
    }

    // Update payment
    const updated = await prisma.payment.update({
      where: { id: payment_id },
      data: { status }
    });

    // Jika status menjadi success, cek apakah bill fully paid
    if (status === 'success') {
      const bill = await prisma.bill.findUnique({
        where: { id: updated.billId }
      });

      const allPayments = await prisma.payment.findMany({
        where: { billId: updated.billId }
      });

      const totalPaid = allPayments.reduce((sum, p) => sum + (p.status === 'success' ? p.amount : 0), 0);

      if (totalPaid >= bill.totalAmount) {
        await prisma.bill.update({
          where: { id: updated.billId },
          data: { status: 'paid' }
        });
      }
    }

    res.status(200).json({
      status: 'success',
      message: 'Payment status updated',
      data: updated
    });

  } catch (error) {
    console.error('[Payment Update Error]', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to update payment'
    });
  }
});

export default router;
