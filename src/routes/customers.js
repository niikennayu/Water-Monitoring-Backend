import express from 'express';
import { UserController } from '../controllers/UserController.js';

const router = express.Router();

/**
 * Customer Routes (Users Management)
 *
 * - GET /api/v1/customers - Get all users/customers
 * - GET /api/v1/customers/:id - Get customer by ID
 * - POST /api/v1/customers - Create new customer
 * - PUT /api/v1/customers/:id - Update customer
 * - DELETE /api/v1/customers/:id - Delete customer
 */

router.get('/', UserController.getAllUsers);
router.get('/number/:customer_number', UserController.getUserByCustomerNumber);
router.get('/:id', UserController.getUserById);
router.post('/', UserController.createUser);
router.put('/:id', UserController.updateUser);
router.delete('/:id', UserController.deleteUser);

export default router;
