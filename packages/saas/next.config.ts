import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbo: {},
  },
  images: {
    unoptimized: true,
  },
  output: "export",
};

export default nextConfig;
