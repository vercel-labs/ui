import tailwindcss from "@tailwindcss/vite"
import { uiSdk } from "@ui-sdk/core/vite"
import { defineConfig, type Plugin } from "vite"
import { litLocations } from "../review/lib/source-locations.mjs"

const sourceLocations: Plugin = {
  name: "review-source-locations",
  transform(code, id) {
    if (id.endsWith(".ts")) return litLocations(code, id, import.meta.dirname)
  },
}

export default defineConfig({
  plugins: [...(process.env.TRACKER_REVIEW ? [sourceLocations] : []), tailwindcss(), uiSdk()],
})
