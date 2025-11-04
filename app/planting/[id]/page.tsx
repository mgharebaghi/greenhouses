"use client";

import { useEffect, useState } from "react";
import { getPlantingById } from "@/app/lib/services/planting";
import { useParams } from "next/navigation";

type PlantingDetail = Awaited<ReturnType<typeof getPlantingById>>;

// Helper function to convert Gregorian date to Jalali (Shamsi)
const toJalali = (gregorianDate: string | null | undefined): string => {
  if (!gregorianDate) return "ندارد";

  try {
    const date = new Date(gregorianDate);
    return new Intl.DateTimeFormat("fa-IR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  } catch {
    return gregorianDate;
  }
};

export default function PlantingScan() {
  const params = useParams();
  const [planting, setPlanting] = useState<PlantingDetail>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPlanting();
  }, []);

  const fetchPlanting = async () => {
    try {
      setLoading(true);
      const res = await getPlantingById(Number(params.id));
      if (!res) {
        setError("کاشت مورد نظر یافت نشد");
      } else {
        setPlanting(res);
      }
    } catch (err) {
      setError("خطا در بارگذاری اطلاعات کاشت");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        className="h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center"
        dir="rtl"
      >
        <div className="text-center">
          <div className="relative">
            <div className="inline-block h-20 w-20 animate-spin rounded-full border-4 border-solid border-green-500 border-r-transparent"></div>
            <div className="absolute top-0 left-0 inline-block h-20 w-20 animate-ping rounded-full border-4 border-solid border-green-300 opacity-30"></div>
          </div>
          <p className="mt-6 text-xl text-green-800 animate-pulse">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  if (error || !planting) {
    return (
      <div
        className="h-screen bg-gradient-to-br from-rose-50 via-red-50 to-orange-50 flex items-center justify-center"
        dir="rtl"
      >
        <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-md border-2 border-red-200">
          <div className="text-7xl mb-6">⚠️</div>
          <h2 className="text-3xl text-gray-800 mb-3">خطا</h2>
          <p className="text-red-600 text-lg">{error || "کاشت مورد نظر یافت نشد"}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen lg:h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 p-3 sm:p-4 lg:p-6 overflow-y-auto lg:overflow-hidden"
      dir="rtl"
    >
      <div className="h-full max-w-[1600px] mx-auto flex flex-col gap-3 sm:gap-4">
        {/* Header Bar */}
        <div className="bg-white rounded-xl lg:rounded-2xl border-2 border-green-200 p-3 sm:p-4 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="text-4xl sm:text-5xl">🌱</div>
              <div>
                <h1 className="text-2xl sm:text-3xl text-gray-800">جزئیات کاشت</h1>
                <p className="text-sm sm:text-base text-green-600">شناسه: {planting.PlantingID}</p>
              </div>
            </div>
            <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
              <div className="bg-green-100 px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl border-2 border-green-300 flex-1 sm:flex-initial">
                <span className="text-sm sm:text-base text-green-700">منطقه: {planting.Zones?.Name}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">
          {/* Left Panel - Stats */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3 sm:gap-4">
            {/* Plant Variety Card - Featured */}
            <div className="bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl lg:rounded-2xl p-4 sm:p-6 shadow-xl border-2 border-green-500 flex flex-col items-center justify-center">
              <div className="text-center">
                <div className="text-5xl sm:text-6xl lg:text-7xl mb-3 sm:mb-4">🌿</div>
                <div className="text-sm sm:text-base text-white mb-1 sm:mb-2">گونه گیاهی</div>
                <div className="text-xl sm:text-2xl lg:text-3xl text-white mb-2 sm:mb-3">
                  {planting.PlantVarieties?.VarietyName || "نامشخص"}
                </div>
                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/40 w-full">
                  <div className="text-xs sm:text-sm text-green-100 mb-1">شناسه</div>
                  <div className="text-lg sm:text-xl lg:text-2xl text-white">{planting.VarietyID}</div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-400 to-green-500 rounded-xl lg:rounded-2xl p-4 sm:p-6 shadow-xl border-2 border-emerald-500 flex flex-col items-center justify-center">
              <div className="text-4xl sm:text-5xl lg:text-6xl mb-2 sm:mb-3">🗺️</div>
              <div className="text-sm sm:text-base text-white mb-1 sm:mb-2">شناسه سالن</div>
              <div className="text-3xl sm:text-4xl lg:text-5xl text-white">{planting.ZoneID}</div>
            </div>

            <div className="bg-gradient-to-br from-teal-400 to-green-500 rounded-xl lg:rounded-2xl p-4 sm:p-6 shadow-xl border-2 border-teal-500 flex flex-col items-center justify-center">
              <div className="text-4xl sm:text-5xl lg:text-6xl mb-2 sm:mb-3">📊</div>
              <div className="text-sm sm:text-base text-white mb-1 sm:mb-2">تراکمِ بوته (گیاه در هر مترمربع)</div>
              <div className="text-2xl sm:text-3xl lg:text-4xl text-white">
                {planting.PlantsPerM2 ? `${planting.PlantsPerM2} گیاه` : "ندارد"}
              </div>
            </div>
          </div>

          {/* Center Panel - Details */}
          <div className="lg:col-span-6 flex flex-col gap-3 sm:gap-4">
            {/* Info Card */}
            <div className="bg-white rounded-xl lg:rounded-2xl border-2 border-green-200 p-4 sm:p-6 shadow-xl">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 pb-2 sm:pb-3 border-b-2 border-green-100">
                <span className="text-2xl sm:text-3xl">📋</span>
                <h2 className="text-xl sm:text-2xl text-gray-800">اطلاعات کاشت</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg sm:rounded-xl p-4 sm:p-5 border-2 border-green-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-2 mb-2 sm:mb-3 pb-2 border-b border-green-300">
                    <span className="text-xl sm:text-2xl">📦</span>
                    <span className="text-sm sm:text-base text-green-700">دسته منبع</span>
                  </div>
                  <div className="text-gray-900 text-lg sm:text-xl">{planting.SourceBatch || "ندارد"}</div>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg sm:rounded-xl p-4 sm:p-5 border-2 border-emerald-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-2 mb-2 sm:mb-3 pb-2 border-b border-emerald-300">
                    <span className="text-xl sm:text-2xl">📏</span>
                    <span className="text-sm sm:text-base text-emerald-700">تراکم</span>
                  </div>
                  <div className="text-gray-900 text-lg sm:text-xl">
                    {planting.PlantsPerM2 ? `${planting.PlantsPerM2} گیاه` : "ندارد"}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg sm:rounded-xl p-4 sm:p-5 border-2 border-teal-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-2 mb-2 sm:mb-3 pb-2 border-b border-teal-300">
                    <span className="text-xl sm:text-2xl">🌿</span>
                    <span className="text-sm sm:text-base text-teal-700">روش کاشت</span>
                  </div>
                  <div className="text-gray-900 text-lg sm:text-xl">{planting.SeedingMethod || "ندارد"}</div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-teal-100 rounded-lg sm:rounded-xl p-4 sm:p-5 border-2 border-green-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-2 mb-2 sm:mb-3 pb-2 border-b border-green-300">
                    <span className="text-xl sm:text-2xl">📍</span>
                    <span className="text-sm sm:text-base text-green-700">نام سالن</span>
                  </div>
                  <div className="text-gray-900 text-lg sm:text-xl">{planting.Zones?.Name || "ندارد"}</div>
                </div>
              </div>
            </div>

            {/* Notes - Expanded */}
            {planting.Notes && (
              <div className="bg-gradient-to-br from-amber-100 to-yellow-100 rounded-xl lg:rounded-2xl border-2 border-amber-300 p-4 sm:p-6 shadow-xl">
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 pb-2 sm:pb-3 border-b-2 border-amber-300">
                  <span className="text-3xl sm:text-4xl">📝</span>
                  <h2 className="text-xl sm:text-2xl text-amber-800">یادداشت‌ها</h2>
                </div>
                <div className="overflow-y-auto max-h-[200px] sm:max-h-[300px] lg:max-h-[calc(100%-4rem)]">
                  <p className="text-gray-800 leading-relaxed text-base sm:text-lg">{planting.Notes}</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Timeline */}
          <div className="lg:col-span-3 bg-white rounded-xl lg:rounded-2xl border-2 border-green-200 p-4 sm:p-6 shadow-xl">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 pb-2 sm:pb-3 border-b-2 border-green-100">
              <span className="text-2xl sm:text-3xl">📅</span>
              <h2 className="text-xl sm:text-2xl text-gray-800">زمان‌بندی</h2>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <div className="relative pr-6 sm:pr-8 before:content-[''] before:absolute before:right-[9px] sm:before:right-[11px] before:top-6 sm:before:top-8 before:bottom-0 before:w-0.5 before:bg-gradient-to-b before:from-green-400 before:to-transparent">
                <div className="absolute right-0 top-0 w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full border-3 sm:border-4 border-green-100"></div>
                <div className="text-sm sm:text-base text-green-700 mb-1">تاریخ کاشت</div>
                <div className="text-gray-900 text-base sm:text-lg font-bold">{toJalali(planting.PlantDate)}</div>
              </div>

              <div className="relative pr-6 sm:pr-8 before:content-[''] before:absolute before:right-[9px] sm:before:right-[11px] before:top-6 sm:before:top-8 before:bottom-0 before:w-0.5 before:bg-gradient-to-b before:from-emerald-400 before:to-transparent">
                <div className="absolute right-0 top-0 w-5 h-5 sm:w-6 sm:h-6 bg-emerald-500 rounded-full border-3 sm:border-4 border-emerald-100"></div>
                <div className="text-sm sm:text-base text-emerald-700 mb-1">تاریخ نشاکاری</div>
                <div className="text-gray-900 text-base sm:text-lg font-bold">{toJalali(planting.TransplantDate)}</div>
              </div>

              <div className="relative pr-6 sm:pr-8 before:content-[''] before:absolute before:right-[9px] sm:before:right-[11px] before:top-6 sm:before:top-8 before:bottom-0 before:w-0.5 before:bg-gradient-to-b before:from-teal-400 before:to-transparent">
                <div className="absolute right-0 top-0 w-5 h-5 sm:w-6 sm:h-6 bg-teal-500 rounded-full border-3 sm:border-4 border-teal-100"></div>
                <div className="text-sm sm:text-base text-teal-700 mb-1">تاریخ برداشت مورد انتظار</div>
                <div className="text-gray-900 text-base sm:text-lg font-bold">
                  {toJalali(planting.ExpectedHarvestDate)}
                </div>
              </div>

              <div className="relative pr-6 sm:pr-8">
                <div className="absolute right-0 top-0 w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full border-3 sm:border-4 border-green-100"></div>
                <div className="text-sm sm:text-base text-green-700 mb-1">تاریخ برداشت واقعی</div>
                <div className="text-gray-900 text-base sm:text-lg font-bold">
                  {toJalali(planting.ActualHarvestDate)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
