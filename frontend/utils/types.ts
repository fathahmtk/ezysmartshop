export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
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
  badge?: string;
  specifications: string[];
  shippingDetails: string[];
};

export type Testimonial = {
  id: string;
  name: string;
  location: string;
  quote: string;
};

export type CartLine = {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  product: Product | null;
};

export type CartState = {
  id: string;
  userId: string;
  items: CartLine[];
  /** Shopify-managed checkout URL; present only when Shopify integration is active. */
  checkoutUrl?: string;
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

export type OrderRecord = {
  id: string;
  items: Array<{
    id: string;
    productId: string;
    quantity: number;
    price: number;
  }>;
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod?: "razorpay" | "stripe" | "cod";
  paymentStatus: "pending" | "paid" | "failed";
  orderStatus: "created" | "packed" | "shipped" | "delivered" | "cancelled";
  couponCode?: string;
  shippingAddress: string;
  createdAt: string;
};
