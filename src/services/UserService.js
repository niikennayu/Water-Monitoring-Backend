import prisma from '../config/db.js';
import { AppError } from '../middleware/errorHandler.js';
import Logger from '../utils/logger.js';

// Service layer - contains business logic
export class UserService {
  static async getAllUsers() {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          customer_number: true,
          address: true,
          phone: true,
          createdAt: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      return users;
    } catch (error) {
      Logger.error('Error fetching users', error);
      throw new AppError('Failed to fetch users', 500);
    }
  }

  static async getUserById(id) {
    try {
      const user = await prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          customer_number: true,
          address: true,
          phone: true,
          createdAt: true,
          updatedAt: true
        }
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      return user;
    } catch (error) {
      if (error instanceof AppError) throw error;
      Logger.error('Error fetching user', error);
      throw new AppError('Failed to fetch user', 500);
    }
  }

  static async createUser(data) {
    try {
      const { email, name } = data;

      const user = await prisma.user.create({
        data: {
          email,
          name
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          customer_number: true,
          address: true,
          phone: true,
          createdAt: true
        }
      });

      Logger.info('User created', { userId: user.id, email: user.email });
      return user;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new AppError('Email already exists', 409);
      }
      Logger.error('Error creating user', error);
      throw new AppError('Failed to create user', 500);
    }
  }

  static async updateUser(id, data) {
    try {
      const user = await prisma.user.update({
        where: { id },
        data: {
          ...(data.email && { email: data.email }),
          ...(data.name && { name: data.name })
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          customer_number: true,
          address: true,
          phone: true,
          updatedAt: true
        }
      });

      Logger.info('User updated', { userId: user.id });
      return user;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new AppError('User not found', 404);
      }
      Logger.error('Error updating user', error);
      throw new AppError('Failed to update user', 500);
    }
  }

  static async deleteUser(id) {
    try {
      await prisma.user.delete({
        where: { id }
      });

      Logger.info('User deleted', { userId: id });
      return { message: 'User deleted successfully' };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new AppError('User not found', 404);
      }
      Logger.error('Error deleting user', error);
      throw new AppError('Failed to delete user', 500);
    }
  }
}
