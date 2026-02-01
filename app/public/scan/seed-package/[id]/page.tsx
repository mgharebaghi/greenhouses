import { getSeedPackageById } from "@/app/lib/services/seedPackage"; // We need to check if this creates a server/client boundary issue. Ideally fetch on server component.
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function PublicSeedPackagePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const pkg: any = await getSeedPackageById(Number(id));

    if (!pkg) {
        return notFound();
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center p-6 font-Iransans">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-emerald-600 p-6 text-center">
                    <h1 className="text-white text-xl font-bold mb-1">شناسنامه دیجیتال بذر</h1>
                    <p className="text-emerald-100 text-sm">اصالت سنجی شده توسط سامانه هوشمند</p>
                </div>

                <div className="p-6 flex flex-col items-center">
                    {pkg.QRCode && (
                        <div className="mb-6 p-2 border-2 border-dashed border-emerald-200 rounded-xl">
                            <Image src={pkg.QRCode} alt="QR Code" width={150} height={150} className="rounded-lg" />
                        </div>
                    )}

                    <div className="w-full space-y-4">
                        <InfoRow label="شماره سریال" value={pkg.SerialNumber} />
                        <InfoRow label="نام گونه" value={pkg.SeedBatch?.PlantVarities?.VarietyName} />
                        <InfoRow label="تولید کننده" value={pkg.SeedBatch?.Suppliers?.CompanyName || pkg.SeedBatch?.Suppliers?.FirstName} />
                        <InfoRow label="تعداد بذر" value={`${pkg.SeedCount || '-'} عدد`} />
                        <InfoRow label="وزن بسته" value={`${pkg.WeightGram || '-'} گرم`} />
                        <InfoRow label="نوع بسته‌بندی" value={pkg.PackageType} />
                        <InfoRow label="تاریخ تولید" value={pkg.SeedBatch?.ProductionDate ? new Date(pkg.SeedBatch.ProductionDate).toLocaleDateString('fa-IR') : '-'} />
                        <InfoRow label="تاریخ انقضا" value={pkg.SeedBatch?.ExpirationDate ? new Date(pkg.SeedBatch.ExpirationDate).toLocaleDateString('fa-IR') : '-'} />

                        <div className={`mt-6 p-3 rounded-lg text-center font-bold text-sm ${pkg.IsCertified ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                            {pkg.IsCertified ? '✓ دارای گواهی اصالت و سلامت' : '⚠ وضعیت گواهی نامشخص'}
                        </div>
                    </div>
                </div>

                <div className="bg-slate-50 p-4 text-center text-xs text-slate-400">
                    سامانه مدیریت گلخانه هوشمند
                </div>
            </div>
        </div>
    );
}

function InfoRow({ label, value }: { label: string, value: string | undefined }) {
    if (!value) return null;
    return (
        <div className="flex justify-between items-center border-b border-slate-100 pb-2 last:border-0">
            <span className="text-slate-500 text-sm">{label}</span>
            <span className="text-slate-800 font-semibold">{value}</span>
        </div>
    )
}
