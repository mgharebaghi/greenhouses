import { getOrderById } from "@/features/orders/services";
import QRCodeCanvas from "@/shared/components/QRCodeCanvas";
import { notFound } from "next/navigation";
import {
    CalendarOutlined,
    UserOutlined,
    BarcodeOutlined,
    ExperimentOutlined,
    SafetyCertificateFilled,
    GlobalOutlined,
    CheckCircleFilled,
    InboxOutlined,
    SolutionOutlined,
    TeamOutlined
} from "@ant-design/icons";

export default async function PublicOrderScanPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const order: any = await getOrderById(Number(id));

    if (!order) return notFound();

    const formatDate = (date: string | Date | null | undefined) => {
        if (!date) return "---";
        return new Date(date).toLocaleDateString("fa-IR", { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const rootstockPkg = order.Tbl_SeedPackage_Tbl_Orders_RootstockIDToTbl_SeedPackage;
    const scionPkg = order.Tbl_SeedPackage_Tbl_Orders_ScionIDToTbl_SeedPackage;

    const boldFont = { fontFamily: "IransansB, sans-serif" };
    const regFont = { fontFamily: "IransansR, sans-serif" };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-200 flex flex-col items-center justify-center p-4 lg:p-8 transition-colors duration-500" dir="rtl" style={regFont}>
            {/* Ambient Background - Adaptive */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-emerald-600/5 dark:bg-emerald-600/10 rounded-full blur-[150px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/5 dark:bg-blue-600/10 rounded-full blur-[150px]"></div>
            </div>

            <div className="w-full max-w-2xl relative z-10 space-y-4">

                {/* 1. Header Card (Identity) - Constant Premium Gradient */}
                <div className="bg-gradient-to-l from-emerald-600 to-teal-800 rounded-[2.5rem] p-8 shadow-2xl shadow-emerald-200/50 dark:shadow-none flex flex-col md:flex-row items-center gap-8 border border-white/10">
                    <div className="shrink-0 bg-white p-4 rounded-[2rem] shadow-xl rotate-3 hover:rotate-0 transition-transform duration-500">
                        <QRCodeCanvas value={`https://mygreenhouses.ir/public/scan/orders/${order.ID}`} size={140} />
                    </div>
                    <div className="flex-1 text-center md:text-right">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-4">
                            <SafetyCertificateFilled className="text-emerald-300" />
                            <span className="text-xs text-white tracking-widest" style={boldFont}>تاییدیه اصالت محصولات</span>
                        </div>
                        <h2 className="text-emerald-100/60 text-sm mb-1 uppercase tracking-tighter" style={boldFont}>Tracking ID</h2>
                        <h1 className="text-white text-5xl font-mono tracking-tighter mb-4 drop-shadow-sm" style={boldFont}>{order.OrderCode}</h1>
                        <div className="flex flex-wrap justify-center md:justify-start gap-4">
                            <div className="flex items-center gap-2 text-emerald-50 bg-black/10 px-3 py-1 rounded-lg">
                                <CalendarOutlined className="text-xs" />
                                <span className="text-xs">{formatDate(order.OrderDate)}</span>
                            </div>
                            <div className="flex items-center gap-2 text-emerald-50 bg-black/10 px-3 py-1 rounded-lg">
                                <InboxOutlined className="text-xs" />
                                <span className="text-xs" style={boldFont}>{order.OrderCount?.toLocaleString()} عدد</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Detail Cards Grid - Adaptive Design */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {/* Customer & Manager */}
                    <div className="bg-white/80 dark:bg-slate-900/50 backdrop-blur-md rounded-[2.2rem] p-7 border border-slate-200 dark:border-white/5 space-y-4 shadow-xl shadow-slate-200/50 dark:shadow-none hover:border-emerald-500/30 transition-all group">
                        <h3 className="text-emerald-600 dark:text-emerald-400 text-sm flex items-center gap-2 mb-2" style={boldFont}>
                            <TeamOutlined className="p-1.5 bg-emerald-100 dark:bg-emerald-500/20 rounded-lg" /> طرفین قرارداد
                        </h3>
                        <div className="space-y-4">
                            <div className="flex flex-col">
                                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">مشتری ارجمند</span>
                                <span className="text-base text-slate-800 dark:text-white" style={boldFont}>
                                    {order.Tbl_People_Tbl_Orders_CustomerIDToTbl_People ? `${order.Tbl_People_Tbl_Orders_CustomerIDToTbl_People.FirstName} ${order.Tbl_People_Tbl_Orders_CustomerIDToTbl_People.LastName}` : "---"}
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">مدیر پروژه</span>
                                <span className="text-base text-slate-800 dark:text-white" style={boldFont}>
                                    {order.Tbl_People_Tbl_Orders_ProjectManagerToTbl_People ? `${order.Tbl_People_Tbl_Orders_ProjectManagerToTbl_People.FirstName} ${order.Tbl_People_Tbl_Orders_ProjectManagerToTbl_People.LastName}` : "---"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Supplier */}
                    <div className="bg-white/80 dark:bg-slate-900/50 backdrop-blur-md rounded-[2.2rem] p-7 border border-slate-200 dark:border-white/5 space-y-4 shadow-xl shadow-slate-200/50 dark:shadow-none hover:border-blue-500/30 transition-all group">
                        <h3 className="text-blue-600 dark:text-blue-400 text-sm flex items-center gap-2 mb-2" style={boldFont}>
                            <SolutionOutlined className="p-1.5 bg-blue-100 dark:bg-blue-500/20 rounded-lg" /> اطلاعات تامین
                        </h3>
                        <div className="space-y-4">
                            <div className="flex flex-col">
                                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">تامین کننده</span>
                                <span className="text-base text-slate-800 dark:text-white" style={boldFont}>
                                    {order.Tbl_suppliers?.CompanyName || `${order.Tbl_suppliers?.FirstName || ''} ${order.Tbl_suppliers?.LastName || ''}` || "---"}
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest"> کد مجوز تامین کننده</span>
                                <span className="text-base text-slate-800 dark:text-white font-mono" style={boldFont}>
                                    {order.Tbl_suppliers?.LicenseNumber || "P-88432-FA"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Technical Specifications (Full Width) */}
                    <div className="md:col-span-2 bg-white dark:bg-white/5 backdrop-blur-md rounded-[2.5rem] p-8 border border-slate-100 dark:border-white/5 space-y-6 shadow-2xl shadow-slate-200/60 dark:shadow-none relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full"></div>
                        <h3 className="text-teal-600 dark:text-teal-400 text-sm flex items-center gap-2" style={boldFont}>
                            <ExperimentOutlined className="p-1.5 bg-teal-100 dark:bg-teal-500/20 rounded-lg" /> مشخصات بیولوژیکی و واریته
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                            <div className="relative pr-8 border-r-2 border-emerald-500/20 group-hover:border-emerald-500/50 transition-colors">
                                <div className="absolute right-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.4)]"></div>
                                <span className="text-[10px] text-emerald-600 dark:text-emerald-500 font-bold uppercase tracking-[0.2em] block mb-2" style={boldFont}>پایه (Rootstock)</span>
                                <p className="text-2xl text-slate-800 dark:text-white mb-3 leading-relaxed" style={boldFont}>{rootstockPkg?.Tbl_plantVariety?.VarietyName || "---"}</p>
                                <div className="flex items-center gap-4 text-xs">
                                    <span className="text-slate-400 font-mono">SN: {rootstockPkg?.SerialNumber || "---"}</span>
                                    {rootstockPkg?.GerminationRate && <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-md font-bold text-[10px]">G: {rootstockPkg.GerminationRate}%</span>}
                                </div>
                            </div>

                            <div className="relative pr-8 border-r-2 border-blue-500/20 group-hover:border-blue-500/50 transition-colors">
                                <div className="absolute right-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.4)]"></div>
                                <span className="text-[10px] text-blue-600 dark:text-blue-500 font-bold uppercase tracking-[0.2em] block mb-2" style={boldFont}>پیوندک (Scion)</span>
                                <p className="text-2xl text-slate-800 dark:text-white mb-3 leading-relaxed" style={boldFont}>{scionPkg?.Tbl_plantVariety?.VarietyName || "---"}</p>
                                <div className="flex items-center gap-4 text-xs">
                                    <span className="text-slate-400 font-mono">SN: {scionPkg?.SerialNumber || "---"}</span>
                                    {scionPkg?.GerminationRate && <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-md font-bold text-[10px]">G: {scionPkg.GerminationRate}%</span>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Info */}
                <div className="pt-6 flex flex-col md:flex-row items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest gap-4">
                    <div className="flex items-center gap-2">
                        <CheckCircleFilled className="text-emerald-500 text-sm" />
                        <span style={boldFont}>تایید شده توسط بخش کنترل کیفی</span>
                    </div>
                    <div className="text-center md:text-left flex items-center gap-2">
                        <span className="text-emerald-700 dark:text-emerald-600 font-bold" style={boldFont}>فکور پیوند آریا</span>
                        <span className="opacity-50">FAKOOR PEYVAND ARYA &copy; {new Date().getFullYear()}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
