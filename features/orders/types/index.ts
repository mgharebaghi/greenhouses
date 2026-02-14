import { OrderInput } from "../schema";

export type { OrderInput };

export type OrderCreateRes = {
    status: "ok" | "error";
    message: string;
    orderId?: number;
};
