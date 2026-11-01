import { mkdirSync, mkdtempSync, utimesSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import path from "node:path"
import { expect, test, vi } from "vitest"
import { exampleModules } from "./example-modules"

const root = mkdtempSync(path.join(tmpdir(), "ui-sdk-example-modules-"))
vi.spyOn(process, "cwd").mockReturnValue(root)

function build(chunk: string, at: number) {
  const directory = path.join(root, "public/examples/react/.vite")
  mkdirSync(directory, { recursive: true })
  const file = path.join(directory, "manifest.json")
  writeFileSync(
    file,
    JSON.stringify({
      "button/react/demo.tsx": { file: chunk },
      "mount/react.ts": { file: "mount.js" },
    }),
  )
  utimesSync(file, at, at)
}

test("a rebuild's chunks replace the ones it deleted", () => {
  build("assets/demo-old.js", 1000)
  expect(exampleModules("button/demo", "react")).toContain("/examples/react/assets/demo-old.js")
  build("assets/demo-new.js", 2000)
  expect(exampleModules("button/demo", "react")).toEqual([
    "/examples/react/assets/demo-new.js",
    "/examples/react/mount.js",
  ])
})
