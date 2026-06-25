const router = require('express').Router();
const ctrl   = require('../controllers/cartController');
const { authenticate, requireVerified } = require('../middleware/auth');

router.use(authenticate, requireVerified);

router.get('/',       ctrl.getCart);
router.post('/',      ctrl.addToCart);
router.put('/:id',    ctrl.updateCart);
router.delete('/clear', ctrl.clearCart);
router.delete('/:id', ctrl.removeFromCart);

module.exports = router;
