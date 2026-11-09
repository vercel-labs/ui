import path from "node:path"

// Source files are read at build time to show them, never bundled, so Turbopack
// skips tracing paths under the repository root. Without it, the examples'
// path pattern matched every file in the repository.
const repoRoot = path.resolve(
  /* turbopackIgnore: true */ process.cwd(),
  "../.."
)

export { repoRoot }
