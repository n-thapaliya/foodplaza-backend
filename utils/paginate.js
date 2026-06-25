function getPagination(query) {
  const page  = Math.max(1, parseInt(query.page)  || 1);
  const limit = Math.min(100, parseInt(query.limit) || 10);
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

function paginatedResponse(rows, count, page, limit) {
  return {
    items: rows,
    pagination: {
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
      hasNext: page * limit < count,
      hasPrev: page > 1,
    },
  };
}

module.exports = { getPagination, paginatedResponse };
