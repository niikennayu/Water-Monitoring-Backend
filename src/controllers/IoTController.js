import prisma from '../config/db.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';

export class IoTController {

  static sendWaterData = asyncHandler(async (req, res) => {
    const { deviceId, forward, backward } = req.body;

    if (!deviceId) {
      throw new AppError('Device ID required', 400);
    }

    const cumulative = forward - backward;

    const data = await prisma.waterUsage.create({
      data: {
        deviceId,
        forward,
        backward,
        cumulative
      }
    });

    res.success(data, 'Water data received', 201);
  });
}