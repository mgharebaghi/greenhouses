import assert from "node:assert/strict";
import { test } from "node:test";
import { decimalToNumber, serializeData } from "../server/db/serialize";
import {
  publicOrderUrl,
  publicSeedPackageUrl,
} from "../shared/config/public-urls";
import { csvRows } from "../shared/exports/csv";
import { applyFieldErrors } from "../shared/forms/field-errors";
import { displayCell, filterAndSort, visiblePage } from "../shared/table/data";

test("table filtering, stable sorting, and paging do not mutate source rows", () => {
  const rows = [
    { id: 1, name: "Rose", count: 0 },
    { id: 2, name: "Rose", count: 0 },
    { id: 3, name: "Basil", count: 4 },
  ];
  assert.deepEqual(
    filterAndSort(rows, [{ dataIndex: "name" }], "rose", "count", "asc").map(
      (row) => row.id,
    ),
    [1, 2],
  );
  assert.deepEqual(
    filterAndSort(rows, [], "", "count", "desc").map((row) => row.id),
    [3, 1, 2],
  );
  assert.deepEqual(
    rows.map((row) => row.id),
    [1, 2, 3],
  );
  assert.equal(visiblePage(4, 5, 5), 1);
  assert.equal(visiblePage(1, 0, 10), 1);
  assert.equal(displayCell(0), 0);
  assert.equal(displayCell(false), "false");
  assert.equal(displayCell(null), "-");
});

test("CSV preserves selected values, zero and false without exporting relation objects", () => {
  assert.deepEqual(
    csvRows(
      [{ Name: "گل", Count: 0, Active: false, relation: { private: true } }],
      [
        { key: "Name", displayLabel: "نام" },
        { key: "Count", displayLabel: "تعداد" },
        { key: "Active", displayLabel: "فعال" },
      ],
    ),
    [{ Name: "گل", Count: 0, Active: false }],
  );
});

test("transport serialization preserves decimal zero and dates, and handles QR binary data", () => {
  const date = new Date("2026-10-11T00:00:00.000Z");
  assert.deepEqual(
    serializeData({
      date,
      amount: { toNumber: () => 0 },
      id: BigInt(12),
      qr: Buffer.from("qr"),
    }),
    {
      date: date.toISOString(),
      amount: 0,
      id: "12",
      qr: "data:image/png;base64,cXI=",
    },
  );
  assert.equal(decimalToNumber({ toNumber: () => 0 }), 0);
  assert.equal(decimalToNumber(null), null);
  assert.equal(
    serializeData(new Uint8Array([113, 114])),
    "data:image/png;base64,cXI=",
  );
});

test("field errors use Ant Design nested paths and ignore root-level errors", () => {
  const fields: unknown[] = [];
  applyFieldErrors(
    { setFields: (next) => fields.push(...next) },
    {
      status: "error",
      fieldErrors: { "WorkersLoss.0.LossPerWorker": ["خطا"], "": ["root"] },
    },
  );
  assert.deepEqual(fields, [
    { name: ["WorkersLoss", 0, "LossPerWorker"], errors: ["خطا"] },
  ]);
});

test("public QR URLs keep the existing route and origin", () => {
  assert.equal(
    publicOrderUrl(7),
    "https://mygreenhouses.ir/public/scan/orders/7",
  );
  assert.equal(
    publicSeedPackageUrl(9),
    "https://mygreenhouses.ir/public/scan/seed-package/9",
  );
});
