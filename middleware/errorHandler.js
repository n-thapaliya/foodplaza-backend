const { error } = require('../utils/response');

function errorHandler(err, req, res, next) {
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.path} —`, err.message);

  // Sequelize validation errors
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    const messages = err.errors.map((e) => e.message);
    return error(res, messages[0], 422, messages);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError')  return error(res, 'Invalid token', 401);
  if (err.name === 'TokenExpiredError')  return error(res, 'Token expired', 401);

  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE')    return error(res, 'File size too large (max 5MB)', 413);
  if (err.message && err.message.includes('Only image')) return error(res, err.message, 415);

  // Default
  const statusCode = err.statusCode || err.status || 500;
  const message    = err.message || 'Internal server error';
  return error(res, message, statusCode);
}

function notFound(req, res) {
  return error(res, `Route ${req.method} ${req.originalUrl} not found`, 404);
}

module.exports = { errorHandler, notFound };
