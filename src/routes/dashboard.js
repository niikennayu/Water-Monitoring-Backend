import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { DashboardController } from '../controllers/DashboardController.js';

const router = express.Router();

/**
 * Dashboard Routes
 * 
 * GET /api/v1/dashboard       - Get dashboard summary (latest data)
 * GET /api/v1/dashboard/chart - Get historical data for charting (sorted ASC)
 */

router.get('/', authMiddleware, DashboardController.getDashboard);
router.get('/chart', authMiddleware, DashboardController.getChartData);
router.get('/admin', authMiddleware, DashboardController.getAdminStats);
router.get('/customer/:deviceId', authMiddleware, DashboardController.getDeviceStats);

export default router;