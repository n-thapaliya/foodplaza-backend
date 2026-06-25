const router = require('express').Router();
const ctrl   = require('../controllers/orderController');
const v      = require('../validators/orderValidator');
const validate = require('../middleware/validate');
const { authenticate, requireVerified } = require('../middleware/auth');

router.use(authenticate, requireVerified);

router.post('/',             v.createOrder, validate, ctrl.createOrder);
router.get('/',              ctrl.getOrders);
router.get('/:id',           ctrl.getOrderById);
router.put('/:id/status',    ctrl.updateOrderStatus);

module.exports = router;
