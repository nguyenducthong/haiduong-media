import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "25mb",
    },
  },
  async redirects() {
    return [
      {
        source: "/doanhnghiep",
        destination: "/doanh-nghiep",
        permanent: true,
      },
      {
        source: "/doanhnghiep/:slug*",
        destination: "/doanh-nghiep/:slug*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
