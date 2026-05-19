import { DeviceService } from '../services/DeviceService.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';

export class DeviceController {
  static createDevice = asyncHandler(async (req, res) => {
    const id_user = req.user.id;

    if (!req.body.name) {
      throw new AppError('Device name is required', 400);
    }

    const device = await DeviceService.createDevice(id_user, req.body);

    res.success(device, 'Device created', 201);
  });

  static getAllDevices = asyncHandler(async (req, res) => {
    const id_user = req.user.id;

    const devices = await DeviceService.getAllDevices(id_user);

    res.success(devices, 'Devices fetched', 200);
  });

  static getDevicesByCustomer = asyncHandler(async (req, res) => {
    const { id_user } = req.body;

    if (!id_user || id_user.trim() === '') {
      throw new AppError('id_user is required', 400);
    }

    const devices = await DeviceService.getAllDevices(id_user);

    res.success(devices, 'Devices fetched for customer', 200);
  });
}