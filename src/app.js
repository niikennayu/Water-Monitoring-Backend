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
import userRoutes from './routes/users.js';
import adminRoutes from "./routes/admin.js";


dotenv.config();

const app = express();

/*const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(limiter);
*/

app.use(helmet());
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,
}))
app.use(cors());
app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(responseHandler);

app.use('/api/v1/payment', paymentRoutes);

app.use(responseHandler);

app.use('/api/users', userRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/customers', customerRoutes);
app.use('/api/v1/devices', deviceRoutes);
app.use('/api/v1/iot', iotRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/billing', billingRoutes);
app.use('/api/v1/admin', adminRoutes);


app.use(errorHandler);

export default app;