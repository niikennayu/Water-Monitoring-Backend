import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { DashboardController } from '../controllers/DashboardController.js';


const router = express.Router();

/**
 * Dashboard Routes
 */

router.get(
  '/',
  authMiddleware,
  DashboardController.getDashboard
);

router.get(
  '/chart',
  authMiddleware,
  DashboardController.getWaterUsageChart
);

router.get(
  '/admin',
  authMiddleware,
  DashboardController.getAdminStats
);

router.get(
  '/customer/:deviceId',
  authMiddleware,
  DashboardController.getDeviceStats
);

/**
 * Admin chart
 */
router.get(
  '/admin/chart',
  authMiddleware,
  DashboardController.getAdminChart
);

/**
 * Payment status
 */
router.get(
  '/admin/payment-status',
  authMiddleware,
 DashboardController.getPaymentStatus
);

router.get(
  "/monthly-volume",
  authMiddleware,
  DashboardController.getMonthlyVolume
);

router.get(
  "/current-bill",
  authMiddleware,
  DashboardController.getCurrentBill
);

export default router;