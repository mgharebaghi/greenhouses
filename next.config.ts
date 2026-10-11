import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Prisma's custom generated client performs dynamic filesystem lookups.
  // Keep workstation archives and secrets out of the deployment trace.
  outputFileTracingExcludes: {
    "/*": [
      "**/*.tar",
      "**/*.tar.gz",
      "**/*.tgz",
      "**/.env",
      "**/.env.*",
      "**/docker.local.env",
      "**/.git/**",
      "**/.codex/**",
      "**/.agents/**",
      "./tests/**",
      "./scripts/**",
      "./docs/**",
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["test.mygreenhouses.ir", "localhost:3001"],
    },
  },
};

export default nextConfig;
