const { body } = require('express-validator');

const register = [
  body('fullName').trim().notEmpty().withMessage('Full name is required').isLength({ min: 2, max: 100 }).withMessage('Full name must be 2–100 chars'),
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Valid email required').normalizeEmail(),
  body('phone').optional().trim().isMobilePhone('any').withMessage('Valid phone number required'),
  body('password').notEmpty().withMessage('Password is required').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const login = [
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Valid email required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

const sendOTP = [
  body('identifier').trim().notEmpty().withMessage('Email or phone is required'),
  body('channel').optional().isIn(['email', 'sms', 'whatsapp']).withMessage('Channel must be email, sms, or whatsapp'),
];

const verifyOTP = [
  body('identifier').trim().notEmpty().withMessage('Email or phone is required'),
  body('otp').trim().notEmpty().withMessage('OTP is required').isLength({ min: 4, max: 8 }).withMessage('Invalid OTP'),
];

const forgotPassword = [
  body('identifier').trim().notEmpty().withMessage('Email or phone is required'),
  body('channel').optional().isIn(['email', 'sms', 'whatsapp']).withMessage('Invalid channel'),
];

const resetPassword = [
  body('identifier').trim().notEmpty().withMessage('Email or phone is required'),
  body('otp').trim().notEmpty().withMessage('OTP is required'),
  body('newPassword').notEmpty().withMessage('New password required').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

const refreshToken = [
  body('refreshToken').notEmpty().withMessage('Refresh token is required'),
];

const updateProfile = [
  body('fullName').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Full name must be 2–100 chars'),
  body('phone').optional().trim().isMobilePhone('any').withMessage('Valid phone number required'),
];

module.exports = { register, login, sendOTP, verifyOTP, forgotPassword, resetPassword, refreshToken, updateProfile };
