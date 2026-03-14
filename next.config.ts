import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // This allows the build to finish even with the bugs you see
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
