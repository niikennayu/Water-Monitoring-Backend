import prisma from '../config/db.js';
import { AppError } from '../middleware/errorHandler.js';

export class BillingService {
  static async generateBillForDevice(deviceId, unitPrice = 12500) {
    // 1. Cari device dan owner-nya
    const device = await prisma.device.findUnique({
      where: { id: deviceId },
      include: { user: true }
    });

    if (!device) throw new AppError('Device not found', 404);

    // 2. Cari penggunaan air terbaru untuk device ini
    const lastUsage = await prisma.waterUsage.findFirst({
      where: { deviceId },
      orderBy: { createdAt: 'desc' }
    });

    if (!lastUsage) throw new AppError('No water usage data found for this device', 404);

    // 3. Generate data tagihan
    const billNumber = `INV-${Date.now()}`;
    const billingPeriod = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7); // 7 hari dari sekarang

    // 4. Hitung total biaya (Pembulatan ke Rupiah terdekat)
    const totalAmount = Math.round(lastUsage.cumulative * unitPrice);

    // 5. Buat Record Billing baru
    const newBill = await prisma.bill.create({
      data: {
        userId: device.userId,
        customer_number: device.user?.customer_number || "CN-UNKNOWN", // Wajib diisi sesuai schema
        billNumber,
        billingPeriod,
        billingDate: new Date(), // Wajib diisi sesuai schema
        dueDate,
        waterUsage: lastUsage.cumulative,
        unitPrice: unitPrice,
        totalAmount: totalAmount,
        status: 'UNPAID' // Disesuaikan dengan ekspektasi dokumentasi
      }
    });

    return newBill;
  }

  static async getBillsByUserId(userId) {
    return await prisma.bill.findMany({
      where: { userId: userId },
      include: {
        device: {
          select: {
            name: true,
            location: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async getAllBills() {
    return await prisma.bill.findMany({
      include: { 
        customer: true,
        device: {
          select: {
            name: true,
            location: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async syncUserBills(userId) {

    console.log(
    "SYNC USER BILLS:",
    userId
  );

  const now = new Date();

  // =========================
  // UPDATE OVERDUE
  // =========================

  await prisma.bill.updateMany({
    where: {
      userId,
      status: "UNPAID",
      dueDate: {
        lt: now
      }
    },
    data: {
      status: "OVERDUE"
    }
  });

  // =========================
  // CEK BILL TERTUA
  // =========================

  let oldestBill =
    await prisma.bill.findFirst({
      where: {
        userId,
        status: {
          in: ["UNPAID", "OVERDUE"]
        }
      },
      orderBy: {
        billingDate: "asc"
      }
    });

  if (oldestBill) {
    return oldestBill;
  }

  // =========================
  // CARI USER
  // =========================

  const user =
    await prisma.user.findUnique({
      where: {
        id: userId
      }
    });

  if (!user) {
    throw new AppError(
      "User not found",
      404
    );
  }

  // =========================
  // BILL TERBARU
  // =========================

  const latestBill =
    await prisma.bill.findFirst({
      where: {
        userId
      },
      orderBy: {
        billingDate: "desc"
      }
    });

  let startMonth;

  if (latestBill) {

    startMonth =
      new Date(
        latestBill.billingDate
      );

    startMonth.setMonth(
      startMonth.getMonth() + 1
    );

  } else {

    const firstUsage =
      await prisma.waterUsage.findFirst({
        where: {
          userId
        },
        orderBy: {
          timestamp: "asc"
        }
      });

    if (!firstUsage) {
      return null;
    }

    startMonth =
      new Date(
        firstUsage.timestamp
      );

  }

  const lastMonth =
    new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1
    );

  // =========================
  // LOOP BULAN
  // =========================

  while (startMonth <= lastMonth) {

    const year =
      startMonth.getFullYear();

    const month =
      startMonth.getMonth();

    const monthStart =
      new Date(year, month, 1);

    const monthEnd =
      new Date(
        year,
        month + 1,
        0,
        23,
        59,
        59
      );

    const existingBill =
      await prisma.bill.findFirst({
        where: {
          userId,
          billingDate: monthStart
        }
      });

    if (!existingBill) {

      const usages =
        await prisma.waterUsage.findMany({
          where: {
            userId,
            timestamp: {
              gte: monthStart,
              lte: monthEnd
            }
          }
        });

      let totalLiter = 0;

      for (const item of usages) {
        totalLiter +=
          item.volume || 0;
      }

      const totalM3 =
        totalLiter / 1000;

      if (totalM3 > 0) {

        const latestUnitPrice =
          await prisma.unitPrice.findFirst({
            orderBy: {
              createdAt: "desc"
            }
          });

        const unitPrice =
          latestUnitPrice?.price || 0;

          const waterCost =
  totalM3 * unitPrice;

const tax =
  waterCost * 0.10;

const adminFee =
  2500;

const totalAmount =
  waterCost +
  tax +
  adminFee;

        const dueDate =
          new Date(
            year,
            month + 1,
            20
          );

        await prisma.bill.create({
  data: {

    userId,

    customer_number:
      user.customer_number,

    billNumber:
      `INV-${Date.now()}-${month}`,

    billingPeriod:
      monthStart.toLocaleString(
        "en-US",
        {
          month: "long",
          year: "numeric"
        }
      ),

    billingDate:
      monthStart,

    dueDate,

    waterUsage:
      totalM3,

    unitPrice,

    totalAmount,

    status:
      "UNPAID"
  }
        });

      }

    }

    startMonth.setMonth(
      startMonth.getMonth() + 1
    );

  }

  // =========================
// CEK LAGI BILL AKTIF
// =========================

const currentBill =
  await prisma.bill.findFirst({
    where: {
      userId,
      status: {
        in: [
          "UNPAID",
          "OVERDUE"
        ]
      }
    },
    orderBy: {
      billingDate: "asc"
    }
  });

if (currentBill) {
  return currentBill;
}

// =========================
// SEMUA BILL SUDAH PAID
// =========================

const latestpaidBill =
  await prisma.bill.findFirst({
    where: {
      userId
    },
    orderBy: {
      billingDate: "desc"
    }
  });

if (!latestpaidBill) {
  return null;
}

return {
  ...latestpaidBill,
  totalAmount: 0,
  dueDate: null,
  isCompleted: true
};

}
}