import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    serverActions: {
      allowedOrigins: ["test.mygreenhouses.ir", "localhost:3001"],
    },
  },
};

export default nextConfig;
