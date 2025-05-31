import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  //allow all image domain
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
