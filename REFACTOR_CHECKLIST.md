## ✅ Refactor Completion Checklist

Berikut adalah langkah-langkah yang sudah dilakukan dan yang perlu Anda lakukan untuk menyelesaikan refactor:

### ✅ Sudah Dilakukan

1. **✅ Rename Route Files**
   - Buat file-file baru dengan naming convention yang benar:
     - `src/routes/auth.js` (dari authRoutes.js)
     - `src/routes/customers.js` (dari userRoutes.js)
     - `src/routes/devices.js` (dari deviceRoute.js)
     - `src/routes/iot.js` (dari iotRoutes.js)
     - `src/routes/dashboard.js` (dari dashboardRoutes.js)
   - ✅ DONE

2. **✅ Buat Route Files Baru**
   - `src/routes/billing.js` - Untuk mengelola tagihan
   - `src/routes/payment.js` - Untuk mengelola pembayaran
   - ✅ DONE

3. **✅ Update app.js**
   - Import dari routes baru
   - Update mountpoints
   - ✅ DONE

4. **✅ Update IoT Endpoint**
   - Terima parameter: device_id, forward, backward
   - Hitung cumulative = forward - backward di backend
   - ✅ DONE (iotRoutes.js diupdate, dan iot.js dibuat)

5. **✅ Perbaiki Dashboard**
   - Ganti dari MongoDB queries ke Prisma queries
   - Include data bills dan payment summary
   - ✅ DONE

6. **✅ Update Database Schema**
   - Update Prisma schema.prisma
   - Tambahkan Customer fields (customer_number, address, phone)
   - Tambahkan Bill model
   - Tambahkan Payment model
   - Update WaterUsage untuk forward/backward/cumulative
   - ✅ DONE

7. **✅ Buat Migration**
   - File: `prisma/migrations/20260424120000_add_billing_payment_update_schema/migration.sql`
   - ✅ DONE

### 🔧 Perlu Dilakukan di Sisi Anda

1. **PENTING: Hapus File Routes Lama**
   ```bash
   # Gunakan terminal atau file explorer untuk menghapus:
   rm src/routes/authRoutes.js
   rm src/routes/userRoutes.js
   rm src/routes/deviceRoute.js
   rm src/routes/iotRoutes.js
   rm src/routes/dashboardRoutes.js
   
   # Atau: Buka folder src/routes di VS Code dan delete manual
   ```

2. **Run Prisma Migration**
   ```bash
   # Sebelum menjalankan server, apply migration:
   npx prisma migrate deploy
   
   # Atau untuk development (akan prompt):
   npx prisma migrate dev --name "add_billing_payment_update_schema"
   ```

3. **Verify File Structure**
   ```
   src/routes/ seharusnya berisi:
   ✅ auth.js
   ✅ customers.js
   ✅ devices.js
   ✅ iot.js
   ✅ dashboard.js
   ✅ billing.js
   ✅ payment.js
   
   ❌ authRoutes.js (DELETE)
   ❌ userRoutes.js (DELETE)
   ❌ deviceRoute.js (DELETE)
   ❌ iotRoutes.js (DELETE)
   ❌ dashboardRoutes.js (DELETE)
   ```

4. **Test API Endpoints**
   
   a. **Test IoT Endpoint** (POST)
   ```bash
   curl -X POST http://localhost:3000/api/v1/iot/water-usage \
     -H "Content-Type: application/json" \
     -H "x-api-key: YOUR_DEVICE_API_KEY" \
     -d '{
       "device_id": "YOUR_DEVICE_ID",
       "forward": 12345.67,
       "backward": 100.50
     }'
   ```
   
   b. **Test Dashboard** (GET - Protected)
   ```bash
   curl -X GET http://localhost:3000/api/v1/dashboard \
     -H "Authorization: Bearer YOUR_JWT_TOKEN"
   ```
   
   c. **Test Billing** (GET - Protected)
   ```bash
   curl -X GET http://localhost:3000/api/v1/billing \
     -H "Authorization: Bearer YOUR_JWT_TOKEN"
   ```
   
   d. **Test Payment** (POST - Protected)
   ```bash
   curl -X POST http://localhost:3000/api/v1/payment \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_JWT_TOKEN" \
     -d '{
       "bill_id": "BILL_ID",
       "amount": 150000,
       "payment_method": "transfer"
     }'
   ```

5. **Verify Database**
   
   Cek apakah tabel baru sudah ada:
   ```sql
   -- Connect ke PostgreSQL
   SELECT * FROM bills;
   SELECT * FROM payments;
   SELECT * FROM water_usage WHERE forward IS NOT NULL;
   ```

6. **Update Environment Variables** (jika belum ada)
   
   Pastikan `.env` memiliki:
   ```
   DATABASE_URL=postgresql://user:password@localhost:5432/water_monitoring_db
   PORT=3000
   NODE_ENV=development
   JWT_SECRET=your_jwt_secret
   CORS_ORIGIN=http://localhost:3000,http://localhost:3001
   API_VERSION=v1
   ```

---

## 📋 Perubahan File yang Sudah Dibuat/Diupdate

### File Baru
- ✅ `src/routes/auth.js`
- ✅ `src/routes/customers.js`
- ✅ `src/routes/devices.js`
- ✅ `src/routes/iot.js`
- ✅ `src/routes/dashboard.js`
- ✅ `src/routes/billing.js`
- ✅ `src/routes/payment.js`
- ✅ `prisma/migrations/20260424120000_add_billing_payment_update_schema/migration.sql`

### File Diupdate
- ✅ `src/app.js` - Import dan mount routes baru
- ✅ `src/routes/iotRoutes.js` - Update endpoint untuk forward/backward
- ✅ `src/controllers/DashboardController.js` - Ganti ke Prisma queries
- ✅ `prisma/schema.prisma` - Tambah fields dan models baru

### File Harus Didelete
- ❌ `src/routes/authRoutes.js`
- ❌ `src/routes/userRoutes.js`
- ❌ `src/routes/deviceRoute.js`
- ❌ `src/routes/iotRoutes.js` (sudah di-rename ke iot.js)
- ❌ `src/routes/dashboardRoutes.js` (sudah di-rename ke dashboard.js)

---

## 🎯 Next Steps untuk Future Development

1. **Billing Automation** - Buat scheduler untuk auto-generate bills setiap bulan
2. **Xendit Integration** - Replace simulasi payment dengan real Xendit integration
3. **Water Usage Reports** - Tambah endpoint untuk laporan detail penggunaan per bulan
4. **SMS/Email Notifications** - Notify customer saat bill ready atau overdue
5. **Admin Dashboard** - Separate endpoint untuk admin view all customers
6. **Anomaly Detection** - (Optional per requirement: "Jangan Tambahkan")

---

## ⚠️ Penting

- **Jangan delete file lama sebelum verify struktur baru sudah benar**
- **Backup database sebelum run migration**
- **Test di development environment dulu sebelum production**
- **Semua billing dan payment endpoints memerlukan JWT authentication**
- **IoT endpoint memerlukan valid API key di header `x-api-key`**

---

## 📖 Dokumentasi

Baca file `REFACTOR_NOTES.md` untuk dokumentasi lengkap API endpoints, database schema, dan troubleshooting.

---

## ✨ Selesai!

Refactor struktur backend sudah selesai. Silakan ikuti checklist di atas untuk menyelesaikan setup, kemudian system siap untuk testing dan production deployment.
