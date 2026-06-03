import { AuthService } from '../services/AuthService.js';
import { AppError } from './errorHandler.js';
import Logger from '../utils/logger.js';

/**
 * Middleware untuk verify JWT token dan attach user ke request object.
 * JWT payload sekarang berisi { id, email, role } — role di-attach ke req.user.
 */
export const authMiddleware = (req, res, next) => {
  console.log(
  "AUTH HEADER:",
  req.headers.authorization
);
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AppError('Authorization header is missing', 401);
    }

    // Extract token from "Bearer <token>"
    if (!authHeader.startsWith('Bearer ')) {
      throw new AppError('Invalid authorization header format. Use: Bearer <token>', 401);
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = AuthService.verifyToken(token);

    if (!decoded || !decoded.id) {
      throw new AppError('Invalid token payload', 401);
    }

    // Attach user info ke request object (includes role from JWT)
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role || 'customer',
    };

    if (process.env.NODE_ENV !== 'production') {
      Logger.debug('Token verified', {
        userId: decoded.id,
        email: decoded.email,
        role: decoded.role,
      });
    }

    next();
  } catch (error) {
    // Handle custom AppError
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        status: 'error',
        message: error.message,
      });
    }

    // Handle JWT errors (invalid / expired)
    if (
      error.name === 'JsonWebTokenError' ||
      error.name === 'TokenExpiredError'
    ) {
      return res.status(401).json({
        status: 'error',
        message: 'Invalid or expired token',
      });
    }

    // Unknown Error (server error)
    Logger.error('Auth middleware error', error);
    return res.status(500).json({
      status: 'error',
      message: 'Authentication failed',
    });
  }
};

/**
 * Optional: Middleware untuk allow optional authentication.
 * Jika token valid, attach user ke request. Jika tidak, lanjutkan tanpa user.
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
          role: decoded.role || 'customer',
        };
        Logger.debug('Optional token verified', {
          userId: decoded.id,
          email: decoded.email,
          role: decoded.role,
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
 * Middleware untuk role-based access control (RBAC).
 * Gunakan setelah authMiddleware untuk restrict akses berdasarkan role.
 *
 * Usage: router.get('/admin', authMiddleware, roleMiddleware(['admin']), handler)
 *
 * @param {string[]} allowedRoles - Array of allowed role strings (e.g., ['admin', 'customer'])
 */
export const roleMiddleware = (allowedRoles = []) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      const userRole = req.user.role;

      if (!allowedRoles.includes(userRole)) {
        throw new AppError('Access denied. Insufficient permissions.', 403);
      }

      next();
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          status: 'error',
          message: error.message,
        });
      }

      Logger.error('Role middleware error', error);
      return res.status(500).json({
        status: 'error',
        message: 'Role verification failed',
      });
    }
  };
};

/**
 * Middleware khusus untuk memverifikasi role admin.
 * Jika bukan admin, mengembalikan status 403 Forbidden.
 */
export const isAdmin = roleMiddleware(['admin']);
