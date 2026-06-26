const { verifyAccessToken } = require('../config/jwt');
const { User } = require('../models');
const { error } = require('../utils/response');

async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return error(res, 'Access token required', 401);
    }
    const token = header.split(' ')[1];
    const decoded = verifyAccessToken(token);
    const user = await User.findByPk(decoded.id);
    if (!user) return error(res, 'User not found', 401);
    if (!user.isActive) return error(res, 'User account is inactive', 403);
    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return error(res, 'Access token expired', 401);
    }
    return error(res, 'Invalid access token', 401);
  }
}

function requireVerified(req, res, next) {
  if (!req.user.isVerified) {
    return error(res, 'Account verification required', 403);
  }
  next();
}

module.exports = { authenticate, requireVerified };
