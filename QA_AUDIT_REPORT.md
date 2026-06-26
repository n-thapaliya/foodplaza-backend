# FoodPlaza Backend Audit Report

Date: 2026-06-26

## Production Verification Snapshot

Live backend checked: `https://foodplaza-backend-69qe.onrender.com`

- `GET /health`: reachable, but production still returns the old envelope without `data` and `errors`.
- `GET /api/categories`: reachable and returns seeded categories.
- `GET /api/foods?limit=2`: reachable and paginated.
- `GET /api/foods/category/1?limit=2`: reachable and paginated.
- `POST /api/auth/register` with empty body: returns `422`, but production old response omits `data`.
- `POST /api/auth/login` with invalid credentials: returns `401`, but production old response omits `data` and `errors`.
- `POST /api/auth/refresh-token` with invalid token: returns `401`, but production old response omits `data` and `errors`.
- `POST /api/auth/forgot-password` with unknown identifier: returns `404`, but production old response omits `data` and `errors`.

Production has not been redeployed with the local fixes yet.

## Fixed Issues

| Severity | Area | Root cause | Fix |
| --- | --- | --- | --- |
| Critical | Registration | User was created with `isVerified=true` before OTP verification. | Registration now creates `isVerified=false`; verification sets it true after correct OTP. |
| High | Registration/email | SMTP failure after successful insert caused registration to fail. | Registration logs email failure and still returns `201` with `otpEmailSent=false`. |
| High | API envelope | Success and error helpers returned different shapes. | Both helpers now return `success`, `message`, `data`, and `errors`. |
| High | Auth | No inactive-user enforcement. | Added `isActive` model/migration field and login/JWT checks. |
| High | Security | Missing Helmet and rate limiting. | Added Helmet, global API limiter, and stricter auth limiter. |
| High | Dependencies | Nodemailer audit advisories. | Upgraded Nodemailer to `9.0.1` and disabled file/url access in mail transport/messages. |
| Medium | Profile API | Requested `/profile` endpoint did not exist outside `/auth/profile`. | Added `/api/profile` router and updated mobile service calls. |
| Medium | Orders | Orders stored only free-text address and had no saved address relation. | Added nullable `addressId`, model associations, migration, and includes. |
| Medium | Orders performance | `createOrder` fetched foods one-by-one. | Replaced with one `IN` query and in-memory lookup. |
| Medium | Order auditability | `order_items` had no timestamps. | Added model timestamps and migration for `createdAt`/`updatedAt`. |
| Medium | DB indexes | Missing indexes for address and order item query paths. | Added explicit indexes for `addresses.userId`, `order_items.orderId`, `order_items.foodId`. |
| Medium | Uploads | Upload directory default depended on process cwd, while static serving used backend path. | Normalized default upload path to backend-local `uploads`. |
| Medium | Address updates | `PUT /address/:id` accepted unvalidated body data. | Added partial update validation. |
| Low | Token/user response | Sanitized user output still exposed `otpPurpose`. | Removed `otpPurpose` from `toJSON`. |
| Low | JWT config | Missing JWT secrets failed late and opaquely. | JWT helpers now require secrets and enforce production length. |

## Residual Risks

- `npm audit` still reports two moderate findings from Sequelize's transitive `uuid`. npm's suggested fix is a downgrade to Sequelize `3.30.0`, which is not safe for this codebase. Keep Sequelize on the latest v6 patch and monitor upstream.
- Full mutating production tests were not run against Render because they would create users, send email, and alter live data. Use the generated Postman/API test cases against a staging database or approved test account.
- Render and Neon environment variables cannot be inspected from this workspace. Verify them in the Render dashboard: `DATABASE_URL`, `NODE_ENV=production`, `PORT`, SMTP variables, JWT secrets, and `CORS_ORIGINS`.

## Production Readiness Score

Local code after fixes: 84/100.

Main blockers to 90+: deploy the fixes, run migrations on Neon, complete staging mutating API tests, resolve or accept the Sequelize transitive audit warning, and verify Render environment variables directly.

