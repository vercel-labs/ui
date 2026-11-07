import { describe, expect, it } from "vitest"
import { createDocsProxy } from "../lib/docs-proxy"

const sent: { url: string; bypass: string | null }[] = []
const proxy = createDocsProxy({
  origin: "https://docs.test",
  bypass: "secret",
  paths: ["/web.js", "/web@*"],
  fetch: async (input, init) => {
    const url = String(input)
    sent.push({ url, bypass: new Headers(init?.headers).get("x-vercel-protection-bypass") })
    if (url === "https://docs.test/web.js")
      return new Response(null, { status: 307, headers: { location: "https://docs.test/web@1.2.0.js" } })
    return new Response("export {}", {
      headers: { "content-type": "text/javascript", "access-control-allow-origin": "*", "set-cookie": "a=b" },
    })
  },
})

const request = (path: string) => proxy(new Request(`https://registry.test${path}`))

describe("docs proxy", () => {
  it("serves only the listed paths", async () => {
    expect(await request("/@ui-sdk%2freact")).toBeNull()
    expect(await request("/web/tabs.js")).toBeNull()
    expect(await request("/web@1/tabs.js")).not.toBeNull()
  })

  it("fetches from the docs site with the bypass secret", async () => {
    sent.length = 0
    const response = await request("/web@1.2.0.js")
    expect(sent).toEqual([{ url: "https://docs.test/web@1.2.0.js", bypass: "secret" }])
    expect(await response?.text()).toBe("export {}")
    expect(response?.headers.get("access-control-allow-origin")).toBe("*")
    expect(response?.headers.get("set-cookie")).toBeNull()
  })

  it("points redirects back at its own host", async () => {
    const response = await request("/web.js")
    expect(response?.status).toBe(307)
    expect(response?.headers.get("location")).toBe("https://registry.test/web@1.2.0.js")
  })

  it("hides the paths without a secret", async () => {
    const closed = createDocsProxy({ origin: "https://docs.test", bypass: undefined, paths: ["/web.js"] })
    expect((await closed(new Request("https://registry.test/web.js")))?.status).toBe(404)
  })
})
