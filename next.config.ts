import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    qualities: [100, 75],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "rhythmx.tushcode.com",
      },
    ],
  },
  allowedDevOrigins: ["10.13.131.78"],
};

export default nextConfig;
