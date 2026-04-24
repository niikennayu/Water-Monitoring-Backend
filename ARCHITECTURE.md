## 🏗️ Smart Water Meter Backend - Struktur Baru

### Struktur Routes yang Sudah Di-refactor

```
┌─ API v1 Base: /api/v1
│
├─ /auth ─────────────────────────── Authentication
│  ├─ POST   /register ..................... Daftar akun
│  ├─ POST   /login ........................ Login
│  ├─ GET    /me (protected) .............. Ambil profil
│  └─ POST   /logout (protected) .......... Logout
│
├─ /customers ───────────────────── Customer Management
│  ├─ GET    / ............................. Ambil semua customer
│  ├─ GET    /:id .......................... Ambil detail customer
│  ├─ POST   / ............................. Buat customer
│  ├─ PUT    /:id .......................... Update customer
│  └─ DELETE /:id .......................... Delete customer
│
├─ /devices ─────────────────────── Device Management (protected)
│  ├─ GET    / ............................. Ambil device user
│  └─ POST   / ............................. Buat device baru
│
├─ /iot ─────────────────────────── IoT Data Ingestion
│  └─ POST   /water-usage ................. Terima data meter air
│       Input: device_id, forward, backward
│       Output: cumulative (calculated)
│
├─ /dashboard ───────────────────── Dashboard (protected)
│  └─ GET    / ............................. Ambil dashboard data
│       Include: summary, devices, usage, bills
│
├─ /billing ─────────────────────── Billing Management (protected)
│  ├─ GET    / ............................. Ambil semua bills
│  ├─ GET    /:customer_number ............ Ambil bills per customer
│  └─ GET    /:id/detail .................. Detail bill
│
└─ /payment ─────────────────────── Payment Processing (protected)
   ├─ POST   / ............................. Process payment
   ├─ GET    /:payment_id ................. Detail pembayaran
   └─ PUT    /:payment_id ................. Update status
```

---

### 📊 Database Relations

```
┌─────────────────────────────────────────────────────────────────┐
│ USERS (customers)                                               │
├─────────────────────────────────────────────────────────────────┤
│ • id (PK)                                                       │
│ • email                                                         │
│ • password                                                      │
│ • name                                                          │
│ • customer_number (unique)                                      │
│ • address                                                       │
│ • phone                                                         │
└──────────────┬──────────────────────────────────────┬───────────┘
               │                                      │
        1      │                              1       │
        |      │                              |       │
        |      │                              |       │
        |      ▼                              ▼       │
┌──────────────────────┐           ┌──────────────────────┐
│ DEVICES              │           │ BILLS                │
├──────────────────────┤           ├──────────────────────┤
│ • id (PK)            │           │ • id (PK)            │
│ • name               │           │ • customerId (FK)    │
│ • location           │           │ • billNumber         │
│ • apiKey (unique)    │           │ • billingPeriod      │
│ • userId (FK)        │           │ • waterUsage         │
│ • status             │           │ • unitPrice          │
└────────┬─────────────┘           │ • totalAmount        │
         │                         │ • status             │
         │ 1                       └────────┬─────────────┘
         │                                  │
         │ N                          1     │
         │                            |     │
         ▼                            |     │ N
    WATER_USAGE                      |     │
    ┌──────────────┐                 |     ▼
    │ • id (PK)    │            PAYMENTS
    │ • forward    │            ┌──────────────┐
    │ • backward   │            │ • id (PK)    │
    │ • cumulative │            │ • billId(FK) │
    │ • deviceId   │            │ • amount     │
    │ • timestamp  │            │ • method     │
    └──────────────┘            │ • status     │
                                └──────────────┘
```

---

### 🔄 Data Flow

```
1️⃣ IoT SENSOR
   └─→ Sends: device_id, forward_meter, backward_meter
   
2️⃣ API ENDPOINT
   └─→ POST /api/v1/iot/water-usage
       • Validates API key
       • Calculates: cumulative = forward - backward
       • Stores: water_usage record
   
3️⃣ DASHBOARD
   └─→ GET /api/v1/dashboard
       • Aggregates water_usage from all devices
       • Retrieves bills for period
       • Calculates: usage summary, billing summary
   
4️⃣ BILLING SYSTEM
   └─→ Generates bills from water_usage
       • Bill template: usage × unit_price
       • Assigned status: pending
   
5️⃣ CUSTOMER VIEW
   └─→ GET /api/v1/billing
       • Views bills with pending status
       • Sees due date and total amount
   
6️⃣ PAYMENT
   └─→ POST /api/v1/payment
       • Receives: bill_id, amount, method
       • Updates: bill status (pending → paid)
       • Creates: payment record (success)
```

---

### 🔐 Authentication Flow

```
┌─────────────────┐
│  PUBLIC ROUTES  │
└─────────────────┘
    • /auth/register
    • /auth/login
    • /iot/water-usage (API Key required)
    
          ↓
          
┌──────────────────────────────────────┐
│  PROTECTED ROUTES (JWT Required)    │
└──────────────────────────────────────┘
    • /customers (all)
    • /devices (all)
    • /dashboard (all)
    • /billing (all)
    • /payment (all)
    
          ↓
          
┌──────────────────────────────────────────────────┐
│  REQUEST HEADER: Authorization: Bearer <token>  │
└──────────────────────────────────────────────────┘
    ├─ authMiddleware validates token
    ├─ Extracts userId from token payload
    └─ Attaches user info to request object
```

---

### 📁 File Organization

```
water-monitoring-backend/
│
├── src/
│   ├── routes/                    ← REFACTORED
│   │   ├── auth.js               ✅ NEW (from authRoutes.js)
│   │   ├── customers.js          ✅ NEW (from userRoutes.js)
│   │   ├── devices.js            ✅ NEW (from deviceRoute.js)
│   │   ├── iot.js                ✅ NEW (from iotRoutes.js)
│   │   ├── dashboard.js          ✅ NEW (from dashboardRoutes.js)
│   │   ├── billing.js            ✅ NEW (CREATED)
│   │   └── payment.js            ✅ NEW (CREATED)
│   │
│   ├── controllers/
│   │   ├── AuthController.js
│   │   ├── DeviceController.js
│   │   ├── UserController.js
│   │   └── DashboardController.js ← UPDATED
│   │
│   ├── services/
│   │   ├── AuthService.js
│   │   ├── DeviceService.js
│   │   └── UserService.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── apiKeyMiddleware.js
│   │   ├── errorHandler.js
│   │   └── responseHandler.js
│   │
│   ├── config/
│   │   └── db.js
│   │
│   ├── utils/
│   │   └── logger.js
│   │
│   ├── app.js                    ← UPDATED
│   └── server.js
│
├── prisma/
│   ├── schema.prisma             ← UPDATED
│   └── migrations/
│       ├── 20260331083304_init/
│       ├── 20260401093730_add_device_relation/
│       ├── 20260401134058_add_water_usage/
│       └── 20260424120000_add_billing_payment_update_schema/ ✅ NEW
│
├── REFACTOR_NOTES.md             ✅ NEW (Documentation)
├── REFACTOR_CHECKLIST.md         ✅ NEW (Completion Checklist)
├── README.md
└── SETUP.md
```

---

### ✨ Key Improvements

1. **🎯 Naming Convention**
   - All route files follow: `<feature>.js`
   - Old: authRoutes.js → New: auth.js
   - More consistent and easier to maintain

2. **📦 Modular Structure**
   - Each route file is self-contained
   - Clear separation of concerns
   - Easy to add/remove modules

3. **🔌 IoT Data Flow**
   - Input: device_id, forward, backward
   - Calculation: cumulative = forward - backward
   - Storage: All values persisted to database

4. **📊 Dashboard**
   - Replaced MongoDB with Prisma
   - Real customer data aggregation
   - Includes billing summary

5. **💳 Billing & Payment**
   - Complete billing module
   - Payment tracking
   - Bill status management (pending → paid)

6. **📈 Database Relations**
   - Proper foreign keys with CASCADE delete
   - Clean one-to-many relationships
   - Indexed unique fields (billNumber, customer_number)

---

### 🚀 What's Next?

✅ **Completed:**
- Structure refactor
- Route modules
- Billing & payment endpoints
- Database schema updates

**Ready for:**
- Run migrations
- Test all endpoints
- Deploy to staging
- Production release

**Future enhancements:**
- Auto-bill generation scheduler
- Real Xendit payment gateway
- Email/SMS notifications
- Admin dashboard
- Water usage reports
