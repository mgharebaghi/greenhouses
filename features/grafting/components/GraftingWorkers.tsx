"use client";

import { Button, Select, Tooltip, ConfigProvider } from "antd";
import { PlusCircleOutlined, DeleteOutlined, PrinterOutlined } from "@ant-design/icons";
import { useFieldArray, useFormContext, Controller } from "react-hook-form";
import { GraftingFormData } from "../types";
import QRCodeCanvas from "@/shared/components/QRCodeCanvas";
import WorkerQRModal from "./WorkerQRModal";
import { useEffect, useState } from "react";

interface GraftingWorkersProps {
    people: GraftingFormData["people"];
    loading?: boolean;
    orderCode: string; // Passed from parent
}

export default function GraftingWorkers({ people, loading, orderCode }: GraftingWorkersProps) {
    const { control, watch, setValue } = useFormContext();
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
    const nameOptions = people.map(p => ({
        value: p.ID,
        label: `${p.FirstName} ${p.LastName} - ${p.NationalCode || "---"}`,
        personCode: p.PersonCode
    }));

    const codeOptions = people.map(p => ({
        value: p.ID,
        label: p.PersonCode || "---",
        name: `${p.FirstName} ${p.LastName}`
    }));

    // Helper to print QR
    const handlePrint = (index: number) => {
        const workerId = watch(`Workers.${index}.PersonID`);
        const worker = people.find(p => p.ID === workerId);
        if (worker && orderCode && orderID) {
            setSelectedWorkerForPrint({
                workerName: `${worker.FirstName} ${worker.LastName}`,
                personCode: worker.PersonCode || "---",
                orderCode: orderCode,
                orderID: orderID
            });
            setIsPrintModalOpen(true);
        }
    };


    return (
        <div className="bg-white dark:bg-slate-800 p-5 rounded-2xl border-2 border-green-500/30 shadow-sm transition-all duration-300 relative">

            {/* Header Labels matching the mockup */}
            <div className="grid grid-cols-12 gap-4 mb-2 px-2 text-sm font-bold text-slate-700 dark:text-slate-300 text-center">
                <div className="col-span-2"></div> {/* Icons */}
                <div className="col-span-6 text-right pr-4">نام و کد ملی پیوندزن</div>
                <div className="col-span-4 text-right pr-4">کد افراد</div>
            </div>

            <div className="space-y-3">
                {fields.map((item, index) => {
                    const currentPersonId = watch(`Workers.${index}.PersonID`);
                    const currentPerson = people.find(p => p.ID === currentPersonId);

                    return (
                        <div key={item.id} className="grid grid-cols-12 gap-4 items-center animate-in fade-in slide-in-from-top-1 duration-200">

                            {/* Actions Column (Print, Delete, Add) */}
                            <div className="col-span-2 flex items-center justify-center gap-1">
                                <Tooltip title="چاپ">
                                    <Button
                                        icon={<PrinterOutlined />}
                                        size="middle" // Medium size as in image
                                        className="text-slate-600 border-slate-400 bg-white"
                                        onClick={() => handlePrint(index)}
                                    />
                                </Tooltip>
                                <Tooltip title="حذف">
                                    <Button
                                        danger
                                        icon={<DeleteOutlined />}
                                        size="middle"
                                        className="bg-red-500 text-white border-red-500 hover:bg-red-600 hover:border-red-600"
                                        onClick={() => remove(index)}
                                    />
                                </Tooltip>
                                {/* Add Button only on the last row? Or all? Image shows all have green plus, maybe implies 'insert after'? 
                                    Standard list typicaly has one add button at bottom or one per row to add next. 
                                    I'll keep a general add button at bottom as it's cleaner, but image shows green plus.
                                    Let's add a green plus that just appends new row.
                                */}
                                <Tooltip title="افزودن جدید">
                                    <Button
                                        icon={<PlusCircleOutlined />}
                                        size="middle"
                                        className="bg-green-500 text-white border-green-500 hover:bg-green-600 hover:border-green-600"
                                        onClick={() => append({ PersonID: null })}
                                    />
                                </Tooltip>
                            </div>

                            {/* Name & National Code Select */}
                            <div className="col-span-6">
                                <Controller
                                    control={control}
                                    name={`Workers.${index}.PersonID`}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            showSearch
                                            placeholder=""
                                            optionFilterProp="label"
                                            className="w-full text-right"
                                            size="large"
                                            options={nameOptions}
                                        // When this changes, the other select (bound to same name) updates automatically 
                                        // because they share the same Controller name path.
                                        />
                                    )}
                                />
                            </div>

                            {/* Person Code Select */}
                            <div className="col-span-4">
                                <Controller
                                    control={control}
                                    name={`Workers.${index}.PersonID`} // Same Name!
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            showSearch
                                            placeholder=""
                                            optionFilterProp="label"
                                            className="w-full text-center font-mono text-lg"
                                            size="large"
                                            options={codeOptions}
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
                        <p className="text-slate-400 mb-4">هیچ فردی اضافه نشده است</p>
                        <Button
                            type="dashed"
                            onClick={() => append({ PersonID: null })}
                            icon={<PlusCircleOutlined />}
                            className="text-emerald-600 border-emerald-300 hover:text-emerald-700 hover:border-emerald-500 h-10 px-6 rounded-xl"
                        >
                            افزودن اولین فرد
                        </Button>
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
