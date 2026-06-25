require('dotenv').config();

const OTP_LENGTH = parseInt(process.env.OTP_LENGTH) || 6;
const OTP_EXPIRY_MINUTES = parseInt(process.env.OTP_EXPIRY_MINUTES) || 5;

function generateOTP() {
  const min = Math.pow(10, OTP_LENGTH - 1);
  const max = Math.pow(10, OTP_LENGTH) - 1;
  return String(Math.floor(min + Math.random() * (max - min + 1)));
}

function getOTPExpiry() {
  return new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
}

function isOTPValid(user) {
  if (!user.otpCode || !user.otpExpiry) return false;
  return new Date() <= new Date(user.otpExpiry);
}

module.exports = { generateOTP, getOTPExpiry, isOTPValid };
