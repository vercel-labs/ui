import { existsSync } from "node:fs"
import path from "node:path"
import { repoRoot } from "./repo-root"

// Components live in examples/components; demo groups like behaviors sit at the top.
function exampleFolder(name: string) {
  const nested = path.join(repoRoot, "examples/components", name)
  return existsSync(nested) ? nested : path.join(repoRoot, "examples", name)
}

export { exampleFolder }
