import { Xendit } from 'xendit-node';
import prisma from '../config/db.js';
import { AppError } from '../middleware/errorHandler.js';
import dotenv from 'dotenv';

dotenv.config();

const xenditClient = new Xendit({
  secretKey: process.env.XENDIT_SECRET_KEY || 'xnd_development_...',
});

const { Invoice } = xenditClient;

export class PaymentService {
  static async createInvoice(billId) {
    const bill = await prisma.bill.findUnique({
      where: { id: billId },
      include: { customer: true }
    });

    if (!bill) throw new AppError('Bill not found', 404);

    if (bill.status === 'paid') {
      throw new AppError('Bill already paid', 400);
    }

    const data = {
      externalId: bill.id,
      amount: bill.totalAmount,
      description: `Water Bill - ${bill.billNumber} (${bill.billingPeriod})`,
      invoiceDuration: 86400, // 24 jam
      customer: {
        givenNames: bill.customer.name || 'Customer',
        email: bill.customer.email,
        mobileNumber: bill.customer.phone || undefined
      },
      currency: 'IDR',
      reminderTime: 1 // Kirim pengingat 1 jam sebelum expire
    };

    try {
      const response = await Invoice.createInvoice({ data });
      
      const updatedBill = await prisma.bill.update({
        where: { id: billId },
        data: {
          paymentUrl: response.invoiceUrl,
          externalId: response.id
        }
      });

      return updatedBill;
    } catch (error) {
      console.error('[Xendit Create Invoice Error]', error);
      throw new AppError(`Failed to create payment invoice: ${error.message}`, 500);
    }
  }

  static async handleWebhook(callbackData) {
    const { id, external_id, status, amount, payment_method, payment_channel } = callbackData;

    // Xendit status bisa 'PAID' atau 'SETTLED'
    if (status === 'PAID' || status === 'SETTLED') {
      const bill = await prisma.bill.findUnique({
        where: { id: external_id }
      });

      if (!bill) {
        console.warn(`[Webhook Warning] Bill with external_id ${external_id} not found`);
        return;
      }

      if (bill.status === 'paid') {
        console.log(`[Webhook Info] Bill ${bill.billNumber} already marked as paid.`);
        return;
      }

      // Update status bill dan buat record payment dalam satu transaksi
      await prisma.$transaction([
        prisma.bill.update({
          where: { id: external_id },
          data: { status: 'paid' }
        }),
        prisma.payment.create({
          data: {
            billId: external_id,
            amount: parseFloat(amount),
            paymentMethod: `${payment_method || 'XENDIT'} (${payment_channel || 'N/A'})`,
            referenceNumber: id,
            status: 'paid',
            description: `Payment for bill ${bill.billNumber} via Xendit`
          }
        })
      ]);
      
      console.log(`[Webhook Success] Bill ${bill.billNumber} updated to PAID.`);
    }
  }
}
