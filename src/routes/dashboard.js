import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import prisma from '../config/db.js';

const router = express.Router();

/**
 * Dashboard Routes
 * 
 * GET /api/v1/dashboard - Get dashboard data
 * Query parameter: customer_number (opsional)
 * 
 * Ambil:
 * - Total penggunaan air berdasarkan customer
 * - Penggunaan per hari/bulan
 * - Join antara customers, devices, dan water_usages
 */

router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { customer_number } = req.query;

    // Ambil user/customer
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

    // Hitung statistik
    const devices = user.devices;
    const totalDevices = devices.length;
    const activeDevices = devices.filter(d => d.status !== 'inactive').length;

    // Hitung total penggunaan air
    let totalUsage = 0;
    const allUsages = [];

    devices.forEach(device => {
      device.waterUsages.forEach(usage => {
        allUsages.push(usage);
        totalUsage += usage.cumulative || 0;
      });
    });

    // Ambil reading terbaru
    const latestReading = allUsages.length > 0 ? allUsages[0] : null;

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
        totalWaterUsage: totalUsage.toFixed(2),
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
      timestamp: new Date().toISOString()
    };

    res.status(200).json({
      status: 'success',
      data: dashboardData
    });

  } catch (error) {
    console.error('[Dashboard Error]', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to fetch dashboard data'
    });
  }
});

export default router;
