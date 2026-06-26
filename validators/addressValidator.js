const { body } = require('express-validator');

const createAddress = [
  body('house').trim().notEmpty().withMessage('House/flat number is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('state').trim().notEmpty().withMessage('State is required'),
  body('pincode').trim().notEmpty().withMessage('Pincode is required').isLength({ min: 4, max: 10 }).withMessage('Invalid pincode'),
  body('label').optional().trim().isLength({ max: 50 }).withMessage('Label too long'),
  body('lat').optional().isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
  body('lng').optional().isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude'),
  body('isDefault').optional().isBoolean().withMessage('isDefault must be boolean'),
];

const updateAddress = [
  body('house').optional().trim().notEmpty().withMessage('House/flat number cannot be empty'),
  body('street').optional().trim(),
  body('city').optional().trim().notEmpty().withMessage('City cannot be empty'),
  body('state').optional().trim().notEmpty().withMessage('State cannot be empty'),
  body('pincode').optional().trim().isLength({ min: 4, max: 10 }).withMessage('Invalid pincode'),
  body('label').optional().trim().isLength({ max: 50 }).withMessage('Label too long'),
  body('lat').optional().isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
  body('lng').optional().isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude'),
  body('isDefault').optional().isBoolean().withMessage('isDefault must be boolean'),
];

module.exports = { createAddress, updateAddress };
