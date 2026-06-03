import prisma from "../config/db.js";
import { invoiceClient } from "../config/xendit.js";
import { AppError } from "../middleware/errorHandler.js";
import { generateInvoicePdf } from "../utils/invoice.js";

export class PaymentService {
  /**
   * Create Xendit Invoice
   */
  static async createInvoice(billId) {
  try {

    if (!process.env.XENDIT_SECRET_KEY) {
      throw new AppError(
        "XENDIT_SECRET_KEY is not configured",
        500
      );
    }

    // Find Bill by ID
    const bill = await prisma.bill.findUnique({
      where: {
        id: billId,
      },
    });

    if (!bill) {
      throw new AppError("Bill not found", 404);
    }

    // Check Bill Status
    const billStatus = (bill.status || "").toUpperCase();

 // if (
//   billStatus === "PAID" ||
//   billStatus === "LUNAS"
// ) {
//   throw new AppError(
//     "Bill already paid",
//     400
//   );
// }

    // Reuse existing invoice
    // if (
    //   bill.paymentUrl &&
    //   bill.paymentUrl.includes("xendit")
    // ) {
    //   return bill;
    // }

    // Find User
    const user = await prisma.user.findUnique({
      where: {
        id: bill.userId,
      },
    });

    // Minimum amount
    const finalAmount =
      bill.totalAmount < 10000
        ? 10000
        : Math.floor(Number(bill.totalAmount));

    // Create Xendit Invoice
  const response = await invoiceClient.createInvoice({
      data: {
        externalId: `${bill.billNumber}-${Date.now()}`,
        amount: finalAmount,
        description: `Tagihan Air - ${bill.billingPeriod}`,

        payerEmail:
          user?.email || "customer@example.com",

        currency: "IDR",

        successRedirectUrl:
          process.env.XENDIT_SUCCESS_REDIRECT_URL,

        failureRedirectUrl:
          process.env.XENDIT_FAILURE_REDIRECT_URL,
      },
    });

    // Save invoice
    const updatedBill = await prisma.bill.update({
      where: {
        id: billId,
      },
      data: {
        paymentUrl: response.invoiceUrl,
        externalId: response.id,
      },
    });

    return updatedBill;

  } catch (error) {

    console.error(
      "[XENDIT CREATE INVOICE ERROR]",
      error.response?.data || error
    );

    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Failed to create invoice";

    throw new AppError(errorMessage, 500);
  }
}

  /**
   * Handle Xendit Webhook
   */
  static async handleWebhook(callbackData) {
  try {

    console.log("[WEBHOOK DATA]", callbackData);

    const {
      id,
      external_id,
      status,
      amount,
      payment_method,
      payment_channel,
    } = callbackData;

      // Only process successful payment
      if (
        status !== "PAID" &&
        status !== "SETTLED"
      ) {
        return;
      }

      // Find Bill
      const bill = await prisma.bill.findFirst({
  where: {
    externalId: id,
  },
});

      if (!bill) {
        console.warn(
          `[Webhook] Bill not found: ${external_id}`
        );
        return;
      }

      // Prevent duplicate payment processing
      if (
        (bill.status || "").toUpperCase() ===
        "PAID"
      ) {
        return;
      }

      const referenceNumber =
        id || `XND-${Date.now()}`;

      // Transaction
      await prisma.$transaction([
        // Update Bill Status
        prisma.bill.update({
          where: {
            billNumber: bill.billNumber,
          },
          data: {
            status: "PAID",
          },
        }),

        // Create / Update Payment Record
        prisma.payment.upsert({
          where: {
            referenceNumber,
          },

          create: {
          referenceNumber,
          billId: bill.id,
          amount: parseFloat(amount),
          paymentMethod: `${payment_method || "XENDIT"} (${payment_channel || "N/A"})`,
          status: "paid",
        },

          update: {
            status: "paid",
            amount: parseFloat(amount),
          },
        }),
      ]);

      console.log(
        `[Webhook] Bill ${bill.billNumber} marked as PAID`
      );
    } catch (error) {
  console.error(
  "[XENDIT WEBHOOK ERROR]",
  error.message
);

console.error(error);
      throw new AppError(
        "Failed to process payment webhook",
        500
      );
    }
  }

  static async downloadInvoice(
  billId
) {

  const bill =
    await prisma.bill.findUnique({
      where: {
        id: billId
      }
    });

  if (!bill) {
    throw new AppError(
      "Bill not found",
      404
    );
  }

  const user =
    await prisma.user.findUnique({
      where: {
        id: bill.userId
      }
    });

  return await generateInvoicePdf(
    bill,
    user
  );

}
}