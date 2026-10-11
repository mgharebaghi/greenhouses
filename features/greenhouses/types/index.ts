import type { GreenhouseRecord } from "./record";
export type GreenhouseDetails = GreenhouseRecord & {
  Tbl_People?: { FirstName: string | null; LastName: string | null } | null;
};
export type GreenHouseCreateRes = {
  status: "ok" | "error";
  message?: string;
  greenHouseId?: number;
};

export type * from "./record";
