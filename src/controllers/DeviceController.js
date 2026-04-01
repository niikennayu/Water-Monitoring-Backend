import { DeviceService } from '../services/DeviceService.js';

export class DeviceController {
  static async create(req, res) {
    const userId = req.user.id;

    const device = await DeviceService.createDevice(userId, req.body);

    res.success(device, 'Device created', 201);
  }

  static async getAll(req, res) {
    const userId = req.user.id;

    const devices = await DeviceService.getDevices(userId);

    res.success(devices, 'Devices fetched', 200);
  }
}