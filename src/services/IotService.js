import prisma from '../config/db.js';
import { AppError } from '../middleware/errorHandler.js';

export class IotService {
  /**
   * Menemukan device berdasarkan apiKey dan menyimpan data penggunaan air.
   */
  static async saveWaterUsage(apiKey, data) {
    const { forward, backward, cumulative } = data;

    // 1. Cari device di database berdasarkan apiKey
    const device = await prisma.device.findUnique({
      where: { apiKey }
    });

    // Note: Properti device.location dan device.apiKey sekarang tersedia dari skema terbaru
    // 2. Jika apiKey tidak terdaftar, lempar error 401
    if (!device) {
      throw new AppError('Invalid API Key. Device not registered.', 401);
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
        deviceId: device.id, // ID diambil otomatis dari hasil pencarian apiKey
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