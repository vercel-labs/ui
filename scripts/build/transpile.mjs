import { build } from "esbuild"
import { readFileSync, readdirSync, writeFileSync } from "node:fs"
import path from "node:path"
import { isRelative, withJsExtension } from "./specifiers.mjs"

/**
 * Compiles every file in `src` to one ES module in `dist`, keeping the module
 * graph as it is. A one-to-one build keeps singletons like the layer stack in
 * one module, and leaves `#dev` and framework imports for the consumer's
 * bundler to resolve.
 */
async function transpile({ sourceDir, outDir, useClient, serverModules = [] }) {
  const { metafile } = await build({
    entryPoints: listSourceFiles(sourceDir),
    outdir: outDir,
    outbase: sourceDir,
    // Bundling only so the plugin below sees every import. It marks all of
    // them external, so each output file holds just its own source.
    bundle: true,
    plugins: [externalImports()],
    format: "esm",
    platform: "neutral",
    target: "es2022",
    jsx: "automatic",
    metafile: true,
    logLevel: "warning",
  })
  if (!useClient) {
    return
  }
  // Every module marks itself as client code for React Server Components, so
  // any entry a Server Component imports is a client boundary, except
  // `serverModules`: those use no hooks or context, and under "use client"
  // every export, re-exports included, would become a client reference a
  // Server Component can't call.
  for (const [output, { entryPoint }] of Object.entries(metafile.outputs)) {
    if (
      !entryPoint ||
      serverModules.includes(path.relative(sourceDir, entryPoint))
    ) {
      continue
    }
    writeFileSync(output, `"use client";\n${readFileSync(output, "utf8")}`)
  }
}

function listSourceFiles(sourceDir) {
  return readdirSync(sourceDir, { recursive: true })
    .filter((file) => /\.tsx?$/.test(file) && !file.endsWith(".d.ts"))
    .map((file) => path.join(sourceDir, file))
}

function externalImports() {
  return {
    name: "external-imports",
    setup(build) {
      build.onResolve(
        { filter: /.*/ },
        ({ kind, path: specifier, resolveDir }) => {
          if (kind === "entry-point") {
            return undefined
          }
          return {
            path: isRelative(specifier)
              ? withJsExtension(specifier, resolveDir, [".ts", ".tsx"])
              : specifier,
            external: true,
          }
        }
      )
    },
  }
}

export { transpile }
