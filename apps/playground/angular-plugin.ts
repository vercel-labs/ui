import { existsSync, readFileSync } from "node:fs"
import path from "node:path"
import type { Plugin } from "vite"

type Babel = {
  transformAsync: (
    code: string,
    options: object
  ) => Promise<{ code?: string | null } | null>
}

// The Angular fixtures and adapter run as Angular's compiler wrote them, which
// the `dev` and `build` scripts do first, into node_modules/.angular. Angular's
// own packages ship partly compiled, so its linker finishes them.
function compiledAngular(): Plugin {
  const repo = path.resolve(import.meta.dirname, "../..")
  const out = path.join(import.meta.dirname, "node_modules/.angular")
  return {
    name: "compiled-angular",
    enforce: "pre",
    load(id) {
      const source = id.split("?")[0]
      const file = path
        .join(out, path.relative(repo, source))
        .replace(/\.ts$/, ".js")
      if (
        source.startsWith(repo) &&
        source.endsWith(".ts") &&
        !source.includes("/node_modules/") &&
        existsSync(file)
      ) {
        this.addWatchFile(file)
        return readFileSync(file, "utf8")
      }
    },
    async transform(code, id) {
      if (!id.includes("/node_modules/") || !code.includes("ɵɵngDeclare")) {
        return
      }
      const [{ transformAsync }, { default: linker }] = await Promise.all([
        // Babel comes with Angular's linker and ships no types.
        import("@babel/core" as string) as Promise<Babel>,
        import("@angular/compiler-cli/linker/babel"),
      ])
      const result = await transformAsync(code, {
        filename: id,
        plugins: [linker],
        babelrc: false,
        configFile: false,
        compact: false,
      })
      return result?.code
    },
  }
}

export { compiledAngular }
