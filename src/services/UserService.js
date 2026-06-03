import prisma from '../config/db.js';
import { AppError } from '../middleware/errorHandler.js';
import Logger from '../utils/logger.js';
import bcrypt from 'bcrypt';

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

  static async getUserByCustomerNumber(customer_number) {
    try {
      const user = await prisma.user.findUnique({
        where: { customer_number },
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
        throw new AppError('Customer not found', 404);
      }

      return user;
    } catch (error) {
      if (error instanceof AppError) throw error;
      Logger.error('Error fetching customer by number', error);
      throw new AppError('Failed to fetch customer', 500);
    }
  }

  static async createUser(data) {
    try {
      const {
  email,
  name,
  address,
  phone,
  password,
  role,
  activationToken,
  isActive
} = data;

const existingUser = await prisma.user.findFirst({
  where: {
    OR: [
      { email },
      { customer_number: data.customer_number }
    ]
  }
});

if (existingUser) {
  throw new AppError(
    'Email or Customer Number already exists',
    409
  );
}

      const hashedPassword = await bcrypt.hash(password, 10);
      const customerNumber = `CUST-${Date.now()}`;

      const user = await prisma.user.create({
        data: {
          email,
          name,
          address,
          phone,
          password: hashedPassword,
          role: role || 'customer',
          customer_number: customerNumber,
          activationToken,
          isActive
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
      Logger.error('Detailed Error creating user:', error);
      if (error.code === 'P2002') {
        throw new AppError('Email or Customer Number already exists', 409);
      }
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
