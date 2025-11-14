import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  experimental: {
    turbo: {},
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
