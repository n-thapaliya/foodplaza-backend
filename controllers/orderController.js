const { Op } = require('sequelize');
const { Order, OrderItem, Food, Cart, Address } = require('../models');
const { sequelize } = require('../models');
const { success, error } = require('../utils/response');
const { getPagination, paginatedResponse } = require('../utils/paginate');

// POST /api/orders
async function createOrder(req, res, next) {
  const t = await sequelize.transaction();
  try {
    const { items, addressId, paymentMethod, notes, deliveryLat, deliveryLng } = req.body;
    let { deliveryAddress } = req.body;

    if (addressId) {
      const address = await Address.findOne({
        where: { id: addressId, userId: req.user.id },
        transaction: t,
      });
      if (!address) {
        await t.rollback();
        return error(res, 'Address not found', 404);
      }
      deliveryAddress = [
        address.house,
        address.street,
        address.city,
        address.state,
        address.pincode,
      ].filter(Boolean).join(', ');
    }

    if (!deliveryAddress) {
      await t.rollback();
      return error(res, 'Delivery address is required', 422, ['Delivery address is required']);
    }

    const requestedFoodIds = [...new Set(items.map((item) => Number(item.foodId)))];
    const foods = await Food.findAll({
      where: { id: { [Op.in]: requestedFoodIds } },
      transaction: t,
    });
    const foodById = new Map(foods.map((food) => [Number(food.id), food]));

    const missingFoodId = requestedFoodIds.find((foodId) => !foodById.has(foodId));
    if (missingFoodId) {
      await t.rollback();
      return error(res, `Food with ID ${missingFoodId} not found`, 404);
    }

    let totalAmount = 0;
    const enrichedItems = items.map((item) => {
      const food = foodById.get(Number(item.foodId));
      const quantity = Number(item.quantity);
      const price = parseFloat(food.price);
      const lineTotal = price * quantity;
      totalAmount += lineTotal;
      return { food, quantity, price };
    });

    // Add delivery fee
    const DELIVERY_FEE = 40;
    totalAmount += DELIVERY_FEE;

    // Create order
    const order = await Order.create({
      userId: req.user.id,
      addressId: addressId || null,
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
      }, {
        model: Address,
        as: 'address',
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
      }, {
        model: Address,
        as: 'address',
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
      }, {
        model: Address,
        as: 'address',
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
