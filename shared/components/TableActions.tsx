import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PrinterOutlined,
  QrcodeOutlined,
} from "@ant-design/icons";
import GreenhouseButton from "./GreenhouseButton";

interface TableActionsProps {
  onEdit: () => void;
  onDelete: () => void;
  editTitle?: string;
  deleteTitle?: string;
  disabledEdit?: boolean;
  disabledDelete?: boolean;
  qrcode?: () => void;
  onPrint?: () => void;
  onView?: () => void;
  viewTitle?: string;
}

export default function TableActions({
  onEdit,
  onDelete,
  editTitle = "ویرایش",
  deleteTitle = "حذف",
  disabledEdit = false,
  disabledDelete = false,
  qrcode,
  onPrint,
  onView,
  viewTitle,
}: TableActionsProps) {
  return (
    <div className="flex min-w-0 flex-wrap items-center gap-1.5 sm:gap-2 [&>button]:shrink-0">
      {onView && (
        <GreenhouseButton
          aria-label={viewTitle || "مشاهده جزئیات"}
          title={viewTitle || "مشاهده جزئیات"}
          icon={<EyeOutlined />}
          variant="soft"
          onClick={onView}
        />
      )}
      {qrcode && (
        <GreenhouseButton
          aria-label="کد QR"
          title="کد QR"
          icon={<QrcodeOutlined />}
          variant="secondary"
          onClick={qrcode}
        />
      )}
      {onPrint && (
        <GreenhouseButton
          aria-label="چاپ"
          title="چاپ"
          icon={<PrinterOutlined />}
          variant="secondary"
          onClick={onPrint}
        />
      )}
      <GreenhouseButton
        aria-label={editTitle}
        title={editTitle}
        icon={<EditOutlined />}
        variant="soft"
        onClick={onEdit}
        disabled={disabledEdit}
      />
      <GreenhouseButton
        aria-label={deleteTitle}
        title={deleteTitle}
        icon={<DeleteOutlined />}
        variant="danger-soft"
        onClick={onDelete}
        disabled={disabledDelete}
      />
    </div>
  );
}
