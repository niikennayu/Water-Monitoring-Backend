import express from 'express';
import apiKeyMiddleware from '../middleware/apiKeyMiddleware.js';
import prisma from '../config/db.js';

const router = express.Router();

router.post('/water-usage', apiKeyMiddleware, async (req, res) => {
  try {
    const { flowRate, volume } = req.body;

    // Ambil device dari middleware
    const device = req.device;

    // Validasi sederhana
    if (!flowRate || !volume) {
      return res.status(400).json({
        status: 'error',
        message: 'flowRate dan volume wajib diisi'
      });
    }

    // Simpan data penggunaan air ke database
    const data = await prisma.waterUsage.create({
      data: {
        flowRate,
        volume,
        deviceId: device.id
      }
    });

    res.json({
      status: 'success',
      data
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

export default router;