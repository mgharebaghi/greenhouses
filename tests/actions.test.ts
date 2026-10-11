import assert from "node:assert/strict";
import { test } from "node:test";
import fs from "node:fs";
import ts from "typescript";
import { createServerLoader } from "./helpers/server-loader";

type Result = {
  status: string;
  message?: string;
  fieldErrors?: Record<string, string[]>;
  dta?: { PersonCode: string }[];
};
type Action = (...args: unknown[]) => Promise<Result>;
test("every private feature action blocks anonymous access before touching Prisma", async () => {
  let accesses = 0;
  const database = new Proxy(
    {},
    {
      get() {
        accesses++;
        throw new Error("Unexpected database access");
      },
    },
  );
  const loader = createServerLoader(database, null);
  let checked = 0;
  for (const feature of fs.readdirSync("features")) {
    for (const operation of ["create", "read", "update", "delete"]) {
      const file = `features/${feature}/server/${operation}.ts`;
      if (!fs.existsSync(file)) continue;
      const ast = ts.createSourceFile(
        file,
        fs.readFileSync(file, "utf8"),
        ts.ScriptTarget.Latest,
        true,
      );
      const exports = loader.load(`@/${file.slice(0, -3)}`);
      for (const node of ast.statements) {
        if (
          !ts.isFunctionDeclaration(node) ||
          !node.modifiers?.some(
            (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword,
          )
        )
          continue;
        const action = exports[node.name!.text] as Action;
        let result: Result;
        try {
          result = await action(undefined, undefined);
        } catch (error) {
          assert.match(
            error instanceof Error ? error.message : String(error),
            /نشست/,
          );
          checked++;
          continue;
        }
        assert.equal(result.status, "error");
        assert.match(result.message ?? "", /نشست/);
        checked++;
      }
    }
  }
  assert.ok(checked >= 50);
  assert.equal(accesses, 0);
});
test("anonymous login rejects malformed input before database access", async () => {
  let reads = 0;
  const loader = createServerLoader(
    {
      users: {
        findUnique: () => {
          reads++;
        },
      },
    },
    null,
  );
  const login = loader.load("@/server/auth/actions").signIn as Action;
  assert.equal((await login(null)).status, "error");
  assert.equal(
    (await login({ username: "", password: "", remember: "true" })).status,
    "error",
  );
  assert.equal(reads, 0);
});
const personInput = {
  FirstName: "محمد",
  LastName: "محمدی",
  PersonCode: "999",
  NationalCode: "1234567890",
  PhoneNumber: "09123456789",
  EmailAddress: "a@b.co",
  Profesion: "کارگر",
  PostID: 1,
};

test("unauthenticated mutations never reach persistence", async () => {
  let writes = 0;
  const loader = createServerLoader(
    {
      tbl_Plants: {
        create: () => {
          writes++;
        },
      },
    },
    null,
  );
  const action = loader.load("@/features/plants/server/create")
    .createPlant as Action;
  assert.equal(
    (
      await action({
        CommonName: "گل",
        ScientificName: "Rose",
        PlantFamily: "Rose",
      })
    ).status,
    "error",
  );
  assert.equal(writes, 0);
});

test("invalid input and overposting are handled before master-data writes", async () => {
  const writes: unknown[] = [];
  const loader = createServerLoader({
    tbl_Plants: {
      create: async (args: { data: unknown }) => writes.push(args.data),
    },
  });
  const action = loader.load("@/features/plants/server/create")
    .createPlant as Action;
  assert.equal((await action({ CommonName: "" })).status, "error");
  assert.equal(writes.length, 0);
  assert.equal(
    (
      await action({
        CommonName: "گل",
        ScientificName: "Rose",
        PlantFamily: "Rose",
        ID: 99,
        relation: {},
      })
    ).status,
    "ok",
  );
  assert.deepEqual(writes[0], {
    CommonName: "گل",
    ScientificName: "Rose",
    PlantFamily: "Rose",
  });
  assert.deepEqual(loader.invalidations, ["/dashboard/plants"]);
});

test("database errors become friendly failures instead of truthy success or raw SQL errors", async () => {
  for (const code of ["P2003", "P2025", "P2002"]) {
    const loader = createServerLoader({
      tbl_Plants: {
        delete: async () => {
          throw { code, message: "private SQL details" };
        },
      },
    });
    const action = loader.load("@/features/plants/server/delete")
      .deletePlant as Action;
    const result = await action(1);
    assert.equal(result.status, "error");
    assert.equal(result.message?.includes("SQL"), false);
  }
});

test("person code is generated inside a serializable transaction and retries serialization conflicts", async () => {
  let attempts = 0;
  const tx = {
    tbl_People: {
      findFirst: async () => ({ PersonCode: "7" }),
      create: async ({ data }: { data: typeof personInput }) => ({
        ID: 8,
        ...data,
        Tbl_PeoplePosts: { ID: 1, PostName: "کارگر" },
      }),
    },
  };
  const loader = createServerLoader({
    $transaction: async (
      operation: (tx: unknown) => Promise<unknown>,
      options: { isolationLevel: string },
    ) => {
      assert.equal(options.isolationLevel, "Serializable");
      if (++attempts === 1) throw { code: "P2034" };
      return operation(tx);
    },
  });
  const create = loader.load("@/features/people/server/create")
    .createPerson as Action;
  const result = await create(personInput);
  assert.equal(result.status, "ok");
  assert.equal(result.dta?.[0].PersonCode, "8");
  assert.equal(attempts, 2);
});

test("unavailable recovery storage blocks reads and all writes without touching Prisma", async () => {
  let accesses = 0;
  const loader = createServerLoader(
    new Proxy(
      {},
      {
        get() {
          accesses++;
          throw new Error("Unexpected database access");
        },
      },
    ),
  );
  const input = {
    GraftingOperationID: 1,
    WorkersLoss: [{ ID: 99, LossPerWorker: 1 }],
  };
  for (const [operation, name, args] of [
    ["create", "createRecoveryRoom", [input]],
    ["update", "updateRecoveryRoom", [1, input]],
    ["delete", "deleteRecoveryRoom", [1]],
  ] as const) {
    const result = await (
      loader.load(`@/features/recovery-rooms/server/${operation}`)[
        name
      ] as Action
    )(...args);
    assert.equal(result.status, "error");
    assert.match(result.message ?? "", /جدول ریکاوری/);
  }
  const reads = loader.load("@/features/recovery-rooms/server/read");
  for (const name of [
    "getAllRecoveryRooms",
    "getGraftingOperationsForDropdown",
  ])
    await assert.rejects(
      (reads[name] as () => Promise<unknown>)(),
      /جدول ریکاوری/,
    );
  assert.equal(accesses, 0);
});

test("grafting worker writes use only columns present in the introspected database", async () => {
  let workers: unknown;
  const tx = {
    tbl_GraftingOperation: { create: async () => ({ ID: 7 }) },
    tbl_GraftWorkers: {
      createMany: async ({ data }: { data: unknown }) => {
        workers = data;
      },
    },
  };
  const loader = createServerLoader({
    $transaction: async (operation: (tx: unknown) => Promise<unknown>) =>
      operation(tx),
  });
  const create = loader.load("@/features/grafting/server/create")
    .createGraftingOperation as Action;
  const result = await create({
    OrderID: 1,
    ColdRoomExitDate: new Date("2026-10-01"),
    GraftingDate: new Date("2026-10-02"),
    TrayNumber: 1,
    CellPerTrayNumber: 10,
    CellHeight: 5,
    TrayMaterial: "",
    PlantingBed: "",
    GraftingClamp: "",
    GraftingStick: "",
    GraftingTechnicianID: 2,
    Workers: [{ PersonID: 3, LossPerWorker: 99 }],
  });
  assert.equal(result.status, "ok");
  assert.deepEqual(workers, [{ GraftingOperationID: 7, GraftWorkerID: 3 }]);
});

test("warehouse updates persist zero quantity and false transaction type", async () => {
  let written: Record<string, unknown> = {};
  const loader = createServerLoader({
    tbl_WarehousesTransaction: {
      update: async ({ data }: { data: Record<string, unknown> }) => {
        written = data;
        return { ID: 1, ...data };
      },
    },
  });
  const update = loader.load("@/features/seed-warehousing/server/update")
    .updateSeedWarehousing as Action;
  assert.equal(
    (
      await update(1, {
        SeedPackageID: 1,
        WarehouseID: 2,
        TransactionType: false,
        PackageQuantity: 0,
      })
    ).status,
    "ok",
  );
  assert.equal(written.PackageQuantity, 0);
  assert.equal(written.TransactionType, false);
});

test("private queries require a session; public QR queries keep working without one", async () => {
  let reads = 0;
  const loader = createServerLoader(
    {
      tbl_Orders: {
        findUnique: async () => {
          reads++;
          return null;
        },
      },
    },
    null,
  );
  const privateRead = loader.load("@/features/orders/server/read")
    .getOrderById as (id: number) => Promise<unknown>;
  await assert.rejects(privateRead(1));
  assert.equal(reads, 0);
  const publicRead = loader.load("@/features/orders/server/queries")
    .getOrderById as (id: number) => Promise<unknown>;
  assert.equal(await publicRead(1), null);
  assert.equal(reads, 1);
});
