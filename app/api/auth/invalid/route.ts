import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const next = url.searchParams.get("next") ?? "/";

  const res = NextResponse.redirect(new URL(next, req.url));
  res.cookies.set("GHSession", "", { path: "/", maxAge: 0 });
  return res;
}
