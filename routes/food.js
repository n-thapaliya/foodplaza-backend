const router = require('express').Router();
const ctrl   = require('../controllers/foodController');

router.get('/categories',              ctrl.getCategories);
router.get('/foods',                   ctrl.getFoods);
router.get('/foods/category/:categoryId', ctrl.getFoodsByCategory);
router.get('/foods/:id',              ctrl.getFoodById);

module.exports = router;
