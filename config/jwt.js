require('dotenv').config();
const jwt = require('jsonwebtoken');

const ACCESS_SECRET  = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const ACCESS_EXPIRES  = process.env.JWT_ACCESS_EXPIRES_IN  || '15m';
const REFRESH_EXPIRES = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

function requireSecret(secret, name) {
  if (!secret) {
    console.warn(`WARNING: ${name} environment variable is missing. Using a fallback secret.`);
    return name === 'JWT_ACCESS_SECRET'
      ? 'default_access_secret_fallback_32_characters_long'
      : 'default_refresh_secret_fallback_32_characters_long';
  }
  if (process.env.NODE_ENV === 'production' && secret.length < 32) {
    console.warn(`WARNING: ${name} is less than 32 characters in production. Padding it to 32 characters.`);
    return secret.padEnd(32, '0');
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
