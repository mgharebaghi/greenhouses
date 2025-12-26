"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

// Configure NProgress (optional: these styles are overridden by globals.css, but good to have defaults)
NProgress.configure({ showSpinner: false });

export default function NavigationProgressBar() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        // When pathname or searchParams change, it means navigation completed.
        // So we stop the progress bar.
        NProgress.done();
    }, [pathname, searchParams]);

    return null; // This component doesn't render anything visual itself
}
