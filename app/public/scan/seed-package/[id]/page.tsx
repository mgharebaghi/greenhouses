import { formatPersianDate } from "@/shared/dates/calendar";
import { getSeedPackageById } from "@/features/seed-packages/server/queries";
import { supplierName } from "@/features/suppliers/domain/name";
import QRCodeCanvas from "@/shared/components/QRCodeCanvas";
import { publicSeedPackageUrl } from "@/shared/config/public-urls";
import { toPersianDigits } from "@/shared/utils/digits";
import { notFound } from "next/navigation";

export default async function PublicSeedPackagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pkg = await getSeedPackageById(Number(id));

  if (!pkg) {
    return notFound();
  }

  return (
    <div className="min-h-dvh flex flex-col items-center p-3 sm:p-6 [overflow-wrap:anywhere]">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">
        <div className="bg-emerald-800 p-6 text-center">
          <h1 className="text-white text-xl font-bold mb-1">
            شناسنامه دیجیتال بذر
          </h1>
          <p className="text-emerald-100 text-sm">
            اصالت سنجی شده توسط سامانه هوشمند
          </p>
        </div>

        <div className="p-6 flex flex-col items-center">
          {pkg.ID && (
            <div className="mb-6 p-2 border-2 border-dashed border-emerald-200 rounded-xl bg-white">
              <QRCodeCanvas value={publicSeedPackageUrl(pkg.ID)} size={150} />
            </div>
          )}

          <div className="w-full space-y-4">
            <InfoRow label="شماره سریال" value={pkg.SerialNumber} />
            <InfoRow label="واریته" value={pkg.Tbl_plantVariety?.VarietyName} />
            <InfoRow
              label="تولید کننده"
              value={
                pkg.Tbl_suppliers ? supplierName(pkg.Tbl_suppliers) : undefined
              }
            />
            <InfoRow
              label="تعداد بذر"
              value={pkg.SeedCount != null ? `${pkg.SeedCount} عدد` : "-"}
            />
            <InfoRow
              label="وزن بسته"
              value={pkg.WeightGram != null ? `${pkg.WeightGram} گرم` : "-"}
            />
            <InfoRow label="نوع بسته‌بندی" value={pkg.PackageType} />
            <InfoRow
              label="تاریخ تولید"
              value={formatPersianDate(pkg.ProductionDate, { fallback: "-" })}
            />
            <InfoRow
              label="تاریخ بسته‌بندی"
              value={formatPersianDate(pkg.PackagingDate, { fallback: "-" })}
            />
            <InfoRow
              label="تاریخ انقضا"
              value={formatPersianDate(pkg.ExpirationDate, { fallback: "-" })}
            />
            <InfoRow label="درجه کیفی" value={pkg.QualityGrade} />
            <InfoRow
              label="درصد جوانه زنی"
              value={
                pkg.GerminationRate != null ? `${pkg.GerminationRate}٪` : "-"
              }
            />
            <InfoRow
              label="درصد خلوص"
              value={pkg.PurityPercent != null ? `${pkg.PurityPercent}٪` : "-"}
            />

            <div
              className={`mt-6 p-3 rounded-lg text-center font-bold text-sm ${pkg.IsCertified ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200" : "bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-200"}`}
            >
              {pkg.IsCertified
                ? "✓ دارای گواهی اصالت و سلامت"
                : "⚠ وضعیت گواهی نامشخص"}
            </div>
          </div>
        </div>

        <div className="bg-slate-50 p-4 text-center text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          فکور پیوند آریا
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string | undefined | null;
}) {
  if (!value) return null;
  return (
    <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-2 last:border-0 dark:border-slate-700">
      <span className="text-sm text-slate-600 dark:text-slate-300">
        {label}
      </span>
      <span className="text-end font-semibold text-slate-800 dark:text-slate-100">
        {toPersianDigits(value)}
      </span>
    </div>
  );
}
