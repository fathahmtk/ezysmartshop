import { categories, coupons, orders, products, users } from "../data/seed";

console.log(
  JSON.stringify(
    {
      users: users.length,
      categories: categories.length,
      products: products.length,
      orders: orders.length,
      coupons: coupons.length
    },
    null,
    2
  )
);

