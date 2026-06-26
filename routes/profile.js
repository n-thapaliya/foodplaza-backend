const router = require('express').Router();
const ctrl = require('../controllers/authController');
const v = require('../validators/authValidator');
const validate = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');
const { uploadProfile } = require('../services/uploadService');

router.use(authenticate);

router.get('/', ctrl.getProfile);
router.put('/', (req, res, next) => {
  uploadProfile(req, res, (err) => {
    if (err) return next(err);
    next();
  });
}, v.updateProfile, validate, ctrl.updateProfile);

module.exports = router;
