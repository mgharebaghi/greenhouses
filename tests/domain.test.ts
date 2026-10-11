import assert from "node:assert/strict";
import { test } from "node:test";
import { nextPersonCode } from "../features/people/domain/person-code";
import { personInputSchema, peopleReadDTO } from "../features/people/schema";
import {
  assertWorkersBelongToOperation,
  prepareRecoveryInput,
} from "../features/recovery-rooms/domain/input";
import { seedWarehousingInputSchema } from "../features/seed-warehousing/schema";
import { submitForm } from "../shared/forms/submit";
import { InputValidationError, parseInput } from "../shared/validation/input";

export const personInput = {
  FirstName: "محمد",
  LastName: "محمدی",
  PersonCode: "1",
  NationalCode: "1234567890",
  PhoneNumber: "09123456789",
  EmailAddress: "a@b.co",
  Profesion: "کارگر",
  PostID: 1,
};

test("historical incomplete people remain readable; write rules validate syntax", () => {
  const historical = {
    ID: 9,
    FirstName: "م",
    LastName: "",
    PersonCode: "1",
    NationalCode: "x",
    PhoneNumber: null,
    EmailAddress: "x",
    Profesion: null,
    Tbl_PeoplePosts: { ID: 1, PostName: null },
  };
  assert.equal(peopleReadDTO.parse(historical).EmailAddress, "x");
  assert.equal(personInputSchema.parse(personInput).EmailAddress, "a@b.co");
  for (const email of ["x", "a@", ""])
    assert.equal(
      personInputSchema.safeParse({ ...personInput, EmailAddress: email })
        .success,
      false,
    );
  assert.equal(
    personInputSchema.parse({ ...personInput, EmailAddress: " a@b.co " })
      .EmailAddress,
    "a@b.co",
  );
});

test("write contracts strip IDs/relations and reject invalid selections", () => {
  const parsed = personInputSchema.parse({
    ...personInput,
    ID: 100,
    Tbl_PeoplePosts: {},
    Unexpected: "ignored",
  });
  assert.equal("ID" in parsed, false);
  assert.equal("Unexpected" in parsed, false);
  assert.throws(
    () => parseInput(personInputSchema, { ...personInput, PostID: 0 }),
    InputValidationError,
  );
});

test("person codes keep the current sequence and respect the existing six-character column", () => {
  assert.equal(nextPersonCode(null), "1");
  assert.equal(nextPersonCode("9"), "10");
  assert.equal(nextPersonCode("invalid"), "1");
  assert.throws(() => nextPersonCode("999999"), InputValidationError);
});

test("recovery derives totals on the server and validates worker membership and dates", () => {
  const input = {
    GraftingOperationID: 1,
    WorkersLoss: [
      { ID: 2, LossPerWorker: 3 },
      { ID: 4, LossPerWorker: 0 },
    ],
    GraftedLossCount: 99,
  };
  assert.equal(prepareRecoveryInput(input).GraftedLossCount, 3);
  assert.doesNotThrow(() => assertWorkersBelongToOperation([2, 4], [4, 2]));
  assert.throws(
    () => assertWorkersBelongToOperation([8], [2]),
    InputValidationError,
  );
  assert.throws(
    () =>
      prepareRecoveryInput({
        ...input,
        WorkersLoss: [
          { ID: 2, LossPerWorker: 1 },
          { ID: 2, LossPerWorker: 2 },
        ],
      }),
    InputValidationError,
  );
  assert.throws(
    () =>
      prepareRecoveryInput({
        ...input,
        RecoveryEntryDate: new Date("2026-10-10"),
        RecoveryExitDate: new Date("2026-10-09"),
      }),
    InputValidationError,
  );
  assert.throws(
    () =>
      prepareRecoveryInput({
        ...input,
        WorkersLoss: [{ ID: 2, LossPerWorker: -1 }],
      }),
    InputValidationError,
  );
});

test("warehouse input preserves zero and false, and does not coerce arbitrary strings to booleans", () => {
  const input = {
    SeedPackageID: 1,
    WarehouseID: 2,
    TransactionType: "false",
    PackageQuantity: 0,
  };
  const parsed = seedWarehousingInputSchema.parse(input);
  assert.equal(parsed.TransactionType, false);
  assert.equal(parsed.PackageQuantity, 0);
  assert.equal(
    seedWarehousingInputSchema.safeParse({
      ...input,
      TransactionType: "invalid",
    }).success,
    false,
  );
});

test("submission releases loading after rejection and reports a usable error", async () => {
  const events: string[] = [];
  await submitForm(
    async () => {
      throw new Error("transport");
    },
    (result) => events.push(result.status),
    () => events.push("settled"),
  );
  assert.deepEqual(events, ["error", "settled"]);
  await submitForm(
    async () => {
      events.push("saved");
    },
    () => assert.fail("unexpected error"),
    () => events.push("settled"),
  );
  assert.deepEqual(events.slice(-2), ["saved", "settled"]);
});
