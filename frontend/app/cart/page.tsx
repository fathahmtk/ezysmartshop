import { CartPageClient } from "@/components/cart-page-client";

export const metadata = {
  title: "Cart",
  robots: {
    index: false,
    follow: false
  }
};

export default function CartPage() {
  return <CartPageClient />;
}

