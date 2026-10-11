import { getSeedPackageById } from "@/features/seed-packages/server/queries";
import QRCodeCanvas from "@/shared/components/QRCodeCanvas";
import { publicSeedPackageUrl } from "@/shared/config/public-urls";
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
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-6 font-Iransans">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-emerald-600 p-6 text-center">
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
              value={pkg.Tbl_suppliers?.CompanyName}
            />
            <InfoRow
              label="تعداد بذر"
              value={pkg.SeedCount ? `${pkg.SeedCount} عدد` : "-"}
            />
            <InfoRow
              label="وزن بسته"
              value={pkg.WeightGram ? `${pkg.WeightGram} گرم` : "-"}
            />
            <InfoRow label="نوع بسته‌بندی" value={pkg.PackageType} />
            <InfoRow
              label="تاریخ تولید"
              value={
                pkg.ProductionDate
                  ? new Date(pkg.ProductionDate).toLocaleDateString("fa-IR")
                  : "-"
              }
            />
            <InfoRow
              label="تاریخ بسته‌بندی"
              value={
                pkg.PackagingDate
                  ? new Date(pkg.PackagingDate).toLocaleDateString("fa-IR")
                  : "-"
              }
            />
            <InfoRow
              label="تاریخ انقضا"
              value={
                pkg.ExpirationDate
                  ? new Date(pkg.ExpirationDate).toLocaleDateString("fa-IR")
                  : "-"
              }
            />
            <InfoRow label="درجه کیفی" value={pkg.QualityGrade} />
            <InfoRow
              label="درصد جوانه زنی"
              value={pkg.GerminationRate ? `${pkg.GerminationRate}%` : "-"}
            />
            <InfoRow
              label="درصد خلوص"
              value={pkg.PurityPercent ? `${pkg.PurityPercent}%` : "-"}
            />

            <div
              className={`mt-6 p-3 rounded-lg text-center font-bold text-sm ${pkg.IsCertified ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}
            >
              {pkg.IsCertified
                ? "✓ دارای گواهی اصالت و سلامت"
                : "⚠ وضعیت گواهی نامشخص"}
            </div>
          </div>
        </div>

        <div className="bg-slate-50 p-4 text-center text-xs text-slate-400">
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
    <div className="flex justify-between items-center border-b border-slate-100 pb-2 last:border-0">
      <span className="text-slate-500 text-sm">{label}</span>
      <span className="text-slate-800 font-semibold">{value}</span>
    </div>
  );
}
