import prisma from '../config/db.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { PaymentService } from '../services/PaymentService.js';

export class PaymentController {

  /**
   * Create Xendit Invoice for a Bill
   */
  static createPayment = asyncHandler(async (req, res) => {
    const { billId } = req.body;

    if (!billId) {
      throw new AppError('Bill ID is required', 400);
    }

    const bill = await PaymentService.createInvoice(billId);

    res.success({
      billId: bill.id,
      billNumber: bill.billNumber,
      paymentUrl: bill.paymentUrl,
      externalId: bill.externalId,
      status: bill.status
    }, 'Payment invoice created successfully', 201);
  });

  /**
   * Xendit Webhook Callback
   */
  static xenditCallback = asyncHandler(async (req, res) => {
    // Verification token recommended for production
    const xenditToken = req.headers['x-callback-token'];
    const verificationToken = process.env.XENDIT_WEBHOOK_VERIFICATION_TOKEN;

    if (verificationToken && xenditToken !== verificationToken) {
      console.warn('[Webhook Warning] Unauthorized callback attempt');
      return res.status(401).json({ status: 'error', message: 'Invalid callback token' });
    }

    await PaymentService.handleWebhook(req.body);

    res.success({}, 'Webhook processed successfully', 200);
  });

  /**
   * Get Payment Status
   */
  static getPaymentStatus = asyncHandler(async (req, res) => {
    const { id } = req.params; // billId or referenceId

    const bill = await prisma.bill.findUnique({
      where: { id },
      include: {
        payments: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!bill) {
      throw new AppError('Bill not found', 404);
    }

    res.success({
      billId: bill.id,
      billNumber: bill.billNumber,
      status: bill.status,
      paymentUrl: bill.paymentUrl,
      externalId: bill.externalId,
      totalAmount: bill.totalAmount,
      payments: bill.payments
    }, 'Payment status retrieved successfully');
  });
}