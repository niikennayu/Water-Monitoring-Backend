import jwt from 'jsonwebtoken';
import { UserService } from '../services/UserService.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';

export class UserController {
  static getAllUsers = asyncHandler(async (req, res) => {
    const users = await UserService.getAllUsers();
    res.success(users, 'Users fetched successfully', 200);
  });

  static getUserById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id || id.trim() === '') throw new AppError('User ID is required', 400);
    const user = await UserService.getUserById(id);
    res.success(user, 'User fetched successfully', 200);
  });

  static getUserByCustomerNumber = asyncHandler(async (req, res) => {
    const { customer_number } = req.params;
    if (!customer_number || customer_number.trim() === '')
      throw new AppError('Customer number is required', 400);
    const user = await UserService.getUserByCustomerNumber(customer_number);
    res.success(user, 'Customer fetched successfully', 200);
  });

  static createUser = asyncHandler(async (req, res) => {
    const { email, name, unit, address, phone, role } = req.body;

    // ── Validasi ──────────────────────────────────────────
    if (!email || email.trim() === '')
      throw new AppError('Email is required', 400);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      throw new AppError('Invalid email format', 400);

    if (!unit || unit.trim() === '')
      throw new AppError('Unit is required', 400);

    // ── Generate token & password ─────────────────────────
    const activationToken = jwt.sign(
  {
    email,
    name,
    unit: unit || "A-12",
  },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
);

    const randomPassword = Math.random().toString(36).slice(-10);

    // ── Simpan ke DB ──────────────────────────────────────
    const user = await UserService.createUser({
      email,
      name,
      unit,       // ← pastikan kolom unit ada di schema Prisma
      address,
      phone,
      password: randomPassword,
      role,
      activationToken,
      isActive: false,
    });


    res.success(user, 'User created and activation email sent', 201);
  });

  static updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { email, name } = req.body;

    if (!id || id.trim() === '')
      throw new AppError('User ID is required', 400);

    if (!email && !name)
      throw new AppError('At least one field (email or name) is required', 400);

    const user = await UserService.updateUser(id, { email, name });
    res.success(user, 'User updated successfully', 200);
  });

  static deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    if (!id || id.trim() === '')
      throw new AppError('User ID is required', 400);
    const result = await UserService.deleteUser(id);
    res.success(result, 'User deleted successfully', 200);
  });
}