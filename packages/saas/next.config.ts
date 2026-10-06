import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  output: "export",
  turbopack: {},
};

export default nextConfig;
