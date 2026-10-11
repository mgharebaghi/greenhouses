import OrdersClientPage from "@/features/orders/components/OrdersClientPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "مدیریت سفارشات",
};

export default function OrdersPage() {
  return <OrdersClientPage />;
}
