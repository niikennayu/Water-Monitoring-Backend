import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import prisma from '../config/db.js';
import { AppError } from '../middleware/errorHandler.js';
import Logger from '../utils/logger.js';

export class AuthService {
  /**
   * Register a new user with role "customer" and auto-generated customer_number.
   * @param {Object} data - { email, password, passwordConfirmation, name, address, phone }
   */
  static async register(data) {
    const { email, password, passwordConfirmation, name, address, phone } = data;

    // Validate required fields
    if (!email || !password || !passwordConfirmation) {
      throw new AppError('Email, password, and password confirmation are required', 400);
    }

    // Validate password confirmation match
    if (password !== passwordConfirmation) {
      throw new AppError('Password and password confirmation do not match', 400);
    }

    // Validate password strength
    if (password.length < 6) {
      throw new AppError('Password must be at least 6 characters long', 400);
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError('Email already registered', 409);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate unique customer number (format: CUST-XXXXXXXX)
    const customerNumber = `CUST-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    // Create user with role "customer"
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
        address: address || null,
        phone: phone || null,
        role: 'customer',
        customer_number: customerNumber,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        customer_number: true,
        address: true,
        phone: true,
        createdAt: true,
      },
    });

    Logger.info('User registered successfully', { userId: user.id, email: user.email });

    // Generate JWT token (includes role for RBAC)
    const token = this.generateToken(user.id, user.email, user.role);

    return { user, token };
  }

  /**
   * Login user and return user data with role and customer_number.
   * @param {Object} data - { email, password }
   */
  static async login({ email, password }) {
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    throw new AppError('Email tidak ditemukan', 404);
  }

  // cek akun sudah aktif atau belum
  if (!user.isActive) {
    throw new AppError(
      'Akun belum diaktivasi',
      401
    );
  }

  // cek password
  const isPasswordValid = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordValid) {
    throw new AppError(
      'Password salah',
      401
    );
  }

  // generate JWT login
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '7d',
    }
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      unit: user.unit,
    },
  };
}
  /**
   * Generate JWT token with user id, email, and role.
   */
  static generateToken(userId, email, role) {
    if (!userId || !email) {
      throw new Error('generateToken requires userId and email');
    }

    return jwt.sign(
      { id: userId, email, role: role || 'customer' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
  }

  /**
   * Verify and decode JWT token.
   */
  static verifyToken(token) {
  try {

    console.log("TOKEN MASUK:", token);
    console.log("JWT SECRET:", process.env.JWT_SECRET);

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    console.log("DECODED:", decoded);

    return decoded;

  } catch (error) {

    console.log("VERIFY ERROR:", error.message);

    if (error.name === 'TokenExpiredError') {
      throw new AppError('Token has expired', 401);
    }

    if (error.name === 'JsonWebTokenError') {
      throw new AppError('Invalid token', 401);
    }

    throw new AppError(
      'Token verification failed',
      401
    );
  }
}

  /**
   * Get current user profile including role, customer_number, address, and phone.
   * @param {string} userId
   */
  static async getCurrentUser(userId) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          customer_number: true,
          address: true,
          phone: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      return user;
    } catch (error) {
      if (error instanceof AppError) throw error;
      Logger.error('Error fetching current user', error);
      throw new AppError('Failed to fetch user', 500);
    }
  }
}
