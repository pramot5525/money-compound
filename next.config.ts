import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
const repoName = "money-compound"; // เปลี่ยนเป็นชื่อ repo ใน GitHub

const nextConfig: NextConfig = {
  output: "export",
  basePath: isProd ? `/${repoName}` : "",
  assetPrefix: isProd ? `/${repoName}/` : "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
