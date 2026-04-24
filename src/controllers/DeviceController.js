import { DeviceService } from '../services/DeviceService.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';

export class DeviceController {
  static create = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    if (!req.body.name) {
      throw new AppError('Device name is required', 400);
    }

    const device = await DeviceService.createDevice(userId, req.body);

    res.success(device, 'Device created', 201);
  });

  static getAll = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const devices = await DeviceService.getDevices(userId);

    res.success(devices, 'Devices fetched', 200);
  });
}