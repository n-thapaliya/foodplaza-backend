# FoodPlaza API Test Cases

Base URLs:
- Local: `http://localhost:5000/api`
- Production: `https://foodplaza-backend-69qe.onrender.com/api`

Expected response envelope for API endpoints:

```json
{
  "success": true,
  "message": "string",
  "data": {},
  "errors": null
}
```

## Auth

| Area | Request | Expected |
| --- | --- | --- |
| Register validation | `POST /auth/register` with `{}` | `422`, `success=false`, validation errors |
| Register success | Unique `fullName`, `email`, `phone`, `password` | `201`, user id/email returned, password stored hashed, OTP fields inserted |
| Duplicate email | Reuse email | `409`, no second user |
| Duplicate phone | Reuse phone | `409`, no second user |
| Email failure after insert | Break SMTP and register unique user | `201`, user remains inserted, `otpEmailSent=false`, server logs email error |
| Login wrong email | Unknown email | `401` |
| Login wrong password | Known email, bad password | `401` |
| Login inactive user | `isActive=false` user | `403` |
| Login success | Valid credentials | `200`, access token, refresh token, refresh token persisted |
| Refresh missing | Empty body | `422` |
| Refresh invalid | Invalid token | `401` |
| Refresh mismatch | Valid token not saved on user | `401` |
| Refresh success | Saved refresh token | `200`, new access token |
| Forgot invalid identifier | Unknown email/phone | `404` |
| Forgot success | Known email/phone | `200`, reset OTP saved with expiry |
| Verify OTP expired | Expired OTP | `410` |
| Verify OTP wrong | Wrong OTP | `400` |
| Verify OTP correct | Correct OTP | `200`, user verified, OTP cleared, tokens returned |
| Reset password correct | Correct reset OTP | `200`, password hash updated, old refresh token cleared |

## Profile

| Area | Request | Expected |
| --- | --- | --- |
| No token | `GET /profile` | `401` |
| Valid token | `GET /profile` | `200`, sanitized user |
| Update duplicate phone | `PUT /profile` with used phone | `409` |
| Upload invalid file | `PUT /profile` with non-image | `415` |
| Upload large image | `PUT /profile` over max size | `413` |
| Upload profile image | Valid multipart `profileImage` | `200`, `/uploads/profiles/...` path |

## Food

| Area | Request | Expected |
| --- | --- | --- |
| Categories | `GET /categories` | Sorted categories |
| Foods pagination | `GET /foods?page=1&limit=2` | `items`, `pagination` |
| Search | `GET /foods?search=pizza` | Matching name/description |
| Filter veg | `GET /foods?isVeg=true` | All `isVeg=true` |
| Price filter | `GET /foods?minPrice=100&maxPrice=300` | Prices in range |
| Food by id | `GET /foods/:id` | Food with category |
| Missing food | `GET /foods/999999` | `404` |
| Category foods | `GET /foods/category/:categoryId` | Paginated foods for category |

## Cart, Favorites, Orders

| Area | Request | Expected |
| --- | --- | --- |
| Cart add | `POST /cart` | Creates or increments unique user/food row |
| Cart update | `PUT /cart/:id` | Quantity updated |
| Cart remove | `DELETE /cart/:id` | Row deleted |
| Cart clear | `DELETE /cart/clear` | User cart empty |
| Favorites add | `POST /favorites` | `201` first time |
| Favorites duplicate | Same `POST /favorites` | `409` |
| Favorites remove | `DELETE /favorites/:foodId` | Row deleted |
| Place order | `POST /orders` with items and address | Transaction creates order/items and clears cart |
| Place order missing food | Invalid food id | `404`, transaction rolled back |
| Orders list | `GET /orders` | Paginated user orders with items/address |
| Order detail | `GET /orders/:id` | Only owner can fetch |

