import { build } from "esbuild"
import { readdirSync, readFileSync } from "node:fs"
import { createRequire } from "node:module"
import path from "node:path"
import { isRelative, withJsExtension } from "./specifiers.mjs"

/**
 * Builds a Solid package twice, the way Solid libraries ship: `dist/*.js`
 * holds JSX compiled for the browser by Solid's own compiler, for bundlers
 * that know nothing of Solid, and `dist/solid/*.{js,jsx}` keeps the JSX as
 * written, for the `solid` export condition, where the app's Solid plugin
 * compiles it for the client or the server. Types are stripped in both.
 * Like `transpile`, each source file becomes one module, and every import
 * stays external.
 */
async function transpileSolid({ packageDir, sourceDir, outDir }) {
  const { transform } = createRequire(path.join(packageDir, "package.json"))(
    "@solidjs/compiler"
  )
  const files = listSourceFiles(sourceDir)
  await build({
    entryPoints: files,
    outdir: outDir,
    outbase: sourceDir,
    bundle: true,
    plugins: [externalImports(".js"), compileJsx(transform)],
    format: "esm",
    platform: "neutral",
    target: "es2022",
    logLevel: "warning",
  })
  const preserved = {
    jsx: "preserve",
    format: "esm",
    platform: "neutral",
    target: "es2022",
    logLevel: "warning",
  }
  const solidDir = path.join(outDir, "solid")
  await build({
    ...preserved,
    entryPoints: files.filter((file) => file.endsWith(".tsx")),
    outdir: solidDir,
    outbase: sourceDir,
    outExtension: { ".js": ".jsx" },
    bundle: true,
    plugins: [externalImports(".jsx")],
  })
  await build({
    ...preserved,
    entryPoints: files.filter((file) => file.endsWith(".ts")),
    outdir: solidDir,
    outbase: sourceDir,
    bundle: true,
    plugins: [externalImports(".jsx")],
  })
}

function listSourceFiles(sourceDir) {
  return readdirSync(sourceDir, { recursive: true })
    .filter((file) => /\.tsx?$/.test(file) && !file.endsWith(".d.ts"))
    .map((file) => path.join(sourceDir, file))
}

// Compiles the JSX of `.tsx` sources with Solid's compiler, which leaves
// the TypeScript for esbuild to strip.
function compileJsx(transform) {
  return {
    name: "solid-jsx",
    setup(build) {
      build.onLoad({ filter: /\.tsx$/ }, ({ path: file }) => {
        const { code } = transform(readFileSync(file, "utf8"), {
          filename: file,
          generate: "dom",
          hydratable: true,
        })
        return { contents: code, loader: "ts" }
      })
    },
  }
}

// Marks every import external, and gives relative ones the extension of the
// file they'll resolve to in the output: `jsxExtension` for a `.tsx` source,
// `.js` for a `.ts` one.
function externalImports(jsxExtension) {
  return {
    name: "external-imports",
    setup(build) {
      build.onResolve(
        { filter: /.*/ },
        ({ kind, path: specifier, resolveDir }) => {
          if (kind === "entry-point") {
            return undefined
          }
          if (!isRelative(specifier)) {
            return { path: specifier, external: true }
          }
          const resolved = withJsExtension(specifier, resolveDir, [
            ".ts",
            ".tsx",
          ])
          const isJsx = /\.tsx$/.test(sourceOf(resolved, resolveDir))
          return {
            path: isJsx ? resolved.replace(/\.js$/, jsxExtension) : resolved,
            external: true,
          }
        }
      )
    },
  }
}

// The source file behind a resolved `./name.js` specifier.
function sourceOf(resolved, resolveDir) {
  const base = path.resolve(resolveDir, resolved.replace(/\.js$/, ""))
  return readdirSync(path.dirname(base)).find(
    (file) => file === `${path.basename(base)}.tsx`
  )
    ? `${base}.tsx`
    : `${base}.ts`
}

export { transpileSolid }
