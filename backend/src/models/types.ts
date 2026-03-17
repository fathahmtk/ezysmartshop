export type Role = "customer" | "admin";

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  createdAt: string;
};

export type Product = {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  comparePrice: number;
  stock: number;
  category: string;
  images: string[];
  rating: number;
  vendor: string;
  specifications: string[];
  shippingDetails: string[];
  createdAt: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
};

export type Coupon = {
  id: string;
  code: string;
  discount: number;
  type: "percentage" | "fixed";
  expiry: string;
};

export type CartItem = {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
};

export type Cart = {
  id: string;
  userId: string;
  items: CartItem[];
};

export type OrderItem = {
  id: string;
  productId: string;
  quantity: number;
  price: number;
};

export type Order = {
  id: string;
  userId: string;
  subtotal: number;
  discount: number;
  total: number;
  couponCode?: string;
  paymentMethod?: "razorpay" | "stripe" | "cod";
  paymentStatus: "pending" | "paid" | "failed";
  orderStatus: "created" | "packed" | "shipped" | "delivered" | "cancelled";
  shippingAddress: string;
  items: OrderItem[];
  createdAt: string;
};

export type CheckoutQuote = {
  items: Array<{
    productId: string;
    title: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }>;
  subtotal: number;
  discount: number;
  total: number;
  couponCode?: string;
};
