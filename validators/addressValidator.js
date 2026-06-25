const { body } = require('express-validator');

const createAddress = [
  body('house').trim().notEmpty().withMessage('House/flat number is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('state').trim().notEmpty().withMessage('State is required'),
  body('pincode').trim().notEmpty().withMessage('Pincode is required').isLength({ min: 4, max: 10 }).withMessage('Invalid pincode'),
  body('label').optional().trim().isLength({ max: 50 }).withMessage('Label too long'),
];

module.exports = { createAddress };
