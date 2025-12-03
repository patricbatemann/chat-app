import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination:
          process.env.NODE_ENV === "production"
            ? `${process.env.SERVER_URL || "http://backend-service"}/:path*`
            : "http://localhost:5000/:path*",
      },
    ];
  },
  /* config options here */
};

export default nextConfig;
