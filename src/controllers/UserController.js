import { UserService } from '../services/UserService.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';

// Controller layer - handles HTTP requests and responses
export class UserController {
  static getAllUsers = asyncHandler(async (req, res) => {
    const users = await UserService.getAllUsers();
    res.success(users, 'Users fetched successfully', 200);
  });

  static getUserById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id || id.trim() === '') {
      throw new AppError('User ID is required', 400);
    }

    const user = await UserService.getUserById(id);
    res.success(user, 'User fetched successfully', 200);
  });

  static getUserByCustomerNumber = asyncHandler(async (req, res) => {
    const { customer_number } = req.params;

    if (!customer_number || customer_number.trim() === '') {
      throw new AppError('Customer number is required', 400);
    }

    const user = await UserService.getUserByCustomerNumber(customer_number);
    res.success(user, 'Customer fetched successfully', 200);
  });

  static createUser = asyncHandler(async (req, res) => {
    const { email, name } = req.body;

    // Basic validation
    if (!email || email.trim() === '') {
      throw new AppError('Email is required', 400);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new AppError('Invalid email format', 400);
    }

    const user = await UserService.createUser({ email, name });
    res.success(user, 'User created successfully', 201);
  });

  static updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { email, name } = req.body;

    if (!id || id.trim() === '') {
      throw new AppError('User ID is required', 400);
    }

    if (!email && !name) {
      throw new AppError('At least one field (email or name) is required', 400);
    }

    const user = await UserService.updateUser(id, { email, name });
    res.success(user, 'User updated successfully', 200);
  });

  static deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id || id.trim() === '') {
      throw new AppError('User ID is required', 400);
    }

    const result = await UserService.deleteUser(id);
    res.success(result, 'User deleted successfully', 200);
  });
}
