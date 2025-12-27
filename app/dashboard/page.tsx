
import type { Metadata } from "next";
import DashboardContent from "./DashboardContent";

export const metadata: Metadata = {
  title: "داشبورد",
};

export default function Dashboard() {
  return <DashboardContent />;
}
