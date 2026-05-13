import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import Logger from '../utils/logger.js';
import { IotService } from '../services/IotService.js';

export class IoTController {
  /**
   * POST /api/v1/iot/water-usage
   * Digunakan untuk menerima data dari sensor melalui API Key
   */
  static sendWaterUsage = asyncHandler(async (req, res) => {
    // Sesuaikan field dengan data yang dikirim sensor
    const { forward, backward, cumulative, flowRate, UID } = req.body;
    
    const apiKey = req.headers['x-api-key'];

    // --- Validasi Keamanan & Input ---
    if (!apiKey) {
      throw new AppError('API key is missing.', 401);
    }

    // UID sangat penting untuk mencari siapa pemilik device-nya
    if (!UID || cumulative === undefined) {
      throw new AppError('Missing required fields: UID and cumulative data', 400);
    }

    // --- Proses di Service ---
    // Service harus menangani pencarian id_user berdasarkan UID
    const data = await IotService.saveWaterUsage(apiKey, { 
      UID, 
      forward, 
      backward, 
      cumulative,
      flowRate 
    });

    Logger.info(`Water usage recorded for UID: ${UID} (User: ${data.id_user})`);

    res.success(
      {
        id: data.id,
        id_user: data.id_user,
        UID: data.UID,
        cumulative: data.cumulative.toString(), // Convert BigInt ke String agar tidak error JSON
        timestamp: data.timestamp,
      },
      'Water usage data recorded successfully',
      201
    );
  });

  /**
   * GET /api/v1/iot/:UID
   * Mengambil histori data berdasarkan UID Sensor
   */
  static getWaterUsageByDevice = asyncHandler(async (req, res) => {
    const { UID } = req.params;

    const data = await IotService.getWaterUsageByDevice(UID);

    // Pastikan data BigInt dikonversi jika ada dalam array
    const formattedData = data.map(item => ({
      ...item,
      cumulative: item.cumulative?.toString()
    }));

    res.success(formattedData, 'Water usage data fetched successfully', 200);
  });
}