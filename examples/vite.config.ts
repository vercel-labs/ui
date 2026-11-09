import solid from "@solidjs/vite-plugin"
import { svelte } from "@sveltejs/vite-plugin-svelte"
import vue from "@vitejs/plugin-vue"
import { globSync } from "node:fs"
import { createRequire } from "node:module"
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

export default defineConfig(({ mode, isSsrBuild = false }) => {
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
