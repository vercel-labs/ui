import nodeAdapter from "@sveltejs/adapter-node"
import vercelAdapter from "@sveltejs/adapter-vercel"
import { sveltekit } from "@sveltejs/kit/vite"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [
    tailwindcss(),
    sveltekit({
      adapter: process.env.VERCEL ? vercelAdapter() : nodeAdapter(),
      dynamicCompileOptions: ({ filename }) =>
        filename.includes("/node_modules/") ? undefined : { runes: true },
    }),
  ],
  ssr: { noExternal: [/^@ui-sdk\//, "tracker-data"] },
})
