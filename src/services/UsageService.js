import prisma from '../config/db.js';
import { AppError } from '../middleware/errorHandler.js';

export class UsageService {
  /**
   * Menghitung total pemakaian air bulanan
   * @param {string} userId - ID User (contoh: 'P0001')
   * @param {number} month - Bulan (1-12)
   * @param {number} year - Tahun (contoh: 2025)
   */
  static async calculateMonthlyUsage(userId, month, year) {
    // 1. Tentukan rentang waktu awal dan akhir bulan
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    // 2. Ambil data pertama dan terakhir pada bulan tersebut untuk melihat selisih cumulative
    const usageData = await prisma.waterUsage.findMany({
      where: {
        id_user: userId,
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { timestamp: 'asc' },
    });

    if (usageData.length < 2) {
      return 0; // Data tidak cukup untuk dihitung selisihnya
    }

    const firstReading = usageData[0].cumulative;
    const lastReading = usageData[usageData.length - 1].cumulative;

    // Hitung selisih (Last - First)
    // Karena cumulative di database kita BigInt, kita konversi ke Number untuk perhitungan
    const totalUsage = Number(lastReading - firstReading);

    return totalUsage > 0 ? totalUsage : 0;
  }
}