export type FieldErrors = Record<string, string[]>;

export type ActionResult<T = undefined> =
  | { status: "ok"; message: string; data?: T }
  | { status: "error"; message: string; fieldErrors?: FieldErrors };

export type ActionMessage = Pick<ActionResult, "status" | "message">;
