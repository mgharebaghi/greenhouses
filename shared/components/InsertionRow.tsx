import { DownCircleOutlined, PlusOutlined, BarChartOutlined } from "@ant-design/icons";
import GreenhouseButton from "@/shared/components/GreenhouseButton";

export default function InsertionRow({
  text,
  insertOnclick,
  csvOnclick,
  msg,
  data,
  btnDisabled,
}: {
  text: string;
  insertOnclick: () => void;
  csvOnclick: () => void;
  msg?: string;
  data?: any[];
  btnDisabled?: boolean;
}) {
  const dataCount = data?.length || 0;

  return (
    <div
      dir="rtl"
      className="w-full p-4 bg-gradient-to-r from-white/80 to-slate-50/80 dark:from-slate-900/80 dark:to-slate-950/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-tr-xl rounded-tl-xl shadow-sm transition-colors duration-300"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Stats Section */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <BarChartOutlined className="text-lg" />
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">{dataCount} مورد</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">کل {text}</div>
            </div>
          </div>

          {msg && (
            <div className="px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg">
              <span className="text-xs text-amber-700 dark:text-amber-400">{msg}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <GreenhouseButton
            text={`افزودن ${text}`}
            icon={<PlusOutlined />}
            onClick={insertOnclick}
            className="h-9 px-4 text-sm w-full sm:w-auto whitespace-nowrap"
            type="button"
            disabled={btnDisabled}
          />

          <GreenhouseButton
            text="دانلود CSV"
            icon={<DownCircleOutlined />}
            onClick={csvOnclick}
            variant="secondary"
            className="h-9 px-4 text-sm w-full sm:w-auto whitespace-nowrap"
            type="button"
          />
        </div>
      </div>
    </div>
  );
}
