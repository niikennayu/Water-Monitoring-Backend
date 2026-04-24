import prisma from '../config/db.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';

export class BillingController {

  // Generate tagihan
  static generateBill = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const usage = await prisma.waterUsage.aggregate({
      where: { userId },
      _sum: { cumulative: true }
    });

    const totalUsage = usage._sum.cumulative || 0;
    const pricePerLiter = 0.01;

    const totalAmount = totalUsage * pricePerLiter;

    const bill = await prisma.bill.create({
      data: {
        userId,
        totalAmount,
        status: 'pending'
      }
    });

    res.success(bill, 'Bill generated', 201);
  });

  // Ambil semua tagihan
  static getBills = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const bills = await prisma.bill.findMany({
      where: { userId }
    });

    res.success(bills, 'Bills fetched', 200);
  });
}