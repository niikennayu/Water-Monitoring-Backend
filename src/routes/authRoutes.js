import express from 'express';
import { AuthController } from '../controllers/AuthController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * Authentication Routes
 *
 * Public routes:
 * - POST /api/v1/auth/register - Register new user
 * - POST /api/v1/auth/login - Login user
 *
 * Protected routes:
 * - GET /api/v1/auth/me - Get current user profile
 * - POST /api/v1/auth/logout - Logout user
 */

// Public routes
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

// Protected routes (require valid JWT token)
router.get('/me', authMiddleware, AuthController.getCurrentUser);
router.post('/logout', authMiddleware, AuthController.logout);

export default router;
