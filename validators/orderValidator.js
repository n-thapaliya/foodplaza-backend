const { body } = require('express-validator');

const createOrder = [
  body('items').isArray({ min: 1 }).withMessage('At least one item is required'),
  body('items.*.foodId').isInt({ min: 1 }).withMessage('Valid food ID required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('deliveryAddress').trim().notEmpty().withMessage('Delivery address is required'),
  body('paymentMethod').isIn(['cod','gpay','phonepe','paytm','razorpay','card']).withMessage('Invalid payment method'),
];

module.exports = { createOrder };
