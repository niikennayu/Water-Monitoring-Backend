import prisma from '../config/db.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { BillingService } from '../services/BillingService.js';

export class BillingController {
  /**
   * POST /api/v1/billing/generate
   * Generate a new bill for a specific device.
   */
  static generateBill = asyncHandler(async (req, res) => {
    const { deviceId, unitPrice } = req.body;
    const bill = await BillingService.generateBillForDevice(deviceId, unitPrice);
    res.success(bill, 'Bill generated successfully', 201);
  });

  /**
   * GET /api/v1/billing/all
   * Fetch all bills (Admin view).
   */
  static getAllBills = asyncHandler(async (req, res) => {
    const bills = await BillingService.getAllBills();
    res.success(bills, 'All bills fetched successfully', 200);
  });

  /**
   * GET /api/v1/billing/my-bills
   * Fetch bills for the authenticated customer.
   */
  static getMyBills = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const bills = await BillingService.getBillsByUserId(userId);
    res.success(bills, 'Your bills fetched successfully', 200);
  });

  static async getUserBills(req, res) {

  try {

    const bills =
      await prisma.bill.findMany({
        where: {
          userId:
            req.params.id
        },
        orderBy: {
          billingDate: "desc"
        },
        take: 3
      });

    return res.json({
      status: "success",
      data: bills
    });

  } catch (error) {

  console.error(error);

  return res.status(500).json({
    message: "Failed to load bills",
    error: error.message
  });

}

}
}