import prisma from '../config/db.js';
import { AppError } from '../middleware/errorHandler.js';

export class IotService {
  /**
   * Menyimpan data penggunaan air dan mendukung simulasi untuk 25 user tambahan.
   */
  static async saveWaterUsage(apiKey, data) {
    const { UID, forward, backward, cumulative, flowRate } = data;

    // 1. Verifikasi API Key (Sederhanakan: Bisa ditaruh di .env atau tabel config)
    // Untuk TA, kita asumsikan API Key valid jika ada (atau cek hardcoded)
    if (apiKey !== process.env.IOT_API_KEY) {
      throw new AppError('Invalid API Key.', 401);
    }

    // 2. Cari data device di PostgreSQL berdasarkan UID (Sensor ID)
    const device = await prisma.device.findUnique({
      where: { uid: UID },
      include: { user: true }
    });

    if (!device) {
      throw new AppError(`Device with UID ${UID} not found in database.`, 404);
    }

    // 3. Simpan data ke tabel water_usage
    // Gunakan id_user dan UID sesuai schema terbaru 
    const waterUsage = await prisma.waterUsage.create({
      data: {
        id_user: device.deviceId, // Isinya P0001 (dari kolom deviceId di tabel Device)
        UID: device.uid,         // Isinya 4898-...
        flowRate: parseFloat(flowRate) || 0,
        cumulative: BigInt(Math.round(cumulative)), // Schema kita pakai BigInt
        // volume & forward/backward bisa ditambahkan jika perlu di schema
      }
    });

    // 4. LOGIKA SIMULASI
    // Jika data yang masuk adalah dari salah satu device asli, 
    // akan di trigger fungsi untuk mengupdate 25 user simulasi lainnya 
    // agar data mereka juga ikut bergerak (biar tidak kosong).
    await this.generateSimulatedData();

    return {
      ...waterUsage,
      cumulative: waterUsage.cumulative.toString() // Convert untuk response JSON
    };
  }

  /**
   * Fungsi Simulasi: Membuat data dummy untuk P0006 - P0030
   */
  static async generateSimulatedData() {
    const simulatedUserIds = [];
    for (let i = 6; i <= 30; i++) {
      simulatedUserIds.push(`P${i.toString().padStart(4, '0')}`);
    }

    // Buat data acak untuk masing-masing user simulasi
    const simulationPromises = simulatedUserIds.map(async (userId) => {
      // Cari UID dummy untuk user ini
      const device = await prisma.device.findUnique({ where: { deviceId: userId } });
      
      if (device) {
        return prisma.waterUsage.create({
          data: {
            id_user: userId,
            UID: device.uid,
            flowRate: Math.random() * 10,
            cumulative: BigInt(1000 + Math.floor(Math.random() * 100)), 
          }
        });
      }
    });

    await Promise.all(simulationPromises);
  }

  /**
   * Mengambil riwayat penggunaan air berdasarkan UID sensor.
   */
  static async getWaterUsageByDevice(UID) {
    if (!UID) {
      throw new AppError('UID (Sensor ID) is required', 400);
    }

    const usageData = await prisma.waterUsage.findMany({
      where: { UID: UID },
      orderBy: { timestamp: 'desc' },
      take: 50 // Batasi agar tidak berat
    });

    // Handle BigInt conversion
    return usageData.map(item => ({
      ...item,
      cumulative: item.cumulative?.toString()
    }));
  }
}