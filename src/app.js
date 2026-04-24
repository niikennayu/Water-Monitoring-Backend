import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { responseHandler } from './middleware/responseHandler.js';
import { errorHandler } from './middleware/errorHandler.js';

// Import new route files with new naming convention
import authRoutes from './routes/auth.js';
import customerRoutes from './routes/customers.js';
import deviceRoutes from './routes/devices.js';
import iotRoutes from './routes/iot.js';
import dashboardRoutes from './routes/dashboard.js';
import billingRoutes from './routes/billing.js';
import paymentRoutes from './routes/payment.js';

dotenv.config();

const app = express();

// ============================================
// Middleware - Security
// ============================================
app.use(helmet()); // Secure HTTP headers
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ============================================
// Middleware - Logging
// ============================================
const morganFormat = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
app.use(morgan(morganFormat));

// ============================================
// Middleware - Body Parser
// ============================================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// ============================================
// Middleware - Response Handler
// ============================================
app.use(responseHandler);

// ============================================
// Health Check Route
// ============================================
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// ============================================
// API Routes
// ============================================
app.get('/api/v1', (req, res) => {
  res.json({
    message: 'Water Monitoring System API',
    version: process.env.API_VERSION || 'v1',
    status: 'running'
  });
});

// Mount all routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/customers', customerRoutes);
app.use('/api/v1/devices', deviceRoutes);
app.use('/api/v1/iot', iotRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/billing', billingRoutes);
app.use('/api/v1/payment', paymentRoutes);

// ============================================
// 404 Handler
// ============================================
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// ============================================
// Global Error Handler
// ============================================
app.use(errorHandler);

export default app;
