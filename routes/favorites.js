const router = require('express').Router();
const ctrl   = require('../controllers/favoriteController');
const { authenticate, requireVerified } = require('../middleware/auth');

router.use(authenticate, requireVerified);

router.get('/',         ctrl.getFavorites);
router.post('/',        ctrl.addFavorite);
router.delete('/:foodId', ctrl.removeFavorite);

module.exports = router;
