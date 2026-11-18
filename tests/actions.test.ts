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

test("an unreachable session database keeps the login page available and blocks protected access", async () => {
  const sessionError = new Error(
    "Can't reach database server at test endpoint",
  );
  sessionError.name = "PrismaClientInitializationError";
  const loginError = Object.assign(new Error("Database connection failed"), {
    errorCode: "P1001",
  });
  const loader = createServerLoader(
    {
      users: {
        findUnique: async () => {
          throw loginError;
        },
      },
    },
    sessionError,
  );
  const auth = loader.load("@/server/auth/actions");
  const requireAuth = auth.requireAuth as (
    route: string,
  ) => Promise<string | undefined>;

  const notice = await requireAuth("/");
  assert.match(notice ?? "", /ارتباط با پایگاه داده برقرار نشد/);
  await assert.rejects(requireAuth("/dashboard"), {
    message: "دریافت اطلاعات انجام نشد. لطفاً دوباره تلاش کنید.",
  });
  const login = auth.signIn as Action;
  const result = await login({ username: "admin", password: "password" });
  assert.equal(result.status, "error");
  assert.equal(result.message, notice);
});

test("plant variety mutations revalidate the dashboard page after saving", async () => {
  const loader = createServerLoader({
    tbl_PlantVariety: {
      create: async () => undefined,
      update: async () => undefined,
      delete: async () => undefined,
    },
  });
  const { createPlantVariety, updatePlantVariety, deletePlantVariety } =
    loader.load("@/features/plant-varieties/actions") as Record<string, Action>;
  const variety = { VarietyName: "واریته نمونه" };

  assert.equal((await createPlantVariety(variety)).status, "ok");
  assert.equal(
    (await updatePlantVariety({ id: 1, data: variety })).status,
    "ok",
  );
  assert.equal((await deletePlantVariety(1)).status, "ok");
  assert.deepEqual(loader.invalidations, [
    "/dashboard/plantvarities",
    "/dashboard/plantvarities",
    "/dashboard/plantvarities",
  ]);
});

test("warehouse managers are selected by numeric ID and validated as natural people", async () => {
  const writes: Record<string, unknown>[] = [];
  const lookups: unknown[] = [];
  const loader = createServerLoader({
    tbl_People_Companies: {
      findFirst: async ({
        where,
      }: {
        where: { ID: number; Legal: boolean };
      }) => {
        lookups.push(where);
        return where.ID === 7 && where.Legal === false
          ? { FirstName: "علی", LastName: "نمونه" }
          : null;
      },
    },
    tbl_Warehouses: {
      create: async ({ data }: { data: Record<string, unknown> }) =>
        writes.push(data),
      update: async ({ data }: { data: Record<string, unknown> }) =>
        writes.push(data),
    },
  });
  const create = loader.load("@/features/warehouses/server/create")
    .createWarehouse as Action;
  const update = loader.load("@/features/warehouses/server/update")
    .updateWarehouse as Action;
  const base = { WarehouseCode: "001", WarehouseName: "انبار نمونه" };
  assert.ok(
    (await create({ ...base, WarehouseManagerID: "7" })).fieldErrors
      ?.WarehouseManagerID,
  );
  assert.ok(
    (await create({ ...base, WarehouseManagerID: 8 })).fieldErrors
      ?.WarehouseManagerID,
  );
  assert.equal(writes.length, 0);
  assert.equal(
    (
      await create({
        ...base,
        WarehouseManagerID: 7,
        WarehouseManagerName: "نام جعلی",
      })
    ).status,
    "ok",
  );
  assert.deepEqual(writes[0], { ...base, WarehouseManagerName: "علی نمونه" });
  assert.equal(
    (await update(1, { ...base, WarehouseManagerID: null })).status,
    "ok",
  );
  assert.equal(writes[1].WarehouseManagerName, null);
  assert.equal((await update(1, base)).status, "ok");
  assert.equal(writes[2].WarehouseManagerName, undefined);
  assert.deepEqual(lookups, [
    { ID: 8, Legal: false },
    { ID: 7, Legal: false },
  ]);
});

test("seed package expiration is previewed and saved by the server in the production calendar", async () => {
  const writes: {
    ExpirationDate?: Date | null;
    ProductionDate?: Date | null;
  }[] = [];
  const seedPackages = {
    create: async ({ data }: { data: (typeof writes)[number] }) => {
      writes.push(data);
      return { ID: 12 };
    },
    findUniqueOrThrow: async () => ({
      ProductionDate: new Date("2024-02-29"),
      ExpirationDate: new Date("2025-02-28"),
    }),
    update: async ({ data }: { data: (typeof writes)[number] }) =>
      writes.push(data),
  };
  const loader = createServerLoader({
    tbl_SeedPackage: seedPackages,
    $transaction: async (operation: (tx: unknown) => Promise<unknown>) =>
      operation({ tbl_SeedPackage: seedPackages }),
  });
  const create = loader.load("@/features/seed-packages/server/create")
    .createSeedPackage as Action;
  const update = loader.load("@/features/seed-packages/server/update")
    .updateSeedPackage as Action;
  const preview = loader.load("@/features/seed-packages/server/read")
    .getSeedPackageExpiration as (input: unknown) => Promise<string>;
  const base = { CropVariety: 1, SerialNumber: "001" };
  const gregorian = {
    ...base,
    ProductionDate: "2024-02-29",
    ProductionCalendar: "gregorian",
    ExpirationDate: "2000-01-01",
  };
  const persian = {
    ...base,
    ProductionDate: "2025-03-20",
    ProductionCalendar: "persian",
  };

  assert.equal(await preview(gregorian), "2025-02-28");
  assert.equal((await create(gregorian)).status, "ok");
  assert.equal(
    writes[0].ExpirationDate?.toISOString(),
    "2025-02-28T00:00:00.000Z",
  );
  assert.equal(
    (await update(12, { ...gregorian, ProductionCalendar: "persian" })).status,
    "ok",
  );
  assert.equal(writes[1].ExpirationDate, undefined);
  assert.equal(await preview(persian), "2026-03-20");
  assert.equal((await update(12, persian)).status, "ok");
  assert.equal(
    writes[2].ExpirationDate?.toISOString(),
    "2026-03-20T00:00:00.000Z",
  );
  assert.equal(
    (await update(12, { ...base, ProductionDate: null })).status,
    "ok",
  );
  assert.equal(writes[3].ExpirationDate, null);
});

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
  Legal: false,
  FirstName: "محمد",
  LastName: "محمدی",
  PersonCode: "999",
  NationalCode: "1234567890",
  PhoneNumber: "09123456789",
  EmailAddress: "a@b.co",
  Profession: "کارگر",
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
    tbl_People_Companies: {
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

test("company writes force the legal role and preserve an unchanged historical identifier", async () => {
  const company = {
    ...personInput,
    Legal: true,
    CompanyName: "شرکت نمونه",
    CompanyEconomicCode: "0012",
    CompanyRegistrationCode: "0013",
  };
  const writes: { where?: unknown; data: Record<string, unknown> }[] = [];
  const record = {
    ID: 20,
    PersonCode: "8",
    NationalCode: "123456789",
    Tbl_PeoplePosts: { ID: 13, PostName: "شخصیت حقوقی" },
  };
  const companies = {
    findFirst: async () => ({ PersonCode: "7" }),
    create: async (args: { data: Record<string, unknown> }) => {
      writes.push(args);
      return { ...record, ...args.data };
    },
    update: async (args: (typeof writes)[number]) => {
      writes.push(args);
      return { ...args.data, ...record };
    },
  };
  const loader = createServerLoader({
    tbl_People_Companies: companies,
    $transaction: async (operation: (tx: unknown) => Promise<unknown>) =>
      operation({ tbl_People_Companies: companies }),
  });
  const create = loader.load("@/features/people/server/create")
    .createPerson as Action;
  const update = loader.load("@/features/people/server/update")
    .updatePerson as Action;

  const invalid = await create({ ...company, NationalCode: "012345678901" });
  assert.ok(invalid.fieldErrors?.NationalCode);
  assert.equal(writes.length, 0);

  const created = await create({ ...company, NationalCode: "۰۱۲۳۴۵۶۷۸" });
  assert.equal(created.status, "ok");
  assert.equal(writes[0].data.PostID, 13);
  assert.equal(writes[0].data.FirstName, null);
  assert.equal(writes[0].data.LastName, null);
  assert.equal(writes[0].data.NationalCode, "012345678");
  assert.equal(writes[0].data.CompanyRegistrationCode, "0013");

  const edited = await update({
    id: 20,
    data: { ...company, NationalCode: undefined },
  });
  assert.equal(edited.status, "ok");
  assert.deepEqual(writes[1].where, { ID: 20, Legal: true });
  assert.equal(writes[1].data.NationalCode, undefined);
});

test("supplier writes use the linked person's type and preserve text identifiers", async () => {
  const writes: Record<string, unknown>[] = [];
  const tx = {
    tbl_People_Companies: {
      findUnique: async ({ where }: { where: { ID: number } }) =>
        where.ID === 31
          ? { Legal: false }
          : where.ID === 32
            ? { Legal: true }
            : null,
    },
    tbl_Suppliers: {
      create: async ({ data }: { data: Record<string, unknown> }) =>
        writes.push(data),
      update: async ({ data }: { data: Record<string, unknown> }) =>
        writes.push(data),
    },
  };
  const loader = createServerLoader({
    $transaction: async (operation: (tx: unknown) => Promise<unknown>) =>
      operation(tx),
  });
  const create = loader.load("@/features/suppliers/server/create")
    .createSupplier as Action;
  const update = loader.load("@/features/suppliers/server/update")
    .updateSupplier as Action;
  const input = {
    People_CompaniesID: 31,
    FirstName: "علی",
    LastName: "نمونه",
    BrandName: "بذر",
    ContactTel: "02100000000",
    LicenseNumber: "0012",
  };

  const wrongTypes = await create({
    ...input,
    People_CompaniesID: "31",
    ContactTel: 123,
  });
  assert.ok(wrongTypes.fieldErrors?.People_CompaniesID);
  assert.ok(wrongTypes.fieldErrors?.ContactTel);
  const missingPerson = await create({ ...input, People_CompaniesID: 99 });
  assert.ok(missingPerson.fieldErrors?.People_CompaniesID);
  assert.equal(writes.length, 0);

  assert.equal((await create({ ...input, Legal: true })).status, "ok");
  assert.equal(writes[0].People_CompaniesID, 31);
  assert.equal(writes[0].FirstName, null);
  assert.equal(writes[0].LastName, null);
  assert.equal(writes[0].BrandName, "بذر");
  assert.equal(writes[0].ContactTel, "02100000000");
  assert.equal(writes[0].LicenseNumber, "0012");
  assert.equal("Legal" in writes[0], false);

  assert.equal(
    (
      await update({
        id: 1,
        data: { ...input, People_CompaniesID: 32, Legal: false },
      })
    ).status,
    "ok",
  );
  assert.equal(writes[1].FirstName, "علی");
  assert.equal(writes[1].LastName, "نمونه");
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
    assert.match(result.message ?? "", /بخش ریکاوری در حال حاضر در دسترس نیست/);
  }
  const reads = loader.load("@/features/recovery-rooms/server/read");
  for (const name of [
    "getAllRecoveryRooms",
    "getGraftingOperationsForDropdown",
  ])
    await assert.rejects(
      (reads[name] as () => Promise<unknown>)(),
      /بخش ریکاوری در حال حاضر در دسترس نیست/,
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

test("warehouse create uses server time for an empty date and update keeps the saved timestamp", async () => {
  const writes: { TransactionDate?: Date }[] = [];
  const loader = createServerLoader({
    tbl_WarehousesTransaction: {
      create: async ({ data }: { data: (typeof writes)[number] }) =>
        writes.push(data),
      update: async ({ data }: { data: (typeof writes)[number] }) =>
        writes.push(data),
    },
  });
  const create = loader.load("@/features/seed-warehousing/server/create")
    .createSeedWarehousing as Action;
  const update = loader.load("@/features/seed-warehousing/server/update")
    .updateSeedWarehousing as Action;
  const input = {
    SeedPackageID: 1,
    WarehouseID: 2,
    TransactionType: false,
    PackageQuantity: 1,
  };
  const before = Date.now();
  assert.equal(
    (await create({ ...input, TransactionDate: null })).status,
    "ok",
  );
  const timestamp = writes[0]?.TransactionDate?.getTime();
  assert.ok(
    timestamp !== undefined && timestamp >= before && timestamp <= Date.now(),
  );
  assert.equal((await update(1, input)).status, "ok");
  assert.equal(writes[1]?.TransactionDate, undefined);
  assert.equal(
    (await update(1, { ...input, TransactionDate: "2026-11-15" })).status,
    "ok",
  );
  assert.equal(
    writes[2]?.TransactionDate?.toISOString(),
    "2026-11-14T20:30:00.000Z",
  );
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

test("read actions report a public message when persistence fails", async () => {
  const loader = createServerLoader({
    tbl_Plants: {
      findMany: async () => {
        throw new Error("DB_INTERNAL_DETAIL");
      },
    },
  });
  const readPlants = loader.load("@/features/plants/server/read")
    .getPlants as Action;
  await assert.rejects(() => readPlants(), {
    message: "دریافت اطلاعات انجام نشد. لطفاً دوباره تلاش کنید.",
  });
});
