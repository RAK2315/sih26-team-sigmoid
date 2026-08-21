import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // the Modern Baseline is read at runtime by /api/discover/analyse, so Vercel has to ship it
  outputFileTracingIncludes: {
    "/api/discover/analyse": ["./content/baseline.geojson"],
    "/attributions": ["./content/baseline.geojson"],
  },
};

export default nextConfig;
