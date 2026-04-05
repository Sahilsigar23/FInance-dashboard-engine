# FinSight Backend

A production-quality finance dashboard backend system with role-based access control, comprehensive transaction management, and advanced analytics capabilities.

## 🌟 Overview

FinSight Backend is a robust, scalable financial management system built with Node.js and Express.js. It provides a complete API solution for financial dashboard applications with sophisticated role-based permissions, real-time analytics, and comprehensive transaction management.

## 🏗️ Tech Stack

- **Runtime**: Node.js 16+
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt
- **Validation**: Joi
- **Documentation**: Swagger/OpenAPI 3.0
- **Security**: Helmet.js, CORS
- **Environment Management**: dotenv

## 🏛️ Architecture

This project follows clean architecture principles with clear separation of concerns:

```
src/
├── config/          # Configuration files (database, swagger)
├── controllers/     # Request handlers and response logic
├── middleware/      # Authentication, authorization, error handling
├── routes/          # API route definitions
├── services/        # Business logic layer
├── validators/      # Input validation schemas
├── utils/           # Utility functions (JWT, password hashing)
└── app.js          # Express application setup

prisma/
└── schema.prisma   # Database schema definition

server.js           # Application entry point
```

## 📁 Project Structure

```
Finance Dashboard Engine/
├── prisma/
│   └── schema.prisma                    # Database schema
├── src/
│   ├── config/
│   │   ├── database.js                  # Prisma client configuration
│   │   └── swagger.js                   # API documentation setup
│   ├── controllers/
│   │   ├── analytics.controller.js      # Dashboard analytics endpoints
│   │   ├── auth.controller.js           # Authentication endpoints
│   │   ├── transaction.controller.js    # Transaction CRUD operations
│   │   └── user.controller.js           # User management endpoints
│   ├── middleware/
│   │   ├── auth.js                      # JWT authentication & RBAC
│   │   └── errorHandler.js              # Centralized error handling
│   ├── routes/
│   │   ├── auth.routes.js               # Authentication routes
│   │   ├── dashboard.routes.js          # Analytics routes
│   │   ├── transaction.routes.js        # Transaction routes
│   │   └── user.routes.js               # User management routes
│   ├── services/
│   │   ├── analytics.service.js         # Business logic for analytics
│   │   ├── transaction.service.js       # Transaction business logic
│   │   └── user.service.js              # User management logic
│   ├── utils/
│   │   ├── jwt.js                       # JWT token utilities
│   │   └── password.js                  # Password hashing utilities
│   ├── validators/
│   │   ├── auth.validator.js            # Authentication validation
│   │   ├── transaction.validator.js     # Transaction validation
│   │   └── user.validator.js            # User validation
│   └── app.js                           # Express app configuration
├── .env.example                         # Environment variables template
├── package.json                         # Dependencies and scripts
├── README.md                            # Project documentation
└── server.js                            # Application entry point
```

## 🗃️ Database Schema

### User Model
```sql
Table users {
  id          String   @id @default(cuid())
  name        String
  email       String   @unique
  password    String
  role        Role     @default(VIEWER)  -- ADMIN, ANALYST, VIEWER
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  transactions Transaction[]
}
```

### Transaction Model
```sql
Table transactions {
  id          String          @id @default(cuid())
  amount      Decimal(15,2)
  type        TransactionType -- INCOME, EXPENSE
  category    String
  date        DateTime
  description String?
  isDeleted   Boolean         @default(false)
  createdBy   String          -- Foreign key to users
  createdAt   DateTime        @default(now())
  updatedAt   DateTime        @updatedAt
  user        User            @relation
}
```

## 🔐 Role-Based Access Control Matrix

| Resource | ADMIN | ANALYST | VIEWER |
|----------|-------|---------|---------|
| **User Management** |
| Create Users | ✅ | ❌ | ❌ |
| View All Users | ✅ | ❌ | ❌ |
| Update Users | ✅ | ❌ | ❌ |
| Delete Users | ✅ | ❌ | ❌ |
| Manage Roles | ✅ | ❌ | ❌ |
| **Transactions** |
| Create Transactions | ✅ | ❌ | ❌ |
| View Transactions | ✅ | ✅ | ❌ |
| Update Transactions | ✅ | ❌ | ❌ |
| Delete Transactions | ✅ | ❌ | ❌ |
| Search/Filter | ✅ | ✅ | ❌ |
| **Analytics** |
| Total Income/Expense | ✅ | ✅ | ❌ |
| Category Analysis | ✅ | ✅ | ❌ |
| Monthly Trends | ✅ | ✅ | ❌ |
| Recent Activity | ✅ | ✅ | ❌ |
| Dashboard Summary | ✅ | ✅ | ✅ |
| Net Balance | ✅ | ✅ | ✅ |

## 🚀 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/auth/me` - Get current user profile

### User Management (Admin Only)
- `GET /api/v1/users` - Get all users with pagination
- `POST /api/v1/users` - Create new user
- `GET /api/v1/users/:id` - Get user by ID
- `PATCH /api/v1/users/:id` - Update user details
- `PATCH /api/v1/users/:id/role` - Update user role
- `PATCH /api/v1/users/:id/status` - Activate/deactivate user
- `DELETE /api/v1/users/:id` - Delete user

### Transactions
- `GET /api/v1/transactions` - Get transactions with filtering (Admin/Analyst)
- `POST /api/v1/transactions` - Create transaction (Admin)
- `GET /api/v1/transactions/:id` - Get transaction by ID (Admin/Analyst)
- `PATCH /api/v1/transactions/:id` - Update transaction (Admin)
- `DELETE /api/v1/transactions/:id` - Soft delete transaction (Admin)
- `GET /api/v1/transactions/categories` - Get all categories (Admin/Analyst)
- `GET /api/v1/transactions/summary` - Get transaction summary (Admin/Analyst)

### Dashboard Analytics
- `GET /api/v1/dashboard/total-income` - Get total income (Admin/Analyst)
- `GET /api/v1/dashboard/total-expense` - Get total expense (Admin/Analyst)
- `GET /api/v1/dashboard/net-balance` - Get net balance (All roles)
- `GET /api/v1/dashboard/category-summary` - Category breakdown (Admin/Analyst)
- `GET /api/v1/dashboard/monthly-trend` - Monthly trend data (Admin/Analyst)
- `GET /api/v1/dashboard/recent-activity` - Recent transactions (Admin/Analyst)
- `GET /api/v1/dashboard/summary` - Dashboard overview (All roles)

## 🔍 Authentication Flow

1. **User Registration**: `POST /api/v1/auth/register`
   ```json
   {
     "name": "John Doe",
     "email": "john@example.com",
     "password": "SecurePass123",
     "role": "VIEWER"
   }
   ```

2. **User Login**: `POST /api/v1/auth/login`
   ```json
   {
     "email": "john@example.com",
     "password": "SecurePass123"
   }
   ```

3. **Include JWT Token** in subsequent requests:
   ```
   Authorization: Bearer <jwt_token>
   ```

## 🔍 Filtering & Search Examples

### Transaction Filtering
```bash
# Filter by category
GET /api/v1/transactions?category=salary

# Filter by type
GET /api/v1/transactions?type=INCOME

# Date range filtering
GET /api/v1/transactions?startDate=2025-01-01&endDate=2025-01-31

# Search in descriptions
GET /api/v1/transactions?search=grocery

# Combined filters with pagination
GET /api/v1/transactions?type=EXPENSE&category=food&page=2&limit=20
```

### User Filtering
```bash
# Filter users by role
GET /api/v1/users?role=ANALYST

# Filter by active status
GET /api/v1/users?isActive=true

# Search by name or email
GET /api/v1/users?search=john
```

## 📊 Dashboard API Examples

### Get Net Balance
```bash
GET /api/v1/dashboard/net-balance?startDate=2025-01-01&endDate=2025-01-31
```

Response:
```json
{
  "success": true,
  "message": "Net balance retrieved successfully",
  "data": {
    "netBalance": 2500.00,
    "totalIncome": 5000.00,
    "totalExpense": 2500.00,
    "incomeTransactions": 5,
    "expenseTransactions": 12,
    "totalTransactions": 17,
    "period": {
      "type": "custom",
      "startDate": "2025-01-01",
      "endDate": "2025-01-31"
    }
  }
}
```

### Get Monthly Trend
```bash
GET /api/v1/dashboard/monthly-trend?year=2025
```

### Get Category Summary
```bash
GET /api/v1/dashboard/category-summary?type=EXPENSE
```

## ⚙️ Setup Instructions

### Prerequisites
- Node.js 16+ installed
- PostgreSQL database running
- Git installed

### 1. Clone Repository
```bash
git clone <repository-url>
cd "Finance Dashboard Engine"
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your configuration
DATABASE_URL="postgresql://username:password@localhost:5432/finsight_db"
JWT_SECRET="your-super-secret-jwt-key-here"
PORT=3000
```

### 4. Database Setup
```bash
# Generate Prisma client
npm run generate

# Run database migrations
npm run migrate

# (Optional) Seed database with sample data
npm run seed
```

### 5. Start Development Server
```bash
npm run dev
```

The server will start on http://localhost:3000

## 🗄️ Database Migration Instructions

### Initial Migration
```bash
# Create and apply first migration
npx prisma migrate dev --name init
```

### Schema Updates
```bash
# After updating schema.prisma
npx prisma migrate dev --name describe_your_changes

# Generate new client
npx prisma generate
```

### Production Deployment
```bash
# Deploy migrations to production
npx prisma migrate deploy
```

## 🏃‍♂️ Run Instructions

### Development Mode
```bash
npm run dev          # Start with nodemon (auto-restart)
```

### Production Mode
```bash
npm start            # Start production server
```

### Other Commands
```bash
npm run migrate      # Run database migrations
npm run generate     # Generate Prisma client
npm run seed         # Seed database (if implemented)
npm test            # Run test suite
```


## 🌍 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ | - |
| `JWT_SECRET` | Secret key for JWT tokens | ✅ | - |
| `JWT_EXPIRES_IN` | JWT token expiration time | ❌ | 24h |
| `PORT` | Server port number | ❌ | 3000 |
| `NODE_ENV` | Environment mode | ❌ | development |
| `CORS_ORIGIN` | Allowed CORS origins (comma-separated) | ❌ | http://localhost:3000 |
| `BCRYPT_ROUNDS` | Password hashing rounds | ❌ | 12 |
| `DEFAULT_PAGE_SIZE` | Default pagination limit | ❌ | 10 |
| `MAX_PAGE_SIZE` | Maximum pagination limit | ❌ | 100 |

## 📚 API Documentation

- **Swagger UI**: http://localhost:3000/api-docs
- **Health Check**: http://localhost:3000/health
- **API Info**: http://localhost:3000/api/v1

## 🤔 Assumptions

1. **Single Organization**: The system assumes all users belong to a single organization
2. **Soft Deletes**: Transactions use soft delete (isDeleted flag) for data integrity
3. **UTC Timestamps**: All dates are stored and processed in UTC
4. **Email Uniqueness**: Each email address can only be associated with one account
5. **Currency**: Single currency system (amounts stored as decimals without currency specification)
6. **Admin Bootstrap**: First registered user should be manually assigned ADMIN role via database
7. **Database Relationships**: Users can be deleted, which will cascade delete their transactions
8. **Password Requirements**: Minimum 8 characters with at least one uppercase, lowercase, and number
9. **JWT Stateless**: No JWT blacklisting implemented; tokens are valid until expiration
10. **Category Management**: Categories are created dynamically when transactions are added

## 🔮 Future Improvements

### Security Enhancements
- [ ] JWT token blacklisting/refresh mechanism
- [ ] Rate limiting for API endpoints
- [ ] Two-factor authentication (2FA)
- [ ] API key authentication for service-to-service communication
- [ ] Advanced password policies and rotation

### Feature Additions
- [ ] Multi-currency support with exchange rates
- [ ] File upload for transaction receipts/attachments
- [ ] Bulk transaction import (CSV/Excel)
- [ ] Recurring transaction scheduling
- [ ] Email notifications for important events
- [ ] Audit logging for all user actions
- [ ] Advanced reporting with PDF generation
- [ ] Real-time notifications using WebSockets

### Performance & Scalability
- [ ] Redis caching layer for frequently accessed data
- [ ] Database query optimization and indexing
- [ ] Horizontal scaling support
- [ ] Database connection pooling optimization
- [ ] Background job processing for heavy operations

### Monitoring & DevOps
- [ ] Comprehensive logging with structured logs
- [ ] Health monitoring and alerting
- [ ] Performance metrics collection
- [ ] Docker containerization
- [ ] CI/CD pipeline setup
- [ ] Database backup and disaster recovery

### User Experience
- [ ] GraphQL API alternative
- [ ] Webhook support for external integrations
- [ ] Advanced filtering and search capabilities
- [ ] Data export functionality
- [ ] Mobile-optimized API responses
- [ ] API versioning strategy

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact: support@finsight.com
- Documentation: http://localhost:3000/api-docs

