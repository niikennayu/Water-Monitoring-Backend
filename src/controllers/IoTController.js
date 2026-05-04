import prisma from '../config/db.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import Logger from '../utils/logger.js';

/**
 * IoTController - Handles incoming sensor data from IoT devices.
 * Validates device ownership via x-api-key header before persisting data.
 */
export class IoTController {
  /**
   * POST /api/v1/iot/water-usage
   * Receives water usage data from IoT sensor devices.
   *
   * Security flow:
   * 1. Extract x-api-key from request headers
   * 2. Find device by apiKey in database
   * 3. Validate that deviceId in body matches the device found by apiKey
   * 4. If mismatch → 403 Forbidden
   * 5. If valid → persist data with parseFloat() for numeric safety
   *
   * Expected body: { deviceId, forward, backward, cumulative }
   */
  static sendWaterUsage = asyncHandler(async (req, res) => {
    const { deviceId, forward, backward, cumulative } = req.body;
    const apiKey = req.headers['x-api-key'];

    // --- Input Validation ---
    if (!apiKey) {
      throw new AppError('API key is missing. Provide x-api-key in headers.', 401);
    }

    if (!deviceId) {
      throw new AppError('deviceId is required', 400);
    }

    if (forward === undefined || forward === null) {
      throw new AppError('forward value is required', 400);
    }

    if (backward === undefined || backward === null) {
      throw new AppError('backward value is required', 400);
    }

    if (cumulative === undefined || cumulative === null) {
      throw new AppError('cumulative value is required', 400);
    }

    // --- Security: Validate deviceId matches apiKey ownership ---
    const device = await prisma.device.findUnique({
      where: { apiKey },
    });

    if (!device) {
      throw new AppError('Invalid API key', 403);
    }

    if (device.id !== deviceId) {
      throw new AppError('Device ID does not match the provided API key', 403);
    }

    // --- Parse numeric values for Prisma Float safety ---
    const parsedForward = parseFloat(forward);
    const parsedBackward = parseFloat(backward);
    const parsedCumulative = parseFloat(cumulative);

    if (isNaN(parsedForward) || isNaN(parsedBackward) || isNaN(parsedCumulative)) {
      throw new AppError('forward, backward, and cumulative must be valid numbers', 400);
    }

    // --- Persist water usage data ---
    const data = await prisma.waterUsage.create({
      data: {
        deviceId: device.id,
        forward: parsedForward,
        backward: parsedBackward,
        cumulative: parsedCumulative,
      },
    });

    Logger.info('Water usage data received', {
      deviceId: device.id,
      forward: parsedForward,
      backward: parsedBackward,
      cumulative: parsedCumulative,
    });

    res.success(
      {
        id: data.id,
        deviceId: data.deviceId,
        forward: data.forward,
        backward: data.backward,
        cumulative: data.cumulative,
        timestamp: data.timestamp,
      },
      'Water usage data received successfully',
      201
    );
  });
}