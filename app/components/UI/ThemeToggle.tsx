"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { MoonOutlined, SunOutlined } from "@ant-design/icons";

export default function ThemeToggle() {
    const { theme, setTheme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse"></div>
        );
    }

    const isDark = resolvedTheme === "dark";

    return (
        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="group relative h-10 w-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-400 dark:hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-all duration-300 flex items-center justify-center text-slate-500 dark:text-slate-400 cursor-pointer overflow-hidden"
            aria-label="تغییر تم"
        >
            <div className="absolute inset-0 bg-emerald-50 dark:bg-emerald-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            <div className="relative z-10 transition-transform duration-500 rotate-0 dark:rotate-180">
                {isDark ? (
                    <MoonOutlined className="text-lg text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                ) : (
                    <SunOutlined className="text-lg group-hover:text-amber-500 transition-colors" />
                )}
            </div>
        </button>
    );
}
