import solid from "@solidjs/vite-plugin"
import tailwindcss from "@tailwindcss/vite"
import { fileURLToPath } from "node:url"
import { defineConfig, type Plugin } from "vite"
import { jsxLocations } from "../review/lib/source-locations.mjs"

const sourceLocations: Plugin = {
  name: "review-source-locations",
  enforce: "pre",
  transform(code, id) {
    if (id.endsWith(".tsx")) return jsxLocations(code, id, import.meta.dirname)
  },
}

export default defineConfig({
  plugins: [...(process.env.TRACKER_REVIEW ? [sourceLocations] : []), solid(), tailwindcss()],
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
})
