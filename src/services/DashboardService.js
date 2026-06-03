import prisma from '../config/db.js';
import { AppError } from '../middleware/errorHandler.js';

export class DashboardService {
  static async getAdminStats() {
    // 1. Hitung total perangkat/unit aktif
    const totalDevices = await prisma.device.count();

    // 2. Hitung total penggunaan air (kumulatif)
    const usageStats = await prisma.waterUsage.aggregate({
      _sum: { forward: true }
    });

    // 3. Hitung total pendapatan dari tagihan yang sudah lunas (Paid)
    const revenueStats = await prisma.bill.aggregate({
      where: { status: 'paid' },
      _sum: { totalAmount: true }
    });

    // 4. Rekapitulasi per Lokasi Apartemen
    const locationStats = await prisma.device.groupBy({
      by: ['location'],
      _count: {
        _all: true
      }
    });

    return {
      totalUnits: totalDevices,
      totalConsumption: Math.round((usageStats._sum.forward || 0) * 100) / 100,
      totalRevenue: Math.round(revenueStats._sum.totalAmount || 0),
      locationOverview: locationStats
    };
  }

  static async getDeviceStats(deviceId) {
    const device = await prisma.device.findUnique({
      where: { id: deviceId },
      include: {
        waterUsages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    if (!device) throw new AppError('Device not found', 404);

    const usageStats = await prisma.waterUsage.aggregate({
      where: { deviceId },
      _sum: { forward: true }
    });

    return {
      id: device.id,
      name: device.name,
      location: device.location,
      status: device.status,
      totalUsage: Math.round((usageStats._sum.forward || 0) * 100) / 100,
      latestReading: device.waterUsages[0] || null
    };
  }
}