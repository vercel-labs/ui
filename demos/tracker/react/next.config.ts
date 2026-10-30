import type { NextConfig } from "next"
import path from "node:path"

const config: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@ui-sdk/core", "@ui-sdk/react", "tracker-data"],
  turbopack: {
    root: path.resolve(import.meta.dirname, "../../.."),
    rules: process.env.TRACKER_REVIEW
      ? {
          "*.tsx": {
            loaders: [
              {
                loader: path.resolve(import.meta.dirname, "../review/lib/source-locations-loader.mjs"),
                options: { root: import.meta.dirname },
              },
            ],
          },
        }
      : {},
  },
}

export default config
