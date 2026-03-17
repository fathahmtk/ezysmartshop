import { Cart, Category, Coupon, Order, Product, User } from "../../../models/types";
import { categories, coupons, orders, products, users } from "../../../data/seed";

const initialCarts: Cart[] = [
  {
    id: "cart-1",
    userId: "usr-customer",
    items: [
      { id: "ci-1", cartId: "cart-1", productId: "prd-2", quantity: 1 },
      { id: "ci-2", cartId: "cart-1", productId: "prd-1", quantity: 2 }
    ]
  }
];

function cloneUsers(entries: User[]) {
  return entries.map((entry) => ({ ...entry }));
}

function cloneCategories(entries: Category[]) {
  return entries.map((entry) => ({ ...entry }));
}

function cloneProducts(entries: Product[]) {
  return entries.map((entry) => ({
    ...entry,
    images: [...entry.images],
    specifications: [...entry.specifications],
    shippingDetails: [...entry.shippingDetails]
  }));
}

function cloneCoupons(entries: Coupon[]) {
  return entries.map((entry) => ({ ...entry }));
}

function cloneOrders(entries: Order[]) {
  return entries.map((entry) => ({
    ...entry,
    items: entry.items.map((item) => ({ ...item }))
  }));
}

function cloneCarts(entries: Cart[]) {
  return entries.map((entry) => ({
    ...entry,
    items: entry.items.map((item) => ({ ...item }))
  }));
}

export class InMemoryStore {
  users = cloneUsers(users);
  categories = cloneCategories(categories);
  products = cloneProducts(products);
  coupons = cloneCoupons(coupons);
  orders = cloneOrders(orders);
  carts = cloneCarts(initialCarts);
}
