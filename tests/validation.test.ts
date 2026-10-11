import assert from "node:assert/strict";
import { test } from "node:test";
import { z } from "zod";
import { greenhouseInputSchema } from "../features/greenhouses/schema";
import { growthStageInputSchema } from "../features/growth-stages/schema";
import { nurseryRoomInputSchema } from "../features/nursery-rooms/schema";
import { plantInputSchema } from "../features/plants/schema";
import { seedPackageInputSchema } from "../features/seed-packages/schema";
import { supplierInputSchema } from "../features/suppliers/schema";
import { warehouseInputSchema } from "../features/warehouses/schema";
import { createGraftingOperationSchema } from "../features/grafting/schema";
import { toDate } from "../shared/forms/date-value";
import DateObject from "react-date-object";

const contracts: {
  schema: z.ZodType;
  valid: Record<string, unknown>;
  field: string;
  limit: number;
}[] = [
  {
    schema: plantInputSchema,
    valid: { CommonName: "گل", ScientificName: "Rose", PlantFamily: "Rose" },
    field: "CommonName",
    limit: 150,
  },
  {
    schema: supplierInputSchema,
    valid: { Legal: true, CompanyName: "شرکت" },
    field: "CompanyName",
    limit: 150,
  },
  {
    schema: greenhouseInputSchema,
    valid: { GreenhouseName: "گلخانه", GreenhouseAddress: "تهران", OwnerID: 1 },
    field: "GreenhouseName",
    limit: 150,
  },
  {
    schema: growthStageInputSchema,
    valid: { VarietyID: 1, StageOrder: 1, StageName: "رشد" },
    field: "StageName",
    limit: 100,
  },
  {
    schema: nurseryRoomInputSchema,
    valid: { NurseryRoomCode: "1", NurseryRoomName: "اتاق" },
    field: "NurseryRoomName",
    limit: 100,
  },
  {
    schema: warehouseInputSchema,
    valid: { WarehouseCode: "1", WarehouseName: "انبار" },
    field: "WarehouseName",
    limit: 150,
  },
  {
    schema: seedPackageInputSchema,
    valid: { CropVariety: 1, SerialNumber: "A1" },
    field: "SerialNumber",
    limit: 50,
  },
];
test("write boundaries accept existing column limits and reject overflow before persistence", () => {
  for (const { schema, valid, field, limit } of contracts) {
    assert.ok(schema.safeParse(valid).success, field);
    assert.ok(
      schema.safeParse({ ...valid, [field]: "a".repeat(limit) }).success,
      field,
    );
    const overflow = schema.safeParse({
      ...valid,
      [field]: "a".repeat(limit + 1),
    });
    assert.equal(overflow.success, false, field);
    if (!overflow.success)
      assert.ok(
        overflow.error.issues.some((issue) => issue.path[0] === field),
        field,
      );
  }
});

test("grafting rejects duplicate people, fractional counts and oversized tool descriptions", () => {
  const input = {
    OrderID: 1,
    ColdRoomExitDate: new Date(),
    GraftingDate: new Date(),
    TrayNumber: 1,
    CellPerTrayNumber: 1,
    CellHeight: 1,
    TrayMaterial: "A",
    PlantingBed: "B",
    GraftingClamp: "C",
    GraftingStick: "D",
    GraftingTechnicianID: 1,
    Workers: [{ PersonID: 2 }],
  };
  assert.ok(createGraftingOperationSchema.safeParse(input).success);
  assert.equal(
    createGraftingOperationSchema.safeParse({
      ...input,
      Workers: [{ PersonID: 2 }, { PersonID: 2 }],
    }).success,
    false,
  );
  assert.equal(
    createGraftingOperationSchema.safeParse({ ...input, TrayNumber: 1.5 })
      .success,
    false,
  );
  assert.equal(
    createGraftingOperationSchema.safeParse({
      ...input,
      GraftingStick: "a".repeat(51),
    }).success,
    false,
  );
});

test("the shared date adapter preserves picker dates and native dates, and handles empty values", () => {
  const date = new Date("2026-10-11T12:30:00.000Z");
  assert.equal(toDate(date)?.getTime(), date.getTime());
  assert.equal(toDate(new DateObject(date))?.getTime(), date.getTime());
  assert.equal(toDate(date.toISOString())?.getTime(), date.getTime());
  assert.equal(toDate(null), null);
});
