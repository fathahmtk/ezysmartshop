import { CheckoutPageClient } from "@/components/checkout-page-client";

export const metadata = {
  title: "Checkout",
  robots: {
    index: false,
    follow: false
  }
};

export default function CheckoutPage() {
  return <CheckoutPageClient />;
}

