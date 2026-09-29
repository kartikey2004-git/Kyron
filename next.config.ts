import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Produces .next/standalone — a minimal, self-contained server bundle
  // used by the Dockerfile. Has no effect on `next dev` or the Vercel build.
  output: "standalone",
  allowedDevOrigins: [
    "7478-2401-4900-8847-9343-34f1-79c4-20f7-d98.ngrok-free.app",
    "localhost:3000",
    "https://kyron-review.vercel.app"
  ],
};

export default nextConfig;
