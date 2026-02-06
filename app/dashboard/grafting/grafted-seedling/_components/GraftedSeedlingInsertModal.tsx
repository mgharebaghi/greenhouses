"use client";

import { Modal, Form, Select, InputNumber, Input, Button, ConfigProvider, notification, AutoComplete } from "antd";
import { ExperimentOutlined, SaveOutlined } from "@ant-design/icons";
import { useState } from "react";
import { createGraftedSeedling } from "@/app/lib/services/grafting/grafted-seedling/create";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";

interface GraftedSeedlingInsertModalProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    refreshData: () => void;
    options: { label: string, value: number }[];
}

export default function GraftedSeedlingInsertModal({
    open,
    setOpen,
    refreshData,
    options
}: GraftedSeedlingInsertModalProps) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState<any>(null);

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const payload = {
                ...values,
                ReadyForSaleDate: selectedDate ? selectedDate.toDate() : null
            };

            const result = await createGraftedSeedling(payload);
            if (result.status === 'success') {
                setOpen(false);
                form.resetFields();
                setSelectedDate(null);
                refreshData();
            }
        } catch (error) {
            console.error("Error creating grafted seedling:", error);
        } finally {
            setLoading(false);
        }
    };

    const inputStyleClass = "w-full rounded-lg border-slate-300 hover:border-emerald-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all shadow-sm";
    const labelStyleClass = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1";

    return (
        <ConfigProvider direction="rtl">
            <Modal
                open={open}
                onCancel={() => setOpen(false)}
                footer={null}
                width={900}
                centered
                closeIcon={null}
                destroyOnHidden
                className="!p-0"
                styles={{
                    content: {
                        padding: 0,
                        borderRadius: "1.25rem",
                        overflow: "hidden",
                        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                    },
                }}
            >
                {/* Header - Standard Project Style */}
                <div className="relative px-6 py-6 bg-gradient-to-br from-emerald-50 via-lime-50/80 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border-b border-emerald-100 dark:border-slate-700">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-emerald-100/50 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-500 border border-emerald-200/60 dark:border-emerald-700/60">
                            <ExperimentOutlined className="text-2xl" />
                        </div>
                        <div>
                            <h3 className="font-bold text-xl text-slate-800 dark:text-slate-100">ثبت نشاء پیوندی جدید</h3>
                            <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">لطفاً اطلاعات زیر را با دقت تکمیل نمایید</p>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="p-8 bg-white dark:bg-slate-900">
                    <Form form={form} layout="vertical" onFinish={onFinish} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">

                        <Form.Item
                            name="GraftingID"
                            label={<span className={labelStyleClass}>انتخاب پیوند</span>}
                            rules={[{ required: true, message: 'انتخاب عملیات الزامی است' }]}
                            className="md:col-span-2"
                        >
                            <Select
                                options={options}
                                placeholder="جستجو و انتخاب کنید..."
                                showSearch
                                filterOption={(input, option) =>
                                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                size="large"
                                className="w-full"
                            />
                        </Form.Item>

                        <Form.Item name="QualityGrade" label={<span className={labelStyleClass}>درجه کیفی</span>}>
                            <AutoComplete size="large" placeholder="انتخاب کنید">
                                <Select.Option value="A">درجه A (عالی)</Select.Option>
                                <Select.Option value="B">درجه B (خوب)</Select.Option>
                                <Select.Option value="C">درجه C (متوسط)</Select.Option>
                            </AutoComplete>
                        </Form.Item>

                        <Form.Item name="GraftedNumber" label={<span className={labelStyleClass}>تعداد نشاء</span>}>
                            <InputNumber
                                className={inputStyleClass}
                                style={{ width: "100%" }}
                                size="large"
                                min={0}
                                placeholder="تعداد"
                            />
                        </Form.Item>

                        <Form.Item label={<span className={labelStyleClass}>تاریخ آماده‌سازی</span>}>
                            <DatePicker
                                value={selectedDate}
                                onChange={setSelectedDate}
                                calendar={persian}
                                locale={persian_fa}
                                calendarPosition="bottom-right"
                                inputClass={`${inputStyleClass} h-[40px] px-3`}
                                containerStyle={{ width: "100%" }}
                                placeholder="انتخاب تاریخ"
                            />
                        </Form.Item>

                        <Form.Item name="SurvivalRate" label={<span className={labelStyleClass}>نرخ بقا</span>}>
                            <InputNumber<number>
                                className={inputStyleClass}
                                style={{ width: "100%" }}
                                size="large"
                                min={0}
                                max={100}
                                formatter={(value) => `${value}%`}
                                parser={(value) => value?.replace('%', '') as unknown as number}
                                placeholder="درصد"
                            />
                        </Form.Item>

                        <Form.Item name="GraftedPlantNotes" label={<span className={labelStyleClass}>یادداشت‌ها</span>} className="md:col-span-2">
                            <Input.TextArea rows={3} className={inputStyleClass} />
                        </Form.Item>

                        {/* Footer Buttons */}
                        <div className="md:col-span-2 flex justify-end gap-3 mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                            <Button size="large" onClick={() => setOpen(false)} className="rounded-xl">
                                انصراف
                            </Button>
                            <Button
                                type="primary"
                                size="large"
                                htmlType="submit"
                                loading={loading}
                                icon={<SaveOutlined />}
                                className="bg-emerald-600 hover:bg-emerald-500 border-none shadow-md rounded-xl px-8"
                            >
                                ثبت اطلاعات
                            </Button>
                        </div>
                    </Form>
                </div>
            </Modal>
        </ConfigProvider>
    );
}
