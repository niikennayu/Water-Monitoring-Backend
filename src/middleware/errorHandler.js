import Logger from '../utils/logger.js';

// Custom error class
export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Async error wrapper for controllers
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Error handling middleware
export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  Logger.error('Request error', {
    message: err.message,
    statusCode: err.statusCode,
    path: req.originalUrl,
    method: req.method
  });

  // Prisma specific errors
  if (err.code === 'P2002') {
    const field = err.meta?.target?.[0] || 'unknown';
    err.message = `${field} already exists`;
    err.statusCode = 409;
  }

  if (err.code === 'P2025') {
    err.message = 'Record not found';
    err.statusCode = 404;
  }

  res.status(err.statusCode).json({
    status: 'error',
    message: err.message,
    statusCode: err.statusCode,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
