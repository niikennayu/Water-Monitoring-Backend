import prisma from '../config/db.js';
import { AppError } from '../middleware/errorHandler.js';
import { Invoice } from '../config/xendit.js';

export class BillingService {
  static async generateBillForDevice(uid, unitPrice = 12500) {
    // 1. Cari data device berdasarkan UID
    const device = await prisma.device.findUnique({
      where: { uid: uid }
    });

    if (!device) throw new AppError('Device not found', 404);

    // 2. Ambil data penggunaan air terakhir
    const lastUsage = await prisma.waterUsage.findFirst({
      where: { UID: uid },
      orderBy: { timestamp: 'desc' }
    });

    if (!lastUsage) throw new AppError('No water usage data found for this device', 404);

    // 3. Siapkan variabel waktu
    const now = new Date();
    const dueDate = new Date();
    dueDate.setDate(now.getDate() + 7); // Jatuh tempo 7 hari lagi

    const billNumber = `INV-${Date.now()}`;

    // Gunakan Math.abs (Absolute) agar angka tidak negatif
    // Dan pastikan cumulative dikonversi ke Number dengan benar
    const waterUsageValue = Math.abs(Number(lastUsage.cumulative || 0));

    // Jika angka cumulative terlalu besar, untuk test dibatasi dulu nominalnya
    // Misal hanya ambil 10 unit pertama agar nominal tidak Milyaran
    const totalAmount = Math.floor(waterUsageValue * unitPrice);

    // 4. INTEGRASI XENDIT
    // buat invoice di Xendit untuk dapat URL-nya
    let xenditInvoice;
    try {
      const finalAmount = totalAmount < 10000 ? 10000 : totalAmount;

      console.log(`Mengirim ke Xendit: ${billNumber} dengan nominal Rp ${finalAmount}`);

      xenditInvoice = await Invoice.createInvoice({
        data: {
          externalId: String(billNumber), // Coba camelCase
          amount: Number(finalAmount),
          description: `Tagihan Air UID: ${uid}`,
          payerEmail: "niken.ayu@example.com",
          invoiceDuration: 86400, // Gunakan Number bukan String
          currency: "IDR"
        }
      });
    } catch (error) {
      // Jika masih gagal, kita minta Xendit kasih tahu persisnya field apa yang salah
      if (error.response?.data) {
        console.error("Detail Validasi Xendit:", JSON.stringify(error.response.data, null, 2));
      } else {
        console.error("Error Detail:", error);
      }
      const errorMsg = error.response?.data?.message || error.message;
      throw new AppError(`Xendit Error: ${errorMsg}`, 500);
    }

    // 5. SIMPAN KE DATABASE
    const newBill = await prisma.bill.create({
      data: {
        billNumber: billNumber,
        id_user: device.deviceId,
        customer_number: device.deviceId,
        billingPeriod: now.toLocaleString('id-ID', { month: 'long', year: 'numeric' }),
        billingDate: now,
        dueDate: dueDate,
        waterUsage: waterUsageValue,
        unitPrice: unitPrice,
        totalAmount: totalAmount,
        status: 'PENDING',
        UID: uid,
        externalId: xenditInvoice.id,
        paymentUrl: xenditInvoice.invoiceUrl
      }
    });

    return newBill;
  }

  static async getBillsByUserId(userId) {
    return await prisma.bill.findMany({
      where: { id_user: userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  static async getAllBills() {
    return await prisma.bill.findMany({
      orderBy: { createdAt: 'desc' }
    });
  }
}