import express from 'express';
import { IoTController } from '../controllers/IoTController.js';

const router = express.Router();

/**
 * IoT Routes
 *
 * POST /api/v1/iot/water-usage - Receive water usage data from IoT devices
 *
 * Security: IoTController handles x-api-key validation internally
 * (no separate apiKeyMiddleware needed — controller validates deviceId ↔ apiKey match)
 */
router.post('/water-usage', IoTController.sendWaterUsage);
router.get('/:deviceId', IoTController.getWaterUsageByDevice);

export default router;