# API Documentation

Base URL: `/api`

## Auth

- `POST /register`
- `POST /login`
- `GET /me`

## Catalog

- `GET /products`
- `GET /products/:slug`
- `GET /categories`

## Cart

- `GET /cart`
- `POST /cart/items`

## Orders

- `POST /orders/quote`
- `GET /orders`
- `POST /orders`

## Payments

- `POST /payments/intent`

## Coupons

- `GET /coupons`

## Recommendations

- `GET /recommendations?productId=prd-2`

## Admin

- `GET /admin/dashboard`
- `GET /admin/customers`
- `GET /admin/inventory`
- `GET /admin/orders`
- `GET /admin/coupons`
