import { BillingService } from './src/services/BillingService.js';

async function test() {
  try {
    console.log("--------------------------------------------------");
    console.log("Memulai Test Integrasi Xendit...");
    console.log("--------------------------------------------------");
    
    // Kita gunakan UID device P0001 (4898-9916-26) untuk mencoba data asli Mei 2025
    const uid = '4898-9916-26'; 
    const result = await BillingService.generateBillForDevice(uid);
    
    console.log("Berhasil Membuat Invoice!");
    console.log(`Bill Number: ${result.billNumber}`);
    console.log(`Total: Rp ${result.totalAmount.toLocaleString('id-ID')}`);
    console.log(`Link Pembayaran: ${result.paymentUrl}`);
    console.log("--------------------------------------------------");
    console.log("Silakan buka link di atas untuk melihat tampilan invoice Xendit.");
    
  } catch (err) {
    console.error("Terjadi Kesalahan:", err.message);
  }
}

test();