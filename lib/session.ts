"use server";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { prisma } from "./singletone";
import { cookies } from "next/headers";

export type Session = {
  status: "ok" | "error";
  code: number;
  id?: number;
  username?: string;
};

function b64url(buf: Buffer) {
  return buf.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export async function CreateSession(data: { userId: number; remember: boolean }) {
  const publicId = b64url(randomBytes(12));
  const secret = b64url(randomBytes(32));
  const secretHash = await bcrypt.hash(secret, 10);

  const ttlDays = data.remember ? 30 : 1;
  const expiresAt = new Date(Date.now() + ttlDays * 24 * 60 * 60 * 1000);

  await prisma.session.create({
    data: {
      PublicID: publicId,
      SecretHash: secretHash,
      UserId: data.userId,
      CreatedAt: new Date(),
      ExpiresAt: expiresAt,
    },
  });

  const token = `csn_${publicId}.${secret}`;
  return { token, expiresAt, ttlDays };
}

export async function ReadSession(): Promise<Session | null> {
  const raw = (await cookies()).get("GHSession")?.value;
  if (!raw) return null;
  if (!raw?.startsWith("csn_")) return null;

  const token = /^csn_([A-Za-z0-9\-_]+)\.([A-Za-z0-9\-_]+)$/.exec(raw);
  if (!token) return null;
  const [, publicId, secret] = token;

  const session = await prisma.session.findFirst({
    where: { PublicID: publicId },
  });

  if (!session) return { status: "error", code: 404 };
  if (!session.ExpiresAt) return { status: "error", code: 403 };

  if (session.ExpiresAt < new Date()) {
    await prisma.session.deleteMany({ where: { PublicID: publicId } });
    return null;
  }

  const isValid = await bcrypt.compare(secret, session.SecretHash);
  if (!isValid) return { status: "error", code: 403 };

  const user = await prisma.users.findUnique({
    where: { ID: session.UserId || 0 },
    select: { ID: true, Username: true },
  });

  if (!user) return { status: "error", code: 404 };

  return { status: "ok", code: 200, id: user.ID, username: user.Username };
}

export async function DeleteSession() {
  const raw = (await cookies()).get("GHSession")?.value;
  if (!raw) return;
  if (!raw?.startsWith("csn_")) return;

  const token = /^csn_([A-Za-z0-9\-_]+)\.([A-Za-z0-9\-_]+)$/.exec(raw);
  if (!token) return;
  const [, publicId] = token;

  await prisma.session.deleteMany({ where: { PublicID: publicId } });
  const cookieStore = cookies();
  (await cookieStore).set({
    name: "GHSession",
    value: "",
    maxAge: 0,
  });
}
