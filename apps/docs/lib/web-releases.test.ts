import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import path from "node:path"
import { describe, expect, test } from "vitest"
import { compareVersions, newestByMajor, newestRelease, releasesIn } from "./web-releases.mjs"

describe("web releases", () => {
  test("orders versions by semver precedence", () => {
    const versions = ["1.10.0", "1.2.0", "1.0.0-beta.2", "1.0.0", "1.0.0-beta.10", "1.0.0-alpha"]
    expect(versions.sort(compareVersions)).toEqual([
      "1.0.0-alpha",
      "1.0.0-beta.2",
      "1.0.0-beta.10",
      "1.0.0",
      "1.2.0",
      "1.10.0",
    ])
  })

  test("points each major at its newest release, past prereleases", () => {
    expect(newestByMajor(["1.2.0", "1.10.0", "1.11.0-beta.1", "2.0.0"])).toEqual(
      new Map([
        ["1", "1.10.0"],
        ["2", "2.0.0"],
      ]),
    )
  })

  test("points a major with only prereleases at the newest one", () => {
    const stamps = ["0.0.0-20261029071500.gb318f40a", "0.0.0-20261101090000.g1234abcd"]
    expect(newestByMajor(stamps)).toEqual(new Map([["0", stamps[1]]]))
  })

  test("lists only the releases that have a file of the extension", () => {
    const dir = mkdtempSync(path.join(tmpdir(), "web-releases-"))
    try {
      for (const file of [
        "web@0.4.0.js",
        "web@0.5.0.js",
        "web@0.5.0.css",
        "web@0.6.0-g1dc2c96.css",
        "web.css",
      ]) {
        writeFileSync(path.join(dir, file), "")
      }
      mkdirSync(path.join(dir, "web@0.5.0"))
      expect(releasesIn(dir).sort(compareVersions)).toEqual(["0.4.0", "0.5.0"])
      expect(releasesIn(dir, ".css").sort(compareVersions)).toEqual(["0.5.0", "0.6.0-g1dc2c96"])
    } finally {
      rmSync(dir, { recursive: true })
    }
  })

  test("points latest at the newest release of all, past prereleases", () => {
    expect(newestRelease(["0.9.0", "1.0.0-beta.1", "0.10.0"])).toBe("0.10.0")
    expect(newestRelease(["0.9.0", "1.0.0"])).toBe("1.0.0")
  })
})
