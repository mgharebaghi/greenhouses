import Login from "@/features/auth/components/LoginForm";
import { requireAuth } from "@/server/auth/actions";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ورود به سامانه | فکور پیوند آریا",
};

export default async function Home() {
  await requireAuth("/");

  return <Login />;
}
