# Water Monitoring System API - Dokumentasi Refactor

## 📋 Ringkasan Perubahan

Refactor backend telah selesai dengan fokus pada:
- ✅ Naming convention yang konsisten untuk route files
- ✅ Struktur modular berbasis folder routes
- ✅ Perbaikan IoT endpoint (forward, backward, cumulative)
- ✅ Dashboard endpoint yang berfungsi dengan Prisma
- ✅ Penambahan module Billing dan Payment
- ✅ Update database schema dengan migrations

---

## 📁 Struktur Folder Routes

```
src/routes/
├── auth.js          # Authentication (login, register, logout)
├── customers.js     # Customer/User management
├── devices.js       # Device management
├── iot.js           # IoT data ingestion (water meter readings)
├── dashboard.js     # Dashboard data
├── billing.js       # Billing/Invoice management
└── payment.js       # Payment processing (Xendit simulation)
```

### File-file yang Sudah Di-rename

| File Lama | File Baru |
|-----------|-----------|
| authRoutes.js | auth.js |
| userRoutes.js | customers.js |
| deviceRoute.js | devices.js |
| iotRoutes.js | iot.js |
| dashboardRoutes.js | dashboard.js |

### File-file Baru

- `billing.js` - Endpoints untuk mengelola tagihan air
- `payment.js` - Endpoints untuk memproses pembayaran

---

## 🔌 Endpoints API

### 1. Authentication (`/api/v1/auth`)
```
POST   /api/v1/auth/register          - Daftar akun baru
POST   /api/v1/auth/login             - Login
GET    /api/v1/auth/me                - Ambil profil user saat ini (protected)
POST   /api/v1/auth/logout            - Logout (protected)
```

### 2. Customers (`/api/v1/customers`)
```
GET    /api/v1/customers              - Ambil semua customer
GET    /api/v1/customers/:id          - Ambil customer by ID
POST   /api/v1/customers              - Buat customer baru
PUT    /api/v1/customers/:id          - Update customer
DELETE /api/v1/customers/:id          - Delete customer
```

### 3. Devices (`/api/v1/devices`)
```
GET    /api/v1/devices                - Ambil semua device untuk user (protected)
POST   /api/v1/devices                - Buat device baru (protected)
```

### 4. IoT Data (`/api/v1/iot`)
```
POST   /api/v1/iot/water-usage        - Terima data sensor meter air
```
**Request Body:**
```json
{
  "device_id": "device-uuid",
  "forward": 12345.67,
  "backward": 100.50
}
```
**Response:**
```json
{
  "status": "success",
  "data": {
    "id": "usage-id",
    "forward": 12345.67,
    "backward": 100.50,
    "cumulative": 12245.17,
    "timestamp": "2026-04-24T12:00:00Z"
  }
}
```

### 5. Dashboard (`/api/v1/dashboard`)
```
GET    /api/v1/dashboard              - Ambil dashboard data (protected)
```
**Response:**
```json
{
  "status": "success",
  "data": {
    "customer": {
      "id": "...",
      "name": "...",
      "customer_number": "...",
      "address": "...",
      "phone": "..."
    },
    "summary": {
      "total_devices": 2,
      "active_devices": 2,
      "total_water_usage": 12245.17,
      "water_usage_unit": "liter",
      "total_bills": 3,
      "paid_bills": 2,
      "pending_bills": 1,
      "total_billed_amount": 450000,
      "total_paid_amount": 300000
    },
    "devices": [...],
    "latest_readings": [...],
    "recent_bills": [...]
  }
}
```

### 6. Billing (`/api/v1/billing`)
```
GET    /api/v1/billing                - Ambil semua bills untuk customer (protected)
GET    /api/v1/billing/:customer_number - Ambil bills by customer number (protected)
GET    /api/v1/billing/:id/detail     - Ambil detail bill (protected)
```

### 7. Payment (`/api/v1/payment`)
```
POST   /api/v1/payment                - Proses pembayaran (protected)
GET    /api/v1/payment/:payment_id    - Ambil detail pembayaran (protected)
PUT    /api/v1/payment/:payment_id    - Update status pembayaran (protected)
```
**POST Request Body:**
```json
{
  "bill_id": "bill-uuid",
  "amount": 150000,
  "payment_method": "transfer"
}
```
**Response:**
```json
{
  "status": "success",
  "message": "Payment successful. Bill marked as paid.",
  "data": {
    "payment": {
      "id": "payment-id",
      "reference": "PAY-1234567890-ABC123XYZ",
      "amount": 150000,
      "status": "success",
      "method": "transfer",
      "timestamp": "2026-04-24T12:00:00Z"
    },
    "bill": {
      "id": "bill-id",
      "status": "paid",
      "totalAmount": 150000,
      "totalPaid": 150000,
      "remaining": 0
    }
  }
}
```

---

## 📊 Database Schema Updates

### Tabel yang Diupdate

1. **users** - Tambah fields:
   - `customer_number` (unique identifier untuk customer)
   - `address` (alamat unit)
   - `phone` (nomor telepon)

2. **devices** - Tambah fields:
   - `status` (active, inactive, maintenance)

3. **water_usage** - Tambah fields:
   - `forward` (meter forward reading)
   - `backward` (meter backward reading)
   - `cumulative` (forward - backward, dihitung di backend)

### Tabel Baru

1. **bills**
   - Relasi: `customers (users) -> bills (one-to-many)`
   - Fields: id, customerId, billNumber, billingPeriod, billingDate, dueDate, waterUsage, unitPrice, totalAmount, status, notes, createdAt, updatedAt

2. **payments**
   - Relasi: `bills -> payments (one-to-many)`
   - Fields: id, billId, amount, paymentMethod, referenceNumber, status, proofUrl, description, createdAt, updatedAt

---

## 🚀 Alur Data

```
IoT Device (Sensor)
    ↓
POST /api/v1/iot/water-usage (dengan forward, backward)
    ↓
Water Usage tersimpan (forward, backward, cumulative dihitung)
    ↓
Dashboard aggregat usage → GET /api/v1/dashboard
    ↓
Billing system generate bills dari water_usage
    ↓
Customer lihat bills → GET /api/v1/billing
    ↓
Customer bayar → POST /api/v1/payment
    ↓
Status bill updated → status: "paid"
```

---

## 📝 Catatan Implementasi

### IoT Endpoint
- Menerima `device_id`, `forward`, `backward`
- Menghitung `cumulative = forward - backward` di backend
- Validasi device_id sesuai API key
- Menyimpan semua nilai ke database

### Dashboard
- Menampilkan summary penggunaan air per customer
- Include data bills dan payment summary
- Protected route (require JWT token)

### Billing Module
- Endpoints untuk view bills per customer
- Data diambil dari tabel bills (relasi dengan customers)
- Fitur full payment tracking

### Payment Module (Simulasi Xendit)
- POST untuk process payment (simulasi: selalu berhasil)
- Auto-update bill status menjadi "paid" jika fully paid
- Track payment method dan reference number
- Untuk integrasi Xendit actual, update request handling di POST route

---

## 🔧 Migrasi Database

Jalankan perintah berikut untuk apply migration:

```bash
npx prisma migrate deploy
```

Atau untuk development:
```bash
npx prisma migrate dev --name "add_billing_payment_update_schema"
```

Migration file: `prisma/migrations/20260424120000_add_billing_payment_update_schema/migration.sql`

---

## ✅ Checklist Penggunaan

- [ ] Rename/delete file routes lama (authRoutes.js, userRoutes.js, deviceRoute.js, iotRoutes.js, dashboardRoutes.js)
- [ ] Run migration: `npx prisma migrate deploy`
- [ ] Update .env dengan DATABASE_URL jika belum
- [ ] Test IoT endpoint: POST `/api/v1/iot/water-usage`
- [ ] Test Dashboard: GET `/api/v1/dashboard`
- [ ] Test Billing: GET `/api/v1/billing`
- [ ] Test Payment: POST `/api/v1/payment`

---

## 🐛 Troubleshooting

### Migration gagal
- Pastikan DATABASE_URL di .env sudah benar
- Cek koneksi PostgreSQL
- Jika tabel sudah ada, gunakan `prisma migrate resolve`

### IoT endpoint error
- Pastikan `device_id` valid dan sesuai dengan API key
- Cek format request body (device_id, forward, backward)

### Billing/Payment belum berfungsi
- Pastikan migration sudah dijalankan
- Cek apakah data bills sudah ada di database
- Untuk testing, tambahkan bill manual melalui database

---

## 📞 Support

Untuk pertanyaan atau issues, silakan review:
1. Error messages di console/logs
2. Database schema di `prisma/schema.prisma`
3. Route handlers di `src/routes/`
