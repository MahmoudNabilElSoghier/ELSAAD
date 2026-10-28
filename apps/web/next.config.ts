import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @elsaad/* packages ship TypeScript source (no build step) — compile them here.
  transpilePackages: ["@elsaad/shared", "@elsaad/api-client"],
  // TODO: cacheComponents / partialPrefetching removed — Next 16-only keys, invalid on 15.5
};

export default nextConfig;
