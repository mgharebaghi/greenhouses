import Login from "./components/auth/LoginForm";
import { requireAuth } from "./lib/auth";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ورود به سامانه",
};

export default async function Home() {
  await requireAuth("/");

  return <Login />;
}
