const router = require('express').Router();
const ctrl   = require('../controllers/foodController');

router.get('/categories',              ctrl.getCategories);
router.get('/foods',                   ctrl.getFoods);
router.get('/foods/:id',              ctrl.getFoodById);
router.get('/foods/category/:categoryId', ctrl.getFoodsByCategory);

module.exports = router;
