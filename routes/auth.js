const router = require('express').Router();
const ctrl   = require('../controllers/authController');
const v      = require('../validators/authValidator');
const validate = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const { uploadProfile } = require('../services/uploadService');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication & user management
 */

router.post('/register',       v.register,       validate, ctrl.register);
router.post('/login',          v.login,          validate, ctrl.login);
router.post('/send-otp',       v.sendOTP,        validate, ctrl.sendOTP);
router.post('/verify-otp',     v.verifyOTP,      validate, ctrl.verifyOTP);
router.post('/verify-reset-otp', v.verifyOTP,    validate, ctrl.verifyResetOTP);
router.post('/forgot-password',v.forgotPassword, validate, ctrl.forgotPassword);
router.post('/reset-password', v.resetPassword,  validate, ctrl.resetPassword);
router.post('/refresh-token',  v.refreshToken,   validate, ctrl.refreshToken);

router.get('/profile',  authenticate, ctrl.getProfile);
router.put('/profile',  authenticate, (req, res, next) => {
  uploadProfile(req, res, (err) => {
    if (err) return next(err);
    next();
  });
}, v.updateProfile, validate, ctrl.updateProfile);

module.exports = router;
