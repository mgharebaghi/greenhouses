import { cache } from "react";
import "server-only";
import { ReadSession } from "./session";

export class AuthenticationError extends Error {
  constructor() {
    super("نشست شما معتبر نیست. لطفاً دوباره وارد شوید.");
    this.name = "AuthenticationError";
  }
}

// Deduplicate session verification within a server render/request.
export const requireSession = cache(async () => {
  const session = await ReadSession();
  if (!session || session.status !== "ok" || !session.id)
    throw new AuthenticationError();
  return { id: session.id, username: session.username };
});
