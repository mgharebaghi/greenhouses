import type { IrrigationEvent, IrrigationRecords } from "@/app/generated/prisma";
import { Modal, Form, Input, InputNumber, Button, Collapse } from "antd";
import { useEffect, useState } from "react";
import {
  createIrrigationRecord,
  updateIrrigationRecord,
  deleteIrrigationRecord,
  getIrrigationEventsByZoneId,
  getIrrigationEventsByGreenhouseId,
  getIrrigationEvents,
} from "@/app/lib/services/irrigation";
import dayjs from "dayjs";
import {
  CloseOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  DownOutlined,
} from "@ant-design/icons";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import TimePicker from "react-multi-date-picker/plugins/time_picker";
import DeleteModal, { DeleteModalProps } from "../../_components/UI/DeleteModal";

export type IrrigationCyclesModalProps = {
  open: boolean;
  onClose?: () => void;
  eventId: number;
  eventData?: any;
  setMainData?: (data: IrrigationEvent[]) => void;
  setMainLoading?: (loading: boolean) => void;
  zoneId?: number | null;
  greenhouseId?: number | null;
};

export default function IrrigationCyclesModal(props: IrrigationCyclesModalProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ status: "ok" | "error"; message: string } | null>(null);
  const [cycles, setCycles] = useState<IrrigationRecords[]>([]);
  const [editingCycle, setEditingCycle] = useState<IrrigationRecords | null>(null);
  const [deleteModal, setDeleteModal] = useState<DeleteModalProps | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!props.open) return;
    setSubmitMessage(null);
    form.resetFields();
    setEditingCycle(null);
    setShowForm(false);

    if (props.eventData?.IrrigationRecords) {
      setCycles(props.eventData.IrrigationRecords as IrrigationRecords[]);
    }
  }, [props.open, props.eventData]); // eslint-disable-line react-hooks/exhaustive-deps

  const fields = [
    { name: "CycleNumber", label: "شماره سیکل", placeholder: "شماره", type: "number", required: true, icon: "🔢" },
    {
      name: "StartTime",
      label: "زمان شروع",
      placeholder: "انتخاب زمان",
      type: "datetime",
      required: false,
      icon: "🕐",
    },
    { name: "EndTime", label: "زمان پایان", placeholder: "انتخاب زمان", type: "datetime", required: false, icon: "🕑" },
    { name: "DurationSeconds", label: "مدت (ثانیه)", placeholder: "مدت", type: "text", required: false, icon: "⏱️" },
    { name: "VolumeLiters", label: "حجم (لیتر)", placeholder: "حجم", type: "number", required: false, icon: "💧" },
    { name: "Method", label: "روش", placeholder: "روش آبیاری", type: "text", required: false, icon: "🚿" },
    { name: "SourceWater", label: "منبع آب", placeholder: "منبع", type: "text", required: false, icon: "🏞️" },
    { name: "ECIn", label: "EC ورودی", placeholder: "EC", type: "number", required: false, icon: "⚡" },
    { name: "ECOut", label: "EC خروجی", placeholder: "EC", type: "number", required: false, icon: "⚡" },
    { name: "pHIn", label: "pH ورودی", placeholder: "pH", type: "number", required: false, icon: "🧪" },
    { name: "pHOut", label: "pH خروجی", placeholder: "pH", type: "number", required: false, icon: "🧪" },
    {
      name: "FlowRate_L_per_min",
      label: "جریان (L/min)",
      placeholder: "جریان",
      type: "number",
      required: false,
      icon: "🌊",
    },
    { name: "QualityFlag", label: "پرچم کیفیت", placeholder: "وضعیت کیفیت", type: "text", required: false, icon: "🚩" },
  ];

  const refreshMainData = async () => {
    props.setMainLoading?.(true);
    let mainDataRes: any;
    if (props.zoneId) {
      mainDataRes = await getIrrigationEventsByZoneId(props.zoneId);
    } else if (props.greenhouseId) {
      mainDataRes = await getIrrigationEventsByGreenhouseId(props.greenhouseId);
    } else {
      mainDataRes = await getIrrigationEvents();
    }
    props.setMainData?.(mainDataRes);
    props.setMainLoading?.(false);

    const updatedEvent = mainDataRes.find((event: IrrigationEvent) => event.EventID === props.eventId);
    if (updatedEvent?.IrrigationRecords) {
      setCycles(updatedEvent.IrrigationRecords);
    }
  };

  const handleSubmit = async (values: IrrigationRecords) => {
    setLoading(true);
    setSubmitMessage(null);

    const completedValues: any = {
      ...values,
      EventID: Number(props.eventId),
      StartTime: values.StartTime
        ? new Date(
            dayjs(values.StartTime).year(),
            dayjs(values.StartTime).month(),
            dayjs(values.StartTime).date(),
            dayjs(values.StartTime).hour(),
            dayjs(values.StartTime).minute(),
            dayjs(values.StartTime).second()
          )
        : undefined,
      EndTime: values.EndTime
        ? new Date(
            dayjs(values.EndTime).year(),
            dayjs(values.EndTime).month(),
            dayjs(values.EndTime).date(),
            dayjs(values.EndTime).hour(),
            dayjs(values.EndTime).minute(),
            dayjs(values.EndTime).second()
          )
        : undefined,
    };

    const res = editingCycle
      ? await updateIrrigationRecord(Number(editingCycle.RecordID), completedValues)
      : await createIrrigationRecord(completedValues);

    if (res) {
      setSubmitMessage({
        status: "ok",
        message: editingCycle ? "سیکل با موفقیت ویرایش شد" : "سیکل با موفقیت افزوده شد",
      });
      await refreshMainData();
      form.resetFields();
      setEditingCycle(null);
      setShowForm(false);
      setTimeout(() => {
        setSubmitMessage(null);
      }, 2000);
    } else {
      setSubmitMessage({ status: "error", message: "خطا در ثبت اطلاعات، لطفا مجددا تلاش کنید" });
    }
    setLoading(false);
  };

  const handleEdit = (cycle: IrrigationRecords) => {
    setEditingCycle(cycle);
    setShowForm(true);
    const castedCycle = {
      ...cycle,
      StartTime: cycle.StartTime ? new Date(cycle.StartTime) : undefined,
      EndTime: cycle.EndTime ? new Date(cycle.EndTime) : undefined,
    };
    form.setFieldsValue(castedCycle);
    setSubmitMessage(null);
  };

  const handleDeleteClick = (cycle: IrrigationRecords) => {
    setDeleteModal({
      open: true,
      onClose: () => setDeleteModal(null),
      name: `سیکل شماره ${cycle.CycleNumber}`,
      id: Number(cycle.RecordID),
      deleteLoading: false,
      onDelete: handleDeleteConfirm,
    });
  };

  const handleDeleteConfirm = async (id: number) => {
    setDeleteModal((prev) => (prev ? { ...prev, deleteLoading: true } : prev));
    const res = await deleteIrrigationRecord(id);
    if (res) {
      setDeleteModal((prev) => (prev ? { ...prev, deleteLoading: false, open: false } : prev));
      setSubmitMessage({ status: "ok", message: "سیکل با موفقیت حذف شد" });
      await refreshMainData();
      setTimeout(() => {
        setSubmitMessage(null);
      }, 2000);
    } else {
      setDeleteModal((prev) => (prev ? { ...prev, deleteLoading: false } : prev));
      setSubmitMessage({ status: "error", message: "خطا در حذف سیکل" });
    }
  };

  const handleCancelEdit = () => {
    setEditingCycle(null);
    setShowForm(false);
    form.resetFields();
    setSubmitMessage(null);
  };

  const handleClose = () => {
    props.onClose?.();
    setSubmitMessage(null);
    form.resetFields();
    setEditingCycle(null);
    setShowForm(false);
  };

  return (
    <>
      <Modal
        open={props.open}
        onCancel={handleClose}
        footer={null}
        closeIcon={null}
        centered
        width={1100}
        className="!p-0"
        destroyOnHidden
        styles={{
          body: { padding: 0, borderRadius: "1.5rem" },
          content: { padding: 0, borderRadius: "1.5rem", overflow: "hidden" },
        }}
      >
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-blue-700 to-blue-800 flex justify-between items-center shadow-lg">
          <h3 className="text-white text-xl font-bold m-0 flex items-center gap-3">
            <span className="text-2xl">💧</span>
            <span>سیکل‌های آبیاری - رویداد {props.eventId}</span>
          </h3>
          <button
            onClick={handleClose}
            className="bg-white/20 hover:bg-white/30 border-0 text-white h-10 w-10 p-0 rounded-xl transition-all duration-200 flex items-center justify-center"
          >
            <CloseOutlined className="text-lg" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6 bg-gradient-to-br from-white to-slate-50/30 max-h-[75vh] overflow-y-auto">
          {/* Add New Button */}
          {!showForm && (
            <div className="mb-6">
              <Button
                type="primary"
                size="large"
                icon={<PlusOutlined />}
                onClick={() => setShowForm(true)}
                className="rounded-xl bg-blue-600 hover:bg-blue-700 h-12 px-6 shadow-md hover:shadow-lg transition-all"
              >
                افزودن سیکل جدید
              </Button>
            </div>
          )}

          {/* Form Section */}
          <div
            className="mb-6 p-5 bg-white rounded-xl border-2 border-blue-100 shadow-md"
            style={{ display: showForm ? "block" : "none" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold text-blue-900 flex items-center gap-2 m-0">
                {editingCycle ? (
                  <>
                    <EditOutlined className="text-amber-600" />
                    <span>ویرایش سیکل</span>
                  </>
                ) : (
                  <>
                    <PlusOutlined className="text-emerald-600" />
                    <span>افزودن سیکل جدید</span>
                  </>
                )}
              </h4>
              <button
                onClick={handleCancelEdit}
                className="h-8 w-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-all"
              >
                <CloseOutlined className="text-slate-600" />
              </button>
            </div>

            <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark={false}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {fields.map((field) => (
                  <Form.Item
                    key={field.name}
                    label={
                      <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                        <span className="text-base">{field.icon}</span>
                        {field.label}
                        {field.required && <span className="text-rose-500 text-xs">*</span>}
                      </span>
                    }
                    name={field.name}
                    rules={[{ required: field.required, message: `لطفاً ${field.label} را وارد کنید` }]}
                    className="mb-0"
                  >
                    {field.type === "datetime" ? (
                      <DatePicker
                        calendar={persian}
                        locale={persian_fa}
                        format="YYYY/MM/DD HH:mm"
                        plugins={[<TimePicker key="time" position="bottom" />]}
                        disabled={loading}
                        placeholder={field.placeholder}
                        containerStyle={{ width: "100%" }}
                        style={{
                          width: "100%",
                          height: "40px",
                          fontSize: "14px",
                          borderRadius: "0.75rem",
                          border: "2px solid #e2e8f0",
                          padding: "0 1rem",
                        }}
                        onChange={() => setSubmitMessage(null)}
                      />
                    ) : field.type === "text" ? (
                      <Input
                        placeholder={field.placeholder}
                        disabled={loading}
                        size="large"
                        onChange={() => setSubmitMessage(null)}
                        className="!w-full rounded-xl border-2 border-slate-200"
                        style={{ height: "40px" }}
                      />
                    ) : (
                      <InputNumber
                        placeholder={field.placeholder}
                        disabled={loading}
                        size="large"
                        controls={false}
                        onChange={() => setSubmitMessage(null)}
                        className="!w-full rounded-xl border-2 border-slate-200"
                        style={{ width: "100%", height: "40px" }}
                      />
                    )}
                  </Form.Item>
                ))}
              </div>

              <Form.Item
                label={
                  <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <span className="text-base">📝</span>
                    توضیحات
                  </span>
                }
                name="notes"
                className="mt-4"
              >
                <Input.TextArea
                  placeholder="توضیحات اضافی"
                  disabled={loading}
                  rows={2}
                  className="rounded-xl border-2 border-slate-200"
                  style={{ resize: "none" }}
                />
              </Form.Item>

              <div className="flex gap-3 mt-4">
                <Button
                  onClick={handleCancelEdit}
                  disabled={loading}
                  size="large"
                  className="rounded-xl"
                  icon={<CloseOutlined />}
                >
                  انصراف
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  size="large"
                  className="rounded-xl bg-blue-600 hover:bg-blue-700"
                  icon={editingCycle ? <EditOutlined /> : <PlusOutlined />}
                >
                  {editingCycle ? "ویرایش سیکل" : "افزودن سیکل"}
                </Button>
              </div>
            </Form>
          </div>

          {/* Message Display */}
          {submitMessage && (
            <div
              className={`mb-5 p-4 rounded-xl border-2 flex items-start gap-3 animate-in fade-in slide-in-from-top-3 duration-300 shadow-sm ${
                submitMessage.status === "ok"
                  ? "bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-300 text-emerald-900"
                  : "bg-gradient-to-br from-rose-50 to-rose-100/50 border-rose-300 text-rose-900"
              }`}
            >
              <div
                className={`mt-0.5 p-1.5 rounded-lg ${
                  submitMessage.status === "ok" ? "bg-emerald-200/50" : "bg-rose-200/50"
                }`}
              >
                {submitMessage.status === "ok" ? (
                  <CheckCircleOutlined className="text-lg text-emerald-700" />
                ) : (
                  <ExclamationCircleOutlined className="text-lg text-rose-700" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold mb-0.5">{submitMessage.status === "ok" ? "موفقیت‌آمیز" : "خطا"}</p>
                <p className="text-sm leading-relaxed opacity-90 m-0">{submitMessage.message}</p>
              </div>
            </div>
          )}

          {/* Cycles List با Collapse */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-4 mt-2">
              <span>📋</span>
              لیست سیکل‌ها ({cycles.length})
            </h4>

            {cycles.length === 0 ? (
              <div className="text-center py-12 px-6 bg-white rounded-xl border-2 border-dashed border-slate-200">
                <div className="text-6xl mb-3 opacity-20">💧</div>
                <p className="text-slate-500 text-base font-medium mb-1">هیچ سیکلی ثبت نشده است</p>
                <p className="text-slate-400 text-sm">از دکمه بالا برای افزودن سیکل استفاده کنید</p>
              </div>
            ) : (
              <Collapse
                accordion
                expandIconPosition="end"
                className="!bg-transparent !border-0"
                expandIcon={({ isActive }) => (
                  <DownOutlined
                    rotate={isActive ? 180 : 0}
                    className="text-blue-600 transition-transform duration-300"
                  />
                )}
                items={cycles.map((cycle) => ({
                  key: cycle.RecordID,
                  label: (
                    <div className="flex items-center justify-between gap-3 py-1">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md flex-shrink-0">
                          <span className="text-white font-bold text-sm">#{cycle.CycleNumber}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="text-sm font-bold text-slate-900 m-0 mb-1">سیکل {cycle.CycleNumber}</h5>
                          <p className="text-xs text-slate-500 m-0 truncate">
                            {cycle.StartTime &&
                              `⏰ ${new Date(cycle.StartTime).toLocaleString("fa-IR", {
                                month: "2-digit",
                                day: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}`}
                            {cycle.VolumeLiters && ` • 💧 ${Number(cycle.VolumeLiters)}L`}
                            {cycle.Method && ` • 🚿 ${cycle.Method}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleEdit(cycle)}
                          className="h-8 w-8 rounded-lg bg-amber-50 hover:bg-amber-100 flex items-center justify-center transition-all border border-amber-200"
                          title="ویرایش"
                        >
                          <EditOutlined className="text-amber-700 text-sm" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(cycle)}
                          className="h-8 w-8 rounded-lg bg-rose-50 hover:bg-rose-100 flex items-center justify-center transition-all border border-rose-200"
                          title="حذف"
                        >
                          <DeleteOutlined className="text-rose-700 text-sm" />
                        </button>
                      </div>
                    </div>
                  ),
                  children: (
                    <div className="p-4 space-y-4 bg-slate-50/50">
                      {/* زمان‌بندی - فقط اگر داده داشته باشد */}
                      {(cycle.StartTime || cycle.EndTime || cycle.DurationSeconds) && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {cycle.StartTime && (
                            <div className="p-3 rounded-lg bg-white border border-slate-200">
                              <p className="text-xs text-slate-500 m-0 mb-1">🕐 شروع</p>
                              <p className="text-sm text-slate-900 font-semibold m-0">
                                {new Date(cycle.StartTime).toLocaleString("fa-IR")}
                              </p>
                            </div>
                          )}
                          {cycle.EndTime && (
                            <div className="p-3 rounded-lg bg-white border border-slate-200">
                              <p className="text-xs text-slate-500 m-0 mb-1">🕑 پایان</p>
                              <p className="text-sm text-slate-900 font-semibold m-0">
                                {new Date(cycle.EndTime).toLocaleString("fa-IR")}
                              </p>
                            </div>
                          )}
                          {cycle.DurationSeconds && (
                            <div className="p-3 rounded-lg bg-white border border-slate-200">
                              <p className="text-xs text-slate-500 m-0 mb-1">⏱️ مدت</p>
                              <p className="text-sm text-slate-900 font-semibold m-0">{cycle.DurationSeconds} ثانیه</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* حجم و جریان */}
                      {(cycle.VolumeLiters || cycle.FlowRate_L_per_min) && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {cycle.VolumeLiters && (
                            <div className="p-3 rounded-lg bg-cyan-50 border border-cyan-200">
                              <p className="text-xs text-cyan-700 m-0 mb-1">💧 حجم آب</p>
                              <p className="text-sm text-cyan-900 font-semibold m-0">
                                {Number(cycle.VolumeLiters)} لیتر
                              </p>
                            </div>
                          )}
                          {cycle.FlowRate_L_per_min && (
                            <div className="p-3 rounded-lg bg-cyan-50 border border-cyan-200">
                              <p className="text-xs text-cyan-700 m-0 mb-1">🌊 نرخ جریان</p>
                              <p className="text-sm text-cyan-900 font-semibold m-0">
                                {Number(cycle.FlowRate_L_per_min)} L/min
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* کیفیت آب */}
                      {(cycle.ECIn !== null || cycle.ECOut !== null || cycle.pHIn !== null || cycle.pHOut !== null) && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {cycle.ECIn !== null && cycle.ECIn !== undefined && (
                            <div className="flex flex-col items-center p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                              <span className="text-2xl mb-1">⚡</span>
                              <p className="text-xs text-slate-600 m-0 mb-1">EC ورودی</p>
                              <p className="text-lg font-bold text-emerald-700 m-0">{Number(cycle.ECIn)}</p>
                            </div>
                          )}
                          {cycle.ECOut !== null && cycle.ECOut !== undefined && (
                            <div className="flex flex-col items-center p-3 rounded-lg bg-orange-50 border border-orange-200">
                              <span className="text-2xl mb-1">⚡</span>
                              <p className="text-xs text-slate-600 m-0 mb-1">EC خروجی</p>
                              <p className="text-lg font-bold text-orange-700 m-0">{Number(cycle.ECOut)}</p>
                            </div>
                          )}
                          {cycle.pHIn !== null && cycle.pHIn !== undefined && (
                            <div className="flex flex-col items-center p-3 rounded-lg bg-blue-50 border border-blue-200">
                              <span className="text-2xl mb-1">🧪</span>
                              <p className="text-xs text-slate-600 m-0 mb-1">pH ورودی</p>
                              <p className="text-lg font-bold text-blue-700 m-0">{Number(cycle.pHIn)}</p>
                            </div>
                          )}
                          {cycle.pHOut !== null && cycle.pHOut !== undefined && (
                            <div className="flex flex-col items-center p-3 rounded-lg bg-purple-50 border border-purple-200">
                              <span className="text-2xl mb-1">🧪</span>
                              <p className="text-xs text-slate-600 m-0 mb-1">pH خروجی</p>
                              <p className="text-lg font-bold text-purple-700 m-0">{Number(cycle.pHOut)}</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* سایر اطلاعات */}
                      {(cycle.Method || cycle.SourceWater || cycle.QualityFlag) && (
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          {cycle.Method && (
                            <div className="p-3 rounded-lg bg-white border border-slate-200">
                              <p className="text-xs text-slate-500 m-0 mb-1">🚿 روش</p>
                              <p className="text-sm text-slate-900 font-semibold m-0">{cycle.Method}</p>
                            </div>
                          )}
                          {cycle.SourceWater && (
                            <div className="p-3 rounded-lg bg-white border border-slate-200">
                              <p className="text-xs text-slate-500 m-0 mb-1">🏞️ منبع آب</p>
                              <p className="text-sm text-slate-900 font-semibold m-0">{cycle.SourceWater}</p>
                            </div>
                          )}
                          {cycle.QualityFlag && (
                            <div className="p-3 rounded-lg bg-white border border-slate-200">
                              <p className="text-xs text-slate-500 m-0 mb-1">🚩 پرچم کیفیت</p>
                              <p className="text-sm text-slate-900 font-semibold m-0">{cycle.QualityFlag}</p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* توضیحات */}
                      {cycle.notes && (
                        <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                          <p className="text-xs text-amber-700 font-semibold m-0 mb-1">📝 توضیحات:</p>
                          <p className="text-sm text-amber-900 m-0 leading-relaxed">{cycle.notes}</p>
                        </div>
                      )}
                    </div>
                  ),
                  className:
                    "!mb-3 !bg-white !border-2 !border-slate-100 hover:!border-blue-200 !rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all",
                }))}
              />
            )}
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      {deleteModal && <DeleteModal {...deleteModal} />}
    </>
  );
}
