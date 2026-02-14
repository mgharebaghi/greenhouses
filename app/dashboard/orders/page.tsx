import type { Metadata } from "next";
import OrdersClientPage from "@/features/orders/components/OrdersClientPage";

export const metadata: Metadata = {
    title: "مدیریت سفارشات",
};

export default function OrdersPage() {
    return <OrdersClientPage />;
}
