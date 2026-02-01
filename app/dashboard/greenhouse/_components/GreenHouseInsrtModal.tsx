import { Modal, Form, Input, Select, Divider } from "antd";
import { ModalMsg } from "./Main";
import { Greenhouses, Owner_Observer, Zones } from "@/app/generated/prisma";
import { useEffect, useState } from "react";
import { allGreenHouses, createGreenHouse, GreenHouseCreateRes } from "@/app/lib/services/greenhouse";
import { getAllOwners } from "@/app/lib/services/owners";
import { createZone, ZoneCreateRes } from "@/app/lib/services/zones";
import {
  CloseOutlined,
  HomeOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import GreenhouseButton from "@/app/components/UI/GreenhouseButton";

export type SelectOptions = {
  value: number;
  label: string;
};

export default function GreenHouseInsertModal({
  modalOpen,
  setModalOpen,
  setMainData,
  setMainLoading,
}: {
  modalOpen: boolean;
  setModalOpen: (open: boolean) => void;
  setMainData: (data: Greenhouses[]) => void;
  setMainLoading: (loading: boolean) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [modalMsg, setModalMsg] = useState<ModalMsg | null>(null);
  const [owners, setOwners] = useState<SelectOptions[]>([]);
  const [ownersLoading, setOwnersLoading] = useState(false);
  const [greenHouseId, setGreenHouseId] = useState<number | null>(null);
  const [zoneLoading, setZoneLoading] = useState(false);
  const [zoneMsg, setZoneMsg] = useState<ZoneCreateRes | null>(null);
  const [greenHouseForm] = Form.useForm();

  const [zoneForm] = Form.useForm();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (modalOpen) {
      setModalMsg(null);
      fetchOwners();
    }
  }, [modalOpen]);

  if (!mounted) return null;

  const fetchOwners = async () => {
    setOwnersLoading(true);
    const res: Owner_Observer[] = await getAllOwners();
    if (res) {
      setOwners(res.map((owner) => ({ value: owner.ID, label: owner.FirstName + " " + owner.LastName })));
      setOwnersLoading(false);
    }
  };

  const greenHousefields = [
    { name: "GreenhouseName", label: "نام گلخانه", placeholder: "نام گلخانه را وارد کنید", required: true, icon: "🏡" },
    { name: "OwnerID", label: "نام مالک", placeholder: "انتخاب مالک", required: true, type: "select", icon: "👤" },
    { name: "Address", label: "آدرس", placeholder: "آدرس گلخانه را وارد کنید", required: true, icon: "📍" },
  ];

  const zoneFields = [
    { name: "Name", label: "نام سالن", placeholder: "نام سالن را وارد کنید", required: true, icon: "🚪" },
    {
      name: "AreaSqM",
      label: "مساحت (متر مربع)",
      placeholder: "مساحت سالن",
      required: true,
      type: "number",
      icon: "📐",
    },
  ];

  // Submit new greenhouse
  const submitGreenHouse = async (values: Greenhouses) => {
    setLoading(true);
    setModalMsg(null);
    const res: GreenHouseCreateRes = await createGreenHouse(values);
    let newMsg: ModalMsg = { status: res.status, message: res.message || "" };
    setModalMsg(newMsg);

    if (res.status === "ok" && res.greenHouseId) {
      setGreenHouseId(res.greenHouseId);
    }
    setLoading(false);
  };

  const submitZone = async (value: Zones) => {
    if (!greenHouseId) return;
    setZoneLoading(true);
    const newZone: Zones = { ...value, GreenhouseID: greenHouseId };
    const res: ZoneCreateRes = await createZone(newZone);
    setZoneLoading(false);

    if (res.status === "error") {
      setZoneMsg(res);
      return;
    }

    setZoneMsg({ status: "ok", message: "سالن با موفقیت افزوده شد" });
    setTimeout(async () => {
      setModalOpen(false);
      setGreenHouseId(null);
      setMainLoading(true);
      const newData = await allGreenHouses();
      setMainData(newData);
      setMainLoading(false);
      greenHouseForm.resetFields();
      zoneForm.resetFields();
      setModalMsg(null);
      setZoneMsg(null);
    }, 1500);
  };

  const handleClose = async () => {
    setModalOpen(false);
    if (greenHouseId) {
      setMainLoading(true);
      const newData = await allGreenHouses();
      setMainData(newData);
      setMainLoading(false);
    }
    setGreenHouseId(null);
    greenHouseForm.resetFields();
    zoneForm.resetFields();
    setModalMsg(null);
    setZoneMsg(null);
  };

  return (
    <Modal
      open={modalOpen}
      onCancel={handleClose}
      footer={null}
      closeIcon={null}
      centered
      width={680}
      className="!p-0"
      styles={{
        content: {
          padding: 0,
          borderRadius: "1.25rem",
          overflow: "hidden",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
        },
      }}
      forceRender
    >
      {/* Header */}
      <div className="relative px-6 py-6 bg-gradient-to-br from-emerald-50 via-lime-50/80 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border-b border-emerald-100 dark:border-slate-700">
        <button
          onClick={handleClose}
          className="absolute top-5 left-5 h-9 w-9 rounded-xl bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 border border-emerald-200 dark:border-slate-600 hover:border-emerald-300 dark:hover:border-emerald-700 transition-all flex items-center justify-center text-emerald-600 dark:text-emerald-500 hover:text-emerald-700 shadow-sm hover:shadow"
          aria-label="بستن"
        >
          <CloseOutlined className="text-sm" />
        </button>

        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-700 shadow-lg flex items-center justify-center text-white">
              <HomeOutlined className="text-2xl" />
            </div>
            <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-lime-400 border-2 border-white dark:border-slate-800"></div>
          </div>
          <div>
            <h3 className="font-bold text-2xl text-emerald-900 dark:text-slate-100">افزودن گلخانه جدید</h3>
            <p className="text-sm text-emerald-600/80 dark:text-slate-400 mt-1 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              اطلاعات گلخانه و سالن‌ها را وارد کنید
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-6 py-6 bg-gradient-to-br from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-950 max-h-[70vh] overflow-y-auto">
        {/* Greenhouse Form */}
        <Form form={greenHouseForm} layout="vertical" onFinish={submitGreenHouse} requiredMark={false}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {greenHousefields.map((field, index) => (
              <Form.Item
                key={field.name}
                label={
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <span className="text-base">{field.icon}</span>
                    {field.label}
                    {field.required && <span className="text-rose-500 text-xs">*</span>}
                  </span>
                }
                name={field.name}
                rules={[{ required: field.required, message: `لطفاً ${field.label} را وارد کنید` }]}
                className={`mb-0 ${index === 0 ? "sm:col-span-2" : ""}`}
              >
                {field.type === "select" ? (
                  <Select
                    showSearch
                    placeholder={field.placeholder}
                    options={owners}
                    optionFilterProp="label"
                    loading={ownersLoading}
                    allowClear
                    size="large"
                    className="rounded-xl"
                    disabled={loading}
                  />
                ) : (
                  <Input
                    onChange={() => setModalMsg(null)}
                    placeholder={field.placeholder}
                    disabled={loading}
                    size="large"
                    className="rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 focus:border-emerald-400 dark:focus:border-emerald-600 transition-all shadow-sm hover:shadow dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
                    style={{ height: "46px", fontSize: "14px" }}
                  />
                )}
              </Form.Item>
            ))}
          </div>

          <Form.Item
            label={
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <span>📝</span>توضیحات
              </span>
            }
            name="Notes"
            className="mt-5"
          >
            <Input.TextArea
              placeholder="توضیحات گلخانه"
              disabled={loading}
              rows={3}
              className="rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 focus:border-emerald-400 dark:focus:border-emerald-600 transition-all dark:bg-slate-800 dark:text-white"
              style={{ resize: "none" }}
            />
          </Form.Item>

          {modalMsg && (
            <div
              className={`mt-4 p-4 rounded-xl border-2 flex items-start gap-3 animate-in fade-in slide-in-from-top-3 duration-300 shadow-sm ${modalMsg.status === "ok"
                ? "bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/30 dark:to-emerald-900/10 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300"
                : "bg-gradient-to-br from-rose-50 to-rose-100/50 dark:from-rose-900/30 dark:to-rose-900/10 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-300"
                }`}
            >
              <div
                className={`mt-0.5 p-1.5 rounded-lg ${modalMsg.status === "ok" ? "bg-emerald-200/50 dark:bg-emerald-800/50" : "bg-rose-200/50 dark:bg-rose-800/50"
                  }`}
              >
                {modalMsg.status === "ok" ? (
                  <CheckCircleOutlined className="text-lg text-emerald-700 dark:text-emerald-400" />
                ) : (
                  <ExclamationCircleOutlined className="text-lg text-rose-700 dark:text-rose-400" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold mb-0.5">{modalMsg.status === "ok" ? "موفقیت‌آمیز" : "خطا"}</p>
                <p className="text-sm leading-relaxed opacity-90">{modalMsg.message}</p>
              </div>
            </div>
          )}

          <div className="flex justify-end mt-6">
            <GreenhouseButton
              text={loading ? "در حال ثبت..." : "ثبت گلخانه"}
              variant="primary"
              type="submit"
              loading={loading}
              className="min-w-[160px] h-11 shadow-lg hover:shadow-xl"
            />
          </div>
        </Form>

        {/* Zone Section */}
        <div style={{ display: greenHouseId ? "block" : "none" }}>
          <Divider className="my-6 custom-divider-dark">
            <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <PlusOutlined />
              افزودن سالن
            </span>
          </Divider>

          <Form form={zoneForm} layout="vertical" onFinish={submitZone} requiredMark={false}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {zoneFields.map((field) => (
                <Form.Item
                  key={field.name}
                  label={
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <span className="text-base">{field.icon}</span>
                      {field.label}
                      {field.required && <span className="text-rose-500 text-xs">*</span>}
                    </span>
                  }
                  name={field.name}
                  rules={[{ required: field.required, message: `لطفاً ${field.label} را وارد کنید` }]}
                  className="mb-0"
                >
                  <Input
                    type={field.type || "text"}
                    onChange={() => setZoneMsg(null)}
                    placeholder={field.placeholder}
                    disabled={zoneLoading}
                    size="large"
                    className="rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 focus:border-emerald-400 dark:focus:border-emerald-600 transition-all shadow-sm hover:shadow dark:bg-slate-800 dark:text-white dark:placeholder-slate-500"
                    style={{ height: "46px", fontSize: "14px" }}
                  />
                </Form.Item>
              ))}
            </div>

            <Form.Item
              label={
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <span>📝</span>توضیحات سالن
                </span>
              }
              name="MicroclimateNotes"
              className="mt-5"
            >
              <Input.TextArea
                placeholder="توضیحات سالن"
                disabled={zoneLoading}
                rows={3}
                className="rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700 focus:border-emerald-400 dark:focus:border-emerald-600 transition-all dark:bg-slate-800 dark:text-white"
                style={{ resize: "none" }}
              />
            </Form.Item>

            {zoneMsg && (
              <div
                className={`mt-4 p-4 rounded-xl border-2 flex items-start gap-3 animate-in fade-in slide-in-from-top-3 duration-300 shadow-sm ${zoneMsg.status === "ok"
                  ? "bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/30 dark:to-emerald-900/10 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300"
                  : "bg-gradient-to-br from-rose-50 to-rose-100/50 dark:from-rose-900/30 dark:to-rose-900/10 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-300"
                  }`}
              >
                <div
                  className={`mt-0.5 p-1.5 rounded-lg ${zoneMsg.status === "ok" ? "bg-emerald-200/50 dark:bg-emerald-800/50" : "bg-rose-200/50 dark:bg-rose-800/50"
                    }`}
                >
                  {zoneMsg.status === "ok" ? (
                    <CheckCircleOutlined className="text-lg text-emerald-700 dark:text-emerald-400" />
                  ) : (
                    <ExclamationCircleOutlined className="text-lg text-rose-700 dark:text-rose-400" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold mb-0.5">{zoneMsg.status === "ok" ? "موفقیت‌آمیز" : "خطا"}</p>
                  <p className="text-sm leading-relaxed opacity-90">{zoneMsg.message}</p>
                </div>
              </div>
            )}

            <div className="flex justify-end mt-6">
              <GreenhouseButton
                text={zoneLoading ? "در حال افزودن..." : "افزودن سالن"}
                variant="primary"
                type="submit"
                loading={zoneLoading}
                icon={<PlusOutlined />}
                className="min-w-[160px] h-11 shadow-lg hover:shadow-xl"
              />
            </div>
          </Form>
        </div>
      </div>
    </Modal>
  );
}
