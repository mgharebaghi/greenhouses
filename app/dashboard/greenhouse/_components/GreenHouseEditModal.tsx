import { Button, Col, Divider, Form, Input, InputNumber, Modal, Row, Select, Spin, Table } from "antd";
import { ModalMsg } from "./Main";
import { Greenhouses, Owner_Observer, Zones } from "@/app/generated/prisma";
import { useEffect, useState } from "react";
import { allGreenHouses, updateGreenHouse } from "@/app/lib/services/greenhouse";
import { SelectOptions } from "./GreenHouseInsrtModal";
import { getAllOwners } from "@/app/lib/services/owners";
import { ColumnType } from "antd/es/table";
import { createZone, deleteZone, deleteZones, updateZone } from "@/app/lib/services/zones";
import { getgreenHouseZones } from "@/app/lib/services/zones/read";
import { get } from "http";

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

  const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });
  const [zonesModalOpen, setZonesModalOpen] = useState(false);
  const [zonesData, setZonesData] = useState<ZoneType[]>([]);
  const [onEditZone, setOnEditZone] = useState<EditZoneType | null>(null);
  const [zonesLoading, setZonesLoading] = useState(false);
  const [zoneName, setZoneName] = useState("");
  const [zoneArea, setZoneArea] = useState(0);

  const fields = [
    { name: "GreenhouseName", label: "نام گلخانه", required: true, type: "text" },
    { name: "OwnerID", label: "نام مالک", required: true, type: "select" },
    { name: "Address", label: "آدرس", required: true, type: "text" },
  ];

  const zoneFields = [
    { name: "Name", label: "نام سالن", placeholder: "نام سالن", required: true, type: "text" },
    { name: "AreaSqM", label: "مساحت (متر مربع)", placeholder: "مساحت سالن", required: true, type: "number" },
  ];

  const zonesColumns: ColumnType<ZoneType>[] = [
    {
      title: "نام سالن",
      dataIndex: "Name",
      key: "Name",
      render: (_: any, record: ZoneType) =>
        onEditZone?.ZoneID === record.ZoneID ? (
          <Form.Item rules={[{ required: true, message: "لطفا نام سالن را وارد کنید" }]}>
            <Input value={zoneName} onChange={(e) => setZoneName(e.target.value)} />
          </Form.Item>
        ) : (
          <div>{record.Name}</div>
        ),
    },
    {
      title: "مساحت (متر مربع)",
      dataIndex: "AreaSqM",
      key: "AreaSqM",
      render: (_: any, record: ZoneType) =>
        onEditZone?.ZoneID === record.ZoneID ? (
          <Form.Item rules={[{ required: true, message: "لطفا مساحت سالن را وارد کنید" }]}>
            <InputNumber value={zoneArea} onChange={(value) => setZoneArea(value || 0)} />
          </Form.Item>
        ) : (
          <div>{record.AreaSqM}</div>
        ),
    },
    {
      title: "عملیات",
      dataIndex: "actions",
      key: "actions",
      render: (_: any, record: ZoneType) =>
        onEditZone?.ZoneID === record.ZoneID ? (
          <>
            <Button
              type="link"
              onClick={async () => {
                const newZone = {
                  ZoneID: record.ZoneID,
                  Name: zoneName,
                  AreaSqM: zoneArea,
                };
                await editZone(newZone);
              }}
            >
              ذخیره
            </Button>
            <Button type="link" onClick={() => setOnEditZone(null)}>
              لغو
            </Button>
          </>
        ) : (
          <>
            <Button
              type="link"
              onClick={() => {
                setZoneName(record.Name || "");
                setZoneArea(record.AreaSqM || 0);
                setOnEditZone({ ZoneID: record.ZoneID, onEdit: true });
              }}
            >
              ویرایش
            </Button>
            <Button
              type="link"
              danger
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
            >
              حذف
            </Button>
          </>
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
    setLoading(false);
    props.onClose?.();

    props.setMainLoading?.(true);
    const newData = await allGreenHouses();
    props.setMainData?.(newData);
    props.setMainLoading?.(false);
  };

  const submitZone = async (value: Zones) => {
    if (!props.data?.GreenhouseID) return;
    if (zonesData.length === 0) {
      setLoading(true);
    }
    setZonesLoading(true);
    setZonesModalOpen(false);
    const newZone: Zones = { ...value, GreenhouseID: props.data.GreenhouseID };
    await createZone(newZone);
    const newZonesData: any = await getgreenHouseZones(props.data?.GreenhouseID || 0);
    const newMainData = await allGreenHouses();
    props.setMainData?.(newMainData);
    if (newZonesData) {
      setLoading(false);
      newZonesData.reverse();
      setZonesData(newZonesData);
      setZonesLoading(false);
      setZonesModalOpen(false);
    }
  };

  return (
    <Modal
      title={
        <>
          <div className="text-lg font-semibold">بروزرسانی گلخانه</div>
          <Divider />
        </>
      }
      open={props.isOpen}
      onCancel={props.onClose}
      footer={null}
      className="min-w-[50%]"
    >
      {props.data !== undefined ? (
        <>
          <Form form={form} layout="vertical" className="w-full" onFinish={submitGreenHouse}>
            <Row gutter={[16, 16]}>
              {fields.map((field) => (
                <Col key={field.name} xs={24} sm={24} md={12} lg={8}>
                  <Form.Item
                    name={field.name}
                    label={field.label}
                    rules={[{ required: field.required, message: `لطفا ${field.label} را وارد کنید` }]}
                  >
                    {field.name === "OwnerID" ? (
                      <Select showSearch options={owners} optionFilterProp="label" loading={ownersLoading} allowClear />
                    ) : (
                      <Input type={field.type} />
                    )}
                  </Form.Item>
                </Col>
              ))}
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item name="Notes" label="توضیحات:">
                  <Input.TextArea
                    style={{ resize: "none", minHeight: "150px" }}
                    value={props.data.Notes || ""}
                    rows={4}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[16, 16]} justify="space-between" align="middle">
              <Col span={12}>
                <Button type="primary" htmlType="submit">
                  ثبت تغییرات
                </Button>
              </Col>
              <Col span={4.5}>
                <Button type="default" onClick={() => setZonesModalOpen(true)}>
                  افزودن سالن جدید
                </Button>
              </Col>
              <Col span={24}>
                {loading && (
                  <div className="w-full flex justify-center">
                    <Spin size="default" />
                  </div>
                )}
                {modalMsg?.status === "ok" ? (
                  <div className="w-full text-center text-sm text-gray-500">{modalMsg.message}</div>
                ) : (
                  <div className="w-full text-center text-sm text-red-500">{modalMsg?.message}</div>
                )}
              </Col>
            </Row>
          </Form>
          <div>
            {zonesData.length > 0 && (
              <>
                <Divider orientation="left">سالن ها</Divider>
                <Table
                  columns={zonesColumns}
                  dataSource={zonesData}
                  rowKey="ZoneID"
                  loading={zonesLoading}
                  scroll={{ y: 180 }}
                  pagination={{
                    current: pagination.current,
                    pageSize: pagination.pageSize,
                    total: zonesData.length,
                    pageSizeOptions: [5, 10, 20, 50],
                    onChange: (page, pageSize) => setPagination({ current: page, pageSize }),
                    showTotal: (total, range) => `${range[0]}–${range[1]} از ${total}`,
                  }}
                />
              </>
            )}
          </div>
        </>
      ) : (
        <div>در حال بارگذاری...</div>
      )}
      <Modal title="افزودن سالن جدید" open={zonesModalOpen} footer={null} onCancel={() => setZonesModalOpen(false)}>
        <Form layout="vertical" className="w-full" onFinish={submitZone}>
          <Row gutter={[16, 16]}>
            {zoneFields.map((field) => (
              <Col key={field.name} xs={24} sm={24} md={12} lg={12}>
                <Form.Item
                  name={field.name}
                  label={field.label}
                  rules={[{ required: field.required, message: `لطفا ${field.label} را وارد کنید` }]}
                >
                  <Input type={field.type} placeholder={field.placeholder} />
                </Form.Item>
              </Col>
            ))}
          </Row>
          <Row>
            <Col span={24}>
              <Form.Item>
                <Input.TextArea
                  name="MicroclimateNotes"
                  style={{ resize: "none", minHeight: "150px" }}
                  placeholder="توضیحات سالن"
                  rows={4}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col>
              <Button type="primary" htmlType="submit">
                افزودن سالن
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal>
    </Modal>
  );
}
