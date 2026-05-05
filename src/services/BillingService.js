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
        customerId: device.userId,
        deviceId: device.id,
        billNumber,
        billingPeriod,
        dueDate,
        waterUsage: lastUsage.cumulative,
        unitPrice: unitPrice,
        totalAmount: totalAmount,
        status: 'pending'
      }
    });

    return newBill;
  }

  static async getBillsByUserId(userId) {
    return await prisma.bill.findMany({
      where: { customerId: userId },
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
}