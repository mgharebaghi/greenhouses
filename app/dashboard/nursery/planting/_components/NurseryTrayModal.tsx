"use client";

import { Modal, Form, Input, List, Button } from "antd";
import { CloseOutlined, AppstoreAddOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import GreenhouseButton from "@/app/components/UI/GreenhouseButton";
import { createTray, deleteTray } from "@/app/lib/services/nursery/planting/tray-actions";

type Tray = {
    ID: number;
    TrayNumber: string | null;
    CellNumber: string | null;
};

interface NurseryTrayModalProps {
    open: boolean;
    onClose: () => void;
    nurserySeedId: number | null;
    initialTrays: Tray[];
    refreshData: () => void;
}

export default function NurseryTrayModal({
    open,
    onClose,
    nurserySeedId,
    initialTrays,
    refreshData
}: NurseryTrayModalProps) {
    const [form] = Form.useForm();
    const [trays, setTrays] = useState<Tray[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            setTrays(initialTrays || []);
            form.resetFields();
        }
    }, [open, initialTrays, form]);

    const handleAdd = async (values: any) => {
        if (!nurserySeedId) return;

        setLoading(true);
        const res = await createTray({
            NurserySeedID: nurserySeedId,
            TrayNumber: values.TrayNumber,
            CellNumber: values.CellNumber
        });
        setLoading(false);

        if (res.success) {
            form.resetFields();
            refreshData(); // This will trigger a re-fetch of data in parent which updates initialTrays
            // We can optimistically update local state if we want, but since we rely on ID for deletion,
            // better to wait for refresh or just show success msg.
            // For better UX, we can try to fetch updated list here or rely on parent.
        }
    };

    const handleDelete = async (id: number) => {
        setLoading(true);
        const res = await deleteTray(id);
        setLoading(false);
        if (res.success) {
            setTrays(prev => prev.filter(t => t.ID !== id));
            refreshData();
        }
    };

    // Sync local state when prop updates (from refreshData)
    useEffect(() => {
        setTrays(initialTrays || []);
    }, [initialTrays]);

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            closeIcon={null}
            centered
            width={500}
            className="!p-0"
            styles={{
                content: {
                    padding: 0,
                    borderRadius: "1rem",
                    overflow: "hidden",
                },
            }}
        >
            {/* Header */}
            <div className="relative px-6 py-5 bg-gradient-to-br from-emerald-50 via-teal-50 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border-b border-emerald-100 dark:border-slate-700">
                <button
                    onClick={onClose}
                    className="absolute top-4 left-4 h-8 w-8 rounded-lg bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-700 border border-emerald-200 dark:border-slate-600 hover:border-emerald-300 transition-all flex items-center justify-center text-emerald-600 dark:text-emerald-500 hover:text-emerald-700"
                >
                    <CloseOutlined className="text-sm" />
                </button>

                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-md flex items-center justify-center text-white">
                        <AppstoreAddOutlined className="text-xl" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">مدیریت سینی‌ها</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">افزودن و مشاهده سینی‌های نشاء #{nurserySeedId}</p>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="p-6 bg-white dark:bg-slate-900">
                {/* Add Form */}
                <Form
                    form={form}
                    layout="inline"
                    onFinish={handleAdd}
                    className="mb-6 flex gap-2"
                >
                    <Form.Item
                        name="TrayNumber"
                        rules={[{ required: true, message: 'شماره سینی؟' }]}
                        className="flex-1 mb-0"
                    >
                        <Input placeholder="شماره سینی" className="rounded-lg" />
                    </Form.Item>
                    <Form.Item
                        name="CellNumber"
                        rules={[{ required: true, message: 'شماره سلول؟' }]}
                        className="flex-1 mb-0"
                    >
                        <Input placeholder="شماره سلول" className="rounded-lg" />
                    </Form.Item>
                    <Form.Item className="mb-0">
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={loading}
                            icon={<PlusOutlined className="text-lg translate-y-[1px]" />}
                            className="w-10 h-10 p-0 flex items-center justify-center bg-emerald-500 hover:bg-emerald-600 border-none rounded-lg shadow-sm"
                        />
                    </Form.Item>
                </Form>

                {/* List */}
                <div className="max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                    {trays.length === 0 ? (
                        <div className="text-center py-8 text-slate-400 dark:text-slate-600 text-sm border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-xl">
                            هیچ سینی برای این نشاء ثبت نشده است
                        </div>
                    ) : (
                        <List
                            dataSource={trays}
                            itemLayout="horizontal"
                            renderItem={(item) => (
                                <List.Item
                                    className="!px-3 !py-2.5 !border-b !border-slate-50 dark:!border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors rounded-lg mb-1"
                                    actions={[
                                        <button
                                            key="delete"
                                            onClick={() => handleDelete(item.ID)}
                                            className="text-rose-400 hover:text-rose-600 dark:text-rose-500/80 dark:hover:text-rose-400 transition-colors p-1"
                                            disabled={loading}
                                        >
                                            <DeleteOutlined />
                                        </button>
                                    ]}
                                >
                                    <List.Item.Meta
                                        title={<span className="text-sm font-medium text-slate-700 dark:text-slate-300">سینی: {item.TrayNumber}</span>}
                                        description={<span className="text-xs text-slate-500 dark:text-slate-500">سلول: {item.CellNumber}</span>}
                                    />
                                </List.Item>
                            )}
                        />
                    )}
                </div>
            </div>
        </Modal>
    );
}
