import solid from "@solidjs/vite-plugin"
import { svelte } from "@sveltejs/vite-plugin-svelte"
import vue from "@vitejs/plugin-vue"
import { existsSync, globSync, readFileSync } from "node:fs"
import { createRequire } from "node:module"
import path from "node:path"
import { defineConfig, type Plugin, type UserConfig } from "vite"

const solidFiles = [
  "**/packages/solid/**",
  "**/examples/*/solid/**",
  "**/examples/components/*/solid/**",
]
const builds: Record<
  string,
  { ext: string; config?: (ssr: boolean) => UserConfig }
> = {
  react: {
    ext: "tsx",
    config: (ssr) => (ssr ? {} : { plugins: [docsReact()] }),
  },
  vue: { ext: "vue", config: () => ({ plugins: [vue()] }) },
  svelte: { ext: "svelte", config: () => ({ plugins: [svelte()] }) },
  solid: {
    ext: "tsx",
    config: (ssr) => ({ plugins: [solid({ include: solidFiles, ssr })] }),
  },
  web: { ext: "ts" },
  angular: {
    ext: "ts",
    config: () => ({
      plugins: [compiledAngular()],
      define: { ngDevMode: "false", ngJitMode: "false" },
    }),
  },
}

type Babel = {
  transformAsync: (
    code: string,
    options: object
  ) => Promise<{ code?: string | null } | null>
}

// The Angular examples and adapter run as Angular's compiler wrote them, which
// `scripts/build.mjs` does first, into node_modules/.angular. Angular's own
// packages and other libraries ship partly compiled, so its linker finishes them.
function compiledAngular(): Plugin {
  const repo = path.resolve(import.meta.dirname, "..")
  const out = path.join(import.meta.dirname, "node_modules/.angular")
  return {
    name: "compiled-angular",
    enforce: "pre",
    load(id) {
      const file = path
        .join(out, path.relative(repo, id))
        .replace(/\.ts$/, ".js")
      if (id.startsWith(repo) && existsSync(file)) {
        return readFileSync(file, "utf8")
      }
    },
    async transform(code, id) {
      if (
        !id.includes("/node_modules/") ||
        !code.includes("\u0275\u0275ngDeclare")
      ) {
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

// The docs hand the React examples their own React, Next's copy, so a page runs
// one React. An import the docs' React lacks fails the build, not the page.
function docsReact(): Plugin {
  const docs = createRequire(new URL("../apps/docs/", import.meta.url))
  const provided = ["react", "react/jsx-runtime", "react-dom"]
  const prefix = "\0docs-react:"
  return {
    name: "docs-react",
    enforce: "pre",
    resolveId(source) {
      if (!/^react(-dom)?(\/|$)/.test(source)) {
        return
      }
      if (!provided.includes(source)) {
        this.error(`The docs don't hand ${source} to the examples.`)
      }
      return { id: prefix + source, moduleSideEffects: false }
    },
    load(id) {
      if (!id.startsWith(prefix)) {
        return
      }
      const source = id.slice(prefix.length)
      const names = Object.keys(docs(`next/dist/compiled/${source}`))
      return [
        `const m = globalThis.__docsReact[${JSON.stringify(source)}]`,
        "export default m",
        `export const { ${names.join(", ")} } = m`,
      ].join("\n")
    },
  }
}

const only = process.env.EXAMPLES_ONLY?.split(",")

const examplesFolder = import.meta.dirname
const sharedStylesheets = ["styles/tokens.css", "styles/base.css"]
const stylesheets = new Map(
  globSync(["*/*.css", "components/*/*.css"])
    .filter((file) => !sharedStylesheets.includes(file))
    .sort()
    .map((file) => [path.basename(file, ".css"), file])
)

// Lists each example's stylesheets, so a docs page loads only those: the
// shared ones, its folder's, and those of every component bundled into it,
// like Calendar's in a date picker, or that its own primitives are named after.
const listStylesheets = (): Plugin => ({
  name: "list-stylesheets",
  generateBundle(_, bundle) {
    const chunks = new Map(
      Object.values(bundle).flatMap((file) =>
        file.type === "chunk" ? [[file.fileName, file] as const] : []
      )
    )
    const styles: Record<string, string[]> = {}
    for (const entry of chunks.values()) {
      if (!entry.isEntry || entry.name === "mount") {
        continue
      }
      const names = new Set([entry.name.split("/")[0]])
      const visited = new Set<string>()
      const visit = (fileName: string) => {
        const chunk = chunks.get(fileName)
        if (!chunk || visited.has(fileName)) {
          return
        }
        visited.add(fileName)
        for (const id of chunk.moduleIds) {
          const [, component, file] =
            id.match(
              /\/packages\/\w+\/src\/(?:components\/([\w-]+)\/)?([\w-]+)/
            ) ?? []
          if (file) {
            names.add(component ?? file).add(file)
          } else if (id.startsWith(examplesFolder)) {
            const code = this.getModuleInfo(id)?.code ?? ""
            for (const [, name] of code.matchAll(/\bname: "([\w-]+)"/g)) {
              names.add(name)
            }
          }
        }
        chunk.imports.forEach(visit)
      }
      visit(entry.fileName)
      styles[entry.name] = [
        ...sharedStylesheets,
        ...[...stylesheets].flatMap(([name, file]) =>
          names.has(name) ? [file] : []
        ),
      ]
    }
    this.emitFile({
      type: "asset",
      fileName: "styles.json",
      source: JSON.stringify(styles),
    })
  },
})

export default defineConfig(({ mode, isSsrBuild = false }) => {
  if (mode === "styles") {
    return {
      build: {
        outDir: "../apps/docs/public/examples/styles",
        emptyOutDir: true,
        rolldownOptions: {
          input: [...sharedStylesheets, ...stylesheets.values()],
          output: { assetFileNames: "[name]-[hash][extname]" },
        },
        manifest: "manifest.json",
      },
    }
  }

  const framework = mode in builds ? mode : "vue"
  const { ext } = builds[framework]
  const config = builds[framework].config?.(isSsrBuild) ?? {}
  const define = {
    ...config.define,
    "process.env.NODE_ENV": JSON.stringify("production"),
  }

  if (isSsrBuild) {
    return {
      ...config,
      define,
      ssr: { noExternal: true },
      build: {
        outDir: `node_modules/.prerender/${framework}`,
        emptyOutDir: true,
        rolldownOptions: {
          input: { [framework]: `prerender/${framework}.ts` },
          onLog: (level, log, handler) =>
            log.code !== "MODULE_LEVEL_DIRECTIVE" && handler(level, log),
        },
      },
    }
  }

  const entries = Object.fromEntries(
    globSync([`*/${framework}/*.${ext}`, `components/*/${framework}/*.${ext}`])
      .map((file) => [
        file
          .replace(/^components\//, "")
          .replace(new RegExp(`/${framework}/(.+)\\.${ext}$`), "/$1"),
        file,
      ])
      .filter(([name]) => !only || only.includes(name.split("/")[0]))
  )

  return {
    ...config,
    plugins: [...(config.plugins ?? []), listStylesheets()],
    define,
    build: {
      outDir: `../apps/docs/public/examples/${framework}`,
      emptyOutDir: true,
      lib: {
        entry: { ...entries, mount: `mount/${framework}.ts` },
        formats: ["es"],
        fileName: (_, name) => `${name}-[hash].js`,
      },
      rolldownOptions: {
        output: { minify: true, chunkFileNames: "chunks/[name]-[hash].js" },
        onLog: (level, log, handler) =>
          log.code !== "MODULE_LEVEL_DIRECTIVE" && handler(level, log),
      },
      cssCodeSplit: false,
      manifest: "manifest.json",
    },
  }
})
