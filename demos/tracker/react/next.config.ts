import type { NextConfig } from "next"
import path from "node:path"

const config: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  transpilePackages: ["@ui-sdk/core", "@ui-sdk/react", "tracker-data"],
  experimental: {
    // The store lives in memory, so regenerated pages stay in memory too and a
    // restart serves the seed data again instead of pages from the last run.
    isrFlushToDisk: false,
    turbopackRustReactCompiler: true,
  },
  turbopack: {
    root: path.resolve(import.meta.dirname, "../../.."),
    rules: process.env.TRACKER_REVIEW
      ? {
          "*.tsx": {
            loaders: [
              {
                loader: path.resolve(
                  import.meta.dirname,
                  "../review/lib/source-locations-loader.mjs"
                ),
                options: { root: import.meta.dirname },
              },
            ],
          },
        }
      : {},
  },
}

export default config
