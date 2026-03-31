import { AuthService } from '../services/AuthService.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';

// Controller layer - handles HTTP requests and responses
export class AuthController {
  static register = asyncHandler(async (req, res) => {
    const { email, password, passwordConfirm, name } = req.body;

    // Validate required fields
    if (!email || !password || !passwordConfirm) {
      throw new AppError('Email, password, and password confirmation are required', 400);
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new AppError('Invalid email format', 400);
    }

    const result = await AuthService.register({
      email,
      password,
      passwordConfirm,
      name,
    });

    res.success(
      {
        user: result.user,
        token: result.token,
      },
      'User registered successfully',
      201
    );
  });

  static login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      throw new AppError('Email and password are required', 400);
    }

    const result = await AuthService.login({
      email,
      password,
    });

    res.success(
      {
        user: result.user,
        token: result.token,
      },
      'Login successful',
      200
    );
  });

  static getCurrentUser = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const user = await AuthService.getCurentUser(userId);

    res.success(user, 'Current user fetched successfully', 200);
  });

  static logout = asyncHandler(async (req, res) => {
    // Token blacklisting dapat diimplementasikan di sini jika diperlukan
    // Untuk sekarang, logout hanya menghapus token dari client side
    res.success(
      { message: 'Logout successful' },
      'You have been logged out',
      200
    );
  });
}
