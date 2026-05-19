import prisma from '../config/db.js';
import crypto from 'crypto';

export class DeviceService {
  static async createDevice(id_user, data) {
    return prisma.device.create({
      data: {
        uid: data.uid,
        deviceId: id_user.substring(0, 10),
        name: data.name,
      },
    });
  }

  static async getAllDevices(id_user) {
    return prisma.device.findMany({
      where: { deviceId: id_user.substring(0, 10) },
    });
  }
}