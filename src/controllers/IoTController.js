import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import Logger from '../utils/logger.js';
import { IotService } from '../services/IotService.js';

export class IoTController {
  /**
   * POST /api/v1/iot/water-usage
   */
  static sendWaterUsage = asyncHandler(async (req, res) => {
    const { forward, backward, cumulative } = req.body;
    
    // Mengambil API Key dari Header (Standar Keamanan IoT)
    const apiKey = req.headers['x-api-key'];

    // --- Validasi Input ---
    if (!apiKey) {
      throw new AppError('API key is missing. Provide x-api-key in headers.', 401);
    }

    // Pastikan semua field wajib ada di Body
    if (forward === undefined || backward === undefined || cumulative === undefined) {
      throw new AppError('Missing required fields: forward, backward, and cumulative', 400);
    }

    // --- Proses di Service ---
    const data = await IotService.saveWaterUsage(apiKey, { forward, backward, cumulative });

    // --- Logging & Response ---
    Logger.info(`Data received for Device ID: ${data.deviceId}`);

    res.success(
      {
        id: data.id,
        deviceId: data.deviceId,
        forward: data.forward,
        backward: data.backward,
        cumulative: data.cumulative,
        timestamp: data.createdAt || data.timestamp, // Sesuaikan dengan field di schema.prisma
      },
      'Water usage data recorded successfully',
      201
    );
  });

  /**
   * GET /api/v1/iot/:deviceId
   * Mengambil data penggunaan air berdasarkan ID perangkat.
   */
  static getWaterUsageByDevice = asyncHandler(async (req, res) => {
    const { deviceId } = req.params;

    const data = await IotService.getWaterUsageByDevice(deviceId);

    res.success(data, 'Water usage data fetched successfully', 200);
  });
}