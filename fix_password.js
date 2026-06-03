import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function fix() {
  const hashedPassword = await bcrypt.hash("password123", 10);
  const result = await prisma.user.updateMany({
    where: { email: "admin@aquora.com" },
    data: { password: hashedPassword }
  });
  console.log("Updated", result.count, "user(s). Password for admin@aquora.com has been correctly hashed!");
}

fix().finally(() => prisma.$disconnect());
