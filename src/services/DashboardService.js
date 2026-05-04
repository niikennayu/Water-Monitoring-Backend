import prisma from '../config/db.js';

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
      totalConsumption: usageStats._sum.forward || 0,
      totalRevenue: Math.round(revenueStats._sum.totalAmount || 0),
      locationOverview: locationStats
    };
  }
}