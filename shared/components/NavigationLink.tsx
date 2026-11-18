"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import NProgress from "nprogress";
import type { ComponentProps } from "react";

type Props = Omit<ComponentProps<typeof Link>, "href" | "onNavigate"> & {
  href: string;
  onNavigation?: () => void;
};

export default function NavigationLink({
  href,
  onNavigation,
  ...props
}: Props) {
  const pathname = usePathname();
  return (
    <Link
      {...props}
      href={href}
      onNavigate={() => {
        if (href.split(/[?#]/, 1)[0] !== pathname) NProgress.start();
        onNavigation?.();
      }}
    />
  );
}
