// Builds an Angular package in the current directory into `dist` with
// Angular's compiler in library mode, so the app's own Angular links it.
//   node ../../scripts/build/build-angular-package.mjs
import { execFileSync } from "node:child_process"
import { rmSync } from "node:fs"
import path from "node:path"
import { findPublishProblems } from "./publish-manifest.mjs"

const packageDir = process.cwd()
rmSync(path.join(packageDir, "dist"), { recursive: true, force: true })
execFileSync("npx", ["ngc", "-p", "tsconfig.json"], { stdio: "inherit" })

const problems = findPublishProblems(packageDir)
if (problems.length) {
  console.error(
    `The published package.json doesn't match the build:\n  ${problems.join("\n  ")}`
  )
  process.exitCode = 1
}
