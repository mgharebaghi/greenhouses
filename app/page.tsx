import Login from "./components/auth/LoginForm";
import { requireAuth } from "./lib/auth";

export default async function Home() {
  await requireAuth("/");

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <Login />
    </div>
  );
}
