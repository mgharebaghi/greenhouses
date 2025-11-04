import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import GreenhouseButton from "@/app/components/UI/GreenhouseButton";

interface TableActionsProps {
  onEdit: () => void;
  onDelete: () => void;
  editTitle?: string;
  deleteTitle?: string;
  disabledEdit?: boolean;
  disabledDelete?: boolean;
  qrcode?: () => void;
}

export default function TableActions({
  onEdit,
  onDelete,
  editTitle = "ویرایش",
  deleteTitle = "حذف",
  disabledEdit = false,
  disabledDelete = false,
  qrcode,
}: TableActionsProps) {
  return (
    <div className="flex gap-3 items-center">
      <button
        onClick={onEdit}
        title={editTitle}
        aria-label={editTitle}
        disabled={disabledEdit}
        className={`h-8 w-8 flex items-center justify-center rounded-full border border-emerald-100 bg-emerald-50/60 shadow-sm transition-all
          hover:bg-emerald-100 hover:border-emerald-300 hover:shadow-md
          focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300
          disabled:opacity-50 disabled:cursor-not-allowed
          group`}
        type="button"
      >
        <EditOutlined className="text-emerald-600 text-base group-hover:scale-110 transition-transform" />
      </button>
      <button
        onClick={onDelete}
        title={deleteTitle}
        aria-label={deleteTitle}
        disabled={disabledDelete}
        className={`h-8 w-8 flex items-center justify-center rounded-full border border-red-100 bg-red-50/60 shadow-sm transition-all
          hover:bg-red-100 hover:border-red-300 hover:shadow-md
          focus:outline-none focus-visible:ring-2 focus-visible:ring-red-200
          disabled:opacity-50 disabled:cursor-not-allowed
          group`}
        type="button"
      >
        <DeleteOutlined className="text-red-500 text-base group-hover:scale-110 transition-transform" />
      </button>
      {qrcode && <GreenhouseButton onClick={qrcode} text="کد QR" />}
    </div>
  );
}
