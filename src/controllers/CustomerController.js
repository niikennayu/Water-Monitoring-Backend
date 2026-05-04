import prisma from '../config/db.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export class CustomerController {

  static getProfile = asyncHandler(async (req, res) => {
    const userId = req.user.id;

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
        updatedAt: true
      }
    });

    if (!user) {
      return res.error('User not found', 404);
    }

    res.success(user, 'Profile fetched', 200);
  });
}