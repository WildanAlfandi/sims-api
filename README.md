SIMS API - Payment System
REST API untuk sistem pembayaran dengan modul Registrasi, Login, Profile, Top Up, Transaksi, dan Informasi.
🔗 Live Demo
Production URL: -
API Documentation: https://api-doc-tht.nutech-integrasi.com
🚀 Tech Stack

Runtime: Node.js v18+
Framework: Express.js
Database: MySQL 8.0
Authentication: JWT (JSON Web Token)
Validation: Joi
File Upload: Multer
Password Hashing: bcryptjs
Deployment: Railway

📋 Features

✅ User Registration & Login with JWT
✅ Profile Management (CRUD & Image Upload)
✅ Balance Management with Transaction Safety
✅ Top Up Balance
✅ Payment Transaction (12 Services Available)
✅ Transaction History with Pagination
✅ Service & Banner Information
✅ Input Validation & Error Handling
✅ Raw Query with Prepared Statements (SQL Injection Prevention)

🗄️ Database Design
Tables:

users - User credentials and profile
balances - User balance (auto-created via trigger)
services - Available payment services
banners - Promotional banners
transactions - Transaction history (TOPUP & PAYMENT)

Key Features:

Foreign key relationships
Indexes on frequently queried columns
Auto-trigger for balance creation
Transaction support (ACID compliance)

See full schema: database/schema.sql
🔐 API Endpoints
Authentication

POST /registration - Register new user
POST /login - Login and get JWT token

Profile

GET /profile - Get user profile
PUT /profile/update - Update profile
PUT /profile/image - Upload profile image (max 100KB, jpg/png)

Transaction

GET /balance - Get current balance
POST /topup - Top up balance
POST /transaction - Payment transaction
GET /transaction/history - Get transaction history (paginated)

Information

GET /banner - Get all banners
GET /services - Get all available services

🛠️ Installation
Prerequisites

Node.js v18+
MySQL 8.0+
Git

Local Setup
bash# Clone repository
git clone https://github.com/WildanAlfandi/sims-api.git
cd sims-api

# Install dependencies
npm install

# Setup database
mysql -u root -p < database/schema.sql

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Run development server
npm run dev
🧪 Testing
Using Postman
Import the Swagger documentation from:
https://api-doc-tht.nutech-integrasi.com
Test Flow:

Register a new user
Login to get JWT token
Use token in Authorization header for protected endpoints
Test all CRUD operations

Example Request:
Registration:
bashPOST http://localhost:3000/registration
Content-Type: application/json

{
  "email": "test@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "password": "password123"
}
Login:
bashPOST http://localhost:3000/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
📦 Deployment
Deployed on Railway with:

✅ MySQL Database (Railway MySQL)
✅ Environment variables configured
✅ Auto-scaling enabled
✅ HTTPS enabled by default

🔒 Security Features

Password hashing with bcrypt (10 rounds)
JWT token authentication with expiration
SQL injection prevention (prepared statements)
File upload validation (type, size, extension)
Input validation with Joi
CORS enabled
Environment variable protection

📊 Project Structure
sims-api/
├── src/
│   ├── config/
│   │   └── database.js          # Database connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── profileController.js
│   │   ├── transactionController.js
│   │   └── informationController.js
│   ├── middleware/
│   │   ├── auth.js              # JWT authentication
│   │   └── upload.js            # File upload handler
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── profileRoutes.js
│   │   ├── transactionRoutes.js
│   │   └── informationRoutes.js
│   ├── utils/
│   │   ├── response.js          # Response formatter
│   │   └── validation.js        # Input validation schemas
│   └── app.js                   # Express app setup
├── uploads/                     # Uploaded files
├── database/
│   └── schema.sql              # Database DDL
├── .env                        # Environment variables
├── .gitignore
├── package.json
├── server.js                   # Entry point
└── README.md
💡 Key Implementation Details
1. Raw Query with Prepared Statements
All database operations use raw SQL queries with prepared statements:
javascriptconst [users] = await db.query(
    'SELECT * FROM users WHERE email = ?',
    [email]
);
2. Balance Calculation

Top Up: balance = balance + amount
Transaction: balance = balance - amount
Uses database transactions (BEGIN/COMMIT/ROLLBACK) for atomicity

3. Transaction Safety
javascriptconst connection = await db.getConnection();
await connection.beginTransaction();
try {
    // Execute queries
    await connection.commit();
} catch (error) {
    await connection.rollback();
}
4. Error Handling
Consistent error response format:
json{
  "status": 102,
  "message": "Error message",
  "data": null
}
📝 Environment Variables
env# Server
PORT=3000
NODE_ENV=production

# Database
DB_HOST=your_db_host
DB_PORT=3306
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=12h

# Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=102400
🎯 Test Results
✅ All endpoints tested and working
✅ Error handling validated
✅ Balance calculation verified
✅ File upload tested (size & format validation)
✅ JWT authentication working
✅ Database transactions working correctly
👨‍💻 Author
Wildan Alfandi
Technical Test - API Programmer
NUTECH Integrasi
📄 License
This project is for technical test purposes.

Built with using Node.js & Express.js