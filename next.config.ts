import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["mygreenhouses.ir", "www.mygreenhouses.ir", "localhost:3000"],
    },
  },
};

export default nextConfig;
