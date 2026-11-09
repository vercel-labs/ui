import { beforeEach, describe, expect, it } from "vitest"
import { createRegistry } from "../lib/registry"

const files: Record<string, string> = {
  "packages/@ui-sdk/react/index.json": JSON.stringify({
    name: "@ui-sdk/react",
    "dist-tags": { latest: "0.0.0-1.gabc" },
    versions: {
      "0.0.0-1.gabc": {
        name: "@ui-sdk/react",
        dist: { tarball: "@ui-sdk/react/-/react-0.0.0-1.gabc.tgz" },
      },
    },
  }),
  "packages/@ui-sdk/react/react-0.0.0-1.gabc.tgz": "tarball bytes",
}
const downloads: { name: string; version: string }[] = []
const handle = createRegistry({
  base: "",
  read: async (pathname) =>
    pathname in files ? new Response(files[pathname]).body : null,
  onDownload: async ({ name, version }) => {
    downloads.push({ name, version })
  },
})

function request(path: string, authorization?: string) {
  return handle(
    new Request(
      `https://registry.test${path}`,
      authorization ? { headers: { authorization } } : {}
    )
  )
}

describe("registry", () => {
  beforeEach(() => {
    downloads.length = 0
  })

  it("serves anyone, with or without an old token", async () => {
    expect((await request("/@ui-sdk%2freact")).status).toBe(200)
    expect(
      (await request("/@ui-sdk%2freact", "Bearer uisdk_alice_secret")).status
    ).toBe(200)
    expect(
      (
        await request(
          "/@ui-sdk/react/-/react-0.0.0-1.gabc.tgz",
          "Bearer anything"
        )
      ).status
    ).toBe(200)
  })

  it("serves a package's versions with tarball URLs under its own path", async () => {
    const response = await request("/@ui-sdk%2freact")
    const body = (await response.json()) as {
      "dist-tags": { latest: string }
      versions: Record<string, { dist: { tarball: string } }>
    }
    expect(body["dist-tags"].latest).toBe("0.0.0-1.gabc")
    expect(body.versions["0.0.0-1.gabc"].dist.tarball).toBe(
      "https://registry.test/@ui-sdk/react/-/react-0.0.0-1.gabc.tgz"
    )
  })

  it("reads the package name with an unescaped slash too", async () => {
    expect((await request("/@ui-sdk/react")).status).toBe(200)
  })

  it("streams a tarball", async () => {
    const response = await request("/@ui-sdk/react/-/react-0.0.0-1.gabc.tgz")
    expect(await response.text()).toBe("tarball bytes")
  })

  it("reports which version was downloaded", async () => {
    await request("/@ui-sdk/react/-/react-0.0.0-1.gabc.tgz")
    expect(downloads).toEqual([{ name: "react", version: "0.0.0-1.gabc" }])
  })

  it("reports nothing for version lists or missing tarballs", async () => {
    await request("/@ui-sdk%2freact")
    await request("/@ui-sdk/react/-/react-9.9.9.tgz")
    expect(downloads).toEqual([])
  })

  it("serves nothing outside the package layout", async () => {
    expect(
      (await request("/@ui-sdk/react/-/..%2f..%2findex.json")).status
    ).toBe(404)
    expect((await request("/@other%2freact")).status).toBe(404)
    expect(
      (await request("/@ui-sdk/react/-/core-0.0.0-1.gabc.tgz")).status
    ).toBe(404)
    expect((await request("/@ui-sdk%E0react")).status).toBe(404)
  })

  it("shows a plain Not Found at the root", async () => {
    for (const response of [await request(""), await request("/")]) {
      expect(response.status).toBe(404)
      expect(await response.text()).toBe("Not Found")
    }
  })
})
