import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @elsaad/shared ships TypeScript source (no build step) — compile it here.
  transpilePackages: ["@elsaad/shared"],
  // TODO: cacheComponents / partialPrefetching removed — Next 16-only keys, invalid on 15.5
};

export default nextConfig;
