const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://mygreenhouses.ir"
).replace(/\/$/, "");
export function publicOrderUrl(id: number | string | null) {
  return `${siteUrl}/public/scan/orders/${id}`;
}
export function publicSeedPackageUrl(id: number | string) {
  return `${siteUrl}/public/scan/seed-package/${id}`;
}
