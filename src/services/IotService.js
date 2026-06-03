import prisma from '../config/db.js';
import { AppError } from '../middleware/errorHandler.js';

export class IotService {
  /**
   * Menemukan device berdasarkan apiKey dan menyimpan data penggunaan air.
   */
  static async saveWaterUsage(apiKey, data) {
    const { deviceId, forward, backward, cumulative } = data;

    // 0. Validasi Master API Key
    if (apiKey !== process.env.IOT_API_KEY) {
      throw new AppError('Invalid Master API Key.', 401);
    }

    // 1. Cari device di database berdasarkan deviceId
    const device = await prisma.device.findUnique({
      where: { id: deviceId }
    });

    // 2. Jika device tidak terdaftar, lempar error 404
    if (!device) {
      throw new AppError('Device not registered in the system.', 404);
    }

    // 3. Konversi input ke Float untuk memastikan data numerik
    const parsedForward = parseFloat(forward);
    const parsedBackward = parseFloat(backward);
    const parsedCumulative = parseFloat(cumulative);

    if (isNaN(parsedForward) || isNaN(parsedBackward) || isNaN(parsedCumulative)) {
      throw new AppError('Data values (forward, backward, cumulative) must be valid numbers', 400);
    }

    // 4. Simpan ke tabel WaterUsage menggunakan ID device yang ditemukan
    const waterUsage = await prisma.waterUsage.create({
      data: {
        deviceId: device.id,
        userId: device.userId, // Wajib diisi sesuai schema terbaru
        forward: parsedForward,
        backward: parsedBackward,
        cumulative: parsedCumulative,
      }
    });

    return waterUsage;
  }

  /**
   * Mengambil riwayat penggunaan air berdasarkan ID perangkat.
   */
  static async getWaterUsageByDevice(deviceId) {
    if (!deviceId) {
      throw new AppError('Device ID is required', 400);
    }

    const waterUsage = await prisma.waterUsage.findMany({
      where: { deviceId },
      include: { device: true },
      orderBy: { createdAt: 'desc' },
    });

    return waterUsage;
  }
}