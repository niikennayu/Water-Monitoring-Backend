import express from 'express';
import prisma from "../config/db.js";
import { authMiddleware } from '../middleware/authMiddleware.js';
import { PaymentController } from '../controllers/PaymentController.js';

const router = express.Router();

/**
 * DEBUG ROUTE
 */
router.get("/all-bills", async (req, res) => {

  const bills = await prisma.bill.findMany();

  res.json(bills);

});

/**
 * SEED BILL
 */

router.get("/reset-bill", async (req, res) => {

  const bill = await prisma.bill.update({
    where: {
      id: "e7643768-1f97-4cc8-8311-028e2f0f95b0",
    },
    data: {
      status: "UNPAID",
      paymentUrl: null,
      externalId: null,
    },
  });

  res.json(bill);

});

router.get("/seed", async (req, res) => {

  const latestBill = await prisma.bill.findFirst({
    orderBy: {
      createdAt: "desc",
    },
  });

  const nextNumber = latestBill
    ? parseInt(latestBill.billNumber.split("-")[1] || "1") + 1
    : 1;

  const bill = await prisma.bill.create({
    data: {
      userId: "780ada8f-3c74-45ef-9784-4953e2db5085",

      billNumber: `INV-${nextNumber}`,

      billingPeriod: "May 2026",

      billingDate: new Date(),

      dueDate: new Date(),

      waterUsage: Math.floor(Math.random() * 100) + 50,

      unitPrice: 500,

      totalAmount:
        (Math.floor(Math.random() * 100) + 50) * 500,

      status: "UNPAID",
    },
  });

  res.json({
    message: "Bill created successfully",
    data: bill,
  });

});
/**
 * @route   POST /api/v1/payment/create
 */
router.post("/create", PaymentController.createPayment);

router.post(
  "/webhook",
  PaymentController.xenditCallback
);

router.get(
  "/:id",
  PaymentController.getPaymentStatus
);

router.post(
  '/callback',
  PaymentController.xenditCallback
);

router.get(
  '/status/:id',
  PaymentController.getPaymentStatus
);

router.get(
  "/invoice/:billId",
  authMiddleware,
  PaymentController.downloadInvoice
);

export default router;