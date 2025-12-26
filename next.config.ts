import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Increase timeout for static generation
  staticPageGenerationTimeout: 120,
  experimental: {
    serverActions: {
      allowedOrigins: ["mygreenhouses.ir", "www.mygreenhouses.ir", "localhost:3000"],
    },
  },
};

export default nextConfig;
