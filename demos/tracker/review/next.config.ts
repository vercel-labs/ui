import type { NextConfig } from "next"
import path from "node:path"
import { availableFrameworks, frameworkCookie, trackerOrigin, type Framework } from "./lib/frameworks"

const tracker = (framework: Framework) => ({
  source: "/:path*",
  destination: `${trackerOrigin(framework)}/:path*`,
  basePath: false as const,
})

const config: NextConfig = {
  basePath: "/review",
  devIndicators: false,
  agentRules: false,
  reactStrictMode: true,
  transpilePackages: ["@ui-sdk/core", "@ui-sdk/react"],
  turbopack: { root: path.resolve(import.meta.dirname, "../../..") },
  outputFileTracingIncludes: {
    "/": [
      "../../../demos/tracker/*/*.{css,html,js,json,md,mjs,ts}",
      "../../../demos/tracker/*/{app,components,lib,pages,server,src}/**/*",
      "../../../packages/*/src/**/*",
    ],
  },
  async rewrites() {
    const available = availableFrameworks()
    return {
      fallback: [
        ...available.map((framework) => ({
          ...tracker(framework),
          has: [{ type: "cookie" as const, key: frameworkCookie, value: framework }],
        })),
        tracker(available[0] ?? "svelte"),
      ],
    }
  },
}

export default config
