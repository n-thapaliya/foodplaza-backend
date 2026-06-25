require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const path     = require('path');
const swaggerUi   = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const authRoutes      = require('./routes/auth');
const foodRoutes      = require('./routes/food');
const cartRoutes      = require('./routes/cart');
const favoriteRoutes  = require('./routes/favorites');
const addressRoutes   = require('./routes/address');
const orderRoutes     = require('./routes/orders');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();

// ─── CORS ──────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://localhost:8081',   // Expo dev server
    'exp://localhost:8081',
  ],
  credentials: true,
}));

// ─── Body parsers ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Static files (uploaded images) ──────────────────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── Swagger ──────────────────────────────────────────────────────────────────
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'FoodPlaza API',
      version: '1.0.0',
      description: 'Production-ready REST API for FoodPlaza food delivery app',
      contact: { name: 'FoodPlaza Team', email: 'support@foodplaza.com' },
    },
    servers: [
      { url: `http://localhost:${process.env.PORT || 5000}/api`, description: 'Development' },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ BearerAuth: [] }],
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { background: #FF6B00; }',
  customSiteTitle: 'FoodPlaza API Docs',
}));
app.get('/api/docs.json', (req, res) => res.json(swaggerSpec));

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'FoodPlaza API is running 🍕',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth',      authRoutes);
app.use('/api',           foodRoutes);
app.use('/api/cart',      cartRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/address',   addressRoutes);
app.use('/api/orders',    orderRoutes);

// ─── Error handling ───────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;
