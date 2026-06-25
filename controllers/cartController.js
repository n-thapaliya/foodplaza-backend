const { Cart, Food } = require('../models');
const { success, error } = require('../utils/response');

// GET /api/cart
async function getCart(req, res, next) {
  try {
    const items = await Cart.findAll({
      where: { userId: req.user.id },
      include: [{ model: Food, as: 'food', attributes: ['id', 'name', 'price', 'image', 'isVeg'] }],
      order: [['createdAt', 'DESC']],
    });

    const subtotal = items.reduce((sum, item) => sum + parseFloat(item.food.price) * item.quantity, 0);

    return success(res, 'Cart fetched', {
      items,
      subtotal: parseFloat(subtotal.toFixed(2)),
      totalItems: items.length,
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/cart
async function addToCart(req, res, next) {
  try {
    const { foodId, quantity = 1 } = req.body;

    if (!foodId) return error(res, 'Food ID is required', 400);
    if (quantity < 1) return error(res, 'Quantity must be at least 1', 400);

    const food = await Food.findByPk(foodId);
    if (!food) return error(res, 'Food not found', 404);

    const [cartItem, created] = await Cart.findOrCreate({
      where: { userId: req.user.id, foodId },
      defaults: { quantity },
    });

    if (!created) {
      await cartItem.update({ quantity: cartItem.quantity + quantity });
    }

    const item = await Cart.findByPk(cartItem.id, {
      include: [{ model: Food, as: 'food', attributes: ['id', 'name', 'price', 'image', 'isVeg'] }],
    });

    return success(res, created ? 'Added to cart' : 'Cart updated', { item }, created ? 201 : 200);
  } catch (err) {
    next(err);
  }
}

// PUT /api/cart/:id
async function updateCart(req, res, next) {
  try {
    const { quantity } = req.body;
    if (!quantity || quantity < 1) return error(res, 'Valid quantity required', 400);

    const cartItem = await Cart.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!cartItem) return error(res, 'Cart item not found', 404);

    await cartItem.update({ quantity });

    const item = await Cart.findByPk(cartItem.id, {
      include: [{ model: Food, as: 'food', attributes: ['id', 'name', 'price', 'image', 'isVeg'] }],
    });

    return success(res, 'Cart updated', { item });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/cart/:id
async function removeFromCart(req, res, next) {
  try {
    const cartItem = await Cart.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!cartItem) return error(res, 'Cart item not found', 404);

    await cartItem.destroy();
    return success(res, 'Removed from cart');
  } catch (err) {
    next(err);
  }
}

// DELETE /api/cart
async function clearCart(req, res, next) {
  try {
    await Cart.destroy({ where: { userId: req.user.id } });
    return success(res, 'Cart cleared');
  } catch (err) {
    next(err);
  }
}

module.exports = { getCart, addToCart, updateCart, removeFromCart, clearCart };
