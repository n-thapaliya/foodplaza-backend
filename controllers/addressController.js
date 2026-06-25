const { Address } = require('../models');
const { success, error } = require('../utils/response');

// GET /api/address
async function getAddresses(req, res, next) {
  try {
    const addresses = await Address.findAll({
      where: { userId: req.user.id },
      order: [['isDefault', 'DESC'], ['createdAt', 'DESC']],
    });
    return success(res, 'Addresses fetched', { addresses });
  } catch (err) {
    next(err);
  }
}

// POST /api/address
async function createAddress(req, res, next) {
  try {
    const { label, house, street, city, state, pincode, isDefault, lat, lng } = req.body;

    // If this is set as default, unset all others
    if (isDefault) {
      await Address.update({ isDefault: false }, { where: { userId: req.user.id } });
    }

    const address = await Address.create({
      userId: req.user.id,
      label,
      house,
      street,
      city,
      state,
      pincode,
      isDefault: isDefault || false,
      lat,
      lng,
    });

    return success(res, 'Address created', { address }, 201);
  } catch (err) {
    next(err);
  }
}

// PUT /api/address/:id
async function updateAddress(req, res, next) {
  try {
    const address = await Address.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!address) return error(res, 'Address not found', 404);

    const { isDefault } = req.body;
    if (isDefault) {
      await Address.update({ isDefault: false }, { where: { userId: req.user.id } });
    }

    await address.update(req.body);
    return success(res, 'Address updated', { address });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/address/:id
async function deleteAddress(req, res, next) {
  try {
    const deleted = await Address.destroy({ where: { id: req.params.id, userId: req.user.id } });
    if (!deleted) return error(res, 'Address not found', 404);
    return success(res, 'Address deleted');
  } catch (err) {
    next(err);
  }
}

module.exports = { getAddresses, createAddress, updateAddress, deleteAddress };
