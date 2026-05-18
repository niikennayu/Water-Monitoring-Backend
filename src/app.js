import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

import { responseHandler } from './middleware/responseHandler.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/auth.js';
import customerRoutes from './routes/customers.js';
import deviceRoutes from './routes/devices.js';
import iotRoutes from './routes/iot.js';
import dashboardRoutes from './routes/dashboard.js';
import billingRoutes from './routes/billing.js';
import paymentRoutes from './routes/payment.js';

dotenv.config();

const app = express();

// --- 1. MIDDLEWARE KEAMANAN & LOGGING ---

// Membatasi jumlah request untuk mencegah Brute Force/DDoS
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 100, // Maksimal 100 request per IP per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use(limiter);

// Helmet untuk keamanan header HTTP
app.use(helmet());

// CORS agar Frontend (React/Vue/Flutter) bisa mengakses API ini
app.use(cors());

// Morgan untuk logging setiap request yang masuk ke terminal
app.use(morgan('dev'));

// Parsing body request (JSON dan URL-Encoded)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- 2. CUSTOM MIDDLEWARE ---

// Menyeragamkan format response (success/error)
app.use(responseHandler);

// --- 3. ROUTES ---

// Health Check untuk memastikan server berjalan
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    timestamp: new Date().toISOString(),
    message: 'Water Monitoring API is healthy'
  });
});

// Daftar Endpoint API v1
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/customers', customerRoutes);
app.use('/api/v1/devices', deviceRoutes);
app.use('/api/v1/iot', iotRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/billing', billingRoutes);
app.use('/api/v1/payment', paymentRoutes);

// --- 4. ERROR HANDLING ---

// Middleware untuk menangkap error yang tidak tertangani
app.use(errorHandler);

export default app;