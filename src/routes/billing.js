import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import prisma from '../config/db.js';

const router = express.Router();

/**
 * Billing Routes
 * 
 * GET /api/v1/billing - Get all bills for customer
 * GET /api/v1/billing/:customer_number - Get bills by customer number
 * GET /api/v1/billing/:id/detail - Get bill detail
 * 
 * Menampilkan:
 * - Tagihan bulanan berdasarkan penggunaan air
 * - Status pembayaran (pending, paid)
 * - Data dari tabel bills (relasi dengan customers)
 */

// GET /api/v1/billing - Get all bills for current customer
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // Cari bills berdasarkan user/customer
    // NOTE: Ini akan bekerja setelah database schema di-update
    // Untuk sekarang, query ini akan error karena tabel bills belum ada
    const bills = await prisma.bill.findMany({
      where: { customerId: userId },
      include: {
        payments: true
      },
      orderBy: { billingDate: 'desc' }
    });

    res.status(200).json({
      status: 'success',
      data: {
        customer_id: userId,
        bills,
        total_bills: bills.length,
        total_amount: bills.reduce((sum, bill) => sum + (bill.totalAmount || 0), 0)
      }
    });

  } catch (error) {
    console.error('[Billing Error]', error);
    
    // Jika tabel bills belum ada, return informative error
    if (error.code === 'P2025' || error.message.includes('bill')) {
      return res.status(503).json({
        status: 'error',
        message: 'Billing module belum diaktifkan. Silakan update database schema terlebih dahulu.',
        code: 'SCHEMA_NOT_READY'
      });
    }

    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to fetch billing data'
    });
  }
});

// GET /api/v1/billing/:customer_number - Get bills by customer number
router.get('/:customer_number', authMiddleware, async (req, res) => {
  try {
    const { customer_number } = req.params;
    const userId = req.user.id;

    // Validasi bahwa customer_number sesuai dengan customer yang login
    // (sederhana: gunakan userId untuk validasi)

    const bills = await prisma.bill.findMany({
      where: { customerId: userId },
      include: {
        payments: {
          orderBy: { createdAt: 'desc' }
        }
      },
      orderBy: { billingDate: 'desc' }
    });

    if (!bills || bills.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'No bills found for this customer'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        customer_number,
        bills,
        summary: {
          total_bills: bills.length,
          total_amount: bills.reduce((sum, bill) => sum + (bill.totalAmount || 0), 0),
          paid_amount: bills
            .filter(b => b.status === 'paid')
            .reduce((sum, bill) => sum + (bill.totalAmount || 0), 0),
          pending_amount: bills
            .filter(b => b.status === 'pending')
            .reduce((sum, bill) => sum + (bill.totalAmount || 0), 0)
        }
      }
    });

  } catch (error) {
    console.error('[Billing Error]', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to fetch billing data'
    });
  }
});

// GET /api/v1/billing/:id/detail - Get bill detail
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
        payments: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!bill) {
      return res.status(404).json({
        status: 'error',
        message: 'Bill not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: bill
    });

  } catch (error) {
    console.error('[Billing Detail Error]', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to fetch bill detail'
    });
  }
});

export default router;
