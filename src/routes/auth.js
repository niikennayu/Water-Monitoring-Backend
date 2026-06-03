import express from 'express';
import { AuthController } from '../controllers/AuthController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * Public Routes
 */
router.post('/register', AuthController.register);

router.post('/login', AuthController.login);

router.post(
  '/forgot-password',
  AuthController.forgotPassword
);

router.post(
  '/reset-password',
  AuthController.resetPassword
);

/**
 * Protected Routes
 */
router.get(
  '/me',
  authMiddleware,
  AuthController.getCurrentUser
);

router.post(
  '/logout',
  authMiddleware,
  AuthController.logout
);

export default router;