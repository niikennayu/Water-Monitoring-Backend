import prisma from '../config/db.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export class CustomerController {

  static getProfile = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    res.success(user, 'Profile fetched', 200);
  });
}