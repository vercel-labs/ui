import { vitePreprocess } from "@sveltejs/vite-plugin-svelte"

// TypeScript inside the `.svelte` fixtures, for the Vite plugin and
// svelte-check. The fixtures follow the shared contract, like `<output
// role="status">`, so its accessibility lint stays quiet here.
export default {
  preprocess: vitePreprocess(),
  compilerOptions: {
    warningFilter: (warning) => !warning.code.startsWith("a11y_"),
  },
}
