const { Food, Category } = require('../models');
const { success, error } = require('../utils/response');
const { getPagination, paginatedResponse } = require('../utils/paginate');
const { Op } = require('sequelize');

const FOOD_INCLUDE = [{ model: Category, as: 'category', attributes: ['id', 'name', 'image'] }];

// GET /api/categories
async function getCategories(req, res, next) {
  try {
    const categories = await Category.findAll({ order: [['name', 'ASC']] });
    return success(res, 'Categories fetched', { categories });
  } catch (err) {
    next(err);
  }
}

// GET /api/foods
async function getFoods(req, res, next) {
  try {
    const { page, limit, offset } = getPagination(req.query);
    const { search, isVeg, minPrice, maxPrice, sortBy = 'createdAt', sortOrder = 'DESC' } = req.query;

    const where = {};

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }
    if (isVeg !== undefined) where.isVeg = isVeg === 'true';
    if (minPrice) where.price = { ...where.price, [Op.gte]: parseFloat(minPrice) };
    if (maxPrice) where.price = { ...where.price, [Op.lte]: parseFloat(maxPrice) };

    const allowedSort = ['name', 'price', 'rating', 'createdAt'];
    const sortField = allowedSort.includes(sortBy) ? sortBy : 'createdAt';
    const sortDir   = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const { rows, count } = await Food.findAndCountAll({
      where,
      include: FOOD_INCLUDE,
      order: [[sortField, sortDir]],
      limit,
      offset,
      distinct: true,
    });

    return success(res, 'Foods fetched', paginatedResponse(rows, count, page, limit));
  } catch (err) {
    next(err);
  }
}

// GET /api/foods/:id
async function getFoodById(req, res, next) {
  try {
    const food = await Food.findByPk(req.params.id, { include: FOOD_INCLUDE });
    if (!food) return error(res, 'Food not found', 404);
    return success(res, 'Food fetched', { food });
  } catch (err) {
    next(err);
  }
}

// GET /api/foods/category/:categoryId
async function getFoodsByCategory(req, res, next) {
  try {
    const { page, limit, offset } = getPagination(req.query);

    const category = await Category.findByPk(req.params.categoryId);
    if (!category) return error(res, 'Category not found', 404);

    const { rows, count } = await Food.findAndCountAll({
      where: { categoryId: req.params.categoryId },
      include: FOOD_INCLUDE,
      order: [['rating', 'DESC']],
      limit,
      offset,
    });

    return success(res, 'Foods by category fetched', paginatedResponse(rows, count, page, limit));
  } catch (err) {
    next(err);
  }
}

module.exports = { getCategories, getFoods, getFoodById, getFoodsByCategory };
