-- FoodPlaza PostgreSQL / Neon verification queries

-- Tables and columns
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;

-- Foreign keys and cascade rules
SELECT
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name,
  rc.update_rule,
  rc.delete_rule
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage ccu
  ON ccu.constraint_name = tc.constraint_name
JOIN information_schema.referential_constraints rc
  ON rc.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
ORDER BY tc.table_name, kcu.column_name;

-- Indexes
SELECT tablename, indexname, indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- Duplicate prevention checks
SELECT email, COUNT(*) FROM users GROUP BY email HAVING COUNT(*) > 1;
SELECT phone, COUNT(*) FROM users WHERE phone IS NOT NULL GROUP BY phone HAVING COUNT(*) > 1;
SELECT "userId", "foodId", COUNT(*) FROM carts GROUP BY "userId", "foodId" HAVING COUNT(*) > 1;
SELECT "userId", "foodId", COUNT(*) FROM favorites GROUP BY "userId", "foodId" HAVING COUNT(*) > 1;

-- Password and token checks
SELECT id, email, password LIKE '$2%' AS password_is_bcrypt, "refreshToken" IS NOT NULL AS has_refresh_token
FROM users
ORDER BY id DESC
LIMIT 25;

-- OTP checks
SELECT id, email, "otpPurpose", "otpExpiry", "otpExpiry" > NOW() AS otp_unexpired
FROM users
WHERE "otpCode" IS NOT NULL
ORDER BY "updatedAt" DESC;

-- Order relation and total verification
SELECT
  o.id,
  o."userId",
  o."addressId",
  o."totalAmount"::numeric AS stored_total,
  COALESCE(SUM(oi.quantity * oi.price::numeric), 0) + 40 AS calculated_total_with_delivery_fee
FROM orders o
LEFT JOIN order_items oi ON oi."orderId" = o.id
GROUP BY o.id
ORDER BY o.id DESC
LIMIT 25;

-- Orphan checks
SELECT c.* FROM carts c LEFT JOIN users u ON u.id = c."userId" WHERE u.id IS NULL;
SELECT c.* FROM carts c LEFT JOIN foods f ON f.id = c."foodId" WHERE f.id IS NULL;
SELECT oi.* FROM order_items oi LEFT JOIN orders o ON o.id = oi."orderId" WHERE o.id IS NULL;
SELECT oi.* FROM order_items oi LEFT JOIN foods f ON f.id = oi."foodId" WHERE f.id IS NULL;

