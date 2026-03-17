import { OrderSuccessClient } from "@/components/order-success-client";

export const metadata = {
  title: "Order Success",
  robots: {
    index: false,
    follow: false
  }
};

type OrderSuccessSearchParams = {
  orderId?: string;
};

type OrderSuccessPageProps = {
  searchParams?: Promise<OrderSuccessSearchParams>;
};

export default async function OrderSuccessPage({ searchParams }: OrderSuccessPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;

  return <OrderSuccessClient orderId={resolvedSearchParams?.orderId} />;
}
