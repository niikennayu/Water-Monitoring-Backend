import prisma from '../config/db.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { PaymentService } from '../services/PaymentService.js';
import { generateInvoicePdf } from "../utils/invoice.js";

export class PaymentController {

  /**
   * Create Xendit Invoice for a Bill
   */
  static createPayment = asyncHandler(async (req, res) => {

    const { billId } = req.body;

    console.log("REQUEST BODY:", req.body);
    console.log("BILL ID:", billId);

    if (!billId) {
      throw new AppError('Bill ID is required', 400);
    }

const existingBill = await prisma.bill.findUnique({
  where: {
    id: billId,
  },
});

    console.log("FOUND BILL:", existingBill);

    if (!existingBill) {
      throw new AppError('Bill not found', 404);
    }

    // CREATE INVOICE
    const bill = await PaymentService.createInvoice(billId);

    res.status(201).json({
      status: "success",
      message: "Payment invoice created successfully",
      data: {
        billNumber: bill.billNumber,
        paymentUrl: bill.paymentUrl,
        externalId: bill.externalId,
        status: bill.status,
        totalAmount: bill.totalAmount,
      },
    });
  });

  /**
   * Xendit Webhook Callback
   */
  static xenditCallback = asyncHandler(async (req, res) => {

    const xenditToken = req.headers['x-callback-token'];
    const verificationToken = process.env.XENDIT_WEBHOOK_VERIFICATION_TOKEN;

    console.log("XENDIT TOKEN:", xenditToken);
console.log("ENV TOKEN:", verificationToken);

    await PaymentService.handleWebhook(req.body);

    res.status(200).json({
      status: "success",
      message: "Webhook processed successfully",
    });
  });

  /**
   * Get Payment Status
   */
  static getPaymentStatus = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const bill = await prisma.bill.findUnique({
      where: {
        billNumber: id,
      },
      include: {
        payments: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!bill) {
      throw new AppError('Bill not found', 404);
    }

    res.status(200).json({
      status: "success",
      message: "Payment status retrieved successfully",
      data: {
        billNumber: bill.billNumber,
        status: bill.status,
        paymentUrl: bill.paymentUrl,
        externalId: bill.externalId,
        totalAmount: bill.totalAmount,
        payments: bill.payments,
      },
    });
  });

  static async downloadInvoice(
  req,
  res
) {

  const pdfBuffer =
    await PaymentService
      .downloadInvoice(
        req.params.billId
      );

  res.setHeader(
    "Content-Type",
    "application/pdf"
  );

  res.setHeader(
    "Content-Disposition",
    `attachment; filename=invoice-${req.params.billId}.pdf`
  );

  res.send(pdfBuffer);

}
}