import prisma from '../config/db.js';

/**
 * Dashboard Controller
 * Menghandle endpoint untuk mendapatkan data dashboard
 * Termasuk: total device, penggunaan air, dll
 */

export const getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    // Ambil data user dengan relasi
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        devices: {
          include: {
            waterUsages: {
              orderBy: { timestamp: 'desc' },
              take: 1 // Ambil usage terbaru saja per device
            }
          }
        },
        bills: {
          orderBy: { billingDate: 'desc' },
          take: 5 // Ambil 5 bill terbaru
        }
      }
    });

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    // Hitung statistik
    const totalDevices = user.devices.length;
    const activeDevices = user.devices.filter(d => d.status === 'active').length;

    // Hitung total penggunaan air
    let totalWaterUsage = 0;
    user.devices.forEach(device => {
      if (device.waterUsages && device.waterUsages.length > 0) {
        totalWaterUsage += device.waterUsages[0].cumulative || 0;
      }
    });

    // Hitung bill statistics
    const totalBills = user.bills.length;
    const paidBills = user.bills.filter(b => b.status === 'paid').length;
    const pendingBills = user.bills.filter(b => b.status === 'pending').length;
    const totalBilled = user.bills.reduce((sum, b) => sum + b.totalAmount, 0);
    const totalPaid = user.bills
      .filter(b => b.status === 'paid')
      .reduce((sum, b) => sum + b.totalAmount, 0);

    // Ambil latest readings dari semua device
    const latestReadings = user.devices
      .map(device => {
        if (device.waterUsages && device.waterUsages.length > 0) {
          return {
            device_id: device.id,
            device_name: device.name,
            device_location: device.location,
            ...device.waterUsages[0]
          };
        }
        return null;
      })
      .filter(item => item !== null);

    // Response dashboard
    res.status(200).json({
      status: 'success',
      data: {
        customer: {
          id: user.id,
          name: user.name,
          email: user.email,
          customer_number: user.customer_number || user.id.substring(0, 8).toUpperCase(),
          address: user.address,
          phone: user.phone
        },
        summary: {
          total_devices: totalDevices,
          active_devices: activeDevices,
          total_water_usage: parseFloat(totalWaterUsage.toFixed(2)),
          water_usage_unit: 'liter',
          total_bills: totalBills,
          paid_bills: paidBills,
          pending_bills: pendingBills,
          total_billed_amount: parseFloat(totalBilled.toFixed(2)),
          total_paid_amount: parseFloat(totalPaid.toFixed(2))
        },
        devices: user.devices.map(d => ({
          id: d.id,
          name: d.name,
          location: d.location,
          status: d.status,
          apiKey: d.apiKey.substring(0, 8) + '...', // Jangan expose full API key
          latest_usage: d.waterUsages[0] || null
        })),
        latest_readings: latestReadings.slice(0, 10),
        recent_bills: user.bills.slice(0, 5),
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('[Dashboard Error]', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to fetch dashboard data'
    });
  }
};