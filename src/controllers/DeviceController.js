import { DeviceService } from '../services/DeviceService.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';

export class DeviceController {
  static createDevice = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    if (!req.body.name) {
      throw new AppError('Device name is required', 400);
    }

    const device = await DeviceService.createDevice(userId, req.body);

    res.success(device, 'Device created', 201);
  });

  static getAllDevices = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const devices = await DeviceService.getAllDevices(userId);

    res.success(devices, 'Devices fetched', 200);
  });

  static getDevicesByCustomer = asyncHandler(async (req, res) => {
    const { userId } = req.body;

    if (!userId || userId.trim() === '') {
      throw new AppError('userId is required', 400);
    }

    const devices = await DeviceService.getAllDevices(userId);

    res.success(devices, 'Devices fetched for customer', 200);
  });
}