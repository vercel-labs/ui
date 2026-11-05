/** What one entry of `@ui-sdk/vue` gives a Nuxt app, as the build lists it in `entries.json`. */
interface NuxtEntry {
  /** The entry's specifier, like `@ui-sdk/vue/dialog`. */
  from: string
  /** The components the entry exports, like `DialogTrigger`. */
  components: string[]
  /** The other values the entry exports, like `createDialogController`. */
  imports: string[]
}

function nuxtRegistrations(entries: NuxtEntry[], prefix: string) {
  return {
    components: entries.flatMap(({ from, components }) =>
      components.map((name) => ({ name: `${prefix}${name}`, export: name, filePath: from })),
    ),
    imports: entries.filter(({ imports }) => imports.length).map(({ from, imports }) => ({ from, imports })),
  }
}

export { type NuxtEntry, nuxtRegistrations }
