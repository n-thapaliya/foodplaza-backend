require('dotenv').config();
const app = require('./app');
const { sequelize } = require('./models');

const PORT = parseInt(process.env.PORT) || 5000;

async function startServer() {
  try {
    // Test DB connection
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');

    // Sync models (use migrations in production instead)
    if (process.env.NODE_ENV === 'development') {
      // Just verify connection, don't auto-sync — use migrations
      console.log('ℹ️  Using migrations. Run: npm run migrate && npm run seed');
    }

    app.listen(PORT, () => {
      console.log(`🍕 FoodPlaza API running at http://localhost:${PORT}`);
      console.log(`📚 Swagger docs at  http://localhost:${PORT}/api/docs`);
      console.log(`🩺 Health check at  http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Closing DB connection...');
  await sequelize.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received. Closing DB connection...');
  await sequelize.close();
  process.exit(0);
});

startServer();
