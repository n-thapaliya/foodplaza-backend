const { Favorite, Food, Category } = require('../models');
const { success, error } = require('../utils/response');

// GET /api/favorites
async function getFavorites(req, res, next) {
  try {
    const favorites = await Favorite.findAll({
      where: { userId: req.user.id },
      include: [{
        model: Food, as: 'food',
        attributes: ['id', 'name', 'price', 'image', 'rating', 'isVeg', 'prepTime'],
        include: [{ model: Category, as: 'category', attributes: ['id', 'name'] }],
      }],
      order: [['createdAt', 'DESC']],
    });
    return success(res, 'Favorites fetched', { favorites, total: favorites.length });
  } catch (err) {
    next(err);
  }
}

// POST /api/favorites
async function addFavorite(req, res, next) {
  try {
    const { foodId } = req.body;
    if (!foodId) return error(res, 'Food ID required', 400);

    const food = await Food.findByPk(foodId);
    if (!food) return error(res, 'Food not found', 404);

    const [fav, created] = await Favorite.findOrCreate({
      where: { userId: req.user.id, foodId },
    });

    if (!created) return error(res, 'Already in favorites', 409);

    return success(res, 'Added to favorites', { favoriteId: fav.id }, 201);
  } catch (err) {
    next(err);
  }
}

// DELETE /api/favorites/:foodId
async function removeFavorite(req, res, next) {
  try {
    const deleted = await Favorite.destroy({
      where: { userId: req.user.id, foodId: req.params.foodId },
    });
    if (!deleted) return error(res, 'Favorite not found', 404);
    return success(res, 'Removed from favorites');
  } catch (err) {
    next(err);
  }
}

module.exports = { getFavorites, addFavorite, removeFavorite };
