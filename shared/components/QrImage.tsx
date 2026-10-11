import Image from "next/image";
import type { ComponentProps } from "react";

/** QR data URLs are already generated locally and must remain pixel sharp. */
export default function QrImage({
  alt,
  ...props
}: Omit<ComponentProps<typeof Image>, "width" | "height" | "unoptimized">) {
  return <Image alt={alt} width={300} height={300} unoptimized {...props} />;
}
