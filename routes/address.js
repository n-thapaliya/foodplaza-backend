const router = require('express').Router();
const ctrl   = require('../controllers/addressController');
const v      = require('../validators/addressValidator');
const validate = require('../middleware/validate');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.get('/',      ctrl.getAddresses);
router.post('/',     v.createAddress, validate, ctrl.createAddress);
router.put('/:id',   ctrl.updateAddress);
router.delete('/:id',ctrl.deleteAddress);

module.exports = router;
