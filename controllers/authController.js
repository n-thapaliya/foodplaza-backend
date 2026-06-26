const { User } = require('../models');
const { generateTokenPair, verifyRefreshToken, generateAccessToken } = require('../config/jwt');
const { generateOTP, getOTPExpiry, isOTPValid } = require('../utils/otp');
const { success, error } = require('../utils/response');
const { sendOTPEmail, sendWelcomeEmail } = require('../services/emailService');
const { sendOTPSMS, sendOTPWhatsApp } = require('../services/smsService');
const { Op } = require('sequelize');

// ─── Helper: find user by email or phone ─────────────────────────────────────
async function findByIdentifier(identifier) {
  return User.findOne({
    where: {
      [Op.or]: [
        { email: identifier.toLowerCase() },
        { phone: identifier },
      ],
    },
  });
}

// ─── Helper: dispatch OTP via chosen channel ─────────────────────────────────
async function dispatchOTP(user, otp, channel) {
  switch (channel) {
    case 'sms':
      return sendOTPSMS(user.phone, otp);
    case 'whatsapp':
      return sendOTPWhatsApp(user.phone, otp);
    default:
      return sendOTPEmail(user.email, otp, user.otpPurpose);
  }
}

// POST /api/auth/register
async function register(req, res, next) {
  try {
    const { fullName, email, phone, password } = req.body;

    const existing = await User.findOne({ where: { email: email.toLowerCase() } });
    if (existing) return error(res, 'Email already registered', 409);

    if (phone) {
      const phoneExists = await User.findOne({ where: { phone } });
      if (phoneExists) return error(res, 'Phone number already registered', 409);
    }

    const otp = generateOTP();
    const user = await User.create({
      fullName,
      email: email.toLowerCase(),
      phone: phone || null,
      password,
      otpCode: otp,
      otpExpiry: getOTPExpiry(),
      otpPurpose: 'verify',
      isVerified: false,
      isActive: true,
    });

    const emailResult = await sendOTPEmail(user.email, otp, 'verify');
    if (!emailResult.success) {
      console.error(`Registration OTP email failed for user ${user.id}: ${emailResult.error}`);
    }

    return success(res, 'Registered successfully. Check your email for OTP.', {
      userId: user.id,
      email: user.email,
      otpEmailSent: Boolean(emailResult.success),
    }, 201);
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/login
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email: email.toLowerCase() } });

    if (!user || !(await user.comparePassword(password))) {
      return error(res, 'Invalid email or password', 401);
    }
    if (!user.isActive) return error(res, 'User account is inactive', 403);

    const { accessToken, refreshToken } = generateTokenPair(user);
    await user.update({ refreshToken });

    return success(res, 'Login successful', {
      user: user.toJSON(),
      accessToken,
      refreshToken,
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/send-otp
async function sendOTP(req, res, next) {
  try {
    const { identifier, channel = 'email', purpose = 'verify' } = req.body;
    const user = await findByIdentifier(identifier);
    if (!user) return error(res, 'User not found', 404);

    const otp = generateOTP();
    await user.update({
      otpCode: otp,
      otpExpiry: getOTPExpiry(),
      otpPurpose: purpose,
    });

    const result = await dispatchOTP(user, otp, channel);
    if (!result.success) {
      return error(res, 'Failed to send OTP. Please try again.', 500);
    }

    return success(res, `OTP sent via ${channel}`, { channel });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/verify-otp
async function verifyOTP(req, res, next) {
  try {
    const { identifier, otp } = req.body;
    const user = await findByIdentifier(identifier);

    if (!user) return error(res, 'User not found', 404);
    if (!isOTPValid(user)) return error(res, 'OTP has expired. Please request a new one.', 410);
    if (user.otpCode !== otp) return error(res, 'Invalid OTP', 400);

    await user.update({
      isVerified: true,
      otpCode: null,
      otpExpiry: null,
      otpPurpose: null,
    });

    // Send welcome email
    sendWelcomeEmail(user.email, user.fullName).catch(console.error);

    const { accessToken, refreshToken } = generateTokenPair(user);
    await user.update({ refreshToken });

    return success(res, 'Account verified successfully', {
      user: user.toJSON(),
      accessToken,
      refreshToken,
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/forgot-password
async function forgotPassword(req, res, next) {
  try {
    const { identifier, channel = 'email' } = req.body;
    const user = await findByIdentifier(identifier);
    if (!user) return error(res, 'No account found with this email/phone', 404);

    const otp = generateOTP();
    await user.update({
      otpCode: otp,
      otpExpiry: getOTPExpiry(),
      otpPurpose: 'reset',
    });

    const result = await dispatchOTP(user, otp, channel);
    if (!result.success) {
      return error(res, 'Failed to send OTP. Please try again.', 500);
    }

    return success(res, `Password reset OTP sent via ${channel}`, { channel });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/reset-password
async function resetPassword(req, res, next) {
  try {
    const { identifier, otp, newPassword } = req.body;
    const user = await findByIdentifier(identifier);

    if (!user) return error(res, 'User not found', 404);
    if (user.otpPurpose !== 'reset') return error(res, 'Invalid OTP purpose', 400);
    if (!isOTPValid(user)) return error(res, 'OTP has expired', 410);
    if (user.otpCode !== otp) return error(res, 'Invalid OTP', 400);

    await user.update({
      password: newPassword,
      otpCode: null,
      otpExpiry: null,
      otpPurpose: null,
      refreshToken: null,
    });

    return success(res, 'Password reset successfully. Please login.');
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/verify-reset-otp
async function verifyResetOTP(req, res, next) {
  try {
    const { identifier, otp } = req.body;
    const user = await findByIdentifier(identifier);

    if (!user) return error(res, 'User not found', 404);
    if (user.otpPurpose !== 'reset') return error(res, 'Invalid OTP purpose', 400);
    if (!isOTPValid(user)) return error(res, 'OTP has expired. Please request a new one.', 410);
    if (user.otpCode !== otp) return error(res, 'Invalid OTP', 400);

    return success(res, 'OTP verified successfully');
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/refresh-token
async function refreshToken(req, res, next) {
  try {
    const { refreshToken: token } = req.body;
    if (!token) return error(res, 'Refresh token required', 400);

    let decoded;
    try {
      decoded = verifyRefreshToken(token);
    } catch {
      return error(res, 'Invalid or expired refresh token', 401);
    }

    const user = await User.findByPk(decoded.id);
    if (!user || user.refreshToken !== token) {
      return error(res, 'Refresh token mismatch', 401);
    }
    if (!user.isActive) return error(res, 'User account is inactive', 403);

    const accessToken = generateAccessToken({ id: user.id, email: user.email });
    return success(res, 'Token refreshed', { accessToken });
  } catch (err) {
    next(err);
  }
}

// GET /api/auth/profile
async function getProfile(req, res) {
  return success(res, 'Profile fetched', { user: req.user.toJSON() });
}

// PUT /api/auth/profile
async function updateProfile(req, res, next) {
  try {
    const { fullName, phone } = req.body;
    const updateData = {};

    if (fullName) updateData.fullName = fullName;
    if (phone) {
      const phoneExists = await User.findOne({ where: { phone, id: { [Op.ne]: req.user.id } } });
      if (phoneExists) return error(res, 'Phone number already in use', 409);
      updateData.phone = phone;
    }
    if (req.file) {
      updateData.profileImage = `/uploads/profiles/${req.file.filename}`;
    }

    await req.user.update(updateData);
    return success(res, 'Profile updated', { user: req.user.toJSON() });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login, sendOTP, verifyOTP, forgotPassword, resetPassword, refreshToken, getProfile, updateProfile, verifyResetOTP };
