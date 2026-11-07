// Builds the web components for pages without a bundler into `browser/`:
//
//   browser/web.js           Defines each component the first time its tags appear.
//   browser/web/tabs.js      Defines one component's elements.
//   browser/web/chunks/*.js  Code the components share, loaded once.
//
// A page loads `web.js`, or one file per component, with a module script
// tag. The site serves this folder at `/web@<version>.js` and
// `/web@<version>/`, and the loader finds the components beside its own URL,
// so the folder works under any name that keeps the pair.
//
//   node ../../scripts/build/browser.mjs   From packages/web, after its build.
import { cpSync, readdirSync, rmSync } from "node:fs"
import { createRequire } from "node:module"
import path from "node:path"
import { rolldown } from "rolldown"

const packageDir = process.cwd()
const outDir = path.join(packageDir, "browser")
const entries = readdirSync(path.join(packageDir, "src/entries"))
  .filter((file) => file.endsWith(".ts"))
  .map((file) => file.replace(/\.ts$/, ""))
  .sort()

rmSync(outDir, { recursive: true, force: true })

// Rolldown splits by what each entry uses, so a page with Tabs loads Tabs'
// code and the shared kernel, never Menu's. esbuild's splitting assigns
// whole modules to chunks, and core's renderer module re-exports every
// component's helpers, so its Tabs came out about three times larger.
await write(
  {
    input: Object.fromEntries(
      entries.map((entry) => [entry, path.join(packageDir, "src/entries", `${entry}.ts`)]),
    ),
  },
  { dir: path.join(outDir, "web"), entryFileNames: "[name].js", chunkFileNames: "chunks/[hash].js" },
)

const loader = "\0ui-sdk-loader"
await write(
  {
    input: loader,
    plugins: [
      {
        name: "loader",
        resolveId: (id) => (id === loader ? id : undefined),
        load: (id) =>
          id === loader
            ? [
                `import { autoload, componentsBase } from ${JSON.stringify(path.join(packageDir, "src/autoload.ts"))}`,
                `autoload(componentsBase(import.meta.url), ${JSON.stringify(entries)})`,
              ].join("\n")
            : undefined,
      },
    ],
  },
  { file: path.join(outDir, "web.js") },
)

cpSync(
  createRequire(path.join(packageDir, "package.json")).resolve("@ui-sdk/core/web.css"),
  path.join(outDir, "web.css"),
)

async function write(input, output) {
  const bundle = await rolldown({ cwd: packageDir, platform: "browser", logLevel: "warn", ...input })
  await bundle.write({ format: "esm", minify: true, ...output })
  await bundle.close()
}
