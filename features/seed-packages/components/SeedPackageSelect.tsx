"use client";

import { supplierName } from "@/features/suppliers/domain/name";
import { Select } from "@/shared/components/FormControls";
import type { ComponentProps } from "react";
import type { SeedPackageDetails } from "../types/details";

type PackageChoice = Pick<
  SeedPackageDetails,
  "ID" | "SerialNumber" | "PackageType" | "ProducerCompany"
> &
  Partial<Pick<SeedPackageDetails, "Tbl_suppliers">>;

function packageOption(pkg: PackageChoice) {
  const code = pkg.SerialNumber || String(pkg.ID);
  const supplier = pkg.Tbl_suppliers ? supplierName(pkg.Tbl_suppliers) : "—";
  const supplierLabel = supplier === "—" ? "تأمین‌کننده نامشخص" : supplier;
  const packageType = pkg.PackageType?.trim() || "نوع بسته نامشخص";
  const company = pkg.ProducerCompany?.trim();
  const producer = company && company !== supplier ? company : undefined;
  return {
    value: pkg.ID,
    label: [supplierLabel, packageType, code].join(" · "),
    searchLabel: [code, supplierLabel, packageType, producer]
      .filter(Boolean)
      .join(" · "),
    code,
    supplierLabel,
    producer,
    packageType,
  };
}

type SeedPackageOption = ReturnType<typeof packageOption>;
type Props = Omit<
  ComponentProps<typeof Select<number, SeedPackageOption>>,
  "options"
> & { packages: PackageChoice[] };

export default function SeedPackageSelect({ packages, ...props }: Props) {
  const options = packages.map(packageOption);
  return (
    <Select<number, SeedPackageOption>
      {...props}
      options={options}
      placeholder="انتخاب بسته بذر"
      showSearch
      optionFilterProp="searchLabel"
      labelRender={({ value, label }) => {
        const option = options.find((option) => option.value === value);
        if (!option) return label ?? value;

        return (
          <span
            className="flex min-w-0 items-center gap-1.5"
            title={option.label}
          >
            <span className="min-w-0 truncate font-medium">
              {option.supplierLabel}
            </span>
            <span className="min-w-0 truncate rounded bg-slate-100 px-1.5 text-[11px] leading-5 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {option.packageType}
            </span>
            <bdi className="min-w-0 shrink-0 truncate text-xs font-semibold text-emerald-700 dark:text-emerald-300">
              {option.code}
            </bdi>
          </span>
        );
      }}
      optionRender={({ data }) => (
        <div className="grid min-w-0 gap-0.5 py-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <bdi className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">
              {data.code}
            </bdi>
            <span className="rounded bg-slate-100 px-1.5 text-[11px] text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              {data.packageType}
            </span>
          </div>
          <span className="whitespace-normal break-words text-xs font-semibold text-slate-700 dark:text-slate-200">
            {data.supplierLabel}
          </span>
          {data.producer && (
            <span className="whitespace-normal break-words text-[11px] text-slate-500 dark:text-slate-400">
              {data.producer}
            </span>
          )}
        </div>
      )}
    />
  );
}
