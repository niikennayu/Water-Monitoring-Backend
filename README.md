# Water Monitoring Backend

## 📋 Project Overview

Water Monitoring Backend - API sistem monitoring kualitas air dengan teknologi modern dan best practices untuk production.

## 🛠️ Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Logging**: Morgan
- **Security**: Helmet, CORS
- **Code Quality**: ESLint, Prettier

## 📁 Project Structure (Clean Architecture)

```
water-monitoring-backend/
├── src/
│   ├── config/           # Configuration files
│   │   └── db.js        # Database configuration
│   ├── controllers/      # Request handlers
│   │   └── UserController.js
│   ├── services/         # Business logic
│   │   └── UserService.js
│   ├── routes/           # API routes
│   │   └── userRoutes.js
│   ├── models/           # Data models (optional)
│   ├── middleware/       # Custom middlewares
│   │   ├── errorHandler.js
│   │   └── responseHandler.js
│   ├── utils/            # Helper functions
│   │   └── logger.js
│   ├── dto/              # Data Transfer Objects
│   ├── app.js            # Express app setup
│   └── server.js         # Server entry point
├── prisma/
│   └── schema.prisma     # Prisma database schema
├── .env                  # Environment variables (local)
├── .env.example          # Environment variables template
├── .prettierrc            # Code formatting config
├── package.json          # Project dependencies
└── README.md             # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 16.x
- npm atau yarn
- PostgreSQL >= 12.x

### Installation

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd water-monitoring-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   # Copy .env.example ke .env
   cp .env.example .env

   # Edit .env dengan konfigurasi database Anda
   # DATABASE_URL=postgresql://user:password@localhost:5432/water_monitoring_db
   ```

4. **Setup Prisma & Database**
   ```bash
   # Generate Prisma Client
   npm run prisma:generate

   # Run migrations
   npm run prisma:migrate

   # Optional: Open Prisma Studio untuk melihat data
   npm run prisma:studio
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

   Server akan berjalan di `http://localhost:3000`

## 📚 Available Scripts

```bash
# Development
npm run dev              # Start server dengan auto-reload

# Production
npm run build           # Build untuk production
npm start              # Start production server

# Database
npm run prisma:generate # Generate Prisma Client
npm run prisma:migrate # Create & run migrations
npm run prisma:studio  # Open Prisma Studio

# Code Quality
npm run lint           # Run ESLint
npm run format         # Format code dengan Prettier

# Testing
npm test              # Run tests
npm run test:watch   # Run tests dengan watch mode
```

## 🔌 API Endpoints

### Health Check
```
GET /health
```

### API Info
```
GET /api/v1
```

### User Management
```
GET    /api/v1/users           # Get all users
GET    /api/v1/users/:id       # Get user by ID
POST   /api/v1/users           # Create new user
PUT    /api/v1/users/:id       # Update user
DELETE /api/v1/users/:id       # Delete user
```

### Example Request (Create User)
```bash
curl -X POST http://localhost:3000/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","name":"John Doe"}'
```

## 📝 Best Practices Implemented

### Architecture
- ✅ **Clean Architecture**: Separation of concerns (Controllers → Services → Models)
- ✅ **Middleware Pattern**: Custom middlewares untuk error handling & response formatting
- ✅ **Service Layer**: Business logic terpisah dari HTTP layer

### Security
- ✅ **Helmet**: HTTP headers security
- ✅ **CORS**: Cross-Origin Resource Sharing configuration
- ✅ **Error Handling**: Sensitive info tidak di-expose
- ✅ **Input Validation**: Basic validation di controller level

### Code Quality
- ✅ **Consistent Formatting**: Prettier configuration
- ✅ **Linting**: ESLint rules
- ✅ **Structured Logging**: Logger utility dengan levels
- ✅ **Error Handling**: Custom AppError class & global error handler

### Database
- ✅ **Type-Safe Queries**: Prisma type generation
- ✅ **Migration System**: Version controlled database schema
- ✅ **Connection Pooling**: Prisma client management

## 🔐 Environment Variables

```env
# Database
DATABASE_URL              # PostgreSQL connection string

# Server
NODE_ENV                  # development | production
PORT                      # Server port (default: 3000)
API_VERSION              # API version (default: v1)

# CORS
CORS_ORIGIN              # Comma-separated allowed origins

# Security
JWT_SECRET               # JWT secret key (for future auth)

# Logging
LOG_LEVEL                # debug | info | warn | error
```

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       VARCHAR(255) UNIQUE NOT NULL,
  name        VARCHAR(255),
  createdAt   TIMESTAMP DEFAULT NOW(),
  updatedAt   TIMESTAMP DEFAULT NOW()
);
```

### Water Quality Table
```sql
CREATE TABLE water_quality (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  temperature         FLOAT NOT NULL,
  ph                  FLOAT NOT NULL,
  turbidity           FLOAT NOT NULL,
  dissolvedOxygen     FLOAT NOT NULL,
  location            VARCHAR(255) NOT NULL,
  timestamp           TIMESTAMP DEFAULT NOW(),
  createdAt           TIMESTAMP DEFAULT NOW(),
  updatedAt           TIMESTAMP DEFAULT NOW()
);
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Watch mode
npm run test:watch
```

## 📦 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Setup untuk Production
- `NODE_ENV=production`
- Update `DATABASE_URL` dengan production database
- Update `CORS_ORIGIN` dengan allowed domains
- Set `JWT_SECRET` dengan secure key
- Disable `LOG_LEVEL=debug`

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -am 'Add feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Open Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 📧 Support

Untuk bantuan atau pertanyaan, silakan buka issue di GitHub repository.

---

**Last Updated**: March 31, 2026
**Version**: 1.0.0
