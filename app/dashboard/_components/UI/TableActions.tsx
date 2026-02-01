import { EditOutlined, DeleteOutlined, QrcodeOutlined, PrinterOutlined } from "@ant-design/icons";

interface TableActionsProps {
  onEdit: () => void;
  onDelete: () => void;
  editTitle?: string;
  deleteTitle?: string;
  disabledEdit?: boolean;
  disabledDelete?: boolean;
  qrcode?: () => void;
  onPrint?: () => void;
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
}: TableActionsProps) {
  return (
    <div className="flex gap-3 items-center">
      {qrcode && (
        <button
          onClick={qrcode}
          title="کد QR"
          aria-label="کد QR"
          className={`h-8 w-8 flex items-center justify-center rounded-full border border-blue-100 dark:border-blue-800 bg-blue-50/60 dark:bg-blue-900/20 shadow-sm transition-all
            hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md
            focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-200
            disabled:opacity-50 disabled:cursor-not-allowed
            group`}
          type="button"
        >
          <QrcodeOutlined className="text-blue-500 dark:text-blue-400 text-base group-hover:scale-110 transition-transform" />
        </button>
      )}
      {onPrint && (
        <button
          onClick={onPrint}
          title="چاپ"
          aria-label="چاپ"
          className={`h-8 w-8 flex items-center justify-center rounded-full border border-purple-100 dark:border-purple-800 bg-purple-50/60 dark:bg-purple-900/20 shadow-sm transition-all
            hover:bg-purple-100 dark:hover:bg-purple-900/40 hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-md
            focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-200
            disabled:opacity-50 disabled:cursor-not-allowed
            group`}
          type="button"
        >
          <PrinterOutlined className="text-purple-500 dark:text-purple-400 text-base group-hover:scale-110 transition-transform" />
        </button>
      )}
      <button
        onClick={onEdit}
        title={editTitle}
        aria-label={editTitle}
        disabled={disabledEdit}
        className={`h-8 w-8 flex items-center justify-center rounded-full border border-emerald-100 dark:border-emerald-800 bg-emerald-50/60 dark:bg-emerald-900/20 shadow-sm transition-all
          hover:bg-emerald-100 dark:hover:bg-emerald-900/40 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-md
          focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300
          disabled:opacity-50 disabled:cursor-not-allowed
          group`}
        type="button"
      >
        <EditOutlined className="text-emerald-600 dark:text-emerald-400 text-base group-hover:scale-110 transition-transform" />
      </button>
      <button
        onClick={onDelete}
        title={deleteTitle}
        aria-label={deleteTitle}
        disabled={disabledDelete}
        className={`h-8 w-8 flex items-center justify-center rounded-full border border-red-100 dark:border-red-800 bg-red-50/60 dark:bg-red-900/20 shadow-sm transition-all
          hover:bg-red-100 dark:hover:bg-red-900/40 hover:border-red-300 dark:hover:border-red-700 hover:shadow-md
          focus:outline-none focus-visible:ring-2 focus-visible:ring-red-200
          disabled:opacity-50 disabled:cursor-not-allowed
          group`}
        type="button"
      >
        <DeleteOutlined className="text-red-500 dark:text-red-400 text-base group-hover:scale-110 transition-transform" />
      </button>
    </div>
  );
}
