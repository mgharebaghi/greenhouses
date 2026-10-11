"use client";

import { usePathname, useSearchParams } from "next/navigation";
import NProgress from "nprogress";
import { useEffect } from "react";

// Configure NProgress with aggressive settings for visibility
NProgress.configure({
  showSpinner: false,
  trickleSpeed: 200,
  minimum: 0.3, // Start with 30% progress to be clearly visible
  easing: "ease",
  speed: 500,
});

export default function NavigationProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Force done on path change
    NProgress.done();
  }, [pathname, searchParams]);

  return null; // This component doesn't render anything visual itself
}
