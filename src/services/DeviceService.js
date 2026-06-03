import prisma from '../config/db.js';
import crypto from 'crypto';

export class DeviceService {
  static async createDevice(userId, data) {
    const id = "dev-" + crypto.randomBytes(4).toString('hex'); // Generate ID unik e.g., dev-8a4b2c1d

    return prisma.device.create({
      data: {
        id,
        name: data.name,
        location: data.location,
        status: "ACTIVE",
        userId,
      },
    });
  }

  static async getAllDevices(userId) {
    return prisma.device.findMany({
      where: { userId },
    });
  }
}