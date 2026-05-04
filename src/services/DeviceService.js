import prisma from '../config/db.js';
import crypto from 'crypto';

export class DeviceService {
static async createDevice(userId, data) {
    const apiKey = crypto.randomBytes(32).toString('hex');

    return prisma.device.create({
      data: {
        name: data.name,
        location: data.location,
        apiKey,
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