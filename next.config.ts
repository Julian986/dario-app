import type { NextConfig } from "next";
import path from "path";

const projectRoot = path.resolve(__dirname);

const nextConfig: NextConfig = {
  // Hay un package-lock.json en C:\Users\julis que confunde a Next.
  outputFileTracingRoot: projectRoot,
  turbopack: {
    root: projectRoot,
  },
  async redirects() {
    return [
      { source: "/idea", destination: "/app", permanent: false },
      { source: "/conversacion", destination: "/app", permanent: false },
    ];
  },
};

export default nextConfig;
