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

// Static routes first
router.post('/customer', authMiddleware, DeviceController.getDevicesByCustomer);

// Dynamic routes and other verbs
router.post('/', authMiddleware, DeviceController.createDevice);
router.get('/', authMiddleware, DeviceController.getAllDevices);

export default router;
