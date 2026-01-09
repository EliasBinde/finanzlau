import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
    typedRoutes: true,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "placekittens.com",
            },
        ],
    }
};

export default nextConfig;
