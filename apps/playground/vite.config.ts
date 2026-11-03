import { svelte } from "@sveltejs/vite-plugin-svelte"
import react from "@vitejs/plugin-react"
import vue from "@vitejs/plugin-vue"
import solid from "@solidjs/vite-plugin"
import tailwind from "@tailwindcss/vite"
import { defineConfig } from "vite"
import { ssrFixtures } from "./ssr-plugin"
import { solidSsr } from "./solid-ssr.ts"

// Solid and React both compile .tsx, so each plugin takes its own files.
const solidFiles = ["**/packages/solid/**", "**/fixtures/*/solid*.tsx", "**/examples/*/solid/**", "**/examples/components/*/solid/**"]

export default defineConfig({
  plugins: [
    react({ exclude: solidFiles }),
    vue(),
    svelte(),
    solid({ include: solidFiles, ssr: true }),
    solidSsr(),
    tailwind(),
    ssrFixtures(),
  ],
})
