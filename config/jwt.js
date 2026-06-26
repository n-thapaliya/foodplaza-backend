require('dotenv').config();
const jwt = require('jsonwebtoken');

const ACCESS_SECRET  = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const ACCESS_EXPIRES  = process.env.JWT_ACCESS_EXPIRES_IN  || '15m';
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

function requireSecret(secret, name) {
  if (!secret) {
    throw new Error(`${name} environment variable is required`);
  }
  if (process.env.NODE_ENV === 'production' && secret.length < 32) {
    throw new Error(`${name} must be at least 32 characters in production`);
  }
  return secret;
}

function generateAccessToken(payload) {
  return jwt.sign(payload, requireSecret(ACCESS_SECRET, 'JWT_ACCESS_SECRET'), { expiresIn: ACCESS_EXPIRES });
}

function generateRefreshToken(payload) {
  return jwt.sign(payload, requireSecret(REFRESH_SECRET, 'JWT_REFRESH_SECRET'), { expiresIn: REFRESH_EXPIRES });
}

function verifyAccessToken(token) {
  return jwt.verify(token, requireSecret(ACCESS_SECRET, 'JWT_ACCESS_SECRET'));
}

function verifyRefreshToken(token) {
  return jwt.verify(token, requireSecret(REFRESH_SECRET, 'JWT_REFRESH_SECRET'));
}

function generateTokenPair(user) {
  const payload = { id: user.id, email: user.email };
  return {
    accessToken:  generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  generateTokenPair,
};
