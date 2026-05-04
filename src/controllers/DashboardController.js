import prisma from '../config/db.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import Logger from '../utils/logger.js';

/**
 * DashboardController - Handles data retrieval for the user dashboard.
 * Delegates data fetching to Prisma and shapes the response.
 */
export class DashboardController {
  /**
   * GET /api/v1/dashboard
   * Fetch dashboard summary data for the authenticated user.
   */
  static getDashboard = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { customer_number } = req.query;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        devices: {
          include: {
            waterUsages: {
              orderBy: { timestamp: 'desc' }, // Latest usage for summary
              take: 1,
            },
          },
        },
      },
    });

    if (!user) {
      throw new AppError('Customer not found', 404);
    }

    const devices = user.devices;
    const totalDevices = devices.length;
    const activeDevices = devices.filter(d => d.status !== 'inactive').length;

    let totalUsage = 0;

    devices.forEach(device => {
      if (device.waterUsages.length > 0) {
        totalUsage += device.waterUsages[0].cumulative || 0;
      }
    });

    const dashboardData = {
      customer: {
        id: user.id,
        name: user.name,
        email: user.email,
        customer_number: customer_number || user.customer_number || user.id.substring(0, 8).toUpperCase(),
      },
      summary: {
        totalDevices,
        activeDevices,
        totalWaterUsage: parseFloat(totalUsage.toFixed(2)),
        totalUsageUnit: 'liter',
      },
      devices: devices.map(d => ({
        id: d.id,
        name: d.name,
        location: d.location,
        status: d.status || 'active',
        latestUsage: d.waterUsages[0] || null,
      })),
      timestamp: new Date().toISOString(),
    };

    res.success(dashboardData, 'Dashboard fetched successfully', 200);
  });

  /**
   * GET /api/v1/dashboard/chart
   * Fetch water usage data specifically for charts.
   * Orders data ascending (ASC) by timestamp.
   */
  static getChartData = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const takeLimit = parseInt(req.query.limit) || 20; // Number of points per device

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        devices: {
          include: {
            waterUsages: {
              orderBy: { timestamp: 'asc' }, // MUST BE ASCENDING FOR CHARTS
              take: takeLimit,
            },
          },
        },
      },
    });

    if (!user) {
      throw new AppError('Customer not found', 404);
    }

    const chartData = user.devices.map(device => ({
      deviceId: device.id,
      deviceName: device.name,
      data: device.waterUsages.map(usage => ({
        timestamp: usage.timestamp,
        cumulative: usage.cumulative,
        forward: usage.forward,
        backward: usage.backward,
      })),
    }));

    res.success(chartData, 'Chart data fetched successfully', 200);
  });
}