// @vitest-environment node
import { expect, test } from "vitest"
import { withUiSdk } from "../src/next"

const own = { source: "/old", destination: "/new" }

test("leaves the config unchanged outside next dev", async () => {
  const config = { rewrites: async () => [own] }
  expect(await withUiSdk(config)("phase-production-build", undefined as never)).toBe(config)
})

test("proxies /__ui-sdk/* to the dev server before the app's own rewrites", async () => {
  const config = await withUiSdk({ rewrites: async () => [own] })(
    "phase-development-server",
    undefined as never,
  )
  const rewrites = await config.rewrites!()
  expect(rewrites).toEqual({
    beforeFiles: [
      {
        source: "/__ui-sdk/:path*",
        destination: expect.stringMatching(/^http:\/\/127\.0\.0\.1:\d+\/__ui-sdk\/:path\*$/),
        basePath: false,
      },
    ],
    afterFiles: [own],
  })
})
