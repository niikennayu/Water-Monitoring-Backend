import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { responseHandler } from './middleware/responseHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import deviceRoutes from './routes/deviceRoute.js';
import iotRoutes from './routes/iotRoutes.js';

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

// Mount auth routes
app.use('/api/v1/auth', authRoutes);

// Mount user routes
app.use('/api/v1/users', userRoutes);

// Mount device routes
app.use('/api/v1/devices', deviceRoutes);

// Mount IoT routes
app.use('/api/v1/iot', iotRoutes);

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
