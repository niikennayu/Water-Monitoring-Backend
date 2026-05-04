import { AuthService } from '../services/AuthService.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';

/**
 * AuthController - Handles HTTP requests for authentication.
 * Delegates business logic to AuthService (Separation of Concerns).
 */
export class AuthController {
  /**
   * POST /api/v1/auth/register
   * Register a new customer with full profile data.
   */
  static register = asyncHandler(async (req, res) => {
    const { name, email, password, passwordConfirmation, address, phone } = req.body;

    // Validate required fields
    if (!email || !password || !passwordConfirmation) {
      throw new AppError('Email, password, and password confirmation are required', 400);
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new AppError('Invalid email format', 400);
    }

    // Validate password confirmation match (early return - DRY with service layer)
    if (password !== passwordConfirmation) {
      throw new AppError('Password and password confirmation do not match', 400);
    }

    const result = await AuthService.register({
      email,
      password,
      passwordConfirmation,
      name,
      address,
      phone,
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

  /**
   * POST /api/v1/auth/login
   * Authenticate user and return token with role & customer_number.
   */
  static login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      throw new AppError('Email and password are required', 400);
    }

    const result = await AuthService.login({ email, password });

    res.success(
      {
        user: result.user,
        token: result.token,
      },
      'Login successful',
      200
    );
  });

  /**
   * GET /api/v1/auth/me
   * Get current authenticated user profile (includes role, customer_number).
   */
  static getCurrentUser = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const user = await AuthService.getCurrentUser(userId);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    res.success(user, 'Current user fetched successfully', 200);
  });

  /**
   * POST /api/v1/auth/logout
   * Logout user (client-side token removal).
   */
  static logout = asyncHandler(async (req, res) => {
    // Token blacklisting dapat diimplementasikan di sini jika diperlukan
    // Untuk sekarang, logout hanya menghapus token dari client side
    res.success(null, 'You have been logged out', 200);
  });
}
