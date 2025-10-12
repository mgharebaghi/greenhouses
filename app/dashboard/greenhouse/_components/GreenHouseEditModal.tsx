import { Modal, Form, Input, Select, Divider } from "antd";
import Table from "@/app/dashboard/_components/UI/Table";
import { ModalMsg } from "./Main";
import { Greenhouses, Owner_Observer, Zones } from "@/app/generated/prisma";
import { useEffect, useState } from "react";
import { allGreenHouses, updateGreenHouse } from "@/app/lib/services/greenhouse";
import { SelectOptions } from "./GreenHouseInsrtModal";
import { getAllOwners } from "@/app/lib/services/owners";
import { ColumnType } from "antd/es/table";
import { createZone, deleteZone, updateZone } from "@/app/lib/services/zones";
import { getgreenHouseZones } from "@/app/lib/services/zones/read";
import {
  CloseOutlined,
  EditOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  SaveOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import GreenhouseButton from "@/app/components/UI/GreenhouseButton";

type ZoneType = {
  ZoneID: number;
  Name: string;
  AreaSqM: number;
};

type EditZoneType = {
  ZoneID: number;
  onEdit: boolean;
};

export type EditModalProps = {
  isOpen: boolean;
  onClose?: () => void;
  data?: any;
  setMainLoading?: (loading: boolean) => void;
  setMainData?: (data: Greenhouses[]) => void;
};

export default function GreenHouseEditModal(props: EditModalProps) {
  const [loading, setLoading] = useState(false);
  const [modalMsg, setModalMsg] = useState<ModalMsg | null>(null);
  const [owners, setOwners] = useState<SelectOptions[]>([]);
  const [ownersLoading, setOwnersLoading] = useState(false);
  const [form] = Form.useForm();
  const [zoneForm] = Form.useForm();

  const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });
  const [zonesModalOpen, setZonesModalOpen] = useState(false);
  const [zonesData, setZonesData] = useState<ZoneType[]>([]);
  const [onEditZone, setOnEditZone] = useState<EditZoneType | null>(null);
  const [zonesLoading, setZonesLoading] = useState(false);
  const [zoneName, setZoneName] = useState("");
  const [zoneArea, setZoneArea] = useState(0);

  const fields = [
    { name: "GreenhouseName", label: "نام گلخانه", required: true, icon: "🏡" },
    { name: "OwnerID", label: "نام مالک", required: true, type: "select", icon: "👤" },
    { name: "Address", label: "آدرس", required: true, icon: "📍" },
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

  const zonesColumns: any[] = [
    {
      title: "نام سالن",
      dataIndex: "Name",
      key: "Name",
      render: (_: any, record: ZoneType) =>
        onEditZone?.ZoneID === record.ZoneID ? (
          <Input value={zoneName} onChange={(e) => setZoneName(e.target.value)} size="large" className="rounded-lg" />
        ) : (
          <span className="font-medium text-slate-700">{record.Name}</span>
        ),
    },
    {
      title: "مساحت (متر مربع)",
      dataIndex: "AreaSqM",
      key: "AreaSqM",
      render: (_: any, record: ZoneType) =>
        onEditZone?.ZoneID === record.ZoneID ? (
          <Input
            type="number"
            value={zoneArea}
            onChange={(e) => setZoneArea(Number(e.target.value))}
            size="large"
            className="rounded-lg"
          />
        ) : (
          <span className="font-medium text-slate-700">{record.AreaSqM}</span>
        ),
    },
    {
      title: "عملیات",
      dataIndex: "actions",
      key: "actions",
      render: (_: any, record: ZoneType) =>
        onEditZone?.ZoneID === record.ZoneID ? (
          <div className="flex gap-2">
            <GreenhouseButton
              text="ذخیره"
              variant="primary"
              icon={<SaveOutlined />}
              onClick={async () => {
                const newZone = { ZoneID: record.ZoneID, Name: zoneName, AreaSqM: zoneArea };
                await editZone(newZone);
              }}
              className="h-8 px-3 text-xs"
            />
            <GreenhouseButton
              text="لغو"
              variant="secondary"
              onClick={() => setOnEditZone(null)}
              className="h-8 px-3 text-xs"
            />
          </div>
        ) : (
          <div className="flex gap-2">
            <GreenhouseButton
              text="ویرایش"
              variant="outline"
              icon={<EditOutlined />}
              onClick={() => {
                setZoneName(record.Name || "");
                setZoneArea(record.AreaSqM || 0);
                setOnEditZone({ ZoneID: record.ZoneID, onEdit: true });
              }}
              className="h-8 px-3 text-xs"
            />
            <GreenhouseButton
              text="حذف"
              variant="outline"
              icon={<DeleteOutlined />}
              onClick={async () => {
                setZonesLoading(true);
                await deleteZone(record.ZoneID);
                const newZonesData: any = await getgreenHouseZones(props.data?.GreenhouseID || 0);
                const newMainData = await allGreenHouses();
                props.setMainData?.(newMainData);
                if (newZonesData) {
                  setZonesData(newZonesData);
                  setZonesLoading(false);
                }
              }}
              style={{ color: "#dc2626", borderColor: "#fca5a5" }}
              className="h-8 px-3 text-xs hover:bg-red-50"
            />
          </div>
        ),
    },
  ];

  const editZone = async (params: ZoneType) => {
    setZonesLoading(true);
    const res = await updateZone(params);
    if (res) {
      const newZonesData = zonesData.map((zone) => (zone.ZoneID === params.ZoneID ? { ...zone, ...params } : zone));
      setZonesData(newZonesData);
      setZonesLoading(false);
      setOnEditZone(null);
    } else {
      setZonesLoading(false);
      setModalMsg({ status: "error", message: "بروز خطا در ویرایش سالن" });
    }
  };

  const getZonesData = async (id: number) => {
    setZonesLoading(true);
    const zones: any = await getgreenHouseZones(id);
    if (zones) {
      zones.reverse();
      setZonesData(zones);
      setZonesLoading(false);
    }
  };

  useEffect(() => {
    setLoading(false);
    fetchOwners();
    if (props.isOpen && props.data) {
      form.setFieldsValue({
        GreenhouseName: props.data.GreenhouseName,
        Address: props.data.Address,
        OwnerID: props.data.OwnerID,
        Notes: props.data.Notes || "",
      });

      getZonesData(props.data.GreenhouseID);
    }
  }, [props.isOpen, props.data, form]);

  const fetchOwners = async () => {
    setOwnersLoading(true);
    const res: Owner_Observer[] = await getAllOwners();
    if (res) {
      setOwners(res.map((owner) => ({ value: owner.ID, label: owner.FirstName + " " + owner.LastName })));
      setOwnersLoading(false);
    }
  };

  const submitGreenHouse = async (values: any) => {
    setLoading(true);
    setModalMsg(null);
    await updateGreenHouse({ id: props.data?.GreenhouseID || 0, data: values });

    setModalMsg({ status: "ok", message: "اطلاعات گلخانه با موفقیت ویرایش شد" });
    props.setMainLoading?.(true);
    const newData = await allGreenHouses();
    props.setMainData?.(newData);
    props.setMainLoading?.(false);
    setLoading(false);

    setTimeout(() => {
      props.onClose?.();
      setModalMsg(null);
    }, 1500);
  };

  const submitZone = async (value: Zones) => {
    if (!props.data?.GreenhouseID) return;
    setZonesLoading(true);
    const newZone: Zones = { ...value, GreenhouseID: props.data.GreenhouseID };
    await createZone(newZone);
    const newZonesData: any = await getgreenHouseZones(props.data?.GreenhouseID || 0);
    const newMainData = await allGreenHouses();
    props.setMainData?.(newMainData);
    if (newZonesData) {
      newZonesData.reverse();
      setZonesData(newZonesData);
      setZonesLoading(false);
      setZonesModalOpen(false);
      zoneForm.resetFields();
    }
  };

  const handleClose = () => {
    props.onClose?.();
    setModalMsg(null);
    setOnEditZone(null);
  };

  return (
    <>
      <Modal
        open={props.isOpen}
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
            minWidth: "320px",
            minHeight: "480px",
          },
        }}
      >
        {/* Header */}
        <div className="relative px-6 py-6 bg-gradient-to-br from-amber-50 via-orange-50/80 to-white border-b border-amber-100">
          <button
            onClick={handleClose}
            className="absolute top-5 left-5 h-9 w-9 rounded-xl bg-white hover:bg-amber-50 border border-amber-200 hover:border-amber-300 transition-all flex items-center justify-center text-amber-600 hover:text-amber-700 shadow-sm hover:shadow"
            aria-label="بستن"
          >
            <CloseOutlined className="text-sm" />
          </button>

          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 shadow-lg flex items-center justify-center text-white">
                <EditOutlined className="text-2xl" />
              </div>
              <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-orange-400 border-2 border-white"></div>
            </div>
            <div>
              <h3 className="font-bold text-2xl text-amber-900">ویرایش اطلاعات گلخانه</h3>
              <p className="text-sm text-amber-600/80 mt-1 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                اطلاعات گلخانه و سالن‌ها را ویرایش کنید
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-6 bg-gradient-to-br from-white to-slate-50/30 max-h-[70vh] overflow-y-auto">
          {props.data !== undefined ? (
            <>
              <Form form={form} layout="vertical" onFinish={submitGreenHouse} requiredMark={false}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {fields.map((field, index) => (
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
                      className={`mb-0 ${index === 0 ? "sm:col-span-2" : ""}`}
                    >
                      {field.type === "select" ? (
                        <Select
                          showSearch
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
                          disabled={loading}
                          size="large"
                          className="rounded-xl border-2 border-slate-200 hover:border-amber-300 focus:border-amber-400 transition-all shadow-sm hover:shadow"
                          style={{ height: "46px", fontSize: "14px" }}
                        />
                      )}
                    </Form.Item>
                  ))}
                </div>

                <Form.Item
                  label={
                    <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <span>📝</span>توضیحات
                    </span>
                  }
                  name="Notes"
                  className="mt-5"
                >
                  <Input.TextArea
                    disabled={loading}
                    rows={3}
                    className="rounded-xl border-2 border-slate-200 hover:border-amber-300 focus:border-amber-400 transition-all"
                    style={{ resize: "none" }}
                  />
                </Form.Item>

                {modalMsg && (
                  <div
                    className={`mt-4 p-4 rounded-xl border-2 flex items-start gap-3 animate-in fade-in slide-in-from-top-3 duration-300 shadow-sm ${
                      modalMsg.status === "ok"
                        ? "bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-300 text-emerald-900"
                        : "bg-gradient-to-br from-rose-50 to-rose-100/50 border-rose-300 text-rose-900"
                    }`}
                  >
                    <div
                      className={`mt-0.5 p-1.5 rounded-lg ${
                        modalMsg.status === "ok" ? "bg-emerald-200/50" : "bg-rose-200/50"
                      }`}
                    >
                      {modalMsg.status === "ok" ? (
                        <CheckCircleOutlined className="text-lg text-emerald-700" />
                      ) : (
                        <ExclamationCircleOutlined className="text-lg text-rose-700" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold mb-0.5">{modalMsg.status === "ok" ? "موفقیت‌آمیز" : "خطا"}</p>
                      <p className="text-sm leading-relaxed opacity-90">{modalMsg.message}</p>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-3 mt-6 pt-4  border-slate-200">
                  <GreenhouseButton
                    text="افزودن سالن"
                    variant="secondary"
                    icon={<PlusOutlined />}
                    onClick={() => setZonesModalOpen(true)}
                    disabled={loading}
                    className="min-w-[140px] h-11"
                  />
                  <GreenhouseButton
                    text={loading ? "در حال ویرایش..." : "ویرایش اطلاعات"}
                    variant="primary"
                    type="submit"
                    loading={loading}
                    className="min-w-[140px] h-11 shadow-lg hover:shadow-xl"
                  />
                </div>
              </Form>

              {/* Zones Table */}
              {zonesData.length > 0 && (
                <>
                  <Divider className="my-6">
                    <span className="text-slate-600 font-semibold">سالن‌های گلخانه</span>
                  </Divider>
                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <Table
                      columns={zonesColumns}
                      dataSource={zonesData}
                      rowKey="ZoneID"
                      loading={zonesLoading}
                      scroll={{ y: 240 }}
                      pagination={{
                        current: pagination.current,
                        pageSize: pagination.pageSize,
                        total: zonesData.length,
                        onChange: (page, pageSize) => setPagination({ current: page, pageSize }),
                        showTotal: (total, range) => `${range[0]}–${range[1]} از ${total}`,
                      }}
                    />
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center py-12">
              <div className="text-slate-600">در حال بارگذاری...</div>
            </div>
          )}
        </div>
      </Modal>

      {/* Add Zone Modal */}
      <Modal
        open={zonesModalOpen}
        onCancel={() => {
          setZonesModalOpen(false);
          zoneForm.resetFields();
        }}
        footer={null}
        closeIcon={null}
        centered
        width={520}
        styles={{
          content: { padding: 0, borderRadius: "1rem", overflow: "hidden" },
        }}
      >
        <div className="relative px-6 py-5 bg-gradient-to-br from-emerald-50/80 via-lime-50/60 to-white border-b border-emerald-100">
          <button
            onClick={() => {
              setZonesModalOpen(false);
              zoneForm.resetFields();
            }}
            className="absolute top-4 left-4 h-8 w-8 rounded-lg bg-white/80 hover:bg-white border border-emerald-100 hover:border-emerald-200 transition-all flex items-center justify-center text-emerald-600 hover:text-emerald-700"
          >
            <CloseOutlined className="text-sm" />
          </button>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-md flex items-center justify-center text-white">
              <PlusOutlined className="text-2xl" />
            </div>
            <div>
              <h3 className="font-bold text-xl text-emerald-900">افزودن سالن جدید</h3>
              <p className="text-sm text-emerald-700/70 mt-0.5">اطلاعات سالن را وارد کنید</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-6 bg-white">
          <Form form={zoneForm} layout="vertical" onFinish={submitZone} requiredMark={false}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {zoneFields.map((field) => (
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
                  <Input
                    type={field.type || "text"}
                    placeholder={field.placeholder}
                    disabled={zonesLoading}
                    size="large"
                    className="rounded-xl border-2 border-slate-200 hover:border-emerald-300 focus:border-emerald-400 transition-all shadow-sm hover:shadow"
                    style={{ height: "46px", fontSize: "14px" }}
                  />
                </Form.Item>
              ))}
            </div>

            <Form.Item
              label={
                <span className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                  <span>📝</span>توضیحات سالن
                </span>
              }
              name="MicroclimateNotes"
              className="mt-5"
            >
              <Input.TextArea
                placeholder="توضیحات سالن"
                disabled={zonesLoading}
                rows={3}
                className="rounded-xl border-2 border-slate-200 hover:border-emerald-300 focus:border-emerald-400 transition-all"
                style={{ resize: "none" }}
              />
            </Form.Item>

            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
              <GreenhouseButton
                text="انصراف"
                variant="secondary"
                onClick={() => {
                  setZonesModalOpen(false);
                  zoneForm.resetFields();
                }}
                disabled={zonesLoading}
                className="w-full sm:w-auto min-w-[120px]"
              />
              <GreenhouseButton
                text={zonesLoading ? "در حال افزودن..." : "افزودن سالن"}
                variant="primary"
                type="submit"
                loading={zonesLoading}
                className="w-full sm:w-auto min-w-[120px] shadow-lg hover:shadow-xl"
              />
            </div>
          </Form>
        </div>
      </Modal>
    </>
  );
}
