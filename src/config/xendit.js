import { Xendit } from 'xendit-node';
import dotenv from 'dotenv';

dotenv.config();

const xenditClient = new Xendit({
  secretKey: process.env.XENDIT_SECRET_KEY,
});

// Export Invoice agar bisa dipakai di Service
export const Invoice = xenditClient.Invoice;

export default xenditClient;