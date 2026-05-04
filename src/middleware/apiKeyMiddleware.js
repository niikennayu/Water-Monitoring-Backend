import prisma from '../config/db.js';
import Logger from '../utils/logger.js';

/**
 * API Key Middleware
 * Validates the x-api-key header against registered devices in the database.
 * If valid, attaches the device object to req.device for downstream use.
 *
 * Note: This middleware is a general-purpose API key validator.
 * For IoT endpoints that need deviceId ↔ apiKey cross-validation,
 * the IoTController handles validation internally.
 */
const apiKeyMiddleware = async (req, res, next) => {
  try {
    const apiKey = req.headers['x-api-key'];

    // Validate API key presence
    if (!apiKey) {
      return res.status(401).json({
        status: 'error',
        message: 'API key is missing',
      });
    }

    // Find device by API key
    const device = await prisma.device.findUnique({
      where: { apiKey },
    });

    if (!device) {
      Logger.warn('Invalid API key attempt', { apiKey: apiKey.substring(0, 8) + '...' });
      return res.status(403).json({
        status: 'error',
        message: 'Invalid API key',
      });
    }

    // Attach device to request for downstream handlers
    req.device = device;
    next();
  } catch (error) {
    Logger.error('API key middleware error', error);
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
};

export default apiKeyMiddleware;