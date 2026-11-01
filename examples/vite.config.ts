import solid from "@solidjs/vite-plugin"
import { svelte } from "@sveltejs/vite-plugin-svelte"
import vue from "@vitejs/plugin-vue"
import { globSync } from "node:fs"
import { defineConfig, type UserConfig } from "vite"

const solidFiles = ["**/packages/solid/**", "**/examples/*/solid/**"]
const builds: Record<string, { ext: string; config?: UserConfig }> = {
  react: { ext: "tsx" },
  vue: { ext: "vue", config: { plugins: [vue()] } },
  svelte: { ext: "svelte", config: { plugins: [svelte()] } },
  solid: { ext: "tsx", config: { plugins: [solid({ include: solidFiles })] } },
  web: { ext: "ts" },
}

const only = process.env.EXAMPLES_ONLY?.split(",")

export default defineConfig(({ mode }) => {
  const framework = mode in builds ? mode : "vue"
  const { ext, config = {} } = builds[framework]
  const entries = Object.fromEntries(
    globSync(`*/${framework}/*.${ext}`)
      .filter((file) => !only || only.includes(file.split("/")[0]))
      .map((file) => [file.replace(new RegExp(`/${framework}/(.+)\\.${ext}$`), "/$1"), file]),
  )

  return {
    ...config,
    define: { ...config.define, "process.env.NODE_ENV": JSON.stringify("production") },
    build: {
      outDir: `../apps/docs/public/examples/${framework}`,
      emptyOutDir: true,
      manifest: true,
      lib: {
        entry: { ...entries, mount: `mount/${framework}.ts` },
        formats: ["es"],
        fileName: (_, name) => `${name}.js`,
      },
      rolldownOptions: {
        output: { minify: true, chunkFileNames: "chunks/[name]-[hash].js" },
        onLog: (level, log, handler) => log.code !== "MODULE_LEVEL_DIRECTIVE" && handler(level, log),
      },
      cssCodeSplit: false,
    },
  }
})
