import { AuthService } from '../services/AuthService.js';
import { AppError } from './errorHandler.js';
import Logger from '../utils/logger.js';

/**
 * Middleware untuk verify JWT token dan attach user ke request object
 * Gunakan middleware ini untuk protect routes yang memerlukan authentication
 */
export const authMiddleware = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AppError('Authorization header is missing', 401);
    }

    // Extract token from "Bearer <token>"
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      throw new AppError('Invalid authorization header format. Use: Bearer <token>', 401);
    }

    const token = parts[1];

    // Verify token
    const decoded = AuthService.verifyToken(token);

    // Attach user info ke request object
    req.user = {
      id: decoded.id,
      email: decoded.email,
    };

    Logger.debug('Token verified', {
      userId: decoded.id,
      email: decoded.email,
    });

    next();
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        status: 'error',
        message: error.message,
        statusCode: error.statusCode,
      });
    }

    Logger.error('Auth middleware error', error);
    return res.status(500).json({
      status: 'error',
      message: 'Authentication failed',
      statusCode: 500,
    });
  }
};

/**
 * Optional: Middleware untuk allow optional authentication
 * Jika token valid, attach user ke request. Jika tidak, lanjutkan tanpa user
 */
export const optionalAuthMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const parts = authHeader.split(' ');
      if (parts.length === 2 && parts[0] === 'Bearer') {
        const token = parts[1];
        const decoded = AuthService.verifyToken(token);
        req.user = {
          id: decoded.id,
          email: decoded.email,
        };
        Logger.debug('Optional token verified', {
          userId: decoded.id,
          email: decoded.email,
        });
      }
    }

    next();
  } catch (error) {
    // Ignore token errors untuk optional auth
    Logger.debug('Optional auth skipped', { reason: error.message });
    next();
  }
};

/**
 * Middleware untuk verify role-based access (optional extension)
 * Gunakan setelah authMiddleware untuk protect dengan role based access
 */
export const roleMiddleware = (allowedRoles = []) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      // Role check dapat diimplementasikan jika menambah role field ke User model
      // const userRole = req.user.role;
      // if (!allowedRoles.includes(userRole)) {
      //   throw new AppError('Access denied. Insufficient permissions', 403);
      // }

      next();
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          status: 'error',
          message: error.message,
          statusCode: error.statusCode,
        });
      }

      Logger.error('Role middleware error', error);
      return res.status(500).json({
        status: 'error',
        message: 'Role verification failed',
        statusCode: 500,
      });
    }
  };
};
