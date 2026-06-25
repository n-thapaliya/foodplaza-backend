const { Order, OrderItem, Food, User, Cart } = require('../models');
const { sequelize } = require('../models');
const { success, error } = require('../utils/response');
const { getPagination, paginatedResponse } = require('../utils/paginate');

// POST /api/orders
async function createOrder(req, res, next) {
  const t = await sequelize.transaction();
  try {
    const { items, deliveryAddress, paymentMethod, notes, deliveryLat, deliveryLng } = req.body;

    // Validate and price each item
    let totalAmount = 0;
    const enrichedItems = [];

    for (const item of items) {
      const food = await Food.findByPk(item.foodId, { transaction: t });
      if (!food) {
        await t.rollback();
        return error(res, `Food with ID ${item.foodId} not found`, 404);
      }
      const lineTotal = parseFloat(food.price) * item.quantity;
      totalAmount += lineTotal;
      enrichedItems.push({ food, quantity: item.quantity, price: parseFloat(food.price) });
    }

    // Add delivery fee
    const DELIVERY_FEE = 40;
    totalAmount += DELIVERY_FEE;

    // Create order
    const order = await Order.create({
      userId: req.user.id,
      totalAmount: parseFloat(totalAmount.toFixed(2)),
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
      orderStatus: 'placed',
      deliveryAddress,
      deliveryLat,
      deliveryLng,
      notes,
    }, { transaction: t });

    // Create order items
    await OrderItem.bulkCreate(
      enrichedItems.map(({ food, quantity, price }) => ({
        orderId: order.id,
        foodId: food.id,
        quantity,
        price,
      })),
      { transaction: t }
    );

    // Clear user's cart
    await Cart.destroy({ where: { userId: req.user.id }, transaction: t });

    await t.commit();

    const fullOrder = await Order.findByPk(order.id, {
      include: [{
        model: OrderItem,
        as: 'items',
        include: [{ model: Food, as: 'food', attributes: ['id', 'name', 'image', 'price'] }],
      }],
    });

    return success(res, 'Order placed successfully', { order: fullOrder }, 201);
  } catch (err) {
    await t.rollback();
    next(err);
  }
}

// GET /api/orders
async function getOrders(req, res, next) {
  try {
    const { page, limit, offset } = getPagination(req.query);
    const { status } = req.query;

    const where = { userId: req.user.id };
    if (status) where.orderStatus = status;

    const { rows, count } = await Order.findAndCountAll({
      where,
      include: [{
        model: OrderItem,
        as: 'items',
        include: [{ model: Food, as: 'food', attributes: ['id', 'name', 'image', 'price'] }],
      }],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
      distinct: true,
    });

    return success(res, 'Orders fetched', paginatedResponse(rows, count, page, limit));
  } catch (err) {
    next(err);
  }
}

// GET /api/orders/:id
async function getOrderById(req, res, next) {
  try {
    const order = await Order.findOne({
      where: { id: req.params.id, userId: req.user.id },
      include: [{
        model: OrderItem,
        as: 'items',
        include: [{ model: Food, as: 'food', attributes: ['id', 'name', 'image', 'price', 'isVeg'] }],
      }],
    });
    if (!order) return error(res, 'Order not found', 404);
    return success(res, 'Order fetched', { order });
  } catch (err) {
    next(err);
  }
}

// PUT /api/orders/:id/status  (admin / system use)
async function updateOrderStatus(req, res, next) {
  try {
    const { orderStatus, paymentStatus } = req.body;
    const order = await Order.findByPk(req.params.id);
    if (!order) return error(res, 'Order not found', 404);

    const updateData = {};
    if (orderStatus) updateData.orderStatus = orderStatus;
    if (paymentStatus) updateData.paymentStatus = paymentStatus;

    await order.update(updateData);
    return success(res, 'Order status updated', { order });
  } catch (err) {
    next(err);
  }
}

module.exports = { createOrder, getOrders, getOrderById, updateOrderStatus };
