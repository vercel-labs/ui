import { readFileSync } from "node:fs"
import { addComponent, addImportsSources, defineNuxtModule } from "nuxt/kit"
import type { NuxtModule } from "nuxt/schema"
import { type NuxtEntry, nuxtRegistrations } from "./registrations"

/**
 * The options of the Nuxt module, set under `uiSdk` in `nuxt.config.ts`.
 * @experimental
 */
interface ModuleOptions {
  /** Prepended to every component's name, so `"Ui"` registers `<UiDialogTrigger>`. Empty by default. */
  prefix?: string
}

/**
 * The Nuxt module: every part of every entry becomes an auto-imported
 * component, and the controllers and helpers become auto-imports in `<script>`.
 * Add `"@ui-sdk/vue"` to `modules` in `nuxt.config.ts`.
 * @experimental
 */
const uiSdk: NuxtModule<ModuleOptions> = defineNuxtModule<ModuleOptions>({
  meta: { name: "@ui-sdk/vue", configKey: "uiSdk", compatibility: { nuxt: ">=3.13" } },
  defaults: { prefix: "" },
  setup(options) {
    const { components, imports } = nuxtRegistrations(readEntries(), options.prefix ?? "")
    for (const component of components) addComponent(component)
    addImportsSources(imports)
  },
})

// The build writes it beside this module, from each entry's exports.
function readEntries() {
  return JSON.parse(readFileSync(new URL("./entries.json", import.meta.url), "utf8")) as NuxtEntry[]
}

export type { ModuleOptions }
export default uiSdk
