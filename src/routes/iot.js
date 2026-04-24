import express from 'express';
import apiKeyMiddleware from '../middleware/apiKeyMiddleware.js';
import prisma from '../config/db.js';

const router = express.Router();

/**
 * IoT Routes
 * 
 * POST /api/v1/iot/water-usage - Menerima data sensor dari perangkat IoT
 * Endpoint menerima: device_id, forward, backward
 * Hitung cumulative = forward - backward
 * Simpan ke tabel water_usages
 */

router.post('/water-usage', apiKeyMiddleware, async (req, res) => {
  try {
    const { device_id, forward, backward } = req.body;
    const device = req.device; // dari middleware API key

    // Validasi input
    if (device_id === null || forward === null || backward === null) {
      return res.status(400).json({
        status: 'error',
        message: 'device_id, forward, dan backward wajib diisi'
      });
    }

    // Validasi tipe data
    if (typeof forward !== 'number' || typeof backward !== 'number') {
      return res.status(400).json({
        status: 'error',
        message: 'forward dan backward harus berupa angka'
      });
    }

    // Validasi device_id sesuai dengan API key
    if (device.id !== device_id) {
      return res.status(403).json({
        status: 'error',
        message: 'Device ID tidak sesuai dengan API key'
      });
    }

    // Hitung cumulative = forward - backward
    const cumulative = forward - backward;

    if (cumulative < 0) {
      return res.status(400).json({
        status: 'error',
        message: 'Nilai cumulative tidak valid (forward < backward)'
      });
    }

    // Simpan data penggunaan air ke database
    const data = await prisma.waterUsage.create({
      data: {
        forward,
        backward,
        cumulative,
        deviceId: device.id
      }
    });

    res.status(201).json({
      status: 'success',
      message: 'Water usage data received',
      data: {
        id: data.id,
        forward: data.forward,
        backward: data.backward,
        cumulative: data.cumulative,
        timestamp: data.timestamp
      }
    });

  } catch (error) {
    console.error('[IoT Error]', error);
    res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to save water usage data'
    });
  }
});

export default router;