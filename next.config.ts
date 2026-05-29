import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

/** Pin tracing to this app folder (parent Desktop/ has another package-lock.json). */
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  outputFileTracingRoot: projectRoot,
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
};

export default nextConfig;
