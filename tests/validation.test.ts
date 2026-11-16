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
import { seedWarehousingInputSchema } from "../features/seed-warehousing/schema";
import {
  formatPersianDate,
  formatTehranTime,
  getTehranDay,
  pickerDateToISO,
  toCalendarDate,
} from "../shared/dates/calendar";
import {
  calendarDateSchema,
  parseInput,
  InputValidationError,
  sqlDecimal,
  sqlInteger,
} from "../shared/validation/input";

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
    valid: {
      People_CompaniesID: 1,
      CompanyName: "شرکت",
      ContactTel: "02112345678",
    },
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

test("the date picker and SQL DATE contract preserve the same day across time zones", () => {
  const value = new Date("2026-11-15T00:00:00.000Z");
  const pickerDate = toCalendarDate(value);
  assert.equal(pickerDate?.format("YYYY/MM/DD"), "۱۴۰۵/۰۸/۲۴");
  assert.equal(pickerDateToISO(pickerDate), "2026-11-15");
  assert.deepEqual(
    calendarDateSchema.parse(pickerDateToISO(pickerDate)),
    value,
  );
  assert.deepEqual(
    calendarDateSchema.parse("2026-11-15T00:00:00+03:30"),
    value,
  );
  assert.equal(formatPersianDate(value.toISOString()), "۱۴۰۵/۰۸/۲۴");
  assert.equal(pickerDateToISO(null), null);
  assert.equal(formatPersianDate(""), "—");
  assert.equal(calendarDateSchema.safeParse("2026-02-30").success, false);
});

test("write boundaries preserve numbers and identifiers and localize type errors", () => {
  const schema = z.object({
    WeightGram: sqlDecimal(8, 2),
    SeedCount: sqlInteger.nonnegative(),
    SerialNumber: z.string(),
  });
  const input = { WeightGram: 17.25, SeedCount: 0, SerialNumber: "0017" };
  assert.deepEqual(parseInput(schema, input), input);
  assert.equal(
    schema.safeParse({ ...input, WeightGram: 17.251 }).success,
    false,
  );
  assert.equal(
    schema.safeParse({ ...input, SeedCount: 2147483648 }).success,
    false,
  );
  assert.throws(
    () => parseInput(schema, { ...input, WeightGram: "17.25", SeedCount: 0.5 }),
    (error) => {
      assert.ok(error instanceof InputValidationError);
      assert.deepEqual(error.fieldErrors.WeightGram, ["عدد معتبر وارد کنید."]);
      assert.deepEqual(error.fieldErrors.SeedCount, ["عدد صحیح وارد کنید."]);
      return true;
    },
  );
});

test("warehouse timestamps and the dashboard clock use the Tehran calendar day", () => {
  const base = {
    SeedPackageID: 1,
    WarehouseID: 1,
    TransactionType: true,
    PackageQuantity: 1,
  };
  const beforeMidnight = new Date("2026-11-14T20:29:00.000Z");
  const midnight = new Date("2026-11-14T20:30:00.000Z");
  assert.equal(getTehranDay(beforeMidnight), "2026-11-14");
  assert.equal(getTehranDay(midnight), "2026-11-15");
  assert.equal(formatTehranTime(midnight.getTime()), "۰۰:۰۰");
  assert.equal(
    formatPersianDate(midnight, { kind: "timestamp" }),
    "۱۴۰۵/۰۸/۲۴",
  );
  assert.equal(
    pickerDateToISO(toCalendarDate(midnight, "timestamp")),
    "2026-11-15",
  );
  assert.deepEqual(
    seedWarehousingInputSchema.parse({ ...base, TransactionDate: "2026-11-15" })
      .TransactionDate,
    midnight,
  );
  assert.deepEqual(
    seedWarehousingInputSchema.parse({
      ...base,
      TransactionDate: beforeMidnight.toISOString(),
    }).TransactionDate,
    beforeMidnight,
  );
  assert.equal(
    seedWarehousingInputSchema.parse(base).TransactionDate,
    undefined,
  );
});
