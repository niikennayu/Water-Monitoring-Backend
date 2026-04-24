import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import prisma from '../config/db.js';

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { customer_number } = req.query;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        devices: {
          include: {
            waterUsages: {
              orderBy: { timestamp: 'desc' },
              take: 10
            }
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'Customer not found'
      });
    }

    const devices = user.devices;
    const totalDevices = devices.length;
    const activeDevices = devices.filter(d => d.status !== 'inactive').length;

    let totalUsage = 0;
    const allUsages = [];

    devices.forEach(device => {
      device.waterUsages.forEach(usage => {
        allUsages.push(usage);
        totalUsage += usage.cumulative || 0;
      });
    });

    // latest reading benar (di-sort global)
    const latestReading = allUsages
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0] || null;

    const dashboardData = {
      customer: {
        id: user.id,
        name: user.name,
        email: user.email,
        customer_number: customer_number || user.id.substring(0, 8).toUpperCase()
      },
      summary: {
        totalDevices,
        activeDevices,
        totalWaterUsage: parseFloat(totalUsage.toFixed(2)), // 🔥 FIX
        totalUsageUnit: 'liter'
      },
      devices: devices.map(d => ({
        id: d.id,
        name: d.name,
        location: d.location,
        status: d.status || 'active',
        latestUsage: d.waterUsages[0] || null
      })),
      latestReadings: allUsages.slice(0, 5),
      latestReading,
      timestamp: new Date().toISOString()
    };

    // Pakai responseHandler
    res.success(dashboardData, 'Dashboard fetched successfully', 200);

  } catch (error) {
    console.error('[Dashboard Error]', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to fetch dashboard data'
    });
  }
});

export default router;