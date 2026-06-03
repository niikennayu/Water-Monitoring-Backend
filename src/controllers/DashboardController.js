import prisma from '../config/db.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import { DashboardService } from '../services/DashboardService.js';
import { BillingService } from '../services/BillingService.js';

/**
 * DashboardController
 */
export class DashboardController {


  /**
   * GET /api/dashboard/chart
   */
  static async getWaterUsageChart(req, res) {
  try {
const userId = req.user.id;
    const { range } = req.query;

    // sementara fokus Harian dulu
    if (range === "Harian") {

    // awal hari ini
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    // akhir hari ini
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    console.log("USER LOGIN =", userId);

    const usages = await prisma.waterUsage.findMany({
  where: {
    userId,
    timestamp: {
      gte: startOfDay,
      lte: endOfDay
    }
  }
});

console.log(
  "TOTAL DATA USER =",
  usages.length
);

    // bucket chart
    const chart = [
      { x: "00", value: 0 },
      { x: "03", value: 0 },
      { x: "06", value: 0 },
      { x: "09", value: 0 },
      { x: "12", value: 0 },
      { x: "15", value: 0 },
      { x: "18", value: 0 },
      { x: "21", value: 0 }
    ];

    for (const item of usages) {

      const hour =
        new Date(item.timestamp).getHours();

      const bucket =
        Math.floor(hour / 3) * 3;

      const index =
        bucket / 3;

      chart[index].value +=
        (item.volume)/1000 || 0;
    }

    return res.json(chart);
  }
  if (range === "Mingguan") {

      const chart = [
        { x: "Sen", value: 0 },
        { x: "Sel", value: 0 },
        { x: "Rab", value: 0 },
        { x: "Kam", value: 0 },
        { x: "Jum", value: 0 },
        { x: "Sab", value: 0 },
        { x: "Min", value: 0 }
      ];

      const sevenDaysAgo = new Date();

      sevenDaysAgo.setDate(
        sevenDaysAgo.getDate() - 6
      );

      sevenDaysAgo.setHours(
        0, 0, 0, 0
      );

      const usages =
  await prisma.waterUsage.findMany({
    where: {
      userId,
      timestamp: {
        gte: sevenDaysAgo
      }
    }
  });

      const dayMap = {
        1: 0, // Sen
        2: 1, // Sel
        3: 2, // Rab
        4: 3, // Kam
        5: 4, // Jum
        6: 5, // Sab
        0: 6  // Min
      };

      for (const item of usages) {

        const day =
          new Date(item.timestamp)
            .getDay();

        const index =
          dayMap[day];

        chart[index].value +=
          (item.volume)/1000 || 0;

      }
console.log(
  "RANGE:",
  range,
  JSON.stringify(chart, null, 2)
);
      return res.json(chart);

    }
if (range === "Bulanan") {

  const currentYear =
    new Date().getFullYear();
console.log("currentYear =", currentYear);
  const chart = [
    { x: "Jan", value: 0 },
    { x: "Feb", value: 0 },
    { x: "Mar", value: 0 },
    { x: "Apr", value: 0 },
    { x: "May", value: 0 }
  ];

  const startDate =
    new Date(currentYear, 0, 1);

  const endDate =
    new Date(currentYear, 4, 31, 23, 59, 59);

  const usages =
  await prisma.waterUsage.findMany({
    where: {
      userId,
      timestamp: {
        gte: startDate,
        lte: endDate
      }
    }
  });

  for (const item of usages) {

    const month =
      new Date(item.timestamp)
        .getMonth();

    // hanya Jan-Apr
    if (month >= 0 && month <= 4) {

      chart[month].value +=
        (item.volume)/1000 || 0;

    }

  }
console.log(
  "RANGE:",
  range,
  JSON.stringify(chart, null, 2)
);
  return res.json(chart);

}
    return res.status(400).json({
      message: "Range tidak valid"
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      message: "Failed to load chart data"
    });

  }
}

  /**
   * GET /api/v1/dashboard
   * Dashboard customer
   */
  static getDashboard = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        devices: {
          include: {
            waterUsages: {
              orderBy: {
                timestamp: 'desc',
              },
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

    const activeDevices = devices.filter(
      (device) => device.status !== 'inactive'
    ).length;

    let totalUsage = 0;

    devices.forEach((device) => {
      if (device.waterUsages.length > 0) {
        totalUsage += device.waterUsages[0].cumulative || 0;
      }
    });

    const dashboardData = {
      customer: {
        id: user.id,
        name: user.name,
        email: user.email,
        customer_number:
          user.customer_number ||
          user.id.substring(0, 8).toUpperCase(),
      },

      summary: {
        totalDevices,
        activeDevices,
        totalWaterUsage: parseFloat(totalUsage.toFixed(2)),
        totalUsageUnit: 'liter',
      },

      devices: devices.map((device) => ({
        id: device.id,
        name: device.name,
        location: device.location,
        status: device.status,
        latestUsage: device.waterUsages[0] || null,
      })),

      timestamp: new Date().toISOString(),
    };

    res.success(
      dashboardData,
      'Dashboard fetched successfully',
      200
    );
  });

  /**
   * GET /api/v1/dashboard/chart
   * Customer chart
   */
  static getChartData = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const takeLimit = parseInt(req.query.limit) || 20;

    const user = await prisma.user.findUnique({
      where: { id: userId },

      include: {
        devices: {
          include: {
            waterUsages: {
              orderBy: {
                timestamp: 'asc',
              },

              take: takeLimit,
            },
          },
        },
      },
    });

    if (!user) {
      throw new AppError('Customer not found', 404);
    }

    const chartData = user.devices.map((device) => ({
      deviceId: device.id,
      deviceName: device.name,

      data: device.waterUsages.map((usage) => ({
        timestamp: usage.timestamp,
        cumulative: usage.cumulative,
        forward: usage.forward,
        backward: usage.backward,
      })),
    }));

    res.success(
      chartData,
      'Chart data fetched successfully',
      200
    );
  });

  /**
   * GET /api/v1/dashboard/admin
   * Admin stats
   */
  static getAdminStats = asyncHandler(async (req, res) => {
    const stats = await DashboardService.getAdminStats();

    res.success(
      stats,
      'Admin dashboard stats fetched successfully',
      200
    );
  });

  /**
   * GET /api/v1/dashboard/customer/:deviceId
   * Device stats
   */
  static getDeviceStats = asyncHandler(async (req, res) => {
    const { deviceId } = req.params;

    const stats = await DashboardService.getDeviceStats(deviceId);

    res.success(
      stats,
      'Device stats fetched successfully',
      200
    );
  });

  /**
   * GET /api/v1/dashboard/admin/chart
   * Grafik volume pemakaian air admin
   */
  static getAdminChart = asyncHandler(async (req, res) => {
    const bills = await prisma.bill.findMany({
      orderBy: {
        billingDate: 'asc',
      },
    });

    const chartData = bills.map((bill) => ({
      month: bill.billingPeriod,
      usage: bill.waterUsage,
      amount: bill.totalAmount,
      status: bill.status,
    }));

    res.success(
      chartData,
      'Admin chart fetched successfully',
      200
    );
  });

  /**
   * GET /api/v1/dashboard/admin/payment-status
   * Sebaran status pembayaran
   */
  static getPaymentStatus = asyncHandler(async (req, res) => {
    const paid = await prisma.bill.count({
      where: {
        status: 'PAID',
      },
    });

    const unpaid = await prisma.bill.count({
      where: {
        status: 'UNPAID',
      },
    });

    res.success(
      {
        paid,
        unpaid,
        total: paid + unpaid,
      },
      'Payment status fetched successfully',
      200
    );
  });

  static async getMonthlyVolume(req, res) {

  try {
const userId = req.user.id;
    const now = new Date();

    // BULAN INI
    const startOfCurrentMonth =
      new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      );

    const endOfCurrentMonth =
      new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59
      );

    // BULAN LALU
    const startOfLastMonth =
      new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        1
      );

    const endOfLastMonth =
      new Date(
        now.getFullYear(),
        now.getMonth(),
        0,
        23,
        59,
        59
      );

    // QUERY BULAN INI
    const currentMonthUsages =
  await prisma.waterUsage.findMany({
    where: {
      userId,
      timestamp: {
        gte: startOfCurrentMonth,
        lte: endOfCurrentMonth
      }
    }
  });

    // QUERY BULAN LALU
    const lastMonthUsages =
  await prisma.waterUsage.findMany({
    where: {
      userId,
      timestamp: {
        gte: startOfLastMonth,
        lte: endOfLastMonth
      }
    }
  });

    let currentVolume = 0;
    let lastVolume = 0;

    for (const item of currentMonthUsages) {
      currentVolume += item.volume || 0;
    }

    for (const item of lastMonthUsages) {
      lastVolume += item.volume || 0;
    }

    const difference =
      currentVolume - lastVolume;

const latestUnitPrice =
  await prisma.unitPrice.findFirst({
    orderBy: {
      createdAt: "desc"
    }
  });

const unitPrice =
  latestUnitPrice?.price || 0;

const estimatedBill =
  currentVolume * unitPrice / 1000;

    return res.json({
  currentVolume,
  lastVolume,
  difference,
  unitPrice,
  estimatedBill
});

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      message:
        "Failed to load monthly volume"
    });

  }

}

static async getCurrentBill(req, res) {

  console.log(
    "MASUK GET CURRENT BILL"
  );

  try {

    const userId =
      req.user.id;

    const bill =
      await BillingService
        .syncUserBills(userId);

    return res.json({
      status: "success",
      data: bill
    });

  } catch (error) {

    console.error(error);

    return res.status(500).json({
      message:
        "Failed to load bill"
    });

  }

}
}