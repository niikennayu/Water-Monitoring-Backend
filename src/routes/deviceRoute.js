import express from 'express';
import { DeviceController } from '../controllers/DeviceController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, DeviceController.create);
router.get('/', authMiddleware, DeviceController.getAll);

export default router;