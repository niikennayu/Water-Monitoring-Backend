import prisma from '../config/db.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';

export class PaymentController {

  static createPayment = asyncHandler(async (req, res) => {
    const { billId } = req.body;

    if (!billId) {
      throw new AppError('Bill ID required', 400);
    }

    const bill = await prisma.bill.findUnique({
      where: { id: billId }
    });

    if (!bill) {
      throw new AppError('Bill not found', 404);
    }

    // SIMULASI XENDIT
    const payment = await prisma.payment.create({
      data: {
        billId,
        amount: bill.totalAmount,
        status: 'pending'
      }
    });

    res.success(payment, 'Payment created', 201);
  });

  static handleWebhook = asyncHandler(async (req, res) => {
    const { paymentId, status } = req.body;

    await prisma.payment.update({
      where: { id: paymentId },
      data: { status }
    });

    if (status === 'paid') {
      await prisma.bill.update({
        where: { id: req.body.billId },
        data: { status: 'paid' }
      });
    }

    res.success({}, 'Webhook processed', 200);
  });
}