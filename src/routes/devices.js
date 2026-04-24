import express from 'express';
import { DeviceController } from '../controllers/DeviceController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * Device Management Routes
 *
 * Protected routes (require JWT authentication):
 * - POST /api/v1/devices - Create new device
 * - GET /api/v1/devices - Get all devices for current user
 */

router.post('/', authMiddleware, DeviceController.create);
router.get('/', authMiddleware, DeviceController.getAll);

export default router;
