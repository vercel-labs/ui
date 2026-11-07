import { NextRequest } from "next/server"
import { beforeAll, describe, expect, test, vi } from "vitest"

let proxy: (request: NextRequest) => Response

beforeAll(async () => {
  vi.stubEnv("WEB_RELEASES", JSON.stringify({ "0": "0.5.0", latest: "0.5.0" }))
  vi.stubEnv("WEB_STYLE_RELEASES", JSON.stringify({ "0": "0.4.0", latest: "0.4.0" }))
  ;({ proxy } = await import("./proxy"))
})

const location = (pathname: string) =>
  proxy(new NextRequest(new URL(pathname, "https://ui-sdk.dev"))).headers.get("location")

describe("web release redirects", () => {
  test("sends the loader and its components to the newest release", () => {
    expect(location("/web.js")).toBe("https://ui-sdk.dev/web@0.5.0.js")
    expect(location("/web@0/tabs.js")).toBe("https://ui-sdk.dev/web@0.5.0/tabs.js")
  })

  test("sends the stylesheet to the newest release that has one", () => {
    expect(location("/web.css")).toBe("https://ui-sdk.dev/web@0.4.0.css")
    expect(location("/web@0.css")).toBe("https://ui-sdk.dev/web@0.4.0.css")
  })

  test("leaves a major with no release alone", () => {
    expect(location("/web@1.css")).toBeNull()
  })
})
