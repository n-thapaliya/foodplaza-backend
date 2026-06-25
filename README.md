# 🍕 FoodPlaza Backend API

Production-ready REST API for the FoodPlaza food delivery mobile application built with Node.js, Express, PostgreSQL, and Sequelize ORM.

---

## 📋 Table of Contents
- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [Database Setup](#-database-setup)
- [Running the Server](#-running-the-server)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [OTP System](#-otp-system)
- [Testing with Postman](#-testing-with-postman)

---

## 🛠 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Sequelize
- **Authentication:** JWT (Access + Refresh Tokens)
- **Password Hashing:** bcryptjs
- **Validation:** express-validator
- **File Upload:** Multer
- **Email:** Nodemailer (Gmail SMTP)
- **SMS:** Twilio / Fast2SMS
- **WhatsApp:** Twilio WhatsApp Sandbox
- **API Docs:** Swagger (OpenAPI 3.0)

---

## ✨ Features

- ✅ **JWT Authentication** with access & refresh tokens
- ✅ **OTP Verification** via Email, SMS, WhatsApp
- ✅ **Password Reset** flow with OTP
- ✅ **User Profile Management** with image upload
- ✅ **Category & Food CRUD** with pagination, search, filtering, sorting
- ✅ **Cart Management** (add, update, remove, clear)
- ✅ **Favorites** (add/remove food items)
- ✅ **Multiple Addresses** (create, update, delete, set default)
- ✅ **Order Placement** with **transaction safety** (auto-clears cart)
- ✅ **Order Tracking** (status updates: placed → confirmed → preparing → out_for_delivery → delivered)
- ✅ **Payment Method Support** (COD, Google Pay, PhonePe, Paytm, Razorpay, Card)
- ✅ **Error Handling** with centralized middleware
- ✅ **Request Validation** on all routes
- ✅ **Swagger Documentation** at `/api/docs`
- ✅ **Production-ready** with Sequelize migrations & seeders

---

## 📦 Prerequisites

- **Node.js** (v14+ recommended)
- **PostgreSQL** (v12+ recommended)
- **npm** or **yarn**

---

## 🚀 Installation

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install
```

---

## 🔐 Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

### Required Configuration

```env
# ─── Server ───────────────────────────────────────────────
PORT=5000
NODE_ENV=development

# ─── Database ─────────────────────────────────────────────
DB_HOST=localhost
DB_PORT=5432
DB_NAME=foodplaza_db
DB_USER=postgres
DB_PASSWORD=yourpassword

# ─── JWT ──────────────────────────────────────────────────
JWT_ACCESS_SECRET=your_super_secret_access_key_here
JWT_REFRESH_SECRET=your_super_secret_refresh_key_here
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# ─── Email (Gmail SMTP) ───────────────────────────────────
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_gmail@gmail.com
SMTP_PASS=your_gmail_app_password
EMAIL_FROM=FoodPlaza <your_gmail@gmail.com>

# ─── Twilio SMS ───────────────────────────────────────────
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# ─── Twilio WhatsApp Sandbox ──────────────────────────────
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886

# ─── Fast2SMS (alternative SMS, India) ───────────────────
FAST2SMS_API_KEY=your_fast2sms_api_key

# ─── File Uploads ─────────────────────────────────────────
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5242880

# ─── OTP ──────────────────────────────────────────────────
OTP_EXPIRY_MINUTES=5
OTP_LENGTH=6

# ─── App ──────────────────────────────────────────────────
APP_NAME=FoodPlaza
BASE_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000
```

### Gmail Setup (for Email OTP)
1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the app password in `SMTP_PASS` (not your Gmail password)

### Twilio Setup (for SMS/WhatsApp)
1. Sign up at https://www.twilio.com (free trial available)
2. Get your Account SID & Auth Token from the dashboard
3. For SMS: Buy a Twilio phone number
4. For WhatsApp: Use the WhatsApp Sandbox (join by sending code to sandbox number)

---

## 🗄 Database Setup

```bash
# Create PostgreSQL database
createdb foodplaza_db

# Or using psql:
psql -U postgres
CREATE DATABASE foodplaza_db;
\q

# Run migrations (creates all tables)
npm run migrate

# Seed database with categories & foods (50 items)
npm run seed

# Fresh start (drop all, re-migrate, re-seed)
npm run fresh
```

### Migration Commands
```bash
npm run migrate           # Run all pending migrations
npm run migrate:undo      # Undo all migrations (drops tables)
npm run seed             # Run all seeders
npm run seed:undo        # Undo all seeders
npm run fresh            # Drop → Migrate → Seed (full reset)
```

---

## ▶️ Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### Server will start on:
- **API:** http://localhost:5000
- **Health Check:** http://localhost:5000/health
- **Swagger Docs:** http://localhost:5000/api/docs

---

## 📖 API Documentation

Interactive API documentation is auto-generated using Swagger:

👉 **http://localhost:5000/api/docs**

Or download the OpenAPI spec:
```bash
curl http://localhost:5000/api/docs.json > openapi.json
```

---

## 📂 Project Structure

```
backend/
├── config/
│   ├── database.js           # Sequelize database config
│   └── jwt.js                # JWT token generation & verification
│
├── controllers/
│   ├── authController.js     # Register, login, OTP, profile
│   ├── foodController.js     # Categories, foods
│   ├── cartController.js     # Cart CRUD
│   ├── favoriteController.js # Favorites CRUD
│   ├── addressController.js  # Address CRUD
│   └── orderController.js    # Orders, payment, tracking
│
├── middleware/
│   ├── auth.js               # JWT authentication & verification
│   ├── errorHandler.js       # Centralized error handling
│   └── validate.js           # express-validator wrapper
│
├── migrations/               # Sequelize migrations
│   ├── 20260001-create-users.js
│   ├── 20260002-create-categories.js
│   ├── 20260003-create-foods.js
│   ├── 20260004-create-carts.js
│   ├── 20260005-create-favorites.js
│   ├── 20260006-create-orders.js
│   ├── 20260007-create-order-items.js
│   └── 20260008-create-addresses.js
│
├── models/                   # Sequelize models
│   ├── index.js              # Loads all models & associations
│   ├── User.js
│   ├── Category.js
│   ├── Food.js
│   ├── Cart.js
│   ├── Favorite.js
│   ├── Order.js
│   ├── OrderItem.js
│   └── Address.js
│
├── routes/                   # Express routes
│   ├── auth.js
│   ├── food.js
│   ├── cart.js
│   ├── favorites.js
│   ├── address.js
│   └── orders.js
│
├── services/                 # External services
│   ├── emailService.js       # Nodemailer (Gmail SMTP)
│   ├── smsService.js         # Twilio & Fast2SMS
│   └── uploadService.js      # Multer file upload
│
├── seeders/                  # Database seeders
│   ├── 20260001-seed-categories.js  # 10 categories
│   └── 20260002-seed-foods.js       # 50 food items
│
├── utils/
│   ├── response.js           # Standardized API response
│   ├── otp.js                # OTP generation & validation
│   └── paginate.js           # Pagination helpers
│
├── validators/               # express-validator rules
│   ├── authValidator.js
│   ├── orderValidator.js
│   └── addressValidator.js
│
├── uploads/                  # Uploaded files (images)
│   ├── profiles/
│   ├── foods/
│   └── categories/
│
├── .env                      # Environment variables
├── .env.example              # Environment template
├── .sequelizerc              # Sequelize CLI config
├── app.js                    # Express app setup
├── server.js                 # Server entry point
├── package.json
└── README.md
```

---

## 🔌 API Endpoints

### Authentication & User

| Method | Endpoint                  | Description                  | Auth Required |
|--------|---------------------------|------------------------------|---------------|
| POST   | `/api/auth/register`      | Register new user            | ❌            |
| POST   | `/api/auth/login`         | Login with email/password    | ❌            |
| POST   | `/api/auth/send-otp`      | Send OTP (email/SMS/WhatsApp)| ❌            |
| POST   | `/api/auth/verify-otp`    | Verify OTP & activate account| ❌            |
| POST   | `/api/auth/forgot-password`| Request password reset OTP  | ❌            |
| POST   | `/api/auth/reset-password`| Reset password with OTP     | ❌            |
| POST   | `/api/auth/refresh-token` | Refresh access token         | ❌            |
| GET    | `/api/auth/profile`       | Get user profile             | ✅            |
| PUT    | `/api/auth/profile`       | Update profile & image       | ✅            |

### Food & Categories

| Method | Endpoint                        | Description                | Auth Required |
|--------|---------------------------------|----------------------------|---------------|
| GET    | `/api/categories`               | List all categories        | ❌            |
| GET    | `/api/foods`                    | List foods (paginated)     | ❌            |
| GET    | `/api/foods/:id`                | Get food by ID             | ❌            |
| GET    | `/api/foods/category/:categoryId`| Foods by category         | ❌            |

**Query Params for `/api/foods`:**
- `page` — Page number (default: 1)
- `limit` — Items per page (default: 10, max: 100)
- `search` — Search in name/description
- `isVeg` — Filter by veg/non-veg (`true`/`false`)
- `minPrice` / `maxPrice` — Price range
- `sortBy` — `name` | `price` | `rating` | `createdAt` (default)
- `sortOrder` — `ASC` | `DESC`

### Cart

| Method | Endpoint          | Description           | Auth Required |
|--------|-------------------|-----------------------|---------------|
| GET    | `/api/cart`       | Get user's cart       | ✅ (Verified) |
| POST   | `/api/cart`       | Add item to cart      | ✅ (Verified) |
| PUT    | `/api/cart/:id`   | Update cart item qty  | ✅ (Verified) |
| DELETE | `/api/cart/:id`   | Remove cart item      | ✅ (Verified) |
| DELETE | `/api/cart/clear` | Clear entire cart     | ✅ (Verified) |

### Favorites

| Method | Endpoint                 | Description            | Auth Required |
|--------|--------------------------|------------------------|---------------|
| GET    | `/api/favorites`         | Get user's favorites   | ✅ (Verified) |
| POST   | `/api/favorites`         | Add to favorites       | ✅ (Verified) |
| DELETE | `/api/favorites/:foodId` | Remove from favorites  | ✅ (Verified) |

### Addresses

| Method | Endpoint            | Description          | Auth Required |
|--------|---------------------|----------------------|---------------|
| GET    | `/api/address`      | Get all addresses    | ✅            |
| POST   | `/api/address`      | Create new address   | ✅            |
| PUT    | `/api/address/:id`  | Update address       | ✅            |
| DELETE | `/api/address/:id`  | Delete address       | ✅            |

### Orders

| Method | Endpoint                  | Description           | Auth Required |
|--------|---------------------------|-----------------------|---------------|
| POST   | `/api/orders`             | Place new order       | ✅ (Verified) |
| GET    | `/api/orders`             | Get user's orders     | ✅ (Verified) |
| GET    | `/api/orders/:id`         | Get order by ID       | ✅ (Verified) |
| PUT    | `/api/orders/:id/status`  | Update order status   | ✅ (Verified) |

**Order Payload:**
```json
{
  "items": [
    { "foodId": 1, "quantity": 2 },
    { "foodId": 5, "quantity": 1 }
  ],
  "deliveryAddress": "12, Shivam Society, Junagadh, Gujarat - 362001",
  "paymentMethod": "cod",
  "notes": "Please ring the doorbell",
  "deliveryLat": 21.5222,
  "deliveryLng": 70.4579
}
```

---

## 📱 OTP System

### How it works:
1. **Register** → User gets OTP via email
2. **Verify OTP** → Account activated + auto-login with tokens
3. **Forgot Password** → User requests OTP
4. **Reset Password** → Validate OTP + set new password

### OTP Channels:
- **Email** (Gmail SMTP via Nodemailer)
- **SMS** (Twilio or Fast2SMS fallback)
- **WhatsApp** (Twilio WhatsApp Sandbox)

### OTP Configuration:
- **Length:** 6 digits (configurable via `OTP_LENGTH`)
- **Expiry:** 5 minutes (configurable via `OTP_EXPIRY_MINUTES`)
- **Storage:** Stored in `users` table (`otpCode`, `otpExpiry`, `otpPurpose`)

---

## 🧪 Testing with Postman

### Import Collection
Use the Swagger JSON as a base or manually create requests:

### Example: Register → Verify → Login Flow

**1. Register**
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+919876543210",
  "password": "password123"
}
```

**2. Verify OTP**
```http
POST http://localhost:5000/api/auth/verify-otp
Content-Type: application/json

{
  "identifier": "john@example.com",
  "otp": "123456"
}
```
Response includes `accessToken` and `refreshToken`.

**3. Get Profile (Authenticated)**
```http
GET http://localhost:5000/api/auth/profile
Authorization: Bearer <accessToken>
```

**4. Add to Cart**
```http
POST http://localhost:5000/api/cart
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "foodId": 1,
  "quantity": 2
}
```

**5. Place Order**
```http
POST http://localhost:5000/api/orders
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "items": [
    { "foodId": 1, "quantity": 2 },
    { "foodId": 3, "quantity": 1 }
  ],
  "deliveryAddress": "123 Main St, City, State - 12345",
  "paymentMethod": "cod"
}
```

---

## 🎯 Response Format

All API responses follow this format:

### Success
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error
```json
{
  "success": false,
  "message": "Error message",
  "errors": ["Detailed error 1", "Detailed error 2"]
}
```

---

## 🔒 Security Features

- ✅ JWT access & refresh tokens
- ✅ Password hashing with bcrypt (12 rounds)
- ✅ Input validation on all routes
- ✅ SQL injection protection via Sequelize ORM
- ✅ Rate limiting ready (add `express-rate-limit` if needed)
- ✅ CORS configured
- ✅ Environment-based secrets

---

## 🚢 Deployment

### Prerequisites for Production
1. **PostgreSQL Database** (Heroku Postgres, AWS RDS, Supabase, etc.)
2. **Node.js Hosting** (Heroku, AWS EC2, DigitalOcean, Railway, Render, etc.)
3. **Environment Variables** — set all `.env` variables in your hosting platform

### Deployment Steps (Example: Heroku)
```bash
# 1. Create Heroku app
heroku create foodplaza-api

# 2. Add PostgreSQL addon
heroku addons:create heroku-postgresql:hobby-dev

# 3. Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_ACCESS_SECRET=your_secret
heroku config:set JWT_REFRESH_SECRET=your_refresh_secret
# ... (set all other env vars)

# 4. Deploy
git push heroku main

# 5. Run migrations
heroku run npm run migrate

# 6. Seed database
heroku run npm run seed
```

---

## 📊 Database Schema

### Tables
- **users** — User accounts with OTP fields
- **categories** — Food categories
- **foods** — Food items with price, rating, image
- **carts** — User cart items (userId + foodId + quantity)
- **favorites** — User favorite foods
- **orders** — Order headers (userId, total, payment, status, address)
- **order_items** — Order line items (orderId, foodId, quantity, price)
- **addresses** — User saved addresses

### Key Relationships
- User `1:N` Cart, Favorite, Order, Address
- Category `1:N` Food
- Order `1:N` OrderItem
- Food `1:N` Cart, Favorite, OrderItem

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -m 'Add my feature'`
4. Push: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📝 License

MIT License — free to use for personal & commercial projects.

---

## 💬 Support

For issues or questions:
- **Email:** support@foodplaza.com
- **GitHub Issues:** [Create an issue](https://github.com/yourorg/foodplaza-backend/issues)

---

Made with ❤️ by the FoodPlaza Team 🍕
