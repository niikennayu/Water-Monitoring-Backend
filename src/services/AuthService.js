import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../config/db.js';
import { AppError } from '../middleware/errorHandler.js';
import Logger from '../utils/logger.js';

export class AuthService {
  static async register(data) {
    try {
      const { email, password, passwordConfirm, name } = data;

      // Validate input
      if (!email || !password || !passwordConfirm) {
        throw new AppError('Email, password, and password confirmation are required', 400);
      }

      if (password !== passwordConfirm) {
        throw new AppError('Passwords do not match', 400);
      }

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

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name: name || null,
        },
        select: {
          id: true,
          email: true,
          name: true,
          createdAt: true,
        },
      });

      Logger.info('User registered successfully', { userId: user.id, email: user.email });

      // Generate JWT token
      const token = this.generateToken(user.id, user.email);

      return {
        user,
        token,
      };
    } catch (error) {
      console.error('Error during registration:', error);
      throw error;
    }
  }

  static async login(data) {
    try {
      const { email, password } = data;

      // Validate input
      if (!email || !password) {
        throw new AppError('Email and password are required', 400);
      }

      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new AppError('Invalid credentials', 401);
      }

      // Compare passwords
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        throw new AppError('Invalid credentials', 401);
      }

      Logger.info('User logged in successfully', { userId: user.id, email: user.email });

      // Generate JWT token
      const token = this.generateToken(user.id, user.email);

      // Return user without password
      const { password: _, ...userWithoutPassword } = user;

      return {
        user: {
          ...userWithoutPassword,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        token,
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      Logger.error('Error during login', error);
      throw new AppError('Failed to login', 500);
    }
  }

  static generateToken(userId, email) {
    const token = jwt.sign(
      { id: userId, email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    return token;
  }

  static verifyToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new AppError('Token has expired', 401);
      }
      if (error.name === 'JsonWebTokenError') {
        throw new AppError('Invalid token', 401);
      }
      throw new AppError('Token verification failed', 401);
    }
  }

  static async getCurentUser(userId) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
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
