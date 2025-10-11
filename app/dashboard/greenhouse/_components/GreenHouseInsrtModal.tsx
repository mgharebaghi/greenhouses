import { Button, Col, Divider, Form, Input, Modal, Row, Select, Spin } from "antd";
import { ModalMsg } from "./Main";
import { Greenhouses, Owner_Observer, Zones } from "@/app/generated/prisma";
import { useEffect, useState } from "react";
import { allGreenHouses, createGreenHouse, GreenHouseCreateRes } from "@/app/lib/services/greenhouse";
import { getAllOwners } from "@/app/lib/services/owners";
import { createZone, ZoneCreateRes } from "@/app/lib/services/zones";
import GreenhouseButton from "../../_components/tools/GlassMorphButton";

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

  useEffect(() => {
    if (modalOpen) {
      setModalMsg(null);
      fetchOwners();
    }
  }, [modalOpen]);

  const fetchOwners = async () => {
    setOwnersLoading(true);
    const res: Owner_Observer[] = await getAllOwners();
    if (res) {
      setOwners(res.map((owner) => ({ value: owner.ID, label: owner.FirstName + " " + owner.LastName })));
      setOwnersLoading(false);
    }
  };

  const greenHousefields = [
    { name: "GreenhouseName", label: "نام گلخانه", placeholder: "نام گلخانه", required: true, type: "text" },
    { name: "OwnerID", label: "نام مالک", placeholder: "انتخاب مالک", required: true, type: "select" },
    { name: "Address", label: "آدرس", placeholder: "آدرس گلخانه", required: true, type: "text" },
  ];

  const zoneFields = [
    { name: "Name", label: "نام سالن", placeholder: "نام سالن", required: true, type: "text" },
    { name: "AreaSqM", label: "مساحت (متر مربع)", placeholder: "مساحت سالن", required: true, type: "number" },
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

    if (res.status === "error") {
      setLoading(false);
      return;
    }

    setLoading(false);
  };

  const submitZone = async (value: Zones) => {
    if (!greenHouseId) return;
    setZoneLoading(true);
    const newZone: Zones = { ...value, GreenhouseID: greenHouseId };
    const res: ZoneCreateRes = await createZone(newZone);
    setZoneLoading(false);
    setZoneMsg(res);
  };

  const onClose = async () => {
    setModalOpen(false);
    if (greenHouseId) {
      setGreenHouseId(null);
      setMainLoading(true);
      const newData = await allGreenHouses();
      setMainData(newData);
      setMainLoading(false);
      setZoneMsg(null);
    }
    greenHouseForm.resetFields();
    zoneForm.resetFields();
  };

  return (
    <Modal
      title={
        <>
          <div className="text-lg font-semibold">افزودن گلخانه</div>
          <Divider />
        </>
      }
      open={modalOpen}
      onCancel={onClose}
      footer={null}
      className="min-w-[50%]"
    >
      <Form form={greenHouseForm} layout="vertical" className="w-full" onFinish={submitGreenHouse}>
        <Row gutter={[16, 16]}>
          {greenHousefields.map((field) => (
            <Col key={field.name} xs={24} sm={24} md={12} lg={8}>
              <Form.Item
                name={field.name}
                label={field.label}
                rules={[{ required: field.required, message: `لطفا ${field.label} را وارد کنید` }]}
              >
                {field.name === "OwnerID" ? (
                  <Select
                    showSearch
                    placeholder={field.placeholder}
                    options={owners}
                    optionFilterProp="label"
                    loading={ownersLoading}
                    allowClear
                  />
                ) : (
                  <Input type={field.type} placeholder={field.placeholder} />
                )}
              </Form.Item>
            </Col>
          ))}
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item name="Notes" label="توضیحات:">
              <Input.TextArea style={{ resize: "none", minHeight: "150px" }} placeholder="توضیحات گلخانه" rows={4} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 16]} justify="end" align="middle">
          <Col span={8}>
            <Button type="primary" htmlType="submit">
              ثبت گلخانه
            </Button>
          </Col>
          <Col span={16}>
            {loading && (
              <div className="w-full flex justify-center">
                <Spin size="default" />
              </div>
            )}
            {modalMsg?.status === "ok" ? (
              <div className="text-sm text-gray-500">{modalMsg.message}</div>
            ) : (
              <div className=" text-sm text-red-500">{modalMsg?.message}</div>
            )}
          </Col>
        </Row>
      </Form>
      <Divider orientation="left">اضافه کردن سالن</Divider>
      <Form form={zoneForm} layout="vertical" className="w-full" disabled={!greenHouseId} onFinish={submitZone}>
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
            {zoneLoading && (
              <div className="w-full flex justify-center">
                <Spin size="default" />
              </div>
            )}
            {zoneMsg?.status === "ok" ? (
              <div className="text-sm text-gray-500">{zoneMsg.message}</div>
            ) : (
              <div className=" text-sm text-red-500">{zoneMsg?.message}</div>
            )}
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
