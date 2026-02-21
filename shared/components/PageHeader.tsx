import React from "react";

interface PageHeaderProps {
    title: string;
    icon?: React.ReactNode;
    subtitle?: string;
    action?: React.ReactNode;
}

export default function PageHeader({ title, icon, subtitle, action }: PageHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 mb-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl shadow-sm transition-all duration-300">
            <div className="flex items-center gap-4">
                {icon && (
                    <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 flex items-center justify-center text-xl shadow-sm">
                        {icon}
                    </div>
                )}
                <div className="flex flex-col">
                    <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">{title}</h1>
                    {subtitle && (
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>
                    )}
                </div>
            </div>
            {action && (
                <div className="flex items-center">
                    {action}
                </div>
            )}
        </div>
    );
}
