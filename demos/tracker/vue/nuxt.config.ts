import tailwindcss from "@tailwindcss/vite"
import { vueSourceLocations } from "../review/lib/vue-source-locations"

export default defineNuxtConfig({
  compatibilityDate: "2026-10-01",
  modules: ["@ui-sdk/vue/nuxt"],
  css: ["~/assets/css/main.css"],
  components: { dirs: [] },
  app: {
    head: {
      title: "Tracker",
      htmlAttrs: { lang: "en" },
      meta: [{ name: "description", content: "An issue tracker built with ui-sdk." }],
    },
  },
  build: { transpile: [/@ui-sdk\//, "tracker-data"] },
  typescript: { tsConfig: { compilerOptions: { noUncheckedIndexedAccess: false } } },
  nitro: { typescript: { tsConfig: { compilerOptions: { noUncheckedIndexedAccess: false } } } },
  vite: {
    plugins: [tailwindcss()],
    define: process.env.TRACKER_REVIEW ? { __VUE_PROD_DEVTOOLS__: "true" } : {},
  },
  vue: process.env.TRACKER_REVIEW
    ? { compilerOptions: { nodeTransforms: [vueSourceLocations(import.meta.dirname)] } }
    : {},
})
