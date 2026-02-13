import Login from "@/shared/components/auth/LoginForm";
import { requireAuth } from "@/lib/auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ورود به سامانه | فکور پیوند آریا",
};

export default async function Home() {
  await requireAuth("/");

  return <Login />;
}
