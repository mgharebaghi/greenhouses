"use client";

import { FieldFeedback, Select } from "@/shared/components/FormControls";

import {
  DeleteOutlined,
  PlusCircleOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import { Tooltip } from "antd";
import GreenhouseButton from "@/shared/components/GreenhouseButton";
import { useState } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { GraftingFormData } from "../types";
import WorkerQRModal from "./WorkerQRModal";

interface GraftingWorkersProps {
  people: GraftingFormData["people"];
  loading?: boolean;
  orderCode: string; // Passed from parent
}

export default function GraftingWorkers({
  people,
  orderCode,
}: GraftingWorkersProps) {
  const { control, watch } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "Workers",
  });

  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [selectedWorkerForPrint, setSelectedWorkerForPrint] = useState<{
    workerName: string;
    personCode: string;
    orderCode: string;
    orderID: number;
  } | null>(null);

  // Watch OrderID from form for QR link
  const orderID = watch("OrderID");

  // Options for Selects
  const nameOptions = people.map((p) => ({
    value: p.ID,
    label: `${p.FirstName} ${p.LastName} - ${p.NationalCode || "---"}`,
    personCode: p.PersonCode,
  }));

  const codeOptions = people.map((p) => ({
    value: p.ID,
    label: p.PersonCode || "---",
    name: `${p.FirstName} ${p.LastName}`,
  }));

  // Helper to print QR
  const handlePrint = (index: number) => {
    const workerId = watch(`Workers.${index}.PersonID`);
    const worker = people.find((p) => p.ID === workerId);
    if (worker && orderCode && orderID) {
      setSelectedWorkerForPrint({
        workerName: `${worker.FirstName} ${worker.LastName}`,
        personCode: worker.PersonCode || "---",
        orderCode: orderCode,
        orderID: orderID,
      });
      setIsPrintModalOpen(true);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-3 sm:p-5 rounded-2xl border-2 border-green-500/30 shadow-sm transition-all duration-300 relative">
      {/* Header Labels matching the mockup */}
      <div className="grid grid-cols-2 sm:grid-cols-12 gap-2 sm:gap-3 mb-2 px-2 text-sm font-bold text-slate-700 dark:text-slate-300 text-center">
        <div className="hidden sm:col-span-3 sm:block"></div> {/* Icons */}
        <div className="min-w-0 sm:col-span-5 text-right sm:pr-2">
          نام و کد ملی پیوندزن
        </div>
        <div className="min-w-0 sm:col-span-4 text-right sm:pr-2">کد افراد</div>
      </div>

      <div className="space-y-3">
        {fields.map((item, index) => {
          return (
            <div
              key={item.id}
              className="grid min-w-0 grid-cols-2 sm:grid-cols-12 gap-2 sm:gap-3 items-center animate-in fade-in slide-in-from-top-1 duration-200"
            >
              {/* Actions Column (Print, Delete, Add) */}
              <div className="col-span-2 sm:col-span-3 flex flex-wrap items-center justify-center gap-1">
                <Tooltip title="چاپ">
                  <GreenhouseButton
                    icon={<PrinterOutlined />}
                    aria-label="چاپ"
                    variant="secondary"
                    onClick={() => handlePrint(index)}
                  />
                </Tooltip>
                <Tooltip title="حذف">
                  <GreenhouseButton
                    icon={<DeleteOutlined />}
                    aria-label="حذف"
                    variant="danger-soft"
                    onClick={() => remove(index)}
                  />
                </Tooltip>
                <Tooltip title="افزودن جدید">
                  <GreenhouseButton
                    icon={<PlusCircleOutlined />}
                    aria-label="افزودن جدید"
                    variant="soft"
                    onClick={() => append({ PersonID: null })}
                  />
                </Tooltip>
              </div>

              {/* Name & National Code Select */}
              <div className="min-w-0 sm:col-span-5">
                <Controller
                  control={control}
                  name={`Workers.${index}.PersonID`}
                  rules={{ deps: "Workers" }}
                  render={({ field, fieldState }) => (
                    <>
                      <Select
                        {...field}
                        showSearch
                        optionFilterProp="label"
                        options={nameOptions}
                        status={fieldState.invalid ? "error" : ""}
                      />
                      <FieldFeedback message={fieldState.error?.message} />
                    </>
                  )}
                />
              </div>

              {/* Person Code Select */}
              <div className="min-w-0 sm:col-span-4">
                <Controller
                  control={control}
                  name={`Workers.${index}.PersonID`} // Same Name!
                  rules={{ deps: "Workers" }}
                  render={({ field, fieldState }) => (
                    <Select
                      {...field}
                      showSearch
                      placeholder=""
                      optionFilterProp="label"
                      options={codeOptions}
                      status={fieldState.invalid ? "error" : ""}
                      // Same logic: changing this updates the value in form state, syncing the other Select.
                    />
                  )}
                />
              </div>
            </div>
          );
        })}

        {/* Empty State / Initial Add Button if list is empty */}
        {fields.length === 0 && (
          <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl">
            <p className="text-slate-600 mb-4 dark:text-slate-300">
              هیچ فردی اضافه نشده است
            </p>
            <GreenhouseButton
              text="افزودن اولین فرد"
              variant="soft"
              onClick={() => append({ PersonID: null })}
              icon={<PlusCircleOutlined />}
            />
          </div>
        )}
      </div>
      <WorkerQRModal
        open={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        workerData={selectedWorkerForPrint}
      />
    </div>
  );
}
