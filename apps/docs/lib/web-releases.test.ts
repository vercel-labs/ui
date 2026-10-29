import { describe, expect, test } from "vitest"
import { compareVersions, newestByMajor } from "./web-releases.mjs"

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
})
