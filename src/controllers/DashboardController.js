import prisma from '../config/db.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const getDashboard = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      devices: {
        include: {
          waterUsages: {
            orderBy: { timestamp: 'desc' },
            take: 1
          }
        }
      },
      bills: {
        orderBy: { billingDate: 'desc' },
        take: 5
      }
    }
  });

  if (!user) {
    return res.error('User not found', 404);
  }

  let totalWaterUsage = 0;
  user.devices.forEach(device => {
    if (device.waterUsages.length > 0) {
      totalWaterUsage += device.waterUsages[0].cumulative || 0;
    }
  });

  res.success({
    total_devices: user.devices.length,
    total_usage: totalWaterUsage,
    latest_bills: user.bills
  }, 'Dashboard fetched', 200);
});