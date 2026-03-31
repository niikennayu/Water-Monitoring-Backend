# 🚀 Quick Start Guide - Water Monitoring Backend

Setup project Anda sudah siap untuk dijalankan! Ikuti langkah-langkah berikut untuk mulai development.

## 📋 Checklist Setup

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Setup Database Connection
Edit `.env` dan sesuaikan `DATABASE_URL` dengan PostgreSQL Anda:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/water_monitoring_db"
```

Pastikan PostgreSQL sudah running dan database sudah dibuat:
```sql
CREATE DATABASE water_monitoring_db;
```

### Step 3: Generate Prisma Client
```bash
npm run prisma:generate
```

### Step 4: Run Database Migrations
```bash
npm run prisma:migrate
```

Ketika diminta untuk nama migration, ketik sesuatu seperti:
```
init
```

### Step 5: Start Development Server
```bash
npm run dev
```

Server akan berjalan di:
```
http://localhost:3000
```

## ✅ Verify Installation

### Test Health Check
```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "OK",
  "message": "Server is running",
  "timestamp": "2024-03-31T...",
  "environment": "development"
}
```

### Test API
```bash
curl http://localhost:3000/api/v1
```

## 📝 File Structure Recap

```
src/
├── app.js                    # Express app configuration
├── server.js                 # Server entry point (jalankan ini)
├── config/
│   └── db.js                # Prisma client & database config
├── controllers/
│   └── UserController.js    # Controller untuk user endpoints
├── services/
│   └── UserService.js       # Business logic layer
├── routes/
│   └── userRoutes.js        # User API routes
├── middleware/
│   ├── errorHandler.js      # Error handling
│   └── responseHandler.js   # Response formatting
└── utils/
    └── logger.js            # Logging utility

prisma/
└── schema.prisma            # Database schema definition
```

## 🔌 Available API Endpoints

### User Management (Already Implemented)

**Get All Users**
```bash
curl http://localhost:3000/api/v1/users
```

**Create User**
```bash
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","name":"John Doe"}'
```

**Get User by ID**
```bash
curl http://localhost:3000/api/v1/users/<id>
```

**Update User**
```bash
curl -X PUT http://localhost:3000/api/v1/users/<id> \
  -H "Content-Type: application/json" \
  -d '{"name":"Updated Name"}'
```

**Delete User**
```bash
curl -X DELETE http://localhost:3000/api/v1/users/<id>
```

## 🎯 Next Steps

### 1. Add Water Quality Endpoints
Create `src/services/WaterQualityService.js` dan `src/controllers/WaterQualityController.js` untuk handle water quality data.

### 2. Add Authentication
Integrate JWT authentication untuk endpoints yang memerlukan security.

### 3. Add Input Validation
Gunakan `express-validator` untuk validasi input yang lebih robust.

### 4. Add Tests
Setup Jest dan buat unit tests untuk services & controllers.

### 5. Add Environment-specific Configs
Buat separate configs untuk development, staging, dan production.

## 🛠️ Helpful Commands

```bash
# View database with Prisma Studio
npm run prisma:studio

# Format code dengan Prettier
npm run format

# Lint code dengan ESLint
npm run lint

# Watch mode development
npm run dev
```

## 🐛 Troubleshooting

### Error: "Cannot find module '@prisma/client'"
```bash
npm run prisma:generate
npm install
```

### Error: "Database connection failed"
- Cek apakah PostgreSQL sudah running
- Cek DATABASE_URL di `.env` sudah benar
- Cek database `water_monitoring_db` sudah dibuat

### Error: "Port 3000 is already in use"
```bash
# Change port dalam .env
PORT=3001
```

### Error saat migration
```bash
# Reset database (HATI-HATI: akan menghapus semua data!)
npx prisma migrate reset
```

## 📚 Learn More

- [Express.js Documentation](https://expressjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

---

**Selamat! Project Anda sudah setup dan siap untuk development! 🎉**

Jika ada pertanyaan atau kendala, jangan ragu untuk bertanya.
