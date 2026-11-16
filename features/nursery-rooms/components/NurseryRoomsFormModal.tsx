import {
  DatePicker,
  Form,
  FormActions,
  FormGrid,
  FormItem,
  Input,
  InputNumber,
  Select,
} from "@/shared/components/FormControls";
import {
  createNurseryRoom,
  updateNurseryRoom,
} from "@/features/nursery-rooms/actions";
import Modal from "@/shared/components/FormModal";
import { applyFieldErrors } from "@/shared/forms/field-errors";
import { refreshSavedForm, submitForm } from "@/shared/forms/submit";
import { PlusOutlined } from "@ant-design/icons";

import { useEffect, useState } from "react";
import type { z } from "zod";
import { nurseryRoomInputSchema } from "../schema";
import type { NurseryRoomRecord } from "../types/record";

interface NurseryRoomsInsUpModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  setLoading: (loading: boolean) => void;
  data?: NurseryRoomRecord | null; // If data is provided, it's edit mode
  refreshData: () => void;
}

export default function NurseryRoomsInsUpModal({
  open,
  setOpen,
  setLoading,
  data,
  refreshData,
}: NurseryRoomsInsUpModalProps) {
  const [form] = Form.useForm();
  const [internalLoading, setInternalLoading] = useState(false);
  const [message, setMessage] = useState<{
    status: "ok" | "error";
    message: string;
  } | null>(null);

  const isEditMode = !!data;

  useEffect(() => {
    if (open) {
      setMessage(null);
      if (isEditMode && data) {
        form.setFieldsValue({
          NurseryRoomCode: data.NurseryRoomCode,
          NurseryRoomName: data.NurseryRoomName,
          TemperatureMin: data.TemperatureMin,
          TemperatureMax: data.TemperatureMax,
          HumidityMin: data.HumidityMin,
          HumidityMax: data.HumidityMax,
          LightType: data.LightType,
          LightHoursPerDay: data.LightHoursPerDay,
          CO2Range: data.CO2Range,
          StrelizationMethod: data.StrelizationMethod,
          NurseryRoomCreatedAt: data.NurseryRoomCreatedAt ?? null,
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, data, isEditMode, form]);

  const handleFinish = async (
    values: z.input<typeof nurseryRoomInputSchema>,
  ) => {
    await submitForm(
      async () => {
        setInternalLoading(true);
        setLoading(true);
        setMessage(null);

        let res;
        if (isEditMode && data?.ID) {
          res = await updateNurseryRoom(data.ID, values);
        } else {
          res = await createNurseryRoom(values);
        }

        setLoading(false);
        setInternalLoading(false);

        applyFieldErrors(form, res);
        if (res.status === "ok") {
          setMessage({ status: "ok", message: res.message });
          setTimeout(() => {
            setOpen(false);
            void refreshSavedForm(refreshData);
            if (!isEditMode) {
              form.resetFields();
            }
          }, 1000);
        } else {
          setMessage({ status: "error", message: res.message });
        }
      },
      (feedback) => setMessage(feedback),
      () => {
        setInternalLoading(false);
        setLoading(false);
      },
    );
  };

  const handleClose = () => {
    setOpen(false);
    setMessage(null);
    if (!isEditMode) {
      form.resetFields();
    }
  };

  // Header colors

  return (
    <Modal
      open={open}
      onClose={handleClose}
      destroyOnHidden
      heading={isEditMode ? "ویرایش اتاق ریکاوری" : "افزودن اتاق ریکاوری جدید"}
      description={
        isEditMode
          ? `ویرایش اطلاعات اتاق: ${data?.NurseryRoomName}`
          : "اطلاعات اتاق را با دقت وارد کنید"
      }
      icon={<PlusOutlined />}
      editing={isEditMode}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        requiredMark={false}
      >
        <FormGrid title="مشخصات اتاق">
          <FormItem
            name="NurseryRoomCode"
            label={
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                کد اتاق <span className="text-rose-500">*</span>
              </span>
            }
            rules={[{ required: true, message: "لطفا کد اتاق را وارد کنید" }]}
            className="mb-0"
          >
            <Input placeholder="مثال: NR-01" />
          </FormItem>

          <FormItem
            name="NurseryRoomName"
            label={
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                نام اتاق <span className="text-rose-500">*</span>
              </span>
            }
            rules={[{ required: true, message: "لطفا نام اتاق را وارد کنید" }]}
            className="mb-0"
          >
            <Input placeholder="مثال: اتاق ریکاوری اصلی" />
          </FormItem>

          <FormItem
            name="StrelizationMethod"
            label={
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                روش ضدعفونی
              </span>
            }
            className="mb-0"
          >
            <Input placeholder="مثال: UV, Ozone" />
          </FormItem>

          <FormItem
            name="NurseryRoomCreatedAt"
            label={
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                تاریخ تاسیس
              </span>
            }
            className="mb-0"
          >
            <DatePicker placeholder="انتخاب تاریخ" />
          </FormItem>
        </FormGrid>

        <FormGrid title="دما و رطوبت">
          <FormItem
            name="TemperatureMin"
            label={
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                حداقل دما
              </span>
            }
            className="mb-0"
          >
            <InputNumber placeholder="درجه" controls={false} />
          </FormItem>

          <FormItem
            name="TemperatureMax"
            label={
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                حداکثر دما
              </span>
            }
            className="mb-0"
          >
            <InputNumber placeholder="درجه" controls={false} />
          </FormItem>

          <FormItem
            name="HumidityMin"
            label={
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                حداقل رطوبت
              </span>
            }
            className="mb-0"
          >
            <InputNumber placeholder="درصد" controls={false} />
          </FormItem>

          <FormItem
            name="HumidityMax"
            label={
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                حداکثر رطوبت
              </span>
            }
            className="mb-0"
          >
            <InputNumber placeholder="درصد" controls={false} />
          </FormItem>
        </FormGrid>

        <FormGrid title="نور و تهویه" columns={3}>
          <FormItem
            name="LightType"
            label={
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                نوع نور
              </span>
            }
            className="mb-0"
          >
            <Select
              placeholder="انتخاب کنید"

              options={[
                { label: "طبیعی", value: "Natural" },
                { label: "مصنوعی", value: "Artificial" },
                { label: "ترکیبی", value: "Hybrid" },
              ]}
            />
          </FormItem>

          <FormItem
            name="LightHoursPerDay"
            label={
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                ساعات نوردهی در روز
              </span>
            }
            className="mb-0"
          >
            <InputNumber placeholder="ساعت" controls={false} />
          </FormItem>

          <FormItem
            name="CO2Range"
            label={
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                میزان CO2 (ppm)
              </span>
            }
            className="mb-0"
          >
            <Input placeholder="مثال: 400-800" />
          </FormItem>
        </FormGrid>

        <FormActions
          message={message}
          onCancel={handleClose}
          loading={internalLoading}
          editing={isEditMode}
        />
      </Form>
    </Modal>
  );
}
