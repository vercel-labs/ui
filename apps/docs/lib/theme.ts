import { createColorScheme, createLocalStorage } from "@ui-sdk/core"

// The site's color scheme, shown on <html> as `data-color-scheme`, which the
// stylesheet's colors follow. It's kept under "theme", the key the site used
// before, so readers keep what they chose.
const colorScheme = createColorScheme({ storage: createLocalStorage("theme"), global: true })

export { colorScheme }
